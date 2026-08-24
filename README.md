# Aygency

AI agency website for [aygency.ai](https://aygency.ai) — we design, build, and deploy custom AI agent systems for businesses.

## Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS + CSS custom properties
- **Animations:** Framer Motion
- **3D:** Three.js + @react-three/fiber + @react-three/drei + @react-three/postprocessing
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Fonts:** Space Grotesk (headings), DM Sans (body/UI), JetBrains Mono (mono accents) — via next/font/google

## Getting Started

```bash
# Install dependencies
pnpm install

# Copy environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_CAL_URL` | Cal.com scheduling link URL |
| `RESEND_API_KEY` | Resend API key for contact form emails |
| `CONTACT_EMAIL` | Recipient email for contact form |
| `EDEN_CRM_ENDPOINT_URL` | Server-only HTTPS endpoint for the approved `EdenApplicationSubmitted.v1` CRM event |
| `EDEN_CRM_API_TOKEN` | Server-only, write-only bearer token for the CRM endpoint; never use a database service-role credential |
| `EDEN_ALLOWED_ORIGINS` | Optional comma-separated exact HTTPS origins for controlled previews |
| `EDEN_NOTIFICATION_EMAIL` | Optional Resend notification recipient; falls back to `CONTACT_EMAIL` |
| `EDEN_NOTIFICATION_FROM` | Optional verified sender for Eden application notifications |

The Eden AI personal assistant flow posts only to Aygency's same-origin API.
CRM credentials must never use a `NEXT_PUBLIC_` prefix or be exposed to the
browser. The CRM is the application system of record; Resend is notification
only.

Without `EDEN_CRM_ENDPOINT_URL` and `EDEN_CRM_API_TOKEN`, local development
can show an explicitly labelled Eden Blueprint preview, but the submission is
not stored. A real recorded result requires the approved CRM environment and a
controlled end-to-end smoke submission.

## Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── services/         # Services overview + detail pages
│   ├── use-cases/        # Use cases overview + detail pages
│   ├── contact/          # Contact page with Cal.com + form
│   └── globals.css       # Design tokens + global styles (dark theme)
├── components/
│   ├── home/             # Homepage section components
│   ├── layout/           # Nav + Footer
│   ├── effects/          # Visual effects (GlowOrb, TypewriterText, etc.)
│   └── ui/               # Reusable UI components
├── lib/
│   ├── data.ts           # Services, use cases, process data
│   ├── letter-grids.ts   # 3D letter A/Y grid data
│   ├── animations.ts     # Shared animation variants
│   └── utils.ts          # Utility functions (cn)
└── types/                # TypeScript type definitions
```

## Deploy

Build for production:

```bash
pnpm build
```

Deploy to Vercel:

1. Push to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Set the environment variables listed above for the routes being deployed
4. Deploy — Vercel auto-detects Next.js

## License

Private — all rights reserved.
