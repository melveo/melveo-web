/**
 * Translation strings — single source of truth.
 *
 * Per PLAN.md §16.5: locale-keyed dictionaries. Components consume
 * via `t(lang, key)` helper. JSON content collections will replace
 * this for long-form content (Privacy / Terms) in V4-B; this file
 * keeps short UI strings.
 */

export const languages = {
  cs: 'Česky',
  en: 'English',
} as const;

export const defaultLang = 'cs';
export type Lang = keyof typeof languages;

export const testFlightUrl = 'https://testflight.apple.com/join/M6Td9ADA';

export const ui = {
  cs: {
    // Header / footer
    'nav.contact': 'hello@melveo.app',
    'footer.copyright': '© 2026 melveo',
    'footer.privacy': 'Ochrana soukromí',
    'footer.terms': 'Podmínky',
    'footer.help': 'Nápověda',
    'footer.cookieSettings': 'Nastavení cookies',
    'footer.githubAria': 'Melveo na GitHubu',
    'footer.instagramAria': 'Melveo na Instagramu',
    'a11y.skipContent': 'Přeskočit na obsah',

    // Hero
    /*
      Hero copy 2026-05-15 — trimmed per user feedback ("strašně moc
      informací, texty splývají s pozadím"). Shorter eyebrow (3 words),
      3-variant rotation instead of 6 (the weak ones never read because
      users left before the cycle reached them), and subline cut from
      28 → 13 words. Pair with a text-shadow on the headline + subline
      in Landing.astro for legibility against the particle backdrop.
    */
    'hero.eyebrow': '',
    'hero.headlinePrefix': 'Z hráčských signálů vzniká jasné rozhodnutí.',
    'hero.headlineLine1': 'Z hráčských signálů',
    'hero.headlineLine2': 'vzniká',
    'hero.headlineSuffix': '.',
    'hero.headlineInitial': 'jasné rozhodnutí',
    'hero.headlineRotations':
      'jasné rozhodnutí|lepší trénink|včasné upozornění|plán regenerace|akce pro trenéra|kontext pro celý tým',
    'hero.subline':
      'Melveo propojí [[wellness]], [[readiness]], [[zátěž]] a [[kontext zápasu]], aby trenér věděl, co udělat dál.',
    'hero.cta.appstore': 'Stáhnout v App Store',
    'hero.cta.appstoreEyebrow': 'Stáhnout v',
    'hero.cta.appstoreTitle': 'App Store',
    'hero.cta.installHelp': 'Jak nainstalovat beta verzi přes TestFlight',
    // Key kept as `pilot` for legacy reference; label is now generic
    // contact CTA (pilot offering retired 2026-05-04).
    'hero.cta.pilot': 'Mám zájem →',
    'hero.beta': 'TestFlight beta · brzy',

    // Stage 2+3 — scroll-linked image grid morph (Kevin Gutowski codepen)
    'gridMorph.headlineLine1': 'Pojďme',
    'gridMorph.headlineLine2': 'scrollovat.',
    'gridMorph.subline': 'Tým, trenér, zázemí — všechno v jedné aplikaci.',
    'gridMorph.scrollHint': 'Scrolovat',

    // Stage 2/3 — product-proof labels inside the honeycomb morph.
    // These now read as a flow: player inputs → team signal → coach
    // output, matching WEB-REVIEW-2026-05-12 §2.
    'gridCard.checkin': 'Ráno',
    'gridCard.sessions': 'Stav',
    'gridCard.attendance': 'Signál',
    'gridCard.load': 'Zátěž',
    'gridCard.coachBoard': 'Coach',
    'gridCard.recovery': 'Trend',
    'gridCard.decisions': 'Plán',
    'gridCard.privacy': 'Data',
    'gridCard.wellness': 'Wellness',
    'gridCard.sessionsPlan': 'Trénink',
    'gridCard.watchlist': 'Riziko',
    'gridCard.reports': 'Report',
    'gridCard.roles': 'Role',
    'gridCard.context': 'Kontext',
    'gridCard.sleep': 'Spánek',
    'gridCard.mood': 'Nálada',
    'gridCard.pain': 'Bolest',
    'gridCard.fatigue': 'Únava',
    'gridCard.hrv': 'HRV',
    'gridCard.symptoms': 'Symptomy',
    'gridCard.match': 'Zápas',
    'gridCard.rotation': 'Rotace',
    'gridCard.readiness': 'Ready',
    'gridCard.rpe': 'RPE',
    'gridCard.attendance2': 'Docházka',
    'gridCard.notes': 'Poznámky',
    'gridCard.export': 'Export',
    'gridCard.alerts': 'Alerty',
    'gridCard.calendar': 'Kalendář',
    'gridCard.team': 'Tým',

    // Alt texty fotek v image gridu (a11y + image SEO). Věcné popisy
    // scény — žádný marketing, čte je screen reader.
    'gridAlt.coach-player-wide-crop': 'Trenér v hale probírá data s hráčem nad tabletem',
    'gridAlt.player-checkin': 'Hráč v šatně vyplňuje ranní check-in v aplikaci Melveo',
    'gridAlt.player-mobile': 'Hráč v šatně vyplňuje ranní wellness check-in na mobilu',
    'gridAlt.coach-player-review': 'Trenér s hráčem prochází zpětnou vazbu na tabletu',
    'gridAlt.coach-field-tablet': 'Trenér na hřišti sleduje tréninková data na tabletu',
    'gridAlt.team-sideline-wide': 'Hráčka v dresu Melveo běží při tréninku v dešti',
    'gridAlt.player-portrait': 'Portrét soustředěného hráče před tréninkem',
    'gridAlt.player-action': 'Hráč v plné akci během zápasu',
    'gridAlt.player-defense': 'Hráč v obranném postavení během utkání',
    'gridAlt.coach-hall-tablet': 'Trenér ve sportovní hale s tabletem v ruce',
    'gridAlt.player-locker': 'Hráč v šatně při přípravě před tréninkem',
    'gridAlt.jersey-brand': 'Týmový dres s logem Melveo',
    'gridAlt.coach-team-dialogue': 'Trenér v dialogu s týmem při tréninku',
    'gridAlt.coach-player-close': 'Trenér v rozhovoru s hráči na tréninkovém hřišti',
    'gridAlt.team-briefing-wide': 'Týmová porada s trenérem před zápasem',

    // Stage 3 — gooey punctuation. Split into two parts so the
    // "Synced." word can be coloured with brand cyan.
    'gooey.headlinePrefix': 'Trenér + hráč.',
    'gooey.headlineAccent': 'Synced.',

    // Stage 3.75 — scroll-timeline word highlight (Daniel Haim codepen)
    'wordScroll.prefix': 'Trenér ví',
    'wordScroll.screenReader':
      'Trenér ví, kdo je unavený, kdo se bojí o roli, koho dnes hlídat, kdo je připravený, co změnit v plánu a kde rozhodnout.',
    'wordScroll.words':
      'kdo je unavený|kdo se bojí o roli|koho dnes hlídat|kdo je připravený|co změnit v plánu|kde rozhodnout',

    // Stage 4 — wellness
    'wellness.eyebrow': '',
    'wellness.headline': 'Wellness za 30 sekund.',
    'wellness.body':
      'Hráč ohodnotí energii, spánek, bolest, náladu a motivaci. Z toho vidíš stav celého týmu.',
    'wellness.tag': '',

    // Stage 5 — cursor-mask (Giomgio codepen abxGyQX). Two layered
    // static headlines per the codepen ("Have a nice day!" + "It will
    // be sunny" pattern). Outside the cursor circle = primary; inside
    // the circle = secondary. No JS rotation — the only "change" is
    // the cursor sweeping across.
    'orb.primary': 'Pro celý klub.',
    'orb.secondary': 'Pro každého hráče.',
    'orb.hint': 'Klikni a nakláněním ovládej',
    'orb.hintActive': 'Nakláněj telefon nebo táhni prstem',
    'orb.hintDesktop': 'Klikni a táhni',
    'orb.hintDesktopActive': 'Táhni myší',
    'orb.hintMobile': 'Klepni a nakláněj',
    'orb.hintMobileActive': 'Nakláněj telefon nebo táhni',
    'orb.hintNeedsHttps': 'Naklánění vyžaduje HTTPS',
    'orb.gyroPermission': 'Povolit ovládání nakláněním?',

    // Stage 6.25 — Technical-feature mini bridge before pricing.
    // Same visual family as gooey stage. Pairs the live-data feature
    // (coach board real-time) with the anti-feature differentiator
    // (no spreadsheets, no paper, no WhatsApp groups) — fits the
    // visual of two cyan values merging into one promise.
    'promise.headlinePrefix': 'Realtime data.',
    'promise.headlineAccent': 'Bez papíru.',

    // Stage 6 — sessions + coach board
    'sessions.eyebrow': '',
    'sessions.headline': 'Sessions a coach board.',
    'sessions.body':
      'Naplánuj trénink, zaznamenej účast, sleduj zátěž. Než dojdeš na hřiště, víš co tým potřebuje.',

    // Stage 6.5 — Pricing
    'pricing.eyebrow': '',
    'pricing.headline': 'Začni zdarma.',
    'pricing.headlineAccent': 'Jeden tarif pro celý tým.',
    'pricing.subline': 'Jedna licence pro celý tým. Transparentní ceny v Kč.',
    // Daňová poznámka — AKTUÁLNĚ SE NERENDERUJE (rozhodnutí majitele
    // 2026-06-10: na landingu žádné zmínky o DPH). String zůstává
    // připravený; firma není plátce DPH (ověřeno v registru 2026-06-10).
    // Kdyby se renderování vracelo: PricingStage.astro pod subline,
    // a po případné registraci k DPH změnit na „Ceny bez DPH.“ — daň
    // počítat v checkoutu (Stripe Tax / MoR), nikdy přepínačem.
    'pricing.vatNote': 'Ceny jsou konečné — nejsme plátci DPH.',
    'pricing.toggleMonthly': 'Měsíčně',
    'pricing.toggleYearly': 'Ročně',
    'pricing.toggleSavings': '−17 %',
    'pricing.perDay': '/ den za tým',
    'pricing.perMonth': '/ měsíc',
    'pricing.perYear': '/ rok',
    'pricing.billedYearly': 'Účtováno ročně',
    'pricing.billedMonthly': 'Účtováno měsíčně',
    'pricing.perMonthEffective': '~ {amount} / měsíc',
    'pricing.popular': 'Nejoblíbenější',
    'pricing.included': 'Co je v plánu',
    'pricing.ctaFree': 'Test s menší skupinou',
    'pricing.ctaPilot': 'Mám zájem',
    'pricing.free': 'Zdarma',
    'pricing.athleteHeading': 'Potřebujete víc hráčů?',
    'pricing.athleteBody':
      'Athlete Pack rozšíří tým o dalších 10 hráčů za 5 900 Kč/rok (max 1 pack na tým).',
    'pricing.clubHeading': 'Individuální plán',
    'pricing.clubBody':
      'Pro více týmů, akademii nebo celý klub. Vlastní podmínky, integrace a osobní podpora. Napiš nám.',
    'pricing.disclaimer':
      'Všechny platby zpracovává Stripe.',

    // Section dots nav (fixed right, desktop only) + promo video stage
    'sectionNav.label': 'Navigace sekcí',
    'sectionNav.top': 'Úvod',
    'sectionNav.app': 'Aplikace',
    'sectionNav.data': 'Data',
    'sectionNav.coach': 'Trenér ví',
    'sectionNav.video': 'Ukázka',
    'sectionNav.pricing': 'Ceník',
    'sectionNav.faq': 'Otázky',
    'sectionNav.contact': 'Kontakt',

    // Stage 4.5 — promo video v iPhone rámu
    'promo.eyebrow': '',
    'promo.headline': 'Podívej se, jak to hraje.',
    'promo.body': '30 sekund od hráčských signálů k rozhodnutí trenéra.',
    'promo.soundOn': 'Zapnout zvuk',
    'promo.soundOff': 'Vypnout zvuk',
    'promo.play': 'Přehrát video',
    'promo.pause': 'Pozastavit video',
    'promo.videoAria': 'Promo video Melveo — z hráčských signálů k rozhodnutí trenéra',

    // Stage 6.75 — Data-flow visualization.
    // Standalone section for now; planned replacement for the simpler
    // DATA -> FEEDBACK promise after visual validation.
    'dataFlow.eyebrow': '',
    'dataFlow.headline':
      'Z hráčských vstupů vzniká kontext pro trenéra.',
    'dataFlow.body':
      'Wellness, docházka, RPE a sessions. Vše v jednom přehledu — při tréninku i zápase.',
    'dataFlow.playersTitle': 'Hráči posílají signály',
    'dataFlow.playersBody':
      'Každý bod je hráč. Krátké vstupy průběžně během dne.',
    'dataFlow.coreTitle': 'melveo',
    'dataFlow.coreBody': 'Týmový signál v jednom místě.',
    'dataFlow.coachTitle': 'Trenér dostává kontext',
    'dataFlow.coachBody':
      'Coach board ukáže, co řešit před tréninkem i zápasem.',
    'dataFlow.signals':
      'Wellness|RPE|Docházka|Readiness|Spánek|Bolest|Motivace|Únava',
    'dataFlow.decisions':
      'Upravit zátěž|Individuální regenerace|Změnit roli v zápase|Zvýšit monitoring|Pustit do plného tréninku',
    'dataFlow.mobileStep1': 'Hráč pošle krátký vstup',
    'dataFlow.mobileStep2': 'Melveo ho spojí s ostatními signály',
    'dataFlow.mobileStep3': 'Trenér vidí kontext pro rozhodnutí',

    // Stage 7 — data feedback promise
    'privacy.eyebrow': '',
    'privacy.headlineLine1': 'Každý vstup má',
    'privacy.headlineLine2': 'výstup pro trenéra.',
    'privacy.body':
      'Wellness, docházka, RPE a sessions se mění v přehledy, se kterými může trenér hned pracovat.',

    // Lead capture forms (App Store notify + Pilot inquiry, T14 + T15)
    'lead.notifyHeading': 'Dej nám e-mail.',
    'lead.notifyBody': 'Dáme ti vědět hned jak Melveo dorazí do App Store.',
    'lead.emailPlaceholder': 'tvoje@adresa.cz',
    'lead.emailLabel': 'E-mail',
    'lead.notifyCta': 'Dej mi vědět',
    'lead.notifyCtaSending': 'Odesílám…',
    'lead.notifySuccess': 'Hotovo. Dáme ti vědět při launchi.',
    'lead.notifyError':
      'Něco se nepovedlo. Napiš nám rovnou na hello@melveo.app.',

    'lead.pilotHeading': 'Vyžádat pilot.',
    'lead.pilotBody':
      '15 minut hovoru, demo appky, pilot 1 970 Kč na 30 dní s garancí vrácení peněz.',
    'lead.clubLabel': 'Klub',
    'lead.clubPlaceholder': 'SK Slavia Praha',
    'lead.sportLabel': 'Sport',
    'lead.sportPlaceholder': 'fotbal, hokej, volejbal…',
    'lead.roleLabel': 'Tvoje role (volitelné)',
    'lead.rolePlaceholder': 'hlavní trenér, manažer…',
    'lead.messageLabel': 'Zpráva (volitelné)',
    'lead.messagePlaceholder': 'Cokoliv co bychom měli vědět před hovorem.',
    'lead.pilotCta': 'Odeslat',
    'lead.pilotSuccess': 'Děkujeme. Ozveme se do 1 pracovního dne.',

    // Field validation strings (client-side)
    'lead.errEmailRequired': 'Vyplň e-mail.',
    'lead.errEmailInvalid': 'Tohle nevypadá jako e-mail.',
    'lead.errClubRequired': 'Vyplň jméno klubu.',
    'lead.errSportRequired': 'Vyplň sport.',

    // Stage 6.75 — App screenshot showcase (placeholder pre real images)
    // User dodá reálné iOS screenshoty appky později. Do té doby
    // se zobrazí 3 prázdné phone-frame placeholdery v správném layoutu
    // — když přijdou skutečné obrázky, stačí je dropnout do
    // /public/images/app-shots/ a v komponentě prohodit src.
    'appShots.eyebrow': '',
    'appShots.headline': 'V telefonu hráče i trenéra.',
    'appShots.body':
      'Tři obrazovky: ranní wellness pro hráče, sessions pro trenéra, coach board pro realizační tým.',
    'appShots.shot1Title': 'Ranní wellness',
    'appShots.shot1Caption': 'Pětiosé hodnocení za 30 vteřin.',
    'appShots.shot2Title': 'Sessions',
    'appShots.shot2Caption': 'Plán tréninku, docházka, RPE.',
    'appShots.shot3Title': 'Coach board',
    'appShots.shot3Caption': 'Týmový kontext v reálném čase.',
    'appShots.placeholder': 'Snímek bude doplněn',

    // Stage 7.5 — Customer testimonial (placeholder pre real quote)
    // User dodá skutečný citát + autora + roli později (sport, klub).
    // Do té doby běží placeholder ve stejné stylové rodině; když přijde
    // skutečný citát, stačí přepsat hodnoty zde a vyměnit avatar v
    // /public/images/testimonials/.
    'testimonial.eyebrow': '',
    'testimonial.placeholder': 'Citát bude doplněn po prvním pilotu.',
    'testimonial.placeholderAuthor': 'Trenér · klub · sport',
    'testimonial.quote':
      '„Melveo je první nástroj, který nám dal kontext na trénink, ne jenom čísla. Ranní wellness zabere 30 vteřin a my víme, koho ten den šetřit a koho zatížit."',
    'testimonial.author': 'Jan Novák',
    'testimonial.role': 'Hlavní trenér · SK Melveo · fotbal U19',

    // Stage 8 — FAQ (added 2026-05-03)
    // Six questions covering the most common things a club/coach
    // asks before booking a pilot or downloading the app. Keep
    // answers short — long answers go in the docs/blog later.
    /*
      FAQ trimmed 2026-05-15 — 6 questions → 4. Answers cut to one
      tight sentence each. Removed: "Kolik času stojí trenéra denně"
      (answer was filler) and "Pro tým/akademii/klub" (pricing page
      already answers this). Kept the four real objections:
      engagement, competition, missing data, privacy.
    */
    'faq.eyebrow': '',
    'faq.headline': 'Časté otázky.',
    'faq.q1': 'Budou hráči wellness opravdu vyplňovat?',
    'faq.a1':
      'Wellness trvá ~30 sekund a opakuje se ve stejném rytmu. Trenér rovnou vidí, kdo poslal a kdo ne.',
    'faq.q2': 'Co když už používáme jiný nástroj?',
    'faq.a2':
      'Melveo nenahrazuje komunikaci ani klubovou administrativu — jen sbírá denní signály a dělá z nich kontext pro trenéra.',
    'faq.q3': 'Co když hráč vynechá den?',
    'faq.a3':
      'Melveo pracuje i s neúplnými daty. Trenér uvidí, kdo signál poslal, a trend týmu zůstane viditelný.',
    'faq.q4': 'Kdo vidí hráčská data?',
    'faq.a4':
      'Data zůstávají v klubu. Workspace spravuje klub, hráč má kontrolu nad svým vstupem — data neprodáváme a nepoužíváme k marketingu.',

    // Stage 9 — pilot CTA
    'pilot.headline': 'Pojďme to spustit.',
    'pilot.body': 'Krátký e-mail stačí.',
    'pilot.email': 'hello@melveo.app',

    // Locale switcher
    'locale.cs': 'CS',
    'locale.en': 'EN',

    // Help section
    'help.homeAria': 'Melveo — domovská stránka',
    'help.navLabel': 'Nápověda',
    'help.localeAria': 'Jazyk stránky',
    'help.breadcrumbAria': 'Drobečková navigace',
    'help.backHub': 'Zpět na přehled nápovědy',
    'help.onThisPage': 'V tomto návodu',
    'help.stepsLabel': 'Postup',
    'help.related': 'Pokračuj dál',
    'help.openArticle': 'Otevřít návod',
    'help.contact': 'Potřebuješ další pomoc? Napiš na hello@melveo.app.',

    'help.hub.metaTitle': 'Nápověda',
    'help.hub.metaDescription': 'Návody k instalaci Melveo, založení týmu, připojení hráče, vedení zápasu, rannímu check-inu a platbám.',
    'help.hub.eyebrow': 'Melveo nápověda',
    'help.hub.title': 'S čím potřebuješ pomoct?',
    'help.hub.lead': 'Vyber téma. Každý návod tě provede jen tím, co potřebuješ udělat.',
    'help.hub.install.title': 'Instalace přes TestFlight',
    'help.hub.install.body': 'Nainstaluj beta verzi Melveo a dokonči první přihlášení.',
    'help.hub.install.meta': 'Začni tady',
    'help.hub.coach.title': 'Pro trenéra',
    'help.hub.coach.body': 'Založ tým, pozvi hráče a najdi nástroje pro práci s týmem.',
    'help.hub.coach.meta': 'Tým a sessions',
    'help.hub.player.title': 'Pro hráče',
    'help.hub.player.body': 'Připoj se pomocí kódu a vyplň ranní wellness check-in.',
    'help.hub.player.meta': 'Kód a check-in',
    'help.hub.match.title': 'Vedení zápasu',
    'help.hub.match.body': 'Spusť zápas v Aktivitách, zapisuj dění živě a po konci otevři reporty hráčů.',
    'help.hub.match.meta': 'Živý zápas a reporty',
    'help.hub.billing.title': 'Tarify a platby',
    'help.hub.billing.body': 'Zjisti, proč se tarif vybírá a spravuje na webu.',
    'help.hub.billing.meta': 'Platba přes Stripe',
    'help.hub.faq.title': 'Časté potíže',
    'help.hub.faq.body': 'Rychlé odpovědi k přihlášení, pozvánkám, oprávněním a navigaci.',
    'help.hub.faq.meta': 'Řešení problémů',

    'help.install.metaTitle': 'Instalace přes TestFlight',
    'help.install.metaDescription': 'Jak nainstalovat beta verzi Melveo přes TestFlight a dokončit první přihlášení.',
    'help.install.eyebrow': 'Instalace',
    'help.install.title': 'Nainstaluj Melveo přes TestFlight',
    'help.install.lead': 'Melveo je teď dostupné jako beta verze pro iPhone a iPad. Instalace vede přes aplikaci TestFlight od Applu.',
    'help.install.betaTitle': 'Co je TestFlight?',
    'help.install.betaBody': 'TestFlight je aplikace od Applu pro bezpečné instalování beta verzí. Melveo zatím není ve veřejném App Storu.',
    'help.install.stepsTitle': 'Instalace krok za krokem',
    'help.install.step1.title': 'Otevři pozvánku do bety',
    'help.install.step1.body': 'Klepni na odkaz níže. Otevře se stránka TestFlight s pozvánkou do Melveo.',
    'help.install.step2.title': 'Nainstaluj TestFlight',
    'help.install.step2.body': 'Pokud TestFlight ještě nemáš, nainstaluj ho z App Storu. Pak se vrať k pozvánce.',
    'help.install.step3.title': 'Nainstaluj Melveo',
    'help.install.step3.body': 'V TestFlightu přijmi pozvánku a spusť instalaci Melveo.',
    'help.install.step4.title': 'Přihlas se bez hesla',
    'help.install.step4.body': 'Použij Apple, Google nebo jednorázový kód zaslaný na e-mail.',
    'help.install.step5.title': 'Dokonči první nastavení',
    'help.install.step5.body': 'Doplň jméno a v rozcestníku vyber připojení k týmu, vytvoření týmu nebo ukázkový režim. Nabídnutá oprávnění můžeš přeskočit.',
    'help.install.cta': 'Otevřít pozvánku v TestFlightu',
    'help.install.galleryTitle': 'Co uvidíš při prvním spuštění',
    'help.install.welcome.alt': 'Uvítací obrazovka aplikace Melveo v tmavém režimu',
    'help.install.welcome.caption': 'Uvítací obrazovka po prvním spuštění.',
    'help.install.email.alt':
      'Obrazovka přihlášení e-mailem: pole pro adresu a tlačítko Poslat kód',
    'help.install.email.caption':
      'Když zvolíš e-mail, přijde ti jednorázový kód. Žádné heslo se nevytváří.',
    'help.install.notifications.alt':
      'Onboardingová obrazovka notifikací: ranní check-in, upozornění na zápas a zprávy od trenéra',
    'help.install.notifications.caption':
      'Notifikace jsou volitelné — tlačítkem „Teď ne“ je přeskočíš.',
    'help.install.healthkit.alt':
      'Obrazovka propojení s Apple Health s výčtem, co se čte a co ne',
    'help.install.healthkit.caption':
      'Melveo čte jen souhrny. Surová data zůstávají v iPhonu a do Health nic nezapisuje.',
    'help.install.signin.alt': 'Obrazovka přihlášení do Melveo s možnostmi Apple, Google a e-mail',
    'help.install.signin.caption': 'Přihlášení přes Apple, Google nebo e-mailový kód. Heslo nepotřebuješ.',
    'help.install.first.alt': 'První domovská obrazovka aplikace Melveo po dokončení nastavení',
    'help.install.first.caption': 'Po dokončení nastavení se otevře první osobní přehled.',

    'help.coach.metaTitle': 'Melveo pro trenéra',
    'help.coach.metaDescription': 'Jak v Melveo založit tým, pozvat hráče a pracovat s denním přehledem, soupiskou a tréninky.',
    'help.coach.eyebrow': 'Pro trenéra',
    'help.coach.title': 'Založ tým a připrav první session',
    'help.coach.lead': 'Po přihlášení vytvoříš tým ve dvou krocích. Potom vidíš denní připravenost týmu a spouštíš tréninky a zápasy.',
    'help.coach.createTitle': 'Vytvoření týmu',
    'help.coach.step1.title': 'Zvol „Vytvořit vlastní tým“',
    'help.coach.step1.body': 'Po přihlášení a doplnění jména se otevře rozcestník. Vyber vytvoření týmu.',
    'help.coach.step2.title': 'Zadej název a případně logo',
    'help.coach.step2.body': 'První krok průvodce chce název týmu. Logo je volitelné.',
    'help.coach.step3.title': 'Vyber první sport',
    'help.coach.step3.body': 'Ve druhém kroku vyber sport. Další sporty můžeš později přidat v nastavení týmu.',
    'help.coach.step4.title': 'Dokonči průvodce',
    'help.coach.step4.body': 'Po dokončení pokračuješ jako Coach. Oprávnění pro notifikace a volitelný Polar můžeš přeskočit.',
    'help.coach.create.alt': 'První krok průvodce vytvořením týmu: pole pro název týmu a volitelné logo',
    'help.coach.create.caption': 'Průvodce tě provede názvem týmu, logem a prvním sportem.',
    'help.coach.invite.alt':
      'Panel „Pozvat hráče“ s přepínačem mezi e-mailem a QR kódem a vygenerovaným QR',
    'help.coach.invite.caption':
      'Hráče pozveš e-mailem, nebo jim ukážeš QR kód. Kód jde kdykoli obnovit.',
    'help.coach.rosterLive.alt':
      'Trenérská soupiska s čísly dresů, posty a proužkem připravenosti u každého hráče',
    'help.coach.rosterLive.caption':
      'V soupisce vidíš u každého hráče post a jeho dnešní připravenost.',
    'help.coach.todayTitle': 'Co trenér vidí ráno',
    'help.coach.today.alt':
      'Trenérský přehled dne: 7 z 8 vyplněných check-inů, průměrná připravenost 4,0 z 5 a upozornění na jedno hlášení ke kontrole',
    'help.coach.today.caption':
      'Kolik lidí dnes odpovědělo, jaká je průměrná připravenost a koho si projít.',
    'help.coach.detail.alt':
      'Detail check-inu hráče očima trenéra: pět hodnocených os a mapa těla s vyznačeným bolavým ramenem',
    'help.coach.detail.caption':
      'U hráče, který hlásí bolest, vidíš jeho odpovědi i místo, které ho bolí — pokud sdílení povolil.',
    'help.coach.session.alt':
      'Detail dokončeného tréninku: plán 360 AU proti skutečným 372 AU a rozdíl +12 AU',
    'help.coach.session.caption':
      'Po tréninku vidíš plán proti skutečnosti a doporučení, co s příštím.',
    'help.coach.live.alt':
      'Živý trénink na iPadu s běžícími stopkami a hráči rozdělenými do tepových zón',
    'help.coach.live.caption':
      'Během tréninku vidíš, kdo je v jaké tepové zóně.',
    'help.coach.inviteTitle': 'Pozvi hráče',
    'help.coach.inviteBody': 'Pošli hráčům aktuální pozvánkový kód, odkaz nebo QR. Kód má 6 až 8 znaků a hráč před přijetím uvidí název týmu i sport.',
    'help.coach.homeTitle': 'Týmové nástroje nejsou uvnitř Domů',
    'help.coach.homeBody': 'Domů je tvůj osobní přehled. Coach board a další týmové nástroje najdeš vedle něj v hlavní navigaci aplikace.',
    'help.coach.toolsTitle': 'Co má trenér k dispozici',
    'help.coach.tool1.title': 'Coach board',
    'help.coach.tool1.body': 'Dnešní týmový přehled pro práci před tréninkem nebo zápasem.',
    'help.coach.tool2.title': 'Soupiska',
    'help.coach.tool2.body': 'Přehled hráčů v týmu.',
    'help.coach.tool3.title': 'Spuštění tréninku',
    'help.coach.tool3.body': 'Trénink nebo zápas spustíš v Aktivitách. Zátěž a RPE zapíšeš po skončení.',
    'help.coach.tool4.title': 'Sessions',
    'help.coach.tool4.body': 'Spuštění tréninku nebo zápasu.',
    'help.coach.tool5.title': 'Reporty ze zápasů',
    'help.coach.tool5.body': 'Záznamy a reporty pro odehrané zápasy.',
    'help.coach.board.alt': 'Coach board v Melveo s dnešním týmovým přehledem',
    'help.coach.board.caption': 'Coach board soustředí dnešní týmové informace.',
    'help.coach.roster.alt': 'Soupiska týmu zobrazená v aplikaci Melveo na tabletu',
    'help.coach.roster.caption': 'Soupiska drží hráče týmu na jednom místě.',
    'help.coach.schedule.alt': 'Týdenní rozpis týmu v aplikaci Melveo',
    'help.coach.schedule.caption': 'V týdenním rozpisu vidíš naplánované aktivity.',
    'help.coach.sessions.alt': 'Obrazovka sessions pro spuštění tréninku nebo zápasu',
    'help.coach.sessions.caption': 'Session může být trénink nebo zápas.',

    'help.player.metaTitle': 'Melveo pro hráče',
    'help.player.metaDescription': 'Jak se připojit k týmu pomocí pozvánkového kódu a vyplnit ranní wellness check-in.',
    'help.player.eyebrow': 'Pro hráče',
    'help.player.title': 'Připoj se k týmu a odešli ranní check-in',
    'help.player.lead': 'Od trenéra potřebuješ pozvánkový kód nebo odkaz. Než vstoupíš, Melveo ti ukáže název týmu a sport.',
    'help.player.joinTitle': 'Připojení k týmu',
    'help.player.step1.title': 'Přihlas se a doplň jméno',
    'help.player.step1.body': 'Použij Apple, Google nebo jednorázový kód z e-mailu. Heslo se nevytváří.',
    'help.player.step2.title': 'Zvol „Připojit se do týmu“',
    'help.player.step2.body': 'V rozcestníku vyber možnost pro hráče s pozvánkovým kódem od trenéra.',
    'help.player.step3.title': 'Zadej kód, vlož odkaz nebo naskenuj QR',
    'help.player.step3.body': 'Pozvánkové kódy mají 6 až 8 znaků. Obrazovka přijme také celý pozvánkový odkaz.',
    'help.player.step4.title': 'Zkontroluj tým',
    'help.player.step4.body': 'Na obrazovce „Pozvánka nalezena“ ověř název týmu a sport. Teprve potom zvol „Přijmout a pokračovat“.',
    'help.player.step5.title': 'Rozhodni o volitelných oprávněních',
    'help.player.step5.body': 'HealthKit a Polar jsou volitelné. Obě nabídky můžeš přeskočit.',
    'help.player.rozcestnik.alt': 'Rozcestník Melveo s volbami připojit se do týmu, vytvořit tým nebo si aplikaci prohlédnout',
    'help.player.rozcestnik.caption': 'Pro vstup s kódem vyber „Připojit se do týmu“.',
    'help.player.code.alt': 'Obrazovka pro zadání pozvánkového kódu s možností skenovat QR',
    'help.player.code.caption': 'Kód můžeš napsat, vložit jako odkaz nebo načíst z QR.',
    'help.player.confirm.alt': 'Potvrzení nalezené pozvánky s názvem týmu a sportem',
    'help.player.confirm.caption': 'Před přijetím vždy zkontroluj tým a sport.',
    'help.player.expiredTitle': 'Kód vypršel?',
    'help.player.expiredBody': 'Když aplikace ukáže „Pozvánka vypršela“, požádej trenéra o nový kód.',
    'help.player.checkinTitle': 'Ranní wellness check-in',
    'help.player.checkinBody': 'Check-in zabere přibližně minutu. Ohodnotíš energii, spánek, svalovou bolestivost, náladu a motivaci. Volitelně můžeš v mapě těla označit místo, které bolí.',
    'help.player.checkin.alt':
      'Obrazovka ranního check-inu: energie a spánek na stupnici 1 až 5 a mapa těla pro označení bolestivosti svalů',
    'help.player.checkin.caption':
      'Každou osu klepneš na stupnici 1–5. Bolavé místo označíš v mapě těla. Pak „Odeslat“.',
    'help.player.trendTitle': 'Jak se to sčítá v čase',
    'help.player.trend.alt':
      'Wellness trend hráče za posledních sedm dní s křivkou bolestivosti a denním deníkem',
    'help.player.trend.caption':
      'Z denních check-inů vzniká trend. Přepneš si 7, 30 nebo 90 dní.',
    'help.player.overview.alt':
      'Osobní přehled hráče: 1 345 AU za týden, 3 tréninky, kardio zátěž TRIMP 496 a klidový tep',
    'help.player.overview.caption':
      'Z odtrénovaného vzniká týdenní zátěž, kardio zátěž a zotavení.',
    'help.player.match.alt':
      'Zápasový report hráče se střeleckými mapami a úspěšností zakončení',
    'help.player.match.caption':
      'Po zápase vidíš svoje statistiky, odkud jsi střílel a kam.',
    'help.player.homeTitle': 'Co uvidíš po přihlášení',
    'help.player.team.alt': 'Seznam spoluhráčů v týmu v aplikaci Melveo',
    'help.player.team.caption': 'Záložka Tým ukazuje soupisku, ve které jsi.',
    'help.player.home.alt': 'Osobní domovský přehled hráče v aplikaci Melveo',
    'help.player.home.caption': 'Domů je osobní přehled hráče a výchozí místo pro každodenní práci.',

    'help.match.metaTitle': 'Jak vést zápas v Melveo',
    'help.match.metaDescription': 'Jak trenér v Melveo spustí zápas, zapisuje dění živě a po skončení najde reporty hráčů.',
    'help.match.eyebrow': 'Pro trenéra',
    'help.match.title': 'Veď celý zápas v Melveo',
    'help.match.lead': 'Zápas spustíš přímo v Aktivitách. Během hry zapisuješ dění a po konci zůstane vše v historii i v reportech hráčů.',
    'help.match.startTitle': 'Spusť zápas, když začíná',
    'help.match.step1.title': 'Otevři Aktivity',
    'help.match.step1.body': 'V hlavní navigaci klepni na Aktivity a vyber Zápas. Tady spouštíš trénink i zápas podle toho, co právě začíná.',
    'help.match.step2.title': 'Spusť zápas',
    'help.match.step2.body': 'Zadej soupeře, zvol doma nebo venku a potvrď soupisku. U hráčů s hrudním pásem Polar uvidíš, že je připojený. Pak „Začít zápas“.',
    'help.match.liveTitle': 'Zapisuj dění přímo ze živé obrazovky',
    'help.match.live1.title': 'Skóre a počet akcí',
    'help.match.live1.body': 'Živý zápas má čtyři záložky: Tepy, Zápis, Timeline a Analytika. Skóre, čas a poslední události vidíš vedle zápisu.',
    'help.match.live2.title': 'Zapiš, co se stalo',
    'help.match.live2.body': 'Gól, zákrok, asistenci, ztrátu míče, zisk 7 metrů, gól do prázdné, zisk 2 minut i špatnou přihrávku. Sankce, obranu a útoky máš v samostatných záložkách a u střely označíš v brance, kam šla.',
    'help.match.live3.title': 'Sleduj volitelný tep',
    'help.match.live3.body': 'V záložce Tepy vidíš u každého hráče živé bpm a jeho zónu Z1 až Z5. Bez hrudního pásu Polar zápas běží dál, jen bez tepů.',
    'help.match.startAlt': 'Zakládání zápasu: pole pro soupeře, přepínač doma/venku a soupiska osmi hráčů s připojenými pásy Polar',
    'help.match.startCaption': 'Před výkopem zadáš soupeře a potvrdíš, kdo nastupuje.',
    'help.match.liveAlt': 'Záložka Tepy během zápasu: osm hráčů s živým tepem od 104 do 175 bpm, obarvených podle zóny',
    'help.match.liveCaption': 'Živé tepy celé sestavy najednou, obarvené podle zóny Z1 až Z5.',
    'help.match.eventsAlt': 'Zápisová obrazovka s brankovou mřížkou, nabídkou událostí a posledními zapsanými akcemi',
    'help.match.eventsCaption': 'Klepneš na hráče, vybereš událost a u střely označíš, kam do branky šla.',
    'help.match.sanctionsAlt': 'Záložka Sankce se žlutou kartou, červenou kartou a dvouminutovým vyloučením',
    'help.match.sanctionsCaption': 'Karty a vyloučení mají vlastní záložku.',
    'help.match.detailAlt': 'Detail dokončeného zápasu s výsledkem a přehledem událostí',
    'help.match.detailCaption': 'Po skončení zůstane zápas i s tím, co se v něm stalo.',
    'help.match.historyAlt': 'Seznam ukončených zápasů s výsledky proti třem soupeřům',
    'help.match.historyCaption': 'Výhra, remíza i prohra — barva výsledku to řekne na první pohled.',
    'help.match.reportAlt': 'Report hráče po zápase se statistikami a mapami střel',
    'help.match.reportCaption': 'Každý hráč dostane svůj report se střeleckými mapami a tepovou křivkou.',
    'help.match.endTitle': 'Ukonči živý zápas',
    'help.match.endBody': 'Na živé obrazovce klepni na „Zavřít živý zápas“. Zápas se potom objeví v historii.',
    'help.match.reportTitle': 'Podívej se na report každého hráče',
    'help.match.reportBody': 'Po zápase má každý hráč svůj report: vlastní statistiky, střelecké mapy odkud střílel a kam míč šel a tepovou křivku za celý zápas.',

    'help.billing.metaTitle': 'Tarify a platby',
    'help.billing.metaDescription': 'Kde vybrat a spravovat tarif Melveo a proč v iOS aplikaci nejsou nákupní tlačítka.',
    'help.billing.eyebrow': 'Tarify a platby',
    'help.billing.title': 'Tarif vybereš a spravuješ na webu',
    'help.billing.lead': 'V iOS aplikaci nejsou nákupní tlačítka. Platbu i správu tarifu řeší web Melveo.',
    'help.billing.whyTitle': 'Proč se neplatí v aplikaci',
    'help.billing.whyBody': 'Pravidlo Apple App Store 3.1.3(f) umožňuje této doprovodné aplikaci fungovat bez nákupů uvnitř iOS. Proto všechny platební kroky zůstávají na webu.',
    'help.billing.howTitle': 'Jak pokračovat',
    'help.billing.step1.title': 'Prohlédni si aktuální tarify',
    'help.billing.step1.body': 'Ceny jsou vždy uvedené v ceníku na hlavní stránce. V nápovědě je neopakujeme, aby se údaje nerozcházely.',
    'help.billing.step2.title': 'Dokonči platbu na webu',
    'help.billing.step2.body': 'Platby zpracovává Stripe.',
    'help.billing.step3.title': 'Spravuj tarif na webu',
    'help.billing.step3.body': 'Změny tarifu se také řeší na webu, ne v iOS aplikaci. Pokud potřebuješ pomoct, napiš nám.',
    'help.billing.pricingCta': 'Zobrazit aktuální tarify a ceny',
    'help.billing.contactCta': 'Napsat podpoře',

    'help.faq.metaTitle': 'Časté potíže',
    'help.faq.metaDescription': 'Řešení potíží s instalací, přihlášením, pozvánkou, oprávněními, týmovou navigací a platbami v Melveo.',
    'help.faq.eyebrow': 'Řešení problémů',
    'help.faq.title': 'Časté potíže',
    'help.faq.lead': 'Začni krátkou odpovědí. Když problém trvá, napiš nám a popiš, na které obrazovce ses zastavil.',
    'help.faq.figuresTitle': 'Kde to v aplikaci najdeš',
    'help.faq.delete.alt':
      'První krok mazání účtu s výčtem, co se smaže hned a co zůstane',
    'help.faq.delete.caption':
      'Před smazáním uvidíš, co zmizí okamžitě a co zůstane anonymizované.',
    'help.faq.language.alt': 'Přepínač jazyka aplikace mezi češtinou a angličtinou',
    'help.faq.language.caption': 'Jazyk přepneš v účtu. Část rozhraní se změní až po dalším spuštění.',
    'help.faq.health.alt': 'Nastavení propojení s Apple Health v účtu',
    'help.faq.health.caption': 'Propojení s Apple Health zapneš i vypneš v účtu kdykoli později.',
    'help.faq.q1': 'Jak Melveo nainstaluji?',
    'help.faq.a1': 'Melveo je aktuálně beta verze distribuovaná přes Apple TestFlight. Otevři pozvánku, nainstaluj TestFlight a potom Melveo.',
    'help.faq.q2': 'Kde nastavím heslo?',
    'help.faq.a2': 'Nikde. Melveo používá přihlášení přes Apple, Google nebo jednorázový kód zaslaný na e-mail.',
    'help.faq.q3': 'Pozvánkový kód nefunguje. Co teď?',
    'help.faq.a3': 'Zkontroluj, že má 6 až 8 znaků, případně vlož celý pozvánkový odkaz nebo naskenuj QR. Pokud aplikace píše „Pozvánka vypršela“, požádej trenéra o nový kód.',
    'help.faq.q4': 'Nemůžu najít Coach board.',
    'help.faq.a4': 'Coach board není uvnitř Domů. Domů je osobní přehled; týmové nástroje jsou vedle něj v hlavní navigaci.',
    'help.faq.q5': 'Musím povolit HealthKit, notifikace nebo Polar?',
    'help.faq.a5': 'Ne. HealthKit se nabízí hráčům, notifikace realizačnímu týmu a Polar oběma rolím. Všechna tato oprávnění jsou volitelná a můžeš je přeskočit.',
    'help.faq.q6': 'Kde koupím nebo změním tarif?',
    'help.faq.a6': 'Na webu Melveo. iOS aplikace nemá nákupní tlačítka a platby zpracovává Stripe.',

    // Cookie banner
    'cookie.title': 'Cookies',
    'cookie.body': 'Používáme cookies pro statistiky a vylepšení stránky.',
    'cookie.privacy': 'Více v zásadách soukromí',
    'cookie.reject': 'Jen nutné',
    'cookie.customize': 'Nastavit',
    'cookie.accept': 'Přijmout vše',
  },
  en: {
    'nav.contact': 'hello@melveo.app',
    'footer.copyright': '© 2026 melveo',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.help': 'Help',
    'footer.cookieSettings': 'Cookie settings',
    'footer.githubAria': 'Melveo on GitHub',
    'footer.instagramAria': 'Melveo on Instagram',
    'a11y.skipContent': 'Skip to content',

    /* See CS comment above — same trim applied in English. */
    'hero.eyebrow': '',
    'hero.headlinePrefix': 'Athlete signals become clear decisions.',
    'hero.headlineLine1': 'Athlete signals',
    'hero.headlineLine2': 'become',
    'hero.headlineSuffix': '.',
    'hero.headlineInitial': 'clear decisions',
    'hero.headlineRotations':
      'clear decisions|better training|early alerts|recovery plans|coach actions|team context',
    'hero.subline':
      'Melveo connects [[wellness]], [[readiness]], [[load]] and [[match context]], so coaches know what to do next.',
    'hero.cta.appstore': 'Download on the App Store',
    'hero.cta.appstoreEyebrow': 'Download on the',
    'hero.cta.appstoreTitle': 'App Store',
    'hero.cta.installHelp': 'How to install the TestFlight beta',
    'hero.cta.pilot': 'Get in touch →',
    'hero.beta': 'TestFlight beta · soon',

    'gridMorph.headlineLine1': "Let's",
    'gridMorph.headlineLine2': 'scroll.',
    'gridMorph.subline': 'Team, coach, ops — all in one app.',
    'gridMorph.scrollHint': 'Scroll',

    // 8 product-proof honeycomb labels (matches CS keys above)
    'gridCard.checkin': 'Morning',
    'gridCard.sessions': 'Status',
    'gridCard.attendance': 'Signal',
    'gridCard.load': 'Load',
    'gridCard.coachBoard': 'Coach',
    'gridCard.recovery': 'Trend',
    'gridCard.decisions': 'Plan',
    'gridCard.privacy': 'Data',
    'gridCard.wellness': 'Wellness',
    'gridCard.sessionsPlan': 'Session',
    'gridCard.watchlist': 'Risk',
    'gridCard.reports': 'Report',
    'gridCard.roles': 'Roles',
    'gridCard.context': 'Context',
    'gridCard.sleep': 'Sleep',
    'gridCard.mood': 'Mood',
    'gridCard.pain': 'Pain',
    'gridCard.fatigue': 'Fatigue',
    'gridCard.hrv': 'HRV',
    'gridCard.symptoms': 'Symptoms',
    'gridCard.match': 'Match',
    'gridCard.rotation': 'Rotation',
    'gridCard.readiness': 'Ready',
    'gridCard.rpe': 'RPE',
    'gridCard.attendance2': 'Attendance',
    'gridCard.notes': 'Notes',
    'gridCard.export': 'Export',
    'gridCard.alerts': 'Alerts',
    'gridCard.calendar': 'Calendar',
    'gridCard.team': 'Team',

    // Image-grid photo alt texts (a11y + image SEO). Factual scene
    // descriptions — no marketing copy, screen readers consume these.
    'gridAlt.coach-player-wide-crop': 'Coach reviewing data with a player over a tablet in the hall',
    'gridAlt.player-checkin': 'Player filling in the morning check-in in the Melveo app in the locker room',
    'gridAlt.player-mobile': 'Player filling in the morning wellness check-in on a phone in the locker room',
    'gridAlt.coach-player-review': 'Coach and player going through feedback on a tablet',
    'gridAlt.coach-field-tablet': 'Coach on the pitch checking training data on a tablet',
    'gridAlt.team-sideline-wide': 'Player in a Melveo jersey running during a rainy training session',
    'gridAlt.player-portrait': 'Portrait of a focused player before training',
    'gridAlt.player-action': 'Player in full action during a match',
    'gridAlt.player-defense': 'Player in a defensive stance during a game',
    'gridAlt.coach-hall-tablet': 'Coach in a sports hall holding a tablet',
    'gridAlt.player-locker': 'Player getting ready in the locker room before training',
    'gridAlt.jersey-brand': 'Team jersey with the Melveo logo',
    'gridAlt.coach-team-dialogue': 'Coach talking with the team during training',
    'gridAlt.coach-player-close': 'Coach talking with players on the training pitch',
    'gridAlt.team-briefing-wide': 'Team briefing with the coach before the match',

    'gooey.headlinePrefix': 'Coach + player.',
    'gooey.headlineAccent': 'Synced.',

    'wordScroll.prefix': 'Coach knows',
    'wordScroll.screenReader':
      'The coach knows who is tired, who fears the bench, who to watch, who is ready, what to change in the plan and when to call it.',
    'wordScroll.words':
      "who's tired|who fears the bench|who to watch today|who's ready to play|what to change in the plan|when to call it",

    'wellness.eyebrow': '',
    'wellness.headline': 'Wellness in 30 seconds.',
    'wellness.body':
      'Players rate energy, sleep, soreness, mood, and motivation. You see the team status at a glance.',
    'wellness.tag': '',

    'orb.primary': 'For the whole club.',
    'orb.secondary': 'For every player.',
    'orb.hint': 'Tap and tilt to control',
    'orb.hintActive': 'Tilt your phone or drag',
    'orb.hintDesktop': 'Click and drag',
    'orb.hintDesktopActive': 'Drag with mouse',
    'orb.hintMobile': 'Tap and tilt',
    'orb.hintMobileActive': 'Tilt phone or drag',
    'orb.hintNeedsHttps': 'Tilt requires HTTPS',
    'orb.gyroPermission': 'Allow tilt control?',

    'promise.headlinePrefix': 'Real-time data.',
    'promise.headlineAccent': 'No paper.',

    'sessions.eyebrow': '',
    'sessions.headline': 'Sessions and coach board.',
    'sessions.body':
      'Plan training, log attendance, track load. Before you arrive at the pitch, you know what the team needs.',

    // Stage 6.5 — Pricing
    'pricing.eyebrow': '',
    'pricing.headline': 'Start free.',
    'pricing.headlineAccent': 'One plan for the whole team.',
    'pricing.subline': 'One license for the whole team. Transparent CZK pricing.',
    // Tax note — CURRENTLY NOT RENDERED (owner decision 2026-06-10:
    // no VAT wording on the landing). Kept ready; see CS comment above.
    'pricing.vatNote': 'Prices are final — no VAT is added (seller not VAT-registered).',
    'pricing.toggleMonthly': 'Monthly',
    'pricing.toggleYearly': 'Yearly',
    'pricing.toggleSavings': '−17 %',
    'pricing.perDay': '/ day for team',
    'pricing.perMonth': '/ month',
    'pricing.perYear': '/ year',
    'pricing.billedYearly': 'Billed yearly',
    'pricing.billedMonthly': 'Billed monthly',
    'pricing.perMonthEffective': '~ {amount} / month',
    'pricing.popular': 'Most popular',
    'pricing.included': "What's included",
    'pricing.ctaFree': 'Start with small group',
    'pricing.ctaPilot': 'Get in touch',
    'pricing.free': 'Free',
    'pricing.athleteHeading': 'Need more players?',
    'pricing.athleteBody':
      'The Athlete Pack adds 10 more players for 5,900 CZK / year (max 1 pack per team).',
    'pricing.clubHeading': 'Enterprise',
    'pricing.clubBody':
      'For multiple teams, an academy or a whole club. Custom terms, integrations and dedicated support. Get in touch.',
    'pricing.disclaimer':
      'All payments processed by Stripe.',

    // Section dots nav + promo video stage
    'sectionNav.label': 'Section navigation',
    'sectionNav.top': 'Top',
    'sectionNav.app': 'The app',
    'sectionNav.data': 'Data',
    'sectionNav.coach': 'Coach knows',
    'sectionNav.video': 'Watch',
    'sectionNav.pricing': 'Pricing',
    'sectionNav.faq': 'FAQ',
    'sectionNav.contact': 'Contact',

    // Stage 4.5 — promo video in an iPhone frame
    'promo.eyebrow': '',
    'promo.headline': 'See it in motion.',
    'promo.body': '30 seconds from athlete signals to a coach decision.',
    'promo.soundOn': 'Unmute video',
    'promo.soundOff': 'Mute video',
    'promo.play': 'Play video',
    'promo.pause': 'Pause video',
    'promo.videoAria': 'Melveo promo video — athlete signals become coach decisions',


    'dataFlow.eyebrow': '',
    'dataFlow.headline': 'Player inputs become coaching context.',
    'dataFlow.body':
      'Wellness, attendance, RPE, and sessions. One view for training and match day.',
    'dataFlow.playersTitle': 'Players send signals',
    'dataFlow.playersBody':
      'Each dot is a player. Short inputs throughout the day.',
    'dataFlow.coreTitle': 'melveo',
    'dataFlow.coreBody': 'One connected team signal.',
    'dataFlow.coachTitle': 'Coaches get context',
    'dataFlow.coachBody':
      'The coach board shows what needs attention before training or match.',
    'dataFlow.signals':
      'Wellness|RPE|Attendance|Readiness|Sleep|Pain|Motivation|Fatigue',
    'dataFlow.decisions':
      'Adjust load|Individual recovery|Change match role|Increase monitoring|Full training clearance',
    'dataFlow.mobileStep1': 'Player sends a short input',
    'dataFlow.mobileStep2': 'Melveo combines it with team signals',
    'dataFlow.mobileStep3': 'Coach sees decision-ready context',

    'privacy.eyebrow': '',
    'privacy.headlineLine1': "Every input creates",
    'privacy.headlineLine2': "coach-ready output.",
    'privacy.body':
      'Wellness, attendance, RPE, and sessions become signals the coach can use immediately.',

    // Lead capture forms — App Store notify + Pilot inquiry
    'lead.notifyHeading': 'Drop us your email.',
    'lead.notifyBody': "We'll let you know the moment Melveo hits the App Store.",
    'lead.emailPlaceholder': 'you@example.com',
    'lead.emailLabel': 'Email',
    'lead.notifyCta': 'Notify me',
    'lead.notifyCtaSending': 'Sending…',
    'lead.notifySuccess': "Done — we'll email you at launch.",
    'lead.notifyError':
      'Something went wrong. Write us at hello@melveo.app instead.',

    'lead.pilotHeading': 'Request a pilot.',
    'lead.pilotBody':
      '15-minute call, app demo, 1,970 CZK pilot for 30 days with a money-back guarantee.',
    'lead.clubLabel': 'Club',
    'lead.clubPlaceholder': 'SK Slavia Praha',
    'lead.sportLabel': 'Sport',
    'lead.sportPlaceholder': 'football, hockey, volleyball…',
    'lead.roleLabel': 'Your role (optional)',
    'lead.rolePlaceholder': 'head coach, manager…',
    'lead.messageLabel': 'Message (optional)',
    'lead.messagePlaceholder': 'Anything we should know before the call.',
    'lead.pilotCta': 'Send',
    'lead.pilotSuccess': "Thanks — we'll get back to you within 1 business day.",

    'lead.errEmailRequired': 'Email is required.',
    'lead.errEmailInvalid': "That doesn't look like a valid email.",
    'lead.errClubRequired': 'Club name is required.',
    'lead.errSportRequired': 'Sport is required.',

    // App screenshot showcase — placeholder + final-shape strings
    'appShots.eyebrow': '',
    'appShots.headline': 'On the player\'s and coach\'s phone.',
    'appShots.body':
      'Three screens: morning wellness for the player, sessions for the coach, coach board for the staff.',
    'appShots.shot1Title': 'Morning wellness',
    'appShots.shot1Caption': '5-axis rating in 30 seconds.',
    'appShots.shot2Title': 'Sessions',
    'appShots.shot2Caption': 'Plan, attendance, RPE.',
    'appShots.shot3Title': 'Coach board',
    'appShots.shot3Caption': 'Team context, real-time.',
    'appShots.placeholder': 'Screenshot coming',

    // Customer testimonial — placeholder + final-shape strings
    'testimonial.eyebrow': '',
    'testimonial.placeholder': 'Quote coming after the first pilot.',
    'testimonial.placeholderAuthor': 'Coach · club · sport',
    'testimonial.quote':
      '"Melveo is the first tool that gave us context for training, not just numbers. Morning wellness takes 30 seconds and we know who to spare and who to load that day."',
    'testimonial.author': 'Jan Novák',
    'testimonial.role': 'Head coach · SK Melveo · football U19',

    // FAQ (mirrors CS keys above)
    /* See CS comment — same trim, 4 strongest objections. */
    'faq.eyebrow': '',
    'faq.headline': 'Frequently asked.',
    'faq.q1': 'Will players actually do wellness daily?',
    'faq.a1':
      'Wellness takes ~30 seconds and repeats in the same daily rhythm. Coaches see who sent and who didn’t — no manual chasing.',
    'faq.q2': 'What if we already use another tool?',
    'faq.a2':
      'Melveo doesn’t replace communication or club admin — it just collects daily signals and turns them into coach context.',
    'faq.q3': 'What if a player misses a day?',
    'faq.a3':
      'Melveo works with incomplete data. Coaches see who sent a signal and the team trend stays visible.',
    'faq.q4': 'Who can see player data?',
    'faq.a4':
      'Data stays within the club. The club runs the workspace, players control their own input — we never sell data or use it for marketing.',

    'pilot.headline': 'Let’s start it.',
    'pilot.body': 'A short email is enough.',
    'pilot.email': 'hello@melveo.app',

    'locale.cs': 'CS',
    'locale.en': 'EN',

    // Help section
    'help.homeAria': 'Melveo home page',
    'help.navLabel': 'Help',
    'help.localeAria': 'Page language',
    'help.breadcrumbAria': 'Breadcrumb',
    'help.backHub': 'Back to help overview',
    'help.onThisPage': 'In this guide',
    'help.stepsLabel': 'Steps',
    'help.related': 'Continue reading',
    'help.openArticle': 'Open guide',
    'help.contact': 'Need more help? Email hello@melveo.app.',

    'help.hub.metaTitle': 'Help',
    'help.hub.metaDescription': 'Guides to installing Melveo, creating a team, joining as a player, running a match, morning check-ins, and billing.',
    'help.hub.eyebrow': 'Melveo help',
    'help.hub.title': 'What do you need help with?',
    'help.hub.lead': 'Choose a topic. Each guide focuses on the steps you need to complete.',
    'help.hub.install.title': 'Install with TestFlight',
    'help.hub.install.body': 'Install the Melveo beta and complete your first sign-in.',
    'help.hub.install.meta': 'Start here',
    'help.hub.coach.title': 'For coaches',
    'help.hub.coach.body': 'Create a team, invite players, and find the tools used to run the team.',
    'help.hub.coach.meta': 'Team and sessions',
    'help.hub.player.title': 'For players',
    'help.hub.player.body': 'Join with an invite code and complete the morning wellness check-in.',
    'help.hub.player.meta': 'Code and check-in',
    'help.hub.match.title': 'Running a match',
    'help.hub.match.body': 'Start a match from Activities, log it live, then open each player’s report after the final whistle.',
    'help.hub.match.meta': 'Live match and reports',
    'help.hub.billing.title': 'Plans and billing',
    'help.hub.billing.body': 'Learn why plans are purchased and managed on the website.',
    'help.hub.billing.meta': 'Payments by Stripe',
    'help.hub.faq.title': 'Troubleshooting',
    'help.hub.faq.body': 'Quick answers about sign-in, invitations, permissions, and navigation.',
    'help.hub.faq.meta': 'Common fixes',

    'help.install.metaTitle': 'Install with TestFlight',
    'help.install.metaDescription': 'How to install the Melveo beta through TestFlight and complete your first sign-in.',
    'help.install.eyebrow': 'Installation',
    'help.install.title': 'Install Melveo with TestFlight',
    'help.install.lead': 'Melveo is currently available as a beta for iPhone and iPad. Installation uses Apple’s TestFlight app.',
    'help.install.betaTitle': 'What is TestFlight?',
    'help.install.betaBody': 'TestFlight is Apple’s app for safely installing beta software. Melveo is not yet available on the public App Store.',
    'help.install.stepsTitle': 'Installation, step by step',
    'help.install.step1.title': 'Open the beta invitation',
    'help.install.step1.body': 'Use the link below. It opens the Melveo invitation in TestFlight.',
    'help.install.step2.title': 'Install TestFlight',
    'help.install.step2.body': 'If you do not have TestFlight, install it from the App Store, then return to the invitation.',
    'help.install.step3.title': 'Install Melveo',
    'help.install.step3.body': 'Accept the invitation in TestFlight and start the Melveo installation.',
    'help.install.step4.title': 'Sign in without a password',
    'help.install.step4.body': 'Use Apple, Google, or a one-time code sent to your email.',
    'help.install.step5.title': 'Complete the initial setup',
    'help.install.step5.body': 'Add your name, then choose to join a team, create a team, or look around in demo mode. You can skip the permission prompts.',
    'help.install.cta': 'Open the TestFlight invitation',
    'help.install.galleryTitle': 'What you will see at first launch',
    'help.install.welcome.alt': 'Melveo welcome screen in dark mode',
    'help.install.welcome.caption': 'The welcome screen shown on first launch.',
    'help.install.email.alt':
      'The e-mail sign-in screen: an address field and a button that sends the code',
    'help.install.email.caption':
      'Pick e-mail and a one-time code arrives. No password is ever created.',
    'help.install.notifications.alt':
      'The onboarding notifications screen: morning check-in, match day alert, and messages from the coach',
    'help.install.notifications.caption':
      'Notifications are optional — “Not now” skips them.',
    'help.install.healthkit.alt':
      'The Apple Health screen listing what is read and what is not',
    'help.install.healthkit.caption':
      'Melveo reads summaries only. Raw data stays on the iPhone and nothing is written back to Health.',
    'help.install.signin.alt': 'Melveo sign-in screen with Apple, Google, and email options',
    'help.install.signin.caption': 'Sign in with Apple, Google, or an email code. No password is required.',
    'help.install.first.alt': 'The first Melveo home screen after initial setup',
    'help.install.first.caption': 'The first personal dashboard opens after setup.',

    'help.coach.metaTitle': 'Melveo for coaches',
    'help.coach.metaDescription': 'How to create a team in Melveo and work with the daily team view, roster, and training sessions.',
    'help.coach.eyebrow': 'For coaches',
    'help.coach.title': 'Create a team and prepare the first session',
    'help.coach.lead': 'After signing in, you create a team in a two-step wizard. You then see the team’s daily readiness and start training sessions and matches.',
    'help.coach.createTitle': 'Create a team',
    'help.coach.step1.title': 'Choose the create-team option',
    'help.coach.step1.body': 'After sign-in and your profile name, the three-way chooser opens. Select the option to create your own team.',
    'help.coach.step2.title': 'Enter a name and optional logo',
    'help.coach.step2.body': 'The first wizard step asks for the team name. The logo is optional.',
    'help.coach.step3.title': 'Choose the first sport',
    'help.coach.step3.body': 'Choose a sport in the second step. You can add more sports later in team settings.',
    'help.coach.step4.title': 'Finish the wizard',
    'help.coach.step4.body': 'After creation, you continue as a Coach. Notifications and the optional Polar integration can both be skipped.',
    'help.coach.create.alt': 'The first step of the team creation wizard: a team name field and an optional logo',
    'help.coach.create.caption': 'The wizard covers the team name, optional logo, and first sport.',
    'help.coach.invite.alt':
      'The “Invite player” sheet with an e-mail / QR toggle and a generated QR code',
    'help.coach.invite.caption':
      'Invite players by e-mail or show them a QR code. The code can be regenerated at any time.',
    'help.coach.rosterLive.alt':
      'The coach roster with jersey numbers, positions, and a readiness bar per player',
    'help.coach.rosterLive.caption':
      'The roster shows each player’s position and how ready they are today.',
    'help.coach.todayTitle': 'What the coach sees in the morning',
    'help.coach.today.alt':
      'The coach day view: 7 of 8 check-ins submitted, average readiness 4.0 out of 5, and one report flagged for review',
    'help.coach.today.caption':
      'How many answered today, the team average, and who to look at.',
    'help.coach.detail.alt':
      'A player’s check-in as the coach sees it: five rated axes and a body map with a sore shoulder marked',
    'help.coach.detail.caption':
      'For a player reporting pain you see their answers and where it hurts — if they shared it.',
    'help.coach.session.alt':
      'A finished session: a 360 AU plan against 372 AU actual, a +12 AU difference',
    'help.coach.session.caption':
      'After a session you see plan against reality, and what to do with the next one.',
    'help.coach.live.alt':
      'A live training session on iPad with a running clock and players grouped by heart-rate zone',
    'help.coach.live.caption':
      'During a session you see which heart-rate zone each player is in.',
    'help.coach.inviteTitle': 'Invite players',
    'help.coach.inviteBody': 'Share the current invite code, invitation link, or QR code with players. Codes contain 6 to 8 characters, and players see the team name and sport before joining.',
    'help.coach.homeTitle': 'Team tools are not inside Home',
    'help.coach.homeBody': 'Home is your personal dashboard. The coach board and other team-wide tools sit next to it in the app’s main navigation.',
    'help.coach.toolsTitle': 'Coach tools available in Melveo',
    'help.coach.tool1.title': 'Coach board',
    'help.coach.tool1.body': 'Today’s team view for work before training or a match.',
    'help.coach.tool2.title': 'Roster',
    'help.coach.tool2.body': 'An overview of players on the team.',
    'help.coach.tool3.title': 'Starting a session',
    'help.coach.tool3.body': 'Start a training session or match from Activities. Load and RPE get recorded afterwards.',
    'help.coach.tool4.title': 'Sessions',
    'help.coach.tool4.body': 'Launch a training session or match.',
    'help.coach.tool5.title': 'Match reports',
    'help.coach.tool5.body': 'Records and reports for completed matches.',
    'help.coach.board.alt': 'Melveo coach board showing today’s team overview',
    'help.coach.board.caption': 'The coach board brings today’s team information together.',
    'help.coach.roster.alt': 'Team roster displayed in the Melveo app on a tablet',
    'help.coach.roster.caption': 'The roster keeps the team’s players in one place.',
    'help.coach.schedule.alt': 'Weekly team schedule in the Melveo app',
    'help.coach.schedule.caption': 'The weekly schedule shows planned activities.',
    'help.coach.sessions.alt': 'Sessions screen used to launch a training session or match',
    'help.coach.sessions.caption': 'A session can be a training session or a match.',

    'help.player.metaTitle': 'Melveo for players',
    'help.player.metaDescription': 'How to join a team with an invite code and complete the morning wellness check-in.',
    'help.player.eyebrow': 'For players',
    'help.player.title': 'Join your team and send the morning check-in',
    'help.player.lead': 'You need an invite code or link from your coach. Before you join, Melveo shows the team name and sport for confirmation.',
    'help.player.joinTitle': 'Join a team',
    'help.player.step1.title': 'Sign in and add your name',
    'help.player.step1.body': 'Use Apple, Google, or a one-time code sent by email. You do not create a password.',
    'help.player.step2.title': 'Choose the join-team option',
    'help.player.step2.body': 'On the three-way chooser, select the option for joining with a code from your coach.',
    'help.player.step3.title': 'Enter a code, paste a link, or scan QR',
    'help.player.step3.body': 'Invite codes contain 6 to 8 characters. The same screen also accepts a full invitation link.',
    'help.player.step4.title': 'Check the team details',
    'help.player.step4.body': 'On the confirmation screen, verify the team name and sport before accepting and continuing.',
    'help.player.step5.title': 'Choose optional permissions',
    'help.player.step5.body': 'HealthKit and Polar are optional. You can skip both prompts.',
    'help.player.rozcestnik.alt': 'Melveo chooser with options to join a team, create a team, or explore the demo',
    'help.player.rozcestnik.caption': 'Choose the join-team option when you have an invite code.',
    'help.player.code.alt': 'Invite code entry screen with an option to scan a QR code',
    'help.player.code.caption': 'Type the code, paste an invitation link, or scan a QR code.',
    'help.player.confirm.alt': 'Invitation confirmation showing the team name and sport',
    'help.player.confirm.caption': 'Always check the team and sport before joining.',
    'help.player.expiredTitle': 'Has the code expired?',
    'help.player.expiredBody': 'If the app says the invitation has expired, ask your coach for a fresh code.',
    'help.player.checkinTitle': 'Morning wellness check-in',
    'help.player.checkinBody': 'The check-in takes about a minute. You rate energy, sleep, muscle soreness, mood, and motivation. An optional body map lets you mark where something hurts.',
    'help.player.checkin.alt':
      'The morning check-in screen: energy and sleep rated one to five, plus a body map for marking muscle soreness',
    'help.player.checkin.caption':
      'Tap each scale from 1 to 5, mark any sore spot on the body map, then send it.',
    'help.player.trendTitle': 'How it adds up over time',
    'help.player.trend.alt':
      'A player’s wellness trend over the last seven days, with a soreness curve and a daily log',
    'help.player.trend.caption':
      'Daily check-ins build a trend. Switch between 7, 30, and 90 days.',
    'help.player.overview.alt':
      'A player’s overview: 1,345 AU for the week, 3 sessions, cardio load TRIMP 496, and resting heart rate',
    'help.player.overview.caption':
      'What you train becomes weekly load, cardio load, and recovery.',
    'help.player.match.alt':
      'A player’s match report with shot maps and finishing accuracy',
    'help.player.match.caption':
      'After a match you see your stats, where you shot from, and where it went.',
    'help.player.homeTitle': 'What you see after signing in',
    'help.player.team.alt': 'The list of teammates in the Melveo app',
    'help.player.team.caption': 'The Team tab shows the squad you belong to.',
    'help.player.home.alt': 'A player’s personal Home dashboard in the Melveo app',
    'help.player.home.caption': 'Home is the player’s personal dashboard and starting point for daily use.',

    'help.match.metaTitle': 'How to run a match in Melveo',
    'help.match.metaDescription': 'How a coach starts a match in Melveo, logs events live, and finds player reports afterwards.',
    'help.match.eyebrow': 'For coaches',
    'help.match.title': 'Run the whole match in Melveo',
    'help.match.lead': 'Start the match directly from Activities. Log what happens during play, then find it in match history and in each player’s report.',
    'help.match.startTitle': 'Start the match when it begins',
    'help.match.step1.title': 'Open Activities',
    'help.match.step1.body': 'In the main navigation, tap Activities. This is where you start a training session or a match when it is about to begin.',
    'help.match.step2.title': 'Start the match',
    'help.match.step2.body': 'Enter the opponent, pick home or away, and confirm the squad. Players wearing a Polar chest strap show as connected. Then start the match.',
    'help.match.liveTitle': 'Log the match from the live screen',
    'help.match.live1.title': 'Score and action count',
    'help.match.live1.body': 'A live match has four tabs: heart rates, logging, timeline, and analytics. Score, clock, and the latest events sit beside the log.',
    'help.match.live2.title': 'Log what happened',
    'help.match.live2.body': 'A goal, a save, an assist, a turnover, a 7-metre throw won, an empty-net goal, a 2-minute suspension won, a bad pass. Sanctions, defence, and attacks each get their own tab, and for a shot you mark where in the goal it went.',
    'help.match.live3.title': 'See optional heart rate',
    'help.match.live3.body': 'The heart-rate tab shows live bpm per player and which zone, Z1 to Z5, they are in. Without a Polar chest strap the match runs anyway, just without heart rates.',
    'help.match.startAlt': 'Setting up a match: an opponent field, a home/away switch, and a squad of eight with Polar straps connected',
    'help.match.startCaption': 'Before the whistle you name the opponent and confirm who plays.',
    'help.match.liveAlt': 'The heart-rate tab during a match: eight players between 104 and 175 bpm, coloured by zone',
    'help.match.liveCaption': 'Live heart rates for the whole squad at once, coloured Z1 to Z5.',
    'help.match.eventsAlt': 'The logging screen with a goal grid, an event picker, and the most recent entries',
    'help.match.eventsCaption': 'Tap a player, pick the event, and for a shot mark where in the goal it went.',
    'help.match.sanctionsAlt': 'The sanctions tab with a yellow card, a red card, and a two-minute suspension',
    'help.match.sanctionsCaption': 'Cards and suspensions get their own tab.',
    'help.match.detailAlt': 'A finished match with its result and a summary of what happened',
    'help.match.detailCaption': 'After the final whistle the match keeps everything logged in it.',
    'help.match.historyAlt': 'A list of finished matches with results against three opponents',
    'help.match.historyCaption': 'Win, draw, or loss — the colour of the score says it at a glance.',
    'help.match.reportAlt': 'A player’s post-match report with stats and shot maps',
    'help.match.reportCaption': 'Every player gets a report with shot maps and a heart-rate curve.',
    'help.match.endTitle': 'End the live match',
    'help.match.endBody': 'On the live screen, tap “Close live match”. The match then appears in match history.',
    'help.match.reportTitle': 'Open each player’s match report',
    'help.match.reportBody': 'After the match, every player has a report with their own statistics, shot maps of where they shot from and where the ball went, and a heart-rate curve for the whole match.',

    'help.billing.metaTitle': 'Plans and billing',
    'help.billing.metaDescription': 'Where to choose and manage a Melveo plan and why the iOS app does not contain purchase buttons.',
    'help.billing.eyebrow': 'Plans and billing',
    'help.billing.title': 'Choose and manage your plan on the website',
    'help.billing.lead': 'The iOS app has no purchase buttons. Payments and plan management happen on the Melveo website.',
    'help.billing.whyTitle': 'Why payment is not in the app',
    'help.billing.whyBody': 'Apple App Store guideline 3.1.3(f) allows this companion app to operate without in-app purchasing. That is why every payment step stays on the website.',
    'help.billing.howTitle': 'How to continue',
    'help.billing.step1.title': 'Review the current plans',
    'help.billing.step1.body': 'Current prices always live in the pricing section on the home page. We do not repeat them here, so the numbers cannot drift apart.',
    'help.billing.step2.title': 'Complete payment on the website',
    'help.billing.step2.body': 'Stripe processes the payment.',
    'help.billing.step3.title': 'Manage the plan on the website',
    'help.billing.step3.body': 'Plan changes also happen on the website, not in the iOS app. Contact us if you need help.',
    'help.billing.pricingCta': 'View current plans and prices',
    'help.billing.contactCta': 'Email support',

    'help.faq.metaTitle': 'Troubleshooting',
    'help.faq.metaDescription': 'Fix installation, sign-in, invitation, permission, team navigation, and billing issues in Melveo.',
    'help.faq.eyebrow': 'Troubleshooting',
    'help.faq.title': 'Common issues',
    'help.faq.lead': 'Start with the short answer. If the issue continues, email us and tell us which screen you reached.',
    'help.faq.figuresTitle': 'Where to find it in the app',
    'help.faq.delete.alt':
      'The first account deletion step listing what is erased and what remains',
    'help.faq.delete.caption':
      'Before deleting you see what disappears at once and what stays anonymised.',
    'help.faq.language.alt': 'The app language switch between Czech and English',
    'help.faq.language.caption': 'Switch the language in your account. Part of the UI changes on next launch.',
    'help.faq.health.alt': 'The Apple Health connection settings in the account',
    'help.faq.health.caption': 'You can connect or disconnect Apple Health in your account at any time.',
    'help.faq.q1': 'How do I install Melveo?',
    'help.faq.a1': 'Melveo is currently a beta distributed through Apple TestFlight. Open the invitation, install TestFlight, and then install Melveo.',
    'help.faq.q2': 'Where do I set my password?',
    'help.faq.a2': 'You do not need one. Melveo supports sign-in with Apple, Google, or a one-time code sent to your email.',
    'help.faq.q3': 'My invite code does not work. What now?',
    'help.faq.a3': 'Check that it contains 6 to 8 characters, paste the full invite link instead, or scan the QR code. If the app says the invitation has expired, ask your coach for a fresh code.',
    'help.faq.q4': 'I cannot find the coach board.',
    'help.faq.a4': 'The coach board is not inside Home. Home is your personal dashboard; team-wide tools sit next to it in the main navigation.',
    'help.faq.q5': 'Do I have to allow HealthKit, notifications, or Polar?',
    'help.faq.a5': 'No. HealthKit is offered to players, notifications to coaching staff, and Polar to both roles. Every permission is optional and can be skipped.',
    'help.faq.q6': 'Where do I buy or change a plan?',
    'help.faq.a6': 'On the Melveo website. The iOS app has no purchase buttons, and Stripe processes payments.',

    'cookie.title': 'Cookies',
    'cookie.body': 'We use cookies for analytics and to improve the site.',
    'cookie.privacy': 'See privacy policy',
    'cookie.reject': 'Necessary only',
    'cookie.customize': 'Customize',
    'cookie.accept': 'Accept all',
  },
} as const;

export function useTranslations(lang: Lang) {
  return function t(key: keyof typeof ui.cs): string {
    return ui[lang][key] ?? ui[defaultLang][key] ?? key;
  };
}

/**
 * Detect locale from a URL path. Returns defaultLang if no locale prefix.
 */
export function getLangFromUrl(url: URL): Lang {
  const [, segment] = url.pathname.split('/');
  if (segment in ui) return segment as Lang;
  return defaultLang;
}
