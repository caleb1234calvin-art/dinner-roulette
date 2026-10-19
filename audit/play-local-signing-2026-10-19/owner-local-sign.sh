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
