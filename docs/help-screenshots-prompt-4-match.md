# Prompt: screenshoty k vedení zápasu (4. kolo, iPad na šířku)

Prostředí, build, seed a definice „věrohodných dat“ jsou v předchozích zadáních
(`help-screenshots-prompt.md`, `-2`, `-3`). Sem je neopisuju — platí beze změny.

**Kontext:** na melveo.app vzniká nová stránka nápovědy **„Vedení zápasu“**
(`/cs/napoveda/zapas/`, `/en/help/match/`). Text je psaný, chybí k němu obrázky.
Tohle kolo je shání.

**Všechno z iPadu na šířku**, na rozdíl od předchozích kol.

---

## Co se ověřilo v kódu, ať se nefotí něco, co neexistuje

Prošel jsem zápasové obrazovky na dosažitelnost — tedy jestli se k nim uživatel
v appce vůbec dostane, ne jestli na ně existuje snapshot test. Tohle je **živé**:

- start zápasu z **Aktivit**
- živá zápasová obrazovka (skóre, soupeř, zapisování událostí, tep)
- detail zápasu a historie zápasů
- hráčský report po zápase se střeleckými mapami

A tohle je **mrtvý kód** — nefoť to a nepočítej s tím: `MatchWeekCommandCenterView`
(velín zápasového týdne), `MatchRadarCard`, `CoachBoardLiveDataSource`. Nic v appce
na ně nenaviguje. Screenshot „match-week“ z července byl přesně tenhle případ
a na web se proto nikdy nedostal.

---

## Seznam

| Soubor | Obrazovka | Co na ní musí být vidět |
|---|---|---|
| `match-start.png` | Spuštění zápasu z Aktivit | Moment, kdy trenér zápas zakládá — soupeř, případně výběr sestavy. Ať je poznat, že zápas se spouští **na místě**, ne plánuje dopředu. |
| `match-live.png` | **Nejdůležitější.** Živá zápasová obrazovka | Běžící zápas se **skóre proti pojmenovanému soupeři**, zapsané události a **živé tepy u hráčů v bpm** — ne prázdné pomlčky, ne „čeká na pás“. Alespoň tři hráči s tepem. |
| `match-events.png` | Zapisování herní situace | Moment zápisu události. Musí být vidět, **co všechno jde zapsat**: gól, střela, žlutá, červená, 2 minuty, 7 metrů. Ideálně s už zapsanou historií akcí, ne prázdným seznamem. |
| `match-detail.png` | Detail odehraného zápasu | Výsledek, počet událostí, sestava. Zápas **dokončený**, ne rozehraný. |
| `match-history.png` | Historie zápasů | Sekce „Zápasy“ s aspoň třemi odehranými zápasy a jejich výsledky. |
| `match-player-report.png` | Report hráče po zápase | Osobní statistiky, střelecké mapy (odkud a kam) a **tepová křivka přes celý zápas**. Z minulého kola tohle existuje, ale ať je to znovu a s konzistentním týmem — viz níže. |

---

## Na čem tomu kolu nejvíc záleží

**Tepy musí být vidět, ne čekat na pás.** Živý zápas bez tepů je půlka produktu.
Chce to nasimulovaný běžící zápas, kde má aspoň pár hráčů reálná bpm a jsou
rozložení do zón, ne všichni stejně.

**Herní situace musí být zapsané.** Prázdný seznam akcí neukáže nic. Ať je v zápase
odehrané aspoň pár minut s několika góly, střelami a jedním vyloučením — ať je vidět,
že produkt vede zápisník.

**Sjednoť názvy týmů.** V dosavadní sadě se míchá **FC Demo Praha**, **HC Melveo**
a **HC Demo**. Na jedné stránce vedle sebe to pozorný čtenář uvidí jako nepořádek.
Vyber jeden a drž ho napříč všemi šesti snímky; ideálně ten, který používá seed
demo klubu.

**Žádné „Koncept“ ani jiné stavové štítky rozpracovanosti**, pokud to jde. Minulý
zápasový report je měl a na návodu to vypadá jako nedodělek.

---

## Technické

- **iPad na šířku**, tmavý motiv, česky, plné rozlišení PNG
- **jeden snímek = jeden soubor.** Minule přišel `match-report.png` slepený ze dvou
  obrazovek nad sebou, každá s vlastní stavovou lištou — takový se použít nedá.
- **zdrojové PNG nedávej do `public/`** — kopírovaly by se do produkčního buildu
- **plovoucí spodní lišta překrývá obsah**; když půjde odscrollovat tak, aby podstatné
  nebylo pod ní, ušetří to ořezávání
- ořez, WebP a optimalizaci dělám já

## Co dodat spolu se snímky

1. Cestu ke složce.
2. **Commit SHA aplikace.**
3. **Jak jsi zápas a jeho data nasimuloval** — tohle je u zápasu cennější než kdy jindy,
   protože běžící zápas s tepy se nedá naseedovat jedním SQL příkazem.
4. Které obrazovky se nepodařilo nafotit a proč.
5. Cokoli, co v appce vypadá rozbitě. Ze zápasové části zatím vím o třech věcech:
   „Plán není vyplněný“ nad vyplněným plánem 360 AU, nevykreslená docházka a RPE
   u dokončeného tréninku, a nepřeložené řetězce („Today“, „Cardio Load“).
