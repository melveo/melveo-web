# Prompt: datově bohaté screenshoty pro nápovědu melveo.app (2. kolo)

Zkopíruj celý soubor jako zadání. Navazuje na `help-screenshots-prompt.md`, ale
řeší jinou věc. První kolo shánělo **chybějící obrazovky**. Tohle kolo shání
**stejné obrazovky ve stavu, který stojí za ukázání.**

---

## Proč se to dělá

Nápověda na melveo.app je živá a screenshoty v ní jsou aktuální. Několik jich ale
zachycuje appku v prázdném stavu: nulová zátěž, „Zatím bez aktivity“, šedé
proužky připravenosti u hráčů, kteří dnes nevyplnili check-in, `0 tréninků`,
`0/-  AU`. Návod má prodávat produkt, a prázdná obrazovka neprodává nic.

**Úkol: nafotit tytéž obrazovky s věrohodnými daty.** Ne vymyšlenými čísly
v grafickém editoru — skutečnými daty v aplikaci.

---

## Prostředí

Postup pro build, spuštění a seed je v `docs/help-screenshots-prompt.md`. Ve
zkratce: simulátor `Melveo-CI-Marketing`, Supabase stack `melveo_ci_marketing`
na portu 56421, aplikaci spouštět s `SIMCTL_CHILD_MELVEO_SUPABASE_URL` a
`SIMCTL_CHILD_MELVEO_SUPABASE_ANON_KEY`, demo klub seeduje
`scripts/seed_demo_club.sh`.

**Pozor — seed sám o sobě nestačí.** Vytvoří klub, hráče a historii, ale osobní
pohledy (Domů, Přehled) zůstávají prázdné, protože přihlášený účet nemá vlastní
aktivitu. Data je potřeba do appky dostat tak, aby je ta konkrétní obrazovka
uměla zobrazit — buď je vyplnit v aplikaci za víc účtů, nebo doplnit do databáze.

---

## Jak má vypadat „věrohodné“

Tohle je nejdůležitější část zadání. Data musí vypadat jako reálný tým v sezóně,
ne jako testovací fixtura.

- **Rozptyl, ne uniformita.** Když všech osm hráčů má připravenost 3/5, vypadá to
  jako výplň. Chce to mix: pár zelených, dva tři žlutí, jeden červený s bolestí.
- **Neúplnost je v pořádku a působí věrohodně.** Když má tým 8 hráčů a check-in
  vyplnilo 6, je to realističtější než 8/8 — a je na tom vidět, že produkt
  sleduje docházku.
- **Historie, ne jeden den.** Grafy a trendy potřebují aspoň 2–3 týdny zpětně,
  jinak jsou to dva body na přímce.
- **Žádné kulaté nuly.** `0 AU`, `0 tréninků`, `0 týdnů` — to všechno je stav,
  kterému se vyhýbáme.
- **Česká jména, český kontext.** Demo klub FC Demo Praha a jména typu
  Jakub Veselý fungují. Nepoužívej „Player 1“, „Test tým“, „Lorem“.
- **Nic osobního.** Žádné jméno skutečného člověka, žádný reálný e-mail.

---

## Seznam obrazovek

### Skupina A — priorita, tyhle prodávají produkt

| Soubor | Obrazovka | Jaká data na ní musí být |
|---|---|---|
| `coach-board-data.png` | Trenérský přehled dne | **Tohle je nejdůležitější obrázek celé nápovědy.** Tým, kde je vidět rozhodnutí: většina hráčů v pořádku, dva tři snížená připravenost, aspoň jeden s označenou bolestí. Musí být vidět, kolik lidí dnes vyplnilo check-in. |
| `coach-roster-data.png` | Soupiska očima trenéra | Všech 8 hráčů s číslem dresu, postem a **barevným proužkem připravenosti** — s rozptylem, ne osm stejných. Teď jsou tři z osmi šedé, což znamená „nevyplněno“. |
| `player-home-data.png` | Hráčovo Domů | Vyplněný dnešní check-in, **nenulová dnešní i týdenní zátěž**, série splněných check-inů aspoň týden, dnešní trénink v plánu. Teď je tam trojí nula a „Zatím bez aktivity“. |
| `prehled-data.png` | Přehled (osobní statistiky) | Týdenní zátěž v AU proti cíli, aspoň 3 tréninky za týden, kardio zátěž TRIMP, série splnění aspoň pár týdnů. Teď `0/- AU` a `0 týdnů`. |

### Skupina B — hloubka, ať návod není jen o onboardingu

| Soubor | Obrazovka | Jaká data na ní musí být |
|---|---|---|
| `wellness-trend.png` | Wellness / HRV trend hráče | Křivka aspoň za 2–3 týdny s viditelným kolísáním a pásmem osobního normálu. Jeden bod mimo pásmo je názorný. |
| `player-detail.png` | Detail hráče očima trenéra | Historie check-inů, mapa bolesti s označeným místem, trend připravenosti. Tohle je obrazovka, kterou v nápovědě nemám vůbec. |
| `session-summary.png` | Shrnutí po tréninku | Dokončený trénink s docházkou, RPE a zátěží — plán versus skutečnost. |
| `live-training.png` | Živý trénink | Běžící stopky, hráči rozdělení do tepových zón, aspoň dva s aktivním pásem. |
| `match-report.png` | Zápasový report hráče | Odehraný zápas s výsledkem, osobní statistiky, střelecká mapa, tepová křivka. |

### Skupina C — plánování

Původní obrazovky týdenního plánu a rozvrhu (`ScheduleWeekView`, `WeekPlanView`)
jsou v kódu mrtvé — nic v appce na ně nenaviguje. **Potřebuju vědět, co je
nahradilo**, a nafotit to s daty: naplánovaný týden s tréninky a zápasem.

| Soubor | Obrazovka | Jaká data |
|---|---|---|
| `planning.png` | Cokoli, čím dnes trenér plánuje týden | Týden s aspoň 2 tréninky a 1 zápasem, ideálně s plánovanou zátěží. |

Jestli takovou obrazovku appka nemá, napiš to — přepíšu podle toho text
trenérské stránky, který dnes o plánování mluví.

---

## Technické požadavky

Stejné jako v prvním kole: **iPhone na výšku** (trenérské přehledy klidně
**iPad na šířku**, jsou na to dělané), **tmavý motiv**, **česky**, **bez DEBUG
panelu**, **plné rozlišení PNG**. Ořez, převod do WebP a optimalizaci udělám já —
z 3,4 MB PNG jsem posledně vyrobil 636 KB.

**Sheety foť tak, aby za nimi nebyla vidět půlka jiné obrazovky.** U minulého
`invite-code` byla nad panelem uříznutá karta z Domů a musel jsem to ořezávat.

## Co dodat spolu se snímky

1. Cestu ke složce.
2. **Commit SHA aplikace** (`git -C ~/Developer/team_app_melveo_v1 rev-parse --short HEAD`).
3. **Jak jsi data dostal do appky** — jestli skriptem, ručním vyplněním, nebo SQL.
   Až budou screenshoty za půl roku zase staré, tohle ušetří celý den.
4. Které obrazovky se nafotit nepodařilo a proč.
5. Cokoli, co v appce vypadá rozbitě. Známý případ, který pořád platí: na hráčském
   „Domů“ je uprostřed české obrazovky anglické **„Today“** — nepřeložený řetězec.
