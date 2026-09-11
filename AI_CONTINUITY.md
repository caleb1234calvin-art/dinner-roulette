# Dinner Roulette — AI Continuity

_Last updated: September 11, 2026_

## Project state

- Active app: Dinner Roulette V.3.
- Repository: `caleb1234calvin-art/dinner-roulette`.
- Current working branch: `feature/dinner-icon-pack-1`.
- Branch stack: `audit/national-casino-pass-1` → `legal/third-party-compliance-pass-1` → `feature/dinner-icon-pack-1`.
- Current branch therefore contains casino audit work, legal/compliance, Dinner icon implementation, California/Oregon/Washington runtime work, and Nevada Pass 22 reconciliation staging.
- `main` remains untouched unless Caleb explicitly requests a merge/direct change.
- ChatGPT is the only AI authorized to directly modify the repository unless Caleb explicitly authorizes another assistant for a named file.
- Dinner Roulette and the Jasper County audit remain interconnected.
- Compliance review surface: PR #28. Restaurant icon work: Issue #29. Startup ident remains isolated on draft PR #30 and is not part of this casino branch's release decision.

## National casino audit

**27 jurisdiction passes are complete and active. Nevada is Pass 22-in-progress and is not yet active.**

Recent completed runtime passes:
- California / Pass 19: 74 CGCC IDs accounted, 69 curated physical destinations active, five explicitly held/excluded/deduped. Runtime `src/lib/nightlife/casino-catalog-pass-19.ts`.
- Oregon / Pass 20: 10 current physical destinations active, including Ko-Kwel Medford Class II. Runtime `src/lib/nightlife/casino-catalog-pass-20.ts`.
- Washington / Pass 21: 30 current physical tribal casino destinations active: 28 visible WSGC directory properties + Shoalwater reconciliation exception + Elwha River Class II. Runtime `src/lib/nightlife/casino-catalog-pass-21.ts`.

Validation checkpoints:
- California wiring `468f861dc3421f708f368718b7a48c0ed93f2344` → workflow `34558916921` success.
- Washington wiring `5eeea6d56ab8eff958513215d489cbc0b7608498` → workflow `34565739203` success.
- Corrected Oregon + inherited Washington head `fa6fd94a2a3959aece0a9a339f6a8d58c69abaf5` → workflow `34566845887` success.
- Blocking gates are TypeScript, development build and icon verification. Inherited npm tests remain report-only and must not be described as a strict clean test gate.

## Nevada — Pass 22 reconciliation in progress

Nevada candidate discovery is complete and the audit has entered statewide reconciliation. **Do not create or activate `casino-catalog-pass-22.ts` until the final accounting/address/coordinate gates pass.**

### Authoritative framework

Primary authority is the Nevada Gaming Control Board. NGCB Statistics & Publications exposes Location Detail, Location Name and Address, Restricted/Nonrestricted Location and Nonrestricted Count reports. The public-report portal is `https://publicreports-gcb.nv.gov/`; the current nonrestricted-count workbook discovered for this audit is the June 30, 2026 report. NGCB revenue reporting provides the market segmentation used for reconciliation. NIGC and current tribal/operator evidence remain the independent cross-check for tribal/Class II destinations.

### Nevada audit artifacts

1. `audit/nevada-nonrestricted-casino-scope-2026-09-11.json` — authoritative scope/inclusion policy.
2. `audit/nevada-reconciliation-plan-2026-09-11.json` — 12-segment reconciliation plan.
3. `audit/nevada-strip-downtown-ledger-2026-09-11.json` — 40 candidate rows.
4. `audit/nevada-clark-outer-ledger-2026-09-11.json` — 49 candidate rows.
5. `audit/nevada-laughlin-ledger-2026-09-11.json` — 9 candidate/scope-review rows.
6. `audit/nevada-northern-markets-ledger-2026-09-11.json` — 45 northern-market rows.
7. `audit/nevada-balance-state-ledger-2026-09-11.json` — 10 conservative rural rows.
8. `audit/nevada-statewide-candidate-accounting-2026-09-11.json` — statewide accounting, now advanced from discovery into reconciliation.
9. `audit/nevada-tribal-crosscheck-2026-09-11.json` — first tribal/federal cross-check.
10. `audit/nevada-reconciliation-pass-1-2026-09-11.json` — first statewide decision pass and NGCB report-infrastructure checkpoint.

### Nevada accounting checkpoint

- Original candidate/scope-review universe: **153 rows**.
- Tribal cross-check adds **2 current physical destinations** that must be carried into final reconciliation: **Avi Resort & Casino** and **Moapa Paiute Travel Plaza / Moapa Tribal Casino**.
- Expanded Nevada decision universe: **155 rows**.
- This remains a decision universe, not the final runtime count.
- Wa She Shu Casino remains a status hold because federal/tribal-directory evidence and current closure reports conflict; do not activate without current authoritative/first-party operation confirmation.
- Palms Casino Resort does not receive a duplicate row merely because it is tribally owned; it remains the same physical off-Strip candidate.

### Decisions already resolved

- Exclude historical/closed: The Mirage, Tropicana Las Vegas, Texas Station, Fiesta Rancho, Harrah's Reno.
- The Cromwell is alias-only; current successor identity is The Vanderpump Hotel.
- Include in final reconciliation as current tribal destinations: Avi Resort & Casino and Moapa Paiute Travel Plaza.
- Hold pending current-operation confirmation: Eastside Cannery and Wa She Shu Casino.
- Bayshore Inn remains scope review.
- Dotty's and analogous restricted/retail/route-style gaming are excluded by default from the curated destination backbone unless a distinct destination-casino case is established.
- Palms remains one physical destination regardless of tribal ownership.

### Same-property identity rules still open

- Venetian / Palazzo: retain separately during reconciliation until active NGCB identity determines whether both should remain distinct runtime destinations.
- Wynn / Encore: same rule.
- Reno's ROW — Eldorado / Silver Legacy / Circus Circus: connected campus does not automatically justify collapsing distinct public casino destinations; resolve against active regulatory identity.

### Remaining Nevada activation gates

1. Resolve every candidate against current NGCB identity or an explicit tribal/federal exception.
2. Resolve remaining status/scope rows including Casino Royale, Eastside Cannery, Whiskey Pete's, Bayshore Inn, Alamo Casino, Red Drag Casino and rural Eureka ambiguity.
3. Finalize multi-casino campus identity/dedupe decisions.
4. Normalize every included physical address.
5. Perform property-specific coordinate QA for every surviving destination.
6. Produce final all-row accounting with no unexplained candidates, overlaps or omissions.
7. Generate Nevada runtime dataset and `casino-catalog-pass-22.ts`, wire `src/lib/nightlife/search.ts`, run blocking validation, then mark Nevada jurisdiction #28 complete only if all gates pass.

## Casino audit operating rules

- Government/regulator sources are preferred for roster/identity truth; operator/property sources are secondary for current branding and addresses.
- Nonrestricted gaming status alone is insufficient for Dinner Roulette destination scope.
- Restricted slot-only, route/distributed retail, online-only and ordinary retail gaming locations stay outside the curated backbone unless a distinct destination-casino justification exists.
- Coordinate provenance should be property-specific where possible; provisional points are corrected before completion.
- Explicit exclusions, dedupes, holds and uncertainty are preferable to invented certainty.
- Curated records supplement live OSM discovery rather than replacing it.
- National completion still requires all applicable jurisdictions plus a final cross-jurisdiction duplicate/alias/retirement sweep.

## Legal/compliance continuity

Goal: risk reduction while preserving the product; do not describe Dinner Roulette as guaranteed legally compliant.

- Independent discovery/decision tool; third-party names identify destinations/services without implying affiliation.
- External links are third-party destinations with safe external-link behavior.
- Hours, prices, ratings, admission and availability are verify-first facts, not guarantees.
- Casino/nightlife is discovery/trip planning only; Dinner Roulette does not accept wagers, provide gambling, sell alcohol or guarantee admission.
- `LEGAL.md` exists and legal/privacy/third-party information is surfaced in Settings.

Rideshare: neutral Dinner Roulette treatment, no copied Uber/Lyft trade dress, visible `Drive sober`; Uber uses destination-aware `m.uber.com`; Lyft uses conservative `ride.lyft.com`; both are independent third parties.

Delivery: DoorDash, Grubhub and Uber Eats shortcuts open independent service home experiences. User searches manually. Do not claim marketplace availability, scrape marketplace content or use unsupported merchant/order deep links.

## Restaurant icon system

Issue #29. Third-party restaurant logos/brand artwork are replaced in active Dinner presentation with Dinner Roulette-owned generic cuisine/category icons while factual restaurant names remain text.

- Visual language: realistic claymation/tactile miniature food objects, rounded-square tile, no text/logos/mascots/packaging/brand marks, cyan/teal-left + burnt-orange/terracotta-right luminous edge, charcoal dark tile / pearl light tile.
- 15 semantic categories per theme / 30 canonical assets: `burger`, `pizza`, `mexican`, `chinese`, `japanese`, `italian`, `steakhouse`, `bbq`, `chicken`, `cafe-bakery`, `dessert`, `seafood`, `buffet`, `breakfast`, `fallback`.
- Layout: `public/dinner-icons/dark/<category>.jpg` and `public/dinner-icons/light/<category>.jpg`.
- Resolver: `src/lib/restaurants/dinner-icons.ts`; Dinner shortlist/options and final results use local icons. Date Night/Nightlife artwork remain separate.

## Validation / maintenance

Workflow `.github/workflows/validate-icon-pack.yml` runs on `feature/dinner-icon-pack-1`. Blocking gates: dependency install, `tsc --noEmit`, development client/SSR/Nitro build and 30-icon verification. `npm test` remains `continue-on-error: true` due inherited template debt.

Known template debt includes `.grok/skills/og/SKILL.md` / `.grok/skills/og/references/` documentation-contract tests. Do not fabricate placeholder docs solely to make those tests green. PWA metadata tests were isolated from the real Pick For Us identity using temporary fixtures.

## Merge discipline

Dependency/load order: `audit/national-casino-pass-1` → `legal/third-party-compliance-pass-1` → `feature/dinner-icon-pack-1`.

Preferred ship path remains a dedicated integration/compatibility branch: assemble dependency-aware updates, resolve overlaps, run combined TypeScript/tests/build/visual checks, then merge stable assembled state into `main` only after Caleb explicitly requests it.

`main` remains untouched.
