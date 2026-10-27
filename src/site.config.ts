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
  contactEmail: '',

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
  { key: 'com', label: 'Amazon.com', region: 'United States', host: 'amazon.com', main: true },
  { key: 'couk', label: 'Amazon.co.uk', region: 'United Kingdom', host: 'amazon.co.uk', main: true },
  { key: 'de', label: 'Amazon.de', region: 'Germany', host: 'amazon.de', main: true },
  { key: 'nl', label: 'Amazon.nl', region: 'Netherlands', host: 'amazon.nl', main: true },
  { key: 'in', label: 'Amazon.in', region: 'India', host: 'amazon.in', main: false },
  { key: 'fr', label: 'Amazon.fr', region: 'France', host: 'amazon.fr', main: false },
  { key: 'es', label: 'Amazon.es', region: 'Spain', host: 'amazon.es', main: false },
  { key: 'it', label: 'Amazon.it', region: 'Italy', host: 'amazon.it', main: false },
  { key: 'ie', label: 'Amazon.ie', region: 'Ireland', host: 'amazon.ie', main: false },
  { key: 'be', label: 'Amazon.com.be', region: 'Belgium', host: 'amazon.com.be', main: false },
  { key: 'pl', label: 'Amazon.pl', region: 'Poland', host: 'amazon.pl', main: false },
  { key: 'se', label: 'Amazon.se', region: 'Sweden', host: 'amazon.se', main: false },
  { key: 'ca', label: 'Amazon.ca', region: 'Canada', host: 'amazon.ca', main: false },
  { key: 'au', label: 'Amazon.com.au', region: 'Australia', host: 'amazon.com.au', main: false },
  { key: 'jp', label: 'Amazon.co.jp', region: 'Japan', host: 'amazon.co.jp', main: false },
] as const;

export type AmazonStoreKey = (typeof AMAZON_STORES)[number]['key'];
