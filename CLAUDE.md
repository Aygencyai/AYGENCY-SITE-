# Aygency — AI Agency Website

The public website for aygency.ai — we design, build, and deploy custom AI agent systems for businesses.

## What This Project Is

A Next.js 14 (App Router) website that is undergoing a **design migration**. The backend logic, routing, data structures, API integrations, and page architecture are solid and must be preserved. The visual layer (colours, typography, component styling, animations, layout aesthetics) is being completely reworked to match a premium editorial design system.

**DO NOT break existing functionality.** Every change is cosmetic/presentational unless explicitly told otherwise. If you're unsure whether something is functional or cosmetic, ask before changing it.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + CSS custom properties in globals.css
- **Animations:** Framer Motion — do not introduce GSAP or any other animation library
- **3D:** Three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing (homepage 3D letter animation only)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Fonts:** Space Grotesk (headings), DM Sans (body/UI), JetBrains Mono (technical accents) — loaded via next/font/google
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
| void | #0A0A0F | bg-void | Primary dark background (dominant) |
| void-light | #111118 | bg-void-light | Slightly lighter dark bg |
| surface | #16161F | bg-surface | Card/section backgrounds |
| surface-light | #1E1E2A | bg-surface-light | Lighter surface variant |
| cyan | #00E5FF | bg-cyan, text-cyan | Primary accent — CTAs, highlights, tech accents |
| cyan-muted | #00B8CC | text-cyan-muted | Secondary cyan |
| cyan-dim | #006B7A | text-cyan-dim | Subtle cyan accents |
| ghost | #EAEAF0 | text-ghost | Headings, bright text on dark backgrounds |
| ghost-muted | #9B9BAE | text-ghost-muted | Body text, descriptions |
| ghost-dim | #5C5C72 | text-ghost-dim | Tertiary/subtle text |
| white | #F8F8FC | text-white | Brightest text (use sparingly) |
| error | #FF4D6A | text-error | Error states, contrast accent on comparison cards |

**Critical rules:**
- Void (#0A0A0F) is the dominant background — dark theme throughout
- Cyan (#00E5FF) is the primary accent — buttons, highlights, tech details. Use deliberately, not everywhere.
- Surface (#16161F) for card backgrounds and alternating sections
- Never use pure white (#FFFFFF) or pure black (#000000)
- Ghost (#EAEAF0) for headings, ghost-muted (#9B9BAE) for body text

### Typography

| Element | Font | Size | Weight | Line Height | Colour | Transform |
|---------|------|------|--------|-------------|--------|-----------|
| Hero heading | Space Grotesk | 68px (lg) / 48px (sm) / 28px (mobile) | 700 | 0.95 | white | uppercase |
| Section heading | Space Grotesk | 48px (3rem) | 600 | 1.1 | ghost | uppercase |
| Subheading | DM Sans | 20px | 500 | 1.4 | ghost-muted | — |
| Body | DM Sans | 16px | 400 | 1.6 | ghost-muted | — |
| Caption | DM Sans | 12px | 400 | 1.4 | ghost-dim | — |
| Nav links | DM Sans | 13px | 500 | — | ghost | uppercase, tracking 0.12em |
| Button text | Space Grotesk | 13px | 600 | — | — | uppercase, tracking 0.15em |
| Mono accents | JetBrains Mono | 12px | 400 | — | cyan or ghost-dim | uppercase, tracking 0.2em |

### Button Styles

- **Primary (filled):** bg-cyan, text-void, rounded-lg, px-8 py-3, uppercase, tracked, font-heading
- **Secondary (outlined):** border border-cyan/30, bg-transparent, text-cyan, rounded-lg, px-8 py-3, uppercase, tracked
- **CTA on dark bg:** bg-cyan, text-void, rounded-lg, with hover:brightness-110 and shadow-glow-sm

### Animation Conventions

- All scroll animations: Framer Motion `useInView` or `whileInView` with `once: true`
- Easing: `[0.16, 1, 0.3, 1]` (custom cubic-bezier) for entrances
- Stagger pattern: 100-120ms between sibling elements
- Hero load: staggered word-by-word fade-up, then typewriter subtext at 1800ms delay
- Standard entrance: `y: 20, opacity: 0` → `y: 0, opacity: 1`, duration 0.7s
- Hover on cards: scale or translateY with subtle glow
- 3D letter animation: block-grid A↔Y morph cycle with Three.js RoundedBox meshes

## Architecture

```
src/
├── app/                     # Next.js App Router pages
│   ├── layout.tsx           # Root layout — fonts, metadata, global providers
│   ├── page.tsx             # Homepage — assembles all homepage sections
│   ├── globals.css          # Tailwind directives + CSS custom properties (dark theme)
│   ├── icon.svg             # SVG favicon (block-grid A letter)
│   ├── test-letter/         # Dev-only test page for 3D letter animation
│   ├── services/            # Services overview + detail pages (KEEP LOGIC)
│   ├── use-cases/           # Use cases overview + detail (KEEP LOGIC)
│   └── contact/             # Contact page — Cal.com + Resend form (KEEP LOGIC)
├── components/
│   ├── layout/              # Nav, Footer
│   ├── home/                # Homepage sections (Hero, HeroBackground, LetterBlocks, LetterScene, LetterSceneLoader, Services, CEOAgent, HowItWorks, WhyAygency, DataSecurity, CTABanner, SocialProofStrip, Stats, etc.)
│   ├── effects/             # Visual effects (GlowOrb, TypewriterText, TextScramble, AnimatedGrid, CursorFollower, SectionDivider)
│   └── ui/                  # Reusable UI components (GlassCard, MagneticButton, BlockLetter, TiltCard, etc.)
├── lib/
│   ├── data.ts              # Services, use cases, process data (DO NOT MODIFY)
│   ├── utils.ts             # Utility functions (cn helper etc.)
│   ├── letter-grids.ts      # 3D letter A/Y grid coordinates and block definitions
│   └── animations.ts        # Shared animation variants
└── types/                   # TypeScript type definitions (DO NOT MODIFY)
```

## Gotchas

- `lib/data.ts` contains all content data — services, use cases, process steps. Do NOT modify this unless specifically asked. Components should consume this data, not duplicate it.
- `types/` has the TypeScript interfaces. Do NOT change these.
- The contact page uses Resend for email and Cal.com for booking. The API route and form logic must be preserved exactly.
- The site uses `next/font/google` for font loading — do NOT use `<link>` tags or `@import` for Google Fonts.
- The heading font is Space Grotesk (not DM Serif Display). The design was migrated from an ivory/green editorial theme to a dark void/cyan tech aesthetic.
- Three.js is used ONLY for the homepage 3D A↔Y letter animation (`LetterScene.tsx` + `LetterBlocks.tsx`). Do not add Three.js to any other page. The old `OrbScene.tsx` was removed for performance.
- `LetterScene.tsx` defaults `isMobile` to `true` (not `false`) to prevent bloom post-processing from flashing on mobile before the window size check runs.
- `TypewriterText.tsx` uses IntersectionObserver with `margin: "-80px 0px"` — the vertical-only margin is intentional. Using just `"-80px"` shrinks the observation zone horizontally and breaks detection on narrow elements.
- `GlowOrb.tsx` is a static CSS blur effect with no scroll parallax. The `parallaxStrength` prop exists in the interface for backward compatibility but is unused.
- GSAP has been fully removed from the codebase. Do not re-introduce it.

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
