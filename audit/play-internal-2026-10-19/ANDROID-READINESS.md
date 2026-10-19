# Android release preparation: independent source and artifact review

As of October 19, 2026. Preparation only. No signing key generated/configured, no upload signing job executed, no Play upload, agreement, registration, production change, or repository edit performed.

## Source identity

GitHub main: e078dcdaa9f0ca84951409cdb92805731af3d34b. Exact tree: 6300c1061a790d84447bb92166f340aec895757b. Candidate cf18ff1c5a56ecf59f8006d4f7c83fb289f393df has the identical complete Git tree, independently confirmed through both Git commit endpoints. The 66 inspected files in source-manifest.json were reconstructed with exact Git blob hashes. Local source check passes, six Android JS tests pass, 17 Python verifier regression tests pass, and all 15 native launcher / four web icon checks pass. An initial icon invocation lacked four web files in the selective review directory; after obtaining/hash-verifying those exact source inputs, it passed. This was a review-directory input omission, not source icon drift.

- Package, namespace, Capacitor ID, Java package/path and resources: app.pickforus.android.
- App label Pick For Us. versionCode 1, versionName 1.0.0; min/compile/target SDK 24/36/36.
- Capacitor core/Android/CLI 8.5.2 exact in package + lock. AGP 8.13.0, checksum-pinned Gradle8.14.3; build tools36.0.0, CI also installs35.0.0 for library modules. Node24/JDK21.
- Remote runtime https://dinner-roulette-chi.vercel.app. AAB is an HTTPS wrapper, not a snapshot of source web content. Native-web supplies the offline error/retry page only.
- Internet + foreground coarse/fine location only in source manifest; no background location. Cleartext, mixed content, WebView debugging and backup are disabled. No wildcard navigation. Launcher exported; FileProvider nonexported with package-derived authority. Custom scheme resource does not add deep-link handling.
- Upload signing requires all four inputs or none, rejects partial inputs, never uses debug release signing. Missing upload key blocks normal release unless explicit allowUnsignedRelease=true for validation. Workflow sign job additionally requires workflow_dispatch AND sign_release; pull-request rerun cannot satisfy it.

## Existing exact-tree artifact independently verified

Run https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/39015345242 attempt1, candidate cf18, October17. Artifact12094098284. Artifact name contains synthetic merge510cef023f5e567aaa591353d6adc9ecd7bb7b44; actual source-revision.txt states cf18. Do not call it a main-e078 run.

ZIP SHA256 d6dbd29ca859704a0a236a2963a8d67a643b6caa3986b255a79c181ce66db507 matches GitHub artifact digest. Both AAB/APK checksums checked against manifest (which has artifacts/ path prefixes, removed only for local lookup).

Unsigned AAB 3,103,485 bytes, SHA256 ac5623cfcae5aecdda24b6c61f04fc251c21a58bc091ea82e536f4aeaebe559a. Debug APK SHA25670cc0814daff34ce92b70dc7ef504028459133c209bd340c1afbf7ee38bf19e5.

The exact-source verifier was rerun against downloaded AAB bytes using official checksum-pinned bundletool1.18.3 and Java21; independent-verification.json/log/XML in attempt1 record PASS. It confirms package/version/SDK, label, correct DEX MainActivity, no old launcher class definitions, FileProvider and optional AndroidX startup identities, no backup/debug/cleartext, exactly four permissions including signature-only app.pickforus.android.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION, 15 launcher images/two adaptive icons, matching bundled config/offline page, no native .so, and UNSIGNED state.

App lint14 warnings/no errors: manifest order1, newer Gradle suggestion1, data extraction rules1, unused resources4, legacy icon shape5, missing monochrome icons2. Explicit Android12+ transfer rules/OEM backup behavior and themed icons remain device/review caveats. AAB has no native libraries, so native ELF16KB alignment is not applicable to these bytes.

## Fresh validation

Only validate job117346203256 was rerun through supported connector. Attempt2 job117953155780 on the same run validates candidate cf18, same complete tree as main. Fresh result PASS; see final supplement below. This is not a workflow_dispatch on main. No broad web browser matrix was restarted.

## Remaining release gates

- Real upload-key handling/configuration/signing remains owner-approved next work; unsigned AAB cannot be uploaded to Play, debug APK is not a release.
- Physical Android/WebView acceptance remains unverified: fresh/alongside install, existing old-ID data preservation, same-target signed update, approximate/precise/denied permission paths, network loss/retry, navigation/external links, display/keyboard insets and device-specific behavior.
- app.pickforus.android installs separately from old IDs; no automatic data transfer. Do not uninstall or clear old installation to test.
- Owner reports verified Caustic Relay developer account, created Play app, available chosen package and saved tester list. These are owner attestations, not independent Console proof. VersionCode1 availability on that account/track and signing eligibility must be confirmed before upload.
- ANDROID_RELEASE.md contains historical statements about an empty Console inventory, unmerged/unpublished PRs and former package artifacts. Those are stale historical context; its September artifact expired October5 and does not validate current package. Use current evidence above and separate live runtime evidence.
- Neither CI nor this review constitutes Google Play approval, a signed upload candidate, policy/legal certification, or physical-device acceptance.

Original CI log qualification: :app:testReleaseUnitTest is NO-SOURCE, as are library unit tests; no native behavioral unit-test pass is claimed. Capacitor dependency lint reports six errors filtered by its existing dependency baseline; app lint has fourteen warnings, not a clean zero-warning audit.

## Final fresh validation result: PASS

Run39015345242 attempt2 completed successfully on October19. validate-android job117953155780 SUCCESS; sign-upload-bundle job117954634084 SKIPPED. Source checkout logs and artifact source-revision.txt both bind cf18, complete tree equivalent to main e078. Safe production web compile, typecheck, JS tests (1,352 pass, four skips, zero failures across 1,356 tests), seventeen Python verifier tests, audits, icons, changed-file lint, clean native sync, missing-key rejection, native lint/build and compiled bundle inspection all passed. Native unit test tasks remain NO-SOURCE, not behavioral acceptance.

New validation artifact12171094706: https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/39015345242/artifacts/12171094706 . Retention until November2,2026 08:07:44UTC. ZIP SHA256960ca4523f18c2ccbd892ccbc329a9177a34955e49762c08dc108cf0b236fb56 matched GitHub digest. Actual AAB bytes downloaded and independently reverified locally with pinned bundletool and exact source script: PASS. Full receipt, source revision, checksums, compiled manifest and independent reports retained in attempt2/.

AAB SHA256ac5623cfcae5aecdda24b6c61f04fc251c21a58bc091ea82e536f4aeaebe559a, 3,103,485bytes; byte-identical to October17 AAB. Debug APK SHA25698ef6b371a6c5dcf2bdc76e92537d4e9bd22bd1879d993fba9d1515051ec2b3e differs from October17, consistent with independently generated development signing/build output; no debug APK reproducibility or release-signing claim. Current app lint still fourteen warnings/no app errors, dependency baseline caveat unchanged.

Preparation checks complete; signing, physical device and Play Console acceptance gates remain open.
