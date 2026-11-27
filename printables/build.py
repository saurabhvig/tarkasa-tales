"""
Build the Tarkasa Tales printables (PDF) from the HTML templates in this folder.

    python3 printables/build.py            # all printables
    python3 printables/build.py bobbin-calm-down-cards

For each template <name>.html it writes:
  public/activities/<name>.pdf          the download (A4)
  src/assets/printables/<name>.png      a small picture of page 1 for the website cards
Needs Python with Playwright and Pillow (not part of the website build, nothing to install on the server).
"""
import sys
from pathlib import Path
from PIL import Image
from playwright.sync_api import sync_playwright

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
SAMPLES = ROOT / 'src/assets/samples'
OUT_PDF = ROOT / 'public/activities'
OUT_PNG = ROOT / 'src/assets/printables'

# Book illustrations used in the headers: (source page, crop box in pixels of the 1208 x 1225 page).
ART = {
    'bobbin-bridge': ('bobbin-1.jpg', (0, 0, 1208, 625)),
    'bobbin-den': ('bobbins-feelings-pocket-p55.jpg', (80, 345, 1130, 745)),
    'katherine-steps': ('katherine-johnson-p4.jpg', (150, 100, 1080, 675)),
    'newton-apple': ('isaac-newton-p12.jpg', (125, 100, 1090, 685)),
    'jane-hen': ('jane-goodall-p5.jpg', (125, 100, 1075, 675)),
}


COVERS = ['jane-goodall', 'alexander-fleming', 'galileo-galilei']  # small covers for the observation journal


def make_art():
    (HERE / 'art').mkdir(exist_ok=True)
    for name in COVERS:
        im = Image.open(ROOT / 'src/assets/covers' / f'{name}.jpg').convert('RGB')
        im.thumbnail((360, 360))
        im.save(HERE / 'art' / f'cover-{name}.jpg', quality=84)
    for name, (src, box) in ART.items():
        im = Image.open(SAMPLES / src).convert('RGB').crop(box)
        im.thumbnail((1100, 1100))
        im.save(HERE / 'art' / f'{name}.jpg', quality=84)


def build(names):
    OUT_PNG.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 794, 'height': 1123}, device_scale_factor=1)
        for name in names:
            page.goto((HERE / f'{name}.html').as_uri())
            page.evaluate('document.fonts.ready')
            page.wait_for_timeout(300)
            page.pdf(path=str(OUT_PDF / f'{name}.pdf'), format='A4', print_background=True, prefer_css_page_size=True)
            # Picture of page 1 for the website card.
            first = page.locator('.page').first
            first.screenshot(path=str(OUT_PNG / f'{name}.png'))
            im = Image.open(OUT_PNG / f'{name}.png').convert('RGB')
            im.thumbnail((640, 900))
            im.save(OUT_PNG / f'{name}.png', optimize=True)
            print('built', name)
        browser.close()


if __name__ == '__main__':
    make_art()
    names = sys.argv[1:] or sorted(p.stem for p in HERE.glob('*.html'))
    build(names)
