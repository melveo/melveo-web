# Ověřená fakta pro stránku Funkce (17. 11. 2026)

Zdroj: `melveo-app` `origin/main` c8598f31a, `docs/product/package_benefits.md`,
`personal_free_limits`. Cesty jsou pod `Melveo/Melveo/`. Při změně funkce nebo
tarifu v aplikaci projít tenhle seznam a texty `features.*` v `src/i18n/ui.ts`.

## Na webu záměrně není

- video zápasu a klipy v App Store buildu jsou (vlastník 17. 11.,
  `project.yml:275-279` zapíná session video v Release); na stránce Funkce je
  záměrně neukazujeme, screen videa na landingu je v pořádku. Příprava na soupeře
  na webu je, ukázaná přes rozbor soupeře (`opponent.analysis` Playbook,
  `opponent.prep` Gameplan).
- Přečti hru (jen TestFlight), Match Radar, Match Week Command Center, duel
  týmů (jen Debug), pohled rodičů, hodnocení rubrikou.
- Rozbor více zápasů (`package_benefits.md`: čeká na nový build).
- Číselné skóre připravenosti: server vrací stav, ne číslo
  (`Readiness/ReadinessOverviewCard.swift:25-30`). Na webu jen průměr
  ranního check-inu, jak ho ukazuje obrazovka.

## Slovo zdarma

Vlastník 17. 11.: na stránce nepsat zdarma ani free. Funkce základního
tarifu nemají štítek, limity se píšou jako základ a bez limitu v Playbooku.

## Nepsat (k 17. 11.)

- Sledování spánku a napojení Oura, WHOOP, Garmin, Polar Flow/AccessLink: v
  aplikaci není (`HRVWellnessContractTests.swift:22`, `ActivityImportConnector.swift:57-63`),
  jen v plánech bez termínu (`docs/planning/08_mvp_scope_and_backlog.md:71-72`).
- Hodnocení rubrikou, sekce Zápasy a Rozvoj ve výkonnostním profilu, cíle s komentáři
  trenéra, export: jen Debug nebo vypnuté (`PlayerTestingContracts.swift:5-23`).
- Že trenér vidí cíle hráče. HRV na hodinkách.

## Limity trenéra na základním tarifu (Throw-off)

30 položek knihovny (koš se počítá), 1 plán sezóny, 3 šablony týdne,
1 pokročilý report měsíčně, 10 uložených taktických tabulí, 3 úpravy přidělení
měsíčně. Přidělování programů hráčům je bez limitu
(`supabase/migrations/20261113_004_free_coach_limits.sql:5`).

## Funkce a tarif

| Funkce | Tarif na webu | Důkaz |
|---|---|---|
| Založení týmu, QR, odkaz, e-mail | Zdarma | `TeamInvites/TeamLinkSection.swift:103-176`, `TeamInviteSheet.swift:21,98` |
| Soupiska, docházka (6 stavů) | Zdarma | `Services/Account/SessionsService.swift:166-167` |
| Přehled dne, seznam bolestí (se souhlasem) | Zdarma | `CoachBoardToday/TeamTodayTile.swift:53-76`, `StaffAttention/StaffAttentionModels.swift:59-92` |
| Zátěž = RPE 1 až 10 × minuty, AU, proti vlastnímu normálu | Zdarma | `PersonalActivityLogView.swift:88,94`, `Roster/RosterModels.swift:419-430` |
| Plán sezóny | Zdarma s limitem, Playbook | `training.periodization`, `Calendar/TrainingPhaseModels.swift:3-77` |
| Knihovna | Zdarma s limitem, Playbook | `library.reuse`, `CoachLibraryModels.swift:59` |
| Živý zápas (jen házená) | Zdarma | `match.basic`, `LiveMatch/SportBoardRegistry.swift:19`, `LiveBoardSupportTypes.swift:320-352` |
| Report zápasu | Základní zdarma, pokročilý 1× měsíčně, Playbook | `report.advanced.create` |
| Živé tepy týmu | Gameplan | `team.sensors.live`, init 597 |
| Testování: vývoj a normy u trenéra | Playbook | `testing.advanced`, `team.testing.norms`, katalog init 468 |
| Zranění, OSTRC, návrat do hry | Zdarma (bez klíče tarifu) | `Injury/InjuryModels.swift:14-60`, `Ostrc/OstrcCheckInCard.swift:23` |
| Taktická tabule (jen házená) | 10 zdarma, Playbook | `board.basic`, `board.share`, `TacticBoardLibraryLive.swift:114-118` |
| Zprávy, šifrování MLS | Zdarma | `Messages/MessagesModel.swift:197-334` |
| Klima týmu, trenér vidí anonymní průměr | Zdarma | `CoachTeamFit/TeamClimatePresentation.swift:3-20`, `TeamPulseView.swift:5-7` |
| Preference komunikace, dlaždice u trenéra | Zdarma | `CommunicationPreferencesView.swift`, `CoachTeamMapComponents.swift:105` |
| Sdílení knihovny (kolekce e-mailem, čtení/úpravy) | Playbook | `library.share`, `LibraryContentSharedViews.swift:262-292` |
| Ranní check-in, mapa těla, přepínač sdílení | Zdarma | `MorningCheckInFlow5Axis.swift:40-46,254-324`, `AccountPermissionsView.swift:187-196` |
| Ranní HRV (Polar 60 s, Apple Watch), Focus Check | Zdarma | `PolarHRVMeasurementSheet.swift:5-27`, `FocusCheckSheet.swift:5-29` |
| Grafy hráče nad 30 dní | Momentum | `personal.trends.advanced` |
| Report hráče ze zápasu (bez dat spoluhráčů) | Zdarma | `PlayerMatchReport/PlayerMatchReportView.swift:5-8` |
| Tepové zóny Easy / Pro | Zdarma / Momentum | `zones.pro.edit` |
| Výsledky testů / vývoj / normy | Zdarma / Momentum / MVP | `testing.read`, `personal.testing.norms` |
| Vlastní program z katalogu | MVP (od trenéra zdarma) | `personal.programs` |
| Výkonnostní profil: radar 0 až 100 ze 7 oblastí testů, referenční rozsahy (ne percentil), poslední výsledek a rekord | Zdarma | `PlayerTestingProfileSections.swift:5-7`, `PlayerTestingAreaRadar.swift:3,16,66-76`, `project.yml:196` |
| Profil: graf vývoje, srovnání s loňskem, verdikt proti typické chybě testu | Momentum | `personal.trends.advanced`, `PlayerTestingResultsSurface.swift:80-91`, `PlayerTestingTrendViews.swift:4-23,303-337` |
| Normy pro věk (24 norem, 4 testy) | MVP (hráč), Playbook (trenér) | `personal.testing.norms`, `team.testing.norms`, `20261104_018_testing_norms_mvp.sql:139-163` |
| Rozvojové cíle: až 3 aktivní, test + cíl + termín, odhad data, soukromé | MVP | `personal.goals`, `20261104_020_personal_testing_goals.sql:20-156`, `PlayerTestingGoals.swift:54-80` |
| Ranní HRV: Polar H10/H9 nebo standardní BLE pás (0x180D), asi 2 minuty, RMSSD; Apple Watch SDNN; normál po 7 měřeních | Zdarma | `PolarHRVMeasurementSheet.swift:5-119`, `StandardHeartRateBleService.swift:5-7`, `MorningHRVBaselineProgress.swift:5-30` |
| Sedmičky (minihra) | Zdarma | `SevenMeters/SevenMeterModels.swift:21-82` |
| Apple Watch: vlastní trénink s tepem | Zdarma | `MelveoWatch/WatchWorkout.swift:7-71` |

## Obrazovky

`public/images/features/{cs,en}/`, každý jazyk zvlášť. Stav k 17. 11. 2026:

- Přefoceno na main 17. 11. (obě jazykové verze, HC Melveo, lokální stack
  `melveo_shots`): coach-today, needs-attention, roster-readiness,
  player-wellness. Data: `melveo-branding/social-kit/app-shots-kit/step-by-step/seed_wellness_pain_hcmelveo.sql`.
- Česky přefoceno 17. 11., anglicky ze série 01 až 04: team-invite, team-qr,
  season-phases, season-weeks, library-grid, library-assign. Pro české snímky
  byly názvy fází a cvičení dočasně přeloženy v lokální DB a pak vráceny.
- Zatím ze sad z 29. 10. a 2. 11., v obou složkách stejný anglický soubor:
  checkin-mood, checkin-bodymap, player-home, player-tempo, perf-profile, load-top,
  load-activity, player-rtp, climate-pulse, player-comms, live-hr, match-court,
  match-recent, report-court, report-goal, coach-tests, injury-card,
  injury-ostrc, opponent-prep. Potřebují přihlášení hráčky, zápas s událostmi,
  zranění, testy a živé tepy na stacku.

Bez videa a bez známých vad aplikace (soupiska je oříznutá pod hlavičkou kvůli
překryvu nadpisu a čipu týmu).
