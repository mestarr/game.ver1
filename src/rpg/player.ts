import * as THREE from "three";
import type { AABB } from "./colliders";
import { intersectsPlayer } from "./colliders";

/** Human-sized hitbox (adult proportions). */
const PLAYER_W = 0.44;
const PLAYER_H = 1.72;
const GRAVITY = 32;
const JUMP = 9.5;
const SPEED = 6.8;
const SPEED_BIKE = 16.5;
const CAM_DIST = 5.2;
const CAM_MIN = 1.35;
const CAM_Y = 1.58;
/** Full orbit: look almost straight up and down (radians). */
const PITCH_MIN = -1.45;
const PITCH_MAX = 1.45;
const CAM_MIN_Y = 0.25;

export class ThirdPersonPlayer {
  camera: THREE.PerspectiveCamera;
  body = new THREE.Vector3();
  velocity = new THREE.Vector3();
  euler = new THREE.Euler(0, 0, 0, "YXZ");
  onGround = false;
  keys = new Set<string>();
  pointerLocked = false;
  /** When true, use bike speed and no walk animation. */
  riding = false;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
  }

  bind(canvas: HTMLElement, colliders: AABB[]): void {
    const worldCollide = (): AABB[] => colliders;

    canvas.addEventListener("click", () => {
      if (!this.pointerLocked) canvas.requestPointerLock();
    });
    document.addEventListener("pointerlockchange", () => {
      this.pointerLocked = document.pointerLockElement === canvas;
    });
    document.addEventListener("mousemove", (e) => {
      if (!this.pointerLocked) return;
      const s = 0.0022;
      this.euler.y -= e.movementX * s;
      this.euler.x -= e.movementY * s;
      this.euler.x = Math.max(PITCH_MIN, Math.min(PITCH_MAX, this.euler.x));
    });
    window.addEventListener("keydown", (e) => this.keys.add(e.code));
    window.addEventListener("keyup", (e) => this.keys.delete(e.code));

    this._colliders = worldCollide;
  }

  private _colliders!: () => AABB[];

  private collides(px: number, py: number, pz: number): boolean {
    const hw = PLAYER_W / 2;
    for (const a of this._colliders()) {
      if (intersectsPlayer(a, px, py, pz, hw, PLAYER_H)) return true;
    }
    return false;
  }

  private camClear(
    from: THREE.Vector3,
    dir: THREE.Vector3,
    maxD: number
  ): number {
    let t = 0;
    const step = 0.12;
    while (t < maxD) {
      t += step;
      const x = from.x + dir.x * t;
      const y = from.y + dir.y * t;
      const z = from.z + dir.z * t;
      for (const a of this._colliders()) {
        if (
          x >= a.min.x &&
          x <= a.max.x &&
          y >= a.min.y &&
          y <= a.max.y &&
          z >= a.min.z &&
          z <= a.max.z
        ) {
          return Math.max(CAM_MIN, t - step * 2);
        }
      }
    }
    return maxD;
  }

  update(dt: number): void {
    const yawQ = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(0, 1, 0),
      this.euler.y
    );
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(yawQ);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(yawQ);
    right.y = 0;
    right.normalize();

    const move = new THREE.Vector3();
    if (this.keys.has("KeyW")) move.add(forward);
    if (this.keys.has("KeyS")) move.sub(forward);
    if (this.keys.has("KeyD")) move.add(right);
    if (this.keys.has("KeyA")) move.sub(right);
    const speed = this.riding ? SPEED_BIKE : SPEED;
    if (move.lengthSq() > 0) {
      move.normalize().multiplyScalar(speed);
      this.velocity.x = move.x;
      this.velocity.z = move.z;
    } else {
      this.velocity.x *= 0.82;
      this.velocity.z *= 0.82;
    }

    if (this.keys.has("Space") && this.onGround) {
      this.velocity.y = JUMP;
      this.onGround = false;
    }
    this.velocity.y -= GRAVITY * dt;

    const p = this.body;
    p.x += this.velocity.x * dt;
    if (this.collides(p.x, p.y, p.z)) {
      p.x -= this.velocity.x * dt;
      this.velocity.x = 0;
    }
    p.z += this.velocity.z * dt;
    if (this.collides(p.x, p.y, p.z)) {
      p.z -= this.velocity.z * dt;
      this.velocity.z = 0;
    }
    p.y += this.velocity.y * dt;
    if (this.collides(p.x, p.y, p.z)) {
      if (this.velocity.y < 0) this.onGround = true;
      p.y -= this.velocity.y * dt;
      this.velocity.y = 0;
    } else {
      this.onGround = false;
    }

    const focus = new THREE.Vector3(p.x, p.y + PLAYER_H * 0.4, p.z);
    const pitchQ = new THREE.Quaternion().setFromAxisAngle(
      new THREE.Vector3(1, 0, 0),
      this.euler.x
    );
    const orbit = yawQ.clone().multiply(pitchQ);
    const back = new THREE.Vector3(0, CAM_Y, CAM_DIST).applyQuaternion(orbit);
    const bn = back.clone().normalize();
    const dist = this.camClear(focus, bn, back.length());
    this.camera.position.copy(focus).add(bn.multiplyScalar(dist));
    if (this.camera.position.y < CAM_MIN_Y) this.camera.position.y = CAM_MIN_Y;
    this.camera.lookAt(focus);
  }

  spawn(x: number, y: number, z: number): void {
    this.body.set(x, y, z);
    this.velocity.set(0, 0, 0);
    this.euler.y = 0;
    this.euler.x = 0.35;
  }

  bounds(): { minX: number; maxX: number; minY: number; maxY: number; minZ: number; maxZ: number } {
    const hw = PLAYER_W / 2;
    return {
      minX: Math.floor(this.body.x - hw),
      maxX: Math.floor(this.body.x + hw),
      minY: Math.floor(this.body.y),
      maxY: Math.floor(this.body.y + PLAYER_H),
      minZ: Math.floor(this.body.z - hw),
      maxZ: Math.floor(this.body.z + hw),
    };
  }
}
