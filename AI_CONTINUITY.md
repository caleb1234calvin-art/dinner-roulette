# Dinner Roulette / Pick For Me — AI Continuity

Updated September 13, 2026. **Casino + location/international reconciliation is now authorized in non-production.** This existing shared file on integration/active-work-pass-1 is the authoritative handoff.

## Latest meaningful checkpoint

FIRST COMPLETE GREEN COMBINED CANDIDATE. Frozen casinos and international/GPS behavior now pass all available automated, build and actual-provider browser gates together.

Work branch: `integration/casino-location-reconciliation-2026-09-13`. Work commit: **`13a40902ac2610112862e665571d4ba1cf0d2222`** — **Record first fully green combined casino and international candidate**.

Current working branch: `integration/casino-location-reconciliation-2026-09-13`. Frozen starting integration: `183d3e1d71355a27e4bc35a2969d73037c9e6e33`. Preserved location source: `integration/location-international-2026-09-13` at `4a93870c05ec53bd49fae5143df420c301696839`, draft PR #39. Main baseline: `c187d518cf8b0c8b9202ee0ae6493667eb4c0ab5`.

## COMPLETED in this reconciliation

- Read both pinned source branches and required handoff/evidence records.
- Classified all five overlapping paths and all 30 location paths; current casino integration is the source of truth for all frozen data and newer browser/provider guards.
- Published audit/casino-location-reconciliation-plan-2026-09-13.md with intended resolution and safety/validation sequence.
- Created the candidate from shared checkpoint 0874f0b; baseline audit records protected file Git blobs and both source test-file inventories. All protected casino data, closure policy and freeze evidence match the current freeze.
- Forwarded general location model, explicit-action GPS/controller, global geocoder dependencies and compatible persistence. Coordinates activate before reverse enrichment; manual editing/cancel/unmount invalidate stale callbacks.
- Preserved casino automatic manual recovery on errors and disabled GPS during any busy request. Added controller-level duplicate-request suppression plus cancellation/retry regressions.
- Resolved an inherited location model lint error with equivalent control-character validation; no input check weakened.
- Applied only the location delta to current Nightlife search: all Pass 55–60 registrations remain; current closure/alias policy and canonical routing metadata are unchanged.
- Forwarded international addresses, exact-coordinate Maps links, geographically bounded Joplin exclusions and valid-empty versus malformed/incomplete provider handling across all discovery categories.
- Imported all ten location discovery/persistence/Maps regression groups and their real application-module loader/fixtures.
- Verified all 30 existing test files unchanged and all original location assertions retained by AST comparison; no test file or assertion silently disappeared.
- Added three combined geocoder-to-casino-server-to-Maps regressions, in addition to the two controller race/request tests. Ran the actual complete test runner.
- Reconciled casino harness input/Maps assertions while retaining all 16 groups, canonical counts, strict ports, owned process cleanup and live semantic pool guards.
- Location harness retains all 12 original behavior groups and adds two for immediate coordinate/progress and repeated-request prevention; errors now prove automatic manual recovery.
- Added source/output build fingerprints, auth-enabled checks and two guard regression tests. An actual occupied-port negative check confirmed the location harness refuses an unrelated preview.
- Both safe builds passed; inspected mobile location and desktop casino screenshots. CI now runs both guarded browser suites after the same direct migration-free production build.
- Final full test runner: 293 repository + 71 application = 364 passed; zero failures and four understood documentation skips. All 30 changed code files pass lint; typecheck, catalog/manifest audits and 30 Dinner icons pass.
- Reverified 78 protected frozen files byte-for-byte and unchanged dependency manifest/lockfile, Vite configuration and integration deployment exclusion. Main c187d5 and original location source 4a93870 remain unchanged.
- Added actual four-city international browser acceptance (Toronto, Vancouver, Montréal, London), using the combined app/RPC and real Nominatim/Overpass without provider mocks.
- Preserved failed first casino live attempt: clearPermissions did not establish denial. Harness now explicitly denies and verifies browser permission before testing recovery; semantic findings now make the real runner fail.
- Actual casino browser PASS in Reno/Newkirk/Ardmore/Chandler/Pahrump/Pawnee with pools 19/3/2/1/5/2, zero errors/findings and successful real manual geocoding. Native denial/recovery passes in a fresh explicitly denied context.
- Isolated Chromium probe proves same-document cached positions can survive emulated permission revocation; fresh denied contexts deliver native code 1. No product permission rule was changed.
- Actual Toronto geocoding succeeds but restaurant discovery exceeded 110 seconds; Vancouver live discovery passed with 393 eligible one-mile restaurants. A benchmark of the actual normalizer measured 435/1202/4062ms for 500/1000/2000 distinct rows, confirming quadratic duplicate work.
- PR #42 is open for non-production integration only. This work checkpoint also reconciles the known shared-document ancestry; no runtime/data content was taken from the old location base.
- Completed the old-normalizer international run: Toronto, Montréal and London each exceeded 110 seconds; Vancouver passed. All four real manual geocoders resolved. Failed results are preserved.
- Replaced only the all-pairs restaurant duplicate candidate scan with Earth-centered spatial cells, retaining namesMatch, strict 0.2-mile haversine threshold, source priority and output order. Local overlay eligibility remains the exact same <8-mile rule.
- New regressions prove legacy parity, source/order/boundaries, antimeridian/polar behavior and 8000-row retention. Actual normalizer benchmark: 2000 rows 4062ms before / 111ms after; 16000 rows 936ms locally. No filter, radius, selection or casino rule changed.
- PR #42 CI Run 335 passed at d46154381cbdc8a6de4af78f9b696384b330c388 before this fix; its result is not claimed for the newer head.
- Fresh post-fix development and auth-enabled production builds pass without migrations. Both deterministic browser suites pass against that exact source/output fingerprint: 16 casino + 14 location groups.
- Actual post-fix international app/RPC acceptance passes Toronto 1623, Vancouver 393, Montréal 1010 and London 2176 eligible one-mile restaurants, exact Maps points, country/region metadata and persisted reload without GPS. Counts are observations with open-now disabled, not complete inventories.
- Final actual-provider casino acceptance passes all six regions with zero findings/errors and native denial/manual recovery; provider timeouts are honestly handled.
- Exact runtime/test head bdc05dee1bb15807c0f70d25e48c12fb37eea8f0 passed CI Run 337 (34778760104, job 103781770405): clean install, 367 tests, typecheck, audits, both builds, both browser suites and 30 icons. CI/local source fingerprint matches.

## Validation of the combined work

367 unique tests PASS (296 repository + 71 application), 0 failures, 4 understood external-doc skips. Typecheck/lint/schema/ID/chronology/manifest audits and 30 icons PASS. Safe dev and auth-enabled production builds PASS. 30 deterministic browser groups PASS; real-provider casino 6/6 regions and international 4/4 cities PASS. Exact runtime CI Run 337 PASS.

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

No known implementation or available-validation blocker remains. Final focused adversarial review/scope check and controlled non-production PR #42 integration remain. Physical-device/hosted/account/Maps-app checks remain unverified later release acceptance.

## Exact next action

Perform the final adversarial review of only reconciliation changes, freeze-file/test retention and browser/CI safeguards. Publish its result, then verify exact candidate CI and integrate PR #42 into integration/active-work-pass-1 only. Verify resulting integration CI and update this same shared continuity with final commit details.

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
- `198ccc91bc2f6169e86fe0c664916cfeb55f324b` | `integration/active-work-pass-1` | Update shared continuity: casino-based combined branch established
- `b8ce7f85960fd36be60a2df75595d8a003104e52` | `integration/casino-location-reconciliation-2026-09-13` | Reconcile shared location controls with visible recovery and request guards
- `1d7834ef2771395c2c0f3cecd23d4373deedb396` | `integration/active-work-pass-1` | Update shared continuity: shared location controls validated
- `0c11bb2d5ad2b74389f2b61f4098d5b53fb8c9f2` | `integration/casino-location-reconciliation-2026-09-13` | Reconcile international discovery while preserving frozen casino safeguards
- `5a7431175b39d401974c414586520fa57f024c8f` | `integration/active-work-pass-1` | Update shared continuity: international and casino provider paths validated
- `f67cd8aee3e10396824782530bee8cae5e058331` | `integration/casino-location-reconciliation-2026-09-13` | Preserve both test suites and add combined casino location regressions
- `a454f9977c7feb2d39c64594b62c6ebc02207d7c` | `integration/active-work-pass-1` | Update shared continuity: combined 362-test suite verified
- `b53165392f3aa0861f43aa3a618bd443534e1b6a` | `integration/casino-location-reconciliation-2026-09-13` | Combine guarded casino and location browser acceptance
- `36053a8a00c5d0d76e83d64431916d90607ecd74` | `integration/active-work-pass-1` | Update shared continuity: combined browser harnesses validated
- `08555508f736e7d42fe559e7abf8276defe92061` | `integration/casino-location-reconciliation-2026-09-13` | Prepare real-provider acceptance and record 364 passing combined tests
- `c03142d010658bff131568408cbf2a407f3ef101` | `integration/active-work-pass-1` | Update shared continuity: final automated gates and live retry checkpoint
- `d46154381cbdc8a6de4af78f9b696384b330c388` | `integration/casino-location-reconciliation-2026-09-13` | Validate live casino recovery and record dense-city discovery bottleneck
- `aecebb37ed26fc862484a23c97c79e921b6e48b2` | `integration/active-work-pass-1` | Update shared continuity: live casino green and dense-city blocker recorded
- `bdc05dee1bb15807c0f70d25e48c12fb37eea8f0` | `integration/casino-location-reconciliation-2026-09-13` | Bound restaurant duplicate searches for dense international cities
- `2f1fe9b47b5cf211db318ce88102efb7ed0b5615` | `integration/active-work-pass-1` | Update shared continuity: dense-city fix passes 367 combined tests
- `13a40902ac2610112862e665571d4ba1cf0d2222` | `integration/casino-location-reconciliation-2026-09-13` | Record first fully green combined casino and international candidate

This update records already-known work commits. Its own immutable documentation commit SHA is subsequent; inspect the current shared GitHub ref and Actions status. Every major checkpoint is saved and read back from GitHub before the next phase.
