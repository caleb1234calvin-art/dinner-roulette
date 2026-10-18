# Independent PR84 source/network safety review

Reviewed baseline: 422bf4f352987d5d450ca14b7ef5898e7f300a66, tree 55a2baa9a476e4cc533dfd97dccf0b792a590350. Exact recursive tree untruncated; no AGENTS.md present. Baseline 26 mock fixtures passed independently under Node 24.19.0. All ten baseline changed files were isolated scripts/audit/workflow paths, with no app import found. No repository edits, live DNS, venue crawl, outreach, merge, deployment, or PR #82/main change performed by reviewer.

## Initial defects independently reproduced

1. Missing endDate was synthesized from startDate and falsely included in evidence fields; review queue advanced.
2. Explicit EventCancelled was lost; review queue advanced.
3. Conflicting same-name/address/startDate copies silently selected first endDate; review queue advanced.
4. Mutable registry URL during mocked fetch relabeled old-source HTML and polluted source-ID cache.
5. Invalid reviewedAt 2026-99-99 passed clearance.
6. An abort-ignoring injected transport outlived the six-second timer, then returned/cached success; body read and cleanup could similarly stall.
7. Repeated malformed script/title starts and unmatched '<' in source names caused quadratic regex work. Baseline 240 KB malformed script input exceeded a five-second child budget; 60 KB name exceeded remaining roughly 2.7 seconds in a four-second child budget.

Baseline source/reproductions are preserved at /workspace/shared/review-pr84-422bf4f/repro.mjs and repro-results.jsonl. These outputs remain the original failures, not final acceptance results.

## First candidate rejected, corrected R2 accepted

First frozen five-file diff SHA256 b56144cd6a913f3bf779711ff0c3d75d242791a7802f4693857f0383c5e9f5c7 passed 39 fixtures but review rejected it for introduced Unicode index drift from whole-HTML lowercasing. It also introduced malformed researchConcerns type errors. Further checks demonstrated preexisting false JSON-LD attribution from data-type/quoted attribute text and acceptance of malformed Tgarbage timestamps. All four issues were corrected in R2 and covered by new regression fixtures.

R2 frozen diff SHA256 965a2a0dcf38b591a845b8689a258c28611b5f55ace4c0da25c6769d3ff48b95. Exact file hashes checked against /workspace/shared/pr84-recovery-evidence/milestone1-freeze-r2-sha256.txt. Independent disposition: accepted for bounded OFFLINE prototype milestone only.

Independent R2 validation:
- 43 source fixtures passed (original 26 plus 17 new regressions).
- Original six diagnostic inputs re-executed against R2 source: missing end date stays unknown/HOLD; cancellation retained/HOLD; both conflicting rows visible/HOLD; URL mutation discards response and does not reuse old cache; invalid review day blocked; uncooperative fetch settles at deadline and late data discarded.
- Adversarial parser:512000 bytes repeated script starts about 6.7 ms; 448000 bytes repeated title starts about 5.1 ms; 60071 byte JSON-LD name with unmatched '<' about 1.1 ms on reviewer machine. Timings are diagnostics, not performance SLA.
- All proposal verified/publishable/Open Now flags remain false. All three real source policies remain blocked.

R2 does not establish capture freshness, complete revision-bound published/pending inventories, persistent negative lifecycle reconciliation, source permissions, or deployed egress safety. No production/live-source/merge/release acceptance. New exact-head hosted CI remains separate.

## Separate transport review

Independent isolated mocked acceptance at module SHA256 b1258ccde1b036c0144d6cb1294e7ab04634b891516f17be59eb765c35694a61 and test SHA256 e576d1e66822c99d473accef99de4a0559dcf943218e17da257e9051db4f9861. This is a separate new-file milestone and is not part of R2 five-file acceptance.

17 focused transport tests passed independently: default-deny/current exact-URL policy; DNS both families and conservative special-IP denial; numeric socket pin with original TLS/HTTP identity; no redirects/proxy/secret headers; strict MIME/encoding/headers/body bounds; total deadline/abort/cleanup/late events; policy mutation/revocation; global concurrency and host controls. Additional independently authored monotonic-clock checks passed exponential 10/20/40/80/160/300 second backoff across instances, success reset, reviewed 60 second robots interval, and 256-host capacity/expiry safety. The latter checks are in independent-transport-check.mjs beside this report.

No remaining blocker found within mocked transport scope. Actual socket/TLS/deployment egress and real-site permission verification are not established. Dedicated workflow must include new transport paths and test invocation; exact-head Node 22 CI required. Registry must remain disabled and adapter must not silently become default pilot transport.
