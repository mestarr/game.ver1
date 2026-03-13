import * as THREE from "three";

/**
 * Hobbit-style hero (Frodo-inspired): short, green cloak, curly hair, large feet, golden ring.
 * Original character — not an official likeness.
 */
export function buildHobbitHero(): THREE.Group {
  const g = new THREE.Group();
  const skin = new THREE.MeshLambertMaterial({ color: 0xe8d5c4 });
  const hair = new THREE.MeshLambertMaterial({ color: 0x4a3020 });
  const cloak = new THREE.MeshLambertMaterial({ color: 0x2d4a32 });
  const vest = new THREE.MeshLambertMaterial({ color: 0x6b4e3d });
  const shirt = new THREE.MeshLambertMaterial({ color: 0xc4a574 });
  const pant = new THREE.MeshLambertMaterial({ color: 0x5c5348 });
  const footFur = new THREE.MeshLambertMaterial({ color: 0x6b5644 });
  const gold = new THREE.MeshLambertMaterial({
    color: 0xd4af37,
    emissive: 0x332200,
    emissiveIntensity: 0.15,
  });

  const footL = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.11, 0.22, 6, 10),
    footFur
  );
  footL.rotation.z = Math.PI / 2;
  footL.position.set(-0.12, 0.08, 0.08);
  g.add(footL);
  const footR = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.11, 0.22, 6, 10),
    footFur
  );
  footR.rotation.z = Math.PI / 2;
  footR.position.set(0.12, 0.08, 0.08);
  g.add(footR);

  const legL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.11, 0.32, 14),
    pant
  );
  legL.position.set(-0.12, 0.27, 0);
  g.add(legL);
  const legR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.11, 0.32, 14),
    pant
  );
  legR.position.set(0.12, 0.27, 0);
  g.add(legR);

  const torso = new THREE.Mesh(
    new THREE.CylinderGeometry(0.22, 0.26, 0.38, 16),
    shirt
  );
  torso.position.y = 0.55;
  g.add(torso);

  const vestMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.27, 0.32, 16),
    vest
  );
  vestMesh.position.set(0, 0.56, 0.02);
  g.add(vestMesh);

  const cloakBack = new THREE.Mesh(
    new THREE.ConeGeometry(0.52, 0.75, 20, 1, true),
    cloak
  );
  cloakBack.material.side = THREE.DoubleSide;
  cloakBack.rotation.x = Math.PI;
  cloakBack.position.set(0, 0.72, -0.08);
  cloakBack.scale.set(1, 1, 0.65);
  g.add(cloakBack);
  const cloakL = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.55, 0.35),
    cloak
  );
  cloakL.position.set(-0.28, 0.58, 0);
  cloakL.rotation.z = 0.12;
  g.add(cloakL);
  const cloakR = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.55, 0.35),
    cloak
  );
  cloakR.position.set(0.28, 0.58, 0);
  cloakR.rotation.z = -0.12;
  g.add(cloakR);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 18, 14), skin);
  head.position.y = 0.92;
  g.add(head);

  for (let i = 0; i < 9; i++) {
    const curl = new THREE.Mesh(
      new THREE.SphereGeometry(0.06 + (i % 3) * 0.02, 10, 8),
      hair
    );
    const a = (i / 9) * Math.PI * 2;
    curl.position.set(
      Math.cos(a) * 0.14,
      1.02 + (i % 2) * 0.04,
      Math.sin(a) * 0.14
    );
    g.add(curl);
  }
  const hairTop = new THREE.Mesh(
    new THREE.SphereGeometry(0.16, 12, 10),
    hair
  );
  hairTop.scale.set(1.1, 0.5, 1.05);
  hairTop.position.y = 1.05;
  g.add(hairTop);

  const armL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.07, 0.08, 0.36, 8),
    shirt
  );
  armL.position.set(-0.32, 0.52, 0);
  armL.rotation.z = 0.35;
  g.add(armL);
  const handL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), skin);
  handL.position.set(-0.42, 0.38, 0.08);
  g.add(handL);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.035, 0.012, 6, 12),
    gold
  );
  ring.position.set(-0.42, 0.38, 0.1);
  ring.rotation.x = Math.PI / 2;
  g.add(ring);

  g.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  return g;
}
