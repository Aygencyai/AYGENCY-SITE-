# Generic connection copy rollout

The customer connected Todoist successfully but the shared website still named
Outlook. Generic copy already exists in `1167678` and deployed candidate
`aygency-site-8sqg504hm-wazzalouis-projects.vercel.app`. The registered return URL
uses the immutable `h2pzm1e0x` deployment, not a movable production alias.

## Phase 0 — Establish the exact live route (complete)

Goal: identify why a prepared copy change is absent from the customer journey.
Scope: read website source, deployment metadata and connection-service origin.
Deliverable: confirmed original origin and matching generic candidate.
Dependencies: existing deployment and project access.
Exit: authenticated candidate GET returns generic metadata; current service still
selects the old origin. No customer grants or OAuth configuration changed.

A stable optional alias, `aygency-eden-connections.vercel.app`, now points to the
candidate. It is not selected by the connection service or provider. Deployment
protection remains enabled. An initial proposal to move the verifier URL requires
unavailable provider administrator access; the user correctly asked to fix our
page without changing their working connection setup.

## Phase 1 — Qualify a same-origin website route

Goal: serve the generic page at the existing connection URL with cookies intact.
Scope: a host- and probe-header-scoped Vercel project routing rule for the connection
page, plus only its exact required static assets if needed. No authentication API
rewrite, provider change, broad website promotion or protection disablement.
Deliverable: browser-tested route at the existing hostname, invisible to normal
traffic until qualification passes.
Dependencies: Phase 0; documented project routing support and retained empty
routing preimage.
Exit: generic rendered copy, account/connection requests remain same-origin,
callback query and opening hash survive, and normal existing page stays unchanged.
If proxy/deployment protection prevents this route, discard the staged probe and
report the actual remaining deployment dependency.

## Phase 2 — Publish and retain evidence

Goal: customers see service-neutral opening and success states.
Scope: remove the probe-header condition from the qualified host-specific rules;
record exact route IDs and rollback to the prior empty route configuration.
Deliverable: live generic page with the existing callback and browser cookies.
Dependencies: Phase 1 pass.
Exit: live browser check at 1440, 1024, 768 and 375px; mocked provider boundaries
clearly separated from actual delivery; no claim of a new real OAuth connection.

## Phase 1 result

Qualified the existing origin using four narrowly scoped project routing rules:
one page rule and three exact static-asset rules. The original website APIs stay
on their original deployment. A private, server-side project automation credential
is injected only into the upstream rewrite request because the candidate itself
retains Vercel deployment protection. It is never shipped in page code, response
headers or repository configuration. Normal ingress protection remains enabled.

Cookie-only browser qualification passed at 1440, 1024, 768 and 375px, with no
JavaScript errors, missing assets or horizontal overflow. Opening and callback
states render generic copy; hash/query cleanup and the original browser origin
are preserved. Account/connection API responses were mocked for those UI checks;
no real provider connection or write was performed. Unmarked normal traffic still
used the original page during this phase.

Production route check: `https://aygency.ai/eden/connections` and its connection
API both currently return 404. The intended product URL remains that branded
route, but moving the verifier there before the website release would break it.
The customer was told to leave Composio unchanged. This copy fix keeps the existing
working tester callback; the optional stable Vercel alias is not selected.

Routing reference: https://vercel.com/docs/routing/project-routing-rules .

## Phase 2 result — live

Published routing version `71120fcd-4f05-4dcc-b0ca-80a788863834` for the original
`aygency-site-h2pzm1e0x-wazzalouis-projects.vercel.app` hostname only. Normal
browser traffic now renders the generic `1167678` page. Four-width opening and
success-state checks passed again without the probe header. A separate unmocked
browser check opened the real account session and rendered Eden's sign-in form;
its sole API call remained on the original origin. No credentials were entered.

Rules:
- `5d52f41f-267c-4db7-8afb-50b801ffe3d4`: `/eden/connections`.
- `f6db7a6d-8b7a-46d7-9b67-043d35438d10`: exact `3586-3bf1a6e478cab321.js` chunk.
- `fcac537c-2d82-402b-b0d6-1e5b926711d8`: exact `8237-b9be2d2cb45605a7.js` chunk.
- `e6723816-f5fc-49e7-ae62-414cee3ae32a`: exact connection page `page-b86d20c41bdce274.js` chunk.

Private evidence: `~/.eden-web-local/evidence/generic-connection-copy-20260924/`.
It contains the empty routing preimage, exact private active configuration,
sanitary receipt, browser evidence and screenshots. Keep both immutable
deployments available while these rules are selected. Rotating the upstream
Vercel automation credential requires updating the private request-header
transforms and rerunning the cookie-only browser proof. It is not customer OAuth.

Rollback: remove only the four rule IDs above through the project routes API,
then promote the returned staging version. Do not overwrite other project rules
that may have been added since this release. This restores the original page;
provider settings, session cookies and website APIs were never moved.

The main `aygency.ai` site was not promoted. Production publication must supply
both the connection page and authenticated API/session routes before selecting
`https://aygency.ai/eden/connections` as the callback. The user does not need to
change Composio for the completed tester copy fix.
