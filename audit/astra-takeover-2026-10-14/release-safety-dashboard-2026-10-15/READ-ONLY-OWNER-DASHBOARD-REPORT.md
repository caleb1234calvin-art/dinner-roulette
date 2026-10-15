# Pick For Us: read-only Vercel owner dashboard verification

Date: October 15, 2026. Browser observation window: approximately 06:09–06:13 UTC.

## Result

- **Gate A — PASS, scoped to the currently saved project Build Command override.** The complete dashboard field exactly matches the reviewed migration-free CI command, and Override is ON.
- **Gate B — PASS, scoped to owner-interface availability and the currently eligible immediately previous deployment.** The authenticated account could open Instant Rollback selection and review without a permission error. It identifies current J7T and previous AQ75 and exposes a separate Confirm Rollback button.
- **Complete five-alias rollback coverage — UNVERIFIED.** The dashboard's rollback selection explicitly lists three domains only. Do not describe this as verified recovery for every currently mapped alias.
- **Release — HOLD.** These are observations, not release authorization or a recovery execution test. No merge, deploy, promotion, migration, rollback, save, credential/permission change, or alias mutation was performed.

## Authority and baseline

The user authorized read-only inspection in dot's cloud browser using its existing authorized session. No login or handoff was required. The full existing preflight was read before inspection:

https://github.com/caleb1234calvin-art/dinner-roulette/blob/integration/continuity-refresh-2026-10-07/audit/astra-takeover-2026-10-14/R3-RELEASE-SAFETY-PREFLIGHT-2026-10-15.md

That report identifies Vercel team `team_iBSXkvS9Z7tu8o8AtW0vlDt7`, confirmed OWNER username `caleb1234calvin-6132`, project `prj_Duz6oRktFrLVIMK1DfAxZyxQCCwm`, and the connector's historical HTTP 403 `deploymentRollback` restriction. The denied rollbackCandidate API was not retried. No alternate token, privileged endpoint, CLI, or permission bypass was used.

## Observed identity and scope

- Browser: dot cloud browser, already authenticated.
- Account visibly displayed: `caleb1234calvin-6132`, matching the preflight's confirmed OWNER.
- Team visibly displayed: **Minions**, **Hobby**, URL slug `minions-9e2c`.
- Project visibly displayed: `dinner-roulette`.
- General settings independently displayed exact Project ID `prj_Duz6oRktFrLVIMK1DfAxZyxQCCwm`.
- Project repository link: https://github.com/caleb1234calvin-art/dinner-roulette
- The current dashboard account name was independently observed. The OWNER role and exact team ID are corroborated by the preflight; this browser inspection did not separately reopen the team membership or team-ID settings.

## Gate A: complete saved Build Command

Verified project settings URL:
https://vercel.com/minions-9e2c/dinner-roulette/settings/build-and-deployment

The rendered textbox contained the complete value:

```sh
VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production
```

The rendered checkbox **Override Build Command** was **checked**. The Framework Settings Save button was disabled. No field or toggle was edited, and Save was never clicked. The full value came from the rendered textbox in the browser DOM snapshot, not an inference from a visually clipped screenshot.

Supporting scope observations: Framework Preset **TanStack Start**; Node.js Version **24.x**; Root Directory blank (placeholder `./`). Output Directory, Install Command, and Development Command overrides were unchecked. This is the project Build and Deployment configuration; it is not a historical deployment-only setting.

First complete field observation was approximately 06:10:15 UTC. Evidence capture: 2026-10-15T06:10:44.936802Z (DOM) and 06:10:44.984800Z (screenshot). Exact project-ID evidence captured at 06:10:58.532274Z.

Conclusion: the saved project override is explicitly the reviewed direct Vite command and does not chain `npm run build` or `db:migrate`. This verifies the current configuration only. It does not execute or guarantee a later build, freeze future settings, or supersede any future repository-level command override. The existing preflight warns that the ordinary package `build` script chains a database migration; that risk remains if this safe configuration is changed.

## Gate B: supported owner rollback interface

Verified overview URL:
https://vercel.com/minions-9e2c/dinner-roulette

The Production Deployment tile displayed current deployment J7T, Ready, source main commit `0344ccce79ce157196ff9e84b1aaf3e40802afc5`. Its **Rollback** button opened a dialog titled **Instant Rollback**.

Selection dialog, evidence captured at 2026-10-15T06:11:15.811604Z:

- **Current:** `J7TNPFJG4GAnZqytXfrJDR5f8RAb`, deployment hostname `dinner-roulette-oo4i2ckun-minions-9e2c.vercel.app`, source `0344ccc`, Production, main, by `caleb1234calvin-6132`. UI age: deployed 12h ago / promoted 12h ago.
- **Previous:** `AQ75KpDS6AQ3g7GqHqYshiFhYfVf`, deployment hostname `dinner-roulette-5umm5wk7i-minions-9e2c.vercel.app`, source `6c619ad`, “Add three independently cleared Missouri seasonal events,” Production, main, by `caleb1234calvin-6132`. UI age: deployed 1d ago / promoted 1d ago.
- An upgrade notice says earlier deployments require Pro. The preflight identifies AQ75's full source as `6c619adda4d9ef3b2683befb2ca874b257505eb2`; the dialog itself displayed only the short commit.
- Selection offered Cancel and Continue, with an optional reason field. No reason was entered.

The official Instant Rollback documentation was checked before entering the review screen. It documents selection, Continue, a review stage, and a separate final Confirm Rollback step. Continue was used solely to inspect that review, under the read-only authorization.

Review dialog, evidence captured at 2026-10-15T06:11:34.038895Z:

- Explicit target remained AQ75, hostname and source `6c619ad` as above.
- A separate enabled **Confirm Rollback** button was visible. It was **never clicked**.
- Review states original-build environment variables remain; cron jobs revert to the previous deployment's state; external APIs, databases and CMS platforms may behave differently.
- Review warns that production deployments will not be automatically promoted until the rollback is removed.

### Routing qualification

The selection dialog's `pickforus.app +2` summary was expanded through its tooltip. It names exactly:

1. `pickforus.app`
2. `www.pickforus.app`
3. `dinner-roulette-chi.vercel.app`

Domain evidence captured at 2026-10-15T06:12:26.236870Z.

The dialog does **not** list `dinner-roulette-minions-9e2c.vercel.app` or `dinner-roulette-git-main-minions-9e2c.vercel.app`. Absence from this dialog does not prove what a real rollback would do to them, but prevents claiming all five aliases are covered. The official docs additionally distinguish custom aliases from project-domain settings and warn that inclusion may depend on the previous deployment.

The UI was exited using **Back**, then **Cancel**. A post-cancel overview snapshot and screenshot at 2026-10-15T06:12:50.835914Z / 06:12:50.919911Z confirm the production tile still shows J7T, Ready, main `0344ccce79ce157196ff9e84b1aaf3e40802afc5`. A final read-only deployment detail view likewise showed J7T Production Current / Ready / Latest. Its visible deployment time was “Oct 14, 2026, 11:38:28 AM PDT” (2026-10-14T18:38:28Z), with 15s duration.

## Limits and future-release implications

- Owner UI inspection passed. The connector's historical denied permission remains a separate restriction.
- A visible enabled confirmation control is not proof that execution would succeed; execution was intentionally not tested.
- AQ75 is the currently eligible previous target while J7T is production. If PR72 is separately approved and deployed, J7T should become the immediately previous production candidate; that future eligibility must be checked again. This session did not verify future J7T eligibility.
- All five current alias mappings and candidate source/CI state require separate fresh readback by the coordinator. This browser result only proves the observations above.
- No source qualifications, inherited UI risks, provider/mobile limits, exact-SHA/tree release approvals, Android signing, or Play acceptance were waived.
- Local evidence only: no screenshots or files uploaded to Library or another service by this worker.

## Official references inspected

- https://vercel.com/docs/instant-rollback (documents selection/review/confirmation distinction, Hobby immediately-previous constraint, and alias/environment caveats)
- https://vercel.com/docs/deployments/rollback-production-deployment

## Evidence files

All evidence files are preserved beside this report. `manifest.json` records SHA-256, bytes, and filesystem modification time in UTC for the report and each evidence file. `SHA256SUMS` contains the same checksums. Screenshot frames may visually clip the Build Command; use `build-command-dom.txt` for the exact full field.

- build-command-dom.txt
- build-command.jpg
- project-identity-dom.txt
- rollback-selection-dom.txt
- rollback-selection.jpg
- rollback-review-dom.txt
- rollback-review.jpg
- rollback-domains-dom.txt
- rollback-domains.jpg
- after-cancel-production-dom.txt
- after-cancel-production.jpg
