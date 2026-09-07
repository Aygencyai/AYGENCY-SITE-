# Eden Builder customer connection page

Canonical cross-repository plan: `../aos-builder-onboarding-worktree/docs/eden-builder-onboarding-plan.md`.
Site base: origin/main `84a5679`; branch `feat/eden-builder-account-20260907`.
Hosting assumption: aygency.ai, configurable account backend. Existing site palette, typography and motion apply.

## Phase 0 — Freeze the account contract

Goal: Connect this page to the existing verified account service.
Scope: This plan; inspect website instructions and Eden account HTTP contracts.
Deliverables: Explicit boundaries and implementation sequence.
Dependencies: Eden Phase 6 account API.
Exit criteria: Plan committed; no live mutations.

## Phase 1 — Customer page and private forwarding

Goal: Let a customer open the setup link, verify their invited email, and enter the permanent private Builder chat.
Scope: `/eden/connect`, bounded same-origin API proxy for open/verify, strict response allowlist, fragment-only bootstrap/auth credentials, retry identities, existing design tokens and responsive layout.
Deliverables: Customer page plus tests for successful/crossed/expired/retry states. No admin credentials in this repository or browser.
Dependencies: Phase 0; server-only HTTPS account-service URL.
Exit criteria: Unit tests, strict TypeScript, lint/build, four viewport journeys, token URL cleanup and failed-response tests pass.

## Phase 2 — Release qualification

Goal: Publish only with the complete permanent-runtime journey.
Scope: Document backend configuration, email redirect, account link delivery, webhook registration and gateway takeover dependencies.
Deliverables: Matched release instructions and retained feature gate.
Dependencies: Phase 1 plus Eden production transfer/activation workers and staging infrastructure.
Exit criteria: Actual account-to-private-chat-to-interview staging journey; no synthetic readiness or implicit live invite.

## Connection contract

The account URL uses `#connection=<opaque ref>&state=<one-time token>`. Strip the fragment immediately on mount. Retain only the non-authorizing connection reference in session storage; derive stable request identities from the exact connection/action/token digest and never persist access/refresh tokens. Account opening is one-time with exact retry. The invitation returns a short-lived access token in the fragment; post it to the server-side verifier and discard it after success. The API verifies the exact invited provider user remotely before it issues a Telegram link. No name/email field can reveal prior funnel answers.

The two server routes forward only `connection_ref`, `request_id`, and the appropriate opaque token. Both validate response shape and redact upstream error bodies. Request bodies and auth fragments must not be logged. The account service remains responsible for request expiry, private chat binding and replay guards.

## Verification and release hold (2026-09-07)

Phase 1 is implemented locally. The same-origin proxy validates origins, bounds request/response bodies, permits only the open/verify operations and strips unrelated upstream fields. The page clears auth fragments and retries exact requests without browser token persistence. Existing design tokens and global motion preferences apply.

- `pnpm test`: 67 passed, one pre-existing skipped test.
- `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`: pass.
- Full `pnpm test:e2e`: 16 passed, including all four connection-page viewport journeys and URL/storage privacy checks. Four connection layouts inspected. Existing Drei/Three `sRGBEncoding` warnings also occur on the unchanged homepage imports.
- Required pre-release audit: 10 high, 15 moderate, three low findings in the existing dependency graph. High findings affect Next.js and Browserslist. The installed Next package is 14.2.35 despite CLAUDE describing 15.5.21; origin/main includes an intentional homepage React-runtime rollback. Reconcile the graph and homepage compatibility before releasing this account surface. No dependency upgrade was attempted here.

Set `EDEN_ACCOUNT_SERVICE_URL` to the operated HTTPS account-service origin; it is server-only. Set the managed worker's `EDEN_CUSTOMER_ACCOUNT_BASE_URL` to `https://aygency.ai/eden/connect` and allowlist that redirect path in the managed identity project. Open the personal connection link before the invitation callback; the server retains that opening across browser tabs. Invitation redirects carry only the opaque connection reference in the query; access/refresh tokens arrive in the fragment and are immediately stripped. A new browser still requires the original connection link to have been opened.

Phase 2 is held. The page is not deployed and no invitation was sent. The remaining product dependencies are real private bootstrap/key/context delivery, Telegram webhook-to-gateway takeover and genuine activation readiness, plus the dependency release gate above. See the canonical cross-repository plan rather than treating browser fixtures as staging proof.
