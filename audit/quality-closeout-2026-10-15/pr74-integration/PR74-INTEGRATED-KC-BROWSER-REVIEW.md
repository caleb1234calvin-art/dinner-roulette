# PR #74 integrated candidate — independent controlled-browser review

**QUALIFIED PASS for the bounded controlled browser scope.** This verification worker did not author either the original PR #74 candidate or its integration with released PR #73. Hosted CI, release authorization and production acceptance remain separate gates.

## Exact identity and build binding

Candidate SHA: `e5e1682f6c82c9a7d972e28bf9b9f94973a3d158`.

Candidate tree: `c36112156cd11baefb6671194f0d59b9c181c2a3`.

Released main control: `ead2319c4869478f4cd121e2370db4d9734d83ed`, tree `7c12c5327af906348992e9b7d3282a11f830a202`.

Fresh isolated worktrees and lockfile dependencies were used. Both builds were captured before compilation, completed only after successful direct migration-free Vite production builds, and verified before and after browser checks. The exact command was `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`. No ordinary npm build, database migration, deployment, configuration change or signing was performed.

| Build | Source SHA-256 / files | Output SHA-256 / files |
|---|---|---|
| Candidate | `18d6724e402478ded889815535bad3ba1fe48992716e258864099931c8232ba8` / 520 | `7d896a249f7185022118465616d294b5ec593994c03a82faad566f4faa03fc79` / 193 |
| Released main | `e5c75fc455a3dde35754dd23c58d6fbb65e2f263bccb1419d88dbc28ac7f3b81` / 517 | `eb114d5228abcccb3d161ef50fac1836013bbdbb3760651f35e738297f8b4b5b` / 193 |

Tracked source was clean before and after each run. Root's independently generated candidate output has a different fingerprint: direct file comparison finds only absolute worktree paths embedded in the generated route manifest, consequent manifest chunk names/imports, and the Nitro build timestamp. Static assets are identical. These proofs bind each tested output to its own exact source; byte-reproducible builds are not claimed.

## Original evidence actually accessed

Materialized the original `PICK-FOR-US-KC-AND-RESEARCH-SUPPLEMENT-2026-10-15.zip`: 26,844,438 bytes, SHA-256 `3ae80668d191805e6c87042ee75d632d66b03eba9b9746ea0b8243fbca98e784`. Its CRC test and all 13 manifest member hashes pass.

The nested author KC archive (11,348,787 bytes, SHA-256 `24091f6d07dda2e8a481f65276150959b6d2f132f0ecb86b7eff317e037e366a`) and independent KC archive (11,353,038 bytes, SHA-256 `772599d9c73df1fabb22e25da17162eeacd2ff8d1b878f223eab48675338095a`) were extracted, CRC-tested and all 87 / 85 member size/hash records verified. Original reports, full author probe and provider preload were read. Original author 40-mile Options and independent unfiltered-50-mile home screenshots were visually inspected. Other original screenshot bytes were hash-verified, not all visually inspected. Preserved preliminary guard failures remain in their original archives; this review does not erase or recategorize them.

## Fresh Kansas City discovery story

The unchanged original probe was adapted only for new candidate/main identities, owned output paths and the available Chromium executable. A second capture additionally waits for card image decoding before taking screenshots. Actual hydrated app and actual compiled server functions handle controlled HTTP 504 responses from all provider mirrors. Server external fetches are intercepted and browser external requests blocked. Kansas City and Carthage manual geocoder responses are explicit fixtures. No response records or client result objects are injected.

Origin: `39.114053, -94.627463`; Chromium `153.0.8010.0`; viewport `390 × 844`; reduced motion; service workers blocked. Favorites contain only the three existing target IDs to make rendered Options membership deterministic; unfiltered coverage is separately checked.

| Stage | Released main target count | Integrated candidate target count |
|---|---:|---:|
| 15 miles | 0 | 0 |
| 20 miles | 0 | 1 — Exiled KC |
| 30 miles | 0 | 2 — Exiled KC, Dark Nightmares |
| 40 miles | 0 | 3 — all three, including Terror at the Ranch |
| 50 miles | 0 | 3 |
| Shrink to 15 / grow to 50 | 0 / 0 | 0 / 3 |
| Open Now ON / OFF | 0 / 0 | 0 / 3 |
| Unfiltered 50-mile total matches | 3 | 6 |
| Relocate to Carthage / return to Kansas City | 0 / 0 | 0 / 3 |
| Client time `2026-11-01T05:00:00Z` | Not run | Exiled only |
| Client time `2026-11-02T06:00:00Z` | Not run | None |

Candidate: 14 checked stages PASS. Main: 12 expected-baseline-control stages PASS, faithfully reproducing the defect; eight of the shared candidate count requirements are unmet on main. Main's control PASS is not a product acceptance PASS.

Radius changes, shrink/grow, Open Now toggling and favorite toggling reuse one failed core RPC with four mirror attempts. No outer acquisition or extra provider attempt is introduced by local radius changes. Each complete location scenario uses five actual serverFn requests (three discovery, two geocoder), 12 controlled provider failures, zero public-provider calls and zero page errors. Coverage remains explicitly incomplete, saved-place/live-map-failure warnings remain visible, and no checked stage horizontally overflows. Manual relocation removes stale Kansas City targets and returning restores only locally eligible candidates. Expiry checks use source-bound client eligibility and do not assert refreshed operator dates or successful live-provider schedules.

## Fresh Directions integration checks

Separate real hydrated candidate sessions select seasonal Exiled KC and ordinary China Taste Buffet through the actual application and actual server functions with controlled provider failure. Exact existing favorites make selection deterministic. All six mode/width cases PASS:

- 320px: full Directions label readable, 72px target height.
- 390px: full Directions label readable, 72px target height.
- 512px: full Directions label readable, 56px target height.
- Complete text and accessible name, keyboard Tab focus and visible focus, width/touch dimensions, label text rectangles, card containment, disclaimer ordering and no document horizontal overflow all pass.
- Seasonal destination remains `12829 Loring Road, Bonner Springs, KS 66012, USA`; ordinary destination remains `37.143707,-94.312333`. Google Maps origin/path/api parameter, `_blank`, `noopener noreferrer` stay intact. Maps was not opened and routing accuracy is not claimed.
- Native Details keyboard Enter opens/closes correctly at each width. The 390px notice and confidence/Details row remain visually tight, matching the known inherited observation. Notice and summary boxes abut, without text overlap/clipping in the inspected case. This run does not establish a new candidate defect or silently expand PR #74 scope.

Visually inspected fresh 40-mile Options, 320px seasonal Directions, 390px seasonal Details/focus, and 512px ordinary Directions. Final image-decoded captures confirm actual art loads. Initial successful run screenshots sometimes captured before image decoding; those images and scripts remain in `*-r1-early-screenshots` as a capture limitation. They are not substituted for the final visuals, and this was not a candidate code failure. Both capture runs retained the same source/output proof.

## Remaining qualifications

This is controlled desktop Chromium verification, not live-provider, physical Android/WebView, GPS, mobile-font or installed-PWA acceptance. External Google Fonts are blocked; local fallback fonts are used consistently. Original source research and operating-date qualifications persist. This probe tests radius/cache reuse/relocation and expiration boundaries; broader all-record, cache-TTL and malformed-patch tests belong to the separate exact-head integration reviewer and hosted gates. No production state was changed and no merge/deployment is authorized by this report.

Full script, preload, logs, request/response bodies, provider geometry, build proofs, original archive integrity receipt, before/after comparisons, final screenshots and first-capture limitations accompany this report. Reproduction commands are the captured safe build sequence followed by `VITE_AUTH_ENABLED=true node kc-hydrated-browser.mjs <exact-worktree> candidate 8097` (or released main/control/8098), then `VITE_AUTH_ENABLED=true node directions-hydrated.mjs`; owned absolute paths are recorded in the scripts.
