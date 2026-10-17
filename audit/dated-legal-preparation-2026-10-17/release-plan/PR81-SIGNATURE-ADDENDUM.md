# PR81 dated candidate: bounded APK signature addendum

2026-10-17 06:38 UTC. Read-only artifact inspection; no new source audit, build, signing, device installation or deployment.

## Exact provenance

- Source head: `7098b4cbf0e27761fdbb9a9cc1e64f3aef963c94`, read from the retained original archive's source-revision.txt.
- Native run: [39009957533](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/39009957533).
- Artifact: 12092581420, `PickForUs-Android-validation-9323feed88259991ee48afa0032fa2085eaeeb61`; its name uses the GitHub merge SHA, while its source-revision is the exact candidate above.
- Original ZIP SHA-256: `304772cc192cdfb741ce356f6b7b819028eae74ad0ce996a8b16bdb87f77df0e`; all member CRCs passed.
- APK: 4,174,814 bytes; SHA-256 `9e6aa52142c437ff6d5a6a23fe5f4540d0cecd1b38a99ac976ce3a3081ef9d23`.
- Unsigned AAB: 3,103,485 bytes; SHA-256 `ac5623cfcae5aecdda24b6c61f04fc251c21a58bc091ea82e536f4aeaebe559a`, byte-identical hash to PR80. It remains unsigned and is not a Play-upload candidate.

The exact APK's embedded Capacitor config independently remains `app.pickforus.android` pointing to `https://dinner-roulette-chi.vercel.app`, with cleartext, mixed content and WebView debugging false. The implementation worker reports no native source delta from PR80; this bounded check does not repeat the full native source/manifest/resource audit.

## Cryptographic result

Direct APK Signature Scheme v2 parsing verified one RSA PKCS1 v1.5/SHA-256 signer, its certificate/public-key equality, signature over signed data and full chunked APK content digest. This is not an apksigner or device installation result.

PR81 certificate SHA-256: `8cfa88a13c4eee4f68d28a0808a9b5172de24ca720bc8697b6ecec1365f88606`.

That is different from both:

- Delivered PR78: `f4ca7e7367cb8dd20543c04748b9eea9a8a16050ddd44153cee841b8fea8cea3`
- Retained PR80: `bc77407bc7fcf569fe70481bff0c301d1b48c6129e51e052f3adca088113ee18`

All three are separate development signers. Cryptographically valid does not mean compatible with the installed application's update identity, production signing or Play acceptance.

## Physical consequence

Do not install PR81 over the same-package PR78 or PR80 installation or use uninstall/data clearing to work around a signature conflict. The existing confirmed wrapper can still exercise the new remotely hosted footer/legal experience after separately approved website publication, while recording its true native provenance and the new hosted source. That is not exact-PR81-binary or same-package update acceptance.

A clean-device installation of the exact verified PR81 APK is a possible separately approved path only after confirming that no conflicting app.pickforus.android package exists on the chosen device. No such device state, installation or approval is asserted here. The phone/tablet ledger remains all NOT RUN for the new hosted release. The proposed October 19 publication date and all release/rollback/Play gates remain unchanged.

Evidence files: source-evidence/pr81-signature/artifact-binding.json, signature-verification.json, apk-capacitor-config.json and three-candidate-signature-comparison.json. The existing verifier script and copied exact APK are retained beside them for reproducibility.
