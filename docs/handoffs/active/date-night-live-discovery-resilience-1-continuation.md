# Date Night live discovery resilience — continuation

Original handoff remains authoritative at `handoff/date-night-live-discovery-resilience-1`, commit `a14b5df517e5054eb2d47d8789e25e9aa4e210df`, path `docs/handoffs/active/date-night-live-discovery-resilience-1.md`.

## Save 0 — baseline and design, 2026-10-03 UTC

- Repository: `caleb1234calvin-art/dinner-roulette`.
- Implementation branch: `fix/date-night-live-discovery-resilience-1`.
- Frozen production base: `4d937e58d2a65567b54ac5271915bc85b498898b`.
- Latest pushed checkpoint at authorship: `4d937e58d2a65567b54ac5271915bc85b498898b` (new remote implementation branch created directly from frozen base). This documentation commit is the next checkpoint; obtain its identity with `git rev-parse HEAD` after fetching this branch. A commit cannot embed its own hash.
- Checkpoint/base tree: `4f39061bc32e3b362232907191efaf0f3d1715ce`.
- Ancestry: implementation HEAD initially equals frozen base; zero commits above base. Base sole parent `cf5e98d7fa6817f1fef4d67a182c518ea760bb79`. This save has frozen base as its sole parent.
- Worktree: clean at starting gate; only this continuation and new baseline evidence added for checkpoint. No executable changes.
- Completed: remote refs fetched, main and handoff SHA checked, exact-base branch created, ancestry/cleanliness checked, authoritative handoff read fully, baseline reproduced.
- Files changed: this continuation; `audit/date-night-live-discovery-resilience-1-evidence/baseline-provider.tap`; `audit/date-night-live-discovery-resilience-1-evidence/baseline-client-seasonal.tap`.

## Baseline validation

- `npm ci --ignore-scripts`: PASS, 506 locked packages installed; no migration/lifecycle scripts.
- `node --test --test-reporter=tap scripts/discovery-provider-deadlines.test.mjs`: PASS, 41/41, using loopback-capable execution. First sandboxed invocation failed at file level because the suite includes a native localhost HTTP listener; rerun with loopback access passed.
- `node --test --test-reporter=tap scripts/discovery-client-lifecycle.test.mjs scripts/seasonal-discovery.test.mjs`: PASS, both test files (runner reports 2/2).
- Existing deterministic assertions prove Date Night mirrors at 0/8000/16000ms, no fourth mirror, first two attempts 8000ms each and third 4000ms, complete stalls settle at 20000ms; second-mirror immediate success waits until 8000ms.
- Existing UI lifecycle proves 25000ms watchdog, abort-ignoring/late/replaced/unmounted requests cannot retain spinner or overwrite current results.
- Saved catalog remains unchanged; complete Date Night failure returns saved fallback locally and normalized error outside saved coverage. Current seasonal fallback comprises two curated anchors.

## Current design decisions

1. Preserve provider absolute budget 20000ms, individual cap 8000ms and client watchdog 25000ms.
2. New Date Night-specific hedged helper; Dinner/Nightlife serial helper stays unchanged. Mirror starts initially 0/1500/3000/4500ms, immediate hard failure advances, first valid empty/nonempty wins, hard race bounds abort-ignoring transport/body, losers abort and timers clean up.
3. Server-owned groups: seasonal, entertainment, culture, outdoor. Validate activity IDs and generate only whitelisted relevant clauses. Preserve full returned classifications/evidence and all lifecycle rules.
4. Independent concurrent group outcomes, merged successes and saved catalog, honest partial metadata/disclosure. Shared dedupe semantics retained.
5. Bounded client acquisition cache over raw data, coverage by category and acquisition signature; current-clock decoration stays outside cache. TTL/cap and final interface to be finalized after query planning.
6. Deterministic tests carry load testing. No public-provider stress loop. Preview only after full deterministic validation.

## Blockers / unresolved questions / next action

- Mandatory reading of historical seasonal and Halloween notice evidence/build instructions is being completed by read-only parallel reviewers. Do not edit executable code until their full-read manifests confirm completion.
- Query/cache exact interface and TTL remain to be finalized.
- Exact next action: finish required read manifests, confirm milestone-0 checkpoint remotely, then implement/test/push milestone 1 hedging.
- Temporary instrumentation: none in application; only retained baseline test logs.
- Main and production untouched. No deployment, migration, promotion or merge performed.
- Preview: none.
- Live provider observations: none newly issued; incident timings above come from authoritative handoff and deterministic baseline.
- Resume status: baseline reproduced; implementation not started; mandatory-read gate pending.

## Resume commands

```sh
git fetch origin
git switch fix/date-night-live-discovery-resilience-1
git status --short
git log -3 --format='%H %T %P %s'
git merge-base --is-ancestor 4d937e58d2a65567b54ac5271915bc85b498898b HEAD
git show origin/handoff/date-night-live-discovery-resilience-1:docs/handoffs/active/date-night-live-discovery-resilience-1.md
node --test --test-reporter=tap scripts/discovery-provider-deadlines.test.mjs
node --test scripts/discovery-client-lifecycle.test.mjs scripts/seasonal-discovery.test.mjs
```

Migration-free production build later: `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`. Never use migration-chaining `npm run build`.


## Save 1 — hedged providers implemented

- Repository/implementation branch/frozen base remain as above.
- Latest pushed checkpoint at authorship: `f31b63b1ab00a0a2ecf395f743a3273145d44b1c`; tree `a998bab266e3ca4f70801cb88778ad20f071aa68`; sole parent frozen base. This next save is its direct sole-parent descendant.
- Git HTTPS push lacks credentials. Publication uses authenticated GitHub create-tree/create-commit/update-ref, verifies exact local staged tree SHA, fetches published commit and aligns the local ref only after exact-tree verification. No force update of remote refs.
- Mandatory artifact reading COMPLETE before executable changes; manifest retained in new evidence directory. Earlier read-gate blocker resolved.
- Completed milestones: 0 baseline and 1 hedged execution.
- Changed executable paths: `src/lib/discovery/hedged-provider.ts`, `src/lib/date-night/search.ts`, `scripts/date-night-hedged-provider.test.mjs`, `scripts/discovery-provider-deadlines.test.mjs`. Added read manifest and M1 test logs; continuation updated.
- Tests: `node scripts/date-night-hedged-provider.test.mjs` 19/19 PASS; `node scripts/discovery-provider-deadlines.test.mjs` 41/41 PASS (loopback-capable execution); `npm run typecheck` PASS; changed-code ESLint PASS; `git diff --check` PASS.
- Deterministic after: second/third/fourth valid winners 1500/3000/4500ms; all-stall headers/body, including abort-ignoring promises, settle at12500ms with four full8000ms attempt opportunities. Delayed groups remain inside original absolute20000ms budget. Baseline second winner8000ms, third starts16000ms, fourth starved, outage20000ms.
- Design: Date Night-specific helper owns fixed mirrors, at most4 groups/16 attempts, staggered starts, immediate hard-failure advance, first valid empty/nonempty wins, loser abort, late-result guards, bounded privacy log. Existing Dinner/Nightlife provider code unchanged. Provider/client constants20000/25000 unchanged.
- Worktree: coherent four source/test modifications plus new evidence; stage and publish as one checkpoint, then confirm clean worktree.
- Current limitation: Date Night still executes legacy combined query as group `all`; query decomposition, partial results and reuse pending intentionally.
- Next action: M2 add server-validated category plan and narrowed whitelisted queries, focused query tests, then publish before M3 group execution.
- Resume commands: commands above plus `node scripts/date-night-hedged-provider.test.mjs`, `npm run typecheck`.
- Temporary application diagnostics: none.
- Main/production untouched; latest observed production remains `dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL` at frozen base.
- Automatic Git Preview exists for documentation checkpoint only: `dpl_Eq2Wfikqc38EK6tzDydK3jESDh2N`, https://dinner-roulette-jxe3rkc30-minions-9e2c.vercel.app, READY, target null, exact f31b63b. No browser/live acceptance performed early. User-required checkpoint pushes trigger existing Preview integration; no explicit deployment/settings command.
- Prior owner-confirmed hosted build override is migration-free (`pre-merge-production-impact-verification-1-final.md`); package/lock/Vite/Vercel/env-wrapper bytes unchanged. Fresh connector build-log tool unavailable; no fresh hosted build log claim.
- New live-provider observations: none; no timeout extension warranted from deterministic evidence.
- Resume status: HEDGED PROVIDERS IMPLEMENTED — QUERY DECOMPOSITION PENDING.


## Save 2 — validated query decomposition

- Repository `caleb1234calvin-art/dinner-roulette`; branch `fix/date-night-live-discovery-resilience-1`; frozen base unchanged.
- Latest pushed checkpoint: `edb91d91462a333785df79fe80c8f4d8c85839d3`, tree `1166b39d1aad9fa6820b6fabf6ee61f9d1c0fd60`, sole parent `f31b63b1ab00a0a2ecf395f743a3273145d44b1c`. This save has edb91d9 as sole parent; no merges.
- Completed milestones: 0,1,2 server-owned query plan. M2 source paths: new `src/lib/date-night/query-plan.ts`, narrowed `provider-evidence.ts`, validated `search.ts`; new `scripts/date-night-query-plan.test.mjs`; M2 logs/continuation. Prior changed paths remain listed above.
- Tests: `node scripts/date-night-query-plan.test.mjs` PASS16/16; `node scripts/seasonal-discovery.test.mjs` PASS24/24; `npm run typecheck` PASS; ESLint on changed source PASS; `git diff --check` PASS.
- Input: optional/empty/Anything normalizes to currently active types; strict IDs only; unknown, non-array, null, sparse, nested and non-string entries rejected before providers; finite coordinates/radius; radius clamped to existing cap. No arbitrary query text accepted.
- Groups: seasonal (haunted-house/corn-maze/pumpkin-patch), entertainment (bowling/arcade/mini-golf/escape-room/skating), culture (movies/museum), outdoor (park). Specific selections include only requested clauses. Inactive stale seasonal-only selections normalize to ordinary Anything, matching existing eligibility.
- Review found and fixed lifecycle-only negative records omitted by narrowing. Category-specific lifecycle-prefixed companion queries preserve suppression, including real-handler duplicate anti-resurrection tests. Seasonal narrowing preserves structural corn-maze tags, selected direct attractions and supported contextual evidence across all four fields; multi-separator/case reachability, retained Exeter and false-positive rejection tested. Classification code unchanged.
- Worktree coherent for this checkpoint; exact staged tree verified through API before ref publication, then confirm clean.
- Current intermediate behavior: plans generate narrowed combined query under single hedged `all` execution; next M3 executes each planned group independently. UI category acquisition/caching arrives in M4. No hidden partial implementation claim.
- Next action: extract existing identity merge to pure shared module; execute concurrent groups under one provider deadline; expose success/empty/failure metadata and honest partial UI; test and publish M3 before cache.
- Resume commands: prior commands plus `node scripts/date-night-query-plan.test.mjs`, `node scripts/seasonal-discovery.test.mjs`, `npm run typecheck`.
- Blockers: none for M3; Preview build-log connector limitation as above. No temporary instrumentation.
- Main/production untouched; no migration/settings/deployment command. Existing integration automatically creates non-production Previews on checkpoint ref updates; acceptance not yet begun.
- Preview last observed: baseline dpl_Eq2Wfikqc38EK6tzDydK3jESDh2N / URL above; later automatic previews not yet used.
- New live-provider observations: none. Deadlines remain20000/25000ms.
- Resume status: QUERY DECOMPOSITION IMPLEMENTED — PARTIAL MERGE PENDING.


## Save 3 — partial live results

- Repository/branch/frozen base unchanged. Latest pushed checkpoint `68e157dbe9688522d1a8549c9c39778580b3130f`, tree `867d0da8680f0954321b245ccfed6f0f16eb561f`, sole parent `edb91d91462a333785df79fe80c8f4d8c85839d3`. This save descends solely from68e157d; no merges.
- Completed milestones0–3. New `identity.ts` contains extracted existing merge semantics; same OSM id now matches before geometry and tie representatives are stable. Distance thresholds, catalog/alias preference, category/evidence union, conflicting-hours handling and lifecycle precedence preserved.
- Concurrent independent groups share one absolute provider deadline. Every response includes bounded `discovery.groups` with requested category lists and succeeded-nonempty/succeeded-empty/failed outcome; schema supports cancelled/cache-hit for reuse. `partial` means at least one successful group plus at least one failed requested group. Successful-empty is a successful response, never outage.
- Only no successful requested groups falls back. Source remains live/merged/fallback. Partial warning names unavailable category searches; UI displays it even alongside seasonal coverage. Per-category evidence still decides live/saved-only/missing. Exact existing fallback and Halloween caution copy/layout preserved.
- Changed since M2: `src/lib/date-night/{identity,search,types}.ts`, `src/components/date-night-home.tsx`, new partial-results/partial-ui scripts; targeted existing provider/seasonal/security test adaptations; continuation and M3 evidence. Full earlier changed paths above.
- Tests PASS: partial-results12/12; partial UI2/2; query-plan16/16; full seasonal runner24/24; client lifecycle54/54; provider deadlines41/41; typecheck; ESLint all M3 changed source/tests; diff check. Evidence retained. Initial typecheck found ES2023 findLast incompatibility, replaced with ES2022 reverse/find; recheck passed.
- Existing provider deadline suite now explicitly requests Movies only for Date Night, preserving full assertions for one group and unchanged Dinner/Nightlife scenarios. Security suite category/count expectations adapted and hostile category transport cases added; security runtime test awaits fresh M5 production build and is NOT claimed passed yet.
- Deterministic partial/all-group failures settle by12500ms, four groups at most16 attempts. Partial successes and valid-empty survive, aliases/dedupe/lifecycle retained. No deadlines changed.
- Worktree coherent; exact staged tree will be verified during API publication, then clean state confirmed.
- Next action: M4 bounded client cache/raw result reuse, feed selected activityTypes into acquisition, only fetch uncovered categories, current-clock eligibility remains outside cache.
- Resume commands: prior commands plus `node scripts/date-night-partial-results.test.mjs`, `node scripts/date-night-partial-ui.test.mjs`, `node --test scripts/seasonal-discovery.test.mjs`, `node scripts/discovery-client-lifecycle.test.mjs`.
- Blockers: no implementation blocker. Cache/whole-suite/build/Preview/browser/live acceptance still pending. No temporary application instrumentation.
- Main/production remain untouched; no migration/settings change/explicit deployment/merge. Automatic branch Previews continue; last observed baseline Preview above, none accepted yet. No new live-provider probes.
- Resume status: PARTIAL LIVE RESULTS IMPLEMENTED — CACHE/REUSE PENDING.

## Save 4 — bounded coverage cache; pre-validation checkpoint

- Repository `caleb1234calvin-art/dinner-roulette`; implementation branch `fix/date-night-live-discovery-resilience-1`; frozen base `4d937e58d2a65567b54ac5271915bc85b498898b` unchanged.
- Latest pushed checkpoint at authorship `c0fc72d4f09f6c530f8b0c213fc657fc8452b2da`, tree `835eec28897999b0a1337740fc90e1f3cb34dc2c`, sole parent `68e157dbe9688522d1a8549c9c39778580b3130f`. This save is its direct sole-parent descendant; exact new SHA is resolved by `git rev-parse HEAD` after verified publication. No merges.
- Completed milestones0–4. Changed since M3: new `src/lib/date-night/cache.ts`, `scripts/date-night-cache.test.mjs`; DateNightHome integration; three asynchronous settlement waits in existing seasonal category component regression; M4 logs and continuation. Earlier changed paths recorded above.
- Cache is per mounted DateNightHome, memory only, TTL10 minutes, at most8 entries and20000 raw venues. Exact origin/season/semantic-version plus radius coverage and actual successful category metadata control reuse. Anything→subset reuses; subset→superset fetches missing categories; larger radius may serve smaller, never conversely. Open Now/mood/favorites/Fewer Parks do not fetch. Current eligibility remains recomputed from live clock and preferences. Component unmount discards cache.
- Only fresh lifecycle-guarded successful RPC results enter cache. Failures, cancelled/stale/watchdog-late responses, fallback and metadata-free responses do not establish coverage. Assembled responses do not refresh old TTL. Partial cached success survives new transport failure; Retry requests missing categories only.
- Review fixes: newer successful-empty category suppresses older single-category rows from supersets; multitype identities included through another category retain full genuine classification/evidence. Fresh compatible lifecycle negatives remain merged across categories AND radius widening without establishing wider positive coverage. UI safely normalizes obsolete persisted category IDs while server RPC validation remains strict.
- Tests: `node scripts/date-night-cache.test.mjs`25/25 PASS; `node scripts/discovery-client-lifecycle.test.mjs`54/54 PASS; `node scripts/seasonal-discovery.test.mjs`24/24 PASS; `node scripts/date-night-partial-ui.test.mjs`2/2 PASS; `npm run typecheck` PASS; ESLint four changed files PASS; `git diff --check` PASS. Cache/seasonal logs retained. No application diagnostics remain.
- Worktree coherent for save; exact staged tree checked against authenticated remote Git tree and clean worktree verified after publication. Git transport workaround unchanged.
- Next action: M5 full repository/app suite, fresh auth-enabled migration-free production build and current TanStack security tests; dependency/casino/Android preservation in parallel. Controlled browser harness is being prepared before build fingerprint capture, but no Preview/browser/live acceptance runs before deterministic gates pass.
- Resume commands: `git fetch origin`; `git status --short`; `git log -3 --format='%H %T %P %s'`; focused commands above; `npm test`; `VITE_AUTH_ENABLED=true node scripts/browser-build-proof.mjs capture`; `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`; `VITE_AUTH_ENABLED=true node scripts/browser-build-proof.mjs complete`. Never `npm run build` or a migration.
- Blockers: none for validation. Existing build-log connector limitation remains. Full-suite/build/security/Preview/browser/live acceptance not yet claimed. Deadline extension is unwarranted so far;20s provider/25s client unchanged.
- Main/production untouched; last observed production `dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL` at frozen base. Automatic non-production branch Previews only; last inspected baseline Preview `dpl_Eq2Wfikqc38EK6tzDydK3jESDh2N`, https://dinner-roulette-jxe3rkc30-minions-9e2c.vercel.app. No new live-provider observations.
- Resume status: DATE NIGHT DISCOVERY RESILIENCE FEATURE-COMPLETE — VALIDATION PENDING.

## Save 5 — preservation checks and browser harness preparation

- Repository/implementation branch/frozen base unchanged. Latest pushed checkpoint `9e7b1da5b1e8dfdfdcb9c914e961dad2d108d21a`, tree `46c281288de15d06a74c32ac56d81c6b37054dea`, sole parent `c0fc72d4f09f6c530f8b0c213fc657fc8452b2da`. This save is its sole-parent descendant; no merge.
- Completed milestones0–4; M5 in progress. `npm ls --all`, `npm run audit:casinos` (883 canonical/899 serialized/60 catalogs), `npm run android:check` (15 launcher resources/4 web icons), Python native verifier3/3, `npm run android:sync` all PASS. All41 tracked Android/configuration files have identical before/after SHA-256 and empty Git diff. Native preservation began and ended with clean worktree.
- `node --experimental-strip-types --test src/lib/date-night/availability.test.ts src/lib/location/location.test.ts` PASS (runner reports two file-level groups); `npm run typecheck` PASS;16 changed implementation/test files ESLint PASS. Focused M4 independent read-only review found no remaining blocker.
- Added controlled browser harness and disposable CI-only provider preload plus real Preview matrix harness. These are test tooling only, never application imports. No browser acceptance run yet; sources are prepared before production-build fingerprint capture. Preservation logs/hashes and previously locally retained M1–M3 logs explicitly added despite repository global log-ignore rule.
- Worktree consists only of coherent new acceptance scripts and evidence/continuation. No executable application change after M4.
- Next action: migration-free auth-enabled build with capture/complete proof, then authoritative `npm test` including current TanStack transport security. Do not run browser/live phase until these pass. If any stall/failure, retain logs and checkpoint before retrying a changed diagnostic approach.
- Resume commands: `git status --short`; `git log -1 --format='%H %T %P'`; safe build sequence from Save4; `npm test`; `node scripts/tanstack-security.test.mjs`. Native result details in `m5-preservation-results.json`.
- Blockers/unresolved: full-suite/build/security and M6 acceptance pending; no new implementation blocker. Original server HTTP-disconnect propagation remains unproven; client RPC signal forwarding, loser cancellation and hard deadlines are proven. Do not overclaim server disconnect cancellation.
- Temporary diagnostics: CI-only fixture scripts retained as permanent tests; no application instrumentation.20s/25s deadlines unchanged.
- Main/production untouched. Latest automatic Preview inspected READY, target null, exact9e7b1da: `dpl_G3ve8wbkGQeNMwSNMDwKyFYos3DZ`, https://dinner-roulette-noex2wc8d-minions-9e2c.vercel.app. No live-provider/browser acceptance performed yet.
- Resume status: FEATURE COMPLETE — FULL DETERMINISTIC VALIDATION IN PROGRESS.

## Save 6 — full deterministic validation passed; pre-browser checkpoint

- Repository `caleb1234calvin-art/dinner-roulette`; branch `fix/date-night-live-discovery-resilience-1`; frozen base `4d937e58d2a65567b54ac5271915bc85b498898b` unchanged. Fresh remote main check still exact frozen base.
- Latest pushed checkpoint `d6ca8517144bd1e1e16d8479ff4ada221059e122`, tree `b52f88b5dd3325a45dfdcf66b1646c5dce67851b`, sole parent `9e7b1da5b1e8dfdfdcb9c914e961dad2d108d21a`. This evidence save directly descends from it. No merges.
- Completed milestones0–5. `timeout 300s npm test` PASS:533 repository-script tests +71 application tests =604 passes,4 inherited documentation skips,0 failures; both runner suites passed. Fresh compiled TanStack codec/CSRF/method/hostile-category/transport/deadline tests included and passed. Full suite duration approximately18.4s repository +0.43s app.
- Auth-enabled migration-free production build PASS. Build-proof capture/complete/verify PASS: source SHA256 `81b6c351ef88bb112b9ca831d44594bb79de1f460221f63ff823ba3e3964dfae` (411 files), output `7a6167688d6b0364e0c8aca9e7e8384f49792a8f384c2ad60e8a02fa3ec18a42` (194 files). No migration. Typecheck/changed-code lint/dependencies/native/casino gates above passed.
- Read-only protected scope audit:454 prior audit/catalog/semantic/Dinner/Nightlife/provider/client/dependency/auth/config/native paths unchanged. Android gradlew.bat expected checkout CRLF normalization is documented and byte-stable before/after sync.
- Changed this save: new evidence logs, M5 gates, deterministic timing JSON, continuation only. Application/harness source unchanged after Save5; worktree clean before evidence copy, coherent evidence-only dirty state before publication. Trailing blank EOF in copied logs normalized for Git whitespace checks; no test outcome changed. Earlier unverified tree publication attempt did not create a commit/ref update; exact-tree verified retry succeeded.
- Deadline decision remains20s provider/25s client. No measurement supports extending them. Query/cache/partial design unchanged. Temporary application instrumentation: none; disposable fixture scripts are permanent test tooling.
- Next action: M6 controlled production-built browser scenarios A–D, then actual Carthage Preview12-row matrix. Run `CI=true VITE_AUTH_ENABLED=true DATE_NIGHT_BROWSER_OUTPUT=/tmp/pfu-date-night-controlled node scripts/date-night-resilience-browser.mjs`; run real script only against verified non-production Preview with `VITE_AUTH_ENABLED=true BROWSER_ALLOW_EXTERNAL_HOST=1 PFU_PREVIEW_DEPLOYMENT_ID=... PFU_CANDIDATE_SHA=... node scripts/date-night-resilience-live.mjs <PreviewURL> /tmp/pfu-date-night-live`. Use loopback/browser-capable execution; preserve outcome on any failure before diagnostic retry.
- Resume commands: `git status --short`; `git log -1 --format='%H %T %P'`; `VITE_AUTH_ENABLED=true node scripts/browser-build-proof.mjs verify`; inspect `m5-gates.json` and run M6 commands above. Rebuild only if source fingerprint changes.
- Blockers: none at deterministic gate. Browser/real-provider outcomes unresolved and not yet claimed. Server disconnect-to-provider propagation remains an explicitly unproven inherited limitation.
- Latest inspected automatic Preview: `dpl_Fq68aom1zSE5CBjcCit19ex1wqVB`, https://dinner-roulette-7d09gn6zd-minions-9e2c.vercel.app, READY target null, exactd6ca851. Later evidence-only checkpoint Preview may be used after exact commit verification. No live probes yet.
- Production/main untouched: production still `dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL` at frozen base. No merge/promotion/deployment command/configuration/database change.
- Resume status: DETERMINISTIC VALIDATION PASSED — PREVIEW/BROWSER/LIVE ACCEPTANCE PENDING.

## Save 7 — controlled browser acceptance passed; Preview access diagnosis

- Repository/branch/frozen base unchanged. Latest pushed checkpoint `966447ed9d43157876f1a83293148e1e00ca44ce`, tree `f3e568607d8cc32096b3c91f0d1ae8094c25635e`, sole parent `d6ca8517144bd1e1e16d8479ff4ada221059e122`. This save is its direct sole-parent descendant; no merge.
- Completed0–5 and controlled M6 scenarios A–D PASS4/4 against auth-enabled production-built local Preview, real Chromium/TanStack RPC, synthetic public-provider failures only. Provider/visible-spinner durations: second winner1583/1806ms, third3080/3319ms, partial12541/12454ms, all-stall12506/12434ms. Mirror2/3 started1500/3001ms; losers aborted. Partial seasonal success survived parks failure; all4groups16attempt outage showed honest fallback. Open Now no-refetch, selectable live fixture, no page errors/horizontal overflow. Owned local server/browser cleaned up.
- Actual Preview attempt1 targeted verified READY non-production `dpl_JBCV767umF9iMBsVoRQQMJQrBkDc`, https://dinner-roulette-mmfo9oxhy-minions-9e2c.vercel.app, exact966447e. Failed during initial browser navigation/environment before ANY Date Night RPC:0rows/0requests. No live-provider success/failure claim from this attempt. Privacy-safe failure log lacks network reason, so next step is a navigation-only diagnosis with no provider calls.
- Changed this save: controlled JSON/events/log, failed live-attempt JSON/log and continuation only. Screenshots remain in `/tmp/pfu-date-night-controlled/` for final evidence transfer; no temporary application instrumentation. Application/harness code unchanged; clean tree before evidence collection, coherent evidence-only state for publication.
- Exact next action: diagnose Preview navigation using fresh browser with JavaScript disabled, record only bounded network error codes/status. If harness needs environment flags or diagnostics, amend harness only, validate/rebuild fingerprint, then rerun actual12-row matrix. Do not repeatedly retry public providers blindly.
- Resume: inspect M6 evidence; `git status --short`; `VITE_AUTH_ENABLED=true node scripts/browser-build-proof.mjs verify`; same real Preview command from Save6 with deployment/URL above. Preserve each materially changed diagnostic attempt.
- Blocker: real browser navigation failed before RPC; root cause not yet known. Remaining M6 real matrix and M7 final freeze pending. All deterministic/security/native/build gates remain passed;20s/25s unchanged.
- Main/production untouched. No merge/promotion/migration/settings change. Non-production automatic Previews only. New live-provider observations: none yet.
- Resume status: CONTROLLED BROWSER PASSED — REAL PREVIEW ACCESS DIAGNOSIS REQUIRED.

## Save 8 — disposable browser TLS diagnosis resolved

- Repository/branch/frozen base unchanged. Latest pushed `7552fb6c16f6df49e87f7f75c847816f676e24ab`, tree `a84d5e08d1a846de788844bf0fdd19ae792c2f1c`, sole parent `966447ed9d43157876f1a83293148e1e00ca44ce`. This save is its direct sole-parent descendant.
- M6 navigation-only diagnosis (JavaScript disabled,0 discovery calls) isolated Chromium `net::ERR_CERT_AUTHORITY_INVALID`. Disposable context `ignoreHTTPSErrors:true` returned200/title Pick For Us. Added explicit opt-in `PFU_BROWSER_IGNORE_HTTPS_ERRORS=1` to live harness and bounded normalized network-code capture. No app or platform TLS changes. This exception is recorded in live verdict, never silently applied by default.
- Changed only `scripts/date-night-resilience-live.mjs`, diagnosis/build logs and continuation. ESLint/diff check PASS. Fresh auth-enabled migration-free build and capture/complete PASS after harness fingerprint change; previous604 deterministic passes still apply to unchanged application code. All4 controlled browser scenarios passed as Save7; screenshots pending final transfer.
- Worktree coherent with one harness-only change plus evidence before publication; no temporary application instrumentation.20s provider/25s watchdog unchanged.
- Next action: actual Preview12-row matrix using explicit disposable TLS flag and verified non-production Preview; inspect source/coverage/eligibility/request counts, checkpoint result, then final validation/evidence/freeze.
- Resume: `VITE_AUTH_ENABLED=true node scripts/browser-build-proof.mjs verify`; `VITE_AUTH_ENABLED=true BROWSER_ALLOW_EXTERNAL_HOST=1 PFU_BROWSER_IGNORE_HTTPS_ERRORS=1 PFU_PREVIEW_DEPLOYMENT_ID=dpl_JBCV767umF9iMBsVoRQQMJQrBkDc PFU_CANDIDATE_SHA=966447ed9d43157876f1a83293148e1e00ca44ce node scripts/date-night-resilience-live.mjs https://dinner-roulette-mmfo9oxhy-minions-9e2c.vercel.app /tmp/pfu-date-night-live-attempt-2`. This Preview has identical application source to newer evidence/harness checkpoints; verify final candidate Preview separately.
- Blocker resolved for navigation; actual live-provider availability still unmeasured. No public-provider call during diagnosis. No permission/login bypass occurred; Preview is public and non-production.
- Main/production remain untouched. Current known Preview above, production frozen deployment unchanged. No merge/promotion/migration/settings change.
- Resume status: CONTROLLED BROWSER PASSED — REAL PREVIEW MATRIX READY TO RETRY.

## Save 9 — real seasonal bottleneck measured; query refinement required

- Repository/branch/frozen base unchanged. Latest pushed `a18152108f2746eeadc508e1a4c8a1b839a492ae`, tree `a196207b908cf419cc2e98fa5de42a3cd8577150`, sole parent `7552fb6c16f6df49e87f7f75c847816f676e24ab`. This save directly descends from it.
- Real Preview attempt2 navigated successfully using the disclosed disposable TLS option. Six15mi rows completed before a harness local-filter locator failure prevented50mi. Actual Anything returned53 raw/eligible places,45 live identities: entertainment/culture/outdoor succeeded; seasonal failed. Correct partial warning and saved-only/missing seasonal coverage visible. Haunted/mixed showed2 saved eligible anchors; Corn/Pumpkin0; ONmixed2, no refetch. These counts are observations, not invariants.
- Hosted runtime confirms ordinary groups won mirror1 around1830/4297/1912ms. Seasonal all4 mirrors started0/1500/3000/4500ms and each received8000ms before timeout; aggregate12500ms, budgetExhausted false. This proves serial starvation is fixed but a remaining seasonal query cost/provider issue must be investigated before claiming final success. No deadline extension justified.
- Harness ended after sixrows/eightRPCs at local-only controls, not an app crash; safe phase logging is coarse. Source review found the mood aria-label belongs to the Slider root while its thumb owns role slider; target child slider in test. No application UI change planned. Rapid chip switching produced cancelled intermediate RPCs (bounded but may still execute server work); avoid unnecessary repeated provider probes while refining query.
- Changed this save: real attempt2 JSON/log, bounded hosted runtime excerpt and continuation only. App/harness remains as saved8; clean tree before evidence copy. All604 deterministic tests and4controlled browser cases passed, but real seasonal acquisition NOT accepted.
- Next action: refine seasonal query execution while preserving identical whitelist/reachability/classification/lifecycle. Current hypothesis: repeated regex-key metadata scans; Overpass official manual says named sets can reduce repeated work and simple filter reordering has no semantic/ordering benefit. Read-only reviewer proposes exact finite keys/prefixes first, with bounded named-set filtering if necessary. Checkpoint is before executable refinement.
- Primary references reviewed: https://dev.overpass-api.de/overpass-doc/en/criteria/union.html and https://dev.overpass-api.de/overpass-doc/en/criteria/per_tag.html. Treat performance cause as hypothesis until a focused live measurement, not established fact.
- Resume commands: inspect m6-live-attempt-2.json/runtime observations; `git status --short`; focused query/seasonal regressions after refinement; rebuild safe auth bundle and fullsuite before renewed browser/Preview gate. Reuse retained failed query evidence rather than repeatedly querying the same stalled public endpoints.
- Blockers: seasonal real queries still all-mirror timeout;50mi matrix not yet reached; harness mood locator needs correction. No temporary application instrumentation.20s/25s and fixed4mirror/4group bounds intact.
- Preview tested: `dpl_JBCV767umF9iMBsVoRQQMJQrBkDc` / https://dinner-roulette-mmfo9oxhy-minions-9e2c.vercel.app /966447e (same app code as a181521). Main/production untouched; frozen deployment unchanged. No migration/settings/merge/promotion.
- Resume status: REAL PARTIAL SUCCESS CONFIRMED — SEASONAL QUERY REFINEMENT REQUIRED, DO NOT PROMOTE.

## Save 10 — exact-key query refinement; pre-build/pilot checkpoint

- Repository/branch/frozen base unchanged. Latest pushed `9f90f689dcd7327e2c802bd0913327951441969a`, tree `585b13472c8930398ebf37bc63985cce0b163856`, sole parent `a18152108f2746eeadc508e1a4c8a1b839a492ae`. This save directly descends from it; no merge.
- Refined only Date Night query construction: enumerate four classifier-owned text keys and seven lifecycle prefixes instead of regex-key searches. Existing value regex, supported contexts, direct/agricultural selectors, classification/lifecycle logic, radius, groups, mirrors,8s attempt/20s provider/25s client unchanged. Haunted query now32clauses, allseasonal57; expanded text is intentional, performance is not yet claimed.
- Focused PASS: query19/19 (three additional groups, including6167 acquisition/classification comparisons:881 canonical fixtures×7 subsets), seasonal24/24, typecheck, changed-code ESLint, diff check. Frozen prior query is independent semantic control. Uppercase noncanonical keys could previously be fetched but were never classified by unchanged classifier; canonical key semantics preserved.
- Live harness corrected root-label/child-slider locator and specific local-control failure codes. Optional `PFU_LIVE_RADII=15 PFU_LIVE_SELECTIONS=anything` explicitly produces a pilot verdict, expected2rows, fullMatrixPassed false. One initial RPC plus local ON/filter checks minimizes repeat provider load; default remains full12-row matrix. No public probes since failed attempt2.
- Changed paths: `src/lib/date-night/provider-evidence.ts`, query-plan test, live harness, four focused logs, continuation. Screenshots have been copied to new evidence screenshots directory; authenticated immutable PNG blob uploads are being prepared for later checkpoint, not yet a remote image evidence claim. No temporary application instrumentation.
- Worktree coherent after focused validation; exact tree publication before long build/suite/pilot. Existing604-test fullsuite belongs to pre-refinement source; fresh fullsuite required now.
- Next action: fresh safe auth-enabled production build with proof, full `npm test`, then one15mi Anything Preview pilot against exact refined commit. If seasonal still stalls, do not repeat fullmatrix: evaluate bounded context named-set filtering using the preserved primary documentation and semantic corpus. If pilot succeeds, run full15/50matrix.
- Resume commands: `node scripts/date-night-query-plan.test.mjs`; `npm run typecheck`; build-proof capture/safe production build/complete from Save4; `npm test`; verified Preview pilot with `PFU_LIVE_RADII=15 PFU_LIVE_SELECTIONS=anything PFU_BROWSER_IGNORE_HTTPS_ERRORS=1 VITE_AUTH_ENABLED=true BROWSER_ALLOW_EXTERNAL_HOST=1 ...`. All commands retain hard bounds.
- Blockers: refined-query real seasonal performance unresolved;50mi acceptance pending. No deadline extension warranted. Main/production unchanged; automatic non-production Preview only, last actually tested966447/dpl_JBCV767umF9iMBsVoRQQMJQrBkDc. No migration/configuration/promotion/merge.
- Resume status: QUERY EXECUTION REFINED — FRESH VALIDATION AND LOW-LOAD LIVE PILOT PENDING.

## Save 11 — refined full suite passed; low-load Preview pilot gate

- Repository/branch/frozen base unchanged. Latest pushed `f0508548ea1483fd4f4aeac4a68efb219fdc61b8`, tree `02daf9901a6791be9507d53939ebdbc53d737fe9`, sole parent `9f90f689dcd7327e2c802bd0913327951441969a`. This save directly descends from it.
- Refined full deterministic/security suite PASS:536 repository +71 app =607 JavaScript passes,4 inherited skips,0 failures. Safe auth-enabled build and proof PASS: source `bdc8ad9d9191eb259ff5a2183621a42a5e2dea17d17a84a689d603fd4cfc63f2`, output `bfde903316781d41827e5db0eab7b094716d6618901f89a5ad091c15e607694b`. No migration. Focused19query/24seasonal/typecheck/lint above remain passed.
- Changed only fresh logs, six representative unedited PNGs (four controlled scenarios plus initial live Anything/Haunted), and continuation. Immutable PNG blobs uploaded with exact Git SHA verification before tree publication. No code change after Save10, clean tree before evidence copy.
- Next action: one initial15mi Anything discovery plus local ON/filter checks using pilot flags against READY non-production exactf050854 Preview `dpl_DrhrHmWGmYaV4wAt99skKzUBVtNm`, https://dinner-roulette-epqwevkv8-minions-9e2c.vercel.app. Confirm allgroup outcomes explicitly; a functional pilot pass alone does not prove seasonal acquisition succeeded.
- Resume: `VITE_AUTH_ENABLED=true node scripts/browser-build-proof.mjs verify`; run live harness with `PFU_LIVE_RADII=15 PFU_LIVE_SELECTIONS=anything PFU_BROWSER_IGNORE_HTTPS_ERRORS=1 BROWSER_ALLOW_EXTERNAL_HOST=1 VITE_AUTH_ENABLED=true PFU_PREVIEW_DEPLOYMENT_ID=dpl_DrhrHmWGmYaV4wAt99skKzUBVtNm PFU_CANDIDATE_SHA=f0508548ea1483fd4f4aeac4a68efb219fdc61b8`, targetURL above/output `/tmp/pfu-date-night-exact-key-pilot`. If seasonal still fails, preserve evidence before named-set refinement, no repeated fullmatrix hammering.
- Blockers: real seasonal success and full50mi acceptance unresolved. Prior fifteen-mile failure evidence preserved; no public call after it yet. Query equivalence proven but speed remains a measurement question. Deadline constants unchanged; no application diagnostics.
- Main/production untouched, no migration/settings/merge/promotion. Automatic non-production previews only. Resume status:607 DETERMINISTIC PASSES — REFINED QUERY LIVE PILOT PENDING.

## Save 12 — exact-key pilot measured; bounded context stage next

- Repository/implementation branch/frozen base unchanged. Latest pushed `50e677f9262d5ff9069aefc65a6b86188ed73738`, tree `ad51bb72ec4e121eb39c9651d549bd0a460eea91`, sole parent `f0508548ea1483fd4f4aeac4a68efb219fdc61b8`. This save is its direct sole-parent descendant.
- Low-load pilot functional checks PASS2/2 with exactly1RPC, but seasonal performance NOT resolved.15mi Anything53places/45live, seasonal failed while other3groups succeeded; OFF53→ON9 with no RPC; mood/favorites/Fewer Parks no refetch. Correct partial/saved-only/missing disclosure. Full matrix intentionally not retried.
- Hosted log exactf050854 Preview confirms seasonal all4full8s timeouts, starts0/1499/3000/4500ms, group12501ms; ordinary winners1434–3897ms. Exact-key rewrite alone is insufficient; no causal speedup claimed. Evidence JSON/log/runtime retained.
- Changed this save: evidence/continuation only. Clean source before evidence, coherent evidence-only checkpoint.607 deterministic passes/fresh build and original4controlled browser cases remain as recorded; no application diagnostics, no deadline adjustment.
- Next action BEFORE another public probe: implement supported-context preselection into a bounded named set, then apply four seasonal text filters only to that set, union existing precise/agricultural/lifecycle selectors. Context set must be outside final output union so generic farms/parks never leak. No unfiltered all-elements spatial scan. Same groups/mirrors/attempt count and exact classification.
- Upgrade query test evaluator to understand named-set membership and output versus preselection, preserve6167equivalence comparisons and all priorfixtures, add generic-context leakage/lifecycle-outside-context guards. Then focused tests/checkpoint, fresh safe build/fullsuite, one low-load pilot. Do not simply extend deadlines.
- Resume commands: review m6-exact-key-pilot.json/runtime; query/seasonal focused tests; typecheck/lint; build-proof safe build/fullsuite before pilot. Local mood locator is now fixed and verified by real pilot. Screenshots from initialcontrolled/liveattempts durable in Save11.
- Blockers: seasonal query still misses bounded execution window;50mi/fullmatrix unresolved. Main/production untouched, no migrations/settings/promotion/merge. Tested Preview `dpl_DrhrHmWGmYaV4wAt99skKzUBVtNm`, https://dinner-roulette-epqwevkv8-minions-9e2c.vercel.app, exactf050854.20s/25s preserved.
- Resume status: PARTIAL LIVE/CLIENT REUSE VERIFIED — SEASONAL CONTEXT QUERY OPTIMIZATION REQUIRED.

## Save 13 — bounded seasonal context query implemented

- Repository/branch/frozen base unchanged. Latest pushed `668bd9b50e83b60a457a778f1d311a8e58b7b195`, tree `e9c96e9a7ff19b96487ffd962528f95a8e6b365d`, sole parent `50e677f9262d5ff9069aefc65a6b86188ed73738`. This save directly descends from it.
- Implemented bounded eight-context prelude into `.seasonal_context`, outside final output union; four exact prose filters consume it. Precise attraction/agricultural and lifecycle selectors stay independently radius-bounded. No all-elements scan or generic context passthrough. Haunted statements32→20, allseasonal57→45, prose scans24→4. Same categories/groups/coverage semantics/mirror bounds/deadlines.
- Strict fixture interpreter now separates input membership from output and rejects missing/unknown sets, unbounded selectors and unfiltered context leakage. Retained6167equivalence comparisons, added direct context-only and lifecycle-independent guards. Query22/22, seasonal24/24, typecheck, three-filelint, diffcheck PASS. Independent read-only cache/seasonal review found no blocker; real speed remains unproven.
- Changed only `provider-evidence.ts`, `query-plan.ts`, `date-night-query-plan.test.mjs`, focused logs, continuation. Worktree coherent for checkpoint; no other source edits or temporary application instrumentation.
- Next action: safe auth build/proof and fullsuite on this exactsource; push results; then one15mi Anything pilot against exactnew Preview. If seasonal succeeds, proceed full15/50matrix. If not, preserve measured outcome and investigate before repeating any public load.
- Resume commands: query/seasonal/typecheck as above; capture/build/complete safe sequence; `npm test`; livepilot flags from Save11 with newlyverified deployment ID/URL/commit. No `npm run build`/migration.
- Blockers/unresolved: real seasonal throughput and50mi/fullmatrix still pending. Previous exact-key pilot partialonly result preserved.607passes applies to prior source; fresh complete suite pending this refactor.20s provider/25s watchdog/8s attempts unchanged.
- Main/production untouched; automatic non-production Preview only. Last measured publicproviderdata remains f050854/dpl_DrhrHmWGmYaV4wAt99skKzUBVtNm; no new probes during implementation. No migration/settings/merge/promotion.
- Resume status: BOUNDED CONTEXT QUERY IMPLEMENTED — FULL VALIDATION AND PILOT PENDING.

## Save 14 — bounded-context full validation passed; pre-pilot

- Repository/branch/frozen base unchanged. Latest pushed `a1ebaefde27b0f5f6845f7ee158a358e2487e7a0`, tree `357973f9118b475d615fe2b803cc834b521a71d5`, sole parent `668bd9b50e83b60a457a778f1d311a8e58b7b195`. This save directly descends from it.
- Fresh fullsuite PASS539 repository +71application =610 JavaScript passes,4 inherited skips,0 failures; compiled security suite included. Auth-enabled migration-free production build/proof PASS: source `01a7706bcd1871b6bc866dc87a5f656bd89c2a1d1e79085efb9e65068b0b488f`, output `44b4af09c462630e805162213d0933598a4dc3307d222721995e9ec74257a951`.22query/24seasonal/typecheck/lint passed. No source modification after Save13.
- Changed only full/build logs and continuation. Clean source before evidence copy, coherent evidence-only state. No temporary application diagnostics;20s/25s/8s unchanged. Main/production untouched; no migration/settings/merge/promotion.
- Next action: one15mi Anything pilot, then fullmatrix only if seasonal now returns a valid response. Verified READY non-production exacta1ebaef Preview `dpl_2Yj8nnPFbosnVPDMK5MNffJtMdCw`, https://dinner-roulette-8nkpc3y0k-minions-9e2c.vercel.app. Also refresh controlledbrowser evidence on finalapplication source before freeze.
- Resume commands: verify buildproof; run livepilot with previous flags, `PFU_PREVIEW_DEPLOYMENT_ID=dpl_2Yj8nnPFbosnVPDMK5MNffJtMdCw PFU_CANDIDATE_SHA=a1ebaefde27b0f5f6845f7ee158a358e2487e7a0`, URLabove/output `/tmp/pfu-date-night-context-pilot`. Controlled harness uses output `/tmp/pfu-date-night-controlled-context` and never public providers.
- Blockers/unresolved: actual bounded-context performance and full50mi acceptance pending; prior failedshape evidence preserved. No new live data since Save12. Resume status:610 DETERMINISTIC PASSES — BOUNDED-CONTEXT LIVE PILOT PENDING.

## Save 15 — seasonal pilot succeeds; controlled browser refresh passed

- Repository `caleb1234calvin-art/dinner-roulette`; implementation `fix/date-night-live-discovery-resilience-1`; frozen base `4d937e58d2a65567b54ac5271915bc85b498898b`. Latest pushed `4ddcd78d7aab02069c9ea29e6a4c5d2f0fdab20b`, tree `6bfcf0074821c7c2248c92835b4918d390a5f7ed`, sole parent `a1ebaefde27b0f5f6845f7ee158a358e2487e7a0`. This save directly descends from it. Clean source before evidence copy; evidence-only coherent worktree for publication.
- Actual named-set pilot PASS2/2, oneRPC. All4groups succeeded; seasonal valid-empty won mirror1 at3745ms, aggregate3774ms, RPC3942ms.15mi Anything53venues/45live, partialfalse; OpenNow53→9 with0RPC, mood/favorites/FewerParks0RPC. Saved-only/missing-seasonal coverage disclosed without false provider-failure warning. This is one observed provider result, not proof of exhaustive recall or a stable count.
- Fresh controlled browser PASS4/4 on final application source: provider/spinner ms second1582/1806, third3079/3333, partial12504/12407, allstall12503/12501. Mirror2offset1500, mirror3offset3001; loser cancellation; partial seasonal live selection;16bounded all-stall attempts; source/OpenNow/mobile checks passed. No public provider calls from controlled harness.
- Exact commands: `CI=true VITE_AUTH_ENABLED=true DATE_NIGHT_BROWSER_OUTPUT=/tmp/pfu-date-night-controlled-context node scripts/date-night-resilience-browser.mjs`; live harness with `PFU_LIVE_RADII=15 PFU_LIVE_SELECTIONS=anything PFU_BROWSER_IGNORE_HTTPS_ERRORS=1 VITE_AUTH_ENABLED=true BROWSER_ALLOW_EXTERNAL_HOST=1` plus deployment/candidate below. Latest610 deterministic passes and safe build remain current, no code changed.
- Changed files: six new pilot/controlled JSON/events/log/runtime evidence files and continuation. Hosted runtime excerpt is tool-truncated and labeled; no precise coordinates/query bodies/raw exceptions logged. No temporary application instrumentation.20s provider/25s client/8s attempts unchanged.
- Preview actually tested: `dpl_2Yj8nnPFbosnVPDMK5MNffJtMdCw`, https://dinner-roulette-8nkpc3y0k-minions-9e2c.vercel.app, exact application source commit `a1ebaefde27b0f5f6845f7ee158a358e2487e7a0`. Explicit disposable browser TLS verification exception remains disclosed; app/platform TLS unchanged.
- Blockers/failures: none in latest pilot or controlled phase. Full12-row15/50matrix and final candidate freeze still pending. Previous failed-shape evidence preserved; no deadline extension justified.
- Exact next action: run default full real Preview12-row matrix on the above exact application source, then checkpoint all results before final audit/freeze. Resume command: `VITE_AUTH_ENABLED=true BROWSER_ALLOW_EXTERNAL_HOST=1 PFU_BROWSER_IGNORE_HTTPS_ERRORS=1 PFU_PREVIEW_DEPLOYMENT_ID=dpl_2Yj8nnPFbosnVPDMK5MNffJtMdCw PFU_CANDIDATE_SHA=a1ebaefde27b0f5f6845f7ee158a358e2487e7a0 node scripts/date-night-resilience-live.mjs https://dinner-roulette-8nkpc3y0k-minions-9e2c.vercel.app /tmp/pfu-date-night-context-full`. First verify `git status --short` and `VITE_AUTH_ENABLED=true node scripts/browser-build-proof.mjs verify`.
- Main/production untouched; no merge/promotion/migration/settings changes; non-production automatic Previews only. Resume status: ALL-GROUP LIVE PILOT AND CONTROLLED BROWSER PASSED — FULL MATRIX NEXT.

## Save 16 — complete real acceptance passed; final validation gate

- Repository `caleb1234calvin-art/dinner-roulette`, branch `fix/date-night-live-discovery-resilience-1`, frozen base `4d937e58d2a65567b54ac5271915bc85b498898b`. Latest pushed `a1942f8d6c8078d3be3f16d76d34d6b0a396dd66`, tree `1814692c499c371374dbd8608fcf4472bf42f667`, sole parent `4ddcd78d7aab02069c9ea29e6a4c5d2f0fdab20b`. This save is its direct sole-parent descendant. Clean source before evidence copy; only evidence/continuation changes for publication.
- M0–M6 COMPLETE. Full real Carthage matrix PASS12/12 with exactly2RPCs. All4groups succeeded at both radii.15mi: Anything53eligible/45live, Haunted2/Corn0/Pumpkin0/mixedOFF2/ON2.50mi: Anything241eligible/243raw/235live, Haunted2/Corn1/Pumpkin0/mixedOFF3/ON2. Every covered chip selection and local-only toggle reused acquisition with0RPC. No page errors/overflow/stale-settlement assertion failures; spinner bounded.
- Hosted provider aggregate15mi4145ms,50mi6075ms; seasonal respectively3764ms valid-empty and5643ms nonempty. BrowserRPC4396/6376ms and full initialsettlement5249/7219ms. Source merged and partialfalse both; live Corn Maze disclosed at50mi, saved-only Haunted and missing Pumpkin truthful. Counts are observations, not assertions. Valid-empty is not proof of exhaustive geographic absence.
- Live command exactly Save15 resume command, without pilot flags, output `/tmp/pfu-date-night-context-full`; exit0. Hosted bounded runtime excerpts saved, tool truncation explicit. Public load limited to two acquisitions; additional decoding made no requests. Controlled4/4 and610deterministicpasses remain on exactsame source.
- Changed paths: fullmatrix JSON/log/runtime excerpt and continuation. Sixteen latest screenshot images awaiting verified immutable blob transfer for final evidence. No temporary application instrumentation.20s provider/25s client/8s attempts retained; healthy observations do not justify extension.
- Preview `dpl_2Yj8nnPFbosnVPDMK5MNffJtMdCw`, https://dinner-roulette-8nkpc3y0k-minions-9e2c.vercel.app, exact executable source `a1ebaefde27b0f5f6845f7ee158a358e2487e7a0`. Test-browser-only TLS exception disclosed; no platform TLS/auth change.
- No active blocker. M7 final validation/audit/continuity/immutablefreeze remain. Independent scope/privacy review confirms454protectedfiles unchanged and evidence free of precise-location/query/secret logs; final review ongoing.
- Exact next action: final `npm test`, typecheck, changed-code lint, dependency/casino/Android checks and build-proof verification; retain full logs, then create new remediation MD/JSON and prepend current AI_CONTINUITY entry without changing history. Fresh remote main/production checks and immutable candidate freeze last. Resume `git status --short`; `VITE_AUTH_ENABLED=true node scripts/browser-build-proof.mjs verify`; `npm test`; `npm run typecheck`; inspect final logs and complete report draft at `../resilience-evidence-draft.md/.json`.
- Main/production untouched; no merge/promotion/migration/settings changes. No need for further public-provider probing after fullmatrix success unless a concrete new defect appears. Final independent verifier must receive exact SHA/tree/soleparent and matching Preview source.
- Resume status: ALL REQUIRED BROWSER/LIVE ACCEPTANCE PASSED — FINAL VALIDATION AND CANDIDATE FREEZE PENDING.

- Late final review blocker, independently reproduced with fixed timestamp: cache freshness tie uses mutable LRU `used`; after newer valid-empty Corn acquisition, reading older Anything for Movies may promote it and resurrect old Corn. Fix narrowly with immutable admission ordinal for freshness ties; keep `used` only for eviction. Add regression. This checkpoint precedes executable correction; all preceding measured results remain truthful, but final source/build/browser proof must be refreshed after fix. Exact next action is this correction before final validation; no unrelated refactor.

## Save 17 — cache freshness tie regression repaired; pre-final build

- Repository `caleb1234calvin-art/dinner-roulette`; branch `fix/date-night-live-discovery-resilience-1`; frozen base `4d937e58d2a65567b54ac5271915bc85b498898b`. Latest pushed `6f9598dfbdce79d4dd2f7210d15c58f75d1c231e`, tree `e468638418feb60d8766030adcbb1a43938fbef0`, sole parent `a1942f8d6c8078d3be3f16d76d34d6b0a396dd66`. This save directly descends from it. Worktree coherent: only two executable/test paths plus four logs and continuation.
- Added fixed-clock regression first:25PASS/1FAIL before sourcefix, oldCorn incorrectly resurrected after unrelated Movies read. Source fix adds immutable admission ordinal for equal-timestamp freshness; mutable use sequence remains LRU eviction only. Cache26/26PASS after, typecheck/2fileESLint/diffcheckPASS. Exact `node scripts/date-night-cache.test.mjs`, `npm run typecheck`, `npx eslint src/lib/date-night/cache.ts scripts/date-night-cache.test.mjs` logs retained including intentional RED result.
- Changed `src/lib/date-night/cache.ts`, `scripts/date-night-cache.test.mjs`; no query/provider/UI/deadline alteration. M0–M6 evidence complete; final source fullsuite/build/browser refresh remains before M7freeze. Previous610pass/all4controlled/12real tests are correctly pinned to pre-tie source, not represented as final source results.
- Exact next action: fresh auth-enabled migration-free build with capture/complete, final full `npm test`, typecheck/changed-code lint/dependencies/casino/Android/Python checks, then checkpoint before final controlled/real source acceptance. No deadline extension. No temporary application diagnostics.
- Resume commands: `git status --short`; `VITE_AUTH_ENABLED=true node scripts/browser-build-proof.mjs capture`; `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`; `VITE_AUTH_ENABLED=true node scripts/browser-build-proof.mjs complete`; `npm test`. Never `npm run build` or migration.
- Known blocker resolved by focused regression; final validation pending. Full named-set Preview12/12 from Save16 remains valid historical performance evidence: twoRPCs, all4groupssuccess15/50,50mi liveCorn. Last tested Preview `dpl_2Yj8nnPFbosnVPDMK5MNffJtMdCw` / https://dinner-roulette-8nkpc3y0k-minions-9e2c.vercel.app /a1ebaef source. New finalsource Preview will be verified after push.
- Fresh main fetch still exactly frozen base; latest production deployment still `dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL` at that base. Main/production untouched; no merge/promotion/migration/settings change. Automatic branch Previews only.
- Resume status: CACHE TIE CORRECTION VERIFIED — FINAL SOURCE VALIDATION PENDING.

## Save 18 — final safe build passed; loopback-capable test rerun required

- Repository/implementation/frozenbase unchanged. Latest pushed `ce632d5d973396df92a74d36d57125e0fd7423fc`, tree `aa5c6af95dba32fc9cee84bf1292d8c52b4d2bf5`, sole parent `6f9598dfbdce79d4dd2f7210d15c58f75d1c231e`. This save directly descends from it. Worktree evidence-only, source clean.
- Fresh auth-enabled migration-free capture/build/complete PASS on cache-tie-corrected source; source hash `7d311336c539bc24576983dd91103f048e1bb8db950e9372f7f7fb18629a0177`, output `9673833b98a32d7816eaab21154133d6605c80fd7bf95ed94136b557835c1186`. Typecheck, all19changed-codefiles ESLint, dependency tree, casino883canonical/899serialized/60catalogs, Android15launcher+4webicons, Python3/3 PASS. No migration/native source change.
- First final `npm test` was accidentally invoked in the restricted runner. Repository file-level36pass/7fail; app5file-levelpass. No complete test success claimed. Small direct provider-suite diagnosis proved40/41pass with final native HTTP listener failing `listen EPERM 127.0.0.1`, exactly the loopback environment restriction documented in Save0. Preserve failed log and diagnosis; rerun authoritative suite with loopback-capable execution, without changing tests/source. Other six file failures remain in the raw restricted-run log and will be resolved/diagnosed by that authorized rerun.
- Changed only final build/check/failure logs, continuation, and trailing-space normalization of the intentional RED cache-test log (no result text altered). Source diff checks passed; copied RED log contained two blank lines with spaces in Save17, now removed. No temporary application instrumentation.
- Exact next action: `timeout 300s npm test > ../m7-full-suite.log 2>&1` in loopback-capable execution. If PASS, checkpoint before final controlledbrowser+real2RPC matrix against exactcachefixed Preview; if failure persists, diagnose it without weakening assertions.
- Verified finalsource Preview READY/non-production: `dpl_4aJAVbUh9jjEdP7bsz5n3ep2ypo6`, https://dinner-roulette-7umkzl8qi-minions-9e2c.vercel.app, exact `ce632d5d973396df92a74d36d57125e0fd7423fc`. Previous fullreal12/12 and4controlled facts remain pinned to pre-tie source.20s/25s/8s bounds unchanged.
- Main/production untouched and freshly verified frozen in Save17; no migrations/settings/merge/promotion. Current blocker is final fullsuite runner capability, not established application regression. Resume status: FINAL BUILD/PRESERVATION PASSED — LOOPBACK-CAPABLE FULLSUITE RERUN NEXT.

## Save 19 — final source fullsuite passed; last browser gate

- Repository/implementation/frozenbase unchanged. Latest pushed `87d91a48306851bb06d86e385c7a672c8634a95e`, tree `4c93d78c3d493843b062cbac7898cbe85a2ad76a`, sole parent `ce632d5d973396df92a74d36d57125e0fd7423fc`. This save directly descends from it; source clean, evidence-only worktree for publication.
- Final `timeout 300s npm test` in loopback-capable runner PASS611JavaScript =540repository+71application,4inheritedskips,0failures. All seven restricted-runner file failures disappeared without source/test modifications. Compiled TanStack security/CSRF/codec/method/hostile category/transport tests passed on fresh finalbuild. New fixed-clock cache regression included. Final cache26, query22, hedge19, partial12/UI2, deadline41, lifecycle54, seasonal24 groups pass. Independent final ordinal review found no further blocker.
- Prior finalsafe build/sourceproof/typecheck/changed19filelint/dependencies/casino/Android/Python all PASS as Save18.20sprovider/25sclient/8sattempts unchanged. No temporary application instrumentation. Main/production untouched; no migration/settings/merge/promotion.
- Changed only finalfullsuite log and continuation. M0–M6 complete; finalcodevalidation complete; finalsourcebrowser refresh/evidencefreeze pending. Earlier full12real/4controlled evidence remains intact; do not confuse its source identity with cachefix.
- Exact next action: controlled4scenario browser on latestbuild, then full12row real matrix against READY nonproduction `dpl_4aJAVbUh9jjEdP7bsz5n3ep2ypo6`, https://dinner-roulette-7umkzl8qi-minions-9e2c.vercel.app, exact executable `ce632d5d973396df92a74d36d57125e0fd7423fc`. Full live replay now addresses concrete finalcache-source change and needs onlytwoRPCs if providers healthy; no stress/retry loop.
- Resume commands: buildproof verify; `CI=true VITE_AUTH_ENABLED=true DATE_NIGHT_BROWSER_OUTPUT=/tmp/pfu-date-night-final-controlled node scripts/date-night-resilience-browser.mjs`; `VITE_AUTH_ENABLED=true BROWSER_ALLOW_EXTERNAL_HOST=1 PFU_BROWSER_IGNORE_HTTPS_ERRORS=1 PFU_PREVIEW_DEPLOYMENT_ID=dpl_4aJAVbUh9jjEdP7bsz5n3ep2ypo6 PFU_CANDIDATE_SHA=ce632d5d973396df92a74d36d57125e0fd7423fc node scripts/date-night-resilience-live.mjs https://dinner-roulette-7umkzl8qi-minions-9e2c.vercel.app /tmp/pfu-date-night-final-live`. Use loopback/browser-capable execution. Save results before finalreport/continuity/freeze.
- No active blocker; finalbrowser/evidence identity pending. Latest live observations remain full12passed namedsetsource; newcachefix does not change providerqueries. Resume status:611FINAL DETERMINISTIC PASSES — FINAL BROWSER SOURCE REFRESH NEXT.

SAFE TO RESUME FROM THIS CHECKPOINT
