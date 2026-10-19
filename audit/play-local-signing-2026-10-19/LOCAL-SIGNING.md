# Pick For Us: owner-only local Termux signing

Prepared 2026-10-19. Instructions only; no signing has been executed by the assistant. This route uses your existing local key and does not configure GitHub secrets or run a remote signing job.

## Before you start

You reported an RSA 4096 PKCS12 key at `~/.local/share/pickforus-signing/pickforus-upload.p12`, alias `pickforus-upload`, with `PrivateKeyEntry` and public fingerprints checked. You also reported that the AES-256 GPG backup decrypted to the original hash and the downloaded Drive backup matched. A second backup remains deferred; this guide does not claim it exists or create another key.

Have the SHA-256 upload-certificate fingerprint from your **previously saved public record** ready. Its actual value is not present in this conversation and is deliberately not invented here. Do not derive a new value and use it as both the expected and actual identity. If the original record is unavailable or mismatches, stop before signing. The public fingerprint is safe to discuss; the key file, passwords, decrypted backup, and base64 private material are not.

Use your existing trusted Termux installation with JDK 21, Bash, `unzip` and coreutils. Check `java -version`, `keytool -help` and `jarsigner -help` locally. If a required tool is missing or Java is not 21, stop for a small setup check rather than installing from an unknown source. No Python is required. Turn off screen recording and shell tracing. Type passwords only at the tools' own interactive prompts; never paste passwords into the command line, a script, chat, an environment variable or a log.

This signs a previously built AAB. Do not rebuild, run Gradle, use `apksigner`, run `zipalign`, or alter the archive after signing. An AAB is not directly installable.

## 1. Download and verify the exact unsigned artifact

Use your normal authenticated GitHub browser session, not a copied token or guessed download command:

- [Android readiness run 39015345242](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/39015345242), attempt 2
- [Validation artifact 12171094706](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/39015345242/artifacts/12171094706)

The artifact name contains a different workflow SHA. Use the actual source receipt and verified hashes below, not the name alone. The source is `cf18ff1c5a56ecf59f8006d4f7c83fb289f393df`; its full source tree matches main `e078dcdaa9f0ca84951409cdb92805731af3d34b`: `6300c1061a790d84447bb92166f340aec895757b`.

Rename the downloaded ZIP in Android Downloads to `PickForUs-validation-attempt2.zip`. If that name already exists, stop and identify it rather than overwrite it. With existing Termux shared-storage access, the expected path is `$HOME/storage/downloads/PickForUs-validation-attempt2.zip`. If access is unavailable, stop; no new storage permission is assumed here.

Paste this block. It reads the download and creates a new private working folder; it does not touch your key.

```bash
(
  set +x
  set -euo pipefail
  umask 077
  ZIP_SOURCE="$HOME/storage/downloads/PickForUs-validation-attempt2.zip"
  test -f "$ZIP_SOURCE"
  mkdir -p "$HOME/.local/share/pickforus-release"
  WORK=$(mktemp -d "$HOME/.local/share/pickforus-release/download-XXXXXXXX")
  cp -- "$ZIP_SOURCE" "$WORK/validation.zip"
  cd "$WORK"
  test "$(stat -c %s validation.zip)" = 6865783
  printf '%s\n' '960ca4523f18c2ccbd892ccbc329a9177a34955e49762c08dc108cf0b236fb56  validation.zip' | sha256sum -c -
  unzip -t validation.zip
  unzip -q validation.zip -d extracted
  cd extracted
  test "$(cat source-revision.txt)" = cf18ff1c5a56ecf59f8006d4f7c83fb289f393df
  test "$(stat -c %s PickForUs-unsigned.aab)" = 3103485
  printf '%s\n' 'ac5623cfcae5aecdda24b6c61f04fc251c21a58bc091ea82e536f4aeaebe559a  PickForUs-unsigned.aab' | sha256sum -c -
  chmod 400 PickForUs-unsigned.aab
  printf '\nVerified unsigned AAB path for the next step:\n%s/extracted/PickForUs-unsigned.aab\n' "$WORK"
)
```

Any error means stop. Do not continue by omitting a failed check. The ZIP member is at its root as `PickForUs-unsigned.aab`; the archived `SHA256SUMS` text includes an `artifacts/` prefix from CI and should not be blindly run in the extraction directory. The command above checks the independently recorded hash directly. Keep the ZIP and unsigned input unchanged.

## 2. Save and run the local signing script

Save the script below as `owner-local-sign.sh` in a new private folder. If creating it with an editor, do not overwrite an existing file. Then run `bash owner-local-sign.sh` in Termux. Do not pipe the script into a shell: it needs your interactive terminal.

It asks for the verified absolute AAB path and your previously saved **public** certificate fingerprint, allowing colons. Do not include the `SHA256:` label. It checks the selected keystore's public certificate against that independent record before offering to sign. Only type `SIGN` after reviewing the local public details: expected alias, RSA 4096, correct certificate validity and intended owner. Passwords are requested directly by `keytool`/`jarsigner`; you may be prompted again for each separate command. For this PKCS12 file, use its existing password setup (typically the same store/key password); where supported, jarsigner prompts separately if the private-key password differs. Do not change the key or passwords to work around a failure. The unsigned input is copied read-only into a new private folder; `-signedjar` writes a separate output and refuses a pre-existing destination.

```bash
#!/usr/bin/env bash
set +x
set -euo pipefail
umask 077
export LC_ALL=C
fail() { printf '\nSTOP: %s\n' "$*" >&2; exit 1; }
for tool in java keytool jarsigner sha256sum stat mktemp cp chmod awk tr grep mkdir cat; do
  command -v "$tool" >/dev/null || fail "Missing tool: $tool. Stop and ask before installing anything."
done
JAVA_VERSION=$(java -version 2>&1)
printf '%s\n' "$JAVA_VERSION"
printf '%s\n' "$JAVA_VERSION" | grep -Eq 'version "21(\.|")' || fail 'JDK 21 is required; stop for a setup check.'
KEYSTORE="$HOME/.local/share/pickforus-signing/pickforus-upload.p12"
ALIAS='pickforus-upload'
EXPECTED_AAB='ac5623cfcae5aecdda24b6c61f04fc251c21a58bc091ea82e536f4aeaebe559a'
[[ -f "$KEYSTORE" && ! -L "$KEYSTORE" ]] || fail 'Expected local keystore is missing or is a symlink.'
read -r -p 'Full path to downloaded PickForUs-unsigned.aab (no quotes; no ~ abbreviation): ' INPUT </dev/tty
[[ "$INPUT" == /* && -f "$INPUT" ]] || fail 'Enter an existing absolute AAB file path.'
read -r -p 'PUBLIC SHA-256 fingerprint from your PREVIOUSLY saved upload-certificate record: ' EXPECTED_CERT </dev/tty
EXPECTED_CERT=$(printf '%s' "$EXPECTED_CERT" | tr -d '[:space:]:' | tr '[:lower:]' '[:upper:]')
[[ "$EXPECTED_CERT" =~ ^[0-9A-F]{64}$ ]] || fail 'Expected certificate fingerprint must contain exactly 64 hexadecimal digits.'
ROOT="$HOME/.local/share/pickforus-release"
mkdir -p "$ROOT"
WORK=$(mktemp -d "$ROOT/local-sign-XXXXXXXX")
printf '\nLocal working folder: %s\n' "$WORK"
UNSIGNED="$WORK/PickForUs-unsigned.aab"
SIGNED="$WORK/PickForUs-upload-signed.aab"
cp -- "$INPUT" "$UNSIGNED"
chmod 400 "$UNSIGNED"
[[ "$(sha256sum "$UNSIGNED" | awk '{print $1}')" == "$EXPECTED_AAB" ]] || fail 'Unsigned AAB checksum mismatch. Do not sign.'
[[ "$(stat -c %s "$UNSIGNED")" == 3103485 ]] || fail 'Unsigned AAB size mismatch. Do not sign.'
printf '%s\n' "$EXPECTED_CERT" > "$WORK/expected-upload-certificate-sha256.txt"
printf '\nEnter passwords ONLY at the keytool/jarsigner password prompts, never as shell commands.\n'
keytool -J-Duser.language=en -J-Duser.country=US -list -v \
  -storetype PKCS12 -keystore "$KEYSTORE" -alias "$ALIAS" \
  > "$WORK/local-key-public-details.txt"
grep -Fq 'Entry type: PrivateKeyEntry' "$WORK/local-key-public-details.txt" || fail 'Alias is not a PrivateKeyEntry.'
cat "$WORK/local-key-public-details.txt"
keytool -J-Duser.language=en -J-Duser.country=US -exportcert \
  -storetype PKCS12 -keystore "$KEYSTORE" -alias "$ALIAS" \
  -file "$WORK/upload-certificate.der"
ACTUAL_CERT=$(sha256sum "$WORK/upload-certificate.der" | awk '{print toupper($1)}')
[[ "$ACTUAL_CERT" == "$EXPECTED_CERT" ]] || fail 'Current upload certificate does not match the previously recorded fingerprint. Do not sign.'
printf '\nCertificate fingerprint matches your prior record. Review the displayed key type, size and validity.\n'
read -r -p 'If it is your intended valid RSA 4096 upload key, type SIGN to sign this AAB locally: ' CONFIRM </dev/tty
[[ "$CONFIRM" == SIGN ]] || fail 'Signing cancelled; unsigned input retained.'
[[ ! -e "$SIGNED" ]] || fail 'Signed output unexpectedly already exists.'
jarsigner -J-Duser.language=en -J-Duser.country=US \
  -keystore "$KEYSTORE" -storetype PKCS12 \
  -sigalg SHA256withRSA -digestalg SHA-256 -sigfile UPLOAD \
  -signedjar "$SIGNED" "$UNSIGNED" "$ALIAS"
[[ -s "$SIGNED" ]] || fail 'No signed output was produced.'
[[ "$(sha256sum "$UNSIGNED" | awk '{print $1}')" == "$EXPECTED_AAB" ]] || fail 'Unsigned copy changed. Stop.'
VERIFY_RC=0
jarsigner -J-Duser.language=en -J-Duser.country=US \
  -verify -strict -verbose:all -certs "$SIGNED" \
  > "$WORK/jarsigner-verification.txt" 2>&1 || VERIFY_RC=$?
printf '%s\n' "$VERIFY_RC" > "$WORK/jarsigner-exit-code.txt"
keytool -J-Duser.language=en -J-Duser.country=US -printcert -jarfile "$SIGNED" \
  > "$WORK/signed-aab-public-certificate.txt"
SIGNED_CERT=$(awk '/^[[:space:]]*SHA256:/{print $2}' "$WORK/signed-aab-public-certificate.txt" | tr -d '[:space:]:' | tr '[:lower:]' '[:upper:]')
[[ "$SIGNED_CERT" =~ ^[0-9A-F]{64}$ ]] || fail 'Could not identify exactly one signed-AAB certificate fingerprint; review certificate report.'
[[ "$SIGNED_CERT" == "$EXPECTED_CERT" ]] || fail 'Signed AAB certificate fingerprint mismatch. Do not upload.'
{
  printf 'Status: SIGNED CANDIDATE; warning/payload review and upload approval still pending\n'
  printf 'Package expected from verified unsigned input: app.pickforus.android\n'
  printf 'Source: cf18ff1c5a56ecf59f8006d4f7c83fb289f393df\n'
  printf 'Source tree: 6300c1061a790d84447bb92166f340aec895757b\n'
  printf 'Upload certificate SHA-256: %s\n' "$SIGNED_CERT"
  printf 'Jarsigner strict exit code: %s\n' "$VERIFY_RC"
  printf 'Unsigned bytes: %s\n' "$(stat -c %s "$UNSIGNED")"
  printf 'Signed bytes: %s\n' "$(stat -c %s "$SIGNED")"
  sha256sum "$UNSIGNED" "$SIGNED"
} > "$WORK/signing-receipt.txt"
cat "$WORK/signing-receipt.txt"
printf '\nRead the ENTIRE verification report before treating this as verified:\n%s\n' "$WORK/jarsigner-verification.txt"
cat "$WORK/jarsigner-verification.txt"
case "$VERIFY_RC" in
  0) printf '\nStrict verification returned 0; still review all warnings and payload coverage.\n' ;;
  4) printf '\nSTOP FOR REVIEW: code 4 is ambiguous. It is NOT automatically acceptable. See the warning rules.\n' ;;
  *) fail "Strict verification returned $VERIFY_RC. Do not upload; retain logs for review." ;;
esac
printf '\nSigned candidate saved at: %s\nNo upload has occurred. Independent signed-payload review remains pending.\n' "$SIGNED"
```

If interrupted or failed, keep the printed working folder and review the error. A partial signed file is not acceptable. Do not remove guards to rerun. Running the script again creates a separate new folder rather than overwriting the earlier candidate.

## 3. Read the full verification result

The script records `jarsigner-verification.txt`, its exit code, the signed certificate report, SHA-256 values and byte sizes. It deliberately never prints “ready to upload.”

- Require cryptographic verification of every payload file, one expected signer, and the signed certificate SHA-256 equal to your prior record. In verbose output, `s` marks verified signatures and `m` marks manifest-listed entries. Signature-control files and directories are special; they are not unsigned application payload.
- **Code 4 is not automatic success.** Self-signed/untrusted-chain warnings can be expected for a pinned Android upload certificate; expiry, not-yet-valid certificates and disabled algorithms also share code 4 and are blockers. Review the exact messages and validity dates.
- Reject unsigned payload, digest/signature errors, unexpected certificates, incorrect key usage, weak/disabled algorithms, or unrecognized warnings. Do not disable security checks. A missing timestamp alone is not a Play-upload failure; inspect any reported expiry date. POSIX metadata warnings need review, not a blanket bypass.

A zero exit code still requires reading warnings and confirming the fingerprint. A nonzero code must be explained, not concealed. Never use `|| true` to turn verification into success.

## 4. Stop at the signed-candidate receipt

Keep the signed AAB, original unsigned AAB, public certificate, and local reports. Report only the signed AAB's byte size/SHA-256, public certificate SHA-256, strict exit code and exact warnings. The signed AAB is a distribution artifact and can be provided for independent review without the keystore or any passwords. Public certificate reports can contain certificate identity fields; share only what is needed.

Before any upload, an independent reviewer should compare every decompressed original payload entry against the signed candidate, reject duplicate entries or unexpected additions, allow only expected signature metadata, and recheck bundle structure/package/version. That check is intentionally deferred until an actual signed AAB is available; this document does not claim it passed. Confirm `app.pickforus.android`, versionCode 1 / versionName 1.0.0, the reviewed hosted runtime and current upload/version eligibility. Signing does not change the hosted web deployment.

Uploading this exact candidate to the intended Play app, selecting/enrolling Play App Signing, accepting any new agreement, adding testers and rolling out internal testing remain separate owner decisions. Google-generated distribution signing uses a separate app-signing key for Play-delivered APKs. Preserve old installations/data; a same-package debug installation generally cannot be updated by a differently signed Play build without a separately considered migration/testing plan.

## Sources and review scope

- [Android command-line build/signing guide](https://developer.android.com/build/building-cmdline): AAB signing with `jarsigner`; `apksigner` is not for AABs.
- [JDK 21 jarsigner manual](https://docs.oracle.com/en/java/javase/21/docs/specs/man/jarsigner.html): interactive password prompts, separate output, strict verification and warning interpretation.
- [JDK 21 keytool manual](https://docs.oracle.com/en/java/javase/21/docs/specs/man/keytool.html): public-certificate export and inspection.

The unsigned AAB hash was independently recomputed again during preparation. Script syntax was checked with `bash -n`; no signing command or private-key operation was executed. Commands were reviewed for quoted paths, interactive input, checksum-before-signing, distinct output, no secret arguments, no pipeline masking of verification status, and no automatic acceptance of ambiguous code 4. Real Termux execution and signed-candidate acceptance remain unverified.
