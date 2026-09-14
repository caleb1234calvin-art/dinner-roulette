# Pick For Me — Release Continuity Master

Updated: September 14, 2026

Purpose: durable release, validation, CI, Vercel and build-safety history.

## Released milestone
Frozen release candidate:
`1c4b2b73d1f23bb184f34e5b7360144378757bc4`

Candidate commit:
`Correct light Dinner artwork and validate accepted preview polish`

Merged to `main` through PR #44 after explicit user authorization.

Main merge commit:
`6b811ae427339902f456c2706330689c2d6ad54b`

Merge message:
`Merge validated Pick For Me release candidate`

The user subsequently confirmed the app starts after repository cleanup.

## Validation evidence
- Exact-candidate CI Run 365: PASS
- 371 unique tests passing: 300 repository + 71 application
- 0 failures
- 4 understood external-documentation skips
- 35 deterministic browser groups PASS: 16 casino + 19 location/polish
- Four international-city checks successful
- Six casino-region acceptance checks successful, with provider timeout/fallback distinctions preserved
- Final diff audit: unexplained diffs NONE
- Known code/automated-validation blockers at release gate: NONE

## Exact-SHA hosted preview acceptance
Deployment:
`dpl_CAJaXFVaF9nFbuzsujM4ck27qig1`

Preview URL:
`https://dinner-roulette-69ewe97zr-minions-9e2c.vercel.app`

State: READY
Exact candidate SHA: `1c4b2b73d1f23bb184f34e5b7360144378757bc4`
HTTP fetch returned 200 after deployment. This closed the exact-SHA hosted-preview gate before the merge decision.

## Vercel identity
- Team: Minions / `minions-9e2c`
- Team ID: `team_iBSXkvS9Z7tu8o8AtW0vlDt7`
- Project: `dinner-roulette`
- Project ID: `prj_Duz6oRktFrLVIMK1DfAxZyxQCCwm`
- Framework: TanStack Start
- Node: 24.x

## Critical build safety
Do not assume repository `npm run build` is safe; historical configuration chained database migration behavior.

Known migration-free production-mode path:
`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

The exact-SHA Vercel preview built successfully without a migration invocation in its build log.

## Post-release repository cleanup
Continuity was consolidated into five durable master branches. Temporary preview branches and superseded integration/feature/audit branches were pruned after provenance and important continuity were preserved. `integration/rc-validation-2026-09-14` remains intentionally as the frozen release milestone.

Historical source branches can be recovered by commit SHA if ever needed; do not recreate them merely for context.

## Historical release/continuity provenance
- `integration/active-work-pass-1` @ `91c2d121b3be47705b86f0fe37226bfd465479d4`
- `integration/validated-handoff-2026-09-13` @ `f9f708665ca6af25fa872e33345b52472f2bf837`
- `integration/required-test-gate-recovery` @ `a76ffbe7975f667dd808886462571ec0ba79934b`
- `integration/rc-validation-2026-09-14` @ `1c4b2b73d1f23bb184f34e5b7360144378757bc4`
- Earlier accepted preview `preview/combined-candidate-d4baaf1` @ `f52416830f6f53e313393671f103279d0174034c`

## Future release rule
Use temporary feature/RC/preview branches when isolation is valuable, but fold durable state back into the appropriate continuity master and prune temporary refs after release. Never infer production success merely from a merge; verify actual hosted behavior when that distinction matters.
