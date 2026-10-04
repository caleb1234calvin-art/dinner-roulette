import { createHash } from "node:crypto";
import { normalizeDisplay } from "./schema.ts";

// Contract arrays are sets; calendar order has no meaning. No locale-dependent sorting.
export function canonical(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonical).sort().join(",")}]`;
  if (value !== null && typeof value === "object") return `{${Object.entries(value)
    .sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0)
    .map(([k, v]) => `${JSON.stringify(k)}:${canonical(v)}`).join(",")}}`;
  if (value === undefined || (typeof value === "number" && !Number.isFinite(value))) throw new Error("Non-JSON value");
  return JSON.stringify(value);
}
export const digest = (value: unknown) => createHash("sha256").update(canonical(value)).digest("hex");
export const artifactDigest = (value: unknown) => createHash("sha256").update(canonical(value) + "\n").digest("hex");
export const stableId = (kind: string, immutableKey: unknown) => `${kind}:${digest(immutableKey)}`;
export const occurrenceId = (attractionId: string, season: string, year: number, key: string) =>
  stableId("occ", { attractionId, season, year, key });
export const addressFingerprint = (address: unknown) => digest(typeof address === "object" && address !== null
  ? Object.fromEntries(Object.entries(address).map(([k, v]) => [k, normalizeDisplay(String(v)).toLowerCase()])) : address);
