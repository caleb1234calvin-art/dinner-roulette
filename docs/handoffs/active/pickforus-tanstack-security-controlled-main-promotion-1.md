# Pick For Us — TanStack Security Controlled Main Promotion 1

Repository:
`caleb1234calvin-art/dinner-roulette`

Promotion-control branch:
`promote/pickforus-tanstack-security-1`

Target branch:
`main`

## Exact verified candidate

Candidate SHA:
`551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`

Candidate tree:
`c2ee34d097974f7a4fd5013abfaf29fc0319fcc8`

Candidate sole parent:
`195fc422c3cde6bcae305296ae016ecae4bfd562`

Independently verified final state:

`PICK FOR US TANSTACK SECURITY CANDIDATE VERIFIED — READY FOR CONTROLLED PROMOTION`

Known verified Preview:

`dpl_CccJC5M4kJTv7P4x4KUGeGefspn6`

Expected Preview source SHA:
`551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`

Expected Preview state:
`READY`

## Expected production main before promotion

`9337f6ede14b314f10d6b79720aef62ee94fad7d`

Known current production deployment:

`dpl_9KvaQ8T15txTWTkxTT1ifDruL7GS`

Known current production source SHA:

`9337f6ede14b314f10d6b79720aef62ee94fad7d`

Known production alias:

`https://dinner-roulette-chi.vercel.app`

## IMPORTANT — owner authorization gate

THIS HANDOFF DOES NOT BY ITSELF AUTHORIZE MOVING MAIN.

Before changing `main`, the owner must explicitly authorize security-first production promotion after being informed of this sequencing consequence:

Promoting exact candidate `551c5f89...` also promotes the independently verified domain-readiness changes from ancestor `195fc422...`.

Those changes cause the legacy production host to emit canonical/social metadata pointing to:

`https://pickforus.app`

while `pickforus.app` is not yet attached to the Vercel project and DNS cutover is not yet complete.

Therefore, immediately after promotion and before domain cutover:
- application runtime continues to serve on the existing legacy Vercel host
- no redirect is added
- existing Android shells remain on the legacy host
- existing browser-local state remains on the legacy origin
- but public canonical/OG metadata advertises the future apex domain

This temporary canonical mismatch is a lower-severity publishing/SEO condition, but it is real.

The reason to consider accepting it is security priority: current production main still resolves the affected TanStack Start packages, while the exact verified candidate clears the Vercel security gate and passes all 192 tests plus browser/runtime verification.

Do not infer owner acceptance from this document.

If explicit owner authorization is absent, STOP with:

`PICK FOR US SECURITY PROMOTION — OWNER AUTHORIZATION REQUIRED`

## Required reading

Read IN FULL:

- `docs/handoffs/active/pickforus-tanstack-security-verification-1.md`
- `docs/handoffs/active/pickforus-tanstack-security-remediation-1.md`
- both TanStack remediation continuation files
- `docs/handoffs/active/pickforus-domain-readiness-remediation-1.md`
- `docs/handoffs/active/pickforus-domain-readiness-verification-1.md`
- relevant prior controlled-promotion handoffs needed to preserve release discipline

If verification/remediation reports are available, read them as supporting evidence.

## Candidate ancestry

Expected promotion ancestry from current main to candidate is exactly three commits:

1. `5c5e9607985a3079b37c22f502ef0c4c7cafe0a7`
   - domain-readiness remediation handoff
2. `195fc422c3cde6bcae305296ae016ecae4bfd562`
   - verified domain metadata/install remediation
3. `551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`
   - verified TanStack security remediation

No audit/verification instruction commits should be in candidate ancestry.

## Promotion authorization scope

Only after explicit owner approval, this phase MAY:

- fast-forward `main` to exact candidate `551c5f89...`
- allow the resulting automatic Vercel Production deployment
- observe that exact deployment
- perform bounded anonymous production smoke
- verify security-gate clearance on production
- verify domain-readiness behavior on legacy production
- record production deployment identity/state

This phase does NOT authorize:

- DNS changes
- attaching `pickforus.app`
- Vercel domain changes
- Vercel settings/environment changes
- database migrations
- Android signing/publication
- auth provider changes
- dependency changes
- code edits
- force push
- rebase
- squash
- automatic rollback
- removal/redirect of the legacy hostname

## Mandatory preflight

Before any ref update:

1. Fetch fresh Git refs.
2. Verify `origin/main` exactly equals:
   `9337f6ede14b314f10d6b79720aef62ee94fad7d`
3. Verify source branch / candidate ref exposes exact:
   `551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`
4. Verify candidate tree exactly:
   `c2ee34d097974f7a4fd5013abfaf29fc0319fcc8`
5. Verify candidate sole parent exactly:
   `195fc422c3cde6bcae305296ae016ecae4bfd562`
6. Verify candidate is exactly three commits ahead of main and zero behind.
7. Enumerate all three commits and classify them.
8. Verify there is no unverified executable/config/dependency change after candidate.
9. Verify current production deployment remains READY at old main.
10. Verify exact candidate Preview remains READY:
    `dpl_CccJC5M4kJTv7P4x4KUGeGefspn6`
11. Verify Preview source SHA is exact candidate.
12. Verify no Vercel package-security bypass has been introduced in tracked source/config.
13. Reconfirm project-level migration-free Build Command has not been intentionally changed by repo history:
    `VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`
14. Record that current effective Vercel dashboard Build Command remains a historical/readback limitation if not exposed.
15. Verify `pickforus.app` remains unattached before promotion so the known sequencing condition is accurately recorded.
16. Verify explicit owner authorization for the temporary canonical mismatch is present in the current instruction context.

If any immutable or authorization gate fails, STOP WITHOUT PROMOTION.

## Promotion method

Preferred and expected method:

Normal non-forced fast-forward of `main` to:

`551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`

Do not:
- cherry-pick
- create a merge commit
- rebase
- squash
- force-push
- modify files during promotion
- resolve conflicts
- bypass branch protection

If a direct safe fast-forward is impossible, STOP.

## Expected production deployment

A successful main update is expected to trigger Vercel Production automatically.

Observe only the deployment triggered by the exact promoted main SHA.

Record:
- deployment ID
- target/environment
- source branch
- source SHA
- state / readyState
- production aliases
- region
- alias errors
- package/security error if any

Require:
- target = production
- source SHA = exact promoted main = `551c5f89...`
- state = READY
- no `BLOCKED_PACKAGE`
- legacy production alias still serves

Do not manually redeploy if automatic deployment is absent or fails.

## Migration boundary

The ordinary package script still includes database migration.

Do not run:

`npm run build`

Do not run:

`npm run db:migrate`

Promotion relies on the existing project-level migration-free Vercel build configuration.

If evidence suggests a migration ran, STOP and report.

## Production smoke

After exact production deployment reaches READY, perform bounded anonymous smoke.

### Host continuity

Verify:

- `https://dinner-roulette-chi.vercel.app/` = HTTP 200
- no global redirect to `pickforus.app`
- Settings / History / Favorites remain reachable
- static assets load
- compatibility manifests load
- install tutorial loads
- legacy Android-serving origin remains intact

### Security / framework

Verify:
- production source SHA exact candidate
- no `BLOCKED_PACKAGE`
- homepage hydrates
- one legitimate discovery RPC completes successfully
- server-function transport works in production
- no obvious application console error
- no auth/security bypass is required

### Domain-readiness behavior

Verify on legacy production:
- canonical points to `https://pickforus.app/`
- route-specific utility canonicals point to equivalent apex paths
- homepage robots = intended production policy
- utility routes = noindex,follow
- OG/Twitter identity remains Pick For Us
- install identity remains Pick For Us
- no user-facing `Grok App`
- legacy host still returns 200 and has no Location redirect

Record explicitly that apex itself is not yet live/attached.

### Core product

Perform bounded smoke:
- Dinner discovery settles
- Date Night ordinary settles
- Nightlife settles
- seasonal Date Night settles or falls back honestly
- pick/options controls remain usable
- Settings/History/Favorites navigation works

Preserve existing:
- 20,000 ms provider-chain deadline
- 25,000 ms client watchdog

Do not deliberately sabotage provider networking to force failure.

### Browser-local state

Do not attempt to migrate local storage.

Legacy-origin existing state behavior remains unchanged.

Do not clear user data.

## Failure protocol

If any of the following occurs:

- main not at expected old SHA before promotion
- candidate identity mismatch
- candidate Preview no longer READY
- production deploys wrong SHA
- Production deployment errors
- `BLOCKED_PACKAGE` returns
- migration unexpectedly runs
- fatal hydration/navigation/RPC regression
- legacy hostname redirects or stops serving
- serious metadata/install regression

then:

1. STOP.
2. Preserve exact main SHA and production deployment ID/state.
3. Do not edit main.
4. Do not change Vercel settings.
5. Do not change DNS.
6. Do not automatically rollback.
7. Report the failure and recommended bounded recovery options.

Automatic rollback is NOT authorized.

## Success state

On success, report:

1. explicit owner authorization basis
2. previous main SHA/tree
3. candidate SHA/tree/parent
4. exact three-commit ancestry
5. promotion method
6. resulting main SHA/tree
7. automatic production deployment ID
8. deployed source SHA
9. deployment READY state
10. package-security gate status
11. migration/build-path evidence and limitations
12. legacy hostname continuity
13. security/RPC smoke
14. core product smoke
15. canonical/social/install metadata behavior
16. temporary canonical mismatch explicitly acknowledged
17. Android/Play actions: none
18. DNS/domain actions: none
19. warnings/limitations
20. next bounded step

Successful final state:

`PICK FOR US TANSTACK SECURITY MAIN PROMOTION VERIFIED — PRODUCTION HEALTHY / DOMAIN CUTOVER NEXT`

Do not begin DNS/domain work automatically.

Stop after production smoke and report.
