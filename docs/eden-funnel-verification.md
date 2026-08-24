# Eden AI Personal Assistant: Verification Record

Date: 24 August 2026

Branch: `feat/eden-live-site`

Isolated worktree: `/Users/elaygency/aygency/projects/aygency-site-eden-live`

Live-site source: `origin/main@0b2ca36`

## Phase history

| Phase | Commit | Outcome |
| --- | --- | --- |
| Live-site provenance and plan | `95c9b3f` | Identified the stale local base, preserved the first implementation, started from current `origin/main`, and defined the live-site integration gates before porting code. |
| Trusted submission pipeline | `008c2f8` | Added strict shared and server validation, idempotent CRM delivery, bounded retries, bot and rate controls, and post-CRM Resend notification. |
| Live Eden experience | `95e0628`, `6031ddc` | Ported the assessment to the rebuilt site, then added the product introduction, live-site positioning, full browser coverage, responsive hardening, and transition scroll restoration. |
| Email gate plan | `0861022` | Defined the first-screen email decision, its storage boundary, the controlled example model, and the revised contact close before implementation. |
| Email gate | `cd2945f` | Moved validated work email to question one while retaining it through keyboard and Back navigation. |
| Tailored example and contact close | Current phase | Added a controlled answer-derived Eden scenario, preserved the original-answer record, and closed with `build@aygency.ai` plus the discovery-call route. |

## Automated verification

The final local gate runs only against controlled fakes. It creates no CRM record and sends no Resend notification.

| Command | Result | Coverage |
| --- | --- | --- |
| `pnpm test` | 28 tests pass | Schema boundaries, event mapping, stable idempotency, CRM retry classes, route trust, bot and rate controls, notification semantics, attribution sanitisation, and deterministic Eden example mapping. |
| `pnpm test:e2e` | 9 tests pass | Product positioning, first-screen email validation, one-screen flow, transition scroll position, keyboard and focus behaviour, branching, retained answers, separate consent, exact Blueprint answers, tailored example and contact actions, immutable automatic and manual retry, accessibility, responsive layouts, live navigation, contact route, and sitemap. |
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

## Live-site integration evidence

- The rebuilt homepage and its system story remain unchanged.
- Desktop and mobile navigation place `AI Personal Assistant` immediately after `Use Cases`.
- The cyan navigation CTA remains a separate `/contact` action and reads `Contact Us`.
- The footer and sitemap expose `/design-your-eden` without removing a live destination.
- `git diff origin/main -- src/components/home src/app/page.tsx src/app/contact src/app/api/contact` is empty. The live homepage, Cal.com and contact form flow, Resend contact route, and contact validation remain structurally unchanged.
- Eden is presented as the named personal interface to Aygency's specialist-agent system, keeping the live system architecture consistent.

## Submission and data-safety evidence

- Browser traffic terminates at the same-origin `/api/eden/applications` route. CRM endpoint and bearer-token configuration exist only in server modules and deployment documentation.
- Before final submission, the work email and all other answers exist only in React Hook Form memory in that browser tab. Passing the email gate does not make a network request or create an abandoned-lead record.
- After a completed, consented submission, the validated application is delivered server-to-server to the approved CRM endpoint as `EdenApplicationSubmitted.v1`. The CRM is the durable system of record; Resend is only a post-acceptance notification.
- The CRM event is fixed to `EdenApplicationSubmitted.v1`; the validated answer object is preserved verbatim alongside derived Blueprint guidance.
- Free text is length-bounded, omitted from operational logs and notification summaries, and rendered through React text nodes.
- Inquiry processing is required. Marketing consent is optional, separately recorded, and off by default.
- A failed CRM write fails the application. A failed Resend notification leaves the accepted CRM record successful.
- Automatic and manual retries reuse the same frozen body, event ID, timestamp, and idempotency key.
- The tailored example is constructed only from validated choice values and controlled copy. Applicant free text remains visible in the original-answer record and is never interpolated into generated claims.

## Deployment prerequisites

Configure these only in the server deployment environment:

- `EDEN_CRM_ENDPOINT_URL`
- `EDEN_CRM_API_TOKEN`
- `EDEN_ALLOWED_ORIGINS` when controlled preview origins are required
- `EDEN_NOTIFICATION_EMAIL` or the existing `CONTACT_EMAIL`
- `EDEN_NOTIFICATION_FROM` with a verified sender

`NEXT_PUBLIC_CAL_URL` is intentionally public and supplies the discovery-call destination. The Blueprint falls back to `/contact` when it is absent or invalid.

A single controlled post-deployment smoke application should confirm the approved CRM endpoint and Resend configuration. Reuse its submission ID for any retry and label the record clearly as a test. Local verification performs no external write.
