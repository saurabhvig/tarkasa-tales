# Little Body Explorers (prepared, hidden)

This folder is not part of the website build. Nothing here appears on tarkasatales.com.

## What is ready

| Piece | File | Now |
|---|---|---|
| Collection | `src/content/collections/little-body-explorers.md` | `status: hidden`: not in menus, footer, homepage, collections page, sitemap or search |
| Series | `src/content/series/body-explorers.md` | Ready; shows nowhere until a book uses it |
| Topic | `human-biology` in `src/data/topics.yaml` | `status: planned`: no filter option and no topic page |

## Working titles (not public)

1. The Tiny Heroes Inside You (immune system)
2. Ruby's Amazing Journey (blood and circulation)
3. The Invisible Friends in Your Tummy (gut microbiome)
4. The Secret Code Inside You (DNA and genetics)

## When the first book is ready

1. Collection file: change `status: hidden` to `coming-soon` (teaser card on the homepage and collections page) or straight to `active` (own collection page).
2. Add the book file in `src/content/books/` with `series: body-explorers`, `status: coming-soon` or `published`, and `topics: [human-biology]`.
3. `src/data/topics.yaml`: change `human-biology` to `status: active`. A topic page appears automatically once **two** published books have the topic; with one book it is a filter option only.
4. For DNA books, also activate `genetics-dna` the same way.
5. Add `heroImage`, `benefits` and `seoTitle`/`seoDescription` to the collection file before making it `active`.
