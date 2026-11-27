import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { AMAZON_STORES } from '../site.config';

export type Book = CollectionEntry<'books'>;
export type Series = CollectionEntry<'series'>;
export type Collection = CollectionEntry<'collections'>;
export type Edition = CollectionEntry<'editions'>;

/** Colour classes for each series colour name. Text is always deep plum for AA contrast. */
export const SERIES_COLORS = {
  mint: { panel: 'bg-mint', soft: 'bg-mint-soft', border: 'border-mint', hex: '#80C9C3' },
  lavender: { panel: 'bg-lavender', soft: 'bg-lavender-soft', border: 'border-lavender', hex: '#B6A5E3' },
  yellow: { panel: 'bg-yellow', soft: 'bg-yellow-soft', border: 'border-yellow', hex: '#F6BD60' },
  coral: { panel: 'bg-coral', soft: 'bg-coral-soft', border: 'border-coral', hex: '#F39A9D' },
} as const;

export async function getAllSeries(): Promise<Series[]> {
  return (await getCollection('series')).sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}

const sortBooks = (a: Book, b: Book) =>
  (a.data.seriesNumber ?? 999) - (b.data.seriesNumber ?? 999) ||
  (b.data.publicationDate?.getTime() ?? 0) - (a.data.publicationDate?.getTime() ?? 0) ||
  a.data.title.localeCompare(b.data.title);

export async function getAllBooks(): Promise<Book[]> {
  return (await getCollection('books')).sort(sortBooks);
}
export const getPublished = async () => (await getAllBooks()).filter((b) => b.data.status === 'published');
export const getComingSoon = async () => (await getAllBooks()).filter((b) => b.data.status === 'coming-soon');
export const getFeatured = async () => (await getPublished()).filter((b) => b.data.featured);
export const getBooksInSeries = async (seriesId: string) =>
  (await getAllBooks()).filter((b) => b.data.series.id === seriesId);

export async function seriesOf(book: Book): Promise<Series> {
  const s = await getEntry(book.data.series);
  if (!s) throw new Error(`Book "${book.id}" points to a series that does not exist: "${book.data.series.id}"`);
  return s;
}

export const ageLabel = (b: Book) =>
  b.data.ageMin === b.data.ageMax ? `Age ${b.data.ageMin}` : `Ages ${b.data.ageMin}–${b.data.ageMax}`;

export const bookUrl = (b: Book) => `/books/${b.id}/`;
/** A series has no page of its own: it is a section on its collection's page. */
export const seriesUrl = (s: Series) => `/collections/${s.data.collection.id}/#series-${s.id}`;
export const editionUrl = (e: Edition) => `/editions/${e.id}/`;
export const collectionUrl = (c: Collection | string) => `/collections/${typeof c === 'string' ? c : c.id}/`;

/* ---------- Collections and themed editions ---------- */

/** Every collection shown on the site. Collections with status "hidden" are prepared internally and left out everywhere. */
export async function getAllCollections(): Promise<Collection[]> {
  return (await getCollection('collections', (c) => c.data.status !== 'hidden')).sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}
/** Collections that have their own page (not "coming soon"). */
export const getActiveCollections = async () => (await getAllCollections()).filter((c) => c.data.status === 'active');

export async function getSeriesInCollection(collectionId: string): Promise<Series[]> {
  return (await getAllSeries()).filter((s) => s.data.collection.id === collectionId);
}
export async function getBooksInCollection(collectionId: string): Promise<Book[]> {
  const ids = new Set((await getSeriesInCollection(collectionId)).map((s) => s.id));
  return (await getAllBooks()).filter((b) => ids.has(b.data.series.id));
}
export async function collectionOf(book: Book): Promise<Collection> {
  const s = await seriesOf(book);
  const c = await getEntry(s.data.collection);
  if (!c) throw new Error(`Series "${s.id}" points to a collection that does not exist: "${s.data.collection.id}"`);
  return c;
}
/** Themed editions that may be shown (forthcoming or published), optionally for one collection. */
export async function getVisibleEditions(collectionId?: string): Promise<Edition[]> {
  return (await getCollection('editions'))
    .filter((e) => e.data.status !== 'planned' && (!collectionId || e.data.collection.id === collectionId))
    .sort((a, b) => a.data.order - b.data.order || a.data.title.localeCompare(b.data.title));
}
/** Editions (forthcoming or published) that include this book. */
export async function editionsWithBook(book: Book): Promise<Edition[]> {
  return (await getVisibleEditions()).filter((e) => e.data.includes.some((r) => r.id === book.id));
}

export function amazonLinks(b: Book) {
  const { asin, kindleAsin, amazon, amazonStores } = b.data;
  const custom = amazon as Record<string, string | undefined>;
  return AMAZON_STORES.map((s) => {
    const id = s.kindleOnly ? kindleAsin : asin;
    const allowed = !amazonStores || amazonStores.includes(s.key);
    // Only verified editions are linked: a Kindle-only store (Amazon.in) appears only once the book has a kindleAsin.
    const auto = id && allowed ? `https://www.${s.host}/dp/${id}` : undefined;
    const url = custom[s.key] ?? auto;
    // For statistics: which edition the link opens, and whether it carries an Amazon Attribution tag.
    const format = s.kindleOnly || (b.data.formats.length === 1 && b.data.formats[0] === 'Kindle eBook') ? 'kindle' : 'paperback';
    const tagged = !!url && /[?&]maas=/.test(url);
    return { ...s, url, format, tagged };
  }).filter((s) => !!s.url) as Array<(typeof AMAZON_STORES)[number] & { url: string; format: 'kindle' | 'paperback'; tagged: boolean }>;
}

/**
 * "Write a review" pages on each Amazon store, for published books with an ASIN.
 * Amazon.in uses the Kindle ASIN (it sells our books as Kindle eBooks only).
 */
export function reviewLinks(b: Book) {
  if (b.data.status !== 'published') return [];
  const { asin, kindleAsin, amazonStores } = b.data;
  return AMAZON_STORES.flatMap((s) => {
    const id = s.kindleOnly ? kindleAsin : asin;
    const allowed = !amazonStores || amazonStores.includes(s.key);
    return id && allowed ? [{ ...s, url: `https://www.${s.host}/review/create-review?asin=${id}` }] : [];
  });
}

/** A coming-soon book may only show Amazon buttons when a real preorder page exists. */
export const canBuy = (b: Book) =>
  (b.data.status === 'published' || b.data.preorder) && amazonLinks(b).length > 0;

export const formatDate = (d?: Date) =>
  d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : undefined;

export const coverAlt = (b: Book) => b.data.coverAlt ?? `Front cover of ${b.data.title}`;

/* ---------- Topics (what a book is about) and qualities (what it helps a child grow in) ---------- */

export type Topic = CollectionEntry<'topics'>;
export type Quality = CollectionEntry<'qualities'>;

/** A topic gets its own page once it has at least this many published books (avoids thin, one-book pages). */
export const MIN_BOOKS_FOR_TOPIC_PAGE = 2;

const byOrder = <T extends { data: { order: number; title: string } }>(a: T, b: T) =>
  a.data.order - b.data.order || a.data.title.localeCompare(b.data.title);

/**
 * Active topics that at least one published book has, with their books (published first, then coming soon).
 * Planned topics and topics with no published book are never shown.
 */
export async function getTopicsInUse() {
  const books = await getAllBooks();
  const topics = (await getCollection('topics')).filter((t) => t.data.status === 'active').sort(byOrder);
  return topics
    .map((topic) => {
      const tagged = books.filter((b) => b.data.topics.some((r) => r.id === topic.id));
      const published = tagged.filter((b) => b.data.status === 'published');
      return { topic, books: [...published, ...tagged.filter((b) => b.data.status !== 'published')], published, hasPage: published.length >= MIN_BOOKS_FOR_TOPIC_PAGE };
    })
    .filter((t) => t.published.length > 0);
}

/** Qualities that at least one published book has, with the number of published books. */
export async function getQualitiesInUse() {
  const published = await getPublished();
  return (await getCollection('qualities'))
    .sort(byOrder)
    .map((quality) => ({ quality, count: published.filter((b) => b.data.qualities.some((r) => r.id === quality.id)).length }))
    .filter((q) => q.count > 0);
}

/** Where a topic link goes: its own page if it has one, otherwise the filtered book list. */
export const topicHref = (t: { topic: Topic; hasPage: boolean }) => (t.hasPage ? `/topics/${t.topic.id}/` : `/books/?topic=${t.topic.id}`);

/* ---------- Free resources (printables) ---------- */

export type Activity = CollectionEntry<'activities'>;

/**
 * Every printable with what the filters need: its books, collection, topics and ages.
 * Collection = the explicit `collection`, otherwise that of its main book.
 * Topics = the topics (in use on the site) of its main and extra books.
 * Sorted: new ones first, then by `order`, then by title.
 */
export async function getResources() {
  const [all, books, series, topicsInUse] = await Promise.all([getCollection('activities'), getAllBooks(), getAllSeries(), getTopicsInUse()]);
  const bookById = new Map(books.map((b) => [b.id, b]));
  const collectionOfSeries = new Map(series.map((s) => [s.id, s.data.collection.id]));
  const shownTopics = new Set(topicsInUse.map((t) => t.topic.id));
  return all
    .map((a) => {
      const main = a.data.relatedBook ? bookById.get(a.data.relatedBook.id) : undefined;
      const extra = (a.data.alsoFor ?? []).map((r) => bookById.get(r.id)).filter(Boolean) as Book[];
      const related = [...(main ? [main] : []), ...extra];
      const collectionId = a.data.collection?.id ?? (main ? collectionOfSeries.get(main.data.series.id) : undefined);
      const topicIds = [...new Set(related.flatMap((b) => b.data.topics.map((r) => r.id)))].filter((id) => shownTopics.has(id));
      return { entry: a, main, related, collectionId, topicIds };
    })
    .sort((x, y) => Number(y.entry.data.isNew) - Number(x.entry.data.isNew) || x.entry.data.order - y.entry.data.order || x.entry.data.title.localeCompare(y.entry.data.title));
}
export type Resource = Awaited<ReturnType<typeof getResources>>[number];

/** Printables for one book page: its own first, then ones that also suit it. */
export async function getResourcesForBook(book: Book) {
  const all = await getResources();
  const own = all.filter((r) => r.main?.id === book.id);
  const suits = all.filter((r) => r.main?.id !== book.id && r.related.some((b) => b.id === book.id));
  return { own, suits };
}
