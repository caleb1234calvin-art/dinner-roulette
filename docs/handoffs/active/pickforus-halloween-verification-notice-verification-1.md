# Pick For Us — Halloween Verification Notice Independent Verification 1

Repository:
`caleb1234calvin-art/dinner-roulette`

Verification branch:
`verify/pickforus-halloween-verification-notice-1`

Exact candidate:
`cf5e98d7fa6817f1fef4d67a182c518ea760bb79`

Expected tree:
`fd1d24383f88b763dc6c5ba97d920c0abeb566c3`

Expected sole parent:
`91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`

Frozen production main:
`91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`

Known candidate Preview:
`dpl_GHa7rFjXSYwdZokqn8TBY8fdUYkY`

Known Preview URL:
`https://dinner-roulette-ldjtlvh9n-minions-9e2c.vercel.app/`

Known Preview state:
`READY`

## Purpose

Independently verify the exact published Halloween verification-notice candidate.

This is verification only.

Do not modify the candidate.
Do not merge.
Do not deploy production.
Do not change DNS/Vercel settings.
Do not alter discovery/provider/catalog logic.
Do not change dependencies/auth/database/Android.

## Required reading

Read IN FULL:
- `docs/handoffs/active/pickforus-halloween-verification-notice-remediation-1.md`
- `docs/handoffs/active/pickforus-halloween-verification-notice-remediation-1-continuation.md`
- relevant seasonal discovery remediation/verification handoffs
- production loading/deadline verification
- TanStack security verification
- current `src/components/date-night-home.tsx`
- current `scripts/seasonal-discovery.test.mjs`

If the remediation reports/evidence are available, read them as supporting evidence but independently reproduce the critical checks.

## Starting gates

1. Fetch fresh refs.
2. Verify `origin/main` exactly:
   `91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`
3. Verify candidate branch exactly:
   `cf5e98d7fa6817f1fef4d67a182c518ea760bb79`
4. Verify candidate tree exactly:
   `fd1d24383f88b763dc6c5ba97d920c0abeb566c3`
5. Verify sole parent exactly:
   `91e1bc6b2...`
6. Verify candidate exactly one commit ahead, zero behind.
7. Verify exact changed paths:
   - `src/components/date-night-home.tsx`
   - `scripts/seasonal-discovery.test.mjs`
8. Establish clean isolated checkout pinned to candidate.
9. Do not modify tracked files.

If any immutable identity fails:

`PICK FOR US HALLOWEEN VERIFICATION NOTICE VERIFICATION — BLOCKED`

## Notice behavior to verify

Exact visible copy:

`Seasonal listings can change quickly. Double-check the location, dates, and hours before you go.`

Require:
- visible only when `halloweenActive === true`
- rendered inside the fixed Date Night action card
- below the match count
- above Pick our date / Give us options / Plan the night
- static semantic note, not alert/toast/modal
- not dismissible
- present during loading
- present after settlement
- independent of live / merged / fallback source state
- absent during ordinary Date Night
- absent in Dinner
- absent in Nightlife

## Existing fallback preservation

Exact existing fallback text must remain unchanged:

`Pick For Us is using saved seasonal anchors. Check each stop before you leave.`

Independently verify that in fallback Halloween state:
- original fallback disclosure remains visible
- new caution also remains visible
- neither replaces the other

## Action/control preservation

Halloween active:
- Pick our date visible and usable
- Give us options visible and usable
- Plan the night visible and usable

Ordinary Date Night:
- Pick our date remains
- Give us options remains
- Plan the night follows existing non-Halloween behavior
- new caution absent

No count, eligibility, selection weighting, or plan-membership behavior may change.

## Code-scope inspection

Independently inspect the candidate diff.

Require:
- app change is only the bounded note block in `DateNightHome`
- test changes only add bounded seasonal UI/regression coverage
- no provider/search/classification/catalog change
- no 20s server-budget change
- no 25s client-watchdog change
- no Dinner/Nightlife behavior change
- no dependencies/lockfile change
- no Android/auth/database/Vercel/DNS change

## Required tests

Run:

`node --test scripts/seasonal-discovery.test.mjs`

Expected remediation baseline:
- 24 passed
- 0 failed

Run:

`node --test scripts/discovery-provider-deadlines.test.mjs scripts/discovery-client-lifecycle.test.mjs`

Expected:
- 95 passed
- 0 failed

Also run relevant existing seasonal component harness tests if not already included.

Independently verify tests cover:
- Halloween live loading/settled
- Halloween merged loading/settled
- Halloween fallback loading/settled
- ordinary toggle-off
- ordinary outside-season
- Dinner/Nightlife absence
- fallback coexistence
- unchanged counts and deterministic Pick/Options/Plan membership

## Typecheck / lint / diff

Run:
- TypeScript noEmit
- bounded ESLint over changed TSX/test files
- `git diff --check`
- committed diff check against parent

Require pass.

## Migration-free build

Run exactly:

`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

Do NOT run ordinary `npm run build`.
Do NOT run database migrations.

## Preview identity

Read-only verify exact Preview:

`dpl_GHa7rFjXSYwdZokqn8TBY8fdUYkY`

Require:
- source branch = `fix/pickforus-halloween-verification-notice-candidate-1`
- source SHA = `cf5e98d7fa6817f1fef4d67a182c518ea760bb79`
- target = Preview / null
- state and readyState = READY
- alias error absent

Do not redeploy.

## Browser verification

Use a real browser on the exact immutable Preview.

### Mobile viewport 390×844
Verify:
- Halloween notice visible
- loading-state visibility if practically observable
- settled-state visibility
- no horizontal overflow
- sticky card fully usable
- primary buttons visible
- Plan the night visible
- bottom navigation does not cover controls

### Narrow mobile 320×568
If tooling supports it:
- same checks
- notice remains readable
- controls remain within viewport
- no horizontal overflow

### Source-state / fallback
Independently exercise or use deterministic existing hooks/fixtures to verify:
- fallback disclosure and new caution coexist
- no source-specific caution disappearance

### Ordinary mode
Verify:
- ordinary Date Night has no new caution
- ordinary controls still usable

### Actions
Exercise:
- Give us options
- Pick our date
- Plan the night

Do not require a complete pair if the existing dataset legitimately yields the existing incomplete-pair view; verify the action path itself still works and use deterministic tests for full pair construction.

### Navigation
Verify:
- Settings
- History
- Favorites

### Console
Require:
- no application page errors
- no application console errors/warnings
- distinguish extension/browser noise from app errors

## Production preservation

Verify:
- main still `91e1bc6...`
- production deployment still the pre-candidate healthy production
- no candidate production deployment exists
- no DNS/domain/Vercel settings changes
- no Android signing/Play action
- no auth/database migration

## Reports

Produce:

`audit/pickforus-halloween-verification-notice-verification-1-2026-10-02.md`

`audit/pickforus-halloween-verification-notice-verification-1-2026-10-02.json`

plus bounded evidence if useful.

Report:
1. immutable identities
2. exact two-file scope
3. exact notice copy/condition/placement
4. fallback disclosure preservation
5. ordinary/Halloween/source-state proof
6. action/control preservation
7. seasonal test totals
8. deadline/watchdog test totals
9. typecheck/lint/diff
10. migration-free build
11. Preview ID/source/state
12. 390×844 verification
13. 320×568 verification if available
14. navigation/browser/console verification
15. no provider/catalog/logic change
16. production preservation
17. warnings/limitations
18. exact next bounded step

## Final state

End with exactly one:

`PICK FOR US HALLOWEEN VERIFICATION NOTICE CANDIDATE VERIFIED — READY FOR CONTROLLED PROMOTION`

or

`PICK FOR US HALLOWEEN VERIFICATION NOTICE VERIFICATION — FAILED`

or

`PICK FOR US HALLOWEEN VERIFICATION NOTICE VERIFICATION — BLOCKED`

Do not merge.
Do not deploy production.
Stop after independent verification.
