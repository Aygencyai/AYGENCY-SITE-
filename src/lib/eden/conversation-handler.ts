import { randomBytes } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { conversationAction, conversationView } from "./conversation-schema";
import { createFixedWindowRateLimiter, getHashedRequestIdentifier } from "./rate-limit";

const consume = createFixedWindowRateLimiter({ limit: 90, windowMs: 60_000 });
const privateHeaders = { "cache-control": "no-store, max-age=0", "referrer-policy": "no-referrer" };

async function boundedJson(body: ReadableStream<Uint8Array> | null, limit: number): Promise<unknown> {
  if (!body) throw new Error();
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const next = await reader.read();
      if (next.done) break;
      size += next.value.length;
      if (size > limit) throw new Error();
      chunks.push(next.value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } finally { await reader.cancel(); reader.releaseLock(); }
}

export function createConversationHandler(deps: {
  fetch?: typeof fetch; enabled?: boolean; url?: string; key?: string; local?: boolean;
} = {}) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const fail = (status: number) => NextResponse.json({ error: "conversation_unavailable" },
      { status, headers: privateHeaders });
    if (!(deps.enabled ?? process.env.EDEN_WEB_ONBOARDING_ENABLED === "true")) return fail(503);
    const originHeader = request.headers.get("origin");
    let origin: URL;
    try { origin = new URL(originHeader ?? ""); } catch { return fail(403); }
    // Next's local server can normalize request.url to localhost. Host retains
    // the actual browser destination; compare exact origins without allowing
    // arbitrary loopback origins or trusting a forwarded host.
    const host = request.headers.get("host") ?? new URL(request.url).host;
    if (originHeader !== origin.origin || origin.host !== host ||
      !["http:", "https:"].includes(origin.protocol) ||
      ![null, "same-origin", "none"].includes(request.headers.get("sec-fetch-site"))) return fail(403);
    if (!consume(getHashedRequestIdentifier(request)).allowed) return fail(429);
    try {
      if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return fail(415);
      const input = conversationAction.parse(await boundedJson(request.body, 16_384));
      const url = new URL(deps.url ?? process.env.EDEN_WEB_SERVICE_URL ?? "");
      const local = (deps.local ?? process.env.EDEN_WEB_ALLOW_LOCAL === "true") &&
        process.env.NODE_ENV !== "production" && !process.env.VERCEL;
      if (url.username || url.password || url.pathname !== "/" || url.search || url.hash ||
        (url.protocol !== "https:" && !(local && url.protocol === "http:" &&
          ["127.0.0.1", "localhost"].includes(url.hostname)))) return fail(503);
      const key = deps.key ?? process.env.EDEN_WEB_SERVICE_KEY ?? "";
      if (key.length < 32) return fail(503);
      const secure = origin.protocol === "https:";
      const cookieName = secure ? "__Host-eden-conversation" : "eden-conversation";
      const existing = request.cookies.get(cookieName)?.value;
      if (existing && !/^[a-f0-9]{64}$/.test(existing)) return fail(401);
      if (!existing && input.action !== "open") return fail(401);
      const token = existing ?? randomBytes(32).toString("hex");
      const upstream = await (deps.fetch ?? fetch)(new URL("/v1/onboarding", url), {
        method: "POST", headers: { "content-type": "application/json",
          "x-eden-web-key": key, "x-eden-session": token },
        body: JSON.stringify(input), cache: "no-store", redirect: "error",
        signal: AbortSignal.timeout(55_000),
      });
      if (!upstream.ok) { await upstream.body?.cancel(); return fail(upstream.status === 409 ? 409 : 503); }
      const rotated = upstream.headers.get("x-eden-session");
      if (!rotated || !/^[a-f0-9]{64}$/.test(rotated) ||
        (input.action !== "verify" && rotated !== token)) return fail(503);
      const result = await boundedJson(upstream.body, 262_144);
      let view: object;
      if (input.action === "email") {
        if (JSON.stringify(result) !== JSON.stringify({ code_sent: true })) return fail(503);
        view = { code_sent: true };
      } else { view = conversationView.parse(result); }
      const response = NextResponse.json(view, { headers: privateHeaders });
      if (!existing || rotated !== existing) response.cookies.set(cookieName, rotated, {
        httpOnly: true, secure, sameSite: "lax", path: "/", maxAge: 30 * 24 * 60 * 60,
      });
      return response;
    } catch { return fail(503); }
  };
}
