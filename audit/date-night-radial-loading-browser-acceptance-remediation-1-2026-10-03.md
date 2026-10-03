# Date Night radial loading browser acceptance remediation 1

**DATE NIGHT RADIAL LOADING INCOMPLETE — REVIEW REQUIRED**

The shared Slider accessibility defect is fixed and freshly verified. All deterministic gates and the unchanged controlled browser harness pass. Bounded live acceptance does not pass: the two allowed outer patches each completed successfully but yielded zero eligible venues, so the required nonempty outer merge was not demonstrated. All three authorized public patch RPCs were used. No retries, speculative product changes, successful candidate freeze or promotion followed.

## Identity and scope

- Authority: `handoff/date-night-radial-loading-browser-acceptance-remediation-1`, `a1a6a2d2dc718e86f85e1b94769000d200262945`, read in full before runtime changes.
- Required implementation branch: `fix/date-night-radial-loading-browser-acceptance-remediation-1`, created directly from `7b33c6aeb34a625bb9ff0e6427f68821c27ddd74` (tree `16847a7f9c11c528bb95c8200b1affa5d245438e`, sole parent `028b2db775133f3343c41d1f8a0a4001d6ab122c`). Starting checkout was clean and ancestry linear.
- Only runtime path changed: `src/components/ui/slider.tsx`, at `1e140777a8ea1107ad8dcfdc8b01821197e6af79`. The current public Slider API, Root event/value props, keyboard/pointer handling, all class strings, focus/touch styling and distance ticks remain.
- All eight callers reviewed: six single-thumb controls and two existing two-thumb price controls. Names now reach Radix Thumb, the actual `role=slider`. `aria-labelledby` retains precedence; range names append minimum/maximum or value N, with unique hidden references for external labels. Unnamed ranges retain Radix defaults. No Date Night special case.
- Radial geometry/cache/provider/session code, every caller, existing controlled/live harnesses and external-blocking preload remain byte-identical. Dependencies/lock/config/auth/database/catalog/native/branding and prior audit evidence remain untouched.

## RED before runtime changes

The permanent `scripts/slider-accessibility-browser.mjs` renders the real React shared Slider and installed Radix in Chromium, with all network blocked. The fixture exercises every current label plus single/range external labels, multi-thumb naming, controlled Home/End/arrows, price callbacks and ticks. It preserves exact role/name queries.

[RED run37156707435](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/37156707435), job111301468825, unchanged-runtime `d02e9a0eecd63e1218ce8a9e13238f6d94ba027e`: **8 failed / 1 passed**. Both Travel distance and Cozy to adventurous return zero named slider matches. The retained DOM shows labels on Root and unnamed role=slider thumbs. Tick/root-prop check passes. No page errors or network requests.

The first test setup attempt at `51f76b0` failed because Vite returned a bundle array; no scenario ran and that attempt is not product RED. Its exact failure is retained. Only that new harness setup was corrected before meaningful RED.

[GREEN run37156889299](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/37156889299), job111301991317, corrected runtime `1e140777`: **9/9 passed**, including Home/End/arrows and controlled two-thumb price behavior. No page errors/network. Test cases and production acceptance selectors were not weakened.

## Fresh deterministic validation

| Gate | Result |
| --- | --- |
| Focused radial/cache/lifecycle/client tests | 183 passed, not added to full totals |
| Full npm test | 729 passed: 658 repository + 71 application; 4 inherited skips; 0 failures |
| Compiled TanStack security | 14/14 passed separately |
| Lifecycle/query parity | 154 audited cases / 111 authoritative negatives / zero gaps |
| Legacy cache / V-DR-02 | All 46 retained cases passed |
| Typecheck / changed-code lint / diff check | Passed; one harmless Fast Refresh export warning in test fixture |
| Dependency tree | Passed; package and lock bytes unchanged |
| Casino invariants | 883 canonical / 899 serialized / 60 catalogs |
| Android structure/icons | Passed; 15 launcher / 4 web icons |
| Python native verifier | 3/3 passed |
| Protected scope / secret / generated-junk review | Passed |
| Auth-enabled migration-free build/proof | Passed locally and on hosted runners |

Build uses only `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`, with capture/complete/verify. Never `npm run build` or migrations. Exact commands, exits, timing and lossless JSON-wrapped logs are retained.

The first local source fingerprint included ignored Python bytecode. A clean rebuild after moving that generated file out produces the same source proof as both hosted runs: `5388b042e42301bd45a418cd1ec28cdf2856422578c83d6c64a1719fb7cf27bd`, 426 files. Original and clean proofs retained. Output hashes are independently verified per build, not claimed byte-identical between environments.

## Fresh controlled acceptance: 10/10

[Run37157157228](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/37157157228), job111302786155, exact `abaaf680e9e54838e7002ce79f04166c4ebefedf` (tree `a16848f0cbe6b11e19fc4fdfcda6e4a69f584e93`, sole parent `1e140777a8ea1107ad8dcfdc8b01821197e6af79`). The branch-scoped workflow rebuilds/proves source and executes the original harness unchanged.

| Scenario | Fresh result |
| --- | --- |
| progressive-success | PASS; continuous 20 miles |
| middle-failure | PASS; truthful 15-mile inner coverage retained |
| outermost-failure | PASS; continuous 40 miles retained |
| options-stable | PASS |
| future-pick | PASS; new venue available to future selection |
| radius-increase | PASS; named slider End/Home; obsolete transport abort |
| radius-decrease | PASS; reuse core and abort obsolete transport |
| local-filters | PASS; named mood slider; no new RPC/cancellation |
| mobile-progress | PASS at 320px |
| all-stall | PASS; one RPC / 16 fixture attempts; truthful bounded fallback |

Zero public-provider calls, zero page errors, no horizontal overflow, no lifecycle fixture leakage. All screenshots reviewed in overview; mobile and outermost failure inspected full-size. The earlier five historical passes are not counted in this fresh ten. Artifact11285874117 ZIP hash `b5eab8fc73be6e9a034c0ddd968852b86a17c47ea8ad1361e9c53790c0d047f3` downloaded and verified.

## Bounded live acceptance: unmet outer-merge criterion

Exact READY/non-production Preview: `dpl_C692yUYPVQW4UbTKRwUzA1eMyj48`, [dinner-roulette-jdys9liwl-minions-9e2c.vercel.app](https://dinner-roulette-jdys9liwl-minions-9e2c.vercel.app), source `abaaf680e9e54838e7002ce79f04166c4ebefedf`. The live workflow explicitly checks out this same controlled source and verifies its fresh build.

First live launch(run37157445101) stopped before browser/RPC activity because the workflow omitted `BROWSER_ALLOW_EXTERNAL_HOST=1`. This documented opt-in was added for the already-authorized Preview; no guard/harness change. Raw failure retained, zero traffic in that attempt.

Actual [live run37157564340](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/37157564340), job111304053048, workflow commit `81194da07b7d6c2da93e39c0735ee498cc149379`:

| Patch | All group outcomes successful | Returned venues | Live venues | Observed RPC duration |
| --- | --- | ---: | ---: | ---: |
| core | Yes; seasonal valid-empty | 53 | 45 | 5,995 ms |
| 20:0 | Yes | 0 | 0 | 5,601 ms |
| 20:1 | Yes | 0 | 0 | 5,391 ms |

**A. Product usability:** Core usable in **7,629 ms**, with **53 eligible activities**, Pick enabled and truthful initial progress `Loaded through 15 miles · expanding toward 50 miles…`. The full live usability acceptance is **not passed**: `At least one real outer patch must merge live venues` fails because neither allowed outer patch returned eligible venues. Successful empty patches do not prove a product defect, and no cause is asserted. The harness stops before final filter/refetch/overflow assertions, so those later live checks are not claimed. Page errors collected: none. The failure screenshot visibly retains53 activities and truthful partial15-mile progress.

**B. Maximum-radius completeness:** Selected maximum50 miles; continuous coverage15 miles. Core and two20-mile sectors succeeded, but the entire20-mile band and outer bands were not completed. Complete50-mile coverage remains **unproven**. This bounded sequence deliberately cannot establish it.

Traffic: exactly **3 public patch RPCs**, in the required core/20:0/20:1 order; **48 theoretical physical provider attempts maximum**, actual physical count not instrumented. Three later outer RPCs were deliberately blocked by the harness, not observed provider outages. No monolithic50-mile acquisition. No additional public traffic or retry.

Live artifact11285898136 ZIP hash `9a24088e337475947f918ac4fd92a7ff9adf51c40cff78130e8990fcf816c6d4` downloaded/verified; failure screenshot inspected. Raw controlled/live archives are preserved together as `date-night-radial-remediation-1-browser-evidence-2026-10-03.zip` (SHA256 `a607018796238adcadb8f0754d265bacf0a2c16ffe0b25a6c715566fff5a2e5e`).

## Preservation and next action

All remaining edits are evidence, continuation and scoped runner wiring. The final incomplete preservation commit has sole parent `81194da07b7d6c2da93e39c0735ee498cc149379`; resolve its literal SHA/tree from the unique commit introducing this report's companion JSON. Do not amend to embed a self hash. It is **not a successful immutable candidate freeze**.

Final fresh remote main remains `4d937e58d2a65567b54ac5271915bc85b498898b`; production remains READY `dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL` at that SHA with unchanged aliases. No merge, promotion, migration or production change.

**STOP for review of the unmet live nonempty-outer-merge criterion.** Keep the narrow slider fix, its RED/GREEN evidence and fresh10/10 acceptance. Do not weaken assertions, invent a product defect, broaden traffic, retry public providers or change radial internals under this remediation. A subsequent scoped decision is needed for any further live validation or diagnosis; do not claim successful-candidate independent verification readiness.

SAFE TO RESUME — INCOMPLETE ACCEPTANCE PRESERVED.
