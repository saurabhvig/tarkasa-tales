# Manual actions: step by step

This folder is not part of the website build. Nothing here appears on tarkasatales.com.

These steps need your own logins, so you do them yourself. Never send me passwords or codes: send only the values marked **"send to Claude"**.

Dashboards change their wording now and then. If a button has a slightly different name, look for the closest match.

**Order:** do A (the build log) any time. Do B and C (Google and Bing) right after Phase 6 is live. Do D (Brevo) before the first email. Do E (Amazon Attribution) whenever you like.

**DNS changes:** Brevo needs new DNS records in Cloudflare. Google needs one too, if you use the TXT method. These records don't change the website or your email forwarding. You add them only when you decide to.

---

## A. Cloudflare build log (for the branch-preview problem)

1. Go to **dash.cloudflare.com** and sign in.
2. Left menu: **Compute (Workers)** → **Workers & Pages**. In older layouts it's just **Workers & Pages**.
3. Click **tarkasa-tales**.
4. Click the **Deployments** tab. At the bottom, click **View build history**.
5. Click a build whose **Branch** is *not* `main` and whose status is **Failed**, e.g. `redesign-phase6`.
6. On the Build details page, open every step (Initializing, Cloning, Building, **Deploying**). Copy all the text, or use the download icon if there is one.
7. **Send to Claude:** the full log text.
8. Also send a screenshot of **Settings** → **Build** (the section with "Branch control", "Build command" and "Deploy command"). Include the line **Non-production branch deploy command**.
9. Also send a screenshot of **Settings** → **Domains & Routes**, showing whether **Preview URLs** is enabled.

Builds are kept for 90 days. If the old failed ones are gone, push any small change to a branch and copy that log.

---

## B. Google Search Console

**Exact values:**
- Property type: **Domain**
- Domain: `tarkasatales.com` (no https://, no www)
- Sitemap to submit: `sitemap-index.xml`, which becomes `https://tarkasatales.com/sitemap-index.xml`

**Steps:**
1. Go to **search.google.com/search-console** and sign in with the Google account you want to use for the business.
2. Top left, open the property menu → **Add property**.
3. Choose **Domain** (left box). Type `tarkasatales.com` → **Continue**.
4. Google shows a TXT record starting with `google-site-verification=`.
   - **If Google offers a Cloudflare button** ("Start verification" / "Verify with Cloudflare"), you can use it. Sign in to Cloudflare in the pop-up and approve adding one TXT record.
   - **Otherwise, do it by hand:**
     1. Click **Copy** in Google.
     2. In a new tab: Cloudflare → select **tarkasatales.com** → **DNS** → **Records** → **Add record**.
     3. **Type:** `TXT` · **Name:** `@` · **Content:** paste the `google-site-verification=…` value · **TTL:** Auto. Click **Save**.
5. Back in Google, click **Verify**. If it says "not found", wait 10 minutes and click Verify again.
6. Left menu → **Sitemaps** → under "Add a new sitemap", type `sitemap-index.xml` → **Submit**. Status should say **Success**.
7. Left menu → **URL inspection** → paste `https://tarkasatales.com/` → **Request indexing**. Repeat for these four:
   - `https://tarkasatales.com/books/`
   - `https://tarkasatales.com/activities/`
   - `https://tarkasatales.com/books/marie-curie/`
   - `https://tarkasatales.com/editions/women-who-asked-big-questions/`

   Google allows about 10 requests a day.
8. **Send to Claude:** a screenshot of the Sitemaps page after a few days.

---

## C. Bing Webmaster Tools (also powers DuckDuckGo and Ecosia results)

1. Go to **bing.com/webmasters** → **Sign in**. A Microsoft, Google or Facebook account works; Google is easiest.
2. On "Add your site", choose **Import your sites from GSC** → **Import** → allow access to Google Search Console.
3. Tick **tarkasatales.com** → **Import**. The site is verified, and its sitemap is imported too.
4. Check: left menu → **Sitemaps**. It should list `https://tarkasatales.com/sitemap-index.xml`. If not: **Submit sitemap** → paste that address.
5. Optional: left menu → **URL Submission** → paste the same five addresses as in Google step 7.

---

## D. Brevo: send from hello@tarkasatales.com (domain authentication)

This lets your emails arrive in inboxes instead of spam, and lets readers reply to you.

**Exact values:**
- Domain: `tarkasatales.com`
- Sender name: `Tarkasa Tales`
- Sender email and reply-to: `hello@tarkasatales.com` (your existing Cloudflare email forwarding receives the replies)

**Steps in Brevo:**
1. Sign in to **app.brevo.com**. Top right: your account name → **Senders, Domains & Dedicated IPs** (also reachable via **Settings**).
2. Tab **Domains** → **Add a domain** → type `tarkasatales.com` → **Add a domain**.
3. Choose **Authenticate the domain yourself**. This keeps you in control of what changes in Cloudflare.
4. Brevo shows three or four records, each with a **Copy** button: **Brevo code** (TXT), **DKIM 1** and **DKIM 2** (CNAME; or one DKIM TXT), and **DMARC** (TXT). Keep this tab open.

**Steps in Cloudflare (new tab):**

5. Cloudflare → **tarkasatales.com** → **DNS** → **Records**. Look at what exists first: search for `_dmarc`.
6. Click **Add record** once for each Brevo record:

   | Brevo row | Type | Name | Content | Proxy status |
   |---|---|---|---|---|
   | Brevo code | TXT | `@` | the `brevo-code:…` value from Brevo | (none for TXT) |
   | DKIM 1 | CNAME | the name Brevo shows (e.g. `brevo1._domainkey`) | the value Brevo shows | **DNS only (grey cloud)**. Important! |
   | DKIM 2 | CNAME | e.g. `brevo2._domainkey` | the value Brevo shows | **DNS only (grey cloud)** |
   | DMARC (only if `_dmarc` doesn't exist yet) | TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` | — |

   - In Cloudflare, type only the first part of the name (e.g. `brevo1._domainkey`). Cloudflare adds `.tarkasatales.com` itself.
   - If a `_dmarc` record already exists, **don't add a second one**. Send me its content instead.
   - **Don't change** the existing MX records or the SPF record (`v=spf1 include:_spf.mx.cloudflare.net ~all`). They run your email forwarding, and Brevo doesn't need them changed.
7. Back in Brevo, click **Authenticate this email domain**. It can take from a few minutes up to 48 hours. Repeat the check later if needed.

**Sender:**

8. Brevo → **Senders** tab → **Add a sender**: name `Tarkasa Tales`, email `hello@tarkasatales.com` → confirm with the code Brevo emails you. It arrives in your forwarded inbox.

**Templates (no sending):**

9. **Campaigns** → **Templates** → **Create template** → **Code your own** → paste `emails/out/learning-club-template.html` → name it `Learning Club – monthly` → **Save**.
10. **Automations** → **Create an automation** → **Welcome message**. Set:
    - **Trigger:** contact added to the Learning Club list, after double opt-in
    - **Email:** **Code your own** → paste `emails/out/welcome.html`
    - **Subject:** `Welcome to the Learning Club 🌟 your first free printables`
    - **Sender:** Tarkasa Tales <hello@tarkasatales.com>

    **Leave the automation switched OFF.** Turn it on only after your final approval.
11. **Test:** open the template → **Preview & Test** → **Send a test** to your own address. Check that the name, pictures, buttons and **Unsubscribe** link work on your phone and computer. Pictures show only once Phase 6 is live.
12. **Double opt-in check:** Contacts → Forms → your Learning Club form → **Settings**. Check these three things:
    - double opt-in is **on**
    - the redirect after confirmation is `https://tarkasatales.com/confirmed/`
    - the redirect after signup is `https://tarkasatales.com/thanks/` (if Brevo asks for one)

**Send to Claude:** a screenshot of the Domains page showing "Authenticated", and of the form settings from step 12.

---

## E. Amazon Attribution (check eligibility, then make tag links)

**Where it works:** Amazon.com (US), .ca, .co.uk, .de, .fr, .it, .es. **Not** for Amazon.nl or Amazon.in. Those keep their normal links automatically.

**1. Check that you can use it**

1. Sign in to **kdp.amazon.com** → **Bookshelf** → next to any published book, the **…** menu → **Promote and Advertise**.
2. Under "Run an Ad Campaign", choose a marketplace, e.g. **Amazon.com** → **Create an ad campaign**. This opens the **Amazon Ads** console (advertising.amazon.com) for that country.
3. In the Ads console, open the left menu (☰) → look for **Measurement & reporting** → **Amazon Attribution**. It may also appear under "Measurement" or "Reports".
   - **If you see it,** you're eligible in that country. Note which countries show it: each country (US, UK, DE…) has its own console, so switch country at the top.
   - **If not,** stop here. The website keeps working with normal links and Umami clicks.

**2. Create tag links (per country where it works)**

4. In Amazon Attribution → **Create** (or "New order/campaign").
5. **Exact values:**
   - **Campaign name:** `Tarkasa website` (repeat later for `Tarkasa Instagram` and `Tarkasa newsletter` if you want those too)
   - **Products:** add your published books by ASIN (the codes on your KDP Bookshelf)
   - **Publisher / channel:** choose the closest option to "Other / Referral", and name it `tarkasatales.com`
   - **Ad group / tag name:** the book's name, e.g. `Marie Curie`
6. **Create**, then **Export tags** / **Download** (usually a CSV file).
7. **Send to Claude:** the CSV (or the tag links). Tell me which country each belongs to. Each link looks like `https://www.amazon.com/dp/B0…?maas=maas_adg_…&ref_=aa_maas`.

**What I then do:** add them to each book under `attribution:`. The website refuses links that don't contain `maas=` or the right ASIN. All other stores keep their normal link. Results show in the Attribution dashboard after about a day (detail-page views, add-to-carts and purchases credited to the tag) and in Umami as `attribution: tagged`.

---

## F. Cloudflare Web Analytics (optional, page speed)

1. Cloudflare → left menu **Analytics & Logs** → **Web Analytics** → **Add a site**.
2. Hostname: `tarkasatales.com` → **Done**.
3. On the setup screen choose **JS snippet installation**. This is the manual option and keeps preview copies out of your statistics.
4. **Send to Claude:** only the token: the value after `"token":` in the snippet. It's 32 letters and numbers and isn't secret; it appears in the page source anyway.
5. Don't choose "automatic setup". It would also count the preview copies.
