import { describe, expect, it } from "vitest";
import { growthLever, weeklyHoursRange, weeklyTeamHours } from "./estimate";

describe("weeklyTeamHours", () => {
  it("multiplies people and hours midpoints across ticked areas", () => {
    expect(
      weeklyTeamHours({
        areas: ["admin", "enquiries"],
        areaDetails: {
          admin: { people: "2-3", hours: "5-10", doer: "admin" },
          enquiries: { people: "1", hours: "10-20", doer: "manager" },
        },
      })
    ).toBe(2.5 * 7.5 + 15);
  });

  it("ignores ticked areas with no detail yet", () => {
    expect(weeklyTeamHours({ areas: ["admin"], areaDetails: {} })).toBe(0);
  });
});

describe("weeklyHoursRange", () => {
  it("returns null when there is nothing to estimate", () => {
    expect(weeklyHoursRange({ areas: [], areaDetails: {} })).toBeNull();
  });

  it("rounds to fives and never collapses to a single number", () => {
    const range = weeklyHoursRange({
      areas: ["reporting"],
      areaDetails: { reporting: { people: "1", hours: "under_2", doer: "senior" } },
    });
    expect(range).toEqual({ low: 5, high: 10 });
  });
});

describe("growthLever", () => {
  it("picks replies when enquiries would slip and replies are slow", () => {
    expect(growthLever({ blockers: ["admin"], doubled: "drop", replySpeed: "next_day" })).toBe("replies");
  });

  it("picks capacity when doubling means hiring", () => {
    expect(growthLever({ blockers: ["no_time_marketing"], doubled: "hire", replySpeed: "minutes" })).toBe(
      "capacity"
    );
  });

  it("falls back to the first blocker", () => {
    expect(growthLever({ blockers: ["numbers_unclear"], doubled: "handle", replySpeed: "minutes" })).toBe(
      "visibility"
    );
  });
});
