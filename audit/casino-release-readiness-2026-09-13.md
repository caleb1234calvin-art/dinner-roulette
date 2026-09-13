# Pick For Me casino release readiness

Updated September 13, 2026 after Caleb resumed the paused casino work. **Locally validated; exact-head CI and non-production promotion pending.** Main, production and Vercel remain untouched.

## Candidate

Repository: caleb1234calvin-art/dinner-roulette. Working branch: `integration/casino-continuation-2026-09-13`, based on `2fd976a4f34f8bbe28db1075a264693d691b8253`. Target is only `integration/active-work-pass-1`. Main remains `c187d518cf8b0c8b9202ee0ae6493667eb4c0ab5`.

| Scope | Canonical destinations |
| --- | ---: |
| Nationwide | **857** |
| Nevada | **181** |
| Oklahoma | **110** |
| Colorado | **31** |
| Texas | **4** |
| Four-state focus | **326** |

873 serialized rows across 58 registered passes resolve to 857 unique active destinations. The 16 historical superseded rows are retained and reconciled by the established latest-pass rule. Nevada and Oklahoma remain pending statewide completeness, with no speculative expected count. The other 39 manifest jurisdictions retain their prior scope status; this session did not independently re-survey every property in those states.

This continuation adds **49 destinations**: Pass 55 adds 11 NV; Pass 56 adds 12 OK; Pass 57 adds 12 NV; Pass 58 adds 12 NV and 2 OK. Since the original 731 baseline, the RC adds 126 destinations. This continuation removes, merges or renames **zero existing canonical records** and makes no existing pin correction. Earlier passes 51–54 retain their three pin and two address corrections.

## Data and evidence

All additions have current identity/operation evidence, a numerical property or operator-confirmed building point, address, jurisdiction, verification date and a decision record in Pass 55–58 evidence JSON. Unknown or conflicting hours remain null.

Nugget Group, Alamo, Pilot/Roadhouse/Lucky’s, 7 Clans and relevant Chickasaw rosters were reconciled. Multiple gas/travel-center entries were matched to existing casinos instead of duplicated. Current separate floors in Newkirk, Wells, Fernley, Davis and Ada remain distinct.

Rejected evidence includes Casino Oklahoma’s misleading map viewport and downtown directory pin; Elko Roadhouse’s copied Winnemucca street address; Big Wheel searches returning Lovelock instead of Battle Mountain; unrelated Lucky’s and Davis search hits. Diamond’s uses operator-confirmed 1010 E 6th Street; its unconfirmed draft address was corrected before promotion.

Prairie Sun closed effective May 14, 2023 according to its dated operator announcement. A bounded closure rule prevents stale live records from reviving it; current Prairie Moon survives. There are **17 runtime closure-rule groups** and **25 prepared watchlist entries**. No recurring monitoring exists.

Held outside the curated pool: Konawa/Rivermist; Horseshu casino-floor scope; Moapa gaming scope; Wigwam point/floor; Broadway Colt routing/point; Border Inn’s casino-side point at the NV/UT boundary; C Punch/Lovelock Junction operating-floor status; and CTS Thackerville’s separate-room scope. See the coverage and watchlist JSON for exact sources and recheck triggers. These holds and optional continued statewide reconciliation do not imply that the verified catalog is statewide complete.

## Code and validation

- **322 unique tests passed: 271 repository + 51 application; zero failures; four understood documentation skips.** The 73 casino tests are included in the repository total.
- Eight new meaningful tests protect exported evidence, current routing addresses, near-property aliases, separate gaming floors, same-name cross-state casinos and the Prairie Sun closure.
- Full schema/export/ID/chronological/manifest audits passed. Adversarial review covered 81 pairs within 0.075 miles and all 16 new-involved pairs within 0.35 miles. No nearby canonical alias collision remains.
- Clean install, dependency tree, typecheck, targeted lint of all 11 changed JS/TS/TSX files and all 30 Dinner icon assets passed.
- `npm audit --omit=dev` reported zero known production-dependency vulnerabilities in this snapshot. No package manifest or lockfile change in this continuation.
- Development build and production-mode build passed without database migrations. Production build and browser checks were also run with `VITE_AUTH_ENABLED=true`; dev/build auth invariants passed both ways.
- CI now explicitly enables that flag for its production build and browser step. The application’s default configuration was preserved.
- A real browser defect was fixed: denied/unavailable geolocation opens a visible alert and manual recovery form. Other geolocation failures no longer claim permission denial. Repeated location requests are disabled while busy.
- Browser harnesses require their own preview process and strict port; current canonical pool counts reject stale builds. A deliberate occupied-port test failed closed as expected.

Four remaining skips are in external OG-documentation contracts, not casino behavior:

| File | Exact skipped check |
| --- | --- |
| scripts/brand-check.test.mjs | SKILL.md and AGENTS.md name the marker path and bound this script uses |
| scripts/brand-check.test.mjs | the sections that own the brand-task prohibition never affirm a wait |
| scripts/brand-check.test.mjs | SKILL.md tells the pass to self-check with the flag this CLI accepts |
| scripts/write-atomic.test.mjs | every hand-over the og skill prints is one this script accepts |

Each is **B: intentionally external by design**, and **A: unavailable in this repository checkout**. The external documentation package is absent; existing assertions execute when it is installed, and `REQUIRE_WORKSPACE_DOCS=1` fails closed when required documentation is missing. No skip was removed or weakened.

## Browser status

**Passed locally on the updated 857-destination production build with sign-in enabled.** Chromium 153.0.8010.0 via Playwright exercised desktop 1280×800 and mobile viewport 390×844.

The deterministic outage smoke passed 16 check groups, including tour, casino filtering, strict-open/Favorites/no-catalog empty states, current saved-pool counts (Reno 19; Newkirk 3), unique options, pick/reroll/exclusions, canonical directions URLs, visible location-denial recovery, Dinner/Date Night/Settings and no page errors or horizontal overflow.

The separate real-network check passed Reno, Newkirk, Ardmore and Chandler with zero errors or unresolved findings. Reno/Newkirk used honest fallback; Ardmore/Chandler returned live/merged results. Transport observation recorded 16 successful Overpass and two successful Nominatim HTTP responses, plus nine provider timeouts. Native Chromium permission/coordinate emulation exercised geolocation grant/denial; manual Nominatim lookup succeeded. This is not physical-device GPS.

The local agent-browser installer hit UnknownIssuer and its daemon failed to start. TLS checks were preserved; Playwright used an already available Chromium package. The initial baseline run’s hidden-error finding was fixed and the final updated build was rerun successfully.

Exact evidence: `audit/casino-continuation-browser-evidence-2026-09-13.json`. Generated screenshots remain local/CI artifacts; they are ignored by git.

## Remaining release steps

1. Obtain successful CI for the exact candidate head, recheck the target ref, then promote only into non-production integration.
2. A controlled release to main/production requires Caleb’s separate explicit authorization. No deployment or migration command is authorized here.
3. During the separately authorized release, verify the served revision, hosted environment, fresh/existing storage, casino flow, real external Maps navigation and representative physical mobile behavior. No hosted, physical-device, authenticated-account or external Maps-app validation is claimed by the local checks.

There is no known blocker in the validated casino code/data. Uncertain held destinations and further statewide completeness work remain documented, outside the curated pool. The separate location/international branch is preserved and unmerged; when that work replaces Nightlife’s location control, retain the visible-error behavior covered here.

## Recovery and scope

Only casino data/evidence, relevant discovery/identity rules, Nightlife location feedback, validation harnesses, CI flags and handoff documents changed. No unrelated feature work, secrets, database migration, production setting or dependency upgrade was introduced. `vercel.json` still disables Git deployments for `integration/**`.

Preserve both candidate branches and the integration baseline. Recovery is a reviewed revert of the continuation commits or restoration of the previously validated non-production revision; no destructive data deletion or database rollback is needed. Any production rollback remains a separately authorized release action.

**Never run `npm run build` as a predeployment shortcut: it chains `db:migrate`.** Safe build:

```sh
VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production
```
