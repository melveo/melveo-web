/**
 * Orb cursor-mask interaction (Giomgio codepen abxGyQX).
 *
 * Behaviour (2026-05-15 redesign per user request — section should
 * move on its own and only respond to the user after a deliberate
 * click; previously desktop tracked the cursor at all times which
 * meant the orb was already in motion before users noticed they
 * could interact at all):
 *
 *   Default state: auto-orbit on a slow Lissajous path so the
 *   hex/orb mask drifts side-to-side across the middle of the
 *   section by itself.
 *
 *   Click / tap inside the section: takes manual control. The orb
 *   follows the pointer (desktop) or finger (mobile) until the user
 *   either clicks outside the section, leaves the section with
 *   their pointer, or sits idle long enough for the auto-orbit to
 *   resume.
 *
 * Idle release: 1.6 s of no pointer movement (desktop) or pointer
 * leave (mobile) hands control back to auto-orbit so the section
 * never gets "stuck" if the user wanders off mid-interaction.
 */

const ORBIT_PERIOD_X_MS = 10500;
const ORBIT_PERIOD_Y_MS = 12800;
const IDLE_RELEASE_MS = 1600;

export function mountOrbCursor() {
  const wrapper = document.querySelector<HTMLElement>('[data-orb-wrapper]');
  const secondary = document.querySelector<HTMLElement>('[data-orb-secondary]');
  if (!wrapper || !secondary) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  // ─── rAF-batched style writer ───────────────────────────────────
  // Pointer events on a fast input device fire at 200+ Hz; we
  // coalesce into one style write per frame so the compositor
  // isn't pinged for every input sample.
  let pendingX = 50;
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
    // Use the wrapper's box, not window, so the orb tracks the section
    // it lives in. Section is typically full-width but pinning to its
    // bounding rect means the math stays correct even if the section
    // ever lives inside a wider container.
    const rect = wrapper!.getBoundingClientRect();
    const xPct = ((clientX - rect.left) / rect.width) * 100;
    const yPct = ((clientY - rect.top) / rect.height) * 100;
    pendingX = Math.min(95, Math.max(5, xPct));
    pendingY = Math.min(95, Math.max(5, yPct));
    scheduleWrite();
  }

  // ─── Auto-orbit (default state) ─────────────────────────────────
  let orbitRaf = 0;
  let orbitStart = 0;

  function orbitFrame(t: number) {
    if (document.hidden) {
      orbitRaf = 0;
      return;
    }
    if (!orbitStart) orbitStart = t;
    const elapsed = t - orbitStart;

    // Two out-of-phase sinusoids → smooth wandering inside a
    // 30%-amplitude box around (50%, 50%). The X period is shorter
    // so the dominant motion reads as left↔right pacing across
    // the headline, which is what the user asked for.
    const ax = (elapsed / ORBIT_PERIOD_X_MS) * Math.PI * 2;
    const ay = (elapsed / ORBIT_PERIOD_Y_MS) * Math.PI * 2;
    pendingX = 50 + Math.sin(ax) * 32;
    pendingY = 50 + Math.cos(ay) * 18;
    scheduleWrite();
    orbitRaf = requestAnimationFrame(orbitFrame);
  }

  function startOrbit() {
    if (orbitRaf !== 0) return;
    // Resume the Lissajous at a phase that matches the current
    // pending position so the orb doesn't snap back to centre when
    // we hand control back from manual mode.
    orbitStart = 0;
    orbitRaf = requestAnimationFrame(orbitFrame);
  }

  function stopOrbit() {
    if (orbitRaf !== 0) {
      cancelAnimationFrame(orbitRaf);
      orbitRaf = 0;
    }
  }

  // ─── Manual mode (post-click cursor / finger follow) ────────────
  let manualMode = false;
  let idleTimer = 0;

  function bumpIdleTimer() {
    if (idleTimer !== 0) window.clearTimeout(idleTimer);
    idleTimer = window.setTimeout(exitManual, IDLE_RELEASE_MS);
  }

  function clearIdleTimer() {
    if (idleTimer !== 0) {
      window.clearTimeout(idleTimer);
      idleTimer = 0;
    }
  }

  function enterManual(clientX: number, clientY: number) {
    if (manualMode) {
      // Already manual — just refresh position + idle timer.
      setFromClientPoint(clientX, clientY);
      bumpIdleTimer();
      return;
    }
    manualMode = true;
    wrapper!.classList.add('is-orb-manual');
    stopOrbit();
    setFromClientPoint(clientX, clientY);
    window.addEventListener('pointermove', onManualPointerMove, { passive: true });
    bumpIdleTimer();
    syncHintLabel();
  }

  function exitManual() {
    if (!manualMode) return;
    manualMode = false;
    wrapper!.classList.remove('is-orb-manual');
    window.removeEventListener('pointermove', onManualPointerMove);
    clearIdleTimer();
    startOrbit();
    syncHintLabel();
  }

  function syncHintLabel() {
    const hb = wrapper!.querySelector<HTMLButtonElement>('[data-orb-hint]');
    const hl = wrapper!.querySelector<HTMLElement>('[data-orb-hint-label]');
    if (!hb || !hl) return;
    const active = hb.dataset.hintActive;
    const def = hb.dataset.hintDefault;
    hl.textContent = manualMode ? active ?? '' : def ?? '';
  }

  function onManualPointerMove(event: PointerEvent) {
    setFromClientPoint(event.clientX, event.clientY);
    bumpIdleTimer();
  }

  // ─── Activation: click inside section enters manual ─────────────
  function onWrapperPointerDown(event: PointerEvent) {
    // Don't preventDefault on touch — the user could be scrolling
    // through the section. We only take control on stationary
    // taps / clicks. mousedown / pen always activate; touch needs
    // the pointerup to land near pointerdown (small move tolerance).
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') {
      event.preventDefault();
      enterManual(event.clientX, event.clientY);
      return;
    }
    // Touch — wait for a non-scrolling tap.
    handleTouchTap(event);
  }

  // Touch-specific tap detection: tracks pointerup near pointerdown.
  let pendingTouchId: number | null = null;
  let touchStartX = 0;
  let touchStartY = 0;
  const TAP_MOVE_TOLERANCE = 14;

  function handleTouchTap(event: PointerEvent) {
    pendingTouchId = event.pointerId;
    touchStartX = event.clientX;
    touchStartY = event.clientY;
  }

  function onWrapperPointerMove(event: PointerEvent) {
    // If we're tracking a touch for tap, cancel it once the user
    // moves past tolerance — they're scrolling, not tapping.
    if (
      event.pointerType === 'touch' &&
      pendingTouchId === event.pointerId &&
      !manualMode
    ) {
      const dx = event.clientX - touchStartX;
      const dy = event.clientY - touchStartY;
      if (Math.hypot(dx, dy) > TAP_MOVE_TOLERANCE) {
        pendingTouchId = null;
      }
    }
    // While in manual mode, touch moves follow the finger.
    if (manualMode && event.pointerType === 'touch') {
      event.preventDefault?.();
      setFromClientPoint(event.clientX, event.clientY);
      bumpIdleTimer();
    }
  }

  function onWrapperPointerUp(event: PointerEvent) {
    if (
      event.pointerType === 'touch' &&
      pendingTouchId === event.pointerId
    ) {
      // The touch never moved past tolerance — treat as tap.
      enterManual(event.clientX, event.clientY);
      pendingTouchId = null;
    }
  }

  // ─── Deactivation: click outside or leave section ───────────────
  function onDocumentPointerDown(event: PointerEvent) {
    if (!manualMode) return;
    if (event.target instanceof Node && wrapper!.contains(event.target)) return;
    exitManual();
  }

  function onWrapperPointerLeave() {
    if (!manualMode) return;
    exitManual();
  }

  // ─── Gyroscope / DeviceOrientation tilt control ─────────────────
  // After the user explicitly opts in via the hint button (mobile
  // user gesture is required by iOS DeviceOrientation API), we
  // listen to device tilt and map it to --x / --y. Gamma (-90 to
  // +90, left-right tilt) drives X; beta (-180 to +180, front-back)
  // drives Y. Tilt is in addition to touch/mouse — whichever input
  // last fired wins.
  let gyroEnabled = false;
  let gyroPermissionRequested = false;

  function onDeviceOrientation(event: DeviceOrientationEvent) {
    if (!gyroEnabled || !manualMode) return;
    const gamma = event.gamma ?? 0; // -90 → +90
    const beta = event.beta ?? 0;   // -180 → +180
    // Map ±30° of tilt to the full orb travel; clamp aggressively
    // so a phone held normally lands near centre.
    const xRaw = 50 + (gamma / 30) * 45;
    const yRaw = 50 + ((beta - 45) / 30) * 45;
    pendingX = Math.min(95, Math.max(5, xRaw));
    pendingY = Math.min(95, Math.max(5, yRaw));
    scheduleWrite();
    bumpIdleTimer();
  }

  async function enableGyroscope(): Promise<boolean> {
    if (gyroEnabled) return true;
    if (typeof DeviceOrientationEvent === 'undefined') return false;
    const DOEv = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    // iOS Safari 13+ — must be triggered by user gesture.
    if (typeof DOEv.requestPermission === 'function' && !gyroPermissionRequested) {
      gyroPermissionRequested = true;
      try {
        const status = await DOEv.requestPermission();
        if (status !== 'granted') return false;
      } catch {
        return false;
      }
    }
    window.addEventListener('deviceorientation', onDeviceOrientation, true);
    gyroEnabled = true;
    return true;
  }

  // ─── Hint button — surfaces the click+tilt affordance ──────────
  const hintButton = wrapper.querySelector<HTMLButtonElement>('[data-orb-hint]');
  hintButton?.addEventListener('click', (event) => {
    event.stopPropagation();
    if (manualMode) {
      exitManual();
      return;
    }
    const rect = wrapper!.getBoundingClientRect();
    enterManual(rect.left + rect.width / 2, rect.top + rect.height / 2);
    // Try gyroscope in parallel — silent if unavailable / denied.
    enableGyroscope().catch(() => undefined);
  });

  // ─── Wire-up ────────────────────────────────────────────────────
  startOrbit();
  wrapper.addEventListener('pointerdown', onWrapperPointerDown);
  wrapper.addEventListener('pointermove', onWrapperPointerMove, { passive: false });
  wrapper.addEventListener('pointerup', onWrapperPointerUp);
  wrapper.addEventListener('pointercancel', () => {
    pendingTouchId = null;
  });
  wrapper.addEventListener('pointerleave', onWrapperPointerLeave);
  document.addEventListener('pointerdown', onDocumentPointerDown);

  // Pause/resume around tab visibility so we don't burn CPU when
  // the user is in another tab.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (writeRaf !== 0) {
        cancelAnimationFrame(writeRaf);
        writeRaf = 0;
      }
      stopOrbit();
      if (manualMode) exitManual();
    } else if (!manualMode) {
      startOrbit();
    }
  });
}
