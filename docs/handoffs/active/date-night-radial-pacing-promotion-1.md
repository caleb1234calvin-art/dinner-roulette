# Pick For Us — Date Night Radial Pacing Promotion #1

Repository:
`caleb1234calvin-art/dinner-roulette`

Instruction branch:
`handoff/date-night-radial-pacing-promotion-1`

PROMOTION-REVIEW AUTHORITY:
`handoff/date-night-radial-pacing-promotion-review-1`
commit
`cf75f2f565dbe785f3e211a8c616e397cc4d6104`

Promotion-review result:
`DATE NIGHT RADIAL PACING PROMOTION REVIEW PASSED — EXACT CANDIDATE AUTHORIZED FOR PROMOTION`

ONLY authorized candidate:
`078f65c5d194435452ca14569ea00e57f52a20f3`

Required resulting main tree:
`77e85c1306e8136f7624f5a5be7c11e740ee30d5`

Expected candidate sole parent:
`70e049b47194696910c70cc1f5dd2ae9ba229aec`

Expected main-before:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Expected production-before:
`dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL`

Accepted exact Preview:
`dpl_Crd3GYuEH8D3A2QZJyZDvNqEMLd5`
`https://dinner-roulette-7f8zbvem2-minions-9e2c.vercel.app`

Product-owner state:
The exact Preview was manually reviewed and the progressive Date Night loading/radius/venue-count behavior was accepted as-is.

---

## Mission

Promote the exact immutable candidate to `main` by guarded fast-forward, wait for the Git-sourced Vercel production deployment, verify all production aliases, and perform a bounded non-destructive production smoke check.

This task MAY move `main` and production as the intended release action.

Do not modify product code.
Do not add a merge/squash/cherry-pick commit.
Do not include handoff/review branch commits.
Do not merge the Seasonal Fact Contract lane.
Do not mutate Vercel settings.
Do not run migrations.
Do not invoke `npm run build` if it chains migrations.
Do not generate Date Night public-provider discovery traffic during smoke.

---

## Phase 1 — immediate pre-write guards

Immediately before ANY ref write, freshly resolve:

- main
- candidate branch
- candidate commit/tree/parent
- merge base
- ahead/behind
- production deployment
- all five production aliases
- Vercel project/build settings

Require EXACT:

Main:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Candidate:
`078f65c5d194435452ca14569ea00e57f52a20f3`

Tree:
`77e85c1306e8136f7624f5a5be7c11e740ee30d5`

Sole parent:
`70e049b47194696910c70cc1f5dd2ae9ba229aec`

Merge base:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Ahead/behind:
`64 / 0`

Production-before:
READY `dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL`
from exact frozen main.

Expected aliases:
- `pickforus.app`
- `www.pickforus.app`
- `dinner-roulette-chi.vercel.app`
- `dinner-roulette-minions-9e2c.vercel.app`
- `dinner-roulette-git-main-minions-9e2c.vercel.app`

If ANY precondition differs:
STOP.
Do not promote from stale assumptions.

---

## Phase 2 — exact resulting tree

Before writing main, prove the proposed result is the exact full candidate tree:

`77e85c1306e8136f7624f5a5be7c11e740ee30d5`

Product-only equivalence is insufficient.

No review/handoff commit may be included.

---

## Phase 3 — guarded fast-forward

Fast-forward `main` directly:

FROM:
`4d937e58d2a65567b54ac5271915bc85b498898b`

TO:
`078f65c5d194435452ca14569ea00e57f52a20f3`

Use compare-and-swap / expected-old-SHA semantics when available.

Never use unguarded force.

If an ordinary non-force ref update is used:
- re-read main immediately before the write
- abort if moved
- if rejected, STOP
- do not repair by forcing

After the write, immediately require:

Main SHA:
`078f65c5d194435452ca14569ea00e57f52a20f3`

Main tree:
`77e85c1306e8136f7624f5a5be7c11e740ee30d5`

If either differs:
STOP and report release incident state.

---

## Phase 4 — production deployment

Treat the main move as production-impacting because Vercel is Git-connected.

Do not manually promote the old Preview.

Wait for a NEW production deployment whose Git source SHA is exactly:

`078f65c5d194435452ca14569ea00e57f52a20f3`

Require:
- target = production
- state = READY
- source = exact candidate
- project = `prj_Duz6oRktFrLVIMK1DfAxZyxQCCwm`
- no alias error
- effective build remains migration-free
- no unexpected settings drift

If build behavior indicates migrations or changed settings, STOP rather than mutating configuration.

---

## Phase 5 — alias verification

After exact production becomes READY, verify all five production aliases attach to it:

- `pickforus.app`
- `www.pickforus.app`
- `dinner-roulette-chi.vercel.app`
- `dinner-roulette-minions-9e2c.vercel.app`
- `dinner-roulette-git-main-minions-9e2c.vercel.app`

Preserve existing `www` redirect behavior.

Do not manually repoint aliases unless a separate review authorizes intervention.

---

## Phase 6 — bounded production smoke

Default smoke must generate ZERO Date Night public-provider discovery traffic.

Verify only:
- `pickforus.app` responds
- app shell loads
- Date Night mode renders
- no obvious production error page
- progressive/radial loading UI is present
- slider role/name accessibility remains intact if browser capability exists
- no immediate fatal runtime errors
- no obvious horizontal overflow on a basic mobile viewport if browser capability exists

Do NOT trigger:
- Date Night live discovery
- external provider calls
- mutations
- auth/database writes
- migrations

If a live discovery production smoke is considered necessary, STOP and obtain separate explicit capped authorization.

---

## Phase 7 — final release identity

Freshly verify after smoke:

- main SHA = exact candidate
- main tree = exact approved tree
- production READY deployment source = exact candidate
- all five aliases point to exact production deployment
- Vercel project/settings unchanged
- no newer unexpected production deployment superseded it

---

## Phase 8 — release evidence

Report:
- main-before
- main-after
- candidate SHA/tree/parent
- mechanism = guarded fast-forward
- production-before deployment
- production-after deployment
- production source SHA
- aliases before/after
- build status
- smoke status
- lint caveat
- synthetic timing caveat
- rollback target

Rollback baseline:
main `4d937e58d2a65567b54ac5271915bc85b498898b`
production `dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL`

Do not automatically roll back on cosmetic observations.
For material production defects, STOP and report exact state before destructive recovery unless rollback is separately authorized.

---

## Success state

If all gates pass:

`DATE NIGHT RADIAL PACING PROMOTED TO PRODUCTION — RELEASE VERIFIED`

Report exact:
- main SHA
- main tree
- production deployment ID/URL
- aliases
- smoke result
- known caveat: synthetic 223 -> 199.75 s timing is model arithmetic only, not guaranteed live speed
- known caveat: complete 50-mile venue exhaustiveness is not guaranteed; UI reflects progressive/geographic coverage, not every possible venue

---

## Failure state

If any gate fails:

`DATE NIGHT RADIAL PACING PROMOTION INCOMPLETE — RELEASE REVIEW REQUIRED`

Report:
- whether main moved
- whether production moved
- deployment status
- alias state
- rollback availability
- exact blocker

Do not improvise another merge or deployment mechanism.

---

## First action

Freshly re-read main/candidate/production/aliases/settings and only then perform the guarded fast-forward if every precondition still matches.
