# PR #74 — Kansas City hydrated-browser acceptance

**Authoring-worker result: bounded controlled browser PASS at exact published head.** The released-main control independently reproduced the missing outer saved candidates. No production deployment or live-provider success is claimed.

## Identity and build binding

Candidate: `e25594063bc0de09aeb4e08c4912845f9f08fffa`, tree `9c4ec8780bdddff51335f523823e1ec40dee001f`, parent `991978fe24ec165eeacd5500a26d66f35d86c560`.

Candidate auth-enabled source fingerprint: `6779580f4327c874222e9ce953bf0311979b6e9b1edd493898ec4018885db0e1` (520 files). Compiled output fingerprint: `8871a72375bffa864e09e6fb8874be52e4e2f124a24d58e3a805f79821c8c6ca` (193 files).

Released-main control: `991978fe24ec165eeacd5500a26d66f35d86c560`, tree `95f66498048590cbd30c623b17d15bf2d5b7cc73`. Source fingerprint `4e95c845b35578ff2ebd2dfd20370f8be7c6d17d835cd326acad1c7c818bd071` (517 files). Compiled output fingerprint `bff70cafa71057442aefa8b8a4c9f42e394244d77c9e2effdeffaa62b7bf0bd6` (193 files).

Each build was freshly captured, built with the migration-free auth-enabled direct-Vite command, completed and verified before/after its browser run. Both tracked source trees remained clean. Scratch probe and preload are preserved; identical probe SHA executed on both builds. No candidate source, dependency version, production setting or released data was changed.

## Story and controlled boundaries

At the fixture center 39.114053, -94.627463, a user selects Haunted House and changes the radius. The hydrated page calls the actual compiled server function, whose actual handler receives controlled HTTP 504 responses from every provider mirror. The actual client session composes saved candidates and renders home counts and Options. All browser external requests are blocked; all server external requests are intercepted. The only geocoder responses are explicit Kansas City/Carthage fixtures exercised through the real manual location control.

The initial favorite filter contains only these existing identities so all three can be checked deterministically in Options, without altering returned RPC data or client result objects:

- `date-night-ks26-exiled` — Exiled KC: Trail of Terrors & Twisted Carnival.
- `date-night-mo26-dark-nightmares-haunted-forest` — Dark Nightmares Haunted Forest.
- `date-night-mo26-astra-terror-at-the-ranch` — Terror at the Ranch.

The full unfiltered pool is checked separately at 50 miles. Full exact rendered names, DOM text, screenshots, actual RPC request/response bodies and provider attempt geometry are retained. Browser: Chromium 153.0.8010.0, Playwright, 390×844 viewport; reduced motion; service workers blocked.

## Outcomes

| Selection | Released-main target count | Candidate target count | Candidate Options |
| --- | ---: | ---: | --- |
| 15 miles | 0 | 0 | None |
| 20 miles | 0 | 1 | Exiled KC |
| 30 miles | 0 | 2 | Exiled KC, Dark Nightmares |
| 40 miles | 0 | 3 | All three |
| 50 miles | 0 | 3 | All three |
| Shrink to 15 | 0 | 0 | None |
| Grow back to 50 | 0 | 3 | All three |

These radius changes use exactly one core discovery RPC and four mocked mirror failures on each build. No outer request, provider retry, or false complete-coverage claim is introduced. The UI continues to say “Nearby coverage is incomplete” and discloses saved places/live-map failure.

- Open Now ON excludes all three; OFF restores all three on the candidate, without another RPC.
- Removing Favorites Only at 50 miles yields six total matches on candidate versus three core matches on main.
- Actual manual location-control relocation to mocked Carthage removes the three targets. Returning to mocked Kansas City restores them on candidate, while main still lacks them.
- Candidate client clock at `2026-11-01T05:00:00Z` excludes Dark Nightmares and Terror at the Ranch while retaining Exiled. At `2026-11-02T06:00:00Z`, Exiled is also excluded. These are client eligibility/UI clock checks, not source refresh or live-provider operating-date verification.
- Candidate: 14 checked stages PASS. Main: 12 expected-baseline-control stages PASS. Main's PASS means the probe successfully recorded its known missing-target behavior; it is **not** a claim that main passes the candidate requirement. The separately derived requirement comparison shows eight of twelve shared stage expectations unmet by main.
- Each run: five total RPCs (three discovery, two geocoder), twelve mocked provider mirror attempts across the three locations, zero live public-provider calls, zero page errors, no horizontal document overflow in the checked stages.

The author visually inspected candidate 40-mile Options and unfiltered 50-mile home screenshots. The card names retain existing truncation/title behavior; this probe tests discovery and rendered identity membership, not a new UI geometry approval. Existing PR #73 Directions work remains separate.

## Preserved preliminary limitation and remaining gates

The first main invocation stopped before browser launch because a top-level dependency symlink appeared as an untracked file. `main-prelaunch-guard-failure.log` preserves this guard failure. Dependency symlinks were moved inside a real ignored node_modules directory, with versions and application source unchanged. The source/output proof remained valid, and the second main invocation completed.

The separate reviewer is independently corroborating this packet. Hosted CI is separately managed by the coordinator. This controlled probe does not establish live-provider reliability, physical Android acceptance, all viewport coverage or production acceptance. The coordinator also identified a future PR #73 / PR #74 integration conflict in `scripts/seasonal-phase4-recovery.test.mjs`; neither branch was rebased or combined here. Merge/release remains subject to its separate gates and owner approval.
