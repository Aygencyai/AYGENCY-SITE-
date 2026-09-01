# Eden CRM sender integration

Status: **complete and verified on `feat/eden-crm-sender`; branch published for review; not merged or deployed**

Repository: `Aygencyai/AYGENCY-SITE-`

Contract: `EdenApplicationSubmitted.v1`

Review: draft [PR #2](https://github.com/Aygencyai/AYGENCY-SITE-/pull/2), base
`main`; GitHub reports it as mergeable and both Vercel checks succeeded.

## Published preview evidence

Publishing the feature branch triggered the existing approved `aygency-site`
Vercel integration. Deployment `dpl_FBKiw6LRkzeeJxFwSz6XjEFCjHQh` is Ready at
`https://aygency-site-4vc3tm871-wazzalouis-projects.vercel.app` with target
Preview, not Production. Vercel authentication protects the preview, so the
provider build/check is recorded without claiming an unauthenticated browser
smoke test. No production alias or deployment changed.

During inspection, `vercel curl --yes` from this unlinked worktree unexpectedly
created a separate empty project named `eden-crm-sender-worktree`. It was
verified to have no deployments, domains, or environment variables, deleted
immediately, and its local link metadata was moved to Trash for recovery. The
approved `aygency-site` project was not relinked or mutated by that cleanup.

## Boundary

The browser first submits work email, inquiry permission, and attribution to the
same-origin `POST /api/eden/leads` route. That server route sends the approved
`EdenLeadCaptured.v1` event before any diagnostic question is revealed. The
completed model goes only to `POST /api/eden/applications`. Both routes validate,
sign exact bytes with separate server-only secrets, and call their approved
Supabase Edge Functions. The browser never receives either HMAC secret,
Supabase URL/key, CRM operator secret, or database credentials.

The application UUID and event UUID are generated with `randomUUID()` in the
dynamic server page. A browser retry reuses one frozen application snapshot and
both UUIDs. A new form visit creates a new application UUID. Email is a matching
fact only and is never used as the application identity.

## Browser application model

The form asks every locked v1 fact. It does not infer hours, workload, authority,
provider, country, budget readiness, or either acknowledgement. The 15 required
question answers and optional `eden-anything-else` answer map one-to-one to the
published catalogue.

Original structured values are retained in the submitted event. The browser's
Eden Blueprint is a deterministic local preview from those values. The CRM's
authoritative score and call brief are independently derived after ingestion.
No LLM, private Eden memory, conversation, credential, or customer operational
data is used by either derivation.

Inquiry consent is required and recorded with the email capture before the
diagnostic. Application processing and sales follow-up are also retained in the
completed application. Marketing is a separate optional checkbox, off by
default, and emitted only when granted. The honeypot receives a neutral response
and no downstream call.

## Exact transport

`src/lib/eden/crm.ts` serialises the event once and retries the same bytes,
timestamp, UUIDs, idempotency key, and signature. The request is:

```text
content-type: application/json
x-eden-event: EdenApplicationSubmitted.v1
x-eden-event-id: <event UUIDv4>
idempotency-key: <same event UUIDv4>
x-eden-timestamp: <10-digit Unix seconds>
x-eden-signature: v1=<HMAC-SHA256(timestamp + "." + raw body)>
```

The adapter accepts only a strict receipt:

- `201` and `duplicate: false` is a new atomic write;
- `200` and `duplicate: true` is an exact replay;
- `409` is a changed-body collision and is shown honestly, never as success;
- terminal `4xx` is not retried;
- timeouts, network failures, `408`, `425`, `429`, and `5xx` receive at most
  three attempts with the exact frozen request;
- a malformed or oversized success body is failure, not success.

In production, the website API returns `202` only after one of the two strict
CRM acceptance receipts. Local development without sender configuration returns
an explicit `recorded: false` preview receipt so the UI can be inspected without
claiming a write. Responses include application identity but not the Edge
request ID or upstream body. A Resend notification is attempted only after a
first-time completed-application acceptance; exact duplicates suppress it, and
notification failure cannot undo the committed CRM transaction.

## Validation and abuse controls

- The website route requires exact JSON and rejects over 48 KiB before mapping.
- The downstream event remains capped at 65,536 bytes.
- Unknown keys and option values fail closed in browser and server schemas.
- Production requires same-origin `Sec-Fetch-Site`/`Origin`, plus only explicitly
  configured exact HTTPS preview origins.
- Completion must take at least eight seconds; a snapshot older than five
  minutes is rejected so the downstream request window cannot be bypassed.
- The website applies a process-local five-per-15-minute hashed-client limiter.
  It is a first boundary only; the data plane independently applies durable
  source/client/email buckets without persisting raw IP or email fingerprints.
- Attribution keeps origin-relative landing path, referrer origin, and five
  bounded UTM fields. Click identifiers, URL queries/fragments, and full referrer
  paths are dropped.
- Public errors contain a bounded code/message. Logs contain `eventId` plus a
  coarse failure only, never answers, contact data, bot proof, signature, raw IP,
  or upstream response content.

## Browser abuse controls

Both same-origin routes enforce strict body bounds, exact schemas, origin
checks, honeypot neutralisation, and application rate limits before delivery.
The final application also enforces a plausible completion window. The CRM
event records `aygency-server-controls` as its provider and is accepted only
after the receiver verifies the server-only HMAC signature. The proof token is
removed before persistence, and the receiver independently applies durable
source/client/email rate limits.

## Environment names

| Name | Location | Purpose |
|---|---|---|
| `EDEN_LEAD_CAPTURE_INGEST_URL` | website server only | Exact approved HTTPS early-capture Edge Function URL; loopback HTTP is accepted only outside production. |
| `EDEN_LEAD_CAPTURE_SIGNING_SECRET` | website server only | Separate early-capture HMAC secret, at least 32 characters. |
| `EDEN_APPLICATION_INGEST_URL` | website server only | Exact approved HTTPS Edge Function URL; loopback HTTP is accepted only outside production. |
| `EDEN_APPLICATION_SIGNING_SECRET` | website server only | HMAC secret, at least 32 characters. |
| `EDEN_ALLOWED_ORIGINS` | website server only | Optional comma-separated exact HTTPS preview origins. |
| `EDEN_NOTIFICATION_EMAIL` | website server only | Optional application notification destination. |
| `EDEN_NOTIFICATION_FROM` | website server only | Optional verified Resend sender. |
| `RESEND_API_KEY` | website server only | Existing Resend credential. |
| `NEXT_PUBLIC_CAL_URL` | browser-safe | Existing HTTPS discovery booking link. |

Never add `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_DB_URL`, or
`EDEN_CRM_OPERATOR_SECRET` to this website environment. The receiver trusts the
website's layered-control assertion only after validating its HMAC signature.

## Golden interoperability evidence

The sender and dashboard each commit the byte-identical synthetic fixture at:

```text
tests/fixtures/eden-application-submitted-v3/valid-new.json
```

Locked results:

| Evidence | Value |
|---|---|
| Raw fixture SHA-256 | `15f1e62f1d976220633f895a9a4bfb7cca721b30ad1a2a83f8247f7b384995a5` |
| Application-input digest | `f082cf25d5595ee10347fff0ff37e7461216507253277233d8a649452e69ba35` |
| Canonical score output SHA-256 | `80748f179173ed0923462abf2af863a55ed9dea6f144d00b535fa78a4e6d5178` |
| Canonical brief output SHA-256 | `ca6c578fc154e48fe5a44bbce6c2fa9d45c6f9ec60f8105e4c368da9fd076317` |
| Qualification | `87 / qualified` |

## Disable and rollback

Disable ingress at the Edge Function first with
`EDEN_APPLICATION_INGEST_ENABLED=false`. The sender then fails honestly without
creating a record. Roll the website back to its recorded prior Vercel deployment
independently of the data plane/dashboard. Preserve existing CRM rows and audit
history; do not delete data as a code rollback.

Signing-secret rotation is disable-first because v1 accepts one receiver secret:
disable ingress, update the same new value independently on receiver and sender,
prove old fails/new reaches the disabled boundary, enable, perform one approved
synthetic `201`/`200` test, and revoke the old secret. Record identifiers and
times, never secret values.

## Required verification

Run before release:

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm exec tsc --noEmit
pnpm lint
pnpm build
pnpm test:e2e
pnpm audit --audit-level high
git diff --check
```

The browser suite must cover exact outgoing facts, missing bot proof, immutable
retry, honest collision, inert malicious text, accessibility, navigation/contact
regression, and no horizontal overflow at 375, 768, 1024, and 1440 pixels. Scan
the built browser chunks for every server-only environment name and a seeded
secret value before approval.
