# Adaptive audit candidate: proposed deterministic policy

Nonproduction successor of c78b97175cc094436e454fa888e1ed83486f750d. No adoption or performance claim.

- UI readiness uses the current merged, radius-clipped, decorated eligible pool, including preferences, exclusions, favorites-only, Open Now and current time. Pick is usable at one venue; four Options requires four. Audit never gates these controls.
- Eligible counts intentionally include curated/cache places only after the primary is authoritatively successful; curated-only readiness never masks failed/partial primary recovery.
- Healthy: successful nonpartial authoritative primary; at least four eligible distinct identities; every explicitly selected category represented. Anything requires at least two represented categories, not every queried category. During Halloween, a valid distinct thrill/settle pair is additionally required when the user's selection supports both roles (Anything does). Movies-only Plan remains N/A.
- Healthy starts its audit after 2,000 ms and admits serial audit starts no faster than every 2,000 ms. Thin/empty successful primary starts immediately, retaining 250 ms successful-settlement pause and at least 1,000 ms outer-start spacing.
- A thin pool becoming healthy switches to healthy pacing after that settlement; streak starts at zero on transition. An unchanged healthy pool stops after four consecutive fully successful audit patches add no new eligible identity. An addition or degraded patch resets the streak. Previously unseen affirmed aliases of an already usable identity are not additions.
- Failed/partial/unverified primary immediately enters radial recovery, retaining inherited pacing, max-patch and failure limits; the entire recovery pass is exempt from yield stopping even if it later becomes healthy.
- Merge authoritative negative evidence before deciding to stop; early stopping never creates completed patch/ring/category authority. Deferred and early-stopped phases are explicitly incomplete, distinct from coverage complete.
- Local-only preferences/exclusion/favorites/Open Now/time changes may accelerate an already deferred audit but never restart an early-stopped pass or refetch primary.
- Idle views still run the finite deferred audit; no recurring polling or idle restart. Explicit Retry or acquisition-context changes start a new pass. Cancellation clears deferred timers and suppresses obsolete callbacks.
- Known tradeoff: an omission after four zero-yield patches can be missed. Fixtures must include a fifth-patch omission and report its radial band, retained/lost useful IDs, final identity sets and avoided acquisitions. Zero yield is not proof of complete recall.

Source inspection confirms Plan thrill types haunted-house/escape-room/corn-maze; settle types movies/museum/pumpkin-patch/park. Two distinct identities are mandatory.

## Known lifecycle observation tradeoff

An authoritative negative received in any completed/requested patch is still applied before health/yield decisions, including cache-capacity-rejected responses. However, a closure that exists only in an intentionally skipped patch is unobserved: its earlier positive can remain displayed. A dedicated reference-comparison fixture proves this risk. The policy does not preserve unqueried lifecycle knowledge and is not full-recall or universal freshness parity.

## Timing and warm details

The 2s delay begins when primary settles (or covered-cache state is recognized), never before. Core counts as the first possible zero-yield patch. Healthy waits at least2s after a patch settles, hence at least2s between starts; thin/recovery retain250ms successful-settlement pauses and1s minimum outer-start spacing. Existing monotonic outer deadline survives updates/disposal. Thin-to-healthy transition resets the streak; the next four successful zero additions can stop it. Any degraded patch or useful addition resets streak. Local expiry is checked again at deferred dispatch and every settlement.

Covered radius/category disk reads avoid primary refetch and schedule only still-missing radial authority. Prior failed-primary warm-radius refetch limitation is not silently claimed fixed. A stopped pass stays stopped on local-only preference/filter/time changes; explicit Retry or acquisition selection change can start another finite pass. Anything intentionally requires a genuine Plan pair during Halloween, conservatively treating ordinary-only four-place pools without a thrill as thin.
