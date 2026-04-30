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
 * No text rotation — per user 2026-04-30. The codepen has static
 * primary + secondary phrases; the only "change" is the cursor
 * sweeping across.
 */

export function mountOrbCursor() {
  const secondary = document.querySelector<HTMLElement>('[data-orb-secondary]');
  if (!secondary) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  /* Cursor follow — passive listener writes inline custom-property
     values; CSS transition + @property on the element handles the
     smooth ease for us. Codepen wires the listener on `window`, not
     on the element, because the secondary layer has
     `pointer-events: none`. We do the same. */
  window.addEventListener(
    'pointermove',
    (event) => {
      const x = (event.clientX / window.innerWidth) * 100;
      const y = (event.clientY / window.innerHeight) * 100;
      secondary.style.setProperty('--x', x.toFixed(2) + '%');
      secondary.style.setProperty('--y', y.toFixed(2) + '%');
    },
    { passive: true },
  );
}
