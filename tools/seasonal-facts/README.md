# Offline seasonal fact contract v1

This directory is an offline review/build surface. It has **no application import, network transport, source crawler, geocoder, paid dependency, scheduler, or production integration**. All committed data is invented. `.invalid` hosts and synthetic coordinates must never become production listings.

## Running it

Use the repository's locked dependencies and Node 24 (native TypeScript stripping):

```sh
node --import ./tools/seasonal-facts/network-guard.mjs --test scripts/seasonal-fact-contract.test.mjs
node_modules/.bin/tsc -p tools/seasonal-facts/tsconfig.json
node tools/seasonal-facts/generate-fixture.ts
node scripts/seasonal-fact-contract-audit.mjs
node tools/seasonal-facts/cli.ts input.json output-bundle.json [last-good-bundle.json]
```

`schema.ts` is the versioned strict input/output contract. Zod was already a locked product dependency; no dependency or package-script change is required. All nested input objects reject unknown keys. Factual assertions pass a field-specific schema, including coordinates and calendars. Review prose and page bodies are not input fields. Names use NFC and collapsed whitespace without lowercasing display spelling. Address fingerprints separately use normalized lowercase components; they are point-reuse guards, never identity keys.

## Identity and evidence

An occurrence ID hashes the reviewed attraction ID, season, year, and immutable occurrence key. A move or spelling correction does not create an event identity. A different year does. Operators, attractions, venues and physical location versions remain separate. Every physical version has its address and reviewed point. Evidence IDs and assertion IDs are explicit stable review-ledger identifiers; changing evidence content under an existing ID is rejected on refresh.

Source/OSM/catalog crosswalks explicitly attach source-native records to an occurrence. Reviewed `same-event` or `alias-decision/same` relationships point **from an alias occurrence to the chosen canonical occurrence**. Directed cycles, incompatible year/season/attraction/operator/location, conflicting canonical choices, and direct/transitive do-not-merge conflicts fail. Related hosting, moving and prior-year links never merge anything. Two events can have identical addresses, categories and points. No proximity/name deduper is imported or invoked. The future runtime integration must preserve these identity decisions before calling any legacy Date Night dedupe function.

Field resolution either corroborates equal assertions or requires a reviewed decision accounting for **every** selected, conflicting and rejected assertion. Unresolved conflicts quarantine the event. Source maps retain every assertion/evidence/source reference, including rejected and conflicting facts; the full factual assertions remain in the ledger. A missing field or omitted record never deletes old evidence. An explicit immutable negative lifecycle row is needed to withdraw an event. Each lifecycle row names operator, venue, attraction or occurrence scope, its effective interval and supporting state assertion. Active assertions cannot override negative evidence. All negatives remain in tombstones even after their interval stops affecting publication. Reopening/correction of a permanent negative is intentionally a later reviewed contract decision, never inferred from absence.

## Eligibility and time

Publication requires reviewed identity/eligibility, explicit evidence for the occurrence season/year, nonhistorical evidence, required facts, and verified coordinates matching the physical location version. A footer year or a check timestamp is not season evidence. Calendar dates are local ISO dates with an IANA timezone; per-date hours carry an explicit next-day closing flag. Version 1 requires dates within the named year; cross-year festivals need separately reviewed yearly occurrences or a future contract revision. Overlapping negative lifecycle intervals conservatively quarantine the occurrence. An incomplete negative interval is open-ended. Calendar interval exclusions do not weaken negative protection.

Only verified coordinates are reusable; their location version, address fingerprint, source/evidence IDs, matching coordinate assertion, reviewer, verified time, uncertainty in meters and point meaning must agree. Candidate and unresolved points cannot appear in runtime facts. Old verified coordinates may be referenced by a new explicit current-season observation for the same physical location; this never refreshes old evidence by itself.

The occurrence `checkedAt` is the oldest selected observation check. The manifest's last-good check is the oldest published occurrence check. No wall clock is consulted. Failed refresh returns the verified previous snapshot without changing its timestamps or revision. Evidence, location, crosswalk, relationship and lifecycle rows are immutable by ID and retained across refresh. Bounds apply to retained history too: overflow is an explicit review error, never truncation. The 512 identity limit counts operators/venues/attractions, physical location versions, occurrences and crosswalk records, including quarantined/tombstone identities.

## Collector policy

Every source schema defaults `enabled` to false and rejects true. Even complete, unexpired permission evidence cannot enable collection in A1; `collectSource` always throws. Public reachability is not permission. The independent permission predicate requires affirmative robots, terms, reuse and permission reviews with evidence/reviewer/time, unexpired permission, and any required attribution/license.

URL validation accepts exact configured HTTPS hosts, default/explicit port 443, literal exact/prefix path rules with segment boundaries, and enumerated query values. Credentials, IP literals, normalization-ambiguous paths, encoded path delimiters, duplicate query keys and fragments fail. Prefixes are not arbitrary regex code. The pure DNS/peer hook rejects any nonpublic answer and requires the peer to match a vetted answer. IPv4-mapped IPv6 and all non-global IPv6 forms are conservatively denied, including public mapped addresses. Each redirect requires fresh URL plus DNS/socket validation; two redirects is the hard maximum. No DNS or socket code is implemented here.

Response policy caps headers, both wire and decompressed body (2 MiB), DOM nodes/depth, JSON-LD, requests and total deadline (10 seconds). The metadata allows only inert HTML/plain text/JSON-LD fact parsers. A later transport must enforce limits while streaming/decompressing and pin DNS answers per hop, not merely check after receiving data. This task supplies validation hooks, **not a tested live transport**. There is no JavaScript/browser/LLM extraction, remote parser/schema code, subresource fetch, access-control bypass, retry or paid fallback.

## Artifact and atomicity contract

`bundle.json` is the sole atomic consumption unit: manifest, runtime facts, field-source map, quarantine/exclusions, tombstones, complete retained review ledger and human-readable diff. `verifySnapshot` validates schemas, hashes, byte counts, revision, freshness/counts and reconstructs all materialized facts from the ledger before any write. `writeSnapshot` writes and fsyncs a unique temporary file then atomically renames it on the same filesystem. A schema/build/manifest failure leaves the existing bundle unchanged. Callers must not consume independently refreshed sidecars as a snapshot.

The files in `generated/` are review exports of the same synthetic bundle. Manifest artifact hashes cover canonical JSON **plus one LF** (including `diff.json`, a JSON string); `diff.txt` is the convenience text rendition. The bundle itself and manifest are not self-hashed. Content revision covers the canonical ledger and all materialized facts/provenance/exclusions/tombstones, excluding the previous-snapshot-dependent diff. Identical logical input has identical revision regardless of object/array order. Arrays in this contract are unordered collections, including calendar intervals/dates. No build timestamp changes the result.

## Next boundary

First independently verify the frozen A1 commit. Then create `feature/date-night-seasonal-source-pilot-1` from that exact verified implementation SHA. Review access/reuse/robots/terms and attribution for **one** narrowly scoped, operator-authorized source; unresolved or conflicting permission stays manual-only. Implement a bounded, DNS-pinned transport and inert parser with offline malicious-response fixtures before any specifically authorized live pilot. Do not activate directories, tourism sites or operator pages merely because they are public. Runtime/UI/radial-cache/provider integration, public geocoding and production promotion remain separate work.
