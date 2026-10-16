# Phase 2 independent review

Reviewed 2026-10-16 UTC; final receipt time is recorded in REVIEWED-INPUTS.json. **Preparation: PASS with explicit qualifications below. Release, final declarations, identity registration and physical acceptance: HOLD.** This is an independent document/source review, not Google approval, MASA certification, legal advice, new native build, Console attestation or device execution.

## Exact boundary

Independently verified local `legal-support-candidate`: HEAD `6b370a5202ffb531434d725f49aacbdc325f32c5`, tree `520f545ec006041ef5694a138cfb65f7a897011c`, clean working tree. Privacy and Terms 1.0 plus current history remain `unreleased` with `effectiveDate: null`. No source mutation, signing, installation, upload, Console change or deployment was performed by this review.

`REVIEWED-INPUTS.json` binds reviewed documents and source excerpts by SHA-256. Main baseline remains `c3208d9fdc9a21d698efa9254be1286f5d3d2836`; coordinator's production receipt at 09:07:20 UTC reports deployment `dpl_FMS2SBg4ymuDwU4avpywV6yB5vg6` READY on main. This reviewer did not independently fetch the deployment. Earlier CI and unsigned AAB results are inherited evidence only.

The inspected app still identifies as `com.calebcalvin.pickforus`, label Pick For Us, loading `https://dinner-roulette-chi.vercel.app`. Target `app.pickforus.android` remains a proposal with unverified registration/history and final identity approval outstanding. Caustic Relay is the personal operator brand, not an asserted incorporated entity.

## Reviewed dispositions

### Package/brand proposal: PASS as a bounded proposal; execution HOLD

Source spot checks corroborate current Capacitor/Gradle/resource/Java identity and the gap in Java/resource checks in `check-android.mjs`. The migration surface and negative regression plan are coherent. Proposed ID satisfies Android syntax. A new ID is a different installed/Play application; same runtime and signer do not preserve old-app update or storage continuity. No availability, domain/trademark clearance or private registration fact follows from repository inspection. Final compiled identities, signed artifact/certificate acceptance and device testing remain separate.

Current [Android module documentation](https://developer.android.com/build/configure-app-module) supports identity/namespace separation and the different-app consequence. Keeping namespace equal to application ID is Android guidance, not a standalone Play eligibility requirement. Proposed regression cases, two-device gates and preserving the runtime are engineering acceptance choices, not invented Google mandates.

The [Play registration page](https://support.google.com/googleplay/android-developer/answer/16984799?hl=en), independently retrieved today, expressly states the September 30, 2026 registration deadline and removal consequence for unregistered Play packages. This is current Play registration policy text, distinct from regional installation-enforcement rollout. Identity verification is not proof package registration succeeded; account/package readback is needed.

The [developer information page](https://support.google.com/googleplay/android-developer/answer/13628312?hl=en) supports the proposal's warning: a different public developer name does not hide personal-account legal identity. Additional address disclosures depend on monetization/region. The brand proposal does not promise anonymity or imply changing account type is appropriate.

### Data safety proposal and matrix: PASS as qualified draft; submission HOLD

Reviewed source confirms unrounded returned GPS coordinates are forwarded to reverse geocoding and manual text to search; `enableHighAccuracy:false` is not a precise-location exclusion. Controlled hosted runtime must be assessed alongside native source. Prepared legal text alone is not evidence of production behavior.

Current [Google Data safety instructions](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en-en) support declaring controlled-WebView transfers, server onward sharing, and pseudonymous data. Main form instructions require ephemeral transfers in answers; the report properly avoids relying on conflicting FAQ wording. Service-provider and user-directed exceptions require their factual conditions. Local-only processing is different from subsequent off-device use. Optionality must cover all users and mandatory paths; IP is classified by use. No current evidence supports final blanket anonymity, encryption, processor or deletion attestations.

Approximate location **Required** is a defensible proposed combined-category answer: the retained authenticated dashboard receipt shows enabled production pageviews/country aggregates, while [Vercel documentation](https://vercel.com/docs/analytics/privacy-policy) describes automatic pageview transmission and geography. Choosing manual instead of GPS does not disable those automatic flows. Actual final Android runtime still needs validation. This does not assert every historical install transmitted telemetry.

Device IDs are a cautious mapping of documented request-derived visitor identification, not observed AAID/IMEI collection. Diagnostics remains conditional on user/device-related fields rather than purely server operational records. Cookie response headers alone do not prove Android acceptance/retransmission or advertising purpose. Vercel's aggregate presentation and cookie-free implementation are not conclusive Play anonymity exemptions. Provider roles remain appropriately unresolved; no forced plan upgrade follows.

The mailto source contains an operator address and generic subject only. It does not establish that Pick For Us collects the sender's email/body/attachments. Excluding those categories *solely on this inspected flow* is justified; broad support-policy disclosure can still be appropriate. This is not a categorical exemption for future integrated composition/upload. Account creation remains a reachability question, not a conclusion from dormant code alone. [Google account-deletion guidance](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en) includes externally directed signup and allows a functional, discoverable email request path; publication and owner adoption still need verification.

Review correction DS02: Analytics in sharing purposes is now explicitly conditional on Vercel processing counting as sharing; supported coordinate sharing remains App functionality. Do not strip this qualification in a summary or form.

### Physical acceptance and Console: planning PASS; actual acceptance HOLD

All physical cases are NOT RUN. Three-lane separation between production, candidate preview and final release correctly prevents a PR77-built shell loading production from passing unpublished candidate policies. Requested receipts separately bind native artifact, signer, source and actual runtime. Neither browser automation nor an unsigned bundle supports physical PASS.

The coordinator's 09:06 signed-in personal Gmail session reaching signup/two-step-verification setup is evidence only of that session. It does not disprove the owner's reported verification, establish account type, package availability or testing obligation, or authorize account/security changes. Clarify the correct account before interpreting Console gates. Do not ask the owner to register another account based on this observation.

## Remaining decisions and bounded evidence

1. Resolve correct verified developer-account context and read package/track/registration history. Do not infer absence from signup.
2. Obtain final identity decision after explaining separate-app/update/storage consequences. Proposal authority is not permanent registration or release authority.
3. Complete final runtime data-flow/provider-role checks and exact answer attestation. Do not reopen already settled generic no-export/support-handling questions.
4. Execute identity-bound physical/native distribution acceptance in an authorized test scope, and verify published policy/request paths before final declarations.
5. Keep production publication, effective dates, signing, upload and Console submission on HOLD pending their specific approval and evidence.

No authorization denial occurred in this review. No prohibited or unapproved action was attempted. All remaining holds are evidence/decision gates, not claims that preparation failed.

## Final Console/device addendum

Reviewed `PLAY-CONSOLE-READINESS-MATRIX.md` and validated `PHYSICAL-RESULTS-TEMPLATE.csv`: 144 rows, all NOT RUN. No physical success invented.

Independently retrieved current [API policy](https://support.google.com/googleplay/android-developer/answer/11926878): ordinary new/update submissions target API36 from August 31, 2026. The inspected source is configured accordingly; this is not a fresh signed-artifact result. Independently retrieved [new personal-account testing rules](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en): 12 continuous opted-in testers for 14 days precede production-access application when applicable. Actual account applicability remains unknown and two test devices cannot meet that tester requirement by themselves.

Current [Play signing help](https://support.google.com/googleplay/android-developer/answer/9842756) does describe default quantum-ready hybrid enrollment for new apps. Report correctly treats that as current documentation, not evidence of this app's enrollment/certificates. Avoid relying on older single-key assumptions at eventual setup. No signing step is approved or completed here.

[Preview-asset guidance](https://support.google.com/googleplay/android-developer/answer/9866151) distinguishes mandatory asset specifications from recommendation/promotion guidance. C14 preserves this distinction; 1080p promotional screenshots must not be mislabeled as universal basic listing minimums. Audience, gambling, age, export and regional legal conclusions remain qualified/reused audit findings rather than new blanket legal clearance.

Device corrections accepted: target registration is unknown, not proved absent. The original US Samsung URL redirected to generic support during independent review; replacement [SM-T220 official model page](https://www.samsung.com/sec/support/model/SM-T220NZAFKOO/) independently confirms GPS/Glonass/Beidou/Galileo. This establishes regional model capability, not the exact owner's regional unit, installed OS or a witnessed location fix.

Console C06 correction applied by reviewer after the author completed: reservation/registration status is unverified, replacing the unsupported “not reserved.” All identified wording corrections are closed in the bound inputs; underlying release HOLD remains.
