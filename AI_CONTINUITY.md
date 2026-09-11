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

**Run 148 (`34653267544`) is green at commit `9101c7547e18636e4aeabe590a551245cace6a63`, validating the Oklahoma Pass 28 runtime state.** Every job step completed successfully: install, TypeScript, curated-casino audit, inherited test-suite report, development build and Dinner icon verification. This supersedes Run 107 as the current casino/runtime validation baseline. A green run never authorizes a merge to `main` by itself.

## Casino reconciliation policy

Runtime casino passes are canonicalized chronologically in `src/lib/nightlife/search.ts` with newer same-property records winning while historical catalog files remain preserved. Same ID within 0.35 miles is a reconciliation warning/latest wins; same ID at materially different locations is a hard failure; same normalized name within 0.35 miles is a reconciliation warning/latest wins; same normalized name at distant locations is preserved as distinct destinations with a warning. Coordinate plausibility and complete-jurisdiction expected-count checks remain hard audit gates.

## National casino audit strategy

Preferred cadence: `discover → verify → reconcile → batch clean destinations → implement → validate → continue discovery → re-audit prior batches`.

For large jurisdictions, use 50–100 verified-destination runtime batches as a planning cadence, not a quota. Statewide perfection or an arbitrary round number is not required before a clean set enters staged runtime, but every activated property must clear current identity/operation, Dinner Roulette destination scope, normalized address, property-specific coordinates, stable ID, current website and duplicate/alias QA. Regulator license rows are evidence/accounting units, not automatically one-to-one with Dinner Roulette destinations.

## Runtime casino progress

Casino catalog modules run through **Pass 28** on integration. Pass 28 is the first Oklahoma runtime batch and contains 46 records. **Run 148 validated Pass 28 green.** California Pass 19, Oregon Pass 20, Washington Pass 21 and Nevada Pass 22 remain active. Later passes include Wisconsin/Idaho, Minnesota/Nebraska/Wyoming, South Dakota/North Dakota, Florida and New York. Nevada remains pending/rolling.

## Nevada

Nevada's provisional audit decision universe is 174 rows, not a final runtime count. Runtime Batch NV-01 / Pass 22 contains 50 curated destinations. Remaining work includes Winnemucca/I-80, Stockmen's Fallon, Red Drag Elko, The Nevada Casino & Bar Battle Mountain, Longstreet address normalization, Buffalo Bill's/Whiskey Pete's operation state and rural completeness sweeps. Nevada progresses in parallel without blocking smaller states.

## Colorado — commercial address QA underway

Colorado Division of Gaming accounting is corrected to 33 commercial regulator locations: 15 Black Hawk, 6 Central City, 12 Cripple Creek, plus two tribal casino resorts. All regulator rows are accounted for.

`audit/colorado-cripple-creek-destination-reconciliation-2026-09-11.json` resolves FHR BILLY'S as an accounting/license row rather than a separate current Dinner Roulette destination. Bronco Billy's and Chamonix remain separate connected casino experiences. Century's two regulator licenses collapse to one consumer property. Current working Cripple Creek consumer-destination accounting from the 12 regulator rows is **10**.

`audit/colorado-tribal-coordinate-qa-2026-09-11.json` clears both tribal resorts: Sky Ute at `37.138214,-107.6323312` and Ute Mountain Casino at `37.20475,-108.68612`. The tribal portion no longer blocks Colorado serialization.

`audit/colorado-black-hawk-address-qa-pass-1-2026-09-11.json` now clears current consumer-facing addresses for **10 Black Hawk destinations**: Ameristar, Horseshoe, Lady Luck, The Lodge, The Gilpin, Monarch, Saratoga, Sasquatch, Wild Card Saloon and Bigfoot Casino. Bigfoot is the current successor at `101 Gregory Street`; do not create a parallel current Z Casino destination.

Bally's remains the Black Hawk subproperty hold. Current Bally's marketing uses the complex-level `300 Main Street` address, while regulator/history evidence preserves East/North/West physical license/property distinctions. Do not collapse Bally's East/North/West solely because the current consumer site uses one complex address. Resolve current physical subproperty addresses and coordinates first.

Immediate Colorado action: resolve Bally's East/North/West physical subproperties, collect property-specific coordinates for the 10 address-cleared Black Hawk destinations, and continue Central City/Cripple Creek address-coordinate QA. Then serialize the clean Colorado runtime batch.

## Texas — 4 current destinations; 2 coordinate verified

`audit/texas-casino-reconciliation-2026-09-11.json` resolves current Texas scope to four physical tribal gaming destinations: Kickapoo Lucky Eagle Casino Hotel, Naskila Casino Livingston, Naskila Casino Leggett, and Speaking Rock Entertainment Center. Ischoopa Travel Center is excluded as travel-center gaming.

`audit/texas-coordinate-qa-pass-1-2026-09-11.json` verifies **2 of 4**: Kickapoo Lucky Eagle Casino Hotel at `28.61092,-100.44078` with current casino-facing address `794 Lucky Eagle Drive, Eagle Pass, TX 78852`, and Speaking Rock Entertainment Center at `31.690126,-106.326605` with current address `122 S Old Pueblo Rd, El Paso, TX 79907`.

Still held for direct numerical property coordinates: **Naskila Casino Livingston** at `540 State Park Road 56` and **Naskila Casino Leggett** at `10314 US 59 N`. Fresh searches have not exposed trustworthy numerical property pins, so the holds remain rather than lowering the evidence standard. Texas is not complete until all four current destinations clear coordinate/stable-ID QA, enter runtime and validate green.

## Oklahoma — Pass 28 green with 46 runtime records

Oklahoma candidate universe remains **77**. Current identity/address QA reached **54**, property-specific coordinate QA reached **48**, and record-level runtime eligibility approved **46** for Pass 28. Duck Creek and Checotah remain held for current street-number normalization; Artesian, Lakecrest, Coweta, Lake Eufaula, Holdenville and Cherokee South Coffeyville remain outside Pass 28 for coordinate/current-site or lineage holds.

`src/lib/nightlife/casino-catalog-pass-28.ts` contains the 46 eligible Oklahoma destinations. `src/lib/nightlife/search.ts` imports Pass 28 and appends it to chronological `CASINO_PASSES`. The validator enumerates Pass 2 through Pass 28. WinStar preserves ID stem `winstar`; Choctaw Durant preserves `choctaw-durant`.

**Run 148 confirms this implementation is green.** Oklahoma remains intentionally not marked statewide complete; future cleanup/additions can proceed separately without holding the validated 46 hostage.

## Legal/compliance continuity

Dinner Roulette is an independent discovery/decision tool. Third-party names identify destinations/services without implying affiliation. Casino/nightlife is discovery/trip planning only; Dinner Roulette does not accept wagers, provide gambling, sell alcohol or guarantee admission. `LEGAL.md` and Settings carry legal/privacy/third-party information. Rideshare/delivery integrations remain neutral shallow launches unless an authorized provider integration says otherwise.

## Restaurant icon continuity

Issue #29 remains the original Dinner icon system: 15 semantic categories per theme / 30 canonical assets under `public/dinner-icons/{dark,light}/`, resolved by `src/lib/restaurants/dinner-icons.ts`.

## Caustic Relay / startup-ident continuity

Caustic Relay is the active working maker/publisher brand. The canonical black-mamba/scorpion hybrid creature is immutable unless Caleb explicitly requests redesign. Current startup asset is `public/brand/CAUSTIC_RELAY_ident-2.mp4`, wired by `src/components/startup-ident.tsx`, compatibility-validated by green Run 103 and still passing the current Run 148 integration build.

## Future food-truck discovery

Food trucks remain a future dedicated mobile-venue pass. Distinguish live/serving now, scheduled today, and discovered nearby. Never roulette a stale registered address as though a truck is confirmed there.

## Merge discipline

`integration/active-work-pass-1` remains the compatibility/validation surface. Preserve historical branches as provenance. Do not merge integration or any feature branch to `main` unless Caleb explicitly requests it. After material runtime/integration changes, inspect Validate Dinner Integration. Continuity must remain current.

`main` remains untouched.
