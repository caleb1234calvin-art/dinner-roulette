# Pick For Us — Unified App/Web Icon Refresh Independent Verification 1

Repository:
`caleb1234calvin-art/dinner-roulette`

Verification branch:
`verify/pickforus-icon-refresh-1`

Exact remote candidate:
`4ba90f22a36409c4aa5d807f9c81257ba8884a7c`

Expected tree:
`fd4374a52b6fc444be4747c17b0f90e76abfd373`

Expected sole parent:
`551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`

Frozen production main:
`551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`

Known candidate Preview:
`dpl_57zF5kRTiFGS2MEwVJ2DkBzw4528`

Known Preview URL:
`https://dinner-roulette-e4sy85419-minions-9e2c.vercel.app/`

Known Preview state:
`READY`

## Purpose

Perform an independent verification of the exact published unified icon-refresh candidate.

This is verification only.

Do not modify the candidate.
Do not regenerate artwork.
Do not change image bytes.
Do not merge.
Do not deploy production.
Do not change DNS/domains.
Do not sign or publish Android.
Do not change dependencies, auth, or database state.

## Required reading

Read IN FULL:

- `docs/handoffs/active/pickforus-icon-refresh-remediation-1.md`
- `docs/handoffs/active/pickforus-icon-refresh-remediation-1-continuation.md`
- `docs/handoffs/active/pickforus-icon-refresh-remediation-1-continuation-2.md`
- `docs/handoffs/active/pickforus-domain-readiness-remediation-1.md`
- `docs/handoffs/active/pickforus-domain-readiness-verification-1.md`
- `docs/handoffs/active/pickforus-tanstack-security-verification-1.md`

If the remediation Markdown/JSON/evidence bundle and review sheet are available in the worker workspace, read them as supporting evidence but independently reproduce all critical checks.

## Approved artwork source identity

The exact approved user artwork is:

Library path:
`/Pick For Us Assets/pick-for-us-icon-master-1536.jpg`

Expected source:
- JPEG
- 1536 × 1536
- RGB
- 494490 bytes
- SHA-256:
  `12afcedace4aacb19109e561fc70af76076ece7d4997348021422a9396e865d5`

Candidate canonical repo master:
`public/brand/pick-for-us-icon-master.jpg`

Independently verify it is byte-identical to the approved source.

No image generation or artistic transformation is authorized or expected.

## Starting gates

Before verification:

1. Fetch fresh refs.
2. Verify `origin/main` remains exactly:
   `551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`
3. Verify `origin/fix/pickforus-icon-refresh-candidate-1` equals:
   `4ba90f22a36409c4aa5d807f9c81257ba8884a7c`
4. Verify candidate tree:
   `fd4374a52b6fc444be4747c17b0f90e76abfd373`
5. Verify candidate sole parent:
   `551c5f89fc4d2f8b054b3b4a5b4dce42ba544536`
6. Verify candidate is exactly one commit ahead of main and zero behind.
7. Establish a clean isolated checkout pinned to the candidate.
8. Do not modify tracked files.

If immutable identity fails, stop:

`PICK FOR US ICON REFRESH VERIFICATION — BLOCKED`

## Exact candidate scope

Candidate must change exactly the same bounded 28 paths as the remediation report.

Expected categories:
- 15 Android launcher PNG derivatives
- new approved master
- favicon PNG
- Apple touch PNG
- two 512 PWA PNGs
- manifest
- root head favicon metadata
- Android icon generator/checker
- bounded icon tests
- active Android documentation

No unrelated source/config/dependency file may change.

Independently compare base-to-candidate path set and content.

## Exact-tree transport verification

This remote candidate was intentionally published as an exact-tree substitute for original local commit:

`6052a0748256a25b54b5d5a6d94f2e9abd90ffd5`

The local and remote commit SHAs differ only because transport could not reproduce original commit-object metadata.

Verification MUST establish:
- remote tree exactly equals `fd4374a5...`
- sole parent exactly equals `551c5f89...`
- remote changed path set exactly equals the locally tested path set
- no candidate report/handoff files were accidentally included
- where evidence permits, full file/tree equality with original local candidate

Do not treat differing commit SHA alone as a failure.

## Website icon verification

Independently verify:

### Browser favicon
- runtime head references `/favicon.png`
- MIME/type is correct
- intended size is 64×64
- no live/runtime head reference to `/favicon.svg`

### Direct favicon asset
- `public/favicon.png`
- exact 64×64 PNG
- deterministic derivative of approved master
- expected hosted SHA-256:
  `71bc53defea0d5ae0837cd7c0eb01df0c4cd04d43920c3af36e47a80f357191c`

### Apple touch icon
- 192×192 PNG
- expected SHA-256:
  `99877ec24a597c68df9169fbbf45cf69cfb7706a681754346d43297b13ff9ac0`
- byte-identical to Android xxxhdpi legacy launcher if that invariant is still asserted

### PWA icons
- `/pwa-icon-512.png` 512×512 PNG, purpose any
- expected SHA-256:
  `4d71389437dc6339ed31ae413e189f5d8a6abe966296333f58c9f1facd202be9`
- `/pwa-icon-maskable-512.png` 512×512 PNG, purpose maskable
- expected SHA-256:
  `dbdc4ba01136f56b204f97a69c6797a95009072992818e9d7e5cc5f6a31531bc`

## Manifest verification

Verify `public/manifest.webmanifest`:
- name = Pick For Us
- short_name = Pick For Us
- start_url = /
- scope = /
- icon list contains only the new intended PNG icon paths
- Apple 192 any
- PWA 512 any
- PWA 512 maskable
- no active `favicon.svg` entry

Expected committed manifest SHA-256:
`d7ef890edab6f047680917f29436842b5f7b517aa160490608d0a63a30beb1ef`

Verify compatibility endpoints return the same parsed manifest snapshot.

## Android icon verification

Review `scripts/android-icons.py`.

Verify:
- source points only to new approved master
- source checksum is exact approved SHA
- no crop/redraw/retouch/recomposition
- only uniform resize, neutral padding, alpha/mask operations
- 15 launcher PNG derivatives remain deterministic
- adaptive XML remains unchanged and valid
- no monochrome artwork invented

Run:

`npm run android:check`

Independently verify all 15 committed derivatives byte-for-byte.

Run relevant Android release/bundle-verifier tests.

Do not sign or publish an Android artifact.

## Pixel / geometry tests

Run the new Python icon tests and independently inspect their assertions.

Verify:
- master dimensions/hash
- favicon dimensions
- Apple/PWA dimensions
- maskable safe region
- RGB content preserved inside round resource art region
- inherited alpha ringing tolerance is bounded and documented
- no meaningful composition clipping under static circle/squircle/maskable masks

The provided review sheet is evidence, not a substitute for mechanical verification.

Do not redesign the icon to improve tiny-size text.

## Regression suite

Run all existing relevant tests from remediation.

Expected remediation totals:
- 194 JavaScript passed
- 8 Python passed
- 0 failed
- 0 skipped

At minimum include:
- icon refresh tests
- domain/PWA tests
- Android release/config tests
- provider deadline tests
- client lifecycle tests
- app-env tests
- TanStack security tests

## Typecheck / lint

Run:
- TypeScript noEmit
- bounded lint over changed JS/TS/MJS/TSX test/source files
- `git diff --check`

Require pass.

## Migration-free build

Run exactly:

`VITE_AUTH_ENABLED=true node scripts/with-app-env.mjs node node_modules/vite/bin/vite.js build --mode production`

Do NOT run ordinary `npm run build`.
Do NOT run database migrations.

## Fresh built-output verification

Independently verify actual fresh built output for:
- canonical host `pickforus.app`
- legacy host `dinner-roulette-chi.vercel.app`
- candidate Preview host
- `/`
- `/settings`
- `/history`
- `/favorites`

Require:
- canonical/domain behavior unchanged
- new PNG favicon metadata present
- no live favicon SVG reference
- manifest and compatibility manifests coherent
- all four static icon assets match committed bytes
- install tutorial remains Pick For Us
- no auth/database bootstrap regression

## Vercel Preview verification

Read-only verify exact deployment:

`dpl_57zF5kRTiFGS2MEwVJ2DkBzw4528`

Require:
- source branch = `fix/pickforus-icon-refresh-candidate-1`
- source SHA = `4ba90f22a36409c4aa5d807f9c81257ba8884a7c`
- target = Preview
- state/readyState = READY
- alias error absent

Do not redeploy.
Do not change Vercel settings.

## Hosted asset verification

Against the exact immutable Preview URL, independently fetch and verify:
- `/favicon.png`
- `/apple-touch-icon.png`
- `/pwa-icon-512.png`
- `/pwa-icon-maskable-512.png`
- `/manifest.webmanifest`
- `/__grok/manifest.webmanifest`
- `/__grok/manifest.json`

Verify hosted bytes/hashes/dimensions exactly where applicable.

## Browser verification

Use a real browser on the exact immutable Preview.

At minimum:
- homepage reaches hydrated interactive state
- favicon head link points to `/favicon.png`
- direct favicon PNG loads
- linked manifest downloads/loads
- Dinner discovery settles
- Settings renders
- History renders
- Favorites renders
- no application console errors/warnings

Browser chrome favicon cache lag is NOT a failure if direct asset bytes and DOM head are correct.

Distinguish extension console noise from app errors.

## Production preservation

Verify:
- main still equals `551c5f89...`
- production deployment still equals prior healthy production
- no production deployment from icon candidate exists
- no DNS/domain changes occurred
- Android package/runtime/signing/Play state unchanged

## Reports

Produce:

`audit/pickforus-icon-refresh-verification-1-2026-10-02.md`

`audit/pickforus-icon-refresh-verification-1-2026-10-02.json`

plus bounded evidence if useful.

Report:
1. immutable identities
2. exact-tree transport proof
3. exact 28-path scope
4. approved-source identity
5. website favicon verification
6. manifest/PWA verification
7. Android derivative verification
8. pixel/geometry review
9. regression test totals
10. typecheck/lint/diff
11. migration-free build
12. fresh built-output verification
13. Preview identity/state
14. hosted asset byte checks
15. browser smoke
16. no-generation/no-retouch confirmation
17. production preservation
18. warnings/limitations
19. final repository state
20. exact next bounded step

## Final state

End with exactly one:

`PICK FOR US ICON REFRESH CANDIDATE VERIFIED — READY FOR CONTROLLED PROMOTION`

or

`PICK FOR US ICON REFRESH VERIFICATION — FAILED`

or

`PICK FOR US ICON REFRESH VERIFICATION — BLOCKED`

Do not merge.
Do not deploy production.
Do not change DNS.
Do not sign or publish Android.
Stop after independent verification.
