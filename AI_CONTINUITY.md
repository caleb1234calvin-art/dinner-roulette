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

Green baselines include Run 98 for the consolidated casino/legal/icon state and Run 103 after the Caustic Relay startup ident switch. **Run 107 (`34645116117`) at commit `ebe5e1268794c6d325a9ae37b685621f61f62ba6` passed after the casino validator was corrected to preserve legitimate distant same-name properties.**

A green run is required before ship/merge consideration but never authorizes a merge to `main` by itself.

## Casino reconciliation policy

Runtime casino passes are canonicalized chronologically in `src/lib/nightlife/search.ts` with newer same-property records winning while historical catalog files remain preserved.

Current validator/runtime policy:

- Same **ID** within 0.35 miles: reconciliation warning; latest pass wins at runtime.
- Same **ID** at materially different locations: hard audit failure.
- Same normalized **name** within 0.35 miles: reconciliation warning; latest pass wins at runtime.
- Same normalized **name** at distant locations: preserve both as distinct destinations and emit an audit warning, not a failure.
- The policy was refined after Arizona and Oregon were found to contain legitimate, unrelated properties both named **Spirit Mountain Casino**, roughly 846 miles apart.
- Coordinate plausibility and complete-jurisdiction expected-count checks remain hard audit gates.

This separates dangerous identity collisions from legitimate casino-name homonyms.

## National casino audit strategy

Preferred implementation cadence remains:

`discover → verify → reconcile → batch clean destinations → implement → validate → continue discovery → re-audit prior batches`

For large jurisdictions, use 50–100 verified-destination runtime batches. Statewide perfection is not required before clean records enter staged runtime, but each activated property must clear current identity/operation, Dinner Roulette destination scope, normalized address, property-specific coordinates, stable ID, current website and duplicate/alias QA.

**Important counting rule:** regulator license rows are evidence/accounting units, not automatically one-to-one with Dinner Roulette destinations. Separately located licensed properties remain separate; multiple licenses that represent one consumer-facing physical destination must not create fake duplicate destinations.

Government/regulator evidence remains preferred for roster/identity truth; current first-party property sources support branding, operation and address. Restricted slot-only, route/distributed retail, ordinary convenience gaming and online-only operators remain outside the curated backbone unless independently justified as destination casinos.

## Runtime casino progress

Casino catalog modules currently run through **Pass 27** on integration. California Pass 19, Oregon Pass 20, Washington Pass 21 and Nevada Pass 22 remain active. Later passes include Wisconsin/Idaho, Minnesota/Nebraska/Wyoming, South Dakota/North Dakota, Florida and New York.

The integration overlay manifest records completed/reconciled jurisdictions separately from the historical base manifest. Nevada remains explicitly pending/rolling.

## Nevada

Nevada's provisional audit decision universe is **174 rows**, not a final runtime casino count. Runtime Batch NV-01 / Pass 22 contains 50 curated destinations. Remaining Nevada work includes Winnemucca/I-80, Stockmen's Fallon, Red Drag Elko, The Nevada Casino & Bar Battle Mountain, Longstreet address normalization, Buffalo Bill's/Whiskey Pete's operation state and further rural completeness sweeps.

Nevada is intentionally allowed to progress in parallel without blocking smaller states.

## Colorado — reconciliation in progress

Colorado audit artifacts:

- `audit/colorado-casino-inventory-2026-09-11.json`
- `audit/colorado-reconciliation-pass-1-2026-09-11.json`

Colorado Division of Gaming accounting was corrected to **33 commercial regulator locations: 15 Black Hawk, 6 Central City, 12 Cripple Creek**, plus two tribal casino resorts in the statewide destination review.

All 33 commercial regulator rows are now accounted for, but raw license count must not be forced into runtime destination count:

- Bally's Black Hawk East/North/West are three separately located physical casino properties and should remain separate.
- Century Casinos I/II in Cripple Creek represent licensing structure around one current consumer property and must not create an artificial duplicate destination.
- Z Casino at 101 Gregory St transitioned/rebranded to **Bigfoot Casino** in 2026; use current Bigfoot identity while preserving Z Casino as alias/provenance.
- FHR Billy's requires a final current-routability decision before Colorado runtime activation.

After Billy's disposition, perform address/coordinate/site QA and generate the next runtime pass from the final physical-destination roster.

## Texas — reconciled, runtime QA pending

Artifact: `audit/texas-casino-reconciliation-2026-09-11.json`.

Current Texas Dinner Roulette scope resolves to four physical tribal gaming destinations pending coordinate/stable-ID QA: Kickapoo Lucky Eagle Casino Hotel, Naskila Casino Livingston, the August 25 2026 Naskila Casino Leggett temporary destination, and Speaking Rock Entertainment Center. Ischoopa Travel Center is excluded from the casino-destination backbone as travel-center gaming. Texas becomes complete only after runtime activation and validation.

## Oklahoma — 50-candidate threshold crossed

Artifacts:

- `audit/oklahoma-statewide-scope-2026-09-11.json`
- `audit/oklahoma-major-operators-pass-1-2026-09-11.json`
- `audit/oklahoma-major-operators-pass-2-2026-09-11.json`

Oklahoma is being audited by tribal/operator cluster because federal rows mix true destination casinos with travel plazas, smoke-shop/trading-post gaming and smaller outlets.

Current clean name/scope candidate accounting is **54 destinations**, crossing the 50-record discovery threshold for a first Oklahoma runtime batch:

- Chickasaw Nation — 17.
- Choctaw Nation — 8.
- Cherokee Nation Entertainment Oklahoma — 10, consisting of nine current Cherokee Casino properties plus Hard Rock Hotel & Casino Tulsa.
- Muscogee Nation Gaming Enterprises — 10 conventional casino destinations. Suite Shots Jenks remains staged for individual scope review and is not counted in the 54.
- Osage Nation — 7 locations: Tulsa, Ponca City, Skiatook, Bartlesville, Hominy, Pawhuska and Sand Springs.
- Citizen Potawatomi Nation — 2: Grand Casino Hotel & Resort and FireLake Casino.

**Crossing 50 does not make the 54 runtime-ready automatically.** The next step is property-level normalized address, coordinates, current website, stable ID and duplicate/alias QA. Promote only the subset that clears those checks. In parallel, continue discovery across Comanche, Quapaw, Sac & Fox, Seminole, Shawnee, Tonkawa, Otoe-Missouria, Iowa Tribe and remaining Oklahoma operators.

Once a clean 50-record subset clears property-level QA, generate Oklahoma runtime batch 1 in the next available casino catalog pass, extend the catalog validator/search imports, and run Validate Dinner Integration.

## Legal/compliance continuity

Dinner Roulette is an independent discovery/decision tool. Third-party names identify destinations/services without implying affiliation. Casino/nightlife is discovery/trip planning only; Dinner Roulette does not accept wagers, provide gambling, sell alcohol or guarantee admission. `LEGAL.md` and Settings carry legal/privacy/third-party information.

Rideshare/delivery integrations remain neutral shallow launches unless an authorized provider integration says otherwise. Do not scrape marketplace menus/prices/availability/ratings or imply partnership.

## Restaurant icon continuity

Issue #29 remains the original Dinner icon system: 15 semantic categories per theme / 30 canonical assets under `public/dinner-icons/{dark,light}/`, resolved by `src/lib/restaurants/dinner-icons.ts`. The assets are part of integration but their presence alone is not authorization to merge.

## Caustic Relay / startup-ident continuity

**Caustic Relay** is the active working maker/publisher brand. The canonical black-mamba/scorpion hybrid creature is an immutable source asset unless Caleb explicitly requests redesign. Startup narrative remains stable relay → pincer pinch → rupture → brief dropout → damaged return → progressive rendering-fidelity collapse. Avoid large bright flashes/strobing.

Current startup asset is `public/brand/CAUSTIC_RELAY_ident-2.mp4`, wired by `src/components/startup-ident.tsx`. The earlier clean master remains preserved as provenance. Startup behavior is muted inline autoplay, no controls/loop, app initializes behind it, ident removes itself on end/error, and reduced-motion skips it. The current asset switch was compatibility-validated by green Run 103.

## Future food-truck discovery

Food trucks remain a future dedicated mobile-venue pass. Distinguish **live/serving now**, **scheduled today**, and **discovered nearby**. Never roulette a stale registered address as though a truck is confirmed there.

## Merge discipline

`integration/active-work-pass-1` remains the compatibility/validation surface. Preserve historical feature/audit/legal/brand branches as provenance where they still exist. Do not merge integration or any feature branch to `main` unless Caleb explicitly requests it.

After material runtime/integration changes, inspect **Validate Dinner Integration**. Pure audit-ledger additions may accumulate safely before the next runtime activation, but continuity should still be kept current as decisions change.

`main` remains untouched.
