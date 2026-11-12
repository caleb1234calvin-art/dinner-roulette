import assert from "node:assert/strict";

/** Reverse only the explicitly reviewed provider-evidence transport additions.
 * Every replacement must occur once; all remaining bytes still face the
 * immutable ordinary/Halloween receipts. No runtime git diff or new baseline. */
export function christmasProviderSourceBefore(path, bytes) {
  let source = bytes.toString();
  const replaceExact = (after, before = "") => {
    assert.equal(source.split(after).length, 2, `${path}: one exact provider-evidence amendment: ${after}`);
    source = source.replace(after, before);
  };
  if (["src/lib/date-night/cache.ts", "src/lib/date-night/radial-cache.ts", "src/lib/date-night/radial-session.ts"].includes(path))
    replaceExact('import { attachDateNightIdentityObservations, mergeDateNightIdentityObservations } from "./source-observations";\n');
  if (path === "src/lib/date-night/cache.ts") {
    replaceExact("  DateNightEvidence,\n");
    replaceExact("  identityObservations?: DateNightEvidence[];\n");
    replaceExact("  identityObservations: DateNightEvidence[];\n");
    replaceExact(`  const identityObservations = mergeDateNightIdentityObservations(snapshot.identityObservations, snapshot.response?.identityObservations, fresh.identityObservations);
  const observed = (venues: DateNightPlace[]) => attachDateNightIdentityObservations(canonicalMerge(venues), identityObservations);
  if (!snapshot.response) return identityObservations.length || snapshot.negativeEvidence?.length
    ? { ...fresh, venues: observed([...fresh.venues, ...(snapshot.negativeEvidence ?? [])]),
      ...(identityObservations.length ? { identityObservations } : {}) }
    : fresh;
  const venues = observed([...snapshot.response.venues, ...fresh.venues, ...(snapshot.negativeEvidence ?? [])]);
  // Legacy responses can still be displayed, but cannot assert category coverage.
  if (!fresh.discovery) return { venues, source: liveSource(venues), warning: fresh.warning,
    ...(identityObservations.length ? { identityObservations } : {}) };
  const groups = [...snapshot.response.discovery!.groups, ...fresh.discovery.groups];
  const partial = groups.some((group) => group.outcome === "failed" || group.outcome === "cancelled");
  return { venues, source: liveSource(venues), warning: partial ? PARTIAL_WARNING : undefined,
    ...(identityObservations.length ? { identityObservations } : {}),
    discovery: { groups, partial } };`,
    `  if (!snapshot.response) return snapshot.negativeEvidence?.length
    ? { ...fresh, venues: canonicalMerge([...fresh.venues, ...snapshot.negativeEvidence]) }
    : fresh;
  const venues = canonicalMerge([...snapshot.response.venues, ...fresh.venues, ...(snapshot.negativeEvidence ?? [])]);
  // Legacy responses can still be displayed, but cannot assert category coverage.
  if (!fresh.discovery) return { venues, source: liveSource(venues), warning: fresh.warning };
  const groups = [...snapshot.response.discovery!.groups, ...fresh.discovery.groups];
  const partial = groups.some((group) => group.outcome === "failed" || group.outcome === "cancelled");
  return { venues, source: liveSource(venues), warning: partial ? PARTIAL_WARNING : undefined,
    discovery: { groups, partial } };`);
    replaceExact(`  const evidenceCount = (entry: CacheEntry) => mergeDateNightIdentityObservations(entry.identityObservations,
    ...entry.venues.map(place => place.discoveryEvidence)).length;
`);
    replaceExact(`      const identityObservations = mergeDateNightIdentityObservations(...entries.filter(entry => sameSignature(entry, query))
        .map(entry => entry.identityObservations));
`);
    replaceExact(`      if (!selected.size) return { response: null, missingActivityTypes, negativeEvidence,
        ...(identityObservations.length ? { identityObservations } : {}) };`,
    "      if (!selected.size) return { response: null, missingActivityTypes, negativeEvidence };");
    replaceExact("      const venues = attachDateNightIdentityObservations(canonicalMerge([...usedEntries.flatMap((entry) => {",
      "      const venues = canonicalMerge([...usedEntries.flatMap((entry) => {");
    replaceExact(`      }), ...negativeEvidence]), identityObservations);
      return { missingActivityTypes, negativeEvidence, ...(identityObservations.length ? { identityObservations } : {}),
        acquiredAt: Math.min(...usedEntries.map(entry => entry.acquiredAt)),
        response: { venues, source: liveSource(venues), ...(identityObservations.length ? { identityObservations } : {}), discovery: { groups, partial: false } } };`,
    `      }), ...negativeEvidence]);
      return { missingActivityTypes, negativeEvidence,
        acquiredAt: Math.min(...usedEntries.map(entry => entry.acquiredAt)),
        response: { venues, source: liveSource(venues), discovery: { groups, partial: false } } };`);
    replaceExact(`      if (response.source === "fallback" || !response.discovery || response.venues.length > maxVenues ||
          (response.identityObservations?.length ?? 0) > maxVenues) return false;`,
    '      if (response.source === "fallback" || !response.discovery || response.venues.length > maxVenues) return false;');
    replaceExact("        identityObservations: mergeDateNightIdentityObservations(response.identityObservations),\n");
    replaceExact(`      // Compose source facts back onto the exact existing records, not only the
      // transient read result. Standalone evidence may expire or be evicted,
      // but cannot make a retained venue forget a contradiction it has received.
      // A genuinely new acquisition replaces its category authority normally.
      const scoped = entries.filter(entry => sameSignature(entry, query));
      const observations = mergeDateNightIdentityObservations(...scoped.map(entry => entry.identityObservations));
      for (const entry of scoped) entry.venues = attachDateNightIdentityObservations(entry.venues, observations);
      while (entries.length > maxEntries || entries.reduce((sum, entry) => sum + entry.venues.length, 0) > maxVenues ||
          entries.reduce((sum, entry) => sum + evidenceCount(entry), 0) > maxVenues) {`,
    "      while (entries.length > maxEntries || entries.reduce((sum, entry) => sum + entry.venues.length, 0) > maxVenues) {");
  } else if (path === "src/lib/date-night/radial-cache.ts") {
    replaceExact(`      const identityObservations = mergeDateNightIdentityObservations(...snapshots.map(({ snapshot }) => snapshot.identityObservations));
      const allVenues = attachDateNightIdentityObservations(mergeDateNight([...successful.flatMap(r => r.venues), ...negativeEvidence]
        .sort((a, b) => a.id.localeCompare(b.id) || JSON.stringify(a).localeCompare(JSON.stringify(b))), []), identityObservations);`,
    `      const allVenues = mergeDateNight([...successful.flatMap(r => r.venues), ...negativeEvidence]
        .sort((a, b) => a.id.localeCompare(b.id) || JSON.stringify(a).localeCompare(JSON.stringify(b))), []);`);
    replaceExact("        venues, source, ...(identityObservations.length ? { identityObservations } : {}), discovery:", "        venues, source, discovery:");
    replaceExact("      return { coverage, response, negativeEvidence, ...(identityObservations.length ? { identityObservations } : {}) };",
      "      return { coverage, response, negativeEvidence };");
  } else if (path === "src/lib/date-night/radial-session.ts") {
    replaceExact(`    const { coverage, response, negativeEvidence, identityObservations: cachedObservations } = snapshot();
    const identityObservations = mergeDateNightIdentityObservations(cachedObservations, displayOnly?.identityObservations);
    // Presentation-only rows have no cache entry to retain composed evidence.
    // Keep actual source observations with these bounded records until a fresh
    // acquisition replaces them; expiry cannot silently restore old authority.
    if (displayOnly) displayOnly = { ...displayOnly,
      venues: attachDateNightIdentityObservations(displayOnly.venues, identityObservations) };
    savedPool = attachDateNightIdentityObservations(savedPool, identityObservations);`,
    "    const { coverage, response, negativeEvidence } = snapshot();");
    replaceExact(`    if (visible && identityObservations.length) visible = { ...visible, identityObservations,
      venues: attachDateNightIdentityObservations(visible.venues, identityObservations) };
`);
  } else if (path === "src/lib/date-night/identity.ts") {
    replaceExact('import { boundDateNightIdentityEvidence } from "./source-observations";\n');
    replaceExact(`  const bounded = boundDateNightIdentityEvidence([...new Map(evidence.map((item) => [JSON.stringify(item), item])).values()]
    .sort((x, y) => JSON.stringify(x).localeCompare(JSON.stringify(y))));
  const discoveryEvidence = bounded.evidence;`,
    `  const discoveryEvidence = [...new Map(evidence.map((item) => [JSON.stringify(item), item])).values()]
    .sort((x, y) => JSON.stringify(x).localeCompare(JSON.stringify(y)));`);
    replaceExact("    ...(a.identityObservationOverflow || b.identityObservationOverflow || bounded.overflow ? { identityObservationOverflow: true as const } : {}),\n");
  }
  return Buffer.from(source);
}
