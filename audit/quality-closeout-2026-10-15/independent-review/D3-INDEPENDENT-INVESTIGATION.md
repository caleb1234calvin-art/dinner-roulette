# D3 Benton ambiguity — independent investigation and isolated remediation proposal

Date: October 15, 2026. Reviewer workstream: `/root/d3_research`, separate from PR #73 and D2 implementation. **Disposition: confirmed defect; remediation proposal ready; implementation/release HOLD.** No production, catalog, PR #73 or application code was changed by this workstream.

## Exact source and prior observation

Released source inspected: `991978fe24ec165eeacd5500a26d66f35d86c560`, tree `95f66498048590cbd30c623b17d15bf2d5b7cc73`. Continuity snapshot: `76a7915fc5453099af1f692e9fdca45822eabfd0` on `integration/continuity-refresh-2026-10-07`. The prior live observation in `audit/quality-closeout-2026-10-15/LIVE-ACCEPTANCE-R1.md` is corroborated here by fresh public provider responses and an exact-source replay. This worker did not repeat the complete production browser journey.

`src/lib/restaurants/geocode.ts` (Git blob `fea1a4e87672830dd3ec6d9309489eb0eeb167ab`) requests free-text Nominatim results with `limit=1`, then directly normalizes `results[0]`. Normalization falls back from settlement address fields to `address.county`. The location controller commits that returned location, while the UI closes the manual form. The UI invites a city/region/country or postal-code query; it does not offer a choice between different returned geographic entities.

## Independent public-provider evidence

Normal read-only GETs returned HTTP 200. No account, special credential, bypass or alternate prohibited route was used. Responses and URL/hash receipts are preserved beside this report. Queries used `format=jsonv2&addressdetails=1` and the application user-agent family, with sequential spacing for the additional comparisons.

| Input | Result observed | Interpretation |
| --- | --- | --- |
| `Benton, Arkansas, United States`, limit 1 | Benton County; `addresstype=county`, OSM relation 1818400; 36.3456186, -94.2670404 | Exact application request silently chooses the county. |
| Same text, limit 5 | County first; Benton second, `addresstype=town`, OSM relation 111083; 34.5645372, -92.5868280, Saline County, 72015 | The provider contains the intended municipality as a separate candidate. Two candidates were returned, not five. |
| `72015, Arkansas, United States` | Postal-area point 34.5738199, -92.5981433; Benton, Saline County | Recovery query resolves to the city vicinity, but is a postal point rather than a venue entrance. |
| `111 South Market Street, Benton, Arkansas 72015, United States` | Address point 34.5632068, -92.5882549; Benton, Saline County | Distinguishes visitor address from municipality/county centroids. |
| `Benton County, Arkansas, United States` | Benton County, same OSM relation and point | Explicit county intent remains legitimate and must not be globally suppressed. |

The county and municipality points are approximately 155.2 miles apart (great-circle calculation). Thus this is materially different search geography, not merely an abbreviated label. Provider importance values rank the county above the town in the captured response; the internal ranking rationale is not proven and may change. Nominatim internal `place_id` changed between requests, so it is not treated as permanent identity; OSM relation IDs are retained.

The Royal Theatre's own website freshly confirms **111 South Market Street, Benton, AR 72015**. Production's Royal record uses that visitor address and approximate Census-derived point 34.563224662909, -92.588223916041. The independently obtained address point is about 3.5 meters away. This corroborates approximate placement, not a verified entrance or parking location. **There is no basis for moving Royal to Benton County or changing its catalog address/coordinates.** The county returned for a manual search is not evidence that the catalog location is wrong.

Primary sources: <https://www.theroyaltheatre.org/>; the complete Nominatim query URLs in `nominatim-receipts.json`; <https://nominatim.org/release-docs/latest/api/Search/>. Nominatim documents that `limit` bounds the candidate count, free text is not structured city intent, and JSONv2 address classifications can vary. An official city PDF was blocked with HTTP 403 in the web extractor and was not bypassed or treated as a reviewed original.

## Reproducible exact-source corroboration

Run `node reproduction/reproduce-benton.mjs` from this packet's directory (Node 24 used). Exact released source bytes for geocode/model/types are included under `reproduction/src`, with Git-blob and SHA-256 receipts. The replay makes zero provider calls: it replays the captured originals and verifies current request parameters and normalized outcomes.

Result: **DEFECT_REPRODUCED**. City-style Benton input becomes Benton County without confirmation; postal and full address results normalize to Benton; an explicit county query remains county. `D3-REPRODUCTION.json` records the output. This is corroboration of failing current behavior, not passing-after evidence and not a new release-candidate test result.

## Proposed separate bounded correction

1. On explicit manual submission, retrieve up to five provider candidates. Do not introduce autocomplete polling or additional country assumptions.
2. Preserve finite coordinate validation and original free-text query. Retain provider identity, full display label and locality type for the selection UI; keep a county distinct from a city/town and keep postal/address points distinct from both.
3. When multiple distinct candidates remain, show an accessible list with full labeled geography and no preselected result. Commit coordinates only after the user explicitly chooses one. For a sole county/region-level result, require an explicit “Use [full location]” confirmation instead of silently interpreting it as a municipality.
4. Keep explicit county searches usable. Do not hard-code Benton, prefer a presumed country, globally ban counties or modify Royal's catalog point.
5. Preserve the previous search location while selection is unresolved. Cancel, query edits, unmount, a newer manual lookup, and device-location requests must invalidate older results and choices using the existing controller's request ownership.
6. Leave reverse geocoding's GPS coordinates unchanged; a provider label must never relocate a device coordinate. Provider timeout and malformed-response behavior must stay fail-safe.

Likely isolated scope: geocode result types/normalization, manual lookup response, location controller, location control, and focused unit/browser tests. No seasonal/provider radial logic, catalog, Directions, database, deployment, or PR #73 changes.

Required failing-before/passing-after acceptance: captured Benton county-first/town-second input; reversed provider order; duplicate versus distinct OSM entities; explicit county query; 72015 and international postal queries; Toronto/London/Sydney and non-Latin names; missing address fields; invalid coordinates/empty response/timeout; no-location-change before explicit selection; selection commits only chosen coordinates; cancel/relocation/stale-response races; unchanged GPS point and fallback; keyboard/focus/accessibility and 320/390/512 containment. Retain the current reproduction as original failure evidence.

This is an implementable proposal, not an accepted correction. No code candidate or independent implementation PASS is claimed. The next safe action is to implement and test this separately after the current isolated review work; no owner release approval is requested for D3 at this checkpoint.
