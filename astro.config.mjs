import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://pablomeleroalonso.me',
  compressHTML: true,
  integrations: [
    mdx(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
});
