# Aygency

AI agency website for [aygency.ai](https://aygency.ai) — we design, build, and deploy custom AI agent systems for businesses.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + CSS custom properties
- **Animations:** Framer Motion + GSAP (ScrollTrigger)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Fonts:** Google Fonts via `next/font` (Instrument Sans, Inter, Playfair Display)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_CAL_URL` | Cal.com scheduling link URL |
| `RESEND_API_KEY` | Resend API key for contact form emails |
| `CONTACT_EMAIL` | Recipient email for contact form |

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── services/         # Services overview + detail pages
│   ├── case-studies/     # Case studies overview + detail pages
│   ├── contact/          # Contact page with Cal.com + form
│   └── globals.css       # Design tokens + global styles
├── components/
│   ├── home/             # Homepage section components
│   ├── layout/           # Nav + Footer
│   └── ui/               # Reusable UI components
├── lib/
│   ├── data.ts           # Services, case studies, process data
│   ├── gsap.ts           # GSAP + ScrollTrigger setup
│   └── utils.ts          # Utility functions (cn)
└── types/                # TypeScript type definitions
```

## Deploy

Build for production:

```bash
npm run build
npm start
```

Deploy to Vercel:

1. Push to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Set environment variables (`NEXT_PUBLIC_CAL_URL`, `RESEND_API_KEY`, `CONTACT_EMAIL`)
4. Deploy — Vercel auto-detects Next.js

Or via CLI:

```bash
npx vercel --prod
```

## License

Private — all rights reserved.
