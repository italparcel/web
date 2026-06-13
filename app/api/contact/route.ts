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
    return NextResponse.json(
      { error: "Invalid form data", issues: parsed.error.issues },
      { status: 422 }
    );
  }
  const data = parsed.data;

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";
  const ua = request.headers.get("user-agent") ?? "unknown";
  const acceptedAt = new Date().toISOString();

  const subject = `New inquiry — ${data.name} (${PARCEL_LABELS[data.parcels]})`;

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
