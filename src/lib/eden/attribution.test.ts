import { describe, expect, it } from "vitest";
import { captureEdenAttribution } from "./attribution";

describe("captureEdenAttribution", () => {
  it("captures only whitelisted first-touch values", () => {
    const attribution = captureEdenAttribution({
      location: new URL(
        "https://aygency.ai/design-your-eden?utm_source=linkedin&utm_campaign=eden&password=never-capture-this"
      ),
      referrer:
        "https://partner.example/article?private=value#sensitive-fragment",
    });

    expect(attribution).toEqual({
      utmSource: "linkedin",
      utmCampaign: "eden",
      landingPath: "/design-your-eden",
      referrer: "https://partner.example/article",
    });
    expect(attribution).not.toHaveProperty("password");
  });

  it("drops malformed or non-HTTP referrers", () => {
    expect(
      captureEdenAttribution({
        location: new URL("https://aygency.ai/design-your-eden"),
        referrer: "javascript:alert(1)",
      })
    ).not.toHaveProperty("referrer");
  });
});
