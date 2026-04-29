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
