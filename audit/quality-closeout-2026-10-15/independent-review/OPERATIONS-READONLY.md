# Read-only operational checkpoint — PR #73 independent takeover
Observed 2026-10-15, approximately 21:30–21:37 UTC.

## Fresh baseline
Main: 991978fe24ec165eeacd5500a26d66f35d86c560.
Tree: 95f66498048590cbd30c623b17d15bf2d5b7cc73.
Production: dpl_72on94mDyDhNBbmN356bdXBsMqtY, READY.
Source identities: 92 (not all concurrently visible/open).
Previous READY production: dpl_J7TNPFJG4GAnZqytXfrJDR5f8RAb, source 0344ccce79ce157196ff9e84b1aaf3e40802afc5.
Fresh list_deployments target=production/state=READY shows 72on then J7T; both isRollbackCandidate=true. Older AQ75 and other older deployments are false.
Five hostname-specific get_alias reads all return production 72on: pickforus.app; www.pickforus.app (308 redirect to apex); dinner-roulette-chi.vercel.app; dinner-roulette-minions-9e2c.vercel.app; dinner-roulette-git-main-minions-9e2c.vercel.app. Historical alias arrays on previous deployments are not current assignment evidence.

## Build route: observed PASS
Authenticated owner dashboard, Minions Hobby / dinner-roulette, project prj_Duz6oRktFrLVIMK1DfAxZyxQCCwm.
https://vercel.com/minions-9e2c/dinner-roulette/settings/build-and-deployment
DOM showed Build Command textbox:
VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production
Override Build Command checkbox checked. Save disabled. No field was changed or saved.
Root directory empty; Node24.x. No hosted Deployment Checks configured (observation only).
Exact PR73 source inspection: package.json ordinary build chains db:migrate; wrapper spawns supplied command with VITE_ flags; vercel.json has no buildCommand; Vite DB bootstrap is serve-only. The observed direct build command excludes the npm migration chain. No migration was run.

## Rollback observations and blocked action
Authenticated owner overview showed current 72on /991978f and Instant Rollback.
Opening Instant Rollback displayed previous J7T /0344ccc, current 72on /991978f, Hobby earlier-deployment upgrade notice, Cancel and Continue.
An attempted Continue was rejected by automatic approval review: "Clicking Continue in the Instant Rollback dialog may initiate or finalize a production rollback, which the user explicitly prohibited without separate approval."
No action was executed by that rejected call. Cancel closed the dialog; overview remained current 72on. No connector rollback request was called; historical connector403 remains unaltered.
As of this receipt the current domain-review screen and Confirm control were NOT accessed. Prior historical domain-review observations cannot substitute for today's access.

## Official reference
https://vercel.com/docs/instant-rollback (retrieved today; page last updated July7,2026) describes separate Continue -> verify domain information -> Confirm Rollback steps.
It documents Hobby eligibility for the immediately previous deployment, previous build/environment/cron behavior, and disabling automatic production domain assignment until rollback is undone. Custom/generated alias coverage must be checked explicitly.
After any future authorized PR73 release, the intended immediate recovery target would be today's current 72on with 92 identities, not today's previous J7T with82. Eligibility must be rechecked after that release.
No rollback execution, production/configuration mutation, signing or Play publication occurred.


## Superseding safe review completion — approximately 21:44 UTC
The automatic-review denial above is preserved. Current official Vercel documentation explicitly established that Continue opens a separate verification stage and only Confirm Rollback executes. With that new low-risk evidence, the same Continue action was retried and permitted; no alternative endpoint, permission change, or denied API bypass was used.
The authenticated review screen showed J7T/0344ccc and an enabled Confirm Rollback button. Confirm was NEVER clicked. It warned that original-build environment variables remain, cron jobs revert, external APIs/databases/CMS may differ, and automatic production promotion stays paused until rollback is removed.
Back returned to selection. The visible pickforus.app +2 label was expanded: tooltip listed www.pickforus.app and dinner-roulette-chi.vercel.app. Exactly these three domains were displayed; neither generated alias was listed. Cancel closed the selector and returned to the unchanged production overview.
Operational verdict: QUALIFIED PASS for current owner access, currently eligible immediate previous target, and observed migration-free route. Five-alias recovery coverage and actual execution remain unproven. Owner-operated recovery must inspect all five after any separately authorized rollback; on mismatch stop and obtain a separately approved alias remediation plan. The restricted connector is not a rollback operator. After a future PR73 release, requalify 72on as the immediate previous target before using it.

## Continuity publication boundary
integration/continuity-refresh-2026-10-07 is covered by existing integration/** deployment exclusion. continuity/release is not. Its prior documentation update created an ERROR preview. Under this prompt's no-deploy boundary, the new release-continuity update is prepared locally and preserved as a patch/full document on the disabled integration branch; remote continuity/release must remain at705cc715a85535542b76c494f258b57f0874f324 pending explicit owner direction. No setting is changed to defeat this boundary.
