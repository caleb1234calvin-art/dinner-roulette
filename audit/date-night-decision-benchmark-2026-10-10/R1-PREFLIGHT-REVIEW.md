# Hosted benchmark harness preflight R1 — HOLD

This is a benchmark-integration result, not a new application acceptance result or a live-provider comparison. Existing exact-candidate functional acceptance remains separate.

## Identity and integrity

- Benchmark branch commit: a801c3f4f9086cf9e514c68647815f1d2f2437ce; tree ae4ae8a2aaae0363888dced69df16bc73589a7d1; parent exact c78b97175cc094436e454fa888e1ed83486f750d.
- Workflow run 38032445502; job 114156033803. Exact baseline fe22 and candidate c78 checkouts, auth-enabled migration-free builds, and 33 harness tests passed. Terminal fixture acceptance failed, as intended, when its final integrity condition failed.
- Artifact 11662901356: 935,838 bytes, SHA-256 08074b563fb9978bf27ce356d85721d6cc6a3dd2019904158b8f7f07b5673ef8. Downloaded bytes match the server artifact digest. Original ZIP preserved unchanged.
- Four controlled browser cases; 28 simulated upstream starts and 28 settlements, no pending attempts. Every response is a local provider fixture. Public-provider requests: zero. The live 1,280-attempt budget has not begun.

## Actual browser observations

All four cold cases rendered a valid movie Pick, four distinct Options, and truthful Movies-only no-pair Plan UX. Captured controls and actual screenshots support those results; enabled buttons alone were not treated as successful decisions.

1. Radial success: cold complete; five warm views (20→15→1→15→20 miles) caused zero additional RPCs.
2. Hybrid success: cold complete; the same five warm views caused zero additional RPCs.
3. Radial failed outer patch: correctly finalized as quiescent partial, retaining usable controls and results. This exercises the actual browser runner path corresponding to the historical unsettled-await failure. Incomplete authority correctly skipped warm-radius measurements.
4. Hybrid failed primary: the primary returned three saved non-Movies records, so the eligible Movies pool was empty; this was a fallback payload, not a thrown transport error. The initial empty/unavailable state was followed by four usable audit-recovered movies and complete radial audit. The cold recovery succeeded. Same-radius warm access issued zero RPCs. The subsequent 20→15-mile change attempted a new broad primary. The fixed cold-query geometry guard blocked it before a provider call and latched the current harness's integrity stop.

That last warm refetch is a real source behavior after failed primary, not a provider outage. The 15-mile eligible DOM still updated in 15.2ms; this demonstrates refetch intent and potential extra cost, not proved user-blocking latency. The verified serialized-error branch was exercised by the baseline failed outer patch. It must remain a warm-cache limitation in the decision evidence. The next benchmark-only revision will separate immutable cold completion from warm-refetch HOLD and block any warm acquisition before server dispatch, preserving request intent and ending only further warm probes. It will not change the product or turn that result into a zero-refetch success.

## Measurement defects found before live traffic

- Per-RPC timing incorrectly selected the last ResourceTiming entry by URL. TanStack requests reuse the same URL, so a later audit response could be assigned to an earlier primary. These R1 live-origin timing figures are not decision evidence. The correction binds each receipt to its exact Playwright request timing.
- One hybrid success case had a 2.49-second enabled-to-click gap. Its cause is not established by R1; this cannot be characterized as application unavailability. The next revision records navigation-return, first-loop, click-attempt, actual-click and return timestamps, preloads decoder modules outside timing, and separates driver scheduling delay.
- Browser observer CPU overhead was not separately measured in R1. A bounded cold/warm read/dispatch cost accumulator is required before using the warm responsiveness thresholds.
- Raw offline primary reconstruction dropped thrown-primary rows without an acquisition payload, potentially misclassifying recovery as baseline. The corrected analysis preserves all primary RPCs and distinguishes payload reconstruction from failure classification.
- Raw merged audit positives may differ from the application's admitted visible pool. The corrected usable-yield calculation is bounded by actual cold-final browser eligibility, with raw-response diagnostics retained separately.

## Next gate and boundaries

Review the minimal benchmark-only correction, freeze a new harness identity, and run a fresh zero-public-traffic integration preflight. Inspect actual rendered choices, warm-refetch classification, exact request timing, driver delay and observer cost before authorizing the single live execution.

No candidate runtime change, merge, deployment, production RPC, request-budget increase, failure-counter reset, or functional-acceptance waiver occurred. The historical 327-attempt incomplete live experiment and its HOLD remain preserved.
