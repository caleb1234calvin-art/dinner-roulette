# Pick For Us — Halloween Verification Notice V-HVN-01 Remediation 1

Repository:
`caleb1234calvin-art/dinner-roulette`

Instruction branch:
`fix/pickforus-halloween-verification-notice-v-hvn-01-remediation-1`

Implementation branch:
`fix/pickforus-halloween-verification-notice-v-hvn-01-candidate-1`

Failed verified candidate:
`cf5e98d7fa6817f1fef4d67a182c518ea760bb79`

Failed candidate tree:
`fd1d24383f88b763dc6c5ba97d920c0abeb566c3`

Failed candidate sole parent / production main:
`91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`

Production remains:
`91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`

## Trigger

Independent verification found exactly one blocking defect, **V-HVN-01**.

At viewport **320×568**, in Halloween Date Night fallback state, the taller fixed action card overlaps the final words of the existing fallback disclosure at maximum scroll.

Exact preserved fallback disclosure:

`Pick For Us is using saved seasonal anchors. Check each stop before you leave.`

The source/DOM text is intact, but the words:

`you leave.`

are visually obscured by the fixed action card.

Measured verification geometry:
- max scroll reached
- fallback paragraph bottom: approximately `263.28125px`
- fixed action-card top: approximately `253.5px`
- overlap: approximately `9.78125px`

The new caution, controls, notice semantics, 390×844 layout, actions, tests, build, identity, Preview, navigation and console checks all passed.

This is a **layout-clearance remediation only**.

## Authoritative prior reading

Read IN FULL:
- `docs/handoffs/active/pickforus-halloween-verification-notice-remediation-1.md`
- `docs/handoffs/active/pickforus-halloween-verification-notice-remediation-1-continuation.md`
- `docs/handoffs/active/pickforus-halloween-verification-notice-verification-1.md`

Treat V-HVN-01 as the only authorized product defect to fix.

## Goal

Ensure enough bottom scroll clearance exists for the taller Halloween fixed action card so all content immediately above it, including the full fallback disclosure, can be completely scrolled into view at narrow mobile sizes.

The required outcome at **320×568**:

- maximum scroll reveals the full fallback sentence
- no word is covered by the fixed action card
- the new caution remains fully readable
- Pick our date remains fully visible/usable
- Give us options remains fully visible/usable
- Plan the night remains fully visible/usable
- bottom navigation does not obscure the action card
- no horizontal overflow

## Preferred implementation shape

Prefer the smallest possible change.

The current Date Night page uses fixed bottom padding that was sufficient before the taller Halloween action card existed.

Prefer a **Halloween-only increase in bottom scroll padding/clearance** on the Date Night page rather than:
- shrinking text
- moving the fixed card over other content
- hiding/truncating disclosures
- changing fallback copy
- changing notice copy
- making the card dismissible
- globally increasing ordinary Date Night spacing unnecessarily

Use the existing `halloweenActive` state and existing `cn` utility if appropriate.

The exact Tailwind spacing token is NOT prescribed. Determine the smallest stable clearance that passes browser geometry at 320×568 and 390×844 with a reasonable safety margin.

Do not use brittle pixel offsets tied to one exact paragraph height if a semantic layout/padding solution is available.

## Required preserved behavior

Exact new caution remains:

`Seasonal listings can change quickly. Double-check the location, dates, and hours before you go.`

Preserve:
- `role="note"`
- Halloween-only rendering
- loading + settled visibility
- live/merged/fallback independence
- ordinary Date Night absence
- Dinner/Nightlife absence
- existing fallback sentence unchanged
- existing coverage disclosure behavior
- match counts
- eligible pools
- weighting
- pick/options behavior
- plan behavior
- 20-second server provider budget
- 25-second client watchdog

## Scope

Expected application path:
- `src/components/date-night-home.tsx`

Test/evidence paths may include:
- `scripts/seasonal-discovery.test.mjs`
- a bounded browser/layout regression script using existing browser tooling
- audit evidence/report files outside the candidate commit

Do NOT modify:
- providers/search/classification
- seasonal catalog
- availability/lifecycle logic
- source semantics
- Dinner
- Nightlife
- dependencies/package lock
- Android
- auth/database
- Vercel/DNS
- icons/social assets

## Required browser regression

The prior component/harness tests could verify text presence but did not catch CSS occlusion.

Add or produce a **real-browser maximum-scroll regression** that actually detects overlap.

At minimum, on the exact built candidate:

### 320×568 fallback case
Use the same effective state as the verifier:
- Date Night
- Halloween / Spooky Season active
- fallback source state
- a configuration that renders the exact existing fallback disclosure
- scroll to true document maximum

Require geometry such that:

`fallback disclosure bottom <= fixed action-card top`

Prefer an explicit positive clearance margin (for example >= 8px) rather than merely zero overlap.

Also verify word-level/content hit testing or equivalent if practical so the final words are actually readable, not only geometrically close.

Capture:
- viewport
- scrollY / maxScroll
- paragraph bounds
- fixed-card bounds
- overlap/clearance
- screenshot

### 390×844
Repeat the fallback coexistence/layout check.

Require no regression.

### Ordinary Date Night
Verify ordinary page does not receive unintended excessive bottom whitespace if the fix is intended to be Halloween-only.

## Required tests

Run again:

`node --test scripts/seasonal-discovery.test.mjs`

Expected baseline:
- 24 passed
- 0 failed

Run:

`node --test scripts/discovery-provider-deadlines.test.mjs scripts/discovery-client-lifecycle.test.mjs`

Expected:
- 95 passed
- 0 failed

If a new browser/layout regression script is added, run it against a fresh migration-free production build and record exact results.

## Typecheck / lint / diff

Run:
- TypeScript noEmit
- bounded ESLint over changed source/test scripts
- `git diff --check`
- parent diff check

## Migration-free build

Run exactly:

`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

Do NOT run ordinary `npm run build`.
Do NOT run migrations.

## Candidate identity

The remediation candidate must be based directly on the failed published candidate:

Parent:
`cf5e98d7fa6817f1fef4d67a182c518ea760bb79`

Do not rebuild the original feature from production main.

This keeps:
- original notice commit intact
- V-HVN-01 fix as one bounded follow-up commit

If normal Git push works, push non-forced.

If Git credentials are unavailable:
- STOP before connector publication unless a separate continuation explicitly authorizes exact-tree transport.

Do not silently use connector transport without that continuation.

## Preview acceptance

After publication:
- require Git-linked Preview
- require source SHA = remediation candidate
- require READY
- require Preview target/null
- no alias error

Then verify exact Preview at:
- 390×844
- 320×568

At 320×568, independently prove:
- full fallback sentence visible at max scroll
- new caution visible
- controls usable
- no overlap
- no horizontal overflow
- navigation not covering controls

Also exercise:
- Pick our date
- Give us options
- Plan the night
- Settings
- History
- Favorites

Require no application console/page errors.

## Reports

Produce:

`audit/pickforus-halloween-verification-notice-v-hvn-01-remediation-1-2026-10-02.md`

`audit/pickforus-halloween-verification-notice-v-hvn-01-remediation-1-2026-10-02.json`

plus bounded evidence.

Report:
1. parent/candidate identity
2. exact layout change
3. before/after geometry
4. 320×568 max-scroll proof
5. 390×844 proof
6. ordinary Date Night spacing check
7. exact notice/fallback preservation
8. action behavior
9. 24 seasonal tests
10. 95 deadline/watchdog tests
11. typecheck/lint/diff
12. migration-free build
13. candidate SHA/tree/parent
14. Preview ID/source/state
15. browser/console/navigation
16. production unchanged
17. exact next bounded step

## Boundaries

Do not:
- merge main
- deploy production
- change Vercel/DNS
- alter providers/catalogs
- broaden feature scope
- change copy
- publish Android
- change dependencies/auth/database

## Final state

End with exactly one:

`PICK FOR US HALLOWEEN VERIFICATION NOTICE V-HVN-01 — CANDIDATE READY FOR INDEPENDENT REVERIFICATION`

or

`PICK FOR US HALLOWEEN VERIFICATION NOTICE V-HVN-01 — FAILED`

or

`PICK FOR US HALLOWEEN VERIFICATION NOTICE V-HVN-01 — BLOCKED`

Stop after remediation candidate/Preview/browser/report production.
