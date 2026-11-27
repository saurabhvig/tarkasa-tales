# Learning Club emails (Brevo)

Not part of the website. Run `python3 emails/build.py` to remake the files in `emails/out/`.

| File | What it is | Where it goes in Brevo |
|---|---|---|
| `out/learning-club-template.html` | The reusable layout with an example of every block | Campaigns → Templates → New template → **Code your own** → paste |
| `out/welcome.html` | Sent once, right after someone confirms | Automations → New → "Welcome message" → email content: Code your own → paste |
| `out/2026-12-newsletter.html` | First monthly issue (draft) | Campaigns → Create an email campaign → Code your own → paste |

**Nothing is sent until you press Send or switch the automation on.** Please approve the wording first.

## Before the first send (your checklist)

1. **Publish the website first.** The pictures load from `tarkasatales.com/email/`, which goes live with the Phase 6 deployment.
2. **Sender:** Brevo → Senders, domains & dedicated IPs. Use `hello@tarkasatales.com` as sender and reply-to (the welcome email invites replies). Authenticate the domain there (Brevo shows DNS records; add them in Cloudflare → DNS) so emails don't land in spam.
3. **Subject lines** (suggested):
   - Welcome: `Welcome to the Learning Club 🌟 your first free printables`
   - December: `Why do things fall down? (+ a free printable)`
4. **Send a test** to yourself from Brevo (Preview & Test). Check on your phone and computer that the name, pictures, buttons and the **Unsubscribe** link work.
5. **Recipients:** only the Learning Club list (double opt-in, confirmed contacts).

## Consent and privacy checks (done in Phase 6)

- Signup form: separate **18+ box** (not sent to Brevo) and an unticked **OPT_IN** box with clear wording; double opt-in, so nobody is added before confirming.
- Every email has a one-click `{{ unsubscribe }}` link, a profile link, the privacy policy, who sends it, and why the reader is receiving it.
- No children's names or details are asked for or used. Only the first name (optional) is personalised, with "there" as fallback.
- Links carry UTM tags (`utm_source=learning-club`), counted in Umami without cookies.
- Brevo is named as the email processor in the privacy policy.

## Each month (about 30 minutes)

Copy the template in Brevo, then replace the CAPITAL placeholders: one printable, one true science fact with a "try it together", only confirmed book news (no dates or prices until certain), two related books. Change `utm_campaign` to the month (e.g. `2027-01`).
