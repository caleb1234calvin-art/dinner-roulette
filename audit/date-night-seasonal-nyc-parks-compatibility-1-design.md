# NYC Parks compatibility proposal — design only

Status: provisional, unimplemented, not authorization to collect. Parent review is BLOCKED. The factual address, coordinate, timezone and identity gaps must be resolved separately; these transport/parser changes cannot manufacture missing evidence.

## E. Exact inert JSON support

Add one separately versioned response-policy variant for an explicitly opted-in source/parser: exact media type `application/json`. Preserve existing v1 source/envelope validation and its nine required own fields for all existing sources. Do not disguise JSON as JSON-LD/plain text or accept arbitrary `+json`, JavaScript, JSONP, NDJSON, multipart, or HTML responses. Existing global ceilings must never increase.

| Control | Proposed NYC source ceiling / behavior |
| --- | --- |
| HTTP result | Only complete HTTP 200 body; error objects, 204, partial 206, redirects and incomplete streams fail |
| MIME | One unambiguous Content-Type; case-insensitive HTTP token comparison to `application/json`, canonicalized to that exact value; no sniffing |
| Charset | No parameter means UTF-8; the sole optional parameter is `charset=utf-8` (case-insensitive token, optionally quoted). Duplicate/unknown parameters and UTF-16/other encodings fail. Decode UTF-8 fatally; reject BOM and unpaired surrogates |
| Header bytes | At most 16,384, measured while receiving |
| Wire body bytes | At most 262,144, including transfer-decoded entity bytes before any content decompression; separately cap protocol/header framing |
| Decompressed bytes | At most 262,144. Minimal variant requests `Accept-Encoding: identity` and rejects non-identity encoding; compression is not added implicitly. The count remains mandatory and equals wire entity bytes in this variant |
| JSON bytes | At most 262,144 UTF-8 bytes, including JSON whitespace; equal to decoded body length for this format; no uncounted prefixes/suffixes |
| Nesting | At most 4 container levels; root array is level 1, row object level 2, URL value object level 3; reject deeper input before allocation |
| Object members | At most 11 per row, and exact field allowlist; URL object at most 2 documented keys; no other object shapes |
| Array size / record count | Root array at most 25 records, also at most requested limit; nested arrays rejected; no pagination |
| Strings / keys | At most 2,048 UTF-8 bytes per string; 32 bytes per decoded key; narrower fact limits still apply (e.g. name 200 characters). Reject rather than truncate |
| Tokens/nodes | At most 2,048 parsed JSON values and 2,048 member-name tokens, bounded during parse |
| Numbers | Finite JSON numbers only; reject non-finite conversion and loss of required exact numeric value. Native ID must be a safe nonnegative integer or canonical decimal string after lossless token validation; never round an ID |
| Requests/time | One row request, concurrency one, zero redirects/retries, 10,000 ms total including DNS/TLS/body/parsing; 5,000 ms connect within total |

The 25-record design ceiling is not this review's request count or an empirical feed-size claim. Byte bounds override record limits. Receiving exactly 25 rows is saturation, not proven completeness: preserve factual evidence for review but do not claim full feed coverage or silently expand/paginate. For an initial one-record pilot, coverage of the entire feed is unnecessary; each selected occurrence still needs full factual verification.

Use a bounded strict JSON tokenizer/parser that detects duplicate decoded member names before a normal object is constructed. A `JSON.parse` reviver alone cannot detect overwritten duplicates. Recognize only RFC JSON syntax, not comments, trailing commas, functions, constructors, expression evaluation, script tags or JSONP wrappers. No eval, `Function`, VM, dynamic import, remote schemas, scripts, browser, subresource resolution, LLM extraction or reviver-driven class construction. No interpretation of JSON-LD context or URL strings.

Construct plain data with null-prototype maps, own data properties and dense arrays. Reject `__proto__`, `prototype` and `constructor` as decoded keys at every depth, including escape-spelled equivalents. Reject accessors, symbols, inherited fields, functions, exotic prototypes and sparse arrays when validation is invoked directly with runtime objects. Never merge source maps into prototypes/configuration. JSON strings that happen to contain code remain inert and must pass their factual field validator; they are never executable content or HTML.

Source-record keys are exactly `guid,title,link,starttime,endtime,parkids,parknames,location,categories,coordinates,contact_phone`. Unknown keys (including prose/media) and duplicate keys reject the response; do not silently strip them after retaining a raw log. Socrata can omit null fields, so distinguish an optional missing contact from an incomplete required fact. Missing identity/date/activity/location evidence quarantines a row; it never receives invented defaults. A malformed envelope/top-level shape invalidates the response atomically and preserves last good data.

The URL datatype wire shape needs confirmation from the first permitted sample. Provisional accepted shapes are an HTTPS string or a plain object with a required `url` string and an optional short `description` label, if the official datatype/sample establishes that shape. That nested label is never retained or used as factual activity evidence; it is distinct from the excluded event `description` column. If exact projection to `link.url` is not documented and a label would violate the final evidence-minimization decision, reject the row pending design review rather than widening fields. No new network permission comes from a source URL. Reject non-HTTPS or unreviewed-host links as publishable provenance; do not rewrite HTTP to HTTPS without evidence.

Raw transport hashing and normalized factual hashing are separate. Compute raw SHA-256 incrementally without logging full bodies. After strict validation, produce a reduced plain factual record; preserve coordinate pair order and source semantics before any canonicalization. Deterministically serialize sorted object keys, lossless canonical IDs, NFC/collapsed display whitespace and explicit normalized dates, retaining the raw-to-normalized field decisions. Order row collections by native ID and reject duplicate identities/conflicting values. Do not use the existing set-sorting `canonical()` on unparsed coordinate arrays or order-sensitive source data: it sorts arrays. Use it only after conversion to the contract's defined unordered collections and named `lat`/`lon` fields. Hash canonical UTF-8 plus one LF for exported artifacts, consistent with current artifact hashing; never make wall-clock time part of a content hash.

## Preserve remediation and network boundaries

The new envelope must have a strict version discriminator with an exact own-key set. It retains all existing metrics (`contentType`, `headerBytes`, `wireBytes`, `decompressedBytes`, `elapsedMs`, `domNodes`, `depth`, `jsonLdBytes`, `requests`) and requires JSON-specific measurements: `jsonBytes`, `recordCount`, `maxObjectMembers`, `maxArrayItems`, `jsonValueCount`, `jsonKeyCount`, `maxStringBytes`, `maxKeyBytes`, plus validated `charset` and `contentEncoding`. None may be optional or synthesized as zero after omission. Applicable zero measurements such as `domNodes` and `jsonLdBytes` must be explicitly supplied by trusted instrumentation and equal zero. Plain-object/own-property validation must reject missing, inherited, undefined, hidden-extra and symbol keys, NaN/infinity, negative/fractional/unsafe integers and wrong types. All limits are checked against both source-specific and unchanged absolute ceilings. Check body/count consistency and elapsed time, not merely independent numbers.

Measurements come from trusted transport/parser instrumentation, never a publisher-provided metrics object. The old envelope remains exact and fail-closed; do not append optional fields or accept unknown versions. Source-policy versioning, opt-in MIME eligibility and parser version must be explicit, with backward rejection tests. The allowed MIME array cardinality must be reviewed when adding one enum value; NYC only needs `application/json`, not automatic access to all content types.

Keep HTTPS/443, exact host/path policy, no credentials/user URLs, ambiguous-URL rejection, public-only DNS answers, per-connection DNS pinning and socket-peer verification. A DNS failure, redirect, private/reserved answer, rebinding mismatch, oversize body, parse failure, challenge, 401/403/429 or timeout stops the attempt. No fallback host or parser, redirect following, retry, token registration, paid service or browser. Keep `NETWORK_ENABLED=false`, source `enabled=false`, and the offline guard intact during any separately authorized contract implementation. `collectSource` still throws until a distinct collector task is approved.

Required later offline verification includes all ceilings and ceiling-plus-one; malformed MIME/charset/encoding; duplicate escaped keys; prototype attacks; deep/oversize/unterminated JSON; missing/inherited metrics; lossy IDs; URL-label exclusion; query tampering; null omissions; coordinate order; deterministic output; and retained snapshots on failure. No such tests were implemented or run here.

## F. Source-specific query contract

**Choose B: permit `$where` only via an exact internally generated template.** A fixed unfiltered first page could be dominated by unrelated park events and would not be an adequate targeted candidate-discovery design. A reviewed literal activity/year filter reduces data volume without exposing query construction. Local affirmative classification still controls eligibility; server filtering does not approve activities.

Bind policy ID `nyc-parks-w3wp-dpdi-2026-v1` to this exact GET origin/path only:

`https://data.cityofnewyork.us/resource/w3wp-dpdi.json`

The only required keys are `$select`, `$where`, `$order`, `$limit`; all four must occur exactly once. All values are immutable trusted literals in this provisional 2026 template:

| Key | Exact value |
| --- | --- |
| `$select` | `guid,title,link,starttime,endtime,parkids,parknames,location,categories,coordinates,contact_phone` |
| `$where` | `starttime >= '2026-01-01T00:00:00' AND starttime < '2027-01-01T00:00:00' AND (upper(title) like '%PUMPKIN PATCH%' OR upper(title) like '%CORN MAZE%' OR upper(title) like '%HAUNTED HOUSE%')` |
| `$order` | `starttime ASC,guid ASC` |
| `$limit` | `25` |

Exact equality is required, not a blacklist or generic SoQL sanitizer. This accepts no caller-supplied year, title, filter, field list, order, limit, dataset ID or URL. Advancing the season/year or modifying spelling variants requires a reviewed versioned template. The 2026 template's scope is intentionally narrow and is not a claim to find every qualifying event. `$query`, `$q`, `$offset`, `$group`, `$having`, `callback`, `$$app_token` and every unknown key are denied. No joins, aliases, arbitrary functions, regex queries, cross-dataset queries, full exports or code in values. Diagnostic R02/R03 queries from research do not become enabled runtime alternatives.

Trusted code builds the URL using a single defined percent-encoding procedure and fixed key order. The validator must reconstruct that same URL from policy ID and require canonical equality, plus exactly-once decoded key/value equality. This catches duplicate keys including mixed escaped spellings, double encoding, fragments, userinfo and query-embedded redirects/URLs. No arbitrary URL string may enter from a user, row, environment variable or remote source definition.

The existing query-name regex and 100-character enumerated-value cap both need a narrowly discriminated policy branch: this `$where` is longer than 100 characters. Do not globally loosen either. Existing generic sources retain their old schema/validator. Only this source ID + origin + exact path + trusted template version may use the four exact dollar keys and reviewed literal lengths, within the unchanged 2,048-character whole-URL ceiling. Unknown policy IDs/versions and a source claiming another source's template fail closed. Generic source `allowedQuery` remains unable to express arbitrary `$...` keys.

Native IDs must be present/unique for the requested deterministic ordering; missing/duplicate IDs reject the batch. No second page is implied by saturation. The first successful sample must confirm endpoint version, null behavior, URL wire shape and field semantics before this design can be called ready. Current SODA3 `/api/v3/.../query` endpoints are outside the template because token/auth requirements conflict with this review's core no-key requirement.

## G. No-cost cadence and provenance

After separate approval only: at most one 25-record projected row request per 24 hours, no concurrency, retries or cursor loops. Metadata/robots/terms refresh is separately bounded (up to one request each when due), at least one second between requests and never as a substitute row path. Stop on 429 and require review before resuming; obey a longer Retry-After as a minimum, never as permission to retry automatically. Retain last good timestamps on all failures. Unknown/expired permission pauses collection. Any new supporting address source needs separate approval and its own bounded cadence.

Anonymous public HTTPS with local inert processing and local address hashing introduces no account, key, card, paid quota, paid proxy, paid geocoder or reseller. Free hosting capacity and anonymous service availability are not guaranteed. If the no-key interface ceases to work, the result is unavailable/blocked, not silent migration to SODA3, credentials or billing. No automation has been scheduled.
