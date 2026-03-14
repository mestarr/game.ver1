import * as THREE from "three";

/** Human NPC: Gamwise — vest, cloak, short hair, boots. Adult male proportions. */
export function buildGamwiseMesh(): THREE.Group {
  const g = new THREE.Group();
  const skin = new THREE.MeshLambertMaterial({ color: 0xd0c0a8 });
  const vestMat = new THREE.MeshLambertMaterial({ color: 0x5c4a38 });
  const cloakMat = new THREE.MeshLambertMaterial({
    color: 0x3d4a32,
    side: THREE.DoubleSide,
  });
  const pantMat = new THREE.MeshLambertMaterial({ color: 0x4a4438 });
  const bootMat = new THREE.MeshLambertMaterial({ color: 0x2a2218 });
  const hairMat = new THREE.MeshLambertMaterial({ color: 0x352a22 });
  const shirtMat = new THREE.MeshLambertMaterial({ color: 0xa89070 });

  // Human proportions — height ~1.72
  const bootL = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.06, 0.24),
    bootMat
  );
  bootL.position.set(-0.1, 0.05, 0.06);
  g.add(bootL);
  const bootR = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.06, 0.24),
    bootMat
  );
  bootR.position.set(0.1, 0.05, 0.06);
  g.add(bootR);

  const legL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.085, 0.095, 0.5, 12),
    pantMat
  );
  legL.position.set(-0.1, 0.33, 0);
  g.add(legL);
  const legR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.085, 0.095, 0.5, 12),
    pantMat
  );
  legR.position.set(0.1, 0.33, 0);
  g.add(legR);

  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.24, 0.48, 12),
    shirtMat
  );
  torso.position.y = 0.82;
  g.add(torso);
  const vest = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.25, 0.36, 12),
    vestMat
  );
  vest.position.set(0, 0.84, 0.02);
  g.add(vest);

  const cloakBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.34, 0.5, 0.07),
    cloakMat
  );
  cloakBack.position.set(0, 0.88, -0.18);
  g.add(cloakBack);

  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.1, 0.1, 10),
    skin
  );
  neck.position.y = 1.1;
  g.add(neck);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 14, 12),
    skin
  );
  head.position.y = 1.38;
  head.scale.set(1, 1, 0.96);
  g.add(head);

  // Short human hair (no cap)
  const hairTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 12, 10),
    hairMat
  );
  hairTop.scale.set(1.02, 0.45, 1.02);
  hairTop.position.set(0, 1.48, -0.02);
  g.add(hairTop);
  const hairSideL = new THREE.Mesh(
    new THREE.BoxGeometry(0.07, 0.16, 0.1),
    hairMat
  );
  hairSideL.position.set(-0.18, 1.32, 0);
  g.add(hairSideL);
  const hairSideR = new THREE.Mesh(
    new THREE.BoxGeometry(0.07, 0.16, 0.1),
    hairMat
  );
  hairSideR.position.set(0.18, 1.32, 0);
  g.add(hairSideR);

  const armL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.07, 0.38, 10),
    shirtMat
  );
  armL.position.set(-0.26, 0.78, 0);
  armL.rotation.z = 0.3;
  g.add(armL);
  const armR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.07, 0.38, 10),
    shirtMat
  );
  armR.position.set(0.26, 0.8, 0);
  armR.rotation.z = -0.28;
  g.add(armR);
  const handL = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 10, 8),
    skin
  );
  handL.position.set(-0.42, 0.56, 0.05);
  g.add(handL);
  const handR = new THREE.Mesh(
    new THREE.SphereGeometry(0.065, 10, 8),
    skin
  );
  handR.position.set(0.4, 0.58, 0.04);
  g.add(handR);

  g.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  return g;
}

/** Human NPC: Arweneth — gown, sash, long hair. Adult female proportions, no pointed ears. */
export function buildArwenethMesh(): THREE.Group {
  const g = new THREE.Group();
  const skin = new THREE.MeshLambertMaterial({ color: 0xe8dcc8 });
  const gownMat = new THREE.MeshLambertMaterial({ color: 0xe8e0d8 });
  const sashMat = new THREE.MeshLambertMaterial({ color: 0xc9a227 });
  const hairMat = new THREE.MeshLambertMaterial({ color: 0x2a2420 });
  const bootMat = new THREE.MeshLambertMaterial({ color: 0x1a1614 });

  // Human proportions — height ~1.68
  const bootL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.065, 0.1, 8),
    bootMat
  );
  bootL.position.set(-0.08, 0.06, 0);
  g.add(bootL);
  const bootR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.055, 0.065, 0.1, 8),
    bootMat
  );
  bootR.position.set(0.08, 0.06, 0);
  g.add(bootR);

  const legL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.075, 0.48, 10),
    gownMat
  );
  legL.position.set(-0.08, 0.35, 0);
  g.add(legL);
  const legR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.065, 0.075, 0.48, 10),
    gownMat
  );
  legR.position.set(0.08, 0.35, 0);
  g.add(legR);

  const gown = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.38, 0.82, 14),
    gownMat
  );
  gown.position.y = 0.88;
  g.add(gown);
  const sash = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.05, 8, 18),
    sashMat
  );
  sash.rotation.x = Math.PI / 2;
  sash.position.y = 0.98;
  g.add(sash);

  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.085, 0.1, 10),
    skin
  );
  neck.position.y = 1.22;
  g.add(neck);
  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.19, 14, 12),
    skin
  );
  head.position.y = 1.42;
  head.scale.set(1, 1, 0.94);
  g.add(head);

  // Long human hair (no pointed ears)
  const hairBack = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 12, 10),
    hairMat
  );
  hairBack.scale.set(1.04, 0.6, 1.08);
  hairBack.position.set(0, 1.4, -0.06);
  g.add(hairBack);
  for (let i = 0; i < 8; i++) {
    const lock = new THREE.Mesh(
      new THREE.CylinderGeometry(0.035, 0.045, 0.28 + (i % 2) * 0.08, 6),
      hairMat
    );
    const a = (i / 8) * Math.PI * 0.75 - 0.15;
    lock.position.set(
      Math.sin(a) * 0.16,
      1.12 - i * 0.055,
      -0.12 - i * 0.035
    );
    lock.rotation.x = 0.25 + (i % 2) * 0.08;
    g.add(lock);
  }

  const armL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.058, 0.36, 8),
    gownMat
  );
  armL.position.set(-0.22, 0.94, 0);
  armL.rotation.z = 0.45;
  g.add(armL);
  const armR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.058, 0.36, 8),
    gownMat
  );
  armR.position.set(0.22, 0.96, 0);
  armR.rotation.z = -0.4;
  g.add(armR);
  const handL = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 8, 6),
    skin
  );
  handL.position.set(-0.36, 0.74, 0.04);
  g.add(handL);
  const handR = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 8, 6),
    skin
  );
  handR.position.set(0.34, 0.76, 0.04);
  g.add(handR);

  g.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  return g;
}
