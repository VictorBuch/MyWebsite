// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export const SITE = 'https://victorbuch.com';

export default defineConfig({
  site: SITE,
  integrations: [sitemap()],
  prefetch: { prefetchAll: true, defaultStrategy: 'viewport' },
  build: { inlineStylesheets: 'auto' },
  vite: {
    build: {
      cssCodeSplit: false,
    },
  },
});
