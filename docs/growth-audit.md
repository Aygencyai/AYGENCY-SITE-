# AI Growth Audit

A click-through questionnaire at `aygency.ai/audit` that a prospect fills in before our first meeting.
It finds the repetitive manual work in their week: what it is, who does it, how often and how long it
takes, where information gets typed twice, what systems they use and where they already use AI. We get
the answers plus a basic diagnosis (agents ranked by team hours, and an hours/£ estimate for our pricing).
The prospect only sees the list of tasks we'll look at.

Every business gets the same questions. A **pack** swaps the task, role and tool lists for their world:
`general` or `construction` (see `packs` in `src/lib/growth-audit/questions.ts`). The pack is set on the
invite; the public page uses `general`. To add a pack, add it to `PACKS` and `packs`, and to the check
constraint on both tables. Research and reasoning behind the questions:
`~/aygency/docs/discovery-funnel/discovery-funnel-research.md`.

## How it works

```
browser /audit ──► POST /api/audit (validates with Zod, rate-limited, same-origin only)
                       │  signs  `${timestamp}.${body}`  with GROWTH_AUDIT_SIGNING_KEY (Ed25519)
                       ▼
        Supabase Edge Function growth-audit-ingest (Aygency-internal)
                       │  verifies with the public key in its source, rejects >5 min skew
                       ▼
        crm.growth_audits  ◄── one row per audit, updated on every step
        crm.growth_audit_invites  ◄── personal links
```

- **Every step is saved**, not only the finish, so half-finished audits and drop-off points are visible.
  `steps_completed` and `last_step` show how far someone got; `completed_at` is set once and a completed
  row can never be changed again.
- **Answers are stored raw**, tagged with `question_set_version`. Estimates are computed from them, never
  stored, so better assumptions can be re-run over every past audit.
- **The browser never holds a secret** and never talks to Supabase. The Edge Function holds no secret
  either: it has the public half of the key only.
- Unfinished answers also sit in the visitor's browser (`localStorage`), so a refresh or a return visit
  offers to carry on.
- On completion the server emails us a summary via Resend if `RESEND_API_KEY` and a recipient are set:
  the diagnosis, each task with its hours, and their answers. The row is the record; the email is a nudge.
  The hours and £ figures are internal, for pricing; they come from band midpoints and UK median pay, so
  check them in the room.

## Sending a personal link

Create an invite (Supabase SQL editor, Aygency-internal):

```sql
insert into crm.growth_audit_invites (code, company, contact_name, contact_email, pack, notes)
values (
  replace(replace(encode(gen_random_bytes(18), 'base64'), '+', '-'), '/', '_'),
  'Company Ltd', 'First Last', 'them@company.com', 'construction', 'Meeting 6 Oct'
)
returning 'https://www.aygency.ai/audit?c=' || code as link;
```

The link pre-fills their company and name. Revoke with `update ... set revoked_at = now()`.

## Reading the answers

```sql
select a.company, a.contact_name, a.completed_at, a.last_step, a.answers
from crm.growth_audits a
order by a.updated_at desc;
```

Band values (`"2-3"`, `"10-20"`, `"admin"`) map to labels in `src/lib/growth-audit/questions.ts`.

## Changing the questions

Edit `questions.ts`, and bump `QUESTION_SET_VERSION` if any option value is added, removed or renamed.
The Edge Function accepts any `growth-audit.vN`.

## Rotating the signing key

Generate a new Ed25519 pair, put the private half (base64 PKCS#8 DER) in Vercel as
`GROWTH_AUDIT_SIGNING_KEY`, paste the public half (raw 32 bytes, base64) into
`supabase/functions/growth-audit-ingest/index.ts`, redeploy the function, then redeploy the site.

## Not built yet

- **Pay rates by role.** The £ estimate uses the UK median for every role. Senior roles (directors, QS)
  cost more; per-role ONS rates would sharpen it.
- **Voice notes.** The free-text answer could take a voice note instead.
- **A view in the Aygency dashboard.** For now, the Supabase table view.
- **Public use.** The page is `noindex` and not linked from the site. Making it a public funnel is a
  choice to make once a few real audits show which questions earn their place.
