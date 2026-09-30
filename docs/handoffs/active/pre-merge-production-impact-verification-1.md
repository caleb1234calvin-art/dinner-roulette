# Pick For Us — Pre-Merge Production Impact Verification 1

## Repository
`caleb1234calvin-art/dinner-roulette`

## Source branch
`polish/pre-google-play-pass-1`

## Target branch
`main`

## Verified executable candidate
`8bd1a0b47c3b1b0dbeafddede2e4f2e0ca30728f`

## Candidate tree
`42b6e4f0a093f9af1ec1fc338cca25bc6a594787`

## Main baseline from independent verification
`6b811ae427339902f456c2706330689c2d6ad54b`

## Status entering this task

The independent remediation verification concluded:

`REMEDIATION VERIFIED — PRE-MERGE CANDIDATE READY`

The repository candidate itself has no known merge blocker from F01/F02/F03.

However, the verifier explicitly left these production questions unresolved:

1. Whether the next merge/push to `main` automatically triggers a Vercel production deployment.
2. What effective build command Vercel uses for the linked production project.
3. Whether the repository's ordinary migration-triggering build command is overridden safely in hosted production.

This task exists only to resolve those production-impact questions before any merge authorization.

# Nature of task

READ-ONLY production-impact verification.

DO NOT modify repository files.
DO NOT commit.
DO NOT push.
DO NOT merge.
DO NOT deploy.
DO NOT trigger a deployment.
DO NOT redeploy.
DO NOT change Vercel project settings.
DO NOT change environment variables.
DO NOT run database migrations.
DO NOT publish.
DO NOT sign.
DO NOT upload to Google Play.

If read access is insufficient to establish a fact, report it as UNVERIFIED. Do not guess and do not request or expose secrets.

# Required reading

Read in full:

- `docs/handoffs/active/pre-merge-baseline-remediation-1-verification.md`
- the independent remediation verification report/evidence if available
- `AI_CONTINUITY.md` top current sections
- `ANDROID_RELEASE.md`
- `package.json`
- `vercel.json` if present
- all relevant GitHub workflows/configuration affecting main, deployment or build behavior

Use the exact immutable candidate for repository analysis. Do not mistake later documentation-only branch commits for the executable candidate.

# Repository-side verification

Establish:

- current remote `main` SHA
- current remote polish branch SHA
- whether `8bd1a0b...` remains in branch ancestry
- whether main has moved since independent verification
- exact main/candidate ancestry relationship
- repository build scripts
- whether ordinary `npm run build` invokes migration
- whether repository config defines a Vercel build-command override
- whether repository workflows deploy on main
- whether any repository automation can trigger Vercel or another production deployment after main changes

Do not execute migration-triggering commands.

# Vercel production verification

Use read-only Vercel/project/deployment access if available.

The historically observed production runtime is:

`https://dinner-roulette-chi.vercel.app`

Prior audit observed a production deployment sourced from Git/main at main SHA:

`6b811ae427339902f456c2706330689c2d6ad54b`

Prior observed identifiers:

- team: `minions-9e2c`
- project: `dinner-roulette`
- project id: `prj_Duz6oRktFrLVIMK1DfAxZyxQCCwm`
- prior deployment: `dpl_34rqVqyELVS25UtcRGGBSoM5vsYp`

Treat these only as leads to verify, not authority if current read-only state differs.

Determine, if access permits:

1. Is the project currently linked to the GitHub repository?
2. What Git branch is configured as the production branch?
3. Are automatic Git deployments enabled?
4. Does a push/merge to `main` automatically create a production deployment?
5. Are deployments gated by ignored-build rules, deployment protection, checks, or another manual promotion mechanism?
6. What exact effective build command is configured for production?
7. Is the build command inherited from `package.json`, overridden in Vercel project settings, or overridden elsewhere?
8. What install command is effective?
9. What framework/build settings materially affect this repository?
10. Is a database migration command executed as part of the hosted production build?
11. If migrations occur, what command invokes them and under what conditions?
12. Can a merge to main alter the hosted web runtime automatically even though Android publication is separate?

Do not inspect secret values. Configuration names/status are sufficient where appropriate.

# Migration safety question

Repository history has documented that the ordinary build script includes a migration step, while migration-free validation uses a direct Vite command.

Determine the exact current relationship among:

- `package.json` build command
- Vercel effective production build command
- `vercel.json`
- project-level Vercel settings
- any GitHub/Vercel integration behavior

The answer must clearly state one of:

A. Production build is verified migration-free.

B. Production build is verified to execute migration.

C. Effective production build command remains UNVERIFIED.

Do not infer A merely because local migration-free builds pass.

# Deployment consequence classification

At the end, classify what would happen if the verified candidate were merged/promoted into current main.

Choose the best evidence-supported state:

## MERGE DOES NOT AUTOMATICALLY DEPLOY
Evidence proves a merge/push to main does not itself create/promote production.

## MERGE AUTOMATICALLY DEPLOYS — MIGRATION-FREE
Evidence proves main promotion triggers production and the effective production build is migration-free.

## MERGE AUTOMATICALLY DEPLOYS — MIGRATION EXECUTES
Evidence proves main promotion triggers production and the effective production build executes a migration command.

## MERGE/DEPLOYMENT CONSEQUENCE UNVERIFIED
Read access/evidence cannot establish the production consequence safely.

If there are conditional gates, describe them precisely rather than forcing an inaccurate label.

# Safety assessment

Report separately:

1. **Repository merge readiness**
   - Based on already verified candidate state and current ancestry.

2. **Production promotion readiness**
   - Based only on this task's production/deployment evidence.

A repository candidate may remain merge-ready while production promotion is not authorized.

Do not collapse those into one conclusion.

# Required final report

Report:

1. Current main SHA
2. Current polish branch SHA
3. Verified executable candidate SHA/tree
4. Current ancestry/ahead-behind state
5. Repository build command
6. Migration-free validation command
7. Repository deployment automation findings
8. Current Vercel project/deployment identity
9. Git repository linkage status
10. Production branch setting
11. Automatic deployment setting/behavior
12. Effective Vercel install command
13. Effective Vercel build command
14. Migration behavior classification
15. Any ignored-build/protection/manual-promotion gates
16. Exact expected consequence of merging/promoting to main
17. Whether Android release state is affected by the merge
18. Any remaining unknowns
19. Repository merge-readiness state
20. Production-promotion-readiness state
21. Final deployment-consequence classification

# Final states

End with BOTH a repository state and production state.

Repository state must be one of:

`REPOSITORY CANDIDATE REMAINS PRE-MERGE READY`

or

`REPOSITORY CANDIDATE NO LONGER PRE-MERGE READY`

Production state must be one of:

`PRODUCTION IMPACT VERIFIED — SAFE FOR SEPARATE MERGE AUTHORIZATION`

or

`PRODUCTION IMPACT VERIFIED — ADDITIONAL PRODUCTION REMEDIATION REQUIRED`

or

`PRODUCTION IMPACT UNVERIFIED — DO NOT MERGE TO MAIN YET`

No state in this task itself authorizes a merge.

Stop after the read-only report.
