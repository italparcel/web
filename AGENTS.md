<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Security headers live in next.config.ts — never in netlify.toml

The Netlify Next.js runtime applies `netlify.toml [[headers]]` only to static
CDN assets; they NEVER reach HTML or API responses (verified in production,
2026-07-02). All security headers, CSP included, are set in `next.config.ts`
`headers()`; netlify.toml keeps only static-asset cache-control rules. The CSP
currently ships as `Content-Security-Policy-Report-Only`; flipping it to
enforcing is a deliberate one-line key rename after deploy-preview validation.

# Commands

- Type-check: `npx tsc --noEmit`
- Lint: `npm run lint` — must exit 0; the Netlify build command runs it
  deploy-blocking before `next build`
- Build: `npm run build`
- Local prod check: `npm run build && npx next start` (port 3000)

# Conventions

- One commit per audit/review finding ID: `fix(<ID>): <summary>` (or
  `chore(...)` for hygiene work); the body states what changed, why, and any
  residual risk.
- Deliberate choices — do not "fix" these:
  - the inline gtag script in `app/layout.tsx` queues the consent default
    BEFORE `gtag('config')`; that ordering is load-bearing for Consent Mode v2;
  - the Google Ads conversion fires only after confirmed backend success, and
    enhanced conversions (`user_data`) are consent-gated;
  - `'unsafe-inline'` stays in `script-src` — a nonce CSP would force dynamic
    rendering of intentionally static pages;
  - `escapeHtml`/`oneLine` hardening in `app/api/contact/route.ts`;
  - terms anchor ids (`sec-N`, `sec-N-M`) — linked from the form's
    art. 1341/1342 checkboxes and the FAQ.
