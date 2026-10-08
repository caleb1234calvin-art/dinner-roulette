import { getCuratedSeasonalPlace } from "./curated-policy";
import { normalizeName } from "../utils";
import type { DateNightPlace } from "./types";

export const SEASONAL_IDENTITY_RECEIPTS_KEY = "pick-for-us-seasonal-identity-v1";
type Receipt = { canonicalId: string; reviewRevision: string; canonicalName: string };
type StoredReceipt = Receipt | { conflict: true };
const providerId = (id: string) => /^date-night-osm-(node|way|relation)-\d+$/.test(id);

function readReceipts(): Record<string, StoredReceipt> {
  try {
    const value: unknown = JSON.parse(globalThis.localStorage?.getItem(SEASONAL_IDENTITY_RECEIPTS_KEY) ?? "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const result: Record<string, StoredReceipt> = {};
    for (const [id, raw] of Object.entries(value).slice(0, 512)) {
      if (!providerId(id) || !raw || typeof raw !== "object") continue;
      if (raw.conflict === true) { result[id] = { conflict: true }; continue; }
      const current = typeof raw.canonicalId === "string" ? getCuratedSeasonalPlace(raw.canonicalId) : undefined;
      if (current?.seasonalListing && raw.reviewRevision === current.seasonalListing.reviewRevision && raw.canonicalName === current.name) {
        result[id] = { canonicalId: current.id, reviewRevision: raw.reviewRevision, canonicalName: current.name };
      }
    }
    return result;
  } catch { return {}; } // Storage unavailable or malformed: no inferred mapping.
}

/** Persist identity only after the current catalog and provider ID were actually
 * joined by the affirmative merge. Never persist a point as arrival authority.
 * Conflicting identity receipts are quarantined, not resolved by last writer. */
export function recordSeasonalIdentityReceipts(places: readonly DateNightPlace[]): void {
  const receipts = readReceipts();
  for (const place of places) {
    const current = getCuratedSeasonalPlace(place.id);
    if (!current?.seasonalListing || place.seasonalListing?.reviewRevision !== current.seasonalListing.reviewRevision ||
      !place.discoveryEvidence?.some(item => item.source === "catalog" && item.id === current.id)) continue;
    for (const evidence of place.discoveryEvidence) {
      if (evidence.source !== "osm" || !providerId(evidence.id)) continue;
      const prior = receipts[evidence.id];
      if (prior && ("conflict" in prior || prior.canonicalId !== current.id)) {
        receipts[evidence.id] = { conflict: true };
      } else receipts[evidence.id] = { canonicalId: current.id,
        reviewRevision: current.seasonalListing.reviewRevision, canonicalName: current.name };
    }
  }
  try {
    const value = JSON.stringify(Object.fromEntries(Object.entries(receipts).slice(-512)));
    if (globalThis.localStorage?.getItem(SEASONAL_IDENTITY_RECEIPTS_KEY) !== value) globalThis.localStorage?.setItem(SEASONAL_IDENTITY_RECEIPTS_KEY, value);
  } catch { /* No persistence guarantee when browser storage is unavailable. */ }
}

export function seasonalReceiptAliasIds(canonicalId: string): string[] {
  return Object.entries(readReceipts()).filter(([, receipt]) => !("conflict" in receipt) && receipt.canonicalId === canonicalId).map(([id]) => id);
}

/** Unknown historical provider bookmarks stay unmapped. A receipt must still bind
 * to this saved identity and the current reviewed revision; never guess by point. */
export function resolveSavedSeasonalPlace(saved: { restaurantId: string; name: string }): DateNightPlace | undefined {
  const direct = getCuratedSeasonalPlace(saved.restaurantId);
  if (direct) return direct;
  const receipt = readReceipts()[saved.restaurantId];
  if (!receipt || "conflict" in receipt || normalizeName(saved.name) !== normalizeName(receipt.canonicalName)) return undefined;
  return getCuratedSeasonalPlace(receipt.canonicalId);
}

export function clearSeasonalIdentityReceipts(): void {
  try { globalThis.localStorage?.removeItem(SEASONAL_IDENTITY_RECEIPTS_KEY); }
  catch { /* Existing storage restrictions remain; never manufacture a mapping. */ }
}
