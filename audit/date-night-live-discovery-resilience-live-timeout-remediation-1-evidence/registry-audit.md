# Finite carrier registry audit before implementation

Authority: 67e91ca0839760ce77e07706d69d5093c38352cb. Base: e8730f7e44ba48a78a3335657190f7e5aaf82d7b. Source: lifecycle.ts CLASSIFICATION_CONTEXTS; checked against search.ts classify and provider-evidence.ts seasonalTypes. No public-provider traffic.

| Active key | Complete finite values | Count | Positive overlap | Equality equivalence |
| --- | --- | ---: | --- | --- |
| leisure | bowling_alley, amusement_arcade, miniature_golf, escape_game, ice_rink, park, maze | 7 | Ordinary categories; seasonal context | Exact case-sensitive strings |
| amenity | cinema | 1 | Movies | Exact case-sensitive string |
| tourism | museum, theme_park, attraction, farm | 4 | Museum; seasonal context | Exact case-sensitive strings |
| attraction | haunted_house, haunted_trail, haunted_forest, haunted_attraction, corn_maze, maize_maze, maze, pumpkin_patch | 8 | Seasonal exact activity and maze context | Exact case-sensitive strings |
| sport | roller_skating | 1 | Skating | Exact case-sensitive string |
| landuse | farmyard, farmland | 2 | Seasonal context | Exact case-sensitive strings |

All 23 values use literal lowercase ASCII/underscore tokens; there are no flags, wildcards, escaping, whitespace normalization or open-ended alternatives. The existing anchored case-sensitive POSIX alternations have exactly these finite languages. Active acquisition may safely use 23 equality selectors instead of six regex selectors. The registry will use arrays so exact values are explicit, with the same arrays joined only for prefixed compact acquisition.

Each independent group repeats the entire carrier. Keep that ownership: no shared request, prerequisite, response cache, category expansion or change to coverage/cancellation. Context overlap with affirmative acquisition is intentionally retained; deduplication would be a separate design change.

The 28 prefixed carrier selectors (seven prefixes × four reconstructable classifier keys) remain compact finite-value regex acquisition. They address specific lifecycle namespaces rather than the six common active keys. These regexes are not mathematically necessary: equality expansion is possible, but would turn 28 clauses into 140, substantially expanding all four queries beyond this narrow common-key remediation. They are retained as an explicit scope/query-size tradeoff, not misrepresented as arbitrary-suffix requirements or as cost-free. Their index cardinalities/performance are not measured here.

Two lifecycle predicates remain regexes on the named carrier set. These are semantically necessary to preserve the open-ended permanent-prefix suffix vocabulary and every nonempty value except case-insensitive no/false/0. No finite suffix/value list can replace those predicates equivalently. Inactive-family suffixes remain restricted to four classifier keys. Helper normalization and terminal precedence are unchanged.

Remaining positive-query regexes are also preserved byte-for-byte by scope: selected attraction alternation, corn/maize subtype/crop checks, and four named-set prose predicates. Finite positive alternations could separately be expanded, but the controlling task prohibits positive-query changes; prose requires regex matching. A machine-readable per-group inventory records every regex statement before and after.

Baseline mechanism: six common active-key exact-key/regex-value selectors per group; 24 across four groups and a theoretical 96 across four mirrors. Pinned upstream diagnosis shows whole-key get_k_req versus exact-value get_kv_req. Exact equality removes that avoidable path for all finite active carrier values; it does not prove public mirror versions or future latency. Prior source/probe evidence remains unchanged.
