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

## National casino audit strategy

Preferred implementation cadence remains `discover → verify → reconcile → batch clean destinations → implement → validate → continue discovery → re-audit prior batches`.

For large jurisdictions, use 50–100 verified-destination runtime batches. Statewide perfection is not required before clean records enter staged runtime, but each activated property must clear current identity/operation, Dinner Roulette destination scope, normalized address, property-specific coordinates, stable ID, current website and duplicate/alias QA.

**Important counting rule:** regulator license rows are evidence/accounting units, not automatically one-to-one with Dinner Roulette destinations. Government/regulator evidence remains preferred for roster/identity truth; current first-party property sources support branding, operation and address. Restricted slot-only, route/distributed retail, ordinary convenience gaming and online-only operators remain outside the curated backbone unless independently justified as destination casinos.

## Runtime casino progress

Casino catalog modules currently run through **Pass 27** on integration. California Pass 19, Oregon Pass 20, Washington Pass 21 and Nevada Pass 22 remain active. Later passes include Wisconsin/Idaho, Minnesota/Nebraska/Wyoming, South Dakota/North Dakota, Florida and New York. The integration overlay manifest records completed/reconciled jurisdictions separately from the historical base manifest. Nevada remains explicitly pending/rolling.

## Nevada

Nevada's provisional audit decision universe is **174 rows**, not a final runtime casino count. Runtime Batch NV-01 / Pass 22 contains 50 curated destinations. Remaining Nevada work includes Winnemucca/I-80, Stockmen's Fallon, Red Drag Elko, The Nevada Casino & Bar Battle Mountain, Longstreet address normalization, Buffalo Bill's/Whiskey Pete's operation state and further rural completeness sweeps. Nevada progresses in parallel without blocking smaller states.

## Colorado — reconciliation in progress

Artifacts: `audit/colorado-casino-inventory-2026-09-11.json` and `audit/colorado-reconciliation-pass-1-2026-09-11.json`.

Colorado Division of Gaming accounting was corrected to **33 commercial regulator locations: 15 Black Hawk, 6 Central City, 12 Cripple Creek**, plus two tribal casino resorts. All regulator rows are accounted for, but license count is not forced into runtime destination count. Bally's Black Hawk East/North/West remain separate physical properties; Century Casinos I/II must not create an artificial duplicate; Z Casino at 101 Gregory St transitioned to Bigfoot Casino in 2026; FHR Billy's still needs a current-routability decision. After that, finish address/coordinate/site QA and generate runtime data from the physical-destination roster.

## Texas — reconciled, runtime QA pending

Artifact: `audit/texas-casino-reconciliation-2026-09-11.json`.

Current Texas scope resolves to four physical tribal gaming destinations pending coordinate/stable-ID QA: Kickapoo Lucky Eagle Casino Hotel, Naskila Casino Livingston, the August 25 2026 Naskila Casino Leggett temporary destination, and Speaking Rock Entertainment Center. Ischoopa Travel Center is excluded as travel-center gaming. Texas becomes complete only after runtime activation and validation.

## Oklahoma — candidate universe expanded to 77

Artifacts:

- `audit/oklahoma-statewide-scope-2026-09-11.json`
- `audit/oklahoma-major-operators-pass-1-2026-09-11.json`
- `audit/oklahoma-major-operators-pass-2-2026-09-11.json`
- `audit/oklahoma-major-operators-pass-3-2026-09-11.json`

Oklahoma is audited by tribal/operator cluster because federal rows mix destination casinos with travel plazas, smoke-shop/trading-post gaming and smaller outlets.

The clean/name-scope candidate pool has expanded from **54 to 77 named casino candidates**. Existing clusters remain Chickasaw 17, Choctaw 8, Cherokee 10, Muscogee 10 conventional casino destinations, Osage 7 and Citizen Potawatomi 2. Major-operator Pass 3 added **23 more candidates**:

- Comanche Nation Entertainment — 6 current gaming establishments: Comanche Red River, Comanche Nation, Spur, Star, War Pony and Cache. Current operator material distinguishes these from travel plazas/smoke shops.
- Quapaw Nation — 2: Downstream Casino Resort and Quapaw Casino.
- Otoe-Missouria / 7 Clans — 5: First Council, Paradise, Perry, Chilocco Gasino and Red Rock Gasino. Chilocco/Red Rock are smaller hybrid gaming/service-station properties and remain candidates pending final destination-scope QA rather than automatic exclusion.
- Shawnee Tribe — 1: Golden Mesa Casino & Hotel.
- Iowa Tribe/Caesars — 1 current successor destination: **Harrah's Oklahoma**, opened April 9, 2026. The former Ioway Casino closed in March 2026 and must not remain as a second active property.
- Seminole Nation — 3: I-40 Exit 200, Konawa and Wewoka.
- Tonkawa Tribe — 2: Tonkawa Hotel & Casino and Native Lights Casino; Tonkawa Travel Plaza is separate and not counted as a casino destination.
- Sac and Fox Nation — 2: The Black Hawk Casino and Sac & Fox Nation Casino in Stroud.
- Thlopthlocco Tribal Town — 1: Golden Pony Casino.

Suite Shots Jenks remains staged outside the clean Muscogee count until its casino-vs-golf-entertainment scope is individually resolved.

**The discovery threshold is now comfortably exceeded, but the 77 are not automatically runtime-ready.** Start property-level QA now: normalized street address, property-specific coordinates, current website, stable ID and duplicate/alias clearance. Prioritize the clearest large casino destinations and build Oklahoma Runtime Batch 1 from the first 50 records that actually clear every gate. Continue remaining operator discovery in parallel so statewide completeness can catch up behind runtime activation.

## Legal/compliance continuity

Dinner Roulette is an independent discovery/decision tool. Third-party names identify destinations/services without implying affiliation. Casino/nightlife is discovery/trip planning only; Dinner Roulette does not accept wagers, provide gambling, sell alcohol or guarantee admission. `LEGAL.md` and Settings carry legal/privacy/third-party information. Rideshare/delivery integrations remain neutral shallow launches unless an authorized provider integration says otherwise.

## Restaurant icon continuity

Issue #29 remains the original Dinner icon system: 15 semantic categories per theme / 30 canonical assets under `public/dinner-icons/{dark,light}/`, resolved by `src/lib/restaurants/dinner-icons.ts`. The assets are part of integration but their presence alone is not authorization to merge.

## Caustic Relay / startup-ident continuity

**Caustic Relay** is the active working maker/publisher brand. The canonical black-mamba/scorpion hybrid creature is an immutable source asset unless Caleb explicitly requests redesign. Startup narrative remains stable relay → pincer pinch → rupture → brief dropout → damaged return → progressive rendering-fidelity collapse. Avoid large bright flashes/strobing.

Current startup asset is `public/brand/CAUSTIC_RELAY_ident-2.mp4`, wired by `src/components/startup-ident.tsx`. The earlier clean master remains preserved as provenance. Startup behavior is muted inline autoplay, no controls/loop, app initializes behind it, ident removes itself on end/error, and reduced-motion skips it. The current asset switch was compatibility-validated by green Run 103.

## Future food-truck discovery

Food trucks remain a future dedicated mobile-venue pass. Distinguish **live/serving now**, **scheduled today**, and **discovered nearby**. Never roulette a stale registered address as though a truck is confirmed there.

## Merge discipline

`integration/active-work-pass-1` remains the compatibility/validation surface. Preserve historical feature/audit/legal/brand branches as provenance. Do not merge integration or any feature branch to `main` unless Caleb explicitly requests it.

After material runtime/integration changes, inspect **Validate Dinner Integration**. Pure audit-ledger additions may accumulate safely before the next runtime activation, but continuity should still be kept current as decisions change.

`main` remains untouched.
