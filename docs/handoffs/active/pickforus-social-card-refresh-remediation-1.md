# Pick For Us — Social Preview Card Refresh 1

Repository:
`caleb1234calvin-art/dinner-roulette`

Instruction branch:
`fix/pickforus-social-card-refresh-1`

Implementation branch:
`fix/pickforus-social-card-refresh-candidate-1`

Exact base / current production main:
`4ba90f22a36409c4aa5d807f9c81257ba8884a7c`

Known current production deployment:
`dpl_DeTXj3Yqg2VULhdRAXuBHC1hjMAb`

Canonical production:
`https://pickforus.app`

## Purpose

Refresh the remaining old social/link-preview artwork so it matches the newly promoted clay-button Pick For Us branding.

The live metadata currently points to:

`https://pickforus.app/og.jpg`

and the repository also contains:

`public/x-banner.jpg`

The user observed that the favicon/app/PWA branding changed, but the social/link preview still displayed the older pizza artwork.

## Visual intent

Use the newly approved clay-button icon artwork already committed at:

`public/brand/pick-for-us-icon-master.jpg`

as the replacement visual artwork for the social cards.

The desired visual result should mirror the user's manual sticker fix:

- preserve the existing overall black social-card composition
- preserve existing Pick For Us text and `pickforus.app` text where practical
- replace the old food/pizza visual panel with the new clay-button artwork
- keep the card clean, simple, brand-consistent, and immediately recognizable

Do NOT redesign the product logo or invent new artwork.

## No image generation

This task must NOT call any image-generation model.

Do not:
- redraw the clay art
- retouch it
- restyle it
- synthesize a new icon
- change the lettering inside the icon
- add/remove hands or objects
- crop meaningful composition

Allowed operations:
- deterministic resize
- deterministic placement/compositing
- neutral padding
- ordinary JPEG encoding
- reuse of existing card typography/text/layout
- bounded color/background fill matching existing card

## Social assets

### Open Graph / general social card

Target:

`public/og.jpg`

Required:
- 1200 × 630 JPEG
- under 600 KiB
- uses the new clay icon artwork
- preserves Pick For Us product identity
- preserves or reproduces the visible `Pick For Us` and `pickforus.app` text
- no old pizza/food artwork remains visible

Prefer preserving the existing right-side text treatment and replacing only the old visual/art panel if that can be done cleanly and deterministically.

### X/feed banner

Inspect:

`public/x-banner.jpg`

If it still uses old pizza/food artwork, refresh it in the same style:
- preserve current X/feed composition as much as practical
- replace old visual panel with new clay artwork
- keep existing Pick For Us/domain text treatment where possible
- preserve expected 1200 × 264 JPEG dimensions
- stay under 600 KiB

If it does not contain stale branding, document that and leave it unchanged.

## Metadata behavior

Do NOT change the canonical domain, title, description, robots, route canonical logic, favicon, PWA manifest, Android icon resources, or TanStack/security behavior.

The existing social metadata path:

`/og.jpg`

should remain stable unless a concrete cache-busting requirement is proven necessary.

Do not add query-string cache busting or a new social-image path merely speculatively.

Existing already-posted social previews may remain visually cached by third-party platforms. That is not a code failure.

## Source and card inspection

Before editing:

1. Verify base identity.
2. Inspect current `public/og.jpg`:
   - dimensions
   - byte size
   - SHA-256
   - visible composition
3. Inspect current `public/x-banner.jpg` similarly.
4. Verify exact icon master identity:
   `public/brand/pick-for-us-icon-master.jpg`
5. Confirm no production/head metadata needs modification to pick up replaced `og.jpg`.

## Deterministic implementation

Prefer a reproducible local Python/Pillow workflow.

A small script may be added, e.g.:

`scripts/social-card-refresh.py`

if doing so materially improves repeatability.

If a script is added:
- use only existing approved repo art
- do not depend on remote fonts or image services
- do not download imagery
- deterministic inputs/outputs only
- include explicit output dimensions/quality
- produce byte-stable output under the pinned image toolchain where practical

If preserving the existing card's text area by compositing the new icon into the old visual panel is the cleanest solution, that is preferred.

Do not manually paint over pixels in an unreproducible way.

## Scope

Expected changed paths should normally be limited to:

- `public/og.jpg`
- `public/x-banner.jpg` only if stale
- optional deterministic social-card generation/check script
- optional bounded tests for social-card dimensions/size/source identity

Do not modify:
- application UI
- app logic
- package dependencies
- package lock
- Android icon resources
- favicon/PWA icon files
- canonical/domain logic
- Vercel config
- auth/database code
- DNS

## Validation

### Static asset gates

For `public/og.jpg`:
- JPEG
- 1200×630
- <= 600 KiB
- visually uses clay artwork
- no stale pizza/food visual remains

For `public/x-banner.jpg` if changed:
- JPEG
- 1200×264
- <= 600 KiB
- same brand treatment

### Brand checks

Run relevant brand/social-card checks, including:

`node scripts/brand-check.mjs`

and relevant unit tests such as:
- `scripts/brand-check.test.mjs`
- `scripts/grok-pwa-plugin.test.mjs`
- `scripts/domain-readiness.test.mjs`

### Security/preservation

Re-run:
- `scripts/tanstack-security.test.mjs`
- Android config/release preservation tests
- provider deadline/client lifecycle/app-env tests

No regression.

### Typecheck/lint

Run:
- TypeScript noEmit
- bounded lint over changed JS/MJS/TS files if any
- `git diff --check`

### Migration-free build

Run exactly:

`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

Do NOT run ordinary `npm run build` if it invokes migrations.

## Built-output verification

Verify fresh built output:
- `og:image` remains `https://pickforus.app/og.jpg`
- `twitter:image` remains `https://pickforus.app/og.jpg`
- canonical/social metadata otherwise unchanged
- built/public `og.jpg` matches committed asset
- `x-banner.jpg` matches committed asset if used/baked
- no icon/favicon regression

## Candidate / Preview

If all local gates pass:

1. Commit the bounded implementation on:
   `fix/pickforus-social-card-refresh-candidate-1`
2. Candidate sole parent must be exact base:
   `4ba90f22a36409c4aa5d807f9c81257ba8884a7c`
3. Push normally, non-forced.
4. Allow Git-linked Vercel Preview.
5. Require Preview READY.
6. Verify direct:
   - `/og.jpg`
   - `/x-banner.jpg` if changed
7. Verify Preview HTML metadata still points to canonical apex `/og.jpg`.
8. Run bounded browser smoke:
   - homepage hydrates
   - Dinner discovery settles
   - Settings/History/Favorites render
   - no application console errors

## Social-preview cache limitation

Record explicitly:

Third-party social platforms may cache an older unfurl for an already-shared URL. Existing messages/posts are not guaranteed to refresh retroactively.

Verification should use:
- direct hosted asset bytes
- current HTML metadata
- fresh preview/scraper behavior where available

Do not treat third-party cache lag as application failure.

## Boundaries

Not authorized:
- merge main
- production deployment
- DNS/domain changes
- Android signing/Play publication
- dependency changes
- auth/database changes
- image-generation models

## Reports

Produce:

`audit/pickforus-social-card-refresh-remediation-1-2026-10-02.md`

`audit/pickforus-social-card-refresh-remediation-1-2026-10-02.json`

plus bounded evidence and a side-by-side old/new social-card review image if useful.

Report:
1. immutable base identity
2. old social asset hashes/dimensions
3. new asset hashes/dimensions
4. exact visual treatment
5. whether x-banner changed
6. no-generation confirmation
7. exact changed paths
8. test results
9. typecheck/lint
10. migration-free build
11. built-output metadata
12. candidate SHA/tree/parent
13. Preview deployment ID/source/state
14. hosted asset verification
15. browser smoke
16. cache limitations
17. production unchanged
18. exact next bounded step

## Final state

End with exactly one:

`PICK FOR US SOCIAL CARD REFRESH — CANDIDATE READY FOR INDEPENDENT VERIFICATION`

or

`PICK FOR US SOCIAL CARD REFRESH — FAILED`

or

`PICK FOR US SOCIAL CARD REFRESH — BLOCKED`

Do not merge or deploy production.
Stop after candidate/Preview/report production.
