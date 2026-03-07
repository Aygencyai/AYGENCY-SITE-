Run the full verification checklist:

1. Run `pnpm build` — report if it passes or fails. If it fails, show the errors.
2. Run `pnpm lint` — report any linting issues.
3. Search the entire src/ directory for:
   - Any GSAP imports (should be zero)
   - Any hardcoded hex colours not in the palette (#F5F1EB, #EBE5DB, #1B3A2D, #2D5E45, #4A7A62, #1A2744, #5BA4C9, #8DC4DE, #141C15, #FAFAF8, #8A8A80, #F0EDE5)
   - Any font references that aren't DM Serif Display, DM Sans, or JetBrains Mono
   - Any uses of pure white (#FFFFFF, #FFF, white where it should be #FAFAF8) or pure black (#000000, #000, black where it should be #141C15)
4. List any TypeScript errors or type mismatches.

Report a pass/fail summary for each check.
