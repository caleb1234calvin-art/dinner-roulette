# R2 hosted preflight producer review

Result: four actual-browser, zero-public-traffic fixtures passed the preregistered rendered-control and timing-quality gate. Independent review is still required before live traffic. These synthetic timings are harness calibration, not architecture performance evidence.

Run: https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/38033469837
Commit: fdc67197cc505713b31929e2580fd1c573917d4b
Tree: c843927b162ee1ec5086c84b2518a45e44dff1f3
Artifact: 11662288352, 927226 bytes, ZIP SHA256 cb4959648abb831131cce995a307ecba82a64826fcabcaaf8240ab8e1807a555.
Exact source A/B unchanged. Hosted builds and 47 offline tests passed. Live and live-analysis steps skipped.

All 28 mock physical starts have terminal outcomes; no pending requests, no public provider calls. Cold cases: A complete, B complete, A quiescent-partial after one failed outer patch, B complete after failed-primary audit recovery. All four rendered a real Pick, four distinct eligible Options, and truthful no-pair Plan. Movies-only genuine Plan is not applicable.

Pick eligible-to-trusted-attempt delays in case order: 87.7, 90.0, 91.2, 38.1 ms, below the 250 ms gate. Actual rendered Pick navigation times: 3346.9, 3342.5, 3327.6, 3385.3 ms, including ordinary animation. Observer cold inclusive scan p95 upper bounds: 1.7, 2.2, 1.7, 1.9 ms; maxima 27.5, 40.5, 28.2, 34.9 ms. No observed long tasks. Read/scan and Node journaling costs remain separately recorded.

Request-bound timing now places successful B primary responseEnd at 1409.45 ms, eligible DOM 1466.6 ms, then core audit responseEnd 1492.19 ms. Failed B primary responseEnd 1462.44 ms precedes core audit responseEnd 1526.27 ms and recovered eligible DOM 1563.9 ms. Prior R1 repeated-URL timing substitution is not reused.

Successful A/B each completed five warm radius observations without acquisition RPCs, eligible DOM latencies 10.6–14.4 ms. Partial A correctly skipped authoritative warm checks. Failed-primary B same-radius warm completed at 12.1 ms, then the radius-15 acquisition intent was blocked before server dispatch: serverDispatched=false, physicalAttempts=0, providerFailure=false. warmStatus remains hold-refetch-required. This is a real reuse limitation, never a warm PASS or proof of user-blocking latency. Cold completion remains intact.

Offline exact-source replay on copied retained evidence completed with networkCalls=0. Successful B had zero marginal visible audit additions. Failed-primary B recovered four distinct eligible Movies from five audit requests (yield 0.8); actual pre-audit observed pools were the comparison basis. Geographic patch metadata is present. Synthetic fixture yields do not establish live provider behavior.

One analysis-only robustness defect was found after the hosted run: the missing-browser-result catch included duplicated normal-case analysis referencing undefined variables. Minimal correction removes only that unreachable-in-these-fixtures duplicate, plus a child-process regression verifies unavailable rows persist with networkCalls=0. Browser runner, ledger, source, and all raw R2 artifacts are unchanged. A new hash-bound manifest is required before publication/live approval. The original R2 manifest and analysis file are preserved alongside this report.
