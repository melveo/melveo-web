# melveo-web

Static marketing + legal site + Stripe checkout completer for **Melveo**
([app repo](../melveo-app)). Built with [Astro 6](https://astro.build) +
[Tailwind 4](https://tailwindcss.com), deploys as a static site to
[Cloudflare Pages](https://pages.cloudflare.com).

This repo deliberately stays separate from the iOS app — different
stack, different deploy cadence, different ownership. See
`docs/planning/178_web_repo_handoff.md` in the app repo for the
contract between the two.

## Why a separate repo

| Concern             | App repo (Swift) | Web repo (this) |
|---------------------|------------------|-----------------|
| Stack               | Xcode, Swift     | Node, TS, Astro |
| Deploy cadence      | TestFlight (manual, hours) | Cloudflare Pages (push, ~30s) |
| CI                  | xcodebuild       | astro build      |
| Editors             | Devs only        | Marketing-friendly MDX |
| AASA / legal pages  | —                | Lives here       |
| Stripe checkout UI  | —                | Lives here       |

## Pages

| Path                       | Purpose                                                    |
|----------------------------|------------------------------------------------------------|
| `/`                        | Landing — value prop, features, pricing teaser, contact.   |
| `/privacy`                 | Privacy policy. **Placeholder** until legal review.        |
| `/terms`                   | Terms of service. **Placeholder** until legal review.      |
| `/checkout/success`        | Post-Stripe redirect; universal-link target for iOS.       |
| `/.well-known/apple-app-site-association` | AASA for Universal Links + webcredentials.  |

## Design tokens

`src/styles/global.css` mirrors `Melveo/Melveo/Design/Tokens/Colors.swift`
in the app repo. When the SwiftUI palette changes, update both — see
the handoff doc 178 for the sync rule.

Brand cyan: `#00f0ff` (Electric Cyan, doc 58 §1).

## Local dev

```sh
bun install
bun run dev   # http://localhost:4321
```

First boot does Vite dep optimization (motion, react, three, gsap,
tailwind…) which takes ~30s. Subsequent starts are ~3-5s because
`node_modules/.vite/` caches the bundled deps.

### Package-manager rules (avoid the 2026-05 bootstrap regression)

- **Bun is canonical.** Always install with `bun install` and commit
  the resulting `bun.lock`. Don't mix in `npm install` / `pnpm` —
  parallel lockfiles drift and break CI silently.
- **Adding/removing deps:** `bun add <pkg>` or `bun remove <pkg>`,
  then commit `package.json` + `bun.lock` together in one commit.
- **Don't hand-edit `"overrides"` in `package.json`** without verifying
  the resolved version actually loads under Node ESM. The previous
  `"overrides": { "zod": "4.3.5" }` pinned a build whose subdirectory
  `package.json` is invalid under strict ESM resolution
  (`ERR_INVALID_PACKAGE_CONFIG`) — astro never finished booting.
- **Don't override `server.port` in `astro.config.mjs`.** The default
  (`4321`) is wired into `.claude/launch.json`, all dev docs, and the
  Cloudflare Pages preview URL. Changing it silently breaks the
  Claude preview MCP (it tries `:4321` and gets `chrome-error://`).
- **Astro config must stay wrapped in `defineConfig({…})`.** Without
  it you lose type-safety and the `sitemap()` integration silently
  drops its TypeScript shape — easy to forget to re-add when refactoring.

### When dev start hangs or errors

Symptom: `bun run dev` prints `$ astro dev` then sits silent, no
"ready in …" line, port 4321 either isn't listening or replies with
nothing. Standard recovery, in order:

```sh
# 1. Kill any zombie dev / install processes
pkill -9 -f 'astro dev'; pkill -9 -f 'bun install'

# 2. Clean reinstall
rm -rf node_modules                # leave bun.lock in place
bun install                        # rebuilds from lockfile, ~3-4s

# 3. Verify with a verbose start
node node_modules/.bin/astro dev --verbose
```

If `--verbose` reveals a Node error like `ERR_MODULE_NOT_FOUND` or
`ERR_INVALID_PACKAGE_CONFIG`, the lockfile + a dependency are out of
sync. Try `rm -rf node_modules bun.lock && bun install` to regenerate
the lockfile from scratch (last resort — locks in the latest matching
semver, so review the diff before committing).

## Build

```sh
bun run build   # outputs ./dist
bun run preview # preview built site
```

## Deploy (Cloudflare Pages)

1. Push to `main`.
2. Cloudflare Pages picks up automatically (after one-time setup).

One-time setup:

```sh
# In Cloudflare dashboard:
#   Pages → Create project → Connect to Git → select melveo-web repo
#   Build command:    bun run build
#   Output dir:       dist
#   Node version:     22.12+
#   Custom domain:    melveo.app + www.melveo.app
```

DNS already on Cloudflare (used for Resend mail subdomain too — see
team_app's reference_resend_setup memory).

## Pre-launch checklist

- [ ] Replace `TEAMID` placeholder in `apple-app-site-association`
- [ ] Verify bundle ID `app.melveo.melveo` matches Xcode `Info.plist`
- [ ] Legal review of `/privacy` + `/terms` (currently placeholders)
- [ ] Hero screenshot — currently placeholder, blocked on UX sign-off
- [ ] OG image at `/og-default.png` (currently 404)
- [ ] Stripe webhook → app server (independent of this UI)
- [ ] First TestFlight build with associated domains entitlement enabled

## See also

- App repo: `../melveo-app` (planning under `docs/planning/`)
- Doc 177 fáze D — web hosting plan in app repo
- Doc 178 — handoff contract between the two repos
