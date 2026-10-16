# Privacy/Terms paragraph evidence map — 2026-10-16

Baseline source c3208d9fdc9a21d698efa9254be1286f5d3d2836; audit bb3f1436b0b21e03588ad4f2a2a3ff3e02f4bf31. Source snapshots are reused from play-compliance-2026-10-16/privacy/source and audit manifest, not represented as newly executed app behavior. Candidate author must compare unchanged input hashes before adoption.

## Privacy sections
- scope: current owner directive supplies Caustic Relay / Pick For Us and causticrelay@gmail.com; legal status remains owner-dependent. capacitor.config.json server.url establishes remote hosted shell.
- location paragraph 1: src/components/location-control.tsx and src/lib/location/controller.ts single requested getCurrentPosition; enableHighAccuracy false, no coordinate coarsening, not a precision guarantee. Not a dynamic background trace.
- location paragraph 2: src/lib/restaurants/geocode.ts search q and reverse lat/lon, restaurants/search.ts, overpass.ts and date-night/search.ts/nightlife/search.ts recipients. Requests from server carry server connection identity plus query data, not demonstrated original-client IP forwarding.
- location paragraph 3: manual search logic and persistence; OS/browser permission revocation is separate from already-saved state. No promise all platforms expose identical controls.
- local: src/lib/store.ts persistence selector and cap 200; session-hints.ts; date-night/identity-receipts.ts; cache.ts TTL checked on use, not guaranteed deletion timer; native backup restrictions lack independently established OEM device-transfer behavior.
- controls: store.resetFilters, resetAllData, clearExclusions and session-hints.resetHints. ResetAllData preserves location/theme while clearing filters/mode/season state plus receipts and preference/history state. Candidate labels MUST be reconciled after source freeze.
- hosting: routes/__root.tsx Vercel script bootstrap; lib/analytics.ts and mode-home.tsx Mode Selected; provider-chain/hedged-provider diagnostic calls. Provider docs below support category examples, not actual configuration or guaranteed intake.
- resources: __root.tsx Google Fonts; scripts/grok-pwa-shared.mjs extension injection. Fresh /settings HTML 200 at 04:41:45 contains grok.com/grok-app-builder/extensions.js. Merely present does not establish any particular payload or AI email processing.
- external: location/maps.ts destination-only URL builders; ride link helpers; destination and requesting browser interaction go to external service. Starting GPS not explicitly encoded by inspected directions helper.
- support: owner-approved email and manual-handling intention. Owner-reported bot deletion conveyed via root from other conversation; not independently verified token revocation, third-party access inventory or historical deletion. No email sent by audit. Gmail provider docs below are generic, not mailbox-specific retention settings.
- accounts: auth/provider.tsx passthrough, auth/email-password.ts false; backend server scaffold present. Fresh unauthenticated GET /api/auth/get-session 404 (04:41:37), /api/auth/ok 404 (04:41:39); no login attempted. No standard auth route in baseline route tree. Does not establish no legacy records or universally absent auth exposure.
- retention/security: source HTTPS and native cleartext/mixed-content settings; provider/operator retention unresolved, contact request mechanism proposed not tested by sending mail.
- review/changes: explicit draft-state and proposed governance, not implemented or accepted promises.

## Terms sections
- service: existing discovery functions and owner support identity; no legal entity invented.
- listings: ListingCompletenessV1, seasonal lifecycle, approximate Directions semantics. Does not waive operator accuracy duties or legal rights.
- external: existing independency text and action links; affiliation qualification retained.
- responsible: existing nightlife/casino disclosure, no regulated sales/wagers found; no universal age threshold invented.
- privacy: draft /privacy route, mailto behavior; no forced consent UI planned. Subject to final implementation verification.
- availability: live provider-dependent code and local store; Google Play not publicly listed per owner.
- changes/review: proposals await owner/legal approval; no arbitration, liability cap or jurisdiction invented.

## Fresh official-provider sources inspected (2026-10-16)
1. https://vercel.com/docs/analytics/privacy-policy (last updated June 26, 2026): page/event categories; hash-based visitor identification; 24h visitor-session lifespan. Do not misstate as whole-analytics deletion or all-app anonymity. General docs, actual settings unknown.
2. https://vercel.com/docs/logs/runtime (redirect from /docs/observability/runtime-logs): plan-specific log availability windows (Hobby 1h, Pro 1d, Enterprise 3d, Observability Plus30d). These are product viewing retention windows, not blanket backup/platform deletion. No consumer draft number adopted.
3. https://vercel.com/legal/privacy-notice (redirect from /legal/privacy-policy): general provider notice, not operator's chosen project configuration.
4. https://osmfoundation.org/wiki/Privacy_Policy sections Personal data we receive automatically / Unrelated Third-Party-Providers: Nominatim service produces usage records; Overpass operators separate. 180-day Piwik detail must NOT become universal Nominatim or Overpass retention. No consumer period adopted.
5. https://fonts.googleblog.com/2022/11/your-privacy-and-google-fonts.html: official Google explanation of necessary request/IP receipt for hosted fonts. Original developers.google.com/fonts/faq/privacy redirects fonts.google.com/faq with no extractable content; limitation preserved.
6. https://policies.google.com/technologies/retention: generic deletion stages/exceptions; not an operator mailbox schedule or proof historical AI copies deleted.
7. https://support.google.com/mail/answer/7401?hl=en: Gmail Trash 30-day behavior after deletion; not a 30-day resolved-support retention policy. No operator timeframe adopted.

## Read-only observation limits
Web extraction of production auth/privacy paths failed; ordinary curl succeeded and original headers/bodies retained. Proxy HTTP/1.1 200 transport preamble is not origin status; use final HTTP/2 404/200. No cookie jar, credentials or account mutations. Browser/Android dynamic traces still required separately. Evidence hashes in evidence/SHA256SUMS.

## Owner confirmation update 04:42:12 UTC
Direct message Sentinel_71d29ebf8fc88191a073ed49276787e0 answered root's numbered questions: “1. Yes / 2. Until resolved, and yes / 3. Its a personal brand, im not sure how that actually works”. Root's question1 asked whether Grok mailbox access was disabled; question2 asked support retention/manual deletion; question3 asked trading name versus registered business/state/country. Therefore: disabled AI-mail access and manual deletion after resolution are owner-attested operational decisions, not independent account/session inspection. Personal brand confirmed; registered entity and jurisdiction not established. Support policy now describes owner handling/deletion without blanket no-AI or historical third-party-erasure guarantees. No contractual acceptance or production change inferred.
