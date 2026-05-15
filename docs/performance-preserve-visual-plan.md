# Performance Plan: Preserve Visuals, Reduce Initial Work

## Goal

Keep the current Melveo landing page visually the same: same hero mood, same cyan glass language, same scroll sections, same animation direction. Improve perceived load and measurable performance by moving expensive work away from first paint and by scaling canvas/WebGL cost per device.

## Constraints

- Do not remove the hero WebGL look.
- Do not simplify the design into a static page.
- Do not change section order, copy hierarchy, pricing, or CTA intent.
- Keep mobile/tablet/desktop behavior visually aligned with the current approved design.

## Implementation Steps

1. **Hero fallback**
   - Replace the pure black SSR fallback with a static cyan/teal SVG fallback that resembles the final hero background.
   - Result: the page looks branded immediately while WebGL waits for a calmer moment.

2. **Hero WebGL quality tiers**
   - Keep the metaball shader and movement.
   - Choose particle count, DPR cap, and internal canvas scale by viewport/device capability.
   - Mobile gets fewer metaballs and lower internal resolution; desktop remains visually dense.
   - Slightly increase radius on lower tiers so the scene still reads full.

3. **Hero WebGL scheduling**
   - Wait until page load + a short idle window before importing and compiling the shader.
   - Result: text/CTA/LCP are not competing with shader compilation and first frames.

4. **Below-fold canvas effects**
   - Particle sections should initialize data but not animate until near viewport.
   - Existing glass smoke already pauses offscreen; keep that pattern.

5. **Scroll computations**
   - Keep scroll-driven visuals.
   - Avoid expensive card/image calculations while the club-flow section is far outside the viewport.

6. **Technical cleanup**
   - Fix TypeScript issues in active scripts so `astro check` becomes useful again.
   - Remove stale tracked duplicate source files that are not imported but are still scanned by Astro.

## Verification

- `bun run build`
- `bun run check`
- Lighthouse on `/cs/`
- Playwright/browser checks:
  - desktop 1440 x 1000
  - tablet 834 x 1112
  - mobile 390 x 844
- Visual checks:
  - hero still has cyan/teal animated metaballs after load
  - CTA behavior still works
  - scroll morph still works
  - club-flow desktop sticky and mobile cards still render
  - particle section still animates when reached
