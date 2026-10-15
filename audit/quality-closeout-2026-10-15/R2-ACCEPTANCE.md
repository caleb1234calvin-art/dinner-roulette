# PR #73 R2 — exact-head technical acceptance, release HOLD

Verified October 15, 2026. This is the implementing agent's source and evidence inspection, not author-separated independent review.

## Candidate and scope

- Draft PR https://github.com/caleb1234calvin-art/dinner-roulette/pull/73 remains unmerged.
- Branch `integration/result-directions-wrap-2026-10-15`.
- Head `0ea1e6500cbae97c94e9f123c08939ffefbf4090`; tree `7c12c5327af906348992e9b7d3282a11f830a202`; sole parent `6bac175a4224ba3ef996a44419abb7bbeb9c5777`.
- Base/current main `991978fe24ec165eeacd5500a26d66f35d86c560`; tree `95f66498048590cbd30c623b17d15bf2d5b7cc73`.
- Four files: shared Result Directions classes; focused geometry assertions; narrowly reversible historical UI hash assertion; candidate audit. No catalog, provider, dependency, workflow or deployment configuration change. All 92 production identities are preserved; current date-night/catalog, location, geocoder, lockfile, workflows and vercel config Git objects equal main.

## Completed exact-head evidence

Web run https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/38790478443 completed SUCCESS: checks, all 15 browser jobs and final validate succeeded. Hosted Node22 typecheck/lint, development compilation, auth-enabled migration-free production compilation, 1244 repository tests (4 inherited skips), and 71 application tests passed. Lint retains 6 inherited warnings. Local Node24 checks also passed; local Chromium installation failed, so no local browser PASS is claimed.

All 16 web build receipts are BUILT/authFlag=true with source fingerprint `e5c75fc455a3dde35754dd23c58d6fbb65e2f263bccb1419d88dbc28ac7f3b81` over 517 files. Each retains its own 193-file output fingerprint; output bytes differ across runners. Source identity does not imply bit-identical outputs.

The original verdicts contain 2030 passing scenario records, 16 casino checks and 19 location checks, plus 774 passing geometry comparisons. Geometry covers all 92 identities at 320/390/512: 276 Options, 276 Result, 219 Plan, 3 Plan settle. Current Result Directions has no button/label/card horizontal overflow, retains a 56px minimum target, and measures 72/72/56px. Every ordinary-card height increase equals precisely the measured 16/16/0px Directions delta. Existing seasonal 0.5px/5px limits and all historical variants remain enforced. Three R2 original Result PNGs at 320/390/512 were visually inspected; full wording and controls fit. Screenshots are fixture evidence, not current-production mobile or physical-device acceptance.

Seasonal/radial verdicts explicitly report zero public provider calls; applicable seasonal network receipts show zero forwarded external calls. Their cache/state/radius/relocation/expiration/Open Now recovery checks use deterministic fixtures. Location acceptance uses simulated coordinates and mocked provider/error callbacks. None clears the demonstrated live KC provider defect or proves physical GPS/WebView behavior.

Android run https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/38790478449 completed SUCCESS. Artifact source-revision is exact head `0ea1e6500cbae97c94e9f123c08939ffefbf4090`, although artifact labels use synthetic PR merge SHA `249157f8239bf47e539002c53a03269881c5d02f`. Normal unsigned release was rejected by the signing guard. Explicit unsigned validation bundle passed bundletool, package `com.calebcalvin.pickforus`, SDK36/min24, non-debuggable, backup/cleartext disabled; 14 lint warnings remain. AAB SHA256 `4cead0e51c28e90e5a0d42149e3952690d19a4f61f05bae1cacf55c6c3b5e4ee` was recomputed from the original archive. No upload, signing or Play action occurred. Physical Android and future store-policy audits remain HOLD.

## Original failures and correction

R1 web38786473498 finished FAILURE: 15 successful jobs, geometry failed, final validate failed. Its regional lane later completed successfully and is now preserved. R1 geometry774 comparisons recorded184 failures of the unchanged ordinary-card-height invariant: all92 Results at320/390. The intended wrap adds16px. New strict overflow checks passed, but the old invariant correctly prevented acceptance until the change was explicitly bounded.

R2 changes only the geometry accounting and audit from R1; UI bytes are unchanged. It directly measures old/current button height, allows only0 or16px difference, requires that difference to explain all ordinary-card growth, and caps current button height at72px. It does not waive seasonal content limits, remove scenarios, or relabel the old failure. R1 original geometry ZIP/pixels, verdict and log remain saved separately. Original immutable-hash failure, missing/corrupt Chromium install, and omitted-auth proof-capture failure are also retained alongside corrected passing results.

## Preservation

R2:18 original archives. Completed R1 regional:1 further original archive. All19 downloaded ZIPs match GitHub's SHA256, exact byte sizes and CRC checks; total1,648,682,166bytes,15,706PNGs. See R2-ARCHIVE-INTEGRITY.json. Individual hosted expirations are October29. Previous PR72 October28 concern remains; prior original archives and restored compact index retain their pointers.

R2-EVIDENCE-REVIEW.json records per-suite counts, per-runner build receipts, geometry accounting and unchanged-source objects. The compact evidence index includes original logs, JSON/XML/text receipts and inspected PNG samples. Successful save receipts will be recorded separately in EVIDENCE-PRESERVATION-R2.json. No indefinite retention guarantee or fresh restoration of every previously saved PR72/R1 archive is claimed. Hashes alone cannot recover deleted screenshots.

## Release gates still open

- Author-separated independent exact-head code/evidence review: no GitHub review exists at this readback.
- Live 320/390/512 production acceptance, physical Android/GPS/rotation/back-key, History writes and full live cache/expiry boundary sampling were not completed. Existing source qualifications for Walters/217/Boo remain visible; no sources or facts changed in this candidate.
- Before any approved release, freshly verify effective migration-free build command and rollback/all-alias recovery controls. Previous observation is retained, not perpetual permission. Never use ordinary `npm run build`, which chains migrations.
- Owner approval remains mandatory before protected-main merge, production deployment/promotion or rollback. No such action is proposed as ready while independent review is open.

## Next work

Obtain author-separated review of exact PR73 head and this evidence packet. If a correction is needed, preserve R2 receipts and revalidate a new exact head. Then prepare a concrete release proposal with fresh operational controls for owner approval. D2 KC curated outer-radius gating remains the next separate implementation scope; D3 Benton city/county ambiguity remains separate. Do not bundle either or new catalog records into PR73.

Queue31 remains10 released/21 held, with no newly cleared implementation. Dark Hollows dates/address have improved fresh evidence, but source/access/coordinate/overlap and independent review remain open. Prioritize a few regionally useful records with valid remaining source dates; stop when value expires. October25 is aspirational. Google Play identity verification is owner-reported complete, but Android publication remains a separate future workstream after Halloween.
