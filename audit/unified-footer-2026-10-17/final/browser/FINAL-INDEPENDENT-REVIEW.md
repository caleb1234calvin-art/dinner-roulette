# Independent rendered-footer acceptance

Verdict: PASS for the bounded footer layout, copy, navigation, accessibility checks and source-mapped credit conditions below. The affected portal artwork-loading gap was subsequently closed by the focused evidence below. This is nonproduction Chromium CI evidence, not physical Android or store-capture acceptance.

## Exact source and evidence
- PR 79 head: efb440fe3545fda5ec9b9a7dc92de3f9c03fb6f2
- Tree: 0af83ad58fe87e701b7970475d43d73b77246361
- Web workflow run: 38997800977; footer job: 117294082389.
- Footer original archive: /workspace/scratch/a0ea701c7b34/unified-footer-validation/efb440-artifacts/pr79-efb-unified-footer.zip; artifact 12088102370, 51,048,910 bytes, 727 members.
- Independently recomputed archive SHA256: 0f69645fcd8a44864ad64f6ffa46fabc0c66b97b01f504bc3fd1bec80d4fdbbf. ZIP CRC and member path checks passed.
- Recorded before/after binding is the exact head/tree with clean tracked source. Safe-auth build proof is auth=true. Independently reconstructed source fingerprint: 542 files, 573f96fa96471d330df0bff93c3362d8f1a0771c3a2d9f2c7d55ec03e042a28f; matches archived proof. Compiled-output fingerprint was recorded, not independently rebuilt.
- Harness SHA256: dffb4470919d8d460702fcfebbdeb40e1c73aa973318639c2d2b3788cc2edfee.

## Automated results independently read
350 PASS, zero FAIL, errors=[]: 160 actual-route cases, 170 actual-source React portal fixture cases, 20 CDP 34px safe-area cases. Width/height pairs: 320x844, 390x844, 512x844, 768x1024, 1024x768; both themes.

Routes include short/long Favorites and History, Settings, Dinner, Date Night, Nightlife, Privacy and Terms. Credit edges cover SVG-only, raster, unknown-label fallback and duplicate favorites whose suppressed item contains raster artwork. Portals cover Result, Options and Plan, empty/SVG/raster/mixed/Halloween/no-category and spin exclusion. Real component controls, reviewed visitor warnings, legal-route exits and footer keyboard order were exercised with synthetic callbacks/data.

Exact owner copy and mailto destination checks pass. The public policy version remains v1.0, unreleased with effectiveDate=null, also covered by the separate legal suite. No horizontal overflow; static footer placement; no hit-test obstruction; minimum link target height 44px; keyboard outlines at least 2px.

Measured minima: text contrast 12.761:1 across 2,610 samples; route footer/nav gap 15px; portal bottom gap 15.578125px; safe-area footer/nav gap 23px with actual nav padding 34px. Credit present in 150 and absent in 180 route/portal cases. Forty discovery RPC attempts were blocked; zero escaped/finished discovery RPCs recorded.

## Actual visual inspection, separately counted
20 footer PNGs actually viewed, with individual hashes/dimensions in ACTUALLY-VIEWED-FOOTER-PNGS.json. This is a selected visual sample, not a claim to have inspected every generated PNG. Sample spans every tested width, both themes, both tablet orientations, route and portal footers, actual visible focus and safe-area screenshots. No clipping or overlaps found. At 320px Support wraps to its own centered row; tablet content stays in a centered bounded column. Disclaimers, labels and attribution are readable.

Six additional actual legal-page PNG crops were viewed at 320/390/512 in both themes; provenance in ACTUALLY-VIEWED-LEGAL-PNGS.json. Original legal ZIP SHA256 f897ff33a1a8cd84ddacfad3b670522b82b49b7013e0471431a42e81486b29ac, CRC clean, source proof matching; legal verdict 33/33 PASS. Crops establish typography only, not fixed-nav clearance.

## Limitations and qualifications
- Several synthetic portal raster slots appear blank in captured PNGs, including Plan mixed and Options raster. The harness establishes attribution from actual component img src membership in the owner-attested manifest, but does not assert naturalWidth/image decoding. Therefore these cases establish footer placement and attribution mapping, not successful rendered artwork loading. Cause is not established by existing evidence.
- Provider discovery is deliberately blocked before dispatch. Home-mode screenshots exercise controlled failure/empty layout states, not live-provider acquisition or successful results. Portal rows and store callbacks are synthetic, though components/CSS come from the exact source.
- CDP safe-area emulation is not physical Android, iOS or native WebView testing. No app-store capture, signed build, publication, deployment or merge is certified here.
- Link URLs, local navigation and mailto syntax are covered; delivery of email, third-party transactions and native mail handlers are not.
- Contrast, focus, target size, hit testing and overflow checks are bounded checks, not a complete WCAG audit or screen-reader acceptance.
- Earlier heads/runs remain historical; they are not substituted for this exact-head evidence.

Evidence receipts: FOOTER-ARTIFACT-RECEIPT.json, LEGAL-ARTIFACT-RECEIPT.json, INDEPENDENT-SOURCE-FINGERPRINT.json and MEASUREMENTS-SUMMARY.json. Original files remain preserved.

## Follow-up read-only diagnosis of blank portal raster slots
The affected Options/Plan img elements have no loading=lazy attribute. The same-origin route policy continues both requests, and img src values are the expected /date-night-icons/grok_1788905545571.jpg (park) and /date-night-icons/grok_1788905549562.jpg (escape room). Both local files decode at 784x1168 and are byte-identical to PR77. SHA256 values are respectively 556b83d7c416731a9c2dce2f6653642bdb7690b7b90b15f0705851310c4e4bfe and ee2d5491a7bb1b079e70e60aace86dee1fe2ad943cd71e6edba1461ac9e3667b. The harness captures without image readiness checks. Capture-before-decode is plausible, not established: no corresponding response/failure telemetry or naturalWidth was saved. Full portal artwork-render acceptance remains unverified. A focused same-source rerun of these two cases with decode/naturalWidth checks and response logging would close this gap without broad application changes. No edits were made to frozen source during this diagnosis.

## Focused image-readiness closure (final)
The earlier blank-image qualification above describes the original 350-case capture only. Follow-up workflow 38999646360 used evidence-only commit e823bd6e5216c15c4028c696fa5023db598b8664 with immutable candidate checkout efb440fe3545fda5ec9b9a7dc92de3f9c03fb6f2. The external diagnostic script SHA256 is 82ae6fb8efe1b903a9469bbfef261370ccaec433c54ba84a88f41d34ab5c2834. The app source, clean tree and 542-file fingerprint remain exact; no application change was needed.

Eight focused cases PASS, zero errors: Options raster and Plan mixed at 320/390, both themes. Every raster request returned HTTP 200 image/jpeg; every raster decoded at 784x1168 and every inline SVG at 150x150; all image complete flags true; zero image request failures. Existing footer layout, copy, contrast, focus, navigation and transport isolation assertions remained enabled.

Independently verified original artifact 12088661797: 1,772,379 bytes, 31 members, CRC clean, SHA256 57dbb7407409f76468d14bcb77348b5c93acdf62f8680fed8a94ef8de2bd73ba. Actually viewed three additional PNGs: decoded Options320 light, decoded Plan390 dark, and Options390 dark bottom. Artwork is visibly present and the footer remains intact. Paths, hashes and dimensions are recorded in FOCUSED-DECODE-RECEIPT.json. Total actual visual sample is now 23 footer/portal PNGs plus six legal crops.

The original blank-capture cause remains unproved because that run lacked image telemetry. The focused unchanged-source run closes image-readiness verification for the affected variants; no reproducible asset-loading release blocker was found. This does not expand the scope to all assets/devices or live-provider behavior. Final independent verdict: PASS for the bounded footer acceptance and focused artwork-readiness checks.
