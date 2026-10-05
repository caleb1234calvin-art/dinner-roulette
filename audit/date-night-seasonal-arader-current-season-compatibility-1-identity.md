# Arader identity and location assessment

Research review, 2026-10-05. No runtime identities or alias decisions created.

## Crosswalk evidence and limits

| Concept/field | Source A county observation | Potential tourism Source B | Decision |
| --- | --- | --- | --- |
| Publisher | Montgomery County GIS / MCPC | Valley Forge Tourism & Convention Board | Separate publishers; neither becomes operator |
| Exact display name | Arader Tree Farm | Arader Farm | Retain both spellings; candidate alias only |
| Street | 746 South Trappe Road | 746 S. Trappe Road | Reviewed South/S. expansion is compatible, not a merge key |
| Locality/state | Collegeville / PA | Collegeville / PA | Compatible location components |
| ZIP | 19426 | Not in reviewed article | Not independently corroborated |
| Phone | 610-489-8878 | Not in reviewed article | County assertion only |
| Website | https://araderfarm.com/ | Outgoing araderfarm.com link | Additional affirmative link, not proof of website ownership |
| Native ID | OBJECTID 3 in pinned item/layer | Article URL; no farm-native record ID observed | Different source namespaces |
| Operator identity | Not established | Not established | No owner name or legal entity imported from snippets |
| Venue | Farm physical-place lead | Compatible farm lead | Plausible same venue; no accepted operator attestation |
| Attraction | Explicit county CornMaze="Yes" | Corn-maze lead | Does not identify a distinct durable maze entity or current occurrence |
| Occurrence | No season/year/calendar | Dated 2026 article context | No permission-approved occurrence crosswalk |
| Physical location version | Address and candidate point | Address lead only | Version identity would require explicit review; point not verified |

This is more than fuzzy name similarity: county domain assertion, the tourism domain link and compatible physical address support a candidate same-venue relationship. They do not establish the legal operator, exact recurring attraction identity, historical alias continuity or a permission-qualified 2026 event. Do not merge runtime records or normalize away “Tree” without a reviewed authorized alias decision. Do not import Varner-family history, inferred owners or commercial-directory IDs.

Publisher, operator, venue, attraction, seasonal occurrence and physical location version remain separate. Assign opaque reviewed entity IDs only after evidence supports each. A later move changes physical location version; a later season changes occurrence identity; an address fingerprint is only a point-reuse guard. Do not repurpose it as the attraction identity.

## Country and timezone transformations

County metadata directly identifies Montgomery County, Pennsylvania; the pinned row supplies PA and a full US-style address. [USPS Publication 28 Appendix B](https://pe.usps.com/text/pub28/pub28apb.htm) maps PA to Pennsylvania and S to South. Geographic jurisdiction, not postal formatting alone, supports `country=US`. Record a reviewed derivation from the county provenance plus that jurisdiction mapping; retain the received four address fields separately. Source A has no country field in the sampled projection.

For this reviewed Pennsylvania location, use `America/New_York` as a geographic derivation. [49 CFR 71.4](https://www.ecfr.gov/current/title-49/subtitle-A/part-71/section-71.4) defines the Eastern zone; [IANA zone1970.tab](https://data.iana.org/time-zones/tzdb/zone1970.tab) identifies America/New_York as the main US Eastern zone. No external geocoder or coordinate-to-timezone API is involved. The decision applies to this location, not an unconditional all-US rule. Preserve the IANA identifier, not a fixed UTC offset or a claim that the county supplied local operating timezone. The layer's `dateFieldsTimeReference` concerns timestamp storage, not visitor calendar timezone.

Proposed research derivation records, not current contract input:

| Output | Evidence | Transformation | Reviewer/date |
| --- | --- | --- | --- |
| US | Source A jurisdiction description + row state PA + USPS mapping | Reviewed jurisdiction-to-country constant | codex-research-reviewer / 2026-10-05 |
| America/New_York | Same reviewed Pennsylvania location + Eastern-zone/IANA references | Reviewed location-to-IANA constant | codex-research-reviewer / 2026-10-05 |

Unchanged v1's address assertion includes country in a single strict object and lacks per-component derivation lineage. A truthful future representation must explicitly distinguish original county components from the reviewed added country. Do not publish the composite as if all five components came from the county. The same provenance limitation affects the derived timezone.

## Coordinate evidence

The prior immutable factual response declared spatialReference.wkid/latestWkid 4326 and used x/y; x is longitude, y latitude. Retain its original row response hash `1a0a06f9e4e16fac3b56776a75880b804ed671558e6ab1a9dbb06f744ff8cbd4` and original request-start timestamp `2026-10-05T18:34:52.923121+00:00`; exact response-completion time was not retained. This review does not change its checkedAt or pretend the row was fetched again.

New layer metadata describes an agritourism-location layer, uses esriGeometryPoint with native 102100/3857, and contains no reviewed point definition or positional uncertainty. Service reprojection to requested 4326 does not add accuracy. `hasMetadata=true` is not the content of a positional-method statement. The two Source A request cap precludes additional metadata calls here. Thus entrance/venue/parcel-centroid remain unestablished, uncertainty remains null, and verified coordinates are unavailable. Point meaning cannot be selected from visual plausibility, drawing-symbol size, decimal count or extent.

Do not set a false method merely to satisfy schema: numeric source evidence stays outside a verified coordinate record until a legitimate method is supported. Under the present contract an unresolved record can retain no reusable point; the original numbers remain recoverable from research evidence. No location record or runtime output is emitted in this task.

## OBJECTID durability and proposed provenance identity

[Esri's ObjectID documentation](https://pro.arcgis.com/en/pro-app/3.3/help/data/geodatabases/overview/arcgis-field-data-types.htm) promises a system-managed unique row identifier in a table, not durable attraction identity across republishing. [Esri's alternate-ID guidance](https://pro.arcgis.com/en/pro-app/3.4/tool-reference/network-analyst/update-by-alternate-id-fields.htm) documents that some editing workflows change ObjectIDs; that example is a general limitation, not evidence this particular county row changed. Fresh county metadata confirms system-maintained OBJECTID and an empty GlobalID field. Durability is not guaranteed here.

Keep three identities distinct:

1. **Source locator:** publisher namespace `montgomery-county-pa:montco-gis`, item `98996b62c9ab4a9a8e12de859565790a`, layer `0`, observed OBJECTID `3`, pinned service URL. The object number is a lookup hint in that observed version.
2. **Immutable observation:** a separate ledger ID bound to source locator, exact query-template version, response/factual content hash, actual retrieval timestamps, available item/layer version metadata and permission-review reference. Preserve raw-response hash separately from reduced normalized factual hash. Missing row edit time remains missing; item/layer timestamps do not become row-review or season time.
3. **Reviewed entity/occurrence crosswalk:** explicit evidence IDs, reviewer/time and same/distinct/unresolved decision tying that immutable observation to separately assigned attraction/venue/location/occurrence IDs. No name/address hash is an immutable entity ID.

On refresh, the same OBJECTID is only a candidate match. A changed ID with a similar address is also only a candidate. Deletion, republishing, conflicting attributes or reuse of 3 triggers review and preserves prior observations/crosswalks; it neither merges automatically nor asserts closure. A content hash identifies observed content, not enduring real-world identity. The future one-ID query deliberately cannot discover a renumbered row; a zero-row response stops and requires reviewed rediscovery, not query broadening.
