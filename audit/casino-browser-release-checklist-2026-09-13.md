# Pick For Me casino browser release checklist

Prepared September 13, 2026. Automated browser evidence is available in [integration Run 309](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34741023078), artifact `casino-browser-evidence` (14-day retention). Run at the exact release revision.

## Completed in disposable CI

Chromium loaded the **production-mode Vite preview** and actual server functions/catalog at `http://127.0.0.1:8080`. Desktop: 1280×800, Reno. Mobile viewport: 390×844, Newkirk. All 12 check groups passed with zero page errors:

- Complete the four-step first-run tour and switch to Nightlife → Casino.
- Retrieve the saved casino pool during a deterministic server-side Overpass outage.
- Enable **Open now only**: unknown-hours records are excluded; an empty result disables picking. Disable it to restore eligible destinations.
- Request options: up to four distinct canonical destinations, bounded by the eligible count. Select one, check its details and exact Google Maps directions destination.
- Reroll to a different available destination; use **Not tonight** and verify its persisted exclusion.
- Exercise Favorites-only empty state, manual empty-location/provider-failure state, Dinner/Date Night/Settings navigation, and no horizontal overflow.

Nominatim locations were deterministic fixtures. Analytics/fonts were outside this functional gate. The external Maps app was not opened; the expected address (or coordinate fallback), `_blank` and `noopener` attributes were asserted. These results do not claim real device geolocation, live-provider success or hosted acceptance.

Reproduce the automated check in a disposable clean checkout with Node 22:

```sh
npm ci --no-audit --no-fund
node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production
npx playwright install --with-deps chromium
CI=true node scripts/casino-browser-smoke.mjs
```

The network preload fails unless both its smoke flag and CI guard are set. It is never imported by application code. Do not point this script at production. **Do not run `npm run build` during this handoff: it chains database migrations.**

## Remaining live acceptance gate

Use a restored local execution environment or an already authorized non-production preview of the release revision. No preview deployment is authorized by this checklist. If no such target is available, leave these checks **NOT RUN**.

| Route / action | Expected behavior |
| --- | --- |
| `/` → Nightlife → Casino; first visit and reload | Tour works once; location and exclusions persist; casino flow remains reachable. |
| Grant, deny and unavailable geolocation; manual city/ZIP | Success uses the requested location; denial/failure offers manual recovery without trapping the user. |
| Live discovery in Reno, Newkirk, Ardmore and Chandler | Fresh results merge with the curated pool. Correct current names/IDs/addresses survive; nearby predecessor aliases do not create duplicates. Record provider success/outage explicitly. |
| Radius, venue type, price/unknown price, Favorites, Not tonight, never recommend | Every displayed option satisfies the current filters; expired exclusions stop applying; empty sets show recovery actions and disable picking. |
| Open now only with known and unknown hours | Only known-open venues qualify. An active property with unknown hours is not represented as currently open. |
| Repeated single picks and options | Alternatives appear when available; no duplicate IDs in one options set; no crash with one/zero eligible destination. |
| Google Maps directions and website buttons | Open the actual selected destination. Check desktop browser and a physical mobile Maps app; record the resolved place/entrance. |
| Reno ROW and J Resort; Tahoe successors | Separate gaming properties remain distinct; Sands Regency/Harveys/MontBleu/Hard Rock Tahoe aliases merge only near their current replacements. |
| Quapaw new casino, Harrah's Oklahoma, Cadence Crossing | Current property/footprint is selected. Former Quapaw, Ioway and Jokers Wild data cannot be mistaken for current directions. |
| Oneida Airport/IMAC and Soaring Eagle Slot Palace | Separate floors across the campus/street route to their current distinct destinations. Slot Palace uses 7566 Ogemaw Dr; Oneida IMAC uses 2100 Airport Dr. |
| Grand Lake Casino / lodge; Montego Bay / Wendover Nugget | Casino uses 24701 S 655 Rd, not the off-site lodge. Montego Bay uses 100 Wendover Blvd; Wendover Nugget uses 101. |
| Provider timeout, malformed response and offline transition | Honest fallback notice; saved casinos remain usable; no fabricated live/open status. |
| Dinner, Date Night, Settings and representative mobile navigation | Existing navigation, disclosures and icon packs remain intact; overlays scroll and close; no horizontal overflow. |

Record revision, URL, browser/device, time, locations, screenshots, provider outcome and actual failures. An unavailable check is not a pass.

## After separately authorized release

Repeat the hosted subset on the released revision: initial load/reload, fresh and existing storage, casino pick/options, real map navigation, provider fallback, mobile behavior and existing non-casino navigation. Verify the served revision/cache reflects the intended release. Use the established reversible release rollback process if a material regression appears; no database migration was introduced by this casino update.
