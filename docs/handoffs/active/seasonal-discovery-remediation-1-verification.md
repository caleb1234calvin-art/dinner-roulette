# Pick For Us — Seasonal Discovery Remediation 1 — Independent Verification

Repository: `caleb1234calvin-art/dinner-roulette`
Branch: `audit/seasonal-discovery-coverage-1`

Immutable verification target:
`e7ad24dda7272843ca41e010de1444de365d9537`

Expected tree:
`60fd8520c685edfb4449ee089b208000880bf743`

Expected sole parent:
`c8a67a07053f76db140287727672e83954c586b3`

Frozen production main:
`0a8f30dc57fcc1156342d1bfc8a07524f3125e3b`

This is a fresh independent READ-ONLY verification. Do not modify, fix, commit, push, merge, deploy, run migrations, add venues, change Vercel, sign/publish Android, or upload to Play.

## Read in full

1. `docs/handoffs/active/seasonal-discovery-coverage-audit-1.md`
2. `audit/seasonal-discovery-coverage-audit-1-2026-09-29.md`
3. `audit/seasonal-discovery-coverage-audit-1-2026-09-29.json`
4. original audit evidence directory
5. `docs/handoffs/active/seasonal-discovery-remediation-1.md`
6. `audit/seasonal-discovery-remediation-1-2026-09-29.md`
7. `audit/seasonal-discovery-remediation-1-2026-09-29.json`
8. remediation evidence directory
9. current continuity as needed

The audit defines the defects. The remediation handoff defines permitted scope. Implementation evidence is a claim to verify.

## Integrity

Fetch fresh refs. Verify exact target, tree, sole parent, ancestry, and clean detached checkout. Test the immutable target, not a later branch head.

Verify all 36 original audit artifacts remain byte/hash identical. Expected report SHA-256:
`800bafee5197e44ded6a1017bda87468d53a0716ef7d2adcc6e0787913e7a213`

Expected JSON SHA-256:
`d133ce1059d200ac340bd0a9ffdcb6a72a0b5287b0c26d802223772ad95848a0`

Verify no hard-coded audit reference venue list, radius widening, nearby-dedupe widening, unrelated feature work, package drift, or production catalog venue additions.

## F01 acquisition

Verify bounded query expansion independently. Prove the retained Exeter `tourism=theme_park` representation reaches the real search-handler path when qualifying. Confirm theme parks/farms/parks/attractions do not become seasonal without positive activity evidence. Confirm radius/mirror architecture and ordinary Date Night behavior remain intact.

## F02 maze classification

Verify Turtle Moon, generic maze, hedge maze and meditation labyrinth are negative. Verify genuine corn/maize positives remain positive. Fail if arbitrary name guessing can turn unrelated places into corn mazes.

## F03 availability/lifecycle

Exercise the actual visible eligibility path:
- active + known open → ON included
- known closed → OFF included / ON excluded
- hours unknown → OFF included / ON excluded
- schedule unconfirmed/expired → OFF uncertain / ON excluded
- upcoming → OFF upcoming / ON excluded
- finished/not-operating → excluded
- permanent/disused → excluded

Verify minute/focus/visibility refresh if implemented, and that count, pick, options, selected result and plan all use refreshed eligibility. Verify calendars do not silently roll forward.

## F04 duplicate category preservation

Verify C→P and P→C yield one venue with both categories, order-independently. Check provenance, stable identity, conflicting-hours handling, unique option IDs and distinct settle-stop plan validity. Confirm nearby-match thresholds did not widen.

## F05 status/freshness

Verify visible statuses distinguish closed, uncertainty, upcoming, active/open, and finished/unavailable states. Verify Myer's refreshed calendar comes only from retained authoritative audit evidence with provenance/check/revalidation data. Verify no other reference venue was imported.

## F06 source disclosure

Verify live contribution, saved-only contribution, missing selected categories, sparse-success, and outage/fallback are distinct. Count must equal actual eligible pool. Sparse success must not be called outage; outage must not be called live coverage. Verify per-category provenance.

## Regression layer

Freshly run and inspect the claimed 14 seasonal regression groups. Confirm they genuinely cover all 18 remediation requirements: Exeter acquisition; maze negatives/positive; pumpkin; haunt; availability states; lifecycle; all seven category unions; duplicate order; unique multi-category options; radius; sparse-vs-outage; count; disclosure; plan validity; ordinary Date Night.

## Full gates

Freshly run where supported:
- clean install
- npm ls --all
- typecheck
- full JS suite
- relevant Python verifier
- changed-code lint
- existing availability tests
- existing location-discovery tests
- casino invariants
- Android structure/icons
- Capacitor sync/tracked-byte stability
- migration-free production build
- diff/whitespace
- secret/generated-junk sanity

Expected implementation claims: 390 JS passes, 4 inherited skips, 14 seasonal groups, 6 availability, 10 location-discovery, 3 Python, 883/899/60 casino invariant, 15 launcher resources.

Do not double-count subsets.

## Browser

Attempt browser acceptance only if environment supports it. If unavailable, say so. Component harness/SSR is not browser/RPC/hydration/CSS acceptance.

## Live controls

If provider access permits, attempt Carthage, Joplin, Springfield, Lockwood rural and Aurora. Exact counts are not required. Mutable provider failure does not by itself fail deterministic verification. Verify truthful fallback/disclosure if providers fail.

## Evidence consistency

Cross-check remediation report/JSON against Git and fresh results. Verify claimed implementation hashes match target. Report discrepancies.

## Preserved invariants

Confirm no out-of-scope regression/change to Pick For Us branding, Dinner/Nightlife, casino catalogs, shared location/GPS/store except scoped harness interaction, Android source/config, Vercel/build settings, production URL assumptions, Halloween activation constants, package/lockfile, or production venue catalogs.

## Final state

End with exactly one:

`SEASONAL DISCOVERY REMEDIATION VERIFIED — CANDIDATE READY FOR MERGE REVIEW`

or

`SEASONAL DISCOVERY REMEDIATION VERIFICATION FAILED`

VERIFIED requires F01–F06 closed to authorized scope, regression coverage, required gates passing, no new merge blocker, bounded scope, and intact original evidence.

Report exact target/tree/parent; current main; integrity; F01–F06; regression mapping; all validation results; browser/live-provider status; evidence integrity; preserved invariants; limitations; new blockers; final state.

Do not modify anything. Stop after verification.
