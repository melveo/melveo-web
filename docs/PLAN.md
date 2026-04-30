# melveo-web — komplexní plán (verze z 2026-04-30, rev. 3)

> Living document. Žije s kódem (`melveo-web/docs/PLAN.md`) a je
> referencovaný z app repu jako `melveo-app/docs/planning/180_melveo_web_plan.md`.
>
> Updatuj pokaždé, když rozhodneš o něčem novém z této doc, ať
> následující session má fresh context.
>
> **Rev. 2 (2026-04-30):** user odpověděl na všech 18 otázek + dodal
> screenshot VoXelo pena (PRISM 3D scene) + zvolil cookie banner ref.
> Plán přepracován — Three.js hero, i18n cs/en, full analytics stack
> (GA + Meta + CF + GTM), self-written legal text per česká legislativa.
>
> **Rev. 3 (2026-04-30):** user dodal legal entity (QUIX Global s.r.o.,
> IČO 22466444, sídlo Praha 1) + DPO = hello@melveo.app + EN bude
> psát Claude + analytics IDs deferred + logo zůstává jen wordmark.
> Q19-Q23 vyřešeno; nová Q24 (plátce DPH?). Připraveno k V4 implementaci.

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
| Cloudflare Pages connect | ⏸ user nastavuje |
| Reálné iOS screenshoty | ⏸ user řekl: zatím nepotřeba |
| Apple Developer Team ID | ⏸ user koupí příští týden |
| **Legal entity** | ✓ QUIX Global s.r.o., IČO 22466444 (rev.3 Q19) |
| **Kontakt / DPO** | ✓ hello@melveo.app (rev.3 Q20) |
| **EN content authoring** | ✓ Claude píše obě verze (rev.3 Q21) |
| **Logo** | ✓ Jen wordmark "melveo", žádný symbol (rev.3 Q23) |
| Privacy + Terms produkční text | 🔨 Já napíšu (V4 critical) |
| i18n cs + en | ⏸ V4 priorita |
| Three.js hero (PRISM-style 3D scene) | ⏸ V4 |
| Cookie consent banner | ⏸ V4 — Aaron Iker reference |
| Analytics: CF Web Analytics aktivní; GA/Meta/GTM IDs deferred | ⏸ V4 ship bez tags, container ready (rev.3 Q22) |
| DIČ + plátce DPH | ⏸ Q24 nový — TBD |

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

### 7.2. Hero base layout — PRISM-style 3D scéna (codepen #1 VoXelo) ✓

**Zdroj:** https://codepen.io/VoXelo/pen/ogbKQOy
**User reference:** screenshot PRISM landingu — pitch-black, 5
floating iridescent octahedrons, centrovaný glow wordmark.

**Implementační směr — Three.js scéna:**

```ts
// src/scripts/hero-scene.ts
import * as THREE from "three";

const canvas = document.querySelector("#hero-canvas") as HTMLCanvasElement;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 0.1, 100);
camera.position.z = 8;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);

// 4-6 floating shapes
const shapes: THREE.Mesh[] = [];
const geometries = [
  new THREE.OctahedronGeometry(0.8, 0),
  new THREE.IcosahedronGeometry(0.7, 0),
  new THREE.ConeGeometry(0.5, 1.2, 4),  // tetrahedron-ish
];

// Iridescent material — cyan/blue lean
const material = new THREE.MeshPhysicalMaterial({
  iridescence: 1.0,
  iridescenceIOR: 1.3,
  iridescenceThicknessRange: [100, 800],
  metalness: 0.1,
  roughness: 0.4,
  clearcoat: 1.0,
  color: 0x00f0ff,  // brand cyan tint
});

// Position shapes around hero, away from center text
const positions = [
  [-4.5, 1.8, -2], [4.5, 2.0, -2.5],
  [-3.5, -2.5, -3], [4.0, -2.8, -1.5],
  [0, 3.5, -4],
];
positions.forEach((pos, i) => {
  const mesh = new THREE.Mesh(geometries[i % geometries.length], material);
  mesh.position.set(...pos);
  scene.add(mesh);
  shapes.push(mesh);
});

// Lights — single soft directional + ambient
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const dir = new THREE.DirectionalLight(0xcdf7fb, 1.5);  // cyan tint
dir.position.set(5, 10, 5);
scene.add(dir);

// Animate — slow rotation + mouse parallax
let mouseX = 0, mouseY = 0;
addEventListener("mousemove", (e) => {
  mouseX = (e.clientX / innerWidth) * 2 - 1;
  mouseY = (e.clientY / innerHeight) * 2 - 1;
});

function animate() {
  shapes.forEach((s, i) => {
    s.rotation.x += 0.003 * (i % 2 === 0 ? 1 : -1);
    s.rotation.y += 0.004 * (i % 2 === 0 ? -1 : 1);
  });
  scene.rotation.y += (mouseX * 0.05 - scene.rotation.y) * 0.05;
  scene.rotation.x += (mouseY * 0.03 - scene.rotation.x) * 0.05;
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
```

**Bundle budget:** Three.js core ~150kB gzip. **Lazy-load** scene
only after hero is visible (defer past LCP). SSR fallback = 5
static SVG octahedrons positioned with CSS — visible during load.

**Reduced motion fallback:** scene replaced with static SVG
shapes + slight CSS keyframe drift (very subtle, 0.5° rotation).

**Mobile:** scene runs ale na mobilu shapes jsou menší + jen 3
shapes (perf budget pro mobile WebGL).

**Status:** ✓ specifikováno, V4 implementace.

---

### 7.2.1. Hero centered wordmark + glow halo

Zachová V3 layout — wordmark centered v hero, glow halo za textem,
CTA pod. Three.js scéna sedí **za** wordmarkem (z-index: 0;
wordmark z-index: 10).

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

### 7.4. Glass orb + morphující text (codepen #4 giomgio) ✓

**Zdroj:** https://codepen.io/giomgio/pen/abxGyQX
**User popis:** "kotule co se mění" — orb se měnícím textem.

**V4 implementace — CSS-only orb:**

```html
<section class="orb-stage">
  <div class="orb">
    <div class="orb-text" data-rotate-text>
      Pro hráče.
    </div>
  </div>
</section>
```

```css
.orb-stage {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 80vh;
  background: var(--color-bg-canvas);
}

.orb {
  width: clamp(280px, 50vw, 600px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: radial-gradient(
    circle at 30% 30%,
    rgba(0, 240, 255, 0.4),
    rgba(0, 240, 255, 0.1) 40%,
    rgba(15, 25, 50, 0.95) 80%
  );
  backdrop-filter: blur(40px);
  box-shadow:
    inset 0 0 80px rgba(0, 240, 255, 0.3),
    0 0 120px rgba(0, 240, 255, 0.4);
  display: grid;
  place-items: center;
}

.orb-text {
  font-size: clamp(1.5rem, 3vw, 3rem);
  font-weight: 700;
  color: var(--color-text-primary);
  transition: opacity 0.4s ease, transform 0.4s ease;
}
```

```ts
import { animate } from "motion";

const phrases = ["Pro hráče.", "Pro trenéra.", "Pro klub."];
const el = document.querySelector("[data-rotate-text]")!;
let idx = 0;

setInterval(async () => {
  await animate(el, { opacity: [1, 0], y: [0, -20] }, { duration: 0.4 }).finished;
  idx = (idx + 1) % phrases.length;
  el.textContent = phrases[idx];
  await animate(el, { opacity: [0, 1], y: [20, 0] }, { duration: 0.4 }).finished;
}, 3200);
```

**V4.1 upgrade (pokud V4 vypadá slabě):** Three.js refractive
glass sphere shader. Defer.

**Status:** ✓ V4 implementace ready.

---

### 7.5. Interesting effect placeholder

V plánu byla tato sekce pro neznámé giomgio — teď je vyřešeno
v §7.4. Tato sekce je placeholder pro budoucí jiné efekty.

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

### 7.6. Daniel Haim text reveal (codepen #6) ✓

**Zdroj:** https://codepen.io/danielhaim/pen/azmBEPL
**User confirmation:** chce ten samý efekt z toho pena (masked
letter-by-letter reveal je daniel haim signature pattern).

**Implementace — SplitType.js + Motion One:**

```ts
import SplitType from "split-type";
import { animate, stagger } from "motion";

const heading = document.querySelector("[data-text-reveal]");
const split = new SplitType(heading, { types: "chars" });

const obs = new IntersectionObserver(([entry]) => {
  if (entry.isIntersecting) {
    animate(
      split.chars,
      { y: ["100%", "0%"], opacity: [0, 1] },
      { duration: 0.6, delay: stagger(0.025) }
    );
    obs.disconnect();
  }
}, { threshold: 0.4 });

obs.observe(heading);
```

```css
[data-text-reveal] {
  overflow: hidden;
}
[data-text-reveal] .char {
  display: inline-block;
}
```

**Umístění:** privacy promise sekce 7 — H2 "Trenér nikdy nevidí
syrová čísla hráče." se odhaluje letter-by-letter ze dna při
scrollu.

**Bundle:** SplitType ~3kB gzip. Motion One už loaded.

**Status:** ✓ V4 implementace ready.

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

### 7.8. Cookie consent banner (codepen #7 Aaron Iker) ✓

**Zdroj:** https://codepen.io/aaroniker/pen/eYEqOrp
**User decision:** Q17 — chce tento styl

**Implementace — vanilla JS + Astro component:**

```ts
// src/scripts/consent.ts
type ConsentState = {
  necessary: true;       // always
  analytics: boolean;
  marketing: boolean;
  version: number;
  timestamp: string;
};

const STORAGE_KEY = "melveo:consent";
const CURRENT_VERSION = 1;

export function loadConsent(): ConsentState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== CURRENT_VERSION) return null;
    return parsed;
  } catch { return null; }
}

export function saveConsent(state: Omit<ConsentState, "version" | "timestamp" | "necessary">) {
  const full: ConsentState = {
    necessary: true,
    ...state,
    version: CURRENT_VERSION,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(full));
  window.dispatchEvent(new CustomEvent("melveo-consent-change", { detail: full }));

  // Update GTM consent state per Google Consent Mode v2
  (window as any).dataLayer = (window as any).dataLayer || [];
  (window as any).gtag = (window as any).gtag || function() { (window as any).dataLayer.push(arguments); };
  (window as any).gtag("consent", "update", {
    ad_storage: state.marketing ? "granted" : "denied",
    ad_user_data: state.marketing ? "granted" : "denied",
    ad_personalization: state.marketing ? "granted" : "denied",
    analytics_storage: state.analytics ? "granted" : "denied",
  });
}
```

```astro
---
// src/components/CookieBanner.astro
---
<div id="cookie-banner" data-banner-state="hidden">
  <div class="banner-shell">
    <div class="banner-icon">🍪</div>
    <div class="banner-body">
      <h3>Cookies</h3>
      <p>
        Používáme cookies pro statistiky a vylepšení stránky.
        <a href="/privacy">Více v zásadách soukromí</a>.
      </p>
    </div>
    <div class="banner-actions">
      <button data-consent="reject">Jen nutné</button>
      <button data-consent="customize">Nastavit</button>
      <button data-consent="accept" class="primary">Přijmout vše</button>
    </div>
  </div>
</div>

<script>
  import { loadConsent, saveConsent } from "../scripts/consent";

  const banner = document.querySelector<HTMLDivElement>("#cookie-banner")!;
  const state = loadConsent();

  if (!state) {
    requestIdleCallback(() => {
      banner.dataset.bannerState = "visible";
    });
  }

  banner.addEventListener("click", (e) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-consent]");
    if (!btn) return;
    const action = btn.dataset.consent;
    if (action === "accept") saveConsent({ analytics: true, marketing: true });
    else if (action === "reject") saveConsent({ analytics: false, marketing: false });
    else if (action === "customize") {
      // open detail panel — TBD V4
      return;
    }
    banner.dataset.bannerState = "hidden";
  });
</script>

<style>
  /* Aaron Iker style: bottom slide-up sheet, blur backdrop */
  #cookie-banner {
    position: fixed;
    inset: auto 0 1rem 0;
    margin: 0 auto;
    max-width: min(32rem, calc(100% - 2rem));
    z-index: 100;
    transform: translateY(120%);
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }
  #cookie-banner[data-banner-state="visible"] { transform: translateY(0); }

  .banner-shell {
    background: rgba(15, 17, 22, 0.85);
    backdrop-filter: blur(24px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 1.25rem;
    padding: 1.25rem 1.5rem;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas: "icon body" "actions actions";
    gap: 0.75rem 1rem;
    box-shadow: 0 24px 60px -12px rgba(0, 0, 0, 0.6);
  }
  /* … */
</style>
```

**Compliance checklist:**

- ✓ Banner se zobrazí **před** nahráním GA / Meta tagů (default
  consent state = denied)
- ✓ "Reject" stejně dostupný jako "Accept" (per EDPB 03/2022)
- ✓ Bez pre-checked tickboxů (zákon 480/2004 § 89)
- ✓ Granular kontrola přes Customize panel
- ✓ Re-prompt po `version` bump (např. když přidáme novou
  marketing platformu)

**Status:** 🔨 V4 critical infra — bez něj nemůžeme spustit GA.

### 7.9. Three.js performance budget

Three.js scéna v hero je největší JS asset. Pravidla:

- ✓ `import` přes dynamic import — `await import('three')`
  splitne do separate chunk
- ✓ Lazy-init až po `DOMContentLoaded` + IntersectionObserver
  detection že hero je visible
- ✓ Pause `requestAnimationFrame` když tab je hidden
  (`document.visibilityState === "hidden"`)
- ✓ `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))` —
  cap retina rendering
- ✓ Mobile detect: méně shapes (3 vs 6) + lower geometry detail
- ✓ Reduced motion: scéna disabled, fallback SVG static

## 8. Tech stack — finální

| Vrstva | Volba | Důvod |
|--------|-------|-------|
| **SSG framework** | Astro 6 | Best static-first, MDX, built-in i18n |
| **i18n** | Astro i18n + Content Collections | `cs` (default) + `en`, type-safe content loading |
| **Styling** | Tailwind 4 (via @tailwindcss/vite) | Design tokens v `@theme` |
| **Type system** | TypeScript strict | |
| **Package manager** | Bun | Rychlejší |
| **Animations** | Motion One (`motion`) | 5kB, modern API |
| **3D scéna (hero)** | Three.js R163+ | PRISM-style hero shapes (Q1) |
| **Text split** | SplitType.js | Daniel Haim letter-by-letter reveal (Q3) |
| **Icons** | Lucide (`lucide-static` SVG) | Open-source |
| **Fonts** | Inter (variable, Latin Extended) | Czech diakritika support |
| **Hosting** | Cloudflare Pages | Free, instant, custom domain ✓ |
| **DNS** | Cloudflare zone `melveo.app` | ✓ user confirmed Q7 |
| **Analytics — primary** | Cloudflare Web Analytics | Cookieless, mimo consent |
| **Analytics — full stack** | Google Tag Manager (single tag) | Q8 — řídí GA4 + Meta Pixel + budoucí pixely |
| **Tag management** | GTM container ID `GTM-XXXXXXX` | TBD po user setup |
| **Analytics tags řízené z GTM** | GA4 + Meta Pixel | Vyžaduje cookie consent (Q17) |
| **Cookie consent** | Custom (Aaron Iker style) | Q17 — vanilla JS + localStorage state |
| **Forms** | `mailto:` link | V1 — žádný backend |
| **Sitemap** | `@astrojs/sitemap` | Auto-generuje + hreflang |
| **Robots** | Manual `public/robots.txt` | |
| **CMS / blog** | — | Žádné v V1 |

### 8.1. Dependencies budget

```json
{
  "dependencies": {
    "@astrojs/check": "^0.9.4",
    "@astrojs/sitemap": "^4.0.0",
    "@tailwindcss/vite": "^4.2.4",
    "astro": "^6.1.10",
    "motion": "^11.0.0",
    "split-type": "^0.3.4",
    "tailwindcss": "^4.2.4",
    "three": "^0.165.0",
    "typescript": "^5.9.3"
  },
  "devDependencies": {
    "@types/three": "^0.165.0"
  }
}
```

**Total install size cíl:** < 100 MB node_modules
(Three.js samotný je ~25MB ale tree-shake do <150kB gzip)

**Runtime JS budget (per route):**

| Route | Critical CSS | Inline JS | Deferred JS | Total gzip |
|-------|-------------|-----------|-------------|------------|
| `/` (landing) | 18kB | 5kB | Three.js 150kB + Motion 5kB + SplitType 3kB | ~180kB |
| `/privacy`, `/terms` | 12kB | 0kB | 0kB | ~12kB |
| `/checkout/success` | 14kB | 2kB | 0kB | ~16kB |

Critical path (LCP): `<32kB` total CSS+JS — Three.js scéna nahraná
**po LCP** přes lazy-init.

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

### #1 — VoXelo / hero base ✓ RESOLVED
- URL: https://codepen.io/VoXelo/pen/ogbKQOy
- Použití: **Hero sekce** (sekce 1)
- User popis: PRISM scéna — pitch black, 5 floating iridescent 3D
  shapes (octahedrons), centrovaný wordmark s glow halo, 2 buttony.
  Screenshot dodán.
- Implementace: Three.js scéna s 4-6 shapes v cyan/blue lean
  iridescent material + slow rotation + mouse parallax.
  Detaily §7.2.

### #2 — Josh Cummings / měnící se text ✓ RESOLVED
- URL: https://codepen.io/joshcummingsdesign/pen/jWLpQv
- Použití: **Hero rotující slovo** v H1 (sekce 1)
- Implementace: Motion One y/opacity crossfade, viz §7.1.

### #3 — Ahmad Awais / spojující elementy ✓ RESOLVED
- URL: https://codepen.io/ahmadawais/pen/JodBmX
- Použití: **Sekce 3** — visual punctuation
- Implementace: SVG gooey filter, viz §7.3.

### #4 — Giomgio / efekt ✓ RESOLVED
- URL: https://codepen.io/giomgio/pen/abxGyQX
- Použití: **Sekce 5** mezi wellness a sessions
- User popis: glass orb s morphujícím textem ("kotule co se mění")
- Implementace: V4 = CSS radial gradient orb + Motion One text
  crossfade. V4.1 (pokud slabé) = Three.js refractive sphere
  shader. Viz §7.4.

### #5 — Kevin Gutowski / image grid morph ✓ RESOLVED
- URL: https://codepen.io/KevinGutowski/pen/QwNZYzL
- Použití: **Sekce 2** — jeden screenshot → grid feature kartiček
- User confirmation: "místo fotek funkce co to umí všechno"
- Implementace: IntersectionObserver + Motion One stagger reveal,
  6 abstract feature kartiček (žádné photos), §7.5.

### #6 — Daniel Haim / text effect ✓ RESOLVED
- URL: https://codepen.io/danielhaim/pen/azmBEPL
- Použití: **Sekce 7 / privacy promise H2**
- User confirmation: "takový jaký je na danielhaim/azmBEPL" (chce
  ten samý letter-by-letter masked reveal)
- Implementace: SplitType.js + per-character delay mask reveal
  on IntersectionObserver entry, §7.6.

### #7 — Aaron Iker / cookie banner ✓ RESOLVED (NEW)
- URL: https://codepen.io/aaroniker/pen/eYEqOrp
- Použití: **Cookie consent banner** (V4 critical)
- Implementace: Vanilla JS + localStorage state machine +
  Astro component. Detaily §7.8.

## 15. Q&A — odpovědi user (2026-04-30)

### Q1 — VoXelo hero (codepen #1) ✓ RESOLVED

**User dodal screenshot pena PRISM (CodePen Preview):**

> Pitch-black canvas. ~5 floating 3D shapes (triangular bipyramids /
> octahedrons) v iridescent gradient (růžová → modrá → fialová holo).
> Centrovaný velký bold wordmark "PRISM" s bílým radial glow halo
> za textem. Pod wordmarkem subtitle "SPECTRUM OF LIGHT" rozpustlý
> letterspacing. Pod tím 2 tlačítka — "Discover" (subtle outline) +
> "Join Now" (filled tmavé).

**Implementační směr pro Melveo:**

- 3D scéna přes **Three.js** (v R163+) nebo **Spline export**
- 4-6 floating geometric shapes — ne literal prismy (to je PRISM
  brand), místo toho:
  - Octahedron / cone / capsule / icosahedron — abstract sport vibe
  - Iridescent material — ale **lean cyan/blue** ne full rainbow,
    aby seděl na Melveo brand cyan (`#00F0FF`)
  - Subtle slow rotation + drift po elliptických drahách
- Centrovaný **"melveo"** wordmark (Inter, lower-case) s halo glow
- Eyebrow + 2 buttony (App Store badge + "Pilot pro klub →")
- Mouse-parallax na shapes (velmi jemný, ~5° tilt na pohyb myši)

**Tech budget:** Three.js cca 80kB gzip. Bundle se split-loadne
mimo critical path; SSR vyrenderuje fallback (statické SVG shapes).

**Status pro V4:** ✓ specifikováno, čeká na implementaci.

---

### Q2 — Giomgio efekt (codepen #4) ✓ RESOLVED

**User popis:**

> "jak je tam ta koukle a mění se ten text"

**Interpretace:** glass / liquid orb (sphere) v sekci, kolem které
se mění / morphují texty. Pravděpodobně:

- WebGL displacement shader na sféře (refractive glass)
- Text rotuje synchronně s rotací sféry
- Nebo orb je SVG circle s gradient + blur, text se cycluje pod ním

**Implementační směr:**

- Pro V4 vyrobím **CSS-only orb** (radial gradient + backdrop-filter
  blur) + Motion One text crossfade. Pokud to bude vypadat slabě
  proti originálu, V4.1 přidám Three.js sférický shader.
- Umístění: **sekce 5** (mezi wellness a sessions stages) jako
  visual punctuation s krátkým claim co se mění:
  - "Pro hráče." → "Pro trenéra." → "Pro klub."

**Status pro V4:** ✓ implementační plán, čeká na execution.

---

### Q3 — Daniel Haim efekt (codepen #6) ✓ RESOLVED

**User řekl:** "takový jaký je na codepen.io/danielhaim/pen/azmBEPL"
(self-reference — chce Daniel Haim's vlastní efekt z toho pena).

**Interpretace:** Daniel Haim je známý pro masked-reveal text efekty
(text se odhalí přes oktagonální / clip-path masku, často s SplitText
letter-by-letter timing).

**Implementační směr:**

- `mask-image: linear-gradient(...)` na text → animované přejíždí
  přes řádek
- Nebo **SplitType.js** + per-character delay (10ms stagger) ze dna
- Trigger na IntersectionObserver entry

**Umístění:** **sekce 7 / privacy promise H2** —
"Trenér nikdy nevidí syrová čísla hráče." se odhalí letter-by-letter
když scrolluješ k němu.

**Status pro V4:** ✓ specifikováno.

---

### Q4 — Privacy + Terms ✓ RESOLVED

**User decision:** "Právě si ty, prosím tě, podívej se na zákoník
České republiky, podívej se na konkurenční weby a dle toho vytvoř."

**Path:** Self-written od Claude per česká legislativa + competitor
analysis. Bez advokát review v V1 — risk přijatý, vrátíme se k
review před prvním velkým enterprise klientem.

**Research scope (action item):**

| Source | Co odsud lift |
|--------|---------------|
| Zákon č. 110/2019 Sb., o zpracování osobních údajů | České lokalizační požadavky |
| Nařízení EU 2016/679 (GDPR) | Art. 13/14 transparency, Art. 15-22 rights |
| Zákon č. 89/2012 Sb., občanský zákoník | Smluvní ustanovení (terms) |
| Zákon č. 480/2004 Sb. o některých službách informační společnosti | Cookies + e-mail komerční sdělení |
| Apple App Store Review Guideline 5.1.1 | Privacy Policy URL requirement |
| Apple App Store Review Guideline 3.1.3(f) | Companion app commerce stance |
| **Konkurence:** mews.com/legal | Český SaaS, multilang, premium |
| **Konkurence:** productboard.com/legal | Český SaaS |
| **Konkurence:** smartlook.com/legal | Český SaaS |
| **Konkurence:** notion.com/legal | Globální benchmark |
| **Konkurence:** linear.app/legal | Globální benchmark |

**Akční plán:**

1. Já udělám research (fetch konkurenčních legal pages přes WebFetch
   kde to projde, fallback na popis přes vyhledávání)
2. Napíšu Privacy v cs (Article 13 GDPR komplet) + en
3. Napíšu Terms v cs + en (model 1 licence = 1 team_season,
   pilot pricing, refund guarantee)
4. Doplním cookie list (CF Web Analytics, GA, Meta Pixel — viz Q8)
5. Před produkcí uložím draft do `melveo-web/src/pages/{cs,en}/{privacy,terms}.astro`
6. Před prvním velkým klientem (~ $5k+ kontrakt) dáme advokátovi
   review — to je kompromis mezi rychlostí a risk

**Status:** 🔨 in progress, V4.

---

### Q5 — Apple Developer Program ✓ RESOLVED

**User answer:** "ano, plánuji koupit, předpokládám příští týden"

**Implications:**

- Příští týden (2026-05-06 ± 2 dny) můžu replace `TEAMID` v AASA
- TestFlight se rozjede po prvním Xcode signed buildu
- App Store listing podmíněn schválením App Store Connect (~1-3 dny review)
- Real `itms-apps://` URL nahradí placeholder anchor po listing

**Status:** ⏸ čeká na user akci (Apple Developer membership purchase).

---

### Q6 — Reálné iOS screenshoty ✓ RESOLVED

**User answer:** "zatím asi nepotřeba"

**Implications pro V4:**

- Hero PRISM-style scéna používá 3D shapes (ne screenshoty)
- Stages 4 + 6 (wellness + sessions): místo screenshot mockup použijeme
  **animovanou ilustraci** funkcionality (např. CSS-rendered fake
  iPhone UI s readiness card komponentou)
- Image grid morph (Kevin Gutowski sekce 2): místo fotek **abstraktní
  feature kartičky** s ikonou + claim
- Až user dodá real screenshoty (pravděpodobně po pilotech), V4.x
  swapne fake illustrations za real assets

**Status:** ⏸ deferred to V4.x post-pilot, V4 ships bez nich.

---

### Q7 — Domain ✓ RESOLVED

**User answer:** "doména melveo.app je registrovaná pod Cloudflare"

**Implications:**

- Cloudflare zone `melveo.app` exists
- Zone už hostuje `updates.melveo.app` (Resend)
- Můžeme přidat A / CNAME pro Pages bez registrátorského kroku
- DNS změny instant (CF zone)

**Status:** ✓ ready, čeká jen na CF Pages connect.

---

### Q8 — Analytics ✓ RESOLVED

**User answer:** "Cloudflare Web Analytics + můžeme tam dát Google
Tagy, Meta Tagy, tak Google Analytics, prostě všechno"

**Implications:**

- 4 vrstvy analytics: **CF Web Analytics + GA4 + Google Tag Manager
  + Meta Pixel**
- GA + Meta Pixel **vyžaduje cookie consent** podle GDPR Art. 6 + ČR
  zák. 480/2004 (e-Privacy directive transposition)
- Cookie banner z Q17 (Aaron Iker reference) je critical infra,
  ne nice-to-have
- GTM jako single tag, který injectne ostatní (best practice — 1 sketch
  tag v `<head>`, vše ostatní řízeno z GTM dashboardu)

**Stack pro V4:**

```
GTM container (gtm.js)                    ← single tag in <head>
  └─> GA4 measurement ID                   ← config tag
  └─> Meta Pixel ID                        ← custom HTML
  └─> Conversion events (mailto click)     ← trigger
CF Web Analytics                           ← <script src="//static.cloudflareinsights.com/...">
                                              (cookieless, mimo consent)
```

**Cookie consent strategy:**

- **Necessary cookies (žádný consent needed):**
  - CF Web Analytics (cookieless beacon)
  - Astro view-transition state (sessionStorage)
- **Analytics cookies (consent required):**
  - GTM → GA4 (`_ga`, `_ga_*`, `_gid`)
  - Meta Pixel (`_fbp`, `_fbc`)
- **Marketing cookies (consent required):**
  - Reserved pro V2 (retargeting, ads)

Banner umožní 3 stavy: Accept All / Reject (jen necessary) /
Customize. Per česká úprava zákona 480/2004 § 89 musí být **opt-in
explicitní** (ne pre-checked).

**Implementation:** §7.8 níže.

**Status:** ⏸ V4 stack designed, čeká na implementation.

---

### Q9 — Demo video ✓ RESOLVED

**User answer:** "demo video asi teďka aktuálně nebude"

**Status:** ⏸ V2+ feature.

---

### Q10 — Apple Health / Polar logos ✓ RESOLVED

**User answer:** "zatím asi ne"

**Implications:** Wellness sekce použije generický icon (Lucide
`heart-pulse` nebo `activity`) místo brand logos. Bezpečnější
pro V1.

**Status:** ⏸ deferred.

---

### Q11 — Vlastní logo ✓ RESOLVED

**User answer:** "vlastní logo zatím nemáme"

**Implications:**

- V4 zůstane **wordmark "melveo"** v Inter Bold lowercase jako
  primary brand expression
- 3D hero shapes mohou suplovat "logo moment" (PRISM scéna ale
  bez konkrétního markeru)
- Favicon zatím rounded-square s monogramem "m" (✓ V3 done)

**Návrh ode mě:** mohli bychom v hero PRISM scéně mít **jeden
dominantní 3D shape** který se postupně etabluje jako Melveo mark
(např. cyan octahedron). Pokud to V4 fly, V5 může z něj vyrobit
opravdový logotyp. Je to non-binding.

**Status:** ✓ jen wordmark for now, design TBD.

---

### Q12 — Sound efekty ✓ RESOLVED

**User answer:** "sound efekty nepotřeba"

**Status:** ⏸ never.

---

### Q13 — Cal.com / Calendly ✓ RESOLVED

**User answer:** "Cal.com nepotřeba"

**Implications:** Pilot CTA zůstává mailto-link. Žádný 3rd-party
embed.

**Status:** ✓ mailto only.

---

### Q14 — EN verze ✓ RESOLVED

**User answer:** "Anglická verze. Chtělo by to udělat jak v
angličtině, tak v češtině, podle lokality."

**Implications — major change:**

- V4 ships **i18n** od začátku (ne až V2)
- Locale routing přes **Astro built-in i18n** (Astro 4+)
- Default locale: `cs`
- Secondary: `en`
- URL strategy: `/cs/*` + `/en/*`, root `/` redirectuje na
  detected locale (Accept-Language header)
- Locale switch v headeru: `cs` / `en` toggle

**Astro i18n config:**

```js
// astro.config.mjs
i18n: {
  defaultLocale: "cs",
  locales: ["cs", "en"],
  routing: {
    prefixDefaultLocale: false,  // / serves cs
    redirectToDefaultLocale: false,
  },
}
```

**Content split:**

```
src/content/
  ├── cs/
  │   ├── hero.json
  │   ├── stages.json
  │   ├── privacy.md
  │   └── terms.md
  └── en/
      ├── hero.json
      ├── stages.json
      ├── privacy.md
      └── terms.md
```

Pro `/`, `/privacy`, `/terms` použijeme Astro Content Collections
type-safe loading. Components dostávají `lang` prop.

**Hreflang tags v `<head>`:**

```html
<link rel="alternate" hreflang="cs" href="https://melveo.app/cs/" />
<link rel="alternate" hreflang="en" href="https://melveo.app/en/" />
<link rel="alternate" hreflang="x-default" href="https://melveo.app/" />
```

**Status:** 🔨 V4 priorita.

---

### Q15 — Pricing visibility ✓ RESOLVED

**User answer:** "pricing bych tam ještě asi nedával"

**Implications:** Žádná konkrétní cena na landing. Pilot CTA
říká jen "Pilot pro klub" + mailto. Reálná cena vyplyne až v
prvním e-mailu.

**Status:** ✓ pricing hidden V1.

---

### Q16 — Testimoniály ✓ RESOLVED

**User answer:** "testimonialy zatím ne"

**Status:** ⏸ V2+ post-first-pilot.

---

### Q17 — Cookie banner ✓ RESOLVED

**User answer + reference:** "https://codepen.io/aaroniker/pen/eYEqOrp"

**Aaron Iker style** je obvykle clean modern UI s smooth
slide-in/out, často:

- Bottom slide-up sheet (mobile-first pattern)
- Subtle shadow + blur backdrop
- 2-3 buttony: Accept / Reject / Customize
- Ikona cookie / shield vlevo

**Implementační stack:**

- Vanilla JS (žádná lib jako Cookiebot — náš consent-store je trivial)
- localStorage key `melveo:consent` s JSON value:

  ```json
  {
    "necessary": true,
    "analytics": true | false,
    "marketing": true | false,
    "version": 1,
    "timestamp": "2026-04-30T12:34:56Z"
  }
  ```

- GTM `consent_state` event triggered po user choice
- Banner re-shown jednou ročně nebo při změně privacy policy
  (`version` bump)
- Granular customize panel (3 toggles: Necessary always-on,
  Analytics, Marketing)

**Komponenta:** `src/components/CookieBanner.astro` —
client-side script, lazy-loaded after first paint.

**Compliance:**

- ✓ Opt-in (ne pre-checked) per CZ zák. 480/2004
- ✓ Equally easy reject (per GDPR EDPB guidance 03/2022)
- ✓ Granular per category
- ✓ Consent reusable + auditable přes localStorage timestamp
- ✓ Withdraw consent kdykoliv (footer link "Cookie nastavení")

**Status:** 🔨 V4 critical (blokuje GA + Meta).

---

### Q18 — Dark mode toggle ✓ RESOLVED

**User answer:** "Ano, dark mode, souhlasím"

**Implications:** Force dark globally na landing. Privacy/Terms
zůstávají dark też (pro consistency). Toggle není potřeba.

**Status:** ✓ force dark, no toggle.

---

### GitHub repo connect ✓ NOTED

**User answer:** "github je nastevn - nastavuje se"

**Status:** Repo `matk0shub/melveo-web` exists ✓ a je private.
Cloudflare Pages connect je manual UI step v CF dashboardu —
předpokládám user dokončí během dne.

## 16. Risks + mitigations

| Risk | Mitigation |
|------|-----------|
| Codepen efekty performance-heavy | Motion One + lazy-init via IntersectionObserver, fallback bez animace na reduced-motion |
| Apple zamítne app pro Privacy/Terms placeholder | Před TestFlight nahradíme — Q4 cesta |
| AASA cache propagation slow | `Cache-Control: no-cache` + force refresh script |
| Real screenshoty nejsou pro V4 | Placeholder gradient cards s feature copy — visual works i bez |
| User změní mind about hero rotating words | Změna copy → 1 commit, žádný code change kromě array |

## 16.5. i18n routing & content strategy

### 16.5.1. URL strategy

```
melveo.app/                     ← redirect na detected locale
melveo.app/cs/                  ← Czech home (default, primary)
melveo.app/en/                  ← English home
melveo.app/cs/privacy           ← Czech privacy
melveo.app/en/privacy           ← English privacy
melveo.app/cs/terms             ← Czech terms
melveo.app/en/terms             ← English terms
melveo.app/cs/checkout/success  ← localized post-Stripe
melveo.app/en/checkout/success
```

Astro config:

```js
i18n: {
  defaultLocale: "cs",
  locales: ["cs", "en"],
  routing: {
    prefixDefaultLocale: true,    // /cs is canonical, / redirects
    redirectToDefaultLocale: false,  // respect Accept-Language at /
  },
}
```

Root `/` redirect je middleware (Cloudflare Pages Functions nebo
client-side script) co čte `navigator.languages` a redirectuje
na `/cs/` nebo `/en/`. Bez middleware fallback `meta refresh`
na `/cs/`.

### 16.5.2. Content collections

Místo hardcoded copy v `.astro` souborech — všechen text v JSON +
MDX content collections, type-safe loading:

```
src/content/
  config.ts                      ← schema definitions (Zod)
  hero/
    cs.json                      ← hero copy CS
    en.json                      ← hero copy EN
  stages/
    cs.json
    en.json
  privacy/
    cs.md                        ← long-form
    en.md
  terms/
    cs.md
    en.md
```

```ts
// src/content/config.ts
import { defineCollection, z } from "astro:content";

const heroSchema = z.object({
  eyebrow: z.string(),
  rotatingWords: z.array(z.string()).min(3),
  headlinePrefix: z.string(),
  subline: z.string(),
  appStoreCta: z.string(),
  pilotCta: z.string(),
});

export const collections = {
  hero: defineCollection({ type: "data", schema: heroSchema }),
  // ...
};
```

### 16.5.3. Locale switcher

Header pravý roh: `cs / en` toggle. Click → preserve current path,
swap locale prefix.

```astro
---
const currentPath = Astro.url.pathname;
const otherLocale = Astro.currentLocale === "cs" ? "en" : "cs";
const swappedPath = currentPath.replace(`/${Astro.currentLocale}/`, `/${otherLocale}/`);
---
<a href={swappedPath}>{otherLocale.toUpperCase()}</a>
```

## 16.6. Privacy + Terms — content plan & research

User řekl: napsat samostatně per česká legislativa + competitor
research, bez advokát review v V1 (§15.5 Q4).

### 16.6.1. Czech legal stack

**Primary law:**

1. **Nařízení EU 2016/679 (GDPR)** — primary privacy obligation
2. **Zákon č. 110/2019 Sb.** — implementing GDPR v ČR; §11 (děti
   pod 15 let — relevantní pro mládežnické kluby)
3. **Zákon č. 89/2012 Sb. (občanský zákoník)** — smluvní právo,
   spotřebitelské smlouvy §1810-1867 (kluby = nepodnikatelské
   spolky někdy = consumer protection apply!)
4. **Zákon č. 480/2004 Sb.** — informační společnost: e-mail
   souhlas (§7) + cookies (§89 odst. 3)
5. **Zákon č. 634/1992 Sb. (zákon o ochraně spotřebitele)** —
   reklamace, refund

**Compliance výstupy v textu:**

- ✓ **Provozovatel:** QUIX Global s.r.o., IČO 22466444, sídlo
  Příčná 1892/4, 110 00 Praha 1, zapsaná u MS v Praze, oddíl C,
  vložka 416432 (datová schránka g7v78rx)
- ✓ **Kontakt:** hello@melveo.app (jediný kontaktní bod, plní
  funkci DPO i běžného supportu)
- ✓ **Plátce DPH:** TBD (Q24)
- Účel zpracování (App functionality + analytics + marketing
  per consent)
- Právní základ per kategorie (Art. 6 GDPR — smlouva, oprávněný
  zájem, souhlas)
- Doba uchování (per kategorie)
- Práva subjektu (Art. 15-22): přístup, oprava, výmaz, omezení,
  přenositelnost, námitka, automatized decision
- Adresát stížnosti: **Úřad pro ochranu osobních údajů**
  (Pplk. Sochora 27, 170 00 Praha 7, www.uoou.cz)
- Cookie list + účel (po implementaci §7.8 banner)
- Apple §5.1.1 — privacy policy URL link v App Store Connect

### 16.6.1.1. Boilerplate header pro Privacy + Terms

```
Provozovatel webu a aplikace Melveo:

QUIX Global s.r.o.
IČO: 22466444
Sídlo: Příčná 1892/4, Nové Město, 110 00 Praha 1
Datová schránka: g7v78rx
Spisová značka: C 416432 vedená u Městského soudu v Praze

Kontakt: hello@melveo.app
```

(Stejný blok v cs i en, jen labels translated.)

### 16.6.2. Competitor benchmarks (research targets)

| Web | URL | Co odsud lift |
|-----|-----|---------------|
| Mews | `mews.com/legal` | Český SaaS, multilang, EU-strict |
| Productboard | `productboard.com/privacy` | Český SaaS, US/EU split |
| Smartlook | `smartlook.com/privacy-policy/` | Český, B2B |
| Notion | `notion.com/privacy` | Globální benchmark |
| Linear | `linear.app/legal/privacy` | Modern indie SaaS |
| Raycast | `raycast.com/privacy` | Companion-app vibe |
| Stripe | `stripe.com/privacy` | Best-in-class wording |

### 16.6.3. Action plan pro V4

```
[ ] D-day  — research session: WebFetch (kde projde) /
             popis přes vyhledávání pro 7 konkurenčních
             legal pages
[ ] D+1    — výtah common pattern + Czech-specific bonus
             ustanovení
[ ] D+1    — draft Privacy CS (~3500 slov)
[ ] D+1    — draft Privacy EN (translation, ne re-write)
[ ] D+2    — draft Terms CS (~2500 slov)
[ ] D+2    — draft Terms EN
[ ] D+2    — kontrolní pass: Apple §5.1.1 checklist + GDPR
             Art. 13 checklist + zák. 480/2004 §89 checklist
[ ] D+2    — uložit do src/content/{privacy,terms}/{cs,en}.md
[ ] D+3    — přečíst v context Czech native (já umím cs ale
             review user welcome)
[ ] před první enterprise klient — advokát review
```

## 16.7. Logo strategy ✓ RESOLVED (rev. 3)

**User decision (Q23):** "zkusme jen melveo prostě bez loga"

**Plán je pevně:**

- **Wordmark "melveo"** (Inter Bold lowercase) je single brand
  expression. Primary, secondary i marketing.
- **Žádný geometric mark.** 3D PRISM hero scéna je dekorace, ne
  brand identity.
- **Favicon:** rounded square `m` monogram (V3 done) — single
  exception kde wordmark nepasuje (16×16 favicon size).
- **App Store / iOS app icon:** vyrábí app side (`melveo-app`),
  není zodpovědnost web repu.

**Hero scéna a mark:** 3D shapes v hero jsou abstract decoration,
nemají žádný brand-symbolic význam. To je důležité — uživatel je
vnímá jako "wow moment", ne jako logo.

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

## 18. Změny + nové otázky

### 18.1. Follow-up otázky Q19-Q23 ✓ ALL RESOLVED (rev. 3, 2026-04-30)

#### Q19 — Provozovatel (legal entity) ✓ RESOLVED

**User dodal kompletní výpis z OR:**

| Pole | Hodnota |
|------|---------|
| Obchodní firma | **QUIX Global s.r.o.** |
| IČO | **22466444** |
| Sídlo | **Příčná 1892/4, Nové Město, 110 00 Praha 1** |
| Datová schránka | **g7v78rx** |
| Spisová značka | C 416432/MSPH Městský soud v Praze |
| Datum vzniku | 14. leden 2025 |
| Z. kapitál | 1 000 Kč |
| Právní forma | Společnost s ručením omezeným |

**Použití v textu:**

- Privacy Policy header: "Provozovatel: **QUIX Global s.r.o.**, IČO
  22466444, se sídlem Příčná 1892/4, 110 00 Praha 1, zapsaná v
  obchodním rejstříku vedeném Městským soudem v Praze, oddíl C,
  vložka 416432."
- Terms header: stejné
- Footer: "© 2026 QUIX Global s.r.o."
- Datová schránka uvedena v Privacy v sekci "Kontaktní údaje"
  pro úřední korespondenci

**Action item — DIČ check:**

User nedodal DIČ. Pro:
- Privacy: není potřeba (DIČ není osobní údaj plátce)
- Terms: doplnit pokud existuje (= jste plátci DPH)
- Invoicing: ano, potřeba

> **Q24 (NOVÝ):** Je QUIX Global plátce DPH? Pokud ano, DIČ?
> Pokud ne, do Terms vložím "Není plátcem DPH."

#### Q20 — DPO email ✓ RESOLVED

**User answer:** "dej tam hello@melveo.app"

**Implications:** Žádný separátní `privacy@` alias. Všechny GDPR
záležitosti půjdou přes `hello@melveo.app`.

V Privacy text:
> "Veškeré dotazy ohledně zpracování osobních údajů, žádosti o
> přístup, opravu, výmaz a další práva subjektu údajů zasílejte na
> hello@melveo.app."

#### Q21 — EN content ✓ RESOLVED

**User answer:** "en i cs udělej ty" → option (a)

**Implications:** Já napíšu obě verze. Plán:

1. CS first (per česká legislativa, primary jurisdiction)
2. EN translation (mirror, ne re-write)
3. User reviewuje EN ad-hoc když má čas

#### Q22 — Analytics IDs ✓ DEFERRED

**User answer:** "udelame později"

**Implications:**

- V4 ship **bez aktivovaných GA / Meta tagů**
- GTM container code v `<head>` zůstane (single tag), ale s
  empty container — nic neměří
- Cookie banner spuštěn ode dne 1 (legitimuje budoucí enable
  bez re-prompt všech existujících users)
- Až user dodá IDs (`G-…`, `12345…`, `GTM-…`), tag-by-tag config
  v GTM dashboardu — zero code change in repo

#### Q23 — Logo ✓ RESOLVED

**User answer:** "zkusme jen melveo prostě bez loga"

**Implications:**

- Wordmark "melveo" (Inter Bold lowercase) navždy primary brand
- Žádný geometric mark
- Favicon zůstává rounded square s "m" monogram (V3 done)
- 3D PRISM hero scene = pure decoration, nemá logo význam
- §16.7 logo strategy odebrána z roadmap; bod uzavřen.

### 18.2. Otevřené otázky pro tebe (rev. 3)

Z rev. 3 jen jedna nová:

#### Q24 — DIČ + plátce DPH?

> Je **QUIX Global s.r.o.** plátce DPH? Pokud ano, jaké je DIČ?
> (Tvar `CZ22466444` typically.)
>
> Default fallback: "Není plátcem DPH." do Terms (per české zvyklosti
> u nově založených s.r.o. s 1000 Kč kapitálem to často nebývá až do
> obratu 2 mil. Kč ročně).

### 18.2. Changelog

| Datum | Změna |
|-------|-------|
| 2026-04-29 | doc 178 web handoff vznikl |
| 2026-04-29 | doc 179 Privacy/Terms recommendation (Iubenda zamítnut) |
| 2026-04-30 | **Tato doc 180/PLAN vznikla** — komplexní plán proti fey/raycast DNA + 6 codepen referencí |
| 2026-04-30 | **Rev. 2:** user odpověděl na 18 otázek + dodal screenshot VoXelo (PRISM 3D scéna) + zvolil cookie banner ref Aaron Iker. Plán updatován: Three.js hero, i18n cs/en, full analytics stack (GA + Meta + GTM + CF), self-written legal text, cookie consent V4 critical. Nové otázky Q19-Q23 (legal entity, DPO email, EN translation, analytics IDs, logo design). |
| 2026-04-30 | **Rev. 3:** Q19-Q23 vyřešeny. Legal entity: **QUIX Global s.r.o.** IČO 22466444, sídlo Praha 1, dat. schránka g7v78rx. DPO email = hello@melveo.app (single contact). EN content píše Claude. Analytics IDs deferred. Logo: jen wordmark "melveo", žádný mark navždy. Nová Q24 (plátce DPH? DIČ?). Připraveno k V4 implementaci. |
