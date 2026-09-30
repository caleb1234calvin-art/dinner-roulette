# Pick For Us — Controlled Main Promotion 1

## Authorization

The owner has explicitly authorized the controlled merge/promotion described by this handoff.

This authorization includes the known consequence that advancing `main` is expected to trigger a Vercel **production web deployment** using the verified migration-free project build override.

It does NOT authorize Android signing, Google Play upload/publication, database migration, Vercel settings changes, or unrelated repository changes.

## Repository
`caleb1234calvin-art/dinner-roulette`

## Source branch
`polish/pre-google-play-pass-1`

## Target branch
`main`

## Verified executable candidate

Commit:
`8bd1a0b47c3b1b0dbeafddede2e4f2e0ca30728f`

Tree:
`42b6e4f0a093f9af1ec1fc338cca25bc6a594787`

The executable candidate has independently passed remediation verification.

## Expected main before promotion

`6b811ae427339902f456c2706330689c2d6ad54b`

Do not proceed if current remote main differs unless this handoff is superseded by a new explicit authorization after reconciliation.

## Current source-branch documentation descendants

At final production-impact reconciliation, source branch head was:

`7b6e0209ecdc4c20ade041b077c536dd9622bc3c`

Post-candidate commits through that checkpoint were verified as handoff/documentation-only:

- `b3295d786aef61def4aded2a1c5a1742924ab89e`
- `f27ba9f49d13dd5be354f4a5e6ea07044f1052af`
- `7b6e0209ecdc4c20ade041b077c536dd9622bc3c`

This controlled-promotion handoff itself is a later documentation-only branch commit.

Before promotion, independently enumerate every commit after `8bd1a0b...` and verify that each changes only `docs/handoffs/active/` documentation. If any later commit changes executable/runtime/dependency/workflow/configuration/evidence/continuity content, STOP and report the discrepancy.

## Verified production consequence

Final production-impact reconciliation established:

Repository:
`REPOSITORY CANDIDATE REMAINS PRE-MERGE READY`

Production:
`PRODUCTION IMPACT VERIFIED — SAFE FOR SEPARATE MERGE AUTHORIZATION`

Deployment consequence:
`MERGE AUTOMATICALLY DEPLOYS — MIGRATION-FREE`

Owner-observed Vercel settings used in that reconciliation:

- connected repository: `caleb1234calvin-art/dinner-roulette`
- Production branch tracking: `main`
- Preview branch tracking: all unassigned Git branches
- Framework: TanStack Start
- Node: 24.x
- Build Command override: enabled
- exact project Build Command:
  `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`
- Deployment Checks: none configured
- Ignored Build Step: Automatic
- no deploy hooks
- rolling releases disabled

The repository ordinary `npm run build` chains `npm run db:migrate`, but Vercel's explicit project Build Command bypasses that command chain.

Do not change any Vercel setting during this task.

## Production URL continuity

The existing production URL/domain is intentionally retained.

The public product name becomes/remains **Pick For Us**, but the existing Vercel production URL is not being renamed as part of this promotion.

Existing links and QR codes using the current production URL are expected to continue resolving to the newly deployed hosted runtime after successful production promotion.

Do not create, remove, rename, or redirect domains in this task.

---

# Mission

Safely promote the already verified Pick For Us candidate to `main`, allow the expected Vercel production deployment to occur, verify that the exact promoted revision reaches production successfully, perform bounded production smoke checks, and stop.

This is a controlled release operation.

Do not perform feature work or remediation during the promotion.

---

# Preflight — mandatory stop gates

Before changing any ref:

1. Fetch fresh remote refs.
2. Record exact current:
   - `main`
   - `polish/pre-google-play-pass-1`
3. Verify current main is exactly:
   `6b811ae427339902f456c2706330689c2d6ad54b`
4. Verify `8bd1a0b...` remains in source-branch ancestry.
5. Verify candidate tree remains:
   `42b6e4f0a093f9af1ec1fc338cca25bc6a594787`
6. Enumerate every post-candidate source-branch commit.
7. Verify all post-candidate changes are handoff/documentation-only under `docs/handoffs/active/`.
8. Verify source is still 0 behind main and forms the expected straight descendant relationship.
9. Verify no unreviewed executable changes exist after the independently verified candidate.
10. Verify repository state is clean.
11. Re-read the final production-impact reconciliation/handoff.
12. Confirm the Vercel production project still resolves and current production still corresponds to pre-promotion main if read-only metadata is available.
13. Confirm no new contradictory deployment evidence is visible.

If ANY mandatory preflight invariant fails:

**STOP WITHOUT MERGING.**

Do not reconcile or fix during this task.

---

# What to promote

The desired canonical baseline includes:

1. the independently verified executable candidate `8bd1a0b...`, and
2. the repository-native handoff documentation added after it through this controlled-promotion handoff, provided preflight confirms those descendants are documentation-only.

Do not cherry-pick only the executable commit while abandoning the repository handoff system.

Do not introduce any additional implementation change.

The final promoted tree may therefore differ from executable candidate tree only by the expected documentation/handoff additions.

---

# Merge strategy

Because the source branch is expected to be a straight descendant of main with no divergence, prefer a promotion that preserves that validated history without synthesizing unnecessary code changes.

Before executing, determine the safest available GitHub/Git operation consistent with:

- exact ancestry preservation,
- no conflict resolution,
- no content edits,
- no squash that obscures validated checkpoint ancestry unless platform constraints require it,
- no rebase/rewrite of validated commits.

A clean fast-forward of `main` to the authorized source head is preferred if available and permitted.

If branch protection/platform policy requires a pull request/merge commit, verify the resulting tree before completing promotion and clearly report the method.

Do not force-push.

Do not rewrite history.

Do not bypass required protections.

---

# Promotion action

Only after all preflight gates pass:

1. Advance `main` using the approved safe method.
2. Record the exact resulting main SHA.
3. Immediately refetch remote main.
4. Verify remote main is exactly the expected promoted revision/result.
5. Verify the resulting main tree matches the authorized source head tree.
6. Verify `8bd1a0b...` remains in main ancestry.
7. Verify no unexpected file/content change was introduced by promotion.

Do not delete the polish branch in this task.

---

# Expected Vercel behavior

A successful main promotion is expected to trigger a Vercel Production deployment.

Do not manually redeploy unless this handoff is explicitly superseded.

Observe the automatically created deployment.

Record:

- deployment ID
- source type
- Git repository
- source revision/SHA
- target/environment
- build status
- final deployment status
- production alias/domain state

The production deployment must correspond to the promoted main revision.

If no deployment appears within a reasonable observation window, or the deployment source revision does not match promoted main:

STOP and report.

Do not manually compensate with a redeploy.

---

# Build/migration verification

From deployment metadata/logs if read-only access permits, verify that the production deployment uses the expected migration-free build path.

Expected project command:

`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

Do not run `npm run db:migrate`.

Do not trigger migrations.

If the observed deployment unexpectedly invokes a migration command, classify this as a production-release failure and stop.

---

# Production smoke verification

After Vercel reports the exact promoted revision READY in Production, perform bounded read-only smoke verification against the existing production URL.

Do not mutate production data beyond ordinary anonymous/read-only application interactions.

At minimum verify:

1. production URL resolves successfully
2. visible public identity is Pick For Us
3. startup/Mordax presentation does not prevent entry under ordinary successful-media behavior
4. Dinner mode loads
5. Nightlife mode loads
6. Date Night mode loads
7. Settings opens
8. Favorites/History navigation opens
9. no obsolete PickForUs APK download is advertised
10. quick-tour branding is Pick For Us
11. no obvious stale Dinner Roulette public branding on the checked current surfaces
12. existing production URL remains usable
13. no obvious fatal browser/runtime error appears during the bounded smoke

Where safe and deterministic, verify a basic pick/options flow without performing an external transaction.

Do not claim exhaustive production acceptance.

Do not claim physical Android/WebView acceptance.

---

# Production failure protocol

If the automatic production deployment fails, becomes ERROR/CANCELED, deploys the wrong revision, exhibits a fatal smoke regression, or unexpectedly executes migrations:

1. STOP feature/release work.
2. Preserve exact evidence:
   - promoted main SHA
   - deployment ID
   - deployment status
   - failing logs/status if accessible
   - smoke failure details
3. Do not edit production settings.
4. Do not run migrations.
5. Do not improvise a code fix on main.
6. Do not publish Android/Play artifacts.
7. Report:
   `PRODUCTION PROMOTION FAILED — REMEDIATION/ROLLBACK DECISION REQUIRED`

Do not automatically roll back unless an immediately safe rollback mechanism was explicitly authorized before execution. This handoff does not authorize an automatic rollback.

---

# Android / Play boundary

This promotion does NOT authorize or perform:

- upload-key creation
- signed AAB generation
- Play Console package registration
- Google Play internal/closed/production upload
- public APK release
- overwrite of historical `android-latest`

Android Phase B human gates remain outstanding.

The hosted Android shell loads the production URL, so the web experience may update after Vercel production succeeds even without a native release.

---

# Post-promotion repository state

If promotion and production smoke verification pass:

1. Record exact new main SHA.
2. Record source branch SHA used.
3. Record exact production deployment ID/revision.
4. Record smoke results.
5. Confirm no migration was run by this task.
6. Confirm no Android/Play release action occurred.
7. Confirm production URL continuity.
8. Do not delete branches yet.
9. Do not begin seasonal-discovery remediation/audit in this same task.

Stop after recording/reporting success.

A later task can:
- archive/retire old active handoffs,
- decide whether to delete the polish branch,
- create a fresh branch from the new main baseline,
- begin the seasonal-discovery coverage audit.

---

# Success state

Successful completion must end with:

`MAIN PROMOTION VERIFIED — PRODUCTION WEB RELEASE HEALTHY`

Report:

1. pre-promotion main SHA
2. source branch SHA
3. executable candidate SHA/tree
4. promotion method
5. resulting main SHA/tree
6. ancestry verification
7. production deployment ID
8. production deployment source revision
9. deployment status
10. migration/build-path evidence
11. production URL
12. smoke-check results
13. production branding result
14. whether existing links/QR URL remain valid
15. Android/Play actions performed: expected none
16. any warnings/limitations
17. final success/failure state

Stop after success.

Do not continue into new development.
