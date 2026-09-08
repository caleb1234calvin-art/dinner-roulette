import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getSeasonalDateStatus,
  hasDistinctHalloweenPlanPair,
  hasSeasonalAvailabilityRecord,
  isDateNightOpenNowEligible,
} from "./availability.ts";

describe("seasonal date-night availability", () => {
  it("keeps The Werehouse closed before its verified 2026 season starts", () => {
    assert.equal(
      getSeasonalDateStatus("date-night-werehouse-joplin", new Date(2026, 8, 24, 20, 0)),
      "unavailable",
    );
  });

  it("allows The Werehouse during the conservative verified season window", () => {
    assert.equal(
      getSeasonalDateStatus("date-night-werehouse-joplin", new Date(2026, 8, 25, 20, 0)),
      "available",
    );
    assert.equal(
      getSeasonalDateStatus("date-night-werehouse-joplin", new Date(2026, 9, 31, 20, 0)),
      "available",
    );
  });

  it("closes The Werehouse after the conservative verified window", () => {
    assert.equal(
      getSeasonalDateStatus("date-night-werehouse-joplin", new Date(2026, 10, 1, 20, 0)),
      "unavailable",
    );
  });

  it("keeps Myer's Inn unconfirmed until a 2026 calendar is verified", () => {
    assert.equal(hasSeasonalAvailabilityRecord("date-night-myers-inn-carthage"), true);
    assert.equal(
      getSeasonalDateStatus("date-night-myers-inn-carthage", new Date(2026, 9, 10, 20, 0)),
      "unconfirmed",
    );
  });

  it("fails closed for Open now when hours or the seasonal date are not confirmed", () => {
    assert.equal(
      isDateNightOpenNowEligible(
        { id: "date-night-myers-inn-carthage", hoursKnown: false, isOpen: true },
        true,
        new Date(2026, 9, 10, 20, 0),
      ),
      false,
    );
    assert.equal(
      isDateNightOpenNowEligible(
        { id: "date-night-werehouse-joplin", hoursKnown: true, isOpen: true },
        true,
        new Date(2026, 8, 24, 20, 0),
      ),
      false,
    );
    assert.equal(
      isDateNightOpenNowEligible(
        { id: "date-night-werehouse-joplin", hoursKnown: true, isOpen: true },
        true,
        new Date(2026, 8, 25, 20, 0),
      ),
      true,
    );
  });

  it("requires different real venues for a Scare/Settle pair", () => {
    assert.equal(hasDistinctHalloweenPlanPair([{ id: "thrill" }], [{ id: "settle" }]), true);
    assert.equal(hasDistinctHalloweenPlanPair([{ id: "same" }], [{ id: "same" }]), false);
    assert.equal(hasDistinctHalloweenPlanPair([], [{ id: "settle" }]), false);
    assert.equal(hasDistinctHalloweenPlanPair([{ id: "thrill" }], []), false);
  });
});
