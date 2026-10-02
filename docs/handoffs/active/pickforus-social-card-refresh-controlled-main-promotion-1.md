# Pick For Us — Social Preview Card Controlled Main Promotion 1

Repository:
`caleb1234calvin-art/dinner-roulette`

Promotion-control branch:
`promote/pickforus-social-card-refresh-1`

Target:
`main`

## Exact verified candidate

Candidate:
`91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`

Tree:
`af40c61514d131d4977b990d2372aa5397e21c6c`

Sole parent / expected current main:
`4ba90f22a36409c4aa5d807f9c81257ba8884a7c`

Independent verification final state:

`PICK FOR US SOCIAL CARD REFRESH CANDIDATE VERIFIED — READY FOR CONTROLLED PROMOTION`

Verified Preview:
`dpl_91aHGYRYk1ZwbiPKKWUw9f9H8S6r`

Expected Preview state:
`READY`

## Scope

The candidate changes exactly:

- `public/og.jpg`
- `scripts/social-card-refresh.py`

No other tracked path may differ from current main.

The new `public/og.jpg` must remain:
- JPEG
- 1200×630
- 108152 bytes
- SHA-256 `ab64b705321a7f01e094663c63df3f06c7284ff3a104d0ef028ba23e81984813`

`public/x-banner.jpg` remains absent.

## Owner authorization gate

THIS HANDOFF DOES NOT BY ITSELF AUTHORIZE MOVING MAIN.

Before promotion, obtain explicit owner authorization.

If absent, stop:

`PICK FOR US SOCIAL CARD PROMOTION — OWNER AUTHORIZATION REQUIRED`

## Mandatory preflight

Before changing main:

1. Fetch fresh refs.
2. Verify main exactly `4ba90f22...`.
3. Verify candidate branch exactly `91e1bc6...`.
4. Verify candidate tree exactly `af40c615...`.
5. Verify sole parent exactly `4ba90f22...`.
6. Verify candidate exactly one commit ahead and zero behind.
7. Verify exactly two changed paths.
8. Verify exact candidate Preview remains READY and sourced from `91e1bc6...`.
9. Verify current production remains READY on `4ba90f22...`.
10. Verify explicit owner authorization is present.

If any gate fails, stop without promotion.

## Promotion method

Use only a normal non-forced fast-forward of `main` to:

`91e1bc6b2d3e6ea38af4acfe4099f4cfc7085509`

Do not squash, rebase, cherry-pick, merge-commit, force-push, or edit files during promotion.

## Expected production deployment

Allow the automatic Vercel Production deployment triggered by the main update.

Require:
- target = production
- source branch = main
- source SHA = `91e1bc6...`
- state / readyState = READY
- alias error absent
- `pickforus.app` serves
- `www.pickforus.app` still redirects to apex
- legacy Vercel hostname still serves

Do not manually redeploy if automatic deployment fails.

## Production social-card verification

After READY:

1. Fetch live `https://pickforus.app/og.jpg`.
2. Require:
   - HTTP 200
   - image/jpeg
   - 1200×630
   - 108152 bytes
   - SHA-256 `ab64b705...`
3. Verify visible card:
   - complete clay artwork
   - black background
   - Pick For Us
   - pickforus.app
   - no old pizza/food artwork
4. Verify live homepage metadata:
   - `og:image=https://pickforus.app/og.jpg`
   - `twitter:image=https://pickforus.app/og.jpg`
   - title/description/canonical/robots unchanged
5. Verify `/x-banner.jpg` remains absent/404.
6. Verify favicon/PWA/Android assets remain unchanged.

## Product smoke

Bounded smoke:
- homepage hydrates
- Dinner discovery settles
- Settings renders
- History renders
- Favorites renders
- no application console errors

## Cache limitation

Third-party apps may retain cached previews for already-shared URLs.

Do not treat stale third-party cache as production failure when live asset bytes and metadata are correct.

Do not attempt social-platform cache-busting or scraper invalidation unless separately authorized.

## Boundaries

Do not:
- change DNS/domains
- alter Vercel settings
- sign/publish Android
- change dependencies
- change auth/database
- run migrations
- automatically rollback

If serious regression occurs, stop and report. No automatic rollback.

## Final state

On success:

`PICK FOR US SOCIAL CARD REFRESH MAIN PROMOTION VERIFIED — PRODUCTION HEALTHY`

Stop after production smoke.

Do not begin another branding task automatically.
