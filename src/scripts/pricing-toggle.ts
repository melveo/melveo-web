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

export function mountPricingToggle() {
  const sections = document.querySelectorAll<HTMLElement>('[data-pricing-section]');
  if (sections.length === 0) return;

  sections.forEach((section) => {
    const buttons = section.querySelectorAll<HTMLButtonElement>('[data-period-set]');
    if (buttons.length === 0) return;

    function setPeriod(period: Period) {
      section.dataset.period = period;
      buttons.forEach((btn) => {
        const isActive = btn.dataset.periodSet === period;
        btn.classList.toggle('pricing-toggle-btn--active', isActive);
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
    }

    buttons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const period = btn.dataset.periodSet as Period | undefined;
        if (period === 'monthly' || period === 'yearly') {
          setPeriod(period);
        }
      });
    });

    // Init from current data-period (defaults to "yearly" in the SSR
    // markup so first paint already shows the recommended option).
    const initial = (section.dataset.period as Period | undefined) ?? 'yearly';
    setPeriod(initial);
  });
}
