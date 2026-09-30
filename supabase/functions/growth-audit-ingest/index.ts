// growth-audit-ingest — receives AI Growth Audit answers from aygency.ai.
//
// Only the aygency-site server can call this: every request carries an
// Ed25519 signature over `${timestamp}.${rawBody}`, verified against the
// public key below (the private half lives only in the site's Vercel env).
// No shared secret is stored in Supabase. Writes go to crm.growth_audits via
// the function's built-in SUPABASE_DB_URL; the tables have RLS on and no
// grants for anon/authenticated.
//
// Deployed from projects/aygency-site/supabase/functions/growth-audit-ingest.
import postgres from "npm:postgres@3.4.5";

const PUBLIC_KEY_BASE64 = "8vvm7L0AkAPRJVNC//bUKvN134zCV+y3d6L75tlhzCQ=";
const MAX_BODY_BYTES = 65_536;
const MAX_SKEW_SECONDS = 300;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const CODE = /^[A-Za-z0-9_-]{16,64}$/;
const VERSION = /^growth-audit\.v\d+$/;

const sql = postgres(Deno.env.get("SUPABASE_DB_URL")!, { max: 3, prepare: false });

let publicKey: CryptoKey | null = null;
async function getPublicKey() {
  if (!publicKey) {
    const raw = Uint8Array.from(atob(PUBLIC_KEY_BASE64), (c) => c.charCodeAt(0));
    publicKey = await crypto.subtle.importKey("raw", raw, { name: "Ed25519" }, false, ["verify"]);
  }
  return publicKey;
}

function json(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

async function verified(req: Request, rawBody: string) {
  const timestamp = req.headers.get("x-aygency-timestamp") ?? "";
  const signature = req.headers.get("x-aygency-signature") ?? "";
  if (!/^\d{10}$/.test(timestamp) || !signature) return false;
  if (Math.abs(Date.now() / 1_000 - Number(timestamp)) > MAX_SKEW_SECONDS) return false;
  let signatureBytes: Uint8Array;
  try {
    signatureBytes = Uint8Array.from(atob(signature), (c) => c.charCodeAt(0));
  } catch {
    return false;
  }
  return crypto.subtle.verify(
    { name: "Ed25519" },
    await getPublicKey(),
    signatureBytes,
    new TextEncoder().encode(`${timestamp}.${rawBody}`),
  );
}

function boundedString(value: unknown, max: number) {
  return typeof value === "string" && value.length > 0 && value.length <= max ? value : null;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return json(405, { error: "method_not_allowed" });

  const rawBody = await req.text();
  if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
    return json(413, { error: "too_large" });
  }
  if (!(await verified(req, rawBody))) return json(401, { error: "unauthorised" });

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return json(400, { error: "invalid_json" });
  }

  try {
    if (body.action === "invite") {
      const code = boundedString(body.code, 64);
      if (!code || !CODE.test(code)) return json(200, { invite: null });
      const [row] = await sql`
        select company, contact_name, contact_email, pack
        from crm.growth_audit_invites
        where code = ${code} and revoked_at is null`;
      return json(200, {
        invite: row
          ? { company: row.company, contactName: row.contact_name, contactEmail: row.contact_email, pack: row.pack }
          : null,
      });
    }

    if (body.action !== "save" && body.action !== "complete") {
      return json(400, { error: "unknown_action" });
    }

    const auditId = boundedString(body.auditId, 36);
    const version = boundedString(body.version, 40);
    const lastStep = boundedString(body.lastStep, 60);
    const landingPath = boundedString(body.landingPath, 300);
    const stepsCompleted = Number.isInteger(body.stepsCompleted) ? Number(body.stepsCompleted) : 0;
    const answers = body.answers;
    if (!auditId || !UUID.test(auditId) || !version || !VERSION.test(version) || !lastStep) {
      return json(400, { error: "invalid_record" });
    }
    if (typeof answers !== "object" || answers === null || Array.isArray(answers)) {
      return json(400, { error: "invalid_answers" });
    }

    let inviteId: string | null = null;
    let pack = "general";
    const inviteCode = boundedString(body.inviteCode, 64);
    if (inviteCode && CODE.test(inviteCode)) {
      const [invite] = await sql`
        select id, pack from crm.growth_audit_invites where code = ${inviteCode} and revoked_at is null`;
      inviteId = invite?.id ?? null;
      pack = invite?.pack ?? "general";
    }
    const source = inviteId ? "invite" : "public";

    const contact = (body.contact ?? {}) as Record<string, unknown>;
    const complete = body.action === "complete";
    const name = complete ? boundedString(contact.name, 200) : null;
    const email = complete ? boundedString(contact.email, 320) : null;
    const company = complete ? boundedString(contact.company, 200) : null;
    if (complete && (!name || !email || !email.includes("@") || !company)) {
      return json(400, { error: "invalid_contact" });
    }

    // A completed audit is final: later saves or repeat completes change nothing.
    const [row] = await sql`
      insert into crm.growth_audits as a (
        id, invite_id, source, pack, question_set_version, answers, last_step, steps_completed,
        landing_path, contact_name, contact_email, company, consent_at, completed_at
      ) values (
        ${auditId}, ${inviteId}, ${source}, ${pack}, ${version}, ${sql.json(answers as never)}, ${lastStep},
        ${stepsCompleted}, ${landingPath}, ${name}, ${email}, ${company},
        ${complete ? sql`now()` : null}, ${complete ? sql`now()` : null}
      )
      on conflict (id) do update set
        answers = excluded.answers,
        last_step = excluded.last_step,
        steps_completed = greatest(a.steps_completed, excluded.steps_completed),
        invite_id = coalesce(a.invite_id, excluded.invite_id),
        pack = case when a.invite_id is not null then a.pack else excluded.pack end,
        source = case when a.invite_id is not null then a.source else excluded.source end,
        contact_name = coalesce(excluded.contact_name, a.contact_name),
        contact_email = coalesce(excluded.contact_email, a.contact_email),
        company = coalesce(excluded.company, a.company),
        consent_at = coalesce(a.consent_at, excluded.consent_at),
        completed_at = coalesce(a.completed_at, excluded.completed_at),
        updated_at = now()
      where a.completed_at is null
      returning completed_at`;

    if (!row) return json(200, { outcome: "already_completed" });
    return json(200, { outcome: complete ? "completed" : "saved" });
  } catch (error) {
    console.error("growth-audit-ingest failed", error instanceof Error ? error.message : error);
    return json(500, { error: "storage_failed" });
  }
});
