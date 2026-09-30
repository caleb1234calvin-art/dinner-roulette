# Pick For Us — V-F03-01 remediation

**V-F03-01 REMEDIATED — AWAITING INDEPENDENT VERIFICATION**

Only V-F03-01 is remediated. F01, F02, F04, F05 and F06 remain closed by the prior verification and were not reopened. This is implementation evidence, not independent verification or merge approval.

## Starting integrity

- Branch: `audit/seasonal-discovery-coverage-1`.
- Starting SHA / sole parent: `c7fa7a87109624212379270df8f52ddd4c334eb9`.
- Starting tree: `a68f9754183a001bba4af2365dd9a550ed6b9e8d`.
- Failed checkpoint: `e7ad24dda7272843ca41e010de1444de365d9537`; tree `60fd8520c685edfb4449ee089b208000880bf743`; sole parent `c8a67a07053f76db140287727672e83954c586b3`.
- Frozen and freshly read main: `0a8f30dc57fcc1156342d1bfc8a07524f3125e3b`.
- Failed checkpoint, original audit checkpoint and frozen main are ancestors. The only later commits are `478eab0744af523d570783e56eb68ca1ee9bb3fb` and the starting SHA, each adding only its respective handoff document. Checkout was clean before edits.
- Original audit/remediation manifests match all 35 and 32 listed hashes, respectively. All original evidence is unchanged. The prior failed report and focused confirmation are retained byte-for-byte under `audit/seasonal-discovery-v-f03-01-remediation-1-evidence/prior-verification/` with hashes in the machine record.

## Fix and permanent regression

`src/lib/date-night/availability.ts` moves the explicit `not-operating` check ahead of the freshness/unconfirmed branch. A due revalidation flag remains visible, but supplies no evidence of renewed operation. Explicit negative state persists until intentionally replaced. Confirmed and unconfirmed expiry behavior, finished-season handling and all existing anchor calendar bytes are unchanged.

`scripts/seasonal-discovery.test.mjs` adds three actual-component regression groups:

1. The supported non-operating calendar from the verification case remains negative at October 9 20:00 and 23:59 and October 10 00:00 and 20:00, Chicago local time. OFF/ON/OFF count is always zero, both eligibility flags are false, actions are disabled, and direct action callbacks cannot produce options, a pick or a plan. Revalidation changes from not due to due without changing eligibility.
2. A known-open haunt cannot pair with the negative pumpkin fixture, before or after expiry. Options, pick and plan contain only the eligible haunt, and the real overlay displays an incomplete plan. A separately loaded explicit positive calendar replacement permits the real two-stop pair again.
3. Positive-calendar expiry still becomes uncertainty: OFF browsing remains available, ON excludes the expired record, and already-visible result/options/plan refresh consistently across midnight.

Existing seasonal tests preserve unknown/unconfirmed browsing, upcoming seasons, active known-open seasons, closed-now OFF browsing, finished/permanent/disused exclusion, Myer's retained calendar, and minute/focus/visibility refresh. No application component, acquisition/classification/merge/disclosure code or production venue catalog changed.

The corrected new tests run against the unchanged failed implementation produced **two failures and one positive-control pass**. After the one-condition precedence change, **all three pass**. The first test-writing attempt used the wrong existing overlay prop in two assertions; that harness-only mistake was corrected before the before/after comparison, and the initial log is retained honestly.

## Gates

Runtime: Node 24.19.0 / npm 11.9.0. Exact commands, exit codes and logs are in [seasonal-discovery-v-f03-01-remediation-1-2026-09-29.json](seasonal-discovery-v-f03-01-remediation-1-2026-09-29.json).

| Gate | Result |
|---|---|
| Clean install / complete dependency tree | PASS; 507 packages; package/lockfile unchanged |
| Full JavaScript suite | **393 passed, 0 failed, 4 inherited external-documentation skips** (322 repository + 71 application) |
| Seasonal suite | **17 groups passed**, including three new V-F03-01 groups |
| Availability / location subsets | **6 / 10 passed** |
| Python verifier | **3 passed** |
| Typecheck / changed-code lint | PASS |
| Casino invariants | **883 canonical / 899 serialized / 60 catalogs**, 39 complete jurisdictions |
| Android structure / icons | PASS; 15 launcher resources |
| Capacitor sync / tracked-byte stability | PASS; Android/config bytes unchanged |
| Auth-enabled migration-free production build | PASS |
| Whitespace / scope / secret and generated-junk sanity | PASS; final details in `final-sanity.json` |
| Browser acceptance | UNAVAILABLE; Chromium executable missing |

Subsets are included in the 393 JavaScript passes, not additional passes. Python is separate. Dependency deprecation/proxy warnings and established casino duplicate-reconciliation notices remain in logs. The four skips are the inherited absent external workspace OG documentation package checks.

Production build command: `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`. No migration command was run. No live provider access was needed. Component/hook/SSR checks do not establish browser/RPC/hydration/layout, native-device or production acceptance.

## Scope and checkpoint linkage

Changed paths are the two implementation/regression files above, this report/machine record and its separate evidence directory, plus a new TOP continuity entry. Historical continuity and all prior audit/remediation/failed-verification bytes are preserved. Acquisition queries, maze classification, duplicate merging, source disclosure, radius, dedupe thresholds, Dinner/Nightlife, casinos, shared location/GPS, Android, Vercel/build settings, packages/lockfile and production URL are unchanged. No venues, merge, deployment, migrations or publication.

The single commit introducing `audit/seasonal-discovery-v-f03-01-remediation-1-2026-09-29.json` is the immutable remediation checkpoint, with sole parent `c7fa7a87109624212379270df8f52ddd4c334eb9`. Resolve without self-referential evidence amendments:

```bash
git log --diff-filter=A --format=%H -1 -- audit/seasonal-discovery-v-f03-01-remediation-1-2026-09-29.json
git show -s --format='%H %T %P' <resolved-checkpoint>
```

The authorized branch push is followed by remote SHA/tree/sole-parent and clean-checkout confirmation in the task result. A fresh Astra must independently verify that checkpoint before merge review. Stop after the push.

**V-F03-01 REMEDIATED — AWAITING INDEPENDENT VERIFICATION**
