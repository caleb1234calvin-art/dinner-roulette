# HTTP baseline and postrelease readiness

Captured October 19, 2026 approximately 06:33–06:35 UTC, prior to release.

Expected current-state PASS: all five home aliases return 200. www returns 308 to https://pickforus.app/ then 200. Apex and wrapper-origin chi /privacy and /terms return 404, expected for the old deployment, not a candidate release failure.

Raw headers, full redirect chains, bodies, SHA-256 digests, curl metadata and linked JS/CSS snapshots are preserved in baseline/. Body hashes vary because responses contain runtime-generated content. Common first-party asset names and hashes agree across hosts. One branch-alias sparkles download timed out and a read-only retry returned 200 with the same SHA-256 as the other hosts; both attempts are retained.

This HTTP observation identifies rendered/asset behavior, not independently the deployment ID or commit. Bind production identity using the separate Vercel/source readback. Expected old source c3208d9fdc9a21d698efa9254be1286f5d3d2836 and deployment dpl_FMS2SBg4ymuDwU4avpywV6yB5vg6 were supplied by coordinator, not inferred from HTTP.

Postrelease verifier is bound to immutable candidate cf18ff1c5a56ecf59f8006d4f7c83fb289f393df, tree 6300c1061a790d84447bb92166f340aec895757b; exact source files and connector receipts retained in source/. PUBLICATION.md and the required release/device plan at da670988b5e08adc434888d391ce3fb4ce39fb76 are retained. Policy checker excludes script/style text and verifies every paragraph, bullet, section title/link, contents anchors, section IDs, version 1.0, exact effective date 2026-10-19 (America/Chicago), published history, no previous published versions, support address and Back to Settings on apex and chi. HTTP executes no JavaScript and uses no login cookies; visual no-JS browser acceptance remains separately attributed.

Waiting for coordinator release notification before postrelease checks. No source, production, configuration or credential mutations performed.
