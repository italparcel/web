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

## Fase 1 — Qualità del codice

### Stato TypeScript (positivo)

`strict: true` attivo. Nel codice applicativo: **0** `any`, **0** `@ts-ignore`/`@ts-expect-error`, **0** non-null assertion (`!`), nessun cast non sicuro (solo `as const`, narrowing legittimo di `unknown` nella route API e `e.target as Node`). Il boundary API server-side è validato con zod (`lib/schema.ts`) speculare alla validazione client. Qualità tipizzazione: ottima.

### Findings

#### QUAL-01 · **Alta** · Lint · `npm run lint` fallisce (6 errori react-hooks)

- **File:** `components/CookieBanner.tsx:38`, `components/ui/Combobox.tsx:54,82`, `components/sections/ContactForm.tsx:85-86`, `components/sections/HowItWorks.tsx:138`
- **Evidenza:** exit code 1 con 6 errori: `react-hooks/set-state-in-effect` (setState sincrono in effect: CookieBanner apertura banner, Combobox sync `query`/`highlight`), `react-hooks/refs` (scrittura ref durante il render nel pattern "latest ref" di TurnstileWidget), `react-hooks/immutability` (`tick` auto-referenziato nella sua `useCallback`). Più 5 warning (4 direttive `eslint-disable` inutilizzate, 1 `react-hooks/incompatible-library` su `watch()` di react-hook-form).
- **Impatto:** il gate di lint è rotto: qualsiasi CI che esegua `npm run lint` fallisce sempre, e i nuovi errori veri si perdono nel rumore. Il React Compiler salta la memoizzazione dei componenti segnalati (perf marginale). Severità alta come *process gate* pre-lancio, non come bug runtime: nessuno di questi errori causa malfunzionamenti visibili oggi.
- **Fix consigliato (S):** CookieBanner → inizializzare `open` in `useState(() => …)` lazy non è possibile (localStorage SSR-unsafe su prerender statico) ma si può derivare da un effect con `queueMicrotask`/subscription pattern oppure sopprimere consapevolmente; Combobox → spostare la sync di `query` in handler / `key` remount; TurnstileWidget → spostare l'aggiornamento dei ref in `useEffect`; HowItWorks → sostituire la self-reference con un ref alla funzione. Rimuovere le 4 direttive `eslint-disable` inutili.

#### QUAL-02 · Media · Struttura · Combobox e AddressCombobox duplicati al ~70%

- **File:** `components/ui/Combobox.tsx` (250 righe), `components/ui/AddressCombobox.tsx` (302 righe)
- **Evidenza:** logica identica per outside-click, navigazione tastiera (ArrowUp/Down/Enter/Escape/Tab), pulsante clear, rendering listbox ARIA, styling input. Differiscono solo per la sorgente dati (lista statica vs fetch Photon debounced).
- **Impatto:** ogni fix (es. a11y) va applicato due volte; drift già presente (Combobox ha `scrollHighlightIntoView`, AddressCombobox no).
- **Fix (M):** estrarre un hook `useComboboxNavigation` o un componente base con render-prop per la sorgente dati.

#### QUAL-03 · Bassa · Dead code

- **Evidenza:** `Button` variante `ghost` mai usata (`components/ui/Button.tsx:21`); prop `as` di `Reveal` mai usata (`components/ui/Reveal.tsx:11`); 4 direttive `eslint-disable react/no-danger` inutilizzate (`app/layout.tsx:202,207,212`, `app/page.tsx:40`). Dipendenze `package.json`: tutte effettivamente usate (verificato import per import).
- **Fix (S):** rimuovere.

#### QUAL-04 · Bassa · Anno copyright congelato alla build

- **File:** `components/sections/Footer.tsx:8`
- **Evidenza:** `const year = new Date().getFullYear()` in un server component prerenderizzato staticamente: l'anno è quello dell'ultima build, non della visita. Nessun hydration mismatch (RSC), ma a gennaio il footer resta sull'anno vecchio finché non si rideploya.
- **Fix (S):** accettabile per un sito rideployato spesso; altrimenti calcolare client-side o usare solo l'anno di costituzione.

#### QUAL-05 · Media · Architettura i18n: bilinguismo solo nelle pagine legali, via stato client

- **File:** `components/LegalLayout.tsx:16-17`, `components/legal/*.tsx`, `app/layout.tsx:167`
- **Evidenza:** nessun routing per locale. Home, nav, banner cookie, form e messaggi di errore sono solo in inglese. Le tre pagine legali hanno il toggle EN/IT come `useState` client: la versione italiana non ha URL proprio, non è nel sitemap, non è indicizzabile, e `<html lang="en">` resta invariato mentre si legge testo italiano.
- **Impatto:** (a) SEO: zero visibilità per query italiane (→ SEO-05); (b) a11y: screen reader pronuncia l'italiano con voce inglese (→ A11Y, Fase 7); (c) compliance: utenti italiani (regione con default consenso negato) ricevono banner cookie e form in inglese — non è una violazione GDPR di per sé (l'informativa completa esiste in italiano), ma è incoerente con un target IT; (d) il toggle non persiste tra pagine legali (si torna a EN a ogni navigazione).
- **Fix (L):** decisione di prodotto. Opzione minima (S): persistere la scelta lingua (localStorage/query param) e aggiornare `lang` sull'`<html>` o sul contenitore `<article lang="it">` quando si mostra l'italiano. Opzione completa: route `/it` con contenuti tradotti e hreflang (vedi SEO-05).

#### QUAL-06 · Bassa · Rischio hydration-mismatch con `useReducedMotion` nel primo render

- **File:** `components/sections/HowItWorks.tsx:97` (`if (reduce) return <Fallback/>` a livello top), `components/sections/Pricing.tsx:227` (`useState(reduce ? value : 0)`)
- **Evidenza:** `useReducedMotion` di framer-motion restituisce un valore diverso tra server (null) e client con `prefers-reduced-motion: reduce` attivo; nei due punti indicati il valore condiziona la **struttura** del primo render (albero completamente diverso in HowItWorks; testo `€0` vs `€17` in AnimatedPrice).
- **Impatto:** potenziale warning di hydration e re-render per utenti con reduced motion. Da verificare empiricamente in Fase 4 (emulazione `prefers-reduced-motion`).
- **Fix (S):** pattern standard: rendere sempre la stessa struttura al primo render e degradare le animazioni via prop/effect.

#### QUAL-07 · Bassa · Utility Tailwind in conflitto sul Button

- **File:** `components/ui/Button.tsx:66`
- **Evidenza:** `transition-colors transition-transform` — entrambe impostano `transition-property`; ne vince una sola (l'ultima in ordine CSS), quindi una delle due transizioni dichiarate non esiste.
- **Fix (S):** un'unica utility `transition-[color,background-color,border-color,transform]` o `transition`.

#### QUAL-08 · Bassa · Risposta fetch non tipizzata nel client

- **File:** `components/sections/ContactForm.tsx:194-195`
- **Evidenza:** `const body = await res.json().catch(() => ({}))` → `body` è `any`; `body.error` non è type-checked (unico punto `any`-like del progetto).
- **Fix (S):** tipizzare la shape `{ error?: string }`.

#### QUAL-09 · Bassa · Stringhe di classi lunghe ripetute

- **Evidenza:** lo stile "link sottolineato" (`font-medium text-fg underline underline-offset-2 hover:text-accent`) è ripetuto 8+ volte in `ContactForm.tsx` e altrove; i bottoni di `error.tsx`/`not-found.tsx` duplicano a mano gli stili di `Button` (perché `Button` è client e quelle pagine vogliono restare leggere).
- **Fix (S):** estrarre `<InlineLink>` e una classe condivisa per il bottone statico.

### Candidati contrasto colore (verifica strumentale in Fase 7)

| Combinazione | Dove | Stima ratio |
| --- | --- | --- |
| `text-bg/40` su `bg-fg` (#0b0f14) | `Marquee.tsx:49` (etichetta "Trento", 11px) | ~3.7:1 — sotto soglia AA testo piccolo |
| `text-fg-subtle/80` su `--bg` | `Hero.tsx:129` (label stat, 10px) | ~3.9:1 — sotto soglia |
| `text-white/50` su `#0a0f17` | `Pricing.tsx:183` (per-parcel, 12px) | ~4.9:1 — borderline |
| `placeholder:text-fg-subtle` su `bg-elev` | campi form | ~4.8:1 — borderline ok |

### Stati di errore/loading (verificati a codice)

- `POST /api/contact`: try/catch completo, status corretti (400/403/422/429/500/502), messaggi generici senza leak di stack o dettagli zod ✓
- ContactForm: stato `submitting` con spinner, errore con `role="alert"`, fallback WhatsApp se il backend fallisce ✓
- AddressCombobox: errore fetch degradato a "No matches. You can type the address manually." ✓ (l'input resta utilizzabile come testo libero)
- 404 (`app/not-found.tsx`) e error boundary (`app/error.tsx`) presenti e coerenti col design ✓

---
