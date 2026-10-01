# Pick For Us — Seasonal Source Resilience Phase 0B — Permissioned Operator/DMO Pilot 1

Repository: `caleb1234calvin-art/dinner-roulette`
Branch: `audit/seasonal-source-resilience-1`

Frozen production baseline:
`9337f6ede14b314f10d6b79720aef62ee94fad7d`

Frozen research-branch baseline:
`82fd9b072f0aaf0b02f7e3019c2cef2fbe4b128b`

Frozen research-branch tree:
`224c35c03c3060d363a54edd9a1291cb0a37b7ec`

Source-resilience audit handoff:
`docs/handoffs/active/seasonal-source-resilience-audit-1.md`

Prior Overture pilot handoff:
`docs/handoffs/active/seasonal-source-resilience-phase-0-overture-pilot-1.md`

Prior Overture pilot final state:
`SEASONAL SOURCE PHASE 0 — OVERTURE NO-GO / DEFER`

## Purpose

Perform the next bounded **Phase 0 source-admission pilot** after Overture was deferred.

Evaluate whether Pick For Us can build a small, defensible **permissioned operator/DMO seasonal claim snapshot** that materially improves current-season activity/lifecycle coverage without scraping restricted sources, weakening classification rules, or changing production code.

This task is research and feasibility validation only.

It does NOT implement Phase 1.

It does NOT contact publishers/operators/DMOs unless explicit reusable permission is already publicly documented. If useful sources require direct permission, identify the exact outreach target and permission questions, but do not send messages or accept terms on the owner's behalf.

## Locked conclusions to preserve

The completed source-resilience audit established:

- four Overpass mirrors are transport redundancy over one OSM inventory, not independent inventory
- seasonal product truth requires more than static place existence
- useful seasonal directories often lack granted automated reuse; public visibility is not permission to scrape/cache
- official/operator sources and state/local tourism boards, chambers/DMOs and agritourism programs may be suitable for discovery, verification, enrichment or curated claims depending on actual rights
- explicit negative current-season evidence outranks generic place-open status and freshness expiry
- current name/proximity dedupe is insufficient for multi-provider inventory
- source provenance, lifecycle and rights must be first-class
- the verified 20-second server provider budget and independent 25-second client watchdog are invariants

The completed Overture pilot additionally established:

- Overture release 2026-09-23.1 yielded 98,078 geographically acquired regional Places rows
- all five core Carthage diagnostics were geographically retrieved as place candidates
- Overture alone produced zero current-season confirmations across every control
- filtered local activity queries were feasible, peaking at 14.47 ms in the local prototype
- Overture incremental inventory beyond OSM remains unproven because no complete geographic OSM comparator succeeded
- combined Overture/OSM ODbL treatment remains unresolved for the proposed merged-place database
- Overture therefore remains deferred; do not integrate it in this task
- Phase 1 remains unimplemented
- product/runtime files and frozen main remained unchanged

Do not reinterpret Overture NO-GO/DEFER as proof of zero value or zero incremental recall. It is simply not admitted.

## Evidence availability rule

The Overture worker produced uncommitted research artifacts:

- `seasonal-source-resilience-phase-0-overture-pilot-1-2026-09-30.md`
- `seasonal-source-resilience-phase-0-overture-pilot-1-2026-09-30.json`
- `seasonal-source-resilience-phase-0-overture-pilot-1-2026-09-30-evidence.zip`

If these artifacts are available in the worker workspace, read them in full and preserve them unchanged.

If they are absent, do not reconstruct them or claim to have reviewed unavailable evidence. Use the locked conclusions above plus repository-native handoffs.

The older source-resilience audit report/JSON/evidence were also reported as uncommitted. Apply the same rule.

## Hard prohibitions

DO NOT modify product/runtime code.
DO NOT add venues or catalog records.
DO NOT integrate a new provider.
DO NOT merge.
DO NOT deploy or redeploy.
DO NOT change Vercel settings.
DO NOT run migrations.
DO NOT sign or publish Android artifacts.
DO NOT upload to Google Play.
DO NOT create commercial provider accounts, keys or credentials.
DO NOT accept click-through terms on the owner's behalf.
DO NOT send outreach emails/forms/DMs or otherwise contact publishers/operators/DMOs in this task.
DO NOT bypass rate limits, authentication, anti-bot systems, robots restrictions or access controls.
DO NOT scrape restricted seasonal directories.
DO NOT copy reviews, photos, long descriptions or other content merely because a page is public.
DO NOT assume an RSS/iCal/JSON endpoint automatically grants caching/redistribution rights.
DO NOT assume factuality defeats contractual/database restrictions.
DO NOT hard-code the diagnostic reference set into production or a fake "feed."
DO NOT broaden radius, category or lifecycle rules to inflate coverage.
DO NOT weaken the verified 20-second server / 25-second client guarantees.
DO NOT reopen explicit negative seasonal evidence because a generic source says a place is open.
DO NOT revive Overture Phase 1 in this task.

Temporary out-of-tree research scripts and small permitted fixtures are allowed. Do not commit copied provider corpora or secrets.

## Starting-state gates

Before research:

1. Fetch fresh refs.
2. Verify `main` remains exactly `9337f6ede14b314f10d6b79720aef62ee94fad7d`. If main moved, report the new state and stop unless the movement is clearly documentation-only and the handoff still safely applies.
3. Verify `audit/seasonal-source-resilience-1` contains this handoff and descends from the frozen research baseline.
4. Verify the pre-handoff baseline is exactly `82fd9b072f0aaf0b02f7e3019c2cef2fbe4b128b` / tree `224c35c03c3060d363a54edd9a1291cb0a37b7ec`.
5. Verify branch-vs-main executable/config/dependency/catalog/workflow state remains unchanged except for repository-native handoff documentation.
6. Read IN FULL:
   - this handoff
   - `docs/handoffs/active/seasonal-source-resilience-audit-1.md`
   - `docs/handoffs/active/seasonal-source-resilience-phase-0-overture-pilot-1.md`
7. Read the current seasonal discovery/provider/provenance/dedupe implementation sufficiently to preserve its semantics, but do not modify it.
8. If prior uncommitted audit/Overture artifacts are available, read them in full.
9. Establish a clean checkout before creating new pilot artifacts.

If a required immutable gate cannot be established, end as PILOT BLOCKED rather than improvising around it.

## Core research question

Can Pick For Us obtain and maintain a small regional seasonal-claim snapshot from **official/operator/DMO sources with explicit reusable rights**, such that the snapshot:

- supplies current-season activity/year/lifecycle facts that generic place inventories do not
- is geographically useful beyond one hand-picked venue
- preserves source and rights provenance
- supports explicit negative/closure updates
- has manageable identity/dedupe burden
- can be refreshed sustainably
- can be served locally without weakening the 20s/25s architecture
- does not depend on unlicensed scraping or manual hard-coding disguised as a feed

## Source classes to investigate

Research geographically relevant official sources in these classes:

### A. Operator-published structured/public feeds

Examples:
- documented JSON/event APIs
- RSS/Atom
- iCalendar
- downloadable CSV/JSON
- structured syndication feeds
- public datasets with an explicit open/reuse license

A source qualifies for snapshot inclusion only if the actual terms/license clearly permit the intended retrieval, local storage/cache and display/redistribution of the fields being tested.

### B. Destination marketing organizations / tourism authorities

Evaluate:
- state tourism
- county/city tourism organizations
- chambers/DMOs
- convention/visitor bureaus
- official tourism event calendars
- official agritourism programs
- public government open-data portals

Prefer structured feeds/APIs/downloads where rights are explicit.

### C. Agricultural extension / agritourism programs

Evaluate official state/local programs for:
- farm attraction listings
- pumpkin/corn-maze/agritourism directories
- seasonal event calendars
- downloadable/open datasets

### D. Official operator pages as research corroboration

Operator pages may be checked manually after geographic discovery to evaluate seasonal truth, but unless reuse permission is explicit, their facts remain **research corroboration only**, not an admitted redistributable snapshot source.

Do not infer permission from visibility.

## Permission classification

For every serious source, assign one and only one rights state:

1. `explicitly_reusable`
   - actual license/terms/publication statement supports the tested retrieval, storage/cache and display/redistribution purpose
2. `research_only`
   - public facts can be inspected for evaluation, but reuse/storage/display rights for a production snapshot are not established
3. `permission_required`
   - source appears promising but requires affirmative operator/DMO authorization or contract
4. `prohibited_or_incompatible`
   - terms or technical restrictions make the proposed snapshot unsuitable
5. `unknown_fail_closed`
   - rights cannot be established

Record the exact evidence URL, checked date, relevant clause/text summary and what fields/purposes are actually permitted.

Do not upgrade `research_only`, `permission_required` or `unknown_fail_closed` to an admitted snapshot.

## Geographic methodology

Use the same bounded control family as the Overture pilot:

- Carthage, Missouri — 50-mile diagnostic
- Joplin
- Aurora
- Springfield
- rural Missouri control centered around Stockton or a clearly justified equivalent
- MO/KS/OK/AR border-region control centered around Seneca or a clearly justified equivalent

Selection must be geography/category first.

Do NOT begin from the known diagnostic venue names and search each one across tourism/operator sites as the primary discovery method.

For each source:
- start from official geographic/category/event indexes, feeds, search endpoints, downloadable datasets or browse structures
- retrieve/list relevant seasonal candidates for the control area
- only AFTER that compare against the diagnostic reference set
- record whether a hit was structured geographic discovery, category discovery, event discovery, manual browse discovery or post-retrieval operator corroboration

If a source has no geographic search but has a bounded official regional feed/list, document the selection basis.

## Diagnostic reference set

Use only after geographic retrieval.

Strong/current or existing-anchor diagnostics:
- Myer's Inn Haunt
- The Werehouse
- Exeter Corn Maze
- Aurora Maize at Adventure Farm
- Pickin' Patch Farm

Conditional/provisional:
- Myers Forest of Fears
- Wolfmans House of Screams
- Cadaver Zone Spookhouse

Negative/radius/category controls:
- Campbell's Maze Daze & Pumpkin Patch — outside Carthage 50 miles
- Rutledge-Wilson Farm Park — outside Carthage 50 miles
- Turtle Moon Labyrinth — nonqualifying corn-maze control and outside radius

Held-out 2026 operator-confirmed leads from the Overture research may be used as post-retrieval diagnostics where geographically eligible:
- Feemster's Corn Maze
- Hotel of Terror
- Dungeons of Doom

These are diagnostics, not insertion targets.

## Seasonal truth requirements

Keep three levels separate:

1. **place existence**
2. **activity claim**
3. **current-season/lifecycle claim**

A place listing or generic business-open status does not establish current-season operation.

A current-season claim should normally include enough evidence to determine at least:
- season year
- activity/category scope
- effective/open interval or explicit current-season statement
- source authority
- checked/modified/published timing where available

Explicit negative/closure evidence must remain first-class.

Examples:
- not operating this season
- permanently closed/disused
- event cancelled
- season ended
- activity unavailable while venue remains open

Expiry of a negative review does not manufacture a positive state.

## Measurements per control/source

Report, where applicable:

- source name/class
- geographic selection method
- independent inventory or derived/syndicated source family
- structured feed/API/download availability
- rights state
- authentication/account requirement
- rows/items retrieved or manually browsed
- exact-radius eligible candidates
- H/C/P activity candidates
- current-2026 confirmations
- explicit negative/closure/cancellation claims
- schedule/hour support
- diagnostic hits/misses after retrieval
- additional plausible leads
- new qualified current-season destinations
- duplicate/conflated/relocation cases
- source overlap/syndication
- coordinate/address quality
- stale/undated claims
- source freshness
- update/refresh method and cadence
- tombstone/deletion behavior
- payload size
- acquisition time
- local snapshot/index size and query latency if prototyped
- attribution/display obligations
- caching/storage/retention limits
- limitations

A successful-empty source is not an outage.
A source outage is not an empty inventory.
A research-only observation is not an admitted reusable claim.

## Coverage bar

Do not require one source to cover every seasonal venue.

The relevant question is whether the permissioned source class adds **meaningful seasonal truth** to the multi-source system.

However, do not declare success from one conveniently known operator.

A GO requires useful, non-contrived evidence across more than one geographic control or one regional source with demonstrably broader coverage.

Carthage must be measured, and held-out controls must be used.

## Source independence / syndication

Determine whether apparent multiple sources are actually the same upstream feed.

Record:
- publisher
- upstream/syndicated family where known
- item/source IDs
- canonical URLs
- modified timestamps
- attribution lineage

Do not count duplicated syndicated event entries as independent corroboration.

Unknown syndication stays unknown.

## Identity/dedupe pilot

Use actual retrieved records to test conservative identity handling.

At minimum cover:
- same venue across two official/DMO sources
- same operator with multiple attractions
- two nearby distinct attractions
- relocation/alias
- one venue with multiple seasonal categories
- event occurrence versus venue identity
- conflicting coordinates/addresses
- same domain at distinct sites
- source record deletion or renamed item

Name + proximity alone should create a review candidate, not automatic equality.

Retain source IDs and evidence separately.

After identity is verified, categories may be unioned without losing category-specific calendars or negatives.

Do not change production dedupe.

## Minimal claim/source-policy fixture

Produce an out-of-product schema/fixture proposal sufficient to represent at least:

### Source policy
- source/provider ID
- source class
- publisher/operator
- upstream family
- rights-policy ID/version
- allowed retrieval method
- allowed fields
- allowed storage/cache purpose
- allowed display/redistribution purpose
- attribution
- retention/expiry
- deletion/export obligations
- geographic entitlement
- refresh cadence
- cost/rate constraints

### Claim
- internal subject/venue/activity/event reference
- predicate
- value
- category scope
- positive/negative polarity
- source/provider record ID
- origin/syndicated-from ID where known
- authority class
- published/modified/observed/checked timestamps
- effective interval
- season year
- venue timezone
- revalidate-after
- rights-policy ID

### Decision
- selected claim IDs
- rejected/conflicting claims
- unresolved fields
- reason codes
- resolver version
- freshness state

Do not implement a production database migration.

## Snapshot prototype

If and only if at least one `explicitly_reusable` source yields useful records, build a small out-of-product regional claim snapshot/index.

Store only permitted fields.

Prefer normalized factual claims and source IDs over copied descriptive prose.

Measure:
- artifact size
- build/refresh time
- 50-mile radius query latency
- category filter latency
- deterministic ordering
- update replacement behavior
- tombstone/removal behavior
- rights-policy filtering
- partial-source availability behavior

Target local serving around <=250 ms.

Do not package the snapshot into the app.

If no source qualifies for reusable storage, do not fabricate a prototype; document the blocked rights gate instead.

## Orchestration compatibility

Preserve the existing contract:

SERVER TOTAL:
- 20,000 ms total provider-chain budget
- existing individual live-provider cap remains bounded
- no new source receives its own additive 20 seconds

FUTURE MULTI-SOURCE TARGET:
- admitted local snapshot target <=250 ms
- OSM/live lanes parallel or staged under one absolute deadline
- stop external work by roughly 19,000 ms
- reserve roughly 1,000 ms for bounded merge/serialization
- partial success is valid

CLIENT:
- independent 25,000 ms watchdog
- cancellation/abort propagation where supported
- settlement independent of transport honoring abort
- stale/late results cannot overwrite current state

This pilot does not modify or rerun the production request path unless read-only observation is specifically needed.

## Rights and privacy checks

For each candidate source determine:
- whether the intended facts may be cached/stored
- whether they may be redistributed/displayed
- required attribution
- retention limits
- deletion obligations
- whether publisher/operator branding is required
- whether coordinates or user location are sent upstream
- whether a server-side key would be required in a future phase
- whether terms prohibit combining with other datasets
- whether user-level query logging creates unnecessary precise-location retention

Prefer offline regional refresh over sending every user's precise coordinates to a publisher when practical.

Do not log precise user coordinates for this pilot.

## Permission-needed outreach packet

For promising `permission_required` sources, produce a **draft-only** outreach matrix.

Do not send it.

For each target include:
- organization/source
- public contact route
- exact data/feed desired
- intended use in Pick For Us
- storage/cache intent
- display/attribution intent
- refresh cadence
- whether redistribution/export is expected
- deletion/update handling
- concise permission questions that must be answered
- what evidence would convert the source to `explicitly_reusable`

Avoid collecting unnecessary personal contact data. Prefer role addresses/public contact pages over individual personal details.

## GO / NO-GO gates

Recommend **GO to Phase 1 for a permissioned operator/DMO claim snapshot** only if all applicable gates are supported:

1. At least one actual official/operator/DMO source path is proven reusable for the intended stored/displayed fields without inventing permission.
2. The admitted source set supplies meaningful current-season/lifecycle information that generic place existence sources do not.
3. Geographic/category discovery demonstrates useful coverage across more than a contrived known-name lookup, including Carthage and held-out controls where the source claims coverage.
4. The source set yields current-season activity/lifecycle claims with honest handling of unknowns and negatives.
5. Rights, attribution, storage, retention and deletion obligations are implementable and recorded at source-policy level.
6. Identity/dedupe burden is manageable with conservative review rules.
7. Refresh/update cadence is sustainable and source provenance is stable enough to audit.
8. A local snapshot design can fit the <=250 ms target and preserve the existing 20-second server / 25-second client guarantees.
9. The design does not rely on restricted scraping, publisher contact not yet granted, or hard-coded diagnostic insertion.

Recommend **NO-GO / DEFER** if:
- useful sources exist but reusable rights are not established
- coverage is too sparse/contrived
- lifecycle data is not materially better than current place inventory
- permission terms are incompatible
- identity/update burden is disproportionate
- only manual one-off research can produce results

Use **PILOT BLOCKED** only if the research itself cannot be performed due to immutable state/access/tooling failure.

A NO-GO is a successful result when evidence supports it.

## If GO

Do NOT implement Phase 1.

Recommend a separate Phase-1 architecture/implementation handoff specifying:
- exact admitted source(s)
- exact permitted fields
- source-policy records
- claim schema
- offline refresh pipeline
- snapshot format
- identity review path
- lifecycle precedence
- attribution surface
- 20s/25s timing integration
- testing and rollback boundaries

Overture remains separately deferred unless its own re-entry gates are later closed.

## If NO-GO / DEFER

Do not force an operator/DMO integration.

Recommend the next bounded task from evidence, which may be:
- owner-authorized outreach to the smallest high-value DMO/operator set
- one licensed commercial place API pilot
- one event API pilot
- Overture comparator/licensing closure work if now justified

Do not create paid accounts or credentials in the recommendation task.

## Required output

Produce:

`audit/seasonal-source-resilience-phase-0b-operator-dmo-pilot-1-2026-09-30.md`

and:

`audit/seasonal-source-resilience-phase-0b-operator-dmo-pilot-1-2026-09-30.json`

plus a bounded evidence directory/archive.

The Markdown report must include:

1. exact repository/main/branch identity
2. required-reading/evidence availability
3. prior Overture defer conclusions preserved
4. candidate source landscape
5. permission/rights classification
6. geographic control definitions
7. geographic/category discovery methodology
8. Carthage results
9. Joplin/Aurora/Springfield/rural/border control results
10. diagnostic post-retrieval matrix
11. current-season/lifecycle evidence
12. negative/closure handling
13. source independence/syndication analysis
14. false positives/unknowns/staleness
15. identity/dedupe cases
16. minimal source-policy/claim/decision schema
17. snapshot performance/footprint if rights permit a prototype
18. refresh/tombstone/deletion design
19. orchestration compatibility with 20s/25s invariants
20. privacy/security implications
21. outreach-needed matrix, if applicable
22. explicit GO/NO-GO gate table
23. recommended next bounded task
24. limitations
25. final state

Machine-readable JSON should mirror the decision-critical metrics and source rights states.

Evidence archive should contain only legally/permissibly retained material, derived measurements, small allowed fixtures, source metadata, request logs and hashes. Do not include copied restricted corpora, reviews, images, private contact data or secrets.

## Commit/push policy

This is a research pilot.

Do not modify product/runtime code.

The worker may leave research report/JSON/evidence uncommitted if the existing audit practice and workspace constraints make that safer.

If any research scripts or evidence are committed, they must:
- be clearly non-production
- contain no secrets
- contain no prohibited copied corpus
- not alter runtime/build/config/catalog behavior

Do not merge or deploy.

Report exact working-tree state and whether every artifact is committed or uncommitted.

## Final state

End with exactly one:

`SEASONAL SOURCE PHASE 0B — OPERATOR/DMO GO FOR PHASE 1`

or

`SEASONAL SOURCE PHASE 0B — OPERATOR/DMO NO-GO / DEFER`

or

`SEASONAL SOURCE PHASE 0B — PILOT BLOCKED`

Do not implement Phase 1.

Stop after pilot/evidence production.
