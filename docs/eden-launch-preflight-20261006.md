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
- Scope: package.json, pnpm-lock.yaml and one notification test helper type annotation required by Vitest 4; Vitest upgrade removing its affected worker dependency; patched brace-expansion and source-map-js resolutions; document any advisory lacking a published patch and its reachable input boundary.
- Deliverables: locked dependency update and advisory assessment.
- Dependencies: Phase 0 baseline and publisher advisory/package metadata.
- Exit criteria: tests, lint, TypeScript and production build pass; no unresolved applicable high or critical finding. Run audit again after the update. No blind major override of a dependency API.

Phase 1 result: Vitest 4.1.11, patched brace-expansion versions and source-map-js
1.2.2 are locked. 139 tests pass, one opt-in integration test is skipped; lint,
TypeScript and the 38-page production build pass with both Eden flags enabled.
The test helper now accepts the actual notification callback signature instead
of Vitest's widened generic mock type; customer behavior is unchanged.

Audit after repair: zero critical, one high, three moderate and one low. The
remaining high is unpatched braces 3.0.3, reached by development-only Tailwind
and ESLint globbing. Their patterns are repository configuration, not customer
request input. No braces path appears in any production NFT dependency trace.
This finding remains recorded and requires reassessment if build patterns accept
untrusted input. Production audit has zero high/critical and two moderate
findings (uuid buffer bounds and fflate malformed ZIP64 parsing). This is a
bounded launch assessment, not a claim that the entire audit is clean.

## Phase 2: qualify customer pages and prepare settings

- Goal: prove the candidate UI and assemble the precise publication inputs.
- Scope: existing mocked onboarding/connection browser tests at 1440, 1024, 768 and 375 pixels; required server-side variables below; local Vercel project binding to aygency-site only.
- Deliverables: browser evidence and a private settings candidate, with no secrets in this document, logs or source.
- Dependencies: Phase 1; live account journeys require owner sign-in and completed email configuration.
- Exit criteria: isolated tests pass; actual owner journey remains distinct from mocks; each production variable has a verified owning service and purpose. Existing unrelated production variables are preserved.

Browser qualification: 21 existing mocked tests pass on an isolated localhost
server, covering 1440, 1024, 768 and 375 pixel widths, pending/recovered replies,
sign-out races, expired sessions, connection handoff/return, wrong-account
recovery and invalid callbacks. Original test source was copied to a temporary
runner only to give screenshots a dated private destination; no existing
historical screenshot was overwritten. Mobile connection screenshot inspected.
The four unmocked cookie tests and real two-account Ava journey remain pending
live service/email configuration. These passes do not establish real sign-in,
provider consent or useful Ava replies.

Current-flow website settings: EDEN_WEB_ONBOARDING_ENABLED, EDEN_WEB_SERVICE_URL,
EDEN_WEB_SERVICE_KEY, EDEN_CUSTOMER_CONNECTIONS_ENABLED,
EDEN_CONNECTION_SERVICE_URL and EDEN_CONNECTION_WEBSITE_KEY.
EDEN_ACCOUNT_SERVICE_URL belongs only to the legacy /eden/connect route. Service URLs must be HTTPS origins, without path,
query, fragment or embedded credentials. Backend web keys must be at least 32
characters and stay server-side. Never enable EDEN_WEB_ALLOW_LOCAL in production.

Private production candidate prepared at
~/.eden-web-local/launch-production-candidate-20261006.json (mode 0600), with
six existing Ava/connection settings only. Both ingress-key hashes match the
currently operated services, and both HTTPS health endpoints return 200. The
checkout is locally bound to the existing aygency-site Vercel project. No setting
has been applied. Read-only control inventory confirms account and invitation are STOPPED and
explicitly disabled, with no account.json. The historical account path is not a
currently configured service. Current app consent uses /eden/connections; the
website legacy /eden/connect route still expects an account origin. Keep that
route unqualified and outside the current launch path. Product tests explicitly
require the direct Builder bundle to work without legacy account/webhook/email
services; current connection link generators target /eden/connections, and the
Ava UI has no account-route reference. The fresh-customer rehearsal must confirm
that no old link is issued. Do not reactivate legacy services or substitute the
connection origin just to fill this variable.
Phase 2 remains partial until those inputs and the real owner journey qualify.

Email settings: RESEND_API_KEY, EDEN_NOTIFICATION_EMAIL,
EDEN_NOTIFICATION_FROM and CONTACT_EMAIL. Supabase Auth SMTP belongs on its
owning backend, not automatically in this website environment.

## Phase 3: approved publication and outside checks

- Goal: make the verified customer journey publicly reachable on aygency.ai.
- Scope: owner-approved production settings and CLI deployment of this reviewed candidate; control-service customer-link base; cookie-less requests, Telegram previews and first-customer rehearsal.
- Deliverables: public deployment identity, external checks and rollback reference.
- Dependencies: explicit owner website go-ahead, backend qualification, email setup, pool stock, privacy notice and owner sign-ins as required by the canonical launch plan.
- Exit criteria: every customer link works outside an authenticated Vercel session, and the owner completes the full fresh-customer journey. A green local build is not launch acceptance.

Owner approval update, 6 Oct: the owner requested getting Eden live, with a newly
created template Eden inheriting the tested runtime and default capabilities.
Publication approval is now recorded; do not ask for it again. Complete the
remaining qualification, email, pool-stock and fresh-customer requirements before
publishing. Browser control remains paused at the owner's separate request.

### Owner scope clarification: launch intake now

The owner clarified that a third live test Eden is not required before publishing
Ava and collecting onboarding leads in the Eden CRM. Proceed with the public
conversation/lead-capture launch. A dedicated Telegram bot and DeepSeek key are
supplied during customer fulfilment; empty provisioning stock is not an intake
blocker. Existing customer confirmations promise team review/contact, not an
immediate active bot. Browser control remains paused.

Current sign-in is password-based with scoped account creation, so the unfinished
Resend/SMTP work does not block this entry path. Founder email alerts are optional
and currently skipped; durable confirmation/CRM state remains the operational
record. Do not describe email notifications, a new live customer, or unresolved
Tester 2 behaviours as qualified by this narrower launch.

Release action: preserve current main 5715209, merge this verified candidate via
a feature-branch PR, add only the six privately staged Ava/connection production
settings, deploy the merged main revision with Vercel CLI, then check public pages
and unauthenticated entry responses. Owner account sign-in and a real conversation
remain an owner browser check; never type credentials or work around an approval
rejection on a server-side model turn.

## Advisory sources

- [Tinypool worker option advisory](https://github.com/advisories/GHSA-85c8-ppgw-ccpr): development test dependency; a prior prototype-pollution primitive and affected worker options are required. Upgrade the owning test runner rather than force an incompatible pool version.
- [source-map-js advisory](https://github.com/advisories/GHSA-68fv-2mgg-jv7q): patched in 1.2.2; inspect the resolved production/build graph.
- [brace-expansion advisory](https://github.com/advisories/GHSA-qhr7-859c-m2p7): use patched releases within the existing version lines.
- [braces advisory](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm): baseline audit reports no patched release. Assess whether untrusted patterns reach it; do not claim a clean audit by suppressing the finding.
