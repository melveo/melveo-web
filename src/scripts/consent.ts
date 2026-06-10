/**
 * Cookie consent state machine — V4-E.
 *
 * Per PLAN.md §7.8 + Q17:
 *   - localStorage key `melveo:consent` with versioned schema
 *   - 3 categories: necessary (always), analytics, marketing
 *   - First-visit: banner shown after idle (don't block LCP)
 *   - Subsequent visits: banner hidden if state.version matches CURRENT
 *   - Withdraw via footer "Cookie nastavení" link → re-show banner
 *   - GTM consent state mode v2 wired (`gtag('consent', ...)`)
 *
 * Compliance:
 *   - GDPR Art. 6(1)(a) — explicit opt-in
 *   - CZ zák. 127/2005 Sb. §89 — cookie/device-storage opt-in
 *   - CZ zák. 480/2004 Sb. §7 — commercial communications
 *   - EDPB 03/2022 — reject as easy as accept
 */

export type ConsentCategory = 'analytics' | 'marketing';

export interface ConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  version: number;
  timestamp: string;
}

export const STORAGE_KEY = 'melveo:consent';
export const CURRENT_VERSION = 1;

/**
 * Default consent state — denied for analytics + marketing per
 * GDPR opt-in requirement.
 */
export const DENIED_DEFAULT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
  version: CURRENT_VERSION,
  timestamp: new Date(0).toISOString(),
};

/**
 * Read current consent from localStorage. Returns null if absent
 * or schema version mismatch (banner should re-prompt).
 */
export function loadConsent(): ConsentState | null {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (parsed.version !== CURRENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

/**
 * Persist consent and propagate to GTM Consent Mode v2.
 * Call this on banner button click.
 */
export function saveConsent(opts: {
  analytics: boolean;
  marketing: boolean;
}): ConsentState {
  const state: ConsentState = {
    necessary: true,
    analytics: opts.analytics,
    marketing: opts.marketing,
    version: CURRENT_VERSION,
    timestamp: new Date().toISOString(),
  };

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  // Notify GTM (Google Consent Mode v2 — gtag layer).
  // Safe even before gtag exists; we'll buffer via dataLayer.
  if (typeof window !== 'undefined') {
    const dataLayer = ((window as any).dataLayer ??= []);
    function gtag(...args: unknown[]) {
      dataLayer.push(args);
    }
    gtag('consent', 'update', {
      ad_storage: opts.marketing ? 'granted' : 'denied',
      ad_user_data: opts.marketing ? 'granted' : 'denied',
      ad_personalization: opts.marketing ? 'granted' : 'denied',
      analytics_storage: opts.analytics ? 'granted' : 'denied',
    });

    // Custom event for any local listeners (banner show/hide,
    // CSS toggles, etc.)
    window.dispatchEvent(
      new CustomEvent<ConsentState>('melveo-consent-change', { detail: state }),
    );
  }

  return state;
}

/**
 * Re-open banner from footer link — clears persisted state so banner
 * re-shows on next page load + immediately on this page.
 */
export function reopenBanner() {
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('melveo-consent-reopen'));
  }
}
