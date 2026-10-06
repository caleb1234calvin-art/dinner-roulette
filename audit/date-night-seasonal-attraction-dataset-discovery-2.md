# Seasonal attraction dataset discovery #2

**SEASONAL ATTRACTION SOURCE DISCOVERY #2 BLOCKED — NO IMPLEMENTATION-READY OPEN SOURCE PATH FOUND**

Reviewed 2026-10-06 UTC. Repository: `caleb1234calvin-art/dinner-roulette`.
Selected source/pair: **none**. Implementation decision: **C. MORE SOURCE RESEARCH**.
Eight candidate datasets/services were screened; three received deeper schema, permission or bounded data evaluation. This is a bounded negative result, not a claim that no suitable US dataset exists.

Seattle's public-domain Building Permits dataset is materially stronger than the Montgomery County benchmark for current-year evidence. Two actual records identify Georgetown Morgue Haunted House 2026, give a complete street/city/state/ZIP address, and describe two bounded temporary occupancy periods. However, its dedicated type fields classify building permits, not seasonal attractions. The attraction and occupancy dates require extraction from administrative text; the records do not establish a public visitor calendar. One record also has an expiration date earlier than its issue date. These findings do not justify source selection or collector design.

## Immutable base and publication boundary

| Identity | Exact value |
| --- | --- |
| Starting SHA | `67ac0654488bb7f02b1c08eef11479c4fe63af04` |
| Starting tree | `e4f9dd2e39334f5c5a5e705fd217c4c36d5625a3` |
| Starting sole parent | `016142008cc451225fee5eb5d56a8d33b38d4735` |
| Starting branch | `research/date-night-seasonal-arader-current-season-compatibility-1` |
| New branch | `research/date-night-seasonal-attraction-dataset-discovery-2` |
| Research sole parent | `67ac0654488bb7f02b1c08eef11479c4fe63af04` |
| Preserved main | `078f65c5d194435452ca14569ea00e57f52a20f3` |
| Preserved production | `dpl_HmqKyiLqCqMSTrhxKktsy9mJtDKy` |

The immutable identity was verified before source research. The exact research SHA/tree are in the final external receipt: a commit cannot embed its own hash. That receipt and its Git bundle identify this exact candidate without rebuilding or recommitting it.

Publication is held. Existing `vercel.json` disables deployment only for `integration/**`. Read-only Vercel evidence confirms the exact starting commit already produced Git-sourced, non-production Preview `dpl_FGfdLT9B3CS7J3eTXWeJJyMee93j`. A normal push of this research branch therefore has an expected Preview side effect. The owner's explicit instruction requires stopping before that push, preserving the reviewed commit identity and asking for authorization. No configuration changes, push, PR, main mutation, production deployment, promotion or alias mutation occurred.

## Candidate comparison

Government/open-data discovery searches prioritized Missouri, Kansas, Oklahoma, Arkansas and surrounding states, then expanded to better documented US sources. Queries targeted attraction classifications, agriculture GIS fields, current-year calendars, annual licenses and temporary occupancy permits. Search hits alone were not accepted as acquired records. No Halloween-title inference, broad category substitution or operator website research was used.

| ID | Candidate and publisher | Evaluation | Decisive finding | Outcome |
| --- | --- | --- | --- | --- |
| C1 | Indiana Grown FallAgritourism GIS; Indiana State Department of Agriculture | Serious: service, layer schema, item | Mixed agritourism/pumpkin scope, no dedicated qualifying activity or season field; item license blank | Reject |
| C2 | Building Permits `76t5-zqzr`; Seattle Department of Construction & Inspections | Serious: metadata and two permit rows | Explicit 2026 haunted-house use and address; Public Domain; permit category/calendar semantics insufficient | Strongest lead, not selected |
| C3 | Amusement Rides registration / eSLA; Wisconsin DSPS | Screen | Annual permits described, but no qualifying completed record, reusable export or grant established | Reject |
| C4 | Fire Permit Status; Seattle Fire Department | Screen for possible C2 corroboration | Public search/status explanation; no row, source-specific reuse grant or structured seasonal category established | No qualified pair |
| C5 | Utah Agritourism farm directory; State of Utah | Screen: one directory example | U-pick not pumpkin-specific; dates lack year; state terms do not establish commercial normalization rights | Reject |
| C6 | Grown in Middlesex County, NJ; county-branded ArcGIS StoryMap | Screen: item metadata | Search leads mention explicit activities; retrieved item has no license and body supplied no usable records | Reject |
| C7 | OpenStreetMap through public Overpass | Serious: license/access review and one bounded query | ODbL is affirmative; official endpoint returned 406; no record acquired | Transport/evidence blocked |
| C8 | Haunted House business licensing; City of Wichita, Kansas | Screen: official blank application | Explicit indoor haunted-house choices and dates-open fields exist in a form, not an obtained license dataset | Reject |

Exactly eight services were evaluated. Montgomery County remains an inherited benchmark, not a ninth request target. No Arader origin request was made. The prior recommendation for operator attestation is superseded by this task's zero-contact direction.

## Permission and automated access

All permission determinations are task-specific evidence reviews, dated 2026-10-06. Public accessibility, government ownership and metadata freshness were never used as substitute grants. Unknown terms are unresolved, not proof of prohibition. No paid service, account creation or card was used.

| Candidate | Applicable evidence and reuse posture | Automated access / key / cost / limits |
| --- | --- | --- |
| C1 | [ArcGIS item](https://www.arcgis.com/sharing/rest/content/items/9e04cc4e7f5d4b9b802184a455b78fed?f=json) has `licenseInfo: ""`. No affirmative commercial, modification or attribution rule established. ISDA program and owner-organization evidence support official identity, not a reuse grant. | Anonymous metadata succeeded. Feature query capability published, but reuse/access policy incomplete; no key/card used. `maxRecordCount=2000` is a response ceiling, not rate permission. |
| C2 | [Publisher metadata](https://data.seattle.gov/api/views/76t5-zqzr.json) declares `licenseId: "PUBLIC_DOMAIN"`, `license.name: "Public Domain"`, `provenance: "official"`, attribution City of Seattle. This is affirmative source-specific reuse evidence supporting factual copying, commercial use and normalization; no named PDDL version was supplied. Preserve publisher/dataset/permit attribution. General portal terms remain incompletely reviewed. | Anonymous JSON reads succeeded without key/card. [Socrata documentation](https://dev.socrata.com/docs/app-tokens.html) permits simple unauthenticated queries and describes lower shared-IP throttling; no fixed free quota or SLA assumed. Portal [terms page](https://data.seattle.gov/stories/s/Data-Policy/6ukr-wvup/) yielded no readable text. |
| C3 | [Official program](https://dsps.wi.gov/a-z-programs-list/amusement-rides/) documents annual registration. That is licensing of rides, not licensing of data; no affirmative downstream data grant established. | [eSLA](https://esla.wi.gov/) is a lookup lead. No authenticated access, form submission or record request; API, key/card and rates unresolved. Business registration fees are not evidence of data fees. |
| C4 | [Official search](https://web.seattle.gov/sfd/permitstatus/) defines permit statuses. No separate data grant established; C2's Public Domain label does not automatically cover this service. | Landing page public and $0 to inspect; no search submitted. API, rate policy and automated reuse unknown. |
| C5 | [State terms](https://www.utah.gov/support/disclaimer.html), copyright limitations, allow personal/informational distribution of unmodified documents. This does not establish the required commercial normalized-data grant; third-party rights are not warranted. | Public directory pages required no account/card. Machine export and automated access authority unresolved. |
| C6 | [Item metadata](https://www.arcgis.com/sharing/rest/content/items/f9fe74b8ac0d4a998983cfd5d56f2f0f?f=json): `licenseInfo: null`, `accessInformation: null`, `access: "public"`. Public access is not a reuse license. County branding is a lead; formal publisher chain not fully established. | Anonymous item metadata succeeded; StoryMap body was not extractable. No reusable feature service or rate terms established. |
| C7 | [OSM copyright page](https://www.openstreetmap.org/copyright) identifies ODbL: commercial copying/adaptation permitted with attribution and applicable database share-alike obligations. Keep OSM provenance; any combined database requires license-boundary review. | [Overpass public-instance guidance](https://dev.overpass-api.de/overpass-doc/en/preface/commons.html) supports bounded research but allows load shedding. Its broad workload guidance is not an SLA. No key/card; live application dependency on a shared public instance would require separate access design. One 406 ended the check. |
| C8 | [City application](https://www.wichita.gov/DocumentCenter/View/8814/Haunted-Houses-Halloween-Houses-Mystery-Mansions-and-Ghost-Walks-Application-PDF) is a blank official form, not an affirmative open-data grant or completed license. | Application readable without account/card; [license landing page](https://www.wichita.gov/344/Business-Licenses) returned 403. No retry, form submission or records request. API and reuse/access terms unresolved. |

The only affirmative reusable-data grants established are Seattle's item-level Public Domain declaration and OSM's ODbL. Neither produces a selected source: OSM yielded no row; Seattle's activity/calendar semantics and remaining policy review prevent an implementation-ready claim. No second source independently passes all required evidence/access gates for a same-attraction join.

## Actual acquired records: Seattle

Source: [Building Permits JSON API](https://data.seattle.gov/resource/76t5-zqzr.json). Query selected only permit facts and location, filtered descriptions containing HAUNTED and issue dates from 2026-01-01, ordered newest first, limit three. It returned two records; no pagination. This was a discovery filter, not a production activity classifier. The exact request, timestamps, response hash and factual extracts are in the evidence directory.

| Fact | `7160133-CN` | `7160149-CN` |
| --- | --- | --- |
| Exact short identity/activity/year phrase in description | Georgetown Morgue Haunted House 2026 | Georgetown Morgue Haunted House 2026 |
| Dedicated category fields | Industrial / Building / Temporary | Industrial / Building / Temporary |
| Issue date | 2026-09-08 | 2026-09-08 |
| Expiration date as published | 2026-09-03 | 2028-03-08 |
| Permit status as published | Completed | Issued |
| Occupancy period extracted from description | 2026-09-19 through 2026-10-18 | 2026-10-19 through 2026-11-07 |
| Street | 5000 EAST MARGINAL WAY S | 5000 EAST MARGINAL WAY S |
| City/state/postal | SEATTLE / WA / 98134 | SEATTLE / WA / 98134 |
| Latitude / longitude | 47.55724818 / -122.33836450 | 47.55724818 / -122.33836450 |

These are **actual attraction-referencing permit rows**, not rows satisfying every selection gate. Their administrative description explicitly names a haunted house; it is not an inferred Halloween title or marketing claim. Nevertheless, the structured classifications are permit categories. A normalized `haunted-house` value would be a reviewed text extraction (B), not a source-published category enum (A). No canonical operator entity is supplied.

The description explicitly ties the use to 2026, so this is real current-season evidence of permitted seasonal use, stronger than a recent update timestamp. Year-qualified occupancy boundaries are B derivations from month/day ranges plus the explicit year. They are not evidence that the attraction admits visitors every day in those intervals. No individual operating dates, weekday schedule or visitor hours were obtained. The first permit's expiration precedes issuance; the second's expiration extends into 2028. Neither expiration can safely substitute for the attraction season end. Permit `Completed` and `Issued` describe administrative workflow; neither is automatically a Seasonal Fact Contract lifecycle assertion.

The name, identical address and a shared review-reference number in the descriptions support a same-attraction lead within this one dataset. The field `parentpermitnum` exists in the schema but was not requested; do not claim a returned structured parent join. `permitnum` is documented as a permit tracking number. It identifies an administrative record, not a perpetual venue or attraction. A seasonal refresh must not create a new venue merely because a new permit is issued.

Address fields are all directly published (A); country US is a reviewed jurisdiction derivation (B) from Seattle, Washington. No component was geocoded or invented. Latitude and longitude are directly supplied and named, so order is unambiguous. The publisher describes them as worksite coordinates. CRS/datum, entrance semantics and uncertainty were not established. Decimal precision supplies no accuracy estimate. These points cannot be declared contract-verified from the retrieved evidence alone.

## Structured-field inventory

A = directly published; B = reviewed deterministic extraction/derivation; C = identified need for another permission-qualified source (none qualified here); D = absent or unresolved. A schema field without an acquired value is explicitly marked schema-only, not claimed as an actual attraction fact. Full machine-readable inventories are in `candidate-assessments.json` and `source-schema-evidence.json`.

| Field | C1 Indiana | C2 Seattle | C7 OSM |
| --- | --- | --- | --- |
| Native ID | A schema-only `ObjectID`; durability unproven | A `permitnum`; permit-scoped | D; no returned element |
| Attraction name | A schema-only `USER_BusinessName` | B extract from description | D |
| Qualifying category | D; dataset scope too broad | B haunted-house text extraction; dedicated field D | D; proposed tag filters not observed records |
| Operator/venue identity | D | D canonical operator; B name/address relationship | D |
| Street/city/state/postal | A schema-only USER fields; ZIP numeric | A four `original*` fields | D |
| Country | D values; geocoder country-code input exists | B US jurisdiction | D |
| Latitude/longitude | D geographic values; X/Y schema exists | A named latitude/longitude | D |
| CRS | A service WKID 26916 | D explicit datum | D retrieved evidence |
| Point meaning / uncertainty | D | A worksite description; D entrance/accuracy | D |
| Website / phone | A website schema-only / D phone | D attraction website/phone; permit link schema is not operator website | D |
| 2026 dates / hours | D / D | B occupancy intervals; D visitor dates/hours | D / D |
| Season | D | B explicit description year 2026; not metadata freshness | D |
| Status/lifecycle | D operation; `Status` appears in geocoder output | A permit workflow; D attraction lifecycle | D |
| Per-row update | D | D not selected/established | D |
| Dataset update | A edit timestamp 1665060673191 | A `rowsUpdatedAt=1791249547`, daily refresh | D for returned data |

Other screens: Wisconsin and Seattle Fire yielded no attraction fields as records. Utah's inspected Rocky Top Fruit Farm page directly gives address and undated seasonal/day schedules, but generic U-pick is not pumpkin picking and no 2026 year is supplied. Middlesex yielded item metadata only: search snippets mentioning corn mazes/pumpkins and September/October dates remain leads. Wichita's blank application exposes prospective name/address/ZIP, indoor haunted-house choices, dates and hours, but has no completed row values. The form's outdoor walk/field options were not accepted as haunted houses.

## Implementation readiness

This assessment uses explicit descriptions instead of a misleading aggregate score. All ten requested dimensions are assessed for the three serious candidates.

| Dimension | C1 Indiana | C2 Seattle | C7 OSM |
| --- | --- | --- | --- |
| 1. Permission clarity | Fails: blank license | Strong item Public Domain declaration; general policy review incomplete | ODbL clear; attribution/share-alike must be designed |
| 2. Explicit category | Fails: mixed dataset scope | Exact administrative text; no dedicated attraction classification | Unproven: no tag-bearing row |
| 3. Current season | Missing | Explicit 2026 permitted use; actual operation remains bounded by permit semantics | Unproven |
| 4. Address completeness | Schema supports four parts, no row tested | Complete four parts plus reviewed US derivation | Unproven |
| 5. Coordinates | Projected CRS known; values/meaning untested | Lat/lon and worksite meaning; datum/accuracy unresolved | Unproven |
| 6. Identity durability | ObjectID only, no permanent-ID guarantee | Permit tracking ID useful; venue identity needs review | Potential element IDs; no acquired identity |
| 7. Calendar | No fields found | Bounded occupancy periods; public visitor calendar absent | Unproven |
| 8. Access reliability | Metadata succeeded | Two JSON responses succeeded; portal/docs retrieval gaps | Single 406; stopped |
| 9. $0 suitability | Metadata free; authorized data use unproven | No-key JSON demonstrated; shared-IP throttle | Free research access documented, current transport failed |
| 10. Contract complexity | Rights/data gaps precede design | JSON/SoQL transport plus semantic and coordinate decisions; not A | Data absent; ODbL/provenance and transport remain |

Only transport/query changes are not enough to make C2 safe to ingest. v1 accepts `text/html`, `text/plain`, `application/ld+json`, not ordinary `application/json`. Its query-name allowlist excludes Socrata's dollar-prefixed parameters; value length limits also conflict with the inspected projection. Those are narrow transport issues already understood in the prior JSON review. Separate unresolved issues are attraction classification, visitor-calendar semantics, lifecycle interpretation and coordinate verification. Do not stretch v1 by presenting all permitted occupancy days as operating days, or by labeling government coordinates operator-published.

v1 requires an explicit nonempty calendar and reviewed coordinates for runtime eligibility. Its coordinate methods lack a direct government-published method; whether an honestly reviewed-map path is sufficient needs actual supporting evidence, not a relabel. Selected observations must support the explicit occurrence year. The prior static-A/season-only-B provenance issue remains unchanged.

No two-source architecture is established. C2 plus C4 lacks a second row and second grant. C2 plus C7 lacks any returned OSM identity/category row and would require a reviewed crosswalk and ODbL boundary. Even if later supported, independent source roles must remain separate; unchanged v1 cannot simply borrow a season assertion across observations. No multi-source extension was designed or implemented here.

## Request accounting and exclusions

The direct HTTP helper made six controlled GET attempts: five successful JSON bodies and one OSM 406. Each used a single attempt, a 12-second client timeout, no redirect following, no automatic retries, and a 2 MiB response cap. Seattle's row request was limit three and returned two. No data collector was run: these were isolated research reads.

To avoid understating the limit, the ledger also counts dataset landing pages, public service/form inspections and one failed link-resolution action. These give 16 conservative candidate-directed actions across the eight candidates; none exceeds three. Policy/program documentation and discovery search are listed separately; provider-internal HTTP counts cannot be observed and are not claimed. Detailed URLs, successful-byte hashes and known failures are in `network-summary.json`.

| Candidate | Conservative candidate-directed actions | Actions |
| --- | ---: | --- |
| C1 | 3 | Service HTML; layer metadata; item metadata |
| C2 | 3 | Dataset landing failure; metadata JSON; bounded row JSON |
| C3 | 2 | Program page; unsuccessful public-lookup link resolution (no page retrieved) |
| C4 | 1 | Public permit-status search landing |
| C5 | 2 | Directory home; one farm listing |
| C6 | 2 | StoryMap body; item metadata |
| C7 | 1 | Bounded Overpass request, 406 |
| C8 | 2 | License landing 403; blank application PDF |

No identical automatic retries followed transport failures. Seattle's JSON API requests used different documented resources after a failed display-page request; no challenge or access-control bypass was attempted. No alternate user agents, mirrors, proxy services, HTTP downgrade, browser challenge handling or bulk crawling were used. OSM's failure proves only that this one access path failed in this environment; it does not prove no qualifying OSM records exist. An independently run Termux check could later provide transport evidence, but none occurred here and no owner-side result is fabricated.

Operator contacts = **0**; Arader origin requests = **0**; permission requests = **0**; collector calls = **0**; geocoder calls = **0**; paid API calls = **0**; executable changed paths = **0**. No reviews, ratings, images, logos, promotional descriptions, testimonials or personal applicant records were retained. Evidence contains short administrative fact extracts, schemas, permission indicators and request receipts. Raw service bodies containing unrelated descriptions or account details are not committed.

## Validation and exact next task

Validate JSON syntax, additions-only paths, every preexisting leaf's object ID/type/mode, absence of executable additions, `git diff --check`, and sensitive content before committing. Then record exact SHA/tree/sole parent, clean worktree, unchanged remote main and production/aliases in the final receipt. No migrations, dependency installation, implementation builds or application tests are appropriate for this documentation-only task. The remote research branch remains unpublished; post-publication readbacks cannot be claimed before authorized publication.

**Recommended next task: SEATTLE GEORGETOWN MORGUE OPEN CATEGORY AND 2026 VISITOR-CALENDAR SOURCE QUALIFICATION #1 — ZERO CONTACT.** Reuse the retained two permit records and existing permission evidence. Seek one openly reusable structured city/fire/tourism record that directly classifies the attraction and supplies actual 2026 visitor dates/status; prefer a single replacement source that also carries address. Require an actual row, exact reuse/access authority and same-attraction crosswalk before considering a pair. Treat the first permit's date conflict as unresolved. Do not repeat this task's exhausted Seattle request budget or bypass OSM/other failures; any further bounded endpoint checks belong to a separately authorized task. If no qualifying public record exists, stop blocked without operator outreach. Only after those evidence gates pass should a narrow contract design be proposed. A collector remains unauthorized.

This task cannot yet leave source discovery. It narrows the missing evidence from a wholly uncorroborated season to explicit public-calendar/category qualification around an acquired 2026 administrative record, while preserving the zero-contact, $0 boundary.
