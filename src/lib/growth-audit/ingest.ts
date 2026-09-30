import { createPrivateKey, sign, type KeyObject } from "node:crypto";
import { PACKS, type Pack } from "./questions";

/**
 * Server-only client for the `growth-audit-ingest` Supabase Edge Function.
 *
 * Every request is signed with an Ed25519 private key held only in this
 * site's server env. The Edge Function verifies with the matching public key
 * baked into its source, so no shared secret lives in Supabase and the
 * browser never talks to the database.
 */

const REQUEST_TIMEOUT_MS = 6_000;

export type IngestRequest =
  | { action: "invite"; code: string }
  | {
      action: "save" | "complete";
      auditId: string;
      inviteCode: string | null;
      version: string;
      answers: unknown;
      lastStep: string;
      stepsCompleted: number;
      landingPath: string;
      contact?: { name: string; email: string; company: string };
    };

export interface InvitePrefill {
  company: string;
  contactName: string | null;
  contactEmail: string | null;
  pack: Pack;
}

export class IngestUnavailableError extends Error {}

interface IngestConfig {
  url: string;
  key: KeyObject;
}

function readConfig(): IngestConfig | null {
  const url = process.env.GROWTH_AUDIT_INGEST_URL?.trim();
  const rawKey = process.env.GROWTH_AUDIT_SIGNING_KEY?.trim();
  if (!url || !rawKey) return null;
  return {
    url,
    key: createPrivateKey({ key: Buffer.from(rawKey, "base64"), format: "der", type: "pkcs8" }),
  };
}

export function signIngestBody(body: string, timestamp: string, key: KeyObject) {
  return sign(null, Buffer.from(`${timestamp}.${body}`), key).toString("base64");
}

async function post(request: IngestRequest): Promise<Record<string, unknown>> {
  const config = readConfig();
  if (!config) throw new IngestUnavailableError("Growth audit ingest is not configured.");

  const body = JSON.stringify(request);
  const timestamp = Math.floor(Date.now() / 1_000).toString();
  const response = await fetch(config.url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-aygency-timestamp": timestamp,
      "x-aygency-signature": signIngestBody(body, timestamp, config.key),
    },
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) {
    throw new IngestUnavailableError(`Growth audit ingest returned ${response.status}.`);
  }
  return (await response.json()) as Record<string, unknown>;
}

export async function lookupInvite(code: string): Promise<InvitePrefill | null> {
  if (!/^[A-Za-z0-9_-]{16,64}$/.test(code)) return null;
  try {
    const result = await post({ action: "invite", code });
    const invite = result.invite as (Omit<InvitePrefill, "pack"> & { pack?: string }) | null | undefined;
    if (!invite) return null;
    const pack = (PACKS as readonly string[]).includes(invite.pack ?? "") ? (invite.pack as Pack) : "general";
    return { ...invite, pack };
  } catch (error) {
    // A failed lookup must not block the audit: the prospect fills in their
    // own details instead, and the answers still save against a public row.
    console.error("Growth audit invite lookup failed:", error);
    return null;
  }
}

export async function sendAuditRecord(
  request: Extract<IngestRequest, { action: "save" | "complete" }>
): Promise<{ outcome: string }> {
  const result = await post(request);
  return { outcome: String(result.outcome ?? "unknown") };
}
