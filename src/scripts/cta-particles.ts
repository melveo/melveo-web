/**
 * CTA particle convergence (2026-06-10).
 *
 * The closing "signals → decision" beat: a sparse field of dim cyan
 * particles drifts gently TOWARD the e-mail link — the same story the
 * hero particles tell, resolved. Deliberately quiet (the user kept this
 * section minimal on purpose, 2026-05-01): ≤26 particles, ≤0.35 alpha,
 * no connecting lines.
 *
 * Discipline: IO-paused out of view, paused on document.hidden,
 * skipped entirely for prefers-reduced-motion, DPR capped at 1.5.
 */

interface CtaParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

export function mountCtaParticles() {
  const section = document.querySelector<HTMLElement>('[data-cta-particles]');
  const canvas = section?.querySelector<HTMLCanvasElement>('canvas');
  const target = section?.querySelector<HTMLElement>('[data-cta-target]');
  if (!section || !canvas || !target) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const COUNT = window.innerWidth < 768 ? 16 : 26;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let particles: CtaParticle[] = [];
  let rafId = 0;
  let running = false;

  function spawn(p?: CtaParticle): CtaParticle {
    // spawn on a random edge so the inward drift reads as convergence
    const edge = Math.floor(Math.random() * 4);
    const x = edge === 0 ? -8 : edge === 1 ? width + 8 : Math.random() * width;
    const y = edge === 2 ? -8 : edge === 3 ? height + 8 : Math.random() * height;
    const next = p ?? ({} as CtaParticle);
    next.x = x;
    next.y = y;
    next.vx = 0;
    next.vy = 0;
    next.size = 0.8 + Math.random() * 1.4;
    next.alpha = 0.12 + Math.random() * 0.23;
    return next;
  }

  function resize() {
    const rect = section!.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    width = rect.width;
    height = rect.height;
    canvas!.width = Math.round(width * dpr);
    canvas!.height = Math.round(height * dpr);
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function targetCenter() {
    const sRect = section!.getBoundingClientRect();
    const tRect = target!.getBoundingClientRect();
    return {
      x: tRect.left - sRect.left + tRect.width / 2,
      y: tRect.top - sRect.top + tRect.height / 2,
    };
  }

  function tick() {
    if (!running) return;
    const { x: cx, y: cy } = targetCenter();
    ctx!.clearRect(0, 0, width, height);
    for (const p of particles) {
      const dx = cx - p.x;
      const dy = cy - p.y;
      const dist = Math.max(24, Math.hypot(dx, dy));
      // gentle attractor + slight tangential drift so paths curve
      p.vx += (dx / dist) * 0.012 - (dy / dist) * 0.004;
      p.vy += (dy / dist) * 0.012 + (dx / dist) * 0.004;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      // arrived → soft respawn at an edge
      if (dist <= 26) {
        spawn(p);
        continue;
      }
      const fade = Math.min(1, (dist - 26) / 90);
      ctx!.beginPath();
      ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx!.fillStyle = `rgba(0, 240, 255, ${(p.alpha * fade).toFixed(3)})`;
      ctx!.fill();
    }
    rafId = requestAnimationFrame(tick);
  }

  function start() {
    if (running || document.hidden) return;
    running = true;
    rafId = requestAnimationFrame(tick);
  }
  function stop() {
    running = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  }

  resize();
  particles = Array.from({ length: COUNT }, () => {
    // initial scatter across the section, not just edges
    const p = spawn();
    p.x = Math.random() * width;
    p.y = Math.random() * height;
    return p;
  });

  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) start();
        else stop();
      },
      { rootMargin: '80px 0px' },
    );
    io.observe(section);
  } else {
    start();
  }
}
