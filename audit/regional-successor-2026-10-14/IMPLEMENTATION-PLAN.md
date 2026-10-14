# Pick For Us: regional successor engineering handoff

Prepared: 2026-10-14 UTC. Scope: read-only engineering preparation for one approximately 12-record Kansas / Arkansas / Oklahoma nonproduction successor. This document is an implementation plan, not source clearance, runtime acceptance, a release preflight, or release approval.

## Result and authority boundary

The read-only inspection is complete. No application source, branch, PR, build output, deployment, production configuration, signing configuration, or Play state was changed. No validation commands were executed. The inspected checkout has no `node_modules`.

No shared runtime behavioral change or architecture refactor is presently justified. A future authorized implementation needs new approved data plus explicit catalog/presentation registration. Existing V1, eligibility, identity, cache, location, navigation, component, and styling behavior should remain unchanged unless a separately identified, scoped regression demonstrates a need.

The final selected set is not assumed. The original recommended 12 and eight reserves are research inputs only. Fresh independent review may change their disposition, and the two placement candidates require combined factual, placement, and presentation clearance before import. Do not force a count by importing a HOLD, extending a season, or borrowing facts.

This handoff confers no implementation, publication, production, Vercel/protection, signing, Play, or PR61 authority. Follow the parent task's current authorization and the independent verifier's final accepted packet.

## Exact inspected base

- Repository: `caleb1234calvin-art/dinner-roulette`
- Local inspection checkout: `/tmp/pr69-release`
- HEAD: `6c619adda4d9ef3b2683befb2ca874b257505eb2`
- Git tree: `236110f86f9f3dc8c0cf0a5a664be79e2569bc43`
- Working tree: clean at the beginning and end of inspection
- Existing Missouri catalog modules: 16
- Released seasonal membership: 70, represented by the complete 67-record baseline plus the three-cleared addition contract
- Parent-supplied controlling canonical commit: `686c0f11c23b223ee95f14884dfaed6d58186226`
- Parent-supplied accepted production: `dpl_AQ75KpDS6AQ3g7GqHqYshiFhYfVf`, READY

The HEAD/tree/clean state were verified locally. Production and canonical authority were supplied by the parent and were not independently revalidated by this engineering preparation. The plan's SHA256 is supplied in the sibling checksum file and parent handoff, rather than recursively embedded here.

## Existing architecture and geographic findings

`SeasonalListing` in `src/lib/date-night/listing.ts` already supports the necessary V1 metadata: record ID, season year, timezone, visitor address, reviewed placement, Directions target, display-only hours, expiry basis, exact cutoff, review revision, source URLs, and optional `listing-lifecycle` visibility.

`seasonalListingToPlace` rejects missing/unreviewed placement, hydrates top-level latitude and longitude from the reviewed point, and forces `openingHours: null`. Address-only factual clearances therefore cannot enter radius math/counts/picks.

The runtime has no Missouri geofence or MO-only canonical-ID requirement in V1 placement, radius, current-policy, identity-receipt, or cache helpers. Search uses haversine distance; the existing server acquisition margin and client 0.05-mile eligibility tolerance remain unchanged. Existing Missouri module names and `__missouriNow` are historical labels, not a reason for broad renaming.

`search.ts` explicitly assembles catalog lists in both seasonal and season-off branches. `curated-policy.ts` explicitly registers reviewed identities, which then govern stale canonical data, identity receipts, saved places, and cache normalization. Missing either registration would produce incomplete behavior.

`seasonal-presentation-catalog.ts` binds visitor copy and confidence to both record ID and canonical ID. `seasonal-presentation.ts` otherwise returns a conservative fallback. It should receive exact independently approved presentations, not text generated from audit narratives or machine schedules.

Identity matching intentionally treats approximate placement conservatively: different V1 record IDs are not merged merely because they share a point, address, or type; exact normalized names plus bounded proximity provide affirmative provider matching. The existing special Six Flags rebrand mapping is bounded and unrelated. Do not broaden it for this batch.

## Smallest justified application diff

1. Add `src/lib/date-night/regional-2026-wave1-catalog.ts` with only the final independently accepted selected full objects, converted through `seasonalListingToPlace`.
2. Register that catalog in `src/lib/date-night/curated-policy.ts`.
3. Register it in `src/lib/date-night/search.ts`:
   - Include the approved regional catalog in seasonal discovery.
   - Include only records with independently approved `listing-lifecycle` visibility in the season-off branch.
4. Add exact reviewed presentations in `src/lib/date-night/seasonal-presentation-catalog.ts`.

Preserve all 16 existing catalog files byte-for-byte and all 70 released presentation objects field-for-field, including their freshness/review revisions. No core schema, availability/eligibility, identity, receipts, cache, radial geometry, location, UI, CSS, global seasonal-window, or provider-query change is currently indicated. Do not perform cleanup or broad catalog consolidation as part of the successor.

## Independent inputs and source equality

Before implementation, freeze a final accepted packet identifying the exact selected canonical IDs, record IDs, source objects, presentations, independent dispositions, base commit/tree, and source hashes. If placement clears for Louisburg or Psycho Path, require a complete merged successor object and reviewed presentation; do not silently combine partial facts in the implementation.

Add candidate support artifacts:

- One candidate-specific test suite, such as `scripts/seasonal-regional-wave1.test.mjs`
- Frozen independently accepted projections/presentations and decision/hash manifest
- A release-baseline fixture pinned to the inspected commit/tree, containing all 70 full objects, presentations, and 16 catalog-file hashes
- A candidate test-support module with source-bound browser facts, expected confidence, explicit lifecycle expectations, and accepted ID lists

Expectations must come from the independent packet and immutable released base, not be reconstructed from the new application catalog. Assert full raw-listing equality, including field presence and absence. The only place-adapter normalization is adding reviewed top-level latitude/longitude and forcing null machine hours. Assert full presentation equality separately.

## Assertion-preserving historical harness adaptation

Existing historical tests intentionally bind complete prior registries, including the latest 70-record contract. Several suites consume `scripts/test-support/three-cleared.mjs`, while `seasonal-three-cleared.test.mjs` directly compares the full current presentation registry against its 70-record expectation. The new regional name will also fall outside Missouri-only file/import regexes.

Do not weaken these assertions to subset checks or merely raise a numeric count. Preserve every exact legacy-70 object, file, and presentation assertion. A narrow successor-aware helper should first assert that the complete current registry is exactly the immutable released70 plus the exact approved regional additions; only then provide the unchanged historical subset to existing assertion chains.

Separately assert:

- Exact selected regional canonical IDs and record IDs
- Exact `70 + N` membership, with unique canonical and record IDs
- Complete presentation/catalog parity, with no orphan or replacement
- Explicit registration of every selected record in search/current-policy
- The intended catalog module set, including exactly the new regional module
- Rejection of extra/missing records, changed legacy fields, borrowed identities, and orphan presentations through mutation controls

Likely smallest existing validation diff:

1. `scripts/test-support/three-cleared.mjs`
2. `scripts/seasonal-three-cleared.test.mjs`
3. `scripts/seasonal-ten-record-browser.mjs`
4. `scripts/seasonal-card-layout-browser.mjs`
5. `.github/workflows/validate-icon-pack.yml`

Keep the historical numerical assertions for their historical cohorts. The new separate global successor gate owns the complete enlarged set. No unrelated test refactor is needed.

## Browser harness: concrete changes required

Add one bounded regional mode, proposed as `SEASONAL_REGIONAL_WAVE1=true`, to the existing production-RPC browser harness and give it its own CI matrix lane/output directory. The selector does not exist yet. Reuse the supported migration-free authenticated build proof, isolated local preview, network-blocked provider fixture, screenshots, and RPC/provider evidence. Retain all existing lanes.

The following existing assumptions must be corrected narrowly:

1. **Catalog/count enumeration:** the browser's global neighborhood model explicitly enumerates only the existing 70 seasonal rows. Include exactly the selected regional additions in that model even during old lanes, so nearby counts and radius behavior represent the actual candidate.
2. **November 5 visibility:** the existing late-fall loop selects every `listing-lifecycle` row and expects it visible November 5. Many regional projections intentionally use that visibility but expire earlier. Derive explicit expected eligibility from each frozen accepted source-bound lifecycle. Test both positive late-fall records and expired negatives at November 5; do not simply remove earlier-expiring records from coverage or change their source facts.
3. **Favorites expiry refresh:** `favorite-alias-cache-resume-unsave` expects a global season-window RPC whenever visibility is `listing-lifecycle`. Expect that refresh only when the scenario's actual clock transition crosses the global Halloween window. An October or November 1 expiry is not such a transition. Preserve no-extra-RPC assertions where no transition occurs.
4. **Qualified Plan fixtures:** existing pumpkin-as-settle behavior is Phase4-only, and Other-only negative controls are limited to owner/three-cleared IDs. Extend the new cohort according to actual supported thrill/settle categories, preserving two distinct eligible identities and the negative no-compatible-pair outcome.
5. **Browser facts:** bind exact Details, confidence, material restrictions, address Directions, and approximate placement assertions to the accepted packet. Update scenario accounting to reflect the added positive and negative cases rather than relaxing completion counts.

Extend geometry coverage to all selected additions at 320, 390, and 512 pixels. Preserve the existing six comparison variants, standard/ordinary controls, unchanged artwork/media, collapsed native Details, keyboard expansion, readable material facts, no new overflow, and inherited narrow Directions overflow baseline. Test qualified Plan roles where valid and negative Plan controls otherwise. No CSS change is pre-authorized by this plan.

## Candidate-specific acceptance matrix

For every final accepted record:

- Full source-object and presentation equality, including intentionally absent `endsAt` or dates
- Approximate-only reviewed placement; visitor-address Directions; external-picker rideshare; null `openingHours`; neverOpenNow
- Anything and only supported categories enter counts/options/picks
- Explicit ordinary filters do not acquire seasonal-only eligibility
- Radius inclusion/exclusion and existing tolerance, with no state restriction
- Exact cutoff minus one millisecond / exact / plus one millisecond; repeated DST hour where relevant; no 2027 revival
- Stale canonical snapshot normalization restores current placement and policy
- Both provider duplicate orders and merged discovery provenance retain current policy and null machine hours
- Cache assembly, coverage/TTL, saved receipt, Favorites/History reload, malformed/stale/conflicting receipts, and alias preference behavior
- Never-recommend, temporary exclusion expiry, not-tonight, permanently-closed/disused evidence, and pending pre-expiry RPC remain authoritative
- Same-address/different-event, generic-name, and distant-same-name controls; no identity or preference aliases inferred from geometry alone
- Actual Options / Result / Details / qualified Plan journeys; repeated/toggled controls, close/back/forward, resume/expiry, provider failure and cached reuse

Use regional location scenarios at accepted coordinates in KS, AR, and OK; a Missouri-side border origin; manual relocation between states; 1/15/25/50-mile memberships; and radial-patch ownership. Freeze expected IDs using the accepted coordinates and an independent distance oracle. Do not imply all selected venues fall within default Joplin's radius.

## Record-specific guardrails, conditional on selection and final clearance

- **Warehouse of Fear:** October 22 no-scare occurrence is not an extra venue or haunted active date.
- **The Asylum:** do not merge it with AsylumX or unrelated states' Asylum venues.
- **Walters:** use the haunt calendar, not the farm's Pumpkinfest calendar; gate-based cutoff is not a final-exit claim.
- **TwistedRoots:** one current Muskogee destination; former Chelsea/Ada locations do not create new runtime destinations.
- **Haunted Plantation:** use only the independently approved wording for conflicting age advice; Zombie Rampage remains separately held.
- **Louisburg:** retain the historical MO26-064 relationship; it is a runtime addition if cleared, not a newly discovered identity. Keep the reviewed Friday/Saturday hours conflict explicit and the distinct supported Sunday final cutoff. Placement supports a property/venue, not the Family Farm entrance.
- **Psycho Path:** require exact accepted placement and reviewed replacement of any obsolete “Map placement is not yet available” sentence. Keep operator-linked approximate venue placement separate from entrance/dropoff precision, main online timed entry separate from Shadow Box-only on-site exception, and Dark Ride separate from a hayride claim.
- **Annabelle's:** preserve the current reviewed visitor destination and Friday partial-attraction caveat; finite dates and the final November 1 CST end do not imply live opening.
- **Haunted Castle:** gates, indoor/outdoor attraction starts, ticket-sales cutoff, and unconfirmed final exit remain distinct.
- **Guthrie and Acres, if selected:** test independently approved November dates and DST-correct cutoff, ordinary Anything/listing-lifecycle visibility, absence of Halloween chips and positive seasonal provider queries after November 2, cache/saved/expiry behavior, and expired negatives for all other new rows. No global Halloween-window expansion.
- **13 Sinister Souls, if selected:** use the newly accepted dated-calendar/slot model only if cleared; do not retain or reconstruct an editorial-only schedule in conflict with its final approved object.
- **Editorial-only reserves, if selected:** retain honest unknown schedules, approved confidence, the approved November 2-local retention cap, and no fabricated `endsAt`. Editorial retention is never operating evidence.

No factual author recommendation, including amendments or placement candidates, is treated here as a final independent PASS. The final review packet controls exact values and wording.

## Validation commands after authorized implementation

Run focused candidate tests and the complete repository checks against the final source, then build once with the source/output fingerprint immediately before browser acceptance:

```sh
npm ci --no-audit --no-fund
npm run typecheck
npm run lint
npm test
npm run check:auth
npm run audit:casinos
npm run build:dev
VITE_AUTH_ENABLED=true node scripts/browser-build-proof.mjs capture
VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production
VITE_AUTH_ENABLED=true node scripts/browser-build-proof.mjs complete
CI=true VITE_AUTH_ENABLED=true SEASONAL_REGIONAL_WAVE1=true node scripts/seasonal-ten-record-browser.mjs
CI=true VITE_AUTH_ENABLED=true node scripts/seasonal-card-layout-browser.mjs
```

`SEASONAL_REGIONAL_WAVE1` is the proposed new selector, not an existing executable capability. `npm run build` is unsuitable here because it chains database migrations; use the direct migration-free production command above.

Run all existing browser lanes unchanged in scope: casino, location, date-night-radial, seasonal-two, seasonal-completeness-v1, seasonal-ten, seasonal-cumulative, seasonal-astra, seasonal-astra-extras, seasonal-phase4, seasonal-next-missouri, seasonal-hold-cleanup, seasonal-ranked-holds, and geometry. Add the separate regional lane. Existing CI checks and the aggregate `validate` gate must pass for the exact candidate head; a focused test pass is not overall acceptance.

The production browser proof hashes inputs under `src`, `server`, `public`, `scripts`, package files, Vite/TypeScript/Vercel config, and output under `.vercel/output`. Any later included source/script change requires a fresh authenticated build and proof before browser reruns. Preserve exact commit/tree/build/evidence identity throughout handoff.

## Android and retained limitations

Preserve the existing unsigned Android readiness workflow in `.github/workflows/android-apk.yml`:

- Production-mode web compilation without migrations
- Typecheck, repository/application tests, casino audit, `npm run android:check`
- `python3 -m unittest discover -s native-android -p 'test_*.py'`
- Existing targeted ESLint
- `npm run android:sync` followed by `git diff --exit-code -- android capacitor.config.json`
- Missing-upload-key normal release must fail closed with the existing signing guard
- `./gradlew --no-daemon lintRelease testReleaseUnitTest bundleRelease assembleDebug -PallowUnsignedRelease=true` from `android`
- `verify-android-bundle.py --expect unsigned`, source-revision receipt, artifact hashes, and lint report

No signing job, protected-signing access, Play upload, Vercel/protection action, production promotion, or PR61 action belongs to this work. Physical Android/WebView/GPS and installed-PWA checks are not replaced by automated readiness. Retain inherited warning/fixture/precision/overflow limitations; do not relabel them as newly passed.

## Completion boundary and implementer entry condition

The engineering plan is complete and source remains unchanged. No test, browser, Android, runtime, or source-clearance PASS is claimed. The implementer may proceed only under the parent's current authorization after receipt of the final independently accepted selected set and full merged projection packet, with a fresh check that the authorized base remains the intended base. Stop and report any material base, authority, factual, selection, or scope change rather than silently absorbing it.
