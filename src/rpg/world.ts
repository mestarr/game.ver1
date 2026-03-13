import * as THREE from "three";
import type { AABB } from "./colliders";
import { aabbFromBox } from "./colliders";
import {
  buildCottage,
  buildHobbitHole,
  buildTree,
  buildBush,
  buildStump,
  buildMountain,
  buildLake,
  buildSky,
  buildDirtPath,
  buildFence,
  buildBarrel,
  buildCrate,
  buildLantern,
  buildCampfire,
  buildFlowerPatch,
  buildBroadleafTree,
  buildCloud,
  buildSignpost,
  buildRuinArch,
  buildCity,
} from "./assets";
import {
  meadowDisc,
  riverSeg,
  buildBridge,
  wheatField,
  hayBale,
  bench,
  windmill,
  hamletWell,
  arbor,
} from "./livingAssets";

export type Npc = {
  id: string;
  x: number;
  z: number;
  mesh: THREE.Group;
  interactRadius: number;
};

function rng(seed: number): () => number {
  return () => {
    seed = (seed * 1103515245 + 12345) | 0;
    return ((seed >>> 0) % 10000) / 10000;
  };
}

/**
 * One continuous world designed to feel pleasant to live in:
 * river valley, hamlet, fields, mill, bridges, city north, elven east, distant mountains, far quest fire.
 */
export function buildWorld(scene: THREE.Scene): { colliders: AABB[]; npcs: Npc[] } {
  const colliders: AABB[] = [];
  const rand = rng(7);

  buildSky(scene);

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(400, 280),
    new THREE.MeshLambertMaterial({ color: 0x2e5238 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);

  const meadows: Array<[number, number, number, number]> = [
    [-30, -20, 55, 0x3d6b48],
    [15, -25, 48, 0x3a6544],
    [-45, 15, 42, 0x426e50],
    [50, 10, 38, 0x3f6a4c],
    [0, 40, 45, 0x445a4e],
    [85, -15, 35, 0x3d7550],
    [-60, -35, 35, 0x355a40],
    [30, -40, 40, 0x3e6648],
    [100, 25, 32, 0x486050],
    [-20, 50, 38, 0x4a5c52],
  ];
  for (const [mx, mz, mr, col] of meadows) {
    meadowDisc(scene, mx, mz, mr, col);
  }

  riverSeg(scene, -95, 22, 100, 22, 4.2);
  riverSeg(scene, 100, 22, 115, 18, 3.8);
  riverSeg(scene, -95, 22, -110, 26, 3.5);

  buildBridge(scene, colliders, -45, 22, 10, 0);
  buildBridge(scene, colliders, 0, 22, 11, 0);
  buildBridge(scene, colliders, 48, 22, 10, 0);

  buildHobbitHole(scene, colliders, -14, -18, 0.35, 1);
  buildHobbitHole(scene, colliders, 2, -22, -0.25, 1);
  buildHobbitHole(scene, colliders, -8, -28, 0.5, 0.9);
  buildCottage(scene, colliders, 14, -26, 0, 4.2, 4, 2.8);
  buildCottage(scene, colliders, -22, -8, 0.4, 4, 3.8, 2.7);
  buildFence(scene, colliders, -18, -32, 8, -28, rand);
  buildFence(scene, colliders, 8, -30, 18, -24, rand);
  hamletWell(scene, colliders, -2, -20);
  arbor(scene, colliders, 10, -14, 0.2);
  bench(scene, colliders, -6, -16, 0.6);
  bench(scene, colliders, 6, -18, -0.3);
  buildCampfire(scene, 4, -22);
  buildBarrel(scene, colliders, -10, -24, 0.1);
  buildBarrel(scene, colliders, 12, -20, 0.5);
  buildCrate(scene, colliders, -4, -26, 0.45);
  for (let i = 0; i < 12; i++) {
    buildFlowerPatch(scene, -15 + rand() * 35, -32 + rand() * 18, rand);
  }

  wheatField(scene, -48, -12, 22, 14, 0.15, rand);
  wheatField(scene, -52, 5, 18, 12, 0.1, rand);
  hayBale(scene, colliders, -38, -8, 0.2);
  hayBale(scene, colliders, -44, 2, 0.8);
  hayBale(scene, colliders, -50, -6, 0.4);
  windmill(scene, colliders, -58, -22);

  buildDirtPath(scene, [
    [-5, -12],
    [0, -8],
    [5, 0],
    [8, 12],
    [5, 22],
  ]);
  buildDirtPath(scene, [
    [5, 22],
    [0, 45],
    [0, 52],
  ]);
  buildDirtPath(scene, [
    [12, -10],
    [35, -8],
    [58, -6],
    [78, -6],
  ]);
  buildDirtPath(scene, [
    [78, -6],
    [95, -15],
    [115, -28],
    [138, -38],
  ]);

  meadowDisc(scene, 0, 58, 38, 0x4d5850, 0.013);
  buildCity(scene, colliders, 0, 58, rand);

  buildSignpost(scene, colliders, 8, -8, 0.2);
  buildSignpost(scene, colliders, 62, -4, -0.2);

  meadowDisc(scene, 82, -8, 36, 0x4a8058, 0.015);
  buildCottage(scene, colliders, 72, -18, 0.15, 3.6, 3.2, 2.5);
  buildCottage(scene, colliders, 94, 4, -0.5, 3.4, 3, 2.4);
  buildLantern(scene, 78, -12, 0.5);
  buildLantern(scene, 86, 2, 0.45);
  for (let i = 0; i < 14; i++) {
    const x = 68 + rand() * 32;
    const z = -22 + rand() * 28;
    if (rand() > 0.35) buildTree(scene, colliders, x, z, 0.5 + rand() * 0.35);
    else buildBroadleafTree(scene, colliders, x, z, rand);
    buildBush(scene, colliders, x + 2, z, 0.4);
  }
  buildFlowerPatch(scene, 80, -14, rand);
  buildFlowerPatch(scene, 88, 6, rand);

  buildLake(scene, colliders, -32, -38, 14, rand);
  buildLake(scene, colliders, 38, 8, 11, rand);
  buildLake(scene, colliders, -55, 35, 10, rand);

  for (let i = 0; i < 26; i++) {
    const x = 28 + rand() * 45;
    const z = -35 + rand() * 50;
    if (Math.hypot(x - 82, z + 8) < 20) continue;
    if (Math.hypot(x, z - 58) < 38) continue;
    if (rand() > 0.4) buildTree(scene, colliders, x, z, 0.55 + rand() * 0.4);
    else buildBroadleafTree(scene, colliders, x, z, rand);
  }
  for (let i = 0; i < 35; i++) {
    const x = (rand() - 0.3) * 120 - 30;
    const z = (rand() - 0.5) * 100;
    if (Math.hypot(x + 5, z + 18) < 25) continue;
    if (Math.hypot(x, z - 58) < 36) continue;
    if (Math.abs(z - 22) < 8 && x > -100 && x < 100) continue;
    buildBush(scene, colliders, x, z, 0.55 + rand() * 0.5);
  }

  const peaks: Array<[number, number, number]> = [
    [-150, -70, 111],
    [-145, 50, 212],
    [-110, -95, 313],
    [155, 65, 414],
    [160, -85, 515],
    [-155, 5, 616],
    [50, -115, 717],
    [-55, 105, 818],
    [125, 95, 919],
  ];
  for (const [mx, mz, sd] of peaks) {
    buildMountain(scene, colliders, mx, mz, sd);
  }

  const lava = new THREE.Mesh(
    new THREE.CircleGeometry(22, 32),
    new THREE.MeshBasicMaterial({ color: 0x7a1808 })
  );
  lava.rotation.x = -Math.PI / 2;
  lava.position.set(148, 0.035, -42);
  scene.add(lava);
  const pillar = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.45, 5.2, 12),
    new THREE.MeshLambertMaterial({ color: 0x353238 })
  );
  pillar.position.set(148, 2.6, -42);
  pillar.castShadow = true;
  scene.add(pillar);
  colliders.push(aabbFromBox(148, 2.6, -42, 1.65, 2.7, 1.65));
  buildRuinArch(scene, colliders, 122, -28);
  for (let i = 0; i < 10; i++) {
    const x = 108 + rand() * 50;
    const z = -48 + rand() * 35;
    if (rand() > 0.45) buildStump(scene, colliders, x, z);
    else buildTree(scene, colliders, x, z, 0.35 + rand() * 0.25);
  }
  for (let i = 0; i < 14; i++) {
    const x = 95 + rand() * 70;
    const z = (rand() - 0.5) * 80;
    if (Math.hypot(x - 148, z + 42) < 28) continue;
    const s = 0.65 + rand() * 1;
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(s, s * 1.05, s * 0.9),
      new THREE.MeshLambertMaterial({ color: 0x4a4a52 })
    );
    m.position.set(x, s * 0.52, z);
    m.rotation.y = rand() * Math.PI;
    m.castShadow = true;
    scene.add(m);
    colliders.push(aabbFromBox(x, s * 0.52, z, s / 2 + 0.1, s * 0.52, s / 2 + 0.1));
  }

  const borderH = 4;
  const wallL = 195;
  for (const [x, z, wx, wz] of [
    [-wallL, 0, 2, 140],
    [wallL, 0, 2, 140],
    [0, -wallL, 140, 2],
    [0, wallL, 140, 2],
  ] as const) {
    const w = new THREE.Mesh(
      new THREE.BoxGeometry(wx, borderH, wz),
      new THREE.MeshLambertMaterial({ color: 0x252018 })
    );
    w.position.set(x, borderH / 2, z);
    w.castShadow = true;
    scene.add(w);
    colliders.push(aabbFromBox(x, borderH / 2, z, wx / 2, borderH / 2, wz / 2));
  }

  for (let c = 0; c < 12; c++) {
    buildCloud(
      scene,
      (rand() - 0.5) * 220,
      52 + rand() * 28,
      (rand() - 0.5) * 160,
      rand
    );
  }

  function makeNpc(id: string, x: number, z: number, kind: "gamwise" | "elf"): Npc {
    const g = new THREE.Group();
    const scale = kind === "gamwise" ? 0.92 : 1.05;
    const skin = new THREE.MeshLambertMaterial({ color: 0xd4c4a8 });
    if (kind === "gamwise") {
      const vest = new THREE.Mesh(
        new THREE.CylinderGeometry(0.36 * scale, 0.42 * scale, 0.95 * scale, 10),
        new THREE.MeshLambertMaterial({ color: 0x5c4a38 })
      );
      vest.position.y = 0.52 * scale;
      vest.castShadow = true;
      g.add(vest);
      const cloak = new THREE.Mesh(
        new THREE.ConeGeometry(0.55 * scale, 0.7 * scale, 8, 1, true),
        new THREE.MeshLambertMaterial({ color: 0x3d4a32, side: THREE.DoubleSide })
      );
      cloak.rotation.x = Math.PI;
      cloak.position.set(0, 0.55 * scale, -0.12);
      g.add(cloak);
    } else {
      const gown = new THREE.Mesh(
        new THREE.CylinderGeometry(0.32 * scale, 0.5 * scale, 1.25 * scale, 12),
        new THREE.MeshLambertMaterial({ color: 0xe8e0d8 })
      );
      gown.position.y = 0.62 * scale;
      gown.castShadow = true;
      g.add(gown);
      const sash = new THREE.Mesh(
        new THREE.TorusGeometry(0.38 * scale, 0.06, 6, 16),
        new THREE.MeshLambertMaterial({ color: 0xc9a227 })
      );
      sash.rotation.x = Math.PI / 2;
      sash.position.y = 0.85 * scale;
      g.add(sash);
    }
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.27 * scale, 10, 8),
      skin
    );
    head.position.y = 1.18 * scale;
    head.castShadow = true;
    g.add(head);
    g.position.set(x, 0, z);
    scene.add(g);
    return { id, x, z, mesh: g, interactRadius: 3.2 };
  }

  const npcs: Npc[] = [
    makeNpc("gamwise", 8, -14, "gamwise"),
    makeNpc("arweneth", 80, -6, "elf"),
  ];

  colliders.push(aabbFromBox(0, -2, 0, 220, 2, 220));

  return { colliders, npcs };
}
