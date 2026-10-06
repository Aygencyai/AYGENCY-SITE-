# Eden website launch preflight, 6 Oct 2026

Candidate base: origin/main 5715209. Isolated branch feat/eden-launch-20261006,
worktree eden-launch-site-worktree. This preserves the current main website,
including Louis's changes. No public deployment or production setting changed.
Canonical overall launch order remains in the records worktree's
eden-launch-readiness-plan-20261005.md.

## Phase 0: establish the current-main baseline

- Goal: qualify the correct website source before preparing publication.
- Scope: clean main checkout, locked dependencies, existing unit/API tests, lint, types, production build and advisory inventory.
- Deliverables: source identity and baseline evidence below.
- Dependencies: project instructions and current origin/main.
- Exit criteria: source is clean and all code checks pass; advisory applicability is explicitly reviewed before release.
- Result: 139 tests pass, one opt-in CRM integration test skipped; lint, TypeScript and production build pass with both Eden feature flags enabled locally. No service credentials were supplied. Baseline audit reports 16 advisories, including two critical development-tool advisories and a high source-map-js advisory in the production dependency graph. Audit classification is not a claim of remote exploitability.

## Phase 1: resolve dependency release findings

- Goal: remove available affected dependencies without changing customer behavior.
- Scope: package.json and pnpm-lock.yaml; Vitest upgrade removing its affected worker dependency; patched brace-expansion and source-map-js resolutions; document any advisory lacking a published patch and its reachable input boundary.
- Deliverables: locked dependency update and advisory assessment.
- Dependencies: Phase 0 baseline and publisher advisory/package metadata.
- Exit criteria: tests, lint, TypeScript and production build pass; no unresolved applicable high or critical finding. Run audit again after the update. No blind major override of a dependency API.

## Phase 2: qualify customer pages and prepare settings

- Goal: prove the candidate UI and assemble the precise publication inputs.
- Scope: existing mocked onboarding/connection browser tests at 1440, 1024, 768 and 375 pixels; required server-side variables below; local Vercel project binding to aygency-site only.
- Deliverables: browser evidence and a private settings candidate, with no secrets in this document, logs or source.
- Dependencies: Phase 1; live account journeys require owner sign-in and completed email configuration.
- Exit criteria: isolated tests pass; actual owner journey remains distinct from mocks; each production variable has a verified owning service and purpose. Existing unrelated production variables are preserved.

Required website settings: EDEN_WEB_ONBOARDING_ENABLED, EDEN_WEB_SERVICE_URL,
EDEN_WEB_SERVICE_KEY, EDEN_CUSTOMER_CONNECTIONS_ENABLED,
EDEN_CONNECTION_SERVICE_URL, EDEN_CONNECTION_WEBSITE_KEY,
EDEN_ACCOUNT_SERVICE_URL. Service URLs must be HTTPS origins, without path,
query, fragment or embedded credentials. Backend web keys must be at least 32
characters and stay server-side. Never enable EDEN_WEB_ALLOW_LOCAL in production.

Email settings: RESEND_API_KEY, EDEN_NOTIFICATION_EMAIL,
EDEN_NOTIFICATION_FROM and CONTACT_EMAIL. Supabase Auth SMTP belongs on its
owning backend, not automatically in this website environment.

## Phase 3: approved publication and outside checks

- Goal: make the verified customer journey publicly reachable on aygency.ai.
- Scope: owner-approved production settings and CLI deployment of this reviewed candidate; control-service customer-link base; cookie-less requests, Telegram previews and first-customer rehearsal.
- Deliverables: public deployment identity, external checks and rollback reference.
- Dependencies: explicit owner website go-ahead, backend qualification, email setup, pool stock, privacy notice and owner sign-ins as required by the canonical launch plan.
- Exit criteria: every customer link works outside an authenticated Vercel session, and the owner completes the full fresh-customer journey. A green local build is not launch acceptance.

## Advisory sources

- [Tinypool worker option advisory](https://github.com/advisories/GHSA-85c8-ppgw-ccpr): development test dependency; a prior prototype-pollution primitive and affected worker options are required. Upgrade the owning test runner rather than force an incompatible pool version.
- [source-map-js advisory](https://github.com/advisories/GHSA-68fv-2mgg-jv7q): patched in 1.2.2; inspect the resolved production/build graph.
- [brace-expansion advisory](https://github.com/advisories/GHSA-qhr7-859c-m2p7): use patched releases within the existing version lines.
- [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): baseline audit reports no patched release. Assess whether untrusted patterns reach it; do not claim a clean audit by suppressing the finding.
