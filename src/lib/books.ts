import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { AMAZON_STORES } from '../site.config';

export type Book = CollectionEntry<'books'>;
export type Series = CollectionEntry<'series'>;

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
export const seriesUrl = (s: Series | string) => `/series/${typeof s === 'string' ? s : s.id}/`;

export function amazonLinks(b: Book) {
  return AMAZON_STORES.map((s) => ({ ...s, url: b.data.amazon[s.key] })).filter((s) => !!s.url) as Array<
    (typeof AMAZON_STORES)[number] & { url: string }
  >;
}

/** A coming-soon book may only show Amazon buttons when a real preorder page exists. */
export const canBuy = (b: Book) =>
  (b.data.status === 'published' || b.data.preorder) && amazonLinks(b).length > 0;

export const formatDate = (d?: Date) =>
  d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : undefined;

export const coverAlt = (b: Book) => b.data.coverAlt ?? `Front cover of ${b.data.title}`;
