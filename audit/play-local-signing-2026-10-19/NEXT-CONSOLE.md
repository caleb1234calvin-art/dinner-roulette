# Next Google Play steps, after local signed-bundle verification

19 October 2026, 18:40 UTC. Preparation only: **no Console upload, enrollment, agreement acceptance or rollout is authorized now.** Reuses the earlier internal-testing checklist and refreshed official Google guidance.

## Ready-to-send summary

Your phone's key should remain your upload key; the recommended first-Play-release route is for Google to generate and manage the separate app-signing key used for installed copies. Once we verify the signed AAB and its public certificate, the next decision is whether to approve that signing setup and its terms, followed by uploading only that exact verified bundle to the internal track. Version code 1 still needs to be confirmed unused in your Console.

## Before touching upload

- Preserve the owner-reported RSA-4096 PKCS12 key on the phone, with owner-controlled backup/recovery. Never send the keystore, private key or passwords. PKCS12 creation alone does not prove the AAB is signed correctly. Only the signed AAB and public certificate/fingerprint are needed for verification.
- Require the signed-bundle verification receipt: exact input provenance, output SHA-256, valid signature, signer public-certificate SHA-256 matching the local key, and unchanged bundle payload. Confirm package `app.pickforus.android`, versionCode `1`, versionName `1.0.0`, SDK 24/36/36 in the artifact. Existing unsigned validation is not signed validation.
- Owner checks existing bundles/releases: version code 1 must be unused. App creation and a saved tester list do not establish this. Stop if already used; do not silently change version or artifact.

## Owner's signing decision

Recommend Google-generated app-signing keys, keeping the local key solely for upload authentication. Google's current guidance describes automatic enrollment with Google-generated keys for new apps when the bundle is uploaded, so resolve the choice **before uploading**. If independent cross-store signing is required, stop and settle that strategy first. Review any certificate-bound services against Google's app-signing certificates rather than only the upload certificate. [Official Play App Signing guidance](https://support.google.com/googleplay/android-developer/answer/9842756?hl=en)

Explicit confirmation still needed: “Approve Google-generated Play App Signing for Pick For Us (`app.pickforus.android`), using my phone-held key only as the upload key, and accept the applicable [Google Play App Signing Terms](https://play.google/play-app-signing-terms/).” This is proposed confirmation wording, not a recorded approval. If the Console presents additional or changed terms, pause for that exact agreement. No private-key transfer is part of the recommended route.

## Future owner-operated Console sequence

Only after the signing decision, signed-file verification and separate upload approval:

1. Open Pick For Us → Test and release → Testing → **Internal testing** → Create new release. If disabled, inspect the listed outstanding tasks; do not guess answers or switch tracks.
2. Verify the app and package, inspect the signing setup, and upload only the verified signed AAB. Record the accepted artifact version and public upload/app-signing certificate fingerprints. Inspect errors and warnings; stop on unexpected package, certificate, permissions, terms or version findings.
3. Add a clear release name and notes, then save the draft. Review the preview/confirmation screen. **Saving a draft is not rollout approval.** Do not press Publish, Start rollout or Send for review under the current authorization. Google's actual labels can vary with review state. [Official release workflow](https://support.google.com/googleplay/android-developer/answer/9859348?hl=en)
4. Verify the existing email list is selected on the internal Testers tab, plus the feedback address. After a separately approved internal rollout, obtain the opt-in link and test with the eligible Google account. Internal testing supports up to 100 testers; first-link availability can take several hours. Do not use Internal app sharing as an interchangeable track. [Official testing guide](https://support.google.com/googleplay/android-developer/answer/9845334?hl=en)

## Scope and unresolved checks

- Exclusively internal-track apps do not need the Data safety form. Closed/open/production does. The exemption does not certify privacy compliance or justify “no data collected”; location, hosted WebView, analytics and resource flows still need accurate treatment. [Data safety scope](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en)
- If this is a personal account created after November 13, 2023, production access requires at least 12 closed-test participants continuously opted in for the preceding 14 days, followed by an application. Account type/date remain unknown; internal testing does not substitute. [Personal-account testing requirements](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)
- Signed verification does not clear physical QA. Test the eventual Play-delivered app's installation, launch, permissions, offline/lifecycle behavior, search/modes, external handoffs, legal/support links and phone/tablet layouts. PR78 physical reports concern an older candidate.
- The shell loads `https://dinner-roulette-chi.vercel.app`. Live Privacy/Terms 1.0 and HTTP/desktop checks are established, while actual deployed no-JavaScript rendering and requested responsive browser checks remain HOLD. Local signing neither changes the hosted deployment nor closes those gaps.

## Preserve existing installations and data

An existing app.pickforus.android debug installation has a different signer from the eventual Play-delivered app. A same-package update may therefore be rejected. Preferences are local-only and source backup is disabled; do not promise Google backup restoration. Prefer a clean permitted device or profile. If unavailable, agree an owner-controlled data-preservation plan and obtain separate approval before uninstalling or clearing data. Historical tablet observations are not acceptance of the new Play-delivered binary.
