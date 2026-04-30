/**
 * Hero scene — floating iridescent prism shapes (V4-C, refined).
 *
 * Inspired visually by the VoXelo PRISM codepen (custom WebGL shader)
 * but implemented from scratch with Three.js's built-in
 * MeshPhysicalMaterial.iridescence so we don't ship a custom GLSL
 * pipeline. Brand-cyan-leaning material parameters keep the look
 * on-brand instead of full rainbow.
 *
 * Shape variety: octahedron, icosahedron, tetrahedron, low-poly cone
 * (triangular bipyramid). Cluster positioned in two rings around the
 * centre — outer ring at the hero corners, inner ring closer to the
 * wordmark — so the user reads the title against an interesting
 * (but not crowded) backdrop.
 *
 * Implementation rules (per docs/PLAN.md §7.2 + §7.9):
 *   - Lazy-loaded after LCP via dynamic import (mountHeroScene)
 *   - Pause RAF when document is hidden
 *   - Cap pixel ratio at 2
 *   - Mobile (<768px): smaller scene + fewer shapes + antialias off
 *   - prefers-reduced-motion: don't mount, leave SSR SVG fallback
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
const BRAND_CYAN_DEEP = 0x14b8c4;

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

interface ShapeConfig {
  geo: THREE.BufferGeometry;
  position: [number, number, number];
  scale: number;
  ringIndex: 0 | 1; // 0 = outer (slow), 1 = inner (faster)
}

function buildShapes(isMobile: boolean): ShapeConfig[] {
  /*
    Two concentric rings of shapes around the hero centre. Outer ring
    sits at the page corners, inner ring closer to the wordmark for
    depth. Y-positions deliberately offset so they don't all line up
    on the same horizon line.
  */

  const outerRing: ShapeConfig[] = [
    { geo: new THREE.OctahedronGeometry(0.95, 0), position: [-5.6, 2.8, -2.0], scale: 1.0, ringIndex: 0 },
    { geo: new THREE.IcosahedronGeometry(0.85, 0), position: [5.4, 3.0, -2.5], scale: 1.0, ringIndex: 0 },
    { geo: new THREE.OctahedronGeometry(0.7, 0), position: [-4.4, -3.0, -3.0], scale: 1.0, ringIndex: 0 },
    { geo: new THREE.TetrahedronGeometry(1.0, 0), position: [5.0, -2.7, -1.8], scale: 1.0, ringIndex: 0 },
  ];

  const innerRing: ShapeConfig[] = [
    { geo: new THREE.ConeGeometry(0.55, 1.1, 4), position: [-2.8, 1.4, -1.0], scale: 1.0, ringIndex: 1 },
    { geo: new THREE.OctahedronGeometry(0.45, 0), position: [3.0, -1.8, -0.8], scale: 1.0, ringIndex: 1 },
    { geo: new THREE.IcosahedronGeometry(0.4, 0), position: [0.4, 3.6, -3.5], scale: 1.0, ringIndex: 1 },
    { geo: new THREE.TetrahedronGeometry(0.55, 0), position: [-0.8, -3.4, -2.5], scale: 1.0, ringIndex: 1 },
  ];

  if (isMobile) {
    /* Mobile: keep 2 outer + 2 inner so the scene reads on small
       screens without crowding the headline. */
    return [outerRing[0], outerRing[3], innerRing[0], innerRing[1]];
  }

  return [...outerRing, ...innerRing];
}

export function mountHeroScene({ canvas }: MountOptions): SceneHandle {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    100,
  );
  camera.position.z = 9;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: 'low-power',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);

  /*
    Material — single shared instance for all shapes. The iridescence
    feature in MeshPhysicalMaterial gives us the rainbow-shifting look
    without writing a custom shader; we pin the base colour to brand
    cyan so the shifts stay in the cyan→white→ice family rather than
    going full PRISM rainbow.
  */
  const material = new THREE.MeshPhysicalMaterial({
    color: BRAND_CYAN,
    iridescence: 1.0,
    iridescenceIOR: 1.35,
    iridescenceThicknessRange: [120, 720],
    metalness: 0.18,
    roughness: 0.32,
    clearcoat: 1.0,
    clearcoatRoughness: 0.08,
    transmission: 0.45,
    thickness: 0.6,
    ior: 1.5,
  });

  const configs = buildShapes(isMobile);

  type Floater = {
    mesh: THREE.Mesh;
    rotSpeed: THREE.Vector3;
    bobAmp: number;
    bobPhase: number;
    bobBase: number;
    ringIndex: number;
  };

  const floaters: Floater[] = configs.map((cfg) => {
    const mesh = new THREE.Mesh(cfg.geo, material);
    const [x, y, z] = cfg.position;
    mesh.position.set(x, y, z);
    mesh.scale.setScalar(cfg.scale);
    mesh.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI,
    );
    scene.add(mesh);

    /* Inner ring rotates a touch faster + bobs less than outer; gives
       the parallax sense of "closer to camera, twitchier". */
    const rotSpeedScale = cfg.ringIndex === 1 ? 1.4 : 1.0;
    const bobScale = cfg.ringIndex === 1 ? 0.6 : 1.0;

    return {
      mesh,
      rotSpeed: new THREE.Vector3(
        (Math.random() - 0.5) * 0.005 * rotSpeedScale,
        (Math.random() - 0.5) * 0.006 * rotSpeedScale,
        (Math.random() - 0.5) * 0.003 * rotSpeedScale,
      ),
      bobAmp: (0.15 + Math.random() * 0.18) * bobScale,
      bobPhase: Math.random() * Math.PI * 2,
      bobBase: y,
      ringIndex: cfg.ringIndex,
    };
  });

  /*
    Lighting: ambient + cyan-tinted key light + cool rim. The
    iridescence does most of the visual work; lights just sketch
    the silhouette.
  */
  scene.add(new THREE.AmbientLight(0xffffff, 0.4));
  const keyLight = new THREE.DirectionalLight(BRAND_CYAN_TINT, 1.45);
  keyLight.position.set(5, 8, 5);
  scene.add(keyLight);
  const fillLight = new THREE.DirectionalLight(BRAND_CYAN_DEEP, 0.55);
  fillLight.position.set(-6, -3, 2);
  scene.add(fillLight);
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.35);
  rimLight.position.set(0, -8, -5);
  scene.add(rimLight);

  /* Mouse parallax — very subtle (5° max tilt at edges of viewport). */
  const mouse = new THREE.Vector2(0, 0);
  const targetRotation = new THREE.Vector2(0, 0);

  function onPointerMove(event: PointerEvent) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = (event.clientY / window.innerHeight) * 2 - 1;
  }
  window.addEventListener('pointermove', onPointerMove, { passive: true });

  /* Resize handler */
  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  const resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(canvas);

  /* Animation loop with visibility pause */
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
      const bobSpeed = f.ringIndex === 1 ? 0.85 : 0.55;
      f.mesh.position.y = f.bobBase + Math.sin(t * bobSpeed + f.bobPhase) * f.bobAmp;
    });

    /* Smooth follow toward mouse target */
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

  function dispose() {
    running = false;
    cancelAnimationFrame(rafId);
    window.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('visibilitychange', onVisibilityChange);
    resizeObserver.disconnect();
    floaters.forEach((f) => {
      scene.remove(f.mesh);
    });
    configs.forEach((c) => c.geo.dispose());
    material.dispose();
    renderer.dispose();
  }

  return { dispose };
}
