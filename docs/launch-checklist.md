# Phase 7 launch checklist (production)

This folder is not part of the website build. Nothing here appears on tarkasatales.com.

**Rule:** nothing in this checklist happens without Saurabh's explicit final approval. That covers deploying, DNS changes and sending emails.

## 0. Versions

| Version | Commit | Status |
|---|---|---|
| Live now (Phases 3–5 redesign, deployed 27 Nov 2026) | `32220fc` on `main` | **Rollback point** |
| Phase 6 + Phase 7 preparation | branch `redesign-phase6` | Waiting for approval |

## 1. Before deploying (about 15 minutes)

- [ ] Editorial approval doc signed off: omnibus wording, titles, descriptions, emails, other wording. Any edits applied.
- [ ] The three open questions in that doc are answered: Learning Club title, Ada guide wording, the "four experiments" line.
- [ ] The latest preview checked on phone and computer.
- [ ] Claude has re-run the full test suite on the final branch: links, accessibility, journeys, structured data, preview/live separation.
- [ ] Nothing urgent is planned (e.g. a reel pointing to a page) in the next hour.

## 2. Deploy (Claude does this, after the written "go")

1. Merge `redesign-phase6` into `main` and push.
2. Cloudflare **Workers Builds** builds `main` automatically. Wait for **Success**, about 2 minutes.
3. No DNS changes are part of the deploy. The www redirect is handled inside the website's own script.

## 3. Smoke test straight after deploying (about 15 minutes; Claude in the browser, Saurabh on a phone)

| # | Check | Expected |
|---|---|---|
| 1 | `https://www.tarkasatales.com/books/` | Lands on `https://tarkasatales.com/books/` |
| 2 | Home page | New title in the tab, no preview banner, no "Little Body Explorers" |
| 3 | A book page (Marie Curie) | Buy on Amazon → country list → Amazon.nl opens the right book in a new tab |
| 4 | Phone: a book page, scroll down | Sticky "Buy" bar appears and opens the store list |
| 5 | Free Resources → filter "Little Scientists" + age 5 | List narrows; a PDF downloads; "Join the free Learning Club" line appears |
| 6 | `/editions/women-who-asked-big-questions/` | Page opens; "Forthcoming edition"; no buy button |
| 7 | Learning Club: sign up with your own email | "Almost there" page → Brevo confirmation email → link → "You're in!" page |
| 8 | Unsubscribe from that test (link at the bottom of the Brevo email) | Brevo confirms; contact shows as unsubscribed in Brevo |
| 9 | `https://tarkasatales.com/email/logo.png` | Logo shows (needed by the emails) |
| 10 | `/old-page-that-does-not-exist/` | Friendly 404 page |
| 11 | `/series/big-questions/` | Redirects to Little Scientists |
| 12 | `/robots.txt` | "Allow: /" plus the sitemap line |
| 13 | Google **Rich Results Test** (search.google.com/test/rich-results) on the Marie Curie page and the home page | "Breadcrumbs" valid; no errors |

## 4. Analytics verification (same day)

| Where | What to do | Expected within ~1 minute |
|---|---|---|
| Umami → Realtime | Open 2–3 pages on your phone (with mobile data, not Wi-Fi with "Do Not Track") | Visits appear |
| Umami → Events | Click a store link on a book page | `amazon-click` with `book`, `store`, `format`, `placement` |
| Umami → Events | Download a printable | `download` with `file`, `book`, `placement` |
| Umami → Events | The test signup from step 3.7 | `signup-submit` → `club-signup-sent` → `club-signup-confirmed` |
| Umami → UTM | Open `https://tarkasatales.com/?utm_source=test&utm_medium=check&utm_campaign=launch` | A row for source `test` |
| Cloudflare Web Analytics (only if switched on) | — | Page views and Core Web Vitals after a few hours |

Afterwards, delete the test contact in Brevo so the list contains only real members.

## 5. Search engine indexing plan

| When | Action |
|---|---|
| Launch day | Google Search Console: verify (Domain property), submit `sitemap-index.xml`, request indexing for Home, Books, Free Resources, Marie Curie and the omnibus page (manual-actions.md, B) |
| Launch day | Bing: import from Google; check the sitemap is listed (manual-actions.md, C) |
| Day 2–3 | Request indexing for the remaining published book pages and the three collection pages (about 10 a day) |
| Day 7 | Search Console → **Pages**: every sitemap URL should be "Indexed" or "Discovered". Send Claude any "Excluded" reasons |
| Day 14 | Search Console → **Performance**: first search terms. Search Console → **Enhancements → Breadcrumbs**: no errors |
| Day 30 | Review titles and descriptions for pages with impressions but few clicks; adjust at most 3 |
| Every new book | Request indexing for the new book page the day it's published |

Pages kept out of search on purpose: Reviews (until real reviews exist), Thank-you, Confirmed, 404. Little Body Explorers and planned topics have no pages.

## 6. Email go-live (separate approval)

- [ ] Brevo domain authenticated, sender `hello@tarkasatales.com` confirmed (manual-actions.md, D)
- [ ] Test sends checked on phone and computer; the unsubscribe link works
- [ ] Welcome automation switched **on**
- [ ] December newsletter: audience = Learning Club list only; scheduled for a weekday morning (e.g. Tuesday 9:00 CET)
- [ ] After sending: Brevo report checked after 48 hours (delivered, clicks, unsubscribes, spam complaints = 0)

## 7. Backup and rollback

**What is backed up:**

- **Website code, content, books, PDFs and history:** GitHub (`saurabhvig/tarkasa-tales`). Every version is kept, and nothing is ever lost by deploying.
- **Deployed versions:** Cloudflare keeps the previous versions of the Worker.
- **Learning Club contacts:** they live in Brevo. Monthly: Contacts → your list → **Export** (CSV) → save to your computer.
- **Statistics:** Umami. Optional monthly export.

**If something is wrong after a deploy, there are two ways back:**

1. **Fastest, about 1 minute, no code:** Cloudflare → Workers & Pages → **tarkasa-tales** → **Deployments**. Find the previous version → **⋯** → **Rollback** (or "Deploy this version"). The live site returns to that version immediately.
2. **Permanent, about 3 minutes:** Claude reverts the merge on `main` (back to `32220fc`) and pushes. Cloudflare rebuilds the old version. Use this so the next build doesn't bring the problem back.

**Decide to roll back if** any of these is broken for visitors: book pages, Buy on Amazon links, printable downloads, or the signup form. Smaller issues are fixed forward instead.
