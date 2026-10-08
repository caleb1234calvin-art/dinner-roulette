# Seasonal Listing Contract Phase 1 — Independent Review

Review completed: 2026-10-08 02:26 UTC. Persisted: 2026-10-08 02:30 UTC.

## Verdict

**PASS for Phase 1 audit quality only.** This is not implementation, data-clearance, import or release PASS. No blocking factual correction was found. The proposal is sufficiently grounded for an owner contract decision, subject to the explicit implementation clarifications below.

This report preserves the review-time assessment. At review completion, owner acceptance and Phase 2 were pending. The parent subsequently reported owner acceptance of staged V1 at 02:29:51 UTC and authorization for Phase 2 data-only review. That later authorization does not change this report into implementation or data PASS; current continuity should record the later decision separately.

## Exact reviewed artifact and evidence

- Proposal: `Seasonal-Listing-Contract-Phase1.md`.
- Proposal SHA-256: `f71a81465c2da2bd8c2aa1ce16058c8ce560c94a6a585323ba1580359bfeda8c`, independently checked before review.
- Retained fixture output: sibling `current-behavior-probes.json`; inspected and independently reproduced using source-executed assertions.
- Fixture SHA-256: `e24406735454817f7ebbb2d528da4fd67d766903d025c5f360e50750f2207929`.
- Immutable source: [main 0bbf6758e94eea8129e21b004d4c36ff886cd46d](https://github.com/caleb1234calvin-art/dinner-roulette/tree/0bbf6758e94eea8129e21b004d4c36ff886cd46d).
- Source tree: `7add088fcbcacb8526f90a6f09c6dd7ca5249b3c`; sole parent `fd801eda9f496da33aa395ad2ad592027e16029a`.
- Canonical continuity: [3fc578d3d854f50e12cf2c4140956e3a313ed01b / AI_CONTINUITY.md](https://github.com/caleb1234calvin-art/dinner-roulette/blob/3fc578d3d854f50e12cf2c4140956e3a313ed01b/AI_CONTINUITY.md), blob `194940868ca1c079e6bc1b680070e723483c9b8b`.

Fresh GitHub and Vercel reads at approximately 02:26 UTC independently confirmed main/tree and continuity identity. Both explicit deployment-ID lookup and live `pickforus.app` lookup resolved to `dpl_H655TNrL3hSuBNF8w2xp4MpxspkM`, READY, production, Git/main at exact `0bbf6758e94eea8129e21b004d4c36ff886cd46d`. The deployment listed all five expected aliases. The apex was checked directly; this review does not claim a fresh independent resolution of every other alias or a production browser/full-fixture rerun. No drift was found.

The read-only checkout matched the source commit/tree and remained clean. No repository code, data, dependency, deployment, environment or setting was changed.

## Source assessment

The important source claims are supported:

- `src/lib/date-night/availability.ts` and `eligibility.ts` already permit unknown-hours ordinary browsing while Open Now requires supported open eligibility.
- `types.ts` defaults Open Now Only to true; the proposal appropriately preserves saved preferences and the existing discoverability affordance.
- Missing exact admission price is not an eligibility blocker.
- `Restaurant`/`DateNightPlace`, search, radial ownership, decoration and selection depend on coordinates. Address-only records cannot safely be slipped into those paths with null, NaN or invented coordinates.
- `src/lib/location/maps.ts` prefers coordinates; `rideshare-quick-actions.tsx` independently sends coordinate dropoffs to Uber. Approximate placement therefore needs explicit navigation handling beyond Directions alone.
- `identity.ts` can collapse nearby same-type records without matching names. Approximate geocodes require identity safeguards and preservation of curated provenance through merge/cache order.
- The generic hours parser can ignore unparsed fragments and uses the browser-local clock, so it cannot establish authoritative seasonal Open Now from partial text.
- Legacy bounded calendars without `endsAt` can become browseable schedule-unconfirmed records in later years. The two shipped records have hard `endsAt` bounds and remain protected.
- The existing note component repeats all notes. Compact presentation can reduce repetition while retaining material dates, restrictions, special hours and activity locations.

Independent Node 24 source-executed assertions reproduced unknown-hours browse=true/OpenNow=false, legacy no-endsAt 2027 browse=true, hard-expiry 2027 browse=false, coordinate-first Directions and address fallback. These are current-behavior probes only, not tests of an implemented new contract. No full test suite, browser acceptance or new-contract implementation test was run or claimed.

## Required implementation clarifications

1. **Minimum staged scope:** Use the existing radius path first for records with supported approximate placement, address-based Directions, compact notices and lifecycle guards. A new distance-unknown catalog is additional optional UI, not a prerequisite to factual clearance. Address-only cleared records awaiting UI support must remain distinct from factual HOLDs. This staging does not claim full address-only runtime delivery.
2. **Date-only expiry and year guard:** A known final date without closing time expires at the next local midnight in the venue's timezone. This is a retention rule, not invented midnight operating hours. Invalid or malformed dates/timezones fail closed. The independent season-year guard uses the same venue timezone and remains effective after revalidation is overdue. Known earlier end/cancellation evidence overrides an editorial ceiling.
3. **Approximate identity safety:** Approximate/approximate and approximate/verified merges both require affirmative identity evidence. Shared address, approximate point or activity type is insufficient. Confirmed aliases may merge; distinct operators/events must survive. Test both merge orders and cache/completion order, preserving lifecycle, hours policy and navigation provenance.
4. **Ride semantics and accessibility:** For generic Uber launch, update the accessible label as well as the URL so it does not promise a prefilled venue destination. Approximate placement must not masquerade as a precise dropoff. Preserve unrelated ordinary-mode navigation and ride behavior.

## Scope and next gate

The proposal covers the minimum schema, runtime, UI, Open Now, Directions, lifecycle, testing and migration-risk areas without requiring a global nullable-coordinate rewrite, new scheduling engine, provider work or database migration. It preserves unknown facts, exact supported special conditions and the two released records' conservative Open Now policy.

At review time Phase 2 remained gated on owner acceptance. Subsequent owner acceptance is recorded separately in continuity. Any authorized Phase 2 review must separate factual clearance from spatial readiness and return actual evidence-based outcomes. This review reclassifies none of the 26 HOLDs, authorizes no import, and confers no release approval. Production H655 remains undisturbed.
