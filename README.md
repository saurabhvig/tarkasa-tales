# Tarkasa Tales website

Static website for Tarkasa Tales (Astro 7 + Tailwind CSS 4), hosted on Cloudflare Pages.

- **Owner's guide:** see [GUIDE.md](GUIDE.md). It covers adding books, publishing, backups and first-time setup.
- **Build:** `npm install` then `npm run build`. The output goes to `dist/`.
- **Cloudflare Pages settings:**
  - Framework preset: Astro
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variable: `NODE_VERSION=22`
