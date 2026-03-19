> **STATUS: SUPERSEDED — Migration Complete.** These prompts guided the initial ivory/green design migration. The site has since undergone a second design overhaul to a dark void/cyan theme with Space Grotesk headings. All sessions here have been completed and the design has moved beyond what these prompts describe. Kept for historical reference only.

---

# Aygency Design Migration — Claude Code Prompts

Exact prompts to feed Claude Code, in order, one session per step. Copy-paste these directly into Claude Code.

**Before you start:** Make sure you've done the setup (see Setup section at the bottom).

---

## SESSION 1: Design System Foundation

This session updates Tailwind config, globals.css, and font loading. No component changes yet. This is the foundation everything else builds on.

**Enter Plan Mode first (Shift+Tab x2), then paste:**

```
Read the entire codebase — every file in src/, tailwind.config.ts, globals.css, package.json, and the CLAUDE.md at the project root. Understand the current design tokens, colour system, fonts, and Tailwind configuration.

Then plan (do not code yet) the following changes:

1. UPDATE tailwind.config.ts:
   - Replace the entire colour palette with these exact colours:
     ivory: '#F5F1EB'
     'ivory-dark': '#EBE5DB'
     green: { DEFAULT: '#1B3A2D', light: '#2D5E45', muted: '#4A7A62' }
     navy: '#1A2744'
     blue: { DEFAULT: '#5BA4C9', light: '#8DC4DE' }
     'near-black': '#141C15'
     white: '#FAFAF8'
     muted: '#8A8A80'
   - Add font families: serif: ['DM Serif Display'], sans: ['DM Sans'], mono: ['JetBrains Mono']
   - Remove any old colour tokens that are no longer in the palette

2. UPDATE src/app/layout.tsx:
   - Replace all current Google Font imports with DM Serif Display (weight 400), DM Sans (weights 400, 500, 600), and JetBrains Mono (weight 400)
   - Use next/font/google for all three
   - Apply DM Sans as the default body font via className on <html> or <body>
   - Set CSS variables for each font family so they can be referenced in Tailwind and globals.css

3. UPDATE src/app/globals.css:
   - Replace any existing CSS custom properties with the new colour tokens as CSS variables
   - Set the root background to ivory (#F5F1EB)
   - Set the root text colour to green-muted (#4A7A62)
   - Add base styles for headings using DM Serif Display
   - Remove any GSAP-related CSS if present
   - Keep all Tailwind directives (@tailwind base/components/utilities)

4. CHECK package.json for any packages that need adding or removing:
   - NEED: framer-motion, @react-three/fiber, @react-three/drei, three
   - NEED: @types/three (devDependency)
   - REMOVE: gsap (if present) — we're phasing it out
   - Keep everything else

Show me the plan with the specific changes for each file before coding.
```

**After reviewing and approving the plan, let Claude Code execute. Then run:**

```
Run pnpm build and fix any errors. Then confirm the design tokens are correctly set by listing the full Tailwind config colour and font sections.
```

**Then `/clear` and move to Session 2.**

---

## SESSION 2: Navbar + Footer

These are the two layout components that appear on every page. Restyle them first.

```
Read the CLAUDE.md, then read src/components/layout/ (Navbar and Footer components) and src/app/layout.tsx.

Restyle the Navbar component to match this spec exactly. KEEP all existing navigation links and routing logic — only change the visual presentation:

NAVBAR SPEC:
- Sticky top, full width, z-50
- Background: ivory (#F5F1EB), no visible contrast bar against the page
- Logo "AYGENCY" left-aligned: uppercase, letter-spacing 0.15em, DM Sans font-semibold, text-green (#1B3A2D), text-sm
- Navigation links arranged center-right: uppercase, 13px, letter-spacing 0.12em, DM Sans medium, text-green
- Preserve the existing link destinations and any active state logic
- Thin 1px horizontal line beneath the entire nav, full width, colour ivory-dark (#EBE5DB)
- Padding: py-4 px-6 on mobile, px-12 on desktop
- Mobile menu: keep existing hamburger/mobile menu logic, just restyle to match the new palette

Then restyle the Footer:
- Background: navy (#1A2744)
- "AYGENCY" logo in warm white (#FAFAF8), same tracked uppercase style as navbar
- Keep all existing footer content (columns, links, social links)
- Body text: warm white (#FAFAF8), secondary/small text: muted (#8A8A80)
- Copyright: "© 2026 Aygency. All rights reserved." in muted
- Generous padding: py-16 px-6, px-12 on desktop
- If there are any social link icons, keep them, just restyle to white/muted

Do NOT modify any link hrefs, routing logic, or data sources. Only change colours, fonts, spacing, and visual presentation.

After making changes, run pnpm build and verify zero errors.
```

**`/clear` and move to Session 3.**

---

## SESSION 3: Homepage Hero Section

The most visually important section. This is the first thing visitors see.

```
Read the CLAUDE.md, then read src/app/page.tsx and all components in src/components/home/.

Create or completely restyle the Hero section component. If there's an existing Hero component, keep any data references but replace all JSX and styling. If there isn't one, create src/components/home/Hero.tsx.

HERO SPEC:

Layout (desktop — min-width 1024px):
- Full viewport height (min-h-screen), background ivory (#F5F1EB)
- Content is vertically centred within the viewport
- LEFT SIDE: Large heading, RIGHT SIDE: body text — they sit side by side, not stacked
- Below both (centred horizontally): two CTA buttons

Heading (left side):
- Text: "BUILDING SMARTER WITH AI AGENTS" broken across 3 lines: "BUILDING" / "SMARTER WITH" / "AI AGENTS"
- Font: DM Serif Display, uppercase
- Size: 80px (5rem) on desktop, 48px on tablet, 36px on mobile
- Line-height: 0.95
- Colour: green (#1B3A2D)
- Framer Motion animation: staggered word-by-word fade-up on page load. Each word fades up from y:20 to y:0 with opacity 0→1, 200ms delay between each word, duration 0.6s, easeOut.

Body text (right of heading on desktop, below on mobile):
- Text: "We design, build, and operate custom AI agent systems that replace manual workflows with autonomous intelligence."
- Font: DM Sans, 16px, regular weight
- Colour: green-muted (#4A7A62)
- Max-width: 350px
- Vertically centred with the heading block on desktop
- Framer Motion: fade-in 400ms after heading animation completes

CTA Buttons (below heading + body area, centred):
- "GET IN TOUCH" — filled green bg (#1B3A2D), white text, rounded-full, px-8 py-3, uppercase, tracking 0.15em, DM Sans semibold 13px. Links to /contact.
- "OUR SERVICES" — outlined, 1px border green, transparent bg, green text, same shape/size. Links to /services.
- Framer Motion: fade-up 200ms after body text appears
- Hover: primary button → bg-green-light (#2D5E45) transition. Outline button → bg-ivory-dark (#EBE5DB) transition.

Slide counter (bottom-left of hero):
- "001 / 005" — JetBrains Mono, 12px, muted colour (#8A8A80)
- Position: absolute, bottom-8, left-8

Scroll indicator (bottom-centre):
- Thin vertical line (1px wide, 40px tall, muted colour) or minimal mouse icon
- Gentle infinite bob animation: translateY 0 → 8px, ease-in-out, 2s duration

Mobile layout (below 1024px):
- Heading and body text stack vertically (heading on top, body below)
- Heading size reduces to 48px (tablet) / 36px (mobile)
- CTAs stack vertically on very small screens (below 480px)
- Slide counter and scroll indicator remain

Wire this component into src/app/page.tsx as the first section. Keep any other existing sections on the homepage for now — just add/replace the Hero at the top.

Run pnpm build after and fix any errors.
```

**`/clear` and move to Session 4.**

---

## SESSION 4: 3D Orb Scene

```
Read the CLAUDE.md. Check that @react-three/fiber, @react-three/drei, and three are installed (pnpm list). If not, install them: pnpm add three @react-three/fiber @react-three/drei && pnpm add -D @types/three

Create src/components/home/OrbScene.tsx — a Three.js 3D orb component.

ORB SPEC:
- A wireframe sphere/icosahedron mesh, radius ~2.5, dark green wireframe lines (#1B3A2D or #2D5E45)
- Floating particles (small spheres or points) scattered around and on the surface of the orb
- Particle colours: futuristic blue (#5BA4C9) as the dominant particle colour, with a few warm gold/amber (#D4A853) sparks
- Particles gently pulse in opacity/brightness (sinusoidal, staggered timing so they don't all pulse together)
- The orb slowly rotates on the Y-axis (~0.003 radians per frame)
- Behind the orb: a faint thin ring/orbit path (very subtle, low opacity)
- Background of the canvas: transparent (the page background shows through)

IMPORTANT TECHNICAL NOTES:
- Wrap the Canvas in a div with defined height (at least 50vh)
- Use dynamic import with next/dynamic and ssr: false — Three.js cannot server-render
- The component should be lightweight — no heavy textures or complex shaders
- Use @react-three/drei helpers where appropriate (e.g., Points, Line)
- Add a subtle ambient light and a point light for depth
- Do NOT use THREE.CapsuleGeometry (not available in r128). Use IcosahedronGeometry for the wireframe sphere.

PLACEMENT:
- Position the orb section below the Hero in page.tsx
- It should feel like it sits in the lower portion of the viewport, partially overlapping or immediately following the hero
- Dark-ish area behind/around the orb: either a gradient overlay from ivory to near-black at the bottom, or a dedicated section with a darker background
- Overlay text bottom-left on this darker area (warm white #FAFAF8, DM Sans, 14px):
  "Helping forward-looking companies thrive with custom AI agent systems and automated workflows."

If Three.js causes build issues that you cannot resolve quickly, create a high-quality CSS/SVG fallback instead:
- Radial gradient glow (dark green centre fading out)
- Animated dots positioned in a circular pattern using CSS animations
- The fallback should still look premium, not placeholder-y

Run pnpm build and verify. Also run pnpm dev and confirm the orb renders in the browser without console errors.
```

**`/clear` and move to Session 5.**

---

## SESSION 5: Services + Stats + How It Works Sections

```
Read the CLAUDE.md, then read src/lib/data.ts to understand the existing service data structure. Also read any existing Services, Stats, or process/how-it-works components in src/components/home/.

Create or restyle these three homepage sections. If existing components have data connections to lib/data.ts, KEEP those data connections — only change the visual presentation. If no components exist, create new ones.

SECTION: SERVICES OVERVIEW (src/components/home/Services.tsx)
- Ivory background continues
- Section heading left-aligned: "WHAT WE BUILD" — DM Serif Display, uppercase, 48px, green (#1B3A2D)
- 3-column grid (stacks to 1 column on mobile) of service cards
- Use the services data from lib/data.ts if it exists. If the data structure doesn't match, map it. The three cards should be:
  1. Agent Architecture Design — "We scope your problem, map the workflows, and design multi-agent systems tailored to your operations."
  2. Build & Deployment — "Full-stack development of your agent system — from database to AI logic to deployment infrastructure."
  3. Ongoing Operations — "We don't just build and leave. We operate, monitor, and iterate your agents so they keep getting smarter."
- Card styling: bg-ivory (#F5F1EB), border 1px ivory-dark (#EBE5DB), rounded-lg, p-8, 3px green accent line at top of each card
- Card heading: DM Serif Display, 24px, green
- Card body: DM Sans, 16px, green-muted
- Hover: translateY(-4px) with shadow transition (use Framer Motion whileHover)
- Scroll animation: cards fade-up with 100ms stagger between them, triggered once on scroll into view

SECTION: STATS / PROOF (src/components/home/Stats.tsx)
- Slightly different background: #F0EDE5 (a touch darker than ivory) or a very subtle green tint
- 3 stats in a row (centred), stacks on mobile:
  1. "£500K+" — "Modelled annual savings for a single client"
  2. "8" — "Specialised AI agents in our SMMA architecture"
  3. "24/7" — "Your agents work around the clock. Your team doesn't have to."
- Number: DM Serif Display, 64px (4rem), green (#1B3A2D)
- Label: DM Sans, 14px, muted (#8A8A80)
- Animate numbers on scroll: count-up animation for "£500K+" (count from 0 to 500, then append "K+") and "8" (count from 0 to 8). "24/7" just fades in. Duration 2 seconds, easeOut. Trigger once.
- Use Framer Motion useInView + useMotionValue + useTransform for the count-up, OR a simple useState + useEffect with requestAnimationFrame.

SECTION: HOW IT WORKS (src/components/home/HowItWorks.tsx)
- Ivory background
- Heading: "HOW IT WORKS" — DM Serif Display, uppercase, 48px, green
- 4 steps in a horizontal layout on desktop (vertical on mobile):
  1. "Discovery" — "We learn your operations and identify automation opportunities"
  2. "Architecture" — "We design the agent system: roles, data flows, integrations"
  3. "Build" — "Full development, testing, and deployment"
  4. "Operate" — "Ongoing monitoring, optimisation, and iteration"
- Each step: numbered circle (01, 02, 03, 04) in green bg with white text, 48px diameter
- Thin connecting lines between circles (1px, ivory-dark or green-muted at low opacity)
- Step title: DM Sans, 18px, semibold, green
- Step description: DM Sans, 14px, green-muted, max-width per step ~200px
- Scroll animation: steps reveal left-to-right with 150ms stagger, connecting lines draw in

Wire all three sections into page.tsx in this order: Hero → OrbScene → Services → Stats → HowItWorks.

Run pnpm build and fix any errors.
```

**`/clear` and move to Session 6.**

---

## SESSION 6: CTA Banner + Page Assembly + Final Polish

```
Read the CLAUDE.md, then read the current state of src/app/page.tsx and all homepage components.

SECTION: CTA BANNER (src/components/home/CTABanner.tsx)
- Full-width section, bg-green (#1B3A2D), py-24 px-8
- Large heading centred: "READY TO DEPLOY YOUR AI WORKFORCE?" — DM Serif Display, white (#FAFAF8), 48px, uppercase
- Subtitle centred below: "Book a free consultation to explore what agents can do for your business." — DM Sans, 16px, white at 70% opacity
- Single CTA button centred: bg-white, text-green, rounded-full, px-8 py-3, uppercase, tracked. Links to /contact.
- Subtle animated particles in background: tiny dots, blue (#5BA4C9) at 15-20% opacity, slowly drifting. Use a simple CSS animation or a lightweight Framer Motion animation — NOT Three.js (keep it light).
- Hover on button: slight scale(1.02) and shadow

HOMEPAGE ASSEMBLY — verify page.tsx has sections in this exact order:
1. Navbar (via layout.tsx, already there)
2. Hero
3. OrbScene (3D orb)
4. Services ("What We Build")
5. Stats (proof numbers)
6. HowItWorks
7. CTABanner
8. Footer (via layout.tsx, already there)

FINAL POLISH — go through each section and verify:
- All backgrounds use ivory (#F5F1EB) unless specified otherwise (Stats uses #F0EDE5, CTA uses green, Footer uses navy)
- No pure white (#FFFFFF) or pure black (#000000) anywhere
- Blue (#5BA4C9) appears ONLY on: orb particles, CTA banner background particles, and tiny tech accents. Nowhere else.
- All headings use DM Serif Display
- All body text uses DM Sans
- All animations use Framer Motion, NOT GSAP
- No GSAP imports remain anywhere in the codebase (search for 'gsap' and remove)
- Responsive: the layout doesn't break at 1440px, 1024px, 768px, 375px viewport widths

Run pnpm build. Zero errors. Report the status.
```

**`/clear` and move to Session 7.**

---

## SESSION 7: Inner Pages Reskin

The homepage is done. Now apply the same design language to the inner pages. These pages have working routing and data — only restyle them.

```
Read the CLAUDE.md. Then read every file in src/app/services/, src/app/case-studies/, and src/app/contact/. Also read src/lib/data.ts and src/types/.

Restyle ALL inner pages to match the homepage design language. The rules:

GLOBAL (applies to all inner pages):
- Background: ivory (#F5F1EB)
- All headings: DM Serif Display, green (#1B3A2D)
- All body text: DM Sans, green-muted (#4A7A62)
- Page top padding: pt-32 (to clear the sticky navbar)
- Consistent section spacing: py-16 or py-24 between major sections
- Use Framer Motion fade-up animations on section load (simple, not over-the-top)

SERVICES OVERVIEW PAGE (/services):
- Page heading: "OUR SERVICES" — same style as homepage section headings
- Service cards: same card style as homepage Services section (ivory bg, ivory-dark border, green accent top line, hover lift)
- Each card links to its detail page — keep existing link logic
- If there's a services grid, keep it but restyle the cards

SERVICE DETAIL PAGES (/services/[slug]):
- Keep all existing data fetching and routing logic
- Hero area: service title in DM Serif Display, 48px, green. Description in DM Sans below.
- Content sections: restyle to match the palette. Use ivory backgrounds, green headings, green-muted body text.
- Any existing CTAs: restyle to match the button system (filled green or outlined green, rounded-full)

CASE STUDIES OVERVIEW (/case-studies):
- Page heading: "OUR WORK" or whatever exists — restyle to DM Serif Display, green
- Case study cards: ivory bg, ivory-dark border, generous padding, hover lift
- Keep existing links and data connections

CASE STUDY DETAIL PAGES (/case-studies/[slug]):
- Keep all data and routing
- Restyle headings, body text, and any stat/metric displays to match the design system

CONTACT PAGE (/contact):
- Keep Cal.com embed and the Resend contact form COMPLETELY INTACT — do not modify form logic, validation, API routes, or submit handlers
- Restyle the visual wrapper: ivory background, green headings, green-muted labels
- Form inputs: ivory-dark bg, green border on focus, rounded-lg, DM Sans text
- Submit button: filled green, rounded-full, matches homepage CTA style
- If there's a Cal.com embed, keep its positioning but ensure the surrounding page matches the design system

DO NOT modify:
- Any data in lib/data.ts
- Any types in types/
- Any API routes (src/app/api/)
- Form submission logic
- Cal.com integration code
- Route params or dynamic routing

Run pnpm build after all changes. Zero errors.
```

**`/clear` and move to Session 8.**

---

## SESSION 8: Cleanup + Final Build Verification

```
Read the CLAUDE.md. Do a final audit of the entire codebase:

1. Search the entire src/ directory for any remaining references to old colours that aren't in the design system. Look for any hardcoded hex values that don't match the palette.

2. Search for any remaining GSAP imports or references. Remove them all and delete src/lib/gsap.ts if it exists.

3. Search for any 'Inter' or 'Instrument Sans' or 'Playfair Display' font references. Remove them — we only use DM Serif Display, DM Sans, and JetBrains Mono.

4. Check that all images in public/ are still referenced. Remove any unused image files.

5. Run pnpm build — must complete with zero errors and zero warnings that matter (Next.js image warnings are OK).

6. Run pnpm lint — fix any linting errors.

7. Report a summary of every file you changed during this session and what was fixed.
```

---

## SETUP (do this once before starting Session 1)

Run these commands on your Mac Mini terminal:

```bash
# Clone into your monorepo
cd ~/aygency
git clone https://github.com/wazzalouis/aygency-develop.git projects/aygency-site
cd projects/aygency-site

# Switch to pnpm
rm -f package-lock.json
pnpm install

# Create a working branch
git checkout -b design/migration-v2

# Install additional dependencies needed for the migration
pnpm add framer-motion three @react-three/fiber @react-three/drei
pnpm add -D @types/three

# Create Claude Code scaffolding
mkdir -p .claude/commands

# Copy the CLAUDE.md you got from this guide into the project root
# Copy the slash commands into .claude/commands/

# Verify everything works
pnpm build

# Start Claude Code
claude
```

Then start with Session 1.

---

## TIPS FOR EACH SESSION

- **Always start with `/clear`** between sessions. Fresh context = better output.
- **Use Plan Mode** (Shift+Tab x2) before the first prompt of complex sessions (1, 3, 4).
- **If Claude Code gets stuck or produces errors**, don't keep iterating in the same session. `/clear`, re-read CLAUDE.md, and retry with a more specific prompt.
- **After each session, commit your work:**
  ```bash
  git add -A
  git commit -m "design: [what this session did]"
  ```
- **If the 3D orb (Session 4) gives you trouble**, tell Claude Code to skip Three.js and use the CSS/SVG fallback. You can always add Three.js later. Don't let it block the whole migration.
- **For Session 7 (inner pages)**, if there are many pages, you can split it into multiple sub-sessions — one per page type. Just `/clear` between each.
