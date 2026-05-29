# Melveo Production Audit Rerun — 2026-05-29

## Scope

Target: `https://melveo.app`

This is a fresh rerun after the previous production audit from the same day.

Checked:

- Local repository state
- Astro diagnostics
- Production build
- Dependency vulnerability audit
- Production route and asset availability
- Lighthouse for `/cs/` and `/en/`
- Playwright DOM/metadata/image/overflow pass
- 50-viewport scroll and responsiveness audit
- Visual screenshots for hero, honeycomb, and data-feedback sections

## Local State

- Branch: `main`
- Status before the rerun report: clean and up to date with `origin/main`

## Commands Run

- `git status --short --branch`
- `npm run check`
- `npm run build`
- `bun audit`
- Node `fetch` production smoke check for routes/assets
- `npx lighthouse https://melveo.app/cs/`
- `npx lighthouse https://melveo.app/en/`
- `AUDIT_URL=https://melveo.app AUDIT_OUT_DIR=output/playwright/production-audit-2026-05-29-rerun npm run audit:scroll`
- Playwright metadata / console / broken-image / overflow audit
- Playwright visual screenshot pass

Note:

- `curl` is not available in the local shell, so route smoke testing used Node `fetch` instead.
- Astro emits a Node deprecation warning for `module.register()`. This is a tooling/runtime warning from the current dependency stack, not an application failure.

## Build / Static Checks

Passed:

- `npm run check`: 0 errors, 0 warnings, 0 hints.
- `npm run build`: passed.
- Build output: 9 static pages generated.
- `bun audit`: no vulnerabilities found.

## Production Route / Asset Smoke

All checked routes and assets returned `200`.

Checked:

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
- `/images/melveo-grid/thumbs/180/coach-player-wide-crop-180.webp`
- `/images/melveo-grid/thumbs/240/team-huddle-240.webp`

No missing production asset was found.

## Lighthouse

Production Lighthouse results:

| Route | Performance | Accessibility | Best Practices | SEO | FCP | LCP | CLS | TBT | Speed Index |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `/cs/` | 98 | 100 | 100 | 100 | 1.1s | 2.3s | 0.008 | 0ms | 1.2s |
| `/en/` | 99 | 100 | 100 | 100 | 1.1s | 2.0s | 0.002 | 0ms | 1.1s |

Artifacts:

- `output/lighthouse-cs-2026-05-29-rerun.json`
- `output/lighthouse-en-2026-05-29-rerun.json`

Interpretation:

- Both locales are excellent.
- SEO, accessibility, and best practices are clean.
- TBT is `0ms` on both locales.
- CLS remains very low.

## Metadata / DOM / Console Audit

Routes checked:

- `/`
- `/cs/`
- `/en/`
- `/cs/privacy/`
- `/en/privacy/`
- `/cs/terms/`
- `/en/terms/`

Passed:

- All routes returned `200`.
- `lang` attributes are present.
- Titles are present.
- H1s are present.
- Canonicals are present.
- OG image is present.
- Critical sections are present on root, CS, and EN.
- Broken images: 0.
- Horizontal overflow: 0.

Finding:

- A fast multi-route Playwright run logged one `net::ERR_ABORTED` request for `hero-lines.DmBGMEJB.js`.
- Slow single-route verification on `/cs/` and `/en/` produced 0 console issues and 0 request failures.

Conclusion:

- The `ERR_ABORTED` is a test-navigation artifact from rapidly switching routes in one browser tab, not a production bug.

## Responsive / Scroll Audit

Artifact:

- `output/playwright/production-audit-2026-05-29-rerun/results.json`

Result:

- Total checks: 50
- Routes: `/cs/`, `/en/`
- Failures: 0
- Console issues: 0
- Request failures: 0
- Horizontal overflow: 0
- Broken images: 0

Worst synthetic frame samples:

- `/en/` `1280x800` honeycomb probe: p95 `724.2ms`, max `724.2ms`.
- `/en/` `1280x800` full-page probe: p95 `488.8ms`, max `488.8ms`.
- `/en/` `3840x2160` honeycomb probe: p95 `196.9ms`, max `196.9ms`.
- `/en/` `3840x2160` full-page probe: p95 `160.2ms`, max `160.2ms`.
- `/en/` `3000x2000` honeycomb probe: p95 `159.7ms`, max `159.7ms`.
- `/cs/` `740x360` honeycomb probe: p95 `154.5ms`, max `154.5ms`, CLS `0.034`.

Interpretation:

- The automated scroll audit found no functional errors.
- The heaviest frames are still tied to honeycomb/full-page scroll probes.
- This is a runtime smoothness risk on weaker devices, not a broken layout or deployment issue.
- Compared with the earlier run, the worst synthetic spikes are materially lower.

## Visual Screenshot Pass

Artifacts:

- `output/playwright/production-visual-2026-05-29-rerun/mobile-cs-hero.png`
- `output/playwright/production-visual-2026-05-29-rerun/mobile-cs-honeycomb.png`
- `output/playwright/production-visual-2026-05-29-rerun/mobile-cs-data-feedback.png`
- `output/playwright/production-visual-2026-05-29-rerun/desktop-cs-hero.png`
- `output/playwright/production-visual-2026-05-29-rerun/desktop-cs-honeycomb.png`
- `output/playwright/production-visual-2026-05-29-rerun/desktop-cs-data-feedback.png`
- `output/playwright/production-visual-2026-05-29-rerun/desktop-en-honeycomb.png`

Visual notes:

- Hero remains readable.
- CTA buttons are consistent and do not wrap in the checked screenshots.
- Data-feedback section is centered and readable.
- Honeycomb screenshot can capture the scroll-morph mid-state; this is expected for the animated section.
- No broken image placeholder or horizontal page overflow was captured.

## Bugs Found

No blocker or functional production bug was found.

No evidence found for:

- broken production routes
- missing deployed image assets
- broken canonical/OG metadata
- horizontal overflow
- broken images
- console errors on stable route load
- dependency vulnerabilities
- build failure
- Astro diagnostic errors

## Open Risks / Recommendations

### P1 — Real Mobile Smoothness Should Keep Being Manually Checked

Honeycomb remains the most expensive visual section. Automated checks pass, but real phones can still expose perceived scroll lag.

Recommended next step only if lag is reported again:

- Create a lighter mobile execution path for honeycomb scroll-morph.
- Keep desktop visual fidelity unchanged.
- Avoid adding more always-on animation layers to that section.

### P2 — Product Proof Is Still a Content Gap

The site explains the product clearly, but real app screenshots and real pilot proof would improve credibility.

Recommended next step:

- Add real app screenshots once approved.
- Add testimonial/proof only when factual and legally approved.

### P3 — Tooling Warning

Astro check/build emits a Node deprecation warning:

- `DEP0205 module.register() is deprecated`

This does not break the site.

Recommended next step:

- Revisit when upgrading Astro/Vite/Node dependencies.

## Verdict

The production web is healthy and presentable.

The only meaningful remaining concern is perceived smoothness of the most animated sections on weaker real phones. Technically, the current production build is clean: build passes, Lighthouse is excellent, production assets load, metadata is present, and the 50-viewport automated audit found no functional failures.

