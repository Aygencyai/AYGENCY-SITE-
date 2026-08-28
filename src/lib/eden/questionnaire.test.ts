import { describe, expect, it } from "vitest";
import { createEdenApplicationFixture } from "./test-fixture";
import {
  getEdenBlueprintRecommendation,
  getEdenCapabilityPlan,
  getEdenExample,
  getEdenOperatingMode,
} from "./questionnaire";

describe("Eden Blueprint example", () => {
  it("builds a controlled example from the exact application facts", () => {
    const application = createEdenApplicationFixture();
    const example = getEdenExample(
      application.answers,
      application.organisation!.sizeBand,
    );

    expect(example).toMatchObject({
      context: {
        volume: "High",
        people: "11–50 people",
        systems: "Microsoft 365, Todoist, Notion, Telegram",
        serviceModel: "Managed with Aygency",
      },
    });
    expect(example.coordinationDescription).toContain("approved context");
    expect(example.controlDescription).toContain("review points");
  });

  it("recommends mobility only when the submitted outcomes include travel", () => {
    const mobility = getEdenBlueprintRecommendation([
      "protect-time",
      "coordinate-travel",
    ]);
    const executive = getEdenBlueprintRecommendation([
      "reduce-inbox-load",
      "protect-focus",
    ]);

    expect(mobility.title).toContain("travel");
    expect(executive.title).toBe("Executive coordination assistant");
    expect(executive.title).not.toContain("travel");
  });

  it("keeps the customer-maintained service preference visible", () => {
    const application = createEdenApplicationFixture();
    application.answers.operatedServiceAck = false;

    expect(getEdenOperatingMode(application.answers)).toMatchObject({
      title: "Built for you to maintain",
    });
  });

  it("turns structured priorities and workload into three controlled responsibilities", () => {
    const application = createEdenApplicationFixture();
    const plan = getEdenCapabilityPlan(application.answers);

    expect(plan.map((capability) => capability.id)).toEqual([
      "follow-through",
      "inbox",
      "meetings",
    ]);
    expect(plan[0]).toMatchObject({
      title: "Keep every commitment moving",
      signal: "High open-loop volume · 14 hrs/week",
    });
    expect(JSON.stringify(plan)).not.toContain(application.answers.currentFriction);
    expect(JSON.stringify(plan)).not.toContain(application.answers.anythingElse);
  });

  it("changes the working example when the selected first responsibility changes", () => {
    const application = createEdenApplicationFixture();
    application.answers.primaryOutcomes = ["reduce-inbox-load"];
    const inbox = getEdenExample(
      application.answers,
      application.organisation!.sizeBand,
    );

    application.answers.primaryOutcomes = ["coordinate-travel"];
    const travel = getEdenExample(
      application.answers,
      application.organisation!.sizeBand,
    );

    expect(inbox.arrivalTitle).toContain("inbox");
    expect(travel.arrivalTitle).toContain("travel");
    expect(inbox.arrivalTitle).not.toBe(travel.arrivalTitle);
  });

  it("builds a personal example when organisation context is not shared", () => {
    const application = createEdenApplicationFixture();

    expect(getEdenExample(application.answers, null).context.people).toBe(
      "Personal use",
    );
  });
});
