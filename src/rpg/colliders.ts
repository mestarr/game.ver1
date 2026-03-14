import * as THREE from "three";

export type AABB = {
  min: THREE.Vector3;
  max: THREE.Vector3;
};

export function aabbFromBox(
  cx: number,
  cy: number,
  cz: number,
  hx: number,
  hy: number,
  hz: number
): AABB {
  return {
    min: new THREE.Vector3(cx - hx, cy - hy, cz - hz),
    max: new THREE.Vector3(cx + hx, cy + hy, cz + hz),
  };
}

export function intersectsPlayer(
  a: AABB,
  px: number,
  py: number,
  pz: number,
  hw: number,
  ph: number
): boolean {
  return !(
    px + hw < a.min.x ||
    px - hw > a.max.x ||
    py + ph < a.min.y ||
    py > a.max.y ||
    pz + hw < a.min.z ||
    pz - hw > a.max.z
  );
}
