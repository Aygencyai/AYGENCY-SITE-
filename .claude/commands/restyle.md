Restyle the component or page I specify to match the Aygency design system from CLAUDE.md.

Rules:
- KEEP all existing logic: data fetching, routing, form handling, API calls, state management, event handlers
- ONLY change: colours, fonts, spacing, borders, shadows, border-radius, animations, layout (flex/grid adjustments)
- Replace any old colour values with the design system palette
- Replace any old font references with DM Serif Display (headings) or DM Sans (everything else)
- Replace any GSAP animations with Framer Motion equivalents
- Ensure the component is responsive (check 1440px, 1024px, 768px, 375px)
- Background should be ivory (#F5F1EB) unless it's a dark section (CTA = green, footer = navy)

After restyling, run pnpm build to confirm zero errors.

Tell me which file to restyle.
