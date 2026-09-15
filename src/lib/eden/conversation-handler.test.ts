import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { createConversationHandler } from "./conversation-handler";

const view = { revision: 1, messages: [], facts: [], summary: "", ready: false,
  email_verified: false, pending: false, confirmed: false, created: false,
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
});
