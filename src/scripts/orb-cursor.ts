/**
 * Orb cursor-mask interaction (Giomgio codepen abxGyQX) — desktop
 * uses pointer-follow on desktop and ambient auto-orbit on touch
 * devices, with an optional long-press drag while the finger is held.
 *
 *   • Fine pointer (`(pointer: fine)`)  — mice, trackpads
 *     pointermove → rAF-batched write of percentage values into
 *     --x / --y on the secondary layer.
 *
 *   • Coarse pointer (`(pointer: coarse)`) — phones, tablets
 *     ambient auto-orbit on a slow Lissajous path so the orb is alive
 *     without requiring gyro permissions. A long press activates
 *     temporary finger control; releasing returns to auto-orbit.
 *
 * rAF batching: on rapid input devices pointermove can fire 200+ Hz,
 * which used to translate to 200+ style writes per second. Now we
 * stash the latest values in plain variables and flush at most once
 * per frame.
 */

const ORBIT_PERIOD_X_MS = 10500;
const ORBIT_PERIOD_Y_MS = 12800;
const LONG_PRESS_MS = 420;
const MOVE_CANCEL_PX = 12;

export function mountOrbCursor() {
  const wrapper = document.querySelector<HTMLElement>('[data-orb-wrapper]');
  const secondary = document.querySelector<HTMLElement>('[data-orb-secondary]');
  if (!wrapper || !secondary) return;

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

  function setFromClientPoint(clientX: number, clientY: number) {
    pendingX = Math.min(95, Math.max(5, (clientX / window.innerWidth) * 100));
    pendingY = Math.min(95, Math.max(5, (clientY / window.innerHeight) * 100));
    scheduleWrite();
  }

  /* ── Fine-pointer path (mouse / trackpad) ───────────────────────── */
  function onPointerMove(event: PointerEvent) {
    setFromClientPoint(event.clientX, event.clientY);
  }

  function onPointerDown(event: PointerEvent) {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      event.preventDefault();
    }
  }

  /* ── Coarse-pointer path (touch) ────────────────────────────────── */
  let orbitRaf = 0;
  let orbitStart = 0;
  let orbitPaused = false;

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

  /* ── Touch long-press drag ────────────────────────────────────────
     Short taps and scroll gestures keep normal page behavior. Only a
     stationary long press takes over the orb until pointerup. */
  let touchPointerId: number | null = null;
  let touchStartX = 0;
  let touchStartY = 0;
  let longPressTimer = 0;
  let touchDragActive = false;

  function preventTouchScroll(event: TouchEvent) {
    if (touchDragActive) event.preventDefault();
  }

  function clearLongPressTimer() {
    if (longPressTimer !== 0) {
      window.clearTimeout(longPressTimer);
      longPressTimer = 0;
    }
  }

  function endTouchDrag() {
    clearLongPressTimer();
    touchPointerId = null;
    wrapper!.classList.remove('is-orb-touch-dragging');

    if (touchDragActive) {
      touchDragActive = false;
      window.removeEventListener('touchmove', preventTouchScroll);
      startOrbit();
    }
  }

  function activateTouchDrag() {
    if (touchPointerId === null) return;
    clearLongPressTimer();
    touchDragActive = true;
    wrapper!.classList.add('is-orb-touch-dragging');
    stopOrbit();
    setFromClientPoint(touchStartX, touchStartY);
    window.addEventListener('touchmove', preventTouchScroll, { passive: false });
  }

  function onTouchPointerDown(event: PointerEvent) {
    if (event.pointerType !== 'touch' || touchPointerId !== null) return;

    touchPointerId = event.pointerId;
    touchStartX = event.clientX;
    touchStartY = event.clientY;
    clearLongPressTimer();
    longPressTimer = window.setTimeout(activateTouchDrag, LONG_PRESS_MS);
  }

  function onTouchPointerMove(event: PointerEvent) {
    if (event.pointerId !== touchPointerId) return;

    if (!touchDragActive) {
      const dx = event.clientX - touchStartX;
      const dy = event.clientY - touchStartY;
      if (Math.hypot(dx, dy) > MOVE_CANCEL_PX) {
        endTouchDrag();
      }
      return;
    }

    event.preventDefault();
    setFromClientPoint(event.clientX, event.clientY);
  }

  function onTouchPointerEnd(event: PointerEvent) {
    if (event.pointerId === touchPointerId) {
      endTouchDrag();
    }
  }

  /* ── Wire up depending on input class ──────────────────────────── */
  if (isCoarse) {
    /* Touch devices: ambient auto-orbit + optional long-press drag. */
    startOrbit();
    wrapper.addEventListener('pointerdown', onTouchPointerDown, { passive: true });
    wrapper.addEventListener('pointermove', onTouchPointerMove, { passive: false });
    wrapper.addEventListener('pointerup', onTouchPointerEnd);
    wrapper.addEventListener('pointercancel', onTouchPointerEnd);
  } else {
    /* Mouse / trackpad — codepen-style cursor follow only. */
    window.addEventListener('pointermove', onPointerMove, { passive: true });
  }

  wrapper.addEventListener('pointerdown', onPointerDown);

  /* Pause RAFs when the tab goes to background. */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (writeRaf !== 0) cancelAnimationFrame(writeRaf);
      writeRaf = 0;
      endTouchDrag();
      stopOrbit();
    } else if (isCoarse) {
      startOrbit();
    }
  });
}
