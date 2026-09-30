# Pick For Us — Production Loading Hang Remediation 1 — Independent Verification

Repository: `caleb1234calvin-art/dinner-roulette`

Branch: `audit/production-loading-hang-1`

Immutable remediation target:
`d9c3d02b7533ea55b5c47b219359f7a87ff783c5`

Expected tree:
`d90c5f55ee74252ddfe0e7854bf6d2fed3bf16fb`

Expected sole parent:
`6cc0a2b76613c52dbf4a6ea4e9a55494287cb057`

Frozen production main:
`66eed1409e1076bcea388f36891c31fa7fa3eb84`

Implementation state:
`PRODUCTION LOADING HANG REMEDIATED — AWAITING INDEPENDENT VERIFICATION`

This task is a fresh, independent, READ-ONLY verification of PLH-F01, PLH-F02 and PLH-F03.

## Hard prohibitions

Do not modify product code, tests, evidence, catalogs or configuration.
Do not fix findings.
Do not commit.
Do not push.
Do not merge.
Do not deploy/redeploy.
Do not change Vercel settings.
Do not run migrations.
Do not roll back.
Do not publish Android/Play artifacts.

If verification fails, preserve the failure and stop.

## Required reading

Read IN FULL:

1. `docs/handoffs/active/production-loading-hang-audit-1.md`
2. `audit/production-loading-hang-audit-1-2026-09-30.md`
3. `audit/production-loading-hang-audit-1-2026-09-30.json`
4. original incident evidence
5. `docs/handoffs/active/production-loading-hang-remediation-1.md`
6. `audit/production-loading-hang-remediation-1-2026-09-30.md`
7. remediation JSON/evidence/manifest if present
8. current TOP continuity
9. all changed runtime/tests

Treat the incident audit as authority for the defects. Treat the remediation handoff as authority for scope. Treat the remediation report as claims requiring independent proof.

## Checkpoint integrity

Before validation:

- fetch fresh refs
- verify immutable target SHA exactly
- verify target tree exactly
- verify sole parent exactly
- verify frozen main remains unchanged or report movement
- verify incident audit checkpoint is in ancestry
- verify original incident report/JSON/ZIP and manifest members remain byte/hash identical
- verify any branch commits after the immutable target are documentation-only
- use a clean detached/fresh checkout pinned to the immutable target, not a later handoff head

Expected original hashes:

Report:
`25e70c91bc986a8fa0c18cbfbf1d033f53416f191e6b2b500462b90e6d296864`

JSON:
`03d6ade45704f1f53fb0cde3ed642af0bd77bcbcc09066c2e2d20b877122e313`

ZIP:
`261893fe60427cfe8ad475f85d9d1845cc73c2f11594bb278779a4d1d8fd1f6b`

## Scope verification

Inspect parent→target and aggregate remediation diff.

Confirm:

- changes map only to PLH-F01/F02/F03, their permanent tests/evidence/continuity
- no venue/catalog additions
- no provider additions/removals/reordering
- no discovery query/ranking semantic changes
- no radius/fallback coverage changes
- no seasonal F01–F06 regression
- no Dinner/Nightlife unrelated feature work
- no location/GPS behavior redesign
- no package/lockfile drift
- no Android executable/config change
- no Vercel/build setting change
- no migration/release workflow change

## PLH-F01 independent verification

Verify one shared provider-chain policy is actually used by Dinner, Date Night and Nightlife.

Required policy:

- aggregate budget = 20,000 ms
- max mirror attempt = 8,000 ms
- per-attempt timeout = min(8,000 ms, remaining)
- no new attempt after budget exhaustion
- timeout remains effective through response-body completion
- timers/controllers clean up
- mirror order preserved
- mode-specific empty-result semantics preserved
- saved fallback and outside-coverage error behavior preserved
- source/warning semantics preserved

Freshly exercise, for all three modes:

- all headers stall
- response body stalls
- first timeout then second success
- immediate 429
- immediate 500
- immediate 504
- malformed/missing-elements
- invalid JSON
- empty success
- local saved fallback
- outside-coverage terminal error
- no post-budget mirror

Use fake clocks for exhaustive coverage.

Independently run a selected native-clock all-stall test to verify normal AbortSignal behavior. Require provider-chain settlement <=20,000 ms plus the remediation's documented 500-ms tolerance.

Do not merely rerun the worker's evidence harness without inspecting its assertions.

## PLH-F02 independent verification

Verify Dinner, Date Night and Nightlife all use the shared client lifecycle and supported TanStack signal path.

For each mode prove:

- request creates AbortController
- RPC receives the signal
- watchdog deadline is 25,000 ms
- success before watchdog clears loading/timer
- server fallback before watchdog remains fallback
- server error clears loading
- never-settling transport causes UI settlement by watchdog
- abort-ignoring transport still cannot keep UI loading
- watchdog issues abort
- timeout shows mode-appropriate actionable retry/error state
- timeout does not fabricate fallback data
- retry after timeout works
- unmount aborts
- replacement aborts
- stale old success ignored
- stale old rejection ignored
- late post-timeout success ignored
- late post-timeout rejection ignored
- timers/controllers cleaned up

Explicitly verify UI settlement is not dependent on transport honoring abort.

Inspect the real installed TanStack RPC fetcher/source or equivalent executable path sufficiently to confirm the signal is forwarded as claimed.

## PLH-F03 independent verification

Inspect the 95 claimed permanent regression groups.

Confirm they are production-relevant and actually cover the audit failure modes rather than simply matching helper implementation.

Verify:

- provider cumulative deadline tests
- body-stall tests
- cross-mode provider failure matrix
- client never-settling transport
- abort-ignoring transport
- stale/replacement/navigation behavior
- retry
- signal forwarding
- mode filtering/options/pick preservation
- seasonal regression preservation

Check the remediation's negative control claim: selected new checks should fail against the unchanged starting revision for the intended reasons.

Do not require every verification test to be run against old source if doing so would modify the target; use an isolated/read-only extraction or inspect retained negative-control evidence.

## Observability verification

Confirm structured provider/client logging:

- contains no precise coordinates
- contains no addresses
- contains no query bodies
- contains no personal identifiers/secrets/raw provider exceptions
- does not log ordinary first-mirror success noisily
- captures degraded/empty provider-chain summary
- captures mode, source/outcome, timing/budget state and bounded attempt metadata
- captures client timeout event without sensitive location payload

Verify logging cannot materially alter request semantics.

## Full surrounding validation

Freshly run where environment permits:

- clean `npm ci --no-audit --no-fund`
- `npm ls --all`
- typecheck
- full JavaScript suite
- new provider/client suites
- all 17 seasonal regression groups
- availability tests
- location-discovery tests
- relevant Python verifier tests
- changed-code lint
- casino invariants
- Android structural/icon checks
- Capacitor sync/tracked-byte stability
- migration-free production build
- `git diff --check`
- secret/generated-junk sanity
- final clean checkout

Expected implementation claims:

- 488 JS passed
- 4 inherited external-workspace documentation skips
- 95 new permanent groups
- 17 seasonal groups
- 10 location-discovery groups
- 6 availability groups
- 3 Python
- casino 883 canonical / 899 serialized / 60 catalogs
- 15 Android launcher resources

Do not double-count subsets.

## Performance acceptance

Independent verification must establish:

- all-stall provider chain <=20s + 500ms tolerance for all three modes
- first timeout → second success approximately 8s under controlled clock
- unresolved client transport exits visible loading at 25s + scheduler tolerance
- fallback arriving before watchdog remains fallback
- late timed-out/replaced responses cannot overwrite current state

## Browser acceptance

Attempt bounded browser acceptance if Chromium/browser infrastructure is available.

If unavailable, state the limitation explicitly.

Do not claim component/harness execution is browser hydration/RPC/CSS acceptance.

## Platform maxDuration

Read available repository/runtime metadata.

If hosted maxDuration remains unavailable, preserve that limitation.

Do not invent a value and do not change Vercel settings.

The application deadlines should be independently correct regardless of that unknown.

## Evidence consistency

Cross-check remediation report/JSON/evidence against Git and fresh results.

Verify claimed source hashes, changed paths, timing evidence and checkpoint linkage.

Report material discrepancies.

## Verification result

End with exactly one:

`PRODUCTION LOADING HANG REMEDIATION VERIFIED — PRE-MERGE CANDIDATE READY`

or

`PRODUCTION LOADING HANG REMEDIATION VERIFICATION FAILED`

Use VERIFIED only if:

- PLH-F01 closes independently
- PLH-F02 closes independently
- PLH-F03 coverage/observability claims hold
- timing acceptance passes
- surrounding validation passes
- no new merge blocker is introduced
- scope and evidence integrity hold

This task does not authorize merge or deployment.

## Final report

Report:

1. target SHA/tree/sole parent
2. current/frozen main
3. evidence/checkpoint integrity
4. exact remediation scope
5. PLH-F01 result
6. PLH-F02 result
7. PLH-F03 result
8. native/fake-clock timing results
9. client watchdog/cancellation results
10. observability/privacy result
11. JS/Python/typecheck/lint totals
12. seasonal/location/casino results
13. Android/Capacitor/build results
14. browser result/limitation
15. platform maxDuration status
16. evidence consistency
17. new blockers if any
18. final verification state

Stop after read-only verification.
