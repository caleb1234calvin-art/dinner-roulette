# Pick For Us — Date Night Live Discovery Resilience — Independent Verification 1

Repository: `caleb1234calvin-art/dinner-roulette`

Verification instruction branch:
`handoff/date-night-live-discovery-resilience-verification-1`

Immutable verification target:
`e84acc471f57dff430f73368390442e585f93637`

Expected tree:
`098458ffbd62234fa4575313d1c6e3d1afd00ec9`

Expected sole parent:
`b7487e8832e6f4a0b8ec5a8352c9db31586324c4`

Frozen production main:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Verified non-production candidate Preview:
`dpl_FR6Dgar5E2MCD15t4LFD76f66iz1`
`https://dinner-roulette-3tkgvbhr9-minions-9e2c.vercel.app`

Implementation state:
`DATE NIGHT LIVE DISCOVERY RESILIENCE REMEDIATED — AWAITING INDEPENDENT VERIFICATION`

---

## Mission

Perform a fresh, independent, READ-ONLY verification of the immutable candidate above.

Do not trust the implementation worker's conclusions merely because they are recorded in evidence.

Use Git state, source, tests, build output, browser behavior and retained evidence to determine whether the remediation is genuinely ready for controlled promotion.

If verification fails, preserve the failure and stop. Do not fix it.

---

## Hard prohibitions

DO NOT:

- modify source, tests, evidence or documentation
- commit
- push
- merge
- update main
- deploy or redeploy
- change Vercel settings
- run migrations
- alter provider configuration
- publish Android/Play artifacts
- repair findings

Use a clean detached/fresh checkout pinned to the immutable target SHA.

The verification instruction branch exists only to deliver this document. Do not verify its later documentation commit as the product candidate.

---

## Required reading

Read IN FULL before concluding:

1. `docs/handoffs/active/date-night-live-discovery-resilience-1.md`
2. `docs/handoffs/active/date-night-live-discovery-resilience-1-continuation.md`
3. `audit/date-night-live-discovery-resilience-1-2026-10-02.md`
4. `audit/date-night-live-discovery-resilience-1-2026-10-02.json`
5. relevant production-loading-hang remediation/audit
6. relevant seasonal/V-F03 lifecycle remediation evidence
7. current top `AI_CONTINUITY.md`
8. all changed runtime paths and focused tests

Treat the original handoff as scope authority.
Treat the final remediation reports as claims requiring independent proof.

---

## Checkpoint integrity

Before running tests:

- fetch fresh refs
- verify target SHA exactly
- verify tree exactly
- verify sole parent exactly
- verify target is 22 commits ahead and 0 behind frozen main
- verify frozen main remains `4d937e58...` or report movement
- verify candidate ancestry is linear from frozen base
- verify final candidate differs from the last tested executable checkpoint only by evidence/continuity as claimed
- verify clean detached/fresh checkout

Do not silently verify a later branch head.

---

## Scope review

Independently inspect the base→candidate diff.

Confirm the actual runtime scope is limited to Date Night discovery resilience and required support code/tests:

- Date Night hedged provider execution
- query planning/decomposition
- partial live-result preservation
- bounded session cache/reuse
- Date Night identity merge support
- source/coverage metadata
- focused test/browser harnesses
- evidence/continuity

Confirm there is no unrelated behavioral change to:

- Dinner
- Nightlife
- casino catalogs
- saved Date Night catalogs
- auth/database
- package/lock dependencies
- Vercel configuration
- Android/native product behavior
- branding/domain/PWA work

Flag any unexpected executable drift.

---

## Core behavior to verify independently

### 1. Hedged providers

Verify Date Night only uses bounded hedging while Dinner/Nightlife retain their prior serial helper.

Expected Date Night mirror starts are approximately:

- 0 ms
- 1,500 ms
- 3,000 ms
- 4,500 ms

Verify:

- first valid empty or nonempty response wins a group
- losing requests abort
- late losers cannot mutate accepted data
- immediate hard failure advances promptly
- header/body/abort-ignoring stalls remain bounded
- at most 4 groups × 4 mirrors
- no retry storm
- 8s attempt limit retained
- 20s absolute provider ceiling retained
- 25s client watchdog retained

Freshly prove second/third/fourth mirror opportunity and all-stall bounds.

### 2. Query decomposition and validation

Verify server-owned groups:

- seasonal
- entertainment
- culture/screen
- outdoor

Confirm selected categories generate only relevant whitelisted clauses and cannot inject arbitrary Overpass text.

Verify current seasonal classification/lifecycle semantics remain intact, including:

- corn/maize evidence requirements
- generic maze rejection
- negative/historical prose rejection
- lifecycle negative companions
- no generic farm/park leakage from the named context set

Inspect the retained 6,167 semantic comparison claim and independently spot-check the actual assertions.

### 3. Partial results

Verify one failed group cannot erase successful siblings.

Verify:

- valid empty is success
- successful groups merge normally
- duplicate identities across groups dedupe correctly
- category/evidence unions survive
- partial warning/disclosure is truthful
- complete failure alone becomes saved fallback or existing terminal error

### 4. Cache/reuse

Inspect the final equal-timestamp freshness correction carefully.

Freshly exercise the fixed-clock regression:

- older Anything result
- newer valid-empty Corn result at equal timestamp
- unrelated Movies read
- Corn must remain empty

Verify immutable admission ordering controls freshness ties and mutable LRU state controls eviction only.

Also prove:

- Anything → subset reuses coverage
- missing groups only are fetched
- 50-mile coverage may satisfy 15-mile, not the reverse
- Open Now, mood, favorites and Fewer Parks do not refetch
- TTL and location/season invalidation work
- fallback/failed/late/cancelled data do not establish coverage
- current-time eligibility remains recomputed outside cache

---

## Fresh validation

Run the repository's authoritative commands in an environment that supports required loopback/browser behavior.

At minimum:

- clean dependency install using the established no-migration procedure
- `npm ls --all`
- `npm run typecheck`
- `npm test`
- changed-code lint
- `git diff --check`
- casino invariants
- Android structural/icon checks
- relevant Python native tests
- migration-free auth-enabled production build
- build proof verification
- secret/generated-junk sanity
- final clean checkout

Expected full-suite claim to independently confirm:

- 611 JavaScript passes
- 540 repository + 71 application
- 4 inherited skips
- 0 failures

Do not count focused suites again as additional tests.

If the restricted runner reproduces loopback EPERM, preserve that result and rerun unchanged in a loopback-capable environment. Do not weaken tests.

---

## Browser verification

Freshly run the four controlled browser scenarios against the verified build:

1. second mirror wins
2. third mirror wins
3. partial groups
4. all groups stall

Confirm:

- bounded spinner
- correct source/fallback/partial disclosure
- loser cancellation where expected
- no Open Now refetch
- no page errors
- no horizontal overflow

Then, only if deterministic/build gates are clean, use the existing non-production Preview for a bounded real acceptance check.

Do NOT hammer public providers.

One 15-mile Anything acquisition and one 50-mile Anything acquisition are enough if cache/subset behavior is then verified locally.

Expected prior observations are claims, not fixed-count requirements:

- all four groups returned valid responses at both radii
- 15-mile seasonal was valid-empty
- 50-mile seasonal was nonempty and included a live Corn Maze identity
- the full 12-row matrix required only two discovery RPCs

Counts are provider-dependent and must not be used as immutable pass criteria.

---

## Security / privacy / preservation

Verify:

- hostile category input rejected server-side
- TanStack RPC signal/deadline path remains valid
- no arbitrary query injection
- no precise coordinates/addresses/query bodies/raw exceptions/personal identifiers in production logs
- retained evidence/privacy claims are materially accurate
- protected files remain unchanged
- no credentials/secrets/generated junk added

The disposable browser HTTPS-ignore flag is acceptable only as test-environment evidence. Do not interpret it as application/Vercel TLS modification or normal-browser certification.

---

## Main and production boundary

Confirm fresh state before final verdict:

- main is still frozen unless externally moved
- production remains unchanged from the frozen base unless externally moved
- verification itself performed no merge/promotion/deployment/migration

This task does NOT authorize promotion.

---

## Verification outcome

End with exactly one:

`DATE NIGHT LIVE DISCOVERY RESILIENCE VERIFIED — CONTROLLED PROMOTION CANDIDATE READY`

or

`DATE NIGHT LIVE DISCOVERY RESILIENCE VERIFICATION FAILED`

Use VERIFIED only if:

- checkpoint integrity holds
- scope is correct
- hedging/query/partial/cache behavior independently holds
- fresh deterministic/security/build validation passes
- controlled browser scenarios pass
- bounded real Preview acceptance does not expose a blocker
- no new merge blocker is found
- evidence is materially consistent with fresh results

If verification fails, report exact findings and STOP. Do not repair.

---

## Final report

Report concisely:

1. target SHA/tree/sole parent
2. current main state
3. exact runtime scope
4. hedging result
5. query/security result
6. partial-result result
7. cache/freshness result
8. test/typecheck/lint/build totals
9. casino/Android/Python preservation
10. controlled browser result
11. bounded real Preview result
12. privacy/evidence consistency
13. any limitations/new blockers
14. final verification state

Stop after verification.
