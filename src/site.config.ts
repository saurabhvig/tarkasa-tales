/**
 * SITE SETTINGS — the one place for brand-wide details.
 * Edit the values between quotes, save, and publish.
 */
/**
 * PREVIEW BUILDS: Cloudflare builds every GitHub branch. On any branch other than "main" this is true,
 * and the preview copy is hidden from search engines, shows a "preview" banner, and switches off
 * visitor statistics, the newsletter form and the review form, so a preview never touches the live set-up.
 */
const branch = (typeof process !== 'undefined' && process.env?.WORKERS_CI_BRANCH) || '';
export const IS_PREVIEW = !!branch && branch !== 'main';

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
    instagram: 'https://www.instagram.com/tarkasatales/',
    pinterest: '',
    facebook: '',
    youtube: '',
  },

  /** The date the Privacy Policy was last updated. */
  privacyUpdated: '2026-11-20',

  /**
   * VISITOR STATISTICS (Umami Cloud, EU region, no cookies).
   * Paste the "Website ID" from Umami → Settings → Websites → Edit.
   * Leave empty ('') and no statistics script is loaded at all.
   */
  umamiWebsiteId: IS_PREVIEW ? '' : '653625b0-8936-4013-8fa4-7e1bc41afffc',

  /**
   * EMAIL NEWSLETTER (Brevo).
   * Paste the form "action" address from Brevo → Marketing → Forms → your form → Share → Simple HTML,
   * e.g. 'https://a1b2c3.sibforms.com/serve/MUIFAB...'.
   * Leave empty ('') and every signup box is hidden.
   */
  brevoFormAction: IS_PREVIEW ? '' : 'https://c12d850b.sibforms.com/serve/MUIFALcZ_2tyt73eOob648d9vJ1i-_OKRsxAFgWTSkqnGg0Jijr0aDjb2l00Gahr7eNNWazTAlvXI9zcHD0jIYP_O-whos6bLzAJdcxqfBP2ZIa6QeyjFuR2NnLYhMxHEf2fi55GDQwPN3Xo3IBO9gweLh2n53ELU0s5iVUjIgHDRE2NNo5AtTXjIQckGII9zKoKakccraXymGJXOA==',

  /** The person behind Tarkasa Tales, shown on the About page, homepage and book pages. */
  creator: {
    name: 'Saurabh Vig',
    short: 'Saurabh Vig is a biomedical scientist (PhD) in the Netherlands. He chooses each scientist, researches their life from reliable sources, shapes the story and checks every fact.',
    long: [
      'Tarkasa Tales is created by Saurabh Vig, a biomedical scientist (PhD) who works in medical research in the Netherlands.',
      'Every day at work starts with a question, and so does every book. Saurabh chooses each scientist, researches their life from biographies and reliable sources, shapes the story so a four-year-old can follow it, and checks every fact before a book is published. He works with digital writing and illustration tools to bring each story to life, and the sources are listed in the “For grown-ups” pages of every Big Questions book.',
    ],
  },
};

/**
 * Amazon stores we link to, in the order buttons appear.
 * All stores appear in the list under the single "Buy on Amazon" button, sorted by country name.
 * A book with an `asin` gets a link to every store below automatically
 * (unless its file lists `amazonStores` to limit them).
 */
export const AMAZON_STORES = [
  { key: 'com', label: 'Amazon.com', region: 'United States', host: 'amazon.com', main: true, kindleOnly: false },
  { key: 'couk', label: 'Amazon.co.uk', region: 'United Kingdom', host: 'amazon.co.uk', main: true, kindleOnly: false },
  { key: 'de', label: 'Amazon.de', region: 'Germany', host: 'amazon.de', main: true, kindleOnly: false },
  { key: 'nl', label: 'Amazon.nl', region: 'Netherlands', host: 'amazon.nl', main: true, kindleOnly: false },
  // Amazon.in sells KDP books as Kindle eBooks only, so it uses the book's kindleAsin.
  { key: 'in', label: 'Amazon.in · Kindle only', region: 'India', host: 'amazon.in', main: false, kindleOnly: true },
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
