import { describe, expect, it } from "vitest";
import { getEdenExample } from "./questionnaire";

describe("Eden Blueprint example", () => {
  it("builds a controlled example from workflow, volume, systems, team, and authority", () => {
    const example = getEdenExample(
      "operations",
      "101_500_weekly",
      ["email_support", "project_operations"],
      "6_20",
      "approval_gates"
    );

    expect(example).toMatchObject({
      title: "A request arrives and leaves with a clear owner.",
      context: {
        volume: "101–500 workflow runs / week",
        people: "6–20 people",
        systems: "Email, inbox, or support desk and Project or operations tools",
        authority: "Act after clear approval",
      },
    });
    expect(example.coordinationDescription).toContain("Operations specialist");
    expect(example.authorityDescription).toContain("explicit approval gate");
  });

  it("changes the scenario when the selected opportunity changes", () => {
    const revenue = getEdenExample(
      "revenue",
      "25_100_weekly",
      ["crm"],
      "2_5",
      "draft_and_review"
    );
    const leadership = getEdenExample(
      "leadership_visibility",
      "25_100_weekly",
      ["data_warehouse"],
      "2_5",
      "draft_and_review"
    );

    expect(revenue.title).toBe("A live opportunity gets the right follow-up.");
    expect(revenue.context.volume).toBe("25–100 revenue touches / week");
    expect(leadership.title).toBe(
      "A changing signal becomes a decision-ready brief."
    );
    expect(leadership.context.volume).toBe(
      "25–100 signals or decisions / week"
    );
    expect(revenue.coordinationDescription).not.toBe(
      leadership.coordinationDescription
    );
  });
});
