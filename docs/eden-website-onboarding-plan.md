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
