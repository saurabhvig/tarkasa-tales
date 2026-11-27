/**
 * BOOK & SERIES DATA RULES
 * This file checks every book and series file when the site is built.
 * If something required is missing or wrong, the build stops with a clear message
 * instead of publishing a broken page. You normally never need to edit this file.
 */
import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import { AMAZON_STORES, ATTRIBUTION_STORES } from './site.config';

const storeKeys = AMAZON_STORES.map((s) => s.key) as [string, ...string[]];

const amazonUrl = (host: string) =>
  z
    .string()
    .url()
    .refine((u) => {
      try {
        const h = new URL(u).hostname.replace(/^www\./, '');
        return h === host;
      } catch {
        return false;
      }
    }, `This link must be a real ${host} address (https://www.${host}/...)`)
    .optional();

/**
 * COLLECTIONS: the top level of the catalogue (Bobbin's World, Little Scientists, …).
 * One file per collection in src/content/collections/. Each series belongs to one collection.
 * A collection with status "coming-soon" has no page yet: it only shows as a small card.
 */
const collectionsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/collections' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      tagline: z.string(),
      summary: z.string().describe('One or two sentences shown on cards'),
      color: z.enum(['mint', 'lavender', 'yellow', 'coral']),
      order: z.number().default(10),
      /** active = has its own page · coming-soon = teaser card only · hidden = prepared internally, not shown anywhere on the site. */
      status: z.enum(['active', 'coming-soon', 'hidden']).default('active'),
      ageMin: z.number().int().default(4),
      ageMax: z.number().int().default(8),
      /** A picture from one of the books for the top of the collection page (optional). */
      heroImage: image().optional(),
      heroAlt: z.string().optional(),
      /** Three to five short points: what children gain from this collection. */
      benefits: z.array(z.string()).max(5).default([]),
      /** Heading used for the printables box on the collection page, e.g. "Free science printables". */
      resourcesTitle: z.string().optional(),
      seoTitle: z.string().max(70).optional(),
      seoDescription: z.string().max(170).optional(),
    }),
});

/**
 * TOPICS (what a book is about) and QUALITIES (what it helps a child grow in).
 * Both are simple lists in src/data/. Books refer to them by id.
 */
const topics = defineCollection({
  loader: file('src/data/topics.yaml'),
  schema: z.object({
    title: z.string(),
    status: z.enum(['active', 'planned']).default('active'),
    order: z.number().default(10),
    description: z.string(),
    /** Opening sentence for the topic page (and its search-engine description). */
    intro: z.string().max(170).optional(),
  }),
});
const qualities = defineCollection({
  loader: file('src/data/qualities.yaml'),
  schema: z.object({
    title: z.string(),
    order: z.number().default(10),
    description: z.string(),
  }),
});

const series = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/series' }),
  schema: z.object({
    title: z.string(),
    /** The collection this series belongs to (a file name in src/content/collections/, without .md). */
    collection: reference('collections'),
    tagline: z.string(),
    summary: z.string().describe('One or two sentences shown on cards'),
    color: z.enum(['mint', 'lavender', 'yellow', 'coral']),
    order: z.number().default(10),
    /** true = the series is announced but has no books yet; shows a Coming Soon label. */
    comingSoon: z.boolean().default(false),
    seoDescription: z.string().max(170).optional(),
  }),
});

const books = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/books' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        subtitle: z.string().optional(),
        series: reference('series'),
        seriesNumber: z.number().optional(),
        author: z.string().describe('Exactly as on the Amazon KDP listing'),
        illustrator: z.string().optional(),
        cover: image(),
        coverAlt: z.string().optional(),
        shortDescription: z.string().max(220),
        /** Optional: title and description for search results, when the defaults are too long. Up to about 65 and 160 characters. */
        seoTitle: z.string().max(70).optional(),
        seoDescription: z.string().max(160).optional(),
        ageMin: z.number().int().min(0).max(18),
        ageMax: z.number().int().min(0).max(18),
        language: z.string().default('English'),
        pageCount: z.number().int().positive().optional(),
        formats: z.preprocess((v) => v ?? [], z.array(z.enum(['Paperback', 'Hardcover', 'Kindle eBook']))),
        isbn: z.string().optional(),
        asin: z.string().regex(/^[A-Z0-9]{10}$/, 'An ASIN is 10 capital letters/numbers').optional(),
        /** ASIN of the Kindle eBook edition (used for Kindle-only stores such as Amazon.in). */
        kindleAsin: z.string().regex(/^[A-Z0-9]{10}$/, 'An ASIN is 10 capital letters/numbers').optional(),
        /**
         * Optional: Amazon Attribution tag links, only for stores where Attribution works (com, ca, couk, de, fr, it, es).
         * Paste the full link Amazon Ads gives you, e.g.  attribution: { com: "https://www.amazon.com/dp/B0…?maas=…" }
         * Other stores keep their normal link. Leave out until your Attribution account is confirmed.
         */
        attribution: z.preprocess(
          (v) => v ?? {},
          z.object(Object.fromEntries(ATTRIBUTION_STORES.map((k) => [k, amazonUrl(AMAZON_STORES.find((st) => st.key === k)!.host)]))).strict(),
        ),
        /** Optional: a different link for a particular store, e.g.  amazon: { in: "https://www.amazon.in/dp/XXXXXXXXXX" } */
        amazon: z.preprocess(
          (v) => v ?? {},
          z.object(Object.fromEntries(AMAZON_STORES.map((st) => [st.key, amazonUrl(st.host)]))).strict(),
        ),
        /** Optional: only link these stores (default: every store in site.config.ts). */
        amazonStores: z.array(z.enum(storeKeys)).optional(),
        status: z.enum(['published', 'coming-soon']),
        /** True only if Amazon has a real preorder page for a coming-soon book. */
        preorder: z.boolean().default(false),
        publicationDate: z.coerce.date().optional(),
        /** For coming-soon books: free text such as "Spring 2027". Only fill in if you are sure. */
        expectedRelease: z.string().optional(),
        featured: z.boolean().default(false),
        themes: z.preprocess((v) => v ?? [], z.array(z.string())),
        /** What the book is about: ids from src/data/topics.yaml, e.g. [space-astronomy, women-in-science]. */
        topics: z.preprocess((v) => v ?? [], z.array(reference('topics')).max(4)),
        /** What the book helps a child grow in: ids from src/data/qualities.yaml, e.g. [perseverance]. Two or three. */
        qualities: z.preprocess((v) => v ?? [], z.array(reference('qualities')).max(3)),
        /** How many separate stories are inside (leave out for a single story). */
        storyCount: z.number().int().min(2).optional(),
        /**
         * "What your child will take away", in two short lists (up to five sentences each):
         * science = facts and ideas about science (for traditional tales: the story and its culture); growth = personal development (curiosity, patience…).
         */
        learningOutcomes: z.preprocess(
          (v) => v ?? {},
          z.object({
            science: z.array(z.string()).max(5).default([]),
            growth: z.array(z.string()).max(5).default([]),
            /** Optional hands-on learning to try together after reading, e.g. a simple experiment. */
            activity: z.array(z.string()).max(3).default([]),
          }).strict(),
        ),
        /**
         * Optional (Big Feelings books): the feelings inside the book, shown as a highlighted section.
         * treasure is one of: acorn, leaf, pebble, bell, daisy (pictures in src/assets/feelings/).
         */
        feelings: z
          .array(z.object({
            feeling: z.string(),
            story: z.string(),
            treasure: z.enum(['acorn', 'leaf', 'pebble', 'bell', 'daisy']),
            treasureName: z.string(),
            tools: z.array(z.string()).max(4),
          }))
          .max(6)
          .default([]),
        samples: z
          .array(z.object({ src: image(), alt: z.string() }))
          .max(6)
          .default([]),
        /** Optional short video (trailer). Put the MP4 and a JPG still with the same name in public/videos/. */
        video: z.string().regex(/^\/videos\/[a-z0-9-]+\.mp4$/, 'video must look like /videos/book-name.mp4').optional(),
        /** One sentence describing the video, for visitors who use screen readers. */
        videoDescription: z.string().optional(),
        /** Placeholder entry used for design only. Shows a visible “Example” label and is hidden from search engines. */
        example: z.boolean().default(false),
      })
      .superRefine((b, ctx) => {
        if (b.ageMin > b.ageMax)
          ctx.addIssue({ code: 'custom', path: ['ageMin'], message: 'ageMin cannot be larger than ageMax' });
        const hasLink = !!b.asin || Object.values(b.amazon).some(Boolean);
        if (b.status === 'published' && !hasLink && !b.example)
          ctx.addIssue({
            code: 'custom',
            path: ['amazon'],
            message: 'A published book needs an asin or at least one Amazon link',
          });
        for (const [k, u] of Object.entries(b.attribution as Record<string, string | undefined>)) {
          if (!u) continue;
          if (!/[?&]maas=/.test(u))
            ctx.addIssue({ code: 'custom', path: ['attribution', k], message: 'An Attribution link must contain "maas=" (copy the full tag link from Amazon Ads)' });
          if (![b.asin, b.kindleAsin].some((id) => id && u.includes(id)))
            ctx.addIssue({ code: 'custom', path: ['attribution', k], message: 'This Attribution link does not contain this book’s ASIN: check it is for the right book' });
        }
        if (b.status === 'coming-soon' && hasLink && !b.preorder)
          ctx.addIssue({
            code: 'custom',
            path: ['amazon'],
            message: 'Coming-soon books can only have Amazon links if preorder: true',
          });
      }),
});

/**
 * THEMED EDITIONS: omnibus books that bring several stories together (e.g. Women Who Asked Big Questions).
 * status: planned = not shown anywhere · forthcoming = shown as a reading list of the included books, no buy button
 * · published = needs `book:` pointing to the edition's own book file (with its ASIN), which gets the Buy button.
 */
const editions = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/editions' }),
  schema: z
    .object({
      title: z.string(),
      subtitle: z.string().optional(),
      collection: reference('collections'),
      summary: z.string(),
      includes: z.array(reference('books')).min(2),
      status: z.enum(['planned', 'forthcoming', 'published']),
      book: reference('books').optional(),
      order: z.number().default(10),
      /** Recommended ages for the whole edition. */
      ageMin: z.number().int().default(4),
      ageMax: z.number().int().default(8),
      /** Optional: description for search results (up to 160 characters). */
      seoDescription: z.string().max(160).optional(),
    })
    .superRefine((e, ctx) => {
      if (e.status === 'published' && !e.book)
        ctx.addIssue({ code: 'custom', path: ['book'], message: 'A published edition needs book: pointing to its own book file' });
    }),
});

const activities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/activities' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    type: z.enum(['Activity pack', 'Activity sheet', 'Calm-down cards', 'Observation journal', 'Maths activity', 'Colouring sheet', 'Colouring page', 'Word search', 'Science activity', 'Science experiment', 'Science fact sheet', 'Feelings worksheet', 'Worksheet', 'Reading activity', 'Reading guide', 'Puzzle', 'Seasonal']),
    description: z.string(),
    /** Path of the PDF inside the public/activities folder, e.g. /activities/marie-curie-colouring.pdf */
    file: z.string().startsWith('/activities/').endsWith('.pdf'),
    ageMin: z.number().int().optional(),
    ageMax: z.number().int().optional(),
    /** The main book this printable goes with (shown on that book's page). */
    relatedBook: reference('books').optional(),
    /** Other books it also suits; it appears on their pages too, as a recommendation. */
    alsoFor: z.array(reference('books')).optional(),
    /** For printables that suit a whole collection rather than one book, e.g. little-scientists. */
    collection: reference('collections').optional(),
    /** A picture of page 1 (src/assets/printables/<name>.png, made by printables/build.py). */
    preview: image().optional(),
    /** Shows a small "New" label. Remove it after a month or two. */
    isNew: z.boolean().default(false),
    order: z.number().default(10),
  }),
});

/**
 * REVIEWS FROM FAMILIES (shown on /reviews/ and on book pages)
 * One file per review in src/content/testimonials/. Only add reviews that a real person sent you
 * and agreed to share. The review form emails you a ready-made file for each one.
 */
const testimonials = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/testimonials' }),
  schema: z.object({
    name: z.string().max(40).describe('First name only, as the person gave it'),
    place: z.string().max(60).optional(),
    role: z.enum(['Parent', 'Grandparent', 'Teacher', 'Librarian', 'Reader']).optional(),
    /** Which book the review is about. Leave out for a review of Tarkasa Tales in general. */
    book: reference('books').optional(),
    rating: z.number().int().min(1).max(5).optional(),
    date: z.coerce.date(),
    quote: z.string().min(5).max(1200),
    /** Must be true: the person ticked "you may share this on the website". */
    permission: z.literal(true, { message: 'Only publish reviews the person agreed to share (permission: true)' }),
  }),
});

export const collections = { collections: collectionsCollection, topics, qualities, series, books, editions, activities, testimonials };
