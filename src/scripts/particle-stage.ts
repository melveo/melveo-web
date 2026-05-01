interface ParticleStageHandle {
  dispose: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
}

const HANDLES = new WeakMap<HTMLElement, ParticleStageHandle>();
const CODEPEN_PARTICLE_VALUE = 80;
const CODEPEN_DENSITY_AREA = 800;

function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function mountParticleStage(stage: HTMLElement): ParticleStageHandle | null {
  const canvas = stage.querySelector<HTMLCanvasElement>('[data-particle-canvas]');
  if (!canvas) return null;
  const canvasEl = canvas;

  const context = canvasEl.getContext('2d', { alpha: true });
  if (!context) return null;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ctx = context;
  const particles: Particle[] = [];
  const pointer = {
    x: 0,
    y: 0,
    active: false,
  };

  let width = 1;
  let height = 1;
  let pixelRatio = 1;
  let rafId = 0;
  let running = !reduceMotion;

  function particleCount() {
    const area = width * height;
    const codePenDensity = Math.round((area / 1000) * CODEPEN_PARTICLE_VALUE / CODEPEN_DENSITY_AREA);
    const minimum = window.innerWidth < 768 ? 52 : 112;
    return Math.min(190, Math.max(minimum, codePenDensity));
  }

  function resetParticle(particle: Particle, randomizePosition = true) {
    particle.x = randomizePosition ? Math.random() * width : particle.x;
    particle.y = randomizePosition ? Math.random() * height : particle.y;
    const angle = randomRange(0, Math.PI * 2);
    const speed = randomRange(0.78, 1.95);
    particle.vx = Math.cos(angle) * speed;
    particle.vy = Math.sin(angle) * speed;
    particle.radius = randomRange(1.2, 3.4);
    particle.alpha = randomRange(0.42, 0.76);
  }

  function pushParticles(x: number, y: number, amount = 4) {
    for (let i = 0; i < amount; i += 1) {
      const particle = {} as Particle;
      resetParticle(particle, false);
      particle.x = x + randomRange(-12, 12);
      particle.y = y + randomRange(-12, 12);
      particles.push(particle);
    }

    const maxCount = particleCount() + 12;
    if (particles.length > maxCount) {
      particles.splice(0, particles.length - maxCount);
    }
  }

  function resize() {
    const rect = stage.getBoundingClientRect();
    width = Math.max(1, Math.floor(rect.width));
    height = Math.max(1, Math.floor(rect.height));
    pixelRatio = Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1.25 : 1.75);

    canvasEl.width = Math.floor(width * pixelRatio);
    canvasEl.height = Math.floor(height * pixelRatio);
    canvasEl.style.width = `${width}px`;
    canvasEl.style.height = `${height}px`;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    const count = particleCount();
    while (particles.length < count) {
      const particle = {} as Particle;
      resetParticle(particle);
      particles.push(particle);
    }
    particles.length = count;

    if (reduceMotion) {
      draw();
    }
  }

  function drawParticle(particle: Particle) {
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
    ctx.shadowColor = 'rgba(0, 240, 255, 0.68)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = `rgba(214, 254, 255, ${particle.alpha})`;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function drawLine(a: Particle, b: Particle, opacity: number) {
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.strokeStyle = `rgba(156, 250, 255, ${opacity})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function updateParticle(particle: Particle) {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -20) particle.x = width + 20;
    if (particle.x > width + 20) particle.x = -20;
    if (particle.y < -20) particle.y = height + 20;
    if (particle.y > height + 20) particle.y = -20;
  }

  function drawPointerLinks(particle: Particle) {
    if (!pointer.active) return;

    const dx = pointer.x - particle.x;
    const dy = pointer.y - particle.y;
    const distance = Math.hypot(dx, dy);
    const maxDistance = window.innerWidth < 768 ? 124 : 150;

    if (distance > maxDistance) return;

    const opacity = (1 - distance / maxDistance) * 0.95;
    ctx.beginPath();
    ctx.moveTo(pointer.x, pointer.y);
    ctx.lineTo(particle.x, particle.y);
    ctx.strokeStyle = `rgba(238, 255, 255, ${opacity})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i += 1) {
      const a = particles[i];
      if (!reduceMotion) {
        updateParticle(a);
      }

      drawParticle(a);
      drawPointerLinks(a);

      for (let j = i + 1; j < particles.length; j += 1) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distance = Math.hypot(dx, dy);
        const maxDistance = window.innerWidth < 768 ? 112 : 150;

        if (distance < maxDistance) {
          drawLine(a, b, (1 - distance / maxDistance) * 0.52);
        }
      }
    }
  }

  function tick() {
    if (!running) return;
    draw();
    rafId = requestAnimationFrame(tick);
  }

  function onPointerMove(event: PointerEvent) {
    const rect = canvasEl.getBoundingClientRect();
    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
    pointer.active = pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height;
  }

  function onPointerLeave() {
    pointer.active = false;
  }

  function onPointerDown(event: PointerEvent) {
    const rect = canvasEl.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (x < 0 || x > width || y < 0 || y > height) return;
    event.preventDefault();
    pushParticles(x, y, 4);
  }

  function onVisibilityChange() {
    if (reduceMotion) return;

    if (document.hidden) {
      running = false;
      cancelAnimationFrame(rafId);
    } else if (!running) {
      running = true;
      rafId = requestAnimationFrame(tick);
    }
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  window.addEventListener('resize', resize, { passive: true });
  stage.addEventListener('pointermove', onPointerMove, { passive: true });
  stage.addEventListener('pointerleave', onPointerLeave);
  stage.addEventListener('pointerdown', onPointerDown);
  document.addEventListener('visibilitychange', onVisibilityChange);

  resize();
  if (!reduceMotion) {
    rafId = requestAnimationFrame(tick);
  }

  return {
    dispose() {
      running = false;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerleave', onPointerLeave);
      stage.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    },
  };
}

export function mountParticleStages() {
  document.querySelectorAll<HTMLElement>('[data-particle-stage]').forEach((stage) => {
    if (HANDLES.has(stage)) return;

    const handle = mountParticleStage(stage);
    if (handle) {
      HANDLES.set(stage, handle);
    }
  });
}
