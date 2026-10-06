# Seasonal Release-Scope Decision #1

## Phase A — findings recorded before executable edits

Decision: **B — MINIMAL UI/STATE REMEDIATION REQUIRED.** Live current-season seasonal-attraction ingestion remains deferred. No new source-discovery work is authorized or needed.

Authority: `docs/handoffs/active/date-night-seasonal-release-scope-decision-1.md` at `98faa19ad329b7a309bb8d89222ef981aff3ccb5`, branch `integration/date-night-seasonal-release-scope-decision-1-handoff`. The branch head and pinned handoff were read through GitHub. Historical continuity is not the task specification.

Verified starting identity, locally and via GitHub Git objects/ref:

- SHA: `580b493e52fffc1e592b8107b142e01c945cee7f`
- Tree: `f398ab4423b30e67d696eda4603a03ba9b4db7dd`
- Sole parent: `9c19deec26b433e7fb6b14c48e76cc0ea4cfbc93`
- Published branch: `research/date-night-seasonal-release-path-sweep-1`
- New branch starts at that exact SHA: `fix/date-night-seasonal-release-scope-remediation-1`.

Protected production: main `078f65c5d194435452ca14569ea00e57f52a20f3`; deployment `dpl_HmqKyiLqCqMSTrhxKktsy9mJtDKy`. Initial read-only checks matched both, including production aliases `pickforus.app` and `www.pickforus.app`. No applicable AGENTS.md was found.

### Current UX and runtime

| Question | Exact-code finding | Decision |
| --- | --- | --- |
| Where do seasonal options appear? | `season.ts` adds Haunted House, Corn Maze and Pumpkin Patch chips while the September 1–November 2 window and Spooky Season switch are active. `halloween-date-night-panel.tsx` adds four presets. `date-night-home.tsx` adds a two-stop plan button. | Preserve existing controls, presets and visuals. These select existing discovery categories; they do not activate the new factual-data pipeline. |
| Does copy imply supported current availability? | The panel says “Haunts, harvest nights, and stranger doors are in the roulette now.” `coverage.ts` says “Live seasonal results included” when OSM provenance exists, which establishes map discovery, not a current-season visitor calendar. | Replace the blanket promise with explicit limited-coverage and no-live-schedule wording; identify OSM results as map listings. |
| Can controls dead-end? | No eligible places disables Pick/options/plan. Existing empty states explain radius/category changes and turning Open now off. Sparse category coverage names missing categories. Invalid two-stop plans show an explanatory state with close/retry controls, never fabricated roles. | No new disabled state or category removal is justified by missing *new* ingestion alone. A sparse or empty map category is already represented explicitly. |
| Is presentation merely decorative? | No. CSS, icons and taglines are decorative, but presets/chips/plan affect existing Date Night filters. | Describe both truthfully; do not claim the whole seasonal layer is decorative. |
| What data actually supports it? | `search.ts` merges the existing Overpass/OSM discovery with the two existing Jasper County seasonal anchors. No new feed, collector, or factual bundle is imported. | Preserve legacy discovery; do not describe it as verified live seasonal availability or as comprehensive attraction coverage. |
| What static behavior is independently supported in this tree? | `seasonal-catalog.ts` contains only The Werehouse and Myer's Inn Haunt. `availability.ts` contains bounded 2026 calendars, checked September 29, expiring October 31. Retained `reference-event-metadata.json` ties Myer's ten October dates to source index 0 and Werehouse September 25–October 31 to index 3 in `reference-source-retrievals.json`. Existing tests cover expiry, unknown schedules and Open now. | Preserve these preexisting records exactly. They establish two saved local haunts only, not corn-maze/pumpkin coverage or fresh operator verification in this task. |
| Are ordinary flows affected by the missing pipeline? | Ordinary activity queries, catalogs, eligibility, preferences, exclusions and controls are independent of `tools/seasonal-facts`. Turning Spooky Season off removes seasonal filters; year rollover makes old calendars unconfirmed. | No ordinary routing or selection redesign. |
| Is new ingestion already gated? | `tools/seasonal-facts/schema.ts` requires `enabled: false`; `policy.ts` has `NETWORK_ENABLED = false` and `collectSource()` throws `OFFLINE_ONLY`. Generated files are synthetic offline fixtures, not runtime input. There are no imports from this tool into `src`. The Halloween presentation flag is true; it is not a collector flag. | Keep all gates and disconnected runtime state unchanged. |
| Is fallback copy accurate for ordinary-only selections in Halloween styling? | It says “using saved seasonal anchors” even when Movies or other ordinary categories are selected. | Change to “saved local date ideas.” |

**Scope distinction:** Deferring the researched current-season ingestion pipeline does not create or activate a replacement pipeline. The starting app already performs live OSM queries, including seasonal category discovery. This remediation retains those preexisting queries and explicitly labels their results as map listings with unconfirmed schedules where applicable. It does **not** claim that all seasonal network discovery has been disabled. No live operator-verified attraction feed is shipped. The release verifier must retain this distinction; broad live/current attraction-coverage claims are a no-go.

### Concrete production-preservation defect

Comparing the immutable base to protected production reveals one application-code difference: `src/lib/date-night/radial-session.ts` lacks production's 250 ms healthy-result pause and monotonic minimum 1,000 ms spacing between outer starts, including compatible filter/radius updates and retries. This is a verified candidate regression risk, directly within the handoff's requirement to preserve already-live pacing.

Minimum repair: restore that file **byte for byte** from protected production `078f65c5d194435452ca14569ea00e57f52a20f3`, together with its existing pacing test and the two corresponding production cache/session test files. Do not redesign or retune pacing. Restore the exact protected SHA's blobs, not mutable main.

### Minimum implementation selected

1. Qualify enabled/disabled Halloween panel copy and show a nearby coverage note: saved local picks and map listings only; current-season attraction schedules are not refreshed live.
2. Replace ambiguous live-seasonal coverage wording with explicit map-listing wording and a schedule-confirmation caveat.
3. Correct the Halloween ordinary-category fallback wording.
4. Restore the exact production pacing implementation and its corresponding tests to avoid a release regression.
5. Update only the existing assertions that quote the changed UI copy. Do not introduce tests that merely duplicate static text beyond those established checks.

### Preserved research outcome

Georgetown Morgue remains parked. Nine Phase B services were screened and four seriously evaluated; no qualifying source or source pair was established. Phase C contract design was not entered; no live-source-pilot implementation handoff was created. The research sweep recorded zero operator contacts, operator-origin requests, geocoder calls, paid API calls, collector calls and executable changes. Those findings remain intact; this subsequent UI/pacing remediation does not reinterpret a rejected source as approved.

No operator contact/request, paid API, geocoder, source activation, collector, runtime seasonal-data generation, invented static record, migration, dependency change, Vercel configuration change, main mutation, merge or deployment is part of this task. Validation uses offline fixtures. See the release-verification handoff and the external exact-identity review package for executed validation and promotion gates.
