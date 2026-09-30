# Pick For Us — Seasonal Discovery Remediation 1

## Repository
`caleb1234calvin-art/dinner-roulette`

## Working branch
`audit/seasonal-discovery-coverage-1`

## Frozen production base
`0a8f30dc57fcc1156342d1bfc8a07524f3125e3b`

## Audited checkpoint
`4f6bf5fde5ffb1f4e99b34584ebd4e767ba39ac3`

## Authoritative audit

Read IN FULL before modifying anything:

- `docs/handoffs/active/seasonal-discovery-coverage-audit-1.md`
- `audit/seasonal-discovery-coverage-audit-1-2026-09-29.md`
- `audit/seasonal-discovery-coverage-audit-1-2026-09-29.json`
- supporting evidence under `audit/seasonal-discovery-coverage-audit-1-evidence/`, if present

Audit final state:

`SEASONAL DISCOVERY AUDIT — REMEDIATION RECOMMENDED`

The audit reproduced the Carthage 50-mile H+C+P result as two saved haunts and identified six actionable findings: four IMPORTANT and two NON-BLOCKING.

This handoff authorizes a **bounded systemic remediation of F01–F06 plus regression coverage**. It does not authorize a local hard-coded venue patch.

## Starting-state protocol

Before modifying:

1. Fetch fresh remote refs.
2. Verify current main.
3. Verify working branch and ancestry.
4. Verify audited checkpoint `4f6bf5f...` is in ancestry.
5. Determine whether the audit report/evidence created by the audit worker is already committed.
6. If audit artifacts are only present in the worker workspace and unavailable in this fresh workspace/repository, STOP and report that the authoritative audit artifacts must first be persisted. Do not reconstruct them from this summary.
7. Verify no unreviewed implementation changes exist after the audited checkpoint.
8. Confirm clean checkout before implementation.
9. Read the full implementation pipeline identified by the audit.

If current main has moved or implementation changes exist after the audited checkpoint, stop and report rather than rebasing or improvising.

---

# Mission

Improve seasonal Date Night discovery systemically while preserving the verified behaviors that already work.

Remediate:

- F01 seasonal acquisition/source coverage
- F02 generic-maze false classification
- F03 availability/lifecycle policy integration
- F04 duplicate multi-activity category loss
- F05 stale/ambiguous seasonal status presentation
- F06 sparse-source disclosure

Add deterministic regression coverage for the proven failure modes.

Do not optimize for a predetermined result count.

Do not make Carthage-specific behavior the architecture.

---

# F01 — Seasonal acquisition/source coverage

Audit proof:

- Carthage product query: 281 raw provider elements, zero live seasonal candidates.
- Final two seasonal candidates came from saved catalog anchors only.
- Similar regional behavior occurred in Joplin, Springfield, Lockwood and Aurora controls.
- Exeter Corn Maze has a real OSM record inside the Carthage radius tagged `tourism=theme_park`; the current query does not request that representation, although the existing downstream normalizer can recognize it as corn-maze if supplied.
- Current query vocabulary is too narrow for seasonal attractions.

## Required remediation

Broaden seasonal acquisition using **bounded, precision-conscious complementary query vocabulary**.

At minimum evaluate and implement appropriate support for representations such as:

- relevant `tourism=theme_park`
- relevant attraction/farm/activity representations
- haunted-trail/haunted-attraction representations where supported
- seasonal metadata that can identify pumpkin/corn/haunt activity without turning every park/farm/theme park into a seasonal result

Do not classify every theme park, farm, attraction or park as seasonal.

Acquisition and classification are separate concerns: broader acquisition must be paired with positive evidence before assigning seasonal categories.

The remediation should make the proven Exeter query omission reachable through the product pipeline without creating broad false positives.

If maintained complementary event/operator sourcing can be implemented safely within the existing architecture and repository constraints, it may be added. Do not add brittle scraping of arbitrary websites merely to increase counts. If a reliable complementary source cannot be implemented within this bounded remediation, document the remaining source limitation honestly rather than hard-coding the audit reference set.

## Explicit prohibition

Do NOT directly add the audit's Carthage-area reference candidates to the production catalog merely to satisfy the audit.

---

# F02 — Generic maze classification

Audit proof:

`attraction=maze` / generic maze evidence currently becomes `corn-maze`.

Turtle Moon Labyrinth was a real false positive in the Aurora control: a meditation labyrinth appeared as a corn maze.

## Required remediation

Require positive evidence of a corn/agricultural seasonal maze before assigning `corn-maze`.

Acceptable evidence may include precise provider tags and substantiated activity/name/description evidence, but must be conservative enough to reject:

- meditation labyrinths
- hedge mazes
- generic mazes without corn/agricultural evidence

Do not rely on unrestricted name guessing alone.

Add positive and negative regression fixtures, including the proven Turtle Moon/generic-maze shape.

---

# F03 — Availability and lifecycle integration

Audit proof:

- strict helper tests pass, but the real Date Night UI eligibility path does not call those helpers
- unknown live hours can pass Open Now
- seasonal lifecycle and confirmed date windows are not consistently integrated
- structured disused/permanent lifecycle states are not handled coherently
- Open Now OFF correctly retains useful closed/upcoming browsing in the primary case

## Required remediation

Define and use one coherent eligibility model that distinguishes at minimum:

- open now
- closed now
- hours unknown
- schedule unconfirmed
- upcoming season
- active season
- finished/not-operating season
- permanent/disused closure

Preserve useful browsing with Open Now OFF.

For Open Now ON, honor the product's strict promise: do not represent unknown-hours or unconfirmed-current-season venues as positively open.

Integrate the approved policy into the actual visible Date Night eligibility path, not only isolated helpers.

Handle structured lifecycle tags where provider data supplies them.

Ensure status can refresh at meaningful time boundaries rather than remaining permanently memoized from stale clock state.

Do not conflate "closed tonight", "season has not started", "season ended", "schedule unknown", and "permanently closed".

---

# F04 — Duplicate category preservation

Audit proof:

The first uniqueness map overwrites same-name/same-rounded-coordinate records before later dedupe can union categories. A venue represented as corn maze + pumpkin patch can become only one category depending on provider order.

## Required remediation

Make first-stage identity consolidation order-independent.

Before discarding duplicate identity representations:

- union activity/category evidence
- preserve useful provenance
- deliberately choose representative location/hours/metadata
- preserve stable unique identity semantics

Verify both C→P and P→C input order produce the same multi-category result.

Do not loosen nearby-venue deduplication indiscriminately.

---

# F05 — Status freshness and presentation

Audit proof:

Myer's internal `Schedule unconfirmed` state renders as `Closed`, while fresh operator evidence now advertises an October 2026 calendar. Numeric count is correct; the issue is state/provenance/freshness.

## Required remediation

Make user-facing status distinguish schedule uncertainty from known closure.

Where current curated seasonal records have authoritative repository data, update them only if evidence is sufficiently strong and provenance/check date can be recorded cleanly.

Do not silently import the entire audit reference set.

If Myer's 2026 calendar is refreshed, preserve source/provenance and checked date in the appropriate data/evidence convention.

Introduce or document a revalidation/expiry mechanism appropriate to seasonal records so stale "unconfirmed" state does not persist indefinitely.

Do not claim current operation when evidence is conflicting.

---

# F06 — Sparse-source disclosure

Audit proof:

A successful provider query can return no selected seasonal candidates while the app merges in two saved anchors and reports `source=merged` without warning. The numeric count is correct but does not disclose that selected-category coverage is saved-only.

## Required remediation

Keep the match count honest.

Add a bounded disclosure/status mechanism that can distinguish:

- live seasonal contribution present
- selected seasonal categories represented only by saved anchors
- selected categories missing from the discovered pool
- provider outage/fallback
- sparse successful query

Do not label a successful sparse query as a network outage.

Do not imply exhaustive real-world coverage.

Keep disclosure concise enough not to overwhelm the normal Date Night experience.

---

# Regression requirements

Add production regression tests for the proven risks.

At minimum cover:

1. Exeter-style query vocabulary reaches ingestion when its provider representation qualifies.
2. Generic/meditation/hedge maze does NOT become corn maze.
3. Positive corn-maze representation still classifies correctly.
4. Pumpkin-patch representation classifies correctly.
5. Haunted attraction representation classifies correctly.
6. Open Now OFF retains eligible closed/upcoming seasonal venues under approved policy.
7. Open Now ON excludes unknown-hours/unconfirmed-open venues.
8. Active-season known-open venue passes ON.
9. Finished-season/permanent-disused lifecycle behavior follows approved policy.
10. All seven seasonal category selection combinations preserve union semantics.
11. Same-identity C/P records preserve both categories in either input order.
12. Multi-category venue appears once in options and retains all categories.
13. Radius boundary behavior remains correct.
14. Valid-empty/sparse live result plus anchors is distinguished from provider outage.
15. UI count equals actual eligible pool.
16. Sparse saved-only coverage disclosure is correct.
17. Plan validity/incomplete-plan behavior remains honest.
18. Existing ordinary Date Night discovery remains functional.

Prefer search-handler → eligibility → component-level assertions rather than pure helpers only.

If browser infrastructure is available, include browser/RPC acceptance. If unavailable, document the limitation and use the strongest deterministic component/runtime harness available.

---

# Control-location validation

After implementation, test the same regional controls used by the audit where live-provider access permits:

- Carthage
- Joplin
- Springfield
- Lockwood rural
- Aurora

Do not require an exact live result count because provider data is mutable.

Instead verify:

- no generic-maze false positives
- proven reachable provider representations are acquired
- category semantics remain correct
- source/disclosure state is truthful
- no radius/open-state regression
- no duplicate category loss

Keep live-provider observations separate from deterministic regression assertions.

---

# Preserved invariants

Do not regress:

- Pick For Us branding
- Dinner mode
- Nightlife mode
- ordinary Date Night
- Halloween/seasonal activation window and user toggle
- favorites/history/settings
- location/manual GPS behavior
- international behavior
- casino invariants
- production URL assumptions
- Android Phase B architecture
- migration-free Vercel production build configuration
- existing repository-native handoff workflow

Do not change Android signing/publication behavior.

Do not deploy during this task.

---

# Validation gates

Run, at minimum, against the final implementation tree:

- clean dependency install if environment permits
- complete dependency-tree inspection
- typecheck
- full JavaScript tests
- relevant Python/verifier tests
- changed-code lint
- all new seasonal regression tests
- existing seasonal availability tests
- existing location-discovery tests
- casino invariants
- migration-free production build
- Android structural/icon checks if current standard requires them for cross-cutting release confidence
- Capacitor sync/tracked-byte check if current standard requires it
- `git diff --check`
- secret/generated-junk sanity check

Run browser acceptance when available. Do not claim it if unavailable.

Do not run database migrations.

---

# Audit artifacts

The original audit worker reported its audit report/evidence as uncommitted.

Before implementation, those artifacts must be persisted on this branch if they are available to the worker.

Preserve the original report/evidence unchanged.

Do not rewrite the audit conclusion after remediation.

Add separate remediation evidence, suggested path:

`audit/seasonal-discovery-remediation-1-2026-09-29.json`

and, if useful:

`audit/seasonal-discovery-remediation-1-2026-09-29.md`

Record:

- exact starting SHA/tree
- audit artifact hashes
- changed implementation paths
- F01–F06 implementation mapping
- regression tests added
- exact commands/results
- live-control observations separately
- limitations
- resulting commit SHA or post-commit linkage strategy

Update current continuity with the remediation checkpoint without rewriting historical audit evidence.

---

# Scope limits

Do not:

- hard-code only the audit reference venues
- add unverified venues merely to increase counts
- widen radius to manufacture coverage
- weaken Open Now semantics
- treat generic maze as corn maze
- treat four Overpass mirrors as independent inventories
- claim provider completeness
- add unrelated feature work
- redesign the Date Night UI beyond the bounded disclosure/status needs
- change Vercel settings
- run migrations
- merge to main
- deploy
- sign/publish Android
- upload to Play

If a safe systemic F01 acquisition improvement requires architecture substantially beyond this handoff, implement the bounded proven query/classification improvements and document the remaining source limitation rather than expanding into a new scraping platform.

---

# Commit / push protocol

If and only if required remediation and validation pass:

1. Review complete diff.
2. Verify changes map to F01–F06, regression coverage, audit persistence, remediation evidence, and continuity only.
3. Commit the remediation checkpoint on:
   `audit/seasonal-discovery-coverage-1`
4. Push the branch.
5. Report exact resulting SHA/tree.
6. Confirm clean working tree.
7. STOP.

Do not merge.

## Completion state

Successful implementation must end with:

`SEASONAL DISCOVERY REMEDIATED — AWAITING INDEPENDENT VERIFICATION`

If a required finding cannot be safely remediated within scope or a required gate fails:

`SEASONAL DISCOVERY REMEDIATION INCOMPLETE — REVIEW REQUIRED`

Do not self-verify the remediation as merge-ready.

A fresh Astra must perform independent verification from a repository handoff after implementation.
