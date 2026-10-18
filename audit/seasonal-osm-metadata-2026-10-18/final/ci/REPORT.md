# PR85 final CI verification

Verified 2026-10-18 19:18 UTC. PR85 remains open, draft, unmerged at 8b574be4f437d029246af107812c7b0227029b14 against frozen 9eb1b85c503d900993e6ab0d0e5797fd7bcacfb4; four changed files. Read-only verification; no duplicate jobs triggered.

## Exact-head CI
- OSM push: https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/39157761818 ; job 117764425906. SUCCESS, 30/30 tests, changed-file lint pass.
- OSM PR: https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/39157766024 ; job 117764439856. SUCCESS, 30/30 tests, changed-file lint pass.
- Both OSM logs explicitly record expected and actual head 8b574be4f437d029246af107812c7b0227029b14 and actual tree a1a575e487a00d034162011d78230664a1237326. The PR run now tests the explicit head, not its synthetic merge.
- Android: https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/39157766033 ; job 117764440114. SUCCESS, exact head checkout and git rev-parse record 8b574be4f437d029246af107812c7b0227029b14. Script tests 1391 total, 1387 pass, 4 skipped, zero failures; app tests 71 pass, zero skipped/failures. Migration-free web compilation and Gradle build pass. Missing-key guard intentionally fails closed. Signing job skipped.
- All three runs terminal success. Logs retained in log<job>.json and metadata in finalruns.json / jobs<run>.json.

## Original artifacts and integrity
- Validation artifact 12147807044: original ZIP 6866410 bytes, SHA256 431efb19c67c1bf2230104d385d151ae39947583c9690a8b7c66f033a3d38feb; matches GitHub digest.
- Lint artifact 12148001447: original ZIP 24069 bytes, SHA256 175920f9b232ae644ddf5d0a57a85930fe5afb6c77d0753bc5a01ded15db64ee; matches GitHub digest.
- Both original ZIPs preserved unchanged as artifact-<id>.zip; ZIP CRC tests pass.
- Embedded source-revision.txt exactly matches head 8b574be4f437d029246af107812c7b0227029b14.
- Unsigned AAB SHA256 4cead0e51c28e90e5a0d42149e3952690d19a4f61f05bae1cacf55c6c3b5e4ee and debug APK SHA256 bc779db67ba0bc8cc57f8532393fc90665504a0acddb58b8c88ba144d36bcb98 independently recomputed and match embedded SHA256SUMS.
- Per-member hashes and lengths in artifact-integrity.json. Selected evidence files extracted alongside original ZIPs.
- Artifact names include synthetic merge b5b296a0cfcc237c9f00cfa132cd13a6d616c2ea; this is a naming caveat, not actual checkout. Bind source using logs and embedded source-revision.txt.

## Qualifications
- Android app lint report has 14 warnings and zero reported errors, with the upstream Capacitor baseline active. The job log explicitly states "Lint found no new issues (and 6 errors filtered by baseline lint-baseline.xml)" and also reports six stale baseline entries not found in the dependency project. The prior 3e51d7a run has the same six-errors-filtered message. This is not an unqualified zero-issue result. Android warnings are separate from local web ESLint warnings.
- Bundle report says signing unsigned; upload signature not verified; Play Console acceptance NOT VERIFIED; runtime is remote HTTPS app, not a snapshot of branch web content.
- Earlier three OSM lint failures and cancelled superseded Android runs remain preserved in /workspace/shared/pr85-ci-verification-20261018; they were not relabeled as final-head results.
- Parent-reported local evidence (not independently executed here): 1387 script passes / 4 skips plus 71 app passes, type check, full lint with six warnings, safe migration-free build. Initial 15 missing-build failures retained then post-build pass; auth development probe inconclusive because no server.
- No new-head browser/UI claims. CI does not establish live coverage benefit, licensing clearance, source activation, deployment, signing or release readiness.
