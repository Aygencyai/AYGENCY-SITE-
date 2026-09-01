# Eden Live-Site Integration Plan

## Source correction

The first Eden implementation was built from local commit `660c336`. That checkout had not fetched the subsequent site rebuild. The deployed website and current GitHub default branch are now at `0b2ca36`, which includes the Aygency System, specialist-agent positioning, `/system`, `/brain`, `/insights`, `/about`, and `/trust`.

The completed first implementation remains preserved on `feat/design-your-eden` in `/Users/elaygency/aygency/projects/aygency-site-eden-funnel`. This integration starts again from `origin/main` in a clean worktree at `/Users/elaygency/aygency/projects/aygency-site-eden-live` on `feat/eden-live-site`.

## Outcome

Add Eden to the website that is actually deployed. Eden will be presented as the client’s own AI personal assistant: one dedicated specialist who handles agreed work, keeps the operational thread moving, and brings the client the decisions that need human judgment.

The existing Aygency homepage, system story, services, use cases, insights, about, trust, contact flow, and live visual language must remain intact. The new `/design-your-eden` product page will introduce Eden before offering a focused one-question assessment and an Eden Blueprint.

## Product and navigation decisions

- Add `AI Personal Assistant` immediately after `Use Cases` in desktop and mobile navigation.
- Keep the cyan navigation CTA linked to `/contact` and label it `Contact Us`.
- Add `AI Personal Assistant` to the footer without removing any current live-site destination.
- Do not rewrite the rebuilt homepage to match the obsolete local branch.
- Keep `/design-your-eden` as the route for compatibility, while all visible naming leads with `Eden` or `AI Personal Assistant`.
- Introduce Eden with positive, plain-language copy. Visible copy and metadata will contain no em dashes and will not define the offer through negative comparisons.
- Explain Eden as one dedicated AI personal assistant: she is the customer’s specialist and handles her agreed responsibilities herself rather than coordinating other agents.

## Trust boundary

The browser posts only to the same-origin `/api/eden/applications` route. That route owns strict validation, request-size and origin checks, timing and honeypot controls, application rate limiting, event construction, idempotent delivery, and safe bounded retries to the approved `EdenApplicationSubmitted.v1` endpoint.

Production browser verification uses Vercel BotID Basic on both `/api/eden/leads` and `/api/eden/applications`. The invisible browser challenge is checked by the same-origin Next.js route before any CRM delivery. The CRM receiver accepts the `vercel-botid` proof only from the HMAC-authenticated website sender, while retaining its durable database rate controls. This avoids a browser-to-CRM connection and does not require a public CAPTCHA credential.

CRM and Resend credentials remain server-only. The CRM is the system of record. Resend runs only after CRM acceptance as a best-effort notification. Original validated answers remain in the CRM event and free text is rendered only as escaped React text.

## Phase 1: provenance and plan

Deliver this document before porting implementation code.

Exit gate:

- verify the worktree starts from `origin/main` at `0b2ca36`;
- install with the existing pnpm lockfile;
- run `pnpm lint` and `pnpm build`; and
- commit the plan separately.

## Phase 2: trusted submission pipeline

Port the shared Zod contract, CRM event adapter, rate limiter, notification adapter, API route, environment documentation, and focused tests. Adapt dependencies to the live branch rather than downgrading its existing packages.

Exit gate:

- all schema, CRM retry, idempotency, rate, notification, and route tests pass against fakes;
- no browser module can import a CRM credential or endpoint;
- the current `/api/contact` implementation remains unchanged;
- `pnpm lint` and `pnpm build` pass; and
- commit the server phase separately.

## Phase 3: Eden product page and assessment

Port the product introduction, one-question assessment, progress and focus behavior, attribution capture, frozen retry snapshot, separate consents, Blueprint, and discovery CTA. Adapt navigation, footer, and sitemap directly against the live components.

The product story will cover:

- what Eden is;
- the recurring coordination she can own;
- how she works through the specialist Aygency system;
- how the client controls authority and approvals; and
- the bottom-page action, `See what Eden could do for you`.

The assessment will encourage useful workflow detail without displaying duration, question-count, credential, or sensitive-data boilerplate on the introduction.

Exit gate:

- browser tests cover product positioning, navigation labels, branching, keyboard and focus behavior, answer retention, separate consent, stable retries, Blueprint output, and live-site route regression;
- Axe reports no violations in the introduction, assessment, or expanded Blueprint;
- 375, 768, 1024, and 1440 pixel layouts have no horizontal overflow and are visually reviewed;
- current homepage and contact routes remain structurally intact;
- `pnpm lint` and `pnpm build` pass; and
- commit the interface phase separately.

## Phase 4: corrected localhost handoff

Run the complete unit and browser suites once more, verify the production route table, and start the corrected worktree locally. Stop the obsolete local server before opening the new page so `localhost` unambiguously shows the live-site architecture plus Eden.

No live CRM or Resend request will be made during local verification.

## Phase 5: production release

Replace the credential-dependent Turnstile widget with Vercel BotID Basic, preserving the honeypot, timing, same-origin, HMAC, idempotency, and durable CRM rate controls. Rotate separate lead and application signing secrets into the receiver and Vercel, deploy both receiver functions, then enable intake only after their disabled-boundary probes pass.

Exit gate:

- BotID blocks classified automation before CRM delivery and remains invisible to a human visitor;
- the receiver accepts only the configured bot-proof provider from an authenticated sender;
- the initial email capture and final application both return durable CRM receipts;
- the complete unit, lint, browser, breakpoint, and production build suites pass;
- the default branch advances only by fast-forward; and
- the public route and both production form stages are smoke-tested after deployment.
