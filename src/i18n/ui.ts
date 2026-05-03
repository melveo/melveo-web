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
    'footer.copyright': '© 2026 QUIX Global s.r.o.',
    'footer.privacy': 'Ochrana soukromí',
    'footer.terms': 'Podmínky',
    'footer.cookieSettings': 'Nastavení cookies',

    // Hero
    'hero.eyebrow': 'PRO SPORTOVNÍ KLUBY',
    'hero.headlinePrefix': 'Chytřejší',
    'hero.headlineSuffix': '.',
    'hero.subline': 'Wellness, sessions a coach board v jedné aplikaci.',
    'hero.cta.appstore': 'Stáhnout v App Store',
    'hero.cta.pilot': 'Pilot pro klub →',
    'hero.beta': 'TestFlight beta · brzy',

    // Stage 2+3 — scroll-linked image grid morph (Kevin Gutowski codepen)
    'gridMorph.headlineLine1': 'Pojďme',
    'gridMorph.headlineLine2': 'scrollovat.',
    'gridMorph.subline': 'Tým, trenér, zázemí — všechno v jedné aplikaci.',
    'gridMorph.scrollHint': 'Scrolovat',

    // Stage 2/3 — tech-card labels overlaid on the photo grid
    // Each card maps to a concrete Melveo product feature (user
    // feedback 2026-05-01: previous generic labels could've been on
    // any SaaS — these are Melveo-specific). 8 cards covering the
    // full daily flow: morning ritual → training → coach reaction →
    // billing/privacy promise.
    'gridCard.checkin': '5osý check-in',
    'gridCard.sessions': 'Sessions',
    'gridCard.attendance': 'Docházka',
    'gridCard.load': 'Zátěž & RPE',
    'gridCard.coachBoard': 'Coach board',
    'gridCard.recovery': 'Regenerace',
    'gridCard.decisions': 'Rozhodnutí',
    'gridCard.privacy': 'Privacy hráče',

    // Stage 3 — gooey punctuation. Split into two parts so the
    // "Synced." word can be coloured with brand cyan.
    'gooey.headlinePrefix': 'Trenér + hráč.',
    'gooey.headlineAccent': 'Synced.',

    // Stage 3.75 — scroll-timeline word highlight (Daniel Haim codepen)
    'wordScroll.prefix': 'Spojí',
    'wordScroll.screenReader':
      'Spojí check-iny, hráče, trenéry, sessions, docházku, zátěž, RPE, wellness, coach board, rozhodnutí, plán, komunikaci, sezónu, data a celý klub.',
    'wordScroll.words':
      'check-iny.|hráče.|trenéry.|sessions.|docházku.|zátěž.|RPE.|wellness.|coach board.|rozhodnutí.|plán.|komunikaci.|sezónu.|data.|celý klub.',

    // Stage 4 — wellness
    'wellness.eyebrow': 'RÁNO · 30 SEKUND',
    'wellness.headline': 'Pětiosý check-in.',
    'wellness.body':
      'Hráč rychle ohodnotí energii, spánek, bolestivost, náladu a motivaci. Trenér vidí tým — nikdy syrová čísla jednotlivce.',
    'wellness.tag': 'Doc 174 §3 — privacy contract',

    // Stage 5 — cursor-mask (Giomgio codepen abxGyQX). Two layered
    // static headlines per the codepen ("Have a nice day!" + "It will
    // be sunny" pattern). Outside the cursor circle = primary; inside
    // the circle = secondary. No JS rotation — the only "change" is
    // the cursor sweeping across.
    'orb.primary': 'Pro celý klub.',
    'orb.secondary': 'Pro každého hráče.',

    // Stage 5.5 — particle statement after the club/player reveal.
    'particles.eyebrow': 'JEDEN SYSTÉM',
    'particles.headlinePrefix': 'Všechno pro',
    'particles.headlineSuffix': '.',
    'particles.subline': 'Od ranního check-inu po rozhodnutí na tréninku. Tým běží v jednom rytmu.',

    // Stage 6.25 — Technical-feature mini bridge before pricing.
    // Same visual family as gooey stage. Pairs the live-data feature
    // (coach board real-time) with the anti-feature differentiator
    // (no spreadsheets, no paper, no WhatsApp groups) — fits the
    // visual of two cyan values merging into one promise.
    'promise.headlinePrefix': 'Realtime data.',
    'promise.headlineAccent': 'Bez papíru.',

    // Stage 6 — sessions + coach board
    'sessions.eyebrow': 'TRÉNINK · ROZHODNUTÍ',
    'sessions.headline': 'Sessions a coach board.',
    'sessions.body':
      'Plánuj tréninky, zaznamenej účast, sleduj zátěž (RPE). Než přijedeš na hřiště, víš co tým potřebuje.',

    // Stage 6.5 — Pricing
    'pricing.eyebrow': 'CENÍK',
    'pricing.headline': 'Začni zdarma.',
    'pricing.headlineAccent': 'Plať jen co potřebuješ.',
    'pricing.subline':
      'Klub kupuje licenci pro celý tým. Hráči ani trenéři nikdy neplatí. Pilot a roční plány lze zrušit kdykoliv.',
    'pricing.toggleMonthly': 'Měsíčně',
    'pricing.toggleYearly': 'Ročně',
    'pricing.toggleSavings': '−17 %',
    'pricing.perDay': '/ den',
    'pricing.perMonth': '/ měsíc',
    'pricing.billedYearly': 'Účtováno ročně',
    'pricing.billedMonthly': 'Účtováno měsíčně',
    'pricing.popular': 'Nejoblíbenější',
    'pricing.included': 'Co je v plánu',
    'pricing.ctaFree': 'Začít zdarma',
    'pricing.ctaPilot': 'Vyžádat pilot',
    'pricing.athleteHeading': 'Potřebujete víc hráčů?',
    'pricing.athleteBody':
      'Athlete Pack rozšíří tým o dalších 10 hráčů za 5 900 Kč/rok (max 1 pack na tým).',
    'pricing.clubHeading': 'Pro celý klub',
    'pricing.clubBody':
      'Klubový balíček pokrývá více týmů najednou. Core 49 900 / Live 89 900 / Intelligence 129 900 Kč/rok.',
    'pricing.disclaimer':
      'Ceny jsou v Kč bez DPH. Provozovatel není plátcem DPH. Všechny platby zpracovává Stripe.',

    // Stage 7 — data feedback promise
    'privacy.eyebrow': 'DATA → FEEDBACK',
    'privacy.headlineLine1': 'Každý vstup má',
    'privacy.headlineLine2': 'výstup pro trenéra.',
    'privacy.body':
      'Check-iny, docházka, RPE i sessions se zpracují do přehledů a signálů, se kterými může realizační tým hned pracovat.',

    // Stage 6.75 — App screenshot showcase (placeholder pre real images)
    // User dodá reálné iOS screenshoty appky později. Do té doby
    // se zobrazí 3 prázdné phone-frame placeholdery v správném layoutu
    // — když přijdou skutečné obrázky, stačí je dropnout do
    // /public/images/app-shots/ a v komponentě prohodit src.
    'appShots.eyebrow': 'JAK VYPADÁ APPKA',
    'appShots.headline': 'V telefonu hráče i trenéra.',
    'appShots.body':
      'Tři klíčové obrazovky: ranní check-in pro hráče, sessions plán pro trenéra, coach board pro realizační tým.',
    'appShots.shot1Title': 'Ranní check-in',
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
    'testimonial.eyebrow': 'OD KLUBU',
    'testimonial.placeholder': 'Citát bude doplněn po prvním pilotu.',
    'testimonial.placeholderAuthor': 'Trenér · klub · sport',
    'testimonial.quote':
      '„Melveo je první nástroj, který nám dal kontext na trénink, ne jenom čísla. Ranní check-in zabere 30 vteřin a my víme, koho ten den šetřit a koho zatížit."',
    'testimonial.author': 'Jan Novák',
    'testimonial.role': 'Hlavní trenér · SK Melveo · fotbal U19',

    // Stage 8 — FAQ (added 2026-05-03)
    // Six questions covering the most common things a club/coach
    // asks before booking a pilot or downloading the app. Keep
    // answers short — long answers go in the docs/blog later.
    'faq.eyebrow': 'OTÁZKY',
    'faq.headline': 'Časté otázky.',
    'faq.q1': 'Kdo platí — klub nebo hráč?',
    'faq.a1':
      'Platí klub jednou licencí pro celý tým. Hráči ani trenéři nikdy neplatí — appka je pro ně zdarma. Klub může pilot zrušit kdykoliv.',
    'faq.q2': 'Co všechno hráč pošle při check-inu?',
    'faq.a2':
      'Pětiosý formulář: energie, spánek, bolestivost, nálada, motivace. 30 vteřin ráno. Trenér vidí týmový signál — nikdy syrová čísla jednotlivce.',
    'faq.q3': 'Jak je to s ochranou dat hráčů?',
    'faq.a3':
      'Data zůstávají v EU (Cloudflare Frankfurt + Supabase). Hráč může kdykoliv smazat účet a všechna data. Nikdy data neprodáváme ani nepoužíváme k marketingu.',
    'faq.q4': 'Pro jaké sporty je Melveo?',
    'faq.a4':
      'Týmové sporty — fotbal, hokej, volejbal, basketbal, házená, ragby, lacrosse. Wellness check-in i RPE jsou sport-agnostic. Plánujeme i individuální sporty.',
    'faq.q5': 'Co když některý hráč nechce check-in vyplňovat?',
    'faq.a5':
      'Žádný problém — appka funguje i s 60-70 % týmu. Trenér vidí kdo se zapojil. Většina hráčů ale po prvním týdnu navykne sama, je to 30 sekund.',
    'faq.q6': 'Jak začneme?',
    'faq.a6':
      'Napiš nám na hello@melveo.app — domluvíme 15 minut hovor, ukážeme appku a nasadíme pilot pro tvůj tým. Pilot je 1 970 Kč na 30 dní s garancí vrácení peněz.',

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
    'footer.copyright': '© 2026 QUIX Global s.r.o.',
    'footer.privacy': 'Privacy',
    'footer.terms': 'Terms',
    'footer.cookieSettings': 'Cookie settings',

    'hero.eyebrow': 'FOR SPORTS CLUBS',
    'hero.headlinePrefix': 'Smarter',
    'hero.headlineSuffix': '.',
    'hero.subline': 'Wellness, sessions, and coach board in one app.',
    'hero.cta.appstore': 'Download on the App Store',
    'hero.cta.pilot': 'Pilot for your club →',
    'hero.beta': 'TestFlight beta · soon',

    'gridMorph.headlineLine1': "Let's",
    'gridMorph.headlineLine2': 'scroll.',
    'gridMorph.subline': 'Team, coach, ops — all in one app.',
    'gridMorph.scrollHint': 'Scroll',

    // 8 Melveo-specific feature cards (matches CS keys above)
    'gridCard.checkin': '5-axis check-in',
    'gridCard.sessions': 'Sessions',
    'gridCard.attendance': 'Attendance',
    'gridCard.load': 'Load & RPE',
    'gridCard.coachBoard': 'Coach board',
    'gridCard.recovery': 'Recovery',
    'gridCard.decisions': 'Decisions',
    'gridCard.privacy': 'Player privacy',

    'gooey.headlinePrefix': 'Coach + player.',
    'gooey.headlineAccent': 'Synced.',

    'wordScroll.prefix': 'Connects',
    'wordScroll.screenReader':
      'Connects check-ins, players, coaches, sessions, attendance, load, RPE, wellness, coach board, decisions, planning, communication, season, data, and the whole club.',
    'wordScroll.words':
      'check-ins.|players.|coaches.|sessions.|attendance.|load.|RPE.|wellness.|coach board.|decisions.|planning.|communication.|season.|data.|the whole club.',

    'wellness.eyebrow': 'MORNING · 30 SECONDS',
    'wellness.headline': '5-axis check-in.',
    'wellness.body':
      "Players rate energy, sleep, soreness, mood, motivation. Coach sees the team — never an individual's raw numbers.",
    'wellness.tag': 'Doc 174 §3 — privacy contract',

    'orb.primary': 'For the whole club.',
    'orb.secondary': 'For every player.',

    'particles.eyebrow': 'ONE SYSTEM',
    'particles.headlinePrefix': 'Everything for',
    'particles.headlineSuffix': '.',
    'particles.subline': 'From morning check-in to training decisions. The team moves in one rhythm.',

    'promise.headlinePrefix': 'Real-time data.',
    'promise.headlineAccent': 'No paper.',

    'sessions.eyebrow': 'TRAINING · DECISIONS',
    'sessions.headline': 'Sessions and coach board.',
    'sessions.body':
      'Plan trainings, log attendance, track load (RPE). Before you arrive at the pitch, you know what the team needs.',

    // Stage 6.5 — Pricing
    'pricing.eyebrow': 'PRICING',
    'pricing.headline': 'Start free.',
    'pricing.headlineAccent': 'Pay only for what you need.',
    'pricing.subline':
      "Clubs buy a licence for the whole team. Players and coaches never pay. Pilots and annual plans can be cancelled anytime.",
    'pricing.toggleMonthly': 'Monthly',
    'pricing.toggleYearly': 'Yearly',
    'pricing.toggleSavings': '−17 %',
    'pricing.perDay': '/ day',
    'pricing.perMonth': '/ month',
    'pricing.billedYearly': 'Billed yearly',
    'pricing.billedMonthly': 'Billed monthly',
    'pricing.popular': 'Most popular',
    'pricing.included': "What's included",
    'pricing.ctaFree': 'Start free',
    'pricing.ctaPilot': 'Request pilot',
    'pricing.athleteHeading': 'Need more players?',
    'pricing.athleteBody':
      'The Athlete Pack adds 10 more players for 5,900 CZK / year (max 1 pack per team).',
    'pricing.clubHeading': 'For the whole club',
    'pricing.clubBody':
      'The club bundle covers multiple teams at once. Core 49,900 / Live 89,900 / Intelligence 129,900 CZK / year.',
    'pricing.disclaimer':
      'Prices in CZK, VAT not applicable. Operator is not a VAT payer. All payments processed by Stripe.',

    'privacy.eyebrow': 'DATA → FEEDBACK',
    'privacy.headlineLine1': "Every input creates",
    'privacy.headlineLine2': "coach-ready output.",
    'privacy.body':
      'Check-ins, attendance, RPE, and sessions become clear signals the coaching staff can use immediately.',

    // App screenshot showcase — placeholder + final-shape strings
    'appShots.eyebrow': 'WHAT THE APP LOOKS LIKE',
    'appShots.headline': 'On the player\'s and coach\'s phone.',
    'appShots.body':
      'Three key screens: morning check-in for the player, sessions plan for the coach, coach board for the staff.',
    'appShots.shot1Title': 'Morning check-in',
    'appShots.shot1Caption': '5-axis rating in 30 seconds.',
    'appShots.shot2Title': 'Sessions',
    'appShots.shot2Caption': 'Plan, attendance, RPE.',
    'appShots.shot3Title': 'Coach board',
    'appShots.shot3Caption': 'Team context, real-time.',
    'appShots.placeholder': 'Screenshot coming',

    // Customer testimonial — placeholder + final-shape strings
    'testimonial.eyebrow': 'FROM A CLUB',
    'testimonial.placeholder': 'Quote coming after the first pilot.',
    'testimonial.placeholderAuthor': 'Coach · club · sport',
    'testimonial.quote':
      '"Melveo is the first tool that gave us context for training, not just numbers. The morning check-in takes 30 seconds and we know who to spare and who to load that day."',
    'testimonial.author': 'Jan Novák',
    'testimonial.role': 'Head coach · SK Melveo · football U19',

    // FAQ (mirrors CS keys above)
    'faq.eyebrow': 'QUESTIONS',
    'faq.headline': 'Frequently asked.',
    'faq.q1': 'Who pays — the club or the player?',
    'faq.a1':
      'The club pays one licence for the whole team. Players and coaches never pay — the app is free for them. The club can cancel a pilot at any time.',
    'faq.q2': 'What does a player send during check-in?',
    'faq.a2':
      'A 5-axis form: energy, sleep, soreness, mood, motivation. 30 seconds in the morning. Coaches see a team signal — never raw individual numbers.',
    'faq.q3': 'How is player data protected?',
    'faq.a3':
      'Data stays in the EU (Cloudflare Frankfurt + Supabase). Players can delete their account and all data at any time. We never sell data or use it for marketing.',
    'faq.q4': 'Which sports does Melveo support?',
    'faq.a4':
      'Team sports — football/soccer, hockey, volleyball, basketball, handball, rugby, lacrosse. Wellness check-in and RPE are sport-agnostic. Individual sports are on the roadmap.',
    'faq.q5': 'What if some players don’t want to check in?',
    'faq.a5':
      'No problem — the app works with 60–70 % team uptake too. Coaches see who joined. Most players settle in after the first week — it’s 30 seconds.',
    'faq.q6': 'How do we start?',
    'faq.a6':
      'Write us at hello@melveo.app — we set up a 15-minute call, demo the app, and start a pilot for your team. The pilot is 1,970 CZK for 30 days with a money-back guarantee.',

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
