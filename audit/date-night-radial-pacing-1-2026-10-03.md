# Date Night Radial Pacing #1 — 2026-10-03

**DATE NIGHT RADIAL PACING IMPLEMENTED — AWAITING INDEPENDENT VERIFICATION**

Only scheduler timing changes at runtime. Core remains first and serialized; there is still one active patch RPC. Successful settlement, including successful-empty, uses a nominal 250 ms delay. Degraded/failed settlement retains at least 1,000 ms. A monotonic admission deadline enforces at least 1,000 ms between outer starts and survives timer cancellation, compatible updates, explicit retry and generation replacement. The effective successful wait is `max(250 ms, 1000 ms - elapsed since previous outer start)`.

## Authority and freeze identity

- Authority: `handoff/date-night-radial-pacing-1`, pinned `f9383aa2d4f5156510594657759acb046e1841bc`; full handoff read before executable changes.
- Design handoff: `edb524d2fe49174b217dbcbaf97a1c7edc81608f`; read in full. Both handoff files are retained byte-for-byte.
- Branch: `feature/date-night-radial-pacing-1`, created directly from freshly verified `908510ac25fe5c24335126a0f34ff42fe4d80632`, tree `3211b4df4eccb638a8c492da047eac3b24abb600`.
- Runtime checkpoint: `419687fa16ff51fa9ce1da30f8a7880c0e776887`, tree `776facffbeae431cf89d51a5e8fe31edd82f0b12`, sole parent equal to the immutable base.
- Final tested checkpoint / freeze sole parent: `70e049b47194696910c70cc1f5dd2ae9ba229aec`, tree `07f091c0f7d4953c79af6e96961eb176b921876e`, sole parent `419687fa16ff51fa9ce1da30f8a7880c0e776887`. Its only additional change strengthens the synthetic test's per-patch latency assertions.
- The unique commit adding this report's companion JSON is the final immutable freeze. It changes evidence/continuity only. Resolve its literal SHA/tree externally; do not amend to embed a self hash:

```sh
git log --diff-filter=A --format='%H %T %P' -- audit/date-night-radial-pacing-1-2026-10-03.json
```

Require exactly one introducing commit, sole parent `70e049b47194696910c70cc1f5dd2ae9ba229aec`, matching remote implementation branch, and no runtime/test drift from that parent. The publication receipt supplies literal freeze SHA/tree/parent.

## Changed paths and preserved scope

Runtime: `src/lib/date-night/radial-session.ts` (13 added lines, one replaced line).

Tests:
- `scripts/date-night-radial-pacing.test.mjs`: 19 deterministic cases.
- `scripts/date-night-radial-session.test.mjs`: existing UI assertions retained; delay expectations now honor successful pacing and retry/re-expansion admission.
- `scripts/date-night-cache.test.mjs`: existing radius reuse test now waits for admission; all cache assertions retained.

Runner: `.github/workflows/date-night-radial-pacing.yml`, restricted to this feature branch and relevant executable paths, contents-read permission, disposable localhost browser, no live/production step. Existing workflows and controlled browser harness/preload are byte-identical. Evidence-only finalization does not trigger this workflow.

Geometry (1+4+7+9+11), mirrors, hedges, query semantics, category model, provider timeouts, retry policy, 32-start cap, lifecycle and cache implementations are byte-identical to base. No global semaphore, cache schema, dependencies, auth, database, catalogs, UI, branding, native or Vercel configuration changed. Incomplete core, three-degraded pause, successful-empty authority, cancellation cleanup and late-settlement rejection remain intact. V-DR-01, V-DR-02 and lifecycle negatives retain authoritative coverage.

## Deterministic and compiled validation

| Gate | Result |
| --- | --- |
| Final pacing tests against unchanged base | Meaningful RED: 18 failed, 1 passed |
| Final pacing tests on implementation | 19/19 passed |
| Focused radial/planner/session/cache/search, query plan/cost, lifecycle parity, hedged provider, seasonal, partial results/UI, client lifecycle | 296/296 passed |
| Final full `npm test` | 748 passed: 677 repository + 71 application; 4 inherited skips; zero failures |
| Compiled TanStack security, separately rerun | 14/14 passed; also included in full suite, not additive |
| `npm run typecheck` | Passed |
| ESLint on all four changed executable files | Passed, zero diagnostics |
| Unrestricted `npm run lint` | Exit 1: exactly the same 3 errors and 6 warnings as immutable base |
| Auth-enabled migration-free Vite production build; capture/complete/verify | Passed, final source fingerprint matches hosted browser build |
| Protected scope, diff whitespace and publication integrity | Passed |

Full lint is **not claimed clean**. Exact normalized output matches a fresh detached base checkout. Inherited `no-empty` errors are in `audit/seasonal-discovery-coverage-audit-1-evidence/live-probe.mjs`, `audit/seasonal-discovery-coverage-audit-1-evidence/source-probe.mjs`, and `src/lib/app-data/client.server.ts`. Those files remain untouched; relevant changed-file lint is clean. Four inherited test skips concern unavailable external workspace documentation.

The initial focused run had four obsolete timing expectations, updated without weakening cache/UI behavior. Initial RED/GREEN, the strengthened synthetic RED/GREEN, initial/final full passes, both build proofs and all failure logs are retained losslessly as `validation-logs.zip` in the private downloadable evidence bundle. Focused counts and repeated runs are not added to full totals. Local dependencies were reused with unchanged package/lock; the hosted runner independently performs a clean locked install.

## Required behavior coverage

| Requirement | Direct evidence |
| --- | --- |
| Nominal 250 ms, including successful-empty | Exact 249/250 ms checks after core and slow outer success |
| Minimum outer-start spacing | 0/100/749/750/900 ms latency boundary cases, exact measured starts |
| Degraded delay | Failed, thrown and partial response cases; 999/1000 ms boundary on retry |
| One RPC in flight | Slow unresolved outer request; retained actual-UI serial test |
| Timer cancellation | Dispose and shrink leave zero pending timers |
| Compatible updates cannot burst | Repeated identical updates and 40/50-mile toggles during pending delay |
| Explicit retry | Recent success floor; missing-only failed patch/category; degraded settlement floor |
| Incomplete core | No outer starts or automatic retry; explicit retry requests only missing core category |
| Three degraded pause | Four starts total (core + three outer), zero pending timer or runaway retry |
| 32-start pass cap | Full successful-empty pass; new missing category still blocked at 32 |
| Late abort-ignoring settlement | Shrink/re-expand and generation replacement cannot seed cache or write state |
| Radius increase/decrease | Retained UI/cache tests and paced reacquisition of cancelled work |
| Local-only filters | Actual-UI no-RPC/no-cancel test and unchanged real-browser scenario |
| Historical blockers | Unchanged lifecycle/query/cache tests freshly rerun in focused/full suites |

## Fresh controlled browser acceptance

Final source `70e049b...`: [run 37168371526](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/37168371526), job `111336022002`, **10/10 passed**. A prior run on identical runtime (`419687f...`, run `37168182189`, job `111335462852`) also passed all ten; it is not counted twice.

Scenarios: progressive success, middle failure, outermost failure, stable options, future selections, radius increase, radius decrease, local filters, 320px mobile progress, and all-stall. Every original scenario and assertion remains. Browser routes block every non-local origin and the server preload intercepts/rejects every external fetch. **Zero public-provider calls, zero page errors, zero horizontal overflow.** Pick/Options/Plan stability also passes the retained actual-component tests. No live stress or live provider test was run.

Progress truthfully reaches 20 miles on success, stays at 15 miles with a middle gap, and at 40 miles with the last outer patch failed. The all-stall core asserts no completed radius. Screenshot review confirms the final 320px layout and outermost-failure progress/notice; screenshots and original ZIPs are in the downloadable evidence bundle.

- Final GitHub artifact `11290052228`, SHA-256 `130750aad176236dd565fee1c411cc834f77e191f677d4d7bdda28677075cad5`; downloaded bytes verified.
- Initial artifact `11289953370`, SHA-256 `c57dc1da05ae3eff9539f95c5dd612ec87ce2d16b61523023c0b99ba5cf03a36`; verified and retained.
- Final source fingerprint: `18c93c120639f4ba330a9f78921f74d61301889b0f55ab59610ae5de512f86dc`, 427 inputs, identical locally and on hosted runner. Each output fingerprint independently verifies; cross-build binary equality is not claimed.
- Hosted checkout is shallow, so its `%P` output is empty. Canonical Git/GitHub commit metadata supplies and verifies the sole-parent identities above.
- Local Chromium capability failed before a page opened (`socket() failed: Operation not permitted`); no escalation or sandbox bypass. Authorized branch-scoped hosted validation completed the browser requirement.

## Synthetic timing evidence

The unchanged 50-mile plan has **32 patches: 1 + 4 + 7 + 9 + 11**. With exactly **6 seconds of synthetic successful latency per patch**, the existing model is `32×6 + 31×1 = 223 seconds`; new pacing is `32×6 + 31×0.25 = 199.75 seconds`; modeled saving **23.25 seconds**. The executable test checks every patch's actual simulated start and exact latency, all 32 completions and zero pending timers. Six seconds is **not** a measured provider median or SLA; this does not establish provider capacity or real-world speedup.

Raw-log publication note: automatic approval review rejected uploading the raw log archive to public GitHub because it could contain internal data. The safer completed route retains raw logs and browser screenshots in the private downloadable evidence bundle, while this repository contains reviewed results, source/build proofs, hashes and continuity. No raw archive was uploaded to GitHub.

## Preservation and next action

Fresh remote main remains `4d937e58d2a65567b54ac5271915bc85b498898b`. The approved radial-loading candidate branch remains `908510ac25fe5c24335126a0f34ff42fe4d80632`. Canonical production remains READY `dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL` at main, with the same aliases. No merge, promotion, production deployment, migration or settings mutation occurred. Feature pushes may create ordinary non-production Vercel previews; none was used for provider testing.

Freeze after evidence publication and remote readback. **Next: independent verification of the exact frozen SHA/tree/sole parent, scheduler boundaries, historical invariants, evidence and inherited lint caveat. Do not merge, promote or deploy production.**

SAFE TO RESUME — IMPLEMENTED, AWAITING INDEPENDENT VERIFICATION.
