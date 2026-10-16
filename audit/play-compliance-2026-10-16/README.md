# Pick For Us Google Play compliance investigation

16 October 2026 UTC

## Decision

**HOLD Google Play submission.** The current in-app privacy text is incomplete against the required pre-submission criterion. No existing Play publication breach is asserted. A release decision also needs evidence about actual data flows, the final signed Android candidate, private Play Console state, content declarations and asset rights. Missing evidence is not proof of a policy violation.

This investigation did not accept agreements, make Console declarations, create or use production signing credentials, upload an app, merge code, deploy, migrate, change production settings or execute a rollback. It is an evidence-based readiness review, not legal advice or a prediction of Google's approval.

## What is established

- **Confirmed FAIL, P0 submission blocker (pre-submission criterion gap; no existing Play publication or contract breach established):** the brief text in [Settings](https://github.com/caleb1234calvin-art/dinner-roulette/blob/c3208d9fdc9a21d698efa9254be1286f5d3d2836/src/components/settings-page.tsx#L32-L39) lacks privacy contact details, retention/deletion information and comprehensive handling disclosures. Google allows an in-app policy **link or text**; the defect is incomplete content, not the absence of a link alone. The separate Console policy URL was not inspected.
- **PASS for the inspected target requirement:** source targets Android API 36, which meets the ordinary-mobile new-app/update floor effective 31 August 2026. Manifest and historical bundle checks are useful but do not establish final signed-release readiness.
- **QUALIFIED PASS within reviewed scope:** casino discovery has no identified wager, deposit, gambling-account or prize flow. Casino venue discovery does not by itself establish a gambling-license requirement or mandatory 18+ targeting. Final destinations, listing, ads, audience and rating still need review.
- **HOLD:** Data Safety answers, precise/approximate location handling, provider retention, account-creation applicability, final metadata/rating, ownership evidence, signing enrollment/certificates, package history and product-level export conclusions remain unresolved.
- **P2 engineering risks:** production use of Capacitor's remote server setting, broad FileProvider paths, Android 12+ transfer rules and upload-certificate verification need documented decisions or isolated corrections. No exploit or automatic Play prohibition was demonstrated.

The policy basis and code evidence are in the [full requirement matrix](REQUIREMENTS-MATRIX.md). Its [JSON version](REQUIREMENTS-MATRIX.json) preserves source findings, original classifications and reviewed qualifications.

## Exact scope and evidence limits

Audited source is main **c3208d9fdc9a21d698efa9254be1286f5d3d2836**, tree **c36112156cd11baefb6671194f0d59b9c181c2a3**. The 02:59:40 UTC provider readback binds READY deployment **dpl_FMS2SBg4ymuDwU4avpywV6yB5vg6** to that main commit. Production has 92 curated identities. This is a read-only baseline, not a new production smoke test or approval.

The inspected historical AAB comes from PR #75 source **91896a2b8c086b7d86b831c462e158fe04e6c00d**, SHA-256 **4cead0e51c28e90e5a0d42149e3952690d19a4f61f05bae1cacf55c6c3b5e4ee**. All 55 inventoried native/build/npm inputs match main. This is bounded native-input parity, not a fresh build of main or proof that PR #75 web changes are deployed. The shell loads an independently mutable HTTPS application. The unsigned artifact is honestly labeled development evidence and is not upload-ready.

Source and live Settings observations establish the privacy-text defect. Source/DOM evidence establishes analytics and external script integration, but not successful intake, exact production payloads, retention or processor roles. `enableHighAccuracy:false` is not proof of approximate-only location: source forwards returned coordinates without rounding. Actual Android behavior was not exercised.

No source correction was made. An accurate policy requires real owner contact, retention, provider and operational facts; placeholders would conceal rather than resolve the problem. The current package is technically coherent. Renaming it without its owner decision and Console history would create unnecessary identity risk. Isolated candidates should follow the decisions below.

## What to do next

1. Supply the privacy/contact/retention/provider facts and validate runtime data flows. Then prepare an isolated privacy/transparency candidate and independently review it.
2. Decide the exact Android package after checking existing private Console history. The brand-only recommendation is **app.pickforus.android** if this is genuinely a first registration, the owner controls the brand/domain and the identifier is available. Keeping **com.calebcalvin.pickforus** is valid; it is not a compliance defect.
3. Complete the [owner decisions](OWNER-DECISIONS.md) and [declaration evidence](DECLARATION-EVIDENCE.md). The report contains no pre-filled legal or Console certification.
4. Select a final native artifact plus hosted deployment and run the [independent acceptance plan](ACCEPTANCE-PLAN.md). Signing, Console acceptance and upload require separate owner-controlled authorization.

The [data-flow inventory](DATA-FLOW-INVENTORY.md) and [package change inventory](PACKAGE-IDENTITY-DECISION.md) provide concrete preparation detail.

The [prioritized remediation plan](REMEDIATION-PLAN.md) separates proven defects, evidence gaps and hardening. P0 means a critical submission blocker, not a security incident. Every applicable P1 gate also needs closure before submission.

## Sources and independent challenge

All seven owner-supplied links were investigated. The Academy URL exposed its dated landing page but requires login to launch the course. The exact English signing-help URL failed direct retrieval; official English/no-query and en-GB pages loaded, and indexed exact-URL text was corroborated. Neither gap is silently treated as full direct retrieval. See the [source inventory](SOURCE-INVENTORY.md) for versions, sections, conflicts and evidence limits.

The independent review upheld the privacy defect and narrowed overbroad interpretations of analytics, location, account deletion, casino discovery, WebViews, historical artifacts, package identity, signing and export obligations. [Independent review and acceptance qualifications](INDEPENDENT-REVIEW.md) records those decisions. Overall readiness remains HOLD.

## Existing work remains unchanged

PR #75 remains draft and unmerged at **91896a2b8c086b7d86b831c462e158fe04e6c00d**, with its existing chooser-heading/help viewport-visibility HOLD. This audit does not clear or enlarge that finding. The separate original evidence and recovered 20-record factual packet remain preserved. Halloween additions remain optional and parked; no backlog was restarted and no records were promoted.

Only deployment-excluded continuity documentation is eligible for publication after final review. The legacy `continuity/release` route remains untouched because it could trigger deployment. No future release is approved by this report.
