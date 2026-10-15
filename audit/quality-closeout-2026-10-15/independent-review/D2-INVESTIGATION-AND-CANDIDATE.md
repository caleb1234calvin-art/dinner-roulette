# D2 — Kansas City selected-radius curated discovery

Status: bounded isolated implementation prepared; release HOLD pending independent review and browser/hosted acceptance. No production action, provider traffic, merge, deployment, migration or push was performed by this worker.

## Exact identities and scope

- Released source inspected: `991978fe24ec165eeacd5500a26d66f35d86c560`, tree `95f66498048590cbd30c623b17d15bf2d5b7cc73`.
- Local candidate: `b683f7979845d32b909cf4f195bc8bf42305e101`, tree `9c4ec8780bdddff51335f523823e1ec40dee001f`, sole parent released source above.
- Branch: `integration/kc-curated-radius-2026-10-15`; worktree: `/workspace/scratch/721160bf9050/d2/repo`.
- Nine files: two runtime modules; one new nine-case regression; four narrowly adjusted existing tests; pinned before-source fixture and verifier. Separate from PR #73.
- All catalog/presentation/provider/cache/planner/availability/eligibility/package/workflow/deployment files are byte-unchanged. Registry contains the same 92 unique identities. Existing date/expiry/source metadata are unchanged.
- Patch: `D2-candidate.patch`, SHA-256 `f876f32030bf823c94a9c1ec6e60a03636b5b32c1dc8940eb3d547a2b5c9e1bd`.

## Independently reproduced root cause

The real `searchDateNight` handler first obtains local records within the query radius, then filters them by live patch ownership. For a core request, locally available outer records are discarded. `createDateNightRadialSession` correctly refuses to acquire outer live patches when core categories remain missing. Consequently, a provider outage returns only core saved records, and the independent outer saved catalog is never considered. Increasing the radius from 15 to 50 does not remove the live-core gate or requalify those saved records.

This is a composition defect, distinct from the provider's network failure. The controlled handler used mocked transport failure, and the actual controller/identity/radius/date eligibility code executed. No live-provider timeout latency or failure rate was measured here.

At a fixed representative Kansas City, Kansas center (39.114053, -94.627463), independently computed Haversine distances are:

| Identity | Miles | Strict selected-radius result |
| --- | ---: | --- |
| Exiled KC | 16.989241493 | Excluded at 15, included at 20 |
| Dark Nightmares Haunted Forest | 24.047302523 | Excluded at 20, included at 30 |
| Terror at the Ranch | 32.318802084 | Excluded at 30, included at 40 |

The representative center is a deterministic fixture, not a claim to have recovered the prior live browser's exact coordinates. All three are within 50 miles. The source handler still returns none of the three in a failed core response; the candidate controller recovers all three as saved candidates without starting another provider request.

## Bounded correction

`curated-policy.ts` exposes the already-loaded reviewed registry as a bounded saved pool. `radial-session.ts` composes eligible saved candidates at the actual selected radius after core settlement (or an available cache response), independently of live patch coverage. This presentation composition is never stored as provider success and does not change acquisition deadlines, patch ownership, failure gates, serial pacing or retry rules.

The existing radius clip requires reviewed placement and actual distance. Existing downstream decoration/eligibility continues to enforce categories, preferences, exclusions, operating dates, exact expiry and conservative Open Now. No geographic eligibility is widened. Exiled's pre-existing `listing-lifecycle` visibility intentionally survives Spooky OFF; Dark Nightmares and Terror at the Ranch do not. The candidate preserves that distinction.

Saved composition merges known negative lifecycle evidence before display. A first prototype re-read static records on each publish; an adversarial test showed it could recreate a known closed record after cache eviction. That prototype was rejected. The candidate retains a bounded per-signature pool and destructively retires observed closed identities, matching cached-positive retirement. Retirement persists for compatible radius/category/TTL changes. Location, Halloween state or semantic signature replacement establishes a fresh pool, matching cache namespaces. A genuinely fresh live positive can still arrive through normal cache acquisition after old negative evidence expires; static saved records do not independently recreate themselves in the same namespace. This conservative behavior warrants independent review.

## Evidence and failures preserved

- `exact-regression-before.log`: identical final nine-case test executed against pristine released main: seven failures, two passing controls. The actual handler/core case independently proves all three outer saved IDs are absent before composition.
- `exact-regression-after.log`: final nine-case test passes on candidate source. Covers real-handler failure, 15↔50 and 20/30/40 boundaries, transport rejection/watchdog, relocation/cancellation, dates/expiry/Open Now/toggle/categories, cached core/pacing, negative lifecycle and eviction.
- `red.log`: original seven-case test run, six failures/one control. Kept as original failure; later oracle correction recognizes Exiled's existing lifecycle visibility.
- `green-initial.log`: six passes/one incorrect Spooky-OFF oracle failure in first implementation. Kept, not rewritten.
- `negative-eviction-red.log`: rejected naive-composition prototype, seven passes/one real retirement failure. Prototype was not committed; no exact Git identity is claimed for it.
- `full-tests.log`: first full run retained. Four material fixture/source binding assertions failed plus fifteen compiled transport setup failures because the required build had not run. The three UI fixture counts changed because independently composed saved venues now coexist with the mocked live row. The fourth failure was the unchanged historical runtime hash rejecting the deliberate source edit.
- Fixture correction preserves exact new full-pool counts, then favorite-isolates the original row for action/expiry checks. The historical source test first validates the complete current source hash, then the pinned original source and original hash; the original receipt is unchanged. No general exemption, skipped assertion, or relaxed expiry was added.
- `full-tests-built.log`: successful full run on the source bytes subsequently committed: 1,253 repository tests passed / four inherited skips; 71 application tests passed. This is pre-commit byte-identical evidence, not the exact-head rerun.
- `focused.log`: 59 focused radial/cache/session/pacing/search tests passed before the final ninth boundary case was added.
- Exact-head direct-Vite build and typecheck completed successfully. `exact-head-full-tests.log` is the separately run exact-head full suite: exit 0, 1,253 repository tests passed / four inherited skips; all 71 application tests passed. No source changes occurred after candidate commit.

## Acceptance limits and next step

No fresh live Kansas City browser observation, browser screenshot, physical Android acceptance, hosted CI or author-separated D2 acceptance is claimed by this authoring worker. Playwright's expected Chromium executable `/root/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome` was absent; no browser test was launched. Existing actual-component tests are useful behavioral evidence, not rendered-browser acceptance.

The next step is independent review of the exact candidate, especially negative-evidence retirement, unchanged coverage proof, truthful source labels, and bounded assertion updates; then hosted/browser acceptance on the frozen head. Parent coordinator owns any branch push/draft PR, continuity/Issue #71 updates and final owner decision. PR #73 remains separate. This report grants no merge or production authorization.
