# Pick For Us — Icon Refresh Controlled Main Promotion 1

Repository:
`caleb1234calvin-art/dinner-roulette`

Promotion-control branch:
`promote/pickforus-icon-refresh-1`

Target branch:
`main`

## Exact verified candidate

Candidate SHA:
`4ba90f22a36409c4aa5d807f9c81257ba8884a7c`

Candidate tree:
`fd4374a52b6fc444be4747c17b0f90e76abfd373`

Candidate sole parent:
`551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`

Independent verification final state:

`PICK FOR US ICON REFRESH CANDIDATE VERIFIED — READY FOR CONTROLLED PROMOTION`

Known verified Preview:

`dpl_57zF5kRTiFGS2MEwVJ2DkBzw4528`

Expected Preview source:
`4ba90f22a36409c4aa5d807f9c81257ba8884a7c`

Expected Preview state:
`READY`

## Expected current production state

Main:
`551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`

Known production deployment:
`dpl_6NXMDgiqz19PzXeHQ7DnnRFGnWXc`

Canonical production domain:
`https://pickforus.app`

Legacy production domain:
`https://dinner-roulette-chi.vercel.app`

## Owner authorization gate

THIS HANDOFF DOES NOT BY ITSELF AUTHORIZE MOVING MAIN.

Before updating `main`, obtain explicit owner authorization for production promotion of the verified icon candidate.

If explicit authorization is absent, stop:

`PICK FOR US ICON REFRESH PROMOTION — OWNER AUTHORIZATION REQUIRED`

## Required reading

Read IN FULL:
- `docs/handoffs/active/pickforus-icon-refresh-verification-1.md`
- `docs/handoffs/active/pickforus-icon-refresh-remediation-1.md`
- both icon-refresh continuation files
- relevant domain-readiness and TanStack verification handoffs

If verification/remediation reports are available, read them as supporting evidence.

## Mandatory preflight

Before any main ref update:

1. Fetch fresh refs.
2. Verify `origin/main` exactly equals:
   `551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`
3. Verify candidate branch equals:
   `4ba90f22a36409c4aa5d807f9c81257ba8884a7c`
4. Verify candidate tree exactly:
   `fd4374a52b6fc444be4747c17b0f90e76abfd373`
5. Verify sole parent exactly:
   `551c5f89...`
6. Verify candidate is exactly one commit ahead and zero behind.
7. Verify exact 28-path icon-only scope.
8. Verify exact candidate Preview remains READY and source SHA matches.
9. Verify current production remains READY on old main.
10. Verify no later candidate/source drift.
11. Verify explicit owner authorization is present.

If any immutable gate fails, stop without promotion.

## Promotion method

Preferred and required method:

Normal non-forced fast-forward of `main` to:

`4ba90f22a36409c4aa5d807f9c81257ba8884a7c`

Do not:
- squash
- rebase
- cherry-pick
- create merge commit
- force-push
- edit files during promotion

If safe fast-forward is not possible, stop.

## Production deployment expectation

The main update is expected to trigger automatic Vercel Production deployment.

Observe only the deployment sourced from exact promoted SHA.

Require:
- target = production
- source branch = main
- source SHA = `4ba90f22...`
- state / readyState = READY
- alias error absent
- `pickforus.app` continues serving
- `www.pickforus.app` continues redirecting to apex
- legacy Vercel URL continues serving

Do not manually redeploy if automatic deployment fails.

## Migration boundary

Do not run:
- `npm run build`
- `npm run db:migrate`

Production build must remain the known migration-free project command:

`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

## Production smoke

After exact production deployment is READY:

### Icon surfaces
Verify:
- `https://pickforus.app/favicon.png` loads
- `/apple-touch-icon.png` loads
- `/pwa-icon-512.png` loads
- `/pwa-icon-maskable-512.png` loads
- hosted hashes/bytes match candidate
- homepage head uses `/favicon.png`
- no live `/favicon.svg` reference
- manifest contains intended three PNG icon entries
- compatibility manifests match parsed public manifest

### Site continuity
Verify:
- `https://pickforus.app/` HTTPS works
- `www.pickforus.app` redirects to apex
- legacy Vercel URL still serves
- Settings / History / Favorites render
- Dinner discovery settles
- Date Night and Nightlife at least render and remain usable
- no fatal app error

### Android preservation
Verify repository state only:
- app ID unchanged
- runtime host unchanged
- SDK/version/signing state unchanged
- no Android build/sign/Play publication performed

No physical device install is required for this web production promotion.

## Browser favicon cache note

Browser chrome may continue showing a cached old favicon briefly.

Do not treat browser-chrome cache lag as a production failure when:
- live head points to new favicon
- direct new favicon bytes are correct
- fresh/private browser context shows new metadata where available

Do not add cache-busting URLs unless separately justified.

## Failure protocol

If production deployment fails or serious regression is observed:

1. STOP.
2. Record main SHA and deployment ID/state.
3. Do not change DNS.
4. Do not change Vercel settings.
5. Do not automatically rollback.
6. Report bounded recovery options.

Automatic rollback is not authorized.

## Success report

Report:
1. authorization basis
2. old main SHA
3. candidate SHA/tree/parent
4. promotion method
5. new main SHA
6. production deployment ID/source/state
7. icon asset/hash verification
8. manifest/head verification
9. canonical/www/legacy continuity
10. product smoke
11. Android preservation
12. favicon-cache limitations
13. no DNS/Play/auth/database actions
14. exact next bounded step

Final successful state:

`PICK FOR US ICON REFRESH MAIN PROMOTION VERIFIED — PRODUCTION HEALTHY`

Stop after production smoke/report.

Do not begin Android signing or Play publication automatically.
