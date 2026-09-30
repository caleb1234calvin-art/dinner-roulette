# Pick For Us — Seasonal Discovery Remediation #1

**SEASONAL DISCOVERY REMEDIATED — AWAITING INDEPENDENT VERIFICATION**

Implementation and local validation completed on `audit/seasonal-discovery-coverage-1`. This is an implementation report, not independent verification or merge approval. No merge, deployment, migration, Vercel setting change, signing, publication, or Play upload was performed.

## Verified starting state and original evidence

- Frozen main: `0a8f30dc57fcc1156342d1bfc8a07524f3125e3b`.
- Audited checkpoint: `4f6bf5fde5ffb1f4e99b34584ebd4e767ba39ac3`; tree `3e288318f159873b81c31d0cc994d1ca7e6291f9`.
- Fresh remote remediation start: `c6509784ea2efff247a75fc5d855c0d8c39be3bc`; tree `24e1cab36b10e9458e29a52f9e0eee73f01b8bbc`.
- Audit checkpoint is an ancestor. The only intervening change is the remediation handoff. Main remained frozen; no unreviewed implementation change was present. Implementation used a clean isolated checkout.
- All **36 original artifacts** were available in the prior audit worker checkout. Original manifest hashes matched. They were copied unchanged and committed before implementation at `7550ef672509752802e45a5b994b9a3fbd5ac5c1`, tree `dab568789aebe02e8160daf2aee45263f57024eb`. The original report and conclusion were not rewritten. Ignored original log files were explicitly included.
- Original report SHA-256: `800bafee5197e44ded6a1017bda87468d53a0716ef7d2adcc6e0787913e7a213`.
- Original JSON SHA-256: `d133ce1059d200ac340bd0a9ffdcb6a72a0b5287b0c26d802223772ad95848a0`.

The [machine record](seasonal-discovery-remediation-1-2026-09-29.json) lists all artifact/source hashes, exact commands, changed implementation paths, regression mapping and limitations. New supporting evidence is in `seasonal-discovery-remediation-1-evidence/`.

## Findings addressed

| Finding | Implementation and evidence |
|---|---|
| F01: acquisition | Added bounded theme-park and explicit seasonal attraction queries, plus activity-qualified farm/attraction/park metadata queries. The radius cap and mirror architecture are preserved. Classification requires positive activity evidence. Exeter's retained real `tourism=theme_park` node passes query-through-handler regression and remains inside the actual radius. No venue was inserted into a catalog. |
| F02: maze classification | Generic, hedge and meditation mazes are rejected. Corn/maize maze tags, maze-plus-corn metadata, or explicit activity wording in supported place contexts qualify. A generic farm, pumpkin crop, theme park or shop is insufficient. Turtle Moon is removed when all five retained regional provider captures are replayed. |
| F03: availability | The visible Date Night path now uses one decoration/eligibility model. It separates weekly hours, season phase, lifecycle and eligibility. Strict Open Now requires known-open hours and a confirmed current seasonal date. Minute-boundary, focus and visibility refresh update counts, options, selected results and plans; seasonal activation also refreshes. |
| F04: duplicates | First-stage identity consolidation unions categories and per-source evidence before discarding representations. Input ordering is stable, curated identity/coordinates retain priority, and otherwise a stable provider ID chooses the representative. Conflicting live hours become unknown. Existing nearby-match thresholds were not widened. Both C→P and P→C preserve one venue with both activities. Plan selection also preserves a distinct settle stop when a valid pair exists. |
| F05: status/freshness | Options, results and plans show explicit status rather than turning uncertainty into “Closed.” The existing Myer record was refreshed from the original audit's same-day operator calendar and Friday/Saturday hours. Calendar provenance and check date are recorded. No new direct operator retrieval succeeded in this task; the authoritative retained audit evidence is the source. |
| F06: source disclosure | Selected seasonal categories show live contribution, saved-only contribution, missing categories and successful sparsity separately from provider outage. Per-category provenance prevents an ordinary live duplicate from making a saved seasonal category appear live. The displayed count remains exactly the eligible pool size. |

## Availability and maintenance policy

| State | Open Now OFF | Open Now ON |
|---|---|---|
| Confirmed active season and known-open hours | Included | Included |
| Closed now, including a non-operating date within an active calendar | Included | Excluded |
| Hours unknown | Included | Excluded |
| Seasonal calendar unconfirmed or expired | Included with explicit uncertainty | Excluded |
| Upcoming season | Included with upcoming label | Excluded |
| Finished or explicitly not-operating season | Excluded | Excluded |
| Permanent/disused lifecycle | Excluded | Excluded |

Coverage disclosure describes the browseable discovered pool inside the selected radius before personal and Open Now filters; it does not substitute for the eligible count. There is no promise of an exhaustive real-world inventory.

Existing anchor calendars have source URLs, `checkedAt=2026-09-29` (Chicago retrieval date), and `revalidateAfter=2026-10-31`. Their known ended season is excluded during the rest of that calendar year. A later season becomes unconfirmed and requires fresh operator evidence; dates are never silently rolled forward. Maintenance must recheck the operator before each season and whenever the revalidation date passes, preserve provenance, and avoid asserting operation where sources conflict. Runtime refresh changes status; it does not invent calendar confirmation or schedule background scraping.

Live OSM weekly hours alone cannot establish current seasonal operation. Such venues remain useful with Open Now OFF. There is no maintained operator/event ingestion source in the present bounded architecture, so this remediation does not add arbitrary website scraping or hard-code the audit reference list. Sparse regional inventories remain an explicit source limitation. Calendar/hour evaluation retains the existing viewer-local timezone semantics; destination timezone and richer provider schedule parsing remain outside this task.

## Validation

Node `24.19.0`, npm `11.9.0`.

| Gate | Result |
|---|---|
| Clean dependency install | PASS, 507 packages; package and lockfile unchanged |
| Complete dependency tree | PASS, `npm ls --all` exit 0 |
| Typecheck | PASS |
| Full JavaScript suite | **390 passed**, 0 failed; 4 inherited external documentation skips |
| New seasonal suite | **14 groups passed**, covering all 18 handoff requirements, actual component actions and clock hook |
| Existing availability suite | 6 passed; Myer expectation intentionally updated for retained verified calendar |
| Existing location-discovery suite | 10 passed |
| Python Android verifier suite | 3 passed |
| Changed product/test/harness lint | PASS |
| Casino invariants | PASS: 883 canonical, 899 serialized, 60 catalogs |
| Android structural/icons | PASS; 15 launcher resources, approved master unchanged |
| Capacitor sync / tracked bytes | PASS / unchanged |
| Auth-enabled production build | PASS using the migration-free direct Vite command |
| Diff whitespace / secret and generated-junk review | PASS |
| Browser acceptance | **UNAVAILABLE**: Chromium absent, installation returned invalid/truncated ZIP |

The real-component harness executes the current Date Night component, search validator/handler, eligibility/count logic, pick/options/plan actions and actual option/plan rendering with stubbed hooks, portals and leaf controls. It is not browser/RPC, hydration, CSS/layout or physical-device acceptance. The real clock hook is separately exercised with controlled timers and event listeners. The existing location browser harness now asserts that the unknown-hours museum fails strict Open Now, then disables it before the existing ordinary Date Night selection check; that browser harness was not executed here.

The final full suite comprises 319 repository and 71 application passes. Four external OG documentation contract checks remain skipped because that external documentation package is absent, unchanged from the baseline. Dependency deprecation/proxy warnings and the casino audit's established duplicate-reconciliation notices are retained in logs; there was no dependency upgrade.

New remediation logs omit trailing whitespace/final blank lines for the repository whitespace gate; original audit logs are byte-for-byte unchanged.

Failed development attempts are preserved: initial component harness document stubs were incomplete; a multi-category plan regression exposed the sole-settle selection defect; the corrected harness and implementation pass. No failed attempt is represented as a pass.

## Regional observations — separate from regression assertions

All five required origins were attempted with native provider fetches, 50 miles and H+C+P. **All 20 mirror requests timed out in this environment.** No fresh live inventory or recall improvement is claimed. Raw query/error/timing records are retained in `live-controls.json`.

| Control | Response | Seasonal OFF / ON | Disclosure |
|---|---|---|---|
| Carthage | Saved fallback | 2 / 0 | Outage; saved haunts only; maze/patch missing |
| Joplin | Saved fallback | 2 / 0 | Same distinctions |
| Springfield | Saved fallback with ordinary anchor | 0 / 0 | Outage; all selected seasonal categories missing |
| Lockwood rural | Saved fallback | 2 / 0 | Outage; saved haunts only; maze/patch missing |
| Aurora | Saved fallback | 2 / 0 | Same distinctions |

These live attempts started before the final metadata delimiter-tolerance adjustment allowing underscore-separated activity text. Their exact attempted queries are retained; final-tree deterministic tests cover that adjustment. Since no request returned provider data, these observations demonstrate unavailable live access and fallback behavior, not final-query acceptance by a live Overpass server.

Separately, all five **original retained** regional provider captures pass deterministic replay through the final handler: Turtle Moon does not become a corn maze, seasonal option IDs remain unique, all eligible distances remain inside the existing cutoff, source success is not relabeled outage, and ordinary Date Night candidates remain. The separate retained Exeter node proves the query omission is covered deterministically; it was not injected into the live requests or production catalogs.

## Preserved scope and checkpoint linkage

Command-line push failed because no GitHub credentials were configured (`could not read Username`, exit 128). The authenticated GitHub app transferred the Git objects instead. The original pre-implementation local artifact commit remains recorded above; its identical tree was recreated remotely as `c8a67a07053f76db140287727672e83954c586b3`. The remote checkpoint has that commit as its sole parent. GitHub assigns commit metadata, so the remote commit ID differs from the first local checkpoint (`13922c899b691d9a6aefd9f9aaa0f3c5dcea0125`). Only this transport/linkage documentation, the machine record, manifest and current continuity changed after validation; all 17 implementation hashes remain identical. The non-forced branch update and fetched tree are checked against the local staged tree.

Dinner/Nightlife source, casino catalogs, shared location/GPS/store, packages/lockfile, Android source/configuration, native wrapper, Vercel/build settings, production URL, and Halloween activation constants are unchanged. Original audit bytes remain unchanged. No venues were added; no radius or nearby dedupe threshold was widened. No fresh native Gradle build or device acceptance is claimed.

The remediation checkpoint is the **single commit introducing this report and its JSON record**, with sole parent `c8a67a07053f76db140287727672e83954c586b3`. This avoids a self-referential evidence amend:

```bash
git log --diff-filter=A --format=%H -1 -- audit/seasonal-discovery-remediation-1-2026-09-29.json
git show -s --format=%T <resolved-checkpoint>
```

The implementing assistant ran these checks. A fresh independent worker must verify the repository checkpoint before any merge decision. Main remains at the frozen production base. After the authorized checkpoint push, stop.

**SEASONAL DISCOVERY REMEDIATED — AWAITING INDEPENDENT VERIFICATION**
