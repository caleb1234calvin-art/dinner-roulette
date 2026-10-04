# Pick For Us — Seasonal Web Enrichment + Radial Speed Design #1

Repository:
`caleb1234calvin-art/dinner-roulette`

Instruction branch:
`handoff/date-night-seasonal-web-enrichment-radial-speed-design-1`

Starting base:
`908510ac25fe5c24335126a0f34ff42fe4d80632`

Starting tree:
`3211b4df4eccb638a8c492da047eac3b24abb600`

Current release state:
- Radial Loading candidate independently verified and promotion-reviewed
- exact candidate remains frozen
- this design task MUST NOT modify or supersede that candidate

Required future implementation branches should be created separately after design approval.

---

## Mission

Design the next Date Night discovery iteration around two independent but complementary goals:

1. **Seasonal Web Enrichment**
   - fill source-coverage gaps for haunted houses, corn mazes, pumpkin patches, and similar temporary/seasonal attractions using public factual web data
   - avoid paid/metered discovery APIs
   - avoid copying protected expressive content
   - preserve provenance and verification

2. **Radial Discovery Speed**
   - reduce time-to-useful-outer-results without reintroducing the failed monolithic 50-mile query
   - keep provider traffic bounded
   - preserve truthful geographic/category coverage
   - preserve all Radial Loading cache/lifecycle invariants

This is DESIGN / AUDIT ONLY.

Do not modify product runtime in this task.
Do not move main.
Do not promote.
Do not generate uncontrolled public-provider traffic.

---

# Track A — Seasonal Web Enrichment

## Product problem

OSM/radial coverage can be geographically complete while still missing real-world seasonal attractions because those venues are absent, stale, or weakly tagged in OSM.

Observed product symptom:
- seasonal searches can return zero or only a few venues in areas where ordinary web search immediately reveals plausible active attractions.

The system needs a second discovery lane that supplements OSM rather than replacing it.

## Desired user behavior

For seasonal categories, Pick For Us should be able to surface factual venue records discovered from approved public web sources, even when OSM misses them.

Examples of factual fields:
- attraction name
- street/city/state
- website/operator URL
- phone
- operating dates
- hours
- activity type
- latitude/longitude if independently resolved
- source URL
- source name
- last checked date
- season/year
- verification state

Do NOT copy:
- article/review prose
- marketing descriptions
- copyrighted photos
- logos
- long excerpts
- ranking/editorial text

The collector should extract facts and rewrite/normalize them into Pick For Us's own schema.

## Source model

Design a source registry with explicit adapters.

Candidate source classes:
- dedicated haunted-attraction directories
- state/regional tourism bureaus
- municipal/chamber event calendars
- operator websites
- fairground/farm/event venue pages
- public business directories only where automated access is allowed

Each source adapter should define:
- source ID/name
- permitted/public URL scope
- discovery URL patterns
- parser/extractor
- factual fields retained
- update cadence
- provenance rules
- failure behavior
- robots/terms/access notes
- rate/concurrency limits
- last successful refresh

Do not bypass:
- login
- CAPTCHA
- paywall
- anti-bot challenge
- explicit technical access controls

If a source blocks automation, mark it unsupported rather than evading the block.

## No-metered-API requirement

The design must not require:
- Google Places billing
- paid search API
- postpaid usage account
- a software kill switch as the only cost guard

Prefer:
- ordinary public HTTP fetch of approved sources
- static/build-time catalog generation
- repository-committed or otherwise bounded local data
- free/open geocoding only if compliant with provider policy and cached permanently

Any optional paid source must be strictly optional and disabled by architecture, not merely by a runtime usage counter.

## Preferred architecture

Investigate a **periodically refreshed static seasonal index**:

`approved public sources -> fact extraction -> normalize -> verify -> geocode -> dedupe -> seasonal index -> app`

The app should not need to crawl the public web during every user interaction.

Benefits:
- near-zero runtime latency
- no surprise API charges
- reproducible data
- source provenance
- easier verification
- easier rollback

The index may be generated manually/on-demand first; scheduling can come later.

## Verification levels

Design explicit factual verification states, for example:

- `operator-confirmed`
- `current-season-directory`
- `current-season-secondary`
- `historical/unconfirmed`

A venue must not be presented as currently active merely because an old directory page exists.

Store:
- season/year
- checkedAt
- source URL(s)
- active-date evidence when available

UI can continue using caution text for seasonal listings.

## Identity/dedupe

Integrate with existing Date Night identity/provenance rules.

Need to handle:
- same attraction across OSM + seasonal web index
- slightly different names
- operator vs event name
- multiple sources
- moved/closed attractions
- lifecycle/terminal evidence
- same address hosting different seasonal events in different years

Never silently overwrite provenance.

## Geography

The seasonal index must support fast radius filtering.

Design how factual records gain lat/lon without requiring metered runtime geocoding.

Preferred order:
1. coordinates published by operator/source
2. coordinates from trusted map/address evidence
3. one-time geocode during catalog build
4. unresolved record retained outside runtime eligibility until coordinates are verified

Do not invent coordinates.

## Security

Treat all fetched pages as hostile input.

Design:
- strict parser boundaries
- no arbitrary code execution
- no script evaluation
- SSRF protection
- URL allowlist by source adapter
- size/time limits
- HTML/text-only extraction
- no remote image ingestion by default
- no credential storage
- no user-supplied arbitrary crawler URLs in v1

---

# Track B — Radial Discovery Speed

## Current architecture facts

Current controller:
- core first
- exactly one patch RPC in flight
- fixed 1,000 ms pause before each outer patch
- max 32 patch RPCs/pass
- stop on incomplete core
- stop after three consecutive degraded outer patches

Current 50-mile plan:
- core: 1 patch
- 15-20: 4
- 20-30: 7
- 30-40: 9
- 40-50: 11
- total: 32 patches

Each patch internally executes category groups in parallel through the hedged provider.

Observed real live patch duration is approximately several seconds per patch.

Therefore a fully serial 32-patch pass can take a long time even though no individual patch is oversized.

## Goal

Reduce:
- time to first useful outer result
- time to meaningful seasonal result
- time to continuous milestone completion

without:
- reverting to a giant radius query
- creating uncontrolled provider concurrency
- losing truthful coverage accounting
- weakening lifecycle/cache correctness

## Measure first

Before proposing runtime changes, profile the current scheduler mathematically and with deterministic fixtures.

Separate:
- fixed 1-second pacing overhead
- provider latency per patch
- number of patches needed to reach each milestone
- number of categories requested per patch
- patch query construction time
- cache hit rate
- empty successful patch rate
- duplicate/overlap acquisition cost
- provider attempt fan-out

Report best/median/worst modeled time to:
- core
- 20 miles
- 30 miles
- 40 miles
- 50 miles

Do not infer provider capacity from one live run.

## Candidate speed strategies to compare

### 1. Remove/reduce fixed outer pause

Current 1s pause can add up to ~31 seconds over a full 32-patch pass.

Evaluate:
- 0 ms
- 100–250 ms
- adaptive pause based on previous patch latency/outcome

This is the lowest-risk optimization but may not solve serial provider latency.

### 2. Bounded two-lane concurrency

After core success, allow at most two patch RPCs in flight.

Must model worst-case physical provider fan-out because each patch may use multiple groups/mirrors.

Potential policy:
- 1 in flight for core
- max 2 for outer patches
- never more than N provider groups simultaneously
- no concurrency increase after degraded responses

Do not adopt unless provider pressure remains bounded.

### 3. Milestone-aware scheduling

Prioritize completing the nearest band before starting farther bands.

Within a band, order sectors by:
- user direction/location density only if deterministic and privacy-safe
- category scarcity
- historically successful source density

Do not falsely claim continuous completion until every sector in the band is complete.

### 4. Category-adaptive expansion

Use current per-category coverage model.

Examples:
- if nearby parks/movies are abundant, do not spend every outer patch querying them first
- if user selected Haunted House, expand seasonal category aggressively
- if seasonal is sparse, prioritize seasonal web index immediately

This may substantially reduce provider work.

### 5. Static seasonal index first

For seasonal categories, query the static enriched catalog locally before or alongside OSM radial discovery.

This could produce useful outer seasonal venues instantly while OSM geographic coverage continues in background.

This is likely the highest product-value combination with Track A.

### 6. Patch geometry optimization

Measure whether the current 4/7/9/11 sector counts are over-fragmented.

Consider alternative bounded covers with fewer patches while retaining:
- no holes
- query circles below an agreed safe provider radius
- deterministic ownership
- truthful continuous coverage

Do not change geometry merely to reduce count; prove coverage and cost tradeoffs.

---

# Combined product strategy to evaluate

A likely v2 flow:

1. load static seasonal index locally and filter by selected radius/category
2. start radial OSM core acquisition
3. make UI usable from merged saved/index/core results
4. continue bounded OSM expansion in background
5. dedupe OSM and web-index venues by identity/provenance
6. progressively update future choice pool
7. preserve truthful distinction:
   - "searched geographic coverage"
   - "known seasonal venues"

This allows Pick For Us to find venues OSM misses without forcing live web crawling into the interaction path.

---

# Required design outputs

Create:

`docs/handoffs/active/date-night-seasonal-web-enrichment-radial-speed-design-1-continuation.md`

and a design report covering:

1. current-source gap analysis
2. proposed seasonal fact schema
3. source-adapter registry
4. provenance model
5. current-season verification model
6. geocoding strategy
7. dedupe/identity integration
8. security/robots/terms handling
9. static index generation pipeline
10. app runtime integration
11. radial scheduler timing model
12. speed strategy comparison
13. recommended v1 speed change
14. recommended v1 web-enrichment change
15. test plan
16. rollout plan
17. cost model: must remain $0 by design for core operation
18. exact implementation branches to create next

## Evidence

No production/provider traffic is required for this design.

Public web research is allowed only for:
- source discovery
- access-policy/robots/terms review
- representative factual examples

Do not bulk scrape or import catalogs during this design task.

## Final verdict format

Choose one:

`SEASONAL WEB ENRICHMENT + RADIAL SPEED DESIGN READY FOR IMPLEMENTATION`

or

`SEASONAL WEB ENRICHMENT + RADIAL SPEED DESIGN INCOMPLETE — REVIEW REQUIRED`

## First action

Inspect the exact current radial scheduler, planner, cache, search/provider architecture and seasonal catalogs at candidate `908510ac...`.

Quantify the current serial timing cost before proposing speed changes.

Then design the fact-only seasonal web index so it can merge with existing Date Night identity/provenance without touching the approved production candidate.
