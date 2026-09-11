# Dinner Roulette — AI Continuity

_Last updated: September 11, 2026_

## Project state

- Active app: Dinner Roulette V.3.
- Repository: `caleb1234calvin-art/dinner-roulette`.
- **Current integration branch: `integration/active-work-pass-1`.**
- The former active stack (`audit/national-casino-pass-1` → `legal/third-party-compliance-pass-1` → `feature/dinner-icon-pack-1`) has been consolidated into the integration/reconciliation surface for validation. Preserve those histories; do not treat integration as authorization to delete provenance.
- `main` remains untouched unless Caleb explicitly requests a merge/direct change.
- ChatGPT is the only AI authorized to directly modify the repository unless Caleb explicitly authorizes another assistant for a named file.
- Dinner Roulette and the Jasper County audit remain interconnected.
- Caleb wants AI continuity kept current as work proceeds; update this file when project state, validation state, architecture, branch strategy, major audit decisions, or roadmap commitments materially change.

## Active integration validation — September 11

The integration branch now contains the active casino/runtime work through **casino catalog Pass 27**, the legal/compliance layer, the Dinner icon pack, and current project infrastructure.

Validation workflow `.github/workflows/validate-icon-pack.yml` has been repurposed as **Validate Dinner Integration**. It now triggers on `integration/active-work-pass-1` and performs dependency install, TypeScript checking, the casino audit, inherited tests as report-only, development build, and verification of all 30 Dinner icon assets.

First integration run (`34636890065`, commit `31d83f8a42f2ae8337ed9490287d4b35ff5bbda0`) proved TypeScript clean but correctly failed at the expanded casino audit before build/icon steps. This is a useful blocking failure, not a reason to bypass validation.

The audit exposed two classes of integration debt:

1. **Intentional/legacy overlap across catalog passes** — duplicate IDs or normalized names including Caesars New Orleans, Bellagio, Caesars Palace, Talking Stick Resort, Pechanga Resort Casino, Thunder Valley Casino Resort, Spirit Mountain Casino, and Wynn Las Vegas. These must be reconciled/deduplicated deliberately rather than silencing the validator.
2. **Jurisdiction-count accounting mismatches** — the expanded static parser reports some complete-state counts one lower or several lower than manifest expectations. Examples from the first run include Delaware, Missouri, Iowa, Kentucky, Louisiana, Mississippi, Arizona, California, Florida, and New York. The likely cause is a mix of historical overlap and the audit parser's source-counting assumptions; each mismatch must be reconciled rather than lowering authoritative expected counts merely to make CI green.

An integration overlay manifest now exists at `audit/casino-sources-integration.json`. It records current reconciled status for California, Oregon, Washington, Wisconsin, Idaho, Minnesota, Nebraska, Wyoming, South Dakota, North Dakota, Florida, New York, and Nevada. Nevada remains explicitly pending/rolling: its 174 rows are an audit decision universe, not a claim of 174 runtime casinos.

### Current integration rule

**Do not merge to `main` while the integration validator is red.** Fix audit/runtime reconciliation first, rerun the workflow, then inspect build, icons, and inherited-test reporting. A green integration run is a prerequisite for considering a ship/merge decision, not automatic authorization to merge.

## National casino audit — rolling implementation strategy

Preferred cadence is **50–100 verified casino destinations per implementation batch**:

`discover → verify → batch 50–100 → implement → validate → continue discovery → re-audit prior batches → correct as needed`

Statewide perfection is not required before clean records enter staged runtime. Each property must individually clear current identity/operation, Dinner Roulette destination scope, normalized address, property-specific coordinates, stable ID and duplicate/alias QA. Ambiguous properties remain staged instead of blocking clean records.

Government/regulator evidence remains preferred for roster/identity truth; first-party property sources support operation/branding/address. Nonrestricted gaming status alone is not automatic inclusion. Restricted slot-only, route/distributed retail, online-only and ordinary retail gaming remain outside the curated backbone unless independently justified as destination casinos.

## National progress

Casino catalog modules now run through **Pass 27** on the integration branch. California Pass 19, Oregon Pass 20 and Washington Pass 21 remain active. Nevada began the rolling model in Pass 22; later passes add additional reconciled jurisdictions including Wisconsin/Idaho, Minnesota/Nebraska/Wyoming, South Dakota/North Dakota, Florida and New York.

## Nevada — rolling runtime

Nevada's provisional audit decision universe remains **174 rows**, not a final casino count. Runtime ingestion is rolling in verified batches.

### Nevada runtime Batch NV-01 / Pass 22

- Audit artifact: `audit/nevada-runtime-batch-1-2026-09-11.json`
- Runtime module: `src/lib/nightlife/casino-catalog-pass-22.ts`
- Size: **50 curated Nevada casino destinations** before integration dedupe reconciliation.
- Composition: **28 Las Vegas Strip + 12 Downtown Las Vegas + 10 high-confidence off-Strip/south Clark County destinations**.
- Search integration: casino passes through Pass 27 are imported into `ALL_CURATED_NIGHTLIFE` in `src/lib/nightlife/search.ts`.
- Cromwell/The Vanderpump Hotel remains in nightlife alias matching to reduce live-OSM duplicate risk during the 2026 rename transition.
- Batch explicitly does **not** claim Nevada statewide completeness.

Important Nevada artifacts remain `audit/nevada-scope-address-pass-4-2026-09-11.json`, `audit/nevada-rural-completeness-recovery-2026-09-11.json`, `audit/nevada-rural-recovery-pass-5-2026-09-11.json`, `audit/nevada-rural-completeness-pass-6-2026-09-11.json`, `audit/nevada-statewide-candidate-accounting-2026-09-11.json`, and `audit/nevada-runtime-batch-1-2026-09-11.json`.

Unresolved/staged Nevada work should not block clean future batches: Winnemucca/I-80 cluster, Stockmen's Gambling Hall Fallon, Red Drag Elko, The Nevada Casino & Bar Battle Mountain, Longstreet address-number normalization, Buffalo Bill's/Whiskey Pete's current-operation state, and further rural omissions found by later sweeps.

## Legal/compliance continuity

Dinner Roulette is an independent discovery/decision tool. Third-party names identify destinations/services without implying affiliation. Casino/nightlife remains discovery/trip planning only; Dinner Roulette does not accept wagers, provide gambling, sell alcohol or guarantee admission. `LEGAL.md` and Settings carry legal/privacy/third-party information.

Rideshare/delivery integrations remain neutral shallow launches unless an authorized provider integration says otherwise. Do not scrape marketplace menus/prices/availability/ratings or imply partnership.

## Restaurant icon continuity

Issue #29 remains the original Dinner icon system: 15 semantic categories per theme / 30 canonical assets under `public/dinner-icons/{dark,light}/`, resolved by `src/lib/restaurants/dinner-icons.ts`. The icon assets are part of the active integration branch but their presence alone is not authorization to merge.

## Caustic Relay / startup-ident continuity

**Caustic Relay** is the active working maker/publisher brand. The canonical black-mamba/scorpion hybrid creature is an immutable source asset unless Caleb explicitly requests redesign. The startup-ident narrative remains stable relay → pincer pinch → rupture → brief dropout → damaged return → progressive rendering-fidelity collapse. Final treatment should darken the world/static around the creature without altering the creature itself and avoid large bright flashes/strobing.

Startup-ident work remains review/staged work and should be integrated only after the current compatibility/audit gate is green. Preserve clean and intermediate source assets rather than destructively overwriting provenance.

## Future food-truck discovery

Caleb wants food trucks supported in a future dedicated pass. Treat food trucks as a **mobile-venue subtype**, not ordinary fixed restaurants. Future states should distinguish **live/serving now**, **scheduled today**, and **discovered nearby**. Never roulette a user to a stale registered business address as though a truck is confirmed there. Use authorized/current data or provider-supported links and distinguish scheduled evidence from verified live presence.

## Merge discipline

Current ship path is `integration/active-work-pass-1` as the compatibility/validation surface. Preserve historical feature/audit/legal branches as provenance where they still exist. Do not merge the integration branch or any remaining feature branch to `main` unless Caleb explicitly requests it.

`main` remains untouched.
