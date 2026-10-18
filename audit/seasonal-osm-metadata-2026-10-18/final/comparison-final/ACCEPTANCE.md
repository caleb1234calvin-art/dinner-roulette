# Final offline benefit acceptance

Accepted for the narrow offline research scope on 2026-10-18, against the exact four-file SHA-256 manifest in four-file-sha256.txt. This is an independent working-tree review, not remote CI or production approval. No author files were edited. Original c3208d9 versus 3e51d7a comparison, source snapshots, fixtures and report remain unchanged in ../evidence.

## Verified outcome

- Independently reran 30 adapter tests: all passed. Four source-file hashes matched both before and after the run.
- Additional independent probes passed for exact supplied-byte hash sensitivity, stable canonical row hash across whitespace-only input changes, original row pointers, retained same-ID destroyed sibling metadata, JSON roundtrip, stateless mutation isolation, narrower explicit-only classifier, and missing-name/location HOLD with all eligibility flags false. See benefit-probes.mjs and benefit-probes.log.
- No provider query, HTTP client, cache, runtime import, runtime source edit or publication path was introduced. Adapter imports only node:crypto. The new test-only loader dependency is already present in the repository and loads actual pure lifecycle/address modules; it does not change runtime packaging.
- Original lifecycle/crop/address differences are corrected within the intended scope: destroyed/razed and false lifecycle values, independent crop fallback, historical prefix isolation, and address alternatives. Identical rows have duplicate rather than contradictory-record status. All rows remain independently traceable.
- The stateless audit benefit is concrete: capture hash with explicit basis, canonical full-original-record hash, original index/type/ID, bounded unmodified whitelisted rawTags, raw negative lifecycle tags, and source-row pointers survive ordinary JSON serialization. Negative sibling evidence is indexed before category filtering. Source capture still must be retained separately for complete inspection.
- README explicitly disclaims increased inventory, live coverage, freshness, verified operating dates/hours and production eligibility. No unsupported discovery gain was found. CI workflow pins and verifies candidate HEAD; this review did not execute remote CI.

## Exact parity expectations and limits

The test-only appModuleLoader executes src/lib/date-night/lifecycle.ts providerLifecycle and src/lib/location/model.ts formatOsmAddress. Lifecycle matrix covers seven existing prefixes, bare/attraction/leisure/unrelated suffixes, and positive plus no/false/0/empty values. It compares presence of negative concern, not identical lifecycle severity labels. The adapter intentionally also recognizes closed=yes/true as a research warning, beyond the helper's current vocabulary. Historical categories remain explicit-only and scoped by prefix; no context/name heuristic expansion occurred.

Address parity is checked for short ordinary addr:full, addr:place, village/town/hamlet, province/region, postcode/country and deduplicated parts. It is not universal byte equality: the adapter sanitizes controls/whitespace and caps display output, while rawTags preserve originals. This distinction is documented. The classifier remains narrower than main's context-qualified prose classifier by design.

No blocking assumption missing for the standalone offline envelope. Continuing boundaries:

- Hashes are fidelity handles, not proof of source provenance, time, authority, or actual current conditions.
- Conflicting/duplicate/name-collision triage remains inside this research result. Any future downstream triage integration must preserve those reasons and false eligibility flags, not overwrite them. There is no such integration here.
- Object fidelity validation is explicitly not a sandbox for hostile executable proxies and does not claim a pre-serialization CPU/memory budget.
- Raw lifecycle-prefixed keys are bounded by explicit length/count limits. Their presence is mapped evidence, not authority for closure or publication.
- ODbL/privacy review, operator verification and any live acquisition remain separate gates.

Reviewed adapter SHA-256: b1b856109a3b13df44f6f3a25a488b966cc9983acd4569d02f5043d07d4a809a.

## Final documentation-only rebind

During final manifest verification the README changed; the final text was reread and accepted. Its final SHA-256 is cc226aab30322be7ed0ad1ffe1e11bf58d05beec1dea62a1f41c71bda0ac0843. Adapter/test/workflow hashes remain unchanged from the independently executed tests. The final manifest now binds this clarified README; pre-doc-correction-sha256.txt preserves the prior set.

The clarification accurately states that lifecycle-prefixed raw tags may contain arbitrary suffixes such as destroyed:website and therefore contact information. Only ordinary unprefixed website/hours tags are suppressed. Private handling/privacy review is required before real captures or public raw-evidence export. This acceptance covers synthetic offline evidence only, with no new data read or transmission authority.
