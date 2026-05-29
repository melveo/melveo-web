# Melveo Production Audit — 2026-05-29

## Scope

Target: `https://melveo.app`

Checked routes:

- `/`
- `/cs/`
- `/en/`
- `/cs/privacy/`
- `/en/privacy/`
- `/cs/terms/`
- `/en/terms/`

Checked assets:

- `/robots.txt`
- `/sitemap-index.xml`
- `/og-default.jpg`
- `/og-default.webp`
- `/favicon.ico`
- honeycomb responsive thumbnails under `/images/melveo-grid/thumbs/180/`
- honeycomb responsive thumbnails under `/images/melveo-grid/thumbs/240/`

Primary sections checked:

- Hero
- Honeycomb image morph section
- Data-feedback particle section
- Orb / whole-club section
- Pricing
- Contact/footer
- Legal pages
- SEO metadata
- Production console/request health

## Current Version

Local branch at audit time:

- Branch: `main`
- Commit: `f2db634 Add production audit report`
- Git status before report file: clean and up to date with `origin/main`

## Commands / Checks

- `npm run check`
- `npm run build`
- `bun audit`
- Lighthouse production:
  - `https://melveo.app/cs/`
  - `https://melveo.app/en/`
- `AUDIT_URL=https://melveo.app AUDIT_OUT_DIR=output/playwright/production-audit-2026-05-29 npm run audit:scroll`
- Route and static asset smoke checks through `curl`
- Playwright metadata / console / broken-image / overflow pass
- Playwright visual screenshots for mobile and desktop hero, honeycomb, and data-feedback sections

## Result Summary

Production is healthy.

Passed:

- Astro check: 0 errors, 0 warnings, 0 hints.
- Build: passed.
- `bun audit`: no vulnerabilities found.
- Route smoke: all checked routes/assets returned `200`.
- Lighthouse: `99/100/100/100` or better on both CS and EN homepage.
- 50-viewport production scroll audit: 50/50 checks passed.
- Console issues on slow single-route pass: 0.
- Request failures on slow single-route pass: 0.
- Broken images: 0.
- Horizontal overflow: 0.
- Critical landing sections present on root, CS, and EN.
- SEO metadata present for root, CS, EN, and legal pages.

## Lighthouse

Production Lighthouse results:

| Route | Performance | Accessibility | Best Practices | SEO | FCP | LCP | CLS | TBT | Speed Index |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `/cs/` | 99 | 100 | 100 | 100 | 1.1s | 2.2s | 0.008 | 0ms | 1.1s |
| `/en/` | 99 | 100 | 100 | 100 | 1.1s | 2.0s | 0.002 | 0ms | 1.1s |

Artifacts:

- `output/lighthouse-cs-2026-05-29.json`
- `output/lighthouse-en-2026-05-29.json`

Interpretation:

- Both locales are in excellent shape.
- The previous CS Lighthouse gap is resolved in this run.
- LCP is acceptable for a visually rich landing page.
- CLS and TBT are clean.

## Production Route / Asset Smoke

All checked routes and assets returned `200`.

Representative responses:

- `/`: `200 text/html`
- `/cs/`: `200 text/html`
- `/en/`: `200 text/html`
- `/cs/privacy/`: `200 text/html`
- `/en/privacy/`: `200 text/html`
- `/cs/terms/`: `200 text/html`
- `/en/terms/`: `200 text/html`
- `/robots.txt`: `200 text/plain`
- `/sitemap-index.xml`: `200 application/xml`
- `/og-default.jpg`: `200 image/jpeg`
- `/og-default.webp`: `200 image/webp`
- `/favicon.ico`: `200 image/vnd.microsoft.icon`
- honeycomb thumbnail samples: `200 image/webp`

## Metadata / DOM / Asset Audit

Playwright checked root, CS, EN, legal routes, critical sections, metadata, images, and overflow.

Results:

- Root `/` language: `en`
- Root canonical: `https://melveo.app/en/`
- CS canonical: `https://melveo.app/cs/`
- EN canonical: `https://melveo.app/en/`
- OG image: `https://melveo.app/og-default.jpg`
- Broken images: 0
- Horizontal overflow: 0
- Missing critical sections: 0

Note:

- A fast multi-route Playwright loop produced two `ERR_ABORTED` asset requests while navigating between pages quickly in one tab.
- A slower single-route `networkidle` verification on `/cs/` and `/en/` produced 0 console issues and 0 request failures.
- This is treated as a test-navigation artifact, not a production bug.

## Responsive / Scroll Audit

Artifact:

- `output/playwright/production-audit-2026-05-29/results.json`

Summary:

- Total checks: 50 viewport/locale combinations.
- Routes: `/cs/`, `/en/`
- Failures: 0
- Console issues: 0
- Request failures: 0
- Horizontal overflow: 0
- Broken images: 0

Visual artifacts:

- `output/playwright/production-visual-2026-05-29/mobile-cs-hero.png`
- `output/playwright/production-visual-2026-05-29/mobile-cs-honeycomb.png`
- `output/playwright/production-visual-2026-05-29/mobile-cs-data-feedback.png`
- `output/playwright/production-visual-2026-05-29/desktop-cs-hero.png`
- `output/playwright/production-visual-2026-05-29/desktop-cs-honeycomb.png`
- `output/playwright/production-visual-2026-05-29/desktop-cs-data-feedback.png`
- `output/playwright/production-visual-2026-05-29/desktop-en-honeycomb.png`

Visual review:

- Hero remains readable on mobile and desktop.
- CTA buttons have consistent height and do not wrap in the checked screenshots.
- Honeycomb section renders without broken images or horizontal overflow.
- Data-feedback section renders cleanly; no obvious element overlap was captured in the checked screenshots.

## Performance Notes

The page is healthy by Lighthouse and functional browser checks.

The only remaining risk is runtime smoothness in scroll-heavy sections on weaker real mobile devices. The synthetic scroll audit still finds isolated long-frame samples, mostly around full-page probes and honeycomb probes.

Worst synthetic frame samples from this run:

- `/en/` `820x1180` full-page probe: p95 `3797.8ms`, max `3797.8ms`, CLS `0`.
- `/en/` `768x1024` honeycomb probe: p95 `1600.7ms`, max `1600.7ms`, CLS `0`.
- `/cs/` `1536x864` honeycomb probe: p95 `348.2ms`, max `348.2ms`, CLS `0.018`.
- `/en/` `3000x2000` full-page probe: p95 `303.8ms`, max `303.8ms`, CLS `0`.
- `/en/` `1280x800` honeycomb probe: p95 `262.6ms`, max `262.6ms`, CLS `0`.

Interpretation:

- These frame spikes did not produce test failures, broken assets, overflow, or console errors.
- Because the page intentionally uses scroll-linked visual sections, synthetic frame sampling can exaggerate momentary initialization cost.
- Real-device phone testing should remain the final judge for scroll feel.

## Findings

### No Current Blockers

No production blocker was found.

The site is buildable, deployable, crawlable, visually presentable, and technically healthy in the automated checks.

### P1 — Continue Monitoring Real Mobile Smoothness

Honeycomb and data-feedback are the highest-motion sections. They pass automated checks, but these are still the most likely places to feel less smooth on older phones.

Recommendation:

- Keep current version if manual phone testing feels acceptable.
- If lag is reported again, the next optimization should be a dedicated reduced-motion mobile implementation for the honeycomb morph and data-feedback particles, not another small CSS tweak.

### P2 — Product Proof Still Depends on Future Assets

The landing page now explains the concept clearly, but real app screenshots / pilot proof would make the page more credible once available.

Recommendation:

- Add real app screenshots when the product UI is ready.
- Add real club/pilot proof only when approved and factual.

### P2 — Root Locale Strategy Is Intentional

Root `/` currently canonicalizes to `/en/` and the localized pages canonicalize to themselves.

Recommendation:

- Keep direct campaign links pointed to `/cs/` or `/en/`.
- Revisit root behavior only if SEO strategy changes.

## Verdict

The current production site is healthy.

No functional or SEO-critical bug was found in this audit. The biggest residual risk is not correctness, but perceived scroll smoothness on weaker real mobile devices in the most animated sections.

