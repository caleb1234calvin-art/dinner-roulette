# Pick For Us — Date Night Radial Loading Promotion #1

Repository:
`caleb1234calvin-art/dinner-roulette`

Instruction branch:
`handoff/date-night-radial-loading-promotion-1`

Promotion review authority:
`fdc3feea9f919c91368cab2210f6bd5865219668`

Promotion review result:
`DATE NIGHT RADIAL LOADING PROMOTION REVIEW PASSED — EXACT CANDIDATE AUTHORIZED FOR PROMOTION`

ONLY authorized candidate:
`908510ac25fe5c24335126a0f34ff42fe4d80632`

Required candidate/resulting main tree:
`3211b4df4eccb638a8c492da047eac3b24abb600`

Actual candidate sole parent:
`f94484e920ed18b93b54ac5271915bc85b498898b`

Expected main-before:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Expected production-before:
`dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL`

Current authorized state:
`DATE NIGHT RADIAL LOADING PROMOTION REVIEW PASSED — EXACT CANDIDATE AUTHORIZED FOR PROMOTION`

---

## Mission

Promote the exact immutable candidate to main by guarded fast-forward, then verify the resulting Vercel production deployment and aliases.

This task MAY update main and production as the intended release action.

Do not alter product code during promotion.

Do not create a merge commit, squash commit, or cherry-pick unless this handoff explicitly stops and a new review authorizes a different mechanism.

Do not include instruction/review branch commits.

Do not run migrations.

Do not run `npm run build` if it chains migrations.

Do not generate Date Night public-provider discovery traffic during promotion unless a later explicit smoke step authorizes a capped request. Default production smoke is static/HTTP only.

---

## Phase 1 — immediate pre-write compare-and-swap checks

Immediately before any main ref write, freshly resolve:

- main
- candidate branch
- candidate commit object
- candidate tree
- candidate parent
- merge base
- candidate ahead/behind main
- current production deployment
- all five production aliases
- Vercel project/settings/build configuration

Require EXACT:

Main:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Candidate:
`908510ac25fe5c24335126a0f34ff42fe4d80632`

Candidate tree:
`3211b4df4eccb638a8c492da047eac3b24abb600`

Candidate sole parent:
`f94484e920ed18b93b54ac5271915bc85b498898b`

Merge base:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Ahead/behind:
`61 / 0`

Production-before:
READY `dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL`
at exact frozen main.

Aliases-before must still include:
- `pickforus.app`
- `www.pickforus.app`
- `dinner-roulette-chi.vercel.app`
- `dinner-roulette-minions-9e2c.vercel.app`
- `dinner-roulette-git-main-minions-9e2c.vercel.app`

If ANY of these preconditions changed:
STOP.
Do not merge or deploy from stale assumptions.

---

## Phase 2 — prove exact promotion tree

Before writing main, independently assert that proposed resulting main tree is EXACTLY:

`3211b4df4eccb638a8c492da047eac3b24abb600`

Do not accept product-only equivalence.

The entire tracked tree must match the approved candidate tree.

Do not add:
- this promotion handoff
- promotion review report
- new continuity edits
- release evidence
- temporary workflow files
- any extra commit

The main ref write itself should point directly at the approved candidate commit.

---

## Phase 3 — guarded fast-forward main

Perform a guarded fast-forward of `main` from:

`4d937e58d2a65567b54ac5271915bc85b498898b`

to:

`908510ac25fe5c24335126a0f34ff42fe4d80632`

Use compare-and-swap / expected-old-SHA semantics if available.

If using Git force-with-lease solely as a lease guard:
- first prove the update is a fast-forward
- lease must name the full expected old main SHA
- never use an unguarded force update

If using an ordinary non-force ref update:
- re-read main immediately before update
- abort if it moved
- if rejected, STOP
- do not repair rejection by forcing

After the write, immediately read back main.

Require:

Main SHA:
`908510ac25fe5c24335126a0f34ff42fe4d80632`

Main tree:
`3211b4df4eccb638a8c492da047eac3b24abb600`

If either differs:
STOP and treat as release incident.

---

## Phase 4 — production deployment observation

Treat the main ref move as production-impacting because Vercel is connected to main.

Do not manually redeploy an arbitrary Preview.

Wait for the production deployment sourced from exact main/candidate:

`908510ac25fe5c24335126a0f34ff42fe4d80632`

Require:

- target = production
- state = READY
- Git source SHA = exact candidate
- no alias error
- expected project = `prj_Duz6oRktFrLVIMK1DfAxZyxQCCwm`
- expected production region/config remains unchanged
- no migration step introduced

Inspect build logs if needed.

Important:
The repo's historical `npm run build` may chain database migration.
Do NOT manually invoke it.

The connected production deployment must use the existing safe effective build path. If build settings appear changed or migration behavior appears, STOP rather than mutating Vercel settings.

---

## Phase 5 — alias verification

After the exact production deployment is READY, verify all five aliases now point to the new deployment:

- `pickforus.app`
- `www.pickforus.app`
- `dinner-roulette-chi.vercel.app`
- `dinner-roulette-minions-9e2c.vercel.app`
- `dinner-roulette-git-main-minions-9e2c.vercel.app`

Preserve the existing `www` redirect behavior.

Record old deployment ID and new deployment ID.

Do not manually repoint aliases unless the normal production deployment fails to attach them and a separate review authorizes intervention.

---

## Phase 6 — bounded production smoke

Default smoke must NOT call Date Night discovery providers.

Perform only safe, non-destructive checks sufficient to establish:

- `pickforus.app` responds
- main app shell loads
- Date Night route/home mode renders
- no obvious production error page
- no horizontal overflow on a basic mobile viewport if browser capability is available
- Radial Loading UI copy/control exists
- Slider controls remain accessible by role/name if browser capability is available
- production runtime logs show no immediate fatal startup errors

Do not trigger:
- Date Night live discovery RPCs
- external provider calls
- mutations
- auth/database writes
- migrations

If a Date Night live smoke is considered necessary, STOP and obtain explicit capped authorization first.

---

## Phase 7 — release identity verification

Freshly verify after smoke:

- main SHA = exact candidate
- main tree = exact approved tree
- production READY deployment source = exact candidate
- `pickforus.app` points to exact new deployment
- `www.pickforus.app` points/redirects correctly
- remaining aliases point to exact new deployment
- Vercel project/settings remain unchanged
- no unexpected new production deployment superseded it

---

## Phase 8 — release evidence

Record release evidence OUTSIDE the promoted candidate tree unless a later continuity-only commit is separately authorized.

At minimum report:

- main-before SHA
- main-after SHA
- approved candidate SHA/tree/parent
- promotion mechanism = guarded fast-forward
- production-before deployment
- production-after deployment
- production source SHA
- alias-before/after
- build status
- smoke status
- any caveats
- rollback target

Rollback baseline:
`4d937e58d2a65567b54ac5271915bc85b498898b`
with production:
`dpl_7RkbrP1c5g1bd7wpnWgWpc9D25DL`

Do not automatically roll back on a minor cosmetic observation.
If a material production defect appears, STOP and report before taking destructive recovery action unless rollback was explicitly preauthorized.

---

## Success state

If main fast-forward, production READY, aliases, and smoke all verify:

`DATE NIGHT RADIAL LOADING PROMOTED TO PRODUCTION — RELEASE VERIFIED`

Report exact:
- main SHA
- main tree
- production deployment ID
- production URL
- aliases
- smoke result
- known live caveat:
  complete 50-mile live coverage remains not guaranteed/proven; UI truthfully represents progressive/partial coverage

---

## Failure state

If any write/deploy/alias/smoke gate fails:

`DATE NIGHT RADIAL LOADING PROMOTION INCOMPLETE — RELEASE REVIEW REQUIRED`

Do not improvise a new merge strategy or mutate settings.

Preserve exact state:
- whether main moved
- whether production moved
- deployment status
- aliases
- rollback availability
- exact blocker

---

## First action

Freshly resolve main, candidate, merge base, candidate tree/parent, production-before deployment, aliases, and Vercel project settings.

Only if every baseline matches the promotion review may main be fast-forwarded to the exact immutable candidate.
