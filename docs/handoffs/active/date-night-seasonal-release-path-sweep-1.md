# Pick for Us — Seasonal Release Path Sweep #1

Repository: `caleb1234calvin-art/dinner-roulette`

## Purpose

This is the authoritative handoff for the next seasonal-data research sweep.

The owner wants one substantial conditional sweep that tries to **finish source research entirely**, rather than returning after every narrow dead end.

The sweep must remain zero-contact, $0-by-architecture, fact-only, permission-qualified, and documentation-only.

If a qualifying source path is established, continue in the same sweep through a **narrow contract design and implementation handoff**, but do not modify executable code.

---

## Immutable starting point

Start from the exact published Georgetown Morgue qualification commit:

- SHA: `9c19deec26b433e7fb6b14c48e76cc0ea4cfbc93`
- Tree: `6b47904c0432cef8b2f7b32c4f45bf82d4cd472d`
- Sole parent: `e8c3545a317486b5facbe024423d724c009f7b4c`
- Branch: `research/date-night-seasonal-seattle-georgetown-morgue-qualification-1`

Required new research branch:

`research/date-night-seasonal-release-path-sweep-1`

Required final research history:

- one additions-only documentation commit above the immutable starting SHA if practical
- no history rewriting
- no executable changes
- no merge to main

Current protected production state:

- main: `078f65c5d194435452ca14569ea00e57f52a20f3`
- production deployment: `dpl_HmqKyiLqCqMSTrhxKktsy9mJtDKy`

These must remain unchanged.

---

# Current proven state

## Seasonal Fact Contract

The Seasonal Fact Contract has already been implemented, remediated, independently verified, and published.

Verified remediation base:

- SHA `e097f949d2871054a47ab55869396d7ce1baca86`
- tree `174b0efc91532029a7d6a989346579871e246de7`
- parent `f7fa63f5688b1d09e5b0baccfd5e617d0748a41a`

Do not rebuild or redesign the whole contract.

Known v1 compatibility limits relevant to this sweep:

- ordinary `application/json` is not currently accepted
- Socrata dollar-prefixed query names such as `$select`, `$where`, `$limit`, `$order` do not pass the current query-name allowlist
- current query-value bounds can be too short for real bounded Socrata projections/filters
- selected observations require explicit matching season/year and nonhistorical verification
- static Source A facts cannot silently inherit current-season evidence from Source B
- runtime eligibility requires an explicit calendar
- coordinate method/meaning/uncertainty review remains important

If a source qualifies, the likely next implementation stage is a **narrow contract extension**, not a contract rewrite.

---

# Source research history that must not be repeated blindly

## Cadaver Zone

Blocked at access/reuse review. Do not retry or route around prior access uncertainty.

## NYC Parks

Permission and anonymous SODA2 access were supportable, and owner-side Termux proved the endpoint works.

However, the live feed did not provide a clean qualifying corn-maze / pumpkin-patch / haunted-house record. Halloween/fall event titles were not accepted as attraction classification.

Do not weaken category semantics to make NYC Parks fit.

## Montgomery County AgriTourism / Arader Tree Farm

Montgomery County's AgriTourism GIS gave the first strong explicit seasonal-attraction identity row.

Arader Tree Farm record contained:

- `CornMaze="Yes"`
- `PumpkinPicking="Yes"`
- complete PA street/city/state/ZIP
- phone
- website
- WGS84 geometry
- source-specific "free and open resource" declaration

But it did not supply permission-qualified current-season 2026 operating evidence.

Arader operator origin returned 406 during a bounded check.

Owner direction supersedes operator-contact recommendations:

**No Arader retry. No operator outreach. No permission request.**

## Seasonal Attraction Dataset Discovery #2

Published exact commit:

- SHA `e8c3545a317486b5facbe024423d724c009f7b4c`
- tree `b1d5d400980ce15538c2aeef0c646a605559acda`
- parent `67ac0654488bb7f02b1c08eef11479c4fe63af04`

Eight sources were screened.

Seattle Building Permits was the strongest lead:

- dataset `76t5-zqzr`
- explicit official `PUBLIC_DOMAIN` metadata
- anonymous JSON access at $0
- actual 2026 records `7160133-CN` and `7160149-CN`
- exact administrative phrase `Georgetown Morgue Haunted House 2026`
- complete address: 5000 EAST MARGINAL WAY S, SEATTLE, WA 98134
- worksite coordinates: 47.55724818, -122.33836450
- temporary occupancy periods spanning 2026-09-19 through 2026-11-07

But:

- dedicated category fields are permit categories, not attraction categories
- haunted-house classification is a reviewed text extraction
- occupancy authorization is not a public visitor calendar
- permit IDs are administrative records, not permanent attraction IDs
- coordinate CRS/uncertainty/entrance meaning remain incomplete
- one permit has expiration before issue date; do not repair it
- the second permit expires in 2028; do not map that to attraction season end

## Georgetown Morgue Qualification #1

This is the immediate base for the new sweep.

Exact published candidate:

- SHA `9c19deec26b433e7fb6b14c48e76cc0ea4cfbc93`
- tree `6b47904c0432cef8b2f7b32c4f45bf82d4cd472d`
- parent `e8c3545a317486b5facbe024423d724c009f7b4c`

Verdict:

**SEATTLE GEORGETOWN MORGUE QUALIFICATION BLOCKED — OPEN VISITOR-CALENDAR/CATEGORY EVIDENCE NOT ESTABLISHED**

Decision:

**C — MORE SOURCE RESEARCH**

New facts established:

### Seattle Special Events Permits `dm95-f8w5`

Official Public Domain dataset.

Six exact-name Georgetown Morgue Haunted House rows:

- 2019
- 2020
- 2021
- 2022
- 2023
- 2024

No 2026 row was obtained.

Newest dataset update metadata is January 2025.

The historical rows are useful identity/history evidence but cannot be relabeled 2026.

### Seattle Active Business License Tax Certificate `wnbq-64tb`

Official Public Domain dataset.

Actual same-address business row:

- legal/trade name: `SEATTLEHAUNTS LLC`
- 5000 E MARGINAL WAY S
- Seattle, WA 98134-2408
- city account `0007491390659762`
- UBI source string `6032185720010001`

This supports a same-address business lead.

It does not prove a canonical operator-of relationship to Georgetown Morgue.

Its NAICS category `812990 — All Other Personal Services` is not a haunted-house classification.

No visitor calendar exists in this dataset.

### Seattle 2026 Special Events transition

Official Seattle Special Events guidance indicates 2026 applications moved to **Eproval**.

This creates one final narrow Seattle question:

Does the 2026 Eproval-era Special Events process expose an official public export/feed/API/record surface with affirmative reuse rights and a real Georgetown Morgue 2026 row?

If not, Georgetown must be parked.

### OSM

ODbL permission is affirmative.

A narrow Overpass query returned HTTP 406 in the Work environment.

Do not claim absence.

Do not make OSM the primary Seattle pivot.

A later one-shot Termux transport diagnostic is optional and separate from the main path.

---

# OWNER DIRECTION

## Zero contact

No:

- operator emails
- phone calls
- social-media messages
- forms to attractions
- private attestations
- permission negotiations
- agency outreach
- public-records requests requiring contact
- account/login creation merely to access hidden data

The owner wants the architecture to scale from already-published reusable data.

## Cost

Core path must remain $0.

Reject required:

- paid APIs
- metered geocoders
- paid proxy/scraping services
- Google Places
- Yelp
- TripAdvisor
- commercial event-data resellers
- credit-card-required "free" tiers

## Access

No:

- CAPTCHA bypass
- login bypass
- anti-bot circumvention
- alternate-user-agent games
- proxy rotation
- unofficial mirrors
- HTTP downgrade tricks
- bulk crawling

A transport failure is not proof that a source contains no qualifying records.

---

# MISSION

Run one conditional research sweep designed to get Pick for Us **out of source discovery** if a defensible path exists.

The sweep has three phases.

Do not stop after Phase A merely because Seattle fails.

---

# PHASE A — Final Seattle 2026 Special Events public-export triage

Exact title:

**SEATTLE 2026 SPECIAL-EVENTS PUBLIC EXPORT RIGHTS TRIAGE #1 — ZERO CONTACT**

This is intentionally tiny.

Investigate only whether Seattle's 2026 Eproval-era Special Events workflow exposes a public, no-login, $0, affirmatively reusable data/export/API surface relevant to Georgetown Morgue.

Prioritize:

1. official Seattle Special Events documentation
2. official Seattle open-data catalog
3. official Eproval/public portal documentation linked by Seattle
4. public export/API/feed documentation exposed from those official surfaces

Maximum:

- 4 candidate-directed content actions
- 2 controlled direct data requests if a concrete public endpoint is found
- no login
- no form submission
- no operator or agency contact

Success requires a real 2026 Georgetown Morgue record or a directly equivalent current visitor occurrence record with:

- explicit identity
- explicit qualifying haunted-house category or equally strong structured classification
- actual visitor-facing 2026 dates/calendar/status
- affirmative reuse rights
- machine-readable or tightly bounded official access

Do not treat permit validity/occupancy as visitor dates.

## Mandatory Seattle stop rule

If no clearly public, permission-qualified 2026 export is exposed within the above bounds:

**PARK GEORGETOWN MORGUE.**

Record why and move immediately to Phase B.

Do not run Seattle Qualification #2.

Do not spend the rest of the sweep on Seattle.

---

# PHASE B — Implementation-first source qualification pivot

The goal is not another generic eight-source catalog.

The goal is to find **one source path that is actually capable of becoming the first real collector pilot.**

## Qualifying activities remain exact

Only:

- `corn-maze`
- `pumpkin-patch` / explicit visitor pumpkin picking
- `haunted-house` / clearly equivalent immersive haunted attraction

Do not broaden to generic Halloween events, fall festivals, ghost tours, haunted trails, hayrides, pumpkin crafts, generic farms, generic mazes, or pumpkins-for-sale.

## Strongly preferred source

One official/open machine-readable source that directly provides:

- attraction identity
- explicit qualifying activity/category
- complete address or contract-feasible address
- current 2026 visitor operation
- visitor calendar/dates/hours or explicit occurrence schedule
- stable source record identity
- coordinates if available
- affirmative reuse rights
- $0 access

A good single source is more valuable than a richer multi-source graph.

## Allowed two-source path

A two-source solution is acceptable only if both sources independently pass permission/access review.

Preferred pattern:

Source A:
- identity
- category
- address/location

Source B:
- 2026 visitor calendar/status

Must have:

- strong same-attraction crosswalk
- separate provenance
- no season inheritance by assumption
- no operator contact
- no paid service

## Search priority

Use an implementation-first order:

1. current municipal/county/state open event datasets with explicit 2026 rows
2. government agritourism datasets with dedicated corn-maze/pumpkin fields plus current-season dates
3. temporary-event / special-event permit datasets where the event category and public dates are actually structured
4. state/local tourism open-data APIs with explicit reuse rights
5. public-domain/CC0/CC-BY structured attraction/event feeds
6. ODbL sources only where current-season calendar data is actually present and transport is practical
7. additional government GIS sources only if they improve materially on Montgomery County

Geographic preference:

1. Missouri
2. Kansas
3. Oklahoma
4. Arkansas
5. nearby Midwest
6. broader US when source quality is substantially better

Do not reject an excellent proof source merely because it is outside the four-state area.

## Research bounds

After Seattle is parked or qualified:

- screen up to 10 candidate datasets/services
- perform serious/deep evaluation on no more than 4
- maximum 3 controlled direct data/metadata requests per serious candidate
- stop immediately when one candidate clearly qualifies

Search-index discovery does not itself count as an acquired record.

Do not fill a quota just to produce a table.

## Permission gate

Selectable sources need affirmative authority such as:

- Public Domain
- CC0
- CC-BY
- ODbL
- explicit government open-data policy applicable to the records
- explicit API/data reuse grant

Never infer rights solely from public availability or government ownership.

For every serious candidate record:

- publisher
- official status
- dataset/service
- canonical endpoint
- license/grant
- commercial factual reuse
- normalization/modification
- attribution
- automated access
- account/key requirement
- billing/card requirement
- rate-limit posture
- review date

## Current-season gate

A qualifying path must support 2026 visitor operation through facts such as:

- individual 2026 opening/event dates
- date range plus actual visitor schedule semantics
- explicit 2026 event occurrence
- current-season calendar/status designed to mean visitor operation

Not enough:

- dataset modified in 2026
- permit issue date
- permit occupancy authorization
- license renewal
- current retrieval date
- copyright footer
- generic seasonal text

## Category gate

Best:

- dedicated structured value: Corn Maze / Pumpkin Picking / Haunted House

Potentially acceptable:

- tightly bounded factual field that unmistakably identifies the activity, with explicit reviewed extraction rules

Do not rely primarily on promotional prose.

## Location

Prefer direct:

- street
- city
- state
- postal
- country

US may be a reviewed jurisdiction derivation where appropriate.

No geocoder.

Coordinates are optional for source selection if address/current-season/category evidence is otherwise excellent, but unresolved coordinate semantics must remain explicit.

---

# PHASE C — Narrow contract design if and only if a source path qualifies

Do not stop the sweep at "source found."

If Phase A or B establishes a qualifying path, continue immediately into a **documentation-only contract design**.

No executable changes.

Inspect the existing `tools/seasonal-facts` contract and design the smallest truthful extension necessary for the selected source.

Address only what the selected source actually needs.

Possible areas include:

- ordinary `application/json`
- narrowly scoped Socrata/ArcGIS query parameters
- explicit allowed dollar-prefixed SoQL names
- bounded larger query-value lengths
- exact host/path/query constraints
- strict JSON parsing
- source-specific field allowlists
- same-source or multi-source evidence roles
- explicit current-season observation semantics
- derivation/crosswalk records
- coordinate evidence states
- durable occurrence identity distinct from venue identity
- attribution/provenance requirements
- stale/current lifecycle handling

Do not loosen policy generically.

Every new allowance should be tied to a reviewed source requirement and have an adversarial test plan.

If a single source supplies all required facts, avoid inventing multi-source complexity.

If two sources are required, design truthful independent provenance rather than copying season/year onto static observations.

## Contract design deliverables

Produce:

1. exact problem statement
2. selected source contract
3. allowed request shape
4. response envelope requirements
5. parsing/normalization rules
6. provenance model
7. occurrence/venue identity rules
8. current-season/calendar rules
9. coordinate rules
10. failure-closed behavior
11. security/SSRF/query restrictions
12. deterministic artifact/evidence shape
13. test matrix
14. migration assessment
15. exact implementation file/path plan
16. explicit non-goals

No migrations should be required unless proven unavoidable; do not create one here.

---

# IMPLEMENTATION HANDOFF

If a source qualifies and Phase C completes, create a final handoff for the next worker whose mission is implementation.

Recommended next implementation branch:

`feature/date-night-seasonal-source-pilot-2`

or a more source-specific branch if the report justifies it.

That handoff must be sufficiently detailed that the implementation worker does not need to repeat source research.

Include:

- immutable implementation base SHA/tree/parent
- selected source(s)
- exact endpoints
- exact permission evidence
- exact real qualifying row(s)
- exact request shape
- exact allowed fields
- parsing rules
- derivations
- provenance
- security constraints
- test plan
- expected artifact outputs
- explicit forbidden changes
- no runtime integration yet
- no Date Night integration yet
- no production activation yet

The next implementation worker should be able to code directly from the handoff.

---

# VERDICTS

Use exactly one primary outcome.

## Best outcome

**SEASONAL RELEASE PATH READY — SOURCE QUALIFIED AND NARROW CONTRACT DESIGN COMPLETE**

Decision:

**B — IMPLEMENT NARROW CONTRACT + SOURCE PILOT NEXT**

This means source research is finished for the pilot.

## Source qualified but design cannot safely complete

**SEASONAL SOURCE QUALIFIED — CONTRACT DESIGN BLOCKED**

Explain the exact engineering blocker.

Do not go back to generalized discovery unless the blocker is factual rather than engineering.

## No source path after bounded pivot

**SEASONAL RELEASE PATH BLOCKED — NO IMPLEMENTATION-READY ZERO-CONTACT SOURCE FOUND**

Decision:

**C — RELEASE-SCOPE DECISION REQUIRED**

This is important.

If the bounded Phase B search fails, do not automatically recommend another nearly identical source-discovery sweep.

Instead give the owner a release-scope choice, for example:

- ship seasonal UI without live seasonal attraction ingestion
- ship a manually curated/static reviewed seed if separately authorized
- defer this category
- relax a clearly identified non-safety product requirement
- authorize a different data acquisition model

Do not relax permissions, access controls, or factual integrity merely to ship.

---

# Documentation and evidence

Research branch may add only documentation/evidence/handoffs.

Suggested paths:

`audit/date-night-seasonal-release-path-sweep-1.md`

`audit/date-night-seasonal-release-path-sweep-1-evidence/`

`docs/handoffs/active/date-night-seasonal-release-path-sweep-1-continuation.md`

If qualified:

`docs/handoffs/active/date-night-seasonal-source-pilot-2-implementation.md`

All executable changed paths must remain 0.

Allowed evidence:

- candidate comparison
- permission receipts
- exact factual records
- request ledger
- source schemas
- crosswalk evidence
- contract design
- validation receipt

Do not retain:

- reviews
- ratings
- images
- logos
- promotional prose
- testimonials
- unrelated personal applicant/contact records
- credentials/cookies/tokens

---

# Validation

Before final commit:

- verify starting SHA/tree/sole parent
- additions only
- preserve all preexisting object IDs/types/modes
- parse all added JSON
- `git diff --check`
- sensitive-content screen
- executable changed paths = 0
- clean staged scope
- no untracked artifacts

After commit record:

- exact SHA
- tree
- sole parent
- clean worktree
- changed-path inventory

Do not run migrations.

Do not run implementation builds/tests for a documentation-only research/design sweep.

---

# Publication boundary

STOP before pushing the final research branch.

The owner requires separate authorization for any normal Git-triggered Vercel Preview.

Report the exact reviewed:

- branch
- SHA
- tree
- sole parent
- verdict
- implementation decision
- next task

Preserve exact commit identity.

Do not rebuild, amend, recommit, cherry-pick, squash, or rebase merely to publish.

If cloud Git transport cannot preserve/push the exact object, do not waste time trying to reconstruct it.

Create/retain an exact Git bundle so the owner can publish through the already-working authenticated Termux path.

Do not change `vercel.json` to avoid the Preview rule.

---

# Production preservation

Do not:

- modify main
- merge
- deploy production
- promote a Preview
- move production aliases
- alter Vercel configuration
- activate a source
- generate runtime seasonal data
- integrate Date Night
- modify dependencies/lockfile
- change database schema
- run migrations

Main must remain:

`078f65c5d194435452ca14569ea00e57f52a20f3`

Production must remain:

`dpl_HmqKyiLqCqMSTrhxKktsy9mJtDKy`

---

# Final report requirements

Include:

- exact starting Git identity
- exact final Git identity
- Seattle Phase A result
- whether Georgetown was parked
- all Phase B candidates screened
- serious candidates deeply evaluated
- actual qualifying records
- permission evidence
- 2026 visitor-calendar evidence
- category evidence
- address/location evidence
- identity/crosswalk quality
- coordinate status
- native-ID durability
- access/cost posture
- request accounting
- operator contacts = 0
- operator-origin requests if any = 0 unless explicitly allowed by this handoff (they are not)
- geocoder calls = 0
- paid API calls = 0
- collector calls = 0
- executable changed paths = 0
- whether source research is finished
- contract design result
- implementation handoff path if ready
- exact recommended next task
- main/production preservation

---

# First action

Verify the immutable starting Git identity at:

`9c19deec26b433e7fb6b14c48e76cc0ea4cfbc93`

Then perform the tiny Seattle Eproval/public-export triage.

If it fails the stop rule, park Georgetown immediately and continue into the implementation-first source qualification pivot in the same run.

The objective of this sweep is to either:

**leave source research with a qualified source + contract design**, or

**produce a genuine release-scope decision instead of another recursive discovery task.**
