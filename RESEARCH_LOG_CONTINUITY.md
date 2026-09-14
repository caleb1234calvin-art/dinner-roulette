# Research & Log Continuity Master

Updated: September 14, 2026

Purpose: durable home for project-adjacent research methods, AI workflow history, prediction/coincidence records and conceptual logs that should not be mixed into production app branches.

## Prediction / coincidence log
The historical dedicated source branch was:
`log/prediction-coincidence-repository-convergence` @ `bcac3e2bb2390a3aed2140a928aa216d0e3b8d62`

That branch was pruned after its actual `PREDICTION_COINCIDENCE_LOG.md` file was copied into this durable branch. The log therefore remains directly available here rather than surviving only as a provenance pointer.

The log explicitly separates falsifiable predictions from coincidences, parallels and conceptual convergences. Preserve that distinction rather than inflating coincidences into prediction hits.

Historical entries include:
- appearing-island category-level prediction
- AI-assistant / AI-transition category-level prediction
- historical pending 2028 / Doomsday Clock prediction entry
- Nielsen Family coincidence
- “easy come, easy go” build-loss coincidence
- Blue Core Energy/reactor-feed coincidence
- independent repository/continuity-system convergence

## AI workflow / continuity philosophy
The project uses repository continuity as durable external state so individual AI sessions can be replaced without losing project history. This architecture successfully recovered a stalled Astra release-validation run by reading newer repository continuity rather than trusting a stale prompt.

Operating principle:
**AI workers are replaceable; project continuity is persistent.**

The September 14 cleanup formalized that principle by replacing many one-off task branches with five durable master continuity branches and pruning the superseded refs after consolidation.

## Research concepts worth preserving outside runtime work
- The Crumb Protocol: recursive AI-relay method for synthetic serendipity
- Mordax mythology/choice philosophy (brand details live primarily in `continuity/brand-personality`)
- broader AI relay / multi-model delegation workflow
- prediction/coincidence logging as a separate observational record

## Continuity topology
- `continuity/core` — top-level project state
- `continuity/discovery` — discovery/casino/location
- `continuity/release` — CI/Vercel/release safety
- `continuity/brand-personality` — visual identity, Mordax and marketing voice
- `continuity/research-logs` — this branch; research methods and observational logs

## Future rule
Keep speculative/research material out of `main` unless it becomes actual product functionality. Update this branch for durable research continuity and logs rather than using production branches as notebooks. Temporary experimental branches should be pruned after useful conclusions are captured here.
