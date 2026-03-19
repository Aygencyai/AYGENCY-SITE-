> **STATUS: IMPLEMENTED.** All tweaks in this document have been applied to the codebase. Kept for historical reference.

---

# Aygency Website — Content & Layout Tweaks

Read the CLAUDE.md and ~/aygency/docs/aygency-identity.md first. Apply all changes below. Keep all colours, fonts, animations, and overall design system intact unless a specific styling change is noted.

---

## 1. Hero Section — Layout Fix

The hero heading "YOU'RE OVERPAYING FOR WORK THAT SHOULD RUN ITSELF" currently breaks into too many short lines (one or two words per line). Make the heading container wider so the text flows across fewer, longer lines. It should feel like two lines maximum on desktop, not five or six. Adjust the max-width or width of the heading element to achieve this.

---

## 2. Hero Section — Subtitle Styling

"Increase your revenue by decreasing your costs" — this bridge line needs to be in the correct font (DM Sans, medium or semibold weight) and slightly bolder so it stands out as a clear subheader between the heading and the body text. It should be visually distinct from both — not as large as the hero heading, but clearly not body copy either.

---

## 3. Hero Section — Swap Subtext and Sphere Text

**Under the hero subtitle** (below "Increase your revenue by decreasing your costs"), replace the current body text with:

"We exist to make AI agents the operating standard for businesses that refuse to stay manual. Every system we ship is custom-built, production-ready, and designed to compound in value the longer it runs."

**At the 3D sphere/mission section**, replace whatever is currently there with:

"Helping forward-looking companies thrive with custom AI agent systems and automated workflows."

---

## 4. New Section — CEO Agent

Add a new section between "What We Build" cards and the Stats section.

**Heading:** EVERY SYSTEM COMES WITH A CEO

**Body:**
"Every agent system we build includes something most companies don't even know to ask for. We call it the CEO Agent. It sits above every other agent in your system, receives their data in real time, and does what a great CEO does — looks across the entire operation, spots the patterns no single department can see, and finds the opportunities nobody briefed it to find.

Your workflow agents reduce costs. Your CEO agent finds revenue. It identifies which customer segments are quietly growing, which operational changes would unlock capacity, which pricing adjustments would land, and which processes are creating bottlenecks that ripple across your whole business.

This isn't a dashboard. It's not a report you read on Monday morning. It's an agent that thinks about your business the way you do — except it never stops, it sees everything, and it doesn't have blind spots."

**Supporting line:** "Included with every system we build. No add-on. No upgrade tier."

Give this section the same visual weight as "What We Build." Heading in DM Serif Display, same styling as other section headings.

---

## 5. What We Build — Card 1 (Diagnose & Design)

Change the body from:
"We go inside your operation — not your org chart. We map the real workflows, find the highest-cost bottlenecks, and architect a system of agents purpose-built for your specific problems."

To:
"We go inside your operation. We map the real workflows, find the highest-cost bottlenecks, and architect a system of agents purpose-built for your specific problems."

(Removed "— not your org chart")

---

## 6. What We Build — Card 2 (Build & Ship)

Change the body from:
"We build the full system and put it live in your environment — connected to your platforms, reading your data, and making decisions from day one. Not a demo. Not a prototype. A production system."

To:
"We build the full system and put it live in your environment — connected to your platforms, reading your data, and making decisions from day one. A fully working production system."

(Removed "Not a demo. Not a prototype." Changed "A production system" to "A fully operational production system.")

---

## 7. How It Works — Step 03 (Build)

Change from:
"Full development. Full integration with your platforms. Full testing against your real data — not sample sets."

To:
"Full development. Full integration with your platforms. Full testing against your real data."

(Removed "— not sample sets")

---

## 8. Your Data Stays Yours Section

Change from:
"Every system we build operates inside your infrastructure. Your data never trains external models, never leaves your environment unless you say so, and is handled under full GDPR compliance. We build for businesses that take security seriously — because we do too."

To:
"Every system we build operates inside your infrastructure. Your data never trains external models, never leaves your environment unless you say so. We build for businesses that take security seriously — because we do too."

(Removed ", and is handled under full GDPR compliance")

---

## 9. Final CTA Section

Change the heading from:
"LET'S FIND WHAT TO BUILD FIRST"

To:
"YOU'RE GOING TO BUILD THIS. HOW MUCH MORE WILL YOU SPEND BEFORE YOU DO?"

Change the body from:
"Book 30 minutes. We'll map your operation, find the workflows bleeding time and money, and tell you exactly what we'd build — and how fast. No fee. No slide deck. Just a straight answer."

To:
"Book 30 minutes. We'll map your operation, find the workflows bleeding time and money, and tell you exactly what we'd build."

---

## That's everything. Run pnpm build when done.
