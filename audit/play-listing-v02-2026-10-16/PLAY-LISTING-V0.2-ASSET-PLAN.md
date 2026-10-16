# Play Listing v0.2 asset plan and official requirements

Prepared 2026-10-16 UTC. Listing preparation only. This updates the existing Console readiness C13/C14 work; it does not reopen the compliance audit or authorize Console changes, registration, signing, upload or deployment.

## Reconciled baseline

Existing readiness and Data Safety proposals were read at continuity commit 67f7604ef7ddcad1cdcb3811e3502406ca95cb71. The readiness matrix already identified incomplete listing media/rights; no earlier published listing-copy artifact was found. The app is Pick For Us, the intended developer-facing brand is Caustic Relay, and the target package is app.pickforus.android. Package registration/migration and legal account identity remain separate from these display assets.

Current production remains the parent-verified c3208d9/FMS2 deployment. PR77 is unpublished. No proposed Privacy/Terms/support screen or other unpublished behavior may appear as released functionality. Prior desktop/browser audit images are engineering evidence, not verified Android phone listing captures.

## Text fields and independent copy review

Google's current fields allow 30 characters for the app name, 80 for the short description and 4,000 for the full description. Contact email is required. [L1]

- App name: Pick For Us — 11/30 characters
- Developer display brand: Caustic Relay — keep separate from the app title and verified legal account identity
- Original requested short: Find nearby food, date ideas, and nightlife. Pick one or see four options. — 74/80
- Recommended corrected short: Find nearby food, date ideas, and nightlife. Pick one or see up to four options. — 80/80
- Corrected full description independently reviewed: 1,804/4,000 characters, excluding its terminal newline

Counts include spaces and punctuation. The corrected short avoids promising four results when fewer qualify. It has zero spare characters; do not append punctuation or a trailing space.

The exact corrected full and short description supplied by the source reviewer were independently accepted for metadata/claims wording on 2026-10-16 at approximately 23:55 UTC. The full description does not repeat the short verbatim. It preserves geographic manual entry, explicitly logged history, some locally stored preferences, Date Night websites only where available, the internet-dependent runtime and variable data coverage. No unsupported ranking, price promotion, Google/provider endorsement, safety guarantee or unpublished PR77 functionality claim was identified. This is acceptance of the proposed copy within the reviewed scope, not submission approval or clearance of the remaining audit holds.

## Required export specifications

Icon: 512×512, 32-bit PNG, sRGB, at most 1024 KB. Export a full square without baking in an outer corner mask or drop shadow; Play supplies those. Internal artwork lighting is different from an outer asset shadow. [L4]

Feature graphic: 1024×500, JPEG or 24-bit PNG without alpha. Screenshots: JPEG or 24-bit PNG without alpha; 320–3840 pixels per dimension, long side at most twice the short side; at least two overall, up to eight per device type. Recommendation-format eligibility for apps calls for four or more 1080p screenshots in 9:16 portrait or 16:9 landscape. This is distinct from the basic publication minimum. [L2]

Proposed phone export standard: 1080×1920 opaque PNG, six evergreen images. Preserve raw originals. A tall 20:9 capture must not be stretched into 9:16 or cropped to hide core controls. Prefer a genuine suitable capture viewport; otherwise use a reviewed proportion-preserving composition, with clearly subordinate background and all important UI readable. Never manufacture UI. This composition choice is our plan, not a new Google requirement.

## Existing icon evidence

The current public/pwa-icon-512.png was retrieved at 67f7604ef7ddcad1cdcb3811e3502406ca95cb71, Git blob 68f15a0a4176371b4b85ef4462033c206234c42d. Direct PNG-header inspection confirms 512×512, 8-bit RGBA (32-bit), 407,901 decoded bytes. The image was visually reviewed: approved Pick For Us artwork occupies a full square; no Google ranking/deal/store badge was identified.

Its PNG chunks contain IHDR/IDAT/IEND, with no sRGB/iCCP profile declaration. This does not prove incorrect colors. Explicit sRGB export/verification remains a final export check. The approved source master is public/brand/pick-for-us-icon-master.jpg, blob 47a7fdd716a6b467e1592961452ccbe94b02d66d, 494,490 bytes. Do not redraw or replace the established icon just to prepare the listing. The separate maskable PWA icon is not automatically the correct Play-store asset.

Format suitability is not rights clearance. Creator/generation/license provenance remains to be documented.

## Feature graphic direction

Use the existing warm coral/teal visual language, with an evergreen food/activity/nightlife theme and a clear central focal area. Keep branding complementary rather than simply enlarging the app icon. Prefer original or documented licensed art. If UI is included, use genuine approved-build imagery. Avoid a device mockup, fake app controls, provider endorsements, rating stars, price/ranking claims or a dominant Halloween treatment. No graphic has been produced or approved yet.

Suggested working filename: feature-graphic-en-US-1024x500.png.
Suggested alt text: Pick For Us brings nearby food, date ideas, and nightlife choices together.
Final layout and factual alignment must be checked at small display sizes.

## Prioritized phone shot list

These are capture instructions, not screenshots already made. Use a real installed Android app connected to the approved hosted deployment. Record app/source version, package, device/OS, runtime deployment, locale, viewport, capture time and raw-image hash.

1. Dinner core experience. Show real location/filter and choice controls with a useful, verified non-sensitive city/location. No home GPS, notifications or account identifiers.
2. Dinner choices. Capture actual up-to-four options when available. Keep any real limitation/availability labels visible; do not add extra results or rewrite venue facts.
3. Date Night. Show evergreen activities and an actual choice/result. Do not imply matchmaking, bookings, or the unpublished PR77 legal UI.
4. Nightlife. Show actual venue-discovery categories/options in a general-audience presentation. No wagering, jackpots, intoxication promises or fabricated affiliate/booking flow.
5. A single-place result. Show the genuine details and external navigation controls. Website links must only be pictured where the actual supported mode/data exposes them; do not imply universal venue websites.
6. Favorites or explicitly logged history. Choose the clearer real screen. Do not imply every random pick is automatically recorded, cloud sync, persistent Nightlife filters, or automatic storage guarantees absent from the product.

Use minimal or no overlay captions. If a caption is necessary, keep it subordinate, consistent with actual UI and below 20% of image area. Add concise, localized alt text of 140 characters or fewer. Avoid stretching, unreadably small UI and unrelated notifications. [L2]

Slots seven/eight are optional. Seasonal imagery is supplemental only after the relevant content is live and useful, with an owner/date for replacement. Do not promote an October-only experience as the core year-round app.

Tablet, Chromebook, TV, Wear, Automotive, XR and video assets are deferred. Do not label phone or desktop images as tablet screenshots. Revisit genuine large-screen captures and applicable device-specific specifications if that distribution scope is chosen.

## Metadata and rights controls

The listing must describe current behavior accurately and remain appropriate for a general audience. Avoid keyword stuffing, unverified testimonials, rank/price/deal claims, misleading badges or implied Google/provider endorsement. Apply the same review to localized text and graphics. Caustic Relay branding does not establish organization registration or conceal required legal identity. [L3, L5]

Retain a rights ledger for every icon, illustration, font and visible third-party asset: exact file/hash, creator/source, creation/generation date and tool where relevant, license/terms version, commercial/promotional-use basis, required attribution, third-party marks and owner review. Original-work provenance may be enough where supported; do not invent permission documents or presume every factual venue reference requires a license. Downloaded imagery or an AI filename alone establishes neither ownership nor infringement. [L6]

Remaining unknowns: icon/master creation and licensing provenance, rights to any new feature-graphic elements, final screenshot source artifact and native capture evidence, final support contact/public URLs, final listing countries/locales, and owner-approved audience/rating answers. Existing audit holds remain unchanged.

## Asset acceptance checklist

- Exact identity, spelling and 30/80/4,000 counters verified
- Full-description claims match current-source review and released UI
- Icon dimensions/encoding/size/sRGB and small-size masking checked
- Feature graphic dimensions/opaque encoding/crop safety checked
- At least four target-quality phone screenshots, preferably all six planned shots, captured from the real app; this is the chosen quality target, not Google's basic two-image minimum
- Capture provenance and raw originals retained; no fabricated UI, unpublished PR77 feature or hidden material limitation
- Rights ledger and owner review complete
- Accessibility text and selected locales checked
- No submission-readiness GO inferred from copy or graphic preparation

## Official source inventory

All six pages were directly retrieved in English on 2026-10-16, approximately 23:50–23:51 UTC. No account, Console setting or browser state was changed.

L1. Create and set up your app — Product details; Contact details. No page-specific revision date displayed. https://support.google.com/googleplay/android-developer/answer/9859152?hl=en

L2. Add preview assets to showcase your app — App icon; Feature graphic; Screenshots; Requirements versus Highly recommended. No page-specific revision date displayed. https://support.google.com/googleplay/android-developer/answer/9866151?hl=en

L3. Metadata — Full Policy and examples. No page-specific revision date displayed. https://support.google.com/googleplay/android-developer/answer/9898842?hl=en

L4. Google Play icon design specifications — Attributes; sizing; shadows; corner radius. Page explicitly last updated 2026-06-15 UTC. https://developer.android.com/distribute/google-play/resources/icon-design-specifications

L5. Best practices for your store listing — App descriptions; title; graphics; screenshots; deceptive behavior. No page-specific revision date displayed. https://support.google.com/googleplay/android-developer/answer/13393723?hl=en

L6. Intellectual Property — Full Policy; Unauthorized Use of Copyrighted Content; Trademark Infringement. No page-specific revision date displayed. https://support.google.com/googleplay/android-developer/answer/9888072?hl=en

Do not confuse retrieval/crawl dates with an effective-policy revision. L2 explicitly separates required upload conditions from recommendations affecting promotional eligibility. Its general screenshot maximum and separate large-screen guidance differ; this phone-first plan avoids inventing a tablet requirement or applying XR file-size limits to phone images.
