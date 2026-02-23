---
name: threejs-scene
description: "Build or debug interactive 3D scenes on the web with Three.js — scene/camera/renderer, lights/materials, GLTF loading, controls, performance. For designers shipping 3D UI moments."
metadata:
  openclaw:
    emoji: "🎲"
    source: "https://github.com/MengTo/Skills"
---

# Three.js — WebGL 3D Scenes Skill

## When to use
- Real 3D: product spins, interactive hero scenes, shaders/material effects, 3D data viz
- Full control beyond "background effects"
- Can budget time for asset pipeline + performance tuning

## Core mental model
- `Scene` (root graph) → `Camera` (Perspective/Orthographic) → `Renderer` (WebGLRenderer)
- `Mesh` = `Geometry` + `Material`
- Lights (if using non-unlit materials)
- Render loop: `requestAnimationFrame(animate)` → update + `renderer.render(scene, camera)`

## Key APIs/patterns
- Setup: `new THREE.WebGLRenderer({ canvas, antialias, alpha })`
- Pixel ratio: `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))`
- Camera: `camera.aspect = w / h; camera.updateProjectionMatrix()`
- Loading: `GLTFLoader`, `TextureLoader`, `DRACOLoader`
- Controls: `OrbitControls`, `PointerLockControls`
- Cleanup: `geometry.dispose()`, `material.dispose()`, `renderer.dispose()`

## Quick recipe — Spinning cube
```js
import * as THREE from "three";
const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
camera.position.set(0, 0, 4);
const mesh = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x7c3aed })
);
scene.add(mesh);
scene.add(new THREE.AmbientLight(0xffffff, 0.8));
function animate(t) {
  mesh.rotation.y = t * 0.0006;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
```

## Common pitfalls
- Not handling resize → stretched rendering
- Too high `devicePixelRatio` → mobile GPU meltdown
- Leaking WebGL resources (not disposing) → crashes after route changes
- Loading huge textures/models → slow start

## Tips for AI Agents
- Ask if the use case is decorative (hero) or functional 3D (product viewer).
- Confirm target devices (mobile? older iPhones?).
- Respect `prefers-reduced-motion` with still frames or slow updates.
