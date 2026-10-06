---
as-of: 2026-10-06T12:03:33Z
session: Ava public intake launch, preserving current main and Growth Audit
---

# STATE: aygency-site

## Live right now
- aygency.ai serves `main` bd0f19c, PR #10: AI Growth Audit, branded previews and public Ava onboarding at /design-your-eden.
- Deployment: dpl_3Ly7XJ2WXhy9uaYQHQErrnXTwMU2. Six Ava/connection production settings are saved; existing settings preserved.
- Public pages and unauthenticated conversation open return 200. Password sign-in does not depend on SMTP. Real owner sign-in/conversation and CRM read-back remain to be exercised.
- `design/migration-v2` fast-forwarded to `main` bd0f19c on 2026-10-06; keep them level until Vercel builds from
  one GitHub branch.

## In flight
- Public Ava/CRM intake is launched under owner approval. Bot/model credentials are supplied during fulfilment; a third test Eden is not an intake prerequisite.

## Blocked, and on whom
- Founder Eden notification emails remain skipped pending Resend. Confirmations are durable independently and available for team review. Owner public conversation/CRM check remains pending; browser control was paused at the owner's request.
- **The contact form fails on every submission** (500): no `RESEND_API_KEY` / `CONTACT_EMAIL` in Vercel,
  and aygency.ai is not verified in Resend (no DNS records in Cloudflare). On Louis (Resend + Cloudflare).
  Re-check: does an empty POST to /api/contact return 400, not 500?
- Audit completion emails are skipped for the same reason; answers still save to Supabase.

## Open decisions
- Connect Vercel to GitHub so production builds one branch; agree with Erik.
- Is Erik's unmerged `fix/contact-form-durability` (4 Sep) meant to ship?

## Read next
- `CLAUDE.md`, `docs/growth-audit.md`
- `docs/eden-launch-preflight-20261006.md`
- Brain: `Learnings/A Vercel Deploy Replaces the Whole Site — Merge Before You Deploy.md`
