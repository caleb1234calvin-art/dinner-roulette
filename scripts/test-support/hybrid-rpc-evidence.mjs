import assert from "node:assert/strict";

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
  const available = primary.map(r => r.acquisition);
  for (const row of audit) {
    const a = row.acquisition;
    assert.equal(a.patchId, "radial-v1:core");
    assert.ok(a.radiusMiles <= 15);
    const match = available.findIndex(p => p.lat === a.lat && p.lon === a.lon && p.radiusMiles === a.radiusMiles &&
      JSON.stringify(p.seasonEncoding) === JSON.stringify(a.seasonEncoding) && JSON.stringify(p.activityTypes) === JSON.stringify(a.activityTypes));
    assert.ok(match >= 0, "Each audit must correspond to one distinct primary context/category acquisition");
    available.splice(match, 1);
  }
}
