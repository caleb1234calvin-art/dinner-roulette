# Pick For Us — Android Phase B (2026-09-16)

This current checkpoint supersedes the historical resume instructions below for this task. Work only on `polish/pre-google-play-pass-1`. The former `integration/active-work-pass-1` ref returned GitHub 404 on 2026-09-16; it was not recreated. Preserve this file and historical evidence on the requested active branch.

## Future product concept — Mordax musical lock (2026-09-16)

- **Concept only; not implemented in the current Android Phase B work.** Preserve current release-validation scope and do not let this interrupt the exact Phase B next action below.
- Give the three top tabs short, subtle, individually pitched interaction tones: **left = G, middle = A, right = B**. Sounds should remain unobtrusive during rapid navigation; avoid long/overlapping splat tails.
- Hidden Mordax unlock sequence: **G-A-B-B-A-G-A-B-G**, spatially **left-middle-right-right-middle-left-middle-right-left**.
- Recognize the **note/tab sequence rather than requiring precise rhythm**, with forgiving timing so normal fast use still works. The melody acts as a concealed musical lock for the secret Mordax screen; no ordinary visible password prompt is required.
- This one mechanic intentionally solves three product/design needs: preserve the user's long-remembered childhood keyboard melody in the app, provide varied tab/button audio feedback, and provide the secret code for the Mordax screen.
- Origin/provenance: the user's father showed him this simple three-note melody on a keyboard when he was about six; he has retained it ever since and can reproduce it on other instruments, including recorder. Its personal origin does not need to be exposed in the public UI.
- Implementation/validation remains **deferred** until separately authorized after the current Google Play Phase B checkpoint. When implemented, add regression coverage for exact-sequence recognition, wrong/partial sequences, overlap/rolling-buffer behavior, and no accidental unlock from ordinary navigation.

## Native compilation checkpoint — artifact acceptance pending

- Resume branch/SHA: `polish/pre-google-play-pass-1` / `ed33a703feadf5ac7975f0b879ecb78d8f4c6dbb` — `Persist Pick For Us Android release project and guarded bundle workflow`. Current remote HEAD was re-read and matches the recorded implementation. No implementation was regenerated or reset.
- [Android CI Run 33](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/35132990226), exact implementation SHA above: clean install, 376 JavaScript tests, typecheck, changed-code lint, casino/Android audits, migration-free web build and clean Capacitor sync passed. Native `./gradlew --no-daemon lintRelease testReleaseUnitTest bundleRelease assembleDebug -PallowUnsignedRelease=true` **BUILD SUCCESSFUL**, 2m1s, 233 executed tasks. Native unit tasks are NO-SOURCE, not behavioral test passes.
- Run 33 overall **FAIL**: the compiled-bundle verifier expected only three permissions, but AndroidX merges its package-local signature-only receiver permission. No release artifact was retained because inspection failed before artifact staging. The successful native build does not by itself establish completed artifact acceptance.
- [AndroidX source](https://github.com/androidx/androidx/blob/androidx-main/core/core/src/main/AndroidManifest.xml) confirms `com.calebcalvin.pickforus.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`. The correction requires the exact four-permission set and signature-only declaration; background permission/weak protection still fail. Three focused Python regression tests passed locally before the workspace disconnected. Five existing Android Node tests, Android structural/icon checks, typecheck and changed-code lint also passed; no web runtime code changed.
- This checkpoint updates the verifier, its three Python regression tests, artifact-only workflow, ANDROID_RELEASE.md, Python cache ignores and this current continuity section. Compiled SDK/label, all 15 launcher images, two adaptive icons, manifest and lint summaries will be recorded by CI. CI now explicitly installs Build Tools 35.0.0 for Capacitor library modules plus app Build Tools 36.0.0, without changing min/compile/target SDK or the established toolchain.
- Added a real normal-release missing-key guard check before the explicit unsigned build. The guard must fail with `Release signing is missing.`; an unrelated build failure cannot count as success. No upload key or fabricated signing input is supplied. Optional upload signing remains manual and unexecuted.
- Local native recovery first encountered a corrupt automatic Build Tools 35.0.0 download; the official archive was restored. The retry then stopped at an environment network-policy boundary for dl.google.com. A later exec request returned `409 environment_offline`; do not bypass that boundary or discard the disconnected checkout. GitHub's already-authorized artifact-only CI is the remaining execution path.
- Local bundletool cache was found truncated on reinspection and is not trusted; CI independently downloads and checks the pinned official 1.18.3 SHA-256. No local artifact or local native success is claimed.
- BLOCKED: upload signing, private Play Console identity confirmation, physical Android/WebView acceptance. Browser remains NOT VERIFIED (Chromium SIGSEGV before checks).
- NEXT: run the corrected workflow at its exact commit; verify signing guard, unsigned bundle manifest/resources/hash, Android lint findings and artifact retention; complete the bounded Phase B diff review and final continuity. Do not repeat research or regenerate native source.
- Main, hosted production URL, Vercel settings, Play Console and historical `android-latest` release remain untouched. No migration, public release, Play upload or upload key generation occurred.

## Implementation checkpoint — native compilation in progress

- Prior audit commit: `58b48d308f6782240d27266835d507eb301fa188` — `Record Pick For Us Android Phase B audit and identity decision`; GitHub readback verified.
- Persistent Android source generated once using pinned Capacitor core/Android/CLI 8.5.2. API min/compile/target 24/36/36; build-tools 36.0.0; AGP 8.13.0; checksum-pinned Gradle 8.14.3; Java 21. Package locked to `com.calebcalvin.pickforus`, label Pick For Us, initial Play version 1/1.0.0.
- Added release signing inputs and fail-closed default; explicit unsigned validation builds are separate from upload-signed builds. No upload key exists or was generated. Added artifact-only CI and optional manual protected-environment signing job; no Play/public GitHub release action remains.
- Fifteen deterministic launcher resources derive only from the approved unchanged master. Static circle/squircle/safe-circle preview reviewed; full art survives. No fabricated monochrome redesign. Native foreground GPS permissions and offline retry page added; HTTPS runtime unchanged; native insets handling selected.
- Fixed inherited broken APK promotion: Settings shows release-preparation text instead of a nonexistent PickForUs.apk download. No discovery, seasonal, theme, analytics, Mordax or navigation behavior was changed.
- Validation completed: clean `npm ci` (507 packages); Capacitor sync; source/identity/version/icon/wrapper checks; typecheck; targeted lint; **376 tests passed (305 repository + 71 application), 0 failures, 4 inherited external-documentation skips**; casino audits 883 canonical / 899 rows / 60 passes; migration-free auth-enabled web production build passed.
- Full repository lint reports one pre-existing `no-empty` error in unchanged `src/lib/app-data/client.server.ts:214` and four warnings. Changed-code lint passes. No unrelated auth code cleanup applied.
- Local Chromium attempt failed before any browser check (engine SIGSEGV); do not report browser success. Device/WebView checks remain NOT VERIFIED.
- Local SDK setup: newest CLI downloader failed, then pinned CLI 19.0 required the workspace proxy trust store. Official Temurin JDK 21 and Gradle checksums verified; native compilation is now being attempted. Do not treat a pending native build or signed bundle as passed.
- Next: finish Gradle/bundle/lint verification, inspect compiled package/SDK/resources/signing, test missing-signing guard, review full diff, then save final results and human gates. Full procedure is in ANDROID_RELEASE.md.

## Audit checkpoint — implementation next

- Starting branch/SHA: `polish/pre-google-play-pass-1` / `9b3439c484108bfbf168fbef4eb3680ee28cadaf` (`rename visible home identity to Pick For Us`). Clean isolated worktree.
- Main read-only baseline this session: `6b811ae427339902f456c2706330689c2d6ad54b`. Prior historical main values below are not current.
- Public identity: **Pick For Us**. Approved master: `public/brand/grok_1789541884918.jpg`, 1408×1408, SHA-256 `5d823a5c4ef6cc0a76ffc8926f83f0eaae85cb8b59cdcd280d9b8d148f99500a`. Visually inspected; preserve original and make only padding/resizing derivatives.
- Existing Android workflow dynamically installs Capacitor 7, regenerates Android, builds a debug APK, and publicly overwrites a GitHub release on main. No persistent Android project, pinned Capacitor dependencies, release signing, or AAB workflow exists.
- Existing GitHub `android-latest` release contains `DinnerRoulette.apk` (prototype, 4,274,125 bytes). Do not delete or overwrite it. New package will install separately; old package-local favorites/settings cannot automatically transfer.
- Package decision: adopt user-authorized `com.calebcalvin.pickforus`. Repository inspection found no tracked signing key, service configuration, assetlinks, app-link registration, or Play publishing setup binding the old ID. Public searches found no matching Play listing, which does NOT establish absence of a private Play Console registration. Owner must confirm Console identity before the first upload. No concrete technical blocker was found.
- API 36 is required for new ordinary Android apps/updates from 2026-08-31. Capacitor 8 supports SDK 36; Capacitor 7 officially targets 35. Pin a coherent Capacitor 8 toolchain. Minimum SDK increase from the Capacitor 7 default 23 to the Capacitor 8 required 24 is justified by that compatibility requirement.
- Keep existing hosted URL `https://dinner-roulette-chi.vercel.app` unchanged. Current wrapper loads that remote web app, not a bundled copy of this branch's React application; do not claim the AAB freezes hosted content or works offline.
- Concrete inherited issue: Settings now links `/downloads/PickForUs.apk` while Vercel only rewrites `/downloads/DinnerRoulette.apk`. Do not advertise a nonexistent release artifact.
- `npm run build` still chains `db:migrate`. Use only `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production` for web production validation.
- Validation so far: fresh remote refs, clean branch checkout, Android/config/workflow/source inspection, release metadata, approved image inspection, primary Google/Capacitor requirements. No Phase B build/test success is claimed yet.

COMPLETED: bounded Android architecture/identity audit and toolchain plan.
BLOCKED: signing credentials, Play Console ownership/registration, and physical-device acceptance are not available.
DEFERRED: Play upload/publication and any production change; none authorized.
NEXT ACTION: persist Android; pin SDK-compatible dependencies; derive launcher resources; add unsigned/signed bundle paths and artifact-only CI; run web and Android validation.
REQUIRES USER AUTHORIZATION: main merge, production deployment, any Play upload/publication. No credentials will be generated or committed.

Primary references: [Google Play API policy](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en), [Capacitor 8 upgrade](https://capacitorjs.com/docs/updating/8-0), [Capacitor SDK matrix](https://capacitorjs.com/docs/android/setting-target-sdk), [Android adaptive icons](https://developer.android.com/develop/ui/compose/system/icon_design_adaptive).

---

## Historical continuity retained below

# Dinner Roulette / Pick For Me — AI Continuity

Updated September 13, 2026. **The combined casino + location/international candidate is integrated and validated in non-production.** This existing shared file on integration/active-work-pass-1 is the authoritative handoff.

## Latest meaningful checkpoint

The combined 883-casino + location/international candidate remains integrated and validated on integration/active-work-pass-1. PR #42 merge 189c46bfee0ac0983ea9100eae90e92ee58915b7 contains the combined runtime; exact-head CI Run 346 passed at 40f9fb8d162caac061fcf7927894bd2107b434ad. The latest continuation corrected release documentation without changing that runtime.

Work branch: `integration/active-work-pass-1`. Work commit: **`222b37bbabad06d4782d0eab3cd022ae7cd3be59`** — **Refresh combined release checklist and document migration gate**.

Current local working branch: `integration/combined-release-handoff-2026-09-13`. Frozen casino base: `183d3e1d71355a27e4bc35a2969d73037c9e6e33`. Preserved location source: `integration/location-international-2026-09-13` at `4a93870c05ec53bd49fae5143df420c301696839`; PR #39 was not merged wholesale. Main remains `c187d518cf8b0c8b9202ee0ae6493667eb4c0ab5`.

## COMPLETED in this reconciliation

- Read both source branches and all required handoffs/evidence before editing. Classified five overlapping paths and 30 location paths; the frozen casino integration was the authoritative base.
- Preserved 883 canonical casinos, 899 serialized rows, 60 passes, all 78 protected data/policy/evidence files, closure rules, aliases, routing, seven holds and original history. No casino was added, removed or re-researched during reconciliation.
- Reconciled shared explicit-action GPS across Dinner, Nightlife/Casino and Date Night. Valid coordinates activate immediately; reverse geocoding only enriches labels. Visible progress/success/errors, automatic manual recovery, cancellation, stale-callback invalidation, busy guards, manual override and persistence remain.
- Retained the general country/region/locality model, global manual Nominatim queries, Canada/U.K. support, international addresses and exact-coordinate Maps destinations. No automatic GPS occurs on reload.
- Preserved current casino fallbacks, geographically bounded closure/retired-name suppression, aliases and valid-empty versus malformed provider distinctions while applying only the intended location changes.
- Retained all 30 pre-existing test files unchanged and every original location test assertion. Imported 28 location tests and added ten meaningful integration regressions; actual combined result is 367 unique passes, not a sum of independent branch totals.
- Combined strict-port owned preview processes, source/output fingerprints, auth-enabled production checks, deterministic outage coverage, actual-provider semantic checks and mobile location behavior. Negative stale-build/auth/occupied-port checks prevent false greens.
- Actual international browser testing exposed quadratic duplicate work at the app's 15-mile prefetch radius. Replaced candidate lookup with a spatial index that preserves name, distance, source-rank and output-order rules; parity, boundary, antimeridian/pole and 8000-row tests pass.
- Fresh safe development and auth-enabled migration-free production builds passed. Local and CI builds share source fingerprint bc47c54850ec80e6a6460a1aee6c4478a65d35bcba4d86eca619b9a99733dc61 (363 input files).
- All 30 deterministic browser groups passed: 16 casino and 14 location. Actual provider acceptance passed six casino regions and Toronto, Vancouver, Montréal and London. Native coordinates/permissions are simulated; real-provider runs have no provider mocks.
- Preserved failed attempts and their resolutions, including dense-city stalls and Chromium same-document cached coordinates after emulated permission revocation. Fresh native denial and manual recovery pass; no product permission rule was bypassed.
- Primary and targeted adversarial reviews passed. No frozen data regression, lost test, unrelated change or dependency/configuration drift remains. Only CI acceptance configuration changed; no package, lockfile, Vite or deployment exclusion change.
- Final candidate d44de898fc6420e18ad83dc0a7aa753fbd19bc5b passed CI Run 341. PR #42 merged with expected-head protection at 189c46bfee0ac0983ea9100eae90e92ee58915b7. The merge differs from the validated candidate only in the newer AI_CONTINUITY.md.
- Merged integration CI Run 343 (34779345531, job 103783374402) passed clean installation, 367 tests, typecheck, audits, both safe builds, 16+14 browser groups and 30 icons. Shared checkpoint 6b4e1a0701ec377cf4272118a76c79c2911fa0ab also passed CI Run 344 (34779368173).
- The 43 changed paths are limited to source location functionality, required reconciliation/performance/tests/browser/CI changes and audit/continuity records. Final readiness artifacts are saved at 890cca11efdd7f132648d3451a86404d9badbcf6.
- Main remains c187d518cf8b0c8b9202ee0ae6493667eb4c0ab5. Original location branch remains 4a93870c05ec53bd49fae5143df420c301696839; old PR #39 was not merged wholesale. No production change, Vercel deployment, migration, secret modification, recurring monitoring or Ex