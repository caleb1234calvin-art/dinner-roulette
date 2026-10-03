# Pick For Us — Date Night Live Discovery Resilience — Live Timeout Remediation 1

Repository: `caleb1234calvin-art/dinner-roulette`

Instruction branch:
`handoff/date-night-live-discovery-resilience-live-timeout-remediation-1`

Required implementation branch:
`fix/date-night-live-discovery-resilience-live-timeout-remediation-1`

Starting incomplete checkpoint:
`e8730f7e44ba48a78a3335657190f7e5aaf82d7b`

Starting tree:
`50a412de4e6ef656ce0f7c8b8e4a39fb720b9e20`

Starting sole parent:
`08893d73a5e22674d4f9fccbdf04599cdd2c6f25`

Frozen production main:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Diagnosis authority:
`docs/handoffs/active/date-night-live-discovery-resilience-live-timeout-diagnosis-1.md`

Diagnosis commit:
`ff7f050c7ee1991ccd0ef15a0cb4f3cc956f2178`

Diagnosis result:
`DATE NIGHT LIVE DISCOVERY LIVE TIMEOUT DIAGNOSIS — QUERY/RUNTIME COST BLOCKER CONFIRMED`

Current remediation state to preserve:
- lifecycle parity deterministic GREEN
- 673 JavaScript passes, 4 inherited skips, 0 failures
- build/security GREEN
- controlled browser 4/4 GREEN
- V-DR-02 preserved
- cache implementation byte-identical
- no successful immutable candidate exists
- no promotion is authorized

---

## Authority

Read this handoff IN FULL before making executable changes.

This task is a narrow remediation of the concrete carrier-query cost mechanism established by the diagnosis. It is NOT a redesign of Date Night discovery.

Create the implementation branch directly from:

`e8730f7e44ba48a78a3335657190f7e5aaf82d7b`

Do not branch from this instruction branch.

Preserve all lifecycle-parity work already proven GREEN. Preserve the failed live timeout evidence unchanged.

No promotion, main update, production deployment, migration, package/lock change, provider-list change, deadline extension, cache redesign, or unrelated feature work is authorized.

---

# Confirmed defect

The diagnosis established a concrete avoidable cost mechanism in the inspected official Overpass execution path:

- lifecycle parity remediation introduced carrier selectors on common active keys such as `amenity`, `leisure`, `tourism`, `attraction`, `sport`, and `landuse`
- those selectors currently use exact-key + regex-value acquisition forms
- in the inspected Overpass execution path, exact-key + regex-value can enumerate the whole key's global index range before spatial restriction is applied
- the same carrier is repeated independently across all four groups and potentially all four mirrors
- lifecycle filtering happens after that carrier acquisition

The diagnosis explicitly did NOT prove this mechanism was the sole historical timeout cause, and did NOT establish which engine versions public mirrors run. However, it established enough avoidable query work to require remediation before another live canary.

The concrete target is therefore:

**replace avoidable common-key regex-value carrier acquisition with index-selective semantically equivalent acquisition wherever the lifecycle vocabulary is finite and exact-value enumerable, while preserving lifecycle semantics and group independence.**

---

# Core invariants that must remain true

The remediation must preserve:

1. all 154 lifecycle audit cases
2. all 111 authoritative negative lifecycle cases
3. zero deterministic interpretation/acquisition parity gaps
4. arbitrary permanent-prefix suffix semantics where currently supported
5. helper-normalized lifecycle classification behavior
6. cross-category identity suppression
7. terminal lifecycle precedence
8. lifecycle-only leakage protections
9. positive category narrowness
10. generic farm/park/maze rejection
11. hostile category/query input rejection
12. truthful per-group coverage and partial-failure behavior
13. independent group behavior
14. V-DR-02 cache semantics
15. provider list
16. hedge offsets approximately 0 / 1500 / 3000 / 4500 ms
17. 8s attempt deadline
18. 20s provider ceiling
19. 25s client watchdog
20. Dinner and Nightlife behavior
21. saved/casino catalogs
22. auth/database
23. package/lockfile
24. Vercel configuration
25. Android/native behavior
26. production/main

---

# Mandatory starting gates

Before runtime edits:

1. fetch fresh refs
2. verify starting checkpoint SHA/tree/sole parent exactly
3. verify main remains `4d937e58...` or STOP/report movement
4. verify production remains unchanged or STOP/report movement
5. create `fix/date-night-live-discovery-resilience-live-timeout-remediation-1` directly from `e8730f7e...`
6. verify clean worktree and linear ancestry
7. read IN FULL:
   - timeout diagnosis handoff
   - timeout diagnosis report/evidence
   - remediation-2 handoff
   - remediation-2 continuation
   - remediation-2 final MD/JSON
   - current `src/lib/date-night/lifecycle.ts`
   - current `src/lib/date-night/query-plan.ts`
   - current provider/query/security/parity tests
   - current top `AI_CONTINUITY.md`
8. reproduce the current carrier query shape and the diagnosis's static-cost mechanism locally without public-provider traffic
9. preserve a before-remediation query-cost evidence snapshot
10. checkpoint before implementation if practical

---

# Required design investigation

Before selecting a patch, enumerate the active-key carrier registry currently used by lifecycle acquisition.

For each active key, determine whether the recognized values are:

- finite and enumerable
- semantically exact-value representable
- regex-only for a genuine reason
- overlapping with existing positive/category context acquisition
- duplicated across groups
- safe to acquire through exact key/value selectors without changing interpretation semantics

The first candidate design should use **exact-key/value acquisition for finite active-key values** instead of exact-key/regex-value enumeration.

Examples:

Prefer structurally index-selective forms equivalent to:

`["amenity"="cinema"]`

over:

`["amenity"~"^(cinema)$"]`

where semantics are exactly equivalent.

Do not mechanically convert arbitrary lifecycle-prefix suffix matching into a finite exact-value list if that would violate existing arbitrary-suffix semantics.

---

# Scope

Expected runtime scope:

- `src/lib/date-night/lifecycle.ts`
- `src/lib/date-night/query-plan.ts` only if necessary
- `src/lib/date-night/provider-evidence.ts` only if necessary to keep interpretation/acquisition sourced from the same canonical registry

Do not modify `src/lib/date-night/cache.ts` absent a new independently reproduced cache defect.

Do not change `src/lib/discovery/hedged-provider.ts` unless a separate concrete defect is reproduced; this task is query-cost remediation, not transport redesign.

Avoid broad changes to `search.ts` unless required by the canonical lifecycle vocabulary already introduced.

---

# Mandatory regression for the diagnosed cost mechanism

Add a deterministic regression that would fail if finite active-key lifecycle acquisition regresses back to broad common-key regex enumeration.

The regression must validate structure, not merely total byte size.

At minimum assert:

- finite active-key/value acquisition uses exact-value/index-selective selectors where semantically equivalent
- broad exact-key/regex-value acquisition is absent for those finite active keys
- arbitrary lifecycle-prefix semantics remain supported where required
- lifecycle predicates still see all required negative representations
- positive query statements remain unchanged
- group count remains unchanged
- mirror count remains unchanged

Do not use only snapshot strings if a structured assertion is practical.

---

# Query-cost acceptance targets

After implementation, measure before vs after using the same benchmark inputs.

Record:

- selectors per group
- QL bytes per group
- active-key carrier selector count
- prefixed-lifecycle selector count
- named-set lifecycle predicate count
- repeated carrier work across groups
- total theoretical carrier selectors across four groups × four mirrors
- construction time
- whether any common-key regex-value acquisition remains
- why each remaining regex is necessary

The remediation is not required to minimize query bytes at all costs. Correctness comes first.

However, it must materially remove the diagnosed common-key enumeration path.

If query text gets slightly larger while index access becomes more selective, that can still be acceptable if justified and measured.

---

# Preserve group independence

Do not casually deduplicate lifecycle carrier acquisition into a single shared prerequisite that would create a common failure point across all groups.

If reuse across groups is proposed, it must preserve:

- independent group coverage
- partial-success behavior
- truthful failed/succeeded group metadata
- cancellation semantics
- bounded deadlines

A simpler per-group exact-value carrier may be preferable to clever shared acquisition.

---

# Checkpoint protocol

Maintain:

`docs/handoffs/active/date-night-live-discovery-resilience-live-timeout-remediation-1-continuation.md`

Checkpoint/push at minimum:

1. starting integrity + before-cost reproduction
2. exact-value/index-selective carrier implementation + focused structural GREEN
3. lifecycle parity + V-DR-02/cache/client/provider preservation GREEN
4. before full validation/build/browser
5. after full deterministic/security/build validation
6. after controlled browser acceptance
7. after bounded live Preview acceptance
8. final immutable candidate freeze

Each save must record:

- branch/base/latest SHA
- changed runtime/test/evidence paths
- query-cost before/after
- lifecycle parity status
- V-DR-02/cache preservation
- remaining gates
- exact next action
- main/production untouched
- Preview identity if any
- SAFE TO RESUME state

---

# Focused validation

After implementation:

1. new cost-mechanism regression
2. lifecycle parity suite
3. query-plan suite
4. seasonal/lifecycle suite
5. partial-results suite
6. cache suite
7. client/session lifecycle suite
8. hedge/provider deadline suites
9. TanStack security suite
10. typecheck
11. changed-code lint
12. `git diff --check`

Retain the current 673-pass baseline expectation only as history. Report actual counts.

---

# Full validation

After focused gates pass:

1. clean no-migration dependency install
2. `npm ls --all`
3. `npm run typecheck`
4. full `npm test` in a loopback-capable environment
5. changed-code lint
6. `git diff --check`
7. compiled TanStack security
8. casino invariants
9. Android structural/icon checks
10. relevant Python native verifier
11. migration-free auth-enabled production build
12. build proof capture/complete/verify
13. protected-scope sanity
14. secret/generated-junk scan
15. final clean worktree

Never run migration-chaining `npm run build`.

If a restricted runner hits EPERM or loopback limitations, preserve the environmental failure and rerun unchanged in a capable runner.

---

# Controlled browser acceptance

Only after deterministic/build/security gates pass:

Run the four established controlled browser scenarios:

1. second mirror wins
2. third mirror wins
3. partial groups
4. all groups stall

Confirm:

- bounded loading
- truthful live/partial/fallback disclosure
- expected loser cancellation
- Open Now no-refetch
- no page errors
- no horizontal/mobile overflow
- zero public-provider calls from controlled harness

---

# Bounded live Preview acceptance

Only after controlled browser passes.

Use a non-production Preview tied exactly to the new remediation checkpoint/candidate.

Public-provider budget:

- one 15-mile Anything acquisition first
- STOP if all groups fail with the historical timeout signature
- if the 15-mile canary succeeds cleanly, verify local subset/filter reuse
- then one 50-mile Anything acquisition
- then complete the established 12-row matrix using no more than those two successful discovery RPCs

Do not hammer providers.

Counts are observations, not invariants.

Verify:

- all groups settle truthfully
- valid-empty/nonempty/partial state is correct
- Corn/Pumpkin subset consistency
- no lifecycle-only leakage
- Open Now/mood/favorites/Fewer Parks reuse
- no page errors
- no overflow
- no material provider-runtime regression

If the first 15-mile canary fails again, STOP. Do not immediately introduce another speculative rewrite.

---

# Evidence

Create separate evidence:

- `audit/date-night-live-discovery-resilience-live-timeout-remediation-1-2026-10-03.md`
- `audit/date-night-live-discovery-resilience-live-timeout-remediation-1-2026-10-03.json`
- `audit/date-night-live-discovery-resilience-live-timeout-remediation-1-evidence/`

Record:

- starting incomplete checkpoint identity
- diagnosis authority/result
- before-cost reproduction
- active-key registry analysis
- exact implementation design
- structural cost regression
- before/after query metrics
- lifecycle parity preservation
- V-DR-02/cache preservation
- focused/full validation
- browser acceptance
- bounded live acceptance
- runtime scope
- privacy/protected-scope review
- final SHA/tree/sole parent
- main/production preservation

Do not overwrite prior diagnosis or remediation-2 evidence.

---

# Final freeze

If and only if:

- diagnosed common-key regex enumeration is materially removed
- lifecycle parity remains complete
- all deterministic/security/build gates pass
- V-DR-02 remains preserved
- controlled browser 4/4 passes
- bounded live 15/50 acceptance passes within the established two-RPC model
- no new blocker appears

then:

1. review diff against `e8730f7e...`
2. confirm only authorized query-cost remediation/tests/evidence changed
3. freeze new immutable candidate
4. push
5. report exact SHA/tree/sole parent
6. verify clean worktree
7. verify main/production untouched
8. STOP for fresh independent reverification

Do not promote.

Success state:

`DATE NIGHT LIVE DISCOVERY RESILIENCE LIVE TIMEOUT REMEDIATED — AWAITING INDEPENDENT REVERIFICATION`

Failure/incomplete state:

`DATE NIGHT LIVE DISCOVERY RESILIENCE LIVE TIMEOUT REMEDIATION INCOMPLETE — REVIEW REQUIRED`

---

# First action

Start from `e8730f7e44ba48a78a3335657190f7e5aaf82d7b`.

Reproduce the diagnosed common-key regex-value carrier structure locally without public-provider requests.

Audit the finite active-key value registry.

Then implement the narrowest index-selective exact-value acquisition that preserves all lifecycle semantics and group independence.
