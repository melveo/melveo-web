# melveo-web — komplexní plán (verze z 2026-04-30)

> Living document. Žije s kódem (`melveo-web/docs/PLAN.md`) a je
> referencovaný z app repu jako `melveo-app/docs/planning/180_melveo_web_plan.md`.
>
> Updatuj pokaždé, když rozhodneš o něčem novém z této doc, ať
> následující session má fresh context.

---

## 0. Současný stav

| Co | Stav |
|----|------|
| Repo `~/Documents/ai_projects/melveo-web` | ✓ private GitHub `matk0shub/melveo-web` |
| Stack: Astro 6 + Tailwind 4 + TypeScript + Bun | ✓ |
| Design tokens mirrored z iOS app | ✓ `src/styles/global.css` (`@theme`) |
| 4 stránky (`/`, `/privacy`, `/terms`, `/checkout/success`) | ✓ |
| AASA scaffold s `TEAMID` placeholder | ✓ `/public/.well-known/...` |
| Pitch-black V3 landing proti fey/raycast DNA | ✓ commit `18981bb` |
| Cloudflare Pages connect | ⏸ čeká na user manual UI step |
| Reálné iOS screenshoty | ⏸ čeká na finální iOS UX |
| Apple Developer Team ID | ⏸ čeká na membership ($99/rok) |
| Privacy + Terms produkční text | ⏸ user nechce Iubendu — viz §15 |
| Animace / interakce | ⏸ tato doc je plán pro V4 |

## 1. Vize a cíl

**Krátká teze:**
Melveo.app je single-page indie iOS-app landing s production value a
narativem fey.com / raycast.com. Účel je dvojí:

1. **Primárně:** přesvědčit hráče k stažení aplikace přes App Store.
2. **Sekundárně:** zachytit zájem klubů/trenérů o pilot přes
   `hello@melveo.app`.

**NeJsou cíle:**

- ❌ Není to dashboard / aplikace samotná (to je iOS app)
- ❌ Není tu pricing tabulka / IAP / žádné CTAs co Apple §3.1.3(f)
  zakazuje
- ❌ Není to e-shop / marketplace
- ❌ Není to blog / changelog (zatím)

## 2. Cílovky a tone of voice

| Persona | Co od stránky chce | Co dostane |
|---------|---------------------|------------|
| **Hráč** (player) | Rychle pochopit a stáhnout | Hero claim → App Store badge ihned |
| **Trenér / klubový admin** (staff) | Pochopit value prop pro klub | Stages s privacy promise + pilot CTA |
| **Owner klubu / management** (clubLeadership) | Důvěryhodnost, "není to consumer hračka" | Premium feel + sport-context |

**Tone:**
- Stručný, věcný, bez marketingu
- Žádná superlativa ("nejlepší", "revoluce")
- Konkrétní čísla ("30 sekund check-in", "1 licence = 1 tým")
- Czech-only V1, EN přijde V2

## 3. Reference DNA — locked

User confirmed: https://fey.com + https://www.raycast.com

**Co odsud lift:**

- ✓ Pitch-black canvas (`#050608`) místo off-dark
- ✓ Fullwidth sekce — žádný outer max-w container
- ✓ Velká bold typografie přes `clamp()` scale
- ✓ Cyan halo bleed přes viewport
- ✓ Section bands alternující dark levels
- ✓ Single CTA prominentně (App Store badge)
- ✓ Big-text mailto na konci (raycast pattern)

**Co NElift:**

- ❌ Fey scroll-locked storytelling (overhead pro V1)
- ❌ Raycast video hero (nemáme produkční video)
- ❌ Komplexní animace na hover

## 4. Information architecture (8 sekcí)

Vyplyne z tvých CodePen referencí. Pořadí finální:

```
┌─ 1. HERO ─────────────────────────────────────┐
│  Wordmark top-left + "hello@melveo.app" right │
│  Eyebrow: "Pro sportovní kluby"               │
│  H1 s rotujícím slovem (codepen #2)           │
│    "Chytřejší __."                            │
│      └ tréninky / hráči / klub / sezóna       │
│  Sub-claim 1 řádek                            │
│  [App Store badge]    [Pilot pro klub →]      │
│  Hero halo cyan bleed                         │
│  Hero base layout = codepen #1 (VoXelo)       │
└───────────────────────────────────────────────┘
┌─ 2. PRODUCT REVEAL ───────────────────────────┐
│  "Vše co tým potřebuje. V jedné aplikaci."    │
│  Codepen #5 (KevinGutowski) — jeden screenshot│
│  se transformuje na grid feature kartiček.    │
│  Místo fotek → vizualizace funkcí.            │
└───────────────────────────────────────────────┘
┌─ 3. CONNECTING ELEMENTS / METABALL ───────────┐
│  Codepen #3 (ahmadawais) — gooey/metaball     │
│  vizuál, slouží jako visual punctuation       │
│  + krátká claim ("Trenér + hráč. Synced.")    │
│  Buď v hero pozadí nebo jako standalone       │
│  sekce — zkusíme oba a zvolíme po preview.    │
└───────────────────────────────────────────────┘
┌─ 4. WELLNESS / RANNÍ READINESS ───────────────┐
│  Asymetrický grid: copy left + iPhone right   │
│  Eyebrow: "Ráno · 30 sekund"                  │
│  H2: "Pětiosý check-in."                      │
│  Copy: privacy promise mini ("trenér vidí tým,│
│  nikdy hráče")                                │
└───────────────────────────────────────────────┘
┌─ 5. INTERESTING EFFECT ───────────────────────┐
│  Codepen #4 (giomgio) — pro vizuální          │
│  oddělení sekce 4 a 6, accent stage           │
│  Bez velkého copy, nebo s krátkým claim       │
└───────────────────────────────────────────────┘
┌─ 6. SESSIONS + COACH BOARD ───────────────────┐
│  Asymetrický grid: copy right + screenshot    │
│  left (alternuje proti sekci 4)               │
│  Eyebrow: "Trénink + rozhodnutí"              │
│  H2: "Sessions a coach board."                │
│  Copy: "Plánuj, zaznamenej, rozhodni."        │
└───────────────────────────────────────────────┘
┌─ 7. DANIEL HAIM EFFECT ───────────────────────┐
│  Codepen #6 (danielhaim) — místo TBD,         │
│  čeká na popisek od user co tam vidí.         │
│  Plán: typography reveal nebo letter morph    │
│  → použít na privacy promise H2.              │
└───────────────────────────────────────────────┘
┌─ 8. PRIVACY PROMISE ──────────────────────────┐
│  Big statement, centered, halo cyan           │
│  "Trenér nikdy nevidí syrová čísla hráče."    │
│  Subtitle: "Klub kupuje, hráč nikdy neplatí." │
│  Ref: doc 174 §3 (privacy contract)           │
└───────────────────────────────────────────────┘
┌─ 9. PILOT CTA ────────────────────────────────┐
│  "Klub a chcete pilot?"                       │
│  Big mailto: hello@melveo.app →               │
│  "Napište, krátce zavoláme, do 14 dní pilot." │
└───────────────────────────────────────────────┘
┌─ 10. FOOTER ──────────────────────────────────┐
│  © 2026 Melveo · hello@melveo.app · Privacy · │
│  Terms                                        │
└───────────────────────────────────────────────┘
```

## 5. Content plan (Czech copy)

### 5.1. Hero rotující slovo

```
Eyebrow:  PRO SPORTOVNÍ KLUBY
H1:       Chytřejší {ROTATING}.
            ROTATING ∈ [
              "tréninky",
              "rozhodnutí",
              "ráno",
              "klub",
              "sezóna"
            ]
Sub:      Wellness, sessions a coach board v jedné aplikaci.
CTA1:     [Stáhnout v App Store]
CTA2:     Pilot pro klub →
```

### 5.2. Product reveal

```
Eyebrow:  V JEDNÉ APLIKACI
H2:       Vše co tým potřebuje.
Sub:      Bez Excelu, bez WhatsAppu, bez prokrastinace.
Cards (vyplynou z grid morph):
  • Pětiosý ranní check-in
  • Plánování sessions
  • Coach board today
  • Aggregate readiness
  • Docházka + RPE
  • Privacy-guarded data
```

### 5.3. Wellness stage

```
Eyebrow:  RÁNO · 30 SEKUND
H2:       Pětiosý check-in.
Body:     Hráč rychle ohodnotí energii, spánek, bolestivost,
          náladu, motivaci. Trenér vidí tým — nikdy syrová čísla
          jednotlivce.
Tag:      Doc 174 §3 — privacy contract
```

### 5.4. Sessions + coach board stage

```
Eyebrow:  TRÉNINK · ROZHODNUTÍ
H2:       Sessions a coach board.
Body:     Plánuj tréninky, zaznamenej účast, sleduj zátěž (RPE).
          Než přijedeš na hřiště, víš co tým potřebuje.
```

### 5.5. Privacy promise

```
Eyebrow:  SOUKROMÍ
H2:       Trenér nikdy nevidí
          syrová čísla hráče.
Body:     Wellness data jsou agregovaná. Klub kupuje, hráč nikdy
          neplatí. Co je hráčovo, zůstává hráčovo.
```

### 5.6. Pilot CTA

```
H2:       Klub a chcete pilot?
Body:     Napište nám, krátce zavoláme, do 14 dní spustíme první
          trénink na Melveu.
Big-CTA:  hello@melveo.app →
```

## 6. Visual system

### 6.1. Color palette (locked, mirroring iOS)

| Token | Hex | Use |
|-------|-----|-----|
| `--color-bg-canvas` | `#050608` | Pitch black landing canvas |
| `--color-bg-surface` | `#0c0d11` | Section band alternative |
| `--color-bg-surface-elevated` | `#15171c` | Cards, screenshot frames |
| `--color-accent-primary` | `#00f0ff` | Brand cyan |
| `--color-accent-primary-cta-fg` | `#001014` | Foreground on cyan surfaces |
| `--color-text-primary` | `#f5feff` | Body/H1 text |
| `--color-text-secondary` | `#9aa3b2` | Sub-text, captions |
| `--color-text-tertiary` | `#5d6573` | Eyebrows, footer |
| `--color-stroke-base` | `rgba(255,255,255,0.06)` | Section borders |
| `--color-stroke-emphasized` | `rgba(255,255,255,0.14)` | Card borders |

### 6.2. Type scale (clamp, locked)

```
H1 (hero):       clamp(3rem, 8.5vw, 8.5rem)   ~48–136px
H2 (stage):      clamp(2rem, 5vw, 4.5rem)     ~32–72px
H2 (statement):  clamp(2.5rem, 6vw, 6rem)     ~40–96px
Body L:          1.125rem (18px)
Body M:          1rem (16px)
Eyebrow:         0.75rem (12px), tracking 0.4em uppercase
```

Font: **Inter** (system fallback). Variable font, supports Czech
diakritiku. Hosted statically z Google Fonts (preload na font-display:
swap), ne CDN.

### 6.3. Spacing + radius

Mirrors iOS app (`spacing-2xs` až `2xl`, `radius-s` až `2xl`). Padding
sekcí: `px-6 sm:px-12 lg:px-20`, vertical `py-24 sm:py-32 lg:py-40`.

### 6.4. Shadows / glows

```
Hero screenshot:
  shadow-[0_60px_120px_-24px_rgba(0,240,255,0.18),
          0_0_0_1px_rgba(0,240,255,0.08)]

Stage screenshots:
  shadow-[0_40px_120px_-20px_rgba(0,240,255,0.12)]

Privacy halo:
  .halo-cyan with opacity: 0.5
```

## 7. Animation library (V4)

### 7.1. Hero rotující text (codepen #2 josh)

**Zdroj:** https://codepen.io/joshcummingsdesign/pen/jWLpQv

**Implementace:**

Pravděpodobně GSAP + SplitText, nebo pure CSS s `@keyframes`. V4
preferuje **lightweight Motion One** (https://motion.dev) — 5kB,
modern API:

```ts
import { animate, stagger } from "motion";

const words = ["tréninky", "rozhodnutí", "ráno", "klub", "sezóna"];
let idx = 0;

setInterval(() => {
  const el = document.querySelector("[data-rotate-word]");
  animate(el, { y: [0, -40], opacity: [1, 0] }, { duration: 0.4 })
    .finished.then(() => {
      idx = (idx + 1) % words.length;
      el.textContent = words[idx];
      animate(el, { y: [40, 0], opacity: [0, 1] }, { duration: 0.4 });
    });
}, 2400);
```

**Accessibility:** `aria-live="polite"` na rotujícím elementu;
respect `prefers-reduced-motion: reduce` → text se nestřídá, jen
sekvenčně.

**Fallback bez JS:** první slovo je SSR'd v HTML, tak vždy něco vidíš.

### 7.2. Hero base layout (codepen #1 VoXelo)

**Zdroj:** https://codepen.io/VoXelo/pen/ogbKQOy

**Implementace:**

Plánuju hero base = co je aktuálně v V3 (pitch-black + halo + claim
+ CTA + screenshot pod). Až user popíše co konkrétně VoXelo dělá
(mouse-tracking glow? gradient shift? particle field?), upravíme.

**Pre-implementation otázka pro user:** §15 Q1.

### 7.3. Connecting elements / metaball (codepen #3 ahmadawais)

**Zdroj:** https://codepen.io/ahmadawais/pen/JodBmX

**Pravděpodobně:** SVG gooey filter (`<feGaussianBlur>` +
`<feColorMatrix>`) na 2-3 kruzích co se hýbou a slévají do sebe.

**Implementace:**

```html
<svg class="absolute inset-0 w-full h-full">
  <defs>
    <filter id="gooey">
      <feGaussianBlur stdDeviation="20" />
      <feColorMatrix values="
        1 0 0 0 0
        0 1 0 0 0
        0 0 1 0 0
        0 0 0 18 -7" />
    </filter>
  </defs>
  <g filter="url(#gooey)" class="metaballs">
    <circle ... animate-float-1 />
    <circle ... animate-float-2 />
  </g>
</svg>
```

S CSS `@keyframes float-1/2` co posouvají kruhy v elliptické dráze.

**Performance:** SVG filter je GPU-accelerated, OK na mobilu.

**Umístění:** preferuju **standalone sekci 3** (visual punctuation),
ne hero pozadí — gooey filter v hero by konkurovalo s typo. Ale
pokud chceš zkusit obojí, vyrobím obě varianty a porovnáme.

### 7.4. Interesting effect (codepen #4 giomgio)

**Zdroj:** https://codepen.io/giomgio/pen/abxGyQX

**Pre-implementation:** §15 Q2 — popis efektu.

**Plán:** sekce 5 mezi wellness a sessions stages. Buď:
- 3D parallax tilt na mouse hover (CSS `transform-style: preserve-3d`)
- Distortion / liquid effect (WebGL shader)
- Particle field (canvas 2D)

### 7.5. Image grid morph (codepen #5 KevinGutowski)

**Zdroj:** https://codepen.io/KevinGutowski/pen/QwNZYzL

**User intent:** "jak jedna fotka se změní do více těch fotek"

**Implementace:**

CSS Grid + GSAP timeline (nebo Motion One). Jeden velký screenshot
přechází na grid 2×3 nebo 3×3 po scrollu (IntersectionObserver
trigger).

```ts
// V4 sketch
const observer = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    animate(".reveal-tile", {
      scale: [0.6, 1],
      opacity: [0, 1]
    }, { duration: 0.6, delay: stagger(0.08) });
  }
});
```

Tiles by mohly být reálné iOS screenshoty různých surfaces
(check-in, sessions, coach board, members, …) — ale dokud nemáme
real screenshoty, použijeme placeholder gradient cards s feature
copy ("Pětiosý check-in", "Coach Board", atd.).

### 7.6. Daniel Haim effect (codepen #6)

**Zdroj:** https://codepen.io/danielhaim/pen/azmBEPL

**Pre-implementation:** §15 Q3.

Plán umístit na privacy promise H2 (sekce 8) — letter-by-letter
reveal nebo masked text reveal.

### 7.7. Scroll-triggered reveals

Univerzální vrstva pro všechny sekce. **Stack:**

- IntersectionObserver (vanilla, žádná library)
- CSS class `.reveal` se přepne na `.reveal-active` (transition)
- `prefers-reduced-motion: reduce` → reveals disabled

```ts
const obs = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (e.isIntersecting) e.target.classList.add("reveal-active");
  });
}, { threshold: 0.1 });
document.querySelectorAll("[data-reveal]").forEach((el) => obs.observe(el));
```

## 8. Tech stack — finální

| Vrstva | Volba | Důvod |
|--------|-------|-------|
| **SSG framework** | Astro 6 | Best static-first, MDX support později, žádné runtime JS by default |
| **Styling** | Tailwind 4 (via @tailwindcss/vite) | Rychlý dev, design tokeny v `@theme` |
| **Type system** | TypeScript strict | Bezpečnost |
| **Package manager** | Bun | Rychlejší než npm |
| **Animations** | Motion One (`motion`) | 5kB, modern API, GSAP-class power. Cesta B: GSAP 3 (větší ale battle-tested) |
| **Icons** | Lucide (`lucide-static` SVG) | Open-source, App Store kompatibilní |
| **Fonts** | Inter (variable, Latin Extended pro diakritika) | Czech support, modern, free |
| **Hosting** | Cloudflare Pages | Free, instant, custom domain |
| **DNS** | Cloudflare (existující account) | Už máme kvůli Resend `updates.melveo.app` |
| **Analytics** | Plausible Self-hosted nebo Cloudflare Web Analytics | Privacy-friendly, žádné cookies |
| **CMS / blog** | — | Žádné v V1 |
| **Forms** | `mailto:` link | V1 — žádný backend; V2 můžeme řešit přes Resend Webhook |
| **Sitemap** | `@astrojs/sitemap` | Auto-generuje |
| **Robots** | Manual `public/robots.txt` | |

### 8.1. Dependencies budget

```json
{
  "dependencies": {
    "@astrojs/check": "^0.9.4",
    "@astrojs/sitemap": "^4.0.0",
    "@tailwindcss/vite": "^4.2.4",
    "astro": "^6.1.10",
    "motion": "^11.0.0",
    "tailwindcss": "^4.2.4",
    "typescript": "^5.9.3"
  }
}
```

**Total install size cíl:** < 60 MB node_modules
**Total runtime JS:** < 30 kB gzipped (Motion + my code)

## 9. Performance budget

| Metrika | Cíl | Měřeno čím |
|---------|-----|------------|
| LCP | < 2.0 s | PageSpeed Insights |
| CLS | < 0.05 | PageSpeed Insights |
| TBT | < 100 ms | PageSpeed Insights |
| Total JS bundle | < 30 kB gzip | `bun run build` |
| Total CSS | < 25 kB gzip | Astro inline critical |
| Lighthouse Performance | ≥ 95 | Cloudflare Pages preview |
| Lighthouse Accessibility | ≥ 95 | dtto |
| Lighthouse Best Practices | 100 | dtto |
| Lighthouse SEO | 100 | dtto |

**Optimization rules:**

- Defer ALL animations until IntersectionObserver fires nebo
  user-interaction
- Image: WebP + AVIF (Astro `<Image>` komponenta z `astro:assets`)
- Fonts: preload + `font-display: swap`
- Critical CSS: inline (Astro default)
- 3rd party: žádné v V1 mimo Cloudflare Web Analytics

## 10. Accessibility

- ✓ Color contrast min AA (cyan na pitch-black je 8.5:1, AAA)
- ✓ `prefers-reduced-motion: reduce` — všechny animace disabled
- ✓ Keyboard focus visible (no `:focus { outline: none }`)
- ✓ Semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`)
- ✓ `aria-live="polite"` na rotujícím slovu v hero
- ✓ `alt` text na všech images
- ✓ `lang="cs"` na `<html>`
- ✓ Focus traps není (žádný modal v V1)

## 11. SEO + meta

| Co | Kde |
|----|-----|
| `<title>` | Per-page v `BaseLayout` props |
| Meta description | Dtto |
| OG image (1200×630) | `/og-default.png` ✓ |
| Canonical | Auto v BaseLayout |
| Sitemap.xml | `@astrojs/sitemap` |
| Robots.txt | `public/robots.txt` |
| Schema.org | `<script type="application/ld+json">` v BaseLayout |
|   `WebSite` + `SoftwareApplication` | Pro App Store discoverability |
| Hreflang | Zatím jen `cs`, V2 přidá `en` |

**SoftwareApplication schema:**

```jsonld
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Melveo",
  "applicationCategory": "SportsApplication",
  "operatingSystem": "iOS",
  "downloadUrl": "https://apps.apple.com/cz/app/melveo/idTBD",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "CZK" }
}
```

## 12. Hosting + DNS

### 12.1. Cloudflare Pages setup (one-time)

```
1. Cloudflare dashboard → Pages → Create project
2. Connect to Git → matk0shub/melveo-web (private)
3. Production branch: main
4. Build command: bun run build
5. Output directory: dist
6. Node version: 22.12+ (env: NODE_VERSION=22.12.0)
7. Environment variables: žádné v V1
8. Custom domain: melveo.app + www.melveo.app
9. SSL: Full (strict)
```

### 12.2. DNS records (Cloudflare zone melveo.app)

Aktuálně používáme zone už pro Resend (`updates.melveo.app`). Přidat:

| Type | Name | Target | Proxy |
|------|------|--------|-------|
| A | melveo.app | (CF Pages auto) | ✓ |
| CNAME | www | melveo.app | ✓ |
| CNAME | _well-known | (CF Pages) | ✗ pro AASA |

### 12.3. AASA file caching

Apple agresivně cachuje AASA. Cloudflare Pages má `_headers` soubor:

```
# public/_headers
/.well-known/apple-app-site-association
  Content-Type: application/json
  Cache-Control: no-cache, must-revalidate
```

Po každém deployu force refresh:

```sh
curl -I https://melveo.app/.well-known/apple-app-site-association
```

## 13. Implementation roadmap

### Fáze A — Skeleton + obsah (HOTOVO)

- [x] Astro skeleton
- [x] Tailwind 4 + tokens
- [x] BaseLayout + landing + privacy + terms + checkout success
- [x] AASA scaffold s placeholder
- [x] V3 pitch-black landing per fey/raycast DNA

### Fáze B — Codepen integrace (V4) — TADY POKRAČUJEME

- [ ] B1: Motion One install + reduced-motion guard utility
- [ ] B2: Rotující slovo v hero (codepen #2 josh)
- [ ] B3: Hero base layout finalize (codepen #1 VoXelo) — čeká na user popis
- [ ] B4: Image grid morph reveal (codepen #5 Kevin)
- [ ] B5: Metaball gooey filter (codepen #3 ahmad)
- [ ] B6: Interesting effect sekce (codepen #4 giomgio) — čeká na user popis
- [ ] B7: Daniel Haim text effect (codepen #6) — čeká na user popis
- [ ] B8: Scroll reveal universal layer

### Fáze C — Skutečný obsah

- [ ] C1: iOS screenshoty (8 screens minimum) — čeká na finální iOS UX
- [ ] C2: OG image refinement + dark/light variant
- [ ] C3: Real App Store URL + replace placeholder anchor

### Fáze D — Polish + ship

- [ ] D1: Sitemap + robots.txt + JSON-LD schema
- [ ] D2: PageSpeed pass (zelená všech 4 metrik)
- [ ] D3: Cloudflare Pages connect + DNS cutover
- [ ] D4: Plausible / CF Web Analytics enable
- [ ] D5: AASA file: replace TEAMID + bundle ID verify
- [ ] D6: First TestFlight → AASA verification

### Fáze E — V2 (post-launch)

- [ ] E1: EN locale (`/en/...` routing)
- [ ] E2: Blog / changelog (Astro Content Collections)
- [ ] E3: Customer logos / social proof
- [ ] E4: Demo video sekce

## 14. Codepen reference catalog

Detailní mapování codepenů na sekce + implementační poznámka. Tato
sekce se aktualizuje jak user dodá popisky / screenshoty.

### #1 — VoXelo / hero base
- URL: https://codepen.io/VoXelo/pen/ogbKQOy
- Použití: **Hero sekce** (sekce 1)
- Status: čeká na user popis (Q1 §15)

### #2 — Josh Cummings / měnící se text
- URL: https://codepen.io/joshcummingsdesign/pen/jWLpQv
- Použití: **Hero rotující slovo** v H1 (sekce 1)
- Status: implementace plánovaná přes Motion One (§7.1)

### #3 — Ahmad Awais / spojující elementy
- URL: https://codepen.io/ahmadawais/pen/JodBmX
- Použití: **Sekce 3** — visual punctuation (preferováno) NEBO
  hero pozadí (alternativa)
- Status: plán SVG gooey filter (§7.3)

### #4 — Giomgio / efekt
- URL: https://codepen.io/giomgio/pen/abxGyQX
- Použití: **Sekce 5** mezi wellness a sessions stages
- Status: čeká na user popis (Q2 §15)

### #5 — Kevin Gutowski / image grid morph
- URL: https://codepen.io/KevinGutowski/pen/QwNZYzL
- Použití: **Sekce 2** — jeden screenshot se transformuje do gridu
  feature kartiček (místo fotek = funkce)
- Status: implementace plánovaná přes IntersectionObserver +
  Motion One stagger (§7.5)

### #6 — Daniel Haim / efekt
- URL: https://codepen.io/danielhaim/pen/azmBEPL
- Použití: **Sekce 7** nebo na privacy promise H2 (sekce 8)
- Status: čeká na user popis (Q3 §15)

## 15. Otevřené otázky pro tebe

Tyto věci ti nemůžu domyslet bez tvého inputu — odpověz a já je
zapíšu zpátky do této doc:

### Q1 — Co konkrétně dělá VoXelo hero (codepen #1)?
> Mouse-tracking glow? Particle field? 3D tilt na hover? Scroll-driven
> gradient? Static layout? Klikni na pen, popiš 1-2 větami co tam je.

### Q2 — Co dělá Giomgio efekt (codepen #4)?
> Distortion liquid? Parallax tilt? WebGL shader? Particle?
> Typography wave?

### Q3 — Co dělá Daniel Haim efekt (codepen #6)?
> Letter-by-letter reveal? Masked text? Glitch? Typewriter?
> Něco jiného?

### Q4 — Privacy + Terms produkční text
> Iubendu nechceš (chápu). Cesty:
>
> a) **Custom napsaný + advokát review** — ~10-25k Kč jednorázově
>    + 1× ročně refresh. Pošlu ti osnovu, ty zaplatíš advokátovi
>    finální revizi.
> b) **Self-written without lawyer** — risk ale legitimní pro V1
>    pilot. Uděláme si Privacy + Terms vlastním stylem, doplníme
>    všechno co GDPR + Apple §5.1.1 vyžaduje, a pak před prvním
>    velkým klientem dáme advokátovi review.
> c) **Open-source šablona** (např. github.com/aviadmini/privacy-policy-template)
>    s našimi hodnotami doplněnými.
>
> **Která cesta?**

### Q5 — Apple Developer Team ID
> Plánuješ kupovat Apple Developer Program ($99/rok)? Bez něj:
> - AASA placeholder zůstane TEAMID
> - App Store badge bude pointovat na placeholder ne real itms-apps
> - TestFlight nemůžeme ship
>
> **Pokud ano, kdy?** (urgency timing)

### Q6 — Reálné iOS screenshoty
> Zatím všechno placeholder. Pro V4 (codepen integrace) potřebujeme
> aspoň 6 reálných screenshotů (check-in, sessions list, session detail,
> coach board today, readiness card, members).
>
> **Kdy budou hotové?** Po finální UX validaci, ale chci timing.

### Q7 — Domain ownership
> Doménu `melveo.app` máš zaregistrovanou a v Cloudflare zone? Pokud
> ne, musíme registrovat (cca $20/rok).

### Q8 — Analytics tool preference
> Plausible self-hosted, Cloudflare Web Analytics zdarma, nebo žádný?
> Default plán: **Cloudflare Web Analytics** (free, privacy-friendly,
> už máme CF account).

### Q9 — Demo video / motion content
> Chceš mít na hero / někde produkční demo video? V1 ne. V2 ano?

### Q10 — Polar / Apple Health logos
> Můžeme na sekci wellness použít logo Apple Health + Polar
> (s upozorněním o "podporujeme")? Apple guidelines mají rules
> o použití "Works with Apple Health" certifikace — bez certifikace
> nemůžeme oficiální badge použít.

### Q11 — Tisk / brand assets
> Logotyp existuje? Aktuálně používáme jen wordmark "melveo" v Inter.
> Plánuješ vlastní logo / mark?

### Q12 — Sound / audio
> Hover sound efekty (raycast má), background hum atd.? V1 ne, ale
> ptám se preventivně.

### Q13 — Calendly / booking widget
> Sekce "Pilot pro klub" má aktuálně mailto. Chceš tam Cal.com /
> Calendly embed pro auto-book demo callu? V1 jednoduché mailto je
> OK (žádné 3rd-party JS), ale řekni jestli budeš chtít.

### Q14 — EN verze timeline
> V1 = jen Czech. V2 = Czech + English. Kdy V2?

### Q15 — Pricing visibility
> Pilot 1 970 Kč / 30 dní — uvádět konkrétní cenu na landing, nebo
> nechat "ozveme se po enquiry"? Doporučuju **uvádět** — důvěryhodné,
> pre-qualifikuje leady. Ale tvůj call.

### Q16 — Testimoniály / social proof
> V1 nemáme. Až bude první pilot, použijeme citát coache? V2.

### Q17 — Cookie consent banner
> Bez 3rd-party cookies (žádné Google Analytics) ani GDPR-strict
> banner nepotřebujeme. Cloudflare Web Analytics nepoužívá cookies.
> Default plán: **bez banneru.** Souhlasíš?

### Q18 — Dark mode toggle
> Web bude dark-only force. Privacy/Terms pages mají light fallback.
> Toggle v UI? Default plán: **ne, force dark.** Souhlasíš?

## 16. Risks + mitigations

| Risk | Mitigation |
|------|-----------|
| Codepen efekty performance-heavy | Motion One + lazy-init via IntersectionObserver, fallback bez animace na reduced-motion |
| Apple zamítne app pro Privacy/Terms placeholder | Před TestFlight nahradíme — Q4 cesta |
| AASA cache propagation slow | `Cache-Control: no-cache` + force refresh script |
| Real screenshoty nejsou pro V4 | Placeholder gradient cards s feature copy — visual works i bez |
| User změní mind about hero rotating words | Změna copy → 1 commit, žádný code change kromě array |

## 17. Reference

- App repo plan stack: 174 → 175 → 176 → 177 → 178 → 179 → **180 (web stub)**
- Tato doc: `melveo-web/docs/PLAN.md`
- iOS Design tokens: `melveo-app/Melveo/Melveo/Design/Tokens/Colors.swift`
- App Store companion compliance: `melveo-app/scripts/ci/check_apple_companion_compliance.sh`
- Doc 174 (privacy contract): `melveo-app/docs/planning/174_v1_role_sections_final_contract.md`
- Apple Marketing & Identity Guidelines: https://developer.apple.com/app-store/marketing/guidelines/
- Apple AASA reference: https://developer.apple.com/documentation/xcode/supporting-associated-domains
- Motion One docs: https://motion.dev
- Astro 6 docs: https://docs.astro.build
- Tailwind 4 docs: https://tailwindcss.com/docs/v4-beta

## 18. Changelog

| Datum | Změna |
|-------|-------|
| 2026-04-29 | doc 178 web handoff vznikl |
| 2026-04-29 | doc 179 Privacy/Terms recommendation (Iubenda zamítnut) |
| 2026-04-30 | **Tato doc 180/PLAN vznikla** — komplexní plán proti fey/raycast DNA + 6 codepen referencí |
