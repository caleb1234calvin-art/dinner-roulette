# Pick For Us — Seasonal Source Resilience Phase 0 — Overture Pilot 1

Repository: `caleb1234calvin-art/dinner-roulette`
Branch: `audit/seasonal-source-resilience-1`

Frozen production baseline:
`9337f6ede14b314f10d6b79720aef62ee94fad7d`

Source-resilience audit handoff:
`docs/handoffs/active/seasonal-source-resilience-audit-1.md`

Audit final state:
`SEASONAL SOURCE RESILIENCE AUDIT — PHASED INTEGRATION RECOMMENDED`

## Purpose

Perform **Phase 0 feasibility and rights validation**, centered on a bounded geographic Overture Maps Places pilot.

This task does NOT integrate Overture into Pick For Us.

It must answer whether an independent open-place snapshot is worth admitting into Phase 1.

## Audit conclusions to preserve

The completed source-resilience audit established:

- four Overpass endpoints provide transport redundancy over one OSM inventory, not independent inventory
- strong in-radius current-season diagnostic positives beyond the two saved fallback anchors include Exeter Corn Maze, Aurora Maize at Adventure Farm, and Pickin' Patch Farm
- no key-required commercial API demonstrated Carthage recall; do not choose/pay for one on assumed recall
- useful seasonal directories generally lack granted automated reuse; public visibility is not permission to scrape/cache
- current provenance is insufficient for multi-inventory conflict/rights handling
- current name/proximity dedupe is too weak for adjacent multi-provider attractions
- the verified 20-second server budget and 25-second client watchdog must remain invariant
- explicit negative seasonal evidence must not be reopened by generic positive place status or freshness expiry
- the recommended foundation is OSM + an empirically useful independent open-place snapshot + permissioned operator/DMO seasonal claims
- Overture metadata access was proven, but actual regional Places rows and Carthage recall were NOT tested

## Hard prohibitions

DO NOT modify product/runtime code.
DO NOT add venues or catalog records.
DO NOT merge.
DO NOT deploy.
DO NOT change Vercel settings.
DO NOT run migrations.
DO NOT create commercial API accounts/keys.
DO NOT scrape restricted seasonal directories.
DO NOT publish Android/Play artifacts.
DO NOT claim Overture improves coverage unless the geographic pilot proves it.

Audit/pilot scripts and evidence may be committed only if they are clearly non-production research tooling/data and contain no prohibited copied corpus or secrets.

## Starting gates

Before research:

1. Fetch fresh refs.
2. Verify main remains `9337f6ede14b314f10d6b79720aef62ee94fad7d` or report movement.
3. Verify branch ancestry.
4. Verify no executable product changes exist on this branch.
5. Read the source-resilience audit handoff and current seasonal/provider/provenance/dedupe implementation.
6. If the full source-resilience report/JSON/evidence is available in the workspace, read it in full and preserve it unchanged. If absent, do not reconstruct or invent its evidence; use this handoff's locked conclusions and report the limitation.
7. Verify clean checkout before creating pilot artifacts.

## Overture access/rights verification

Using current official Overture documentation and release metadata:

- identify exact current Places release
- identify documented public access path(s)
- identify constituent licenses/notices relevant to the extracted rows
- record attribution/redistribution/storage obligations
- record any explicit warning about combining Overture data with OSM/ODbL
- pin schema/release versions
- do not assume all rows share one license
- do not interpret open-data rights as proof of seasonal accuracy

No legal conclusion is required; document engineering launch gates and unresolved questions.

## Bounded geographic extract

Acquire/query only the bounded regional data needed for the pilot.

Do not download/process the whole planet if a spatially bounded method is available.

Pilot geographic controls must include:

- Carthage, Missouri — 50-mile seasonal diagnostic
- Joplin-area control
- Aurora-area control
- Springfield-area control
- at least one rural Missouri control
- at least one MO/KS/OK/AR border-region control

Use geographic/category retrieval. Do NOT search the dataset by the known venue names and present those lookups as discovery recall.

After geographic retrieval, compare retrieved candidates to the diagnostic reference set.

## Diagnostic reference set

Use as post-retrieval diagnostics, NOT insertion targets:

Strong/current or existing-anchor positives:
- Myer's Inn Haunt — existing saved anchor
- The Werehouse — existing saved anchor
- Exeter Corn Maze — strong in-radius C/P/H diagnostic
- Aurora Maize at Adventure Farm — strong in-radius C/H diagnostic
- Pickin' Patch Farm — strong secondary current-season C/P diagnostic

Conditional/provisional:
- Myers Forest of Fears — unresolved closure conflict
- Wolfmans House of Screams — provisional directory positive
- Cadaver Zone Spookhouse — unresolved

Negative controls:
- Campbell's Maze Daze & Pumpkin Patch — outside 50 miles
- Rutledge-Wilson Farm Park — outside 50 miles
- Turtle Moon Labyrinth — nonqualifying corn-maze control and outside radius

Do not convert conditional/provisional records into firm positives merely because Overture contains a similarly named place.

## Measurements

For each geographic control report:

- raw Overture Places rows retrieved
- rows inside exact product radius
- candidate rows after broad seasonal/place taxonomy screening
- qualifying seasonal candidates under strict evidence rules
- diagnostic strong-positive hits
- diagnostic misses
- additional plausible seasonal leads
- false positives / junk
- duplicate/conflated rows
- coordinate/address conflicts
- operating_status usefulness
- taxonomy usefulness
- source-family/lineage fields
- missing/truncated data
- release/schema anomalies
- query/extract time
- local index/query time if built
- extract size/storage footprint

Distinguish:
- place existence candidate
- seasonal activity evidence
- current-season evidence

An Overture place match alone is not current-season confirmation.

## Identity/dedupe feasibility

Test whether Overture's identifiers/source fields provide enough signal for conservative linking to current OSM/catalog records.

Use fixtures/cases covering:

- same venue across OSM/Overture
- nearby distinct attractions
- Inn vs Forest separate destinations
- Aurora/Verona relocation/alias case
- same brand/domain at different sites
- provider ID churn/source updates where documentation permits analysis
- coordinate uncertainty near radius boundary

Do not modify current production dedupe.

Produce a proposed linking rule and list cases requiring manual/unresolved state.

## Claim/provenance feasibility

Design a minimal source-policy and claim schema sufficient for Phase 1.

At minimum represent:

- provider
- provider version/release
- upstream family
- provider/source record ID
- origin claim ID / syndicated-from where known
- predicate/value/category scope
- positive/negative polarity
- authority class
- observed/checked/published/modified times
- effective interval
- season year
- revalidate-after
- rights-policy ID
- allowed storage/display purpose
- attribution
- selected/rejected/unresolved decision reason

Do not implement the production schema in this task.

Show how this model preserves:
- explicit negative precedence
- multi-category union
- current seasonal lifecycle states
- source-specific rights
- deterministic conflict resolution
- deletion/tombstone requirements

## Local snapshot feasibility

Prototype, out of the production path, a bounded regional snapshot/index if practical.

Measure:

- build/extract time
- artifact size
- query latency for 50-mile circles
- category-filter latency
- deterministic result ordering
- release/update process
- incremental replacement strategy
- stable identity implications

Do not wire it into the app.

Do not commit a large provider corpus unless license, repository size and task scope clearly justify it. Prefer derived metrics/small permitted fixtures and reproducible extraction instructions.

## Orchestration fit

Confirm a future snapshot can fit the audited architecture:

- local snapshot target roughly <=250 ms
- OSM remains within shared 20-second budget
- any future live independent lane shares the same absolute deadline
- external work stops by 19 seconds with merge reserve
- client watchdog remains 25 seconds
- partial success is valid
- one source outage cannot erase another source's valid results
- late-result suppression/cancellation remains intact

No runtime integration in Phase 0.

## Go/no-go gates

Recommend **GO to Phase 1 with Overture** only if all are supported:

1. Actual regional Places rows were successfully extracted/queryable.
2. Overture adds meaningful independent candidate coverage beyond OSM in more than a contrived name lookup.
3. At least some missing/diagnostic seasonal candidates or useful new leads are found geographically OR a broader held-out sample demonstrates meaningful incremental value.
4. False-positive/identity burden is manageable with conservative rules.
5. Storage/display/attribution rights are compatible with the proposed snapshot.
6. Local snapshot performance is compatible with the 20/25-second architecture.
7. Provenance/source lineage can be preserved.
8. No unacceptable ODbL/license-combination issue is left unbounded for the proposed implementation.

Recommend **NO-GO / DEFER Overture** if it adds negligible qualified value, rights are incompatible/unclear, identity quality is unacceptable, or extraction/serving cost is disproportionate.

A NO-GO is a successful Phase 0 result if evidence supports it.

## Commercial providers

Do not create credentials.

You may update documentation/terms observations if necessary, but do not select a commercial provider in this task.

If Overture is NO-GO, recommend the next pilot class based on evidence:
- permissioned operator/DMO snapshot
- one licensed commercial place API
- one event API

Do not claim recall for an untested key-required API.

## Required pilot output

Produce:

`audit/seasonal-source-resilience-phase-0-overture-pilot-1-2026-09-30.md`

and:

`audit/seasonal-source-resilience-phase-0-overture-pilot-1-2026-09-30.json`

plus a bounded evidence directory/archive.

Include:

1. exact repository/base identity
2. source-resilience audit inputs/limitations
3. Overture release/access/license findings
4. extraction method
5. geographic control definitions
6. Carthage results
7. other control results
8. diagnostic hit/miss matrix
9. additional leads
10. false-positive/quality analysis
11. identity/dedupe feasibility
12. claim/provenance schema proposal
13. snapshot performance/storage results
14. orchestration compatibility
15. rights/attribution gates
16. operational/update design
17. explicit GO/NO-GO criteria results
18. recommended Phase 1 scope or next alternative
19. limitations
20. final state

## Final state

End with exactly one:

`SEASONAL SOURCE PHASE 0 — OVERTURE GO FOR PHASE 1`

or

`SEASONAL SOURCE PHASE 0 — OVERTURE NO-GO / DEFER`

or

`SEASONAL SOURCE PHASE 0 — PILOT BLOCKED`

Do not implement Phase 1.

Stop after pilot/evidence production.
