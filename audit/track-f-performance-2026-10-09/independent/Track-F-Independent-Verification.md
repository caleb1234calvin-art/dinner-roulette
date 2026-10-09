# Track F independent audit verification

Reviewed 2026-10-09 21:56–21:59 UTC. Fresh verifier; no author remediation, live provider traffic, runtime edits, repository publication, main/production/settings changes. Local deterministic replays wrote only to this independent evidence directory.

## Verdicts

- **Audit evidence integrity and bounded reporting: PASS.** This accepts the report as a truthful, reproducible limited audit, including its disclosed protocol deviation and missing evidence. It does not certify complete execution of the original comparison matrix.
- **Architecture choice / production replacement: HOLD — MORE EVIDENCE REQUIRED.** The recommendation is justified. No replacement implementation or release is approved by this verification.
- **Strict live stop-protocol compliance: NOT PASS.** The consecutive-failure counter reset between stages. Failed Joplin selected50 followed by failed Columbia selected20 did not stop the global experiment as the original protocol implied. This is explicitly retained in the final report. The 240-request ceiling was not exceeded: 40 fetches total. Do not silently upgrade this separate result because report quality passed.
- **Browser-real-use/mobile performance: INCONCLUSIVE / NOT MEASURED.** Handler/controller results cannot establish input-to-render, deployed RPC, Vercel cold-start, Android, or high-density browser memory performance.

## Immutable reviewed objects

- Source commit fe22c15cc6442fc4a48fec23c9a1331c69d70bd2, tree 8d5059c9fee871c522616971cce0a80b153e4d23. Independently read Git identity and clean tracked worktree at /tmp/track-f-source; all 328 source-manifest file hashes match.
- Final author report: track-f-radial-audit/Track-F-Performance-Audit.md, SHA256 **ffdaa34c41f17ae6e134187661bcbae2571936f5567f6694ca9878d2da42bfbb**.
- Author SHA256SUMS.json: **afc8faeb0f7b31dca66ee633a72d5d0518e5a9e2b510ad739eb2ad437bce3140**. All 43 listed file sizes/hashes match. Preserved R1 report and manifest remain historical.
- Source safety review: track-f-safety-review/Track-F-Architecture-Safety-Review.md, SHA256 **b162003e1c8e65ca88171a30c2f4be4bfa1c4ceca1ab3e4d6ae3e403d3778761**.
- Main/production and aliases were not independently queried by this verifier; lead's source-bound baseline is reported provenance, with final authoritative readback owned by coordinator.

## Independently verified evidence

1. Inspected exact application module loader: application validators, query builder, provider logic, controller/cache/identity/eligibility are actual source; TanStack transport is stubbed. This is not an HTTP RPC or browser benchmark. Existing no-patch handler is a valid backend alternative probe, not a completed alternative client implementation.
2. Replayed the controlled 108-run matrix in separate output paths. All 17 deterministic fields matched on all 108 rows: locations/modes/radii/designs, first useful virtual time, completion time, handler and fixture request counts, raw rows, eligible unique IDs, category sets, response bytes, no-refetch counters and completion flags. All 36 matched groups retained exact eligible-ID parity. CPU samples are intentionally not exact-equality comparisons.
3. Recomputed 78 query/body SHA256 and body-size checks over all 40 physical request receipts: all match. Outcomes are seven HTTP200, ten HTTP500, two HTTP504, eleven TimeoutError, ten AbortError. Losing-hedge aborts are not provider failures. Seven acquisition rows include radial multiple-patch work and cannot be used as a statistical randomized failure-rate sample.
4. Verified offline Columbia radius replay: 150 observations, upper-median 0.690812ms, selected p95 index142 3.296764ms, maximum10.888077ms. Fifty-mile live result clipped to20 has exactly the same three IDs as radial20. Full50 has nine eligible IDs. Response JSON15,965bytes. Node heap estimate24,797.36bytes/cache is correctly qualified, not browser heap, peak usage or scale proof.
5. Replayed cancellation probe: patched request abort at100ms terminates its one attempt; unpatched request ignores caller abort and continues four attempts until12,500ms. This supports a required cancellation adaptation; it does not by itself validate location-change UI behavior.
6. Replayed unpatched negative-eviction probe: permanent-closure evidence is present before eviction and absent afterward. This is a real cache-transfer safety gap under the synthetic maxEntries2 setup, not a demonstrated regression in current radial production.
7. Reviewed 155-test and247-test logs and source safety mapping. Their PASS results are existing-source focused regression evidence; verifier did not re-run all402 or any full/browser suite. These results cannot be transferred into approval of an unimplemented one-shot client.

## Metric coverage and limits

- First useful/full-radius: measured directly for executed handler/controller cases; complete50 radial live result missing. Initial Joplin radial covers only15-mile core, not complete50.
- RPC: reported counts are handler-call/RPC-equivalent counts; actual transport overhead absent.
- Provider attempts/errors/timeouts/fallback: exact raw receipts preserved. Fallback is not successful acquisition; failed/empty/unknown recall are distinct.
- Venue count, unique IDs, category coverage and duplication: finite fixture42 inputs, eight activity types/five bands, overlap duplicate and negative evidence;36 exact-set comparisons support known-fixture parity only. Live modes cover Movies only; broad live Anything/seasonal/mixed category coverage is unmeasured.
- Cache/radius changes: local larger-to-smaller and within-successful50 reuse demonstrated. Selection of new categories, unsuccessful groups, TTL/version/season/location and eviction cannot inherit complete coverage.
- Cancellation/location change: explicit server abort probe plus existing source tests/safety review. Performance callbacks themselves ignore controller signal. No full alternative-client race/location-change acceptance exists.
- Memory: one small live payload, controlled payload sizes and Node retained-cache estimate. High-density/large payload browser CPU/heap remains unmeasured.
- Curated-first: zero virtual delay is assigned after checking local eligible catalog membership. It is a modeled design opportunity, not measured delivery/render latency or a shipped feature.
- Fixed clock: eligibility uses October9; virtual helper patches Date.now, not Date constructor. Handler actual run date is also October9; future reproduction must freeze both consistently.
- Sequence/confounding: initial and matrix live runs are sequential, unequal radii and provider cache unknown; no randomized repeat or meaningful comparative timeout probability. Columbia20 failed before radial20 and50 succeeded. Larger radius alone does not explain observed success/failure.
- Stop deviation is retained without additional traffic to compensate. No nationwide/provider transport investigation or source simplification is warranted by these results.

## Conclusion

The measured scheduling overhead (32 radial handler calls and30,450ms virtual completion versus one call/100ms in the controlled50-mile case) is reproducible. The live successful Columbia pair is promising but insufficient to choose a replacement. Exact-radius clipping, current-policy/identity/lifecycle/expiry/Open Now/navigation/saved safeguards remain mandatory and mostly reusable independently of sectors. Patch-gated abort and negative retirement require separately reviewed adaptations before replacement acceptance.

Approve this frozen audit as bounded evidence supporting **MORE EVIDENCE REQUIRED**, retain architecture replacement HOLD, and publish/read back the stable continuity checkpoint. No new live traffic or implementation is required to close this audit. Any next performance candidate must be separate, explicitly scoped and independently validated; this review does not authorize it.
