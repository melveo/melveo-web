/**
 * Hero rotating word — Josh Cummings codepen jWLpQv (V4-D1).
 *
 * Cycles through a list of nouns under a clamp-sized H1 prefix.
 * Motion One y/opacity crossfade, 2400ms interval. SSR-rendered first
 * word means the layout never shifts (CLS=0).
 *
 * Per PLAN.md §7.1.
 */

import { animate } from 'motion';

const INTERVAL_MS = 2800;

const wordsByLang = {
  cs: ['tréninky', 'rozhodnutí', 'ráno', 'klub', 'sezóna'],
  en: ['trainings', 'decisions', 'mornings', 'clubs', 'seasons'],
} as const;

type Lang = keyof typeof wordsByLang;

export function mountRotateWord() {
  const el = document.querySelector<HTMLElement>('[data-rotate-word]');
  if (!el) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  // Detect locale from <html lang>
  const lang = (document.documentElement.lang === 'en' ? 'en' : 'cs') as Lang;
  const words = wordsByLang[lang];

  let idx = words.indexOf(el.textContent?.trim() ?? '');
  if (idx < 0) idx = 0;

  let timer: number | null = null;

  async function cycle() {
    idx = (idx + 1) % words.length;
    await animate(el!, { y: [0, -32], opacity: [1, 0] }, { duration: 0.35, easing: [0.32, 0.72, 0, 1] }).finished;
    el!.textContent = words[idx];
    await animate(el!, { y: [32, 0], opacity: [0, 1] }, { duration: 0.45, easing: [0.32, 0.72, 0, 1] }).finished;
  }

  function start() {
    if (timer != null) return;
    timer = window.setInterval(() => {
      cycle().catch(() => {/* swallow if user nav'd away */});
    }, INTERVAL_MS);
  }

  function stop() {
    if (timer != null) {
      clearInterval(timer);
      timer = null;
    }
  }

  // Pause when tab not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  start();
}
