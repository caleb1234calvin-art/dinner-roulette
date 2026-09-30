# Pick For Us — V-F03-01 Verification

Repository: caleb1234calvin-art/dinner-roulette
Branch: audit/seasonal-discovery-coverage-1

Immutable target: 4f90ca5c1ae614cf66fdd40ab6dd33d2c906c969
Expected tree: d8328423a4a3043887dba5087787735fc4112aad
Expected sole parent: c7fa7a87109624212379270df8f52ddd4c334eb9
Frozen production main: 0a8f30dc57fcc1156342d1bfc8a07524f3125e3b

This is a fresh independent read-only verification of the targeted V-F03-01 remediation.

## Prohibitions

Do not modify, fix, commit, push, merge, deploy, run migrations, change Vercel, add venues, sign or publish Android artifacts, or upload to Play. If verification fails, preserve evidence and stop.

## Required reading

Read in full the original seasonal audit handoff/report/evidence, seasonal-discovery-remediation-1.md and its report/evidence, seasonal-discovery-remediation-1-verification.md and failed verification evidence, seasonal-discovery-remediation-1-verification-finding-1.md, and the targeted V-F03-01 remediation report/evidence.

The failed verification defines the counterexample. The targeted remediation handoff defines scope. Implementation evidence is a claim to verify.

## Integrity

Fetch fresh refs. Verify exact target SHA, tree, sole parent, ancestry from e7ad24dda7272843ca41e010de1444de365d9537, and current main. Verify later branch commits are documentation-only. Test a clean checkout pinned to the immutable target, not branch head. Verify prior audit/remediation evidence remains intact.

## Scope

Confirm the targeted implementation is limited to V-F03-01 lifecycle precedence, its regressions, evidence/reporting and continuity. Confirm no venue additions and no material change to F01 acquisition, F02 maze classification, F04 duplicate merging, F05 provenance/presentation beyond corrected F03 state, F06 disclosure, radius/dedupe thresholds, Dinner/Nightlife, casino data, shared location/GPS, Android, Vercel/build settings, packages/lockfile, or production URL.

## Primary counterexample

Independently reproduce the previously failing current-season record with status not-operating, activeFrom/activeUntil covering the tested season, and a revalidateAfter boundary that is crossed.

Immediately before and after expiry require:
- negative/not-operating status
- browseEligible false
- openNowEligible false
- Open Now OFF count 0
- Open Now ON count 0
- absent from options
- Pick cannot select it
- cannot participate in a seasonal plan

The bug is closed only if expiry no longer converts explicit current-season not-operating evidence into schedule-unconfirmed browse eligibility.

## Precedence safety

Verify the fix does not overcorrect. Check expired positive schedule uncertainty, schedule-unconfirmed, upcoming season, active known-open, known closed with OFF browsing, finished season, permanent/disused, next-season/new-year transition, Myer's retained calendar, minute/focus/visibility refresh, and count/options/result/plan consistency.

## Previously closed findings

Perform bounded non-regression verification that F01, F02, F04, F05 and F06 remain closed. Rerun the complete seasonal regression suite and inspect protected diffs/hashes. Do not redo the research audit absent new evidence.

## Full validation

Freshly run where supported:
- clean dependency install and complete dependency tree
- typecheck
- full JavaScript suite
- complete seasonal regression suite
- availability tests
- location-discovery tests
- relevant Python verifier tests
- changed-code lint
- casino invariants
- Android structure/icons
- Capacitor sync/tracked-byte stability
- migration-free production build
- git diff/whitespace
- secret/generated-junk sanity
- final clean checkout

Expected implementation claims: 393 JavaScript passes, four inherited documentation skips, 17 seasonal groups, 6 availability tests, 10 location-discovery tests, 3 Python tests, casino 883 canonical / 899 serialized / 60 catalogs. Do not double-count subsets.

## Browser and live-provider boundary

Attempt browser acceptance only if supported. If Chromium is unavailable, document that honestly. Component probes are not browser/RPC/hydration/CSS acceptance. Live provider access is not required for this deterministic lifecycle verification.

## Evidence

Cross-check targeted remediation evidence against Git and fresh results. Verify prior audit, remediation and failed-verification evidence was not rewritten. Verify source hashes and checkpoint linkage.

## Final state

End with exactly one:

V-F03-01 VERIFIED — SEASONAL DISCOVERY CANDIDATE READY FOR MERGE REVIEW

or

V-F03-01 VERIFICATION FAILED

Verified requires the prior counterexample closed, precedence safety cases passing, F01/F02/F04/F05/F06 remaining closed, required gates passing, no new blocker, and scope/evidence integrity.

This task does not authorize merge or deployment.

Report exact target/tree/parent, current main, integrity, targeted scope, before/after-expiry results, precedence interactions, five-finding non-regression, seasonal/full gate totals, browser status, evidence consistency, limitations, blockers, and final state. Stop after verification.
