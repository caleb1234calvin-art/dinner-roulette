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

**Run 251 (`34674232602`) is green at commit `5c826fc9210d2ead2b78f2611e5d6b6987dad513`, validating Nevada Pass 43 and the validator extension through Pass 43.** Every recorded step completed successfully: setup, checkout, Node setup, dependency install, typecheck, curated-casino audit, inherited test-suite report, development build, Dinner icon verification, and post-job cleanup. Run 251 supersedes Run 244 as the current validated runtime baseline. A green run never authorizes a merge to `main` by itself.

The earlier complete-Texas manifest run (Run 197) failed because the audit script did not yet recognize pass files that express jurisdiction through a `JURISDICTION` helper constant. Commit `17e8206` generalized that path; later runs are green. This was audit infrastructure, not a Texas data failure.

## Casino reconciliation policy

Runtime casino passes are canonicalized chronologically in `src/lib/nightlife/search.ts`, with newer same-property records winning while historical catalog files remain preserved. Same ID within 0.35 miles is a reconciliation warning/latest wins; same ID at materially different locations is a hard failure; same normalized name within 0.35 miles is a reconciliation warning/latest wins; same normalized name at distant locations is preserved as distinct destinations with a warning. Coordinate plausibility and complete-jurisdiction expected-count checks remain hard gates.

## National casino audit strategy

Preferred cadence: `discover → verify → reconcile → batch clean destinations → implement → validate → continue discovery → re-audit prior batches`.

For large jurisdictions, 50–100 verified-destination batches are a planning cadence, not a quota. A clean set may enter staged runtime without waiting for unrelated holds, but every activated property must clear current identity/operation, Dinner Roulette destination scope, normalized address, property-specific coordinates, stable ID, current website, and duplicate/alias QA. Regulator rows are evidence/accounting units, not automatically one-to-one with consumer destinations. **Never weaken the evidence gate merely to increase the runtime count.**

## Runtime casino progress

Casino runtime is **validated through Pass 43**. `src/lib/nightlife/search.ts` imports and appends through Pass 43. `scripts/audit-casino-catalog.mjs` enumerates through Pass 43 and recognizes both inline jurisdiction literals and `JURISDICTION` helper constants. Run 251 validates the combined runtime green.

Recent passes: Pass 30 adds Oklahoma Duck Creek and Checotah; Pass 31 adds Artesian Casino; Pass 32 adds 15 Nevada Laughlin/Reno-Sparks destinations; Pass 33 adds the complete four-destination Texas set; Pass 34 adds seven rural Nevada destinations; Pass 35 adds ten outer-Clark/Mesquite/Primm destinations; Pass 36 adds six Boulder Strip/Henderson destinations; Pass 37 adds four North Las Vegas/northwest destinations; Pass 38 adds Jerry's Nugget; Pass 39 adds Skyline and Emerald Island; Pass 40 adds five Boulder/outer-Clark destinations; Pass 41 adds Club Fortune Henderson and Rainbow Club; Pass 42 adds Longstreet; **Pass 43 adds Wildfire on Fremont.**

California Pass 19, Oregon Pass 20, Washington Pass 21, and Nevada Pass 22 remain active. Later passes include Wisconsin/Idaho, Minnesota/Nebraska/Wyoming, South Dakota/North Dakota, Florida, New York, Oklahoma, Colorado, Nevada rolling additions, and Texas.

## Nevada — rolling, 104 active runtime destinations

Nevada's provisional audit decision universe remains 174 rows, not a final runtime count. Pass 22 contains the first 50 curated Nevada destinations. Later clean segments are added independently as evidence clears.

- Pass 32: +15 Laughlin/Reno-Sparks, Nevada 50 → 65.
- Pass 34: +7 rural destinations, 65 → 72.
- Pass 35: +10 outer-Clark/Mesquite/Primm, 72 → 82.
- Pass 36: +6 Boulder Strip/Henderson, 82 → 88.
- Pass 37: +4 North Las Vegas/northwest, 88 → 92.
- Pass 38: Jerry's Nugget, 92 → 93.
- Pass 39: Skyline + Emerald Island, 93 → 95.
- Pass 40: Longhorn, Railroad Pass, Barley's, Arizona Charlie's Decatur, Wildfire Rancho, 95 → 100.
- Pass 41: Club Fortune Henderson + Rainbow Club, 100 → 102.
- Pass 42: Longstreet Inn, Casino & RV Resort, 102 → 103.
- **Pass 43: Wildfire on Fremont, 103 → 104.**

### Pass 43 — Wildfire on Fremont

`audit/nevada-wildfire-fremont-coordinate-qa-pass-17-2026-09-12.json` clears **Wildfire on Fremont** at **2700 E Fremont St, Las Vegas, NV 89104**, coordinate **36.1556,-115.1135**. Current Wildfire/Station material identifies the property as operating, and the numerical point was resolved specifically to the canonical address rather than a city centroid or unrelated parcel. One first-party detail page has a conflicting ZIP, but the broader first-party/property-map, Station, regulator and tourism evidence supports 89104. `src/lib/nightlife/casino-catalog-pass-43.ts` serializes the property. Run 251 validates Pass 43 green.

### Recent Nevada reconciliation decisions

`audit/nevada-rural-operation-state-qa-pass-15-2026-09-12.json` clears Longstreet at **8570 S Nevada Highway 373, Amargosa Valley, NV 89020**, coordinate **36.41254,-116.4246**. Legacy 4400 and apparent 8750 footer variants are treated as the same physical property; canonical consumer address is 8570. The same pass makes **Whiskey Pete's** and **Buffalo Bill's** current closure exclusions after the July 2026 Primm management transition. Primm Valley itself remains active separately.

The Jokers Wild/Cadence Crossing lineage is reconciled: **Cadence Crossing opened March 25, 2026 and replaced Jokers Wild. Jokers Wild must not be emitted as current.** Cadence Crossing is strongly confirmed current at **920 N Boulder Hwy, Henderson, NV 89011**, but remains held until a numerical point can be tied directly to the new Cadence Crossing footprint rather than simply reusing the old Jokers Wild point.

**The Pass Casino** is a current closure/renovation hold. Dated 2026 reporting scheduled its August 1 closure for roughly one year, and September reporting describes it as closed. Current-looking legacy first-party pages do not override that dated closure evidence.

`audit/nevada-elko-operation-qa-pass-16-2026-09-12.json` substantially resolves **Red Drag Casino** identity/current-operation/address at **404 S 5th St, Elko, NV 89801** using current Elko tourism/property evidence, but runtime promotion remains held for a direct property-specific numerical point and clean identity-lineage reconciliation.

Priority remaining Nevada work: Cadence Crossing direct-coordinate QA; Club Fortune North successor-state/current-operation reconciliation; Bonanza Casino Fallon casino-specific coordinate QA; Red Drag Elko final coordinate/lineage QA; The Nevada Casino & Bar Battle Mountain stable first-party-site QA. Wildfire Fremont is no longer a hold.

Nevada remains rolling rather than statewide complete.

## Colorado — runtime complete and green

Colorado's reconciled current Dinner Roulette set is **31 destinations: 13 Black Hawk + 6 Central City + 10 Cripple Creek + 2 tribal**. Address/property-coordinate QA is 31/31 and stable-ID/duplicate/alias reconciliation is complete in `audit/colorado-statewide-runtime-reconciliation-2026-09-11.json`.

Bally's East/North/West remain separately routable. Bigfoot is the current successor at the former Z Casino property. Bronco Billy's and Chamonix remain separate adjoining destinations. FHR BILLY'S remains regulator/accounting only. Golden Nugget is the current successor at former Wildwood; do not emit Wildwood separately. `src/lib/nightlife/casino-catalog-pass-29.ts` contains the 31-destination Colorado set. Colorado is maintenance/re-audit only.

## Texas — runtime complete and green, 4 destinations

Texas scope is four current physical tribal gaming destinations: Kickapoo Lucky Eagle Casino Hotel; Naskila Casino Livingston; Naskila Casino Leggett; Speaking Rock Entertainment Center. Ischoopa Travel Center remains excluded as travel-center gaming rather than a separately promoted casino destination.

Coordinate QA is 4/4: Kickapoo Lucky Eagle `28.61092,-100.44078`; Naskila Livingston `30.7142259,-94.6746959`; Naskila Leggett `30.8342009,-94.8624389`; Speaking Rock `31.690126,-106.326605`. The Leggett coordinate provenance is preserved in `audit/texas-coordinate-qa-pass-3-field-verification-2026-09-12.json` as user-assisted current map-pin verification, not misrepresented as first-party publication. Texas is maintenance/re-audit only; re-audit when the temporary Leggett operation is replaced by the permanent resort.

## Oklahoma — 49 active runtime destinations, not complete

Oklahoma candidate universe remains 77. Pass 28 serialized 46 runtime-eligible records. Pass 30 added Duck Creek and Checotah, bringing the runtime to 48. Pass 31 added Artesian Casino, bringing it to **49 active audited runtime destinations**.

Artesian's canonical casino-facing address is **23 W Vinita Ave, Sulphur, OK 73086**; the broader integrated hotel/casino complex also uses 1001 W 1st Street. These are one destination. Property coordinate is `34.507847,-96.967535`.

Priority Oklahoma holds remain **Lakecrest, Coweta, Lake Eufaula, Holdenville, and Cherokee South Coffeyville**. Current first-party operation/address evidence is strong for several, but no property is promoted until its direct numerical property point and any remaining lineage/site questions clear. Never substitute a city centroid, nearby parcel, or an old closed-property coordinate.

## Legal/compliance continuity

Dinner Roulette is an independent discovery/decision tool. Third-party names identify destinations/services without implying affiliation. Casino/nightlife is discovery/trip planning only; Dinner Roulette does not accept wagers, provide gambling, sell alcohol, or guarantee admission. `LEGAL.md` and Settings carry legal/privacy/third-party information. Rideshare/delivery integrations remain neutral shallow launches unless an authorized provider integration says otherwise.

## Restaurant icon continuity

Issue #29 remains the original Dinner icon system: 15 semantic categories per theme / 30 canonical assets under `public/dinner-icons/{dark,light}/`, resolved by `src/lib/restaurants/dinner-icons.ts`.

## Caustic Relay / startup-ident continuity

Caustic Relay is the active working maker/publisher brand. The canonical black-mamba/scorpion hybrid creature is immutable unless Caleb explicitly requests redesign. Current startup asset is `public/brand/CAUSTIC_RELAY_ident-2.mp4`, wired by `src/components/startup-ident.tsx`, and remains compatible with the current green integration build.

## Future food-truck discovery

Food trucks remain a future dedicated mobile-venue pass. Distinguish live/serving now, scheduled today, and discovered nearby. Never roulette a stale registered address as though a truck is confirmed there.

## Merge discipline

`integration/active-work-pass-1` remains the compatibility/validation surface. Preserve historical branches as provenance. Do not merge integration or any feature branch to `main` unless Caleb explicitly requests it. After material runtime/integration changes, inspect Validate Dinner Integration. Continuity must remain current.

`main` remains untouched.
