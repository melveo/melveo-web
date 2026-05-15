# Melveo web — font stack

Single source of truth for the typography used across the marketing
site. **Do not change these without updating both this doc and the
linked source files.**

## Fonts in use

| Role | Font | Weights | Used by |
|------|------|---------|---------|
| **Brand wordmark** | [Comfortaa](https://fonts.google.com/specimen/Comfortaa) | 500 / 600 / 700 | `.melveo-wordmark`, `.hero-headline`, ImageGridScrollMorph intro overlay |
| **Body sans** | [Inter](https://fonts.google.com/specimen/Inter) | 400 / 500 / 600 / 700 | Everything else (paragraphs, UI labels, buttons, pricing cards) |

## Why these two

### Comfortaa (brand wordmark)

Comfortaa is the rounded geometric sans whose lowercase letterforms
match the brand apparel and downloaded app icon. The signature
glyph is the lowercase `l` — it has a small curl/foot at the bottom,
not a straight stick (which is what Quicksand renders).

Previously we used **Quicksand** because the letterforms looked
similar at a glance, but a direct side-by-side with the brand
apparel revealed the `l` mismatch (user feedback 2026-05-15). The
`l` foot, the closed-counter `e`, the perfectly circular `o`, and
the soft-rounded terminals on every glyph are all Comfortaa
signatures.

Quicksand stays in the CSS cascade as a fallback purely for
graceful degradation — same family vibe (rounded geometric sans,
lowercase-friendly), so if Comfortaa ever fails to load the
fallback won't jar.

### Inter (body)

Inter is the de-facto SaaS body font in 2026. Vercel, Linear,
Notion, GitHub Next, Stripe… all ship with it. The reasons we
picked it over alternatives:

- **Screen-first.** Designed for UIs, not print. Hinting is tight
  at small sizes — reads cleanly at 14–16 px.
- **Broad weight ladder.** 100–900 with matching italics; we ship
  400/500/600/700.
- **Czech diacritics.** Renders háčky and čárky cleanly (some
  geometric sans serifs distort `č` / `š` / `ř`).
- **Familiarity.** Users of other tech-forward SaaS products
  recognise it subconsciously, which makes the site feel "of the
  same family" as the tools they already know.

The alternatives considered were Roboto (too neutral / Android-
coded), DM Sans (newer but less Czech-tested), Plus Jakarta Sans
(beautiful but visually heavier), and system-ui (no control over
what users see — Mac users get SF Pro, Windows users get Segoe UI;
nice on Mac, harsh on Windows).

## Where the fonts are configured

```
src/layouts/BaseLayout.astro
    └── <link href="…Comfortaa…Inter…&display=swap" rel="stylesheet">

src/styles/global.css
    ├── --font-wordmark: "Comfortaa", "Quicksand", "Inter", system-ui, …
    ├── --font-sans:     "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, …
    └── --font-display:  "Inter", -apple-system, BlinkMacSystemFont, system-ui, …
```

Components that need the brand font reach for `var(--font-wordmark)`
either directly or via the `.melveo-wordmark` utility class. Everything
else inherits `var(--font-sans)` from the `body { font-family }` rule.

## When you'd legitimately want to change a font

1. The brand identity itself shifts (e.g., a new logo lockup).
2. The current font fails to support a glyph we need (very unlikely
   for Czech / English; would matter if we added e.g. Polish or
   Hungarian).
3. The Google Fonts host has a sustained outage and we want to
   self-host the woff2 files. In that case, update both this doc and
   the `<link>` in `BaseLayout.astro`.

Anything else — bump the weight or the size; don't swap the family.

## Subset / performance notes

- We use `&display=swap` on the Google Fonts URL so the body shows
  with system fallbacks during the woff2 fetch instead of blocking
  on FOIT.
- Latin Extended subset is included by default for Czech glyphs;
  no extra `subset=latin-ext` query needed for Google Fonts in
  2024+.
- `preconnect` to `fonts.googleapis.com` + `fonts.gstatic.com` is
  set in `BaseLayout.astro` head so the TLS handshake happens
  in parallel with the HTML parse.
