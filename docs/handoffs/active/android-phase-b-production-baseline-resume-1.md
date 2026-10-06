# Pick For Us — Android Phase B Production-Baseline Resume #1

## Authority and first task

Repository: `caleb1234calvin-art/dinner-roulette`.
Publication branch: `docs/post-release-closeout-1`.
Created as the documentation-only post-release closeout on 2026-10-06.

Read this complete handoff from the **exact published closeout commit supplied by the owner**, then independently verify that commit's tree/sole parent and two-path documentation-only diff. The commit cannot embed its own SHA; resolve it from the closeout publication receipt and remote readback. Do not silently substitute a later branch tip.

This is the authority for the next Android / Google Play Phase B continuation. Its **first task is CURRENT-STATE RECONCILIATION against production main**, before deciding what Android work actually remains. It supersedes historical instructions to work on `polish/pre-google-play-pass-1`, while preserving their completed evidence. Historical handoffs are evidence, not renewed authorization to execute their old merges, builds, deployments or publishing steps.

Do not treat this documentation branch as an Android implementation base or merge it into main as a prerequisite. Read the published documents by exact SHA while basing actual new work directly on production main. Reconciliation comes before implementation or artifact regeneration; any later work must fit the owner's next scoped task and the separate authorization gates below.

## Verify current main and production first

Expected closeout baseline:

| Object | Required value |
| --- | --- |
| Released production main / publication tip | `5534866e528e16721baa7369c0980f65b00a94b2` |
| Main tree | `ea0ecb0c6e1e7bee1859d82b29fb09fef9a15c13` |
| Main sole parent / released integration candidate | `4673854a0532fd753acea02c208189fcf23a4241` |
| Integration candidate tree | `0d33cb7ca3217517a20a2d13fc545485893b5bd8` |
| Candidate sole parent / pre-release main | `078f65c5d194435452ca14569ea00e57f52a20f3` |
| Current production | `dpl_3Bfbq9TPJqsrgCx4UKX1r9ANDZRj` — READY |
| Retained prior rollback | `dpl_HmqKyiLqCqMSTrhxKktsy9mJtDKy` |
| Historical Android branch | `polish/pre-google-play-pass-1` |
| Historical head and merge base | `0a8f30dc57fcc1156342d1bfc8a07524f3125e3b` |
| Historical branch relative to released main | 0 ahead / 87 behind |

Fetch fresh refs and inspect production read-only. Verify deployment source is Git `main` at the released SHA, target production, state READY, and the established aliases remain assigned. Check all five: `pickforus.app`, `www.pickforus.app`, `dinner-roulette-chi.vercel.app`, `dinner-roulette-minions-9e2c.vercel.app`, `dinner-roulette-git-main-minions-9e2c.vercel.app`. Preserve the `www.pickforus.app` 308 redirect to `pickforus.app`.

If main, production, historical head or ancestry differs, **STOP and report drift**. Do not reset refs or deploy to make the recorded values true. A newer production baseline needs explicit reconciliation and an updated scoped direction before implementation.

Reproduce the historical relationship, with the historical branch on the left:

```sh
git rev-list --left-right --count 0a8f30dc57fcc1156342d1bfc8a07524f3125e3b...5534866e528e16721baa7369c0980f65b00a94b2
git merge-base 0a8f30dc57fcc1156342d1bfc8a07524f3125e3b 5534866e528e16721baa7369c0980f65b00a94b2
```

Expected outputs: `0 87` and the exact historical head, respectively. The old branch is fully contained in production history. Retain it as evidence only: **do not merge, rebase, reset, force-update, revive, rename or delete it**. Do not recreate deleted historical integration branches.

Once identity checks pass, any new Android working branch must be **fresh and created directly from current production main** (the exact SHA above while it remains current). Record its starting SHA/tree. Use a new branch name consistent with the current Android workflow's branch filters, after reading that workflow; do not rewrite automation merely to resume the old branch.

## Required reading, in full

Read the new closeout top section of `AI_CONTINUITY.md` from the exact closeout commit, then the complete Android Phase B checkpoint headed `Pick For Us — Android Phase B (current recovery 2026-09-21)`, including its final checkpoint, recovery, compilation and earlier implementation context. Read the September 29 pre-merge checkpoint as dated context. Their old working-branch and next-action instructions are superseded by this handoff.

From verified production main, read:

- `ANDROID_RELEASE.md`
- `native-android/README.md`
- `audit/android-phase-b-validation-2026-09-21.json`
- `audit/pick-for-us-pre-merge-baseline-remediation-1-2026-09-29.json`
- `docs/handoffs/active/pre-merge-baseline-remediation-1.md`
- `docs/handoffs/active/pre-merge-baseline-remediation-1-verification.md`
- `docs/handoffs/active/pre-merge-production-impact-verification-1.md`
- `docs/handoffs/active/pre-merge-production-impact-verification-1-final.md`
- `docs/handoffs/active/pre-merge-controlled-main-promotion-1.md`

Follow relevant evidence references and later main history for Android artwork, security, hosted URL/WebView behavior and web acceptance. Locate referenced handoffs on their actual historical refs when absent from main; identify missing evidence explicitly and do not invent a path or substitute recollection. Do not execute old handoff procedures during this reading. Current source and exact-revision results determine current state; older summary claims do not override later files.

Inspect the current native project, `capacitor.config.json`, `native-web/index.html`, version/signing files, `package.json`/lockfile, `.github/workflows/android-apk.yml`, native verification/icon scripts and relevant later CI results. Read current workflow triggers and artifact/signing boundaries before proposing any run.

## Reconcile completed work with current inputs

The September 21 completed native evidence is bound to executable candidate **`5aee90acbb44ab5d48b25cb1dac39db84cefcfbf`**, Android CI run **`35654077135`**, validation job **`106513238201`**. It records successful unsigned native compilation, compiled AAB inspection, fail-closed normal-release signing guard, persistent native source, deterministic resources and artifact-only CI. Native unit tasks were **NO-SOURCE**, not behavioral test passes. The optional signing job was skipped by design.

Historical AAB: 3,103,779 bytes, SHA-256 `16bc0fc6e2606bd64f927981b1811f4256144851bebd24a33c1f035ac38c6057`. Validation artifact ID `10663661233` records expiry `2026-10-05T20:58:37Z`; prior authorized export returned HTTP 403. Verify actual current availability and any later artifact's exact source/hashes. An expired or inaccessible artifact does not erase completed validation, and does not establish that a replacement already exists. Do not bypass access controls.

The closeout's read-only source comparison already found reasons that September's gate list cannot be assumed complete:

- Main's icon refresh commit `4ba90f22a36409c4aa5d807f9c81257ba8884a7c` changed all 15 native launcher PNGs, the icon generator/checker and artwork documentation. Current master is `public/brand/pick-for-us-icon-master.jpg`, SHA-256 `12afcedace4aacb19109e561fc70af76076ece7d4997348021422a9396e865d5`. Current `ANDROID_RELEASE.md` explicitly says the refresh does not imply a new native bundle/signing result. Do not restore the older master just to match the September artifact.
- Main's security commit `551c5f89fc4d2f8b054b3b4a5b4dce42ba544536` changed web dependency pins/lockfile, and later releases changed hosted behavior. Preserve those production fixes. The old unsigned AAB is not proof of current-main compilation or current hosted/device acceptance.
- Between the historical branch head and this closeout baseline, native changes under `android/` are the 15 launcher PNGs; `capacitor.config.json`, `native-web/`, the Android workflow and compiled-bundle verifier remain byte-identical. Reverify this claim from Git instead of treating it as a substitute for the full dependency/runtime reconciliation.
- Later desktop/browser acceptance exists in production history. Reconcile its actual scope and revisions rather than carrying forward September's blanket browser-unavailable status. Desktop checks and simulated native permissions still do not establish physical Android/WebView acceptance.

Create a current-state ledger with each gate's status, exact source/artifact/CI evidence, changes since that evidence, and the narrowly justified next action. Distinguish **completed and reusable**, **completed at an older revision but affected by later inputs**, **outstanding/unverified**, and **deferred or requiring separate authorization**. Compare both the validated native candidate and historical branch head to production main across the complete relevant input set, including dependencies and hosted runtime.

**Do not regenerate completed unsigned Phase B work merely because the branch is historical, an old instruction says a build is pending, or the workspace is fresh.** If current resources, dependency inputs or artifact availability demonstrate a need for a fresh unsigned build, document the specific need, check for later exact-revision evidence, and scope only the affected validation. Do not relabel historical results as a fresh run. Decide implementation/build scope only after this reconciliation; this closeout performed none.

## Identity and hosted-runtime invariants

- Preserve application ID/namespace **`com.calebcalvin.pickforus`** and label **Pick For Us**. Read actual current version and SDK/toolchain values before planning work; do not invent a Play registration or reuse a versionCode based on unverified Console history.
- Preserve the configured WebView URL **`https://dinner-roulette-chi.vercel.app`**, its restricted bridged origin, HTTPS behavior, foreground location permission model, native inset/back behavior and bundled error/retry path. The public canonical domain does not authorize changing the native origin to `pickforus.app`.
- The shell loads the hosted application; it does not embed/freeze a branch's React content. The bundled retry page is not a full offline app. Separately identify the native artifact revision and the hosted production revision under test.
- Preserve fail-closed normal release signing and explicit unsigned validation. Do not regenerate the persistent project with `cap add android`, redesign approved artwork, loosen permissions or replace the architecture merely to resume work.
- Preserve historical `android-latest`, its APK and all audit/handoff history. Do not delete, archive, rename or clean up evidence as part of reconciliation.

## Separate authorization gates and hard limits

These are distinct gates, each requiring explicit owner authorization for its own actions; approval of one is not approval of the others:

| Gate | Boundary |
| --- | --- |
| Real signing / certificate identity | Owner confirms the permanent package/account identity and authorizes real upload-key selection/setup, protected secret configuration and signed-certificate validation. No fabricated or placeholder signing credentials. |
| Physical Android / WebView acceptance | Owner explicitly authorizes the device acceptance session and identifies the exact native artifact and hosted revision. Use the complete current `ANDROID_RELEASE.md` checklist; desktop results do not count as device acceptance. |
| Play Console actions | Registration/ownership verification, Play App Signing enrollment, store/policy/testing preparation and any Console mutation need their separately scoped authorization. This handoff authorizes no upload or publication to any track. |

Never commit keystores, passwords, private keys, service-account credentials or Play credentials. Do not generate substitute credentials to make a build pass or request secret values in chat. Do not run the optional signing workflow without its explicit authorization.

Do not upload or publish to Google Play; do not create a public GitHub release or overwrite the historical APK. Do not merge/push to main, change web production, deploy/promote to Vercel production, change Vercel configuration/aliases/domains/environment variables/deployment settings, or run migrations. The ordinary `npm run build` chains migration and must not be used. If later scoped validation needs a web build, follow the repository's migration-free direct Vite procedure and current build-proof requirements.

The seasonal release chain is **CLOSED AND SHIPPED**. Live seasonal ingestion remains deferred, existing OSM discovery is unchanged, and The Werehouse / Myer's Inn Haunt remain the saved anchors. Do not reopen seasonal ingestion, start a source pilot or add features. A real production defect requires a separate scoped decision.

## First reconciliation deliverable

Report verified main SHA/tree/production, historical branch head/ahead-behind/merge base, the new working branch's exact production-main base if created, and the evidence ledger. Explain which old accomplishments remain reusable, which current inputs changed, what artifacts are actually available, what later evidence resolves, and the smallest remaining work. Keep signing/certificate, physical acceptance and Console gates separate and identify their authorization status. Record missing access/evidence honestly.

Finish the current-state reconciliation before beginning any implementation or regeneration. Do not assume September's outstanding-gate list is still complete or that historical Phase B needs restarting. Continue only within the owner's separately specified next-task scope; nothing in this handoff grants production, signing, device or Play action authority.
