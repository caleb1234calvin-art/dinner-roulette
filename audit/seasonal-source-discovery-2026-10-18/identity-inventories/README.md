# Revision-bound identity inventories

These are offline identity-collision and exclusion inputs, not runtime catalogs or fresh venue clearances. No venue site was accessed to assemble them.

## Exact authority

- Published: all **92** curated identities from main `c3208d9fdc9a21d698efa9254be1286f5d3d2836`, tree `c36112156cd11baefb6671194f0d59b9c181c2a3`. `src/lib/date-night/curated-policy.ts` imports 18 nonempty catalog arrays, totaling 92 unique IDs. The imported catalog source bytes, relevant identity/listing policy and presentation source were verified against the exact main tree. Main has not been changed.
- Pending: all **20** recovered, historically factual-qualified records in `audit/dot-recovery-2026-10-16/twenty-records/EXACT-TWENTY-FACTUAL-RECORDS.json` at continuity commit `d0f09d4c20938a40dab70c96bc8bd53ba598bebd`, tree `c928c1d20b2a25d1d0ccd27def53b087ec574e56`. Exact source Git blob `0873da518909d0038b75fc4e5aab4f1e5f8f20c5`; file SHA-256 `fa07910cb7bff208ed95b3a306834ee6dc6f1d750b1cecdf9af8f6c08d9fa33c`. All 20 original canonical record hashes match the separately recovered ledger.
- Fresh readback on October 18 confirms main unchanged and relevant pending/queue/report blobs unchanged at continuity `442ca356979e637601ef317fc020a87e957991d6`, tree `3f6d2bb8c52f61c86538a237e3885deb42338168`. Unrelated later documentation updates do not alter the immutable source binding.
- [Issue 71](https://github.com/caleb1234calvin-art/dinner-roulette/issues/71) and its 45 comments were recovered. The current seasonal accounting is **31 tracked = 10 published + 20 factual-qualified pending + one held**. It is not 112 published.

Both manifests enumerate exact source paths, containing revisions, Git blobs and byte SHA-256. `sourceBlobs` may include a separately pinned continuity source for historical alias evidence even when the primary inventory revision is main.

## What completeness means

`completeness: complete` means complete membership for the bounded pinned inventory. It does not mean statewide discovery completeness, globally complete aliases, current operation, fresh factual clearance, runtime integration or release acceptance. Published and pending sets are disjoint. No caller-supplied count, empty array, current-year date, digest or `complete` label establishes authority.

All 20 pending records retain inherited factual `QUALIFIED_PASS`, runtime `NOT_RUN`, release `NO_APPROVAL`, conservative Open Now and `halloween-layer` visibility. Their existing source review dates, October 16–18, are all due or overdue on this observation. Their immutable historical source evidence is preserved, without redoing factual research or promoting those records.

Aliases explicitly present in the recovered bounded source set are retained for conservative collision review, with provenance. They are not automatic merge authority. The Six Flags St. Louis Fright Fest rebrand still has the original runtime identity and geographic safeguards. Ordinary venue/shared-address similarities must not remove those safeguards.

## Negative evidence and expiration

All 92 published IDs remain in the inventory, including these seven whose exact listing cutoffs had elapsed by October 18 13:41 UTC:

- Christine’s Vineyard — Witches Day Out
- Nevada/Vernon County Oktoberfest Fall Festival
- Nathan and Olive Boone Homestead — Historical Haunts
- Pomme de Terre State Park — Pomme de Terror
- Osage Beach City Park Fall Festival
- Meramec State Park Spooktacular
- The Broken Hour at Shepherd’s Lantern

The date-only preliminary count of five omitted the two records expiring October 18 at 05:00Z; exact-instant calculation gives seven. No expired identity is removed from duplicate checks or revived by this inventory.

Acres of Madness (`date-night-ks26-acres`) is retained as the pending inventory's separate `negativeRecords` entry. Its address/operator URL/alias come from the pinned historical queue. The later recovery report's HOLD for contradictory final endpoint evidence and the editorial cutoff constraint supersedes that queue's old READY label. HOLD is not a permanent-closure claim. It is excluded from the 20 factual-qualified count.

No per-record permanent-closure/disuse flags were present in these recovered published/pending records. This does not negate separate live/session provider lifecycle evidence; callers must retain stronger negative evidence from other verified sources.

## API and trust boundary

`scripts/seasonal-source-identities.mjs` exports:

- `readBoundIdentityInventories()` → `{published, pending}` from module-relative files. An unavailable file returns an explicit unknown/incomplete object, never `[]`.
- `validateIdentityInventory(value, {kind, now})` → `{valid, reason, records, negativeRecords, ...}` only on success. Invalid results omit records. `now` is finite UTC epoch milliseconds, defaulting to the actual clock.

The module pins each manifest's exact file SHA-256. A manifest pins the complete inventory's canonical SHA-256, exact record and negative-record SHA-256, source authority, counts and observation window. Counts are also independently fixed in the module to 92/20 and 0/1 negative records. Successful results are detached and deeply frozen to prevent post-validation changes.

Canonical hashing uses UTF-8 `JSON.stringify` after recursively sorting object keys lexicographically. Array order is retained. No whitespace or trailing newline enters canonical payload hashes. File hashes separately cover actual bytes.

The reviewed observation window is **2026-10-18T13:41:16.000Z inclusive through 2026-10-18T19:41:16.000Z exclusive**. This conservative six-hour review bound is an engineering fail-closed limit, not a claim that venue facts stay fresh for six hours. A current receipt is still only identity exclusion evidence. Before-observation, expired, invalid-clock, malformed, missing, partial, reordered, modified, duplicate-ID or untrusted-manifest inputs fail closed. Renewing authority requires a newly reviewed source snapshot, receipt and module anchor; changing a caller timestamp/hash is insufficient.

## Bounded validation

`node --test scripts/seasonal-source-identities.test.mjs`: 13 tests PASS. ESLint on the module/test: zero errors or warnings.

Tests cover exact 92/20 membership, seven expired identities, Acres HOLD, stale factual qualifications, empty/partial/forged input, authority/hash/data mutation, negative evidence removal, half-open time bounds, invalid normalized dates, same-count duplicate IDs, detached frozen output, malformed/oversized/cyclic inputs, missing files and tampered manifests. Original first-run 12 PASS/1 FAIL is preserved in the standalone review evidence: a test helper replaced an explicit undefined input with the valid default fixture. The test now calls the production validator directly; no production validation rule was relaxed.

This is local author evidence only. Independent review and integrated exact-head acceptance remain separate gates. No catalog, main, PR82, venue, production, deployment, credential or setting was changed.
