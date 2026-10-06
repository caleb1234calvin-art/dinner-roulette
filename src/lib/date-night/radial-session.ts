import { startDiscoveryRequest } from "../discovery/client-request";
import { DATE_NIGHT_CACHE_TTL_MS, type DateNightAcquisition } from "./cache";
import { createDateNightRadialCache, clipDateNightRadius } from "./radial-cache";
import { mergeDateNight } from "./identity";
import { normalizeDateNightActivityTypes } from "./query-plan";
import { DATE_NIGHT_RADIAL_MAX_PATCHES, type DateNightCoverageState, type DateNightPatchCoverageRecord } from "./radial-plan";
import type { ConcreteDateNightType, DateNightSearchResponse } from "./types";

export const DATE_NIGHT_RADIAL_PAUSE_MS = 1000;
export const DATE_NIGHT_RADIAL_SUCCESS_PAUSE_MS = 250;
export const DATE_NIGHT_RADIAL_MIN_OUTER_START_MS = 1000;
export const DATE_NIGHT_RADIAL_FAILURE_LIMIT = 3;
const PARTIAL_WARNING = "Some live date-night searches are unavailable. Showing available live results and saved places; coverage may be incomplete.";

export interface DateNightRadialUpdate {
  response: DateNightSearchResponse | null;
  coverage: DateNightCoverageState;
  loading: boolean;
  expanding: boolean;
  paused: boolean;
  error: string | null;
}
type Request = (query: DateNightAcquisition, signal: AbortSignal) => Promise<DateNightSearchResponse>;

/** One mounted-session controller. No unbounded retry, parallel patch fan-out,
 * persistent coordinates, or selection/overlay state lives here. */
export function createDateNightRadialSession({ cache = createDateNightRadialCache(), now = Date.now } = {}) {
  let query: DateNightAcquisition | undefined;
  let request: Request;
  let onChange: (state: DateNightRadialUpdate) => void;
  let retryVersion = 0;
  let inFlight: { query: DateNightAcquisition; types: ConcreteDateNightType[]; cleanup?: () => void } | undefined;
  let timer: ReturnType<typeof setTimeout> | undefined;
  // Monotonic admission deadline survives timer cancellation, compatible updates
  // and explicit retries. Core is exempt; outer starts remain at least 1s apart.
  let outerReadyAt = 0;
  let attempts = new Map<string, number>();
  let failed = new Map<string, Set<ConcreteDateNightType>>();
  let passRequests = 0, consecutiveFailures = 0;
  let paused = false;
  let coreSettled = false;
  let displayOnly: DateNightSearchResponse | null = null;
  let error: string | null = null;
  const key = (patchId: string, type: ConcreteDateNightType) => `${patchId}/${type}`;
  const sameSignature = (a: DateNightAcquisition, b: DateNightAcquisition) => a.lat === b.lat && a.lon === b.lon &&
    a.halloweenActive === b.halloweenActive && a.semanticVersion === b.semanticVersion;
  const records = (): DateNightPatchCoverageRecord[] => [...failed].map(([id, types]) => ({ id,
    completeActivityTypes: [], failedActivityTypes: [...types],
    loadingActivityTypes: inFlight?.query.patchId === id ? inFlight.types : [],
  })).concat(inFlight && !failed.has(inFlight.query.patchId!) ? [{ id: inFlight.query.patchId!,
    completeActivityTypes: [], failedActivityTypes: [], loadingActivityTypes: inFlight.types }] : []);
  const snapshot = () => cache.read(query!, records());
  const candidates = (coverage: DateNightCoverageState) => coverage.patches.map(p => ({ ...p,
    missingActivityTypes: p.missingActivityTypes.filter(type => !attempts.has(key(p.id, type))),
  })).filter(p => p.missingActivityTypes.length);

  const publish = () => {
    if (!query || !onChange) return;
    const { coverage, response, negativeEvidence } = snapshot();
    let visible = response;
    if (displayOnly) {
      const venues = clipDateNightRadius(mergeDateNight([
        ...(response?.venues ?? []), ...displayOnly.venues, ...negativeEvidence,
      ], []), query);
      visible = { ...displayOnly, venues,
        source: response ? venues.some(v => v.source !== "osm") ? "merged" : "live" : displayOnly.source,
        discovery: response?.discovery ?? displayOnly.discovery };
    }
    const hasFailure = coverage.failedPatchIds.length > 0;
    if (visible && hasFailure && response) visible = { ...visible, warning: PARTIAL_WARNING,
      discovery: { groups: visible.discovery?.groups ?? [], partial: true } };
    const ready = Boolean(visible) || (coreSettled && !inFlight);
    const expanding = !paused && Boolean(inFlight || timer || candidates(coverage).length);
    onChange({ response: visible, coverage, loading: !ready && Boolean(inFlight),
      expanding: ready && expanding, paused, error: visible ? null : error });
  };
  const cancel = () => {
    const old = inFlight;
    inFlight = undefined;
    old?.cleanup?.();
    clearTimeout(timer);
    timer = undefined;
    // Cancelled work stays missing, and may resume when explicitly needed.
    if (old) for (const type of old.types) attempts.delete(key(old.query.patchId!, type));
  };
  const next = () => {
    timer = undefined;
    if (!query || inFlight || paused) return publish();
    const { coverage } = snapshot();
    const candidate = candidates(coverage)[0];
    if (!candidate) return publish();
    if (passRequests >= DATE_NIGHT_RADIAL_MAX_PATCHES) { paused = true; return publish(); }
    // A failed/missing core cannot be bypassed by starting outer work.
    if (candidate.innerMiles > 0 && coverage.patches[0]!.missingActivityTypes.length) {
      paused = true;
      return publish();
    }
    if (candidate.innerMiles > 0) {
      const wait = outerReadyAt - performance.now();
      if (wait > 0) { timer = setTimeout(next, wait); return publish(); }
      outerReadyAt = performance.now() + DATE_NIGHT_RADIAL_MIN_OUTER_START_MS;
    }
    const flight = { query: { ...query, patchId: candidate.id, activityTypes: candidate.missingActivityTypes },
      types: candidate.missingActivityTypes, cleanup: undefined as (() => void) | undefined };
    inFlight = flight;
    passRequests++;
    for (const type of flight.types) attempts.set(key(candidate.id, type), now());
    let degraded = false;
    flight.cleanup = startDiscoveryRequest({ mode: "date-night",
      request: signal => request(flight.query, signal),
      onSuccess: result => {
        if (inFlight !== flight) return;
        cache.store(flight.query, result);
        const after = snapshot().coverage.patches.find(p => p.id === candidate.id)!;
        const missing = flight.types.filter(t => after.missingActivityTypes.includes(t));
        degraded = missing.length > 0;
        const failures = failed.get(candidate.id) ?? new Set<ConcreteDateNightType>();
        for (const type of flight.types) {
          if (missing.includes(type)) failures.add(type);
          else failures.delete(type);
        }
        failed.set(candidate.id, failures);
        if (!candidate.innerMiles) {
          coreSettled = true;
          // A legacy response can be displayed, but never becomes patch proof.
          // Saved fallback rows from failed categories do not assert coverage.
          displayOnly = !result.patch || result.source === "fallback" ? result : {
            ...result, venues: result.venues.filter(v => v.source !== "osm" && v.activityTypes.some(t => missing.includes(t))),
          };
          if (!displayOnly.venues.length && result.patch && result.source !== "fallback") displayOnly = null;
        }
        error = null;
      },
      onError: failure => {
        if (inFlight !== flight) return;
        degraded = true;
        const failures = failed.get(candidate.id) ?? new Set<ConcreteDateNightType>();
        flight.types.forEach(t => failures.add(t));
        failed.set(candidate.id, failures);
        if (!candidate.innerMiles) coreSettled = true;
        error = failure instanceof Error ? failure.message : "Could not load date-night activities";
      },
      onSettled: () => {
        if (inFlight !== flight) return;
        inFlight = undefined;
        consecutiveFailures = degraded ? consecutiveFailures + 1 : 0;
        const after = snapshot().coverage;
        if ((!candidate.innerMiles && after.patches[0]!.missingActivityTypes.length) || consecutiveFailures >= DATE_NIGHT_RADIAL_FAILURE_LIMIT) paused = true;
        const pause = degraded ? DATE_NIGHT_RADIAL_PAUSE_MS : DATE_NIGHT_RADIAL_SUCCESS_PAUSE_MS;
        outerReadyAt = Math.max(outerReadyAt, performance.now() + pause);
        if (!paused && candidates(after).length) timer = setTimeout(next, outerReadyAt - performance.now());
        publish();
      },
    });
    publish();
  };
  return {
    update(acquisition: DateNightAcquisition, callbacks: { request: Request; onChange: typeof onChange; retryVersion?: number }) {
      const compatible = query && sameSignature(query, acquisition);
      const retry = callbacks.retryVersion !== undefined && callbacks.retryVersion !== retryVersion;
      request = callbacks.request;
      onChange = callbacks.onChange;
      retryVersion = callbacks.retryVersion ?? 0;
      query = { ...acquisition, activityTypes: normalizeDateNightActivityTypes(acquisition.activityTypes, acquisition.halloweenActive) };
      if (!compatible) {
        cancel(); attempts = new Map(); failed = new Map(); passRequests = 0; consecutiveFailures = 0;
        paused = false; coreSettled = false; displayOnly = null; error = null;
      } else {
        for (const [id, at] of attempts) if (now() < at || now() - at >= DATE_NIGHT_CACHE_TTL_MS) attempts.delete(id);
        if (retry) {
          attempts.clear(); failed.clear(); passRequests = 0; consecutiveFailures = 0; paused = false; error = null;
        }
        const current = snapshot().coverage;
        const needed = inFlight && current.patches.find(p => p.id === inFlight!.query.patchId);
        const requested = normalizeDateNightActivityTypes(query.activityTypes, query.halloweenActive);
        if (inFlight && (!needed || !inFlight.types.every(t => requested.includes(t)))) cancel();
        // A completed/smaller view may resume genuinely new, unattempted work.
        // Failed categories remain attempted until explicit retry or TTL expiry.
        if (passRequests < DATE_NIGHT_RADIAL_MAX_PATCHES && consecutiveFailures < DATE_NIGHT_RADIAL_FAILURE_LIMIT) paused = false;
        if (!current.patches[0]!.missingActivityTypes.length) coreSettled = true;
      }
      if (!inFlight) { clearTimeout(timer); timer = undefined; next(); }
      else publish();
    },
    dispose() { cancel(); query = undefined; },
  };
}

export function dateNightRadialProgress(coverage: DateNightCoverageState, expanding: boolean) {
  const radius = coverage.continuousRadiusMiles;
  if (coverage.complete) return `Loaded through ${coverage.selectedMaxRadiusMiles} miles`;
  const prefix = radius ? `Loaded through ${radius} miles` : "Nearby coverage is incomplete";
  if (expanding) return `${prefix} · expanding toward ${coverage.selectedMaxRadiusMiles} miles…`;
  return `${prefix} · ${radius ? "some outer areas could not be loaded" : "some areas could not be loaded"}`;
}
