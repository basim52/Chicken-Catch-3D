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
  },
  NINJA: {
    type: 'NINJA',
    nameEn: 'Ninja Chicken',
    nameAr: 'دجاجة النينجا',
    points: 50,
    baseSpeed: 3.4,
    clicksRequired: 1,
    colorHex: 0x2c3e50,
    scale: 0.95,
    zigzag: true,
    isDanger: false,
  },
  ROOSTER: {
    type: 'ROOSTER',
    nameEn: 'Giant Rooster',
    nameAr: 'الديق العملاق',
    points: 40,
    baseSpeed: 1.8,
    clicksRequired: 2,
    colorHex: 0xecf0f1,
    scale: 1.4,
    zigzag: false,
    isDanger: false,
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

  // Primary Material
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

  // 1. Body (Sphere slightly flattened/stretched)
  const bodyGeo = new THREE.SphereGeometry(0.45, 16, 16);
  bodyGeo.scale(1.0, 0.9, 1.1);
  const body = new THREE.Mesh(bodyGeo, bodyMat);
  body.castShadow = true;
  body.receiveShadow = true;
  body.position.y = 0.45;
  group.add(body);

  // 2. Head
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

  // 3. Beak (Cone pointing forward)
  const beakGeo = new THREE.ConeGeometry(0.1, 0.22, 8);
  beakGeo.rotateX(Math.PI / 2);
  const beakMat = new THREE.MeshStandardMaterial({ color: type === 'NINJA' ? 0xffffff : 0xe74c3c, roughness: 0.3 });
  const beak = new THREE.Mesh(beakGeo, beakMat);
  beak.position.set(0, 0.85, 0.46);
  group.add(beak);

  // 4. Eyes (2 small black spheres)
  const eyeGeo = new THREE.SphereGeometry(0.045, 8, 8);
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
  const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
  leftEye.position.set(-0.16, 0.92, 0.36);
  const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
  rightEye.position.set(0.16, 0.92, 0.36);
  group.add(leftEye);
  group.add(rightEye);

  // 5. Comb on top of head (Red or purple Cockscomb)
  const combGeo = new THREE.BoxGeometry(0.06, 0.18, 0.3);
  const combColor = type === 'NINJA' ? 0x8e44ad : type === 'BOMB' ? 0xff0000 : 0xd63031;
  const combMat = new THREE.MeshStandardMaterial({ color: combColor, roughness: 0.4 });
  const comb = new THREE.Mesh(combGeo, combMat);
  comb.position.set(0, 1.08, 0.15);
  group.add(comb);

  // 6. Wattle under beak
  const wattleGeo = new THREE.SphereGeometry(0.07, 8, 8);
  const wattle = new THREE.Mesh(wattleGeo, combMat);
  wattle.position.set(0, 0.72, 0.4);
  group.add(wattle);

  // 7. Tail Feathers
  if (type === 'ROOSTER') {
    // Large rooster fan tail
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
    // Normal tail feathers
    const tailGeo = new THREE.ConeGeometry(0.12, 0.3, 5);
    tailGeo.rotateX(-Math.PI / 3);
    const tail = new THREE.Mesh(tailGeo, bodyMat);
    tail.position.set(0, 0.55, -0.45);
    group.add(tail);
  }

  // 8. Wings
  const wingGeo = new THREE.BoxGeometry(0.08, 0.25, 0.4);
  const leftWing = new THREE.Mesh(wingGeo, bodyMat);
  leftWing.position.set(-0.44, 0.48, 0);
  const rightWing = new THREE.Mesh(wingGeo, bodyMat);
  rightWing.position.set(0.44, 0.48, 0);
  group.add(leftWing);
  group.add(rightWing);

  // 9. Legs
  const legGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.3, 8);
  const legMat = new THREE.MeshStandardMaterial({ color: 0xf39c12 });
  const leftLeg = new THREE.Mesh(legGeo, legMat);
  leftLeg.position.set(-0.16, 0.15, 0);
  const rightLeg = new THREE.Mesh(legGeo, legMat);
  rightLeg.position.set(0.16, 0.15, 0);
  group.add(leftLeg);
  group.add(rightLeg);

  // Special for BOMB chicken: Glowing red fuse light
  let fuseLight: THREE.PointLight | undefined;
  if (type === 'BOMB') {
    fuseLight = new THREE.PointLight(0xff3300, 1.5, 2);
    fuseLight.position.set(0, 1.2, 0.15);
    group.add(fuseLight);
  }

  // Apply Scale according to spec
  group.scale.set(spec.scale, spec.scale, spec.scale);

  return {
    group,
    leftWing,
    rightWing,
    leftLeg,
    rightLeg,
    head,
    comb,
    fuseLight,
  };
}
