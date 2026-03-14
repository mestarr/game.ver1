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
  buildDock,
  buildShip,
  buildSeasideCity,
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
import { buildGamwiseMesh, buildArwenethMesh } from "./characters";

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
    new THREE.MeshLambertMaterial({ color: 0x32583c })
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
  buildFlowerPatch(scene, 22, -18, rand);
  buildFlowerPatch(scene, -28, -12, rand);
  buildFlowerPatch(scene, 0, 25, rand);
  buildBarrel(scene, colliders, 0, -20, 0.3);
  buildCrate(scene, colliders, 8, -24, 0.4);
  buildLantern(scene, -18, -10, 0.45);

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

  meadowDisc(scene, 0, 58, 56, 0x4d5850, 0.013);
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
  buildFlowerPatch(scene, 100, -8, rand);
  buildBarrel(scene, colliders, 90, -10, 0.2);
  buildCrate(scene, colliders, 76, -16, 0.5);
  buildLantern(scene, 92, 0, 0.4);
  buildCampfire(scene, 70, -22);

  buildLake(scene, colliders, -32, -38, 14, rand);
  buildLake(scene, colliders, 38, 8, 11, rand);
  buildLake(scene, colliders, -55, 35, 10, rand);

  // ——— Seaside (south): sea, harbor city, docks, ships ———
  const sea = new THREE.Mesh(
    new THREE.PlaneGeometry(420, 55),
    new THREE.MeshPhongMaterial({
      color: 0x1a4a7a,
      emissive: 0x0a2038,
      emissiveIntensity: 0.08,
      shininess: 120,
      transparent: true,
      opacity: 0.96,
      depthWrite: false,
    })
  );
  sea.rotation.x = -Math.PI / 2;
  sea.position.set(0, 0.042, -117);
  sea.renderOrder = 0;
  scene.add(sea);

  meadowDisc(scene, -60, -88, 50, 0x3a5a50, 0.012);
  buildSeasideCity(scene, colliders, -60, -88, rand);

  buildDock(scene, colliders, -72, -98, 16, 0.08);
  buildDock(scene, colliders, -48, -100, 12, -0.05);
  buildDock(scene, colliders, -60, -102, 10, Math.PI / 2);
  buildShip(scene, colliders, -72, -108, 0.2, 1.1);
  buildShip(scene, colliders, -88, -104, 0.75, 0.95);
  buildShip(scene, colliders, -52, -106, -0.25, 0.9);
  buildShip(scene, colliders, -60, -110, 0.5, 0.85);
  buildBarrel(scene, colliders, -76, -97, 0.4);
  buildBarrel(scene, colliders, -66, -99, 0.6);
  buildBarrel(scene, colliders, -54, -98, 0.3);
  buildCrate(scene, colliders, -70, -99, 0.5);
  buildCrate(scene, colliders, -50, -100, 0.45);
  buildLantern(scene, -72, -96, 0.5);
  buildLantern(scene, -48, -98, 0.45);

  buildDirtPath(scene, [[-45, -25], [-55, -50], [-60, -75], [-60, -88]], 3);
  buildDirtPath(scene, [[-60, -88], [-72, -95], [-72, -98]], 2.5);
  buildDirtPath(scene, [[-60, -88], [-48, -94], [-48, -98]], 2.5);
  buildSignpost(scene, colliders, -55, -62, 0.1);
  for (let i = 0; i < 6; i++) {
    const x = -90 + rand() * 25;
    const z = -75 + rand() * 15;
    if (Math.hypot(x + 60, z + 88) < 24) continue;
    buildBush(scene, colliders, x, z, 0.5);
  }

  for (let i = 0; i < 26; i++) {
    const x = 28 + rand() * 45;
    const z = -35 + rand() * 50;
    if (Math.hypot(x - 82, z + 8) < 20) continue;
    if (Math.hypot(x, z - 58) < 54) continue;
    if (rand() > 0.4) buildTree(scene, colliders, x, z, 0.55 + rand() * 0.4);
    else buildBroadleafTree(scene, colliders, x, z, rand);
  }
  for (let i = 0; i < 45; i++) {
    const x = (rand() - 0.3) * 120 - 30;
    const z = (rand() - 0.5) * 100;
    if (Math.hypot(x + 5, z + 18) < 25) continue;
    if (Math.hypot(x, z - 58) < 52) continue;
    if (Math.abs(z - 22) < 8 && x > -100 && x < 100) continue;
    buildBush(scene, colliders, x, z, 0.55 + rand() * 0.5);
  }
  for (let i = 0; i < 18; i++) {
    const x = -30 + rand() * 90;
    const z = -50 + rand() * 45;
    if (Math.hypot(x + 5, z + 18) < 22) continue;
    if (Math.hypot(x - 82, z + 8) < 22) continue;
    if (Math.abs(z - 22) < 6 && x > -50 && x < 60) continue;
    buildTree(scene, colliders, x, z, 0.5 + rand() * 0.45);
  }
  for (let i = 0; i < 10; i++) {
    buildFlowerPatch(scene, -20 + rand() * 70, -45 + rand() * 55, rand);
  }
  buildSignpost(scene, colliders, -55, -55, 0.1);
  buildSignpost(scene, colliders, 25, 35, -0.15);

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
    [-165, -90, 1011],
    [-170, -50, 1022],
    [-158, -110, 1033],
    [-140, -125, 1044],
    [-95, -118, 1055],
    [-75, -105, 1066],
    [170, 50, 1077],
    [165, -50, 1088],
    [150, -100, 1099],
    [-60, 120, 1100],
    [60, 115, 1111],
    [-130, 70, 1122],
    [140, 0, 1133],
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

  function makeNpc(
    id: string,
    x: number,
    z: number,
    mesh: THREE.Group
  ): Npc {
    mesh.position.set(x, 0, z);
    scene.add(mesh);
    return { id, x, z, mesh, interactRadius: 3.2 };
  }

  const npcs: Npc[] = [
    makeNpc("gamwise", 8, -14, buildGamwiseMesh()),
    makeNpc("arweneth", 80, -6, buildArwenethMesh()),
  ];

  colliders.push(aabbFromBox(0, -2, 0, 220, 2, 220));

  return { colliders, npcs };
}
