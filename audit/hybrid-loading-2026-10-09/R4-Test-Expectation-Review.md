# PR61 R4 test-only prepublication scope review

Reviewed2026-10-09 23:03–23:05 UTC against immutable base63b4c0096c2af305019cc7f5adf67e55720b562a. This is review of the proposed bounded test migration, not an immutable-head or hosted acceptance verdict. Final candidate SHA/tree must be independently bound after publication.

## Scope PASS for freezing and testing

Three seasonal browser harnesses retain all raw RPC receipts and decode the actual TanStack serialized patchId value: primary is encoded undefined, audit has a radial ID. Existing string-key-presence checks were insufficient because both kinds carry the key. Three independently rerun helper tests PASS using captured63b primary/core payloads, malformed rejection and duplicate-audit rejection.

Exact one-primary and +1/+2 primary TTL/season increments remain exact. Audit requests are counted separately and bounded to a matching distinct primary origin/radius/season/category acquisition and core-only ownership in these <=15-mile fixtures. Primary counts do not hide audit duplicates. Pure local filters, saved/favorites/exclusions and expiry/resume retain exact total-RPC no-refetch assertions; category/context transitions may allow only separately bounded audit reuse. Pending-response-at-expiry explicitly intercepts primary. Factual/lifecycle/routing/payload assertions bind to the primary response and remain in place. No weakened eligibility, Open Now or expiry expectations were identified.

The hybrid browser's radius-decrease check now decodes actual RPC kind rather than accidentally comparing zero primary counts. Both location-cancel cases now use normal manual-location UI without reload, a same-document sentinel, exact persisted/new-provider Columbia coordinates, selectable new-origin pool and stable options after releasing old work. Abort must match the held old request's patch+coordinates. These changes close genuine evidence gaps, not runtime defects.

The architecture's runtime source remains unchanged in the reviewed diff. The standalone location-workflow prototype is not published or needed; integrated R4 receives all ordinary exact-head validation. Geometry harness has no obsolete RPC-count assumption and remains unchanged. The expectation map is audit/date-night-hybrid-candidate/test-expectation-migration.md, section '63b seasonal RPC-count migration and real location proof (test-only R4)'. Preserve c931/a4/63b failed attempts and original assertions as history.

Receipt field clarification to primaryRpcDelta/totalRpcDelta is acceptable before final freeze, provided raw receipts and exact total no-refetch assertions remain intact. Final hashes and complete diff must be checked on the published candidate. Scope approval does not assert browser PASS; hosted execution, evidence integrity and screenshot inspection remain required. No live provider traffic, source remediation, main publication or deployment performed by verifier.
