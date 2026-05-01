/**
 * pricing-smoke — Canvas 2D backdrop for the pricing section.
 *
 * Adapted from teolitto codepen KwOVvL (Three.js cyan-smoke fog field
 * rotating behind a "Quick Text" callout). The codepen uses a 3D scene
 * with 150 textured planes; we replicate the *look* (slow drifting cyan
 * fog) in pure Canvas 2D so we don't pull in Three.js for a single
 * decorative backdrop:
 *
 *   - 60 (mobile) / 90 (desktop) "smoke" sprites are blitted onto a
 *     full-section canvas. Each sprite is a precomputed radial gradient
 *     (white→transparent) cached once on an offscreen canvas, then
 *     rotated and tinted cyan via `globalCompositeOperation = 'lighter'`
 *     for additive blending (the codepen used THREE.AdditiveBlending).
 *   - Each particle has a slow rotation speed (matches the codepen's
 *     `delta * 0.2` rate) plus a tiny drift. The combination produces
 *     the lazy moving-cloud effect.
 *   - IntersectionObserver pauses the rAF loop while the section is
 *     off-screen. ResizeObserver resizes the canvas to match the
 *     section's pixel size.
 *
 * The pricing cards' .glass-filter SVG-displacement layer refracts
 * whatever sits behind it — on flat dark canvas there's nothing to
 * refract, so the displacement reads as an outline only. With this
 * smoke field underneath, the displacement now bends real cyan colour
 * → the cards finally read as actual liquid glass.
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
  const canvas = section.querySelector<HTMLCanvasElement>('[data-pricing-smoke]');
  if (!canvas) return null;
  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return null;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cyan = getCyanSprite();
  const teal = getTealSprite();

  let width = 1;
  let height = 1;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);
  let puffs: Puff[] = [];
  let raf = 0;
  let last = 0;
  let visible = false;

  function targetCount(): number {
    return window.matchMedia('(max-width: 700px)').matches ? 60 : 90;
  }

  function resize() {
    const rect = section.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
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
    const dt = last === 0 ? 0.016 : Math.min(0.05, (now - last) / 1000);
    last = now;

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
  if (reduce) {
    // One static frame, no animation.
    visible = true;
    last = performance.now();
    frame(last);
    visible = false;
    return {
      dispose: () => {},
    };
  }

  const ro = new ResizeObserver(() => resize());
  ro.observe(section);

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

export function mountPricingSmoke() {
  const sections = document.querySelectorAll<HTMLElement>('[data-pricing-section]');
  sections.forEach((section) => {
    if (HANDLES.has(section)) return;
    const handle = mount(section);
    if (handle) HANDLES.set(section, handle);
  });
}
