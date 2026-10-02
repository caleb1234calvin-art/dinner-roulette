# Pick For Us — Social Preview Card Independent Verification 1

Repository:
`caleb1234calvin-art/dinner-roulette`

Verification branch:
`verify/pickforus-social-card-refresh-1`

Exact candidate:
`91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`

Expected tree:
`af40c61514d131d4977b990d2372aa5397e21c6c`

Expected sole parent:
`4ba90f22a36409c4aa5d807f9c81257ba8884a7c`

Frozen production main:
`4ba90f22a36409c4aa5d807f9c81257ba8884a7c`

Known candidate Preview:
`dpl_91aHGYRYk1ZwbiPKKWUw9f9H8S6r`

Known Preview URL:
`https://dinner-roulette-instiwka5-minions-9e2c.vercel.app/`

Known Preview state:
`READY`

## Purpose

Independently verify the exact published social-preview-card candidate.

Verification only.

Do not modify the candidate.
Do not regenerate artwork.
Do not merge.
Do not deploy production.
Do not change DNS/domains.
Do not change favicon/PWA/Android icon assets.
Do not change auth/database/dependencies.

## Required reading

Read IN FULL:
- `docs/handoffs/active/pickforus-social-card-refresh-remediation-1.md`
- relevant icon-refresh verification/promotion handoffs
- domain-readiness verification
- TanStack security verification

If remediation reports/evidence are available, read them as supporting evidence but independently reproduce critical checks.

## Starting gates

1. Fetch fresh refs.
2. Verify `origin/main` exactly:
   `4ba90f22a36409c4aa5d807f9c81257ba8884a7c`
3. Verify candidate branch exactly:
   `91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`
4. Verify candidate tree exactly:
   `af40c61514d131d4977b990d2372aa5397e21c6c`
5. Verify sole parent exactly:
   `4ba90f22...`
6. Verify candidate one commit ahead / zero behind.
7. Verify exact changed paths:
   - `public/og.jpg`
   - `scripts/social-card-refresh.py`
8. Establish clean isolated checkout pinned to candidate.
9. Do not modify tracked files.

If identity fails:

`PICK FOR US SOCIAL CARD REFRESH VERIFICATION — BLOCKED`

## Source / artwork verification

Approved master:
`public/brand/pick-for-us-icon-master.jpg`

Expected:
- JPEG
- 1536×1536
- RGB
- 494490 bytes
- SHA-256:
  `12afcedace4aacb19109e561fc70af76076ece7d4997348021422a9396e865d5`

Verify no generated/redrawn/retouched artwork was introduced.

## Old/new OG asset verification

Base/production old OG:
- 1200×630 RGB JPEG
- 132383 bytes
- SHA-256:
  `40adc5359070c1ba6676bb81eb51fecd37bef0b6f4f7b4b9dac713fb663bf6c7`

Candidate new OG:
- 1200×630 RGB JPEG
- 108152 bytes
- SHA-256:
  `ab64b705321a7f01e094663c63df3f06c7284ff3a104d0ef028ba23e81984813`

Verify:
- no old pizza/food image remains visible
- complete clay artwork retained
- black card background
- visible `Pick For Us`
- visible `pickforus.app`
- output <= 600 KiB
- exact dimensions/format/hash

## Deterministic script verification

Review:

`scripts/social-card-refresh.py`

Independently confirm:
- only approved local artwork is used
- no remote image/font/service dependency
- full master uniformly resized to 520×520
- art placed at (55,55)
- black 1200×630 RGB canvas
- title/domain reproduced deterministically
- JPEG quality/settings documented and deterministic
- no crop/retouch/restyle/synthesis
- `--check` reproduces/validates exact committed card

Run:
`python scripts/social-card-refresh.py --check`

## x-banner discrepancy

Independently verify:
- `public/x-banner.jpg` is absent in base and candidate
- live production `/x-banner.jpg` is/was absent or 404
- no banner was added
- no stale tracked X banner exists to refresh

Do not fail merely because documentation/source code supports an optional x-banner path.

## Regression / brand checks

Run relevant checks, including:

`node scripts/brand-check.mjs`

and:
- `scripts/brand-check.test.mjs`
- `scripts/grok-pwa-plugin.test.mjs`
- `scripts/domain-readiness.test.mjs`
- `scripts/tanstack-security.test.mjs`
- `scripts/android-release.test.mjs`
- `scripts/discovery-provider-deadlines.test.mjs`
- `scripts/discovery-client-lifecycle.test.mjs`
- `scripts/with-app-env.test.mjs`
- `scripts/icon-refresh.test.mjs`

Expected remediation result:
- 220 passed
- 0 failed
- 3 skips only if they are the documented external OG-documentation-package skips

Also run:
- `node scripts/check-android.mjs`
- `python scripts/android-icons.py --check`
- `python scripts/icon-refresh.test.py`

No icon/resource drift.

## Typecheck / lint / diff

Run:
- TypeScript noEmit
- bounded ESLint over relevant changed/preservation JS/MJS/TS files
- `git diff --check`

Require pass.

## Migration-free build

Run exactly:

`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

Do NOT run ordinary `npm run build`.
Do NOT run DB migrations.

## Built-output verification

Independently verify:
- built `og.jpg` equals committed candidate bytes
- `og:image` remains `https://pickforus.app/og.jpg`
- `twitter:image` remains `https://pickforus.app/og.jpg`
- canonical/title/description/robots unchanged
- favicon/PWA/icon assets unchanged
- x-banner absent in source/output

## Preview verification

Read-only verify:

`dpl_91aHGYRYk1ZwbiPKKWUw9f9H8S6r`

Require:
- source branch `fix/pickforus-social-card-refresh-candidate-1`
- source SHA `91e1bc6...`
- target Preview
- READY
- alias error absent

Do not redeploy.

## Hosted candidate asset

Against exact immutable Preview:
- fetch `/og.jpg`
- require HTTP 200
- JPEG
- 1200×630
- 108152 bytes
- SHA-256 `ab64b705...`
- byte-identical to committed candidate

Verify browser rendering shows:
- full clay artwork
- Pick For Us
- pickforus.app
- no old pizza/food imagery

## Metadata caveat

Preview HTML intentionally advertises canonical production URL and:

`https://pickforus.app/og.jpg`

That currently points to the unchanged production asset until promotion.

Do NOT treat that as failure.

Verify that the metadata path itself remains correct and unchanged. Candidate artwork is proven through direct Preview `/og.jpg` bytes.

## Browser smoke

Use real browser on exact Preview:
- homepage hydrates
- Dinner discovery settles
- Settings renders
- History renders
- Favorites renders
- no application console errors/warnings

Separate extension/browser noise from application errors.

## Production preservation

Verify:
- main remains `4ba90f22...`
- production deployment remains `dpl_DeTXj3Yqg2VULhdRAXuBHC1hjMAb`
- live production `/og.jpg` still has old SHA before promotion
- no production deploy from this candidate
- no DNS/domain/auth/database/Android signing action

## Reports

Produce:

`audit/pickforus-social-card-refresh-verification-1-2026-10-02.md`

`audit/pickforus-social-card-refresh-verification-1-2026-10-02.json`

plus bounded evidence.

Report:
1. immutable identities
2. exact two-path scope
3. approved master identity
4. old/new OG asset hashes
5. deterministic composition verification
6. x-banner absence verification
7. brand/regression tests
8. Android/icon preservation
9. typecheck/lint/diff
10. migration-free build
11. built-output metadata
12. Preview identity/state
13. hosted OG byte verification
14. browser smoke
15. no-generation/no-retouch proof
16. production preservation
17. cache limitations
18. warnings/limitations
19. final repo state
20. exact next bounded step

## Final state

End with exactly one:

`PICK FOR US SOCIAL CARD REFRESH CANDIDATE VERIFIED — READY FOR CONTROLLED PROMOTION`

or

`PICK FOR US SOCIAL CARD REFRESH VERIFICATION — FAILED`

or

`PICK FOR US SOCIAL CARD REFRESH VERIFICATION — BLOCKED`

Do not merge.
Do not deploy production.
Do not change DNS.
Stop after independent verification.
