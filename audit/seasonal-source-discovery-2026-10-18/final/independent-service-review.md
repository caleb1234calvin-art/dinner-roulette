# PR84 isolated research service: independent review

## Disposition

Accepted for isolated, mock-only service development at the exact R1 freeze. All 104 repository fixtures passed independently, plus 10 separately authored adversarial tests. No remaining blocker was found within this scope. Real-source access remains zero of three approved leads; the checked-in registry remains disabled. This does not approve source activation, runtime integration, promotion, merge, deployment or production use.

Baseline: foundation commit `98915d0eee7b3ec0096f6148d13e7fa551b2bdca`, tree `c834d3954033297e1e3ce428416ce12591dbdf2f`. Service candidate: six files, proposed tree `26725dfcfe2de5e82f49cda02b9ec49addb421ce`, diff SHA-256 `b777ab201ec662254e853806d2807da0105c707029d9724a74d06cfc21ca8c81`. Exact file hashes are in `reviewed-file-sha256.txt`, verified unchanged after execution. Remote publication/readback and exact-head hosted CI remain separate gates.

## Independently exercised assertions

- Full mocked strict transport → captured HTML → source parser/provenance → immutable inventory validation → conservative triage. All returned proposal flags stay false.
- One canceled coalesced caller does not abort its peer; last-caller abort destroys the transport and prevents a late response from filling cache. A subsequent admitted call receives newly fetched bytes.
- Cached captures are re-triaged for a later local day; an expired identity receipt blocks reuse without another request.
- Policy revocation invalidates cached work; policy mutation and identity-receipt expiration after awaiting a response cannot return usable evidence.
- Negative observations survive eight-entry positive cache eviction. Cross-source matches survive a changed address or changed name, respectively, through exact normalized name OR address matching.
- Empty, malformed and output-truncated captures conservatively latch source uncertainty, including after a changed policy URL.
- Subscriber 33 cannot expand the bounded operation or cancel the 32 admitted subscribers.
- The 65th negative observation and 17th uncertain source latch a global research HOLD; subsequent requests do not perform more network work. Existing negative authority is not evicted.

These assertions ran in `independent-service.test.mjs`, using independent EventEmitter-based DNS/HTTPS mocks and no live networking. `independent-adversarial-tests.log` records 10/10 PASS. `independent-combined-tests.log` records 104/104 PASS across seven repository test modules.

## Source review

The service constructs the strict production transport internally. The separately named test factory requires both DNS and HTTPS mocks; no caller-supplied URL, complete capture, transport or inventory can bypass that path. The seven-line transport inspection amendment invokes the unchanged strict current policy guard, returns frozen scalar metadata and has no DNS, request or rate-ledger effect. Its prior 19 retrieval tests plus two inspection tests passed independently, and retrieval logic is unchanged.

Raw captures only are cached, limited to eight entries and six hours. Policy fingerprints include source identity, exact URL and complete clearance. Current policy, immutable inventories and clocks are checked at admission, after waits/cache reads, and after analysis. Coalescing is policy/URL-bound and subscriber cancellation removes listeners. Negative and uncertainty stores are separate from positive cache and fail closed at fixed capacity.

The service preserves evidence origin and qualifies its authority as an observed research conflict. Pinned known aliases/IDs can expand exclusion matches; this never renames, merges, asserts closure or authorizes publication. The implementation explicitly labels state as service-instance-only. Empty captures latch uncertainty even when the parser emits no proposal, closing the integration risk identified during the foundation review.

The dedicated mock workflow includes the seventh service test file and still asserts the exact candidate checkout. No application endpoint, CLI auto-run, scheduler, dependency addition or runtime import was added.

## Preserved limitations

- Negative state is not durable across service construction or process restart. There is no persistent lifecycle store or clearing authority.
- Complete identity membership is for the pinned 92 published / 20 pending historical snapshot, plus Acres HOLD. The seven expired published identities are retained; pending factual-source checks remain due or overdue. The receipt expires at 2026-10-18T19:41:16.000Z and then fails closed.
- Missing event status remains explicitly unknown. Captured bytes and a fresh timestamp do not independently establish venue operation, source truth, legal clearance, exact hours or local timezone correctness.
- Name/address/retained-alias matches are conservative exclusion leads. Broader geographic, fuzzy-identity and worldwide alias completeness are outside this isolated milestone.
- Real DNS/TLS/egress deployment behavior, independently permitted operator fixtures, factual refresh, runtime/UI behavior and production acceptance remain unproven.
- The first author service test run's 200ms fixture deadline failure is retained. The subscriber test now uses the existing six-second production maximum; production limits were not enlarged. The independent 32-subscriber test also used that existing maximum and completed in under one second locally.

No repository source was edited by this reviewer. No real venue requests, operator outreach, listing promotion or production actions were performed.

## Final immutable publication readback

Independently fetched PR84 head `9eb1b85c503d900993e6ab0d0e5797fd7bcacfb4`, still draft/open. Its tree is the accepted `26725dfcfe2de5e82f49cda02b9ec49addb421ce`, sole parent `98915d0eee7b3ec0096f6148d13e7fa551b2bdca`. All 21 research file bytes in the independent snapshot, including all six successor files, have Git blob hashes matching the immutable remote tree. The full recursive tree was untruncated and contains no AGENTS.md. All 21 PR changed paths are confined to the source research scripts, audit material and dedicated mock workflow. Evidence: `independent-published-readback.json`.

Fresh read-only main/PR82 checks confirm main remains `c3208d9fdc9a21d698efa9254be1286f5d3d2836`; PR82 remains draft/open at `cf18ff1c5a56ecf59f8006d4f7c83fb289f393df`, tree `6300c1061a790d84447bb92166f340aec895757b`, matching the prior canonical continuity record. The independent reviewer performed no remote mutation. Hosted CI remains separately owned by the exact-head CI reviewer; no earlier hosted PASS is transferred to this new commit.
