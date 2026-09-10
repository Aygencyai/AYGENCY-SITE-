import { z } from "zod";
import { isTrustedEdenOrigin } from "./application-handler";
import {
  createFixedWindowRateLimiter,
  getHashedRequestIdentifier,
} from "./rate-limit";

const consume = createFixedWindowRateLimiter({ limit: 30, windowMs: 60_000 });
const base = z.object({
  connection_ref: z.string().regex(/^eden-connection-[a-f0-9]{24}$/),
  request_id: z.string().regex(/^[a-f0-9]{32}$/),
});
const requests = {
  open: base.extend({
    opaque_state: z.string().regex(/^[A-Za-z0-9_-]{43,64}$/),
  }).strict(),
  verify: base.extend({ access_token: z.string().min(32).max(8192) }).strict(),
};
const opened = z.object({ status: z.literal("email_verification_required") });
const connected = z.object({
  status: z.literal("connected"),
  runtime_activated: z.literal(false),
});
const telegram = z.object({
  status: z.literal("connect_telegram"),
  deep_link: z.string().regex(
    /^https:\/\/t\.me\/[A-Za-z][A-Za-z0-9_]{1,28}[Bb][Oo][Tt]\?start=[A-Za-z0-9_-]{43,64}$/,
  ),
  expires_at: z.string().datetime({ offset: true }),
  group_deep_link: z.string().regex(
    /^https:\/\/t\.me\/[A-Za-z][A-Za-z0-9_]{1,28}[Bb][Oo][Tt]\?startgroup=[A-Za-z0-9_-]{43,64}$/,
  ).optional(),
}).refine((value) => !value.group_deep_link ||
  value.group_deep_link === value.deep_link.replace("?start=", "?startgroup="));

async function boundedJson(
  body: ReadableStream<Uint8Array> | null,
): Promise<unknown> {
  if (!body) throw new Error("unavailable");
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      bytes += result.value.byteLength;
      if (bytes > 16_384) throw new Error("unavailable");
      chunks.push(result.value);
    }
    return JSON.parse(Buffer.concat(chunks).toString("utf8")) as unknown;
  } finally {
    await reader.cancel();
    reader.releaseLock();
  }
}

function json(body: object, status = 200) {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store", "referrer-policy": "no-referrer" },
  });
}

export function createAccountHandler(
  action: "open" | "verify",
  dependencies: { fetch?: typeof fetch; serviceUrl?: string } = {},
) {
  return async (request: Request): Promise<Response> => {
    if (!isTrustedEdenOrigin(request)) {
      return json({ error: "connection_unavailable" }, 403);
    }
    if (!consume(getHashedRequestIdentifier(request)).allowed) {
      return json({ error: "connection_unavailable" }, 429);
    }
    try {
      if (
        request.headers.get("content-type")?.split(";")[0] !==
          "application/json"
      ) throw new Error();
      const payload = requests[action].parse(await boundedJson(request.body));
      const origin = new URL(
        dependencies.serviceUrl ?? process.env.EDEN_ACCOUNT_SERVICE_URL ?? "",
      );
      if (
        origin.protocol !== "https:" || origin.username || origin.password ||
        origin.search || origin.hash || origin.pathname !== "/"
      ) throw new Error();
      const upstream = await (dependencies.fetch ?? fetch)(
        new URL(`/v1/setup/${action}`, origin),
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "cache-control": "no-store",
          },
          body: JSON.stringify(payload),
          cache: "no-store",
          redirect: "error",
          signal: AbortSignal.timeout(15_000),
        },
      );
      if (!upstream.ok) {
        await upstream.body?.cancel();
        return json({ error: "connection_unavailable" }, 409);
      }
      const result = await boundedJson(upstream.body);
      if (action === "open") return json(opened.parse(result));
      const verified = z.union([connected, telegram]).parse(result);
      if (
        verified.status === "connect_telegram" &&
        Date.parse(verified.expires_at) <= Date.now()
      ) throw new Error();
      return json(verified);
    } catch {
      return json({ error: "connection_unavailable" }, 409);
    }
  };
}
