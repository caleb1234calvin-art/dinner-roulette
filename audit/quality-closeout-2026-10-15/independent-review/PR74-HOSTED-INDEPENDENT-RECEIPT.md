# PR #74 exact-head hosted evidence receipt

This additive receipt preserves the independent review's current qualifications. It does not replace either prior review packet, claim release acceptance, or authorize a merge/deployment. Exact verified SHA: **`e25594063bc0de09aeb4e08c4912845f9f08fffa`**, tree **`9c4ec8780bdddff51335f523823e1ec40dee001f`**, parent **`991978fe24ec165eeacd5500a26d66f35d86c560`**.

## Hosted status at 2026-10-15T22:01:22.655Z

- Web run [38812681149](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/38812681149): **in progress**, nine jobs successful (checks and eight browser lanes), seven browser lanes running, zero failures. Running: regional-wave1, phase4, ranked-holds, cumulative, astra, geometry, astra-extras. No overall web PASS is claimed.
- The successful checks job's original log was retrieved independently. It checks out the exact published SHA and reports **1,253 repository tests PASS, four skipped; 71 application tests PASS**.
- Android run [38812681178](https://github.com/caleb1234calvin-art/dinner-roulette/actions/runs/38812681178): **SUCCESS**, validation job `116689543046` successful, signed-release job skipped. Its original log was retrieved and inspected: exact SHA checkout; signing guard rejects a normal unsigned release; explicit unsigned validation build succeeds; bundle verifier reports `signing: unsigned`; 14 Android lint warnings remain. The Gradle task name `signReleaseBundle` is not evidence of a signed release: the explicit bundle verifier result is unsigned. No APK/AAB binary was downloaded or independently reverified by this reviewer.

## Original radial browser evidence actually accessed

Original artifact **12009362057**, `casino-browser-evidence-date-night-radial`, belongs to web run `38812681149` and exact published head. Downloaded archive: `pr74-original-radial.zip`, **3,295,698 bytes**, SHA-256 **`54caf1ef2d26039531bfa4713c98607a3c8439089030beff5854f8690f80571b`**. ZIP CRC validation passed. It contains 16 members, including ten screenshots, original build proof, verdict, events, controls and server log.

The reviewer accessed the original archive, read its verdict/build proof and original job log, and visually inspected **all-stall.png** and **mobile-progress.png**. The other eight screenshots were archived and CRC checked, not visually inspected. The packet contains the complete original radial ZIP so those pixels are preserved here, rather than merely retaining a manifest. Other hosted browser archives were listed in fresh metadata but not downloaded or inspected by this reviewer in this receipt.

The original verdict reports **10/10 scenarios PASS**, no errors, no page errors, no horizontal overflow, and **zero public provider calls**. Job `116689542784` checked out the exact SHA and reported each scenario passing. Build proof records `VITE_AUTH_ENABLED=true`, source fingerprint **`6779580f4327c874222e9ce953bf0311979b6e9b1edd493898ec4018885db0e1`**, **520 files**, and BUILT output fingerprint `7462adca3b684ee9275d97673f0a2fce315b3711e82fb675b76c8542cdf9a9b3` (193 files). A fresh independent source capture in the detached published-head worktree reproduced the 520-file source fingerprint. That capture alone is not a new local build.

## Scope and remaining qualification

The unchanged radial browser script and preload were read from the exact published head. These ten hydrated scenarios use controlled provider fixtures centered on **Carthage (37.176447, -94.310223)**, generally Movies; `all-stall` uses Anything. They cover existing progressive coverage, middle/outer failures, stable Options, future pick, radius changes, filters, mobile progress and all-stall handling. Inspected pixels show a usable saved-place fallback with an incomplete-coverage notice, and a contained mobile progress view.

They **do not** assert the three Kansas City targets at 50 miles under a failed core. Their controlled provider behavior is not live provider validation. The D2-specific evidence presently accepted by this reviewer is the separately preserved nine handler/controller regressions plus six independent edge probes; a new scratch-only target-specific hydrated browser probe is being prepared by the author worker and has not yet been reviewed. Do not claim those new cases as passed from this existing artifact.

Focused published-head review remains **QUALIFIED PASS**. Full hosted web acceptance and D2-specific hydrated browser corroboration remain pending at this snapshot. Any later result must be appended with its exact identity and evidence, preserving these earlier packets and qualifications. No candidate source was changed and no merge, deployment, rollback, migration, settings change or release signing was performed by this reviewer.
