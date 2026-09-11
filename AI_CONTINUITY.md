# Dinner Roulette — AI Continuity

_Last updated: September 11, 2026_

## Project state

- Active app: Dinner Roulette V.3.
- Repository: `caleb1234calvin-art/dinner-roulette`.
- Current working branch: `feature/dinner-icon-pack-1`.
- Branch stack: `audit/national-casino-pass-1` → `legal/third-party-compliance-pass-1` → `feature/dinner-icon-pack-1`.
- `main` remains untouched unless Caleb explicitly requests a merge/direct change.
- ChatGPT is the only AI authorized to directly modify the repository unless Caleb explicitly authorizes another assistant for a named file.
- Dinner Roulette and the Jasper County audit remain interconnected.

## National casino audit — rolling implementation strategy

Caleb changed the casino-audit operating model on September 11, 2026. Preferred cadence is now **50–100 verified casino destinations per implementation batch**:

`discover → verify → batch 50–100 → implement → validate → continue discovery → re-audit prior batches → correct as needed`

Statewide perfection is not required before clean records enter staged runtime. Each property must individually clear current identity/operation, Dinner Roulette destination scope, normalized address, property-specific coordinates, stable ID and duplicate/alias QA. Ambiguous properties remain staged instead of blocking clean records.

Government/regulator evidence remains preferred for roster/identity truth; first-party property sources support operation/branding/address. Nonrestricted gaming status alone is not automatic inclusion. Restricted slot-only, route/distributed retail, online-only and ordinary retail gaming remain outside the curated backbone unless independently justified as destination casinos.

## National progress

27 jurisdiction passes were completed under the prior state-pass model. California Pass 19, Oregon Pass 20 and Washington Pass 21 remain active. Nevada is the first jurisdiction using the rolling implementation model.

## Nevada — rolling runtime now started

Nevada's provisional audit decision universe remains **174 rows**, not a final casino count. Statewide/rural completeness work continues, but the first clean runtime group has now been implemented rather than waiting on every edge case.

### Nevada runtime Batch NV-01 / Pass 22

- Audit artifact: `audit/nevada-runtime-batch-1-2026-09-11.json`
- Runtime module: `src/lib/nightlife/casino-catalog-pass-22.ts`
- Size: **50 curated Nevada casino destinations**.
- Composition: **28 Las Vegas Strip + 12 Downtown Las Vegas + 10 high-confidence off-Strip/south Clark County destinations**.
- Search integration: `CASINO_CATALOG_PASS_22` is imported and included in `ALL_CURATED_NIGHTLIFE` in `src/lib/nightlife/search.ts`.
- Cromwell/The Vanderpump Hotel was added to nightlife alias matching to reduce live-OSM duplicate risk during the 2026 rename transition.
- Batch explicitly does **not** claim Nevada statewide completeness.

NV-01 includes the full currently reconciled 28-property Strip set, the 12-property Downtown set, plus Palms, Gold Coast, Orleans, Rio, Virgin Hotels Las Vegas Casino, Ellis Island, Silver Sevens, OYO, South Point and M Resort.

### Nevada audit accounting

- Original candidate/scope-review universe: 153.
- Tribal additions Avi + Moapa → 155.
- Initial rural recovery +8 → 163.
- Pass 5 Barton's + Four Jacks → 165.
- Pass 6 +9 → **174 provisional decision-universe rows**.
- NV-01 activates 50 clean records from that evolving universe; 174 remains an audit universe rather than a runtime total.

Important artifacts remain `audit/nevada-scope-address-pass-4-2026-09-11.json`, `audit/nevada-rural-completeness-recovery-2026-09-11.json`, `audit/nevada-rural-recovery-pass-5-2026-09-11.json`, `audit/nevada-rural-completeness-pass-6-2026-09-11.json`, `audit/nevada-statewide-candidate-accounting-2026-09-11.json`, and now `audit/nevada-runtime-batch-1-2026-09-11.json`.

### Nevada unresolved/staged work

Do not let these block clean future batches: Winnemucca/I-80 cluster, Stockmen's Gambling Hall Fallon, Red Drag Elko, The Nevada Casino & Bar Battle Mountain, Longstreet address-number normalization, Buffalo Bill's/Whiskey Pete's current-operation state, and any further rural omissions found by later sweeps.

Previously resolved exclusions/retirements remain unless new evidence changes them: Mirage, Tropicana Las Vegas, Texas Station, Fiesta Rancho, Harrah's Reno, Eastside Cannery, Wa She Shu until reopening is proven, Moulin Rouge current-destination claim, Bayshore Inn from curated scope, erroneous Eureka-town `Eureka Casino`, erroneous Gold Dust West Winnemucca, and ordinary Dotty's/retail-style gaming by default. Palms remains one physical destination.

### Nevada next execution

1. Validate NV-01 with the repository's blocking TypeScript/build/icon workflow and inspect any new failures attributable to Pass 22.
2. Begin NV-02 by selecting the next 50–100 clean Nevada records from outer Clark, Laughlin, Reno/Sparks/Tahoe/Carson/Elko/Wendover and cleared rural recoveries.
3. Finish address/coordinate/ID/dedupe QA for NV-02 while leaving ambiguous properties staged.
4. Implement and validate NV-02.
5. Continue statewide omission sweeps and later re-audit NV-01/NV-02 for corrections.

## National continuation after Nevada

Use the same rolling ingestion model for remaining U.S. casino jurisdictions. Large states/tribal markets may span several 50–100-property batches. Periodic re-audits are part of the design.

## Legal/compliance continuity

Dinner Roulette is an independent discovery/decision tool. Third-party names identify destinations/services without implying affiliation. Casino/nightlife remains discovery/trip planning only; Dinner Roulette does not accept wagers, provide gambling, sell alcohol or guarantee admission. `LEGAL.md` and Settings carry legal/privacy/third-party information.

## Restaurant icon / validation continuity

Issue #29 remains the original Dinner icon system: 15 semantic categories per theme / 30 canonical assets under `public/dinner-icons/{dark,light}/`, resolved by `src/lib/restaurants/dinner-icons.ts`. Workflow `.github/workflows/validate-icon-pack.yml` blocks on TypeScript, development build and icon verification; inherited npm tests remain report-only because of template debt.

## Merge discipline

Dependency/load order remains `audit/national-casino-pass-1` → `legal/third-party-compliance-pass-1` → `feature/dinner-icon-pack-1`. Preferred ship path is a dedicated integration/compatibility branch with combined validation. Merge to `main` only after Caleb explicitly requests it.

`main` remains untouched.
