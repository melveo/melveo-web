/**
 * Orb cursor-mask interaction (Giomgio codepen abxGyQX), 1:1 port.
 *
 * Tracks the cursor anywhere in the viewport and writes its
 * percentage position into `--x` / `--y` CSS variables on the
 * secondary orb layer. Those variables are registered as typed
 * `<percentage>` properties via `@property` in OrbStage.astro so the
 * browser smooth-transitions them automatically (the codepen used
 * GSAP for the lerp; we lean on native CSS transition).
 *
 * Smoothness:
 *   - Pointermove fires 60-200+ Hz on modern devices. Writing
 *     setProperty on every event causes redundant style invalidation
 *     and looked "choppy" on slower GPUs because the browser couldn't
 *     coalesce all the work into one frame.
 *   - We now batch updates via requestAnimationFrame: every
 *     pointermove just stores the pending percentage; the next rAF
 *     flushes the latest values into inline style. Result: at most
 *     one style write per frame (~16ms), which the CSS transition
 *     then interpolates from. The visual lerp is owned by the GPU
 *     compositor.
 *   - `getCoalescedEvents()` would also work but rAF batching is
 *     simpler and covers any input device (high-Hz mice, touch).
 */

export function mountOrbCursor() {
  const secondary = document.querySelector<HTMLElement>('[data-orb-secondary]');
  if (!secondary) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  let pendingX = 70;
  let pendingY = 50;
  let rafId = 0;

  function flush() {
    rafId = 0;
    secondary!.style.setProperty('--x', pendingX.toFixed(2) + '%');
    secondary!.style.setProperty('--y', pendingY.toFixed(2) + '%');
  }

  function onMove(event: PointerEvent) {
    pendingX = (event.clientX / window.innerWidth) * 100;
    pendingY = (event.clientY / window.innerHeight) * 100;
    if (rafId === 0) {
      rafId = requestAnimationFrame(flush);
    }
  }

  /* Listener on window because the secondary layer has
     `pointer-events: none` (per codepen — the layer would otherwise
     swallow events and break the reveal). */
  window.addEventListener('pointermove', onMove, { passive: true });

  /* Pause + cancel any pending rAF when the tab is hidden so we
     don't leak frames or accumulate stale state. */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && rafId !== 0) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
  });
}
