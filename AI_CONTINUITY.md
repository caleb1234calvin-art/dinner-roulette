# Dinner Roulette / Pick For Me — AI Continuity

## Current recovery — September 13, 2026

This section supersedes conflicting historical handoff claims below. Historical evidence files and the original handoff are retained for provenance.

- Continue integration-only development. Do not change or merge to `main` and do not deploy to Vercel.
- The starting PR #33 head is `f0d31d0438f5e89a6264ea3329754d71049f2ba7`; active integration remains `29a778fca910d1fd5f112f5ac139f4f7d1ac7ccf`. Main was checked at `c187d518cf8b0c8b9202ee0ae6493667eb4c0ab5`.
- The audit now merges keyed jurisdiction objects in base-then-integration order and loads the actual exported catalog records with the existing TypeScript dependency. Factory-added IDs and jurisdiction metadata are preserved.
- Canonical counts follow the existing chronological runtime reconciliation rules. Complete-state exact-count assertions, same-ID distinct-location failures and coordinate plausibility remain hard gates. No runtime reconciliation behavior was changed.
- Twelve pure audit regression cases are added as a required workflow step. The workflow explicitly checks out and prints the exact PR head; the inherited general test suite retains its existing report-only setting.
- Integration branch automatic deployments are disabled in vercel.json via git.deploymentEnabled for integration/**, following https://vercel.com/docs/project-configuration/git-configuration. Do not rely on historical Vercel rate limits to prevent deployment.
- CRITICAL CORRECTION: Cadence Crossing's handoff point 36.08622,-115.03321 is unsupported. Raw named MapQuest LocalBusiness fields put the current property at 36.052633,-114.994834, about 3.159 miles away. See audit/cadence-crossing-coordinate-correction-2026-09-13.json. The official directions page still links to a legacy Jokers Wild marker; that marker is not the current coordinate source. Prior ready-to-promote claims are superseded.
- The local execution environment is unavailable after its connection failed. Pure helper checks are not a substitute for full GitHub validation. This commit is a candidate, not evidence of a green workflow or promotion.
- Follow-up research has recovered current-property numerical evidence for Red Dragon Elko, Lakecrest, Lake Eufaula and Holdenville. Keep those additions separate from Pass 49 promotion until evidence is recorded and their own exact-head validation passes.
- The Pass, Whiskey Pete's and Buffalo Bill's remain closure/renovation holds without confirmed current daily gaming. Primm Valley is separate and has July 22, 2026 reopening evidence.
- Next: validate corrected Pass 49; resolve any genuine discrepancies without relaxing the gate; promote PR #33 only when green; record exact validated/merge SHAs; then prepare and validate the four follow-up destinations.
- Earlier save attempts timed out in automatic permission review. Caleb explicitly approved retrying. No approval is implied for main changes or deployment.

## Historical handoff (superseded where noted above)

_Last updated: September 12, 2026, immediately before handoff to GPT-6 Astra_

## Handoff purpose

This document is the authoritative continuity handoff for ongoing Pick For Me / Dinner Roulette development. The user is moving active development into GPT-6 Astra after a long casino-audit and pre-deployment preparation session. Read this before changing repository state.

The guiding operating instruction for the current phase is:

- Continue as much work as possible without requiring or triggering a Vercel deployment.
- Work directly on research, data gathering, casino discovery, source verification, duplicate elimination, normalization, code changes, UI logic, data structures, configuration, cleanup, documentation, testing, local/development build validation, and future-update preparation.
- Use connected discovery tools aggressively where useful: TinyFish for routine search/fetch, Tavily for broader research, Parallel Search for independent discovery/extraction, Firecrawl for crawling/structured extraction, and Exa only as reserve if the other sources leave meaningful gaps.
- Batch related reversible changes when practical.
- Preserve existing app behavior unless an intentional update requires change.
- Do not stop merely because Vercel is blocked. Stop only when meaningful remaining work genuinely requires live deployment or another inaccessible capability.
- Never lower the casino evidence standard simply to increase destination count.

## Project identity and repository discipline

- Active app: Dinner Roulette V.3, moving conceptually toward the broader **Pick For Me** identity because the app now extends beyond dinner into nightlife, dates, seasonal activities, casinos, and future food-truck discovery.
- Repository: `caleb1234calvin-art/dinner-roulette`.
- Active integration branch: `integration/active-work-pass-1`.
- Current casino candidate branch: `integration/pass-49-cadence-crossing`.
- `main` remains untouched unless Caleb explicitly requests a merge or direct change.
- ChatGPT is the only AI authorized to directly modify the repository unless Caleb explicitly authorizes another assistant for a named file or task.
- Dinner Roulette / Pick For Me and the Jasper County audit remain interconnected; prior audit tooling, evidence habits, and source-verification practices may feed directly into app discovery work.
- Historical branches and audit artifacts are provenance. Do not casually rewrite or delete them.

## Major repository event: Pass 48 promoted

Pass 48 added **Cherokee Casino South Coffeyville** after a direct current-property numerical point was recovered from the official Cherokee Casino property page.

Property:
- Name: Cherokee Casino South Coffeyville
- Address: `1506 US-169, South Coffeyville, OK 74072`
- Coordinate: `36.9825777,-95.6283822`
- Current first-party page: `https://cherokeecasino.com/casinos/south-coffeyville`
- Evidence reason: the current first-party property page exposed an embedded Google Maps destination containing the exact numerical point, rather than a city centroid, predecessor coordinate, generic street geocode, or inferred parcel.

Pass 48 implementation files include:
- `audit/oklahoma-coordinate-qa-pass-12-2026-09-12.json`
- `src/lib/nightlife/casino-catalog-pass-48.ts`
- `src/lib/nightlife/search.ts`
- `scripts/audit-casino-catalog.mjs`
- `.github/workflows/validate-icon-pack.yml`
- `AI_CONTINUITY.md`

Validation history:
- Run 280 (`34727233333`) passed on implementation/workflow head `be8d6e44520d0f647cb74611716d446a32f2e112`.
- A later continuity-only update produced candidate head `c82c10117804180e46d7d1c965cb8069d9dbe976`.
- Run 281 (`34727712643`) also completed successfully after that update, with dependency installation, TypeScript, curated casino audit, inherited-test reporting, development bundle build, and Dinner icon verification all passing.

PR #32, `Validate Pass 48 South Coffeyville`, was changed from draft to ready only after green validation and then merged into `integration/active-work-pass-1`.

Pass 48 merge commit on active integration:
- `29a778fca910d1fd5f112f5ac139f4f7d1ac7ccf`

This promotion did **not** touch `main`.

## Validation workflow improvement completed during Pass 48

The integration validation workflow was extended so pull requests targeting either:
- `main`, or
- `integration/active-work-pass-1`

can invoke `Validate Dinner Integration`.

This corrected a previous blind spot where integration-targeted PRs did not naturally trigger the same validation gate. Validation steps themselves were not weakened.

`Validate Dinner Integration` currently checks:
- dependency installation,
- TypeScript typecheck,
- curated casino catalog audit,
- inherited test suite as report-only,
- development bundle build,
- Dinner icon-pack verification.

A green integration run is evidence of compatibility; it is never permission by itself to merge to `main`.

## Vercel status and development strategy

Vercel is externally blocked by its current build-rate-limit / upgrade condition. The user explicitly decided **not to pay for Vercel Pro merely to bypass this development bottleneck**.

Therefore:
- treat Vercel as one unavailable pipeline stage, not as a stop condition;
- continue all research, code, QA, integration, and development-build work that does not require hosted publication;
- use GitHub Actions as the main pre-deployment compatibility gate while the block persists;
- do not call GitHub-only work "deployed";
- do not trigger Vercel unless the user later explicitly wants deployment or the block clears and hosted verification is actually needed.

The user specifically observed that this change in working style greatly increased productivity because deployment stopped acting as an artificial wall.

## Casino evidence and reconciliation policy

Runtime casino passes are canonicalized chronologically in `src/lib/nightlife/search.ts`.

Current reconciliation rules:
- newer same-property records win while older historical catalog files remain preserved;
- same ID within 0.35 miles => reconciliation warning, latest pass wins at runtime;
- same ID at materially different locations => hard failure;
- same normalized name within 0.35 miles => reconciliation warning, latest pass wins;
- same normalized name at distant locations => preserve both as distinct destinations, with warning when appropriate;
- coordinate plausibility and complete-jurisdiction count checks remain hard gates.

Preferred work cadence:
`discover → verify → reconcile → batch clean destinations → implement → validate → continue discovery → re-audit prior batches`

Evidence rule:
A current street address, generic map result, routing destination, city centroid, nearby parcel, adjacent development land, predecessor casino point, or historical map marker is not enough by itself. A numerical runtime coordinate must be traceable to the current destination/property.

Never guess coordinates to clear a hold.

## Current casino counts

After Pass 48 was promoted to active integration:
- Nevada: **107 active**
- Oklahoma: **51 active**
- Colorado: **31 active and complete**
- Texas: **4 active and complete**
- **Four-state active integration total: 193**

Pass 49 candidate adds one Nevada casino:
- Nevada candidate: **108**
- Oklahoma: **51**
- Colorado: **31**
- Texas: **4**
- **Four-state Pass 49 candidate total: 194**

The broader candidate/audit universes are much larger than runtime counts because they include closures, duplicates, predecessor properties, aliases, nonqualifying outlets, and unresolved cases. Rough working scope remains about 286 candidate records across the four-state audit universe; this does not mean ~90 casinos remain to be added.

## Pass 49 candidate — Cadence Crossing Casino

A meaningful Nevada hold was cleared during the new no-deployment workflow.

Property:
- Name: **Cadence Crossing Casino**
- Address: `920 N Boulder Hwy, Henderson, NV 89011`
- Candidate coordinate: **`36.08622,-115.03321`**
- Current operator/property: Boyd Gaming / Cadence Crossing
- Current site: `https://cadencecrossing.boydgaming.com/`

Evidence chain used in the research sweep:
- Nevada licensed-retailer evidence confirms current Cadence Crossing Casino at 920 N Boulder Hwy.
- Contemporary current-property reporting confirms the completed casino opened in March 2026 and replaced Jokers Wild.
- Firecrawl recovered a current MapQuest place entity for Cadence Crossing Casino at the exact current address and returned the explicit numerical point `36.08622,-115.03321`.
- The historical Jokers Wild coordinate `36.052,-114.99468` remains quarantined and must not be reused as though it represents the completed Cadence Crossing property.

Pass 49 candidate work already created:
- branch `integration/pass-49-cadence-crossing`
- `src/lib/nightlife/casino-catalog-pass-49.ts`
- new Pass 49 QA/audit evidence artifact for Cadence Crossing
- `src/lib/nightlife/search.ts` import/runtime activation through Pass 49
- `scripts/audit-casino-catalog.mjs` extended through Pass 49
- draft PR #33, `Validate Pass 49 Cadence Crossing`, targeting `integration/active-work-pass-1`

PR #33 current metadata before this continuity update:
- state: open
- draft: true
- mergeable: true
- base: `integration/active-work-pass-1`
- base SHA: `29a778fca910d1fd5f112f5ac139f4f7d1ac7ccf`
- head before this continuity update: `83825237cba4e7ad7cf23552379d685d5e5a8abe`
- `main` is not involved.

## IMPORTANT: Pass 49 validation currently fails for an audit-script data-shape bug, not a casino-data failure

Run 283 (`34729326135`) ran against PR #33 and failed.

What passed before the failure:
- checkout/setup succeeded;
- dependency installation succeeded;
- **TypeScript typecheck succeeded**.

Failure occurred at:
- step: `Audit curated casino catalog`
- command: `npm run audit:casinos`
- file: `scripts/audit-casino-catalog.mjs`
- line around 69
- error: `TypeError: object is not iterable (cannot read property Symbol(Symbol.iterator))`
- failing expression: `for (const jurisdiction of manifest.jurisdictions ?? [])`

Root cause visible from the current manifest:
- `audit/casino-sources.json` stores `jurisdictions` as an **object keyed by jurisdiction name**, e.g. `"New Jersey": {...}`, `"Pennsylvania": {...}`, etc.
- the audit script is trying to iterate it as if it were an array.

This failure therefore does **not** currently establish that Cadence Crossing is bad data, that Pass 49's coordinate is wrong, or that TypeScript/runtime wiring is broken. It is an audit-script compatibility bug introduced/exposed by the current manifest shape.

Because the audit step failed early, later workflow stages were skipped:
- inherited test report,
- development bundle build,
- Dinner icon verification.

Do **not** merge PR #33 until the audit script is corrected, exact-head validation reruns, and the full gate returns green.

Likely next fix:
- update `scripts/audit-casino-catalog.mjs` so it supports the actual manifest object shape, probably by iterating `Object.entries(manifest.jurisdictions ?? {})` or `Object.values(...)` depending on how jurisdiction names are needed downstream;
- inspect both `audit/casino-sources.json` and `audit/casino-sources-integration.json` before implementing so the parser safely supports both shapes if they differ;
- rerun validation on the exact candidate head;
- only after green validation should PR #33 be promoted into active integration.

## Remaining Nevada frontier after the Cadence Crossing candidate

### Red Dragon Sports Bar #201 / Red Dragon Casino — Elko
- Address: `404 S 5th St, Elko, NV 89801`
- Status: coordinate-only hold.
- Elko County, licensing, tourism, and directory evidence strongly support Red Dragon as the current canonical consumer-facing identity.
- Elko County assessor evidence associates the property with parcel `001-422-002` and casino use.
- Dotty's #214 is a co-located Nevada Restaurant Services concept/license at the same physical property and should **not** become a second routable Dinner Roulette destination.
- Still missing: direct numerical parcel/building point traceable to the current property.
- Do not substitute a generic geocode or nearby parcel centroid.

### The Pass Casino — Henderson
- Status: closure/renovation hold.
- Do not restore to runtime until reopening is independently confirmed as current.

### Whiskey Pete's / Buffalo Bill's — Primm
- Current working status: closure exclusions.
- Primm Valley remains active separately.
- These may remain exclusions permanently rather than become additions.

Nevada therefore has fewer true add-candidates than raw unresolved names suggest.

## Remaining Oklahoma priority frontier

Three Oklahoma properties remain high-priority coordinate holds. Their current operation/address identity is strong; the problem is direct numerical current-property coordinates.

### Lakecrest Casino and Hotel
- Address: `1000 US HW 70 E, Ardmore, OK 73401`
- Current first-party and Chickasaw Nation evidence strongly confirms the operating property and address.
- Tavily also recovered current property/contact evidence and official tourism references.
- Waze/third-party route references exist.
- **Do not use** `34.172006,-97.173354`; that point was identified as adjacent development/commercial land and remains excluded.

### Lake Eufaula Casino Hotel
- Address: `1045 Birkes Rd, Eufaula, OK 74432`
- Current first-party Muscogee Nation property pages confirm the current operation, hotel, 24/7 status, address, and phone.
- Independent research confirms the new property replaced the old Creek Nation Eufaula casino.
- The old property at `806 W Forrest Ave` is permanently closed.
- Never reuse the predecessor coordinate for the new casino.
- TinyFish, Parallel Search, and prior mapping checks strengthened identity evidence but did not yet yield an acceptable current-property numerical point.

### Creek Nation Casino Holdenville
- Address: `211 E Willow St, Holdenville, OK 74848`
- Current official site confirms the operation and long-running property.
- Independent search/map sources also confirm address identity.
- `35.083599,-96.401627` is a Holdenville city centroid, not the casino, and remains excluded.
- Still needs a direct numerical current-property point.

## Discovery-stack results from the latest no-deployment sweep

The user explicitly requested aggressive use of the connected discovery stack.

Tools used in the latest pass:
- **TinyFish**: routine searches for Lake Eufaula and Holdenville current identity/map evidence.
- **Tavily**: broader Lakecrest research, surfacing Chickasaw Nation, Lakecrest first-party, tourism, MapQuest/Waze, and related references.
- **Parallel Search**: independent confirmation for Lake Eufaula current first-party pages, opening/replacement context, Holdenville operation, and Lakecrest mapping references.
- **Firecrawl**: decisive current-property Cadence Crossing discovery; returned a current MapQuest entity with direct numerical coordinates and current-property metadata.
- **Exa**: not needed in this sweep because the primary stack produced enough useful evidence to clear Cadence Crossing and reinforce the Oklahoma holds without lowering standards.

General lesson from this pass: multiple free discovery sources are useful not because any one is authoritative for everything, but because they can triangulate identity, operation, replacement history, address, and coordinate provenance while preserving the evidence gate.

## Colorado status

Colorado is runtime-complete and green at **31 destinations**:
- 13 Black Hawk
- 6 Central City
- 10 Cripple Creek
- 2 tribal

Address/property-coordinate QA and duplicate/alias reconciliation are complete in `audit/colorado-statewide-runtime-reconciliation-2026-09-11.json`.

Colorado is maintenance/re-audit only unless new evidence or openings appear.

## Texas status

Texas is runtime-complete and green at **4 destinations**:
- Kickapoo Lucky Eagle Casino Hotel
- Naskila Casino Livingston
- Naskila Casino Leggett
- Speaking Rock Entertainment Center

Coordinate QA is 4/4. Naskila Leggett provenance is intentionally documented as user-assisted current map-pin verification rather than falsely described as first-party coordinate publication.

Texas is maintenance/re-audit only.

## App behavior and architecture that must remain stable

Nightlife search uses:
- curated casino passes,
- Jasper County nightlife catalog,
- local nightlife catalog,
- live Overpass discovery with multiple mirrors,
- runtime merging/deduplication based on name matching and geospatial proximity.

`src/lib/nightlife/search.ts` currently imports casino catalogs sequentially and `dedupeCuratedCasinosLatestWins()` canonicalizes same-property records while preserving historical source files.

Do not casually change this behavior while doing casino cleanup. If broader restructuring becomes desirable, preserve routing behavior, latest-pass precedence, IDs where possible, and auditability.

## Legal/compliance continuity

Pick For Me / Dinner Roulette is an independent discovery/decision tool.
- Third-party names identify destinations/services without implying affiliation.
- Casino/nightlife features are discovery/trip-planning only.
- The app does not accept wagers, provide gambling, sell alcohol, or guarantee admission.
- `LEGAL.md` and Settings carry legal/privacy/third-party disclosures.

## Restaurant icon continuity

Issue #29 remains the original Dinner icon system:
- 15 semantic categories per theme,
- 30 canonical assets under `public/dinner-icons/{dark,light}/`,
- resolution through `src/lib/restaurants/dinner-icons.ts`.

Preserve this unless the user explicitly requests a redesign.

## Caustic Relay / startup-ident continuity

Caustic Relay is the active working maker/publisher brand.

The canonical black-mamba/scorpion hybrid creature is immutable unless Caleb explicitly requests a redesign. Current startup asset:
- `public/brand/CAUSTIC_RELAY_ident-2.mp4`
- wired through `src/components/startup-ident.tsx`.

Mordax / Caustic Relay mythology is conceptually connected to user choice and non-coercive intervention, but app engineering should not silently alter the visual identity based on mythology alone.

## Future food-truck discovery

Food trucks remain a planned dedicated mobile-venue discovery pass.

Important design rule:
- distinguish **live/serving now**, **scheduled today**, and **discovered nearby**;
- never roulette a stale registered business address as if a mobile truck is confirmed there.

This feature is one reason the user wants stronger live-discovery infrastructure.

## Immediate next steps for Astra

1. Read this file and inspect PR #33 before making changes.
2. Fix the `manifest.jurisdictions` iteration bug in `scripts/audit-casino-catalog.mjs` after checking both manifest shapes.
3. Keep the fix narrow; do not weaken audit assertions.
4. Trigger/observe exact-head `Validate Dinner Integration` for PR #33.
5. If the full workflow is green, promote Pass 49 into `integration/active-work-pass-1`; do **not** merge to `main`.
6. Update continuity immediately after promotion with the exact merge SHA and validated four-state total of 194.
7. Continue direct-point research on Red Dragon, Lakecrest, Lake Eufaula, and Holdenville using TinyFish → Tavily/Parallel → Firecrawl escalation, with Exa only if the primary stack leaves a meaningful gap.
8. Re-check The Pass, Whiskey Pete's, and Buffalo Bill's for current operating status before deciding whether they remain exclusions.
9. Continue all non-deployment cleanup, tests, data prep, UI/data-structure work, and documentation that can be completed while Vercel is blocked.
10. Only stop when the remaining meaningful tasks truly require live hosted verification/deployment or an inaccessible capability.

## Merge discipline

- `integration/active-work-pass-1` is the compatibility/integration surface.
- Feature/candidate branches should validate before promotion.
- Preserve historical branches and audit artifacts as provenance.
- Do not merge integration or feature work to `main` unless Caleb explicitly requests it.
- Do not merge PR #33 while Run 283 is red.
- After any material runtime/integration change, inspect `Validate Dinner Integration` and update this continuity file.

`main` remains untouched.
