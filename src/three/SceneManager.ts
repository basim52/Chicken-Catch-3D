import * as THREE from 'three';
import { ChickenData, FloatingText, CameraViewMode } from '../types';
import { createChickenMesh, Chicken3DMeshGroup, CHICKEN_SPECS } from './Chicken3D';
import { soundManager } from '../audio/soundManager';

export class SceneManager {
  private container: HTMLDivElement;
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer: THREE.WebGLRenderer;

  private chickenMeshes: Map<string, Chicken3DMeshGroup> = new Map();
  private particleGroup: THREE.Group = new THREE.Group();
  private floatingTextGroup: THREE.Group = new THREE.Group();
  private coopMesh: THREE.Group = new THREE.Group();
  private cornDecoyMesh: THREE.Group | null = null;
  private windmillBlades: THREE.Group | null = null;

  // First-person 3D Hunter's Rifle & Hands
  private gunGroup: THREE.Group = new THREE.Group();
  private muzzleFlashGroup: THREE.Group = new THREE.Group();
  private muzzleLight: THREE.PointLight = new THREE.PointLight(0xFFAA00, 0, 8);
  private gunRecoilZ = 0;
  private gunRecoilRotX = 0;
  private muzzleFlashTimer = 0;
  private currentAimYaw = 0;
  private currentAimPitch = 0;
  private aimTime = 0;
  private lastPointerScreenPos: { x: number; y: number } | null = null;
  private laserBeamMesh: THREE.Mesh | null = null;
  private laserDotMesh: THREE.Mesh | null = null;

  private raycaster = new THREE.Raycaster();
  private mouse = new THREE.Vector2();

  private activeParticles: Array<{
    mesh: THREE.Mesh;
    velocity: THREE.Vector3;
    rotationSpeed: THREE.Vector3;
    life: number;
    maxLife: number;
  }> = [];

  private floatingTexts: Array<{
    mesh: THREE.Sprite;
    velocity: THREE.Vector3;
    life: number;
    maxLife: number;
  }> = [];

  private currentCameraMode: CameraViewMode = 'default';

  constructor(container: HTMLDivElement) {
    this.container = container;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // Sky blue
    this.scene.fog = new THREE.FogExp2(0x87ceeb, 0.02);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      200
    );
    this.applyCameraForAspect();

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 4. Lights
    this.setupLights();

    // 5. Environment (Ground, Coop, Fences, Barn, Trees, Windmill)
    this.setupEnvironment();

    // 6. Setup First-Person Hunter's Rifle & Hands
    this.setupHunterRifle();

    // 7. Add Particle & Text Groups
    this.scene.add(this.particleGroup);
    this.scene.add(this.floatingTextGroup);
    this.scene.add(this.camera);

    // Resize Handler
    window.addEventListener('resize', this.onResize);
  }

  private setupLights() {
    // Ambient Light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    // Directional Sunlight with Shadows
    const sunLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    sunLight.position.set(12, 18, 10);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 50;
    sunLight.shadow.camera.left = -15;
    sunLight.shadow.camera.right = 15;
    sunLight.shadow.camera.top = 15;
    sunLight.shadow.camera.bottom = -15;
    this.scene.add(sunLight);

    // Hemisphere Light (Sky vs Ground color)
    const hemiLight = new THREE.HemisphereLight(0x87ceeb, 0x4d7c0f, 0.4);
    this.scene.add(hemiLight);
  }

  private setupEnvironment() {
    // A. Ground Plane
    const groundGeo = new THREE.PlaneGeometry(30, 30);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x558b2f, // Lush farm green
      roughness: 0.8,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // Dirt Path leading to Coop
    const pathGeo = new THREE.PlaneGeometry(4, 16);
    const pathMat = new THREE.MeshStandardMaterial({
      color: 0x8d6e63, // Earthy brown
      roughness: 0.9,
    });
    const path = new THREE.Mesh(pathGeo, pathMat);
    path.rotation.x = -Math.PI / 2;
    path.position.set(5, 0.01, -2);
    path.receiveShadow = true;
    this.scene.add(path);

    // B. Chicken Coop / Cage (Target Location: 5, 0, -4)
    this.buildCoop();

    // C. Farm Fences around perimeter
    this.buildFences();

    // D. Decorative Barn in Background
    this.buildBarn();

    // E. Windmill
    this.buildWindmill();

    // F. Trees & Hay Bales
    this.buildSceneryProps();
  }

  private buildCoop() {
    const coopGroup = new THREE.Group();
    coopGroup.position.set(5, 0, -4);

    const woodMat = new THREE.MeshStandardMaterial({ color: 0x795548, roughness: 0.7 });
    const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.8 });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x78909c, metalness: 0.7, roughness: 0.3 });

    // Main Cage Base & Structure
    const baseGeo = new THREE.BoxGeometry(2.4, 1.8, 2.4);
    const baseMesh = new THREE.Mesh(baseGeo, darkWoodMat);
    baseMesh.position.y = 0.9;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    coopGroup.add(baseMesh);

    // Cage Bars (Metal grates on front/sides)
    for (let x = -0.9; x <= 0.9; x += 0.3) {
      const barGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.6);
      const bar = new THREE.Mesh(barGeo, metalMat);
      bar.position.set(x, 0.9, 1.21);
      coopGroup.add(bar);
    }

    // Roof (Pyramid/Prism shape)
    const roofGeo = new THREE.ConeGeometry(2.0, 1.2, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roofMat = new THREE.MeshStandardMaterial({ color: 0xb71c1c, roughness: 0.6 }); // Red roof
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 2.4;
    roof.castShadow = true;
    coopGroup.add(roof);

    // "COOP / القفص" Sign on top
    const signGeo = new THREE.BoxGeometry(1.2, 0.4, 0.08);
    const signMat = new THREE.MeshStandardMaterial({ color: 0xffecb3 });
    const sign = new THREE.Mesh(signGeo, signMat);
    sign.position.set(0, 1.9, 1.25);
    coopGroup.add(sign);

    this.coopMesh = coopGroup;
    this.scene.add(coopGroup);
  }

  private buildFences() {
    const fenceMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.8 });

    // Boundary posts around farm
    const positions = [
      { x: -10, z: -8, rot: 0 },
      { x: -10, z: 0, rot: 0 },
      { x: -10, z: 8, rot: 0 },
      { x: 10, z: -8, rot: 0 },
      { x: 10, z: 0, rot: 0 },
      { x: 10, z: 8, rot: 0 },
    ];

    positions.forEach((p) => {
      const postGeo = new THREE.BoxGeometry(0.2, 1.2, 0.2);
      const post = new THREE.Mesh(postGeo, fenceMat);
      post.position.set(p.x, 0.6, p.z);
      post.castShadow = true;
      this.scene.add(post);

      const railGeo = new THREE.BoxGeometry(0.1, 0.15, 8);
      const rail = new THREE.Mesh(railGeo, fenceMat);
      rail.position.set(p.x, 0.8, p.z);
      rail.castShadow = true;
      this.scene.add(rail);
    });
  }

  private buildBarn() {
    const barnGroup = new THREE.Group();
    barnGroup.position.set(-8, 0, -10);

    const redMat = new THREE.MeshStandardMaterial({ color: 0xc62828, roughness: 0.6 });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xeceff1, roughness: 0.5 });

    // Barn Main Building
    const bodyGeo = new THREE.BoxGeometry(5, 4, 6);
    const body = new THREE.Mesh(bodyGeo, redMat);
    body.position.y = 2;
    body.castShadow = true;
    barnGroup.add(body);

    // White Barn Door Frame
    const doorGeo = new THREE.BoxGeometry(2, 2.5, 0.1);
    const door = new THREE.Mesh(doorGeo, whiteMat);
    door.position.set(0, 1.25, 3.01);
    barnGroup.add(door);

    this.scene.add(barnGroup);
  }

  private buildWindmill() {
    const windmillGroup = new THREE.Group();
    windmillGroup.position.set(-10, 0, 4);

    const towerGeo = new THREE.CylinderGeometry(0.8, 1.4, 7, 12);
    const towerMat = new THREE.MeshStandardMaterial({ color: 0xcf1b1b, roughness: 0.7 });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.y = 3.5;
    tower.castShadow = true;
    windmillGroup.add(tower);

    // Blades group
    const blades = new THREE.Group();
    blades.position.set(0, 6.5, 0.9);

    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    for (let i = 0; i < 4; i++) {
      const bladeGeo = new THREE.BoxGeometry(0.3, 3, 0.05);
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.rotation.z = (i * Math.PI) / 2;
      blades.add(blade);
    }
    windmillGroup.add(blades);
    this.windmillBlades = blades;

    this.scene.add(windmillGroup);
  }

  private buildSceneryProps() {
    // Trees
    const treePositions = [
      { x: -6, z: 6 },
      { x: 8, z: 6 },
      { x: -11, z: -3 },
    ];

    treePositions.forEach((tp) => {
      const tree = new THREE.Group();
      tree.position.set(tp.x, 0, tp.z);

      const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, 2);
      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x5d4037 });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1;
      trunk.castShadow = true;
      tree.add(trunk);

      const leavesGeo = new THREE.DodecahedronGeometry(1.2);
      const leavesMat = new THREE.MeshStandardMaterial({ color: 0x2e7d32, roughness: 0.6 });
      const leaves = new THREE.Mesh(leavesGeo, leavesMat);
      leaves.position.y = 2.4;
      leaves.castShadow = true;
      tree.add(leaves);

      this.scene.add(tree);
    });

    // Hay Bales
    const hayPositions = [
      { x: 2, z: -3 },
      { x: 2.8, z: -3.2 },
      { x: 2.4, z: -2.3 },
    ];
    const hayMat = new THREE.MeshStandardMaterial({ color: 0xfbc02d, roughness: 0.9 });
    hayPositions.forEach((hp, idx) => {
      const hayGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.8, 12);
      const hay = new THREE.Mesh(hayGeo, hayMat);
      hay.rotation.z = Math.PI / 2;
      hay.position.set(hp.x, 0.4 + (idx === 2 ? 0.7 : 0), hp.z);
      hay.castShadow = true;
      this.scene.add(hay);
    });
  }

  private currentWeaponId: string = 'classic_rifle';
  private currentLaserId: string = 'red_laser';

  public updateEquippedCosmetics(weaponId: string, laserId: string) {
    this.currentWeaponId = weaponId;
    this.currentLaserId = laserId;

    if (this.gunGroup) {
      this.camera.remove(this.gunGroup);
      if (this.laserDotMesh) {
        this.scene.remove(this.laserDotMesh);
      }
    }

    this.setupHunterRifle(weaponId, laserId);
  }

  // Construct First-Person 3D Hunter's Rifle & Hands attached to Camera
  private setupHunterRifle(weaponId: string = 'classic_rifle', laserId: string = 'red_laser') {
    this.gunGroup = new THREE.Group();

    // Default resting position relative to camera (bottom-right of view)
    this.gunGroup.position.set(0.26, -0.32, -0.62);
    this.gunGroup.rotation.set(0.04, -0.12, 0.03);

    let laserHex = 0xFF0000;
    if (laserId === 'green_laser') laserHex = 0x00FF44;
    else if (laserId === 'cyan_plasma_laser') laserHex = 0x00F0FF;

    // Determine materials based on weapon
    let barrelColor = 0x27272A;
    let woodColor = 0x7C3F00;
    let receiverColor = 0x18181B;
    let plateColor = 0xD97706;
    let metalnessVal = 0.88;
    let roughnessVal = 0.2;

    if (weaponId === 'golden_rifle') {
      barrelColor = 0xFFD700;
      woodColor = 0xF59E0B;
      receiverColor = 0xFBBF24;
      plateColor = 0xE11D48; // Ruby trigger accent
      metalnessVal = 0.95;
      roughnessVal = 0.1;
    } else if (weaponId === 'camo_rifle') {
      barrelColor = 0x1F2937;
      woodColor = 0x3F6212; // Olive camo
      receiverColor = 0x166534;
      plateColor = 0x854D0E;
      metalnessVal = 0.6;
      roughnessVal = 0.5;
    } else if (weaponId === 'sniper_rifle') {
      barrelColor = 0x0F172A;
      woodColor = 0x1E293B; // Dark tactical
      receiverColor = 0x09090B;
      plateColor = 0x0284C7;
      metalnessVal = 0.9;
      roughnessVal = 0.15;
    } else if (weaponId === 'plasma_blaster') {
      barrelColor = 0x0284C7;
      woodColor = 0x0F172A;
      receiverColor = 0x0369A1;
      plateColor = 0x06B6D4;
      metalnessVal = 0.9;
      roughnessVal = 0.1;
    }

    const barrelMat = new THREE.MeshStandardMaterial({
      color: barrelColor,
      metalness: metalnessVal,
      roughness: roughnessVal,
    });

    const woodMat = new THREE.MeshStandardMaterial({
      color: woodColor,
      roughness: weaponId === 'golden_rifle' ? 0.15 : 0.45,
      metalness: weaponId === 'golden_rifle' ? 0.9 : 0.1,
    });

    const receiverMat = new THREE.MeshStandardMaterial({
      color: receiverColor,
      metalness: metalnessVal,
      roughness: roughnessVal,
    });

    const plateMat = new THREE.MeshStandardMaterial({
      color: plateColor,
      metalness: 0.85,
      roughness: 0.25,
    });

    // 1. Double Steel / Energy Barrel
    const topBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.018, 0.82, 12),
      barrelMat
    );
    topBarrel.rotation.x = Math.PI / 2;
    topBarrel.position.set(0, 0.02, -0.4);
    this.gunGroup.add(topBarrel);

    const bottomBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.016, 0.018, 0.82, 12),
      barrelMat
    );
    bottomBarrel.rotation.x = Math.PI / 2;
    bottomBarrel.position.set(0, -0.015, -0.4);
    this.gunGroup.add(bottomBarrel);

    // If Sniper Rifle: Add Optical Sight Scope on top
    if (weaponId === 'sniper_rifle') {
      const scopeTubeMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, metalness: 0.9, roughness: 0.1 });
      const scopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.25, 16), scopeTubeMat);
      scopeTube.rotation.x = Math.PI / 2;
      scopeTube.position.set(0, 0.065, -0.15);
      this.gunGroup.add(scopeTube);

      const scopeLensMat = new THREE.MeshStandardMaterial({ color: 0x38BDF8, metalness: 0.9, roughness: 0.0, transparent: true, opacity: 0.75 });
      const scopeLens = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.01, 16), scopeLensMat);
      scopeLens.rotation.x = Math.PI / 2;
      scopeLens.position.set(0, 0.065, -0.275);
      this.gunGroup.add(scopeLens);
    }

    // If Plasma Blaster: Add glowing energy rings around barrel
    if (weaponId === 'plasma_blaster') {
      const plasmaRingMat = new THREE.MeshStandardMaterial({ color: 0x06B6D4, emissive: 0x0891B2, emissiveIntensity: 0.8 });
      for (let i = 0; i < 4; i++) {
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.026, 0.005, 8, 16), plasmaRingMat);
        ring.position.set(0, 0.002, -0.2 - i * 0.12);
        this.gunGroup.add(ring);
      }
    }

    // Gold Front Sight Bead at barrel tip
    const sightMat = new THREE.MeshStandardMaterial({ color: laserHex, metalness: 0.9, roughness: 0.1 });
    const sightBead = new THREE.Mesh(new THREE.SphereGeometry(0.008, 8, 8), sightMat);
    sightBead.position.set(0, 0.042, -0.8);
    this.gunGroup.add(sightBead);

    // 2. Wooden Fore-end & Stock
    const foreEnd = new THREE.Mesh(
      new THREE.CylinderGeometry(0.03, 0.032, 0.32, 12, 1, false, 0, Math.PI),
      woodMat
    );
    foreEnd.rotation.x = Math.PI / 2;
    foreEnd.rotation.z = Math.PI; // Bottom side grip
    foreEnd.position.set(0, -0.01, -0.35);
    this.gunGroup.add(foreEnd);

    // Receiver
    const receiver = new THREE.Mesh(
      new THREE.BoxGeometry(0.055, 0.08, 0.22),
      receiverMat
    );
    receiver.position.set(0, 0.005, -0.08);
    this.gunGroup.add(receiver);

    // Side Plate
    const engravePlate = new THREE.Mesh(new THREE.BoxGeometry(0.058, 0.04, 0.12), plateMat);
    engravePlate.position.set(0, 0.005, -0.08);
    this.gunGroup.add(engravePlate);

    // Trigger Guard & Trigger
    const triggerGuard = new THREE.Mesh(
      new THREE.TorusGeometry(0.025, 0.004, 8, 16, Math.PI),
      receiverMat
    );
    triggerGuard.rotation.y = Math.PI / 2;
    triggerGuard.position.set(0, -0.045, -0.06);
    this.gunGroup.add(triggerGuard);

    const trigger = new THREE.Mesh(
      new THREE.BoxGeometry(0.004, 0.02, 0.01),
      plateMat
    );
    trigger.position.set(0, -0.038, -0.06);
    trigger.rotation.x = -0.3;
    this.gunGroup.add(trigger);

    // Rear Stock angled back towards player
    const stock = new THREE.Mesh(
      new THREE.BoxGeometry(0.048, 0.09, 0.32),
      woodMat
    );
    stock.position.set(0, -0.04, 0.15);
    stock.rotation.x = -0.15;
    this.gunGroup.add(stock);

    // Rubber Butt Pad at rear of stock
    const padMat = new THREE.MeshStandardMaterial({ color: 0x09090B, roughness: 0.9 });
    const buttPad = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.1, 0.03),
      padMat
    );
    buttPad.position.set(0, -0.062, 0.31);
    buttPad.rotation.x = -0.15;
    this.gunGroup.add(buttPad);

    // 3. Hunter's Hands & Coat Sleeves
    const gloveMat = new THREE.MeshStandardMaterial({
      color: weaponId === 'golden_rifle' ? 0x78350F : 0x9A3412,
      roughness: 0.7,
    });
    const sleeveMat = new THREE.MeshStandardMaterial({
      color: weaponId === 'plasma_blaster' ? 0x0369A1 : weaponId === 'camo_rifle' ? 0x166534 : 0x166534,
      roughness: 0.8,
    });

    // RIGHT HAND (holding grip & trigger)
    const rightHandGroup = new THREE.Group();
    const rightGlove = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 12, 12),
      gloveMat
    );
    rightGlove.scale.set(0.8, 1.1, 1.2);
    rightGlove.position.set(0.01, -0.05, 0.01);
    rightHandGroup.add(rightGlove);

    for (let i = 0; i < 4; i++) {
      const finger = new THREE.Mesh(
        new THREE.CylinderGeometry(0.009, 0.009, 0.05, 8),
        gloveMat
      );
      finger.rotation.z = Math.PI / 2 + 0.2;
      finger.rotation.x = 0.3;
      finger.position.set(-0.02, -0.035 - i * 0.012, -0.03 + i * 0.015);
      rightHandGroup.add(finger);
    }

    const rightSleeve = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.07, 0.45, 12),
      sleeveMat
    );
    rightSleeve.rotation.x = 0.8;
    rightSleeve.rotation.y = -0.2;
    rightSleeve.position.set(0.04, -0.18, 0.18);
    rightHandGroup.add(rightSleeve);

    this.gunGroup.add(rightHandGroup);

    // LEFT HAND (supporting fore-end wood under barrel)
    const leftHandGroup = new THREE.Group();
    const leftGlove = new THREE.Mesh(
      new THREE.SphereGeometry(0.04, 12, 12),
      gloveMat
    );
    leftGlove.scale.set(1.1, 0.8, 1.3);
    leftGlove.position.set(-0.01, -0.04, -0.34);
    leftHandGroup.add(leftGlove);

    for (let i = 0; i < 4; i++) {
      const finger = new THREE.Mesh(
        new THREE.CylinderGeometry(0.009, 0.009, 0.055, 8),
        gloveMat
      );
      finger.rotation.z = -Math.PI / 2 - 0.2;
      finger.position.set(0.025, -0.03 - i * 0.01, -0.38 + i * 0.02);
      leftHandGroup.add(finger);
    }

    const leftSleeve = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.07, 0.45, 12),
      sleeveMat
    );
    leftSleeve.rotation.x = 0.7;
    leftSleeve.rotation.y = 0.3;
    leftSleeve.position.set(-0.08, -0.19, -0.15);
    leftHandGroup.add(leftSleeve);

    this.gunGroup.add(leftHandGroup);

    // 4. Muzzle Flash & Light (At barrel tip)
    this.muzzleFlashGroup = new THREE.Group();
    this.muzzleFlashGroup.position.set(0, 0.02, -0.82);

    const flashMat = new THREE.MeshBasicMaterial({
      color: weaponId === 'plasma_blaster' ? 0x00F0FF : 0xFFD700,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const flashMesh = new THREE.Mesh(
      new THREE.ConeGeometry(0.12, 0.35, 8),
      flashMat
    );
    flashMesh.rotation.x = -Math.PI / 2;
    flashMesh.position.z = -0.17;
    this.muzzleFlashGroup.add(flashMesh);

    const innerFlashMat = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0,
      depthWrite: false,
    });
    const innerFlashMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 8, 8),
      innerFlashMat
    );
    innerFlashMesh.position.z = -0.05;
    this.muzzleFlashGroup.add(innerFlashMesh);

    this.muzzleLight = new THREE.PointLight(weaponId === 'plasma_blaster' ? 0x00F0FF : 0xFF8C00, 0, 10);
    this.muzzleFlashGroup.add(this.muzzleLight);

    this.gunGroup.add(this.muzzleFlashGroup);

    // 5. Laser Sight Module Under Barrel
    const laserBoxMat = new THREE.MeshStandardMaterial({ color: 0x18181B, metalness: 0.9, roughness: 0.2 });
    const laserBox = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, 0.08), laserBoxMat);
    laserBox.position.set(0, -0.038, -0.5);
    this.gunGroup.add(laserBox);

    // Laser Lens Dot
    const laserLensMat = new THREE.MeshBasicMaterial({ color: laserHex });
    const laserLens = new THREE.Mesh(new THREE.SphereGeometry(0.006, 8, 8), laserLensMat);
    laserLens.position.set(0, -0.038, -0.542);
    this.gunGroup.add(laserLens);

    // Laser Beam Line
    const laserBeamMat = new THREE.MeshBasicMaterial({
      color: laserHex,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    this.laserBeamMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.002, 0.003, 20, 8),
      laserBeamMat
    );
    this.laserBeamMesh.rotation.x = -Math.PI / 2;
    this.laserBeamMesh.position.set(0, -0.038, -10.5);
    this.gunGroup.add(this.laserBeamMesh);

    // Laser Ground Target Dot
    const laserDotMat = new THREE.MeshBasicMaterial({
      color: laserHex,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    this.laserDotMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.03, 0.08, 16),
      laserDotMat
    );
    this.laserDotMesh.rotation.x = -Math.PI / 2;
    this.scene.add(this.laserDotMesh);

    // Attach to Camera
    this.camera.add(this.gunGroup);
  }

  // Fire Hunting Rifle: Play sound, trigger recoil animation & muzzle flash
  public triggerRifleShoot() {
    // Play realistic gunshot blast audio
    soundManager.playGunshot();

    // Recoil forces
    this.gunRecoilZ = 0.16;
    this.gunRecoilRotX = 0.22;
    this.muzzleFlashTimer = 0.09;

    // Spawn Smoke Particles from Barrel Tip
    const tipWorldPos = new THREE.Vector3();
    this.muzzleFlashGroup.getWorldPosition(tipWorldPos);

    for (let i = 0; i < 5; i++) {
      const smokeGeo = new THREE.DodecahedronGeometry(0.08 + Math.random() * 0.06, 0);
      const smokeMat = new THREE.MeshBasicMaterial({
        color: 0xE4E4E7,
        transparent: true,
        opacity: 0.65,
      });
      const smokeMesh = new THREE.Mesh(smokeGeo, smokeMat);
      smokeMesh.position.copy(tipWorldPos);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 0.8,
        1.2 + Math.random() * 1.0,
        (Math.random() - 0.5) * 0.8
      );

      this.particleGroup.add(smokeMesh);
      this.activeParticles.push({
        mesh: smokeMesh,
        velocity: vel,
        rotationSpeed: new THREE.Vector3(Math.random(), Math.random(), Math.random()),
        life: 0,
        maxLife: 0.5 + Math.random() * 0.3,
      });
    }
  }

  public updateCameraPosition(mode: CameraViewMode) {
    this.currentCameraMode = mode;
    this.applyCameraForAspect();
  }

  public applyCameraForAspect() {
    const width = this.container ? this.container.clientWidth : window.innerWidth;
    const height = this.container ? this.container.clientHeight : window.innerHeight;
    const aspect = width / Math.max(1, height);

    this.camera.aspect = aspect;

    if (this.currentCameraMode === 'top_down') {
      this.camera.fov = aspect < 1.0 ? 75 : 60;
      this.camera.position.set(0, aspect < 1.0 ? 20 : 16, 0.1);
      this.camera.lookAt(0, 0, 0);
    } else if (this.currentCameraMode === 'close') {
      this.camera.fov = aspect < 1.0 ? 68 : 55;
      if (aspect < 1.0) {
        this.camera.position.set(0.5, 7, 8);
      } else {
        this.camera.position.set(0, 5, 6);
      }
      this.camera.lookAt(1, 0.5, -2);
    } else {
      // Default view mode
      if (aspect < 1.0) {
        // Mobile portrait mode: Elevate & pull back camera + increase FOV so full farm & coop on right fit
        this.camera.fov = 72;
        this.camera.position.set(0.5, 11, 13.5);
        this.camera.lookAt(1.2, 0.5, -1.8);
      } else {
        // Landscape / Desktop mode
        this.camera.fov = 60;
        this.camera.position.set(0, 8, 10);
        this.camera.lookAt(1, 0.5, -2);
      }
    }

    this.camera.updateProjectionMatrix();
  }

  // Update logic called on every render frame
  public update(chickens: ChickenData[], delta: number, cornDecoyPos: { x: number; y: number; z: number } | null) {
    // 1. Sync Chickens state to 3D meshes
    const currentChickenIds = new Set<string>();

    chickens.forEach((c) => {
      currentChickenIds.add(c.id);

      let meshGroup = this.chickenMeshes.get(c.id);
      if (!meshGroup) {
        // Create new chicken 3D mesh
        meshGroup = createChickenMesh(c.type);
        this.chickenMeshes.set(c.id, meshGroup);
        this.scene.add(meshGroup.group);
      }

      // Position & Rotation
      meshGroup.group.position.set(c.position.x, c.position.y, c.position.z);

      // Facing Direction
      if (c.target) {
        const dx = c.target.x - c.position.x;
        const dz = c.target.z - c.position.z;
        if (Math.abs(dx) > 0.01 || Math.abs(dz) > 0.01) {
          meshGroup.group.rotation.y = Math.atan2(dx, dz);
        }
      }

      // Waddling & Wing Flapping Animation
      if (!c.caught && !c.escaped) {
        meshGroup.leftLeg.rotation.x = Math.sin(c.waddlePhase) * 0.6;
        meshGroup.rightLeg.rotation.x = -Math.sin(c.waddlePhase) * 0.6;
        meshGroup.leftWing.rotation.z = Math.sin(c.waddlePhase * 2) * 0.4;
        meshGroup.rightWing.rotation.z = -Math.sin(c.waddlePhase * 2) * 0.4;
        meshGroup.group.position.y = c.position.y + Math.abs(Math.sin(c.waddlePhase * 2)) * 0.08;
      }

      // Hide or show mesh based on caught state
      meshGroup.group.visible = !c.caught && !c.escaped;
    });

    // Remove obsolete chicken meshes
    this.chickenMeshes.forEach((meshGroup, id) => {
      if (!currentChickenIds.has(id)) {
        this.scene.remove(meshGroup.group);
        this.chickenMeshes.delete(id);
      }
    });

    // 2. Windmill animation
    if (this.windmillBlades) {
      this.windmillBlades.rotation.z += delta * 1.2;
    }

    // 3. Corn Decoy Model Sync
    if (cornDecoyPos && !this.cornDecoyMesh) {
      this.spawnCornDecoyMesh(cornDecoyPos);
    } else if (!cornDecoyPos && this.cornDecoyMesh) {
      this.scene.remove(this.cornDecoyMesh);
      this.cornDecoyMesh = null;
    }

    // 4. Update Particle Physics
    for (let i = this.activeParticles.length - 1; i >= 0; i--) {
      const p = this.activeParticles[i];
      p.life += delta;
      p.mesh.position.addScaledVector(p.velocity, delta);
      p.mesh.rotation.x += p.rotationSpeed.x * delta;
      p.mesh.rotation.y += p.rotationSpeed.y * delta;
      p.velocity.y -= 3.0 * delta; // gravity

      const opacity = 1 - p.life / p.maxLife;
      (p.mesh.material as THREE.MeshBasicMaterial).opacity = Math.max(0, opacity);

      if (p.life >= p.maxLife) {
        this.particleGroup.remove(p.mesh);
        this.activeParticles.splice(i, 1);
      }
    }

    // 5. Update Floating Text Sprites
    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.life += delta;
      ft.mesh.position.addScaledVector(ft.velocity, delta);

      const scale = Math.sin((ft.life / ft.maxLife) * Math.PI) * 1.5;
      ft.mesh.scale.set(scale, scale, 1);

      if (ft.life >= ft.maxLife) {
        this.floatingTextGroup.remove(ft.mesh);
        this.floatingTexts.splice(i, 1);
      }
    }

    // 6. Update First-Person Hunter Gun Recoil, Tracking & Muzzle Flash
    if (this.gunGroup) {
      if (this.currentCameraMode === 'top_down') {
        this.gunGroup.visible = false;
      } else {
        this.gunGroup.visible = true;

        // Smoothly decay recoil displacement & barrel kick back to zero
        this.gunRecoilZ = THREE.MathUtils.lerp(this.gunRecoilZ, 0, delta * 18);
        this.gunRecoilRotX = THREE.MathUtils.lerp(this.gunRecoilRotX, 0, delta * 18);

        // Default fallback pointer to center of viewport if not set yet
        if (!this.lastPointerScreenPos && this.container) {
          const rect = this.container.getBoundingClientRect();
          this.lastPointerScreenPos = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };
        }

        // Calculate Target Aiming Position tracking mouse / touch pointer
        let targetPos: THREE.Vector3 | null = null;
        let targetYaw = 0;
        let targetPitch = 0;

        if (this.lastPointerScreenPos && this.container) {
          const rect = this.container.getBoundingClientRect();
          const normX = THREE.MathUtils.clamp(((this.lastPointerScreenPos.x - rect.left) / rect.width) * 2 - 1, -1, 1);
          const normY = THREE.MathUtils.clamp(-((this.lastPointerScreenPos.y - rect.top) / rect.height) * 2 + 1, -1, 1);

          this.mouse.set(normX, normY);
          this.raycaster.setFromCamera(this.mouse, this.camera);

          // Transform ray direction into camera local space for exact angular yaw & pitch swiveling
          const localRayDir = this.raycaster.ray.direction.clone().transformDirection(this.camera.matrixWorldInverse);
          targetYaw = Math.atan2(localRayDir.x, -localRayDir.z);
          targetPitch = Math.asin(THREE.MathUtils.clamp(localRayDir.y, -0.99, 0.99));

          // Raycast to place red laser dot in 3D ground plane
          const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
          const targetPoint = new THREE.Vector3();
          if (this.raycaster.ray.intersectPlane(groundPlane, targetPoint)) {
            targetPos = targetPoint;
          }
        }

        if (targetPos && this.laserDotMesh) {
          this.laserDotMesh.visible = true;
          this.laserDotMesh.position.set(targetPos.x, Math.max(0.05, targetPos.y + 0.02), targetPos.z);
        } else if (this.laserDotMesh) {
          this.laserDotMesh.visible = false;
        }

        // Clamp targeting angles to natural arm & wrist motion bounds
        targetYaw = THREE.MathUtils.clamp(targetYaw, -0.85, 0.85);
        targetPitch = THREE.MathUtils.clamp(targetPitch, -0.45, 0.55);

        // Subtle natural breathing sway
        this.aimTime += delta;
        const swayX = Math.sin(this.aimTime * 2.0) * 0.004;
        const swayY = Math.cos(this.aimTime * 3.0) * 0.003;

        // Responsive lerp to match pointer swiveling
        this.currentAimYaw = THREE.MathUtils.lerp(this.currentAimYaw, targetYaw, delta * 25);
        this.currentAimPitch = THREE.MathUtils.lerp(this.currentAimPitch, targetPitch, delta * 25);

        const baseX = 0.24;
        const baseY = -0.30;
        const baseZ = -0.60;

        this.gunGroup.position.set(
          baseX + this.currentAimYaw * 0.35 + swayX,
          baseY + this.currentAimPitch * 0.25 + swayY - this.gunRecoilZ * 0.15,
          baseZ + this.gunRecoilZ
        );
        this.gunGroup.rotation.set(
          0.04 + this.gunRecoilRotX + this.currentAimPitch * 1.0,
          -0.12 + this.currentAimYaw * 1.0,
          0.03 - this.currentAimYaw * 0.15
        );

        // Muzzle Flash animation
        if (this.muzzleFlashTimer > 0) {
          this.muzzleFlashTimer -= delta;
          this.muzzleLight.intensity = Math.min(10, this.muzzleFlashTimer * 100);
          this.muzzleFlashGroup.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              (child.material as THREE.MeshBasicMaterial).opacity = Math.min(1, this.muzzleFlashTimer * 14);
            }
          });
        } else {
          this.muzzleLight.intensity = 0;
          this.muzzleFlashGroup.traverse((child) => {
            if (child instanceof THREE.Mesh && child.material) {
              (child.material as THREE.MeshBasicMaterial).opacity = 0;
            }
          });
        }
      }
    }

    // Render Scene
    this.renderer.render(this.scene, this.camera);
  }

  private spawnCornDecoyMesh(pos: { x: number; y: number; z: number }) {
    const group = new THREE.Group();
    group.position.set(pos.x, 0.4, pos.z);

    const cornGeo = new THREE.CylinderGeometry(0.15, 0.1, 0.8, 10);
    const cornMat = new THREE.MeshStandardMaterial({ color: 0xffd54f, roughness: 0.3 });
    const corn = new THREE.Mesh(cornGeo, cornMat);
    corn.rotation.z = Math.PI / 4;
    group.add(corn);

    const glowLight = new THREE.PointLight(0xffb300, 2, 4);
    group.add(glowLight);

    this.cornDecoyMesh = group;
    this.scene.add(group);
  }

  // Trigger feather explosion when chicken caught
  public spawnFeatherBurst(position: { x: number; y: number; z: number }, type: string) {
    const spec = CHICKEN_SPECS[type as keyof typeof CHICKEN_SPECS] || CHICKEN_SPECS.NORMAL;
    const color = spec.colorHex;

    const count = 18;
    for (let i = 0; i < count; i++) {
      const pGeo = new THREE.PlaneGeometry(0.12, 0.22);
      const pMat = new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.9,
      });
      const pMesh = new THREE.Mesh(pGeo, pMat);
      pMesh.position.set(
        position.x + (Math.random() - 0.5) * 0.4,
        position.y + 0.5 + (Math.random() - 0.5) * 0.4,
        position.z + (Math.random() - 0.5) * 0.4
      );

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 4.5,
        Math.random() * 3 + 2,
        (Math.random() - 0.5) * 4.5
      );

      const rotVel = new THREE.Vector3(
        Math.random() * 8,
        Math.random() * 8,
        Math.random() * 8
      );

      this.particleGroup.add(pMesh);
      this.activeParticles.push({
        mesh: pMesh,
        velocity: vel,
        rotationSpeed: rotVel,
        life: 0,
        maxLife: 0.9 + Math.random() * 0.4,
      });
    }
  }

  // Spawn 3D speech bubble sprite ("💬 ضجااااااج!") directly above the chicken
  public spawnSpeechBubble(text: string, colorHex: string, pos: { x: number; y: number; z: number }) {
    const canvas = document.createElement('canvas');
    canvas.width = 380;
    canvas.height = 180;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // 1. Draw Comic Speech Bubble
      const x = 12, y = 12, w = 356, h = 110, r = 24;

      // Drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.roundRect(x + 4, y + 4, w, h, r);
      ctx.fill();

      // Bubble background & stroke
      ctx.fillStyle = '#FFFFFF';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 8;

      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.lineTo(x + w - r, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + r);
      ctx.lineTo(x + w, y + h - r);
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      // Pointer Tail pointing down at chicken
      ctx.lineTo(w / 2 + 25, y + h);
      ctx.lineTo(w / 2, y + h + 38);
      ctx.lineTo(w / 2 - 25, y + h);
      ctx.lineTo(x + r, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - r);
      ctx.lineTo(x, y + r);
      ctx.quadraticCurveTo(x, y, x + r, y);
      ctx.closePath();

      ctx.fill();
      ctx.stroke();

      // 2. Bubble Text
      ctx.fillStyle = colorHex;
      ctx.font = 'black 48px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, w / 2 + 10, y + h / 2);
    }

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(pos.x, pos.y + 1.4, pos.z);
    sprite.scale.set(2.2, 1.1, 1);

    this.floatingTextGroup.add(sprite);
    this.floatingTexts.push({
      mesh: sprite,
      velocity: new THREE.Vector3(0, 1.5, 0),
      life: 0,
      maxLife: 1.2,
    });
  }

  // Spawn 3D text notification (+10, +30, ESCAPED)
  public spawnFloatingText(text: string, colorHex: string, pos: { x: number; y: number; z: number }) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = colorHex;
      ctx.font = 'bold 52px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 6;
      ctx.strokeText(text, 128, 64);
      ctx.fillText(text, 128, 64);
    }

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.position.set(pos.x, pos.y + 1.2, pos.z);
    sprite.scale.set(1.5, 0.75, 1);

    this.floatingTextGroup.add(sprite);
    this.floatingTexts.push({
      mesh: sprite,
      velocity: new THREE.Vector3(0, 1.8, 0),
      life: 0,
      maxLife: 1.1,
    });
  }

  public updatePointerPosition(screenX: number, screenY: number) {
    this.lastPointerScreenPos = { x: screenX, y: screenY };
  }

  // Raycasting for click / touch interaction
  public checkClick(screenX: number, screenY: number, megaNetActive: boolean): string | null {
    this.lastPointerScreenPos = { x: screenX, y: screenY };
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((screenX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((screenY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    let closestChickenId: string | null = null;
    let minDistance = Infinity;

    // Radius tolerance for touch input on mobile screens
    const touchToleranceRadius = megaNetActive ? 2.2 : 0.85;

    this.chickenMeshes.forEach((meshGroup, id) => {
      if (!meshGroup.group.visible) return;

      const intersects = this.raycaster.intersectObject(meshGroup.group, true);
      if (intersects.length > 0) {
        if (intersects[0].distance < minDistance) {
          minDistance = intersects[0].distance;
          closestChickenId = id;
        }
      } else {
        // Fallback distance check to make touch tapping generous on mobile screens
        const chickenPos = meshGroup.group.position;
        const ray = this.raycaster.ray;
        const dist = ray.distanceToPoint(chickenPos);
        if (dist < touchToleranceRadius && dist < minDistance) {
          minDistance = dist;
          closestChickenId = id;
        }
      }
    });

    return closestChickenId;
  }

  private onResize = () => {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.renderer.setSize(width, height);
    this.applyCameraForAspect();
  };

  public dispose() {
    window.removeEventListener('resize', this.onResize);
    this.renderer.dispose();
    if (this.renderer.domElement && this.renderer.domElement.parentElement) {
      this.renderer.domElement.parentElement.removeChild(this.renderer.domElement);
    }
  }
}
