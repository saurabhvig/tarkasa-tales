# Tarkasa Tales website: owner's guide

This guide covers everything you need to run the website without programming knowledge. Most updates involve **one text file and one image**, uploaded through the GitHub website. Cloudflare (Workers & Pages) then rebuilds and publishes the site automatically, usually within 1–2 minutes.

---

## Where things live

| What | Folder or file |
|---|---|
| Book details (one file per book) | `src/content/books/` |
| Book covers | `src/assets/covers/` |
| Inside-the-book sample pictures | `src/assets/samples/` |
| Series descriptions (one file per series) | `src/content/series/` |
| Free activity descriptions | `src/content/activities/` |
| Free activity PDF files | `public/activities/` |
| Contact email, social links, privacy owner name | `src/site.config.ts` |
| Logos (SVG and PNG) | `public/brand/` |

The **file name** of a book becomes its web address. For example, `marie-curie.md` becomes `tarkasatales.com/books/marie-curie/`. Use lowercase letters, numbers and hyphens only.

---

## 1. Add a new book

1. **Upload the cover.** In GitHub, open `src/assets/covers/` → **Add file → Upload files**. Use a JPG or PNG at least 1000 px wide, with a simple file name such as `marie-curie.jpg`. Then click **Commit changes**.
2. **Create the book file.** Open `src/content/books/` and open an existing book file. Copy all of its text. Go back to the folder and choose **Add file → Create new file**. Name it, for example `ada-lovelace.md`, and paste the text.
3. **Fill in the details** between the two `---` lines. Copy them exactly from your KDP listing:

```yaml
title: "Ada Lovelace"
subtitle: "The First Computer Programmer"   # delete the line if there is no subtitle
series: big-questions                       # or: big-feelings, timeless-tales
seriesNumber: 2                             # optional: sets the order within the series
author: "Name exactly as on Amazon"
cover: ../../assets/covers/ada-lovelace.jpg
coverAlt: "Cover of Ada Lovelace showing ..."   # describe the cover for blind readers
shortDescription: "One or two sentences for book cards."
ageMin: 4
ageMax: 8
language: English
pageCount: 32
formats: [Paperback, Kindle eBook]          # Paperback, Hardcover, Kindle eBook
isbn: "978-..."                             # optional
asin: "B0XXXXXXXX"                          # 10 characters, from KDP or the Amazon page
status: published                           # published  or  coming-soon
publicationDate: 2026-11-15
featured: true                              # true = shown on the homepage
themes: ["Curiosity", "Mathematics", "Persistence"]
```

4. Below the second `---`, write the **full description**. Leave an empty line between paragraphs.
5. Click **Commit changes**. The site rebuilds automatically.

> **Tip:** Lines that start with `#` are notes. The website ignores them. Delete any optional line you don't need.

**The site checks your work.** If a required field is missing, the build stops and the live site stays as it was. For example, the build fails when:

- a published book has no Amazon link
- an Amazon link isn't really an Amazon address
- a coming-soon book has a buy link without `preorder: true`

To see why it stopped, open Cloudflare → your project → **Deployments** → the failed build. The log names the file and field, for example `amazon: A published book needs at least one Amazon link`.

## 2. Update a description
Open the book's `.md` file → click the **pencil icon** → edit the text → **Commit changes**.

## 3. Replace a cover
Upload the new image to `src/assets/covers/`. Either give it **exactly the same file name**, which replaces the old one, or use a new name and update the `cover:` line in the book file.

## 4. Add or change an Amazon link
Just fill in `asin:` in the book file. The website then creates a Buy link for **every Amazon store** listed in `src/site.config.ts`:
- **Main buttons:** .com, .co.uk, .de, .nl
- **"More Amazon stores" list:** .in, .fr, .es, .it, .ie, .com.be, .pl, .se, .ca, .com.au, .co.jp

The ASIN is the 10-character code after `/dp/` in the Amazon address.

**Kindle editions:** Amazon.in only sells KDP books as Kindle eBooks. Add `kindleAsin: "B0XXXXXXXX"` (the Kindle edition's code) and add `Kindle eBook` to `formats`. The Amazon.in button appears only for books that have a `kindleAsin`. KDP books normally use the same ASIN in every store.

- **Only some stores:** add for example `amazonStores: [com, couk, de, nl]`.
- **A store uses a different link:** add for example `amazon: { in: "https://www.amazon.in/dp/XXXXXXXXXX" }`.
- **Add another Amazon store:** add one line to the list in `src/site.config.ts`.

Always open each new link once to check it shows the right book.

## 5. Change a book from Coming Soon to Published
In the book file:

1. Change `status: coming-soon` to `status: published`.
2. Add the Amazon links.
3. Add `publicationDate:` and, if you like, `featured: true`.

For a real **Amazon preorder**, keep `status: coming-soon`, add `preorder: true` and add the preorder links. A "Preorder on Amazon" box then appears.

You can add `expectedRelease: "Spring 2027"` to a coming-soon book, but only once you're sure of the date.

## 6. Add a new book series
1. In `src/content/series/`, copy `big-questions.md` to a new file, for example `great-inventors.md`.
2. Change `title`, `tagline`, `summary`, `color` and `order`. `color` can be `mint`, `lavender`, `yellow` or `coral`.
3. Write the series introduction below the `---` lines.
4. Commit the file.

The new series automatically gets its own page (`/series/great-inventors/`), a card on the Series page and homepage, and an entry in the catalogue filter. To put books in it, use `series: great-inventors` in each book file.

## 7. Add a free activity
1. Upload the PDF to `public/activities/`, for example `ada-lovelace-colouring.pdf`.
2. In `src/content/activities/`, create a file such as `ada-lovelace-colouring.md`:

```yaml
---
title: "Ada Lovelace colouring sheet"
type: Colouring sheet      # Activity pack, Colouring sheet, Word search, Science activity, Worksheet, Reading activity, Puzzle
description: "Two pages to colour, featuring scenes from the book."
file: /activities/ada-lovelace-colouring.pdf
ageMin: 4
ageMax: 8
relatedBook: ada-lovelace  # optional: the book's file name without .md
---
```

3. Commit. The Free Activities page then lists it with a download button. Only upload activities you created or have the rights to share.

## 8. Update homepage content
- **Featured books:** set `featured: true` in up to four published book files. The hero picture uses the same covers.
- **Coming Soon:** filled automatically from books with `status: coming-soon`.
- **Contact email and social links:** edit `src/site.config.ts`. Fill in `contactEmail` and `privacyController`, your name and town, before launch. These are required for the Privacy Policy under EU GDPR.
- **Larger text changes** to the homepage, About page and others are in `src/pages/`. Ask Claude for help if you're unsure.

## 9. Publish changes
Every **Commit** in GitHub publishes automatically through Cloudflare Pages. Then:

1. Watch the progress in Cloudflare → Workers & Pages → *tarkasa-tales* → **Deployments**.
2. Refresh the website after about 2 minutes. If you still see the old version, press Ctrl+F5 (Windows) or Cmd+Shift+R (Mac).
3. Any branch other than `main` gets its own **preview address**, so you can test before publishing. This is optional.

## 10. Back up and restore
- **The GitHub repository is your backup.** It keeps every version of every file.
- **Extra copy:** on the repository page, click **Code → Download ZIP** about once a month, and store it in your cloud drive.
- **Undo a bad change:** open the file in GitHub → **History** → choose the earlier version → copy its text back in → commit.
- **Instant rollback:** in Cloudflare → **Deployments**, find an earlier working deployment → **⋯ → Rollback to this deployment**.

---

## First-time setup: GitHub + Cloudflare Pages (free)
1. **GitHub:** create a free account at github.com, then click **New repository**. Name it `tarkasa-tales` and choose **Private**. Upload the contents of this project folder. Don't upload the `node_modules`, `dist` or `.astro` folders.
2. **Cloudflare:** create a free account at dash.cloudflare.com. Go to **Workers & Pages → Create → Pages → Connect to Git**, approve GitHub access in GitHub's own window, and pick the repository.
3. **Build settings:**
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variable: `NODE_VERSION` = `22`
4. **Save and Deploy.** You get a free test address such as `tarkasa-tales.pages.dev`. Check it on your phone and computer.
5. **Custom domain:** in the Pages project, go to **Custom domains → Set up a domain** and enter `tarkasatales.com`, then add `www.tarkasatales.com` as well. If you buy the domain through Cloudflare Registrar, DNS and HTTPS are configured automatically. Otherwise, Cloudflare shows the DNS records to add at your registrar.
6. HTTPS certificates are issued automatically and are free. The `public/_headers` file adds security headers.

## Running the site on your own computer (optional)
Install Node.js 22 from nodejs.org, then open a terminal in this folder:
```
npm install
npm run dev      # live preview at http://localhost:4321
npm run build    # production build into the dist folder
```

## Ongoing costs
| Item | Cost |
|---|---|
| Cloudflare Pages hosting + SSL | Free |
| GitHub private repository | Free |
| Fonts (self-hosted), Astro, Tailwind | Free, open source |
| `tarkasatales.com` domain | about €10–12 per year at Cloudflare Registrar (at-cost pricing). Check the current price at checkout. |
| Optional `tarkasatales.nl` | about €5–15 per year depending on registrar |
