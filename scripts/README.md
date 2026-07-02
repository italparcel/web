# Audit probe scripts

Standalone Playwright scripts created during the 2026-07 full audit (see
`REVIEW_REPORT.md`). They are **not** part of the Playwright test suite — run
them manually with `node scripts/<name>.mjs` while a production build is being
served (`npm run build && npm run start`).

| Script | What it checks |
| --- | --- |
| `consent-probe.mjs` | Consent Mode v2 flows on `http://localhost:3000`: default state, pre-consent cookies, accept/reject persistence, `gcs=` parameter on every Google request, banner button parity. Prints JSON. |
| `conversion-probe.mjs` | Fills and submits the quote form (backend **mocked**, Photon blocked) with consent granted and denied; reports conversion-label requests, `em=` (enhanced conversions) parameter, PII-in-URL check, double-fire check. |
| `image-probe.mjs` | Sanity-check that `/_next/image` serves the logo correctly in a real browser (used to isolate a Playwright routing artifact). |
| `perf-probe.mjs` | First-party transfer breakdown (HTML/JS/CSS/font) + FCP/LCP/CLS per page, external requests blocked. |
| `lighthouse-probe.mjs` | Lighthouse (mobile emulation) via a Playwright-launched Chromium: `node scripts/lighthouse-probe.mjs / /privacy`. Prints scores, metrics, opportunities. |
| `a11y-probe.mjs` | axe-core scan of every page/state (incl. the Italian legal toggle) + keyboard behavior of the cookie banner. |
| `preview-audit.mjs` | Post-deploy verification against a Netlify **deploy preview**: `node scripts/preview-audit.mjs https://deploy-preview-N--site.netlify.app`. Captures CSP violations and Google request parameters while **aborting every outbound Google request after logging it** (nothing reaches Google; the form backend is mocked) — safe to run without polluting Ads data. |

Note (2026-07): the historical outputs quoted in `REVIEW_REPORT.md` were produced
when these scripts lived in `tests/probes/`; they were moved here unchanged.
