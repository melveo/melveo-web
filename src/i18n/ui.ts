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

export const ui = {
  cs: {
    // Header / footer
    'nav.contact': 'hello@melveo.app',
    'footer.copyright': '© 2026 melveo',
    'footer.privacy': 'Ochrana soukromí',
    'footer.terms': 'Podmínky',
    'footer.cookieSettings': 'Nastavení cookies',

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
    // Key kept as `pilot` for legacy reference; label is now generic
    // contact CTA (pilot offering retired 2026-05-04).
    'hero.cta.pilot': 'Mám zájem →',
    'hero.beta': 'TestFlight beta · brzy',
    'hero.appstoreNotice':
      'Melveo zatím v App Store není. Napiš nám na hello@melveo.app a ozveme se.',

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
    'gridAlt.team-huddle': 'Tým v kruhu při společném nástupu před zápasem',
    'gridAlt.player-mobile': 'Hráč v šatně vyplňuje ranní wellness check-in na mobilu',
    'gridAlt.coach-player-review': 'Trenér s hráčem prochází zpětnou vazbu na tabletu',
    'gridAlt.coach-field-tablet': 'Trenér na hřišti sleduje tréninková data na tabletu',
    'gridAlt.equipment-detail': 'Detail sportovního vybavení v šatně',
    'gridAlt.player-portrait': 'Portrét soustředěného hráče před tréninkem',
    'gridAlt.player-action': 'Hráč v plné akci během zápasu',
    'gridAlt.player-defense': 'Hráč v obranném postavení během utkání',
    'gridAlt.coach-hall-tablet': 'Trenér ve sportovní hale s tabletem v ruce',
    'gridAlt.player-locker': 'Hráč v šatně při přípravě před tréninkem',
    'gridAlt.jersey-brand': 'Týmový dres s logem Melveo',
    'gridAlt.coach-team-dialogue': 'Trenér v dialogu s týmem při tréninku',
    'gridAlt.coach-evening-tablet': 'Trenér večer plánuje trénink na tabletu',
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
    'pricing.headlineAccent': 'Plať jen za to, co používáš.',
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
    'footer.cookieSettings': 'Cookie settings',

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
    'hero.cta.pilot': 'Get in touch →',
    'hero.beta': 'TestFlight beta · soon',
    'hero.appstoreNotice':
      "Melveo isn't on the App Store yet. Email us at hello@melveo.app and we'll get back to you.",

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
    'gridAlt.team-huddle': 'Team standing in a huddle before the match',
    'gridAlt.player-mobile': 'Player filling in the morning wellness check-in on a phone in the locker room',
    'gridAlt.coach-player-review': 'Coach and player going through feedback on a tablet',
    'gridAlt.coach-field-tablet': 'Coach on the pitch checking training data on a tablet',
    'gridAlt.equipment-detail': 'Close-up of sports equipment in the locker room',
    'gridAlt.player-portrait': 'Portrait of a focused player before training',
    'gridAlt.player-action': 'Player in full action during a match',
    'gridAlt.player-defense': 'Player in a defensive stance during a game',
    'gridAlt.coach-hall-tablet': 'Coach in a sports hall holding a tablet',
    'gridAlt.player-locker': 'Player getting ready in the locker room before training',
    'gridAlt.jersey-brand': 'Team jersey with the Melveo logo',
    'gridAlt.coach-team-dialogue': 'Coach talking with the team during training',
    'gridAlt.coach-evening-tablet': 'Coach planning a session on a tablet in the evening',
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
    'pricing.headlineAccent': 'Pay only for what you use.',
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
