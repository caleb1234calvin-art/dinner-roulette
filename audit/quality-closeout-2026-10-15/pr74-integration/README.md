# PR #74 integration evidence

Exact candidate `e5e1682f6c82c9a7d972e28bf9b9f94973a3d158`, tree `c36112156cd11baefb6671194f0d59b9c181c2a3`. This directory records the integration of released PR #73 without weakening either set of regression safeguards. The final owner-decision report and hosted-evidence receipt determine acceptance; any file explicitly labeled pending or checkpoint is historical, not final readiness.

`EXACT-IDENTITY.json`, `EXACT-SOURCE.txt` and `PR74-INTEGRATED-FULL.diff` identify the candidate and complete scope. `phase4-original-conflict.mjs` and `original-conflict.diff` preserve the conflict before resolution. Preliminary tree checks are separate from exact published-head evidence.

The first `exact-head-tests.log` is intentionally retained as FAIL: the command ran before required compiled SSR output. `exact-head-safe-build.log`, build proof and `exact-head-tests-after-build.log` document the proper build-before-test rerun on unchanged source. Typecheck and lint logs retain inherited warnings. Do not rename a failed run to PASS or combine totals across attempts.

`independent-review/` contains the separate reviewer's original current-main failure reproduction, exact-head focused results, independently written edge probes, their initial oracle mistakes and corrected probes, source receipts and inspected-evidence hashes. Old candidate logs remain historical only.

The independently run KC/Directions browser originals are saved separately in `PR74-INTEGRATED-INDEPENDENT-KC-BROWSER-2026-10-15.zip`; the report, integrity relationship and successful save receipt are included here. Candidate KC stages ran at 390px; six seasonal/ordinary Directions cases cover 320/390/512. Controlled provider/geocoder/clock fixtures and fallback-font limits remain explicit. The archive includes early screenshots taken before image decoding and final reruns with image-decode waits; neither changed candidate source.

Original hosted artifacts are large. Preservation manifests map intact saved archives or ordered 32MiB parts to their exact hashes and saved artifact identities. Concatenate parts in manifest order to reconstruct each original ZIP, then verify the full SHA-256 and ZIP CRC before relying on it. Original screenshots are contained in those preserved bytes; a manifest by itself is not a substitute, and no perpetual retention is promised. Selected pixels were actually viewed; integrity checks of other PNG files are not a claim of visual inspection.

Seasonal research is an explicitly separate packet, `PR74-SEPARATE-SEASONAL-RESEARCH-2026-10-15.zip`, with its own report and receipt. It changes no PR #74 source or catalog record. D3 remains a separate proposal.

Continuity proposals retain full historical suffixes. Remote `continuity/release` is intentionally unchanged because publishing that branch would trigger an unrelated deployment; the complete proposal and patch here are reviewable and resumable. No release action is authorized by the existence of these reports.
