# Pick For Us — Date Night Radial Loading Live Acceptance Remediation #1

Repository:
`caleb1234calvin-art/dinner-roulette`

Authoritative instruction branch:
`handoff/date-night-radial-loading-live-acceptance-remediation-1`

Starting preserved checkpoint:
`f94484e920ed18b93b54cbb5f0e48d1845fadb51`

Starting tree:
`94e59c5ea1d517a2c55d0d91651e1bc53d7791f9`

Starting sole parent:
`81194da07b7d6c2da93e39c0735ee498cc149379`

Frozen production main:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Required execution branch:
`acceptance/date-night-radial-loading-live-acceptance-remediation-1`

Current state:
`DATE NIGHT RADIAL LOADING INCOMPLETE — REVIEW REQUIRED`

## Why this task exists

The product implementation and controlled browser behavior are now strong:

- shared Slider accessibility remediation GREEN 9/9
- fresh controlled radial browser acceptance 10/10
- full JavaScript 729 passed
- compiled TanStack security 14/14
- lifecycle 154 / 111 / zero gaps
- V-DR-02 preserved
- main and production unchanged

The remaining blocker is the live acceptance harness's requirement that at least one of the two permitted outer patches must return and merge an eligible live venue.

Actual bounded live evidence on exact tested source `abaaf680e9e54838e7002ce79f04166c4ebefedf`:

- core: successful, 53 eligible / 45 live, usable in 7.629s
- `radial-v1:20:0`: successful acquisition, 0 final eligible/owned venues
- `radial-v1:20:1`: successful acquisition, 0 final eligible/owned venues
- exactly 3 public patch RPCs
- no retries
- no monolithic 50-mile request
- no page errors observed
- selected maximum 50 miles
- continuous proven coverage 15 miles

Both outer patch responses contained successful group outcomes, including succeeded-nonempty provider groups, yet final patch venue ownership/eligibility yielded zero venues. Therefore "must merge at least one nonempty live outer venue" is not a deterministic property of a valid outer patch acquisition.

## Acceptance-policy correction

This task is NOT authorized to weaken product behavior.

It is authorized to correct a live acceptance criterion that depends on uncontrollable third-party data abundance.

The product architecture explicitly treats valid-empty patch/category acquisition as successful coverage authority.

The controlled browser harness already proves the deterministic product behavior that cannot be guaranteed by live geography/data:

- real progressive state machine
- outer nonempty merge into the future selection pool
- stable open overlays
- radius increase/decrease behavior
- cancellation
- local-only filter no-refetch
- truthful progress
- partial failure preservation
- mobile layout
- all-stall fallback

Therefore live acceptance should validate real provider integration and truthful progressive behavior, not require a provider to happen to supply an eligible owned venue in one of two fixed sectors.

## Revised live criterion

Keep the existing bounded live sequence and public traffic cap.

For outer patches:

PASS when each permitted outer patch either:

1. succeeds and yields one or more eligible/owned venues, in which case the harness MUST assert they merge correctly; OR
2. succeeds validly but yields zero eligible/owned venues, in which case the harness MUST treat the patch as successful-empty/zero-owned and continue acceptance without inventing a merge.

FAIL when an outer patch:

- transport/provider acquisition fails contrary to the acceptance requirement,
- establishes false coverage,
- corrupts existing inner results,
- causes page/runtime errors,
- produces lifecycle-only leakage,
- causes incorrect progress/completeness claims,
- triggers unexpected provider traffic,
- or violates the RPC cap.

Do NOT relabel a failed acquisition as valid-empty.

Do NOT convert provider failures into success.

## Required live assertions after outer patch completion

The harness must continue through all previously-unreached live checks even when both permitted outer patches return zero eligible venues.

At minimum assert:

- core becomes usable before max-radius completion
- Pick remains usable
- initial progress truthfully reflects continuous coverage
- successful outer patch results do not erase or corrupt core results
- if outer venues exist, they merge into the future selection pool
- if outer venues do not exist, the UI remains usable and truthful
- local-only filters do not generate additional provider RPCs
- no page errors
- no horizontal/mobile overflow
- no lifecycle-only leakage
- no false "Loaded through X" claim
- exact continuous radius is reported from actual completed patch coverage
- complete 50-mile coverage remains false unless every required patch is complete
- exactly the authorized public RPC budget is respected
- blocked later outer requests remain harness-controlled and are never described as observed provider outages

## Traffic budget

Authorize exactly one fresh bounded live acceptance run after the harness-only criterion correction.

Hard limits remain unchanged:

- `core`
- `20:0`
- `20:1`
- maximum 3 public patch RPCs
- maximum theoretical 48 provider attempts
- no retries
- no monolithic 50-mile request
- no alternate exploratory provider probes

If the fresh run fails for a concrete product/provider integration defect, STOP.

Do not run another live attempt automatically.

## Scope

Preferred changed scope:
- live acceptance harness / acceptance evidence only

Do not modify:
- Radial Loading runtime
- cache
- geometry
- provider query logic
- session controller
- Slider runtime
- product UI
- dependencies
- config
- native
- catalogs
- main
- production

If changing the live harness requires executable test code, preserve a clear diff proving product runtime is byte-identical.

## Validation before the fresh live run

Before any public traffic:

1. verify exact starting identity / ancestry / clean branch
2. verify main and production unchanged
3. verify tested product source is the accepted slider-fixed source
4. inspect the live harness diff and prove only acceptance semantics changed
5. run syntax/lint/diff checks for the harness
6. if the harness has deterministic self-tests, run them
7. verify exact READY non-production Preview source identity

Do not rerun all 729 product tests unless product runtime changes. They are retained evidence from the slider remediation.

## Final decision

If the fresh bounded live run passes under the corrected criterion:

1. preserve live evidence
2. record product usability separately from maximum-radius completeness
3. verify main/production unchanged
4. freeze a new immutable successful candidate on the slider-fixed feature lineage
5. report exact SHA/tree/sole parent
6. STOP for fresh independent verification

Success state:

`DATE NIGHT RADIAL LOADING IMPLEMENTED — AWAITING INDEPENDENT VERIFICATION`

If the fresh bounded run exposes any concrete product/provider integration defect:

`DATE NIGHT RADIAL LOADING INCOMPLETE — REVIEW REQUIRED`

Preserve evidence and STOP.

## Rationale for the correction

A nonempty outer live venue is evidence about current third-party data in two fixed geographic sectors, not a stable product invariant.

The stable product invariants are:

- successful patch acquisition is represented truthfully
- valid-empty is valid coverage
- nonempty outer data merges correctly when present
- inner results remain usable while expansion proceeds
- partial/incomplete coverage is disclosed honestly
- traffic stays bounded

Controlled 10/10 already proves the merge path with deterministic nonempty fixture data. Live acceptance must prove that the same system integrates correctly with real providers under bounded traffic, including the legitimate case where a successfully acquired outer patch contributes no eligible venues.

## First action

Create `acceptance/date-night-radial-loading-live-acceptance-remediation-1` directly from `f94484e920ed18b93b54cbb5f0e48d1845fadb51`.

Read the full prior remediation report/continuation and current live harness.

Change only the brittle nonempty-outer acceptance condition so successful zero-venue outer patches remain valid and the rest of the live assertions execute.

Then run exactly one fresh capped 3-RPC live acceptance against an exact verified non-production Preview.
