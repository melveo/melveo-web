// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/*
  Output: `static` (implicit). Astro pre-renders every route to HTML
  + CSS + JS bundles in dist/, which Cloudflare Workers Static
  Assets serves directly via the binding declared in wrangler.toml.
  No Astro SSR adapter is configured — the minimal Worker entry
  (src/worker.ts) is currently a pass-through; future API routes
  would land there alongside the static-asset binding, NOT through
  Astro's SSR pipeline. (Audit 2026-05-18.)
*/
// https://astro.build/config
export default defineConfig({
  site: 'https://melveo.app',
  i18n: {
    defaultLocale: 'cs',
    locales: ['cs', 'en'],
    routing: {
      // /cs/ is canonical for Czech, /en/ for English. Root / is a
      // client-side redirect that reads navigator.language.
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    react(),
    sitemap({
      i18n: {
        defaultLocale: 'cs',
        locales: { cs: 'cs-CZ', en: 'en-US' },
      },
    }),
  ],
  // Disable the floating Astro dev toolbar — its `dev-bar-hitbox-above`
  // div was showing in dev screenshots and the user wants it gone (the
  // toolbar is dev-only and never ships to prod, but we'd rather have
  // a clean dev preview too).
  devToolbar: { enabled: false },
  // Astro prefetch — warm up next-page assets on link hover so
  // navigation to Privacy / Terms / locale-switch lands instantly.
  // `hover` strategy: prefetch starts on mouseenter (zero cost
  // unless the user actually targets the link). Opt out per-link
  // with `data-astro-prefetch="false"`. (Audit 2026-05-18.)
  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'hover',
  },
  vite: {
    plugins: [/** @type {any} */ (tailwindcss())],
    server: {
      watch: {
        ignored: [
          '**/.playwright-cli/**',
          '**/.playwright-mcp/**',
          '**/output/playwright/**',
          '**/melveo-*.png',
        ],
      },
    },
  },
  build: {
    assets: 'assets',
  },
});
