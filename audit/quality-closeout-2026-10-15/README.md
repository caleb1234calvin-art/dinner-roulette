# Quality-first takeover checkpoint — 2026-10-15

**HOLD for new release; production unchanged.** PR #72 is merged and released. October 25 is an aspirational milestone, not a mandatory freeze or deadline. Do not repeat its release or extend an attraction's dates.

- Main `991978fe24ec165eeacd5500a26d66f35d86c560`, tree `95f66498048590cbd30c623b17d15bf2d5b7cc73`.
- READY production `dpl_72on94mDyDhNBbmN356bdXBsMqtY`, 92 curated source identities. All five aliases independently refreshed; see CONTROL-READBACK-R1.json.
- Draft PR #73: `integration/result-directions-wrap-2026-10-15`; exact head `6bac175a4224ba3ef996a44419abb7bbeb9c5777`, tree `1197f826e2dfd26a4e6c65646a40e4eba7309705`, parent exact current main. Four files, only Directions wrapping plus focused validation and audit explanation. Catalog/provider/workflow/dependency bytes unchanged.
- Local typecheck PASS; lint PASS with 6 inherited warnings; repository tests 1244 PASS / 4 inherited SKIP; application tests 71 PASS; migration-free auth production compilation PASS. Original immutable-hash failure and local Chromium-install failure retained separately.
- Hosted web run 38786473498: checks and 9 of 15 browser lanes succeeded at this checkpoint; six long browser lanes still running, including geometry. No full browser PASS yet. Hosted Android run 38786473529 succeeded; source-revision receipt is exact candidate. Unsigned AAB, bundletool PASS, signing guard fails closed, 14 inherited lint warnings, physical acceptance HOLD. Artifact names use synthetic PR merge SHA `2191098a38956bf50931b707e2d8c4236e01e870`, but checkout/source-revision is candidate head; synthetic tree independently equals candidate tree.
- New source fingerprint `86beaf7eb22132f4dca10c11a6cbda1affd8f53d4880489b2d98e2f8dcb1c7a9` (517 files) matches local and inspected hosted proofs. Output fingerprints differ between build jobs and are retained per artifact; do not pretend build outputs are byte-identical.
- Live samples cover Kansas, Arkansas, Oklahoma, Missouri and Illinois; seasonal switch, relocation/radius, Options, Result, Details, Favorites save/remove, History empty state, Plan empty and valid pair, Open Now exclusion and retry resumption. Partial provider coverage remains visible. See LIVE-ACCEPTANCE-R1.md for exact scope and omissions.
- D1 Directions fix prepared; D2 KC outer curated gating freshly reproduced and source-traced; D3 Benton city/county first-result ambiguity newly observed with ZIP recovery. D2/D3 are separate future changes. Edge's waiver-station routing is intentional, not a defect.
- Queue31 = 10 released + 21 held; 0 elapsed frozen cutoffs at review. Dark Hollows official 2026 date image recovered, but no new independently cleared/catalog-imported/released record. See SOURCE-REFRESH-R1.md and QUEUE-DISPOSITION-R1.json.

## Evidence preservation and limits

PR #72 R3 evidence index restored from `libfile_90ad797bf9a881918c0bdc2ab5fac8b2`: 7,666,179 bytes; SHA-256 `0d01980d7f1c8cc0ae1f8cb648cbcc40d2de7cb1b3710596a24fefea1b39110f`; ZIP CRC PASS, 117 entries. Prior manifest records 18 original archives totaling 1,382,516,154 bytes / 13,658 PNGs, already saved; this takeover freshly restored the index, not all 18 large archives. Preserve their prior October 28 expiry concern and durable pointers. A digest alone cannot reconstruct missing pixels.

Ten completed PR #73 web artifacts and two Android archives were downloaded and their SHA-256/ZIP CRC verified. New hosted artifacts expire October 29 individually. Pending lanes cannot be archived before completion. Original files and new compact receipts will be saved before this stage closes; only a successful save receipt is evidence of durable preservation. See later evidence index for actual saved identities. No claim of indefinite provider retention.

AI continuity transport repair: first update `4fc82015938e113a53d6a3f567163b1127454cf1` accidentally used middle-truncated command output. Repair `0e5af1a30f30fa7183153e5aabe439760fa83202` restored every original byte; fresh readback proves original 1,185,450-byte suffix intact. Original complete file was recovered, but semantic review focused on current checkpoints and relevant historical evidence; this is not a claim to have semantically reread every line of the 1.18 MB chronology.

## Exact next actions

1. Let web run 38786473498 finish normally; inspect original verdicts, counts, failures and all build proofs. Do not cancel/rerun to hurry geometry. Preserve remaining artifacts and verify hashes/CRC. Investigate any failing scenario on the exact head before changing code.
2. Obtain author-separated independent review of the four-file PR #73 delta and acceptance evidence. No such review has been completed in this takeover. Hosted execution is not a substitute for reviewer independence.
3. If qualified, prepare an exact-head release proposal with current migration-free effective build and rollback/alias controls freshly verified. Owner approval remains mandatory before merge, production, rollback, migrations or settings changes. No release decision is requested while acceptance is incomplete.
4. Prepare D2 as a separate bounded provider/local-catalog candidate; retain PR #61's parked status. Refresh only a few useful held records with source-bound expiry and full independent evidence. Do not hide discovery defects behind higher record counts.

The existing continuity/release branch generated nonproduction preview `dpl_4rG94M68kA26bg71j9hUdxK9mpYM`, ERROR because Vercel blocked its older TanStack Start 1.168.49 dependency. Current main/candidate use 1.168.60. No bypass, dependency change or production impact. Prefer the deployment-disabled integration continuity branch for detailed ongoing evidence.

Google Play: owner reports identity verification completed and Create App accessible. This removes an administrative blocker only. Future policy/privacy/security/WebView/content/IP/store-listing and physical-device audits remain separate after Halloween priorities. No Play settings, signing, upload or release action was taken.
