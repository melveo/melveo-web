# Melveo Web Full Audit — 2026-05-26

## Scope

Target: local production preview at `http://127.0.0.1:4321` after a clean `rm -rf dist && npm run build`.

Routes checked:
- `/`
- `/cs/`
- `/en/`
- `/cs/privacy/`
- `/en/privacy/`
- `/cs/terms/`
- `/en/terms/`
- `/robots.txt`
- `/sitemap-index.xml`

Primary animated sections:
- Hero
- Honeycomb image morph
- Data → feedback
- Orb / whole-club section
- Contact / footer

## Commands

- `npm run check`
- `npm run build`
- `npm run preview -- --host 0.0.0.0 --port 4321`
- `npm run audit:scroll`
- Local Lighthouse mobile and desktop for `/cs/`
- Custom Playwright route, metadata, responsive, image, link and interaction checks

## Result Summary

No blocking issue found.

Passed:
- Astro check: 0 errors, 0 warnings, 0 hints.
- Build: passed.
- Routes: 9/9 returned `200`.
- Responsive smoke: 20 route/viewport checks passed.
- Scroll-performance audit: 50/50 viewport checks passed.
- Console/page errors: 0.
- Failed requests: 0.
- Broken images: 0.
- Horizontal overflow: 0.
- Missing image alt attributes: 0.
- Duplicate IDs: 0.
- Critical sections present on all checked responsive cases.
- Internal links discovered from landing/legal pages all returned `200`.

Lighthouse `/cs/`:
- Mobile: Performance 80, Accessibility 100, Best Practices 100, SEO 100.
- Desktop: Performance 99, Accessibility 100, Best Practices 100, SEO 100.

## Artifacts

Generated output:
- `output/playwright/full-audit-2026-05-26-2026-05-26T07-45-51-878Z/full-results.json`
- `output/playwright/animation-performance-2026-05-26T07-43-55-783Z/results.json`
- `output/lighthouse-2026-05-26/cs-mobile.json`
- `output/lighthouse-2026-05-26/cs-desktop.json`

Representative screenshots:
- `output/playwright/full-audit-2026-05-26-2026-05-26T07-45-51-878Z/iphone-13-cs-hero.png`
- `output/playwright/full-audit-2026-05-26-2026-05-26T07-45-51-878Z/iphone-13-cs-honeycomb.png`
- `output/playwright/full-audit-2026-05-26-2026-05-26T07-45-51-878Z/iphone-13-cs-data-feedback.png`
- `output/playwright/full-audit-2026-05-26-2026-05-26T07-45-51-878Z/desktop-cs-honeycomb.png`
- `output/playwright/full-audit-2026-05-26-2026-05-26T07-45-51-878Z/desktop-cs-data-feedback.png`

## Findings

### P1 — Honeycomb section still creates long synthetic scroll frames

The section is functional and visually stable, but scroll audit still shows long frame spikes in the honeycomb/full-page probes.

Aggregated p95 frame intervals:
- `honeycomb`: median 68.7ms, p75 112.2ms, p95 162.8ms, max 202.3ms.
- `full`: median 67.8ms, p75 97.4ms, p95 145.7ms, max 186.3ms.
- `dataFeedback`: median 26.2ms, p75 27.7ms, p95 66.5ms, max 72.1ms.
- `orb`: median 53.7ms, p75 73.5ms, p95 100.1ms, max 108.1ms.

Interpretation:
- The page is not broken, but the honeycomb morph remains the heaviest runtime section.
- This matches previous phone feedback: most page sections feel smooth, but this scroll-driven image morph can still feel less consistent on weaker/mobile devices.

Recommended next work:
- Replace per-scroll DOM/layout reads with a cached geometry model updated only on resize.
- Move visual state writes to CSS variables on a single parent where possible.
- Avoid recalculating individual item transforms in the scroll handler if the section is outside the active range.
- Consider a mobile-specific simplified morph where the main image transition is shorter and the surrounding honeycomb settles earlier.

### P2 — Mobile Lighthouse performance is lower than desktop

Mobile Lighthouse performance is 80 while desktop is 99.

Main signal:
- LCP is text-based and measured at 4.7s.
- TBT is 0ms.
- CLS is 0.007.
- Total transfer size is acceptable at about 692KiB.

Interpretation:
- The page is not blocked by JavaScript execution.
- The mobile score appears driven by render timing around the hero text/background rather than heavy blocking work.

Recommended next work:
- Keep checking this on production HTTPS/CDN, because local Lighthouse can be pessimistic.
- If production also stays around 80, optimize hero first paint by reducing initial animated background work and making the LCP text paint as early as possible.

### P2 — Cookie banner heavily covers mobile visual sections

The cookie banner is functional, but on first visit it covers a large part of the honeycomb and data-feedback screenshots on mobile.

Impact:
- Legal/compliance behavior is correct.
- Visually, it can hide the very sections that explain the product.

Recommended next work:
- Keep the current legal choices, but reduce mobile banner height.
- Consider a slimmer one-line mobile banner with choices in a horizontally scroll-safe row.
- After accepting/declining, keep the current clean experience.

### P3 — Data-feedback active particle count is random but not always visibly dense

Interaction check:
- All 9 input pulse nodes exist.
- At the sampled instant, 1 particle was visible.

Interpretation:
- The random model works, but depending on sample timing the section can look sparse.

Recommended next work:
- Keep max concurrent particles at 2 on mobile for performance.
- On desktop/tablet, allow 2–3 concurrent visible particles with slightly randomized durations.
- Add a minimum “activity floor” only while the section is in viewport.

### P3 — Automated text overflow false positives from hidden/animated spans

The responsive audit found apparent overflow in spans with `clientWidth: 1`, but these are hidden/animated semantic spans rather than visible broken text.

Recommendation:
- No urgent visual fix.
- Future audit script should ignore `[aria-hidden]`, `.sr-only`, hidden split-text spans and animation helper spans.

## Passed Visual Checks

Hero:
- CS/EN metadata is correct.
- H1 count is 1.
- Buttons keep consistent height.
- No horizontal overflow on checked mobile, tablet, desktop and wide sizes.

Honeycomb:
- Section exists on both languages and all checked viewport categories.
- No broken images.
- No horizontal overflow.
- Visual structure is intact in screenshots.

Data → feedback:
- Section exists on all checked cases.
- No broken images or console errors.
- Particle nodes exist for all inputs.

Orb / whole-club:
- Section exists on all checked cases.
- Mobile tap activates manual mode.
- Finger drag moves the orb from center to a new position.
- Note: iOS native motion permission still requires HTTPS; local `http://192.168...` cannot reliably show the native permission dialog.

Contact/footer/legal:
- Internal legal and locale links return `200`.
- No duplicated IDs or missing critical links were found.

## Recommended Implementation Plan

1. Optimize honeycomb scroll runtime first.
   - This is the only recurring high-impact runtime risk.
   - Preserve the current visual design.
   - Goal: reduce honeycomb p95 synthetic frame interval below 90ms and remove >150ms spikes on mobile/tall viewports.

2. Reduce mobile cookie banner footprint.
   - Keep compliance.
   - Reduce visual obstruction of product sections.

3. Re-test Lighthouse on production after the next deploy.
   - If production mobile score is still around 80, profile hero LCP.
   - If production returns to 95+, treat local result as environment noise.

4. Tune data-feedback particle density.
   - Keep mobile performance budget.
   - Make desktop/tablet feel slightly more alive with 2–3 concurrent particles.

5. Harden audit tooling.
   - Filter hidden animation helper spans from text-overflow checks.
   - Add “cookie accepted” screenshot pass so visual QA sees the real post-consent page.

## Post-Fix Pass — 2026-05-26

Implemented:
- Honeycomb scroll controller now avoids redundant inline style writes per frame.
- Honeycomb cyan atmosphere was changed from a runtime canvas to a static CSS background field.
- Mobile cookie banner was compacted while preserving all consent actions.
- Data-feedback pulses were tuned to allow denser random activity and all input words can fire.
- Mobile data-feedback label placement was adjusted so `Nálada` no longer sits on the `melveo` core.

Verification after implementation:
- `npm run check`: 0 errors, 0 warnings, 0 hints.
- Clean `rm -rf dist && npm run build`: passed.
- Preview routes: 9/9 returned `200`, including `/en/privacy/` and `/en/terms/`.
- Final `npm run audit:scroll`: 50/50 viewport checks passed.
- Console issues: 0.
- Failed requests: 0.
- Horizontal overflow: 0.
- Broken images: 0.
- Visual screenshot pass: mobile, tablet, desktop, wide and tall breakpoints checked for hero, honeycomb and data-feedback.

Final scroll-performance aggregate:
- `full`: median 63.0ms, p75 82.4ms, p95 110.9ms, max 149.2ms.
- `honeycomb`: median 50.8ms, p75 82.2ms, p95 125.1ms, max 211.8ms.
- `dataFeedback`: median 25.7ms, p75 26.8ms, p95 27.2ms, max 27.3ms.
- `orb`: median 54.7ms, p75 67.6ms, p95 98.6ms, max 99.9ms.

Interpretation:
- Data-feedback is now stable in the automated scroll probe, with no frames over 50ms in the final run.
- Honeycomb is meaningfully better than the initial audit, especially in median and p75.
- Remaining honeycomb spikes are concentrated on extreme viewport sizes, especially 3840×2160. This is acceptable for the current visual ambition, but if the section must feel native-smooth on low-end mobile hardware, the next step is not another micro-optimization; it is a lower-cost mobile-specific morph variant.

Manual test URL:
- Local: `http://localhost:4321/cs/`
- Same network: `http://192.168.1.9:4321/cs/` or `http://192.168.1.7:4321/cs/`
