# Dinner Roulette — AI Continuity

_Last updated: September 11, 2026_

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

**Run 175 (`34665141328`) is green at commit `1e9ef9f439fa61af6acf7ff905b9ef9be28b6d37`, validating Colorado Pass 29 runtime activation.** Every job step completed successfully: install, TypeScript checking, curated-casino audit, inherited test-suite report, development build and Dinner icon verification. This supersedes Run 148 as the current validated runtime baseline. A green run never authorizes a merge to `main` by itself.

## Casino reconciliation policy

Runtime casino passes are canonicalized chronologically in `src/lib/nightlife/search.ts` with newer same-property records winning while historical catalog files remain preserved. Same ID within 0.35 miles is a reconciliation warning/latest wins; same ID at materially different locations is a hard failure; same normalized name within 0.35 miles is a reconciliation warning/latest wins; same normalized name at distant locations is preserved as distinct destinations with a warning. Coordinate plausibility and complete-jurisdiction expected-count checks remain hard audit gates.

## National casino audit strategy

Preferred cadence: `discover → verify → reconcile → batch clean destinations → implement → validate → continue discovery → re-audit prior batches`.

For large jurisdictions, use 50–100 verified-destination runtime batches as a planning cadence, not a quota. Statewide perfection or an arbitrary round number is not required before a clean set enters staged runtime, but every activated property must clear current identity/operation, Dinner Roulette destination scope, normalized address, property-specific coordinates, stable ID, current website and duplicate/alias QA. Regulator license rows are evidence/accounting units, not automatically one-to-one with Dinner Roulette destinations.

## Runtime casino progress

Casino runtime is **validated through Pass 29**. `src/lib/nightlife/casino-catalog-pass-29.ts` contains the reconciled 31-destination Colorado set; `src/lib/nightlife/search.ts` imports and appends Pass 29 to chronological `CASINO_PASSES`; `scripts/audit-casino-catalog.mjs` enumerates catalog files through Pass 29. Run 175 validates the activated Colorado runtime state green.

California Pass 19, Oregon Pass 20, Washington Pass 21 and Nevada Pass 22 remain active. Later passes include Wisconsin/Idaho, Minnesota/Nebraska/Wyoming, South Dakota/North Dakota, Florida and New York. Nevada remains pending/rolling.

## Nevada

Nevada's provisional audit decision universe is 174 rows, not a final runtime count. Runtime Batch NV-01 / Pass 22 contains 50 curated destinations. Remaining work includes Winnemucca/I-80, Stockmen's Fallon, Red Drag Elko, The Nevada Casino & Bar Battle Mountain, Longstreet address normalization, Buffalo Bill's/Whiskey Pete's operation state and rural completeness sweeps. Nevada progresses in parallel without blocking smaller states.

## Colorado — runtime complete and green

Colorado Division of Gaming accounting is 33 commercial regulator locations: 15 Black Hawk, 6 Central City and 12 Cripple Creek, plus two tribal casino resorts. Regulator rows are accounting/evidence units and do not automatically equal consumer destinations.

The reconciled current Dinner Roulette set is **31 destinations**: **13 Black Hawk + 6 Central City + 10 Cripple Creek + 2 tribal**. Address/property-coordinate QA is **31/31** and statewide stable-ID/duplicate/alias reconciliation is complete in `audit/colorado-statewide-runtime-reconciliation-2026-09-11.json`.

Black Hawk is **13/13**. Bally's East/North/West remain three separately routable physical destinations. Bigfoot is the current successor at the former Z Casino property; do not emit a parallel current Z destination. Horseshoe's final coordinate hold is resolved in pass 1c.

Central City is **6/6** for address and coordinate QA.

Cripple Creek is **10/10** for address and coordinate QA. `audit/colorado-cripple-creek-coordinate-qa-pass-1b-2026-09-11.json` clears the final four holds: Bronco Billy's, Chamonix, McGills and Golden Nugget. Bronco Billy's and Chamonix remain separately routable despite their integrated adjoining complex. FHR BILLY'S remains a regulator/accounting row only. Century's multiple regulator rows collapse to one consumer property. Golden Nugget is the current successor at the former Wildwood casino property; do not emit Wildwood separately or substitute the adjacent hotel as another casino destination.

The two tribal resorts, Sky Ute and Ute Mountain, remain coordinate-cleared.

`src/lib/nightlife/casino-catalog-pass-29.ts` contains all **31 reconciled Colorado destinations**. Pass 29 is active in runtime, the casino validator includes it, and **Run 175 is green**. Colorado can now be treated as runtime-complete for this audited destination set. Future Colorado work is maintenance/re-audit rather than a blocker.

## Texas — 4 current destinations; 2 coordinate verified

Texas scope is four physical tribal gaming destinations: Kickapoo Lucky Eagle Casino Hotel, Naskila Casino Livingston, Naskila Casino Leggett, and Speaking Rock Entertainment Center. Ischoopa Travel Center is excluded as travel-center gaming.

Coordinate QA verifies 2 of 4: Kickapoo Lucky Eagle at `28.61092,-100.44078` with current casino-facing address `794 Lucky Eagle Drive`, and Speaking Rock at `31.690126,-106.326605` with current address `122 S Old Pueblo Rd`.

Still held for direct numerical property coordinates: Naskila Livingston at `540 State Park Road 56` and Naskila Leggett at `10314 US 59 N`. Texas is not complete until all four current destinations clear coordinate/stable-ID QA, enter runtime and validate green.

## Oklahoma — Pass 28 green with 46 runtime records

Oklahoma candidate universe remains **77**. Current identity/address QA reached **54**, property-specific coordinate QA reached **48**, and record-level runtime eligibility approved **46** for Pass 28. Duck Creek and Checotah remain held for current street-number normalization; Artesian, Lakecrest, Coweta, Lake Eufaula, Holdenville and Cherokee South Coffeyville remain outside Pass 28 for coordinate/current-site or lineage holds.

`src/lib/nightlife/casino-catalog-pass-28.ts` contains the 46 eligible Oklahoma destinations. `src/lib/nightlife/search.ts` imports Pass 28 and appends it to chronological `CASINO_PASSES`. The validator now enumerates through Pass 29. WinStar preserves ID stem `winstar`; Choctaw Durant preserves `choctaw-durant`.

**Run 148 originally confirmed the Oklahoma Pass 28 implementation green; Run 175 subsequently confirms the combined runtime remains green after Colorado Pass 29 activation.** Oklahoma remains intentionally not marked statewide complete; future cleanup/additions can proceed separately without holding the validated 46 hostage.

## Legal/compliance continuity

Dinner Roulette is an independent discovery/decision tool. Third-party names identify destinations/services without implying affiliation. Casino/nightlife is discovery/trip planning only; Dinner Roulette does not accept wagers, provide gambling, sell alcohol or guarantee admission. `LEGAL.md` and Settings carry legal/privacy/third-party information. Rideshare/delivery integrations remain neutral shallow launches unless an authorized provider integration says otherwise.

## Restaurant icon continuity

Issue #29 remains the original Dinner icon system: 15 semantic categories per theme / 30 canonical assets under `public/dinner-icons/{dark,light}/`, resolved by `src/lib/restaurants/dinner-icons.ts`.

## Caustic Relay / startup-ident continuity

Caustic Relay is the active working maker/publisher brand. The canonical black-mamba/scorpion hybrid creature is immutable unless Caleb explicitly requests redesign. Current startup asset is `public/brand/CAUSTIC_RELAY_ident-2.mp4`, wired by `src/components/startup-ident.tsx`, compatibility-validated by green Run 103 and still passing the current Run 175 integration build.

## Future food-truck discovery

Food trucks remain a future dedicated mobile-venue pass. Distinguish live/serving now, scheduled today, and discovered nearby. Never roulette a stale registered address as though a truck is confirmed there.

## Merge discipline

`integration/active-work-pass-1` remains the compatibility/validation surface. Preserve historical branches as provenance. Do not merge integration or any feature branch to `main` unless Caleb explicitly requests it. After material runtime/integration changes, inspect Validate Dinner Integration. Continuity must remain current.

`main` remains untouched.
