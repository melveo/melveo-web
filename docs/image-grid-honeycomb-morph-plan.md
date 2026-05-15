# Image grid honeycomb morph plan

Datum: 2026-05-12

## Cíl

Přestavět sekci `ImageGridScrollMorph` tak, aby nepůsobila jako sada obdélníkových/skoro čtvercových glass karet, ale jako součást hexagonální identity Melveo.

Sekce má zachovat současný silný moment:

1. full-bleed sportovní fotka přes viewport,
2. nápis `melveo` nad fotkou,
3. scroll-linked morph,
4. postupné zmizení nápisu,
5. zmenšení hlavní fotky do středu kompozice,
6. objevení 15 prvků kolem ní.

Nový výsledek má být:

```text
velká fotka -> postupně se ořezává do hexagonu -> přistane jako centrální hex
             -> kolem ní se složí honeycomb z dalších hexagonů
             -> obsah ukáže produktový tok, ne jen obecné feature karty
```

Tím plán přímo adresuje bod 2 z `WEB-REVIEW-2026-05-12.md`: web potřebuje produktový důkaz, tedy věrohodný tok:

```text
Player check-in -> team signal -> coach board decision
```

## Aktuální stav kódu

Relevantní soubory:

- `src/components/Landing.astro`
- `src/components/ImageGridScrollMorph.astro`
- `src/i18n/ui.ts`
- `src/styles/global.css`
- `src/components/MelveoDataFlowHero.tsx` jako reference pro existující hexagonální brand jazyk

### Zapojení na landing page

`Landing.astro` vkládá komponentu hned po hero:

```astro
<ImageGridScrollMorph lang={lang} />
```

Komentář ji označuje jako `STAGE 2 + 3 — Scroll-linked image grid morph`.

To je správné místo pro produktový důkaz: uživatel nejdřív dostane hero claim a hned potom vidí vizuální vysvětlení transformace.

### Aktuální struktura komponenty

`ImageGridScrollMorph.astro` dnes obsahuje:

- root `<section class="image-grid-section" data-grid-section data-glass-smoke>`
- sticky `<div class="content">`
- intro overlay:
  - `.grid-intro-darken`
  - `.grid-intro`
  - `.grid-intro__wordmark` s textem `melveo`
  - scroll hint button
- `.grid`
  - 3 vrstvy `.layer`
  - 14 okolních položek
  - 1 centrální `.scaler`

Počet buněk už odpovídá zadání:

```text
15 cells = 14 photos/cards + 1 scaler
```

Aktuální obsah:

- 6 fotek kolem gridu,
- 8 produktových feature karet,
- 1 centrální scaler fotka.

Aktuální feature labely v `src/i18n/ui.ts`:

```text
Check-in
Sessions
Attendance / Docházka
Load & RPE / Zátěž & RPE
Coach board
Recovery / Regenerace
Decisions / Rozhodnutí
Privacy / Soukromí
```

### Aktuální scroll mechanika

Komponenta už nepoužívá přímo Motion `scroll()` pro grid morph. Současná verze používá vlastní scroll handler:

- měří `.scaler` jako cílovou velikost,
- měří `.content` jako viewport sticky stage,
- vypočítá `scalerProgress`,
- interpoluje `width` a `height` hlavní fotky z viewportu do velikosti buňky,
- postupně nastavuje `opacity` a `transform: scale(...)` pro vrstvy,
- fadeuje intro a darken layer.

Klíčový aktuální princip:

```ts
imageEl.style.width = `${lerp(viewportWidth, naturalWidth, scalerMotion)}px`;
imageEl.style.height = `${lerp(viewportHeight, naturalHeight, scalerMotion)}px`;
```

To je pro plán dobré. Hex morph lze přidat do stejného `apply()` bez zavedení nové animační knihovny.

### Aktuální desktop layout

Desktop používá `5 x 3` grid:

```css
grid-template-columns: repeat(5, 1fr);
grid-template-rows: repeat(3, 1fr);
```

Centrální scaler je:

```css
grid-area: 2 / 3;
```

To je nutné zachovat jako geometrický střed, protože velká fotka se z viewportu zmenšuje do této buňky. Pokud by scaler nebyl uprostřed, startovní full-bleed fotka by se centrovala špatně a mohla by ořezávat viewport.

### Aktuální mobile layout

Do `1024px` se layout překlápí na `3 x 5`:

```css
grid-template-columns: repeat(3, 1fr);
grid-template-rows: repeat(5, 1fr);
```

Centrální scaler je:

```css
grid-area: 3 / 2;
```

To je také nutné zachovat, protože je to střed mobilního gridu.

### Aktuální glass-card recept

`.glass-card` je globální recept v `src/styles/global.css`.

Má:

- `border-radius: 1.75rem`,
- `overflow: hidden`,
- backdrop blur layer,
- overlay layer,
- specular layer,
- content layer,
- hover transform.

V image gridu je hover už vypnutý:

```css
.image-grid-section .grid-photo.glass-card:hover,
.image-grid-section .tech-card.glass-card:hover {
  transform: none;
}
```

Pro honeycomb je důležité neměnit globální `.glass-card`, protože ji používají i pricing a jiné sekce. Hexagonální úpravy musí být lokálně omezené na `.image-grid-section`.

## Reference z CodePenů

### Použít

Z prvního CodePenu je užitečný hlavně flat-top hexagon:

```css
clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0 50%);
aspect-ratio: 1.15;
```

Ten tvar lépe sedí k aktuálnímu `5 x 3` desktop layoutu, protože je širší než vyšší.

### Nepřebírat

Z druhého CodePenu nepřebírat float layout, negative margins ani pevné `min-width: 1200px`. Pro Melveo by to rozbilo responsive chování a současný sticky morph.

Lze si z něj vzít jen princip:

- hexagonální clipping,
- overlap mezi řadami,
- hover/content overlay logiku jako inspiraci, ne implementaci.

## Navržený cílový layout

### Desktop

Zachovat `5 x 3` grid, ale vizuálně ho změnit na honeycomb:

```text
outer   inner   inner   inner   outer
  inner   large   center   large   inner
outer   inner   inner   inner   outer
```

Reálně to zůstane 15 grid pozic, ale:

- každý prvek bude hexagon,
- liché řady/položky dostanou horizontální/vertikální offset,
- některé položky budou škálované,
- centrum bude dominantní.

Doporučené velikostní vrstvy:

```text
center: 1.12-1.18
large:  1.02-1.08
inner:  0.94-1.00
outer:  0.82-0.92
```

Velikosti nesmí být řešené změnou grid tracků, protože by to komplikovalo měření scaleru. Bezpečnější je škálovat vnitřní elementy pomocí CSS custom properties na wrappers:

```css
.image-grid-section .grid > .layer > div {
  --hex-scale: 1;
  transform: translate(var(--hex-x, 0), var(--hex-y, 0)) scale(var(--hex-scale));
}
```

Pozor: `.layer` už dostává JS transform `scale(...)` při reveal animaci. Proto je lepší transformovat wrapper buňky nebo vnitřní `.grid-photo/.tech-card`, ne přepisovat `.layer`.

### Mobile

Zachovat `3 x 5`.

Na mobilu se nesmí snažit o příliš agresivní honeycomb overlap, protože:

- hexagon má menší efektivní vnitřní plochu než obdélník,
- texty se budou hůř vejít,
- 15 buněk už dnes zabírá téměř celý viewport.

Mobilní varianta:

```text
photo/icon     signal       photo/icon
check-in       team signal  load
recovery       center       decision
photo/icon     coach board  photo/icon
attendance     privacy      photo/icon
```

Mobile doporučení:

- centrum max `1.04-1.08`,
- okraje max `0.92-0.98`,
- menší gap,
- méně textů,
- delší labely případně nahradit kratšími.

## Co zůstane

Zachovat:

1. Pozici sekce hned po hero.
2. Sticky scroll runway.
3. Full-bleed start hlavní fotky.
4. Intro wordmark `melveo`.
5. Intro darken layer.
6. Scroll hint button.
7. Centrální scaler princip.
8. 15 celkových buněk.
9. 3 vrstvy reveal animace.
10. Reduced-motion fallback.
11. Lokální sportovní fotky z `public/images/melveo-grid/`.
12. Glass/smoke atmosféru, pokud po hex změně nebude působit přeplácaně.

Zachovat střed scaleru:

- desktop: `grid-area: 2 / 3`,
- mobile: `grid-area: 3 / 2`.

Tohle je hard constraint.

## Co se přidá

### 1. Lokální hex tvar

Přidat lokální proměnné:

```css
.image-grid-section {
  --hex-flat: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0 50%);
  --hex-soft-start: polygon(0 0, 100% 0, 100% 100%, 0 100%);
}
```

Na cílové buňky:

```css
.image-grid-section .grid-photo,
.image-grid-section .tech-card,
.image-grid-section .scaler img {
  clip-path: var(--hex-flat);
  border-radius: 0;
}
```

Stejný `clip-path` musí dostat i glass vrstvy, protože některé efekty jsou absolutní children:

```css
.image-grid-section .glass-filter,
.image-grid-section .glass-overlay,
.image-grid-section .glass-specular,
.image-grid-section .glass-content {
  clip-path: inherit;
  border-radius: 0;
}
```

### 2. Morph fotky z rectangle do hexagonu

V `apply()` přidat výpočet pro clip progress.

Nezačínat hex clipping hned od začátku, protože fotka má nejdřív působit jako velká scéna. Doporučené chování:

```text
0-18 % scroll: fotka zůstává obdélník, jen začne mizet wordmark/darken
18-68 % scroll: fotka se zmenšuje a současně se začne ořezávat do hexu
68-100 % scroll: fotka už je čistý hex a jen dosedne do gridu
```

Technicky:

```ts
const hexProgress = keyframed(scalerProgress, 0.22, easeInOutCubic);
imageEl.style.clipPath = interpolateHexClip(hexProgress);
```

Pro `clip-path` nelze pohodlně interpolovat přes `lerp()` na string bez helperu. Přidat helper:

```ts
function hexClip(progress: number) {
  const p = clamp01(progress);
  const topInset = lerp(0, 25, p);
  const midInset = 0;
  const bottomInset = lerp(0, 25, p);

  return `polygon(
    ${topInset}% 0%,
    ${100 - topInset}% 0%,
    100% 50%,
    ${100 - bottomInset}% 100%,
    ${bottomInset}% 100%,
    0% 50%
  )`;
}
```

Na začátku tím vznikne:

```text
polygon(0 0, 100% 0, 100% 50%, 100% 100%, 0 100%, 0 50%)
```

To vizuálně odpovídá obdélníku. Na konci:

```text
polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)
```

### 3. Honeycomb offsets

Současný grid má pravoúhlé mezery. Pro honeycomb je potřeba posunout vybrané buňky.

Doporučení:

- nepoužívat negative margins,
- nepřepisovat grid placement,
- přidat pouze transform offsety na položky.

Příklad desktop:

```css
.image-grid-section .grid {
  --hex-overlap-x: clamp(8px, 1.2vw, 18px);
  --hex-overlap-y: clamp(6px, 1vw, 14px);
}

.image-grid-section .grid > .layer:nth-of-type(1) > div {
  --hex-scale: 0.88;
}

.image-grid-section .grid > .layer:nth-of-type(2) > div {
  --hex-scale: 0.98;
}

.image-grid-section .grid > .layer:nth-of-type(3) > div {
  --hex-scale: 1.06;
}
```

Pak konkrétní posuny podle pozice.

### 4. Stíny kolem hexagonů

`box-shadow` na prvku s `clip-path` může být oříznutý. Proto použít `filter: drop-shadow(...)` na wrapper buňky:

```css
.image-grid-section .grid > .layer > div,
.image-grid-section .grid .scaler {
  filter:
    drop-shadow(0 8px 12px rgba(0, 0, 0, 0.28))
    drop-shadow(0 0 22px rgba(0, 240, 255, 0.12));
}
```

Původní `.glass-card` box-shadow v této sekci ztlumit nebo lokálně vypnout:

```css
.image-grid-section .grid-photo.glass-card,
.image-grid-section .tech-card.glass-card {
  box-shadow: none;
}
```

### 5. Produktový obsah místo čistého feature listu

Review říká, že potřebujeme produktový důkaz, ne jen další abstraktní animaci.

Současných 8 labelů je lepších než starý generic SaaS seznam, ale pořád je to feature grid. Doporučená úprava obsahu:

Zachovat:

- `Check-in`,
- `Load & RPE`,
- `Coach board`,
- `Recovery`,
- `Privacy`.

Přejmenovat nebo přidat:

```text
Team signal
Watchlist: 3 players
Load adjustment
Ready today
```

Možná cílová sada 8 textových hexů:

```text
Check-in
Readiness
Load & RPE
Team signal
Watchlist
Coach board
Load adjustment
Privacy
```

Česky:

```text
Check-in
Stav hráče
Zátěž & RPE
Signál týmu
Watchlist
Coach board
Úprava zátěže
Soukromí
```

Alternativa pro kratší mobile labely:

```text
Check-in
Readiness
RPE
Team signal
Watchlist
Coach board
Load plan
Privacy
```

Obsahový princip:

- levá/vrchní část = vstupy od hráčů,
- střed = Melveo zpracování,
- pravá/spodní část = výstupy pro trenéra.

## Co se ubere nebo zjednoduší

### Ubrat dojem obyčejných karet

V této sekci lokálně odstranit:

- rounded card radius,
- obdélníkový card feel,
- hover lift,
- případně část glass-card shadow envelope.

Neodstraňovat globální `.glass-card`; jen lokálně override v `.image-grid-section`.

### Ubrat dlouhé texty na mobilu

Hexagon má méně použitelné plochy než karta. Pokud se label nevejde:

1. zkrátit label,
2. zmenšit icon,
3. skrýt část labelů u fotografických/okrajových hexů,
4. nepřidávat body copy.

Body copy do hexů nepřidávat.

### Ubrat vizuální soutěžení s kouřem

Pokud honeycomb + glass + smoke bude příliš rušivé, snížit:

- `data-glass-smoke-density`,
- cyan radial glow za ikonami,
- specular highlights.

## Doporučená implementace po krocích

### Fáze 1: čistý hex tvar bez změny layoutu

Cíl: minimální riziko.

Změny:

- přidat lokální `--hex-flat`,
- dát `clip-path` na `.grid-photo`, `.tech-card`, `.scaler img`,
- dát `border-radius: 0`,
- zkontrolovat, že obrázky a content layers respektují tvar.

Ověřit:

- desktop end state,
- mobile end state,
- reduced motion.

### Fáze 2: morph hlavní fotky

Cíl: úvodní fotka se postupně mění do hexagonu.

Změny:

- přidat `hexClip(progress)` helper do `<script>`,
- v `apply()` nastavovat `imageEl.style.clipPath`,
- na začátku `apply()` musí být full rectangle,
- na konci čistý hex.

Ověřit:

- první frame sekce je stále full-bleed fotka,
- wordmark není oříznutý,
- darken overlay pořád funguje,
- po scrollu fotka dosedne do středu jako hex.

### Fáze 3: honeycomb kompozice

Cíl: finální stav není pravoúhlý grid, ale honeycomb.

Změny:

- nastavit `--hex-scale` podle vrstvy,
- přidat jemné `--hex-x` a `--hex-y` offsety,
- upravit `gap`,
- přidat `drop-shadow` na wrapper buňky,
- zabránit ořezání krajních hexů přes `overflow`.

Pozor:

- `.content` má `overflow: hidden`; příliš velké offsety/scale mohou oříznout krajní hexagony.
- `.grid` je height-capped na viewport. Větší centrum musí mít rezervu.

### Fáze 4: obsah podle review

Cíl: ze sekce udělat produktový důkaz.

Změny:

- upravit `gridCard.*` překlady,
- případně přidat nové keys pro signal/outcome labely,
- přemapovat stávající karty v markup tak, aby tvořily tok:

```text
inputs -> Melveo -> coach outputs
```

Doporučené mapování:

```text
Input hexes:
- Check-in
- Readiness
- Load & RPE
- Attendance

Processing/context hexes:
- Team signal
- Recovery trend

Coach output hexes:
- Watchlist
- Load adjustment
- Coach board
```

Fotky použít jako lidský kontext, ne jako hlavní sdělení.

### Fáze 5: mobile polish

Cíl: žádné ořezy, žádné nečitelné labely.

Změny:

- nastavit mobile scale konzervativněji,
- snížit icon size,
- zkrátit labely,
- nepřekrývat hexagony tolik jako desktop,
- případně ponechat `3 x 5` s hex tvary bez výrazného overlapu.

### Fáze 6: testy a vizuální QA

Spustit lokálně:

```bash
npm run build
npm run dev
```

Ověřit přes Playwright/browser:

- `/cs/` desktop start sekce,
- `/cs/` desktop mid-scroll,
- `/cs/` desktop end state,
- `/en/` desktop kvůli delším EN labelům,
- mobile `390 x 844`,
- tablet `768 x 1024`,
- small laptop `1024 x 768`,
- reduced motion.

Screenshoty uložit do `output/playwright/`.

## Technické detaily a rizika

### Riziko: clip-path a glass vrstvy

`.glass-card` používá absolutní vrstvy. Pokud `clip-path` bude jen na host elementu, většinou to bude fungovat díky `overflow: hidden`, ale bezpečnější je dát `clip-path: inherit` i na vrstvy.

### Riziko: text v hexagonu

Hexagon ztrácí rohy. Text nesmí sahat k hranám.

Opatření:

- větší vnitřní padding na desktopu,
- menší font na mobile,
- kratší labely,
- `overflow-wrap: anywhere` ponechat.

### Riziko: stíny se oříznou

Stín na clipped elementu se může oříznout. Řešení:

- stín přes `filter: drop-shadow` na wrapper,
- ne přes `box-shadow` na clipped host.

### Riziko: transform konflikty

JS nastavuje `transform` na `.layer`.

Honeycomb offsety nesmí přepisovat `.layer.style.transform`, jinak se rozbije reveal animace. Offsety a scale musí být na:

- `.grid > .layer > div`,
- nebo na `.grid-photo/.tech-card`,
- nebo přes nested vnitřní wrapper, pokud se markup rozšíří.

### Riziko: centrální scaler velikost

JS měří `scalerEl.offsetWidth/offsetHeight`. Pokud se centrum vizuálně zvětší jen přes CSS `transform: scale(...)`, měřená cílová velikost zůstane původní grid cell.

To je v pořádku, pokud chceme, aby animovaná fotka nejdřív dosedla do měřené buňky a teprve wrapper ji vizuálně zvětšil. Pokud chceme, aby JS animoval přímo do většího centra, musí se upravit `naturalWidth/naturalHeight`:

```ts
const centerScale = 1;
naturalWidth = (scalerEl?.offsetWidth ?? 280) * centerScale;
naturalHeight = (scalerEl?.offsetHeight ?? 350) * centerScale;
```

Doporučení: začít bez úpravy JS natural size, zvětšit centrum wrapperem. Je to méně rizikové.

### Riziko: reduced motion

Reduced motion dnes vypíná sticky scroll dance a ukazuje final grid staticky.

Po změně musí final static state být hexagonální. Nesmí zůstat obdélníková fotka nebo skryté vrstvy.

V reduced motion nastavit:

```css
@media (prefers-reduced-motion: reduce) {
  .image-grid-section .scaler img {
    clip-path: var(--hex-flat);
  }
}
```

## Přesný návrh cílového obsahu 15 hexů

Jedna možná skladba, která respektuje současných 15 buněk:

```text
Row 1:
photo: player/coach context
Check-in
photo: team huddle
Readiness
photo: equipment/session context

Row 2:
Attendance
Load & RPE
CENTER: Melveo / team briefing photo
Team signal
Watchlist

Row 3:
photo: coach tablet
Recovery trend
Coach board
Load adjustment
Privacy
```

To lze přemapovat podle současných `.layer` pozic bez změny počtu buněk.

Produktový příběh:

```text
hráčské vstupy -> týmový signál -> trenérský výstup
```

Vizuální příběh:

```text
velká scéna týmu -> Melveo ji zpracuje do centrálního hexu -> kolem vzniknou datové a rozhodovací hexy
```

## Doporučené finální chování scrollu

```text
0 %:
- full-bleed fotka
- darken layer
- melveo wordmark
- scroll hint
- okolní hexy neviditelné

15-25 %:
- wordmark mizí
- darken mizí
- fotka pořád skoro rectangle

25-55 %:
- fotka se viditelně zmenšuje
- rohy se začnou řezat do hexagonu
- nejbližší hexy začnou fade/scale in

55-82 %:
- fotka dosedá do center hexu
- všechny vrstvy honeycombu jsou viditelné
- outer hexy jsou menší a klidnější

82-100 %:
- final honeycomb drží staticky
- uživatel má čas přečíst produktový tok
```

## Acceptance criteria

Implementace je hotová, když platí:

1. Na desktopu začíná sekce full-bleed fotkou s `melveo` wordmarkem.
2. Při scrollu se fotka plynule zmenšuje a mění z obdélníku do hexagonu.
3. Finální stav obsahuje 15 hexagonálních prvků.
4. Středový hex je vizuálně dominantní.
5. Okolní prvky působí jako honeycomb, ne jako pravoúhlý card grid.
6. Mobile ukazuje všech 15 prvků bez ořezu.
7. Texty v hexech se nepřekrývají a nejsou useknuté.
8. Sekce jasně komunikuje `Player check-in -> team signal -> coach board decision`.
9. `prefers-reduced-motion: reduce` zobrazí použitelný statický honeycomb.
10. `npm run build` projde.
11. Playwright screenshoty neukážou ořezané okraje, prázdnou sekci ani text přes hrany.

## Stav implementace 2026-05-12

Hotovo v `src/components/ImageGridScrollMorph.astro`:

- Sekce má stabilní anchor `#image-grid-morph`, aby šla přímo otevřít a testovat.
- Úvodní full-bleed fotka zůstává přes celý viewport s `melveo` wordmarkem a scroll hintem.
- Scaler fotky používá scroll-driven `hexClip(progress)`, takže se při zmenšování postupně mění z obdélníku na plochý hexagon.
- Všechny fotky i produktové buňky používají stejný `--hex-flat` polygon a `-webkit-clip-path`.
- Skleněný vizuál zůstává zachovaný: `.glass-filter`, `.glass-overlay`, `.glass-specular` a `.glass-content` zůstávají ve struktuře a pouze dědí hexagonální clipping.
- Finální desktop layout drží 5 x 3 honeycomb se středovou fotkou v geometrickém středu.
- Finální mobile/tablet layout drží 3 x 5 honeycomb, aby bylo vidět všech 15 prvků.
- Všechny finální hexagony používají pravidelný flat-top poměr `width / height = 2 / sqrt(3) = 1.154700538`; grid výška se odvozuje z šířky buňky, ne z volné výšky viewportu.
- Středová fotka dosedá do stejného pravidelného hex poměru jako ostatní buňky; `centerScale` je 1, aby se final state nedeformoval ani nepřekrýval labely.
- Okolní hexy mají odstupňované scale/offsety: outer vrstva je menší, vnitřní vrstva je klidnější, střed je vizuální focus.
- Produktové tech buňky mají vyšší lokální z-index než okolní fotky, takže popisky nezanikají pod sousedními fotkami.
- Desktop tech obsah na levé/pravé straně je jemně posunutý od středu; na mobile se tento posun resetuje.
- `prefers-reduced-motion: reduce` zůstává jako statický honeycomb bez sticky scroll animace a středová fotka se renderuje rovnou jako hexagon.

Hotovo v `src/i18n/ui.ts`:

- Příliš dlouhé mobilní labely byly zkrácené na `Check-in`, `Stav hráče` / `Readiness`, aby se vešly do hexagonů bez ořezu.
- Ostatní labely zůstávají produktové: `Trend regenerace`, `Signál týmu`, `Plán zátěže`, `Coach board`, `Zátěž & RPE`, `Soukromí`.

Vizuálně ověřeno:

- Desktop start: `melveo-honeycomb-desktop-start-v3.png`.
- Desktop final: `melveo-honeycomb-desktop-end-safe.png`.
- Mobile start: `melveo-honeycomb-mobile-start.png`.
- Mobile final: `melveo-honeycomb-mobile-end-final.png`.
- Final regular-hex matrix:
  - `output/playwright/regular-hex-final-desktop_1440x900.png`
  - `output/playwright/regular-hex-final-laptop_1280x800.png`
  - `output/playwright/regular-hex-final-tablet_768x1024.png`
  - `output/playwright/regular-hex-final-mobile_390x844.png`
  - `output/playwright/regular-hex-final-mobile_360x740.png`

Technicky ověřeno:

- `npm run check` prošel bez errors/warnings/hints.
- Playwright DOM měření na desktop/laptop/tablet/mobile/small-mobile potvrdilo `count = 15` a poměr všech host buněk cca `1.1547`.
- `npm run build` prošel. Build se nejdřív zdržel na macOS/iCloud `dataless` placeholderu v `public/images/melveo-grid`; po lokálním stažení assetů doběhl korektně.

Poznámka k ověření: screenshoty byly pořízené přes lokální server `http://127.0.0.1:4324/cs#image-grid-morph`.

## Co nedělat

- Neměnit globální `.glass-card` pro celý web.
- Neposouvat centrální scaler mimo geometrický střed.
- Nepoužívat float layout z CodePenu.
- Nepřidávat další animační knihovnu.
- Nepřidávat body copy do všech hexů.
- Nedělat z toho čistě dekorativní galerii bez produktového toku.
- Nerozbít práci druhého Codexu v `WEB-REVIEW-2026-05-12.md`; tento plán je samostatný realizační dokument.

---

## Implementace 2026-05-13 — branch `codex/honeycomb-grid-layout`

Aktuální implementační směr byl upraven podle nového zadání: okolní prvky nemají jen vypadat jako oříznuté karty, ale musí tvořit skutečný honeycomb kolem hlavní fotky.

### Geometrie

Použitý tvar je point-top hexagon, stejný princip jako v ukázce:

```css
polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)
```

Finální layout už není `5 x 3` obdélníkový grid. Je to absolutně pozicovaný honeycomb s těmito pravidly:

- hlavní fotka je centrální hexagon `0 / 0`;
- sousedé ve stejném řádku jsou o `1 x hex width` vedle;
- sousedé v dalším řádku jsou o `0.5 x hex width` posunutí do strany a o `0.75 x hex height` níž/výš;
- všech 15 položek tvoří symetrický diamant:

```text
        1
    4       4
  5    center    5
    4       4
        1
```

Reálně v CSS je to zapsané přes souřadnice `--hx` a `--hr`:

```css
left: calc(50% + (var(--hx) * var(--hex-x-step)));
top: calc(50% + (var(--hr) * var(--hex-y-step)));
```

### Co se změnilo v komponentě

Soubor:

```text
src/components/ImageGridScrollMorph.astro
```

Změny:

- `.grid` už není CSS grid/subgrid;
- `.layer` je absolutní full-stage wrapper;
- každý child wrapper je absolutní hex buňka;
- `.grid-photo`, `.tech-card` a finální `.scaler img` používají lokální hex `clip-path`;
- liquid glass vrstvy zůstaly uvnitř hex clippingu;
- hover zvětšení je zpět na jednotlivých hex buňkách (`scale(1.08)`), ne na celé vrstvě;
- scroll-linked morph hlavní fotky zůstává zachovaný: velká fotka se z viewportu zmenší do centrálního hexagonu.

### Ověření / rizika

- `git diff --check -- src/components/ImageGridScrollMorph.astro` prošlo bez whitespace/syntax diff chyb.
- Plný `npm run build` se v aktuálním lokálním prostředí zasekává ještě před Astro výstupem stejně jako před touto změnou, takže build zatím nelze použít jako finální validaci této větve.
- Aktuální server na `127.0.0.1:4324` běží nad posledním statickým `dist`, takže dokud se build/dev znovu nerozchodí, nemusí ukazovat tuto novou honeycomb větev.

### Další krok

1. Rozchodit dev/build proces nebo použít alternativní lokální render pipeline.
2. Vizuálně ověřit finální stav v těchto viewports:
   - desktop `1440 x 900`;
   - laptop `1280 x 800`;
   - tablet `768 x 1024`;
   - mobile `390 x 844`.
3. Doladit `--hex-w` pro mobile, pokud budou textové karty příliš malé.
4. Pokud bude potřeba hustší honeycomb, přidat další 4 položky a přejít z 15 na plný radius-2 hex cluster `19` buněk. Pro současný obsah ale zůstává zachovaných původních 15 položek.
