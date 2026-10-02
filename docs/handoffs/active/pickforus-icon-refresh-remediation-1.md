# Pick For Us — Unified App/Web Icon Refresh 1

Repository:
`caleb1234calvin-art/dinner-roulette`

Instruction branch:
`fix/pickforus-icon-refresh-1`

Implementation branch:
`fix/pickforus-icon-refresh-candidate-1`

Exact implementation base / current production main:
`551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`

Expected base tree:
`c2ee34d097974f7a4fd5013abfaf29fc0319fcc8`

Current canonical site:
`https://pickforus.app`

## User intent

Replace the old website favicon and the old Android launcher artwork with the user's newly approved clay-button artwork.

The SAME artwork is to become the visual source for:
- browser/site favicon
- PWA / home-screen icons
- Apple touch icon
- Android launcher icon resources

The user explicitly said:

**Do not generate an image.**

No AI image generation, redraw, retouch, stylistic reinterpretation, object removal/addition, background replacement, or synthesized logo is authorized.

Only deterministic mechanical image operations are allowed:
- byte copy of the approved master
- uniform resize
- neutral padding
- alpha/mask application for platform-required round/adaptive derivatives
- ordinary file-format encoding required for icon assets

No crop of the approved composition is allowed.

## Approved source artwork

The exact user-uploaded source has been saved to the user's personal Library:

Library path:
`/Pick For Us Assets/pick-for-us-icon-master-1536.jpg`

Library file id:
`file_000000008cc481f5bcf29ac1d77b9782`

Library record id:
`libfile_804d8a95585c8191be526bd160abb025`

Expected source properties:
- JPEG
- 1536 × 1536
- RGB
- byte size: 494490
- SHA-256:
  `12afcedace4aacb19109e561fc70af76076ece7d4997348021422a9396e865d5`

Before doing anything, retrieve that exact Library file and verify all properties above.

If the exact Library file cannot be retrieved, or any checksum/dimension differs, STOP:

`PICK FOR US ICON REFRESH — SOURCE ART BLOCKED`

Do not substitute screenshots, another upload, an AI recreation, the current repo icon, or a visually similar asset.

## Current stale icon state

At the base candidate:

### Website favicon
`public/favicon.svg` is the older abstract icon:
- dark rounded square
- cream circle
- orange triangle
- dark center circle

`src/routes/__root.tsx` currently points browser icon metadata to:
`/favicon.svg`

`public/manifest.webmanifest` also references that old SVG as a PWA icon.

### Android / Apple-touch
The current Android icon generator is pinned to:
`public/brand/grok_1789541884918.jpg`

Current hash:
`5d823a5c4ef6cc0a76ffc8926f83f0eaae85cb8b59cdcd280d9b8d148f99500a`

Relevant current files include:
- `scripts/android-icons.py`
- `scripts/check-android.mjs`
- `native-android/README.md`
- `ANDROID_RELEASE.md`
- Android mipmap launcher derivatives
- `public/apple-touch-icon.png`

The domain-readiness suite currently enforces that `public/apple-touch-icon.png` is byte-identical to:
`android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`

Preserve that invariant unless a concrete platform requirement proves it impossible.

## Implementation scope

### 1. New canonical artwork master

Add the exact Library bytes to:

`public/brand/pick-for-us-icon-master.jpg`

Require SHA-256:
`12afcedace4aacb19109e561fc70af76076ece7d4997348021422a9396e865d5`

Do not recompress the canonical master.

Keep the previous `public/brand/grok_1789541884918.jpg` as historical source material unless removing it is proven necessary. It must no longer participate in active icon generation.

### 2. Android deterministic pipeline

Update `scripts/android-icons.py` so the approved source and checksum point to the new master.

Preserve the current Android safety principles:
- no cropping
- full composition retained
- uniform scaling
- neutral padding only
- 15 launcher resources across mdpi/hdpi/xhdpi/xxhdpi/xxxhdpi
- standard, round, and adaptive foreground assets
- adaptive XML remains valid
- no fabricated monochrome icon

The current neutral launcher background `#292A26` / `(41,42,38)` may remain unless an objective artifact problem requires otherwise.

Do not change Android package ID, app name, runtime host, SDKs, signing, or Play state.

### 3. Web/PWA deterministic derivatives

Make the website and install surfaces use derivatives of the SAME approved master.

Required outputs:

- `public/favicon.png`
  - 64 × 64 PNG
  - deterministic resize/padding from approved master
  - no crop or art change

- `public/apple-touch-icon.png`
  - 192 × 192 PNG
  - remain byte-identical to Android `mipmap-xxxhdpi/ic_launcher.png` if possible

- `public/pwa-icon-512.png`
  - 512 × 512 PNG
  - purpose `any`
  - deterministic resize/padding from approved master

- `public/pwa-icon-maskable-512.png`
  - 512 × 512 PNG
  - purpose `maskable`
  - same approved art with additional neutral safe-zone padding only
  - ensure meaningful content sits inside the standard maskable safe region

Prefer generating/checking all committed derivatives from the same deterministic Python pipeline so drift can be detected byte-for-byte.

The old `public/favicon.svg` should no longer be referenced by runtime HTML or manifest. It may be deleted if no active consumer remains.

### 4. Website metadata

Update `src/routes/__root.tsx` so the primary browser favicon is the new raster asset:

`/favicon.png`

Use correct MIME metadata and size metadata where supported.

Do not alter canonical URL, robots, OG/Twitter identity, manifest path, or domain behavior.

### 5. Manifest

Update `public/manifest.webmanifest` so its icon set is coherent and uses only new artwork derivatives.

Expected icon intent:

- `/apple-touch-icon.png` — 192x192 — PNG — `any`
- `/pwa-icon-512.png` — 512x512 — PNG — `any`
- `/pwa-icon-maskable-512.png` — 512x512 — PNG — `maskable`

Compatibility manifest endpoints must continue returning the same public manifest snapshot.

### 6. Active documentation / checks

Update active icon-source references such as:
- `scripts/check-android.mjs`
- `native-android/README.md`
- `ANDROID_RELEASE.md`

Do not rewrite historical audit evidence or prior handoffs merely to make old records look current.

If `AI_CONTINUITY.md` contains a historical statement tied to the previous phase, preserve history; only add a clearly dated/current note if continuity genuinely needs it.

## Small-size visual gate

Before committing, mechanically render a local review sheet from the exact new master showing at minimum:

- original master
- 16 × 16 browser favicon appearance
- 32 × 32
- 64 × 64
- 192 × 192 Apple/legacy launcher
- 512 × 512 PWA any
- 512 × 512 maskable preview
- Android adaptive circle
- Android adaptive squircle

This review is NOT permission to retouch the art.

If the title becomes unreadable at tiny sizes, that is acceptable if the overall orange/teal clay-button silhouette remains recognizable. Do not redesign the icon to improve text legibility.

Record whether any platform mask visibly clips meaningful content.

## Expected changed paths

The exact final set may include:

- `public/brand/pick-for-us-icon-master.jpg` (new)
- `public/favicon.png` (new)
- `public/pwa-icon-512.png` (new)
- `public/pwa-icon-maskable-512.png` (new)
- `public/apple-touch-icon.png`
- `public/favicon.svg` (delete if no longer used)
- `public/manifest.webmanifest`
- `src/routes/__root.tsx`
- `scripts/android-icons.py`
- `scripts/check-android.mjs`
- `native-android/README.md`
- `ANDROID_RELEASE.md`
- the 15 Android launcher PNG derivatives under `android/app/src/main/res/mipmap-*`
- bounded icon/domain tests updated only as necessary

No unrelated source or dependency change is authorized.

## Required tests

### Source / derivative identity
Add or update tests to prove:
- approved master exact SHA
- approved master 1536 × 1536
- favicon PNG exact expected dimensions
- PWA icons exact dimensions
- maskable icon has required safe padding
- Apple touch icon remains coherent with Android launcher output
- old favicon SVG is not referenced by live HTML or manifest

### Android
Run:

`npm run android:check`

This must verify all 15 committed Android launcher derivatives byte-for-byte.

Also run relevant Android release tests.

Do not sign or publish Android.

### Domain/PWA
Run at minimum:

`node --test scripts/domain-readiness.test.mjs scripts/grok-pwa-plugin.test.mjs`

Update assertions only where the intended icon paths changed.

Preserve all domain/canonical/install identity invariants.

### Security regression
The TanStack security remediation is already production-critical. Re-run:

`node --test scripts/tanstack-security.test.mjs`

No regression is acceptable.

### Existing preservation suite
Run the prior preservation tests covering:
- Android release/config
- provider deadlines
- client lifecycle
- app-env wrapper

### Typecheck/lint
Run:
- TypeScript noEmit
- bounded lint over changed JS/TS/MJS files

### Migration-free build
Run exactly:

`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

Do NOT run ordinary `npm run build` if it invokes `db:migrate`.

### Built output
Verify actual built output:
- references `/favicon.png`, not `/favicon.svg`
- serves favicon/apple-touch/PWA icon assets
- manifest icon list matches intended paths
- compatibility manifests match
- install tutorial still uses Pick For Us
- no canonical/domain behavior changes

## Preview / browser gate

If all local tests pass:

1. Commit the bounded remediation on the implementation branch.
2. Candidate sole parent must be exact production main:
   `551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`
3. Push normally, non-forced, to:
   `fix/pickforus-icon-refresh-candidate-1`
4. Allow the normal Vercel Preview.
5. Verify the exact Preview is READY.
6. In a real browser:
   - homepage hydrates
   - favicon link points to new PNG
   - direct favicon PNG loads
   - manifest loads and uses new icon set
   - apple-touch icon loads
   - PWA icons load
   - Dinner discovery still works
   - Settings/History/Favorites navigate
   - no app console error

Browser UI may cache favicons. Treat direct asset bytes + head metadata as authoritative if the browser chrome visually lags. Do not add cache-busting query strings unless independently justified.

## Commit / deployment boundaries

Authorized:
- implementation branch changes
- candidate commit
- normal non-forced candidate branch push
- Vercel Preview side effect
- read-only Preview smoke

Not authorized in this task:
- merge to main
- production deployment
- DNS changes
- Vercel domain changes
- Android signing / Play upload
- auth changes
- database migrations
- dependency upgrades
- image generation or AI art edits

## Required report

Produce:

`audit/pickforus-icon-refresh-remediation-1-2026-10-02.md`

and:

`audit/pickforus-icon-refresh-remediation-1-2026-10-02.json`

plus bounded evidence, including hashes and the mechanical icon review sheet.

Report:
1. immutable base identity
2. exact approved source identity
3. retrieval proof
4. exact changed paths
5. deterministic derivative rules
6. old icon retirement status
7. website/PWA icon paths
8. Android resource results
9. visual mask/tiny-size review
10. test totals
11. typecheck/lint
12. migration-free build
13. built-output verification
14. candidate SHA/tree/parent
15. Preview deployment ID/source/state
16. browser verification
17. no-generation/no-retouch confirmation
18. no production/DNS/Play action
19. warnings/limitations
20. exact next bounded step

## Final state

End with exactly one:

`PICK FOR US ICON REFRESH — CANDIDATE READY FOR INDEPENDENT VERIFICATION`

or

`PICK FOR US ICON REFRESH — FAILED`

or

`PICK FOR US ICON REFRESH — BLOCKED`

Do not merge or deploy production.
Stop after candidate/Preview/report production.
