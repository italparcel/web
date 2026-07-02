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

## Fase 2 — Audit di sicurezza

### Header HTTP (unica fonte: `netlify.toml` — nessun conflitto con `next.config.ts`, che non imposta header)

| Header | Valore | Giudizio |
| --- | --- | --- |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` | ✓ (manca `preload` — opzionale, SEC-05) |
| `X-Content-Type-Options` | `nosniff` | ✓ |
| `X-Frame-Options` / `frame-ancestors` | `SAMEORIGIN` + `frame-ancestors 'self'` | ✓ coerenti |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | ⚠ in conflitto col meta della pagina (SEC-04) |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` | ✓ |
| Cache | `_next/static/*` immutable 1y; `logo.png` 7d | ✓ |

**CSP analizzata** (`netlify.toml:26`): presenti e corrette `default-src 'self'`, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'self'`, `worker-src 'self' blob:'`. Niente wildcard. Niente `unsafe-eval`. Allowlist di terze parti minimale e motivata nel commento (Turnstile, Photon, domini Google per gtag/Consent Mode). Due rilievi: SEC-01 (`unsafe-inline` negli script) e la verifica empirica dei domini Google effettivamente contattati (rimandata alla Fase 3: il build locale non applica la CSP di Netlify, quindi catturo i domini reali e li confronto con l'allowlist — attenzione in particolare ai ping di conversione verso domini country-specific tipo `www.google.it`, non in allowlist).

### Endpoint API — `POST /api/contact` (unico endpoint)

| Aspetto | Stato |
| --- | --- |
| Metodi HTTP | Solo `POST` esportato; App Router restituisce 405 per gli altri (verifica runtime in Fase 4) |
| Validazione input | zod server-side (`contactSchema`), limiti di lunghezza per ogni campo, enum vincolati ✓ |
| Auth | N/A (endpoint pubblico by design) |
| CORS | Nessun header CORS → il browser blocca letture cross-origin; nessun cookie/sessione → niente CSRF classico ✓ |
| Error leakage | Messaggi generici, dettagli zod non riecheggiati, stack solo su console server ✓ |
| Email injection | `oneLine()` collassa CR/LF nei campi single-line, subject troncato a 100 char, HTML escapato, `replyTo` validato da zod ✓ — difese complete |
| Anti-bot | Honeypot `company` (accetta con 200 senza inviare) + Turnstile obbligatorio in produzione (fail-closed) + throttle IP ✓ |

### Findings

#### SEC-01 · Media · CSP · `'unsafe-inline'` in `script-src` senza nonce/hash

- **File:** `netlify.toml:26`
- **Evidenza:** `script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com`.
- **Impatto:** la CSP non mitiga l'iniezione di script inline — è una difesa in profondità indebolita, non una vulnerabilità attiva: il sito non ha contenuti user-generated né parametri riflessi (verificato: zero `useSearchParams`/reflection, `dangerouslySetInnerHTML` solo su 4 blob JSON-LD statici). Il commento nel file documenta il perché (script inline di idratazione Next + consent snippet). Con pagine completamente statiche i nonce non sono praticabili (richiedono rendering dinamico); gli hash sono possibili ma fragili ad ogni build.
- **Fix (M, post-lancio):** valutare `strict-dynamic` + hash generati in build, o spostare il consent snippet in file esterno. Non bloccante per il lancio.

#### SEC-02 · **Alta** · Rate limiting · chiave `x-forwarded-for` falsificabile + store in-memory per-istanza

- **File:** `app/api/contact/route.ts:46-49,54,251-265`
- **Evidenza:** `request.headers.get("x-forwarded-for")?.split(",")[0]` usa il valore **più a sinistra** dell'XFF, che è controllabile dal client (i proxy *appendono*, non sovrascrivono): basta inviare `X-Forwarded-For: <ip-casuale>` per ottenere una chiave nuova a ogni richiesta e azzerare il throttle. Inoltre lo store è una `Map` in-memory: su Netlify Functions vale solo per la singola istanza calda e si azzera a ogni cold start (limite già dichiarato nel commento del codice).
- **Impatto:** il throttle attuale ferma solo il flood ingenuo. La vera barriera anti-spam resta Turnstile (robusta). Scenario residuo di abuso: flood di richieste che superano Turnstile no, ma ogni richiesta con token invalido costa comunque una chiamata `siteverify` (latenza/banda) e un'iterazione; con honeypot+Turnstile il rischio di spam email vero è basso. Severità alta principalmente perché il brief la considera un gap di lancio e il fix è piccolo.
- **Fix (S):** su Netlify usare l'header **`x-nf-client-connection-ip`** (impostato dalla piattaforma, non falsificabile) come chiave; per lo store condiviso vedi il piano sotto.

#### SEC-03 · Bassa · Nessun limite dimensione body su `/api/contact`

- **Evidenza:** `await request.json()` senza guardia su `Content-Length`; il parsing avviene prima di honeypot/validazione. Il cap effettivo è quello della piattaforma Netlify (~6 MB).
- **Impatto:** micro-DoS (CPU/memoria per parse di payload grossi). Basso.
- **Fix (S):** rifiutare `Content-Length > 10_000` con 413 prima di `request.json()`.

#### SEC-04 · Bassa · Referrer-Policy incoerente tra header e meta

- **File:** `netlify.toml:17` (`strict-origin-when-cross-origin`) vs `app/layout.tsx:84` (`referrer: "origin-when-cross-origin"`)
- **Impatto:** il meta della pagina vince per le richieste avviate dal documento; `origin-when-cross-origin` invia l'origin anche su downgrade HTTPS→HTTP. Differenza marginale ma incoerenza inutile.
- **Fix (S):** rimuovere `referrer` dal metadata o allinearlo a `strict-origin-when-cross-origin`.

#### SEC-05 · Bassa · HSTS senza `preload`

- **Fix (S, opzionale):** aggiungere `; preload` e registrare su hstspreload.org quando si è sicuri di HTTPS-only permanente su tutti i sottodomini.

#### SEC-06 · Nota (decisione di business) · Turnstile fail-closed

- **Evidenza:** `app/api/contact/route.ts:70-87` — se `siteverify` di Cloudflare è irraggiungibile o in errore, la richiesta viene respinta con 403; se `TURNSTILE_SECRET_KEY` manca in produzione, tutte le submission ricevono 500.
- **Impatto:** un'indisponibilità di Cloudflare = zero lead finché dura (con campagna Ads attiva = spesa senza conversioni). Fail-closed è la scelta più sicura contro lo spam; va solo decisa consapevolmente. Alternativa: fail-open temporaneo con honeypot+rate-limit se `siteverify` va in timeout (non se il token è invalido).
- **Pre-lancio:** verificare che `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY` e `RESEND_API_KEY` siano configurate su Netlify (il codice fallisce in modo rumoroso ma il lead è comunque perso).

#### SEC-07 · Bassa · Nessuna verifica `Origin` sul POST

- **Evidenza:** l'endpoint accetta POST da qualsiasi origine (nessun check su `Origin`/`Referer`). Non è una vulnerabilità (niente sessione da rubare, Turnstile gate) ma un check `Origin === https://italparcel.com` è una cintura di sicurezza gratuita contro submission scriptate da altri siti.
- **Fix (S).**

#### DEP-01 · Bassa · npm audit: 2 moderate (postcss transitivo in next)

- Già triagiato in Fase 0: build-time only, non sfruttabile. Si chiude col prossimo upgrade di Next. Nessun pacchetto abbandonato tra le dipendenze dirette (tutte attivamente mantenute).

#### SEC-08 · Info · Scansione segreti: pulita

- Working tree: nessun pattern di chiave (Resend `re_…`, AWS, GitHub, Google API, PEM) in alcun file.
- **Storia git completa (72 commit):** nessun file `.env*`/chiave mai committato; grep dei pattern su tutti i blob storici → zero match.
- `.gitignore` copre `.env*` ✓. Unica `NEXT_PUBLIC_*` è la site key Turnstile, pubblica by design ✓.

### Piano di rate limiting (gap noto — proposta, da NON implementare in questa fase)

**Superficie:** un solo endpoint mutante/pubblico, `POST /api/contact`.

| Endpoint | Costo per abuso | Protezioni attuali | Rischio residuo |
| --- | --- | --- | --- |
| `POST /api/contact` | invio email (quota/costo Resend, flooding inbox `contact@`), 1 chiamata `siteverify` per tentativo | Turnstile (forte), honeypot, throttle in-memory 5/min/IP (debole: SEC-02) | flood con token invalidi → latenza/rumore; spam reale solo se Turnstile viene battuto |
| Photon (`photon.komoot.io`) | chiamato **direttamente dal browser** dell'utente — non transita dai nostri server | debounce 320ms client | nullo per la nostra infrastruttura (rate limit a carico di Komoot) |
| Pagine statiche | CDN Netlify | — | nullo |

**Proposta (compatibile Netlify + Next 16, effort S ≈ 1-2h):**

1. **Store condiviso:** Upstash Redis (REST, serverless-friendly; free tier 500k comandi/mese ≫ necessità) + `@upstash/ratelimit`.
2. **Chiave:** `request.headers.get("x-nf-client-connection-ip")` (trusted su Netlify), fallback all'ultimo hop di XFF.
3. **Limiti suggeriti per `/api/contact`:**
   - per-IP: sliding window **5 richieste / 60 s** (come oggi) **+ 20 / 24 h** (blocca lo spam lento);
   - globale (tutte le IP): **fixed window 200 / 24 h** come circuit-breaker sulla quota Resend contro flood distribuiti — al superamento, 429 e alert via log.
4. **Posizione codice:** nuovo `lib/rate-limit.ts` (client Upstash + i tre limiter); in `app/api/contact/route.ts` sostituire `rateLimited()` con il check condiviso, **prima** di `siteverify`.
5. **Degradazione:** se Redis è irraggiungibile → log di errore e fallback al throttle in-memory attuale (fail-open sul limiter, mai perdere lead per un'indisponibilità di Upstash).
6. **Env:** `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` su Netlify (server-only).
7. **Alternativa senza dipendenze:** le [Netlify Rate Limiting rules](https://docs.netlify.com/security/rate-limiting/) a livello di edge (config in `netlify.toml`) — meno flessibili (no limite globale/giornaliero) ma zero codice; valide come primo livello anche in aggiunta.

---

## Fase 3 — Consenso & tracking (gate pre-campagna)

**Metodo:** Chromium headless (Playwright) contro la build di produzione locale (`next start`), contesto `it-IT`/IP italiano (percorso EEA), backend `/api/contact` **mockato** (nessun invio reale), Photon bloccato. Catturati: `dataLayer`, cookie, tutte le richieste verso domini Google con parametro `gcs`. Probe: `tests/probes/consent-probe.mjs`, `tests/probes/conversion-probe.mjs`.

### Verifiche SUPERATE ✅

| # | Verifica | Esito osservato |
| --- | --- | --- |
| 1 | Default Consent Mode v2 `denied` prima di ogni hit | `dataLayer[0]` = `consent default` con `ad_storage/ad_user_data/ad_personalization/analytics_storage: denied` + `wait_for_update: 500`; il **primo** ping Google esce già con `gcs=G100` (denied). L'ordine nella coda dataLayer (default → js → config) garantisce la precedenza anche se gtag.js (entrambi `afterInteractive`) finisse di caricarsi prima dello snippet inline. |
| 2 | Pre-consenso: nessun cookie | `document.cookie` vuoto, zero cookie di contesto (anche httpOnly), un solo ping cookieless (`ccm/collect`, `gcs=G100`). Zero errori console. |
| 3 | Flusso Accept | `consent update` granted in dataLayer; cookie `_gcl_au` (1st-party) + `test_cookie`/`IDE` (.doubleclick.net) creati **solo dopo** il click; scelta persistita (`localStorage`), banner assente dopo reload; al reload l'inline script ripristina subito granted (ordine: default → update → js → config); ping `gcs=G111`. |
| 4 | Flusso Reject paritario | Stesso layer, stesso numero di click (1), stessa dimensione (Decline 89×42 vs Accept 85×42, font identico 14px; differenza solo di stile filled/outline — conforme come primo layer paritario). Dopo reject: **zero cookie**, scelta persistita, ping solo cookieless `gcs=G100`. Riapertura possibile via "Manage cookies" nel footer (verificato). |
| 5 | Conversione singola, niente double-fire | Con submit riuscito: **una** conversione con label `CtkVCL…` (la coppia `googleadservices.com/pagead/conversion` + `googleads.g.doubleclick.net/pagead/viewthroughconversion` è la stessa conversione registrata sui due endpoint — normale). Click su "Send another": **0** conversioni aggiuntive. Nessun re-fire su reload/back (stato solo client, nessuna thank-you page ricaricabile). Il fallback WhatsApp su errore backend deliberatamente non traccia (commento nel codice) ✓. |
| 6 | Nessuna PII raw negli URL | Email/telefono di test mai presenti in query string verso Google (né in chiaro né URL-encoded). Con consenso negato `gtag('set','user_data')` non viene proprio chiamata (gate `adConsentGranted()` su localStorage) ✓. |
| 7 | Coerenza banner ↔ privacy policy v1.2 | La policy (§8, EN+IT) dichiara esattamente ciò che si osserva: `_gcl_au` + cookie domini google.com/doubleclick.net **solo dopo consenso**; cookie tecnici Cloudflare (`__cf_bm`) per Turnstile; nessun cookie analytics (§8.3 — confermato: nessuna richiesta GA). Nota: `__cf_bm` non verificabile in locale (Turnstile non montato senza site key) → ricontrollare in produzione. |
| 8 | Consenso valido su tutte le pagine | La scelta è in `localStorage` a livello di origin e il banner/snippet sono nel root layout → vale per home e pagine legali (il toggle EN/IT delle legali non interagisce col consenso). |

**Inventario eventi di conversione:** uno solo — `send_to: AW-18237016910/CtkVCL-UwsYcEM6Wi_hD` (`components/sections/ContactForm.tsx:216-218`), trigger = submit form riuscito (`res.ok`). Nessun parametro `value`/`currency` (accettabile per lead-gen; eventuale valore statico è scelta di marketing). Osservato inoltre l'evento automatico `form_start` del tag Ads (`en=form_start`, auto-rilevamento form di gtag): **verificare nella UI di Google Ads che non sia configurato come conversione**, altrimenti conterebbe interazioni senza invio.

### Findings

#### CONS-01 · **Critica (blocca il lancio)** · La CSP di produzione blocca domini usati da Consent Mode / conversioni

- **File:** `netlify.toml:26`
- **Evidenza (empirica):** domini Google effettivamente contattati da gtag durante i flussi: `www.googletagmanager.com` ✓, `www.google.com` ✓, `googleads.g.doubleclick.net` ✓, `www.googleadservices.com` ✓ (tutti in allowlist) **ma anche**: `pagead2.googlesyndication.com` (← è il dominio del **ping di conversione cookieless quando il consenso è negato**, `gcs=G100`, e del ping pre-consenso), `ad.doubleclick.net` (`ccm/s/collect` post-accept), `www.google.it` (`pagead/1p-user-list`, remarketing per utenti italiani). Nessuno dei tre è in `img-src`/`connect-src` → in produzione quelle richieste vengono bloccate dalla CSP (in locale la CSP non è applicata, per questo il test le vede).
- **Impatto:** (a) tutti gli utenti EEA che **rifiutano** il banner producono ping di conversione cookieless che la CSP blocca → il conversion modeling di Consent Mode perde integralmente quel segmento; (b) ping remarketing/user-list bloccato per gli utenti italiani (e per ogni paese EEA sul rispettivo TLD google.**xx**); (c) parte della raccolta post-consenso persa. Con campagna imminente = misurazione danneggiata dal giorno 1, in modo silenzioso (solo errori CSP in console degli utenti).
- **Fix (S):** aggiungere a **entrambe** `img-src` e `connect-src`: `https://pagead2.googlesyndication.com https://ad.doubleclick.net https://www.google.it` (o più robusto: `https://*.googlesyndication.com https://*.doubleclick.net`). Per i TLD nazionali degli altri paesi EEA decidere: allowlist dei mercati target o accettare la perdita del solo ping remarketing (non della conversione). **Dopo il deploy, ri-verificare in devtools sul sito reale che non compaiano violazioni CSP nei 4 flussi (load, accept, reject, submit).**

#### CONS-02 · **Alta** · Enhanced conversions: `user_data` non arriva a Google

- **File:** `app/layout.tsx:198` (config), `components/sections/ContactForm.tsx:210-215` (set user_data)
- **Evidenza (empirica):** con consenso granted e submit riuscito, i ping di conversione portano `em=tv.1~ec.e3` — **nessun hash** `em.<sha256>` di email/telefono. Il codice chiama correttamente `gtag('set','user_data',{email,phone_number})` prima dell'evento, ma `gtag('config','AW-18237016910')` è privo di **`allow_enhanced_conversions: true`**, che è il prerequisito lato tag; il rilevamento "automatico" lato account (visibile come `ec_mode=a` nei ping) non cattura nulla (`ec.e3`) perché il form invia via `fetch()` e al momento della conversione è già stato smontato/resettato.
- **Impatto:** le enhanced conversions for leads sono di fatto **spente**: match quality e attribuzione ridotte proprio per la campagna in partenza. (Nessun problema privacy: semplicemente non viene trasmesso nulla.)
- **Fix (S):** aggiungere `allow_enhanced_conversions: true` alla `gtag('config', …)`; verificare nella UI Google Ads che le enhanced conversions siano attive con metodo "tag Google"; ri-testare col probe che compaia `em=tv.1~em.<hash>` nel ping di conversione.

#### CONS-03 · Media · Telefono non normalizzato E.164 per `user_data`

- **File:** `components/sections/ContactForm.tsx:213`, placeholder `+1 555 123 4567` (`:317`)
- **Evidenza:** `phone_number` è passato così come digitato (spazi inclusi); Google richiede formato E.164 (`+15551234567`) per il match.
- **Fix (S):** normalizzare prima del `set`: `"+" + phone.replace(/\D/g, "")` (mantenendo il `+` iniziale), o non inviare il telefono se non riconducibile a E.164.

#### CONS-04 · Media · Fuori EEA/UK/CH il default è "granted per assenza" ma il banner (in inglese) promette il contrario

- **File:** `lib/consent.ts:8-12`, `components/CookieBanner.tsx:70-73`
- **Evidenza:** il default `denied` è region-scoped; per un visitatore USA (audience primaria!) non esiste default → gtag tratta il consenso come concesso e `_gcl_au` viene impostato **al primo load**, prima di qualsiasi interazione. Il banner però viene mostrato a tutti con il testo "only with your consent".
- **Impatto:** nessuna violazione GDPR (utenti extra-EEA fuori ambito; regimi USA opt-out), ma testo del banner fattualmente inesatto per quegli utenti, e scelta architetturale da confermare consapevolmente. Il Decline di un utente USA funziona comunque (update globale) ✓.
- **Fix (decisione di business, S):** (a) default `denied` globale (misurazione pre-interazione persa anche per USA — più semplice e coerente col testo), oppure (b) mostrare il banner solo agli utenti EEA (geo-gating, es. header Netlify `X-Country`) e adeguare il testo, oppure (c) riformulare il testo del banner.

#### CONS-05 · Bassa · L'update di consenso concede `analytics_storage` ma il sito non ha analytics

- **File:** `components/CookieBanner.tsx:9-14`
- **Evidenza:** GRANTED include `analytics_storage: "granted"`; la policy §8.3 dichiara che non si usano cookie analytics (vero: nessuna property GA presente).
- **Impatto:** nessun cookie analytics viene comunque creato; è solo un consenso dichiarato più ampio del necessario.
- **Fix (S):** lasciare `analytics_storage: "denied"` in entrambi i rami (e nell'update dell'inline script di layout.tsx), così il consenso registrato coincide esattamente con l'uso dichiarato.

---

## Fase 4 — Test funzionali / E2E

**Setup creato:** `playwright.config.ts` (Chromium, due viewport: desktop 1440×900 e mobile 375×812, `webServer` su `next start`), suite in `tests/e2e/` (helpers + 5 spec, 20 test × 2 viewport), script `npm run test:e2e`. I test sono **ermetici**: tutte le richieste esterne (Google, Photon) vengono abortite; il percorso di submit riuscito usa `/api/contact` **mockato**; i POST reali all'endpoint locale esercitano solo percorsi che non inviano email (422 validazione, 400 JSON malformato, 200 honeypot, 405 metodo).

### Esito: **39 passed / 0 failed** (1 skip strutturale: test solo-mobile sul progetto desktop)

| Area | Test | Esito |
| --- | --- | --- |
| Home | Caricamento senza errori console né richieste fallite (2 viewport); un solo `h1`; `lang` presente | ✅ |
| Hydration | Rendering con `prefers-reduced-motion: reduce` senza errori di hydration → **QUAL-06 non riproducibile empiricamente** (declassato a osservazione) | ✅ |
| Navigazione | Tutti i link interni di tutte le pagine risolvono (<400); ancore `#how/#pricing/#features/#faq/#contact` e ancore clausole `/terms#sec-3-2, -3-10, -4-5, -5-9, -7-3, -8-2` esistono; menu mobile apre/naviga/chiude | ✅ |
| Lingua | Toggle EN/IT sulle pagine legali cambia contenuto e resta sulla pagina | ✅ |
| Form (client) | Messaggi di validazione su input non validi; submit disabilitato finché invalido; percorso di successo (mock) con success card e reset; errore backend mostrato con `role="alert"` mantenendo i dati inseriti; honeypot inviato vuoto | ✅ |
| Form (server, reale) | Payload invalido → 422 generico; JSON malformato → 400; honeypot compilato → 200 senza elaborazione; `GET /api/contact` → **405 confermato** | ✅ |
| Cookie banner | Visibile alla prima visita con Accept/Decline/link privacy; entrambe le scelte persistono oltre il reload; decline → zero cookie; riapertura dal footer | ✅ |
| 404 | Status 404 reale + pagina custom con link alla home | ✅ |
| Crawl | BFS su tutte le pagine interne: nessun link rotto, nessuna immagine rotta, nessun contenuto misto `http://` | ✅ |

**Fix solo test-side applicati per arrivare al verde** (documentati nei commenti dei test): esclusione dell'artefatto Chromium/Playwright sul doppio caricamento del logo (il routing di rete disabilita la cache HTTP → la richiesta duplicata Nav+Footer viene cancellata con `net::ERR_FAILED`; verificato innocuo con `tests/probes/image-probe.mjs`); body raw per il test del JSON malformato; selettore `p[role="alert"]` (il route announcer di Next è anch'esso `role="alert"`); riordino del test WhatsApp (vedi FUNC-01).

### Findings

#### FUNC-01 · Bassa · Il messaggio "telefono obbligatorio con WhatsApp" appare solo a form altrimenti valido

- **File:** `lib/schema.ts:77-83`
- **Evidenza:** la regola è una `.refine()` a livello di schema zod: le refinement girano **solo dopo** che tutti i campi base sono validi. Se l'utente sceglie WhatsApp e mette un numero corto mentre altri campi sono ancora vuoti, nessun errore compare sul telefono finché il resto non è compilato (il submit resta comunque disabilitato — nessun invio errato possibile).
- **Impatto:** micro-UX: feedback ritardato; combinato col bottone disabilitato senza spiegazione può confondere.
- **Fix (S):** spostare la regola su un `superRefine`/validazione per-campo o validare il telefono con regola condizionale nel campo stesso.

#### FUNC-02 · Nota · Messaggi di validazione solo in inglese

- Il brief prevedeva la verifica dei messaggi "in entrambe le lingue": non applicabile — il form esiste solo in inglese (vedi QUAL-05/architettura i18n). Nessun test IT possibile.

---
