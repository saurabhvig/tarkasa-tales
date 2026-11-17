// Makes a clickable checklist of every Amazon link the website shows, so you can check each store really sells each book.
// Run:  npm run amazon-links   → then open amazon-links.html (in the project folder) in your browser.
// If a store shows "page not found" or a different book, add `amazonStores: [com, couk, de, nl, ...]` to that book's file
// listing only the stores that work. This file is not part of the website.
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';

const cfg = readFileSync('src/site.config.ts', 'utf8');
const stores = [...cfg.matchAll(/\{ key: '(\w+)', label: '([^']+)', region: '([^']+)', host: '([^']+)', main: \w+, kindleOnly: (\w+) \}/g)]
  .map(([, key, label, region, host, kindleOnly]) => ({ key, label, region, host, kindleOnly: kindleOnly === 'true' }));

const field = (s, name) => (s.match(new RegExp(`^${name}:\\s*"?([^"#\\n]+?)"?\\s*(#.*)?$`, 'm')) || [])[1];
const rows = [];
for (const f of readdirSync('src/content/books').filter((f) => f.endsWith('.md'))) {
  const s = readFileSync(`src/content/books/${f}`, 'utf8');
  if (field(s, 'status') !== 'published') continue;
  const title = field(s, 'title'), asin = field(s, 'asin'), kindle = field(s, 'kindleAsin');
  const only = (s.match(/^amazonStores:\s*\[([^\]]*)\]/m) || [])[1]?.split(',').map((x) => x.trim());
  for (const st of stores) {
    if (only && !only.includes(st.key)) continue;
    const id = st.kindleOnly ? kindle : asin;
    if (id) rows.push({ title, store: `${st.region} (${st.label})`, url: `https://www.${st.host}/dp/${id}` });
  }
}
const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
writeFileSync('amazon-links.html', `<!doctype html><meta charset="utf-8"><title>Amazon link check</title>
<style>body{font-family:system-ui;margin:2rem}td,th{padding:.35rem .7rem;border-bottom:1px solid #ddd;text-align:left}</style>
<h1>Amazon link check (${rows.length} links)</h1><p>Open each link. Tick it if the right book is for sale there.</p>
<table><tr><th>OK?</th><th>Book</th><th>Store</th><th>Link</th></tr>
${rows.map((r) => `<tr><td><input type="checkbox"></td><td>${esc(r.title)}</td><td>${esc(r.store)}</td><td><a href="${r.url}" target="_blank" rel="noopener">${r.url}</a></td></tr>`).join('\n')}
</table>`);
console.log(`Wrote amazon-links.html with ${rows.length} links for ${new Set(rows.map((r) => r.title)).size} books.`);
