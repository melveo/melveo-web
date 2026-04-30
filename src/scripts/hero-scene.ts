/**
 * Hero scene — PRISM-style 3D floating shapes (V4-C).
 *
 * Reference: VoXelo CodePen ogbKQOy (PRISM scene), screenshot
 * confirmed by user 2026-04-30. Pitch-black canvas with 4-6 floating
 * iridescent octahedra/icosahedra; cyan-leaning iridescence to fit
 * Melveo brand (vs PRISM's full rainbow).
 *
 * Implementation rules (per docs/PLAN.md §7.2 + §7.9):
 *   - Lazy-loaded after LCP via dynamic import (mountHeroScene)
 *   - Pause RAF when document is hidden (visibilitychange)
 *   - Cap pixel ratio at 2 (retina but not 3x)
 *   - Mobile (<768px): 3 shapes vs 6 on desktop
 *   - prefers-reduced-motion: don't mount, leave SSR fallback
 *   - Cleanup function returned for HMR / nav
 */

import * as THREE from 'three';

interface MountOptions {
  canvas: HTMLCanvasElement;
}

interface SceneHandle {
  /** Stop the animation loop and release GPU resources. */
  dispose: () => void;
}

const BRAND_CYAN = 0x00f0ff;
const BRAND_CYAN_TINT = 0xcdf7fb;

/**
 * Returns true if the user has explicitly opted into reduced motion.
 * Caller should skip mounting and rely on the SSR fallback element.
 */
export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function mountHeroScene({ canvas }: MountOptions): SceneHandle {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const shapeCount = isMobile ? 3 : 6;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
  camera.position.z = 9;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  // Iridescent material — cyan-leaning, not full rainbow. We rely on
  // MeshPhysicalMaterial.iridescence for the shimmer effect with a
  // brand-cyan base color so the hero scene reads as "Melveo" not "PRISM".
  const material = new THREE.MeshPhysicalMaterial({
    color: BRAND_CYAN,
    iridescence: 1.0,
    iridescenceIOR: 1.3,
    iridescenceThicknessRange: [100, 700],
    metalness: 0.15,
    roughness: 0.35,
    clearcoat: 1.0,
    clearcoatRoughness: 0.1,
    transmission: 0.4,
    thickness: 0.5,
  });

  const geometries: THREE.BufferGeometry[] = [
    new THREE.OctahedronGeometry(0.85, 0),
    new THREE.IcosahedronGeometry(0.75, 0),
    new THREE.TetrahedronGeometry(0.95, 0),
    new THREE.OctahedronGeometry(0.55, 0),
  ];

  // Position layout — keep middle of frame clear so wordmark + CTA
  // remain readable. Shapes drift in cone around the canvas center.
  const positions: [number, number, number][] = [
    [-5.5, 2.4, -2.0],
    [5.2, 2.7, -2.5],
    [-4.0, -2.8, -3.0],
    [4.8, -2.5, -1.8],
    [0, 4.0, -4.0],
    [0, -3.8, -3.5],
  ];

  type Floater = {
    mesh: THREE.Mesh;
    rotSpeed: THREE.Vector3;
    bobAmp: number;
    bobPhase: number;
    bobBase: number;
  };

  const floaters: Floater[] = [];
  for (let i = 0; i < shapeCount; i++) {
    const geo = geometries[i % geometries.length];
    const mesh = new THREE.Mesh(geo, material);
    const [x, y, z] = positions[i % positions.length];
    mesh.position.set(x, y, z);
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    scene.add(mesh);

    floaters.push({
      mesh,
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.005,
        (Math.random() - 0.5) * 0.006,
        (Math.random() - 0.5) * 0.003,
      ),
      bobAmp: 0.15 + Math.random() * 0.15,
      bobPhase: Math.random() * Math.PI * 2,
      bobBase: y,
    });
  }

  // Lights — soft ambient + cyan-tinted directional. The iridescence
  // does most of the visual work; lights just sketch the form.
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const keyLight = new THREE.DirectionalLight(BRAND_CYAN_TINT, 1.3);
  keyLight.position.set(5, 8, 5);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.6);
  rimLight.position.set(-6, -3, 2);
  scene.add(rimLight);

  // Mouse parallax — very subtle (5° max tilt at edges of viewport)
  const mouse = new THREE.Vector2(0, 0);
  const targetRotation = new THREE.Vector2(0, 0);

  function onPointerMove(event: PointerEvent) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  // Resize handler
  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(canvas);

  // Animation loop with visibility pause
  let rafId = 0;
  const startTime = performance.now();
  let running = true;

  function tick() {
    if (!running) return;
    const t = (performance.now() - startTime) / 1000;

    floaters.forEach((f) => {
      f.mesh.rotation.x += f.rotSpeed.x;
      f.mesh.rotation.y += f.rotSpeed.y;
      f.mesh.rotation.z += f.rotSpeed.z;
      // Gentle vertical bob
      f.mesh.position.y = f.bobBase + Math.sin(t * 0.6 + f.bobPhase) * f.bobAmp;
    });

    // Smooth follow toward mouse target
    targetRotation.x += (mouse.y * 0.08 - targetRotation.x) * 0.04;
    targetRotation.y += (mouse.x * 0.12 - targetRotation.y) * 0.04;
    scene.rotation.x = targetRotation.x;
    scene.rotation.y = targetRotation.y;

    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  function onVisibilityChange() {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(rafId);
    } else if (!running) {
      running = true;
      rafId = requestAnimationFrame(tick);
    }
  }
  document.addEventListener('visibilitychange', onVisibilityChange);

  // Disposal
  function dispose() {
    running = false;
    cancelAnimationFrame(rafId);
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    resizeObserver.disconnect();
    floaters.forEach((f) => {
      scene.remove(f.mesh);
    });
    geometries.forEach((g) => g.dispose());
    material.dispose();
    renderer.dispose();
  }

  return { dispose };
}
