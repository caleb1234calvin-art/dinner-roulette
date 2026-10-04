# Seasonal Fact Contract #1 — continuation

**SEASONAL FACT CONTRACT IMPLEMENTED — AWAITING SOURCE PILOT / VERIFICATION**

Authority: `91951bdad7b4c2faad4dd668a32e6d740d5728db`. Design authority: `edb524d2fe49174b217dbcbaf97a1c7edc81608f`. Required branch: `feature/date-night-seasonal-fact-contract-1`.

The branch begins directly at immutable base `908510ac25fe5c24335126a0f34ff42fe4d80632`, tree `3211b4df4eccb638a8c492da047eac3b24abb600`. That base is the implementation commit's sole parent. The approved candidate ref and main are not moved. All preexisting tracked files, including Date Night types/identity/lifecycle/cache/radial cache/catalogs, package/lock, workflows, Android and production configuration, remain byte-identical.

## Exact freeze identity

The **unique commit introducing this continuation** is the frozen implementation. Resolve its actual SHA/tree/sole parent directly from Git; do not amend the commit to insert its own identity:

```sh
git log --format=%H --diff-filter=A -- docs/handoffs/active/date-night-seasonal-fact-contract-1-continuation.md
git show -s --format='%H%n%T%n%P' feature/date-night-seasonal-fact-contract-1
```

Require exactly one introducing commit, sole parent equal to the immutable base above, a clean worktree, and remote feature-branch readback matching that commit. Exact final identities are also supplied in the delivery message. No production promotion is authorized.

## Implementation

Read `tools/seasonal-facts/README.md` for the contract, commands, conservative temporal rules, artifact encoding and future transport obligations. `schema.ts`, `canonical.ts`, `policy.ts`, `builder.ts`, `io.ts`, and `cli.ts` supply strict versioned facts/evidence/resolution/identity/lifecycle models, disabled source metadata, pure URL/DNS/redirect/response policy validators, deterministic retained-history builds and one atomic bundle writer. The policy contains no network implementation and the collector entry always throws.

`fixtures.ts` contains only invented records and `.invalid` URLs, covering all requested identity scenarios. `generated/` contains the input, bundle, manifest, runtime facts, complete ledger, field-source map, exclusions, tombstones and text diff. Content revision is `0b4823ffd0460646a0c6dc40e9cd30661c54a6ec9151cbf84e37a11fa1c06bcd`: 38 reviewed identities, seven published synthetic occurrences, four exclusions, one tombstone, 40,102 runtime JSON bytes. These are test fixtures, not a production index.

Missing fields and records retain prior evidence. Conflicting fields quarantine unless an explicit decision accounts for every assertion. Terminal negatives survive later omission/active duplicates. Publication requires explicit current-season evidence and verified coordinates. No legacy proximity merge is used. Source permission approvals cannot enable automatic collection in A1.

## Validation

- New contract tests: **112/112 passed**, with fetch/socket/DNS/subprocess tripwires preloaded; **zero unmocked network attempts**. The fixture generator also runs with this guard and reports zero.
- Full suite after a local migration-free build: **845 tests; 841 passed, zero failed, four existing skips**. Includes identity/lifecycle/catalog/cache/radial regressions and compiled server transport tests with mocked providers.
- Product and dedicated offline TypeScript checks: passed. New-file lint: passed.
- Full lint: three preexisting `no-empty` errors and six warnings on unchanged baseline paths. No unrelated lint repair performed. Full log retained.
- Clean locked `npm ci --offline --ignore-scripts --no-audit --no-fund`: passed. `npm ls --all`: passed. Offline npm audit reports zero vulnerabilities; this is not a fresh online advisory scan. Package/lock unchanged; no new or metered dependencies.
- Static scope/security audit: all preexisting files unchanged; zero runtime imports, public source adapters, collector transports or billing additions. Generated artifact SHA-256 and size descriptors match the actual canonical JSON+LF exports.
- Initial reused dependency installation warnings were resolved with clean offline installation. Initial full-suite setup failures from missing build output were resolved with a local migration-free build; final full suite passed. Both runs are retained as evidence.

Evidence is in `audit/date-night-seasonal-fact-contract-1-evidence/`, with `validation-summary.json` and `artifact-manifest.json` indexing results. The task report is `audit/date-night-seasonal-fact-contract-1.md`.

Fresh production readback: READY `dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL`, branch main, SHA `4d937e58d2a65567b54ac5271915bc85b498898b`. No production mutation, promotion, merge, live crawl, geocoding or provider traffic was requested or performed. Local compiled output is only a regression-test prerequisite.

## Exact next recommendation

1. Independently verify the exact A1 commit/tree/sole parent and retained evidence. Do not begin from a moving branch tip.
2. After that verification, create `feature/date-night-seasonal-source-pilot-1` from this verified implementation SHA.
3. Start with one narrow operator source only after documented permission/reuse, robots/terms, attribution/license and expiry review. Unknown/conflicting permission remains manual-only. No source is approved by this contract.
4. Implement DNS-pinned per-hop transport, streaming/decompression bounds and an inert local parser with synthetic malicious fixtures before any separately authorized bounded live pilot. No real source or geocoder may be activated by this continuation alone.
5. Date Night UI/search/radial-cache/provider-chain integration and production promotion remain separate later tasks. Do not merge main or promote this branch.
