# Seasonal Attraction Discovery #1 — two-source architecture note

Status: research only; no join, adapter, transport, source configuration, or contract change.

## Proposed boundaries

| Component | Permitted factual role | Evidence not supplied |
| --- | --- | --- |
| A: Montgomery County AgriTourism, item 98996b62c9ab4a9a8e12de859565790a, layer 0, OBJECTID 3 | Farm/attraction name, explicit CornMaze Yes, structured address components, candidate source-served point, contact/website assertions | 2026 season, dated hours, lifecycle, operator legal identity, point meaning/accuracy |
| B: not selected | A future individually permission-reviewed operator attestation or open official seasonal feed, linking the same attraction/location to an explicit 2026 corn-maze calendar and status | No endpoint, reuse grant, access authority, or factual row established in this discovery |

The source A item-specific government data grant is independent of B's authority. A website URL inside A is neither B's permission nor a universal join key. Do not use a paid scraper, geocoder, proxy, ticketing API, or Google/Yelp/TripAdvisor dependency.

## Provenance and identity

Keep A's publisher/item/layer/native ID, exact factual query and source URL, fetched timestamp, reduced-content hash, observed values, and raw-data version metadata separate from B's source ID, URL, factual hash, dates, and grant. County publisher identity must not become farm operator identity. OBJECTID may be regenerated; no GlobalID or durable cross-version guarantee was obtained. Persist the namespace plus observation version and require an explicit reviewed identity crosswalk.

Create distinct reviewed operator, venue, attraction, physical-location version, and seasonal occurrence identities only after evidence supports them. Never use an address fingerprint as attraction identity. Preserve the exact source name Arader Tree Farm until an alias to Arader Farm is explicitly reviewed. A farm can host multiple independent attractions, and a future move must create an honest location version.

US and America/New_York are potential reviewed constants, not fields received from the row. Record their supporting jurisdictional evidence and transformation. Normalization may retain street abbreviations or standardized country/state codes with provenance; no guessed postal code or geocoded replacement.

The source supplies a 4326 x/y point in the sampled query. Point meaning is unknown and positional uncertainty is absent. Do not call it operator-published, entrance, venue, or verified until that is established. A reviewed map route might fit the existing method enum, but merely displaying a dot is not the review. Preserve an address-bound evidence trail; no geocoder is necessary or authorized.

## Existing contract obstacles

Inspected at immutable starting commit: tools/seasonal-facts/schema.ts, builder.ts, policy.ts and README.

- Every source remains enabled=false; collection always throws. Source selection changes none of these gates.
- The source contentTypes enum allows text/html, text/plain and application/ld+json, not ordinary application/json. ArcGIS JSON returned application/json; the item metadata returned text/plain but is not attraction row data. Do not mislabel the JSON response as a permitted parser mode or hide it inside JSON-LD.
- The ten-field outFields string in this research query is 86 characters and fits the current allowedQuery value maximum of 100 characters. Future query design must check the final projection and all other policy bounds; this query length is not an identified blocker.
- The builder requires every selected observation to carry explicit matching season/year evidence and not be historical/unconfirmed. A static A observation cannot have its year changed to 2026 because B provides an event date. Keeping the original A observation with absent season while selecting its assertions would quarantine the occurrence.
- Observation schema has no generic multi-source derivation-evidence link. Do not collapse A and B into one misleading sourceId/contentHash or attach B's calendar to A's canonical URL. A future explicit operator attestation could independently confirm current category, address and point reuse, but no such attestation exists here. Whether such corroboration can be represented without schema change is a required design review, not a resolved fact.
- sourceUrl assertions must equal their own observation canonicalUrl. Do not substitute a farm link for the county query URL.
- Calendar requires dates or bounded intervals; season/year plus a generic Hours string is insufficient. Do not expand a seasonal start/end to every intervening day unless evidence states that schedule.
- Verified coordinates require known point meaning, uncertainty, reviewer/time, source/evidence IDs, matching coordinate assertion and the physical version's address fingerprint.
- Immutable evidence, rejected/conflicting assertions and negative lifecycle barriers must survive. A's omission, a null field, or a removed directory row does not prove closure. B's active assertion cannot erase a prior negative fact.

## Zero-dollar proposal and decision

A future approved identity refresh could use a single exact anonymous HTTPS Query with a small fixed factual projection, manual cadence, no pagination/retries, a 10-second deadline and explicit byte limits. The observed API needs no card/key/account, and coordinate reprojection is not a geocoder. maxRecordCount=2000 is not a requests-per-second promise. Any 401/403/429/challenge/transport failure stops that attempt; do not switch to a scraper or paid route. Existing contract permission/robots/terms reviews still must be completed.

B would need a separate explicit grant and bounded zero-dollar access plan, or an operator-provided factual attestation used manually under its stated permission. No contact was sent and no permission was invented. The next review may conclude that independent manual evidence can fit v1, or that a separately authorized provenance/content-type design is needed. This discovery approves neither outcome.

**Contract-feasibility verdict: plausible fact architecture; unchanged-contract join not demonstrated. Current-season corroboration, point review, and truthful season provenance remain mandatory.**
