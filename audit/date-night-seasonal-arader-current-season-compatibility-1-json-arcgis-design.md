# ArcGIS application/json and immutable query proposal

Design only; not a source configuration, collector implementation, policy amendment or approved live request. Overall review is BLOCKED. Source A does not supply current season or verified coordinates, and JSON support cannot fix missing evidence.

## Fixed source/query binding

| Component | Exact required value |
| --- | --- |
| Proposed template ID | montco-agritourism-objectid3-v1 |
| Scheme / port | HTTPS / 443 |
| Host | services1.arcgis.com |
| Owner path component | kOChldNuKsox8qZD |
| Service | Montgomery_County_AgriTourism |
| Exact path | /ArcGIS/rest/services/Montgomery_County_AgriTourism/FeatureServer/0/query |
| Reviewed item binding | 98996b62c9ab4a9a8e12de859565790a |
| Layer | 0 |
| Method | GET |

Exactly these six keys, each once, in this canonical order:

| Parameter | Immutable decoded value |
| --- | --- |
| objectIds | 3 |
| outFields | OBJECTID,Name,Address,City,State,Zip_Code,Phone_Number,WebSite,CornMaze,PumpkinPicking |
| returnGeometry | true |
| outSR | 4326 |
| resultRecordCount | 1 |
| f | json |

This chooses the documented ArcGIS objectIds selector instead of a WHERE clause. Deny `where`, `orderByFields`, `resultOffset`, all alternate selectors, `outFields=*`, token, callback, geometry filters, statistics, pagination, output format/SR changes, and every unknown key. No user/environment/remote row supplies URL or query components. The service item is a reviewed policy binding, not a caller-controlled query parameter. Changing item/layer/native ID or query shape requires a reviewed template version. One-ID lookup is not a promise that OBJECTID is durable.

Trusted code must construct the same complete URL from the internal template ID, encode UTF-8 parameter names/values once using one specified URLSearchParams serialization, and require exact canonical equality. Validate all six decoded keys and values as well as canonical URL bytes; reject omissions, duplicates including escape variants, double encoding, reordered/noncanonical encodings, appended delimiters, userinfo, fragments, alternate hosts/ports, ambiguous paths, IP literals and unreviewed redirects. Do not simply pass an arbitrary caller URL through a broad ArcGIS validator.

The projection is 86 characters and all literal values fit the existing 100-character query-value bound. Parameter names fit the existing regex. No dollar-key exception, arbitrary SQL sanitizer or global query-length relaxation is needed. Existing generic validateUrl checks only supplied keys; exact required-key completeness is additional design. The item metadata's lowercase `arcgis` service-path spelling and this previously observed successful `ArcGIS` query path are recorded distinctly; allow exactly the reviewed query spelling, not a case-insensitive path wildcard.

Before any later activation, permission and source binding require review; if new metadata contradicts the pinned item/service/layer or schema, stop. Do not add a row-query `itemId` parameter that Esri does not define as this binding. No general ArcGIS service/layer URLs are accepted.

## Narrow transport and envelope

Opt in a separately versioned source/parser/response-policy variant for ordinary JSON. Preserve existing v1 MIME enum behavior and exact nine-own-key measurement envelope for legacy sources; do not globally accept JSON because ArcGIS uses it. The new variant is explicitly bound to the one source/template and parser version. Keep `NETWORK_ENABLED=false`, `enabled=false` and offline collectSource throwing until a distinct authorized collector task.

| Control | Proposed ceiling or behavior |
| --- | --- |
| HTTP | Only complete status 200; 204/206, error envelopes, truncation, challenge and other statuses fail |
| MIME | Exactly media type application/json after case-insensitive HTTP-token normalization; no sniffing or arbitrary +json |
| Charset | UTF-8 only; absent parameter means UTF-8; optional sole charset=utf-8, optionally quoted. Reject duplicate/unknown parameters, BOM, invalid UTF-8 and unpaired surrogate escapes |
| Content encoding | Request identity and reject non-identity encoding in first variant; no implicit decompression route |
| Headers | 16,384 bytes maximum, streamed bound |
| Entity wire / decoded body / JSON | Each independently at most 65,536 bytes, including whitespace; identity encoding requires consistent equal body counts |
| Records | features array contains at most 1; required native ID is exactly 3; zero records means unavailable pending review, not closure |
| JSON container depth | 4: root, features array, feature object, attributes/geometry; metadata arrays similarly bounded |
| Object members | Root at most 8; exact context-specific allowlists below; attributes exactly 10 |
| Arrays | features <=1; fields exactly 10 in a successful record envelope; no other arrays |
| JSON values / keys | At most 1,024 values and 1,024 member-name tokens, measured during parsing |
| String / key bytes | 2,048 / 64 maximum, with narrower source/fact limits below; reject rather than truncate |
| Network budget | 1 request, concurrency 1, 0 redirects, 0 retries, total 10,000 ms including DNS/TLS/body/parse; connect <=5,000 ms within total |
| Cadence | Future manual refresh only, at most once per 24 hours, conditional on permission; no schedule created |

Limits are conservative design choices, not measured county accuracy or published service quotas. Preserve unchanged absolute caps. Enforce header/body/token/depth ceilings while receiving/parsing, not after unbounded allocation. Source failure stops; no host/parser swap, credentials, paid proxy, scraping gateway, browser, automatic retry or geocoder. Future transport must retain public-only DNS answers, pinned address/socket peer checks, HTTPS and certificate verification. A longer Retry-After is a minimum wait, not authority to retry automatically.

The new metrics variant needs an exact own-key set/version discriminator, trusted transport/parser instrumentation, and all old metrics plus JSON byte/record/token/member/array/string/key/encoding measurements. Every numeric measurement is a required finite safe nonnegative integer. No omitted/inherited/undefined/NaN/fractional/hidden-extra/symbol field passes; no omitted metric defaults to zero. `domNodes=0` and `jsonLdBytes=0` are explicit trusted measurements for this variant, not permission to omit them. Require count consistency and source ceilings as well as global ceilings.

## Strict inert ArcGIS JSON grammar

Use a bounded JSON tokenizer that detects duplicate decoded member names before constructing objects. JSON.parse plus a reviver alone cannot detect duplicates already overwritten. Reject trailing tokens, comments, trailing commas, JSONP, JavaScript, HTML, multipart, NDJSON, nonfinite numeric conversion and lossy native-ID conversion. No eval, Function, VM, browser, script execution, LLM extraction, remote schemas/contexts, imports, subresources or URL dereferencing.

Build null-prototype data maps and dense arrays with own data properties only. Reject decoded `__proto__`, `prototype`, `constructor` at all depths including escaped spellings; runtime-object entry points reject accessors, functions, symbols, exotic prototypes, inherited fields and sparse arrays. Never merge source data into application configuration or object prototypes. Publisher metadata layers are not accepted by the row parser merely because they also contain JSON.

Provisional exact response grammar derives from the previously obtained factual response, not a newly executed one-ID query:

| Object | Exact allowed shape |
| --- | --- |
| Root | Required objectIdFieldName, uniqueIdField, globalIdFieldName, geometryType, spatialReference, fields, features; optional exceededTransferLimit. No error or expressive extra fields |
| ID metadata | objectIdFieldName="OBJECTID"; uniqueIdField={name:"OBJECTID",isSystemMaintained:true}; globalIdFieldName="" |
| Geometry metadata | geometryType="esriGeometryPoint"; spatialReference={wkid:4326,latestWkid:4326}, allowing latestWkid to be absent only as an explicitly reviewed optional field |
| Transfer flag | Absent or false for the one-ID candidate; true stops acceptance without pagination |
| Feature | Exactly attributes and geometry |
| Attributes | Exactly the ten projected names above; OBJECTID is numeric safe integer 3; all other values are strings or explicit null |
| Geometry | Exactly numeric finite x and y, longitude [-180,180], latitude [-90,90]; no z/m, nested SR override, rings, paths, coordinate arrays or geometry collections |
| fields descriptor | Ten distinct field names matching projection; each descriptor only name,type,alias,sqlType,domain,defaultValue and string-field length; fixed documented types and sqlTypeOther, null domain/defaultValue |

Validate each field descriptor against the recorded source schema: OBJECTID is esriFieldTypeOID with no length; other fields esriFieldTypeString. Source maximum character lengths: Name 254; Address/City 50; State 2; Zip_Code 5; Phone_Number/WebSite 254; CornMaze/PumpkinPicking 255. Aliases are bounded metadata and never executable mappings. Fact limits remain stricter where applicable (name 200, phone 60, combined address 500). Unknown/duplicate/missing keys or schema drift reject the envelope pending review; do not silently drop them. Null is not No; missing required identity/address/category facts prevents eligibility and never receives a default. CornMaze="Yes" supports a static category mapping only, not 2026 operation.

The exact one-ID response was deliberately not fetched under this review's two-request Source A budget. Before this proposed grammar is called implementable, a separately authorized, bounded sample must confirm its envelope/optional-field behavior. Unexpected documented variants need explicit version review, not permissive acceptance. Successful transport/parse still yields research facts, never automatic contract eligibility.

## Deterministic preservation

Hash raw entity bytes incrementally without publishing raw bodies. Separately hash the reduced validated factual object with an explicit normalization/parser version. Use sorted object keys, a lossless canonical native ID, preserved coordinate scalar values, NFC/whitespace display normalization and explicit transformation records. Export canonical UTF-8 JSON plus one LF; observation times are provenance metadata, not content freshness manufactured from a hash. Keep A and B hashes separate. Do not apply the contract's set-sorting canonical() to unparsed or order-sensitive source arrays; convert x/y to named lon/lat first. Keep raw token evidence as needed for loss detection without exposing expressive payloads.

Retain the source-native ID, exact query URL/template, item/layer, raw/reduced hashes, original observation timing and available source version metadata. Repeated content at a later retrieval is a new observation/check, not a new attraction ID; differing data under the same OBJECTID requires explicit crosswalk review. A successful parse does not upgrade coordinate meaning/uncertainty or inherit a season.

## Later verification gate

Only if separately authorized: offline adversarial cases for duplicate escaped keys, prototype pollution, field/geometry drift, unsafe numeric tokens, charset/MIME/encoding confusion, missing measurements, sparse arrays, each ceiling and ceiling-plus-one, required-key omission, selector/host/item/format tampering, transfer saturation, unchanged last-good behavior, coordinate order and deterministic hashing. No tests, transport or fixtures were implemented/run in this research task.

Primary interface reference: [Esri Query, Feature Service/Layer](https://developers.arcgis.com/rest/services-reference/enterprise/query-feature-service-layer/). Its broad capabilities are intentionally not enabled by this source-specific proposal.
