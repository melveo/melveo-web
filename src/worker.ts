/**
 * melveo-web Worker entry — currently a pure pass-through to the
 * static-assets binding.
 *
 * History: this file previously hosted POST /api/lead, a Resend-
 * backed inbox endpoint used by App Store "notify me" and Pilot
 * inquiry forms. Both forms were retired 2026-05-18 (audit cleanup
 * — the on-page lead UI was 582 lines of unrendered code; users
 * reach out via the `hello@melveo.app` mailto: link instead).
 * The handler, helpers and KV rate-limit plumbing were removed at
 * the same time to drop the maintenance + abuse surface.
 *
 * The Worker stays in place (vs. switching to pure Static Assets)
 * so a future API route can land here without re-wiring wrangler.
 * To add one, restore the `if (url.pathname === '/api/...')` branch
 * inside fetch().
 *
 * Static assets:
 *   env.ASSETS.fetch(request) hands off to the binding declared in
 *   wrangler.toml ([assets] block). All HTML / CSS / JS / images /
 *   the _headers + _redirects rules ship from there.
 */

interface Env {
  ASSETS: { fetch: (req: Request) => Promise<Response> };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // No API routes currently; everything proxies through to static
    // assets. Future endpoints land here (see header comment).
    return env.ASSETS.fetch(request);
  },
};
