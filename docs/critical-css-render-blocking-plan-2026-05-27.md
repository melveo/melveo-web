# Critical CSS / Render-Blocking Plan — 2026-05-27

## Goal

Improve Lighthouse LCP/FCP by reducing render-blocking CSS without changing the current visual design, animation behavior, typography, honeycomb composition, data-feedback section, orb section or pricing glass styling.

The current site is functional and visually stable. The only remaining Lighthouse issue after the thumbnail/font pass is render-blocking CSS. This plan treats that as a controlled performance refactor, not a redesign.

## Current Baseline

Local preview after the safe performance pass:

- `/cs/`: Performance 84, Accessibility 100, Best Practices 100, SEO 100.
- `/en/`: Performance 87, Accessibility 100, Best Practices 100, SEO 100.
- TBT: 0 ms.
- Image delivery: clean.
- 50-viewport scroll audit: 0 failures, 0 overflow, 0 broken images, 0 console/request issues.

Known remaining issue:

- Lighthouse reports render-blocking CSS savings around 600-750 ms.

Risk:

- The visual design depends on global tokens, section-level CSS, Astro component CSS and Tailwind output. Blindly inlining or deferring CSS can cause FOUC, wrong hero typography, broken honeycomb sizing, missing glass styling or unstable animations.

## Priority Patch — 2026-05-28

Before continuing the critical CSS work, fix two visible regressions that affect the current presentation quality:

### P0 — Honeycomb Intro Viewport Coverage

Problem:

- In the second section (`ImageGridScrollMorph`) the intro state with the large `melveo` wordmark and main photo can expose a slice of the following section at the bottom on some viewport sizes.
- This makes the section feel like it is not occupying the full viewport.

Tasks:

- Lock the sticky intro content to the stable viewport height, not just `min-height`.
- Keep the existing card-style desktop composition and mobile full-height behavior.
- Verify the first stage of the scroll morph does not reveal the next section before the user has progressed past the intro.

Acceptance:

- `/cs/` and `/en/` show the intro section as a complete viewport panel on mobile, tablet, desktop and wide desktop.
- The following section is not visible at the bottom during the initial intro state.
- The main photo still morphs into the center hexagon and the honeycomb layout remains unchanged.

### P0 — Data Feedback Output Particle

Problem:

- In the `data-feedback` section the visible particle/path from the `melveo` wordmark to the trainer/coach hexagon has disappeared, even though input particles still flow into `melveo`.

Tasks:

- Restore a visible processed-output particle from `melveo` to the trainer/coach hexagon.
- Keep the trainer hexagon growth/flash effect on arrival.
- Apply the fix to both desktop SVG and mobile SVG variants.

Acceptance:

- Input signals visibly flow into `melveo`.
- After accumulation, a distinct processed pulse visibly travels from `melveo` to the trainer/coach hexagon.
- On arrival, the trainer/coach hexagon grows from its center and settles smoothly back.
- No text overflow or path overlap regressions in Czech or English.

### Validation Required For This Patch

- `npm run check`
- `npm run build`
- local preview on `0.0.0.0:4321`
- 50-viewport responsive audit covering `/cs/`, `/en/`, honeycomb intro, honeycomb final state and `/cs/#data-feedback`, `/en/#data-feedback`
- Visual screenshots for mobile, tablet, desktop and wide desktop.

Status 2026-05-28:

- Implemented.
- `ImageGridScrollMorph` sticky content now has explicit stable viewport `height` as well as `min-height`.
- Desktop intro card height was raised from 82% to 88% of the stable viewport to reduce empty bottom space while keeping the card composition.
- `MelveoDataFlowHero` now renders and animates a dedicated output pulse from `melveo` to the trainer/coach hexagon on desktop and mobile.
- Asset copy script now copies the full `public/images/melveo-grid` directory into `dist` so WebP intro images and all thumbnail `srcset` candidates are present in production builds.

Verification 2026-05-28:

- `npm run check`: passed, 0 errors.
- `npm run build`: passed.
- 50-viewport alternating CS/EN scroll audit: passed, 0 failures, 0 console issues, 0 request failures, 0 horizontal overflow, 0 broken images.
- 100-case full-locale scroll audit (50 CS + 50 EN): passed, 0 failures, 0 console issues, 0 request failures, 0 horizontal overflow, 0 broken images.
- Targeted viewport containment check: passed; bottom of the viewport remains inside `[data-grid-section]` at honeycomb intro start across tested mobile, tablet, desktop and wide viewports.
- Targeted output-pulse check: passed; `[data-output-pulse]` becomes visible on mobile and desktop.

## Phase 1 — CSS Dependency Map

Tasks:

- Capture the exact CSS files emitted by Astro for `/cs/` and `/en/`.
- Map which components contribute to the initial route CSS:
  - `BaseLayout.astro`
  - `Landing.astro`
  - `HeroScene.astro`
  - `ImageGridScrollMorph.astro`
  - `DataFlowStage.astro`
  - `OrbStage.astro`
  - pricing/contact/footer components
  - `src/styles/global.css`
- Measure CSS byte size before and after gzip/brotli.
- Identify CSS required above the fold:
  - design tokens
  - base reset/body styles
  - hero typography
  - hero button styling
  - hero background/canvas fallback sizing
  - immediate layout dimensions preventing CLS

Acceptance:

- A small dependency table in the audit output.
- Exact list of CSS selectors that must remain render-critical.

## Phase 2 — Critical CSS Prototype

Tasks:

- Create a prototype branch or isolated patch.
- Extract a minimal critical CSS block into `BaseLayout.astro` or a small Astro partial.
- Keep only stable above-the-fold rules:
  - `:root` tokens needed by hero.
  - html/body background/color/font-family.
  - initial hero layout, headline, subline, CTA shell.
  - image/canvas containment rules needed to prevent jump.
- Leave full CSS stylesheet loaded normally as fallback.
- Do not defer CSS yet.

Acceptance:

- No visible change on first paint.
- No FOUC in throttled Chrome.
- CLS remains below current baseline.

## Phase 3 — Safe Stylesheet Deferral Test

Tasks:

- Test one of these approaches, one at a time:
  1. Keep render-blocking CSS but rely on critical inline CSS only for improved perceived first paint.
  2. Use preload stylesheet pattern for non-critical landing CSS:
     `<link rel="preload" as="style" href="..." onload="this.rel='stylesheet'">`
  3. Split non-critical section CSS manually if Astro output allows safe boundaries.
- Add `<noscript>` stylesheet fallback if using preload-onload.
- Verify CSP compatibility because inline `onload` may conflict with future stricter CSP.

Recommended first approach:

- Avoid inline `onload` initially.
- Prototype critical CSS only and measure.
- If measurable gain is too small, then test stylesheet deferral with CSP review.

Acceptance:

- LCP improves materially or stays stable with no visual regressions.
- No unstyled flash in hero.
- No broken section styling during fast scroll.

## Phase 4 — Component-Level CSS Review

Tasks:

- Inspect large component styles for rules that can be moved below fold or simplified:
  - honeycomb section
  - data-feedback particle section
  - orb/Three.js section
  - pricing glass cards
- Remove duplicated or dead CSS where safe.
- Do not merge unrelated visual redesigns into this pass.

Acceptance:

- CSS output is smaller or more predictable.
- No visual difference in screenshots.

## Phase 5 — Test Matrix

Run after every candidate change:

- `npm run check`
- `npm run build`
- local preview on `0.0.0.0:4321`
- `npm run audit:scroll`
- Lighthouse:
  - `/cs/`
  - `/en/`
- Reduced motion:
  - `/cs/`
  - `/en/`
  - `/cs/#data-feedback`
  - `/en/#data-feedback`
- Visual screenshots:
  - mobile hero
  - mobile honeycomb before morph
  - mobile honeycomb after morph
  - mobile data-feedback
  - desktop hero
  - desktop honeycomb
  - desktop data-feedback
  - desktop pricing

Viewport set:

- 320 x 568
- 360 x 640
- 375 x 667
- 390 x 844
- 414 x 896
- 430 x 932
- 568 x 320
- 667 x 375
- 768 x 1024
- 820 x 1180
- 912 x 1368
- 1024 x 768
- 1280 x 720
- 1366 x 768
- 1440 x 900
- 1728 x 1117
- 1920 x 1080
- 2560 x 1440

## Phase 6 — Rollout

Before production:

- Commit with before/after Lighthouse numbers.
- Deploy to Cloudflare Worker.
- Production smoke:
  - `https://melveo.app/`
  - `https://melveo.app/cs/`
  - `https://melveo.app/en/`
  - `https://melveo.app/og-default.jpg`
  - `https://melveo.app/favicon.ico`
- Production Lighthouse spot check after CDN settles.

Rollback condition:

- Any visual regression in hero/honeycomb/data-feedback/pricing.
- Any accessibility drop below 100.
- Any SEO drop below 100.
- Any horizontal overflow.
- Any new console/runtime error.

## Recommendation

Treat this as the next dedicated performance pass. The safe work already completed fixed image delivery and improved LCP without visual risk. Critical CSS extraction is the only remaining high-impact opportunity, but it should be done in a separate branch with screenshot comparisons because the site’s premium look depends heavily on early CSS.
