/**
 * Orb cursor-mask interaction (Giomgio codepen abxGyQX).
 *
 * Tracks the cursor anywhere in the viewport and writes its
 * percentage position into `--x` / `--y` CSS variables on the
 * secondary orb layer. Those variables are registered as typed
 * `<percentage>` properties via `@property` in OrbStage.astro so the
 * browser smooth-transitions them automatically (the codepen used
 * GSAP for the lerp; we lean on native CSS transition).
 *
 * Phrase rotation cycles the secondary heading every 3.2s with
 * Motion-driven y/opacity crossfade.
 */

import { animate } from 'motion';

export function mountOrbCursor() {
  const secondary = document.querySelector<HTMLElement>('[data-orb-secondary]');
  const text = document.querySelector<HTMLElement>('[data-orb-rotate]');

  if (!secondary || !text) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  // Read phrases from data-attribute on the rotate element. Encoded
  // as JSON so they survive HTML attribute escaping for any locale.
  let phrases: string[] = [];
  try {
    const raw = text.dataset.orbPhrases;
    if (raw) phrases = JSON.parse(raw);
  } catch {
    // Fall through with the SSR-rendered phrase as a single-item list.
    phrases = [text.textContent?.trim() ?? ''];
  }

  /* Cursor follow — passive listener writes inline custom-property
     values; CSS transition + @property on the element handles the
     smooth ease for us. */
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

  /* Phrase rotation — only run when there are at least 2 phrases to
     cycle through. Pause on tab hide so we don't accumulate timers. */
  if (phrases.length > 1) {
    let idx = 0;
    let interval: number | null = null;

    const start = () => {
      if (interval != null) return;
      interval = window.setInterval(async () => {
        try {
          await animate(text, { opacity: [1, 0], y: [0, -16] }, { duration: 0.4 }).finished;
          idx = (idx + 1) % phrases.length;
          text.textContent = phrases[idx];
          await animate(text, { opacity: [0, 1], y: [16, 0] }, { duration: 0.5 }).finished;
        } catch {
          if (interval != null) {
            clearInterval(interval);
            interval = null;
          }
        }
      }, 3200);
    };

    const stop = () => {
      if (interval != null) {
        clearInterval(interval);
        interval = null;
      }
    };

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop();
      else start();
    });

    start();
  }
}
