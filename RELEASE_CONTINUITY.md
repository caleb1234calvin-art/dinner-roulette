# Pick For Me — Release Continuity Master

Updated: September 15, 2026

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

## Pre-Google Play polish pass — active
A dedicated non-production polish branch is now authoritative for final user-facing refinements before Google Play packaging/submission:

`polish/pre-google-play-pass-1`

Starting/accepted commit:
`719ad257638de45529a0cb6e7eb5d26eb162d060`

This branch was created from the earlier temporary branch `fix/startup-ident-black-letterbox`. The old branch should be deleted after confirming the new branch exists; all further polish work belongs on `polish/pre-google-play-pass-1`.

### Accepted startup-ident polish
The Mordax/Caustic Relay startup ident remains fully contained rather than cropped or stretched. The unused portrait-screen letterbox region now renders a subdued broadcast/test-pattern color-bar treatment behind the video instead of plain white/black space. This turns aspect-ratio dead space into intentional brand presentation while leaving the source video untouched.

Accepted commit:
`719ad257638de45529a0cb6e7eb5d26eb162d060` — `Add broadcast color bars to startup ident letterbox`

Vercel automatically produced a non-production preview from the branch and reported it READY. The user inspected the preview on a phone and explicitly accepted the treatment.

Workflow for this pass:
`main` remains stable → polish changes accumulate on `polish/pre-google-play-pass-1` → individual changes are previewed/accepted → final regression/release audit → merge only after explicit user authorization.

Purpose: polish the current application for Google Play readiness without turning each small UX/visual fix into a separate branch or destabilizing production.

## Google Play distribution state
On September 15, 2026, the user created and paid for a Google Play developer account. Address verification remains an administrative gate before uploads can proceed. Google Play preparation is therefore an active distribution track rather than a hypothetical future task.

Near-term sequence after polish: resolve developer-account verification → audit Android/Play packaging requirements → prepare signed Play-ready Android App Bundle and store materials → testing/review gates → production submission when authorized.

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
