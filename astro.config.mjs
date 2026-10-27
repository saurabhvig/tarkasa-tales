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

export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'always',
  build: { format: 'directory' },
  integrations: [
    sitemap({
      filter: (page) => !exampleBookPaths.some((p) => page.endsWith(p)) && !page.includes('/404'),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
});
