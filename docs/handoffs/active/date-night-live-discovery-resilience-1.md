# Pick For Us — Date Night Live Discovery Resilience Remediation 1

Repository: `caleb1234calvin-art/dinner-roulette`

Instruction branch:
`handoff/date-night-live-discovery-resilience-1`

Required implementation branch:
`fix/date-night-live-discovery-resilience-1`

Frozen production base:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Current production deployment observed during incident confirmation:
`dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL`

Production deployment commit:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Date of handoff:
2026-10-02

---

# Authority and purpose

Read this document IN FULL before changing executable code.

This handoff authorizes a focused remediation of the Date Night live-discovery failure mode that is currently collapsing real user searches to the small saved fallback catalog even when a broad live result should be available.

The user personally reproduced the failure in production with Date Night / Spooky Season at both:

- 15 miles, Open Now OFF
- 50 miles, Open Now OFF

The visible result pool remained only two seasonal options.

This is not the Halloween notice/layout bug that was just promoted. That UI work is already live. This is a distinct discovery-resilience problem.

The production evidence gathered immediately after the user's reproduction shows Date Night live discovery exhausting the application provider budget and then returning saved fallback:

- mode: `date-night`
- source: `fallback`
- aggregate duration: approximately 20,001–20,003 ms
- budget exhausted: true
- mirror 1: approximately 8,001 ms timeout
- mirror 2: approximately 8,001–8,002 ms timeout
- mirror 3: approximately 3,997–3,999 ms timeout
- mirror 4: sometimes never starts; sometimes receives only approximately 2–3 ms before the aggregate deadline
- this happened repeatedly, not as a one-off single request

That pattern proves the current serial provider policy can spend nearly the entire aggregate budget on the first two mirrors and starve later mirrors. The user's reproduction at 15 miles also proves the primary failure is not simply "50-mile queries are too large."

The current saved Halloween fallback contains only two fully curated seasonal anchors, so a complete live-provider failure naturally collapses the visible seasonal pool to those two places.

The mission is therefore:

**Make Date Night live discovery resilient enough that a slow or failing early Overpass mirror does not routinely collapse a healthy 15-mile or 50-mile search to the two saved seasonal anchors, while preserving the hard loading deadlines and all existing safety/availability/source-disclosure semantics.**

---

# Mandatory reads before modification

Read IN FULL, not excerpts:

1. `docs/handoffs/active/date-night-live-discovery-resilience-1.md`
2. `docs/handoffs/active/production-loading-hang-remediation-1.md`
3. `docs/handoffs/active/production-loading-hang-remediation-1-verification.md`
4. `audit/production-loading-hang-remediation-1-2026-09-30.md`
5. `audit/production-loading-hang-remediation-1-2026-09-30.json`
6. `audit/production-loading-hang-audit-1-2026-09-30.md`
7. `audit/production-loading-hang-audit-1-2026-09-30.json`
8. relevant seasonal discovery remediation / verification artifacts
9. relevant V-F03-01 seasonal lifecycle remediation / verification artifacts
10. relevant current Halloween verification-notice remediation / verification artifacts
11. `src/lib/discovery/provider-chain.ts`
12. `src/lib/discovery/client-request.ts`
13. `src/lib/date-night/search.ts`
14. `src/lib/date-night/provider-evidence.ts`
15. `src/lib/date-night/eligibility.ts`
16. `src/lib/date-night/availability.ts`
17. `src/lib/date-night/coverage.ts`
18. `src/lib/date-night/season.ts`
19. `src/components/date-night-home.tsx`
20. `src/components/halloween-date-night-panel.tsx`
21. `scripts/discovery-provider-deadlines.test.mjs`
22. `scripts/discovery-client-lifecycle.test.mjs`
23. `scripts/seasonal-discovery.test.mjs`
24. relevant TanStack server-function security regression coverage, including `scripts/tanstack-security.test.mjs`
25. current `AI_CONTINUITY.md`
26. current package/build/release instructions needed to preserve migration-free production validation

Treat the earlier production-loading remediation as an invariant, not as something to undo.

---

# Frozen starting gate

Before making executable changes:

1. Fetch fresh remote refs.
2. Verify remote `main` is still exactly:
   `4d937e58d2a65567b54ac5271915bc85b498898b`
3. If `main` moved, STOP and report the new SHA before combining work.
4. Create `fix/date-night-live-discovery-resilience-1` from that exact frozen production SHA, not from the instruction branch.
5. Verify the implementation branch has exactly that ancestry before editing.
6. Verify the working tree is clean.
7. Read the current Date Night request path end to end.
8. Reproduce the old behavior deterministically in tests before relying on a proposed fix.
9. Preserve the existing 20-second provider aggregate budget and 25-second client watchdog during the first implementation phase.
10. Do not alter Vercel configuration as a first-line solution.

If there is any unreviewed executable commit after the frozen base, STOP instead of silently absorbing it.

---

# Current architecture and diagnosed failure

At the frozen base, Date Night uses:

`src/lib/date-night/search.ts`

with four ordered Overpass mirrors:

1. `overpass.openstreetmap.fr`
2. `overpass.private.coffee`
3. `maps.mail.ru`
4. `overpass-api.de`

The shared provider helper currently uses:

- aggregate provider budget: 20,000 ms
- maximum individual attempt: 8,000 ms
- sequential mirror attempts
- no next mirror until the prior attempt settles or times out

That means the practical all-stall schedule is approximately:

- mirror 1: t=0 → t=8s
- mirror 2: t=8s → t=16s
- mirror 3: t=16s → t=20s
- mirror 4: no meaningful budget remaining

This is exactly what current production logs show.

Date Night also currently builds one broad Overpass query containing ordinary Date Night acquisition plus Halloween acquisition when active. At a broad radius, the request may include:

- bowling alleys
- amusement arcades
- cinemas
- miniature golf
- escape games
- museums
- ice rinks
- roller skating
- every qualifying park
- seasonal maze / farm / attraction / theme-park evidence clauses

Even at 15 miles, a slow provider can still hit the serial attempt ceiling. At 50 miles, the broad query is even more expensive.

When all live attempts fail, `localWithin(...)` provides saved catalog entries. The current curated seasonal fallback has only two hard-coded Halloween anchors. Therefore a live-provider outage produces the user's observed "two options" state.

This is expected fallback behavior; the problem is that the provider architecture is causing fallback far too readily.

---

# Non-goals

Do not solve this by:

- removing all timeouts
- restoring an effectively indefinite spinner
- simply changing 20 seconds to a very large number and calling the issue fixed
- deleting the saved fallback
- fabricating live venues
- bypassing seasonal availability rules
- loosening lifecycle / permanently-closed protections
- changing radius semantics
- weakening Open Now semantics
- adding unverifiable venues just to increase counts
- silently converting fallback data to "live"
- changing Dinner or Nightlife behavior without a demonstrated need
- changing Vercel maxDuration blindly
- adding an external paid provider merely because usage constraints are relaxed
- adding scraping systems unrelated to this exact failure
- changing production directly before independent verification

The user is no longer concerned about model/tool usage, so be thorough. That does NOT authorize careless public-provider load, unbounded retries, or unsafe external behavior.

---

# Required remediation design

The remediation has four primary parts and one conditional timeout phase:

1. hedged Date Night provider execution
2. smaller / adaptive Date Night acquisition queries
3. partial-result preservation
4. bounded caching / reuse
5. only if still necessary after the above: measured, coordinated deadline adjustment

All four primary parts should be implemented unless evidence proves one is unnecessary or unsafe. If a design adjustment is required, document the evidence and preserve the behavioral goals.

---

# R1 — Hedged Date Night provider execution

## Problem

The current serial chain allows the first two dead mirrors to consume roughly 16 of the available 20 seconds. Later mirrors are not given a fair chance.

## Required behavior

For Date Night live acquisition, replace strict serial waiting with a bounded hedged strategy.

A reasonable initial policy is:

- mirror 1 starts at t=0
- mirror 2 starts after approximately 1.5 seconds if no valid result has completed
- mirror 3 starts after approximately 3.0 seconds if no valid result has completed
- mirror 4 starts after approximately 4.5 seconds if no valid result has completed
- each attempt remains abortable
- no attempt may survive the overall absolute provider deadline
- retain an individual attempt cap initially compatible with the existing 8-second policy unless measurement justifies a change
- first valid provider response for a query group wins that group
- cancel losing in-flight requests as soon as a winner is accepted
- malformed / HTTP-error / abort outcomes must not be mistaken for valid completion
- an immediate hard failure should not delay starting another mirror
- preserve privacy-conscious structured outcome logging

The exact hedge delay may be tuned using deterministic tests and measured live behavior, but the final design MUST ensure later mirrors receive meaningful execution time well before the 20-second aggregate deadline.

The implementation may generalize `createProviderChain` if that can be done without changing Dinner/Nightlife semantics. It is also acceptable to introduce a Date Night-specific hedged path if that is safer.

## Dinner and Nightlife

Default requirement:

- Dinner behavior unchanged
- Nightlife behavior unchanged

Do not convert all modes to hedging merely for architectural neatness unless tests prove no semantic regression and there is a concrete reason.

---

# R2 — Adaptive / decomposed Date Night queries

## Problem

One giant Date Night query asks a provider to evaluate many unrelated acquisition clauses in one response.

The currently selected client categories are not used to narrow the server acquisition request. The request validator currently receives location, radius and Spooky Season state, but not the selected activity categories.

## Required outcome

Break Date Night acquisition into bounded logical query groups and/or selected-category query plans so that a seasonal search does not unnecessarily require a provider to scan every ordinary category in the same giant request.

Recommended logical groups:

### Group A — seasonal

- haunted house
- corn maze
- pumpkin patch
- the current positive seasonal-evidence rules from `provider-evidence.ts`
- preserve all current negative/historical/lifecycle protections

### Group B — indoor entertainment

- bowling
- arcade
- miniature golf
- escape room
- skating

### Group C — culture / screen

- cinema
- museum

### Group D — parks / outdoor ordinary

- park

This grouping is a starting architecture, not permission to alter classification semantics.

## Category-aware behavior

If the user has selected a specific subset instead of Anything:

- acquisition should be allowed to narrow to only the relevant clauses/groups
- do not ask for unrelated categories merely because they exist in the application

If the user selects Anything:

- all relevant groups may run
- prefer concurrent bounded group execution rather than one giant monolithic query
- each group remains independently recoverable

If multiple selected categories share a group:

- combine only the required clauses for that group where practical

If the selected categories span groups:

- execute only those necessary groups

## Critical UI/network requirement

Do not regress the current property that local-only filters such as:

- Open Now
- mood
- favorites
- fewer parks

do not needlessly restart remote discovery when the already acquired pool is sufficient.

Introducing category-aware server acquisition may require a cache/coverage model so changing activity chips does not cause pathological request churn.

The final design must explicitly document when an activity-type change triggers remote acquisition and when cached/superset results are reused.

---

# R3 — Partial-result preservation

## Problem

The current Date Night live path effectively treats provider acquisition as one all-or-nothing request. A complete query failure falls back to the local catalog.

Once acquisition is split into groups, one slow group must not erase successful groups.

## Required behavior

For each requested query group, track one of at least:

- live success with venues
- live success with an empty valid response
- failed / exhausted
- cancelled because no longer needed
- cache hit, if caching is used

At request completion:

- merge successful live groups
- preserve valid empty-group success as a real successful result for that group
- merge live results with the saved local catalog under existing identity/dedupe semantics
- if at least one live group succeeds and another requested group fails, return the successful live contribution instead of collapsing the entire response to fallback-only
- surface an honest partial/degraded warning or coverage state where appropriate
- never label failed categories as live-covered
- preserve source honesty

The exact top-level `source` type may need to remain `live | merged | fallback` for compatibility. If so, represent partial live acquisition through bounded warning/coverage metadata rather than inventing a breaking source enum without need.

If the response shape is extended:

- update all serializers/tests/callers
- preserve backward compatibility where practical
- document the meaning exactly

## Complete outage

Only when no requested live group obtains a valid provider response should the Date Night request use the existing complete fallback behavior.

If saved coverage exists:

- return saved fallback honestly

If no saved coverage exists:

- return the existing normalized terminal error behavior

---

# R4 — Bounded cache / result reuse

## Goal

Avoid repeating the same expensive live discovery every time the user revisits an already covered Date Night category set.

A cache is an optimization, not the sole correctness mechanism.

## Preferred properties

Implement a bounded cache at the safest layer available.

Possible layers:

- client/session acquisition cache
- server in-memory short-TTL cache
- both, if justified and simple

Do not assume serverless in-memory cache persistence for correctness.

A server memory cache may help warm instances but must be treated as opportunistic.

A client/session cache is likely more reliable for avoiding repeated requests during one user session.

## Cache key requirements

Include all acquisition-relevant dimensions, such as:

- location identity or safely normalized/quantized coordinates
- radius
- Spooky Season / Halloween acquisition state
- query group or category signature
- any future acquisition-semantic version key

Do not key on local-only presentation filters like mood or Open Now unless they truly affect acquisition.

Do not log precise coordinates merely because they are part of an internal cache key.

## TTL

Use a short bounded TTL appropriate for venue discovery.

A starting range of approximately 5–15 minutes is reasonable.

Do not cache seasonal operating-state conclusions beyond their existing availability/revalidation rules.

The cache should reuse raw discovered venue data, not freeze UI eligibility forever.

Current time-sensitive eligibility must still be recomputed from fresh local clock state.

## Coverage-aware reuse

If a prior Anything request already acquired all groups for a location/radius/season signature:

- a later Haunted House-only view should reuse the covered superset rather than immediately refetching

If a prior Haunted House-only request exists and the user later selects Movies:

- fetch only the missing group if necessary

If the user widens radius:

- do not pretend a smaller-radius cache covers the wider radius

If the user narrows radius:

- it is acceptable to reuse a larger-radius cached pool and filter locally if provenance is still valid

Document the chosen coverage rules.

---

# R5 — Deadline policy: preserve first, adjust only with evidence

## Mandatory initial rule

Do NOT remove the provider hard timeout.

Do NOT remove the 25-second client watchdog.

The production-loading-hang remediation exists because unbounded waiting was a real production incident.

During the first implementation/validation pass, preserve:

- provider aggregate: 20,000 ms
- existing client watchdog: 25,000 ms

The new hedging/query decomposition should first prove whether those bounds are sufficient.

## Conditional extension

Only after R1–R4 are implemented and deterministic/live evidence shows valid healthy searches still routinely need more than 20 seconds may the final candidate extend the provider deadline.

If extending:

1. measure before changing
2. inspect current hosted runtime limits
3. maintain meaningful margin below any platform cutoff
4. change server and client deadlines coherently
5. never make server deadline longer than the effective client lifecycle without an explicit reason
6. update all deadline tests
7. preserve guaranteed UI settlement

A plausible ceiling to evaluate is approximately:

- server provider aggregate: 30 seconds
- client watchdog: approximately 35 seconds

But these are NOT pre-authorized magic numbers. Use them only if evidence demonstrates the new architecture still requires them and platform margin is adequate.

An unlimited timeout is not acceptable.

---

# Provider etiquette / bounded concurrency

The user has no model/tool usage constraint, but these are public Overpass services.

Do not create an uncontrolled request fan-out.

The hedged design must remain bounded.

Requirements:

- at most the known mirror set unless separately authorized
- staggered hedging, not immediate brute-force retry storms
- cancel losers promptly
- no infinite retries
- no recursive retries
- no retry loop triggered by every local filter render
- cache successful results to reduce repeat load
- deterministic tests should carry most stress validation; do not hammer public endpoints merely to prove timing logic

---

# Query and classification invariants

Preserve all current semantic rules unless this handoff explicitly authorizes otherwise.

Do not regress:

- current ordinary Date Night type classifications
- current Halloween type classifications
- corn-maze / maize evidence requirements
- generic maze false-positive rejection
- negative/historical prose rejection
- lifecycle precedence
- permanently closed suppression
- disused suppression
- retired venue handling
- Precious Moments alias behavior
- current dedupe distance and identity semantics unless a failing regression proves a narrow correction is necessary
- source evidence merging
- hours conflict handling
- seasonal availability labels
- Open Now eligibility
- browse eligibility
- seasonal revalidation
- selected-category coverage messaging
- saved-only / fallback disclosures
- result/options/plan eligibility consistency

Do not broaden seasonal classification merely to create a larger count.

---

# Fallback invariants

The saved local catalog remains a safety net.

Do not delete or weaken it.

Do not add unverified seasonal venues simply to mask provider failures.

The desired improvement is:

**live discovery should succeed more often and preserve partial live success; fallback remains honest when live discovery truly fails.**

Current hard-coded seasonal fallback count being small is not itself a defect if live acquisition is working.

---

# Required deterministic regression coverage

Add tests that would fail on the frozen production architecture and pass only after this remediation.

Prefer fake clocks and deterministic provider stubs.

Do not make the suite depend on current public-provider health.

## Hedging tests

At minimum:

1. first mirror stalls, second mirror succeeds quickly after hedge delay
   - result settles well before 8 seconds
   - first request is cancelled after winner
2. first two mirrors stall, third succeeds
   - third is started before the first 8-second attempt expires
3. fourth mirror succeeds
   - fourth receives meaningful time before aggregate deadline
4. all mirrors stall
   - aggregate provider deadline remains bounded
   - all in-flight requests are aborted
5. first mirror returns malformed immediately
   - next mirror is not artificially delayed
6. 429 / 500 / 504 handling remains normalized
7. invalid JSON remains malformed/error
8. response body stall is still bounded
9. losing hedge requests cannot mutate result after winner
10. timers/controllers are fully cleaned up
11. privacy log contains no coordinates, URLs, query bodies, addresses or raw exception text

## Query-plan tests

For a selected seasonal-only filter:

- generated acquisition must not include cinema, museum, bowling, park, arcade, etc.

For Movies-only:

- generated acquisition must not include seasonal clauses or unrelated ordinary clauses

For Anything during Halloween:

- all intended groups are requested
- group queries are bounded and independent

For mixed selection such as Haunted House + Movies:

- only seasonal + culture/screen groups are requested

For Spooky Season off:

- seasonal acquisition is excluded even if stale persisted seasonal filters exist; current normalization semantics remain correct

## Partial-result tests

At minimum:

- seasonal succeeds, parks fail
- entertainment succeeds, seasonal fails
- one group returns valid empty, another succeeds
- multiple groups succeed with duplicates
- one group times out after another has succeeded
- all groups fail
- one group has malformed response, others succeed
- partial result has honest degraded disclosure
- complete fallback still says fallback
- partial live result does not incorrectly say "saved places only" for categories with live contribution
- missing categories remain represented as missing in coverage

## Cache tests

At minimum:

- Anything success covers later subset without network
- subset then unrelated subset fetches only missing group
- Open Now toggle does not trigger live discovery
- mood change does not trigger live discovery
- Favorites toggle does not trigger live discovery
- Fewer Parks toggle does not trigger live discovery
- radius narrowing can reuse a valid larger-radius pool if that design is chosen
- radius widening does not reuse insufficient coverage
- location change invalidates incompatible cache
- Halloween activation-state change invalidates incompatible cache
- TTL expiry triggers refresh
- stale cache may be used only according to explicitly documented policy, never silently as fresh live data if the policy says otherwise

## Existing deadline regression

Preserve or deliberately update:

`scripts/discovery-provider-deadlines.test.mjs`

The old Date Night assertion currently proves sequential calls at t=0, 8s and 16s. That Date Night-specific assertion should change because the behavior is intentionally being fixed.

Do NOT weaken Dinner/Nightlife deadline assertions merely to accommodate Date Night.

`scripts/discovery-client-lifecycle.test.mjs` must continue proving:

- unresolved transport exits loading by watchdog
- timeout abort signal issued
- abort-ignoring transport cannot keep spinner alive
- late success/rejection ignored
- replacement cancels old request
- unmount cancels old request
- retry remains current

---

# User-visible acceptance tests

The final candidate must be exercised like the user's real report, not only through unit tests.

Use a Preview deployment first.

Required real-world acceptance matrix centered on Carthage, Missouri:

### Date Night + Spooky Season ON

Test at minimum:

1. 15 miles, Open Now OFF, Anything
2. 15 miles, Open Now OFF, Haunted House
3. 15 miles, Open Now OFF, Corn Maze
4. 15 miles, Open Now OFF, Pumpkin Patch
5. 15 miles, Open Now OFF, mixed seasonal selection
6. 50 miles, Open Now OFF, Anything
7. 50 miles, Open Now OFF, Haunted House
8. 50 miles, Open Now OFF, Corn Maze
9. 50 miles, Open Now OFF, Pumpkin Patch
10. 50 miles, Open Now OFF, mixed seasonal selection
11. 15 miles, Open Now ON
12. 50 miles, Open Now ON

Do not require a specific venue count as an immutable assertion because live provider data changes.

Instead verify:

- a successful live response actually contributes live venues when the provider returns them
- production does not collapse to the same two saved anchors merely because the first two mirrors are slow
- partial provider success is preserved
- source/coverage disclosure matches reality
- widening from 15 to 50 miles does not reduce the acquisition pool because of an architecture bug
- Open Now OFF actually exposes browse-eligible closed/upcoming/unconfirmed entries according to existing rules
- changing Open Now does not unnecessarily trigger a new live query
- the UI settles within the watchdog
- no stale result replaces a newer filter/location request

Record observed counts and source state as evidence, but do not encode volatile live counts as permanent truth.

---

# Production-like provider failure acceptance

In a controlled environment or deterministic browser harness, prove:

### Scenario A

- mirror 1 hangs
- mirror 2 returns valid seasonal results after its hedge start
- user receives those results without waiting for mirror 1's 8-second timeout

### Scenario B

- mirrors 1 and 2 hang
- mirror 3 returns
- user receives mirror 3 results before the old serial chain would even start it

### Scenario C

- seasonal group succeeds
- parks group hangs
- user still gets seasonal live results plus local merge
- UI marks degraded/partial coverage honestly

### Scenario D

- all groups/mirrors fail
- saved fallback appears
- no indefinite spinner
- no fake live source

---

# Observability requirements

Retain bounded, privacy-conscious observability.

Extend it enough to diagnose this architecture without leaking user location.

Useful fields may include:

- mode
- query group identifier
- attempt ordinal
- hedge start offset
- attempt duration
- outcome category
- winner mirror ordinal
- cache hit/miss
- requested group count
- successful group count
- failed group count
- partial result boolean
- aggregate provider duration
- final source category
- budget exhausted

Do NOT log:

- precise latitude/longitude
- street address
- full Overpass body
- full provider URL if existing policy intentionally omits it
- raw exception strings that may contain sensitive content
- user identifiers
- personal preferences

One bounded summary per Date Night request is preferable to noisy per-attempt spam.

---

# Performance requirements

The remediation should improve both success probability and time-to-first-valid-result.

Required deterministic evidence:

- second-mirror success should no longer wait for first-mirror 8-second timeout
- third/fourth mirrors receive real execution opportunity before the aggregate deadline
- partial successful groups are not held hostage by unrelated failed groups once the request can safely finalize
- complete all-stall remains bounded
- client spinner remains bounded

Record measured timings before and after.

Do not claim a performance improvement without evidence.

---

# Security and transport requirements

Because Date Night uses TanStack server functions:

- preserve the currently pinned TanStack security invariants
- preserve RPC signal forwarding
- preserve hostile-input validation
- validate any new `activityTypes` / query-plan input server-side
- reject or normalize unknown category IDs
- never trust the client to emit a prebuilt Overpass query
- build queries only from server-owned whitelisted clauses
- do not allow arbitrary tag/query injection through category values
- keep coordinates validated through current location model
- keep radius clamped to current allowed bounds

Run `scripts/tanstack-security.test.mjs` and any relevant transport checks after changes.

---

# Implementation guidance

A clean design may look approximately like this, but adapt if repository evidence suggests a safer structure:

1. Introduce a server-owned Date Night query-plan builder.
2. Map validated requested activity types to one or more whitelisted query groups.
3. Generate minimal Overpass clauses per group.
4. Execute requested groups concurrently under one Date Night request deadline.
5. Within each group, use bounded hedged mirrors.
6. Resolve a group on the first valid provider response.
7. Abort losing mirror requests for that group.
8. Preserve successful groups even when other groups fail.
9. Merge/dedupe all live group results.
10. Merge the saved local catalog.
11. Return source + partial/coverage metadata honestly.
12. Add bounded client/session cache coverage so local-only changes and already-covered category changes do not cause unnecessary requests.
13. Keep current eligibility calculation client-side over the discovered pool.
14. Re-evaluate deadline only after measurement.

Avoid a giant unrelated refactor.

Prefer small composable helpers with tests.

---

# Explicit state-machine expectations

For each query group, define a deterministic state:

- pending
- hedging
- succeeded-nonempty
- succeeded-empty
- failed
- cancelled

For the whole Date Night acquisition:

- if at least one requested group succeeds:
  - merge successes
  - record failed requested groups
  - return live/merged data with partial disclosure if needed
- if all requested groups fail and local catalog covers the area:
  - fallback
- if all requested groups fail and no local catalog coverage:
  - normalized terminal error

A successful-empty provider response is still evidence the provider answered. Treat it distinctly from provider failure.

---

# Dedupe / identity requirements after group splitting

Splitting a query can cause the same physical venue to arrive from multiple groups.

Therefore explicitly verify:

- same OSM element appearing in multiple category queries does not create duplicate options
- cross-category venue types are unioned
- catalog/live aliases still merge correctly
- shared discoveryEvidence is deduplicated deterministically
- activityTypes retain all valid classifications
- source becomes merged only when appropriate
- plan/options/pick operate on unique venue identities

Do not change dedupe thresholds unless a concrete regression demands it.

---

# Continuity / save-point protocol — MANDATORY

The user explicitly wants durable saves throughout this task so a stalled or interrupted agent can resume without reconstructing work.

Do not attempt the entire remediation as one giant unpushed work session.

## Required continuation file

On the implementation branch, create and maintain:

`docs/handoffs/active/date-night-live-discovery-resilience-1-continuation.md`

The original handoff is authoritative for scope.

The continuation file is the mutable save-state.

Never rewrite this original handoff to reflect progress.

## Save cadence

Create a remote checkpoint:

- after initial reproduction / design capture
- after hedged provider infrastructure is implemented and its focused tests pass
- after query decomposition / query-plan work passes focused tests
- after partial-result semantics pass focused tests
- after cache / reuse behavior passes focused tests
- before beginning any long full-suite/build/browser/live-provider phase
- after any long phase completes
- immediately before a risky refactor or broad test modification
- whenever the session is becoming long enough that context loss is plausible
- whenever an external tool/provider stalls or blocks progress
- before stopping for any reason

There is no penalty for having several clear checkpoint commits on the implementation branch.

Do not squash away useful recovery points before independent verification.

## What each continuation update must contain

At every save point, record:

1. repository
2. implementation branch
3. frozen base
4. latest pushed checkpoint SHA
5. checkpoint tree SHA if available
6. sole parent or ancestry note
7. clean/dirty working-tree state
8. completed milestones
9. files changed so far
10. tests run and exact pass/fail state
11. known failures or flaky/external blockers
12. current design decisions
13. unresolved questions
14. exact next action
15. commands that should be rerun after resume
16. any temporary instrumentation still present
17. whether production/main remains untouched
18. whether any Preview exists and its URL/ID
19. whether live-provider observations were captured
20. final line stating one of:
   - `SAFE TO RESUME FROM THIS CHECKPOINT`
   - `CHECKPOINT INCOMPLETE — READ BLOCKERS BEFORE CONTINUING`

## Commit convention

Use small descriptive commits.

Examples:

- `Checkpoint Date Night discovery reproduction and design`
- `Add hedged Date Night provider execution`
- `Checkpoint hedged provider tests`
- `Split Date Night acquisition query groups`
- `Preserve partial Date Night live results`
- `Add Date Night discovery coverage cache`
- `Checkpoint Date Night resilience validation`

A continuity-only commit is acceptable and encouraged before long-running work.

Push every save-point commit.

Do not leave the only useful state in an unpushed local worktree.

## If a command stalls

If a test/build/browser/provider command appears hung:

1. do not destroy the branch
2. preserve any completed source changes
3. stop the hung command safely if possible
4. record the exact command and observed stall point
5. run the smallest safe integrity check available
6. commit/push the current recoverable checkpoint if the tree is coherent
7. update the continuation file
8. resume from that saved state or report the blocker

Do not repeatedly rerun a known-stalling live-provider command without changing the diagnostic approach.

---

# Suggested milestone sequence

## Milestone 0 — Baseline / proof

No executable changes yet.

- verify frozen base
- capture current Date Night provider schedule in deterministic test
- reproduce old serial starvation
- capture current local fallback behavior
- document current request/query shape
- create first continuation checkpoint

Expected state:

`BASELINE REPRODUCED — IMPLEMENTATION NOT STARTED`

## Milestone 1 — Hedged mirrors

- implement bounded Date Night hedging
- update focused provider tests
- prove second/third/fourth mirrors are not starved
- prove all-stall still bounded
- prove loser cancellation
- save/push

Expected state:

`HEDGED PROVIDERS IMPLEMENTED — QUERY DECOMPOSITION PENDING`

## Milestone 2 — Query planning

- add validated activity-type acquisition input or equivalent server-owned query plan
- split minimal whitelisted query groups
- add query-content regressions
- preserve old classification semantics
- save/push

Expected state:

`QUERY DECOMPOSITION IMPLEMENTED — PARTIAL MERGE PENDING`

## Milestone 3 — Partial results

- concurrent group execution under bounded deadline
- preserve successes when siblings fail
- honest degraded disclosure
- dedupe cross-group duplicates
- save/push

Expected state:

`PARTIAL LIVE RESULTS IMPLEMENTED — CACHE/REUSE PENDING`

## Milestone 4 — Cache / reuse

- coverage-aware bounded cache
- no Open Now/mood/favorites/fewer-parks refetch
- reuse prior superset
- fetch missing groups only
- TTL/invalidation tests
- save/push

Expected state:

`DATE NIGHT DISCOVERY RESILIENCE FEATURE-COMPLETE — VALIDATION PENDING`

## Milestone 5 — Full deterministic validation

Run relevant complete checks.

Save before starting this phase.

After completion, update continuation and push.

## Milestone 6 — Preview / browser / live acceptance

Create or use a non-production Preview only after deterministic validation is clean.

Exercise the Carthage 15/50-mile matrix.

Capture provider source state and counts.

Do not promote to main.

Save/push after evidence capture.

## Milestone 7 — Final candidate freeze

- remove temporary diagnostics
- final full validation
- create remediation evidence
- update current continuity according to repository convention
- commit/push immutable candidate
- report SHA/tree/sole parent
- STOP for independent verification

---

# Required validation commands / gates

Use repository-native scripts and existing validation conventions.

At minimum run, where applicable:

- `npm ci` or the established clean-install equivalent
- `npm ls --all`
- `npm run typecheck`
- `npm test`
- focused Date Night discovery tests
- `node --test scripts/discovery-provider-deadlines.test.mjs` if compatible with repository runner conventions, otherwise the established equivalent
- `node --test scripts/discovery-client-lifecycle.test.mjs` if compatible, otherwise established equivalent
- seasonal discovery regression suite
- lifecycle / availability regressions
- location discovery tests
- `scripts/tanstack-security.test.mjs` through the established runner
- changed-code lint or `npm run lint` according to existing project policy
- `npm run audit:casinos`
- `npm run android:check`
- migration-free production build using the repository's established safe build command; do NOT blindly run a production migration
- `git diff --check`
- secret/junk/generated-artifact sanity
- tracked-byte stability checks required by current Android/Capacitor continuity
- relevant browser checks

Do not invent pass results.

If an existing full-suite command differs from the examples above, use the repository's current authoritative command.

---

# Build / migration warning

`npm run build` currently chains `npm run db:migrate`.

Do not run a migration merely because a generic build script exists.

Follow the existing migration-free production-build convention recorded by current continuity/remediation evidence.

This task does not authorize database migrations.

---

# Required remediation evidence

Create new, separate evidence rather than rewriting prior audits.

Suggested:

- `audit/date-night-live-discovery-resilience-1-2026-10-02.md`
- `audit/date-night-live-discovery-resilience-1-2026-10-02.json`
- optional focused evidence directory:
  `audit/date-night-live-discovery-resilience-1-evidence/`

Record:

- frozen starting SHA
- current production deployment ID
- original reproduction statement
- observed production fallback timing pattern
- original provider policy
- final hedge policy
- final query groups
- validated category-to-query mapping
- final partial-result state rules
- cache design and TTL
- timeout policy
- changed paths
- focused test inventory
- full validation results
- before/after deterministic timing evidence
- Preview deployment ID/URL if created
- 15-mile acceptance observations
- 50-mile acceptance observations
- Open Now ON/OFF observations
- source/fallback/partial-disclosure observations
- limitations
- exact final candidate SHA/tree/sole parent
- explicit statement that main/production was not modified by implementation work

Do not overwrite the prior production-loading audit/remediation evidence.

---

# Scope limits

Authorized executable scope includes only what is reasonably necessary for:

- Date Night provider hedging
- Date Night query planning/decomposition
- Date Night partial-result preservation
- Date Night acquisition cache/reuse
- supporting source/coverage metadata
- tests/harnesses required for those changes
- bounded observability required to verify them
- documentation/evidence/continuity

Do not modify unrelated:

- Dinner feature behavior
- Nightlife feature behavior
- casino catalogs
- restaurant catalogs
- Android product behavior
- branding/artwork
- auth
- database schema
- unrelated UI
- social cards
- PWA identity
- domain configuration

Shared helper edits are allowed only where Date Night needs them and must preserve other modes by regression test.

---

# What success looks like

Success is NOT "the app has more than two hard-coded Halloween venues."

Success is:

- live Date Night discovery has a fair chance to reach all configured mirrors
- broad queries are decomposed or narrowed
- successful groups survive unrelated failures
- repeated filter interactions reuse acquired data instead of hammering providers
- 15-mile and 50-mile searches no longer collapse to fallback merely because the first two mirrors are slow
- fallback remains correct when live discovery genuinely fails
- the user never returns to an indefinite loading spinner
- all seasonal availability/lifecycle/source rules remain truthful

---

# Independent verification requirement

The implementation agent must NOT merge or promote the final candidate.

After successful implementation and validation:

1. freeze the exact candidate
2. push it
3. report exact SHA
4. report tree SHA
5. report sole parent
6. report implementation branch
7. report Preview deployment if one exists
8. ensure clean worktree
9. update continuation with final state
10. STOP

A fresh independent verifier must review the immutable candidate before controlled main promotion.

---

# Final completion states

If implementation and all required validation pass:

`DATE NIGHT LIVE DISCOVERY RESILIENCE REMEDIATED — AWAITING INDEPENDENT VERIFICATION`

If implementation is partially complete but a blocker remains:

`DATE NIGHT LIVE DISCOVERY RESILIENCE INCOMPLETE — RESUME FROM CONTINUATION`

If evidence shows the proposed architecture is unsafe or does not fix the real production failure:

`DATE NIGHT LIVE DISCOVERY RESILIENCE REDESIGN REQUIRED — DO NOT PROMOTE`

---

# First action for the implementation agent

Do not start by editing timeout constants.

Start by:

1. verifying the frozen production base
2. reading the required artifacts
3. creating `fix/date-night-live-discovery-resilience-1` from frozen main
4. reproducing the serial-starvation behavior with deterministic tests
5. creating the continuation save-state
6. checkpointing/pushing that baseline
7. then implementing hedged provider execution

This ordering is intentional.

The prior timeout remediation must remain intact while this task improves the probability of obtaining a valid live result inside that bounded lifecycle.
