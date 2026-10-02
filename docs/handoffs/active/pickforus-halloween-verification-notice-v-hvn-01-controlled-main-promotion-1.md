# Pick For Us — Halloween Verification Notice V-HVN-01 Controlled Main Promotion 1

Repository:
`caleb1234calvin-art/dinner-roulette`

Promotion-control branch:
`promote/pickforus-halloween-verification-notice-v-hvn-01-1`

Target:
`main`

## Exact verified chain

Production base:
`91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`

Original notice candidate:
`cf5e98d7fa6817f1fef4d67a182c518ea760bb79`

Final V-HVN-01 remediation candidate:
`4d937e58d2a65567b54ac5271915bc85b498898b`

Final tree:
`4f39061bc32e3b362232907191efaf0f3d1715ce`

Required ancestry:
`91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`
→ `cf5e98d7fa6817f1fef4d67a182c518ea760bb79`
→ `4d937e58d2a65567b54ac5271915bc85b498898b`

Independent reverification final state:

`PICK FOR US HALLOWEEN VERIFICATION NOTICE V-HVN-01 VERIFIED — READY FOR CONTROLLED PROMOTION`

Known final Preview:
`dpl_HuAShuhbRTYWGqjnrozEdGZbr7yK`

Known Preview state:
`READY`

## Final production diff

Versus production base, exactly these tracked paths differ:
- `src/components/date-night-home.tsx`
- `scripts/seasonal-discovery.test.mjs`

No other tracked path may differ.

## Verified product behavior

Halloween Date Night shows:

`Seasonal listings can change quickly. Double-check the location, dates, and hours before you go.`

Requirements already independently verified:
- role=note
- Halloween-only
- visible during loading and settlement
- visible in live / merged / fallback source states
- absent ordinary Date Night
- absent Dinner/Nightlife
- existing fallback disclosure preserved:
  `Pick For Us is using saved seasonal anchors. Check each stop before you leave.`
- fallback + caution coexist
- Pick our date works
- Give us options works
- Plan the night works
- 320×568 max-scroll clearance = 22.21875px
- 390×844 max-scroll clearance = 41.671875px
- no horizontal overflow
- ordinary Date Night preserves pb-48 spacing
- no provider/search/catalog/eligibility/weighting/deadline/watchdog change

## Owner authorization gate

THIS HANDOFF DOES NOT BY ITSELF AUTHORIZE MOVING MAIN.

Before promotion, obtain explicit owner authorization.

If absent, stop:

`PICK FOR US HALLOWEEN VERIFICATION NOTICE PROMOTION — OWNER AUTHORIZATION REQUIRED`

## Mandatory preflight

Before changing main:

1. Fetch fresh refs.
2. Verify main exactly:
   `91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`
3. Verify original notice candidate exactly:
   `cf5e98d7fa6817f1fef4d67a182c518ea760bb79`
4. Verify final candidate exactly:
   `4d937e58d2a65567b54ac5271915bc85b498898b`
5. Verify final tree exactly:
   `4f39061bc32e3b362232907191efaf0f3d1715ce`
6. Verify exact ancestry chain.
7. Verify final candidate exactly two commits ahead / zero behind main.
8. Verify full diff exactly two paths.
9. Verify exact final Preview remains READY and sourced from final candidate SHA.
10. Verify current production remains READY on `91e1bc6...`.
11. Verify explicit owner authorization is present.

If any gate fails, stop without promotion.

## Promotion method

Use only a normal non-forced fast-forward of `main` from:

`91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`

to:

`4d937e58d2a65567b54ac5271915bc85b498898b`

Preserve both commits exactly.

Do NOT:
- squash
- rebase
- cherry-pick
- create a merge commit
- force-push
- edit files during promotion

## Expected production deployment

Allow the automatic Vercel Production deployment triggered by the main update.

Require:
- target = production
- source branch = main
- source SHA = `4d937e58...`
- state / readyState = READY
- alias error absent
- `pickforus.app` attached
- `www.pickforus.app` redirect preserved
- legacy `dinner-roulette-chi.vercel.app` still serves

Do not manually redeploy if automatic production deployment fails.

## Production smoke

After READY:

### Halloween Date Night
Verify:
- exact caution visible
- role=note semantics preserved
- exact fallback disclosure preserved
- fallback + caution coexist
- Pick our date works
- Give us options works
- Plan the night works

### 320×568
Reproduce fallback/max-scroll case:
- true max scroll reached
- all fallback words visible
- all caution words visible
- clearance >= 8px
- no horizontal overflow
- controls unobscured
- bottom nav does not cover action card

### 390×844
Repeat layout acceptance:
- clearance >= 8px
- no overlap
- no horizontal overflow

### Ordinary Date Night
Verify:
- caution absent
- ordinary spacing remains pb-48-equivalent
- no unintended large bottom gap

### Navigation
Verify:
- Settings
- History
- Favorites

### Console
Require:
- no application page errors
- no application console errors/warnings

## Regression preservation

Verify no change to:
- provider/search/classification
- seasonal catalog
- lifecycle/availability
- eligible counts
- selection weighting
- plan logic
- 20-second server provider budget
- 25-second client watchdog
- Dinner
- Nightlife
- Android
- auth/database
- dependencies
- DNS/Vercel settings

## No automatic rollback

If a serious regression occurs:
- stop
- report exact production SHA/deployment/state
- do NOT automatically rollback

## Final state

On success:

`PICK FOR US HALLOWEEN VERIFICATION NOTICE MAIN PROMOTION VERIFIED — PRODUCTION HEALTHY`

Stop after production smoke.
