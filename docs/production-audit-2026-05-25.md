# Melveo.app production audit — 2026-05-25

## Scope

Audit target: `https://melveo.app` production, not local development.

Routes:
- `/`
- `/cs/`
- `/en/`
- `/cs/privacy/`
- `/en/privacy/`
- `/cs/terms/`
- `/en/terms/`

## Audit Plan

1. Baseline production availability
   - Verify HTTP status and redirects.
   - Verify key security/cache headers.
   - Verify sitemap and robots/accessibility endpoints where applicable.

2. SEO and metadata audit
   - Title, meta description, canonical, viewport, html lang.
   - Open Graph and Twitter metadata.
   - H1 count and basic heading structure.
   - hreflang and locale routing consistency.
   - Crawlability issues: broken internal links, broken images, missing alt text.

3. Text and content clarity audit
   - CS/EN hero clarity.
   - CTA clarity and consistency.
   - Duplicated or unclear late-page contact/footer content.
   - Legal/contact information presence.

4. Responsiveness audit
   - Automated viewport scan across 50 device sizes.
   - Test both `/cs/` and `/en/`.
   - Check horizontal overflow, broken images, console errors, critical section presence, CTA button layout.

5. Visual QA on representative devices
   - Mobile portrait.
   - Mobile landscape.
   - Tablet portrait/landscape.
   - Desktop and wide desktop.
   - Capture representative screenshots for hero, honeycomb, data-feedback, orb/club section, footer.

6. Runtime and interaction audit
   - Browser console errors/warnings.
   - Cookie banner behavior.
   - CTA link behavior.
   - Scroll-heavy sections: honeycomb morph, data-feedback particles, orb/club section.

7. Performance and load audit
   - Navigation timing and resource weight.
   - Largest/heaviest assets.
   - Synthetic scroll smoothness in heavy animated sections.
   - Lighthouse mobile/desktop if available in the environment.

8. Findings and action plan
   - Classify each finding by severity: P0/P1/P2/P3.
   - Separate “must fix before next deploy” from “nice improvement”.
   - List recommended next implementation steps.

## Status

- [x] Baseline production availability
- [x] SEO and metadata
- [x] Text/content clarity
- [x] Responsiveness scan, 50 devices
- [x] Visual QA screenshots
- [x] Runtime and interaction checks
- [x] Performance/load checks
- [x] Final findings and recommendations

## Executive Summary

Production is healthy. I did not find any P0/P1 issue that blocks the site from being presented publicly.

The landing page is reachable, crawlable, visually coherent, and Lighthouse scores are excellent:

- Mobile `/cs/`: Performance 99, Accessibility 100, Best Practices 100, SEO 100.
- Desktop `/cs/`: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
- No broken internal links or missing assets were detected.
- No browser console errors or page errors were detected in automated Chromium runs.
- Automated responsiveness checks passed on 50 viewport sizes for both `/cs/` and `/en/` routes.

The main risk area is not page load; it is runtime smoothness in the scroll-heavy animated sections. The page is light on transferred bytes, but the honeycomb/data-feedback/orb sections still create long frames during synthetic scroll tests. This matches earlier real-device observations that some scroll moments can feel less smooth on phones.

## Test Artifacts

Generated files:

- `output/playwright/production-audit-2026-05-25/responsive-results.json`
- `output/playwright/production-audit-2026-05-25/performance-results.json`
- `output/playwright/production-audit-2026-05-25/content-extract.json`
- `output/playwright/production-audit-2026-05-25/lighthouse-mobile-cs.json`
- `output/playwright/production-audit-2026-05-25/lighthouse-desktop-cs.json`
- Representative screenshots for hero, honeycomb, data-feedback and orb sections across mobile, tablet, desktop, wide and tall viewports in `output/playwright/production-audit-2026-05-25/`.

Post-fix local validation:

- `npm run check`: passed with 0 errors, 0 warnings, 0 hints.
- `npm run build`: passed.
- Local preview smoke on 24 route/viewport combinations: passed with no broken images, no 4xx asset responses, no console errors and no horizontal overflow above the 2px tolerance.

Post-deploy production validation after commit `5fad17f`:

- Production routes `/`, `/cs/`, `/en/`, privacy, terms, sitemap and robots returned `200`.
- `Content-Security-Policy` is enforced in production.
- `Content-Security-Policy-Report-Only` is no longer emitted.
- `sitemap-index.xml` and `sitemap-0.xml` return a single `Cache-Control: public, max-age=3600`.
- 100 production responsiveness checks across `/cs/` and `/en/` passed with no broken images, no console errors and no horizontal overflow above the 2px tolerance.
- Post-fix Lighthouse `/cs/` mobile: Performance 99, Accessibility 100, Best Practices 100, SEO 100.
- Post-fix Lighthouse `/cs/` desktop: Performance 100, Accessibility 100, Best Practices 100, SEO 100.

Scroll-optimization implementation pass, local preview `http://127.0.0.1:4321`, 2026-05-25:

- Added `npm run audit:scroll` for repeatable animation-performance checks.
- Ran 50 viewport cases across alternating `/cs/` and `/en/` routes.
- Checks covered full-page scroll plus section-specific probes for honeycomb, data-feedback and orb/club.
- Result: 0 page failures, 0 console errors, 0 failed requests, 0 broken images, 0 horizontal overflow failures.
- `npm run check`: passed with 0 errors, 0 warnings, 0 hints.
- `npm run build`: passed.
- Local preview route smoke after a clean `rm -rf dist && npm run build`: `/`, `/cs/`, `/en/`, `/cs/privacy/`, `/en/privacy/`, `/cs/terms/`, `/en/terms/`, `/robots.txt`, and `/sitemap-index.xml` all returned `200`.
- Local Lighthouse `/cs/` desktop: Performance 99, Accessibility 100, Best Practices 100, SEO 100.
- Local Lighthouse `/cs/` mobile: Performance 80, Accessibility 100, Best Practices 100, SEO 100. LCP is text-based and TBT is 0ms; production previously scored 99 mobile, so this should be rechecked on production/preview after deploy before treating it as a user-visible regression.
- Representative screenshots saved in `output/playwright/local-visual-final-2026-05-25/`.

Implemented changes:

- Orb/club section now pauses its auto-orbit rAF, pending writes and manual/gyro handling when the section is outside the viewport warm-up zone.
- Orb compositor hint `will-change: clip-path` is now applied only while the section is near the viewport via `.is-orb-visible`, not for the full page lifetime.
- Orb wrapper now has explicit layout/paint/style containment and `overflow-anchor: none`.
- Honeycomb scroll handler now ignores global scroll events while the section is outside its active zone and already settled at the start/end state, avoiding unnecessary `getBoundingClientRect()` work during the rest of the page scroll.

Rejected experiment:

- Pre-decoding/eager-loading all honeycomb images near the section was tested and removed. It slightly improved some medians but created worse outlier frames because image decode competed with the scroll morph.

## Availability And Routing

Checked routes:

- `https://melveo.app/`
- `https://melveo.app/cs/`
- `https://melveo.app/en/`
- `https://melveo.app/cs/privacy/`
- `https://melveo.app/en/privacy/`
- `https://melveo.app/cs/terms/`
- `https://melveo.app/en/terms/`
- `https://melveo.app/sitemap-index.xml`
- `https://melveo.app/robots.txt`

Result:

- All checked routes returned `200`.
- `robots.txt` is valid.
- Sitemap is reachable.
- Security headers present: `x-content-type-options: nosniff`, `x-frame-options: SAMEORIGIN`, `referrer-policy: strict-origin-when-cross-origin`.
- CSP is present only as `Content-Security-Policy-Report-Only`, not enforced.

Minor observations:

- Internal legal links without trailing slashes redirect with `307` to the slash version. This is not broken, but it is an avoidable hop.
- Sitemap cache header is duplicated as `public, max-age=3600, public, max-age=3600`. It is harmless, but should be cleaned up when touching headers.

## SEO And Metadata

Passed:

- Landing pages have title, meta description, canonical, viewport, Open Graph and Twitter metadata.
- `/cs/` and `/en/` have valid canonical URLs.
- `hreflang` is present for CS/EN.
- Pages are crawlable.
- Open Graph image exists: `https://melveo.app/og-default.jpg`.

Findings:

### P2 - Landing page title is too generic

Current title on both landing pages is only `Melveo`.

Recommendation:

- CS: `Melveo — hráčské signály do rozhodnutí trenéra`
- EN: `Melveo — athlete signals into coach decisions`

This improves search snippets, browser tabs, and shared-link clarity without changing the visual design.

### P3 - Root `/` returns a canonicalized page instead of a clean locale decision

`https://melveo.app/` returns `200` and points canonical to `/cs/`. This is acceptable, but it is less clean than either:

- redirecting users/bots to `/cs/` or `/en/` based on a deterministic strategy, or
- making `/` the explicit x-default landing page with its own H1 and canonical.

Recommendation: keep as-is unless SEO localization becomes a priority; then choose one strategy and make it explicit.

### P3 - Legal page `x-default` hreflang points to root

Legal pages include hreflang, but `x-default` points to root rather than the route-specific default page.

Recommendation:

- `/cs/privacy/` and `/en/privacy/` should use route-specific alternates and a route-specific `x-default`.
- Same for terms pages.

### P3 - H1 punctuation is visually correct but semantically split

Rendered H1 is visually fine. Extracted text contains the final period as a separate text fragment due to the animated/split implementation:

- CS extracted: `Z hráčských signálů vzniká jasné rozhodnutí .`
- EN extracted: `Athlete signals become clear decisions .`

Recommendation: add an `aria-label` or adjust the hidden semantic text so screen readers and text extraction get the sentence without a separated period.

## Content Clarity

Strong points:

- Hero message is clear: player signals become decisions.
- CS and EN variants are aligned.
- Data-feedback section reinforces the same narrative.
- Pricing and contact are understandable.
- The site now feels like a sports operating layer rather than a generic app brochure.

Content improvements worth considering:

### P3 - App Store CTA currently points to contact

The App Store CTA uses App Store wording but links to `#contact`.

This is acceptable while the app is not public, but it may confuse users because it looks like a real download link.

Recommendation:

- Keep the visual App Store button.
- Add `aria-label` or a short hidden/status copy such as `App Store launch notification` until the real listing exists.
- Alternative: click opens the contact/notify section with a small “coming soon” state.

### P3 - Contact/footer content is now clean

The footer/contact structure is good. No duplicate company-heavy sales block appears in the current production flow.

## Responsiveness

Automated scan:

- 50 viewport sizes.
- Routes: `/cs/`, `/en/`.
- Total checks: 100.
- Checks included horizontal overflow, broken images, console/page errors, critical section presence and hero CTA button height.

Result:

- `failureCount: 0`.
- No horizontal overflow detected in the scan.
- No broken images detected.
- Hero buttons stay equal-height across tested mobile and desktop widths.
- Honeycomb, data-feedback and orb sections render on representative mobile/tablet/desktop screenshots.

Visual observations:

- Mobile hero is clean and readable, but has a large quiet black area above the main headline. This is a design choice, not a bug.
- Honeycomb is visually strong on mobile and desktop. It uses the viewport well and no longer shows the earlier black-background seam in the captured screenshots.
- Data-feedback is understandable, but the top of the coach hexagon can be below the first viewport on mobile depending on scroll position. That is acceptable because the section is taller than one viewport.
- Production still shows a light gradient/highlight inside the orb/club hexagon. A local uncommitted change exists in `src/components/OrbStage.astro` to make that hexagon one solid accent color.

## Performance And Load

Lighthouse:

- Mobile CS performance: 99.
- Desktop CS performance: 100.
- Mobile LCP: 1.9s.
- Desktop LCP: 0.4s.
- TBT: 0ms.
- CLS: 0.006 mobile, 0.011 desktop.

Custom production metrics:

- `/cs/` mobile transferred resource weight: about 509 KB.
- `/en/` mobile transferred resource weight: about 425 KB.
- Images: about 316 KB transferred.
- JavaScript: about 13 KB transferred.
- CSS/fonts: about 78-161 KB transferred depending on locale/font subset.

Largest resources:

- `/images/melveo-grid/team-briefing-wide.webp`: about 114 KB.
- Inter Latin Extended font: about 83 KB on CS.
- Inter Latin font: about 47 KB.
- Comfortaa font: about 30 KB.
- Honeycomb thumbnail images: roughly 19-20 KB each.

Finding:

### P2 - Scroll-heavy animated sections still create long frames

Synthetic full-page scroll in Chromium showed no errors, but did show long frames:

- Mobile `/cs/`: p95 frame interval about 68ms, max about 93ms.
- Mobile `/en/`: p95 about 72ms, max about 85ms.
- Desktop `/cs/`: p95 about 83ms, max about 100ms.
- Desktop `/en/`: p95 about 83ms, max about 107ms.

This test is stricter than a normal user scroll, but it confirms the heavy sections can still cost rendering time.

Recommended next optimization:

- Keep current visuals.
- Add stronger `content-visibility`/containment boundaries for below-fold sections where safe.
- Ensure scroll-driven honeycomb animation only updates `transform` and `opacity`.
- Avoid changing layout-affecting properties during scroll.
- Gate decorative background animation by intersection state.
- Add a reduced-work mode for mobile/touch devices in the honeycomb section after the main morph completes.

## Detailed Plan: Scroll-Heavy Animation Optimization

Goal: preserve the current visual design while making scroll through honeycomb, data-feedback and orb sections consistently smoother on real mobile devices and desktop Chrome/Safari.

### Phase 1 - Baseline And Instrumentation

Status: implemented locally through `scripts/animation-performance.mjs` and `npm run audit:scroll`.

1. Add a local-only Playwright/Node performance script that measures:
   - full-page scroll frame intervals,
   - section-specific scroll frame intervals,
   - long frames above 50ms and 100ms,
   - layout shifts during scroll,
   - console errors and resource failures.
2. Capture section-specific screenshots before and after each optimization:
   - hero,
   - honeycomb before morph,
   - honeycomb after morph,
   - data-feedback,
   - orb/club section.
3. Create a baseline matrix:
   - Mobile portrait: 320x568, 390x844, 430x932.
   - Mobile landscape: 667x375, 844x390, 932x430.
   - Tablet: 768x1024, 820x1180, 1024x768.
   - Desktop: 1366x768, 1440x900, 1920x1080.
   - Extreme: 900x2000, 2000x900, 2560x1080.

Acceptance for baseline: repeatable measurements saved under `output/playwright/animation-performance-*` and screenshots for visual comparison.

### Phase 2 - Honeycomb Morph Optimization

Status: partially implemented with low-risk scroll gating. Further improvement would require a larger redesign of the morph or fewer simultaneous clipped/glass cells; that would affect the current visual direction.

1. Audit `ImageGridScrollMorph.astro` for scroll handlers, requestAnimationFrame loops and layout reads/writes.
2. Ensure scroll updates only mutate composited properties:
   - `transform`,
   - `opacity`,
   - CSS custom properties used only by transform/opacity where possible.
3. Avoid per-frame DOM measurements:
   - cache section bounds,
   - recalculate only on resize/orientation change,
   - debounce expensive recalculation.
4. Add explicit containment where visually safe:
   - `contain: layout paint style` on isolated animated wrappers,
   - `content-visibility: auto` for below-fold non-active sections,
   - `contain-intrinsic-size` to avoid jumps.
5. Mobile/touch path:
   - keep the core morph,
   - reduce decorative background motion after the morph completes,
   - avoid continuously updating offscreen hex cells.

Acceptance:

- no visual regression in before/after screenshots,
- no black background seams between honeycomb and following sections,
- no horizontal overflow,
- mobile scroll p95 improves compared with baseline,
- no skipped final morph state during fast scroll.

### Phase 3 - Data-Feedback Animation Optimization

Status: audited in the local 50-viewport scroll sweep. Current section is substantially lighter than honeycomb in synthetic metrics and did not show console, overflow or image issues.

1. Keep the current narrative: text signals -> `melveo` -> coach hexagon.
2. Confirm SVG paths do not cross labels on mobile, tablet or desktop.
3. Gate particle timelines by intersection:
   - run only while the section is near viewport,
   - pause when not visible,
   - restart cleanly without stacking duplicate timelines.
4. Keep the coach hex scale response transform-only:
   - scale from center,
   - no external flash,
   - no layout resize.

Acceptance:

- particles do not pass through text labels,
- `melveo` pulse remains smooth,
- coach hex grows from center and returns smoothly,
- no duplicate animations after repeated scroll in/out.

### Phase 4 - Orb/Club Section Optimization

Status: implemented locally by pausing rAF/compositor work outside the visible warm-up zone.

1. Keep the current interaction copy and desktop/mobile distinction.
2. Avoid high-frequency pointer/touch work when the section is not active.
3. On mobile:
   - use touch/drag only when user is interacting,
   - keep idle animation light,
   - avoid continuous gyro/pointer work in background.

Acceptance:

- section remains responsive to drag/touch,
- no visible frame drops while scrolling past,
- no layout shift caused by the CTA/control button.

### Phase 5 - Regression Test Matrix

Run after each optimization pass:

1. `npm run check`
2. `npm run build`
3. Local smoke:
   - `/cs/`, `/en/`,
   - privacy and terms pages,
   - broken images,
   - console errors,
   - horizontal overflow.
4. 50-size responsiveness sweep for `/cs/` and `/en/`.
5. Lighthouse mobile/desktop on local preview or production preview.
6. Real-device manual check:
   - iPhone Safari,
   - iPhone Chrome,
   - Android Chrome if available,
   - desktop Chrome,
   - desktop Safari.

Acceptance for completion:

- Lighthouse performance remains 95+ mobile and 98+ desktop.
- No P0/P1 visual bugs.
- No broken images/links.
- No console errors.
- Scroll frame metrics improve or, at minimum, do not regress.
- Manual phone scroll no longer feels sticky after entering the honeycomb section.

## Security And Robustness

No runtime errors found.

Security headers are mostly good. Recommended hardening:

### P3 - Move stable CSP from report-only to enforced

Current CSP is report-only. This is good for collecting violations, but it does not protect production yet.

Recommendation:

- Keep the current report-only policy while validating.
- Add a conservative enforced CSP once third-party needs are stable.

Status: fixed locally. `public/_headers` now sends an enforced `Content-Security-Policy` while keeping the current required allowlist for inline Astro snippets, optional GTM, optional Cloudflare Web Analytics and the GTM noscript iframe.

## Multilingual Root Strategy

Decision: keep `/` as a lightweight x-default locale selector for now.

Reasoning:

- The site has explicit localized landing pages at `/cs/` and `/en/`.
- `/cs/` is the default Czech canonical.
- `/` currently exists to route humans by browser language using JavaScript/meta refresh while still giving crawlers hreflang signals.
- An edge redirect from `/` would be faster for users, but it can make crawler behavior and locale signals less transparent.

Current recommendation:

- Keep `/` as-is unless analytics show many users landing on root and bouncing before locale routing.
- Keep `/cs/` and `/en/` as canonical localized pages.
- Use route-specific `x-default` on localized pages, defaulting to the Czech route.
- If SEO localization becomes a priority later, choose one of these two clean alternatives:
  1. make `/` a real language-neutral landing page with its own H1 and canonical, or
  2. move locale routing to an explicit server/edge redirect and accept that `/` is not a crawlable landing page.

## Final Action Plan

### Should Fix Next

1. Reduce runtime work in scroll-heavy animated sections without changing visuals.
2. Decide whether the App Store CTA should remain a notify/contact link or expose a clearer coming-soon state.

### Nice To Fix

1. None currently open from this pass.

### Fixed Locally During This Audit

1. Landing page `<title>` / OG / Twitter title now describe the product instead of only saying `Melveo`.
2. Hero H1 now has a clean `aria-label`, and the visual animated period is rendered via CSS so assistive technology does not receive the period as a separate fragment.
3. Footer and cookie privacy/terms links now use trailing slashes directly.
4. `x-default` hreflang now points to the route-specific Czech default instead of always pointing at the root.
5. Legal tables now use fixed layout and safe wrapping, removing the small mobile overflow found on `/en/privacy/` during local post-fix smoke testing.
6. CSP is now enforced via `Content-Security-Policy` in `public/_headers`.
7. Sitemap cache headers no longer duplicate on `sitemap-index.xml`; the generated `sitemap-0.xml` has its own exact rule.

### No Immediate Action Needed

1. Broken link/image handling: passed.
2. Lighthouse SEO/accessibility/performance: passed.
3. 50-size responsiveness scan: passed.
4. Production availability: passed.
