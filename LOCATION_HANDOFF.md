# Pick For Me — location and international discovery handoff

September 13, 2026. Location source branch: `integration/location-international-2026-09-13`. The work began at `877ff08c300a9d149aa174e9c47471d57bc98ccd` and was rebased onto the separately completed casino integration checkpoint `a6d38616fe4490ff46b87232cbc7abb82f176926`. Main baseline: `c187d518cf8b0c8b9202ee0ae6493667eb4c0ab5`.

No main change, production write, Vercel deployment, database migration, Exa use or recurring task is part of this work. The candidate uses the existing `integration/**` Git-deployment exclusion. Casino data, Passes 51–54, selection rules, live-data validation, closure holds and query deadline from the concurrent casino work were preserved.

## COMPLETED

### Architecture and controls

The pre-edit trace is in [the architecture audit](audit/location-architecture-2026-09-13.md). The original target button did call geolocation and its coordinates were eventually consumed. It waited for reverse lookup, had no visible progress on the closed control, hid errors inside the closed manual form, and mislabeled every error as denial. Dinner also requested GPS automatically on initial default-location load.

Dinner, Nightlife/casino and Date Night now share `LocationControl` and a tested request controller:

- GPS is requested only after clicking **Use my location**. There is no automatic request on initial load or reload.
- A valid position immediately becomes the persisted active search origin. Reverse lookup enriches its label/address metadata; it never replaces the device coordinates with a city/feature centroid.
- Progress, success and errors appear beside the control, whether or not manual entry is open. Permission denial, unavailable position, timeout and unsupported-browser states have distinct messages.
- Manual entry and Cancel remain usable during GPS/reverse requests. Editing, cancelling, a newer request or unmount invalidates late callbacks. A slow GPS result cannot replace a newer manual choice.
- The location field is prefilled from the selected location when opened. Long labels wrap on mobile.
- Existing local persistence and filter settings are retained. Legacy `{lat, lon, label, source}` records still hydrate; corrupt locations cannot replace a valid current/default location. Changing the origin still clears the session-shown list.

### Geographic foundation and discovery

`GeographicLocation` holds coordinates, a display label and optional `country`, ISO alpha-2 `countryCode`, `region` and `locality`. Neither regions nor postal codes are mandatory. The existing `lat`/`lon`/`label`/`source` API remains compatible.

Manual free text reaches Nominatim without the old `countrycodes=us` filter or a U.S. suffix. Country, region and locality come from provider address data rather than a U.S. state parser or a Canada-specific mode. Empty/invalid inputs, invalid coordinates, bad response shapes and no-result responses are handled explicitly. Ambiguous city names or bare postal codes may require a region/country; the form explains this.

All business categories continue using their existing coordinate/radius Overpass queries. No replacement provider, country-specific query, extra discovery subscription or casino inventory was introduced. The original Joplin fallback and distance-bounded curated overlays remain geographically limited. Local closure-name exclusions are now bounded to the Joplin area rather than hiding same-named businesses worldwide. Overpass error remarks/malformed results are errors; valid empty results are empty results.

OSM addresses retain available province/region, postal code and country fields, including `addr:full` and village/place variants. Missing fields do not invalidate businesses. Result and date-plan Maps links use the destination coordinates to avoid ambiguous partial addresses. Favorites and rideshare links already use coordinates; external app availability remains outside this validation.

### Canada and U.S. validation

Actual live Nominatim calls successfully resolved all of these:

| Input | Observed country | Region/result |
| --- | --- | --- |
| Joplin, Missouri, USA | US | Missouri |
| 64801 | US | Joplin, Missouri |
| Portland, Oregon, USA | US | Oregon |
| Toronto, Ontario, Canada | CA | Ontario |
| Toronto, Ontario | CA | Ontario |
| Vancouver, British Columbia, Canada | CA | British Columbia |
| Vancouver, British Columbia | CA | British Columbia |
| Montréal, Québec, Canada | CA | Québec |
| London, United Kingdom | GB | Greater London, England |

The existing restaurant Overpass adapter also returned live normalized results around three Canadian origins using its one-mile radius:

| City | Returned rows | Provider response |
| --- | ---: | --- |
| Toronto | 1,671 | HTTP 200, first configured mirror |
| Vancouver | 360 | HTTP 200, first configured mirror |
| Montréal | 1,014 | HTTP 200, first configured mirror |

These are observed OSM rows, not a complete city inventory, an eligible filtered count or proof that each venue is currently open. The three-category regression fixtures exercise the actual validators, query builders, normalizers, catalog merges and fallbacks across Joplin, Portland, Toronto, Vancouver, Montréal and London. Province/country handling, international addresses, missing regions, invalid locations, empty/error responses, filters and Maps destinations are covered.

The blocking country restriction was the application's Nominatim configuration. No Canadian geographic restriction was found in the existing Overpass provider. Live evidence, normalized examples and exact limits are preserved in [location-validation-2026-09-13.json](audit/location-validation-2026-09-13.json).

### Tests and builds

After rebasing onto the current casino integration:

- Clean dependency installation: `npm ci --no-audit --no-fund` passed.
- `npm test`: **273 repository + 69 application = 342 passed; zero failures; four existing external-documentation skips**. The location work adds 28 meaningful tests. Casino-specific tests are included in the repository total, not additional unique tests.
- `npm run typecheck`: passed.
- `npm run audit:casinos`: both audits passed. The inherited catalog remains **808 canonical destinations, 824 serialized rows, 54 passes**; this location change adds/edits no casino data.
- `npm run build:dev`: exited successfully and generated client/server/Nitro build artifacts. This creates local build files; it is not a deployment.
- Local Chromium location smoke: **12 checks passed** in both development and built-preview modes, including the actual app/RPC path, granted native browser geolocation with simulated coordinates, automatic discovery, manual overrides, persistence, all three categories, Maps links and 390px mobile layout. Error callbacks are explicitly mocked. There were no uncaught browser page errors.
- The required integration workflow retains the inherited production-mode build **without migrations** and casino Chromium smoke. It also runs the new location smoke and preserves its evidence. The casino smoke's input label and Maps assertion were updated for the shared international control and coordinate destinations; its behavioral coverage remains intact.

The initial older checkout had a stale lockfile; the newer casino integration supplied its corrected lockfile, and the final clean install succeeded. A one-line `unknown` error guard in `AppErrorComponent` was necessary for typechecking against the installed router types. No dependency upgrade was introduced by the location work.

The review candidate is [PR #39](https://github.com/caleb1234calvin-art/dinner-roulette/pull/39), targeting non-production integration. First CI Run 311 passed tests, audits, both builds and casino browser checks, then its new location harness timed out waiting for global network idle. The harness now waits for interactive hydrated controls and isolates unrelated external fonts/analytics; app assertions were retained. Run 312 then reached successful GPS acquisition but its call counter reset to zero, consistent with a development-page reload. CI location acceptance now uses the built preview, as the casino acceptance already does, while retaining every behavior assertion. The current exact-head Actions status is available on the PR and must be green before any promotion.

## BLOCKED

No remaining structural implementation blocker is known. Physical-phone GPS hardware, actual Android/iOS permission dialogs, installed PWA behavior and hosted acceptance cannot be certified by this local Chromium environment. These remain unverified, not passed.

The ordinary browser download failed in this environment. Local Chromium was recovered from a separately installed test runtime; server and browser ran in the same disposable local process network. No application permission or authentication control was disabled. This runtime setup is not an application dependency.

## REQUIRES BROWSER / DEVICE VALIDATION

Use a fresh browser profile on an authorized HTTPS test target, or a device-accessible secure development target. Do not clear an existing user's saved favorites to perform these checks.

1. Open Dinner with location permission unset. Confirm there is no automatic permission request and that the default/persisted origin is displayed.
2. Tap **Use my location**. Allow browser/OS access. Confirm progress appears, current coordinates become active without typing, the label updates when reverse lookup succeeds, and nearby results correspond to the device's actual area.
3. Repeat using approximate location if the OS offers it. Record the resulting accuracy and confirm discovery uses the supplied point.
4. In a separate fresh profile, deny permission. Confirm the error is visible with the form closed and that **Change location** still opens a usable manual form.
5. With device location services unavailable, confirm a usable error/fallback. Unit/browser mocks cover unavailable and timeout paths; record which actual platform error occurs rather than asserting an unobserved path.
6. Enter Joplin, Missouri, USA; 64801; Portland, Oregon, USA; Toronto, Ontario, Canada; Vancouver, British Columbia, Canada; Montréal, Québec, Canada; and London, United Kingdom. Confirm displayed country/region and plausible nearby results.
7. After GPS, choose a different manual city. Refresh and switch among Dinner, Nightlife/casino and Date Night. Confirm the manual origin persists, filters remain intact and no delayed GPS result changes it.
8. Open a result's Maps link and confirm its real destination pin in Google Maps. Locally the URL/destination is tested; the external Maps app interaction is not.
9. Test portrait layout, a narrow viewport, long location labels and visible errors with the keyboard open. Check both action buttons and Cancel remain reachable.
10. Check Android home-screen/PWA and iOS Safari behavior separately. No installed-wrapper/device success is claimed here.

## DEFERRED

Main promotion and hosted/production deployment require separate authorization. No deployment was used to validate this update. Casino coverage expansion and remaining casino acceptance work remain in their separate handoff; this task does not reopen that audit.

The existing opening-hours evaluator uses the viewer's browser timezone, not the destination timezone. Remote searches across timezones therefore do not establish correct destination-local **Open now** status. Distance remains miles and price tiers remain relative dollar symbols. These existing limitations are preserved and documented rather than folded into a currency, timezone or localization project.

## OPTIONAL / FUTURE

- Ambiguous-location candidate selection, localized labels, unit preferences and destination-timezone-aware hours.
- Provider caching, request coordination and a replaceable geocoder endpoint as traffic grows. Nominatim and public Overpass mirrors are best-effort services; this update is not a coverage or availability guarantee. No autocomplete/background location polling was added.
- More country fixtures and locally curated fallback coverage where useful. Avoid using the U.S. catalog as an international fallback.

Provider references: [Nominatim search](https://nominatim.org/release-docs/latest/api/Search/), [reverse lookup](https://nominatim.org/release-docs/latest/api/Reverse/), [browser geolocation](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation/getCurrentPosition), [public Nominatim policy](https://operations.osmfoundation.org/policies/nominatim/).

## Files changed

- `.github/workflows/validate-icon-pack.yml`
- `AI_CONTINUITY.md`
- `LOCATION_HANDOFF.md`
- `audit/location-architecture-2026-09-13.md`
- `audit/location-validation-2026-09-13.json`
- `scripts/casino-browser-smoke.mjs`
- `scripts/location-browser.mjs`
- `scripts/location-discovery.test.mjs`
- `scripts/test-runner.mjs`
- `scripts/test-support/load-app-module.mjs`
- `scripts/test-support/location-provider-fixtures.mjs`
- `src/components/date-night-home.tsx`
- `src/components/date-night-plan-overlay.tsx`
- `src/components/location-control.tsx`
- `src/components/nightlife-home.tsx`
- `src/components/pick-home.tsx`
- `src/components/result-overlay.tsx`
- `src/lib/date-night/search.ts`
- `src/lib/error-component.tsx`
- `src/lib/location/controller.ts`
- `src/lib/location/location.test.ts`
- `src/lib/location/maps.ts`
- `src/lib/location/model.ts`
- `src/lib/nightlife/search.ts`
- `src/lib/restaurants/geocode.ts`
- `src/lib/restaurants/normalize.ts`
- `src/lib/restaurants/overpass.ts`
- `src/lib/restaurants/search.ts`
- `src/lib/restaurants/types.ts`
- `src/lib/store.ts`
