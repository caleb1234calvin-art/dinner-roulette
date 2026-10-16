# Pick For Us: controlled PR78 device check

Phone first, only when safely stationary and free to test. The SM-T220 tablet is deferred until available. Every result starts **NOT RUN**; report what actually happened, including errors.

## Confirm this build

- PR78 native source: `4010edf31e71a7350d891a98dd43f20535602abd`
- Tree: `f521ed3dbdabceeb924ad4da1ce88e42db41092c`
- Debug APK package: `app.pickforus.android`; version 1 / 1.0.0
- Expected APK SHA256: `7953b424b7224649bb4128b05dca83f91a19ced1542621c8ed2587a6893c491f`
- It loads the existing online site at `https://dinner-roulette-chi.vercel.app`. PR77's new Legal & Support pages are not published and cannot be tested by installing this APK.

Record phone model, Android version and Android System WebView/Chrome version. No IMEI, serial number, passwords, private messages or precise personal coordinates are needed. Note time, network and whether an older Pick For Us app is installed.

## Short phone sequence

1. **Before installation:** Open the old app if present. Note two disposable saved items and one preference so you can recognize them later. Do not clear data or uninstall the old app. If no old app exists, report that; coexistence is not tested.
2. **Install the supplied exact debug APK:** It should install alongside the old package, not replace it. If Android reports an update/replacement, identity mismatch, install-permission prompt or security warning, stop and report the exact wording rather than bypass it. Do not disable Play Protect or Auto Blocker or grant installation permissions without discussing the exact prompt. The owner performs installation; no remote settings changes are part of this checklist.
3. **First launch:** Identify the new app, open online, and record whether Home becomes usable without a crash, blank screen or permanent spinner. Open Dinner and Date Night; use a manual city search before GPS.
4. **Location:** When the new app asks, test denial first and confirm manual search still works. Test approximate and precise location separately if Android offers those choices. Record the option and observed result, not your exact coordinates. If unavailable, record the OS reason. Stop permission changes outside the approved test scope; never change the old app's permissions.
5. **Save and restart:** In the new app, save a disposable favorite and set a preference. Close/reopen and, if convenient, restart the phone. Check the state persists. Reopen the old app and confirm the earlier saved items/preference remain. Separate app data is expected; automatic migration is not promised.
6. **External links:** Try Directions, a venue website and available ride links without booking or starting navigation. Cancel and return. Try support/email only if the current production UI actually offers it; do not send an email. Record missing features or absent handlers accurately. Do not uninstall a mail/maps app to force a test.
7. **Offline/reconnect:** When safe to interrupt connectivity briefly, open the new app offline, then reconnect and use Retry. Confirm it recovers without reinstalling or clearing data. Full offline discovery is not promised. Also note recovery if a request loses connection.
8. **Layout and access:** Rotate portrait/landscape with results/options open; check large text, Back, keyboard and reachable controls. If TalkBack or an external keyboard is already available and practical, test labels/focus/navigation. Untested accessibility cases remain NOT RUN rather than blanket PASS.

Stop on a crash, suspected data loss, unexpected replacement, trapped navigation or unusable permission denial. Preserve a redacted screenshot and the step number. Do not repair by erasing data or changing unrelated settings.

## Tablet later

Repeat the same sequence on SM-T220 when available. Record its actual Android/WebView versions. Wi-Fi-only does not itself mean no GPS, but no particular location capability or fix is assumed for this unit. Internet is still needed for online discovery. Tablet observations remain NOT RUN while it is unavailable.

## Deliberately outside this round

- PR77 Privacy/Terms/history/material-change and new support features: **NOT RUN — unpublished**.
- Same-package signed update: **NOT RUN — no successor artifact provided**.
- Final Play install/certificate/update path: **NOT RUN — no Play release authorized**.
- Registration, upload, production signing, merge/deploy, legal effective dates and Console declarations are not part of this test.

## Reply format

Device/model + Android/WebView; step number; PASS / FAIL / BLOCKED / NOT RUN; what you saw; approximate UTC/local time; optional redacted screenshot. If unsure, describe the behavior instead of guessing a verdict. A report is owner-observed evidence, not an assistant-witnessed device session.
