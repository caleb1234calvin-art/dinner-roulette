# PR #63 Android automated readiness — f928 R1

Verdict: **PASS — automated Android readiness for this exact nonproduction candidate.** Reviewed 2026-10-11 UTC. This record supersedes ca1a only for the current candidate; the ca1a evidence remains preserved separately.

- Head: `f92870632b71def18d7642596dc9dd3357675f76`
- Tree: `9153ead1946bbbb7e38c45981c47332997001c3e`
- Parent: `ca1a2979fa3c07fe2ed4f417e153f152288d1553`
- Run: [38107379726](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/38107379726), attempt 1, pull request trigger, SUCCESS.
- Validation job: `114375636896`, SUCCESS. Signing job: `114376293230`, SKIPPED.

Run metadata, checkout logs, immutable git objects and the downloaded `source-revision.txt` agree on the exact head. Artifact names contain synthetic PR merge context `c6d1ce390a11aa5aba3be7208ee6218c107db408`; that name does not replace the actual checkout identity. The only successor changes are two optional-chain predicates in the browser acceptance script. The ten frozen native/workflow inputs match ca1a exactly and native readiness source paths have no difference from released base bf884.

## Executed gates

Node `v24.21.0` ran the auth-enabled migration-free production compilation:

```text
VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production
```

Typecheck PASS; full repository/application tests: **1,077 PASS, 4 inherited skips, 0 failures**. Source/identity/icon guards passed, including 15 launcher resources and 4 web icons with the approved master unchanged. Python manifest negative tests: 3 PASS. Targeted Android-related ESLint and casino audit passed. Native synchronization left `android` and `capacitor.config.json` unchanged.

The ordinary release build failed closed for the missing upload key. The explicitly unsigned validation route then completed `lintRelease testReleaseUnitTest bundleRelease assembleDebug -PallowUnsignedRelease=true`. Native unit-test tasks reported NO-SOURCE; they are not represented as executed native tests. Parsed lint XML exactly matches the hosted summary: **0 errors, 14 warnings**.

The hosted pinned bundletool 1.18.3 verification passed. Downloaded report and compiled XML were inspected against the raw artifact and exact source: package `com.calebcalvin.pickforus`, version 1 / 1.0.0, min SDK 24, target/compile SDK 36, release non-debuggable, backup disabled, cleartext disabled, Internet/coarse/fine location plus the signature-only AndroidX dynamic receiver permission. There are no native `.so` libraries or AAB signature blocks. Embedded Capacitor configuration and native fallback HTML exactly match the frozen source.

## Raw artifact acceptance

Both GitHub artifact ZIPs match upstream byte sizes and SHA256 digests. Every archive member has a retained path, size, compressed size, CRC32 and SHA256 record. ZIP CRC tests, unique safe paths and extraction checks passed for both outer archives and both nested binaries.

| Artifact | Bytes | SHA256 |
| --- | ---: | --- |
| Validation ZIP, GitHub `11690019239` | 6,866,409 | `3a30bfaa015b75ea44389db3c384b307860142d1fcf0c463fec2263fc9be3575` |
| Lint ZIP, GitHub `11689869656` | 24,069 | `33803eb294b66820475db92888b63b76b8ae4807eb8a7a9bda82e67d63358212` |
| Unsigned AAB | 3,103,535 | `4cead0e51c28e90e5a0d42149e3952690d19a4f61f05bae1cacf55c6c3b5e4ee` |
| Development APK | 4,174,862 | `88ea993e3f6a0e97705a9c817abd07b07ff2cdec078cc9eff1977dbc1b46a589` |

The release AAB is byte-identical to the prior ca1a unsigned bundle. The newly generated development APK has its own hash; it is verified against this run's checksums and source assets.

## Scope limits

No upload signing, publishing, Play action or repository edit occurred. The native container loads `https://dinner-roulette-chi.vercel.app`; these binaries are not an offline package of the PR #63 web candidate. Physical Android/WebView/GPS/arrival and Play Console acceptance remain HOLD / NOT VERIFIED. Compiled XML is preserved hosted bundletool output; this review does not claim a separate local bundletool rerun.

The machine record, raw log, terminal metadata, downloaded ZIPs, extracted files, four member manifests, immutable source inputs and reproducible evidence verification script are retained alongside this report. A second reviewer completed 1,760 fresh independent raw evidence checks with PASS; `Independent-Android-Raw-f9287063.json` SHA256 is `eeca3f14283164f80cb5cbae4b3b3d98a0c36b2fe9b42ab59aaa2c2e48acb8c5`.
