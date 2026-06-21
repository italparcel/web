import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema, type ContactInput } from "@/lib/schema";

export const runtime = "nodejs";

const CONTACT_EMAIL = process.env.CONTACT_EMAIL ?? "contact@italparcel.com";
const FROM_EMAIL = process.env.FROM_EMAIL ?? "ItalParcel <onboarding@resend.dev>";

const PARCEL_LABELS: Record<ContactInput["parcels"], string> = {
  "1": "1 parcel",
  "2-4": "2–4 parcels",
  "5-9": "5–9 parcels",
  "10+": "10+ parcels",
};

const ORIGIN_LABELS: Record<ContactInput["origin"], string> = {
  eu: "Within the EU",
  "extra-eu": "Outside the EU",
  mixed: "Mixed / not sure",
};

// Best-effort per-IP throttle. NOTE: in-memory, so on serverless it only sees a
// single warm instance's traffic — it is NOT shared across instances and resets
// on cold start. It still blunts a naive flood from one IP hammering a warm
// function; for a hard guarantee use a shared store (e.g. Upstash Redis).
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 5;
const rateHits = new Map<string, number[]>();

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: a hidden field real users never see. Bots that auto-fill every
  // input tend to populate it. We accept the request (200) so they don't learn
  // they were filtered, but skip validation and sending entirely.
  if (
    body &&
    typeof body === "object" &&
    typeof (body as Record<string, unknown>).company === "string" &&
    (body as Record<string, unknown>).company !== ""
  ) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    // Don't echo zod's raw issue tree back to the client — the form runs its own
    // validation; a generic message avoids leaking the schema's internals.
    return NextResponse.json({ error: "Invalid form data" }, { status: 422 });
  }
  const data = parsed.data;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const ua = request.headers.get("user-agent") ?? "unknown";
  const acceptedAt = new Date().toISOString();

  // Throttle by IP before doing any real work (Turnstile call, email send).
  if (ip !== "unknown" && rateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429 }
    );
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
  const safeName = data.name.replace(/[\r\n\t\f\v]+/g, " ").trim().slice(0, 100);
  const subject = `New inquiry — ${safeName} (${PARCEL_LABELS[data.parcels]})`;

  const text = [
    "New ItalParcel inquiry",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    "",
    `Country: ${data.country}`,
    `Address: ${data.address}`,
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

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (rateHits.get(ip) ?? []).filter(
    (t) => now - t < RATE_WINDOW_MS
  );
  recent.push(now);
  rateHits.set(ip, recent);
  // Bound memory: occasionally drop IPs whose window has fully expired.
  if (rateHits.size > 5000) {
    for (const [k, times] of rateHits) {
      if (times.every((t) => now - t >= RATE_WINDOW_MS)) rateHits.delete(k);
    }
  }
  return recent.length > RATE_MAX;
}
