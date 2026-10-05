# Pick For Us — NYC Parks Seasonal Source Compatibility Review #1

**NYC PARKS SEASONAL SOURCE COMPATIBILITY REVIEW BLOCKED — CURRENT QUALIFYING RECORD NOT ESTABLISHED**

Reviewed 2026-10-05, America/Chicago. Target: NYC Parks Public Events — Upcoming 14 Days, `w3wp-dpdi`, Department of Parks and Recreation (DPR) / NYC Open Data. Research and design only. No source is selected or activated.

Three new, distinct, bounded SODA2 row requests all timed out before an HTTP response. **Successful row endpoints: none. Rows obtained: 0. Qualifying 2026 occurrences: 0. Qualifying activity evidence: none.** The six-request maximum was a ceiling, not a requirement to send redundant requests: after a targeted query, a one-record projection, and a one-field diagnostic failed identically, row access stopped at three. Remaining allowance is not authorization for another attempt in this completed review. A timeout does not establish dataset emptiness, a source prohibition, closure, or a site-wide outage.

The general factual-reuse basis remains supportable; it is **not CC0**. Current portal terms were retrieved successfully and their substantive text matches the retained prior response. An address/coordinate route is conceivable with further official evidence, but not established. Narrow JSON and query proposals are supplied separately; neither has been implemented or empirically validated against a row.

## Exact Git boundary

| Item | Value |
| --- | --- |
| Starting SHA | `6a31e3a3da3fc2775eb06a9aed7e4f367e6ae5c4` |
| Starting tree | `4f7229124dd4688f64f1dd30d98241150a1586a4` |
| Starting sole parent | `a85a52511b99ecfbf19e50eb1cd9292cb63eb59d` |
| Starting branch | `research/date-night-seasonal-licensed-source-discovery-1` |
| Publication branch | `research/date-night-seasonal-nyc-parks-compatibility-1` |
| Preserved main | `078f65c5d194435452ca14569ea00e57f52a20f3` |
| Preserved production | `dpl_HmqKyiLqCqMSTrhxKktsy9mJtDKy` |

Local commit identity was the first substantive verification. Remote starting branch and main matched; a separate clean worktree was created from the exact base. This report's introducing commit has that base as its sole parent. Final SHA/tree/parent and post-publication readbacks are in the downloadable final report; a commit cannot embed its own hash. Resolve the report's introducing commit with Git, then inspect its tree and parents.

The complete contract implementation, README, source policy, original/remediation reports, remediation validation/scope evidence, Pilot #1 blocked report, Candidate Selection #2 report, and Licensed Discovery #1 report/evidence were inspected. Original and remediation evidence manifests verified 17 and 38 payloads respectively. Retained NYC metadata, robots and portal-terms bodies independently matched their committed SHA-256 values. Historical test results are not claimed as fresh tests.

## A. Permission and applicable conditions

**Exact permission conclusion:** NYC's published statutory/open-data policy permits use of covered public factual datasets without registration, license, or use restrictions, subject to its stated conditions. Commercial factual reuse and factual normalization remain compatible with that policy as a research interpretation of its unrestricted-use language and express treatment of modified/re-published data. This is not a blanket grant for protected expressive or third-party content, and not a current source activation approval.

Evidence:

- [Public Policies](https://cityofnewyork.github.io/opendatatsm/publicpolicies.html) reconfirm the public-dataset use framework and possible source/version/modification disclosure requirements; protection and fair-use-of-capacity measures remain permitted.
- The City's [published Local Law 11 text](https://cityofnewyork.github.io/opendatatsm/LocalLaw11of2012.html), sections 23-501 and 23-502(d), distinguishes covered non-narrative factual data from protected material and contemplates republication and applications. This is a historical city-published law text, not a newly verified complete 2026 codification.
- [Portal terms](https://data.cityofnewyork.us/stories/s/Terms-of-Use/k9k7-3cje) returned HTTP 200, 286,969 bytes, in this review. The embedded public policy text was decoded as inert JSON/text; no page code ran. It incorporates NYC terms, privacy policy, and applicable provider conditions. Agencies remain authoritative and control versions; data can change and older portal versions need not be retained.
- Current [NYC general terms](https://www.nyc.gov/main/terms-of-use) retain intellectual-property protections, bar disruption and false affiliation, and disclaim warranties. The incorporated privacy-policy retrieval did not yield content through the reference tool; no account, cookies, or personal submission was used. No dataset-specific additional grant or restriction was established in the reviewed metadata. Do not infer that none could exist elsewhere.

The narrower open-data framework supports covered facts alongside the general IP reservation; the reservation cannot be ignored for prose, photographs, linked media or third-party works. Select only the 11 factual columns below. Exclude `description`, `registration_description`, `image`, `instructor`, `registration_url`, marketing text, reviews and ratings. Do not fetch links or media. A title is retained only as a short event identifier, not as a promotional paragraph; an expressive or ambiguous value fails review.

For a future approved adapter, treat attribution as required: identify DPR / NYC Open Data, dataset name and ID, dataset URL, source update/version timestamp, fetched/checked timestamps and the reduced-content hash; disclose field selection, normalization, category decisions, time interpretation and any address enrichment. Keep the agency's version distinct from our adapter/review version. The policy permits requiring these disclosures; it does not assign a named Creative Commons license. Do not invent a license identifier or imply City endorsement. Retain an as-is/independent-normalization notice and review validity/expiry. Do not publish a fabricated modification or event-version date when none was observed.

## B. Ordinary access and current-record verification

Exact encoded URLs and parameters are retained in `date-night-seasonal-nyc-parks-compatibility-1-evidence/network-summary.json`.

| Request | Query purpose | Limit | Result |
| --- | --- | ---: | --- |
| R01 | Eleven factual fields; 2026 date bounds; exact activity phrases in title; `starttime ASC,guid ASC` | 5 | Timeout; no HTTP response/body |
| R02 | `guid,title,starttime,endtime`; no filter or order | 1 | Timeout; no HTTP response/body |
| R03 | `guid` only; no filter or order | 1 | Timeout; no HTTP response/body |

All use `https://data.cityofnewyork.us/resource/w3wp-dpdi.json`, ordinary anonymous GET, default curl user agent, no redirects/retries, 5-second connect / 10-second total bounds, 64 KiB response cap, concurrency one. No access-control challenge was bypassed and no origin rejection was observed. Three is the total new row-data request count across this review; rows were not fetched by a reference service, scraper, proxy service or browser.

Additional direct requests: metadata M01 timed out, robots M02 timed out, portal terms M03 succeeded. Direct attempts total 6, comprising 3 row requests and 3 metadata/policy requests; 1 HTTP 200 and 5 timeouts. Metadata/robots failures prevent claiming a fresh successful observation. Prior metadata and robots successes are explicitly historical evidence. Search/reference actions only examined policy, documentation and dataset metadata, never event rendered pages as a substitute for the data API.

The prior metadata was obtained at `2026-10-05T06:24:51.605880Z`; its latest data-update value was `2026-10-04T13:34:50Z` (`1791120890`). This remains the **last directly observed update timestamp, not a freshly established current one**. Search-indexed portal metadata showed an October 3 update and the federal catalog an older September date; neither overrides the direct retained metadata or proves event freshness. Official status and DPR attribution are supported by hash-verified metadata (`provenance: official`) and the official indexed catalog. No 2026 occurrence follows from those timestamps.

## C. Source field inventory and fact suitability

The retained schema has 16 columns. Eleven are candidates for factual projection; actual row values are all unobserved in this review.

| Source field | Source type | Proposed use / unresolved requirement |
| --- | --- | --- |
| `guid` | number | Native unique identifier per schema; preserve losslessly as decimal text; persistence/reuse semantics across feed refreshes unverified |
| `title` | text | Event display name and possible explicit activity evidence; never eligibility by keyword alone |
| `link` | URL | Event's published link; actual URL, HTTPS, host and representation unverified; never automatically followed |
| `starttime` | calendar_date / floating timestamp | Explicit local occurrence date/time and year if present |
| `endtime` | calendar_date / floating timestamp | End date/time; interval, overnight and recurrence semantics must be reviewed |
| `parkids` | text | Property/subproperty identity lead; keep full ID, no name/proximity merge |
| `parknames` | text | Named venue lead; not operator identity or a street address |
| `location` | text | Location within park/property; cannot assume complete postal address |
| `categories` | text | Parks calendar categories; do not equate Halloween or harvest with a qualifying activity |
| `coordinates` | text | Published event-location coordinate candidate; CRS/order/precision review still required |
| `contact_phone` | text | Optional event contact; retain only a valid appropriate factual phone |
| `description`, `registration_description`, `instructor` | text | Excluded |
| `registration_url`, `image` | URL | Excluded; no linked content retrieved |

Identity should namespace `guid` with publisher/dataset. Contract occurrence identity additionally needs reviewed attraction identity, season, year and immutable occurrence key. A property ID is a venue crosswalk, not an occurrence ID. DPR's role as publisher/park manager does not prove it operates every listed event; the organizer/operator remains unresolved. Separate venue, attraction, operator, occurrence and physical-location version. Do not merge two events at one park.

Only affirmative evidence of `haunted-house`, `corn-maze` or `pumpkin-patch` qualifies. Halloween, harvest, fall festival, pumpkins for sale, costumes, generic spookiness, trick-or-treating, hayrides and generic park festivals are insufficient. Even an exact phrase can be negated or merely a topic; a reviewer must establish the activity actually occurs. No such evidence was obtained. Do not fetch descriptions to fill this gap under this review.

Explicit 2026 start/end dates could support `seasonEvidence.basis = explicit-event-dates` after occurrence/season review. They do not turn every October activity into Halloween eligibility. A continuous multi-day interval cannot be inferred to operate every intervening day without source semantics. Socrata's [floating-timestamp documentation](https://dev.socrata.com/docs/datatypes/floating_timestamp.html) confirms there is no intrinsic timezone. `America/New_York` is a plausible reviewed geographic derivation, not a received row field. No UTC conversion, DST ambiguity resolution or timezone assertion was made.

There is no dedicated lifecycle field. A listing might support a reviewed scheduled/active assertion; it cannot erase a negative ledger fact. Feed disappearance after fourteen days is not cancellation, closure or deletion. All source observations, rejected/conflicting assertions and provenance must remain immutable/retained under the existing builder. Future observations need dataset ID, native ID, exact query template/version, endpoint, reduced-content hash, adapter/version, retrieval/check time and reviewer. Do not populate `operatorWebsite` with the portal event link. The current builder requires an asserted `sourceUrl` to equal the observation's canonical URL: a dataset query URL and an event link cannot silently be substituted for each other.

## D. Complete location and coordinate assessment

The actual `schema.ts` requires an address in both the physical location and published facts: nonempty `street`, `city`, `state`, `postal`, and two-uppercase-letter `country`, maximum combined length 500. Street and postal are mandatory, not optional. `factsSchema` also requires name, activity types, calendar, timezone, coordinates, season and verification. The builder requires reviewed entities/eligibility, explicit current-season evidence, no unresolved fact conflicts, and no applicable negative lifecycle barrier.

| Question | Answer |
| --- | --- |
| Can the event dataset alone satisfy the contract? | Not established; the schema has no structured street/postal address, and no row was obtained. Park name plus within-park location is insufficient evidence. A rare complete address embedded in a factual location value would still require individual review. |
| Can city/state/country be constants? | NYC geographic scope can support explicitly reviewed jurisdictional derivations, with scope evidence and normalization recorded. It does not make them source-published address fields. New York City is not a substitute for every borough's postal locality, and scope must not be used to invent street/postal values. Silently injecting constants would lose provenance. No derived address was emitted. |
| Are street/postal mandatory? | Yes in unchanged v1. Empty strings, `unknown`, `00000`, park IDs or invented addresses are not acceptable factual substitutes, even if a loose text validator could accept them. |
| Is a source-published point sufficient? | Only after all existing review and address-binding requirements are met; publication alone is not verification, and a point cannot replace the mandatory address. |
| What does the coordinate represent? | The source metadata describes an event-location latitude/longitude value. It does not prove the event entrance, park centroid, parcel centroid or public access point. |
| What CRS/order is documented? | Text metadata names latitude and longitude but gives no formal CRS, delimiter/order serialization or precision rule. WGS84 and lat-first serialization are not established by that wording. This is a text column, not a Socrata Point/GeoJSON field; Point datatype documentation cannot confer its CRS/order on this column. |
| Can it fit the point-meaning enum? | v1 accepts `entrance`, `venue`, `parcel-centroid`, `unknown`; verified points cannot be `unknown`. An event-location point can map to `venue` only after evidence ties it to the event venue/location, not merely because it plots inside NYC. No such mapping was made. |
| Can a reliable fingerprint be made without paid geocoding? | Yes computationally once an evidence-backed complete address exists: the existing local deterministic address hash needs no geocoder. No reliable contract fingerprint can currently be produced from this dataset evidence alone. A hash of incomplete/guessed input is not reliable just because it is deterministic. |

Verified points must carry non-null lat/lon, `crs: WGS84`, a supported method, uncertainty in meters, reviewer/time, nonempty evidence/source IDs, known point meaning and matching address fingerprint. Builder checks bind coordinate evidence to the same location version and require an exactly matching coordinate assertion. Source IDs must match referenced evidence. A point obtained from a general directory is not automatically `operator-published`; that method requires establishing the publisher's authority for the particular venue/event. Candidate/unresolved points remain quarantined.

Proposed supporting dependency: an official NYC Parks property/address dataset keyed by full Prop_ID, with documented street/postal address and coordinate semantics. The exact suitable dataset/schema has **not** been selected or fetched; this review did not need a second dataset to establish that the event feed's current evidence is incomplete. A later bounded authorization must verify permission, key cardinality/subproperties, dated address, postal locality and event-location relationship. A park polygon/centroid dataset alone would not solve the missing street/postal or entrance issue. No geocoder was called.

Additional model caution: every selected observation currently needs explicit season/year evidence. An old static park-address row cannot be relabeled as a 2026 seasonal event. Any supporting observation must be tied by an explicit reviewed current-occurrence corroboration with honest provenance; whether the existing observation shape adequately expresses that composite derivation must be resolved before adapter implementation. If it cannot, a separately authorized location/provenance contract design is needed. Do not relax the rule in an adapter.

**Location status:** standalone feed is not presently publishable/radius-ready. A supporting official-address plus reviewed-coordinate route is unverified, not proven impossible; therefore the overall decision is BLOCKED, not a definitive claim of irreparable contract unsuitability. JSON/query design alone cannot clear this blocker.

## E–G. Contract proposals and zero-cost architecture

See [compatibility design proposal](date-night-seasonal-nyc-parks-compatibility-1-design.md) for exact JSON limits, strict-envelope evolution, plain-data parsing, deterministic serialization, and source-specific query templates. The recommendation is **B: an exact internally generated `$where` template**, not arbitrary SoQL. These are provisional requirements for a future independently tested design, not implemented capabilities.

The [City API standards](https://cityofnewyork.github.io/opendatatsm/publicstandards.html) document SODA. [Application-token guidance](https://dev.socrata.com/docs/app-tokens.html) documents simple anonymous queries, a shared IP-based quota and HTTP 429 throttling; it promises no numerical anonymous quota. [Current endpoint documentation](https://dev.socrata.com/docs/endpoints.html) distinguishes SODA2 `/resource/` from SODA3. SODA3 query requests require authentication or a valid token; do not migrate to it or claim all current SODA versions meet the no-key requirement. The anonymous SODA2 route remains a documented proposal whose live availability was not demonstrated here.

Proposed core: public anonymous HTTPS, no account/key/card, one worker, fixed factual projection, at most one bounded row request per 24 hours after approval, manual review before publication, no pagination/full export, no automatic retry and no credential/paid fallback. Daily source updates support that modest cadence, not a guaranteed quota. Stop on 429, retain the last good snapshot without advancing checked time, and require review before resuming; never circumvent shared-IP limits. Observe at least the previously published one-second interval and any stricter fresh policy. Fresh robots remains unresolved. No paid quota, proxy, geocoder or reseller is part of the design; operating availability at $0 is still unproven because row access failed.

## H. Gate decision and continuation

| GO requirement | Finding |
| --- | --- |
| Affirmative factual permission | General basis supported, current portal terms matched; full activation gate remains unapproved |
| Ordinary row access | Not demonstrated |
| Real 2026 allowed-category occurrence | Not established; zero rows/qualifying evidence |
| Identity and field provenance | Schema-level route only; no actual occurrence/operator identity |
| Location/coordinate feasibility | Unresolved supporting-address, CRS, precision, point-meaning and derivation path |
| Expressive exclusion | Narrow projection feasible by design; no row-level proof |
| $0 operation | Proposed SODA2 architecture; live feasibility unresolved; SODA3 token requirement excluded |
| Narrow JSON support | Design supplied; no implementation or validation |
| Narrow query support | Exact-template design supplied; no implementation or validation |

**Exact next recommendation:** keep the source pilot, contract changes and adapter implementation on hold. A separately authorized bounded evidence follow-up should first demonstrate ordinary anonymous SODA2 access to a real 2026 qualifying event and refresh metadata/robots. Only after that should it verify the specific park's complete official address, coordinate CRS/order/meaning/uncertainty and event timezone, including the supporting source and current-season provenance path. If those succeed, finalize the design and commission offline adversarial contract-adapter verification before any collector authorization. If ordinary anonymous access is unavailable, stop; no SODA3 token, paid route, mirror, browser workaround or broader crawl is approved. No outreach was sent.

## Publication and preservation

Only this report, a prose design proposal, reduced public evidence/network JSON and a continuation handoff are added. All additions are non-executable `100644`. Existing source code, source registry, generated synthetic artifacts, dependencies/lockfile, workflows, Vercel config and runtime files must be byte/object/mode identical to the immutable base. No real-source contract/runtime data is generated.

Collector calls = **0**. Geocoder calls = **0**. Paid API calls = **0**. Executable changed paths = **0**. No source registration, activation, merge, main push, production mutation, manual deployment or migration. Administrative readbacks are separate from source research. Main and production were verified before publication; the final delivery records post-publication results, including the two production-domain mappings. No raw administrative payloads, credentials, cookies, internal transport diagnostics or event prose are published.

Validation is proportional: JSON parse, documentation diff review, whitespace check, exact sole-parent identity and full preexisting-tree object/mode comparison. No builds, dependency install, regeneration or product tests are needed for this documentation-only delta.
