import { afterEach, describe, expect, it, vi } from "vitest";

const send = vi.fn();
vi.mock("resend", () => ({
  Resend: vi.fn(function () {
    return { emails: { send } };
  }),
}));

const { POST } = await import("./route");

const valid = { name: "Test", email: "t@example.com", message: "Hello there team" };

function req(body: unknown) {
  return new Request("https://www.aygency.ai/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

afterEach(() => {
  send.mockReset();
  vi.restoreAllMocks();
});

// Mocked only: no real email is sent.
describe("POST /api/contact", () => {
  it("rejects missing fields with 400", async () => {
    const res = await POST(req({ name: "", email: "", message: "" }));
    expect(res.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects a missing message with 400", async () => {
    const res = await POST(req({ name: "Test", email: "t@example.com" }));
    expect(res.status).toBe(400);
    expect(send).not.toHaveBeenCalled();
  });

  it("sends to build@aygency.ai with reply-to", async () => {
    send.mockResolvedValue({ data: { id: "x" }, error: null });
    const res = await POST(req(valid));
    expect(res.status).toBe(200);
    expect(send).toHaveBeenCalledWith(
      expect.objectContaining({ to: "build@aygency.ai", replyTo: "t@example.com" }),
    );
  });

  it("returns 500 when the provider throws", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    send.mockRejectedValue(new Error("boom"));
    const res = await POST(req(valid));
    expect(res.status).toBe(500);
  });

  // Known bug: the handler ignores Resend's returned error object.
  it.todo("returns 500 when Resend returns an error object");
});
