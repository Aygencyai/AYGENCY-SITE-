# Aygency Homepage — Claude Code Build Prompt

You are building a premium homepage for **Aygency**, an AI agent systems agency. This is a Next.js 14+ (App Router) site with TypeScript and Tailwind CSS. The design must feel like a high-end design studio website, NOT a generic AI/SaaS template.

---

## REFERENCE DESIGN (what to replicate structurally)

The reference is the OPTIMIND AI agency concept by Anton Skvortsov. Here is the exact layout and structure to follow:

### Navigation
- Sticky top nav, full width
- Logo "AYGENCY" left-aligned — uppercase, tracked-out, medium weight sans-serif
- Nav links center-right: HOME, SERVICES, WORK, PRICING — spaced evenly, uppercase, small, tracked
- Far right (separated from main links): TEAM, CONTACT
- Thin horizontal progress/accent line running beneath the entire nav (1px, spans full width)
- Nav background matches page background (no contrast bar)

### Hero Section (full viewport height)
- Background: ivory/warm off-white (#F5F1EB or similar warm cream)
- **Left side**: Large bold uppercase heading, 3-4 lines. Use a refined serif or strong geometric sans. Example text:
  ```
  BUILDING
  SMARTER WITH
  AI AGENTS
  ```
  Font size ~5-6rem desktop, tight line-height (0.95-1.0), dark text (#1B2E1B or near-black with green undertone)

- **Right of heading** (not below — positioned to the right, vertically centered with the heading): Smaller body text, regular weight, max-width ~350px. Example:
  ```
  We design, build, and operate custom AI agent
  systems that replace manual workflows with
  autonomous intelligence.
  ```

- **Two CTA buttons** centered horizontally below the heading/subtext area:
  - "GET IN TOUCH" — filled dark green (#1B3A2D Wimbledon green), white text, pill/rounded-rect shape, uppercase, tracked
  - "OUR SERVICES" — outlined only (1px border, same green), transparent fill, dark text, same shape

- **Slide counter** bottom-left of hero: "001 / 005" style — small, monospaced or tracked sans-serif, muted colour

### 3D Visual Section (bottom half of viewport, overlapping hero)
- Large abstract 3D sphere/orb made of wireframe mesh with glowing network nodes
- The orb sits in the lower-centre of the viewport, partially overlapping the hero section above
- Wireframe lines: dark green (#1B3A2D) or dark grey
- Glowing nodes/particles: accent light blue (#5BA4C9) and warm gold/amber sparks
- Behind the orb: a faint circular outline (like a thin ring/orbit path), very subtle
- Use Three.js (react-three-fiber) for the 3D orb. It should slowly rotate and have subtle floating particle animation. The particles should gently pulse in brightness.
- If Three.js is too complex for a single stage, use a high-quality CSS/SVG approximation with a radial gradient glow and animated dots — but Three.js is preferred.

- **Overlay text** bottom-left on the dark/visual area: small descriptor text in white/light colour:
  ```
  Helping forward-looking companies thrive
  with custom AI agent systems and automated
  workflows.
  ```

- **Scroll indicator**: bottom-centre, minimal (thin line or mouse icon with subtle bounce animation)
- **"SHARE" link**: bottom-right, small, with share icon

---

## COLOUR PALETTE

These are the EXACT colours. Do not deviate.

| Name | Hex | Usage |
|------|-----|-------|
| Ivory (primary bg) | #F5F1EB | Page background, hero, cards |
| Ivory Dark | #EBE5DB | Borders, subtle separators, hover states on ivory |
| Wimbledon Green (primary accent) | #1B3A2D | Filled buttons, heading text, nav accent line, wireframe lines |
| Green Light | #2D5E45 | Hover states on green, secondary green elements |
| Green Muted | #4A7A62 | Body text on light backgrounds, secondary text |
| Navy (secondary dark) | #1A2744 | Footer background, deep sections, alternative dark |
| Futuristic Blue (minimal accent) | #5BA4C9 | Glowing particles, subtle highlights, links on hover, tech accents |
| Blue Light | #8DC4DE | Very subtle background tints, glow effects |
| Near Black | #141C15 | Darkest text, high contrast elements |
| White | #FAFAF8 | Text on dark backgrounds (slightly warm white) |
| Muted Grey | #8A8A80 | Captions, counters, secondary info |

**Rules:**
- Ivory is dominant — 70%+ of the visible page should be ivory/cream
- Green is the primary accent — buttons, headings, accent lines, key UI elements
- Blue is MINIMAL — only for glowing particles, occasional hover states, and tiny tech accents. It should feel like it appears sparingly, like a flash of light. Never use it for backgrounds or large areas.
- Navy appears only in the footer or deep contrast sections

---

## TYPOGRAPHY

Use Google Fonts:

- **Display/Headings**: "DM Serif Display" — serif, elegant, editorial. Use for the large hero heading and section titles. Uppercase where specified.
- **Body/UI**: "DM Sans" — clean geometric sans-serif. Use for everything else.
- **Monospaced accents**: "JetBrains Mono" or "Space Mono" — for the slide counter, small technical labels

Type scale:
- Hero heading: 80px / 0.95 line-height / uppercase / DM Serif Display / #1B3A2D
- Section headings: 48px / 1.1 line-height / DM Serif Display / #1B3A2D
- Subheadings: 20px / 1.4 / DM Sans Medium / #4A7A62
- Body: 16px / 1.6 / DM Sans Regular / #4A7A62
- Caption/small: 12px / 1.4 / DM Sans / #8A8A80
- Nav links: 13px / uppercase / letter-spacing 0.12em / DM Sans Medium / #1B3A2D
- Button text: 13px / uppercase / letter-spacing 0.15em / DM Sans SemiBold

---

## ADDITIONAL SECTIONS (below the hero + 3D orb)

### Section 2: Services Overview
- Ivory background continues
- Section heading left-aligned: "WHAT WE BUILD" in DM Serif Display, uppercase
- 3-column grid of service cards:
  1. **Agent Architecture Design** — "We scope your problem, map the workflows, and design multi-agent systems tailored to your operations."
  2. **Build & Deployment** — "Full-stack development of your agent system — from database to AI logic to deployment infrastructure."
  3. **Ongoing Operations** — "We don't just build and leave. We operate, monitor, and iterate your agents so they keep getting smarter."
- Each card: subtle ivory-dark border, generous padding, small green accent line at top (3px), heading in DM Serif Display, body in DM Sans
- Hover: card lifts slightly (translateY -4px), shadow deepens subtly

### Section 3: Proof / Numbers
- Slightly darker ivory band or very subtle green-tinted background (#F0EDE5)
- 3 large stats in a row:
  - "£500K+" — "Modelled annual savings for a single client"
  - "8" — "Specialised AI agents in our SMMA architecture"
  - "24/7" — "Your agents work around the clock. Your team doesn't have to."
- Numbers: large (64px+), DM Serif Display, #1B3A2D
- Labels: small, DM Sans, #8A8A80
- Animate numbers on scroll (count-up for the first two, fade-in for 24/7)

### Section 4: How It Works
- Ivory background
- "HOW IT WORKS" heading
- Horizontal 4-step process with connecting lines:
  1. "Discovery" — We learn your operations and identify automation opportunities
  2. "Architecture" — We design the agent system: roles, data flows, integrations
  3. "Build" — Full development, testing, and deployment
  4. "Operate" — Ongoing monitoring, optimisation, and iteration
- Each step: numbered circle (01, 02, 03, 04) in green, connected by thin lines
- Step descriptions below each circle

### Section 5: CTA Banner
- Full-width dark green (#1B3A2D) background section
- Large white heading: "READY TO DEPLOY YOUR AI WORKFORCE?"
- Subtitle in muted white: "Book a free consultation to explore what agents can do for your business."
- Single CTA button: white fill, green text, pill shape, "GET IN TOUCH"
- Subtle animated particles or dots in the background (blue accent #5BA4C9, very low opacity)

### Footer
- Navy background (#1A2744)
- AYGENCY logo in white, left
- Footer columns: Services, Company, Contact
- Social links
- Copyright: "© 2026 Aygency. All rights reserved."
- Warm white text (#FAFAF8), muted grey for secondary (#8A8A80)

---

## ANIMATIONS (Framer Motion)

- Hero heading: staggered word-by-word fade-up on load (200ms delay between words)
- Hero subtext: fade-in 400ms after heading completes
- CTAs: fade-up 200ms after subtext
- 3D orb: continuous slow rotation (0.003 rad/frame Y-axis), particles pulse opacity
- Scroll indicator: gentle bob animation (translateY 0 to 8px, infinite, ease-in-out)
- Service cards: fade-up with stagger (100ms between cards) on scroll into view
- Stats: count-up animation triggered once on scroll (2 second duration, ease-out)
- How It Works: steps reveal left-to-right with connecting line drawing in
- All scroll animations: use `useInView` with `triggerOnce: true`

---

## TECH STACK

- Next.js 14+ (App Router)
- TypeScript (strict)
- Tailwind CSS v3+
- Framer Motion (animations)
- Three.js + @react-three/fiber + @react-three/drei (3D orb)
- Google Fonts: DM Serif Display, DM Sans, JetBrains Mono
- Deploy-ready for Vercel

---

## FILE STRUCTURE

```
/aygency
├── src/
│   ├── app/
│   │   ├── layout.tsx        # Root layout, fonts, metadata
│   │   ├── page.tsx          # Homepage (all sections)
│   │   └── globals.css       # Tailwind + custom properties
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── OrbScene.tsx      # Three.js 3D orb
│   │   ├── Services.tsx
│   │   ├── Stats.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── CTABanner.tsx
│   │   └── Footer.tsx
│   └── lib/
│       └── utils.ts
├── public/
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## SELF-TEST CHECKLIST

Before completing, verify ALL of the following:

- [ ] `npm run dev` starts with zero errors
- [ ] Hero heading renders in DM Serif Display, uppercase, correct green colour
- [ ] Hero subtext is positioned to the RIGHT of the heading (not below) on desktop
- [ ] Both CTA buttons render — one filled green, one outlined
- [ ] 3D orb renders and rotates smoothly (or CSS fallback animates)
- [ ] Orb wireframe uses green tones, particles glow blue
- [ ] Nav is sticky with accent line beneath
- [ ] Scroll animations trigger correctly on all sections
- [ ] Stats count-up works on scroll
- [ ] CTA banner has green background with white text
- [ ] Footer has navy background
- [ ] Responsive: check at 1440px, 1024px, 768px, 375px — no overflow, no broken layouts
- [ ] Page background is ivory (#F5F1EB), NOT white
- [ ] Blue accent appears ONLY on particles and subtle highlights — nowhere else
- [ ] `npm run build` completes with zero errors
- [ ] Overall impression: feels like a premium design studio site, not a SaaS template

Report the status of each checklist item.
