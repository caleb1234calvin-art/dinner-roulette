# Dinner Roulette / Pick For Me — AI Continuity

Updated September 13, 2026. **Casino + location/international reconciliation is now authorized in non-production.** This existing shared file on integration/active-work-pass-1 is the authoritative handoff.

## Latest meaningful checkpoint

Dedicated combined candidate established from the latest 883-casino integration, before location code is imported.

Work branch: `integration/casino-location-reconciliation-2026-09-13`. Work commit: **`17ff681c7e99f2814d2bd9ccdda9e14b39b0e44a`** — **Checkpoint frozen 883-casino base for location reconciliation**.

Current working branch: `integration/casino-location-reconciliation-2026-09-13`. Frozen starting integration: `183d3e1d71355a27e4bc35a2969d73037c9e6e33`. Preserved location source: `integration/location-international-2026-09-13` at `4a93870c05ec53bd49fae5143df420c301696839`, draft PR #39. Main baseline: `c187d518cf8b0c8b9202ee0ae6493667eb4c0ab5`.

## COMPLETED in this reconciliation

- Read both pinned source branches and required handoff/evidence records.
- Classified all five overlapping paths and all 30 location paths; current casino integration is the source of truth for all frozen data and newer browser/provider guards.
- Published audit/casino-location-reconciliation-plan-2026-09-13.md with intended resolution and safety/validation sequence.
- Created the candidate from shared checkpoint 0874f0b; baseline audit records protected file Git blobs and both source test-file inventories. All protected casino data, closure policy and freeze evidence match the current freeze.

## Validation of the combined work

Baseline catalog and national audits pass: 883 canonical / 899 serialized / 60 passes, NV204 / OK113 / CO31 / TX4. Combined runtime validation remains pending.

Independent baselines are historical, not a combined result: casino freeze 329 passed (278 repository + 51 application), four skips, 16 browser groups; location source 342 passed (273 repository + 69 application), four skips, 12 location checks. Casino CI Run 325 and location CI Run 314 passed separately. Never add those totals together.

## Frozen casino invariant

**883 canonical destinations; 899 serialized rows; 60 passes. NV 204 / OK 113 / CO 31 / TX 4; focus 352; +152 from 731.** Preserve 16 superseded rows, 18 bounded closure-rule groups, current alias/canonical routing safeguards and all freeze evidence. No casino discovery or inventory change is part of reconciliation. NV/OK substantially expanded, not proven statewide exhaustive.

## OPTIONAL / FUTURE — seven casino evidence holds

- **Horseshu — Jackpot** — separate-floor-scope. Recheck only when: Current operator statement or dated floor-specific evidence confirming public gaming at Horseshu itself, plus a named building point; historical hotel/casino labels do not qualify.
- **Moapa Paiute Travel Plaza** — current-gaming-status-and-scope. Recheck only when: Dated tribal/operator confirmation that a public dedicated casino floor is operating, resolving the closed casino listing; then verify the floor's property point.
- **Wigwam Restaurant & Casino — Fernley** — floor-location-and-address. Recheck only when: Operator-confirmed casino building/entrance geometry tying 255/265 W Main and the KML point to the operating floor.
- **Border Inn Casino — Baker** — casino-side-boundary-location. Recheck only when: Casino-building or entrance coordinates with reliable boundary/parcel geometry proving the Nevada gaming side, independently of hotel/RV points.
- **C Punch / Lovelock Junction — Lovelock** — rebrand-and-current-gaming-floor. Recheck only when: Current operator or floor-specific evidence of active public casino gaming at 1420/1440 Cornell, with renamed identity and property point reconciled.
- **Chickasaw Travel Stop Thackerville** — current-separate-gaming-room-scope. Recheck only when: Dated operator confirmation or verifiable current on-site evidence of a separate internal CTS gaming room after the Border Casino expansion, with identity and address distinct from Border Casino.
- **Off the Rails Casino — Lovelock** — current-identity-and-property-point. Recheck only when: Current operator identity and a named casino/building point at 150 Main, or a documented successor/closure; reject generic Lovelock coordinates.

The watchlist has **28 entries**: 18 runtime closure groups, seven candidate holds, two resolved original holds retained as history and one preopening property. Rule groups are not a physical-destination count. No recurring monitoring was created.

## Four legitimate documentation skips

All four are **B: intentionally external by design / A: unavailable in a clean repository-only checkout**. They concern the external OG assistant documentation package, not casino behavior. Their original assertions run when that package is installed; `REQUIRE_WORKSPACE_DOCS=1` fails closed. No skip was removed or weakened.

1. `scripts/brand-check.test.mjs`: “SKILL.md and AGENTS.md name the marker path and bound this script uses”.
2. `scripts/brand-check.test.mjs`: “the sections that own the brand-task prohibition never affirm a wait”.
3. `scripts/brand-check.test.mjs`: “SKILL.md tells the pass to self-check with the flag this CLI accepts”.
4. `scripts/write-atomic.test.mjs`: “every hand-over the og skill prints is one this script accepts”.


## BLOCKED / current integration gates

No environmental blocker identified. Implementation, combined validation and adversarial review are pending.

## Exact next action

Bring forward the shared LocationControl, controller/model, persisted-location guards and necessary geocoder/types dependencies. Reconcile visible recovery and busy handling; run location unit tests and typecheck before the next checkpoint.

## DEFERRED

Physical-phone GPS and actual OS permissions, installed PWA, authenticated hosted sessions and external Maps app navigation remain unverified. Local simulated Chromium coordinates are not physical-device proof. Follow the pinned LOCATION_HANDOFF.md ten-step device checklist and audit/casino-browser-release-checklist-2026-09-13.md during a separately authorized release. Destination-local opening hours/timezones, localization, units/currency and ambiguous city selection remain optional future work.

## REQUIRES USER AUTHORIZATION

Main promotion, hosted/Vercel deployment, production changes, database migrations, credentials/secrets changes and recurring monitoring require separate authorization. None is performed here. No Exa use. Existing integration/** Git deployment exclusion remains. No migration-triggering build shortcuts.

## Evidence and recovery

Reconciliation decisions: audit/casino-location-reconciliation-plan-2026-09-13.md. Frozen source evidence: audit/casino-final-freeze-2026-09-13.json, audit/casino-freeze-adversarial-2026-09-13.json, audit/casino-freeze-live-provider-findings-2026-09-13.json, audit/casino-freeze-browser-evidence-2026-09-13.json and audit/casino-status-watchlist-2026-09-13.json. The location handoff/architecture/validation source is pinned to 4a93870 before combination; its 808-casino baseline must never replace the freeze. Earlier casino history remains in Git at 183d3e1 and the existing audit archives.

Safe commands: `npm test`, `npm run typecheck`, `npm run audit:casinos`, `npm run build:dev`, `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`. **Never npm run build: it chains migrations.**

Local checkout: /workspace/scratch/60ab73826fd9/pick-for-me-casino. Inspect branch, dirty state and remote refs before resuming. Revert only non-production reconciliation commits if necessary; preserve the original casino/source branches and evidence. No database rollback is needed.

## Chronological reconciliation commits

- `bdf63c056dfb3d8c52830b425a3aed12e46a1a8c` | `integration/active-work-pass-1` | Document casino and location reconciliation source-of-truth plan
- `0874f0ba42490370ba1704d96b3252adabf92f49` | `integration/active-work-pass-1` | Update shared continuity: reconciliation plan verified
- `17ff681c7e99f2814d2bd9ccdda9e14b39b0e44a` | `integration/casino-location-reconciliation-2026-09-13` | Checkpoint frozen 883-casino base for location reconciliation

This update records already-known work commits. Its own immutable documentation commit SHA is subsequent; inspect the current shared GitHub ref and Actions status. Every major checkpoint is saved and read back from GitHub before the next phase.
