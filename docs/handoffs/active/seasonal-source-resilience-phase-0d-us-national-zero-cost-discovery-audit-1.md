# Pick For Us — Seasonal Source Resilience Phase 0D — U.S.-Wide Zero-Cost Discovery Architecture Audit 1

Repository: `caleb1234calvin-art/dinner-roulette`
Branch: `audit/seasonal-source-resilience-1`

Frozen production baseline:
`9337f6ede14b314f10d6b79720aef62ee94fad7d`

Frozen research baseline:
`11b1443b2432dc474146778aad20a9e46df70f42`

Frozen research tree:
`9057371f79fd205b639a55b384addcdd7c462750`

Required repository reading:
- `docs/handoffs/active/seasonal-source-resilience-audit-1.md`
- `docs/handoffs/active/seasonal-source-resilience-phase-0-overture-pilot-1.md`
- `docs/handoffs/active/seasonal-source-resilience-phase-0b-operator-dmo-pilot-1.md`
- `docs/handoffs/active/seasonal-source-resilience-phase-0c-permission-outreach-1.md`

Prior Phase-0C final state:
`SEASONAL SOURCE PHASE 0C — PARTIAL OUTREACH / OWNER ACTION REQUIRED`

## Product requirement pivot

Pick For Us is no longer a localized Missouri application.

The minimum target is now **countrywide United States discovery**. International discovery may be considered later, but is not required for this audit.

Local Missouri controls are retained only as validation fixtures.

The core product question is now:

> Given arbitrary coordinates anywhere in the United States, a radius, a date and a seasonal category, can Pick For Us discover a defensible candidate pool without already knowing venue names and without requiring per-location manual curation?

This Phase 0D audit replaces local permission outreach as the critical path.

The two prepared Phase-0C outreach packets for Visit Springfield and Exeter Corn Maze remain valid research artifacts, but DO NOT send them in this task. They are optional future enrichment work, not the nationwide discovery architecture.

## Hard engineering requirements

The architecture evaluated here must target all of the following:

1. **U.S.-wide applicability**
   - no Missouri-only assumptions
   - no per-city source onboarding as a prerequisite for basic discovery
   - no architecture that requires manually contacting individual venues to make a new region work

2. **$0 incremental operating cost**
   - no paid provider
   - no paid trial
   - no payment information
   - no usage-based billing
   - no paid license
   - no commercial contract required for the core architecture
   - no strategy whose practical operation depends on exceeding a free quota and then paying

3. **Lawful/authorized source use**
   - do not evade paywalls, quotas, authentication, anti-bot systems, API restrictions or licensing terms
   - do not treat public visibility as permission to scrape/cache/redistribute
   - do not use undocumented private endpoints merely to avoid a paid API
   - do not use a "free workaround" that is actually unauthorized access

4. **Honest uncertainty**
   - unknown is not closed
   - missing source result is not absence
   - generic business-open is not current seasonal operation
   - generic maze is not corn maze
   - pumpkins for sale are not automatically a pumpkin patch
   - ghost tours/races/theater are not haunted houses
   - explicit current-season negative evidence remains blocking until affirmatively revalidated

5. **Current latency invariants**
   - server/provider aggregate budget: 20,000 ms
   - existing individual attempt cap: 8,000 ms
   - client independent settlement watchdog: 25,000 ms
   - future external work should stop around 19,000 ms with bounded merge reserve
   - local/precomputed source lookup target roughly <=250 ms

6. **No product integration yet**
   - this task is architecture, source and feasibility research
   - do not wire any new provider into production
   - do not add venues
   - do not change catalog behavior

## Zero-cost definition

For Phase 0D, `$0` is a first-class design constraint.

It means the production architecture should be able to operate without new direct provider spend.

It may use:
- public open datasets
- openly licensed downloadable snapshots
- permissibly self-hosted indexes
- public government datasets
- OSM/Overpass within its terms
- Overture within its actual license obligations
- open web indexes where permitted
- public RSS/iCal/feeds where reuse rights permit the intended purpose
- user/operator-submitted data under explicit contribution terms
- free provider tiers only if their terms, quotas and long-term role are compatible with $0 operation

However, in THIS audit:
- do not create accounts
- do not create API keys or credentials
- do not accept terms on the owner's behalf
- do not start trials
- do not make purchases

Key-required/free-tier services may be researched from official documentation and classified as optional future experiments, but they cannot be the only evidence supporting the core no-cost architecture.

## Starting-state gates

Before research:

1. Fetch fresh refs.
2. Verify `origin/main` remains exactly `9337f6ede14b314f10d6b79720aef62ee94fad7d`, or report movement and stop if the frozen assumptions are invalid.
3. Verify the research branch contains this handoff and descends from `11b1443b2432dc474146778aad20a9e46df70f42`.
4. Verify the pre-handoff tree is exactly `9057371f79fd205b639a55b384addcdd7c462750`.
5. Verify branch-vs-main changes remain documentation/evidence only.
6. Read all required handoffs IN FULL.
7. If prior Phase-0/0B/0C uncommitted artifacts are available, read them in full and preserve them unchanged.
8. Establish a clean isolated checkout before creating Phase-0D artifacts.

If immutable state cannot be established, end:
`SEASONAL SOURCE PHASE 0D — AUDIT BLOCKED`

## Locked findings from earlier phases

Preserve:

### Current production
- four Overpass endpoints are transport redundancy over one OSM inventory
- saved fallback anchors provide honest partial coverage when live OSM fails
- product must not hide incomplete coverage
- no infinite loading; 20s server / 25s client guarantees remain locked

### Overture Phase 0
- release 2026-09-23.1 was successfully geographically extracted
- 98,078 regional Places rows were acquired in the bounded pilot
- all five core Missouri diagnostic destinations appeared in broad geographic retrieval
- Overture alone produced zero current-season confirmations
- filtered local snapshot queries were fast
- meaningful increment over complete OSM inventory was not established
- proposed OSM/Overture combined-database ODbL treatment remained unresolved
- Overture is DEFERRED, not rejected forever

### Operator/DMO Phase 0B
- useful 2026 seasonal facts exist in official/operator/DMO sources
- no useful acquired source cleared the intended production reuse-rights gate
- per-source permission does not scale as the nationwide discovery backbone
- those sources may remain valuable as verification/enrichment

### Permission Phase 0C
- two free permission messages were prepared but not sent
- no reusable rights were gained
- $0 spent
- do not send those messages in Phase 0D
- local permission outreach is no longer on the critical path

## Research mission

Design and empirically evaluate a **nationwide zero-cost seasonal discovery architecture**.

The target seasonal categories remain:
- H = haunted attraction / haunted house
- C = corn maze
- P = pumpkin patch

The worker must determine how to discover candidate locations across the United States before operator-specific verification.

The architecture should answer two separate problems:

### A. Candidate discovery
"Something relevant may exist here."

### B. Seasonal truth
"This specific activity is actually offered in the applicable season/year, with these lifecycle facts."

Do not require one source to solve both.

## Architecture directions to evaluate

At minimum evaluate the following families.

### 1. OSM / Overpass nationwide baseline

Measure:
- relevant tag/taxonomy patterns
- name/category/description signal
- coverage variability by region
- update/freshness behavior
- nationwide extract/self-host feasibility
- Overpass live-query limits versus offline planet/regional extract
- ODbL obligations
- attribution
- local index feasibility
- H/C/P precision/false-positive burden
- ability to discover without known names

Do not count mirrors as independent inventories.

### 2. Overture Places as a nationwide candidate substrate

Revisit Overture under the new product requirement.

Measure:
- current official release/schema/access
- nationwide or multi-region extract feasibility
- category/taxonomy/name usefulness for H/C/P
- source-family/lineage diversity
- independent candidates not found in OSM samples
- false positives
- record churn/identity implications
- snapshot size/update strategy
- license per source row where applicable
- ODbL interaction with OSM when the application presents a merged discovery result

Do not silently conflate OSM and Overture records before the licensing design is resolved.

A legally safe architecture may keep source partitions logically separate and merge only at response/claim-decision level if that treatment is supportable; investigate rather than assume.

### 3. Wikidata / Wikimedia structured data

Evaluate:
- nationwide place/entity usefulness
- seasonal attraction categories
- coordinates
- identity links
- website/operator identifiers
- licenses/attribution
- practical incremental recall

Treat this as likely enrichment unless evidence shows broader value.

### 4. Federal/state/local open datasets

Research whether nationwide discovery can be assembled from reusable public data families such as:
- USDA/local-food/agritourism datasets
- state departments of agriculture
- state tourism open-data portals
- state GIS/open-data catalogs
- municipal/county event/open-data feeds
- recreation/public-land datasets where relevant

The goal is NOT to manually integrate fifty states.

Determine whether:
- a common federal source exists
- discoverable state open-data APIs can be harvested through a standardized catalog protocol
- CKAN/Socrata/ArcGIS Hub or similar open-data platforms can be queried generically by metadata/category
- licensing can be represented source-by-source
- a registry/crawler could add compatible public datasets without custom product code for each state

Do not assume government publication is public domain or reusable; classify actual rights.

### 5. Open web index / structured-web discovery

Investigate lawful zero-cost approaches using:
- Common Crawl indexes/data
- openly licensed web indexes if available
- XML sitemaps
- schema.org / JSON-LD Event, Place, LocalBusiness or TouristAttraction markup
- public RSS/Atom/iCalendar feeds
- search-index metadata

Research whether these can provide a scalable **candidate-generation** layer.

Important:
- indexing a page does not grant permission to republish its protected content
- favor extracting minimal factual signals only where lawful
- separate discovery pointers/URLs from reusable product claims
- record robots/terms/licensing limits
- do not crawl or scrape sites in violation of restrictions
- do not bypass blocks

Evaluate whether a precomputed open-web candidate index can surface sites/pages likely to represent H/C/P attractions, which can then be corroborated through permitted sources.

### 6. Community / operator contribution

Evaluate a future zero-cost contribution layer:
- "Add a place"
- "Claim this venue"
- operator-maintained seasonal dates
- user correction/report flow
- provenance attached to submissions
- moderation/review
- abuse/spam controls
- season expiry
- explicit contributor license/terms

This does not replace automatic discovery, but may close long-tail gaps sustainably.

Do not implement it.

### 7. Free-tier APIs as optional accelerators

Research current official terms/pricing/capabilities for relevant nationwide:
- place APIs
- event APIs
- search APIs

Classify:
- truly free sustainable tier
- free but credential-required
- trial-only
- paid after tiny quota
- storage/display restricted
- incompatible

Do not create accounts or keys.

A credential-required free tier may be proposed as an OPTIONAL accelerator, but the core architecture should not collapse if it disappears or becomes paid.

## National control matrix

Use a deliberately broad fixed matrix before candidate discovery.

Use these 24 named controls, centered on a defensible public city/town center or other documented public coordinate.

### Northeast / Mid-Atlantic
1. Boston, Massachusetts
2. Portland, Maine
3. Pittsburgh, Pennsylvania
4. Richmond, Virginia

### Southeast
5. Charlotte, North Carolina
6. Atlanta, Georgia
7. Orlando, Florida
8. Nashville, Tennessee

### Midwest / Plains
9. Chicago, Illinois
10. Minneapolis, Minnesota
11. Kansas City, Missouri
12. Carthage, Missouri
13. Grand Island, Nebraska
14. Rapid City, South Dakota

### South / Texas / Border
15. Dallas, Texas
16. Houston, Texas
17. Texarkana, Texas/Arkansas
18. Seneca, Missouri — four-state border control

### Mountain / Southwest
19. Denver, Colorado
20. Albuquerque, New Mexico
21. Phoenix, Arizona
22. Boise, Idaho

### Pacific
23. Seattle, Washington
24. Sacramento, California

The worker may add no more than 6 additional controls only if needed to cover a clearly missing topology such as:
- extremely rural Mountain West
- Southern California
- Appalachian rural
- Gulf Coast
- Upper New England rural
- high-desert Southwest

Any additions must be declared and frozen BEFORE discovery begins for those controls.

Do not replace weak-performing controls with easier ones.

## Radius matrix

For every control:
- primary radius: 50 miles

For a stratified subset of at least 8 controls spanning regions and urbanicity:
- also test 10 miles
- also test 25 miles
- compare monotonicity and boundary behavior

Preserve the existing 0.05-mile product tolerance separately if relevant; do not silently inflate radii.

## Blind two-pass evaluation

The audit must avoid known-name cherry picking.

### Pass A — discovery

For each control/source family:
- query geographically/category-first
- do not use known venue names in the acquisition predicate
- freeze the candidate set and source evidence
- record counts before manual validation

### Pass B — independent diagnostic reference

Only AFTER the Pass-A candidate set is frozen:
- perform independent web/operator research for a bounded diagnostic reference set
- identify clearly current/relevant H/C/P attractions in that control
- compare Pass-A candidates against this reference set
- record hits/misses
- do not inject misses back into Pass A and pretend they were discovered

This reference is a diagnostic sample, not a claim of exhaustive ground truth.

For at least 8 controls, have a held-out evaluation where the diagnostic names are not consulted until all source-family candidate lists are finalized.

## Measurements per control and source family

Record:

### Discovery
- raw candidates
- H candidates
- C candidates
- P candidates
- unique candidate venues after conservative identity review
- candidates with coordinates
- candidates with address
- candidates with canonical website/operator URL
- candidate source family
- names/categories/tags that caused inclusion
- false positives
- ambiguous candidates
- duplicate/conflation candidates

### Reference comparison
- diagnostic reference count
- geographic discovery hits
- misses
- source family responsible for each hit
- unique contribution by source family
- candidate-only leads not in diagnostic reference
- whether lead later validates

### Seasonal truth
- current-season confirmed
- season year known
- date interval known
- category-specific hours known
- explicit negative/closure/cancellation evidence
- stale/undated
- source authority
- rights state for the claim

### Operations
- request/extract wall time
- bytes/rows processed where measurable
- local index size
- local query latency
- update/delta mechanism
- full refresh feasibility
- deterministic ordering
- failure semantics
- rate/quota constraints
- whether user coordinates would be sent upstream

### Rights
Classify each serious source:
- `explicitly_reusable`
- `research_only`
- `permission_required`
- `prohibited_or_incompatible`
- `unknown_fail_closed`

Record:
- license/terms evidence
- storage/cache rights
- redistribution/display rights
- attribution
- share-alike/copyleft
- database-right obligations
- mixing/combining constraints
- retention/deletion
- rate/automation rights

## Source-family independence

Do not count two transports or mirrors as two inventories.

Investigate upstream derivation.

Examples:
- an Overture row sourced from an upstream family that itself derives from OSM
- a DMO page copied from an operator page
- event aggregators syndicating the same origin
- multiple open-data portals exposing the same dataset

Retain:
- provider
- upstream family
- source record ID
- origin ID
- version/release
- rights policy

Unknown derivation remains unknown.

## Nationwide candidate-index feasibility

The audit should explicitly test whether a countrywide or partitioned local index can be built/updated at $0.

Evaluate designs such as:

### Design A — nationwide static/open snapshot
- periodic OSM extract
- periodic Overture extract
- source-partitioned records
- precomputed H/C/P candidate features
- local/server-side spatial index
- claim merge at query time

### Design B — tile/region partitioning
- U.S. partitioned into reproducible geographic tiles
- refresh only changed/relevant partitions
- lazy materialization if permissible
- bounded local query

### Design C — candidate catalog + verification queue
- broad open discovery substrate supplies place candidates
- a verification queue seeks current-season evidence from permitted official sources
- unresolved candidates remain discoverable only with honest uncertainty where product policy allows
- verified current claims override generic state
- negatives remain explicit

### Design D — open-web discovery index
- open web/common crawl/schema markup yields URL/entity candidates
- canonical venue identity resolved conservatively
- protected prose is not republished
- only lawful factual claims enter product layers

### Design E — hybrid
Combine the strongest elements.

For each design report:
- national coverage
- seasonal precision
- freshness
- legal/rights complexity
- storage
- refresh cost
- compute requirements
- latency
- implementation complexity
- failure isolation
- path to international later

## Storage/compute budget

This is $0 provider spend, not zero compute.

Measure realistic local/self-hosted requirements for:
- initial U.S. snapshot download/extract
- disk footprint
- normalized index footprint
- memory requirement
- update cadence
- bandwidth
- CPU time

Separate:
- developer workstation feasibility
- current hosted deployment feasibility
- future dedicated self-hosted/home-server feasibility

Do not assume Vercel can hold or serve a giant local dataset.

If a free architecture requires infrastructure larger than current hosting, document that honestly rather than calling it impossible.

## OSM + Overture licensing closure

Because nationwide use makes the issue central, Phase 0D must investigate the previous unresolved ODbL interaction more deeply.

Using current official license/documentation:

Determine possible architectures such as:
- separate source databases queried independently
- response-time federation without persisted merged database
- source-partitioned claim store
- merged derivative database
- collective database treatment if applicable
- ODbL-compliant publication/share-alike/data-offer path

Do NOT provide legal advice.

Produce an engineering decision matrix:
- architecture form
- likely obligations
- unresolved legal question
- implementation consequence
- whether counsel/authoritative license clarification would be needed before production

Do not evade ODbL by relabeling a merged database.

## Identity and dedupe at national scale

Propose conservative source-independent identity rules using:
- source namespace + ID
- normalized name
- address
- coordinates with uncertainty
- website/domain
- phone only where lawful
- operator/brand identity
- explicit cross-reference
- historical alias/location

Rules:
- name+proximity creates review candidate, not equality
- same domain may represent multiple sites
- same operator may run multiple attractions
- event occurrence is not venue
- categories union only after verified identity
- category-specific calendars remain separate
- relocation becomes history, not duplicate current venue
- source deletion is not permanent closure

Measure collision/review burden on national samples.

## Product-state model

Preserve distinction between:

### Venue existence
- known
- candidate
- disputed
- removed from one source

### Activity
- H/C/P supported
- category ambiguous
- unsupported

### Season/lifecycle
- current season confirmed
- upcoming
- active
- finished
- explicitly not operating this season
- temporarily closed
- cancelled occurrence
- permanently closed/disused
- stale
- schedule unknown

### Coverage
- complete not claimed
- source degraded
- saved/local fallback only
- candidate coverage incomplete

Do not make a source outage produce a lifecycle negative.

## Orchestration target

A future production design should aim for:

1. local/precomputed nationwide candidate lookup first, target <=250 ms
2. saved catalog/local claims available independently
3. bounded live OSM or other zero-cost enrichment lanes under shared server deadline
4. verification/enrichment that does not block basic candidate settlement
5. stop external work around 19 seconds
6. reserve bounded merge/serialization time
7. client settles by 25 seconds regardless of transport behavior

One source failing must not erase another source's valid results.

## Go / no-go decision

This is an architecture audit, not a requirement to force one source into production.

Recommend **GO TO NATIONAL PROTOTYPE** only if evidence supports a plausible $0 architecture that:

1. works from arbitrary U.S. coordinates rather than known names
2. demonstrates non-contrived candidate discovery across the national matrix
3. does not depend on local manual permissions for baseline discovery
4. has at least one lawful nationwide or composable open discovery substrate
5. has manageable false-positive/identity burden
6. has a credible path to current-season verification without pretending place existence equals seasonality
7. can preserve source/rights provenance
8. has a technically feasible local/indexed query path
9. can preserve 20s/25s guarantees
10. has a bounded, documented OSM/Overture licensing path or a viable architecture that avoids unresolved prohibited mixing
11. remains $0 in direct provider spend for the core path
12. does not rely on evading paid features or access controls

Recommend **DEFER / REDESIGN** if the evidence shows the national $0 architecture requires a different composition.

Use **AUDIT BLOCKED** only when the audit cannot actually be completed.

A negative result is acceptable.

## Required output

Produce:

`audit/seasonal-source-resilience-phase-0d-us-national-zero-cost-discovery-audit-1-2026-09-30.md`

and:

`audit/seasonal-source-resilience-phase-0d-us-national-zero-cost-discovery-audit-1-2026-09-30.json`

plus a bounded evidence directory/archive.

Markdown must include:

1. exact repository/main/branch identity
2. prior-phase evidence availability and integrity
3. countrywide/$0 requirements
4. source-family landscape
5. current rights/licensing scorecard
6. national control matrix and frozen coordinates
7. Pass-A discovery methodology
8. Pass-B diagnostic methodology
9. per-control metrics
10. per-source-family metrics
11. unique source contribution analysis
12. false-positive analysis
13. held-out diagnostic hit/miss analysis
14. H/C/P taxonomy findings
15. seasonal-truth capability
16. open-web/schema/index findings
17. open-government/catalog findings
18. optional free-tier API findings
19. national snapshot/index storage/compute measurements
20. local query benchmarks where practical
21. update/delta strategy
22. source independence/lineage
23. national identity/dedupe analysis
24. OSM/Overture licensing architecture matrix
25. provenance/claim-policy implications
26. orchestration/20s/25s fit
27. privacy/security
28. community/operator contribution role
29. at least four architecture designs plus recommended composition
30. explicit GO/DEFER/BLOCKED gate table
31. recommended next bounded prototype if GO
32. limitations
33. final repository/artifact state

JSON should contain machine-readable:
- controls
- source scorecards
- rights states
- discovery metrics
- diagnostic comparisons
- latency/storage metrics
- architecture candidates
- go/no-go gates
- unresolved questions

Evidence archive may contain:
- scripts
- derived metrics
- hashes
- small legally retained fixtures
- license/terms metadata
- request logs
- source IDs
- generated candidate summaries

Do not retain prohibited corpora, reviews, photos, copyrighted page dumps, secrets or personal data.

## Commit/push policy

This is a read-only product architecture/source audit.

Do not modify product/runtime code.
Do not add venues.
Do not change dependencies/config/build/workflows.
Do not merge.
Do not deploy.
Do not change Vercel.
Do not run migrations.
Do not publish Android/Play artifacts.
Do not send Phase-0C outreach.
Do not create accounts/keys/credentials.
Do not spend money.

Audit scripts/evidence may remain uncommitted/untracked.

If a small research script is committed, it must be clearly non-production and must not alter runtime behavior.

Report exact repository state.

## Final state

End with exactly one:

`SEASONAL SOURCE PHASE 0D — GO TO NATIONAL PROTOTYPE`

or

`SEASONAL SOURCE PHASE 0D — DEFER / REDESIGN`

or

`SEASONAL SOURCE PHASE 0D — AUDIT BLOCKED`

Do not implement the prototype in this task.

Stop after audit/report/evidence production.
