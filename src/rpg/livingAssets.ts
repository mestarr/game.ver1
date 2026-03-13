import * as THREE from "three";
import type { AABB } from "./colliders";
import { aabbFromBox } from "./colliders";

/** Soft meadow tint on the ground. */
export function meadowDisc(
  scene: THREE.Scene,
  x: number,
  z: number,
  r: number,
  color: number,
  y = 0.014
): void {
  const m = new THREE.Mesh(
    new THREE.CircleGeometry(r, 36),
    new THREE.MeshLambertMaterial({ color })
  );
  m.rotation.x = -Math.PI / 2;
  m.position.set(x, y, z);
  m.receiveShadow = true;
  scene.add(m);
}

/** One river segment (flat water). */
export function riverSeg(
  scene: THREE.Scene,
  x0: number,
  z0: number,
  x1: number,
  z1: number,
  halfW: number
): void {
  const dx = x1 - x0;
  const dz = z1 - z0;
  const len = Math.hypot(dx, dz) || 1;
  const midX = (x0 + x1) / 2;
  const midZ = (z0 + z1) / 2;
  const water = new THREE.Mesh(
    new THREE.PlaneGeometry(halfW * 2, len + 0.5),
    new THREE.MeshPhongMaterial({
      color: 0x3a7aab,
      emissive: 0x0a2840,
      emissiveIntensity: 0.06,
      shininess: 100,
      transparent: true,
      opacity: 0.94,
      depthWrite: false,
    })
  );
  water.rotation.x = -Math.PI / 2;
  water.rotation.z = -Math.atan2(dx, dz);
  water.position.set(midX, 0.04, midZ);
  water.renderOrder = 1;
  scene.add(water);
  const bankL = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2, len + 1),
    new THREE.MeshLambertMaterial({ color: 0xc4b896 })
  );
  bankL.rotation.x = -Math.PI / 2;
  bankL.rotation.z = water.rotation.z;
  bankL.position.set(
    midX - Math.cos(water.rotation.z) * (halfW + 0.5),
    0.028,
    midZ + Math.sin(water.rotation.z) * (halfW + 0.5)
  );
  bankL.receiveShadow = true;
  scene.add(bankL);
  const bankR = bankL.clone();
  bankR.position.set(
    midX + Math.cos(water.rotation.z) * (halfW + 0.5),
    0.028,
    midZ - Math.sin(water.rotation.z) * (halfW + 0.5)
  );
  scene.add(bankR);
}

export function buildBridge(
  scene: THREE.Scene,
  colliders: AABB[],
  cx: number,
  cz: number,
  len: number,
  rotY: number
): void {
  const wood = new THREE.MeshLambertMaterial({ color: 0x6b5344 });
  const g = new THREE.Group();
  g.position.set(cx, 0, cz);
  g.rotation.y = rotY;
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(len, 0.35, 3.2),
    wood
  );
  deck.position.y = 0.42;
  deck.castShadow = true;
  deck.receiveShadow = true;
  g.add(deck);
  for (let i = -len / 2 + 1; i < len / 2; i += 2) {
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.45, 3.4),
      wood
    );
    rail.position.set(i, 0.72, 0);
    g.add(rail);
  }
  const postA = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.14, 0.9, 6),
    wood
  );
  postA.position.set(-len / 2 + 0.3, 0.45, 1.35);
  g.add(postA);
  const postB = postA.clone();
  postB.position.z = -1.35;
  g.add(postB);
  const postC = postA.clone();
  postC.position.x = len / 2 - 0.3;
  g.add(postC);
  const postD = postC.clone();
  postD.position.z = -1.35;
  g.add(postD);
  scene.add(g);
  colliders.push(aabbFromBox(cx, 0.55, cz, len / 2 + 0.2, 0.5, 1.8));
}

export function wheatField(
  scene: THREE.Scene,
  cx: number,
  cz: number,
  w: number,
  d: number,
  rotY: number,
  rand: () => number
): void {
  const g = new THREE.Group();
  g.position.set(cx, 0, cz);
  g.rotation.y = rotY;
  const base = new THREE.Mesh(
    new THREE.PlaneGeometry(w, d),
    new THREE.MeshLambertMaterial({ color: 0xc9b84a })
  );
  base.rotation.x = -Math.PI / 2;
  base.position.y = 0.025;
  base.receiveShadow = true;
  g.add(base);
  const n = Math.min(80, Math.floor((w * d) / 2));
  const straw = new THREE.MeshLambertMaterial({ color: 0xd4c870 });
  for (let i = 0; i < n; i++) {
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.35 + rand() * 0.25, 0.04),
      straw
    );
    blade.position.set(
      (rand() - 0.5) * w * 0.92,
      0.2,
      (rand() - 0.5) * d * 0.92
    );
    blade.rotation.z = (rand() - 0.5) * 0.3;
    g.add(blade);
  }
  scene.add(g);
}

export function hayBale(
  scene: THREE.Scene,
  colliders: AABB[],
  x: number,
  z: number,
  rotY: number
): void {
  const b = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 1.1, 10),
    new THREE.MeshLambertMaterial({ color: 0xd4c45c })
  );
  b.rotation.z = Math.PI / 2;
  b.rotation.y = rotY;
  b.position.set(x, 0.45, z);
  b.castShadow = true;
  scene.add(b);
  colliders.push(aabbFromBox(x, 0.45, z, 0.65, 0.45, 0.65));
}

export function bench(
  scene: THREE.Scene,
  colliders: AABB[],
  x: number,
  z: number,
  rotY: number
): void {
  const wood = new THREE.MeshLambertMaterial({ color: 0x5c4033 });
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rotY;
  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.12, 0.55),
    wood
  );
  seat.position.y = 0.45;
  g.add(seat);
  const back = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.5, 0.1),
    wood
  );
  back.position.set(0, 0.72, -0.22);
  g.add(back);
  for (const sx of [-0.75, 0.75]) {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 0.45, 0.5),
      wood
    );
    leg.position.set(sx, 0.22, 0);
    g.add(leg);
  }
  scene.add(g);
  colliders.push(aabbFromBox(x, 0.35, z, 1, 0.4, 0.35));
}

export function windmill(
  scene: THREE.Scene,
  colliders: AABB[],
  x: number,
  z: number
): void {
  const stone = new THREE.MeshLambertMaterial({ color: 0x8a8680 });
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.8, 5, 12),
    stone
  );
  base.position.set(x, 2.5, z);
  base.castShadow = true;
  scene.add(base);
  const cap = new THREE.Mesh(
    new THREE.ConeGeometry(2.4, 1.8, 8),
    new THREE.MeshLambertMaterial({ color: 0x5a5048 })
  );
  cap.position.set(x, 5.4, z);
  cap.castShadow = true;
  scene.add(cap);
  const hubY = 4.8;
  for (let i = 0; i < 4; i++) {
    const blade = new THREE.Mesh(
      new THREE.BoxGeometry(0.25, 0.08, 5.5),
      new THREE.MeshLambertMaterial({ color: 0x4a4038 })
    );
    blade.position.set(x, hubY, z);
    blade.rotation.y = (i / 4) * Math.PI / 2;
    blade.castShadow = true;
    scene.add(blade);
  }
  colliders.push(aabbFromBox(x, 2.5, z, 2.4, 2.8, 2.4));
}

export function hamletWell(scene: THREE.Scene, colliders: AABB[], x: number, z: number): void {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.75, 0.18, 8, 20),
    new THREE.MeshLambertMaterial({ color: 0x7a7870 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.set(x, 0.28, z);
  ring.castShadow = true;
  scene.add(ring);
  const water = new THREE.Mesh(
    new THREE.CircleGeometry(0.62, 16),
    new THREE.MeshLambertMaterial({ color: 0x3a6a90 })
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(x, 0.1, z);
  scene.add(water);
  colliders.push(aabbFromBox(x, 0.35, z, 1, 0.4, 1));
}

export function arbor(
  scene: THREE.Scene,
  colliders: AABB[],
  x: number,
  z: number,
  rotY: number
): void {
  const wood = new THREE.MeshLambertMaterial({ color: 0x5c4033 });
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rotY;
  for (const sx of [-1.1, 1.1]) {
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 2.4, 0.2),
      wood
    );
    post.position.set(sx, 1.2, 0);
    g.add(post);
  }
  const beam = new THREE.Mesh(
    new THREE.BoxGeometry(2.6, 0.2, 0.35),
    wood
  );
  beam.position.y = 2.35;
  g.add(beam);
  for (let i = 0; i < 5; i++) {
    const vine = new THREE.Mesh(
      new THREE.SphereGeometry(0.35, 6, 6),
      new THREE.MeshLambertMaterial({ color: 0x3d7a4a })
    );
    vine.position.set(-0.9 + i * 0.45, 2.5 + (i % 2) * 0.15, 0);
    g.add(vine);
  }
  scene.add(g);
  colliders.push(aabbFromBox(x, 1.2, z, 1.3, 1.3, 0.35));
}
