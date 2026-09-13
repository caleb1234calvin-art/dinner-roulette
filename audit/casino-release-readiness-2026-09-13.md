# Pick For Me casino release readiness

Updated September 13, 2026. **Validated and promoted to non-production integration; statewide Nevada/Oklahoma scope remains partial.** [PR #38](https://github.com/caleb1234calvin-art/dinner-roulette/pull/38) merged only into `integration/active-work-pass-1` as `6c1d5829f7f3e76946e20211b60525f9836b1227`. No main merge, production change, migration or Vercel deployment has occurred.

The current runtime/data revision is `243082896d6b774dde9bbb44c44f71e02824aaa3`, validated by [Run 307](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34739926534). The complete RC documentation head `61cb2fe047a80fc4a67931ea3b24040e75dcd367` passed [Run 308](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34740777237). The integration merge passed [Run 309](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/34741023078) with the identical validated tree. This following handoff checkpoint changes documentation only; its latest Actions run is the final current-ref check.

## Release inventory

| Scope | Before | Candidate | Change |
| --- | ---: | ---: | ---: |
| Nationwide canonical casinos | 731 | **808** | +77 |
| Nevada | 109 | **146** | +37 |
| Oklahoma | 56 | **96** | +40 |
| Colorado | 31 | **31** | 0 |
| Texas | 4 | **4** | 0 |
| Four-state focus | 200 | **277** | +77 |

There are **824 serialized rows across 54 passes**, reconciled to 808 active destinations. All 41 active jurisdictions have manifest records: 39 retain their established complete status; Nevada and Oklahoma remain pending with unknown totals. The old Nevada 174 figure was a decision universe containing exclusions/aliases and depended on a damaged 45-row ledger. It is not a casino count.

| Change | Result |
| --- | --- |
| New destinations | 77: Pass 51 adds 24; Pass 52 adds 31; Pass 53 adds 3; Pass 54 adds 19. Every addition has identity, point, date and scope evidence. |
| Existing destinations removed / merged / renamed | 0 / 0 / 0 in this RC. Earlier Cadence/legacy-ID repairs remain intact. |
| Pin corrections | Oneida Airport, Oneida IMAC, Soaring Eagle Slot Palace. Stable IDs and old rows retained. |
| Address corrections | Oneida Airport uses 2040 Airport Dr; Slot Palace uses 7566 Ogemaw Dr #7076. |
| Status/successor corrections | 16 bounded live closure-alias groups; current replacements remain eligible. Stale Golden Pony, War Pony, Ioway, Kiowa Verden and SouthWind Newkirk listings were challenged. |
| Related components | One destination for a casino and its hotel/restaurant/RV components; separate public casino floors retained where supported. Grand Lake's off-site lodge is not the casino. |

The full addition/remediation list and unresolved candidate names are in [the coverage ledger](casino-rc-coverage-2026-09-13.json). Source fields and rejected/conflicting map points are preserved in the four `casino-rc-pass-51…54-evidence` files. Montego Bay's initial address hold was cleared in Pass 53. Konawa/Rivermist, Horseshu and Moapa retain explicit coordinate or gaming-scope holds.

## Code and integration

The audit now reads the application's actual registered TypeScript exports, retaining generated IDs and audit metadata. Missing, duplicated, skipped or out-of-order registrations fail. Schema checks protect required fields, casino category/source, valid coordinates, focus-state bounds, state/address consistency and source metadata for new records.

Live discovery now rejects malformed queries/coordinates/IDs, explicit inactive casino tags and reviewed closed aliases. Optional malformed fields cannot poison neighboring results; action URLs must be credential-free HTTP(S). Reviewed successor aliases merge only at the same nearby property. Generic casino words cannot collapse to an empty identity.

The strict **Open now only** filter requires known-open hours. It defaults off because saved casinos commonly have unknown hours; those records do not claim current opening status. Options contain unique IDs. Existing energy/distance/repetition weighting, preferences and temporary exclusions remain covered, including a 10,000-record pool.

No unrelated feature, route, production environment variable, schema migration or package-manifest change was introduced. The lock repair resolves the existing `eslint-plugin-react-hooks ^6.0.0` mismatch to 6.1.1. Clean `npm ci` passes. Exact changed paths, configuration details and targeted secret-scan scope are in [the machine-readable progress record](casino-rc-progress-2026-09-13.json). No secret values were exposed or changed.

## Validation

| Gate | Verified result |
| --- | --- |
| Repository suite | **263 passed**, 0 failed, 4 skipped |
| Application suite | **51 passed**, 0 failed, 0 skipped |
| Unique automated tests | **314 passed**, 0 failed |
| Dedicated casino subset | **65 passed**, already included in the repository total |
| Typecheck and clean dependency install | Passed |
| Curated export/schema and national manifest audits | Passed |
| Development and production-mode bundles | Passed; production command deliberately excludes migrations |
| Chromium production-preview smoke | Passed: Reno desktop 1280×800 and Newkirk mobile viewport 390×844; 12 check groups, no page errors |
| Dinner icons | All 30 assets passed |

The browser ran the actual application and server functions with a deterministic Overpass outage and Nominatim fixtures. It covered tour/navigation, casino filters, saved-data fallback, strict-open empty state, unique options, selection, Maps destination, reroll, persisted exclusion, manual-location failure, Favorites empty state and representative non-casino navigation. It does not claim hosted acceptance, physical-device testing, live-provider success or external Maps app resolution. See [the exact remaining browser checklist](casino-browser-release-checklist-2026-09-13.md).

## Four exact documentation skips

All four are **B: intentionally external by design**, and **A: unavailable in a clean repository-only checkout**. The absent package is the gitignored external OG assistant documentation (`.grok/skills/og` plus workspace AGENTS.md). No application test is skipped. Installed-document assertions remain; `REQUIRE_WORKSPACE_DOCS=1` fails closed when absent.

| File | Skipped assertion |
| --- | --- |
| `scripts/brand-check.test.mjs` | SKILL.md and AGENTS.md name the marker path and bound this script uses |
| `scripts/brand-check.test.mjs` | the sections that own the brand-task prohibition never affirm a wait |
| `scripts/brand-check.test.mjs` | SKILL.md tells the pass to self-check with the flag this CLI accepts |
| `scripts/write-atomic.test.mjs` | every hand-over the og skill prints is one this script accepts |

## Adversarial review

The second audit challenged source quality, stale operation claims, copied city/parcel points, renamed properties, shared addresses, runtime aliases and test assumptions. It reviewed all **78 pairs within 0.075 miles**. Active IDs are unique. Wynn/Encore intentionally share one address; the two Spirit Mountain casinos are in different states. Several plausible map points were rejected, including two Seminole I-40 points more than ten miles south of the actual casino. Three existing pins were corrected instead of deleting distinct venues.

The old Nevada ledger's damaged text was preserved. All 18 recent records lacking inline audit fields were tied to their surviving latest sidecars and a real-export regression. Full findings, pair decisions and limits are in [the adversarial audit](casino-rc-adversarial-review-2026-09-13.json).

Historical reconciliation warnings account for superseded rows and do not mean duplicate active IDs. CI action-runtime and MockTimers/dependency deprecation warnings are non-blocking maintenance items; no unrelated upgrades were made.

## Remaining gates and boundaries

**COMPLETED:** Evidence-backed additions, integrity/schema review, meaningful test expansion, full automated validation, safe builds, CI browser smoke, adversarial review, source/hold reconciliation, release records, continuity and exact-head non-production integration validation.

**BLOCKED:** No working local exec-server or reachable authorized interactive preview. Live services, physical devices and hosted acceptance remain NOT RUN. Konawa's numerical point and Horseshu/Moapa's current casino-floor scope remain unconfirmed. NIGC's marker endpoint returned 401; login, bot, rate and incomplete-extraction boundaries on other sources were respected and alternate sources used.

**DEFERRED:** The named Nevada rural/small-casino and Oklahoma gasino/trading-post/operator frontier remains in the coverage ledger. This candidate is not a claim of complete statewide coverage. A release retaining the existing partial catalog is distinct from a promise of exhaustive Nevada/Oklahoma coverage.

**OPTIONAL / FUTURE:** [The status watchlist](casino-status-watchlist-2026-09-13.json) is prepared for later checks; **no recurring monitoring was created**. Routine CI deprecation maintenance can follow independently.

**REQUIRES USER AUTHORIZATION:** Any main promotion/merge, any Vercel or other hosted deployment, production write/migration, irreversible external change or recurring monitoring.

Before controlled release, confirm acceptance of the documented coverage scope (or complete the named frontier if exhaustive coverage is required), finish the live acceptance checklist on an available permitted target, inspect current refs and exact revision validation, and obtain explicit release authorization. Non-production integration promotion is completed and reversible; main promotion and controlled deployment remain unperformed.

After separately authorized deployment, verify the served revision/cache and repeat hosted navigation, casino selection, live-provider/fallback, real Maps and mobile checks. No production verification is claimed here.

## Recovery

Pre-RC integration revision: `877ff08c300a9d149aa174e9c47471d57bc98ccd`. Main baseline: `c187d518cf8b0c8b9202ee0ae6493667eb4c0ab5`. Preserve the RC branch and evidence. If rollback is needed, revert integration merge `6c1d5829f7f3e76946e20211b60525f9836b1227` through normal review; avoid force-pushing shared branches or deleting history. No database change was introduced, and no production rollback is needed for this work.

**Do not run `npm run build` casually:** it chains `db:migrate`. Safe production bundling is `node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`. Vercel's `integration/**` Git deployments remain disabled.
