# Exact PR78 development APK delivery preparation

2026-10-16. **Prepared and independently verified; every physical/device test is NOT RUN.** No rebuild, new signing, credential access or device operation occurred. SM-T220 testing remains deferred.

## Deliverable

- Local file: `/workspace/scratch/a0ea701c7b34/android-brand-identity-review/physical-preparation/PickForUs-debug.apk`
- Size: **4,174,814 bytes**
- SHA256: `7953b424b7224649bb4128b05dca83f91a19ced1542621c8ed2587a6893c491f`
- Source: `4010edf31e71a7350d891a98dd43f20535602abd`
- Tree: `f521ed3dbdabceeb924ad4da1ce88e42db41092c`
- Package: `app.pickforus.android`
- Label: Pick For Us; versionCode 1/versionName 1.0.0; minimum API24, target/compile API36.

Extracted directly from the previously verified original GitHub archive, then byte-for-byte compared with its APK member. Re-ran independent original-archive manifest, DEX, resource/config and source-revision checks. Source revision and both artifact/member hashes remain exact. Existing runtime is `https://dinner-roulette-chi.vercel.app`; this APK does not embed or deploy candidate web source.

## Development signer

Independent APK Signature Scheme v2 block parsing verified the RSA PKCS1 v1.5/SHA256 signature over signed data, certificate/public-key equality and complete APK chunked content digest. This is a new cryptographic verification, supplementing the earlier signing-block-presence-only review. It was not an apksigner execution or Android installation.

- One signer, subject and issuer: `C=US,O=Android,CN=Android Debug`
- Certificate SHA256: `f4ca7e7367cb8dd20543c04748b9eea9a8a16050ddd44153cee841b8fea8cea3`
- Certificate SHA1: `183d1b38a648d07ba3e5be4b684c548c5003e555`
- Serial: 1
- Validity: 2026-10-16 18:45:00 UTC to 2056-10-08 18:45:00 UTC
- Signature algorithm ID: 0x0103
- Evidence: `signature-verification.json`, `verify-signature.py`, `debug-certificate.der`.

This is an Android development certificate, not an owner-approved upload/distribution certificate. The artifact is debuggable and intended only for controlled development testing.

## Original GitHub access

- Artifact ID: **12068290260**
- Artifact name: `PickForUs-Android-validation-65b03d5d2437db15cd8762d00386fdf27498d842`
- Verified run page: https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/38949185071
- API metadata URL returned by GitHub: https://api.github.com/repos/caleb1234calvin-art/dinner-roulette/actions/artifacts/12068290260
- Original archive-download endpoint returned by GitHub and used by the successful download tool: https://api.github.com/repos/caleb1234calvin-art/dinner-roulette/actions/artifacts/12068290260/zip
- Browser artifact-route candidate: https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/38949185071/artifacts/12068290260 . Direct browser fetch returned cache miss, so user-access readiness for this route is **not verified**. Prefer the verified run page or a native attachment of the exact APK.
- Original archive expires 2026-10-30 18:45:04 UTC according to saved API metadata. Authentication may be required for GitHub artifact download. The archive contains both APK and unsigned AAB; only the debug APK is the prepared installable file.

## Safe installation boundaries

1. Preserve the former package `com.calebcalvin.pickforus`, any prototype install and their data. Do not uninstall, clear storage or overwrite them. The new application ID is a separate install/sandbox, with no automatic data transfer.
2. Check whether `app.pickforus.android` is already installed before proceeding. If it is signed by another key or has a conflicting version, stop and inspect rather than uninstalling it or clearing its data. Development CI keys may differ across runs; future same-target update continuity must be checked against this exact certificate.
3. This is a development APK, not a Play release. Do not disable security protections broadly or bypass security warnings to install. Any required device permission/settings step must follow owner confirmation and supported handoff rules.
4. Do not substitute the unsigned AAB for this APK or rebuild a differently signed artifact. Installation, launch, coexistence, local-state preservation, permissions, WebView loading and same-target updates remain untested until explicitly performed on the authorized phone.
