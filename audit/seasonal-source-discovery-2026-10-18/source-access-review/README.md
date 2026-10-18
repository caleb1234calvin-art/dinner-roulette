# PR84 first-party source access review — October 18, 2026

## Result: HOLD — no retrieval source cleared

All three existing first-party pilot leads remain `blocked-pending-policy-review`. Their registered public paths are not prohibited by the robots files retrieved in this review. A sufficient documented basis for automated factual retrieval and the intended storage/reuse was not established for any source. Public reachability and robots allowance are not a reuse grant. This is a bounded project eligibility decision, not a legal opinion that these operators prohibit automation.

Do not enable the registry, run a live collector, ingest fixtures captured without an established basis, publish any venue, or wire the prototype into runtime on this review. No operator contact is authorized or needed to complete this HOLD decision. FrightMaps remains excluded; no directory was accessed in this review.

## Reviewed candidate and prior work

- Repository: `caleb1234calvin-art/dinner-roulette`, draft PR84.
- Exact source head: `422bf4f352987d5d450ca14b7ef5898e7f300a66`.
- Tree supplied and independently recovered by the recovery lane: `55a2baa9a476e4cc533dfd97dccf0b792a590350`.
- Registry blob: `ac98bfd100601117a435515875f6b8199ad425eb`.
- Source README blob: `853a6a896fb0b61eceae08ddd221c48b89fdf9ac`.
- [Pinned registry](https://github.com/caleb1234calvin-art/dinner-roulette/blob/422bf4f352987d5d450ca14b7ef5898e7f300a66/audit/seasonal-source-discovery-2026-10-18/source-registry.json)
- [Pinned research handoff](https://github.com/caleb1234calvin-art/dinner-roulette/blob/422bf4f352987d5d450ca14b7ef5898e7f300a66/audit/seasonal-source-discovery-2026-10-18/README.md)

Read the registry, README and relevant prior source/release reports before reviewing these exact existing leads. This lane did not add replacements or redo the source inventory. Local source files were read solely to understand the fixture/provenance boundary; no source code, registry or continuity file was changed.

## Per-source findings

### sawmill-west-alton — The Sawmill at West Alton

Registered source: https://www.thesawmillatwestalton.com/
Policy URL: https://www.thesawmillatwestalton.com/robots.txt

Direct policy read returned HTTP 200 at 13:25:34 UTC, 309 bytes, SHA-256 `82a1c57f6446270c5c5adbb2fa62e11becdb4c9cc998a7754391b58228852325`.

The wildcard group disallows `/s/search`, `/s/cart/`, `/s/checkout/`, `/store/checkout`, `/store/status`, and `/product/*/*/leave-review`; it specifies `Crawl-delay: 5`. The registered root is not among those exclusions. Do not impersonate the separately listed Googlebot agents to obtain different treatment.

One bounded homepage request, solely for policy-link discovery, returned HTTP 200 with 47,761 bytes inspected. No anchor matching privacy, terms, copyright, legal, reuse, license or permission was found by the simple static matcher. This is not an exhaustive review of applicable terms and does not establish their absence. No raw venue HTML or extracted venue facts were retained.

Exact HOLD: robots evidence is available, but applicable terms/automated-access policy and the intended factual-reuse/retention/attribution basis remain unresolved. Static parser fit, current operation, dates, location and duplicate clearance were not reviewed. Future minimum request spacing must conservatively be at least five seconds per host unless a stricter applicable rule is found.

### lone-jack-acres — Lone Jack Acres Fall Fun Fest

Registered source: https://lonejackacres.com/fall-festival/
Policy URL: https://lonejackacres.com/robots.txt

Direct policy read returned HTTP 200 at 13:25:38 UTC, 116 bytes, SHA-256 `3e40acd1d2ed6d53ad5439b562c2bc3994516af7d90dadb783a1409b818954d0`.

The wildcard group disallows `/wp-admin/` and permits the specific `/wp-admin/admin-ajax.php` exception. No crawl delay is declared. This does not authorize calling that administration-adjacent endpoint or imply unlimited request rate. The registered festival path is not disallowed.

One bounded root-page request, solely for policy-link discovery, returned HTTP 200 with declared length 336,123 bytes. Inspection stopped at the 262,144-byte cap; the response was incomplete, so the footer may not have been inspected. No matching policy link was found in the inspected prefix. No range request, retry, sitemap traversal or other fallback was attempted. The registered festival page itself was not requested.

Exact HOLD: applicable policy/reuse basis is unresolved and homepage policy discovery was incomplete. The absence of a link in a truncated prefix proves nothing about terms elsewhere. No source-specific facts, event schedule, aliases or duplicate clearance were verified. A future approved transport needs a conservative explicit host budget even without a declared crawl delay.

### gospel-farms — Gospel Farms Fall Season

Registered source: https://www.gospelfarms.com/hours-pricing/
Policy URL: https://www.gospelfarms.com/robots.txt

Direct policy read returned HTTP 200 at 13:25:41 UTC, 185 bytes, SHA-256 `ff648b9c675b52e9ae02ea03800fd28315b652efde8e8477d223fa0cb0b0efc0`.

The wildcard group specifies `Crawl-delay: 10` and excludes `/admin/`, `/includes/`, `/config/`, `/logs/`, `/backup/`, `/.env`, `/wp-admin/`, and `/wp-includes/`. The registered hours/pricing path is not disallowed.

One bounded root-page request, solely for policy-link discovery, returned HTTP 200 with 64,798 bytes inspected. The simple matcher found no applicable policy anchor. Search-index discovery surfaced https://www.gospelfarms.com/pass-policies-guidelines/; its indexed title/text concerns season-pass visitor terms. It was not explicitly opened and is not a website-automation or reuse grant. No raw venue HTML or venue facts were retained. The registered hours/pricing page itself was not requested.

Exact HOLD: applicable website access/reuse policy and intended factual storage/redistribution scope remain unresolved. No source-specific facts, weather implications, operating calendar, location or duplicate clearance were verified. Future minimum request spacing must conservatively be at least ten seconds per host unless a stricter applicable rule is found.

## Request accounting and safety boundary

- Initial web-tool robots opens: 3. All returned `Internal Error`, without origin status or directives. These were tool/transport failures, not site denials. The subsequent explicitly bounded direct route recovered ordinary policy responses; no security warning, bot challenge or access denial was bypassed.
- Policy-only search calls: 2, containing 6 queries. Search indexing returned incidental visitor/event material; it was not imported, normalized, or used to certify venue facts. Search-service upstream request counts are not exposed.
- Direct ordinary HTTPS requests: 6, two per source: robots plus root solely for policy-link discovery. All returned 200 without redirects. No cookies were reused or retained. Sensitive/unnecessary response headers were removed from the saved evidence.
- Direct robot cap: 16,384 inspected bytes. Homepage cap: 262,144 inspected bytes. The reader may read one additional sentinel byte solely to detect overflow. Transport I/O timeout: 10 seconds per request; no claim of a separately enforced overall deadline.
- No retries within the direct route, no alternate hosts, proxy rotation, credentials, browser execution, JavaScript, CAPTCHA, paid API, geocoder, sitemap crawl, operator contact, directory access, venue-data parser invocation or collector execution.
- No registry activation, code mutation, commit, external publication, runtime import, merge, deployment or production check was performed by this lane.
- Six direct requests plus three explicit web opens are nine policy URL access actions. They are not a claim of nine origin wire transactions because web-tool/index behavior is opaque.

## Conditions before a real source fixture or retrieval can be eligible

1. A source-specific review must establish the exact operator/canonical host, applicable current terms and robots, automated retrieval scope, permitted factual fields, retention/cache/redistribution scope and attribution. Record actual policy URLs, observation times, evidence hashes, reviewer, decision reason and re-review/expiry trigger. A nonempty `rightsBasis` string is an assertion, not the supporting evidence.
2. Pin exact allowed HTTPS host/path/method, declared and stricter project rate limits, user agent, response type/size, timeout, finite request budget and cache/coalescing. Record all restrictions; do not treat a robots path allowance as a content license.
3. Independently verify the eventual real transport's DNS/public-IP egress controls, HTTPS/TLS, no redirects, exact destination identity, no implicit cookies/credentials, bounded streaming, 429/Retry-After handling and host-wide throttling. Current mock behavior is not that proof. The five-/ten-second source delays must hold across source IDs and concurrent workers sharing a host.
4. Capture a real fixture only under the established access and retention basis. Record source ID, requested/final URL, checked-at, status, content type, bytes/hash, capture tool/transport, relevant policy decision ID, and a distinct real-versus-synthetic label. Keep copyrighted descriptions, images, reviews and unrelated data out of fixtures unless separately licensed. Do not place unreviewed full venue HTML in a public repository.
5. For each factual output, retain an exact structural locator (JSON-LD block index and JSON pointer, or bounded selector), the observed factual value, normalization rule, source capture hash and timestamp. Current `evidence.fields` names alone are not sufficient to independently trace which source node supplied a field.
6. Date fixtures must distinguish actual operating dates from one continuous range, source-explicit year from inferred year, destination-local timezone from UTC, last visit date from editorial expiry, cancellations/closures from missing data, and current versus stale source evidence. Do not infer opening hours or Open Now from a date window.
7. Verify the supplied published and pending inventories are the complete current exact versions, including aliases, previous names, moves, shared operator/address identities and relevant negative-lifecycle records. Passing empty arrays is not independent duplicate clearance. Record inventory revision/hash and reconciliation outcome.
8. Positive and negative offline cases must include the source's actual permitted format, missing/malformed metadata, date-only/unknown-year and non-2026 dates, conflicting/removed events, multiple nodes, duplicate identities, changed policy, expired clearance, robots disallow, source delays, redirects, oversized responses, 429 and technical failures. Synthetic tests should remain plainly synthetic and cannot certify any real operator.
9. Independent factual and technical acceptance plus the owner's separate publication/release authority remain mandatory. Every discovery proposal remains unverified, nonpublishable and ineligible for Open Now until those boundaries are satisfied.

## Independent limitations

This review independently obtained current robots responses and performed bounded policy-link discovery. It does not independently establish operator identity/ownership, policy completeness, reuse permission, factual accuracy, current-season eligibility, exact schedule, location, complete deduplication, real-source parser correctness, server egress safety, hosted CI success, browser/native acceptance or production state. No website terms absence is asserted. The source-readme and registry dates are preexisting research assertions and were not recertified here.

A later materially changed candidate requires reconciliation; this report is tied to the pinned source head above. The result is a completed, bounded HOLD decision, not a running or automatically scheduled crawler/recheck.

## Evidence files

- `source-access-decisions.json`: structured per-source result and scope.
- `direct-policy-read-attempts.json`: exact sanitized direct robots request/result records.
- `policy-link-discovery.json`: root policy-link discovery metadata; raw venue HTML not retained.
- `sawmill-west-alton-robots.txt`, `lone-jack-acres-robots.txt`, `gospel-farms-robots.txt`: exact robot bodies.
- `search-and-web-attempts.json`: initial tool errors and bounded query accounting.
- `artifact-manifest.json`: hashes and byte sizes for this standalone audit packet.
