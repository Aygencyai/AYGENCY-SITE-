import { describe, expect, it } from "vitest";
import { conversationView } from "./conversation-schema";
import { savedMessageNotice, retryIsWorthOffering } from "./conversation-notice";

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
