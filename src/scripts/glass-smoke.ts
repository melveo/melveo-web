/**
 * glass-smoke — Canvas 2D cyan-fog backdrop for any liquid-glass section.
 *
 * Adapted from teolitto codepen KwOVvL (Three.js cyan-smoke fog field
 * rotating behind a "Quick Text" callout). The codepen uses a 3D scene
 * with 150 textured planes; we replicate the *look* (slow drifting cyan
 * fog) in pure Canvas 2D so we don't pull in Three.js for a decorative
 * backdrop. Same script powers both the pricing section and the image
 * grid section — each opts in by attaching the data attribute below.
 *
 * USAGE
 *   <section data-glass-smoke
 *            data-glass-smoke-density="0.9"  /* optional, default 1 *‍/>
 *     <canvas class="glass-smoke" data-glass-smoke-canvas></canvas>
 *     …rest of section…
 *   </section>
 *
 *   import { mountGlassSmoke } from '../scripts/glass-smoke';
 *   mountGlassSmoke();   // scans the document for [data-glass-smoke]
 *
 * IMPLEMENTATION
 *   - Two pre-tinted radial gradient sprites (cyan + teal) cached once
 *     on offscreen canvases. Wide alpha tail to 0.55 of radius gives
 *     the "smoke" feel rather than a hard spotlight.
 *   - Default density is 60 (mobile) / 90 (desktop) puffs scaled by the
 *     section's data-glass-smoke-density (lets a section dial it up
 *     or down from the same script).
 *   - Slow rotation + drift + per-puff breathing scale.
 *   - Blitted with globalCompositeOperation='lighter' (additive).
 *   - IntersectionObserver pauses rAF while the section is off-screen.
 *
 * The .glass-card recipe uses backdrop-blur + url(#glass-lens)
 * displacement — both refract whatever sits behind. On flat dark canvas
 * the displacement is a no-op; with this smoke field underneath, the
 * cards finally read as actual liquid glass.
 */

const SPRITE_SIZE = 256;

function makeSprite(color: string, peakAlpha: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = SPRITE_SIZE;
  c.height = SPRITE_SIZE;
  const ctx = c.getContext('2d')!;
  // Soft radial puff — pre-tinted cyan/teal so we can blit straight
  // with `globalCompositeOperation='lighter'` and the canvas accumulates
  // colour without any per-puff hue tricks. Wide alpha tail (out to 0.55)
  // is what makes it read as smoke, not a spot light.
  const grad = ctx.createRadialGradient(
    SPRITE_SIZE / 2,
    SPRITE_SIZE / 2,
    0,
    SPRITE_SIZE / 2,
    SPRITE_SIZE / 2,
    SPRITE_SIZE / 2,
  );
  // Color is a #RRGGBB hex; we append 2-digit alpha hex per stop.
  const hex = (a: number) =>
    color +
    Math.round(Math.max(0, Math.min(1, a)) * 255)
      .toString(16)
      .padStart(2, '0');
  grad.addColorStop(0, hex(peakAlpha));
  grad.addColorStop(0.25, hex(peakAlpha * 0.45));
  grad.addColorStop(0.55, hex(peakAlpha * 0.12));
  grad.addColorStop(1, color + '00');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  return c;
}

let cyanSprite: HTMLCanvasElement | null = null;
let tealSprite: HTMLCanvasElement | null = null;

function getCyanSprite(): HTMLCanvasElement {
  if (!cyanSprite) cyanSprite = makeSprite('#00d8e6', 0.45);
  return cyanSprite;
}
function getTealSprite(): HTMLCanvasElement {
  if (!tealSprite) tealSprite = makeSprite('#1ad6e6', 0.4);
  return tealSprite;
}

interface Puff {
  /** Position in canvas pixel space. */
  x: number;
  y: number;
  /** Sprite scale (0.6 – 1.6). */
  scale: number;
  /** Current rotation in radians. */
  rotation: number;
  /** Per-second rotation speed. */
  rotationSpeed: number;
  /** Lateral drift per second. */
  vx: number;
  vy: number;
  /** Per-puff alpha (0–1) before the global tint reduces it further. */
  alpha: number;
  /** Hue mix — 0 = pure cyan, 1 = teal-shifted. Tints subtle variety. */
  hueShift: number;
  /** Random phase so the breathing scale isn't synchronised across puffs. */
  phase: number;
}

interface Handle {
  dispose: () => void;
}

const HANDLES = new WeakMap<HTMLElement, Handle>();

function makePuff(width: number, height: number): Puff {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    scale: 0.6 + Math.random() * 1.0,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() * 0.15 + 0.08) * (Math.random() < 0.5 ? -1 : 1),
    // Slow drift in random directions — bumped from ±3 to ±9 px/sec so
    // the eye actually registers movement (radial-symmetric sprites
    // make the rotation invisible, so movement has to come from
    // translation + scale-pulse). Plus a small upward bias (-2 px/sec
    // baseline on vy) to give the field a "rising smoke" feel.
    vx: (Math.random() - 0.5) * 18,
    vy: (Math.random() - 0.5) * 10 - 2,
    alpha: 0.22 + Math.random() * 0.32,
    hueShift: Math.random(),
    phase: Math.random() * Math.PI * 2,
  };
}

function mount(section: HTMLElement): Handle | null {
  const canvas = section.querySelector<HTMLCanvasElement>('[data-glass-smoke-canvas]');
  if (!canvas) return null;
  const context = canvas.getContext('2d', { alpha: true });
  if (!context) return null;
  const canvasEl = canvas;
  const ctx = context;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compactStatic =
    section.dataset.glassSmokeStatic === 'compact' &&
    window.matchMedia('(max-width: 700px), (pointer: coarse)').matches;
  const targetFps = Math.max(
    0,
    Math.min(60, parseFloat(section.dataset.glassSmokeFps ?? '24')),
  );
  const cyan = getCyanSprite();
  const teal = getTealSprite();

  // Optional per-section density multiplier (e.g. 1.2 for a busier
  // backdrop, 0.6 for a calmer one). Defaults to 1.
  const density = Math.max(
    0.2,
    Math.min(2, parseFloat(section.dataset.glassSmokeDensity ?? '1')),
  );

  let width = 1;
  let height = 1;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let puffs: Puff[] = [];
  let raf = 0;
  let last = 0;
  let lastPaint = 0;
  let visible = false;

  function targetCount(): number {
    const base = window.matchMedia('(max-width: 700px)').matches ? 60 : 90;
    return Math.round(base * density);
  }

  function resize() {
    // Measure the CANVAS, not the section. The pricing section's
    // canvas is `inset: 0` of the section (= same height); the image
    // grid section is 620vh tall but the canvas sits at sticky
    // 100vh — measuring the section there would give a 11000+ px
    // canvas and disperse the smoke into invisibility.
    const rect = canvasEl.getBoundingClientRect();
    width = Math.max(1, rect.width || section.clientWidth);
    height = Math.max(1, rect.height || window.innerHeight);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvasEl.width = Math.round(width * dpr);
    canvasEl.height = Math.round(height * dpr);
    // Don't override style.width/height — the host CSS already sets
    // those (sticky 100vh on image grid, 100% of section on pricing),
    // and overwriting can break the sticky positioning.
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Re-seed puffs to fill the new size. Cheaper than transforming
    // existing ones when the section grows tall (it only resizes a
    // handful of times across a page lifetime).
    const count = targetCount();
    puffs = Array.from({ length: count }, () => makePuff(width, height));
  }

  function frame(now: number) {
    raf = 0;
    if (!visible) return;
    if (targetFps > 0 && lastPaint > 0 && now - lastPaint < 1000 / targetFps) {
      raf = requestAnimationFrame(frame);
      return;
    }
    const dt = last === 0 ? 0.016 : Math.min(0.05, (now - last) / 1000);
    last = now;
    lastPaint = now;

    // Clear with the page bg colour so blends below stay clean. The
    // section CSS already paints `--color-bg-canvas`, so a clearRect
    // alone leaves transparent pixels and the canvas reads as fully
    // transparent — fine, since we want to see the section bg through
    // gaps between puffs.
    ctx.clearRect(0, 0, width, height);

    ctx.globalCompositeOperation = 'lighter';
    for (const p of puffs) {
      p.rotation += p.rotationSpeed * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Wrap around edges with a generous margin so puffs don't pop.
      const margin = SPRITE_SIZE * p.scale * 0.5;
      if (p.x < -margin) p.x = width + margin;
      if (p.x > width + margin) p.x = -margin;
      if (p.y < -margin) p.y = height + margin;
      if (p.y > height + margin) p.y = -margin;

      const sprite = p.hueShift < 0.5 ? cyan : teal;
      // Breathing scale — each puff slowly inhales/exhales between
      // 0.94× and 1.06× its base scale, with a per-puff phase so the
      // field doesn't pulse in unison. ~7 sec period feels organic.
      const breath = 1 + Math.sin(now * 0.0009 + p.phase) * 0.06;
      const size = SPRITE_SIZE * p.scale * breath;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.alpha;
      ctx.drawImage(sprite, -size / 2, -size / 2, size, size);
      ctx.restore();
    }

    raf = requestAnimationFrame(frame);
  }

  function start() {
    if (raf) return;
    last = 0;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    if (!raf) return;
    cancelAnimationFrame(raf);
    raf = 0;
  }

  // Seed sizes + initial draw
  resize();
  if (reduce || compactStatic) {
    // One static frame, no animation.
    visible = true;
    last = performance.now();
    frame(last);
    stop();
    visible = false;
    return {
      dispose: () => {},
    };
  }

  // Watch the canvas itself (its rendered size) rather than the section
  // — the image grid section is 620vh, the canvas is 100vh sticky, and
  // we want to react to the latter.
  const ro = new ResizeObserver(() => resize());
  ro.observe(canvasEl);

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.target !== section) continue;
        visible = e.isIntersecting;
        if (visible) start();
        else stop();
      }
    },
    { rootMargin: '200px 0px' },
  );
  io.observe(section);

  return {
    dispose() {
      ro.disconnect();
      io.disconnect();
      stop();
    },
  };
}

export function mountGlassSmoke() {
  const sections = document.querySelectorAll<HTMLElement>('[data-glass-smoke]');
  sections.forEach((section) => {
    if (HANDLES.has(section)) return;
    const handle = mount(section);
    if (handle) HANDLES.set(section, handle);
  });
}
