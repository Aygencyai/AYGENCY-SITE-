# Website conversational onboarding

Canonical phased plan: `../../eden-web-onboarding-worktree/docs/eden-website-onboarding-plan.md`.
Local-only feature branch. Phase 2 replaces the questionnaire when
`EDEN_WEB_ONBOARDING_ENABLED=true`; the current funnel remains available with the
flag off until rollout is authorized.

The browser uses only `/api/eden/conversation`. Its opaque session cookie is
HttpOnly, SameSite=Lax, path `/`, with Secure and a `__Host-` prefix on HTTPS.
No conversation, email OTP, credential or owner identifier enters browser storage.
The website server holds a narrow Builder ingress key; Supabase and subscription
credentials remain in the operated service. Never configure them in Vercel.

Names-only configuration: `eden-web.env.example`. Local service on 4318, website
on 3118, isolated Supabase on 55421, mail capture on 55424. Use the separate
`playwright.onboarding.config.ts` for actual service-backed website tests.

Verification: `pnpm test`, `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build`,
`pnpm exec playwright test --config playwright.onboarding.config.ts`.
Existing funnel browser tests run with `EDEN_WEB_ONBOARDING_ENABLED=false`.

Phase 2 verification: 77 unit tests pass (one existing integration skip), strict
TypeScript and lint pass. Five actual service-backed browser journeys pass,
including a real subscription response and reload, and all four screen widths
were inspected after animations settled. All 20 existing browser journeys pass
with the website flag off. The localhost Next server normalizes its internal URL;
the new origin boundary correctly compares the browser Origin to the actual Host,
with a regression test, while continuing to reject cross-origin requests.

Full email-resume, correction, confirmation and founder-to-runtime qualification
continue in Phase 4. No rollout has been performed.

## Customer Outlook browser increment (22 September)

Canonical plan: `../../eden-web-onboarding-worktree/docs/eden-personal-acceptance-plan.md`,
Phase 2.2b. Goal: use the existing password account before Outlook consent and
authenticate it again on return. Scope: `/eden/connections`, its private proxy,
server-only proof cookie and return UI. Provider credentials remain in operated
custody. The proof/session URI never enters browser storage; the callback query
is removed before account or verification requests. Dependencies: the managed
website owner lookup and control-plane Outlook custody. Exit: proxy isolation,
callback/retry and four-width browser checks, TypeScript/lint/build pass.

`EDEN_CUSTOMER_CONNECTIONS_ENABLED` defaults false. The page needs a persistent
Composio verifier pointing to `https://<website>/eden/connections` and the private
service URL/key in `eden-web.env.example`. These are deployment dependencies,
not configuration performed by this source change. Tests use deterministic
provider/identity boundaries and do not qualify a live Eden or a source-backed job.
Run UI checks with `pnpm exec playwright test --config playwright.connections.config.ts`.

Local result: 125 unit checks pass (one opt-in skip), ten browser cases pass at
1440/1024/768/375; strict TypeScript, lint and production build pass. Visuals
inspected after entrance animation completion. Run Next browser/dev checks and
build/type checks sequentially: they share generated `.next` output. No deployment.
