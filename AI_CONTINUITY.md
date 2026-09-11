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

## Oklahoma — 54 address/identity verified; 48 coordinate verified; duplicate QA started

Discovery/reconciliation artifacts include `audit/oklahoma-statewide-scope-2026-09-11.json`, major-operator passes 1–3, runtime QA passes 1–2, coordinate QA passes **1–8**, and `audit/oklahoma-duplicate-distance-qa-pass-1-2026-09-11.json`.

The Oklahoma name/scope candidate universe is **77**. Current identity, destination scope, normalized street address and provisional stable Dinner Roulette IDs are verified for **54 properties** across Chickasaw, Choctaw, Cherokee/CNE, Muscogee, Osage and Citizen Potawatomi clusters.

**Property-specific coordinates are now verified for 48 of those 54.** Pass 1 established 9; Pass 2 added 7; Pass 3 added 4; Pass 4 added 8; Pass 5 added 4; Pass 6 added 4; Pass 7 added 6; Pass 8 added Choctaw Hochatown, Cherokee Fort Gibson, Osage Casino Hotel Tulsa, current-site Osage Casino Hotel Ponca City, Duck Creek Casino and Checotah Casino.

Coordinate evidence must be property-specific rather than city centroids. Runtime activation remains withheld until duplicate/alias distance QA against passes 1–27 is complete. Duck Creek and Checotah now have verified building geometry, but their final runtime street-number normalization remains pending.

### Duplicate/stable-ID QA state

Branch-aware duplicate QA has now begun. The base catalog already contains four Oklahoma anchors: WinStar World Casino and Resort (`casino-catalog-winstar`), Choctaw Casino & Resort - Durant (`casino-catalog-choctaw-durant`), Indigo Sky Casino and Buffalo Run Casino & Resort.

The first measured reconciliations are clean:

- Current WinStar coordinate `33.75762,-97.12994` is about **0.051 mi** from the base-catalog WinStar coordinate `33.7580,-97.1307`, well inside the 0.35-mile same-property threshold. Preserve the existing runtime ID stem **`winstar`**; do not create a parallel `ok-winstar-world` runtime lineage.
- Current Choctaw Durant coordinate `33.95116,-96.41404` is about **0.072 mi** from the base-catalog coordinate `33.9522,-96.4141`, also well inside the threshold. Preserve runtime ID stem **`choctaw-durant`** despite punctuation/spacing differences in the display name.
- Indigo Sky and Buffalo Run remain existing runtime anchors for later northeast-Oklahoma reconciliation; when their cluster is audited, update/reconcile them rather than duplicating them.

This first duplicate pass clears **2 explicit same-property base-catalog collisions**. It does **not** yet represent full branch-wide clearance; passes 2–27 still need to be swept for the coordinate-verified Oklahoma pool.

Important coordinate/separation decisions:

- Riverwind uses current first-party address `1544 State Highway 9, Norman, OK 73072`; earlier provisional ZIP 73093 is superseded.
- Newcastle Casino is distinct from Newcastle Travel Gaming.
- Choctaw Pocola resort, Choctaw Grant casino and Choctaw Stringtown casino are distinct from nearby travel-plaza gaming operations.
- Choctaw Hochatown / Choctaw Landing is directly coordinate-resolved at the current Hochatown property.
- Cherokee Roland casino footprint is distinct from its adjacent hotel footprint and nearby Cherokee Travel Plaza.
- Cherokee Fort Gibson is property-coordinate verified at the current 107 N Georgetown Rd site.
- Border Casino is distinct from the nearby Chickasaw Travel Stop.
- MegaStar Casino mapping sources may normalize locality to Kingston, but current first-party contact material uses `4350 S Hwy 377, Willis, OK 73439`; preserve first-party locality.
- Treasure Valley Casino & Hotel is distinct from the separately mapped nearby Chickasaw Travel Stop.
- Black Gold Casino is co-located with a Chickasaw Travel Stop/convenience component; preserve one casino destination record and do not create a second roulette destination for the travel-stop component.
- Gold Mountain's current Visit Ardmore page appears to contain ZIP typo `72401`; preserve previously verified Ardmore ZIP `73401`.
- Lake Eufaula Casino Hotel at 1045 Birkes Rd remains the current Muscogee successor property; never activate the old 806 Forest/Forrest Ave predecessor simultaneously.
- One Fire Casino is clearly resolved to one Okmulgee property; current sources vary only on whether `Wood Dr` includes directional `N`, so normalize conservatively after final site QA.
- Muscogee Casino is clearly resolved at 3420 W Peak Blvd; mapping/current sources disagree on ZIP 74401 vs 74403, so preserve the current QA address pending final normalization.
- Okemah Casino is directly mapped; current sources vary between 1101 and older 1100/S Woody Guthrie wording, so preserve current first-party 1101 pending final normalization.
- Duck Creek Casino has exact building geometry; current sources disagree between `10071` and `10085 Ferguson Rd`, so final street number remains a runtime hold rather than a coordinate hold.
- Checotah Casino has exact building geometry; current sources disagree between `830` and `831 N Broadway`, so final street number remains a runtime hold rather than a coordinate hold.
- Osage Casino Hotel Bartlesville uses the current 1803 US-60 successor property; do not revive the older Allen Road site.
- Osage Casino Hotel Pawhuska uses the current `1421 John Dahl Ave` property; do not activate the older `2017 E 15th St` predecessor.
- Osage Casino Hotel Ponca City is coordinate-resolved to the current `64464 US Highway 60` property; do not reuse old `73 N City View Rd` coordinate data.
- Osage Casino Hotel Tulsa uses a property geocode at the current `951 W 36th St N` address rather than the parking-only feature found in an earlier sweep.
- Suite Shots Jenks remains staged outside the conventional casino pool.

### Material reconciliation holds

**Artesian:** do not activate the earlier provisional Artesian address. Current first-party Artesian casino/hotel pages identify Artesian Casino at **1001 W 1st Street, Sulphur, OK 73086**, conflicting with the earlier provisional `23 W Vinita Ave` record. Reconcile lineage before coordinate promotion.

**Lake Eufaula:** current property at `1045 Birkes Rd` is verified as the successor to the closed old Forest/Forrest Avenue site, but exact current-site coordinate evidence still needs to clear the property-specific standard.

**Coweta:** current identity/address is strong; exact property coordinate still needs direct evidence.

**Holdenville:** current identity/address is strong; exact property coordinate still needs direct evidence.

**Cherokee South Coffeyville:** current identity/address is strong; exact property coordinate still needs direct evidence.

There are **2 additional property coordinates needed to reach the 50-coordinate target**. The coordinate search should continue, but duplicate/name/ID distance QA is now active in parallel and is the more important runtime gate. Continue sweeping passes 2–27, preserving established stable IDs whenever a current record resolves to the same property. The first Oklahoma runtime pass should contain only records clearing every gate; do not force the count.

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
