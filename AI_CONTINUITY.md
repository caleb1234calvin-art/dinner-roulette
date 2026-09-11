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

## Colorado — Cripple Creek destination ambiguity resolved

Colorado Division of Gaming accounting is corrected to 33 commercial regulator locations: 15 Black Hawk, 6 Central City, 12 Cripple Creek, plus two tribal casino resorts. All regulator rows are accounted for. Bally's Black Hawk East/North/West remain separate physical properties; Century Casinos I/II must not create an artificial duplicate; Z Casino transitioned to Bigfoot Casino in 2026.

`audit/colorado-cripple-creek-destination-reconciliation-2026-09-11.json` resolves the remaining **FHR BILLY'S** ambiguity: do **not** create a separate Dinner Roulette destination for Billy's. Current consumer-facing Full House/Chamonix material presents **Bronco Billy's** and **Chamonix** as the active connected casino experiences, while current visitor material promotes Bronco Billy's and independent casino-history evidence marks Billy's Casino closed. The FHR BILLY'S regulator row remains an accounting/evidence unit rather than a separately routable current consumer destination.

Bronco Billy's remains a current destination at `233 E Bennett Ave, Cripple Creek, CO 80813`. Chamonix remains a distinct connected casino experience because current first-party material explicitly describes two casinos/two distinct experiences connected under one roof and one owner. Century's two regulator licenses still collapse to one consumer property. Current working Cripple Creek consumer-destination accounting from the 12 regulator rows is therefore **10**, not 11 or 12.

Immediate Colorado action: finish address/coordinate/stable-ID QA for the consumer destination set, include Sky Ute and Ute Mountain tribal resorts, then serialize the clean Colorado runtime batch.

## Texas — 4 current destinations; 2 coordinate verified

`audit/texas-casino-reconciliation-2026-09-11.json` resolves current Texas scope to four physical tribal gaming destinations: Kickapoo Lucky Eagle Casino Hotel, Naskila Casino Livingston, Naskila Casino Leggett, and Speaking Rock Entertainment Center. Ischoopa Travel Center is excluded as travel-center gaming.

`audit/texas-coordinate-qa-pass-1-2026-09-11.json` begins property-coordinate QA and verifies **2 of 4**:

- **Kickapoo Lucky Eagle Casino Hotel** — `28.61092,-100.44078`, direct casino property geometry. Material address correction: the current first-party casino location page uses **794 Lucky Eagle Drive, Eagle Pass, TX 78852**. The earlier reconciliation artifact's `2212 Rosita Valley Rd` came from a July 2026 expansion announcement and should be treated as expansion/construction provenance rather than the current guest casino address unless later evidence proves otherwise.
- **Speaking Rock Entertainment Center** — `31.690126,-106.326605`, current `122 S Old Pueblo Rd, El Paso, TX 79907` property. Older NIGC `119 S Old Pueblo Rd` remains provenance only.

Still held for direct numerical property coordinates:

- **Naskila Casino Livingston** — current first-party address remains `540 State Park Road 56, Livingston, TX 77351`; do not substitute nearby photo geotags or city centroids.
- **Naskila Casino Leggett** — current first-party address remains `10314 US 59 N, Livingston, TX 77351`; opened August 25, 2026 and remains distinct from the original Livingston property while both operate.

A fresh coordinate search still did not expose trustworthy numerical property pins for either Naskila site, so the holds remain rather than lowering the evidence standard. Texas is not complete until all four current destinations clear coordinate/stable-ID QA, enter runtime and validate green.

## Oklahoma — Pass 28 green with 46 runtime records

Oklahoma discovery/reconciliation artifacts include the statewide scope, major-operator passes 1–3, runtime QA passes 1–2, coordinate QA passes 1–8, duplicate-distance QA passes 1–2, and `audit/oklahoma-runtime-eligibility-pass-1-2026-09-11.json`.

The Oklahoma candidate universe remains **77**. Current identity/address QA reached **54**, and property-specific coordinate QA reached **48**. Generated catalog passes 2–27 contain zero Oklahoma records, so there are no hidden Oklahoma collisions in those generated modules.

Record-level runtime eligibility approved **46 of the 48 coordinate-verified records** for the first Oklahoma runtime batch. Duck Creek and Checotah remain held solely for current street-number normalization. The other six address-verified records outside Pass 28 still lack a sufficiently resolved coordinate/current-site package: Artesian, Lakecrest, Coweta, Lake Eufaula, Holdenville and Cherokee South Coffeyville. Artesian additionally retains the 1001 W 1st Street vs old 23 W Vinita lineage hold.

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
