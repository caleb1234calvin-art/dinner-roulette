# R5 independent exact-candidate local validation

Candidate: c78b97175cc094436e454fa888e1ed83486f750d
Tree: 6f7130dc46e5decc9b045c2841b63c73406ae2ae
Parent: cd78a0d8b5efb7fee818da5b2ea79588e28c8270
PR61 independently fetched open/draft, base fe22c15cc6442fc4a48fec23c9a1331c69d70bd2.

Nine changed paths against cd78 contain five reviewed test files and four evidence/map files only. Reviewed five hashes match the prepublication report. Runtime, server, public assets, dependencies, workflow and production configuration are identical to R3 (63b4c0096c2af305019cc7f5adf67e55720b562a). Tracked worktree remains clean after checks.

Local verdict: PASS.
- Full suite: 1,059 PASS (988 repository + 71 application), zero failures, four documented external-documentation skips. Fresh exact-head rerun exit 0.
- Typecheck exit 0.
- ESLint exit 0: zero errors, six inherited warnings.
- Auth-enabled migration-free direct Vite production build exit 0. Capture/complete/verify proof passes.
- Source fingerprint: 853fe21f5c661a59d021ce0f870b391ce6d3cc14653b693f4c5db46ab88c05b2 (477 files).
- Independent build output: 147c95da2d5e6431788d29bbd06f97e3cacb93a2bf717580106b26ba796e4755 (194 files).
- Seven new receipt-authority tests independently passed in default and America/Denver host zones before freeze; same reviewed bytes confirmed after freeze and included in full suite.

An initial verifier invocation incorrectly exported build-only VITE_AUTH_ENABLED=true into npm test. Two existing wrapper tests expecting repository default false correctly failed. That failed attempt is retained in exact/full.log; source was not changed. The corrected invocation env -u VITE_AUTH_ENABLED npm test passed in exact/full-corrected-env.log. This is a verifier invocation correction, not product remediation or assertion suppression.

Historical independent cancellation, negative-lifecycle, alias-stability and truthful-readiness probes on cd78/R3 remain source-bound to byte-identical runtime. They are not claimed as newly rerun probes in this refreshed workspace. The full exact-head suite includes the committed safety regressions. Hosted source-bound browser, geometry and remaining acceptance are still pending.

Overall exact-candidate acceptance: HOLD pending complete hosted results and evidence inspection. Architectural recommendation: MORE EVIDENCE REQUIRED. The a4 benchmark's raw acquisition evidence remains relevant to unchanged acquisition paths but does not establish new-head READY timing, broad recall or provider reliability. No new live traffic, source mutation, merge, deployment or production setting changes were performed.
