# PR #74 integration — author-separated independent review

Reviewer: `/root/pr74_independent_integration`. This worker authored neither the original D2 candidate nor the integration commit, and did not push, merge, deploy, migrate, sign or change production configuration.

Provisional verdict: **QUALIFIED PASS of exact source integration and independently rerun focused regressions**. Final combined browser/hosted acceptance is recorded below when the separate workers finish; this source verdict does not substitute predecessor evidence for the new identity or authorize release.

## Exact identity and scope

- New candidate: `e5e1682f6c82c9a7d972e28bf9b9f94973a3d158`.
- Tree: `c36112156cd11baefb6671194f0d59b9c181c2a3`.
- Parents: original PR #74 `e25594063bc0de09aeb4e08c4912845f9f08fffa`, then released main `ead2319c4869478f4cd121e2370db4d9734d83ed`.
- Released-main tree: `7c12c5327af906348992e9b7d3282a11f830a202`.
- Independently fetched and detached at the published commit; source worktree clean before and after tests.
- Complete diff reviewed: nine files, 217 additions / six deletions against released main. Two runtime modules (`curated-policy.ts`, `radial-session.ts`); seven test/support files. `newhead-complete.diff` SHA-256 `ca8213a5dcc4b2b1cd2ad78cd1f39566f141e62e7fbfa628267f1b8ddecbc9b2`.
- Relative to the original PR #74, changes are exactly the four released PR #73 files, with the intentional historical test composition in the shared file. No catalog, presentation, provider, cache, radial planner, availability, eligibility, package, workflow or deployment configuration change.

## Conflict resolution and safeguards

The conflicted `scripts/seasonal-phase4-recovery.test.mjs` now first calls `curatedRadiusSourceBefore(path, occurrenceSourceBefore(path))`, then retains the released Directions-only whole-file hash and exact class reversal, then checks the unchanged historical receipt. Removing only the added import and wrapper reconstructs released main's complete test file byte for byte. The two amendments target disjoint paths.

The D2 helper accepts only the exact pinned current radial-session SHA-256, verifies the pinned before source, and passes all other input unchanged. Its stored before-source is byte-equal to the current released-main radial-session, not merely the historical commit claimed in the fixture. The fixture bytes themselves have a separately pinned digest. A direct adversarial helper probe rejected appending one byte to radial-session and confirmed that non-target Directions bytes pass through unchanged. This is a strict historical byte-receipt amendment; it is not the behavioral proof.

Both `src/components/result-overlay.tsx` and `scripts/seasonal-card-layout-browser.mjs` are byte-identical to released PR #73. The exact Directions label/hash/reversal safeguard and bounded geometry expansion allowance are retained intact. No assertion was skipped or widened during integration.

The existing D2 fixture adjustments continue to assert the full composed pool (ten rather than one row), then use the existing Favorites filter to isolate the original action/expiry fixture. They preserve the old fixture's behavior and do not remove date or radius assertions.

## Independently executed evidence

| Evidence | Result |
| --- | --- |
| Final nine-case D2 requirement against released main `ead2319…` | Seven FAIL / two passing controls |
| Same nine-case D2 requirement against new candidate `e5e1682…` | Nine PASS |
| Four amended existing test files on new candidate | 101 PASS |
| Five reviewer-only edge probes on new candidate | Five PASS |
| Combined focused command | 115 PASS, zero failures, zero skips |
| Full diff whitespace check; source/fixture hashes and ancestry | PASS |

The released-main before test lives outside the clean source tree; only helper import locations are adjusted so the unchanged test body executes released-main application code. Reversing the import-location adjustment reproduces the exact same requirement SHA-256 `65d0b870a3e39c900bbe4bb0df5de44e3ded69dfa61d6e8a95bc3da7f6d62ae0`. This freshly reproduces the defect after PR #73's release. The prior `991978…` control is preserved separately, not reused as this result.

The five reviewer probes independently establish: all 92 reviewed records are excluded at their own `seasonalListing.listingExpiresAt`; exact geographic clipping excludes each KC target one micromile below its actual distance; known negative retirement survives TTL expiration and compatible category/radius changes; stale old-origin negative responses cannot retire the new origin's saved pool; malformed provider patch metadata cannot gain coverage merely from saved composition. The original nine cases also test the real search handler, supported 15/20/30/40/50 transitions, watchdog/transport failure, conservative Open Now, source-bound expiry, seasonal/type behavior, relocation, cached core pacing and eviction.

Reviewer probe development is preserved honestly: `oldhead-reviewer-edge.log` contains three passes and two test-oracle failures on the original head. One assumed the optional availability expiry field existed for every record; the authoritative required field is in `seasonalListing`. The other attempted unsupported fractional session-radius values; the UI/planner admits a fixed discrete radius list, so the precise-distance check correctly targets the underlying clipping function. Both initial script and log are retained; no product change followed from them. The corrected five probes were then rerun on the new exact head, not counted from the old run.

## Original evidence actually accessed

The separate evidence worker recovered and integrity-checked the original closeout packet. This reviewer then read the actual extracted author logs, not only report summaries:

- `red.log`: first seven-case before test, six failures / one control.
- `green-initial.log`: six passes / one incorrect seasonal-off oracle, corrected because Exiled already has listing-lifecycle visibility.
- `negative-eviction-red.log`: rejected naive composition prototype, seven passes / one genuine closed-identity resurrection failure after cache eviction. No exact Git identity is claimed for this rejected prototype.
- `exact-regression-before.log`: final nine-case control, seven failures / two controls on original released baseline.
- `exact-regression-after.log`: final nine cases pass on the original candidate bytes.
- `full-tests.log`: original fixture-count and historical source-hash failures, plus transport setup failures before required compiled output. Its four material fixture/source failures were inspected with actual assertion values. These failures remain preserved.
- `source-and-regression-binding.json`: original source/test hashes, catalog count 92 and unchanged-data relationship.

`original-failure-inspection.json` records the exact file sizes and SHA-256 values accessed. Old-head radial, regional and geometry verdict/build-proof JSON and unsigned Android verification JSON were also read from downloaded original hosted archives. Those old-head results are historical only. No old screenshots are claimed visually reviewed by this worker.

The recovered original target-specific hydrated KC probe and HTTP preload were read in full. They exercise the compiled handler/client/UI with controlled 504 responses; they do not fabricate RPC response data or bypass eligibility. They favorite-isolate the three target identities, independently check the full pool, drive actual radius/Open Now/location controls, and preserve RPC/provider-attempt receipts. The clock/locations/provider network are explicit fixtures, so this proves deterministic failure recovery rather than live-provider reliability.

## Fresh exact-head browser corroboration

A second author-separated worker built the exact new head and current released main using the migration-free auth-enabled direct-Vite command. This reviewer independently read the fresh scripts/preload, both complete KC verdicts and the separate Directions verdict, and inspected selected original screenshot files from those runs. Candidate source fingerprint is `18d6724e402478ded889815535bad3ba1fe48992716e258864099931c8232ba8` / 520 files; tested output is `7d896a249f7185022118465616d294b5ec593994c03a82faad566f4faa03fc79` / 193 files. Proof-before/proof-after and clean tracked source match. Main control source is `e5c75fc455a3dde35754dd23c58d6fbb65e2f263bccb1419d88dbc28ac7f3b81` / 517 files.

The new candidate passes 14 KC stages. At 15/20/30/40/50 miles target counts are 0/1/2/3/3, whereas current main retains zero at every radius. Candidate shrinking to 15 removes all three, growing to 50 restores them; Open Now removes all three; full unfiltered count is six versus main's three; real manual-control relocation to fixture Carthage removes KC results and returning restores them. Source-bound client expiry leaves Exiled alone at `2026-11-01T05:00:00Z`, then none at `2026-11-02T06:00:00Z`. Radius/filter changes retain one actual core RPC/four controlled mirror failures, no outer provider requests. Main's 12-stage expected-defect control PASS faithfully records absence, not product acceptance.

The independent worker also passed six actual hydrated Directions cases: seasonal Exiled and ordinary China Taste at 320/390/512. Heights remain 72/72/56 pixels; full label/accessibility name, Tab/focus-visible, link parameters/target/rel, card/text containment, touch dimensions and disclaimer ordering pass. Seasonal Maps address and ordinary coordinates are unchanged. No external Maps navigation was performed. The Details element opens/closes by keyboard Enter.

Screenshots this reviewer actually viewed: candidate KC 40-mile Options; unfiltered 50-mile home; seasonal Directions at 320 and 512; seasonal 390 notice/Details focus. The complete Directions label is visible and contained in the selected screenshots. The 390 notice and Details row remain tight, with no observed text overlap or clipping, and the component bytes equal released main. No new UI defect or scope expansion is justified. Other case screenshots are preserved and covered by the browser worker's inspection/measurements; this reviewer does not claim to have viewed them all. Exact inspected files/hashes are in `fresh-browser-inspection.json`.

First browser captures passed their assertions but sometimes captured art before image decode. The worker preserved R1 scripts, reports and images, added only a screenshot image-decode wait, and reran unchanged functional requirements as R2. Final 14+12+6 pass on the same build proof; no candidate source changed. Controlled HTTP failures, fixed clock/geocoder, blocked public providers/fonts, Chromium 153 and fallback-font limitations remain explicit.

Root's first new-head full suite also ran before compiled output and failed 15 transport/setup assertions (1,239 pass/four inherited skips; all 71 application tests pass). The original log is preserved separately. Root then ran the required safe compilation before rerunning; no test changes were made to suppress those failures. This reviewer separately read the original successful new-head checks job log `116722879024` from web run `38822722705`: checkout is exactly `e5e1682…`, 1,253 repository tests PASS/four inherited skips and 71 application tests PASS, with zero lint errors/six inherited warnings. The original Android job `116722879289` from run `38822722711` likewise checks out the exact head and reports BUILD SUCCESSFUL and `signing: unsigned`. The separate evidence worker also inspected the original AAB bytes, CRC, signature absence, launcher decodes and 14-warning lint record; this reviewer read that inspection receipt rather than claiming a second independent binary decode. Hosted browser matrix completion remains the separate outstanding gate at this checkpoint.

## Remaining qualifications

No blocking source finding. The corrected saved composition belongs to presentation after core settlement/cache availability; it never writes provider coverage proof or changes request budget, pacing, failure gate, geographic radius, source dates or Open Now authority. All 92 identities and source metadata remain unchanged.

Negative retirement is conservative within a location/Halloween/semantic namespace. Compatible radius/category changes and expired/evicted negative cache evidence cannot regenerate a retired static saved record. Namespace replacement can initialize a fresh pool; this is not a permanent global closure database. Provider evidence and source freshness limitations remain explicit.

Controlled browser/automated Android evidence does not prove live providers, real GPS, physical Android/WebView or field operating conditions. Inherited 390px notice/Details spacing is unchanged by this candidate; D3 Benton and research content are outside this diff. Separate owner approval of the new exact SHA/tree is still required before merge or deployment.
