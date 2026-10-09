import { startDiscoveryRequest } from "../discovery/client-request";
import { createDateNightDiscoveryCache, combineDateNightDiscovery, failedDateNightAcquisition, type DateNightAcquisition } from "./cache";
import { createDateNightRadialCache, clipDateNightRadius } from "./radial-cache";
import { createDateNightRadialSession, type DateNightRadialUpdate } from "./radial-session";
import { DATE_NIGHT_RADIAL_VERSION, type DateNightCoverageState } from "./radial-plan";
import { normalizeDateNightActivityTypes } from "./query-plan";
import { localDateNightCatalog } from "./local-catalog";
import { mergeDateNight } from "./identity";
import { getDateNightAvailability } from "./availability";
import type { DateNightPlace, DateNightSearchResponse } from "./types";

export type DateNightLoadPhase = "initial-loading" | "ready" | "background-auditing" | "background-partial" | "audit-complete";
export interface DateNightHybridUpdate {
  response: DateNightSearchResponse | null;
  loading: boolean;
  phase: DateNightLoadPhase;
  primaryPending: boolean;
  coverage?: DateNightCoverageState;
  expanding: boolean;
  error: string | null;
}
type Request = (query: DateNightAcquisition, signal: AbortSignal) => Promise<DateNightSearchResponse>;

/** Radial discovery becomes an audit layer. Disk coverage and patch coverage
 * remain separate positive authorities; both share lifecycle-negative authority.
 * This controller owns acquisition only, never the user's open decision. */
export function createDateNightHybridSession({ now = Date.now,
  cache = createDateNightDiscoveryCache({ maxEntries: 128, now }),
} = {}) {
  const radialCache = createDateNightRadialCache({}, cache);
  const radial = createDateNightRadialSession({ cache: radialCache, now });
  let query: DateNightAcquisition | undefined;
  let onChange: (state: DateNightHybridUpdate) => void;
  let request: Request;
  let generation = 0;
  let cleanup: (() => void) | undefined;
  let primaryPending = false;
  let settled = false;
  let primary: DateNightSearchResponse | null = null;
  let audit: DateNightRadialUpdate | undefined;
  let error: string | null = null;
  let retryVersion = 0;
  let curated: DateNightPlace[] = [];
  // Preserve negative companions only for identities in the current raw primary
  // or finite local catalog. Cache LRU retires all other older positives itself;
  // this is not an accumulating session-wide tombstone registry.
  let displayNegatives: DateNightPlace[] = [];
  const signature = (q: DateNightAcquisition) => [q.lat, q.lon, q.halloweenActive, q.semanticVersion].join("/");
  const publish = () => {
    if (!query || !onChange) return;
    const current = query;
    const snapshot = cache.read(query);
    displayNegatives = mergeDateNight(displayNegatives, snapshot.negativeEvidence ?? []).filter(v => v.lifecycle);
    const displayPositives = [...curated, ...(primary?.venues ?? [])].filter(v => !v.lifecycle);
    displayNegatives = displayNegatives.filter(negative => displayPositives.some(positive =>
      mergeDateNight([positive], [negative]).length === 1));
    const venues = clipDateNightRadius(mergeDateNight([
      ...curated, ...(primary?.venues ?? []), ...(snapshot.response?.venues ?? []),
      ...(audit?.response?.venues ?? []), ...displayNegatives,
    ], []), query);
    const selected = normalizeDateNightActivityTypes(query.activityTypes, query.halloweenActive);
    const hasUsablePool = venues.some(v => getDateNightAvailability({ ...v, hoursKnown: false, isOpen: false }, new Date(now())).browseEligible &&
      (v.activityTypes.some(type => selected.includes(type)) ||
        (!current.halloweenActive && selected.length === normalizeDateNightActivityTypes(["anything"], false).length &&
          v.seasonalListing?.visibility === "listing-lifecycle")));
    const ready = settled || hasUsablePool;
    const partial = Boolean(primary?.warning || primary?.discovery?.partial || audit?.paused || audit?.coverage.failedPatchIds.length);
    const auditing = Boolean(audit && (audit.loading || audit.expanding));
    const phase: DateNightLoadPhase = !ready ? "initial-loading" : auditing ? "background-auditing"
      : audit?.coverage.complete ? "audit-complete" : partial ? "background-partial" : "ready";
    const response = ready ? {
      venues, source: primary?.source ?? (venues.some(v => v.source !== "osm") ? "merged" : "live"),
      discovery: primary?.discovery ?? snapshot.response?.discovery,
      warning: error && !hasUsablePool ? undefined : primary?.warning ??
        (partial ? "Some background coverage checks are unavailable. Available places remain usable." : undefined),
    } as DateNightSearchResponse : null;
    onChange({ response, phase, primaryPending, loading: !ready, coverage: audit?.coverage,
      expanding: auditing, error: hasUsablePool ? null : error });
  };
  const startAudit = (version: number) => {
    if (!query || version !== generation) return;
    radial.update(query, { request: async (acquisition, signal) => {
      const result = await request(acquisition, signal);
      // Radial positive admission can reject an oversized response. Retain its
      // valid negative companions for the current display before that decision.
      if (version === generation && !signal.aborted) {
        displayNegatives = mergeDateNight(displayNegatives, result.venues.filter(v => v.lifecycle));
      }
      return result;
    }, retryVersion, onChange: state => {
      if (version !== generation) return;
      audit = state;
      displayNegatives = mergeDateNight(displayNegatives, state.response?.venues.filter(v => v.lifecycle) ?? []);
      publish();
    } });
  };
  return {
    update(acquisition: DateNightAcquisition, callbacks: { request: Request; onChange: typeof onChange; retryVersion?: number }) {
      const next = { ...acquisition, semanticVersion: acquisition.semanticVersion ?? DATE_NIGHT_RADIAL_VERSION,
        activityTypes: normalizeDateNightActivityTypes(acquisition.activityTypes, acquisition.halloweenActive) };
      const contextChanged = !query || signature(query) !== signature(next);
      const selectionChanged = contextChanged || query!.radiusMiles !== next.radiusMiles ||
        query!.activityTypes.join(",") !== next.activityTypes.join(",");
      const retry = retryVersion !== (callbacks.retryVersion ?? 0);
      request = callbacks.request; onChange = callbacks.onChange;
      if (!selectionChanged && !retry) { publish(); return; }
      generation++; const version = generation;
      cleanup?.(); cleanup = undefined;
      // Keep the controller's monotonic outer admission deadline across rapid
      // updates, while cancelling obsolete work and replacing its callbacks.
      radial.dispose();
      query = next; retryVersion = callbacks.retryVersion ?? 0;
      if (contextChanged) displayNegatives = [];
      curated = localDateNightCatalog(next.lat, next.lon, next.radiusMiles, next.halloweenActive);
      audit = undefined; error = null;
      const snapshot = cache.read(next);
      primary = snapshot.response;
      primaryPending = snapshot.missingActivityTypes.length > 0;
      settled = !primaryPending;
      publish();
      if (!primaryPending) { startAudit(version); return; }
      const requested = { ...next, activityTypes: snapshot.missingActivityTypes };
      cleanup = startDiscoveryRequest({ mode: "date-night",
        request: signal => request(requested, signal),
        onSuccess: result => {
          if (version !== generation) return;
          displayNegatives = mergeDateNight(displayNegatives, result.venues.filter(v => v.lifecycle));
          const currentSnapshot = cache.read(next);
          cache.store(requested, result);
          // Read again: do not extend TTL using the snapshot from request start.
          primary = combineDateNightDiscovery(currentSnapshot, result);
        },
        onError: failure => {
          if (version !== generation) return;
          error = failure instanceof Error ? failure.message : "Could not load date-night activities";
          primary = combineDateNightDiscovery(cache.read(next), failedDateNightAcquisition(requested));
          primary.warning = "Live discovery is unavailable. Showing available saved places.";
        },
        onSettled: () => {
          if (version !== generation) return;
          primaryPending = false; settled = true; cleanup = undefined;
          publish();
          startAudit(version);
        },
      });
    },
    dispose() { generation++; cleanup?.(); cleanup = undefined; radial.dispose(); query = undefined; },
  };
}

export function dateNightHybridProgress(phase: DateNightLoadPhase) {
  switch (phase) {
    case "background-auditing": return "Ready · checking background coverage";
    case "background-partial": return "Ready · some background coverage checks are unavailable";
    case "audit-complete": return "Ready · background coverage checked";
    default: return "Ready · available places";
  }
}
