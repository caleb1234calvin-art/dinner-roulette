# PR #73 independent live release verification — PASS within scope

Verifier: separate worker `/root/pr73_release_verification`. This worker did not author, merge, deploy or configure this release. It performed read-only GitHub/Vercel inspection and disposable-browser interaction with the public application. No account sign-in, database mutation, saved user choice, rollback, production configuration change, Android signing or Play action was performed.

## Exact identity

- Approved candidate: `0ea1e6500cbae97c94e9f123c08939ffefbf4090`, tree `7c12c5327af906348992e9b7d3282a11f830a202`, parent `6bac175a4224ba3ef996a44419abb7bbeb9c5777`.
- Fresh pre-release main: `991978fe24ec165eeacd5500a26d66f35d86c560`, tree `95f66498048590cbd30c623b17d15bf2d5b7cc73`. Local exact candidate clone was clean and the complete diff remained four files, 83 insertions/7 deletions.
- GitHub post-release merge: `ead2319c4869478f4cd121e2370db4d9734d83ed`, tree **exactly the approved tree** `7c12c5327af906348992e9b7d3282a11f830a202`. Parents are prior main `991978…` and approved head `0ea1…`. PR #73 is closed/merged.
- Independently read production: `dpl_8DBJFLQwkBGckTxM5RYPM63dLqS5`, READY, source `ead2319…`.
- Five independent hostname-specific alias reads all point to that deployment: `pickforus.app`, `www.pickforus.app`, `dinner-roulette-chi.vercel.app`, `dinner-roulette-minions-9e2c.vercel.app`, `dinner-roulette-git-main-minions-9e2c.vercel.app`. www has the expected 308 apex redirect.
- `PREFLIGHT-API.json` and `POSTRELEASE-API.json` contain bounded receipts without raw creator-email data.

## Required-check corroboration

Fresh API reads before release: web workflow `38790478443` completed SUCCESS, all 17 jobs SUCCESS including all 15 browser matrix jobs and aggregate validation; Android workflow `38790478449` validate-android SUCCESS, sign-upload-bundle intentionally SKIPPED. These are exact approved-head runs. This worker did not claim to rerun all repository tests or all original acceptance archives in this release turn; those remain the separately preserved prior independent acceptance.

## Actual live production checks

Final viewport evidence run: `2026-10-15T23:00:38.539Z`–`2026-10-15T23:01:02.081Z`, Chromium `153.0.8010.0`. Six cases PASS, no page errors or request failures. A prior six-case production run also passed and selected Taco Bell as its ordinary example.

Fresh isolated contexts loaded the real public HTML, CSS, JavaScript and fonts. The actual application hydrated; actual serverFn discovery returned results. Browser-local saved coordinates were explicitly set to the reviewed Benton municipality location `34.563224662909,-92.588223916041`, with open-now disabled and a 5-mile radius. This deliberately avoids conflating the separate Benton geocoder issue with Directions acceptance. No provider/server responses, dates or application components were mocked. Reduced motion was requested.

| Case | Width | Directions dimensions | Lines | Outcome |
|---|---:|---:|---:|---|
| Royal Haunted House, seasonal Date Night | 320 | 280 × 72 px | 2 | PASS |
| Royal Haunted House, seasonal Date Night | 390 | 350 × 72 px | 2 | PASS |
| Royal Haunted House, seasonal Date Night | 512 | 472 × 56 px | 1 | PASS |
| La Hacienda de Benton, ordinary Dinner | 320 | 280 × 72 px | 2 | PASS |
| La Hacienda de Benton, ordinary Dinner | 390 | 350 × 72 px | 2 | PASS |
| La Hacienda de Benton, ordinary Dinner | 512 | 472 × 56 px | 1 | PASS |

All six cases require the complete rendered `DIRECTIONS · GOOGLE MAPS ↗` and source text `Directions · Google Maps ↗`; Playwright accessibility snapshots report the complete link name. Text-range rectangles remain entirely inside the button. Button and label scroll widths do not exceed their client widths; card width remains contained. Keyboard Shift+Tab/Tab returns focus to the link, with `:focus-visible` and visible focus treatment. Minimum 56px touch geometry is preserved. The following disclaimer begins 8px after the button; no overlap/collision was measured. All seasonal Details disclosures open and close with Enter.

Actual targets:

- Royal: `https://www.google.com/maps/dir/?api=1&destination=111%20South%20Market%20Street%2C%20Benton%2C%20AR%2072015`
- La Hacienda: `https://www.google.com/maps/dir/?api=1&destination=34.5789573%2C-92.580132`
- Earlier passing ordinary Taco Bell sample: `https://www.google.com/maps/dir/?api=1&destination=34.5804452%2C-92.5739374`

All links retain `target="_blank"` and `rel="noopener noreferrer"`; no Google Maps navigation or route correctness is asserted. The source Directions helper and Royal catalog entry have zero diff against prior main. Helper SHA256 on both sides is `63b378e90362dfa484e02da537b26897672d98a827365a3e2abb6fe9bd55671c`. Thus the semantic comparison is exact unchanged source plus actual deployed href, not an invented pre-release href capture.

## Visual assessment

Actually viewed final viewport screenshots: seasonal 320 Directions focus, 390 notice/Details focus, 512 Directions focus, and ordinary 390 Directions focus. Full label is readable in each. The 390px notice/Details row remains tightly spaced: notice bottom meets summary top, and the focus outline is close to the notice. The text is readable without clipping. This matches the already accepted inherited low-severity spacing concern; no new PR #73 defect was found. Tall Result content requires ordinary vertical scrolling; viewport screenshots accurately show the visible screen.

## Deployed asset relationships

Public asset bytes were captured with SHA256 per URL in `postrelease/report.json` and retained under `postrelease/assets/`:

- `styles-DuhPbn71.css`: `87c813665cfc78930217e088eada35dbfe7fa51697f72f8167cbcf01894da560`
- `routes-BIa6jLG-.js`: `e894c37738f4539455aa26710fe1de9a8b84ad3a97473787a2e4a158a9bfc594`
- `index-FrOPJ6cG.js`: `c7b68fb25a6876749639e0610a73247f9d79150ef109125c22f0a808da2840b8`

The captured routes bundle contains the exact approved wrapping classes. These were independently fetched from the production hostname whose Vercel source identity and all aliases were verified. This is not a claim of independent byte-for-byte build reproducibility.

## Preserved test-tool failures and qualifications

1. Official Playwright Chromium151 installer returned repeatedly truncated/non-ZIP data (`End of central directory record signature not found`) and exited1. This was not treated as product failure or a passing browser run.
2. The previous `/tmp/chromium` path was a zero-byte file after workspace maintenance. First runtime launch exited. A clean npm-published `@sparticuz/chromium@153.0.0` package was installed only in verifier scratch; its binaries were decompressed locally. No repository dependency or lockfile was changed.
3. Direct browser connection returned `ERR_EMPTY_RESPONSE`. Using the execution environment's configured HTTPS proxy reached the site but Chrome lacked the provided CA trust. Python/system trust independently validated the proxy certificate issuer against `/usr/local/share/ca-certificates/nebula-dns.crt`. This test browser trusts only that exact installed CA public-key hash via `--ignore-certificate-errors-spki-list=n9jEr2dCP1tg9exQzr7xEpZ4TjG2QWO02LUFhmAzII4=`. It does not use broad `--ignore-certificate-errors`; NSS certutil/modutil were unavailable. This is an environment-specific TLS qualification, not physical-device TLS acceptance.
4. Initial post-release R1 harness compared mixed-case expected text against CSS-uppercase `innerText`, so it failed before geometry assertions. Original script, reports, logs and failure screenshots are preserved. The corrected oracle requires **both** exact CSS-rendered uppercase innerText and exact mixed-case textContent; no geometric or accessibility assertion was relaxed.
5. An attempted later baseline run crossed the release cutover and loaded the new assets. Its directory is explicitly named `postrelease-trial-baseline-label`; it is not pre-release geometry evidence. Initial capability screenshot/DOM/network truly loaded old `styles-CZLC_hPO.css`, `routes-D1MIvqhu.js`, `index-C_QzFdmE.js`, and is preserved separately. No old-production complete geometry or href capture is invented.
6. R2 geometry passed, but full-page screenshots of a fixed Result overlay show underlying document content below the viewport. Those images are preserved as capture-method evidence, not a visible UI leak. R3 repeated the same strict six checks and produced accurate viewport-only screenshots, without changing product source.

This narrow deployed UI verification does not clear physical Android/WebView, mobile font scaling, real GPS/PWA, broad live-provider reliability, seasonal source/operating-date qualifications, D2/PR #74, D3, or the accepted five-alias rollback qualification. Root's build override/rollback-interface operator checks are separate; this worker did not perform them or execute rollback. Original PR73 R1 geometry failure evidence and the full prior acceptance packets were not reopened in this release verification turn and remain linked by the existing continuity.

Reproduce with the documented Chromium153 runtime and configured environment proxy: `node live-directions.mjs postrelease`. Ordinary selection is intentionally live and may differ; assertions remain venue-independent, while Royal's exact reviewed destination is fixed.
