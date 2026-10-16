# PR78 independent Android identity and artifact review

**PASS WITH QUALIFICATIONS for exact-head automated Android identity readiness. No blocking defect found.** Source review and fresh native artifacts agree on the intended `app.pickforus.android` identity. Physical/device acceptance, Console eligibility/registration and distribution remain unverified and separate gates. This receipt grants no merge, deployment, upload, production signing or legal-publication permission.

## Bound source and execution

- Head `4010edf31e71a7350d891a98dd43f20535602abd`, tree `f521ed3dbdabceeb924ad4da1ce88e42db41092c`, sole parent `c3208d9fdc9a21d698efa9254be1286f5d3d2836` independently confirmed through fresh GitHub API reads. This tree exactly matches the independently reviewed staged source.
- [Android run 117](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/38949185071), ID 38949185071, attempt 1: completed SUCCESS. Validation job 117135940449: all 21 reported steps successful. Protected signing job 117137803080: skipped with no steps.
- Original source-revision.txt equals the head plus newline; checkout and rev-parse logs independently corroborate it.
- Artifact names use synthetic PR merge `65b03d5d2437db15cd8762d00386fdf27498d842`. Fresh Git-commit API confirms its parents are the base and candidate and its tree is the reviewed tree. Filename identity is not being substituted for checkout identity.
- Candidate local checkout remains clean at the committed head/tree. Fresh GitHub PR77 read confirms unchanged `6b370a5202ffb531434d725f49aacbdc325f32c5`, draft/unmerged. Its preserved checkout remains clean at tree `520f545ec006041ef5694a138cfb65f7a897011c`; privacy, terms and release history are unreleased/null.

## Original archives and binary hashes

Independently downloaded originals, verified GitHub API sizes and SHA256 digests, CRC, unique/safe paths:

| Item | Bytes | SHA256 |
|---|---:|---|
| Validation archive 12068290260 | 6,865,787 | 970159ec45aeaf0aae9dcb4ed2967e1a60814b9d7aa7d7b08fb0f12fdd22c1fd |
| Lint archive 12067766119 | 24,051 | 53ec85f2ebef7189ca049484d37e80050308423a989ea5649883200368677d23 |
| PickForUs-unsigned.aab | 3,103,485 | ac5623cfcae5aecdda24b6c61f04fc251c21a58bc091ea82e536f4aeaebe559a |
| PickForUs-debug.apk | 4,174,814 | 7953b424b7224649bb4128b05dca83f91a19ced1542621c8ed2587a6893c491f |

Both binary hashes match original SHA256SUMS; AAB matches original verifier JSON. These are fresh new-package artifacts, not previous-package evidence.

## Independent raw compiled inspection

Decoded the AAB protobuf manifest directly and compared its complete normalized tree with archived bundletool XML. Independently decoded the APK binary XML. Both contain:

- Exact package `app.pickforus.android`, versionCode 1/versionName 1.0.0, SDK 24 minimum/36 target/36 compile.
- Sole launcher `app.pickforus.android.MainActivity`, exported=true and singleTask (compiled numeric 2).
- Non-exported FileProvider `app.pickforus.android.fileprovider` and AndroidX startup `app.pickforus.android.androidx-startup`.
- Exactly INTERNET, ACCESS_COARSE_LOCATION, ACCESS_FINE_LOCATION and `app.pickforus.android.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`; exactly one receiver permission declaration with signature-only protection value 2.
- allowBackup=false, usesCleartextTraffic=false. Release AAB is non-debuggable; development APK is debuggable as intended.

Independently traversed actual DEX class definitions in both binaries: AAB 5,278 definitions, APK 5,288. Each defines the target MainActivity exactly once. Neither contains any class definitions in either former `com.calebcalvin.pickforus` or prototype `com.calebcalvin.dinnerroulette` namespace. This is stronger than a manifest-only or string-presence assertion.

Both embedded Capacitor configs equal reviewed exact-head source and preserve `https://dinner-roulette-chi.vercel.app`, cleartext=false, mixed content=false, WebView debugging=false, fallback and native insets behavior. Both fallback HTML files match source bytes. The AAB string resource table contains Pick For Us app/activity labels and target package_name/custom_url_scheme values; 15 launcher PNGs and two adaptive icons are present. Neither binary contains native .so libraries; no ELF alignment execution claim is made.

The AAB has no META-INF signature files and is validation-only unsigned output. APK has an APK signing block; its cryptographic signature was not independently reverified. No upload/distribution certificate identity is established. Hosted checksum-pinned bundletool 1.18.3 validation passes; review did not rerun bundletool or rebuild.

## Checks and qualifications

Original native job log confirms:
- Repository tests 1,258 total, 1,254 pass, four inherited external-document skips, zero failures.
- Application tests 71/71 pass; Python compiled-identity/permission/DEX tests 17/17 pass.
- Typecheck, source/icon validation, audit, migration-free auth-enabled production compilation, native sync/diff, Gradle lint and bundle/debug build steps pass.
- Missing-key guard rejects normal unsigned release at `:app:requireReleaseSigning` with `Release signing is missing.` Only the subsequent validation build uses allowUnsignedRelease=true. Guard log is included in original archive.
- Gradle reports 233 actionable tasks executed and BUILD SUCCESSFUL. There are 37 NO-SOURCE tasks, including all three release native unit-test tasks: native unit tests did not execute. Two lintVital tasks are skipped; full lintRelease passed.

Original lint XML has 14 warnings and no errors: ManifestOrder 1, AndroidGradlePluginVersion 1, DataExtractionRules 1, UnusedResources 4, IconLauncherShape 5 and MonochromeLauncherIcon 2. These match the previous warning categories/counts; no warning-free claim is made. DataExtractionRules remains relevant: backup=false alone does not establish all Android 12+ device-to-device transfer behavior. Full details are preserved in lint-details.json. Other non-failing build/deprecation/data-reconciliation notices are retained in the original log.

Source scope review is in SOURCE-REVIEW.md. Version/security/signing/workflow/dependencies/runtime/storage/artwork and historical evidence were preserved; active native production identity moved coherently. Documentation correctly says separate installation, no in-place old-ID update and no automatic data transfer; old installs/data must remain untouched.

## Remaining boundaries

No physical or emulated Android installation, coexistence, old-data preservation, same-target update, cold launch, hosted WebView load, offline retry, permission dialog/location, support/legal routing or external-link behavior was performed. The binary still loads the legacy remote runtime; it is not a branch web snapshot or deployment proof. No Console history, registration, domain/brand ownership, package eligibility, certificate entitlement, upload, production signing, merge, deployment or legal publication was established by this review. Separate web CI is outside this Android verdict.

## Reproduction and evidence

- `raw-artifact-review.json`: full normalized manifests, binary facts, identity resource bytes, signing-guard hash and original verifier report.
- `inspect_new_artifacts.py` / `binary_parsers.py`: independent read-only archive/manifest/DEX inspection.
- `github-commit-binding.json`, `github-merge.json`, `github-run.json`, `github-jobs.json`, `github-artifacts.json`, `github-pr77.json`: fresh remote evidence.
- `pr78-12068290260.zip` / `pr78-12067766119.zip`: original downloaded archives.
- `native-job.log`: original decoded job log, SHA256 `7496f3691ac368a7b5916265056e93cd8f29b3865fcc3e4780a527a2a47d6f8a` (saved text).

Review made no source changes or external writes. Only review evidence files were created.
