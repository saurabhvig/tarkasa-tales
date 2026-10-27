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
  privacyController: '',

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

/** Amazon stores we link to, in the order buttons appear. */
export const AMAZON_STORES = [
  { key: 'amazonCom', label: 'Amazon.com', region: 'United States', host: 'amazon.com' },
  { key: 'amazonCoUk', label: 'Amazon.co.uk', region: 'United Kingdom', host: 'amazon.co.uk' },
  { key: 'amazonDe', label: 'Amazon.de', region: 'Germany', host: 'amazon.de' },
  { key: 'amazonNl', label: 'Amazon.nl', region: 'Netherlands', host: 'amazon.nl' },
] as const;
