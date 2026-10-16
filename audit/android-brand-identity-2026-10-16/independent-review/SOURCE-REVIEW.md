# Independent Android identity source review

2026-10-16. **PASS for the bounded staged source candidate; native build/artifact and device acceptance remain pending.** No source blocker found. This is not release, signing, registration, upload, merge, deployment or legal-publication approval.

## Exact candidate

- Base/HEAD: `c3208d9fdc9a21d698efa9254be1286f5d3d2836`.
- Independently verified staged tree: `f521ed3dbdabceeb924ad4da1ce88e42db41092c`.
- Checkout: `android-brand-identity-candidate`; candidate not committed at review time.
- Exactly ten changed logical files, including Java rename; `git diff --cached --check` passes and unstaged diff is empty. Source-review tests did not change the staged tree.
- Local PR77 checkout remains clean at `6b370a5202ffb531434d725f49aacbdc325f32c5`, tree `520f545ec006041ef5694a138cfb65f7a897011c`; privacy/terms/history remain unreleased/null. This is a local-source preservation observation, not a live GitHub status claim.

## Findings

Capacitor appId, Gradle namespace/applicationId, Java package/path, package_name/custom_url_scheme and verifier expectations agree on `app.pickforus.android`. Public app and activity labels remain Pick For Us. MainActivity still extends BridgeActivity; existing relative manifest activity resolves to the new namespace. FileProvider still derives authority from `${applicationId}`. Active production Android/config/source-check paths contain neither former package identity. Historical documentation and explicit negative fixtures remain intact.

The source validator checks exact single namespace/applicationId, sole Java/Kotlin source/path and declaration, resource identity, launcher/provider and exact source permissions. The compiled validator adds activity resolution/export/launch-mode, exact MAIN/LAUNCHER filter, FileProvider and optional AndroidX startup authority/security checks; rejects other providers, duplicate authorities, both former identity prefixes and extra/duplicate/SDK-specific permissions. Signature-only receiver protection remains mandatory.

DEX validation follows actual class definitions through class/type/string tables, checks bounds/header/digests, requires exactly one target MainActivity definition in the base module, and rejects old/prototype MainActivity definitions. The independent preliminary review requested prototype-ID coverage; the frozen tree includes that fix and negative fixtures. As a parser smoke test only, the new parser successfully decoded 5,278 class definitions from a prior real AAB and correctly rejected its old MainActivity identity. That prior artifact is explicitly not new-candidate validation evidence.

Byte comparisons confirm no changes to version properties (1/1.0.0), signing.gradle, Android workflow, SDK variables (24/36/36), source AndroidManifest.xml, package dependencies/lockfile or native fallback HTML. Capacitor config changes only appId: runtime remains `https://dinner-roulette-chi.vercel.app`, cleartext/mixed content/WebView debugging remain false, errorPath and SystemBars behavior remain unchanged. No web source, storage keys/schema, artwork or legal documents changed. Source workflow still has read-only permissions, explicit protected signing opt-in, no publication and the missing-key guard.

Generated ignored Capacitor config equals source semantically; synced fallback equals source bytes. Sync introduces no extra tracked drift. README and release notes correctly describe a separate installation/sandbox, no in-place update or automatic data transfer, retaining old installs/data, and separate device/registration/signing gates. Renaming the resource does not imply deep-link support. The documentation labels old native receipts as historical instead of reusing their PASS for this package.

## Tests and evidence

Independently executed from frozen candidate:
- Android source checker: PASS, target package, label, version, SDK and Capacitor version as expected.
- Node Android regression suite: 6/6 PASS, zero skips/failures.
- Python compiled manifest/DEX regression suite: 17/17 PASS.
- Staged whitespace check and unstaged-diff check: PASS.

Reviewed implementer logs: repository tests 1,258 total/1,254 PASS/4 inherited external-document skips; app tests 71/71 PASS; typecheck, changed-file lint, casino audit, Android/icon check, migration-free auth-enabled production build and native sync pass. Full lint reports zero errors and six warnings. Local loopback live-dev/build auth invariant reports sign-in on. Initial pre-build test/auth failures are retained; successful post-build/loopback reruns are the applicable results. Logs are hashed in `source-verification.json`; independent rerun output is `independent-tests.log`.

## Outstanding gates

No new native AAB/APK, Gradle lint, actual native unit-test execution or missing-signing-key runtime execution was available at this review. Those cannot inherit prior-package PASS. Next review must bind original CI archives/logs to a committed head with this exact tree, inspect manifest/DEX/resources/config/provider/permissions and record raw hashes. Native test tasks marked NO-SOURCE must not be described as executed tests.

No physical/emulated installation, coexistence, old-data preservation, same-target update, cold launch, WebView/location/permission/offline/external-link behavior was established. Package-local separation is a design consequence, not observed device behavior. Backup=false alone also does not establish all Android 12+ device-to-device transfer behavior. No Console history/eligibility, domain/brand ownership, registration or certificate entitlement was independently verified here.
