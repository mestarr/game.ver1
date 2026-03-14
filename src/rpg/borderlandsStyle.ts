import * as THREE from "three";

/** 1D ramp: bold 3-step cel shading (shadow / mid / highlight) — reads clearly, not flat. */
export function makeToonGradientMap(): THREE.DataTexture {
  const c = document.createElement("canvas");
  c.width = 4;
  c.height = 1;
  const ctx = c.getContext("2d")!;
  const g = ctx.createLinearGradient(0, 0, 4, 0);
  g.addColorStop(0, "#1a1a1a");
  g.addColorStop(0.38, "#505050");
  g.addColorStop(0.5, "#505050");
  g.addColorStop(0.52, "#a0a0a0");
  g.addColorStop(0.72, "#a0a0a0");
  g.addColorStop(0.75, "#f0f0f0");
  g.addColorStop(1, "#ffffff");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 4, 1);
  const tex = new THREE.CanvasTexture(c);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  return tex;
}

let gradientMap: THREE.DataTexture | null = null;

function bumpSaturation(color: THREE.Color, factor: number): THREE.Color {
  const hsl = { h: 0, s: 0, l: 0 };
  color.getHSL(hsl);
  hsl.s = Math.min(1, hsl.s * factor);
  hsl.l = Math.max(0.15, Math.min(0.88, hsl.l * 0.95 + 0.06));
  const out = new THREE.Color();
  out.setHSL(hsl.h, hsl.s, hsl.l);
  return out;
}

/**
 * Swap Lambert/Phong-like materials for MeshToonMaterial (cel shading).
 * Skips sky, ShaderMaterial, and meshes marked userData.celShade === false.
 */
export function applyCelShading(scene: THREE.Scene): void {
  if (!gradientMap) gradientMap = makeToonGradientMap();
  scene.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    if (obj.userData.celShade === false) return;
    const mat = obj.material;
    const list = Array.isArray(mat) ? mat : [mat];
    const next: THREE.Material[] = [];
    for (const m of list) {
      if (
        m instanceof THREE.ShaderMaterial ||
        m.type === "ShaderMaterial"
      ) {
        next.push(m);
        continue;
      }
      if (m instanceof THREE.MeshLambertMaterial) {
        const col = bumpSaturation(m.color.clone(), 1.12);
        const t = new THREE.MeshToonMaterial({
          color: col,
          map: m.map || undefined,
          transparent: m.transparent,
          opacity: m.opacity,
          side: m.side,
          depthWrite: m.depthWrite,
        });
        if (m.emissive && m.emissive.getHex() > 0) {
          t.emissive.copy(m.emissive);
          t.emissiveIntensity = m.emissiveIntensity ?? 1;
        }
        t.gradientMap = gradientMap;
        next.push(t);
      } else if (m instanceof THREE.MeshPhongMaterial) {
        const col = bumpSaturation(m.color.clone(), 1.08);
        const t = new THREE.MeshToonMaterial({
          color: col,
          transparent: m.transparent,
          opacity: m.opacity,
          shininess: 0,
        });
        t.gradientMap = gradientMap;
        if (m.emissive && m.emissive.getHex() > 0) {
          t.emissive.copy(m.emissive);
          t.emissiveIntensity = m.emissiveIntensity ?? 0.15;
        }
        next.push(t);
      } else if (m instanceof THREE.MeshBasicMaterial) {
        const col = bumpSaturation(m.color.clone(), 1.05);
        const t = new THREE.MeshToonMaterial({
          color: col,
          transparent: m.transparent,
          opacity: m.opacity,
          depthWrite: m.depthWrite,
        });
        t.gradientMap = gradientMap;
        next.push(t);
      } else {
        next.push(m);
      }
    }
    obj.material = list.length === 1 ? next[0]! : next;
  });
}

/** Meshes that should get ink outlines (skip sky, huge ground, water sheets). */
export function meshesForOutline(scene: THREE.Scene): THREE.Object3D[] {
  const out: THREE.Object3D[] = [];
  scene.traverse((o) => {
    if (!(o instanceof THREE.Mesh)) return;
    if (o.userData.skipOutline) return;
    const g = o.geometry;
    if (!g) return;
    if (g instanceof THREE.SphereGeometry && g.parameters.radius > 100) return;
    if (g instanceof THREE.PlaneGeometry && g.parameters.width > 80) return;
    if (g instanceof THREE.CircleGeometry && g.parameters.radius > 40) return;
    out.push(o);
  });
  return out;
}
