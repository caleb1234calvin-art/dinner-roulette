# Pick For Us — Seasonal Discovery Remediation 1 — Verification Finding V-F03-01

Repository: `caleb1234calvin-art/dinner-roulette`

Branch: `audit/seasonal-discovery-coverage-1`

Failed verification target: `e7ad24dda7272843ca41e010de1444de365d9537`

Failed target tree: `60fd8520c685edfb4449ee089b208000880bf743`

Frozen production main: `0a8f30dc57fcc1156342d1bfc8a07524f3125e3b`

Independent result: `SEASONAL DISCOVERY REMEDIATION VERIFICATION FAILED`

This is a narrowly scoped implementation task for exactly one independently proven defect: **V-F03-01**. F01, F02, F04, F05 and F06 passed verification and must not be reopened.

## Read first

Read in full the original seasonal audit handoff/report/evidence, `docs/handoffs/active/seasonal-discovery-remediation-1.md`, `docs/handoffs/active/seasonal-discovery-remediation-1-verification.md`, the remediation report/JSON/evidence, and the independent failed-verification report/evidence if available.

Before modification fetch refs, verify branch/ancestry, verify `e7ad24d...` remains in ancestry, verify main, verify all later commits are documentation-only, and verify a clean checkout. Stop if any later executable change exists.

## Defect

Independent verification proved that an explicitly current-season `status: "not-operating"` record becomes browseable/selectable with Open Now OFF after `revalidateAfter` expires.

The identified cause is precedence in `src/lib/date-night/availability.ts` / `calendarState`: expiry/due returns `unconfirmed` before explicit `not-operating` is honored.

Observed transition:

Before expiry:
- `not-operating-season`
- browseEligible false
- OFF count 0
- absent from options
- Pick disabled

After expiry:
- `schedule-unconfirmed`
- browseEligible true
- OFF count 1
- offered in options
- Pick selects it

ON remains 0, but policy requires explicit not-operating to remain excluded.

## Required behavior

An explicit negative lifecycle/calendar state must outrank freshness expiry. Expiry may indicate that evidence is due for recheck, but it must not manufacture possible operation from explicit `not-operating` evidence.

For the applicable/current season, `not-operating` must remain:
- browse ineligible
- Open Now ineligible
- excluded from count
- excluded from options
- unpickable
- unable to participate in a plan

until new positive evidence intentionally changes the stored lifecycle/calendar state.

Do NOT make every expired calendar negative. Preserve intended expiry semantics for positive/unconfirmed records.

## Required regression

Add a permanent regression for `not-operating + expired revalidateAfter` through actual component/application behavior.

Verify both before and after expiry:
- lifecycle/status remains non-operating
- browseEligible false
- openNowEligible false
- OFF count 0
- ON count 0
- no option
- Pick cannot select it
- no plan participation

Also prove no regression to:
- ordinary expired/unconfirmed calendar behavior
- upcoming season
- active known-open season
- closed-now OFF browsing
- finished-season exclusion
- permanent/disused exclusion
- Myer's retained calendar
- minute/focus/visibility refresh
- count/options/result/plan consistency

## Scope lock

Only modify what is directly required for V-F03-01, its regression, remediation evidence and continuity.

Do not change acquisition queries, maze classification, duplicate merging, source disclosure, real venue catalogs, radius, dedupe thresholds, Dinner/Nightlife, casino data, shared location/GPS, Android, Vercel/build settings, packages/lockfile, or production URL.

Do not add venues. Do not merge. Do not deploy. Do not run migrations. Do not publish.

## Validation

Run at minimum:
- targeted lifecycle/availability tests
- seasonal regression suite
- actual component regression for V-F03-01
- full JS suite
- typecheck
- changed-code lint
- location-discovery tests
- relevant Python verifier tests
- casino invariants
- migration-free production build
- Android structure/icons and Capacitor byte stability if required by current project standard
- `git diff --check`
- secret/generated-junk sanity

Browser acceptance may be attempted if available; document honestly if unavailable. Live provider access is not required for this lifecycle fix.

## Evidence

Create separate remediation evidence for V-F03-01. Do not rewrite the original audit, original remediation, or failed verification evidence.

Record starting SHA/tree, changed paths, exact precedence change, regression, commands/results, hashes, limitations and checkpoint linkage.

## Commit/push/stop

If the narrow fix and gates pass, commit and push to `audit/seasonal-discovery-coverage-1`, report exact SHA/tree/sole parent, confirm clean working tree, and stop.

Successful state:

`V-F03-01 REMEDIATED — AWAITING INDEPENDENT VERIFICATION`

Otherwise:

`V-F03-01 REMEDIATION INCOMPLETE — REVIEW REQUIRED`

A fresh Astra must independently verify the new immutable checkpoint before merge review.
