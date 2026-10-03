import { requireCoordinates } from "../location/model";
import { haversineMiles } from "../restaurants/geo";
import type { ConcreteDateNightType } from "./types";

export const DATE_NIGHT_RADIAL_VERSION = "radial-v1";
export const DATE_NIGHT_RADIAL_MAX_PATCHES = 32;
const EARTH_MILES = 3958.8;
const DEG = Math.PI / 180;
const BANDS = [[15, 20, 4], [20, 30, 7], [30, 40, 9], [40, 50, 11]] as const;
const DISTANCES = [1, 3, 5, 10, 15, 20, 30, 40, 50];
type Point = { lat: number; lon: number };

export interface DateNightCoveragePatch {
  id: string;
  version: typeof DATE_NIGHT_RADIAL_VERSION;
  innerMiles: number;
  outerMiles: number;
  startBearing: number;
  endBearing: number;
  center: Point;
  radiusMeters: number;
}

/** A local orthonormal spherical frame also defines bearings at either pole. */
function frame(origin: Point) {
  const p = origin.lat * DEG, l = origin.lon * DEG;
  return {
    up: [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)],
    north: [-Math.sin(p) * Math.cos(l), -Math.sin(p) * Math.sin(l), Math.cos(p)],
    east: [-Math.sin(l), Math.cos(l), 0],
  };
}

function destination(origin: Point, miles: number, bearing: number): Point {
  const { up, north, east } = frame(origin), d = miles / EARTH_MILES, b = bearing * DEG;
  const v = up.map((u, i) => u * Math.cos(d) + (north[i]! * Math.cos(b) + east[i]! * Math.sin(b)) * Math.sin(d));
  return { lat: Math.atan2(v[2]!, Math.hypot(v[0]!, v[1]!)) / DEG, lon: Math.atan2(v[1]!, v[0]!) / DEG };
}

function bearingFrom(origin: Point, point: Point) {
  const { north, east } = frame(origin), p = point.lat * DEG, l = point.lon * DEG;
  const v = [Math.cos(p) * Math.cos(l), Math.cos(p) * Math.sin(l), Math.sin(p)];
  const dot = (a: number[]) => a.reduce((sum, x, i) => sum + x * v[i]!, 0);
  return (Math.atan2(dot(east), dot(north)) / DEG + 360) % 360;
}

export function planDateNightPatches(origin: Point, maxRadiusMiles: number): DateNightCoveragePatch[] {
  requireCoordinates(origin);
  if (!DISTANCES.includes(maxRadiusMiles)) throw new Error("Choose a valid Date Night distance");
  const patches: DateNightCoveragePatch[] = [{
    id: `${DATE_NIGHT_RADIAL_VERSION}:core`, version: DATE_NIGHT_RADIAL_VERSION,
    innerMiles: 0, outerMiles: 15, startBearing: 0, endBearing: 360,
    center: { ...origin }, radiusMeters: Math.ceil(15 * 1609.344) + 100,
  }];
  for (const [innerMiles, outerMiles, sectors] of BANDS) {
    if (innerMiles >= maxRadiusMiles) break;
    const middle = (innerMiles + outerMiles) / 2;
    // Spherical cosine distance is maximized at a radial/bearing corner for
    // these short sectors. The margin also absorbs provider Earth-model error.
    const cornerMiles = Math.max(...[innerMiles, outerMiles].map(r => EARTH_MILES * Math.acos(Math.min(1,
      Math.cos(r / EARTH_MILES) * Math.cos(middle / EARTH_MILES) +
      Math.sin(r / EARTH_MILES) * Math.sin(middle / EARTH_MILES) * Math.cos(Math.PI / sectors)))));
    for (let i = 0; i < sectors; i++) patches.push({
      id: `${DATE_NIGHT_RADIAL_VERSION}:${outerMiles}:${i}`, version: DATE_NIGHT_RADIAL_VERSION,
      innerMiles, outerMiles, startBearing: i * 360 / sectors, endBearing: (i + 1) * 360 / sectors,
      center: destination(origin, middle, (i + 0.5) * 360 / sectors),
      radiusMeters: Math.ceil(cornerMiles * 1609.344) + 100,
    });
  }
  return patches;
}

export function resolveDateNightPatch(origin: Point, maxRadiusMiles: number, patchId: unknown): DateNightCoveragePatch {
  if (typeof patchId !== "string") throw new Error("Choose a valid Date Night patch");
  const patch = planDateNightPatches(origin, maxRadiusMiles).find(p => p.id === patchId);
  if (!patch) throw new Error("Choose a valid Date Night patch");
  return patch;
}

/** Overlapping acquisition circles have disjoint positive authority. A rounded
 * nanomile boundary makes numerical round trips assign exactly one owner. */
export function dateNightPatchOwns(origin: Point, patch: DateNightCoveragePatch, point: Point): boolean {
  const distance = Math.round(haversineMiles(origin.lat, origin.lon, point.lat, point.lon) * 1e8) / 1e8;
  if (distance > patch.outerMiles || (patch.innerMiles > 0 && distance <= patch.innerMiles)) return false;
  if (patch.innerMiles === 0) return true;
  const bearing = bearingFrom(origin, point);
  return bearing >= patch.startBearing && bearing < patch.endBearing;
}

export interface DateNightPatchCoverageRecord {
  id: string;
  completeActivityTypes: ConcreteDateNightType[];
  loadingActivityTypes?: ConcreteDateNightType[];
  failedActivityTypes?: ConcreteDateNightType[];
  acquiredAt?: number;
}

export interface DateNightCoverageState {
  selectedMaxRadiusMiles: number;
  requestedActivityTypes: ConcreteDateNightType[];
  patches: (DateNightCoveragePatch & DateNightPatchCoverageRecord & { missingActivityTypes: ConcreteDateNightType[] })[];
  completePatchIds: string[];
  missingPatchIds: string[];
  failedPatchIds: string[];
  loadingPatchIds: string[];
  continuousRadiusMiles: number;
  complete: boolean;
  outerPartial: boolean;
}

export function summarizeDateNightCoverage(plan: DateNightCoveragePatch[], selectedMaxRadiusMiles: number,
  requestedActivityTypes: ConcreteDateNightType[], records: DateNightPatchCoverageRecord[]): DateNightCoverageState {
  const patches = plan.map(patch => {
    const record = records.find(r => r.id === patch.id);
    const completeActivityTypes = requestedActivityTypes.filter(t => record?.completeActivityTypes.includes(t));
    return { ...patch, ...record, completeActivityTypes,
      missingActivityTypes: requestedActivityTypes.filter(t => !completeActivityTypes.includes(t)) };
  });
  const completePatchIds = patches.filter(p => !p.missingActivityTypes.length).map(p => p.id);
  const missingPatchIds = patches.filter(p => p.missingActivityTypes.length).map(p => p.id);
  const failedPatchIds = patches.filter(p => p.missingActivityTypes.some(t => p.failedActivityTypes?.includes(t))).map(p => p.id);
  const loadingPatchIds = patches.filter(p => p.missingActivityTypes.some(t => p.loadingActivityTypes?.includes(t))).map(p => p.id);
  let continuousRadiusMiles = 0;
  for (const milestone of [15, 20, 30, 40, 50]) {
    if (milestone > Math.max(15, selectedMaxRadiusMiles)) break;
    if (patches.filter(p => p.outerMiles <= milestone).some(p => p.missingActivityTypes.length)) break;
    continuousRadiusMiles = Math.min(milestone, selectedMaxRadiusMiles);
  }
  return { selectedMaxRadiusMiles, requestedActivityTypes, patches, completePatchIds, missingPatchIds,
    failedPatchIds, loadingPatchIds, continuousRadiusMiles, complete: !missingPatchIds.length,
    outerPartial: missingPatchIds.some(id => id !== `${DATE_NIGHT_RADIAL_VERSION}:core`) };
}
