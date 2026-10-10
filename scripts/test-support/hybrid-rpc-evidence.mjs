import assert from "node:assert/strict";
import { appModuleLoader } from "./load-app-module.mjs";
const { isHalloweenDateNightActive } = appModuleLoader()("src/lib/date-night/season.ts");

// Decode the actual TanStack serialized request field, not presence of its key:
// primary has patchId encoded as undefined, audit has an explicit radial ID.
export function dateNightRpcEvidence(body) {
  const envelope = JSON.parse(body);
  const property = (node, key) => {
    assert.ok(node?.p && Array.isArray(node.p.k) && Array.isArray(node.p.v), "Expected serialized object");
    const index = node.p.k.indexOf(key);
    assert.ok(index >= 0, `Missing request property ${key}`);
    return node.p.v[index];
  };
  const data = property(envelope.t, "data");
  const patch = property(data, "patchId");
  const value = (key, type) => {
    const node = property(data, key); assert.equal(node.t, type, `Unexpected ${key} encoding`); return node.s;
  };
  const types = property(data, "activityTypes");
  assert.equal(types.t, 9); assert.ok(Array.isArray(types.a));
  const activityTypes = types.a.map(n => { assert.equal(n.t, 1); assert.equal(typeof n.s, "string"); return n.s; });
  let kind, patchId;
  if (patch.t === 2 && patch.s === 1) kind = "primary";
  else { assert.equal(patch.t, 1); assert.match(patch.s, /^radial-v1:(?:core|(?:20|30|40|50):\d+)$/); kind = "audit"; patchId = patch.s; }
  return { kind, patchId, lat: value("lat", 0), lon: value("lon", 0), radiusMiles: value("radiusMiles", 0),
    seasonEncoding: property(data, "spookySeasonEnabled"), activityTypes };
}

export function assertBoundedSeasonalAudit(rpc) {
  const primary = rpc.filter(r => r.acquisition.kind === "primary");
  const audit = rpc.filter(r => r.acquisition.kind === "audit");
  assert.equal(primary.length + audit.length, rpc.length, "Every observed RPC must be classified");
  assert.ok(audit.length <= primary.length, "These <=15-mile fixtures need at most one core audit per primary acquisition");
  const effective = row => {
    assert.equal(typeof row.fixtureAt, "string", "Every RPC needs its controlled fixture clock");
    const date = new Date(row.fixtureAt);
    assert.ok(Number.isFinite(date.getTime()), "Invalid RPC fixture clock");
    const flag = row.acquisition.seasonEncoding;
    assert.equal(flag.t, 2); assert.ok(flag.s === 2 || flag.s === 3, "Invalid encoded season toggle");
    // The fixture browser calendar is UTC; do not inherit the test runner host zone.
    const calendarDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12);
    return isHalloweenDateNightActive(flag.s === 2, calendarDate);
  };
  // Both browser and disposable server use the recorded UTC fixture calendar.
  for (const row of rpc) effective(row);
  const available = [...primary];
  for (const row of audit) {
    const a = row.acquisition;
    assert.equal(a.patchId, "radial-v1:core");
    assert.ok(a.radiusMiles <= 15);
    const match = available.findIndex(candidate => {
      const p = candidate.acquisition;
      return p.lat === a.lat && p.lon === a.lon && p.radiusMiles === a.radiusMiles &&
        effective(candidate) === effective(row) && JSON.stringify(p.activityTypes) === JSON.stringify(a.activityTypes);
    });
    assert.ok(match >= 0, "Each audit must correspond to one distinct primary context/category acquisition");
    available.splice(match, 1);
  }
}

// Existing unpatched server path takes max(requested radius,15), then the
// unchanged local-catalog helper permits a one-mile raw-response margin.
// This is NOT client radius eligibility, entrance precision or coverage authority.
export function primaryCatalogEnvelopeMiles(acquisition) {
  assert.equal(acquisition.kind, "primary");
  assert.ok(Number.isFinite(acquisition.radiusMiles) && acquisition.radiusMiles >= 1 && acquisition.radiusMiles <= 50);
  return Math.max(acquisition.radiusMiles, 15) + 1;
}
