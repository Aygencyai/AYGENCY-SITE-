import { describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { createConnectionHandler } from "./connection-handler";

const ref = { connection_ref: "eden-connection-" + "a".repeat(24), link_id: "connect-" + "b".repeat(24) };
const state = "c".repeat(64);
const session = "d".repeat(64);
const cookie = Buffer.from(JSON.stringify({ ...ref, browser_state: state })).toString("base64url");
const key = "private-website-test-ingress-key-long-enough";
const started = () => ({ url: "https://connect.composio.dev/link/test", browser_state: state,
  expires_at: new Date(Date.now() + 600_000).toISOString() });

function request(body: object, headers: Record<string, string> = {}) {
  return new NextRequest("https://website.example/api/eden/connections", { method: "POST",
    headers: { origin: "https://website.example", "content-type": "application/json",
      cookie: `__Host-eden-conversation=${session}; __Host-eden-outlook-flow=${cookie}`, ...headers },
    body: JSON.stringify(body) });
}
function handler(value: object = started()) {
  const upstream = vi.fn<typeof fetch>(async () => new Response(JSON.stringify(value)));
  return { upstream, run: createConnectionHandler({ fetch: upstream, enabled: true,
    url: "https://connections.example", key }) };
}

describe("customer Outlook website boundary", () => {
  it("keeps the browser proof in a secure HttpOnly cookie and forwards the existing session privately", async () => {
    const { run, upstream } = handler();
    const response = await run(request({ action: "start", ...ref }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ url: "https://connect.composio.dev/link/test" });
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("Secure");
    expect(response.headers.get("set-cookie")).toContain("SameSite=lax");
    expect(response.headers.get("set-cookie")).toContain(cookie);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(String(upstream.mock.calls[0][0])).toBe("https://connections.example/v1/customer-connection-browser/start");
    const options = upstream.mock.calls[0][1];
    expect(JSON.parse(String(options?.body))).toEqual(ref);
    expect(new Headers(options?.headers).get("x-eden-session")).toBe(session);
    expect(new Headers(options?.headers).get("x-eden-web-key")).toBe(key);
    expect(options?.redirect).toBe("error");
  });
  it("returns only verified status and clears the completed proof", async () => {
    const { run, upstream } = handler({ status: "active", reason: "verified" });
    const response = await run(request({ action: "complete", session_uri: "private-provider-session-uri" }));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "active", reason: "verified" });
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
    expect(JSON.parse(String(upstream.mock.calls[0][1]?.body))).toEqual({
      ...ref, browser_state: state, session_uri: "private-provider-session-uri",
    });
  });
  it("retains the proof while Microsoft is still processing", async () => {
    const { run } = handler({ status: "pending", reason: "awaiting-microsoft" });
    const response = await run(request({ action: "complete", session_uri: "private-provider-session-uri" }));
    expect(response.status).toBe(200);
    expect(response.headers.get("set-cookie")).toBeNull();
  });
  it.each<Record<string, string>>([
    { origin: "https://elsewhere.example" }, { "sec-fetch-site": "cross-site" },
    { origin: "https://website.example/" }, { origin: "" },
  ])("rejects cross-site requests before forwarding", async (headers) => {
    const { run, upstream } = handler();
    expect((await run(request({ action: "start", ...ref }, headers))).status).not.toBe(200);
    expect(upstream).not.toHaveBeenCalled();
  });
  it("requires both the existing account cookie and a return proof", async () => {
    const { run, upstream } = handler();
    expect((await run(request({ action: "start", ...ref }, { cookie: "" }))).status).toBe(401);
    expect((await run(request({ action: "complete", session_uri: "private-provider-session-uri" },
      { cookie: `__Host-eden-conversation=${session}` }))).status).toBe(409);
    expect(upstream).not.toHaveBeenCalled();
  });
  it.each([
    { action: "start", ...ref, account_owner_id: "forged" },
    { action: "complete", ...ref, session_uri: "private-provider-session-uri" },
    { action: "complete", session_uri: "private-provider-session-uri", browser_state: state },
    { action: "complete", session_uri: "x".repeat(17_000) },
  ])("does not accept browser identity or proof overrides", async (body) => {
    const { run, upstream } = handler();
    expect((await run(request(body))).status).toBe(409);
    expect(upstream).not.toHaveBeenCalled();
  });
  it.each([
    { url: "https://elsewhere.example/link/test" },
    { url: "https://connect.composio.dev.evil.example/link/test" },
    { url: "https://user:pass@connect.composio.dev/link/test" },
    { url: "http://connect.composio.dev/link/test" },
    { expires_at: new Date(Date.now() - 1000).toISOString() },
    { expires_at: new Date(Date.now() + 1800_000).toISOString() },
  ])("rejects unsafe or expired upstream links", async (change) => {
    const response = await handler({ ...started(), ...change }).run(request({ action: "start", ...ref }));
    expect(response.status).toBe(409);
    expect(response.headers.get("set-cookie")).toBeNull();
  });
  it("rejects an active response without actual verification", async () => {
    const { run } = handler({ status: "active", reason: "awaiting-microsoft" });
    expect((await run(request({ action: "complete", session_uri: "private-provider-session-uri" }))).status).toBe(409);
  });
  it("is unavailable until explicitly configured", async () => {
    const run = createConnectionHandler({ enabled: false });
    expect((await run(request({ action: "start", ...ref }))).status).toBe(503);
  });
});
