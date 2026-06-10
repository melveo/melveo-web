/**
 * Pricing monthly/yearly toggle.
 *
 * State is held in `data-period` on the section root; CSS shows the
 * matching `.pricing-price-block--monthly` or `--yearly` block on each
 * card and slides `.pricing-toggle-thumb` to the active button.
 *
 * The two buttons set their own `aria-selected` state too so screen
 * readers know which billing period is active.
 */

type Period = 'monthly' | 'yearly';

const reduceMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/*
  Odometer price morph (2026-06-10): when the billing period flips, the
  incoming block's amount counts from the OUTGOING period's value to its
  own (17 900 → 1 790 rolls instead of snapping). The exact SSR thousands
  separator is detected from the rendered text so cs/en formatting stays
  byte-identical once the animation settles.
*/
const easeOutCubic = (p: number) => 1 - Math.pow(1 - p, 3);

function formatLike(sample: string, value: number) {
  const sep = sample.match(/\d([^\d])\d{3}/)?.[1] ?? ' ';
  return Math.round(value)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

function animateAmount(el: HTMLElement, from: number, to: number) {
  const sample = el.textContent ?? '';
  const start = performance.now();
  const DURATION = 460;
  const tick = (now: number) => {
    const p = Math.min(1, (now - start) / DURATION);
    const value = from + (to - from) * easeOutCubic(p);
    el.textContent = formatLike(sample, value);
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function morphPrices(section: HTMLElement, period: Period) {
  if (reduceMotion()) return;
  const other: Period = period === 'monthly' ? 'yearly' : 'monthly';
  section
    .querySelectorAll<HTMLElement>(`.pricing-price-block--${period} .pricing-amount`)
    .forEach((el) => {
      const card = el.closest('.pricing-card');
      const otherEl = card?.querySelector<HTMLElement>(
        `.pricing-price-block--${other} .pricing-amount`,
      );
      const to = Number(el.dataset.amount);
      const from = Number(otherEl?.dataset.amount ?? to);
      if (!Number.isFinite(to) || !Number.isFinite(from) || from === to) return;
      animateAmount(el, from, to);
    });
}

/*
  Spotlight border — pricing cards get a cyan glow ring that follows the
  cursor (CSS ::after masked border reads --mx/--my). One listener per
  grid, rAF-coalesced, precision pointers only.
*/
function mountCardSpotlight(section: HTMLElement) {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  const cards = section.querySelectorAll<HTMLElement>('.pricing-card');
  if (cards.length === 0) return;
  let raf = 0;
  let last: PointerEvent | null = null;
  const apply = () => {
    raf = 0;
    if (!last) return;
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${last!.clientX - rect.left}px`);
      card.style.setProperty('--my', `${last!.clientY - rect.top}px`);
    });
  };
  section.addEventListener(
    'pointermove',
    (event) => {
      last = event;
      if (raf === 0) raf = requestAnimationFrame(apply);
    },
    { passive: true },
  );
}

export function mountPricingToggle() {
  const sections = document.querySelectorAll<HTMLElement>('[data-pricing-section]');
  if (sections.length === 0) return;

  sections.forEach((section) => {
    const buttons = section.querySelectorAll<HTMLButtonElement>('[data-period-set]');
    if (buttons.length === 0) return;
    const toggle = section.querySelector<HTMLElement>('.pricing-toggle');
    const badge = section.querySelector<HTMLElement>('.pricing-toggle-savings');
    badge?.addEventListener('animationend', () => badge.classList.remove('is-pop'));
    mountCardSpotlight(section);

    function syncThumb(period: Period) {
      if (!toggle) return;
      const active = Array.from(buttons).find((btn) => btn.dataset.periodSet === period);
      if (!active) return;
      const toggleRect = toggle.getBoundingClientRect();
      const activeRect = active.getBoundingClientRect();
      toggle.style.setProperty('--toggle-x', `${activeRect.left - toggleRect.left}px`);
      toggle.style.setProperty('--toggle-w', `${activeRect.width}px`);
      toggle.classList.add('pricing-toggle--ready');
    }

    function setPeriod(period: Period, animate = false) {
      section.dataset.period = period;
      buttons.forEach((btn) => {
        const isActive = btn.dataset.periodSet === period;
        btn.classList.toggle('pricing-toggle-btn--active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      requestAnimationFrame(() => syncThumb(period));
      if (animate) {
        morphPrices(section, period);
        if (period === 'yearly' && !reduceMotion()) {
          badge?.classList.add('is-pop');
        }
      }
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const period = btn.dataset.periodSet as Period | undefined;
        if (period === 'monthly' || period === 'yearly') {
          const changed = section.dataset.period !== period;
          setPeriod(period, changed);
        }
      });
    });

    // Init from current data-period (defaults to "yearly" in the SSR
    // markup so first paint already shows the recommended option).
    const initial = (section.dataset.period as Period | undefined) ?? 'yearly';
    setPeriod(initial);
    window.addEventListener('resize', () => {
      const current = (section.dataset.period as Period | undefined) ?? initial;
      syncThumb(current);
    }, { passive: true });
  });
}
