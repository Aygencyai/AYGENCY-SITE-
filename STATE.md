---
as-of: 2026-11-05T20:00:00Z
session: Home and service pages redesign committed to PR #16; go-live checks run
---

# STATE: aygency-site

## Live right now
- Production builds automatically from `main` on GitHub (checked 2026-11-05). Keep `design/migration-v2` level with `main`. Louis asked to go live on 2026-11-05 with PR #16, knowing the contact form and audit emails are still to fix.
- `next dev -p 3116` runs on Louis's Mac from this worktree.

## In flight, Louis's latest verdicts (2026-11-05)
- **First screen of the home page:** the 3D letter box is replaced by the walkthrough film at Louis's request (`HeroFilm.tsx`, `public/videos/`, 28 MB of film files). The button under it reads "Book your free AI growth audit", matching the film's last frame, and links to `/audit`. Check before go-live: `/audit` was unlisted until now, and submissions on the live site are untested.
- **"Most AI agencies..." (`WhyAygency.tsx`):** Louis approved the round 4 design and wording, on the local home page: "Built around you" (we come to where your information lives), "Built to your standards", "Compounding, not depreciating" (we operate every agent, growth partners). Louis confirmed "Each correction your team makes is remembered" stays.
- **Agents (`SystemTeaser.tsx`):** jobs at different times are right. Phone still looks squashed: design a separate phone version.
- **Command centre (`SystemCore.tsx`):** liked on desktop and phone. Louis is testing on his phone. Its intro's first half is reworded and awaits his check.
- **Quality (`Quality.tsx`):** Louis prefers the morning calendar if it fits, so it replaced the big sentence, made shorter to match. His wording: "A manual job that took 4 hours now takes 12 minutes", "We're able to save more than 100 hours of work per month".
- **Site hours figures:** Louis settled these on 2026-11-05: they all stay, including "hundreds of hours a week" and "up to 100 hours a month". Do not raise them again unless he does.
- **Home page order, set by Louis 2026-11-05:** Hero, Agents, Command centre, Most AI agencies, Quality, Services, Data, Final call. "Your information already lives somewhere" moved from Most AI agencies to the command centre. Open: command centre panel wording "in one place" vs "connected, where it lives".
- **Brain page:** removed locally; `/brain` redirects to Business Brain. Only the Brain and custom agents are in every build. Film poster swapped for his "See how it works" version; label is still "What we do".
- **Rules from Louis (2026-11-05):** "We don't need to keep re-explaining things": every section makes a point the others don't, and day-to-day tables are off all service pages. Name real, commonly used tools (Excel, Outlook, Xero, HubSpot), not descriptions like "your inbox". Tool names as text only, no logos.
- **Services overview:** simplified at Louis's request to the click-through cards from the home page (`ServiceCards`). Home page line changed to "Most systems start with".
- **Service pages:** all eight are rebuilt locally in the tour shape (Louis chose layout A) with the before and after drawing he chose, awaiting his review (`src/components/services/`). "Every engagement starts with" on the services overview now says "Most engagements". Every section must show what the AI is doing. Sample screens are labelled illustrative.
- Section gradient joins are fixed across 11 pages (`SystemCore`, `Faq`).

## Go-live checks (2026-11-05)
Production build, lint, types, 34 sitemap pages, internal links, `/brain` redirect and the film all pass (Chrome and Playwright WebKit). Home page downloads about 650 KB before play. One test went through the live `/audit`, labelled "TEST please ignore" from build@aygency.ai: stored, status completed. Louis did not receive its notification email: audit answers save, but no email goes out until Resend is set up. Still to check: a real iPhone and real Safari.

## Blocked, and on whom
- **Contact form still returns 500 on the live site (re-checked 2026-11-05).** An empty POST to `/api/contact` should return 400. `new Resend()` sits outside the `try` in the route, so a missing `RESEND_API_KEY` in production would cause exactly this (inferred, the Vercel value was not read). On Louis (Resend + Cloudflare). Re-check: does an empty POST return 400, not 500?

## Open decisions
- Build a phone design skill? None exists, only a Brain note. Recommended next session.
- Redesign the other home sections for phone (services, data, final call to action)?
- Agents' sample jobs are new, some with made-up figures: Louis to approve before commit.
- Is Erik's unmerged `fix/contact-form-durability` (4 Sep) meant to ship? (carried)

## Before committing
- Nothing outstanding: all temporary review routes are deleted.

## Read next
- `CLAUDE.md`, then `docs/design-variations/round-3/aygency-home-round-3.pdf` (git-excluded, local only).
- Earlier PDFs Louis asked to keep: `docs/design-variations/visual-styles/`, `docs/design-variations/website-sections/`.
- Brain: `Learnings/Louis Decides Design From Rendered Options, Not Questions.md`, `Learnings/The Phone Is Its Own Design — Tells From Casa Casa.md`.

## Previously
### as of 2026-10-06T12:03:33Z
### Live right now
- aygency.ai serves `main` bd0f19c, PR #10: AI Growth Audit, branded previews and public Ava onboarding at /design-your-eden.
- Deployment: dpl_3Ly7XJ2WXhy9uaYQHQErrnXTwMU2. Six Ava/connection production settings are saved; existing settings preserved.
- Public pages and unauthenticated conversation open return 200. Password sign-in does not depend on SMTP. Real owner sign-in/conversation and CRM read-back remain to be exercised.
- `design/migration-v2` fast-forwarded to `main` bd0f19c on 2026-10-06; keep them level until Vercel builds from
  one GitHub branch.

### In flight
- Public Ava/CRM intake is launched under owner approval. Bot/model credentials are supplied during fulfilment; a third test Eden is not an intake prerequisite.

### Blocked, and on whom
- Founder Eden notification emails remain skipped pending Resend. Confirmations are durable independently and available for team review. Owner public conversation/CRM check remains pending; browser control was paused at the owner's request.
- **The contact form fails on every submission** (500): no `RESEND_API_KEY` / `CONTACT_EMAIL` in Vercel,
  and aygency.ai is not verified in Resend (no DNS records in Cloudflare). On Louis (Resend + Cloudflare).
  Re-check: does an empty POST to /api/contact return 400, not 500?
- Audit completion emails are skipped for the same reason; answers still save to Supabase.

### Open decisions
- Connect Vercel to GitHub so production builds one branch; agree with Erik.
- Is Erik's unmerged `fix/contact-form-durability` (4 Sep) meant to ship?

### Read next
- `CLAUDE.md`, `docs/growth-audit.md`
- `docs/eden-launch-preflight-20261006.md`
- Brain: `Learnings/A Vercel Deploy Replaces the Whole Site — Merge Before You Deploy.md`
