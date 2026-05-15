# Melveo web — UX/konverzní review a plán zlepšení

**Datum:** 2026-05-12  
**Recenzovaná verze:** `http://localhost:4321/en/` + původní poznámky k produkci  
**Cíl dokumentu:** sjednotit dosavadní poznatky, potvrdit / vyvrátit priority a připravit plán, aby web během prvních sekund jasně vysvětlil, co Melveo dělá.

---

## Executive summary

Web je vizuálně silný a působí prémiově. Není to problém kvality designu. Slabina je v product marketingu a informační architektuře: návštěvník bez kontextu musí příliš dlouho skládat dohromady, co aplikace reálně řeší.

Největší riziko:

> Web vypadá jako prémiový sportovní brand, ale první minuty ne vždy jednoznačně vysvětlí produktovou transformaci:  
> **hráčské signály → melveo → trenérské rozhodnutí.**

To je potřeba dostat výš, jednodušeji a konkrétněji.

---

## Výzkumný rámec

Tahle doporučení nejsou jen subjektivní preference:

- Nielsen Norman Group uvádí, že prvních 10 sekund návštěvy je kritických a hodnota stránky musí být jasně komunikovaná velmi rychle:  
  https://www.nngroup.com/articles/how-long-do-users-stay-on-web-pages/
- NN/g zároveň doporučuje psát pro konkrétní publikum, používat známá slova a omezovat jargon, protože i experti preferují rychle skenovatelný text:  
  https://www.nngroup.com/articles/plain-language-experts/
- NN/g testy čtení webu ukazují, že stručný, skenovatelný a objektivní text dramaticky zlepšuje použitelnost oproti marketingovým frázím:  
  https://www.nngroup.com/articles/how-users-read-on-the-web/
- Baymard u B2B SaaS webů zjistil, že vizuální ukázky reálného UI jsou pro posouzení služby zásadní; 35 % SaaS webů neposkytuje dost vizuálních informací o UI:  
  https://baymard.com/blog/highlight-saas-ui

Praktický závěr pro Melveo:

1. Above the fold musí odpovědět: **co to je, pro koho to je, jaký výsledek dostanu**.
2. Animace smí podporovat příběh, ale nesmí ho nahrazovat.
3. U SaaS produktu nestačí brand fotky a abstrakce; je potřeba ukázat konkrétní použití nebo věrohodný produktový mock.

---

## Co potvrzuji z původního review

### 1. Hero zatím neříká dost konkrétně, co Melveo dělá

Původní poznámka je správná.

Aktuální hero typu:

- “Smarter trainings”
- “Smarter decisions”
- “Wellness, sessions, and coach board in one app”

vypadá dobře, ale je pořád moc obecné. Člověk bez znalosti produktu si může říct:

- je to wellness app?
- plánovač tréninků?
- týmový chat?
- analytika?
- coach board?
- docházka?

To je příliš mnoho možností.

**Doporučené nové sdělení hero sekce:**

```text
Turn player signals into coach decisions.
```

Podnadpis:

```text
Melveo collects player check-ins, readiness, wellness and training load,
then turns them into clear daily context for coaches.
```

Česky:

```text
Z hráčských signálů dělá trenérská rozhodnutí.
```

Podnadpis:

```text
Melveo sbírá check-iny, readiness, wellness a tréninkovou zátěž
a převádí je do jasného denního kontextu pro trenéry.
```

Proč: je to konkrétnější než “smarter trainings” a okamžitě vyjadřuje transformation layer.

---

### 2. Chybí produktový důkaz

Původní poznámku potvrzuji, ale formuloval bych ji přesněji.

Není nutné hned mít reálné screenshoty finální aplikace, pokud ještě nejsou dobré. Ale web potřebuje ukázat alespoň jeden věrohodný produktový tok:

```text
Player check-in → team signal → coach board decision
```

Baymard k SaaS webům výslovně ukazuje, že B2B uživatelé chtějí vidět, jak UI reálně působí, ne jen číst feature listy.

**Doporučení:**

- Přidat jednu stylizovanou, ale konkrétní produktovou vizualizaci.
- Nemusí to být dashboard plný dat.
- Má být jednoduchá věta ve vizuálu:
  - hráč odešle check-in
  - Melveo ho zpracuje
  - trenér dostane výstup: “Watchlist: 3 players”, “Load adjustment”, “Ready today”

Tohle je důležitější než další abstraktní animace.

---

### 3. WordScrollStage je efektní, ale neprodává dost dobře

Původní poznámku potvrzuji.

Sekce “Connects check-ins, players, coaches, sessions…” má dobrý záměr, ale výsledek je moc dlouhý seznam. Na mobilu navíc působí těžkopádně a místy se čitelnost rozpadá.

Problém není samotný efekt, ale obsah.

**Doporučená náhrada:**

Místo 15 slov použít 3 konkrétní transformace:

```text
Morning check-in → coach-ready context
Training RPE → next-week load
Attendance + wellness → team readiness
```

Česky:

```text
Ranní check-in → kontext pro trenéra
RPE z tréninku → zátěž na další týden
Docházka + wellness → readiness týmu
```

To odpovídá způsobu, jak lidé skenují web: konkrétní spojení se čte rychleji než dlouhý abstraktní výčet.

---

### 4. CTA jsou konkurenční

Původní poznámku potvrzuji.

Když jsou nahoře zároveň:

- App Store
- Get in touch
- později Start free
- kontakt e-mailem

není jasné, jaký je hlavní krok.

**Doporučení:**

Původní doporučení pro čistě B2B klubový flow:

```text
Book a club demo
```

Sekundární CTA:

```text
See how it works
```

App Store by standardně mělo být sekundární možnost pro hráče / po vysvětlení, ne dominantní první akce, pokud hlavní obchodní cíl je klubová licence.

**Aktuální rozhodnutí 2026-05-12:**

App Store CTA zůstává v hero jako primární akce, protože aplikace má jít live během několika dnů. Tohle je vědomá výjimka z původního B2B doporučení, ne nedodělaný bod. Sekundární CTA zůstává kontaktní flow pro kluby.

Česky:

```text
Domluvit klubové demo
Ukázat, jak to funguje
```

---

### 5. Testimonials / důvěra chybí

Původní poznámku potvrzuji, ale s jedním omezením:

Pokud nemáme reálný pilot, nesmí se vyrábět falešná citace. To by webu uškodilo víc než absence testimonials.

**Co lze udělat hned bez fake proof:**

- Přidat krátkou sekci “Built for clubs that need daily context, not another spreadsheet.”
- Přidat “privacy by design”, “club-owned workspace”, “player-friendly check-in” jako důvěryhodné principy.
- Přidat “Pilot clubs wanted” / “Launching with first clubs” jen pokud je to pravda.

**Co přidat později:**

- 1 konkrétní pilotní klub
- 1 jméno trenéra
- 1 výsledek nebo citace
- případně fotka nebo logo, jen se souhlasem

---

## Co bych upravil oproti původnímu review

### 1. Hero bych neformuloval jako “méně zranění”

Původní návrh:

```text
Méně zranění, lepší rozhodnutí, jedna aplikace.
```

je srozumitelný, ale “méně zranění” je silný claim. Pokud pro to nemáme data, je lepší ho nepoužívat jako hlavní slib.

Bezpečnější a přesnější slib:

```text
Spot problems earlier. Decide with context.
```

nebo:

```text
Better daily decisions from player signals.
```

Česky:

```text
Odhalte rizika dřív. Rozhodujte s kontextem.
```

nebo:

```text
Lepší denní rozhodnutí z hráčských signálů.
```

---

### 2. Free Starter nemusí být nutně “past”, ale je třeba vysvětlit jeho roli

Původní review říká, že 8 hráčů nedává smysl pro reálný tým. Souhlasím částečně.

8 hráčů může dávat smysl jako:

- test pro realizační tým
- test s vybranou skupinou hráčů
- akademie / malý tým
- interní pilot

Ale nesmí se tvářit jako plnohodnotný týmový plán.

**Doporučená úprava copy:**

```text
Free Starter
Try Melveo with a small group before rolling it out to the team.
```

Česky:

```text
Vyzkoušejte Melveo na menší skupině před nasazením do celého týmu.
```

Pak 8 hráčů nepůsobí jako skrytý limit, ale jako záměrný onboarding.

---

### 3. Denní cena v pricingu může zůstat, ale musí být sekundární logika jasná

Původní review navrhuje zjednodušit měsíční vs denní cenu. Souhlasím, že to může mást.

Nedělal bych ale okamžité odstranění denní ceny. U klubů může denní cena fungovat, protože “49 Kč / den za celý tým” působí snesitelněji než měsíční částka.

**Doporučení:**

Zachovat denní cenu jako headline, ale doplnit jasný billing pod tím:

```text
49 CZK / day for the whole team
1,492 CZK / month · billed yearly
```

Nesmí to vypadat jako trik.

---

## Aktuálně největší problémy podle dopadu

### P0 — Jasnost první obrazovky

**Problém:** Hero je krásné, ale příliš obecné.

**Úkol:**

- Přepsat headline na transformation statement.
- Podnadpis napsat bez žargonu.
- CTA sjednotit na klubový demo/contact flow.

**Doporučená EN verze:**

```text
Turn player signals into coach decisions.
Melveo collects check-ins, readiness, wellness and training load,
then gives coaches clear daily context before training or match day.
```

**Doporučená CS verze:**

```text
Z hráčských signálů dělá trenérská rozhodnutí.
Melveo sbírá check-iny, readiness, wellness a tréninkovou zátěž
a převádí je do jasného denního kontextu pro trénink i zápas.
```

---

### P0 — Přidat jednoduchou product-story sekci vysoko na stránku

**Problém:** Produktový mechanismus je teď rozptýlený mezi mnoho animací.

**Úkol:**

Vložit brzy po hero sekci jednu čistou vizualizaci:

```text
Signals from players → melveo → coach decisions
```

Vizuálně:

- vlevo: Sleep, Mood, Readiness, Pain, Fatigue, HRV, Training Load, Match context
- střed: melveo jako processing layer
- vpravo: Ready today, Watchlist, Risk alert, Load adjustment, Rotation hint, Coach action

Pravidlo: žádný dashboard, žádná konzole, žádná náhodná neuronová síť. Jen jasná animovaná věta.

Tahle sekce může později nahradit `DATA → FEEDBACK`, jak bylo plánováno.

---

### P1 — Redukovat počet abstraktních scroll efektů

**Problém:** Web má hodně “wow” momentů, ale některé nesou málo informací.

Nejslabší kandidáti:

- WordScrollStage jako dlouhý seznam
- část image gridu s obřím “melveo”, která na mobilu překrývá obsah
- některé sekce s dlouhým pinned scrollem

**Úkol:**

Každá animovaná sekce musí projít testem:

> Řekne tahle sekce něco konkrétního o produktu, nebo jen vypadá dobře?

Pokud jen vypadá dobře, zkrátit nebo odstranit.

---

### P1 — Ukázat reálné nebo věrohodné UI

**Problém:** Brand fotky fungují atmosféricky, ale SaaS kupující chce vidět, co bude používat.

**Úkol:**

Připravit 3 product visuals:

1. Player check-in na mobilu
2. Coach board / readiness view
3. Decision output view

Pokud reálné screenshoty nejsou připravené, použít dočasně stylizované mocky v designu webu, ale musí být konkrétní:

- ne placeholder wireframe
- ne abstraktní dashboard
- jasná ukázka informací, které trenér reálně uvidí

---

### P1 — Zpřesnit pricing copy

**Problém:** Pricing je strukturálně dobrý, ale pár formulací může brzdit důvěru.

Úpravy:

- `Free Starter`: vysvětlit, že je to test s menší skupinou.
- Denní cenu doplnit o “for the whole team”.
- Odstranit interní reference typu `doc 174`.
- “Start free” použít jen tam, kde je opravdu samostatný self-serve start. Pokud ne, dát “Start with a small group” nebo “Request setup”.

---

### P2 — FAQ přepsat z informačního na námitkové

Souhlasím s původním review.

FAQ by mělo odpovídat na reálné obavy:

1. Budou hráči check-in opravdu dělat?
2. Kolik času to stojí trenéra denně?
3. Co když už používáme jiný týmový nástroj?
4. Co se stane, když hráč vynechá den?
5. Kdo vidí hráčská data?
6. Je Melveo pro jeden tým, akademii, nebo celý klub?

---

### P2 — Přidat důvěryhodnost firmy

Souhlasím s původním review.

Footer je strohý a pro klubové rozhodnutí může chybět kontext, kdo za produktem stojí.

Doporučení:

- přidat krátké “About / Built by QUIX Global s.r.o.”
- sídlo / IČO / kontakt
- případně LinkedIn / Instagram, pokud budou aktivní
- nepřidávat prázdné sociální sítě jen kvůli ikonám

---

## Doporučená nová struktura homepage

### 1. Hero

Úkol: okamžitě říct, co produkt dělá.

```text
Turn player signals into coach decisions.
```

CTA:

```text
Book a club demo
See how it works
```

### 2. Transformation visual

Úkol: vizuálně vysvětlit mechanismus.

```text
Athlete signals → melveo → coach decisions
```

### 3. One day in the club

Úkol: ukázat konkrétní workflow.

```text
Morning check-in
Training context
Coach decision
```

### 4. For the whole club

Úkol: vysvětlit, že nejde jen o jednoho hráče.

```text
Players, coaches and staff work from one shared signal.
```

### 5. Product visuals

Úkol: ukázat UI nebo věrohodné mocky.

### 6. Privacy / ownership

Úkol: uklidnit hráče a klub.

```text
The club owns the workspace. Players keep control of personal inputs.
```

Pozor: nepsat, že “trenér nikdy nevidí syrová čísla”, protože to může působit divně. Lepší:

```text
Sensitive player inputs are translated into role-based team context.
```

### 7. Pricing

Úkol: jasně ukázat plány a pro koho jsou.

### 8. FAQ

Úkol: odstranit námitky.

### 9. Contact

Úkol: jeden jasný další krok.

---

## Konkrétní copy návrhy

### Hero EN

```text
Coach operating system for team sports

Turn player signals into coach decisions.

Melveo collects check-ins, readiness, wellness and training load,
then gives coaches clear daily context before training or match day.

Book a club demo
See how it works
```

### Hero CS

```text
Operační systém pro týmové sporty

Z hráčských signálů dělá trenérská rozhodnutí.

Melveo sbírá check-iny, readiness, wellness a tréninkovou zátěž
a převádí je do jasného denního kontextu pro trénink i zápas.

Domluvit klubové demo
Ukázat, jak to funguje
```

### Transformation section EN

```text
Raw signals in. Coach-ready decisions out.

Players send short daily signals. Melveo connects them with training
load and match context, then surfaces what coaches should act on.
```

### Transformation section CS

```text
Syrové signály dovnitř. Trenérské rozhodnutí ven.

Hráči posílají krátké denní signály. Melveo je spojí se zátěží
a kontextem zápasu a ukáže trenérům, na co reagovat.
```

---

## Co zatím nedělat

- Nepřidávat další abstraktní částice, glow efekty nebo “AI” vizuály.
- Nevyrábět falešné testimonials.
- Nepoužívat zdravotní / injury reduction claimy bez dat.
- Nedělat z hlavní vysvětlující sekce dashboard, pokud cílem je transformation layer.
- Nepřidávat sociální sítě, pokud nejsou aktivní.

---

## Implementační stav po re-auditu 2026-05-13

Tento plán už není uzavřený jako “100 % hotovo”. Většina původního clarity/product-story rozsahu je splněná, ale po pozdějších úpravách se změnily některé závěry:

- viditelný trust/company block byl záměrně odstraněn podle požadavku, aby jméno firmy nebylo na landing page, maximálně v právních stránkách;
- spodní notify form byl odstraněn jako duplicitní vůči hlavnímu e-mail CTA;
- particle canvas v `DATA → FEEDBACK` byl odstraněn, protože sekce působila zahlceně částicemi a čarami;
- druhá scroll / honeycomb sekce je samostatné otevřené téma a nemá se hodnotit jako dokončené v tomto review plánu.

Aktuální stránka je prezentovatelná a product story je výrazně jasnější než původně. Není ale hotové úplně všechno, co by z webu udělalo finální production-grade landing bez kompromisů.

### Hotovo a ponechat

1. **Hero positioning**
   - Hero už komunikuje hlavní transformation layer:
     - CS: `Hráčské signály měníme na …`
     - EN: `Player signals become …`
   - Rotující výrazy jsou navázané na trenérské výstupy, ne na obecné marketingové slogany.
   - Typewriter/kurzor byl dotažený tak, aby se text při mazání neposouval a písmena s dolní dotažnicí nebyla oříznutá.

2. **`DATA → FEEDBACK`**
   - Sekce vysvětluje: vstupy hráčů → melveo → výstup pro trenéra.
   - Po re-auditu 2026-05-13 je odstraněný nadbytečný particle/canvas layer.
   - Zůstává čistší SVG/honeycomb vizuál bez přetížené sítě náhodných čar.

3. **`WordScrollStage`**
   - Dlouhý abstraktní výčet je zkrácený na konkrétní transformace:
     - EN: `check-in → coach context`, `RPE → next-week load`, `wellness → team readiness`
     - CS: `check-in → kontext trenéra`, `RPE → další zátěž`, `wellness → readiness týmu`

4. **`JEDEN DEN V KLUBU`**
   - Sekce nese hlavní produktový důkaz bez samostatného duplicitního bloku.
   - Čtyři kroky ukazují konkrétní tok:
     - check-in;
     - sessions;
     - coach board;
     - rozhodnutí.

5. **Pricing**
   - Free Starter je vysvětlený jako test s menší skupinou.
   - Placené plány komunikují týmovou licenci.
   - `Free Starter` CTA bylo 2026-05-13 opravené z mrtvého odkazu `#brzy` na existující `#contact`.

6. **FAQ**
   - FAQ odpovídá na praktické námitky klubů a trenérů.
   - Současná struktura dává smysl a není potřeba ji dál rozšiřovat, dokud nepřijdou reálné dotazy z pilotů.

7. **Závěr stránky**
   - Spodní část je zjednodušená.
   - Zůstal jeden hlavní kontakt: velký modrý `hello@melveo.app`.
   - Viditelné firemní údaje byly odstraněné z landing/footer; právní údaje zůstávají v `Privacy` / `Terms`.

### Co je ještě potřeba dodělat

#### P0 — dokončit / stabilizovat honeycomb scroll sekci

Tuhle sekci nelze označit za hotovou, dokud nebude finálně potvrzená její podoba.

Požadovaný stav:

- úvodní velká fotka se při scrollu transformuje do pravidelného hexagonu;
- středový hexagon zůstává hlavní položka;
- ostatní položky se skládají kolem něj jako honeycomb;
- fotky i ikony jsou ve svých hexagonech centrované;
- liquid glass efekt se neztratí;
- na mobilu sekce nesmí působit jako rozbitý grid nebo deformované karty.

Poznámka: na této části může paralelně pracovat jiný Codex, proto do ní tento audit nezasahuje jako do uzavřeného bodu.

#### P1 — přidat reálné app/product screenshoty

Tohle je největší zbývající marketingová slabina.

Web už vysvětluje, co Melveo dělá, ale pořád neukazuje dost konkrétně, jak bude aplikace vypadat v ruce hráče a trenéra.

Přidat později:

1. hráčský check-in na mobilu;
2. coach board / readiness view;
3. decision output / watchlist view.

Do té doby je správné, že `AppShotsStage` zůstává skrytá. Prázdné phone-frame placeholdery by působily slabě.

#### P1 — přidat reálný pilot proof

Testimonials jsou stále správně schované.

Nepřidávat:

- fake citace;
- vymyšlené kluby;
- anonymní “coach said” proof bez opory.

Přidat až bude k dispozici:

- jméno klubu nebo alespoň ověřitelná role;
- krátká citace;
- konkrétní výsledek typu “hráči check-in vyplňovali X dní / trenér řešil watchlist před tréninkem”.

#### P1 — repo hygiene před produkčním releasem

V repozitáři jsou po dlouhé iteraci vidět pomocné a duplicitní soubory.

Před finálním nasazením projít:

- duplicate komponenty typu `HeroScene 2.astro`, `MelveoDataFlowHero 2.tsx`;
- staré screenshot/log artefakty v `.playwright-*` a `output/playwright`;
- nepoužívané komponenty/formuláře, které už nejsou renderované na landing page;
- smazané nebo přejmenované komponenty v git statusu, aby release commit neobsahoval omylem starý experiment.

Toto není produktový problém pro návštěvníka, ale je to release riziko.

#### P2 — aktualizovat právní / komunikační copy podle aktuálního obchodního flow

Landing page už nemá pilot form ani viditelný company trust block. Právní stránky ale stále obsahují firemní údaje a starší pilotové texty.

Před ostrým spuštěním zkontrolovat:

- zda `Terms` stále správně odpovídají aktuálním cenám a flow;
- zda “pilot program” v terms není v rozporu s tím, že landing už nemá pilot CTA/form;
- zda JSON-LD publisher má zůstat jako právní metadata, i když firma není viditelná v landing/footer.

### Ověření 2026-05-13

- `/cs/` vrací správně `html lang="cs"`, canonical `https://melveo.app/cs/` a český obsah.
- `/en/` vrací správně `html lang="en"`, canonical `https://melveo.app/en/` a anglický obsah.
- Dead-anchor kontrola homepage prošla: po opravě `#brzy` neexistují chybějící interní kotvy.
- `npm run build` prošlo, 9 statických stránek.
- In-app screenshot přes Codex browser aktuálně timeoutuje na `Page.captureScreenshot`; DOM kontrola stránky ale proběhla.
- `npm run check` nebyl v této re-audit iteraci označený jako prošlý, protože v předchozí iteraci uměl viset v diagnostice. Před releasem ho spustit samostatně.

### Aktuální verdikt

Web je nyní použitelná a srozumitelná prezentační stránka pro aktuální fázi Melveo.

Největší zbývající slabiny nejsou v hero copy ani v pricingu. Jsou to:

1. nedokončená honeycomb/scroll sekce;
2. chybějící reálné app screenshoty;
3. chybějící reálný pilot proof;
4. release hygiene po mnoha design iteracích.

Nejdůležitější princip pro další práci zůstává:

> Každá sekce musí návštěvníkovi pomoci rychle pochopit jednu věc:  
> **hráči posílají signály, Melveo je zpracuje, trenér ví, co má udělat.**
