---
as-of: 2026-10-06T13:00:00Z
session: AI Growth Audit, link previews, Eden merge after a deploy overwrite
---

# STATE: aygency-site

## Live right now
- aygency.ai = `main` @ PR #8 (AI Growth Audit at /audit, branded link previews, Erik's Eden code).
- `design/migration-v2` fast-forwarded to `main` on 2026-10-06; keep them level until Vercel builds from
  one GitHub branch.

## In flight
- Nothing on this repo.

## Blocked, and on whom
- **Eden's Ava onboarding is off on the live site.** Its code is merged, but its settings
  (`EDEN_WEB_*`, `EDEN_CONNECTION_*`, `EDEN_ACCOUNT_SERVICE_URL`, `EDEN_CUSTOMER_CONNECTIONS_ENABLED`,
  ...) are not saved in Vercel. On Erik. Re-check: are they in `vercel env ls` production?
- **The contact form fails on every submission** (500): no `RESEND_API_KEY` / `CONTACT_EMAIL` in Vercel,
  and aygency.ai is not verified in Resend (no DNS records in Cloudflare). On Louis (Resend + Cloudflare).
  Re-check: does an empty POST to /api/contact return 400, not 500?
- Audit completion emails are skipped for the same reason; answers still save to Supabase.

## Open decisions
- Connect Vercel to GitHub so production builds one branch; agree with Erik.
- Is Erik's unmerged `fix/contact-form-durability` (4 Sep) meant to ship?

## Read next
- `CLAUDE.md`, `docs/growth-audit.md`
- Brain: `Learnings/A Vercel Deploy Replaces the Whole Site — Merge Before You Deploy.md`
