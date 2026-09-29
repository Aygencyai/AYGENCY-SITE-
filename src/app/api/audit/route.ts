import { NextResponse } from "next/server";
import { z } from "zod";
import { createFixedWindowRateLimiter, getHashedRequestIdentifier } from "@/lib/eden/rate-limit";
import { IngestUnavailableError, sendAuditRecord } from "@/lib/growth-audit/ingest";
import { sendAuditNotification } from "@/lib/growth-audit/notification";
import {
  QUESTION_SET_VERSION,
  completeAnswersSchema,
  contactSchema,
  draftAnswersSchema,
} from "@/lib/growth-audit/questions";

// Drafts save on every step (about 20 per audit), so the window is generous.
const consumeRateLimit = createFixedWindowRateLimiter({ limit: 60 });

const envelope = z.object({
  auditId: z.uuid(),
  inviteCode: z.string().regex(/^[A-Za-z0-9_-]{16,64}$/).nullable(),
  lastStep: z.string().min(1).max(60),
  stepsCompleted: z.number().int().min(0).max(100),
});

const saveRequest = envelope.extend({
  action: z.literal("save"),
  answers: draftAnswersSchema,
});

const completeRequest = envelope.extend({
  action: z.literal("complete"),
  answers: completeAnswersSchema,
  contact: contactSchema,
  consent: z.literal(true),
});

const auditRequest = z.discriminatedUnion("action", [saveRequest, completeRequest]);

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) {
    return NextResponse.json({ error: "Not allowed." }, { status: 403 });
  }
  if (!consumeRateLimit(getHashedRequestIdentifier(request)).allowed) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = auditRequest.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Some answers are missing or invalid." }, { status: 400 });
  }
  const data = parsed.data;

  try {
    const { outcome } = await sendAuditRecord({
      action: data.action,
      auditId: data.auditId,
      inviteCode: data.inviteCode,
      version: QUESTION_SET_VERSION,
      answers: data.answers,
      lastStep: data.lastStep,
      stepsCompleted: data.stepsCompleted,
      landingPath: "/audit",
      contact: data.action === "complete" ? data.contact : undefined,
    });

    if (data.action === "complete" && outcome === "completed") {
      // The answers are already stored; a failed email must not fail the audit.
      await sendAuditNotification(data.answers, data.contact, data.auditId).catch((error) =>
        console.error("Growth audit notification failed:", error)
      );
    }

    return NextResponse.json({ outcome });
  } catch (error) {
    if (!(error instanceof IngestUnavailableError)) console.error("Growth audit save failed:", error);
    else console.error(error.message);
    return NextResponse.json({ error: "We couldn't save that just now." }, { status: 502 });
  }
}
