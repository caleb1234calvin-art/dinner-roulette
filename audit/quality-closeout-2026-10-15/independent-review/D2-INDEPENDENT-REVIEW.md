# D2 Kansas City curated-radius candidate — focused independent review

Verdict: **QUALIFIED PASS of the exact source correction and focused regression evidence; not release acceptance.** No blocking finding in the nine-file candidate. Hosted full browser/application validation and operational release qualification remain required. Reviewer `/root/pr73_independent_review` did not author this D2 candidate and made no changes to it.

## Exact identity

- Branch: `integration/kc-curated-radius-2026-10-15`.
- SHA: `b683f7979845d32b909cf4f195bc8bf42305e101`.
- Tree: `9c4ec8780bdddff51335f523823e1ec40dee001f`.
- Parent/released baseline: `991978fe24ec165eeacd5500a26d66f35d86c560`.
- Nine files changed, 217 additions / 6 deletions, only two product-source files: `curated-policy.ts` and `radial-session.ts`. Complete diff saved in `exact-diff.patch`. Worktree clean.
- This candidate is based directly on main and contains no PR #73 Directions changes.

## Mechanism and boundaries

The existing server assigns fallback results to the current radial patch. A failed core properly prevents outer provider acquisition; this also prevented already reviewed curated outer-radius identities from entering the displayed pool. This correction composes the current curated registry into presentation after core settlement/cache readiness, clipped to the exact selected radius and query categories. Ordinary eligibility still applies operating-date/expiry, reviewed placement, seasonal visibility, conservative Open Now and preference/exclusion rules.

The saved pool does not enter the provider proof cache. Core-before-outer admission, coverage accounting, request pacing, cancellation, attempt limits and timeouts are unchanged. The three Kansas City targets become eligible only within their actual distances; no geographic bound or operating date is extended. Catalog, provider search, cache, radial-cache, availability and eligibility files remain byte-identical to main, preserving all 92 published catalog identities.

## Independently executed checks

| Check | Result |
|---|---|
| Exact new nine-test suite against main | Seven failures / two controls pass, independently reproduced |
| Same suite against frozen candidate | Nine PASS |
| Four amended existing test files | 101 PASS |
| Six reviewer-written edge cases | Six PASS |
| Historical source amendment | Before source exactly equals main Git bytes; before and after SHA-256 match pinned values |

Before/after tests cover actual handler-to-controller failed core, 15→50→15→50 and 20/30/40-mile bounds, transport/watchdog failures, relocation cancellation, seasonal/type/expiry/Open Now gates, cached successful core pacing, authoritative negative lifecycle and negative-cache eviction. The reviewer reran the exact before suite in the detached main worktree, using the same final nine tests with imports resolved to shared test helpers; the worktree source remained main.

The additional reviewer-only tests independently verified:

1. A known closed curated identity stays retired after cache TTL expiry and compatible category/radius changes when fresh acquisition fails; the other targets remain available without invented core coverage.
2. After old negative evidence expires, a fresh positive in a valid provider patch may restore eligibility through the live cache.
3. Transport failure keeps a truthful `fallback` source and saved-places warning; static rows do not create a cache response, coverage, retries or outer acquisition.
4. Successful empty core plus saved outer candidates is labeled `merged`, retaining only 15-mile provider coverage and incomplete selected-radius coverage.
5. A cancelled old-origin negative response cannot retire the new origin's saved pool.
6. Malformed provider patch metadata never creates coverage merely because saved candidates are present.

The author reported broad tests/build/typecheck results separately. This focused reviewer does not substitute those reports for independent full hosted/browser acceptance and has not claimed to execute a D2 browser suite.

## Negative evidence and expiry qualification

The destructive saved-pool retirement is conservative and bounded by the 92-record registry. It survives compatible category/radius changes, TTL expiration and cache eviction; unchanged static catalog content cannot regenerate a known closed identity in that namespace. Fresh positive provider evidence after negative expiry can return through live cache, which the independent test confirms.

The author explicitly intends a saved-pool namespace reset on location, Halloween mode or semantic-version replacement, matching the existing cache signature. Retirement is not an indefinite cross-location/global closure database. A namespace replacement can initialize the static registry again while provider evidence is reacquired. This is an explicit scope/semantics qualification, not a hidden freshness claim. No dates or affirmative Open Now evidence are manufactured during resets.

## Test amendments and maintainability

The two affected fixture-pool counts change from one to ten because nine existing local curated records are now correctly composed. Favorites filters isolate the original live/per-record fixture for existing action/copy/expiry assertions. The full-pool assertions remain; the original specific record still must be eligible and actionable. These adjustments preserve the tests' purposes rather than remove them.

The Phase 4 historical source hash amendment is whole-file pinned: the helper and JSON pin exact before/after hashes, the JSON itself has a pinned hash, and the retained before source is independently byte-equal to main. It replaces only the reviewed radial-session file for historical receipt evaluation. This is an explicit amendment of an immutable historical implementation receipt; it does not itself prove runtime behavior, which the before/after and independent tests address. Future source changes fail the new exact hash until separately reviewed.

No UI, CSS, provider timeout, provider core gate or catalog change is included. The current review is tied to this exact SHA/tree and does not transfer to a later revision or a combined PR #73+D2 merge result.

## Next gate

Keep D2 isolated and unmerged. Preserve original failed controls and the reviewer checks. Run exact-head hosted validation and the relevant actual application/browser flows, including Kansas City failed-provider behavior, radius/category changes, relocation, negative evidence and date rollover. Record the namespace-reset qualification in the candidate proposal. Separate owner approval is required before merge/deployment.
