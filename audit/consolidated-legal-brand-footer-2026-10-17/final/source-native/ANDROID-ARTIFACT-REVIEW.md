# Independent PR80 compiled Android review

2026-10-17 05:07 UTC. PASS WITH QUALIFICATIONS for fresh exact-head automated Android packaging and identity. No blocking defect found. Physical-device behavior, unpublished web content, signed distribution, Play acceptance and release remain HOLD.

## Source and execution binding

Draft PR80: https://github.com/caleb1234calvin-art/dinner-roulette/pull/80

- Head 29bec315b919535c9aeb3f7e8b1c9e3fa638e80d, tree de43c3ee90ad31e5de678737be1eed61b6eb6d01, already independently bound to all 1,486 reviewed source entries.
- Android run https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/39004750057, attempt 1, completed SUCCESS. Fresh GitHub run/job/artifact reads preserved independently. Validation job 117314809153 succeeded; protected signing job 117315552672 was SKIPPED.
- Original source-revision.txt equals exact head plus newline. Independently fetched native job log corroborates checkout and two rev-parse outputs at the exact candidate.
- Artifact filenames contain synthetic PR merge 49bc7d874e8b944fb619fa113c5c90f124e0c4e3. Independent Git-commit read confirms its base/candidate parents and tree equal to the reviewed candidate. Filename identity was not substituted for checkout identity.
- Local candidate tree is still de43c3ee90ad31e5de678737be1eed61b6eb6d01 and tracked worktree is clean at final review.

## Original archive and binary verification

Read originals downloaded by implementation owner, independently hashed complete bytes and matched fresh GitHub API sizes/digests. Both ZIPs and both nested binaries passed full CRC, unique/safe paths and entry checks. Every outer member was hashed independently.

- Validation artifact 12090581502: 6,865,793 bytes; SHA256 2812ea6fc9ac772536fbf87c38617c78b10d6029c703e2e2beecb5a25da99f83.
- Lint artifact 12090257285: 24,051 bytes; SHA256 62c4359dac56b65c47c785f3a5cb6149e36c51fcc25e3f89a7e585b5b33c6b15.
- PickForUs-unsigned.aab: 3,103,485 bytes; SHA256 ac5623cfcae5aecdda24b6c61f04fc251c21a58bc091ea82e536f4aeaebe559a.
- PickForUs-debug.apk: 4,174,814 bytes; SHA256 8a46e4aebfb7b8a432ff3286c4652788beb3cf0a30194b81d86c67a47c8a3ff1.

Both binary hashes match original SHA256SUMS; AAB also matches original bundle-verifier JSON. The fresh AAB is byte-identical to PR78's old AAB, consistent with unchanged native inputs and remote-site wrapper packaging. Its current source binding, original acquisition, full parsing and checks were performed anew; no old binary PASS or device observations were transferred.

## Independent raw compiled findings

Used read-only independent parsers, separate from the candidate verifier. Prior parser implementation is reused as tooling, not prior validation evidence. Decoded AAB protobuf manifest directly and compared the entire normalized tree with original bundletool XML. Decoded APK binary XML separately. Both have:

- Exact package app.pickforus.android, versionCode 1/versionName 1.0.0, minSdk 24, targetSdk 36 and compileSdk 36.
- Exactly one activity and launcher, app.pickforus.android.MainActivity, exported=true, launchMode singleTask (compiled numeric 2), no activity aliases.
- Exactly non-exported androidx.core.content.FileProvider at app.pickforus.android.fileprovider, with grantUriPermissions=true, and non-exported AndroidX startup provider at app.pickforus.android.androidx-startup.
- Exactly INTERNET, ACCESS_COARSE_LOCATION, ACCESS_FINE_LOCATION and app.pickforus.android.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION. No SDK-specific uses-permission entries. Exactly one permission declaration, the receiver protection, with signature-only value 2.
- allowBackup=false, usesCleartextTraffic=false. Release AAB is non-debuggable; development APK is debuggable as intended.

Traversed actual DEX class definitions, verified DEX digests, and checked identity separately for each binary: AAB 5,278 definitions, APK 5,288. Both define target MainActivity exactly once. Neither defines any class in old com.calebcalvin.pickforus or prototype com.calebcalvin.dinnerroulette namespaces.

Both embedded Capacitor configs equal reviewed source exactly. HTTPS remote runtime https://dinner-roulette-chi.vercel.app, cleartext=false, mixed content=false, WebView debugging=false, fallback and native SystemBars insets remain preserved. Embedded fallback HTML matches source bytes. AAB resource table contains Pick For Us app/activity labels and app.pickforus.android package_name/custom_url_scheme. Fifteen launcher PNG resources and two adaptive icons are present. Neither binary contains native .so libraries; this is not executed ELF alignment testing.

AAB has no signing .SF/.RSA/.DSA/.EC entries and is unsigned validation output. APK has an APK signing block, but this review did not cryptographically verify its debug signature or establish upload-certificate identity. Original checksum-pinned bundletool 1.18.3 validation says PASS; independent review did not rebuild or rerun bundletool.

## Logs and warnings

Original native log confirms successful migration-free authenticated production build, typecheck, source/icon checks, casino audit, native sync/diff, Gradle lint and fresh AAB/debug APK compilation. Repository tests: 1,274 total, 1,270 passed, four documented skips, zero failures. Application tests: 73 passed. Python compiled manifest/DEX tests: 17 passed.

Normal bundleRelease first failed closed with the explicit missing-upload-key message and :app:requireReleaseSigning failure, preserved in original signing-guard.log. Only the subsequent validation build uses allowUnsignedRelease=true. Protected signing job did not run. Gradle reports 233 actionable tasks executed, but 37 task entries are NO-SOURCE, including all three testReleaseUnitTest tasks. Native unit tests did not execute. Two lintVital tasks are SKIPPED; lintRelease ran successfully.

Independent original lint XML read: 14 warnings, zero errors. Categories: ManifestOrder 1, AndroidGradlePluginVersion 1, DataExtractionRules 1, UnusedResources 4, IconLauncherShape 5, MonochromeLauncherIcon 2. These match historical categories/counts; this is not warning-free or production-ready acceptance. DataExtractionRules still means backup=false alone does not establish all Android device-to-device transfer behavior.

## Boundaries

This binary loads existing production HTTPS content, not the combined branch's unpublished legal/footer web content. No physical/emulated install, alongside-install/data preservation, same-target update, cold launch, native permissions/GPS, offline retry, support mail handler, external-link or real-device footer acceptance was performed. Historical owner observations, including intermittent offline/cross-app issues, remain scoped and unresolved unless separately retested. No final store screenshot acceptance transfers.

No merge, deployment, package registration, production signing, upload, Play declarations/agreements, legal effective date or publication is approved. Policies remain v1.0 unreleased with null effective dates. Browser acceptance is separately owned and is not implied by this Android PASS.

## Durable evidence

- raw-artifact-review.json: complete normalized manifests, binary facts, identity resource bytes, original verifier report and member hashes.
- original-archive-verification.json: original sizes/digests, CRC/path checks, member hashes and all lint issues.
- compiled-evidence-binding.json: source/run/job/synthetic-merge binding and execution qualifications.
- github-android-run.json, github-android-jobs.json, github-android-artifacts.json, github-synthetic-merge.json: independent API receipts.
- android-job-original.log and android-job-log-receipt.json: original independently fetched native log and receipt.
- inspect_consolidated_artifacts.py and binary_parsers.py: read-only inspection tooling.
- Original ZIPs remain under consolidated-release-validation/artifacts with IDs in their filenames; review did not download duplicates or alter them.

No source files or external state were modified by this review.
