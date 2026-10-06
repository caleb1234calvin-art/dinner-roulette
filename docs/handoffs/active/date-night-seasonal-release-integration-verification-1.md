# Pick For Us — Seasonal Release Integration Independent Verification #1

## Task and authority

Independently verify the exact, newly integrated candidate below. This task is read-only: do not modify, fix, commit, push, merge, deploy, promote, move aliases, alter settings, run migrations, enable sources, contact operators, or begin another pilot. Stop with a PASS or HOLD/FAIL report. Owner authorization for the preceding integration permitted only an isolated non-production branch and this handoff; it did not authorize a production release.

Repository: `caleb1234calvin-art/dinner-roulette`.
Published branch: `integration/date-night-seasonal-release-scope-1`.

Read in full:
1. `audit/date-night-seasonal-release-integration-1.md` in the candidate.
2. Supplied `seasonal-release-integration-1-review-package.txt` and its evidence archive.
3. The earlier `seasonal-release-scope-verification-1-review-package.txt`.
4. At exact reference tip `a79a3c6b5276263270894a1d95149e2df1f762ae`, use `git show SHA:path` to read:
   - `docs/handoffs/active/date-night-seasonal-release-scope-verification-1.md`
   - `docs/handoffs/active/date-night-seasonal-release-scope-decision-1.md`
   - `audit/date-night-seasonal-release-scope-decision-1.md`

Those older documents remain preserved on their reference objects; they were not wholesale copied into production history. Historical continuity does not replace this handoff. The older handoff's no-push/awaiting-authorization text applied to its earlier phase; the owner separately authorized this isolated publication.

## First action: exact identity, ancestry and publication-only proof

Immutable integration candidate:
- SHA: `4673854a0532fd753acea02c208189fcf23a4241`
- Tree: `0d33cb7ca3217517a20a2d13fc545485893b5bd8`
- Required sole parent / protected main: `078f65c5d194435452ca14569ea00e57f52a20f3`
- Parent tree: `77e85c1306e8136f7624f5a5be7c11e740ee30d5`
- Parent's sole parent: `70e049b47194696910c70cc1f5dd2ae9ba229aec`

Reviewed reference implementation:
- SHA `d62f02eb62bc97329f52d86043906e8a71684ef1`
- Tree `a0a46b01ebd21b424ebaf6a9a70ad65d0ea4586d`
- Sole parent `580b493e52fffc1e592b8107b142e01c945cee7f`

Reviewed reference publication:
- SHA `a79a3c6b5276263270894a1d95149e2df1f762ae`
- Tree `14801ee9a5e1378427d069c7aea37ddf5d13024f`
- Sole parent `d62f02eb62bc97329f52d86043906e8a71684ef1`
- Sole difference: its original verification handoff addition.
- Decision handoff blob `9086dd1d4d2329804cf2b556a3f4a6a4a7fb0c7c` remains unchanged.

Protected main versus the reference implementation has **3 main-only / 12 implementation-only commits**. The integration candidate has exactly protected main as its sole parent. No research-history merge, force update or main mutation occurred.

This new handoff is added after validation in a separate one-parent publication child. Its literal SHA/tree are supplied in the external review package and remote branch readback; a commit cannot embed its own identity. Verify that publication tip has exactly the candidate as its sole parent and adds **only this handoff**. Compare full trees, not only src. Runtime/build inputs must be identical between candidate and tip. Stop on any identity mismatch or protected baseline drift.

## Complete repository-wide allowlist against protected main

| Path | Candidate status | Reason |
| --- | --- | --- |
| `src/components/halloween-date-night-panel.tsx` | Modified | Limited-coverage off copy; saved-place/map-listing/no-live-calendar disclosure on. |
| `src/lib/date-night/coverage.ts` | Modified | Honest map/schedule wording; successful-empty remains distinct from outage. |
| `src/components/date-night-home.tsx` | Modified | Ordinary fallback under Halloween styling says saved local date ideas. |
| `scripts/date-night-partial-ui.test.mjs` | Modified | One existing copy assertion updated. |
| `scripts/seasonal-discovery.test.mjs` | Modified | Two existing copy assertions updated. |
| `audit/date-night-seasonal-release-integration-1.md` | Added | Main-based scope and ancestry rationale. |

Publication adds the seventh and only additional path:
`docs/handoffs/active/date-night-seasonal-release-integration-verification-1.md`.

All five executable files must match their reviewed d62f02e blobs exactly:
- panel: `d807cacef3954fec8d5590ac3802231a5a2354cb`
- coverage: `470029e9fc77140cc8bc8fff56626d78d295980f`
- home: `590930fb834c371cba84dd446b4fb45272cf17b9`
- partial UI test: `ebfcd8723540a47fa7348fd14b7d96117fb323a7`
- seasonal test: `2db2f9e6757ad339cc6c1378122f7342c99870e5`

Every other protected-main path must be byte-identical, with zero deletions. Preserve production-only workflow, continuity, audits and handoffs. In particular:
- radial-session.ts: `05bb0e057ab86f4c3cce9a312104cc645a2531a0`
- radial-pacing test: `17b5fa2df852a2fad63ac516f99e61dbb016bf0c`
- radial-session test: `8c78eb4d89ac079b3b019f232383c37229025a4a`
- cache test: `fad05e7aceaf806c87934ed8187df4873a47da04`

The prior 30/31-path parent-relative inventory is not this allowlist. Research tooling, synthetic generated bundles, research records and unrelated history were excluded. Neither protected main nor this integration contains tools/seasonal-facts or its 308 tests. Their absence is deliberate scope preservation, not deleted candidate tests.

No dependencies/lockfile, database/schema, migration, deployment configuration, security, native app, provider queries, cache, pacing, availability or catalog logic may change.

## Release semantics and gates

Live current-season attraction ingestion remains deferred. Existing OSM seasonal discovery remains; map evidence is not an operator-verified live calendar. The Werehouse and Myer's Inn Haunt retain identical bounded 2026 calendars/expiry. Open now must not admit unconfirmed schedules or treat old calendars as 2027 evidence.

No offline collector/source tooling is introduced to this main-based integration. The unchanged reviewed reference still has NETWORK_ENABLED=false, schema enabled as literal false, collectSource throwing OFFLINE_ONLY, and no src/server import. Verify those reference gates without activating anything. No collector command, live provider/operator/geocoder request, invented attraction record or generated runtime data is allowed.

## Required independent validation

Use a clean isolated detached checkout of the exact candidate and its unchanged lockfile. Keep evidence and synthetic browser harnesses outside tracked source/runtime data. The author's fresh locked install used:
`npm ci --offline --ignore-scripts --no-audit --no-fund`.
A normal exact-lock install is acceptable if local cache is unavailable; never edit dependencies to pass.

1. Verify all identity/tree/parent assertions; full candidate/publication diffs; all other main paths unchanged; clean state; `git diff --check`; evidence hashes.
2. Run `npm run typecheck`.
3. Run `node --test scripts/seasonal-discovery.test.mjs scripts/date-night-*.test.mjs` (author: **242 passed**).
4. Run `node --experimental-strip-types --test src/lib/date-night/availability.test.ts` (author: **6 passed**).
5. Run ESLint across these nine paths: the five executable paths above, src/lib/date-night/radial-session.ts, scripts/date-night-radial-pacing.test.mjs, scripts/date-night-radial-session.test.mjs, scripts/date-night-cache.test.mjs. Author: zero errors/warnings. Whole-repository lint is not claimed clean.
6. With VITE_AUTH_ENABLED=true, run scripts/browser-build-proof.mjs capture; then **only**
   `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node_modules/vite/bin/vite.js build --mode production`;
   then complete and verify. Never use npm run build (appends db:migrate), migration commands, or a Vite dev server.
7. Run `env -u VITE_AUTH_ENABLED npm test` after the build. Author: **677 repository + 71 application = 748 passed, 0 failed, 4 inherited documentation-only skips**. Actual compiled TanStack transport/security tests are included. The build-only auth override must not leak into the test wrapper.
8. Inspect excluded reference gates. For parity with the earlier specification, separately run its tools/seasonal-facts typecheck and scripts/seasonal-fact-contract*.test.mjs in a detached d62f02e checkout. Author freshly passed typecheck and **308 tests**, counted separately from the integration's 748. Never add these files to the integration or claim these as candidate tests.
9. Run controlled compiled-output browser acceptance below and verify build proof again afterward.

The four inherited skips concern optional absent gitignored .grok/skills/og documentation: marker path/bound; no-wait brand-task wording; documented CLI flag; documented hand-over forms. No runtime or security test was skipped.

Author build:
- auth true; Node v24.19.0; Playwright 1.62.1.
- source SHA-256 `34cda89cc96b85c52dc5fa86252d0a5b4b6bf40cae945ca244023328ce8f1dc3` (427 files).
- output SHA-256 `7bb7b390018158eecd62f51960495137e3027629cb1180f6d71712e790b79603` (194 files).
- 2026-10-06T18:12:38.194Z to 2026-10-06T18:12:41.109Z.
- All browser verdicts carry this same proof, independently rechecked after acceptance. Fresh verification must create its own successful build proof; do not relabel author output as a new run.

## Browser acceptance and retained attempts

Use disposable Chromium contexts with service workers blocked; compiled Vite preview only; auth true; server and browser external-request interception; controlled October time in America/Chicago. Fixtures stay external to application runtime data. Verify zero public operator/provider/geocoder calls. Screenshots use installed fallback fonts because external font CSS/analytics are fulfilled inertly. Desktop responsive Chromium does not establish physical Android acceptance.

Required **25 seasonal/ordinary scenarios**:
layout-320, layout-390, layout-1280; each haunted-house/corn-maze/pumpkin-patch category; all three two-category combinations; all three together; Anything; sparse-map; saved-only; empty-absent-category; provider-failure-saved; movies-fallback-copy; calendar-revalidation; ordinary-stale-seasonal-filters; all-october-presets; pick/options/favorites/exclusions/back; valid-distinct-plan; invalid-plan/retry/close; Dinner; Nightlife; failed-query-retry.

Required **10 radial scenarios**:
progressive-success, middle-failure with missing-only gap retry and completed-patch reuse, outermost-failure, options-stable, future-pick, radius-increase, radius-decrease, local-filters, mobile-progress, all-stall.

Check keyboard Space/focus/switch label and no clipped disclosure or horizontal overflow at all widths. Verify saved-only/absent-category guidance, disabled actions, successful-empty distinct from outage, both unchanged haunts, Movies-only copy, Open now exclusions, closed dates, Oct 31/Nov 1 and 2027 rollover. Verify ordinary modes/presets and distinct two-stop plans. Confirm near results usable before outer completion, cancellation, cache reuse, retry, pacing and overlay stability.

Author: all **35 distinct scenarios passed** with zero page/console errors in final captures and zero public calls. 37 sampled scheduler intervals had minimum **1000.3999999994412 ms**, all >=1000 ms. Deterministic tests retain the 250 ms healthy / 1000 ms degraded behavior.

Two harness failures are retained, not concealed:
- First radial run matched the new asset but used the expression-start column rather than Chromium's now-call column; required nonempty scheduler samples failed. Corrected compiled asset/callsite and all ten scenarios passed. The sample-presence assertion remains.
- Initial seasonal run passed 24 of 25. The 2027 calendar scenario counted schedule labels before its options overlay rendered; its failure JSON/screenshot already showed both correct unconfirmed labels. The follow-up waits for article h3 before counting and reruns that scenario only; it passed. No application, suite, build or candidate change occurred.

External harnesses: seasonal-browser.mjs, seasonal-calendar-followup.mjs, seasonal-browser-preload.mjs, radial-browser.mjs. Paths point to the author's disposable workspace; adapt only harness paths/output locations when reproducing. Resolve the exact compiled scheduler callsite for your fresh build and require samples; never accept an empty array as timing evidence.

## Evidence

External package: `seasonal-release-integration-1-evidence.zip`; companion `seasonal-release-integration-1-review-package.txt`.
The archive includes identity/scope receipts, full candidate and publication diffs, raw logs, fixtures/harnesses, screenshots, original failures, final passing results and final preservation receipts.

Frozen validation-manifest.json inventories 169 validation files. SHA-256:
`a238db326fed9c19cb5a38e3185e5998fddf01d80a1a056809bca235caac014c`.
Verify every listed size/hash. Later publication receipts are covered by the final evidence-manifest.json; the external review package records the archive digest. Author raw logs remain private downloadable evidence, not GitHub additions.

## Production preservation and decision

Independently read before/after:
- main `078f65c5d194435452ca14569ea00e57f52a20f3`
- READY production/rollback `dpl_HmqKyiLqCqMSTrhxKktsy9mJtDKy`
- all five aliases: pickforus.app; www.pickforus.app; dinner-roulette-chi.vercel.app; dinner-roulette-minions-9e2c.vercel.app; dinner-roulette-git-main-minions-9e2c.vercel.app.
- www retains its existing redirect to pickforus.app.

Automatic non-production CI/Preview may follow the authorized integration-branch publication. Do not trigger manual deployment, change settings, or run production operations. Any baseline drift is HOLD pending owner review, never permission to reset refs.

Return **PASS — ELIGIBLE FOR SEPARATELY AUTHORIZED RELEASE DECISION** only if every exact identity/scope/build/security/browser/gate/preservation check passes. Missing acceptance, unexpected paths/behavior, source activation, migration, false coverage claim or protected drift means HOLD/FAIL. PASS does not itself authorize merge or production promotion. Stop after reporting exact results and evidence.
