# Date Night live discovery resilience — live timeout remediation 1

**DATE NIGHT LIVE DISCOVERY RESILIENCE LIVE TIMEOUT REMEDIATION INCOMPLETE — REVIEW REQUIRED**

The diagnosed common-key regex-value carrier acquisition has been removed for all 23 finite active key/value pairs. Deterministic lifecycle parity, V-DR-02, full validation and controlled browser acceptance pass. Bounded live acceptance does not: the 15-mile acquisition succeeded in all four groups, but the single 50-mile acquisition failed in all four groups. Exactly two discovery RPCs were forwarded. Work stopped without another provider attempt or speculative runtime change. No successful candidate was frozen, promoted or merged.

## Authority, integrity and checkpoint identity

- Repository: `caleb1234calvin-art/dinner-roulette`.
- Controlling handoff: `docs/handoffs/active/date-night-live-discovery-resilience-live-timeout-remediation-1.md`, instruction branch `handoff/date-night-live-discovery-resilience-live-timeout-remediation-1`, commit `67e91ca0839760ce77e07706d69d5093c38352cb`. Read in full before executable changes.
- Implementation branch: `fix/date-night-live-discovery-resilience-live-timeout-remediation-1`, created directly from `e8730f7e44ba48a78a3335657190f7e5aaf82d7b`.
- Verified base tree: `50a412de4e6ef656ce0f7c8b8e4a39fb720b9e20`; verified sole parent: `08893d73a5e22674d4f9fccbdf04599cdd2c6f25`.
- Latest pushed checkpoint before this final evidence save: `8e67d959f5b19cb00c22533a6eb27a1b2e1bfb2f`, tree `33d88539f4d4bffc0dfddcaa3f2fdd6216788a4f`, sole parent `4a321e5ec84dd2b1d196f6c6220ea35337ea775c`.
- The final INCOMPLETE checkpoint is the unique commit introducing this report's sibling JSON. Resolve its exact immutable SHA/tree/sole parent with the command below; do not amend a commit to insert its own hash. Its sole parent must be the latest pushed checkpoint above. This is an evidence checkpoint, not a successful remediation candidate.

```sh
git log --diff-filter=A --format='%H %T %P' -- audit/date-night-live-discovery-resilience-live-timeout-remediation-1-2026-10-03.json
```

Fresh refs, clean starting worktree and linear ancestry were verified. The diagnosis handoff/report/archive, remediation-2 handoff/continuation/final evidence, lifecycle/query/provider source, relevant tests and top continuity were read. Offline before-cost reproduction and the finite registry audit preceded the implementation. Prior diagnosis/remediation evidence is unchanged. Checkpoints 1–7 were pushed sequentially; this final evidence save records the blocked freeze gate. The continuation contains each resumable state and next action.

## Narrow implementation and permanent structural regression

Only `src/lib/date-night/lifecycle.ts` changes runtime behavior. The six finite active-key alternations become explicit arrays and 23 exact key/value selectors. For example, `nwr["amenity"~"^(cinema)$"]` becomes `nwr["amenity"="cinema"]`. The inspected engine mechanism distinguishes whole-key regex enumeration from key/value index access; public-mirror engine versions and index cardinalities were not established by this run.

All four groups retain independent lifecycle acquisitions. No shared prerequisite, provider change, cache change, positive-query change or transport redesign was introduced. `query-plan.ts` and `provider-evidence.ts` are untouched. The only existing test edits update two selector-count expectations from 49/53 to 66/70. The new `scripts/date-night-query-cost.test.mjs` contributes 13 permanent tests.

The new structural regression was RED on the unchanged implementation (5 passes, 8 failures), then GREEN (13/13). It checks the independently frozen complete registry, equality structure in every group, absence of common active-key regex acquisition, no duplicate/unbounded carrier clauses, rejection of the old shorter cinema regex, byte-identical positive and prefixed statements, all audited negatives, arbitrary permanent suffixes, near-miss equivalence, and unchanged four groups/four mirrors. It cannot pass merely because query bytes decrease.

## Before versus after query cost

Measurements use synthetic coordinates 43,-79 and 80,467 metres. Counts include acquisition and set-filter statements according to the preserved measurement script. Queries, exact statement inventories and timing samples are retained separately.

| Anything group | Selectors before | Selectors after | QL bytes before | QL bytes after |
| --- | ---: | ---: | ---: | ---: |
| Seasonal | 53 | 70 | 5,747 | 6,441 |
| Entertainment | 42 | 59 | 4,643 | 5,337 |
| Culture | 38 | 55 | 4,413 | 5,107 |
| Outdoor | 37 | 54 | 4,363 | 5,057 |
| Total | 170 | 238 | 19,166 | 21,942 |

| Carrier measure | Before | After |
| --- | ---: | ---: |
| Active-key selectors per group | 6 regex | 23 equality |
| Prefixed selectors per group | 28 | 28 |
| Total carrier selectors per group | 34 | 51 |
| Carrier bytes per group | 3,598 | 4,292 |
| Named-set lifecycle predicates per group | 2 | 2 |
| Carrier selectors across four independent groups | 136 | 204 |
| Theoretical carrier selectors, four groups × four mirrors | 544 | 816 |
| Theoretical common active-key regex selectors, four × four | 96 | 0 |
| Theoretical prefixed selectors, four × four | 448 | 448 |
| Theoretical lifecycle predicates, four × four | 32 | 32 |
| Mean Anything query construction, milliseconds | 0.057873482 | 0.087319959 |

Construction timing uses 100 warmups and 1,000 iterations. It is a local microbenchmark, not provider latency. The larger QL is intentional: 17 additional selectors and 694 additional bytes per group remove the diagnosed avoidable access path without dropping semantics. The four identical carriers still repeat independently. Theoretical totals are upper-bound planning quantities, not measured physical HTTP traffic.

Every remaining regex statement is inventoried per group in `cost-after.json`:

- **28 specific prefixed carrier acquisitions:** seven prefixes × four reconstructable classifier keys. Their finite regexes could also be equality-expanded, from 28 to 140 clauses. They remain as an explicit scope/query-size tradeoff outside the diagnosed common active-key path. They are not claimed to be semantically necessary, free of cost, or responsible for the remaining failure.
- **Two named-set lifecycle predicates:** retain arbitrary permanent-prefix suffixes and all nonempty lifecycle values except case-insensitive no/false/0. Finite replacement would lose supported semantics. Inactive-family suffixes remain restricted to the four classifier keys.
- **Existing positive-query regexes:** attraction alternation, corn/maize subtype/crop checks and named-set prose matching remain byte-identical. Finite positive alternations are protected by task scope; prose predicates require regex matching. This work does not authorize positive-query redesign.

## Semantic and protected-scope preservation

Fresh before/after audits preserve all **154 lifecycle cases, 111 authoritative negative cases and zero interpretation/acquisition parity gaps in every requested group**. Existing tests remain intact for helper normalization, arbitrary permanent suffixes, terminal precedence, cross-category identity suppression, lifecycle-only leakage, positive-query narrowness, generic farm/park/maze rejection, hostile input/query rejection, independent coverage and partial success/failure.

**V-DR-02 remains PRESERVED.** `src/lib/date-night/cache.ts` is byte-identical to the starting checkpoint, SHA-256 `71b8f4d4cdfbfd6bda4d57ad19c1034ac5012038e762931a90ee06b1fa1f45f4`. No new cache defect was reproduced. All four mirrors, hedge offsets 0/1,500/3,000/4,500ms, 8s attempt deadline, 20s provider deadline and 25s client watchdog are unchanged.

The protected-scope audit compares 1,023 base files byte-for-byte. Dinner, Nightlife, saved catalogs, casino data, auth/database, package/lockfile, Vercel configuration, Android/native behavior and branding/domain/PWA remain unchanged. Prior continuity is preserved verbatim beneath a new current entry. No runtime logging or query-input boundary changed. New portable evidence omits raw response bodies and personal locations; local screenshots remain outside the committed evidence.

## Actual validation results

| Gate | Result |
| --- | --- |
| New cost-mechanism regression | 13/13 GREEN after retained RED |
| Focused cost/lifecycle/query/seasonal/partial | 113/113 |
| Focused cache/client/session/partial UI/hedge/provider | 162/162 |
| Full `npm test`, loopback-capable runner | **686 passes: 615 repository + 71 application; 4 inherited skips; 0 failures** |
| Compiled TanStack security | 14/14 |
| Locked no-migration install; `npm ls --all` | PASS |
| Typecheck; changed executable-code lint; diff check | PASS |
| Casino invariants | 883 canonical / 899 serialized / 60 catalogs |
| Android structure/icons | 15 launcher resources / 4 web icons |
| Python native verifier tests | 3/3 |
| Auth-enabled migration-free production build | PASS |
| Build proof capture/complete/verify | PASS |
| Protected scope; secret/generated-junk scan | PASS |

Focused totals are not added to the full-suite total. The historical 673-pass result is not claimed as current validation. Exact commands, exits and logs are in `validation-summary.json` and individual result files.

The build used `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`. **Migration-chaining `npm run build` was never run.** Build proof source hash: `1fc5e8452b51be67a066d7a7511c28fbae62d2c50b4192970103801598d124df` (414 files); output hash: `138f886cdedb6850f9334cb7a2aa45ff8efc73ca0fedfd913731c835c28f4724` (194 files).

Environmental/evidence failures were preserved rather than hidden. A restricted structural runner produced a file-level failure; the unchanged tests were rerun in a capable runner to obtain meaningful RED and GREEN. An extra EOF blank line in a saved log failed diff checking; only log whitespace was normalized, with original bytes/hashes retained. Parallel Python validation generated one ignored bytecode file after proof capture; proof verification correctly rejected the 415-file tree. Removing only that generated bytecode restored the original 414-file fingerprint and the unchanged proof verified. No test was weakened.

## Controlled browser: 4/4 PASS

The unchanged established harness exercised the production-built local app and real TanStack RPC. External browser routes were blocked and server provider fetches intercepted; **zero public-provider calls** came from this harness.

| Scenario | Provider ms | Visible settlement ms | Truthful result |
| --- | ---: | ---: | --- |
| Second mirror wins | 1,581 | 1,804 | Merged; not partial; one losing attempt cancelled |
| Third mirror wins | 3,082 | 3,335 | Merged; not partial; two losing attempts cancelled |
| Partial groups | 12,507 | 12,475 | Merged; partial |
| All groups stall | 12,504 | 12,527 | Saved fallback; 16 attempt timeouts |

All scenarios had bounded loading, expected cancellation, Open Now without refetch, no page errors and no horizontal overflow at 390×844. Provider and UI durations use different observation windows. The slight partial-scenario ordering is not a negative transport duration.

## Bounded live Preview acceptance: FAILED / INCOMPLETE

Exact tested Preview: `dpl_7kz238n3Fp2rNYGjvFDuHK18YKYk`, [Preview URL](https://dinner-roulette-ijp958pl9-minions-9e2c.vercel.app), READY, target null/non-production, exact checkpoint `ce7d9df74cfda9d6ac1473a7392b8f089d87fc80`. Later checkpoints change evidence only; executable app/tests are unchanged since `4f6a6e5e9e23ec92761995334eae5bddbec3671a`. The disposable browser used explicit harness-only HTTPS-error tolerance for its known CA limitation; no application/platform TLS setting changed.

The established full-matrix harness was invoked once with `PFU_LIVE_MAX_RPC_REQUESTS=2`. It first completed the successful 15-mile Anything acquisition and local reuse checks, then made one 50-mile Anything acquisition and stopped on failed superset coverage.

| Acquisition | Group coverage | Provider / RPC / visible ms | Observed state |
| --- | --- | --- | --- |
| 15-mile Anything | 4/4 successful; seasonal valid-empty | 6,699 / 6,826 / 8,062 | Merged; partial false; no warning; 45 live / 53 total |
| 50-mile Anything | 0/4 successful; 4 failed | 12,175 / 12,340 / 13,209 | Fallback; partial false; warning; 0 live / 17 saved |

All six 15-mile rows completed: Anything 53, Haunted 2, Corn 0, Pumpkin 0, mixed seasonal 2, mixed Open Now 0. Corn/Pumpkin and mixed subsets were consistent with acquisition; Open Now, mood, favorites and Fewer Parks reused local data with zero additional RPCs. Counts are observations, not invariants. The returned response summaries contained zero lifecycle venues; there was no observed lifecycle-only leakage.

The 50-mile all-group failure retained truthful outage/source state and a settled spinner. Both acquisitions had no page errors or horizontal overflow. The 50-mile subset/filter rows were not run, so only **7/12 matrix rows** exist. The full matrix and 50-mile reuse are not accepted.

Read-only runtime excerpts show approximately 8-second timeouts on early attempts, mirror-three HTTP 504s, and immediate advancement to mirror four, which also timed out in visible culture/entertainment traces. Log tails truncate some attempts; no exact physical HTTP total or missing seasonal/outdoor timing is invented. The theoretical maximum across the two RPCs is 32 attempts, not a measured count.

The structural fix does not establish the cause of the remaining live timeout. Retained evidence cannot separate public provider/network conditions from remaining query cost. No material provider-runtime regression can be excluded, and these two observations do not prove an improvement relative to historical successful runs. No further provider requests or speculative rewrite were made.

## Final disposition and resumption boundary

Successful immutable freeze is **BLOCKED** by 50-mile live failure, incomplete 12-row acceptance and unresolved provider runtime. No successful candidate exists. The final checkpoint preserves the narrow implementation, passing gates and failed live evidence for review.

Main remains `4d937e58d2a65567b54ac5271915bc85b498898b`. The latest production alias readback remains READY deployment `dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL` at that same commit, with production aliases intact. There was no main update, merge, promotion, production deployment, settings change or migration. Final publication readback verifies the exact tree, sole parent, linear ancestry and clean worktree; literal final identities are reported to the user without a self-referential amendment.

**Next action: STOP for review of the retained 50-mile failure. Do not promote, label this awaiting successful-candidate reverification, retry public providers or begin another runtime rewrite under this checkpoint. Any subsequent implementation change requires renewed applicable gates. SAFE TO RESUME from the final INCOMPLETE evidence checkpoint.**

Evidence entry points: sibling machine-readable `.json`; dedicated `date-night-live-discovery-resilience-live-timeout-remediation-1-evidence/` directory; and `docs/handoffs/active/date-night-live-discovery-resilience-live-timeout-remediation-1-continuation.md`. These are new evidence paths and do not overwrite earlier diagnosis or remediation artifacts.
