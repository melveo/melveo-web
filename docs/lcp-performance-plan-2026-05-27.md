# LCP / Performance Plan — 2026-05-27

## Current Audit Baseline

Local audited build:

- `npm run check`: pass, 0 errors / 0 warnings
- `npm run build`: pass
- `npm run audit:scroll`: pass on 50 alternating CS/EN viewports
- Scroll audit result:
  - failures: 0
  - console issues: 0
  - request failures: 0
  - horizontal overflow: 0
  - broken images: 0
- Lighthouse `/cs/`:
  - Performance: 80
  - Accessibility: 100
  - Best Practices: 100
  - SEO: 100
  - FCP: 2.3 s
  - LCP: 4.7 s
  - TBT: 0 ms
  - CLS: 0.007
- Lighthouse `/en/`:
  - Performance: 84
  - Accessibility: 100
  - Best Practices: 100
  - SEO: 100
  - FCP: 2.0 s
  - LCP: 4.2 s
  - TBT: 0 ms
  - CLS: 0.002

Interpretation:

- Runtime is healthy. No blocking JS problem was found.
- Main remaining opportunity is perceived load speed, especially LCP.
- Current visual direction should be preserved. Any performance work must not simplify the hero, honeycomb, pricing glass, or data-flow animation unless a measured regression forces it.

## Goals

1. Keep the current visual design and motion language intact.
2. Bring Lighthouse performance closer to 90+ on local preview and production.
3. Improve mobile perceived load without reintroducing scroll jank.
4. Preserve:
   - SEO 100
   - Accessibility 100
   - Best Practices 100
   - zero horizontal overflow
   - zero broken images
   - clean console

## Constraints

- Astro static build stays.
- Cloudflare Worker static assets stay.
- No WebGL changes unless an existing section explicitly requires it.
- No visual redesign during this performance pass.
- Any optimization must be tested on CS and EN routes.
- No lazy-loading strategy may cause first-viewport content to pop in late.

## Phase 1 — Measure LCP Element Precisely

Tasks:

- Run Lighthouse with trace output for `/cs/` and `/en/`.
- Identify the actual LCP node for:
  - mobile 390 x 844
  - desktop 1440 x 900
  - large desktop 1920 x 1080
- Confirm whether the LCP is:
  - hero text
  - hero background/canvas
  - first honeycomb image when scrolled in trace
  - font swap / font load related paint

Acceptance:

- Document exact LCP node, URL if image-based, and timing breakdown.
- Do not start image or CSS changes until this is known.

## Phase 2 — Critical CSS / Render Blocking

Lighthouse currently reports render-blocking CSS:

- `Landing.*.css`
- `BaseLayout.*.css`

Tasks:

- Inspect generated CSS bundle size and contents.
- Split or defer non-critical section CSS where Astro/Vite allows it without layout shift.
- Keep above-fold hero styles loaded immediately.
- Move below-fold-heavy styles behind component boundaries only if it does not create flash or hydration mismatch.

Potential tactics:

- Keep hero/base layout CSS critical.
- Move large below-fold component CSS into scoped component chunks where possible.
- Avoid importing heavy styles globally when only one section needs them.

Acceptance:

- Lighthouse render-blocking estimate decreases.
- No visible FOUC in hero/honeycomb/pricing.
- `npm run build`, `npm run audit:scroll`, visual screenshots pass.

## Phase 3 — Image Delivery

Lighthouse estimates roughly 152 KiB savings in image delivery, mostly honeycomb thumbnails displayed smaller than their file dimensions.

Tasks:

- Audit `/public/images/melveo-grid/thumbs`.
- Generate at least two thumbnail sizes for honeycomb:
  - small mobile displayed size
  - larger desktop displayed size
- Use `srcset` and `sizes` for honeycomb images.
- Keep existing high-quality originals for large morph states where needed.
- Confirm the central morph image never becomes blurry during the scroll transformation.

Acceptance:

- Lighthouse `image-delivery-insight` improves.
- Honeycomb remains sharp on 2x/3x mobile screens.
- No broken images.
- No visible quality loss in screenshots.

## Phase 4 — Font Loading

Current brand typography is visually important. Optimization must be careful.

Tasks:

- Check generated font requests and preload strategy.
- Confirm only required weights/axes are loaded above the fold.
- Verify `font-display` behavior does not cause visible layout shift.
- Consider preloading the primary hero font if it is delaying first text paint.

Acceptance:

- FCP improves or remains stable.
- CLS stays below 0.01 on tested pages.
- Hero text does not visibly jump.

## Phase 5 — Animation Budget Guardrails

The current scroll audit is clean but shows occasional high p95 frame intervals in synthetic large-viewport runs, mainly around honeycomb.

Tasks:

- Keep `npm run audit:scroll` as the regression gate.
- Add a stricter reporting threshold for honeycomb/mobile if needed:
  - no console errors
  - no overflow
  - no broken images
  - CLS below 0.02
  - p95 frame intervals tracked but not blindly failing on one synthetic spike
- Manually verify:
  - iPhone-sized viewport
  - narrow Android viewport
  - tablet portrait
  - tablet landscape
  - desktop 1440 x 900
  - wide desktop

Acceptance:

- Smooth perceived scroll through:
  - hero
  - honeycomb morph
  - data-feedback particle section
  - orb section
  - pricing

## Phase 6 — Production Verification

After implementation:

1. `npm run check`
2. `npm run build`
3. Restart local preview on `0.0.0.0:4321`
4. `npm run audit:scroll`
5. Lighthouse local:
   - `/cs/`
   - `/en/`
6. Production smoke after deploy:
   - `https://melveo.app/`
   - `https://melveo.app/cs/`
   - `https://melveo.app/en/`
   - `https://melveo.app/og-default.jpg`
   - `https://melveo.app/favicon.ico`
7. Browser smoke:
   - no console errors
   - no request failures
   - no horizontal overflow
   - no broken images
   - correct `lang`, canonical, hreflang

## Priority Order

1. LCP element identification
2. Responsive honeycomb image delivery
3. Critical CSS review
4. Font loading review
5. Scroll audit threshold refinement
6. Production smoke checklist

## Non-Goals

- Redesigning hero copy or layout.
- Replacing the honeycomb interaction.
- Removing current premium glass styling.
- Reworking pricing or legal content.
- Adding a new analytics provider.

## Implementation Log — 2026-05-27

Completed in the local Astro build:

- Identified the real LCP elements with `PerformanceObserver`.
  - `/cs/` mobile: hero subline text.
  - `/cs/` desktop: hero headline text.
  - `/en/` mobile: hero subline text.
  - `/en/` desktop: hero headline text.
- Added language-aware preload for the primary Inter subset:
  - Czech preloads `inter-latin-ext-wght-normal.woff2`.
  - English preloads `inter-latin-wght-normal.woff2`.
  - Comfortaa is not preloaded because it is not the LCP element.
- Generated smaller honeycomb thumbnail variants:
  - `public/images/melveo-grid/thumbs/180/*.webp`
  - `public/images/melveo-grid/thumbs/240/*.webp`
- Added `srcset` and stricter `sizes` to honeycomb thumbnail images so mobile/tablet viewports avoid downloading the 360px fallback unless needed.

Verification:

- `npm run check`: passed with 0 errors, 0 warnings, 0 hints.
- `npm run build`: passed.
- `npm run audit:scroll`: 50 route/viewport combinations passed.
  - 0 failures.
  - 0 console issues.
  - 0 request failures.
  - 0 horizontal overflow.
  - 0 broken images.
- Lighthouse local after tuning:
  - `/cs/`: Performance 84, Accessibility 100, Best Practices 100, SEO 100.
  - `/en/`: Performance 87, Accessibility 100, Best Practices 100, SEO 100.
  - TBT remained 0 ms.
  - Image delivery audit is clean.

Remaining known performance work:

- Lighthouse still reports render-blocking CSS savings. This is a larger structural task because Astro currently ships the landing CSS as render-blocking stylesheets. Do not inline/split this blindly; test any critical CSS extraction carefully against hero, honeycomb, data-feedback, orb and pricing visuals.
- Synthetic scroll audit still records occasional long frame intervals around the honeycomb morph on very large or very tall viewports. There are no functional failures, but this remains the section to watch during real-device testing.
