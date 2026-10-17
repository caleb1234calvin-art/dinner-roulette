# Independent consolidated browser review

Final verdict: PASS for the bounded independent rendered-browser acceptance described below. All evidence is fresh for the frozen consolidated candidate; no previous candidate PASS was transferred. This does not certify production or physical-device release readiness.

Candidate PR80: 29bec315b919535c9aeb3f7e8b1c9e3fa638e80d, tree de43c3ee90ad31e5de678737be1eed61b6eb6d01. Primary workflow 39004750065. Independently read remote commit/tree and reconstructed pristine tracked source using git archive. Fresh build-input SHA256 5eaf48127e44d83b6c5a97ef76bec131874dcc99908f272196f584a90997af84, 542 files. Six tracked footer/legal/geometry/proof harness files are byte-identical to prior methodology. The local checkout had an ignored Python cache when first measured; that non-candidate fingerprint is separately retained and never used for acceptance.

## Completed: footer layout, navigation and bounded accessibility

PASS 350/350 with zero errors: 160 actual-route cases, 170 actual-source React portal fixtures, 20 CDP safe-area simulations. Viewports 320×844, 390×844, 512×844, 768×1024 and 1024×768; both theme settings. Original artifact 12090653565: 51,043,559 bytes, 727 members, independent SHA256 aaaedb18e7e3a9125c4a2c892b9f6a1fdd8b5d8409a087bb52890245e9743e50. ZIP CRC, all member hashes, clean before/after exact head/tree, auth-enabled BUILT proofs and fresh source fingerprint verified.

Routes cover empty/long Favorites and History, Settings, Dinner, Date Night, Nightlife, Privacy and Terms; SVG/raster/unknown-label and suppressed duplicate artwork-credit boundaries. Portals cover Result, Options and Plan with synthetic callbacks/data, mixed/SVG/raster/empty/Halloween/no-category variants and spin exclusion. Copy, legal/mailto targets, navigation, retained controls, warning details, no raw audit-note disclosure, text contrast, keyboard order/focus, link hit testing and normal-flow placement pass.

Measured minima: contrast 12.761:1 over 2,610 samples; route/nav gap 15px; portal bottom gap 15.578125px; safe-area/nav gap 23px with actual 34px nav padding; link target height 44px; focus outline 2px. Forty discovery RPC attempts blocked before dispatch, zero completed/escaped discovery RPCs. Artwork credit present in 150 and absent in 180 route/portal cases.

Twenty original PNGs actually viewed across every viewport pair and both themes, including actual focus and safe-area frames. At 320px Support wraps to its own centered row. Tablet content remains centered and bounded; no footer clipping/overlap observed. Raw portal samples include blank raster slots (Halloween 512px, mixed Plan 768px, Nightlife Options 1024px). The 350-case harness has no decode readiness telemetry; the cause of those blanks is not established. These are footer/layout/attribution-mapping samples only. The separate eight-case decode result below establishes its stated scope and is not extrapolated to every asset/variant/viewport.

## Completed: focused image readiness

PASS 8/8 new Options raster and Plan mixed cases at 320/390, both themes. Original artifact 12090836426 from workflow 39005040693, evidence commit af1dadc4d17d25271c28232c415e8622f243e27b. 1,772,162 bytes, 31 ZIP members, SHA256 dcf50f40f05d080b6acef6d7afa911e132feaa0d27e58cc8ab78c11c1f53933a; independent CRC, member hashes, clean before/after head/tree binding and auth-enabled source proof pass. Every raster request HTTP 200 image/jpeg, decoded at 784×1168; inline SVG 150×150; no image failures. Three actual PNGs viewed show visible artwork and intact footer/card layout.

Initial workflow 39004829965 failed before browser launch because the reused evidence diagnostic retained the prior source fingerprint/head/tree assertions. Original 772-byte artifact 12090820958 and log remain preserved. Independent source reviewer verified correction was exactly three immutable string substitutions on two lines; no weakened assertion or candidate change. Corrected diagnostic SHA256 c98236a1548beb1bb7f1935d80de0df4b2d110dd1b571a03763effa430e09399. Evidence-only integration branch retains deployment disabled.

## Completed: legal and support

PASS 33 checks. Original artifact 12089684713, 10,184,406 bytes, 63 members; independent SHA256 7e770045de6196606f3e8ee13116a84b8b2ef4c1bc4a669b5e38242b459c8004 and CRC/source proofs verified. Covers 320/390/512 light/dark public Privacy/Terms routes, anchors, version history, focused Back-to-Settings navigation, Settings mailto no-handler fallback and scoped synthetic local reset, no-JavaScript public reading; actual material-notice component with available/blocked storage, dismissal, reload persistence, new-version reappearance and history links. Minimum recorded text contrast 5.422676:1.

Eight new original legal/support/notice PNGs actually viewed; typography/wrapping/focus readable, no horizontal clipping. Current source remains version 1.0, status unreleased, effectiveDate null, no previous publications, consent/agreement flags false. Dated notice captures are explicitly test-only fixtures, not public effective dates.

## Completed: seasonal card geometry

PASS 774 comparisons, no errors or incomplete rows: 258 each at 320/390/512; 276 Options, 276 Result, 219 Plan, 3 Plan-settle. Nineteen unique ineligible-plan controls retained; regional geometry 108/108 and wave-two 90/90 complete with all six comparison variants. Original artifact 12091012918: 475,251,674 bytes, 6,291 members; independent SHA256 411b74281f991c51dc36268d94ba99fdf9b37db5f2925b6bc1b68c47c1ff6b5b, ZIP CRC and every member hash verified. Auth-enabled fresh proof matches exact candidate.

Four new original geometry PNGs actually viewed: Asylum 320px Options, 390px Plan, 512px Result and 320px expanded disclosure. Footer is readable/in normal flow; approximate-location, hours uncertainty, admission/refund and external-service copy remains in contextual regions. Expanded narrow card wraps rather than clips. Partial footer in Plan/Result screenshots is normal scrolled content, not proof of complete footer viewport fit.

## Completed: regional end-to-end and negative controls

PASS 317/317 regional scenarios and 277/277 wave-two scenarios, no errors. Original artifact 12091517467: 287,610,350 bytes, 2,058 members; independent SHA256 99799bcb1075e52cee6fc4cd37503866452d306a5d652f0d1d878775463e2ff3, CRC and member hashes verified. Both verdicts, archive build proof and successful child subpass bind to the same exact-source fingerprint. Child subpass code 0, signal null, passed true and legacy count 317.

Regional controls retain 12 accepted IDs, 12 November-5 expiry controls, 24 negative lifecycle controls and 32 historical receipt controls. Wave two retains 10 accepted IDs, 10 November-5 expiry controls, 20 negative lifecycle controls and 32 historical receipt controls. Both suites cover actual UI radii 1/15/30/50, separate independent 25-mile geometry, reject unsupported 25-mile planner use, and use manual location only. Fresh intercepted provider-call counts are 1,928 and 1,765; forwarded external/public provider calls both zero. These are fixture regressions, not live provider or current venue availability checks.

Image observations: regional 96 plus wave two 110, all complete/decoded with positive natural dimensions. Four new original 320px Annabelle and Walters Options/Result PNGs actually viewed: artwork visibly loaded, approximate location and uncertain hours/schedules remain readable, no new visible obstruction.

## Remaining primary browser suites and exact evidence inventory

All 18 primary original archives were independently SHA256 checked, full ZIP CRC checked, safe/unique member-path checked, member-hashed and inspected for exact auth-enabled source proof. Combined primary originals total 1,538,579,874 bytes and 14,524 members. The separate successful focused archive and preserved initial failed archive are additional originals, not replacements. Compiled-output hashes are recorded CI proof observations; this reviewer did not independently rebuild compiled output.

Fresh verdict counts read directly: ordinary Date Night radial 10; two-record seasonal 23; completeness 97; ten-record 157; cumulative 235; Astra 220; Astra extras 196; phase-four 164; next-Missouri 87; hold-cleanup 69; ranked-holds 178. All passed with no errors. Casino has 16 recorded checks with no errors; location original evidence and exact build proof were also verified. Full metadata and verdict details appear in FINAL-VERIFIED-PRIMARY-SUITES.json, with per-archive member manifests in suite subdirectories.

Actual visual inspection is separately counted: 39 unique original PNGs, comprising 20 footer, 8 legal/support/notice, 3 focused-decode, 4 geometry and 4 regional images. ACTUALLY-VIEWED-PNGS.json records each original archive/member, exact PNG SHA256, dimensions and observation. This is representative visual sampling, not manual inspection of every generated image.

## Boundaries

Only original CI Chromium evidence; no physical device or Android WebView observation. Controlled synthetic fixtures and blocked/intercepted providers do not establish live-provider acquisition or availability. Mailto syntax/fallback is not mail delivery/native mail-handler verification. Contrast/focus/hit-target/overflow checks are bounded accessibility checks, not a complete WCAG or assistive-technology audit. No merge, deployment, signing, legal publication/date activation, store capture or Play acceptance. Prior candidate failures and qualifications remain historical and are not overwritten or substituted for current source evidence.

Detailed original archive receipts and actual PNG view hashes/dimensions are adjacent in this review directory.

## Links and completion

- Candidate: https://github.com/caleb1234calvin-art/dinner-roulette/pull/80
- Primary fresh workflow: https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/39004750065
- Successful focused evidence: https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/39005040693
- Preserved initial evidence setup failure: https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/39004829965

No application changes were made during independent browser review. The only remote write was the authorized deployment-disabled, source-pinned evidence workflow/diagnostic, including its independently reviewed immutable-pin correction. Original PR77/78/79 were not modified by this work. Final review completed 2026-10-17 UTC.
