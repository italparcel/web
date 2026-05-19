# ItalParcel

Marketing site and inquiry form for **ItalParcel** — Italian parcel forwarding from Trento, worldwide.

Built with Next.js 16 (App Router), Tailwind v4, Framer Motion, react-hook-form + Zod, and Resend.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # then fill in RESEND_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable          | Required | Notes                                                           |
| ----------------- | -------- | --------------------------------------------------------------- |
| `RESEND_API_KEY`  | yes      | Without it, contact submissions log to stdout instead of email. |
| `CONTACT_EMAIL`   | no       | Defaults to `contact@italparcel.com`.                           |
| `FROM_EMAIL`      | no       | Defaults to Resend's `onboarding@resend.dev` for testing.       |

## Deploying to Netlify

The repo ships with `netlify.toml` and uses the official `@netlify/plugin-nextjs`.

1. Create a Netlify site connected to this repo.
2. In **Site settings → Environment variables**, set `RESEND_API_KEY` (and optionally `CONTACT_EMAIL`, `FROM_EMAIL`).
3. Deploy — Netlify detects the Next.js build automatically; the plugin handles SSR routes such as `/api/contact`.

The first deploy installs `@netlify/plugin-nextjs` automatically.

## Project layout

```
app/
  layout.tsx          # metadata, JSON-LD, viewport, theme color
  page.tsx            # home (sections orchestrated here)
  manifest.ts         # PWA manifest
  robots.ts           # robots.txt
  sitemap.ts          # sitemap.xml
  icon.png            # favicon / icon convention
  apple-icon.png      # iOS home-screen icon
  opengraph-image.png # 1200×630 OG/Twitter card
  api/contact/        # Resend-backed inquiry endpoint
components/           # Nav, Footer, sections, ui primitives
lib/                  # schema (zod), countries, faqs, whatsapp helpers
public/logo.png       # logotype used in Nav + Footer
```

## SEO

- Open Graph + Twitter card images via `app/opengraph-image.png`.
- JSON-LD `Organization`, `WebSite`, `Service` injected in `app/layout.tsx`.
- JSON-LD `FAQPage` injected in `app/page.tsx`.
- `robots.ts` and `sitemap.ts` emit `/robots.txt` and `/sitemap.xml`.
- `manifest.ts` exposes a PWA manifest at `/manifest.webmanifest`.
