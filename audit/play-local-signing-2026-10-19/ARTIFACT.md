# Verified unsigned AAB for owner-operated local signing

Reverified October 19, 2026 at 18:40 UTC. No build, signing, key access, secrets configuration, upload, or deployment performed.

## Exact download and source

- GitHub artifact: https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/39015345242/artifacts/12171094706
- Run 39015345242, attempt 2. Validation job 117953155780 passed; signing job 117954634084 skipped (preserved terminal CI receipt).
- Fresh GitHub artifact metadata confirms artifact 12171094706 is present and unexpired; expiry November 2, 2026 at 08:07:44 UTC.
- Artifact display name: PickForUs-Android-validation-510cef023f5e567aaa591353d6adc9ecd7bb7b44. The suffix is the synthetic PR merge SHA, not the checkout used to build the AAB.
- Actual source-revision.txt inside the ZIP: cf18ff1c5a56ecf59f8006d4f7c83fb289f393df.
- Fresh GitHub reads confirm live main e078dcdaa9f0ca84951409cdb92805731af3d34b and artifact source cf18 both have complete Git tree 6300c1061a790d84447bb92166f340aec895757b. This is an identical-source-tree build, not a run dispatched on main.

## Exact bytes to use

ZIP: 6,865,783 bytes. SHA-256:

960ca4523f18c2ccbd892ccbc329a9177a34955e49762c08dc108cf0b236fb56

The AAB is the root ZIP member **PickForUs-unsigned.aab**, without a containing artifacts/ directory. The checksum file uses artifacts/ prefixes from CI; those are not ZIP member paths.

AAB: 3,103,485 bytes. SHA-256:

ac5623cfcae5aecdda24b6c61f04fc251c21a58bc091ea82e536f4aeaebe559a

Recomputed both hashes against preserved downloaded bytes; ZIP hash matches fresh GitHub metadata digest. ZIP/AAB CRC integrity passed, source revision matched, and the AAB bytes equal the separately preserved accepted AAB. No JAR signature block or .SF entries are present. This is the unsigned input; signing produces different bytes and therefore a different SHA-256.

The same actual AAB previously passed independent local validation using checksum-pinned official bundletool 1.18.3 and the exact-tree verifier: package app.pickforus.android; versionCode 1 / versionName 1.0.0; SDK min 24 / compile 36 / target 36; correct launcher and foreground-only location permissions; no packaged native .so libraries. It is an HTTPS shell loading https://dinner-roulette-chi.vercel.app, not an embedded web-source snapshot.

## Evidence

Fresh sanitized metadata and source equivalence are in [ARTIFACT-RECEIPT.json](ARTIFACT-RECEIPT.json). Original archive and full local verification receipts are retained privately. Prior independent artifact review is preserved in [the earlier preparation report](../play-internal-2026-10-19/ANDROID-READINESS.md).

## Limits

Fresh metadata confirms retention and availability; no redundant download was needed because the preserved archive's digest still matches the current artifact digest. Owner download access depends on their GitHub session. This is not signed, not Play-upload ready, and does not establish physical Android/WebView acceptance. Signing is to be performed only by the owner locally; no keystore, password, certificate private key, or other signing secret was accessed.
