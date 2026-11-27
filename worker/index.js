/**
 * TARKASA TALES WEBSITE WORKER
 * Serves the website as before, plus one extra job: when someone sends the review form
 * on /reviews/, it emails the review to you. Nothing is stored on the website.
 *
 * Setup (once), in Cloudflare → Workers & Pages → tarkasa-tales → Settings → Variables and Secrets:
 *   add a Secret named REVIEW_TO with the email address that should receive reviews.
 *   That address must be a verified destination in Email Routing (your forwarding address already is).
 */
import { EmailMessage } from 'cloudflare:email';

const FROM = 'reviews@tarkasatales.com';
/**
 * Review emails are only ever sent from the real website. Cloudflare preview versions (branch builds)
 * share this script's settings and secrets, so without this check a preview copy could send real emails.
 * On any other address the form is accepted but nothing is sent.
 */
const LIVE_HOSTS = ['tarkasatales.com', 'www.tarkasatales.com'];
const ROLES = ['Parent', 'Grandparent', 'Teacher', 'Librarian', 'Reader'];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/review' || url.pathname === '/api/review/') {
      if (request.method !== 'POST') return go('/reviews/');
      try {
        return await handleReview(request, env, url);
      } catch (e) {
        console.error('review failed', e);
        return go('/reviews/?error=1#write');
      }
    }
    // One address for search engines: www.tarkasatales.com → tarkasatales.com (same page, permanent).
    if (url.hostname === 'www.tarkasatales.com' && (request.method === 'GET' || request.method === 'HEAD')) {
      url.hostname = 'tarkasatales.com';
      return Response.redirect(url.toString(), 301);
    }
    const res = await env.ASSETS.fetch(request);
    // Any other address (e.g. *.workers.dev or a preview copy) is never indexed by search engines.
    if (!LIVE_HOSTS.includes(url.hostname)) {
      const copy = new Response(res.body, res);
      copy.headers.set('X-Robots-Tag', 'noindex, nofollow');
      return copy;
    }
    return res;
  },
};

function go(path) {
  return new Response(null, { status: 303, headers: { Location: path } });
}

/** One line of text: no line breaks, trimmed, limited length. */
const line = (v, max) => String(v ?? '').replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

async function handleReview(request, env, url) {
  const origin = request.headers.get('Origin');
  if (origin && origin !== url.origin) return go('/reviews/?error=1#write');

  const f = await request.formData();
  // Spam checks: the hidden "website" box must be empty, and the form must have been open for a few seconds.
  const opened = Number(f.get('t'));
  if (line(f.get('website'), 200) || (opened && Date.now() - opened < 3000)) return go('/reviews/?sent=1#write');

  const name = line(f.get('name'), 40);
  const place = line(f.get('place'), 60);
  const role = ROLES.includes(f.get('role')) ? f.get('role') : 'Reader';
  const bookRaw = line(f.get('book'), 80);
  const book = /^[a-z0-9-]+$/.test(bookRaw) ? bookRaw : '';
  const ratingNum = Number(f.get('rating'));
  const rating = Number.isInteger(ratingNum) && ratingNum >= 1 && ratingNum <= 5 ? ratingNum : null;
  const review = String(f.get('review') ?? '').replace(/\r\n?/g, '\n').trim().slice(0, 1200);
  const emailRaw = line(f.get('email'), 120);
  const email = /^[^\s@<>"]+@[^\s@<>"]+\.[^\s@<>"]+$/.test(emailRaw) ? emailRaw : '';
  const share = f.get('share') === 'yes';
  const adult = f.get('adult') === 'yes';

  if (!name || review.length < 10 || !adult) return go('/reviews/?error=1#write');
  if (!LIVE_HOSTS.includes(url.hostname)) {
    console.log(`Preview copy (${url.hostname}): review not emailed.`);
    return go('/reviews/?sent=1#write');
  }
  if (!env.SEB || !env.REVIEW_TO) {
    console.error('Review email not set up: add the REVIEW_TO secret (and the SEB send_email binding).');
    return go('/reviews/?error=1#write');
  }

  const today = new Date().toISOString().slice(0, 10);
  const about = book ? `${book} (https://tarkasatales.com/books/${book}/)` : 'Tarkasa Tales in general';
  const stars = rating ? '★'.repeat(rating) + '☆'.repeat(5 - rating) + ` (${rating}/5)` : 'no rating';
  const slug = name.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'review';
  const yamlStr = (s) => JSON.stringify(s); // JSON strings are valid YAML strings

  let body = `A new review was sent from tarkasatales.com/reviews/\n\n` +
    `Name:    ${name}\nPlace:   ${place || '-'}\nRole:    ${role}\nAbout:   ${about}\nRating:  ${stars}\n` +
    `Email:   ${email || '- (no reply wanted)'}\nMay share on the website: ${share ? 'YES' : 'NO, private feedback only'}\n\n` +
    `Review:\n${review}\n`;

  if (share) {
    body += `\n------------------------------------------------------------\n` +
      `To publish it, check the review is suitable, then create the file\n` +
      `src/content/testimonials/${today}-${slug}.md with exactly this text:\n\n` +
      `---\nname: ${yamlStr(name)}\n` + (place ? `place: ${yamlStr(place)}\n` : '') + `role: ${role}\n` +
      (book ? `book: ${book}\n` : '') + (rating ? `rating: ${rating}\n` : '') + `date: ${today}\n` +
      `quote: ${yamlStr(review)}\npermission: true\n---\n` +
      `------------------------------------------------------------\n`;
  }
  body += `\nThe person confirmed they are 16 or older. Delete this email once you have dealt with it.\n`;

  const subject = `New review from ${name}${rating ? ` (${rating}★)` : ''}`;
  const raw = mime({ from: `Tarkasa Tales website <${FROM}>`, to: env.REVIEW_TO, replyTo: email, subject, body });
  await env.SEB.send(new EmailMessage(FROM, env.REVIEW_TO, raw));
  return go('/reviews/?sent=1#write');
}

function b64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}

function mime({ from, to, replyTo, subject, body }) {
  const headers = [
    `From: ${from}`,
    `To: ${to}`,
    replyTo ? `Reply-To: ${replyTo}` : null,
    `Subject: =?UTF-8?B?${b64(subject)}?=`,
    `Date: ${new Date().toUTCString()}`,
    `Message-ID: <${crypto.randomUUID()}@tarkasatales.com>`,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64',
  ].filter(Boolean);
  const encoded = b64(body).replace(/.{76}/g, '$&\r\n');
  return headers.join('\r\n') + '\r\n\r\n' + encoded + '\r\n';
}
