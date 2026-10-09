# PR61 independent safety preflight R1: HOLD

Verified 2026-10-09 22:25–22:27 UTC. Exact remote PR61 is open/draft, head c931188a96752fcb97dac9066e530688f9aaef2a. Local clean materialization has tree ef30671a048d6463ded751efe974ee8f8303ed3a and sole parent fe22c15cc6442fc4a48fec23c9a1331c69d70bd2, matching owner-authorized nonproduction scope. No runtime/catalog/source changes or provider traffic by verifier.

## HYB-IV-01 — lifecycle-negative authority lost on capacity rejection

Release-blocking safety HOLD. In a hybrid session, acquire one positive Movies record from selected-radius primary. The core background audit then returns the same ID with lifecycle permanently-closed plus enough other rows to exceed the cache's per-response venue cap. createDateNightDiscoveryCache.store rejects the entire response before processing negative authority. The radial controller does not forward rejected OSM negatives: its core displayOnly filter retains only non-OSM missing-category rows. Hybrid receives no negative and retains the older primary positive as ordinarily eligible.

Independently reproduced at maxVenues=1 with two audit rows and at the actual default maxVenues=20,000 with 20,001 audit rows. Final snapshot is background-partial yet contains the original movie without lifecycle. This is not merely missing positive coverage: actual observed closure evidence was discarded while older positive authority remains displayed. The same source path should be examined for outer patches, cross-category aliases and subsequent cap eviction. Do not infer a passing negative gate from ordinary accepted-entry eviction tests.

Executable probe: probes.test.mjs, run from /tmp/hybrid-date-night-source with node --test /tmp/hybrid-independent-c931/probes.test.mjs. Exact results: probes-r3.log. Four probes: two upstream-abort PASS, two lifecycle-capacity FAIL. Parent must keep bounded live benchmark gated until a corrected immutable candidate independently clears this safeguard.

## Positive checks, separate from final clearance

77 existing exact-source tests PASS: date-night-hybrid-safety.test.mjs, date-night-radial-cache.test.mjs and date-night-cache.test.mjs; focused.log. These cover accepted negative entry/venue-cap eviction, alias/category/radius transitions, stale request guards and primary readiness. Additional independent server-handler probes launch multiple active grouped hedges before cancellation for primary and patched requests. Both abort all active signals, prevent subsequent mirror launches and leave zero pending deadline/hedge timers.

First independent probe revision supplied an extra halloweenActive input to the patch RPC, correctly rejected by its geometry validator; this was a verifier harness error, not a candidate cancellation defect. R2/R3 use the proper RPC shape and both cancellation probes PASS. Failed original probe log retained.

No claim of full exact-candidate verification, hosted/browser acceptance, live reliability or benchmark acceptance. Prior Track F remains MORE EVIDENCE REQUIRED with its documented request-counter reset protocol flaw. This preflight only establishes a concrete safety blocker plus narrow cancellation evidence. Source unchanged and git diff --check clean after probes.
