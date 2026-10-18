# PR84 final exact-head CI and evidence receipt

## Result

**HOSTED PASS, with the evidence qualifications below.** No source changes or reruns were needed during this verification. PR84 remains open, draft and unmerged.

- Final head: `9eb1b85c503d900993e6ab0d0e5797fd7bcacfb4`
- Tree: `26725dfcfe2de5e82f49cda02b9ec49addb421ce`
- Sole parent: `98915d0eee7b3ec0096f6148d13e7fa551b2bdca`
- PR base remains `c3208d9fdc9a21d698efa9254be1286f5d3d2836`.
- Verification completed 2026-10-18, approximately 15:00 UTC.

## Hosted runs and actual totals

- [Web validation 39134672907](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/39134672907): **SUCCESS**, all 17 jobs, including 15 browser suites and aggregate `validate`. Final run metadata updated at 14:53:09 UTC.
- [Mock-only source validation 39134672906](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/39134672906): **SUCCESS**, 104/104 fixtures, zero failed/skipped. The actual log checks out and asserts the final SHA, prints the final tree, and invokes all seven source test files.
- [Android validation 39134672933](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/39134672933): **SUCCESS**; `validate-android` passed and `sign-upload-bundle` was skipped.

The final web `checks` log records:

- Repository tests: 1,361 total, 1,357 passed, 4 skipped, zero failed. The four skips are external workspace documentation-package checks, not seasonal source fixtures.
- Application tests: 71/71 passed.
- Casino audit regression fixtures: 83/83 passed.
- Typecheck, development and production-mode builds, catalog audit, and icon checks passed.
- ESLint: zero errors, six warnings.

These are separate, partly overlapping suites. Do not add their counts into a unique-test total. Android reruns the repository/application tests and is not an additional unique count.

## Original artifacts and source binding

All **18 original GitHub ZIP archives** were downloaded and retained without replacing, trimming or regenerating them:

- 16 web artifacts: 15 browser suites plus check-build proof; two Android artifacts; mock run intentionally has no artifact.
- Compressed bytes: **1,382,038,990**.
- Archive members: **13,745**, totaling **1,462,201,921 uncompressed bytes**.
- Every archive matches GitHub's SHA-256 digest and byte size; every member passes ZIP CRC validation; every artifact metadata record binds the final head and correct run.
- **13,658 original PNGs decode successfully**, with zero decode errors. Decode validity is separate from actual visual inspection.
- Every web build proof uses source fingerprint `930a533204b4b4b19dd4125a15c9980c58676bb2e081eed950cf3ca9496bf84a` over 533 files, matching the exact-head check-build proof.
- Accessible source checkout logs confirm final SHA. Two large Actions logs are unavailable through the connector as described below; their complete original artifact/verdict evidence remains preserved.
- Android `source-revision.txt` is exactly the final head. Internal APK/AAB SHA256SUMS also match. The Android artifact name uses merge SHA `bcc9bcb5d80b1419b3c204d51071fd0053b594a8`; its tree is verified equal to the final head tree. This naming does not change the actual explicit head checkout.

Machine-readable evidence: `artifact-manifest.json`, `artifact-integrity.json`, `image-decode-integrity.json`, final run/job metadata, and `final-ci-summary.json`.

The complete compressed archive-member index is `artifact-members.jsonl.gz`: 13,745 rows, 153,953 bytes, SHA-256 `089de315f4c19d1b73d673d5463359868e87eb809566db94af15b6fdba18514b`. It records original archive identity/hash, member path, bytes and CRC. No oversized raw ZIP needs to be stored in Git.

## Browser verdicts and representative rendered inspection

The independent review inspected **44 originals from final-run artifacts (including geometry comparison views) and four baseline casino originals**. See `visual-review-report.md` for exact members and scope.

- Seasonal verdicts: **2,020 passing scenario entries**, zero failed entries; 771 decoded/nonzero-width image records, 2,103 unobscured note records and 1,269 reachable controls. These are evidence entries with repeated scenarios, not unique product tests.
- Ordinary Date Night radial: 10 passing scenarios.
- Casino: 16 recorded checks, no errors. Location: 19 checks, passed.
- Geometry: 774 comparisons across 92 IDs at 320/390/512px, all six variants; 1,644 expanded-note checks without obscured/out-of-viewport/horizontal-overflow failures. Recorded maximum option/plan/result height deltas: 0/3/4.671875px; Directions deltas only 0/16px.
- Final regional artifact contains 317/317 regional and 277/277 wave-two passing scenarios. Both report zero public provider calls; public-provider acceptance remains false.

No new visual regression was established in the actual inspected originals. This is representative visual review, not a claim that every PNG was visually examined.

## Explicit qualifications

1. **Inherited casino artwork capture gap:** all four final casino captures and all four baseline `422bf4f` captures show blank artwork boxes while surrounding UI renders. UI/assets/casino smoke code are unchanged; the smoke script does not wait for or assert image decode. This is consistent with capture timing and gives no evidence of a new regression, but these screenshots do not prove eventual casino artwork rendering.
2. **Geometry scope:** real overlay components rendered to static markup with mocked React/store state and production CSS, dark theme only. Comparison is against historical baseline `2fe002e6bdc9c2c42ecfc0d61e4de08df20d0d81`, not the `422bf4f` CI baseline. It does not prove full-app hydration, RPC or actions. Narrow option labels intentionally ellipsize; do not claim zero text truncation.
3. **Actions-log access:** cumulative job `117696652754` and regional job `117696652730` return connector `Transport closed`. Their job/step success, exact-run artifact metadata, complete original ZIPs, build proofs and raw verdicts are preserved. This is a log retrieval limitation, not a test failure or omitted original artifact.
4. **Android scope:** app lint summary has 14 warnings. The log also records six upstream Capacitor lint errors filtered by its existing baseline and no new issues. The bundle is unsigned; upload signing is skipped. It is a remote HTTPS wrapper, not a snapshot of branch web content; Play Console acceptance is not verified.
5. **Capture/font scope:** some full-page captures contain fixed-layer/capture seams and are not proof of whole-page overlap-free layout. Seasonal browser runs block external fonts and use fallback rendering. Sampled copy roughness is inherited; fixture screenshots do not verify source factual claims.
6. **Acceptance boundary:** this verifies the frozen, isolated, mock-only research source and existing regression suites. It does not establish live-source activation, durable lifecycle storage, runtime integration, production release, a signed release, merging or deployment.

## Preserved history

The original failed predecessor `dab607ffeddf40825ef29e0270fe461bbcf56f78`, web run `39110169527`, remains preserved: ESLint `no-useless-escape` at `scripts/seasonal-source-triage.test.mjs:32:41`, one error and six warnings. Later baseline `422bf4f`, offline remediation `b99fad7`, and foundation `98915d0` all reached terminal success in their own hosted runs. Their evidence is historical and was not substituted for this final exact-head run.
