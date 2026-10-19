# Independent upload-signing readiness review
Reviewed 2026-10-19. Scope: read-only preparation. No key generation, secret reads or writes, signing, signed dispatch, Play upload, enrollment, agreements, repository mutation, or security configuration performed.

## Decision
NOT READY FOR SIGNING/UPLOAD. The source implements a plausible artifact-only signed build, not verified operational readiness. No demonstrated P0 source defect. P1 release blockers: unverified environment/source protections; no expected upload-certificate enforcement/evidence (a mandatory independent manual comparison can close this gate without a code change); no authorized signing or Play step. Current main being unprotected and the prior single-release waiver being consumed are supplied context, not independently queried in this review. The waiver must not silently carry forward.

Owner-reported Console app creation and selection of app.pickforus.android are recorded as owner reports, not proof of certificate enrollment, global package registration, version availability or upload acceptance.

## Exact source evidence
All seven files under source/ were fetched using the GitHub connector at e078dcdaa9f0ca84951409cdb92805731af3d34b. Expected tree supplied: 6300c1061a790d84447bb92166f340aec895757b.
- ANDROID_RELEASE.md blob 788c80f7d760cbf9762f7831ef399f19c1eba3bb.
- .github/workflows/android-apk.yml blob 87c062e8863be67527e18906301d859bb1d51843.
- android/signing.gradle blob c71040698da63220a0f23fd14052e1b2e0291be7.
- android/app/build.gradle blob 93fb139b389fec8c89e0e27c72eb1a9eacddea06.
- android/build.gradle blob f5a03243af718a30aead5be40b29b15aad6cb97e.
- scripts/verify-android-bundle.py blob 204532ba4347e673531889e071c4d21fa978e51d.
- scripts/check-android.mjs blob e67bd3f9f0c45f255566b881896ebe705814cca6.

Source base: https://github.com/caleb1234calvin-art/dinner-roulette/blob/e078dcdaa9f0ca84951409cdb92805731af3d34b/

## Findings
1. P1: Expected signer is not enforced. verify-android-bundle.py:215-225 detects a signature block and runs jarsigner -verify; it accepts the text “jar verified.” It neither compares the signer certificate against a trusted expected SHA-256 nor records that fingerprint. Its uploadSignatureVerified field at 238 means a cryptographic check occurred, not that the approved upload key was used. A different valid signing key is not rejected by the shown logic. Non-strict jarsigner warnings and complete entry coverage are not explicitly assessed; independently verify all payload entries and inspect warnings. Self-signed upload-certificate trust warnings must be distinguished from invalid signatures, unsigned payload entries or unsuitable algorithms. Do not blindly require a public CA certificate.
2. P1 operational gate: workflow line 147 references android-upload-signing; this does not prove existence or protection. The available github_fetch tool explicitly supports listed public-repository endpoint families and rejects unlisted endpoints; environments are not in its supported list and secrets APIs are explicitly unsupported. No unsupported endpoint probe or secret metadata inspection was performed. The existing authorized cloud GitHub session is reported logged out, so it provides no current settings evidence. Reviewer identities, self-review prevention, bypass behavior, explicit allowed branches/tags, plan support and secret scope/existence remain UNKNOWN. Verify those settings read-only before adding secrets or releasing the signing job. If no branch protection exists anywhere, GitHub's “Protected branches only” option permits all branches. Explicit selected branch restrictions and reviewed source governance are needed; branch restriction alone cannot stop malicious changes to an unprotected allowed main. Required review must examine the exact run SHA and all executable build/dependency/workflow changes before access to signing material.
3. Source binding: validation checkout explicitly selects PR head or github.sha; sign checkout defaults to event ref/SHA. Since signing is manual-dispatch-only and needs validation (workflow 145-151), no checkout race or PR signing path is demonstrated in this revision. Making ref: github.sha explicit and comparing recorded SHA/tree across both jobs would improve auditability. The signed job rebuilds source; it does not sign the validated unsigned artifact bytes. Independently confirm both revisions and inspect the resulting signed AAB; do not claim bit-for-bit identity or reproducibility.
4. Good guards: all four Gradle signing inputs required together; missing/partial input fails closed; no debug signingConfig fallback. Manual sign_release defaults false. No Play upload/publication step or repository write permission. Secrets are step-scoped, temporary keystore has umask 077 and EXIT removal. These do not substitute for environment controls: Gradle/build code executes with secrets.
5. Hardening: actions are mutable version tags rather than immutable commits. Consider reviewed full-SHA pins and persist-credentials:false before enabling signing. This is hardening, not evidence a third-party action was compromised.
6. Compatibility: old com.calebcalvin.pickforus and com.calebcalvin.dinnerroulette remain separate packages, with no automatic data migration. Preserve existing installations/data. A sideloaded debug app with the SAME new package app.pickforus.android cannot normally update to Play's differently signed app; test on a clean device/profile or prepare an explicitly authorized data-preservation plan. Never recommend uninstall/clear-data as a silent fix. CI debug keystores may also differ across runs. A locally upload-key-signed APK is not the same distribution signer as a Play-generated APK.

## Secure owner procedure, staged and not executed
A. Before credentials
- Confirm exact app and developer account in Console, intended package, current release versionCode availability, hosted-runtime acceptance and device test plan.
- Choose who owns key custody/recovery. Confirm a protected local machine and approved encrypted backup locations. Do not send keystore bytes, base64, passwords, or private keys in chat or repository files.
- Explicit authorization is still required for credential creation, security/environment changes, signed workflow dispatch, upload, and any new agreement. Credential entry/transmission is owner-only handoff. One approval does not authorize the other stages.

B. Owner key preparation, only after the separate decision to create/select the key
- Select an existing genuine upload key if already registered; do not invent a replacement without checking enrollment.
- Otherwise, in Android Studio use Build > Generate Signed Bundle/APK > Android App Bundle > Next > Create new. Store outside the checkout. Enter an owner-chosen descriptive alias; record it in the owner's password manager. Use a strong keystore password and the same key password for Android Studio compatibility. Set validity at least 25 years. Certificate identity fields are included in the public certificate; review them before entry.
- Finish key creation, then cancel the signing wizard if authorization covered creation only.
- Keep two access-controlled encrypted backups in approved separate locations. Store recovery instructions and passwords securely; verify backup restoration locally without exposing key material.
- Export/inspect only the public upload certificate and record its SHA-256 in a non-secret release record. Independently establish the expected fingerprint before trusting a candidate bundle.

C. Owner GitHub setup, after specific security-change authorization
- Inspect/create/protect android-upload-signing; verify explicit allowed branch rules, required independent reviewer, self-review prevention and bypass policy. Confirm those controls actually apply to the repository's plan. Protect the source/release path or obtain a new explicit scoped governance decision; the previous waiver is not reusable.
- Owner securely enters environment secrets with exactly these names:
  PICKFORUS_UPLOAD_KEYSTORE_BASE64
  PICKFORUS_UPLOAD_STORE_PASSWORD
  PICKFORUS_UPLOAD_KEY_ALIAS
  PICKFORUS_UPLOAD_KEY_PASSWORD
- Base64 is encoding, not encryption. Generate it only on the owner's trusted machine, never log or paste it into chat. Use environment-scoped secrets rather than broad repository/organization exposure.
- The workflow derives PICKFORUS_UPLOAD_STORE_FILE at runtime; it is not a fifth GitHub secret.
- Local alternative, only if separately approved: ignored android/keystore.properties with storeFile, storePassword, keyAlias, keyPassword, or corresponding four environment inputs. Absolute keystore path is preferred. Do not change tracked Gradle files to embed values.

D. Signed build and independent receipt, after separate explicit authorization
- Reconfirm reviewed immutable commit and current validation success. Request artifact-only signing for that exact revision, not upload/publication. A future hardening revision needs its own validation; do not claim this review covers it.
- Reviewer verifies event SHA, source diff, environment gates and expected upload fingerprint before approving access.
- Download the signed artifact via authorized access. Verify SHA-256 against receipt, package app.pickforus.android, intended version, SDKs 24/36/36, release protections, permissions, DEX identity, runtime origin, and expected certificate.
- Obtain JAR signature verification and certificate SHA-256 from the AAB itself (for example public-certificate inspection with keytool -printcert -jarfile <candidate.aab>). Compare it exactly with the independently recorded upload certificate and Console upload certificate when available. Public certificate inspection needs no private-key password. This review did not run it because no signed candidate was authorized/provided.
- Save run URL, source SHA/tree, AAB digest/size, certificate fingerprint and complete inspection output. Do not confuse the upload certificate with Google's app-signing certificate.

E. Play steps, separate approval gates
- Owner reviews any Play App Signing terms and key-management choice. Under the selected Google-generated signing setup, the key signing the first uploaded AAB establishes the upload certificate. Google’s separate generated app-signing key signs the Play-delivered APKs. This is a consequential setup decision. Do not transfer a private distribution key without owner handoff.
- Authorize the exact signed AAB and target app/INTERNAL TESTING track for upload only after certificate review. Creating a draft, uploading, enrolling signing, accepting terms, adding tester identities and rolling out are distinct changes; obtain the applicable authority before each.
- Record Play processing outcome, actual package/version, upload and distribution fingerprints. Then separately authorize tester audience and rollout. Internal testing is not internal app sharing, production, or proof of store approval.
- Same-target install/update acceptance must use Play-delivered distribution signing. Preserve old-package app data.

## Secret-free owner verification command examples (not executed)
These examples use placeholders for file names only. Run on the approved trusted machine after the relevant stage is authorized. Never add password arguments or pipe private material into logs.

Public upload-certificate fingerprint, from an already exported public certificate:
```sh
keytool -printcert -file /approved/path/upload-certificate.pem
```
Candidate AAB public signer fingerprint:
```sh
keytool -printcert -jarfile /approved/path/PickForUs-upload-signed.aab
```
Signature details and entry verification (inspect output and every warning):
```sh
jarsigner -J-Duser.language=en -verify -verbose -certs /approved/path/PickForUs-upload-signed.aab
sha256sum /approved/path/PickForUs-upload-signed.aab
```
Public certificate export, owner-only because it accesses the private keystore; keytool prompts locally for the password:
```sh
keytool -exportcert -rfc -keystore /approved/private/path/upload.jks -alias OWNER_CHOSEN_ALIAS -file /approved/path/upload-certificate.pem
```
Do not put -storepass or -keypass values on a command line. The public-certificate SHA-256 must match the AAB signer exactly. A self-signed certificate warning alone is not the same as signature corruption. Additional unsigned payload entries, unexpected signers or unsuitable algorithms require rejection/investigation. A reviewed manual certificate/signature receipt is an acceptable release gate; code hardening is recommended but not claimed mandatory for this preparation-only task.

## Current official-source checks
Checked 2026-10-19:
- Android signing guide: https://developer.android.com/studio/publish/app-signing
  Upload and distribution keys have distinct roles; Studio supports upload-key creation; its guidance specifies matching passwords for compatibility and at least 25-year validity. Public certificate fingerprints are shareable. New app setup can use Google's generated distribution key; terms may require acceptance. Certificate mismatch matters for updates.
- Internal testing: https://support.google.com/googleplay/android-developer/answer/9845334?hl=en
  Up to 100 testers; setup can be incomplete; testers generally use opt-in links. New internal bundles may be available within minutes, with temporary listing details up to 48 hours. Internal-only apps have a Data safety section exemption; this does not waive truthful privacy handling or authorize publication. Separate production eligibility requirements may apply.
- Checkout v4 behavior: https://raw.githubusercontent.com/actions/checkout/v4/README.md
  Default checkout binds to triggering event ref/SHA, not a newly chosen arbitrary branch tip.
- Environment restrictions: https://docs.github.com/en/actions/reference/workflows-and-actions/deployments-and-environments
  Explicit branch/tag restrictions are available; “Protected branches only” permits all branches if no branch protection rules exist. Verify settings and repository-plan availability rather than assuming a named environment is protected.

## Scope limits
No independent verification of Play app/account state, actual environment existence/settings, secret metadata, branch protection, signed artifact or physical device. No signing-readiness certification. All next actions above are instructions for a later explicitly authorized stage, not work performed.

