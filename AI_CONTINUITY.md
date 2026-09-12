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

**Run 234 (`34672756637`) is green at activation commit `36699e1b555c87f33d26dd0f26efb1858374c30c`, validating Nevada Pass 40 active.** Typecheck, curated-casino audit, inherited test-suite report, development build and Dinner icon verification all completed successfully. The validator was subsequently extended through Pass 40 at `cea2c4ea67b417d28e464abb8959bfe11c501864`. Run 234 supersedes Run 229 as the current validated runtime baseline. A green run never authorizes a merge to `main` by itself.

The earlier complete-Texas manifest run (Run 197) correctly failed because the audit script did not yet recognize pass files that express jurisdiction through a `JURISDICTION` helper constant. Commit `17e8206` generalized that audit path; subsequent runs are green. This was an audit-infrastructure issue, not a Texas data failure.

## Casino reconciliation policy

Runtime casino passes are canonicalized chronologically in `src/lib/nightlife/search.ts` with newer same-property records winning while historical catalog files remain preserved. Same ID within 0.35 miles is a reconciliation warning/latest wins; same ID at materially different locations is a hard failure; same normalized name within 0.35 miles is a reconciliation warning/latest wins; same normalized name at distant locations is preserved as distinct destinations with a warning. Coordinate plausibility and complete-jurisdiction expected-count checks remain hard audit gates.

## National casino audit strategy

Preferred cadence: `discover → verify → reconcile → batch clean destinations → implement → validate → continue discovery → re-audit prior batches`.

For large jurisdictions, use 50–100 verified-destination runtime batches as a planning cadence, not a quota. Statewide perfection or an arbitrary round number is not required before a clean set enters staged runtime, but every activated property must clear current identity/operation, Dinner Roulette destination scope, normalized address, property-specific coordinates, stable ID, current website and duplicate/alias QA. Regulator license rows are evidence/accounting units, not automatically one-to-one with Dinner Roulette destinations.

## Runtime casino progress

Casino runtime is **validated through Pass 40**. Pass 30 adds Oklahoma Duck Creek and Checotah; Pass 31 adds Artesian Casino; Pass 32 adds 15 Nevada NV-02 destinations from Laughlin and Reno-Sparks; Pass 33 adds the complete four-destination Texas set; Pass 34 adds seven QA-cleared rural Nevada destinations; Pass 35 adds ten QA-cleared outer-Clark/Mesquite/Primm Nevada destinations; Pass 36 adds six QA-cleared Boulder Strip/Henderson Nevada destinations; Pass 37 adds four QA-cleared North Las Vegas/northwest-valley destinations; Pass 38 adds Jerry's Nugget Casino; Pass 39 adds Skyline Hotel & Casino and Emerald Island Casino; Pass 40 adds five more Nevada destinations across Boulder/Henderson and outer Clark. `src/lib/nightlife/search.ts` imports and appends through Pass 40. `scripts/audit-casino-catalog.mjs` enumerates through Pass 40 and recognizes both inline jurisdiction literals and `JURISDICTION` helper constants. Run 234 validates Pass 40 green.

California Pass 19, Oregon Pass 20, Washington Pass 21 and Nevada Pass 22 remain active. Later passes include Wisconsin/Idaho, Minnesota/Nebraska/Wyoming, South Dakota/North Dakota, Florida, New York, Oklahoma, Colorado, Nevada rolling additions and Texas.

## Nevada — rolling, 100 active runtime destinations

Nevada's provisional audit decision universe is 174 rows, not a final runtime count. Runtime Batch NV-01 / Pass 22 contains 50 curated destinations.

NV-02 was selected as a 50-candidate rolling batch, but clean segments may enter runtime without waiting for unrelated holds. Pass 32 activates **15 QA-cleared NV-02 destinations**: eight Laughlin destinations and seven Reno-Sparks destinations, bringing Nevada from 50 to 65 active destinations.

`audit/nevada-rural-coordinate-qa-pass-7-2026-09-12.json` clears a further **seven rural destinations** after current identity/address and property-coordinate QA: **Stockman's Casino (Fallon); Winnemucca Inn & Casino, Model T Casino and Winners Inn & Casino (Winnemucca); Tonopah Station Hotel and Casino; Hotel Nevada & Gambling Hall and Prospector Hotel & Gambling Hall (Ely).** `src/lib/nightlife/casino-catalog-pass-34.ts` serializes those seven and raises Nevada active curated runtime from 65 to 72.

`audit/nevada-outer-clark-mesquite-coordinate-qa-pass-8-2026-09-12.json` clears another **ten NV-02 outer-Clark / Mesquite / Primm destinations**: **Durango, Red Rock, Suncoast, Rampart, Palace Station, Silverton, Primm Valley Resort, CasaBlanca, Virgin River and Eureka.** `src/lib/nightlife/casino-catalog-pass-35.ts` serializes them, bringing Nevada active curated runtime from 72 to 82. Primm Valley is treated independently from Buffalo Bill's and Whiskey Pete's; its current operation does not clear those separate holds.

`audit/nevada-boulder-henderson-coordinate-qa-pass-9-2026-09-12.json` clears **six additional Boulder Strip / Henderson destinations**: **Boulder Station Hotel & Casino, Sam's Town Hotel & Gambling Hall, Arizona Charlie's Boulder, Sunset Station Hotel & Casino, Green Valley Ranch Resort Spa Casino and Wildfire Boulder.** `src/lib/nightlife/casino-catalog-pass-36.ts` serializes those six and raises Nevada active curated runtime from 82 to 88.

`audit/nevada-north-las-vegas-coordinate-qa-pass-10-2026-09-12.json` clears **four North Las Vegas / northwest-valley destinations**: **Bighorn Casino, Cannery Casino & Hotel, Aliante Casino + Hotel + Spa and Santa Fe Station Hotel & Casino.** `src/lib/nightlife/casino-catalog-pass-37.ts` serializes those four and raises Nevada active curated runtime from **88 to 92**. Cannery remains distinct from the closed Eastside Cannery. Historical Aliante Station naming collapses to current Aliante rather than becoming a parallel destination.

`audit/nevada-north-las-vegas-coordinate-qa-pass-11-2026-09-12.json` clears **Jerry's Nugget Casino** at **1821 Las Vegas Blvd N, North Las Vegas, NV 89030**, property coordinate **36.1932,-115.13263**. `src/lib/nightlife/casino-catalog-pass-38.ts` serializes Jerry's Nugget and raises Nevada active curated runtime from **92 to 93**. The former Poker Palace remains retired; current first-party Club Fortune North material still describes the successor property as coming soon/under renovation, so it is not inferred active from third-party opening reports. Silver Nugget remains a closure exclusion.

`audit/nevada-henderson-coordinate-qa-pass-12-2026-09-12.json` clears **Skyline Hotel & Casino** and **Emerald Island Casino**. `src/lib/nightlife/casino-catalog-pass-39.ts` serializes both, raising Nevada active curated runtime from **93 to 95**. The Pass Casino remains deliberately held because current first-party casino pages conflict with 2026 acquisition/closure-for-renovation reporting; Rainbow Club remains a coordinate hold.

`audit/nevada-boulder-outer-clark-coordinate-qa-pass-13-2026-09-12.json` clears **five additional destinations**: **Longhorn Hotel & Casino, Railroad Pass Casino & Hotel, Barley's Casino & Brewery Co., Arizona Charlie's Decatur and Wildfire Rancho.** `src/lib/nightlife/casino-catalog-pass-40.ts` serializes those five and raises Nevada active curated runtime from **95 to 100**. Arizona Charlie's Decatur remains distinct from Arizona Charlie's Boulder; Wildfire Rancho remains distinct from Wildfire Boulder/Fremont; Railroad Pass uses the casino-building point rather than nearby travel-center/trailhead coordinates. Run 234 validates Pass 40 green.

Nevada remains pending/rolling rather than statewide complete. Remaining work includes the Jokers Wild/Cadence Crossing succession, Club Fortune Henderson, Rainbow Club, The Pass operation-state conflict, Club Fortune North successor follow-up, Wildfire on Fremont, Buffalo Bill's and Whiskey Pete's operation-state holds, Bonanza Casino Fallon coordinate QA, Red Drag Elko, The Nevada Casino & Bar Battle Mountain, Longstreet normalization and other rural completeness items. Do not weaken the evidence gate merely to increase the runtime count.

## Colorado — runtime complete and green

Colorado Division of Gaming accounting is 33 commercial regulator locations: 15 Black Hawk, 6 Central City and 12 Cripple Creek, plus two tribal casino resorts. Regulator rows are accounting/evidence units and do not automatically equal consumer destinations.

The reconciled current Dinner Roulette set is **31 destinations**: **13 Black Hawk + 6 Central City + 10 Cripple Creek + 2 tribal**. Address/property-coordinate QA is **31/31** and statewide stable-ID/duplicate/alias reconciliation is complete in `audit/colorado-statewide-runtime-reconciliation-2026-09-11.json`.

Black Hawk is **13/13**. Bally's East/North/West remain three separately routable physical destinations. Bigfoot is the current successor at the former Z Casino property; do not emit a parallel current Z destination. Horseshoe's final coordinate hold is resolved in pass 1c.

Central City is **6/6** for address and coordinate QA.

Cripple Creek is **10/10** for address and coordinate QA. `audit/colorado-cripple-creek-coordinate-qa-pass-1b-2026-09-11.json` clears the final four holds: Bronco Billy's, Chamonix, McGills and Golden Nugget. Bronco Billy's and Chamonix remain separately routable despite their integrated adjoining complex. FHR BILLY'S remains a regulator/accounting row only. Century's multiple regulator rows collapse to one consumer property. Golden Nugget is the current successor at the former Wildwood casino property; do not emit Wildwood separately or substitute the adjacent hotel as another casino destination.

The two tribal resorts, Sky Ute and Ute Mountain, remain coordinate-cleared.

`src/lib/nightlife/casino-catalog-pass-29.ts` contains all **31 reconciled Colorado destinations**. Colorado remains runtime-complete for this audited destination set. Future Colorado work is maintenance/re-audit rather than a blocker.

## Texas — runtime complete and green, 4 destinations

Texas scope is **four current physical tribal gaming destinations**: Kickapoo Lucky Eagle Casino Hotel, Naskila Casino Livingston, Naskila Casino Leggett, and Speaking Rock Entertainment Center. Ischoopa Travel Center remains excluded as travel-center gaming rather than a separately promoted casino destination.

Coordinate QA is **4/4**. Kickapoo Lucky Eagle is `28.61092,-100.44078`; Naskila Livingston is `30.7142259,-94.6746959`; Naskila Leggett is `30.8342009,-94.8624389`; Speaking Rock is `31.690126,-106.326605`.

The final Leggett hold was closed by user-assisted current map-pin verification at the operating temporary casino, `10314 US 59 N, Livingston, TX 77351`. `audit/texas-coordinate-qa-pass-3-field-verification-2026-09-12.json` preserves that provenance explicitly rather than misrepresenting the numerical point as first-party publication. Current first-party Naskila evidence establishes identity, operation and address; the user-supplied current map listing/drop pin supplies the numerical property point.

`audit/texas-runtime-reconciliation-2026-09-12.json` completes stable-ID and duplicate/alias QA. Livingston and Leggett remain distinct current operating destinations. Repeated NIGC Naskila and Speaking Rock rows collapse by physical property. `src/lib/nightlife/casino-catalog-pass-33.ts` serializes all four Texas destinations, and the integration manifest marks Texas complete with expectedCount 4. Run 234 confirms the combined runtime remains green.

Texas is now maintenance/re-audit rather than an active blocker. When the temporary Leggett operation is replaced by the permanent resort, re-audit its current identity/address/coordinate rather than silently moving the existing record.

## Oklahoma — Passes 28 + 30 + 31 green with 49 runtime records

Oklahoma candidate universe remains **77**. Pass 28 serialized the first **46** runtime-eligible records. Pass 30 added Duck Creek and Checotah after resolving their final street-number normalization holds, bringing active Oklahoma runtime to 48.

`audit/oklahoma-coordinate-qa-pass-9-2026-09-12.json` resolves **Artesian Casino** as the next clean destination. Canonical casino-facing address remains **23 W Vinita Ave, Sulphur, OK 73086**, while the integrated Artesian Hotel/Casino complex also uses **1001 W 1st Street** as its broader property address. These are one current destination, not two. Property-specific coordinate is **`34.507847,-96.967535`**. `src/lib/nightlife/casino-catalog-pass-31.ts` serializes Artesian; Run 234 confirms the combined runtime remains green.

Oklahoma has **49 active audited runtime destinations** and **49 property-coordinate-cleared destinations** in the staged set. Oklahoma remains intentionally not marked statewide complete. Lakecrest, Coweta, Lake Eufaula, Holdenville and Cherokee South Coffeyville remain priority holds for coordinate/current-site or lineage QA. WinStar preserves ID stem `winstar`; Choctaw Durant preserves `choctaw-durant`.

## Legal/compliance continuity

Dinner Roulette is an independent discovery/decision tool. Third-party names identify destinations/services without implying affiliation. Casino/nightlife is discovery/trip planning only; Dinner Roulette does not accept wagers, provide gambling, sell alcohol or guarantee admission. `LEGAL.md` and Settings carry legal/privacy/third-party information. Rideshare/delivery integrations remain neutral shallow launches unless an authorized provider integration says otherwise.

## Restaurant icon continuity

Issue #29 remains the original Dinner icon system: 15 semantic categories per theme / 30 canonical assets under `public/dinner-icons/{dark,light}/`, resolved by `src/lib/restaurants/dinner-icons.ts`.

## Caustic Relay / startup-ident continuity

Caustic Relay is the active working maker/publisher brand. The canonical black-mamba/scorpion hybrid creature is immutable unless Caleb explicitly requests redesign. Current startup asset is `public/brand/CAUSTIC_RELAY_ident-2.mp4`, wired by `src/components/startup-ident.tsx`, and remains compatible with the current green integration build.

## Future food-truck discovery

Food trucks remain a future dedicated mobile-venue pass. Distinguish live/serving now, scheduled today, and discovered nearby. Never roulette a stale registered address as though a truck is confirmed there.

## Merge discipline

`integration/active-work-pass-1` remains the compatibility/validation surface. Preserve historical branches as provenance. Do not merge integration or any feature branch to `main` unless Caleb explicitly requests it. After material runtime/integration changes, inspect Validate Dinner Integration. Continuity must remain current.

`main` remains untouched.
