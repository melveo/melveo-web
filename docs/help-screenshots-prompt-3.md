# Prompt: dokončení screenshotů pro nápovědu melveo.app (3. kolo)

Navazuje na `help-screenshots-prompt.md` (prostředí, build, seed) a
`help-screenshots-prompt-2.md` (co znamená „věrohodná data“). Prostředí a
technické požadavky z nich platí beze změny — sem je neopisuju.

**Stav:** nápověda je živá na https://melveo.app/cs/napoveda/ a jede na 23
screenshotech. Z minulé dodávky šesti se použily tři: `coach-board-data`,
`player-detail` a `wellness-trend`. Ty byly výborné. Tenhle prompt řeší
zbývající tři, které se použít nedaly, tři, které vůbec nepřišly, a jednu
otázku, na kterou potřebuju odpověď místo obrázku.

---

## Část 1 — tři, které je potřeba přefotit

### 1a. `prehled-data.png` a `player-home-data.png` — pořád vedou nulami

Na Přehledu je největší číslo na obrazovce **`0/- AU` a `0 tréninků`**, kardio
zátěž **TRIMP 0**. Na Domů jsou v bloku Aktivita **tři nuly** a text „Zatím bez
aktivity“. Přitom kartička „Aktivity · Dnes · 52 min · Posilovna“ na Přehledu
reálná byla.

**Diagnóza:** data se povedlo dostat do týmových a wellness pohledů, ale ne do
**osobní tréninkové zátěže**. Účtu, přes který se fotilo, chybí zaznamenané
tréninky s AU a RPE.

**Co je potřeba udělat, aby to bylo hotové:** u toho účtu zaznamenat **2–3
tréninky za tento týden** s vyplněnou zátěží a RPE, a aspoň jeden i minulý týden,
ať má týdenní srovnání proti čemu stát. Teprve pak fotit. Chci vidět nenulovou
dnešní i týdenní zátěž, počet tréninků aspoň 3 a sérii splnění aspoň pár týdnů.

### 1b. `coach-roster-data.png` — sedm z osmi proužků připravenosti je šedých

Barevný proužek má jediný hráč, zbylých sedm je prázdných. To je proti minulému
kolu **krok zpět** (tehdy byly tři z osmi šedé) a hlavně to **odporuje** obrázku
`coach-board-data`, který vedle toho hlásí „7/8 check-inů“. Vedle sebe na jedné
stránce by to čtenář přečetl jako chybu produktu.

**Hypotéza, kterou prosím ověř:** hráči check-in odeslali, ale **nesdílejí ho
s trenérem**, takže denní přehled je započítá a soupiska je zobrazit nesmí. Na
`wellness-trend` je vidět štítek „Nesdíleno“ a text „HRV hráč nesdílí“, což tomu
odpovídá.

Jestli je to tak, oprava není v focení, ale v datech: **zapnout sdílení
u aspoň šesti z osmi hráčů** a pak teprve fotit. Ať výsledek ukazuje rozptyl —
pár zelených, dva tři žluté, jeden červený.

Jestli je příčina jiná, napiš jaká. Pokud jde o chybu v appce, chci to vědět —
nebudu ji zakrývat vhodně zvoleným screenshotem.

---

## Část 2 — tři, které nepřišly

Zadané byly v druhém kole, ve skupině B. Pořád je chci, se stejnými požadavky na
data:

| Soubor | Obrazovka | Jaká data |
|---|---|---|
| `session-summary.png` | Shrnutí po dokončeném tréninku | Docházka, RPE, zátěž — plán versus skutečnost. |
| `live-training.png` | Živý trénink | Běžící stopky, hráči rozdělení do tepových zón, aspoň dva s aktivním pásem. |
| `match-report.png` | Zápasový report hráče | Odehraný zápas s výsledkem, osobní statistiky, střelecká mapa, tepová křivka. |

---

## Část 3 — otázka, ne screenshot

Původní obrazovky týdenního plánu a rozvrhu (`ScheduleWeekView`, `WeekPlanView`)
jsou v kódu appky **mrtvé** — nic na ně nenaviguje, existují jen proto, že si je
snapshot testy vykreslují izolovaně. Kvůli tomu jsem ze stránek odstranil obrázek
kalendáře, který v appce už neexistuje.

**Potřebuju vědět, čím dnes trenér plánuje týden.** Podle odpovědi přepíšu text
trenérské stránky, který o plánování pořád mluví.

- Když taková obrazovka existuje → nafoť ji jako `planning.png`, s týdnem,
  ve kterém jsou aspoň dva tréninky a jeden zápas, ideálně s plánovanou zátěží.
- Když neexistuje → napiš to jednou větou. Text přepíšu tak, aby neslibovala
  něco, co produkt neumí.

---

## Připomenutí ke zpracování

- **Zdrojové PNG nedávej do `public/`.** Minule tam byly a kopírovaly se do
  produkčního buildu. Dej je kamkoli mimo a pošli cestu.
- **Sheety foť tak, aby za nimi nebyla vidět půlka jiné obrazovky.**
- **Spodní plovoucí lišta překrývá obsah** — u `player-detail` a `wellness-trend`
  jsem musel ořezávat nad ní. Když půjde odscrollovat tak, aby podstatné nebylo
  pod lištou, ušetří to práci.
- Ořez, WebP a optimalizaci dělám já.

## Co dodat spolu se snímky

1. Cestu ke složce.
2. **Commit SHA aplikace.**
3. **Jak jsi data dostal do appky** — u minulé dodávky tohle chybělo a je to
   přesně ta informace, která by teď ušetřila celé jedno kolo.
4. Které obrazovky se nepodařilo nafotit a proč.
5. Odpověď na část 3.
