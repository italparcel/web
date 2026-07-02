// Static check: every host gtag was empirically observed to contact (see
// REVIEW_REPORT.md, Fase 3) must be allowed by the CSP in netlify.toml.
// Run: node scripts/csp-check.mjs
import { readFileSync } from "node:fs";

const toml = readFileSync(new URL("../netlify.toml", import.meta.url), "utf8");
const csp = toml.match(/Content-Security-Policy = "([^"]+)"/)[1];
const dir = {};
for (const part of csp.split(";")) {
  const [name, ...vals] = part.trim().split(/\s+/);
  dir[name] = vals;
}
const allows = (d, host) =>
  (dir[d] || []).some(
    (v) => v === `https://${host}` || (v.startsWith("https://*.") && host.endsWith(v.slice(10)))
  );

// host -> CSP directives it needs (from probe captures: consent-probe,
// conversion-probe, plus Turnstile/Photon integrations)
const needed = [
  ["www.googletagmanager.com", ["script-src", "connect-src", "img-src"]],
  ["www.google.com", ["img-src", "connect-src"]],
  ["www.google.it", ["img-src", "connect-src"]],
  ["googleads.g.doubleclick.net", ["img-src", "connect-src"]],
  ["ad.doubleclick.net", ["img-src", "connect-src"]],
  ["pagead2.googlesyndication.com", ["img-src", "connect-src"]],
  ["www.googleadservices.com", ["img-src", "connect-src"]],
  ["td.doubleclick.net", ["frame-src"]],
  ["challenges.cloudflare.com", ["script-src", "connect-src", "frame-src"]],
  ["photon.komoot.io", ["connect-src"]],
];

let missing = 0;
for (const [host, dirs] of needed) {
  for (const d of dirs) {
    if (!allows(d, host)) {
      console.log(`MISSING: ${d} ${host}`);
      missing++;
    }
  }
}
if (missing) {
  console.log(`${missing} directive/host pairs missing`);
  process.exit(1);
}
console.log(`CSP CHECK OK: all ${needed.length} hosts allowed in their required directives`);
