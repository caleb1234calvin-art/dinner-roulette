# Pick For Us — Seasonal Listing Completeness Policy Revision #1
## Phase 1 product/schema audit; proposal for independent review and owner acceptance

Date: 2026-10-08 UTC. Scope: read-only product/schema audit. No application implementation, data re-clearance, import, repository edit, merge or deployment. This document proposes a contract; it does not confer import clearance on any existing HOLD.

## Recommendation

Adopt a listing-evidence contract separate from operational completeness. A verified current seasonal listing needs identity, current 2026 seasonal evidence, a supported activity, a usable visitor address or stronger arrival evidence, and a hard 2026 expiry. Exact prices, complete hours and surveyed parking geometry are not listing prerequisites. Unknown facts stay unknown.

Most of the unknown-hours/unknown-price browsing behavior already exists. The minimum runtime change is explicit provenance and state handling, address-preferred navigation for approximate coordinates, concise presentation, and guaranteed hard expiry. The largest design decision is how genuinely address-only records appear in a product whose current discovery and picking are radius-based. Do not solve that by inventing coordinates or pretending a statewide result is nearby.

## 1. Fresh baseline and source binding

At 02:20:55–02:21:06 UTC, direct GitHub/Vercel reads established:
- Main: 0bbf6758e94eea8129e21b004d4c36ff886cd46d.
- Main tree: 7add088fcbcacb8526f90a6f09c6dd7ca5249b3c; sole parent fd801eda9f496da33aa395ad2ad592027e16029a.
- Current apex production: dpl_H655TNrL3hSuBNF8w2xp4MpxspkM, READY, Git main at exactly 0bbf; all five expected aliases listed.
- Canonical continuity branch integration/continuity-refresh-2026-10-07: 3fc578d3d854f50e12cf2c4140956e3a313ed01b. Fresh file read confirmed newest SHIPPED entry, blob194940868ca1c079e6bc1b680070e723483c9b8b.
- Local clean read-only source checkout matched main SHA/tree. No baseline drift.

The continuity explicitly closes the released two-record web slice, keeps 26 data HOLDs, Android physical acceptance HOLD, and the consumed one-release unprotected-main exception. The new owner policy authorizes this proposal and supersedes the old exact-arrival-completeness requirement for future accepted-contract reviews; it does not silently change old verification verdicts.

All source references below are pinned to https://github.com/caleb1234calvin-art/dinner-roulette/tree/0bbf6758e94eea8129e21b004d4c36ff886cd46d . Continuity reference: https://github.com/caleb1234calvin-art/dinner-roulette/blob/3fc578d3d854f50e12cf2c4140956e3a313ed01b/AI_CONTINUITY.md .

## 2. Current behavior and actual gaps

1. `src/lib/date-night/availability.ts:90-118` already makes hours-unknown, upcoming-season and schedule-unconfirmed browseEligible; Open Now requires status=open-now. `eligibility.ts:37-59` independently gates radius, preferences/exclusions, browse eligibility and Open Now. Thus missing hours need not exclude ordinary picks today when Open Now is off.
2. `types.ts` defaults Open Now Only to true. The new policy must not silently turn it off or erase the user's saved setting. `date-night-home.ts:380-388` already suggests turning it off when seasonal results are empty; retain and clarify this discoverability affordance.
3. Price is not a Date Night eligibility condition. Both shipped records already use priceLevel=null. Optional qualified admission facts currently live in verbose text, not normalized ticket fields.
4. `Restaurant` requires numeric lat/lon (`src/lib/restaurants/types.ts`); `DateNightPlace` extends it. Search localWithin (`search.ts:132-136`), radial ownership (`radial-plan.ts:82`), radius clipping (`radial-cache.ts`), decoration and distance sorting, coverage counts and weighted picking all require coordinates. Null, NaN, zero or city-centroid stand-ins would break or misrepresent this chain.
5. `src/lib/location/maps.ts:4-17` always chooses numeric coordinates before address. Adding an address-geocode alone would currently route to that approximate point. The helper is shared by nonseasonal modes, so change only an explicit seasonal navigation override, preserving existing defaults elsewhere.
6. `rideshare-quick-actions.tsx` also sends coordinate dropoffs to Uber. A Directions-only fix would leave approximate geometry exposed through another navigation action. Address-only/approximate seasonal records should use a generic external ride-service launch rather than asserting a precise dropoff unless an appropriate independently verified destination is available.
7. `SeasonalVisitNotes` renders every note in options, result and plan; surrounding components add repeated hours warnings. Current Lloyd notes are seven paragraphs and Sam five. One shared compact notice can replace repeated caution text without deleting supported event dates, material admission/access restrictions or activity-specific locations.
8. `availability.ts:54-76` expires endsAt before revalidation. But a legacy bounded calendar without endsAt becomes schedule-unconfirmed in the next year and remains browseEligible. This is a source-confirmed hole for a broader strict no-rollover contract; the two shipped imports already carry endsAt and remain protected.
9. `identity.ts:46-104` prioritizes catalog snapshots, merges OSM hours unless openNowPolicy=never, and deduplicates by near points (including shared type within0.03mi without same name). Approximate geocodes can collapse distinct tenants/events; approximate placement must not become identity proof. New state/provenance must survive duplicate merges and cache traversal.
10. The generic hours parser drops unparsed segments and uses browser-local clock (`restaurants/hours.ts:88 onward`). It is not sufficient authority to promote partly parsed seasonal marketing text, multi-location event hours or timezone-shifted schedules to verified Open Now.

## 3. Proposed data-state model

Use a curated seasonal record model upstream of the existing spatial DateNightPlace adapter. Keep stable IDs, source links and checked timestamps. Do not relax shared Restaurant coordinates globally as a shortcut.

Required listing fields:
- stable record ID, venue/event identity, operator identity where needed, supported seasonal category and optional supported subtype;
- `seasonYear: 2026`, `seasonEvidence` with source URL(s), checkedAt and a concise claim scope proving relevant 2026 operation;
- `visitorAddress` with human-usable street/locality/region (postal code only if supported), address provenance and confirmation that this is for visitors rather than billing/mail;
- or stronger documented arrival evidence where a street address genuinely does not exist;
- lifecycle with mandatory `listingExpiresAt` and timezone, cancellation/not-operating/closed flags, and supported exact dates/date ranges when known;
- contract/review revision identity so older projections cannot masquerade as newly cleared.

Optional location/navigation fields:
- `placement: null | {lat, lon, basis: 'address-geocode' | 'operator-site' | 'verified-arrival', sourceUrl, checkedAt, precisionLabel}`;
- `directionsTarget: {kind:'visitor-address', address} | {kind:'verified-point', lat, lon, description}`.
- A geocode needs an identified reproducible public/permitted source and an address/entity match. Arbitrary viewport/city centers, conflicting geocodes and fabricated decimals are not acceptable approximations. Geocode output may preserve original numerical precision internally, but UI must call it approximate.
- No runtime geocoder/network dependency is required. Place geocoding in the later bounded data preparation/review step; no paid service or new key authorized here.

Hours state:
- `unknown`: no reliable seasonal hours; no machine schedule.
- `partial`: useful supported fragments or incomplete/unresolved seasonal schedule; optional display text, no machine schedule.
- `verified`: supported complete relevant hours with source/timezone/date scope; display text can be retained even when the runtime cannot evaluate them.
- Keep evidence completeness separate from machine evaluability: `openNowPolicy:'never' | 'verified-schedule'`. Unknown and partial must always be never. Verified text alone is not permission for machine evaluation.
- Minimum v1: keep all newly imported curated records never-OpenNow unless a separately tested, complete date-specific/timezone-correct machine schedule is provided and independently verified. Existing conservative Lloyd/Sam never policy remains unchanged. This avoids inventing a new scheduling engine simply to list venues.

Admission:
- null/unknown is valid. Optional sourced display claims only; no inferred free, priceLevel, all-in total, fee normalizing or extrapolated child pricing. Exact pricing is not required.
- Preserve supported material age/supervision/reservation/access restrictions compactly. A genuinely unresolved public-access question can remain material (e.g., is the claimed public activity actually private or invite-only); unknown dollar amount is not.

Record eligibility and placement eligibility must be different fields/verdicts. A valid visitor-address record may clear the listing contract without a coordinate. A bad identity, unsupported2026 operation, unsupported activity, unusable/conflicting visitor destination or absent lifecycle bound remains material HOLD.

## 4. Address-only records and radius semantics: explicit acceptance decision

Recommended minimum safe product treatment:
- All valid records can enter the curated listing registry with placement=null.
- A coordinate-bearing record uses the existing radius discovery/pick path. Approximate geocodes get an “Approx. X mi” distance label; distance is straight-line estimated from the placement, not a drive route or entrance distance. Radius filtering uses that same estimate and is described as approximate. Do not invent an accuracy interval or claim guaranteed inclusion near the boundary.
- A placement-null record must not enter Haversine math, radial patch ownership, distance-based weighting, map pins or “within N miles” counts. Display it in a clearly separate, explicit opt-in catalog view scoped by supported locality/region: “Distance unavailable” and address-based Directions. This is a visible listing, not a factual HOLD. Do not label that section local/nearby or auto-add it to radius picks.
- If random selection from that nonspatial view is desired, it must be an explicit separate “include distance-unknown listings” choice with clear scope and no distance weighting. Defer this additional interaction unless accepted; ordinary radius picking remains unchanged.
- A record with a reviewed address geocode becomes usable in ordinary browsing/picking without requiring entrance research. Report counts for factual clearance and spatial readiness separately in Phase2.

This adds a small address-only catalog surface and adapter, not a nullable-coordinate rewrite across Dinner/Nightlife. If the owner wants only the smallest radius-picker release first, explicitly accept staged delivery: publish only newly cleared records with supported approximate placement initially, retain address-only cleared records as awaiting UI support (not STILL HOLD for missing entrance). Do not describe staged scope as full delivery of the address-only-listing principle. Choose this tradeoff before implementation; do not conceal it in schema defaults.

## 5. Runtime/Open Now behavior

Decision order: invalid/unreviewed record -> excluded; closed/cancelled/not-operating -> excluded; hard expiry or wrong season year -> excluded; seasonal master toggle/window off -> excluded from seasonal surfaces; remaining valid record -> browsable, subject to user filters and spatial/nonspatial surface.

Within active listing lifetime:
- Upcoming known event: “Upcoming · [date]”, browsable, Open Now false.
- Known excluded date: “Not scheduled today”; browsable, Open Now false. Do not infer operating from the enclosing date range when an exact date set exists.
- Unknown hours: “Hours unknown”; browsable, Open Now false.
- Partial hours: “Hours partly confirmed” plus supported detail if useful; browsable, Open Now false.
- Verified hours that cannot be safely machine evaluated: show supported hours, “Check today's hours”; browsable, Open Now false.
- Only fully supported/evaluable current seasonal date+time+timezone can return Open Now true. Conflict, malformed schedule, unsupported parser segment or stale machine-hours review fails closed.
- Revalidation due is a freshness signal, not proof of closure or permission to roll to a new year. Within the hard lifetime, listing remains available under accepted evidence; machine Open Now is disabled until renewed. Keep known terminal cancellation/closure precedence.

Never use generic farm/park/shop business hours for a specific seasonal attraction. Merged live24/7 hours cannot override curated unknown/partial/never state. Do not change provider discovery guarantees or restart Overpass work.

## 6. UI treatment and navigation

Use the same compact seasonal component in result, options and plan:
- name/type and supported date/date range;
- one honest hours status;
- visitor address and approximate distance qualification when relevant;
- short material special condition(s), e.g., under18 supervision,21+, reservation required, supported special closing time;
- one linked notice: “Check the venue for current hours, admission, and weather updates.” Link to the authoritative operator/event page when supported.

Put longer supported schedule/fee/activity-location details in an accessible optional Details disclosure rather than repeating waiver paragraphs. Unknown admission can disappear entirely. Preserve Sam's distinct campground/store/grill windows and Lloyd's October31 exception; a generic notice is not a substitute for known material facts. Keep source/provenance/review mechanics in data/review artifacts, not a wall of visitor legalese. Remove duplicate per-overlay seasonal warnings while leaving appropriate ordinary-mode behavior intact.

Directions chooses explicit verified parking/entrance when supported; otherwise uses the visitor street address, preferably operator venue name plus address, URL-encoded. Approximate placement never silently wins over that address. An official venue-wide address for a multi-site event must not be represented as its exact activity point. Preserve supported arrival instructions when important. Same policy in pick/result/plan, saved-state reopen and rideshare paths. No unsolicited external navigation or user-location disclosure is part of this audit.

Keep Other Halloween / Fall's existing temporary Haunted House icon, label, seasonal toggle and Anything membership. No bespoke art or unrelated clipping cleanup is required.

## 7. Lifecycle behavior

Separate `listingExpiresAt` (product retention boundary) from `eventEndsAt` (supported activity fact). Never expose an editorial retention deadline as a confirmed event closing time.
- Known exact final activity end: expire at that instant; keep timezone and exact special hours.
- Known final date without time: expire at local midnight starting the following date, explicitly a date-only retention rule, not a claim of midnight closing.
- Current2026season evidence but no precise date boundaries: preserve unknown dates, apply an explicit conservative2026listing cutoff inside the approved seasonal product window; proposed ceiling is the end of November2 in venue timezone for this Halloween layer. This must be owner-accepted editorial policy and individually narrowed by any evidence of earlier end. Never present it as operator schedule.
- Closure/cancellation overrides all retention windows immediately upon reviewed evidence.
- A mandatory hard cutoff and seasonYear guard remain effective after revalidation becomes due and through all later years. Never recalculate2026dates into2027.
- Use the existing minute/focus/visibility clock to recompute eligibility, invalidate open overlays/picks after expiry and prevent cached data resurrecting a record. Retain historic source records outside runtime eligibility, not open-ended active listings.

## 8. Minimum implementation footprint and migration risk

Core likely paths: seasonal curated schema/catalog adapter; date-night types/availability/eligibility/identity; location/maps explicit target support; seasonal notes UI and its three overlays; rideshare coordinate guard; data audit validator/provenance projection; tests. A nonspatial catalog view is an additional consciously accepted UI scope. Existing acquisition/radial modules need guards only at adapter boundaries if placement-null stays outside their input type.

No database migration is required for static curated catalog additions. No dependencies, provider queries, Android/native config, signing, Play or Vercel settings need change. Keep stable IDs so preferences/visited/exclusions survive. Preserve existing two cleared projections' facts and conservative open policy while adapting representation. Do not reintroduce removed Myer's fallback as an incidental migration; it needs its own accepted-contract review and exact new projection.

Main risks: approximate geocode promoted to precise navigation; cross-venue dedupe on shared geocode; provider hours overruling curated unknown; address-only NaN behavior; shared Directions/rideshare regressions; invalid dates/timezones silently passing; stale-year browse leakage; loss of material notes during compaction; persisted picks resurrecting expired data; accidental change to existing Open Now user preference. Scope the new fields to curated seasonal records and use guarded adapters rather than global nullable Restaurant coordinates.

## 9. Required verification matrix

Data/schema: required identity/year/type/address-or-stronger-arrival/lifecycle; official postal versus visitor address; missing/invalid coordinates allowed only nonspatially; malformed or conflicting coordinates rejected from placement; unknown/partial hours and null admission valid; unsupported generated values rejected; exact date exceptions retained; timezone/ISO/cutoff validation.

Availability: ordinary browse unknown/partial allowed; Open Now rejects both regardless of raw isOpen; verified display-only remains fail-closed; complete machine schedule evaluated only with current date/timezone; upcoming/known off-day labels; overdue review; exact final instant; date-only midnight; unknown-date editorial cutoff; timezone edges/DST;2027andlater rejected; cancelled/permanentlyclosed excluded.

Identity/cache: both merge orders and completion/cache ordering preserve contract provenance, hours state, directions target, hard expiry, material notes; same address/geocode with distinct operator/event IDs does not collapse simply on shared type; confirmed aliases merge; lifecycle negatives remain dominant; no cached/reopened/resumed resurrection; Myer's trusted fallback remains absent unless explicitly re-cleared in a later batch.

Spatial/navigation: address-geocode routes by supported address, not numeric point; verified parking routes by accepted point; proper URL encoding; no undefined/NaN coordinates, distance or ride destination; no fake distance for address-only; no claiming those records in radius counts/coverage; approximate distance label; boundary filtering matches the documented estimate; no unrelated Dinner/Nightlife navigation change.

Browser: all existing19seasonal scenarios plus unknown/partial/verified-display-only; compact notice appears once per listing; supported special details accessible;320/390px readable content and reachable controls; seasonal on/off,Anything,Other,pick/options/plan,repeated open/close,Back,resume,cache,expiry; approximate-address Directions and ride behavior; address-only surface if accepted; images decode and existing notes/artwork constraints preserved.

Full exact-candidate gates remain lint0errors(existing6warnings disclosed),typecheck,full repository/application suite(current baseline757tests/fourinheritedskips, future counts explicit),focusedseasonal,dataaudits,build-before-compiledsecurity, migration-free production build/proof, hosted checks, browser acceptance and fresh independent verification. Ordinary npm run build chains db:migrate and must not be substituted for the safe route. No test rerun or browser/implementation PASS is claimed by this audit.

## 10. Audit validation performed and limits

Fresh source/continuity/production identity reads: PASS, no drift. Clean source inspection: complete for the above contract paths. Four source-executed fixtures using Node24 native TypeScript stripping confirmed: unknown hours browse=true/OpenNow=false; legacy no-endsAt2027browse=true; mandatory endsAt2027browse=false; coordinate-first Directions and address fallback. Results retained in current-behavior-probes.json. Initial existing test-loader attempt could not resolve TypeScript in this read-only checkout; no dependencies installed and no test assertions weakened. Native source import then succeeded. These fixtures are current-behavior evidence, not new-contract implementation tests.

Audit conclusion: proposal is technically grounded and feasible. Contract acceptance, implementation quality, independent verification and release readiness are all pending. No existing HOLD was reclassified and no estimate of newly usable records is asserted.

## 11. Owner decisions and next bounded task

Accept or revise these proposed product choices:
1. Visitor-address evidence clears listing; coordinate provenance is separate, address-geocodes permitted for approximate placement and address-preferred Directions.
2. Hours unknown/partial browseable, never Open Now; verified display-only also never until safely evaluable. Existing saved Open Now preference unchanged.
3. Hard lifecycle cutoff separated from schedule truth, including the proposed editorial end-of-November2 ceiling for2026records lacking exact end dates; exact evidence always narrows it.
4. Address-only delivery: recommended explicit distance-unknown catalog view, or explicitly staged radius-only runtime first with factual-cleared/address-only records awaiting UI support. No fake nearby inclusion.
5. Single compact notice plus optional factual Details; material known restrictions remain available.

After fresh independent review and owner contract acceptance, perform Phase2 against the existing26HOLDinventory and exact findings, not statewide rediscovery. For each return CLEARS UNDER NEW CONTRACT, STILL HOLD with exact actual blocker, EXPIRED, or REJECT, plus separate spatial readiness and source freshness. No exact entrance/price/hours completeness gate may be smuggled back in. Reopen decisive current sources only as needed, not exhaustive repeats. Newly expired events remain expired. Fresh independent data verification precedes import; small independently verified runtime/data batches require their own release decision. Production H655 remains undisturbed.
