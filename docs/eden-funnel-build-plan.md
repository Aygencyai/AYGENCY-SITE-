# Eden AI Personal Assistant Funnel — Build Plan

Status: **Phase 8 sender and disposable cross-system verification complete; feature branch published for review; not merged or deployed**

## Current Phase 8 authority

The locked CRM contract and current implementation supersede the historical
question/transport iterations retained later in this file. Do not implement the
old bearer-token envelope, click-ID attribution, build-budget fields, or inferred
facts. Read in this order:

1. dashboard `docs/contracts/eden-application-submitted-v1.md`;
2. dashboard `docs/eden-crm-build-plan.md`, Phase 8;
3. this repository's `docs/eden-crm-sender-integration.md`;
4. `docs/eden-funnel-verification.md`.

### Goal

Make the existing `/design-your-eden` experience an exact, safe website-server
producer for `EdenApplicationSubmitted.v1`, while preserving the live site,
contact flow, design system, and honest local Blueprint.

### Scope and exact deliverables

- A dynamic server page generates UUIDv4 `eventId` and `applicationId` and passes
  only the public Turnstile site key to the client.
- The 18-screen questionnaire captures work email first, then every locked v1
  answer, applicant/organisation facts, two explicit acknowledgements, separate
  inquiry/marketing consent, and a Turnstile proof.
- The browser freezes one immutable snapshot. Retry keeps identical UUIDs and
  bytes; a new visit/application gets a new UUID even for the same email.
- The same-origin API applies strict schema, 48 KiB, origin, timing, honeypot,
  process-local rate, and safe-error controls.
- The server adapter maps to the exact event catalogue, signs
  `timestamp + "." + raw_body` with HMAC-SHA-256, and validates only the locked
  `201`/`200` receipts. A changed-body `409` remains a conflict.
- Cloudflare Turnstile uses explicit rendering and mandatory downstream
  Siteverify. No database or service-role credential enters the site.
- The local Blueprint uses controlled deterministic mappings and React text
  rendering. It contains no private Eden/runtime data and does not claim CRM
  storage after failure.
- Unit/API and Playwright coverage prove contract facts, bot/origin/timing/rate
  boundaries, exact retry, conflict, inert malicious text, accessibility,
  navigation/contact regression, and 375/768/1024/1440 layouts.
- `docs/eden-crm-sender-integration.md` and the verification record document
  environment, disable, secret rotation, deployment prerequisites, and rollback.

### Dependencies

- Locked dashboard Phase 1 event/question/qualification/brief contract.
- Approved sender repository `Aygencyai/AYGENCY-SITE-`.
- Existing data-plane ingest function and local/disposable Supabase stack.
- Cloudflare's documented public test key for automated browser tests only.

### Verification and exit criteria

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

The sender phase exits only when all commands pass, sender/dashboard fixture
bytes share SHA-256
`a5ee75bb0404407d84dac68e118c577e1951633cfee81b1683fbad5269730ccf`,
the browser bundle contains no server-only variable/seeded-secret value, and the
disposable HTTP chain proves `201`, exact retry `200`, changed retry `409`, bot
failure, signature failure, and disabled ingress without partial writes.

Rollback is independent: disable ingress at the receiver, restore the previous
Vercel sender deployment, and preserve CRM/audit rows. No production deployment
is authorised by this phase.

## Historical outcome and design record (superseded where it conflicts above)

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
        + X-Eden-Signature: v1=<server-only exact-byte HMAC>
        + Idempotency-Key: <event UUID>
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

The current destination is configured with `EDEN_APPLICATION_INGEST_URL` and
signed only on the server with `EDEN_APPLICATION_SIGNING_SECRET`. Neither is
imported by a client component. The endpoint receives the event UUID as both
`Idempotency-Key` and `X-Eden-Event-Id`, plus the event type, timestamp, and
exact-byte HMAC headers. The server validates the frozen `submittedAt` against
the start time and its own clock; every bounded delivery retry reuses the same
body, timestamp, UUIDs, and signature.

Only a strict `201` new-write receipt or strict `200` exact-duplicate receipt is
accepted. HTTP `409` is a changed-body idempotency conflict and never success.
Timeouts, network failures, `408`, `425`, `429`, and `5xx` receive a small
bounded retry with the same frozen request; other `4xx` responses fail without
retry. A final CRM failure returns `503` so the browser can safely retry its
snapshot. No direct database driver or privileged database credential is added.

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

## Historical deployment prerequisites (superseded by the current Phase 8 authority)

Set these only in the server deployment environment:

- `EDEN_APPLICATION_INGEST_URL` — exact HTTPS URL for the approved `EdenApplicationSubmitted.v1` ingest endpoint.
- `EDEN_APPLICATION_SIGNING_SECRET` — server-only exact-byte HMAC secret; never a database service-role credential.
- `EDEN_APPLICATION_TURNSTILE_SITE_KEY` — public Cloudflare widget site key passed through the server-rendered page.
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

## Iteration: CRM-first Eden diagnosis and build draft

This iteration supersedes the earlier decision to keep the first email only in browser state. A visitor who grants inquiry permission must become a bounded CRM intake before the operational questions are revealed. The completed application remains a separate, immutable event.

### Phase 0: contract and trust-boundary plan

Goal: define the early capture, final application, and dashboard draft boundaries before changing code.

Scope:

- retain `EdenApplicationSubmitted.v1` as the approved final application contract and restore its HMAC-signed server sender;
- add a separate `EdenLeadCaptured.v1` contract for email, required inquiry permission, first-touch attribution, and a stable application identifier;
- keep both CRM credentials and the Supabase service role outside the browser;
- treat the dashboard `Create Eden` action as creation of a deterministic build draft, not live provisioning or onboarding; and
- preserve the exact submitted answers as untrusted source material alongside controlled derived recommendations.

Deliverables: this plan plus matching data-plane and dashboard plans.

Dependencies: the clean feature worktrees and the existing v1 CRM contract.

Exit criteria:

- the early-capture event has a distinct purpose, consent notice, idempotency key, retention boundary, and bot/rate policy;
- old v1 application records retain their original meaning;
- `pnpm lint` and `pnpm build` pass; and
- commit as `docs: plan CRM-first Eden diagnosis`.

### Phase 1: approved sender integration and email capture

Goal: make question 1 create a CRM intake before the visitor reaches question 2.

Scope:

- integrate the approved HMAC request signing, strict receipt validation, Cloudflare Turnstile verification path, bounded retries, and frozen idempotency behavior;
- add a same-origin `/api/eden/leads` route that validates and forwards only the early-capture allowlist;
- put required inquiry permission on the email gate and keep marketing permission optional and off by default at completion;
- in local preview mode, allow the visitor to continue with an explicit non-recorded state when server credentials are absent; and
- never notify through Resend until the complete application is durably accepted.

Deliverables: tested early-capture schema, CRM adapter, route, and email-gate UI.

Dependencies: the deployed data-plane contract will be required for live writes, but local tests use fakes.

Exit criteria:

- tests cover valid capture, unknown keys, missing permission, honeypot, origin denial, exact retry, conflict, timeout, and terminal rejection;
- browser coverage proves question 2 cannot be reached until question 1 has a valid capture receipt or a clearly labelled local-preview receipt;
- `pnpm test`, `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm build` pass; and
- commit as `feat: capture Eden enquiries before questions`.

### Phase 2: Eden-specific diagnostic and result

Goal: ensure every operational answer either sharpens the sales conversation or reduces the work needed to shape the first Eden.

Scope:

- replace the generic systems questionnaire with the approved Eden v1 question catalogue and Eden-specific wording;
- keep one question per screen, meaningful branching, answer retention, semantic progress, keyboard controls, and reduced-motion behavior;
- derive a controlled `This is how your Eden can help` plan from workload, open loops, meetings, inbox, calendar, travel, tools, timing, and decision context;
- display exact original answers separately without inserting free text into HTML or executable instructions; and
- close with `build@aygency.ai` plus a discovery-call action.

Deliverables: the complete diagnostic funnel, deterministic customer-facing capability plan, and matching tests.

Dependencies: Phase 1.

Exit criteria:

- happy-path, back-navigation, retry, separate-consent, and result-mapping tests pass;
- 375, 768, 1024, and 1440 pixel views have no horizontal overflow and retain visible focus;
- `pnpm test`, `pnpm test:e2e`, `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm build` pass; and
- commit as `feat: make Eden funnel diagnostic`.

### Phase 3: cross-surface verification and preview

Goal: prove the site remains stable and provide the requested local review route.

Scope: recheck the homepage, navigation, Eden introduction, funnel, Blueprint, contact route, API error states, and local preview behavior.

Deliverables: updated verification receipt and an open localhost tab on `/design-your-eden`.

Dependencies: Phases 1 and 2 plus the dashboard and data-plane phases in their own plans.

Exit criteria:

- all unit, browser, type, lint, and production-build checks pass;
- all required breakpoints are visually reviewed;
- no live credential or production CRM mutation is used for local verification; and
- commit any verification-only correction before opening the preview.

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

## Iteration: value-led qualification and implementation discovery

This iteration supersedes the public monthly-price bands above. The form should establish value and fit before a commercial conversation, without suggesting that Eden is available below Aygency's offer.

### Commercial decision

- Remove every visitor-facing Eden price band and do not publish a minimum, maximum, or cheaper service tier in the questionnaire.
- Replace `investmentRange` with a typed `buyingPriority` answer. Ask what should lead the visitor's decision: the strongest fit and result, a balance of capability and value, or the lowest possible monthly price.
- Treat the lowest-price response as qualification information, not as a promise that Aygency offers a reduced-price Eden.
- Show the selected buying priority in the original-answer record and the internal notification so it can guide the discovery conversation.
- Keep exact pricing for the scoped recommendation and contact conversation at `build@aygency.ai`.

### Question usefulness audit

Operational questions must pass both tests: the answer gives Aygency useful leverage for the next conversation, and it reduces the discovery needed to shape the visitor's Eden. Contact and consent screens remain only where needed to identify, deliver, and lawfully follow up on the inquiry.

| Screen | Visitor question | Conversation leverage | Eden build head start |
| --- | --- | --- | --- |
| 1 | Where should we send your Eden Blueprint? | Establishes a reachable lead before the detailed flow. | Provides the Blueprint and inquiry destination; no operational claim is inferred from it. |
| 2 | What should Eden take off your plate first? | Reveals the strongest value angle in the visitor's own priority order. | Selects the first responsibility and the branch used for later workload wording. |
| 3 | What should Eden make reliably true each week? | Defines the desired result and language to return to in discovery. | Supplies a practical acceptance criterion for the first workflow. |
| 4 | What gets in the way today, and what happens when it slips? | Exposes the present cost, urgency, and consequence of inaction. | Captures the current process and failure modes that the design must address. |
| 5 | How much of this work appears in a normal week? | Makes the opportunity and likely return easier to size. | Establishes frequency, capacity, and trigger volume using goal-specific wording. |
| 6 | When Eden needs your decision, how should she present it? | Reveals the principal’s preferred way to review choices. | Shapes one person’s briefings and decision hand-offs; every other person receives a separate Eden. |
| 7 | Where would Eden need to work? | Surfaces integration complexity early. | Identifies the initial tool categories and context sources. |
| 8 | How ready is the context Eden would need? | Reveals onboarding effort and a likely implementation objection. | Establishes whether to connect, consolidate, document, or create context first. |
| 9 | How much authority should Eden start with? | Makes trust and risk preferences discussable. | Sets the first approval gates, guardrails, and escalation boundary. |
| 10 | How would you know Eden is earning her place? | Builds the commercial case around outcomes the visitor chose. | Defines initial measures for evaluation and iteration. |
| 11 | How ready are you to put Eden to work? | Separates immediate buyers, active evaluators, and early exploration. | Sets a realistic discovery and onboarding horizon. |
| 12 | What matters most when choosing your Eden? | Reveals whether the sale should lead with result, value, or price sensitivity. | Establishes the trade-off that should guide the scoped recommendation without changing the offered price. |
| 13 | Who are we designing this with? | Identifies the accountable contact and makes follow-up personal. | Names the initial system owner for discovery purposes. |
| 14 | Which organisation would Eden be joining? | Gives the conversation an account and operating context. | Establishes the organisational boundary to validate in discovery. |
| 15 | May Aygency respond, and separately may it send useful updates? | Records the permitted follow-up paths. | Keeps inquiry and marketing consent distinct from operational requirements. |

Free text remains untrusted original input. It may be displayed safely and used by a person in discovery, but it must not be interpolated into executable instructions, email headers, generated claims, or HTML.

### Phase gates

1. Commit this question audit after `pnpm lint` and `pnpm build` pass.
2. Update the Zod contract, questionnaire copy, Blueprint, notification, fixtures, and tests as one implementation phase. Preserve original answers and keep the event name `EdenApplicationSubmitted.v1` while replacing the obsolete price field with the newly approved buying-priority field.
3. Run `pnpm test`, `pnpm test:e2e`, `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm build`. Review 375, 768, 1024, and 1440 pixel layouts before the implementation commit.
4. Reopen the verified local route for review and confirm the browser payload contains no price band.

## Iteration: decisive hero action

This iteration responds to review feedback that the hero's `See how Eden works` anchor produces only a small page movement and does not feel like a meaningful action.

### Interaction decision

- Replace the hero anchor with a real button that starts the same validated questionnaire as the closing Eden CTA.
- Label the action `Show me what Eden could do` so the outcome is clear without introducing internal Blueprint terminology too early.
- Keep the full capabilities and operating explanation immediately below the hero for visitors who continue scrolling.
- Keep Contact Us available through the global navigation and the existing secondary hero action.
- Preserve the first-screen work-email gate, answer model, attribution capture, and submission behavior.

### Verification gate

- Browser coverage proves the hero action changes the page from the product introduction to question 1 and focuses its heading.
- The closing action continues to start the same questionnaire.
- Keyboard activation, reduced motion, and scroll restoration continue to work.
- `pnpm test`, `pnpm test:e2e`, `pnpm exec tsc --noEmit`, `pnpm lint`, and `pnpm build` pass before the implementation commit.

## Current execution order: 28 August 2026

The `CRM-first Eden diagnosis and build draft` phases in this document are the current, chronologically latest direction and supersede the earlier browser-only email decision and generic questionnaire implementation. Execute them in this order: contract plan, email capture, Eden-specific diagnostic and result, then cross-surface verification and localhost preview.

## Iteration: plain-language 25-question Eden diagnostic and researched Brain

**Date:** 1 September 2026

**Status:** Phases 0–1 complete; backward-compatible V3 receiver is Phase 2

This iteration supersedes the earlier 15-question catalogue and any visitor
copy that describes a capability as parked. It also corrects the handoff model:
**Create Eden** is the only founder decision required to build the technical
Eden. The customer connects through the secure Telegram flow, Eden completes
the conversational onboarding, verifies her deterministic readiness state, and
then begins normal operation. There is no separate founder or dashboard
Activate Eden button.

### Phase 0: freeze the V3 question and research contract

**Goal:** Make every question understandable without AI or operations jargon,
while collecting enough useful context to produce a specific result and give
the created Eden a meaningful head start.

**Question screens:**

| # | Visitor-facing question | Answer type and purpose |
|---|---|---|
| 1 | Where should we send your Eden summary? | Work email plus inquiry consent; creates the early CRM lead. |
| 2 | What should Eden take off your plate first? | Multi-select priorities. Household logistics remains; reservations is removed. |
| 3 | In a normal week, what do you most wish someone else would handle for you? | Required open text describing real work. |
| 4 | What would you like Eden to make reliably happen every week? | Required open text defining the desired result. |
| 5 | What gets missed or delayed when you are busy, and what happens when it slips? | Required open text combining current friction and consequence. |
| 6 | Roughly how many tasks, requests, or follow-ups compete for your attention each week? | Plain-language volume bands; replaces “open loops.” |
| 7 | How many hours does that work take from you in a typical week? | Whole-hour estimate. |
| 8 | How meeting-heavy is a normal week? | Quick single choice. |
| 9 | How demanding is your inbox in a normal week? | Quick single choice. |
| 10 | How much coordination does your calendar need? | Quick single choice. |
| 11 | How often does work travel create extra planning or follow-up? | Quick single choice. |
| 12 | Where would Eden need to work with you? | Multi-select tool categories. |
| 13 | How ready is the information Eden would need? | Organised, partly organised, scattered, or mostly in the visitor’s head. |
| 14 | What should Eden understand about you or your work from day one? | Required open text for the initial Brain. |
| 15 | When Eden needs your decision, how should she present it? | One clear recommendation, a short list with trade-offs, full context, or questions first. |
| 16 | How should Eden begin helping? | Suggest only, prepare for approval, or handle agreed routine work. |
| 17 | Which decisions should Eden always bring back to you? | Required open text defining the customer’s boundaries. |
| 18 | What would you like Eden to brief you on, and how often? | Optional open text for useful proactive rhythms. |
| 19 | How would you know Eden is earning her place? | Required open text defining success. |
| 20 | Who should look after Eden once she is set up? | Managed by Aygency or customer-maintained. |
| 21 | When would you like Eden to start? | Timing signal. |
| 22 | What matters more when choosing your Eden? | Strongest outcome even if it costs more; right balance of outcome and cost; or lowest possible price. |
| 23 | Who are we designing this with? | Name and optional contact context. |
| 24 | Would you like to share the organisation Eden would support? | Optional organisation context, including a public website. |
| 25 | Is there anything else Eden should understand? | Optional open text, separate marketing consent, and final bot check. |

The event name remains `EdenApplicationSubmitted.v1`; the source form version
advances to `eden-application.v3`. V1 and V2 snapshots remain immutable and
valid under their original catalogues. V3 stores all original answers exactly,
labels every free-text answer as untrusted, and never turns applicant prose
into commands, permissions, schedules, HTML, or executable configuration.

Eden is a one-person product: each Eden supports one named principal through
one isolated VM and Brain. If another person needs Eden, they receive their own
Eden rather than sharing the first person’s assistant.

If an organisation website is supplied, **Create Eden** may start a separate
least-privileged public-research step. The browser never performs that research.
The retriever may access only validated public HTTP(S) pages after DNS/IP,
redirect, content-type, size, timeout, and credential checks. It produces a
bounded, cited, untrusted evidence pack. The contextual builder may interpret
that evidence, but deterministic code decides which cited facts enter the
customer’s Obsidian-compatible Brain. Source URL, retrieval time, and evidence
digest stay attached; page instructions cannot grant tools or authority.

**Exit criteria:** the plan is committed only after lint and production build
pass. No application, CRM row, dashboard action, builder job, or live VM changes
in this phase.

### Phase 1: build and verify the local V3 funnel

**Goal:** Replace the current questionnaire and result with the 25-screen
plain-language experience for local review.

**Scope:** Zod/RHF types, V3 event mapping, copy, option labels, open-text
controls, progress, keyboard flow, retained answers, simple-language Eden
summary, fixtures, unit tests, Playwright, and 375/768/1024/1440 review.

**Exit criteria:** all repository tests, strict TypeScript, lint, production
build, audit, and Eden Playwright journeys pass; reservations and “open loops”
are absent from visitor copy and payload; original free text renders inertly;
the local preview is reopened before commit.

**Completed 1 September 2026:** The local funnel now contains exactly 25
one-question screens and eight useful open-text opportunities. Reservations and
visitor-facing “open loops” are absent. Household logistics remains a normal
Eden outcome. The commercial question now asks directly whether the visitor
prioritises the strongest outcome, a balance of outcome and cost, or the lowest
possible price. The final Eden summary uses simple language, preserves every
original answer as inert text, and changes its recommended responsibilities and
working example from the controlled selections.

The website sender emits the new immutable `eden-application.v3` catalogue and
has a byte-shared golden fixture ready for the Phase 2 receiver. The gate passed
58 unit/API tests with one opt-in integration test skipped, strict TypeScript,
zero-warning lint, all 12 Playwright journeys including Axe and exact retry,
375/768/1024/1440 overflow and screenshot review, and the production Next.js
build. The audit has no high or critical advisory; its two moderate advisories
are outside this release gate. The localhost review remains non-recording until
the V3 receiver is deployed.

### Phase 2: add the backward-compatible V3 CRM receiver

**Status:** Source complete and verified 1 September 2026 in AOS commit
`5804a10`; production migration and Edge rollout remain gated Phase 4 work.

**Goal:** Accept and store the new exact snapshot without changing V1 or V2.

**Scope:** additive Edge catalogue and derivations, forward-only migration,
exact V3 storage, dashboard-safe projection, build-spec mapping, hostile-input
tests, and disabled-first deployment.

**Exit criteria:** V1, V2, and V3 golden payloads pass together; retry remains
byte-identical; unknown questions and credential-shaped text fail closed; the
browser still has no database authority; full AOS Python, Deno, SQL, shell, and
diff gates pass before commit and rollout.

**Verification:** 2,417 Python tests passed with five expected failures, 177
Deno tests passed, and the fresh PostgreSQL migration/authority/concurrency
suite proved exact V3 storage, immutable retry, Create Eden queueing, and worker
claim while retaining V1/V2 compatibility.

### Phase 3: add cited website research to Create Eden

**Goal:** Let the contextual build use useful public company context without
giving Hermes arbitrary browsing or treating web content as instructions.

**Scope:** safe public-site retriever, bounded cited evidence schema, immutable
application/site/retrieval bindings, research status in the one-click job,
builder prompt integration, Brain source notes, idempotency, safe retry, and
content-free dashboard progress.

**Exit criteria:** synthetic websites prove useful cited differences; private
addresses, redirects, credentials, prompt injection, unsupported content,
oversized pages, crossed applications, and stale evidence fail closed; no raw
page enters logs or executable files; the same Create Eden request reuses the
same research/build/provisioning chain.

### Phase 4: deploy and run the Louis acceptance journey

**Goal:** Prove the first real founder-observed customer journey using Louis’s
own answers and no manual stage between Create Eden and onboarding.

**Scope:** production website rollout, live Turnstile submission, dashboard
read-back, one Create Eden click, isolated VM and LLM-route verification,
private Telegram link, automatic conversational onboarding, automatic readiness
transition, and first normal Eden interaction.

**Exit criteria:** Louis’s name and email appear in the Eden dashboard; one
click creates exactly one VM and contextual Brain; the LLM route is healthy
without exposing its credential; the private Telegram binding starts onboarding
automatically; completing onboarding makes Eden say she is ready and begin
normal operation; no separate activation button or founder approval exists.
