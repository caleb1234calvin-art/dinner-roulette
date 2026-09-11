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

**Caleb explicitly changed the casino-audit operating model on September 11, 2026.** We no longer require an entire state or the entire national roster to reach perfect completeness before verified casinos may enter the staged runtime catalog.

Preferred cadence is now **50–100 verified casino destinations per implementation batch** whenever source quality and workload comfortably allow it:

`discover → verify → batch 50–100 → implement → validate → continue discovery → re-audit prior batches → correct as needed`

This is a living-data strategy. Completeness is approached iteratively rather than treated as a single pre-implementation finish line. Difficult/ambiguous properties must not hold up dozens of clean records. Ambiguous records remain staged/held and can be resolved in a later audit.

### Minimum per-property implementation gate

A casino may enter a staged runtime batch when it individually has:

1. credible evidence of current physical identity/operation;
2. qualifying Dinner Roulette destination scope;
3. a usable normalized physical address;
4. usable property-specific coordinates;
5. a stable catalog ID;
6. no known unresolved duplicate/alias collision.

Regulator/government evidence remains preferred for roster and identity truth. First-party/operator sources support current operation, branding and addresses. Nonrestricted gaming status alone is not automatic inclusion. Restricted slot-only, route/distributed retail, online-only and ordinary retail gaming remain outside the curated backbone unless a distinct destination-casino justification exists.

### Batch QA rule

Each 50–100-property implementation batch should be validated before moving on. Later completeness sweeps must be allowed to add missing casinos and correct closures, renames, addresses, coordinates, aliases or scope decisions in earlier batches. Stable records do not need to wait for unresolved edge cases.

This strategy applies to Nevada immediately and to subsequent national work, especially large tribal/regulator rosters such as Oklahoma. Batch size may shrink when a source set is unusually ambiguous, but 50–100 is the preferred normal scale.

## National progress

27 jurisdiction passes are already complete/active under the prior state-pass model. California Pass 19, Oregon Pass 20 and Washington Pass 21 remain the latest activated casino catalogs. Nevada is the transition point to the rolling batch model.

## Nevada — rolling Pass 22 transition

Nevada's initial discovery universe was incomplete, especially in balance-of-state communities. That finding remains important, but **statewide perfection is no longer a prerequisite to implementing already verified Nevada records**.

Current accounting checkpoint:

- Original candidate/scope-review universe: **153**.
- Tribal additions Avi + Moapa → **155**.
- Initial rural recovery +8 → 163.
- Pass 5 added Barton's Club 93 + Four Jacks → **165**.
- Pass 6 recovered/elevated 9 additional rural rows → **174 provisional decision-universe rows**.
- **174 is not a final Nevada casino count or runtime count.** It includes audit decisions and may grow/shrink through later reconciliation.

Important recovery artifacts:

- `audit/nevada-scope-address-pass-4-2026-09-11.json`
- `audit/nevada-rural-completeness-recovery-2026-09-11.json`
- `audit/nevada-rural-recovery-pass-5-2026-09-11.json`
- `audit/nevada-rural-completeness-pass-6-2026-09-11.json`
- `audit/nevada-statewide-candidate-accounting-2026-09-11.json`

### Nevada implementation approach from this point

Do not wait for every Nevada edge case before implementation. Assemble the largest clean group of individually verified Nevada destinations, preferably **50–100 at a time**, finish address/coordinate/ID/dedupe QA for that group, implement it, run blocking validation, then continue with the next group while the statewide omission sweep continues.

Known unresolved Nevada records/clusters should remain outside a batch until cleared rather than blocking clean records. Current examples include the Winnemucca/I-80 review cluster, Stockmen's Gambling Hall Fallon, Red Drag Elko, The Nevada Casino & Bar Battle Mountain, Longstreet address-number normalization, and any further rural omissions discovered later.

Previously resolved exclusions/retirements remain valid unless new evidence changes them: Mirage, Tropicana Las Vegas, Texas Station, Fiesta Rancho, Harrah's Reno, Eastside Cannery, Wa She Shu until reopening is proven, Moulin Rouge current-destination claim, Bayshore Inn from curated scope, erroneous Eureka-town `Eureka Casino`, erroneous Gold Dust West Winnemucca, and ordinary Dotty's/retail-style gaming by default. Cromwell remains alias-only under The Vanderpump Hotel. Palms remains one physical destination.

### Nevada next execution

1. Select a clean first Nevada implementation group from already verified records.
2. Complete normalized address + property-specific coordinate + stable-ID + dedupe QA for that group.
3. Generate/wire the staged Nevada runtime batch and run blocking validation.
4. Continue the statewide/rural completeness sweep in parallel conceptually; unresolved records stay staged rather than blocking the implemented group.
5. Repeat in 50–100-property groups until the Nevada decision universe is exhausted.
6. Re-audit implemented Nevada batches after the broader roster stabilizes and correct any later-discovered changes.

## National continuation after Nevada

Use the same rolling ingestion model for remaining U.S. casino jurisdictions. Prefer authoritative regulator/tribal rosters and process large clean sets rather than waiting for perfect state-wide reconciliation. Large states/tribal markets may span several 50–100-property batches. Periodic re-audits are part of the design, not evidence of failure.

## Legal/compliance continuity

Dinner Roulette is an independent discovery/decision tool. Third-party names identify destinations/services without implying affiliation. Casino/nightlife remains discovery/trip planning only; Dinner Roulette does not accept wagers, provide gambling, sell alcohol or guarantee admission. `LEGAL.md` and Settings carry legal/privacy/third-party information.

## Restaurant icon / validation continuity

Issue #29 remains the original Dinner icon system: 15 semantic categories per theme / 30 canonical assets under `public/dinner-icons/{dark,light}/`, resolved by `src/lib/restaurants/dinner-icons.ts`. Workflow `.github/workflows/validate-icon-pack.yml` blocks on TypeScript, development build and icon verification; inherited npm tests remain report-only because of template debt.

## Merge discipline

Dependency/load order remains `audit/national-casino-pass-1` → `legal/third-party-compliance-pass-1` → `feature/dinner-icon-pack-1`. Preferred ship path is a dedicated integration/compatibility branch with combined validation. Merge to `main` only after Caleb explicitly requests it.

`main` remains untouched.
