# PR84 frozen-head browser evidence review

Status: complete within the scoped artifact review, 2026-10-18 15:00 UTC. No new visual regression established; inherited casino image-capture gap and the scope limits below remain.

- Head: `9eb1b85c503d900993e6ab0d0e5797fd7bcacfb4`
- Tree: `26725dfcfe2de5e82f49cda02b9ec49addb421ce`
- Evidence index: `artifact-manifest.json` (18 originals); parent verified original archive SHA-256, sizes, CRC and workflow/head binding. This review inspected original image pixels and JSON, not a new browser run.
- Safe extraction: only PNG/JSON members into `visual-review-extracted/`, rejecting absolute/traversal paths. Original archives and source files were not changed.

## Findings

1. No new visual regression was established in the 44 final screenshots actually inspected. Sampled 320/390-pixel seasonal viewports show rendered category artwork, readable expanded date/hour/caution notes, understandable limited/good/high confidence labels, appropriate seasonal/ordinary styling, and visible close/shuffle/directions controls where present. Long option titles and category pills intentionally ellipsize in narrow two-column cards; expanded/result text remains readable in the samples.
2. The four casino screenshots in final artifact **12139108470** have blank dark rounded artwork boxes; surrounding UI is rendered. Same four screenshot members in baseline artifact **12137858385** also have blank artwork. Baseline archive SHA-256 was independently checked: `bd949854d13709ac658a5549d5f1da781312d85ea8ec88c79c6996023870b253`. The saved immutable compare from baseline `422bf4f` to final has 19 changed files, none UI/assets/casino smoke code. Final immutable `scripts/casino-browser-smoke.mjs` lines 112–118 and 124–127 capture after text/functional checks without image decode/natural-size/render-completion waits. **Classification: inherited screenshot-evidence gap, consistent with early capture; not evidence of a new casino UI regression.** These four screenshots do not establish that casino artwork eventually rendered. No rerun or source change was performed.
3. A concrete transient example supports the timing explanation: in artifact **12139561326**, `0-consumer-details-320-options-image-0-viewport.png` shows the second card's icon blank; `...image-1-viewport.png` shows both icons rendered. Both originals were inspected.
4. Full-page captures in location, casino and radial suites include fixed-layer/capture seams, cut-off overlays, or background content below the captured fixed viewport. They are not reliable proof of whole-page overlap-free layout. This review does not label those seams a persistent runtime defect; viewport evidence and final geometry claims must be used separately.
5. Minor copy roughness is visible (for example “Approx. Nearby away” in result reason chips, and verdict text “Within 1 miles”/“Loaded through 1 miles”). No new regression attribution is justified because UI source is unchanged relative to the checked baseline.

## JSON verdict inspection

Parsed all 14 application verdict JSONs: twelve seasonal verdicts (including the regional and wave2 subpasses), Date Night radial, and casino. Location's `result.json`, the regional `wave2-subpass.json`, and geometry verdict were also read.

- Twelve seasonal verdicts: 2,020 passed scenario entries, zero declared failures/errors, 771 complete/decoded/nonzero-width image records, 2,103 unobscured note records and 1,269 reachable control records; no failed image/reachability records, image request failures or page errors found in those structures. These are recorded assertions, not 771 independent pixel inspections or unique tests.
- Seasonal scenarios use 320/390 widths; wave2 adds 512px consumer scenarios. Expanded notes include explicit dates/hours, approximate-location notices, visitor restrictions and provider uncertainty. Sampled result link records use visitor-address Google Maps destinations and venue website/telephone links.
- Radial: all ten entries pass, no page errors or horizontal overflow, and explicit progress/failure/radius-cancellation fields. Examples include incomplete coverage and “Retry missing areas.” This is deterministic/local testing.
- Casino: 16 text-described functional checks, empty `errors`; no `passed` field and no image-readiness assertions in the verdict/script. Desktop viewport 1280×800 and mobile 390×844 per immutable script.
- Location: `passed: true`, 19 checks including persisted/manual/GPS coordinates, late-callback protection, location sharing across modes, mobile overflow, light/dark artwork and no page errors. Its mode explicitly says simulated native coordinates/provider fixtures and mocked error callbacks.
- Seasonal verdicts report `publicProviderCalls: 0`, `forwardedExternalCalls: 0`; external font and Grok extension requests were blocked. Thus these seasonal screenshot fonts are fallback rendering, and this evidence does **not** establish live provider/source activation, production freshness, deployed behavior, or live-source promotion.
- Machine-readable counts and per-artifact summaries: `visual-review-verdict-summary.json`.

## Exact pixel-inspected sample

Paths below are original ZIP members; their extracted prefix is `visual-review-extracted/artifact-<ID>/`. No claim is made that every screenshot in an artifact was viewed.

### 12139108470 — casino (4 final)
- `desktop-options.png`
- `desktop-result.png`
- `mobile-options.png`
- `mobile-result.png`

### 12139093701 — location/light-dark Dinner (4)
- `location/dinner-light-result.png`
- `location/dinner-dark-result.png`
- `location/mobile-location.png`
- `location/mobile-toronto.png`

### 12139750122 — Date Night radial (4)
- `date-night-radial/options-stable.png`
- `date-night-radial/future-pick.png`
- `date-night-radial/mobile-progress.png`
- `date-night-radial/all-stall.png`

### 12139561326 — seasonal two / ordinary Date Night (6)
- `missouri-two-records/0-consumer-details-320-options-image-0-viewport.png`
- `missouri-two-records/0-consumer-details-320-options-image-1-viewport.png`
- `missouri-two-records/0-consumer-details-390-result-image-0-viewport.png`
- `missouri-two-records/0-consumer-details-320-options-note-2.png`
- `missouri-two-records/0-mixed-toggle-cache-mixed-season-off-image-0-viewport.png`
- `missouri-two-records/0-mixed-toggle-cache-mixed-season-off-image-1-viewport.png`


### Other seasonal representative originals (10)
- **12139825181:** `seasonal-next-missouri-three/0-consumer-anything-category-320-options-image-0-viewport.png`
- **12140000115:** `seasonal-ranked-holds/0-consumer-anything-category-320-pick-result-image-0-viewport.png`
- **12140000115:** `seasonal-ranked-holds/0-consumer-anything-category-320-result-note-date-night-mo26-fear-factory-3.png`
- **12139359204:** `seasonal-phase4-recovery-seven/0-consumer-anything-category-320-options-note-date-night-mo26-phase4-wolfmans-house-of-screams-2.png`
- **12138773724:** `seasonal-hold-cleanup/0-consumer-anything-category-390-result-note-date-night-mo26-007-cadaver-zone-1.png`
- **12139667316:** `seasonal-completeness-v1/0-anything-options-image-0-viewport.png`
- **12140170315:** `seasonal-astra-extras/0-consumer-anything-category-320-pick-result-image-0-viewport.png`
- **12140011160:** `seasonal-cumulative-15/0-consumer-anything-category-390-options-image-0-viewport.png`
- **12140011028:** `seasonal-astra-eleven/0-consumer-anything-category-390-result-image-0-viewport.png`
- **12139593246:** `seasonal-ten-record/0-consumer-anything-category-320-options-image-1-viewport.png`

Total: **44 final originals**, plus the same four casino member names in baseline artifact **12137858385** (48 originals viewed overall). The initial sample above accounts for 28; geometry below adds 8, and regional/wave2 adds 8.

## Final geometry evidence — artifact 12139916905

Original archive: 452,093,541 bytes; parent verified SHA-256 `0a29a8bdd0693b215ec9c533c3ea42c83bf002fc25d6ad02eb0b993e36123ed4`, CRC and final-head binding. Reviewed `seasonal-card-layout/verdict.json` and eight original PNGs.

- `passed: true`, empty errors, 774 comparisons across 92 unique IDs; 258 at each of 320/390/512 widths. All six variants are present in every comparison, none incomplete. Kinds: 276 options, 276 result, 219 plan, 3 plan-settle.
- Exact subgroup accounting: regional 108/108; wave2 90/90.
- Maximum collapsed seasonal-vs-matched-ordinary height deltas: options 0px, plan 3px, result 4.671875px, plan-settle -11px. Directions changes are 0px (590 records) or the permitted 16px two-line change (184 records).
- All 1,644 recorded expanded-note checks are unobscured, within the viewport after scrolling, and without horizontal overflow beyond 1px tolerance; minimum reported font size 12px. No result-card horizontal overflow failures. The 168 options comparisons with `overflowElements` are intentional truncating title/category elements, not a claim that all text is displayed in full.
- Eight pixel samples show compact collapsed cards, expanded readable notes, loaded artwork, legible result directions, and usable Scare/Settle plan cards. The 320px confidence/Details row is tightly packed but remains readable in the viewed sample. No additional visual failure was identified.
- Scope: immutable script renders real overlay components to static markup, mocks React/store state, uses production CSS and embedded local artwork, and exercises native Details. It is dark theme only. This is not full-app hydration/RPC/action execution. Its historical geometry baseline is `2fe002e6bdc9c2c42ecfc0d61e4de08df20d0d81`, not the PR baseline `422bf4f`.
- Machine-readable summary: `visual-review-geometry-summary.json`.

Exact additional original members under `seasonal-card-layout/`:
- `OK-W1-ANNABELLE-2026-320-options-before.png`
- `OK-W1-ANNABELLE-2026-320-options-after.png`
- `OK-W1-ANNABELLE-2026-320-options-current-standard.png`
- `OK-W1-ANNABELLE-2026-320-options-expanded-1.png`
- `KS26-W1-WALTERS-512-result-after.png`
- `KS26-W1-WALTERS-512-result-expanded-2.png`
- `AR26-W1-002-390-plan-after.png`
- `AR26-W1-002-390-plan-expanded-3.png`

## Final regional/wave2 evidence — artifact 12140990108

Original archive: 266,444,488 bytes; parent verified SHA-256 `4b4eed9d30d5210a70421bab20a2912136890ed63b55c44661a9121483f28bf3`, CRC and final-head binding.

- Regional verdict: 317 expected/317 actual passing scenarios; twelve accepted IDs, 12 expired-November-5 controls, 24 negative lifecycle controls and 32 historical receipt controls.
- Wave2 verdict: 277 expected/277 actual passing scenarios; ten accepted IDs, 10 expired-November-5 controls, 20 negative lifecycle controls, 32 historical receipt controls, 320/390/512px consumer widths.
- Both: empty errors, no failed image/readability/control records, zero public provider calls/forwarded external calls, manual-location-only testing. Actual UI radii 1/15/30/50 miles; independent 25-mile measurement is an oracle only, and unsupported 25-mile planner input is rejected. Wave2 explicitly records `publicProviderAcceptance: false`.
- `wave2-subpass.json`: code 0, no signal, `passed: true`, legacy scenario count 317, reference to the complete wave2 verdict.
- Eight inspected originals show loaded corn-maze/haunt artwork, readable expanded dates/hours/accessibility and visitor cautions, uncertainty labels and reachable-looking link controls. No additional visual failure identified. Artwork and factual copy are fixture evidence; the review does not independently validate provider claims.

Exact additional original members:
- `seasonal-regional-wave1/0-consumer-anything-category-320-options-image-0-viewport.png`
- `seasonal-regional-wave1/0-consumer-anything-category-390-result-note-date-night-ok26-w1-annabelle-1.png`
- `seasonal-regional-wave1/1-qualified-night-plan-plan-note-date-night-ar26-warehouse-3.png`
- `seasonal-regional-wave1/11-consumer-anything-category-320-pick-result-image-0-viewport.png`
- `seasonal-wave2-ten/0-consumer-anything-category-512-options-image-0-viewport.png`
- `seasonal-wave2-ten/0-consumer-anything-category-512-result-note-date-night-ks26-walters-2.png`
- `seasonal-wave2-ten/7-consumer-anything-category-390-result-note-date-night-il26-w1-chitty-6.png`
- `seasonal-wave2-ten/9-qualified-night-plan-plan-note-date-night-ar26-royal-4.png`

## Scope limits and conclusion

All requested final browser artifacts, including geometry and regional/wave2, have now been reviewed at the recorded-assertion level with the explicit pixel sample above. The evidence supports no newly established visual regression in that sample. It does not justify an exhaustive visual certification or a claim that every screenshot was inspected. Light/dark direct pixel comparison so far covers Dinner, while sampled seasonal screenshots are dark. Desktop direct pixel review so far covers casino. No mobile Safari/native-device execution, live browsing, deployed-app run, provider website verification, runtime source activation, or exhaustive accessibility/contrast audit was performed.
