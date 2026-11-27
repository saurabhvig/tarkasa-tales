// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync } from 'node:fs';

// The live web address. Change this only if the domain changes.
const SITE_URL = 'https://tarkasatales.com';

// Book files marked `example: true` are placeholders: keep them out of the sitemap.
const exampleBookPaths = readdirSync('./src/content/books')
  .filter((f) => f.endsWith('.md'))
  .filter((f) => /^example:\s*true\s*$/m.test(readFileSync(`./src/content/books/${f}`, 'utf8')))
  .map((f) => `/books/${f.replace(/\.md$/, '')}/`);

// Until the first real review is added, the Reviews page is kept out of search results and the sitemap
// (a page with only a form is "thin" for search engines). It appears automatically once a review exists.
const hasReviews = (() => { try { return readdirSync('./src/content/testimonials').some((f) => f.endsWith('.md')); } catch { return false; } })();

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !exampleBookPaths.some((p) => page.endsWith(p)) && !page.includes('/404') && !page.includes('/thanks/') && !page.includes('/confirmed/') && (hasReviews || !page.endsWith('/reviews/')),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
