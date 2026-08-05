# melveo-web

Marketing site for melveo.app — a static Astro build served from a Cloudflare
Worker with a Static Assets binding. Bilingual (cs canonical, en secondary).

## Commands

- Dev: `bun run dev`
- Build: `bun run build` (astro build + `scripts/copy-public-assets.mjs`)
- Typecheck: `bun run check` (astro check)
- Test: not configured
- Lint: not configured
- Deploy: automatic via Cloudflare Workers Builds on push to `main`; manual is
  `bunx wrangler deploy`

CI (`.github/workflows/ci.yml`) runs typecheck, build, `bun audit --audit-level
high`, and a guard that fails if Finder `* 2.*` duplicates reach `dist/`.

## Map

- Entry points: `src/pages/index.astro` (client-side locale redirect),
  `src/pages/{cs,en}/index.astro`, `src/worker.ts` (pass-through to ASSETS)
- `src/pages/{cs,en}/` — routes; every page exists twice, once per locale
- `src/components/` — Astro sections of the landing (`Landing.astro` composes
  the stages) plus `MelveoDataFlowHero.tsx`, the only Preact island
- `src/i18n/ui.ts` — every UI string, keyed by locale; single source of truth
- `src/layouts/BaseLayout.astro` — head, meta, JSON-LD, analytics
- `src/scripts/` — per-stage vanilla TS animation modules (GSAP)
- `src/styles/` — `global.css` (Tailwind 4 + design tokens), `legal.css`
- `scripts/` — build and audit helpers (`copy-public-assets.mjs` runs in build)
- `docs/` — audit and plan records; read before redoing past work

## Working agreements

- Simplicity first: minimum code that solves the problem; nothing speculative; no
  abstractions for single-use code.
- Surgical changes: every changed line traces to the task; match existing style; don't
  "improve" adjacent code; never delete code you don't understand - flag it instead.
- Run the typecheck and build commands above before claiming a task is done, and
  report their actual output.

## Hard constraints

- Use **bun**, never npm. The lockfile is `bun.lock`; `package-lock.json` is
  gitignored because Workers Builds runs bun.
- **Every content change lands in both locales.** A new page means
  `src/pages/cs/…` and `src/pages/en/…`, and new copy goes into `src/i18n/ui.ts`
  under both `cs` and `en` — never hardcode user-visible strings in components.
- Do NOT touch: `dist/`, `.astro/`, `node_modules/`, `video-assets/` (708 MB of
  local-only promo video sources, gitignored).
- Never create files with a trailing `" 2"` / `" 3"` in the name — those are macOS
  Finder duplicates, they are gitignored, and CI fails the build if any reach `dist/`.
- **Pricing lives in three places** — this repo (hardcoded in
  `src/components/PricingStage.astro`), the app's Supabase `plan_prices`, and
  Stripe. The web is canonical; changing a price here without the other two puts
  them out of sync. Flag it, don't quietly edit.
- No VAT/DPH wording on the landing page (owner decision 2026-06-10). The string
  `pricing.vatNote` exists but is deliberately not rendered.
- The iOS app must not contain purchase buttons (Apple guideline 3.1.3(f)) — all
  payment flows belong on this site, so never write copy telling users to buy in
  the app.
- `wrangler.toml` carries a specific `account_id` (the Hello@melveo.app account)
  and custom-domain routes. Don't change them.
