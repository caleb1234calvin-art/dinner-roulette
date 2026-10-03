# Pick For Us — Date Night Live Discovery Resilience — Independent Reverification 2 (Codex trial)

Repository: `caleb1234calvin-art/dinner-roulette`

Instruction branch:
`handoff/date-night-live-discovery-resilience-reverification-2`

Immutable verification target:
`4e6ff124960d77be0c454ccfa0401c8a1ced35a1`

Expected tree:
`a8abffa67584e64e03b37300967319b8e49f9c61`

Expected sole parent:
`444a68dd17e058e11778f805311a768986481c0c`

Failed prior candidate:
`e84acc471f57dff430f73368390442e585f93637`

Frozen production main:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Exact final-candidate non-production Preview:
- deployment: `dpl_8CSatt7zTHw4PcHvap1BML8fAXki`
- URL: `https://dinner-roulette-ds8myv1dd-minions-9e2c.vercel.app`
- expected state: READY
- expected target: non-production/null
- expected SHA: `4e6ff124960d77be0c454ccfa0401c8a1ced35a1`

Remediation state:
`DATE NIGHT LIVE DISCOVERY RESILIENCE VERIFICATION REMEDIATED — AWAITING INDEPENDENT REVERIFICATION`

---

## Mission

Perform a fresh, independent, READ-ONLY reverification of the immutable candidate above.

This is intentionally a fresh verifier after the original candidate failed independent verification and a separate remediation closed the two reproduced blockers.

Do not trust the remediation worker's evidence merely because it is detailed. Treat it as a set of claims to falsify or confirm independently.

If any material blocker is found, preserve the exact evidence, report it, and STOP. Do not repair it.

This task is suitable for Codex, but the verification standard is repository/process based rather than model based. Do not weaken independence because the handoff names Codex.

---

## Hard prohibitions

DO NOT:

- modify tracked source, tests, evidence, handoffs or documentation
- commit
- push
- merge
- update any branch
- update main
- deploy/redeploy
- change Vercel settings
- run migrations
- alter provider configuration
- alter package/lock state
- publish Android/Play artifacts
- repair any finding

Use a fresh checkout/worktree pinned to the immutable target SHA.

The instruction branch exists only to deliver this document. Do NOT verify its handoff commit as the product candidate.

Temporary scratch work is permitted only outside the repository (for example `/tmp`) and must not become repository state. The repository must end clean.

Never run migration-chaining `npm run build`.

---

## Required reading

Read IN FULL before the final verdict:

1. original Date Night resilience handoff on its instruction branch:
   `docs/handoffs/active/date-night-live-discovery-resilience-1.md`
2. original resilience continuation:
   `docs/handoffs/active/date-night-live-discovery-resilience-1-continuation.md`
3. original independent verification handoff:
   `docs/handoffs/active/date-night-live-discovery-resilience-1-verification.md`
4. verification-remediation authority on:
   branch `handoff/date-night-live-discovery-resilience-verification-remediation-1`
   path `docs/handoffs/active/date-night-live-discovery-resilience-verification-remediation-1.md`
5. remediation continuation:
   `docs/handoffs/active/date-night-live-discovery-resilience-verification-remediation-1-continuation.md`
6. final remediation report:
   `audit/date-night-live-discovery-resilience-verification-remediation-1-2026-10-02.md`
7. final remediation JSON:
   `audit/date-night-live-discovery-resilience-verification-remediation-1-2026-10-02.json`
8. relevant retained RED/GREEN evidence
9. current top `AI_CONTINUITY.md`
10. every changed runtime path and directly relevant tests

Treat the original handoffs as scope authority. Treat all reports/evidence as claims requiring independent proof.

---

## Checkpoint integrity — verify before behavior

Freshly fetch refs and prove:

- target SHA exactly `4e6ff124960d77be0c454ccfa0401c8a1ced35a1`
- tree exactly `a8abffa67584e64e03b37300967319b8e49f9c61`
- sole parent exactly `444a68dd17e058e11778f805311a768986481c0c`
- candidate ancestry is linear from the frozen production base
- candidate is expected to be 28 commits ahead / 0 behind frozen main; report actual fresh result
- failed candidate `e84acc...` remains preserved as failed history
- final candidate differs from validated executable checkpoint `32e00be55c2cff6a5528d8a506d9dc3b1058821d` only by later evidence/continuity/freeze material as claimed
- main is still `4d937e58...` or report movement
- clean detached/fresh checkout

Do not silently verify a branch head or later commit.

---

# Critical blocker reverification

The original independent verifier found TWO genuine blockers. Reverify both independently first.

## V-DR-01 — cross-category lifecycle resurrection

Original failure:

A Corn-only query could retrieve an active Corn identity while omitting matching terminal lifecycle evidence represented under another supported category, such as `demolished:attraction=pumpkin_patch`. Broad Anything excluded the venue; narrow Corn resurrected it.

Claimed remediation:

Lifecycle-negative acquisition is category-independent and bounded while affirmative acquisition remains selected-category-aware and narrow.

Independently verify:

1. active Corn identity + matching Pumpkin-tagged demolition/permanent closure
2. reverse supported cross-category representations where practical
3. Corn-only cannot resurrect it
4. Pumpkin-only cannot resurrect it where the positive identity is otherwise reachable
5. mixed/Anything remain excluded
6. result order/provider order cannot defeat terminal lifecycle precedence
7. unrelated lifecycle-negative identities do not leak into positive results
8. affirmative clauses remain selected-category-specific
9. generic farm/park/maze context still does not become a positive seasonal result without required evidence
10. ordinary supported Date Night categories receive equivalent lifecycle protection where identity representations can cross category boundaries
11. bounded query size/runtime remains credible; no retry/provider/deadline broadening

Do not merely rerun the permanent test and declare success. Construct at least one fresh independent counterexample/probe using real query-builder/handler behavior. It may be executed from temporary scratch outside the repository.

## V-DR-02 — superseded cache coverage after eviction

Original failure sequence:

1. older Anything contains Corn + Movies
2. newer successful valid-empty Corn supersedes Corn
3. unrelated Movies reads keep older Anything LRU-hot
4. cache pressure evicts newer empty Corn record
5. Corn incorrectly returns the old venue as a complete cache hit without refetch

Claimed remediation:

Successful admission removes newly covered categories from older compatible same-signature cache coverage before normal eviction. Unrelated valid coverage/raw identity/lifecycle evidence remains bounded and reusable.

Independently verify the exact resurrection attack plus variants:

- increasing timestamps
- equal timestamps
- maxEntries eviction
- aggregate/max raw-venue eviction
- radius narrowing/widening
- TTL
- same location/season/semantic signature
- unrelated Movies coverage remains reusable
- valid-empty supersession does not erase truthful raw identity/classification/evidence needed by another valid category
- failed/fallback/cancelled/late data cannot establish supersession
- component/session teardown clears cache
- after newer Corn coverage is gone, old superseded Corn must NOT silently become authoritative; conservative refetch is acceptable

Again, create at least one independent probe rather than relying only on committed regression tests.

If either blocker reproduces on the final candidate, verification FAILS immediately after preserving enough evidence to explain it.

---

# Preserved Date Night resilience architecture

If both blocker attacks hold, independently verify the larger architecture was not damaged.

## Hedged provider execution

Date Night only should retain approximately:

- mirror 1: 0 ms
- mirror 2: 1,500 ms
- mirror 3: 3,000 ms
- mirror 4: 4,500 ms

Verify:

- valid empty and valid nonempty can win a group
- losing requests abort
- late losers cannot mutate accepted state
- hard failure advances promptly
- header/body/abort-ignoring stalls stay bounded
- maximum remains 4 groups × 4 mirrors
- no retry storm
- 8s attempt bound retained
- 20s provider ceiling retained
- 25s client watchdog retained
- Dinner/Nightlife retain their prior behavior

Freshly exercise second-mirror, third-mirror, partial and all-stall behavior.

## Query planning/security

Verify server-owned groups remain:

- seasonal
- entertainment
- culture/screen
- outdoor

Confirm:

- hostile/unknown category input rejected
- arbitrary Overpass injection impossible through activity input
- positive seasonal classification semantics preserved
- corn/maize evidence requirements preserved
- generic maze rejection preserved
- lifecycle-negative precedence preserved
- shared negative companions do not turn the positive query back into an unbounded monolith

## Partial results

Verify:

- one failed group cannot erase successful siblings
- valid-empty is successful coverage
- duplicates dedupe deterministically
- category/evidence union survives merge
- partial/source disclosure is truthful
- only complete live failure falls back/errors according to established policy

## Cache/reuse

Besides V-DR-02, verify:

- Anything → covered subset reuses cache
- only missing groups are acquired
- 50-mile may satisfy 15-mile; 15-mile must not falsely satisfy 50-mile
- Open Now, mood, favorites and Fewer Parks are local/no-refetch
- current-time eligibility is recomputed outside cached acquisition state
- location/season/TTL invalidation works
- failed/fallback/late/cancelled responses do not create successful coverage

---

# Fresh deterministic validation

Use the established no-migration install/build procedures.

At minimum run:

- clean dependency install using repository-approved no-migration procedure
- `npm ls --all`
- `npm run typecheck`
- `npm test`
- changed-code lint
- `git diff --check`
- casino invariants
- Android structural/icon checks
- relevant Python native verifier
- migration-free auth-enabled production build/proof
- compiled TanStack security suite
- protected-scope/secret/generated-junk sanity
- final clean checkout/worktree check

Expected claim to confirm independently:

- **641 JavaScript PASS = 570 repository + 71 application**
- **4 inherited skips**
- **0 failures**
- compiled security **14 PASS**
- query **32**
- seasonal **24**
- cache **46**
- partial **12**
- partial UI **2**
- client lifecycle **54**
- hedged provider **19**
- provider deadlines **41**
- casino **883 canonical / 899 serialized / 60 catalogs**
- Android **15 launcher / 4 web icons**
- Python **3/3**

Do not inflate totals by double-counting focused suites.

If the runner cannot support loopback/browser behavior, preserve the environmental failure and rerun unchanged in a capable environment. Do not weaken tests.

---

# Browser acceptance

After deterministic/build gates are clean, freshly run the four controlled real-browser/TanStack-RPC scenarios:

1. second mirror wins
2. third mirror wins
3. partial groups
4. all groups stall

Confirm:

- bounded spinner/loading
- truthful live/partial/fallback disclosure
- expected cancellation
- Open Now no-refetch
- no page errors
- no horizontal/mobile overflow

Controlled harness must not hit public providers.

---

# Bounded exact-candidate Preview acceptance

Freshly verify the exact final candidate Preview identity before using it:

`dpl_8CSatt7zTHw4PcHvap1BML8fAXki`

`https://dinner-roulette-ds8myv1dd-minions-9e2c.vercel.app`

Expected:

- READY
- target null/non-production
- exact SHA `4e6ff124960d77be0c454ccfa0401c8a1ced35a1`

Only if deterministic/browser gates pass, perform bounded real acceptance.

Do NOT hammer public providers.

Preferred maximum acquisition pattern:

- one 15-mile Anything acquisition
- local covered subset/filter checks
- one 50-mile Anything acquisition
- local covered subset/filter checks

The full local matrix may be exercised from those two acquisitions if cache coverage allows it.

Prior observed venue counts are NOT invariants and must not determine pass/fail.

Verify instead:

- responses settle within established deadlines
- truthful group/source/partial state
- subset reuse does not create extra provider RPCs when coverage exists
- Corn Maze subset behavior is consistent with returned evidence
- no blocker appears from the broadened lifecycle-negative query shape
- no page/harness errors

If the disposable browser hits `ERR_CERT_AUTHORITY_INVALID`, preserve that fact. Existing explicit test-only HTTPS-error tolerance may be used for acceptance, but do not alter application or Vercel TLS settings.

---

# Preservation, privacy and production boundary

Independently confirm:

- runtime remediation from failed candidate is restricted to:
  - `src/lib/date-night/provider-evidence.ts`
  - `src/lib/date-night/query-plan.ts`
  - `src/lib/date-night/cache.ts`
- other differences are authorized regression/harness/evidence/continuity material
- provider list unchanged
- 0/1.5/3/4.5s hedge schedule unchanged
- 8s/20s/25s deadlines unchanged
- Dinner unchanged
- Nightlife unchanged
- saved catalogs unchanged
- package/lock unchanged
- auth/database unchanged
- Vercel configuration unchanged
- Android/native product behavior unchanged
- no secret/credential/generated junk added
- production logs remain privacy-conscious
- no precise coordinates/addresses/query bodies/raw exceptions/personal identifiers are newly emitted

Before verdict, fresh-check:

- main state
- production deployment/SHA
- exact candidate Preview state
- verification caused no mutation

This task authorizes NO promotion.

---

# Required verdict

End with exactly one state:

`DATE NIGHT LIVE DISCOVERY RESILIENCE REVERIFIED — CONTROLLED PROMOTION CANDIDATE READY`

or

`DATE NIGHT LIVE DISCOVERY RESILIENCE REVERIFICATION FAILED`

Use REVERIFIED only if checkpoint integrity, both historical blocker attacks, broader architecture, fresh deterministic/security/build validation, controlled browser acceptance, bounded exact-candidate Preview acceptance, preservation/privacy and production boundaries all hold with no new merge blocker.

If any material blocker exists, use FAILED, explain it precisely and STOP WITHOUT FIXING.

---

# Final report format

Report concisely but with enough evidence to audit:

1. target SHA/tree/sole parent
2. ancestry/main/production state
3. exact runtime remediation scope
4. V-DR-01 independent attack result
5. V-DR-02 independent attack result
6. hedging/query/security/partial/cache results
7. test/typecheck/lint/build totals
8. casino/Android/Python preservation
9. controlled browser result
10. exact-candidate Preview identity
11. bounded real Preview result and actual RPC count
12. privacy/evidence consistency
13. limitations/environmental caveats
14. any new blockers
15. exact final reverification state

Stop after the verdict. Do not repair or promote.
