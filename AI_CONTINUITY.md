# Dinner Roulette — AI Continuity

_Last updated: September 12, 2026_

## Project state

- Active app: Dinner Roulette V.3.
- Repository: `caleb1234calvin-art/dinner-roulette`.
- **Current integration branch: `integration/active-work-pass-1`.**
- `main` remains untouched unless Caleb explicitly requests a merge/direct change.
- ChatGPT is the only AI authorized to directly modify the repository unless Caleb explicitly authorizes another assistant for a named file.
- Dinner Roulette and the Jasper County audit remain interconnected.
- Caleb explicitly wants AI continuity updated continuously while casino/audit work proceeds, not only at the end of a large phase.

## Active integration validation

`Validate Dinner Integration` is the compatibility gate for the integration branch. It performs dependency install, TypeScript checking, casino audit, inherited tests as report-only, development build, and Dinner icon verification.

**Run 182 (`34667342671`) is green at commit `148d9878d86aa8696bde7c340b22eead27b85bf2`, validating Oklahoma Pass 30 runtime activation and casino-audit enumeration through Pass 30.** Typecheck, curated-casino audit, inherited test-suite report, development build and Dinner icon verification all completed successfully. This supersedes Run 175 as the current validated runtime baseline. A green run never authorizes a merge to `main` by itself.

## Casino reconciliation policy

Runtime casino passes are canonicalized chronologically in `src/lib/nightlife/search.ts` with newer same-property records winning while historical catalog files remain preserved. Same ID within 0.35 miles is a reconciliation warning/latest wins; same ID at materially different locations is a hard failure; same normalized name within 0.35 miles is a reconciliation warning/latest wins; same normalized name at distant locations is preserved as distinct destinations with a warning. Coordinate plausibility and complete-jurisdiction expected-count checks remain hard audit gates.

## National casino audit strategy

Preferred cadence: `discover → verify → reconcile → batch clean destinations → implement → validate → continue discovery → re-audit prior batches`.

For large jurisdictions, use 50–100 verified-destination runtime batches as a planning cadence, not a quota. Statewide perfection or an arbitrary round number is not required before a clean set enters staged runtime, but every activated property must clear current identity/operation, Dinner Roulette destination scope, normalized address, property-specific coordinates, stable ID, current website and duplicate/alias QA. Regulator license rows are evidence/accounting units, not automatically one-to-one with Dinner Roulette destinations.

## Runtime casino progress

Casino runtime is **validated through Pass 30**. `src/lib/nightlife/casino-catalog-pass-30.ts` adds the two Oklahoma destinations previously held only for street-number normalization; `src/lib/nightlife/search.ts` imports and appends Pass 30 to chronological `CASINO_PASSES`; `scripts/audit-casino-catalog.mjs` enumerates catalog files through Pass 30. Run 182 validates the combined activated runtime state green.

California Pass 19, Oregon Pass 20, Washington Pass 21 and Nevada Pass 22 remain active. Later passes include Wisconsin/Idaho, Minnesota/Nebraska/Wyoming, South Dakota/North Dakota, Florida, New York, Oklahoma and Colorado. Nevada remains pending/rolling.

## Nevada

Nevada's provisional audit decision universe is 174 rows, not a final runtime count. Runtime Batch NV-01 / Pass 22 contains 50 curated destinations. Remaining work includes Winnemucca/I-80, Stockmen's Fallon, Red Drag Elko, The Nevada Casino & Bar Battle Mountain, Longstreet address normalization, Buffalo Bill's/Whiskey Pete's operation state and rural completeness sweeps. Nevada progresses in parallel without blocking smaller states.

## Colorado — runtime complete and green

Colorado Division of Gaming accounting is 33 commercial regulator locations: 15 Black Hawk, 6 Central City and 12 Cripple Creek, plus two tribal casino resorts. Regulator rows are accounting/evidence units and do not automatically equal consumer destinations.

The reconciled current Dinner Roulette set is **31 destinations**: **13 Black Hawk + 6 Central City + 10 Cripple Creek + 2 tribal**. Address/property-coordinate QA is **31/31** and statewide stable-ID/duplicate/alias reconciliation is complete in `audit/colorado-statewide-runtime-reconciliation-2026-09-11.json`.

Black Hawk is **13/13**. Bally's East/North/West remain three separately routable physical destinations. Bigfoot is the current successor at the former Z Casino property; do not emit a parallel current Z destination. Horseshoe's final coordinate hold is resolved in pass 1c.

Central City is **6/6** for address and coordinate QA.

Cripple Creek is **10/10** for address and coordinate QA. `audit/colorado-cripple-creek-coordinate-qa-pass-1b-2026-09-11.json` clears the final four holds: Bronco Billy's, Chamonix, McGills and Golden Nugget. Bronco Billy's and Chamonix remain separately routable despite their integrated adjoining complex. FHR BILLY'S remains a regulator/accounting row only. Century's multiple regulator rows collapse to one consumer property. Golden Nugget is the current successor at the former Wildwood casino property; do not emit Wildwood separately or substitute the adjacent hotel as another casino destination.

The two tribal resorts, Sky Ute and Ute Mountain, remain coordinate-cleared.

`src/lib/nightlife/casino-catalog-pass-29.ts` contains all **31 reconciled Colorado destinations**. Pass 29 remains active and Run 182 confirms the combined runtime still validates green after Pass 30. Colorado remains runtime-complete for this audited destination set. Future Colorado work is maintenance/re-audit rather than a blocker.

## Texas — 4 current destinations; 3 coordinate verified

Texas scope is four physical tribal gaming destinations: Kickapoo Lucky Eagle Casino Hotel, Naskila Casino Livingston, Naskila Casino Leggett, and Speaking Rock Entertainment Center. Ischoopa Travel Center is excluded as travel-center gaming.

Coordinate QA now verifies **3 of 4**. Kickapoo Lucky Eagle is `28.61092,-100.44078` with current casino-facing address `794 Lucky Eagle Drive`; Speaking Rock is `31.690126,-106.326605` with current address `122 S Old Pueblo Rd`; Naskila Livingston is now cleared at `30.7142259,-94.6746959` for the current `540 State Park Road 56` address. The Livingston resolution is durable in `audit/texas-coordinate-qa-pass-2-2026-09-12.json`.

The sole remaining Texas coordinate hold is **Naskila Casino Leggett**, current temporary casino at `10314 US 59 N, Livingston, TX 77351`. Current first-party evidence confirms it is open on the future resort site, and property records independently corroborate the 10314 parcel. Do not substitute a nearby parcel centroid, smoke-shop/rest-area point, or the broader future-resort `10450 US-59` location unless direct evidence establishes it as the operating temporary-casino point.

Texas is not complete until Leggett clears direct numerical property-coordinate QA, all four destinations pass stable-ID/duplicate reconciliation, enter a later runtime pass, and validate green. Pass 30 is now occupied by the Oklahoma additions and must not be reused for Texas.

## Oklahoma — Passes 28 + 30 green with 48 runtime records

Oklahoma candidate universe remains **77**. Current identity/address QA reached **54** and property-specific coordinate QA reached **48**. Pass 28 serialized the first **46** runtime-eligible records while Duck Creek and Checotah were quarantined solely for street-number normalization.

`audit/oklahoma-address-normalization-pass-3-2026-09-12.json` resolves those final two Pass-28 quarantine holds. Duck Creek uses canonical runtime address **10071 Ferguson Rd, Beggs, OK 74421** with verified building coordinate `35.81431,-96.01402`. Checotah uses canonical runtime address **830 N Broadway St, Checotah, OK 74426** with verified building coordinate `35.48143,-95.52278`. Conflicting address variants remain preserved as provenance rather than silently discarded.

`src/lib/nightlife/casino-catalog-pass-30.ts` contains Duck Creek and Checotah. `src/lib/nightlife/search.ts` activates Pass 30 and the validator enumerates through Pass 30. **Run 182 is green**, so Oklahoma now has **48 active audited runtime destinations**.

Oklahoma remains intentionally not marked statewide complete. Artesian, Lakecrest, Coweta, Lake Eufaula, Holdenville and Cherokee South Coffeyville remain outside the current runtime set for coordinate/current-site or lineage holds. WinStar preserves ID stem `winstar`; Choctaw Durant preserves `choctaw-durant`.

## Legal/compliance continuity

Dinner Roulette is an independent discovery/decision tool. Third-party names identify destinations/services without implying affiliation. Casino/nightlife is discovery/trip planning only; Dinner Roulette does not accept wagers, provide gambling, sell alcohol or guarantee admission. `LEGAL.md` and Settings carry legal/privacy/third-party information. Rideshare/delivery integrations remain neutral shallow launches unless an authorized provider integration says otherwise.

## Restaurant icon continuity

Issue #29 remains the original Dinner icon system: 15 semantic categories per theme / 30 canonical assets under `public/dinner-icons/{dark,light}/`, resolved by `src/lib/restaurants/dinner-icons.ts`.

## Caustic Relay / startup-ident continuity

Caustic Relay is the active working maker/publisher brand. The canonical black-mamba/scorpion hybrid creature is immutable unless Caleb explicitly requests redesign. Current startup asset is `public/brand/CAUSTIC_RELAY_ident-2.mp4`, wired by `src/components/startup-ident.tsx`, compatibility-validated by green Run 103 and still passing the current Run 182 integration build.

## Future food-truck discovery

Food trucks remain a future dedicated mobile-venue pass. Distinguish live/serving now, scheduled today, and discovered nearby. Never roulette a stale registered address as though a truck is confirmed there.

## Merge discipline

`integration/active-work-pass-1` remains the compatibility/validation surface. Preserve historical branches as provenance. Do not merge integration or any feature branch to `main` unless Caleb explicitly requests it. After material runtime/integration changes, inspect Validate Dinner Integration. Continuity must remain current.

`main` remains untouched.
