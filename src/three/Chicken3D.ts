import * as THREE from 'three';
import { ChickenType, ChickenSpec } from '../types';

export const CHICKEN_SPECS: Record<ChickenType, ChickenSpec> = {
  NORMAL: {
    type: 'NORMAL',
    nameEn: 'Orange Chicken',
    nameAr: 'دجاجة برتقالية',
    points: 10,
    baseSpeed: 2.2,
    clicksRequired: 1,
    colorHex: 0xe67e22,
    scale: 1.0,
    zigzag: false,
    isDanger: false,
    category: 'bird',
  },
  GOLDEN: {
    type: 'GOLDEN',
    nameEn: 'Golden Chicken',
    nameAr: 'دجاجة ذهبية',
    points: 30,
    baseSpeed: 3.8,
    clicksRequired: 1,
    colorHex: 0xffd700,
    scale: 1.15,
    zigzag: false,
    isDanger: false,
    category: 'bird',
  },
  NINJA: {
    type: 'NINJA',
    nameEn: 'Ninja Bird',
    nameAr: 'طائر النينجا',
    points: 50,
    baseSpeed: 3.4,
    clicksRequired: 1,
    colorHex: 0x2c3e50,
    scale: 0.95,
    zigzag: true,
    isDanger: false,
    category: 'bird',
  },
  ROOSTER: {
    type: 'ROOSTER',
    nameEn: 'Giant Rooster',
    nameAr: 'الديك العملاق',
    points: 40,
    baseSpeed: 1.8,
    clicksRequired: 2,
    colorHex: 0xecf0f1,
    scale: 1.4,
    zigzag: false,
    isDanger: false,
    category: 'bird',
  },
  BOMB: {
    type: 'BOMB',
    nameEn: 'Mad Rooster',
    nameAr: 'ديك غاضب (احذر!)',
    points: -20,
    baseSpeed: 2.6,
    clicksRequired: 1,
    colorHex: 0x900c3f,
    scale: 1.1,
    zigzag: true,
    isDanger: true,
    category: 'bird',
  },
  DUCK: {
    type: 'DUCK',
    nameEn: 'Wild Mallard Duck',
    nameAr: 'بطة برية',
    points: 25,
    baseSpeed: 2.8,
    clicksRequired: 1,
    colorHex: 0x16a085,
    scale: 1.1,
    zigzag: false,
    isDanger: false,
    category: 'bird',
  },
  PIGEON: {
    type: 'PIGEON',
    nameEn: 'Wild Pigeon',
    nameAr: 'حمام بري سريع',
    points: 35,
    baseSpeed: 3.6,
    clicksRequired: 1,
    colorHex: 0x7f8c8d,
    scale: 0.85,
    zigzag: true,
    isDanger: false,
    category: 'bird',
  },
  PHEASANT: {
    type: 'PHEASANT',
    nameEn: 'Ring-necked Pheasant',
    nameAr: 'طائر الدراج الملون',
    points: 45,
    baseSpeed: 3.0,
    clicksRequired: 1,
    colorHex: 0xc0392b,
    scale: 1.25,
    zigzag: false,
    isDanger: false,
    category: 'bird',
  },
  TURKEY: {
    type: 'TURKEY',
    nameEn: 'Wild Turkey',
    nameAr: 'ديك رومي ضخم',
    points: 50,
    baseSpeed: 2.0,
    clicksRequired: 2,
    colorHex: 0x6e2c00,
    scale: 1.5,
    zigzag: false,
    isDanger: false,
    category: 'bird',
  },
  EAGLE: {
    type: 'EAGLE',
    nameEn: 'Mountain Eagle',
    nameAr: 'عقاب بري ملكي',
    points: 65,
    baseSpeed: 4.0,
    clicksRequired: 2,
    colorHex: 0x4a235a,
    scale: 1.6,
    zigzag: true,
    isDanger: false,
    category: 'bird',
  },
  RABBIT: {
    type: 'RABBIT',
    nameEn: 'Wild Bunny Rabbit',
    nameAr: 'أرنب بري سريع',
    points: 30,
    baseSpeed: 3.8,
    clicksRequired: 1,
    colorHex: 0xd5f5e3,
    scale: 0.9,
    zigzag: true,
    isDanger: false,
    category: 'animal',
  },
  FOX: {
    type: 'FOX',
    nameEn: 'Swift Red Fox',
    nameAr: 'ثعلب أحمر مكر',
    points: 55,
    baseSpeed: 4.2,
    clicksRequired: 2,
    colorHex: 0xd35400,
    scale: 1.2,
    zigzag: true,
    isDanger: false,
    category: 'animal',
  },
  DEER: {
    type: 'DEER',
    nameEn: 'Forest Stag Deer',
    nameAr: 'غزال بري رشيق',
    points: 75,
    baseSpeed: 3.4,
    clicksRequired: 3,
    colorHex: 0x873600,
    scale: 1.6,
    zigzag: false,
    isDanger: false,
    category: 'animal',
  },
  FALCON: {
    type: 'FALCON',
    nameEn: 'Golden Royal Falcon',
    nameAr: 'صقر أسطوري ذهبي',
    points: 100,
    baseSpeed: 4.8,
    clicksRequired: 2,
    colorHex: 0xf1c40f,
    scale: 1.35,
    zigzag: true,
    isDanger: false,
    category: 'legendary',
  },
};

export interface Chicken3DMeshGroup {
  group: THREE.Group;
  leftWing: THREE.Mesh;
  rightWing: THREE.Mesh;
  leftLeg: THREE.Mesh;
  rightLeg: THREE.Mesh;
  head: THREE.Mesh;
  comb: THREE.Mesh;
  fuseLight?: THREE.PointLight;
}

export function createChickenMesh(type: ChickenType): Chicken3DMeshGroup {
  const spec = CHICKEN_SPECS[type];
  const group = new THREE.Group();

  // Route to dedicated 3D Builders for non-standard birds and animals
  if (type === 'DUCK') return buildDuckMesh(spec, group);
  if (type === 'PIGEON') return buildPigeonMesh(spec, group);
  if (type === 'PHEASANT') return buildPheasantMesh(spec, group);
  if (type === 'TURKEY') return buildTurkeyMesh(spec, group);
  if (type === 'EAGLE' || type === 'FALCON') return buildEagleFalconMesh(type, spec, group);
  if (type === 'RABBIT') return buildRabbitMesh(spec, group);
  if (type === 'FOX') return buildFoxMesh(spec, group);
  if (type === 'DEER') return buildDeerMesh(spec, group);

  // Default Chickens (NORMAL, GOLDEN, NINJA, ROOSTER, BOMB)
  let bodyMat: THREE.Material;
  if (type === 'GOLDEN') {
    bodyMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0x332200,
    });
  } else if (type === 'BOMB') {
    bodyMat = new THREE.MeshStandardMaterial({
      color: 0x900c3f,
      roughness: 0.4,
      emissive: 0x400010,
    });
  } else {
    bodyMat = new THREE.MeshStandardMaterial({
      color: spec.colorHex,
      roughness: 0.5,
    });
  }

  // Body
  const bodyGeo = new THREE.SphereGeometry(0.45, 16, 16);
  bodyGeo.scale(1.0, 0.9, 1.1);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;
  body.receiveShadow = true;
  body.position.y = 0.45;
  group.add(body);

  // Head
  const headGeo = new THREE.SphereGeometry(0.28, 16, 16);
  let headMat = bodyMat;
  if (type === 'NORMAL') {
    headMat = new THREE.MeshStandardMaterial({ color: 0xf1c40f, roughness: 0.5 });
  } else if (type === 'NINJA') {
    headMat = new THREE.MeshStandardMaterial({ color: 0x1a252f, roughness: 0.4 });
  }
  const head = new THREE.Mesh(headGeo, headMat);
  head.castShadow = true;
  head.position.set(0, 0.85, 0.2);
  group.add(head);

  // Beak
  const beakGeo = new THREE.ConeGeometry(0.1, 0.22, 8);
  beakGeo.rotateX(Math.PI / 2);
  const beakMat = new THREE.MeshStandardMaterial({ color: type === 'NINJA' ? 0xffffff : 0xe74c3c, roughness: 0.3 });
  const beak = new THREE.Mesh(beakGeo, beakMat);
  beak.position.set(0, 0.85, 0.46);
  group.add(beak);

  // Eyes
  const eyeGeo = new THREE.SphereGeometry(0.045, 8, 8);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.16, 0.92, 0.36);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.16, 0.92, 0.36);
  group.add(leftEye);
  group.add(rightEye);

  // Comb
  const combGeo = new THREE.BoxGeometry(0.06, 0.18, 0.3);
  const combColor = type === 'NINJA' ? 0x8e44ad : type === 'BOMB' ? 0xff0000 : 0xd63031;
  const combMat = new THREE.MeshStandardMaterial({ color: combColor, roughness: 0.4 });
  const comb = new THREE.Mesh(combGeo, combMat);
  comb.position.set(0, 1.08, 0.15);
  group.add(comb);

  // Wattle
  const wattleGeo = new THREE.SphereGeometry(0.07, 8, 8);
  const wattle = new THREE.Mesh(wattleGeo, combMat);
  wattle.position.set(0, 0.72, 0.4);
  group.add(wattle);

  // Tail
  if (type === 'ROOSTER') {
    const tailGroup = new THREE.Group();
    const tailMat1 = new THREE.MeshStandardMaterial({ color: 0x2980b9, roughness: 0.4 });
    const tailMat2 = new THREE.MeshStandardMaterial({ color: 0x27ae60, roughness: 0.4 });
    for (let i = -2; i <= 2; i++) {
      const featherGeo = new THREE.BoxGeometry(0.05, 0.5, 0.2);
      const feather = new THREE.Mesh(featherGeo, i % 2 === 0 ? tailMat1 : tailMat2);
      feather.rotation.x = -Math.PI / 4;
      feather.rotation.z = i * 0.2;
      feather.position.set(i * 0.08, 0.7, -0.45);
      tailGroup.add(feather);
    }
    group.add(tailGroup);
  } else {
    const tailGeo = new THREE.ConeGeometry(0.12, 0.3, 5);
    tailGeo.rotateX(-Math.PI / 3);
    const tail = new THREE.Mesh(tailGeo, bodyMat);
    tail.position.set(0, 0.55, -0.45);
    group.add(tail);
  }

  // Wings
  const wingGeo = new THREE.BoxGeometry(0.08, 0.25, 0.4);
  const leftWing = new THREE.Mesh(wingGeo, bodyMat);
  leftWing.position.set(-0.44, 0.48, 0);
  const rightWing = new THREE.Mesh(wingGeo, bodyMat);
  rightWing.position.set(0.44, 0.48, 0);
  group.add(leftWing);
  group.add(rightWing);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8);
  const legMat = new THREE.MeshStandardMaterial({ color: 0xf39c12 });
  const leftLeg = new THREE.Mesh(legGeo, legMat);
  leftLeg.position.set(-0.16, 0.15, 0);
  const rightLeg = new THREE.Mesh(legGeo, legMat);
  rightLeg.position.set(0.16, 0.15, 0);
  group.add(leftLeg);
  group.add(rightLeg);

  let fuseLight: THREE.PointLight | undefined;
  if (type === 'BOMB') {
    fuseLight = new THREE.PointLight(0xff3300, 1.5, 2);
    fuseLight.position.set(0, 1.2, 0.15);
    group.add(fuseLight);
  }

  group.scale.set(spec.scale, spec.scale, spec.scale);

  return { group, leftWing, rightWing, leftLeg, rightLeg, head, comb, fuseLight };
}

// ---------------- CUSTOM 3D ANIMAL BUILDERS ----------------

// 1. Wild Mallard Duck Builder (بطة برية)
function buildDuckMesh(spec: ChickenSpec, group: THREE.Group): Chicken3DMeshGroup {
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x5d4037, roughness: 0.5 }); // Brown body
  const headMat = new THREE.MeshStandardMaterial({ color: 0x00897b, metalness: 0.6, roughness: 0.3 }); // Emerald Green head
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White neck ring
  const billMat = new THREE.MeshStandardMaterial({ color: 0xfbc02d, roughness: 0.3 }); // Yellow flat bill
  const legMat = new THREE.MeshStandardMaterial({ color: 0xf57c00, roughness: 0.4 }); // Orange webbed legs

  // Sleek Body
  const bodyGeo = new THREE.SphereGeometry(0.42, 16, 16);
  bodyGeo.scale(0.85, 0.8, 1.3);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.4;
  group.add(body);

  // Green Head
  const headGeo = new THREE.SphereGeometry(0.24, 16, 16);
  const head = new THREE.Mesh(headGeo, headMat);
  head.position.set(0, 0.78, 0.28);
  group.add(head);

  // White Neck Ring
  const ringGeo = new THREE.TorusGeometry(0.22, 0.03, 8, 16);
  ringGeo.rotateX(Math.PI / 2);
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.position.set(0, 0.62, 0.24);
  group.add(ring);

  // Flat Duck Bill
  const billGeo = new THREE.BoxGeometry(0.18, 0.06, 0.26);
  const bill = new THREE.Mesh(billGeo, billMat);
  bill.position.set(0, 0.75, 0.48);
  group.add(bill);

  // Eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const eyeLeft = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
  eyeLeft.position.set(-0.15, 0.82, 0.38);
  const eyeRight = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), eyeMat);
  eyeRight.position.set(0.15, 0.82, 0.38);
  group.add(eyeLeft);
  group.add(eyeRight);

  // Duck Tail
  const tailGeo = new THREE.ConeGeometry(0.12, 0.3, 5);
  tailGeo.rotateX(-Math.PI / 3);
  const tail = new THREE.Mesh(tailGeo, bodyMat);
  tail.position.set(0, 0.52, -0.52);
  group.add(tail);

  // Wings
  const wingMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.6 });
  const wingGeo = new THREE.BoxGeometry(0.06, 0.22, 0.45);
  const leftWing = new THREE.Mesh(wingGeo, wingMat);
  leftWing.position.set(-0.38, 0.44, 0);
  const rightWing = new THREE.Mesh(wingGeo, wingMat);
  rightWing.position.set(0.38, 0.44, 0);
  group.add(leftWing);
  group.add(rightWing);

  // Legs & Webbed Feet
  const legGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.25, 8);
  const leftLeg = new THREE.Mesh(legGeo, legMat);
  leftLeg.position.set(-0.14, 0.12, 0);
  const rightLeg = new THREE.Mesh(legGeo, legMat);
  rightLeg.position.set(0.14, 0.12, 0);
  group.add(leftLeg);
  group.add(rightLeg);

  // Dummy comb mesh to fulfill type interface
  const comb = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.01), bodyMat);
  comb.visible = false;
  group.add(comb);

  group.scale.set(spec.scale, spec.scale, spec.scale);
  return { group, leftWing, rightWing, leftLeg, rightLeg, head, comb };
}

// 2. Wild Pigeon Builder (حمام بري)
function buildPigeonMesh(spec: ChickenSpec, group: THREE.Group): Chicken3DMeshGroup {
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x78909c, roughness: 0.4 }); // Slate Blue
  const neckMat = new THREE.MeshStandardMaterial({ color: 0x8e24aa, metalness: 0.5, roughness: 0.3 }); // Iridescent Purple
  const beakMat = new THREE.MeshStandardMaterial({ color: 0x424242 });

  // Aerodynamic Body
  const bodyGeo = new THREE.SphereGeometry(0.36, 16, 16);
  bodyGeo.scale(0.8, 0.8, 1.2);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.38;
  group.add(body);

  // Iridescent Neck & Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 16), neckMat);
  head.position.set(0, 0.7, 0.22);
  group.add(head);

  // Small Sharp Beak
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.18, 8), beakMat);
  beak.rotation.x = Math.PI / 2;
  beak.position.set(0, 0.68, 0.38);
  group.add(beak);

  // Eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0xd32f2f }); // Red pigeon eyes
  const eyeLeft = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
  eyeLeft.position.set(-0.13, 0.72, 0.3);
  const eyeRight = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 8), eyeMat);
  eyeRight.position.set(0.13, 0.72, 0.3);
  group.add(eyeLeft);
  group.add(eyeRight);

  // Sleek Wings
  const wingGeo = new THREE.BoxGeometry(0.05, 0.2, 0.42);
  const leftWing = new THREE.Mesh(wingGeo, bodyMat);
  leftWing.position.set(-0.32, 0.4, 0);
  const rightWing = new THREE.Mesh(wingGeo, bodyMat);
  rightWing.position.set(0.32, 0.4, 0);
  group.add(leftWing);
  group.add(rightWing);

  // Legs
  const legMat = new THREE.MeshStandardMaterial({ color: 0xe91e63 });
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 8), legMat);
  leftLeg.position.set(-0.12, 0.11, 0);
  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.22, 8), legMat);
  rightLeg.position.set(0.12, 0.11, 0);
  group.add(leftLeg);
  group.add(rightLeg);

  const comb = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.01), bodyMat);
  comb.visible = false;
  group.add(comb);

  group.scale.set(spec.scale, spec.scale, spec.scale);
  return { group, leftWing, rightWing, leftLeg, rightLeg, head, comb };
}

// 3. Ring-necked Pheasant Builder (طائر الدراج الملون)
function buildPheasantMesh(spec: ChickenSpec, group: THREE.Group): Chicken3DMeshGroup {
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.5 }); // Dark mahogany body
  const headMat = new THREE.MeshStandardMaterial({ color: 0x004d40, metalness: 0.7, roughness: 0.2 }); // Deep emerald head
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White neck ring
  const crestMat = new THREE.MeshStandardMaterial({ color: 0xd50000 }); // Red ear tufts

  // Body
  const bodyGeo = new THREE.SphereGeometry(0.4, 16, 16);
  bodyGeo.scale(0.85, 0.85, 1.25);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.42;
  group.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), headMat);
  head.position.set(0, 0.76, 0.26);
  group.add(head);

  // Neck Ring
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 8, 16), ringMat);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(0, 0.62, 0.22);
  group.add(ring);

  // Red Crest Tufts
  const crest = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.08, 0.12), crestMat);
  crest.position.set(0, 0.86, 0.2);
  group.add(crest);

  // Very Long Feathery Tail
  const tailGroup = new THREE.Group();
  const tailMat = new THREE.MeshStandardMaterial({ color: 0xf57f17, roughness: 0.4 });
  for (let i = -1; i <= 1; i++) {
    const feather = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.8), tailMat);
    feather.rotation.x = -0.3;
    feather.rotation.y = i * 0.1;
    feather.position.set(i * 0.06, 0.5, -0.65);
    tailGroup.add(feather);
  }
  group.add(tailGroup);

  // Wings
  const wingMat = new THREE.MeshStandardMaterial({ color: 0xd84315 });
  const wingGeo = new THREE.BoxGeometry(0.06, 0.22, 0.42);
  const leftWing = new THREE.Mesh(wingGeo, wingMat);
  leftWing.position.set(-0.38, 0.44, 0);
  const rightWing = new THREE.Mesh(wingGeo, wingMat);
  rightWing.position.set(0.38, 0.44, 0);
  group.add(leftWing);
  group.add(rightWing);

  // Legs
  const legMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.28, 8), legMat);
  leftLeg.position.set(-0.14, 0.14, 0);
  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.28, 8), legMat);
  rightLeg.position.set(0.14, 0.14, 0);
  group.add(leftLeg);
  group.add(rightLeg);

  const comb = crest;
  group.scale.set(spec.scale, spec.scale, spec.scale);
  return { group, leftWing, rightWing, leftLeg, rightLeg, head, comb };
}

// 4. Wild Turkey Builder (ديك رومي ضخم)
function buildTurkeyMesh(spec: ChickenSpec, group: THREE.Group): Chicken3DMeshGroup {
  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x3e2723, roughness: 0.6 }); // Bronze/black body
  const headMat = new THREE.MeshStandardMaterial({ color: 0x1e88e5, roughness: 0.4 }); // Blue wrinkled head
  const wattleMat = new THREE.MeshStandardMaterial({ color: 0xe53935, roughness: 0.3 }); // Red Snood/Wattle

  // Large Round Body
  const bodyGeo = new THREE.SphereGeometry(0.52, 16, 16);
  bodyGeo.scale(1.1, 1.0, 1.15);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.52;
  group.add(body);

  // Blue Head & Neck
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), headMat);
  head.position.set(0, 0.95, 0.28);
  group.add(head);

  // Fleshy Red Snood drooping over beak
  const snood = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.25, 8), wattleMat);
  snood.position.set(0, 0.88, 0.48);
  snood.rotation.x = 0.4;
  group.add(snood);

  // Massive Fan Tail
  const tailGroup = new THREE.Group();
  const featherMat1 = new THREE.MeshStandardMaterial({ color: 0x4e342e, roughness: 0.5 });
  const featherMat2 = new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.5 });
  for (let i = -4; i <= 4; i++) {
    const feather = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.7, 0.18), i % 2 === 0 ? featherMat1 : featherMat2);
    feather.rotation.x = -Math.PI / 6;
    feather.rotation.z = i * 0.18;
    feather.position.set(i * 0.09, 0.85, -0.55);
    tailGroup.add(feather);
  }
  group.add(tailGroup);

  // Wings
  const wingGeo = new THREE.BoxGeometry(0.1, 0.3, 0.5);
  const leftWing = new THREE.Mesh(wingGeo, bodyMat);
  leftWing.position.set(-0.54, 0.52, 0);
  const rightWing = new THREE.Mesh(wingGeo, bodyMat);
  rightWing.position.set(0.54, 0.52, 0);
  group.add(leftWing);
  group.add(rightWing);

  // Strong Sturdy Legs
  const legMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63 });
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8), legMat);
  leftLeg.position.set(-0.2, 0.18, 0);
  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.35, 8), legMat);
  rightLeg.position.set(0.2, 0.18, 0);
  group.add(leftLeg);
  group.add(rightLeg);

  const comb = snood;
  group.scale.set(spec.scale, spec.scale, spec.scale);
  return { group, leftWing, rightWing, leftLeg, rightLeg, head, comb };
}

// 5. Eagle / Falcon Majestic Raptor Builder (عقاب / صقر أسطوري)
function buildEagleFalconMesh(type: ChickenType, spec: ChickenSpec, group: THREE.Group): Chicken3DMeshGroup {
  const isFalcon = type === 'FALCON';
  const bodyMat = new THREE.MeshStandardMaterial({
    color: isFalcon ? 0xffd700 : 0x3e2723,
    metalness: isFalcon ? 0.8 : 0.2,
    roughness: isFalcon ? 0.2 : 0.5,
  });
  const headMat = new THREE.MeshStandardMaterial({
    color: isFalcon ? 0xfff8e1 : 0xffffff, // White head for Bald Eagle / Golden Falcon
    roughness: 0.3,
  });
  const beakMat = new THREE.MeshStandardMaterial({
    color: 0xffb300,
    metalness: 0.8,
    roughness: 0.2,
  });

  // Aerodynamic Flying Body
  const bodyGeo = new THREE.SphereGeometry(0.42, 16, 16);
  bodyGeo.scale(0.8, 0.75, 1.4);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.position.y = 0.5;
  group.add(body);

  // White Eagle/Falcon Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16), headMat);
  head.position.set(0, 0.82, 0.32);
  group.add(head);

  // Sharp Curved Hooked Beak
  const beak = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.28, 8), beakMat);
  beak.rotation.x = Math.PI / 1.8;
  beak.position.set(0, 0.8, 0.52);
  group.add(beak);

  // Fierce Eyes
  const eyeMat = new THREE.MeshBasicMaterial({ color: isFalcon ? 0xff0000 : 0xffab00 });
  const eyeLeft = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), eyeMat);
  eyeLeft.position.set(-0.16, 0.86, 0.42);
  const eyeRight = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), eyeMat);
  eyeRight.position.set(0.16, 0.86, 0.42);
  group.add(eyeLeft);
  group.add(eyeRight);

  // Broad Majestic Wingspan
  const wingGeo = new THREE.BoxGeometry(0.06, 0.2, 0.7);
  const leftWing = new THREE.Mesh(wingGeo, bodyMat);
  leftWing.position.set(-0.48, 0.52, 0);
  leftWing.rotation.z = -0.1;
  const rightWing = new THREE.Mesh(wingGeo, bodyMat);
  rightWing.position.set(0.48, 0.52, 0);
  rightWing.rotation.z = 0.1;
  group.add(leftWing);
  group.add(rightWing);

  // Sharp Talons & Legs
  const legMat = new THREE.MeshStandardMaterial({ color: 0xffb300 });
  const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.25, 8), legMat);
  leftLeg.position.set(-0.16, 0.18, 0.1);
  const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.25, 8), legMat);
  rightLeg.position.set(0.16, 0.18, 0.1);
  group.add(leftLeg);
  group.add(rightLeg);

  const comb = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.01), bodyMat);
  comb.visible = false;
  group.add(comb);

  group.scale.set(spec.scale, spec.scale, spec.scale);
  return { group, leftWing, rightWing, leftLeg, rightLeg, head, comb };
}

// 6. Wild Bunny Rabbit Builder (أرنب بري)
function buildRabbitMesh(spec: ChickenSpec, group: THREE.Group): Chicken3DMeshGroup {
  const furMat = new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.8 }); // Soft bunny fur
  const earInnerMat = new THREE.MeshStandardMaterial({ color: 0xffcdd2, roughness: 0.6 }); // Pink inner ears

  // Bunny Round Body
  const bodyGeo = new THREE.SphereGeometry(0.4, 16, 16);
  bodyGeo.scale(0.9, 0.9, 1.2);
  const body = new THREE.Mesh(bodyGeo, furMat);
  body.position.y = 0.4;
  group.add(body);

  // Head
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), furMat);
  head.position.set(0, 0.72, 0.26);
  group.add(head);

  // Long Upright Ears
  const earGeo = new THREE.BoxGeometry(0.06, 0.42, 0.1);
  const leftEar = new THREE.Mesh(earGeo, furMat);
  leftEar.position.set(-0.1, 1.02, 0.2);
  leftEar.rotation.z = -0.15;
  leftEar.rotation.x = -0.1;

  const rightEar = new THREE.Mesh(earGeo, furMat);
  rightEar.position.set(0.1, 1.02, 0.2);
  rightEar.rotation.z = 0.15;
  rightEar.rotation.x = -0.1;

  // Pink Inner Ear Strips
  const innerGeo = new THREE.BoxGeometry(0.04, 0.35, 0.02);
  const leftInner = new THREE.Mesh(innerGeo, earInnerMat);
  leftInner.position.set(0, 0, 0.05);
  leftEar.add(leftInner);
  const rightInner = new THREE.Mesh(innerGeo, earInnerMat);
  rightInner.position.set(0, 0, 0.05);
  rightEar.add(rightInner);

  group.add(leftEar);
  group.add(rightEar);

  // Fluffy Tail
  const tail = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), furMat);
  tail.position.set(0, 0.42, -0.52);
  group.add(tail);

  // Front Paws & Hind Bounding Legs
  const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.22, 8);
  const leftLeg = new THREE.Mesh(legGeo, furMat);
  leftLeg.position.set(-0.16, 0.11, 0);
  const rightLeg = new THREE.Mesh(legGeo, furMat);
  rightLeg.position.set(0.16, 0.11, 0);
  group.add(leftLeg);
  group.add(rightLeg);

  // Use Ears as Wings for waddling animation mapping
  const leftWing = leftEar;
  const rightWing = rightEar;
  const comb = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.01), furMat);
  comb.visible = false;

  group.scale.set(spec.scale, spec.scale, spec.scale);
  return { group, leftWing, rightWing, leftLeg, rightLeg, head, comb };
}

// 7. Swift Red Fox Builder (ثعلب أحمر مكر)
function buildFoxMesh(spec: ChickenSpec, group: THREE.Group): Chicken3DMeshGroup {
  const furMat = new THREE.MeshStandardMaterial({ color: 0xe65100, roughness: 0.5 }); // Vibrant Fox Red
  const whiteFurMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
  const darkSnoutMat = new THREE.MeshStandardMaterial({ color: 0x212121 });

  // Sleek Body
  const bodyGeo = new THREE.SphereGeometry(0.42, 16, 16);
  bodyGeo.scale(0.8, 0.75, 1.4);
  const body = new THREE.Mesh(bodyGeo, furMat);
  body.position.y = 0.42;
  group.add(body);

  // Fox Head & Pointed Snout
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), furMat);
  head.position.set(0, 0.74, 0.32);
  group.add(head);

  // Sharp Nose Cone
  const snout = new THREE.Mesh(new THREE.ConeGeometry(0.09, 0.26, 8), darkSnoutMat);
  snout.rotation.x = Math.PI / 2;
  snout.position.set(0, 0.7, 0.52);
  group.add(snout);

  // Triangular Ears
  const earGeo = new THREE.ConeGeometry(0.08, 0.22, 4);
  const leftEar = new THREE.Mesh(earGeo, furMat);
  leftEar.position.set(-0.14, 0.94, 0.3);
  const rightEar = new THREE.Mesh(earGeo, furMat);
  rightEar.position.set(0.14, 0.94, 0.3);
  group.add(leftEar);
  group.add(rightEar);

  // Fluffy Bushy Tail with White Tip
  const tailGroup = new THREE.Group();
  const tailBase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.16, 0.5, 12), furMat);
  tailBase.rotation.x = -Math.PI / 3;
  tailBase.position.set(0, 0.5, -0.55);
  tailGroup.add(tailBase);

  const tailTip = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.25, 12), whiteFurMat);
  tailTip.rotation.x = -Math.PI / 3;
  tailTip.position.set(0, 0.62, -0.76);
  tailGroup.add(tailTip);
  group.add(tailGroup);

  // Legs
  const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.28, 8);
  const leftLeg = new THREE.Mesh(legGeo, furMat);
  leftLeg.position.set(-0.16, 0.14, 0.1);
  const rightLeg = new THREE.Mesh(legGeo, furMat);
  rightLeg.position.set(0.16, 0.14, 0.1);
  group.add(leftLeg);
  group.add(rightLeg);

  const leftWing = leftEar;
  const rightWing = rightEar;
  const comb = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.01), furMat);
  comb.visible = false;

  group.scale.set(spec.scale, spec.scale, spec.scale);
  return { group, leftWing, rightWing, leftLeg, rightLeg, head, comb };
}

// 8. Forest Stag Deer Builder (غزال بري)
function buildDeerMesh(spec: ChickenSpec, group: THREE.Group): Chicken3DMeshGroup {
  const coatMat = new THREE.MeshStandardMaterial({ color: 0x8d6e63, roughness: 0.6 }); // Deer coat
  const antlerMat = new THREE.MeshStandardMaterial({ color: 0xd7ccc8, roughness: 0.3 }); // Bone antlers

  // Slender Graceful Body
  const bodyGeo = new THREE.SphereGeometry(0.48, 16, 16);
  bodyGeo.scale(0.85, 0.85, 1.45);
  const body = new THREE.Mesh(bodyGeo, coatMat);
  body.position.y = 0.62;
  group.add(body);

  // Long Neck & Head
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.5, 12), coatMat);
  neck.position.set(0, 0.95, 0.35);
  neck.rotation.x = 0.3;
  group.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 16, 16), coatMat);
  head.position.set(0, 1.2, 0.45);
  group.add(head);

  // Branched Antlers (قرون الغزال)
  const antlerGroup = new THREE.Group();
  for (let side of [-1, 1]) {
    const mainBranch = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.03, 0.45, 8), antlerMat);
    mainBranch.position.set(side * 0.12, 1.42, 0.42);
    mainBranch.rotation.z = side * 0.3;
    mainBranch.rotation.x = -0.2;

    const subBranch = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.02, 0.2, 8), antlerMat);
    subBranch.position.set(side * 0.05, 0.1, 0.05);
    subBranch.rotation.z = side * 0.4;
    mainBranch.add(subBranch);

    antlerGroup.add(mainBranch);
  }
  group.add(antlerGroup);

  // Slender Long Legs
  const legGeo = new THREE.CylinderGeometry(0.035, 0.03, 0.45, 8);
  const leftLeg = new THREE.Mesh(legGeo, coatMat);
  leftLeg.position.set(-0.2, 0.22, 0.2);
  const rightLeg = new THREE.Mesh(legGeo, coatMat);
  rightLeg.position.set(0.2, 0.22, 0.2);
  group.add(leftLeg);
  group.add(rightLeg);

  const leftWing = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.01), coatMat);
  const rightWing = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.01, 0.01), coatMat);
  const comb = antlerGroup.children[0] as THREE.Mesh || head;

  group.scale.set(spec.scale, spec.scale, spec.scale);
  return { group, leftWing, rightWing, leftLeg, rightLeg, head, comb };
}
