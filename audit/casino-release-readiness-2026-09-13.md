# Pick For Me — casino freeze before location integration

Updated September 13, 2026. **883 canonical destinations / 899 serialized rows / 60 passes.** Nevada **204**, Oklahoma **113**, Colorado **31**, Texas **4**; four-state total **352**. **26 additions in this completion pass** (23 NV + 3 OK), **152 additions from the original 731 baseline**. The 16 superseded historical rows remain preserved.

The finite reviewed casino queue is exhausted under currently available evidence. **Freeze decision A: no meaningful casino work remains from this queue before separate location integration.** Nevada and Oklahoma are substantially expanded, not proven exhaustive statewide. Future evidence can reopen the explicit holds; theoretical completeness is not a release blocker.

## COMPLETED

- Eight original holds reinvestigated; Konawa/Rivermist and Broadway Colt promoted using reconciled property points. Six original holds remain; Off the Rails Lovelock adds one new hold, giving **seven unresolved candidate holds**.
- Pass 59 adds 23 Nevada properties from Truckee/Pioneer Crossing, Pahrump operators, Searchlight, Wildfire, The Greens and verified independents. Pass 60 adds Konawa, Pawnee Trading Post and TeePee Yale. Individual sources and rejected map/address conflicts are in the pass sidecars.
- **No existing canonical record was removed, merged, renamed or repinned in this final pass.** Reviewed live-provider aliases were reconciled. Gold Town Pahrump was classified closed (May 24, 2026) and guarded against stale live tags; no active canonical Gold Town row was removed.
- Two retail exclusions: Seminole Nation Rivermist Retail and O-Gah-Pah Convenience Store, neither supported as a separate gaming floor. One preopening deferral: North Fork Mono, whose announced October opening is not proof of current operation.
- Adversarial review rejected the provisional CTS Thackerville addition because current separate-room scope remains unproven. The draft is retained in the research checkpoint. A live-browser review then exposed closed Southwind and casino-alias leaks; those were corrected and the gates rerun.
- **329 unique tests passed** (278 repository + 51 application), **zero failures**, **four understood external-documentation skips**. The 80 casino tests are included in that total. Typecheck, schema/export/ID/chronology/manifest audits, changed-code lint, 30 Dinner icons, development build and migration-free production build passed.
- Primary and targeted adversarial checks passed: six new nearby pairs retain distinct gaming floors, zero new nearby alias collisions, zero new pairs under 0.075 miles. Historical casino records were reference context, not manually re-researched wholesale.
- No dependency, lockfile, build configuration, migration or location/international implementation change. Vercel Git deployment remains disabled for integration/**.

## Browser and CI

All **16 deterministic local Chromium check groups** passed against the current production-mode build with sign-in rendering enabled. The real-provider browser check passed **six regions** (Reno, Newkirk, Ardmore, Chandler, Pahrump and Pawnee), with **0 final errors and 0 final findings**. Transport recorded 24 Overpass HTTP 200 responses, 2 Nominatim HTTP 200 responses and 12 provider timeouts; honest fallback remains part of the tested behavior. Desktop 1280×800 and mobile viewport 390×844 were exercised. Physical GPS, hosted acceptance, authenticated sessions and external Maps-app launch remain unverified.

CI publication is pending; no success is inferred.

The first final-pass live run passed its mechanical UI assertions but manual review found stale/duplicate provider names. It is preserved as a diagnostic attempt, not the accepted final browser gate. Captured public OSM entities are replayed by a regression test; the reviewed Newkirk/Pahrump/Pawnee pools have explicit live-browser count checks. Newly appearing live inventory in those finite reviewed pools requires investigation rather than automatic acceptance.

## BLOCKED — exact remaining casino evidence

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

## DEFERRED / OPTIONAL

Location/international PR #39 stays separate and unmerged. Physical-phone GPS, installed PWA, hosted/account and external Maps acceptance follow the checklist during a separately authorized release. Further statewide research and dated reopening checks may be resumed when new evidence appears; no continuous monitoring is scheduled.

## Exact next action

Publish the casino candidate, require green CI, merge only into integration/active-work-pass-1 and record its CI before handoff.

## REQUIRES USER AUTHORIZATION

Main promotion, hosted/Vercel deployment, production writes, database migrations, secrets/credential changes and recurring monitoring require separate explicit authorization. **Main and production remain untouched; no Vercel deployment, database migration, location merge, recurring monitoring or Exa use occurred.**

Recovery: review a non-production revert or restore pre-freeze base `f2fd0f7f4737278126d72b0cc043c79db7652236`, preserving all historical evidence and both candidates. No database rollback is needed. Before a later release, verify the served revision and complete `audit/casino-browser-release-checklist-2026-09-13.md`.

## Evidence / changed files

`audit/casino-final-freeze-2026-09-13.json` records counts, changes, holds, validation, publication and the exact changed-file list. Pass 59/60 evidence sidecars retain source provenance and numerical points. `casino-freeze-adversarial-2026-09-13.json` records new-pair review; `casino-freeze-live-provider-findings-2026-09-13.json` preserves the failed manual acceptance and public provider samples; `casino-freeze-browser-evidence-2026-09-13.json` records the final browser gate. The pre-freeze continuity/progress are archived, not overwritten as history.

Safe commands: `npm test`, `npm run typecheck`, `npm run audit:casinos`, `npm run build:dev` and `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`. **Never use `npm run build`: it chains database migrations.**
