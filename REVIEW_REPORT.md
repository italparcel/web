# REVIEW_REPORT — italparcel.com

> Audit completo (codice, sicurezza, consenso/tracking, funzionale, performance, SEO, accessibilità).
> Branch: `review/full-audit-20260702` · Avviato: 2026-07-02 · Stato: **in corso**
>
> Report incrementale: ogni fase aggiunge la propria sezione. La sintesi esecutiva e la
> checklist pre-lancio vengono finalizzate in Fase 8.

---

## Fase 0 — Baseline & ricognizione

### Stack rilevato

| Voce | Valore |
| --- | --- |
| Framework | Next.js **16.2.6** (App Router, build Turbopack) |
| React | 19.2.4 · TypeScript 5.9.3 (`strict: true`) |
| Styling | Tailwind CSS v4 (`@tailwindcss/postcss`), token in `app/globals.css` |
| Form | react-hook-form 7 + zod 4 (`lib/schema.ts`) |
| Email | Resend (`app/api/contact/route.ts`) |
| Animazioni | framer-motion 12 |
| Hosting | Netlify + `@netlify/plugin-nextjs`, `NODE_VERSION=20` (locale: Node v24.18.0) |
| Test | **Nessuna suite di test presente** (Playwright verrà aggiunto in Fase 4) |

### Mappa del repo

- **Route (tutte App Router):** `/` (home one-page: Hero, Marquee, HowItWorks, Features, Pricing, FAQ, ContactForm, Footer), `/privacy`, `/terms`, `/prohibited-items`, `not-found` (404), `error` (500 client), più `robots.txt`, `sitemap.xml`, `manifest.webmanifest` generati da `app/robots.ts`, `app/sitemap.ts`, `app/manifest.ts`.
- **API:** un solo endpoint — `POST /api/contact` (runtime nodejs; Resend + Turnstile + honeypot + throttle in-memory).
- **Rendering:** tutte le pagine **statiche** (prerender); solo `/api/contact` dinamica. Nessun middleware.
- **Componenti:** `components/sections/*` (sezioni home), `components/ui/*` (primitivi), `components/legal/*` (contenuti legali bilingui), `CookieBanner`, `Nav`, `WhatsAppFab`, `LegalLayout`.
- **Lib:** `consent.ts` (costanti Consent Mode), `schema.ts` (zod), `countries.ts`, `faqs.ts`, `whatsapp.ts`, `cn.ts`.
- **Config:** `next.config.ts` (minimale: `poweredByHeader: false`), `netlify.toml` (header di sicurezza + CSP + cache), `tsconfig.json` (strict), `eslint.config.mjs` (eslint-config-next core-web-vitals + TS). Non esistono `_headers`/`_redirects` separati (tutto in `netlify.toml`) → nessun conflitto di header.

### Script di terze parti / chiamate esterne

| Servizio | Dove | Note |
| --- | --- | --- |
| Google Ads gtag.js (`AW-18237016910`) | `app/layout.tsx` via `next/script` `afterInteractive` | Consent Mode v2 con default `denied` region-scoped (EEA+UK+CH, `lib/consent.ts`) |
| Cloudflare Turnstile | `components/sections/ContactForm.tsx` (script iniettato a mano) + verifica server in `app/api/contact/route.ts` | Renderizzato solo se `NEXT_PUBLIC_TURNSTILE_SITE_KEY` è definita |
| Photon (Komoot) | `components/ui/AddressCombobox.tsx` → `https://photon.komoot.io/api/` | Autocomplete indirizzi, keyless, citato nella privacy §5.2 |
| Google Fonts | `next/font/google` (Bricolage Grotesque, JetBrains Mono) | Self-hosted da next/font, `display: swap` |
| WhatsApp deep-link | `lib/whatsapp.ts`, `WhatsAppFab`, `Footer` | `wa.me/393293130206` |

### Variabili d'ambiente referenziate

| Variabile | Dove | Obbligatoria |
| --- | --- | --- |
| `RESEND_API_KEY` | `app/api/contact/route.ts:158` | Sì in produzione (senza → 500 e lead perso, loggato) |
| `TURNSTILE_SECRET_KEY` | `app/api/contact/route.ts:64` | **Sì in produzione** (senza → 500 sul form) |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | `components/sections/ContactForm.tsx:35` | Se assente il widget non si monta e il form invia senza captcha |
| `CONTACT_EMAIL` / `FROM_EMAIL` | `app/api/contact/route.ts:7-8` | No (default sensati) |

La build **non richiede** env var (tutte le pagine si prerenderizzano senza).

### Comandi eseguiti

| Comando | Esito |
| --- | --- |
| `npm ci` | OK — 367 pacchetti, 23s |
| `npm run build` | **OK** — compilazione 8.4s, 14/14 pagine statiche generate, nessun warning. Nota: Next 16/Turbopack non stampa più la tabella "First Load JS" → misurazione bundle rimandata alla Fase 5 con strumenti dedicati. |
| `npx tsc --noEmit` | **OK** — exit 0, zero errori |
| `npm run lint` | **FALLISCE** — 6 errori, 5 warning (regole react-hooks/React Compiler; dettaglio → finding QUAL-01) |
| `npm audit` | 2 vulnerabilità **moderate**: `postcss <8.5.10` (GHSA-qx2v-qp2m-jg93, XSS in output stringify) come dipendenza transitiva **bundled di next** stesso. Triage: postcss è usato solo a build-time su CSS di prima parte → **non sfruttabile a runtime** in questo progetto. Il "fix" proposto da npm (downgrade a next 9!) è ovviamente da ignorare; si risolve col prossimo upgrade di Next. Rilevanza: bassa/informativa (DEP-01). |

### Osservazioni chiave emerse in ricognizione (approfondite nelle fasi successive)

1. **Il sito NON è bilingue nel senso atteso dal brief.** Non esiste routing per locale (`/it/...`): home, banner cookie, form e meta sono solo in inglese con `<html lang="en">`. Solo le tre pagine legali hanno un toggle EN/IT **client-side** (stato React in `LegalLayout`), quindi la versione italiana non è indicizzabile né linkabile e `lang` resta `en` anche mostrando testo italiano. → finding in Fase 1 (i18n), Fase 6 (SEO/hreflang) e Fase 7 (a11y).
2. **Rate limiting:** contrariamente al brief ("deliberately deferred"), esiste già un throttle per-IP in-memory in `app/api/contact/route.ts:14-16` (5 req/60s), con limite dichiarato nel commento: non condiviso tra istanze serverless e azzerato a cold start. La proposta con store condiviso resta da produrre in Fase 2.
3. **Anti-abuso form già presente:** honeypot (`company`), Cloudflare Turnstile obbligatorio in produzione, validazione zod server-side speculare al client, sanificazione header-injection (`oneLine`) ed escape HTML nell'email.
4. **Documentazione env incompleta:** il README non menziona `TURNSTILE_SECRET_KEY` né `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (obbligatorie in produzione) e rimanda a un file `.env.local.example` **che non esiste nel repo**. → finding.
5. **Consent Mode v2:** default `denied` impostato nello stesso inline script del tag (ordine dataLayer corretto: default → update → config), ma con scoping regionale: fuori da EEA+UK+CH il default è di fatto "granted". Comportamento reale da verificare in browser in Fase 3.
6. **Conversione Google Ads:** un solo evento (`send_to: AW-18237016910/CtkVCL-UwsYcEM6Wi_hD`) sparato in `ContactForm.onSubmit` solo dopo `res.ok`; enhanced conversions via `gtag('set','user_data',…)` condizionata al consenso. Verifiche di double-fire e ordering in Fase 3.

---
