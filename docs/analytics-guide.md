# Analytics and conversion tracking guide

This folder is not part of the website build. Nothing here appears on tarkasatales.com.

Everything below uses tools you already have: **Umami Cloud** (visits and clicks), **Cloudflare Web Analytics** (page speed, optional), **Google Search Console / Bing Webmaster Tools** (search), **Brevo** (email) and, if eligible, **Amazon Attribution** (sales from your own links). None of them costs extra at your size.

## The one rule: a click is not a sale

| What you see | What it really means |
|---|---|
| `amazon-click` in Umami | Someone **opened an Amazon store page** from our site. They may or may not have bought. |
| KDP Reports (royalties, units) | **Actual sales**, but with no information about where buyers came from. |
| Amazon Attribution (if enabled) | Sales and page views on Amazon that **Amazon itself links to one of our tagged links**, within 14 days. Only for supported stores. |

Never report clicks as sales. Compare clicks and KDP sales over the same weeks to spot trends, and use Attribution numbers only where Amazon reports them.

## 1. Umami (cloud.umami.is → Websites → tarkasatales.com)

- **Overview:** visitors, page views, top pages, where visitors came from (referrers), countries, devices.
- **Events** (left menu → Events): click any event name, then **Properties** to split it by the details below.

| Event | When it is counted | Details you can split by |
|---|---|---|
| `amazon-click` | A store link in "Buy on Amazon" is clicked | `book`, `store` (com, couk, de, nl, in…), `format` (paperback / kindle), `collection`, `placement` (book-page…), `attribution` (tagged / none) |
| `buy-bar-open` | The phone "Buy" bar is tapped | `book` |
| `amazon-review-click` | A "Write a review" store link is clicked | `book`, `store`, `collection` |
| `download` | A free printable PDF is downloaded | `file`, `book`, `collection`, `type`, `placement` (resources, book-page, learning-club, gifts) |
| `signup-submit` | The Learning Club form's button is pressed | `source` (which page) |
| `club-signup-sent` | The form was accepted by Brevo and the "check your email" page opened | none |
| `club-signup-confirmed` | Someone clicked the confirmation link in the Brevo email | none |

**Learning Club funnel:** `signup-submit` → `club-signup-sent` → `club-signup-confirmed`. The confirmed number is your real new members; Brevo's contact list is the final source of truth.

**Campaigns:** Umami → **UTM** report shows visits by `utm_source`, `utm_medium` and `utm_campaign` from the links in `docs/utm-links.md`.

Visitors with "Do Not Track" switched on are not counted, so all numbers are a little lower than reality.

## 2. Cloudflare Web Analytics (page speed, optional)

Switch on: Cloudflare → Analytics & Logs → Web Analytics → Add a site → `tarkasatales.com` → **JS snippet**. Copy only the token and paste it into `cloudflareBeaconToken` in `src/site.config.ts`. The privacy policy updates itself.

Read it: Web Analytics → tarkasatales.com → **Core Web Vitals**. Green "Good" for LCP (main picture appears), INP (page responds to taps) and CLS (page doesn't jump) is the goal. Use Umami, not Cloudflare, for visit counts.

## 3. Google Search Console and Bing Webmaster Tools

- **Google:** search.google.com/search-console → Add property → **Domain** → `tarkasatales.com` → it shows a TXT record. In Cloudflare → DNS → Add record → TXT → name `@` → paste the value → Save → back in Google press Verify. Then **Sitemaps** → submit `https://tarkasatales.com/sitemap-index.xml`.
- **Bing:** bing.com/webmasters → **Import from Google Search Console** (one click once Google is verified).
- Where to look: **Performance** (searches that showed your site, clicks, average position), **Pages** (which pages are indexed and why others aren't), **Enhancements** (breadcrumbs and other structured data checks).
- Alternative to DNS: paste the HTML-tag codes into `verification` in `src/site.config.ts`.

## 4. Brevo (email)

Campaigns → a sent campaign → **Report**: delivered, opens (approximate, Apple Mail inflates them), clicks per link, unsubscribes. Contacts → your Learning Club list shows confirmed members. Links in each newsletter carry UTM tags, so Umami shows what those visitors did on the site.

## 5. Amazon Attribution (check eligibility first)

What is known (Nov 2026): Amazon Attribution is free and available to **KDP authors through the Amazon Ads console**, for these stores only: **United States, Canada, United Kingdom, Germany, France, Italy, Spain**. It is **not** available for Amazon.nl or Amazon.in.

To check and set up (you, signed in):
1. KDP → Bookshelf → a book → **Promote and Advertise** → opens Amazon Ads. Or go to advertising.amazon.com and sign in with your KDP account.
2. In the Ads console look for **Measurement & Reporting → Amazon Attribution**. If it is there, you are eligible. If not, nothing to do; Umami clicks remain your guide.
3. Create one campaign per channel (Website, Instagram, Newsletter) and add the books. Amazon gives a tag link per book.
4. Send me the website tag links per book and store. They go in the book file under `attribution:` (only com, ca, couk, de, fr, it, es are accepted), e.g. `attribution: { com: "…", couk: "…", de: "…" }`. All other stores (Amazon.nl, Amazon.in, …) keep their normal links. The build refuses a tag link without `maas=` or with another book's ASIN. The site marks tagged clicks `attribution: tagged` in Umami.
5. Results appear in Attribution after about a day: detail page views, add-to-carts and purchases that Amazon credits to each tag.

## Monthly 10-minute check

1. Umami: top 5 pages, `amazon-click` by book and store, `download` by file, `club-signup-confirmed` total.
2. KDP Reports: units sold per book in the same month.
3. Search Console: top search terms and any page errors.
4. Brevo: last newsletter's clicks and unsubscribes.
5. Write three lines: what grew, what dropped, one thing to try next month.
