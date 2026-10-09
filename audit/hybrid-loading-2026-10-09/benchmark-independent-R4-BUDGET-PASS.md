# Independent R4 benchmark budget/instrumentation review — PASS

2026-10-09 22:23 UTC. Scope: request budget, stop/recovery logic, physical-fetch metering, live-runner protocol and request-signal adapter. No live provider traffic, no production/runtime edits, no candidate safety approval implied.

Frozen inputs: hybrid-benchmark/r4-frozen/SHA256SUMS.json
SHA256: 3b98814075f2b1359f228cf36a3d4368987c82d26749cb6806061bb41277ddde
Every listed file independently rehashed and matched. Independently reran all frozen *.test.mjs: 26 PASS, 0 fail, 0 skip. Actual baseline handler adapter test uses local stub fetches only.

## Verified corrections
- Original R1 crash-after-durable-429 stop gap closed by replayed terminal threshold latch; failure-cap replay also tested. Late successes cannot clear a historical stop.
- Original R1 pending-request wall-time gap closed with active watchdog, persisted start time, restart remaining-deadline calculation, and disposal.
- Reservation synchronously appends/fsyncs before native fetch. One writer, concurrent reservations cannot exceed ceiling. Hedges/retries traverse metered global fetch. Cap denial never dispatches native fetch.
- HTTP429 latches stop and aborts outstanding work. Receipt preserves status/headers and explicitly marks body unavailable because immediate abort takes precedence; does not fabricate raw-body evidence.
- Request signal adapter preserves one module graph per acquisition case and binds each synchronously entered handler to its own request signal. Separate simultaneous handlers tested independently.
- Existing nonempty output directory is refused before schedule/results writes. Restart cannot silently overwrite prior evidence or rerun order. Ledger reopen tests retain limits, counters and stop; incomplete requests fail closed.
- Canceled per-request fallback is excluded from handler failure accounting. Canceled groups are neither success resets nor wholly failed acquisitions. Valid empty provider payload is success, malformed/remark payload is failure. Successful provider groups reset handler failure streak, not unknown/canceled states.

## Protocol boundaries
384 physical attempts maximum across all stages; HTTP429, eight consecutive physical failures, two wholly failed handler acquisitions, 30-minute wall time, safety/identity drift and owner stop remain stopping conditions. Single invocation owner; no new output path/reset/replacement run to evade stopped ledger. Any recovery requires coordinator decision with prior counters/evidence preserved.

Matrix uses 15/20/50 miles and public Columbia/Joplin/Kansas City centers, Movies live, AB/BA where preregistered. Only Columbia50 has repeated AB/BA location-specific comparison; Joplin50 AB and KansasCity50 BA are cross-location balance. Other modes are controlled/browser coverage, not live reliability proof. Existing source-configured mirrors only.

## What this PASS does not clear
No live reliability, comparative latency/recall, actual browser transport, current candidate cancellation safety, lifecycle-negative safety, full regression, publication or release gate has been passed by this review. Candidate must be immutable/clean, parent must verify exact baseline/production, and fresh independent cancellation/negative-lifecycle prechecks must PASS before any traffic. The live script requires exact candidate and corresponding approval receipt. Use only frozen reviewed harness or re-review changes. Do not claim broader source safety from the adapter test alone.

Historical R1 HOLD and intermediate R2/R3 findings remain retained, never reinterpreted as PASS.
