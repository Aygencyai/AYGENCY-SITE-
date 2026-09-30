import { describe, expect, it, vi } from "vitest";
import { createAccountHandler } from "./account-handler";

const connection_ref = `eden-connection-${"a".repeat(24)}`;
const request_id = "b".repeat(32);
const access_token = "private-access-token-".repeat(3);
let index = 0;
function request(payload: object, origin = "https://aygency.ai") {
  return new Request("https://aygency.ai/api/eden/account/verify", {
    method: "POST",
    headers: {
      origin,
      "content-type": "application/json",
      "x-real-ip": `test-${index++}`,
    },
    body: JSON.stringify(payload),
  });
}

describe("customer account forwarding", () => {
  it("forwards only exact credentials to the configured service and strips unrelated response data", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(Response.json({
      status: "connected",
      runtime_activated: false,
      email: "private@example.test",
      admin_key: "secret",
    }));
    const response = await createAccountHandler("verify", {
      fetch: fetcher,
      serviceUrl: "https://account.example.test",
    })(request({ connection_ref, request_id, access_token }));
    expect(await response.json()).toEqual({
      status: "connected",
      runtime_activated: false,
    });
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(String(fetcher.mock.calls[0][0])).toBe(
      "https://account.example.test/v1/setup/verify",
    );
    expect(fetcher.mock.calls[0][1]).toMatchObject({
      redirect: "error",
      cache: "no-store",
    });
  });

  it.each(["https://attacker.example", "null"])(
    "rejects unrelated origin %s",
    async (origin) => {
      const fetcher = vi.fn<typeof fetch>();
      const response = await createAccountHandler("verify", { fetch: fetcher })(
        request({ connection_ref, request_id, access_token }, origin),
      );
      expect(response.status).toBe(403);
      expect(fetcher).not.toHaveBeenCalled();
    },
  );

  it("rejects name lookup and oversized bodies before calling upstream", async () => {
    const fetcher = vi.fn<typeof fetch>();
    const handler = createAccountHandler("verify", {
      fetch: fetcher,
      serviceUrl: "https://account.example.test",
    });
    for (
      const extra of [{ name: "Owner" }, { access_token: "x".repeat(16385) }]
    ) {
      const response = await handler(
        request({ connection_ref, request_id, access_token, ...extra }),
      );
      expect(response.status).toBe(409);
      expect(await response.text()).not.toContain(access_token);
    }
    expect(fetcher).not.toHaveBeenCalled();
  });

  it.each([
    {
      status: "connect_telegram",
      deep_link: "https://attacker.example",
      expires_at: "2099-01-01T00:00:00Z",
    },
    {
      status: "connect_telegram",
      deep_link: `https://t.me/SyntheticEdenBot?start=${"t".repeat(48)}`,
      expires_at: "2020-01-01T00:00:00Z",
    },
    { status: "connected", runtime_activated: true },
  ])("rejects an untrusted or expired upstream result", async (result) => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json(result),
    );
    const response = await createAccountHandler("verify", {
      fetch: fetcher,
      serviceUrl: "https://account.example.test",
    })(request({ connection_ref, request_id, access_token }));
    expect(response.status).toBe(409);
    expect(await response.json()).toEqual({ error: "connection_unavailable" });
  });

  it.each(["matching", "other-bot", "other-token"])(
    "validates a group link against the private Builder link: %s",
    async (kind) => {
      const deep_link = `https://t.me/SyntheticBuilderBot?start=${"t".repeat(48)}`;
      let group_deep_link = deep_link.replace("?start=", "?startgroup=");
      if (kind === "other-bot") group_deep_link = group_deep_link.replace("SyntheticBuilderBot", "OtherBuilderBot");
      if (kind === "other-token") group_deep_link = group_deep_link.replace("t".repeat(48), "u".repeat(48));
      const result = { status: "connect_telegram", deep_link, group_deep_link, expires_at: new Date(Date.now() + 600000).toISOString() };
      const response = await createAccountHandler("verify", {
        fetch: vi.fn<typeof fetch>().mockResolvedValue(Response.json(result)),
        serviceUrl: "https://account.example.test",
      })(request({ connection_ref, request_id, access_token }));
      expect(response.status).toBe(kind === "matching" ? 200 : 409);
      expect(await response.json()).toEqual(kind === "matching" ? result : { error: "connection_unavailable" });
    },
  );

  it("never echoes a provider error or transport exception", async () => {
    for (
      const response of [
        Response.json({ error: access_token }, { status: 500 }),
        new Error(access_token),
      ]
    ) {
      const fetcher = vi.fn<typeof fetch>();
      if (response instanceof Error) fetcher.mockRejectedValue(response);
      else fetcher.mockResolvedValue(response);
      const result = await createAccountHandler("verify", {
        fetch: fetcher,
        serviceUrl: "https://account.example.test",
      })(request({ connection_ref, request_id, access_token }));
      expect(await result.text()).not.toContain(access_token);
    }
  });
});
