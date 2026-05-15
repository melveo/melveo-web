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
    'hero.eyebrow': 'OPERAČNÍ SYSTÉM PRO TÝMOVÉ SPORTY',
    'hero.headlinePrefix': 'Hráčské signály měníme na',
    'hero.headlineLine1': 'Hráčské signály',
    'hero.headlineLine2': 'měníme na',
    'hero.headlineSuffix': '.',
    'hero.headlineInitial': 'trenérská rozhodnutí',
    'hero.headlineRotations':
      'trenérská rozhodnutí|readiness týmu|úpravy zátěže|kontext pro zápas|riziková upozornění|jasný plán',
    'hero.subline':
      'Melveo sbírá check-iny, readiness, wellness a tréninkovou zátěž a převádí je do jasného denního kontextu pro trenéry.',
    'hero.cta.appstore': 'Stáhnout v App Store',
    // Key kept as `pilot` for legacy reference; label is now generic
    // contact CTA (pilot offering retired 2026-05-04).
    'hero.cta.pilot': 'Kontakt →',
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
    'gridCard.checkin': 'Check-in',
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

    // Stage 3 — gooey punctuation. Split into two parts so the
    // "Synced." word can be coloured with brand cyan.
    'gooey.headlinePrefix': 'Trenér + hráč.',
    'gooey.headlineAccent': 'Synced.',

    // Stage 3.75 — scroll-timeline word highlight (Daniel Haim codepen)
    'wordScroll.prefix': 'Spojí',
    'wordScroll.screenReader':
      'Spojí ranní check-in s kontextem pro trenéra, RPE z tréninku se zátěží na další týden a docházku s wellness s readiness týmu.',
    'wordScroll.words':
      'check-in → kontext trenéra.|RPE → další zátěž.|wellness → readiness týmu.',

    // Stage 4 — wellness
    'wellness.eyebrow': 'RÁNO · 30 SEKUND',
    'wellness.headline': 'Pětiosý check-in.',
    'wellness.body':
      'Hráč rychle ohodnotí energii, spánek, bolestivost, náladu a motivaci. Melveo z toho vytvoří týmový kontext pro trenéra.',
    'wellness.tag': 'Doc 174 §3 — privacy contract',

    // Stage 5 — cursor-mask (Giomgio codepen abxGyQX). Two layered
    // static headlines per the codepen ("Have a nice day!" + "It will
    // be sunny" pattern). Outside the cursor circle = primary; inside
    // the circle = secondary. No JS rotation — the only "change" is
    // the cursor sweeping across.
    'orb.primary': 'Pro celý klub.',
    'orb.secondary': 'Pro každého hráče.',

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
      'Klub kupuje jednu licenci pro celý tým. Free Starter slouží jako test s menší skupinou, placené plány pokryjí běžný týmový provoz.',
    'pricing.toggleMonthly': 'Měsíčně',
    'pricing.toggleYearly': 'Ročně',
    'pricing.toggleSavings': '−17 %',
    'pricing.perDay': '/ den za tým',
    'pricing.perMonth': '/ měsíc',
    'pricing.billedYearly': 'Účtováno ročně',
    'pricing.billedMonthly': 'Účtováno měsíčně',
    'pricing.popular': 'Nejoblíbenější',
    'pricing.included': 'Co je v plánu',
    'pricing.ctaFree': 'Test s menší skupinou',
    'pricing.ctaPilot': 'Mám zájem',
    'pricing.athleteHeading': 'Potřebujete víc hráčů?',
    'pricing.athleteBody':
      'Athlete Pack rozšíří tým o dalších 10 hráčů za 5 900 Kč/rok (max 1 pack na tým).',
    'pricing.clubHeading': 'Pro celý klub',
    'pricing.clubBody':
      'Klubový balíček pokrývá více týmů najednou. Core 49 900 / Live 89 900 / Intelligence 129 900 Kč/rok.',
    'pricing.disclaimer':
      'Ceny jsou v Kč bez DPH. Provozovatel není plátcem DPH. Všechny platby zpracovává Stripe.',

    // Stage 6.75 — Data-flow visualization.
    // Standalone section for now; planned replacement for the simpler
    // DATA -> FEEDBACK promise after visual validation.
    'dataFlow.eyebrow': 'DATOVÝ TOK KLUBU',
    'dataFlow.headline':
      'Z každého hráčského vstupu vzniká trenérský kontext.',
    'dataFlow.body':
      'Melveo sbírá signály z check-inů, docházky, RPE a sessions. Spojí je do jednoho přehledu, se kterým trenér pracuje při tréninku i zápase.',
    'dataFlow.playersTitle': 'Hráči posílají signály',
    'dataFlow.playersBody':
      'Každý bod je hráč. Krátké vstupy posílají stav týmu průběžně během dne.',
    'dataFlow.coreTitle': 'melveo',
    'dataFlow.coreBody': 'Spojený týmový signál v jednom místě.',
    'dataFlow.coachTitle': 'Trenér dostává kontext',
    'dataFlow.coachBody':
      'Coach board ukáže, co je potřeba řešit před tréninkem nebo zápasem.',
    'dataFlow.signals':
      'Check-in|RPE|Docházka|Wellness|Readiness|Spánek|Bolest|Motivace',
    'dataFlow.decisions':
      'Upravit zátěž|Individuální regenerace|Změnit roli v zápase|Zvýšit monitoring|Pustit do plného tréninku',
    'dataFlow.mobileStep1': 'Hráč pošle krátký vstup',
    'dataFlow.mobileStep2': 'Melveo ho spojí s ostatními signály',
    'dataFlow.mobileStep3': 'Trenér vidí kontext pro rozhodnutí',

    // Stage 7 — data feedback promise
    'privacy.eyebrow': 'DATA → FEEDBACK',
    'privacy.headlineLine1': 'Každý vstup má',
    'privacy.headlineLine2': 'výstup pro trenéra.',
    'privacy.body':
      'Check-iny, docházka, RPE i sessions se zpracují do přehledů a signálů, se kterými může realizační tým hned pracovat.',

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
    'faq.q1': 'Budou hráči check-in opravdu dělat?',
    'faq.a1':
      'Check-in je krátký a opakuje se ve stejném rytmu. Zabere přibližně 30 sekund a trenér vidí zapojení týmu, takže není nutné hráče nahánět ručně.',
    'faq.q2': 'Kolik času to stojí trenéra denně?',
    'faq.a2':
      'Cílem je šetřit čas, ne přidat další administrativu. Trenér neprochází jednotlivé formuláře, ale dostane týmový kontext, watchlist a doporučené oblasti pozornosti.',
    'faq.q3': 'Co když už používáme jiný týmový nástroj?',
    'faq.a3':
      'Melveo nemá nahradit všechno. Zaměřuje se na denní signály hráčů, zátěž, readiness a výstup pro trenéra. Komunikace nebo klubová administrativa může dál běžet v nástrojích, které už používáte.',
    'faq.q4': 'Co se stane, když hráč vynechá den?',
    'faq.a4':
      'Melveo pracuje i s neúplnými vstupy. Trenér vidí, kdo signál poslal, a systém pořád umí ukázat trend týmu místo toho, aby se celý den rozpadl kvůli jednomu chybějícímu check-inu.',
    'faq.q5': 'Kdo vidí hráčská data?',
    'faq.a5':
      'Data jsou zpracovaná do rolí a týmového kontextu. Klub spravuje workspace, hráči mají kontrolu nad svými vstupy a data neprodáváme ani nepoužíváme k marketingu.',
    'faq.q6': 'Je Melveo pro jeden tým, akademii, nebo celý klub?',
    'faq.a6':
      'Začít můžete s jedním týmem nebo menší skupinou hráčů. Jakmile proces funguje, dává smysl rozšířit Melveo na celý klub, akademii nebo více realizačních týmů.',

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

    'hero.eyebrow': 'COACH OPERATING SYSTEM FOR TEAM SPORTS',
    'hero.headlinePrefix': 'Player signals become',
    'hero.headlineLine1': 'Player signals',
    'hero.headlineLine2': 'become',
    'hero.headlineSuffix': '.',
    'hero.headlineInitial': 'coach decisions',
    'hero.headlineRotations':
      'coach decisions|team readiness|load adjustments|match-day clarity|risk alerts|coach context',
    'hero.subline':
      'Melveo collects check-ins, readiness, wellness and training load, then turns them into clear daily context for coaches.',
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
    'gridCard.checkin': 'Check-in',
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

    'gooey.headlinePrefix': 'Coach + player.',
    'gooey.headlineAccent': 'Synced.',

    'wordScroll.prefix': 'Connects',
    'wordScroll.screenReader':
      'Connects morning check-in to coach-ready context, training RPE to next-week load, and attendance plus wellness to team readiness.',
    'wordScroll.words':
      'check-in → coach context.|RPE → next-week load.|wellness → team readiness.',

    'wellness.eyebrow': 'MORNING · 30 SECONDS',
    'wellness.headline': '5-axis check-in.',
    'wellness.body':
      'Players rate energy, sleep, soreness, mood, and motivation. Melveo turns it into team context for the coach.',
    'wellness.tag': 'Doc 174 §3 — privacy contract',

    'orb.primary': 'For the whole club.',
    'orb.secondary': 'For every player.',

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
      "Clubs buy one license for the team. Free Starter is a small-group test; paid plans cover day-to-day team operations.",
    'pricing.toggleMonthly': 'Monthly',
    'pricing.toggleYearly': 'Yearly',
    'pricing.toggleSavings': '−17 %',
    'pricing.perDay': '/ day for team',
    'pricing.perMonth': '/ month',
    'pricing.billedYearly': 'Billed yearly',
    'pricing.billedMonthly': 'Billed monthly',
    'pricing.popular': 'Most popular',
    'pricing.included': "What's included",
    'pricing.ctaFree': 'Start with small group',
    'pricing.ctaPilot': 'Get in touch',
    'pricing.athleteHeading': 'Need more players?',
    'pricing.athleteBody':
      'The Athlete Pack adds 10 more players for 5,900 CZK / year (max 1 pack per team).',
    'pricing.clubHeading': 'For the whole club',
    'pricing.clubBody':
      'The club bundle covers multiple teams at once. Core 49,900 / Live 89,900 / Intelligence 129,900 CZK / year.',
    'pricing.disclaimer':
      'Prices in CZK, VAT not applicable. Operator is not a VAT payer. All payments processed by Stripe.',

    'dataFlow.eyebrow': 'CLUB DATA FLOW',
    'dataFlow.headline': 'Every player input becomes coaching context.',
    'dataFlow.body':
      'Melveo collects signals from check-ins, attendance, RPE, and sessions. It combines them into one view coaches can use in training and on match day.',
    'dataFlow.playersTitle': 'Players send signals',
    'dataFlow.playersBody':
      'Each dot is a player. Short inputs keep the staff close to the team during the day.',
    'dataFlow.coreTitle': 'melveo',
    'dataFlow.coreBody': 'One connected team signal.',
    'dataFlow.coachTitle': 'Coaches get context',
    'dataFlow.coachBody':
      'The coach board shows what needs attention before training or match decisions.',
    'dataFlow.signals':
      'Check-in|RPE|Attendance|Wellness|Readiness|Sleep|Pain|Motivation',
    'dataFlow.decisions':
      'Adjust load|Individual recovery|Change match role|Increase monitoring|Full training clearance',
    'dataFlow.mobileStep1': 'Player sends a short input',
    'dataFlow.mobileStep2': 'Melveo combines it with team signals',
    'dataFlow.mobileStep3': 'Coach sees decision-ready context',

    'privacy.eyebrow': 'DATA → FEEDBACK',
    'privacy.headlineLine1': "Every input creates",
    'privacy.headlineLine2': "coach-ready output.",
    'privacy.body':
      'Check-ins, attendance, RPE, and sessions become clear signals the coaching staff can use immediately.',

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
    'faq.q1': 'Will players actually check in?',
    'faq.a1':
      'The check-in is short and repeats in the same daily rhythm. It takes about 30 seconds, and coaches can see team uptake without chasing players manually.',
    'faq.q2': 'How much time does it cost coaches every day?',
    'faq.a2':
      'The goal is to save time, not create admin. Coaches do not read every form; they get team context, a watchlist, and the areas that need attention.',
    'faq.q3': 'What if we already use another team tool?',
    'faq.a3':
      'Melveo does not need to replace everything. It focuses on daily player signals, load, readiness, and coach output. Communication or club admin can stay in the tools you already use.',
    'faq.q4': 'What happens when a player misses a day?',
    'faq.a4':
      'Melveo still works with incomplete inputs. Coaches see who sent a signal, and the team trend remains useful instead of the whole day depending on one missing check-in.',
    'faq.q5': 'Who can see player data?',
    'faq.a5':
      'Data is translated into role-based team context. The club manages the workspace, players keep control of their inputs, and we never sell data or use it for marketing.',
    'faq.q6': 'Is Melveo for one team, an academy, or a whole club?',
    'faq.a6':
      'You can start with one team or a smaller player group. Once the process works, Melveo can expand to the whole club, academy, or multiple staff groups.',

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
