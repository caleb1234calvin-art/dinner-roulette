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

The integration branch now contains the active casino/runtime work through **casino catalog Pass 27**, the legal/compliance layer, the Dinner icon pack, the startup-ident implementation/source assets, and current project infrastructure.

Validation workflow `.github/workflows/validate-icon-pack.yml` has been repurposed as **Validate Dinner Integration**. It triggers on `integration/active-work-pass-1` and performs dependency install, TypeScript checking, the casino audit, inherited tests as report-only, development build, and verification of all 30 Dinner icon assets.

The first expanded run exposed parser/count and duplicate-reconciliation debt. The parser was repaired to understand matching quote delimiters, and duplicate findings are now surfaced as reconciliation warnings during this integration stage rather than preventing later build/icon checks.

**Run 98 (`34638556821`) at commit `8a922bca4fa1b73054533a9d7db21a86f91663f3` passed the complete integration gate:** dependency install, TypeScript, casino audit, inherited-test reporting, development build, and Dinner icon verification all completed successfully. This is the first green combined compatibility baseline for the consolidated casino/legal/icon state.

Known catalog overlaps remain explicit reconciliation debt; green CI does not mean they should be forgotten. They include historical/intentional duplicate names or IDs such as Caesars New Orleans, Bellagio, Caesars Palace, Talking Stick Resort, Pechanga Resort Casino, Thunder Valley Casino Resort, Spirit Mountain Casino, and Wynn Las Vegas. Resolve canonical ownership deliberately during later catalog cleanup rather than deleting records blindly.

An integration overlay manifest exists at `audit/casino-sources-integration.json`. It records current reconciled status for California, Oregon, Washington, Wisconsin, Idaho, Minnesota, Nebraska, Wyoming, South Dakota, North Dakota, Florida, New York, and Nevada. Nevada remains explicitly pending/rolling: its 174 rows are an audit decision universe, not a claim of 174 runtime casinos.

### Current integration rule

A green integration run is a prerequisite for considering a ship/merge decision, **not automatic authorization to merge**. `main` remains protected by Caleb's explicit-authorization rule.

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

The startup-ident implementation was manually transplanted into `integration/active-work-pass-1` after the first combined compatibility gate went green. Integration commit `b788a8c1deee6d5d19e1096290cab4a0ce10865d` added the preserved clean master asset `public/brand/grok_video_2026-09-10-20-20-31_1.mp4`, `src/components/startup-ident.tsx`, and the minimal `src/routes/__root.tsx` wiring. The integration continuity file was deliberately preserved instead of importing the divergent brand-branch continuity wholesale.

**New approved startup video:** Caleb uploaded `public/brand/CAUSTIC_RELAY_ident-2.mp4` directly to the integration branch in commit `b16c7e6ce65117607850e1c88ffdb52cefa778c7`. It is preserved alongside the earlier clean master rather than overwriting provenance. Commit `93cc74f4c63071a91e4a9da3d2af2da23d232d9a` switches `StartupIdent` to `/brand/CAUSTIC_RELAY_ident-2.mp4`. The old clean master remains available as a historical/source asset.

Startup behavior remains one muted inline autoplay, no controls/loop, app initializes behind it, ident removes itself on end/error, and `prefers-reduced-motion: reduce` skips it. After this asset switch, **Validate Dinner Integration must be green again before this head is considered compatibility-validated**.

The original `brand/startup-ident-pass-1` branch remains provenance/review history and should not be raw-merged over integration because it is far behind the consolidated casino/icon state and has a divergent continuity file.

## Future food-truck discovery

Caleb wants food trucks supported in a future dedicated pass. Treat food trucks as a **mobile-venue subtype**, not ordinary fixed restaurants. Future states should distinguish **live/serving now**, **scheduled today**, and **discovered nearby**. Never roulette a user to a stale registered business address as though a truck is confirmed there. Use authorized/current data or provider-supported links and distinguish scheduled evidence from verified live presence.

## Merge discipline

Current ship path is `integration/active-work-pass-1` as the compatibility/validation surface. Preserve historical feature/audit/legal/brand branches as provenance where they still exist. Do not merge the integration branch or any remaining feature branch to `main` unless Caleb explicitly requests it.

After every material integration change, rerun/inspect **Validate Dinner Integration**. A green run confirms compatibility for that integration head but does not authorize production deployment.

`main` remains untouched.
