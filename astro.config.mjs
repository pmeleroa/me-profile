import { defineConfig } from 'astro/config';
import partytown from '@astrojs/partytown';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://pablomeleroalonso.me',
  compressHTML: true,
  redirects: {
    '/gamification/test-memoria.html': '/lab/test-memoria',
    '/skills/jira-tooling': '/skills/atlassian-tooling',
    '/skills/python-ml': '/skills/python',
    '/skills/ml-e-ia-en-google-cloud': '/skills/google-cloud-platform',
  },
  integrations: [
    mdx(),
    partytown({
      config: {
        forward: ['dataLayer.push'],
      },
    }),
  ],
});
