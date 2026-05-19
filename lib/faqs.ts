export type Faq = { q: string; a: string };

export const FAQS: Faq[] = [
  {
    q: "What counts as 'one parcel'?",
    a: "A parcel is a single shipment up to 5 kg and 60×40×40 cm. If the parcel exceeds either limit, a handling surcharge applies per our published price list (see T&C §5.2). Carrier shipping is quoted separately based on final weight and dimensions, including volumetric weight.",
  },
  {
    q: "What can I ship through ItalParcel?",
    a: "Most legal goods. We don't accept prohibited or restricted items, counterfeits, or anything subject to undisclosed restrictions. Some categories (electronics, used or collectible items, high-value goods) may be excluded from optional loss coverage — we flag this in your final quote.",
  },
  {
    q: "How do payments work?",
    a: "An activation fee equal to one parcel (€17) is paid in advance and credited toward your first shipment. We accept SEPA (including SEPA Instant), card payments (credit, debit, prepaid), Apple Pay, Google Pay, and Revolut Pay via a secure payment link. All amounts are in Euros.",
  },
  {
    q: "Can you collect from InPost / Amazon Hub / a locker?",
    a: "Yes. Share the pickup code (QR, PIN, OTP) within 24 hours of the operator's notification and we'll collect on your behalf. Note that lockers hold parcels for limited windows (InPost: 7 days max) — late codes can render collection impossible.",
  },
  {
    q: "What happens if my parcel gets lost?",
    a: "If you activated loss coverage before shipment, request a claim in writing (email, SMS, WhatsApp) within 24 working hours of the carrier's loss notification or the missed delivery date. The declared value caps reimbursement, subject to the broker/carrier's terms. Without coverage, only the carrier's minimum statutory liability applies.",
  },
  {
    q: "Will I owe customs duties?",
    a: "For shipments outside the EU, duties, VAT and customs-clearance charges in the destination country are paid by you or your recipient. We don't advance them. For inbound parcels from outside the EU you must give us notice in advance — we may refuse parcels with undeclared customs liabilities.",
  },
  {
    q: "How fast do you respond?",
    a: "We respond within 36 hours on business days (Mon–Fri, Italian holidays excluded), and most of the time the same day. WhatsApp is the fastest channel — we don't take phone calls.",
  },
  {
    q: "Where are you based?",
    a: "ItalParcel di Samuel Borghesi — VAT IT 02818050227 — operates out of Italy. The Court of Trento has exclusive jurisdiction for disputes (mandatory consumer-protection rules of your country of residence still apply where you qualify as a consumer).",
  },
];
