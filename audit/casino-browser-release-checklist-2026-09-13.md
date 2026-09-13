# Pick For Me combined casino + location release checklist

Updated September 13, 2026 after non-production reconciliation. **883 canonical destinations / 899 serialized rows / 60 passes; NV 204 / OK 113 / CO 31 / TX 4.** This is the current combined acceptance checklist. The existing shared `AI_CONTINUITY.md` remains the sole authoritative continuity.

Validated combined reference: `integration/active-work-pass-1` at `40f9fb8d162caac061fcf7927894bd2107b434ad`, [CI Run 346](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34779588384). PR #42 merged the combined implementation at `189c46bfee0ac0983ea9100eae90e92ee58915b7`. Later documentation commits do not change that runtime. Always inspect the actual selected release SHA and its CI before release.

## Completed validation

- **367 unique tests passed**: 296 repository + 71 application; zero failures and four explained external-documentation skips. The 83 casino regression subset is included.
- Typecheck, changed-code lint, catalog/schema/ID/chronology/manifest audits, development build, migration-free auth-enabled production build and all 30 Dinner icons passed.
- **30 deterministic local Chromium groups passed**: 16 casino + 14 location. They exercise the actual application/RPC and catalog with explicit provider fixtures, simulated native coordinates/permissions, desktop 1280×800 and mobile viewport 390×844.
- Casino checks cover tour/navigation, current fallback pools (Reno 19 / Newkirk 3), strict open-now/empty behavior, distinct choices, reroll, persisted exclusions, canonical Maps points, visible location errors/manual recovery, and non-casino navigation.
- Location checks cover no automatic GPS, immediate coordinates before reverse enrichment, visible progress, busy guards, permission/error recovery, global manual choices, stale-callback invalidation, persistence, exact Maps points, all three discovery categories and 390px layout.
- **Actual-provider acceptance passed six casino regions**: Reno 19, Newkirk 3, Ardmore 2, Chandler 1, Pahrump 5 and Pawnee 2 eligible destinations. Final runs had no semantic findings or page errors. Fallback observations are not proof of a live-provider success.
- **Actual Nominatim/Overpass acceptance passed Toronto, Vancouver, Montréal and London**, with respective one-mile restaurant observations 1623 / 393 / 1010 / 2176. Open-now was deliberately disabled. These are observed eligible pools, not complete inventories or proof of current operation.
- Actual-provider runs use no provider mocks. Final transport evidence records 40 HTTP 200 responses and 16 timeouts; availability is best effort and fallback is disclosed honestly.
- Primary and targeted adversarial reviews passed. All 78 protected frozen files, closure/alias policy, seven held candidates and original tests remain intact.

Evidence: `audit/casino-location-reconciliation-validation-2026-09-13.json`, `-browser-`, `-adversarial-`, `-performance-` and `-attempts-` files. Historical 857/329/342 figures in older evidence are not current combined results. CI browser artifacts have 14-day retention; tracked verdict summaries preserve the accepted findings.

These checks do **not** establish physical GPS, actual OS permission dialogs, installed PWA behavior, hosted/account acceptance or external Maps-app navigation. Mobile viewport emulation is not physical-device testing.

## Reproduce safely in a disposable local checkout

Use Node 22, the selected candidate revision and a trusted installed Playwright Chromium. On a clean machine, install Chromium using `npx playwright install --with-deps chromium` when permitted; do not bypass TLS verification. Installing a browser is not deployment.

If using this session's existing Chromium, both executable variable names are needed because the location harness has its own supported override:

```sh
export CASINO_BROWSER_EXECUTABLE_PATH=/workspace/scratch/60ab73826fd9/browser-engine/chromium
export PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH="$CASINO_BROWSER_EXECUTABLE_PATH"
```

That path is session-specific; use an existing trusted executable or Playwright's installed default in another environment.

The subshell below stops on failure. Capture build inputs **before** the safe production build; complete the proof **only after** it succeeds. Do not change application inputs or build development output between completing the production proof and running the browsers.

```sh
(
  set -eu
  npm ci --no-audit --no-fund
  npm test
  npm run typecheck
  npm run audit:casinos
  npm run build:dev

  VITE_AUTH_ENABLED=true node scripts/browser-build-proof.mjs capture
  VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production
  VITE_AUTH_ENABLED=true node scripts/browser-build-proof.mjs complete
  VITE_AUTH_ENABLED=true node scripts/browser-build-proof.mjs verify

  VITE_AUTH_ENABLED=true CI=true node scripts/casino-browser-smoke.mjs
  VITE_AUTH_ENABLED=true LOCATION_BROWSER_OUTPUT=audit/browser-results/location node scripts/location-browser.mjs
)
```

Run these actual-provider checks separately, against the same verified production output, when network access is available:

```sh
(
  set -eu
  VITE_AUTH_ENABLED=true CASINO_BROWSER_LOCAL=1 node scripts/casino-browser-live-check.mjs
  VITE_AUTH_ENABLED=true CASINO_BROWSER_LOCAL=1 node scripts/location-browser-live.mjs
)
```

The four harnesses own strict-port localhost previews: casino deterministic 8080, location deterministic 8082, casino actual-provider 8092, international actual-provider 8093. They verify source/output fingerprints and auth-enabled rendering; an unrelated occupied preview is rejected. Preserve these safeguards. A failed/unavailable provider check remains failed/unavailable until investigated.

Generated evidence is under `audit/browser-results/` and ignored by Git. Do not interpret writing `.vercel/output` as a hosted deployment. **Never run `npm run build`: it chains `npm run db:migrate`. No deployment or migration is authorized by this checklist.**

## Controlled-release acceptance matrix

The local evidence above covers representative flows. The following matrix specifies the expected behavior to verify on a separately authorized served revision; remaining hosted/device/account/Maps checks are **NOT RUN**, not passes.

| Route / action | Expected behavior and present coverage |
| --- | --- |
| `/` → Nightlife → Casino; first visit/reload | Tour once, saved preferences and exclusions persist. Representative local checks passed; hosted fresh/existing storage remains. |
| Explicit GPS; grant/deny/unavailable/timeout; global manual input | No request until explicit action; coordinates work before reverse enrichment; correct visible error and manual recovery. Simulated native/browser cases passed; physical GPS/OS behavior remains. |
| Live discovery: Reno/Newkirk/Ardmore/Chandler/Pahrump/Pawnee | Fresh records merge with canonical pool; provider outage is disclosed. Local real-network checks passed with the recorded successes/timeouts. |
| Radius, type, price/unknown price, Favorites, exclusions | Displayed options satisfy filters; expired exclusions stop applying; empty sets offer recovery and disable picking. Unit coverage plus representative local browser checks; repeat hosted acceptance. |
| Open now with known/unknown hours | Only known-open qualifies; active unknown hours does not mean open now. Automated filtering and local empty-state checks passed. |
| Repeated picks/options and one/zero eligible | Unique IDs/options, alternatives when available, no crash. Unit and representative local browser checks passed. |
| Maps directions / website | Selected current property opens. Exact href/security checked locally; external navigation and physical mobile Maps resolution remain. |
| Reno ROW/J Resort; Tahoe successors | Separate floors remain distinct; reviewed predecessors merge only nearby. Automated catalog/alias coverage; inspect selected hosted details. |
| Quapaw replacement/Harrah’s OK/Cadence | Correct current property/footprint and predecessor handling. Automated data/policy coverage; physical destination acceptance remains. |
| First Council/Chilocco; Davis West/Treasure Valley; Wells floors | Distinct properties remain selectable, with correct addresses. Newkirk three-option browser check and near-pair regressions passed. |
| Casino Oklahoma / Elko Roadhouse / Diamond’s | Hinton Cummins property; 1165 E Jennings #102; 1010 E 6th. Evidence and routing regressions passed; inspect opened external destination during acceptance. |
| Oneida Airport/IMAC and Soaring Eagle Slot Palace | Separate floors route distinctly; Slot Palace 7566 Ogemaw, IMAC 2100 Airport. Automated evidence coverage; external routing remains. |
| Grand Lake / lodge; Montego Bay / Wendover Nugget | Casino 24701 S 655, not lodge; distinct 100/101 Wendover. Automated evidence coverage; external routing remains. |
| Timeout/malformed response/offline transition | Honest fallback and usable saved data, no fabricated live/open status. Unit, deterministic outage and real timeout checks passed; hosted offline transition remains. |
| Sign-in / account state | Auth-enabled build renders and invariants pass. Real authenticated account acceptance remains. |
| Canada/U.K. manual search | General country/region/locality metadata, international addresses and nearby results. Actual four-city providers passed; hosted repetition remains. |
| Manual override, cancellation and reload | Late callbacks cannot replace a newer choice; no repeated GPS while busy; persisted location shared across all categories without automatic GPS. Combined local checks passed; device/hosted acceptance remains. |
| Dinner/Date Night/Settings/mobile | Existing navigation/disclosures/icons intact; overlays scroll/close, no overflow. Representative local checks passed; physical browser checks remain. |

Record revision, URL, browser/device, time, location, screenshots, provider outcome and actual failures. Do not mark an unavailable check as successful.


## Controlled-release sequence — authorization still required

1. Select the latest combined integration SHA and inspect its CI. Compare any changes after the validated reference with the recorded combined source; require new affected validation for runtime changes. Preserve the original frozen casino base, original location source and combined candidate.
2. Before any main merge or deployment, verify the actual Vercel project's repository link, production branch, effective build command and Git deployment behavior through read-only inspection. The repository excludes `integration/**` from Git deployments; that exclusion does not establish that main promotion is non-deploying.
3. **Resolve the migration-free release path first.** Repository `package.json` defines `build` as `node scripts/with-app-env.mjs vite build && npm run db:migrate`; `vercel.json` has no build-command override. A project-level override may exist, but has not been verified. The connected Vercel team listing returned an empty list, and this checkout has no project-link metadata. GitHub's existing successful Vercel status on main identified team minions-9e2c and project dinner-roulette; a read-only get_project lookup using those observed slugs returned 403 Forbidden. Restore access to that project before inspecting its settings. Do not assume a hosted build will match the safe local command.
4. Obtain separate explicit authorization for the concrete main promotion and hosted release. Any required project-setting change also needs authorization; migrations, secrets and recurring monitoring remain excluded. Do not authorize an implicit migration by treating a generic build or main merge as harmless.
5. Once authorized and the migration-free path is verified, capture the currently served deployment/revision as the rollback target, promote only the reviewed combined candidate, and record the resulting commit/deployment IDs. Do not merge the older PR #39 wholesale.
6. Verify the served revision/cache and execute the matrix below on the authorized target. Record PASS / FAIL / BLOCKED / NOT RUN individually. Stop release acceptance on a material failure; preserve evidence rather than clearing a user's storage.
7. For a material regression, use the separately authorized rollback procedure to restore the recorded previous served deployment. A Git revert or main merge may itself trigger a new deployment, so review that path before using it. No database change is required by this update, and no database rollback is planned.

This is a prepared sequence, not permission to execute it. The repository/default-build migration risk is distinct from the successful migration-free local and CI build gates.

## Result record

For each device/hosted case record: selected Git SHA; actual served deployment/revision; target URL; browser/OS/device; timestamp; initial permission/storage state; intended and actual location; provider source/outcome; expected versus observed behavior; status; and evidence reference. Do not capture credential values or another person's precise location.

The following remain **NOT RUN** in the current environment: physical GPS/OS revocation and approximate location, installed Android PWA/iOS Safari, authenticated hosted sessions, external Maps navigation and served-cache acceptance. User-provided device observations must remain attributed to the user rather than claimed as agent-executed browser checks.

## After a separately authorized release

Check fresh and existing storage, first load/reload, all three categories, casino choices and aliases, international manual input, location recovery, actual Maps navigation, provider fallback, sign-in/account behavior and physical mobile layout. Use the ten-step device cases in the historical `LOCATION_HANDOFF.md` together with this combined matrix. Do not claim destination-local open-now correctness: the existing evaluator uses the viewer timezone, and the international discovery gate used open-now off.

Record the actual release/acceptance result in the same shared `AI_CONTINUITY.md`. Seven evidence-gated casino holds remain optional maintenance; no recurring monitoring is created.
