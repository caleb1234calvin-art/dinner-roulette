# Pick For Us — Date Night Live Discovery Resilience Verification Remediation 1

Repository: `caleb1234calvin-art/dinner-roulette`

Instruction branch:
`handoff/date-night-live-discovery-resilience-verification-remediation-1`

Required implementation branch:
`fix/date-night-live-discovery-resilience-verification-remediation-1`

Failed immutable candidate:
`e84acc471f57dff430f73368390442e585f93637`

Failed candidate tree:
`098458ffbd62234fa4575313d1c6e3d1afd00ec9`

Failed candidate sole parent:
`b7487e8832e6f4a0b8ec5a8352c9db31586324c4`

Frozen production main:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Independent verification handoff:
`docs/handoffs/active/date-night-live-discovery-resilience-1-verification.md`

Independent verification handoff commit:
`51ac1b31e1b525003b24fcc3940bd0ef65464058`

Verification result:
`DATE NIGHT LIVE DISCOVERY RESILIENCE VERIFICATION FAILED`

---

## Authority

Read this handoff IN FULL before making executable changes.

This task is a narrow remediation of exactly two blockers independently reproduced by the verifier against failed candidate `e84acc471f57dff430f73368390442e585f93637`.

The failed candidate must remain preserved as failed verification history. Do not amend it, rewrite its evidence to imply success, or promote it.

Create the implementation branch directly from the failed candidate, not from this instruction branch.

No unrelated architecture or product work is authorized.

---

# Verification blockers

## V-DR-01 — Category-limited lifecycle acquisition can resurrect a permanently closed venue

### Reproduced failure

A seasonal identity has:

- an active Corn Maze representation that is reachable by a Corn Maze-only query
- matching permanent-closure/demolition evidence represented under a different supported seasonal tag, specifically a Pumpkin Patch lifecycle companion

On frozen production / broad Anything acquisition, the negative lifecycle evidence is present and the venue is excluded.

On the failed candidate:

- Anything still retrieves enough evidence and excludes the venue
- Corn Maze-only narrows lifecycle companion acquisition to Corn-owned tags
- the Pumpkin-tagged demolition evidence is omitted
- identity merge therefore lacks the terminal negative evidence
- the closed venue becomes eligible

This violates a core invariant:

**A narrower activity selection must never resurrect an identity that is known permanently closed merely because its lifecycle evidence is tagged under another supported category.**

### Current root cause

At the failed candidate, `lifecycleQueryClauses(around, selected)` in:

`src/lib/date-night/provider-evidence.ts`

builds lifecycle-negative provider clauses only from the currently selected Date Night activity types.

`buildDateNightQuery(...)` in:

`src/lib/date-night/query-plan.ts`

passes the narrowed selected activity set directly into those lifecycle clauses.

Positive acquisition is correctly category-aware. Terminal lifecycle evidence is not safely category-local.

### Required remediation

Make lifecycle-negative acquisition identity-protective across category narrowing.

The implementation must ensure that if a returned positive candidate can match a lifecycle-negative representation under another supported Date Night category, the negative representation remains discoverable and can win during identity merge.

Do not solve this by broadening affirmative result classification.

Do not return generic unrelated farms/parks/attractions.

Do not weaken lifecycle precedence.

Do not add venues/catalog entries.

Do not special-case the verifier fixture by name.

The exact architecture is up to the implementer after source review. Acceptable designs include a bounded shared lifecycle-negative companion acquisition or another deterministic mechanism that makes terminal identity evidence category-independent without turning every positive query back into the original giant monolith.

Performance must remain bounded and measured because this code exists inside the live Overpass path.

### Mandatory regression cases

Create the counterexample first and prove it FAILS on the failed candidate before fixing.

At minimum cover:

1. active Corn identity + matching `demolished:attraction=pumpkin_patch` identity representation
   - Corn-only must exclude
   - Pumpkin-only must exclude if the positive identity is otherwise reachable
   - mixed Corn/Pumpkin must exclude
   - Anything must exclude
2. reverse cross-seasonal representation where practical
   - positive Pumpkin + Corn/Haunted lifecycle companion must not resurrect
3. terminal lifecycle precedence remains deterministic regardless of provider/result order
4. unrelated lifecycle-negative records must not leak into positive results
5. selected positive query clauses remain narrow
6. generic seasonal context still does not pass without positive seasonal evidence
7. existing lifecycle/disused/permanently-closed tests remain green
8. ordinary Date Night category narrowing receives equivalent protection where the data model allows cross-category identity representations; if implementation intentionally scopes only seasonal cross-category protection, document why that is sufficient and add a regression proving the boundary

The test must exercise the real query-builder/handler path sufficiently to catch omission of the lifecycle companion, not only `providerLifecycle(...)` in isolation.

---

## V-DR-02 — LRU eviction can restore superseded category coverage

### Reproduced failure

The failed candidate fixed an equal-timestamp freshness tie while both entries remain in cache, but supersession is not durable across eviction.

Verifier sequence:

1. Store an older Anything acquisition containing a Corn venue and unrelated categories such as Movies.
2. Store a newer valid-empty Corn Maze acquisition that correctly supersedes old Corn coverage.
3. Read Movies repeatedly or otherwise keep the older Anything entry recently used.
4. Cause cache pressure so the newer valid-empty Corn entry is evicted while the older Anything entry remains.
5. Read Corn Maze again.

Failed candidate behavior:

- old Anything Corn coverage becomes reusable again
- old Corn venue is restored
- read is a complete cache hit
- no refetch is required

This violates:

**Once newer successful coverage supersedes older coverage for a category, normal LRU eviction must not make the superseded older coverage authoritative again during its remaining cache lifetime.**

### Current root cause

`src/lib/date-night/cache.ts` retains overlapping historical entries intact.

Reads choose the newest compatible entry using immutable `acquiredAt/admitted` ordering, but only among entries still present.

LRU `used` controls eviction.

When the newer empty entry is evicted, the older superset again becomes the newest surviving Corn coverage because no durable supersession state remains.

### Required remediation

Make category supersession durable across normal LRU/aggregate-cap eviction.

The fix must preserve bounded memory.

Possible designs include, but are not limited to:

- destructively invalidating superseded category coverage inside older compatible entries when newer successful coverage is admitted
- maintaining bounded per-signature/category supersession metadata/tombstones independent of ordinary entry eviction
- another deterministic bounded model that prevents old coverage resurrection

Choose based on correctness and simplicity.

Do NOT merely tweak LRU priority so the verifier sequence becomes less likely.

Do NOT pin superseding entries forever.

Do NOT make memory unbounded.

Do NOT cause stale data to masquerade as fresh coverage.

Conservative refetch after supersession/eviction is acceptable; resurrecting older superseded coverage is not.

### Radius/signature considerations

Explicitly reason about:

- same location/signature
- Halloween active state
- semantic version
- category
- radius widening/narrowing
- equal timestamps
- TTL
- max entry eviction
- max raw-venue eviction

A newer narrower-radius result may conservatively invalidate more old coverage and force a future wider refetch if that is the safest bounded design. It must not falsely claim wider coverage.

### Mandatory regression cases

First reproduce the verifier counterexample and prove RED on the failed candidate.

Then require GREEN for:

1. older Anything with Corn + Movies
2. newer valid-empty Corn
3. Movies read makes older Anything LRU-hot
4. cache pressure evicts the newer empty entry
5. Corn read must NOT restore old Corn
6. result must either:
   - remain empty from durable supersession metadata, or
   - report Corn missing and require fresh acquisition
7. no complete Corn cache-hit from the superseded old snapshot
8. same scenario with equal timestamps
9. maxEntries eviction path
10. maxVenues/aggregate raw-venue eviction path
11. radius narrowing/widening boundary
12. TTL expiry
13. unrelated Movies coverage remains reusable where still valid
14. valid-empty supersession does not remove truthful full classification/evidence from an identity reused through another still-valid category
15. fallback/failed/cancelled/late responses still cannot establish supersession as successful coverage
16. component unmount still clears the whole session cache

Do not weaken existing cache tests to make the new behavior pass.

---

# Mandatory starting gates

Before executable changes:

1. Fetch fresh refs.
2. Verify `main` is still `4d937e58d2a65567b54ac5271915bc85b498898b` or STOP/report movement.
3. Verify failed candidate SHA/tree/sole parent exactly.
4. Create `fix/date-night-live-discovery-resilience-verification-remediation-1` directly from `e84acc471f57dff430f73368390442e585f93637`.
5. Verify clean worktree and linear ancestry.
6. Read IN FULL:
   - original Date Night resilience handoff
   - continuation
   - final remediation MD/JSON
   - independent verification handoff
   - relevant production-loading and seasonal lifecycle evidence
   - current `provider-evidence.ts`, `query-plan.ts`, `cache.ts`
   - relevant tests
7. Reproduce BOTH verifier blockers as deterministic failing tests before fixing either.
8. Preserve the RED logs/evidence.
9. Checkpoint and push the reproduced-failure state before implementation if practical.

Do not use the instruction branch as the implementation base.

---

# Scope

Authorized runtime edits are limited to what is necessary to close V-DR-01 and V-DR-02.

Expected likely runtime paths:

- `src/lib/date-night/provider-evidence.ts`
- `src/lib/date-night/query-plan.ts` if needed
- `src/lib/date-night/cache.ts`

Expected tests:

- `scripts/date-night-query-plan.test.mjs`
- `scripts/date-night-cache.test.mjs`
- seasonal/identity tests only if needed for true end-to-end coverage

Shared Date Night search/identity code may be changed only if the blockers cannot be correctly solved without it.

Do not change:

- provider list
- hedge offsets
- 8s attempt bound
- 20s provider deadline
- 25s client watchdog
- saved catalogs
- Dinner behavior
- Nightlife behavior
- casino data
- auth/database
- package/lockfile
- Vercel settings
- Android/native product behavior
- branding/domain/PWA
- production/main

---

# Preservation invariants

The remediation must retain the verified architecture from the failed candidate except for these two bugs:

- Date Night-only hedged mirrors
- 0/1.5/3/4.5s starts
- bounded four groups × four mirrors
- category-aware positive query planning
- partial-result preservation
- truthful source/coverage disclosure
- 10-minute bounded per-mount cache
- local Open Now/mood/favorites/Fewer Parks no-refetch
- strict hostile category validation
- seasonal positive classification semantics
- negative lifecycle precedence
- identity/evidence merge semantics
- privacy-conscious logs
- no unbounded retries

---

# Continuity / checkpoint protocol

Maintain a remediation continuation:

`docs/handoffs/active/date-night-live-discovery-resilience-verification-remediation-1-continuation.md`

Checkpoint/push at minimum:

1. both verifier failures reproduced RED
2. V-DR-01 fixed and focused tests GREEN
3. V-DR-02 fixed and focused tests GREEN
4. before full-suite/build/browser phase
5. after full validation
6. final immutable candidate freeze

Each save should state:

- branch/base/latest SHA
- changed files
- tests/results
- remaining blocker
- exact next action
- main/production untouched
- Preview identity if any
- resume state

If a long command stalls, preserve coherent work and checkpoint before changing diagnostic approach.

---

# Validation sequence

After focused GREEN tests:

1. query/seasonal/lifecycle focused suites
2. cache suite
3. partial-result and client lifecycle suites
4. provider deadline/hedge suites
5. TanStack security suite
6. typecheck
7. changed-code lint
8. `git diff --check`
9. full `npm test` in loopback-capable environment
10. `npm ls --all`
11. casino invariants
12. Android structural/icon checks
13. Python native tests
14. migration-free auth-enabled production build and proof
15. protected-scope / secret / generated-junk sanity

The prior full count was 611 JS passes. The new final count should be greater if regressions are added; report the actual total and do not invent an expected number.

Preserve the known restricted-runner loopback limitation honestly if encountered.

Never run migration-chaining `npm run build`.

---

# Browser / Preview acceptance

Only after deterministic/build validation is clean:

1. rerun the four controlled browser scenarios
2. verify no regression to hedging/partial/fallback/Open Now reuse/mobile layout
3. use a non-production Preview for a bounded real check

Because V-DR-01 changes provider query shape, perform at least:

- 15-mile Anything
- 50-mile Anything
- Corn Maze subset reuse from each successful superset

If lifecycle acquisition expansion measurably harms seasonal provider runtime, investigate before promotion.

Do not hammer public providers.

A two-acquisition 15/50 matrix with local subset reuse is preferred.

Venue counts are observations, not invariants.

---

# Evidence

Create separate remediation evidence; do not overwrite the failed candidate's original report.

Suggested:

- `audit/date-night-live-discovery-resilience-verification-remediation-1-2026-10-02.md`
- `audit/date-night-live-discovery-resilience-verification-remediation-1-2026-10-02.json`
- optional evidence directory for RED/GREEN logs

Record:

- failed candidate identity
- verifier findings exactly
- RED reproductions
- root causes
- fixes
- focused/full validation
- performance comparison
- Preview result
- changed paths
- final SHA/tree/sole parent
- main/production preservation

Clearly state that `e84acc...` remains a failed verification candidate.

---

# Final freeze

If and only if both blockers close and all required validation passes:

1. review diff against failed candidate
2. confirm only authorized remediation/evidence changes
3. freeze new immutable candidate
4. push
5. report exact SHA/tree/sole parent
6. verify clean worktree
7. verify main/production untouched
8. STOP for a fresh independent reverification

Do not promote.

Success state:

`DATE NIGHT LIVE DISCOVERY RESILIENCE VERIFICATION REMEDIATED — AWAITING INDEPENDENT REVERIFICATION`

Failure/incomplete state:

`DATE NIGHT LIVE DISCOVERY RESILIENCE VERIFICATION REMEDIATION INCOMPLETE — REVIEW REQUIRED`

---

# First action

Start by reproducing both verifier blockers as deterministic RED tests against `e84acc471f57dff430f73368390442e585f93637`.

Do not begin by changing implementation code.
