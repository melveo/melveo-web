// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

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
