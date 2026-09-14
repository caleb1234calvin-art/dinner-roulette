# Pick For Me — Core Continuity Master

Updated: September 14, 2026

Purpose: durable top-level AI handoff for the project. This branch replaces task-specific continuity branches as the normal starting point for future work.

## Current product baseline
- Repository: `caleb1234calvin-art/dinner-roulette`
- Production branch: `main`
- Current merged main checkpoint: `6b811ae427339902f456c2706330689c2d6ad54b`
- Validated release candidate incorporated into main: `1c4b2b73d1f23bb184f34e5b7360144378757bc4`
- Release merge commit: `Merge validated Pick For Me release candidate`
- PR #44 merged the frozen candidate into `main`.
- User completed hands-on hosted prototype acceptance before merge and reported the app starts after cleanup.

## Current product identity
The app is still publicly branded Dinner Roulette until the in-app rebrand is deliberately shipped. The broader product direction/name is Pick For Me. Do not prematurely create public-facing naming mismatches.

## Product modes
- Dinner
- Nightlife
- Date Night

## Major capabilities now incorporated
- Live nearby discovery
- GPS/current-location support with privacy-friendly presentation
- International/manual location support
- Search distance up to 50 miles where applicable
- Casino discovery with verified saved catalog and provider/fallback behavior
- Dinner and Nightlife category artwork
- Settings/Favorites/History navigation preserves active home mode

## Release/build safety
Repository `npm run build` must not be assumed migration-safe. Known migration-free hosted production-mode build path:

`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

Do not run migrations, modify secrets, or change hosted build settings casually.

## Durable continuity branches
- `continuity/core` — this document; current product state and operating rules
- `continuity/discovery` — casino, live discovery, GPS, international, range, provider/fallback history
- `continuity/release` — CI, Vercel, build safety, release candidate and deployment history
- `continuity/brand-personality` — branding, artwork, voice, Mordax/personality and marketing continuity
- `continuity/research-logs` — prediction/coincidence log and experimental/research continuity

## Permanent milestone branch
- `integration/rc-validation-2026-09-14` — frozen release-candidate milestone retained intentionally.

## Branch cleanup status
Post-release branch consolidation and pruning are complete. The repository was reduced from the prior task-branch sprawl to the durable continuity structure above, `main`, and the frozen RC milestone. Historical branches were deleted only after their important continuity/provenance was consolidated.

Deleted task branches remain traceable through Git history and provenance references inside the specialized continuity masters. Do not recreate them merely to recover context.

## Historical source branches absorbed into this continuity system
- `integration/active-work-pass-1` @ `91c2d121b3be47705b86f0fe37226bfd465479d4`
- `integration/validated-handoff-2026-09-13` @ `f9f708665ca6af25fa872e33345b52472f2bf837`
- `integration/required-test-gate-recovery` @ `a76ffbe7975f667dd808886462571ec0ba79934b`
- `integration/rc-validation-2026-09-14` @ `1c4b2b73d1f23bb184f34e5b7360144378757bc4`

## Operating rule
Future AI workers should read `continuity/core` first, then only the specialized continuity branch relevant to the task. Update the appropriate master continuity after meaningful work. Do not recreate one-off handoff branches unless a genuinely isolated release or risky migration requires it.
