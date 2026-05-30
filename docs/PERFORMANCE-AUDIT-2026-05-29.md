# Performance audit 2026-05-29

## Scope

Target sections:

1. Honeycomb image morph (`ImageGridScrollMorph.astro`)
2. Data feedback signal flow (`MelveoDataFlowHero.tsx`)
3. Decorative glass smoke (`glass-smoke.ts`)

Goal: reduce post-animation jank without changing the approved visual language.

## Implemented changes

### Data feedback GSAP isolation

Before:

- The data-feedback section paused and resumed the global GSAP ticker.
- This could affect unrelated animations elsewhere on the page after the section mounted.

Now:

- The section tracks only its own GSAP timelines and delayed calls.
- IntersectionObserver pauses/resumes only those local animations.
- Cleanup kills only local GSAP work on unmount.

Expected result:

- Data-feedback animation remains active when visible.
- Other page animations are no longer tied to the data-feedback visibility state.

### Honeycomb smoke load reduction

Before:

- Honeycomb used the same animated smoke canvas behavior as pricing on desktop.
- During heavy scroll and image morph, the smoke canvas added extra ongoing paint work.

Now:

- Honeycomb keeps the same generated smoke look but uses a static rendered smoke frame.
- Pricing keeps its animated smoke behavior.

Expected result:

- Honeycomb keeps the liquid-glass background style.
- Less continuous canvas work while scrolling through the morph.

## Tested

Commands:

```bash
npm run check
npm run build
AUDIT_URL=http://127.0.0.1:4321 npm run audit:scroll
npx --yes lighthouse http://127.0.0.1:4325/cs/ --chrome-flags='--headless=new --no-sandbox' --output=json --output-path=output/lighthouse-preview-cs-2026-05-29.json --quiet
```

50 viewport audit:

- Routes: `/cs/`, `/en/`
- Viewports: 320x568 through 3840x2160
- Failures: 0
- Console/page errors: 0
- Failed requests: 0
- Horizontal overflow: 0
- Broken images: 0

Lighthouse on production preview:

- Performance: 83
- Accessibility: 100
- Best practices: 100
- SEO: 100
- CLS: 0.006
- Total blocking time: 0 ms

## Before/after performance signal

Baseline: `output/playwright/animation-performance-2026-05-29T15-00-26-763Z/results.json`

Latest local run: `output/playwright/animation-performance-2026-05-29T20-57-40-139Z/results.json`

Average p95 frame interval:

| Probe | Before | After |
| --- | ---: | ---: |
| Full page | 76.1 ms | 75.3 ms |
| Honeycomb | 127.8 ms | 120.5 ms |
| Data feedback | 31.1 ms | 24.5 ms |
| Orb | 58.2 ms | 60.1 ms |

Over-100ms frame count:

| Probe | Before | After |
| --- | ---: | ---: |
| Full page | 43 | 28 |
| Honeycomb | 70 | 61 |
| Data feedback | 0 | 0 |
| Orb | 9 | 18 |

## Notes

- Honeycomb is improved on average, but the audit still shows occasional large one-frame spikes on very large viewports. This appears tied to the heavy image morph and synthetic fast scroll probe, not broken assets or JS errors.
- Data feedback is clearly improved and more isolated.
- The risky width/height quantization experiment was tested and intentionally reverted because it made large-viewport honeycomb metrics worse.

## Remaining improvement candidates

1. Replace the scroll-driven width/height morph with a wrapper-based transform morph so the main image does not force layout while shrinking.
2. Add a resize/remount controller only for real breakpoint changes, not mobile browser-bar resizes.
3. Run mobile hardware checks on iPhone Safari/Chrome after the wrapper-based morph is prototyped.

