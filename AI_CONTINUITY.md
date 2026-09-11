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

## National casino audit

**27 jurisdiction passes are complete and active. Nevada Pass 22 remains in reconciliation and is not active.** California Pass 19, Oregon Pass 20 and Washington Pass 21 remain the latest activated casino catalogs.

## Nevada — Pass 22 completeness recovery

Nevada's initial discovery universe was incomplete, especially in balance-of-state communities. The audit is intentionally recovering and reconciling those omissions before any runtime dataset is generated. **Do not create or activate `casino-catalog-pass-22.ts` yet.**

Primary authority remains the Nevada Gaming Control Board, with NIGC/current tribal evidence for tribal/Class II reconciliation. Current first-party/operator and government tourism sources are supporting evidence for current operation, branding and addresses. Nonrestricted status remains identity evidence rather than automatic Dinner Roulette inclusion.

### Accounting checkpoint

- Original candidate/scope-review universe: **153**.
- Tribal additions Avi + Moapa produced **155**.
- Initial rural recovery added **8** → 163.
- Pass 5 recovered Barton's Club 93 + Four Jacks → **165**.
- Pass 6 recovered/elevated **9 additional rural rows** → current **provisional decision universe 174**.
- **174 is an audit decision universe, not a Nevada casino count or final runtime count.** It may still move as completeness work continues.

### Rural recovery artifacts

- `audit/nevada-scope-address-pass-4-2026-09-11.json`
- `audit/nevada-rural-completeness-recovery-2026-09-11.json`
- `audit/nevada-rural-recovery-pass-5-2026-09-11.json`
- `audit/nevada-rural-completeness-pass-6-2026-09-11.json`
- `audit/nevada-statewide-candidate-accounting-2026-09-11.json`

### Pass 6 additions / decisions

Battle Mountain was substantially undercounted. Current evidence now carries **Big Wheel Casino**, **Owl Club Casino & Restaurant**, and **Broadway Colt Inn Casino & Restaurant** as current destinations; **The Nevada Casino & Bar** is retained pending exact NGCB identity matching.

Other recovered current destinations: **Alamo Casino at Wells Petro** in Wells; **Border Inn Casino** near Baker; **Longstreet Inn, Casino & RV Resort** in Amargosa Valley; **Copper Queen Hotel & Casino** and **Jailhouse Motel & Casino** in Ely. Longstreet has conflicting 8570/8750 address rendering on first-party pages, so exact street-number normalization remains a QA gate.

The audit also exposed a new Winnemucca/I-80 review cluster: **Winnemucca Roadhouse Casino, Pilot Casino - Winnemucca, Pete's Gambling Hall, and Alamo Casino - Mill City**. These are not automatically included; each requires destination-scope/current NGCB reconciliation.

Previously recovered/advanced destinations include Cactus Pete's, Horseshu, Barton's Club 93, Four Jacks, Fernley Nugget, Dini's Lucky Club, C Punch Inn, Stagecoach Beatty and El Capitan Hawthorne. Stockmen's Gambling Hall Fallon and Red Drag Elko still need exact disposition.

### Existing important Nevada decisions

Includes/retained: Casino Royale; Caesars Republic Lake Tahoe with Harveys retired as alias; Harrah's Lake Tahoe separately; Venetian + Palazzo separately; Wynn + Encore separately; Avi; Moapa; Alamo Sparks Petro; current major-market candidates subject to final accounting.

Exclusions/retirements include Mirage, Tropicana Las Vegas, Texas Station, Fiesta Rancho, Harrah's Reno, Eastside Cannery, Wa She Shu until reopening is proven, Moulin Rouge current-destination claim, Bayshore Inn from curated scope, erroneous Eureka-town `Eureka Casino`, erroneous Gold Dust West Winnemucca, and ordinary Dotty's/retail-style gaming by default. Cromwell is alias-only under The Vanderpump Hotel. Palms remains one physical destination.

### Activation gates

1. Continue statewide/rural completeness sweep; do not assume 174 is final.
2. Reconcile Winnemucca/I-80 cluster plus Stockmen's Fallon, Red Drag Elko, Nevada Casino Battle Mountain and any further omissions against NGCB/current-operation evidence.
3. Freeze the physical roster only after repeated omission sweeps stop surfacing credible destination casinos.
4. Normalize every retained address, including Longstreet and El Capitan edge cases.
5. Complete property-specific coordinate QA.
6. Produce final all-row include/exclude/hold/alias/dedupe accounting with no unexplained rows.
7. Only then generate Nevada runtime Pass 22, wire search, validate and mark Nevada jurisdiction #28 complete.

## Casino audit operating rules

Government/regulator sources are preferred for roster/identity truth; first-party property sources support current operation/branding/address. Nonrestricted gaming status alone is insufficient for curated destination scope. Restricted slot-only, route/distributed retail, online-only and ordinary retail gaming remain outside the curated backbone unless a distinct destination-casino justification exists. Explicit exclusions and uncertainty are preferable to invented certainty. Curated records supplement live OSM discovery.

## Legal/compliance continuity

Dinner Roulette is an independent discovery/decision tool. Third-party names identify destinations/services without implying affiliation. Casino/nightlife remains discovery/trip planning only; Dinner Roulette does not accept wagers, provide gambling, sell alcohol or guarantee admission. `LEGAL.md` and Settings carry legal/privacy/third-party information.

## Restaurant icon / validation continuity

Issue #29 remains the original Dinner icon system: 15 semantic categories per theme / 30 canonical assets under `public/dinner-icons/{dark,light}/`, resolved by `src/lib/restaurants/dinner-icons.ts`. Workflow `.github/workflows/validate-icon-pack.yml` blocks on TypeScript, development build and icon verification; inherited npm tests remain report-only because of template debt.

## Merge discipline

Dependency/load order remains `audit/national-casino-pass-1` → `legal/third-party-compliance-pass-1` → `feature/dinner-icon-pack-1`. Preferred ship path is a dedicated integration/compatibility branch with combined validation. Merge to `main` only after Caleb explicitly requests it.

`main` remains untouched.
