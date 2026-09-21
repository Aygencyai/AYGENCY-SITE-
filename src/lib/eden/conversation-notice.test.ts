import { describe, expect, it } from "vitest";
import { conversationView } from "./conversation-schema";
import { savedMessageNotice, retryIsWorthOffering, confirmedStateMessage } from "./conversation-notice";

const base = {
  revision: 2, messages: [], facts: [], summary: "", ready: false,
  email_verified: true as const, email: "customer@example.test",
  pending: true, confirmed: false, created: false, updated_at: "2026-09-18T10:00:00Z",
  retry_available: true,
};

describe("saved-message notice", () => {
  it("offers a retry when the failure was a passing one", () => {
    const view = { ...base, unavailable_reason: "unavailable" as const };
    expect(savedMessageNotice(view)).toContain("Try the reply again");
    expect(retryIsWorthOffering(view)).toBe(true);
  });

  it("does not invite a retry that cannot succeed while the plan is exhausted", () => {
    const view = { ...base, unavailable_reason: "usage_limit" as const };
    expect(savedMessageNotice(view)).not.toContain("Try the reply again");
    expect(savedMessageNotice(view)).toContain("saved");
    expect(retryIsWorthOffering(view)).toBe(false);
  });

  it("treats a provider sign-in failure as the same honest outage", () => {
    const view = { ...base, unavailable_reason: "provider_auth" as const };
    expect(retryIsWorthOffering(view)).toBe(false);
  });

  it("preserves a capacity-limited message without inviting an immediate retry", () => {
    const view = conversationView.parse({ ...base, unavailable_reason: "rate_limit" });
    expect(savedMessageNotice(view)).toContain("message is saved");
    expect(savedMessageNotice(view)).toContain("come back later");
    expect(retryIsWorthOffering(view)).toBe(false);
  });

  it("says nothing when no saved message is waiting", () => {
    expect(savedMessageNotice({ ...base, pending: false, retry_available: false })).toBe("");
  });
});

describe("conversation schema", () => {
  it("accepts the reason the builder reports for a failed turn", () => {
    const parsed = conversationView.parse({ ...base, unavailable_reason: "usage_limit" });
    expect(parsed.unavailable_reason).toBe("usage_limit");
  });

  it("rejects a reason outside the fixed vocabulary", () => {
    expect(() => conversationView.parse({ ...base, unavailable_reason: "429 quota for acct" }))
      .toThrow();
  });
});

describe("confirmed state", () => {
  const settled = { ...base, pending: false, retry_available: false, confirmed: true };

  it("tells the customer a human will be in touch once their setup is saved", () => {
    const message = confirmedStateMessage({ ...settled, created: false });
    expect(message).toContain("in touch");
    expect(message).toContain("come back");
  });

  it("stops promising contact once the founders have started the build", () => {
    const message = confirmedStateMessage({ ...settled, created: true });
    expect(message).toContain("building");
    expect(message).not.toContain("in touch");
  });

  it("uses no em dash, per the site copy rules", () => {
    expect(confirmedStateMessage({ ...settled, created: false })).not.toContain("\u2014");
    expect(confirmedStateMessage({ ...settled, created: true })).not.toContain("\u2014");
  });
});
