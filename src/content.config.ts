/**
 * BOOK & SERIES DATA RULES
 * This file checks every book and series file when the site is built.
 * If something required is missing or wrong, the build stops with a clear message
 * instead of publishing a broken page. You normally never need to edit this file.
 */
import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { AMAZON_STORES } from './site.config';

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

const series = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/series' }),
  schema: z.object({
    title: z.string(),
    tagline: z.string(),
    summary: z.string().describe('One or two sentences shown on cards'),
    color: z.enum(['mint', 'lavender', 'yellow', 'coral']),
    order: z.number().default(10),
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
        ageMin: z.number().int().min(0).max(18),
        ageMax: z.number().int().min(0).max(18),
        language: z.string().default('English'),
        pageCount: z.number().int().positive().optional(),
        formats: z.preprocess((v) => v ?? [], z.array(z.enum(['Paperback', 'Hardcover', 'Kindle eBook']))),
        isbn: z.string().optional(),
        asin: z.string().regex(/^[A-Z0-9]{10}$/, 'An ASIN is 10 capital letters/numbers').optional(),
        /** ASIN of the Kindle eBook edition (used for Kindle-only stores such as Amazon.in). */
        kindleAsin: z.string().regex(/^[A-Z0-9]{10}$/, 'An ASIN is 10 capital letters/numbers').optional(),
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
        samples: z
          .array(z.object({ src: image(), alt: z.string() }))
          .max(6)
          .default([]),
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
        if (b.status === 'coming-soon' && hasLink && !b.preorder)
          ctx.addIssue({
            code: 'custom',
            path: ['amazon'],
            message: 'Coming-soon books can only have Amazon links if preorder: true',
          });
      }),
});

const activities = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/activities' }),
  schema: z.object({
    title: z.string(),
    type: z.enum(['Colouring sheet', 'Word search', 'Science activity', 'Worksheet', 'Reading activity', 'Puzzle']),
    description: z.string(),
    /** Path of the PDF inside the public/activities folder, e.g. /activities/marie-curie-colouring.pdf */
    file: z.string().startsWith('/activities/').endsWith('.pdf'),
    ageMin: z.number().int().optional(),
    ageMax: z.number().int().optional(),
    relatedBook: reference('books').optional(),
    order: z.number().default(10),
  }),
});

export const collections = { series, books, activities };
