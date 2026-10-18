# Phase 2 — Offline OSM metadata proposal adapter (2026-10-18)

**Scope:** Isolated nonproduction successor to frozen PR #84 commit `9eb1b85c503d900993e6ab0d0e5797fd7bcacfb4`. No new network access, operator-page crawling, schedule verification, runtime wiring or publication.

- `scripts/seasonal-osm-metadata.mjs`: consumes *supplied* Overpass element JSON and produces conservative unverified metadata leads only.
- `scripts/seasonal-osm-metadata.test.mjs`: synthetic fixture checks, with no API access.
- Dedicated offline GitHub Actions workflow checks tests and changed-file lint.

All proposals explicitly have `verified=false`, `publishable=false`, `openNowEligible=false`, `year2026Verified=false`, no dates or opening hours, and retained OSM object IDs and ODbL attribution. Coordinates describe mapped points/centers, never verified entrances. The adapter does not follow OSM website tags or import into Date Night.

**Limitations:** Discovery is limited to explicitly mapped seasonal attraction tags. No actual live network call is permitted in this phase. Existing app Overpass providers already supply some of this metadata; incremental coverage is unknown. True date/hour evidence, provenance conflict resolution, identity inventory refresh, durable negative lifecycle authority, complete ODbL/public attribution, privacy review, public-service rate limiting and exact live network acceptance remain future gates.

**Release boundaries:** PR #84 remains frozen draft. PR #82 conditional October 19 authority is separate. No merge, deploy, migration, app-store action or publication authorized. Evaluate CI against exact candidate commit before marking PASS. This phase is research-only and requires separate owner approval for any production promotion.

## Review hardening checkpoint

Additional offline guards now retain historical-only mapped attraction IDs as negative-lifecycle research leads (without positive category classification), enforce the JSON byte limit on directly supplied object fixtures, reject malformed tag value types, and flag contradictory rows sharing one OSM type/ID. Regression tests added. No external calls or runtime behavior changes. Exact-head CI remains mandatory; this work does not demonstrate expanded seasonal inventory.

## Independent review corrections and offline benefit

The initial exact-head baseline passed 11 adapter tests, but independent adversarial checks found four failures: a nonseasonal negative sibling sharing an OSM identity disappeared in either row order; historical prefixes could shadow one another; and unrelated historical prefixes could synthesize a category. The corrected adapter indexes all valid identities before filtering and classifies each historical scope separately. Subsequent probes also exposed lossy object serialization, missing destroyed/razed warnings, false-valued lifecycle tags, incomplete address fallbacks, and identical-record conflict/reason amplification. These initial failing results remain evidence, not superseded claims that the old head was safe.

The useful addition is an **offline audit envelope**, not a new discovery query or demonstrated increase in inventory. It retains held metadata with missing name/location and negative evidence, plus bounded capture/row provenance. Classification intentionally remains explicit-tag-only; the existing application also recognizes context-qualified prose. The explicit maze crop fallback is independent of the maze-type tag. Tests reuse the existing test-only loader for actual pure lifecycle and address helpers, without runtime wiring or a new dependency.

### Provenance and fidelity contract

- String input SHA-256 binds the exact supplied UTF-8 bytes, including whitespace. Object fixture SHA-256 binds a deterministic canonical JSON snapshot with sorted object keys. Neither proves who retrieved data or when; no retrieval freshness or source authority is asserted.
- Every original valid row has a zero-based element index, OSM type/ID, and SHA-256 of its canonical **unfiltered** original element. Record hashes are not hashes of a substring of the raw JSON text. Property order is immaterial; any retained or unretained value change changes that canonical record hash.
- `sourceRows.rawTags` preserves only whitelisted classification, name, address and lifecycle fields unchanged. Ordinary unprefixed website/hours/other tags are not copied into this evidence view; their values are still bound by the full original-element hash. Lifecycle-prefixed fields are retained under the same bounds, including arbitrary suffixes such as `destroyed:website`, so raw evidence remains untrusted and may contain contact information. Private handling and privacy review are required before real captures or public evidence export; current tests use synthetic data only. Display names/addresses are sanitized separately and must not be confused with raw tags.
- Negative evidence on any same-ID sibling remains available through exact original element indices, original lifecycle tags, and row hashes. These are mapped claims held for research, not authoritative closures or independent operator verification. Proposals reference source-row indices inside this result; the supplied capture must be retained separately for full inspection.
- Exact repeated records are labeled `duplicate-osm-record`; differing rows with the same OSM identity are `conflicting-osm-identity`. All rows stay separate. Possible name collisions remain conservative warnings, with unique reason entries.
- Inputs remain capped at 512,000 UTF-8 bytes and 100 elements; JSON nesting is capped at 64. Object fixtures reject undefined/functions/symbols, sparse arrays, accessors, cycles, nonfinite numbers and custom objects rather than silently serializing them away. This is a fidelity check, not a security sandbox for executable hostile objects.
- A raw evidence row permits at most 64 whitelisted tags, keys up to 160 UTF-8 bytes, values up to 4,096 UTF-8 bytes, and 16,384 UTF-8 bytes for the canonical whitelisted tag object. Overflow rejects the complete capture as coverage-incomplete with `evidence-tag-limit`; raw evidence is never silently truncated.

Current local correction validation: 30 adapter tests, including pure-helper parity and adversarial fidelity/provenance cases, plus changed-file lint and whitespace checks. These results do not replace exact-candidate remote CI. The isolated workflow explicitly checks out the candidate head, asserts its SHA, and records its tree. Dependency setup uses the existing lockfile with `--ignore-scripts`; no build or migration is invoked.

No source activation, live acquisition, runtime integration, durable cache, expanded coverage claim, or production eligibility follows from this work. PR #84 inventories are unchanged, including their original expiry; this adapter does not refresh or extend them. ODbL/privacy obligations and independent operator/date/hour evidence remain future gates.
