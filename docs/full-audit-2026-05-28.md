# Melveo Web Full Audit — 2026-05-28

## Scope

Target: local production preview at `http://127.0.0.1:4321`.

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
- `/og-default.jpg`
- `/favicon.ico`

Primary areas checked:

- Hero
- Honeycomb image morph
- Data-feedback particle section
- Orb / whole-club section
- Legal pages
- SEO metadata
- Static assets
- Existing planning documents

## Commands

- `npm run check`
- `npm run build`
- `npm run audit:scroll`
- Route smoke checks through `curl`
- Custom Playwright metadata / route / responsive smoke script
- Custom Playwright screenshot pass for mobile and desktop hero, honeycomb and data-feedback states
- Lighthouse local preview for `/cs/` and `/en/`
- `npm audit --audit-level=moderate`

## Result Summary

The current local site is functional and presentable.

Passed:

- Astro check: 0 errors, 0 warnings, 0 hints.
- Build: passed.
- Route smoke: all checked routes/assets returned `200`.
- 50-viewport scroll audit: 50/50 checks passed.
- Console issues after final asset recheck: 0.
- Failed requests after final asset recheck: 0.
- Broken images after final asset recheck: 0.
- Horizontal overflow: 0.
- Key metadata exists for CS/EN pages.
- `og-default.jpg`, `og-default.webp`, `favicon.ico` and `app-icon-melveo.png` exist in `dist`.
- Lighthouse local preview:
  - `/cs/`: Performance 84, Accessibility 100, Best Practices 100, SEO 100.
  - `/en/`: Performance 87, Accessibility 100, Best Practices 100, SEO 100.
  - TBT: 0 ms on both locales.

Blocked / not completed:

- `npm audit` could not run because the repo currently has no npm lockfile. NPM returned `ENOLOCK`.

## Audit Artifacts

- Scroll audit: `output/playwright/animation-performance-2026-05-28T14-asset-recheck/results.json`
- Screenshot pass: `output/playwright/full-audit-2026-05-28-current/`
- Lighthouse: `output/lighthouse-2026-05-28/cs.json`
- Lighthouse: `output/lighthouse-2026-05-28/en.json`

Representative screenshots:

- `output/playwright/full-audit-2026-05-28-current/mobile-cs-hero.png`
- `output/playwright/full-audit-2026-05-28-current/mobile-cs-honeycomb-intro.png`
- `output/playwright/full-audit-2026-05-28-current/mobile-cs-data-feedback.png`
- `output/playwright/full-audit-2026-05-28-current/desktop-cs-hero.png`
- `output/playwright/full-audit-2026-05-28-current/desktop-cs-honeycomb.png`
- `output/playwright/full-audit-2026-05-28-current/desktop-cs-data-feedback.png`

## Findings

### P1 — Security dependency audit cannot run without a lockfile

`npm audit --audit-level=moderate` failed with:

```text
ENOLOCK: This command requires an existing lockfile.
```

Impact:

- The site builds, but dependency vulnerability auditing is not reproducible.
- CI/deploy dependency state is also less deterministic without a lockfile.

Recommendation:

- Create and commit `package-lock.json` with `npm install --package-lock-only`.
- Then run `npm audit --audit-level=moderate`.
- If vulnerabilities appear, fix them intentionally and re-run build/check/audit.

### P1 — Honeycomb remains the heaviest runtime section

The current 50-viewport audit has no functional failures, no overflow and no broken images. The heaviest synthetic frame samples are still in the honeycomb/full-page probes:

- Worst `honeycomb` p95: about `187.5ms` on `3840x2160`.
- Worst tall/mobile-like p95: about `185.4ms` on `900x2000`.
- Worst full-page p95: about `170.7ms` on `3840x2160`.

Interpretation:

- The section is stable and usable, but it is still the place most likely to feel less smooth on weaker mobile hardware.
- The recent viewport-lock and asset fixes improved correctness; further gains would require a bigger implementation change, not small CSS tweaks.

Recommendation:

- Keep current visual behavior for now.
- If real-device testing still reports lag, build a mobile-specific morph path that uses fewer active transforms and less clipped/glass content during scroll.

### P2 — Existing plans contain stale or deferred items

Open planning items found:

- `WEB-REVIEW-2026-05-12.md`: still marks honeycomb as not final. Current implementation is much closer, but the document should be updated once the user confirms this version.
- `WEB-REVIEW-2026-05-12.md`: app/product screenshots remain a real marketing gap.
- `WEB-REVIEW-2026-05-12.md`: real pilot proof/testimonials remain deferred until there is real evidence.
- `README.md`: pre-launch checklist still contains app/mobile/backend items outside the landing-page scope.
- `README.md`: `OG image at /og-default.png` is stale for the current web implementation, which uses `/og-default.jpg`.
- `docs/PLAN.md`: several app/backend/legal/checklist items are still marked waiting/deferred.
- `docs/lcp-performance-plan-2026-05-27.md`: critical/render-blocking CSS remains the main performance plan item.

Recommendation:

- Split web-landing release tasks from app/backend/TestFlight tasks.
- Update stale docs so the plan does not keep reporting already-fixed or intentionally-deferred work as active web blockers.

### P2 — Image alt audit needs intentional classification

The landing page has image-grid photos with empty or missing `alt` values. This can be valid if the honeycomb images are treated as decorative, but it should be intentional.

Recommendation:

- For decorative honeycomb photos: set `alt=""` explicitly and optionally `aria-hidden="true"` where appropriate.
- For meaningful hero/section photos: add concise localized alt text.
- Update the audit script to distinguish decorative `alt=""` from missing `alt`.

### P2 — Critical CSS / render-blocking work remains open

The dedicated plan in `docs/critical-css-render-blocking-plan-2026-05-27.md` still lists critical CSS extraction as future work.

Current Lighthouse local preview confirms the same pattern:

- `/cs/`: Performance 84, SEO 100.
- `/en/`: Performance 87, SEO 100.
- TBT is 0 ms, so JavaScript blocking is not the main problem.
- LCP is still the main performance limiter (`4.3s` CS, `3.8s` EN locally).

Recommendation:

- Do this only in a separate branch.
- Preserve the current visual design and compare screenshots before/after.

## Open Plans Status

### Completed or effectively resolved for current web state

- Hero clarity and two-line headline direction: implemented.
- CS/EN favicon and OG image path: current local build uses the same favicon set and `/og-default.jpg`.
- Data-feedback output particle: implemented and verified.
- Honeycomb image assets: final recheck has 0 broken images.
- Mobile viewport-bottom gap mitigation: implemented and verified through viewport resize simulation and scroll audit.

### Still open

1. Dependency audit / lockfile.
2. Honeycomb runtime smoothness on weak real devices.
3. App/product screenshots.
4. Real pilot proof / testimonial.
5. Legal copy review before public commercial launch.
6. Critical CSS / render-blocking optimization.
7. Cleanup of stale planning docs and README checklist.

## Current Verdict

The website is healthy locally from a functional, routing, visual-smoke and responsive-audit perspective.

The remaining risks are not basic breakage. They are:

- reproducibility/security audit gap caused by missing lockfile;
- honeycomb performance headroom on weaker devices;
- marketing proof gaps: real app screenshots and real pilot evidence;
- stale planning docs that no longer clearly separate current landing-page work from later app/backend work.
