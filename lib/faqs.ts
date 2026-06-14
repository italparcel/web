export type Faq = {
  q: string;
  a: string;
  // Phrases that should start on a fresh line on mobile only (the answer text
  // itself is left untouched so structured data / schema stay clean).
  mobileBreaks?: string[];
  // Phrases that should start on a fresh line on every viewport (incl. desktop).
  breaks?: string[];
  // In-text phrases to turn into links (shown on every viewport; the answer
  // string stays plain so structured data / schema stay clean).
  links?: { text: string; href: string }[];
};

export const FAQS: Faq[] = [
  {
    q: "What counts as one parcel?",
    a: "A parcel is a single shipment up to 5 kg and 60×40×40 cm. If you think a parcel may exceed either limit, please let us know in advance to avoid a €15 handling surcharge (see T&C §5.2).",
    mobileBreaks: ["If you think a parcel may"],
    links: [{ text: "see T&C §5.2", href: "/terms#sec-5-2" }],
  },
  {
    q: "What can I ship through ItalParcel?",
    a: "Most everyday goods. Some categories can't travel with us at all — alcohol, perishables, weapons, medicines, dangerous goods and more. Check the Prohibited items page before ordering; it forms an integral part of our Terms & Conditions.",
    mobileBreaks: ["Check the Prohibited items page"],
    links: [{ text: "Prohibited items page", href: "/prohibited-items" }],
  },
  {
    q: "How do payments work?",
    a: "Payments happen in two steps. After your first quote, you pay a €10 activation fee to get started — don't worry, it's not an extra cost: it comes off your final bill, which covers shipping plus our handling fee.\nHere's an example: you ask us to ship a t-shirt to the USA, and we quote €30 for shipping plus a €17 handling fee for one parcel. You pay €10 now to get started; then, before we ship, you settle the balance — €47 in total (€30 + €17), less the €10 you've already paid, so €37. We accept SEPA (including SEPA Instant), card payments (credit, debit, prepaid), Apple Pay, Google Pay and Revolut Pay, all via a secure payment link. Amounts are in euros.",
    breaks: ["We accept SEPA"],
  },
  {
    q: "Can you collect parcels from pickup points?",
    a: "Yes — just request it, and depending on the carrier, we'll give you the available pickup points or lockers where we can collect your parcels. You'll then need to forward us the pickup codes (QR code, PIN or OTP) as soon as you get them — lockers only hold parcels for a limited time, so late codes can make collection impossible.",
  },
  {
    q: "What happens if my parcel gets lost?",
    a: "Your parcels travel with professional, tracked carriers, which carry the minimum liability required by law.\nIf a parcel is lost in transit, let us know as soon as you realise it and we'll open or assist with a claim to the carrier on your behalf. Any compensation follows the carrier's own terms and limits. Carriers' claim deadlines are short, so the sooner you tell us, the better.",
  },
  {
    q: "Will I owe customs duties?",
    a: "For shipments outside the EU, duties, VAT and customs-clearance charges in the destination country are paid by you or your recipient. We don't advance them. For inbound parcels from outside the EU you must give us notice in advance — we may refuse parcels with undeclared customs liabilities.",
  },
  {
    q: "How fast do you respond?",
    a: "We reply within 36 working hours (Mon–Fri, Italian holidays excluded), and most of the time the same day. WhatsApp is the fastest channel — we don't take phone calls.",
  },
  {
    q: "Where are you based?",
    a: "ItalParcel is a company registered in Italy and operating from Northern Italy, in the province of Trento.",
  },
];
