import { describe, expect, it } from "vitest";
import { createFixedWindowRateLimiter } from "./rate-limit";

describe("Eden application rate limiter", () => {
  it("limits an identifier within a fixed window and resets afterwards", () => {
    let now = 1_000;
    const consume = createFixedWindowRateLimiter({
      limit: 2,
      windowMs: 10_000,
      now: () => now,
    });

    expect(consume("visitor")).toMatchObject({ allowed: true, remaining: 1 });
    expect(consume("visitor")).toMatchObject({ allowed: true, remaining: 0 });
    expect(consume("visitor")).toMatchObject({ allowed: false, remaining: 0 });
    expect(consume("another")).toMatchObject({ allowed: true, remaining: 1 });

    now = 11_001;
    expect(consume("visitor")).toMatchObject({ allowed: true, remaining: 1 });
  });
});
