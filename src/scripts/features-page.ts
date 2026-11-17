/**
 * Features page motion (2026-11-17): scroll reveal, the sticky
 * coach/player switch with scroll-spy, pointer glow on the screen stages
 * and a light pointer parallax on the hero collage.
 *
 * Content is visible without this script; it only adds `features-js` to
 * <html> (which arms the reveal CSS) when motion is allowed.
 */

export function mountFeatures() {
  const root = document.querySelector<HTMLElement>('[data-features]');
  if (!root || root.dataset.mounted === 'true') return;
  root.dataset.mounted = 'true';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  if (!reduceMotion && 'IntersectionObserver' in window) {
    document.documentElement.classList.add('features-js');
    const reveal = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          reveal.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 },
    );
    root.querySelectorAll('[data-reveal]').forEach((el) => reveal.observe(el));
  }

  mountSwitch(root);

  if (!finePointer || reduceMotion) return;

  root.querySelectorAll<HTMLElement>('[data-stage], [data-door]').forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      const rect = el.getBoundingClientRect();
      const x = `${((event.clientX - rect.left) / rect.width) * 100}%`;
      const y = `${((event.clientY - rect.top) / rect.height) * 100}%`;
      el.style.setProperty('--mx', x);
      el.style.setProperty('--my', y);
      el.style.setProperty('--x', x);
      el.style.setProperty('--y', y);
    });
  });

  const collage = root.querySelector<HTMLElement>('[data-collage]');
  if (collage) {
    window.addEventListener(
      'pointermove',
      (event) => {
        collage.style.setProperty('--px', ((event.clientX / window.innerWidth) * 2 - 1).toFixed(3));
        collage.style.setProperty('--py', ((event.clientY / window.innerHeight) * 2 - 1).toFixed(3));
      },
      { passive: true },
    );
  }
}

function mountSwitch(root: HTMLElement) {
  const nav = root.querySelector<HTMLElement>('[data-switch]');
  if (!nav) return;
  const tabs = [...nav.querySelectorAll<HTMLAnchorElement>('[data-tab]')];
  const pill = nav.querySelector<HTMLElement>('[data-pill]');
  const chapterLists = [...nav.querySelectorAll<HTMLElement>('[data-chapters]')];
  const chapterLinks = [...nav.querySelectorAll<HTMLAnchorElement>('[data-chapter-link]')];
  const perspectives = [...root.querySelectorAll<HTMLElement>('[data-perspective]')];
  const chapters = [...root.querySelectorAll<HTMLElement>('[data-chapter]')];

  let current = '';
  const setPerspective = (id: string) => {
    if (id === current) return;
    current = id;
    for (const tab of tabs) {
      const active = tab.dataset.tab === id;
      tab.setAttribute('aria-current', String(active));
      if (active && pill) {
        pill.style.width = `${tab.offsetWidth}px`;
        pill.style.transform = `translateX(${tab.offsetLeft}px)`;
      }
    }
    for (const list of chapterLists) list.classList.toggle('is-active', list.dataset.chapters === id);
  };

  let currentChapter = '';
  const setChapter = (id: string) => {
    if (id === currentChapter) return;
    currentChapter = id;
    for (const link of chapterLinks) {
      const active = link.hash === `#${id}`;
      link.setAttribute('aria-current', String(active));
      // Keep the active chip visible in the horizontally scrolling row
      // without touching the page's vertical scroll.
      if (active && link.parentElement?.parentElement) {
        const list = link.parentElement.parentElement;
        list.scrollTo({ left: link.offsetLeft - list.clientWidth / 2 + link.offsetWidth / 2, behavior: 'smooth' });
      }
    }
  };

  // The perspective/chapter whose top has most recently crossed the band
  // just under the sticky bar is the one being read.
  const update = () => {
    const line = nav.getBoundingClientRect().bottom + 40;
    let perspective = perspectives[0]?.id ?? '';
    for (const p of perspectives) if (p.getBoundingClientRect().top <= line) perspective = p.id;
    setPerspective(perspective);
    let chapter = '';
    for (const c of chapters) if (c.getBoundingClientRect().top <= line) chapter = c.id;
    setChapter(chapter);
  };

  let queued = false;
  const onScroll = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      update();
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    current = '';
    update();
  });
  update();
}
