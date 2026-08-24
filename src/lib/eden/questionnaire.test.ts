import { describe, expect, it } from "vitest";
import { createEdenApplicationFixture } from "./test-fixture";
import {
  getEdenBlueprintRecommendation,
  getEdenExample,
  getEdenOperatingMode,
} from "./questionnaire";

describe("Eden Blueprint example", () => {
  it("builds a controlled example from the exact application facts", () => {
    const application = createEdenApplicationFixture();
    const example = getEdenExample(
      application.answers,
      application.organisation.sizeBand,
    );

    expect(example).toMatchObject({
      context: {
        volume: "High",
        people: "11–50 people",
        systems: "Microsoft 365, Todoist, Notion, Telegram",
        authority: "I can decide",
      },
    });
    expect(example.coordinationDescription).toContain("approved context");
    expect(example.authorityDescription).toContain("approval gates");
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

  it("keeps false acknowledgements visible as discovery work", () => {
    const application = createEdenApplicationFixture();
    application.answers.operatedServiceAck = false;

    expect(getEdenOperatingMode(application.answers)).toMatchObject({
      title: "Boundary discovery first",
    });
  });
});
