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

## 1. Add a new book (step by step, about 20 minutes)

You only need a web browser. Everything happens on **github.com/saurabhvig/tarkasa-tales** (sign in first). In the examples the new book is *Ada Lovelace*; use your own book's name.

### Step A: Prepare the pictures on your computer

You need **one cover** and, optionally, **up to 6 inside pages**.

| Picture | What it should be | File name |
|---|---|---|
| Cover | The **front cover only**, square, as a JPG at least 1500 × 1500 px (the same square front image you made for the book) | `ada-lovelace.jpg` |
| Inside pages | 3 of your favourite pages from the interior PDF, as JPGs | `ada-lovelace-p5.jpg`, `ada-lovelace-p11.jpg`, … |

**Easy way to make the inside-page pictures (Windows):**
1. Open the interior PDF and zoom so one page fills the screen.
2. Press **Windows + Shift + S**, then drag a box around the page.
3. Click the picture that pops up in the corner, then **Save** (the disk icon). Choose **JPG** and name it, for example, `ada-lovelace-p5.jpg`.

> **File names:** lowercase letters, numbers and hyphens only. No spaces.

### Step B: Upload the pictures

1. On GitHub open **src → assets → covers**.
2. Click **Add file → Upload files**, drag in `ada-lovelace.jpg` and click **Commit changes**.
3. Open **src → assets → samples** and upload the inside pages the same way.

Uploading pictures alone changes nothing on the website yet. That's safe.

### Step C: Create the book's information file

1. Open **src → content → books** and click an existing book, for example `isaac-newton.md`.
2. Click the **Copy raw file** button (two overlapping squares, top right of the file). This copies the whole file.
3. Go back to **src → content → books**, click **Add file → Create new file**.
4. Name it `ada-lovelace.md`. The name becomes the web address `tarkasatales.com/books/ada-lovelace/`.
5. Paste (**Ctrl + V**) and change the details:

```yaml
title: "Ada Lovelace"
subtitle: "The First Computer Programmer"   # delete the line if there is no subtitle
series: big-questions                       # or: big-feelings, timeless-tales
seriesNumber: 5                             # order within the series
author: "Saurabh Vig"
cover: ../../assets/covers/ada-lovelace.jpg
coverAlt: "Cover of Ada Lovelace showing ..."   # describe the cover for blind readers
shortDescription: "One or two sentences for book cards."   # max about 200 characters
ageMin: 4
ageMax: 8
language: English
pageCount: 24
formats: [Paperback]                        # Paperback, Hardcover, Kindle eBook
status: coming-soon                         # coming-soon  or  published
featured: true                              # true = shown on the homepage when published
themes: ["Curiosity", "Mathematics", "Persistence"]
samples:
  - src: ../../assets/samples/ada-lovelace-p5.jpg
    alt: "Inside page: what the picture shows"
  - src: ../../assets/samples/ada-lovelace-p11.jpg
    alt: "Inside page: what the picture shows"
```

6. Below the second `---` line, replace the old description with your new one (your Amazon/back-cover text works well). Leave an empty line between paragraphs.
7. Click **Commit changes** (green button), then **Commit changes** again in the pop-up.

### Step D: Check the website

Wait **2–3 minutes**, then open **tarkasatales.com/books/ada-lovelace/** (press **Ctrl + F5** to refresh). The book also appears under Coming Soon and in Our Books.

> **Tips**
> - Lines starting with `#` are notes; the website ignores them.
> - Keep the spaces at the start of lines exactly as in the example (two spaces before `- src:`, four before `alt:`).
> - Text with a colon (:) or quotes must be inside "double quotes".

### Step E: When Amazon approves the book

1. Open the book's file (`src/content/books/ada-lovelace.md`) and click the **pencil** (Edit).
2. Add the paperback code (the 10 characters after `/dp/` in the Amazon address):
   `asin: "B0XXXXXXXX"`
3. If there is a Kindle edition, add its code (used for Amazon.in) and update the formats:
   `kindleAsin: "B0XXXXXXXX"` and `formats: [Paperback, Kindle eBook]`
4. Change `status: coming-soon` to `status: published`.
5. Optional: add `isbn: "979..."` and `publicationDate: 2026-12-01`.
6. **Commit changes.** All 15 Amazon store links appear automatically.

### If something goes wrong

**The site checks your work.** If something in the file is wrong, the update is simply not published and the live site stays as it was. Nothing breaks. For example, it stops when:

- a picture's file name in the book file doesn't match the uploaded file exactly
- a published book has no `asin`
- the spaces at the start of the `samples:` lines are wrong

**To see what went wrong:** Cloudflare → **Workers & Pages → tarkasa-tales → Deployments**. Click the failed build (red) and read the last lines of the log. They name the file and the problem. Fix it in GitHub (pencil icon) and commit again. Or send Claude a screenshot of the error.

## 2. Update a description
Open the book's `.md` file → click the **pencil icon** → edit the text → **Commit changes**.

## 3. Replace a cover
Upload the new image to `src/assets/covers/`. Either give it **exactly the same file name**, which replaces the old one, or use a new name and update the `cover:` line in the book file.

## 4. Add or change an Amazon link
Just fill in `asin:` in the book file. The website then creates a Buy link for **every Amazon store** listed in `src/site.config.ts`:
Visitors click one **Buy on Amazon** button and choose their country from the list: .com, .co.uk, .de, .nl, .in (Kindle), .fr, .es, .it, .ie, .com.be, .pl, .se, .ca, .com.au and .co.jp. Their likely store, based on their browser language, is marked "Suggested for you".

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
