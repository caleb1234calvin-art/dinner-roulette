# Dinner Roulette

A private couples restaurant picker. You set distance, price, cuisine, and mood. The app either **picks one place** or **gives four options**.

Favorites, history, ratings, and theme stay on this device (browser storage). Live places come from OpenStreetMap.

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
