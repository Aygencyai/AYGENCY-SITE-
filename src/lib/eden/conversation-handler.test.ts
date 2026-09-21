import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { createConversationHandler } from "./conversation-handler";

const view = { revision: 1, messages: [], facts: [], summary: "", ready: false,
  email_verified: true, email: "customer@example.test", pending: false, confirmed: false, created: false,
  updated_at: "2026-09-15T10:00:00Z" };
const key = "isolated-test-ingress-key-long-enough-for-test";
function request(body: object, headers: Record<string, string> = {}) {
  return new NextRequest("https://website.example/api/eden/conversation", {
    method: "POST", headers: { origin: "https://website.example", "content-type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
}
function handler(result: object = view) {
  const upstream = vi.fn<typeof fetch>(async (_url, options) => new Response(JSON.stringify(result), {
    headers: { "x-eden-session": new Headers(options?.headers).get("x-eden-session") ?? "" },
  }));
  return { upstream, run: createConversationHandler({ fetch: upstream, enabled: true,
    url: "https://builder.example", key }) };
}

describe("website conversation boundary", () => {
  it("keeps the session in a private secure cookie and server credential upstream", async () => {
    const { run, upstream } = handler();
    const response = await run(request({ action: "open" }));
    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toMatch(/__Host-eden-conversation=[a-f0-9]{64}/);
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("Secure");
    expect(response.headers.get("x-eden-session")).toBeNull();
    expect(await response.json()).toEqual(view);
    expect(new Headers(upstream.mock.calls[0][1]?.headers).get("x-eden-web-key")).toBe(key);
  });
  it("rejects cross-origin posts and caller-assigned identity", async () => {
    const { run, upstream } = handler();
    expect((await run(request({ action: "open" }, { origin: "https://attacker.example" }))).status).toBe(403);
    expect((await run(request({ action: "verify", owner_id: "invented" }))).status).not.toBe(200);
    expect(upstream).not.toHaveBeenCalled();
  });
  it("does not silently create a replacement session for a message", async () => {
    const { run, upstream } = handler();
    expect((await run(request({ action: "get" }))).status).toBe(401);
    expect(upstream).not.toHaveBeenCalled();
  });
  it("uses the actual Host when Next normalizes a loopback request URL", async () => {
    const { run } = handler();
    const local = new NextRequest("http://localhost:3118/api/eden/conversation", {
      method: "POST", headers: { host: "127.0.0.1:3118", origin: "http://127.0.0.1:3118",
        "content-type": "application/json" }, body: JSON.stringify({ action: "open" }),
    });
    expect((await run(local)).status).toBe(200);
  });
  it("rejects an upstream response containing private internal fields", async () => {
    const { run } = handler({ ...view, owner_id: "private-auth-subject", lease: "private-lease" });
    const response = await run(request({ action: "open" }));
    expect(response.status).toBe(503);
    expect(await response.text()).not.toContain("private-");
  });
  it("requires HTTPS for a deployed service", async () => {
    const upstream = vi.fn<typeof fetch>();
    const run = createConversationHandler({ fetch: upstream, enabled: true, local: false,
      url: "http://builder.example", key });
    expect((await run(request({ action: "open" }))).status).toBe(503);
    expect(upstream).not.toHaveBeenCalled();
  });
  it("passes the existing session on an exact retry", async () => {
    const { run, upstream } = handler();
    const token = "a".repeat(64);
    expect((await run(request({ action: "retry" }, { cookie: "__Host-eden-conversation=" + token }))).status).toBe(200);
    expect(new Headers(upstream.mock.calls[0][1]?.headers).get("x-eden-session")).toBe(token);
  });
  it("accepts only a content-free gate before email verification", async () => {
    const { run } = handler({ email_verified: false });
    expect(await (await run(request({ action: "open" }))).json()).toEqual({ email_verified: false });
    const leaking = handler({ ...view, email_verified: false });
    expect((await leaking.run(request({ action: "open" }))).status).toBe(503);
  });
  it("clears an expired or revoked cookie so sign-in can recover", async () => {
    const upstream = vi.fn<typeof fetch>(async () => new Response("{}", { status: 401 }));
    const run = createConversationHandler({ fetch: upstream, enabled: true, url: "https://builder.example", key });
    const response = await run(request({ action: "get" }, { cookie: "__Host-eden-conversation=" + "a".repeat(64) }));
    expect(response.status).toBe(401);
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
  });
  it("rotates the browser session when signing out and rejects content in the logout response", async () => {
    let value: object = { email_verified: false };
    const upstream = vi.fn<typeof fetch>(async () => new Response(JSON.stringify(value), {
      headers: { "x-eden-session": "b".repeat(64) },
    }));
    const run = createConversationHandler({ fetch: upstream, enabled: true, url: "https://builder.example", key });
    const response = await run(request({ action: "logout" }, { cookie: "__Host-eden-conversation=" + "a".repeat(64) }));
    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toContain("b".repeat(64));
    value = view;
    expect((await run(request({ action: "logout" }, { cookie: "__Host-eden-conversation=" + "a".repeat(64) }))).status).toBe(503);
  });

});

describe("founder alert on a completed onboarding", () => {
  const token = "__Host-eden-conversation=" + "a".repeat(64);
  const confirmed = { ...view, confirmed: true, revision: 7,
    summary: "Eden will chase supplier lead times and draft client proposals." };

  function withNotifier(result: object, notify: ReturnType<typeof vi.fn>) {
    const upstream = vi.fn<typeof fetch>(async (_url, options) => new Response(JSON.stringify(result), {
      headers: { "x-eden-session": new Headers(options?.headers).get("x-eden-session") ?? "" },
    }));
    return createConversationHandler({ fetch: upstream, enabled: true,
      url: "https://builder.example", key, notify });
  }

  it("tells the founders a lead is waiting once the customer confirms", async () => {
    const notify = vi.fn(async () => "sent" as const);
    const run = withNotifier(confirmed, notify);
    const response = await run(request({ action: "confirm", revision: 7 }, { cookie: token }));
    expect(response.status).toBe(200);
    expect(notify).toHaveBeenCalledWith(expect.objectContaining({
      email: "customer@example.test", revision: 7,
      summary: "Eden will chase supplier lead times and draft client proposals.",
    }));
  });

  it("still confirms for the customer when the founder alert fails", async () => {
    const notify = vi.fn(async () => { throw new Error("resend is down"); });
    const run = withNotifier(confirmed, notify);
    const response = await run(request({ action: "confirm", revision: 7 }, { cookie: token }));
    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ confirmed: true });
  });

  it("does not alert on ordinary polling of an already confirmed setup", async () => {
    const notify = vi.fn(async () => "sent" as const);
    const run = withNotifier(confirmed, notify);
    await run(request({ action: "get" }, { cookie: token }));
    expect(notify).not.toHaveBeenCalled();
  });

  it("does not alert when the builder rejects the confirmation", async () => {
    const notify = vi.fn(async () => "sent" as const);
    const run = withNotifier({ ...view, confirmed: false }, notify);
    await run(request({ action: "confirm", revision: 7 }, { cookie: token }));
    expect(notify).not.toHaveBeenCalled();
  });
});
