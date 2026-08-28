# Eden Diagnostic V2 Plan

**Date:** 2026-08-28

**Status:** Phase 1 verified locally; Phase 2 final live-shaped check pending

## Outcome

The public Eden diagnostic teaches a prospect what Eden can do and captures
only information that improves their example Blueprint or gives Aygency a
useful implementation head start. It is not an onboarding form and does not
ask the prospect to describe an internal buying committee.

The diagnostic continues to create the email-first CRM lead, then submits one
immutable EdenApplicationSubmitted.v1 event. The event name stays stable while
source.form_version advances to eden-application.v2.

## Phase 0 — Freeze the V2 question and storage contract

**Goal:** Record the approved copy and backward-compatible contract change
before implementation.

**Scope:**

- remove the decision-role question;
- keep the desired start window and product-fit/value question;
- replace the two acknowledgement questions with one explicit service-model
  choice;
- remove the confusing discovery-data acknowledgement;
- make organisation context optional;
- display a human-readable Country control while retaining an ISO two-letter
  value internally when supplied;
- keep inquiry consent and marketing consent separate;
- preserve every submitted answer exactly and mark free text as untrusted.

**Deliverables:** This plan and an explicit V2 compatibility note in the
cross-repository contract.

**Dependencies:** The existing email-first lead capture and
EdenApplicationSubmitted.v1 ingress.

**Exit criteria:** git diff checks, lint, tests, and production build pass; the
phase is committed before implementation.

## Phase 1 — Implement the customer-facing diagnostic

**Goal:** Make every screen about the prospect's needs and the Eden they could
receive.

**Scope:** Zod/RHF values, question ordering, service-model radio choice,
optional organisation controls, Country labels/options, progress groupings,
keyboard flow, retained-answer rendering, and deterministic Blueprint copy.

**Deliverables:** A shorter one-question-per-screen diagnostic with no
decision-role or data-boundary prompt and no fabricated hidden values.

**Dependencies:** Phase 0 and the receiving V2 contract.

**Exit criteria:** Unit and Playwright coverage prove the removed questions are
absent, organisation can be skipped, supplied organisation values survive
unchanged, the selected service model is submitted, original free text is
rendered inertly, and 1440/1024/768/375 layouts have no overflow. Full lint and
build pass before commit.

**Verification record (2026-08-28):** Complete. 58/58 unit tests passed with
one opt-in integration test skipped; all 12 Eden Playwright journeys passed,
including Axe checks, inert free-text rendering, exact retry bytes, optional
organisation storage, and 1440/1024/768/375 screenshots with no overflow.
`pnpm lint`, `pnpm build`, and the shared data-plane V2 parser check passed.

## Phase 2 — Verify the live-shaped local journey

**Goal:** Prove the browser still captures email first, submits exact immutable
bytes safely, and produces a useful Eden example.

**Scope:** Local same-origin API flow, retry identity, consent, attribution,
accessibility, result CTA, and screenshots at all required breakpoints.

**Deliverables:** Recorded verification evidence and an updated localhost
preview.

**Dependencies:** Phase 1 and matching data-plane/dashboard contract support.

**Exit criteria:** All repository tests, lint, build, and breakpoint checks pass
with no browser-to-Supabase request and no console/page error.

## Non-goals

- No credentials, provider tokens, operational secrets, or private message
  content are requested.
- Funnel answers do not activate capabilities or grant action authority.
- Prospect free text cannot create code, commands, schedules, or permissions.
