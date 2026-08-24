import { createHmac, randomBytes } from "node:crypto";

const DEFAULT_LIMIT = 5;
const DEFAULT_WINDOW_MS = 15 * 60 * 1_000;
const MAX_IDENTIFIERS = 10_000;
const processSalt = randomBytes(32);

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

export interface RateLimitDecision {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

interface RateLimiterOptions {
  limit?: number;
  windowMs?: number;
  now?: () => number;
}

export function createFixedWindowRateLimiter({
  limit = DEFAULT_LIMIT,
  windowMs = DEFAULT_WINDOW_MS,
  now = Date.now,
}: RateLimiterOptions = {}) {
  const records = new Map<string, RateLimitRecord>();

  return (identifier: string): RateLimitDecision => {
    const currentTime = now();
    const existing = records.get(identifier);

    if (!existing || existing.resetAt <= currentTime) {
      if (records.size >= MAX_IDENTIFIERS && !records.has(identifier)) {
        const oldestIdentifier = records.keys().next().value;
        if (oldestIdentifier) records.delete(oldestIdentifier);
      }

      const record = { count: 1, resetAt: currentTime + windowMs };
      records.set(identifier, record);
      return {
        allowed: true,
        limit,
        remaining: Math.max(limit - 1, 0),
        resetAt: record.resetAt,
      };
    }

    existing.count += 1;
    return {
      allowed: existing.count <= limit,
      limit,
      remaining: Math.max(limit - existing.count, 0),
      resetAt: existing.resetAt,
    };
  };
}

function firstForwardedValue(value: string | null) {
  return value?.split(",")[0]?.trim().slice(0, 128) || null;
}

export function getHashedRequestIdentifier(request: Request) {
  const headers = request.headers;
  const address =
    firstForwardedValue(headers.get("x-vercel-forwarded-for")) ??
    firstForwardedValue(headers.get("x-forwarded-for")) ??
    firstForwardedValue(headers.get("x-real-ip"));

  const fallback = [
    headers.get("user-agent")?.slice(0, 300) ?? "unknown-agent",
    headers.get("accept-language")?.slice(0, 100) ?? "unknown-language",
  ].join("|");

  return createHmac("sha256", processSalt)
    .update(address ?? fallback)
    .digest("hex");
}

const consumeIdentifier = createFixedWindowRateLimiter();

export function consumeEdenApplicationRateLimit(request: Request) {
  return consumeIdentifier(getHashedRequestIdentifier(request));
}
