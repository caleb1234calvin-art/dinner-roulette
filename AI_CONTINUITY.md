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

`Validate Dinner Integration` is the compatibility gate for the integration branch. It performs dependency install, TypeScript checking, casino audit, inherited tests as report-only, development build, and Dinner icon verification. Green baselines include Run 98, Run 103 after the Caustic Relay startup ident switch, and Run 107 (`34645116117`) at commit `ebe5e1268794c6d325a9ae37b685621f61f62ba6` after the casino validator was corrected to preserve legitimate distant same-name properties. A green run is required before ship/merge consideration but never authorizes a merge to `main` by itself.

## Casino reconciliation policy

Runtime casino passes are canonicalized chronologically in `src/lib/nightlife/search.ts` with newer same-property records winning while historical catalog files remain preserved. Same ID within 0.35 miles is a reconciliation warning/latest wins; same ID at materially different locations is a hard failure; same normalized name within 0.35 miles is a reconciliation warning/latest wins; same normalized name at distant locations is preserved as distinct destinations with a warning. Coordinate plausibility and complete-jurisdiction expected-count checks remain hard audit gates.

## National casino audit strategy

Preferred cadence: `discover → verify → reconcile → batch clean destinations → implement → validate → continue discovery → re-audit prior batches`.

For large jurisdictions, use 50–100 verified-destination runtime batches as a planning cadence, not a quota. Statewide perfection or an arbitrary round number is not required before a clean set enters staged runtime, but every activated property must clear current identity/operation, Dinner Roulette destination scope, normalized address, property-specific coordinates, stable ID, current website and duplicate/alias QA. Regulator license rows are evidence/accounting units, not automatically one-to-one with Dinner Roulette destinations.

## Runtime casino progress

Casino catalog modules now run through **Pass 28** on integration. Pass 28 is the first Oklahoma runtime batch and contains 46 records that cleared the first record-level eligibility review. California Pass 19, Oregon Pass 20, Washington Pass 21 and Nevada Pass 22 remain active. Later passes include Wisconsin/Idaho, Minnesota/Nebraska/Wyoming, South Dakota/North Dakota, Florida and New York. Nevada remains pending/rolling.

## Nevada

Nevada's provisional audit decision universe is 174 rows, not a final runtime count. Runtime Batch NV-01 / Pass 22 contains 50 curated destinations. Remaining work includes Winnemucca/I-80, Stockmen's Fallon, Red Drag Elko, The Nevada Casino & Bar Battle Mountain, Longstreet address normalization, Buffalo Bill's/Whiskey Pete's operation state and rural completeness sweeps. Nevada progresses in parallel without blocking smaller states.

## Colorado

Colorado Division of Gaming accounting is corrected to 33 commercial regulator locations: 15 Black Hawk, 6 Central City, 12 Cripple Creek, plus two tribal casino resorts. All regulator rows are accounted for. Bally's Black Hawk East/North/West remain separate physical properties; Century Casinos I/II must not create an artificial duplicate; Z Casino transitioned to Bigfoot Casino in 2026; FHR Billy's still needs a current-routability decision. After that, finish address/coordinate/site QA and generate runtime data.

## Texas

`audit/texas-casino-reconciliation-2026-09-11.json` resolves current Texas scope to four physical tribal gaming destinations pending coordinate/stable-ID QA: Kickapoo Lucky Eagle Casino Hotel, Naskila Casino Livingston, Naskila Casino Leggett, and Speaking Rock Entertainment Center. Ischoopa Travel Center is excluded as travel-center gaming. Texas becomes complete only after runtime activation and validation.

## Oklahoma — Pass 28 staged with 46 runtime records

Oklahoma discovery/reconciliation artifacts include the statewide scope, major-operator passes 1–3, runtime QA passes 1–2, coordinate QA passes 1–8, duplicate-distance QA passes 1–2, and `audit/oklahoma-runtime-eligibility-pass-1-2026-09-11.json`.

The Oklahoma candidate universe remains **77**. Current identity/address QA reached **54**, and property-specific coordinate QA reached **48**. Generated catalog passes 2–27 contain zero Oklahoma records, so there are no hidden Oklahoma collisions in those generated modules.

Record-level runtime eligibility review approved **46 of the 48 coordinate-verified records** for the first Oklahoma runtime batch. The two coordinate-verified records deliberately held from Pass 28 are:

- **Duck Creek Casino** — building coordinate verified, but current address evidence conflicts between `10071 Ferguson Rd` and `10085 Ferguson Rd`.
- **Checotah Casino** — building coordinate verified, but current address evidence conflicts between `830 N Broadway` and `831 N Broadway Ave`.

The other six address-verified records outside Pass 28 still lack a sufficiently resolved coordinate/current-site package, including Artesian, Lakecrest, Coweta, Lake Eufaula, Holdenville and Cherokee South Coffeyville. Artesian also retains its material address-lineage hold: current first-party property pages use `1001 W 1st Street`, not the earlier provisional `23 W Vinita Ave`.

### Pass 28 implementation state

`src/lib/nightlife/casino-catalog-pass-28.ts` now contains the **46 eligible Oklahoma destinations**. `src/lib/nightlife/search.ts` imports `CASINO_CATALOG_PASS_28` and appends it to the chronological `CASINO_PASSES` array, so same-property latest-wins reconciliation remains intact.

Stable-ID lineage is preserved for the two existing base-catalog properties already in this batch:

- WinStar uses ID stem `winstar` rather than creating `ok-winstar-world`.
- Choctaw Durant uses ID stem `choctaw-durant` rather than creating an Oklahoma-prefixed duplicate lineage.

The casino validator now enumerates **27 generated pass files**, covering Pass 2 through Pass 28. Oklahoma has **not** been marked complete in the jurisdiction manifest yet; Pass 28 is a clean first runtime batch, not a statewide completeness claim.

Important runtime decisions retained in Pass 28 include current successor-only Osage Bartlesville/Pawhuska/Ponca City sites, current Riverwind ZIP/address, MegaStar's first-party Willis locality, Gold Mountain ZIP 73401, one River Spirit resort destination rather than artificial sub-casino duplicates, and exclusion of nearby/co-located travel-plaza gaming where it is not a separate Dinner Roulette destination.

### Immediate next action

Inspect/trigger `Validate Dinner Integration` against the Pass 28 runtime changes. If validation exposes a duplicate, TypeScript, URL or catalog-format problem, fix it on integration and re-run. If green, preserve Pass 28 and continue Oklahoma cleanup/additions separately rather than holding the clean 46 hostage to the remaining unresolved properties. Do not mark Oklahoma statewide complete until the remaining operator clusters and held records are reconciled.

## Legal/compliance continuity

Dinner Roulette is an independent discovery/decision tool. Third-party names identify destinations/services without implying affiliation. Casino/nightlife is discovery/trip planning only; Dinner Roulette does not accept wagers, provide gambling, sell alcohol or guarantee admission. `LEGAL.md` and Settings carry legal/privacy/third-party information. Rideshare/delivery integrations remain neutral shallow launches unless an authorized provider integration says otherwise.

## Restaurant icon continuity

Issue #29 remains the original Dinner icon system: 15 semantic categories per theme / 30 canonical assets under `public/dinner-icons/{dark,light}/`, resolved by `src/lib/restaurants/dinner-icons.ts`.

## Caustic Relay / startup-ident continuity

Caustic Relay is the active working maker/publisher brand. The canonical black-mamba/scorpion hybrid creature is immutable unless Caleb explicitly requests redesign. Current startup asset is `public/brand/CAUSTIC_RELAY_ident-2.mp4`, wired by `src/components/startup-ident.tsx`, compatibility-validated by green Run 103.

## Future food-truck discovery

Food trucks remain a future dedicated mobile-venue pass. Distinguish live/serving now, scheduled today, and discovered nearby. Never roulette a stale registered address as though a truck is confirmed there.

## Merge discipline

`integration/active-work-pass-1` remains the compatibility/validation surface. Preserve historical branches as provenance. Do not merge integration or any feature branch to `main` unless Caleb explicitly requests it. After material runtime/integration changes, inspect Validate Dinner Integration. Continuity must remain current.

`main` remains untouched.
