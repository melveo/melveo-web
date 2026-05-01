/**
 * Hero rotating word — typewriter (Josh Cummings codepen jWLpQv).
 *
 * Reproduces the typed.js mechanic from the codepen: types out a word
 * character-by-character, pauses, then deletes character-by-character,
 * advances to the next phrase, repeat. The codepen's options:
 *
 *   typeSpeed:  50    — ms per character while typing
 *   backSpeed:  10    — ms per character while deleting
 *   backDelay:  2000  — ms hold after typing finishes
 *   showCursor: false — no blinking cursor
 *   loop:       false — stops on the last phrase
 *
 * For Melveo we keep it looping (more dynamic) and slow the speeds
 * down a bit so the Czech diacritics are readable.
 *
 * SSR renders the first phrase fully so first paint shows real
 * content (good LCP). On mount we swap into "deleting" state from
 * that initial phrase, which makes the very first scripted action a
 * smooth backspace — no jarring pop.
 */

const TYPE_SPEED = 70;
const BACK_SPEED = 25;
const BACK_DELAY = 1800;
const NEXT_DELAY = 200;

const wordsByLang = {
  cs: ['tréninky', 'rozhodnutí', 'ráno', 'klub', 'sezóna'],
  en: ['trainings', 'decisions', 'mornings', 'clubs', 'seasons'],
} as const;

type Lang = keyof typeof wordsByLang;

const mountedWords = new WeakSet<HTMLElement>();

function getPhrases(el: HTMLElement, lang: Lang): readonly string[] {
  const customWords = el.dataset.rotateWords
    ?.split('|')
    .map((word) => word.trim())
    .filter(Boolean);

  if (customWords && customWords.length > 0) {
    return customWords;
  }

  return wordsByLang[lang];
}

function mountTypedWord(el: HTMLElement, phrases: readonly string[]) {
  if (phrases.length === 0) return;

  // Start by treating the SSR-rendered word as already typed; the
  // first scripted action will be backspace.
  const initial = el.textContent?.trim() ?? phrases[0];
  let phraseIdx = Math.max(0, phrases.indexOf(initial));
  let charIdx = phrases[phraseIdx].length;
  let isDeleting = true;
  let timer: number | null = null;

  function clear() {
    if (timer != null) {
      clearTimeout(timer);
      timer = null;
    }
  }

  function tick() {
    timer = null;
    const phrase = phrases[phraseIdx];

    if (!isDeleting) {
      // Typing forward
      charIdx += 1;
      el.textContent = phrase.slice(0, charIdx);
      if (charIdx >= phrase.length) {
        // Finished typing — hold, then start deleting
        timer = window.setTimeout(() => {
          isDeleting = true;
          tick();
        }, BACK_DELAY);
        return;
      }
      timer = window.setTimeout(tick, TYPE_SPEED);
    } else {
      // Deleting backwards
      charIdx -= 1;
      el.textContent = phrase.slice(0, Math.max(0, charIdx));
      if (charIdx <= 0) {
        // Finished deleting — advance to next phrase
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        charIdx = 0;
        timer = window.setTimeout(tick, NEXT_DELAY);
        return;
      }
      timer = window.setTimeout(tick, BACK_SPEED);
    }
  }

  // Initial pause matching the codepen's first-paint dwell, so the
  // user has time to read the SSR phrase before deletion starts.
  timer = window.setTimeout(tick, BACK_DELAY);

  // Pause when tab is hidden, resume when visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clear();
    } else if (timer == null) {
      tick();
    }
  });
}

export function mountRotateWord() {
  const elements = document.querySelectorAll<HTMLElement>('[data-rotate-word]');
  if (elements.length === 0) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lang: Lang = document.documentElement.lang === 'en' ? 'en' : 'cs';

  if (reduceMotion) {
    // Don't cycle in reduced motion — leave the SSR-rendered words.
    return;
  }

  elements.forEach((el) => {
    if (mountedWords.has(el)) return;
    mountedWords.add(el);
    mountTypedWord(el, getPhrases(el, lang));
  });
}
