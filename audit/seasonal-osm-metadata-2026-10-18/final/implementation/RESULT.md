# PR85 correction receipt

Published one independently reviewed commit: 8b574be4f437d029246af107812c7b0227029b14
Parent: 3e51d7a51871e4e765548955e2d6afd2f4af449e
Tree: a1a575e487a00d034162011d78230664a1237326
Remote: https://github.com/caleb1234calvin-art/dinner-roulette/pull/85
CAS expected parent matched; PR head readback and fetched Git tree/parent/four-file diff verified. Clean separate checkout /workspace/shared/pr85-implementation. Only PR85 branch changed; frozen base remains 9eb1b85c503d900993e6ab0d0e5797fd7bcacfb4. Still draft/open/unmerged.

## Changes
- Retain same-ID nonseasonal negative evidence across filtering in either order.
- Infer each historical scope independently; avoid shadowing and cross-scope synthesis.
- Preserve strict JSON fixture fidelity; distinguish duplicate records from contradictory same-ID rows; unique reasons.
- Complete destroyed/razed and false-value lifecycle semantics, international address fallbacks, explicit crop fallback.
- Bounded unchanged raw evidence whitelist; input SHA256 (explicit byte basis), canonical whole-element SHA256, original index/type/ID, exact negative-source indices. No acquisition time or authority assertion.
- Existing test-only helper parity, explicit candidate SHA checkout/assertion/tree receipt, documented privacy and scope limits.

## Verification
- Initial exact head baseline: 11 tests and changed-file lint PASS.
- Independent original regression failures: 4/4, preserved in independent-original-regressions.log and pre-fix-regressions.log.
- Second-wave failure evidence preserved in second-wave-before.log.
- Final focused tests: 30/30 PASS; changed-file lint PASS; whitespace PASS.
- Independent reviewer final: 13 external probes PASS plus 30 focused PASS; frozen file hashes match candidate-manifest.sha256 in reviewer evidence directory.
- Full repository first test invocation: 1373 passed, 15 failed, 4 skipped; compiled build output absent. Preserved full-tests.log.
- Safe authenticated migration-free build: PASS, full-safe-build.log. Exact command: VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production.
- Full repository tests after build: 1387 passed, 4 skipped, 0 failed. Application: 71/71 PASS. full-tests-after-build.log.
- Typecheck PASS. Full lint PASS with 6 pre-existing warnings.
- Optional check:auth INCONCLUSIVE exit2: no dev server. full-auth-invariant.log. No runtime started to manufacture a pass. Auth build is build proof, not live auth acceptance.
- Remote exact-head CI pending parent verification; local execution Node v24.19.0.

All failed/intermediate logs preserved. No live retrieval, runtime wiring, migration, deploy, merge, cache, source activation, PR84/82/main modifications or inventory expiry extension.
