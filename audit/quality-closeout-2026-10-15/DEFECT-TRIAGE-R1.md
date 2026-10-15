# Demonstrated defects and bounded corrections — 2026-10-15

No production mutation is authorized by this report. PR #73 is a draft, UI-only candidate; provider and catalog changes are excluded.

## D1 — Result Directions overflow at 320 px

- Severity: moderate usability; shared Result action in Dinner, Nightlife and Date Night. Inherited before PR #72.
- Reproduction: open a Result at viewport width 320; inspect the full “Directions · Google Maps ↗” button. Prior evidence measured button client width 280 / scroll width 315 and card width 335 at viewport 320.
- Root-cause evidence: `src/components/result-overlay.tsx` combined a long tracked uppercase label and icon with shared Button `whitespace-nowrap`, fixed `h-14`, padding and gap. The old evidence is preserved; no passing result is rewritten.
- Bounded correction: draft PR #73, branch `integration/result-directions-wrap-2026-10-15`, candidate `6bac175a4224ba3ef996a44419abb7bbeb9c5777`, tree `1197f826e2dfd26a4e6c65646a40e4eba7309705`, parent `991978fe24ec165eeacd5500a26d66f35d86c560`. Allow wrapping/automatic height, keep minimum 56-pixel target, prevent icon shrink and allow label line breaks. Full wording and destination are unchanged.
- Regression scope: geometry script checks all 92 identities at 320/390/512 across six variants; new strict current-Result checks reject label/button scroll overflow and viewport escape.
- Status: implementation prepared; local compilation/typecheck/lint/unit tests pass. Hosted browser acceptance pending. No live mobile or physical Android pass claimed.

## D2 — Curated outer-radius discovery depends on live core success

- Severity: high discovery reliability for affected broad-radius seasonal searches; inherited, not a new PR #72 regression.
- Reproduction: production → Date Night → Spooky ON → Kansas City, Kansas → Haunted House → Open Now OFF. Compare 15 and 50 miles during provider failures. Both yielded only Edge of Hell, Beast and Worlds of Fun, while the incomplete-coverage warning remained. Expected qualified outer records Exiled KC, Dark Nightmares and Terror at the Ranch were absent in this sample.
- Scope: selected outer radius when provider acquisition cannot prove the core; does not prove that every request or location fails.
- Root-cause evidence: `src/lib/date-night/search.ts` computes localWithin for fetch radius then restricts results to patch ownership; fallback/partial paths retain owned core records. `src/lib/date-night/radial-session.ts` pauses outer progression when core activity types remain missing, both before selecting the next outer patch and on settled core failure. Curated records therefore inherit a live-provider gate despite already being locally available.
- Proposed separate correction: qualify curated retrieval over the user-selected radius independently from live patch acquisition, while preserving provider pacing, coverage warnings, actual-distance filtering, seasonal lifecycle, Open Now fail-closed rules, stable deduplication, state/cache separation and relocation cancellation. Do not relax the provider core proof or silently mix live results across sessions.
- Required acceptance before implementation promotion: deterministic failed-core cases for the three named KC records, 15/50 radius exclusion/inclusion, relocation, cache keys, expiration, Open Now, ordinary Date Night pacing; then live Kansas City sampling. PR #61 remains parked; do not assume it is an accepted fix.
- Status: freshly reproduced, source mechanism inspected, separate candidate not yet implemented. Do not bundle into PR #73.

## D3 — Benton city query silently selects Benton County

- Severity: moderate location/discovery usability; newly observed in this takeover.
- Reproduction: enter “Benton, Arkansas, United States”. Production displayed “Benton County, Arkansas, United States” and searched around that region. Entering “72015, Arkansas, United States” corrected the label to Benton city and revealed Royal Haunted House at approximately 0.9 miles.
- Root-cause evidence: `src/lib/restaurants/geocode.ts` sends free-text Nominatim search with `limit=1` and directly adopts `results[0]`; normalization permits county fallback. This explains automatic adoption of the provider's first candidate. Provider ranking itself was not independently captured, so its reason is unknown.
- Proposed separate correction: show a small choice of labeled provider candidates or require explicit acceptance for a locality-type mismatch; preserve country-neutral search, postal-code recovery and existing timeout/invalid-result safety. Do not hard-code Benton or infer a country.
- Status: demonstrated ambiguity and recovery recorded; not yet independently reviewed or implemented. Separate from PR #73 and D2.

## Non-defects and validation failures retained

- Edge of Hell venue vs waiver-station Directions is intentional, source-confirmed first-stop routing.
- Plan's no-complete-pair state with only Haunted House selected did not fabricate a settle stop.
- Initial local repository tests failed the immutable Result hash after the deliberate UI change. Original baseline receipts remain unchanged. The corrected test first verifies the complete current file hash, reverses only the reviewed Directions class literals, then requires exact original hash restoration. Original failure log is preserved; subsequent run passes 1244 repository tests, 4 inherited skips and 71 application tests.
- Local geometry could not start because Chromium was absent. Official Playwright installation then failed with zero-byte/corrupt ZIP downloads. These environment failures remain evidence; hosted results must be inspected separately.
- Large AI continuity read transport truncated the middle during the first update (`4fc82015938e113a53d6a3f567163b1127454cf1`). Repair `0e5af1a30f30fa7183153e5aabe439760fa83202` restored every original byte; fresh Git readback confirmed the complete 1,185,450-byte historical suffix. The failed mutation and correction both remain in history.
