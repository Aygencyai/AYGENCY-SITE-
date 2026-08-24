import { describe, expect, it } from "vitest";
import { edenApplicationSchema } from "./application-schema";
import { createEdenApplicationFixture } from "./test-fixture";

describe("edenApplicationSchema", () => {
  it("accepts the complete contract without rewriting original answers", () => {
    const application = createEdenApplicationFixture();
    application.answers.desiredOutcome =
      "  Keep this deliberate leading space in the original answer.";

    const parsed = edenApplicationSchema.parse(application);

    expect(parsed).toEqual(application);
    expect(parsed.answers.desiredOutcome.startsWith("  ")).toBe(true);
  });

  it("requires inquiry consent independently of marketing consent", () => {
    const application = createEdenApplicationFixture();
    application.consent.inquiry = false;
    application.consent.marketing = true;

    const result = edenApplicationSchema.safeParse(application);

    expect(result.success).toBe(false);
  });

  it("rejects overlong untrusted free text", () => {
    const application = createEdenApplicationFixture();
    application.answers.currentChallenge = "x".repeat(1_201);

    const result = edenApplicationSchema.safeParse(application);

    expect(result.success).toBe(false);
  });

  it("rejects unknown keys at every public trust boundary", () => {
    const application = {
      ...createEdenApplicationFixture(),
      privilegedCredential: "should-never-be-accepted",
    };

    const result = edenApplicationSchema.safeParse(application);

    expect(result.success).toBe(false);
  });

  it("rejects duplicate and contradictory multi-select values", () => {
    const duplicated = createEdenApplicationFixture();
    duplicated.answers.successMeasures = ["time_saved", "time_saved"];
    const contradictory = createEdenApplicationFixture();
    contradictory.answers.systems = ["not_sure", "crm"];

    expect(edenApplicationSchema.safeParse(duplicated).success).toBe(false);
    expect(edenApplicationSchema.safeParse(contradictory).success).toBe(false);
  });

  it("rejects a submission timestamp before the questionnaire start", () => {
    const application = createEdenApplicationFixture();
    application.submittedAt = "2026-08-24T09:59:59.000Z";

    const result = edenApplicationSchema.safeParse(application);

    expect(result.success).toBe(false);
  });

  it("stores Eden's monthly service range and rejects legacy build bands", () => {
    const monthly = createEdenApplicationFixture();
    const legacy = {
      ...createEdenApplicationFixture(),
      answers: {
        ...createEdenApplicationFixture().answers,
        investmentRange: "25k_50k",
      },
    };

    expect(edenApplicationSchema.parse(monthly).answers.investmentRange).toBe(
      "1k_2k_monthly"
    );
    expect(edenApplicationSchema.safeParse(legacy).success).toBe(false);
  });
});
