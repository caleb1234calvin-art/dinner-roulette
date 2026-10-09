# Missouri 2026 — candidate5 release brief draft

**VALIDATION IN PROGRESS — NOT YET VERIFIED CANDIDATE READY FOR OWNER RELEASE DECISION.** Current-head local gates and automated Android readiness PASS. Hosted web/browser/geometry and final runtime evidence review remain pending. Independent source/harness delta review has passed its stated scope. This document does not authorize merge, deployment, signing or publication.

PR: [#60](https://github.com/caleb1234calvin-art/dinner-roulette/pull/60), draft. Branch: `integration/missouri-astra-push-2026-10-09`. Authoritative clean checkout: `repo-verified`.

| Immutable identity | Value |
|---|---|
| Current candidate SHA | `f767a8d2e8c6ffe1120dd5f1bb73d9215b8dfafd` |
| Current candidate tree | `fdfbf4045ea69f7a9b610a434243fc43f2c9f338` |
| Parent | `a44e70996bc8546f75dc71e4af13c414350ec1f9` |
| Production/main source baseline | `979d83aede9d66163e1ebaed9ad5b219cb637882` |
| Baseline tree | `a7dbb32947c0a0daf4864346b0d212477fc9a11b` |

Verified ancestry: `979d83aede9d66163e1ebaed9ad5b219cb637882` → `bb7f36123c5035a36676e98acb1b9ab4fe599955` → `4513aee7de0afe55e0f0fa061c1ec5f6af4fa412` → `7e6f26e55f85e85e232b2ff0f2e2e16e08676885` → `a44e70996bc8546f75dc71e4af13c414350ec1f9` → `f767a8d2e8c6ffe1120dd5f1bb73d9215b8dfafd`. There are 32 changed paths versus the baseline, listed below. Parent delta is only `scripts/seasonal-ten-record-browser.mjs`, with eight lines inserted and one deleted.

20 additions bring the curated inventory from 32 to 52: the original eleven, four commercial re-clearances and five statewide discoveries. All original eleven remain included; zero of those eleven expired or were rejected. All 20 additions and previous 32 factual/presentation records are unchanged by the latest correction. Zero runtime enrichments; two independently reviewed additions remain evidence-only. Six commercial HOLDs, eight delta HOLDs, five separate residential/uncertain-classification leads and unchanged earlier decisions remain documented below. Cadaver Zone remains factual/runtime HOLD.

## Current validation gates — exact candidate5 only

| Gate | Current exact-head status |
|---|---|
| Repository / application / aggregate tests | **947 repository PASS / 4 SKIP; 71 application PASS; aggregate 1,018 PASS / 0 FAIL / 4 SKIP** |
| Lint errors / inherited warnings | **0 errors / 6 inherited warnings** |
| Typecheck | **PASS** |
| Auth-enabled migration-free production build | **PASS; authentication enabled, migrations not run** |
| Independent bounded source/harness delta attestation | **PASS**, with final runtime verdict still **HOLD pending full exact-head gates** |
| Hosted web | [37894492761](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/37894492761): **ACTIVE; final conclusion PENDING** |
| Ten-record / completeness / cumulative browser suites | **PENDING exact-head artifact results and counts** |
| New eleven / extra nine / previous32 receipt suites | **PENDING exact-head artifact results and counts** |
| Ordinary Date Night / smoke / location regressions | **PENDING exact-head artifact results and counts** |
| Card geometry / narrow-mobile / Details reachability | **PENDING exact-head result and count** |
| Final independent hosted-artifact/runtime acceptance | **PENDING** |
| Hosted Android | [37894492778](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/37894492778): **SUCCESS**, job `113702618918`; signing job **SKIPPED** |
| Current Android artifact identity, checksum and independent review | **PASS for exact-head automated integrity/readiness scope**, with physical-device/signing/publication HOLDs unchanged |

Current-head local receipt: `Candidate5-Local-Gates.json`, SHA256 `b0594ba11602a4a87f6a46c15700b0748fd04cadfb6a337a609bbcccbd20b331`, checked `2026-10-09T06:43:09.708201+00:00`. Source digest `a7613459eef6aac9cb20e9566484583a428562b5eb43e9fbc3ad8bb02bd4f84a` across 468 files; output digest `2e43107aaae5cf866d87d31517e4fabcef87672e893dad8b3e5db6191196185b` across 194 files. These results are bound to candidate5, not inherited from its predecessor.

The four current skips are documentation-contract checks explicitly marked “External workspace OG documentation package is not installed in this checkout.” They concern marker/prohibition/self-check/handoff documentation and are not seasonal/runtime scenarios. The current test log was inspected; all four reasons remain recorded.

Checkout integrity PASS: a fresh complete `repo-verified` clone has a clean exact tree and `git fsck` connectivity PASS, without borrowed object storage. The earlier checkout’s borrowed object store vanished; working files were preserved. No product or source correction was needed.

Latest canonical checkpoint: `8218fa693cb4879393eeb12443028d9ebb795caf`, published and read back by root after the exact-head Android PASS gate. It supersedes the local-PASS checkpoint `8f15c182b814d67f3865083b80c9f042e5836110`. Web/browser/geometry remain pending; the final release-decision continuity SHA remains reserved for root.

## Current exact-head Android PASS

Run `37894492778`, job `113702618918`: **SUCCESS**. Signing job skipped. Independent report `Android-Artifact-Independent-f767a8d.json`, SHA256 `8a4857f3bc0123b41fbe5b3c7e35e89c129ad3bfa03e17bae91f8ed0308426f8`.

| Current artifact | Identity / checksum |
|---|---|
| Validation ZIP | Artifact `11600235442`; 6,866,410 bytes; SHA256 `4af9f645307906614108c88245e4a1d77841c753a474862cc833eab58c6b9de5` |
| Raw lint ZIP | Artifact `11599574262`; 24,070 bytes; SHA256 `5ed861a9a56acb7d01f3041f681bb89b34892decec4d8be147bd110ef4c80c36` |
| Unsigned AAB | SHA256 `4cead0e51c28e90e5a0d42149e3952690d19a4f61f05bae1cacf55c6c3b5e4ee` |
| Current debug APK | SHA256 `179628036ab5b5715c09a53bc9ad97c23a4bb9ea4c900fcf0d91d3aa790b7107` |

Root and independent reviewer verified both ZIP CRCs, internal exact `f767a8d2` source revision and payload checksums. Manifest and bundletool checks PASS; the validation AAB remains unsigned and the missing-release-key guard rejects signing. Raw lint XML matches its summary: 14 preserved warnings, 0 errors. The full Android job log is saved.

Manifest: `com.calebcalvin.pickforus`, versionCode 1/versionName 1.0.0, minimum SDK 24, target/compile SDK 36; non-debuggable, backup disabled, cleartext disabled. No native `.so` libraries are packaged. This is automated readiness of a remote HTTPS wrapper, not a branch-web snapshot or physical-device/WebView/GPS acceptance. Upload signing, Play Console acceptance and Android publication remain HOLD and unperformed.

Current web run `37894492761`, job `113702618075`, was still active at seasonal completeness V1 in root’s latest readback. Final browser/geometry counts and final independent runtime verdict remain pending.

## Current bounded correction and independent source finding

`Independent-Delta-Attestation-f767a8d.json`, SHA256 `ae5b815c064cd556405c5059fb8f2de4fc8cab83fe73480cd8271d3ba8463052`, verifies the clean candidate5 checkout, exact ancestry and unchanged `src`, `server`, `public`, `audit` and `.github` subtrees. The frozen previous32 receipt blob remains `29898a1638541c617b4c3fa8f08d2239715def98`, bound to production source `979d83aede9d66163e1ebaed9ad5b219cb637882`. The earlier independent source/policy review carries only across those proven identical objects; no prior browser, geometry or Android PASS count carries as a candidate5 result.

The correction preserves exact Directions equality and derives its expected destination from the independently frozen `directionsTarget`, including required first check-in routing. Visitor-address targets compare their supported address; verified-point targets compare target coordinates. It additionally requires an immutable receipt, validates target kind, and records expected/actual/source-commit evidence. Precision, consumer text, post-reload Directions, no-RPC, saved rating/preferences, review revision, canonical identity and previous32 invariance assertions remain. No product, venue, routing, provenance or consumer copy changed. No test assertion was weakened.

## Preserved candidate attempts

| Candidate / exact SHA | Hosted runs | Observed outcome / status |
|---|---|---|
| Candidate1: `bb7f36123c5035a36676e98acb1b9ab4fe599955` | Web `37887765459`; Android `37887765470` | Both failed two stale saved-coverage expectations before browser execution. Aurora legitimately adds saved corn-maze coverage within the unchanged 50-mile Carthage fixture; exact identity/point/distance/category/provenance expectations corrected without product change. |
| Candidate2: `4513aee7de0afe55e0f0fa061c1ec5f6af4fa412` | Web `37888059004`; Android `37888058961` | Web failed three notice-scope browser assertions. Correct screenshots/state proved two legitimate nearby cards each had one notice; the global-overlay expectation was wrong. Prior 426 geometry PASS is historical only. |
| Superseded intermediate: `7e6f26e55f85e85e232b2ff0f2e2e16e08676885` | Web `37889676019`; Android `37889675984` | Web **FAIL** at new-eleven suite; Android **CANCELLED**. Full artifact `11598994150`, SHA256 `45a58d44e60417357c5296c8f1f1e0ce002c8b05eaadd70df2982cbbae2647d1`, is being preserved by root. Historical only; not a release-head gate. |
| Candidate4: `a44e70996bc8546f75dc71e4af13c414350ec1f9` | Web `37889747808`; Android `37889747820` | Web **FAILED**: new-eleven suite 218/220, with two previous32 receipt expectation failures; extra-nine and geometry gates did not run. Android SUCCESS is historical only. |
| Current Candidate5: `f767a8d2e8c6ffe1120dd5f1bb73d9215b8dfafd` | Web `37894492761`; Android `37894492778` | Local 1,018 PASS / 0 FAIL / 4 documented skips; lint/typecheck/auth build PASS. Independent bounded source/harness attestation PASS. Android SUCCESS with independent artifact integrity/readiness PASS. Hosted web and final browser/geometry/runtime gates remain pending. |

Initial uncommitted author failures and bounded fixture corrections remain preserved in candidate audit reports. No failed or incomplete flow is reported as passing.

## Candidate4 failure evidence retained

Web run `37889747808`, job `113687741679`, artifact `11599059205`: 368,349,809 bytes, SHA256 `49103e1d42f83dc4b8ca18572095a6aac491f41db6514adc5aaa0341aec5a762`, 2,989 ZIP members, CRC PASS. Local archive: `deliverables/Pick-For-Us-A44-Browser-Evidence.zip`. Independent report: `A44-Browser-Independent-Failure-Review.json`, SHA256 `df867f3ac77359e223d3045554e42f1ceedb7d79e11428584567707007f54447`; root receipt: `a44-browser-failure-evidence.json`, SHA256 `04bb6fac0813c18a9a37edc7f6b02c3eca45e4d046e43fab10d18e83610cdb87`.

| Historical a44 suite | Result |
|---|---|
| Date Night radial |10/10 PASS|
| Missouri two-record regression |23/23 PASS|
| Seasonal completeness |97/97 PASS|
| Seasonal ten-record |157/157 PASS|
| Seasonal cumulative15 |235/235 PASS|
| New-eleven suite including previous32 receipts |218 PASS/2 FAIL of220; all 188 new-eleven/Cobb cases PASS,30 previous-receipt PASS/2 FAIL|
| Completed scenario aggregate |740 PASS/2 FAIL; **failed run**|
| Additional smoke / location checks |16 smoke checks,0 errors;19 location checks PASS|
| Extra-nine / current-head geometry |Not run after failure|

Beast and Edge of Hell intentionally route visitors first to the Central Waiver Station at `1300 W 13th St, Kansas City, MO 64102`. Their display addresses are respectively `1401 W 13th St, Suite B, Kansas City, MO 64102` and `1300 W 12th St, Kansas City, MO 64101`. Actual href destinations matched the unchanged production baseline and frozen independent receipt; the test incorrectly expected the display address. Root and independent reviewer inspected the captured state/screenshots and navigation evidence before the correction. Both flows failed before later reload/no-RPC/preferences assertions, so those incomplete checks remain unpassed until the candidate5 rerun.

The failed artifact binds the a44 source fingerprint and auth-enabled hosted build. No external provider call was forwarded; intercepted calls 1016, blocked server requests 0. Full job-log API retrieval returned `Transport closed`; native job step timestamps were recovered and preserved. No unavailable log content is claimed as evidence.

Historical a44 Android run `37889747820`, job `113687906947`, artifact `11598416096` had independently verified SHA256 `1dc3d41b48a0a0c02616fd1323debd03c088fdf57d128573d5c6051580fe1ae7`, CRC/source/checksums/bundletool PASS. Its unsigned AAB checksum `4cead0e51c28e90e5a0d42149e3952690d19a4f61f05bae1cacf55c6c3b5e4ee` and 14 inherited lint warnings are historical evidence only; candidate5 has its own independently checked receipt and artifact binding in the current-head section above.

## Cadaver Zone — final narrow HOLD

The Cadaver Zone Spook House (`MO26-007`) is **FACTUAL HOLD / RUNTIME HOLD**, with no candidate import. Independent report SHA256 `3a0e803473ba901be18d95f89cc1e71ef88b38d2bd3d5d80e79d61f14faec4f2`.

Identity, intentionally published visitor address `25088 Kafir Road, Webb City, MO 64870`, qualified address-derived approximate point `(37.214949, -94.510739)`, operator Facebook identity and public phone `417-499-5635` remain supported. Entrance coordinates are not a blocker.

The focused attempt recovered purported poster text for October29, 7–10 p.m., general hours, admission and contacts. The actual poster was not recovered; repeated extractor alt text did not independently establish the 2026 year/date, and exact-post search results showed related-feed contamination. Accepted dates remain empty and supported expiry remains absent. The conservative single-date structure could be used after reliable source-year binding; it cannot cure uncertain evidence. No historical Friday/Saturday recurrence, closure, last-ticket or final-exit inference was made. Resume only at reliable attraction-specific 2026 date/expiry evidence, retaining already accepted identity/address/placement.

## Added records

All 20: supported `visitor-address` Directions; approximate placement; null machine hours; never Open Now; revalidation `2026-10-15`; no automatic 2027 recurrence. Times below include UTC offset; date-only cutoffs do not claim venue closing. Full addresses and points are in JSON.

| Record / ID | Exact active dates or envelope | Final expiry / basis | Confidence |
|---|---|---|---|
| The Curse at The Branson Ghoster Coaster<br>`DELTA2-BRANSON-GHOSTER`<br>`date-night-mo26-astra-branson-ghoster` | 2026-10: 2,3,9,10,16,17,23,24,30,31 | `2026-10-31T22:00:00-05:00`<br>exact | good |
| Liberty Corn Maze<br>`MO26-056`<br>`date-night-mo26-astra-liberty-corn-maze` | 2026-09: 11,12,13,18,19,20,25,26,27; 2026-10: 2,3,4,9,10,11,16,17,18,23,24,25,30 | `2026-10-30T23:00:00-05:00`<br>exact | good |
| Terror at the Ranch<br>`DELTA3-RANCH`<br>`date-night-mo26-astra-terror-at-the-ranch` | 2026-10-09–2026-10-31 envelope; full date list not inferred | `2026-10-31T23:00:00-05:00`<br>exact | limited |
| PanicFest — The Cobb Factory<br>`DELTA3-COBB`<br>`date-night-mo26-astra-cobb-factory` | 2026-09: 25,26,27; 2026-10: 2,3,4,9,10,11,16,17,18,23,24,25,30,31; 2026-11: 1,6,7 | `2026-11-07T23:00:00-06:00`<br>exact | good |
| Field of Screams Nixa<br>`MO26-037`<br>`date-night-mo26-astra-field-of-screams-nixa` | 2026-09: 18,19,25,26; 2026-10: 2,3,4,9,10,11,16,17,18,23,24,25,29,30,31; 2026-11: 1 | `2026-11-02T00:00:00-06:00`<br>exact | good |
| Missouri Nightmare Haunted Attraction<br>`DELTA2-MISSOURI-NIGHTMARE`<br>`date-night-mo26-astra-missouri-nightmare` | 2026-10-09–2026-11-01 envelope; full date list not inferred | `2026-11-01T20:30:00-06:00`<br>exact | limited |
| Trepidations Haunted Attraction<br>`DELTA2-TREPIDATIONS`<br>`date-night-mo26-astra-trepidations` | 2026-10: 2,3,9,10,16,17,22,23,24,29,30,31; 2026-11: 1 | `2026-11-01T23:00:00-06:00`<br>exact | good |
| Freaks Fair Haunted Attraction<br>`DELTA3-FREAKS`<br>`date-night-mo26-astra-freaks-fair` | 2026-10: 23,24,30,31 | `2026-10-31T22:30:00-05:00`<br>exact | good |
| Hell Harvest<br>`DELTA4-HELL-HARVEST`<br>`date-night-mo26-astra-hell-harvest` | 2026-10: 9,10,11,16,17,22,23,24,29,30,31 | `2026-11-01T00:00:00-05:00`<br>date-only | limited |
| Myers Forest of Fears<br>`MO26-005`<br>`date-night-mo26-astra-myers-forest-of-fears` | 2026-10: 9,10,16,17,23,24,30,31 | `2026-11-01T00:00:00-05:00`<br>date-only | limited |
| Labyrinth of Fear<br>`MO26-027`<br>`date-night-mo26-astra-labyrinth-of-fear` | 2026-10: 17,23,24,30,31 | `2026-11-01T00:00:00-05:00`<br>date-only | limited |
| Aurora Maize at Adventure Farm<br>`MO26-002`<br>`date-night-mo26-astra-aurora-maize` | 2026-09: 19,25,26; 2026-10: 2,3,7,9,10,14,16,17,21,23,24,28,30,31 | `2026-10-31T22:00:00-05:00`<br>exact | limited |
| The Broken Hour at Shepherd’s Lantern<br>`DELTA2-SHEPHERD-LANTERN`<br>`date-night-mo26-astra-shepherds-lantern` | 2026-10: 16,17 | `2026-10-17T22:00:00-05:00`<br>exact | limited |
| Haunted Hollows Haunted Trail<br>`DELTA2-HOLLOWS`<br>`date-night-mo26-astra-haunted-hollows` | 2026-10: 9,10,24,30 | `2026-10-30T23:00:00-05:00`<br>exact | limited |
| Feemster Twisted Corn Maze<br>`MO26-039`<br>`date-night-mo26-astra-feemster-corn-maze` | 2026-09: 26,27; 2026-10: 2,3,4,9,10,11,16,17,18,23,24,25,30,31; 2026-11: 1 | `2026-11-01T21:00:00-06:00`<br>exact | limited |
| Worlds of Fun — Halloween Haunt<br>`DELTA6-WORLDS-OF-FUN`<br>`date-night-mo26-astra-worlds-of-fun-haunt` | 2026-10: 2,3,9,10,16,17,23,24,25,30,31 | `2026-11-01T00:00:00-05:00`<br>date-only | limited |
| Ozark Nightmares Haunted House — The Viscount’s Manor<br>`DELTA2-OZARK`<br>`date-night-mo26-astra-ozark-nightmares` | 2026-09: 25,26; 2026-10: 2,3,9,10,16,17,23,24,30,31 | `2026-11-01T00:00:00-05:00`<br>date-only | limited |
| Tunnel of Terror — Tommy’s Express Ballwin<br>`DELTA3-BALLWIN`<br>`date-night-mo26-astra-tunnel-of-terror-ballwin` | 2026-10: 23,24 | `2026-10-24T21:30:00-05:00`<br>exact | limited |
| Tunnel of Terror — Tommy’s Express O’Fallon<br>`DELTA6-OFALLON`<br>`date-night-mo26-astra-tunnel-of-terror-ofallon` | 2026-10: 23,24 | `2026-10-24T21:30:00-05:00`<br>exact | limited |
| The Haunted Grotto<br>`DELTA3-GROTTO`<br>`date-night-mo26-astra-haunted-grotto` | 2026-10: 9,10,16,17,23,24,30,31 | `2026-10-31T22:00:00-05:00`<br>exact | limited |

Aurora expires at last admission, not final exit. Hollows imports four supported ticket dates and expires after the last supported session, not a claimed full-season closure. Cobb alone adds lifecycle-scoped late-fall visibility through November 7; normal Halloween discovery is unchanged.

## Six remaining commercial HOLDs

Rank is the remaining priority order; original 10-record research rank is preserved.

| Remaining / original rank | Record | Exact blocker / recovered evidence |
|---|---|---|
| 1 / 5 | Wolfmans House Of Screams (`MO26-006`) | New official 2026 trailer and opening calendar found in search index. Direct calendar is a login wall. Need exact future 2026 dates and final expiry; no closure inferred. |
| 2 / 6 | The Werehouse (`MO26-004`) | Indexed 2026 operator hiring/trailer signals recovered. Direct website remains undated Friday/Saturday 7 p.m.–midnight. Directory raw calendar has no active dates. Need exact 2026 date binding and expiry; legacy coordinate conflict retained. |
| 3 / 7 | Fear Factory LLC (`DELTA2-FEARFACTORY`) | October 8 directory guide says Friday/Saturday. This remains secondary evidence; direct contact page returned 502. Need decisive 2026 binding and expiry. |
| 4 / 8 | Waco School House Haunt (`DELTA2-WACO`) | Focused exact-name 2026 search yielded no accepted schedule. Official site returned 502. Need 2026 date binding and expiry, not a closure assumption. |
| 5 / 9 | Rising Haunted Attraction (`DELTA5-RISING-RECHECK`) | Raw directory calendar contains no active dates; 8–11 p.m. text is undated. October 7 guide lacks exact dates. Historical 2024 DMO cannot establish 2026. |
| 6 / 10 | Twisted Minds Haunted House (`DELTA2-TWISTED`) | Focused 2026 search yielded historical directory and contaminated social snippets. Need exact 2026 public invitation/dates. California Twisted Minds is unrelated. |

## Statewide delta dispositions

18 commercial/public leads: 5 imported, 8 still held, 4 existing records retained, 1 duplicate. Net-new labels are provisional against the unavailable older external sweep; available 134 historical / current 32 / cleared 11 / Delta2–5 ledgers were deduped.

| Lead | Classification | Current disposition / blocker |
|---|---|---|
| Worlds of Fun — Halloween Haunt | NET NEW | IMPLEMENTED IN CANDIDATE; factual/source review PASS, final exact-head hosted gates pending |
| Ozark Nightmares Haunted House — The Viscount’s Manor | HISTORICAL HOLD / re-clearance | IMPLEMENTED IN CANDIDATE; factual/source review PASS, final exact-head hosted gates pending |
| Tunnel of Terror — Tommy’s Express Ballwin | HISTORICAL HOLD / re-clearance | IMPLEMENTED IN CANDIDATE; factual/source review PASS, final exact-head hosted gates pending |
| Tunnel of Terror — Tommy’s Express O’Fallon | NET NEW | IMPLEMENTED IN CANDIDATE; factual/source review PASS, final exact-head hosted gates pending |
| The Haunted Grotto | HISTORICAL HOLD / re-clearance | IMPLEMENTED IN CANDIDATE; factual/source review PASS, final exact-head hosted gates pending |
| A Field of Screams / Timmy’s Terror, Rolla | NET NEW | HOLD — Whole-season operator schedule Oct2–31 not explicitly year-bound; Oct10 event may support smaller exact subset but hours conflict22:00 directory versus23:00 indexed operator; no placement prepared. |
| Field of Screams Branson | NET NEW | HOLD — DMO extraction nav-only; conflicting tradepress Sep/Oct opening and four November crossover dates not resolved to exact lifecycle. Distinct from MO26-037 Nixa. |
| Fearstone Forest Haunted Trail | HISTORICAL HOLD / re-clearance | HOLD — Exact operating calendar remains image/year unbound;837NHwy5 organizer address vs85Benne venue must stay separate;18+Oct17/kidsOct31 cannot be treated2026 before binding. |
| Fun Time Farms Haunted Corn MAiZE | HISTORICAL HOLD / re-clearance | HOLD — Final active date/expiry still unresolved; hiring or season announcement alone does not establish exact season. |
| TerrifiedExist Haunted Attractions | HISTORICAL HOLD / re-clearance | HOLD — Hiring is not visitor operation; exact2026dates/expiry unresolved. |
| Lemp Brewery Haunted House | HISTORICAL HOLD / re-clearance | HOLD — No Lemp-specific2026 calendar/expiry or official ticket availability; shared Scarefest calendar/tickets currently Darkness+Creepyworld only. |
| BOSS Haunted House, Fort Leonard Wood | NET NEW | HOLD — 2026 edit timestamp not2026 operation; prior schedule Oct25,2025 stale; supported visitor/base access route and final date absent. |
| Brookdale Farms / The Hollows | LIVE EXISTING / enrichment | INDEPENDENT FACTUAL/COPY PASS; evidence-only, no runtime change — Do not apply haunted attraction lifecycle to FallFestivalNov8 or mix old2025FAQprices withcurrenttickets; consumer copy optional independent review. |
| Hotel of Terror | LIVE EXISTING / enrichment | INDEPENDENT FACTUAL/COPY PASS; evidence-only, no runtime change — No need runtime churn; no supported last-ever-season claim from directory. |
| The Darkness | LIVE EXISTING / enrichment | RETAIN STRONGER EXISTING — Directory city-only address/0mile neighbors not usable placement; Scarefest date-hour conflicts already recognized, no overwrite. |
| Creepyworld | LIVE EXISTING / enrichment | RETAIN STRONGER EXISTING — No unique stronger new consumer field; direct FrightMaps detail failed, index usedonlyforidentity. |
| The Beast and Edge of Hell combined directory row | DUPLICATE | NO NEW IMPORT — Not a third attraction; maintain each venue’s separate address/directions. |
| Macabre Cinema | HISTORICAL HOLD / re-clearance | HOLD / NOT CURRENT FULL-SEASON — Traditional full-season schedule suspended for redevelopment; surprise event possibility not explicit dated public operation. Current magazine generic reopening conflicts; do not import. |

## Evidence-only enrichment

| Existing record | Approved additive sentence; not applied |
|---|---|
| `MO26-085` | The Hollows haunted trail uses separate admission and its own October calendar. |
| `MO26-124` | A combo pass with Dungeons of Doom includes transfer rides between the two haunts. |

## Residential or uncertain classification: separate HOLD lane

| Lead | Blocker |
|---|---|
| Arcadia Academy Haunted Tours | Listed Home haunt, but historic academy public-tour description suggests classification may be wrong. Require official current2026 public invitation before public-commercial proposal. |
| Historic Commercial Haunt | Home/yard tag; name Commercial does not establish business status. Directory00:00–23:59 schedule is unusable. |
| RMAA Haunted House and Trunk or Treat | Home tag/community event unclear; no explicit2026 dates or operator public invitation recovered. |
| Apple Ridge Orchard Spooky House | Farm/public status needs corroboration; directory visitor address3849SSRBB conflicts narrative3887HwyBB; unyear-bound Fri/Sat hours not2026proof. |
| Horror in the Holler | Home tag/outdoorcharitytrail; no current2026 public invitation or date support recovered. |

## Retained earlier decisions

These are unchanged carry-forward decisions from the authoritative continuity checkpoint, not fresh re-clearances or additions to this run’s batch counts.

| Record | Retained disposition |
|---|---|
| Carolyn’s Pumpkin Patch (`MO26-055`) | FACTUAL PASS / RUNTIME PLACEMENT HOLD. Conflicting operator-linked destination and reproduced Census point remain unresolved; no averaging or silent point selection. |
| Terror on Route 66 | FACTUAL PASS / RUNTIME PLACEMENT HOLD. Direct sources support the West visitor address, but the ticket point and exact-address Census point differ by about 2 km; neither point is cleared. |
| Hannibal Warehouse | FACTUAL HOLD. Visitor destination and date-list/prose conflicts remain unresolved. |
| Vino Noir — Witch Broom Making Workshop (`MO26-013`) | Retained EXPIRE / no 2026 import decision for the October 8 event. This is not a new claim about physical closure or a revival into another season. |
| Wentzville’s Halls Of Horror | Separate residential HOLD. Operator-intended public visitor location and invitation, plus product and visitor-safety review, remain required. |
| Spooky Hollow Dyerdown Holiday House | Separate residential HOLD. Operator-intended public address, precise season end/current invitation and product review remain required. |
| West Gravestone Square | Separate residential HOLD. Operator-intended public visitor address, current-year invitation and product review remain required. |

The full historical ledger remains authoritative for other unchanged backlog records. No exhaustive statewide coverage or automatic release of historical HOLDs is claimed.

## Exact changed paths versus main: 32

- `.github/workflows/validate-icon-pack.yml`
- `audit/astra-commercial-2026-10-09/Author-Implementation-Report.json`
- `audit/astra-commercial-2026-10-09/Commercial-Feemster-Independent-Eligible-R2.json`
- `audit/astra-commercial-2026-10-09/Commercial-Holds-Independent-Eligible-R1.json`
- `audit/astra-commercial-2026-10-09/Implementation-Projection-Manifest.json`
- `audit/astra-delta-2026-10-09/Author-Implementation-Report.json`
- `audit/astra-delta-2026-10-09/Delta6-Independent-Eligible-R2.json`
- `audit/astra-delta-2026-10-09/Delta6-Independent-Final-R2.json`
- `audit/astra-delta-2026-10-09/Implementation-Projection-Manifest.json`
- `audit/astra-eleven-2026-10-09/Author-Implementation-Report.json`
- `audit/astra-eleven-2026-10-09/Implementation-Projection-Manifest.json`
- `audit/astra-eleven-2026-10-09/Independent-Delta5-R2-Final-Eligible-Subset.json`
- `audit/astra-eleven-2026-10-09/Nine-Preimport-Eligible-Author-Subset-R2.json`
- `scripts/missouri-two-record-browser.mjs`
- `scripts/missouri-two-records.test.mjs`
- `scripts/seasonal-astra-commercial.test.mjs`
- `scripts/seasonal-astra-delta.test.mjs`
- `scripts/seasonal-astra-eleven.test.mjs`
- `scripts/seasonal-card-layout-browser.mjs`
- `scripts/seasonal-discovery.test.mjs`
- `scripts/seasonal-late-fall-client-cache.test.mjs`
- `scripts/seasonal-late-fall.test.mjs`
- `scripts/seasonal-ten-record-browser.mjs`
- `scripts/test-support/missouri-previous32-receipts.json`
- `src/lib/date-night/curated-policy.ts`
- `src/lib/date-night/missouri-2026-astra-commercial-catalog.ts`
- `src/lib/date-night/missouri-2026-astra-delta-catalog.ts`
- `src/lib/date-night/missouri-2026-astra-eleven-catalog.ts`
- `src/lib/date-night/missouri-2026-three-source-tier-a-catalog.ts`
- `src/lib/date-night/search.ts`
- `src/lib/date-night/seasonal-catalog.ts`
- `src/lib/date-night/seasonal-presentation-catalog.ts`

Source immutable identities, complete activeDates arrays, address targets, confidence/revalidation, research hashes, and retained limitations are in `Candidate5-Release-Inventory.json`. No production or source mutation was performed to assemble this inventory.


## Known limitations and operational follow-up

- All twenty records revalidate on October 15, 2026. Unknown/display-only hours never produce Open Now. Explicit supported subsets and bounded envelopes are preserved; no full calendar is invented.
- Some accepted current operator facts are indexed because direct pages are unavailable, blank or throttled. Accepted scope and conflicting secondary statements are retained field by field in the source evidence.
- Approximate placement supports browse/radius filtering; Directions use published visitor addresses. No entrance, parking or precise rideshare dropoff is asserted.
- Two optional enrichment sentences are evidence-only; zero existing runtime records changed. No original eleven was excluded as stale or expired. Macabre Cinema and prior-year BOSS evidence do not establish a current full-season import; Lemp remains uncertain for 2026.
- The full older external statewide sweep was unavailable. Available 134-record historical ledger and current/prior candidate ledgers were deduped; net-new classifications are provisional.
- Android is a remote HTTPS wrapper. Automated readiness does not prove physical device, WebView, GPS, upload signing or Play Console acceptance. Those remain HOLD.
- Existing 320px Directions-label overflow remains an inherited baseline limitation. Geometry comparisons retain the established standard/ordinary controls; they do not claim that every legacy label is overflow-free. Final exact-head review must separately confirm new Details readability, control reachability and absence of new page overflow.
- Local Chromium installation failed from a truncated official download; all pixel claims must come from hosted exact-head artifacts.

## Production, rollback, waiver and owner action

Last verified production baseline: main/source `979d83aede9d66163e1ebaed9ad5b219cb637882`, tree `a7dbb32947c0a0daf4864346b0d212477fc9a11b`, READY deployment `dpl_F1XiMcc9AUuykunNamr87R3re7gP`. Retained immediate rollback: `dpl_BCdD3eWRXk6UEN2FNJQE88r18VXv`, source `213502ef8cf3f67d75e6d9c9c8ff43f9f656890c`, previously verified READY. **Root must insert the final fresh production/main/rollback readback before owner release decision; these baseline identities are not a new readback claim.**

Last observed protection state was unprotected main with empty rulesets; dedicated protection inspection returned403 to the integration. No fresh waiver has been granted, and prior release waivers do not authorize this candidate. **Root must refresh and bind protection status. If main remains unprotected, the owner must explicitly grant a fresh waiver for the final exact candidate before any release.** No protection, ruleset or deployment setting was changed.

Owner action remains pending: after all exact-head gates and evidence review pass, explicitly decide whether to release this PR/head and resolve the current protection/waiver requirement. This draft does not request premature approval or authorize autonomous merge/deployment. Android upload signing, Play Console and publication remain separate HOLDs.

Final root completion fields:

- Exact web run conclusion, each browser suite count, total browser count, geometry count, artifact hashes and final independent runtime verdict: **PENDING**.
- Fresh main / production source / tree / deployment / READY status / rollback identity: **PENDING final root readback**.
- Fresh repository protection and exact-candidate waiver status: **PENDING final root binding; no fresh waiver currently granted**.
- Canonical continuity commit SHA after publication and readback: **PENDING root**.
- Terminal status may change to **VERIFIED CANDIDATE READY FOR OWNER RELEASE DECISION** only after those gates and checkpoint publication/readback are complete.
