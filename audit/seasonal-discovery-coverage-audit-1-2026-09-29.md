# Pick For Us — Seasonal Discovery Coverage Audit #1

Audit date: September 29, 2026, America/Chicago. Execution and public-source retrievals occurred September 30 UTC. The requested artifact date is retained.

**Conclusion:** The Carthage two-result observation is reproduced. It is primarily a source/query coverage problem amplified by two geographically narrow saved haunt anchors. The captured live response supplies no seasonal candidates. No Carthage seasonal candidate disappears through radius, mood, multi-selection, count calculation, or options serialization. Separate classification, availability-policy, duplicate-category, and status/disclosure weaknesses are proven below. This is an audit, not remediation or release approval.

Machine-readable record: [seasonal-discovery-coverage-audit-1-2026-09-29.json](seasonal-discovery-coverage-audit-1-2026-09-29.json). Supporting paths below are relative to [seasonal-discovery-coverage-audit-1-evidence/](seasonal-discovery-coverage-audit-1-evidence/).

## 1. Exact audited state and starting verification

| Item | Verified value |
|---|---|
| Repository | `caleb1234calvin-art/dinner-roulette` |
| Branch | `audit/seasonal-discovery-coverage-1` |
| Audited HEAD and remote audit branch | `4f6bf5fde5ffb1f4e99b34584ebd4e767ba39ac3` |
| Audited tree | `3e288318f159873b81c31d0cc994d1ca7e6291f9` |
| Frozen base and freshly fetched `origin/main` | `0a8f30dc57fcc1156342d1bfc8a07524f3125e3b` |
| Base/main tree | `5f8a4a832dc1fa06be47c9945938e2a7a379fa9f` |
| Difference from frozen base | One direct child commit; only `docs/handoffs/active/seasonal-discovery-coverage-audit-1.md` added |

Fresh remote refs were fetched before inspection and again before finalization. Main remained at the frozen baseline. The checkout began clean, with no implementation changes on the audit branch. The 548-line handoff was read in full before forming hypotheses. Current TOP `AI_CONTINUITY.md` was read: it still describes the earlier pre-merge checkpoint and old main. Those historical baseline statements do not override this handoff or freshly fetched refs. Continuity was not edited.

Only audit reports, evidence, and evidence-only scripts were written in the repository. A temporary dependency symlink used for probes was removed before final verification. No product/catalog/test-suite changes, commit, push, merge, build, migration, deployment, publication, Vercel change, signing, or upload occurred. `repository-verification.json` records the final ref and working-tree checks.

## 2. Actual implementation pipeline

The following trace comes from complete reads of the relevant source, not labels alone.

| Stage | Source and actual behavior |
|---|---|
| State and controls | `src/lib/store.ts`, `src/components/location-control.tsx`, `src/lib/location/*`, `src/lib/date-night/types.ts`: persisted origin, Date Night filters, spooky toggle; category toggles create an array, `anything` is the fallback. Manual location uses Nominatim; GPS/manual changes feed the same coordinates. Coordinates are validated. Default origin is Joplin; this audit explicitly overrides it. |
| Season and presets | `src/lib/date-night/season.ts`, `src/lib/seasonal-features.ts`, `src/components/mode-home.tsx`: feature flag, spooky toggle, and local-calendar Sep 1–Nov 2 window jointly enable the layer. Presets set categories/mood and reset favorites constraints. Inactive normalization removes seasonal chips, falling back to `anything`. |
| Fetch | `src/components/date-night-home.tsx`: effect depends on latitude, longitude, radius, and spooky toggle. It protects against stale completions with cancellation. Open Now, category and mood changes do not request a new provider pool. |
| Query | `src/lib/date-night/search.ts`: server fetches at least 15 and at most 50 miles; `around` radius is 80,467 meters at the audit setting. Base vocabulary covers ordinary activities; four seasonal tag predicates are added while active. Four sequential mirrors provide the same OSM dataset, not four complementary attraction sources. |
| Normalization/classification | `search.ts`: requires a nonblank name and a coordinate/way center; rejects names containing `closed`, and locally retired Powers Museum. Exact tags plus limited name/description substrings classify categories. No event enrichment, web-source import, or general seasonal-hours ingestion occurs. |
| First uniqueness pass | `queryMirror`: `Map.set` on lowercased name plus coordinates rounded to four decimals overwrites an earlier matching record. It does not union categories at this stage. |
| Deduplication | `dedupeDateNight`: merges matching names within 0.6 mi, or shared activity type within 0.03 mi; unions types. This cannot recover metadata already overwritten. The name matcher is permissive; distinct nearby same-type merging is a static risk, not established as a primary missing-candidate cause. |
| Anchors/merge | `localWithin`, `mergeDateNight`, both catalogs: anchors within fetch radius + 1 mi join live results. Name/alias match within 0.35 mi gives curated identity/coordinates/address/hours precedence and unions categories, then dedupes again. Anchors participate on successful requests too. |
| Decoration | `src/lib/restaurants/decorate.ts`, `hours.ts`, `geo.ts`, `date-night/availability.ts`: Haversine distance and weekly hours; only two venue IDs receive curated seasonal-calendar overrides. Unknown weekly hours yield `hoursKnown=false`, `isOpen=true`. Unconfirmed curated dates instead yield `hoursKnown=true`, `isOpen=false`, `Schedule unconfirmed`. |
| Eligibility, in source order | `DateNightHome` removes seasonal-only venues when inactive, then distance > radius + 0.05, active exclusions, never-recommend/favorites violations, known-closed venues if Open Now is on, then venues sharing no selected category. The strict availability helper functions are not called. |
| Count | UI renders `eligible.length`. There is no separate total or category-count summation. |
| Pick our date | Category balancing then weighted selection from `eligible`; distance, mood fit, previously shown IDs and seasonal preference affect probability. Playful is a weighting input, not an exclusion. |
| Give us options | `pickDiverseOptions` selects up to four, tracks used IDs, balances present selected categories, then fills from remaining eligible venues. A multi-activity venue occupies one slot. |
| Plan | Thrill includes haunt/escape/corn; settle includes movies/museum/pumpkin/park. The action may assemble fallback candidates, but `date-night-plan-overlay.tsx` independently requires a real thrill and a different real settle venue. The two-haunt case displays an incomplete-plan state. |
| Fixtures | `scripts/test-support/location-provider-fixtures.mjs` is explicitly preloaded only for browser smoke runs, never production-imported. Its Date Night response is a museum, not seasonal evidence. The live audit used native fetch, with no fixture preload. |

Seasonal and hours evaluation use the execution/viewer local timezone, not an attraction timezone. Decorated open status is memoized on venues/location without a clock dependency; there is no periodic hours refresh. These are static limitations, not the cause of this Open Now OFF reproduction.

## 3. Primary Carthage reproduction

Origin: **37.176447, -94.310223**, a declared Carthage city-center audit point. The production tester's exact GPS was unavailable. Radius 50 mi; Haunted House + Corn Maze + Pumpkin Patch; Open Now OFF; Playful mood 50; spooky enabled; no favorites restriction, active exclusions, or never-recommend preferences. Client evaluation time: **2026-09-30T01:41:35Z**, September 29 at 20:41:35 America/Chicago.

Live request began **2026-09-30T01:46:23.993Z**. The first mirror, `https://overpass.openstreetmap.fr/api/interpreter`, returned HTTP 200 with 281 elements and no incomplete-response remark. No timeout, mirror failover, or error fallback occurred. The app returned `source=merged`, with no warning. Full query, request timing, response body and resulting venues are preserved in `live-provider-observations.json`; a readable query is in `carthage-query.overpassql`.

| Stage | All Date Night types | Seasonal candidates relevant to selection |
|---|---:|---:|
| Raw provider elements | 281 | 0, even before name/coordinate validation |
| Normalized/classified live elements | 245 | 0 |
| First name/coordinate map | 245 | 0 |
| Live deduplication | 232 | 0 |
| Local anchors considered | 17 | 2 |
| Merged and deduped server result | 240 | 2 |
| Seasonal activation gate | 240 | 2 |
| Distance cutoff ≤50.05 mi | 239 | 2 |
| Exclusions/favorites/preferences | 239 | 2 |
| Open-state handling, OFF | 239 | 2 |
| Selected-category union / final eligible pool | 2 | 2 |
| JSON serialization round trip | 2 final eligible | 2 |
| Rendered match count | **2 activities match** | 2 |
| Give us options | **2 distinct options** | 2 haunts |

All 36 pre-normalization removals in the primary response lack names; none has seasonal classification evidence. The 13 live dedupe reductions and one merged distance removal do not remove any seasonal candidate.

| Final venue | Exact product distance | Internal status | Rendered options label |
|---|---:|---|---|
| Myer's Inn Haunt | 2.0329841506408552 mi | `hoursKnown=true`, `isOpen=false`, `closesLabel=Schedule unconfirmed` | 2.0 miles · Closed |
| The Werehouse | 11.44811300482452 mi | `hoursKnown=true`, `isOpen=false` | 11 miles · Closed |

Both are `source=catalog`. The real unchanged React component and action callbacks were executed in an isolated SSR harness against the captured live result. OFF → ON → OFF renders **2 → 0 → 2** and enables/disables the pick/options actions accordingly. Pick chooses within the two-entry pool. Options contain the same two unique venues; random order is not material. A two-haunt plan correctly displays **“No complete seasonal pair yet.”** See `react-render-evidence.json` and rendered HTML artifacts.

This is provider execution plus deterministic source/React replay, **not** a production browser, physical GPS, or browser-to-server RPC acceptance claim. Chromium was unavailable and its attempted installation failed; `browser-install.log` retains the failure.

## 4. Reference-set methodology

The reference set is diagnostic, not a complete regional inventory or a proposed catalog patch. All seven handoff leads were investigated, plus Exeter, Campbell's, Rutledge-Wilson, and the live false-positive control. Searches covered haunts, haunted trails/forests, corn mazes, pumpkin patches, and farms explicitly advertising those activities. Generic farms, stores, and old listings were not counted merely to increase expectations.

Current operator/municipal calendars take precedence over directories. A dated regional tourism article is useful secondary operational evidence; coordinate metadata is not proof of current opening. Copyright years alone are not seasonal evidence. Search-index snapshots and fresh direct pages conflicted for Myer's Inn and Myers Forest: the fresh direct HTML has October 2026 active dates, retained as parsed calendar facts and response hashes. The older indexed dates are not presented as current truth.

Coordinates come from the actual OSM response, a named direct OSM record, an operator-embedded map, or explicitly labeled secondary directory metadata. For the two existing anchors, product coordinates are retained to reproduce UI distances and checked against nearby independent directory points. Cadaver Zone lacks a reliable attraction coordinate in this audit; its distance remains unknown rather than invented. All distances use the unchanged product Haversine function. See `reference-set.json`, `reference-source-retrievals.json`, `reference-event-metadata.json`, `reference-coordinate-extracts.json`, and `reference-geocoding.json`.

## 5. Reference candidates and provenance

Abbreviations: H = Haunted House semantics, including substantiated haunted trail/forest attractions; C = Corn Maze; P = Pumpkin Patch. “Eligible OFF” means category/radius/seasonal browsing eligibility supported by the stated evidence; it never asserts open at the audit moment.

| Candidate / locality | Coordinate and Carthage miles | Category / 2026 evidence | Eligible OFF and observed disposition |
|---|---|---|---|
| Myer's Inn Haunt / Carthage | 37.1475746, -94.3173348; **2.03** | H. Fresh [operator](https://www.myersinnhaunt.com/) calendar: Oct 2–31, Fri/Sat; [directory](https://www.missourihauntedhouses.com/halloween/rip-at-myers-inn.html) corroborates 2026 dates. | Yes, upcoming season browsing. Included from catalog; frozen availability record remains unconfirmed. |
| The Werehouse / Joplin | 37.0694258, -94.4688601; **11.45** | H. [Operator](https://thewerehouse.net/) weekly evening hours; [2026 directory metadata](https://www.missourihauntedhouses.com/halloween/haunted-house-joplin.html) Sep 25–Oct 31. | Yes. Included from catalog; Tuesday is closed. |
| Myers Forest of Fears / Carthage | 37.119659, -94.312243; **3.93**, directory point | H. [Fresh operator calendar](https://www.myersforestoffears.com/) marks Oct 2–31, 2026; prose still references 2023. Catalog comment reports conflicting closure data. | Conditional. Published current schedule is evidence, but operation/closure conflict is unresolved. Absent from raw inputs/catalog; not counted as a firm missing active result. |
| Cadaver Zone Spookhouse / Webb City | 25088 Kafir Rd; coordinate/distance **not verified** | H. [Indexed directory](https://www.thescarefactor.com/haunted-houses/missouri/the-cadaver-zone-spook-house/) has identity/address but no upcoming dates. Direct request returned a 200 “Site Unavailable” page. | Unresolved. No 2026 assertion or forced expected match. Absent from raw inputs/catalog. |
| Wolfmans House Of Screams / Carl Junction | 37.203407, -94.532039; **12.35**, directory point | H. [Current directory](https://www.missourihauntedhouses.com/halloween/wolfmans-housescreams-mo.html) structured dates Oct 3–31, 2026. Operator social confirmation not obtained. | Provisionally yes, with lower confidence than operator verification. Absent from inputs/catalog. |
| Aurora Maize at Adventure Farm / Aurora; historical Verona MAiZE lead | 36.9808456, -93.6877871; **36.88**, operator map | C; haunted/zombie activity reasonably maps to H. [Operator hours](https://auroramaize.com/hourstickets/): Sep 19–Oct 31, 2026. [Current address/map](https://auroramaize.com/find-the-farm/); [historical relocation evidence](https://www.abilitiesfirst.net/wp-content/uploads/2019/08/Sept-Family-2019.pdf). | Yes. Absent before normalization. Verona and Aurora are not counted as separate venues. |
| Pickin' Patch Farm / Marionville | 37.00037, -93.65215; **38.26**, [directory coordinate](https://www.pumpkinpatches.com/pickapumpkin248) | C + P. [Regional tourism article dated Sep 9, 2026](https://www.springfieldmo.org/blog/post/visit-these-pumpkin-patches-around-springfield/) gives Sep 18–Oct 31 and both activities. | Yes on current tourism evidence. Absent before normalization. |
| Exeter Corn Maze / Exeter | 36.6355091, -93.9609468; **42.06**, [OSM node 12298081054](https://api.openstreetmap.org/api/0.6/node/12298081054.json) | C + P + H. [Operator](https://www.exetercornmaze.com/): 2026 Sep 12–Nov 1; [haunted activities](https://www.exetercornmaze.com/about-3). | Yes. OSM record exists but `tourism=theme_park` is not queried. If supplied unchanged, app recognizes C and retains it OFF. |
| Campbell's Maze Daze & Pumpkin Patch / Clever | 36.993237, -93.407991; **51.32**; alternate point **50.74** | C + P + H. [Operator](https://www.campbellsmazedaze.com/general-admission): Sep 26–Oct 31, 2026. [Directory coordinate](https://www.missourihauntedhouses.com/halloween/campbells-maze-daze-pumpkin-patch-mo.html), [alternate](https://nextdoor.com/pages/campbells-maze-daze-clever-mo/). | **No from Carthage**, both points outside. In-range from Aurora/Springfield controls, but absent there too. |
| Rutledge-Wilson Farm Park / Springfield | 37.1921975, -93.35973; **52.33**, actual OSM way center | C + P. [Municipal event page](https://www.parkboard.org/harvestfest): maze Oct 3–25, patch Sep 29–Oct 25; [municipal calendar](https://www.parkboard.org/calendar.aspx?CID=14%2C26%2C22%2C23&view=month) corroborates 2026. | **No from Carthage**. In Springfield/Lockwood/Aurora raw inputs, but only `leisure=park`; app classifies park and excludes it under seasonal categories. |
| Turtle Moon Labyrinth / Eureka Springs | 36.4600896, -93.8407795; **55.89**; **35.94 from Aurora** | No qualifying seasonal category established. [Historical operator release](https://www.prlog.org/11064027-retreat-at-sky-ridge-opens-new-community-labyrinth-on-nov-19-at-5-pm.html) describes a meditation labyrinth, not corn. No 2026 operation claim made. | Outside Carthage. Actual Aurora raw `attraction=maze` becomes C and survives both OFF and ON. False positive. |

At least **three** missing in-radius venues have strong current-season evidence: Aurora Maize, Pickin' Patch Farm and Exeter. Wolfmans is a further secondary-source expectation. Forest and Cadaver remain explicitly qualified; they are not used to inflate a definitive expected match count.

## 6. Distance/radius analysis

The product uses **straight-line Haversine miles**, Earth radius 3,958.8 mi. It does not calculate road distance or use a bounding-box-only eligibility rule. Provider radius at 50 mi is rounded/capped to 80,467 m. Ways/relations are normalized to their center; a provider geometry can intersect the query circle while its representative center falls outside the final cutoff. Local anchors have a +1 mi retrieval cushion; final UI eligibility allows +0.05 mi tolerance.

`deterministic-probes.json` tests the actual predicate with qualifying candidates at 0, 49.9, 50, 50.049, 50.05, 50.051, 51 and 60 mi. 0 through 50.049 pass; 50.051, 51 and 60 fail. The mathematically constructed 50.05 point computes as 50.05000000000018 and fails due to floating-point rounding. That sub-nanomile edge is recorded, not inflated into a material radius defect. The live provider's tighter 50 mi query does not promise to populate the UI's entire tolerance band.

Exeter is safely inside at 42.06 mi and the real normalizer/predicate accepts its direct OSM record OFF. Both Campbell's coordinates fail the actual predicate at 50.74/51.32; Rutledge-Wilson fails at 52.33; Turtle Moon fails from Carthage at 55.89. These are expected exclusions for this origin. A different production GPS or entrance point could alter a near-boundary conclusion; Campbell's is not labeled a Carthage coverage defect.

## 7. Category analysis

Multi-selection is a **union**: `activityTypes.some(selected.includes)`. It does not require all selected activities at one venue.

| Selection | Carthage live replay / saved-anchor pool | Query-realistic synthetic seasonal pool |
|---|---:|---:|
| H | 2 | 2 |
| C | 0 | 4 |
| P | 0 | 2 |
| H + C | 2 | 6 |
| H + P | 2 | 4 |
| C + P | 0 | 5 |
| H + C + P | 2 | 7 |

Synthetic counts test mechanics, not real-world coverage quality: they deliberately include a hedge-maze false positive and disused records. One C+P fixture is counted once, and option IDs are unique. Direct deduplication of same-venue C and P records correctly unions categories. However, actual transport first overwrites records sharing the rounded name/coordinate key: C then P leaves only P; reversed input leaves only C. This order-dependent loss is a proven ingestion defect, not the cause of the primary live response's zero supplied seasonal venues.

All `leisure=maze` or `attraction=maze` entries become C without evidence of corn. Conversely, farm/attraction/theme-park/haunted-trail vocabulary can be absent from the query even when the existing name classifier would recognize a supplied record. Query vocabulary and classification must be evaluated separately.

## 8. Open Now and seasonal-state analysis

| State | Actual behavior | Assessment |
|---|---|---|
| Known currently closed | Retained OFF, removed ON; primary two anchors 2→0→2 | Correct for the triggering case. |
| Unknown live weekly hours | `hoursKnown=false` passes ON as well as OFF | Contradicts the strict Open Now helper's documented policy. Actual Aurora labyrinth remains ON; unknown-hours pumpkin fixture does too. |
| Curated unconfirmed season | Myer's override forces known/closed internally; passes OFF, fails ON | Conservative filtering works, but internal state and label collapse uncertainty into closure. |
| Future opening | Werehouse on Sep 24 survives OFF and is removed ON | Browsing future venues works; helper calls this unavailable, revealing an unresolved policy distinction. |
| Confirmed in-season evening | Werehouse Sep 25 at 20:00 passes ON | Weekly + curated seasonal override works for this record. |
| After confirmed season | Werehouse Nov 1 survives OFF despite `isSeasonalDateSelectable=false`; ON removes it | Shared lifecycle policy is not integrated into the UI. Nov 1 is still inside the global Halloween window. |
| Permanently closed/disused | No general structured lifecycle handling; synthetic `disused=yes` plus qualifying active tag survives OFF | Proven capability gap with fixtures, not a claim a captured real closed business was shown. Name substring `closed` and one retired-name exception are insufficient lifecycle policy. |

The two functions `isDateNightOpenNowEligible` and `isSeasonalDateSelectable` are not called by `DateNightHome`. Existing tests passing those helpers do not verify visible behavior. Live venues with parsable weekly hours also lack the two anchors' seasonal-calendar guard, so weekly hours alone can pass ON without verified current-season dates.

Fresh official Myer's Inn dates now contradict the frozen “official site still publishes 2025” rationale. The app remains unconfirmed until its data is intentionally refreshed; this audit did not do so. Do not automatically turn every unconfirmed venue into closed-for-season, or blindly wire a helper that conflates future opening and finished season. Define those states distinctly first.

## 9. Provider/source analysis

Production seasonal contributors are **OSM through Overpass** plus the two local catalogs. Nominatim resolves locations, not the seasonal inventory. Search engines, tourism websites, the audit reference set and casino sources do not feed Date Night.

Base query predicates: `leisure=bowling_alley`, `leisure=amusement_arcade`, `amenity=cinema`, `leisure=miniature_golf`, `leisure=escape_game`, `tourism=museum`, `leisure=ice_rink`, `sport=roller_skating`, `leisure=park`. Seasonal additions: `leisure=maze`, `attraction=maze`, `attraction=haunted_house`, `attraction=pumpkin_patch`. No current-season date predicate, theme-park query, general attraction/farm event source, or haunted-trail query is present.

Mirrors in order: `overpass.openstreetmap.fr`, `overpass.private.coffee`, `maps.mail.ru/osm/tools/overpass`, `overpass-api.de`. Each request declares a 20-second Overpass timeout and uses a 22-second fetch abort. Four sequential failures can approach 88 seconds. Non-2xx, malformed element arrays, or any `remark` reject that response. The first structurally successful nonempty merged result returns immediately, even if the only relevant seasonal entries are anchors or the live array is empty.

If every mirror fails and local anchors exist, the response is `fallback` with a warning. If no anchors exist, any successful empty response permits a final empty live result; all failures throw. Deterministic probes preserve empty-success versus outage behavior. All five **actual product-query** observations used the first mirror successfully; none activated error fallback.

An auxiliary broader name/theme-park diagnostic query received HTTP 403 at the French mirror and timed out at private.coffee after 35 seconds. That separate research request is retained in `diagnostic-provider-query.json`; it does not negate the successful product queries or establish OSM absence. Direct OSM retrieval nevertheless proves Exeter's query vocabulary miss. No response is described as a complete attraction inventory.

## 10. Saved/fallback-anchor analysis

| Catalog contribution | Count | Geography |
|---|---:|---|
| Haunted House seasonal anchors | 2 | Carthage and Joplin, Jasper County |
| Corn Maze seasonal anchors | 0 | None |
| Pumpkin Patch seasonal anchors | 0 | None |
| Ordinary Date Night anchors | 15 | Jasper County/local area |

The seasonal catalog explicitly describes precise-coordinate, deliberately sparse fallback anchors, not comprehensive coverage. Its comment-only leads contribute zero runtime venues. The live map is expected to supply broader discovery, but the audited query/data cannot fulfill that role reliably for these categories.

Carthage valid-empty live fixture returns 17 merged server venues and two eligible haunts after **one** request, with no warning. Four injected mirror failures return the same two eligible haunts via `fallback`, with an explicit warning. Thus anchors preserve usable selections, but successful nonseasonal/empty live responses can conceal how dependent seasonal results are on two examples. This is thin source composition and limited disclosure, not a false numeric match count.

## 11. Control locations

All use 50 mi, H+C+P, mood 50, spooky on, no personal exclusions; ON comparison uses the same frozen Chicago client time. Exact origins and full request start/end/status/query are in the JSON evidence.

| Origin (lat, lon) | UTC request start, Sep 30 | Raw | Normalized | Live deduped | Merged / within distance | Seasonal OFF / ON | Observation |
|---|---|---:|---:|---:|---:|---:|---|
| Carthage (37.176447, -94.310223) | 01:46:23.993 | 281 | 245 | 232 | 240 / 239 | **2 / 0** | Two saved haunts only. |
| Joplin (37.084184, -94.513339) | 01:46:36.762 | 280 | 242 | 228 | 236 / 233 | **2 / 0** | Same two anchors; no live seasonal contribution. |
| Springfield (37.208957, -93.292299) | 01:46:47.014 | 356 | 323 | 307 | 308 / 308 | **0 / 0** | Regional seasonal offerings exist; raw Rutledge-Wilson is park-only. |
| Lockwood rural (37.3856, -93.953) | 01:46:57.602 | 367 | 323 | 309 | 317 / 314 | **2 / 0** | Same saved haunts; no live seasonal contribution. |
| Aurora (36.970891, -93.717979) | 01:47:07.114 | 495 | 449 | 427 | 435 / 434 | **3 / 1** | Two anchors plus wrongly classified Turtle Moon Labyrinth. |

Every row: HTTP 200, first mirror, no provider remark, no timeout/error fallback, source `merged`. These are regional observations, not proof of worldwide provider failure. Aurora is the density control because current-season Aurora Maize, Pickin' Patch, Exeter, Campbell's and Rutledge-Wilson lie within its 50-mile circle; per-origin reference distances are in `reference-set.json`. The pattern is regional and category/source-architecture related, not isolated to the Carthage origin or a single UI filter combination.

## 12. Deterministic regression/test-gap assessment

Existing targeted tests were run unchanged: **6/6** seasonal availability tests and **10/10** location-discovery tests pass. Logs are retained. `availability.test.ts` tests pure helpers; `scripts/location-discovery.test.mjs` exercises actual search modules using a museum for Date Night, general empty/outage handling and coordinate validation. The browser provider fixture also returns a museum. Those passes do not validate seasonal discovery end to end.

| Required regression risk | Current coverage | Audit evidence / missing protection |
|---|---|---|
| Qualifying corn maze returned but dropped | No direct seasonal transport/classifier regression found | Direct fixture succeeds for known tag; Exeter misses query; same-key C metadata overwritten. Need query-through-UI cases. |
| Qualifying pumpkin patch returned but dropped | No direct seasonal regression found | Known tag succeeds; alternative source vocabulary and overwritten P evidence unprotected. |
| OFF removes closed seasonal venue | Helper comments/tests do not exercise actual UI predicate | Captured React OFF→ON→OFF and closed fixtures verify current behavior, not permanent suite protection. |
| Combined filters intersect incorrectly | No seven-combination UI regression found | All seven actual predicate combinations verify union. |
| Radius excludes valid Date Night venue | General coordinate and restaurant-distance tests; no seasonal boundary regression | Actual Date Night predicate probes and reference boundary controls added only as audit evidence. |
| Outage fallback is thin but nonempty | Existing test asserts nonempty local fallback and warning | Does not assess selected seasonal coverage or two-anchor-only pool; successful empty/merged path also matters. |
| UI count differs from eligible pool | No seasonal count/options end-to-end assertion found | SSR actual component and JSON round trip agree for primary capture; browser/RPC remains unverified. |
| Duplicate consumes option slots | No seasonal transport/option regression found | Actual option function uses unique IDs; dedupe fixture removes repeated venue; metadata-overwrite defect still untested. |
| Unknown hours differ from known closed | Strict helper has tests, actual predicate not covered | Captured Aurora and synthetic unknown fixtures demonstrate integration mismatch despite passing helper suite. |

Evidence scripts are under the audit directory only. No production test was added or modified. This is targeted verification; no full-suite, typecheck, build, browser acceptance, or CI result is claimed.

## 13. Findings and severity

**Six actionable findings: four IMPORTANT, two NON-BLOCKING; no demonstrated BLOCKER in the current primary reproduction.** Severity is impact-based: the known-closed filter, radius, union, pick/count/options and incomplete-plan guard work in the captured case. Separate unknown/lifecycle policy and metadata defects warrant remediation, but no currently known-closed venue is demonstrated passing ON, no current real permanently closed venue is asserted shown, and no release-blocking count/radius corruption is established. This is not a declaration of release readiness.

| ID | Severity / root-cause class | Exact finding and evidence |
|---|---|---|
| F01 | **IMPORTANT — SOURCE COVERAGE GAP** | Narrow query plus sparse regional anchors misses substantiated seasonal attractions. Carthage raw 281 → seasonal 0; Aurora Maize/Pickin'/Exeter absent before filtering. Exeter's actual `tourism=theme_park` node at 42.06 mi is unqueried but normalizes and passes if supplied. Controls reproduce lack of genuine live seasonal coverage. |
| F02 | **IMPORTANT — INGESTION / CLASSIFICATION GAP** | Every generic maze becomes corn maze. Actual Aurora OSM node 3388827330, Turtle Moon Labyrinth, has only `attraction=maze`; it is counted as a corn maze despite meditation-labyrinth evidence and no corn qualification. Hedge-maze fixture repeats the failure. |
| F03 | **IMPORTANT — FILTERING / ELIGIBILITY GAP** | Strict Open Now and seasonal lifecycle helpers are disconnected from the UI predicate. Unknown live hours pass ON; captured Aurora retains the labyrinth. After-window Werehouse remains selectable OFF in the Nov 1 probe despite helper policy. Qualifying records with disused tags survive synthetic OFF probes. Distinct states and one integrated policy are missing. Not the cause of the OFF primary shortage. |
| F04 | **IMPORTANT — INGESTION / CLASSIFICATION GAP** | First-map deduplication overwrites category evidence for identical rounded name/coordinate keys. Same C/P venue becomes P-only or C-only depending on provider order. Later type-union dedupe cannot repair the loss. Reproduced through actual search handler with controlled transport, not asserted in the primary live data. |
| F05 | **NON-BLOCKING — PRESENTATION / COUNT GAP (status only) + stale availability** | Myer's unconfirmed state is rendered Closed; count remains correct. Fresh operator 2026 calendar now makes the Sept 7 “2025 only” data rationale stale. Frozen state cannot become confirmed through live freshness. This does not explain missing mazes/patches. |
| F06 | **NON-BLOCKING — SOURCE/PRESENTATION DISCLOSURE** | `source=merged`, no warning, and an exact count can hide that all selected-seasonal options are two saved anchors. Valid empty live plus local records returns after one mirror; genuine all-mirror outage correctly warns. Category-specific source contribution/freshness is not disclosed. |

Informational successful checks: straight-line semantics; expected outside-radius controls; category union; closed-venue browsing; exact count/options agreement; unique option IDs for the exercised cases; appropriate incomplete-plan rejection. Provider counts are never treated as real-world totals.

## 14. Root-cause disposition of each missing reference candidate

| Candidate | Earliest supported failure/exclusion stage | Classification and limits |
|---|---|---|
| Myers Forest of Fears | No captured raw or catalog entry | **SOURCE COVERAGE GAP**, conditional operational expectation; closure conflict unresolved. Not a demonstrated bad filter. |
| Cadaver Zone | No captured raw or catalog entry | **SOURCE COVERAGE GAP**, but 2026 status/precise radius unresolved; not a firm required result. |
| Wolfmans | No captured raw or catalog entry | **SOURCE COVERAGE GAP** on current secondary evidence. Cannot distinguish absent OSM record from unqueried tags here. |
| Verona lead → Aurora Maize | No captured raw or catalog entry | **SOURCE COVERAGE GAP**; current operator attraction identified once at Aurora. No downstream radius/open/mood removal. |
| Pickin' Patch | No captured raw or catalog entry | **SOURCE COVERAGE GAP**; explicit seasonal tourism evidence, safely inside. Exact upstream-record cause unresolved. |
| Exeter | Direct OSM record exists but query excludes its tag | **SOURCE COVERAGE GAP — product query construction**, proven. Normalizer can recognize C; extra P/H activity data are absent from that raw record. |
| Campbell's | Outside Carthage cutoff at both available coordinates | **EXPECTED EXCLUSION** in primary. **SOURCE COVERAGE GAP** in nearer controls where it is still absent. |
| Rutledge-Wilson | Outside primary; park-only source tags in controls | **EXPECTED EXCLUSION** in primary. **SOURCE COVERAGE GAP in activity/event metadata** in controls. It is not proof the classifier discarded supplied seasonal tags. |
| Turtle Moon | Outside Carthage; false seasonal classification in Aurora | **EXPECTED EXCLUSION** from primary radius/category; actual control **INGESTION / CLASSIFICATION GAP**, plus unknown-hours eligibility mismatch. |

Myer's Inn and Werehouse are not missing. Neither the absence of a name in these query returns nor an empty Nominatim search establishes absence from all OSM data.

## 15. Exact remediation recommendations — future work only

1. **F01: broaden acquisition with measured precision.** Add bounded complementary queries for relevant theme-park/attraction/farm/haunted-trail representations and explicitly qualified seasonal metadata. Prove Exeter's existing record reaches ingestion. Compose operator/event or other maintained seasonal sources for activities that OSM place tags do not express. Preserve current-year provenance, coordinates and source contribution; benchmark all control origins instead of only Carthage.
2. **F02: require corn evidence for corn-maze classification.** Separate generic/hedge/meditation mazes from agricultural corn mazes using substantiated tags and activity evidence. Retain positive exact-tag and explicit-activity cases; add Turtle Moon and hedge-maze negative cases. Do not solve recall through unrestricted name guessing.
3. **F03: define and integrate one availability policy.** Represent open now, closed now, hours unknown, upcoming season, finished/not-operating season, and permanent closure separately. Apply the approved policy in the real eligibility path, not only helper tests. ON should require positive hours/current-season evidence if retaining the documented strict promise. OFF should continue useful closed/upcoming browsing under clearly stated rules. Handle structural lifecycle tags and refresh hours at meaningful time boundaries.
4. **F04: merge evidence before discarding identity duplicates.** Replace last-write loss with an order-independent merge of categories and provenance, then dedupe/choose representative location and hours deliberately. Verify C/P union survives both input orders, same node/way representations, and ID uniqueness in options. Review nearby distinct-venue merging separately with real evidence.
5. **F05: refresh and display provenance-aware status.** Reverify Myer's current operator calendar in a separately authorized data pass, retain checked dates and confidence, and display schedule uncertainty explicitly instead of Closed. Add expiry/revalidation handling so an unconfirmed record does not remain permanently stale. Keep closure and schedule uncertainty distinct.
6. **F06: disclose selected-category source limitations.** Preserve numeric count as the true eligible count, but identify saved-only seasonal results, missing selected categories, last checked dates and provider health separately. Do not describe successful sparse queries as network outages. Test both valid-empty and all-mirror-failure paths.
7. **Regression layer:** after approved remediation, protect all nine risks in section 12 using real search-handler-to-eligibility fixtures and real component count/options assertions. Include query omissions, maze negatives, metadata order, unknown hours, season boundaries, radius edges, sparse fallback, unique IDs, and plan validity. Follow with browser/RPC verification when available.

## 16. Explicit non-recommendations

- Do not hard-code only the seven Carthage leads or add this audit reference set directly to catalogs.
- Do not inflate counts with generic farms, stores, unverified 2026 operations, meditation labyrinths, duplicate aliases, or ordinary parks relabeled as seasonal attractions.
- Do not widen radius or weaken Open Now/category rules to make a desired count appear.
- Do not treat provider results as exhaustive, four mirrors as four independent inventories, or every missing result as an application ingestion defect.
- Do not suppress or promote a closure-conflicted venue without resolving the evidence; do not treat permanent closure, finished season, closed tonight and unknown hours as the same state.
- Do not equate passing isolated availability helpers with production UI correctness, or this SSR evidence with full browser acceptance.

## 17. Limitations, evidence and reproducibility

The original production GPS/time/network trace is unavailable. The audit origin and frozen Chicago time are explicit. Current public pages can change; direct-source hashes/timestamps and parsed calendar metadata preserve what was observed. Several sources are secondary, conflicting, inaccessible or stale; those qualifications stay attached to the candidate. No claim of complete inventory, exhaustive OSM absence, or definitive closure for Forest/Cadaver is made.

Browser execution was attempted but Chromium was not installed and its download failed with an invalid/truncated ZIP. The actual React source was instead rendered with controlled hooks/state, component stubs and a portal stub. This executes eligibility/actions/count/status/plan validation, but omits browser event wiring, CSS layout, hydration, server RPC, permissions and production rendering. JSON round-trip evidence does not validate the framework transport.

The temporary dependency tree was reused from an existing local checkout, with Node 24.19.0; this was not a fresh install or dependency audit. No production build/migration command was run. Synthetic probes are explicitly separate from live requests. Random pick order can vary; pool membership, counts, unique IDs, classifications and filter results are the assertions of interest.

Evidence map:

| Files under the evidence directory | Purpose |
|---|---|
| `live-probe.mjs`, `live-provider-observations.json`, `live-probe.log`, `carthage-query.overpassql` | Actual search handler, native provider requests and full captured bodies/results |
| `probe.mjs`, `deterministic-probes.json`, `probe-summary.log` | Actual module / AST-extracted UI predicate replay, all combinations, toggles, radius, duplicates, lifecycle, outage/empty cases |
| `render-probe.mjs`, `react-render-evidence.json`, `*-render-*.html`, `render-summary.log` | Unchanged React render and action evidence, with harness boundaries documented |
| `reference-set.json`, `build-reference-set.mjs` | Eleven candidate records, per-origin product distances, provenance, expectations and dispositions |
| `reference-source-probe.mjs`, `reference-source-retrievals.json`, `reference-event-metadata.json` | Direct URL retrieval metadata/hashes and parsed current calendar facts |
| `reference-geocoding.json`, `reference-coordinate-extracts.json`, `aurora-official-map.json`, `exeter-osm-node.json` | Coordinate quality and direct provider identity evidence |
| `source-probe.mjs`, `diagnostic-provider-query.json` | Separate failed broad provider research query, retained honestly |
| `existing-availability-tests.log`, `existing-location-tests.log`, `browser-install.log` | Unchanged targeted tests and browser environment failure |
| `repository-verification.json`, `evidence-manifest.json` | Frozen/ref checks, audit-only final writes, SHA-256 integrity list |

To repeat the deterministic evidence with repository dependencies available, run `TZ=America/Chicago node audit/seasonal-discovery-coverage-audit-1-evidence/probe.mjs` and the analogous `render-probe.mjs`. `live-probe.mjs` and `reference-source-probe.mjs` make new external requests and will capture a new observation, not reproduce an immutable upstream inventory. Do not overwrite retained evidence when comparing later runs. The audit scripts are not production tests and are not application imports.

## 18. Final audit state

Audit completed on the frozen implementation. Six actionable findings are reported; remediation is recommended as a separate task. Required reports and evidence are present. Final tracked implementation/catalog bytes and HEAD remain unchanged; only audit artifacts are new and uncommitted. No remote write or release action was performed. Stop here.

SEASONAL DISCOVERY AUDIT — REMEDIATION RECOMMENDED
