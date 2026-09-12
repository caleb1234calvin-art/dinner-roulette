# Dinner Roulette — AI Continuity

_Last updated: September 12, 2026_

## Project state

- Active app: Dinner Roulette V.3.
- Repository: `caleb1234calvin-art/dinner-roulette`.
- **Current integration branch: `integration/active-work-pass-1`.**
- `main` remains untouched unless Caleb explicitly requests a merge/direct change.
- ChatGPT is the only AI authorized to directly modify the repository unless Caleb explicitly authorizes another assistant for a named file.
- Dinner Roulette and the Jasper County audit remain interconnected.
- Keep continuity current while casino/audit work proceeds, not only at the end of a large phase.

## Active integration validation

`Validate Dinner Integration` is the compatibility gate for the integration branch. It performs dependency install, TypeScript checking, casino audit, inherited tests as report-only, development build, and Dinner icon verification.

**Run 266 (`34675552971`) is green at commit `2e3412f5eadc448e00f6a84854ae6a7ac7406f19`, validating Nevada Pass 46 and the validator extension through Pass 46.** Every recorded step completed successfully: setup, checkout, Node setup, dependency install, typecheck, curated-casino audit, inherited test-suite report, development build, Dinner icon verification, and cleanup. Run 266 supersedes Run 260 as the current validated runtime baseline. A green run never authorizes a merge to `main` by itself.

The earlier complete-Texas manifest run failed because the audit script did not yet recognize pass files that express jurisdiction through a `JURISDICTION` helper constant. Commit `17e8206` generalized that path; later runs are green. This was audit infrastructure, not a Texas data failure.

## Casino reconciliation policy

Runtime casino passes are canonicalized chronologically in `src/lib/nightlife/search.ts`, with newer same-property records winning while historical catalog files remain preserved. Same ID within 0.35 miles is a reconciliation warning/latest wins; same ID at materially different locations is a hard failure; same normalized name within 0.35 miles is a reconciliation warning/latest wins; same normalized name at distant locations is preserved as distinct destinations with a warning. Coordinate plausibility and complete-jurisdiction expected-count checks remain hard gates.

Preferred cadence: `discover → verify → reconcile → batch clean destinations → implement → validate → continue discovery → re-audit prior batches`. Batches are planning units, not quotas. **Never weaken the evidence gate merely to increase runtime count.**

## Runtime casino progress

Casino runtime is **validated through Pass 46**. `src/lib/nightlife/search.ts` imports/appends through Pass 46. `scripts/audit-casino-catalog.mjs` enumerates through Pass 46. Run 266 validates the combined runtime green.

Recent Nevada sequence: Pass 32 +15 Laughlin/Reno-Sparks; Pass 34 +7 rural; Pass 35 +10 outer-Clark/Mesquite/Primm; Pass 36 +6 Boulder Strip/Henderson; Pass 37 +4 North Las Vegas/northwest; Pass 38 Jerry's Nugget; Pass 39 Skyline + Emerald Island; Pass 40 +5 Boulder/outer-Clark; Pass 41 Club Fortune Henderson + Rainbow Club; Pass 42 Longstreet; Pass 43 Wildfire on Fremont; Pass 44 Club Fortune North; Pass 45 The Nevada Casino & Bar, Battle Mountain; **Pass 46 Bonanza Inn & Casino, Fallon.**

California Pass 19, Oregon Pass 20, Washington Pass 21, and Nevada Pass 22 remain active. Later passes include Wisconsin/Idaho, Minnesota/Nebraska/Wyoming, South Dakota/North Dakota, Florida, New York, Oklahoma, Colorado, Nevada rolling additions, and Texas.

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
- **Pass 46: Bonanza Inn & Casino, Fallon, 106 → 107.**

### Pass 43 — Wildfire on Fremont

`audit/nevada-wildfire-fremont-coordinate-qa-pass-17-2026-09-12.json` clears **Wildfire on Fremont** at **2700 E Fremont St, Las Vegas, NV 89104**, coordinate **36.1556,-115.1135**. `src/lib/nightlife/casino-catalog-pass-43.ts` serializes it.

### Pass 44 — Club Fortune North

`audit/nevada-club-fortune-north-successor-qa-pass-18-2026-09-12.json` clears **Club Fortune North** at **2757 Las Vegas Blvd N, North Las Vegas, NV 89030**, coordinate **36.2100482,-115.107488**. Dated post-opening evidence confirms the former Poker Palace reopened in July 2026 after renovation as Club Fortune North at the same property. Poker Palace remains retired and must not be emitted in parallel.

### Pass 45 — The Nevada Casino & Bar, Battle Mountain

`audit/nevada-battle-mountain-coordinate-qa-pass-19-2026-09-12.json` clears **The Nevada Casino & Bar** at **36 E Front St, Battle Mountain, NV 89820**, coordinate **40.6420387,-116.9344845**. Current operation, county property/casino-use, gaming, and multiple exact-address point sources converge on the same property. `src/lib/nightlife/casino-catalog-pass-45.ts` serializes it.

### Pass 46 — Bonanza Inn & Casino, Fallon

`audit/nevada-bonanza-fallon-coordinate-qa-pass-20-2026-09-12.json` clears **Bonanza Inn & Casino** at **855 W Williams Ave, Fallon, NV 89406**, coordinate **39.473817,-118.786436**. Current Fallon licensing, Nevada gaming, Nevada tobacco, and Wyndham/property evidence support operation and address identity. Exact-address sources produced a hotel/casino point cluster and a nearby RV/camping cluster; the hotel/casino point was retained because Dinner Roulette routes to the destination rather than the RV sites. The unrelated Reno Bonanza coordinate is explicitly excluded. `src/lib/nightlife/casino-catalog-pass-46.ts` serializes it. Run 266 validates Pass 46 green.

### Remaining Nevada holds

- **Cadence Crossing:** opened March 25, 2026 and replaced Jokers Wild at 920 N Boulder Hwy, Henderson. Current operation/address is strong, but runtime remains held until a numerical point is tied directly to the new 2026 Cadence footprint rather than simply reusing legacy Jokers Wild geometry.
- **Red Drag / Red Dragon / Dotty's, Elko:** `audit/nevada-elko-operation-qa-pass-16-2026-09-12.json` is an identity-lineage-and-coordinate hold at 404 S 5th St, Elko. Unsupported old coordinates were removed. Present consumer identity and a direct property point must both clear before serialization.
- **The Pass Casino:** closure/renovation hold. Dated 2026 reporting overrides legacy current-looking pages until reopening is independently confirmed.
- **Whiskey Pete's / Buffalo Bill's:** current closure exclusions. Primm Valley remains active separately.

Nevada remains rolling rather than statewide complete.

## Colorado — runtime complete and green

Colorado's reconciled current Dinner Roulette set is **31 destinations: 13 Black Hawk + 6 Central City + 10 Cripple Creek + 2 tribal**. Address/property-coordinate QA and duplicate/alias reconciliation are complete in `audit/colorado-statewide-runtime-reconciliation-2026-09-11.json`. Colorado is maintenance/re-audit only.

## Texas — runtime complete and green, 4 destinations

Texas scope is four current physical tribal gaming destinations: Kickapoo Lucky Eagle Casino Hotel; Naskila Casino Livingston; Naskila Casino Leggett; Speaking Rock Entertainment Center. Coordinate QA is 4/4. The Leggett coordinate provenance is preserved as user-assisted current map-pin verification rather than misrepresented as first-party publication. Texas is maintenance/re-audit only.

## Oklahoma — 49 active runtime destinations, not complete

Oklahoma candidate universe remains 77. Pass 28 serialized 46 records; Pass 30 added Duck Creek and Checotah; Pass 31 added Artesian, bringing runtime to **49 active audited destinations**.

Priority Oklahoma holds remain **Lakecrest, Coweta, Lake Eufaula, Holdenville, and Cherokee South Coffeyville**. Current first-party operation/address evidence is strong for several, but no property is promoted until its direct numerical property point and remaining lineage/site questions clear. Never substitute a city centroid, nearby parcel, or an old closed-property coordinate.

## Legal/compliance continuity

Dinner Roulette is an independent discovery/decision tool. Third-party names identify destinations/services without implying affiliation. Casino/nightlife is discovery/trip planning only; Dinner Roulette does not accept wagers, provide gambling, sell alcohol, or guarantee admission. `LEGAL.md` and Settings carry legal/privacy/third-party information.

## Restaurant icon continuity

Issue #29 remains the original Dinner icon system: 15 semantic categories per theme / 30 canonical assets under `public/dinner-icons/{dark,light}/`, resolved by `src/lib/restaurants/dinner-icons.ts`.

## Caustic Relay / startup-ident continuity

Caustic Relay is the active working maker/publisher brand. The canonical black-mamba/scorpion hybrid creature is immutable unless Caleb explicitly requests redesign. Current startup asset is `public/brand/CAUSTIC_RELAY_ident-2.mp4`, wired by `src/components/startup-ident.tsx`.

## Future food-truck discovery

Food trucks remain a future dedicated mobile-venue pass. Distinguish live/serving now, scheduled today, and discovered nearby. Never roulette a stale registered address as though a truck is confirmed there.

## Merge discipline

`integration/active-work-pass-1` remains the compatibility/validation surface. Preserve historical branches as provenance. Do not merge integration or any feature branch to `main` unless Caleb explicitly requests it. After material runtime/integration changes, inspect Validate Dinner Integration. Continuity must remain current.

`main` remains untouched.
