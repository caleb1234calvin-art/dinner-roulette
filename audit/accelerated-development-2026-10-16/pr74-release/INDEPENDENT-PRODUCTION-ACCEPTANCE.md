# PR #74 independent production acceptance — QUALIFIED PASS

Verifier `/root/pr73_release_verification` did not author PR74, integrate it, merge it, deploy it, change settings or execute rollback. All application interaction used fresh disposable browser contexts. User favorites and locations below are test-local state; no owner account or saved server data was changed.

## Identity and current gates

- Approved candidate `e5e1682f6c82c9a7d972e28bf9b9f94973a3d158`, tree `c36112156cd11baefb6671194f0d59b9c181c2a3`; local source remains exact and clean.
- Independently fetched released merge `c3208d9fdc9a21d698efa9254be1286f5d3d2836` has that exact approved tree, with parents `ead2319c4869478f4cd121e2370db4d9734d83ed` and approved `e5e1682…`.
- Production `dpl_FMS2SBg4ymuDwU4avpywV6yB5vg6` is READY and source-bound to that merge.
- Five hostname-specific API reads independently converge on FMS2: `pickforus.app`, `www.pickforus.app`, `dinner-roulette-chi.vercel.app`, `dinner-roulette-minions-9e2c.vercel.app`, `dinner-roulette-git-main-minions-9e2c.vercel.app`. www retains308 to apex. See `POSTDEPLOY-API.json`.
- Fresh approved-head check-run API:18SUCCESS, one intentional sign-upload SKIP, including all15browser lanes, checks, aggregate validate and unsigned Android. See `CANDIDATE-CHECKS.json`. Existing exact-source hosted acceptance was read; full original archives were not reopened or all tests rerun by this worker in this production turn.

## Actual live Kansas City discovery

**9stages PASS** at `2026-10-16T01:08:19.445Z`–`01:08:44.685Z`, actual hydrated production client and actual production serverFn response; no response interception or clock alteration. Browser-local origin is `39.114053,-94.627463`, labeled Kansas City, Kansas. Favorites restrict membership to the three existing target IDs, Haunted House selected, Open Now initially OFF. These make the target set observable without changing provider data.

| Stage | Actual target count / membership |
|---|---|
|15mi|0|
|20mi|1—Exiled KC|
|30mi|2—Exiled KC, Dark Nightmares|
|40mi|3—including Terror at the Ranch|
|50mi|3|
|Shrink15mi / return50mi|0 /3|
|Open Now ON /OFF|0 /3|

Only one actual discovery RPC was sent across all9stages. It returned HTTP200 with source `fallback`, seasonal provider outcome `failed`, and “Using saved Date Night places while the live map is unavailable.” Its five returned venue records did not contain any of the three outer target IDs. The deployed client's reviewed curated pool supplied the correct radius-eligible targets while coverage remained explicitly incomplete. This directly reproduces the relevant real production provider-failure circumstance and confirms PR74's correction. It **does not** establish provider availability or complete live inventory. No horizontal overflow, page errors or request failures were recorded.

Actual40mi Options screenshot was visually inspected and shows all three cards, including conservative closed/upcoming/partly-confirmed information. Discovery eligibility does not mean an attraction is open now.

## Separately controlled deployed-client verification

**14stages PASS**, `2026-10-16T01:10:25.541Z`–`01:10:39.554Z`. This loads the actual deployed HTML/JS/CSS, but replays **browser-only** exact serialized serverFn responses captured from the approved-source local app under controlled provider HTTP504. It is not another real production-provider run. Fixtures are bound to the exact candidate source/build proof; request bodies and endpoint paths must match exactly, with SHA256 receipts. Unmatched RPCs fail closed. No production server response or configuration is changed.

The nine radius/OpenNow stages above pass. Additional checks:

- Favorites OFF at50mi produces the expected six eligible saved haunted-house records.
- Relocate through UI to controlled Carthage location: zero stale KC targets. Return to controlled Kansas City: all3return.
- Controlled client time `2026-11-01T05:00:00Z`: only Exiled remains; `2026-11-02T06:00:00Z`: none. These are source-bound expiration controls, not new operating-date research.
- One failed core response is reused through all local radius, OpenNow and favorite changes. Whole scenario uses five exact matched replays: three discovery/two geocoder. No page errors and no horizontal overflow. This establishes same-session cache/reuse behavior; TTL eviction and broader negative-lifecycle coverage remain the previously accepted exact-source tests.

The initial controlled attempt was blocked by automatic review because the hosted page tried to connect to unsolicited `grok.com`; no acceptance verdict was produced. It was not retried unchanged or rerouted. The successful materially safer retry permits **only pickforus.app** and locally blocks grok.com, Google Fonts and optional analytics before sending. Fallback fonts apply only to this controlled probe. The exact rejection and corrective restriction are preserved in `CONTROLLED-REPLAY-REJECTION-AND-RECOVERY.md`.

The initial replay also omitted TanStack's required `x-tss-serialized:true` transport header. Exact installed server/client source verified that requirement. The successful replay adds the header while retaining byte-identical bodies, exact request matching and every identity/count assertion. This is a preserved harness correction, not a hidden product fix or transferred PASS.

## Actual production Directions preservation

**6cases PASS**, actual public application and actual discovery, `2026-10-16T01:08:19.376Z`–`01:08:57.632Z`. Seasonal Exiled KC is selected through real production at20mi; ordinary Dinner selects Wendy's near Benton. No response mocks or clock change. Real Google Fonts loaded in this separate run.

| Viewport | Exiled Directions | Ordinary Directions |
|---:|---:|---:|
|320px|280×72px,2lines|280×72px,2lines|
|390px|350×72px,2lines|350×72px,2lines|
|512px|472×56px,1line|472×56px,1line|

Complete visible label and accessible name, keyboard Tab focus/visible focus, 56px minimum touch geometry, full text-range containment, button/card horizontal containment and disclaimer ordering all pass. No clipping/collision or added page errors/request failures. Native Details opens/closes with Enter at all widths.

Actual unchanged-target URLs:

- Exiled: `https://www.google.com/maps/dir/?api=1&destination=12829%20Loring%20Road%2C%20Bonner%20Springs%2C%20KS%2066012%2C%20USA`
- Wendy's: `https://www.google.com/maps/dir/?api=1&destination=34.5806905%2C-92.5736357`

Origin/path/api, `_blank` and `noopener noreferrer` are checked. Maps was not opened; actual route accuracy is not asserted.

Actually viewed Exiled320Directions, Exiled390notice/Details focus, ordinary512Directions and live40mi Options. The inherited390notice/Details spacing remains tight and readable without clipping. No new PR74 UI defect was established. Remaining screenshot bytes are preserved, not all visually inspected.

## Exact deployed assets

Ten captured production static assets compare byte-identically with the previously source-bound local build of the exact approved candidate. This ties the exercised client to the reviewed implementation without claiming all server output is byte-reproducible. `STATIC-ASSET-COMPARISON.json` gives every comparison.

- `routes-uz4pEYz7.js`: `901e48239362386db07c65b317484410828aca0165f962d71724eda0c9978659`
- `index-B5_pTt_K.js`: `9d8b6cdd87e0cc95146216be391f15b8a9dd434ea6d2123d8cbb0a90ea613876`
- `styles-DuhPbn71.css`: `87c813665cfc78930217e088eada35dbfe7fa51697f72f8167cbcf01894da560`

All three fresh runs retain public asset bytes and per-URL digests. The captured local source/build proof is referenced by fixture metadata; original source bytes were not modified.

## Boundaries and reproducibility

Runtime: previously verified Chromium153.0.8010.0,390×844resized to required widths,reduced motion,service workers blocked. Browser uses the execution environment's configured proxy with the narrowly pinned existing OpenAI CA SPKI; no broad TLS ignore option. This is a disclosed test-environment qualification and does not clear physical-device TLS, Android/WebView,mobile-font scaling,GPS/PWA,source freshness,seasonal ticket/age/operating claims or complete live-provider coverage. Root's migration-free build/rollback operator checks are separate. No rollback was attempted by this verifier.

Reproduce using `node production-kc.mjs live`, `node production-kc.mjs controlled`, and `node production-directions.mjs postrelease` with the recorded runtime/environment. Controlled script now blocks all browser network outside the application; no new venue identities or dates are introduced. Ordinary live pick may differ. Full scripts, all verdicts, request/response bodies, selected/remaining screenshot bytes, API receipts, source fixtures and failure/rejection evidence accompany this report.
