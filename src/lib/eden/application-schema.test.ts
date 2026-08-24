import { describe, expect, it } from "vitest";
import { edenApplicationSchema } from "./application-schema";
import { createEdenApplicationFixture } from "./test-fixture";

describe("edenApplicationSchema", () => {
  it("accepts the complete sender contract without rewriting original answers", () => {
    const application = createEdenApplicationFixture();
    application.answers.currentFriction =
      "  Keep this deliberate leading space in the original application answer.";

    const parsed = edenApplicationSchema.parse(application);

    expect(parsed).toEqual(application);
    expect(parsed.answers.currentFriction.startsWith("  ")).toBe(true);
  });

  it("requires inquiry consent independently of optional marketing consent", () => {
    const application = createEdenApplicationFixture();
    application.consent.inquiry = false;
    application.consent.marketing = true;

    expect(edenApplicationSchema.safeParse(application).success).toBe(false);
  });

  it("accepts explicit false boundary answers without inventing acceptance", () => {
    const application = createEdenApplicationFixture();
    application.answers.operatedServiceAck = false;
    application.answers.dataBoundaryAck = false;

    expect(edenApplicationSchema.parse(application).answers).toMatchObject({
      operatedServiceAck: false,
      dataBoundaryAck: false,
    });
  });

  it("rejects overlong untrusted free text", () => {
    const application = createEdenApplicationFixture();
    application.answers.currentFriction = "x".repeat(1_501);

    expect(edenApplicationSchema.safeParse(application).success).toBe(false);
  });

  it("rejects unknown keys at the public trust boundary", () => {
    const application = {
      ...createEdenApplicationFixture(),
      privilegedCredential: "should-never-be-accepted",
    };

    expect(edenApplicationSchema.safeParse(application).success).toBe(false);
  });

  it("rejects duplicate multi-select values", () => {
    const duplicatedOutcomes = createEdenApplicationFixture();
    duplicatedOutcomes.answers.primaryOutcomes = ["protect-time", "protect-time"];
    const duplicatedTools = createEdenApplicationFixture();
    duplicatedTools.answers.currentTools = ["notion", "notion"];

    expect(edenApplicationSchema.safeParse(duplicatedOutcomes).success).toBe(false);
    expect(edenApplicationSchema.safeParse(duplicatedTools).success).toBe(false);
  });

  it("rejects non-v4 identifiers and a submission before questionnaire start", () => {
    const wrongUuidVersion = createEdenApplicationFixture();
    wrongUuidVersion.eventId = "11111111-1111-1111-8111-111111111111";
    const reversed = createEdenApplicationFixture();
    reversed.submittedAt = "2026-08-24T09:57:59.000Z";

    expect(edenApplicationSchema.safeParse(wrongUuidVersion).success).toBe(false);
    expect(edenApplicationSchema.safeParse(reversed).success).toBe(false);
  });

  it("requires a bounded Turnstile token and exact country/identity shapes", () => {
    const shortToken = createEdenApplicationFixture();
    shortToken.botToken = "short";
    const lowerCountry = createEdenApplicationFixture();
    lowerCountry.organisation.countryCode = "gb";
    const badPhone = createEdenApplicationFixture();
    badPhone.contact.phone = "07700900123";

    expect(edenApplicationSchema.safeParse(shortToken).success).toBe(false);
    expect(edenApplicationSchema.safeParse(lowerCountry).success).toBe(false);
    expect(edenApplicationSchema.safeParse(badPhone).success).toBe(false);
  });

  it("allows genuinely absent optional identity attributes as empty sender fields", () => {
    const application = createEdenApplicationFixture();
    application.contact.phone = "";
    application.contact.roleTitle = "";
    application.contact.linkedinUrl = "";
    application.organisation.website = "";
    application.organisation.companyNumber = "";
    application.answers.anythingElse = "";

    expect(edenApplicationSchema.safeParse(application).success).toBe(true);
  });
});
