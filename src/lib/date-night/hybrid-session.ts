import { startDiscoveryRequest } from "../discovery/client-request";
import { createDateNightDiscoveryCache, combineDateNightDiscovery, failedDateNightAcquisition, type DateNightAcquisition } from "./cache";
import { createDateNightRadialCache, clipDateNightRadius } from "./radial-cache";
import { createDateNightRadialSession, type DateNightRadialUpdate } from "./radial-session";
import { DATE_NIGHT_RADIAL_VERSION, type DateNightCoverageState } from "./radial-plan";
import { normalizeDateNightActivityTypes } from "./query-plan";
import { localDateNightCatalog } from "./local-catalog";
import { mergeDateNight } from "./identity";
import { getDateNightAvailability } from "./availability";
import { dateNightHealthyPool, dateNightPrimaryFailed, rememberDateNightUsefulIdentities,
  DATE_NIGHT_HEALTHY_AUDIT_DELAY_MS, DATE_NIGHT_HEALTHY_AUDIT_SPACING_MS, DATE_NIGHT_ZERO_YIELD_LIMIT,
  type DateNightAuditMode, type DateNightAuditView } from "./adaptive-audit";
import type { DateNightPlace, DateNightSearchResponse } from "./types";

export type DateNightLoadPhase = "initial-loading" | "audit-deferred" | "audit-stopped" | "empty-audit-stopped" | "ready" | "background-auditing" | "background-partial" | "audit-complete" | "empty" | "unavailable";
export interface DateNightHybridUpdate {
  response: DateNightSearchResponse | null;
  loading: boolean;
  phase: DateNightLoadPhase;
  primaryPending: boolean;
  coverage?: DateNightCoverageState;
  expanding: boolean;
  error: string | null;
  auditPolicy: { mode: DateNightAuditMode; zeroYieldPatches: number; completedPatches: number; stopped: boolean };
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
  let view: DateNightAuditView | undefined;
  let auditTimer: ReturnType<typeof setTimeout> | undefined;
  let auditStopped = false, recovery = false;
  let auditMode: DateNightAuditMode = "thin";
  let zeroYieldPatches = 0, completedPatches = 0;
  let seenUseful = new Set<string>();
  let curated: DateNightPlace[] = [];
  // Preserve negative companions only for identities in the current raw primary
  // or finite local catalog. Cache LRU retires all other older positives itself;
  // this is not an accumulating session-wide tombstone registry.
  let displayNegatives: DateNightPlace[] = [];
  const signature = (q: DateNightAcquisition) => [q.lat, q.lon, q.halloweenActive, q.semanticVersion].join("/");
  const pool = (auditResponse = audit?.response) => {
    const snapshot = cache.read(query!);
    displayNegatives = mergeDateNight(displayNegatives, snapshot.negativeEvidence ?? []).filter(v => v.lifecycle);
    const displayPositives = [...curated, ...(primary?.venues ?? [])].filter(v => !v.lifecycle);
    displayNegatives = displayNegatives.filter(negative => displayPositives.some(positive =>
      mergeDateNight([positive], [negative]).length === 1));
    const venues = clipDateNightRadius(mergeDateNight([
      ...curated, ...(primary?.venues ?? []), ...(snapshot.response?.venues ?? []),
      ...(auditResponse?.venues ?? []), ...displayNegatives,
    ], []), query!);
    return { venues, snapshot };
  };
  const eligiblePool = (venues: DateNightPlace[]) => {
    if (view) return view.eligible(venues);
    const current = query!;
    const selected = normalizeDateNightActivityTypes(current.activityTypes, current.halloweenActive);
    return venues.filter(v => getDateNightAvailability({ ...v, hoursKnown: false, isOpen: false }, new Date(now())).browseEligible &&
      (v.activityTypes.some(type => selected.includes(type)) ||
        (!current.halloweenActive && selected.length === normalizeDateNightActivityTypes(["anything"], false).length &&
          v.seasonalListing?.visibility === "listing-lifecycle")));
  };
  const healthy = (venues: DateNightPlace[]) => dateNightHealthyPool(eligiblePool(venues),
    view?.selectedTypes ?? query!.activityTypes, query!.halloweenActive);
  const publish = () => {
    if (!query || !onChange) return;
    const { venues, snapshot } = pool();
    const hasUsablePool = eligiblePool(venues).length > 0;
    // Settlement ends the foreground spinner; only an eligible pool is usable.
    const foregroundComplete = settled || hasUsablePool;
    const partial = Boolean(primary?.warning || primary?.discovery?.partial || audit?.paused || audit?.coverage.failedPatchIds.length);
    const auditing = Boolean(audit && (audit.loading || audit.expanding));
    const failedPrimary = Boolean(error || primary?.discovery?.groups.some(group => group.outcome === "failed"));
    const phase: DateNightLoadPhase = !foregroundComplete ? "initial-loading"
      : !hasUsablePool ? auditStopped ? "empty-audit-stopped" : failedPrimary ? "unavailable" : "empty" : auditing ? "background-auditing"
      : audit?.coverage.complete ? "audit-complete" : auditStopped ? "audit-stopped" : auditTimer ? "audit-deferred" : partial ? "background-partial" : "ready";
    const response = foregroundComplete ? {
      venues, source: primary?.source ?? (venues.some(v => v.source !== "osm") ? "merged" : "live"),
      discovery: primary?.discovery ?? snapshot.response?.discovery,
      warning: error && !hasUsablePool ? undefined : primary?.warning ??
        (partial ? hasUsablePool
          ? "Some background coverage checks are unavailable. Available places remain usable."
          : "Some live searches are unavailable. No matching places are available yet." : undefined),
    } as DateNightSearchResponse : null;
    onChange({ response, phase, primaryPending, loading: !foregroundComplete, coverage: audit?.coverage,
      expanding: auditing, error: hasUsablePool ? null : error,
      auditPolicy: { mode: auditMode, zeroYieldPatches, completedPatches, stopped: auditStopped } });
  };
  const startAudit = (version: number) => {
    if (!query || version !== generation) return;
    clearTimeout(auditTimer); auditTimer = undefined;
    auditMode = recovery ? "recovery" : healthy(pool().venues) ? "healthy" : "thin";
    radial.update(query, { auditPolicy: { settled: state => {
      if (version !== generation) return { stop: true };
      completedPatches++;
      const eligible = eligiblePool(pool(state.response).venues);
      const additions = rememberDateNightUsefulIdentities(eligible, seenUseful);
      const nextMode: DateNightAuditMode = recovery ? "recovery" : healthy(pool(state.response).venues) ? "healthy" : "thin";
      zeroYieldPatches = !state.degraded && nextMode === "healthy" && auditMode === "healthy" && additions === 0
        ? zeroYieldPatches + 1 : 0;
      auditMode = nextMode;
      auditStopped = !state.coverage.complete && auditMode === "healthy" && zeroYieldPatches >= DATE_NIGHT_ZERO_YIELD_LIMIT;
      return { stop: auditStopped, pauseMs: auditMode === "healthy" ? DATE_NIGHT_HEALTHY_AUDIT_SPACING_MS : 0 };
    } }, request: async (acquisition, signal) => {
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
  const scheduleAudit = (version: number) => {
    if (!query || version !== generation) return;
    recovery = Boolean(error) || dateNightPrimaryFailed(primary, query.activityTypes, query.halloweenActive);
    auditMode = recovery ? "recovery" : healthy(pool().venues) ? "healthy" : "thin";
    seenUseful = new Set(); rememberDateNightUsefulIdentities(eligiblePool(pool().venues), seenUseful);
    if (auditMode === "healthy") {
      auditTimer = setTimeout(() => startAudit(version), DATE_NIGHT_HEALTHY_AUDIT_DELAY_MS);
      publish();
    } else startAudit(version);
  };
  return {
    update(acquisition: DateNightAcquisition, callbacks: { request: Request; onChange: typeof onChange; retryVersion?: number; auditView?: DateNightAuditView }) {
      const next = { ...acquisition, semanticVersion: acquisition.semanticVersion ?? DATE_NIGHT_RADIAL_VERSION,
        activityTypes: normalizeDateNightActivityTypes(acquisition.activityTypes, acquisition.halloweenActive) };
      const contextChanged = !query || signature(query) !== signature(next);
      const selectionChanged = contextChanged || query!.radiusMiles !== next.radiusMiles ||
        query!.activityTypes.join(",") !== next.activityTypes.join(",");
      const retry = retryVersion !== (callbacks.retryVersion ?? 0);
      request = callbacks.request; onChange = callbacks.onChange; view = callbacks.auditView;
      if (!selectionChanged && !retry) {
        // Local-only filters never restart a stopped pass or refetch the primary.
        // They can accelerate an already scheduled audit when the pool is thin.
        if (settled && !healthy(pool().venues) && auditTimer) {
          clearTimeout(auditTimer); auditTimer = undefined;
          auditStopped = false; zeroYieldPatches = 0; auditMode = recovery ? "recovery" : "thin";
          startAudit(generation);
        }
        publish(); return;
      }
      generation++; const version = generation;
      cleanup?.(); cleanup = undefined;
      clearTimeout(auditTimer); auditTimer = undefined;
      auditStopped = false; zeroYieldPatches = 0; completedPatches = 0;
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
      if (!primaryPending) { scheduleAudit(version); return; }
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
          scheduleAudit(version);
        },
      });
    },
    dispose() { generation++; cleanup?.(); cleanup = undefined; clearTimeout(auditTimer); auditTimer = undefined; radial.dispose(); query = undefined; },
  };
}

export function dateNightHybridProgress(phase: DateNightLoadPhase, auditing = false) {
  switch (phase) {
    case "audit-deferred": return "Ready · background coverage check scheduled";
    case "empty-audit-stopped": return "No matching date ideas available · background checks paused; coverage incomplete";
    case "audit-stopped": return "Ready · background checks paused after no new choices; coverage incomplete";
    case "empty": return auditing ? "No matching date ideas yet · checking background coverage" : "No matching date ideas available";
    case "unavailable": return auditing ? "Live discovery unavailable · checking background coverage" : "Live discovery unavailable · try again";
    case "background-auditing": return "Ready · checking background coverage";
    case "background-partial": return "Ready · some background coverage checks are unavailable";
    case "audit-complete": return "Ready · background coverage checked";
    default: return "Ready · available places";
  }
}
