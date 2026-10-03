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

SAFE TO RESUME FROM THIS CHECKPOINT
