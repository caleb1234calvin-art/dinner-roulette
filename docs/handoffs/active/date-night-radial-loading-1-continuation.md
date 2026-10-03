# Date Night radial loading 1 — continuation

Authority: `handoff/date-night-radial-loading-1`, commit `04a3ac240760fc025c62d487eeb7970c70620fb9`; full handoff read before executable changes.

## Checkpoint 1 — architecture, patch plan and RED contracts

- Branch `feature/date-night-radial-loading-1` created DIRECTLY from `d9cc8bdde2e531af6f029d3d558d25f4f7bb4ab5`. Verified tree `f9f46d16c876b4d608ab836d57a411a607e6f8fa`, sole parent `8e67d959f5b19cb00c22533a6eb27a1b2e1bfb2f`, clean starting worktree, zero post-base merges. Latest SHA before this save is the base. Resolve each save's own SHA with Git; do not amend for a self hash.
- Fresh refs: main `4d937e58d2a65567b54ac5271915bc85b498898b`, handoff exact. Production alias readback READY `dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL`, target production, exact frozen main and unchanged aliases. Main/production untouched. No Preview accepted; no public-provider traffic.
- Read current cache, RPC, DateNightHome, query/lifecycle/provider/evidence/identity/eligibility architecture, cache/component/client/browser tests, top continuity and retained timeout evidence. Current state machine and replacement design documented in `date-night-radial-loading-1-design.md`.
- Changed paths: copied controlling handoff; new design; this continuation; `scripts/date-night-radial-plan.test.mjs`; separate `audit/date-night-radial-loading-1-evidence/planner-red.tap`. No application runtime edit or dependency/config/catalog/native change.
- RED: `node --test scripts/date-night-radial-plan.test.mjs`: 0 passed / 10 failed, all specifically asserting absent bounded planner/coverage API. This is recorded before runtime implementation. Tests use an independent spherical oracle, dense sampling, exact prefix/ID contracts, bounded corners, ownership, hostile ID/radius input and missing/failed/loading/category/milestone proof rules. Existing behavior has no patch API; RED does not yet constitute geometry proof.
- Geometry: spherical core15 + fixed sectors for (15,20], (20,30], (30,40], (40,50], with 4/7/9/11 sectors; 32 patches; circumscribed circles <15.1 miles. Stable single ownership avoids overlapping positive authority; cross-patch lifecycle evidence retained. Geographic/category proof is derived from retained cache, so eviction and failed inner work cannot remain complete.
- Budget design: one in-flight RPC, one automatic attempt per missing patch/category per pass, one-second outer pacing, stop on failed core or three consecutive degraded patches; no auto-retry loop. Existing 4 mirrors / 4 groups / 8s attempt / 20s provider / 25s watchdog preserved. Full-pass caps 32 RPC / 512 theoretical provider attempts. Planned live cap core+two outer RPC (48 theoretical attempts), separate from full-radius completeness.
- Remaining gates: implement/prove planner, patch RPC and hostile-input tests; patch cache/coverage regressions; progressive UI/scheduler; focused GREEN; pre-full checkpoint; all validation/security/build gates; ten controlled browser scenarios; bounded exact Preview acceptance; immutable freeze. No promotion.
- Exact next action: publish/read back this RED checkpoint, implement the pure planner and server-owned patch contract, run planner/RPC tests and checkpoint acquisition contract before cache/UI wiring. Review pole/antimeridian cases and supersession/negative-evidence eviction explicitly.

SAFE TO RESUME FROM THIS CHECKPOINT.

## Checkpoint 2 — bounded patch planner and server contract

- Branch/base unchanged. Latest published SHA `d3111611794328ad084134134f80115161920e3b`, tree `94426f463536b36579af57b7e67b32d9627bc15e`, sole parent is the preserved base. Checkpoint 1 published through authenticated GitHub tree/commit/ref tools because shell push had no credentials; exact staged/published tree verified and checkout aligned without changing bytes.
- Changed paths: new radial-plan.ts, optional patch contract in search.ts/types.ts, test loader request-signal seam, planner/search tests, this continuation and dedicated contract logs. Existing DateNightHome/cache are still unchanged. Lifecycle/query/provider implementations unchanged.
- Planner/coverage contracts now GREEN 11/11, including >120,000 independently generated sampled positions, antimeridian/high-latitude and exact-pole checks, deterministic prefixes, bounded corners and truthful missing/category proof. Server contract GREEN 4/4: strict server-derived geometry; logical positive ownership; retained overlapping lifecycle evidence; valid empty; hostile geometry/ID rejection before fetch; request signal forwarding/attempt abortion. Earlier contract assertion incorrectly assumed a negative raw ID remained representative after existing same-location dedupe; corrected to require negative lifecycle plus original evidence identity. Initial failure log retained.
- Existing partial-results suite 12/12 and typecheck passed. This is focused validation only; full gates remain pending.
- Geometry remains core15 plus 4/7/9/11 sectors (32 total), circles <15.1 miles. Coverage tracks per-category completeness and missing/failed/loading patches. Runtime scheduler/cache not wired yet, so no progressive behavior claimed.
- Provider budget unchanged (4 mirrors, 4 groups, 8/20/25 seconds). New patch RPC forwards the server Request signal into the existing hedge executor; deterministic propagation proven, hosted disconnect propagation still unclaimed. No public provider calls. Preview identity: none accepted. Main/production untouched; last verified frozen4d937e58 / READY dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL.
- Remaining gates: patch-aware cache and coverage admission/eviction/negative regressions; serial scheduler and progressive UI; focused GREEN; pre-full and full/security/build checks; controlled browser; bounded exact Preview; final freeze.
- Exact next action: publish/read back this checkpoint, extend the cache with isolated patch authority while preserving legacy V-DR-02 tests, add the coverage projection and patch/cache regressions before UI wiring.

SAFE TO RESUME FROM THIS CHECKPOINT.

## Checkpoint 3 — patch-aware cache and coverage

- Branch/base unchanged. Latest published `7ae42cdccd286bc742c2108b6b555ba9aef93b34`, tree `4f8733f1e7336cd3486651a8eb0ce7b06e56cd46`, sole parent `d3111611794328ad084134134f80115161920e3b`.
- Changed paths: cache.ts extension, new radial-cache.ts, radial-cache.test.mjs, dedicated cache log, this continuation. DateNightHome still unchanged. Legacy cache API preserved; optional patch namespace isolates positive coverage/supersession by fixed logical patch, while signature-compatible negative evidence crosses patches/categories. Radial wrapper bounds 128 entries/20,000 raw venues/10 minutes, strictly clips visible radius and derives coverage from currently retained entries. Negative eviction destructively retires conflicting retained positive identities before removing evidence; no immortal tombstones.
- Focused GREEN 61/61 = 46 existing cache/component cases + 15 new radial cases. All existing V-DR-02 regressions pass unchanged. Typecheck PASS. New tests prove empty success, partial categories, 40-mile completeness surviving a failed 50-mile patch, missing-only retry accounting, invalid admission, cross-patch lifecycle suppression, negative eviction, category/entry/venue supersession, overlap ownership, full classification preservation, location/season/version isolation, TTL and radius clipping.
- Geometry/model unchanged: 32 fixed sectors/core, query circles <15.1 miles; continuous radius is per-requested-category conjunction over retained inner patch authority. Provider budget unchanged; scheduler not wired yet. No progressive UI or full-validation claim.
- Main/production untouched; last verified frozen4d937e58/READY dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL. Preview none accepted; public-provider calls0. Prior evidence unchanged.
- Remaining gates: serial scheduler/UI, permanent progressive/overlay/filter/cancellation tests; focused GREEN; pre-full/full validation/security/build; ten controlled scenarios; bounded Preview; final freeze.
- Exact next action: publish/read back this checkpoint, implement one-in-flight progressive controller with missing-only retry and separate foreground/background state, then connect DateNightHome without changing selection setters or eligibility policy.

SAFE TO RESUME FROM THIS CHECKPOINT.

## Checkpoint 4 — progressive controller and UI

- Branch/base unchanged. Latest published `11516b22f936288433da4727413bc60952d4fd6c`, tree `fa36015f64d6406ef94b6453f6a37e8eb9454c14`, sole parent `7ae42cdccd286bc742c2108b6b555ba9aef93b34`.
- Changed paths: radial-session.ts, DateNightHome, new radial-session.test.mjs, two existing test fixtures/assertions reflecting patch semantics, separate UI logs, continuation. No pick/options/plan setter is called by background completion. Existing selected IDs and refreshed eligibility/status remain intact.
- Controller: one in-flight patch, core first, 1-second outer pacing, at most32 requests/pass, no auto-retry, stop on incomplete core or3 consecutive degraded patches. Attempts are per patch/category and bounded by32×11; retry consults retained cache and requests only missing work. Radius decreases retain needed core/inner requests and cancel unnecessary outer work. Late completions cannot seed cache. Local-only filters are not acquisition dependencies.
- Focused controller/actual-UI 13/13 GREEN: readiness before full coverage, all three overlays stable and next selections include new venues, middle/outer failure preservation, complete40 surviving failed50, bounded3failure stop, increase/missing-only scheduling, shrink cancellation/late rejection, necessary core retention, zero local-filter refetch, location replacement, watchdog/error/retry and usable truthful saved fallback.
- Existing cache/client/partial UI 102/102 GREEN after fixture metadata alignment. The old Date Night radius test now explicitly asserts outer patch scheduling, and the cross-mode radius test asserts retaining the same necessary core on shrink; Dinner/Nightlife cancellation expectations remain unchanged. All V-DR-02 assertions retained. Initial3 failures retained in ui-initial.log (two due absent new fixture metadata, one intentionally obsolete monolithic cancellation assumption).
- Typecheck passed. Changed-code lint found one unused ternary expression in new controller; replaced with explicit if/else. Fresh combined focused/typecheck/lint verification is the next gate, not claimed yet.
- Geometry/coverage unchanged (32 bounded core/sectors, per-category retained proof; max query<15.1mi). Budgets4groups/4mirrors/8s20s25s unchanged. No public-provider calls; no accepted Preview. Main/production untouched at last frozen readback.
- Remaining gates: combined focused GREEN, pre-full checkpoint, full tests/dependency/security/native/build/proof/scope, ten controlled browser scenarios, bounded exact Preview, immutable freeze.
- Exact next action: publish/read back UI checkpoint, run all focused patch/cache/lifecycle/query/client/provider suites and typecheck/lint/diff check, checkpoint focused GREEN, then checkpoint BEFORE full validation.

SAFE TO RESUME FROM THIS CHECKPOINT.

## Checkpoint 5 — combined focused GREEN

- Branch/base unchanged. Latest published `5ffd73baa1d0fcab594dd65936efff4783705111`, tree `bd3b892d87b531842630fb277088bc7e50261006`, sole parent `11516b22f936288433da4727413bc60952d4fd6c`.
- Changed paths: dedicated combined focused log and continuation only. Application/test source unchanged since checkpoint4.
- Combined focused 294/294 PASS: patch planner/search/cache/session, all existing cache/V-DR-02, lifecycle parity/query/cost, partial results/UI, client lifecycle and provider hedge/deadline suites. Canonical lifecycle154 audit cases/111 authoritative negatives/zero gaps retained. Typecheck, all changed executable-file lint and diff check PASS. These totals are not added to later full-suite totals.
- Geometry32/core+sectors and spatial/category proof unchanged. Budget one patch in flight, one-second spacing,32RPC/pass,3 consecutive failures stop,4groups/4mirrors/8s20s25s. Main/production untouched at frozen4d937e58/READY dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL; no accepted Preview; public-provider calls0.
- Remaining gates: prepare permanent controlled/live harnesses, pre-full checkpoint, full validation/security/build/native/scope, ten controlled scenarios, bounded exact Preview and immutable freeze.
- Exact next action: publish/read back focused GREEN; add deterministic browser harness with external-fetch blockade and bounded live harness; checkpoint BEFORE running full validation/build. No promotion.

SAFE TO RESUME FROM THIS CHECKPOINT.

## Checkpoint 6 — BEFORE full validation/build

- Branch/base unchanged. Latest published `84fda4411270a8ec9897ee2d662c938b1a466ca0`, tree `c386ba20c78ff6e1e3d99b9a4a71b189ec2e3b7a`, sole parent `5ffd73baa1d0fcab594dd65936efff4783705111`.
- Changed paths: new radial controlled browser harness, external-fetch-blocking server preload and bounded exact-Preview live harness; this continuation. Harness lint/diff check PASS. Application runtime unchanged since checkpoint4.
- Focused294/294, typecheck/lint/diff remain GREEN. Full validation and build have NOT run yet. Ten controlled scenarios are specified in the harness; no browser acceptance claimed before execution.
- Geometry/coverage/cache/budgets unchanged. Controlled harness intercepts all external server fetches and blocks external browser routes. Live harness requires explicit verified-Preview flag, exact compiled RPC ID, allowed core/20:0/20:1 sequence, caps public traffic at3RPC/48theoretical attempts, gates outer traffic on core success, blocks other server functions and records deliberately incomplete50-mile coverage separately from usability. Post-cap outer failures are explicitly controlled transport failures, never described as real provider outages.
- Exact next actions: publish/read back this pre-full checkpoint; run npm ls --all, typecheck, changed-code lint, diff check, casino invariants, Android structural/icons, Python native tests; capture proof with VITE_AUTH_ENABLED=true; run direct migration-free Vite production build through with-app-env; complete/verify proof; compiled TanStack security and full npm test; protected-scope/secret/generated-junk review. NEVER npm run build or migrations. Store separate exact commands/exits/logs.
- Main/production untouched at frozen4d937e58/READY dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL. No accepted Preview and0public-provider calls. Remaining after full gates: checkpoint7, controlled10/checkpoint8, bounded exactPreview/checkpoint9, immutable freeze/checkpoint10. No promotion.

SAFE TO RESUME FROM THIS CHECKPOINT.
