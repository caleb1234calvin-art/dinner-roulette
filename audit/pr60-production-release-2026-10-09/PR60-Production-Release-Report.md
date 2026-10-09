# PR #60 exact production release — operator acceptance PASS

Release performed 2026-10-09 19:44–19:55 UTC under owner message Sentinel_c4f9c5688f0081918bb02b3e25e01d18. This report closes scoped production acceptance, not repository continuity publication/readback, which is separately owned by the coordinator.

## Publication identity and authority

- Repository caleb1234calvin-art/dinner-roulette; PR60 integration/missouri-astra-push-2026-10-09.
- Approved and resulting main SHA fe22c15cc6442fc4a48fec23c9a1331c69d70bd2.
- Complete tree 8d5059c9fee871c522616971cce0a80b153e4d23; sole parent f767a8d2e8c6ffe1120dd5f1bb73d9215b8dfafd.
- Baseline979d83aede9d66163e1ebaed9ad5b219cb637882/treea7dbb32947c0a0daf4864346b0d212477fc9a11b freshly re-read immediately before write.
- Six-commit ahead / zero behind; merge base exactly979d. The complete32-path diff and ancestry were read. No source/test/dependency/config changes were made by this operator.
- Expected-head guarded, force:false update of main published exact fe22. Immediate readback matches exact SHA/tree/parent. GitHub PR60 automatically closed/merged at2026-10-09T19:48:14Z, merge_commit_sha exactlyfe22. No squash/rebase/generated merge tree; no separate historical PR merges.
- Main protected:false, protection.enabled:false, rulesets:[] freshly read. Dedicated protection endpoint403 is preserved as access qualification. Owner's exact PR60 one-attempt waiver applied and is consumed by this attempt. No repository rules/settings modified.
- Exact prepublication web check113724452856/run37901365412 SUCCESS; Android113724453244/run37901365396 SUCCESS; signing113725719122 SKIPPED. Prior exact-source1018tests/962browserchecks/426geometry accepted evidence retained, not rerun or added to new test counts.

## Production

- Deployment dpl_8xyE9R3BxyE1883QpavaEBWV2LGa.
- READY at2026-10-09T19:48:34.773Z.
- Git source fe22c15cc6442fc4a48fec23c9a1331c69d70bd2; branchmain; targetproduction.
- Immutable deployment URL https://dinner-roulette-55q5rf8y3-minions-9e2c.vercel.app/.
- All five aliases independently read after READY and point to8xy:
  - pickforus.app
  - www.pickforus.app (308 redirect to pickforus.app)
  - dinner-roulette-chi.vercel.app
  - dinner-roulette-minions-9e2c.vercel.app
  - dinner-roulette-git-main-minions-9e2c.vercel.app
- Fifty-two curated records in served catalog, twenty new plus unchanged32 identifiers, independently source-bound verified. This does not imply all52 eligible simultaneously regardless of location/date/filter.

## Safe build route

Authenticated dashboard read-only inspection showed checked build override:
VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production

Root directory empty; TanStack Start; Node24.x. Ordinary migration-chaining npm run build was not used. Vercel configuration blob65925d91f882a10433e3eb43f53ed802914c969b unchanged, including integration/** deployment exclusion. Production logs corroborate fe22 clone, Node24, production Vite client+SSR, output deployment. Connector all-events result omitted35 middle items; no complete-log or CI/Vercel byte reproducibility claim.

## Rollback safety — exact requested BCd retained

- Owner-selected emergency restore target dpl_BCdD3eWRXk6UEN2FNJQE88r18VXv remains READY/source213502ef8cf3f67d75e6d9c9c8ff43f9f656890c.
- F1 dpl_F1XiMcc9AUuykunNamr87R3re7gP additionally retained READY/source979d83aede9d66163e1ebaed9ad5b219cb637882.
- BCd is no longer the immediate predecessor after this release. Hobby Instant Rollback on BCd is disabled postrelease. Do not label it available through that feature.
- Authenticated supported restoration route exists separately: open BCd deployment → Deployment Actions → Promote. Before and after release, the enabled confirmation named exact BCd/source213502 and displayed production domains pickforus.app and dinner-roulette-chi.vercel.app. This promotes the existing already-production build without rebuilding; connector request_promote explicitly documents no rebuild. Both confirmations were canceled and cancellation read back.
- Emergency use of that route must target BCd exactly and verify all five recorded aliases afterwards, including www redirect and generated production aliases. UI confirmation names two principal domains; five-alias result is not claimed tested by an actual rollback.
- No rollback was executed; smoke found no material divergence. No deployment deleted and no settings, DNS or aliases manually edited.

## Scoped actual-production browser smoke

Executed against https://pickforus.app/ in dot cloud browser through ordinary visible controls. No fixture provider, injected app state, clock advance or fake production results.

1. Joplin haunted category: five activities. Options showed existing RIP at Myer's Inn, Beyond The Outer Limits and The Aftermath, plus new Myers Forest of Fears. Existing cards preserve partial hours, approximate distance and compact notice.
2. Myers Forest result: 3935 S Garrison Avenue, Carthage, MO64836; Hours unconfirmed; Limited details; exact October9–10,16–17,23–24,30–31 notes and approximate-location line. Directions destination is the supported address. Uber is generic m.uber.com/ and Lyft ride.lyft.com/, with no approximate coordinate dropoff. Details collapsed initially, expanded readable.
3. Joplin haunted Open Now enabled: zero activities; clear turn-off-Open-Now guidance; pick/options/plan disabled. No display schedule became an Open Now claim.
4. Old Monroe: one haunted activity; new PanicFest—The Cobb Factory result. Supported141E.MainStreet address, Check today's hours rather than Open Now, exact late-fall November6–7 hours, on-site ticket requirement and qualified restrictions in Details. Address Directions, generic ride targets, approximate-location line.
5. Seasonal off in Old Monroe removes seasonal chips and plan affordance, restores ordinary Anything. Ordinary Parks control returned clean park options; Kinetic Park result had ordinary park artwork/status/navigation and no seasonal notice/Details contamination. Current live provider returned ordinary results; this is a point-in-time observation, not reachability guarantee.
6. Aurora: new Aurora Maize at Adventure Farm appears in Corn Maze/HauntedHouse classification, approximately1.9mi and partial hours. Details preserve September19–October31, Wednesday/Friday/Saturday LAST-ADMISSION distinctions, unknown final exit, maze-scare versus ZombieHarvest days, entrance caution and approximate location. Directions use20591CountyRoad2200; generic rides.
7. Aurora plan negative control with only one eligible stop: honest no-complete-pair result, no invented ordinary Scare/Settle. Adding Parks gave genuine Aurora Scare + Oak Park Settle. Compact plan and expanded important facts were visually readable.
8. Reload retained Aurora location/filter policy. Removing Parks and enabling Open Now on resumed Corn Maze pool again yielded zero activities. Source-bound independent evidence covers future expiry, saved aliases and pending RPCs; no live future-clock claim.

Screenshots visually inspected: smoke-myers.png, smoke-open-now.png, smoke-cobb.png, smoke-ordinary.png, smoke-aurora.png, smoke-plan.png. Scope is representative smoke, not all52 live UI cards or new geometry suite. No external Maps/ride booking was executed.

Two harmless operator interaction attempts are retained: Playwright checkbox selector failed to match before native visible-control click succeeded; first location entry appended to old text and was rejected, then corrected through select-all to valid OldMonroe. Neither is a runtime source defect.

## Independent exact-source/time acceptance

Fresh independent reviewer report:
pr60-independent-release/Independent-Production-Identity-Acceptance.md
SHA256 b779ddcb54c7f0cb63cf4fde5d628759ded1f24ee0ec248534b856f867a11b5f

PASS for exact deployed source/tree/parent, safe build route, delivered20IDs/addresses/cutoffs/2026/null machinehours/neverOpenNow, previous32IDs, exact expiry/cache/no2027 and Cobb-only new scoped late-fall visibility. Delivered index-CQ7DsCRP.js is582366bytes SHA25697f0fcbfcbe6cd9760e08d57a35cb757644b3c2c64af3c6825e3e654dd3a44e5. All20 retained pending-RPC-at-expiry receipts matched delivered cutoffs. Future-date method is source-bound; no real production clock was changed.

Original accepted browser archive11604834689,659552557bytes SHA25657bebbd86e183df68db154366c02a8f10819873ebb6c06022ba2cfd2e864878f; original evidence-export oversized-artifact HOLD remains CLOSED. Evidence sources are reused, not rerun or recreated. Cobb alone among twenty new records remains through reviewed November7 23:00CST; Halloween chips/provider season not extended.

## Limits and next boundary

Six inherited web lint warnings; inherited320px Directions-label clipping; qualified approximate placement; conservative OpenNow; no live ticket/weather/provider guarantee; no physical Android/WebView/GPS acceptance; signing/Play out of scope; residential policy lane separate. No source remediation, further research, Cadaver investigation or new batch occurred. Cadaver remains HOLD for reliable attraction-specific2026operation/date binding and supported expiry. Remaining six commercial/eight delta HOLDs and enrichment suggestions are future work only.

Operator verdict: PASS — exact release deployed and scoped production acceptance passed. Final coordinator continuity publication/full readback remains required before terminal completion. Stop after that checkpoint; no automatic next Missouri batch.

