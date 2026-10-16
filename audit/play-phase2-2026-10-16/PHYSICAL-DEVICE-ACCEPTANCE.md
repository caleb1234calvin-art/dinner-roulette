# Pick For Us: physical-device acceptance checklist

Prepared 2026-10-16 UTC. Planning only: **every physical result is NOT RUN**. Browser automation and unsigned AAB checks are not physical Android/WebView acceptance. No install, permission change, data clearing, signing, upload, Console change, or deployment is performed by this document.

## Evidence and release lanes

- Baseline/main: `c3208d9fdc9a21d698efa9254be1286f5d3d2836`; last accepted production identity in the prior audit: `dpl_FMS2SBg4ymuDwU4avpywV6yB5vg6`, source main. Reverify deployment and alias at execution time.
- Prepared legal candidate: draft [PR77](https://github.com/caleb1234calvin-art/dinner-roulette/pull/77), exact `6b370a5202ffb531434d725f49aacbdc325f32c5`. Privacy/Terms 1.0 and history are unreleased, effectiveDate null. Candidate pages are not effective public policy.
- Candidate exact-head web CI 38868400267 and unsigned Android CI 38868400299 succeeded per `../legal-publication-finalization-2026-10-16/PR77-FINAL-REPORT.md`. These are reused results, not rerun here.
- Unsigned AAB SHA-256 `4cead0e51c28e90e5a0d42149e3952690d19a4f61f05bae1cacf55c6c3b5e4ee`; that AAB is not directly installable and not a signed upload candidate. Record the actual APK or Play install separately.
- The Capacitor shell loads `https://dinner-roulette-chi.vercel.app`; its embedded HTML is only an offline/retry page. Installing an APK built from PR77 does **not** make PR77's hosted legal changes appear. Source, native artifact and runtime deployment are three independent identities.
- Planned package `app.pickforus.android` has unverified registration status and is not implemented in this inspected checkout; inspected package remains `com.calebcalvin.pickforus`. Do not silently substitute IDs.

Use independent receipts for these lanes:
1. **PRODUCTION-BASELINE:** current installed package + current hosted production. Record existing behavior and gaps; never claim candidate legal changes are present.
2. **PR77-PREVIEW:** exact candidate preview in the device browser if available, clearly labeled browser-only. For native preview testing, a separately authorized test shell/origin configuration and artifact are necessary. An inaccessible preview is BLOCKED, not PASS. Do not change production just to test.
3. **FINAL-RELEASE:** after separately authorized publication/source finalization and signed Play test release, repeat acceptance using actual Play-distributed app + accepted hosted deployment. This closes native distribution gates; earlier lanes do not.

## Device inventory and capability verification

### Device A: Samsung Galaxy Tab A7 Lite, SM-T220
Samsung's [official SM-T220 model specifications](https://www.samsung.com/sec/support/model/SM-T220NZAFKOO/), corroborated by its [SM-T220 Mexico model page](https://www.samsung.com/mx/tablets/galaxy-tab-a/galaxy-tab-a7-lite-gray-32gb-sm-t220nzaamxo/) list an 8.7-inch 1340×800 display, Wi-Fi, and GPS/Glonass/Beidou/Galileo. Wi-Fi-only does **not** mean no GPS. These are regional manufacturer model specifications, not confirmation of the exact regional unit or a location fix on this particular tablet. The US business support page also supplied indexed specifications but can redirect to generic support; use the explicit model links and on-device model check. Inspect About tablet to confirm actual model, installed Android/One UI and update level. Do not infer current OS from an available manual. Test location outdoors or with good reception when practical and record accuracy/timeout, without publishing personal coordinates. Internet is still needed for hosted discovery.

### Device B: owner's primary Samsung phone
Model, OS, WebView and location capability unknown. Obtain model code and installed software first, then verify official model specifications. Do not infer phone model, Android 16 support, precise-location selector availability, root status, or 16 KB page-size support.

For both: record model, Android/API, One UI, security patch, Android System WebView/Chrome version, screen resolution and display/font scale, navigation mode, locale, network, battery restrictions, TalkBack version and installed mail/maps handlers. Avoid IMEI, serial number, personal screenshots or exact home coordinates.

These two devices do not automatically cover API24, API36, Android17/hybrid signing or 16 KB devices. Record additional emulator/device coverage separately; never relabel emulator evidence as physical.

## Receipt required for each run

Run ID / UTC time / tester / lane / device / OS-WebView / orientation-theme / app package-versionCode-versionName / APK SHA-256 or Play track-release ID / public signer SHA-256 / native source commit / exact runtime URL-deployment-source commit / permission and storage starting state / test ID / steps / observed result / PASS-FAIL-BLOCKED-NOT RUN / evidence filename / issue and retest.

Record starting state before tests. Use disposable test data. Clearing app/site data, disabling clients, installing packages or changing permissions requires the owner's authorized test scope; never erase valued favorites to satisfy a test. Redact coordinates, email contents and notifications from evidence. Public certificate fingerprints are enough; no keys, passwords or tokens.

## Execution cases (run on A and B; all currently NOT RUN)

| ID | Procedure | Acceptance and evidence |
|---|---|---|
| D01 | Cold launch online; relaunch after force-stop; inspect launcher | Correct label/icon, no indefinite splash/blank screen/crash; usable home. Record startup time and first usable frame, without inventing a performance threshold. Check adaptive icon clipping and themed icon appearance where supported. |
| D02 | Visit Dinner, Date Night, Nightlife and available seasonal modes in portrait and landscape, light/dark | No obscured primary controls, horizontal overflow, cropped dialogs, keyboard overlap, status/navigation-bar overlap or unreadable copy. Check both rotation directions while results, options and favorites are open. |
| D03 | Open/close overlays; keyboard search; use system Back and app Back; leave/reenter via Recents | Predictable close/back stack, keyboard dismisses before unintended exit where applicable, no dead-end or accidental duplicate actions. Test gesture and button navigation where available and authorized. |
| D04 | Fresh location state; inspect first render before location action; choose manual place | No unexpected location prompt before user action; valid manual city/postcode yields usable discovery. Invalid/empty/ambiguous query produces clear recoverable feedback. No GPS dependency for manual mode. |
| D05 | Tap location; grant foreground precise if OS offers it | Prompt accurately scoped; location resolves or exposes usable error/retry; no background-location request. Record elapsed time/accuracy category, not personal coordinates. Verify nearby results match test area. |
| D06 | Repeat with approximate permission (Android12+ where available) | App remains usable, no requirement to upgrade to precise just to proceed; uncertainty handled sensibly. If selector unavailable record N/A with OS reason, not PASS. |
| D07 | Deny permission; retry; deny again; disable location service; revoke previously granted access | No prompt loop, crash or misleading success. Manual entry remains available; retry and settings guidance are truthful. Revocation need not erase a previously stored location: inspect and disclose retained state. Re-enable only within authorization. |
| D08 | Trigger location with weak/no satellite reception and network variations | Bounded/recoverable timeout or accurate result; distinguish unavailable GNSS from unavailable web service. On A test Wi-Fi with location enabled and service off; do not assume airplane mode disables all location radios. |
| D09 | Search/filter each mode; change radius/category; empty results; reset filters | Results reflect active filters and location, loading ends, no stale prior-area results masquerading as current. Reset matches documented scope (Dinner/Date Night defaults), not an invented global wipe. |
| D10 | Add/remove favorite, rating, visit/history/note and exclusion using disposable entries | Correct place identity and state in result, favorites and history; survives reload/force-stop/reboot under normal storage. Expired exclusions stop applying. Restart does not duplicate events. |
| D11 | Maps/directions, venue website, available ride-service links; handler installed and absent | Correct destination/URL and safe external handling; no in-WebView trap, raw unsupported-scheme error or crash; return restores usable app state. No actual booking, navigation while driving or transaction. |
| D12 | Support/privacy mailto with configured email client | Composer opens to causticrelay@gmail.com with expected support/privacy subject; user can cancel and return. Opening composer is not successful delivery; do not send a test message without authorization. |
| D13 | Same support flow on clean test profile with no email handler | No crash/blank trap; visible readable/copyable email address and a practical way to contact through a chosen mail service. Record fallback behavior honestly; website mail client is not implied by mailto alone. Don't uninstall the owner's email app. |
| D14 | Cold start fully offline, then reconnect and tap Retry | Local error/retry screen remains usable; no endless spinner; connection restoration returns to hosted app without reinstall or data loss. Full offline discovery is not promised for this hosted shell. |
| D15 | Lose network during search/loading/results; toggle back to connected; repeat transient failure | Clear recoverable state, no duplicate/stale successful results; filters/favorites survive; retry works. Capture distinction between network unavailable and zero venues. |
| D16 | Background app, screen lock, reopen; force-stop/reboot; low-memory eviction if feasible | No crash or permanent loading loop; expected saved state retained and transient loading recoverable. Do not claim low-memory coverage without actual reproduction. |
| D17 | Storage unavailable/denied and read/write failure in approved test profile/harness; open home/privacy/terms/support directly | AppShell does not crash; legal/support routes remain readable; no false claim that changes saved. PR77 fixed optional Zustand rehydration crash: specifically regress this. Automation remains supplemental if actual WebView cannot safely simulate denial. |
| D18 | Dismiss a material-change notice in authorized fixture; reload with storage available and blocked; keyboard/TalkBack | Dismissal affects visibility only, never consent/assent. Version-specific persistence where storage works; blocked storage stays usable and may show notice again. Current initial unreleased1.0 does not require a live material-change banner: use labeled fixture, never pretend fixture1.1 dates are published. |
| D19 | Legal/support navigation and long documents at largest supported font/display scale, both orientations/themes | Version/status/date text, section links and history reachable; no inaccessible clipped text. PR77 shows unreleased/prepared with no effective date. Production gap remains a gap until separately accepted publication. |
| D20 | TalkBack swipe order, labels/roles/state, headings, links, result announcements and modal close; external keyboard Tab/Enter/Escape where available | Essential features operable without sight or touch precision; focus visible and not trapped/lost, dialogs restore focus, actionable controls identifiable. Capture problems, not blanket WCAG certification. |
| D21 | Reduced motion/animation settings, contrast/large text, touch controls | Content does not depend on animation, color alone or sound; no blocking startup animation; controls remain large/reachable. Note measured contrast/touch-size checks separately from subjective observation. |
| D22 | In disposable state use Clear favorites and history; reset filters separately | Clear action removes exactly documented favorites/history/ratings/visits/exclusions/shown results/seasonal identities; separately inspect retained location, filters, theme and other preferences. No claim of server/provider deletion. |
| D23 | Authorized clear-app/site-data or reinstall on disposable profile; compare old/new package if change later occurs | Fresh state expected; no automatic migration promised across different package IDs or browser/WebView origins. Record OS backup/device-transfer behavior only if actually tested. |
| D24 | Final Play test-track install, launch and authorized versionCode-increasing update | Device install compatible; expected distribution certificate, identity, hosted release and persisted data correct. A sideload/debug/internal-app-sharing certificate alone does not establish final distribution/update behavior. |

## Exit decision

Both devices must have identity-bound receipts for applicable core cases. Any crash, data-loss bug, trapped navigation, unusable permission denial or essential accessibility failure blocks acceptance until fixed and retested. Non-applicable cases require explicit reasons. Untested critical cases remain HOLD. The final release must repeat tests affected by package, signer, WebView, native or hosted changes. Production policy publication, Console declarations and signed distribution are separate gates even if physical UX passes.

Reuse context: `../play-compliance-2026-10-16/packaging/PACKAGING-IDENTITY-AUDIT.md`, `../play-compliance-2026-10-16/deliverable/ACCEPTANCE-PLAN.md`, `../legal-publication-finalization-2026-10-16/PR77-FINAL-REPORT.md`. No broad audit was repeated.
