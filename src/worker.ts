/**
 * melveo-web Worker entry — handles /api/* routes, falls through to
 * static assets for everything else.
 *
 * Routes:
 *   POST /api/lead  → forwards a lead form submission to Resend so the
 *                     team gets an email at hello@melveo.app. Used by
 *                     the App Store "notify me" form and the Pilot
 *                     inquiry form on the landing page.
 *
 * Security:
 *   - Same-origin check (Origin / Referer must match melveo.app or
 *     localhost during dev).
 *   - Honeypot field — bots fill the hidden "website" field, real
 *     users don't. Submissions with non-empty honeypot return 204
 *     (silent success) so bots think it worked + move on.
 *   - Per-IP rate limit via Workers KV — max 3 submissions per
 *     IP per 10 minutes.
 *   - Server-side validation on every field.
 *
 * Secrets / env:
 *   RESEND_API_KEY        — secret, set via `wrangler secret put`
 *   LEAD_NOTIFY_TO        — var, default 'hello@melveo.app'
 *   LEAD_NOTIFY_FROM      — var, default 'Melveo Web <notifications@melveo.app>'
 *
 * Without RESEND_API_KEY the endpoint logs the submission via
 * console.log + returns 200 — useful during dev and as a fallback
 * if Resend ever rate-limits us. The team should monitor build logs
 * during that window.
 */

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
  RESEND_API_KEY?: string;
  LEAD_NOTIFY_TO?: string;
  LEAD_NOTIFY_FROM?: string;
  LEAD_RATE_LIMIT?: KVNamespace;
}

// Cloudflare Workers KV — typed minimally for what we use.
interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ): Promise<void>;
}

const ALLOWED_ORIGINS = new Set([
  'https://melveo.app',
  'https://www.melveo.app',
  'http://localhost:4321',
  'http://localhost:8787',
]);

const RATE_LIMIT_WINDOW_S = 600; // 10 minutes
const RATE_LIMIT_MAX = 3; // submissions per IP per window

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/lead' && request.method === 'POST') {
      return handleLead(request, env);
    }

    // Everything else → static assets binding.
    return env.ASSETS.fetch(request);
  },
};

async function handleLead(request: Request, env: Env): Promise<Response> {
  // ─── Same-origin check ──────────────────────────────────────────
  const origin = request.headers.get('Origin');
  const referer = request.headers.get('Referer');
  const sourceOrigin = origin ?? (referer ? new URL(referer).origin : null);
  if (!sourceOrigin || !ALLOWED_ORIGINS.has(sourceOrigin)) {
    return jsonError(403, 'origin_not_allowed');
  }

  // ─── Parse body ─────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, 'invalid_json');
  }

  const type = String(body.type ?? '').slice(0, 32);
  const email = String(body.email ?? '').trim().slice(0, 254);
  const honeypot = String(body.website ?? '').trim();
  const club = String(body.club ?? '').trim().slice(0, 200);
  const sport = String(body.sport ?? '').trim().slice(0, 60);
  const role = String(body.role ?? '').trim().slice(0, 80);
  const message = String(body.message ?? '').trim().slice(0, 1000);
  const lang = String(body.lang ?? 'cs').slice(0, 8);

  // ─── Honeypot — silently succeed for bots ───────────────────────
  if (honeypot.length > 0) {
    return new Response(null, { status: 204 });
  }

  // ─── Validate type + email ──────────────────────────────────────
  // Pilot lead type was retired 2026-05-04 (pricing pilot offering
  // sunset). Only `app-notify` is accepted now. Stale pilot POSTs
  // (cached HTML on someone's machine) get a clear 400 rather than
  // silently succeeding — UX falls through to the bottom-page mailto.
  if (type !== 'app-notify') {
    return jsonError(400, 'invalid_type');
  }
  if (!isValidEmail(email)) {
    return jsonError(400, 'invalid_email');
  }

  // ─── Rate limit (best-effort — needs KV binding) ────────────────
  const ip =
    request.headers.get('CF-Connecting-IP') ??
    request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ??
    'unknown';
  const limited = await isRateLimited(env.LEAD_RATE_LIMIT, ip);
  if (limited) {
    return jsonError(429, 'rate_limited');
  }

  // ─── Compose + send ─────────────────────────────────────────────
  const subject = '[Melveo App Store notify]';

  // `club / sport / role / message` fields are no longer collected by
  // any form; left as no-ops in the parsing block above so a stale
  // cached pilot POST gets a 400 rather than crashing the worker.
  void club; void sport; void role; void message;

  const lines = [
    `Type: ${type}`,
    `Email: ${email}`,
    `Lang: ${lang}`,
    `IP: ${ip}`,
    `User-Agent: ${request.headers.get('User-Agent') ?? ''}`,
  ];

  const text = lines.join('\n');
  const html = `<pre style="font:14px/1.4 -apple-system,BlinkMacSystemFont,system-ui,sans-serif">${escapeHtml(text)}</pre>`;

  if (!env.RESEND_API_KEY) {
    // Dev / fallback — log to console so the team sees it via
    // wrangler tail. Returns 200 so the form UX shows success.
    console.log('[melveo-web] lead (no Resend key):', text);
    return jsonOk();
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.LEAD_NOTIFY_FROM ?? 'Melveo Web <notifications@melveo.app>',
        to: [env.LEAD_NOTIFY_TO ?? 'hello@melveo.app'],
        reply_to: email,
        subject,
        text,
        html,
      }),
    });
    if (!resendResponse.ok) {
      const errBody = await resendResponse.text();
      console.error('[melveo-web] Resend error:', resendResponse.status, errBody);
      return jsonError(502, 'send_failed');
    }
  } catch (err) {
    console.error('[melveo-web] Resend exception:', err);
    return jsonError(502, 'send_exception');
  }

  // Bump rate-limit counter only on success.
  await bumpRateLimit(env.LEAD_RATE_LIMIT, ip);

  return jsonOk();
}

function isValidEmail(value: string): boolean {
  // Pragmatic regex — covers ~99 % of real addresses. Server-side
  // only; client-side has its own validation.
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 254;
}

async function isRateLimited(kv: KVNamespace | undefined, ip: string) {
  if (!kv) {
    // Loud warning so `wrangler tail` surfaces the misconfiguration —
    // the endpoint is wide-open to per-IP abuse without KV. We do NOT
    // fail-closed here (that would self-DoS legit submissions on
    // every request the moment KV unbinds); instead the warning is
    // the alarm that ops needs to fix the binding.
    //
    // 2026-05-18 audit recommendation: also wire Cloudflare Turnstile
    // (free, native to Workers) as a second line of defence that
    // works even without KV. See docs/audit-2026-05-18.md C3.
    console.error(
      '[melveo-web] CRITICAL: LEAD_RATE_LIMIT KV unbound — /api/lead is unlimited per IP. Fix in wrangler.toml + dashboard binding.',
    );
    return false;
  }
  const key = `rl:lead:${ip}`;
  const current = parseInt((await kv.get(key)) ?? '0', 10);
  return current >= RATE_LIMIT_MAX;
}

async function bumpRateLimit(kv: KVNamespace | undefined, ip: string) {
  if (!kv) return;
  const key = `rl:lead:${ip}`;
  const current = parseInt((await kv.get(key)) ?? '0', 10);
  await kv.put(key, String(current + 1), {
    expirationTtl: RATE_LIMIT_WINDOW_S,
  });
}

function jsonOk(): Response {
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function jsonError(status: number, code: string): Response {
  return new Response(JSON.stringify({ ok: false, error: code }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
