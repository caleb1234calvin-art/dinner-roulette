# Pick for Us — Seasonal Release-Scope Verification #1

## Task and authority

Independently verify the frozen release-scope remediation below. The owner has deferred new live current-season seasonal-attraction ingestion for this release. Do not reopen discovery, activate a source, add records, contact operators, use paid APIs/geocoding, or weaken fact/permission gates.

Authoritative decision handoff: `docs/handoffs/active/date-night-seasonal-release-scope-decision-1.md`, original handoff commit `98faa19ad329b7a309bb8d89222ef981aff3ccb5`, original blob `9086dd1d4d2329804cf2b556a3f4a6a4a7fb0c7c`. Its exact contents are preserved in the candidate. Read that handoff and `audit/date-night-seasonal-release-scope-decision-1.md` before verification. Historical continuity does not replace either.

## Immutable implementation candidate

- Repository: `caleb1234calvin-art/dinner-roulette`
- Branch: `fix/date-night-seasonal-release-scope-remediation-1`
- Candidate SHA: `d62f02eb62bc97329f52d86043906e8a71684ef1`
- Candidate tree: `a0a46b01ebd21b424ebaf6a9a70ad65d0ea4586d`
- Required sole parent: `580b493e52fffc1e592b8107b142e01c945cee7f`
- Parent tree: `f398ab4423b30e67d696eda4603a03ba9b4db7dd`
- Parent's sole parent: `9c19deec26b433e7fb6b14c48e76cc0ea4cfbc93`

First action: verify all these exact object identities. Stop on mismatch. Work in an isolated checkout; do not modify the candidate. This handoff is added in a separate documentation-only child commit, whose exact SHA/tree/parent are in the external review package. The publication tip must differ from the implementation candidate **only by adding this handoff**; verify that before accepting the package. Do not mistake the handoff authoring branch for the implementation base. Runtime/build inputs must be identical between the two commits.

## Findings and why the changes exist

The starting UI is functional but its blanket Halloween promise and “Live seasonal results” wording can imply confirmed current-season availability. Existing OSM discovery is map evidence, not a live operator calendar. Two saved Jasper County haunts have preexisting bounded 2026 availability; they do not establish broad corn-maze or pumpkin-patch coverage. Empty states and unknown-schedule/Open-now behavior already handle sparse results.

The immutable research base also predates already-live radial pacing. Restoring the protected-production blobs avoids regression when this branch is integrated. No new pacing design is introduced.

| Changed implementation/test path | Reason |
| --- | --- |
| `src/components/halloween-date-night-panel.tsx` | Qualify the enabled/disabled seasonal copy and explain saved places, map listings and absence of live current-season schedule refresh. |
| `src/lib/date-night/coverage.ts` | Identify mapped seasonal results without claiming confirmed current-season availability. |
| `src/components/date-night-home.tsx` | Ordinary-category fallback in Halloween styling must say saved local date ideas, not seasonal anchors. |
| `src/lib/date-night/radial-session.ts` | Exact protected-production pacing blob, including 250 ms healthy pause and at least 1,000 ms between outer starts. |
| `scripts/date-night-radial-pacing.test.mjs` | Restore the exact production pacing regression suite. |
| `scripts/date-night-radial-session.test.mjs` | Restore the exact production session/pacing expectations. |
| `scripts/date-night-cache.test.mjs` | Restore the exact production radius-widening pacing expectation. |
| `scripts/seasonal-discovery.test.mjs` | Update existing copy assertions only. |
| `scripts/date-night-partial-ui.test.mjs` | Update the existing mapped-result copy assertion only. |

Documentation/evidence additions: `audit/date-night-seasonal-release-scope-decision-1.md`, the preserved authoritative decision handoff, and `audit/date-night-seasonal-release-scope-1-evidence/`. The external review package enumerates every evidence path; `evidence-manifest.json` gives exact filenames, sizes and SHA-256 hashes. The documentation-only child adds this verification handoff.

Compare application code to protected production as well as to the research base. Against protected production, only the three copy files above may differ under `src/`. The four restored pacing/test paths must match production byte for byte. Dependencies, database/schema/migrations, Vercel config, provider requests, catalog records, availability logic, collector policies and runtime source wiring are unchanged.

## Scope distinction to preserve

**New live current-season attraction ingestion remains deferred.** No qualifying research source was activated. The existing OSM network discovery is retained, including its seasonal categories; this candidate does not disable all seasonal network searches. Do not call map records a verified live event feed, promise attraction availability, or market comprehensive haunt/corn-maze/pumpkin coverage. Two saved local haunts remain subject to their existing expiry and schedule rules. Ordinary Date Night discovery remains available with Halloween on or off.

## Required verification

Use the exact lockfile. Do not change dependencies to make tests pass. The author installed with `npm ci --ignore-scripts --no-audit --no-fund`; the offline attempt lacked a cached package, then the normal install succeeded. No package or lockfile changed.

1. Verify identity, clean worktree, complete changed-path allowlist, handoff blob, and `git diff --check` against the immutable parent. Verify evidence manifest hashes.
2. Run `npm run typecheck` and `node_modules/.bin/tsc --project tools/seasonal-facts/tsconfig.json`.
3. Run `node --test scripts/seasonal-discovery.test.mjs scripts/date-night-*.test.mjs scripts/seasonal-fact-contract*.test.mjs` and `node --experimental-strip-types --test src/lib/date-night/availability.test.ts`.
4. Run changed-file ESLint over the nine source/test paths in the table.
5. Build **only** with `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node_modules/vite/bin/vite.js build --mode production`. Never use `npm run build`: it appends `db:migrate`. Capture and complete/verify `scripts/browser-build-proof.mjs` with auth enabled around the build. A normal Vite dev server can bootstrap local DB migrations; do not use that path here.
6. Run `env -u VITE_AUTH_ENABLED npm test` after building. The compiled security suite requires the build; it checks real TanStack RPC/CSRF/method enforcement, hostile inputs and cancellation. The test wrapper expects its file-supplied auth flag in two cases, so do not leak the build-only override into the suite. Auth remains enabled in the compiled build.
7. Inspect that `tools/seasonal-facts` remains offline (`NETWORK_ENABLED = false`, source schema `enabled: false`, `collectSource` throws `OFFLINE_ONLY`) and has no runtime import. Do not run a collector or generate runtime data.

Author results: typecheck, fact-contract typecheck, lint and migration-free build passed. Focused suite **550/550**; availability **6/6**; full suite **1,056 passed, 0 failed, 4 existing external-workspace documentation skips**. The initial full run had two environment-override failures; the corrected run passed with no implementation/test changes. Both logs are retained. Log copies trim only trailing whitespace/terminal blank lines. The actual panel was server-rendered with the switch on/off; that is not browser acceptance.

### Browser/manual smoke — outstanding gate

No browser pass is claimed. `agent-browser` and Chromium were absent; Playwright's Chromium download returned invalid/truncated archives. This task's retained `browser-install.log` documents the failure. Run the smoke below on a functioning controlled browser before promotion. Use migration-free compiled output, auth enabled, isolated profile and offline fixture interception at both browser and server boundaries. Existing `scripts/date-night-radial-browser.mjs` / `scripts/test-support/date-night-radial-preload.mjs` show the controlled pattern; do not run the live-provider scripts. Do not contact attraction operators or a geocoder.

- At 320 px, 390 px and desktop widths, Spooky Season OFF shows limited-coverage wording; ON shows the no-live-schedule disclosure without clipped text/controls or horizontal overflow. Seasonal styling/icons and four presets remain. Verify keyboard/focus behavior and the switch label.
- With October time and controlled map records: each seasonal category, combinations and Anything must show map-listing wording, truthful missing/saved-only coverage, and schedule-unconfirmed status where appropriate. Empty results must disable actions and provide usable filter guidance. Never label absent categories as an outage after successful empty queries.
- Use the two *unchanged* saved local haunts, zero map results and controlled provider failure to check fallback. With Movies-only selected under Halloween styling, the notice must say saved local date ideas. With a selected category absent from all data, nothing may be fabricated.
- Open now ON excludes unconfirmed schedules; OFF permits honest browsing. Revalidate across closed dates, October 31/November 1 and 2027 rollover using controlled time. Existing old calendars must never become fresh 2027 evidence.
- Check ordinary Date Night with Spooky Season OFF, stale seasonal saved filters, each October preset, Pick, options, favorites/exclusions and invalid/valid distinct two-stop plans. Close/back/retry must work. Sanity-check Dinner and Nightlife.
- Confirm near results become usable before outer completion; healthy/degraded pacing, minimum outer-start spacing, radius changes, cancellation, gaps/retry, cache reuse and open-overlay stability match production. Existing deterministic pacing tests supplement browser observation.
- Capture console errors, screenshots, exact build identity and fixture request logs; verify zero public provider/operator/geocoder calls. Do not claim physical Android acceptance from a desktop browser.

## Production preservation and rollback

Before and after verification, independently read:

- main: `078f65c5d194435452ca14569ea00e57f52a20f3`
- Production deployment/rollback reference: `dpl_HmqKyiLqCqMSTrhxKktsy9mJtDKy`
- Production aliases, including `pickforus.app` and `www.pickforus.app`, must still resolve to that deployment. Record the full existing alias set.

No production deploy/promotion, main mutation, merge, alias change, project configuration change or migration is authorized by verification. If anything drifted, stop and report; do not reset or move remote refs. If a later separately authorized release needs rollback, use the protected deployment/commit above under that later authorization. No DB rollback is required by this candidate because no DB change exists.

## Exact decision criteria

Return **PASS — ELIGIBLE FOR SEPARATELY AUTHORIZED RELEASE INTEGRATION** only if all pinned identity/diff checks pass; required deterministic/type/lint/build/security/regression checks pass; browser/manual smoke passes; current-season coverage claims remain truthful; source/collector gates remain closed; and production is unchanged. Explain any existing skips and show why they do not affect runtime verification. Any missing browser acceptance, material test failure, unexpected code/path change, unsupported availability claim, source activation, or production drift is **HOLD/FAIL**, never a conditional production approval.

The research line is not guaranteed to be a fast-forward of protected production. Do not force main to this branch. Any later integration/merge commit has a new identity and requires an exact final-diff review and verification before separately authorized production promotion. Preserve the reviewed candidate object for comparison and transport.

## Publication boundary and exact next task

Recommended immediate task: **PICK FOR US — SEASONAL RELEASE-SCOPE INDEPENDENT VERIFICATION #1**, against the immutable implementation candidate above plus the documentation-only publication tip supplied in the review package.

The branch is currently local. A normal Git-triggered non-production Vercel Preview may only follow **separate owner authorization** under the decision handoff. No push/Preview is authorized by this document. If publication is authorized, publish the exact existing tip object; do not amend, rebuild a commit, cherry-pick, rebase, squash or reconstruct it for transport. Retain/use the Git bundle and the owner's authenticated Termux path if cloud transport cannot preserve the exact object. Never include main or production changes in that authorization.
