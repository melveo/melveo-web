/**
 * Text reveal — Daniel Haim codepen azmBEPL (V4-D5).
 *
 * Letter-by-letter masked reveal triggered by IntersectionObserver.
 * Used on privacy promise H2.
 *
 * Per PLAN.md §7.6.
 */

import SplitType from 'split-type';
import { animate, stagger } from 'motion';

export function mountTextReveal() {
  const targets = document.querySelectorAll<HTMLElement>('[data-text-reveal]');
  if (targets.length === 0) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  targets.forEach((target) => {
    // Wrap each line in a clip mask so chars slide up from below
    const split = new SplitType(target, { types: 'lines,chars' });
    const chars = (split.chars ?? []) as HTMLElement[];

    // Hide initially
    chars.forEach((c) => {
      c.style.display = 'inline-block';
      c.style.transform = 'translateY(110%)';
      c.style.opacity = '0';
    });

    // Wrap lines so we can clip
    if (split.lines) {
      split.lines.forEach((line) => {
        line.style.overflow = 'hidden';
        line.style.lineHeight = 'inherit';
      });
    }

    const obs = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (!entry?.isIntersecting) return;
      obs.disconnect();

      animate(
        chars,
        { transform: ['translateY(110%)', 'translateY(0%)'], opacity: [0, 1] },
        {
          duration: 0.7,
          delay: stagger(0.018),
          ease: [0.32, 0.72, 0, 1],
        },
      );
    }, { threshold: 0.4 });

    obs.observe(target);
  });
}
