"use client";

import { useState } from "react";
import {
  LegalLayout,
  Section,
  Rich,
  type LegalLang,
} from "@/components/LegalLayout";

type L = { en: string; it: string };
type SecData = { id: string; number: string; title: L; paras: L[] };

const TITLE: L = { en: "Privacy Policy", it: "Informativa sulla Privacy" };
const UPDATED: L = {
  en: "Last update: 20 May 2026 · Version 1.0 · English version",
  it: "Ultimo aggiornamento: 20 maggio 2026 · Versione 1.0 · Versione italiana",
};

const INTRO: L = {
  en: "This Privacy Policy is issued pursuant to Articles 13 and 14 of Regulation (EU) 2016/679 (“GDPR”) and of Italian Legislative Decree no. 196/2003, as amended (“Italian Privacy Code”), and forms an integral part of the [Terms and Conditions](/terms) of ItalParcel (the “T&C”). Capitalised terms not defined herein have the meaning given to them in the T&C.",
  it: "La presente Informativa è resa ai sensi degli articoli 13 e 14 del Regolamento (UE) 2016/679 (“GDPR”) e del D.Lgs. 196/2003 e s.m.i. (“Codice Privacy”) e forma parte integrante dei [Termini e Condizioni](/terms) di ItalParcel (i “T&C”). I termini in maiuscolo non definiti nella presente Informativa hanno il significato loro attribuito nei T&C.",
};

const SECTIONS: SecData[] = [
  {
    id: "sec-1",
    number: "1",
    title: { en: "Data Controller", it: "Titolare del trattamento" },
    paras: [
      {
        en: "1.1 Data Controller: **ItalParcel di Samuel Borghesi**, sole proprietorship, VAT no. IT 02818050227, registered office at Strada per Mechel 32, 38023 Cles (TN), Italy.",
        it: "1.1 Titolare del trattamento: **ItalParcel di Samuel Borghesi**, impresa individuale, P.IVA IT 02818050227, con sede in Strada per Mechel 32, 38023 Cles (TN), Italia.",
      },
      {
        en: "1.2 Contact: contact@italparcel.com — WhatsApp +39 329 313 0206 (no phone calls).",
        it: "1.2 Contatti: contact@italparcel.com — WhatsApp +39 329 313 0206 (no chiamate).",
      },
    ],
  },
  {
    id: "sec-2",
    number: "2",
    title: { en: "Personal data processed", it: "Dati personali trattati" },
    paras: [
      {
        en: "2.1 In connection with the Service, the Controller processes the following categories of personal data of the Customer and, where applicable, of the recipient indicated by the Customer:",
        it: "2.1 Nell'ambito del Servizio, il Titolare tratta le seguenti categorie di dati personali del Cliente e, ove applicabile, del destinatario indicato dal Cliente:",
      },
      {
        en: "**(a)** identification and contact data (name, address, e-mail, telephone); **(b)** tax data (tax code, VAT number, billing details); **(c)** operational data (destination address, shipping instructions, tracking references, pickup-point/locker credentials, communications via e-mail, WhatsApp and SMS); **(d)** parcel-content data (description, declared value, proofs of purchase, photos of contents, customs data); **(e)** payment data (data necessary to execute payments; card data are processed directly by payment service providers and are not stored by the Controller); **(f)** browsing data (IP address and data of technical cookies, as described in Section 8).",
        it: "**(a)** dati identificativi e di contatto (nome, indirizzo, e-mail, telefono); **(b)** dati fiscali (codice fiscale, partita IVA, dati di fatturazione); **(c)** dati operativi (indirizzo di destinazione, istruzioni di spedizione, codici di tracking, credenziali per ritiro presso punti di ritiro/locker, comunicazioni via e-mail, WhatsApp e SMS); **(d)** dati relativi al contenuto dei pacchi (descrizione, valore dichiarato, prove d'acquisto, fotografie del contenuto, dati doganali); **(e)** dati di pagamento (dati necessari all'esecuzione dei pagamenti; i dati delle carte sono trattati direttamente dai prestatori di servizi di pagamento e non sono conservati dal Titolare); **(f)** dati di navigazione (indirizzo IP e dati dei cookie tecnici, come descritto all'articolo 8).",
      },
    ],
  },
  {
    id: "sec-3",
    number: "3",
    title: { en: "Purposes and legal bases", it: "Finalità e basi giuridiche" },
    paras: [
      {
        en: "3.1 Personal data are processed for the following purposes:",
        it: "3.1 I dati personali sono trattati per le seguenti finalità:",
      },
      {
        en: "**(a)** performance of the Service in all its phases (receipt, opening, repackaging, customs preparation, transmission to carriers/brokers, locker pickup, payment management, claims) — legal basis: Article 6(1)(b) GDPR;",
        it: "**(a)** esecuzione del Servizio in tutte le sue fasi (ricezione, apertura, re-imballaggio, preparazione doganale, trasmissione a vettori/broker, ritiro presso locker, gestione dei pagamenti, gestione reclami) — base giuridica: articolo 6(1)(b) GDPR;",
      },
      {
        en: "**(b)** compliance with tax, accounting, customs and other legal obligations, and response to requests of competent authorities — legal basis: Article 6(1)(c) GDPR;",
        it: "**(b)** adempimento di obblighi fiscali, contabili, doganali e di legge, nonché riscontro a richieste delle autorità competenti — base giuridica: articolo 6(1)(c) GDPR;",
      },
      {
        en: "**(c)** cooperation with carriers, brokers, trade-mark owners and authorities in case of suspected unlawful, counterfeit, prohibited or dangerous goods (T&C Article 4.2); prevention of fraud and management of payment disputes and chargebacks (T&C Article 5.9); exercise or defence of legal claims; IT-systems security — legal basis: Article 6(1)(f) GDPR (legitimate interest).",
        it: "**(c)** cooperazione con vettori, broker, titolari di marchi e autorità in caso di sospetto di merci illecite, contraffatte, vietate o pericolose (articolo 4.2 dei T&C); prevenzione delle frodi e gestione delle contestazioni di pagamento e dei chargeback (articolo 5.9 dei T&C); esercizio o difesa di diritti in sede giudiziaria; sicurezza dei sistemi informatici — base giuridica: articolo 6(1)(f) GDPR (legittimo interesse).",
      },
      {
        en: "3.2 The Customer may object to processing under point (c) above pursuant to Article 21 GDPR, on grounds relating to his or her particular situation.",
        it: "3.2 Il Cliente può opporsi al trattamento di cui alla lettera (c) ai sensi dell'articolo 21 GDPR, per motivi connessi alla propria situazione particolare.",
      },
    ],
  },
  {
    id: "sec-4",
    number: "4",
    title: { en: "Provision of data", it: "Conferimento dei dati" },
    paras: [
      {
        en: "4.1 Provision of data is necessary for the performance of the Service and for compliance with legal obligations. Failure to provide such data prevents activation or continuation of the Service and may result in application of T&C Article 4.5.",
        it: "4.1 Il conferimento dei dati è necessario per l'esecuzione del Servizio e per l'adempimento degli obblighi di legge. Il mancato conferimento impedisce l'attivazione o la prosecuzione del Servizio e può comportare l'applicazione dell'articolo 4.5 dei T&C.",
      },
    ],
  },
  {
    id: "sec-5",
    number: "5",
    title: { en: "Recipients", it: "Destinatari" },
    paras: [
      {
        en: "5.1 Personal data may be communicated, for the purposes set out in Section 3, to: carriers, couriers and shipping brokers; pickup-point and locker operators; banks, payment service providers and payment processors; IT and communication service providers acting as data processors under Article 28 GDPR; the Controller's accountants and legal counsel; competent authorities (customs, tax, law-enforcement, judicial, trade-mark owners) where required by law or permitted by the T&C.",
        it: "5.1 I dati personali possono essere comunicati, per le finalità di cui all'articolo 3, a: vettori, corrieri e broker di spedizione; gestori di punti di ritiro e locker; istituti bancari, prestatori di servizi di pagamento e processori di pagamento; fornitori di servizi IT e di comunicazione che agiscono in qualità di responsabili del trattamento ai sensi dell'articolo 28 GDPR; commercialisti e consulenti legali del Titolare; autorità competenti (doganali, fiscali, forze dell'ordine, autorità giudiziarie, titolari di marchi), quando ciò sia richiesto dalla legge o consentito dai T&C.",
      },
    ],
  },
  {
    id: "sec-6",
    number: "6",
    title: {
      en: "Transfers to third countries",
      it: "Trasferimenti verso Paesi terzi",
    },
    paras: [
      {
        en: "6.1 The Service entails the transmission of data to carriers, brokers and operators located outside the European Economic Area whenever necessary to deliver the parcel to its destination. Such transfers are carried out under Article 49(1)(b) GDPR (performance of the contract).",
        it: "6.1 Il Servizio comporta la trasmissione di dati a vettori, broker e operatori situati anche al di fuori dello Spazio Economico Europeo, quando ciò sia necessario per recapitare il pacco a destinazione. Tali trasferimenti sono effettuati ai sensi dell'articolo 49(1)(b) GDPR (esecuzione del contratto).",
      },
      {
        en: "6.2 For transfers to IT and communication service providers located outside the EU/EEA, the Controller relies on the safeguards provided for in Chapter V GDPR, including the Standard Contractual Clauses adopted by the European Commission (available on the European Commission's official website) and, where applicable, the provider's certification under the EU-U.S. Data Privacy Framework.",
        it: "6.2 Per i trasferimenti a fornitori di servizi IT e di comunicazione situati al di fuori dell'UE/SEE, il Titolare si avvale delle garanzie previste dal Capo V del GDPR, ivi comprese le Clausole Contrattuali Standard adottate dalla Commissione europea (disponibili sul sito ufficiale della Commissione europea) e, ove applicabile, l'adesione del fornitore al EU-U.S. Data Privacy Framework.",
      },
    ],
  },
  {
    id: "sec-7",
    number: "7",
    title: { en: "Retention period", it: "Periodo di conservazione" },
    paras: [
      {
        en: "7.1 Data are retained for the time necessary for the purposes for which they are processed and, in any event:",
        it: "7.1 I dati sono conservati per il tempo necessario alle finalità per cui sono trattati e, in ogni caso:",
      },
      {
        en: "**(a)** contractual, tax and accounting data: 10 years from the date of issue of each document (Articles 2214 and 2220 of the Italian Civil Code and applicable tax legislation); **(b)** operational data, parcel-content data, photos and communications: for the time necessary for the Service and until expiry of the applicable limitation periods; **(c)** browsing data and cookies: as described in Section 8.",
        it: "**(a)** dati contrattuali, fiscali e contabili: 10 anni dalla data di emissione di ciascun documento (articoli 2214 e 2220 del Codice Civile e normativa fiscale applicabile); **(b)** dati operativi, dati relativi al contenuto dei pacchi, fotografie e comunicazioni: per il tempo necessario al Servizio e sino al decorso dei termini di prescrizione applicabili; **(c)** dati di navigazione e cookie: come descritto all'articolo 8.",
      },
    ],
  },
  {
    id: "sec-8",
    number: "8",
    title: { en: "Cookies", it: "Cookie" },
    paras: [
      {
        en: "8.1 The italparcel.com website uses exclusively technical cookies (session, navigation and security/performance cookies set by the hosting/CDN provider), strictly necessary for the proper functioning of the website. Such cookies fall within the exemption set forth in Article 122(1) of the Italian Privacy Code and do not require the user's consent. The website does not use profiling, marketing, analytics or third-party cookies. The user may disable cookies through his or her browser settings; this may impair the functioning of the website.",
        it: "8.1 Il sito italparcel.com utilizza esclusivamente cookie tecnici (cookie di sessione, di navigazione e cookie tecnici di prestazione/sicurezza impostati dal provider di hosting/CDN), strettamente necessari al corretto funzionamento del sito. Tali cookie rientrano nell'esenzione prevista dall'articolo 122, comma 1, del Codice Privacy e non richiedono il consenso dell'utente. Il sito non utilizza cookie di profilazione, di marketing, di analisi o di terze parti. L'utente può disabilitare i cookie modificando le impostazioni del proprio browser; ciò può compromettere il funzionamento del sito.",
      },
    ],
  },
  {
    id: "sec-9",
    number: "9",
    title: {
      en: "Rights of the data subject",
      it: "Diritti dell'interessato",
    },
    paras: [
      {
        en: "9.1 Pursuant to Articles 15–22 GDPR, the data subject has the right of access, rectification, erasure, restriction of processing, data portability, and the right to object to processing based on legitimate interest. Where processing is based on consent, the data subject has the right to withdraw consent at any time pursuant to Article 7(3) GDPR. These rights may be exercised by writing to contact@italparcel.com.",
        it: "9.1 Ai sensi degli articoli 15–22 GDPR, l'interessato ha diritto di accesso, rettifica, cancellazione, limitazione del trattamento, portabilità dei dati e opposizione al trattamento basato sul legittimo interesse. Ove il trattamento sia fondato sul consenso, l'interessato ha diritto di revocarlo in qualsiasi momento ai sensi dell'articolo 7(3) GDPR. Tali diritti possono essere esercitati scrivendo a contact@italparcel.com.",
      },
      {
        en: "9.2 The data subject also has the right to lodge a complaint with the Italian Data Protection Authority ([Garante per la protezione dei dati personali — www.gpdp.it](https://www.gpdp.it)), or with the supervisory authority of the EU Member State of habitual residence, work or alleged infringement.",
        it: "9.2 L'interessato ha altresì il diritto di proporre reclamo al [Garante per la protezione dei dati personali (www.gpdp.it)](https://www.gpdp.it) ovvero all'autorità di controllo dello Stato membro dell'UE di residenza abituale, di lavoro o del luogo della presunta violazione.",
      },
    ],
  },
  {
    id: "sec-10",
    number: "10",
    title: {
      en: "Language and prevailing version",
      it: "Lingua e versione prevalente",
    },
    paras: [
      {
        en: "10.1 This Privacy Policy is drafted in Italian and English. In case of discrepancy or conflict between the two versions, the Italian version shall prevail.",
        it: "10.1 La presente Informativa è redatta in italiano e in inglese. In caso di discrepanza o conflitto tra le due versioni, prevarrà la versione italiana.",
      },
    ],
  },
];

const TOC_LABELS: Record<string, L> = {
  "sec-1": { en: "1. Data Controller", it: "1. Titolare del trattamento" },
  "sec-2": { en: "2. Data processed", it: "2. Dati trattati" },
  "sec-3": { en: "3. Purposes & legal bases", it: "3. Finalità e basi giuridiche" },
  "sec-4": { en: "4. Provision of data", it: "4. Conferimento dei dati" },
  "sec-5": { en: "5. Recipients", it: "5. Destinatari" },
  "sec-6": { en: "6. Third-country transfers", it: "6. Trasferimenti extra-UE" },
  "sec-7": { en: "7. Retention", it: "7. Conservazione" },
  "sec-8": { en: "8. Cookies", it: "8. Cookie" },
  "sec-9": { en: "9. Your rights", it: "9. Diritti dell'interessato" },
  "sec-10": { en: "10. Language", it: "10. Lingua" },
};

export function PrivacyContent() {
  const [lang, setLang] = useState<LegalLang>("en");
  return (
    <LegalLayout
      title={TITLE[lang]}
      updated={UPDATED[lang]}
      toc={SECTIONS.map((s) => ({ id: s.id, label: TOC_LABELS[s.id][lang] }))}
      lang={lang}
      onLangChange={setLang}
    >
      <Rich text={INTRO[lang]} />

      {SECTIONS.map((sec) => (
        <Section key={sec.id} id={sec.id} number={sec.number} title={sec.title[lang]}>
          {sec.paras.map((p, i) => (
            <Rich key={i} text={p[lang]} />
          ))}
        </Section>
      ))}

      <div className="mt-16 border-t border-border pt-6 text-xs text-fg-subtle">
        ItalParcel di Samuel Borghesi · contact@italparcel.com · P.IVA: IT
        02818050227 · +39 329 313 0206 ({lang === "it" ? "no chiamate" : "no calls"})
      </div>
    </LegalLayout>
  );
}
