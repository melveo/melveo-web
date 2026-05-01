/**
 * Orb cursor-mask interaction (Giomgio codepen abxGyQX) — desktop
 * uses pointer-follow; phones use device orientation (gyro tilt)
 * because finger-drag conflicts with vertical scroll.
 *
 *   • Fine pointer (`(pointer: fine)`)  — mice, trackpads
 *     pointermove → rAF-batched write of percentage values into
 *     --x / --y on the secondary layer.
 *
 *   • Coarse pointer (`(pointer: coarse)`) — phones, tablets
 *     1. Default: ambient auto-orbit on a slow Lissajous path so
 *        the orb is alive without input.
 *     2. Mobile-only "Tilt phone" button (rendered in OrbStage):
 *        - On iOS 13+ DeviceOrientationEvent.requestPermission must
 *          be called from a user gesture; we do that here on tap.
 *        - On Android / older iOS the listener attaches directly.
 *        Once tilt is enabled we stop the auto-orbit and let
 *        deviceorientation drive --x / --y from gamma + beta.
 *     3. Touch is NOT wired — it would hijack scroll inside the
 *        section (user 2026-05-01: "tam bude problém se scrollem").
 *
 * rAF batching: on rapid input devices pointermove can fire 200+ Hz,
 * which used to translate to 200+ style writes per second. Now we
 * stash the latest values in plain variables and flush at most once
 * per frame.
 */

const ORBIT_PERIOD_X_MS = 10500;
const ORBIT_PERIOD_Y_MS = 12800;

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

  /* ── Fine-pointer path (mouse / trackpad) ───────────────────────── */
  function onPointerMove(event: PointerEvent) {
    pendingX = (event.clientX / window.innerWidth) * 100;
    pendingY = (event.clientY / window.innerHeight) * 100;
    scheduleWrite();
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

  /* ── Device-orientation tilt (mobile primary input) ─────────────
     gamma: -90..+90 (left-right tilt), beta: -180..+180 (front-back).
     We map to a centred range so the orb stays close to viewport
     centre with reasonable tilt. Holding the phone naturally (beta
     ≈ 30..60° forward) is the "neutral" pose. */
  let tiltActive = false;

  function onDeviceOrientation(event: DeviceOrientationEvent) {
    if (!tiltActive) return;
    const gamma = event.gamma ?? 0;
    const beta = event.beta ?? 30;
    // Clamp to a comfortable tilt window so the orb doesn't pin to
    // the viewport edges with small wrist movements.
    const xTilt = Math.max(-30, Math.min(30, gamma)) / 30;     // -1..1
    const yTilt = Math.max(-30, Math.min(30, beta - 45)) / 30; // -1..1, neutral at ~45° hold
    pendingX = 50 + xTilt * 32;
    pendingY = 50 + yTilt * 26;
    scheduleWrite();
  }

  /* ── Tilt-button handler (mobile only) ─────────────────────────── */
  async function enableTilt() {
    /* iOS 13+: DeviceOrientationEvent.requestPermission must be
       called from a user gesture. Older iOS / Android: not present,
       just attach the listener. */
    type DOEStatic = typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<'granted' | 'denied'>;
    };
    const DOE = (typeof DeviceOrientationEvent !== 'undefined'
      ? (DeviceOrientationEvent as DOEStatic)
      : null);
    if (!DOE) return false;

    if (typeof DOE.requestPermission === 'function') {
      try {
        const state = await DOE.requestPermission();
        if (state !== 'granted') return false;
      } catch {
        return false;
      }
    }

    stopOrbit();
    tiltActive = true;
    window.addEventListener('deviceorientation', onDeviceOrientation, { passive: true });
    return true;
  }

  function bindTiltButton() {
    const btn = document.querySelector<HTMLButtonElement>('[data-orb-tilt-toggle]');
    if (!btn) return;
    btn.addEventListener('click', async () => {
      if (tiltActive) return;
      const ok = await enableTilt();
      if (ok) {
        btn.dataset.state = 'on';
        btn.setAttribute('aria-pressed', 'true');
        const label = btn.querySelector<HTMLElement>('[data-orb-tilt-label]');
        if (label) {
          // Read the alternate label from a data attr on the button
          // (set lang-aware in the markup) — fall back to a sensible
          // default if not present.
          label.textContent = btn.dataset.activeLabel ?? label.textContent;
        }
      }
    });
  }

  /* ── Wire up depending on input class ──────────────────────────── */
  if (isCoarse) {
    /* Touch devices: ambient auto-orbit by default. The "Tilt phone"
       button (rendered in OrbStage) toggles to gyro-driven motion. */
    startOrbit();
    bindTiltButton();
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
      stopOrbit();
    } else if (isCoarse && !tiltActive) {
      startOrbit();
    }
  });
}
