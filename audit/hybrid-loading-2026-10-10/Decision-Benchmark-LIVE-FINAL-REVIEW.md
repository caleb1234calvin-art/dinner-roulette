# Independent final live benchmark review

## Decision

**MORE EVIDENCE REQUIRED.** The sole authorized run stopped correctly at the fixed global consecutive-physical-failure threshold. It contains eight complete cases, one quiescent-partial case, one globally stopped case and fourteen unrun cases. The preregistered incomplete-matrix rule prevents ADOPT HYBRID or a complete-matrix KEEP RADIAL-V1 PRIMARY conclusion. This is a closed bounded experiment, not permission to resume, reset, increase the budget, or run a replacement. Existing production and functional/release decisions are separate.

## Exact evidence and verification

- Run: https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/38034143730 ; workflow run 3, attempt 1.
- Publication commit 103a093d600138e921a9c00bd46b53a241907a14; tree 4b317d20adf6d264cf3cdc77760ba2bd9810da60.
- Candidate c78b97175cc094436e454fa888e1ed83486f750d; baseline fe22c15cc6442fc4a48fec23c9a1331c69d70bd2.
- Frozen manifest a0acb0e4562f9e958c5a013a33abc6c16d59ff1e270d9c582959830aebe3eda5; approval 8dad0fd7b2b8b227d27923393a408ba5705eb23d1d988b326717217fd93410ed.
- Artifact 11662969953: ZIP 7,283,972 bytes; independently verified SHA256 1c2334c4998d5ad3f2cdd07b34485ad499befcc2e10def0319cc3a4bbba14903 and ZIP CRCs.
- Independently replayed 1,011 ledger rows and hash chain; final hash 3e30c07c6fe60d7d96348966c2c0e6595c8438a59807cb01899c28bb9740b469.
- 427 reservations and 427 outcomes, zero pending; every one of 274 retained provider bodies and 155 RPC bodies checked against recorded byte count/SHA256. Remaining aborted/timed-out responses have no complete body; transferred bytes before abort are unknown.
- No overlapping cases and no physical dispatch after stop. Maximum concurrent physical attempts was 3. One config record, one stop record; no reset or increased limits. Final source identity checked.
- First dispatch 2026-10-10 07:23:35.211 UTC; stop approximately 07:32:25.352; terminal 07:32:25.706. Fixed 1280-attempt/45-minute ceiling was not exhausted; consecutive failures stopped the experiment earlier.

## Failure and terminal accounting

Physical outcomes: 152 successes, 147 neutral hedge aborts, 122 failures and 6 timeouts. Zero rate-limit outcomes. Failures/timeouts are 128/427 physical attempts (30.0%); this is not the user-facing failure rate. By arm: A 209 attempts, 74 success, 72 abort, 60 failure, 3 timeout; B 218 attempts, 78 success, 75 abort, 62 failure, 3 timeout. Descriptive failure/timeout fractions are 63/209 (30.1%) and 65/218 (29.8%), too small and provider/time-confounded for a reliability conclusion.

The last eight physical outcomes span Kansas City A core and B primary: each has one HTTP 500 from private.coffee and three timeouts. The ledger preserves the cross-case failure streak. There are two wholly failed provider-dispatched acquisitions. A subsequent B audit core RPC is denied by the global stop with zero physical dispatch; it produces the third whollyFailed handler receipt and terminal handlerFailures=3. That third receipt is neither an additional failed provider acquisition nor an observed audit recovery attempt.

A Kansas City case ends quiescent-partial with no eligible Movies. B ends global-stop with no eligible Movies. Both have no actual usable Pick/Options/Plan; neither receives a fabricated latency or completion. Among five started cases per arm, four are usable and one unusable/censored. Each arm has seven additional unrun planned cases. Eight of 24 planned cases completed; ten of 24 started. Do not report eight complete as a 100% success rate.

## Actual cold browser outcomes

Times below are milliseconds from browser navigation time origin. Pick means actual correct rendered output after a trusted click, including ordinary animation. Live pool requires actual provider affirmation. A denotes radial-v1, B hybrid. Medians use the two completed repetitions per arm in each block; they are descriptive, not statistical significance.

| Block | A actual Pick median | B actual Pick median | B minus A | A first live eligible median | B first live eligible median |
|---|---:|---:|---:|---:|---:|
| Columbia 20 mi | 6357.20 | 6811.85 | +454.65 (+7.2%) | 4531.55 | 4992.80 |
| Joplin 50 mi | 5820.50 | 2955.25 | -2865.25 (-49.2%) | 3971.25 | 8098.20 |

Joplin B's faster Pick is a genuine usable early choice from two curated eligible venues, Route 66 Theater and 66 Drive-In Theatre. It is not an early provider result. First four eligible venues arrive at 8347.0 and 7849.4 ms in B versus 3989.7 and 3952.8 ms in A. B's Options was clicked earlier with two eligible venues and correctly rendered two; its later actual four-card interaction is unmeasured. This is not a false four-option pass or proof of a product failure. A actually rendered four Options at 7580.9 and 7444.7 ms. Columbia has only three eligible venues in every completed case, so four Options is inapplicable.

All eight completed cases rendered truthful no-seasonal-pair Plan output. Genuine pair usability is unmeasured, not a Plan success. Kansas City has no usable control observations. Screenshots independently inspected for Joplin B's usable Pick and two options, and A's actual four options.

Final eligible identity sets agree across both arms/repetitions: three Movies in Columbia 20, fourteen in Joplin 50. This demonstrates parity for these observed blocks, not complete recall against ground truth or across the unrun matrix.

Cold driver eligible-enabled-to-Pick-attempt lag is 37.5–95.7 ms across usable cases, within 250 ms. Observer cold p95 is at most 1.0 ms and max at most 36.9 ms, within preregistered diagnostic gates. All rows report no observer/driver confound or integrity error. Exact request-bound RPC timing is retained and ordered. Therefore the measured differences are not explained by the known R1 shared-URL timestamp or driver-delay bugs.

Open-decision snapshots show a stable Pick across a subsequent patch in both Columbia arms and Joplin A. Joplin B's provider settlement occurs after the driver has already moved to no-pair Plan, so this live run does not freshly verify its Pick across provider enrichment. Options did not overlap retained settlement snapshots. Do not broaden these observations into a new all-control stability claim; prior functional evidence remains separate.

## Successful-primary audit yield, recovery and costs

All four completed B primaries succeeded. Their actual observed pre-audit pools and final pools match: Columbia 3→3, Joplin 14→14. Independently compared identities; no final eligible identity is absent from primary eligibility. Marginal useful audit additions are zero across 199 audit physical attempts (15+14+82+88). There is therefore no observed geographic omission or extra eligible venue to explain in these successful-primary cases. This does not establish that audit is universally unnecessary. Raw merged-response diagnostics remain distinct from actual visible-pool yield.

The sole failed live hybrid primary is Kansas City and triggers the global stop before any audit physical dispatch. Its recovery time/yield is censored. R2 fixture recovery and earlier failed-primary/recovered-nine results are preserved as different evidence, not relabeled successful-primary marginal benefit.

Matched complete-block costs:

| Block | A physical attempts | B physical attempts | B/A | A retained body bytes | B retained body bytes | B/A |
|---|---:|---:|---:|---:|---:|---:|
| Columbia 20 | 29 | 36 | 1.241 | 11968 | 16548 | 1.383 |
| Joplin 50 | 176 | 178 | 1.011 | 84044 | 95702 | 1.139 |

All started-case totals: A 209 attempts/96,658 retained bytes; B 218/112,896. Body byte counts omit unknown partial bytes from 75 A and 78 B aborted/timed-out attempts. Completed block costs are within preregistered attempt/body thresholds but cannot establish matrix-wide acceptable cost.

Offline exact-source CPU replay is post-traffic Node work, not browser latency. Joplin merge/identity-dedupe medians: A 5.406/5.381 ms, B 8.238/8.273 ms; p95 A 5.894/5.940, B 8.730/8.873 ms. Raw retained rows A39 versus B76 merge to the same 37 response identities, reflecting extra duplicate work. Joplin clip medians remain about 0.006–0.007 ms; clip+decorate+eligible medians A0.819/0.896 versus B0.853/0.936 ms. Columbia merge medians A0.130/0.069 versus B0.169/0.150 ms. These are small costs and are not conflated with provider wait or rendered Pick timing.

## Warm cache observations

Eight complete cases each performed five warm probes: 20 observations per arm, all zero-refetch. Eligible DOM latency median/p95/max: A13.90/31.50/31.70 ms; B14.35/63.80/64.60 ms. Both p95 values are below 100 ms. Actual warm Pick interaction-to-render spans A1754.8–1791.0 ms, B1751.2–1779.6 ms because normal animation remains. Warm data are separate from cold performance. Failed Kansas City cases skip warm probes. The R2 failed-primary 20→15 refetch-required HOLD remains preserved; successful-primary warm passes do not erase it.

## Smallest unresolved evidence and disposition

Only Columbia 20 and Joplin 50 have complete counterbalanced blocks. Kansas City 20 lacks its second B/A pair; Columbia 50, Joplin 20 and Kansas City 50 are entirely unrun. Thus neither radius has the preregistered three-city comparison. Live failed-primary recovery after the stop and B's later four-card interaction are not measured; genuine Plan pairs are absent. These precise gaps prevent the adoption decision. No open-ended rerun or tuning is recommended or authorized by this review. Preserve this terminal result and retain the current primary pending any separately authorized, specifically bounded decision about those gaps.

Prior counter-reset NOT PASS, prior exit-13/unsettled partial, hosted R1 failure and R2 warm failure-path limitation are not superseded or deleted by the clean stop/accounting here. Functional PASS remains separate; no merge, deployment, source change, or research action follows.

### Additional denominator and dispersion clarification

Observed hybrid primary failure rate is 1/5 started hybrid primary acquisitions (20%): four successful completed primaries and the failed Kansas City primary. Recovery after that failure is unobserved/censored, not infinite. The zero-dispatch stopped audit is excluded from this primary denominator. This five-case descriptive rate is not a reliable population estimate.

Actual cold Pick navigation-to-render dispersion (median / minimum / maximum, ms):
- Columbia 20 A: 6357.20 / 6318.30 / 6396.10; B: 6811.85 / 6616.70 / 7007.00.
- Joplin 50 A: 5820.50 / 5774.80 / 5866.20; B: 2955.25 / 2947.20 / 2963.30.
- Kansas City 20 A/B: no usable rendered observation; preserve the two partial/stopped rows rather than compute latency.

The current 48-test benchmark-harness PASS validates benchmark mechanics. It is separate from the previously closed 1,059-test application functional PASS; neither is evidence of live performance superiority.
