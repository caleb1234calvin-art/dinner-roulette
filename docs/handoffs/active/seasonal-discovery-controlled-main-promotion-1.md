# Pick For Us — Seasonal Discovery Controlled Main Promotion 1

Repository: `caleb1234calvin-art/dinner-roulette`

Source branch: `audit/seasonal-discovery-coverage-1`

Target branch: `main`

## Authorization

The owner authorizes a controlled promotion of the independently verified seasonal-discovery candidate to main, including the known automatic migration-free Vercel production web deployment that follows a successful main update.

This does NOT authorize database migrations, Vercel setting changes, Android signing/publication, Google Play actions, unrelated feature work, or automatic rollback.

## Verified executable candidate

SHA:
`4f90ca5c1ae614cf66fdd40ab6dd33d2c906c969`

Tree:
`d8328423a4a3043887dba5087787735fc4112aad`

Sole parent:
`c7fa7a87109624212379270df8f52ddd4c334eb9`

Independent final state:
`V-F03-01 VERIFIED — SEASONAL DISCOVERY CANDIDATE READY FOR MERGE REVIEW`

The independent verification closed V-F03-01 and confirmed F01, F02, F04, F05 and F06 remain closed.

## Expected main before promotion

`0a8f30dc57fcc1156342d1bfc8a07524f3125e3b`

Do not proceed if fresh remote main differs. Stop and report rather than reconciling automatically.

## Documentation descendants

At the final verification, the branch had later documentation-only verification material after the executable target.

Before promotion, enumerate every source-branch commit after `4f90ca5c...` and verify each changes only expected documentation/handoff/reporting paths and does not alter runtime code, dependencies, catalogs, workflows, build configuration, Android, or production settings.

This controlled-promotion handoff itself is expected to be another documentation-only descendant.

If any executable/configuration change exists after the verified candidate, STOP.

## Required reading

Read IN FULL:

- original seasonal discovery audit handoff/report
- `docs/handoffs/active/seasonal-discovery-remediation-1.md`
- `docs/handoffs/active/seasonal-discovery-remediation-1-verification.md`
- `docs/handoffs/active/seasonal-discovery-remediation-1-verification-finding-1.md`
- `docs/handoffs/active/seasonal-discovery-remediation-1-vf03-01-verification.md`
- remediation reports/evidence as needed
- final V-F03-01 independent verification report/evidence if available
- current TOP continuity
- prior production-impact/promotion handoffs needed to reconfirm deployment boundary

## Mandatory preflight

Before changing any ref:

1. Fetch fresh remote refs.
2. Record exact main and source branch SHAs.
3. Verify main is exactly `0a8f30dc57fcc1156342d1bfc8a07524f3125e3b`.
4. Verify verified candidate SHA/tree/sole parent exactly.
5. Verify candidate is in source ancestry.
6. Enumerate every post-candidate source commit.
7. Verify all post-candidate changes are documentation/reporting only.
8. Verify source remains a straight descendant of main with no divergence.
9. Verify no unreviewed executable change exists.
10. Verify clean checkout.
11. Reconfirm the exact migration-free Vercel production build setting/evidence remains applicable and no repository config change contradicts it.
12. Verify no repository workflow independently publishes Android/Play artifacts on main update.
13. If read-only Vercel metadata is available, verify current production still corresponds to current main and no contradictory deployment state exists.

If any mandatory invariant fails, STOP WITHOUT MERGING.

## Promotion content

Promote the complete authorized source history, including:

- independently verified seasonal implementation
- persisted audit/remediation/verification evidence
- repository-native handoffs/documentation

provided every post-candidate descendant remains documentation/reporting-only.

Do not cherry-pick only implementation while abandoning the repository continuity/evidence history.

Do not introduce new implementation changes.

## Promotion method

Because source is expected to be a straight descendant of main, prefer a non-forced fast-forward preserving validated history.

Do not rebase.
Do not squash validated checkpoints.
Do not force-push.
Do not resolve conflicts or edit code during promotion.
Do not bypass required branch protections.

If platform policy requires another method, verify the resulting tree/content before completing and report the exact method.

## Expected production consequence

Prior verified Vercel configuration established:

- connected Git repository: `caleb1234calvin-art/dinner-roulette`
- Production tracks `main`
- project-level Build Command override is enabled
- exact migration-free command:
  `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`
- production deployment is automatic from main
- Android/Play publication is separate

Do not change these settings.

A successful main promotion is therefore an intentional production web release.

## Promotion

Only after all preflight gates pass:

1. Advance main using the safe authorized method.
2. Refetch remote main.
3. Record exact resulting main SHA/tree.
4. Verify it exactly matches the authorized source head/tree.
5. Verify `4f90ca5c...` remains in main ancestry.
6. Verify no unexpected content was introduced.

Do not delete the audit branch.

## Vercel observation

Observe the automatic production deployment.

Record:

- deployment ID
- source repository
- source revision
- target/environment
- build/final status
- production alias/domain

The deployment must correspond to the promoted main revision.

Do not manually redeploy if no automatic deployment appears or if it fails. Stop and report.

If build metadata/logs expose the command, verify the migration-free path. If logs are unavailable, explicitly retain the previously verified project-setting limitation rather than claiming a fresh command transcript.

Do not run migrations.

## Production smoke

After the exact promoted revision reaches READY/Production, perform bounded read-only smoke verification against the existing production URL.

Verify at minimum:

1. production URL resolves
2. Pick For Us branding/startup works
3. Dinner loads
4. Nightlife loads
5. Date Night loads
6. Settings opens
7. Favorites/History navigation works
8. seasonal Date Night controls are available in the active seasonal window
9. category selection remains union semantics
10. generic maze false-positive protection is represented by deterministic deployed revision evidence where a safe live reproduction is not possible
11. Open Now OFF/ON does not obviously regress ordinary Date Night behavior
12. no obvious fatal runtime/browser error
13. existing production URL remains usable

Where deterministic production interaction safely permits, exercise Pick/options.

Do not require a particular live seasonal venue count: external provider availability is mutable.

Do not claim exhaustive browser/provider/physical Android acceptance.

## Seasonal-specific post-deploy evidence

Because prior live Overpass attempts timed out, distinguish:

- production UI/runtime smoke
- deterministic verified implementation behavior
- mutable live-provider observations

If live provider requests succeed in production, record source/disclosure behavior and check for obvious generic-maze false positives.

If providers are unavailable, verify fallback/disclosure remains honest. Provider unavailability alone is not a deployment failure if the application handles it correctly.

Do not add or edit venues during smoke.

## Failure protocol

If promotion or production deployment fails, wrong revision deploys, migrations unexpectedly run, or bounded smoke finds a fatal regression:

- stop
- preserve exact main SHA/deployment ID/status/evidence
- do not improvise a fix on main
- do not change Vercel
- do not run migrations
- do not automatically roll back
- do not publish Android/Play

Report:
`SEASONAL MAIN PROMOTION FAILED — REMEDIATION/ROLLBACK DECISION REQUIRED`

Automatic rollback is not authorized by this handoff.

## Android boundary

No Android signing, AAB/APK publication, Play Console upload, or public APK release is authorized.

The existing Android shell may receive the updated hosted web experience because it loads the production URL.

## Success report

On success report:

1. previous main SHA/tree
2. source branch SHA/tree
3. verified executable candidate SHA/tree
4. post-candidate documentation descendants
5. promotion method
6. resulting main SHA/tree
7. ancestry/content verification
8. Vercel deployment ID/revision/status
9. build/migration evidence
10. production URL
11. smoke results
12. seasonal-specific observations and provider limitation
13. URL/QR continuity
14. Android/Play actions: expected none
15. warnings/limitations
16. final state

Successful final state:

`SEASONAL MAIN PROMOTION VERIFIED — PRODUCTION WEB RELEASE HEALTHY`

Stop after success. Do not begin another feature/audit task in the same run.
