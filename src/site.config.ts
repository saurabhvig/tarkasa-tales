/**
 * SITE SETTINGS — the one place for brand-wide details.
 * Edit the values between quotes, save, and publish.
 */
export const SITE = {
  name: 'Tarkasa Tales',
  tagline: 'Little Questions. Big Discoveries.',
  url: 'https://tarkasatales.com',
  description:
    'Tarkasa Tales publishes beautifully illustrated children’s books for ages 4–8 about inspiring scientists, timeless stories and wonderful discoveries.',

  /** Public contact email. Leave empty ('') until the mailbox exists — the site then hides email links. */
  contactEmail: 'hello@tarkasatales.com',

  /**
   * Who is responsible for this website (required in the Privacy Policy under EU GDPR).
   * Fill in before launch, e.g. 'Saurabh [Surname], Capelle aan den IJssel, the Netherlands'.
   */
  privacyController: 'Saurabh Vig, the Netherlands',

  /** Social media profile links. Leave empty ('') to hide. */
  social: {
    instagram: '',
    pinterest: '',
    facebook: '',
    youtube: '',
  },

  /** The date the Privacy Policy was last updated. */
  privacyUpdated: '2026-10-27',
};

/**
 * Amazon stores we link to, in the order buttons appear.
 * `main: true` stores are shown as big buttons; the rest appear under "More Amazon stores".
 * A book with an `asin` gets a link to every store below automatically
 * (unless its file lists `amazonStores` to limit them).
 */
export const AMAZON_STORES = [
  { key: 'com', label: 'Amazon.com', region: 'United States', host: 'amazon.com', main: true, kindleOnly: false },
  { key: 'couk', label: 'Amazon.co.uk', region: 'United Kingdom', host: 'amazon.co.uk', main: true, kindleOnly: false },
  { key: 'de', label: 'Amazon.de', region: 'Germany', host: 'amazon.de', main: true, kindleOnly: false },
  { key: 'nl', label: 'Amazon.nl', region: 'Netherlands', host: 'amazon.nl', main: true, kindleOnly: false },
  // Amazon.in sells KDP books as Kindle eBooks only, so it uses the book's kindleAsin.
  { key: 'in', label: 'Amazon.in', region: 'India · Kindle', host: 'amazon.in', main: false, kindleOnly: true },
  { key: 'fr', label: 'Amazon.fr', region: 'France', host: 'amazon.fr', main: false, kindleOnly: false },
  { key: 'es', label: 'Amazon.es', region: 'Spain', host: 'amazon.es', main: false, kindleOnly: false },
  { key: 'it', label: 'Amazon.it', region: 'Italy', host: 'amazon.it', main: false, kindleOnly: false },
  { key: 'ie', label: 'Amazon.ie', region: 'Ireland', host: 'amazon.ie', main: false, kindleOnly: false },
  { key: 'be', label: 'Amazon.com.be', region: 'Belgium', host: 'amazon.com.be', main: false, kindleOnly: false },
  { key: 'pl', label: 'Amazon.pl', region: 'Poland', host: 'amazon.pl', main: false, kindleOnly: false },
  { key: 'se', label: 'Amazon.se', region: 'Sweden', host: 'amazon.se', main: false, kindleOnly: false },
  { key: 'ca', label: 'Amazon.ca', region: 'Canada', host: 'amazon.ca', main: false, kindleOnly: false },
  { key: 'au', label: 'Amazon.com.au', region: 'Australia', host: 'amazon.com.au', main: false, kindleOnly: false },
  { key: 'jp', label: 'Amazon.co.jp', region: 'Japan', host: 'amazon.co.jp', main: false, kindleOnly: false },
] as const;

export type AmazonStoreKey = (typeof AMAZON_STORES)[number]['key'];
