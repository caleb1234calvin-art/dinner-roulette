# Pick For Us — Production Loading Hang Controlled Main Promotion 1

Repository: `caleb1234calvin-art/dinner-roulette`

Source branch: `audit/production-loading-hang-1`

Target branch: `main`

## Authorization

The owner explicitly authorizes controlled promotion of the independently verified production-loading remediation to main and the resulting automatic migration-free Vercel production web deployment.

This does NOT authorize database migrations, Vercel settings changes, Android signing/publication, Google Play actions, provider/catalog changes, unrelated feature work, or automatic rollback.

## Independently verified executable candidate

SHA:
`d9c3d02b7533ea55b5c47b219359f7a87ff783c5`

Tree:
`d90c5f55ee74252ddfe0e7854bf6d2fed3bf16fb`

Sole parent:
`6cc0a2b76613c52dbf4a6ea4e9a55494287cb057`

Verification final state:

`PRODUCTION LOADING HANG REMEDIATION VERIFIED — PRE-MERGE CANDIDATE READY`

## Expected main before promotion

`66eed1409e1076bcea388f36891c31fa7fa3eb84`

If fresh remote main differs, STOP. Do not automatically reconcile, rebase or merge around unexpected movement.

## Required reading

Read IN FULL:

- `docs/handoffs/active/production-loading-hang-audit-1.md`
- incident audit report/JSON/evidence
- `docs/handoffs/active/production-loading-hang-remediation-1.md`
- remediation report/JSON/evidence
- `docs/handoffs/active/production-loading-hang-remediation-1-verification.md`
- final independent verification report/evidence if available
- current TOP continuity
- prior production-impact and controlled-promotion handoffs needed to confirm Vercel/release boundaries

## Mandatory preflight

Before changing any ref:

1. Fetch fresh remote refs.
2. Record exact main and source head.
3. Verify main exactly equals `66eed1409e1076bcea388f36891c31fa7fa3eb84`.
4. Verify candidate SHA/tree/sole parent exactly.
5. Verify candidate is in source ancestry.
6. Enumerate every source commit after the candidate.
7. Verify every post-candidate commit is documentation/reporting/evidence-only and introduces no executable/config/dependency/catalog/workflow change.
8. Verify source is a straight descendant of main with no divergence.
9. Verify no unreviewed executable change exists after the independently verified candidate.
10. Verify clean checkout.
11. Reconfirm repository/Vercel configuration relevant to the established automatic migration-free production deployment has not changed.
12. Verify main update does not independently sign/publish Android or upload to Play.
13. If read-only Vercel metadata is available, verify current production is READY at the expected pre-promotion main and no contradictory deployment state exists.

If ANY preflight invariant fails, STOP WITHOUT MERGING.

## Authorized content

Promote the complete authorized source history, including:

- incident audit evidence
- verified loading remediation
- verification documentation/evidence/handoffs

provided all post-candidate descendants are non-executable documentation/reporting/evidence only.

Do not cherry-pick implementation while abandoning repository-native audit continuity.

Do not introduce implementation changes during promotion.

## Promotion method

Prefer a non-forced fast-forward preserving exact validated history.

Do not rebase.
Do not squash validated checkpoints.
Do not force-push.
Do not resolve conflicts or edit code during promotion.
Do not bypass branch protections.

If platform policy requires another safe method, verify the resulting tree/content exactly and report it.

## Expected production consequence

Established project configuration indicates:

- Git repository is connected to Vercel
- Production tracks `main`
- automatic deployment follows main updates
- project-level migration-free Build Command override is:
  `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`
- Android/Play publication is separate

Do not change these settings.

A successful main promotion is an intentional production web release.

## Promotion

Only after every preflight passes:

1. Advance main using the safe authorized method.
2. Refetch main.
3. Record resulting main SHA/tree.
4. Verify main equals the authorized source head/tree.
5. Verify `d9c3d02b...` remains in main ancestry.
6. Verify no unexpected content was introduced.
7. Do not delete the audit branch.

## Automatic Vercel deployment

Observe the automatic deployment.

Record:

- deployment ID
- repository/source
- source revision
- target/environment
- build/final status
- production alias

Require the deployed source revision to equal resulting main.

Do not manually redeploy if automatic deployment is absent/fails.

If build logs are unavailable, preserve the known limitation rather than inventing a fresh hosted command transcript.

Do not run migrations.

## Production smoke — loading remediation focus

After the exact promoted revision reaches READY/Production, perform bounded anonymous production smoke against the existing production URL.

At minimum verify:

1. production URL resolves
2. Pick For Us startup/branding works
3. Dinner loads and settles
4. Date Night ordinary loads and settles
5. Date Night seasonal loads and settles/falls back honestly
6. Nightlife loads and settles
7. Settings/Favorites/History basic navigation remains functional
8. no obvious fatal runtime/browser error
9. existing URL remains usable

## Timing focus

Because this release specifically addresses loading liveness, record timestamps/bounds where possible.

For Dinner, Date Night and Nightlife:

- record loading start
- record settlement
- record result source/fallback/error when observable
- confirm no mode remains visibly loading beyond the intended client watchdog window under the observed request

Do not require provider failure in production merely to exercise the 20-second budget.

Do not sabotage production networking.

If natural provider failure occurs:

- verify fallback/error settlement is consistent with the new bounded behavior
- record observed timing
- verify timeout/retry UI if client watchdog is naturally reached

The deterministic independent verification remains the authoritative controlled-failure proof; production smoke confirms deployment/runtime compatibility.

## Regression-preservation smoke

Confirm no obvious regression to:

- Dinner options/filtering
- ordinary Date Night
- Spooky Season controls during active season
- seasonal coverage disclosure
- Nightlife
- manual location
- Pick/options basic action

Do not perform external transactions, calls, directions, purchases, Save/We did this, or other unnecessary production writes.

## Failure protocol

If:

- wrong revision deploys
- production deployment errors/cancels
- migration unexpectedly runs
- app exhibits a fatal runtime regression
- ordinary discovery fails to settle under bounded smoke in a way inconsistent with the verified design

then:

1. STOP.
2. Preserve exact main SHA, deployment ID/status and smoke evidence.
3. Do not edit main.
4. Do not change Vercel.
5. Do not run migrations.
6. Do not automatically roll back.
7. Do not publish Android/Play.

Report:

`LOADING REMEDIATION MAIN PROMOTION FAILED — REMEDIATION/ROLLBACK DECISION REQUIRED`

Automatic rollback is not authorized.

## Android boundary

No signing, AAB/APK publication, Play Console upload, public APK release or Android workflow dispatch is authorized.

Existing hosted shells may receive the updated web experience through the production URL.

## Success report

Report:

1. previous main SHA/tree
2. source head SHA/tree
3. verified executable candidate SHA/tree
4. post-candidate descendants and classification
5. promotion method
6. resulting main SHA/tree
7. ancestry/content verification
8. Vercel deployment ID/revision/status
9. migration/build-path evidence and limitation
10. production URL
11. Dinner smoke/timing
12. Date Night ordinary smoke/timing
13. Date Night seasonal smoke/timing
14. Nightlife smoke/timing
15. timeout/retry behavior observed, if naturally triggered
16. regression-preservation smoke
17. URL/QR continuity
18. Android/Play actions: expected none
19. warnings/limitations
20. final state

Successful final state:

`LOADING REMEDIATION MAIN PROMOTION VERIFIED — PRODUCTION WEB RELEASE HEALTHY`

Stop after success. Do not begin another feature/audit task.
