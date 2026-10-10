# Independent R2 hosted-fixture launch gate — PASS FOR FIXTURES ONLY

2026-10-10. This is the third local protocol gate, author harness R2. Live remains HOLD.

Manifest SHA256: 74c4394a568dedcea9a17038647b85ab0f97e66d12a4efa08520521905cf8dfd.
Fixture trigger SHA256: 036e986fdd0d5286c57d52071ab806e289f01f24eb466a9f9b381a8df09786d7.
All 21 manifest file lengths and hashes independently match. No LIVE-APPROVAL marker exists.

Independent command:
PFU_BASELINE_ROOT=/tmp/decision-baseline-fe22 PFU_CANDIDATE_ROOT=/tmp/hybrid-frozen-c78b971 node --test decision-benchmark/*.test.mjs

47 PASS, 0 failures, 0 skips. No public-provider traffic.

## Reviewed corrections
- Exact Playwright Request timing maps through browser performance.timeOrigin; shared URL resource entries cannot cross-attribute acquisitions.
- Navigation return, driver loop, click attempt and trusted click are separately logged. Decoder imports occur symmetrically before navigation, without handler/provider invocation. First eligible-and-enabled to primary click attempt over250ms is explicitly driver-confounded.
- Bounded observer CPU histograms remain outside the snapshot change signature. Cold/warm costs are separate; p95 upper bound over10ms or any maximum at least50ms is confounded. Node journal and ledger write costs are distinct from browser CPU.
- Known failed-primary warm refetch is intercepted before server dispatch, recorded as warm HOLD and excluded from physical and handler failure/reset accounting. Immutable cold outcome remains separate. A controlled block cannot become warm no-refetch PASS.
- Actual hosted preflight validator requires valid rendered Pick, four Options, truthful no-pair, exact request timestamps, visible/live timestamps, observer/driver non-confounding, two zero-refetch warm-success cases, partial-authority warm skip and explicit failed-primary warm HOLD.
- Yield analysis keeps thrown primaries in failure/recovery strata and bounds usable additions by actual cold-final visible eligibility. Raw merged diagnostics remain separate. Missing pre-audit UI observation is explicitly labeled as raw-primary eligibility fallback.
- Decision rubric has only ADOPT HYBRID, KEEP RADIAL-V1 PRIMARY, MORE EVIDENCE REQUIRED. Full-four applicability is evaluated at the actual Options click, not a later final pool.

## Scope of permission
Publish exact 21 manifest files, manifest and fixture trigger on the already approved deployment-disabled evidence branch, with identical audited/executable workflow bytes. Run only four mock-provider actual-browser fixtures. Do not add a live marker or issue public-provider probes. Prior failed R1 receipts/reports remain preserved.

## Remaining gate
Hosted fixture success is not assumed. Independently review raw receipts, starts/settles, exact built-source bindings, actual pixels, prompt comparable interaction, observer overhead and warm-block neutrality. Any executable change needs new frozen review. Only after that gate and exact unique-run approval binding can live execution be considered. No source remediation, merge, production deployment or release authority follows this receipt.
