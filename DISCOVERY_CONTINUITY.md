# Pick For Me — Discovery Continuity Master

Updated: September 14, 2026

Purpose: durable history and handoff for live discovery, casino, location, international support, search range and provider fallback behavior.

## Current discovery state — released to main
The validated discovery/casino/location update is incorporated into `main` through merge commit `6b811ae427339902f456c2706330689c2d6ad54b` from frozen candidate `1c4b2b73d1f23bb184f34e5b7360144378757bc4`.

- Dinner and Nightlife support live nearby discovery.
- Current-location/GPS behavior uses privacy-friendly user-facing language rather than displaying raw coordinates or tracking-sounding confirmation.
- Manual/international location architecture supports non-U.S. discovery; Toronto, Vancouver, Montréal and London were exercised during release validation.
- Search distance was expanded up to 50 miles where supported by the mode.
- Dense-city Dinner counts represent broad food-place discovery, including restaurants, fast food, cafes, ice cream and food-serving pubs; UI therefore uses `places match` rather than narrowly `restaurants match`.
- Provider failures are allowed to fall back honestly to verified saved data rather than masquerading as live-provider success.

## Casino state at validated release
- 883 canonical casino destinations
- 899 serialized casino rows
- 60 passes
- Nevada 204
- Oklahoma 113
- Colorado 31
- Texas 4
- Four-state focus 352
- +152 destinations from original 731 baseline
- Six release-validation casino regions passed acceptance; some exercised saved-catalog fallback after provider timeout.

## Historical source branches — consolidated and pruned
- `audit/national-casino-pass-1` @ `c813616ddd2cd726cc845597e0f3f9a03eb04536`
- `integration/casino-continuation-2026-09-13` @ `a3cffc654924596fe23a9d0050ac1a056b6751a5`
- `integration/casino-final-freeze-2026-09-13` @ `b595050b04c49dd13d842778ebd79b0d73b6343f`
- `integration/casino-location-reconciliation-2026-09-13` @ `d44de898fc6420e18ad83dc0a7aa753fbd19bc5b`
- `integration/casino-release-candidate-2026-09-13` @ `61cb2fe047a80fc4a67931ea3b24040e75dcd367`
- `integration/location-international-2026-09-13` @ `4a93870c05ec53bd49fae5143df420c301696839`
- `integration/national-manifest-coverage` @ `e04a76475885093e54cb1e8a241bbf487cfb591a`
- `integration/pass-48-south-coffeyville` @ `c82c10117804180e46d7d1c965cb8069d9dbe976`
- `integration/pass-49-cadence-crossing` @ `25b2e0cd53049a6066d613d5ccfe6a63ee57dcd0`
- `integration/pass-50-frontier-coordinates` @ `b8d4295c8b863a8193f63e51dea77d77e63000da`
- `feature/nightlife-casino-comedy-radius` @ `5b6319eff830b4dafeee7d54ecd9762fe180db57`

Those task branches were intentionally deleted after consolidation. Their names/SHAs remain here for provenance; completed work must not be reopened simply because the refs were pruned.

## Preserved repository evidence
The merged project history contains casino audit artifacts, location handoff material, provider/browser evidence and release-validation evidence. The frozen RC milestone `integration/rc-validation-2026-09-14` is retained.

## Future rule
Extend discovery from this consolidated released state. New discovery work should use temporary implementation branches as needed, produce evidence, then update this master. Do not accumulate a permanent branch per casino/location pass.
