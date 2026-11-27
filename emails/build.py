"""
LEARNING CLUB EMAILS (Brevo). Not part of the website build.

Makes ready-to-paste HTML for Brevo → Campaigns/Templates → "Code your own":
  emails/out/learning-club-template.html   reusable layout with example blocks
  emails/out/welcome.html                  sent once after someone confirms (Brevo automation)
  emails/out/2026-12-newsletter.html       first monthly issue (draft for approval)
Run:  python3 emails/build.py

Brevo fills in {{ contact.FIRSTNAME }}, {{ unsubscribe }}, {{ update_profile }} and {{ mirror }} when sending.
Images load from https://tarkasatales.com/email/ (the public/email folder), so the website must be published first.
"""
from pathlib import Path

SITE = 'https://tarkasatales.com'
IMG = SITE + '/email'
OUT = Path(__file__).parent / 'out'
C = dict(cream='#FFF5E6', plum='#53406C', deep='#2E2140', ink='#3F3354', soft='#5C4F70', yellow='#F6BD60',
         yellow_soft='#FDEFD6', mint_soft='#DDF1EF', lav_soft='#ECE6F8', coral_soft='#FCE3E4', line='#EADFCB')
HEAD_FONT = "'Fredoka','Arial Rounded MT Bold','Trebuchet MS',Arial,sans-serif"
BODY_FONT = "'Nunito Sans','Segoe UI',Helvetica,Arial,sans-serif"


def utm(path, campaign):
    sep = '&' if '?' in path else '?'
    return f"{SITE}{path}{sep}utm_source=learning-club&utm_medium=email&utm_campaign={campaign}"


def button(href, label, bg=C['plum'], fg='#FFFFFF'):
    return (f'<table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-radius:999px;background:{bg};">'
            f'<a href="{href}" style="display:inline-block;padding:14px 26px;font-family:{BODY_FONT};font-size:17px;font-weight:800;'
            f'color:{fg};text-decoration:none;border-radius:999px;">{label}</a></td></tr></table>')


def h(text, size=26, color=C['deep']):
    return f'<h2 style="margin:0 0 10px;font-family:{HEAD_FONT};font-weight:600;font-size:{size}px;line-height:1.2;color:{color};">{text}</h2>'


def p(text, size=17, color=C['ink'], extra=''):
    return f'<p style="margin:0 0 14px;font-family:{BODY_FONT};font-size:{size}px;line-height:1.55;color:{color};{extra}">{text}</p>'


def kicker(text):
    return (f'<p style="margin:0 0 8px;font-family:{BODY_FONT};font-size:13px;font-weight:800;letter-spacing:1.5px;'
            f'text-transform:uppercase;color:{C["plum"]};">{text}</p>')


def card(inner, bg='#FFFFFF'):
    return (f'<tr><td style="padding:0 24px 20px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">'
            f'<tr><td style="background:{bg};border-radius:20px;padding:26px;">{inner}</td></tr></table></td></tr>')


def media_card(img, alt, inner, bg='#FFFFFF', img_w=150):
    """Picture on the left, words on the right; stacks on phones (class="stack")."""
    return card(
        f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>'
        f'<td class="stack" width="{img_w}" valign="top" style="padding:0 20px 0 0;">'
        f'<img src="{img}" width="{img_w}" alt="{alt}" style="display:block;width:{img_w}px;max-width:100%;height:auto;border-radius:10px;border:1px solid {C["line"]};"></td>'
        f'<td class="stack" valign="top">{inner}</td></tr></table>', bg)


def books_row(items):
    cells = ''.join(
        f'<td class="stack" width="50%" valign="top" style="padding:0 8px 12px;text-align:center;">'
        f'<a href="{href}" style="text-decoration:none;"><img src="{img}" width="150" alt="Cover of {title}" '
        f'style="display:block;margin:0 auto 10px;width:150px;max-width:100%;height:auto;border-radius:10px;"></a>'
        f'<p style="margin:0 0 4px;font-family:{HEAD_FONT};font-size:18px;font-weight:600;color:{C["deep"]};">'
        f'<a href="{href}" style="color:{C["deep"]};text-decoration:none;">{title}</a></p>'
        f'<p style="margin:0;font-family:{BODY_FONT};font-size:15px;line-height:1.45;color:{C["soft"]};">{why}</p></td>'
        for img, title, why, href in items)
    return f'<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>{cells}</tr></table>'


def page(preheader, title, blocks, campaign):
    return f'''<!doctype html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="x-apple-disable-message-reformatting">
<title>{title}</title>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@600&family=Nunito+Sans:wght@400;800&display=swap" rel="stylesheet">
<style>
  body {{ margin:0; padding:0; background:{C['cream']}; }}
  a {{ color:{C['plum']}; }}
  @media (max-width: 620px) {{
    .wrap {{ width:100% !important; }}
    .stack {{ display:block !important; width:100% !important; padding:0 0 16px 0 !important; }}
    .stack img {{ margin:0 auto !important; }}
  }}
</style>
</head>
<body style="margin:0;padding:0;background:{C['cream']};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">{preheader}&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:{C['cream']};">
<tr><td align="center" style="padding:16px 8px;">
<table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
<tr><td style="padding:4px 24px 12px;font-family:{BODY_FONT};font-size:12px;color:{C['soft']};text-align:right;">
  <a href="{{{{ mirror }}}}" style="color:{C['soft']};">View in your browser</a></td></tr>
<tr><td style="padding:8px 24px 20px;" align="left">
  <a href="{utm('/', campaign)}"><img src="{IMG}/logo.png" width="220" alt="Tarkasa Tales" style="display:block;width:220px;height:auto;border:0;"></a></td></tr>
{''.join(blocks)}
<tr><td style="padding:12px 24px 32px;font-family:{BODY_FONT};font-size:13px;line-height:1.6;color:{C['soft']};">
  <p style="margin:0 0 8px;">You’re getting this because you joined the Tarkasa Tales Learning Club at tarkasatales.com and confirmed your email. It’s for grown-ups (18+); we never ask for children’s details.</p>
  <p style="margin:0 0 8px;"><a href="{{{{ unsubscribe }}}}" style="color:{C['plum']};font-weight:800;">Unsubscribe</a> with one click · <a href="{{{{ update_profile }}}}" style="color:{C['plum']};">Update your details</a> · <a href="{utm('/privacy/', campaign)}" style="color:{C['plum']};">Privacy policy</a></p>
  <p style="margin:0;">Tarkasa Tales · Saurabh Vig · the Netherlands · <a href="mailto:hello@tarkasatales.com" style="color:{C['plum']};">hello@tarkasatales.com</a></p>
</td></tr>
</table></td></tr></table>
</body></html>
'''


def greeting():
    return p('Hello {{ contact.FIRSTNAME | default : "there" }},', 18, C['deep'], 'font-weight:800;')


# ---------- 1. Reusable template (layout + one example of every block) ----------
c = 'MONTH'
template = page('PREHEADER: one line that shows next to the subject in the inbox.', 'Learning Club', [
    card(greeting() + p('OPENING: two or three warm sentences about this month.')),
    media_card(f'{IMG}/isaac-newton-gravity-activity.jpg', 'Page 1 of the printable',
               kicker('Printable of the month') + h('PRINTABLE TITLE') + p('What it is and how long it takes.') +
               button(utm('/activities/', c), 'Download the free PDF'), C['yellow_soft']),
    card(kicker('Science fact') + h('A FACT AS A QUESTION?') + p('Two or three short, true sentences a child can repeat.') +
         p('<strong>Try it together:</strong> one safe thing to do at home.', 16), C['mint_soft']),
    card(kicker('Book news') + h('NEWS HEADLINE') + p('Only confirmed news. No dates or prices until they are certain.'), C['lav_soft']),
    card(kicker('Read next') + books_row([
        (f'{IMG}/cover-isaac-newton.jpg', 'BOOK ONE', 'Why it fits this month.', utm('/books/isaac-newton/', c)),
        (f'{IMG}/cover-galileo-galilei.jpg', 'BOOK TWO', 'Why it fits this month.', utm('/books/galileo-galilei/', c))])),
], c)

# ---------- 2. Welcome email ----------
c = 'welcome'
welcome = page('Your first two free printables are inside, plus what to expect each month.', 'Welcome to the Learning Club', [
    card(greeting() + h('Welcome to the Learning Club!', 30) +
         p('Thank you for confirming. Once a month you’ll get one short email with a <strong>new free printable</strong>, '
           '<strong>a science fact</strong> to wonder about together, and <strong>book news</strong>. That’s all, and you can leave any time.') +
         p('To start you off, here are two favourites from our free printables.')),
    media_card(f'{IMG}/little-scientist-observation-journal.jpg', 'Page 1 of the Little Scientist observation journal',
               kicker('For curious minds · ages 5–8') + h('Little Scientist observation journal') +
               p('Look closely, draw it, wonder and look again, just like the scientists in our books. Print the observation page as often as you like.', 16) +
               button(utm('/activities/little-scientist-observation-journal.pdf', c), 'Download the journal'), C['mint_soft']),
    media_card(f'{IMG}/bobbin-calm-down-cards.jpg', 'Page 1 of Bobbin’s calm-down cards',
               kicker('For big feelings') + h('Bobbin’s calm-down cards') +
               p('Eight cut-out cards with calming ideas from Bobbin’s stories, like Bun-and-Soup Breath, plus two blank cards for your child’s own ideas.', 16) +
               button(utm('/activities/bobbin-calm-down-cards.pdf', c), 'Download the cards'), C['coral_soft']),
    card(kicker('There’s more') + p('Every one of our books has its own free printables: reading guides, word searches and activity packs. '
         'They’re all on one page, with filters for your child’s age and favourite topics.') +
         button(utm('/activities/', c), 'See all free printables', C['yellow'], C['deep'])),
    card(p('Happy reading,', 17, C['ink'], 'margin-bottom:4px;') + p('Saurabh, Tarkasa Tales', 17, C['deep'], 'font-weight:800;') +
         p('P.S. Have a question or an idea for a printable? Just reply to this email.', 15, C['soft'])),
], c)

# ---------- 3. First monthly newsletter (December 2026) ----------
c = '2026-12'
newsletter = page('This month: the Great Drop Test, a feather on the Moon, and six new free printables.', 'Learning Club, December', [
    card(greeting() +
         p('Welcome to the very first Learning Club email! This month is all about a question children ask the moment they can let go of a spoon: '
           '<strong>why do things fall down?</strong>')),
    media_card(f'{IMG}/isaac-newton-gravity-activity.jpg', 'Page 1 of the Great Drop Test activity',
               kicker('Printable of the month · ages 4–8') + h('The Great Drop Test') +
               p('Look, ask, test: guess which of two things will land first, drop them together three times and record what happens. '
                 'Then find out what gravity is. Safe, simple and mess-free. Two pages.', 16) +
               button(utm('/activities/isaac-newton-gravity-activity.pdf', c), 'Download the free PDF'), C['yellow_soft']),
    card(kicker('Science fact') + h('What happens if you drop a hammer and a feather on the Moon?') +
         p('They land at the same time! In 1971, astronaut David Scott tried it on the Moon during the Apollo 15 mission. '
           'On Earth, air slows the light, fluffy feather down. The Moon has no air, so gravity pulls both down together.') +
         p('<strong>Try it together:</strong> hold a book and a small ball at the same height, over a soft rug, and let go at the same time. '
           'Then try a flat sheet of paper and a scrunched-up ball of paper. What changed?', 16), C['mint_soft']),
    card(kicker('Book news') + h('Six new free printables') +
         p('Our Free Resources page has six new printables: Bobbin’s Big Feelings activity sheet and calm-down cards, the Little Scientist '
           'observation journal, Katherine Johnson’s counting and space activity, the Great Drop Test and Jane Goodall’s animal observation journal. '
           'You can now filter every printable by age, collection and topic.') +
         button(utm('/activities/', c), 'Browse all free printables', C['plum']) +
         p('&nbsp;', 8) +
         h('On the way', 22) +
         p('<strong>Bobbin’s Feelings Pocket</strong> (five new stories about big feelings), <strong>Shiva and the River from the Sky</strong> and '
           '<strong>Shabari’s Forest Welcome</strong> (tales from the Ramayana) are coming soon. We’re also preparing '
           '<strong>Women Who Asked Big Questions</strong>, with the stories of Marie Curie, Jane Goodall and Katherine Johnson in one book. '
           'We’ll tell you here first when each one is ready.', 16), C['lav_soft']),
    card(kicker('Read next') + h('Two books about falling apples and faraway moons', 22) + books_row([
        (f'{IMG}/cover-isaac-newton.jpg', 'Isaac Newton', 'A falling apple, a big question, and the idea of gravity.', utm('/books/isaac-newton/', c)),
        (f'{IMG}/cover-galileo-galilei.jpg', 'Galileo Galilei', 'Look, measure, then look again: the Moon has mountains!', utm('/books/galileo-galilei/', c))])),
    card(p('Looking for a present for a curious child? Our <a href="' + utm('/gifts/', c) + '" style="color:#53406C;font-weight:800;">gift guide</a> '
           'has picture books by age and interest, plus free printables to tuck inside.', 16) +
         p('Happy wondering,', 17, C['ink'], 'margin-bottom:4px;') + p('Saurabh, Tarkasa Tales', 17, C['deep'], 'font-weight:800;')),
], c)

OUT.mkdir(exist_ok=True)
for name, html in [('learning-club-template', template), ('welcome', welcome), ('2026-12-newsletter', newsletter)]:
    (OUT / f'{name}.html').write_text(html, encoding='utf-8')
    print('wrote', OUT / f'{name}.html', len(html) // 1024, 'KB')
