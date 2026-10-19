# Signed AAB report reconciliation — 2026-10-19

## Evidence actually read
The existing independent review was read in full through Library: all 77 lines, `has_more=false`, at approximately 19:37 UTC on 2026-10-19. Library returned the backing file's parsed text because full-text fetch was unavailable; no content truncation was reported.

- Name: PickForUs-independent-signed-AAB-verification.txt
- Library ID: libfile_2490def15f788191bbc4843fc9346808
- Size: 4,606 bytes
- Created/modified: 2026-10-19T19:17:07.380964Z
- Version ID: not supplied (null)
- Referenced signed artifact Library ID supplied for reconciliation: libfile_9fbfdd8de19081918f0c9f97104d5e13

This is acceptance/reconciliation of an existing independent report. It is not a new root or reconciliation-worker cryptographic verification. The signed AAB was not rematerialized or reverified, and no signing, key access, Console action or upload occurred in this reconciliation.

## Existing independent report's findings
- Signed AAB: PickForUs-upload-signed.aab; 3,144,515 bytes; SHA-256 aa29027197802cc08bf6070772929cce816f7bf13f7a7c86d2f3beb6c54cdc12.
- Frozen unsigned AAB: 3,103,485 bytes; SHA-256 ac5623cfcae5aecdda24b6c61f04fc251c21a58bc091ea82e536f4aeaebe559a.
- All 430 original decompressed entries match exactly; no modifications/removals. Signed ZIP has 433 entries, adding only META-INF/MANIFEST.MF, META-INF/UPLOAD.SF and META-INF/UPLOAD.RSA. Both CRC checks pass; no duplicate or unsafe entry paths.
- All 430 original entries have independently reviewed `sm` coverage in Java 21 strict verbose verification.
- Exactly one RSA 4096 signer; SHA256withRSA with SHA-256 digest. Public certificate SHA-256: 8C:B8:B5:CE:2E:67:14:2A:D2:B2:57:24:85:84:BC:0F:BB:BF:DE:37:B0:48:85:CB:6F:1A:F1:36:22:D4:E3:70.
- Report explicitly states this matches the independently pre-recorded owner-provided public fingerprint. Reconciliation did not independently reread that earlier owner record.
- Certificate validity: 2026-10-19 18:06:53 UTC through 2054-03-06 18:06:53 UTC.
- Tool reported: OpenJDK 21.0.12.1. Non-strict jarsigner verification exited 0 with `jar verified`; strict verification exited 4. Commands described include `jarsigner -verify -verbose:summary -certs`, strict `-verbose:all`, and `keytool -printcert -jarfile`.
- Binary manifest decoded read-only: app.pickforus.android; versionCode 1 / versionName 1.0.0; minimum/target/compile SDK 24/36/36. Expected permissions, signature-only receiver permission, backup/cleartext restrictions and hosted Capacitor configuration were checked. Original and signed manifest/config bytes are identical.

## Exact warning qualification
The existing reviewer examined the full footer and attributes code 4 solely to the self-signed/untrusted PKIX chain, with no-timestamp and future 2054-expiry notices. It reports no payload corruption, unsigned application entries, unexpected signer, weak algorithm, expired certificate or not-yet-valid certificate at signing time. This is a qualified pass for this exact artifact and pinned certificate, never blanket acceptance of exit code 4.

## Remaining boundary
The report supports the owner's separate decision about uploading this exact AAB to internal testing. It does not prove Play Console acceptance, enrollment/key choice, acceptance of agreements, unused versionCode, policy completion or physical Play-distributed testing. No technical remediation is identified by this report. Those Console/owner/test gates remain; existing debug installations and private data must be preserved.

No private key, password, decrypted backup or unnecessary certificate subject fields are included in this receipt.
