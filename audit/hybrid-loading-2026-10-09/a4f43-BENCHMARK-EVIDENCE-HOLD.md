# Independent a4 benchmark evidence review

Date: 2026-10-09 22:52 UTC. Read-only, offline review; no provider requests, remediation, or production mutations.

## Recommendation
MORE EVIDENCE REQUIRED.

Evidence integrity/accounting is verified within the scope below. Full live protocol completion is HOLD because the runner did not terminate a quiescent partial baseline case and exited with unsettled top-level await. Earlier budget-instrumentation PASS does not imply full-run termination PASS or architectural adoption.

## Bound identities
- Baseline: fe22c15cc6442fc4a48fec23c9a1331c69d70bd2.
- Candidate: a4f43e9b886764592053a53652dc91602749ba11, tree 44929e3f3d0b6ba2e4dd366de847b952388f9cb3; independently inspected clean isolated worktree.
- Live harness: frozen R4 manifest 3b98814075f2b1359f228cf36a3d4368987c82d26749cb6806061bb41277ddde, previously reviewed.
- Live ledger: hybrid-benchmark/a4f43e9-live/physical-ledger.jsonl, SHA256 c8cabeeb07db1188fe371cb730644caee17ce41172e2038e4a491f390c526034.
- Final ledger chain hash: 1cf191cd3152e275eb63be4985c67d320d2906c266d9b0d11583fecb5b9649b3.
- Seven-case results snapshot: SHA256 27ead2ed67763efddbaeb57f93bc0ea13ce1f4544ecbb43bab01aff2c51240fc.
- Controlled results: SHA256 e43b9ef807b909118430a57251ee4fa7ed58c16c5d881750ce460d007f86cb8b.
- Live source-before JSON SHA256 23ae097fab7edf25bd1d3813206647cd5ab6188b37dc313bb3e899232228ecde; source-after b33141508d6e1e6ed2df6b4fbd29746a05a7502e137503fdefdad0d3f3b5228f. Different serialization bytes, same complete parsed mapping.

Before/after source mappings independently match: 330 baseline and 336 candidate entries. Every current isolated source file matches its stored SHA256. Controlled before/after mappings also match live-before mapping. This is source identity evidence, not production verification. Any later candidate, including presentation/semantic revisions, needs explicit applicability review; no automatic metric transfer.

## Global accounting independently recomputed
799 hash-chain rows verify. 327 reservations, 327 unique corresponding outcomes, no pending attempt. Outcomes: 131 success, 26 failure, 15 timeout, 155 losing-hedge abort. All 157 retained response bodies match recorded lengths and SHA256. No HTTP429, stop row, reset, cap overrun or counter gap. Maximum consecutive physical failure streak 5; maximum wholly failed handler streak 1. Handler records: 136 total, 131 successful, 5 wholly failed. Ceiling was 384; wall interval approximately 467.5 seconds.

The seven-finalized-case results snapshot contains only the earlier 248 attempts. It MUST NOT serve as final global accounting. The final ledger's 327 attempts is authoritative. Case7 used 79 additional attempts and 32 handler acquisitions, including one failed patch. Seven of 32 planned cases finalized, eighth started/incomplete, 24 not started. Finalized evidence and partial case remain preserved; no replacement run authorized.

## Termination defect
Frozen R4 awaits complete or paused. A radial baseline can reach quiescent partial coverage with loading=false, expanding=false, complete=false, paused=false after every patch was attempted. That state is not recognized. The ledger watchdog is unref'ed, so it does not keep an otherwise quiescent Node process alive. Exit13/unsettled-await log corroborates the stop. No wall-cap or provider-stop event fired. This is a harness termination failure, not proof of provider coverage completion.

Case7 first-useful/completion/eligible-final metrics remain unknown. terminal-summary.json explicitly preserves nulls. Its inferred failed-patch association is labeled inference from sequential request metadata. Do not reconstruct unobserved timing from the preceding case or call partial case7 PASS.

## Controlled evidence
Independently regrouped all 288 completed cases into 72 four-run comparisons and compared actual sorted unique final identity sets. 72/72 parity, no duplicated final IDs. Controlled provider latency fixed at100ms; timings are virtual, not browser or live latency.

Baseline READY/first useful was100ms at15/20/50 miles. Complete geographic coverage was100ms/3450ms/30450ms. Hybrid primary completed100ms, READY/first useful0ms with eligible immediate curated rows or100ms otherwise. Hybrid full audit completion200ms/3550ms/30550ms. Thus the large completion difference must not be described as an equivalent improvement in baseline first interaction.

Parity fixtures produced zero novel hybrid audit identities. Deliberate omission fixtures yielded0,1,2,3,5 or13 additions depending on available mode/geometry; mechanism proof only. Canonical identity changes must not be counted as discoveries. The recorded duplicate-audit occurrence total for hybrid controlled runs is1526, not1526 unique venues.

Radius replay: 288 updates per architecture, zero added provider calls for both. Baseline CPU median0.569ms/max87.328ms; hybrid median6.716ms/max370.673ms. These are observed local controller CPU times, not browser responsiveness or proof every update is instant.

## Live observations: Columbia Movies only
All times seconds; browser/RPC rendering was not measured by this harness.

15 miles:
- A1 failed/partial, no useful movies; label READY12.582 is not useful success.
- B1 first useful/READY6.470, primary6.462; partial audit18.983,3 final IDs; audit0 additions/4 physical requests.
- B2 first useful/READY6.822, primary6.819; complete14.623,3 final IDs; audit0/4. Three existing-primary ID occurrences were correctly non-novel.
- A2 first useful/READY/complete7.722, same3 IDs.

50 miles:
- A1 first useful/READY6.112; complete94.987;9 final IDs;73 physical requests.
- B1 primary failed,0 eligible primary IDs; label READY11.971 does not mean usable choices. Actual first useful19.820 via audit. Complete97.547;9 final IDs;75 physical requests, audit71;9 genuinely recovered IDs, yield9/71=0.12676.
- B2 primary failed,0 eligible primary IDs; label READY12.508; first useful19.483 via audit. Complete99.198; same9 final IDs;76 physical requests, audit72;9 recovered, yield0.125.
- A2/case7 incomplete:79 requests, no finalized first-useful/completion assertion.

The two successful completed hybrid50 final sets match the completed baseline50 set. This supports bounded final-set parity, not broad recall or provider reliability. Recovery of9 after total primary failure is fallback/recovery value, not proof successful one-shot queries systematically omit9 venues. In this sample hybrid50 was slower to first useful movies and slightly slower to complete than the finalized baseline50 case.

Offline cache replay of actual successful15-mile PRIMARY payloads: medians0.148/0.219ms, maxima8.876/0.642ms, no requests; only acquired15-mile authority. Both50-mile PRIMARY payloads were unstorable failed coverage and correctly retained missing Movies authority. Their fast empty-cache checks cannot substantiate usable50-mile session caching.

## Confounds and missing evidence
Researcher-disclosed CPU overlap: first15-mile A1/B1 overlapped controlled work until22:41:19UTC. Hybrid50 B2 overlapped diagnostic work22:45:10–22:45:39UTC. These timing confounds are preserved, not corrected by speculation. No reliable isolated timing superiority claim follows.

Live20 miles, Joplin, Kansas City, non-Missouri control, mixed/Anything/seasonal modes were not reached. Browser acceptance, cancellation/runtime safety, lifecycle-negative safety, full repository validation, production identity and final candidate verification are separate gates outside this evidence review. Small/incomplete sample cannot establish adoption criteria or broad provider reliability.

## Next
Preserve this terminal benchmark HOLD and all failed attempts. No new traffic or harness remediation is authorized by this review. Parent determines any separate bounded follow-up. Current recommendation remains MORE EVIDENCE REQUIRED, even if candidate safety and repository tests independently PASS.
