import type { ContactInput } from "./schema";

export const WHATSAPP_NUMBER = "393293130206";
export const WHATSAPP_DISPLAY = "+39 329 313 0206";

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

export function buildWhatsAppMessage(data: ContactInput): string {
  const lines = [
    "Hello ItalParcel — I'd like a quote.",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    "",
    `Destination country: ${data.country}`,
    `Full address: ${data.address}`,
    `Estimated parcels: ${PARCEL_LABELS[data.parcels]}`,
    `Origin: ${ORIGIN_LABELS[data.origin]}`,
    "",
    `Items to ship:\n${data.itemDescription}`,
    data.notes ? `\nAdditional notes:\n${data.notes}` : null,
    "",
    "I have accepted the Terms & Conditions and the Privacy Policy, and I specifically approve clauses 3.2(b), 3.10, 4.5, 5.9, 7.3 and 8.2 (Italian Civil Code arts. 1341 and 1342).",
  ].filter(Boolean) as string[];

  return lines.join("\n");
}

export function buildWhatsAppLink(data: ContactInput): string {
  const text = encodeURIComponent(buildWhatsAppMessage(data));
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
}
