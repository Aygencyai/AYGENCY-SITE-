# Aygency Website — Content Rebuild: Plan + Copy Deck

Canonical spec for the rebuild. Built from the Q&A session (see `website-rebuild-decisions.md` for the decision trail). Two halves: **Part 1 — Plan** (what changes, IA, phases) and **Part 2 — Copy Deck** (the actual draft words, for approval before code).

Brand voice (locked): sharp technical founder, not salesperson. Direct, present tense, no exclamation marks, no hype/consulting language. Confident, not confrontational. Say "agent systems / agents", "build / deploy / operate / compound". Never publish the tech stack, team size, or unproven ROI numbers.

---

# PART 1 — PLAN

## What this is
A content + structure rebuild on the **existing dark/cyan visual system** (the look stays; layout/sections can change). The product story now **leads with The Aygency System** (8 agents, flexible tiers, prescribe-then-tailor). Backend, routing, contact API (Resend + Cal.com), and the 3D hero animation are preserved.

## Information architecture
| Route | Status | Notes |
|---|---|---|
| `/` | REBUILD | New flow (below). Hero + bold tone preserved. |
| `/system` | **NEW** | The lead offering — structured roster (CEO on top → 6 core → Front Desk +1), flexible tiers, prescribe-tailor. |
| `/services` + 4 detail | REBUILD | Reframed outcome pages, each maps to agents + tailoring, feeds `/system`. |
| `/use-cases` + 4 detail | REBUILD | Reframed as **"system blueprints by sector"** (honest, not implied case studies). |
| `/about` | **NEW** | How we operate (compounding + operate-forever) + founders / why we exist. |
| `/trust` | **NEW** | Full governance: data ownership + privacy, human oversight + controls, how we operate it. |
| `/insights` + posts | **NEW** | Scaffold + 2 launch posts. |
| `/contact` | KEEP LOGIC | Refresh copy only. Resend + Cal.com untouched. |

**Primary nav:** The System · Services · Use Cases · Insights · About · **[Contact]** (button).
**Footer:** all of the above + Trust + build@aygency.ai + "Based in London. Operating globally."

## Homepage flow (rebuilt)
1. **Hero** — unchanged except the body paragraph. Keep "BUILT ONCE, COMPOUND FOREVER", the 3D blocks, the typewriter line, both buttons.
2. **Marquee** — keep; reword to agent/system vocabulary.
3. **Problem** — NEW beat: "the work that should run itself."
4. **The System** — teaser for the 8-agent system → links to `/system`.
5. **CEO Agent** — kept as its own beat (refreshed); node graph stays.
6. **How It Works** — the old "What We Build" 3-card MERGED in; one process section on the canonical five phases.
7. **Compounding** — the "proof" beat: built-once-compound-forever + operate-forever.
8. **Data Security** — short version → links to `/trust`.
9. **CTA** — "SEE EXACTLY WHAT WE'D BUILD FOR YOU."
10. **Footer.**

## Phased build (per repo Phased Build Rule — build, verify `pnpm build`, commit, compact between phases)
- **Phase 0 — Data + types.** `src/lib/data.ts`: add `agents` (8, product names + roles), model tiers as a flexible spectrum, rewrite `processSteps` to the five phases, neutralize the unused `metrics`. Additive types in `src/types/`.
- **Phase 1 — Homepage.** Rebuild the flow above across `src/app/page.tsx` + `src/components/home/*`. New body paragraph, Problem beat, System teaser, refreshed CEO beat, merged How-It-Works, Compounding beat, short Data-Security, new CTA.
- **Phase 2 — `/system` page (NEW).** Structured roster + flexible tiers + prescribe-tailor.
- **Phase 3 — Services reframe.** Overview + 4 detail pages; map each to agents + tailoring + five-phase.
- **Phase 4 — Use-cases → blueprints.** Relabel + present-tense + blueprint framing.
- **Phase 5 — `/about` + `/trust` (NEW).**
- **Phase 6 — `/insights` (NEW)** — scaffold + 2 posts.
- **Phase 7 — Nav, footer, metadata/SEO, contact copy, global polish + responsive verify** (1440/1024/768/375).

## Verification
`pnpm build` (zero errors) each phase. Grep gone: "We replace workflows", "From pain point to pipeline", "We don't sell packages", "Uncover/Get Smarter/Diagnose-Design" process variants, unproven "80%". Present: "BUILT ONCE, COMPOUND FOREVER", "CEO Agent", build@aygency.ai. Absent: any tech-stack name, team-size phrasing.

---

# PART 2 — COPY DECK (drafts for approval)

> Items marked **[PICK]** have options for you to choose (surfaced separately). Everything else is a draft — edit freely.

## Homepage

### Hero (keep all except body paragraph)
- Heading (KEEP): **BUILT ONCE, COMPOUND FOREVER**
- Typewriter line (KEEP): *You're overpaying for work that should run itself*
- **Body paragraph (CHOSEN — B):** "We replace the manual work running your operation with agent systems that work around the clock, never drop a task, and improve the longer they run."
- Buttons (KEEP): **BOOK A CALL** · **WHAT WE BUILD**

### Marquee (reworded)
Agent systems · CEO Agent · Operations · Analyst · Front Desk · Scout · Outreach · Strategist · Producer · Multi-agent orchestration · Full AI-led departments · Operated 24/7

### Problem beat (NEW)
- Heading: **THE WORK THAT SHOULD RUN ITSELF**
- Body: "Every operation has work that doesn't need a person — it needs a system. The reports built by hand. The follow-ups that slip. The data re-typed between tools. The decisions waiting on someone to find the time. It runs on people because the alternative used to be worse. It isn't anymore."

### The System teaser
- Heading: **ONE SYSTEM. EIGHT AGENTS. BUILT AROUND YOU.**
- Body: "We don't hand you a menu to figure out. We prescribe a system — a CEO Agent and the specialists your operation needs — and tailor it to how you actually work. Start with the few that move the needle. Add the rest as it earns its place."
- Link: **Explore the system →** (`/system`)

### CEO Agent beat (kept, refreshed)
- Node graph (KEEP). Heading (KEEP): **EVERY SYSTEM COMES WITH A CEO**
- Body (refreshed): "It's not a dashboard. It sits on top of every agent in your system, reads across the whole operation in real time, and does what a sharp operator does — spots the patterns no single department can see and surfaces the opportunities nobody briefed it to find. Your specialist agents run the work. The CEO Agent makes sense of all of it."
- Tag (KEEP): **INCLUDED WITH EVERY SYSTEM. NO ADD-ON. NO UPGRADE TIER.**

### How It Works (five phases; absorbs the old 3-card)
- Heading: **HOW IT WORKS**
- 01 **Prescribe** — "We show you what a business like yours runs and prescribe the agents that fit. No blank page, no menu to self-architect."
- 02 **Tailor** — "We configure what each agent does inside your operation — what it reads, writes, and decides. You see the whole system before we build."
- 03 **Build** — "We build every agent and connect it to your live tools and data. You watch it come together."
- 04 **Deploy** — "The system goes live in your environment, on real data, making real decisions. Results in the first weeks."
- 05 **Compound** — "We operate it from here. It learns every cycle, we tune it, and it gets more valuable the longer it runs."

### Compounding beat (the "proof" beat)
- Heading: **DEPRECIATING COST. APPRECIATING VALUE.**
- Body: "Day one, the system runs the workflow. By month three, it runs it better than any person could. By month six, it's surfacing opportunities no one asked it to find. The reason it compounds instead of decaying is that we operate it — monitoring, tuning, expanding coverage. The cost stays flat. The value climbs."

### Data Security teaser (short → /trust)
- Heading (KEEP): **YOUR DATA STAYS YOURS**
- Body: "Every system runs inside your environment. Your data never trains external models and never leaves unless you say so. High-impact actions route to a human, and the whole system can roll back to a known-good state."
- Link: **How we operate responsibly →** (`/trust`)

### CTA (chosen)
- Heading: **SEE EXACTLY WHAT WE'D BUILD FOR YOU.**
- Body: "30 minutes. A straight answer on where agents would hit hardest — and how fast it goes live."
- Button: **BOOK A CALL**

## /system (NEW)
- Hero: **THE AYGENCY SYSTEM** / "A coordinated team of AI agents that runs your operation — prescribed to your business, tailored to your work, operated by us."
- **How the system is built:**
  - **CEO Agent (on top):** "Sits above every agent. Reads across the whole operation, spots cross-department patterns, and answers the questions you'd put to a great operator. Always included."
  - **The operation core (six specialists):**
    - **Operations** — "The doer. Runs multi-step work across your tools — approvals, onboarding, data syncing, chasing, reminders."
    - **Analyst** — "The intelligence layer. Reads across your data to find patterns, run reports, and flag what's off — on schedule or on demand."
    - **Scout** — "The finder. Scours where your prospects, candidates, or opportunities show up, enriches and scores them, hands over a clean pipeline."
    - **Outreach** — "The opener. Personalised outbound at scale across email, DM, and SMS — reads replies, tailors every touch."
    - **Strategist** — "The signal-reader. Spots what's working in your market and outbound and turns it into what to say next."
    - **Producer** — "The maker. Generates the content the operation runs on — copy, posts, reports, briefings — in your voice, on cadence."
  - **Front Desk — the +1:** "The front of house. Handles inbound conversations on any channel, chat or voice, and actually completes things: books, answers, resolves. It runs on its own — a system in its own right, or an add-on to any other."
- **How much system you need (flexible spectrum):** "Every system starts with the CEO Agent and the specialists that fit. Most start with a few and grow — there's no fixed package. You run as much system as your operation needs. Pricing is tailored to your operation, and we give you the number on the call — no gate, no guesswork."
- **We prescribe. You don't architect:** "You shouldn't have to design your own AI department. We show you what a business like yours runs, prescribe the agents that fit, and tailor what each one does inside your operation. You decide; we build."

## /services (reframed — overview + 4 detail)
- **Overview heading (CHOSEN — A):** CUT THE COST. CAPTURE THE REVENUE.
- Overview body: "Every system is the same eight-agent system, tailored to the job. These are the four places they land hardest — cut cost, drive revenue, see the whole operation, or run an entire function."
- **Detail pages (pattern):** keep the structure (problem → what this looks like → approach → CTA), rewrite to current voice, set `approach` to the five phases, and add a line on **which agents** compose this outcome + that it's the System tailored. (Full copy drafted in Phase 3; Cost Reduction drafted first as the exemplar.)

## /use-cases → "system blueprints by sector"
- Overview: **SYSTEM BLUEPRINTS BY SECTOR** / "How we'd architect an agent system for an operation like yours. Real shapes, drawn from the work — not case studies."
- Detail pattern: present/conditional tense throughout ("What they'd be dealing with" → keep diagnostic but non-past; "How we'd build it"). Keep the agent cards; "CEO Agent" stays. Each page reads clearly as a blueprint, not a claimed win.

## /about (NEW)
- Hero: **WE BUILD IT. THEN WE RUN IT.**
- How we operate: the compounding effect + "we operate every system forever" (why ours compound where others plateau).
- Founders / why: tight origin + the bet Aygency is built on (no team-size talk, no mission-speak).

## /trust (NEW) — three pillars
- Hero: **BUILT TO BE TRUSTED WITH YOUR OPERATION**
- **Your data, your environment** — runs inside your infrastructure; never trains external models; never leaves unless you say so; UK GDPR.
- **Human oversight where it matters** — high-impact actions route to a human; kill-switch; rollback to a known-good state.
- **Operated, not abandoned** — we monitor, tune, and catch edge cases; reliability is a practice, not a promise.

## /insights (NEW) — scaffold + 2 posts
- Index: **INSIGHTS**
- Post 1: **"Automation runs a task. Agent systems run an operation."** (category education — the core distinction)
- Post 2: **"Built once, compound forever: why agent systems appreciate."** (the compounding thesis)
- (Full article bodies drafted in Phase 6.)

## Footer
- Tagline: "Custom AI agent systems. Built once, compounding forever."
- Columns: **The System** · **Services** (4 outcomes) · **Company** (Use Cases, About, Insights, Trust) · **Get in touch** (build@aygency.ai · Based in London. Operating globally.)

---

## Confirmed
- Hero body = **B**; Services heading = **A**.

## Founder-confirm later (don't block the build)
- Tier pricing numbers (kept off-site for now).
- Whether any real proof becomes shareable (then add a `/work` page).
