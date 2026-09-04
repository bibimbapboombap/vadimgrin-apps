# vadimgrin.com/apps

Static landing hub for my iOS apps. Plain HTML and CSS with one tiny vanilla-JS
file for the scroll reveal — no build step, no framework, no dependencies.

Live at <https://vadimgrin.com/apps>.

## Contents

```
index.html               Just Apps hub — Chess Clock, Shapes, God Mode
styles.css
apps.js                  Scroll-reveal (progressive: content shows without JS)
assets/                  Exported from Figma ("My Apps" file)
privacy-policy/          Just Chess Clock policy — /apps/privacy-policy
├── index.html
└── styles.css
privacy-policy-shapes/   Just Shapes policy — /apps/privacy-policy-shapes
├── index.html           (DRAFT — see the [VERIFY] notes inside)
└── styles.css
```

Design and header behaviour (pill nav, the yellow marker on "Apps", the
scroll-reveal) mirror the `/consult` pages in the `vadim/` WordPress theme.

## Deploying

The repository root maps to `/apps` on the web host: upload the contents of this
repo into a folder named `apps` at the site root, alongside (not inside) the
WordPress install.

`privacy-policy` is a real directory containing an `index.html`, which is what
gives it the extension-less URL `/apps/privacy-policy`. It also keeps WordPress
out of the way — WordPress's rewrite rules skip requests that match a directory
that actually exists on disk.

## Previewing locally

Open a terminal in this folder and run:

```bash
python3 -m http.server 8777
```

Then visit <http://localhost:8777>.

Use a server rather than opening `index.html` directly — over `file://` the
browser has no notion of a directory index, so the Privacy Policy link lands on
a folder listing instead of the page.

## Cache busting

The site sits behind Cloudflare, which caches CSS and images at its edge for a
long time. Re-uploading a changed file under the same name does **not** update
what visitors see — the edge keeps serving the old copy until the cache is
purged.

To avoid that, every stylesheet and image reference carries a version token:

```html
<link rel="stylesheet" href="styles.css?v=20260721">
<img src="assets/screen-1.png?v=20260721">
```

Cloudflare treats a different query string as a different URL, so bumping the
token makes the change go live immediately, with no purge.

**After changing any CSS or image, bump the token** (use today's date) and
re-upload the HTML files along with the changed asset:

```bash
OLD=20260904; NEW=$(date +%Y%m%d)
sed -i '' "s/?v=$OLD/?v=$NEW/g" index.html privacy-policy/index.html privacy-policy-shapes/index.html
```

HTML files themselves are not cached by Cloudflare (they return
`cf-cache-status: DYNAMIC`), so they go live as soon as they are uploaded.

## Notes

- Fonts (Google Fonts): each app title uses its own face — Bricolage Grotesque
  (hero), Podkova (Chess Clock), Asap (Shapes), IM Fell English (God Mode);
  Gabarito for nav/labels/lede, Inter for app descriptions.
- Nav pill: `Just Apps` is the current page, `developer` → vadimgrin.com,
  `Support` → `mailto:vadym.gryn@gmail.com`.
- **Placeholders still to fill:** the Just Shapes App Store link, the three
  footer social links (LinkedIn / Substack / Medium), and the Just Shapes
  privacy text (see `privacy-policy-shapes/` [VERIFY] notes). All are `#` or
  draft until provided.
- `hero-sky.jpg` and `god-ipad.jpg` were re-compressed from the raw Figma
  exports (968 KB → 122 KB; 497 KB PNG → 37 KB JPG flattened on the plate
  colour). Keep them optimised if re-exported.
