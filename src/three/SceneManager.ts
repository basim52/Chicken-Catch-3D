import * as THREE from 'three';
import { ChickenData, FloatingText, CameraViewMode } from '../types';
import { createChickenMesh, Chicken3DMeshGroup, CHICKEN_SPECS } from './Chicken3D';

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

    // 6. Add Particle & Text Groups
    this.scene.add(this.particleGroup);
    this.scene.add(this.floatingTextGroup);

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

  // Raycasting for click / touch interaction
  public checkClick(screenX: number, screenY: number, megaNetActive: boolean): string | null {
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
