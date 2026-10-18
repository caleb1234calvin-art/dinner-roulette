# PR85 offline comparison: useful audit metadata, no demonstrated discovery lift

## Scope and verdict

Compared draft PR85 `3e51d7a51871e4e765548955e2d6afd2f4af449e` against main `c3208d9fdc9a21d698efa9254be1286f5d3d2836`, both freshly confirmed through GitHub on 2026-10-18. Relevant source files were independently retrieved at pinned commits, recovered byte-exact, and verified against Git blob IDs in source-manifest.json. The separate checkout is merely a work area: evidence/main is the authoritative pinned production snapshot, not the checkout's older HEAD.

**Keep this as an offline research/audit envelope, not a new discovery provider.** It introduces no query, fetch, additional provider, acquisition coverage, current-operation evidence, or demonstrated live recall. Its explicit active category classifier is a strict subset of the existing classifier on tested valid tags, including a crop-fallback discrepancy. The defensible incremental value is retaining selected incomplete/historical metadata as auditable, nonpublishable research leads before the application mapper would discard it, plus bounded validation and explicit source attribution. A row retained for research is not a newly discovered operating venue.

No venue/provider HTTP, source activation, runtime edits, registry changes, publication, merges, or deploys were performed. GitHub reads were only source retrieval. Tests are synthetic and offline.

## Existing production behavior

- query-plan.ts buildDateNightQuery emits a radius-capped (80,467 m) Overpass query, out center tags. seasonalQueryClauses already includes explicit haunted/corn/pumpkin tags, both maize/corn maze:type and crop selectors, and context-restricted name/description/seasonal:description/seasonal:activities predicates. Contexts include mazes, tourism attractions/theme parks/farms, parks and farm landuse. Lifecycle acquisition already includes disused/abandoned/was and demolished/removed/razed/destroyed families.
- provider-evidence.ts seasonalTypes already recognizes all PR85 active category forms and additional context-qualified prose, with negative/historical prose exclusions. A lone seasonal-looking name on an unrelated shop is insufficient. It tests maze:type OR crop independently.
- search.ts elementToPlace normalizes lifecycle keys before classifying; retains lifecycle-only category records; requires name and coordinates; rejects names containing closed. It preserves ID, coordinates, address, hours, website, phone, lifecycle and per-source discoveryEvidence. It does not assert 2026 verification.
- queryMirror merges same-name/rounded-coordinate records and invokes identity deduplication. This audit executes the exact mapper, not the full dedupe chain; identity comparison conclusions here about PR85 are limited to its own collision flags and inspection of the main call path.
- formatOsmAddress already handles addr:full, addr:place, town/village/hamlet, province/region and country. PR85's subset loses these inputs.
- Existing lifecycle vocabulary treats no/false/0 (case-insensitive) as false. PR85 flags any matching prefixed key, omits razed/destroyed, and has narrower bare-state recognition. These are divergent interpretations, not useful discovery expansion.

## Reproducible evidence

Run with Node 24: `node --test compare.test.mjs` from this directory. Result: 13 tests passed, 0 failed. fixture-results.json contains 18 concrete rows and both outputs; main-query.overpassql contains the exact emitted query, never executed. Source is transformed only by Node's TypeScript stripping and removal of imports/exports. The exact classify/elementToPlace function bodies are extracted from pinned search.ts. Unrelated chain-label/mood/retired-name helpers are stubbed; synthetic fixtures are away from the retired-name area and have no relevant brands. This is a focused behavior comparison, not a full app or live-provider test.

Observed cases:

1. Explicit haunt, corn and pumpkin tags classify identically. No added active category.
2. leisure=maze, maze:type=hedge, crop=corn: main recognizes corn; PR85 drops it because maze:type || crop masks crop.
3. tourism=farm plus positive pumpkin/corn description: main recognizes both; PR85 drops it. Both reject unrelated-shop prose and negative former-maze prose. Do not broaden name heuristics merely to improve a synthetic count.
4. disused:attraction=haunted_house: main already retains a disused record. PR85's benefit is distinct historicalCategoryHints and hold reasons, not new lifecycle discovery.
5. destroyed:attraction=haunted_house: main retains permanently-closed evidence; PR85 drops it. Active haunted_house + destroyed=yes is flagged by main but not PR85.
6. disused:attraction=no plus an active haunted_house: main correctly has no negative lifecycle; PR85 flags it.
7. Closed-name, missing-name and missing-coordinate rows: main drops; PR85 retains explicit-category rows in HOLD. This is genuine research-preservation value, not publishable completeness.
8. Latitude 100: mapper presently retains it; PR85 removes approximateLocation and flags missing location. This is an input-quality guard, not evidence that actual provider data contains such rows.
9. addr:full-only record: main preserves address; PR85 emits null.
10. disused:leisure=maze plus disused:crop=corn: PR85 retains a historical corn-maze hint while main cannot reconstruct the prefixed crop. This is historical audit value only. Prefix combinations may require separate integrity review before treating the hint as coherent evidence.
11. Main retains mapped hours/website; PR85 intentionally suppresses them. Suppression prevents treating tags as current operation or permission, but it is not greater raw metadata preservation.
12. Repeated OSM ID/name: PR85 preserves separate proposals with conflict/collision flags instead of resolving identity. Equal repeated rows are not necessarily contradictory; flag semantics should be described conservatively.
13. 101 elements: PR85 rejects as coverage-incomplete. The 100-row bound is not pagination, an acquisition cap, or a reason to claim improved discovery coverage.

## Smallest useful architecture

Prefer a bounded, stateless, offline-only research envelope around caller-supplied capture. Do not add a query, collector, provider, runtime import, persistent cache, or second discovery pipeline. Do not route an OSM proposal through PR84 triage in a way that overwrites source-specific reasons.

Minimum evidence contract to consider, independently of runtime:

- Capture identity: SHA-256 of the original supplied UTF-8 JSON bytes; clearly mark object-fixture input as canonicalized fixture content, not original capture bytes. Keep the input byte/element bounds. Hash is provenance, not truth or permission.
- Row identity: original elements index plus OSM type/id. Preserve index even when rows are filtered. Two occurrences of one ID remain separately inspectable.
- Small explicitly bounded raw tag whitelist, unchanged strings for allowed keys, in a separate evidence namespace. Include classification/lifecycle and useful address keys; omit unnecessary contact/website/hours fields unless justified. Reject oversize fields or explicitly report truncation; do not call normalized/truncated values raw.
- Separate normalized proposed fields from retained source metadata. Persist source-specific lifecycle/conflict/identity/missing-field concerns outside any generic triage result, and preserve all of them through serialization/review. Remain verified=false, publishable=false, year2026Verified=false, openNowEligible=false unconditionally.
- Keep categories intentionally explicit-only if avoiding dependencies; explain that they are narrower than existing provider classification. Fix the independent crop fallback. No new broad name heuristics.
- Align lifecycle false-value and terminal-prefix interpretation and address handling with existing pure helpers using focused parity-contract tests. A new TypeScript runtime loader just to import two helpers is disproportionate. A future deliberate pure shared-module extraction could remove duplication, but changes to production modules are outside this task.

Pure helper references (all pinned main):

- src/lib/date-night/lifecycle.ts: providerLifecycle(tags: Record<string,string>): DateNightLifecycle | undefined; normalizeLifecycleTags(rawTags: Record<string,string>): Record<string,string>. Only type import; no network or runtime initialization.
- src/lib/location/model.ts: formatOsmAddress(tags: Record<string,string>): string; isCoordinates(value: unknown): value is Coordinates. No imports or I/O.
- src/lib/date-night/provider-evidence.ts: seasonalTypes(tags: Record<string,string>): ConcreteDateNightType[]. Type import plus lifecycle exports; no I/O. Its broader context/prose behavior need not be imported into an intentionally explicit-only research envelope.
- Never import src/lib/date-night/search.ts into the adapter: it has server-framework/provider/catalog dependencies. Test extraction here is solely an offline comparison technique, not a recommended production packaging solution.

Implementation acceptance fixtures for the minimal envelope:

- String input and its whitespace-different equivalent have different original-byte hashes; row pointers are stable and point to original elements indexes.
- Object input provenance is explicitly fixture/canonicalized; malformed and oversized values fail closed.
- Closed/missing-name/location rows retain bounded evidence and source concerns without gaining eligibility.
- Destroyed/razed prefixed historic category and active plus terminal-state flags are retained as negative evidence; false no/false/0 lifecycle values are not promoted to negatives.
- crop independently supports corn classification; unrelated/negative prose stays excluded under explicit-only scope.
- addr:full and locality alternatives survive according to documented address policy.
- Duplicate rows preserve independent pointers; no accidental merge, publication, or inference of proven conflict.
- Downstream serialization or optional review preserves source-specific concerns and all false eligibility flags.

## Limits

No live venue count, event-date accuracy, geographic coverage, provider availability, legal/ODbL compliance determination, or user-facing recall lift was measured. No Overpass interpreter was used even for query validation. Proposals need independently authorized operator review and identity/freshness work. The original script's attribution label alone is not a complete public reuse assessment. The focused tests make no full-repository CI claim.
