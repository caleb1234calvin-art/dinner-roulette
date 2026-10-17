# Pick For Us: conditional website/legal release and physical Android acceptance

Prepared 2026-10-17. This is a plan, not a release approval or a device-test result.

## Recommendation

Prepare and independently validate the isolated October 19, 2026 candidate now. If it is ready and the owner separately approves the exact source, publish the website and version 1.0 legal pages before Play distribution. Immediately verify the public pages and then the real hosted experience on the Samsung phone and Galaxy Tab A7 Lite SM-T220. The website change also reaches already installed wrappers that use the production origin; it is not limited to browser visitors.

Keep October 19 conditional. If the actual date, readiness, recovery path or required owner decision is unresolved, report HOLD. Recommend the next date that leaves time for the remaining validation and an attended release; do not impose an arbitrary new deadline or backdate the policy. Confirm the publication timezone/window with the owner before the deployment request. The supplied instruction specifies a calendar date, not a timezone; do not silently use a UTC date at a local-midnight boundary.

The production wrapper points to https://dinner-roulette-chi.vercel.app. Installing a new APK cannot make unpublished candidate web pages appear there. Mobile-browser review of a candidate, if an approved reachable candidate exists, is useful but is not physical WebView acceptance. Under the unchanged production-origin constraint, full physical acceptance of the new hosted footer/legal experience occurs after the separately approved website publication. If physical combined acceptance is required before any public exposure, HOLD for an expressly approved isolated test arrangement; do not manufacture a PASS by changing the production origin or weakening security.

## What is authorized and what remains separate

The owner authorized preparing and independently validating a nonproduction candidate derived from PR80, with Privacy Policy and Terms & Conditions 1.0 proposed for October 19. The owner also requested this controlled physical-acceptance path. The date is not mandatory and does not authorize deployment.

This plan performs no merge, deployment, rollback, staging deployment, device installation, device settings change, signing, package registration, Play upload, Console declaration or agreement. It does not change the intended origin, security controls, build settings or version identity. Public legal status remains unchanged until actual authorized publication, even though the isolated candidate's source metadata is prepared to render the proposed date.

Required decisions, at the appropriate step:

1. **Date and final content:** Confirm the actual publication calendar date and timezone/window, final text and owner-operated support/privacy process. Preparation for October 19 does not authorize another date. If the date changes before initial publication, change all matching metadata in the isolated candidate and repeat the date-bound validation.
2. **Website release:** Explicitly approve the exact final commit/tree (and the resulting merge source if applicable), merge and production deployment. State the affected website and installed-wrapper audience. Source approval or a green build alone does not grant this approval.
3. **Recovery:** Explicitly approve a bounded rollback to the freshly identified prior production deployment if the stated failure conditions occur. This can be asked in the same release confirmation, but must be a clear separate scope, with the target and alias limitations disclosed. Without that approval, stop and request it if rollback becomes necessary.
4. **Device participation:** Ask the owner to run the selected tests when stationary and available. Installing an APK or changing an installation/location/accessibility/device setting is not authorized merely by preparing this path. Identify the artifact and any exact permission prompt. Preserve all existing app data; do not disable Play Protect/Auto Blocker, grant broad installation permissions or erase a conflicting installation to make a test proceed.
5. **Any alternate test environment:** A new staging deployment, test-only native configuration, signing/build changes, or altered origin requires its own explicit scope and approval. None is the default recommendation here.
6. **Play later:** Permanent package eligibility/registration, signing keys and certificates, Play App Signing, upload, declarations, audiences/territories, listing media and submission/agreements remain separate unresolved decisions. Credentials and security-sensitive access require their normal secure owner-led flow. Website publication does not waive these gates.

## Evidence boundary

The immutable starting candidate is [PR80](https://github.com/caleb1234calvin-art/dinner-roulette/pull/80), head `29bec315b919535c9aeb3f7e8b1c9e3fa638e80d`, tree `de43c3ee90ad31e5de678737be1eed61b6eb6d01`. [The October 17 checkpoint](https://github.com/caleb1234calvin-art/dinner-roulette/commit/47bb767fd1c2e9c369bb1e6b9c3a89a7bb296cb0) records independent source, compiled native and bounded browser acceptance. Its legal metadata is still unreleased/null. A dated successor requires new exact-source validation; no PR80 test result is automatically its acceptance.

The checkpoint records 1,270 repository tests passing plus 73 application and 17 Python tests; four documented skips. Browser evidence includes 33 legal cases, 350 footer cases and eight focused artwork-decode cases. These are controlled browser observations, not physical-device, universal-image, live-provider or comprehensive accessibility guarantees. Native tests were NO-SOURCE; production signing was skipped.

The configuration is `app.pickforus.android`, label Pick For Us, version 1/1.0.0, SDK 24/36/36. Only the configured HTTPS origin is bridged; cleartext, mixed content and WebView debugging remain disabled. The native bundle contains a connection-error/retry page, not the React server application's candidate website. A successful APK build neither deploys that website nor establishes Play readiness.

### Important newly verified install constraint

The retained PR80 development APK and the previously delivered PR78 development APK have the same application ID and version, but different signing certificates:

| Artifact | APK SHA-256 | Certificate SHA-256 |
| --- | --- | --- |
| Delivered PR78 | `7953b424b7224649bb4128b05dca83f91a19ced1542621c8ed2587a6893c491f` | `f4ca7e7367cb8dd20543c04748b9eea9a8a16050ddd44153cee841b8fea8cea3` |
| Retained PR80 | `8a46e4aebfb7b8a432ff3286c4652788beb3cf0a30194b81d86c67a47c8a3ff1` | `bc77407bc7fcf569fe70481bff0c301d1b48c6129e51e052f3adca088113ee18` |

Both APKs are 4,174,814 bytes. The PR80 APK was copied from the verified retained original archive and its v2 RSA signature, certificate/public-key match and full APK content digest were checked read-only. This is direct cryptographic inspection, not Android installation or apksigner execution. A separate reviewer independently checked both original archive CRCs and exact APK hashes and parsed the same distinct certificate/public-key identities. The full cryptographic signature/content-digest check remains separately attributed. No key was generated or accessed and nothing was rebuilt or resigned.

Do not present PR80's APK as a safe ordinary update to the owner's existing PR78 installation. Stop on any signature conflict. Do not uninstall or clear data to bypass it. A newly built dated candidate may have yet another development signer and must be checked independently before an installation plan is selected.

For the hosted footer/legal checks, prefer the existing confirmed wrapper after publication, recording its actual native provenance and the new hosted deployment separately. This can establish observed combined web behavior in that wrapper; it is not exact-PR80-binary or same-target-update acceptance. If the SM-T220 does not already have this package, a chosen verified APK could be installed there with owner approval; absence of the package and suitability must be observed, not assumed. Where the installed artifact cannot be independently read back, label the identity evidence owner-reported and retain that qualification.

## Sequence and release gates

### 1. Freeze and validate the isolated dated candidate

Follow [docs/legal/PUBLICATION.md](https://github.com/caleb1234calvin-art/dinner-roulette/blob/29bec315b919535c9aeb3f7e8b1c9e3fa638e80d/docs/legal/PUBLICATION.md).

- Keep candidate review isolated and explicitly nonproduction/proposed. Do not expose its proposed effective-date pages as a currently effective public policy through an unapproved preview or staging deployment.
- Set version 1.0 current status/date consistently in `history.json` and both documents in `documents.json`, within the isolated candidate. Proposed source metadata is not evidence of public publication.
- Keep initial change type, wording, summaries and consent/agreement decisions consistent. Do not set a requirement flag false to evade the publication check. Initial 1.0 has no forced acceptance modal; reading/dismissing a notice or continued use is not proof of agreement or consent.
- Run the publication check, auth invariant, aggregate tests, typecheck, scoped/full applicable lint, migration-free production build and exact-source browser acceptance. Bind results to commit, tree, source/build fingerprint and preserved original artifacts. No ordinary build command that chains migrations.
- Independently review rendered full policies, proposed date, history and support contact in fresh sessions, with JavaScript disabled and at narrow/wide layouts and both themes. Recheck footer surfaces including Settings, legal pages and options/plan overlays. Verify actual decoded artwork for covered cases instead of treating blank screenshot slots as image readiness.
- Reconcile owner operations against disclosures. Support/privacy requests are owner-reviewed at causticrelay@gmail.com; no inbox automation or universal legal deadline is implied. This technical plan is not a legal-compliance certification.
- Record the final successor head/tree and exact test evidence before requesting release. If implementation or build inputs change during integration, revalidate the resulting source before publication. Treat unrelated candidates and optional work as separate.

### 2. Fresh attended preflight, then explicit release decision

On the proposed publication day, before any production action:

- Recheck candidate/source identity, required terminal checks, approval scope and calendar date in the agreed timezone. A metadata validator checks consistent ISO dates; it does not establish that today is the authorized actual publication date or grant release authority.
- Verify main and the current production deployment and all five alias bindings. Confirm no unexpected intervening release or source changes. Reconfirm the existing migration-free build setting without changing it.
- Identify the recovery target and verify its availability/restore eligibility by an authorized route. A READY deployment record is not proof of eligibility. Stop any denied permission check; do not retry through another tool or route to bypass it. If needed, the owner can inspect their own authorized Console and supply a qualified observation.
- Ask the owner for the exact merge/deployment decision and any scoped rollback approval, naming remaining device/accessibility/live-provider qualifications. If the owner requires all physical gates first, HOLD rather than treating a browser pass as their fulfillment.
- Ensure a person can perform the public-page and phone acceptance promptly after publication. If essential immediate checks cannot be done, recommend rescheduling rather than leaving an unattended change.

Suggested confirmation content, filled only when the final source is known:

“Approve merging and deploying [commit/tree] to the Pick For Us production website on [actual date, time and timezone]? This publishes Privacy Policy and Terms 1.0 dated [date] and the combined footer to website visitors and existing wrappers loading the production origin. Physical checks of the new hosted experience are still pending. Separately, may I roll back to [freshly verified previous deployment/source] if public legal pages, core discovery, data preservation or navigation fail, subject to the verified five-alias recovery limits?”

Do not send this as an already answered request or execute from this template.

### 3. Publish only the approved exact source, then verify public delivery

After approval, record actual deployment ID/source, merge commit if applicable, first-public timestamp (UTC plus agreed local timezone), and immutable full policy text. No deployment has occurred as part of this plan.

Check all five aliases independently, not only the deployment's historical alias list:

- `pickforus.app`
- `www.pickforus.app` (expected canonical redirect 308 to `pickforus.app`)
- `dinner-roulette-chi.vercel.app` (the wrapper runtime)
- `dinner-roulette-minions-9e2c.vercel.app`
- `dinner-roulette-git-main-minions-9e2c.vercel.app`

Confirm each serves or redirects to the intended release, with no alias error. Verify public `/privacy` and `/terms` on the canonical site and actual wrapper origin, including direct fresh/unsigned navigation and disabled JavaScript. Check full 1.0 text, exact actual effective date, history, support address, section anchors and return navigation. Where a browser or endpoint cannot be checked, retain that gap rather than claiming all-alias content acceptance.

Run the bounded live-site smoke set: Home and four modes, manual location, one legal/footer route cycle in each theme, representative result/options/plan footer, artwork visible, close/Back and return from an external destination. Live availability is an observation for the chosen search/time, not a provider-wide guarantee. Do not place bookings, orders, rides, wagers or send mail.

Initial 1.0 should not display a material-change interruption. Test future material-notice cases in the isolated test harness, not by editing live version/storage state. Do not clear the owner's data to simulate a fresh user.

### 4. Owner-observed Samsung phone session

First record device model, Android and Android System WebView/Chrome versions, selected installed package/artifact evidence, local/UTC time, network type, theme, orientation and production deployment/source. No IMEI, device serial, passwords, private inbox or precise coordinates are needed.

Use one deliberate pass through the cases below. A failed/blocked case stops dependent tests; save redacted evidence and investigate before any targeted retest. A few successful cycles are scoped evidence, not a claim that an intermittent incident can never recur.

1. **Identity and preserved state.** Identify the existing wrapper. Note a disposable saved item/preference in each installed old/new package without clearing either. If installation is needed, use the separately approved verified artifact and stop on an unexpected replacement/signature/permission/security prompt. Do not infer a same-package update pass from a side-by-side old-package installation.
2. **Cold launch and basic discovery.** Online cold launch reaches usable Home; Dinner, Nightlife, Casino and Date Night open; run a manual public city search. Record visible source-bound release cues such as policy date/footer; no endless spinner, blank screen or crash.
3. **Actual footer and legal journey.** On Home, each mode, Settings and representative result/options/plan surfaces, verify reachable footer controls and artwork, both themes, no overlap with system bars/keyboard and no trapped scroll. Open Privacy and Terms from the actual wrapper; inspect version/date, contents anchors, full text, history and Back/return. Confirm no login requirement or incorrect prepared-state label. This is physical combined acceptance only for the recorded native wrapper plus hosted release.
4. **Support and external handoff.** Tap Support and policy contact. Confirm the mail handler/chooser uses causticrelay@gmail.com and the expected subject where supplied; cancel without sending. If no mail app exists, record the available visible address/manual fallback and actual behavior. Do not remove a mail app to force the case. Open Maps/directions and a venue website, then return without starting a trip or purchase. Record whether progress remains; general DoorDash/rideshare landing pages are not destination-specific success.
5. **Location permission boundaries.** If practical and explicitly approved for this test, check denial/manual fallback, approximate and precise permission modes as separate cases, and retry after a denied request. Record actual OS options and outcome; GPS success alone does not prove both modes. Never reset another app's permissions. Use an ordinary manually chosen city when permission testing is unavailable.
6. **State and lifecycle.** Save disposable state in the selected wrapper; close/reopen and background/resume; verify it and the separate old package's observed state are unchanged. Confirm Back/close/reopen through options and plan. Do not test “Clear favorites and history” against meaningful data.
7. **Offline/reconnect incident check.** When safe to interrupt connectivity and explicitly agreed, test offline cold start → reconnect → Retry, and an interrupted search → reconnect/retry. Repeat one recovery cycle and one background/return cycle; if any black screen/cross-app connectivity symptom returns, stop and capture sequence/time/network. Do not disable VPN, alter network/security settings, reinstall or erase storage to claim a fix. The historical intermittent incident remains a qualification even if this bounded retest passes.
8. **Physical accessibility/layout.** Portrait/landscape, larger text/display size if approved, keyboard/system bars and Back; use TalkBack and keyboard focus if actually available and within agreed settings scope. Record labels/focus/reachability and any screen-reader case not exercised. Chromium checks and screenshots are not full accessibility certification.

Owner reports are evidence, but must be labelled owner-observed unless independently witnessed/read back. Use PASS, FAIL, BLOCKED or NOT RUN for each case, with the exact scope and an observation. Generic “everything works” is not substituted for the ledger.

### 5. SM-T220 tablet session and native closure

When the tablet is available, repeat identity, launch, hosted footer/legal, external/mail return, state, offline/retry and layout/accessibility cases using its actual Android/WebView versions. Confirm whether the selected package is already installed before deciding an installation path. Wi-Fi-only does not by itself establish presence or absence of functioning GPS; record actual capabilities and permission modes offered. Do not infer a tablet result from the phone.

While unavailable, tablet cases remain NOT RUN. The owner may decide to release the website with that explicit qualification if web readiness and the attended release gates are met; do not label the combined Android/tablet experience fully accepted. Exact native artifact installation, same-package compatible-signer update, Play-delivered certificate/install and distribution remain distinct. No unsigned AAB can be used as an installable Play release.

## Acceptance and rollback conditions

**Website/legal acceptance:** Exact approved source is public on the intended aliases; full correct effective policies are accessible without authentication and without JavaScript; date/content/history/contact agree; footer/legal navigation and bounded core-web smoke pass; no unauthorized settings/migration or unrelated change; recovery evidence and any qualifications are recorded. This supports website acceptance only.

**Physical combined acceptance:** The required phone/tablet cases have actual source-bound observations for the selected wrapper and hosted release. Identity gaps, unavailable device/OS modes, screen-reader gaps and the intermittent connectivity incident remain explicit. Any owner decision to accept a limited scope must name it; an unavailable case is never converted to PASS. A prior PR78 phone pass or PR80 compiled pass is not a new candidate-device pass.

**Stop and request or perform only already-approved recovery:** Wrong/unapproved source/date, missing or login-gated legal text, wrong support recipient, severe footer/navigation obstruction, crash/blank screen, unrecoverable offline state, suspected data loss or unexpected app replacement, or a core functionality regression attributable to the new web release. Diagnose whether a failure is a hosted regression, pre-existing native issue or provider outage; do not blindly roll back for an unrelated external outage. Security/privacy exposure or data loss merits immediate escalation.

**Recovery target distinction:** The last recorded live baseline is `dpl_FMS2SBg4ymuDwU4avpywV6yB5vg6`, source main `c3208d9fdc9a21d698efa9254be1286f5d3d2836`. After a new release this would be the intended previous website deployment only if fresh readback confirms it. Historical `dpl_8DBJFLQwkBGckTxM5RYPM63dLqS5`, source `ead2319c4869478f4cd121e2370db4d9734d83ed`, was READY but is not automatically the correct or eligible next rollback target. Earlier rollback eligibility access returned 403; no current eligibility is asserted. Hobby immediate-predecessor/retention restrictions and generated-alias recovery uncertainty remain qualifications.

Rollback requires the approved target and authorized supported mechanism. Afterward independently recheck all five aliases, expected redirect, actual runtime and core behavior. Do not assume generated/branch aliases follow the canonical domain. Preserve failure evidence and deployment/publication records.

A technical rollback does not erase a publication that already happened. Preserve the exact text and actual first-public date/time; do not reset real publication history to “never published,” silently backdate a later release, or overwrite a published snapshot. Rolling back to the old website may also remove the newly available policy routes and restore the previously documented privacy deficiency. Disclose that consequence and propose a separately reviewed recovery for continued correct policy access. Do not invent legal status or imply the rollback itself remedies that deficiency.

## Current outcome

Plan prepared. No current website deployment or physical acceptance result is claimed. The dated successor's final source/tests, actual release decision and selected device/artifact remain pending. The blank device ledger starts every proposed new-candidate case as NOT RUN. Historic observations are retained as history, not copied into its verdicts.

## Primary source references

- [Exact PR80 native configuration](https://github.com/caleb1234calvin-art/dinner-roulette/blob/29bec315b919535c9aeb3f7e8b1c9e3fa638e80d/capacitor.config.json)
- [Android release preparation and separate gates](https://github.com/caleb1234calvin-art/dinner-roulette/blob/29bec315b919535c9aeb3f7e8b1c9e3fa638e80d/ANDROID_RELEASE.md)
- [Legal publication procedure](https://github.com/caleb1234calvin-art/dinner-roulette/blob/29bec315b919535c9aeb3f7e8b1c9e3fa638e80d/docs/legal/PUBLICATION.md)
- [Publication metadata guard](https://github.com/caleb1234calvin-art/dinner-roulette/blob/29bec315b919535c9aeb3f7e8b1c9e3fa638e80d/scripts/check-legal-release.mjs)
- [Public legal rendering](https://github.com/caleb1234calvin-art/dinner-roulette/blob/29bec315b919535c9aeb3f7e8b1c9e3fa638e80d/src/components/legal-document-page.tsx)
- [Consolidated acceptance and remaining gates](https://github.com/caleb1234calvin-art/dinner-roulette/commit/47bb767fd1c2e9c369bb1e6b9c3a89a7bb296cb0)
- [Exact-head native validation run](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/39004750057)
- [Previously delivered PR78 native run](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/38949185071)

- [Android app-signing and update continuity reference](https://developer.android.com/studio/publish/app-signing)
