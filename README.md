# Pick For Us

A shared picker for food, date nights, and nightlife. You set the rules. The app either **picks one place** or **gives four options**.

Favorites, history, ratings, and theme stay on this device (browser storage). Live places come from OpenStreetMap.

## Permanent domain readiness

The planned canonical URL is `https://pickforus.app`. This remediation prepares
metadata and install identity only; DNS, domain attachment and deployment have
not been performed. Deploy this candidate only after separate authorization and
confirmation that the apex serves the app over valid HTTPS.

Keep `https://dinner-roulette-chi.vercel.app` serving without a redirect: existing
Android shells still load it, using `com.calebcalvin.pickforus`. The new apex
starts with fresh browser-local favorites, history and settings. Existing data
remains on the legacy origin in the same browser/profile; no transfer or sync
is provided, and the `pick-for-us-v1` key/schema remains unchanged.

The final head injector and client navigation share route-aware canonical/OG
metadata. `/` is indexable on the apex and legacy serving host; `/settings`,
`/history` and `/favorites` use their own clean apex canonical and
`noindex,follow`. Preview/system hosts stay `noindex,follow` and never become
canonical origins. All manifest compatibility endpoints share Pick For Us
identity; no service worker or offline feature is added.

Keep the migration-free Vercel Build Command:

```bash
VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production
```

Do not use `npm run build` for this phase: it also invokes `db:migrate`.

## Run locally

Needs Node.js 22+.

```bash
npm install
npm run dev
```

Then open the URL printed in the terminal.

## What it does

- **Pick for us** — one restaurant, with reroll / not tonight / favorite
- **Give us options** — up to four varied places from the same filters
- Distance, price, cuisine, open-now, favorites-only, familiar → adventurous
- City / ZIP search and device location
- Dark (charcoal + burnt orange) and light (paper + cyan) themes

## Hosting note

This is a TanStack Start app with a small server. Restaurant search and location lookup run on the server (OpenStreetMap Overpass + Nominatim). A static GitHub Pages dump will not keep live search.

Deploy it on any host that can run Node / serverless functions (Vercel, Netlify, Cloudflare, a VPS).
