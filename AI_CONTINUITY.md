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

For large jurisdictions, use 50–100 verified-destination runtime batches. Statewide perfection is not required before clean records enter staged runtime, but every activated property must clear current identity/operation, Dinner Roulette destination scope, normalized address, property-specific coordinates, stable ID, current website and duplicate/alias QA. Regulator license rows are evidence/accounting units, not automatically one-to-one with Dinner Roulette destinations.

## Runtime casino progress

Casino catalog modules currently run through **Pass 27** on integration. California Pass 19, Oregon Pass 20, Washington Pass 21 and Nevada Pass 22 remain active. Later passes include Wisconsin/Idaho, Minnesota/Nebraska/Wyoming, South Dakota/North Dakota, Florida and New York. Nevada remains pending/rolling.

## Nevada

Nevada's provisional audit decision universe is 174 rows, not a final runtime count. Runtime Batch NV-01 / Pass 22 contains 50 curated destinations. Remaining work includes Winnemucca/I-80, Stockmen's Fallon, Red Drag Elko, The Nevada Casino & Bar Battle Mountain, Longstreet address normalization, Buffalo Bill's/Whiskey Pete's operation state and rural completeness sweeps. Nevada progresses in parallel without blocking smaller states.

## Colorado

Colorado Division of Gaming accounting is corrected to 33 commercial regulator locations: 15 Black Hawk, 6 Central City, 12 Cripple Creek, plus two tribal casino resorts. All regulator rows are accounted for. Bally's Black Hawk East/North/West remain separate physical properties; Century Casinos I/II must not create an artificial duplicate; Z Casino transitioned to Bigfoot Casino in 2026; FHR Billy's still needs a current-routability decision. After that, finish address/coordinate/site QA and generate runtime data.

## Texas

`audit/texas-casino-reconciliation-2026-09-11.json` resolves current Texas scope to four physical tribal gaming destinations pending coordinate/stable-ID QA: Kickapoo Lucky Eagle Casino Hotel, Naskila Casino Livingston, Naskila Casino Leggett, and Speaking Rock Entertainment Center. Ischoopa Travel Center is excluded as travel-center gaming. Texas becomes complete only after runtime activation and validation.

## Oklahoma — 54 address/identity-verified, coordinate QA next

Discovery/reconciliation artifacts include `audit/oklahoma-statewide-scope-2026-09-11.json`, major-operator passes 1–3, `audit/oklahoma-runtime-qa-pass-1-2026-09-11.json`, and **`audit/oklahoma-runtime-qa-pass-2-2026-09-11.json`**.

The Oklahoma name/scope candidate universe remains **77**. Runtime QA has now verified current identity, destination scope, normalized street address and provisional stable Dinner Roulette IDs for **54 properties**, crossing the 50-address threshold for the first runtime batch.

Pass 1 verified 35: Chickasaw 17, Choctaw 8 and Cherokee/CNE 10. Pass 2 added 19: **Muscogee 10, Osage 7 and Citizen Potawatomi 2**.

Important Pass 2 corrections/decisions:

- **Lake Eufaula Casino Hotel** at **1045 Birkes Rd, Eufaula** is the current Muscogee property. It replaced the former Creek Nation Eufaula Casino at 806 Forest Ave; never activate both as current destinations.
- Suite Shots Jenks remains staged outside the conventional casino pool pending individual destination-scope review.
- Osage current scope is seven properties: Tulsa, Bartlesville, Pawhuska, Ponca City, Skiatook, Hominy and Sand Springs. The first five include hotels; Hominy and Sand Springs are casino-only destinations.
- Citizen Potawatomi properties are Grand Casino Hotel & Resort at 777 Grand Casino Blvd and FireLake Casino at 41170 Hardesty Rd, both separately routable Shawnee-area casinos.

**The 54 are still not runtime-ready merely because addresses are verified.** The remaining hard gate is property-specific coordinates plus website normalization and duplicate/alias distance QA against catalog passes 1–27. Do not use city centroids or guessed coordinates.

Next action: begin coordinate QA on the 54-property pool, prioritizing the clearest 50. Once 50 clear coordinate/site/duplicate checks, generate Oklahoma Runtime Batch 1 in the next available catalog pass, wire it into `src/lib/nightlife/search.ts`, extend `scripts/audit-casino-catalog.mjs`, update the integration manifest as appropriate, and run Validate Dinner Integration.

The 77-candidate surplus means edge cases can remain staged rather than being forced into runtime merely to reach a quota.

## Legal/compliance continuity

Dinner Roulette is an independent discovery/decision tool. Third-party names identify destinations/services without implying affiliation. Casino/nightlife is discovery/trip planning only; Dinner Roulette does not accept wagers, provide gambling, sell alcohol or guarantee admission. `LEGAL.md` and Settings carry legal/privacy/third-party information. Rideshare/delivery integrations remain neutral shallow launches unless an authorized provider integration says otherwise.

## Restaurant icon continuity

Issue #29 remains the original Dinner icon system: 15 semantic categories per theme / 30 canonical assets under `public/dinner-icons/{dark,light}/`, resolved by `src/lib/restaurants/dinner-icons.ts`.

## Caustic Relay / startup-ident continuity

Caustic Relay is the active working maker/publisher brand. The canonical black-mamba/scorpion hybrid creature is immutable unless Caleb explicitly requests redesign. Current startup asset is `public/brand/CAUSTIC_RELAY_ident-2.mp4`, wired by `src/components/startup-ident.tsx`, compatibility-validated by green Run 103.

## Future food-truck discovery

Food trucks remain a future dedicated mobile-venue pass. Distinguish live/serving now, scheduled today, and discovered nearby. Never roulette a stale registered address as though a truck is confirmed there.

## Merge discipline

`integration/active-work-pass-1` remains the compatibility/validation surface. Preserve historical branches as provenance. Do not merge integration or any feature branch to `main` unless Caleb explicitly requests it. After material runtime/integration changes, inspect Validate Dinner Integration. Pure audit-ledger additions may accumulate before runtime activation, but continuity must remain current.

`main` remains untouched.
