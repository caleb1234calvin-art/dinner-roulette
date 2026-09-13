# Dinner Roulette / Pick For Me — AI Continuity

Updated September 13, 2026 at Caleb’s request **“Lets update the AI continuity”**, after completion of the resumed casino continuation. This refresh changes only `AI_CONTINUITY.md`; it records the final verified state without restarting research, changing application code/data, merging separate work or deploying. The earlier stop was lifted by “Let’s continue what we were doing now.” The exact paused 808-destination continuity is preserved in `audit/ai-continuity-before-casino-continuation-2026-09-13.md`; earlier history remains in the other continuity archives.

**Current status: 857 destinations, validated and promoted to non-production integration.** No main promotion, deployment, database migration or recurring monitoring has occurred in this continuation.

## Latest verified checkpoint

The latest completed checkpoint is **`c7cb8d08d785a689316ec39370b7212dd9071b9b`** on `integration/active-work-pass-1`. [CI Run 319](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34769203422) succeeded at that exact revision: **322 unique tests passed, zero failures, four understood documentation skips**, plus typecheck, catalog audits, both safe builds, all **16 browser check groups** and **30 Dinner icon assets**. Run 319 validates the final seven-document handoff checkpoint following the already validated casino merge.

The persisted continuation diff against `2fd976a4f34f8bbe28db1075a264693d691b8253` contains **27 expected paths, zero unexpected paths and zero deleted files**. The isolated checkout was clean and matched the published integration revision when this refresh began. Main and the separate location/international branch were re-read unchanged. No production/Vercel deployment, migration or recurring monitoring occurred.

This requested continuity refresh follows Run 319 and preserves all application/data/configuration/dependency files. No new live-provider or physical-device validation is claimed for this refresh. Its own documentation commit and CI result are subsequent to the checkpoint above; verify the latest remote ref and Actions result when resuming.

## Working state and authority

- Repository: `caleb1234calvin-art/dinner-roulette`.
- Isolated checkout: `/workspace/scratch/60ab73826fd9/pick-for-me-casino`.
- Current working branch: `integration/active-work-pass-1`. Preserved candidate branch: `integration/casino-continuation-2026-09-13` at `a3cffc654924596fe23a9d0050ac1a056b6751a5`, based on `2fd976a4f34f8bbe28db1075a264693d691b8253`.
- Non-production merge completed as `264bb678362a5e281f16411ef9a7b98bce85a12e` using the expected candidate SHA. Its tree exactly matches the validated candidate. PR #40 is already merged; do not merge it again.
- Main last read unchanged at `c187d518cf8b0c8b9202ee0ae6493667eb4c0ab5`.
- Preserve separate `integration/location-international-2026-09-13` at `4a93870c05ec53bd49fae5143df420c301696839` and its checkout. Its LocationControl work is not merged here. When integrating it later, preserve equivalent visible location-error/manual recovery.
- Earlier RC branch `integration/casino-release-candidate-2026-09-13` and PR #38 remain historical and already integrated. Do not merge them again.
- Broad reversible predeployment work and non-production integration are authorized. Main, production, Vercel/other hosted deployment, migrations, secrets and recurring automation require separate explicit authorization. `vercel.json` still disables Git deployments for `integration/**`.

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

CI Run 316 at `146d8cbfc6440e76b2b26c83bce3567fd3a487e8` passed tests/audits/builds, but its browser did not run: ANSI terminal formatting split the owned preview URL and caused a false startup timeout. Both harnesses now strip that formatting. A local smoke with `NO_COLOR` unset and `FORCE_COLOR=1` confirmed actual ANSI output and all 16 groups passed; subsequent exact-head Runs 317, 318 and 319 passed. The failed attempt is preserved, not counted as a browser pass.

Direct Git push lacked CLI credentials. The existing authorized GitHub connector published the exact validated file tree; no credentials were read or modified. The original local commit was preserved and the checkout reconciled to the published history.

Some research sources failed or returned stale/conflicting addresses, including the Jailhouse direct page, a parked Border Casino domain and inaccurate operator map/address fields. Sidecars retain sufficient alternate current primary/local evidence or a hold. No provider/authentication boundary was bypassed.

## Exact next action and recovery

The casino continuation is complete in non-production integration. Read the current integration ref and its latest CI result before any further action; this continuity-only refresh follows successful Run 319 at `c7cb8d08d785a689316ec39370b7212dd9071b9b`. Preserve the separate location/international work. The exact remaining work is a separately authorized controlled main/hosted release and the served-revision, physical-device, authenticated-account and external Maps acceptance checklist. Further statewide coverage is optional expansion of the explicitly partial scope, not a claim already completed.

## REQUIRES USER AUTHORIZATION

**Main promotion, any hosted/Vercel deployment, production writes/migrations and recurring monitoring require Caleb’s separate explicit authorization.** No such action was taken. The local browser and CI gates described above are complete; unavailable hosted/device/account/Maps checks remain explicitly unclaimed.

Recovery is a reviewed revert of this continuation or restoration of validated non-production base `2fd976a4f34f8bbe28db1075a264693d691b8253`. Preserve branches/history/evidence. No database rollback is needed.

Safe validation includes `npm test`, `npm run typecheck`, `npm run audit:casinos`, `npm run build:dev`, and:

```sh
VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production
```

**Never run `npm run build` as a shortcut: it chains database migrations.**

Preserve Dinner/Nightlife/Date Night/seasonal separation, live mirrors and honest fallback, LEGAL.md/Settings disclosures, all 30 Dinner icons and semantic resolver, Caustic Relay/Mordax identity and startup ident. No unrelated product redesign is authorized.
