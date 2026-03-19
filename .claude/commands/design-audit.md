Audit the file or component I just mentioned (or the last file I edited) against the design system defined in CLAUDE.md.

Check for:
1. **Colours:** Any hex values that don't match the palette? Any pure white (#FFFFFF) or pure black (#000000)? Any blue (#5BA4C9) used outside of particles/tiny accents?
2. **Typography:** All headings using Space Grotesk? All body text using DM Sans? Correct sizes and weights per the type scale in CLAUDE.md?
3. **Spacing:** Consistent padding/margins? Using Tailwind spacing scale?
4. **Buttons:** Following the button style spec (filled green or outlined green, rounded-full, uppercase, tracked)?
5. **Animations:** Using Framer Motion (not GSAP)? Scroll animations using useInView with once: true?
6. **Responsive:** Any fixed widths that would break on mobile? Proper breakpoint handling?

Report each issue found with the specific line and what it should be changed to.
