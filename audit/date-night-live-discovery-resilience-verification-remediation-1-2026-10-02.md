# Pick For Us — Date Night Live Discovery Resilience Verification Remediation #1

**DATE NIGHT LIVE DISCOVERY RESILIENCE VERIFICATION REMEDIATED — AWAITING INDEPENDENT REVERIFICATION.**

Repository: `caleb1234calvin-art/dinner-roulette`  
Instruction date: 2026-10-02  
Validation/freeze date: 2026-10-03 UTC  
Remediation branch: `fix/date-night-live-discovery-resilience-verification-remediation-1`

## Authority and failed candidate

Authoritative remediation handoff:

- branch: `handoff/date-night-live-discovery-resilience-verification-remediation-1`
- commit: `5940e83ff4089a5259bfbcf5f2857310b0858dff`
- path: `docs/handoffs/active/date-night-live-discovery-resilience-verification-remediation-1.md`

Failed immutable candidate retained as failed history:

- SHA: `e84acc471f57dff430f73368390442e585f93637`
- tree: `098458ffbd62234fa4575313d1c6e3d1afd00ec9`
- sole parent: `b7487e8832e6f4a0b8ec5a8352c9db31586324c4`

Frozen production main throughout remediation:

`4d937e58d2a65567b54ac5271915bc85b498898b`

Independent verification failed the original candidate on exactly two reproduced blockers. This remediation began from that failed candidate and did not rewrite it.

## V-DR-01 — cross-category lifecycle resurrection

### Failure

Narrow Corn Maze acquisition could retrieve an active Corn identity while omitting matching terminal lifecycle evidence stored under another supported seasonal tag such as `demolished:attraction=pumpkin_patch`. Broad Anything acquisition still obtained enough negative evidence and excluded the venue, so eligibility depended incorrectly on category selection.

### Fix

Lifecycle-negative acquisition is now category-independent and bounded while affirmative acquisition remains category-aware and narrow. Shared supported lifecycle companions remain reachable so terminal/disused identity evidence can win during merge even when the positive selection is a different category.

The fix does not broaden affirmative classification, add catalog venues, change provider order, alter deadlines or special-case the verifier fixture.

### Evidence

The verifier counterexamples were added first and preserved RED. After the runtime correction:

- query/lifecycle: **32/32 PASS**
- seasonal/component/lifecycle: **24/24 PASS**
- partial results: **12/12 PASS**
- typecheck/lint: PASS
- positive semantic fixture matrix: **6,167 comparisons retained**

The full seasonal query remains bounded; positive clauses remain selected-category-specific.

## V-DR-02 — superseded cache coverage after eviction

### Failure

An older Anything entry containing Corn + Movies could survive while a newer valid-empty Corn result superseded Corn. Reads could keep the old Anything entry LRU-hot; if cache pressure evicted the newer empty entry, the old Corn snapshot again became a complete cache hit without refetch.

### Fix

On successful admission, newly covered categories are removed from older compatible same-signature cache coverage before ordinary LRU/aggregate eviction. Supersession therefore survives eviction of the newer entry. Unrelated still-valid category coverage remains reusable; raw identity/evidence and lifecycle-negative evidence remain preserved within their existing TTL/eviction bounds.

No tombstone collection, pinned entry or unbounded memory was introduced. Conservative refetch is preferred over stale resurrection.

### Evidence

The eviction counterexamples were added first and preserved RED. After the runtime correction:

- cache: **46/46 PASS**
- client lifecycle: **54/54 PASS**
- typecheck/lint/diff check: PASS

Coverage includes max-entry and aggregate-venue eviction, equal/increasing timestamps, TTL, radius boundaries, unrelated-category reuse and component-session lifetime.

## Runtime scope

From failed candidate to validated remediation, runtime changes are limited to:

- `src/lib/date-night/provider-evidence.ts`
- `src/lib/date-night/query-plan.ts`
- `src/lib/date-night/cache.ts`

Supporting changes are permanent regression tests, compiled/security fixture adaptations required by the broader lifecycle-negative query shape, controlled/live browser fixture support, and separate remediation evidence/continuity.

Unchanged product boundaries include provider list, 0/1.5/3/4.5s hedge schedule, 8s attempt cap, 20s provider deadline, 25s client watchdog, saved catalogs, Dinner, Nightlife, casino data, package/lockfile, auth/database, Vercel configuration and Android/native product behavior.

## Full validation

Validated checkpoint:

`32e00be55c2cff6a5528d8a506d9dc3b1058821d`

Validation results:

- **641 JavaScript PASS = 570 repository + 71 application**
- **4 inherited skips**
- **0 failures**
- compiled TanStack security: **14 PASS**
- focused query: **32 PASS**
- seasonal: **24 PASS**
- cache: **46 PASS**
- partial results: **12 PASS**
- partial UI: **2 PASS**
- client lifecycle: **54 PASS**
- hedged provider: **19 PASS**
- provider deadlines: **41 PASS**
- typecheck: PASS
- changed-code lint: PASS
- `git diff --check`: PASS
- `npm ls --all`: PASS
- casino invariants: **883 canonical / 899 serialized / 60 catalogs**
- Android structural/icon checks: **15 launcher resources / 4 web icons**
- Python native verifier: **3/3 PASS**
- protected-scope/secret/generated-junk review: PASS
- auth-enabled migration-free production build/proof: PASS

No migration-chaining `npm run build` was used.

Build proof:

- source SHA-256: `e4bda69121b000a0a6f89dbd119c53a68c7a5756b5db6fc06c0e2cadce157cad`
- output SHA-256: `1af3eb20a0674cc21d9247af9f6b86256c82213acfa7161dea45bc80f659f270`

## Controlled browser acceptance

All four real-browser/TanStack-RPC controlled scenarios passed:

| Scenario | Provider duration | Result |
|---|---:|---|
| second mirror wins | 1,582ms | merged; loser cancelled |
| third mirror wins | 3,091ms | merged; two losers cancelled |
| partial groups | 12,508ms | merged; truthful partial |
| all groups stall | 12,504ms | fallback; bounded attempts |

Each passed bounded loading, source/partial/fallback disclosure, expected cancellation, Open Now no-refetch and mobile no-overflow checks. The controlled harness made no public-provider calls.

## Real Preview acceptance

Accepted validated Preview:

- deployment: `dpl_2StAVNmaECY6k3HKiaeXdTyFoQVv`
- URL: `https://dinner-roulette-4kk3544xy-minions-9e2c.vercel.app`
- state: READY
- target: non-production
- exact commit: `32e00be55c2cff6a5528d8a506d9dc3b1058821d`

The full 12-row Carthage-centered 15/50-mile matrix passed with **exactly two discovery RPCs**.

Observed—not invariant—results:

- 15 miles: 45 live identities; seasonal valid-empty; all four groups successful
- 50 miles: 235 live identities; seasonal nonempty with one observed Corn Maze; all four groups successful
- Anything RPCs: 4,227ms / 7,842ms
- all covered seasonal subsets and Open Now/mood/favorites/Fewer Parks controls: 0 additional RPCs
- no page/harness errors

Hosted summaries recorded seasonal 2,798ms at 15 miles and 6,470ms at 50 miles, with provider aggregates 4,060ms / 7,518ms. The two observations do not justify a deadline change.

A normal disposable Chromium attempt hit `ERR_CERT_AUTHORITY_INVALID` before discovery. The accepted run used the existing explicit test-only HTTPS-error tolerance. Application/Vercel TLS settings were unchanged.

## Preservation and finalization

The validation evidence reports:

- 888 failed-candidate files protected unchanged where outside remediation scope
- all 454 prior production-protected paths unchanged
- zero secret/generated-junk/out-of-scope findings
- dependency graph valid
- package/lock unchanged
- no native/config mutation
- no database migration

After full validation, checkpoint `444a68dd17e058e11778f805311a768986481c0c` added evidence/continuity only. Its tree is `892f33c418d071d06f90c4e52f9f913667a38283`; its sole parent is `32e00be55c2cff6a5528d8a506d9dc3b1058821d`.

A Git-created non-production evidence-only Preview is READY at exact checkpoint `444a68dd...`:

`dpl_7QHUdUNmBVAtJqcEkfR8zgiM7TUi`

Production remains READY at:

- deployment `dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL`
- SHA `4d937e58d2a65567b54ac5271915bc85b498898b`
- target production

No merge, promotion, manual production deployment, Vercel settings mutation or migration occurred.

## Immutable candidate identity

The final immutable candidate is the unique commit introducing:

`audit/date-night-live-discovery-resilience-verification-remediation-1-2026-10-02.json`

Its sole parent is:

`444a68dd17e058e11778f805311a768986481c0c`

A Git commit/tree cannot embed its own final hash. Resolve literal identity after publication without amending:

```sh
git log --diff-filter=A --format=%H -- audit/date-night-live-discovery-resilience-verification-remediation-1-2026-10-02.json
git show -s --format='%H %T %P' <resolved-candidate>
```

## Next action

**STOP for a fresh independent reverification of the exact final SHA/tree/sole parent.**

This report does not authorize merge, main update, promotion, production deployment, migration, signing or publication.

**DATE NIGHT LIVE DISCOVERY RESILIENCE VERIFICATION REMEDIATED — AWAITING INDEPENDENT REVERIFICATION**
