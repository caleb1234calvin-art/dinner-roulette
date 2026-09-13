# Dinner Roulette / Pick For Me — AI Continuity

Updated September 13, 2026 after the final casino hold-resolution/coverage pass. **The 883-destination casino dataset is frozen before location/international integration.** The separate location candidate is preserved and was not merged. Main/production are untouched; no Vercel deployment, migration, recurring monitoring or Exa use occurred.

## Active shared handoff and working state

- Read this exact existing file on **caleb1234calvin-art/dinner-roulette → integration/active-work-pass-1 → AI_CONTINUITY.md**. Main intentionally lacks unreleased integration work.
- Local casino checkout: `/workspace/scratch/60ab73826fd9/pick-for-me-casino`; isolated candidate `integration/casino-final-freeze-2026-09-13`, based on `f2fd0f7f4737278126d72b0cc043c79db7652236`. Inspect current branch and dirty state before editing.
- Current local working branch: `integration/casino-freeze-handoff-2026-09-13`. The validated casino candidate branch is preserved.
- Main baseline remains `c187d518cf8b0c8b9202ee0ae6493667eb4c0ab5`.
- Preserve `integration/location-international-2026-09-13` at `4a93870c05ec53bd49fae5143df420c301696839`, draft PR #39. Do not replace current casinos with its older 808-record base.
- Prior casino PRs #38/#40 are historical and already merged into non-production integration; do not merge them again.
- `vercel.json` disables Git deployments for `integration/**`. The validation workflow uses safe builds; the Android/main publishing workflow is not triggered by these branches.
- Pre-freeze continuity is `audit/ai-continuity-before-casino-freeze-2026-09-13.md`; full prior progress and attempts are in `audit/casino-final-freeze-baseline-2026-09-13.json`. Preserve history and all evidence sidecars.

## Latest verified checkpoint

The shared casino handoff at **`3049c28781bd63559c85df6e45d42d071c4a5258`** passed [CI Run 325](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34775943185): **329 unique tests passed, zero failures, four understood external-documentation skips**, plus typecheck, casino/schema/manifest audits, both safe builds, all **16 browser check groups** and **30 Dinner icon assets**. The working tree was clean and matched the published shared revision. The casino implementation was merged through [PR #41](https://github.com/caleb1234calvin-art/dinner-roulette/pull/41); its integration merge `b7b9be79ef7476a5b9497c67e624533fefec1e42` passed Run 324 and has the same tree as the validated candidate.

At Caleb’s request, this subsequent refresh updates **only this existing shared `AI_CONTINUITY.md` on `integration/active-work-pass-1`** to record the completed final checkpoint. Casino data, application code and the separate location/international candidate are unchanged. This refresh follows Run 325; its own documentation commit/CI is subsequent, so verify the current shared ref and Actions result when resuming.


Updated September 13, 2026. **883 canonical destinations / 899 serialized rows / 60 passes.** Nevada **204**, Oklahoma **113**, Colorado **31**, Texas **4**; four-state total **352**. **26 additions in this completion pass** (23 NV + 3 OK), **152 additions from the original 731 baseline**. The 16 superseded historical rows remain preserved.

The finite reviewed casino queue is exhausted under currently available evidence. **Freeze decision A: no meaningful casino work remains from this queue before separate location integration.** Nevada and Oklahoma are substantially expanded, not proven exhaustive statewide. Future evidence can reopen the explicit holds; theoretical completeness is not a release blocker.

## COMPLETED

- Eight original holds reinvestigated; Konawa/Rivermist and Broadway Colt promoted using reconciled property points. Six original holds remain; Off the Rails Lovelock adds one new hold, giving **seven unresolved candidate holds**.
- Pass 59 adds 23 Nevada properties from Truckee/Pioneer Crossing, Pahrump operators, Searchlight, Wildfire, The Greens and verified independents. Pass 60 adds Konawa, Pawnee Trading Post and TeePee Yale. Individual sources and rejected map/address conflicts are in the pass sidecars.
- **No existing canonical record was removed, merged, renamed or repinned in this final pass.** Reviewed live-provider aliases were reconciled. Gold Town Pahrump was classified closed (May 24, 2026) and guarded against stale live tags; no active canonical Gold Town row was removed.
- Two retail exclusions: Seminole Nation Rivermist Retail and O-Gah-Pah Convenience Store, neither supported as a separate gaming floor. One preopening deferral: North Fork Mono, whose announced October opening is not proof of current operation.
- Adversarial review rejected the provisional CTS Thackerville addition because current separate-room scope remains unproven. The draft is retained in the research checkpoint. A live-browser review then exposed closed Southwind and casino-alias leaks; those were corrected and the gates rerun.
- **329 unique tests passed** (278 repository + 51 application), **zero failures**, **four understood external-documentation skips**. The 80 casino tests are included in that total. Typecheck, schema/export/ID/chronology/manifest audits, changed-code lint, 30 Dinner icons, development build and migration-free production build passed.
- Primary and targeted adversarial checks passed: six new nearby pairs retain distinct gaming floors, zero new nearby alias collisions, zero new pairs under 0.075 miles. Historical casino records were reference context, not manually re-researched wholesale.
- No dependency, lockfile, build configuration, migration or location/international implementation change. Vercel Git deployment remains disabled for integration/**.

## Browser and CI

All **16 deterministic local Chromium check groups** passed against the current production-mode build with sign-in rendering enabled. The real-provider browser check passed **six regions** (Reno, Newkirk, Ardmore, Chandler, Pahrump and Pawnee), with **0 final errors and 0 final findings**. Transport recorded 24 Overpass HTTP 200 responses, 2 Nominatim HTTP 200 responses and 12 provider timeouts; honest fallback remains part of the tested behavior. Desktop 1280×800 and mobile viewport 390×844 were exercised. Physical GPS, hosted acceptance, authenticated sessions and external Maps-app launch remain unverified.

Candidate CI Run 323, integration CI Run 324 and shared-handoff CI Run 325 all passed. The latest exact checkpoint and Run 325 link are recorded above. Supporting release artifacts retain the runtime/integration evidence; this shared root file records the later handoff verification.

The first final-pass live run passed its mechanical UI assertions but manual review found stale/duplicate provider names. It is preserved as a diagnostic attempt, not the accepted final browser gate. Captured public OSM entities are replayed by a regression test; the reviewed Newkirk/Pahrump/Pawnee pools have explicit live-browser count checks. Newly appearing live inventory in those finite reviewed pools requires investigation rather than automatic acceptance.

## BLOCKED — exact remaining casino evidence

- **Horseshu — Jackpot** — separate-floor-scope. Recheck only when: Current operator statement or dated floor-specific evidence confirming public gaming at Horseshu itself, plus a named building point; historical hotel/casino labels do not qualify.
- **Moapa Paiute Travel Plaza** — current-gaming-status-and-scope. Recheck only when: Dated tribal/operator confirmation that a public dedicated casino floor is operating, resolving the closed casino listing; then verify the floor's property point.
- **Wigwam Restaurant & Casino — Fernley** — floor-location-and-address. Recheck only when: Operator-confirmed casino building/entrance geometry tying 255/265 W Main and the KML point to the operating floor.
- **Border Inn Casino — Baker** — casino-side-boundary-location. Recheck only when: Casino-building or entrance coordinates with reliable boundary/parcel geometry proving the Nevada gaming side, independently of hotel/RV points.
- **C Punch / Lovelock Junction — Lovelock** — rebrand-and-current-gaming-floor. Recheck only when: Current operator or floor-specific evidence of active public casino gaming at 1420/1440 Cornell, with renamed identity and property point reconciled.
- **Chickasaw Travel Stop Thackerville** — current-separate-gaming-room-scope. Recheck only when: Dated operator confirmation or verifiable current on-site evidence of a separate internal CTS gaming room after the Border Casino expansion, with identity and address distinct from Border Casino.
- **Off the Rails Casino — Lovelock** — current-identity-and-property-point. Recheck only when: Current operator identity and a named casino/building point at 150 Main, or a documented successor/closure; reject generic Lovelock coordinates.

The watchlist has **28 entries**: 18 runtime closure groups, seven candidate holds, two resolved original holds retained as history and one preopening property. Rule groups are not a physical-destination count. No recurring monitoring was created.

## Four legitimate documentation skips

All four are **B: intentionally external by design / A: unavailable in a clean repository-only checkout**. They concern the external OG assistant documentation package, not casino behavior. Their original assertions run when that package is installed; `REQUIRE_WORKSPACE_DOCS=1` fails closed. No skip was removed or weakened.

1. `scripts/brand-check.test.mjs`: “SKILL.md and AGENTS.md name the marker path and bound this script uses”.
2. `scripts/brand-check.test.mjs`: “the sections that own the brand-task prohibition never affirm a wait”.
3. `scripts/brand-check.test.mjs`: “SKILL.md tells the pass to self-check with the flag this CLI accepts”.
4. `scripts/write-atomic.test.mjs`: “every hand-over the og skill prints is one this script accepts”.

## DEFERRED / OPTIONAL

Location/international PR #39 stays separate and unmerged. Physical-phone GPS, installed PWA, hosted/account and external Maps acceptance follow the checklist during a separately authorized release. Further statewide research and dated reopening checks may be resumed when new evidence appears; no continuous monitoring is scheduled.

## Exact next action

Casino work is frozen in non-production integration. The next task is to reconcile draft location/international PR #39 with Pass 55–60 and the current discovery/browser safeguards in a separate working branch, then validate the combined result. Do not restore the location candidate’s older 808-casino data or add the two independent test totals together. No location merge is part of this casino task.

## REQUIRES USER AUTHORIZATION

Main promotion, hosted/Vercel deployment, production writes, database migrations, secrets/credential changes and recurring monitoring require separate explicit authorization. **Main and production remain untouched; no Vercel deployment, database migration, location merge, recurring monitoring or Exa use occurred.**

Recovery: review a non-production revert or restore pre-freeze base `f2fd0f7f4737278126d72b0cc043c79db7652236`, preserving all historical evidence and both candidates. No database rollback is needed. Before a later release, verify the served revision and complete `audit/casino-browser-release-checklist-2026-09-13.md`.

## Evidence / changed files

`audit/casino-final-freeze-2026-09-13.json` records counts, changes, holds, validation, publication and the exact changed-file list. Pass 59/60 evidence sidecars retain source provenance and numerical points. `casino-freeze-adversarial-2026-09-13.json` records new-pair review; `casino-freeze-live-provider-findings-2026-09-13.json` preserves the failed manual acceptance and public provider samples; `casino-freeze-browser-evidence-2026-09-13.json` records the final browser gate. The pre-freeze continuity/progress are archived, not overwritten as history.

Safe commands: `npm test`, `npm run typecheck`, `npm run audit:casinos`, `npm run build:dev` and `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`. **Never use `npm run build`: it chains database migrations.**

## Attempts and limitations

- Facebook/Yelp bodies were login-required or HTTP 403 where recorded; indexed excerpts were not treated as a direct page read.
- Some Firecrawl calls returned INVALID_ARGUMENT; named map retrieval continued through TinyFish. Regulator PDF retrieval failed through TinyFish but succeeded through Parallel.
- Search returned a 2015 NGCB nonrestricted report; it was not treated as a current statewide roster.
- Physical-device, hosted/account and external Maps-app acceptance are unclaimed.

The initial direct provider probe returned HTTP 403 and was not used as verification. Read-only observation of actual application responses supplied the public casino entities for diagnosis. No authentication or provider access restriction was bypassed. Initial live UI assertions missed semantic stale/duplicate names; manual review found them and final validation followed the fixes.

## Location and international discovery — validated separate candidate

**COMPLETED on `integration/location-international-2026-09-13`:** the focused pre-deployment location work is saved in draft PR #39 at `4a93870c05ec53bd49fae5143df420c301696839`. Its original integration base was `a6d38616fe4490ff46b87232cbc7abb82f176926`, with 808 casinos through Pass 54. The current 883-destination/Pass 60 casino freeze is a different validated state. Do not replace the current casino data with that older base or add the two test counts together.

The pre-change audit found that the location button did request coordinates, but discovery waited for reverse lookup and progress/errors were poorly exposed. Dinner also requested GPS automatically on default-location load. Manual Nominatim lookup imposed `countrycodes=us`; the business-provider queries already used worldwide coordinates/radius. There was no provider-level Canada-only blocker to work around.

The candidate implements:

- Shared `LocationControl` for Dinner, Nightlife/casino and Date Night. Geolocation is accessed only after **Use my location** is clicked; valid coordinates immediately become the active persisted origin without manual typing.
- Reverse geocoding enriches the label/metadata while retaining the device point. Failed reverse lookup leaves usable coordinates. Visible progress/success and distinct denied/unavailable/timeout/unsupported errors accompany manual entry and Cancel.
- Newer manual edits, requests, cancellation or unmount invalidate late callbacks. Manual choices and filters persist across reloads; no automatic GPS request is made on reload. Legacy saved U.S. locations remain compatible.
- A general location model with latitude/longitude, label and optional country, ISO country code, region and locality. No required U.S. state/ZIP format or Canada-specific mode. Manual free text is resolved globally without the U.S. filter or an appended U.S. suffix; ambiguous cities/postal codes can include region and country.
- International OSM address fields and coordinate Maps destinations. Existing coordinate/radius discovery and bounded U.S. fallbacks remain. Joplin-only retired-name exclusions are geographically bounded; malformed/provider-error responses are distinguished from legitimate empty results.

**VALIDATED:** [Run 313](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34742834501) passed at runtime/test revision `3560e130a26d3d287aa07ee8b014e54d2448bae6`. The final candidate documentation checkpoint `4a93870c05ec53bd49fae5143df420c301696839` also passed every gate in [Run 314](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34742970533), rechecked during this shared-continuity sync.

- **342 unique tests passed: 273 repository + 69 application; zero failures; four inherited external-documentation skips.** The location work added 28 meaningful tests. These results apply to the location candidate, while the 329-test casino freeze results above apply to the newer casino integration; combined behavior remains to be validated.
- Clean install, typecheck, casino/national audits, development build, production-mode build without migrations, the inherited casino Chromium suite, all 12 location Chromium checks and all 30 Dinner icons passed.
- Nine actual live Nominatim cases resolved: Joplin/Missouri/USA, ZIP 64801, Portland/Oregon/USA, Toronto/Ontario with and without Canada, Vancouver/British Columbia with and without Canada, Montréal/Québec/Canada and London/United Kingdom.
- The existing restaurant Overpass adapter returned live results in Toronto, Vancouver and Montréal. Provider observations at a one-mile radius were 1,671, 360 and 1,014 normalized rows respectively, each HTTP 200 from the first configured mirror. These are observed OSM rows, not complete inventories, filtered eligible counts or proof that every business is open.
- Regression coverage includes U.S./Canadian/U.K. inputs, province/country handling, missing regions, invalid locations, international addresses, provider errors/empty results/fallbacks, maps, filters, persistence and all three discovery categories.
- Actual local Chromium used the real app/RPC, simulated native coordinates and deterministic provider fixtures. The 12 checks covered explicit-action GPS, immediate origin use in discovery, manual override/races, persistence, all three modes, maps, error feedback and 390px layout with no uncaught page errors. Error callbacks were explicitly mocked. Both local development and built-preview modes passed; CI uses the built preview.

**BLOCKED / REQUIRES BROWSER OR DEVICE VALIDATION:** physical-phone GPS, actual Android/iOS permission dialogs, installed PWA, hosted acceptance and external Maps-app navigation are unverified. Native Chromium geolocation with simulated coordinates is not physical-device proof. The exact ten-step device checklist is in the pinned location handoff below.

**DEFERRED:** PR #39 needs reconciliation with the newer Pass 55–60 integration and its sign-in-enabled, owned-preview browser safeguards. The old candidate's green CI does not establish combined compatibility. Preserve both sets of tests and the newer casino data/closure rules; resolve overlaps in location controls, discovery, browser harnesses, workflow and continuity, then rerun relevant tests/builds/browser gates before any non-production promotion. This casino completion task does not perform that integration. Main/hosted/production deployment remains separately unauthorized.

**OPTIONAL / FUTURE:** destination-timezone-aware Open now, localized labels, metric/currency preferences, ambiguous-result selection and additional country coverage. The existing opening-hours evaluator uses the viewer's browser timezone, so remote searches do not guarantee destination-local Open now correctness. Public Nominatim/Overpass availability remains best effort; provider caching/request coordination can be considered later. No background polling or recurring automation was added.

Pinned records from the validated location candidate (these files are not yet present on integration):

- [LOCATION_HANDOFF.md](https://github.com/caleb1234calvin-art/dinner-roulette/blob/4a93870c05ec53bd49fae5143df420c301696839/LOCATION_HANDOFF.md): complete architecture changes, limits, validation commands, all 30 changed paths and the device checklist.
- [Original location architecture audit](https://github.com/caleb1234calvin-art/dinner-roulette/blob/4a93870c05ec53bd49fae5143df420c301696839/audit/location-architecture-2026-09-13.md): actual pre-edit flow and geographic assumptions.
- [Location validation evidence](https://github.com/caleb1234calvin-art/dinner-roulette/blob/4a93870c05ec53bd49fae5143df420c301696839/audit/location-validation-2026-09-13.json): live-provider samples, exact tests, browser limits and CI history. Runs 311/312 exposed harness-readiness issues; they are not counted as passes. The built-preview correction retained all assertions, and Runs 313/314 passed.

This shared root file remains the first read for future sessions. The location branch's older AI continuity is historical context for that candidate and must not supersede this newer combined handoff.
