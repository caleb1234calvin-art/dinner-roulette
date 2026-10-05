# Pick For Us — Seasonal Source Licensed-Data Discovery #1

**SEASONAL LICENSED SOURCE DISCOVERY #1 BLOCKED — NO QUALIFYING LICENSED SOURCE**

Reviewed October 5, 2026 (America/Chicago). Five datasets/services were evaluated; **none is selected**. This is a bounded research result, not a claim that no qualifying source exists anywhere. The research found affirmative reuse evidence, but no candidate satisfied permission, obtainable current records, and the existing contract together. No collector or source activation is authorized by this report.

## Immutable Git identity

| Item | Exact value |
| --- | --- |
| Starting SHA | `a85a52511b99ecfbf19e50eb1cd9292cb63eb59d` |
| Starting tree | `8a33a351038eee655de7a81629b47a1305dd41cd` |
| Starting sole parent | `bdd8b92e81d9f54a99c4e4c52aa54d7d3609b2d9` |
| Starting branch | `research/date-night-seasonal-source-candidate-selection-2` |
| Research branch | `research/date-night-seasonal-licensed-source-discovery-1` |
| Main before publication | `078f65c5d194435452ca14569ea00e57f52a20f3` |

The first investigation verified the local SHA/tree/sole parent before source discovery. Remote starting-branch and main readbacks matched. A clean, isolated worktree was created at that exact commit. The introducing research commit has this starting SHA as its sole parent. Its exact SHA/tree/parent and post-publication readbacks are recorded in the separately delivered final report; a Git commit cannot embed its own final hash.

## Candidate decisions

| Candidate | Explicit reuse evidence | Current structured record verification | Decision |
| --- | --- | --- | --- |
| Missouri Farmers' Markets (`2zg8-cta8`) | No affirmative grant established | Official catalog metadata; direct schema request timed out | Reject: license unknown; no qualifying seasonal occurrence verified |
| NYC Parks Public Events — Upcoming 14 Days (`w3wp-dpdi`) | Affirmative city open-data policy for public factual datasets; no named dataset license | Official schema, robots and terms retrieved; both bounded row requests timed out | Reject for this task: no actual event sample/current qualifying occurrence; unresolved contract fit |
| National Park Service Events API | Official API-use invitation plus qualified NPS public-domain policy | Key required; no key supplied or obtained; no event response verified | Reject for this task: sample/current activity/complete fact coverage unverified |
| USDA National On-Farm Market Directory | **CC0 1.0 explicitly assigned in official catalog** | Legacy Excel link; catalog modified date 2015; current event-year records not verified | Reject: current seasonal-event coverage/access not established |
| Art Institute of Chicago Events API | Events have a restricted use statement, **not the collection-data CC0 grant** | Documentation reviewed; stopped at reuse mismatch | Reject: no affirmative commercial event-data grant |

Other search hits, including NYC event permits and regional portal landing pages, were discovery leads only. No sixth dataset/service was substantively evaluated.

## 1. Missouri Farmers' Markets

- **Publisher/official status/geography:** State of Missouri, `data.mo.gov`; official state catalog record, Missouri-wide. [Catalog](https://catalog.data.gov/dataset/missouri-farmers-markets).
- **Dataset/API:** [Dataset](https://data.mo.gov/d/2zg8-cta8); [schema metadata](https://data.mo.gov/api/views/2zg8-cta8.json); catalog distribution: `https://data.mo.gov/api/v3/views/2zg8-cta8/query.json?accessType=DOWNLOAD`.
- **License/reuse URL:** no explicit license URL established. The catalog supplies a public access level, not an affirmative reuse grant. Its omission does not prove that no grant exists elsewhere. Commercial reuse, attribution obligations and modification permission remain **UNKNOWN**.
- **Automation/key/billing/rate:** the catalog advertises structured JSON/XML/CSV/GeoJSON distributions. Generic Socrata documentation permits simple unauthenticated API queries (E07), but dataset-specific successful retrieval and access conditions were not verified. No billing or card requirement was encountered; a fully verified $0 access path was not established. No numerical source rate limit established.
- **Robots/access:** robots not requested. The single bounded metadata request D01 timed out before any HTTP response; no retry, authentication or workaround.
- **Fields/2026/cadence:** catalog describes farmers' markets and a Monday–Friday 8:30 PM update schedule (timezone unspecified). Catalog metadata has a September 2026 modification date. Row-level column schema, 2026 occurrence dates and the three required activity categories were not verified. A recent catalog timestamp is not evidence that a specific market operates in the 2026 season.
- **Expressive exclusion/adapter:** structured-column selection is plausible, but field-level factual extraction and contract fit are unproven. A farmers' market or pumpkin seller must not automatically become a pumpkin patch.
- **Result:** NO-GO; permission and qualifying factual coverage not established.

## 2. NYC Parks Public Events — Upcoming 14 Days

### Authority and exact permission evidence

Publisher: New York City Department of Parks and Recreation (DPR), through NYC Open Data. [Dataset](https://data.cityofnewyork.us/City-Government/NYC-Parks-Public-Events-Upcoming-14-Days/w3wp-dpdi). Direct metadata D02 reports `provenance: official`, attribution to DPR, and a tabular dataset. The source covers public events on NYC park properties, not Missouri/four-state attractions.

License name: **NYC statutory/open-data policy; no CC/ODC license identifier supplied in retrieved dataset metadata**. Do not label this CC0.

The city's [Public Policies](https://cityofnewyork.github.io/opendatatsm/publicpolicies.html) (E04) explicitly permits public-dataset use without registration/license/use restrictions, subject to the stated conditions. Its [published Local Law 11 text, §23-502(d)](https://cityofnewyork.github.io/opendatatsm/LocalLaw11of2012.html) (E05) says: **“without any registration requirement, license requirement or restrictions on their use”**. The same subsection expressly addresses republication, applications and disclosure of modifications. This is affirmative policy evidence, not an inference from `.gov`, indexing or robots. E05 is the city's published 2012 law text, not represented as a complete independently verified 2026 codification.

**Commercial use/normalization:** supported for covered public factual datasets by this unrestricted-use policy; that is the research interpretation of the explicit policy. It is not a blanket license for every narrative, photograph or third-party contribution. **Attribution:** the city may require source, version and modification disclosure; a future adapter should retain all three, with DPR, the dataset ID, retrieval/version date and normalization details.

Current [portal Terms of Use](https://data.cityofnewyork.us/stories/s/Terms-of-Use/k9k7-3cje) (D05/E06) incorporate general NYC terms and provider-specific conditions. The fetched HTML contains a JSON story object; it was inspected as inert text without executing JavaScript. The [general terms](https://www.nyc.gov/main/terms-of-use) (E08) reserve city/third-party intellectual-property rights and prohibit disruption. A future review must retain the factual-data scope and document how all applicable terms are satisfied; this review does not approve expressive-content reuse or mark the contract's terms/permission gates approved.

### Ordinary automation, cost and access

The city [Public Standards API section](https://cityofnewyork.github.io/opendatatsm/publicstandards.html) (E09) expressly documents SODA access to published datasets and machine-readable downloads. Socrata's [Application Tokens documentation](https://dev.socrata.com/docs/app-tokens.html) (E07) documents simple unauthenticated queries. Tokens improve throttling treatment but are not necessary for that mode. Anonymous requests share an IP quota; no numerical anonymous quota is promised. Stop on 429; no paid fallback.

**$0 proposed architecture:** anonymous HTTPS against the publisher's public API, bounded infrequent retrieval, inert local parsing and existing reviewed coordinates only. No account, API key, card, metered plan, paid quota, geocoder, proxy or reseller is required for the documented simple anonymous mode. Successful unauthenticated metadata and robots responses establish part of that path; **event data retrieval itself was not established**.

D03 robots returned HTTP 200. Its wildcard group specifies a **one-second crawl delay**, with disallows for catalog filter combinations, edit/login/OData and other paths. It does not disallow the tested `/resource/w3wp-dpdi.json` path. This supports ordinary API access posture; it is not the reuse authorization. Controlled source requests were sequential and separated by more than one second.

D04 requested at most five 2026 records, filtered to pumpkin/maze/haunt title or Halloween category, with only factual columns selected. It timed out with no HTTP response. D06 was one simpler diagnostic query against the same documented public endpoint, at most three records and fewer columns, to separate a complex-query issue from basic row access. It also timed out. It was not an identical automatic retry or a response to an access-control challenge. No further data request, host change, proxy, browser or authentication attempt followed. These timeouts do not prove a site outage or source prohibition.

### Actual field evidence and contract feasibility

D02 returned HTTP 200, 8,019 bytes of schema metadata. It lists daily automatic updates and `rowsUpdatedAt = 2026-10-04T13:34:50Z`. **That is a dataset update time, not evidence of any 2026 event occurrence.**

| Available column(s) | Narrow factual use | Remaining condition |
| --- | --- | --- |
| `guid`, `link` | Native record ID and source URL | Preserve source namespace; review HTTPS and stable identity |
| `title` | Event name | Length/normalization review; no marketing paragraph |
| `starttime`, `endtime` | Dates and hours | Explicit event year; local timezone and overnight semantics review |
| `parkids`, `parknames` | Venue identity/crosswalk leads | Do not merge different events by park/name |
| `location` | Location within park | Not a complete structured street/city/state/postal/country address |
| `coordinates` | Published point candidate | Text pair; verify order, CRS, address match, precision and point meaning |
| `contact_phone` | Optional phone | Retain only if valid and appropriate |
| `categories` | Eligibility evidence lead | Halloween/general festival is not automatically an allowed activity |
| `description`, `registration_description`, `image`, `instructor`, `registration_url` | Exclude from proposed output | Do not fetch linked media, registration sites or descriptive content |

A narrow field-only adapter is technically plausible. No adapter was built. No sample proves an occurrence in `haunted-house`, `corn-maze` or `pumpkin-patch`; no complete reviewed location/address has been established. The feed also rolls off events after its short window, so disappearance must not be converted into cancellation or deletion of evidence.

There is an additional concrete compatibility gap: the unchanged source envelope accepts only `text/html`, `text/plain`, and `application/ld+json`, while this API uses `application/json`; query names such as `$select`/`$limit` also fail its query-name regex. Do not relabel JSON as JSON-LD/plain text or bypass validation. A separately scoped design/contract review would have to resolve this before transport implementation. The fact model can represent selected event facts only after all identity, eligibility, address, calendar and coordinate evidence exists.

**Result:** NO-GO for this task. This is the strongest follow-up research lead, **not a selected source**. Explicit general policy and live metadata do not substitute for an obtainable qualifying record and complete contract fit.

## 3. National Park Service Events API

- **Publisher/status/geography:** U.S. National Park Service, official nationwide park/event service; includes parks in the preferred states, without proving matching seasonal events there.
- **URLs:** [API reference](https://www.nps.gov/subjects/developer/api-documentation.htm), documented service base `https://developer.nps.gov/api/v1/`; events endpoint lead `https://developer.nps.gov/api/v1/events`.
- **Grant:** [Get Started](https://www.nps.gov/subjects/developer/get-started.htm) invites use in applications/maps/websites and describes free key registration. [Guides](https://www.nps.gov/subjects/developer/guides.htm) explicitly document API retrieval and link the [Disclaimer](https://www.nps.gov/aboutus/disclaimer.htm) as terms. NPS-created material is generally public domain unless marked otherwise; third-party content/marks are excluded. This is a qualified official public-domain/API-use policy, not a blanket CC0 license.
- **Reuse/attribution/modification:** commercial republication is explicitly contemplated for NPS works, with a notice acknowledging original U.S. Government work; source acknowledgement is appreciated. Normalization of covered factual material is feasible; third-party rights require exclusion/review.
- **Automation/cost:** official key-based API access; default 1,000 requests/hour, temporary block on excess. Free registration, no paid tier/card requirement described. No key was supplied, registered, searched for in secrets, or used; no authenticated event call was made. A key is not itself evidence of paid operation.
- **Robots/data/cadence:** robots unreviewed; automation evidence is the official API guide. The retrieved interactive reference exposed no usable event schema/sample in the text reader. Exact event fields, current 2026 eligible records and update cadence remain unverified; no third-party wrapper schema is adopted as authoritative.
- **Adapter:** potentially fact-only after response/schema verification; descriptive/media fields must be excluded. Credentials also conflict with the unchanged offline execution policy, and JSON needs separate source-envelope review. **NO-GO:** no verified response or complete qualifying occurrence. No claim that NPS forbids the proposed future use.

## 4. USDA National On-Farm Market Directory

- **Publisher/status/geography:** USDA Agricultural Marketing Service, official nationwide directory of individual farm-operated retail markets.
- **Dataset/license evidence:** [Official catalog](https://catalog.data.gov/dataset/national-on-farm-market-directory), identifier `usda-ams-2015-N039`, explicitly assigns [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/). CC0 permits copying, modification and commercial redistribution; no copyright-attribution condition, while other rights and non-endorsement remain relevant.
- **Structured URL:** catalog advertises `http://search.ams.usda.gov/onfarmmarkets/ExcelExport.aspx` as Excel. It was not requested; HTTP is incompatible with the current HTTPS-only source policy. No alternate export host or guessed API was tried.
- **Access/cost/key/rates/robots:** CC0 establishes reuse, not endpoint service rules. Anonymous download is advertised, but live automated retrieval, robots, key requirements, any billing conditions and rate limits were not independently established. No paid dependency encountered; no verified $0 live path claimed.
- **2026/cadence/fields:** catalog modified date is **2015-10-19**; its September 2026 catalog-check date is not data freshness. The [current AMS directory page](https://www.ams.usda.gov/local-food-directories/onfarm) still describes an API as forthcoming. Actual export columns, update schedule, dated 2026 activity occurrences and licensed current successor export were not verified. The catalog's farm/pick-your-own tags do not prove a pumpkin patch.
- **Expressive exclusion/adapter:** a column whitelist could exclude prose/media if an accessible schema were verified, but Excel and absent occurrence evidence do not establish present contract compatibility. **NO-GO:** explicit license found; current usable seasonal data not proven. This does not establish that every USDA directory is stale.

## 5. Art Institute of Chicago Events API

Publisher: Art Institute of Chicago; official institutional API, Chicago, Illinois. [Documentation](https://api.artic.edu/docs/), Events/Authentication sections. Endpoint: `https://api.artic.edu/api/v1/events`; occurrences: `/api/v1/event-occurrences`.

Events authorize noncommercial educational/personal use and statutory fair use, retaining notices and author/source credit. **The collection-data CC0 grant does not cover events.** Commercial reuse/normalization is not affirmatively granted. [Full terms](https://www.artic.edu/terms) returned 403; stopped without bypass.

Anonymous, field-selecting API access is documented: no key/billing setup described; 60 requests/minute and one request/second for small-scale extraction. Dumps update nightly; event cadence is unspecified. Fields include ID, title, location and times. Prose/media can be omitted. Current 2026 rows and robots were not verified; data calls 0. **NO-GO:** restricted event-use grant; no demonstrated eligible activity.

## Network accounting and boundaries

| Controlled operation | Count |
| --- | ---: |
| Direct source HTTPS attempts via curl | **6** |
| Of those: successful HTTP 200 | **3** |
| Of those: timeout with no HTTP response/body | **3** |
| Direct attempts by candidate | Missouri 1; NYC 5; NPS 0; USDA 0; Art Institute 0 |
| Direct representative event-data attempts | **2**, both NYC; zero rows obtained |
| Built-in search calls / queries | **7 / 21** |
| Explicit reference-tool opens / clicks | **23 / 4** |
| Reference-tool finds in retrieved documents | **6** |
| Total explicit URL retrieval actions (curl + opens + clicks) | **33** |
| Collector calls | **0** |
| Geocoder calls | **0** |
| Paid API calls | **0** |
| Executable changed paths | **0** |

The 33 actions are not asserted to equal origin wire requests: reference/search services may use caches, redirects or opaque upstream retrieval; their underlying count is unavailable. Six is the exact controlled curl-attempt count, not the entire research-access count. Repeated opens/finds reviewed existing documents; no crawl or bulk export was performed. Metadata/docs/reference retrievals are not product collector execution. Administrative Git/Vercel reads and research-branch publication are separately scoped and excluded from candidate-access counts.

Curl used ordinary unauthenticated HTTPS, default user agent, no automatic retries, no redirects, five-second connect and ten-second total bounds. D01–D05 had a 2 MiB body cap; D06 had 64 KiB. Both row queries projected factual columns and had explicit limits. No page scripts, subresources, API signup, credentials, CAPTCHA handling, anti-bot workaround, paywall bypass, proxy, paid gateway or geocoder was used. No request to Cadaver Zone or the previously blocked operator sites.

## Publication verification and preservation

Only this report, two reduced evidence JSON files and a continuation handoff are added. All additions must be `100644` documentation/evidence; every preexisting tree path/object ID/mode must remain identical. Check `git diff --check` and exact sole-parent identity. No implementation tests/builds/dependency installs are warranted for this documentation-only delta, and no prior tests are claimed as newly run.

Main readbacks before publication matched the required SHA. The production deployment serving `pickforus.app` was READY at that main SHA before publication. Repeat both readbacks after publishing the research branch; exact final identities and preservation results belong in the final owner report. No main merge/push, source registry edit, real contract fixture, production/alias/configuration change, migration or manual deployment is part of this work.

## Exact recommended next step

Keep source-pilot implementation on hold. Authorize a **documentation-only NYC Parks API compatibility and current-record verification** follow-up from this research commit. Require (1) a bounded successful response containing an explicitly dated 2026 haunted-house, corn-maze or pumpkin-patch occurrence; (2) factual scope and applicable provider/portal terms documented with attribution/version/modification handling; (3) a complete address and reviewed source-published point or an explicitly identified permitted review path without geocoding fees; and (4) a reviewed proposal for inert JSON MIME/query support that preserves the existing permission/security gates. If those cannot be established, remain blocked. Do not infer a qualifying activity from Halloween, harvest, pumpkins for sale, a generic festival, or a catalog update date.

No collector implementation, activation or runtime promotion is authorized by this recommendation. A successful subsequent review must produce a separate bounded-pilot handoff before implementation.
