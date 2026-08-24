# Eden AI Personal Assistant Funnel — Build Plan

## Outcome

Build a premium, mobile-first product page at `/design-your-eden` that introduces Eden as Aygency's AI personal assistant before helping a prospective client describe the first version worth building. A focused assessment follows the product story, presents one question per screen, branches its volume language to the selected opportunity, and finishes with a useful Eden Blueprint plus a discovery-call CTA.

The funnel is an intake surface, not a database. A same-origin Aygency route will validate and forward the versioned `EdenApplicationSubmitted.v1` event to the approved CRM ingest endpoint. The CRM is the durable system of record. Resend is a best-effort internal notification only.

## Non-negotiable boundaries

- Preserve the current site architecture, contact flow, `src/lib/data.ts`, and `src/types/`.
- Use the existing void/cyan design tokens, Space Grotesk, DM Sans, JetBrains Mono, Tailwind, Framer Motion, React Hook Form, and Zod.
- Keep every CRM URL and credential server-only. No `NEXT_PUBLIC_` CRM variables and no browser-to-CRM request.
- Never request passwords, API keys, customer records, financial account details, health data, or other sensitive operational data.
- Treat all free text as untrusted: length-bound it, keep it as plain text, never render it as HTML, never put it in logs, and use React's normal escaped rendering.
- Preserve the exact validated answer set in the CRM event. Derived Blueprint recommendations supplement the answers; they never replace them.
- Inquiry-processing consent is required and distinct from optional marketing consent. Marketing is off by default.
- A CRM failure is a submission failure. A Resend failure is not.

## Experience map

The introduction sells Eden first: what she can own, how she operates, where human authority remains, and how a custom version adapts to the client's operation. It does not lead with questionnaire length or security boilerplate. A bottom-page “See what Eden could do for you” CTA opens the following one-question assessment:

| Step | Field | Interaction | Purpose |
| --- | --- | --- | --- |
| 1 | `primaryGoal` | Single choice | Select revenue, customer experience, operations, finance/admin, knowledge/people, leadership visibility, or another workflow. |
| 2 | `desiredOutcome` | Short free text | Describe what should be reliably true in the better future. |
| 3 | `currentChallenge` | Free text | Describe the current bottleneck at a high level. |
| 4 | `workflowVolume` | Single choice, branched copy | Ask about lead touches, customer conversations, workflow runs, finance items, knowledge requests, leadership reporting, or generic repetitions according to step 1. |
| 5 | `teamSize` | Single choice | Establish how many people the workflow affects. |
| 6 | `systems` | Multi-select | Capture categories of tools already in the workflow, including an explicit “not sure” option. No credentials or account identifiers. |
| 7 | `dataReadiness` | Single choice | Establish whether useful data is structured, fragmented, mostly manual, or unclear. |
| 8 | `autonomyPreference` | Single choice | Choose insight-only, draft-and-review, approval gates, bounded autonomy, or guidance needed. |
| 9 | `successMeasures` | Multi-select | Choose up to four outcomes such as time, response speed, quality, revenue, cost, visibility, and scale. |
| 10 | `timeline` | Single choice | Qualify urgency without manufacturing pressure. |
| 11 | `investmentRange` | Single choice | Set a realistic build-investment range, including “need guidance.” |
| 12 | `fullName` | Text | Identify the applicant. |
| 13 | `workEmail` | Email | Supply the reply address. |
| 14 | `companyName` | Text | Identify the company. |
| 15 | `consents` | Two separate checkboxes | Require inquiry processing and offer optional marketing permission. |

Back navigation retains values. Progress counts questions rather than intro/result screens and uses a semantic progress bar plus “Question X of 15.” Native radio/checkbox controls, visible focus, arrow-key behavior, number-key shortcuts, Enter/Command+Enter guidance, error announcements, and focus movement to each new heading make the flow keyboard and screen-reader friendly. Reduced-motion preferences remain governed by the existing `MotionProvider`.

## Blueprint result

After the CRM acknowledges the event, the result screen will show:

- the selected north star and the applicant's original desired outcome;
- a recommended agent-system archetype based on `primaryGoal`;
- a safe first deployment mode based on data readiness and autonomy preference;
- the selected measures of success and target horizon;
- an expandable “Your original answers” record using the exact submitted snapshot;
- a non-sensitive submission reference; and
- a primary “Book your discovery call” CTA using `NEXT_PUBLIC_CAL_URL`, with `/contact` as the fallback.

The Blueprint is deterministic positioning guidance, not an automated promise, quote, or technical design.

## Data and trust-boundary design

```text
Browser questionnaire
  -> POST /api/eden/applications (same origin, no privileged credential)
     -> strict server Zod validation + size/origin/bot/rate checks
     -> POST approved CRM ingest URL with EdenApplicationSubmitted.v1
        + Authorization: Bearer <server-only token>
        + Idempotency-Key: <submission UUID>
     <- accepted or duplicate receipt
     -> best-effort Resend notification (never the record)
  <- success reference -> Eden Blueprint
```

### Public submission shape

The browser sends a strict, size-bounded object containing:

- `submissionId`: UUID, stable across retries of the same immutable snapshot;
- `startedAt`: ISO timestamp used as one input to bot heuristics;
- `submittedAt`: ISO timestamp frozen with the submit snapshot so stateless retries produce a byte-stable CRM event;
- `answers`: the 11 operational answers in their original validated form;
- `contact`: full name, work email, and company name;
- `consent`: required inquiry boolean and optional marketing boolean;
- `attribution`: whitelisted first-touch `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, and `utm_content`, plus click IDs when present, a query-free landing path, and a query-free referrer; and
- `website`: an empty honeypot field.

The client snapshots this object on the first submit attempt. Automatic or manual retry resends the identical body with the identical `submissionId`. Choosing to edit after a failed attempt invalidates that snapshot and creates a fresh ID.

### CRM event contract

The server constructs the outbound envelope; the browser cannot choose event metadata:

```json
{
  "eventType": "EdenApplicationSubmitted.v1",
  "eventId": "<submission UUID>",
  "occurredAt": "<validated immutable submission timestamp>",
  "source": "aygency.ai/design-your-eden",
  "data": {
    "answers": "<exact validated answer object>",
    "contact": "<validated contact object>",
    "consent": {
      "inquiry": { "granted": true, "noticeVersion": "eden-inquiry-v1" },
      "marketing": { "granted": false, "noticeVersion": "eden-marketing-v1" }
    },
    "attribution": "<whitelisted attribution object>",
    "funnel": { "startedAt": "<validated questionnaire start timestamp>" }
  }
}
```

The destination is configured with `EDEN_CRM_ENDPOINT_URL`; `EDEN_CRM_API_TOKEN` is sent only from the server as a bearer token. Both are required at request time and are never imported by a client component. The endpoint receives `Idempotency-Key` and the event type as headers as well as the versioned event envelope. The server validates the frozen `submittedAt` against the start time and its own clock before mapping it to `occurredAt`; this keeps the full event identical across stateless retries with the same submission ID.

HTTP 2xx is accepted. HTTP 409 is treated as an idempotent replay only because the approved endpoint owns uniqueness for the submitted key. Timeouts, network failures, 408, 425, 429, and 5xx receive a small bounded retry with the same body and key; other 4xx responses fail without retry. A final CRM failure returns `503` so the browser can safely retry its frozen snapshot. No direct database driver or privileged database credential will be added.

## Validation and abuse controls

- Reject non-JSON requests and bodies over 48 KiB before forwarding.
- Use one shared strict Zod contract on client and server; the server remains authoritative.
- Bound every string and array, validate enum values and ISO timestamps, require inquiry consent, and reject unknown keys.
- Permit only whitelisted attribution keys; discard URL queries and fragments client-side before submission.
- Require a same-origin browser request in production, with optional additional exact origins from `EDEN_ALLOWED_ORIGINS` for controlled previews.
- Use an off-screen honeypot and a minimum-completion-time heuristic. Honeypot submissions receive a neutral success response but are not forwarded.
- Apply a process-local, hashed-IP fixed-window limit with `Retry-After` and rate headers. This is a useful application-layer control, not a claim of globally durable limiting; production should also retain Vercel Firewall/rate rules at the edge.
- Never log answers, email addresses, raw IPs, authorization headers, CRM response bodies, or notification content. Operational logs use the submission reference and coarse status only.
- Return generic client-safe failures. Keep vendor detail server-side and content-free.

## Notification semantics

After a first-time CRM acceptance, send a plain-text Resend notification to `EDEN_NOTIFICATION_EMAIL` (falling back to `CONTACT_EMAIL`). Use `EDEN_NOTIFICATION_FROM` when configured. The notification contains a concise, escaped-by-construction plain-text summary and the submission reference; it does not become a recovery store. A duplicate CRM receipt suppresses another notification. Notification failure is logged without applicant content and the successful CRM result is still returned.

## Planned files

- `src/app/design-your-eden/page.tsx` — metadata and server wrapper.
- `src/app/design-your-eden/DesignYourEdenClient.tsx` — RHF flow, navigation, submission snapshot, and result.
- `src/components/eden/*` — progress, question controls, shell, and Blueprint presentation.
- `src/lib/eden/application-schema.ts` — shared strict public schema and types.
- `src/lib/eden/questionnaire.ts` — labels, options, branching copy, and Blueprint mappings.
- `src/lib/eden/attribution.ts` — whitelisted query/referrer capture.
- `src/lib/eden/crm.ts` — server-only event construction and bounded idempotent delivery.
- `src/lib/eden/rate-limit.ts` — server-only best-effort application rate limit.
- `src/lib/eden/notification.ts` — server-only Resend notification.
- `src/app/api/eden/applications/route.ts` — public trust boundary and response semantics.
- navigation, footer, sitemap, environment example, and README — discoverability and deployment documentation.
- focused tests for schema, event mapping/retry behavior, routing controls, keyboard flow, branching, submission, and Blueprint output.

## Phased execution and commit gates

### Phase 1 — Contract and plan

Deliver this document before implementation.

Exit gate:

- isolated worktree is clean apart from this plan;
- `pnpm lint` passes;
- `pnpm build` passes; and
- commit as `docs: plan Design Your Eden funnel`.

### Phase 2 — Trusted submission pipeline

Deliver the shared schema, server-only CRM adapter, bounded safe retries, idempotency propagation, route-level size/origin/bot/rate controls, and post-CRM Resend notification. Document environment variables and add focused contract tests. Do not add UI beyond what is required to exercise the route.

Exit gate:

- validation tests cover valid, malformed, overlong, missing-consent, and extra-key inputs;
- delivery tests cover success, duplicate, retryable failure, terminal failure, and stable idempotency headers;
- route tests cover trust and bot controls without contacting a real CRM or Resend;
- `pnpm lint` passes;
- `pnpm build` passes; and
- commit as `feat: add Eden application submission pipeline`.

### Phase 3 — Questionnaire and Blueprint

Deliver the one-question flow, meaningful volume branch, progress, responsive design, keyboard/focus behavior, attribution capture, frozen retry snapshot, consent screen, success Blueprint, and discovery CTA. Add `/design-your-eden` to navigation/footer/sitemap while preserving `/contact`.

Exit gate:

- component/browser checks cover forward/back retention, branch copy, validation, keyboard operation, separate consent, failure retry with an unchanged ID/body, and successful Blueprint rendering;
- no horizontal overflow and a deliberate layout are verified at 375, 768, 1024, and 1440 px;
- reduced-motion and visible-focus behavior are checked;
- `pnpm lint` passes;
- `pnpm build` passes; and
- commit as `feat: build Design Your Eden questionnaire`.

### Phase 4 — Integration verification and handoff

Run a final regression pass across the new page, public route, existing homepage, contact page, navigation, and production build. Record verification evidence and any deployment prerequisites without adding live credentials or calling the real CRM.

Exit gate:

- all focused tests pass against local fakes;
- breakpoint screenshots are reviewed at 375, 768, 1024, and 1440 px;
- keyboard-only happy path and retry path pass;
- existing contact flow remains structurally unchanged;
- `pnpm lint` passes;
- `pnpm build` passes; and
- commit any verification-only fixes as `fix: harden Eden funnel integration` (no empty commit when no changes are needed).

## Deployment prerequisites

Set these only in the server deployment environment:

- `EDEN_CRM_ENDPOINT_URL` — exact HTTPS URL for the approved `EdenApplicationSubmitted.v1` ingest endpoint.
- `EDEN_CRM_API_TOKEN` — write-only endpoint credential; never a database service-role credential.
- `EDEN_ALLOWED_ORIGINS` — optional comma-separated exact HTTPS preview origins.
- `EDEN_NOTIFICATION_EMAIL` — optional notification recipient; falls back to `CONTACT_EMAIL`.
- `EDEN_NOTIFICATION_FROM` — optional verified Resend sender.

`NEXT_PUBLIC_CAL_URL` remains the only Eden-flow value intentionally available in the browser. Live CRM/Resend smoke submission is outside local verification because it would create a real record; it should be performed once in a controlled deployment using a clearly labelled test application and the same idempotency key on any retry.

## Iteration: email gate and concrete Eden example

This iteration responds to review feedback after the live-site integration.

### Entry decision

- Make work email question 1, immediately after the visitor chooses to explore their Eden.
- Require a valid email before revealing the operational questions.
- Keep full name and company name near the end, where they add context to the completed inquiry.
- Keep inquiry and marketing permissions separate on the final screen.
- Do not create an early browser-to-CRM write. Until the full application is submitted, the email remains only in React Hook Form state. The approved `EdenApplicationSubmitted.v1` event remains the sole durable CRM write.
- Treat abandoned-email capture as a future contract decision requiring its own approved event, consent wording, retention policy, and abuse controls.

### Blueprint decision

- Add a prominent `An example of what your Eden can do for you` section before the original-answer record.
- Build the example deterministically from validated option values such as priority, volume, systems, team size, and authority preference.
- Use controlled labels and scenario copy for the constructed example. Keep applicant free text in the original-answer record rather than interpolating it into generated operational claims.
- Show a simple three-part sequence: the work arriving, Eden coordinating the right specialist, and the agreed human decision point.

### Closing decision

- Close with a direct invitation to contact Aygency for more information, scope, and a quote.
- Display and link `build@aygency.ai` as the principal contact action.
- Retain the discovery-call CTA as a separate secondary route to satisfy the original conversion requirement.

### Verification gate

- Browser coverage proves email is the first required screen and remains retained through Back navigation.
- Blueprint coverage proves the concrete example changes with answers and uses controlled mappings.
- The closing email and discovery-call links are both present and keyboard accessible.
- Axe scans and horizontal-overflow checks pass at 375, 768, 1024, and 1440 pixels.
- `pnpm test`, `pnpm test:e2e`, `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm build` pass before the implementation commit.

## Iteration: reliable local completion and Eden-specific qualification

This iteration responds to hands-on review of the completed questionnaire on 24 August 2026.

### Submission recovery

- Treat the localhost origin rejection as a defect. The development server may bind to `0.0.0.0` while the browser correctly sends `http://localhost:<port>` as its origin.
- In non-production only, trust explicit HTTP loopback origins using `localhost`, `127.0.0.1`, or `::1`. Keep the production same-origin and configured HTTPS-origin policy unchanged.
- Add route coverage proving a localhost request is accepted for validation in development and still rejected in production or when it is genuinely cross-site.
- Keep CRM acceptance as the condition for describing an application as recorded.
- When storage is unavailable, offer a clearly labelled Blueprint preview and direct contact action without presenting the application as stored. Retrying must continue to use the same frozen submission.

### Eden question model

The questionnaire must qualify a managed AI personal assistant rather than a bespoke multi-agent systems build.

- Ask what Eden should take off the visitor's plate, how that responsibility appears during a normal week, which tools hold the context, who Eden supports, and what authority she should begin with.
- Keep the validated structure, answer preservation, branching, progress, keyboard behavior, and separate consent model.
- Rewrite every visitor-facing question and answer label around Eden's day-to-day role.
- Replace total build-budget language with a monthly managed-service question. Use qualification bands around `under £500`, `£500 to £1,000`, `£1,000 to £2,000`, and `£2,000+` per month, plus guidance. State that any one-off connection or onboarding work is scoped separately.
- Update the typed answer values so the stored payload preserves the actual monthly choice rather than reusing misleading legacy build-budget keys.
- Update Blueprint headings, examples, context, notification labels, fixtures, and tests to the same product vocabulary.

### Pricing rationale

Official pricing checked on 24 August 2026 places adjacent self-serve products below a managed Eden engagement: Motion lists $19 and $29 per seat monthly, Lindy lists $29.99 to $199.99 per user monthly, Relevance AI lists its Team tier at $349 monthly, and Sintra lists a $97 monthly workspace with optional usage packs extending to $1,200 monthly. Eden includes Aygency-led configuration, business context, connected workflows, and ongoing support, so the form should test willingness to pay in the managed-service range without publishing a fixed quote.

Primary references:

- https://www.usemotion.com/pricing
- https://www.lindy.ai/pricing
- https://relevanceai.com/pricing
- https://help.sintra.ai/en/articles/12606895-plans-and-pricing

### Conversion recovery

- Keep optional newsletter permission separate and off by default.
- Show `build@aygency.ai` and discovery-call actions on the recorded Blueprint.
- Also show a direct `build@aygency.ai` path when CRM delivery is unavailable so a temporary backend problem does not hide every contact route.

### Phase gates

1. Commit this plan after `pnpm lint` and `pnpm build` pass.
2. Repair local origin handling and add the honest preview/error conversion path. Run unit, browser, lint, type, build, and required breakpoint checks before committing.
3. Rewrite Eden qualification and monthly commercial bands. Update the complete stored-answer contract and run the full verification suite before committing.
4. Re-run a local manual submission. Confirm the loopback request reaches CRM delivery, the unconfigured local environment is described accurately, the Blueprint preview remains available, and production storage prerequisites are documented.
