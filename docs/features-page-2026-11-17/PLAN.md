# Stránka Funkce (17. 11. 2026)

Jedna stránka na jazyk, která trenérovi a hráči ukáže, co Melveo umí. Doplňuje
nápovědu: Funkce říkají co, nápověda jak. Obsah vychází ze série Melveo step by
step (social-kit) a je ověřený proti `melveo-app` main k 17. 11. 2026.

## URL a navázání

| | cs | en |
|---|---|---|
| Stránka | `/cs/funkce/` | `/en/features/` |
| Kotva trenér | `#trener` | `#coach` |
| Kotva hráč | `#hrac` | `#player` |
| Kotva funkce | `#check-in`, `#knihovna`, … | `#check-in`, `#library`, … |

Odkazy na stránku: patička (všechny stránky), sekce screenshotů na landingu
(odkaz pod obrázky), rozcestník nápovědy. Z každého bloku vede odkaz do
nápovědy, pokud k funkci návod existuje, a na konci odkaz na ceník
`/{lang}/#pricing`.

## SEO

- `title` (BaseLayout přidá ` — Melveo`):
  cs `Funkce aplikace pro trenéry a hráče`, en `Features for coaches and players`.
- `description` do 155 znaků, s hlavními slovy: check-in, připravenost, zátěž
  (RPE), plán sezóny, knihovna cvičení, živý zápas, report, zranění.
- Jedna `h1`, `h2` pro perspektivu (Trenér, Hráč), `h3` pro kapitolu, `h4`
  pro funkci (`article` s kotvou). Nadpisy
  obsahují slova, která lidé hledají (ranní check-in hráčů, plánování sezóny,
  návrat po zranění), ne interní názvy obrazovek.
- Obě perspektivy jsou v HTML celé (žádný obsah skrytý za JS), přepínač jen
  posouvá a zvýrazňuje.
- JSON-LD: `SoftwareApplication` z BaseLayoutu dostane na této stránce
  `featureList` (seznam názvů funkcí v jazyce stránky) a `BreadcrumbList`
  (Melveo, Funkce).
- `hreflang` cs/en přes `alternatePath`, sitemap generuje Astro sama.
- Obrázky: WebP s průhledností, `width`/`height`, `srcset` dvě velikosti,
  `loading="lazy"` kromě úvodu, popisný `alt` v jazyce stránky.
- Kotvy na funkce, aby šly sdílet konkrétní funkce (IG popisky, nápověda).

## Struktura stránky

1. **Úvod**: nadpis, jedna věta, dvě velké karty Trenér / Hráč s počtem
   funkcí, za nimi koláž tří výřezů z aplikace, které se lehce vznášejí.
2. **Lepkavý přepínač** pod hlavičkou: Trenér | Hráč a kapitoly aktuální
   perspektivy. Při scrollu zvýrazňuje, kde čtenář je.
3. **Perspektiva Trenér**: kapitoly, v každé bloky funkcí, na konci mřížka
   Další funkce (ověřené funkce, ke kterým zatím není čistá obrazovka).
4. **Perspektiva Hráč**: totéž z pohledu hráče.
5. **Závěr**: co je zdarma, odkaz na ceník, stažení aplikace, nápověda.

Blok funkce: štítek tarifu, nadpis, jedna věta, tři krátké body, odkaz do
nápovědy. Vedle něj skleněná scéna s jedním až dvěma výřezy z aplikace. Bloky
se střídají vlevo a vpravo, na telefonu jsou pod sebou.

## Vizuál a efekty

Navazuje na landing: černé plátno, azurová, Inter a Comfortaa, žádné 1px
rámečky (zvýraznění světlem a stínem jako v nápovědě).

- Úvodní nadpis se odhaluje po písmenech (`text-reveal.ts`, už v repu).
- Pomalu dýchající azurová záře za koláží, výřezy se vznášejí a lehce
  reagují na pohyb myši.
- Bloky se při najetí do obrazu vysunou a rozostření zmizí, druhý výřez
  přijede s malým zpožděním.
- Scéna s výřezy má záři, která sleduje kurzor, a jemný paralaxní posun
  vázaný na scroll (CSS `animation-timeline: view()`, kde to prohlížeč umí).
- Štítek tarifu s přelévajícím se okrajem jako tlačítka na landingu.
- `prefers-reduced-motion`: všechno statické, obsah hned vidět.
- Bez nové knihovny. Jen CSS a jeden malý skript (scroll-spy, kurzor,
  odhalení), žádný ostrov Preactu.

## Pravidla obsahu

- Jen funkce z App Store buildu (bez `MELVEO_INTERNAL_FEATURES`). Nejsou tam:
  video a klipy, Přečti hru, pohled rodičů, duel týmů, Match Radar, Match Week
  Command Center, hodnocení rubrikou.
- Limity a tarify jen ověřené v kódu nebo DB, s odkazem na zdroj v
  `FACTS.md`.
- Žádné výřezy se známými vadami aplikace (české `Moje` v detailu cvičení,
  české zkratky postů na tabuli v anglickém UI, azurová kapsle `Add to
  training`, překryv nadpisu a čipu týmu).
- Žádné DPH, žádná výzva ke koupi v aplikaci, ceny jen odkazem na ceník.
