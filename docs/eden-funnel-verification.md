# Eden AI Personal Assistant: Verification Record

Date: 28 August 2026

Current branch: `feat/eden-live-site`

Current isolated worktree:
`/Users/elaygency/aygency/projects/aygency-site-eden-live`

Phase 8 base: `efccb184d30084e38ba44d33d1fc047c56be5459`

Production status: **local feature worktree only; not pushed, merged, or deployed; no live CRM, Vercel production, Supabase, or dashboard mutation**

## Current CRM-first diagnostic receipt

The first questionnaire screen now posts a strict `EdenLeadCaptured.v1` event
through the same-origin `/api/eden/leads` route before question 2 is revealed.
It uses a separate event UUID and signing secret while retaining the final
application UUID, so the private CRM intake can move from `captured` to
`diagnostic_complete`. Inquiry permission is recorded at that gate. Optional
marketing permission remains separate and off at completion.

The completed `EdenApplicationSubmitted.v1` sender remains the system-of-record
path for the diagnostic. Resend remains a best-effort notification after first
acceptance only. Local development without sender credentials receives an
explicit `recorded: false` result; production does not weaken CRM acceptance.

The result now opens with `This is how your Eden can help`, derives three
controlled responsibilities from structured workload and priority answers, and
shows a matching working scenario. Applicant free text appears only in the
collapsed original-answer record and is never interpolated into capability
claims.

Current phase gate:

| Command | Result |
|---|---|
| `pnpm test` | PASS, 55 tests; one opt-in local integration test skipped |
| `pnpm exec tsc --noEmit` | PASS |
| `pnpm lint` | PASS, zero warnings |
| `pnpm build` | PASS on the repository-standard Next.js 14.2.35 |
| `pnpm test:e2e` | PASS, 11 browser tests including Axe and 375/768/1024/1440 screenshots |
| `pnpm audit --audit-level high` | PASS; two moderate findings remain below the gate |

This receipt supersedes the browser-only email statements in the historical
sections below.

## Historical Phase 8 review context

Review surface: draft [PR #2](https://github.com/Aygencyai/AYGENCY-SITE-/pull/2)
against `main`, reported mergeable by GitHub. Both Vercel checks passed. The
approved `aygency-site` integration produced Ready Preview deployment
`dpl_FBKiw6LRkzeeJxFwSz6XjEFCjHQh`; no production target changed.

One preview-inspection command from the unlinked worktree auto-created an empty
separate Vercel project named `eden-crm-sender-worktree`. It was verified to
contain no deployments, domains, or environment variables, deleted immediately,
and its local link was moved to Trash. The approved project remained untouched.

## Phase 8 CRM sender receipt

The existing Eden experience now produces the locked
`EdenApplicationSubmitted.v1` contract through a server-only HMAC boundary. It
asks rather than infers every required fact, generates application/event UUIDs
on the dynamic server page, keeps an immutable browser retry snapshot, and uses
layered same-origin, honeypot, timing, application-limit, and durable receiver
rate controls on both intake stages. The obsolete
bearer envelope and legacy Eden question model are no longer used by code.

The V3 sender fixture has SHA-256
`15f1e62f1d976220633f895a9a4bfb7cca721b30ad1a2a83f8247f7b384995a5`.
The event produces application digest `f082cf25…`, deterministic score
`87 / qualified`, qualification output digest `80748f17…`, and call-brief digest
`ca6c578f…` in the independently implemented consumers.

### Current automated verification

| Command | Result | Coverage |
|---|---|---|
| `pnpm test` | PASS, 7 files / 39 tests; one local-integration file/test skipped by default | Browser/server schema, exact event mapping, HMAC headers, byte-stable retries, receipt/conflict classes, origin/timing/honeypot/rate behavior, attribution, notification ordering, and deterministic Blueprint mappings. |
| Opt-in local integration test | PASS, 1/1 against the real disposable Edge Function | Accepted write, exact duplicate, changed-body collision, invalid bot proof, active/retired signing secrets, disabled ingress, and a concurrent changed-body race with exactly one winner. |
| `pnpm exec tsc --noEmit` | PASS | Strict TypeScript after the Next 15 compiler update. |
| `pnpm lint` | PASS, zero warnings/errors | ESLint CLI over application/tests/config; only generated `next-env.d.ts` is ignored. |
| `pnpm build` | PASS | Next.js `14.2.35`; dynamic `/design-your-eden` and `/api/eden/applications` compile successfully. |
| `pnpm test:e2e` | PASS, 11/11 | Exact outgoing facts, consent, Turnstile failure, frozen retry, honest collision, inert malicious text, critical Axe checks, navigation/contact/sitemap regression, and all four required widths. |
| `pnpm audit --audit-level high` | PASS | Zero high or critical advisories; two moderate findings remain below the Phase 8 gate. |

Playwright reported no critical accessibility violation in the intro, active
form, or completed Blueprint. Horizontal-overflow assertions passed at 375,
768, 1024, and 1440 pixels. The successful-contract journey captured no page or
console error and proved applicant HTML-shaped text stayed inert.

The dependency gate upgraded Next.js, `eslint-config-next`, Vitest, Drei, and
patched transitives/overrides. The production build no longer emits the prior
Drei encoding compatibility warning, and Browserslist data was refreshed. The
entire test/build/browser matrix passed after the upgrade.

Cross-system disposable Supabase/Edge/dashboard evidence is recorded in the
dashboard Phase 8 plan and data-plane status. Production rollout remains behind
the separate named-human Phase 9 gate.

The final cross-repository run used the actual website adapter rather than a
hand-authored HTTP client. It returned the expected accepted, duplicate,
collision, bot-failure, retired-secret, and disabled-boundary results. The
concurrent changed-body case produced exactly one accepted application and one
conflict. Database inspection confirmed that Turnstile proof and transport
material were absent, and the receiver logs contained only bounded IDs,
outcomes, reason codes, duration, and event digest. The disposable functions,
verifier, env file, and database were removed after verification.

## Historical live-site integration record

The sections below preserve the earlier live-site funnel history. Counts,
transport names, and question semantics in that historical record are
superseded by the Phase 8 receipt above and
`docs/eden-crm-sender-integration.md`.

## Phase history

| Phase | Commit | Outcome |
| --- | --- | --- |
| Live-site provenance and plan | `95c9b3f` | Identified the stale local base, preserved the first implementation, started from current `origin/main`, and defined the live-site integration gates before porting code. |
| Trusted submission pipeline | `008c2f8` | Added strict shared and server validation, idempotent CRM delivery, bounded retries, bot and rate controls, and post-CRM Resend notification. |
| Live Eden experience | `95e0628`, `6031ddc` | Ported the assessment to the rebuilt site, then added the product introduction, live-site positioning, full browser coverage, responsive hardening, and transition scroll restoration. |
| Email gate plan | `0861022` | Defined the first-screen email decision, its storage boundary, the controlled example model, and the revised contact close before implementation. |
| Email gate | `cd2945f` | Moved validated work email to question one while retaining it through keyboard and Back navigation. |
| Tailored example and contact close | `512cbcc` | Added a controlled answer-derived Eden scenario, preserved the original-answer record, and closed with `build@aygency.ai` plus the discovery-call route. |
| Product correction plan | `e2c7633` | Planned the localhost correction, Eden-specific monthly qualification, and a separate contract-first funnel for custom Aygency systems. |
| Local submission recovery | `e0ab97d` | Allowed explicit loopback origins in development, retained production origin protection, and added an honest unstored Blueprint preview plus contact recovery. |
| Eden-specific qualification | `efccb18` | Replaced agency-system questions and build bands with personal-assistant responsibilities, working context, and monthly managed-service ranges. |
| Value-led qualification plan | `d43cc2c` | Audited every screen for conversation leverage and implementation discovery, then approved removal of public price anchoring. |
| Value-led qualification | `83854dc` | Replaced monthly bands with a typed decision-priority answer and sharpened outcome, consequence, value, and readiness questions. |
| Decisive hero action plan | `688df43` | Replaced the low-value anchor-jump behavior with a planned direct questionnaire action. |
| Decisive hero action | Current phase | Made the primary hero CTA enter question 1 directly while retaining the full Eden explanation and closing entry action. |

## Automated verification

The final local gate runs only against controlled fakes. It creates no CRM record and sends no Resend notification.

| Command | Result | Coverage |
| --- | --- | --- |
| `pnpm test` | 32 tests pass | Schema boundaries, decision-priority values, obsolete price-band rejection, event mapping, stable idempotency, CRM retry classes, production and development origin trust, bot and rate controls, notification semantics, attribution sanitisation, and deterministic Eden example mapping. |
| `pnpm test:e2e` | 10 tests pass | Product positioning, direct hero and closing questionnaire entry, first-screen email validation, Eden-specific one-screen flow, value-led qualification, transition scroll position, keyboard and focus behaviour, branching, retained answers, separate newsletter consent, exact Blueprint answers, tailored example and contact actions, honest unstored preview, immutable automatic and manual retry, accessibility, responsive layouts, live navigation, contact route, and sitemap. |
| `pnpm exec tsc --noEmit` | Passes | Strict TypeScript verification. |
| `pnpm lint` | Passes with zero warnings or errors | Next.js ESLint gate. |
| `pnpm build` | Production build succeeds | Type checking, static generation, and the dynamic `/api/eden/applications` route. |

The repository still reports its pre-existing `@react-three/drei` `sRGBEncoding` compatibility warning and stale Browserslist data. Both are non-fatal and originate outside the Eden change.

## Responsive and accessibility review

Playwright generates product introduction, active question, and successful Blueprint screenshots at every required width. Each layout was reviewed for hierarchy, wrapping, fixed-header behaviour, touch targets, CTA placement, and horizontal overflow:

- 375 by 812: single-column mobile product story, stacked controls, and expanded answer record;
- 768 by 1024: tablet question grid and readable Blueprint details;
- 1024 by 768: compact navigation, persistent assessment logic, and two-column Blueprint cards; and
- 1440 by 1000: full desktop navigation, editorial product layout, and discovery-call treatment.

All four widths report zero horizontal overflow. The page returns to the top after the introduction CTA, on every question transition, and on result-state transitions, so the next screen and its focused heading are immediately available.

Automated Axe scans report no violations in the Eden product introduction, active form, or expanded Blueprint result. The keyboard pass covers number-key selection, Enter and Control+Enter progression, focus transfer to the next heading, Back navigation with retained values, and safe retry. The existing reduced-motion provider remains in effect.

The buying-priority question and recorded Blueprint were additionally reviewed at all four required widths. The selected value is preserved as a controlled decision signal, and the browser payload contains no price-band field.

## Live-site integration evidence

- The rebuilt homepage and its system story remain unchanged.
- Desktop and mobile navigation place `AI Personal Assistant` immediately after `Use Cases`.
- The cyan navigation CTA remains a separate `/contact` action and reads `Contact Us`.
- The footer and sitemap expose `/design-your-eden` without removing a live destination.
- `git diff origin/main -- src/components/home src/app/page.tsx src/app/contact src/app/api/contact` is empty. The live homepage, Cal.com and contact form flow, Resend contact route, and contact validation remain structurally unchanged.
- Eden is presented as the named personal interface to Aygency's specialist-agent system, keeping the live system architecture consistent.

## Submission and data-safety evidence

- Browser traffic terminates at the same-origin `/api/eden/applications` route. CRM endpoint and HMAC signing configuration exist only in server modules and deployment documentation.
- Before final submission, the work email and all other answers exist only in React Hook Form memory in that browser tab. Passing the email gate does not make a network request or create an abandoned-lead record.
- After a completed, consented submission, the validated application is delivered server-to-server to the approved CRM endpoint as `EdenApplicationSubmitted.v1`. The CRM is the durable system of record; Resend is only a post-acceptance notification.
- The CRM event is fixed to `EdenApplicationSubmitted.v1`; the validated answer object is preserved verbatim alongside derived Blueprint guidance.
- Free text is length-bounded, omitted from operational logs and notification summaries, and rendered through React text nodes.
- Inquiry processing is required. Marketing consent is optional, separately recorded, and off by default.
- A failed CRM write fails the application. A failed Resend notification leaves the accepted CRM record successful.
- Automatic and manual retries reuse the same frozen body, event ID, timestamp, and idempotency key.
- The tailored example is constructed only from validated choice values and controlled copy. Applicant free text remains visible in the original-answer record and is never interpolated into generated claims.
- A development browser origin using HTTP loopback is accepted even when Next.js binds internally to `0.0.0.0`. Production keeps exact same-origin or configured HTTPS-origin checks.
- When the local CRM environment is absent, the route returns `crm_not_configured`. The UI describes the Blueprint as a preview and explicitly states that CRM storage is pending.
- Eden now stores `buyingPriority` as `best_result`, `balanced_value`, or `lowest_price`. The obsolete `investmentRange` field and its public price bands fail strict validation.

## Deployment prerequisites

Configure these only in the server deployment environment:

- `EDEN_LEAD_CAPTURE_INGEST_URL`
- `EDEN_LEAD_CAPTURE_SIGNING_SECRET`
- `EDEN_APPLICATION_INGEST_URL`
- `EDEN_APPLICATION_SIGNING_SECRET`
- `EDEN_ALLOWED_ORIGINS` when controlled preview origins are required
- `EDEN_NOTIFICATION_EMAIL` or the existing `CONTACT_EMAIL`
- `EDEN_NOTIFICATION_FROM` with a verified sender

`NEXT_PUBLIC_CAL_URL` is intentionally public and supplies the discovery-call destination. The Blueprint falls back to `/contact` when it is absent or invalid.

A single controlled post-deployment smoke application should confirm the approved CRM endpoint and Resend configuration. Reuse its submission ID for any retry and label the record clearly as a test. Local verification performs no external write.
