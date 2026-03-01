import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';

export default defineConfig({
  site: 'https://pablomeleroalonso.me',
  base: '/me-profile/',
  compressHTML: true,
  integrations: [
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
});
