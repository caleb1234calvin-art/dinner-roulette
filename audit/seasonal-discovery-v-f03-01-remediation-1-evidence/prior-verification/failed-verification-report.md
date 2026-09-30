# Pick For Us seasonal discovery remediation verification

**Result: verification failed. F03 remains open.** The immutable target passes the supplied regressions and repository gates, but a fresh component probe demonstrates that an explicitly non-operating current-season venue becomes browseable and selectable when its revalidation date passes. No source, catalog, original evidence, commit, branch, deployment, or production state was changed by this verification.

The task date is September 29, 2026, America/Chicago; execution occurred September 30 UTC. Authority is `docs/handoffs/active/seasonal-discovery-remediation-1-verification.md` from the requested branch, together with the full original audit/remediation handoffs, reports, machine records, and retained evidence. Implementation claims were checked against Git and fresh execution rather than accepted as verification.

## Exact state and integrity

| Item | Verified value |
|---|---|
| Repository | `caleb1234calvin-art/dinner-roulette` |
| Requested branch | `audit/seasonal-discovery-coverage-1` |
| Tested target | `e7ad24dda7272843ca41e010de1444de365d9537` |
| Target tree | `60fd8520c685edfb4449ee089b208000880bf743` |
| Sole parent | `c8a67a07053f76db140287727672e83954c586b3` |
| Audited ancestor | `4f6bf5fde5ffb1f4e99b34584ebd4e767ba39ac3` |
| Main at start and final remote read | `0a8f30dc57fcc1156342d1bfc8a07524f3125e3b` |
| Branch head at start and final remote read | `478eab0744af523d570783e56eb68ca1ee9bb3fb` |
| Checkout | Detached at the target; clean before and after verification |

Fresh authenticated GitHub reads supplied the remote refs, target Git commit/tree/parent, and verification handoff. The later branch head is the verification-handoff commit and has the target as its sole parent; it was not substituted for the tested target. Command-line access through the managed Git endpoint lacked credentials. A fresh isolated clone of the available local Git object repository supplied the checkout; its full target SHA/tree/parent matched the fresh remote Git objects. No GitHub write operation was used.

The parent, audited checkpoint and frozen main are ancestors of the target. Git history resolves the commit introducing the remediation JSON to the exact target. All **36 original artifacts** match both the parent bytes and their claimed SHA-256 values. The original manifest's 35 entries and remediation manifest's 32 entries match; manifests exclude themselves. All **17 implementation hashes** match the target. All **20 original audit source hashes** match the original audited commit. Evidence inventory and machine records were fully read and parsed; detailed validation is in `integrity.json` and `final-repository-checks.json`.

Original report SHA-256: `800bafee5197e44ded6a1017bda87468d53a0716ef7d2adcc6e0787913e7a213`.

Original JSON SHA-256: `d133ce1059d200ac340bd0a9ffdcb6a72a0b5287b0c26d802223772ad95848a0`.

## Finding outcomes

| Finding | Outcome | Fresh evidence |
|---|---|---|
| F01 acquisition | CLOSED to authorized bounded scope | Actual query includes `tourism=theme_park` within the unchanged 80,467-meter cap. The retained Exeter node reaches the real validator/handler and eligible OFF pool at about 42.06 miles. Generic place contexts remain non-seasonal without activity evidence. Ordinary queries and four-mirror failover remain intact. No complementary operator inventory or improved live recall is claimed. |
| F02 maze classification | CLOSED | Turtle Moon, generic/hedge/meditation mazes, ordinary farms/parks/attractions/theme parks, and unrelated corn-maze-named shops/restaurants/museums are negative. Exact corn/maize tags, corn-qualified mazes, and supported activity metadata are positive. The independent group adds 13 negative and eight positive fixtures. |
| F03 availability and lifecycle | **OPEN — verification failure V-F03-01** | Required nominal states and minute/focus/visibility refresh pass. However, expiry takes precedence over an explicit current-season `not-operating` record, allowing it into OFF count/options/pick. Details below. |
| F04 duplicate category preservation | CLOSED | C→P and P→C match, and six independent three-category input permutations produce one identical stable venue, three retained provenance records and unioned categories. Conflicting live hours become unknown. Curated identity retains priority. One multi-category option cannot create a two-stop plan; a real distinct pair can. Existing nearby thresholds remain unchanged. |
| F05 status and freshness | CLOSED for the scoped presentation/calendar change | Options and selected results distinguish open, closed, unknown hours, uncertainty and upcoming. Ended/non-operating/permanent/disused labels are distinct and those nominal states are excluded. Myer's ten dates exactly match retained operator calendar evidence; source URL, checked date and revalidation date are present. Next-year calendars become unconfirmed, never silently roll forward. The F03 precedence defect is recorded under F03. |
| F06 source disclosure | CLOSED | Actual component rendering distinguishes complete live contribution, mixed live/saved, saved-only sparse success, missing selected categories and outage. Per-category evidence prevents a live ordinary duplicate from claiming live seasonal coverage. Counts match the eligible pool. Disclosure describes browseable source coverage before personal/Open Now filtering. |

## Verification failure V-F03-01

**Severity: IMPORTANT; blocks the handoff's VERIFIED state.** This is a supported-state policy counterexample, not a claim that a currently saved attraction is incorrectly operating in production.

Root cause: `src/lib/date-night/availability.ts`, `calendarState`, lines 63–68. When `revalidateAfter` has passed, the `due` branch returns `unconfirmed` before the code checks `status === "not-operating"`. `getDateNightAvailability` consequently sets `browseEligible=true`. The real DateNightHome count and actions honor that erroneous eligibility.

The probe first normalizes a qualifying pumpkin-patch fixture through the real search handler. It then supplies the model's supported `seasonalAvailability` field as controlled calendar evidence:

```json
{
  "status": "not-operating",
  "activeFrom": "2026-10-02",
  "activeUntil": "2026-10-31",
  "checkedAt": "2026-09-29",
  "revalidateAfter": "2026-10-09"
}
```

The current production calendars are both confirmed; this synthetic record is explicit and was not inserted into any production catalog. The visible component executes unchanged, with controlled clock/store/transport boundaries.

| Observation | October 9, 20:00 Chicago | October 10, 20:00 Chicago |
|---|---|---|
| Status | `not-operating-season` | `schedule-unconfirmed` |
| Browse eligible | false | **true** |
| Visible OFF match count | 0 | **1** |
| Offered in options | No | **Yes** |
| Pick action | Disabled | **Selects the non-operating fixture** |
| ON match count | 0 | 0 |

Expected: an explicitly non-operating venue for the still-current season remains excluded. This follows the verification handoff's “finished/not-operating → excluded” requirement. Expiry alone supplies no reopening evidence. The supplied suite tests not-operating and expiry separately but misses their interaction.

The failure was observed in the seven-group independent run and reproduced in a separate focused transition check. Evidence: `independent-probes.test.mjs`, `independent-probes.log`, `not-operating-confirmation.log`, and `not-operating-confirmation.json`. Six independent groups passed; one failed. The focused repeat is confirmation of the same defect, not another distinct finding or extra test pass.

## Regression mapping

All **14 supplied seasonal groups** were read, freshly executed, and found to exercise real application code through their stated harness boundaries. They meaningfully cover the nominal 18 requirements; they do not establish complete policy closure because of V-F03-01.

Group identifiers below are positional in `scripts/seasonal-discovery.test.mjs`: G1 Exeter, G2 classification, G3 duplicates, G4 lifecycle, G5 availability, G6 union/radius, G7 sparse/outage, G8 provenance, G9 ordinary/international/toggle, G10 component actions/unions/plans, G11 component status/refresh, G12 component uncertainty, G13 actual clock hook, G14 five-region replay.

| Requirement | Supplied coverage | Fresh assessment |
|---|---|---|
| 1 Exeter acquisition | G1 | PASS; independent predicate/handler check also passes |
| 2 Maze negatives | G2, G14 | PASS |
| 3 Corn positives | G1, G2 | PASS |
| 4 Pumpkin positives | G2 | PASS |
| 5 Haunted attractions | G2 | PASS |
| 6 Closed/upcoming OFF browsing | G5, G11 | PASS |
| 7 Unknown/unconfirmed excluded ON | G5, G9, G12 | PASS |
| 8 Active and known open included ON | G5, G11 | PASS |
| 9 Finished/non-operating/permanent/disused | G4, G5, G11 | Nominal cases PASS; **non-operating plus expiry FAILS independently** |
| 10 Seven category unions | G6, G10 | PASS |
| 11 C/P order independence | G3 | PASS; independent three-way permutations also pass |
| 12 One multi-category option | G10 | PASS |
| 13 Radius | G1, G6, G14 | PASS; cap/tolerances unchanged |
| 14 Sparse success versus outage | G7, G14 | PASS |
| 15 Eligible count | G10–G12 | PASS; count consistently reflects the pool, including exposing the F03 bad inclusion |
| 16 Saved-only disclosure | G7, G8, G11 | PASS |
| 17 Honest plan validity | G10 | PASS; independent closing-boundary plan invalidation also passes |
| 18 Ordinary Date Night | G9, G14; location suite | PASS |

The real clock hook's minute-boundary, focus/visibility and cleanup checks pass. Independent component checks confirm counts, subsequent picks, already selected results, options and plans refresh together: a two-venue open pool becomes one at closing, the closed selected result disappears, the plan becomes incomplete, and all disappear after the season ends. This is component/hook execution, not browser event/RPC/hydration acceptance.

## Fresh validation

Runtime: Node `v24.19.0`, npm `11.9.0`. Exact command strings and logs are also listed in the machine report.

| Gate | Result |
|---|---|
| Clean `npm ci` | PASS; 507 packages; package/lockfile unchanged |
| `npm ls --all` | PASS; exit 0 |
| `npm run typecheck` | PASS |
| Full JavaScript suite | **390 passes, 0 failures, 4 inherited external-documentation skips**; 319 repository plus 71 application passes |
| Seasonal regression subset | **14/14 PASS** |
| Existing availability subset | **6/6 PASS** |
| Existing location-discovery subset | **10/10 PASS** |
| Python Android verifier | **3/3 PASS** |
| Changed-code lint | PASS across all 17 claimed implementation/test/harness paths and the remediation live-control evidence harness |
| Casino invariants | PASS; **883 canonical / 899 serialized / 60 catalog files**; 39 complete jurisdictions |
| Android structure and icons | PASS; **15 launcher resources**, approved master unchanged |
| Capacitor sync and tracked-byte check | PASS; no tracked Android/config changes |
| Auth-enabled migration-free production build | PASS; direct Vite invocation, no migration command |
| Target diff/whitespace | PASS |
| Secret/generated-junk sanity | PASS for reviewed changes and private-key/GitHub-token/AWS-key patterns; no tracked generated outputs; not an exhaustive secret audit |
| Additional independent probes | **6 groups PASS, 1 FAIL**; focused failure confirmation also reproduces |
| Browser acceptance | UNAVAILABLE; launch missing executable; fresh Chromium installation failed |

The 14 seasonal, six availability and ten location tests are subsets of the 390 JavaScript passes and are not added again. Python and the independent verification probes are separate. Retained dependency warnings and casino duplicate-reconciliation notices do not represent new gate failures.

Safe build command: `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`. The repository's `npm run build` includes a migration and was not used.

## Browser and live controls

Fresh Playwright launch failed because Chromium was absent. A fresh `node node_modules/playwright/cli.js install chromium` attempt also failed with invalid/truncated archive download errors. No browser/RPC/hydration/CSS, production smoke, native device or Gradle acceptance is claimed.

All five live controls used the target's native fetch, real handler, 50-mile radius, H+C+P selection and Chicago time. Controls ran concurrently in isolated processes; each retained the unchanged sequential four-mirror architecture. All 20 requests failed: **17 timeouts, two HTTP 504 responses and one HTTP 429 response**. No fresh seasonal inventory, successful live query acceptance or recall improvement is claimed.

| Origin | Final mirror outcome | Source | OFF / ON seasonal pool | Disclosure |
|---|---|---|---|---|
| Carthage | 429 after three timeouts | fallback | 2 / 0 | Live map unavailable; saved haunts; maze/patch missing |
| Joplin | 504 after three timeouts | fallback | 2 / 0 | Same distinctions |
| Springfield | Four timeouts | fallback | 0 / 0 | Live map unavailable; all selected seasonal categories missing |
| Lockwood rural | 504 after three timeouts | fallback | 2 / 0 | Saved haunts; maze/patch missing |
| Aurora | Four timeouts | fallback | 2 / 0 | Saved haunts; maze/patch missing |

Five original regional provider captures were independently replayed by fresh execution of G14. Turtle Moon is absent from seasonal eligibility, option identities remain unique, radius checks hold, ordinary Date Night survives and successful retained responses are not relabeled outages. Retained replay and fresh provider failures remain separate evidence categories. Provider failure does not cause this verification's FAILED conclusion; V-F03-01 does.

## Scope, consistency and limits

No hard-coded audit reference venue list, venue additions, radius widening, nearby-deduplication widening, package drift, or unrelated feature work was found. Only the existing Myer weekly-hours value changes in the seasonal production catalog; its dated calendar evidence changes in the scoped availability model. No other reference venue is imported. Existing catalogs and production identities remain intact.

Protected-path Git comparisons are empty for packages/lockfile, Android/config/native-web, Vercel/Vite settings, Dinner restaurant data/source, Nightlife/casino data/source, shared location/GPS/store, seasonal activation constants and the ordinary Date Night catalog. Shared overlay changes are Date Night-specific; ModeHome's scoped clock refresh updates seasonal activation. No unrelated branding change or production URL change was found. Full regression and targeted source review support preservation; browser and physical-device behavior remain unverified.

The remediation report/JSON agree with fresh Git identities, source hashes, supplied test totals and gate outcomes. Their broad claim that non-operating venues are always excluded is disproved by V-F03-01. The original evidence is intact; no original conclusion was rewritten. No other evidence discrepancy was identified. Provider outcomes differ from the implementation run's 20 timeouts because these are new mutable requests.

The policy failure uses a supported synthetic calendar record, not an observed live closed attraction. Current built-in calendars are confirmed. Component tests replace transport, hooks/store, portals and some leaf controls; a passing harness does not verify browser events, framework RPC, hydration or layout. Viewer-local schedule evaluation and the lack of a maintained operator/event ingestion inventory are disclosed inherited/scope limitations. A fresh verification session performed this work; prior implementation evidence is explicitly treated as claims.

All verification probes/reports/logs are outside the checkout. Final HEAD/tree are unchanged, `git status --porcelain=v1` is empty, and fresh remote main/branch refs are unchanged. No fix, repository modification, commit, push, merge, deployment, migration, Vercel change, Android signing/publication or Play upload was performed. Stop after this report.

SEASONAL DISCOVERY REMEDIATION VERIFICATION FAILED
