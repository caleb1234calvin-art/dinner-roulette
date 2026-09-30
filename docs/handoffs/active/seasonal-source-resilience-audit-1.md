# Pick For Us — Seasonal Discovery Source Resilience Audit 1

Repository: `caleb1234calvin-art/dinner-roulette`

Audit branch: `audit/seasonal-source-resilience-1`

Expected frozen production base:
`9337f6ede14b314f10d6b79720aef62ee94fad7d`

## Trigger

The production loading remediation is healthy, but the original Carthage seasonal coverage goal remains unmet.

Current production behavior for Carthage, Missouri, 50 miles, Haunted House + Corn Maze + Pumpkin Patch, Open Now OFF:

- live seasonal provider chain exhausts its bounded 20-second budget
- saved fallback returns two haunted-house entries
- Corn Maze and Pumpkin Patch have no returned matches
- UI correctly discloses that live map discovery is unavailable and coverage is saved-only/incomplete

The loading incident is fixed. This audit is about **source resilience and real seasonal coverage**, not loading deadlines.

## Nature of task

This is a READ-ONLY architecture/source/research audit.

DO NOT modify product code.
DO NOT add venues.
DO NOT change catalogs.
DO NOT add provider credentials.
DO NOT create paid accounts.
DO NOT scrape sources in violation of their terms.
DO NOT merge.
DO NOT deploy.
DO NOT change Vercel settings.
DO NOT run migrations.
DO NOT publish Android/Play artifacts.

Audit/report/evidence artifacts may be created on this dedicated branch.

## Mission

Design a defensible path from today's OSM/Overpass-centered seasonal discovery to resilient multi-source seasonal discovery.

The audit must determine:

1. What independent or complementary sources can reliably contribute haunted houses, corn mazes, pumpkin patches, seasonal farms and similar qualifying attractions?
2. Which sources provide APIs, feeds, structured pages, public datasets or legally/operationally reasonable discovery mechanisms?
3. Which sources are genuinely independent inventories versus mirrors/derivatives of the same underlying dataset?
4. What are the licensing, attribution, caching, redistribution, rate-limit, API-key, pricing and terms constraints?
5. Which sources have useful coverage in the United States, especially Missouri / four-state region?
6. How fresh is seasonal/lifecycle information?
7. How can source records be normalized into the existing Pick For Us venue/provenance model?
8. How should conflicting source claims be reconciled without silently inventing truth?
9. How should multi-source deduplication work?
10. What is the smallest viable architecture that materially improves real seasonal coverage without turning Pick For Us into a brittle web scraper?

## Mandatory starting verification

Before research:

- fetch fresh refs
- verify current main is `9337f6ede14b314f10d6b79720aef62ee94fad7d` or report movement
- verify this branch descends from that exact production baseline
- verify no executable changes exist on the audit branch
- verify clean checkout
- read current seasonal discovery, source disclosure, provider-chain, classification, dedupe, provenance and availability/lifecycle implementation
- read the original seasonal coverage audit/remediation/verification and the production loading incident/remediation reports relevant to source behavior

If branch ancestry is unexpected, stop.

## Current architecture baseline

Document precisely:

- current Overpass mirrors
- why mirrors are not independent inventories
- saved seasonal catalog role
- live/saved/merged/fallback source states
- seasonal classification
- provenance representation
- duplicate identity/category merge behavior
- availability/calendar provenance
- 20-second provider-chain budget
- 25-second client watchdog
- coverage disclosure

Do not recommend undoing the loading resilience work.

## Source candidate research

Research a broad but bounded set of source classes.

At minimum investigate:

### Mapping/place platforms
Examples to evaluate where legally/technically accessible:
- OpenStreetMap/Overpass baseline
- Google Places / Maps Platform
- Foursquare Places
- Yelp Fusion or current Yelp developer offerings
- TomTom Search
- HERE Places/Search
- Mapbox Search
- Geoapify / OpenTripMap / similar structured place APIs where relevant

### Event/activity platforms
Evaluate whether current developer/public access is suitable:
- Eventbrite
- Ticketmaster Discovery
- PredictHQ or comparable event datasets
- local tourism/event feeds where standardized access exists

### Seasonal-specialist directories
Research specialist inventories for:
- haunted attractions
- corn mazes
- pumpkin patches
- agritourism/farm attractions

Examples may include national/state haunted-house directories, corn-maze/pumpkin-patch directories, tourism/agritourism directories and state extension/tourism datasets.

Do not assume a directory is legally scrapable merely because its pages are public.

### Official/operator sources
Assess the role of:
- operator websites
- official social pages
- state/local tourism boards
- chambers/DMOs
- agricultural extension/agritourism programs

Determine whether these are appropriate as primary discovery sources, verification/enrichment sources, or manual curated evidence only.

## Required source scorecard

For each serious candidate source record:

- source name
- source class
- independent inventory? yes/no/partial
- relevant seasonal categories
- geographic coverage
- Carthage/Missouri evidence
- structured API/feed/search availability
- authentication/key requirements
- free tier/current pricing where publicly documented
- rate limits where documented
- licensing/attribution requirements
- caching/storage restrictions
- redistribution/display restrictions
- terms/scraping constraints
- coordinates/address quality
- category/taxonomy usefulness
- hours/calendar/event-date support
- permanent closure/lifecycle support
- source freshness
- expected recall
- expected precision
- operational reliability
- integration complexity
- provenance quality
- recommended role: primary / secondary / verification / curated-only / reject
- evidence URLs and checked date

Do not assign false numerical precision if evidence is qualitative. A descriptive scorecard is acceptable.

## Carthage reference challenge

Use the existing audit's defensible seasonal reference candidates and fresh public research as a **diagnostic challenge set**, not a catalog insertion list.

For Carthage 50-mile seasonal categories, determine which candidate sources can discover or substantiate qualifying attractions.

At minimum revisit independently supported leads from the earlier audit, including where current evidence still supports them:

- Myer's Inn Haunt
- The Werehouse
- Exeter Corn Maze
- Aurora Maize
- Pickin' Patch / relevant pumpkin-patch lead
- other previously documented qualifying regional attractions

Do not force unsupported or out-of-radius leads into the set.

For each source, report challenge-set hits/misses and whether the result came from:
- direct structured discovery
- category search
- event search
- operator verification
- generic web search only

Do not add these venues to production.

## Freshness/lifecycle design

Seasonal attractions require more than static place existence.

Design how a multi-source system should represent:

- venue exists
- activity offered
- current-season confirmed
- upcoming
- active
- closed now
- hours unknown
- schedule unconfirmed
- finished season
- explicitly not operating this season
- permanently closed/disused
- evidence checked date
- evidence expiry/revalidation date

Preserve the verified rule that explicit negative current-season lifecycle evidence outranks mere freshness expiry.

Identify which source classes are suitable for existence versus current-season confirmation.

## Provenance and conflict policy

Propose deterministic conflict rules.

Examples requiring explicit policy:

- OSM says place exists; operator says not operating this season
- generic places API says open; seasonal calendar says season ended
- event platform has dated event but place API lacks seasonal category
- two sources disagree on coordinates/name
- one source is stale
- saved curated evidence conflicts with live generic place data

Do not silently pick whichever source is most convenient.

Prefer explicit provenance and confidence/freshness semantics.

## Multi-source deduplication

Design identity resolution compatible with current architecture.

Consider:

- normalized name
- coordinates/distance
- address
- phone/domain/operator identifiers where legally available
- provider IDs as source-specific identifiers
- category evidence union
- hours/calendar conflict handling
- source provenance retention

Avoid merging nearby distinct attractions merely because names are similar.

Preserve the verified multi-category union behavior.

## Query orchestration

Design how multiple independent sources should be queried within current latency constraints.

Requirements:

- preserve 20-second server provider budget philosophy
- preserve 25-second client settlement guarantee
- do not simply run N slow sources sequentially
- consider parallel or staged querying
- define per-source deadlines
- allow partial success
- preserve honest source/coverage disclosure
- cancellation should propagate where supported
- one failed source must not block successful sources
- do not expose API secrets client-side

Recommend an orchestration model and timing budget.

## Cost analysis

Estimate realistic operating cost for:

- development/testing
- low usage
- moderate usage
- growth

Use current published pricing/free-tier evidence where available.

Do not invent prices.

Identify sources that are unsuitable because of cost, licensing or restrictive storage/display terms.

## Privacy/security

Evaluate:

- location data sent to providers
- whether precise coordinates are necessary
- server-side key protection
- query logging
- retention
- attribution
- terms compliance

Prefer coarse/minimal necessary provider requests where practical.

Do not recommend logging precise user coordinates in observability.

## Architecture options

Produce at least three viable designs, such as:

A. OSM + one independent commercial/general place source
B. OSM + event source + specialist/curated seasonal evidence
C. multi-source broker with staged parallel general + seasonal-specific sources

For each, explain:
- coverage gain
- freshness
- reliability
- cost
- licensing risk
- complexity
- latency
- provenance quality
- fit with current Pick For Us architecture

Then recommend a phased architecture, not merely a provider name.

## Proof-of-concept boundary

This audit may use temporary out-of-tree scripts/HTTP calls to public APIs/endpoints that require no new secret and permit such use.

Do not commit runtime integrations.

Do not create accounts or obtain keys.

For key-required providers, research documentation and public capability/pricing only.

Do not bypass rate limits, anti-bot systems, authentication or access controls.

## Required output

Produce:

`audit/seasonal-source-resilience-audit-1-2026-09-30.md`

and:

`audit/seasonal-source-resilience-audit-1-2026-09-30.json`

plus a clearly named evidence directory/archive as needed.

Report must include:

1. exact audited SHA/tree
2. current architecture baseline
3. source landscape
4. detailed source scorecard
5. independence/derivation analysis
6. Carthage challenge-set results
7. lifecycle/freshness design
8. provenance/conflict policy
9. dedupe design
10. orchestration/timing architecture
11. cost/licensing analysis
12. privacy/security analysis
13. three or more architecture options
14. recommended phased architecture
15. phase-1 implementation scope
16. sources explicitly rejected/deferred and why
17. test strategy
18. migration/deployment implications
19. limitations
20. final audit state

## Recommendation constraints

Do not recommend hard-coding only Carthage-area venues.

Do not recommend arbitrary broad web scraping as the primary architecture.

Do not treat four Overpass mirrors as source diversity.

Do not recommend weakening category/lifecycle/radius rules to inflate counts.

Do not recommend a provider without documenting licensing/cost/key constraints.

Do not assume a places API supplies current seasonal operation simply because it knows the venue exists.

## Final state

End with exactly one:

`SEASONAL SOURCE RESILIENCE AUDIT — NO CHANGE RECOMMENDED`

or

`SEASONAL SOURCE RESILIENCE AUDIT — PHASED INTEGRATION RECOMMENDED`

or

`SEASONAL SOURCE RESILIENCE AUDIT — BLOCKED BY SOURCE/LICENSING CONSTRAINTS`

Do not implement the integration in this task.

Stop after audit/report/evidence production.
