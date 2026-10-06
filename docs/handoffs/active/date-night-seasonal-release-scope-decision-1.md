# Pick for Us — Seasonal Release-Scope Decision #1

Repository: `caleb1234calvin-art/dinner-roulette`

## Purpose

This handoff converts the completed seasonal-data research sweep into a concrete release decision.

The bounded research phase is finished for this release. Do not start another equivalent source-discovery sweep by default.

The owner has chosen the recommended path:

**Defer live seasonal-attraction ingestion for this release.**

The goal of the next task is to audit the existing seasonal UX for truthful release behavior, preserve ordinary Date Night behavior, and prepare the smallest release-safe implementation/verification path needed to ship.

---

## Immutable starting point

Start from the exact published research commit:

- SHA: `580b493e52fffc1e592b8107b142e01c945cee7f`
- Tree: `f398ab4423b30e67d696eda4603a03ba9b4db7dd`
- Sole parent: `9c19deec26b433e7fb6b14c48e76cc0ea4cfbc93`
- Branch: `research/date-night-seasonal-release-path-sweep-1`

Current protected production state:

- main: `078f65c5d194435452ca14569ea00e57f52a20f3`
- production deployment: `dpl_HmqKyiLqCqMSTrhxKktsy9mJtDKy`

Do not modify main or production during the decision/audit phase.

---

## Authoritative research outcome

Primary verdict:

**SEASONAL RELEASE PATH BLOCKED — NO IMPLEMENTATION-READY ZERO-CONTACT SOURCE FOUND**

Decision:

**C — RELEASE-SCOPE DECISION REQUIRED**

Release-scope decision now selected by owner:

**DEFER LIVE SEASONAL-ATTRACTION INGESTION FOR THIS RELEASE.**

Research facts to preserve:

- Georgetown Morgue is parked.
- Nine Phase B services were screened; four received serious evaluation.
- No qualifying source or source pair was established.
- No Phase C contract design was entered.
- No implementation handoff for a live source pilot was created.
- Zero operator contacts.
- Zero operator-origin requests.
- Zero geocoder calls.
- Zero paid API calls.
- Zero collector calls.
- Zero executable changes in the research sweep.

Do not reinterpret rejected source evidence as implementation-ready.

---

## Release objective

Ship the seasonal release without live seasonal-attraction ingestion.

Preserve:

- existing seasonal presentation that is truthful without live attraction data
- ordinary Date Night behavior
- existing radial loading/pacing behavior already live and independently verified
- all current production protections

Do not claim live haunted-house, corn-maze, or pumpkin-patch coverage unless the current runtime already has separately verified static behavior that truthfully supports it.

The next task must determine whether any current UI implies unsupported live seasonal coverage and, if so, make the smallest truthful adjustment.

---

## Scope

### Phase A — Audit current seasonal UX

Read the exact current code at the immutable starting commit and identify:

1. where seasonal attraction options appear in Date Night
2. whether any UI copy implies live/current attraction availability
3. whether any buttons/filters/categories can lead users into a dead or misleading state
4. whether existing seasonal presentation is static/decorative only
5. whether ordinary Date Night flows are unaffected when no live seasonal source is available
6. whether any empty-state or disabled-state copy is needed
7. whether any feature flag/source registry state already prevents unsupported runtime ingestion

Produce a concise factual audit before modifying executable code.

### Phase B — Choose the minimum release-safe implementation

Use one of these outcomes:

#### A. NO CODE CHANGE REQUIRED

Use this if the existing app already behaves truthfully and safely with live seasonal ingestion absent.

Then produce a release-verification handoff only.

#### B. MINIMAL UI/STATE REMEDIATION REQUIRED

Use this only if the audit finds a concrete misleading/dead-end UX.

Examples:

- wording implies live seasonal availability when there is none
- a control exposes an unavailable data path without explanation
- an empty state is misleading
- a seasonal category needs to be hidden/disabled for this release

Make only the smallest necessary change.

Do not redesign Date Night.

Do not remove unrelated seasonal visuals/presentation.

Do not alter radial loading unless directly required by a verified defect.

### Phase C — Release verification handoff

After A or B, create a release-verification handoff that specifies:

- exact candidate SHA/tree/parent
- changed paths
- why each change is required
- focused tests
- broader regression tests
- browser/manual smoke requirements
- production-preservation checks
- rollback reference
- exact promotion decision criteria

---

## Hard prohibitions

Do not:

- restart live seasonal source discovery
- contact operators
- use paid APIs
- add a geocoder
- enable collectors
- activate sources
- generate runtime seasonal data
- weaken permission or factual-integrity requirements
- invent manual static attraction records
- modify database schema
- run migrations
- modify dependencies unless absolutely required by a concrete release bug
- change Vercel configuration
- modify main
- deploy/promote production
- move production aliases
- merge during the audit/remediation task

---

## Branching

Create a new branch from the immutable starting SHA.

Preferred branch:

`fix/date-night-seasonal-release-scope-remediation-1`

If the audit proves no code change is required, use:

`review/date-night-seasonal-release-scope-1`

Do not branch from mutable main.

---

## Validation

If no executable code changes:

- verify immutable starting SHA/tree/parent
- document current behavior
- focused read-only inspection
- clean worktree
- exact final SHA/tree/parent if documentation is committed
- no implementation build/test unless needed to prove behavior

If executable code changes:

- typecheck
- focused seasonal/date-night tests
- changed-file lint
- relevant security tests
- migration-free build only
- targeted browser/manual smoke if available
- full regression suite if the change touches shared Date Night routing/state

Do not run any migration-bearing build command.

---

## Production preservation

Main must remain:

`078f65c5d194435452ca14569ea00e57f52a20f3`

Production must remain:

`dpl_HmqKyiLqCqMSTrhxKktsy9mJtDKy`

No production promotion is authorized in this task.

---

## Publication boundary

A normal non-production Vercel Preview from publishing the review/remediation branch is allowed only after separate owner authorization if the task reaches a push boundary.

Preserve exact reviewed commit identity.

If cloud Git transport cannot preserve/push the exact object, retain a Git bundle and use the already-working authenticated Termux publication path.

Do not reconstruct a reviewed commit merely to publish it.

---

## Final report requirements

Report:

- exact immutable starting identity
- audit findings
- whether current UI is truthful without live ingestion
- whether code changes were required
- exact changed paths
- test/validation results
- exact final SHA/tree/parent
- whether a Preview push is awaiting owner authorization
- release-verification handoff path
- recommended exact next task
- confirmation that live seasonal ingestion remains deferred
- confirmation that main/production remain unchanged

---

## First action

Verify the immutable starting Git identity:

`580b493e52fffc1e592b8107b142e01c945cee7f`

Then inspect the current seasonal Date Night UX before changing anything.

The objective is to get the seasonal release onto a short, truthful, verifiable ship path without reopening the data-source problem.
