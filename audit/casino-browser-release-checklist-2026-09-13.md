# Pick For Me casino browser release checklist

Updated September 13, 2026 for the **857-destination** continuation. Local production-preview browser validation is completed with `VITE_AUTH_ENABLED=true`; exact candidate CI remains pending. Evidence: `audit/casino-continuation-browser-evidence-2026-09-13.json`. Always run against the intended release revision.

## Completed locally

Chromium 153.0.8010.0 / Playwright loaded the production-mode Vite preview and actual server functions/catalog. Desktop: 1280×800 Reno. Mobile viewport: 390×844 Newkirk. **16 deterministic-outage check groups passed with zero page errors**, including:

- Four-step tour and Nightlife → Casino.
- Compiled saved pools: Reno 19, Newkirk 3; stale builds fail the count check.
- Open now only excludes unknown hours and disables picking on empty; disabling restores eligible destinations.
- Up to four distinct options, selection, current property details, exact Google Maps destination/security attributes, reroll and persisted Not tonight exclusion.
- Visible geolocation-denial/manual recovery, manual empty-location/provider-failure state, Favorites empty state, Dinner/Date Night/Settings and no horizontal overflow.

The separate localhost-only real-network harness passed Reno, Newkirk, Ardmore and Chandler with **zero findings/errors**. Reno/Newkirk used fallback; Ardmore/Chandler returned live/merged results. Native Chromium permission/coordinate emulation covered grant/denial and manual Nominatim lookup succeeded. Transport recorded 16 Overpass HTTP 200s, two Nominatim HTTP 200s and nine provider timeouts. No provider success is inferred from a fallback alone.

Both harnesses require their own strict-port preview process and verify current catalog counts. An unrelated-server busy-port negative check failed closed. Desktop result/mobile options screenshots were visually inspected.

These results do not claim physical GPS, hosted acceptance, an authenticated account, or opening the external Maps app. Browser dimensions emulate a mobile viewport, not Safari/iOS hardware.

## Reproduce safely

Use Node 22 and a permitted disposable checkout. If Playwright Chromium is already installed, use its supported executable override; do not bypass TLS errors to install a browser.

```sh
npm ci --no-audit --no-fund
VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production
npx playwright install --with-deps chromium
VITE_AUTH_ENABLED=true CI=true node scripts/casino-browser-smoke.mjs
VITE_AUTH_ENABLED=true CASINO_BROWSER_LOCAL=1 node scripts/casino-browser-live-check.mjs
```

For this workspace, both scripts accept `CASINO_BROWSER_EXECUTABLE_PATH=/workspace/scratch/60ab73826fd9/browser-engine/chromium`. The deterministic network preload is CI-guarded; the real-network observer is local-only, records host/status/timing without request bodies/credentials and does not mock responses. Neither is imported by application code. Both preview targets are localhost only.

Generated screenshots/logs under `audit/browser-results/` are ignored. CI retains the deterministic smoke artifact separately. **Do not run `npm run build`: it chains database migrations. No preview deployment is authorized by this checklist.**

## Controlled-release acceptance matrix

The local evidence above covers representative flows. The following matrix specifies the expected behavior to verify on a separately authorized served revision; remaining hosted/device/account/Maps checks are **NOT RUN**, not passes.

| Route / action | Expected behavior and present coverage |
| --- | --- |
| `/` → Nightlife → Casino; first visit/reload | Tour once, saved preferences and exclusions persist. Representative local checks passed; hosted fresh/existing storage remains. |
| Grant/deny/unavailable geolocation; city/ZIP | Requested location used; visible error and manual recovery. Local native permission/coordinate emulation and live manual lookup passed; physical GPS remains. |
| Live discovery: Reno/Newkirk/Ardmore/Chandler | Fresh records merge with canonical pool; provider outage is disclosed. Local real-network checks passed with the recorded successes/timeouts. |
| Radius, type, price/unknown price, Favorites, exclusions | Displayed options satisfy filters; expired exclusions stop applying; empty sets offer recovery and disable picking. Unit coverage plus representative local browser checks; repeat hosted acceptance. |
| Open now with known/unknown hours | Only known-open qualifies; active unknown hours does not mean open now. Automated filtering and local empty-state checks passed. |
| Repeated picks/options and one/zero eligible | Unique IDs/options, alternatives when available, no crash. Unit and representative local browser checks passed. |
| Maps directions / website | Selected current property opens. Exact href/security checked locally; external navigation and physical mobile Maps resolution remain. |
| Reno ROW/J Resort; Tahoe successors | Separate floors remain distinct; reviewed predecessors merge only nearby. Automated catalog/alias coverage; inspect selected hosted details. |
| Quapaw replacement/Harrah’s OK/Cadence | Correct current property/footprint and predecessor handling. Automated data/policy coverage; physical destination acceptance remains. |
| First Council/Chilocco; Davis West/Treasure Valley; Wells floors | Distinct properties remain selectable, with correct addresses. Newkirk three-option browser check and near-pair regressions passed. |
| Casino Oklahoma / Elko Roadhouse / Diamond’s | Hinton Cummins property; 1165 E Jennings #102; 1010 E 6th. Evidence and routing regressions passed; inspect opened external destination during acceptance. |
| Oneida Airport/IMAC and Soaring Eagle Slot Palace | Separate floors route distinctly; Slot Palace 7566 Ogemaw, IMAC 2100 Airport. Automated evidence coverage; external routing remains. |
| Grand Lake / lodge; Montego Bay / Wendover Nugget | Casino 24701 S 655, not lodge; distinct 100/101 Wendover. Automated evidence coverage; external routing remains. |
| Timeout/malformed response/offline transition | Honest fallback and usable saved data, no fabricated live/open status. Unit, deterministic outage and real timeout checks passed; hosted offline transition remains. |
| Sign-in / account state | Auth-enabled build renders and invariants pass. Real authenticated account acceptance remains. |
| Dinner/Date Night/Settings/mobile | Existing navigation/disclosures/icons intact; overlays scroll/close, no overflow. Representative local checks passed; physical browser checks remain. |

Record revision, URL, browser/device, time, location, screenshots, provider outcome and actual failures. Do not mark an unavailable check as successful.

## After separately authorized release

Verify the served revision/cache, first load/reload, fresh and existing storage, casino pick/options, real Maps navigation, provider fallback, physical mobile behavior and existing non-casino navigation. Verify any authenticated-account path using an authorized account. Follow the established reversible release rollback process if a material regression appears; no database migration was introduced by this casino continuation.
