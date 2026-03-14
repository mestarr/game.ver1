import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutlinePass } from "three/examples/jsm/postprocessing/OutlinePass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ThirdPersonPlayer } from "./rpg/player";
import { buildWorld, type Npc } from "./rpg/world";
import type { QuestState } from "./rpg/quests";
import { questHint } from "./rpg/quests";
import "./rpg-ui.css";
import { buildHobbitHero, updateHeroWalk } from "./rpg/hero";
import { buildEnduroBike } from "./rpg/assets";
import {
  applyCelShading,
  meshesForOutline,
} from "./rpg/borderlandsStyle";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x8ab8e8);
scene.fog = new THREE.Fog(0xd8c8a8, 85, 220);

const camera = new THREE.PerspectiveCamera(
  52,
  window.innerWidth / window.innerHeight,
  0.1,
  280
);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  powerPreference: "high-performance",
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;
document.body.appendChild(renderer.domElement);

const hemi = new THREE.HemisphereLight(0xe8f0ff, 0x8a6a48, 0.48);
scene.add(hemi);
const fill = new THREE.DirectionalLight(0xc8d8f0, 0.18);
fill.position.set(-60, 80, -50);
scene.add(fill);
const sun = new THREE.DirectionalLight(0xffecd0, 1.05);
sun.position.set(85, 120, 55);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.bias = -0.00025;
sun.shadow.normalBias = 0.02;
sun.shadow.camera.near = 2;
sun.shadow.camera.far = 280;
sun.shadow.camera.left = -130;
sun.shadow.camera.right = 130;
sun.shadow.camera.top = 130;
sun.shadow.camera.bottom = -130;
scene.add(sun);

const { colliders, npcs } = buildWorld(scene);
applyCelShading(scene);

const outlineObjects = meshesForOutline(scene);
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
const outlinePass = new OutlinePass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  scene,
  camera,
  outlineObjects
);
outlinePass.edgeStrength = 4.2;
outlinePass.edgeGlow = 0.12;
outlinePass.edgeThickness = 1.6;
outlinePass.visibleEdgeColor.set(0x000000);
outlinePass.hiddenEdgeColor.set(0x000000);
outlinePass.pulsePeriod = 0;
composer.addPass(outlinePass);
composer.addPass(new OutputPass());

const player = new ThirdPersonPlayer(camera);
player.bind(renderer.domElement, colliders);
player.spawn(-4, 0, -16);

const hero = buildHobbitHero();
scene.add(hero);
applyCelShading(hero);

const BIKE_MOUNT_DIST = 3.5;
interface BikeSpot {
  mesh: THREE.Group;
  x: number;
  z: number;
}
const bikes: BikeSpot[] = [
  { mesh: buildEnduroBike(), x: -8, z: -14 },
  { mesh: buildEnduroBike(), x: 12, z: -20 },
  { mesh: buildEnduroBike(), x: -65, z: -70 },
];
bikes.forEach((b) => {
  b.mesh.position.set(b.x, 0, b.z);
  scene.add(b.mesh);
  applyCelShading(b.mesh);
});
let mountedBikeIndex: number | null = null;
const bikeHintEl = document.getElementById("bike-hint")!;

function nearestBike(): number | null {
  if (mountedBikeIndex !== null) return null;
  let best: number | null = null;
  let bestD = BIKE_MOUNT_DIST + 1;
  for (let i = 0; i < bikes.length; i++) {
    const d = Math.hypot(bikes[i].x - player.body.x, bikes[i].z - player.body.z);
    if (d < bestD) {
      bestD = d;
      best = i;
    }
  }
  return best;
}

let fDown = false;
window.addEventListener("keydown", (e) => {
  if (e.code !== "KeyF" || fDown) return;
  fDown = true;
  if (mountedBikeIndex !== null) {
    bikes[mountedBikeIndex].x = player.body.x;
    bikes[mountedBikeIndex].z = player.body.z;
    player.riding = false;
    mountedBikeIndex = null;
    bikeHintEl.classList.add("hidden");
  } else {
    const idx = nearestBike();
    if (idx !== null) {
      mountedBikeIndex = idx;
      player.riding = true;
      bikeHintEl.textContent = "F — Get off bike";
      bikeHintEl.classList.remove("hidden");
    }
  }
});
window.addEventListener("keyup", (e) => {
  if (e.code === "KeyF") fDown = false;
});

const quest: QuestState = {
  stage: "find_gamwise",
  hasRing: false,
  ringDestroyed: false,
};

const questEl = document.getElementById("quest-line")!;
const hintEl = document.getElementById("hint")!;
const dialogueEl = document.getElementById("dialogue")!;
const dialogueText = document.getElementById("dialogue-text")!;
const dialogueOk = document.getElementById("dialogue-ok")!;
const victoryEl = document.getElementById("victory")!;
document.getElementById("replay")!.addEventListener("click", () => location.reload());

let dialogueQueue: string[] = [];
function showDialogue(lines: string[]): void {
  dialogueQueue = [...lines];
  dialogueEl.classList.remove("hidden");
  popDialogue();
}
function popDialogue(): void {
  if (dialogueQueue.length === 0) {
    dialogueEl.classList.add("hidden");
    return;
  }
  dialogueText.textContent = dialogueQueue.shift()!;
}
dialogueOk.addEventListener("click", () => popDialogue());

function nearestNpc(): Npc | null {
  let best: Npc | null = null;
  let bestD = 999;
  for (const n of npcs) {
    const d = Math.hypot(n.x - player.body.x, n.z - player.body.z);
    if (d < n.interactRadius && d < bestD) {
      bestD = d;
      best = n;
    }
  }
  return best;
}

function atVolcano(): boolean {
  return Math.hypot(player.body.x - 148, player.body.z + 42) < 14;
}

function syncQuestUi(): void {
  questEl.textContent = questHint(quest);
}

let eDown = false;
window.addEventListener("keydown", (e) => {
  if (e.code !== "KeyE" || eDown) return;
  eDown = true;
  if (!dialogueEl.classList.contains("hidden")) {
    popDialogue();
    return;
  }
  const n = nearestNpc();
  if (n?.id === "gamwise" && quest.stage === "find_gamwise") {
    showDialogue([
      "Gamwise: \"So you’ve come. The elves of Silvervale wait — east, past the rocks. They hold something that cannot stay hidden.\"",
      "He presses a loaf into your pack. \"Waybread. You’ll need it.\"",
    ]);
    quest.stage = "go_elven";
  } else if (n?.id === "arweneth" && quest.stage === "go_elven") {
    showDialogue([
      "Lady Arweneth: \"You are braver than you know. This is the Ashfire Ring. It must be cast into the fire of Mount Tharen — there.\"",
      "She points east, where smoke stains the sky.",
    ]);
    quest.stage = "get_ring";
    quest.hasRing = true;
  } else if (
    (quest.stage === "go_volcano" || quest.stage === "get_ring") &&
    quest.hasRing &&
    atVolcano()
  ) {
    showDialogue([
      "Heat claws at your skin. The ring pulls toward the flame…",
      "You let go. Gold vanishes into the red depths.",
    ]);
    quest.stage = "done";
    quest.ringDestroyed = true;
    victoryEl.classList.remove("hidden");
  } else if (n?.id === "arweneth" && quest.hasRing && !quest.ringDestroyed) {
    showDialogue([
      "Lady Arweneth: \"Mount Tharen lies far east past the ash path — the pillar and the red pool. Do not linger.\"",
    ]);
  } else if (n?.id === "gamwise") {
    showDialogue(['Gamwise: "Safe roads — and a warm hearth when you return."']);
  }
  if (quest.hasRing && quest.stage === "get_ring") quest.stage = "go_volcano";
  syncQuestUi();
});
window.addEventListener("keyup", (e) => {
  if (e.code === "KeyE") eDown = false;
});

document.addEventListener("pointerlockchange", () => {
  hintEl.classList.toggle("hidden", document.pointerLockElement === renderer.domElement);
});

syncQuestUi();

let last = performance.now();
function tick(): void {
  requestAnimationFrame(tick);
  const now = performance.now();
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  if (!victoryEl.classList.contains("hidden")) {
    composer.render();
    return;
  }
  player.update(dt);
  hero.position.set(player.body.x, player.body.y, player.body.z);
  hero.rotation.y = player.euler.y;
  if (player.riding) {
    hero.visible = false;
    if (mountedBikeIndex !== null) {
      const b = bikes[mountedBikeIndex];
      b.mesh.position.set(player.body.x, player.body.y, player.body.z);
      b.mesh.rotation.y = player.euler.y;
      b.x = player.body.x;
      b.z = player.body.z;
    }
    bikeHintEl.textContent = "F — Get off bike";
    bikeHintEl.classList.remove("hidden");
  } else {
    hero.visible = true;
    updateHeroWalk(hero, dt, player.velocity, player.onGround);
    if (mountedBikeIndex === null) {
      const idx = nearestBike();
      if (idx !== null) {
        bikeHintEl.textContent = "F — Ride bike";
        bikeHintEl.classList.remove("hidden");
      } else {
        bikeHintEl.classList.add("hidden");
      }
    }
  }
  bikes.forEach((b, i) => {
    if (i !== mountedBikeIndex) {
      b.mesh.position.set(b.x, 0, b.z);
      b.mesh.rotation.y = 0;
    }
  });
  composer.render();
}
tick();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
  outlinePass.setSize(window.innerWidth, window.innerHeight);
});
