import { describe, expect, it } from "vitest";
import { edenLeadCaptureSchema } from "./lead-capture-schema";
import { createEdenLeadCaptureFixture } from "./test-fixture";

describe("edenLeadCaptureSchema", () => {
  it("accepts the strict browser capture and preserves submitted casing", () => {
    const capture = createEdenLeadCaptureFixture();
    expect(edenLeadCaptureSchema.parse(capture).workEmail).toBe(
      "Applicant@Synthetic.Example",
    );
  });

  it("requires explicit inquiry permission", () => {
    expect(
      edenLeadCaptureSchema.safeParse({
        ...createEdenLeadCaptureFixture(),
        inquiryConsent: false,
      }).success,
    ).toBe(false);
  });

  it("rejects unknown properties and unsafe attribution", () => {
    expect(
      edenLeadCaptureSchema.safeParse({
        ...createEdenLeadCaptureFixture(),
        unexpected: true,
      }).success,
    ).toBe(false);
    expect(
      edenLeadCaptureSchema.safeParse({
        ...createEdenLeadCaptureFixture(),
        attribution: {
          ...createEdenLeadCaptureFixture().attribution,
          landingPath: "https://attacker.example/design-your-eden",
        },
      }).success,
    ).toBe(false);
  });

  it("requires UUIDv4 identity and a UTC capture time", () => {
    expect(
      edenLeadCaptureSchema.safeParse({
        ...createEdenLeadCaptureFixture(),
        eventId: "44444444-4444-1444-8444-444444444444",
      }).success,
    ).toBe(false);
    expect(
      edenLeadCaptureSchema.safeParse({
        ...createEdenLeadCaptureFixture(),
        capturedAt: "2026-08-24T10:57:00.000+01:00",
      }).success,
    ).toBe(false);
  });
});
