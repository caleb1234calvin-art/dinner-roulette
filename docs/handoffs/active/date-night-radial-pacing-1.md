# Pick For Us — Date Night Radial Pacing #1

Repository:
`caleb1234calvin-art/dinner-roulette`

Instruction branch:
`handoff/date-night-radial-pacing-1`

Starting immutable base:
`908510ac25fe5c24335126a0f34ff42fe4d80632`

Starting tree:
`3211b4df4eccb638a8c492da047eac3b24abb600`

Required implementation branch:
`feature/date-night-radial-pacing-1`

Design authority:
`handoff/date-night-seasonal-web-enrichment-radial-speed-design-1`
at commit
`edb524d2fe49174b217dbcbaf97a1c7edc81608f`

Current state:
`SEASONAL WEB ENRICHMENT + RADIAL SPEED DESIGN READY FOR IMPLEMENTATION`

## Mission

Implement ONLY the approved first radial-speed change.

Do not modify the approved release candidate.
Do not move main.
Do not promote or deploy production.
Do not change geometry, provider mirrors, query semantics, cache semantics, lifecycle semantics, category grouping, retries, or the 32-request pass cap.
Do not add multi-patch concurrency.

## Required pacing behavior

Current:
- one patch RPC in flight
- 1,000 ms post-settlement delay between automatic outer requests

Implement:
- core remains first and serialized
- still exactly one patch RPC in flight
- after a complete successful patch, including successful-empty: nominal 250 ms delay
- after a degraded/failed patch: retain at least 1,000 ms delay
- enforce a minimum 1,000 ms spacing between OUTER patch start times
- success wait is effectively max(250 ms, 1000 ms - elapsed since prior outer start)
- cancellation clears pending timers
- compatible updates must not bypass the outer-start floor
- explicit retry still targets only missing work and obeys the same admission spacing
- no timer-driven retry loop
- incomplete core still blocks outer work
- three consecutive degraded outer patches still pause
- pass budget remains max 32 starts
- late/aborted work cannot seed cache after cancellation/generation invalidation

The 250 ms change is a pacing optimization, not proof of provider capacity.

## Timing model to preserve in evidence

Current 32-patch cold full pass:
1 + 4 + 7 + 9 + 11 = 32 patches.

At synthetic 6 s successful patch latency:
- existing 1,000 ms pacing model ≈ 223 s to 50 mi
- 250 ms success pacing model ≈ 199.75 s
- modeled saving ≈ 23.25 s

Do not call 6 s a measured provider median or SLA.

## Mandatory invariants

Preserve:
- V-DR-01 closure
- V-DR-02 closure
- V-F03-01 / lifecycle-negative semantics
- successful-empty authority
- category/patch coverage accounting
- TTL/eviction behavior
- radius clipping
- truthful continuous-radius progress
- stable open Pick/Options/Plan overlays
- local-only filters remain local
- no automatic retry on empty success
- no giant 50-mile monolith
- no increased provider group/mirror fan-out

## Tests

Add deterministic timing coverage for:
- exact 250 ms nominal success/empty delay
- 1,000 ms minimum outer-start spacing
- 1,000 ms degraded delay
- one RPC in flight
- cancellation clears pending timer
- compatible update cannot burst starts
- explicit retry obeys spacing
- incomplete core blocks outer
- three degraded stop
- 32 starts/pass
- late abort-ignoring settlement rejected

Retain and rerun relevant:
- radial plan/session/cache/search
- date-night cache
- query-cost
- lifecycle parity
- hedged provider
- seasonal discovery
- partial results/UI

Controlled browser acceptance must continue to block third-party traffic and preserve all existing scenarios.

Do not run a public load test in this task.

## Scope boundary

Expected runtime change should be narrow, primarily scheduler/timing logic and focused tests/evidence.

If implementation requires:
- geometry changes
- a second concurrent patch
- mirror changes
- global provider semaphore
- cache schema change
- lifecycle change
STOP and return for design review.

## Final state

If implementation and deterministic/controlled validation pass:

`DATE NIGHT RADIAL PACING IMPLEMENTED — AWAITING INDEPENDENT VERIFICATION`

Freeze the exact candidate SHA/tree/parent and create continuation/evidence.

Otherwise:

`DATE NIGHT RADIAL PACING INCOMPLETE — REVIEW REQUIRED`

## First action

Freshly verify the exact base SHA/tree, read the design handoff and current radial scheduler tests, create `feature/date-night-radial-pacing-1` from the exact base, then implement only the approved serial pacing change.
