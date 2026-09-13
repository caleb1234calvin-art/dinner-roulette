# Dinner Roulette / Pick For Me — AI Continuity

Updated September 13, 2026 for the validated casino RC through Pass 54. This file supersedes earlier current-count/browser claims. Prior continuity is preserved verbatim in `audit/ai-continuity-before-casino-rc-2026-09-13.md`; older pre-Astra history remains in `audit/ai-continuity-handoff-2026-09-12.md`.

## Working state and authority

- Repository: `caleb1234calvin-art/dinner-roulette`.
- RC branch: `integration/casino-release-candidate-2026-09-13`; [PR #38](https://github.com/caleb1234calvin-art/dinner-roulette/pull/38) targets **only** `integration/active-work-pass-1`.
- Current validated runtime/data head: `243082896d6b774dde9bbb44c44f71e02824aaa3`, [Run 307](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34739926534). Documentation checkpoints follow; verify their exact head before promotion.
- Pre-RC integration head: `877ff08c300a9d149aa174e9c47471d57bc98ccd`. Main remains `c187d518cf8b0c8b9202ee0ae6493667eb4c0ab5`.
- Broad reversible non-production research, code, tests, audits, documentation and integration preparation/promotion are authorized. **Main, production, Vercel/hosted deployment, irreversible external changes, secrets and recurring monitoring are not authorized.**
- No Vercel deployment, production write or database migration occurred. `vercel.json` disables Git deployments for `integration/**`.
- Do not delegate to another agent unless Caleb explicitly requests it. Preserve user edits and historical evidence.
- Before non-production promotion, re-read PR/base refs and exact-head CI. Use expected head SHA. Do not merge to main.

## Current release facts

| Scope | Canonical destinations |
| --- | ---: |
| Nationwide | **808** |
| Nevada | **146** — pending statewide scope |
| Oklahoma | **96** — pending statewide scope |
| Colorado | **31** |
| Texas | **4** |
| Four-state focus | **277** |

824 serialized rows across 54 passes become 808 active destinations. 41 manifest jurisdictions: 39 retain their prior complete status and two remain pending. **77 additions** relative to the 731 baseline; no existing destination removal, merge or rename in this RC. Three pins and two addresses corrected with stable IDs/history retained.

Run 307 passed **263 repository + 51 application = 314 unique tests**, zero failures and four explicit external-documentation skips. The **65 casino tests are included** in the repository total. Clean install, typecheck, export/schema and national audits, development build, production-mode build without migrations, Chromium smoke and all 30 Dinner icons passed.

## COMPLETED

- Pass 51: 24 NV/OK additions and Oneida Airport/IMAC pin corrections.
- Pass 52: 31 additions; rejected conflicting named map points, including Seminole I-40 city-area markers, Tahoe/Harrah/Black Hawk/Kiowa discrepancies.
- Pass 53: Club Cal Neva, Montego Bay and Remington Park; Slot Palace address/point correction; Golden Pony closure hold.
- Pass 54: 19 northern Nevada/Oklahoma destinations, including Avi, Carson Nugget, Verdi/Tahoe/Wendover, Grand Lake/High Winds/Stables/River Bend, Braman/Cimarron/Sugar Creek/Gold River/StoneWolf; closed SouthWind Newkirk excluded.
- All new records have identity source, numerical point source, date and scope decision. Unknown hours stay null.
- Source lineage repaired for 18 recent records missing inline fields; latest sidecar identity/address/coordinates protected by a real-export test.
- Audit loader follows actual registered TypeScript exports and requires every chronological pass. Schema, duplicate/legacy-ID, source, location and manifest checks pass.
- Live discovery validates queries/coordinates/IDs/lifecycle, strips malformed optional fields, rejects unsafe website URLs, handles reviewed near-property aliases and excludes 16 bounded closure alias groups.
- Strict Open now requires known-open; default is off. Options deduplicate stable IDs. Filter/weighted selection tests include empty/singleton/10,000-item and Unicode cases.
- Primary and adversarial reviews completed. 78 pairs within 0.075 miles reviewed; active IDs unique; separate supported floors/campuses retained.
- Actual **production-preview Chromium** passed at Reno desktop 1280×800 and Newkirk mobile viewport 390×844. Tour, casino filters, outage fallback, strict-open empty state, options/pick/reroll/maps href/exclusions, location error/Favorites empty state and non-casino navigation covered. Nominatim and Overpass were deterministic server-side fixtures. No hosted/live-service/physical-device claim.
- Dependency lock mismatch repaired to eslint-plugin-react-hooks 6.1.1 satisfying the existing ^6.0.0 manifest. Required `npm ci` passes; no package-manifest change.

## Decisions to preserve

- Cadence Crossing remains **36.052633,-114.994834**. Its old **36.08622,-115.03321** was unsupported; the operator's old Jokers Wild map is not its point source.
- Beau Rivage/MGM Grand retain reconciled stable backbone IDs from earlier integration work. Latest-pass history is intentional; do not delete old rows to hide warnings.
- Oneida Airport: **44.497535,-88.122424**, current operator campus address **2040 Airport Dr**; legacy 2020 entrance alias retained in evidence. IMAC: **44.497146,-88.126045**, **2100 Airport Dr**. They are separate venues.
- Soaring Eagle Slot Palace: **43.6061056,-84.7052673**, **7566 Ogemaw Dr #7076**. Operator directions/building occupant resolve the shared 6800 resort-address conflict.
- Quapaw uses the new February 2026 facility at **6530 S 580 Rd**. Lake Eufaula uses **1045 Birkes Rd**, not old 806 W Forrest Ave. Grand Lake's **24701 S 655 Rd** casino is not the off-site lodge.
- Montego Bay **100 Wendover Blvd** and Wendover Nugget **101** are distinct. Shared operator/tourism address variants do not control routing.
- War Pony closure is **August 24, 2025**, not the superseded September date. Golden Pony remains held after late-2025 closure; the widely returned reopening article is **May 14, 2020**. SouthWind Newkirk closed **January 1, 2022**; Rock & Brews Braman is separate and active.
- The northern Nevada ledger was a truncated 379-byte file. Original bytes are preserved; its claimed 45 rows were not fabricated. Nevada expected count is null, not the speculative 174 decision universe.
- Preserve property destination `!3d/!4d` or final route endpoint semantics. A Maps viewport, adjacent business, city centroid or copied hotel/corporate address cannot clear a point hold.

## Four legitimate skips

External OG documentation is intentionally absent from clean Git checkouts (`.grok/skills/og` and workspace AGENTS.md). Classification **B by design / A in repository-only CI**. Installed docs retain assertions; `REQUIRE_WORKSPACE_DOCS=1` fails closed.

1. `brand-check.test.mjs`: “SKILL.md and AGENTS.md name the marker path and bound this script uses”.
2. Same file: “the sections that own the brand-task prohibition never affirm a wait”.
3. Same file: “SKILL.md tells the pass to self-check with the flag this CLI accepts”.
4. `write-atomic.test.mjs`: “every hand-over the og skill prints is one this script accepts”.

Do not fake these files, remove the skips cosmetically or count them as casino/application tests.

## BLOCKED

- Local exec-server handshake failed; no local shell or reachable authorized interactive preview was available. CI execution succeeded. Live-provider success, physical-device geolocation/Maps and hosted acceptance are **NOT RUN**.
- Konawa/Rivermist is operating by current operator evidence, but property numerical coordinates remain conflicting/unextracted. Keep the curated coordinate hold.
- Horseshu requires current separate casino-floor confirmation; Moapa's current tribal page confirms a travel plaza but not gaming. The old moapapaiutes.com redirects to an unrelated forms site.
- NIGC marker endpoint returned 401. Other sources sometimes required login, rate-limited or omitted numerical points. No authentication/provider boundary was bypassed; alternate sources were used when sufficient.

## DEFERRED

NV/OK are not statewide-complete. The exhaustive named remaining queue and scope distinctions are in `audit/casino-rc-coverage-2026-09-13.json`: Nevada rural/small-operator locations, Nugget Group's newly recovered portfolio, Oklahoma smaller gasinos/trading-post/other operator properties. Do not silently exclude them or promote them from portfolio membership alone. The implemented catalog may be released as the established partial scope; an exhaustive coverage promise requires more work.

## OPTIONAL / FUTURE

`audit/casino-status-watchlist-2026-09-13.json` contains 16 runtime rule groups plus three curated scope/coordinate holds; 10 entries merit future monitoring. **No recurring task was created.** Demolished/retired predecessors should not receive pointless periodic reopening checks. CI action-runtime/deprecation maintenance can follow separately.

## Execution history and safe next action

Earlier browser attempts failed on an incorrect Maps expectation, ambiguous locator and development Vite reload. They were fixed; Runs 303, 305, 306 and 307 passed at their respective revisions. Run 304 was observed queued without steps and is not counted as success/failure. An isolated V8 schema attempt lacked WHATWG URL; actual unmodified Node schema later passed. Exact history is in `audit/casino-rc-progress-2026-09-13.json`.

Next: validate the final documentation head, promote PR #38 **only into non-production integration** using its expected head SHA, verify the integration workflow and record the merge. Then perform the prepared live acceptance checklist when a permitted target is available. Complete additional coverage if exhaustive scope is required. **Any main promotion or hosted deployment requires Caleb's separate explicit authorization.**

Safe commands: `npm ci --no-audit --no-fund`, `npm run typecheck`, `npm test`, `node --test scripts/casino-*.test.mjs`, `npm run audit:casinos`, `npm run build:dev`, and `node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`. **Do not use `npm run build`: it chains database migrations.**

If local execution returns, inspect the existing dirty checkout before editing. Do not overwrite it or confuse it with the validated remote state. Browser instructions and precise limits are in `audit/casino-browser-release-checklist-2026-09-13.md`. Revert a non-production integration merge through review if recovery is needed; preserve evidence/history and avoid force-pushing shared branches.

## Preserve product behavior and identity

Dinner, Nightlife, Date Night and seasonal discovery remain separate features. Preserve curated casino passes, local/Jasper County catalogs, live mirrors and honest fallback. Preserve LEGAL.md and Settings disclosures: this is an independent discovery tool, not a wagering service or guaranteed admission.

Preserve all 30 Dinner icon assets and semantic resolver. Caustic Relay/Mordax identity is immutable without a requested redesign; preserve `public/brand/CAUSTIC_RELAY_ident-2.mp4` and `src/components/startup-ident.tsx`. Future food-truck work must distinguish serving now, scheduled today and discovered nearby; stale business addresses are not current truck locations.

The detailed release gate, changed paths, sources, tests, warnings and rollback notes are in `audit/casino-release-readiness-2026-09-13.md`, `audit/casino-rc-progress-2026-09-13.json`, and `audit/casino-rc-adversarial-review-2026-09-13.json`.
