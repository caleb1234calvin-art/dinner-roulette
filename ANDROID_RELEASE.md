# Pick For Us — Android release preparation

Phase B prepares buildable native source and release artifacts. It does **not**
authorize a main merge, Vercel deployment, Play upload, or publication.

## Locked identity and compatibility

| Setting | Value |
| --- | --- |
| Application / namespace | `com.calebcalvin.pickforus` |
| Public label | Pick For Us |
| First Play version | `versionName=1.0.0`, `versionCode=1` |
| Minimum / compile / target SDK | 24 / 36 / 36 |
| Android build tools | app 36.0.0; Capacitor library modules use AGP default 35.0.0 |
| Capacitor core / Android / CLI | 8.5.2, exact versions in npm lockfile |
| Android Gradle Plugin | 8.13.0 |
| Gradle wrapper | 8.14.3, distribution and wrapper SHA-256 verified |
| Java / Node | JDK 21 / Node 24 in CI (Capacitor requires Node 22+) |
| Icon master | `public/brand/grok_1789541884918.jpg` |

[Google Play requires API 36 for new ordinary Android apps and updates from
August 31, 2026](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en).
[Capacitor's SDK support](https://capacitorjs.com/docs/android/setting-target-sdk)
ties API 36 to version 8. Its supported minimum API is 24; this is why the old
Capacitor 7 prototype's default minimum 23 increases by one. The checked-in project
uses the compatible toolchain from the [Capacitor 8 guide](https://capacitorjs.com/docs/updating/8-0).

The old `com.calebcalvin.dinnerroulette` debug APK is a separate application. This
new identity does not upgrade it or automatically migrate its private favorites,
history, or settings. No repository key, service registration, app link, or Play
publishing configuration required the old ID. No matching public Play listing was
found, but private Console registrations are **not verified**. The owner must
confirm the new ID in the intended Console account before the first upload. Once
uploaded, keep this ID permanently; future releases increment `android/version.properties`.
Never reuse a versionCode already uploaded to any Play track.

## Persistent project and runtime

`android/` is authoritative native source, including the wrapper, manifest,
version/signing configuration and launcher resources. Use `cap sync android`, not
`cap add android`. npm dependencies and native versions are locked. Sync-generated
web copies, machine SDK paths, build output, signing files, and IDE state are ignored.
The two Capacitor Gradle integration files are committed and must remain unchanged
after a clean sync.

The established HTTPS runtime remains **https://dinner-roulette-chi.vercel.app**.
This is an online, hosted-web Capacitor shell. The React/TanStack server application
is not embedded into the bundle: its server routes cannot be made offline by
copying a static directory. A successful web compilation validates source but does
not deploy it or make that branch's web content appear in the Android wrapper.
The hosted revision must be explicitly accepted before Play testing. The bundled
`native-web/index.html` is a local connection-error/retry page only.

Only the configured origin is bridged; no wildcard navigation is allowed.
Cleartext, mixed content, release debugging, and Android cloud backup are disabled.
The app declares Internet and foreground coarse/fine location permissions. AndroidX
also merges its package-local `DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` with
signature-only protection. The compiled-bundle verifier requires exactly these
four permissions and rejects background location or weakened receiver protection.
Capacitor's WebView permission handler runs when the existing web location action
requests GPS; no startup or background location request was added. Approximate
location remains supported. Native SystemBars handling accommodates system/keyboard
insets without changing the hosted layout. Actual device behavior remains a gate.

The native launch splash uses the approved icon. The hosted Mordax ident, themes,
seasonal behavior, modes, data, analytics, external links and location architecture
remain unchanged. Settings' nonexistent `/downloads/PickForUs.apk` link is replaced
with honest release-preparation text. Historical APK rewrite/release and old icon
files remain untouched; no build uses the old icons.

## Local unsigned validation

Install JDK 21, Android SDK platform 36 and build-tools 35.0.0 plus 36.0.0.
The app pins 36.0.0; Capacitor library modules use AGP's 35.0.0 default. Installing
both avoids an implicit build-time SDK download without changing API targets. Point `ANDROID_HOME`
to the SDK (or use ignored `android/local.properties`). The pinned CLI tools used
in CI are build 13114758 / 19.0. Then:

```sh
npm ci --no-audit --no-fund
python3 -m pip install -r native-android/requirements.txt
npm run android:check
python3 -m unittest discover -s native-android -p 'test_*.py'
npm run typecheck
npm test
npm run audit:casinos
VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production
npm run android:sync
cd android
./gradlew --no-daemon lintRelease testReleaseUnitTest bundleRelease assembleDebug -PallowUnsignedRelease=true
cd ..
python3 scripts/verify-android-bundle.py android/app/build/outputs/bundle/release/app-release.aab --expect unsigned --output artifacts/android-bundle-verification.json
```

`npm run android:bundle:unsigned` is the shorter unsigned bundle command.
Output: `android/app/build/outputs/bundle/release/app-release.aab`.
**An unsigned AAB cannot be uploaded to Play.** The debug APK is a development
artifact only, not a production release. No API key or service account is needed
for these checks. `testReleaseUnitTest` may be NO-SOURCE; do not count it as passing
native behavioral tests. No sample template tests are retained to inflate totals.

Never use the ordinary `npm run build` for this validation: it chains database
migrations. The direct Vite command above is migration-free.

## Upload signing — human setup still required

[Play App Signing uses separate app-signing and upload keys](https://developer.android.com/studio/publish/app-signing).
Google signs distributed APKs with the Play app-signing key. The owner holds an
**upload key** used to sign the AAB before upload. This phase does not create either
key, enroll the app, or upload anything. Keep a protected backup of the upload key.

Create/select the real upload key using Android Studio's signed-bundle wizard in
a secure local environment. Supply all four inputs using protected environment
variables, or an ignored `android/keystore.properties` file with the corresponding
property names. Do not put values on a command line or commit them.

| Environment input | Local property |
| --- | --- |
| `PICKFORUS_UPLOAD_STORE_FILE` | `storeFile` (absolute path preferred) |
| `PICKFORUS_UPLOAD_STORE_PASSWORD` | `storePassword` |
| `PICKFORUS_UPLOAD_KEY_ALIAS` | `keyAlias` |
| `PICKFORUS_UPLOAD_KEY_PASSWORD` | `keyPassword` |

`npm run android:bundle` requires signing. Missing credentials fail closed unless
the explicit unsigned-validation flag is passed; partial credentials fail even
when that flag is used. Release never falls back to the debug keystore. Validate
the signed output with the same verifier using `--expect signed`. Verify the
certificate fingerprint against the intended upload certificate before upload.

## GitHub Actions

The existing `.github/workflows/android-apk.yml` path is retained, but the workflow
is now **Pick For Us Android Release Readiness**. It installs locked dependencies,
checks regressions/identity/icons, compiles web source without migrations, syncs
the committed native project, proves that a normal release fails without its upload
key, runs Android lint, and builds an unsigned release
AAB plus debug APK. It verifies the compiled AAB using checksum-pinned Google's
bundletool 1.18.3 (SDK/package/version/signing/config/permissions/native-library
checks), then uploads Actions artifacts with revision and checksums. Three Python
permission-verifier regression tests are separate from the 376 JavaScript project
tests. The downloaded verifier tool itself is excluded from artifact uploads.
There is no GitHub public-release step, Play publisher, production deployment,
credential generation, or write permission to repository contents.

Optional manual `sign_release=true` runs a second job after validation. Before
using it, the owner must create/protect environment `android-upload-signing` with
required reviewers and allowed branches, and configure secrets named:

- `PICKFORUS_UPLOAD_KEYSTORE_BASE64` (base64 of the real upload keystore)
- `PICKFORUS_UPLOAD_STORE_PASSWORD`
- `PICKFORUS_UPLOAD_KEY_ALIAS`
- `PICKFORUS_UPLOAD_KEY_PASSWORD`

The key is decoded only into a runner temporary file with restrictive permissions
and removed on exit. Secrets are not provided to pull-request jobs. The optional
job produces an artifact only; it does not upload to Play. No such environment or
secret was created in this task. Review any future signing run separately.

## Next phase gates

Before authorizing Play testing/upload: confirm permanent Console ID ownership,
create/select and back up an upload key, configure Play App Signing, verify the
real signed bundle/certificate, and accept the intended hosted revision.

On a physical Android phone (include Android 16 and the supported minimum where
available), test cold start/offline retry, Mordax ident, both themes and Halloween,
Dinner/Nightlife/Casino/Date Night, GPS allow/approximate/deny/retry, manual and
international locations, keyboard/insets/back navigation, favorites/history and
process restarts, Settings, external Maps/browser links, sign-in and analytics.
Inspect circle/squircle/themed launcher masks. Desktop browser or static icon
previews do not prove these checks.

Play Console policy/store preparation is a separate phase: privacy-policy URL,
Data safety disclosures (location, analytics and hosted services), content rating,
casino/alcohol discovery declarations, screenshots, testing requirements, and
review of the hosted-web model. The app does not provide wagering; do not describe
it as a gambling service. No Play approval is implied by a successful bundle build.

See `AI_CONTINUITY.md` and `audit/android-phase-b-validation-2026-09-16.json` for
actual results, warnings, exact revisions and any remaining build boundaries.
