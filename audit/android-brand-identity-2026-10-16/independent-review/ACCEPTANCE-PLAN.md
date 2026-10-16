# Independent Android identity candidate acceptance plan

Prepared 2026-10-16. Implementation approval is limited to the `app.pickforus.android` candidate with Caustic Relay developer branding and unchanged Pick For Us app label. No registration, credentials, signing, upload, merge, deployment, legal publication or physical-device acceptance is implied.

## Evidence binding

- Expected base: `c3208d9fdc9a21d698efa9254be1286f5d3d2836`.
- Receive frozen candidate commit/tree and record clean status before/after review.
- Compare exact base to candidate, not mutable main or a previous Android build.
- Preserve legal-support PR77 at `6b370a5202ffb531434d725f49aacbdc325f32c5`, tree `520f545ec006041ef5694a138cfb65f7a897011c`; preserve unreleased/null policies.

## Source scope and consistency

- Capacitor appId, Gradle namespace/applicationId, Java path/declaration, strings package_name/custom_url_scheme, verifier expectations all resolve to target.
- Relative manifest MainActivity resolves to target and has MAIN/LAUNCHER; FileProvider retains applicationId placeholder.
- Old identities absent from active production native source, while targeted rejection fixtures, compatibility documentation and historical receipts remain truthful.
- No broad rename of repository provenance, runtime host, persistence keys, dependencies or approved artwork.
- SDK 24/36/36, version 1/1.0.0, app name, backup=false, cleartext=false, mixed content=false, WebView debugging=false, permission boundaries and signing guard remain unchanged.
- Workflow permissions, signing dispatch default/guard, protected environment and secret names unchanged. No distribution side effects.

## Tests and artifact checks

- Review identity and permission test coverage, including isolated namespace, Java declaration/path, resources, obsolete IDs, activity, provider authority, receiver permission and protection flags.
- Independently run relevant source/Python tests and inspect full test/typecheck/lint/data-audit/build/sync logs bound to frozen candidate.
- Inspect raw unsigned AAB and debug APK, record SHA256/size and source revision; verify bundletool/tool checksums and signed/unsigned distinction.
- Inspect compiled manifest exact package/version/SDK, launcher activity, FileProvider/AndroidX authorities and signature-only dynamic receiver permission; preserve exact permission set.
- Inspect actual DEX type/class identity, embedded Capacitor config and fallback web asset, labels/icons, absence of unexpected .so files and release security flags.
- Ensure artifact evidence is from this candidate, not prior-package output. Debug APK is development-only and unsigned AAB validation-only.

## Explicit limits

Package migration creates a separate installation/sandbox. Same remote origin does not transfer Android app-local data. Old data must remain untouched and there is no automatic transfer. Source/binary checks do not prove cold launch, device permissions, coexistence, state preservation, physical-device behavior, external registrations, Console history, certificate eligibility or Play acceptance. Record those separately as unverified/HOLD.

## Review result

Pending frozen candidate and raw build artifacts. Report defects immediately with minimal bounded fix; no reviewer source edits without parent authorization.
