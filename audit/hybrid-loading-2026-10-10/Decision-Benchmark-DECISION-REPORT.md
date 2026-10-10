# PR61 final bounded decision benchmark

## Recommendation: MORE EVIDENCE REQUIRED

The sole authorized live run stopped at its preregistered eight-consecutive-physical-failure threshold. It collected eight complete cold cases, one quiescent-partial case, and one global-stop case, leaving 14 of 24 mandatory cases unrun. There is no complete three-city comparison at either radius, and no live failed-primary audit-recovery measurement. Do not adopt, merge, deploy, reset the budget, or replace this run based on this evidence. Existing functional PASS remains intact. Production remains a separate verified unchanged baseline.

## Exact execution and accounting
- Run https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/38034143730 ; workflow run 3, attempt 1.
- Benchmark-only publication 103a093d600138e921a9c00bd46b53a241907a14, tree 4b317d20adf6d264cf3cdc77760ba2bd9810da60, parent fdc67197cc505713b31929e2580fd1c573917d4b.
- A: fe22c15cc6442fc4a48fec23c9a1331c69d70bd2, tree 8d5059c9fee871c522616971cce0a80b153e4d23. B: c78b97175cc094436e454fa888e1ed83486f750d, tree 6f7130dc46e5decc9b045c2841b63c73406ae2ae. Final source identity checks passed.
- Frozen harness manifest SHA a0acb0e4562f9e958c5a013a33abc6c16d59ff1e270d9c582959830aebe3eda5; single-run approval SHA 8dad0fd7b2b8b227d27923393a408ba5705eb23d1d988b326717217fd93410ed.
- First physical dispatch 2026-10-10T07:23:35.211Z; stop approximately 07:32:25.352Z; terminal 07:32:25.706Z. Fixed ceiling 1280 physical attempts /45 minutes. 853 attempts remained when the failure stop latched; this is a failure-stop-limited experiment, not budget exhaustion.
- 427 physical starts, 427 outcomes, zero pending. Outcomes: 152 success,147 hedge abort,122 failure,6 timeout. HTTP responses included112 HTTP500 and10 HTTP504; no429. Complete retained bodies total209554 bytes;153 aborted/timed-out attempts have unknown body bytes, not zero known network cost.
- Last eight physical outcomes: two consecutive Kansas City acquisitions, each one HTTP500 from private.coffee and three timeouts across the other existing mirrors. No additional physical request after the stop. An automatically triggered hybrid audit RPC was denied dispatch after the latch; its failed handler row is not an observed live recovery failure.
- Optional mixed case was not run. No new probes, source changes, reruns or counter resets occurred. Prior327-attempt unfinished experiment and earlier historical counter-reset failure remain preserved separately.

## Actual browser results: completed blocks only

Hosted Chromium390×844 against exact local SSR builds, public policy clock anchored identically; these are not user-device or production-origin timings. Values include genuine trusted-click and normal Pick animation.

| Completed block | Radial Pick median | Hybrid Pick median | Hybrid change | Radial/Hybrid physical attempts | Radial/Hybrid known bytes |
|---|---:|---:|---:|---:|---:|
| Columbia20mi ABBA |6357.2ms|6811.85ms|454.65ms slower,7.15%|29 /36|11968 /16548|
| Joplin50mi BAAB |5820.5ms|2955.25ms|2865.25ms faster,49.23%|176 /178|84044 /95702|

Columbia hybrid did not meet the preregistered material improvement threshold. Joplin's observed advantage is real earlier usable local choice availability: the hybrid first Picks came from the curated Route66 Theater /66DriveIn entries, while first live-provider eligibility arrived at7849.4–8347ms. It is not evidence of faster live primary retrieval. Screenshots disclose hours unknown and verify-before-going. Curated availability must not be counted as provider health or refreshed live content.

Columbia produced three actual Options on all four runs; four-option render is inapplicable at those clicks. Joplin radial rendered four Options; hybrid rendered two stable curated Options before live data arrived, then final pool grew to14. Four-option render was not remeasured after that growth and is not inferred. Movies-only Plan correctly showed no compatible pair and is N/A for genuine-plan speed. No claim of a genuine live mixed plan can be made.

Kansas City radial core failed and produced no eligible Movies or usable controls; hybrid primary similarly failed before the global stop, also with zero eligible Movies. These observations remain in the usability denominator. The truncated Kansas City block and the three wholly unrun blocks cannot be replaced by favorable completed blocks.

### Observed ranges (two completed samples per arm/block)

| Block / arm | Pick median [min,max] ms | Options observed render median [min,max] ms |
|---|---:|---:|
| Columbia20 radial |6357.2 [6318.3,6396.1]|8073.75 [8017.4,8130.1]|
| Columbia20 hybrid |6811.85 [6616.7,7007.0]|8514.8 [8337.4,8692.2]|
| Joplin50 radial |5820.5 [5774.8,5866.2]|7512.8 [7444.7,7580.9]|
| Joplin50 hybrid |2955.25 [2947.2,2963.3]|4632.3 [4632.3,4632.3]|

Options observed render is sequential after Pick and its observation window, not independent earliest usability. Genuine-plan timing is unavailable in this Movies-only experiment. The two failed Kansas City acquisitions have no usable render, remain counted, and are not omitted from reliability.

## Primary recovery and marginal audit yield
Observed hybrid primary failure frequency was1/5 attempted primary acquisitions (20%): four successful and one failed Kansas City primary. This is a tiny, early-stopped sample, not a population reliability estimate; fourteen planned case slots remain unrun. The stopped zero-dispatch audit is excluded from that denominator. All four completed hybrid primaries succeeded. Both Columbia20 cases ended with3 eligible Movies and both Joplin50 cases with14. Across199 physical audit attempts (15+14+82+88), there were zero genuinely additional final-visible eligible identities beyond the successful primary pool. Raw duplicates and identity aliases are excluded by exact-source merge logic; actual pre-audit browser pool is used where observed. There is consequently no new-venue geographic omission explanation to claim for these completed cases; full patch band/sector geometry remains in retained analysis.

The naturally failed Kansas City primary had no chance to execute an audit provider request after the safety latch. Live recovery time is unobserved, not infinite or successful. The earlier zero-public-traffic fixture proves the recovery mechanism and documents a failed-primary20→15mi warm refetch intent; that limitation stays in the assessment but does not establish live recovery speed.

## Warm, CPU, stability and cost
All eight completed cold cases completed five warm radius observations with no acquisition RPCs:20 observations per architecture. Actual radius→eligible-DOM p95 was31.5ms radial and63.8ms hybrid, maxima31.7/64.6ms. Hybrid is slower in this partial warm sample but remains within the preregistered100ms practical threshold. The failed/partial Kansas City cases skipped warm checks; no success is imputed. The earlier fixture warm refetch HOLD remains separate and preserved.

Exact-source offline retained-response replay measured merge/dedupe median about5.38–5.41ms radial vs8.24–8.27ms hybrid in Joplin50; clipping about0.006–0.007ms and clipping+decorate+eligibility about0.82–0.94ms. These40-sample Node replays are not browser CPU latency. Joplin final serialized eligible pools were11882 bytes radial versus12062 hybrid. Columbia pool size2389 bytes on both. No allocations were measured, so no memory-allocation claim is made.

Completed Columbia physical ratio36/29=1.241 and known-body ratio16548/11968=1.383; Joplin physical178/176=1.011 and known-body95702/84044=1.139. These partial matched-success strata fit the selected practical cost ceilings, while unknown canceled-body bytes prevent a full wire-byte claim. Across all ten observed cases A used209 attempts /96658 known bytes, B218 attempts /112896 known bytes; failed responses are not used to claim a cost win.

All live cases passed the recorded driver/observer confound flags. Snapshots and open-decision settlement observations are retained for independent stability review; no broad claim outside those observed open windows is made. Actual browser long tasks, observer CPU, trusted-click timing, per-RPC timing and rendered identity evidence remain separately inspectable. Audit completion is not substituted for first usable Pick.

## Evidence
ZIP artifact11662969953,7283972 bytes, SHA2561c2334c4998d5ad3f2cdd07b34485ad499befcc2e10def0319cc3a4bbba14903.
Local raw: decision-benchmark/live-hosted-evidence/live/.
- physical-ledger.jsonl SHA184e27d50388f8b14c6a370503475f7e709c6f186dc5ace612c59d855ae2ac4f
- terminal.json SHA0b7bea2f0a9927a0f29babb6adc9824c04cab79c7d4b549a574c5f5803c56814
- progress.json SHAb86fb663d633e2b238bbaf234bde4206d0d46ab80e95c8fd77e2118cf1ac0df3
- manifest.json SHA21a63c95ea3cf185859dbb41ed582a0aa286d5e5e352093af57eacb198062c29
- analysis.json SHAf99d6c59895b24a75b3481f3d37e1e4fe66e7d6535540c6191b495be320a5882
Per-case detail: decision-benchmark/live-review/CASE-SUMMARY.json. The raw artifact also includes the fresh48-test pass and repeated zero-public-traffic browser preflight before live entry.

Independent final review agrees: MORE EVIDENCE REQUIRED. It verified the1011-row hash chain, all427 settled physical attempts, all274 retained provider bodies and155 RPC bodies, no case overlap, no post-stop dispatch, and maximum physical concurrency3. Report: LIVE-FINAL-REVIEW.md SHA a38501225cac653f894d0857ae3985d60e8fcb978b8818bc81ded854490a78ce.

Observed stability evidence is narrower than general functional coverage: live settlement windows cover Columbia and radial Joplin Pick; hybrid Joplin had moved to truthful no-pair Plan before its first provider response. This experiment therefore does not prove hybrid Joplin Pick/Options stability across later enrichment. Existing prior functional evidence is separate and unchanged:1059 tests, with the separately recorded970 browser,426 geometry and14 control checks. The new48 passing tests verify benchmark machinery, not a fresh functional reproof.

This is the terminal producer report. No additional traffic, rerun, budget reset, source correction, optimization, merge or deployment is authorized by this result.
