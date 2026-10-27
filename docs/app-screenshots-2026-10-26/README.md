# Screenshoty aplikace pro sekci „Takhle to trenér vidí“ (26. 10. 2026)

Obrázky v `public/images/app-screens/{cs,en}/` jsou z aktuální aplikace
(`melveo-app` commit `05a7a8cee`, build 277), focené UI testem proti lokálnímu
Supabase stacku se simulovanými daty. Žádná produkce, žádní skuteční hráči.
Až budou zase staré, postup níže je zopakuje.

## Co je na snímcích

| Soubor | Zařízení | Obrazovka | Data |
|---|---|---|---|
| `iphone-home` | iPhone 17 Pro | Přehled trenéra | 7 z 8 check-inů, připravenost 4,1/5 |
| `iphone-team` | iPhone | Soupiska | 8 hráčů FC Demo Praha s připraveností |
| `iphone-player` | iPhone | Detail hráče | Ondřej Dvořák, únava + bolest kolene |
| `iphone-checkin` | iPhone | Ranní check-in | prázdný formulář hráče bez dnešního check-inu |
| `ipad-heart-rate` | iPad Pro 13" | Živý zápas, Tepy | ukázkový proud tepů (`MELVEO_DEMO_HR_LIVE`) |
| `ipad-report` | iPad | Report zápasu HC Demo 15:5 | vestavěná ukázka reportu (demo coach) |
| `ipad-video` | iPad | Video zápasu + Srovnat čas | video vyrobené z vygenerovaných snímků |
| `ipad-preparation` | iPad | Příprava na soupeře HC Tigers | 93 událostí přes RPC aplikace |

## Postup

1. **Aktuální aplikace v samostatném worktree** (hlavní checkout má rozdělanou práci):
   `git -C ~/Developer/melveo-app worktree add --detach ~/Developer/melveo-app-marketing origin/main`,
   do `Melveo/` zkopírovat `Melveo.xcconfig` a `Melveo.Release.xcconfig` z hlavního
   checkoutu, `xcodegen generate`.
2. **Vlastní lokální stack `melveo_shots` (porty 476xx)**, ne CI lane: config
   z `scripts/ci/prepare_supabase_lane.sh` s jiným `project_id` a porty, pak
   `stack-up.sh` (start, migrace, env soubor). CI lanes vyžadují zámek brány a CI
   si do nich seeduje vlastní data.
3. **Data:** `scripts/seed_demo_club.sh`, `scripts/qa/seed_demo_hrv_wellness.sql`,
   `scripts/qa/seed_readiness_ui.sql`, `scripts/qa/seed_demo_pain.sh`, pak tady
   `seed_web_shots.sql` (persony pryč ze soupisky, sdílení wellness, dnešní check-iny
   přes RPC, 21 dní HRV, 7 tréninků s RPE), `seed_scouting.sql` a
   `seed_scouting_events.sql` (Příprava). Tým potřebuje tarif `team_live`
   (viz `scripts/ci/prepare_recorded_match_ui.sql`).
4. **Simulátory** iOS 26.5: iPhone 17 Pro a iPad Pro 13" (M5), tmavý režim,
   `simctl status_bar … --time 9:41`.
5. **UI testy** z `app-local-patches.diff` (přidané testy `test_web_iphone`,
   `test_web_ipad`, `test_web_prep` do `MarketingTourUITests`, přepínač jazyka
   `MELVEO_SHOTS_LANG`). Spouští se `xcodebuild test-without-building` s
   `TEST_RUNNER_MELVEO_UI_TEST_LANE_CONTEXT_PATH` (soubor s
   `MELVEO_SUPABASE_URL` a `MELVEO_SUPABASE_ANON_KEY`),
   `TEST_RUNNER_MELVEO_TOUR_OUTPUT_DIR` a `TEST_RUNNER_MELVEO_SHOTS_LANG=cs|en`;
   živé tepy navíc `TEST_RUNNER_MELVEO_DEMO_HR_LIVE=1`,
   `TEST_RUNNER_MELVEO_INITIAL_MODE=Tepy` a test `test_tour_match_landscape`.
6. **Převod:** iPad PNG nesou orientaci v metadatech, proto `magick … -auto-orient`.
   WebP 400/640 (iPhone) a 900/1400 (iPad), kvalita 80.

## Lokální úpravy aplikace (necommitovat)

`app-local-patches.diff` obsahuje i dvě úpravy DEBUG ukázky videa, bez kterých
se video v ukázkovém režimu jen načítá: platnost přehrávacího odkazu
(`expiresAt` byla napevno v červenci 2026) a zapnuté automatické přehrávání.
Video se čte z `tmp/` v kontejneru aplikace na simulátoru
(`xcrun simctl get_app_container <udid> com.melveo.app data`), soubor
`melveo-ui-test-session-video.mp4`.

## Video zápasu

Dva širokoúhlé snímky házené (Codex, `image_generation`) → 12 minut videa:

```
ffmpeg -loop 1 -i match-frame-a.png -loop 1 -i match-frame-b.png -filter_complex "[0:v]scale=2560:-2,zoompan=z='1.08-0.0001*on':x='(iw-iw/zoom)*on/1499':y='(ih-ih/zoom)/2':d=1500:s=1280x720:fps=25[a];[1:v]scale=2560:-2,zoompan=z='1.0+0.0001*on':x='(iw-iw/zoom)*(1-on/1499)':y='(ih-ih/zoom)/2':d=1500:s=1280x720:fps=25[b];[a][b]concat=n=2:v=1[ab];[ab]loop=loop=5:size=3000:start=0,setpts=N/25/TB[v]" -map "[v]" -t 720 -c:v libx264 -crf 26 -pix_fmt yuv420p demo-match-recording.mp4
```

Produkční ukázkový tým HC Demo Praha jsem nepoužil: jeho video je skutečný
přenos zápasu a jeho použití mimo firmu není vyjasněné (viz
`melveo-app/scripts/qa/production_demo/README.md`).
