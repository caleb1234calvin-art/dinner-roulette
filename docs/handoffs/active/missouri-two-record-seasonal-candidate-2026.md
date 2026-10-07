# Missouri 2026 two-record seasonal implementation candidate

## V48-01 bounded correction after independent HOLD

Original immutable candidate `ccceeaacc87ad3a4be2b7e27d505ad4a74cce113` remains preserved. Its independent verdict was HOLD, with core automated/factual checks PASS, browser/hosted gates unresolved, and reproduced V48-01 inaccurate Jasper County outage wording. Report SHA-256: `2b0ed4134913b0be016fd56b0d6f62007f8882b6cf828743ee34744b6d1c684e`.

This sole-parent follow-up changes only that one runtime string to region-neutral “Using saved Date Night places while the live map is unavailable.” It adds two real-handler offline-Anything regressions centered on the exact approved Lloyd and Sam locations. No factual mapping, eligibility, taxonomy, provider scope, CI or PR47 change. Updated local full-suite count: 757 passes, four inherited skips, zero failures; focused nine tests pass. Fresh typecheck, safe builds/build proof, changed-file lint and casino audit pass. Exact immutable revision identity and receipts accompany publication; fresh independent review is required.

V48-02 stays an advisory, not confirmed end-to-end leakage. Pending browser checklist additionally includes mixed ordinary/seasonal duplicates followed by seasonal toggle, resume and cache refresh. No eligibility hardening is included. Browser blockage is unchanged; no repetitive blocked browser attempt or acceptance PASS. Hosted CI/build-order and PR47 remain separate release gates.

## Original candidate handoff (historical validation counts below)

Status: IMPLEMENTATION CANDIDATE; BROWSER ACCEPTANCE HOLD; independent verification and release decisions remain separate.

## Immutable inputs and base

Sole base: main `90f0f745a6e35d5abd09f727b7d3c87367ef3295`. Current production on preflight: READY `dpl_fU21Bdhhw6Ruu1KnruYxfpVdQkAK` at that SHA. Canonical continuity inspected at `6177df59ac6ec0abe80fcaeee36e775eddb112d6` on `integration/continuity-refresh-2026-10-07`; older instructions are historical.

Exactly two cleared source projections were read and SHA-256 verified; no original/HOLD population imported:

- MO26-068 Lloyd’s Family Farm: `ab7a7fac4370937c0240d9992f570f685cc2adf10e813768aec85205ca68165f`.
- MO26-116 Sam A. Baker Halloween Bash corrected subset: `008b7c9bf53079c59befcf9a828ed0d1cb644c137ed14fe4ddd7bd7cc336d88c`.
- Separate fresh revalidation at 2026-10-07T21:22:54.912792Z: BOTH PASS, no facts changed. JSON SHA-256 `67ccd9ff4fa7caffafcf172ade3f876a33e2a8232d3a09f1e13babf50d7a4fe1`; text `285991680e42b584922ff536156d9e0eda50fb2b7a1a31e323ced091dc3bb729`.

Explicit implementation authorization followed both verdicts. Research artifacts remain immutable, including their historical pre-authorization disabled-runtime flags. This candidate is the explicit downstream mapping, not a wholesale import or a claim that research flags themselves proved runtime enforcement.

## Behavior and limitations

- A separate Missouri catalog adds only Lloyd’s Corn Maze/Pumpkin Patch and Sam’s Other Halloween / Fall. Hayride remains supplemental Lloyd metadata. Sam has community trick-or-treat and Halloween games/interpretive activity, no crafts.
- Other is a seasonal chip and participates in Anything only while the seasonal layer is active. It is curated-only: the handler removes it from provider requests and performs zero provider calls for Other-only requests. No new provider selectors or generalized event/park classification. It is not assigned a Scare/Settle role.
- Other temporarily reuses the existing Haunted House icon, with its distinct visible label. Dedicated artwork remains presentation debt; no new assets or branding changes.
- Both have null openingHours plus an explicit never-OpenNow policy. Live duplicates cannot promote weekly hours to a truthful event interval. Advertised activity windows appear as text, not fabricated machine opening intervals.
- Dates use America/Chicago. Exact final activity ends are 2026-10-31 16:00 CDT for Lloyd and 18:00 CDT for Sam. At those instants and in all later years, browse/selection excludes the records. The November 1 06:00 CST archive policy is not extra admission. Exact Lloyd 11 dates and October 31 special hours are retained.
- Existing browse semantics permit upcoming and closed-today seasonal candidates when Open Now is off, with truthful status labels and dated notes. They are planning/discovery options, not a live admission promise.
- Source-scoped schedule, admission, weather, age and arrival notes are rendered on options, result and valid plan overlays. Lloyd retains under-18 supervision, qualified online USD12 + USD1.20 advertised fee, unknown processing/all-in total, USD14 onsite, ages 2 and under free, pumpkins extra and nonrefundability.
- Existing external directions contract uses exact source coordinates. Lloyd’s 38.7746696,-92.2372283 is labeled approximate operator navigation/site arrival, not surveyed gate, driveway edge, stall or doorway. Sam’s 37.259288,-90.505404 is the official lot next to Shelter 1; separate activity locations/hours remain visible. Outbound URLs were tested locally without navigating to Maps or ride services. Physical arrival accuracy is not newly proven.
- Periodic review remains due October 14; Lloyd weather-sensitive visitor check within 24 hours and Sam within 48 hours of event (October 29 14:00 CDT deadline). No live social cancellation, ticket inventory or weather assurance is claimed. Static notes do not perform future revalidation automatically.

## Verification receipts

Final exact-tree local receipts are retained externally and reported alongside the immutable publication SHA/tree/parent. Fresh passes: locked npm installation (506 packages), complete dependency graph, focused tests (7), full repository/application suite (755 passed, four inherited external-documentation skips), typecheck, development build, direct migration-free auth-enabled production build and build-proof, changed-file ESLint, casino audit (883 canonical / 899 serialized / 60 catalog files), and git diff --check. No dependency or lockfile changes. Lock SHA-256 remains `462f09bd3fda35cf30646b2f343cd8d2a65340a63b59222b5f9d57084d9aa4b3`.

Full-repository ESLint is NOT clean: three inherited no-empty errors in two audit probes and `src/lib/app-data/client.server.ts`, plus six inherited warnings. These files are untouched; no unrelated cleanup or suppression.

Browser acceptance remains HOLD, not passed or waived. The committed disposable harness covers both records across Anything/category/Open Now/ended/2027/season-off, repeated options/pick/close, exact outbound link values and narrow mobile layouts with all public network requests intercepted. Local Chromium cannot launch: process_singleton socket EPERM persists after reviewed escalation and a writable temporary profile. The cloud browser cannot open the local test URL: `net::ERR_BLOCKED_BY_CLIENT`. No scenario completed and no screenshot/layout/hydration/browser PASS is claimed. Component-render tests are explicitly not browser proof.

Reproduction, in a usable isolated environment:

1. `npm ci --no-audit --no-fund` and `npm ls --all --json`.
2. `npm run typecheck`; `npm run build:dev`.
3. `VITE_AUTH_ENABLED=true node scripts/browser-build-proof.mjs capture`.
4. `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`.
5. `VITE_AUTH_ENABLED=true node scripts/browser-build-proof.mjs complete`.
6. `env -u VITE_AUTH_ENABLED npm test`; `npm run audit:casinos`.
7. `CI=true VITE_AUTH_ENABLED=true PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/path/to/chromium node scripts/missouri-two-record-browser.mjs`.

Never ordinary `npm run build`: it chains migrations. Browser fixture/server blocks public providers and other external traffic. Do not replace with live Overpass acceptance.

## Release dependencies and next gate

PR #47 (separate `fix/halloween-arrival-hotfix-1`, inspected head `277aca01996b5559b6e520d9d3f193c4989f4f64`) is an explicit release dependency. Protected main already contains Myer’s fallback. This candidate does not add/reintroduce/change it or integrate the hotfix. Existing seasonal catalog/availability entries remain unchanged. A future intentionally combined candidate requires renewed regression, independent and release review; do not merge branches blindly.

The inherited main validation workflow runs npm test before its compiled-security build prerequisite; its CI-order remediation is separate and not imported. Any resulting exact-candidate CI failure must be reported as such, not silently fixed or called green. Existing automatic unsigned Android PR CI may run incidentally; no manual Android build, signing, Play, physical-device acceptance or release is part of this work.

Next: independent review of exact publication SHA/tree/sole parent, whitelist mapping, taxonomy, duplicate/expiry safeguards and receipts; browser acceptance remains an unmet gate until actual successful execution. Then stop for the owner’s scoped integration/release decision. No main merge/push, production deploy/promotion, database migration, config/secret change, paid API, operator contact or additional discovery is authorized.

Rollback before release means leaving this isolated candidate unmerged. No database rollback is needed. There is no production mutation to undo.
