# Hybrid test expectation migration (nonproduction candidate)

Radial discovery becomes an audit layer. This is a test-author report, not independent verification or release clearance.

## Preserved safety tests

All direct radial plan/cache/session/pacing safety suites remain unchanged. `date-night-cache.test.mjs` cache-unit section is unchanged: category authority, radius authority, expiry/TTL, empty supersession, terminal identity evidence, LRU limits, alias/evidence merge, invalid responses and negative lifecycle precedence remain enforced.

## Actual UI test changes

- Initial RPC formerly required `radial-v1:core`; now requires one patch-free selected-radius primary. A separate core patch follows primary settlement. The primary result enables Pick, Options and Plan before that patch completes.
- Initial Carthage Movies formerly asserted loading until RPC; now asserts immediate usable existing local cinemas. This is not new live coverage. No audit RPC is allowed before primary settlement.
- `Loaded through N miles` was an audit-geography presentation assumption. Assertions now require Ready/background-partial/audit-complete and never falsely assert disk or ring completeness. Direct radial coverage-unit assertions still enforce exact spatial ownership.
- Open Pick/Options/Plan stability is retained; explicit reroll/shuffle/replan must see an audit-added outer venue.
- Middle/outer failure and three-degraded-patch bounded stop remain tested. Request counts include one additional disk primary. Retry still targets the missing audit sector. Failures cannot disable primary actions.
- Uncovered 15→50 now requires one broad disk acquisition rather than waiting for one outer sector. Narrowing reuses existing disk authority, cancels obsolete work, clips results, rejects late success as cache authority. Rapid changes cancel and replace obsolete primary rather than retaining a core RPC.
- Local-only filter changes still create zero RPCs and do not abort audit work. Category subset reuse counts primary RPCs separately because changing audit scope may legitimately restart missing patch checks.
- Location changes still abort old audit and reject stale results; the new initial RPC is broad rather than core.
- A timed-out primary settles foreground loading and preserves qualification. A bounded radial recovery audit may begin afterward, unlike the old prohibition on outer work after core timeout. Explicit primary retry remains available in the discovery notice while audit is running.
- Cached contribution and missing-category retry semantics remain enforced. Exact UI counts no longer assume absence of the now-immediate local curated catalog; tests instead require ready actions, current category authority and unchanged network requirements.
- Unmount explicitly aborts pending audit; next component session must reacquire primary. Curated readiness does not imply cache survived unmount.

## Hosted browser migration

The PR validation step changes only its controlled Date Night harness command/output folder. It now runs `scripts/date-night-hybrid-browser.mjs` with the dedicated controlled preload. Original radial harness and fixture remain available as historical baseline artifacts; no assertions in direct radial safety suites are removed. Other full seasonal, location, ordinary/casino and geometry workflow steps remain unchanged.

The hybrid harness carries forward all ten old browser scenarios with these architecture-specific changes:

- progressive success: Ready controls before audit completion; completion text now audit-complete;
- middle/outer failure: nonblocking partial audit, controls remain enabled;
- options stability and future selection: same assertions;
- widening/narrowing: missing disk authority first, then audit; covered decrease launches no primary refetch and stays usable;
- local filters: no network or cancellation change;
- mobile: same no-horizontal-overflow/error checks;
- all-stall: preserved disclosure and usable curated pool, no fixed old group/RPC count because audit is now secondary recovery.

Added browser scenarios: stable Pick, stable Plan, audit category cancellation, audit location replacement via reload, audit unmount cancellation, primary category cancellation, and primary location replacement via reload. Server fixture logs upstream aborts, not only browser request rejection. Navigation-to-usable-control time and first/final provider-response timestamps are retained per scenario.

Browser location replacement through reload does not by itself prove same-mounted-component location-edit behavior; deterministic actual-component and controller tests cover that separately. Dedicated browser evidence must be executed and inspected on the frozen exact candidate before claiming PASS. Existing seasonal suites carry critical expiry/invalidated-decision, cache/resume, negative identity, lifecycle/no-2027 and geometry checks; hybrid changes must pass them unchanged or separately document any concrete correction.

## Local author results (mutable working tree)

59/59 adapted cache and actual-UI session tests passed. ESLint passed for the four author-owned test/harness scripts. Earlier failed runs are retained under `/tmp/hybrid-ui-adapt-r1.log`, `/tmp/hybrid-cache-r1.log`, `/tmp/hybrid-cache-r2.log`, `/tmp/hybrid-ui-adapt-r3.log`; final local run `/tmp/hybrid-ui-final-local.log`. These are not immutable candidate verification.

## Additional shared lifecycle expectations

`discovery-client-lifecycle.test.mjs` retains all primary watchdog/late-success/late-rejection/retry/replacement/unmount assertions for Dinner, Date Night and Nightlife. Its Date Night cases now use a non-catalog control origin and an explicit successful-empty background-audit transport fixture. Those audit calls remain separately recorded in the harness; the dedicated hybrid UI/browser suites exercise real pending/failed audit transport. This isolates primary deadline cleanup from the intentionally subsequent audit deadline. A selected-radius change now aborts/replaces primary rather than retaining a core patch.

`date-night-partial-ui.test.mjs` uses the same non-catalog control origin so its one-provider-row assertion remains exact; one background watchdog is expected after primary settlement, and zero after disposal. Provider failure categories, usable controls and qualification remain asserted.

`missouri-two-records.test.mjs` isolates each record's actual activity categories, because immediate curated composition now truthfully includes nearby Missouri Nightmare in Anything at Lloyd's. The same target facts, notice, Open Now exclusion, exact expiry and 2027 checks remain. Separate existing tests retain the regional Anything superset.

Initial full-suite failures are preserved as `/tmp/hybrid-full-r1.log`; initial primary/audit safety author failures as `/tmp/hybrid-safety-r1.log`. A concrete UX defect found during test migration was fixed: a failed primary retains a retry action while audit is still pending. An empty failed primary now displays its error once instead of also claiming saved fallback availability.

## c931 hosted failure and bounded harness correction

Exact candidate c931188a96752fcb97dac9066e530688f9aaef2a, run37999033501/job114052295184 failed at the sixth hybrid scenario, `plan-stable`. First five scenarios passed. The harness selected Movies only, then incorrectly demanded complete Halloween-plan venue cards. The screenshot shows the correct truthful UI: “No complete seasonal pair yet.” This is a harness setup error, not evidence that the application should fabricate a thrill/settle pair.

Correction: `plan-stable` uses Anything, including supported existing local thrill and settle records. A separate `plan-no-pair` Movies-only negative control explicitly asserts the truthful empty-plan heading and absence of fabricated venue cards. No runtime changes and no weakening of plan validity. The harness now contains 18 scenarios.

Original artifact11647559112, 2,415,491 bytes, SHA256 d72c9975ad81e4aaa8ce8f134b557c21945070a25f8c14cab5c4c6dbf1386791, downloaded and hash-verified. Failure screenshot inspected directly; preserved verdict and screenshot are in `c931-browser-failure/`. Original archive retained at `/tmp/hybrid-c931-browser-failure/original.zip`. Remaining scenarios and all downstream seasonal browser/geometry steps were NOT executed on this failed run, so they remain unverified rather than PASS.

## a4 hosted failure and bounded fixture-origin correction

Exact a4f43e9 candidate, run38000254537/job114056327125: 14 hybrid scenarios passed, then `unmount-cancel` failed the unchanged zero-page-error assertion with one `SecurityError`. The fixture was installed with context.addInitScript and wrote sessionStorage/localStorage unconditionally, including when the test intentionally navigated to opaque `about:blank` to unmount the app. This is a strong harness-origin explanation; the original error recorded only its name, so its exact stack/source is not proven by the retained receipt.

The actual upstream abort required by this case occurred: `radial-v1:20:0` started at1791585733113 and aborted at1791585733126. The directly inspected failure screenshot shows the reloaded usable DateNight page, not a crash. The correction limits fixture storage seeding to the owned application origin. It does not catch or suppress SecurityError, alter app code, weaken cancellation, or remove the zero-page-error assertion. Page errors now preserve name, message, stack and current URL for precise future attribution.

Artifact11649460402 is 5,269,147 bytes; downloaded SHA256 exactly f12fc1f6893c5c4662d84fef7c38236e96df0df7e5f22fc91fa4cb934eb6e0f8. Original ZIP remains `/tmp/hybrid-a4-browser-failure/original.zip`; verdict, screenshot, event log and exact hosted log excerpt are preserved in `a4-browser-failure/`. Downstream browser/geometry steps were skipped and remain unverified. A new exact-head hosted run is required.

## 63b seasonal RPC-count migration and real location proof (test-only R4)

Run38001408334 completed all 18 hybrid scenarios, but its later two-record suite failed initial total-RPC expectations (expected1, observed2). Original artifact11649822622, 27,885,371 bytes, SHA256 ba93bba19ee8ed6440309966586e921a3b421163e420146dcf5ff3ce41933277, downloaded/hash-verified and retained `/tmp/hybrid-63b-browser-evidence/original.zip`. Relevant original verdicts and failure screenshots are preserved in `63b-browser-failure/`. Downstream suites were skipped, not PASS.

Captured TanStack payloads show both requests contain the key `patchId`: the primary value encodes undefined, while the audit value explicitly encodes `radial-v1:core`. Presence-of-key checks cannot classify them. New shared `hybrid-rpc-evidence.mjs` decodes the actual field value with structural assertions; tests use the two exact hosted payloads, reject malformed/unknown fields, and reject duplicate audits.

Affected harness inventory and expectation mapping:

- `missouri-two-record-browser.mjs`: initial merged record and Myer fallback; season-off increment; category/Anything TTL refresh increments; cached category/local toggles; expiry/resume no-refetch.
- `seasonal-completeness-v1-browser.mjs`: initial merged/fallback cases; season toggles; TTL refresh; favorites/exclusions; persisted identity and exact expiry/resume no-refetch.
- `seasonal-ten-record-browser.mjs` (also drives subsequent record batches): initial/season-off/mixed/fallback cases; category and TTL changes; saved/favorite/negative identity; global-season-window refresh; direct Favorites; late-fall/expiry; pending-response-at-expiry explicitly captures the primary.
- `seasonal-card-layout-browser.mjs`: no RPC-count assumptions; unchanged.

Every raw RPC remains in `result.rpc`, with decoded acquisition fields. Assertions now explicitly address `test.primaryRpc`; audit requests remain separately visible and validated. Exact one-primary and subsequent +1/+2 increments remain exact. Payload category/identity/lifecycle/routing/factual checks now bind to the correct primary response. Total acquisition counts are recorded. Audit validation for these <=15-mile fixtures requires only a core patch, at most one audit for each distinct matching primary location/radius/season/category acquisition, and no unclassified RPCs. Pure local-filter, favorites/exclusion and expiry/resume checks additionally compare exact total RPC snapshots. Only category/context reuse statements allow separately bounded audit activity; none permit extra primary acquisition. Quiet baseline snapshots allow already-started audit responses to settle before measuring local actions.

The hybrid harness's own radius-decrease no-primary-refetch check now uses the same decoder. Its earlier string-presence check could falsely count zero primaries, so the old receipt is not sufficient for that particular claim.

Independent review also found that original `location-cancel` and `primary-location-cancel` wrote Columbia to storage then reloaded, where fixture initialization reset Carthage. Those historical cases prove reload cancellation only, not changed-location replacement. R4 replaces their actions with the normal Change location → textbox → Set location UI, without reload; the controlled geocoder returns Columbia. A same-document sentinel, persisted coordinates, explicit provider lat/lon response, old provider abort, selectable Columbia result pool, and stable open options after releasing old work are required. Fixture seeding is one-time per session and only on the owned origin. All public network remains blocked; no operator/provider traffic. The standalone supplemental prototype was reviewed but not published, avoiding a separate validation branch once R4 became necessary.

No production or runtime code is changed by this test-only remediation. Full exact-head validation and independent review are required; author syntax/lint/unit checks cannot substitute for hosted execution.
