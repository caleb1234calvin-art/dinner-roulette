# Two bounded occurrence amendments

## Authority and scope

Independent source clearance: `INDEPENDENT-SOURCE-CLEARANCE.md` and the byte-pinned `scripts/test-support/occurrence-cleared-projections.json` (SHA-256 `9bdbdf739844bfb8884c9fb0342a2ef08abe07cd5917ab071450d2e2e512e993`). The unchanged original author projection is `AUTHOR-PROJECTIONS-R1.json` (SHA-256 `0b32fc6fdb1840dd66606bd766e7a89c86729a939c8176799aabf32dec0b4098`). Implementation was separately authorized after independent clearance and continuity readback. Neither factual clearance nor this document is an independent runtime approval or release authorization.

Baseline: main `8353e60056fb0568360c5c13878d102880395d9f`, tree `a10e02b3151fda349322b612c371ddacd88350e1`. Fresh connector checks before implementation confirmed this main and production `dpl_3mPcvp1LGsjtQ3MVLgRUdmAzejN9` READY, with matching source and the five existing aliases. Candidate branch is `integration/missouri-occurrence-amendments-2026-10-13`; the existing integration deployment exclusion is unchanged.

Exactly 13 projected fields across two existing records change, with 67 identities retained:

- Haunted Hollows Haunted Trail, Palmyra: add explicit October 16, 17, 23 and 31 to the historical October 9, 10, 24 and 30 set. Retain old dates without claiming this review independently re-proved past occurrences. Extend activeUntil and the three existing end/expiry fields to October 31, 2026, 23:00 CDT (`2026-11-01T04:00:00Z`). Update the exact approved date/time copy and append the two decisive Passage URLs.
- Missouri Nightmare: qualify November 1, 2026, 20:30 CST as the final listed ticket time, not physical closing. Preserve its entire lifecycle, including cutoff `2026-11-02T02:30:00Z`. Do not infer October 24 cancellation from unavailable tickets.

All freshness fields and identity review revisions remain unchanged. This is not a full-record revalidation. Null machine hours, never Open Now, placement/address precision, directions, rideshare, admission qualifications, existing policy and all lifecycle-negative handling remain unchanged. No component, stylesheet, dependency, workflow, native configuration, merge or deployment change is included.

## Preservation and regression design

Historical accepted fixtures remain immutable. A new full 67-record release receipt is pinned by hash. The strict amendment helper checks every projected before/after value. Complete current catalog objects must equal the complete release objects with only these exact operations; all other 65 objects and every unprojected field remain equal. Existing historical catalog-file hashes continue to apply through a strictly pinned current-source-to-original-source mapping for the two amended catalog files, and remain direct byte checks for every other file. Presentation comparisons compose the explicit occurrence amendment with previously accepted admission amendments, without broad exclusions.

Tests cover older canonical cache entries and existing provider identity receipts, current-policy restoration, old Hollows cutoff extension, new cutoff ±1 ms, negative lifecycle and exclusions, no 2027 revival, never Open Now, unchanged address navigation and conservative Uber behavior. Existing hosted Astra/Extras and geometry suites exercise the actual revised consumer copy and saved/cache pathways without changing workflow configuration. The current policy is reused; no new resolver exception is added.

## Validation state at source preparation

All local and hosted tests, builds, browser/geometry runs, unsigned Android readiness, and independent exact-candidate verification are pending. No earlier candidate's PASS transfers to this source. Freeze source SHA, tree, sole parent and complete paths before running candidate checks. Preserve failed attempts and obtain fresh verification for any replacement head. Use only the auth-enabled migration-free build command; never the migration-chaining `npm run build`.

Stop at an independently verified draft candidate for the owner's separate release decision. No merge, deployment, signing, Play upload, or physical-device readiness claim is authorized here.
