import assert from "node:assert/strict";
import test from "node:test";
import { discoveryClock } from "./test-support/discovery-clock.mjs";
import { discoveryComponentHarness, discoveryModes, discoveryPayload, textOf } from "./test-support/discovery-component-harness.mjs";

for (const seasonal of [false, true]) {
  test(`Date Night ${seasonal ? 'seasonal' : 'ordinary'} partial UI preserves live picks and discloses failed groups`, async (t) => {
    const clock = discoveryClock(t);
    const h = discoveryComponentHarness(discoveryModes[1]);
    t.after(() => h.dispose());
    h.store.spookySeasonEnabled = seasonal;
    h.render();
    const result = discoveryPayload(discoveryModes[1], "live");
    result.venues[0].activityTypes = seasonal ? ["haunted-house"] : ["movies"];
    result.discovery = { partial: true, groups: [
      { id: seasonal ? "seasonal" : "culture", activityTypes: result.venues[0].activityTypes, outcome: "succeeded-nonempty" },
      { id: "outdoor", activityTypes: ["park"], outcome: "failed" },
    ] };
    result.warning = "Some live activity searches are unavailable: Park. Available live results and saved places are included; coverage may be incomplete.";
    h.requests[0].resolve(result);
    const status = await h.settle();
    assert.equal(status.loading, false);
    assert.equal(status.notices.length, 1);
    assert.equal(status.notices[0].title, "Some live searches are unavailable");
    assert.equal(status.notices[0].body, result.warning);
    const text = textOf(status.tree);
    assert.match(text, /1 activities match/);
    if (seasonal) assert.match(text, /Seasonal map listings included; current-season schedules may be unconfirmed/);
    assert.doesNotMatch(text, /Live map unavailable; using saved places/);
    h.button(status.tree, "Give us options").props.onClick();
    assert.equal(h.overlay(h.render(), "OptionsOverlay").props.restaurants[0].id, "current");
    assert.equal(clock.pending, 0);
  });
}
