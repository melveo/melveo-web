# Data Flow Visualization Plan

## Goal

Make the landing page explain Melveo as a decision system, not as another club-management app.

The section should show the core product logic clearly:

1. Players send small daily and training signals.
2. Melveo collects and combines those signals in one trusted place.
3. Coaches receive context, not scattered inputs.
4. The coaching staff makes a better training or match decision.

The visual should make this loop obvious without relying on app screenshots.

## Current Site Context

The current landing page already has several relevant pieces:

- `HeroScene` gives the brand a strong cyan animated identity.
- `ImageGridScrollMorph` mixes product-feature cards and generated sports imagery.
- `WordScrollStage` communicates that Melveo connects many club concepts.
- `ClubFlowStage` shows one day in a club: check-in, sessions, coach board, decision.
- The current `feedback-stage` already says "input -> output", but it is too static and does not yet visualize the product mechanism.

The eventual implementation path is to transform `feedback-stage` into this richer data-flow section. For the first implementation pass, however, keep it as a new standalone section so the current `DATA → FEEDBACK` block remains available for comparison.

## Placement Decision

Current decision:

- implement this as a **new standalone section** on the website for now;
- later, once the section is visually and narratively validated, use it to replace the existing `DATA → FEEDBACK` / `feedback-stage` section.

Reasoning:

- we can test the new data-flow story without deleting the current simpler explanation;
- if the new section works better, it becomes the permanent replacement;
- this keeps implementation lower-risk and makes visual comparison easier.

## Recommended Placement

Keep the existing section order mostly intact.

Recommended first implementation position:

- place the new `DataFlowStage` near the current `feedback-stage`, ideally directly before it or directly after it;
- keep both sections temporarily so the difference is easy to review.

Recommended later final position:

- after `PricingStage`, where the current `feedback-stage` already lives;
- before app screenshots/testimonials/FAQ/contact.

Reasoning:

- `ClubFlowStage` already tells a chronological story.
- The new section should then explain the underlying system model.
- Pricing comes before it today, but if the page later feels too sales-heavy, this section could move before pricing.

## Section Name Options

Preferred Czech headline:

> Z každého hráčského vstupu vzniká trenérský kontext.

Shorter alternatives:

- Každý vstup má výstup.
- Z hráčských signálů vzniká rozhodnutí.
- Data z týmu. Kontext pro trenéra.
- Vstupy od hráčů. Rozhodnutí pro trenéry.

English equivalents:

- Every player input becomes coaching context.
- Player signals become better decisions.
- Team data. Coach-ready context.
- Inputs from players. Decisions for coaches.

## Core Visual Concept

Build a full-width dark section with a live data-flow composition:

```text
Players                 Melveo Core                  Coach / Staff
  o    wellness   ─┐
  o    RPE        ─┼──>  [ aggregated team signal ]  ───>  decision card
  o    attendance ─┤
  o    readiness  ─┘
```

The user should understand the system in 2-3 seconds:

- left side = many player signals;
- center = Melveo combines them;
- right side = coach receives actionable context;
- bottom/secondary layer = this leads to decisions during training or match day.

## Desktop Layout

Use a three-zone grid:

1. **Player Signal Field**
   - 8-12 small player dots.
   - Each dot can have a tiny label or chip on activation.
   - Labels: `wellness`, `RPE`, `docházka`, `únava`, `bolest`, `spánek`, `readiness`, `motivace`.
   - Dots should pulse in random-looking intervals.
   - Data particles or thin cyan paths move from active dots toward the center.

2. **Melveo Core**
   - Central liquid-glass card or orb.
   - Label: `melveo`.
   - Sub-label: `team signal`, `coach-ready context`, or Czech equivalent.
   - It should look like the single place where data becomes structured.
   - It can contain a small animated stack of metrics or a compact radial signal.
   - Use existing `glass-card`, cyan smoke, and brand colors.

3. **Coach Decision Panel**
   - One larger card on the right.
   - It should not look like a full app screenshot.
   - It should look like a coach-facing decision surface.
   - Example decision chips:
     - `Upravit zátěž`
     - `Individuální regenerace`
     - `Změnit roli v zápase`
     - `Zvýšit monitoring`
     - `Pustit do plného tréninku`
   - The active decision can change as signals arrive.

## Mobile Layout

Use a vertical sequence instead of a complex network:

1. `Hráči posílají signály`
2. `Melveo je spojí`
3. `Trenér dostane kontext`
4. `Vzniká rozhodnutí`

Each step should be a full-width glass card.

The visual can still use animated dots, but avoid dense lines on mobile. Mobile should feel clean and readable:

- no horizontal overflow;
- no tiny unreadable labels;
- no complicated SVG diagram that collapses poorly;
- cards should use the existing liquid glass style.

## Animation Direction

The animation should feel calm, intelligent, and functional.

Desktop:

- Player dots pulse one by one.
- A small cyan particle travels from the player dot to the Melveo core.
- The Melveo core briefly brightens when receiving data.
- The coach card updates with one decision chip.
- The cycle repeats with different signals.

Mobile:

- Cards fade/slide into view on scroll.
- Small dot animations can run inside each card.
- Avoid long line animations across the full viewport.

Timing:

- Random-looking but deterministic enough to avoid bugs.
- Do not fire all player signals at the same time.
- Do not animate too fast; this is a decision system, not a game.
- Respect `prefers-reduced-motion`.

## Copy Direction

Avoid negative framing such as:

- "coach never sees raw numbers";
- "not just another app";
- "no raw player data".

Use active product language:

- player input becomes team signal;
- Melveo turns data into coach context;
- staff can act before training or match decisions;
- every input has a usable output.

### Czech Draft

Eyebrow:

`DATOVÝ TOK KLUBU`

Headline:

`Z každého hráčského vstupu vzniká trenérský kontext.`

Body:

`Melveo sbírá signály z check-inů, docházky, RPE a sessions. Spojí je do jednoho přehledu, se kterým trenér pracuje při tréninku i zápase.`

Player side:

- `Check-in`
- `RPE`
- `Docházka`
- `Wellness`
- `Readiness`

Melveo core:

- `Spojený týmový signál`
- `Kontext v jednom místě`
- `Aktualizováno průběžně`

Coach side:

- `Rozhodnutí`
- `Zátěž`
- `Regenerace`
- `Role`
- `Monitoring`

### English Draft

Eyebrow:

`CLUB DATA FLOW`

Headline:

`Every player input becomes coaching context.`

Body:

`Melveo collects signals from check-ins, attendance, RPE, and sessions. It combines them into one coach-ready view for training and match-day decisions.`

Player side:

- `Check-in`
- `RPE`
- `Attendance`
- `Wellness`
- `Readiness`

Melveo core:

- `Connected team signal`
- `Context in one place`
- `Continuously updated`

Coach side:

- `Decision`
- `Load`
- `Recovery`
- `Role`
- `Monitoring`

## Component Strategy

Create a new component:

`src/components/DataFlowStage.astro`

Then replace the current `feedback-stage` block in `src/components/Landing.astro` with:

```astro
<DataFlowStage lang={lang} />
```

This is cleaner than making `Landing.astro` even larger.

## Styling Strategy

Use existing visual primitives:

- `.glass-card`
- `.glass-filter`
- `.glass-overlay`
- `.glass-specular`
- `.hero-pill` only if a CTA is needed
- `data-glass-smoke` and `glass-smoke.ts` for background smoke
- existing brand tokens from `src/styles/global.css`

Avoid:

- new color systems;
- red/orange gradients;
- app screenshot placeholders;
- dense dashboard mockups;
- nested cards inside cards;
- decorative blobs unrelated to the data flow.

## Implementation Outline

### Phase 1: Static Layout

Build `DataFlowStage.astro` with:

- full-width dark section;
- centered copy block;
- three-zone desktop layout;
- vertical mobile layout;
- glass cards and labels;
- no JS yet.

Exit criteria:

- desktop layout reads clearly at 1280+ px;
- mobile layout stacks cleanly at 390 px;
- no horizontal overflow.

### Phase 2: SVG / CSS Data Lines

Add a lightweight SVG layer for desktop paths:

- lines from player dots to core;
- line from core to coach card;
- use CSS variables and opacity animations;
- keep it decorative with `aria-hidden="true"`.

Mobile can use short vertical connectors instead of full SVG lines.

Exit criteria:

- paths are visible but not noisy;
- paths do not overlap text in a confusing way;
- reduced motion disables animated travel.

### Phase 3: Data Pulse Animation

Add small deterministic animation logic:

- cycle through player dots;
- activate one dot at a time;
- update active signal label;
- brighten the Melveo core;
- update coach decision chip.

Implementation can be plain TypeScript in a small script:

`src/scripts/data-flow-stage.ts`

Rules:

- do not use heavy animation libraries unless needed;
- pause when section is offscreen;
- stop or simplify under `prefers-reduced-motion`;
- avoid layout thrash; only toggle classes/data attributes.

Exit criteria:

- no console errors;
- animation does not continue aggressively offscreen;
- timing feels calm.

### Phase 4: Copy + i18n

Add translation keys in `src/i18n/ui.ts`:

- `dataFlow.eyebrow`
- `dataFlow.headline`
- `dataFlow.body`
- `dataFlow.players`
- `dataFlow.core`
- `dataFlow.coach`
- signal labels
- decision labels

Exit criteria:

- Czech and English render correctly;
- no hardcoded Czech text in shared component except via translation data.

### Phase 5: Replace Current Feedback Stage

Remove the current inline `feedback-stage` block from `Landing.astro`.

Keep or migrate useful copy from the current `feedbackItems`, but avoid retaining the static card-only presentation.

Exit criteria:

- section order remains coherent;
- page does not become longer without purpose;
- no duplicate "input/output" messaging.

## Accessibility

The animated data map should be decorative unless it contains meaningful text.

Recommended accessible structure:

- real heading and body text;
- three semantic groups:
  - `Hráči posílají signály`
  - `Melveo spojuje data`
  - `Trenér pracuje s kontextem`
- decorative SVG lines: `aria-hidden="true"`;
- animated dots: `aria-hidden="true"` if labels are duplicated in real text;
- avoid relying on animation to understand the section.

Reduced motion:

- show a static version of the flow;
- keep all labels visible;
- disable moving particles.

## Performance

Keep it light:

- CSS/SVG first;
- no canvas needed for the data flow itself;
- reuse `glass-smoke.ts` only if background motion is needed;
- lazy-init any JS with IntersectionObserver;
- no new image assets required;
- avoid adding Three.js or Motion for this section.

Performance budget:

- new JS under roughly 4-6 KB gzip if possible;
- no layout reads on every frame;
- no constantly running animation while offscreen.

## Visual QA Checklist

Verify:

- desktop 1440 x 900;
- desktop 1280 x 720;
- tablet 834 x 1112;
- mobile 390 x 844;
- mobile 360 x 740.

Checks:

- headline fits;
- no text overlaps the animated lines;
- no horizontal overflow;
- player dots do not hide important text;
- core is visually central and understandable;
- coach decision panel reads as output/action;
- section feels consistent with hero, pricing, and club-flow sections;
- console has no errors.

## Technical QA Checklist

Run:

```bash
bun run astro check
bun run build
```

Browser checks:

- `/cs/`
- `/en/`
- console errors;
- missing images;
- horizontal overflow;
- reduced motion simulation if practical.

Deployment:

- deploy to Cloudflare only after build and visual checks pass;
- verify production HTML includes the new component;
- verify production desktop/mobile with screenshots.

## Open Questions

1. Should this replace the current `feedback-stage`, or should it be inserted earlier before pricing?
2. Should the coach decision panel use match-day language, training language, or both?
3. Do we want visible player labels such as `Hráč 01`, `Hráč 02`, or anonymous dots only?
4. Should Melveo core say `melveo`, `team signal`, or `coach board`?
5. Should the section have a CTA, or should it remain purely explanatory?
6. Should the visual mention privacy at all, or keep privacy for a separate legal/trust section?

## Recommended Answers

My current recommendation:

1. Replace the current `feedback-stage`.
2. Use both training and match-day language, but keep the visible decision chips short.
3. Use anonymous player dots, not named players.
4. Put `melveo` in the core and `spojený týmový signál` as the sublabel.
5. No CTA inside this section; it should explain the system, not interrupt it.
6. Do not emphasize privacy here. Mention trust subtly through "context in one place"; keep legal/privacy messaging elsewhere.
