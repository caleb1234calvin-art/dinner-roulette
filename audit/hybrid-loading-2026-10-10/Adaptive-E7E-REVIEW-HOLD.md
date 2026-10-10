# Independent adaptive audit review: e7e HOLD

2026-10-10 08:06 UTC. Exact local immutable candidate `e7e09ffdd5a7578a079c5a9003cc8227b69f8e99`, tree `7a1a5a444d0ae81bb432193f58c3e1626fc1f233`; parent `4aee376f14a30f01a669b5667c7b9aa7f2b79249`, runtime parent c78b971. Worktree clean. Thirteen c78-relative paths: four source, two test, seven evidence paths. No remote publication verified or implied.

## Finding ADAPT-IV01: stopped coverage disclosure lost on empty local filter

After a healthy primary with four eligible movies, four fully successful zero-yield patches stop the audit with 28 missing patches and explicit incomplete status. Turning Favorites only on with no favorites causes the hybrid publish phase to become `empty` before considering `auditStopped`. `dateNightHybridProgress` returns “No matching date ideas available.” State still records stopped=true and coverage.complete=false. The UI passes only phase and expanding to this function, so the explicit paused/incomplete disclosure is absent. The separate Retry missing areas button remains available, but does not satisfy the policy's explicit truthful stopped-state disclosure.

Reproduction is the final test of `adversarial-e7e.test.mjs`. The exact diagnostic in `adversarial-e7e-r2.log` is phase empty, stopped true, coverageComplete false, requests 5. No provider traffic or additional RPC occurs. Expected: retain truthful zero-current-eligible status and explicit incomplete/paused audit disclosure, without a false Ready claim or automatic restart. Open Now and expiry empty states should share the same semantics.

This is a bounded technical presentation HOLD; no evidence of lost negative authority or false cache-complete state. The verifier did not edit source. Parent and author were notified immediately for separate disposition/remediation.

## Independently passed scope

Exact-source focused161/161 PASS, zero failures/skips, including18 new adaptive fixtures, hybrid lifecycle/cancellation/negative-capacity/alias stability tests, radial session/pacing/cache/geometry-plan and shared discovery lifecycle. Complete source and test diff reviewed; timing migrations retain substantive assertions. Original54/63 failed author attempt remains preserved.

Five additional independent adversarial tests PASS:
1. Negative fourth patch removes one of five positives and stays authoritative even when four survivors permit early stop; local OpenNow retains suppression without another RPC.
2. Rich movie-only results for explicit Movies+Escape Room selection stay thin and start immediately.
3. Expiry just before fourth settlement removes healthy status and prevents early stop.
4. Explicit retry after early stop resumes exact missing radial-v1:20:3 without another disk primary.
5. Radius change during deferral cancels old timer, uses covered disk locally, and preserves incomplete patch authority.

The sixth independent status test fails as above. Typecheck/lint outcomes are separately retained once terminal; they do not override this HOLD. No full Phase3 suite/build/browser/live benchmark was performed. Existing c78 full functional PASS does not transfer.

## Explicit recall and lifecycle limits

The accepted experimental design intentionally skips potentially useful unseen patches. Author fixtures independently rerun show a sole fifth-patch useful venue is lost and a negative only in that skipped patch remains unknown, leaving a stale positive. These are disclosed recall/freshness tradeoffs, not observed-negative resurrection or parity PASS. Previously observed negatives, selected-category semantics, radius clipping, cancellation and lifecycle guards remain preserved in reviewed focused evidence. No adoption or full-recall conclusion follows.

Diff whitespace check reports only original raw failed-log whitespace; source diff has no whitespace defects. Preserve raw logs rather than editing historical bytes merely to silence that diagnostic.
