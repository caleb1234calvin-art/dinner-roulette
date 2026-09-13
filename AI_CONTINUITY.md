# Dinner Roulette — AI Continuity

_Last updated: September 12, 2026_

## Project state

- Active app: Dinner Roulette V.3.
- Repository: `caleb1234calvin-art/dinner-roulette`.
- **Current integration branch: `integration/active-work-pass-1`.**
- **Pass 48 candidate branch: `integration/pass-48-south-coffeyville`.**
- **Draft integration PR: #32, `Validate Pass 48 South Coffeyville`, targeting `integration/active-work-pass-1`.**
- `main` remains untouched unless Caleb explicitly requests a merge/direct change.
- ChatGPT is the only AI authorized to directly modify the repository unless Caleb explicitly authorizes another assistant for a named file.
- Dinner Roulette and the Jasper County audit remain interconnected.
- Keep continuity current while casino/audit work proceeds, not only at the end of a large phase.

## Active integration validation

`Validate Dinner Integration` is the compatibility gate. It performs dependency install, TypeScript checking, casino audit, inherited tests as report-only, development build, and Dinner icon verification.

**Pass 47 baseline:** Run 278 (`34711381563`) is green at commit `52320a46f2dee3b235943cd96acc4d99a7eae1d7`, validating the Pass 47 runtime baseline plus the evidence-only Red Dragon co-location resolution.

**Pass 48 candidate:** Run 280 (`34727233333`) is green at exact implementation/workflow head `be8d6e44520d0f647cb74611716d446a32f2e112` on `integration/pass-48-south-coffeyville`. All validation stages passed: dependency install, TypeScript, curated casino audit, inherited test report, development bundle build, and Dinner icon verification. This is the first exact-head green evidence for Pass 48. The present continuity-only commit follows that validated implementation head and does not alter runtime code.

PR #32 is open, draft, mergeable, and targets `integration/active-work-pass-1`; `main` is not involved. Do not treat a green integration run as authorization to merge to `main`.

The candidate also fixes validation trigger scope in `.github/workflows/validate-icon-pack.yml`: pull requests targeting either `main` or `integration/active-work-pass-1` can invoke `Validate Dinner Integration`. Validation steps themselves were not weakened or removed.

## Deployment status and decision

Vercel is externally blocked by its build-rate-limit/upgrade condition. This is a hosting/deployment limitation, not a failed Dinner Roulette validation. GitHub Actions remains the active implementation/compatibility gate while the block persists.

**Do not upgrade Vercel solely to remove this development bottleneck.** Current casino/catalog work can continue through branch development, audits, typechecking, tests and development builds without a hosted deployment. Deploy only when a hosted preview/release is materially useful. Never describe un-published GitHub work as deployed.

## Casino reconciliation policy

Runtime casino passes are canonicalized chronologically in `src/lib/nightlife/search.ts`, with newer same-property records winning while historical catalog files remain preserved. Same ID within 0.35 miles is a reconciliation warning/latest wins; same ID at materially different locations is a hard failure; same normalized name within 0.35 miles is a reconciliation warning/latest wins; same normalized name at distant locations is preserved as distinct destinations with a warning. Coordinate plausibility and complete-jurisdiction expected-count checks remain hard gates.

Preferred cadence: `discover → verify → reconcile → batch clean destinations → implement → validate → continue discovery → re-audit prior batches`. Batches are planning units, not quotas. **Never weaken the evidence gate merely to increase runtime count.**

A current street address, generic map marker, routing destination, city centroid, nearby parcel, adjacent development parcel, or predecessor coordinate is not itself enough to authorize a numerical runtime point. Numerical coordinates must be traceable to the current destination/property.

## Runtime casino progress

Validated integration branch remains through Pass 47 until PR #32 is promoted, but **Pass 48 implementation itself now has exact-head green validation evidence**. The Pass 48 candidate imports/appends through Pass 48 and extends `scripts/audit-casino-catalog.mjs` through Pass 48.

Recent sequence: Pass 43 Wildfire on Fremont; Pass 44 Club Fortune North; Pass 45 The Nevada Casino & Bar, Battle Mountain; Pass 46 Bonanza Inn & Casino, Fallon; Pass 47 Coweta Casino Hotel, Oklahoma; **Pass 48 Cherokee Casino South Coffeyville, Oklahoma, candidate validated by Run 280.**

Across the current four-state audit scope, roughly 286 candidate records have been considered: Nevada universe 174, Oklahoma universe 77, Colorado runtime-complete 31, Texas runtime-complete 4. The difference between candidate-universe size and runtime count is mostly closures, duplicates, successors, nonqualifying records and already-resolved exclusions; it is not a queue of ~90 untouched casinos.

## Nevada — rolling, 107 active runtime destinations

Nevada's provisional audit decision universe remains 174 rows, not a final runtime count. Pass 22 contains the first 50 curated Nevada destinations. Later clean segments are added independently as evidence clears.

- Pass 32: +15, 50 → 65.
- Pass 34: +7, 65 → 72.
- Pass 35: +10, 72 → 82.
- Pass 36: +6, 82 → 88.
- Pass 37: +4, 88 → 92.
- Pass 38: +1, 92 → 93.
- Pass 39: +2, 93 → 95.
- Pass 40: +5, 95 → 100.
- Pass 41: +2, 100 → 102.
- Pass 42: Longstreet, 102 → 103.
- Pass 43: Wildfire on Fremont, 103 → 104.
- Pass 44: Club Fortune North, 104 → 105.
- Pass 45: The Nevada Casino & Bar, 105 → 106.
- Pass 46: Bonanza Inn & Casino, Fallon, 106 → 107.

### Recent Nevada clears

- `audit/nevada-wildfire-fremont-coordinate-qa-pass-17-2026-09-12.json` clears **Wildfire on Fremont**, 2700 E Fremont St, Las Vegas, at **36.1556,-115.1135**.
- `audit/nevada-club-fortune-north-successor-qa-pass-18-2026-09-12.json` clears **Club Fortune North**, 2757 Las Vegas Blvd N, North Las Vegas, at **36.2100482,-115.107488**. Poker Palace remains retired.
- `audit/nevada-battle-mountain-coordinate-qa-pass-19-2026-09-12.json` clears **The Nevada Casino & Bar**, 36 E Front St, Battle Mountain, at **40.6420387,-116.9344845**.
- `audit/nevada-bonanza-fallon-coordinate-qa-pass-20-2026-09-12.json` clears **Bonanza Inn & Casino**, 855 W Williams Ave, Fallon, at **39.473817,-118.786436**.

### Remaining Nevada frontier

- **Cadence Crossing Casino:** `audit/nevada-cadence-crossing-footprint-qa-pass-21-2026-09-12.json` quarantines legacy Jokers Wild coordinate `36.052,-114.99468`. Current operation at **920 N Boulder Hwy, Henderson, NV 89011** is strong. Nevada licensed-retailer evidence and current property reporting reinforce the operation/address, but the completed 2026 property still needs its own direct numerical point. Do not recycle a construction/legacy footprint merely because it routes nearby.
- **Red Dragon Sports Bar #201 / Red Dragon Casino, Elko:** `audit/nevada-elko-operation-qa-pass-16-2026-09-12.json` is a **coordinate-only hold** at **404 S 5th St, Elko, NV 89801**. Current county, licensing, tourism and directory evidence supports Red Dragon as the canonical current consumer-facing identity. Elko County assessor evidence associates the property with parcel `001-422-002` and casino use. Dotty's #214 is a co-located Nevada Restaurant Services concept/license at the same physical property and should not be emitted as a second routable destination. Still require a direct numerical parcel/building point before serialization.
- **The Pass Casino:** closure/renovation hold until reopening is independently confirmed.
- **Whiskey Pete's / Buffalo Bill's:** current closure exclusions. Primm Valley remains active separately. These may remain exclusions rather than become runtime additions.

Nevada remains rolling rather than statewide complete.

## Oklahoma — 50 on active integration; Pass 48 validated candidate makes 51

Oklahoma candidate universe remains 77. Pass 28 serialized 46 records; Pass 30 added Duck Creek and Checotah; Pass 31 added Artesian; overall Pass 47 added Coweta Casino Hotel, bringing the active integration runtime to **50 active audited destinations**.

### Pass 47 — Coweta Casino Hotel

`audit/oklahoma-coordinate-qa-pass-11-2026-09-12.json` clears **Coweta Casino Hotel** at **13185 Oklahoma 51, Coweta, OK 74429**, coordinate **35.97281,-95.66006**. Current first-party/post-opening lodging evidence establishes the completed operating property, and the coordinate comes from a direct current property-map marker tied to the Coweta hotel/casino listing rather than an intersection estimate, city centroid, nearby parcel, or predecessor point.

### Pass 48 — Cherokee Casino South Coffeyville

`audit/oklahoma-coordinate-qa-pass-12-2026-09-12.json` clears **Cherokee Casino South Coffeyville** at **1506 US-169, South Coffeyville, OK 74072**, coordinate **36.9825777,-95.6283822**. Cherokee Casino's current first-party property page exposes an embedded Google Maps link containing that exact numerical point for the current destination, satisfying the direct current-property coordinate gate.

`src/lib/nightlife/casino-catalog-pass-48.ts` serializes it; `src/lib/nightlife/search.ts` activates it on the candidate branch; `scripts/audit-casino-catalog.mjs` covers through Pass 48. Run 280 validates the exact implementation/workflow head. Promotion to `integration/active-work-pass-1` remains a separate repository action; `main` remains untouched.

### Remaining Oklahoma priority holds

The priority frontier is **three** properties. Repeated evidence sweeps have strengthened current operation/address identity, but have not yet produced acceptable direct numerical current-property coordinates. Do not convert that stronger identity evidence into guessed coordinates.

- **Lakecrest Casino and Hotel** — **1000 US HW 70 E, Ardmore**. Current first-party operation/address remains strong. The commercial-land point near **34.172006,-97.173354** identifies adjacent development land and remains excluded.
- **Lake Eufaula Casino Hotel** — **1045 Birkes Rd, Eufaula**. Current operator/current mapping identity and post-opening evidence support the new property. The former Creek Nation Eufaula Casino at **806 W Forrest Ave** is permanently closed; never reuse its legacy point for the new casino.
- **Creek Nation Casino Holdenville** — **211 E Willow St, Holdenville**. Current first-party operation/address remains strong. **35.083599,-96.401627** is a Holdenville city centroid, not the casino, and remains excluded.

## Four-state runtime snapshot

Active integration baseline before PR #32 promotion:
- Nevada: **107** active.
- Oklahoma: **50** active.
- Colorado: **31** active and complete.
- Texas: **4** active and complete.
- **Four-state total: 192 active destinations.**

Pass 48 candidate with exact-head green implementation validation:
- Nevada: **107**.
- Oklahoma: **51**.
- Colorado: **31**.
- Texas: **4**.
- **Four-state candidate total: 193.**

The unresolved working frontier is approximately seven named Nevada/Oklahoma cases, not dozens of untouched casinos. Several Nevada cases are closure/exclusion decisions and may never add to runtime. Colorado and Texas are maintenance/re-audit only.

## Colorado — runtime complete and green

Colorado's reconciled current Dinner Roulette set is **31 destinations: 13 Black Hawk + 6 Central City + 10 Cripple Creek + 2 tribal**. Address/property-coordinate QA and duplicate/alias reconciliation are complete in `audit/colorado-statewide-runtime-reconciliation-2026-09-11.json`. Colorado is maintenance/re-audit only.

## Texas — runtime complete and green, 4 destinations

Texas scope is four current physical tribal gaming destinations: Kickapoo Lucky Eagle Casino Hotel; Naskila Casino Livingston; Naskila Casino Leggett; Speaking Rock Entertainment Center. Coordinate QA is 4/4. The Leggett coordinate provenance is preserved as user-assisted current map-pin verification rather than misrepresented as first-party publication. Texas is maintenance/re-audit only.

## Legal/compliance continuity

Dinner Roulette is an independent discovery/decision tool. Third-party names identify destinations/services without implying affiliation. Casino/nightlife is discovery/trip planning only; Dinner Roulette does not accept wagers, provide gambling, sell alcohol, or guarantee admission. `LEGAL.md` and Settings carry legal/privacy/third-party information.

## Restaurant icon continuity

Issue #29 remains the original Dinner icon system: 15 semantic categories per theme / 30 canonical assets under `public/dinner-icons/{dark,light}/`, resolved by `src/lib/restaurants/dinner-icons.ts`.

## Caustic Relay / startup-ident continuity

Caustic Relay is the active working maker/publisher brand. The canonical black-mamba/scorpion hybrid creature is immutable unless Caleb explicitly requests redesign. Current startup asset is `public/brand/CAUSTIC_RELAY_ident-2.mp4`, wired by `src/components/startup-ident.tsx`.

## Future food-truck discovery

Food trucks remain a future dedicated mobile-venue pass. Distinguish live/serving now, scheduled today, and discovered nearby. Never roulette a stale registered address as though a truck is confirmed there.

## Merge discipline

`integration/active-work-pass-1` remains the compatibility/validation surface. Preserve historical branches as provenance. Do not merge integration or any feature branch to `main` unless Caleb explicitly requests it. After material runtime/integration changes, inspect `Validate Dinner Integration`. Continuity must remain current.

`main` remains untouched.
