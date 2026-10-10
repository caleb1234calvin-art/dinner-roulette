# Independent hosted fixture preflight R1 — HOLD for live execution

Reviewed 2026-10-10. This review issued no public-provider requests.

## Integrity and exact binding
- Published harness commit a801c3f4f9086cf9e514c68647815f1d2f2437ce, tree ae4ae8a2aaae0363888dced69df16bc73589a7d1; hosted run 38032445502.
- Original ZIP: 935,838 bytes; SHA256 08074b563fb9978bf27ce356d85721d6cc6a3dd2019904158b8f7f07b5673ef8; 84 members; all CRCs valid.
- Fixture ledger: 81 hash-chain rows independently verified, final chain 7c4184d9a8e2ab38979396ecb6c89377fd59b6a3ac5a139f6dce959d344fae7b.
- 28 fixture starts and 28 settlements, no pending; 20 valid successes, 8 failures. Every retained body independently matches recorded byte length and SHA256. Public-provider requests 0: exact frozen fixture preload substitutes provider responses.
- Both exact source identities and auth=true build proofs retained. Baseline source 38873e4e38ef8eeb061303f3c9cd49344eea8f421c010129e0f1e013c357c998 /468 files; candidate source 853fe21f5c661a59d021ce0f870b391ce6d3cc14653b693f4c5db46ab88c05b2 /477 files. Output fingerprints differ by source/build as expected. No page errors in four cases.

## Actual narrow browser results
1. Baseline complete: four eligible Movies; actual Pick and four distinct Options rendered; truthful no-pair Plan. Five warm targets recorded zero RPCs.
2. Hybrid successful primary: complete audit, four eligible Movies; Pick/Options/no-pair rendered; five warm targets recorded zero RPCs. Timing attribution/driver confounds below prohibit comparative speed interpretation.
3. Baseline one failed outer patch: genuine quiescent-partial terminal, four Movies remain usable; current Pick identity stable across later patches. Warm radius changes correctly skipped for incomplete authority. This closes the earlier exit13 termination mechanism in the exercised actual-browser case.
4. Hybrid failed primary: cold recovery succeeded. DOM explicitly showed zero activities and unavailable background state at 1213.2ms, then four usable Movies at 1240.1ms; actual Pick/Options/no-pair rendered. The Pick identity remained stable across two later patch settlements. Cold audit reached complete. Warm radius behavior then triggered integrity HOLD.

Representative actual pixels were inspected for baseline Pick, successful-hybrid four Options, baseline partial final view, and failed-primary hybrid final/no-pair view. Title/choice content is visible and usable. This is fixture UI evidence, not live provider latency, recall, or loaded-image acceptance.

## Warm refetch limitation preserved
After failed primary but successful radial audit, same-radius warm reuse made no RPC. Changing 20 to15 miles initiated a fresh unpatched primary. The cold-only geometry guard blocked it before provider dispatch. The record reports one extra warm RPC intent, while physical fixture total remains28. This is not zero-refetch PASS and is not fixed by simply skipping the observation.

A permissible harness correction may intercept warm-only acquisitions before server dispatch, preserve the attempted refetch as warm HOLD, stop further warm probes and retain separate cold outcome. It must not turn the product limitation into a passing warm sample, reset counters, or count a deliberately blocked warm request as provider failure. No runtime correction is authorized by this review.

## Timing blockers
- RPC timing uses performance.getEntriesByName(url).at(-1), but TanStack POST acquisitions share one URL. Case1 hybrid primary was assigned start1765.9/end2857ms although eligible provider Movies were already visible at1772.2ms. Core and20:0 were both assigned identical3156.4/3810.7 timings. These are wrong request associations. Use exact request-bound timing and a browser-timeOrigin mapping before live.
- The same hybrid case enabled Pick at1772.2ms but the trusted click occurred4258.3ms, a2486.1ms gap. Baseline gap was122.1ms. Cause is not established by this review. Do not count test-driver scheduling/observation delay as application unusability. Instrument navigation return, driver loop and click attempt separately; bound acceptable driver lag before live.
- Observer scan/serialization overhead remains unmeasured. Existing longtask observations cannot isolate observer cost.

## Required next gate
Preserve R1 as failed/incomplete preflight. Review a narrowly corrected frozen harness, rerun only zero-public-traffic fixtures and inspect actual results. Before live, require correct request timestamps, comparable prompt interaction, observer overhead evidence, stable choices, honest warm refetch outcomes, and cold/warm terminal separation. Original source functional PASS remains distinct; no live performance/adoption result follows this fixture run.
