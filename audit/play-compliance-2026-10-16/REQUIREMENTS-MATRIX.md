# Requirement to evidence matrix

Overall Google Play readiness: **HOLD**. Fifty traced requirements distinguish source/runtime facts, missing evidence and owner decisions. PASS is always scoped; HOLD is not a proved violation. GO is reserved for an overall readiness recommendation, which this report does not give. P0 identifies the confirmed privacy submission blocker; every applicable P1 gate also needs closure. Original priorities are retained for traceability.

| ID | Topic | Reviewed status | Priority | Submission gate |
|---|---|---|---|---|
| [PRIV-01](#priv-01) | In-app privacy policy | FAIL | P0 | Yes |
| [PRIV-02](#priv-02) | Data Safety and public policy URL | HOLD | P1 | Yes |
| [PRIV-03](#priv-03) | User-initiated foreground location | QUALIFIED PASS | P2 | No independent gate |
| [PRIV-04](#priv-04) | Coordinate precision and permission scope | HOLD | P1 | Yes |
| [PRIV-05](#priv-05) | Account creation and deletion applicability | HOLD | P1 | Yes |
| [PRIV-06](#priv-06) | Local retention and reset controls | QUALIFIED PASS | P2 | No independent gate |
| [PRIV-07](#priv-07) | Android offline and lifecycle behavior | HOLD | P1 | Yes |
| [PRIV-08](#priv-08) | Hosted WebView utility and authorization | QUALIFIED PASS | P2 | No independent gate |
| [PRIV-09](#priv-09) | Analytics and third-party processing | HOLD | P1 | Yes |
| [PRIV-10](#priv-10) | Transport security evidence | QUALIFIED PASS | P2 | No independent gate |
| [PRIV-11](#priv-11) | Prominent disclosure trigger | HOLD | P1 | Yes |
| [PRIV-12](#priv-12) | Background location applicability | NOT APPLICABLE | P3 | No independent gate |
| [PKG-01](#pkg-01) | Upload signing | HOLD | P1 | Yes |
| [PKG-02](#pkg-02) | Final package identity | HOLD | P1 | Yes |
| [PKG-03](#pkg-03) | VersionCode use | HOLD | P1 | Yes |
| [PKG-04](#pkg-04) | Final artifact plus hosted-runtime binding | HOLD | P1 | Yes |
| [PKG-05](#pkg-05) | Physical Android behavior | HOLD | P1 | Yes |
| [PKG-06](#pkg-06) | Remote server.url production support | HOLD | P2 | No independent gate |
| [PKG-07](#pkg-07) | FileProvider path scope | HOLD | P2 | No independent gate |
| [PKG-08](#pkg-08) | Android 12+ data transfer rules | HOLD | P2 | No independent gate |
| [PKG-09](#pkg-09) | Lint and visual polish | HOLD | P3 | No independent gate |
| [PKG-10](#pkg-10) | Current target API | PASS | P3 | No independent gate |
| [PKG-11](#pkg-11) | AAB structure and size | PASS | P3 | No independent gate |
| [PKG-12](#pkg-12) | 64-bit and 16 KB native packaging | PASS | P3 | No independent gate |
| [PKG-13](#pkg-13) | Manifest security posture | PASS | P3 | No independent gate |
| [PKG-14](#pkg-14) | Native dependency/toolchain compatibility | PASS | P3 | No independent gate |
| [PKG-15](#pkg-15) | Signing verification strength | HOLD | P2 | No independent gate |
| [CONTENT-01](#content-01) | Casino discovery versus real-money gambling facilitation | QUALIFIED PASS | P2 | No independent gate |
| [CONTENT-02](#content-02) | Alcohol and nightlife presentation | QUALIFIED PASS | P2 | No independent gate |
| [CONTENT-03](#content-03) | IARC content rating and questionnaire | HOLD | P1 | Yes |
| [CONTENT-04](#content-04) | Target audience and minor access | HOLD | P1 | Yes |
| [CONTENT-05](#content-05) | Final store listing metadata and preview assets | HOLD | P1 | Yes |
| [CONTENT-06](#content-06) | Artwork, audiovisual material and intellectual-property rights | HOLD | P1 | Yes |
| [CONTENT-07](#content-07) | Factual third-party naming and affiliation | QUALIFIED PASS | P2 | No independent gate |
| [CONTENT-08](#content-08) | Ads and commercial-placement declaration | HOLD | P1 | Yes |
| [CONTENT-09](#content-09) | Advance-notice applicability | QUALIFIED PASS | P3 | No independent gate |
| [CONTENT-10](#content-10) | Requested Play Academy training source | HOLD | P3 | No independent gate |
| [CONTENT-11](#content-11) | Dynamic restricted-content exposure and sampled artwork | HOLD | P2 | No independent gate |
| [CONTENT-12](#content-12) | Licensed gambling operator and GRAC workflows in the current source | NOT APPLICABLE | P3 | No independent gate |
| [C1](#c1) | Developer identity and authority | HOLD | P1 | Yes |
| [C2](#c2) | Play App Signing enrollment | HOLD | P1 | Yes |
| [C3](#c3) | Distribution key custody and cross-store strategy | HOLD | P1 | Yes |
| [C4](#c4) | Key ownership wording | HOLD | P2 | No independent gate |
| [C5](#c5) | Upload key custody and recovery | HOLD | P1 | Yes |
| [C6](#c6) | Certificates and API registrations | HOLD | P1 | Yes |
| [C7](#c7) | Agreement versions and notices | HOLD | P2 | No independent gate |
| [C8](#c8) | DDA policies rights and applicable laws | HOLD | P1 | Yes |
| [E1](#e1) | Product export classification and reporting | HOLD | P1 | Yes |
| [E2](#e2) | Cryptography and distributed-component inventory | HOLD | P1 | Yes |
| [E3](#e3) | Destinations jurisdictions and sanctions | HOLD | P1 | Yes |

## PRIV-01
**In-app privacy policy — FAIL; P0**

- Requirement: Assess the named policy provisions against the established app behavior; the following finding distinguishes observed facts from unresolved applicability.
- Exact provisions: [Privacy Policy](https://support.google.com/googleplay/android-developer/answer/10144311)
- Pinned code: [src/components/settings-page.tsx#L32-L39](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/settings-page.tsx#L32-L39); [LEGAL.md#L45-L51](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/LEGAL.md#L45-L51); [LEGAL.md#L77](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/LEGAL.md#L77); [src/routeTree.gen.ts#L11-L37](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/routeTree.gen.ts#L11-L37)
- Evidence: In-app privacy text is not comprehensive. Add an accurately labeled policy, developer/privacy contact, actual data flows/recipients, security, retention and deletion details; expose it in app and supply the public URL in Console.
- Qualification: Console state and physical Android acceptance are not inferred from source. Additional location policy change effective 2027-01-27 is prospective, not applied early.
- Confidence: High
- Next action: In-app privacy text is not comprehensive. Add an accurately labeled policy, developer/privacy contact, actual data flows/recipients, security, retention and deletion details; expose it in app and supply the public URL in Console.
- Acceptance: Independently inspect accurate full in-app policy text or link and a public Console policy URL; reconcile contact, data purposes/recipients, security, retention and deletion to actual operations.
- Original assessment: FAIL; P1. Submission gate: yes.

## PRIV-02
**Data Safety and public policy URL — HOLD; P1**

- Requirement: Assess the named policy provisions against the established app behavior; the following finding distinguishes observed facts from unresolved applicability.
- Exact provisions: [Privacy Policy](https://support.google.com/googleplay/android-developer/answer/10144311); [Data collection and Data sharing](https://support.google.com/googleplay/android-developer/answer/10787469)
- Pinned code: [src/lib/restaurants/search.ts#L17-L31](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/restaurants/search.ts#L17-L31); [src/lib/restaurants/search.ts#L55-L67](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/restaurants/search.ts#L55-L67); [src/routes/__root.tsx#L64-L65](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/routes/__root.tsx#L64-L65)
- Evidence: Console Data safety and privacy URL were not inspected. Reconcile proposed categories below with traffic/operations evidence and the submitted form. No claim that an existing Console declaration is false.
- Qualification: Console state and physical Android acceptance are not inferred from source. Additional location policy change effective 2027-01-27 is prospective, not applied early.
- Confidence: High on missing verification
- Next action: Console Data safety and privacy URL were not inspected. Reconcile proposed categories below with traffic/operations evidence and the submitted form. No claim that an existing Console declaration is false.
- Acceptance: Map each proposed form answer to release traffic/configuration/provider evidence; owner verifies actual Console form and any track-specific exception.
- Original assessment: HOLD; P1. Submission gate: yes.

## PRIV-03
**User-initiated foreground location — QUALIFIED PASS; P2**

- Requirement: Assess the named policy provisions against the established app behavior; the following finding distinguishes observed facts from unresolved applicability.
- Exact provisions: [Location permissions; least privilege](https://support.google.com/googleplay/android-developer/answer/16558241); [Personal and Sensitive User Data](https://support.google.com/googleplay/android-developer/answer/10144311)
- Pinned code: [src/components/location-control.tsx#L74-L81](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/location-control.tsx#L74-L81); [src/components/location-control.tsx#L112-L147](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/location-control.tsx#L112-L147); [src/lib/location/controller.ts#L18-L51](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/location/controller.ts#L18-L51); [android/app/src/main/AndroidManifest.xml#L43-L47](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/app/src/main/AndroidManifest.xml#L43-L47)
- Evidence: Location access is user-initiated; manual entry and denial messages exist; no background-location declaration was found. This is a source-level positive, not a native permission PASS.
- Qualification: Console state and physical Android acceptance are not inferred from source. Additional location policy change effective 2027-01-27 is prospective, not applied early.
- Confidence: High source, unverified native
- Next action: Location access is user-initiated; manual entry and denial messages exist; no background-location declaration was found. This is a source-level positive, not a native permission PASS.
- Acceptance: Verify manual alternative and precise/approximate/deny/retry/revoked behavior on the final Android release; no background acquisition.
- Original assessment: QUALIFIED; P2. Submission gate: no separate mandatory gate established.

## PRIV-04
**Coordinate precision and permission scope — HOLD; P1**

- Requirement: Assess the named policy provisions against the established app behavior; the following finding distinguishes observed facts from unresolved applicability.
- Exact provisions: [Location permissions; precise location](https://support.google.com/googleplay/android-developer/answer/16558241); [Data types and Data collection](https://support.google.com/googleplay/android-developer/answer/10787469)
- Pinned code: [src/lib/location/model.ts#L28-L30](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/location/model.ts#L28-L30); [src/lib/restaurants/geocode.ts#L73-L85](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/restaurants/geocode.ts#L73-L85); [android/app/src/main/AndroidManifest.xml#L43-L47](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/app/src/main/AndroidManifest.xml#L43-L47)
- Evidence: Both fine/coarse permissions are declared, and returned coordinates are sent unrounded. Document necessity for precise access or reduce scope; verify approximate, denied, one-time and revoked permission behavior on Android.
- Qualification: Console state and physical Android acceptance are not inferred from source. Additional location policy change effective 2027-01-27 is prospective, not applied early.
- Confidence: High
- Next action: Both fine/coarse permissions are declared, and returned coordinates are sent unrounded. Document necessity for precise access or reduce scope; verify approximate, denied, one-time and revoked permission behavior on Android.
- Acceptance: Capture actual returned and transmitted granularity; substantiate necessity, permission scope, optionality and truthful location declaration.
- Original assessment: HOLD; P2. Submission gate: yes.

## PRIV-05
**Account creation and deletion applicability — HOLD; P1**

- Requirement: Assess the named policy provisions against the established app behavior; the following finding distinguishes observed facts from unresolved applicability.
- Exact provisions: [Account deletion requirement](https://support.google.com/googleplay/android-developer/answer/13327111); [Account Deletion Requirement](https://support.google.com/googleplay/android-developer/answer/10144311)
- Pinned code: [src/lib/auth/provider.tsx#L1-L15](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/auth/provider.tsx#L1-L15); [src/lib/auth/server.ts#L128-L145](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/auth/server.ts#L128-L145); [src/lib/auth/server.ts#L156-L164](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/auth/server.ts#L156-L164); [src/routeTree.gen.ts#L11-L37](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/routeTree.gen.ts#L11-L37)
- Evidence: Account-deletion trigger is not established in the visible product. No sign-up/sign-in controls were found in its routes/UI, but hosted Better Auth/OAuth infrastructure exists. Owner must confirm all reachable creation flows and release configuration.
- Qualification: Console state and physical Android acceptance are not inferred from source. Additional location policy change effective 2027-01-27 is prospective, not applied early.
- Confidence: Medium
- Next action: Account-deletion trigger is not established in the visible product. No sign-up/sign-in controls were found in its routes/UI, but hosted Better Auth/OAuth infrastructure exists. Owner must confirm all reachable creation flows and release configuration.
- Acceptance: Demonstrate whether creation is reachable in the exact release. If applicable, verify in-app and external account-deletion mechanisms and retention exceptions.
- Original assessment: HOLD; P2. Submission gate: yes.

## PRIV-06
**Local retention and reset controls — QUALIFIED PASS; P2**

- Requirement: Assess the named policy provisions against the established app behavior; the following finding distinguishes observed facts from unresolved applicability.
- Exact provisions: [Privacy Policy; retention and deletion](https://support.google.com/googleplay/android-developer/answer/10144311)
- Pinned code: [src/lib/store.ts#L233-L278](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/store.ts#L233-L278); [src/lib/date-night/identity-receipts.ts#L65-L67](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/date-night/identity-receipts.ts#L65-L67)
- Evidence: Favorites/history reset is local and narrowly labeled. It does not delete saved search location or theme and is not account deletion or a complete off-device erasure mechanism. Describe actual retention; consider an explicit saved-location reset.
- Qualification: Console state and physical Android acceptance are not inferred from source. Additional location policy change effective 2027-01-27 is prospective, not applied early.
- Confidence: High
- Next action: Favorites/history reset is local and narrowly labeled. It does not delete saved search location or theme and is not account deletion or a complete off-device erasure mechanism. Describe actual retention; consider an explicit saved-location reset.
- Acceptance: Verify saved-location persistence, reset scope, data expiry and policy statements; no promise of complete erasure from the narrower favorites/history button.
- Original assessment: QUALIFIED; P2. Submission gate: no separate mandatory gate established.

## PRIV-07
**Android offline and lifecycle behavior — HOLD; P1**

- Requirement: Assess the named policy provisions against the established app behavior; the following finding distinguishes observed facts from unresolved applicability.
- Exact provisions: [Minimum functionality; responsiveness](https://support.google.com/googleplay/android-developer/answer/9898783)
- Pinned code: [native-web/index.html#L10-L13](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/native-web/index.html#L10-L13); [android/app/src/main/java/com/calebcalvin/pickforus/MainActivity.java#L1-L5](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/app/src/main/java/com/calebcalvin/pickforus/MainActivity.java#L1-L5)
- Evidence: Cold launch offline, retry after reconnect, actual native Back/modal dismissal, activity/process restart, permission revocation, external-app handoff/return and release-WebView behavior have no current device evidence.
- Qualification: Console state and physical Android acceptance are not inferred from source. Additional location policy change effective 2027-01-27 is prospective, not applied early.
- Confidence: High
- Next action: Cold launch offline, retry after reconnect, actual native Back/modal dismissal, activity/process restart, permission revocation, external-app handoff/return and release-WebView behavior have no current device evidence.
- Acceptance: Pass recorded installable-release offline/retry, Back, process/restart, permission and external-app handoff scenarios; these are audit assurance tests.
- Original assessment: HOLD; P1. Submission gate: yes.

## PRIV-08
**Hosted WebView utility and authorization — QUALIFIED PASS; P2**

- Requirement: Assess the named policy provisions against the established app behavior; the following finding distinguishes observed facts from unresolved applicability.
- Exact provisions: [Webviews and Affiliate Spam](https://support.google.com/googleplay/android-developer/answer/9899034); [Minimum functionality](https://support.google.com/googleplay/android-developer/answer/9898783); [Device and Network Abuse](https://support.google.com/googleplay/android-developer/answer/16559646)
- Pinned code: [capacitor.config.json#L4-L12](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/capacitor.config.json#L4-L12); [src/components/options-overlay.tsx#L21-L52](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/options-overlay.tsx#L21-L52)
- Evidence: First-party interactive hosted app shows meaningful utility; no blanket WebView ban applies. Confirm domain ownership/authorization and acceptable native UX. Remote origin remains the legacy Vercel hostname, not pickforus.app.
- Qualification: Console state and physical Android acceptance are not inferred from source. Additional location policy change effective 2027-01-27 is prospective, not applied early.
- Confidence: High policy, medium release
- Next action: First-party interactive hosted app shows meaningful utility; no blanket WebView ban applies. Confirm domain ownership/authorization and acceptable native UX. Remote origin remains the legacy Vercel hostname, not pickforus.app.
- Acceptance: Verify controlled-domain authorization and meaningful interactive utility, reviewer access and actual native UX; no blanket WebView certification.
- Original assessment: QUALIFIED; P2. Submission gate: no separate mandatory gate established.

## PRIV-09
**Analytics and third-party processing — HOLD; P1**

- Requirement: Assess the named policy provisions against the established app behavior; the following finding distinguishes observed facts from unresolved applicability.
- Exact provisions: [Personal and Sensitive User Data; Privacy Policy](https://support.google.com/googleplay/android-developer/answer/10144311); [Data collection and Data types](https://support.google.com/googleplay/android-developer/answer/10787469)
- Pinned code: [src/routes/__root.tsx#L41-L45](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/routes/__root.tsx#L41-L45); [src/routes/__root.tsx#L64-L65](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/routes/__root.tsx#L64-L65); [src/lib/analytics.ts#L9-L11](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/analytics.ts#L9-L11); [src/components/mode-home.tsx#L53](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/mode-home.tsx#L53); [scripts/grok-pwa-shared.mjs#L189](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/scripts/grok-pwa-shared.mjs#L189); [scripts/grok-pwa-shared.mjs#L216-L230](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/scripts/grok-pwa-shared.mjs#L216-L230)
- Evidence: Vercel Insights, Google Fonts and Grok extension script references are present in source/live DOM. Determine actual delivery, data fields, processors, retention and deletion; presence alone does not establish all handling or a sale/sharing verdict.
- Qualification: Console state and physical Android acceptance are not inferred from source. Additional location policy change effective 2027-01-27 is prospective, not applied early.
- Confidence: High
- Next action: Vercel Insights, Google Fonts and Grok extension script references are present in source/live DOM. Determine actual delivery, data fields, processors, retention and deletion; presence alone does not establish all handling or a sale/sharing verdict.
- Acceptance: Capture actual release network/identifier/event behavior; establish provider roles, logs and retention; reconcile policy and Data Safety without guessing.
- Original assessment: HOLD; P2. Submission gate: yes.

## PRIV-10
**Transport security evidence — QUALIFIED PASS; P2**

- Requirement: Assess the named policy provisions against the established app behavior; the following finding distinguishes observed facts from unresolved applicability.
- Exact provisions: [Secure handling](https://support.google.com/googleplay/android-developer/answer/10144311); [Device and Network Abuse](https://support.google.com/googleplay/android-developer/answer/16559646)
- Pinned code: [capacitor.config.json#L5-L12](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/capacitor.config.json#L5-L12); [src/lib/restaurants/geocode.ts#L54-L85](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/restaurants/geocode.ts#L54-L85); [src/lib/restaurants/overpass.ts#L5-L9](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/restaurants/overpass.ts#L5-L9); [src/lib/restaurants/overpass.ts#L57-L67](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/restaurants/overpass.ts#L57-L67)
- Evidence: Explicit HTTPS provider calls and native cleartext/mixed-content prohibitions support transit protection. They do not prove all production traffic, platform logs or provider retention.
- Qualification: Console state and physical Android acceptance are not inferred from source. Additional location policy change effective 2027-01-27 is prospective, not applied early.
- Confidence: High source
- Next action: Explicit HTTPS provider calls and native cleartext/mixed-content prohibitions support transit protection. They do not prove all production traffic, platform logs or provider retention.
- Acceptance: Verify real release traffic uses appropriate transport security and no unexpected cleartext or unsafe bridge path; assess logs/retention separately.
- Original assessment: QUALIFIED; P2. Submission gate: no separate mandatory gate established.

## PRIV-11
**Prominent disclosure trigger — HOLD; P1**

- Requirement: Assess the named policy provisions against the established app behavior; the following finding distinguishes observed facts from unresolved applicability.
- Exact provisions: [Prominent Disclosure and Consent Requirement](https://support.google.com/googleplay/android-developer/answer/10144311); [Location permissions](https://support.google.com/googleplay/android-developer/answer/16558241)
- Pinned code: [src/components/location-control.tsx#L74-L81](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/location-control.tsx#L74-L81); [src/lib/location/controller.ts#L26-L51](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/location/controller.ts#L26-L51); [src/lib/restaurants/geocode.ts#L73-L85](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/restaurants/geocode.ts#L73-L85)
- Evidence: GPS invokes native/browser permission without a detailed immediately preceding provider-disclosure UI. Nearby search is expected, but undisclosed provider transfer/persistence needs review against the reasonable-expectation condition and accurate policy. Do not call this an independently proven blanket consent violation.
- Qualification: Console state and physical Android acceptance are not inferred from source. Additional location policy change effective 2027-01-27 is prospective, not applied early.
- Confidence: Medium
- Next action: GPS invokes native/browser permission without a detailed immediately preceding provider-disclosure UI. Nearby search is expected, but undisclosed provider transfer/persistence needs review against the reasonable-expectation condition and accurate policy. Do not call this an independently proven blanket consent violation.
- Acceptance: Assess the actual behavior against user expectations. Where the policy trigger applies, independently verify visible pre-access disclosure and affirmative consent.
- Original assessment: HOLD; P2. Submission gate: yes.

## PRIV-12
**Background location applicability — NOT APPLICABLE; P3**

- Requirement: Assess the named policy provisions against the established app behavior; the following finding distinguishes observed facts from unresolved applicability.
- Exact provisions: [Background location access](https://support.google.com/googleplay/android-developer/answer/16558241)
- Pinned code: [android/app/src/main/AndroidManifest.xml#L43-L47](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/app/src/main/AndroidManifest.xml#L43-L47); [src/lib/location/controller.ts#L26-L51](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/location/controller.ts#L26-L51)
- Evidence: Background-location permission and continuous location-watch behavior were not found. No background-location submission exemption beyond that bounded observation is asserted.
- Qualification: Console state and physical Android acceptance are not inferred from source. Additional location policy change effective 2027-01-27 is prospective, not applied early.
- Confidence: High within inspected native/source scope
- Next action: Background-location permission and continuous location-watch behavior were not found. No background-location submission exemption beyond that bounded observation is asserted.
- Acceptance: Verify final manifest and runtime retain no background-location behavior; reassess if functionality changes.
- Original assessment: N/A; P3. Submission gate: no separate mandatory gate established.

## PKG-01
**Upload signing — HOLD; P1**

- Requirement: An App Bundle submitted to Play must be signed with the upload key; Play App Signing handles distributed APK signing.
- Exact provisions: [Introduction; Play App Signing](https://developer.android.com/studio/publish/app-signing)
- Pinned code: [android/signing.gradle#L8-L42](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/signing.gradle#L8-L42)
- Evidence: Preserved AAB 4cead0e…c3b5e4ee is deliberately unsigned; no META-INF signature files; archived verifier uploadSignatureVerified=false. Guard rejects ordinary unsigned release. External keys/Console enrollment not inspected.
- Qualification: Final artifact signing, Console and physical acceptance remain separate. Device matrix and architecture decisions are audit risk-management gates, not individually specified mandatory Google tests.
- Confidence: High
- Next action: Owner-controlled upload key and Play App Signing setup, then sign and inspect the final authorized release. No production keys generated/read here.
- Acceptance: Final AAB signature cryptographically verifies; upload certificate matches intended Console certificate; final package/version recorded; Console accepts authorized upload. Any upload or owner-controlled signing is a later separately authorized action, not an action for this investigation.
- Original assessment: HOLD; P1. Submission gate: yes.

## PKG-02
**Final package identity — HOLD; P1**

- Requirement: Play package names are unique and permanent; changing a published application ID creates a different app.
- Exact provisions: [Manage your app and app bundles](https://support.google.com/googleplay/android-developer/answer/9859152)
- Pinned code: [android/app/build.gradle#L11-L20](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/app/build.gradle#L11-L20); [capacitor.config.json#L1-L8](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/capacitor.config.json#L1-L8)
- Evidence: Current app ID is com.calebcalvin.pickforus. Proposed app.pickforus.android is syntax-valid and removes personal name, but no owner approval to edit or private Console claim was verified.
- Qualification: Final artifact signing, Console and physical acceptance remain separate. Device matrix and architecture decisions are audit risk-management gates, not individually specified mandatory Google tests.
- Confidence: High for source and permanence; unknown for availability
- Next action: Finalize brand-only candidate with owner before first upload; check existing Console/package history and domain/brand control. Current ID itself is not a policy violation.
- Acceptance: Owner-approved exact ID; evidence intended Console accepts/owns it; any rename tested coherently across full inventory before signing. Any upload or owner-controlled signing is a later separately authorized action, not an action for this investigation.
- Original assessment: HOLD (owner decision/Console evidence); P1. Submission gate: yes.

## PKG-03
**VersionCode use — HOLD; P1**

- Requirement: Version code must increase for subsequent app versions and remain within Play's maximum 2100000000.
- Exact provisions: [App version requirements for Play Console](https://support.google.com/googleplay/android-developer/answer/9859152)
- Pinned code: [android/version.properties#L1-L3](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/version.properties#L1-L3); [android/app/build.gradle#L3-L8](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/app/build.gradle#L3-L8)
- Evidence: Source and archived compiled manifest are versionCode 1 / versionName 1.0.0. Valid first-version values; no Console track history read.
- Qualification: Final artifact signing, Console and physical acceptance remain separate. Device matrix and architecture decisions are audit risk-management gates, not individually specified mandatory Google tests.
- Confidence: High for code; unknown for Console history
- Next action: Use code 1 only if unused for the final package; otherwise allocate a higher code. Do not infer that an unused public listing means no earlier upload.
- Acceptance: Final code is unique/greater than prior uploaded versions for that package and manifest agrees with source. Any upload or owner-controlled signing is a later separately authorized action, not an action for this investigation.
- Original assessment: HOLD (external history unknown); P1. Submission gate: yes.

## PKG-04
**Final artifact plus hosted-runtime binding — HOLD; P1**

- Requirement: AAB packages compiled code/resources; this implementation loads its primary product from a separately deployed HTTPS origin.
- Exact provisions: [Introduction (publishing format)](https://developer.android.com/guide/app-bundle)
- Pinned code: [capacitor.config.json#L4-L8](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/capacitor.config.json#L4-L8); [native-web/index.html#L1-L15](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/native-web/index.html#L1-L15); [.github/workflows/android-apk.yml#L46-L137](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/.github/workflows/android-apk.yml#L46-L137)
- Evidence: AAB contains only native bridge/Capacitor assets plus local connection-error page. PR75 source 91896a2 native input blobs equal main c3208d9 for all 55 inventoried inputs. No run at c3208d9. Hosted URL is mutable; no main/branch web snapshot is embedded.
- Qualification: Final artifact signing, Console and physical acceptance remain separate. Device matrix and architecture decisions are audit risk-management gates, not individually specified mandatory Google tests.
- Confidence: High
- Next action: Record final source revision, AAB hash, signing certificate, and accepted hosted deployment separately. Do not describe reused artifact as fresh main build or PR75 UI release.
- Acceptance: Release manifest binds final native inputs and actual approved hosted deployment; physical Android tests cover that combination. Any upload or owner-controlled signing is a later separately authorized action, not an action for this investigation.
- Original assessment: HOLD; P1. Submission gate: yes.

## PKG-05
**Physical Android behavior — HOLD; P1**

- Requirement: Source/structural checks do not demonstrate real-device behavior, permission handling, compatibility or install/update reliability.
- Exact provisions: [Test your app](https://developer.android.com/google/play/requirements/target-sdk)
- Pinned code: [ANDROID_RELEASE.md](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/ANDROID_RELEASE.md)
- Evidence: This audit inspected source/ZIP plus prior CI manifest. No emulator/physical phone or Play-generated split APK was launched. Prior testReleaseUnitTest may be NO-SOURCE.
- Qualification: Final artifact signing, Console and physical acceptance remain separate. Device matrix and architecture decisions are audit risk-management gates, not individually specified mandatory Google tests.
- Confidence: High
- Next action: Run bounded device matrix on final identity and accepted hosted deployment; include API 24 and 36, 16 KB environment and 64-bit device where available.
- Acceptance: Cold launch, offline/retry, GPS precise/approximate/deny/retry, manual location, external links, system Back, keyboard/insets, process restart/state, themes/icons and core modes pass with evidence. Any upload or owner-controlled signing is a later separately authorized action, not an action for this investigation.
- Original assessment: HOLD (not tested); P1. Submission gate: yes.

## PKG-06
**Remote server.url production support — HOLD; P2**

- Requirement: Capacitor v8 documents server.url as a live-reload option not intended for production.
- Exact provisions: [Schema: server.url](https://capacitorjs.com/docs/config)
- Pinned code: [capacitor.config.json#L4-L8](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/capacitor.config.json#L4-L8); [ANDROID_RELEASE.md](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/ANDROID_RELEASE.md)
- Evidence: Primary UI loads https://dinner-roulette-chi.vercel.app. Offline asset offers retry only. This vendor caveat alone does not establish a Google Play policy violation.
- Qualification: Final artifact signing, Console and physical acceptance remain separate. Device matrix and architecture decisions are audit risk-management gates, not individually specified mandatory Google tests.
- Confidence: High for vendor guidance and source; medium for product risk
- Next action: Explicitly assess supported production architecture and offline/reliability/security trade-offs before launch. A native/static migration is an architectural choice, not an automatic audit edit.
- Acceptance: Owner accepts documented production design, or supported architecture is implemented and tested; runtime outages, navigations, bridge scope and review access verified. Any upload or owner-controlled signing is a later separately authorized action, not an action for this investigation.
- Original assessment: HOLD (engineering review; not established Play violation); P2. Submission gate: no separate mandatory gate established.

## PKG-07
**FileProvider path scope — HOLD; P2**

- Requirement: Android security guidance recommends narrow FileProvider ranges rather than '.' or '/', and caution with external-path for sensitive data.
- Exact provisions: [Share narrow path ranges; Avoid usage of external-path for sensitive information](https://developer.android.com/privacy-and-security/risks/file-providers)
- Pinned code: [android/app/src/main/res/xml/file_paths.xml#L1-L5](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/app/src/main/res/xml/file_paths.xml#L1-L5); [android/app/src/main/AndroidManifest.xml#L28-L36](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/app/src/main/AndroidManifest.xml#L28-L36)
- Evidence: Provider is non-exported and URI grants enabled, but external-path and cache-path both use '.'. No exploitable external grant path was demonstrated.
- Qualification: Final artifact signing, Console and physical acceptance remain separate. Device matrix and architecture decisions are audit risk-management gates, not individually specified mandatory Google tests.
- Confidence: High configuration; medium exploitation risk
- Next action: Remove unused sharing provider or restrict to necessary share directory after checking Capacitor file-chooser behavior. Do not claim current template is proven data exposure.
- Acceptance: Only intended files can be shared; rejected traversal/broad grants; app chooser/upload behavior remains functional. Any upload or owner-controlled signing is a later separately authorized action, not an action for this investigation.
- Original assessment: HARDEN; P2. Submission gate: no separate mandatory gate established.

## PKG-08
**Android 12+ data transfer rules — HOLD; P2**

- Requirement: On some manufacturers, allowBackup=false disables cloud backup but not device-to-device transfer; explicit data extraction rules can govern transfer modes.
- Exact provisions: [Enable and disable backup; Control backup on Android 12 or higher](https://developer.android.com/identity/data/autobackup)
- Pinned code: [android/app/src/main/AndroidManifest.xml#L4-L11](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/app/src/main/AndroidManifest.xml#L4-L11)
- Evidence: allowBackup=false present, no dataExtractionRules or backup XML. Archived lint reports DataExtractionRules warning. Cannot assert all device transfer is disabled.
- Qualification: Final artifact signing, Console and physical acceptance remain separate. Device matrix and architecture decisions are audit risk-management gates, not individually specified mandatory Google tests.
- Confidence: High
- Next action: Decide intended data-migration policy; add/test explicit exclusions if all transfer must be off. Keep disclosure accurate.
- Acceptance: Cloud and D2D outcomes match policy on supported OS/device matrix; sensitive WebView/session data handled intentionally. Any upload or owner-controlled signing is a later separately authorized action, not an action for this investigation.
- Original assessment: HARDEN / clarify privacy claim; P2. Submission gate: no separate mandatory gate established.

## PKG-09
**Lint and visual polish — HOLD; P3**

- Requirement: Engineering quality guidance, not an identified mandatory Play rejection rule.
- Exact provisions: [Compressed download size restriction; shrink guidance](https://developer.android.com/guide/app-bundle)
- Pinned code: [android/app/build.gradle#L28-L33](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/app/build.gradle#L28-L33); [android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml)
- Evidence: Archived app lint: 14 warnings, zero recorded errors; includes five IconLauncherShape warnings, two missing monochrome icons, unused resources, manifest ordering, newer Gradle, data extraction. minifyEnabled=false.
- Qualification: Final artifact signing, Console and physical acceptance remain separate. Device matrix and architecture decisions are audit risk-management gates, not individually specified mandatory Google tests.
- Confidence: High archived results; visual result untested
- Next action: Review launcher masks/themed icons and remove unused resources as appropriate; do not treat warning count alone as launch failure.
- Acceptance: Circle/squircle/themed launcher icons visually approved; no regressions from any cleanup. Any upload or owner-controlled signing is a later separately authorized action, not an action for this investigation.
- Original assessment: IMPROVE; P3. Submission gate: no separate mandatory gate established.

## PKG-10
**Current target API — PASS; P3**

- Requirement: From Aug 31, 2026 ordinary new Android apps and updates must target API 36 or higher.
- Exact provisions: [Starting August 31, 2026; New apps and updates](https://support.google.com/googleplay/android-developer/answer/11926878)
- Pinned code: [android/variables.gradle#L1-L4](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/variables.gradle#L1-L4)
- Evidence: Source and archived compiled AAB min/compile/target = 24/36/36. No extension needed for this value. API 35 is the existing-app availability baseline, not new-app submission target.
- Qualification: Final artifact signing, Console and physical acceptance remain separate. Device matrix and architecture decisions are audit risk-management gates, not individually specified mandatory Google tests.
- Confidence: High
- Next action: Preserve target 36+ and retest final release; recheck policy at upload.
- Acceptance: Final compiled manifest targetSdkVersion >=36. Any upload or owner-controlled signing is a later separately authorized action, not an action for this investigation.
- Original assessment: GO (scoped source/artifact); P3. Submission gate: no separate mandatory gate established.

## PKG-11
**AAB structure and size — PASS; P3**

- Requirement: New Google Play apps use Android App Bundles, with Play generating optimized APKs; upload/download limits apply.
- Exact provisions: [Introduction; Compressed download size restriction](https://developer.android.com/guide/app-bundle)
- Pinned code: [.github/workflows/android-apk.yml#L100-L137](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/.github/workflows/android-apk.yml#L100-L137); [scripts/verify-android-bundle.py#L51-L101](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/scripts/verify-android-bundle.py#L51-L101)
- Evidence: Original AAB 3,103,535 bytes, 430 entries, ZIP CRC valid; BundleConfig.pb and base dex present. Prior pinned bundletool 1.18.3 validation PASS. No fresh bundletool invocation this audit; generated APK download size/Console acceptance not tested.
- Qualification: Final artifact signing, Console and physical acceptance remain separate. Device matrix and architecture decisions are audit risk-management gates, not individually specified mandatory Google tests.
- Confidence: High artifact bytes; prior validator result
- Next action: Keep AAB format; repeat structural/signature checks on final signed artifact and inspect Play delivery report.
- Acceptance: Final bundle passes bundletool and Console delivery checks; final signed identity matches. Any upload or owner-controlled signing is a later separately authorized action, not an action for this investigation.
- Original assessment: GO (unsigned structural evidence only); P3. Submission gate: no separate mandatory gate established.

## PKG-12
**64-bit and 16 KB native packaging — PASS; P3**

- Requirement: Java/Kotlin-only apps including SDKs support 64-bit and 16 KB pages; native libraries require corresponding ABI/alignment checks.
- Exact provisions: [Check if your app is impacted](https://developer.android.com/guide/practices/page-sizes)
- Pinned code: [scripts/verify-android-bundle.py#L89-L101](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/scripts/verify-android-bundle.py#L89-L101)
- Evidence: Fresh inspection found zero packaged .so libraries, consistent with archived verifier. No ELF alignment work applies to current contents. No 16 KB runtime test performed.
- Qualification: Final artifact signing, Console and physical acceptance remain separate. Device matrix and architecture decisions are audit risk-management gates, not individually specified mandatory Google tests.
- Confidence: High
- Next action: Preserve no-native-library assertion; re-audit any SDK addition and run device smoke test.
- Acceptance: Final AAB remains no-.so or all native ABIs/alignment pass; runtime works on 16 KB/64-bit. Any upload or owner-controlled signing is a later separately authorized action, not an action for this investigation.
- Original assessment: GO (scoped packaging); runtime HOLD; P3. Submission gate: no separate mandatory gate established.

## PKG-13
**Manifest security posture — PASS; P3**

- Requirement: Explicit exported components and least-privilege permissions/secure transport are relevant Android security controls.
- Exact provisions: [Overview; mitigations for exported components](https://developer.android.com/privacy-and-security/risks/android-exported)
- Pinned code: [android/app/src/main/AndroidManifest.xml#L4-L46](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/app/src/main/AndroidManifest.xml#L4-L46); [capacitor.config.json#L7-L12](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/capacitor.config.json#L7-L12)
- Evidence: Internet + foreground coarse/fine location; no background location. Compiled fourth permission is package-local signature-only AndroidX receiver permission. Launcher exported; FileProvider/startup provider non-exported; profile installer receiver protected by DUMP. Cleartext/mixed content/WebView debug off; release debuggable absent/false. These are controls, not proof of complete security.
- Qualification: Final artifact signing, Console and physical acceptance remain separate. Device matrix and architecture decisions are audit risk-management gates, not individually specified mandatory Google tests.
- Confidence: High
- Next action: Retest permission UX and inspect final merged manifest after dependencies/identity change.
- Acceptance: Only reviewed permission/component set remains; permission tests pass; no unintentionally exported sensitive component. Any upload or owner-controlled signing is a later separately authorized action, not an action for this investigation.
- Original assessment: GO (scoped static); P3. Submission gate: no separate mandatory gate established.

## PKG-14
**Native dependency/toolchain compatibility — PASS; P3**

- Requirement: Capacitor 8 Android upgrade guidance specifies min 24/target 36/AGP 8.13.0/Gradle 8.14.3; AGP 8.13 supports API 36.1 and requires Gradle >=8.13.
- Exact provisions: [Android; project variables; Gradle](https://capacitorjs.com/docs/updating/8-0)
- Pinned code: [package.json](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/package.json); [package-lock.json](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/package-lock.json); [android/build.gradle#L3-L12](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/build.gradle#L3-L12); [android/gradle/wrapper/gradle-wrapper.properties#L1-L8](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/gradle/wrapper/gradle-wrapper.properties#L1-L8); [android/variables.gradle](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/variables.gradle)
- Evidence: Capacitor Android/core/CLI pinned and locked 8.5.2; AGP 8.13.0; wrapper 8.14.3 checksum; build tools app 36.0.0; CI JDK21/Node24. Native plugin list empty. Existing matching-input CI succeeds. No fresh npm/Maven advisory/Play SDK Index clearance certified.
- Qualification: Final artifact signing, Console and physical acceptance remain separate. Device matrix and architecture decisions are audit risk-management gates, not individually specified mandatory Google tests.
- Confidence: High pinned inputs; medium complete third-party risk
- Next action: Before release review applicable current SDK advisories/Console warnings; avoid gratuitous upgrade absent evidence.
- Acceptance: Final dependency inventory recorded, no blocking SDK/advisory warnings, final build and focused tests pass. Any upload or owner-controlled signing is a later separately authorized action, not an action for this investigation.
- Original assessment: GO (compatibility); security status unverified; P3. Submission gate: no separate mandatory gate established.

## PKG-15
**Signing verification strength — HOLD; P2**

- Requirement: Final upload should use intended upload certificate; signature validity alone does not establish intended identity.
- Exact provisions: [Working with API providers; upload certificate](https://developer.android.com/studio/publish/app-signing)
- Pinned code: [scripts/verify-android-bundle.py#L95-L105](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/scripts/verify-android-bundle.py#L95-L105); [ANDROID_RELEASE.md](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/ANDROID_RELEASE.md)
- Evidence: Verifier tests signature presence and jarsigner 'jar verified.' output; it does not programmatically compare a trusted upload-certificate fingerprint. Documentation calls for manual fingerprint check.
- Qualification: Final artifact signing, Console and physical acceptance remain separate. Device matrix and architecture decisions are audit risk-management gates, not individually specified mandatory Google tests.
- Confidence: High
- Next action: Make expected-certificate verification an explicit release acceptance step; do not count signed=true alone as owner identity verification.
- Acceptance: Recorded SHA-256 fingerprint equals intended Console upload certificate; Play distribution certificate separately used for API/App Links registrations. Any upload or owner-controlled signing is a later separately authorized action, not an action for this investigation.
- Original assessment: HARDEN before signed-release approval; P2. Submission gate: no separate mandatory gate established.

## CONTENT-01
**Casino discovery versus real-money gambling facilitation — QUALIFIED PASS; P2**

- Requirement: Assess casino discovery versus real-money gambling facilitation under the named provisions.
- Exact provisions: [Gambling Apps; Other Real-Money Games, Contests, and Tournament Apps; Examples of violations](https://support.google.com/googleplay/android-developer/answer/9877032)
- Pinned code: [src/components/nightlife-home.tsx#L101-L117](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/nightlife-home.tsx#L101-L117); [src/components/result-overlay.tsx#L89-L93](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/result-overlay.tsx#L89-L93); [src/components/result-overlay.tsx#L123-L130](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/result-overlay.tsx#L123-L130); [src/lib/nightlife/types.ts#L10-L17](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/nightlife/types.ts#L10-L17); [src/lib/nightlife/search.ts#L76-L88](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/nightlife/search.ts#L76-L88); [LEGAL.md#L37-L43](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/LEGAL.md#L37-L43)
- Evidence: The picker randomly selects a physical venue. No stake, deposit, cash prize, gambling account, odds or gambling payment control was identified in reviewed implementation/source. Casino result UI offers mapping, rideshare and optional telephone; the venue website CTA is date-night-only. Catalog website fields do not establish an exposed wagering link.
- Qualification: This is a source-backed distinction, not Google's approval or a legal determination. Dice/chip artwork and the word roulette alone do not prove simulated gambling or wagering. Dynamic provider output, final native interaction and any later monetization remain outside this clearance.
- Confidence: High for inspected source; medium for total release
- Next action: Preserve the discovery-only boundary; describe physical venue discovery accurately to reviewers. Escalate any later betting, signup, deposit, prize or gambling affiliate functionality for a new policy review.
- Acceptance: On the exact release, inspect Casino selection, options and result, including favorites/history and native external navigation. Verify no wagering/account/deposit/odds/prize CTA or hidden gambling WebView; assert the Nightlife result cannot render the date-night website CTA.
- Original assessment: QUALIFIED PASS; P2. Submission gate: no separate mandatory gate established.

## CONTENT-02
**Alcohol and nightlife presentation — QUALIFIED PASS; P2**

- Requirement: Assess alcohol and nightlife presentation under the named provisions.
- Exact provisions: [Tobacco and Alcohol](https://support.google.com/googleplay/android-developer/answer/9878810)
- Pinned code: [src/lib/nightlife/types.ts#L62-L82](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/nightlife/types.ts#L62-L82); [src/components/result-overlay.tsx#L129-L130](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/result-overlay.tsx#L129-L130); [src/components/rideshare-quick-actions.tsx#L9-L24](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/rideshare-quick-actions.tsx#L9-L24); [src/components/settings-page.tsx#L38](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/settings-page.tsx#L38)
- Evidence: All six Nightlife category images were viewed: generic bar/bottle, beer, disco ball, martini, brewery/beer and dice/chip. Reviewed UI has no alcohol checkout, excessive-drinking encouragement or underage-drinking claim, and presents sober-driving and venue age-rule reminders.
- Qualification: Alcohol-themed venue discovery is not a blanket prohibition. Age suitability and actual targeting still need a declared decision. A disclaimer would not cure illegal promotion, a prohibited transaction or harmful targeting.
- Confidence: Medium
- Next action: Keep copy neutral; ensure target audience, rating questionnaire and screenshots reflect alcohol-related content.
- Acceptance: Review final copy and listings for underage or excessive-drinking encouragement, tobacco promotions and alcohol-sales functionality; confirm venue age notes remain visible where relevant.
- Original assessment: QUALIFIED PASS; P2. Submission gate: no separate mandatory gate established.

## CONTENT-03
**IARC content rating and questionnaire — HOLD; P1**

- Requirement: Assess iarc content rating and questionnaire under the named provisions.
- Exact provisions: [How content ratings are assigned](https://support.google.com/googleplay/android-developer/answer/9898843)
- Pinned code: [ANDROID_RELEASE.md#L217-L221](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/ANDROID_RELEASE.md#L217-L221); [src/lib/nightlife/types.ts#L62-L82](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/nightlife/types.ts#L62-L82); [src/components/mode-home.tsx#L55-L73](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/mode-home.tsx#L55-L73); [src/lib/date-night/icons.ts#L39-L51](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/date-night/icons.ts#L39-L51)
- Evidence: Repository checklist leaves content rating and casino/alcohol declarations for release. No current Console questionnaire, resulting certificate or exact final content rating was supplied.
- Qualification: The proper rating cannot be derived merely from casino labels or chosen by this audit. Include actual gambling imagery, alcohol and Halloween/scary content, remote content and other applicable questionnaire facts.
- Confidence: High
- Next action: Owner must complete/reconcile the exact release's truthful IARC questionnaire and preserve its resulting ratings; this audit did not enter Console.
- Acceptance: Review exported questionnaire answers and assigned ratings against the exact app, all accessible content and release territories. Confirm no content changes invalidate answers.
- Original assessment: HOLD; P1. Submission gate: yes.

## CONTENT-04
**Target audience and minor access — HOLD; P1**

- Requirement: Assess target audience and minor access under the named provisions.
- Exact provisions: [Fill out Target audience and content; About target age groups; Ages 18 and over](https://support.google.com/googleplay/android-developer/answer/9867159); [Apps required to block minors](https://support.google.com/googleplay/android-developer/answer/16302250); [Families Policy Requirements](https://support.google.com/googleplay/android-developer/answer/9893335)
- Pinned code: [src/components/mode-home.tsx#L28-L74](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/mode-home.tsx#L28-L74); [src/components/nightlife-home.tsx#L123-L180](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/nightlife-home.tsx#L123-L180); [src/lib/date-night/types.ts#L1-L35](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/date-night/types.ts#L1-L35); [src/lib/store.ts](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/store.ts)
- Evidence: No final target-age declarations or geographic audience decision was supplied. Reviewed venue-picker paths have no user-age gate. Date Night picks activities and places, not matches between people.
- Qualification: No automatic 18+ requirement is established solely by physical casino discovery or the Date Night name. The current age-restriction policy lists real-money gambling facilitation and specified social/dating functionality; if those actually apply, Console minor blocking is required. Child targeting would trigger Families duties.
- Confidence: High
- Next action: Choose and document the genuinely intended audience; reconcile mature themes, marketing, available destinations and local age rules. Assess whether the policy's mandatory-minor-block categories apply to final functionality.
- Acceptance: Compare final Console age selections, marketing and runtime to actual intended users; if child targeting is selected, separately verify all Families controls and SDK behavior. If mandatory restriction applies, verify its configured state.
- Original assessment: HOLD; P1. Submission gate: yes.

## CONTENT-05
**Final store listing metadata and preview assets — HOLD; P1**

- Requirement: Assess final store listing metadata and preview assets under the named provisions.
- Exact provisions: [Full Policy; inappropriate text/images/videos; best practices](https://support.google.com/googleplay/android-developer/answer/9898842)
- Pinned code: [src/routes/__root.tsx#L14-L32](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/routes/__root.tsx#L14-L32); [ANDROID_RELEASE.md#L217-L221](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/ANDROID_RELEASE.md#L217-L221); [native-android/README.md#L1-L9](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/native-android/README.md#L1-L9); [public/brand/pick-for-us-icon-master.jpg](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/public/brand/pick-for-us-icon-master.jpg)
- Evidence: Code names the app Pick For Us (11 characters). The inspected approved icon says PICK FOR US and has no obvious rank, price, Play endorsement or third-party logo. This is not proof of the actual Play title, developer name, descriptions, feature graphic, screenshots, video or locale variants, which were not supplied.
- Qualification: Brand-name capitalization in this icon is not automatically forbidden. Store metadata must accurately reflect the current experience and remain appropriate for a general audience, even when the app's target audience is older.
- Confidence: High
- Next action: Provide the exact proposed listing text and media; review all localizations and claims. Preserve honest discovery scope, external-service boundaries and content limitations.
- Acceptance: Check title length and formatting; inspect every listing asset for misleading rankings/promotions/endorsements, profanity, graphic violence or sexual imagery; compare screenshots to the exact release and avoid unsupported coverage/availability guarantees.
- Original assessment: HOLD; P1. Submission gate: yes.

## CONTENT-06
**Artwork, audiovisual material and intellectual-property rights — HOLD; P1**

- Requirement: Assess artwork, audiovisual material and intellectual-property rights under the named provisions.
- Exact provisions: [Unauthorized Use of Copyrighted Content; Trademark Infringement](https://support.google.com/googleplay/android-developer/answer/9888072?hl=en)
- Pinned code: [LEGAL.md#L17-L23](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/LEGAL.md#L17-L23); [public/dinner-icons/README.md](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/public/dinner-icons/README.md); [public/dinner-icons/dark/README.md](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/public/dinner-icons/dark/README.md); [src/lib/restaurants/image-overrides.ts#L9-L24](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/restaurants/image-overrides.ts#L9-L24); [native-android/README.md#L1-L9](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/native-android/README.md#L1-L9); [src/components/startup-ident.tsx#L3-L33](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/startup-ident.tsx#L3-L33)
- Evidence: Repository documentation calls Dinner artwork original/owned and identifies an approved icon master. Ten pinned image blobs were visually inspected and hash-verified; sampled art is generic and no obvious third-party venue logo was seen. StartupIdent actively loads CAUSTIC_RELAY_ident-2.mp4. No complete rights/provenance packet for all artwork, videos, audio, fonts and listing assets was supplied.
- Qualification: A source filename, owner approval, generation-style label, public availability or unchanged hash does not itself establish usage rights. This is an evidence HOLD, not a finding of infringement. Video/audio contents and all other artwork were not exhaustively inspected. Original assets may be supported by owner/creator provenance and applicable generation-tool terms. This does not demand paid legal clearance or written permission for every factual brand reference.
- Confidence: High for missing evidence; medium for ownership inference
- Next action: Assemble an asset ledger with creator/source, acquisition or generation context, applicable license/terms/permission, modification rights and attribution requirements. Resolve unknowns before certifying rights; preserve the approved artwork rather than redesigning it automatically.
- Acceptance: Every shipped and proposed listing asset maps to documented rights and required notices. Independently review the startup video/audio and unsampled art; verify the exact licensed versions and derivative permissions.
- Original assessment: HOLD; P1. Submission gate: yes.

## CONTENT-07
**Factual third-party naming and affiliation — QUALIFIED PASS; P2**

- Requirement: Assess factual third-party naming and affiliation under the named provisions.
- Exact provisions: [Trademark Infringement](https://support.google.com/googleplay/android-developer/answer/9888072?hl=en); [Accurate functionality and nonmisleading presentation](https://support.google.com/googleplay/android-developer/answer/9898842)
- Pinned code: [src/components/result-overlay.tsx#L25-L29](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/result-overlay.tsx#L25-L29); [src/components/result-overlay.tsx#L123-L130](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/result-overlay.tsx#L123-L130); [src/components/rideshare-quick-actions.tsx#L13-L24](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/rideshare-quick-actions.tsx#L13-L24); [src/components/settings-page.tsx#L38](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/settings-page.tsx#L38); [src/lib/restaurants/image-overrides.ts#L9-L24](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/restaurants/image-overrides.ts#L9-L24)
- Evidence: Inspected delivery, mapping and ride-service links use textual service names, external indicators and independence disclaimers. Restaurant art intentionally uses category imagery rather than restaurant logos.
- Qualification: Factual naming does not prove a partnership. Neither these disclosures nor the generic-art pattern certify all trademark rights or every remote listing.
- Confidence: Medium
- Next action: Retain clear independent-service labeling; avoid implying official provider affiliation in the final listing or adding unlicensed branded badges.
- Acceptance: Compare final UI and marketing against authorized branding; confirm destination names are factual and no partnership or endorsement is implied without evidence.
- Original assessment: QUALIFIED PASS; P2. Submission gate: no separate mandatory gate established.

## CONTENT-08
**Ads and commercial-placement declaration — HOLD; P1**

- Requirement: Assess ads and commercial-placement declaration under the named provisions.
- Exact provisions: [Ad Content; Inappropriate Ads](https://support.google.com/googleplay/android-developer/answer/9857753?hl=en); [Ads for Gambling or Real-Money Games, Contests, and Tournaments](https://support.google.com/googleplay/android-developer/answer/9877032)
- Pinned code: [package.json](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/package.json); [src/components/result-overlay.tsx#L25-L29](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/result-overlay.tsx#L25-L29); [src/components/result-overlay.tsx#L123-L130](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/result-overlay.tsx#L123-L130); [LEGAL.md#L75](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/LEGAL.md#L75)
- Evidence: No ad SDK in the inspected package manifest or explicit ad unit in inspected UI was identified; provider shortcuts are ordinary service links in these files. That does not establish whether any placement, referral relationship, sponsorship or remote content is monetized. No final Contains ads declaration was supplied.
- Qualification: Analytics is not automatically advertising, and a venue entry is not automatically an ad. If gambling ads are introduced, their distinct policy restrictions would require a separate assessment; discovery disclaimers do not bypass them.
- Confidence: Medium
- Next action: Owner must confirm the actual monetization and placement model, then make the corresponding accurate Play declaration. Do not add gambling promotions based on this audit.
- Acceptance: Reconcile commercial relationships, release dependencies, runtime network/content and final Contains ads choice. If ads exist, audit format, maturity, audience and gambling restrictions.
- Original assessment: HOLD; P1. Submission gate: yes.

## CONTENT-09
**Advance-notice applicability — QUALIFIED PASS; P3**

- Requirement: Assess advance-notice applicability under the named provisions.
- Exact provisions: [Accepted advance-notice scenarios](https://support.google.com/googleplay/android-developer/answer/6320428); [Written third-party IP permission documentation](https://support.google.com/googleplay/android-developer/answer/9888072?hl=en)
- Pinned code: [LEGAL.md#L17-L23](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/LEGAL.md#L17-L23); [src/components/result-overlay.tsx#L123-L130](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/result-overlay.tsx#L123-L130); [src/lib/nightlife/types.ts#L10-L17](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/nightlife/types.ts#L10-L17)
- Evidence: The official page accepts enumerated evidence scenarios, including written third-party IP permission and Korean GRAC certificates for games with gambling/casino-style elements. It is not a generic approval/preclearance form for every app.
- Qualification: Physical casino listings and a random venue picker do not by themselves establish the Korean casino-style-game case. Other listed scenarios were not evidenced in this lane. No advance-notice submission was made.
- Confidence: High
- Next action: Use the official route only if a supported scenario actually applies and the required evidence exists; IP documentation may be relevant after CONTENT-06 is resolved. For a general policy classification question, use official support rather than promise an advance-notice response.
- Acceptance: Record the applicable scenario and supporting documents before any separately authorized submission. Do not claim acceptance or approval without Google's response.
- Original assessment: QUALIFIED PASS; P3. Submission gate: no separate mandatory gate established.

## CONTENT-10
**Requested Play Academy training source — HOLD; P3**

- Requirement: Assess requested play academy training source under the named provisions.
- Exact provisions: [Public course landing page; Log In To Launch](https://playacademy.exceedlms.com/student/activity/7239-comply-with-google-play-store-listing-policies)
- Pinned code: not applicable for this educational/administrative item; the named official source and stated app facts are the evidence.
- Evidence: Exact requested landing page was retrieved. It identifies the course, publication date April 14, 2025, and duration 10 minutes, but launches only after login. Authenticated module content and course completion were not accessed.
- Qualification: This is a research-access limitation, not a standalone app policy violation or proof that training is mandatory. Official Metadata, IP, rating and target-audience pages support the substantive audit independently.
- Confidence: High
- Next action: If complete course review is still desired, owner can provide permitted course materials or complete it separately; retain the limitation in the report.
- Acceptance: Do not label the training completed without its actual authenticated content/completion evidence.
- Original assessment: HOLD; P3. Submission gate: no separate mandatory gate established.

## CONTENT-11
**Dynamic restricted-content exposure and sampled artwork — HOLD; P2**

- Requirement: Assess dynamic restricted-content exposure and sampled artwork under the named provisions.
- Exact provisions: [Sexual Content and Profanity; Violence; Tobacco and Alcohol](https://support.google.com/googleplay/android-developer/answer/9878810)
- Pinned code: [src/lib/nightlife/search.ts#L75-L89](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/nightlife/search.ts#L75-L89); [src/lib/nightlife/discovery-policy.ts#L56-L79](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/nightlife/discovery-policy.ts#L56-L79); [src/components/result-overlay.tsx#L118-L130](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/result-overlay.tsx#L118-L130); [src/lib/date-night/icons.ts#L39-L51](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/date-night/icons.ts#L39-L51)
- Evidence: Live Nightlife queries broad bar/pub/nightclub/casino/brewery tags. Inspected conversion rejects malformed/closed records and held casino identities, but has no explicit adult-entertainment/content classification exclusion. No prohibited live venue/result was reproduced. Ten inspected images included all six Nightlife categories and three Halloween category images; no graphic gore, nudity or prohibited content was seen in those samples.
- Qualification: This is incomplete coverage and a plausible provider-input boundary risk, not a demonstrated production violation or a mandate for a specific filter implementation. Static generic artwork is not evidence that the app itself offers generative-AI functionality.
- Confidence: Medium
- Next action: Complete focused provider-content and remaining media review before claiming an exhaustive restricted-content pass. If prohibited content is found, choose and verify a bounded exclusion/moderation approach.
- Acceptance: Inspect representative live regions and adversarial provider records for adult-sexual entertainment, prohibited tobacco promotion and profane/misleading content; verify handling through result/options/favorites. Review remaining video/audio and listing media. Avoid importing prohibited samples into production.
- Original assessment: HOLD; P2. Submission gate: no separate mandatory gate established.

## CONTENT-12
**Licensed gambling operator and GRAC workflows in the current source — NOT APPLICABLE; P3**

- Requirement: Assess licensed gambling operator and grac workflows in the current source under the named provisions.
- Exact provisions: [Gambling Apps](https://support.google.com/googleplay/android-developer/answer/9877032); [Korean GRAC documentation scenario](https://support.google.com/googleplay/android-developer/answer/6320428)
- Pinned code: [src/components/nightlife-home.tsx#L101-L117](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/nightlife-home.tsx#L101-L117); [src/components/result-overlay.tsx#L123-L130](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/result-overlay.tsx#L123-L130); [LEGAL.md#L37-L43](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/LEGAL.md#L37-L43)
- Evidence: No online gambling product, wager processing or casino-style playable game was established in inspected Pick For Us flows.
- Qualification: NA is conditional on the current discovery-only implementation; it is not a license exemption ruling. If functionality or Google's classification differs, reclassify and obtain the applicable evidence.
- Confidence: Medium
- Next action: Do not initiate gambling-license application or GRAC submission merely because the catalog lists casinos. Reopen if product scope changes.
- Acceptance: Confirm the final functionality still matches CONTENT-01 before applying this conditional NA.
- Original assessment: NA; P3. Submission gate: no separate mandatory gate established.

## C1
**Developer identity and authority — HOLD; P1**

- Requirement: DDA §§2.1–2.3, 11.4: authorized acceptance and accurate information
- Exact provisions: [DDA §§2.1–2.3, 11.4](https://play.google/developer-distribution-agreement.html)
- Pinned code: [android/signing.gradle](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/signing.gradle); [ANDROID_RELEASE.md](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/ANDROID_RELEASE.md)
- Evidence: ANDROID_RELEASE.md explicitly leaves Console ownership unverified; no account acceptance evidence reviewed
- Qualification: UNKNOWN; high confidence in gap. No app-specific contract breach, ECCN, exemption, automatic filing obligation or accepted agreement is inferred.
- Confidence: UNKNOWN; high confidence in gap
- Next action: owner verifies account/entity, authority, package and accepted version
- Acceptance: Independent reviewer checks the evidence supporting this exact item and the owner records the unresolved decision before the relevant release action. No keys, agreements, declarations or upload are authorized by this plan.
- Original assessment: UNKNOWN; high confidence in gap; P1. Submission gate: yes.

## C2
**Play App Signing enrollment — HOLD; P1**

- Requirement: Signing Terms §§1.1–1.3: AAB publication uses signing service; supply a key or authorize generation; downloadable signed APK
- Exact provisions: [Signing Terms §§1.1–1.3](https://play.google/play-app-signing-terms/)
- Pinned code: [android/signing.gradle](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/signing.gradle); [ANDROID_RELEASE.md](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/ANDROID_RELEASE.md)
- Evidence: package.json:25–26 builds AAB; signing.gradle:1–40 configures upload inputs
- Qualification: Source compatible, enrollment UNKNOWN; high. No app-specific contract breach, ECCN, exemption, automatic filing obligation or accepted agreement is inferred.
- Confidence: Source compatible, enrollment UNKNOWN; high
- Next action: owner chooses service/key route after reviewing terms
- Acceptance: Independent reviewer checks the evidence supporting this exact item and the owner records the unresolved decision before the relevant release action. No keys, agreements, declarations or upload are authorized by this plan.
- Original assessment: Source compatible, enrollment UNKNOWN; high; P1. Submission gate: yes.

## C3
**Distribution key custody and cross-store strategy — HOLD; P1**

- Requirement: Signing Terms §§2.1–2.2, 3.1: life-of-app generation/optimization license; purpose preserved; private key cannot be retrieved; disaster-recovery backup may remain indefinitely
- Exact provisions: [Signing Terms §§2.1–2.2, 3.1](https://play.google/play-app-signing-terms/)
- Pinned code: [android/signing.gradle](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/signing.gradle); [ANDROID_RELEASE.md](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/ANDROID_RELEASE.md)
- Evidence: No owner key-custody/cross-store decision in reviewed evidence
- Qualification: Decision pending; high. No app-specific contract breach, ECCN, exemption, automatic filing obligation or accepted agreement is inferred.
- Confidence: Decision pending; high
- Next action: approve custody and redistribution plan before enrollment
- Acceptance: Independent reviewer checks the evidence supporting this exact item and the owner records the unresolved decision before the relevant release action. No keys, agreements, declarations or upload are authorized by this plan.
- Original assessment: Decision pending; high; P1. Submission gate: yes.

## C4
**Key ownership wording — HOLD; P2**

- Requirement: DDA §§4.3, 4.4 and Signing Terms §1.2
- Exact provisions: [DDA §§4.3, 4.4](https://play.google/developer-distribution-agreement.html); [Signing Terms §1.2](https://play.google/play-app-signing-terms/)
- Pinned code: [android/signing.gradle](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/signing.gradle); [ANDROID_RELEASE.md](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/ANDROID_RELEASE.md)
- Evidence: signing.gradle:1 says Google Play “owns” the distribution key
- Qualification: Phrasing unsupported; high. No ownership transfer or breach established. No app-specific contract breach, ECCN, exemption, automatic filing obligation or accepted agreement is inferred.
- Confidence: Phrasing unsupported; high. No ownership transfer or breach established
- Next action: replace conceptually with Google manages/stores/uses the signing key; no repository edit made
- Acceptance: Independent reviewer checks the evidence supporting this exact item and the owner records the unresolved decision before the relevant release action. No keys, agreements, declarations or upload are authorized by this plan.
- Original assessment: Phrasing unsupported; high. No ownership transfer or breach established; P2. Submission gate: no separate mandatory gate established.

## C5
**Upload key custody and recovery — HOLD; P1**

- Requirement: Signing help: Core concepts; Request an upload key reset; Android guide: Reset a lost or compromised private upload key
- Exact provisions: [Signing help: Core concepts; Request an upload key reset](https://support.google.com/googleplay/android-developer/answer/9842756); [Android guide: Reset a lost or compromised private upload key](https://developer.android.com/studio/publish/app-signing#reset-key)
- Pinned code: [android/signing.gradle](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/signing.gradle); [ANDROID_RELEASE.md](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/ANDROID_RELEASE.md)
- Evidence: signing.gradle rejects partial inputs and unsigned ordinary release; workflow:143–205 has optional signing job
- Qualification: Guard present; real custody, backup, certificate and environment protection UNKNOWN; high. No app-specific contract breach, ECCN, exemption, automatic filing obligation or accepted agreement is inferred.
- Confidence: Guard present; real custody, backup, certificate and environment protection UNKNOWN; high
- Next action: owner checks upload key recovery plan and certificate match
- Acceptance: Independent reviewer checks the evidence supporting this exact item and the owner records the unresolved decision before the relevant release action. No keys, agreements, declarations or upload are authorized by this plan.
- Original assessment: Guard present; real custody, backup, certificate and environment protection UNKNOWN; high; P1. Submission gate: yes.

## C6
**Certificates and API registrations — HOLD; P1**

- Requirement: Signing help: Register with API providers; Upgrade your app signing key
- Exact provisions: [Signing help: Register with API providers; Upgrade your app signing key](https://support.google.com/googleplay/android-developer/answer/9842756)
- Pinned code: [android/signing.gradle](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/signing.gradle); [ANDROID_RELEASE.md](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/ANDROID_RELEASE.md)
- Evidence: appId fixed in capacitor.config.json and app/build.gradle; source only proves server OAuth paths, not native certificate-bound services
- Qualification: Actual enrollment/certificates and API dependency map UNKNOWN; high. No app-specific contract breach, ECCN, exemption, automatic filing obligation or accepted agreement is inferred.
- Confidence: Actual enrollment/certificates and API dependency map UNKNOWN; high
- Next action: read actual Console certificates and test each applicable fingerprint-bound integration
- Acceptance: Independent reviewer checks the evidence supporting this exact item and the owner records the unresolved decision before the relevant release action. No keys, agreements, declarations or upload are authorized by this plan.
- Original assessment: Actual enrollment/certificates and API dependency map UNKNOWN; high; P1. Submission gate: yes.

## C7
**Agreement versions and notices — HOLD; P2**

- Requirement: Signing Terms §4.1 and DDA §15: change notices and continued-use acceptance
- Exact provisions: [Signing Terms §4.1](https://play.google/play-app-signing-terms/); [DDA §15](https://play.google/developer-distribution-agreement.html)
- Pinned code: [android/signing.gradle](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/signing.gradle); [ANDROID_RELEASE.md](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/ANDROID_RELEASE.md)
- Evidence: No Console notices reviewed
- Qualification: UNKNOWN; high. No app-specific contract breach, ECCN, exemption, automatic filing obligation or accepted agreement is inferred.
- Confidence: UNKNOWN; high
- Next action: record current accepted terms and outstanding notices before owner proceeds
- Acceptance: Independent reviewer checks the evidence supporting this exact item and the owner records the unresolved decision before the relevant release action. No keys, agreements, declarations or upload are authorized by this plan.
- Original assessment: UNKNOWN; high; P2. Submission gate: no separate mandatory gate established.

## C8
**DDA policies rights and applicable laws — HOLD; P1**

- Requirement: DDA §§4.1, 4.6, 4.8, 11.1–11.3, 16.5: policies, privacy, rights, applicable laws/export/sanctions
- Exact provisions: [DDA §§4.1, 4.6, 4.8, 11.1–11.3, 16.5](https://play.google/developer-distribution-agreement.html)
- Pinned code: [android/signing.gradle](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/android/signing.gradle); [ANDROID_RELEASE.md](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/ANDROID_RELEASE.md)
- Evidence: Crypto inventory below; broader policy/privacy findings belong in main audit
- Qualification: No blanket compliance conclusion; high. No app-specific contract breach, ECCN, exemption, automatic filing obligation or accepted agreement is inferred.
- Confidence: No blanket compliance conclusion; high
- Next action: reconcile owner declarations with complete main-audit evidence
- Acceptance: Independent reviewer checks the evidence supporting this exact item and the owner records the unresolved decision before the relevant release action. No keys, agreements, declarations or upload are authorized by this plan.
- Original assessment: No blanket compliance conclusion; high; P1. Submission gate: yes.

## E1
**Product export classification and reporting — HOLD; P1**

- Requirement: 15 CFR 740.17(b), (d), (e)(3), 742.15
- Exact provisions: [15 CFR 740.17(b), (d), (e)(3)](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-740/section-740.17); [742.15](https://www.ecfr.gov/current/title-15/subtitle-B/chapter-VII/subchapter-C/part-742/section-742.15)
- Pinned code: [capacitor.config.json](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/capacitor.config.json); [src/lib/auth/gate-identity.server.ts#L58-L113](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/auth/gate-identity.server.ts#L58-L113); [src/lib/auth/server.ts#L175-L225](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/auth/server.ts#L175-L225); [package-lock.json](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/package-lock.json)
- Evidence: HTTPS shell, server cryptography and locked crypto-related packages; no classification memo or exact signed artifact reviewed
- Qualification: Classification, reporting and license status UNKNOWN; high confidence in technical observations, no legal classification. No app-specific contract breach, ECCN, exemption, automatic filing obligation or accepted agreement is inferred.
- Confidence: Classification, reporting and license status UNKNOWN; high confidence in technical observations, no legal classification
- Next action: owner/adviser establishes product-level scope and documented rationale
- Acceptance: Independent reviewer checks the evidence supporting this exact item and the owner records the unresolved decision before the relevant release action. No keys, agreements, declarations or upload are authorized by this plan.
- Original assessment: Classification, reporting and license status UNKNOWN; high confidence in technical observations, no legal classification; P1. Submission gate: yes.

## E2
**Cryptography and distributed-component inventory — HOLD; P1**

- Requirement: Google export help; BIS overview, Note 2
- Exact provisions: [Google export help](https://support.google.com/googleplay/android-developer/answer/113770?hl=en); [BIS overview, Note 2](https://media.bis.gov/learn-support/encryption-controls/encryption-items-not-subject-to-ear)
- Pinned code: [capacitor.config.json](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/capacitor.config.json); [src/lib/auth/gate-identity.server.ts#L58-L113](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/auth/gate-identity.server.ts#L58-L113); [src/lib/auth/server.ts#L175-L225](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/auth/server.ts#L175-L225); [package-lock.json](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/package-lock.json)
- Evidence: Hosted frontend, server modules and Android shell are distinct deliverables
- Qualification: “No crypto,” “open source therefore exempt,” or “TLS therefore exempt” unsupported; high. No app-specific contract breach, ECCN, exemption, automatic filing obligation or accepted agreement is inferred.
- Confidence: “No crypto,” “open source therefore exempt,” or “TLS therefore exempt” unsupported; high
- Next action: inventory actual distributed components and usage before declaration
- Acceptance: Independent reviewer checks the evidence supporting this exact item and the owner records the unresolved decision before the relevant release action. No keys, agreements, declarations or upload are authorized by this plan.
- Original assessment: “No crypto,” “open source therefore exempt,” or “TLS therefore exempt” unsupported; high; P1. Submission gate: yes.

## E3
**Destinations jurisdictions and sanctions — HOLD; P1**

- Requirement: OFAC programs, plus DDA §16.5
- Exact provisions: [OFAC programs](https://ofac.treasury.gov/sanctions-programs-and-country-information); [DDA §16.5](https://play.google/developer-distribution-agreement.html)
- Pinned code: [capacitor.config.json](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/capacitor.config.json); [src/lib/auth/gate-identity.server.ts#L58-L113](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/auth/gate-identity.server.ts#L58-L113); [src/lib/auth/server.ts#L175-L225](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/lib/auth/server.ts#L175-L225); [package-lock.json](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/package-lock.json)
- Evidence: Countries, end users/end uses, operator jurisdiction, and distribution settings not supplied
- Qualification: UNKNOWN; high. No app-specific contract breach, ECCN, exemption, automatic filing obligation or accepted agreement is inferred.
- Confidence: UNKNOWN; high
- Next action: assess relevant destinations, parties and uses; Google blocking alone is not a product-specific determination
- Acceptance: Independent reviewer checks the evidence supporting this exact item and the owner records the unresolved decision before the relevant release action. No keys, agreements, declarations or upload are authorized by this plan.
- Original assessment: UNKNOWN; high; P1. Submission gate: yes.
