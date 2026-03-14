import * as THREE from "three";

/**
 * Human hero: adult proportions, normal feet (boots), short hair, vest and cloak, golden ring.
 */
export function buildHobbitHero(): THREE.Group {
  const g = new THREE.Group();
  const skin = new THREE.MeshLambertMaterial({ color: 0xe0d0bc });
  const hair = new THREE.MeshLambertMaterial({ color: 0x3a2a20 });
  const cloak = new THREE.MeshLambertMaterial({ color: 0x2d4a32 });
  const vest = new THREE.MeshLambertMaterial({ color: 0x6b4e3d });
  const shirt = new THREE.MeshLambertMaterial({ color: 0xb8a078 });
  const pant = new THREE.MeshLambertMaterial({ color: 0x4a4438 });
  const boot = new THREE.MeshLambertMaterial({ color: 0x2a2218 });
  const gold = new THREE.MeshLambertMaterial({
    color: 0xd4af37,
    emissive: 0x332200,
    emissiveIntensity: 0.15,
  });

  // Human proportions: total height ~1.72 — limb groups for walk animation
  const legGroupL = new THREE.Group();
  legGroupL.position.set(-0.1, 0.58, 0);
  const legL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.1, 0.5, 14),
    pant
  );
  legL.position.set(0, -0.25, 0);
  legGroupL.add(legL);
  const footL = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.06, 0.24),
    boot
  );
  footL.position.set(0, -0.53, 0.06);
  legGroupL.add(footL);
  g.add(legGroupL);

  const legGroupR = new THREE.Group();
  legGroupR.position.set(0.1, 0.58, 0);
  const legR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.1, 0.5, 14),
    pant
  );
  legR.position.set(0, -0.25, 0);
  legGroupR.add(legR);
  const footR = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.06, 0.24),
    boot
  );
  footR.position.set(0, -0.53, 0.06);
  legGroupR.add(footR);
  g.add(legGroupR);

  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.24, 0.48, 16),
    shirt
  );
  torso.position.y = 0.82;
  g.add(torso);

  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.1, 0.1, 12),
    skin
  );
  neck.position.y = 1.1;
  g.add(neck);

  const vestMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.25, 0.38, 16),
    vest
  );
  vestMesh.position.set(0, 0.84, 0.02);
  g.add(vestMesh);

  const belt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.235, 0.235, 0.05, 16),
    new THREE.MeshLambertMaterial({ color: 0x3a2a1a })
  );
  belt.position.y = 0.7;
  g.add(belt);

  // Back drape only (no cone around neck)
  const cloakBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.36, 0.52, 0.08),
    cloak
  );
  cloakBack.position.set(0, 0.88, -0.2);
  g.add(cloakBack);
  const cloakL = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.42, 0.24),
    cloak
  );
  cloakL.position.set(-0.24, 0.78, 0);
  cloakL.rotation.z = 0.08;
  g.add(cloakL);
  const cloakR = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.42, 0.24),
    cloak
  );
  cloakR.position.set(0.24, 0.78, 0);
  cloakR.rotation.z = -0.08;
  g.add(cloakR);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 20, 16), skin);
  head.position.y = 1.38;
  head.scale.set(1, 1, 0.95);
  g.add(head);

  // Short human hair (sides and back)
  const hairTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.2, 14, 12),
    hair
  );
  hairTop.scale.set(1.02, 0.45, 1.02);
  hairTop.position.set(0, 1.48, -0.02);
  g.add(hairTop);
  const hairSideL = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.18, 0.12),
    hair
  );
  hairSideL.position.set(-0.18, 1.32, 0);
  g.add(hairSideL);
  const hairSideR = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.18, 0.12),
    hair
  );
  hairSideR.position.set(0.18, 1.32, 0);
  g.add(hairSideR);

  const armGroupL = new THREE.Group();
  armGroupL.position.set(-0.28, 0.58, 0);
  const armL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.075, 0.4, 12),
    shirt
  );
  armL.position.set(0, 0.2, 0);
  armL.rotation.z = 0.25;
  armGroupL.add(armL);
  const handL = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 10), skin);
  handL.position.set(0, 0.4, 0.06);
  armGroupL.add(handL);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.032, 0.01, 8, 14),
    gold
  );
  ring.position.set(0, 0.4, 0.08);
  ring.rotation.x = Math.PI / 2;
  armGroupL.add(ring);
  g.add(armGroupL);

  const armGroupR = new THREE.Group();
  armGroupR.position.set(0.28, 0.58, 0);
  const armR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.075, 0.4, 12),
    shirt
  );
  armR.position.set(0, 0.2, 0);
  armR.rotation.z = -0.22;
  armGroupR.add(armR);
  const handR = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 10), skin);
  handR.position.set(0, 0.4, 0.05);
  armGroupR.add(handR);
  g.add(armGroupR);

  g.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });

  g.userData.walkPhase = 0;
  g.userData.walkBlend = 0;
  g.userData.legGroupL = legGroupL;
  g.userData.legGroupR = legGroupR;
  g.userData.armGroupL = armGroupL;
  g.userData.armGroupR = armGroupR;
  return g;
}

const WALK_SPEED = 8;
const LEG_SWING = 0.42;
const ARM_SWING = 0.52;
const BLEND_UP = 6;
const BLEND_DOWN = 5;

/** Call each frame to animate walk (legs and arms). */
export function updateHeroWalk(
  hero: THREE.Group,
  dt: number,
  velocity: THREE.Vector3,
  onGround: boolean
): void {
  const ud = hero.userData as {
    walkPhase: number;
    walkBlend: number;
    legGroupL: THREE.Group;
    legGroupR: THREE.Group;
    armGroupL: THREE.Group;
    armGroupR: THREE.Group;
  };
  const speed = Math.hypot(velocity.x, velocity.z);
  const walking = onGround && speed > 0.3;
  ud.walkPhase += dt * (walking ? speed * WALK_SPEED : 0);
  const targetBlend = walking ? 1 : 0;
  ud.walkBlend += (targetBlend - ud.walkBlend) * Math.min(1, dt * (walking ? BLEND_UP : BLEND_DOWN));
  const phase = ud.walkPhase;
  const legSwing = Math.sin(phase) * LEG_SWING * ud.walkBlend;
  const armSwing = Math.sin(phase) * ARM_SWING * ud.walkBlend;
  ud.legGroupL.rotation.x = legSwing;
  ud.legGroupR.rotation.x = -legSwing;
  ud.armGroupL.rotation.x = -armSwing;
  ud.armGroupR.rotation.x = armSwing;
}
