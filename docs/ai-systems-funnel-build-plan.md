# Aygency AI Systems Funnel: Contract-First Build Plan

Date: 24 August 2026

Status: planned, awaiting a distinct approved CRM event contract before implementation

## Product decision

Aygency needs two clearly separated qualification paths:

1. `AI Personal Assistant` leads to Eden, a managed personal-assistant service with monthly commercial bands.
2. `Design your AI system` qualifies larger workflow, department, and multi-agent system engagements with build scope and implementation investment.

The systems funnel should become the natural conversion path from the homepage's `Built once, compound forever` proposition, service pages, and relevant use cases. Eden should remain a distinct navigation product rather than carrying agency-wide discovery questions.

## Proposed route and experience

- Route: `/design-your-system`
- Entry points: homepage system narrative, services overview, relevant service details, and the closing site CTA.
- One question per screen with the existing Aygency visual system, progress, keyboard navigation, Back retention, mobile-first layouts, and a five to seven minute target.
- Email first, followed by business priority, workflow, volume, stakeholders, systems, data readiness, authority and risk, success evidence, timing, implementation range, contact identity, and separate inquiry and marketing consent.
- Result: a directional `AI System Brief`, one concrete example of the proposed system at work, exact original answers, `build@aygency.ai`, and discovery-call actions.

## Storage boundary

The systems funnel must not submit `EdenApplicationSubmitted.v1`. Eden and custom-system enquiries represent different products, commercial models, answer schemas, and reporting cohorts.

Before implementation, approve:

- an event name and version, proposed as `AygencySystemApplicationSubmitted.v1`;
- the exact validated answer schema;
- the CRM ingest URL and write-only server credential policy;
- idempotency and duplicate semantics;
- consent notice versions, retention, attribution, bot controls, and rate limits; and
- CRM ownership plus Resend notification behavior.

The browser will call only a same-origin Aygency API. The server will validate and forward the approved event. CRM will remain the system of record, and Resend will remain notification only.

## Proposed commercial question

This funnel may retain project implementation bands because it represents custom systems work. Final ranges should follow Aygency's offer and delivery economics rather than Eden's monthly service bands.

## Implementation phases after contract approval

1. Finalise and commit the event/schema plan.
2. Build and test the server-only submission pipeline.
3. Build the questionnaire and result using shared funnel primitives without coupling its answers to Eden.
4. Add deliberate homepage/service entry points and verify existing CTA behavior.
5. Run contract, browser, accessibility, responsive, lint, type, and production-build verification before each phase commit.
