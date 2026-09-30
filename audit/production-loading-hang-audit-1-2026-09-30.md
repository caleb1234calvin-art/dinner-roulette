# Pick For Us — Production Loading Hang Incident Audit #1

Date: 2026-09-30. All observation timestamps below are UTC; subtract five hours for America/Chicago. Authority: `docs/handoffs/active/production-loading-hang-audit-1.md`. Read-only audit; no remediation or release action.

## Result

**Two IMPORTANT reliability findings; no proven BLOCKER in this bounded production run.** A long seasonal loading state was reproduced twice. In the precisely started repeat, loading remained visible at **80.456 seconds** and had settled to two saved haunts by **90.571 seconds**. Dinner and ordinary Date Night also completed successful live searches during the audit. The owner's indefinitely pending Dinner event was **not reproduced or retrospectively traced**.

The demonstrated delay mechanism is an inherited sequential provider chain: Dinner and Date Night allow four separate 22-second attempts, approximately **88 seconds before fallback**. Native-clock failure injection measured **88.011 seconds for Dinner** and **88.012 seconds for Date Night**. Nightlife's existing aggregate deadline settled in **20.001 seconds**. An additional inherited client weakness allows loading to persist if the RPC promise itself never settles: no client timeout or cancellation signal is supplied.

These results do **not** establish that production is currently persistently or site-wide unusable. They establish a materially excessive fallback delay and a missing client settlement guarantee. The exact provider/network cause of the owner's screenshots remains unresolved. Source attribution to the seasonal release is unsupported.

**Rollback relevance: rollback would not remove implicated inherited/shared path.**

## Exact source and production identity

| Item | Verified value |
|---|---|
| Repository | `caleb1234calvin-art/dinner-roulette` |
| Frozen/current main | `66eed1409e1076bcea388f36891c31fa7fa3eb84` |
| Main tree | `c016f0f8ac934adb0494cfa479012993972011fc` |
| Previous main | `0a8f30dc57fcc1156342d1bfc8a07524f3125e3b` |
| Audit branch | `audit/production-loading-hang-1` |
| Audit HEAD | `6959ac4712bac0b26bca32879cce473e66b6eef3` |
| Audit tree | `63ad41ee6a2b25a3af02b2fb1333f994a5554292` |
| Audit sole parent | Frozen main above |
| Audit descendant diff | Only the incident handoff was added |
| Production alias | `https://dinner-roulette-chi.vercel.app/` |
| Production deployment | `dpl_Bd4mLsVSBtaYi5THxgdo1VqCs4qm` |
| Deployment URL | `https://dinner-roulette-8k8g1b5dr-minions-9e2c.vercel.app` |
| Provenance | Git / `main` / exact frozen SHA; production; READY; `iad1`; alias error null |
| Project | `prj_Duz6oRktFrLVIMK1DfAxZyxQCCwm` |
| Team | `team_iBSXkvS9Z7tu8o8AtW0vlDt7` |

Fresh remote fetch preceded diagnosis. Checkout and index were clean. The audit branch began exactly at frozen main plus the handoff. Read-only Vercel alias metadata matched the frozen revision before diagnosis and again at the end. A final fresh fetch preserved the exact main and audit refs; tracked product bytes and index remain unchanged. Only audit artifacts were produced locally; no commit or push was made.

Read: authoritative handoff in full; current TOP continuity; the September 30 seasonal promotion report and deployment evidence; the prior final production-impact reconciliation handoff and its owner-observed configuration; relevant source, tests, transport and configuration. TOP continuity still describes pre-verification historical state; the newer handoff, promotion evidence and fresh refs govern this audit.

Known production configuration: TanStack Start, Node 24.x, existing automatic Git deployment, previously owner-verified migration-free build override `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`. Package/lock/Vite/Vercel configuration are byte-identical to previous main. The ordinary package build still chains migration and was not run. Effective hosted build command and function maximum duration were not exposed by the connector; neither is freshly asserted from incomplete metadata.

## Production reproduction matrix

Ordinary anonymous cloud Chrome interactions against the exact production alias. The browser already had Carthage and seasonal preferences from the prior smoke; this was **not a fresh storage/device profile**. No GPS permission or physical user location was requested. The safely available current-location path used the existing Carthage setting, then Carthage was explicitly resolved through the manual form.

Audit policy: flag loading beyond **30 seconds** for UX review; stop any individual continuous observation by **100 seconds**. Thirty seconds is an audit threshold informed by Nightlife's existing 20-second budget, not a documented product SLA. Counts are eligible UI counts, not raw provider totals. Observations are interval-censored where polling did not catch the transition. Vercel timestamps identify request starts, not response completion.

| Case | Start / first loading | Last loading → first confirmed settled | Measured duration | Result / loading cleared |
|---|---|---|---|---|
| Initial persisted seasonal: Carthage, 50 mi, Haunted House + Corn Maze + Pumpkin Patch, Spooky ON, Open Now OFF | RPC logged 19:46:36; first visible 19:46:37.086 | 19:47:52.455 → 19:48:17.143 | >75.369 to ≤100.057 s from first visible sample; start is less precisely observed | Fallback, two haunts; cleared; first observation ended at the configured bound with result already present |
| Dinner current-location path: Carthage, 10 mi, Open Now ON | 19:48:28.267; loading immediately visible | Settled observed 19:49:51.162 | ≤82.895 s; no sufficiently late pending sample to call this a demonstrated long Dinner hang | 66 matches, no fallback notice; cleared |
| Dinner Open Now OFF, same pool | After prior result | Immediate filter result | No new discovery required | 71 matches; remains clear |
| Manual Carthage, Missouri resolution | 19:50:36.865 | Confirmed by 19:51:43.723 | ≤66.858 s observation bound, **not** a 66-second measured geocoder request | Manual success, exact visible label Carthage, Missouri, United States; same coordinates caused no additional discovery |
| Dinner manual Carthage, 5 mi, Open Now OFF | 19:52:03.920; loading visible after slider action | 19:52:05.660 | ≤1.740 s including action/observation overhead | 44 matches, no fallback notice; cleared |
| Dinner Open Now ON, same 5-mi pool | After prior result | Immediate filter result | No new discovery required | 42 matches; remains clear |
| Ordinary Date Night: manual Carthage, 50 mi, Anything ordinary, Spooky OFF, Open Now OFF | 19:52:35.741; request replaces prior seasonal-mode mount request | Snapshot confirmed cleared by approximately 19:52:39.5 | approximately ≤3.8 s including final snapshot overhead | 238 activities, no fallback notice; cleared |
| Nightlife control: manual Carthage, 10 mi, Anything, Open Now OFF | 19:53:53.151; loading immediately visible | 19:53:56.415 → approximately 19:54:34.3 | >3.264 to approximately ≤41.2 s, **not** a measured 40-second handler | Seven venues, no fallback notice; cleared |
| Seasonal repeat: manual Carthage, 50 mi, three required categories, Spooky ON, Open Now OFF | 19:55:26.143; loading immediately visible | 19:56:46.599 → screenshot at 19:56:56.714 | **>80.456 to ≤90.571 s** | Explicit live-map-unavailable fallback, two saved haunts; cleared |

The ordinary Date Night and Nightlife locator waits returned an internal selector deadline after about three seconds despite a longer requested timeout. Subsequent AX snapshots, not those failed waits, establish settlement. Raw timing records retain these limitations. Seasonal category toggles only change local filtering; the timed repeat's provider request began with Spooky ON and was not restarted by the three category selections.

All three discovery RPC identities were corroborated by deployment-scoped logs. UI success without a fallback notice indicates the live/merged path according to source; no browser response-body capture is claimed. The live seasonal text explicitly states saved places only for Haunted House and no places found for Corn Maze/Pumpkin Patch. Source failure precedes fallback; filtering did not create the loading delay. No non-extension warning/error was found in the retained bounded console capture. Extension metadata errors are retained and excluded from application findings.

## Complete request lifecycles

### Dinner

`ModeHome` mounts `PickHome`. `PickHome` owns local `places/loading/error/warning` state. Its effect at `src/components/pick-home.tsx:69–98` sets loading true, clears notices, and invokes `searchRestaurants({data})`. This is a direct TanStack server function, **not React Query**: no query key, query retry policy, result cache or query cancellation hook exists here. Dependencies are numeric latitude, longitude and filter radius. Open Now/cuisine/price/preferences filter the returned pool locally. Even 5/10-mile choices request at least 15 miles.

RPC POST → `src/lib/restaurants/search.ts` validator → `fetchOverpassPlaces` in `src/lib/restaurants/overpass.ts` → sequential mirrors → parsing/normalization → `mergePlaces` → serialized response. Each mirror POST has a native `AbortSignal.timeout(22000)`. HTTP failure, invalid JSON, missing elements or an Overpass remark rejects that attempt. Empty successful Dinner responses continue through remaining mirrors; any successful empty response ultimately permits an empty live result if no later nonempty result wins.

After all failures, the server returns a saved response when the origin is within 40 miles of Joplin; Carthage qualifies. Outside that coverage it throws the normalized restaurant error. Fallback uses the existing catalog/normalization path; it is not unavailable in Carthage, just reached late. `.then` sets places/warning, `.catch` empties places/sets error, and `.finally` clears loading for the active request. No client timeout is passed. Effect cleanup only marks a closure `cancelled`; it suppresses stale state writes but leaves the RPC/provider work running.

Timing: UI loading → M1 ≤22s → M2 ≤22s → M3 ≤22s → M4 ≤22s → fallback/error → RPC decode → active `.finally` → clear loading. There is no intermediate fallback display or progress escalation while the chain runs.

### Date Night, ordinary and seasonal

`DateNightHome` owns the corresponding local state (`src/components/date-night-home.tsx:151–196`). Same direct server-function pattern and `cancelled` guard; dependencies add Spooky Season and the derived boolean `halloweenActive`. Category and Open Now changes are local filters. The minute/focus clock refreshes availability; **the Date object is not a discovery-effect dependency**, so ordinary minute ticks with an unchanged boolean do not repeatedly restart discovery.

POST → `src/lib/date-night/search.ts` coordinate/radius validator → construct ordinary query plus seasonal clauses when active → compute nearby saved catalog → four sequential 22-second mirrors → classify/dedupe/merge → `{venues,source}` or saved `{source:'fallback',warning}`. Unlike Dinner, a valid empty first mirror returns immediately, merged with local entries. All-failure fallback requires local catalog entries; outside saved coverage it throws the last Error. Carthage has ordinary and seasonal saved coverage. The server does not return this available fallback until the mirror loop ends.

TanStack serializes the completed result/error; client transport deserializes it. `.then` sets venues/source/warning; `.catch` sets venues empty/error; active `.finally` clears loading. Seasonal coverage disclosure is displayed after loading settles. The observed long request is therefore compatible with upstream exhaustion while waiting **before** fallback, not a spinner that survives a completed fallback.

Timing: UI loading → ordinary/seasonal query → up to 4 ×22s → local fallback or terminal error → serialized RPC → active `.finally`. Seasonal query expansion may influence upstream cost, but no per-mirror measurements prove that it caused this incident. Ordinary Dinner shares neither these clauses nor Date Night eligibility code.

### Nightlife control

`NightlifeHome` (`src/components/nightlife-home.tsx:45–74`) has the same client state/effect/cancellation pattern and direct POST. `src/lib/nightlife/search.ts:88–91` uses the same mirror list, but a deadline `Date.now()+20000` and per-attempt timeout `min(8000, remaining)`. All-stall sequence is approximately 8s + 8s + 4s; no fourth attempt remains. It then returns nearby curated fallback or throws outside coverage. Live/curated merge and `.finally` settle normally. Nightlife controls the server-side long-wait hypothesis but still lacks a client watchdog and transport abort.

### Shared transport, location and cancellation

The installed, lockfile-matched TanStack transport source (`@tanstack/start-client-core/src/client-rpc/serverFnFetcher.ts`) forwards `first.signal` to `fetch`; callers supply none. It awaits the HTTP response and serialized JSON/framed decoding without adding a timeout or retry. `createServerFn.ts` supports a signal; the application's callers do not use it. No database query is in these anonymous discovery paths. No application-level discovery cache or coalescing was found. Logged requests show cache MISS. Changing modes, radius or location can leave superseded server work in flight even though its response is ignored.

Manual location lookup is a separate POST to Nominatim with one 12-second upstream timeout. Device location has a 10-second geolocation option, commits coordinates before a separate 12-second reverse-name lookup and does not wait for that label to start discovery. The location controller has latest-intent IDs and invalidation; the discovery components use closure guards. None supplies a network abort signal to these RPCs. No evidence ties the observed seasonal wait to geocoding: the origin was already resolved and unchanged.

## Aggregate timeout accounting

| Chain | Attempts / delays | Intended upstream budget | Total UI implication |
|---|---|---|---|
| Dinner | Up to four sequential mirrors; 22,000 ms each; no extra retries/backoff | **88,000 ms**, plus scheduling/parse/merge overhead | No client deadline; fallback waits until chain completes |
| Date Night ordinary/seasonal | Same four sequential mirrors and no backoff | **88,000 ms**, plus processing | Same; local seasonal fallback is withheld until failure settlement |
| Nightlife | Up to four mirrors; min(8,000 ms, remaining 20,000 ms); all-timeout path uses three | **20,000 ms**, plus processing | Client can still outlive server budget if transport never settles |
| Manual geocoder | One 12,000-ms request | **12,000 ms**, plus processing | Cold manual intent followed by worst discovery ≈100s before results; each RPC still lacks a client cap |
| GPS + discovery | GPS option 10,000 ms; discovery starts after coordinates | ≈10s +88s, or +20s for Nightlife | Reverse naming adds up to 12s in parallel with discovery, not serially before it |

Overpass QL `[timeout:20]` is a provider query limit, not an additional 20 seconds to add to the 22-second fetch and not an end-to-end UX deadline. AbortSignal's request budget normally covers pending headers and body reads; it cannot preempt synchronous parse/normalization or an implementation ignoring abort. Native abort tests prove normal signal-compliant settlement. No actual browser/Node failure to honor abort was demonstrated.

The Vercel function's effective maximum duration is **unknown**. Repository `vercel.json` and the retained matching-build `.vc-config.json` contain no explicit maxDuration; metadata does not expose project overrides. Therefore a server cutoff before fallback is a conditional risk, not an established incident cause. If effective platform duration is less than the application chain plus overhead, the platform may terminate before fallback; if the resulting network error reaches the client, `.catch/.finally` should clear loading. No deployment 5xx/504 evidence was returned here.

There is **no finite application-enforced end-to-end bound** for an unresolved client RPC. The 88/20-second figures are intended provider budgets under normal abort behavior, not unconditional wall-clock guarantees for the browser.

## Provider and infrastructure evidence

All three modes use, in order:

1. `https://overpass.openstreetmap.fr/api/interpreter`
2. `https://overpass.private.coffee/api/interpreter`
3. `https://maps.mail.ru/osm/tools/overpass/api/interpreter`
4. `https://overpass-api.de/api/interpreter`

These are separate server requests and query bodies against a shared external provider set, not one shared unresolved promise. Independent provider/query failures can produce the same UI symptom. No per-mirror application logging identifies which failure/status/duration occurred in production. All failures are caught; a successful fallback can therefore appear as HTTP 200 without an error log.

Runtime logs **were available**. Requests at 19:46:36, 19:48:28, 19:52:04, 19:52:35, 19:53:53 and 19:55:26 correlate with browser actions and the expected RPC paths. Final production alias remains READY at the frozen SHA. Deployment-scoped 5xx and 429 queries from 18:19:27 through approximately 19:59 returned no matching logs; runtime error query returned none. This does **not** prove upstream health or absence of provider 429/504 because those exceptions are swallowed by the mirror loops.

RPC mapping, corroborated by the retained matching executable build manifest and current log paths:

| Function | POST path suffix after `/_serverFn/` |
|---|---|
| Dinner | `98643e628e23400f0229d25a4e6b98ee2ba6cb3e2d9b5a7d0d1cf9f1a3f0571a` |
| Date Night | `608c34308c11ff23ec95123e13645a3f5e73aa32bd73cdd2742409e0d31b0253` |
| Nightlife | `19f4a1d3d706509159de41d77dab873c4c976e6d810eeb0596ed0165be4cdde7` |
| Manual location | `a95e7d898aaef5e0521ccb01b6f82cde606b9b517f4ba2b4b8e3c721b843a591` |

An auxiliary command-line RPC capture was unsuccessful: the first harness attempt failed locally for missing Start runtime context; the serializer-only attempt received four immediate plain `Forbidden` 403 responses at 19:54:31–32. These audit-generated requests are explicitly identified in raw evidence and must not be attributed to the user's incident or provider health. They lacked normal browser request context; no security setting was changed or protection bypassed. No successful direct-HTTP response timing is claimed. The grouped-log response also stated three distinct values while displaying only 200/403; targeted 5xx/429 queries, rather than that inconsistent total, support the bounded error statement.

## Previous-main comparison and attribution

`source-comparison.json` records exact old/new Git blob IDs for 17 files. **Fourteen are identical**, including Dinner component/server/provider/geocoder, Nightlife component/server, generic discovery status, location component/controller, store, package/lock, Vite and Vercel configuration. The seasonal runtime diff contains 14 source files, centered on Date Night query/classification/eligibility/availability/coverage/clock and optional Date Night overlay presentation. Shared mode-home clock changes do not replace Dinner's request effect or dependency values. No provider mirror, RPC transport dependency, generic loading component, deployment config or Dinner discovery change was introduced.

Date Night's timeout loop and finally/cancel guard remain inherited despite its query/data/UI changes. Independent execution of previous main gives the **same 88s Dinner / 88s Date Night / 20s Nightlife** all-mirror-failure schedule and fallback. The same 24 component lifecycle scenarios also pass against previous main, including the missing watchdog observation. Rollback would remove seasonal coverage fixes while preserving the demonstrated loading weaknesses. Seasonal changes may expose heavier-query latency; the available evidence cannot quantify that contribution or prove a particular upstream outage.

## Deterministic failure injection

Temporary audit-only probes execute actual validators, handlers, normalization and components without changing product files. Provider network calls and clocks are substituted where declared; component hooks, RPC promises and leaf controls are modeled. **These are not browser hydration, actual HTTP serialization or physical-device acceptance tests.** Current locked dependencies were reused; no clean-install/full-suite/build claim is made.

| Probe | Coverage | Result |
|---|---|---|
| Current provider probes |33 groups: three modes × nine local provider scenarios, three outside-coverage errors, three native real-time chains | All expected assertions pass |
| Abort-controlled unresolved provider | Actual native AbortSignal timers, each mock request pending until abort | Dinner88.011s → fallback133 raw places; Date Night88.012s → fallback15 raw venues; Nightlife20.001s → fallback18 raw venues |
| Other provider failures |429,500,504, missing-elements JSON, invalid JSON, body pending until abort | All modes settle to local fallback; no added retries beyond mirror loop |
| Partial recovery | First mirror times out, second returns valid fixture | Successful live/merged response; provider wait22s for Dinner/Date Night or8s for Nightlife in virtual accounting |
| Empty provider result | Valid empty JSON | Dinner tries remaining mirrors; Date Night/Nightlife return/merge immediately; not confused with malformed/error |
| Outside local coverage | All providers reject, Toronto origin | All modes reject; no unrelated Joplin fallback leaks |
| Current component probes |24 groups: success, fallback, error, AbortError, never-settling transport, two stale-order cases, unmount/remount for each mode | Settled cases clear loading; pending transport fails the desired finite-settlement guarantee |
| Unresolved client RPC | Virtual timers advanced10 minutes; zero watchdog timers registered; no request signal supplied | All three components remain loading; deterministic client liveness gap |
| Stale replacement | Old resolves after new; old rejects before new | Old response cannot overwrite new result or clear active spinner; new settlement clears loading |
| Navigation/unmount | Cleanup then old settlement; separate remount | No state writes after cleanup; remount's settled request clears; old transport is not aborted |
| Previous-main provider/component controls |3 timeout chains +24 lifecycle groups | Same timeout and client-gap behavior |
| Existing targeted tests | `node --test scripts/location-discovery.test.mjs scripts/seasonal-discovery.test.mjs scripts/casino-discovery.test.mjs` | **41 passed, 0 failed, 0 skipped** |

Total new audit scenario groups: **84** (33 + 24 + 3 + 24). A passing probe may deliberately confirm an undesirable behavior, such as an unresolved RPC keeping loading active; it does not mean the product has passed a finite-settlement acceptance gate.

## Findings and exact missing coverage

### PLH-F01 — IMPORTANT — excessive inherited aggregate provider wait

Dinner `overpass.ts` and Date Night `search.ts` retry mirrors sequentially with independent 22s signals but no shorter shared budget. Available saved results are not displayed until all attempts fail. Native-clock all-stall execution proves roughly 88s, and live seasonal repetition remained loading at 80.456s before fallback by 90.571s. This meets the handoff's IMPORTANT definition: eventual settlement with an unreasonable UX delay. It does not prove a truly infinite provider operation. Existing Nightlife 20s behavior supplies a practical model for the smallest correction.

### PLH-F02 — IMPORTANT — inherited RPC loading has no end-to-end deadline or transport cancellation

All three discovery components rely exclusively on promise settlement to reach `.finally`, passing no signal and scheduling no watchdog. The real components remain loading after 10 virtual minutes with a pending RPC. Cleanup suppresses state updates but does not cancel network/provider work; navigation and replacement can leave unnecessary work running. Settled success/fallback/error/AbortError and stale ordering behaved correctly. This is a proven resilience defect under a stalled transport, but no live request remained indefinitely unresolved during this run; escalation to a current production BLOCKER is not supported by available observations.

### PLH-F03 — NON-BLOCKING — missing timing/settlement regression coverage and upstream observability

`scripts/location-discovery.test.mjs` covers immediate offline errors, malformed/remark responses, empty results, local fallback, foreign error and validation across modes. `scripts/casino-discovery.test.mjs` covers immediate fallback/merge. Seasonal tests cover source disclosure and actual Date Night component behavior with promptly resolved provider fixtures, plus clock lifecycle. Location-controller tests cover stale GPS/manual intents; these do not prove discovery RPC liveness. Existing tests do not enforce a cumulative outage budget for Dinner/Date Night or a client deadline; do not simulate slow sequential aborts/body stalls; and do not systematically prove all three components' fallback/error/abort/navigation/stale settlement. Fallback and merge tests alone missed 88 seconds of waiting. Upstream status/timing is not emitted by current discovery loops, so an HTTP 200 fallback conceals the underlying provider error sequence.

## Smallest systemic remediation recommendation — not implemented

1. Apply one shared **20-second provider-chain budget**, with each mirror capped at `min(8 seconds, remaining)`, across Dinner, ordinary/seasonal Date Night and Nightlife. Include response-body completion; never begin another attempt once exhausted. Preserve current validation, empty-result semantics, catalog coverage and honest source disclosure. On budget exhaustion return the existing local fallback or a normalized terminal error. No catalog edits or provider replacements are required.
2. Add a shared client discovery lifecycle with a **25-second overall watchdog**, an AbortController supplied to the supported TanStack RPC `signal` option, and explicit loading settlement on timeout. Abort on cleanup/replacement; retain latest-request guards. The watchdog must settle UI independently of whether fetch honors abort. A transport timeout should show an actionable retry/error state, not fabricate a saved result that was never received. An abort reaching `.catch` already works; merely requesting an abort without a settlement guarantee is insufficient.
3. Validate an effective platform duration comfortably beyond the application/provider budget during a separately authorized remediation/verification task; retain a margin for serialization. No settings change is recommended blindly. Propagate cancellation where supported so abandoned server work can stop; retain the server deadline even if a disconnect is not propagated.
4. Permanently add cross-mode fake-clock and selected native-clock tests for the scenario matrix above, plus transport/body-hang and active-request timeout acceptance. Assert provider fallback/error within 20s plus bounded processing and UI settlement within 25s plus scheduling tolerance. Verify normal filters, stale replacement and navigation. Add bounded structured timings/source/outcome logging without precise location payloads so future200 fallbacks can be diagnosed.

This is a focused deadline/cancellation/settlement correction. Query/catalog redesign, migrations, provider switching, rollback and release changes are outside this audit.

## Limitations, incident classification and stop

The owner's original device/network session was not instrumented; screenshots alone do not reveal elapsed time or a request identity. No physical Android/WebView, permission-granted GPS, fresh-storage default-Joplin run or mobile background suspension was tested. The available current-location path was explicitly exercised. Browser network body/response timestamps and server per-mirror traces were unavailable. Live timing is reported as bounded observations, never replaced by deterministic timing as if it were measured production telemetry. Effective platform maxDuration and upstream 429/504 incidence remain unknown. The unsuccessful auxiliary403 requests are separated from incident evidence. No claim of an ongoing upstream outage, browser abort defect, seasonal-introduced Dinner regression or site-wide unavailability is justified.

At the end, production still resolves to the frozen READY deployment, all tested modes have settled, and the seasonal view shows two saved haunts with honest fallback disclosure. The incident remains **unfixed**. Two IMPORTANT remediation items and one NON-BLOCKING coverage/observability item are documented; no demonstrated current BLOCKER. Rollback would not remove the implicated inherited paths.

No product/catalog modification, implementation commit, push, merge, deployment/redeployment, Vercel setting change, migration, rollback, venue addition, signing or publication occurred. Audit stopped after report/evidence production.

PRODUCTION LOADING INCIDENT — REMEDIATION RECOMMENDED
