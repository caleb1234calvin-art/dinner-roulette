# Pick For Us — Halloween Verification Notice V-HVN-01 Independent Reverification 1

Repository:
`caleb1234calvin-art/dinner-roulette`

Verification branch:
`verify/pickforus-halloween-verification-notice-v-hvn-01-1`

Exact remediation candidate:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Expected remediation tree:
`4f39061bc32e3b362232907191efaf0f3d1715ce`

Expected sole parent:
`cf5e98d7fa6817f1fef4d67a182c518ea760bb79`

Parent candidate tree:
`fd1d24383f88b763dc6c5ba97d920c0abeb566c3`

Frozen production main:
`91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`

Required ancestry chain:
`91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`
→ `cf5e98d7fa6817f1fef4d67a182c518ea760bb79`
→ `4d937e58d2a65567b54ac5271915bc85b498898b`

Known remediation Preview:
`dpl_HuAShuhbRTYWGqjnrozEdGZbr7yK`

Known Preview URL:
`https://dinner-roulette-gk0ns4vbz-minions-9e2c.vercel.app/`

Known Preview state:
`READY`

## Purpose

Independently reverify the exact V-HVN-01 remediation and the complete final Halloween verification-notice candidate chain after the prior verification failure at 320×568.

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
- `docs/handoffs/active/pickforus-halloween-verification-notice-verification-1.md`
- `docs/handoffs/active/pickforus-halloween-verification-notice-v-hvn-01-remediation-1.md`
- `docs/handoffs/active/pickforus-halloween-verification-notice-v-hvn-01-remediation-1-continuation.md`
- relevant production loading/deadline verification
- relevant TanStack security verification

If remediation reports/evidence are available, read them as supporting evidence but independently reproduce critical checks.

## Starting gates

1. Fetch fresh refs.
2. Verify `origin/main` exactly:
   `91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`
3. Verify failed notice candidate exactly:
   `cf5e98d7fa6817f1fef4d67a182c518ea760bb79`
4. Verify remediation candidate exactly:
   `4d937e58d2a65567b54ac5271915bc85b498898b`
5. Verify remediation tree exactly:
   `4f39061bc32e3b362232907191efaf0f3d1715ce`
6. Verify sole parent exactly:
   `cf5e98d7fa6817f1fef4d67a182c518ea760bb79`
7. Verify chain:
   - `cf5e98d7...` sole parent = `91e1bc6...`
   - `4d937e58...` sole parent = `cf5e98d7...`
8. Verify remediation exactly one commit ahead / zero behind parent.
9. Verify remediation changed path exactly:
   - `src/components/date-night-home.tsx`
10. Verify full final chain vs production changes only:
   - `src/components/date-night-home.tsx`
   - `scripts/seasonal-discovery.test.mjs`
11. Establish clean isolated checkout pinned to remediation candidate.
12. Do not modify tracked files.

If immutable identity fails:

`PICK FOR US HALLOWEEN VERIFICATION NOTICE V-HVN-01 REVERIFICATION — BLOCKED`

## Exact remediation content

Independently verify that the ONLY remediation change versus parent `cf5e98d7...` is:

Before:
`<main className="px-4 pb-48 pt-5">`

After:
`<main className={cn("px-4 pt-5", halloweenActive ? "pb-56" : "pb-48")}>`

Require:
- Halloween Date Night bottom padding increases to `pb-56`
- ordinary Date Night stays `pb-48`
- no copy, control, source, eligibility, weighting, provider, catalog, deadline or watchdog change

## Notice/fallback preservation

Exact caution must remain:

`Seasonal listings can change quickly. Double-check the location, dates, and hours before you go.`

Require:
- `role="note"`
- Halloween-only
- loading + settled
- source-state independent
- absent ordinary Date Night
- absent Dinner/Nightlife

Exact fallback must remain:

`Pick For Us is using saved seasonal anchors. Check each stop before you leave.`

Require:
- exact text unchanged
- fallback + caution coexist

## Primary V-HVN-01 geometry gate

This is the central independent reverification requirement.

Use a REAL browser against the exact immutable Preview.

### 320×568

Reproduce fallback Halloween state comparable to the prior failing scenario:
- Date Night
- Spooky Season/Halloween active
- fallback source state
- configuration that displays exact fallback disclosure
- scroll to TRUE document maximum

Capture:
- viewport
- document height
- scrollY
- maxScroll
- fallback paragraph bounds
- fixed action-card bounds
- caution bounds
- bottom-nav bounds
- horizontal scroll metrics

Require:

1. `scrollY === maxScroll` within normal integer/browser precision.
2. Full exact fallback sentence is visible.
3. Every fallback word is unobscured.
4. Full caution is visible.
5. Every caution word is unobscured.
6. `fallbackBottom <= actionCardTop`.
7. Require at least **8px positive clearance**:
   `actionCardTop - fallbackBottom >= 8`
8. Pick our date fully visible/usable.
9. Give us options fully visible/usable.
10. Plan the night fully visible/usable.
11. Bottom navigation does not obscure card/actions.
12. No horizontal overflow.

Expected remediation observation is roughly 22.22px clearance, but do not pass by matching that number; independently measure and require >=8px.

### 390×844

Repeat the same fallback/max-scroll geometry checks.

Require:
- positive clearance >=8px
- all text and controls unobscured
- no horizontal overflow

Expected remediation observation is roughly 41.67px, but independently measure.

## Ordinary Date Night spacing

At both mobile widths:
- turn Spooky Season off / ordinary Date Night
- caution absent
- computed bottom padding remains equivalent to `pb-48` (192px under tested root sizing)
- no Halloween-only extra spacing leaks into ordinary mode
- no horizontal overflow

## Actions

Exercise on exact Preview:
- Pick our date
- Give us options
- Plan the night

Do not fail merely because a legitimate dataset yields the existing incomplete-pair Plan view. Verify action functionality; complete pair logic remains covered by component tests.

## Required tests

Run:

`node --test scripts/seasonal-discovery.test.mjs`

Require:
- 24 passed
- 0 failed

Run:

`node --test scripts/discovery-provider-deadlines.test.mjs scripts/discovery-client-lifecycle.test.mjs`

Require:
- 95 passed
- 0 failed

Total:
- 119 passed
- 0 failed

## Typecheck / lint / diff

Run:
- TypeScript noEmit
- bounded ESLint over relevant changed source/test files
- `git diff --check`
- remediation parent diff check
- full final-chain diff check against production

Require pass.

## Migration-free build

Run exactly:

`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

Do NOT run ordinary `npm run build`.
Do NOT run DB migrations.

## Preview identity

Read-only verify:

`dpl_HuAShuhbRTYWGqjnrozEdGZbr7yK`

Require:
- source branch = `fix/pickforus-halloween-verification-notice-v-hvn-01-candidate-1`
- source SHA = `4d937e58d2a65567b54ac5271915bc85b498898b`
- target = Preview / null
- state/readyState = READY
- alias error absent

Do not redeploy.

## Navigation / console

On exact Preview verify:
- Settings
- History
- Favorites

Require:
- no application page errors
- no application console errors/warnings
- distinguish browser/extension noise from app errors

## Production preservation

Verify:
- main remains `91e1bc6...`
- production deployment remains the current healthy pre-candidate deployment
- no candidate production deployment
- no DNS/domain/Vercel settings changes
- no Android signing/Play
- no auth/database migration

## Reports

Produce:

`audit/pickforus-halloween-verification-notice-v-hvn-01-verification-1-2026-10-02.md`

`audit/pickforus-halloween-verification-notice-v-hvn-01-verification-1-2026-10-02.json`

plus bounded evidence/screenshots.

Report:
1. immutable main/parent/candidate identities
2. exact ancestry chain
3. exact one-line remediation
4. full final-chain path scope
5. exact caution/fallback preservation
6. 320×568 independent geometry
7. 390×844 independent geometry
8. max-scroll proof
9. word-level unobscured proof
10. ordinary Date Night padding proof
11. action behavior
12. 119 test results
13. typecheck/lint/diff
14. migration-free build
15. Preview identity/state
16. navigation/console
17. no provider/catalog/deadline/watchdog change
18. production preservation
19. warnings/limitations
20. exact next bounded step

## Final state

End with exactly one:

`PICK FOR US HALLOWEEN VERIFICATION NOTICE V-HVN-01 VERIFIED — READY FOR CONTROLLED PROMOTION`

or

`PICK FOR US HALLOWEEN VERIFICATION NOTICE V-HVN-01 REVERIFICATION — FAILED`

or

`PICK FOR US HALLOWEEN VERIFICATION NOTICE V-HVN-01 REVERIFICATION — BLOCKED`

Do not merge.
Do not deploy production.
Stop after independent reverification.
