# Owner-reported tablet and standalone PWA observations — October 17, 2026

## Disposition

**Owner-reported prerelease observations recorded; no independent device witnessing or automatic certification.** Portrait looks good. Landscape works and its visible interface is not cropped, but a narrow phone-sized central column leaves substantial tablet width unused. This is a **nonblocking visual/usability improvement** tracked separately in [Issue #83](https://github.com/caleb1234calvin-art/dinner-roulette/issues/83).

The historical intermittent infinite black-screen incident was **not reproduced in this session**. It remains **UNRESOLVED**: no root cause, permanent fix or general offline-reliability conclusion is established.

A separate **OWNER-REPORTED successful standalone PWA installation and launch smoke test** is recorded. The owner discovered Pick For Us through an actual Google search result, the browser offered installation, installation succeeded, and launching it produced a standalone experience without the ordinary address bar. The enabled ad blocker did not prevent that particular installation.

## Source and provenance

Source: owner message `Sentinel_313a16f3a4f48191b88acdd93e2270b1`, supplied October 17, 2026. Exact per-test time and timezone are unspecified. The report date is not an inferred execution timestamp.

Selected verbatim owner statements:

> Device: Samsung Galaxy Tab A7 Lite (SM-T220). I completed every pre-release tablet check I could reasonably perform from the provided checklist.

> Portrait layout looks good.

> Landscape mode is functional, and the visible interface is not cropped.

> However, landscape presentation is awkward because the application remains constrained to a narrow, phone-sized central column, leaving substantial unused tablet screen space.

> The previously observed infinite black-screen problem could not be reproduced during this testing session.

> I discovered Pick For Us through an actual Google search result. From the website, my browser offered an installation option. I successfully installed the application, and it opens as a standalone experience without the ordinary browser address bar. My enabled ad blocker did not prevent that installation.

The source is the owner's report. No screen recording, screenshot, device log, installed-app identity readback or assistant-witnessed execution accompanies this new report. Historical phone screenshots/observations remain separate evidence and are not transferred to this tablet or PWA session.

### Source fields kept separate

| Field | Tablet prerelease session | Standalone PWA smoke |
| --- | --- | --- |
| Device | Samsung Galaxy Tab A7 Lite, SM-T220, owner-reported | Not explicitly supplied; not assumed to be the tablet |
| App/installation context | UNKNOWN: browser tab, existing Capacitor wrapper or PWA not established | Browser-offered installed standalone experience, owner-reported |
| Browser/version | UNKNOWN | UNKNOWN |
| Android/WebView version | UNKNOWN | UNKNOWN |
| Native package/version/APK hash/signer | UNKNOWN | Not established; no WebAPK/package mechanism inferred |
| Exact hosted URL/deployment/source | UNKNOWN | UNKNOWN |
| Observation date/time | Reported October 17; exact test time UNKNOWN | Reported October 17; exact test time UNKNOWN |
| Network/ad blocker | Exact network and configuration UNKNOWN | Enabled ad blocker did not prevent this install; product/configuration/network UNKNOWN |
| Independent witnessing | None | None |

The separate PWA report does not establish which installation context produced the tablet layout observations. Standalone launch without an address bar does not independently prove a particular browser, WebAPK package, installed display mode, manifest/SW version, cache behavior, update path or distribution mechanism. No follow-up question is necessary to record the bounded evidence now.

## Reconciliation with existing QA

Reviewed at canonical continuity `73b46fa94156c5df7a1d8792c37f9d24c708216b`:

- `audit/android-brand-identity-2026-10-16/device/PHONE-TABLET-CHECKLIST.md`
- `audit/android-brand-identity-2026-10-16/device/OBSERVATION-LEDGER-2026-10-16-2349.csv`
- `audit/android-brand-identity-2026-10-16/device/OWNER-PHONE-RECONCILIATION-2026-10-16.md`
- `audit/android-brand-identity-2026-10-16/device/OWNER-PHONE-RETEST-2026-10-16.md`
- `audit/dated-legal-preparation-2026-10-17/release-plan/PHYSICAL-OBSERVATION-LEDGER.csv`
- `audit/dated-legal-preparation-2026-10-17/release-plan/OWNER-SESSION-CARD.md`
- `audit/dated-legal-preparation-2026-10-17/release-plan/RELEASE-AND-DEVICE-PLAN.md`
- `audit/play-phase2-2026-10-16/PHYSICAL-DEVICE-ACCEPTANCE.md`
- Issue #71 and current conditional-release authorization.

The old tablet-unavailable statements remain correct historical checkpoints. This new additive observation record supersedes the *current availability* assumption: the owner has now performed reasonably available tablet checks. It does not fill in absent per-case results.

### Exact formal-case disposition

- The existing 36-row new-release phone/tablet ledger remains preserved, with every row **NOT RUN for the exact new release candidate**. None is certified PASS by this report.
- Tablet D01 device identity: model is now owner-reported; selected installed app, native and hosted identity remain unknown. The identity case is not complete.
- Tablet D15 / prior P12 orientation: owner-reported portrait good and landscape functional/uncropped, with a nonblocking narrow-column usability issue. This is a partial observation only. Larger text, keyboard, insets, Back, focus and exact candidate source are not supplied; the compound formal case remains incomplete/NOT RUN for the new candidate.
- Tablet D13 / prior P11 offline recovery: historical black screen not reproduced in this session. No exact cold-start/reconnect/Retry sequence, repetition count, network state or source is supplied; do not convert the formal case to PASS.
- General statement of completed reasonably available checks is recorded as **OWNER-REPORTED COMPLETION, CASE MAPPING UNSPECIFIED**. No individual launch, permission, data-persistence, handler, accessibility or update case is inferred.
- Unpublished footer and effective legal pages, final native build, same-package compatible-signer update and final Play distribution remain **NOT RUN**. Their gates are distinct from current hosted-site observations and PWA install smoke.
- Earlier phone scoped passes and later retry reports remain historical, owner-reported evidence. The October 16 initial black-screen failure and subsequent nonreproductions are all retained; a later nonreproduction does not resolve the incident.

`OWNER-OBSERVATION-LEDGER.csv` records only the new supported observations. `PWA-ACCEPTANCE-TRACK.csv` is a separate bounded acceptance track; it does not replace the native/Play ledger.

## Small separate PWA acceptance track

1. **Install and standalone launch:** owner-reported success, limited to this installation/launch; browser/device and installed mechanism unverified.
2. **Hosted update behavior:** NOT RUN. After an actual approved web release, record the live deployment and observed content before/after ordinary close/reopen or supported update flow. Check for stale policy/footer content and preserve user state. Do not assume instant service-worker/cache update.
3. **Persistence:** NOT RUN. With owner agreement, use disposable state and inspect ordinary close/reopen/background-return. Do not clear storage, reinstall or erase meaningful data.
4. **Offline/reconnect:** NOT RUN for the PWA. A future bounded cold-open and reconnect/retry check must record actual behavior; full offline discovery is not promised. Keep the historical incident and native/phone reports separate.
5. **Coexistence:** NOT RUN. If the owner has existing browser/native/PWA surfaces, record which is being opened and whether existing data remains intact. Do not assume shared storage, migration or package compatibility, and do not install/uninstall another package for this check without separate authorization.
6. **Live footer/legal/support/core application:** NOT RUN for the new release; recheck after actual authorized publication.

The ad-blocker observation is local to the reported successful installation. It is not broad ad-blocker compatibility, runtime compatibility, marketing, ranking, installability across browsers or store compliance evidence.

## Post-release owner session action

**OPEN — waiting for actual authorized website release and owner availability.** After actual publication is independently confirmed, arrange a second owner-observed phone/tablet/PWA session. Ask for a convenient time then, unless the owner supplies availability first. No appointment, reminder schedule or automatic release is created by this document.

Record native installation context separately from live hosted source, plus actual model/browser/Android/WebView details as available. Scope:

- Live footer across Home/Settings and representative Result/Options/Plan screens.
- Privacy Policy, Terms, effective date/version/history and return navigation; support links and visible contact. Cancel mail handoff without sending.
- Representative discovery, result/detail/directions return and state preservation.
- Tablet portrait/landscape and reachable controls; keep the narrow-column issue separately qualified.
- PWA ordinary launch, actual update visibility, persistence, bounded offline/reconnect and coexistence where safely testable and authorized.

Record each actual result with source and evidence. Leave unavailable native-update/Play cases NOT RUN. Stop and report black-screen recurrence, suspected data loss, unexpected replacement, trapped navigation or severe regression; do not erase data or change security/network settings to manufacture a pass.

## Release and change boundary

Documentation and issue tracking only. No app/source changes, frozen PR #82 mutations, merge, deployment, date changes, Android installation/data erasure, signing or Play activity occurred in this lane.

Exact conditional release authority remains PR #82 `cf18ff1c5a56ecf59f8006d4f7c83fb289f393df`, tree `6300c1061a790d84447bb92166f340aec895757b`, October 19, 2026 America/Chicago, subject to every mandatory safeguard. No automatic release is scheduled; source/date drift, missing evidence or a mandatory failure means STOP/HOLD. Today's observations are not release-day preflight.

## Issue-tracking deduplication

Before creating Issue #83, GitHub issue searches for landscape, tablet, responsive, max-width, layout and SM-T220 found no separate matching issue. Tablet/layout searches returned the coordination hub #71 only; PWA search also returned only #71. The bounded PWA track stays within this QA evidence rather than adding a redundant broad issue.

Issue #83 and its [read-only source-diagnosis comment](https://github.com/caleb1234calvin-art/dinner-roulette/issues/83#issuecomment-6239007808) were read back and match the submitted text. The source analysis is explicitly distinguished from actual device reproduction; the separate investigation report supplies its detailed evidence.

