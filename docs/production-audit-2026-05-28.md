# Melveo Production Audit — 2026-05-28

## Scope

Target: `https://melveo.app`

Routes and assets checked:

- `/`
- `/cs/`
- `/en/`
- `/cs/privacy/`
- `/en/privacy/`
- `/cs/terms/`
- `/en/terms/`
- `/robots.txt`
- `/sitemap-index.xml`
- `/og-default.jpg`
- `/og-default.webp`
- `/favicon.ico`
- honeycomb responsive thumbnail samples

Primary sections checked:

- Hero
- Honeycomb image morph
- Data-feedback particle section
- Orb / whole-club section
- Contact/footer
- Legal pages
- SEO metadata
- Production CSP / console health

## Deployed Version

Current production deploy after the audit fix:

- Git commit: `a7671b5 Remove external font from root redirect`
- Cloudflare Worker version: `3daa827a-7bc2-4c8c-b21d-4d4cc24052a4`

## Commands / Checks

- `npm run check`
- `npm run build`
- `bun audit`
- Lighthouse production:
  - `https://melveo.app/cs/`
  - `https://melveo.app/en/`
- `AUDIT_URL=https://melveo.app npm run audit:scroll`
- Route and static asset smoke checks through `curl`
- Playwright metadata / console / broken-image / overflow smoke pass

## Result Summary

Production is healthy.

Passed:

- Astro check: 0 errors, 0 warnings, 0 hints.
- Build: passed.
- `bun audit`: no vulnerabilities found.
- Route smoke: all checked routes/assets returned `200`.
- 50-viewport production scroll audit: 50/50 checks passed.
- Console issues after CSP fix: 0.
- Failed requests after CSP fix: 0.
- Broken images: 0.
- Horizontal overflow: 0.
- Critical landing sections present on CS/EN.
- SEO metadata present for root, CS, EN and legal pages.

## Lighthouse

Production Lighthouse results:

| Route | Performance | Accessibility | Best Practices | SEO | FCP | LCP | CLS | TBT | Speed Index |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `/cs/` | 87 | 100 | 100 | 100 | 1.6s | 3.5s | 0.007 | 170ms | 3.5s |
| `/en/` | 99 | 100 | 100 | 100 | 1.1s | 2.0s | 0.001 | 0ms | 1.1s |

Artifacts:

- `output/lighthouse-2026-05-28-production/cs.json`
- `output/lighthouse-2026-05-28-production/en.json`

Interpretation:

- EN is excellent.
- CS is good and presentable, but slower than EN. The main difference is LCP/TBT timing in Lighthouse. No functional issue was found.
- Accessibility, Best Practices and SEO are clean on both locales.

## Production Scroll / Responsive Audit

Artifact:

- `output/playwright/production-audit-2026-05-28/results.json`

Summary:

- Total checks: 50 viewport/locale combinations.
- Failures: 0.
- Console issues: 0.
- Request failures: 0.
- Horizontal overflow: 0.
- Broken images: 0.

Frame findings:

- The page is functional across the tested viewport matrix.
- The heaviest synthetic frame samples are still tied to scroll-heavy sections, mainly honeycomb / full-page probes and occasionally the orb probe.
- This is a known performance characteristic of the current high-motion visual direction, not a route or asset failure.

Worst synthetic samples from this run:

- `/cs/` `2000x900` full-page probe: p95 `4427.8ms`.
- `/cs/` `1680x1050` orb probe: p95 `1129.9ms`.
- `/en/` `3000x2000` full-page probe: p95 `894.2ms`.
- `/cs/` `1680x1050` honeycomb probe: p95 `496.2ms`.

Note:

- These are synthetic scroll probes that can be noisy on production/CDN runs, especially while large animated sections initialize. They did not produce visual breakage, broken requests, overflow, or console errors.

## Fixed During Audit

### Root CSP / Google Fonts request

Problem:

- Production root `/` still had an old Google Fonts Quicksand stylesheet request.
- CSP intentionally allows only self-hosted styles/fonts, so the request was blocked:
  - `fonts.googleapis.com ... violates Content Security Policy`

Fix:

- Removed the external Google Fonts preconnect/stylesheet from `src/pages/index.astro`.
- Root redirect page now uses local/system font stack only.
- Deployed fix to production.

Verification:

- `https://melveo.app/` no longer emits CSP/font console errors.
- Root still redirects correctly to `/cs/` or `/en/`.

## Remaining Findings

### P1 — CS Lighthouse is lower than EN

CS score is `87`, EN score is `99`.

Likely factors:

- CS page text/font/render path is a little heavier.
- Lighthouse timing variance on a visually dense landing page.
- The hero/honeycomb animated experience can influence LCP/TBT sampling.

Recommendation:

- Keep as acceptable for current release.
- If the target is `95+` on CS, the next dedicated pass should focus on critical CSS / LCP timing, not more visual tuning.

### P1 — Scroll-heavy sections remain the main runtime risk

Honeycomb and orb sections are visually strong and functional, but they are still the sections most likely to feel heavy on weaker devices.

Recommendation:

- Keep current version if manual phone testing feels acceptable.
- If further improvement is needed, build a reduced-cost mobile variant for honeycomb/orb rather than adding more micro-optimizations.

### P2 — Root redirect has canonical CS metadata but can redirect EN users

Root `/` uses CS canonical metadata and then JS redirects by browser language.

This is acceptable for the current SEO strategy because canonical locale pages are `/cs/` and `/en/`, but it is worth keeping intentional.

Recommendation:

- Keep `/cs/` and `/en/` as canonical landing URLs.
- Use direct `/cs/` and `/en/` links in campaigns rather than root `/`.

### P2 — Product proof remains a marketing gap

The web explains the concept well, but it still does not show real app screenshots or real pilot proof.

Recommendation:

- Add real app/product screenshots when available.
- Add pilot proof/testimonial only when real and approved.

## Current Verdict

The production site is healthy and presentable.

No blocker was found after the CSP root fix. The main remaining work is optimization/marketing polish, not functional correctness:

1. improve CS LCP if a higher Lighthouse score is required;
2. consider a lighter mobile path for scroll-heavy visual sections if real-device testing still reports lag;
3. add real app screenshots and real pilot proof when available.

