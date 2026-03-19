Run the full verification checklist:

1. Run `pnpm build` — report if it passes or fails. If it fails, show the errors.
2. Run `pnpm lint` — report any linting issues.
3. Search the entire src/ directory for:
   - Any GSAP imports (should be zero)
   - Any hardcoded hex colours not in the palette (#0A0A0F, #111118, #16161F, #1E1E2A, #00E5FF, #00B8CC, #006B7A, #EAEAF0, #9B9BAE, #5C5C72, #F8F8FC, #FF4D6A)
   - Any font references that aren't Space Grotesk, DM Sans, or JetBrains Mono
   - Any uses of pure white (#FFFFFF, #FFF, white where it should be #F8F8FC) or pure black (#000000, #000, black where it should be #0A0A0F)
4. List any TypeScript errors or type mismatches.

Report a pass/fail summary for each check.
