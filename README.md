# vadimgrin.com/apps

Static landing pages for my iOS apps. Plain HTML and CSS — no build step, no
JavaScript, no dependencies.

Live at <https://vadimgrin.com/apps>.

## Contents

```
index.html               Just Chess Clock landing page
styles.css
assets/                  Exported from Figma ("My Apps" file)
privacy-policy/
├── index.html           Privacy policy — served at /apps/privacy-policy
└── styles.css
```

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

## Notes

- Fonts are Podkova (headings) and Inter (body), loaded from Google Fonts.
- The App Store button links to `#` until the app is live.
- Support links to `mailto:vadym.gryn@gmail.com`.
