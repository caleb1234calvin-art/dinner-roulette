# Pick For Us — Seasonal Discovery Coverage Audit 1

## Repository
`caleb1234calvin-art/dinner-roulette`

## Audit branch
`audit/seasonal-discovery-coverage-1`

## Frozen base
`0a8f30dc57fcc1156342d1bfc8a07524f3125e3b`

This branch was created from the production-promoted main baseline after:

`MAIN PROMOTION VERIFIED — PRODUCTION WEB RELEASE HEALTHY`

## Nature of task

This is an **independent read-only product/data/discovery audit**.

DO NOT:

- modify product code
- modify catalogs/data
- add seasonal venues
- hard-code local attractions
- fix defects
- commit implementation changes
- push implementation changes
- merge
- deploy
- publish
- change Vercel
- run migrations
- sign Android artifacts
- upload to Google Play

The only acceptable repository write after audit execution, if explicitly needed by the worker environment, is audit evidence/reporting on the dedicated audit branch. Prefer producing the report/evidence without modifying implementation. Do not change runtime behavior.

## Triggering real-world observation

A production user test in Carthage, Missouri exposed suspiciously thin seasonal discovery.

Observed UI configuration:

Location:
Carthage, Missouri

Radius:
50 miles

Selected Date Night activity categories:

- Haunted House
- Corn Maze
- Pumpkin Patch

Open now only:
OFF

Mood:
Playful

Observed match count:
2 activities

Observed options:

- Myer's Inn Haunt — approximately 2.0 miles — Closed
- The Werehouse — approximately 11 miles — Closed

Because Open Now was disabled, closed venues were intentionally eligible.

The returned options were both Haunted House results. No Corn Maze or Pumpkin Patch result appeared.

This observation is the primary reproduction case. It is evidence of potentially incomplete coverage, not proof of a specific defect.

## Mission

Determine why seasonal discovery around Carthage produced only two eligible results.

Do not assume the cause.

Possible classes include, but are not limited to:

- upstream provider coverage
- provider query construction
- category/tag vocabulary
- seasonal venue classification
- fallback/saved-anchor coverage
- normalization
- deduplication
- distance/radius filtering
- open-status filtering
- seasonal activation logic
- candidate eligibility rules
- result serialization
- provider timeout/error behavior
- UI match-count calculation
- interaction among multiple selected seasonal categories

The audit must distinguish:

**SOURCE COVERAGE GAP**
The external/provider/catalog inputs never supplied a venue.

from:

**INGESTION / CLASSIFICATION GAP**
Pick For Us received a venue but failed to recognize it as the intended seasonal category.

from:

**FILTERING / ELIGIBILITY GAP**
The venue was recognized but incorrectly removed by radius, open-state, season, mood, or other eligibility logic.

from:

**PRESENTATION / COUNT GAP**
Eligible candidates exist internally but the UI count/options do not represent them correctly.

from:

**EXPECTED EXCLUSION**
The venue is legitimately outside radius, category, season, or another documented rule.

Multiple causes may coexist.

---

# Required starting verification

Before auditing:

1. Fetch fresh remote refs.
2. Verify branch:
   `audit/seasonal-discovery-coverage-1`
3. Verify frozen base:
   `0a8f30dc57fcc1156342d1bfc8a07524f3125e3b`
4. Verify current main remains consistent with the promoted production baseline or report if it has moved.
5. Verify the audit branch began exactly from the frozen base plus this handoff.
6. Verify clean checkout.
7. Read current TOP continuity and relevant Date Night/seasonal discovery implementation before forming hypotheses.

If the branch contains unreviewed implementation changes, stop and report.

---

# Required implementation trace

Read the complete seasonal Date Night discovery path.

At minimum trace:

- selected seasonal filter state
- seasonal activation/preset logic
- location/radius handling
- provider query construction
- provider response normalization
- venue/category classification
- fallback/saved seasonal anchors
- open-now handling
- seasonal/open-status representation
- deduplication
- distance calculation
- eligibility filtering
- match count
- Pick our date
- Give us options
- incomplete-plan behavior
- any browser/provider fixtures that affect seasonal results

Document the actual pipeline rather than inferring it from UI labels.

---

# Primary reproduction

Reproduce as closely as the deterministic environment permits:

- Carthage, Missouri
- 50-mile radius
- Haunted House + Corn Maze + Pumpkin Patch selected
- Open Now OFF
- Playful mood

Determine:

1. raw provider candidates
2. normalized candidates
3. classified seasonal candidates
4. candidates after deduplication
5. candidates after distance filtering
6. candidates after seasonal eligibility
7. candidates after open-state handling
8. final eligible pool
9. UI match count
10. options returned

If live providers are unstable, preserve deterministic fixture results separately and identify live observations explicitly.

Do not convert live-provider incompleteness into a deterministic product failure without tracing the pipeline.

---

# Reference-set research

Build a defensible **audit reference set** of real seasonal attractions plausibly within 50 road/straight-line miles of Carthage.

This reference set is for diagnosis only.

Do NOT add these venues to the application during the audit.

Use current public sources where available and record provenance.

Search at minimum for:

- haunted houses
- haunted trails/forests where they reasonably map to Haunted House semantics
- corn mazes
- pumpkin patches
- farms that explicitly advertise qualifying corn-maze/pumpkin-patch activities

For each candidate record:

- canonical/public name
- locality
- coordinates if reliably available
- approximate straight-line distance from the audit origin
- claimed category/categories
- 2026 seasonal evidence if available
- opening/season dates if available
- whether it should be eligible when Open Now is OFF
- provider/catalog presence
- Pick For Us classification
- final Pick For Us disposition
- reason for inclusion/exclusion
- source URLs/provenance in audit evidence

Do not claim a venue is active in 2026 without evidence.

Do not treat generic farms or Halloween stores as qualifying attractions merely to increase counts.

---

# Known candidates worth investigating

The triggering discussion identified several names worth checking, but these are leads, not predetermined expected results:

- Myer's Inn Haunt — Carthage
- The Werehouse — Joplin
- Myers Forest of Fears — Carthage area
- Cadaver Zone Spookhouse — Webb City
- Wolfmans House of Screams — Carl Junction
- Verona Corn Maze — Verona area
- Pickin' Patch Farm — broader area depending on exact location/radius

Independently verify names, locations, current seasonal status, radius and category before using them.

Do not force these into the expected set if evidence does not support eligibility.

---

# Radius correctness

Audit the 50-mile boundary explicitly.

Determine whether the product uses:

- straight-line distance
- road distance
- provider radius
- bounding boxes
- another spatial mechanism

For every reference candidate near the boundary:

- compute the product-relevant distance
- determine whether it should be inside or outside
- test boundary behavior

Include at least:

- clearly inside candidates
- near-boundary candidates
- clearly outside controls

Do not diagnose missing results as coverage defects if they are legitimately outside the implemented radius semantics.

---

# Open-now semantics

Because the triggering case had Open Now OFF, verify that:

- currently closed venues remain eligible
- venues whose seasonal hours are unknown are handled according to documented rules
- future-season-opening venues are not accidentally removed solely because they are closed at audit time, if product rules say they should remain eligible
- enabling Open Now produces a meaningfully stricter pool
- toggling Open Now off restores eligible closed/unconfirmed seasonal candidates

Separate:

`closed now`

from:

`not operating this season`

from:

`permanently closed`

from:

`hours unknown`.

Do not treat these states as interchangeable.

---

# Category semantics

Audit each seasonal category independently and in combination:

- Haunted House only
- Corn Maze only
- Pumpkin Patch only
- Haunted House + Corn Maze
- Haunted House + Pumpkin Patch
- Corn Maze + Pumpkin Patch
- all three

Determine whether multi-selection means:

- union / any selected category
- intersection / all selected categories
- another rule

Verify implementation matches intended UI semantics.

Check whether venues with multiple qualifying activities are classified correctly without harmful duplication.

---

# Provider/source audit

Determine which discovery sources can contribute seasonal Date Night venues.

For each source:

- query terms/tags used
- geographic scope
- timeout/error behavior
- whether seasonal categories are actually represented by the provider vocabulary
- whether results are dropped before classification
- whether fallback is used
- whether fallback coverage is intentionally sparse

If the provider cannot reliably represent seasonal venues, identify that architectural limitation explicitly.

Do not solve it during this audit.

---

# Saved/fallback seasonal anchors

Inspect all saved seasonal anchors/catalog entries.

Report:

- count by category
- geographic distribution
- whether they are intended as examples, fallbacks, or comprehensive coverage
- how they interact with provider results
- whether Carthage-area coverage is unusually sparse
- whether saved anchors can mask provider failure while still yielding a misleadingly low match count

Do not add entries.

---

# Control-location testing

Do not overfit to Carthage.

Test several control origins where reasonable.

At minimum include:

- Joplin, Missouri
- Springfield, Missouri or another larger regional control
- one rural control
- one location with known seasonal-attraction density if supported by evidence

Use consistent radius/category settings where meaningful.

The goal is to determine whether the issue is:

- Carthage-specific
- regional
- category-specific
- provider-wide
- systemic

---

# Deterministic regression assessment

Inspect current tests for seasonal discovery.

Determine whether existing tests would catch:

- provider returns qualifying corn maze but classifier drops it
- provider returns qualifying pumpkin patch but classifier drops it
- Open Now OFF incorrectly removes closed seasonal venue
- combined seasonal filters incorrectly intersect
- radius incorrectly excludes valid venue
- provider outage fallback produces suspiciously thin but technically nonempty pool
- UI count disagrees with eligible pool
- duplicate seasonal venue consumes option slots
- unknown-hours handling differs from closed-hours handling

Report missing test coverage.

Do not add tests during this audit unless the audit framework absolutely requires an evidence-only probe outside implementation; no production test-suite modification is authorized.

---

# External-provider honesty

Live web/provider results may change.

Record:

- timestamp
- query
- response status
- candidate count
- timeout/failure
- whether fallback was activated

Never report a provider result as a complete inventory of real-world attractions.

The audit reference set and provider-return set are different things.

---

# Severity model

Classify findings as:

## BLOCKER
Current seasonal discovery materially violates intended filter/radius/open-state behavior or presents misleading results severe enough to block the next release baseline.

## IMPORTANT
Coverage/classification is materially incomplete or brittle and should be corrected, but core selection mechanics remain functional.

## NON-BLOCKING
Quality/coverage improvement with limited impact.

## INFORMATIONAL
Expected behavior, provider limitation, or documented constraint.

Do not inflate severity merely because a real venue is absent.

---

# Required evidence artifacts

Produce:

`audit/seasonal-discovery-coverage-audit-1-2026-09-29.md`

and a machine-readable evidence record such as:

`audit/seasonal-discovery-coverage-audit-1-2026-09-29.json`

If additional raw provider/reference evidence is needed, place it under a clearly named audit evidence path.

The report must include:

1. exact audited SHA/tree
2. implementation pipeline trace
3. primary Carthage reproduction
4. reference-set methodology
5. reference candidates and provenance
6. distance/radius analysis
7. category analysis
8. Open Now analysis
9. provider/source analysis
10. fallback-anchor analysis
11. control-location results
12. deterministic test-gap analysis
13. findings with severity
14. root-cause classification for each missing candidate
15. exact remediation recommendations
16. explicit non-recommendations / approaches to avoid
17. limitations
18. final audit state

---

# Remediation philosophy

Recommendations should favor systemic fixes.

Preferred classes of remediation may include, if evidence supports them:

- broader provider query vocabulary
- improved tag/category mapping
- multiple complementary provider queries
- better seasonal source composition
- better unknown-hours handling
- improved fallback architecture
- stronger deduplication
- clearer UI disclosure when seasonal coverage is fallback-limited
- deterministic tests for newly proven failure modes

Avoid recommending:

- manually hard-coding only the seven Carthage-area leads
- inflating match counts with weak/nonqualifying venues
- pretending provider results are exhaustive
- weakening distance/open-state rules merely to increase results
- silently treating permanently closed attractions as valid
- replacing evidence-based classification with name-keyword guessing alone

---

# Stop condition

This audit does not fix the issue.

Stop after producing the evidence and final classification.

End with exactly one of:

`SEASONAL DISCOVERY AUDIT — NO REMEDIATION REQUIRED`

or

`SEASONAL DISCOVERY AUDIT — REMEDIATION RECOMMENDED`

or

`SEASONAL DISCOVERY AUDIT — REMEDIATION REQUIRED`

Do not implement the recommendations in the same task.
