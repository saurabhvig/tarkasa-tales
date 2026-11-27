# Website maintenance guide (after the redesign)

This folder is not part of the website build. Nothing here appears on tarkasatales.com.

This guide adds to `GUIDE.md` (the step-by-step owner's guide). It covers everything the redesign added. Each task is a small edit to one text file on github.com/saurabhvig/tarkasa-tales.

## Golden rules

1. **Small, safe edits on `main`:** an ISBN, an ASIN, a description or a typo. Edit on GitHub, then **Commit changes**. The site checks your work, and publishes in about 2 minutes only if everything is valid. If something is wrong, the live site simply stays as it was.
2. **Bigger changes** (a new collection, many books, new pages): ask Claude to do them on a separate branch with a preview first.
3. File names: lowercase, numbers and hyphens only. The book file name becomes its address (`marie-curie.md` → `/books/marie-curie/`).
4. Text with a colon `:` must be inside "double quotes".

## 1. Add a new book

Follow **GUIDE.md section 1** (pictures, then a copy of an existing book file). The redesign added these fields to the book file:

```yaml
topics: [space-astronomy, women-in-science]   # up to 4, ids from src/data/topics.yaml
qualities: [curiosity, perseverance]           # "Helps with", up to 3, ids from src/data/qualities.yaml
learningOutcomes:                              # only lines you have approved
  science:                                     # "Story and culture" for Timeless Tales
    - "Who … was, and why …"
  growth:
    - "Keep going, even when things are hard."
  activity:                                    # optional "Try it together"
    - "Explore how …"
storyCount: 5                                  # only for books with several stories
seoTitle: "…"                                  # optional; normally made automatically
seoDescription: "…"                            # optional; up to 160 characters
```

- **Topic ids:** women-in-science, space-astronomy, physics-discoveries, maths-computing, inventions-technology, nature-animals, plants-environment, medicine-health. A topic gets its own page automatically once **two** published books use it.
- **Quality ids:** curiosity, perseverance, patience, confidence, imagination, kindness, teamwork, courage, problem-solving, creativity, big-feelings.
- **Series ids:** big-questions (Little Scientists), big-feelings (Bobbin's World), timeless-tales (Timeless Tales), body-explorers (Little Body Explorers, hidden).

## 2. ISBNs, ASINs and Amazon links

In the book's file:

```yaml
isbn: "9798XXXXXXXXX"        # paperback ISBN-13, digits only
asin: "B0XXXXXXXX"           # paperback ASIN → links to every Amazon store automatically
kindleAsin: "B0XXXXXXXX"     # Kindle ASIN → used for Amazon.in (Kindle only)
formats: [Paperback, Kindle eBook]
status: published            # was coming-soon
```

- **Never** type an ASIN or ISBN you haven't seen on your KDP Bookshelf.
- A coming-soon book shows no buy button unless you also add `preorder: true` and a real preorder ASIN.
- **Amazon Attribution tag links** (only US, CA, UK, DE, FR, IT, ES):

  ```yaml
  attribution:
    com: "https://www.amazon.com/dp/B0…?maas=…"
    couk: "https://www.amazon.co.uk/dp/B0…?maas=…"
  ```

  Other stores keep their normal links. The site refuses a tag link without `maas=` or with another book's ASIN.

## 3. Free printables (resources)

1. Upload the PDF to `public/activities/` (A4, file name like `marie-curie-colouring.pdf`).
2. Optional preview picture of page 1: `src/assets/printables/marie-curie-colouring.png` (portrait).
3. Create `src/content/activities/marie-curie-colouring.md`:

```yaml
---
title: "Marie Curie colouring page"
type: Colouring page          # see the list in content.config.ts (Activity sheet, Word search, Reading guide…)
description: "One or two sentences: what it is and what children do. 1 page."
file: /activities/marie-curie-colouring.pdf
ageMin: 4
ageMax: 8
relatedBook: marie-curie       # the main book (shows on its page)
alsoFor: [jane-goodall]        # optional: other books it suits
preview: ../../assets/printables/marie-curie-colouring.png   # optional
isNew: true                    # shows a "New" label; remove after 1–2 months
order: 10
---
```

It appears automatically:

- on Free Resources, with filters for age, collection, topic and type
- on the book page
- in the collection's printable count

Downloads are counted in Umami.

**New branded printables:** the six from Phase 5 are made from HTML in `printables/` (`python3 printables/build.py`). Ask Claude to make new ones the same way, so the branding stays identical.

## 4. Collections, series and editions

- **Collection** (`src/content/collections/*.md`): `status: active` (own page), `coming-soon` (teaser card only) or `hidden` (not shown anywhere). Little Body Explorers is `hidden`; see `docs/little-body-explorers.md`.
- **Themed edition / omnibus** (`src/content/editions/*.md`): `status: planned` (not shown), `forthcoming` (own page under /editions/, no buy button) or `published`. When published, create a normal book file for it with its ASIN, then add `book: <that-file-name>` to the edition. The edition then links to that book page.
- **New topic or quality:** add it to `src/data/topics.yaml` or `qualities.yaml`. Planned topics (`status: planned`) stay hidden until used.

## 5. Learning Club emails

See `emails/README.md`. Each month:

1. Copy the template in Brevo.
2. Fill in the CAPITAL placeholders.
3. Change `utm_campaign` to the month.
4. Send a test to yourself.
5. Schedule it.

Never send without checking the test on your phone.

## 6. Monthly 15-minute housekeeping

- [ ] Remove `isNew: true` from printables older than about 2 months.
- [ ] Add ISBNs and ASINs for books that went live.
- [ ] Export the Brevo contact list (backup).
- [ ] Umami, KDP Reports and Search Console check (`docs/analytics-guide.md`, "Monthly 10-minute check").
- [ ] Glance at Search Console → **Pages** for errors.

## 7. Costs (unchanged)

| Item | Cost |
|---|---|
| Domain (tarkasatales.com) | yearly renewal at Cloudflare, as now |
| Cloudflare hosting, Workers and Email Routing | €0 on the free plan |
| GitHub | €0 |
| Umami Cloud (Hobby) | €0 |
| Brevo (free plan, up to 300 emails a day) | €0 |
| Google Search Console, Bing, Amazon Attribution, Cloudflare Web Analytics | €0 |
