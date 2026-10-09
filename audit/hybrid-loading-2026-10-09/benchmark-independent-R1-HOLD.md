# Independent benchmark protocol R1 review — HOLD

Reviewed 2026-10-09 22:13–22:14 UTC. Live traffic remains blocked. Read-only verifier; no provider traffic, source remediation, runtime, main, or production mutation.

## Immutable reviewed inputs (SHA256)
- PROTOCOL.md: b727bdb552c5592e5f2627d3c5ff90c3e41f40665e33e2b671464a5532310d3d
- request-ledger.mjs: 413d4c1c1a020c769fd16b70d40e9890a699c3cc5c1f7f4effee33645ae04af1
- request-ledger.test.mjs: 3130e9382db3575aa0383588083031d02e76ad9fcc2a24de6335c3ac695a982e

Independent node --test run: 14 tests PASS, 0 fail. These tests do not establish the missing guarantees below.

## Reproduced blocking findings
1. Crash recovery bypass: create ledger, reserve attempt, finish it rate-limited; remove only the final stop row to simulate a crash between durable outcome and stop append; reopen the remaining valid hash chain. Observed stop=null and newReservation=2. Replay must reconstruct and latch historical terminal conditions before dispatch, including 429, failure/handler caps and elapsed deadline. A later success cannot erase a crossed terminal threshold.
2. In-flight wall limit unenforced: create ledger with maxWallMs=10, reserve one pending attempt, wait 30ms. Observed signal.aborted=false and stop=null. reserve/stage-only checks do not abort outstanding work at the deadline. Require an active watchdog, shutdown/disposal behavior and remaining deadline restoration on restart.
3. Physical-fetch integration absent in reviewed R1: ledger API alone does not establish that every retry, mirror, hedge and aborted physical fetch is metered. Require wrapper/integration review and tests before live traffic.

Both defect reproductions ran locally against temporary ledger files without provider traffic. The exact inline reproductions and outputs were returned to parent/researcher at 22:14 UTC. Author has separately preserved R1 inputs under hybrid-benchmark/r1-preserved; verify hashes before relying on those copies. This report preserves the immutable reviewed identity even if working files change.

## Protocol assessment
Bounded matrix and order balancing acceptable as proposed. Columbia 50-mile repeats AB/BA. Joplin50 AB and KansasCity50 BA provide cross-location order balance only, not repeated location-specific reliability evidence. This limitation is explicit.

A structurally valid empty provider response is a transport success, not a failure or proof of complete coverage. Wholly failed acquisition means no successful provider group. Partial failure remains disclosed. Expected losing-hedge/session cancellations neither count as provider successes nor clear failure streaks. Late outcomes cannot clear latched stops.

## Required next gate
Author remedies separately; fresh independent review of immutable R2 ledger, tests, fetch integration and live harness. No live provider traffic until budget/integration and candidate cancellation/negative-lifecycle prechecks PASS with exact identities. R1 HOLD remains historical evidence and must not be relabeled PASS by a later version.
