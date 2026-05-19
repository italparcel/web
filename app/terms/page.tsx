import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { LegalLayout, Section, Sub } from "@/components/LegalLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "ItalParcel Terms and Conditions — the rules that govern the parcel forwarding service offered by ItalParcel di Samuel Borghesi.",
};

const toc = [
  { id: "sec-1", label: "1. Definitions, scope and channels" },
  { id: "sec-2", label: "2. Service framework" },
  { id: "sec-3", label: "3. Phase 1 — Activation" },
  { id: "sec-4", label: "4. Phase 2 — Receipt & processing" },
  { id: "sec-5", label: "5. Phase 3 — Final quote & shipment" },
  { id: "sec-6", label: "6. Phase 4 — After shipment" },
  { id: "sec-7", label: "7. Cross-cutting provisions" },
  { id: "sec-8", label: "8. Governing law & general" },
];

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <LegalLayout
          title="Terms & Conditions"
          updated="Last update: 18 March 2026 · Version 1.0"
          toc={toc}
        >
          <p>
            These Terms and Conditions (“T&amp;C”) govern the parcel-forwarding
            services offered by ItalParcel di Samuel Borghesi
            (“ItalParcel”). They are drafted in Italian and English; in case of
            discrepancy, the Italian version prevails. By submitting a request
            via the website form, e-mail or WhatsApp, you accept these T&amp;C
            and the Privacy Policy.
          </p>

          <Section id="sec-1" number="1" title="Definitions, scope and channels">
            <Sub number="1.1" title="Application">
              These T&amp;C govern the parcel forwarding services offered by
              ItalParcel.
            </Sub>
            <Sub number="1.2" title="Channels">
              The T&amp;C apply to requests, orders and instructions submitted
              via the website/form, e-mail, WhatsApp and/or any other channels
              indicated by ItalParcel.
            </Sub>
            <Sub number="1.3" title="Main definitions">
              <p>
                <strong>Customer</strong>: natural or legal person who
                requests/uses the service.
                <br />
                <strong>Business Day</strong>: working day in Italy (Mon–Fri),
                excluding Italian national holidays.
                <br />
                <strong>Parcel/Package</strong>: any shipment received or
                collected by ItalParcel.
                <br />
                <strong>Shipping Broker</strong>: third-party platform through
                which ItalParcel purchases the shipment.
                <br />
                <strong>Carrier</strong>: the operator that physically performs
                the transport.
                <br />
                <strong>Hand-over to the Carrier</strong>: the moment at which
                the tracking confirms collection/acceptance of the parcel by
                the carrier.
                <br />
                <strong>Hold (Suspension)</strong>: temporary suspension of
                processing (e.g. checks, missing documents, non-payment).
                <br />
                <strong>Consumer</strong>: a natural person acting for purposes
                outside any business, commercial, craft or professional
                activity, as defined under applicable consumer-protection
                legislation.
              </p>
            </Sub>
          </Section>

          <Section id="sec-2" number="2" title="Service framework and scope of application">
            <Sub number="2.1" title="Italian undertaking">
              ItalParcel is an Italian undertaking offering a parcel forwarding
              service.
            </Sub>
            <Sub number="2.2" title="Scope of the service">
              <p>
                The Parcel Forwarding Service consists of all activities
                required to enable the Customer to have parcels delivered to
                ItalParcel as the receiving and transit address, and/or to
                pickup points/lockers previously authorised and indicated by
                ItalParcel, with subsequent transitory handling and forwarding
                to the destination indicated by the Customer.
              </p>
              <p>
                ItalParcel is not a party to the sale-and-purchase relationships
                between the Customer and third-party sellers/senders.
              </p>
              <p>
                The acceptance of parcels is exclusively aimed at their
                immediate forwarding and does not constitute, in any way, a
                warehousing, storage or safekeeping service.
              </p>
            </Sub>
            <Sub number="2.3" title="Transport">
              The transport is performed by third-party carriers and/or through
              shipping brokers. ItalParcel does not act as a carrier:
              performance of the Service is deemed completed upon hand-over of
              the parcel to the carrier.
            </Sub>
            <Sub number="2.4" title="Excluded activities">
              The Service does not include appraisal or authentication of
              goods, functional tests or certifications, nor does it entail any
              warranty as to the outcome of inspections or customs procedures,
              which depend on third parties and/or competent authorities.
            </Sub>
          </Section>

          <Section
            id="sec-3"
            number="3"
            title="Phase 1 — Service activation and preliminary instructions"
          >
            <Sub id="sec-3-1" number="3.1" title="Service request and provision of data">
              The Customer requests activation of the Service by filling in the
              form available on the website (or through any other channel
              indicated by ItalParcel) and providing the data necessary for the
              performance of the Service, including contact information and
              operational instructions. ItalParcel will then contact the
              Customer with operational instructions and the payment channels
              needed to proceed.
            </Sub>
            <Sub
              id="sec-3-2"
              number="3.2"
              title="Initial fee (= consideration for one parcel) — set-off or use for handling/return"
            >
              <p>
                To activate the Service, the Customer pays in advance an
                initial fee equal to the ItalParcel consideration for one
                parcel, as indicated in the form/price list.
              </p>
              <p>
                <strong>(a)</strong> Where the Service proceeds normally, the
                initial fee is credited/set-off against the consideration due
                for the first parcel actually taken in charge (Phase 2).
              </p>
              <p>
                <strong>(b)</strong> In the cases governed by Articles 3.7 and
                4.5 (including, where possible, return to the last known
                sender), ItalParcel is authorised to retain and use the initial
                fee to cover handling costs; no refund is provided. Should the
                costs exceed the initial fee, the difference shall remain owed
                by the Customer.
              </p>
            </Sub>
            <Sub id="sec-3-3" number="3.3" title="Preliminary assessment and right of refusal">
              <p>
                ItalParcel may refuse the Service request before receipt of the
                parcels on justified grounds, including: (a) prohibited or
                restricted goods; (b) goods of particular fragility, delicacy or
                value; (c) weight/dimensions incompatible with operational
                limits; (d) insufficient data or instructions; (e) suspicion of
                unlawfulness or counterfeiting. Refusal cannot be discriminatory
                or unlawful.
              </p>
            </Sub>
            <Sub id="sec-3-4" number="3.4" title="Accuracy of data and instructions">
              The Customer warrants that the name, address, contact details and
              instructions provided are true, correct, complete and updated.
              Errors or omissions causing delays, blocks, returns, suspensions
              or additional costs remain at the Customer's expense.
            </Sub>
            <Sub id="sec-3-5" number="3.5" title="Identification of the parcel">
              The Customer undertakes to have parcels shipped under the full
              name consistent with that indicated in the initial form. In case
              of mismatch, the Customer shall promptly provide tracking,
              sender, dates, order references or pickup codes to enable
              identification.
            </Sub>
            <Sub id="sec-3-6" number="3.6" title="Pickup at pickup points and lockers">
              <p>
                <strong>(a)</strong> Pickup points / lockers (e.g. InPost,
                Amazon Hub, Poste Locker) must be previously selected and
                agreed with ItalParcel.
              </p>
              <p>
                <strong>(b)</strong> By using this option, the Customer
                authorises ItalParcel to collect parcels on the Customer's
                behalf using the access credentials (QR, PIN, OTP, pickup code)
                provided.
              </p>
              <p>
                <strong>(c)</strong> The Customer must forward credentials and
                related notifications within <strong>24 hours</strong> of
                availability. Lockers apply strict maximum holding times (e.g.
                InPost: 7 calendar days).
              </p>
              <p>
                <strong>(d)</strong> ItalParcel may refuse collection at
                non-agreed locations; all resulting costs (returns, hub
                transfers, redelivery, disposal) remain with the Customer, and
                Article 4.5 applies.
              </p>
              <p>
                <strong>(e)</strong> The Customer is solely responsible for the
                accuracy and timely communication of credentials.
              </p>
              <p>
                <strong>(f)</strong> ItalParcel takes charge of the parcel only
                upon actual physical collection. Loss, theft or damage at the
                pickup point/locker before collection is outside ItalParcel's
                liability.
              </p>
            </Sub>
            <Sub
              id="sec-3-7"
              number="3.7"
              title="Prohibited or restricted goods; anti-counterfeiting"
            >
              The Customer undertakes not to send prohibited, restricted,
              counterfeit or unlawful goods. The list of prohibited and
              restricted goods on ItalParcel's website forms an integral part of
              these T&amp;C.
            </Sub>
            <Sub id="sec-3-8" number="3.8" title="Customs (preparation)">
              <p>
                <strong>(a) Extra-EU shipments (export):</strong> the Customer
                provides complete and truthful customs data — description,
                quantity, value, reason for export, country of origin where
                applicable — and evidence of value upon request. The Customer
                warrants the goods are freely exportable.
              </p>
              <p>
                <strong>(b) Inbound parcels from non-EU countries:</strong>{" "}
                the Customer must give prior notice of customs charges in
                Italy. ItalParcel is not required to advance customs charges
                and may refuse the parcel where charges are not pre-accepted.
              </p>
            </Sub>
            <Sub id="sec-3-9" number="3.9" title="Estimates and quotes">
              Any estimates provided before receipt are indicative and
              non-binding. Actual cost depends on final weight and dimensions
              (including volumetric weight), the destination, the requested
              services and the conditions applied by brokers/carriers.
            </Sub>
            <Sub id="sec-3-10" number="3.10" title="Customer's warranties and indemnity">
              <p>
                The Customer warrants that: (i) the goods are lawful, of
                legitimate origin, non-counterfeit, not subject to undisclosed
                restrictions, and freely exportable from Italy and importable in
                the destination country; (ii) all information, descriptions,
                values and documents provided are true, accurate and complete;
                (iii) the Customer holds all rights and authorisations
                necessary for the shipment.
              </p>
              <p>
                The Customer undertakes to indemnify, defend and hold harmless
                ItalParcel from and against any damage, loss, fine, penalty,
                seizure, cost (including reasonable legal expenses) and
                third-party claims arising from (a) breach of the warranties;
                (b) shipment of prohibited, restricted, counterfeit or unlawful
                goods; (c) untruthful or incomplete declarations made to
                ItalParcel, carriers, brokers or authorities; (d) failure to
                provide requested information or documents.
              </p>
              <p>This obligation survives termination of the Service.</p>
            </Sub>
          </Section>

          <Section
            id="sec-4"
            number="4"
            title="Phase 2 — Receipt, opening, processing and transitory handling"
          >
            <Sub id="sec-4-1" number="4.1" title="Taking in charge and accrual of the consideration">
              The ItalParcel consideration remunerates the receipt/collection,
              opening, repackaging, transitory handling and preparation for
              forwarding, and accrues upon taking in charge — irrespective of
              the successful outcome of the forwarding. The initial fee (Art.
              3.2) is credited against the consideration for the first parcel.
            </Sub>
            <Sub
              id="sec-4-2"
              number="4.2"
              title="Opening, processing, inspection and cooperation with authorities"
            >
              <p>
                The Customer expressly authorises ItalParcel to open, inspect
                and document the contents of every parcel received: parcels
                handled by ItalParcel do not constitute private correspondence.
              </p>
              <p>
                On anomaly or reasonable suspicion (prohibited goods,
                counterfeiting, unlawful items, untruthful declarations),
                ItalParcel may carry out further checks and request supporting
                documentation (proof of purchase/payment, documents of
                legitimate origin) — without performing any authentication,
                appraisal or certification activity.
              </p>
              <p>
                Where ItalParcel detects or reasonably suspects unlawful,
                counterfeit, dangerous or prohibited goods, it may (i)
                immediately suspend processing; (ii) retain the parcel pending
                clarifications or transfer to authorities; (iii) report and
                cooperate with competent authorities. ItalParcel is not liable
                for any consequence of such reporting and cooperation.
              </p>
            </Sub>
            <Sub id="sec-4-3" number="4.3" title="Photos (on request)">
              On request, up to 10 high-resolution photos of the contents
              (additional paid service) for documentary purposes.
            </Sub>
            <Sub id="sec-4-4" number="4.4" title="Hold for checks / documents / payments">
              In the event of requests under 4.2, or of missing data, documents,
              instructions, authorisations or payments, ItalParcel may suspend
              processing until receipt of what was requested, including any
              additional fees, ancillary services or shipping costs.
            </Sub>
            <Sub
              id="sec-4-5"
              number="4.5"
              title="Returns / case closure for non-shippability, lack of cooperation or non-response"
            >
              <p>
                Applies in the cases governed by Articles 3.7 and 3.8, and in
                case of an unidentifiable parcel, lack of cooperation or
                non-response by the Customer (payment, shipping authorisation,
                data, documents). In such cases, ItalParcel may refuse the
                shipment and, where possible, return the parcel to the last
                known sender. Where return is not feasible, ItalParcel may
                request a suitable alternative address from the Customer; in
                its absence, ItalParcel shall, as a last resort, take the
                measures permitted by law, including disposal through
                authorised operators or other lawful destination — with all
                costs at the Customer's expense.
              </p>
              <p>
                Before proceeding, ItalParcel will send to the contact details
                provided by the Customer: (a) two e-mail reminders; (b) one
                reminder via SMS and/or WhatsApp.
              </p>
            </Sub>
          </Section>

          <Section
            id="sec-5"
            number="5"
            title="Phase 3 — Final quote, payment and shipment"
          >
            <Sub id="sec-5-1" number="5.1" title="Considerations and payment structure">
              <p>
                <strong>(a) ItalParcel fees:</strong> due for each parcel
                received/collected and taken in charge.
              </p>
              <p>
                <strong>(b) Shipping cost (carrier/broker):</strong> distinct
                from ItalParcel's considerations; determined based on
                destination, final weight and dimensions (including volumetric
                weight) and the conditions applied by carriers/brokers.
              </p>
            </Sub>
            <Sub
              id="sec-5-2"
              number="5.2"
              title='Definition of "parcel" and reclassification'
            >
              <p>
                For the purpose of calculating the ItalParcel consideration,{" "}
                <strong>one parcel</strong> means a single shipment received by
                ItalParcel that complies with both: (i) total weight ≤{" "}
                <strong>5 kg</strong>; (ii) dimensions ≤{" "}
                <strong>60 × 40 × 40 cm</strong>. Exceeding either parameter
                entitles ItalParcel to apply the handling surcharges set forth
                in the published price list. Upon receipt, ItalParcel verifies
                the actual parcel against the base unit and communicates a
                revised quote where applicable.
              </p>
            </Sub>
            <Sub
              id="sec-5-3"
              number="5.3"
              title="Tariff structure: published rates and individually negotiated prices"
            >
              <p>
                <strong>(a)</strong> Published rates apply to single,
                standardised parcels within the thresholds indicated.
              </p>
              <p>
                <strong>(b)</strong> For quantities/weights/frequencies above
                the published thresholds, economic terms are agreed
                individually in writing (e-mail, WhatsApp) and prevail over the
                published rates for that Customer.
              </p>
              <p>
                <strong>(c)</strong> ItalParcel may update published rates at
                any time; updates apply to parcels taken in charge after
                publication and do not affect parcels already in charge under
                previous conditions.
              </p>
            </Sub>
            <Sub id="sec-5-4" number="5.4" title="Final quote and shipping authorisation">
              Once the parcel has been taken in charge and prepared, ItalParcel
              communicates the final quote inclusive of shipping costs and any
              ancillary services. The shipment is booked and the parcel handed
              to the carrier only upon acceptance of the quote and full payment
              of the amounts due.
            </Sub>
            <Sub id="sec-5-5" number="5.5" title="Non-payment or lack of authorisation">
              ItalParcel may suspend performance (Art. 4.4). If absence of
              payment or authorisation persists, Articles 3.2(b) and 4.5 apply.
              Considerations accrued for activities already performed remain
              due.
            </Sub>
            <Sub id="sec-5-6" number="5.6" title="Export customs and declarations; exporter">
              For extra-EU shipments, ItalParcel acts as exporter and prepares
              the customs documentation based on the data and documents
              provided by the Customer (Art. 3.8(a)). The Customer remains
              responsible for accuracy and verifiability.
            </Sub>
            <Sub id="sec-5-7" number="5.7" title="Loss-only indemnity coverage (optional)">
              <p>
                On written request before shipment, ItalParcel may activate a
                loss-only coverage offered by the broker/carrier (e.g. Envia
                Seguro). Damage, partial shortages and delays are not covered.
                Requests after hand-over cannot be accommodated.
              </p>
              <p>
                The Customer declares the value (Euros) and provides evidence
                (invoice, proof of purchase). Premium and VAT are calculated on
                the declared value and paid with the shipment balance. The
                declared value is the maximum reimbursement; deductibles,
                exclusions and broker/carrier settlement conditions apply.
                Certain categories may be excluded (electronics, used/collectible
                items, high unit value, products without origin documentation).
              </p>
              <p>
                Without activated coverage, only the carrier's minimum
                statutory liability applies and Article 7.3 applies.
              </p>
            </Sub>
            <Sub id="sec-5-8" number="5.8" title="Hand-over to the carrier">
              From the moment tracking confirms collection/acceptance by the
              carrier, transport, delivery, checks, customs procedures and
              collection of duties/charges depend on the carrier/broker;
              ItalParcel cannot influence such timings nor guarantee the
              outcome.
            </Sub>
            <Sub id="sec-5-9" number="5.9" title="Payment methods, terms and chargeback">
              <p>
                <strong>(a) Accepted methods:</strong> SEPA bank transfer
                (including SEPA Instant); payment link for card (credit, debit,
                prepaid), Apple Pay, Google Pay, Revolut Pay and instant
                transfer.
              </p>
              <p>
                <strong>(b) Currency and bank charges:</strong> all amounts in
                Euros; bank fees, currency conversion and intermediation costs
                are at the Customer's expense.
              </p>
              <p>
                <strong>(c) Payment terms:</strong> save where otherwise agreed
                in writing, payment is due within <strong>3 Business Days</strong>{" "}
                of the invoice or payment request. Failure to pay entitles
                ItalParcel to apply Article 4.4 and, where applicable, Article
                4.5.
              </p>
              <p>
                <strong>(d) Chargeback and payment disputes:</strong> the
                Customer undertakes not to initiate chargeback procedures or
                unauthorised reversals for services duly performed or in the
                course of being performed. Any unjustified chargeback
                constitutes breach of these T&amp;C and entitles ItalParcel to
                (i) suspend services; (ii) recover the disputed amount,
                chargeback fees and legal expenses; (iii) submit to the payment
                provider, issuing bank and competent authorities the
                documentation evidencing the Customer's acceptance — including
                timestamped acceptance records, communications, tracking data
                and proof of hand-over to the carrier.
              </p>
            </Sub>
          </Section>

          <Section
            id="sec-6"
            number="6"
            title="Phase 4 — After shipment (tracking, import customs, events and claims)"
          >
            <Sub id="sec-6-1" number="6.1" title="Tracking and events">
              ItalParcel provides informational assistance on tracking and,
              where possible, support in operational communications. External
              events (strikes, weather, holidays, controls) and
              carrier/broker/authority decisions are not under ItalParcel's
              control.
            </Sub>
            <Sub id="sec-6-2" number="6.2" title="Import charges in the country of destination">
              Duties, VAT, import/customs-clearance charges and other charges
              applied in the destination country are at the recipient's /
              Customer's expense.
            </Sub>
            <Sub
              id="sec-6-3"
              number="6.3"
              title="Damage in transit; packaging and allocation of liability"
            >
              ItalParcel performs repackaging with professional diligence,
              applying the carrier's packaging guidelines. After hand-over to
              the carrier, damages during transport are governed by the
              carrier's rules. If damage is attributable to the carrier's
              conduct, liability rests with the carrier; if attributable to
              inadequate packaging by ItalParcel, liability rests with
              ItalParcel within the limits of the law.
            </Sub>
            <Sub
              id="sec-6-4"
              number="6.4"
              title="Loss claim (only upon Customer's request)"
            >
              <p>
                ItalParcel does not open claims automatically. The Customer
                must request opening in writing (e-mail, SMS or WhatsApp)
                within <strong>24 working hours</strong> of the carrier's loss
                notification, or of the expected-delivery date passing without
                tracking update. Broker/carrier deadlines may be short (e.g.
                Envia Seguro: 48 working hours); delays may forfeit
                reimbursement rights.
              </p>
              <p>
                The Customer provides invoice or other proof of value, the
                tracking reference, recipient communications evidencing
                non-receipt, and any further documents required by the
                broker/carrier. Reimbursement is limited to the declared value
                under Article 5.7 and to broker/carrier conditions.
              </p>
            </Sub>
            <Sub id="sec-6-5" number="6.5" title="Third-party terms">
              The terms of the carrier and/or insurer applied to the specific
              shipment also apply. In case of conflict, for claims and
              insurance purposes the carrier/insurer conditions prevail. The
              specific carrier is communicated to the Customer in the final
              quote (Art. 5.4).
            </Sub>
          </Section>

          <Section
            id="sec-7"
            number="7"
            title="Cross-cutting provisions (applicable in every phase)"
          >
            <Sub id="sec-7-1" number="7.1" title="Cooperation and response times">
              Should the carrier/broker/authorities request information, or
              should ItalParcel request instructions, payments or documents,
              the Customer undertakes to respond within <strong>36 hours</strong>{" "}
              from the request. The term may be extended by ItalParcel for
              weekends, public holidays in the Customer's country, or
              documented impediments. Absent a useful response, Articles 4.4
              and 4.5 may apply.
            </Sub>
            <Sub id="sec-7-2" number="7.2" title="Exclusion of indirect damages">
              In any case, ItalParcel shall not be liable for (a) loss of
              profit; (b) loss of business opportunities; (c) any other
              indirect, consequential, special or punitive damage; (d) loss of
              data — even if such damages were foreshadowed or foreseeable.
            </Sub>
            <Sub id="sec-7-3" number="7.3" title="Limits of liability">
              <p>
                Without prejudice to mandatory provisions of law, ItalParcel's
                overall liability for any cause connected with a single parcel
                shall not exceed (a) the total amount paid by the Customer for
                the ItalParcel considerations relating to that parcel; or (b)
                the value declared by the Customer for insurance purposes,
                where lower.
              </p>
              <p>
                Nothing in this Article limits ItalParcel's liability for
                willful misconduct or gross negligence, nor any liability that
                cannot be limited under mandatory legislation applicable to
                consumers.
              </p>
            </Sub>
          </Section>

          <Section
            id="sec-8"
            number="8"
            title="Governing law, jurisdiction, force majeure and general provisions"
          >
            <Sub id="sec-8-1" number="8.1" title="Governing law">
              These T&amp;C are governed by Italian law, without prejudice to
              the mandatory consumer-protection rules in the country of
              residence of the Customer where the latter qualifies as a
              consumer.
            </Sub>
            <Sub id="sec-8-2" number="8.2" title="Jurisdiction">
              For any dispute arising from or connected with these T&amp;C, the{" "}
              <strong>Court of Trento</strong> has exclusive jurisdiction.
              Where the Customer qualifies as a consumer, the mandatory rules
              on the jurisdiction of the consumer's forum apply.
            </Sub>
            <Sub id="sec-8-3" number="8.3" title="Force majeure">
              ItalParcel is not liable for delays or non-performance caused by
              events beyond its reasonable control (strikes, lockouts, weather,
              pandemics, governmental measures, customs suspensions, carrier
              disruptions, IT outages, embargoes, acts of public authorities).
            </Sub>
            <Sub id="sec-8-4" number="8.4" title="Amendments">
              ItalParcel may amend these T&amp;C at any time, with at least 15
              days' notice (via e-mail, WhatsApp or SMS) before the amendment
              takes effect. Continued use of the Service after that period
              constitutes acceptance.
            </Sub>
            <Sub id="sec-8-5" number="8.5" title="Language and prevailing version">
              These T&amp;C are drafted in Italian and English. In case of
              conflict between the two versions, the Italian version prevails.
            </Sub>
            <Sub id="sec-8-6" number="8.6" title="Privacy and acceptance">
              <p>
                Processing of personal data is governed by the{" "}
                <Link href="/privacy" className="underline underline-offset-2">
                  Privacy Policy
                </Link>
                , which forms an integral part of these T&amp;C.
              </p>
              <p>Acceptance occurs online through two separate check-boxes:</p>
              <ol className="list-decimal pl-6 space-y-1">
                <li>
                  Acceptance of the General Terms and Conditions and the
                  Privacy Policy.
                </li>
                <li>
                  Specific approval, pursuant to arts. 1341 and 1342 of the
                  Italian Civil Code, of clauses{" "}
                  <a href="#sec-3-2" className="underline underline-offset-2">3.2(b)</a>,{" "}
                  <a href="#sec-3-10" className="underline underline-offset-2">3.10</a>,{" "}
                  <a href="#sec-4-5" className="underline underline-offset-2">4.5</a>,{" "}
                  <a href="#sec-5-9" className="underline underline-offset-2">5.9</a>{" "}
                  and{" "}
                  <a href="#sec-8-2" className="underline underline-offset-2">8.2</a>.
                </li>
              </ol>
            </Sub>
          </Section>

          <div className="mt-16 border-t border-border pt-6 text-xs text-fg-subtle">
            ItalParcel di Samuel Borghesi · contact@italparcel.com · VAT IT
            02818050227 · +39 329 313 0206 (WhatsApp only)
          </div>
        </LegalLayout>
      </main>
      <Footer />
    </>
  );
}
