import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { LegalLayout, Section, Sub } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "ItalParcel Privacy Policy — how we collect, use and protect personal data in accordance with the GDPR.",
};

const toc = [
  { id: "sec-1", label: "1. Data controller" },
  { id: "sec-2", label: "2. Data we collect" },
  { id: "sec-3", label: "3. Purposes & legal bases" },
  { id: "sec-4", label: "4. Recipients" },
  { id: "sec-5", label: "5. International transfers" },
  { id: "sec-6", label: "6. Retention" },
  { id: "sec-7", label: "7. Your rights" },
  { id: "sec-8", label: "8. Cookies" },
  { id: "sec-9", label: "9. Updates" },
];

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <LegalLayout
          title="Privacy Policy"
          updated="Last update: 18 March 2026 · Version 1.0"
          toc={toc}
        >
          <p>
            This Privacy Policy explains how ItalParcel di Samuel Borghesi
            (“ItalParcel”, “we”) collects and processes personal data when you
            request, use or enquire about our parcel-forwarding service. It is
            written in line with Regulation (EU) 2016/679 (“GDPR”) and the
            Italian Data Protection Code (Legislative Decree 196/2003, as
            amended).
          </p>

          <Section id="sec-1" number="1" title="Data controller">
            <p>
              <strong>ItalParcel di Samuel Borghesi</strong>
              <br />
              VAT (P.IVA): IT 02818050227
              <br />
              Email:{" "}
              <a
                href="mailto:contact@italparcel.com"
                className="underline underline-offset-2"
              >
                contact@italparcel.com
              </a>
              <br />
              WhatsApp: +39 329 313 0206 (no calls)
              <br />
              Country of establishment: Italy
            </p>
            <p>
              No Data Protection Officer (DPO) is appointed: the controller is
              available at the address above for any privacy-related request.
            </p>
          </Section>

          <Section id="sec-2" number="2" title="Personal data we collect">
            <Sub number="2.1" title="Data you provide">
              <p>
                When you fill the contact/inquiry form, write to us by email or
                WhatsApp, or activate the Service, we collect:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Identity: full name.</li>
                <li>
                  Contact: email address, phone/WhatsApp number, destination
                  country.
                </li>
                <li>
                  Operational data: estimated number of parcels, origin (EU /
                  non-EU), free-text notes you choose to share, pickup-point
                  credentials when applicable (QR, PIN, OTP).
                </li>
                <li>
                  Parcel data: tracking numbers, sender information, contents,
                  declared value, customs information.
                </li>
                <li>
                  Payment data (processed by our payment provider): a payment
                  reference; we do not store full card details.
                </li>
                <li>
                  Acceptance record: timestamp, IP address and user-agent
                  string captured at the moment you tick the T&amp;C / Privacy
                  acceptance boxes.
                </li>
              </ul>
            </Sub>
            <Sub number="2.2" title="Data collected automatically">
              <p>
                Basic technical data when you visit the site (IP, browser type,
                pages viewed, referrer) — used for hosting security and
                aggregate analytics. We do not run third-party advertising
                trackers.
              </p>
            </Sub>
          </Section>

          <Section id="sec-3" number="3" title="Purposes and legal bases">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Performance of the Service / pre-contract:</strong>{" "}
                receiving, processing and forwarding your parcels, replying to
                your inquiries, issuing quotes — Art. 6(1)(b) GDPR.
              </li>
              <li>
                <strong>Legal and tax obligations:</strong> invoicing,
                accounting, customs declarations, anti-money-laundering and
                anti-counterfeiting checks — Art. 6(1)(c) GDPR.
              </li>
              <li>
                <strong>Legitimate interest:</strong> defending our rights in
                chargeback disputes, fraud prevention, security and IT
                integrity, cooperation with carriers/brokers and authorities
                where required — Art. 6(1)(f) GDPR.
              </li>
              <li>
                <strong>Consent:</strong> only where strictly required (e.g.
                non-essential cookies or marketing, if introduced) — Art.
                6(1)(a) GDPR. Currently we do not use such cookies.
              </li>
            </ul>
            <p>
              Providing personal data is voluntary, but refusal to provide the
              data marked as required prevents us from delivering the Service
              you requested.
            </p>
          </Section>

          <Section id="sec-4" number="4" title="Recipients of personal data">
            <p>
              We share personal data only with parties that need it to provide
              the Service or that are imposed by law:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                Carriers and shipping brokers (e.g. Envia Seguro and others
                used for the specific shipment).
              </li>
              <li>
                Pickup-point and locker operators (e.g. InPost, Amazon Hub,
                Poste Locker).
              </li>
              <li>
                Customs and other public authorities, where legally required.
              </li>
              <li>
                Payment providers and banks (for SEPA, card payments, Apple
                Pay, Google Pay, Revolut Pay).
              </li>
              <li>
                Technology providers acting as processors: hosting (Vercel),
                transactional email (Resend), and analytics where applicable.
              </li>
              <li>
                Professional advisors (accountants, lawyers) bound by
                confidentiality.
              </li>
            </ul>
            <p>
              Recipients acting as processors on our behalf are bound by a
              data-processing agreement under Art. 28 GDPR.
            </p>
          </Section>

          <Section id="sec-5" number="5" title="International transfers">
            <p>
              Most processing takes place in the European Economic Area.
              Transfers outside the EEA may occur when shipping to destinations
              outside the EU (necessary for performance of the contract — Art.
              49(1)(b) GDPR) or when our processors use sub-processors located
              outside the EEA. In such cases we rely on adequacy decisions or
              Standard Contractual Clauses adopted by the European Commission.
            </p>
          </Section>

          <Section id="sec-6" number="6" title="Retention">
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Inquiry-only data</strong> (form submissions that do
                not lead to a Service activation): up to 12 months from the
                last contact, then deleted.
              </li>
              <li>
                <strong>Operational/service data</strong>: for the duration of
                the contractual relationship.
              </li>
              <li>
                <strong>Accounting / invoicing data</strong>: <strong>10 years</strong>{" "}
                as required by Italian tax law (Art. 2220 Italian Civil Code).
              </li>
              <li>
                <strong>Acceptance records</strong> (timestamp, IP, user-agent)
                for T&amp;C acceptance: for the limitation period applicable to
                contract claims (up to 10 years), to support our defence
                against chargebacks and disputes.
              </li>
              <li>
                <strong>Security logs</strong>: typically 12 months unless
                longer retention is justified by an incident investigation.
              </li>
            </ul>
          </Section>

          <Section id="sec-7" number="7" title="Your rights">
            <p>Subject to the conditions set out in the GDPR, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>
                <strong>Access</strong> the personal data we hold about you
                (Art. 15).
              </li>
              <li>
                Request <strong>rectification</strong> of inaccurate data
                (Art. 16).
              </li>
              <li>
                Request <strong>erasure</strong> where the legal conditions are
                met (Art. 17).
              </li>
              <li>
                Request <strong>restriction</strong> of processing (Art. 18).
              </li>
              <li>
                Receive your data in a portable format (Art. 20).
              </li>
              <li>
                <strong>Object</strong> to processing based on our legitimate
                interest (Art. 21).
              </li>
              <li>
                Withdraw any consent at any time, without affecting the
                lawfulness of prior processing.
              </li>
            </ul>
            <p>
              To exercise these rights, email{" "}
              <a
                href="mailto:contact@italparcel.com"
                className="underline underline-offset-2"
              >
                contact@italparcel.com
              </a>
              . You also have the right to lodge a complaint with the Italian
              data-protection authority (<em>Garante per la protezione dei dati
              personali</em>,{" "}
              <a
                href="https://www.garanteprivacy.it"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2"
              >
                garanteprivacy.it
              </a>
              ) or with the supervisory authority of your habitual residence.
            </p>
          </Section>

          <Section id="sec-8" number="8" title="Cookies">
            <p>
              The site uses only technical cookies strictly necessary for its
              functioning. No profiling or third-party advertising cookies are
              used. If we add analytics or marketing cookies in the future, we
              will display a cookie banner asking for your consent before any
              non-essential cookie is set.
            </p>
          </Section>

          <Section id="sec-9" number="9" title="Updates">
            <p>
              We may update this Privacy Policy from time to time. The latest
              version is always available on this page, with the “Last update”
              date at the top. Material changes will be communicated by email
              or via the website with reasonable advance notice.
            </p>
            <p>
              Questions? Email{" "}
              <a
                href="mailto:contact@italparcel.com"
                className="underline underline-offset-2"
              >
                contact@italparcel.com
              </a>{" "}
              or message us on{" "}
              <Link href="/" className="underline underline-offset-2">
                WhatsApp
              </Link>
              .
            </p>
          </Section>

          <div className="mt-16 border-t border-border pt-6 text-xs text-fg-subtle">
            ItalParcel di Samuel Borghesi · contact@italparcel.com · VAT IT
            02818050227
          </div>
        </LegalLayout>
      </main>
      <Footer />
    </>
  );
}
