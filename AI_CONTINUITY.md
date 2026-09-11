# Dinner Roulette — AI Continuity

_Last updated: September 11, 2026_

## Project state

- Active app: Dinner Roulette V.3.
- Repository: `caleb1234calvin-art/dinner-roulette`.
- Current working branch: `feature/dinner-icon-pack-1`.
- This branch is layered on `legal/third-party-compliance-pass-1`, which is layered on `audit/national-casino-pass-1`; it therefore contains the casino audit, legal/compliance pass, Dinner icon implementation, California/Oregon/Washington runtime work, and Nevada audit staging.
- Compliance PR: #28, based on `audit/national-casino-pass-1`.
- Startup-ident preview remains isolated on draft PR #30 (`brand/startup-ident-pass-1`); do not merge it merely because the preview is deployable.
- Restaurant icon work: Issue #29.
- `main` remains untouched unless Caleb explicitly requests a merge or direct change.
- ChatGPT is the only AI authorized to directly modify this repository unless Caleb explicitly asks another assistant to update a named file. Grok/SuperGrok may generate artwork and, when Caleb requests it, update this continuity file. Grok does not merge branches or ship assets to `main` without an explicit request.
- Dinner Roulette and the Jasper County audit are interconnected projects. Audit data, methods, infrastructure, and discoveries may feed Dinner Roulette.

## National casino audit continuity

The national casino audit is active on the current stacked working branch.

- **27 jurisdiction passes are complete and active** in the curated runtime, documented in `CASINO_AUDIT.md`.
- California is Pass 19: 74 CGCC regulator IDs fully accounted, 69 curated physical destinations active, five explicitly held/excluded/deduped. Runtime: `src/lib/nightlife/casino-catalog-pass-19.ts`.
- Oregon is Pass 20: 10 current physical destinations active, including Ko-Kwel Medford as a Class II destination in addition to the Class III-oriented compact set. Runtime: `src/lib/nightlife/casino-catalog-pass-20.ts`.
- Washington is Pass 21: 30 current physical tribal casino destinations active: 28 visible WSGC directory properties + Shoalwater reconciliation exception + Elwha River Class II. Runtime: `src/lib/nightlife/casino-catalog-pass-21.ts`.
- Oregon's post-implementation coordinate QA head `fa6fd94a2a3959aece0a9a339f6a8d58c69abaf5` passed branch workflow run `34566845887`; because Washington was inherited in that head, the corrected Oregon + Washington combined runtime state passed blocking typecheck/build/icon gates.
- California wiring head `468f861dc3421f708f368718b7a48c0ed93f2344` passed run `34558916921`. Washington wiring head `5eeea6d56ab8eff958513215d489cbc0b7608498` passed run `34565739203` before the later Oregon coordinate correction.
- The inherited npm test suite remains report-only in this workflow and must not be described as a strict clean test gate.

### Nevada — Pass 22 staged, not active

Nevada is the current audit jurisdiction. **Do not create or activate `casino-catalog-pass-22.ts` yet.** Nevada's licensing density and the difference between a nonrestricted gaming license and a Dinner Roulette destination casino require a statewide reconciliation before runtime activation.

Authoritative framework:

- Primary authority: Nevada Gaming Control Board (NGCB).
- NGCB Statistics & Publications provides active-location reporting including Location Detail, Location Name and Address, Restricted/Nonrestricted Location, and Nonrestricted Count reports.
- NGCB revenue reporting supplies the market segmentation used for reconciliation: Las Vegas Strip, Downtown Las Vegas, North Las Vegas, Laughlin, Boulder Strip, Balance of Clark County, Washoe County, South Lake Tahoe, Elko County, Carson Valley, and Balance of State.
- NGCB Tax & License issues gaming licenses and monitors Indian gaming. NIGC/current tribal evidence remains a required independent cross-check so tribal/Class II destinations are not missed.

Nevada artifacts currently staged:

- `audit/nevada-nonrestricted-casino-scope-2026-09-11.json` — authoritative scope and inclusion/exclusion policy.
- `audit/nevada-reconciliation-plan-2026-09-11.json` — 12-segment market-by-market reconciliation plan.
- `audit/nevada-strip-downtown-ledger-2026-09-11.json` — 40 Strip/Downtown candidate rows.
- `audit/nevada-clark-outer-ledger-2026-09-11.json` — 49 Boulder/Henderson, North Las Vegas, and balance-of-Clark candidate rows.
- `audit/nevada-laughlin-ledger-2026-09-11.json` — 9 Laughlin candidate/scope-review rows.
- `audit/nevada-northern-markets-ledger-2026-09-11.json` — 45 Reno/Sparks, Tahoe, Carson Valley, Elko and Wendover candidate rows.
- `audit/nevada-balance-state-ledger-2026-09-11.json` — 10 conservative rural/balance-of-state candidate rows plus mandatory tribal cross-check.
- `audit/nevada-statewide-candidate-accounting-2026-09-11.json` — accounting checkpoint proving the discovery ledgers currently contain **153 raw candidate/scope-review rows**.

The 153 figure is deliberately an oversized discovery universe, **not the final Nevada casino count**. Known closures/aliases/holds are already being separated: Mirage, Tropicana Las Vegas, Texas Station, Fiesta Rancho and Harrah's Reno are historical exclusions; The Cromwell is an alias/rebrand case; Eastside Cannery remains an operation-status hold; Bayshore Inn and retail-style gaming such as Dotty's remain scope-review/hold cases. Multi-casino campuses such as Venetian/Palazzo, Wynn/Encore and Reno's ROW require explicit identity/dedupe decisions rather than automatic merging or duplication.

Nevada activation gates:

1. Account the discovery universe against active NGCB nonrestricted locations.
2. Remove restricted/retail/route/non-destination operations that do not satisfy Dinner Roulette's physical-destination scope.
3. Reconcile current branding, aliases, closures, rebrands and same-property records.
4. Normalize current physical addresses and property-specific coordinates for every included destination.
5. Complete NIGC/tribal cross-check.
6. Produce a final all-row accounting artifact with no unexplained overlap or missing decisions.
7. Only then generate the Nevada runtime dataset, `casino-catalog-pass-22.ts`, wire search, run blocking validation and mark Nevada complete in `CASINO_AUDIT.md`.

### Casino audit operating rules

- Regulator/government sources are preferred for identity/roster truth; operator/property sources are secondary for current branding/address details.
- Coordinate provenance should be property-specific where possible; uncertain points are corrected before completion rather than treated as precision.
- Explicit exclusions, dedupes, status cautions and provenance notes are preferable to invented certainty.
- Curated casino records are a high-confidence backbone merged with live OSM discovery, not a replacement for live discovery.
- The national audit is not complete until all remaining applicable jurisdictions are reconciled and a final cross-jurisdiction duplicate/alias/retirement sweep passes.

## Legal/compliance pass

The goal is risk reduction while preserving Dinner Roulette's fundamental product structure. Do not describe the app as guaranteed legally compliant; legal conclusions remain attorney territory.

- Dinner Roulette is presented as an independent discovery/decision tool.
- Third-party names identify destinations/services without implying affiliation, sponsorship, endorsement or partnership.
- External links are third-party destinations and use safe external-link behavior.
- Changing facts such as hours, prices, ratings, admission and availability are verify-first information rather than guarantees.
- Nightlife/casino functionality is discovery and trip planning only. Dinner Roulette does not accept wagers, provide gambling, sell alcohol or guarantee admission.
- A central `LEGAL.md` notice exists and legal/privacy/third-party information is surfaced in Settings.

### Rideshare

- Keep neutral Dinner Roulette visual treatment; do not copy Uber/Lyft logos or trade dress.
- Keep visible `Drive sober` safety framing.
- Uber destination-aware `m.uber.com` launch is retained; Dinner Roulette passes the selected destination but does not request, price, book or guarantee a ride.
- Lyft uses the conservative public `ride.lyft.com` launch; the user finishes destination selection inside Lyft.
- Rideshare UI identifies services as independent third parties and notes availability/pricing vary.

### Delivery

- DoorDash, Grubhub and Uber Eats shortcuts open independent service home experiences.
- User searches for the selected restaurant after launch.
- Do not claim marketplace availability without an authorized/current integration.
- Do not scrape/copy marketplace menus, prices, fees, availability, ratings, photos or other marketplace content.
- Do not deep-link merchant/order pages unless current provider documentation clearly supports it.

## Restaurant icon system

Third-party restaurant logos/brand artwork are replaced in active Dinner presentation with Dinner Roulette-owned generic cuisine/category icons while factual restaurant names remain text.

- Tracked as Issue #29 and isolated on `feature/dinner-icon-pack-1`.
- Visual language: realistic claymation/tactile miniature food objects; rounded-square tiles; no text/logos/mascots/packaging/brand marks; cyan/teal-left and burnt-orange/terracotta-right luminous edge; dark charcoal tile and light pearl/soft-gray tile.
- 15 semantic categories per theme / 30 canonical assets: `burger`, `pizza`, `mexican`, `chinese`, `japanese`, `italian`, `steakhouse`, `bbq`, `chicken`, `cafe-bakery`, `dessert`, `seafood`, `buffet`, `breakfast`, `fallback`.
- Canonical layout: `public/dinner-icons/dark/<category>.jpg` and `public/dinner-icons/light/<category>.jpg`.
- Resolver: `src/lib/restaurants/dinner-icons.ts`; active Dinner shortlist/options and final results use local Dinner icons. Date Night/Nightlife artwork remain separate.

## Validation and maintenance

Workflow: `.github/workflows/validate-icon-pack.yml` on `feature/dinner-icon-pack-1`.

Blocking gates: dependency installation, TypeScript `tsc --noEmit`, development client/SSR/Nitro build and all 30 Dinner icon assets. The inherited `npm test` step is currently `continue-on-error: true` and therefore report-only.

Known legacy/template debt includes Grok/template documentation-contract tests expecting `.grok/skills/og/SKILL.md` and `.grok/skills/og/references/`. Do not fabricate placeholder docs solely to make those tests green; restore authoritative upstream docs or make those checks conditional/self-contained. PWA metadata tests were isolated from the real Pick For Us workspace identity using temporary fixtures.

Observed ecosystem/tooling warnings include Recharts 2.x, ESLint 9.x and Node-20-based internals in current action versions. Handle major upgrades as a separate regression-tested maintenance pass rather than changing them merely to silence warnings on this feature branch.

## Merge discipline

Dependency/load order remains:

`audit/national-casino-pass-1` → `legal/third-party-compliance-pass-1` → `feature/dinner-icon-pack-1`

PR #28 remains the legal/compliance review surface. Issue #29 tracks the Dinner icon system. Startup ident remains isolated on draft PR #30.

Preferred ship path is a dedicated integration/compatibility branch: assemble intended updates in dependency-aware order, resolve overlaps, run TypeScript/tests/build/visual checks on the combined app, and only then merge the stable assembled state into `main` after Caleb explicitly requests it.

`main` remains untouched.
