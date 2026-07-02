import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema, PARCEL_LABELS, ORIGIN_LABELS } from "@/lib/schema";

export const runtime = "nodejs";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contact@italparcel.com";
const FROM_EMAIL = process.env.FROM_EMAIL ?? "ItalParcel <onboarding@resend.dev>";

// Best-effort per-IP throttle. NOTE: in-memory, so on serverless it only sees
// a single warm instance's traffic — it is NOT shared across instances and
// resets on cold start. It blunts a naive single-source flood; a distributed
// attacker gets through it, and the hard backstop remains the mandatory
// Turnstile verification below. For a shared guarantee use an external store
// (e.g. Upstash Redis) or Netlify's platform rate limiting.
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
// Hard cap on tracked IPs. The Map is kept in least-recently-seen order
// (delete + re-set on every hit), so exceeding the cap evicts the oldest-seen
// IP — this works even when every entry is "recent", unlike an expiry-only
// prune, which never fires under a spoofed-unique-IP flood.
const RATE_MAP_MAX = 2_000;
const rateHits = new Map<string, number[]>();

// Trusted client IP. Netlify sets x-nf-client-connection-ip from the actual
// TCP connection; the first x-forwarded-for entry is client-forgeable and is
// used only as a last resort (e.g. local `next start`).
function clientIp(request: Request): string {
  return (
    request.headers.get("x-nf-client-connection-ip")?.trim() ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  const ua = request.headers.get("user-agent") ?? "unknown";

  // Throttle before any body parsing, so floods of malformed/invalid payloads
  // are counted too and a throttled IP costs no JSON/zod/Turnstile work.
  if (ip !== "unknown" && rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(RATE_WINDOW_MS / 1000)) },
      }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    // Don't echo zod's raw issue tree back to the client — the form runs its own
    // validation; a generic message avoids leaking the schema's internals.
    return NextResponse.json({ error: "Invalid form data" }, { status: 422 });
  }
  const data = parsed.data;

  const acceptedAt = new Date().toISOString();

  // Honeypot: a hidden field real users never see. Bots that auto-fill every
  // input tend to populate it — but so can overeager browser autofill, so a
  // trip FLAGS the inquiry instead of dropping it: the email still goes out,
  // tagged "[possible bot]" in the subject, and the trip is logged so the
  // false-positive rate is measurable. A success response therefore always
  // corresponds to an email that was actually sent.
  const honeypotTripped =
    body !== null &&
    typeof body === "object" &&
    typeof (body as Record<string, unknown>).contact_time === "string" &&
    (body as Record<string, unknown>).contact_time !== "";
  if (honeypotTripped) {
    console.warn(`[contact] honeypot tripped — flagged, not dropped. ip=${ip} ua=${ua}`);
  }

  // Cloudflare Turnstile. The token is sent outside the zod schema, so read it
  // from the raw body. In production verification is always mandatory; in dev
  // it is skipped when no secret is configured so the local form still works.
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const token =
      body && typeof body === "object"
        ? (body as Record<string, unknown>).turnstileToken
        : undefined;
    const verified = await verifyTurnstile(
      turnstileSecret,
      typeof token === "string" ? token : "",
      ip
    );
    if (!verified) {
      return NextResponse.json(
        { error: "Captcha verification failed. Please try again." },
        { status: 403 }
      );
    }
  } else if (process.env.NODE_ENV === "production") {
    console.error("[contact] TURNSTILE_SECRET_KEY missing in production.");
    return NextResponse.json(
      { error: "Captcha verification unavailable. Please try again later." },
      { status: 500 }
    );
  }

  // Strip control chars from the user name before it lands in the Subject
  // header — defence-in-depth against header injection / display spoofing.
  const safeName = oneLine(data.name).slice(0, 100);
  const subject = `${honeypotTripped ? "[possible bot] " : ""}New inquiry — ${safeName} (${PARCEL_LABELS[data.parcels]})`;

  // Single-line fields are collapsed to one line in the plain-text body too, so
  // a value containing a newline can't inject fake "Key: value" rows (e.g. spoof
  // the IP/acceptance lines). itemDescription/notes keep their newlines — they
  // sit in their own clearly delimited blocks.
  const text = [
    "New ItalParcel inquiry",
    "",
    `Name: ${oneLine(data.name)}`,
    `Email: ${oneLine(data.email)}`,
    data.phone ? `Phone: ${oneLine(data.phone)}` : null,
    "",
    `Country: ${oneLine(data.country)}`,
    `Address: ${oneLine(data.address)}`,
    `Parcels: ${PARCEL_LABELS[data.parcels]}`,
    `Origin: ${ORIGIN_LABELS[data.origin]}`,
    `Reply via: ${data.channel}`,
    "",
    `Items:\n${data.itemDescription}`,
    data.notes ? `\nAdditional notes:\n${data.notes}` : null,
    "",
    "— Acceptance record —",
    `T&C + Privacy: ${data.acceptTerms ? "accepted" : "—"}`,
    `Clauses 3.2(b), 3.10, 4.5, 5.9, 7.3, 8.2: ${
      data.acceptClauses ? "approved" : "—"
    }`,
    `At: ${acceptedAt}`,
    `IP: ${ip}`,
    `User-Agent: ${ua}`,
  ]
    .filter(Boolean)
    .join("\n");

  const html = `
    <table style="font-family: -apple-system, system-ui, sans-serif; color:#0b0f14; max-width:600px;">
      <tr><td style="padding:24px 0;border-bottom:1px solid #e7e5de;">
        <h1 style="margin:0;font-size:20px;">New ItalParcel inquiry</h1>
        <p style="margin:8px 0 0;color:#4b5563;font-size:14px;">${escapeHtml(acceptedAt)}</p>
      </td></tr>
      <tr><td style="padding:20px 0;">
        ${row("Name", data.name)}
        ${row("Email", data.email)}
        ${data.phone ? row("Phone", data.phone) : ""}
        ${row("Country", data.country)}
        ${row("Address", data.address)}
        ${row("Parcels", PARCEL_LABELS[data.parcels])}
        ${row("Origin", ORIGIN_LABELS[data.origin])}
        ${row("Reply via", data.channel)}
        <tr><td style="padding:12px 0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.1em;">Items to ship</td></tr>
        <tr><td style="padding:0 0 12px;font-size:14px;white-space:pre-wrap;">${escapeHtml(data.itemDescription)}</td></tr>
        ${
          data.notes
            ? `<tr><td style="padding:12px 0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.1em;">Additional notes</td></tr>
               <tr><td style="padding:0 0 12px;font-size:14px;white-space:pre-wrap;">${escapeHtml(data.notes)}</td></tr>`
            : ""
        }
      </td></tr>
      <tr><td style="padding:20px 0;border-top:1px solid #e7e5de;color:#6b7280;font-size:12px;">
        <strong style="color:#0b0f14;">Acceptance record</strong><br/>
        T&amp;C + Privacy accepted &middot; clauses 3.2(b), 3.10, 4.5, 5.9, 7.3, 8.2 approved<br/>
        IP: ${escapeHtml(ip)} &middot; ${escapeHtml(ua)}
      </td></tr>
    </table>
  `;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // In production a missing key means the inquiry would be lost silently —
    // fail loudly so the form surfaces an error instead of dropping the lead.
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[contact] RESEND_API_KEY missing in production — inquiry not sent."
      );
      return NextResponse.json(
        { error: "Could not send email. Please try again." },
        { status: 500 }
      );
    }
    console.warn(
      "[contact] RESEND_API_KEY not set — logging inquiry instead of emailing.\n",
      text
    );
    return NextResponse.json({ ok: true, dev: true });
  }

  try {
    const resend = new Resend(apiKey);
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: CONTACT_EMAIL,
      replyTo: data.email,
      subject,
      text,
      html,
    });
    if (result.error) {
      console.error("[contact] resend error:", result.error);
      return NextResponse.json(
        { error: "Could not send email. Please try again." },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[contact] unexpected error:", e);
    return NextResponse.json(
      { error: "Could not send email. Please try again." },
      { status: 502 }
    );
  }
}

async function verifyTurnstile(
  secret: string,
  token: string,
  remoteip: string
): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ secret, response: token, remoteip }),
        signal: AbortSignal.timeout(5000),
      }
    );
    const json = (await res.json()) as { success?: boolean };
    return json.success === true;
  } catch (e) {
    console.error("[contact] turnstile verify error:", e);
    return false;
  }
}

function row(label: string, value: string) {
  return `
    <tr><td style="padding:8px 0;color:#6b7280;font-size:12px;text-transform:uppercase;letter-spacing:.1em;width:130px;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:8px 0;font-size:14px;">${escapeHtml(value)}</td></tr>
  `;
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Collapse CR/LF/tabs to a single space — keeps single-line fields on one line
// in the plain-text email so they can't forge extra rows.
function oneLine(s: string) {
  return s.replace(/[\r\n\t\f\v]+/g, " ").trim();
}

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateHits.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS
  );
  recent.push(now);
  // Cap the per-IP array: only "more than RATE_MAX in the window" matters, so
  // the newest handful of timestamps keeps the answer correct while a single
  // IP hammers the endpoint, without unbounded growth.
  if (recent.length > RATE_MAX + 5) {
    recent.splice(0, recent.length - (RATE_MAX + 5));
  }
  // Delete + re-set keeps Map insertion order as least-recently-seen order.
  rateHits.delete(ip);
  rateHits.set(ip, recent);
  while (rateHits.size > RATE_MAP_MAX) {
    const oldest = rateHits.keys().next().value;
    if (oldest === undefined) break;
    rateHits.delete(oldest);
  }
  return recent.length > RATE_MAX;
}
