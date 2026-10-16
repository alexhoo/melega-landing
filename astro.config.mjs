// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { resolveSiteUrl } from './src/lib/site-url.ts';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: resolveSiteUrl(process.env),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
});