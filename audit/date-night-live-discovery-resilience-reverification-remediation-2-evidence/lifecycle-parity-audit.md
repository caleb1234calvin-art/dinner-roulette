# Preimplementation lifecycle interpretation/acquisition parity audit

Failed candidate: 4e6ff124960d77be0c454ccfa0401c8a1ced35a1 (tree a8abffa67584e64e03b37300967319b8e49f9c61, sole parent 444a68dd17e058e11778f805311a768986481c0c). This candidate remains FAILED reverification history. Runtime is unchanged at this audit/checkpoint.

## Complete recognized provider vocabulary

`provider-evidence.ts::providerLifecycle` interprets values as positive iff nonempty and not exactly `no`, `false`, or `0` (case-insensitive, no trimming). Thus `yes`, `true`, `1`, dates, unknown text and whitespace are negative lifecycle evidence. Keys are case-sensitive.

| Class | All recognized keys | Interpretation | Failed-candidate acquisition |
| --- | --- | --- | --- |
| Permanent simple flags | demolished, removed, razed, destroyed | permanently-closed | No independent selector. Category-coupled to active or other acquired tags. |
| Inactive simple flags | disused, abandoned, was | disused | Same omission. |
| Permanent namespaces | any key starting demolished:, removed:, razed:, destroyed: (including arbitrary/nested/empty suffix) | permanently-closed | Only four suffixes and finite category values are selected independently; all other recognized forms are category-coupled. |
| Inactive namespaces | disused:, abandoned:, was: followed by exactly leisure, tourism, attraction, amenity | disused | Only selected finite category values are fetched independently; other positive values require a separately acquired carrier. |
| Reconstructed classification | all seven prefixes on exactly leisure/tourism/attraction/amenity | `search.ts::elementToPlace` fills a missing/falsy active key in input iteration order, then runs unchanged ordinary/seasonal classification | Existing 28 selectors cover many direct ordinary/seasonal categories but omit reconstructed tourism=farm/theme_park/attraction with seasonal prose. |
| Multiple lifecycle tags | any of above | permanent closure outranks disused; `identity.ts::mergeIdentity` retains terminal precedence independent of record ordering | Works only if acquisition supplies the negative representation. |

All acquisition output still passes `elementToPlace` name/coordinates/classification gates, `queryMirror` and `mergeDateNight` identity merges, then `availability.ts` and `eligibility.ts` exclude terminal/disused lifecycle even with Open Now OFF. Identity may be shared by provider ID, normalized name and proximity, shared category/proximity, or catalog alias (Precious Moments). None of these aliases creates a new lifecycle vocabulary. Raw lifecycle records are deliberately retained for identity/cache evidence; they are never eligible options.

## Carrier closure required for acquisition parity

Anything, all single supported seasonal categories, mixed seasonal categories, and each narrowed ordinary group need the same negative evidence. A potentially classifiable record necessarily has one of these active or reconstructed carriers:

- leisure: bowling_alley, amusement_arcade, miniature_golf, escape_game, ice_rink, park, maze
- amenity: cinema
- tourism: museum, theme_park, attraction, farm
- attraction: haunted_house, haunted_trail, haunted_forest, haunted_attraction, corn_maze, maize_maze, maze, pumpkin_patch
- active sport=roller_skating (prefix sport is NOT reconstructed)
- active landuse=farmyard/farmland (prefix landuse is NOT reconstructed)

The first four keys can be reconstructed through each of the seven prefixes. Maze/agricultural and prose classification still require unchanged additional positive evidence. Carrying one of these contexts is necessary, not sufficient, for positive classification. A lifecycle selector must also require a genuinely positive lifecycle value so `demolished=no` cannot import unrelated active categories.

## Auditable matrix and RED

`parity-before.json`: 154 representation/value rows, 111 interpreted lifecycle-negative rows, 69 rows have at least one category acquisition gap in the sampled selections. Exact tag inputs and acquisition booleans for Anything/Corn/Pumpkin/mixed/Movies/Museum/Skating are retained. `parity-baseline.mjs` is the frozen preimplementation query grammar probe, not an updated runtime oracle.

`demolished-red-capable.tap`: real query-builder, query-aware provider, handler, identity and eligibility path; 3 passes / 1 expected failure. Anything, Corn+Pumpkin, Pumpkin-only exclude. Corn-only acquires only node9201 and incorrectly returns it eligible, source live, partial false. `demolished-red.tap` retains the restricted runner file-level failure, then unchanged tests were rerun in the capable environment. These are synthetic fixtures, not user location data or public-provider requests.

## Status/calendar and unsupported forms

- `availability.ts::calendarState`: confirmed ended-current-year season and explicit not-operating exclude browsing; explicit not-operating precedes revalidation expiry. These come from curated per-ID availability or typed internal venue state, NOT parsed provider tags. No provider query representation exists to acquire. Saved catalogs and availability remain unchanged.
- `opening_hours=closed`, off-hours, upcoming season and unknown schedules do not mean authoritative permanent closure; OFF may browse. They must not enter lifecycle acquisition.
- `closed`, `permanently_closed`, `inactive`, `status`, `end_date`, `opening_date`, `start_date` provider tags are NOT recognized as lifecycle by this path; no new interpretation is authorized.
- Negative/historical seasonal prose rejects affirmative evidence; it does not produce a lifecycle claim. A name containing `closed`, missing name/coordinates, retired Powers Museum near saved coverage, or no classification causes the record to be dropped before identity merge. These are record-level exclusions, not acquired authoritative identity-negative evidence.
- Seasonal-only records are discarded with Spooky Season OFF by existing classification, even if lifecycle-negative. Anything and narrowed ordinary searches share this boundary; ordinary-to-ordinary lifecycle parity is required OFF and ON. No expansion of that interpretation is proposed.

## Design decision BEFORE implementation

Use one canonical lifecycle registry (ordered permanent/inactive families, prefix namespace scope, negative value semantics, reconstructable keys) for interpretation and acquisition. Build a bounded named lifecycle carrier set from exact supported active/reconstructable contexts, then apply canonical lifecycle predicates ONLY to that set. Keep selected affirmative acquisition separate and unchanged. No all-map-elements or unrestricted inactive-object scan. All selectors retain the existing spatial cap.

Values need a POSIX ERE-compatible positive matcher, generated from the same false-value list as interpretation, because regex-key Overpass filters cannot negate values. Tests must compare all negative sentinels, case variants, prefixes, arbitrary positive values and multi-tag combinations. Regex-key namespace filters will run only on the bounded named carrier set, never across the database.

A narrow `search.ts` change is justified only to replace its duplicate prefix-normalization regex with the canonical helper, preserving fill-only behavior and input order. No identity/cache/classifier changes are needed. This prevents normalization and query carrier vocabulary from drifting while preserving current output semantics.

Primary query references reviewed: https://dev.overpass-api.de/overpass-doc/en/criteria/union.html and https://dev.overpass-api.de/overpass-doc/en/criteria/per_tag.html. Named-set filtering is supported. Construction measurements are not a claim of provider latency; bounded live acceptance remains mandatory.

## Preserved budgets and next gates

Before: Anything 138 selectors in four groups; seasonal group45; Corn45, Pumpkin41, Haunted41, Movies29 (bytes and all major categories recorded in JSON using fixed synthetic coordinate text). Four mirrors; maximum16 attempts; 0/1500/3000/4500ms hedge schedule; 8s/20s/25s unchanged. Cache source remains byte-identical. No new cache defect reproduced. Next: shared model, executable parity regressions, focused GREEN; then required cache/full/build/security/browser/Preview gates.
