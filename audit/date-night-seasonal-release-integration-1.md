# Seasonal Release-Scope Release Integration #1

## Authority and exact base

Owner authorization: prepare, validate and publish an isolated non-production integration candidate and its independent-verification handoff. Stop after publication. No main mutation, merge, production deployment/promotion, alias/settings change, migration or new seasonal pilot.

Protected main / sole integration parent: `078f65c5d194435452ca14569ea00e57f52a20f3`, tree `77e85c1306e8136f7624f5a5be7c11e740ee30d5`.
Protected production / rollback: `dpl_HmqKyiLqCqMSTrhxKktsy9mJtDKy`.

Read in full:
- Supplied `seasonal-release-scope-verification-1-review-package.txt` (uploaded copy has a "(1)" suffix).
- At immutable `a79a3c6b5276263270894a1d95149e2df1f762ae`: `docs/handoffs/active/date-night-seasonal-release-scope-verification-1.md`, `docs/handoffs/active/date-night-seasonal-release-scope-decision-1.md`, and `audit/date-night-seasonal-release-scope-decision-1.md`.

Reviewed implementation `d62f02eb62bc97329f52d86043906e8a71684ef1` (tree `a0a46b01ebd21b424ebaf6a9a70ad65d0ea4586d`, sole parent `580b493e52fffc1e592b8107b142e01c945cee7f`) and handoff-only child `a79a3c6b5276263270894a1d95149e2df1f762ae` (tree `14801ee9a5e1378427d069c7aea37ddf5d13024f`) remain unchanged reference objects. Preserved decision handoff blob: `9086dd1d4d2329804cf2b556a3f4a6a4a7fb0c7c`. Original independent evidence manifest: all 207 listed files verified.

Fresh local ancestry confirms **3 production-only and 12 implementation-only commits**. The handoff-only publication child is an additional reference commit; it is not counted as implementation history. Integration starts directly from protected main, with one parent and no research-history merge.

## Complete candidate allowlist against protected main

| Path | Status | Scope justification |
| --- | --- | --- |
| `src/components/halloween-date-night-panel.tsx` | Modified | Exact reviewed blob: limited-coverage off copy and saved-place/map-listing/no-live-calendar disclosure on. Existing controls and styling preserved. |
| `src/lib/date-night/coverage.ts` | Modified | Exact reviewed blob: map-listing wording without confirmed current-season schedule claims; successful-empty map results remain distinct from outages. |
| `src/components/date-night-home.tsx` | Modified | Exact reviewed blob: ordinary-category Halloween fallback says saved local date ideas. |
| `scripts/date-night-partial-ui.test.mjs` | Modified | Exact reviewed blob: update one existing copy assertion. |
| `scripts/seasonal-discovery.test.mjs` | Modified | Exact reviewed blob: update the existing fallback and mapped-result assertions. |
| `audit/date-night-seasonal-release-integration-1.md` | Added | This scope/ancestry record explains the main-based selection and required validation. |

After candidate validation, the publication child may add exactly one path:
`docs/handoffs/active/date-night-seasonal-release-integration-verification-1.md`.
No other candidate-to-publication change is permitted.

## Preserved and deliberately excluded scope

Every other path in protected main remains byte-identical, including production-only workflow, continuity, pacing audit and handoffs. No deletion is authorized. In particular radial-session.ts and all existing radial/cache/pacing tests remain protected-main blobs. No dependency, lockfile, database/schema/migration, deployment configuration, provider query, calendar/expiry, catalog, security, native app or runtime source-wiring change is included.

The research branch's offline fact-contract tooling, synthetic generated bundles, fact-contract tests/audits, source research and historical continuity changes are not release dependencies and are excluded. They did not exist on protected main. Copying the entire reference tree would introduce these unrelated files and remove production-only records. The previous 30/31-path parent-relative inventory is therefore not this integration allowlist.

Live current-season ingestion remains deferred. No collector or source is added or enabled in this integration. The preserved reference tooling remains offline: NETWORK_ENABLED=false; schema enabled is literal false; collectSource throws OFFLINE_ONLY; no application import. Existing OSM seasonal discovery remains unchanged and is described as map evidence. The Werehouse and Myer's Inn Haunt and their bounded 2026 calendar/expiry logic remain byte-identical to protected main and the reviewed reference.

## Validation contract

Validate the exact immutable integration commit, not the research candidate. Keep logs, browser harnesses and synthetic records outside runtime data. Use the exact unchanged package-lock with an ignore-scripts install.

Required candidate checks: clean Git state and exact path/blob inventory; diff whitespace; application typecheck; focused seasonal/date-night deterministic tests; availability tests; ESLint over the five changed executable paths plus the four protected pacing paths named by the original handoff; auth-enabled direct migration-free production build; browser-build-proof capture/complete/verify; full npm test with the build-only auth override unset, including compiled transport/security tests; controlled 35-scenario seasonal/ordinary/radial browser acceptance against that build.

The original reference's tools/seasonal-facts typecheck and fact-contract tests cannot run as candidate checks because those files are deliberately absent from both main and this integration. Any fresh checks of those gates run against a separate exact-reference checkout and must be reported separately. Candidate test counts are expected to match the production test inventory, not the larger research inventory; no candidate tests are removed or skipped to reduce the count.

Never use npm run build or a Vite dev server; both can run migrations. Build only:
`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node_modules/vite/bin/vite.js build --mode production`.
Then `env -u VITE_AUTH_ENABLED npm test`.

Browser acceptance must cover 320/390/desktop disclosure, keyboard/focus, every seasonal category/combination/Anything, sparse/empty/failure fallback, both saved haunts, Movies-only wording, Open now and 2026/2027 boundaries, ordinary filters/presets/Pick/options/favorites/exclusions/plan/close/back/retry, Dinner/Nightlife, radial progress/pacing/cancellation/gaps/retry/cache/overlay stability. Intercept external browser and server requests; no public provider/operator/geocoder calls. Desktop responsive Chromium does not establish physical Android acceptance.

Independent verification is the next gate after isolated publication. Passing author validation or automatic Preview CI is not release approval. The separate verification handoff must pin candidate SHA/tree/sole parent, publication-only diff, all paths, evidence and production receipts.
