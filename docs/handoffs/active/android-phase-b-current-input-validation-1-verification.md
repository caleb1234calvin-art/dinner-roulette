# Pick For Us — Android Phase B Current-Input Unsigned Validation #1 — Independent Verification

## Task and authority

Repository: `caleb1234calvin-art/dinner-roulette`.
Published branch: `feature/android-current-input-validation-1`.
Status: **UNSIGNED CURRENT-INPUT VALIDATION PASSED — AWAITING FRESH INDEPENDENT VERIFICATION**.

The owner authorized one minimal Android CI prerequisite-order correction and one fresh unsigned current-input validation, then this publication. This is a continuation of completed Phase B, not a restart. The next worker must be a fresh independent verifier. Do not execute historical next-action instructions.

Read in full:

1. This handoff from the exact publication tip in the external review package.
2. `android-phase-b-current-input-validation-1-review-package.txt` and accompanying evidence archive.
3. `android-phase-b-current-state-reconciliation-1-review-package.txt` (a full copy is retained as `reconciliation-report.txt` in the evidence archive).
4. At exact closeout `c390a7bbcb5955303571fbfdd631d750df4f2a89`, `docs/handoffs/active/android-phase-b-production-baseline-resume-1.md` and its new top `AI_CONTINUITY.md` section. Closeout tree `bb2d56c3a13e9e755df666e85d195d05e3efdad1`, sole parent the frozen main below; only continuity and that resume handoff differ.
5. Current `.github/workflows/android-apk.yml`, `ANDROID_RELEASE.md`, native README, source/config/signing/version/toolchain/icon and bundle-verifier files, package/lockfile, test runner and compiled-security tests. Required older Android/pre-merge context was read by the implementation worker and is retained as dated evidence; the reconciliation governs reuse. The old local-validation order in ANDROID_RELEASE.md is historical and does not override the corrected prerequisite order here.

This task authorizes read-only independent inspection and necessary local verification, not remediation, commit/push, workflow dispatch/rerun, merge, production deployment, migrations, real signing, physical-device acceptance, Play Console actions, or public release changes. Stop on a discrepancy; do not change assertions or dependencies to get a pass.

## Immutable identities and publication relationship

| Object | Exact identity |
| --- | --- |
| Frozen production main / candidate sole parent | `5534866e528e16721baa7369c0980f65b00a94b2` |
| Main tree | `ea0ecb0c6e1e7bee1859d82b29fb09fef9a15c13` |
| Immutable implementation and CI validation candidate | `069f1657897d14a31bf24a76b0baa95b43c93f94` |
| Candidate tree | `0732c61941ede4e47f16f64c857e75bbb57ce979` |
| Current hosted revision | `5534866e528e16721baa7369c0980f65b00a94b2` |
| Production | `dpl_3Bfbq9TPJqsrgCx4UKX1r9ANDZRj` — READY, Git main |
| Retained rollback | `dpl_HmqKyiLqCqMSTrhxKktsy9mJtDKy` — READY |
| Preserved historical Android branch/head | `polish/pre-google-play-pass-1` / `0a8f30dc57fcc1156342d1bfc8a07524f3125e3b` |

The historical branch remains 0 ahead / 87 behind main, with merge base equal to its head. It was not used as the working base or altered.

This handoff is the **only addition in a later, sole-parent publication child of the candidate**. The child cannot embed its own SHA/tree. Resolve those exact values from the external review package and remote readback, and prove the full-tree relationship independently. No candidate amendment, merge, rebase or remote force update occurred. Candidate and publication have identical executable/build inputs.

Transport note: local provisional commit `0c8acccd79e5256c75760af71dac895412c82122` has the same candidate tree and sole parent. Ordinary HTTPS push lacked credentials. Authenticated GitHub Git-data tools published the identical tree as `069f165...`; the local checkout was then aligned to that actual published candidate. The provisional SHA is not the CI source. This distinction is retained in `attempts.txt` and `candidate-scope.json`.

## Complete changed-path allowlist and minimality

Candidate versus main changes exactly one path:

`.github/workflows/android-apk.yml`

It relocates the existing, unchanged four-line **Validate web production compilation without migrations** step from after **Validate source, identity, icons, and regressions** to immediately before it. The build command remains exactly:

```sh
node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production
```

Its existing step-level `VITE_AUTH_ENABLED: "true"` stays attached only to that build. The subsequent `npm test` command and every other step are byte-identical and keep their original environment. Removing the build block from both old and new workflow must produce identical text. Diff: four additions, four deletions, no other implementation change.

This supplies the actual `.vercel/output/functions/__server.func/_ssr/ssr.mjs` prerequisite required by `scripts/tanstack-security.test.mjs`. Original failure: run `37158788359`, job `111307641573`, at `761832d58c75f9cda857886ead908e58f4d02a56`; fourteen compiled-security tests and their failed-file/cleanup summary encountered missing output. No test was skipped, filtered, weakened, rewritten or reordered to evade the prerequisite.

All 1,262 other candidate entries preserve main's blob/mode identities. The publication adds only:

`docs/handoffs/active/android-phase-b-current-input-validation-1-verification.md`

The complete publication-versus-main inventory is therefore these two paths. No dependencies/lock, application source, native source, artwork, version, permission, WebView origin, build toolchain, signing logic, release logic, Vercel config or seasonal source changes are permitted.

## Executed validation and source binding

One fresh Android run: **`37542893697`**, attempt **1**, event **push**, head **`069f1657897d14a31bf24a76b0baa95b43c93f94`**, completed **success**.

- Validation job **`112539866007`**: success.
- Optional signing job **`112541198598`**: **skipped**, not passed or executed.
- Run created `2026-10-06T22:48:31Z`; completed run metadata updated `2026-10-06T22:52:33Z`.
- Checkout log, `git rev-parse HEAD`, artifact API head identity, and actual archived `source-revision.txt` all identify the candidate. Artifact display names are not used as provenance.

| Gate | Fresh result |
| --- | --- |
| Exact-lock installation | CI and local `npm ci --no-audit --no-fund` pass; 506 packages installed |
| Complete dependency graph | Local `npm ls --all --json` exit 0, no problems; package/lock unchanged |
| Dependency resolution | Nitro's nested unstorage resolves root LRU 11.5.2 satisfying ^11.2.6; modern API probe passes; Babel retains nested 5.1.1 |
| Application build | CI direct Vite production build passes before regressions, with auth override scoped to its step; no migration chain |
| Typecheck | Pass |
| JavaScript suite | 677 repository + 71 application = **748 passes**, 0 failures; four inherited external-documentation skips |
| Actual compiled transport/security | **14 passes included within 748**, zero skipped; source tests/assertions unchanged |
| Casino invariants | 883 canonical / 899 serialized / 60 passes retained |
| Source identity and approved derivatives | Android check passes; all 15 native and four web derivatives pass deterministic non-writing check |
| Python permission-verifier regressions | **3 passes**, separately counted |
| Existing bounded lint | Pass for check-android, android-release test and Settings component |
| Capacitor sync | Pass, followed by successful `git diff --exit-code -- android capacitor.config.json` |
| Normal release without real signing inputs | Expected nonzero result with exact `Release signing is missing.` message; guard passes |
| Native build | `lintRelease testReleaseUnitTest bundleRelease assembleDebug -PallowUnsignedRelease=true`; **BUILD SUCCESSFUL in 1m 41s**, 233 actionable tasks, 233 executed |
| Native unit tasks | App, Capacitor and Cordova `testReleaseUnitTest` are **NO-SOURCE**; no native behavioral test pass claimed |
| Compiled AAB verifier | Checksum-pinned bundletool 1.18.3 and unchanged verifier pass |
| Local artifact inspection | Archive CRC/hash/source identity, compiled manifest, native config/retry bytes, absent native libraries/signature entries and current launcher pixels pass |

Lockfile SHA-256 remains `462f09bd3fda35cf30646b2f343cd8d2a65340a63b59222b5f9d57084d9aa4b3`.

Local supplementary migration-free build proof at the identical provisional tree: source SHA-256 `34cda89cc96b85c52dc5fa86252d0a5b4b6bf40cae945ca244023328ce8f1dc3` / 427 files; output `59d8a6c20e7cae0b35cfde7f534c6816d053514857057b702cddfb0aa16a6544` / 194 files. Capture `2026-10-06T22:47:30.860Z`, completion `2026-10-06T22:47:33.424Z`; proof reverified after checkout of the actual published candidate. This is supplementary local output, not relabeled CI output. No broad browser acceptance was rerun; current-equivalent prior browser evidence is reused within its original limits.

A supplemental probe initially used the wrong root resolution context for nested unstorage. The corrected external probe used Nitro's actual context and passed; no repository input changed. The error and correction are disclosed in `attempts.txt`.

## Exact unsigned artifacts

| Object | Bytes | SHA-256 |
| --- | ---: | --- |
| Validation archive, artifact **11448963058** | 6,866,411 | `dbbff6af7b2d3834a13f8221eee7c8d5f3b4912038c5d4ed4f5abf521e9f02f0` |
| `PickForUs-unsigned.aab` | 3,103,535 | `4cead0e51c28e90e5a0d42149e3952690d19a4f61f05bae1cacf55c6c3b5e4ee` |
| `PickForUs-debug.apk` | 4,174,862 | `13e437ca733a456bcf4a68b37fc5c1e73b0755a6e47a6d31c42ce08e83dc3d7a` |
| Lint archive, artifact **11449078087** (API metadata) | 24,069 | `1183e1f8fcdacea2fc2b577d3fb088cd06271077d7496c000d8cfb93ea7bca8a` |

Validation archive retention is 14 days; API expiry **2026-10-20T22:52:22Z**. Lint artifact expiry **2026-10-20T22:52:24Z**. Both were unexpired on inspection. Validation archive was downloaded through authorized access; actual byte count/digest match API metadata. The lint ZIP was not separately downloaded; its lint summary is included in the inspected validation archive.

The development APK is an ordinary development/debug artifact, not a real upload-key candidate. No real signing credential was generated/configured or used. The unsigned AAB is not upload-ready.

Compiled package/namespace: **com.calebcalvin.pickforus**; app label **Pick For Us**; versionCode **1** / versionName **1.0.0**; SDK min/compile/target **24/36/36**. Release debugging, backup and cleartext are disabled. Capacitor config and bundled retry page match source; HTTPS WebView origin remains **https://dinner-roulette-chi.vercel.app**. The shell loads hosted main; the AAB does not freeze hosted React behavior.

Exact compiled uses-permission set:

- `android.permission.INTERNET`
- `android.permission.ACCESS_COARSE_LOCATION`
- `android.permission.ACCESS_FINE_LOCATION`
- `com.calebcalvin.pickforus.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`

Receiver permission declaration is signature-only **0x00000002**. No background-location permission. Optional location hardware remains optional. No `.so` files are packaged; this does not claim physical 16KB/device acceptance. No META-INF upload-signature block or signature-file entries exist in the AAB. Both adaptive XML resources are present, and the compiled manifest references `@mipmap/ic_launcher` / `@mipmap/ic_launcher_round`.

## Explicit current-artwork proof

Master: `public/brand/pick-for-us-icon-master.jpg`, 494,490 bytes, 1536x1536 RGB JPEG, SHA-256 **`12afcedace4aacb19109e561fc70af76076ece7d4997348021422a9396e865d5`**.

Current deterministic `--check` passes for all 19 outputs. No artwork was generated, redesigned or rewritten.

The actual AAB has exactly the expected five density sets, with standard, round and foreground PNGs in each. For every resource, the independent external acceptance script maps `base/res/mipmap-DENSITY-v4/NAME.png` to candidate `android/app/src/main/res/mipmap-DENSITY/NAME.png`, verifies dimensions, converts both to RGBA, and compares **every decoded byte**. Each current source PNG is also confirmed identical to production-main source. All **15/15** match current pixels. All **0/15** match the September 29 derivatives at `8bd1a0b47c3b1b0dbeafddede2e4f2e0ca30728f`.

Eight PNGs are also byte-identical; seven have different compiled PNG encodings but identical dimensions and all RGBA pixels. This is not a count-only acceptance or a tolerance-based visual claim.

External `current-launcher-proof.json` records all 15 source/packaged PNG hashes, dimensions, source/packaged RGBA hashes, historical comparison hashes, and exact source/artifact bindings. Its SHA-256 is **`0d6371f30834d3992f796965634e8edfb4d835fb77bcad6b48394f7d6fae2a14`**. Reproduction script: `verify-current-launchers.py`. Verify its assertions independently; do not trust the PASS field alone.

## Warnings and honest limits

Android app lint: **0 errors, 14 warnings**: ManifestOrder 1; newer Gradle suggestion 1; DataExtractionRules 1; unused template/sync resources 4; opaque legacy launcher shape 5; absent monochrome icon 2. Capacitor's unchanged vendor baseline filters six dependency errors and notes six baseline entries not reproduced. No suppression or upgrade was added.

Other retained notices: flatDir repositories, unchecked Java, existing npm uuid/recharts/eslint deprecations, Actions Node target/setup-java deprecation, and punycode/url.parse warnings. Full raw logs are retained. Four JavaScript skips concern optional absent workspace OG documentation; no runtime/security test was skipped. Full-repository web lint is not claimed clean. Physical Android/WebView behavior, upload-key/certificate identity, Console ownership/version availability, Play App Signing and store/track acceptance remain unverified and separately gated.

## Preservation and evidence

Before mutation and again after candidate validation, protected main and READY production match the exact identities above. Five production aliases remain:

- `pickforus.app`
- `www.pickforus.app`
- `dinner-roulette-chi.vercel.app`
- `dinner-roulette-minions-9e2c.vercel.app`
- `dinner-roulette-git-main-minions-9e2c.vercel.app`

`www.pickforus.app` keeps the 308 redirect to `pickforus.app`. Final post-publication readbacks and exact publication-child identity are in the external review package/evidence, because this file cannot include its own future commit identity. Independently reverify all five current assignments; an old deployment's historical alias list alone is insufficient.

Historical `android-latest` remains release **383654296**, asset **562367955**, `DinnerRoulette.apk`, 4,274,125 bytes, digest `e461ebd24f2edd0a77ec5ccaf2dc6e4ce347b95a316c6b0145cb9a99ea17281b`, asset updated 2026-09-14T02:17:09Z. No public release mutation occurred.

No main push/merge, production deployment/promotion, Vercel configuration/alias/domain/environment change, migration, seasonal ingestion, optional signing execution, device session or Play action occurred. Only this feature branch was published. Automatic non-production behavior was permitted; no manual Preview deployment was requested.

External evidence includes full authority copies, original failed CI log, fresh CI metadata/logs, exact downloaded archive and extracted contents, source/tree/diff receipts, complete npm graph, local build proof, launcher verifier/proof, compiled manifest checks, warnings/NO-SOURCE, attempts and final preservation receipts. No raw artifact, credential or build junk is committed to Git.

## Fresh independent verification procedure and decision

1. Independently fetch/read main, candidate and exact publication tip; prove SHA/tree/sole-parent relations, one-path candidate diff and handoff-only child. Stop on drift or unexpected paths. Preserve the historical branch.
2. Verify the exact build block moved without internal changes and all other workflow text/tests are unchanged. Verify build-only auth scope, migration-free direct Vite command, real compiled-security prerequisite, fail-closed guard, optional signing condition, contents:read and artifact-only behavior.
3. Use a clean isolated candidate checkout and exact lock for any fresh source verification. Locked install and `npm ls --all --json` must pass without changing package/lock. Check current source and deterministic artwork non-writing. If running tests, first capture/build/complete/verify with build-only VITE_AUTH_ENABLED=true using the direct Vite command; run tests with `env -u VITE_AUTH_ENABLED npm test`. Never ordinary `npm run build` or migrations. Do not filter tests or modify assertions.
4. Independently inspect the successful exact-candidate CI run, every required step, checkout identity, totals, warnings and three NO-SOURCE native unit tasks. Signing job must remain skipped. Do not trigger another workflow merely to repeat an already-retained artifact.
5. Obtain original artifact 11448963058 or its preserved exact ZIP, verify archive bytes/hash/CRC, actual source-revision.txt and contained SHA256SUMS, and inspect the AAB/APK identities above. Run unchanged checksum-pinned bundle verification locally if tooling permits; distinguish that fresh check from the CI proof. Do not generate signing credentials.
6. Independently compare all 15 AAB launcher resources with candidate derivatives and approved master. Require exact per-resource dimensions/RGBA equality and correct mappings; a count of 15 is insufficient. Verify source and packaged config, retry page, manifest identity/version/SDK/permissions/security, no native libraries and no upload-key signature.
7. Verify evidence integrity and final main/production/five-alias/www-redirect/rollback preservation. Any substantive mismatch is HOLD/FAIL; do not remediate or proceed into signing/device/Play gates.

Return **PASS — CURRENT-INPUT UNSIGNED CANDIDATE INDEPENDENTLY VERIFIED** only if all required identity, scope, build/test, artifact/artwork and preservation checks pass. A pass does not authorize main promotion, signing, physical acceptance, or Play actions. Otherwise report the exact unmet gate and stop.

**Exact next task: fresh independent verification of this immutable candidate and handoff-only publication. Then stop for the owner's next scoped decision.**
