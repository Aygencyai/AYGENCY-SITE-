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
      title: "A project update becomes a clear next action.",
      context: {
        volume: "101–500 tasks or hand-offs / week",
        people: "A team of 6–20",
        systems:
          "Email, calendar, or support inbox and Project or task management",
        authority: "Act after clear approval",
      },
    });
    expect(example.coordinationDescription).toContain("connected tools");
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

    expect(revenue.title).toBe(
      "A reply lands and Eden keeps the conversation moving."
    );
    expect(revenue.context.volume).toBe(
      "25–100 conversations or follow-ups / week"
    );
    expect(leadership.title).toBe(
      "The day starts with a focused brief and clear priorities."
    );
    expect(leadership.context.volume).toBe(
      "25–100 updates, meetings, or priorities / week"
    );
    expect(revenue.coordinationDescription).not.toBe(
      leadership.coordinationDescription
    );
  });
});
