import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createFixedWindowRateLimiter, getHashedRequestIdentifier } from "./rate-limit";

const consume = createFixedWindowRateLimiter({ limit: 30, windowMs: 60_000 });
const reference = z.object({
  connection_ref: z.string().regex(/^eden-connection-[a-f0-9]{24}$/),
  link_id: z.string().regex(/^connect-[a-f0-9]{24}$/),
});
const proof = reference.extend({ browser_state: z.string().regex(/^[a-f0-9]{64}$/) }).strict();
const input = z.discriminatedUnion("action", [
  reference.extend({ action: z.literal("start") }).strict(),
  z.object({ action: z.literal("complete"), session_uri: z.string().min(16).max(8192) }).strict(),
]);
const started = z.object({
  url: z.string().max(4096).url(), browser_state: z.string().regex(/^[a-f0-9]{64}$/),
  expires_at: z.string().datetime({ offset: true }),
}).strict();
const completed = z.object({
  status: z.enum(["pending", "active", "expired", "needs-attention", "disconnected"]),
  reason: z.enum(["awaiting-microsoft", "awaiting-eden-sign-in", "verified", "link-expired",
    "provider-rejected", "wrong-mailbox", "locally-disconnected"]),
}).strict().refine((value) => (value.status === "active") === (value.reason === "verified"));
const headers = { "cache-control": "no-store", "referrer-policy": "no-referrer" };

async function boundedJson(body: ReadableStream<Uint8Array> | null): Promise<unknown> {
  if (!body) throw new Error();
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.length;
      if (size > 16_384) throw new Error();
      chunks.push(next.value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } finally { await reader.cancel(); reader.releaseLock(); }
}

export function createConnectionHandler(deps: {
  fetch?: typeof fetch; enabled?: boolean; url?: string; key?: string; local?: boolean;
} = {}) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const fail = (status: number) => NextResponse.json({ error: "connection_unavailable" }, { status, headers });
    if (!(deps.enabled ?? process.env.EDEN_CUSTOMER_CONNECTIONS_ENABLED === "true")) return fail(503);
    try {
      const originHeader = request.headers.get("origin") ?? "";
      const origin = new URL(originHeader);
      const host = request.headers.get("host") ?? new URL(request.url).host;
      const local = (deps.local ?? process.env.EDEN_WEB_ALLOW_LOCAL === "true") &&
        process.env.NODE_ENV !== "production" && !process.env.VERCEL;
      if (originHeader !== origin.origin || origin.host !== host ||
        !(origin.protocol === "https:" || (local && origin.protocol === "http:" &&
          ["127.0.0.1", "localhost"].includes(origin.hostname))) ||
        ![null, "same-origin", "none"].includes(request.headers.get("sec-fetch-site"))) return fail(403);
      if (!consume(getHashedRequestIdentifier(request)).allowed) return fail(429);
      if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return fail(415);
      const secure = origin.protocol === "https:";
      const cookieName = secure ? "__Host-eden-outlook-flow" : "eden-outlook-flow";
      const session = request.cookies.get(secure ? "__Host-eden-conversation" : "eden-conversation")?.value;
      if (!session || !/^[a-f0-9]{64}$/.test(session)) return fail(401);
      const value = input.parse(await boundedJson(request.body));
      const url = new URL(deps.url ?? process.env.EDEN_CONNECTION_SERVICE_URL ?? "");
      if (url.username || url.password || url.pathname !== "/" || url.search || url.hash ||
        !(url.protocol === "https:" || (local && url.protocol === "http:" &&
          ["127.0.0.1", "localhost"].includes(url.hostname)))) return fail(503);
      const key = deps.key ?? process.env.EDEN_CONNECTION_WEBSITE_KEY ?? "";
      if (key.length < 32) return fail(503);
      let payload: object;
      if (value.action === "start") {
        payload = { connection_ref: value.connection_ref, link_id: value.link_id };
      } else {
        const cookie = request.cookies.get(cookieName)?.value;
        if (!cookie || cookie.length > 1024 || !/^[A-Za-z0-9_-]+$/.test(cookie)) return fail(409);
        // The service authenticates the proof against encrypted custody. Cookie
        // fields are never treated as customer identity or account ownership.
        payload = { ...proof.parse(JSON.parse(Buffer.from(cookie, "base64url").toString("utf8"))),
          session_uri: value.session_uri };
      }
      const upstream = await (deps.fetch ?? fetch)(new URL(`/v1/customer-connection-browser/${value.action}`, url), {
        method: "POST", headers: { "content-type": "application/json", "x-eden-web-key": key, "x-eden-session": session },
        body: JSON.stringify(payload), cache: "no-store", redirect: "error", signal: AbortSignal.timeout(30_000),
      });
      if (!upstream.ok) { await upstream.body?.cancel(); return fail(upstream.status === 401 ? 401 : 409); }
      const raw = await boundedJson(upstream.body);
      if (value.action === "start") {
        const result = started.parse(raw);
        const redirect = new URL(result.url);
        const ttl = Math.floor((Date.parse(result.expires_at) - Date.now()) / 1000);
        if (redirect.protocol !== "https:" || !["connect.composio.dev", "app.composio.dev"].includes(redirect.host) ||
          redirect.username || redirect.password || !redirect.pathname.startsWith("/link/") || redirect.hash ||
          ttl < 1 || ttl > 900) return fail(409);
        const response = NextResponse.json({ url: result.url }, { headers });
        response.cookies.set(cookieName, Buffer.from(JSON.stringify({
          connection_ref: value.connection_ref, link_id: value.link_id, browser_state: result.browser_state,
        })).toString("base64url"), { httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: ttl });
        return response;
      }
      const result = completed.parse(raw);
      const response = NextResponse.json(result, { headers });
      if (["active", "expired", "disconnected"].includes(result.status)) response.cookies.set(cookieName, "", {
        httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 0,
      });
      return response;
    } catch { return fail(409); }
  };
}
