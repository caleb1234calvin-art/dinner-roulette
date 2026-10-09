# Track F — Date Night radial loading performance audit

## Verdict

**MORE EVIDENCE REQUIRED.** Radial-v1 imposes substantial, independently reproducible scheduling and request overhead. A successful one-shot can be much faster, and a successful 50-mile cache can make radius changes local. However, this bounded live sample is unstable and incomplete; it does not justify replacing production acquisition. Two concrete safety adaptations are required before any replacement candidate. No runtime, main, production, taxonomy, seasonal data or discovery backlog was changed.

Source: **fe22c15cc6442fc4a48fec23c9a1331c69d70bd2**, tree **8d5059c9fee871c522616971cce0a80b153e4d23**, parent f767a8d2e8c6ffe1120dd5f1bb73d9215b8dfafd. Fresh connector read at 21:47 UTC on October 9, 2026 matched production **dpl_8xyE9R3BxyE1883QpavaEBWV2LGa READY**, same source. Initial canonical continuity ffa3a4a3a98b1060ca1228d5bcebd155e2c13805; task-start checkpoint bb27afd9c5d18eefefad4d044d8b46c03fdd14a8. Final continuity is coordinator-owned, not implied by this report.

## What was executed

- Ordinary exact Git checkout, clean tracked worktree; no saved desktop/cloud coding environment was available. Node24.19.0. Dependency installation used the repository lockfile with lifecycle scripts disabled. First install failed writing the default cache; normal retry with writable /tmp cache succeeded. No certificate/proxy/security changes.
- Actual application query builder, provider chain, server validator/handler, radial controller, cache, identity merge, decoration and eligibility were loaded through the repository's existing test module loader. **Only TanStack RPC transport was stubbed.** Real requests went from this permitted cloud execution route directly to the same four public Overpass endpoints. No production RPC or load test was sent. These are handler/controller timings, **not browser input-to-render latency, Vercel cold-start latency, or physical Android measurements**.
- Live acquisition used one ordinary category (Movies), public Joplin, Columbia and Kansas City centers. The separate controlled matrix covered Anything, Movies, Haunted House and mixed Movies+Haunted House+Park at all three centers and15/20/50-mile selections.
- Three alternatives: A exact radial-v1; B exact pre-existing unpatched selected-radius handler with unpatched cache; C exact unpatched50-mile handler/cache plus local clipping. C's immediate curated overlay was a **separately modeled local catalog composition**, not a shipped UI or existing one-shot feature. Its zero virtual delay is not a measured end-user guarantee.
- Live safety ceiling240 physical requests; actual **40** across two bounded stages. No429. Stopped after two consecutively failed Kansas City handler acquisitions; no further provider traffic. Initial probe made8 requests, matrix32. The consecutive-failure counter restarted at the matrix boundary: Joplin50 failure followed by Columbia20 failure did not trigger a global cross-stage stop. This protocol limitation is preserved; it did not expand the240 ceiling or source mirror set. No extra retries or mirror rotation beyond exact source behavior.
- Fresh existing focused regressions **155/155 PASS**; separate relevant seasonal/cache/client/expiry/navigation regressions **247/247 PASS**. These are402 local tests in two disjoint command sets, not a full repository or browser suite, and not validation of a new architecture.

## Real live observations

All are single observations with cold application caches. Provider-side cache state is unknown. Requests ran sequentially in the recorded order; these are not randomized repeated trials or statistical failure-rate estimates. “Complete” below means requested provider groups returned valid data, not exhaustive real-world venue recall.

| Location / operation | First eligible response | Selected-radius completion | Handler calls | Physical upstream attempts | Eligible Movies |
|---|---:|---:|---:|---:|---:|
| Joplin radial core only (15-mile core for50-mile target) |7.232s|not measured for50|1|4|5|
| Joplin unpatched50 |12.506s saved fallback|unavailable: all groups failed|1|4|2 saved|
| Columbia unpatched20 |none|unavailable: all groups failed|1|4|0|
| Columbia exact radial20, all5 patches |6.506s|20.020s|5|16|3|
| Columbia unpatched50 |7.318s|7.318s for50|1|4|9 at50;3 at20|
| Kansas City radial core for20 target |none|unavailable: core failed, outer paused|1|4|0|
| Kansas City unpatched50 |none|unavailable: all groups failed|1|4|0|

The successful Columbia50 response, clipped to20 miles through current cache/eligibility code, had **exactly the same three IDs** as the completed radial20 result. That successful one-shot completed about **63% sooner** than that radial20 completion (7.318 versus20.020 seconds), while radial delivered its first useful subset about0.812 seconds earlier. One example is promising, not a population estimate. The smaller Columbia20 one-shot failed immediately before the successful radial20 and50 one-shot, demonstrating why radius alone cannot explain this sample.

Forty physical requests:7 HTTP200 usable bodies,10 HTTP500,2 HTTP504,11 attempt timeouts,10 losing hedge aborts. Losing hedge aborts are expected cancellation, **not provider failures**. One provider group's successful winner can coexist with failed/cancelled sibling attempts. Full raw timestamps, query text/hashes, body hashes and outcomes are in live/ and live-matrix/; group summaries preserve the source's classifications. Handler receipts include saved records outside the requested category; eligible counts apply actual filters and are not raw response totals.

No actual complete50-mile radial pass was reached before the stop. Remaining matrix cells, repeated trials, live Anything/seasonal/mixed comparisons, live upward/downward midflight cancellation, and a non-Missouri control were **not run**. No unseen result is zero or PASS. The non-Missouri control was optional and omitted once reliability already limited the primary comparison.

## Controlled exact-code scheduling/coverage experiment

**108 runs** =3 locations ×4 modes ×3 radii ×3 designs. Fixed deterministic100ms provider responses, repository predicate evaluator, finite known42-element fixture containing duplicates and negative lifecycle evidence. Exact source query interpretation and geographic selection were applied. Virtual time was used to isolate controller behavior; it is explicitly **not live provider timing**. The reused virtual clock mocks Date.now but not new Date(): eligibility is fixed to October9, while handler season detection uses the actual run date (also October9). Future reruns outside the active season require explicitly matching both clocks; no year-independent reproduction claim. The performance callback directly invokes the handler and does not forward the controller signal; upstream cancellation conclusions come only from the separate cancellation probe, not this latency matrix.

**36/36 matched groups had identical final eligible ID sets** across the three designs. No claim of real provider recall follows. The known fixture covers five radius bands and eight supported activity types; it does not establish every possible geometric boundary or real OSM data completeness.

| Selected radius | Current radial calls | Radial completion, virtual | One-shot selected completion, virtual | Anything physical fixture fetches radial / one-shot |
|---|---:|---:|---:|---:|
|15mi|1|100ms|100ms|4 /4|
|20mi|5|3,450ms|100ms|20 /4|
|50mi|32|30,450ms|100ms|128 /4|

Radial first eligible results in these100ms cases appeared at100ms where the core contained an eligible record. One-shot likewise waited100ms. C's separate immediate-curated composition returned a local eligible subset at virtual0 only where current catalog and actual eligibility permitted; otherwise it waited for provider completion. A fast empty or irrelevant response is not “useful.”

The radial outer-start floor is1,000ms and successful settlement pause250ms. With near-zero provider time the50-mile controller has roughly30.25s unavoidable scheduling time after core admission; with100ms responses the measured result is30.45s. Existing passing pacing regression also models6-second responses:32 serial calls plus31 quarter-second pauses =199.75s. **These are counterfactual/scheduler facts, not observed50-mile live results.**

At50 miles, Movies needs up to32 first-mirror requests versus1 unpatched. Anything needs128 versus4; if all four hedges are attempted, theoretical maxima are512 versus16. The240 audit ceiling intentionally prevents an unrestricted worst-case full Anything radial live run. All category groups repeat lifecycle-context acquisition; Dinner's single food query is not equivalent work.

After completed acquisition, all tested compatible radius reductions incurred zero new handler calls. C allowed1→5→10→20→50→10 local views from a single50-mile acquisition. Modes represent separately cold acquisitions; this does not mean a Movies-only session has acquired unrequested seasonal categories. New categories, failed groups, changed origin/season/version, TTL or eviction still require appropriate acquisition.

## Local radius latency and memory

Offline replay of the real successful Columbia50 payload,150 local views through cache read, strict clipping, current-policy decoration and eligibility: median **0.691ms**,p95 **3.297ms**,maximum **10.888ms**. No network calls. This supports near-instant local filtering for that small payload, **not guaranteed browser rendering, large-city or phone latency**.

Real Columbia full JSON response: **15,965bytes**. Node retained-heap experiment using100 independent caches with structured-cloned copies and GC before/after estimated **24,797bytes per cache**. This is a runtime-specific small-payload estimate, not browser heap/peak/all-city memory. Controlled C payloads were14,053–53,543bytes; full local-view CPU in those fixture runs varied (median1.270ms,p9521.035ms,max82.913ms). Large payload/identity merge cost needs profiling, not an “instant under all conditions” promise. Existing20,000 raw-venue cap is a count/eviction bound, not a byte budget.

## Safety findings: replacement is not a toggle

1. **Upstream abort propagation is patch-gated.** Exact handler passes getRequest().signal only for patched requests. Deterministic stalled-provider probe cancelled at100ms: radial stopped its sole attempt and settled at100ms; unpatched continued four attempts starting0/1500/3000/4500ms and settled at12,500ms. Current client stale-result guards protect callbacks separately; they do not stop the unpatched server work.
2. **Negative-evidence eviction retirement is patch-gated.** Independent synthetic unpatched maxEntries2 probe: positive Movie identity, same-ID permanent-closure evidence from another category, then valid-empty park insertion evicting the negative. A later Movie cache read lost its lifecycle protection. Current radial protection remains intact. A one-shot replacement must generalize retirement across eviction/identity/category ordering.
3. **Curated-first requires explicit implementation.** Current patched and unpatched handlers assemble local rows early but return only after provider settlement. Current radial also sector-owns them. Immediate local catalog display can reuse current registry/eligibility, but must merge later negative evidence, expire on clock/resume, retain supported routing and never claim live completeness.
4. Spatially intrinsic pieces are sector ownership, overlapping-circle handling and contiguous-radius progress. Reusable essential protections include bounded acquisition, group outcomes, valid-empty/partial semantics, strict radius clipping, identity merge, negative lifecycle, cache TTL/current policy, cancellation generations, exact expiry/no2027, late-fall allowlist, truthful Open Now, supported-address navigation and saved/favorite/exclusion semantics. Full source-cited safety map and frozen probes are attached separately.

## Answers to the seven questions

1. **Is radial materially slower in real use?** Its scheduler is materially slower in controlled exact-code cases. One complete live Columbia20 comparison shows slower total completion, but earlier first results. Broad end-user/browser conclusion remains unmeasured.
2. **Does one-shot improve latency?** It can: Columbia50 succeeded in7.318s versus radial20's20.020s. Other one-shots failed, and first-useful radial was sooner in that successful pair. Not an unconditional improvement.
3. **Does one-shot increase failures/timeouts?** Unknown. This tiny, ordered sample had several one-shot failures and a core failure. It cannot estimate comparative failure rates or attribute failures to radius rather than provider load/route/time.
4. **Is recall different?** Known-fixture IDs matched36/36, and successful Columbia same20-mile IDs matched. Real comprehensive recall remains unknown; fallback/failed results are not zero recall or comparable successful coverage.
5. **Can slider changes become instant after one acquisition?** Yes mechanically for successful cached category coverage; the real small-payload replay was submillisecond median. Browser/large-payload latency and failure/TTL/category changes remain constraints.
6. **Which safeguards require spatial patches?** Positive sector ownership, overlap ownership and contiguous-ring progress. The critical factual/lifecycle/cache/identity/routing safeguards are reusable, but the two patch-gated adaptations above must be addressed.
7. **Is radial still justified?** It retains observed resilience/early-result value and is currently the independently verified production design. Its overhead merits challenge; evidence does not justify retaining it permanently or replacing it today.

## Smallest next step, separately authorized

Keep current production unchanged. Prepare a separate nonproduction performance proposal that (a) generalizes upstream cancellation and negative-evidence retirement with targeted regressions, (b) measures a curated-first overlay independently of network strategy, and (c) performs a small repeated, order-balanced selected-radius versus50-mile comparison on an independently verified preview, including a successful full radial50 reference and browser input-to-useful-result timing. Reuse this audit's payloads for offline correctness; do not repeat statewide discovery. Do not silently simplify query semantics to obtain a latency win.

No replacement implementation is authorized by this report; no production release is proposed. Missouri data/Cadaver work remains separate and is not blocked by this audit. Cadaver remains held for reliable attraction-specific2026 operation/date binding and supported expiry; this audit did not research it. Physical Android/WebView/GPS and signing/Play remain separate HOLDs.

## Evidence and reproduction

- protocol.md; live-probe.mjs; live-matrix.mjs; raw live/ and live-matrix/ receipts.
- controlled-benchmark.mjs and controlled-results.json; 108-run current results. R1 script/results preserved: initial responseBytes incorrectly measured after local radius changes; R2 captures final acquisition response before those changes. No timing/ID-parity source behavior was changed to make a result pass.
- cancellation-probe.mjs / cancellation-results.json; replay-live-pool.mjs / live-pool-replay-results.json.
- existing-focused-tests.log (155PASS), safety-regression-tests.log (247PASS).
- Separate Track-F-Architecture-Safety-Review.md and unpatched negative-eviction probe supplied by independent source reviewer.
- Reproduction requires ordinary exact checkout at /tmp/track-f-source and lockfile dependencies; scripts use explicit paths and process.chdir. Run controlled-benchmark, cancellation-probe and replay-live-pool with Node (last uses --expose-gc). **Do not rerun live scripts automatically**; live acquisition is frozen at its safety stop. Full source identity and artifact hash manifest accompany this report.

Final independent audit review and continuity publication/readback are separate pending gates at author freeze. Historical full repository/browser PASS is not reissued by this audit.
