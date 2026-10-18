# PR84 foundation independent review

## Current disposition

Scoped offline acceptance for the final R4 foundation freeze. All 17 frozen file hashes were independently checked before and after review; 87/87 six-module fixtures passed. Independent before/after reproductions verify that all three known-alias cases now hold with the correct canonical IDs and alias basis, and node-51/block-13 cancellation truncation now holds all returned positives with bounded-parser-incomplete. The two initially discovered integration defects are corrected. No remaining blocker was found for this isolated research foundation. No live source, runtime eligibility, hosted CI, merge or deployment approval is implied.

## Independently established source identity

Candidate baseline is PR84 `b99fad7c6b43613569e157c9f151e6d3f1447321`; the reviewed initial successor diff was `575236338ede6ee706dfed5f585144c48eb38ae217358389c38cb09b58c57a9f`, proposed tree `4a667e61feb27a62a8af6ff385d20713fb5e1b4e`. That initial freeze and R3 were superseded after the reproduced integration gaps. Final accepted R4 diff SHA-256 is `2ef51e54099ebc6997653227cd962d160665f0416da39653f66ef253ca4f7e3c`; proposed tree `c834d3954033297e1e3ce428416ce12591dbdf2f`. Exact final file hashes are in `reviewed-file-sha256.txt`. Final remote commit/head readback and hosted exact-head CI are still pending.

GitHub read-only API reads independently confirmed these exact source commit/tree pairs:

- Main `c3208d9fdc9a21d698efa9254be1286f5d3d2836`, tree `c36112156cd11baefb6671194f0d59b9c181c2a3`.
- Recovered pending authority `d0f09d4c20938a40dab70c96bc8bd53ba598bebd`, tree `c928c1d20b2a25d1d0ccd27def53b087ec574e56`.
- Later continuity observation `442ca356979e637601ef317fc020a87e957991d6`, tree `3f6d2bb8c52f61c86538a237e3885deb42338168`.

All three independently fetched recursive trees were untruncated. All 31 manifest source bindings were verified using local captured source bytes against those independent remote Git blobs, byte counts and SHA-256 digests. Relevant pending blobs were also checked unchanged in the later continuity tree. This is immutable historical membership, not a live-current-source promise.

An independent TypeScript AST data-literal parser extracted all 18 arrays imported by curated-policy, verified 92 unique published IDs and their source-file membership, and compared identity/address/website/location/season/date/lifecycle fields and all retained aliases to the source-bound inventory. No repository TypeScript was executed. All 20 original pending canonical record hashes matched the recovered ledger. The seven exact-instant-expired published identities remain present, all 20 pending factual revalidation dates are due or overdue at the observation, and Acres is a separate HOLD negative with unknown lifecycle, not a closure assertion.

Evidence: `independent-source-verification.mjs`, `independent-source-verification.json`, `independent-remote-trees.json`.

## Validation boundaries reviewed

- Module-pinned manifest byte hashes, full canonical inventory hash, record and negative hashes, counts 92/20 and negative counts 0/1.
- Six-hour half-open identity observation receipt; invalid clock, before-observation, expiration, missing data, changed authority, mutated data, duplicates and forged completeness fail closed.
- Detached deeply frozen successful identity snapshots; no caller arrays accepted as completeness authority.
- Exact UTF-8 capture digest/byte count, explicit unverified caller-input authenticity; block/node/field pointers and observed-versus-normalized scalar provenance.
- Strict UTC/calendar timestamps, future-capture rejection, six-hour capture-age HOLD, missing destination-local-day HOLD. Age is not factual revalidation.
- Exact candidate-SHA workflow checkout/assertion and all six fixture modules; hosted exact-head CI is a separate pending gate.
- Unchanged transport module `b1258ccde1b036c0144d6cb1294e7ab04634b891516f17be59eb765c35694a61`, tests `01da2150b3dbccb617bf17a443520640b7f46410ae1e29620e9c2441c3f8bb92`; previously independently accepted mocked-only transport boundaries remain as documented.

## Reproduced failures and verified corrections

1. Existing triage normalizes only canonical name/address. Retained known aliases `Haunted Attractions at Riverside Entertainment` and `Cider Mill Pumpkin Patch and Corn Maze` with another address produced `identityInputsComplete=true`, no matches and `awaiting-independent-review`. Acres alias `HELLS Gate` likewise missed its HOLD identity in direct triage. Minimal correction: exact normalized known-alias matching emits a possible-identity HOLD and preserves the canonical ID plus alias match basis; no automatic merge or geographic inference. Repros: `independent-milestone2-repro.mjs` and `.log`.
2. The parser silently stopped at 50 nodes or 12 JSON-LD blocks. A scheduled first event plus the same event canceled at node 51 or block 13 produced no conflict and five awaiting-review proposals. Minimal correction: any bounded coverage loss, including node/block/depth/size and emitted-proposal limits, marks parser incompleteness and holds the result. Malformed actual JSON-LD likewise cannot prove complete coverage. Caps must stay bounded; increasing them does not solve the problem. Repros: `independent-parser-cap-repro.mjs` and `.log`.

Both flaws affect research-queue fidelity; output publication/Open Now/verification flags remained false. Real operator access clearance remains zero of three, and FrightMaps remains excluded.

## Next service review assertions

The separately planned service must cache raw capture, never an eligibility/report decision; revalidate exact current policy and pinned receipts for each caller and after waits; re-triage each caller's current local day; isolate subscriber cancellation; abort when the last subscriber leaves and prohibit abandoned late cache writes. Preserve negative evidence separately from positive-cache eviction, across policy/source URL changes and source collisions. Exact name OR address OR bound alias collision creates only a research HOLD. Incomplete parser coverage must become persistent conservative uncertainty. A full negative ledger must latch failure closed rather than evict authority. These are pending tests, not accepted implementation claims.

## Final local evidence

`independent-r4-tests.log`: 87/87 PASS. `independent-alias-fix-check.mjs/.log`: the same three failing alias fixtures now create identity HOLDs. `independent-parser-cap-fix-check.mjs/.log`: both original cap fixtures now HOLD all five emitted proposals. `independent-source-verification.json`: all source membership and binding assertions PASS. `reviewed-file-sha256.txt`: all 17 file hashes verified unchanged after execution. This reviewer made no repository source changes and performed no venue requests.

The standalone service must expose or conservatively latch incomplete/empty capture coverage even when no proposal is emitted; per-proposal concerns alone cannot persist an empty capture's uncertainty. This is a next-service gate, not a foundation publication claim.
