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

SAFE TO RESUME FROM THIS CHECKPOINT
