import * as THREE from "three";
import type { AABB } from "./colliders";
import { aabbFromBox } from "./colliders";

const wallMat = new THREE.MeshLambertMaterial({ color: 0xc4b89a });
const roofMat = new THREE.MeshLambertMaterial({ color: 0x6b3d2e });
const woodMat = new THREE.MeshLambertMaterial({ color: 0x5c4033 });
const leafDark = new THREE.MeshLambertMaterial({ color: 0x1e4d2b });
const leafMid = new THREE.MeshLambertMaterial({ color: 0x2d6b3d });
const leafLight = new THREE.MeshLambertMaterial({ color: 0x3d8b4a });
const trunkMat = new THREE.MeshLambertMaterial({ color: 0x4a3728 });
const grassDome = new THREE.MeshLambertMaterial({ color: 0x4a7c4e });
const doorMat = new THREE.MeshLambertMaterial({ color: 0x3d2817 });

function shadow(mesh: THREE.Object3D): void {
  mesh.traverse((o) => {
    if (o instanceof THREE.Mesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });
}

/** Rect cottage: walls + pyramid roof + door + windows + chimney. */
export function buildCottage(
  scene: THREE.Scene,
  colliders: AABB[],
  x: number,
  z: number,
  rotY: number,
  w = 5,
  d = 4.5,
  wallH = 3.2
): void {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rotY;

  const base = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.25, 0.35, d + 0.25),
    new THREE.MeshLambertMaterial({ color: 0x6a6560 })
  );
  base.position.y = 0.18;
  g.add(base);
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(w, wallH, d),
    wallMat.clone()
  );
  walls.position.y = wallH / 2 + 0.35;
  g.add(walls);

  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(Math.hypot(w, d) * 0.55, 2.4, 4),
    roofMat.clone()
  );
  roof.position.y = wallH + 1.1 + 0.35;
  roof.rotation.y = Math.PI / 4;
  g.add(roof);

  const chimney = new THREE.Mesh(
    new THREE.BoxGeometry(0.7, 1.8, 0.7),
    new THREE.MeshLambertMaterial({ color: 0x5a5048 })
  );
  chimney.position.set(w * 0.25, wallH + 1.4 + 0.35, -d * 0.15);
  g.add(chimney);

  const door = new THREE.Mesh(
    new THREE.BoxGeometry(1.1, 2.1, 0.12),
    doorMat.clone()
  );
  door.position.set(0, 1.05 + 0.35, d / 2 + 0.02);
  g.add(door);

  const winMat = new THREE.MeshLambertMaterial({
    color: 0x4a6a8a,
    emissive: 0x1a2a3a,
    emissiveIntensity: 0.15,
  });
  for (const sx of [-1.2, 1.2]) {
    const win = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.9, 0.08), winMat);
    win.position.set(sx, wallH * 0.55 + 0.35, d / 2 + 0.02);
    g.add(win);
  }

  shadow(g);
  scene.add(g);
  colliders.push(
    aabbFromBox(x, wallH / 2 + 0.35, z, w / 2 + 0.3, wallH / 2 + 0.5, d / 2 + 0.3)
  );
}

/** Hobbit-style burrow: grass mound + round door. */
export function buildHobbitHole(
  scene: THREE.Scene,
  colliders: AABB[],
  x: number,
  z: number,
  rotY: number,
  scale = 1
): void {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rotY;
  const s = scale;

  const mound = new THREE.Mesh(
    new THREE.SphereGeometry(3.2 * s, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2),
    grassDome.clone()
  );
  mound.scale.set(1, 0.55, 1.15);
  mound.position.y = 0.05;
  g.add(mound);

  const facade = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2 * s, 2.4 * s, 1.2 * s, 20, 1, true, 0, Math.PI)
  );
  const facMat = new THREE.MeshLambertMaterial({
    color: 0x8b7355,
    side: THREE.DoubleSide,
  });
  facade.material = facMat;
  facade.rotation.z = Math.PI / 2;
  facade.rotation.y = Math.PI / 2;
  facade.position.set(0, 0.9 * s, 2.4 * s);
  g.add(facade);

  const door = new THREE.Mesh(
    new THREE.CircleGeometry(0.85 * s, 16),
    doorMat.clone()
  );
  door.rotation.x = -Math.PI / 2;
  door.position.set(0, 0.95 * s, 2.42 * s);
  g.add(door);

  const step = new THREE.Mesh(
    new THREE.BoxGeometry(2.2 * s, 0.15 * s, 1 * s),
    woodMat.clone()
  );
  step.position.set(0, 0.08 * s, 2.9 * s);
  g.add(step);

  shadow(g);
  scene.add(g);
  colliders.push(aabbFromBox(x, 1 * s, z, 3.5 * s, 1.5 * s, 3.8 * s));
}

/** Pine-style tree: trunk + stacked cones. */
export function buildTree(
  scene: THREE.Scene,
  colliders: AABB[],
  x: number,
  z: number,
  hScale = 1
): void {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  const h = hScale;

  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.25 * h, 0.4 * h, 2.2 * h, 12),
    trunkMat.clone()
  );
  trunk.position.y = 1.1 * h;
  g.add(trunk);

  const layers = [
    { y: 2.8 * h, r: 1.8 * h, mat: leafDark },
    { y: 3.9 * h, r: 1.45 * h, mat: leafMid },
    { y: 4.85 * h, r: 1.05 * h, mat: leafLight },
  ];
  for (const L of layers) {
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(L.r, 1.6 * h, 12),
      L.mat.clone()
    );
    cone.position.y = L.y;
    g.add(cone);
  }

  shadow(g);
  scene.add(g);
  colliders.push(aabbFromBox(x, 1.1 * h, z, 0.45 * h, 1.2 * h, 0.45 * h));
}

/** Round bush: several spheres. */
export function buildBush(
  scene: THREE.Scene,
  _colliders: AABB[],
  x: number,
  z: number,
  s = 1
): void {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  const mats = [leafDark, leafMid, leafLight];
  for (let i = 0; i < 5; i++) {
    const r = (0.35 + Math.random() * 0.35) * s;
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(r, 10, 8),
      mats[i % 3]!.clone()
    );
    m.position.set(
      (Math.random() - 0.5) * 0.9 * s,
      r * 0.6,
      (Math.random() - 0.5) * 0.9 * s
    );
    g.add(m);
  }
  shadow(g);
  scene.add(g);
}

/** Dead tree / stump for variety. */
export function buildStump(
  scene: THREE.Scene,
  colliders: AABB[],
  x: number,
  z: number
): void {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  const stump = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.65, 0.9, 8),
    trunkMat.clone()
  );
  stump.position.y = 0.45;
  g.add(stump);
  shadow(g);
  scene.add(g);
  colliders.push(aabbFromBox(x, 0.45, z, 0.55, 0.5, 0.55));
}

const rockMat = new THREE.MeshLambertMaterial({ color: 0x5a5a62 });
const rockDark = new THREE.MeshLambertMaterial({ color: 0x3a3a42 });
const snowMat = new THREE.MeshLambertMaterial({ color: 0xe8eef2 });

/** Jagged mountain — stacked boxes + peak; solid collider at foot. */
export function buildMountain(
  scene: THREE.Scene,
  colliders: AABB[],
  baseX: number,
  baseZ: number,
  seed: number
): void {
  let s = seed;
  const rnd = () => {
    s = (s * 1103515245 + 12345) | 0;
    return ((s >>> 0) % 1000) / 1000;
  };
  const g = new THREE.Group();
  g.position.set(baseX, 0, baseZ);
  const maxW = 14 + rnd() * 10;
  const maxD = 12 + rnd() * 8;
  let y = 0;
  const layers = 5 + Math.floor(rnd() * 4);
  for (let i = 0; i < layers; i++) {
    const t = i / layers;
    const wx = maxW * (1 - t * 0.72);
    const dz = maxD * (1 - t * 0.72);
    const hy = 4 + rnd() * 3.5;
    const mat = t > 0.65 ? snowMat : rnd() > 0.35 ? rockMat.clone() : rockDark.clone();
    const block = new THREE.Mesh(
      new THREE.BoxGeometry(wx, hy, dz),
      mat
    );
    block.position.set((rnd() - 0.5) * 3, y + hy / 2, (rnd() - 0.5) * 3);
    block.rotation.y = rnd() * Math.PI;
    g.add(block);
    y += hy * 0.88;
  }
  const peak = new THREE.Mesh(
    new THREE.ConeGeometry(maxW * 0.22, 5 + rnd() * 4, 5),
    snowMat.clone()
  );
  peak.position.y = y + 2.2;
  g.add(peak);
  shadow(g);
  scene.add(g);
  colliders.push(
    aabbFromBox(baseX, y * 0.35, baseZ, maxW * 0.55, y * 0.5, maxD * 0.55)
  );
}

/** Calm lake + shore rocks (no swim — decorative water on ground). */
export function buildLake(
  scene: THREE.Scene,
  colliders: AABB[],
  cx: number,
  cz: number,
  radius: number,
  rand: () => number
): void {
  const water = new THREE.Mesh(
    new THREE.CircleGeometry(radius, 48),
    new THREE.MeshPhongMaterial({
      color: 0x2a6a8a,
      emissive: 0x0a3048,
      emissiveIntensity: 0.08,
      shininess: 90,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
    })
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(cx, 0.045, cz);
  water.renderOrder = 1;
  scene.add(water);

  const shore = new THREE.Mesh(
    new THREE.RingGeometry(radius * 0.92, radius * 1.08, 40),
    new THREE.MeshLambertMaterial({ color: 0x4a6e4a })
  );
  shore.rotation.x = -Math.PI / 2;
  shore.position.set(cx, 0.035, cz);
  shore.receiveShadow = true;
  scene.add(shore);

  const n = 10 + Math.floor(rand() * 8);
  for (let i = 0; i < n; i++) {
    const ang = (i / n) * Math.PI * 2 + rand() * 0.4;
    const rr = radius * (1.02 + rand() * 0.12);
    const x = cx + Math.cos(ang) * rr;
    const z = cz + Math.sin(ang) * rr;
    const sz = 0.35 + rand() * 0.55;
    const rock = new THREE.Mesh(
      new THREE.BoxGeometry(sz, sz * 0.7, sz * 0.9),
      rockDark.clone()
    );
    rock.position.set(x, sz * 0.35, z);
    rock.rotation.y = rand() * Math.PI;
    rock.castShadow = true;
    scene.add(rock);
    colliders.push(aabbFromBox(x, sz * 0.35, z, sz * 0.5, sz * 0.35, sz * 0.5));
  }

  const pads = 6 + Math.floor(rand() * 6);
  for (let i = 0; i < pads; i++) {
    const ang = rand() * Math.PI * 2;
    const rr = rand() * radius * 0.65;
    const pad = new THREE.Mesh(
      new THREE.CircleGeometry(0.35 + rand() * 0.25, 8),
      new THREE.MeshLambertMaterial({ color: 0x3d6b4a })
    );
    pad.rotation.x = -Math.PI / 2;
    pad.position.set(cx + Math.cos(ang) * rr, 0.048, cz + Math.sin(ang) * rr);
    pad.renderOrder = 2;
    scene.add(pad);
  }
}

/** Gradient sky dome. */
export function buildSky(scene: THREE.Scene): void {
  const skyGeo = new THREE.SphereGeometry(380, 24, 16);
  const skyMat = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: `
      varying float vH;
      void main() {
        vH = normalize(position).y;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: `
      varying float vH;
      void main() {
        float t = clamp(vH * 0.5 + 0.5, 0.0, 1.0);
        vec3 zenith = vec3(0.42, 0.62, 0.92);
        vec3 horizon = vec3(0.92, 0.78, 0.58);
        vec3 groundHaze = vec3(0.72, 0.68, 0.52);
        vec3 c = mix(horizon, zenith, t);
        if (vH < 0.1) c = mix(groundHaze, horizon, smoothstep(-0.15, 0.1, vH + 0.1));
        gl_FragColor = vec4(c, 1.0);
      }`,
    side: THREE.BackSide,
    depthWrite: false,
  });
  const sky = new THREE.Mesh(skyGeo, skyMat);
  sky.userData.skipOutline = true;
  scene.add(sky);
}

/** Dirt path as overlapping flats (no collider). */
export function buildDirtPath(
  scene: THREE.Scene,
  points: Array<[number, number]>,
  width = 3.2
): void {
  const dirt = new THREE.MeshLambertMaterial({ color: 0x6b5344 });
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, z0] = points[i]!;
    const [x1, z1] = points[i + 1]!;
    const dx = x1 - x0;
    const dz = z1 - z0;
    const len = Math.hypot(dx, dz) || 1;
    const midX = (x0 + x1) / 2;
    const midZ = (z0 + z1) / 2;
    const seg = new THREE.Mesh(
      new THREE.PlaneGeometry(width, len + 0.8),
      dirt
    );
    seg.rotation.x = -Math.PI / 2;
    seg.rotation.z = -Math.atan2(dx, dz);
    seg.position.set(midX, 0.018, midZ);
    seg.receiveShadow = true;
    scene.add(seg);
  }
}

export function buildFence(
  scene: THREE.Scene,
  colliders: AABB[],
  x0: number,
  z0: number,
  x1: number,
  z1: number,
  rand: () => number
): void {
  const dx = x1 - x0;
  const dz = z1 - z0;
  const len = Math.hypot(dx, dz);
  const n = Math.max(2, Math.floor(len / 2.2));
  const postMat = new THREE.MeshLambertMaterial({ color: 0x4a3d2e });
  const railMat = new THREE.MeshLambertMaterial({ color: 0x5c4a38 });
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = x0 + dx * t;
    const z = z0 + dz * t;
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.2, 0.95, 0.2),
      postMat
    );
    post.position.set(x, 0.48, z);
    post.castShadow = true;
    scene.add(post);
    if (i < n) {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.12, 0.1, len / n + 0.15),
        railMat
      );
      rail.position.set(x + dx / n * 0.5, 0.72, z + dz / n * 0.5);
      rail.rotation.y = Math.atan2(dx, dz);
      scene.add(rail);
      const rail2 = rail.clone();
      rail2.position.y = 0.42;
      scene.add(rail2);
    }
    colliders.push(aabbFromBox(x, 0.48, z, 0.15, 0.48, 0.15));
  }
}

export function buildBarrel(
  scene: THREE.Scene,
  colliders: AABB[],
  x: number,
  z: number,
  rotY: number
): void {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rotY;
  const staves = new THREE.MeshLambertMaterial({ color: 0x5c4033 });
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.42, 0.75, 10),
    staves
  );
  body.position.y = 0.38;
  g.add(body);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(0.4, 0.04, 6, 16),
    new THREE.MeshLambertMaterial({ color: 0x3a3a42 })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.5;
  g.add(ring);
  const ring2 = ring.clone();
  ring2.position.y = 0.25;
  g.add(ring2);
  shadow(g);
  scene.add(g);
  colliders.push(aabbFromBox(x, 0.38, z, 0.45, 0.4, 0.45));
}

export function buildCrate(
  scene: THREE.Scene,
  colliders: AABB[],
  x: number,
  z: number,
  s = 0.55
): void {
  const m = new THREE.Mesh(
    new THREE.BoxGeometry(s, s, s),
    new THREE.MeshLambertMaterial({ color: 0x7a5c3a })
  );
  m.position.set(x, s / 2, z);
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(s + 0.04, 0.06, s + 0.04),
    new THREE.MeshLambertMaterial({ color: 0x4a3728 })
  );
  frame.position.set(x, s * 0.35, z);
  m.castShadow = true;
  frame.castShadow = true;
  scene.add(m);
  scene.add(frame);
  colliders.push(aabbFromBox(x, s / 2, z, s / 2 + 0.05, s / 2, s / 2 + 0.05));
}

export function buildLantern(
  scene: THREE.Scene,
  x: number,
  z: number,
  intensity = 0.5
): void {
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.08, 2.2, 6),
    new THREE.MeshLambertMaterial({ color: 0x2a2520 })
  );
  pole.position.set(x, 1.1, z);
  pole.castShadow = true;
  scene.add(pole);
  const lamp = new THREE.Mesh(
    new THREE.BoxGeometry(0.35, 0.45, 0.35),
    new THREE.MeshLambertMaterial({
      color: 0xffe8a0,
      emissive: 0xffaa44,
      emissiveIntensity: 0.6,
    })
  );
  lamp.position.set(x, 2.05, z);
  scene.add(lamp);
  const light = new THREE.PointLight(0xffcc88, intensity, 14);
  light.position.set(x, 2, z);
  scene.add(light);
}

/** Wooden pier / dock over water. */
export function buildDock(
  scene: THREE.Scene,
  colliders: AABB[],
  x: number,
  z: number,
  length: number,
  rotY: number
): void {
  const plankMat = new THREE.MeshLambertMaterial({ color: 0x6b5344 });
  const postMat = new THREE.MeshLambertMaterial({ color: 0x4a3828 });
  const n = Math.max(3, Math.floor(length / 2.5));
  const step = length / n;
  for (let i = 0; i <= n; i++) {
    const tx = x + Math.sin(rotY) * i * step;
    const tz = z + Math.cos(rotY) * i * step;
    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.15, 0.2, 1.2, 6),
      postMat
    );
    post.position.set(tx, 0.6, tz);
    post.castShadow = true;
    scene.add(post);
    colliders.push(aabbFromBox(tx, 0.6, tz, 0.2, 0.6, 0.2));
  }
  for (let i = 0; i < n; i++) {
    const tx = x + Math.sin(rotY) * (i + 0.5) * step;
    const tz = z + Math.cos(rotY) * (i + 0.5) * step;
    const plank = new THREE.Mesh(
      new THREE.BoxGeometry(2.2, 0.12, step * 0.9),
      plankMat
    );
    plank.position.set(tx, 0.12, tz);
    plank.rotation.y = rotY;
    plank.castShadow = true;
    plank.receiveShadow = true;
    scene.add(plank);
  }
  const midX = x + Math.sin(rotY) * (length / 2);
  const midZ = z + Math.cos(rotY) * (length / 2);
  colliders.push(aabbFromBox(midX, 0.15, midZ, 1.2, 0.15, length / 2 + 0.5));
}

/** Simple sailing ship: hull + mast + sail. */
export function buildShip(
  scene: THREE.Scene,
  colliders: AABB[],
  x: number,
  z: number,
  rotY: number,
  scale = 1
): void {
  const g = new THREE.Group();
  g.position.set(x, 0, z);
  g.rotation.y = rotY;
  const s = scale;
  const hullMat = new THREE.MeshLambertMaterial({ color: 0x4a3828 });
  const deckMat = new THREE.MeshLambertMaterial({ color: 0x6b5344 });
  const mastMat = new THREE.MeshLambertMaterial({ color: 0x5c4033 });
  const sailMat = new THREE.MeshLambertMaterial({ color: 0xe8e4d8 });

  const hull = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5 * s, 0.7 * s, 2.8 * s, 10, 1, false, 0, Math.PI * 0.85),
    hullMat
  );
  hull.rotation.z = Math.PI / 2;
  hull.position.set(0, 0.35 * s, 0);
  g.add(hull);
  const deck = new THREE.Mesh(
    new THREE.BoxGeometry(2.6 * s, 0.12 * s, 1.2 * s),
    deckMat
  );
  deck.position.set(0, 0.42 * s, 0);
  g.add(deck);
  const mast = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08 * s, 0.1 * s, 2.2 * s, 8),
    mastMat
  );
  mast.position.set(0, 1.55 * s, 0);
  g.add(mast);
  const sail = new THREE.Mesh(
    new THREE.PlaneGeometry(1.2 * s, 1.8 * s),
    sailMat
  );
  sail.position.set(0, 1.6 * s, 0.3 * s);
  sail.rotation.x = -0.15;
  g.add(sail);
  const cabin = new THREE.Mesh(
    new THREE.BoxGeometry(0.7 * s, 0.5 * s, 0.9 * s),
    new THREE.MeshLambertMaterial({ color: 0x5c4033 })
  );
  cabin.position.set(-0.5 * s, 0.7 * s, 0);
  g.add(cabin);
  shadow(g);
  scene.add(g);
  colliders.push(aabbFromBox(x, 0.5 * s, z, 1.5 * s, 0.5 * s, 0.7 * s));
}

/** Enduro-style motorcycle (no collider — player drives it). */
export function buildEnduroBike(): THREE.Group {
  const g = new THREE.Group();
  const frameMat = new THREE.MeshLambertMaterial({ color: 0x2a2a2a });
  const wheelMat = new THREE.MeshLambertMaterial({ color: 0x1a1a1a });
  const seatMat = new THREE.MeshLambertMaterial({ color: 0x3d2817 });
  const chromeMat = new THREE.MeshLambertMaterial({ color: 0x6a6a72 });

  const wheelR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.14, 16),
    wheelMat
  );
  wheelR.rotation.z = Math.PI / 2;
  wheelR.position.set(0.55, 0.38, 0);
  g.add(wheelR);
  const wheelF = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.38, 0.12, 16),
    wheelMat
  );
  wheelF.rotation.z = Math.PI / 2;
  wheelF.position.set(-0.6, 0.38, 0);
  g.add(wheelF);

  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(1.05, 0.12, 0.22),
    frameMat
  );
  frame.position.set(0, 0.52, 0);
  g.add(frame);
  const tank = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.22, 0.5, 10, 1, false, 0, Math.PI),
    new THREE.MeshLambertMaterial({ color: 0x4a3828 })
  );
  tank.rotation.z = Math.PI / 2;
  tank.position.set(-0.15, 0.68, 0);
  g.add(tank);
  const seat = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.1, 0.35),
    seatMat
  );
  seat.position.set(0.25, 0.6, 0);
  g.add(seat);
  const fork = new THREE.Mesh(
    new THREE.BoxGeometry(0.08, 0.5, 0.08),
    chromeMat
  );
  fork.position.set(-0.6, 0.62, 0);
  g.add(fork);
  const bars = new THREE.Mesh(
    new THREE.CylinderGeometry(0.02, 0.02, 0.7, 6),
    chromeMat
  );
  bars.rotation.z = Math.PI / 2;
  bars.position.set(-0.6, 0.88, 0);
  g.add(bars);
  const headlight = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.14, 0.06, 8),
    new THREE.MeshLambertMaterial({ color: 0xe8e8e0, emissive: 0x444430, emissiveIntensity: 0.2 })
  );
  headlight.rotation.z = Math.PI / 2;
  headlight.position.set(-0.72, 0.5, 0);
  g.add(headlight);
  const exhaust = new THREE.Mesh(
    new THREE.CylinderGeometry(0.04, 0.06, 0.4, 6),
    new THREE.MeshLambertMaterial({ color: 0x3a3a38 })
  );
  exhaust.rotation.z = Math.PI / 2;
  exhaust.position.set(0.5, 0.45, -0.18);
  g.add(exhaust);
  shadow(g);
  return g;
}

export function buildCampfire(scene: THREE.Scene, x: number, z: number): void {
  for (let i = 0; i < 5; i++) {
    const log = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.1, 0.9, 5),
      new THREE.MeshLambertMaterial({ color: 0x4a3728 })
    );
    log.position.set(x + (i % 2) * 0.15, 0.2, z + i * 0.08);
    log.rotation.z = Math.PI / 2;
    log.rotation.y = i * 0.7;
    log.castShadow = true;
    scene.add(log);
  }
  const fire = new THREE.Mesh(
    new THREE.ConeGeometry(0.25, 0.5, 6),
    new THREE.MeshBasicMaterial({ color: 0xff6622 })
  );
  fire.position.set(x, 0.35, z);
  scene.add(fire);
  const light = new THREE.PointLight(0xff8844, 1.2, 8);
  light.position.set(x, 0.6, z);
  scene.add(light);
}

export function buildFlowerPatch(
  scene: THREE.Scene,
  cx: number,
  cz: number,
  rand: () => number
): void {
  const colors = [0xd4a5c7, 0xe8d060, 0xffffff, 0xa8d4e6, 0xc4e080];
  const n = 12 + Math.floor(rand() * 10);
  for (let i = 0; i < n; i++) {
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.15 + rand() * 0.1, 4),
      new THREE.MeshLambertMaterial({ color: 0x2d5a2d })
    );
    const fx = cx + (rand() - 0.5) * 2.5;
    const fz = cz + (rand() - 0.5) * 2.5;
    stem.position.set(fx, 0.08, fz);
    scene.add(stem);
    const petal = new THREE.Mesh(
      new THREE.SphereGeometry(0.06 + rand() * 0.03, 6, 6),
      new THREE.MeshLambertMaterial({
        color: colors[Math.floor(rand() * colors.length)]!,
      })
    );
    petal.position.set(fx, 0.18 + rand() * 0.05, fz);
    scene.add(petal);
  }
}

export function buildBroadleafTree(
  scene: THREE.Scene,
  colliders: AABB[],
  x: number,
  z: number,
  rand: () => number
): void {
  const h = 0.55 + rand() * 0.35;
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2 * h, 0.32 * h, 2 * h, 8),
    trunkMat.clone()
  );
  trunk.position.set(x, 1 * h, z);
  trunk.castShadow = true;
  scene.add(trunk);
  for (let k = 0; k < 3; k++) {
    const fol = new THREE.Mesh(
      new THREE.SphereGeometry(1.1 * h + rand() * 0.3, 8, 6),
      leafMid.clone()
    );
    fol.position.set(
      x + (rand() - 0.5) * 0.8,
      2.4 * h + k * 0.5,
      z + (rand() - 0.5) * 0.8
    );
    fol.castShadow = true;
    scene.add(fol);
  }
  colliders.push(aabbFromBox(x, 1 * h, z, 0.35 * h, 1.2 * h, 0.35 * h));
}

export function buildCloud(scene: THREE.Scene, x: number, y: number, z: number, rand: () => number): void {
  const g = new THREE.Group();
  g.position.set(x, y, z);
  const mat = new THREE.MeshLambertMaterial({
    color: 0xf5f8fc,
    transparent: true,
    opacity: 0.88,
  });
  for (let i = 0; i < 5; i++) {
    const puff = new THREE.Mesh(
      new THREE.SphereGeometry(3 + rand() * 4, 8, 6),
      mat
    );
    puff.position.set((rand() - 0.5) * 8, (rand() - 0.5) * 2, (rand() - 0.5) * 6);
    g.add(puff);
  }
  scene.add(g);
}

export function buildSignpost(
  scene: THREE.Scene,
  colliders: AABB[],
  x: number,
  z: number,
  rotY: number
): void {
  const post = new THREE.Mesh(
    new THREE.BoxGeometry(0.18, 1.6, 0.18),
    woodMat.clone()
  );
  post.position.set(x, 0.8, z);
  post.castShadow = true;
  scene.add(post);
  const board = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.5, 0.08),
    new THREE.MeshLambertMaterial({ color: 0x5c4a32 })
  );
  board.position.set(x, 1.35, z);
  board.rotation.y = rotY;
  board.castShadow = true;
  scene.add(board);
  colliders.push(aabbFromBox(x, 0.5, z, 0.2, 0.9, 0.2));
}

export function buildRuinArch(
  scene: THREE.Scene,
  colliders: AABB[],
  x: number,
  z: number
): void {
  const stone = new THREE.MeshLambertMaterial({ color: 0x6a6a72 });
  const h = 3.2;
  const w = 2.4;
  const left = new THREE.Mesh(new THREE.BoxGeometry(0.6, h, 0.7), stone);
  left.position.set(x - w / 2, h / 2, z);
  const right = new THREE.Mesh(new THREE.BoxGeometry(0.6, h, 0.7), stone);
  right.position.set(x + w / 2, h / 2, z);
  const top = new THREE.Mesh(new THREE.BoxGeometry(w + 1.2, 0.55, 0.85), stone);
  top.position.set(x, h, z);
  left.castShadow = true;
  right.castShadow = true;
  top.castShadow = true;
  scene.add(left);
  scene.add(right);
  scene.add(top);
  colliders.push(aabbFromBox(x - w / 2, h / 2, z, 0.4, h / 2, 0.45));
  colliders.push(aabbFromBox(x + w / 2, h / 2, z, 0.4, h / 2, 0.45));
}

const cobble = new THREE.MeshLambertMaterial({ color: 0x5a5a62 });
const stoneWall = new THREE.MeshLambertMaterial({ color: 0x6a6868 });
const stoneDark = new THREE.MeshLambertMaterial({ color: 0x5a5858 });
const timber = new THREE.MeshLambertMaterial({ color: 0x5c4033 });

/** One fortress-style wall segment: tall base + battlements (merlons) on top. */
function fortWallSegment(
  scene: THREE.Scene,
  colliders: AABB[],
  wx: number,
  wz: number,
  ang: number,
  segW: number,
  segH: number,
  segD: number
): void {
  const g = new THREE.Group();
  g.position.set(wx, 0, wz);
  g.rotation.y = ang + Math.PI / 2;
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(segW, segH, segD),
    stoneWall.clone()
  );
  base.position.y = segH / 2;
  base.castShadow = true;
  g.add(base);
  const merlonH = 0.95;
  const merlonW = segW / 3.2;
  for (let i = 0; i < 3; i++) {
    const m = new THREE.Mesh(
      new THREE.BoxGeometry(merlonW, merlonH, segD * 1.05),
      stoneDark.clone()
    );
    m.position.set((i - 1) * (segW * 0.36), segH + merlonH / 2, 0);
    m.castShadow = true;
    g.add(m);
  }
  scene.add(g);
  colliders.push(aabbFromBox(wx, segH / 2 + 0.3, wz, segW / 2 + 0.1, segH / 2 + merlonH * 0.5, segD / 2 + 0.05));
}
const plaster = new THREE.MeshLambertMaterial({ color: 0xc8c0b8 });
const slateRoof = new THREE.MeshLambertMaterial({ color: 0x3a4550 });
const tileRoof = new THREE.MeshLambertMaterial({ color: 0x6b4040 });

function cityTownhouse(
  scene: THREE.Scene,
  colliders: AABB[],
  cx: number,
  cz: number,
  w: number,
  d: number,
  floors: number,
  rotY: number
): void {
  const g = new THREE.Group();
  g.position.set(cx, 0, cz);
  g.rotation.y = rotY;
  const wallH = 2.8 * floors;
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(w, wallH, d),
    plaster.clone()
  );
  walls.position.y = wallH / 2;
  g.add(walls);
  const roof = new THREE.Mesh(
    new THREE.CylinderGeometry(0, Math.hypot(w, d) * 0.38, 1.8, 4),
    slateRoof.clone()
  );
  roof.position.y = wallH + 0.85;
  roof.rotation.y = Math.PI / 4;
  g.add(roof);
  for (const sx of [-w * 0.28, w * 0.28]) {
    const win = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 0.7, 0.06),
      new THREE.MeshLambertMaterial({ color: 0x3a4a5a, emissive: 0x0a1520, emissiveIntensity: 0.12 })
    );
    win.position.set(sx, wallH * 0.45, d / 2 + 0.02);
    g.add(win);
  }
  shadow(g);
  scene.add(g);
  colliders.push(aabbFromBox(cx, wallH / 2, cz, w / 2 + 0.15, wallH / 2 + 0.5, d / 2 + 0.15));
}

function cityShop(
  scene: THREE.Scene,
  colliders: AABB[],
  cx: number,
  cz: number,
  w: number,
  d: number,
  rotY: number
): void {
  const g = new THREE.Group();
  g.position.set(cx, 0, cz);
  g.rotation.y = rotY;
  const h = 3.2;
  const base = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), timber.clone());
  base.position.y = h / 2;
  g.add(base);
  const awning = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.6, 0.12, 1.4),
    new THREE.MeshLambertMaterial({ color: 0x8b4513 })
  );
  awning.position.set(0, 2.4, d / 2 + 0.5);
  g.add(awning);
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.2, 0.35, d + 0.3),
    tileRoof.clone()
  );
  roof.position.y = h + 0.2;
  g.add(roof);
  shadow(g);
  scene.add(g);
  colliders.push(aabbFromBox(cx, h / 2, cz, w / 2 + 0.2, h / 2 + 0.3, d / 2 + 0.2));
}

function cityTower(
  scene: THREE.Scene,
  colliders: AABB[],
  cx: number,
  cz: number,
  h: number,
  r: number
): void {
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(r * 0.85, r, h, 10),
    stoneWall.clone()
  );
  body.position.set(cx, h / 2, cz);
  body.castShadow = true;
  scene.add(body);
  const top = new THREE.Mesh(
    new THREE.ConeGeometry(r * 1.1, 2.2, 8),
    slateRoof.clone()
  );
  top.position.set(cx, h + 1.1, cz);
  top.castShadow = true;
  scene.add(top);
  for (let i = 0; i < 3; i++) {
    const slit = new THREE.Mesh(
      new THREE.BoxGeometry(0.15, 0.5, 0.2),
      new THREE.MeshLambertMaterial({ color: 0x1a1a20 })
    );
    const a = (i / 3) * Math.PI * 2;
    slit.position.set(cx + Math.cos(a) * r * 0.92, h * 0.35 + i * 1.2, cz + Math.sin(a) * r * 0.92);
    slit.rotation.y = -a;
    scene.add(slit);
  }
  colliders.push(aabbFromBox(cx, h / 2, cz, r + 0.2, h / 2 + 1, r + 0.2));
}

function cityWell(scene: THREE.Scene, colliders: AABB[], cx: number, cz: number): void {
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.1, 0.25, 8, 20),
    stoneWall.clone()
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.set(cx, 0.35, cz);
  ring.castShadow = true;
  scene.add(ring);
  const water = new THREE.Mesh(
    new THREE.CircleGeometry(0.85, 16),
    new THREE.MeshLambertMaterial({ color: 0x2a5580 })
  );
  water.rotation.x = -Math.PI / 2;
  water.position.set(cx, 0.12, cz);
  scene.add(water);
  const roof = new THREE.Mesh(
    new THREE.ConeGeometry(1.8, 1.4, 6),
    timber.clone()
  );
  roof.position.set(cx, 1.5, cz);
  roof.castShadow = true;
  scene.add(roof);
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.12, 0.15, 2.2, 6),
    timber.clone()
  );
  pole.position.set(cx, 1.1, cz);
  scene.add(pole);
  colliders.push(aabbFromBox(cx, 0.4, cz, 1.35, 0.5, 1.35));
}

function marketStall(
  scene: THREE.Scene,
  colliders: AABB[],
  cx: number,
  cz: number,
  rotY: number
): void {
  const g = new THREE.Group();
  g.position.set(cx, 0, cz);
  g.rotation.y = rotY;
  const table = new THREE.Mesh(
    new THREE.BoxGeometry(2.2, 0.5, 1.4),
    timber.clone()
  );
  table.position.y = 0.45;
  g.add(table);
  const cloth = new THREE.Mesh(
    new THREE.BoxGeometry(2.4, 0.08, 1.6),
    new THREE.MeshLambertMaterial({ color: 0x8b3a3a })
  );
  cloth.position.y = 0.75;
  g.add(cloth);
  const pole1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.08, 1.6, 6),
    timber.clone()
  );
  pole1.position.set(-1, 0.9, -0.5);
  g.add(pole1);
  const pole2 = pole1.clone();
  pole2.position.set(1, 0.9, -0.5);
  g.add(pole2);
  shadow(g);
  scene.add(g);
  colliders.push(aabbFromBox(cx, 0.5, cz, 1.3, 0.55, 0.85));
}

/** Lighthouse: stone tower + lantern room + light. */
export function buildLighthouse(
  scene: THREE.Scene,
  colliders: AABB[],
  cx: number,
  cz: number
): void {
  const towerH = 12;
  const r = 1.4;
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(r * 0.92, r * 1.15, towerH, 12),
    new THREE.MeshLambertMaterial({ color: 0xd8d4c8 })
  );
  body.position.set(cx, towerH / 2, cz);
  body.castShadow = true;
  scene.add(body);
  const band = new THREE.Mesh(
    new THREE.CylinderGeometry(r * 1.02, r * 1.02, 0.5, 12),
    new THREE.MeshLambertMaterial({ color: 0x4a4540 })
  );
  band.position.set(cx, towerH - 0.8, cz);
  scene.add(band);
  const lanternRoom = new THREE.Mesh(
    new THREE.CylinderGeometry(r * 1.2, r * 1.2, 1.8, 12),
    new THREE.MeshLambertMaterial({ color: 0x3a4550 })
  );
  lanternRoom.position.set(cx, towerH + 0.9, cz);
  lanternRoom.castShadow = true;
  scene.add(lanternRoom);
  const dome = new THREE.Mesh(
    new THREE.ConeGeometry(r * 1.15, 1.2, 12),
    new THREE.MeshLambertMaterial({ color: 0x5a3828 })
  );
  dome.position.set(cx, towerH + 2.4, cz);
  dome.castShadow = true;
  scene.add(dome);
  const lamp = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 10, 8),
    new THREE.MeshLambertMaterial({ color: 0xffeed8, emissive: 0xffaa44, emissiveIntensity: 0.5 })
  );
  lamp.position.set(cx, towerH + 1.5, cz);
  scene.add(lamp);
  const light = new THREE.PointLight(0xffdd99, 1.2, 28);
  light.position.set(cx, towerH + 1.5, cz);
  scene.add(light);
  colliders.push(aabbFromBox(cx, towerH / 2, cz, r + 0.3, towerH / 2 + 1, r + 0.3));
}

/** Warehouse: large timber/stone building for goods. */
export function buildWarehouse(
  scene: THREE.Scene,
  colliders: AABB[],
  cx: number,
  cz: number,
  w: number,
  d: number,
  rotY: number
): void {
  const g = new THREE.Group();
  g.position.set(cx, 0, cz);
  g.rotation.y = rotY;
  const h = 4.2;
  const walls = new THREE.Mesh(
    new THREE.BoxGeometry(w, h, d),
    new THREE.MeshLambertMaterial({ color: 0x6b5a4a })
  );
  walls.position.y = h / 2;
  g.add(walls);
  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(w + 0.4, 0.5, d + 0.4),
    new THREE.MeshLambertMaterial({ color: 0x4a3828 })
  );
  roof.position.y = h + 0.25;
  g.add(roof);
  const door = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 2.8, 0.12),
    new THREE.MeshLambertMaterial({ color: 0x3d2817 })
  );
  door.position.set(0, 1.5, d / 2 + 0.02);
  g.add(door);
  for (let i = 0; i < 4; i++) {
    const win = new THREE.Mesh(
      new THREE.BoxGeometry(0.7, 0.6, 0.06),
      new THREE.MeshLambertMaterial({ color: 0x2a3540, emissive: 0x0a1018, emissiveIntensity: 0.1 })
    );
    win.position.set((i % 2) * 2.2 - 1.1, 2.2 + Math.floor(i / 2) * 1.2, d / 2 + 0.02);
    g.add(win);
  }
  shadow(g);
  scene.add(g);
  colliders.push(aabbFromBox(cx, h / 2, cz, w / 2 + 0.2, h / 2 + 0.5, d / 2 + 0.2));
}

/**
 * Seaside / harbor city: open to the sea (south), wall on land side, lighthouse, docks, warehouses, streets.
 * cx, cz = center of town (plaza); sea is assumed to be toward negative z.
 */
export function buildSeasideCity(
  scene: THREE.Scene,
  colliders: AABB[],
  cx: number,
  cz: number,
  rand: () => number
): void {
  const R = 42;
  const cob = new THREE.Mesh(
    new THREE.PlaneGeometry(R * 2.2, R * 1.9),
    cobble.clone()
  );
  cob.rotation.x = -Math.PI / 2;
  cob.position.set(cx, 0.022, cz);
  cob.receiveShadow = true;
  scene.add(cob);

  const streetW = 5;
  const mainStreet = new THREE.Mesh(
    new THREE.PlaneGeometry(streetW, R * 1.7),
    new THREE.MeshLambertMaterial({ color: 0x4a4848 })
  );
  mainStreet.rotation.x = -Math.PI / 2;
  mainStreet.position.set(cx, 0.025, cz);
  mainStreet.receiveShadow = true;
  scene.add(mainStreet);
  const crossStreet = new THREE.Mesh(
    new THREE.PlaneGeometry(R * 1.6, streetW),
    new THREE.MeshLambertMaterial({ color: 0x4a4848 })
  );
  crossStreet.rotation.x = -Math.PI / 2;
  crossStreet.position.set(cx, 0.025, cz);
  crossStreet.receiveShadow = true;
  scene.add(crossStreet);

  const wallH = 3.5;
  const wallSegs = 22;
  for (let i = 0; i < wallSegs; i++) {
    const t = i / wallSegs;
    const ang = Math.PI * 0.5 + t * Math.PI * 0.88;
    const wx = cx + Math.cos(ang) * (R - 0.5);
    const wz = cz + Math.sin(ang) * (R - 0.5);
    if (Math.sin(ang) < 0.5) continue;
    fortWallSegment(scene, colliders, wx, wz, ang, 2.7, wallH, 0.55);
  }
  cityTower(scene, colliders, cx - 6, cz + R - 2, 10, 1.3);
  cityTower(scene, colliders, cx + 6, cz + R - 2, 10, 1.3);
  const gateLintel = new THREE.Mesh(
    new THREE.BoxGeometry(8, 1, 1.3),
    stoneWall.clone()
  );
  gateLintel.position.set(cx, 3.6, cz + R - 2.2);
  gateLintel.castShadow = true;
  scene.add(gateLintel);
  const gatePillarL = new THREE.Mesh(
    new THREE.BoxGeometry(1, 3.6, 1.2),
    stoneDark.clone()
  );
  gatePillarL.position.set(cx - 3.6, 1.8, cz + R - 2.2);
  gatePillarL.castShadow = true;
  scene.add(gatePillarL);
  const gatePillarR = new THREE.Mesh(
    new THREE.BoxGeometry(1, 3.6, 1.2),
    stoneDark.clone()
  );
  gatePillarR.position.set(cx + 3.6, 1.8, cz + R - 2.2);
  gatePillarR.castShadow = true;
  scene.add(gatePillarR);
  colliders.push(aabbFromBox(cx, 3.6, cz + R - 2.2, 3.5, 0.55, 0.5));

  buildLighthouse(scene, colliders, cx - R - 3, cz - 10);

  buildWarehouse(scene, colliders, cx - 20, cz + 14, 9, 7, 0.15);
  buildWarehouse(scene, colliders, cx + 18, cz + 16, 8, 6.5, -0.2);
  buildWarehouse(scene, colliders, cx - 24, cz - 4, 7, 6, Math.PI / 2);
  buildWarehouse(scene, colliders, cx + 22, cz + 2, 7.5, 5.5, -Math.PI / 2);
  cityTownhouse(scene, colliders, cx - 26, cz - 8, 3.8, 4, 2, Math.PI / 2);
  cityTownhouse(scene, colliders, cx + 24, cz - 10, 4, 4.2, 2, -Math.PI / 2);
  cityShop(scene, colliders, cx - 14, cz - 18, 5.5, 4.5, 0);
  cityShop(scene, colliders, cx + 12, cz - 16, 5.2, 4, 0.1);
  cityTownhouse(scene, colliders, cx - 10, cz + 20, 4.2, 4.5, 2, Math.PI);
  cityTownhouse(scene, colliders, cx + 14, cz + 16, 3.6, 4, 2, 0);
  cityShop(scene, colliders, cx - 28, cz + 6, 5.5, 4, Math.PI / 2);
  cityTownhouse(scene, colliders, cx + 26, cz + 4, 4, 3.8, 2, -Math.PI / 2);
  cityTownhouse(scene, colliders, cx - 8, cz - 22, 4, 4.2, 2, 0);
  cityTownhouse(scene, colliders, cx + 8, cz + 22, 4.2, 4, 2, Math.PI);
  cityShop(scene, colliders, cx - 16, cz + 12, 5, 4.2, 0.2);
  cityShop(scene, colliders, cx + 16, cz - 12, 5.2, 4.5, -0.15);
  cityTownhouse(scene, colliders, cx - 22, cz + 2, 3.8, 4, 2, Math.PI / 2);
  cityTownhouse(scene, colliders, cx + 20, cz - 4, 4, 4, 2, -Math.PI / 2);

  cityWell(scene, colliders, cx, cz);

  marketStall(scene, colliders, cx - 5, cz + 4, 0.3);
  marketStall(scene, colliders, cx + 6, cz + 3, -0.2);
  marketStall(scene, colliders, cx - 4, cz - 5, 1.2);
  marketStall(scene, colliders, cx + 5, cz - 4, -1);
  marketStall(scene, colliders, cx - 6, cz - 2, 0.8);
  marketStall(scene, colliders, cx + 4, cz + 5, -0.5);

  for (let i = 0; i < 14; i++) {
    const ang = (i / 14) * Math.PI * 1.25 + 0.35;
    const rr = R - 8 + rand() * 3;
    buildLantern(scene, cx + Math.cos(ang) * rr, cz + Math.sin(ang) * rr, 0.4);
  }
  buildFlowerPatch(scene, cx + 10, cz + 8, rand);
  buildFlowerPatch(scene, cx - 12, cz + 6, rand);
  buildFlowerPatch(scene, cx - 8, cz - 10, rand);
  buildFlowerPatch(scene, cx + 12, cz - 8, rand);
}

/**
 * Walled city: cobble district, cross streets, gate, many buildings.
 * cx, cz = city center (plaza).
 */
export function buildCity(
  scene: THREE.Scene,
  colliders: AABB[],
  cx: number,
  cz: number,
  rand: () => number
): void {
  const R = 50;
  const cob = new THREE.Mesh(
    new THREE.CircleGeometry(R, 56),
    cobble.clone()
  );
  cob.rotation.x = -Math.PI / 2;
  cob.position.set(cx, 0.022, cz);
  cob.receiveShadow = true;
  scene.add(cob);

  const streetW = 6;
  const ns = new THREE.Mesh(
    new THREE.PlaneGeometry(streetW, R * 2 + 6),
    new THREE.MeshLambertMaterial({ color: 0x4a4848 })
  );
  ns.rotation.x = -Math.PI / 2;
  ns.position.set(cx, 0.025, cz);
  ns.receiveShadow = true;
  scene.add(ns);
  const ew = new THREE.Mesh(
    new THREE.PlaneGeometry(R * 2 + 6, streetW),
    new THREE.MeshLambertMaterial({ color: 0x4a4848 })
  );
  ew.rotation.x = -Math.PI / 2;
  ew.position.set(cx, 0.025, cz);
  ew.receiveShadow = true;
  scene.add(ew);

  const wallH = 3.9;
  const wallT = 0.6;
  const segments = 28;
  for (let i = 0; i < segments; i++) {
    const ang = (i / segments) * Math.PI * 2;
    const wx = cx + Math.cos(ang) * (R - 0.3);
    const wz = cz + Math.sin(ang) * (R - 0.3);
    if (Math.sin(ang) < -0.75 && Math.abs(Math.cos(ang)) < 0.35) continue;
    fortWallSegment(scene, colliders, wx, wz, ang, 2.9, wallH, wallT);
  }

  cityTower(scene, colliders, cx - 6, cz + R - 2, 13, 1.55);
  cityTower(scene, colliders, cx + 6, cz + R - 2, 13, 1.55);
  cityTower(scene, colliders, cx - R + 3, cz - 8, 11, 1.35);
  cityTower(scene, colliders, cx + R - 3, cz - 8, 11, 1.35);
  cityTower(scene, colliders, cx - R + 3, cz + 10, 11, 1.35);
  cityTower(scene, colliders, cx + R - 3, cz + 10, 11, 1.35);
  const gateLintel = new THREE.Mesh(
    new THREE.BoxGeometry(10, 1.1, 1.6),
    stoneWall.clone()
  );
  gateLintel.position.set(cx, 4, cz + R - 1.4);
  gateLintel.castShadow = true;
  scene.add(gateLintel);
  const gatePillarL = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 4.2, 1.4),
    stoneDark.clone()
  );
  gatePillarL.position.set(cx - 4.2, 2.1, cz + R - 1.4);
  gatePillarL.castShadow = true;
  scene.add(gatePillarL);
  const gatePillarR = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 4.2, 1.4),
    stoneDark.clone()
  );
  gatePillarR.position.set(cx + 4.2, 2.1, cz + R - 1.4);
  gatePillarR.castShadow = true;
  scene.add(gatePillarR);
  colliders.push(aabbFromBox(cx, 4, cz + R - 1.4, 4.5, 0.6, 0.5));

  cityTownhouse(scene, colliders, cx - 22, cz + 16, 4, 4.5, 2, 0);
  cityTownhouse(scene, colliders, cx + 20, cz + 18, 3.8, 4.2, 2, 0.1);
  cityShop(scene, colliders, cx - 26, cz - 14, 6.5, 5, 0);
  cityShop(scene, colliders, cx + 24, cz - 16, 5.5, 4.5, -0.15);
  cityTownhouse(scene, colliders, cx - 20, cz - 22, 4.2, 4, 3, Math.PI / 2);
  cityTownhouse(scene, colliders, cx + 18, cz + 26, 3.6, 4.8, 2, Math.PI);
  cityTownhouse(scene, colliders, cx - 30, cz - 6, 4, 4, 2, Math.PI / 2);
  cityShop(scene, colliders, cx + 28, cz + 8, 5, 4, Math.PI / 2);
  cityTower(scene, colliders, cx - 32, cz + 6, 15, 1.4);
  cityTownhouse(scene, colliders, cx + 12, cz - 30, 5, 4.5, 2, 0);
  cityTownhouse(scene, colliders, cx - 12, cz + 30, 4.5, 4, 2, Math.PI);
  cityTownhouse(scene, colliders, cx - 28, cz + 12, 4, 4.2, 2, 0);
  cityTownhouse(scene, colliders, cx + 26, cz - 10, 4.2, 4, 2, Math.PI / 2);
  cityShop(scene, colliders, cx - 18, cz - 26, 6, 5, 0.1);
  cityShop(scene, colliders, cx + 16, cz + 22, 5.5, 4.5, Math.PI);
  cityTownhouse(scene, colliders, cx - 14, cz + 20, 4, 4.5, 2, Math.PI);
  cityTownhouse(scene, colliders, cx + 14, cz - 20, 4.2, 4, 2, 0);
  cityTownhouse(scene, colliders, cx - 24, cz - 16, 3.8, 4, 2, Math.PI / 2);
  cityTownhouse(scene, colliders, cx + 22, cz + 14, 4, 4.2, 2, -Math.PI / 2);
  cityShop(scene, colliders, cx - 10, cz + 28, 5.2, 4, Math.PI);
  cityShop(scene, colliders, cx + 10, cz - 28, 5, 4.5, 0);

  cityWell(scene, colliders, cx, cz);

  marketStall(scene, colliders, cx - 8, cz + 6, 0.4);
  marketStall(scene, colliders, cx + 9, cz + 5, -0.3);
  marketStall(scene, colliders, cx - 7, cz - 8, 2.2);
  marketStall(scene, colliders, cx + 8, cz - 7, -2);
  marketStall(scene, colliders, cx - 9, cz - 4, 0.6);
  marketStall(scene, colliders, cx + 7, cz + 7, -0.8);
  marketStall(scene, colliders, cx - 5, cz + 9, 1.2);
  marketStall(scene, colliders, cx + 6, cz - 10, -1.5);

  for (let i = 0; i < 18; i++) {
    const ang = (i / 18) * Math.PI * 2;
    const rr = R - 10 + rand() * 4;
    buildLantern(scene, cx + Math.cos(ang) * rr, cz + Math.sin(ang) * rr, 0.35);
  }

  buildFlowerPatch(scene, cx + 14, cz + 14, rand);
  buildFlowerPatch(scene, cx - 16, cz + 12, rand);
  buildFlowerPatch(scene, cx - 12, cz - 18, rand);
  buildFlowerPatch(scene, cx + 14, cz - 14, rand);
  buildFlowerPatch(scene, cx + 18, cz + 6, rand);
  buildFlowerPatch(scene, cx - 18, cz - 8, rand);
}

