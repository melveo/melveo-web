/**
 * Orb cursor-mask interaction (Giomgio codepen abxGyQX), 1:1 port
 * with a touch-device fallback the codepen lacks.
 *
 * Two paths depending on the input class:
 *
 *   • Fine pointer (`(pointer: fine)`)  — mice, trackpads
 *     pointermove → rAF-batched write of percentage values into
 *     --x / --y on the secondary layer. The CSS transition
 *     (registered via @property in OrbStage.astro) interpolates
 *     between samples for a buttery feel.
 *
 *   • Coarse pointer (`(pointer: coarse)`) — phones, tablets
 *     There is no pointermove on a finger that isn't touching, so
 *     the circle would otherwise sit motionless at 70%/50%. We auto-
 *     orbit it on a slow Lissajous path (sin/cos out of phase) so
 *     the effect is still alive. As soon as the user does touch the
 *     screen, pointer events take over and the circle follows the
 *     finger; on touch end we resume the auto-orbit after a short
 *     pause.
 *
 * rAF batching: on rapid input devices pointermove can fire 200+ Hz,
 * which used to translate to 200+ style writes per second. Now we
 * stash the latest values in plain variables and flush at most once
 * per frame.
 */

const ORBIT_PERIOD_X_MS = 9000;
const ORBIT_PERIOD_Y_MS = 11000;
const ORBIT_RESUME_DELAY = 1500;

export function mountOrbCursor() {
  const secondary = document.querySelector<HTMLElement>('[data-orb-secondary]');
  if (!secondary) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const isCoarse = window.matchMedia('(pointer: coarse)').matches;

  let pendingX = 70;
  let pendingY = 50;
  let writeRaf = 0;

  function flushWrite() {
    writeRaf = 0;
    secondary!.style.setProperty('--x', pendingX.toFixed(2) + '%');
    secondary!.style.setProperty('--y', pendingY.toFixed(2) + '%');
  }

  function scheduleWrite() {
    if (writeRaf === 0) writeRaf = requestAnimationFrame(flushWrite);
  }

  /* ── Fine-pointer path (mouse / trackpad) ───────────────────────── */
  function onPointerMove(event: PointerEvent) {
    pendingX = (event.clientX / window.innerWidth) * 100;
    pendingY = (event.clientY / window.innerHeight) * 100;
    scheduleWrite();
  }

  /* ── Coarse-pointer path (touch) ────────────────────────────────── */
  let orbitRaf = 0;
  let orbitStart = 0;
  let orbitPaused = false;
  let resumeTimer: number | null = null;

  function orbitFrame(t: number) {
    if (orbitPaused || document.hidden) {
      orbitRaf = 0;
      return;
    }
    if (!orbitStart) orbitStart = t;
    const elapsed = t - orbitStart;

    /*
      Two out-of-phase sinusoids → smooth Lissajous wandering inside
      a 30%-amplitude box centred on (50%, 50%). Slow enough to feel
      ambient, not distracting.
    */
    const ax = (elapsed / ORBIT_PERIOD_X_MS) * Math.PI * 2;
    const ay = (elapsed / ORBIT_PERIOD_Y_MS) * Math.PI * 2;
    pendingX = 50 + Math.sin(ax) * 30;
    pendingY = 50 + Math.cos(ay) * 24;
    scheduleWrite();
    orbitRaf = requestAnimationFrame(orbitFrame);
  }

  function startOrbit() {
    if (orbitRaf !== 0) return;
    orbitPaused = false;
    orbitStart = 0;
    orbitRaf = requestAnimationFrame(orbitFrame);
  }

  function stopOrbit() {
    orbitPaused = true;
    if (orbitRaf !== 0) {
      cancelAnimationFrame(orbitRaf);
      orbitRaf = 0;
    }
  }

  function onTouchStart(event: TouchEvent) {
    stopOrbit();
    const t = event.touches[0];
    if (t) {
      pendingX = (t.clientX / window.innerWidth) * 100;
      pendingY = (t.clientY / window.innerHeight) * 100;
      scheduleWrite();
    }
  }

  function onTouchMove(event: TouchEvent) {
    const t = event.touches[0];
    if (t) {
      pendingX = (t.clientX / window.innerWidth) * 100;
      pendingY = (t.clientY / window.innerHeight) * 100;
      scheduleWrite();
    }
  }

  function onTouchEnd() {
    if (resumeTimer !== null) clearTimeout(resumeTimer);
    resumeTimer = window.setTimeout(() => {
      resumeTimer = null;
      startOrbit();
    }, ORBIT_RESUME_DELAY);
  }

  /* ── Wire up depending on input class ──────────────────────────── */
  if (isCoarse) {
    /* On touch devices: ambient auto-orbit, hijacked by finger when
       touched. We still listen for pointermove in case the device
       has both kinds of input (e.g. iPad with mouse). */
    startOrbit();
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('touchcancel', onTouchEnd, { passive: true });
  } else {
    /* Mouse / trackpad — codepen-style cursor follow only. */
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }

  /* Pause RAFs when the tab goes to background. */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (writeRaf !== 0) cancelAnimationFrame(writeRaf);
      writeRaf = 0;
      stopOrbit();
    } else if (isCoarse) {
      startOrbit();
    }
  });
}
