# Club Flow Responsive Card Plan

## Goal

Improve the `JEDEN DEN V KLUBU` / `ONE CLUB DAY` section so it reads as a clearer product story across device sizes:

- desktop keeps the current sticky media + active step card flow;
- smaller devices use full-width full-image cards with the text placed over a readable bottom shadow;
- medium devices use a two-card grid until there is enough room for the sticky desktop composition;
- copy explains what Melveo turns inputs into, instead of emphasizing what coaches do not see.

## Content Direction

Each step should describe the same product loop:

1. Player or team input is collected.
2. Melveo turns it into context.
3. Coaches get a usable signal.
4. The team makes a better training decision.

Avoid negative positioning such as "without raw numbers" in this section. The message should be active: input becomes feedback.

## Layout Direction

### Desktop and Larger Tablets

Keep the sticky layout only on wide viewports:

- large media panel on the left;
- animated, intentionally smaller step cards on the right;
- progress rail;
- smoke/glass treatment aligned with the rest of the landing page.

This format works well when there is enough horizontal space and gives the section a strong "workflow" feeling.

### Mobile and Smaller Tablets

Change the stacked cards so each card is effectively the image:

- the photo fills the entire card;
- a dark cyan-tinted gradient shadow sits at the bottom;
- step number, time/kicker, title, and short body sit inside that shadow;
- remove the separate image block above the text;
- keep the glass rim/shadow so it still belongs to the current Melveo design system.

### Medium Devices

Use the same image-overlay card recipe, but switch to a two-column grid once the viewport has enough horizontal room. This keeps tablets and small laptops from showing one overly narrow vertical stream while still avoiding the sticky desktop interaction before it has enough space.

## Verification

After implementation:

- run `bun run build`;
- run `git diff --check`;
- visually verify desktop, tablet, and mobile screenshots;
- check the browser console for new errors.
