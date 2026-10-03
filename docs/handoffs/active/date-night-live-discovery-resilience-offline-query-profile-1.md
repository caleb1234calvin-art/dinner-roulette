# Pick For Us — Date Night Live Discovery Resilience — Offline Query Profile 1

Repository: `caleb1234calvin-art/dinner-roulette`

Instruction branch:
`handoff/date-night-live-discovery-resilience-offline-query-profile-1`

Starting checkpoint:
`d9cc8bdde2e531af6f029d3d558d25f4f7bb4ab5`

Starting tree:
`f9f46d16c876b4d608ab836d57a411a607e6f8fa`

Starting sole parent:
`8e67d959f5b19cb00c22533a6eb27a1b2e1bfb2f`

Frozen production main:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Prior diagnosis authority:
`docs/handoffs/active/date-night-live-discovery-resilience-50-mile-timeout-diagnosis-1.md`

Prior diagnosis result:
`DATE NIGHT LIVE DISCOVERY 50-MILE TIMEOUT DIAGNOSIS — AMBIGUOUS; REVIEW REQUIRED`

Current preserved state:
- 686 JavaScript passes; 4 inherited skips; 0 failures
- compiled TanStack security 14/14
- lifecycle parity 154 audit cases / 111 authoritative negatives / zero gaps
- V-DR-02 preserved; cache byte-identical
- controlled browser 4/4 GREEN
- 15-mile live acquisition succeeds
- two independent 50-mile attempts on the exact same Preview failed all four groups
- no concrete radius-specific runtime defect established
- no successful immutable candidate exists
- no promotion is authorized

---

## Mission

Perform a bounded OFFLINE profiling investigation to attribute the remaining 50-mile cost before authorizing another implementation change.

The goal is to measure, on a known Overpass engine version and known data snapshot or locally reproducible representative dataset, where work grows from ~15 miles to ~50 miles.

This task must distinguish, as far as practicable:

1. global tag-posting enumeration cost
2. spatial range / geometry cost
3. carrier intermediate-set growth
4. named-set lifecycle filter cost
5. seasonal-context cost
6. positive category acquisition cost
7. duplicate selector/acquisition cost within a group
8. duplicated lifecycle acquisition across groups
9. provider-independent local engine execution cost
10. costs that remain unmeasurable without public-provider internals

Do not begin by editing application runtime code.

---

## Hard prohibitions

DO NOT:

- hit public Overpass mirrors
- run live Preview acquisition
- edit runtime source
- change tests to weaken assertions
- change provider list
- change hedge schedule
- change 8s / 20s / 25s deadlines
- change cache behavior
- change positive category semantics
- change package/lockfile
- change Vercel configuration
- run migrations
- merge
- update main
- deploy production
- freeze a candidate
- promote anything

This is offline profiling and diagnosis only.

---

## Required reading

Read IN FULL:

1. `docs/handoffs/active/date-night-live-discovery-resilience-50-mile-timeout-diagnosis-1.md`
2. the matching diagnosis MD/JSON if available locally or from retained task evidence
3. `docs/handoffs/active/date-night-live-discovery-resilience-live-timeout-remediation-1.md`
4. its continuation and final MD/JSON
5. prior live-timeout diagnosis report
6. current `src/lib/date-night/lifecycle.ts`
7. current `src/lib/date-night/query-plan.ts`
8. current `src/lib/date-night/provider-evidence.ts`
9. current `src/lib/discovery/hedged-provider.ts`
10. current parity/query/cost tests
11. top `AI_CONTINUITY.md`
12. pinned Overpass source at:
    `drolbr/Overpass-API@a0db4f392f744d5e1304331edbf542ef6d6ce2fa`

Treat prior conclusions as hypotheses to measure, not truths to assume.

---

## Phase 1 — integrity and environment record

Verify:

- starting SHA/tree/sole parent exactly
- starting branch ancestry linear
- main remains frozen or report movement
- production remains exact frozen main or report movement
- checkout/worktree clean
- cache byte-identical
- no executable changes after the validated Preview executable
- no public provider traffic occurs during this task

Record:

- OS/runtime/toolchain
- Overpass source commit/version
- whether a local Overpass binary is built from source or preexisting
- exact data snapshot identity
- data source/provenance
- snapshot date if known
- geographic bounds
- database/import method
- any synthetic fixtures used
- all limitations of representativeness

If no representative local data can be obtained without public-provider querying, use a clearly labeled synthetic/fixture dataset for mechanism profiling and STOP short of claiming real-world timing magnitude.

---

## Phase 2 — establish a known local engine/data profile

Preferred order:

1. use an existing local Overpass database/snapshot if one already exists and its provenance is known
2. otherwise build/import a bounded representative OSM extract suitable for offline profiling
3. if neither is feasible, use a synthetic indexed dataset that exercises the same engine paths and report that limitation

Do not fetch from public Overpass APIs.

Downloading a static public OSM extract is permitted if necessary and if the source, checksum/identity and bounds are recorded. Do not treat such an extract as identical to current public mirror data.

Use the pinned Overpass engine commit where practical.

---

## Phase 3 — baseline query set

Generate the exact current application query shapes at the retained test center for:

- 15-mile Anything
- 50-mile Anything

For each of the four groups:

- seasonal
- entertainment
- culture
- outdoor

Preserve exact generated QL and SHA-256.

Also generate comparison query shapes for:

A. historically accepted remediation-1 design
B. parity design before exact-value optimization
C. current exact-value design

Do not change application source to generate these; use historical refs/checkouts or standalone read-only scripts.

---

## Phase 4 — stage-by-stage profiling

Profile each current group at both radii.

Where the engine/tooling permits, capture:

- wall time
- CPU time
- rows/postings examined
- key/value index ranges touched
- spatial index intervals/cells/buckets
- raw carrier element count
- deduped carrier element count
- bytes/elements materialized
- lifecycle predicate input count
- lifecycle predicate output count
- seasonal-context count
- positive-query candidate count
- final returned element count
- geometry/member expansion cost
- tag-filter cost
- memory/high-water mark
- timeout/abort state

If the engine does not expose a metric directly, do not invent it. State the nearest measurable proxy.

Run repeated local trials after warmup and report distribution, not only one timing:
- minimum
- median
- p95 or maximum where sample size supports it

Keep runs bounded.

---

## Phase 5 — selector-family isolation

Measure selector families independently where practical.

At minimum isolate:

### Active equality carrier
The 23 finite exact key/value selectors.

Measure:
- total postings/candidates
- 15 vs 50 radius effect
- dominant keys/values
- whether park/farmland/farmyard contexts dominate

### Prefixed lifecycle carrier
The 28 exact-key + regex-value selectors.

Measure:
- postings/candidates per prefixed key
- whether global key-range enumeration dominates
- whether value regex cost is material
- radius sensitivity after tag filtering

### Named lifecycle predicates
The two predicates over `.lifecycle_context`.

Measure:
- input set size
- output set size
- filter cost
- permanent vs inactive family contribution

### Seasonal context
Measure the eight seasonal-context selectors and prose filters separately.

### Positive activity selectors
Measure ordinary and seasonal positive clauses independently.

---

## Phase 6 — duplicate work profile

Quantify current duplication without changing behavior.

Current hypotheses to measure:

- lifecycle carrier repeats identically across four groups
- seasonal context duplicates eight active carrier acquisitions
- ordinary positive clauses duplicate additional carrier selectors
- known within-query duplicate acquisition count is 17 across the four current group queries

For each duplicate class, report:

- exact duplicate statements
- per-radius candidate overlap
- estimated/measured repeated wall/CPU cost
- whether the engine caches/reuses any result internally
- whether removing duplication could preserve group independence
- whether cross-group reuse would create a common failure prerequisite

Do not implement reuse here.

---

## Phase 7 — controlled local counterfactuals

Create OFFLINE-only experimental query variants outside application source to test hypotheses.

Permitted variants include:

1. current query unchanged
2. current minus within-group exact duplicate acquisitions where semantics can be reconstructed offline
3. current active carrier only
4. current prefixed lifecycle carrier only
5. current without lifecycle predicates
6. current without seasonal context
7. historically accepted query shape

These are diagnostic experiments only.

For each variant:
- preserve QL
- describe semantic differences
- never confuse a faster semantically weaker query with an acceptable production fix
- measure both radii

---

## Phase 8 — causal decision

Choose one outcome:

### A. Measured concrete dominant cost mechanism
Use only if a specific selector family, duplicate-work class, or stage accounts for a material share of the 50-mile local cost and has a plausible semantics-preserving remediation.

Report:
- exact measured mechanism
- magnitude
- why it scales with radius
- narrowest remediation target
- invariants that remediation must preserve

### B. No dominant application-query mechanism found locally
Use if local engine/data shows acceptable current query scaling and no specific application-side mechanism explains the live failures.

Report that provider/network/remote database conditions remain the leading unresolved class, without claiming they are proven.

### C. Local profiling inconclusive
Use if the available dataset/engine/profiling tools cannot meaningfully reproduce the relevant cost.

Do not force a code-change recommendation.

---

## Phase 9 — no implementation in this task

Even if a concrete mechanism is measured:

DO NOT edit production runtime here.

Instead produce a narrow follow-on remediation recommendation.

If no concrete mechanism is found:
- do not authorize another public-provider canary automatically
- return for review

---

## Parallel-agent operating model

Recommended:

Astra:
- orchestration
- environment provenance
- local engine/data preparation
- profiling plan/integration
- evidence synthesis

Codex:
- source-level Overpass instrumentation
- query decomposition
- profiler scripts
- offline counterfactual queries
- stage-level metrics

Rules:
- no runtime application edits
- no recursive delegation of the full task
- bounded child tasks only
- children may not spawn further agents
- no shared mutable implementation branch
- all diagnostic code stays outside application runtime or in clearly separate evidence tooling if explicitly committed later

---

## Evidence

Prefer separate local artifacts first.

Suggested report names:

- `date-night-offline-query-profile-1-2026-10-03.md`
- `date-night-offline-query-profile-1-2026-10-03.json`
- `date-night-offline-query-profile-1-evidence/`

Record:

- environment provenance
- data snapshot identity
- exact engine commit
- exact query hashes
- raw profiler outputs
- per-selector/stage tables
- warmup/sample counts
- 15 vs 50 comparisons
- counterfactuals
- limitations
- zero public-provider request accounting
- final diagnosis state
- recommended next action

Do not upload to Library unless explicitly authorized by the user.

---

## Final verdict

End with exactly one:

`DATE NIGHT LIVE DISCOVERY OFFLINE QUERY PROFILE — CONCRETE APPLICATION COST MECHANISM MEASURED`

or

`DATE NIGHT LIVE DISCOVERY OFFLINE QUERY PROFILE — NO DOMINANT APPLICATION COST MECHANISM FOUND`

or

`DATE NIGHT LIVE DISCOVERY OFFLINE QUERY PROFILE — INCONCLUSIVE; REVIEW REQUIRED`

---

## Final report

Report:

1. starting identity and preservation
2. engine/data provenance
3. exact query set profiled
4. 15 vs 50 stage-level measurements
5. dominant selector families
6. duplicate-work measurements
7. counterfactual results
8. whether a concrete semantics-preserving remediation target exists
9. exact public-provider request count (must be zero)
10. final verdict
11. exact next action

Stop after profiling.
