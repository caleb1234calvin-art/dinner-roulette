# Pick For Us package and public-brand migration proposal

Read-only audit, 2026-10-16. Decision: CONDITIONAL GO for a bounded candidate after registration/history checks and explicit final identity approval. The user authorized an isolated bounded migration proposal or implementation candidate where authorized. No final permanent identity/registration approval; this lane intentionally remains a read-only proposal while history is unresolved. No signing, upload or publication is authorized by this proposal.

## Verified baseline and reuse

Audited existing `legal-support-candidate` without modifying it: PR77 head `6b370a5202ffb531434d725f49aacbdc325f32c5`, tree `520f545ec006041ef5694a138cfb65f7a897011c`, clean status before and after inspection. Comparison main supplied by parent: `c3208d9fdc9a21d698efa9254be1286f5d3d2836`. This is a pinned local-source audit, not a fresh claim about live GitHub/production/Console state.

Reused `play-compliance-2026-10-16/deliverable/PACKAGE-IDENTITY-DECISION.md`; this report adds exact current surface mapping, test gaps, branding limits, and a gated execution sequence. Complete tracked text matches are retained in `TRACKED-REFERENCE-INVENTORY.txt`; identity-containing paths in `IDENTITY-FILES.json`. Historical evidence is deliberately not rewritten.

PR77 privacy, terms and release-history inputs remain `status: unreleased`, `effectiveDate: null`. No build/test/sync, source write, key access, registration, upload, deployment or publication was performed. Generated native config was not present in this checkout; generated-output conclusions below are requirements, not observations of a new build.

## Important findings

1. `app.pickforus.android` is syntactically suitable. It is a different installation and Play identity from `com.calebcalvin.pickforus`, not a display-name change. Neither domain ownership, identifier availability, previous Console uploads nor developer-verification registration is established by repository inspection or a public search.
2. Public app name remains **Pick For Us**. **Caustic Relay** is the personal operator/developer brand, not a newly asserted legal entity. PR77 already uses that brand in Settings, support and legal pages; no additional product-label rename is needed.
3. Public-brand privacy has a limit: Google permits a developer display name different from the legal name, but personal-account legal name, country and developer email are shown; monetization adds full address, and regional requirements can add more. Do not promise that changing the package/display brand removes the legal name from Play.
4. Current Android check validates Capacitor and Gradle IDs but not Java path/declaration or resource identity strings. Bundle verifier checks manifest package/permissions but not resolved MainActivity or provider authorities. Add negative regression tests for these migration failure cases.
5. Existing CI is artifact-only and already covers native input changes. No workflow publishing permission, signing-secret rename, runtime-host move, dependency upgrade or artwork regeneration is required by the package switch.

## Bounded change set, after approval

| Surface | Current evidence | Proposed action |
|---|---|---|
| `capacitor.config.json:2` | appId old ID; appName Pick For Us; legacy HTTPS runtime | Change only appId to target; keep appName, runtime URL and security settings |
| `android/app/build.gradle:12,16` | namespace and applicationId old ID | Set both to target; keep explicit applicationId so namespace refactoring cannot silently alter it |
| `android/app/src/main/java/com/calebcalvin/pickforus/MainActivity.java:1` | Empty BridgeActivity subclass in old package | Move to `android/app/src/main/java/app/pickforus/android/MainActivity.java`; update declaration |
| `android/app/src/main/res/values/strings.xml:5-6` | package_name/custom_url_scheme old ID | Update both to target; app_name/title remain Pick For Us |
| `scripts/check-android.mjs:8` | APP_ID and source consistency checks | Change constant; extend checks to Java path/package, no stale class, resource values, relative activity resolution and provider placeholder |
| `scripts/android-release.test.mjs:9,13` | Current-ID assertion; prototype drift negative case | Assert target; reject both former IDs plus isolated Java/resource/namespace drift with targeted fixtures |
| `scripts/verify-android-bundle.py:25,71` | Old receiver permission and manifest-package literal | Update expectations; check exact target MainActivity, target FileProvider authority and AndroidX startup authority when present; keep signature-only receiver requirement |
| `native-android/test_bundle_inspection.py:11` | Old package receiver fixture | Update target fixture; add old-ID, mismatched activity/provider/permission negatives to any new verifier helpers |
| `ANDROID_RELEASE.md` | Historical Run35 receipt at top; current configuration table | Preserve old receipt accurately as history, add a new candidate receipt and update current instructions/table only |
| `README.md:14-18` | Compatibility warning about existing old-ID shells | Preserve this historical compatibility fact; add new-ID candidate context without pretending installed shells changed |

Eight existing source/config/test files (including the moved Java file) and two current docs comprise the core edit scope (the table identifies all paths). Test helper additions, if necessary, must remain bounded to identity validation. Do not globally replace strings across the 1,477 tracked paths.

Manifest `android:name=".MainActivity"` must resolve to `app.pickforus.android.MainActivity`. FileProvider `${applicationId}.fileprovider` should naturally resolve to `app.pickforus.android.fileprovider`; retain the placeholder. AndroidX generated signature permission should become `app.pickforus.android.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`. Generated classes R/BuildConfig follow namespace. No explicit testNamespace/testApplicationId exists; if test artifacts are built, inspect derived test IDs for drift rather than inventing new declarations.

`custom_url_scheme` is currently only a resource value: manifest has MAIN/LAUNCHER, no VIEW/BROWSABLE filter. Renaming that value does not add or validate deep links.

## Generated, dependency and CI audit

- `android/.gitignore` excludes copied web assets, generated Capacitor config/plugin JSON, generated XML config, Cordova plugin project, and build outputs. After authorized edits, run the existing sync rather than `cap add` or regenerating the native project. Inspect ignored generated config as well as tracked sync stability.
- `android/app/capacitor.build.gradle`, `android/capacitor.settings.gradle`, settings/root Gradle, version file, wrapper, pinned Capacitor 8.5.2 and icon derivatives do not need identity edits. Check new outputs rather than editing dependency/generated upstream packages.
- No tracked google-services.json, assetlinks.json, Firebase/native Maps service registration, Android OAuth client, Play publishing config or extra Java/Kotlin application classes were found. This is not evidence that external/private registrations do not exist.
- `.github/workflows/android-apk.yml` uses current PR head and runs source checks, full tests, migration-free web build, native sync/diff, missing-key guard, Gradle lint/unit tasks, unsigned bundle and debug APK, and bundle inspection. Existing pull-request path filters cover the intended changes. Push branch filters are narrower; use an authorized draft PR or explicit validation dispatch if needed, rather than assuming a new arbitrary branch push starts Android CI.
- Existing protected signing job only runs for explicit workflow dispatch with `sign_release: true`. Do not run it for this proposal. Preserve `contents: read`, default false, protected environment, secret names and no-publication behavior.
- CI artifact names use PickForUs, not personal names. Old artifacts, checksums and old-package receipts remain historical. All new evidence must bind exact new head/tree and unsigned artifact hashes.

## Public branding and personal-name inventory

Current app-facing text in `src/`, `public/` and `index.html` has no Caleb personal-name match. Current Caustic Relay matches are the legal policy, Settings and support footer/contact, and `/brand/CAUSTIC_RELAY_ident-2.mp4` source. Binary artwork/video frames were not re-rendered or OCR-inspected in this text audit; approved icon master/ident should remain untouched.

Other occurrences are not all defects:
- Old Android IDs expose the personal-name string in inspectable package metadata; migration changes future builds only.
- Repository-owner links (`caleb1234calvin-art`) are provenance URLs. Rewriting them breaks links and does not erase history. GitHub owner/repository/account migration is separate scope.
- `ANDROID_RELEASE.md` refers to the Mordax ident. This is legacy documentation/creative naming; app startup references the Caustic Relay asset. Do not redesign or replace approved media to resolve wording.
- Legacy Vercel runtime URL, internal session-hint keys/events and provider User-Agent `DinnerRoulette/3` are compatibility/technical references, not personal names. They do not need changing for this ID migration. The persistence key `pick-for-us-v1` must remain unchanged.
- npm workspace name `app-builder-workspace` is not the Android package or Play developer name.
- Existing audit/docs/continuity logs intentionally retain previous identities. Preserve them and append new bounded evidence.

## Installed builds, data and signing consequences

Changing application ID creates a separately installed app. Existing old-ID builds do not receive the new-ID artifact as an in-place update, even if signing keys are reused. Old favorites/history/settings and WebView cookies/storage remain associated with the old app sandbox; same hosted URL does not make storage shared across Android apps. New app permissions must be granted anew. Do not uninstall the old app or clear its data as part of migration; app-specific files are removed on uninstall. Existing backup=false and no migration feature mean there is no automatic-transfer promise.

A separate origin change to pickforus.app would independently create a browser/WebView origin storage boundary; this proposal keeps the legacy HTTPS runtime and does not combine both migrations. No storage schema/key, account, auth callback, external Maps link or hosted-runtime change is required just to change package ID.

Android distinguishes upload and distribution signing. Package change does not inherently require generating a new key, nor does reuse make it the same application. Confirm the chosen new package's signing/enrollment state, registered certificates and any package-plus-certificate API bindings before authorized release preparation. Debug APK is development-only; unsigned AAB is validation-only. Existing verifier's jarsigner presence/integrity check does not establish that a signed artifact uses the owner-approved certificate; any later signing acceptance must compare approved fingerprints explicitly. Never log or copy secrets into receipts.

For an already-published old-ID Play app, preserving update continuity requires retaining that ID; branding can still change. A deliberate new-ID listing would require a separate migration/distribution decision. For a genuinely unclaimed new ID, version 1/1.0.0 can be an initial candidate only after Console history confirms no conflicting upload; never reset versionCode for an existing listing. Signing alone does not establish upload eligibility.

## Console evidence update from parent

At 2026-10-16 09:08 UTC, parent reported that the signed-in personal Gmail account reaches Console signup with a two-step-verification prerequisite; the owner has been asked whether the verified developer account is another Google account. This does not establish that either package is available, unregistered or unpublished. Registration/history is HOLD. No registration or security-setting action is authorized by this audit. A proposal is the appropriate deliverable while the account context is unresolved.

## Gate sequence and acceptance

A. Read-only decision evidence: owner/account Console inventory for old and target IDs; app bundle explorer including draft/test/archive history; developer verification/package registration status and certificate eligibility; relevant OAuth/Firebase/API-key/deep-link registrations; confirmation of brand/domain control. Record unavailable evidence as HOLD. Public absence is not a clearance test.

B. Final owner approval of target and consequences. Keep PR77 frozen/unreleased/null. If approved, create a separate isolated candidate from an agreed exact base; do not modify the preserved checkout. No implicit registration, signing, upload, merge, deployment or legal-publication authorization.

C. Implement bounded edits above, with source and compiled identity regressions. Preserve web origin/security, SDK 24/36/36, app label/version unless independently approved, icons, dependencies, permission set, signing guard and data keys. Verify old current ID is absent from active target code except explicit negative tests and compatibility/history docs.

D. Run full repository tests, typecheck, changed-file lint, existing data audits, Android checks/icon checks, Python verifier tests, migration-free auth-enabled build, Capacitor sync and tracked diff. Run native lint/unit tests, unsigned release bundle + development APK and missing-signing guard. A passing prior-package build is not evidence for the new package.

E. Inspect final AAB/APK: exact manifest package, MainActivity class and launcher, resource labels, Capacitor embedded config, provider authorities, signature-only receiver permission and exact permission set, no unexpected native libraries, debuggable=false for release, cleartext=false, backup=false, icon counts and integrity. Confirm stale Java classes/config/old authorities absent; inspect DEX class identity or launch the built APK in addition to manifest text. Bind exact commit/tree, size/hash and tool versions.

F. Device acceptance later, in an authorized test environment: install target debug alongside old app without uninstalling; ensure separate launcher/settings identity, old saved data untouched and new data initially separate; test cold launch, hosted load, offline retry, location grant/deny, support/legal routes, external links, themes and ident. Separately verify a same-target test update with compatible signing preserves new-app state. Do not claim physical/device acceptance from static or unsigned-bundle checks.

G. Independent review with explicit unchanged PR77 unreleased/null assertions. Stop for owner decision before any package registration, credential/enrollment operation, upload or production action.

## Official sources checked 2026-10-16

- Android app-module configuration: https://developer.android.com/build/configure-app-module (ID/namespace separation and published-ID permanence).
- Play create/setup: https://support.google.com/googleplay/android-developer/answer/9859152?hl=en (permanent non-reusable package names, increasing version codes).
- Play package registration: https://support.google.com/googleplay/android-developer/answer/16984799?hl=en (current page states all Play packages must be registered effective September 30, 2026; registration/eligible-key status is a separate check, not inferred from a public listing).
- Android signing: https://developer.android.com/studio/publish/app-signing (upload/distribution key roles and update identity).
- Android app-specific storage: https://developer.android.com/training/data-storage/app-specific (app-private storage and uninstall deletion).
- Play developer-account information: https://support.google.com/googleplay/android-developer/answer/13628312?hl=en (display name versus legal information and account-type visibility).

Limits: no private Console inspection, domain/trademark clearance, external-service inventory, new build/tests, binary branding review, live production inspection or device acceptance. All execution steps above are a proposal, not completed validation.
