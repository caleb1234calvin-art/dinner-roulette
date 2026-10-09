# Date Night primary + radial audit benchmark — exact a4f43e9

## Recommendation

**MORE EVIDENCE REQUIRED.** Do not promote this candidate on the basis of these measurements. Controlled experiments support fast broad-primary availability and real omission recovery mechanics. The bounded live sample does **not** establish a usable 50-mile primary improvement: both measured hybrid 50-mile primary acquisitions failed, and the audit supplied the usable results. A material cached-radius CPU cost and an incomplete live matrix remain. Architecture, runtime safety, benchmark protocol integrity, browser acceptance and release approval are separate gates.

## Immutable scope and preflight

- Baseline: `fe22c15cc6442fc4a48fec23c9a1331c69d70bd2`, tree `8d5059c9fee871c522616971cce0a80b153e4d23`.
- Measured candidate: `a4f43e9b886764592053a53652dc91602749ba11`, tree `44929e3f3d0b6ba2e4dd366de847b952388f9cb3`, parent `c931188a96752fcb97dac9066e530688f9aaef2a`, Draft PR61.
- Fresh 22:40 UTC connector read: remote main exact baseline; PR61 open/draft exact candidate; pickforus.app resolves to `dpl_8xyE9R3BxyE1883QpavaEBWV2LGa READY`, source baseline. Production was never queried for acquisition/load testing or changed.
- Independent benchmark-safety entry: cancellation and lifecycle-negative PASS, report SHA256 `1bbd19fe998e932c00c49ef789ce4b804a0348f40e4952e14c8ed34c3baea23c`. This does not imply full candidate/release PASS.
- Independently reviewed physical-metering R4 harness manifest: `3b98814075f2b1359f228cf36a3d4368987c82d26749cb6806061bb41277ddde`, 26 tests PASS. Review report `3aa8cc8722340bb24ff31056e93fb36012850bd8777a3d4240fa470d4a5c9fbc`.
- Worker-owned immutable checkout `/tmp/hybrid-benchmark-a4f43e9`; baseline `/tmp/track-f-source`. Source-file manifests match before/after controlled and live work. Both use unchanged package-lock SHA256 `462f09bd3fda35cf30646b2f343cd8d2a65340a63b59222b5f9d57084d9aa4b3`, Node24.19.0.
- No PASS or measurement transfers automatically to a later candidate, including a UI-only remediation. Complete input-diff review must establish any retained applicability.

## Controlled exact-code comparison

288 runs; three public city centers (Joplin, Columbia, Kansas City), radii15/20/50, Anything/Movies/mixed Movies+Park/seasonal fixture modes, parity and primary-omission fixtures, ABBA order. Actual source handler/controller/identity/cache/policy functions run with transport stubs and fixed100ms provider fixtures; Date and Date.now consistently October9,2026. This is virtual time and finite fixture coverage, not browser timing or live provider recall.

All72 matched groups completed and retained identical final eligible IDs. Controlled source hashes are unchanged. Primary omission fixtures intentionally include a primary way-ID followed by an audit canonical node-ID; actual identity merging prevents counting a canonical replacement as a genuinely new attraction.

| Radius | Radial complete | Hybrid primary | Hybrid full audit | Movies requests A/B | Anything requests A/B |
|---|---:|---:|---:|---:|---:|
|15mi|100ms|100ms|200ms|1/2|4/8|
|20mi|3,450ms|100ms|3,550ms|5/6|20/24|
|50mi|30,450ms|100ms|30,550ms|32/33|128/132|

These are comparisons of broad primary acquisition versus full geographic coverage. **Baseline first useful results/READY were already100ms.** Hybrid first useful/READY were0ms where a qualified curated pool existed, otherwise100ms. The experiment therefore does not prove a noncurated first-interaction speedup, and does not justify portraying the old controller as always blocked until radial completion.

Audit yield:
- No-omission fixtures: zero additional unique eligible venues. The audit still adds requests and completion time.
- Deliberate omission fixtures:0–13 genuinely additional eligible identities per case,0–0.5 additional identities per physical fixture audit request. Per-record recovered categories and bands/sectors are retained in case artifacts.
- These show recovery mechanics, not population recall or a claim that live broad queries routinely omit this fraction.

### Covered-radius CPU measurements

576 local radius updates after complete50-mile coverage, with zero extra RPCs. Direct Node controller/caching/eligibility processing, not browser render/mobile timing:
- Baseline288 updates: median0.569ms, p9530.996ms, maximum87.328ms.
- Hybrid288 updates: median6.716ms, p95139.521ms, maximum370.673ms.

Do not describe all covered radius changes as instant. Anything/policy-rich pools expose meaningful additional local work. Payload serialization and per-case counts are retained; this test does not establish large-city/phone memory behavior. The separate bounded instrumentation diagnosis is explanatory only, not an acceptance timing result.

## Live bounded comparison

Actual baseline/candidate handlers and controllers, cold application caches, provider cache unknown, Movies only. Public Columbia center, not owner-device coordinates. No production RPC, browser transport, Vercel cold-start or physical Android timing is measured. The exact fixed four-mirror provider abstraction was retained, including every hedge/retry. The preregistered matrix also included Joplin/Kansas City and20-mile cases, but they were **not reached**.

Started22:40:57.288UTC; last ledger event22:48:44.806UTC. **327 physical attempts and327 outcomes**, zero unresolved attempts. One append-only hash-chained ledger spans every stage; no counter reset or replacement run occurred. Ceiling384 was not reached. No429. No global failure-cap stop was triggered.

Outcomes:131 valid provider responses (including valid empty responses),26 HTTP failures (24HTTP500,2HTTP504),15timeouts,155losing-hedge aborts. Expected hedge aborts are not provider failures.136 handler acquisitions:131 with successful provider group,5 wholly failed. These numbers describe this sample, not broad provider reliability.

### Seven finalized cases, followed by an unfinalized eighth

|Case|Radius/design|First usable pool|Primary settlement|Final acquisition/audit|Eligible IDs|Physical requests|Status|
|---|---|---:|---:|---:|---:|---:|---|
|0|15 A|none|n/a|12.582s|0|4|partial failure|
|1|15 B|6.470s|6.462s|18.983s|3|8|primary successful; audit partial|
|2|15 B|6.822s|6.819s|14.623s|3|8|complete|
|3|15 A|7.722s|n/a|7.722s|3|4|complete|
|4|50 A|6.112s|n/a|94.987s|9|73|complete|
|5|50 B|19.820s|11.966s, failed|97.547s|9|75|audit complete after empty-eligible fallback primary|
|6|50 B|19.483s|12.505s, failed|99.198s|9|76|audit complete after empty-eligible fallback primary|

All completed50-mile final pools had the same nine movie IDs. **Both50-mile one-shot primaries supplied zero eligible movies.** Their early terminal `ready` state around12s was not usable READY; the first useful movies arrived from audit around19.5–19.8s. This exposed a truthful-UI issue separately sent to the implementer; this report does not claim it fixed on a4.

Live audit contribution:
- Case1:0 new eligible identities/4 audit attempts; audit failed after successful primary.
- Case2:0/4, successful audit duplicate coverage.
- Case5:9/71 =0.126761 per audit attempt.
- Case6:9/72 =0.125 per audit attempt.

Cases5/6 demonstrate **failed-primary recovery**, not proof of spatial omission in an otherwise successful broad response. All audit attempts, including failures/hedges, remain in the yield denominator. Raw groups, duplicate identities, patch ownership, category/band recovery and bodies are preserved.

### Terminal harness failure and partial case7

The eighth started case was reverse-order50-mile baseline A. Its327-global-attempt run ended with **exit13: unsettled top-level await**. The harness only recognized baseline `coverage.complete || paused`; the real radial controller can instead become quiescent partial (`loading=false`, `expanding=false`, `paused=false`) after every patch has been attempted but one failed. The unreferenced watchdog did not keep Node alive in this quiescent state. This is a benchmark termination defect, not evidence that the application should claim complete coverage.

Case7 raw ledger proves79 physical attempts,32 handler acquisitions, one failed patch `radial-v1:20:0`, and all physical outcomes accounted. The exception-handler row omitted its patch ID; the derived artifact explicitly maps it to immediately preceding same-case request metadata in sequential RPC execution. Its **final eligible count, first usable callback time and completion time remain unknown**, not invented from the prior cases. Seven prior finalized case artifacts remain valid within their disclosed scope. Raw `results.json` is the last successful snapshot and therefore lists case7 as unrun; the terminal summary supersedes that classification only: case7 started but was not finalized, and cases8–31 never started.

No restart, new ledger, counter reset, compensating traffic or budget expansion followed. Parent explicitly stopped live work. The original live evidence is not modified to look complete. The original Track F counter-reset failure also remains recorded in history and is not retroactively repaired by this run.

Offline actual-baseline reproduction confirms the quiescent partial state with one failed20-mile patch and no provider traffic. Future harness correction should recognize quiescent incomplete termination, persist per-case states while running, and retain a process-liveness watchdog. **That future fix was not used to repeat the live run.** Budget/accounting tests PASS remains distinct from complete live benchmark protocol HOLD.

### Timing confounds and unmeasured scope

- Initial15-mile A1/B1 overlapped the controlled CPU run until22:41:19UTC. Do not use that comparison to assert a speedup.
- Second50-mile B overlapped a bounded instrumented CPU diagnosis22:45:10–22:45:39UTC. First50 A/B preceded that diagnosis. All observations retained.
- ABBA order was preregistered;15-mile block finalized,50-mile block's final A remains incomplete/unfinalized. Do not claim a completed repeated50-mile balanced comparison.
- Live Joplin/Kansas City,20 miles, Anything/mixed/seasonal modes, non-Missouri control, live browser timing and population recall remain unmeasured. Controlled fixtures cover the three cities and requested category/radius modes separately.

## Offline real-payload cache replay

760 network-free views of four actual hybrid PRIMARY payloads on exact a4 cache/policy code. The two successful15-mile primary payloads were9,928 serialized bytes, stored with valid Movies authority; per-case direct cache/eligibility median0.148ms and0.219ms. The failed50-mile fallback payloads were **not admitted as coverage** and retained missing Movies authority. Their fast empty reads are not a successful50-mile session cache or usable radius-change result.

This lower-level cache replay excludes the full session's repeated merge/publish/browser work and must not be substituted for the controlled session CPU cost above. No exact retained heap claim or phone-memory guarantee is made.

## Gate summary and next action

- Controlled finite parity/recovery: PASS for exact a4, pending independent result review.
- Source integrity before/after measurement: PASS.
- Mandatory runtime safety entry: independent PASS for exact a4, separate from complete candidate acceptance.
- Global request accounting/no-reset:327/327 preserved, limits not exceeded; independent result review pending.
- Complete live benchmark protocol: HOLD, terminal harness failure and missing cells.
- Usable50-mile one-shot speedup: **not demonstrated**; both measured primaries failed.
- Broad comparative reliability/recall: MORE EVIDENCE REQUIRED.
- Browser, full current candidate, release readiness and any later UI remediation: separate parent-owned gates. No merge/deploy authority.

Freeze this evidence, complete independent review, preserve the performance limitations in canonical continuity and return the bounded architectural decision. Any future live measurement needs a separately reviewed corrected protocol and explicit continuation decision; this run does not silently resume. Missouri/Cadaver remains parked.
