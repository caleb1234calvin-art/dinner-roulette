# PR78 independent geometry regression review

**PASS for the available exact-head geometry browser evidence.** Review performed 2026-10-16 using already-downloaded original files; no duplicate downloads or source changes.

- Candidate `4010edf31e71a7350d891a98dd43f20535602abd`, tree `f521ed3dbdabceeb924ad4da1ce88e42db41092c`.
- Original geometry artifact `12068917952` in `android-brand-identity-web-ci/archives/12068917952.zip` matches saved GitHub metadata SHA256, size and head; CRC and unique paths pass. Exact metadata, proof and selected screenshots are recorded in `geometry-binding.json`.
- Independently exported the exact committed tree and recomputed the repository build-input digest: `5e920a77d68455735e0379d5c2cd705ee4fb9aefe5982e6406486943a8c465b7`, 520 files. This matches the geometry archive's build-proof and verdict proof; status BUILT/authFlag true. See `independent-source-binding.json`. No comparison to an untracked/generated-cache-contaminated worktree was used.
- Original `seasonal-card-layout/verdict.json` reports passed=true and errors=[]; 774 complete comparisons: 258 each at widths 320/390/512. Kinds: options 276, result 276, plan 219, plan-settle 3. There are 19 distinct ineligible Plan controls. Wave2 90/90 and regional geometry 108/108 comparisons complete.
- Independently recomputed all comparison deltas and applicable 0.5px/5px limits, media/card class/height equality, allowed 0/16px Directions change and previous-height bounds. No violation. Rechecked 1,644 expanded-note measurements for viewport bounds, unobscured status and minimum 12px text size.
- Visually inspected six original screenshots extracted to this review directory: Asylum options/result/Plan at 320px, Asylum expanded options, TwistedRoots result and expanded Plan at 512px. Controls and material details are readable in the sampled images. Expected truncated option titles and vertical scrolling remain visible; no new blocking clipping/overlap found. Six samples do not imply manual inspection of all 6,288 archived screenshots.
- Confirmed no candidate diff under src/public/server/vite.config.ts/vercel.json relative to the pinned base. This is regression assurance for unchanged web application source, not a new visual feature or deployment.

The verdict's zero errors does not mean every element has zero raw overflow or every card has identical height: existing intentional truncation and bounded Directions wrapping are explicitly measured. The independent review applies the actual acceptance thresholds rather than overstating zero overflow.

Regional final browser completion is outside this receipt and remained pending when assigned. No physical Android acceptance, installation, native WebView execution, real provider/location behavior, external data truth, production deployment or release eligibility is established by local production-preview fixture browser tests.
