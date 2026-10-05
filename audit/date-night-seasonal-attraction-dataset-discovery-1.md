# Pick For Us — Seasonal Attraction Dataset Discovery #1

**SEASONAL ATTRACTION SOURCE DISCOVERY #1 PARTIAL — IDENTITY SOURCE FOUND, CURRENT-SEASON CORROBORATION REQUIRED**

Reviewed 2026-10-05 (America/Chicago). Select exactly one **identity source**: Montgomery County, Pennsylvania, **Montgomery County AgriTourism**, ArcGIS item `98996b62c9ab4a9a8e12de859565790a`, layer `0`. No second source or pairing is selected. No collector, contract change, activation, Date Night integration, main change, or production promotion is authorized by this report.

The ordinary anonymous HTTPS query returned three factual records. The strongest anchor is **OBJECTID 3, Arader Tree Farm**, with **CornMaze = "Yes"**, separate street/city/state/ZIP fields, website, phone, and source-served geometry explicitly labeled WKID 4326. This materially improves on NYC Parks: activity identity is an affirmative dedicated field, not a Halloween title or description. The source's own item-level `licenseInfo` affirmatively offers its data as a free and open resource. This is bespoke government data-use wording, **not CC0, CC-BY, or ODbL**.

No retrieved row establishes a 2026 operating season, current calendar, or active lifecycle. Country needs a reviewed US constant. Point meaning and uncertainty remain unverified. Selection is for current-season corroboration and fact-compatibility review only; there are **zero publishable contract occurrences**.

## 1. Immutable boundary

| Item | Exact value |
| --- | --- |
| Starting SHA | `514d0f02091f067e3ec675076b282ec6ff199efd` |
| Starting tree | `47c95ea07ba59de4aae77783bfe7e1a2c16fc7cf` |
| Starting sole parent | `6a31e3a3da3fc2775eb06a9aed7e4f367e6ae5c4` |
| Starting branch | `research/date-night-seasonal-nyc-parks-compatibility-1` |
| Required publication branch | `research/date-night-seasonal-attraction-dataset-discovery-1` |
| Required main | `078f65c5d194435452ca14569ea00e57f52a20f3` |
| Required production | `dpl_HmqKyiLqCqMSTrhxKktsy9mJtDKy` |

GitHub's commit object, recursive tree, starting ref, and main ref were read before source research. All required identities matched; the recursive tree was not truncated. No AGENTS.md exists in that tree. The previous NYC report and unchanged contract README/schema/builder/policy were inspected. These are read-only inspections, not newly run implementation tests.

This report's introducing commit has the starting SHA as its sole parent. Its final SHA/tree/parent and post-publication preservation readbacks are recorded in the accompanying final receipt. They cannot be embedded in the same commit whose identity they describe without self-reference. Parent-directory tree hashes necessarily change for additions; every preexisting leaf path, Git object ID, type, and mode must remain unchanged.

## 2. Owner-supplied post-review NYC context

The owner reported subsequent bounded anonymous Termux SODA2 observations: a minimal `guid` request returned HTTP 200 JSON with a row; the exact PUMPKIN PATCH / CORN MAZE / HAUNTED HOUSE query returned `[]`; a broader query returned October 2026 fall/Halloween events. Examples included Hallowscream Fright Walk, Hallowscream Fright Walk & Fall Festival, Free Halloween Puppet Pop-up, Upcycled Fabric Pumpkins, and Halloween Trick or Treat at Powers Street Garden.

These statements are **owner-supplied post-review context**, not artifacts or findings produced by commit `514d0f0` or its earlier research. No owner response files were supplied or independently authenticated here. No new NYC request was made. None of those titles is accepted as haunted-house, corn-maze, or pumpkin-patch proof. Fright walks and haunted trails remain separate; the categories were not broadened.

## 3. Candidate scope and comparison

Six services were screened, with three examined beyond initial program/catalog discovery. The geographic state leads were screened while the stronger county source's permission evidence was still being resolved. No seventh dataset was evaluated; unrelated search hits, mirrors, folklore, commercial scrapers, and aggregate agricultural statistics were not adopted as candidates.

| Candidate / publisher / coverage | Structured endpoint | Permission and selection result |
| --- | --- | --- |
| C1 Missouri Farmers' Markets / official State of Missouri portal / Missouri | `https://data.mo.gov/api/views/2zg8-cta8.json`; documented exports in federal catalog; SODA2 candidate `https://data.mo.gov/resource/2zg8-cta8.json` (rows not tested) | Direct metadata: `provenance=official`, no populated licenseId; no applicable affirmative reuse grant established. Address schema useful, but no dedicated target activity fields. Not selected. |
| C2 USDA AMS Local Food Directories — Agritourism / USDA AMS official program / U.S. | Official landing `https://www.usdalocalfoodportal.com/`; no official documented structured endpoint verified | AMS confirms program ownership. Reference-tool landing fetch returned 403; no retry, workaround, or API guessing. No applicable record-level reuse grant, schema, or qualifying row established. Not selected. |
| C3 Montgomery County AgriTourism / Montgomery County GIS and Planning Commission / Montgomery County, Pennsylvania | `https://services1.arcgis.com/kOChldNuKsox8qZD/ArcGIS/rest/services/Montgomery_County_AgriTourism/FeatureServer/0/query` | Item-specific affirmative free/open data declaration; public Query API; qualifying factual rows obtained. **Selected identity source**, season unresolved. |
| C4 Registered Agritourism / Kansas Tourism, Kansas Department of Commerce / Kansas | Official directory `https://www.travelks.com/things-to-do/farm-experiences/registered-agritourism/`; structured API/export not established | Official terms reviewed; no affirmative dataset reuse/normalization or automated API grant established. Pumpkin Patches navigation is a lead, not a fetched qualifying row. Not selected. |
| C5 Oklahoma Agritourism / Oklahoma Department of Agriculture, Food and Forestry program / Oklahoma | Official directory `https://oklahomaagritourism.com/`; structured API/export not established | Official producer guide describes listings searchable by category/region. Free marketing for producers is not a downstream data reuse license. No applicable affirmative grant established. Not selected. |
| C6 Arkansas Tourism directory / official Arkansas tourism site / Arkansas | `https://www.arkansas.com/directory` redirected to home; no structured endpoint established | Program identity and a directory lead only; no applicable explicit reuse grant or qualifying structured row established. Not selected. |

No source is rejected merely because it requires corroboration. C1/C2/C4/C5/C6 lack affirmative permission and/or observed qualifying structured identity, which are different failures from C3's missing season.

### Access, rights, cost, and freshness for every candidate

| Candidate | Commercial reuse / normalization / attribution | Automated access, authentication, billing, rate limits | Freshness and fields |
| --- | --- | --- | --- |
| C1 | Commercial and modification permission unresolved. Attribution obligations unresolved; government ownership/public access not substituted for a grant. | Socrata metadata is anonymously readable. SODA2 anonymous query is a documented platform route, but dataset row access not tested; no card/key used. Numerical dataset quota not established. | Catalog says Mon–Fri 8:30 PM; directly observed rowsUpdatedAt = 2026-10-03T01:30:03Z. This is dataset freshness, not 2026 attraction operation. See field assessment below. |
| C2 | Record reuse, commercial use, modification, and attribution unresolved. Generic USDA/NAL/FSA public-domain policies were not transferred to owner-submitted portal records. | Official portal, but API authority/auth/key/card/rate limits unresolved. 403 stopped access investigation; no reseller or scraper used. No paid dependency established or accepted. | Cadence, last verified record update, explicit activities, structured location, and season unknown. AMS describes account-based listing updates; that is not a freshness SLA. |
| C3 | Affirmative item-specific government free/open-resource declaration supports factual reuse at discovery. Commercial use and factual normalization are a **research interpretation of that declaration**, not separately enumerated rights or a named standard license. Preserve publisher credit, source link, retrieved date, and modifications voluntarily; no express attribution clause found in this item wording. Do not imply endorsement. | Public hosted Feature Service advertises Query; documented ArcGIS REST interface, successful no-key/no-account request. No card, billing, paid quota, geocoder, basemap, or account required by the proposed bounded read architecture. No numerical requests/time allowance established. maxRecordCount 2000 is a response ceiling, not a rate allowance. | Item modified 2026-07-13T16:35:49Z. Reference-rendered schema reports data edit 2025-08-11 18:31:19 (timezone not established). Later direct layer metadata attempt failed; no fresh layer timestamp claimed. Neither timestamp proves 2026 operation. Update cadence unspecified. |
| C4 | Reviewed privacy/terms page supplies no affirmative reusable dataset license. Commercial/normalization/attribution unresolved; open-records discussion is not a data grant. | Public directory; documented API authority, API authentication/card/rate limits unknown. No data request or account. | Cadence, row review dates, category coding, native IDs, address completeness, coordinates, and current season unverified. |
| C5 | No explicit reuse grant established. Commercial/normalization/attribution unresolved. State-sponsored listing service alone is insufficient. | Documented producer directory, no verified machine-readable API authority or auth/card/rate schedule. No data request or account. | Category/region organization documented. Row fields, update cadence, location completeness and 2026 status unverified. |
| C6 | No applicable affirmative data-use grant established. Commercial/normalization/attribution unresolved. | Directory URL redirected to home; no API, authentication/card/rate contract verified. No data request or account. | Structured fields and current-season facts unknown; redirect does not prove the directory has ceased operating. |

Zero expenditure is demonstrated for the research requests. Only C3 has an observed ordinary $0 row route. No affordability claim is invented for unverified APIs of other candidates.

## 4. Reduced permission and official-status evidence

C3's direct item metadata names owner `Montco_GIS`, title Montgomery County AgriTourism, public access, service URL, and publisher credit. Its own `licenseInfo` says:

> Montgomery County provides this data as a free and open resource.

The remaining terms disclaim suitability and warranties and prohibit treating the data as a legal description. The evidence file preserves the short grant, a paraphrase of these conditions, and a hash of the original license string; it does not publish the entire HTML metadata or expressive descriptions.

This is affirmative source-specific wording in the license field, not an inference from a government domain, absent terms, robots, or anonymous access. The discovery interpretation covers bounded factual use and normalization, with the limits above. It does not license farm website prose, photos, logos, or linked content. Any unresolved interpretation at subsequent independent permission review must keep activation blocked.

Official county [program notice](https://taxclaim.montcopa.org/CivicAlerts.aspx?AID=4595) identifies MCPC's Field to Family agritourism map and activity filters. The [Data & Mapping Services page](https://taxclaim.montcopa.org/3132/Data-Mapping-Services) describes county GIS distribution. Layer/service metadata explicitly credits the county. Terms from unrelated Pennsylvania layers and Maryland's different Montgomery County were not used as the applicable license.

Primary sources for other screens: [Missouri catalog](https://catalog.data.gov/dataset/missouri-farmers-markets), [AMS program](https://www.ams.usda.gov/services/local-regional/food-directories), [Kansas terms](https://www.travelks.com/privacy-policy/), [Oklahoma producer guide](https://oklahomaagritourism.com/producers/getting-started/how-we-help-you), [Arkansas directory](https://www.arkansas.com/directory). Their contents do not clear the missing grants reported above.

## 5. Actual factual records

One bounded query requested ten factual attributes and geometry, with resultRecordCount=3, ordered by OBJECTID. The response was HTTP 200 application/json, 2,592 bytes, with three features. `exceededTransferLimit=true` means the sample is incomplete; it is not a source total. No pagination followed. The exploratory predicate checked non-null activity fields; eligibility below depends on the returned value **"Yes"**, not mere non-nullness.

| Source-native ID | Name | Exact activity fields | Published address | Geometry x / y |
| --- | --- | --- | --- | --- |
| 3 | Arader Tree Farm | CornMaze="Yes"; PumpkinPicking="Yes" | 746 South Trappe Road; Collegeville; PA; 19426 | -75.491663001304417 / 40.174717986793411 |
| 5 | Barry Davis Produce Stand | CornMaze=null; PumpkinPicking="Yes" | 821 Collegeville Road; Collegeville; PA; 19426 | -75.422421020846016 / 40.2053159987891 |
| 14 | Freed's Produce | CornMaze=null; PumpkinPicking="Yes" | 175 Morwood Road; Harleysville; PA; 19438 | -75.407336026196148 / 40.301458020563118 |

The layer aliases are **Corn Maze** and **Pumpkin Picking**. Dedicated pumpkin-picking activity is stronger than pumpkins-for-sale; it is recorded separately from market/farm-stand/product fields. All three are positive pumpkin-picking identity leads. The selection's decisive qualifying proof is ID 3's explicit corn-maze activity; later pumpkin-patch mapping should explicitly confirm visitor picking semantics. Null corn-maze values do not mean the activity is absent.

No haunted-house field or qualifying haunted-house record was established. No pumpkin-craft/festival, generic maze, fright walk, or hayride was mapped to a permitted category. None of these rows establishes a dated seasonal occurrence. The reduced response retains phone and website; the Facebook link on ID 14 was not visited or proposed as licensed corroboration.

## 6. Structured field gate and location

A = present directly (distinguish schema from observed values); B = derivation with reviewed constants; C = second official/authorized source required; D = absent/unresolved in this source.

| Field | C3 classification and evidence |
| --- | --- |
| Native ID | A: OBJECTID in all three rows; namespace with publisher, item, service, layer. System-managed ID, no GlobalID observed; stability across republishing unproven. |
| Attraction/venue name | A: Name. Farm venue identity is a starting point, not an occurrence ID or proven legal operator. |
| Activity | A: CornMaze and PumpkinPicking yes/null values; retain raw value and reviewed mapping. |
| Street, city, state, postal | A: Address, City, State, Zip_Code all populated in this sample. No geocoding needed to obtain these components. |
| Country | B: US from reviewed Pennsylvania county jurisdiction; not a source-published country field. All five are attainable only after this reviewed derivation. |
| Coordinates | A: source-served geometry, response spatialReference.wkid/latestWkid=4326. Candidate point, not contract-verified. |
| Operator identity | C/D: county is publisher, not farm operator; separate legal/operating identity requires authorized official corroboration. Do not silently equate Name with operator. |
| Website/phone | A: WebSite and Phone_Number observed. Website is a directory assertion, not proof of ownership or permission to fetch it. |
| Hours | A schema-only: Hours exists in reference-rendered schema; not requested and no hours value observed. |
| Season/year/dates | D in observed records/schema; C for explicit 2026 season/calendar. Item timestamps are not substitutes. |
| Lifecycle/status | D: no observed operating/cancelled/closed field; C for an explicit current status assertion. |
| Record update/review | D: no per-row timestamp in sample. Item modified timestamp A; reference layer edit metadata separately recorded, neither a row review date. |
| Timezone | B candidate: America/New_York following reviewed location; not emitted or stored as a received fact. |
| Point meaning/uncertainty | D in present evidence; requires reviewed source documentation/map/survey evidence before verification. |

C1 schema directly has business_name, address1/address2, city, state, zipcode, website and a Socrata location column, but no dedicated target activity, dates, lifecycle, phone, or stable business-ID field was established. Country would require B; operator/category/current-season/coordinate semantics require C or remain D. Expressive company_profile/company_description/location_description are excluded. No rows were read. C2/C4/C5/C6 never cleared documented structured-schema access; all requested record fields remain unverified, not falsely marked absent.

C3 native layer metadata names EPSG:3857 / Esri 102100. The request explicitly asks for outSR=4326 and the actual response declares 4326. [Esri query documentation](https://developers.arcgis.com/rest/services-reference/enterprise/query-feature-service-layer/) defines outSR; [spatial-reference documentation](https://developers.arcgis.com/documentation/spatial-references/) identifies WGS84 / 4326; [geometry documentation](https://developers.arcgis.com/rest/services-reference/enterprise/geometry-objects/) defines x/y points. The source performs coordinate reprojection, **not geocoding**. x is longitude and y latitude under this ArcGIS geographic JSON representation. WGS84 was not guessed from numeric appearance.

The points are associated with agritourism location records. Whether each is an entrance, a venue point, or a parcel centroid is **unknown**. Decimal precision is not measured positional accuracy. No uncertainty estimate was invented. The complete reviewed address can support a local deterministic fingerprint without geocoding, but that cannot verify a point by itself. This county dataset is not an operator-published point merely because it lists an operator website.

## 7. Current-season and two-source conclusion

No qualifying current 2026 occurrence was established. Metadata modified in July 2026 does not say Arader operated a corn maze in fall 2026; the older layer edit value likewise cannot date an attraction season. Search results about Arader from commercial directories were not accepted, and no operator page, image, description, social post, or ticketing page was ingested.

SOURCE A may provide licensed identity/activity/address/candidate geometry. SOURCE B must independently provide authorized current-season facts tied to the same attraction and physical location, preferably an operator attestation or explicitly licensed official feed. The county license does not extend to B. No B endpoint or grant was established, so **no licensed pairing is selected**.

The architecture is plausible as a review workflow, but **not demonstrated as a join accepted unchanged by the current contract**. The builder requires explicit season evidence for every selected observation; static A facts cannot inherit B's 2026 year silently. JSON source content types also require a separately authorized design decision: the current contract does not accept application/json. See the separate architecture note. The report does not solve these gates by altering the contract or producing fabricated season evidence.

## 8. Research access accounting

| Candidate | Controlled direct attempts (including metadata/license) | Row requests | Returned rows |
| --- | ---: | ---: | ---: |
| C1 | 1 successful metadata GET | 0 | 0 |
| C2 | 0 | 0 | 0 |
| C3 | 3: row success, item-license success, layer-metadata failure | 1 | 3 |
| C4 | 0 | 0 | 0 |
| C5 | 0 | 0 | 0 |
| C6 | 0 | 0 | 0 |
| Total | 4 | 1 | 3 |

Search/reference documentation reads are counted separately in network-summary.json; they are not row requests. C3 service/layer HTML reference views supplied documentation, two ArcGIS item reference views were unavailable, and a subsequent ordinary direct item metadata request succeeded. That was not a retry through a proxy or an access-control workaround. USDA's reference 403 was not retried. C3's one direct metadata transport failure was not retried. Direct requests used Python's standard HTTPS client with a 10-second timeout and bounded response reads, no account, cookies, custom identity rotation, proxy service, or bulk crawl. The bounds are research controls, not a validated production transport.

Collector calls = **0**. Geocoder calls = **0**. Paid API calls = **0**. Executable changed paths = **0**. Source activations = **0**. Implementation tests, migrations, runtime collection, and manual deployments = **0**.

## 9. Answers and continuation

1. Government/open dataset directly classifying corn mazes? **Yes:** C3 CornMaze="Yes", ID 3.
2. Direct pumpkin attraction classification? **Yes:** C3 PumpkinPicking="Yes" is an activity field, with three observed positives; explicit pumpkin-patch normalization still requires the visitor-picking review stated above.
3. Haunted houses/immersive haunted attractions? **Not established within this six-candidate review.** Folklore and generic Halloween results are not qualifying.
4. State programs publish inventories? Official KS/OK directories and a MO structured export exist; a licensed structured state attraction inventory satisfying this task was not established.
5. Agriculture departments expose activity/type fields? USDA agritourism program and OK category organization are documented, but no department API activity schema passed this review. C3 does expose explicit fields as a county GIS publisher.
6. Official agritourism GIS POIs? **Yes**, C3.
7. One source supplying activity + full address + 2026 season? **No demonstrated source.** C3 supplies four direct address components; US is a reviewed constant; season remains missing.
8. Two-source licensed architecture feasible? **Conditionally plausible, not established or implementation-ready.** B's authority and facts, coordinate review, and honest contract representation are open gates.

**Exact next step:** conduct one research-only **Montgomery County / Arader Tree Farm Current-Season Corroboration and Fact-Compatibility Review #1**, from this published research commit, anchored to item 98996b62c9ab4a9a8e12de859565790a / layer 0 / OBJECTID 3. Independently assess the bespoke open-data permission interpretation; establish an explicit licensed or operator-authorized 2026 corn-maze calendar/status and same-operator/same-location link; review country/timezone constants, point meaning/uncertainty, native-ID durability, and JSON plus multi-source season provenance against unchanged v1. Keep all source observations separate. If a truthful two-source join cannot be represented, recommend a separately authorized narrow contract design; do not implement or relax it in that review. No collector until those reviews succeed.
