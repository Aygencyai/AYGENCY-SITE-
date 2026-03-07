# Aygency — AI Agency Website

The public website for aygency.ai — we design, build, and deploy custom AI agent systems for businesses.

## What This Project Is

A Next.js 14 (App Router) website that is undergoing a **design migration**. The backend logic, routing, data structures, API integrations, and page architecture are solid and must be preserved. The visual layer (colours, typography, component styling, animations, layout aesthetics) is being completely reworked to match a premium editorial design system.

**DO NOT break existing functionality.** Every change is cosmetic/presentational unless explicitly told otherwise. If you're unsure whether something is functional or cosmetic, ask before changing it.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + CSS custom properties in globals.css
- **Animations:** Framer Motion (primary) — GSAP is being phased out, do not add new GSAP code
- **3D:** Three.js + @react-three/fiber + @react-three/drei (for homepage orb only)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Fonts:** DM Serif Display (headings), DM Sans (body/UI), JetBrains Mono (technical accents) — loaded via next/font/google
- **Package manager:** pnpm (do NOT use npm or yarn)
- **Deployment:** Vercel

## Commands

- `pnpm dev` — start dev server
- `pnpm build` — production build (run after every significant change)
- `pnpm lint` — run linter

## Design System — The Rules

These are non-negotiable. Every component must follow these exactly.

### Colour Palette

| Token | Hex | Tailwind Class | Usage |
|-------|-----|----------------|-------|
| ivory | #F5F1EB | bg-ivory, text-ivory | Primary background (70%+ of visible page) |
| ivory-dark | #EBE5DB | bg-ivory-dark | Borders, subtle separators, hover states |
| green (wimbledon) | #1B3A2D | bg-green, text-green | Filled buttons, headings, nav accent, wireframes |
| green-light | #2D5E45 | bg-green-light | Hover states on green elements |
| green-muted | #4A7A62 | text-green-muted | Body text on light backgrounds |
| navy | #1A2744 | bg-navy | Footer background, deep contrast sections only |
| blue (futuristic) | #5BA4C9 | text-blue | Glowing particles, subtle tech highlights ONLY |
| blue-light | #8DC4DE | — | Glow effects only, never backgrounds |
| near-black | #141C15 | text-near-black | Darkest text, high contrast |
| white (warm) | #FAFAF8 | text-white | Text on dark backgrounds |
| muted | #8A8A80 | text-muted | Captions, counters, secondary info |

**Critical rules:**
- Ivory is dominant — 70%+ of the visible page must be ivory/cream
- Blue is MINIMAL — only particles and tiny tech accents. Never backgrounds or large areas.
- Navy appears ONLY in footer or deep contrast sections
- Never use pure white (#FFFFFF) or pure black (#000000)

### Typography

| Element | Font | Size | Weight | Line Height | Colour | Transform |
|---------|------|------|--------|-------------|--------|-----------|
| Hero heading | DM Serif Display | 80px (5rem) | 400 | 0.95 | green | uppercase |
| Section heading | DM Serif Display | 48px (3rem) | 400 | 1.1 | green | uppercase |
| Subheading | DM Sans | 20px | 500 | 1.4 | green-muted | — |
| Body | DM Sans | 16px | 400 | 1.6 | green-muted | — |
| Caption | DM Sans | 12px | 400 | 1.4 | muted | — |
| Nav links | DM Sans | 13px | 500 | — | green | uppercase, tracking 0.12em |
| Button text | DM Sans | 13px | 600 | — | — | uppercase, tracking 0.15em |
| Mono accents | JetBrains Mono | 12px | 400 | — | muted | — |

### Button Styles

- **Primary (filled):** bg-green, text-white, rounded-full, px-8 py-3, uppercase, tracked
- **Secondary (outlined):** border border-green, bg-transparent, text-green, rounded-full, px-8 py-3, uppercase, tracked
- **CTA on dark bg:** bg-white, text-green, rounded-full

### Animation Conventions

- All scroll animations: Framer Motion `useInView` with `once: true`
- Stagger pattern: 100ms between sibling elements
- Hero load: staggered word-by-word fade-up (200ms between words)
- Standard entrance: `y: 20, opacity: 0` → `y: 0, opacity: 1`, duration 0.6s, ease "easeOut"
- Hover on cards: `translateY(-4px)` with subtle shadow deepening

## Architecture

```
src/
├── app/                     # Next.js App Router pages
│   ├── layout.tsx           # Root layout — fonts, metadata, global providers
│   ├── page.tsx             # Homepage — assembles all homepage sections
│   ├── globals.css          # Tailwind directives + CSS custom properties
│   ├── services/            # Services overview + detail pages (KEEP LOGIC)
│   ├── case-studies/        # Case studies overview + detail (KEEP LOGIC)
│   └── contact/             # Contact page — Cal.com + Resend form (KEEP LOGIC)
├── components/
│   ├── layout/              # Navbar, Footer (restyle, keep nav structure)
│   ├── home/                # Homepage sections (Hero, OrbScene, Services, Stats, HowItWorks, CTABanner)
│   └── ui/                  # Reusable UI components (buttons, cards, etc.)
├── lib/
│   ├── data.ts              # Services, case studies, process data (DO NOT MODIFY)
│   ├── utils.ts             # Utility functions (cn helper etc.)
│   └── gsap.ts              # DEPRECATED — do not use, being removed
└── types/                   # TypeScript type definitions (DO NOT MODIFY)
```

## Gotchas

- `lib/data.ts` contains all content data — services, case studies, process steps. Do NOT modify this unless specifically asked. Components should consume this data, not duplicate it.
- `types/` has the TypeScript interfaces. Do NOT change these.
- The contact page uses Resend for email and Cal.com for booking. The API route and form logic must be preserved exactly.
- Old GSAP imports exist in some files — remove them when you touch those files, replace animations with Framer Motion equivalents.
- The site uses `next/font/google` for font loading — do NOT use `<link>` tags or `@import` for Google Fonts.
- Three.js is used ONLY for the homepage 3D orb (`OrbScene.tsx`). Do not add Three.js to any other page.

## Environment Variables

| Variable | Purpose |
|----------|---------|
| NEXT_PUBLIC_CAL_URL | Cal.com booking link |
| RESEND_API_KEY | Resend API for contact form |
| CONTACT_EMAIL | Recipient for contact form |

## Verification

After any change, always run:
```bash
pnpm build
```
Zero errors = good. If build fails, fix before moving on.

For visual changes, check at these breakpoints: 1440px, 1024px, 768px, 375px.
