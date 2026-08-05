# Prompt: nafotit screenshoty pro sekci nápovědy melveo.app

Zkopíruj celý tento soubor jako zadání. Je psaný tak, aby ho zvládl někdo, kdo
o projektu nic neví.

---

## Co se po tobě chce

Nafotit chybějící screenshoty iOS aplikace Melveo pro sekci nápovědy na webu
melveo.app. Screenshoty musí odpovídat **současné aplikaci** — ne snapshot testům
v repu appky. Ty obsahují i obrazovky, které v appce už neexistují (například
kalendářový týdenní přehled), protože snapshot test si view vykreslí izolovaně
i tehdy, když se k němu uživatel nemá jak dostat.

Hotové screenshoty ukládej jako PNG v plném rozlišení do jedné složky a řekni,
kde je. Ořez, převod do WebP a optimalizaci zajistí navazující krok — ty se tím
nezabývej.

## Prostředí — už je připravené, takhle se spouští

Repo aplikace: `~/Developer/team_app_melveo_v1`
Web, kam screenshoty míří: `~/Developer/melveo-web/public/images/help/`

**Simulátor:** `Melveo-CI-Marketing`, UDID `8FA2559C-05C4-4498-9C63-8BB9DFF4E345`

**Backend:** lokální Supabase stack `melveo_ci_marketing`, API na portu **56421**,
databázový kontejner `supabase_db_melveo_ci_marketing`, DB port 56422.

**Build a spuštění:**

```
xcodebuild -project ~/Developer/team_app_melveo_v1/Melveo/Melveo.xcodeproj -scheme Melveo -destination "id=8FA2559C-05C4-4498-9C63-8BB9DFF4E345" build
```

Aplikaci je nutné spustit s proměnnými, jinak nenajde backend a demo přihlášení
spadne na `networkError`. Anon klíč je v `Melveo/Melveo.xcconfig` pod
`MELVEO_SUPABASE_ANON_KEY`:

```
SIMCTL_CHILD_MELVEO_SUPABASE_URL="http://127.0.0.1:56421" \
SIMCTL_CHILD_MELVEO_SUPABASE_ANON_KEY="<klíč z Melveo.xcconfig>" \
xcrun simctl launch 8FA2559C-05C4-4498-9C63-8BB9DFF4E345 com.melveo.app
```

**Demo data** (idempotentní, dá se pouštět opakovaně) — seeduje klub FC Demo Praha,
ownera, trenéra, 8 hráčů, dnešní check-iny, dokončený trénink s RPE a odehraný zápas:

```
cd ~/Developer/team_app_melveo_v1
SUPABASE_DB_CONTAINER=supabase_db_melveo_ci_marketing SUPABASE_API_PORT=56421 \
SUPABASE_DB_PORT=56422 SUPABASE_LOCAL_API_URL=http://127.0.0.1:56421 \
bash scripts/seed_demo_club.sh
```

**Demo účty** (heslo u všech `test`): `demo_owner@melveo.test`,
`demo_coach@melveo.test`, `demo_p01@melveo.test` … `demo_p08@melveo.test`.

## Dvě známé překážky — počítej s nimi

1. **Demo tlačítka na přihlašovací obrazovce onboarding přeskakují.** Přihlásí
   rovnou do appky, takže rozcestník, obrazovky s oprávněními ani zadání kódu
   se přes ně nafotit nedají. Na ty potřebuješ účet **bez členství v týmu** —
   buď nový přes e-mail (jednorázový kód si vytáhni z databáze, marketingový
   stack nemá mail catcher), nebo vlož uživatele přímo do `auth.users`.
2. **Tabulka `invites` je prázdná.** Pro obrazovky s pozvánkou buď nech pozvánku
   vygenerovat trenérem v appce (to je zároveň screenshot č. 5), nebo vlož řádek
   do `public.invites`. Kód má 6–8 znaků, sloupce: `code`, `role`,
   `team_season_id`, `club_id`, `expires_at`. Klub FC Demo Praha má
   `club_id = 00000000-0000-0000-0000-000000000001`,
   `team_season_id = 00000000-0000-0000-0000-000000000003`.

---

## Seznam screenshotů

### Skupina A — nutné, bez nich mají sekce návodu kroky bez obrázků

| Soubor | Obrazovka | Co na ní musí být vidět |
|---|---|---|
| `rozcestnik.png` | Rozcestník po prvním přihlášení | Nadpis „Jak to rozjedeme?“ a **obě** volby: „Připojit se do týmu“ (podtitul o pozvánkovém kódu) a „Vytvořit vlastní tým“. Včetně poznámky dole o kontaktování trenéra. |
| `invite-code.png` | Zadání pozvánkového kódu | **Prázdné** pole „Kód pozvánky“, nápověda o 6–8 znacích a možnosti vložit celý odkaz, a tlačítko na skenování QR. Bez chybové hlášky. |
| `invite-confirm.png` | Potvrzení pozvánky | Stav „Pozvánka nalezena“ s **vyplněným názvem týmu a sportem** a platností. Musí být vidět tlačítko pro přijetí. Použij smysluplný název týmu, ne testovací řetězec. |
| `create-team.png` | Vytvoření týmu, krok 1 | Krok „1 / 4“, pole pro název týmu a volbu loga. Nech pole **prázdná** — je to výchozí stav, který uživatel uvidí. |

### Skupina B — hodně by pomohly

| Soubor | Obrazovka | Co na ní musí být vidět |
|---|---|---|
| `coach-invite.png` | Kde trenér vyrobí pozvánku | Obrazovka, ze které se kód nebo odkaz sdílí hráčům. **Kód musí být vidět.** Tuhle obrazovku jsem v kódu nenašel, takže ji potřebuju vidět, abych o pozvánkách mohl psát konkrétně místo obecně. |
| `notifications.png` | Onboarding — oprávnění k notifikacím | Celá obrazovka včetně vysvětlení, proč appka notifikace chce, a možnosti přeskočit. |
| `healthkit.png` | Onboarding — oprávnění Apple Health | Totéž pro HealthKit. |
| `first-landing.png` | První obrazovka po dokončení nastavení | To, co uživatel uvidí hned po onboardingu, **s daty** — ne prázdný stav. |

### Skupina C — pro FAQ

| Soubor | Obrazovka | Co na ní musí být vidět |
|---|---|---|
| `delete-account.png` | Mazání účtu, krok 1 | Rozpis, co se smaže okamžitě (profil, check-iny, historie sessions, propojení Apple Health) a co zůstane (anonymizované týmové statistiky, audit log). Tenhle výčet je celá hodnota obrázku — musí být čitelný. |
| `language.png` | Přepínač jazyka v účtu | Seznam dostupných jazyků s vyznačeným aktivním. |
| `apple-health.png` | Připojení Apple Health v nastavení účtu | Stav propojení a co se z Health čte. |

### Skupina D — volitelná náhrada

`coach-board.png`, `roster.png`, `sessions.png` — trenérský přehled dne, soupiska
a spouštěč session. Momentálně na webu jedou ze snapshot testů, které jsou ze
stejného dne jako jejich zdrojový kód, takže je držím za platné. Když je nafotíš
znovu, nafoť je **z iPadu na šířku**, jak jsou teď. Priorita nízká.

---

## Požadavky na všechny snímky

- **iPhone**, na výšku (výjimka: skupina D z iPadu na šířku)
- **tmavý motiv**, **česky**
- **bez DEBUG panelu** — na přihlašovací obrazovce se dole zobrazuje panel
  „DEMO PŘIHLÁŠENÍ“ se štítkem DEBUG, který v ostré appce není. Buď fotit tak,
  aby v záběru nebyl, nebo dát vědět, ať se ořízne.
- **s daty, ne prázdné stavy** — u soupisky, boardu a přehledů ať tam někdo je
  a ať čísla nejsou nulová
- **plné rozlišení**, PNG
- **žádná skutečná osobní data.** Demo fixtures (Jakub Veselý, FC Demo Praha)
  jsou v pořádku. Pokud se někde objeví jméno skutečného člověka — třeba
  v profilu účtu — řekni to a nefoť to.

## Co dodat spolu se snímky

1. Cestu ke složce se snímky.
2. **Commit SHA aplikace**, proti kterému jsi fotil (`git -C ~/Developer/team_app_melveo_v1 rev-parse --short HEAD`). Bez toho se za rok nedá zjistit, jak jsou staré.
3. Seznam obrazovek ze skupin A–C, které se nafotit **nepodařilo**, a proč.
4. Upozornění na cokoli, co v appce vypadá rozbitě. (Známý případ: na hráčském
   „Domů“ je uprostřed české obrazovky anglické „Today“ — nepřeložený řetězec.)
