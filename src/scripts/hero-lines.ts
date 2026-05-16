/**
 * Hero "Lines & Sparks" canvas animation — port of towc's
 * codepen mJzOWJ (https://codepen.io/towc/pen/mJzOWJ).
 *
 * Lines fan out from canvas centre rotating ±60°, leave a hue-
 * shifting trail with random spark dots. Translucent black
 * repaint each frame produces the comet-trail decay.
 *
 * Adapted to:
 *   - Honour prefers-reduced-motion (one static frame, no rAF).
 *   - Pause rAF when document.hidden (background tab).
 *   - Cap devicePixelRatio so retina phones don't melt.
 *   - Provide a dispose() handle (HMR + intersection-observer
 *     mount in HeroScene.astro will pause the animation off-screen).
 */
export interface HeroLinesHandle {
  dispose: () => void;
  pause: () => void;
  resume: () => void;
}

interface HeroLinesOpts {
  canvas: HTMLCanvasElement;
}

const DEFAULT_OPTS = {
  len: 20,
  count: 50,
  baseTime: 10,
  addedTime: 10,
  dieChance: 0.05,
  spawnChance: 1,
  sparkChance: 0.1,
  sparkDist: 10,
  sparkSize: 2,
  color: 'hsl(hue,100%,light%)',
  baseLight: 50,
  addedLight: 10,
  shadowToTimePropMult: 6,
  baseLightInputMultiplier: 0.01,
  addedLightInputMultiplier: 0.02,
  repaintAlpha: 0.04,
  hueChange: 0.1,
};

const BASE_RAD = (Math.PI * 2) / 6;

export function mountHeroLines({ canvas }: HeroLinesOpts): HeroLinesHandle | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  // Cap DPR — retina phones at 3× × full viewport is too many pixels.
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  let w = 0;
  let h = 0;
  let cx = 0;
  let cy = 0;
  let dieX = 0;
  let dieY = 0;
  const opts = { ...DEFAULT_OPTS };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    w = Math.max(1, Math.round(rect.width));
    h = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cx = w / 2;
    cy = h / 2;
    dieX = w / 2 / opts.len;
    dieY = h / 2 / opts.len;
    // Re-paint base so the trail picks up from a clean black.
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, w, h);
  };

  resize();

  let tick = 0;
  const lines: Line[] = [];

  class Line {
    x = 0;
    y = 0;
    addedX = 0;
    addedY = 0;
    rad = 0;
    lightInputMultiplier = 0;
    color = '';
    cumulativeTime = 0;
    time = 0;
    targetTime = 0;

    constructor() {
      this.reset();
    }

    reset() {
      this.x = 0;
      this.y = 0;
      this.addedX = 0;
      this.addedY = 0;
      this.rad = 0;
      this.lightInputMultiplier =
        opts.baseLightInputMultiplier +
        opts.addedLightInputMultiplier * Math.random();
      this.color = opts.color.replace('hue', String(tick * opts.hueChange));
      this.cumulativeTime = 0;
      this.beginPhase();
    }

    beginPhase() {
      this.x += this.addedX;
      this.y += this.addedY;
      this.time = 0;
      this.targetTime = Math.floor(opts.baseTime + opts.addedTime * Math.random());
      this.rad += BASE_RAD * (Math.random() < 0.5 ? 1 : -1);
      this.addedX = Math.cos(this.rad);
      this.addedY = Math.sin(this.rad);
      if (
        Math.random() < opts.dieChance ||
        this.x > dieX ||
        this.x < -dieX ||
        this.y > dieY ||
        this.y < -dieY
      ) {
        this.reset();
      }
    }

    step() {
      this.time += 1;
      this.cumulativeTime += 1;
      if (this.time >= this.targetTime) this.beginPhase();
      const prop = this.time / this.targetTime;
      const wave = Math.sin((prop * Math.PI) / 2);
      const x = this.addedX * wave;
      const y = this.addedY * wave;
      ctx.shadowBlur = prop * opts.shadowToTimePropMult;
      const lightness =
        opts.baseLight +
        opts.addedLight * Math.sin(this.cumulativeTime * this.lightInputMultiplier);
      const color = this.color.replace('light', String(lightness));
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.fillRect(cx + (this.x + x) * opts.len, cy + (this.y + y) * opts.len, 2, 2);
      if (Math.random() < opts.sparkChance) {
        ctx.fillRect(
          cx +
            (this.x + x) * opts.len +
            Math.random() * opts.sparkDist * (Math.random() < 0.5 ? 1 : -1) -
            opts.sparkSize / 2,
          cy +
            (this.y + y) * opts.len +
            Math.random() * opts.sparkDist * (Math.random() < 0.5 ? 1 : -1) -
            opts.sparkSize / 2,
          opts.sparkSize,
          opts.sparkSize
        );
      }
    }
  }

  let raf = 0;
  let running = false;
  let pausedByVisibility = false;

  const frame = () => {
    tick += 1;
    ctx.globalCompositeOperation = 'source-over';
    ctx.shadowBlur = 0;
    ctx.fillStyle = `rgba(0,0,0,${opts.repaintAlpha})`;
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    if (lines.length < opts.count && Math.random() < opts.spawnChance) {
      lines.push(new Line());
    }
    for (const line of lines) line.step();
    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(frame);
  };

  const stop = () => {
    if (!running) return;
    running = false;
    cancelAnimationFrame(raf);
    raf = 0;
  };

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    // Single static frame — enough to seed a few sparks then stop.
    for (let i = 0; i < 8; i++) lines.push(new Line());
    for (let i = 0; i < 30; i++) frame();
    stop();
    return {
      dispose: () => {},
      pause: () => {},
      resume: () => {},
    };
  }

  start();

  const ro = new ResizeObserver(() => resize());
  ro.observe(canvas);

  const onVisibility = () => {
    if (document.hidden) {
      pausedByVisibility = running;
      stop();
    } else if (pausedByVisibility) {
      pausedByVisibility = false;
      start();
    }
  };
  document.addEventListener('visibilitychange', onVisibility);

  return {
    dispose() {
      stop();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    },
    pause: stop,
    resume: start,
  };
}
