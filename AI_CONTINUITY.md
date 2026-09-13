# Dinner Roulette / Pick For Me — AI Continuity

Updated September 13, 2026 at Caleb’s request to add the completed location/international update to **the AI continuity we have been using**. This refresh changes only this shared `AI_CONTINUITY.md`. It preserves the newer casino continuation and records the separately validated location candidate, exact evidence and remaining integration/device work. The earlier casino stop was lifted by “Let’s continue what we were doing now.” The paused 808-destination continuity is preserved in `audit/ai-continuity-before-casino-continuation-2026-09-13.md`; earlier history remains in the other continuity archives.

**Current status: the 857-destination casino continuation is validated in non-production integration; the location/international update is validated separately in draft PR #39 and has not been merged.** This documentation sync does not combine their application code. No main promotion, deployment, database migration or recurring monitoring occurred.

## Shared handoff location

The active shared handoff is this existing root file: **`caleb1234calvin-art/dinner-roulette` → `integration/active-work-pass-1` → `AI_CONTINUITY.md`**. Future sessions should read it with that branch explicitly selected. Main intentionally does not contain these unreleased integration updates. The `audit/ai-continuity-*.md` files are historical snapshots; preserve them as history.

## Latest verified checkpoint

This sync starts from shared integration continuity revision **`8f6996322e25f51dabe2abd712ba6503fa899c58`**. The most recent casino checkpoint with a CI result recorded in this handoff is **`c0847e265985565b88bae980f412385cd2c2502d`** on `integration/active-work-pass-1`. [CI Run 320](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34771586726) succeeded at that exact revision: **322 unique tests passed, zero failures, four understood documentation skips**, plus typecheck, catalog audits, both safe builds, all **16 browser check groups** and **30 Dinner icon assets**. Run 320 validates the preceding continuity-only update. The earlier seven-document release handoff at `c7cb8d08d785a689316ec39370b7212dd9071b9b` passed [Run 319](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34769203422).

The persisted continuation diff against `2fd976a4f34f8bbe28db1075a264693d691b8253` contains **27 expected paths, zero unexpected paths and zero deleted files**. The isolated checkout was clean and matched the published integration revision when this refresh began. Main and the separate location/international branch were re-read unchanged. No production/Vercel deployment, migration or recurring monitoring occurred.

This requested continuity refresh follows Run 320 and preserves all application/data/configuration/dependency files. No new live-provider or physical-device validation is claimed for this refresh. Its own documentation commit and CI result are subsequent to the checkpoint above; verify the latest remote ref and Actions result when resuming.

## Working state and authority

- Repository: `caleb1234calvin-art/dinner-roulette`.
- Casino implementation checkout: `/workspace/scratch/60ab73826fd9/pick-for-me-casino`. This shared-continuity-only sync uses `/workspace/scratch/4f145fb168ea/pick-for-me-continuity`; the separate location checkout remains `/workspace/scratch/4f145fb168ea/pick-for-me`. Check the current branch and dirty state before editing any checkout.
- Current working branch: `integration/active-work-pass-1`. Preserved candidate branch: `integration/casino-continuation-2026-09-13` at `a3cffc654924596fe23a9d0050ac1a056b6751a5`, based on `2fd976a4f34f8bbe28db1075a264693d691b8253`.
- Non-production merge completed as `264bb678362a5e281f16411ef9a7b98bce85a12e` using the expected candidate SHA. Its tree exactly matches the validated candidate. PR #40 is already merged; do not merge it again.
- Main last read unchanged at `c187d518cf8b0c8b9202ee0ae6493667eb4c0ab5`.
- Preserve separate `integration/location-international-2026-09-13` at `4a93870c05ec53bd49fae5143df420c301696839` and its checkout. [PR #39](https://github.com/caleb1234calvin-art/dinner-roulette/pull/39) is open, draft and unmerged; GitHub reported it non-mergeable at this sync. Its LocationControl work is not merged here. Future integration must reconcile the newer casino changes, preserve visible error/manual recovery and rerun the combined gates.
- Earlier RC branch `integration/casino-release-candidate-2026-09-13` and PR #38 remain historical and already integrated. Do not merge them again.
- Do not use Exa unless Caleb explicitly authorizes it in a later task. No Exa was used for the location work.
- Broad reversible predeployment work and non-production integration are authorized. Main, production, Vercel/other hosted deployment, migrations, secrets and recurring automation require separate explicit authorization. `vercel.json` still disables Git deployments for `integration/**`.

## Location and international discovery — validated separate candidate

**COMPLETED on `integration/location-international-2026-09-13`:** the focused pre-deployment location work is saved in draft PR #39 at `4a93870c05ec53bd49fae5143df420c301696839`. Its original integration base was `a6d38616fe4490ff46b87232cbc7abb82f176926`, with 808 casinos through Pass 54. The later 857-destination/Pass 58 casino continuation is a different validated state. Do not replace the current casino data with that older base or add the two test counts together.

The pre-change audit found that the location button did request coordinates, but discovery waited for reverse lookup and progress/errors were poorly exposed. Dinner also requested GPS automatically on default-location load. Manual Nominatim lookup imposed `countrycodes=us`; the business-provider queries already used worldwide coordinates/radius. There was no provider-level Canada-only blocker to work around.

The candidate implements:

- Shared `LocationControl` for Dinner, Nightlife/casino and Date Night. Geolocation is accessed only after **Use my location** is clicked; valid coordinates immediately become the active persisted origin without manual typing.
- Reverse geocoding enriches the label/metadata while retaining the device point. Failed reverse lookup leaves usable coordinates. Visible progress/success and distinct denied/unavailable/timeout/unsupported errors accompany manual entry and Cancel.
- Newer manual edits, requests, cancellation or unmount invalidate late callbacks. Manual choices and filters persist across reloads; no automatic GPS request is made on reload. Legacy saved U.S. locations remain compatible.
- A general location model with latitude/longitude, label and optional country, ISO country code, region and locality. No required U.S. state/ZIP format or Canada-specific mode. Manual free text is resolved globally without the U.S. filter or an appended U.S. suffix; ambiguous cities/postal codes can include region and country.
- International OSM address fields and coordinate Maps destinations. Existing coordinate/radius discovery and bounded U.S. fallbacks remain. Joplin-only retired-name exclusions are geographically bounded; malformed/provider-error responses are distinguished from legitimate empty results.

**VALIDATED:** [Run 313](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34742834501) passed at runtime/test revision `3560e130a26d3d287aa07ee8b014e54d2448bae6`. The final candidate documentation checkpoint `4a93870c05ec53bd49fae5143df420c301696839` also passed every gate in [Run 314](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34742970533), rechecked during this shared-continuity sync.

- **342 unique tests passed: 273 repository + 69 application; zero failures; four inherited external-documentation skips.** The location work added 28 meaningful tests. These results apply to the location candidate, while the 322-test results below apply to the newer casino integration; combined behavior remains to be validated.
- Clean install, typecheck, casino/national audits, development build, production-mode build without migrations, the inherited casino Chromium suite, all 12 location Chromium checks and all 30 Dinner icons passed.
- Nine actual live Nominatim cases resolved: Joplin/Missouri/USA, ZIP 64801, Portland/Oregon/USA, Toronto/Ontario with and without Canada, Vancouver/British Columbia with and without Canada, Montréal/Québec/Canada and London/United Kingdom.
- The existing restaurant Overpass adapter returned live results in Toronto, Vancouver and Montréal. Provider observations at a one-mile radius were 1,671, 360 and 1,014 normalized rows respectively, each HTTP 200 from the first configured mirror. These are observed OSM rows, not complete inventories, filtered eligible counts or proof that every business is open.
- Regression coverage includes U.S./Canadian/U.K. inputs, province/country handling, missing regions, invalid locations, international addresses, provider errors/empty results/fallbacks, maps, filters, persistence and all three discovery categories.
- Actual local Chromium used the real app/RPC, simulated native coordinates and deterministic provider fixtures. The 12 checks covered explicit-action GPS, immediate origin use in discovery, manual override/races, persistence, all three modes, maps, error feedback and 390px layout with no uncaught page errors. Error callbacks were explicitly mocked. Both local development and built-preview modes passed; CI uses the built preview.

**BLOCKED / REQUIRES BROWSER OR DEVICE VALIDATION:** physical-phone GPS, actual Android/iOS permission dialogs, installed PWA, hosted acceptance and external Maps-app navigation are unverified. Native Chromium geolocation with simulated coordinates is not physical-device proof. The exact ten-step device checklist is in the pinned location handoff below.

**DEFERRED:** PR #39 needs reconciliation with the newer Pass 55–58 integration and its sign-in-enabled, owned-preview browser safeguards. The old candidate's green CI does not establish combined compatibility. Preserve both sets of tests and the newer casino data/closure rules; resolve overlaps in location controls, discovery, browser harnesses, workflow and continuity, then rerun relevant tests/builds/browser gates before any non-production promotion. This continuity request does not perform that integration. Main/hosted/production deployment remains separately unauthorized.

**OPTIONAL / FUTURE:** destination-timezone-aware Open now, localized labels, metric/currency preferences, ambiguous-result selection and additional country coverage. The existing opening-hours evaluator uses the viewer's browser timezone, so remote searches do not guarantee destination-local Open now correctness. Public Nominatim/Overpass availability remains best effort; provider caching/request coordination can be considered later. No background polling or recurring automation was added.

Pinned records from the validated location candidate (these files are not yet present on integration):

- [LOCATION_HANDOFF.md](https://github.com/caleb1234calvin-art/dinner-roulette/blob/4a93870c05ec53bd49fae5143df420c301696839/LOCATION_HANDOFF.md): complete architecture changes, limits, validation commands, all 30 changed paths and the device checklist.
- [Original location architecture audit](https://github.com/caleb1234calvin-art/dinner-roulette/blob/4a93870c05ec53bd49fae5143df420c301696839/audit/location-architecture-2026-09-13.md): actual pre-edit flow and geographic assumptions.
- [Location validation evidence](https://github.com/caleb1234calvin-art/dinner-roulette/blob/4a93870c05ec53bd49fae5143df420c301696839/audit/location-validation-2026-09-13.json): live-provider samples, exact tests, browser limits and CI history. Runs 311/312 exposed harness-readiness issues; they are not counted as passes. The built-preview correction retained all assertions, and Runs 313/314 passed.

This shared root file remains the first read for future sessions. The location branch's older AI continuity is historical context for that candidate and must not supersede this newer combined handoff.

## COMPLETED

[PR #40](https://github.com/caleb1234calvin-art/dinner-roulette/pull/40) was merged only into `integration/active-work-pass-1` as `264bb678362a5e281f16411ef9a7b98bce85a12e`. Candidate `a3cffc654924596fe23a9d0050ac1a056b6751a5` passed [Run 317](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34768716664); the identical integration tree passed [Run 318](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34768849482). Both ran 322 unique tests with zero failures and four understood documentation skips, plus typecheck, catalog audits, both safe builds, 16 browser check groups and 30 icon assets. The subsequent seven-document checkpoint `c7cb8d08d785a689316ec39370b7212dd9071b9b` also passed [Run 319](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34769203422). This current refresh updates only this continuity file and does not claim its own future commit SHA or CI result.

Catalog: **857 canonical destinations from 873 serialized rows across 58 registered passes**. NV **181**, OK **110**, CO **31**, TX **4**; four-state total **326**. The 16 superseded historical rows are deliberately preserved and reconciled. Nevada/Oklahoma remain pending statewide completeness with expected counts null; the 39 other manifest jurisdictions retain prior scope classifications, not a new exhaustive survey.

Passes 55–58 add **49 destinations** (11 NV; 12 OK; 12 NV; then 12 NV + 2 OK). Total additions since the original 731 baseline are **126**. No existing canonical record was removed, merged, renamed or repinned in this continuation. Earlier three pin and two address corrections remain intact.

Nugget Group, Alamo, Pilot/Roadhouse/Lucky’s, 7 Clans and relevant Chickasaw operator rosters were investigated and reconciled. Already represented travel centers were matched to their casino destinations. Current identity/status/address/property-point evidence and rejected conflicts are preserved in the four Pass 55–58 sidecars.

Prairie Sun’s dated operator closure effective May 14, 2023 is now a bounded stale-live suppression rule. Prairie Moon stays active. Runtime closure groups: **17**. Prepared watchlist: **25 entries**, including all eight curated scope/coordinate holds. No recurring monitor exists.

Actual export/schema/IDs/state/chronology/manifest audits passed. The adversarial pass reviewed **81 canonical pairs within 0.075 miles** and **all 16 new-involved pairs within 0.35 miles**. The latter are separate destinations; no nearby canonical pair collides under the reviewed alias policy.

Relevant runtime fix: denied, unavailable or failed geolocation shows a visible alert and opens manual location recovery. Only an actual permission-denied error claims permission denial; repeated requests are disabled while busy. This defect was found in the initial real-browser check and fixed before the final 857-destination checks.

Validation:

- **322 unique tests passed: 271 repository + 51 application; 0 failures; 4 understood documentation skips.** The **73 casino regressions are included**, not additional tests. Eight new tests protect the continuation’s evidence, routing, aliases, separate floors, cross-state identities and closure behavior.
- Clean dependency install, typecheck, targeted ESLint of all 11 changed JS/TS/TSX files, dependency tree and 30 Dinner icon assets passed.
- `npm audit --omit=dev` reported zero known production-dependency vulnerabilities in this snapshot. No package manifest, lockfile or dependency version changed in this continuation.
- Development and production-mode builds passed without migrations. Production build/browser checks also passed explicitly with `VITE_AUTH_ENABLED=true`; local dev/build auth invariants passed both true and false. Tracked development default remains unchanged; CI production build/browser steps now explicitly enable sign-in.
- Targeted changed-file secret scan found no matches. This is not a full repository-history scan.
- Primary and adversarial audit evidence, status watchlist, coverage and browser release checklist are current.

## Browser checks actually completed

Local execution is now available. Chromium **153.0.8010.0**, driven by Playwright, tested the final 857-destination production-mode build with sign-in enabled.

The guarded deterministic-outage browser smoke passed **16 check groups** on desktop 1280×800 Reno and mobile viewport 390×844 Newkirk: first-run tour, Casino, strict-open unknown-hours empty behavior, current compiled fallback counts (19/3), unique options, selection/reroll/exclusion, exact Maps href/security attributes, manual recovery after denial, manual provider/empty state, Favorites empty state, Dinner/Date Night/Settings, no page errors/overflow.

A separate localhost-only real-provider harness passed Reno, Newkirk, Ardmore and Chandler with **zero errors/findings**. Reno/Newkirk used honest fallback; Ardmore/Chandler returned live/merged results. Observed transport: **16 Overpass HTTP 200 responses, two Nominatim HTTP 200 responses and nine provider timeouts**. Native Chromium permission/coordinate emulation covered granted/denied geolocation; manual real Nominatim lookup succeeded. This does not claim physical GPS.

Both harnesses require their own preview process, strict port and current catalog count; they cannot silently accept an unrelated/stale server. An intentional busy-port negative test failed closed as expected. Processes are cleaned up by their owning harness.

Evidence: `audit/casino-continuation-browser-evidence-2026-09-13.json`. Generated screenshots/logs under `audit/browser-results/` are ignored by Git; representative desktop result/mobile options screenshots were visually reviewed.

Not run: hosted acceptance, physical iOS/Android GPS/Maps, actual external Maps-app navigation, authenticated account flow. Sign-in-enabled rendering is not proof of an authenticated session. Exact release checklist remains in `audit/casino-browser-release-checklist-2026-09-13.md`.

## Evidence and decisions to preserve

- Pass 55 operator-linked Google My Maps KML contains named Placemark property points in longitude/latitude order. Do not substitute map viewports. Fernley Nugget uses current 1190 E Main, not legacy 1130. Wigwam’s nearby restaurant/building point did not clear its casino routing hold.
- Casino Oklahoma uses **35.524263,-98.348493**, **220 E Cummins St, Hinton**. Named property/building corroboration rejects a downtown directory point and operator map viewport near Sugar Creek.
- Chilocco **12901 N Highway 77** is distinct from First Council **12875**. Red Rock’s 8401 Highway 177 property matches Lil Bit of Paradise Casino 2; it is separate from main Paradise. Never add a generic 7 Clans alias.
- Golden Eagle Apache, OK and the same-name Kansas casino remain distinct.
- Big Wheel Battle Mountain uses **725 Hilltop**, **40.61979,-116.915238**. Broad search returned a different Lovelock property; it was rejected.
- Diamond’s uses operator-confirmed **1010 E 6th St, Reno**, not the unconfirmed 4th Street draft. The draft was corrected before promotion.
- Elko Roadhouse uses **1165 E Jennings Way #102**. Operator roster’s copied Winnemucca 4400 Rim Rock address was rejected using the mapped building, local tourism and suite evidence.
- Pilot/Roadhouse/Lucky’s are dedicated operator-described gaming floors, not gas stations promoted solely from broad gambling keywords. Casino-component aliases reconcile only nearby the correct property.
- Davis West CTS uses **33967 N County Rd**, separate from Treasure Valley east of I-35. Ada West uses **201 Latta Rd**. Final directions destinations, not viewport centers, control points.
- Prairie Sun’s operator announcement supersedes stale tourism. Prairie Moon’s current operator activity supports active status. Golden Pony’s widely returned reopening article is from 2020, not evidence of a new reopening.
- Keep earlier Oneida Airport/IMAC, Soaring Eagle Slot Palace, Quapaw replacement, Grand Lake casino/lodge, Montego Bay/Wendover and Cadence decisions recorded in prior evidence. Do not undo them based on generic map hits.

## Four legitimate skips

All four concern intentionally external OG assistant documentation absent from a clean Git checkout. Each is **B: external by design / A: unavailable in repository-only execution**. Assertions execute if the package is installed; `REQUIRE_WORKSPACE_DOCS=1` fails closed. Existing installed/required contract meta-tests passed. No casino check is skipped.

1. `scripts/brand-check.test.mjs`: “SKILL.md and AGENTS.md name the marker path and bound this script uses”.
2. Same file: “the sections that own the brand-task prohibition never affirm a wait”.
3. Same file: “SKILL.md tells the pass to self-check with the flag this CLI accepts”.
4. `scripts/write-atomic.test.mjs`: “every hand-over the og skill prints is one this script accepts”.

Do not fabricate external files or remove skips cosmetically.

## BLOCKED

Held outside the curated pool pending specific evidence: Konawa/Rivermist numerical point; Horseshu separate gaming floor; Moapa current gaming scope; Wigwam property/floor point; Broadway Colt casino versus travel/RV point; Border Inn casino-side NV/UT boundary point; C Punch/Lovelock Junction current gaming-floor status; CTS Thackerville separate gaming-room scope. Exact sources/recheck triggers are in the coverage/watchlist artifacts.

Hosted, authenticated-account, physical-device and external Maps-app acceptance remain unavailable or unauthorized here; local desktop/mobile-viewport and real-provider validation are completed.

## DEFERRED

Statewide NV/OK completeness is not asserted. The newly resolved named clusters and remaining holds are explicit in `audit/casino-rc-coverage-2026-09-13.json`. Continued independent regulatory-roster reconciliation and separate Big Wheel Lovelock verification may expand future scope; no weakly supported destination was added for count.

Full historical secret scanning, fresh geocoding of every nationwide property and unrelated dependency upgrades are outside this focused continuation.

## OPTIONAL / FUTURE

The 25-entry watchlist is prepared for separately authorized status checks, with triggers distinguishing reopenings from scope/location uncertainty and permanently retired predecessors. No recurring automation was created. Routine CI action-runtime deprecation maintenance and further coverage research can follow separately.

## Attempts and limitations

Agent-browser Chromium installation failed with UnknownIssuer and its daemon failed twice. TLS validation was preserved. Playwright successfully used an already installed trusted Chromium package at `/workspace/scratch/60ab73826fd9/browser-engine/chromium`; no dependency was added to the repository.

A standalone auth probe without its required local dev endpoint was indeterminate, not a pass. Subsequent probes against the owned dev server passed with auth disabled and enabled. Initial targeted lint reported two harness issues; both were fixed and final targeted lint passed. The baseline live-browser hidden-location-error finding was fixed and final updated-build runs passed. Busy-port failure was an intentional negative test, not an unexplained release failure.

CI Run 316 at `146d8cbfc6440e76b2b26c83bce3567fd3a487e8` passed tests/audits/builds, but its browser did not run: ANSI terminal formatting split the owned preview URL and caused a false startup timeout. Both harnesses now strip that formatting. A local smoke with `NO_COLOR` unset and `FORCE_COLOR=1` confirmed actual ANSI output and all 16 groups passed; subsequent exact-head Runs 317, 318, 319 and 320 passed. The failed attempt is preserved, not counted as a browser pass.

Direct Git push lacked CLI credentials. The existing authorized GitHub connector published the exact validated file tree; no credentials were read or modified. The original local commit was preserved and the checkout reconciled to the published history.

Some research sources failed or returned stale/conflicting addresses, including the Jailhouse direct page, a parked Border Casino domain and inaccurate operator map/address fields. Sidecars retain sufficient alternate current primary/local evidence or a hold. No provider/authentication boundary was bypassed.

## Supporting release records

Read these existing files from the same integration branch when details are needed:

- `audit/casino-release-readiness-2026-09-13.md`: release gate, validated scope and recovery guidance.
- `audit/casino-rc-progress-2026-09-13.json`: changes, exact test/skip reasons, earlier CI attempts and the validated integration merge.
- `audit/casino-rc-coverage-2026-09-13.json`: Nevada/Oklahoma decisions and remaining coverage scope.
- `audit/casino-status-watchlist-2026-09-13.json`: all 25 prepared status/hold records and recheck triggers; no recurring monitoring.
- `audit/casino-continuation-browser-evidence-2026-09-13.json`: actual local/CI browser evidence and limits.
- `audit/casino-browser-release-checklist-2026-09-13.md`: the exact hosted/device/account/Maps checks still required during an authorized release.

Those supporting records retain the validated casino implementation and merge evidence. This continuity file records the subsequent documentation checkpoints; no new application changes are implied by those later CI runs.

## Exact next action and recovery

The casino continuation is complete in non-production integration. Read the current integration ref and its latest CI result before any further action; this continuity-only refresh follows successful Run 320 at `c0847e265985565b88bae980f412385cd2c2502d`. Preserve the separate location/international work. If the next release includes the location update, first reconcile draft PR #39 with the newer casino integration and validate the combined result. A separately authorized controlled main/hosted release and the served-revision, physical-device, authenticated-account and external Maps acceptance checklist follow that preparation. Further statewide coverage is optional expansion of the explicitly partial scope, not a claim already completed.

## REQUIRES USER AUTHORIZATION

**Main promotion, any hosted/Vercel deployment, production writes/migrations and recurring monitoring require Caleb’s separate explicit authorization.** No such action was taken. The local browser and CI gates described above are complete; unavailable hosted/device/account/Maps checks remain explicitly unclaimed.

Recovery is a reviewed revert of this continuation or restoration of validated non-production base `2fd976a4f34f8bbe28db1075a264693d691b8253`. Preserve branches/history/evidence. No database rollback is needed.

Safe validation includes `npm test`, `npm run typecheck`, `npm run audit:casinos`, `npm run build:dev`, and:

```sh
VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production
```

**Never run `npm run build` as a shortcut: it chains database migrations.**

Preserve Dinner/Nightlife/Date Night/seasonal separation, live mirrors and honest fallback, LEGAL.md/Settings disclosures, all 30 Dinner icons and semantic resolver, Caustic Relay/Mordax identity and startup ident. No unrelated product redesign is authorized.
