# Unchanged Seasonal Fact Contract v1 compatibility

Design review only. No schema, policy, builder, source definition, fixture, runtime file or collector changed.

## Exact multi-source failure

The county observation can honestly retain `seasonEvidence={season:null,year:null,basis:"absent"}` and `verification="historical/unconfirmed"`. A future distinct B observation could have explicit 2026 corn-maze dates and its own canonical URL, contentHash, checkedAt, sourceId and grant. For each resolved field, builder.ts derives selected observation IDs from selected assertions. The `selectedObs.every(explicit)` gate then rejects A even when only A's name/address/phone is selected and B supplies calendar/season.

This is a semantic barrier, not just a missing calendar value. Existing resolutions account for selected/conflicting/rejected assertions and preserve field-source maps; they do not derive an observation's season. Existing crosswalks attach source-native IDs to occurrences and check event membership; they do not grant current-season support to another source. Existing relationship kinds model occurrence identity/hosting/movement, not factual derivations. `reason="corroborated"` is not an evidence-role exception.

Do not hide the county URL behind B, collapse the sources/hashes/check times, or clone the county observation into a fake current-season manual observation. Deriving country or timezone also needs its own transformation lineage. The strict source metadata assertions must match their own observation. Unchanged v1 cannot explicitly retain the needed per-field/per-component multi-source derivation dependencies as data.

A limited alternative can fit v1 only if a genuinely authorized B independently publishes/attests all required current facts (and supports verified coordinate reuse). A may then remain as unselected historical evidence with explicit resolutions accounting for its assertions. That does not solve the requested A-selected/B-season-only case, and no such B exists in this review. A coordinate evidenceId reference alone cannot license or validate A's address/calendar facts. Do not treat this alternative as demonstrated compatibility.

## Narrow future design path, conditional on facts and rights

Propose a separately versioned, strictly opted-in evidence/derivation representation. Preserve unchanged v1 behavior for existing inputs. Requirements, not an implemented schema:

- Immutable publisher observations distinguish static identity evidence from current occurrence evidence. A retains absent year/season; B retains its explicit season basis. Scope attaches static observations to reviewed entity/location versions, not a fabricated occurrence year.
- A separate reviewed occurrence-support record names the exact current B evidence/assertions, attraction, location version, target season/year and permission review. It cannot infer a year from retrieval/footer/metadata or from a mere shared address.
- Derived field selections enumerate all upstream assertion/evidence IDs and exact transformation version. Composed addresses name which components were received and which were jurisdictionally derived; timezone has its own derivation. Preserve every source's URL/hash/check/fetch times and rights independently.
- Static selection may support only approved static fields with an explicit, reviewed current applicability link. Calendar, hours, season, active status and current verification must come from eligible current evidence. Never allow static CornMaze="Yes" alone to establish that the maze operates this year.
- Validate dependency scope, source permission, missing IDs, cycles and entity/location mismatch before publication. Never make generic permission-approved booleans a substitute for evidence. All inherited negative lifecycle barriers, conflicts, rejected assertions, tombstones and immutable history survive.
- Keep immutable identity and location version checks. A movement, closed status or conflicting operator cannot be overridden by a current marketing page. Verified point still requires actual reviewed method, known point meaning and evidence-backed uncertainty.
- Freshness must not make A appear newly checked by B. Keep field-specific observation times. If aggregate occurrence freshness remains one timestamp, use a documented conservative rule covering every selected evidence dependency; do not substitute B's newer time for A.
- Preserve existing caps and last-good behavior. Bounds cover retained derivations and dependency graphs as well as observations. Overflow fails review rather than trimming provenance. Unknown source roles or versions fail closed.

This could express honest A+B support, but requires separate contract-design authorization, independent verification, and adequate real evidence first. It is not authorization to remove `selectedObs.every(explicit)` globally.

## Calendar and other required facts

The schema requires calendar, timezone, complete address, verified coordinates, name, activity, season and verification. Reviewed operator/venue/attraction identities and location version are also mandatory. Calendar must have explicit dates or bounded intervals; hours are optional, but any provided hours must match included dates and valid same-day or explicitly next-day semantics. The year of every date/exclusion/interval endpoint must match the occurrence year. A weekly schedule needs explicit applicability endpoints before expansion; ambiguous openings and overnight closures require review. No observed permission-qualified calendar meets these requirements here.

Source A name/address/category do not satisfy operator identity, point meaning or uncertainty. US and America/New_York are supportable reviewed constants but cannot be represented as county-published fields. Public Query service availability is not source activation permission. All blockers remain independent.

## Remediation preservation

The remediation strengthened exact own-key response metrics, safe nonnegative integer validation and dense redirect arrays. New ordinary-JSON design must preserve those protections and the unchanged nine-field v1 envelope. No missing measurements default to zero, no inherited metric is accepted, and no sparse redirect is skipped. The present offline collector always throws regardless of permissions. Read-only code inspection establishes these statements; no implementation suite or build was run for this documentation task.
