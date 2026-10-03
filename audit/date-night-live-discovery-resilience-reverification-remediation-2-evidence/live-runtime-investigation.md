# Live timeout investigation — unresolved acceptance gate

The exact c4e4266 Preview returned saved fallback after one 15-mile Anything acquisition. Four groups failed; retained runtime excerpt shows approximately8000ms attempt timeouts across the mirror schedule and12508ms total provider duration. There is no observed parser rejection. That does not distinguish provider/network availability, queueing, database cost or query expansion.

No additional public-provider requests were made. Instead, the official source repository was cloned read-only into scratch:
https://github.com/drolbr/Overpass-API
Commit: a0db4f392f744d5e1304331edbf542ef6d6ce2fa
configure.ac identifies version0.7.62. Public mirror engine versions were NOT probed.

Source observations:

- src/overpass_api/statements/item.cc: Item_Constraint chooses prefer_ranges for a named input set.
- src/overpass_api/statements/query.cc: Query_Statement::execute combines filter strategies, collects constrained elements, and applies tag filtering in filter_by_tags for prefer_ranges.
- src/overpass_api/data/tags_global_reader.h: progress_1 skips global regex-key ID collection when prefer_ranges is selected and there is no exact key/value predicate.
- Our two lifecycle output selectors have only the bounded .lifecycle_context input and regex-key/value predicates. In this inspected engine, they consequently filter the carrier set rather than globally enumerate regex-key matches.
- The carrier prelude itself still performs34 radius-bounded exact-key selections. The cost of those selections on real mirror data, repeated across four groups, was NOT measured independently.
- Existing positive query clauses, providers, deadlines, hedge offsets and cache remain unchanged.

Documentation consulted:
https://wiki.openstreetmap.org/wiki/Overpass_API/Overpass_QL
https://dev.overpass-api.de/overpass-doc/en/criteria/lrs.html
https://dev.overpass-api.de/blog/loop_and_group.html

Decision: do not introduce an unvalidated for/keys/dynamic-evaluator rewrite based solely on a timeout hypothesis, broaden positive acquisition, extend deadlines or repeatedly query public providers. Preserve deterministic GREEN and the live failure. The result is INCOMPLETE, not accepted and not frozen for reverification#3. A future bounded runtime comparison or query-cost diagnosis is required before claiming no material performance regression.

This investigation is a source-level explanation, not execution of a local Overpass database and not evidence about current public-provider health.
