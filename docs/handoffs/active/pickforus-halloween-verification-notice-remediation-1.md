# Pick For Us — Halloween Verification Notice Remediation 1

Repository:
`caleb1234calvin-art/dinner-roulette`

Instruction branch:
`fix/pickforus-halloween-verification-notice-1`

Implementation branch:
`fix/pickforus-halloween-verification-notice-candidate-1`

Exact base / current production main:
`91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`

Expected base tree:
`af40c61514d131d4977b990d2372aa5397e21c6c`

## User request

Add a Halloween-only caution near the primary decision controls so people are reminded to verify seasonal locations before acting on a Pick For Us / Give Us Options result.

The user specifically wants a notification around the seasonal action area stating that people should double-check locations.

## Exact product behavior

When Halloween Date Night mode is active (the same `halloweenActive` condition already used by `DateNightHome`):

Show a compact persistent caution INSIDE the sticky action card that contains:
- Pick our date
- Give us options
- Plan the night

The notice should appear above the action buttons and below/around the existing match count in a way that is visible without blocking controls.

Use this exact visible copy unless a tiny grammatical adjustment is required for accessibility:

**Seasonal listings can change quickly. Double-check the location, dates, and hours before you go.**

The notice should be:
- visible whenever `halloweenActive === true`
- independent of source state (live / merged / fallback)
- visible whether discovery is loading, settled, or using saved-only fallback
- absent during ordinary non-Halloween Date Night
- not shown in Dinner or Nightlife
- not dismissible
- not modal
- not a toast
- not alarming/red-error styling
- visually consistent with the Halloween palette / existing sticky action card
- compact enough that the sticky action area remains usable on mobile

Do NOT replace or remove the existing fallback disclosure:
`Pick For Us is using saved seasonal anchors. Check each stop before you leave.`

That disclosure is source-state-specific. The new notice is an always-on Halloween decision reminder.

## Accessibility

Prefer semantic static content such as:
- `role="note"` or equivalent accessible text container

Do not use `role="alert"`; this is not an urgent runtime failure and should not repeatedly interrupt screen readers.

The full caution text must be available to assistive technology.

Maintain sufficient contrast in dark mode and Halloween theme.

## Scope

Expected implementation scope should be extremely small.

Primary path:
- `src/components/date-night-home.tsx`

Test path(s) as necessary:
- `scripts/seasonal-discovery.test.mjs`
- existing component harness tests or another existing seasonal UI regression suite

Do not modify:
- discovery providers
- classification
- seasonal catalog
- Overture/OSM research
- source orchestration
- provider deadlines
- 20s server budget
- 25s client watchdog
- eligibility rules
- pick weighting
- saved/live/fallback semantics
- Date Night plan logic
- Dinner
- Nightlife
- favicon/social assets
- Android
- auth/database
- dependencies
- Vercel/DNS

## Required regression behavior

Add a regression test that proves:

1. Halloween Date Night active:
   - exact caution text renders
   - Pick our date still renders
   - Give us options still renders
   - Plan the night still renders

2. Ordinary Date Night:
   - caution text is absent
   - Pick our date / Give us options remain available

3. Fallback Halloween state:
   - existing source-specific fallback disclosure remains
   - new decision caution also remains
   - neither replaces the other

4. No change to eligible counts or selection behavior.

Use existing component test/harness infrastructure where practical rather than creating an unrelated test framework.

## Validation

Run at minimum:

`node --test scripts/seasonal-discovery.test.mjs`

and the relevant component-harness/UI regression suites used by the current seasonal remediation.

Also run:

`node --test scripts/discovery-provider-deadlines.test.mjs scripts/discovery-client-lifecycle.test.mjs`

Require all timing/deadline tests to remain unchanged/pass.

Run:
- TypeScript noEmit
- bounded ESLint over changed TSX/test files
- `git diff --check`

Run exact migration-free build:

`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

Do NOT run ordinary `npm run build` if it invokes migrations.

## Built/browser verification

Verify fresh built output and Preview:

- Halloween Date Night shows the notice near the action controls
- ordinary Date Night does not show it
- notice text remains visible at narrow/mobile viewport
- sticky controls are not pushed offscreen or obscured
- Pick our date works
- Give us options works
- Plan the night works
- Settings/History/Favorites still navigate
- no application console errors
- source disclosure behavior remains correct

Use a mobile-sized viewport in browser verification if available.

## Candidate publication

If all local gates pass:

1. Commit only the bounded change on:
   `fix/pickforus-halloween-verification-notice-candidate-1`
2. Candidate sole parent must remain exact base:
   `91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`
3. Push normally, non-forced.
4. Allow Git-linked Vercel Preview.
5. Require Preview READY.
6. Perform bounded browser verification.

If normal Git push is unavailable and exact-tree connector transport is needed, STOP and report the tested tree/parent rather than silently broadening transport authority. A continuation can authorize exact-tree publication separately.

## Reports

Produce:

`audit/pickforus-halloween-verification-notice-remediation-1-2026-10-02.md`

`audit/pickforus-halloween-verification-notice-remediation-1-2026-10-02.json`

plus bounded evidence/screenshots if useful.

Report:
1. exact base identity
2. exact changed paths
3. exact notice copy
4. rendering condition
5. fallback disclosure preservation
6. seasonal/nonseasonal regression proof
7. test results
8. deadline/watchdog preservation
9. typecheck/lint/build
10. mobile/browser verification
11. candidate SHA/tree/parent
12. Preview ID/source/state
13. production unchanged
14. exact next bounded step

## Boundaries

Do not:
- merge main
- deploy production
- change DNS/Vercel settings
- change seasonal discovery architecture
- add venues
- modify catalogs
- sign/publish Android
- change auth/database
- change dependencies

## Final state

End with exactly one:

`PICK FOR US HALLOWEEN VERIFICATION NOTICE — CANDIDATE READY FOR INDEPENDENT VERIFICATION`

or

`PICK FOR US HALLOWEEN VERIFICATION NOTICE — FAILED`

or

`PICK FOR US HALLOWEEN VERIFICATION NOTICE — BLOCKED`

Stop after candidate/Preview/report production.
