# Pick For Us — Date Night Radial Loading 1

Repository: `caleb1234calvin-art/dinner-roulette`

Instruction branch:
`handoff/date-night-radial-loading-1`

Required implementation branch:
`feature/date-night-radial-loading-1`

Starting preserved checkpoint:
`d9cc8bdde2e531af6f029d3d558d25f4f7bb4ab5`

Starting tree:
`f9f46d16c876b4d608ab836d57a411a607e6f8fa`

Starting sole parent:
`8e67d959f5b19cb00c22533a6eb27a1b2e1bfb2f`

Frozen production main:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Current preserved engineering state:
- lifecycle parity GREEN
- 686 JavaScript passes, 4 inherited skips, 0 failures
- compiled TanStack security 14/14
- V-DR-02 preserved; cache bytes unchanged
- controlled browser 4/4 GREEN
- 15-mile live discovery works
- repeated monolithic 50-mile discovery does not reliably complete
- no successful immutable candidate exists
- no promotion is authorized

---

## Product decision

Stop treating the selected maximum radius as one monolithic provider acquisition.

Introduce **Radial Loading**:

> The selected distance is the maximum area Pick For Us may progressively discover, not a requirement to load the entire disk before the user can use Date Night.

The app should make nearby results usable quickly, then continue expanding outward in bounded geographic patches while the user interacts with the app.

The user must be able to understand what coverage is complete and what is still loading.

Examples:

- `Loaded through 15 miles · searching farther…`
- `Nearby results ready · expanding toward 30 miles…`
- `Loaded through 30 miles · outer area temporarily unavailable`

Never claim complete coverage through a radius unless the geographic coverage model proves that radius complete for the relevant acquisition scope.

---

# Core experience

## Initial load

For any selected maximum radius greater than 15 miles:

1. acquire the nearest/core coverage first
2. make Pick / Give Us Options usable as soon as useful nearby coverage exists
3. begin bounded background expansion toward the selected maximum
4. merge newly discovered venues into the session pool as patches complete
5. do not reshuffle or mutate an already-open result/options overlay merely because background discovery added venues
6. newly discovered venues become eligible for subsequent rerolls, shuffles, or new picks

For selected maximum radius <= 15 miles, preserve simple direct acquisition unless the new coverage engine naturally handles it without regression.

## Maximum-radius semantics

Current UI wording may continue to say:

`Within 50 miles`

but internally this means:

`Pick For Us may progressively discover outward up to 50 miles.`

Do not block normal interaction until the full maximum radius is complete.

---

# Provider architecture goal

The provider must NOT issue the current monolithic 50-mile all-group query merely as the final step of progressive loading.

The architecture must divide outer coverage into bounded spatial patches so no individual patch reintroduces the same giant-radius query cost.

The exact patch geometry is an implementation decision after source review.

Acceptable candidates include:

- bounded overlapping circular patches
- deterministic sector/ring patches
- bounding-box tiles clipped logically to the selected radial boundary
- another deterministic bounded coverage plan

Requirements:

1. patches collectively cover the authorized radial area with no unintended holes
2. overlap is permitted and deduped
3. each patch remains small enough to avoid the current 50-mile monolith
4. the coverage planner is deterministic and testable
5. the client/server can identify patches with stable IDs
6. patch failure does not invalidate already successful inner coverage
7. retries target failed/missing patches, not already successful coverage
8. geographic coverage is truthful, not inferred from venue counts

If a rectangular/tile cover extends outside the requested circle for provider efficiency, returned venues must still be filtered to the user's selected maximum distance before becoming eligible.

---

# Suggested radial milestones

Use the existing Date Night distance vocabulary as the starting product language:

`1, 3, 5, 10, 15, 20, 30, 40, 50`

The first broad-coverage milestone remains 15 miles because current Date Night live discovery already uses a 15-mile minimum provider fetch.

For larger selections, prefer progressive milestones aligned with existing settings:

`0–15 → 15–20 → 20–30 → 30–40 → 40–50`

This is a product/coverage sequence, not a requirement that the provider use mathematical annulus queries.

The provider may implement each band with multiple bounded patches.

---

# Coverage model

Geographic coverage becomes a first-class state.

The current cache only reasons about category coverage plus a single radius. Radial Loading must represent spatial coverage explicitly.

Design a deterministic model capable of answering:

- which geographic patches are complete
- which are loading
- which failed
- which categories/groups are covered in each patch
- which patches remain before a selected maximum radius is complete
- what radius can truthfully be described as continuously complete from the user's origin

Suggested concepts:

`DateNightCoveragePatch`
- stable patch ID
- geometry/bounds
- radial band/milestone
- requested category/group scope
- outcome
- acquisition time/version

`DateNightCoverageState`
- complete patches
- missing patches
- failed patches
- in-flight patches
- continuously complete radius
- selected maximum radius

Do not persist precise user coordinates beyond the existing in-memory session behavior.

---

# Cache invariants

Preserve the intent of the current session cache and V-DR-02 fix.

Required:

1. successful patch coverage remains reusable during the mounted Date Night session
2. failed/cancelled/late/fallback patch responses cannot establish coverage
3. valid-empty is successful patch/category coverage
4. newer successful coverage must not allow older superseded coverage to resurrect
5. lifecycle-negative evidence must remain available to suppress matching positive identities across patch/category boundaries
6. patch eviction must not falsely imply coverage remains complete
7. if a patch needed to prove continuous radial coverage is evicted, the coverage state must become missing/incomplete rather than silently relying on stale authority
8. TTL remains bounded
9. memory remains bounded
10. location/season/semantic-version changes invalidate incompatible coverage
11. outer successful coverage must not falsely imply inner gaps are covered
12. overlap/dedupe must preserve full identity/evidence semantics

Do not casually discard the existing cache model; extend or replace it only with explicit regression proof for all existing V-DR-02 cases.

---

# Category-aware expansion

Radial Loading should support category-aware expansion.

After nearby coverage exists, the system may prioritize expansion for sparse or user-selected categories rather than continuing all categories equally.

Examples:

- parks plentiful at 15 miles → no need to expand parks immediately
- corn maze empty → continue seasonal outward
- movies sparse → culture may expand
- explicit user selection of Corn Maze → prioritize seasonal patches

This optimization is optional for the first implementation if it materially increases complexity.

Minimum viable Radial Loading may expand all requested groups patch-by-patch.

However, design the coverage model so later per-group/category prioritization is possible without another cache rewrite.

---

# Interaction behavior

## Loading states

Split the current single `loading` concept into at least:

- initial/foreground loading: no useful current coverage yet
- background radial expansion: useful results exist and more area is loading

Once useful initial coverage exists:

- Pick our date should remain enabled
- Give us options should remain enabled
- Plan the night should remain enabled when otherwise eligible
- toggling local-only filters must not restart covered provider work

## Open overlays

When background patches complete:

- do not silently replace the current pick
- do not silently replace the current four options
- do not silently replace an open plan
- preserve refreshed eligibility/status behavior already present
- newly loaded venues join the pool for future interactions

## Progress messaging

Create truthful user-facing progress.

Examples:

`Loaded through 15 miles · searching farther…`

`Loaded through 30 miles · expanding toward 50…`

`Nearby results ready · some outer areas could not be loaded`

Avoid provider jargon.

Do not show "Loaded through X" unless coverage is continuously complete from the origin through X for the relevant requested scope.

---

# Server/search behavior

Current `searchDateNight` accepts one center/radius and runs all planned groups.

Radial Loading may require a new internal/server RPC contract for patch acquisition.

Prefer an explicit server-owned patch descriptor over accepting arbitrary geometry/query text from the client.

The client must never be able to inject Overpass syntax.

Possible request shape:

- center/origin
- selected maximum radius
- server-recognized patch ID
- activity types
- spooky-season flag

The server resolves patch ID to bounded geometry.

Or:

- server returns/derives a deterministic patch plan from origin/max radius
- client requests only enumerated patch IDs

Exact design is up to implementation, but geometry/query construction must remain server-owned and validated.

---

# Preserve lifecycle/query correctness

All prior lifecycle correctness work remains mandatory.

Preserve:

- canonical lifecycle vocabulary
- all 154 lifecycle audit cases
- all 111 authoritative negatives
- zero deterministic parity gaps
- cross-category terminal suppression
- arbitrary permanent-prefix suffix semantics
- lifecycle-only leakage protection
- positive query narrowness
- hostile input rejection
- V-DR-02 cache semantics

Do not revert to the historically faster but lifecycle-incomplete query shape.

---

# Provider/request budgeting

Radial Loading trades one large acquisition for multiple smaller ones.

That must remain bounded.

Design explicit limits for:

- maximum concurrent patch acquisitions
- maximum patches in flight
- maximum provider attempts per patch
- cancellation when location/max radius/selection changes
- background pause/stop when the selected maximum is already sufficiently covered
- no runaway automatic retries
- no recursive expansion loop after repeated failures

Strong preference:

- one patch acquisition at a time in the background after initial coverage, or a very small bounded concurrency
- nearby/core acquisition retains priority
- user interaction remains responsive

Do not create a hidden provider hammer.

---

# First implementation phase

Before runtime changes:

1. fetch fresh refs
2. verify starting SHA/tree/parent
3. verify main/production unchanged
4. create `feature/date-night-radial-loading-1` directly from `d9cc8bd...`
5. read current cache/search/home/query/lifecycle/provider code and relevant tests
6. document the current acquisition state machine
7. design deterministic patch geometry and coverage semantics
8. prove the patch plan covers the selected circle/bands without holes using deterministic geometry tests
9. checkpoint the design/test RED state before implementation

---

# Mandatory tests

Add permanent tests for:

## Patch geometry
- deterministic IDs
- no missing intended area
- bounded patch size
- correct max-radius clipping/filtering
- milestone completion rules
- overlap is acceptable/deduped

## Progressive behavior
- 15-mile core completes first
- UI becomes usable after initial useful coverage
- background expansion continues
- open result/options/plan do not mutate automatically
- next reroll/shuffle can use newly loaded venues

## Failure preservation
- successful inner coverage survives outer patch failure
- failed 40–50 patch does not downgrade 0–40 completeness
- failed patch remains missing, not falsely complete
- retry requests only failed/missing patch work

## Cache
- all existing V-DR-02 regressions remain GREEN
- supersession cannot resurrect after patch eviction
- patch overlap cannot resurrect stale identity/category coverage
- lifecycle negative evidence crosses patch boundaries safely
- valid-empty patch coverage remains authoritative
- fallback/late/cancelled cannot establish patch coverage

## Filters
- Open Now, mood, favorites, Fewer Parks remain local
- changing local-only filters does not restart radial acquisition
- changing activity selection requests only genuinely missing category/patch coverage where possible

## Location/radius changes
- lowering max radius does not require provider refetch
- raising radius schedules only missing outer coverage
- location change invalidates incompatible patches
- spooky-season semantic change invalidates relevant coverage safely

## Security
- client cannot submit arbitrary provider geometry/query fragments
- patch IDs/descriptors are server-owned/validated

---

# Validation sequence

After implementation:

1. focused patch-planner tests
2. coverage/cache tests
3. lifecycle parity/query tests
4. client lifecycle/progressive UI tests
5. provider hedge/deadline tests
6. TanStack security
7. typecheck
8. changed-code lint
9. diff check
10. full npm test
11. dependency tree
12. casino invariants
13. Android structural/icons
14. Python native verifier
15. migration-free auth-enabled production build/proof
16. protected-scope/secret/junk review

Never run migration-chaining `npm run build`.

---

# Controlled browser acceptance

Build deterministic provider fixtures for radial behavior before touching public providers.

At minimum test:

1. core 15 succeeds; outer patches succeed progressively
2. core succeeds; middle band partial failure; farther work stops or continues according to policy
3. outermost patch fails; inner complete coverage remains usable
4. user opens options while background patch completes; visible options remain stable
5. user rerolls after patch completion; new venues can participate
6. radius raised from 15 to 50; only outer patches schedule
7. radius lowered during expansion; unnecessary work cancels
8. Open Now toggle creates zero provider requests
9. mobile progress text has no overflow
10. all-stall initial core still settles honestly to fallback/error according to existing policy

Controlled harness must make zero public-provider calls.

---

# Live acceptance strategy

Only after deterministic/build/browser gates pass.

Do NOT test Radial Loading by immediately running a monolithic 50-mile request.

Use one exact non-production Preview and observe the progressive patch sequence.

Bound provider traffic explicitly.

Minimum acceptance goals:

- core/nearby coverage succeeds
- UI becomes usable before max-radius completion
- at least one outer band/patch successfully merges
- coverage progress is truthful
- local filters do not refetch
- failed outer patch preserves successful inner results
- total provider traffic remains within the documented patch budget
- no page errors/overflow/lifecycle leakage

A full 50-mile "complete" pass is desirable but is no longer an all-or-nothing prerequisite for the app to be useful. Acceptance should distinguish:
- product usability with truthful partial radial coverage
- complete maximum-radius coverage

Do not promote unless the handoff's final acceptance criteria are explicitly satisfied.

---

# Evidence and continuity

Maintain:

`docs/handoffs/active/date-night-radial-loading-1-continuation.md`

Checkpoint/push at minimum:

1. architecture/patch-plan + RED geometry/coverage tests
2. patch acquisition/server contract implementation
3. patch-aware cache/coverage implementation
4. progressive UI behavior
5. focused GREEN
6. before full validation
7. after full validation/build/security
8. controlled browser acceptance
9. bounded live Preview acceptance
10. final immutable candidate freeze

Each save must record exact branch/base/SHA, changed paths, tests, coverage model state, provider-budget state, remaining gates, main/production preservation, and SAFE TO RESUME status.

---

# Final outcome

Successful end state:

`DATE NIGHT RADIAL LOADING IMPLEMENTED — AWAITING INDEPENDENT VERIFICATION`

Incomplete state:

`DATE NIGHT RADIAL LOADING INCOMPLETE — REVIEW REQUIRED`

Do not promote in the implementation task.

---

# First action

Start from `d9cc8bdde2e531af6f029d3d558d25f4f7bb4ab5`.

Document the current Date Night acquisition/cache/UI state machine.

Design a deterministic bounded patch coverage plan for progressive discovery to 50 miles.

Prove the geometry and coverage accounting with RED tests before changing runtime behavior.
