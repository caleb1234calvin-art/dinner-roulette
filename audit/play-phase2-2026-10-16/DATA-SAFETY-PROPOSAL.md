# Pick For Us — proposed Google Play Data safety answers
Prepared 2026-10-16. Research only; no Console access/submission, contact, deployment, signing or source mutation. **Overall: DRAFT / HOLD for owner attestation and release validation.** This is a decision aid, not an import-ready form or completed certification.

## Release boundary
- Released main: `c3208d9fdc9a21d698efa9254be1286f5d3d2836`. Last inherited production receipt (08:12 UTC): `dpl_FMS2SBg4ymuDwU4avpywV6yB5vg6`, source main. This lane did not independently refresh deployment state.
- Frozen PR77: `6b370a5202ffb531434d725f49aacbdc325f32c5`, tree `520f545ec006041ef5694a138cfb65f7a897011c`. Local HEAD verified. Legal version 1.0 is **unreleased**, effective dates **null**. Policy wording is prepared, not production behavior or publication evidence.
- Android loads `https://dinner-roulette-chi.vercel.app`; candidate AAB does not embed candidate policies. Remote runtime, all released variants, and actual Android behavior determine eventual answers.
- Earlier source-only ambiguity about Vercel pageviews was resolved by dashboard evidence: production 37 visitors/108 pageviews, country/device/OS aggregates, Hobby plan. Custom-event intake remains unproved.

## Current official interpretation
Collection includes off-device transfers from controlled WebViews. Sharing includes onward server transfers and app handoffs. A provider exception requires processing on the developer's behalf/instructions; naming a vendor is insufficient. User-directed transfer requires a specific action and reasonable expectation, or qualifying disclosure/consent. Ephemeral processing is memory-only and request-limited; declare it in the form. Local-only data is excluded. IP classification follows actual use. Encryption concerns all applicable app collection. Optional collection requires genuine user choice; aggregate answers must include mandatory paths. [Google Data safety guidance](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en-en), fetched today.

The same page retains conflicting later FAQ wording about ephemeral data. Do not exploit that conflict: use its main form instructions, and do not claim ephemeral handling without evidence. No precise-location exclusion follows from `enableHighAccuracy:false`, and no anonymity exclusion follows from the absence of cookies.

## Exact top-level proposed selections
| Question | Proposed answer | Confidence / release condition |
|---|---|---|
| Does the app collect or share any required user data types? | **Yes** | High: location RPCs and enabled production analytics. |
| Is all collected user data encrypted in transit? | **Yes, conditional draft**; do not attest yet | HTTPS origin/provider URLs and cleartext/mixed-content prohibitions support it. Confirm native requests, redirects and third-party intake in final runtime. This is not an assertion of end-to-end encryption or zero provider access. |
| Can users request deletion of their data? | **PR77 after publication: Yes**. Production today: **HOLD**, no discoverable current mechanism established by this lane | Prepared policy provides email request handling, not instant universal deletion. Owner adoption and reachable published path support future Yes. Local Clear favorites/history alone is insufficient. Do not falsely select No merely because provider backup erasure is not immediate. |
| Account creation methods supported? | **“My app does not allow users to create an account” — conditional draft** | Visible product has no account creation, disabled email/password, standard GET endpoints returned 404. Verify final reachable routes/configuration, including links to external signup. Dormant auth code is not proof of actual account creation; no historical-record denial is made. |
| Privacy-policy URL | Proposed `https://pickforus.app/privacy`, **not submission-ready** | Prepared route exists only in unreleased PR77. Prior live result was 404; final public acceptance required. |
| Independent security review badge | **Do not claim** | Engineering/legal independent review is not a Google-authorized MASA assessment. |
| Automatic deletion within 90 days | **Do not select on current evidence** | Local storage, operational logs and support process do not establish this. |

Account-deletion obligations apply when the app offers creation, including directing users outside the app; optional accounts still count. Such a release needs an in-app path plus a functional external request resource and deletion of associated data, with legitimate retention explained. Email may be a request route; users must be able to find and use it. [Google account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en).

## Category proposal
Use DATA-SAFETY-MATRIX.json for complete row-level provenance, purpose, optionality, sharing and evidence gaps. Proposed initial selections are:
- **Precise location; Approximate location; App interactions; In-app search history; Device or other IDs; Diagnostics.** The last two include explicit qualifications below, not a claim every potential telemetry field was captured.
- **Web browsing history: conditional**, only if actual external referrer/site-visit information is transmitted. Own-app route visits already map to App interactions.
- **Email address, Emails, attachments and account identifiers: do not add solely because a mailto link or auth scaffolding exists.** Add only for actual in-scope collection. See support boundary below.
- No affirmative evidence for financial, health/fitness, contacts, calendar, installed apps, audio, photos/video collection by the inspected app. This is bounded source evidence, not an all-build negative attestation.

### Location/search
Returned GPS coordinates leave the device through server functions. Nominatim receives unrounded coordinates or manual text; independently operated Overpass mirrors receive coordinate/radius/category queries. GPS-derived precise location: propose Collected + Shared, Optional, App functionality; ephemeral **unverified, no exemption claimed**. A nearby-search button and OS permission alone do not establish the specific sharing exception for every mirror.

Approximate location includes coarse GPS and analytics-derived geography. GPS itself is optional, but automatic analytics makes the **combined category Required**, with App functionality and Analytics purposes. Do not mark the whole category optional solely because GPS can be denied. Manual destination text is In-app search history; it is not automatically the user's address or physical location. Proposed search collection Optional because manual provision is a choice alongside GPS; validate usable alternatives on Android. Searches still qualify without a stored historical list.

Do not claim Nominatim/Overpass receive the user's originating IP: reviewed server calls identify the app and typically expose server egress. Actual forwarding headers remain a verification item. This does not eliminate coordinate collection/sharing.

### Vercel hosting and analytics
Pageview intake is observed. App interactions: Collected, Required, Analytics. Diagnostics: proposed Collected, Required when applicable, Analytics / App functionality, based on request-outcome and duration logging; inspect whether telemetry includes user/device-derived data versus purely server operational records before finalizing this row.

Vercel documents request-derived visitor hashes, a 24-hour visitor-session lifetime, automatic pageviews, and geography/device/browser/referrer fields. Proposed Device or other IDs is a conservative mapping of that visitor identifier, with medium confidence pending implementation detail. Its aggregate dashboard and provider terminology do not alone settle Play's identifier/anonymization criteria. No AAID/IMEI collection is asserted. [Vercel analytics documentation](https://vercel.com/docs/analytics/privacy-policy).

Vercel hosting/analytics on the operator's behalf is a plausible service-provider exception. Final “not shared” requires a basis for the actual Hobby service and its processing roles; the previously reviewed Enterprise/Pro DPA must not be asserted to cover Hobby. Lack of that DPA does not itself prove sharing, require an upgrade, or prohibit publishing an accurate privacy policy. Keep sharing **HOLD** rather than inventing either answer. No visible Vercel Drains was already established. Owner additionally answered “Right now, no, but it'll be something we work towards.” at 05:38 UTC (message Sentinel_c86b35edf4408191867085e39aec7990) to the separate-copies/exports question. Preserve this as owner attestation, not forensic proof; do not reopen it without contradictory evidence.

### Fonts and Grok web resource
Google Fonts receives connection information. Google says its API is not used for advertising or end-user profiling; that does not by itself establish every Play category or a processor exception. Do not label its IP automatically as location or device ID without use evidence. [Google Fonts explanation](https://fonts.googleblog.com/2022/11/your-privacy-and-google-fonts.html).

Captured Grok extension is a branding/remix resource, not the disabled support-mail bot. Its GET response offered `grok_device_id` and `__cf_bm` cookies. Static capture used no cookie jar and proves neither WebView acceptance nor retransmission. Captured production HTML supplies no project ID, so the optional project-check request is not activated by that HTML. No GPS/local-storage/email path was found in captured script bytes. Propose Device or other IDs **Shared if** runtime sends an identifying cookie and no valid exception applies; investigate actual purpose before selecting Analytics, Security or Advertising. Provider-wide targeting-cookie descriptions are not proof this integration serves ads. No blanket Grok service-provider exemption.

### Local data, external navigation and support
Favorites, visits/notes, ratings, exclusions, saved settings, theme, seasonal state and legal-notice dismissal are local in inspected paths. No off-device collection is proposed for those records themselves. A saved location subsequently used in RPCs is still location collection; local persistence does not exempt that later flow. Android backup/device-transfer behavior remains a bounded platform test, not evidence of an app-operated cloud sync.

Directions/ride/venue actions hand off destination or URL, not source GPS in the reviewed helper. A specific clearly labeled user action is a credible user-directed sharing exception for the expected destination transfer; verify actual Android dispatch, data and UI. It cannot exempt automatic background resource requests. A selected public venue is not automatically the user's physical location.

PR77 support link prepopulates operator recipient and generic subject, not user's email/body/logs. A user's independently composed message in their mail app is handled by operator/Gmail, but that alone does not prove Pick For Us transmits Emails or Email address. Therefore do not mark those categories collected solely from mailto. If final flow adds in-app composition, uploads, diagnostic attachments or automatic user metadata, remap as Optional/App functionality and assess sharing separately. Policy still appropriately explains support handling even where broader than the Play form. Owner personally manages email and deletes after resolution subject to stated exceptions; no new bot or mailbox access is assumed.

## Small, concrete remaining checks
1. Final Android controlled-WebView network trace: initial launch, denied/coarse/precise location, manual search, page navigation, external directions and support. Record host + field classes without exposing live precise coordinates or cookie values in reports.
2. Establish Vercel visitor-hash scope, diagnostics payload class, and actual Grok cookie acceptance/retransmission. Inspect referrer and redirect behavior. Do not recreate accounts or enable telemetry merely to test it.
3. Record provider-role/exception basis for Vercel, each location operator and external resource; if unresolved, keep answer draft. No need for forensic proof of every backup-erasure deadline.
4. Verify final deployed account reachability and published deletion/privacy paths; preserve PR77's null/unreleased status until separately authorized release.
5. Owner review exact resulting answers against intended released variants. Final form labels/options should be checked read-only when authorized; this proposal is not a stale CSV template or permission to submit.

## Evidence reused
- `play-compliance-2026-10-16/deliverable/DATA-FLOW-INVENTORY.md`, `DECLARATION-EVIDENCE.md`, `EVIDENCE-INDEX.json`.
- `play-compliance-2026-10-16/privacy/REPORT.md` and hash-bound source inventory.
- `legal-support-remediation-2026-10-16/acceptance/VERCEL-PRIVACY-CONFIG-READBACK.md` (including later dashboard readback).
- `privacy-legal-support-2026-10-16/FINALIZATION-PROPOSAL.md`, `RETENTION-GATE-NARROWING.md`, `GROK-PROVIDER-POLICY-SCOPE.md`; older unresolved operational statements are superseded by final PR77 report/owner confirmation.
- `privacy-legal-support-2026-10-16/evidence/grok-extension-retry-manifest.json`, captured script and sanitized headers; no raw cookie values copied.
- `legal-publication-finalization-2026-10-16/PR77-FINAL-REPORT.md` and `OWNER-APPROVAL-READBACK.json`.
- Frozen source: [capacitor config](https://github.com/caleb1234calvin-art/dinner-roulette/blob/6b370a5202ffb531434d725f49aacbdc325f32c5/capacitor.config.json), [prepared policy](https://github.com/caleb1234calvin-art/dinner-roulette/blob/6b370a5202ffb531434d725f49aacbdc325f32c5/src/lib/legal/documents.json), [GPS controller](https://github.com/caleb1234calvin-art/dinner-roulette/blob/6b370a5202ffb531434d725f49aacbdc325f32c5/src/lib/location/controller.ts), [geocoder](https://github.com/caleb1234calvin-art/dinner-roulette/blob/6b370a5202ffb531434d725f49aacbdc325f32c5/src/lib/restaurants/geocode.ts).
