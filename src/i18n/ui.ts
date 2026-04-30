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

    // Stage 3 — gooey punctuation. Split into two parts so the
    // "Synced." word can be coloured with brand cyan.
    'gooey.headlinePrefix': 'Trenér + hráč.',
    'gooey.headlineAccent': 'Synced.',

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

    // Stage 6 — sessions + coach board
    'sessions.eyebrow': 'TRÉNINK · ROZHODNUTÍ',
    'sessions.headline': 'Sessions a coach board.',
    'sessions.body':
      'Plánuj tréninky, zaznamenej účast, sleduj zátěž (RPE). Než přijedeš na hřiště, víš co tým potřebuje.',

    // Stage 7 — privacy promise
    'privacy.eyebrow': 'SOUKROMÍ',
    'privacy.headlineLine1': 'Trenér nikdy nevidí',
    'privacy.headlineLine2': 'syrová čísla hráče.',
    'privacy.body':
      'Wellness data jsou agregovaná. Klub kupuje, hráč nikdy neplatí. Co je hráčovo, zůstává hráčovo.',

    // Stage 9 — pilot CTA
    'pilot.headline': 'Klub a chcete pilot?',
    'pilot.body': 'Napište, krátce zavoláme, do 14 dní spustíme první trénink.',
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

    'gooey.headlinePrefix': 'Coach + player.',
    'gooey.headlineAccent': 'Synced.',

    'wellness.eyebrow': 'MORNING · 30 SECONDS',
    'wellness.headline': '5-axis check-in.',
    'wellness.body':
      "Players rate energy, sleep, soreness, mood, motivation. Coach sees the team — never an individual's raw numbers.",
    'wellness.tag': 'Doc 174 §3 — privacy contract',

    'orb.primary': 'For the whole club.',
    'orb.secondary': 'For every player.',

    'sessions.eyebrow': 'TRAINING · DECISIONS',
    'sessions.headline': 'Sessions and coach board.',
    'sessions.body':
      'Plan trainings, log attendance, track load (RPE). Before you arrive at the pitch, you know what the team needs.',

    'privacy.eyebrow': 'PRIVACY',
    'privacy.headlineLine1': "Coach never sees",
    'privacy.headlineLine2': "raw player numbers.",
    'privacy.body':
      "Wellness data is aggregated. Clubs pay, players never. What's a player's stays a player's.",

    'pilot.headline': 'Pilot for your club?',
    'pilot.body': "Write to us, short call, first training in 14 days.",
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
