"use client";

import { useState } from "react";
import {
  LegalLayout,
  Section,
  Sub,
  Rich,
  type LegalLang,
} from "@/components/LegalLayout";

type L = { en: string; it: string };
type SubData = { number: string; title: L; paras: L[] };
type SecData = {
  id: string;
  number: string;
  title: L;
  paras?: L[];
  subs?: SubData[];
};

const TITLE: L = { en: "Terms & Conditions", it: "Termini e Condizioni" };
const UPDATED: L = {
  en: "Last update: 30 May 2026 · Version 1.1 · English version",
  it: "Ultimo aggiornamento: 30 maggio 2026 · Versione 1.1 · Versione italiana",
};

const TOC: { id: string; label: L }[] = [
  { id: "sec-1", label: { en: "1. Definitions, scope and channels", it: "1. Definizioni, ambito e canali" } },
  { id: "sec-2", label: { en: "2. Service framework", it: "2. Quadro del servizio" } },
  { id: "sec-3", label: { en: "3. Phase 1 — Activation", it: "3. Fase 1 — Attivazione" } },
  { id: "sec-4", label: { en: "4. Phase 2 — Receipt & processing", it: "4. Fase 2 — Ricezione e lavorazione" } },
  { id: "sec-5", label: { en: "5. Phase 3 — Final quote & shipment", it: "5. Fase 3 — Preventivo finale e spedizione" } },
  { id: "sec-6", label: { en: "6. Phase 4 — After shipment", it: "6. Fase 4 — Dopo la spedizione" } },
  { id: "sec-7", label: { en: "7. Cross-cutting provisions", it: "7. Disposizioni trasversali" } },
  { id: "sec-8", label: { en: "8. Governing law & general", it: "8. Legge applicabile e disposizioni generali" } },
];

const SECTIONS: SecData[] = [
  {
    id: "sec-1",
    number: "1",
    title: {
      en: "Definitions, scope and channels",
      it: "Definizioni, ambito e canali",
    },
    subs: [
      {
        number: "1.1",
        title: { en: "Application", it: "Applicazione" },
        paras: [
          {
            en: "These Terms and Conditions (“T&C”) govern the parcel forwarding services offered by ItalParcel (“ItalParcel”).",
            it: "I presenti Termini e Condizioni (“T&C”) disciplinano i servizi di inoltro pacchi (parcel forwarding) offerti da ItalParcel (“ItalParcel”).",
          },
        ],
      },
      {
        number: "1.2",
        title: { en: "Channels", it: "Canali" },
        paras: [
          {
            en: "The T&C apply to requests, orders and instructions submitted via the website/form, e-mail, WhatsApp and/or any other channels indicated by ItalParcel.",
            it: "I T&C si applicano alle richieste, agli ordini e alle istruzioni forniti tramite sito web/modulo, e-mail, WhatsApp e/o altri canali indicati da ItalParcel.",
          },
        ],
      },
      {
        number: "1.3",
        title: { en: "Main definitions", it: "Definizioni principali" },
        paras: [
          {
            en: "**Customer**: natural or legal person who requests/uses the service.",
            it: "**Cliente**: persona fisica o giuridica che richiede/utilizza il servizio.",
          },
          {
            en: "**Business Day**: working day in Italy (Monday to Friday), excluding Saturdays, Sundays and Italian national holidays.",
            it: "**Giorno Lavorativo**: giornata lavorativa in Italia (dal lunedì al venerdì), con esclusione di sabato, domenica e festività nazionali.",
          },
          {
            en: "**Parcel/Package**: any shipment received or collected by ItalParcel.",
            it: "**Collo/Pacco**: qualsiasi spedizione ricevuta o ritirata da ItalParcel.",
          },
          {
            en: "**Shipping Broker**: third-party platform through which ItalParcel purchases the shipment.",
            it: "**Broker di Spedizione**: piattaforma di terze parti tramite la quale ItalParcel acquista la spedizione.",
          },
          {
            en: "**Carrier**: the operator that physically performs the transport.",
            it: "**Vettore/Corriere**: l'operatore che esegue materialmente il trasporto.",
          },
          {
            en: "**Hand-over to the Carrier**: the moment at which the tracking confirms collection/acceptance of the parcel by the carrier.",
            it: "**Consegna al Vettore**: il momento in cui il tracking attesta il ritiro/accettazione del collo da parte del vettore.",
          },
          {
            en: "**Hold (Suspension)**: temporary suspension of processing (e.g. checks, missing documents, non-payment).",
            it: "**Sospensione (Hold)**: sospensione temporanea della lavorazione (ad es. verifiche, documenti mancanti, mancato pagamento).",
          },
          {
            en: "**Consumer**: a natural person acting for purposes outside any business, commercial, craft or professional activity carried out, as defined under applicable consumer-protection legislation.",
            it: "**Consumatore**: persona fisica che agisce per scopi estranei all'attività imprenditoriale, commerciale, artigianale o professionale eventualmente svolta, come definito dalla normativa applicabile a tutela del consumatore.",
          },
          {
            en: "**Consideration**: the fee due to ItalParcel for handling one parcel (receipt/collection, opening, repackaging, transitory handling and preparation for forwarding); it is distinct from the shipping cost charged by the carrier.",
            it: "**Corrispettivo**: il compenso dovuto a ItalParcel per la gestione di un collo (ricezione/ritiro, apertura, re-imballaggio, movimentazione transitoria e preparazione all'inoltro); è distinto dal costo di spedizione applicato dal vettore.",
          },
          {
            en: "**Advance**: the sum of €10 paid by the Customer to activate the Service, on account of the Consideration, governed by Article 3.2.",
            it: "**Anticipo**: la somma di 10€ versata dal Cliente per attivare il Servizio, a titolo di acconto sul Corrispettivo, disciplinata dall'art. 3.2.",
          },
        ],
      },
    ],
  },
  {
    id: "sec-2",
    number: "2",
    title: {
      en: "Service framework and scope of application",
      it: "Quadro del servizio e ambito di applicazione",
    },
    subs: [
      {
        number: "2.1",
        title: { en: "Italian undertaking", it: "Impresa italiana" },
        paras: [
          {
            en: "ItalParcel is an Italian undertaking offering a parcel forwarding service.",
            it: "ItalParcel è un'impresa italiana che offre un servizio di inoltro pacchi.",
          },
        ],
      },
      {
        number: "2.2",
        title: { en: "Scope of the service", it: "Ambito del servizio" },
        paras: [
          {
            en: "For the purposes of these T&C, the Parcel Forwarding Service consists of all activities required to enable the Customer to have parcels delivered to ItalParcel as the receiving and transit address, and/or to pickup points/lockers previously authorised and indicated by ItalParcel, with subsequent transitory handling (including ancillary processing requested by the Customer) and forwarding to the destination indicated by the Customer.",
            it: "Ai fini dei presenti T&C, il Servizio di Inoltro Pacchi consiste nell'insieme delle attività necessarie a consentire al Cliente di far recapitare pacchi a ItalParcel quale indirizzo di ricezione e di transito, e/o presso punti di ritiro/locker preventivamente autorizzati e indicati da ItalParcel, con successiva movimentazione transitoria (compresa la lavorazione accessoria richiesta dal Cliente) e inoltro alla destinazione indicata dal Cliente.",
          },
          {
            en: "ItalParcel is not a party to the sale-and-purchase relationships between the Customer and third-party sellers/senders.",
            it: "ItalParcel non è parte dei rapporti di compravendita tra il Cliente e i venditori/mittenti terzi.",
          },
          {
            en: "The acceptance of parcels is exclusively aimed at their immediate forwarding and does not constitute, in any way, a warehousing, storage or safekeeping service. ItalParcel assumes no obligation to keep, retain or maintain parcels beyond the time strictly necessary to perform the forwarding upon receipt of the Customer's complete instructions, payments and documents.",
            it: "L'accettazione dei pacchi è esclusivamente finalizzata al loro inoltro immediato e non costituisce in alcun modo un servizio di magazzinaggio, deposito o custodia. ItalParcel non assume alcun obbligo di conservare, trattenere o mantenere i pacchi oltre il tempo strettamente necessario all'esecuzione dell'inoltro a seguito della ricezione delle istruzioni complete, dei pagamenti e dei documenti del Cliente.",
          },
        ],
      },
      {
        number: "2.3",
        title: { en: "Transport", it: "Trasporto" },
        paras: [
          {
            en: "The transport is performed by third-party carriers and/or through shipping brokers. ItalParcel does not act as a carrier: performance of the Service is deemed completed upon hand-over of the parcel to the carrier.",
            it: "Il trasporto è eseguito da vettori terzi e/o tramite broker di spedizione. ItalParcel non agisce in qualità di vettore: l'esecuzione del Servizio si considera completata al momento della consegna del pacco al vettore.",
          },
        ],
      },
      {
        number: "2.4",
        title: { en: "Excluded activities", it: "Attività escluse" },
        paras: [
          {
            en: "The Service does not include the appraisal or authentication of goods, functional tests or certifications, nor does it entail any warranty as to the outcome of inspections or customs procedures, which depend on third parties and/or competent authorities; the operational procedures and obligations of the parties are governed by the following Sections (Phases set out in Articles 3–6).",
            it: "Il Servizio non comprende attività di stima o autenticazione dei beni, prove di funzionamento o certificazioni, né comporta garanzie sull'esito di verifiche o procedure doganali, che dipendono da soggetti terzi e/o autorità competenti; le procedure operative e gli obblighi delle parti sono disciplinati nelle Sezioni che seguono (Fasi di cui agli articoli 3–6).",
          },
        ],
      },
    ],
  },
  {
    id: "sec-3",
    number: "3",
    title: {
      en: "Phase 1 — Service activation and preliminary instructions",
      it: "Fase 1 — Attivazione del servizio e istruzioni preliminari",
    },
    subs: [
      {
        number: "3.1",
        title: {
          en: "Service request and provision of data",
          it: "Richiesta del Servizio e conferimento dei dati",
        },
        paras: [
          {
            en: "The Customer requests the Service by filling in the form available on the website (or through any other channel indicated by ItalParcel), indicating the destination and describing the goods intended for forwarding, together with the contact details and operational instructions necessary for the Service. On the basis of that information, ItalParcel sends the Customer an initial estimate of the ItalParcel consideration and of the shipping cost. This estimate is based exclusively on the information declared by the Customer; it is indicative and non-binding, and is confirmed only upon actual receipt of the parcel pursuant to Articles 3.9 and 5.2. ItalParcel may decline to receive certain goods or to serve certain destinations; in such case it informs the Customer before any payment is made. If the Customer accepts the initial estimate, the Customer pays the initial advance under Article 3.2, whereupon ItalParcel provides the Italian receiving address and any operational notes.",
            it: "Il Cliente richiede il Servizio compilando il modulo disponibile sul sito web (o tramite altro canale indicato da ItalParcel), indicando la destinazione e descrivendo le merci che intende inoltrare, unitamente ai recapiti e alle istruzioni operative necessari per il Servizio. Sulla base di tali informazioni, ItalParcel invia al Cliente una stima iniziale del corrispettivo ItalParcel e del costo di spedizione. Tale stima si basa esclusivamente sulle informazioni dichiarate dal Cliente; è indicativa e non vincolante, ed è confermata solo all'effettiva ricezione del collo ai sensi degli artt. 3.9 e 5.2. ItalParcel può rifiutare di ricevere determinate merci o di servire determinate destinazioni; in tal caso ne informa il Cliente prima di qualsiasi pagamento. Qualora il Cliente accetti la stima iniziale, versa l'anticipo iniziale di cui all'art. 3.2 e ItalParcel fornisce l'indirizzo italiano di ricezione e le eventuali note operative.",
          },
        ],
      },
      {
        number: "3.2",
        title: {
          en: "Initial advance of €10 (on account of the consideration) — set-off against the first parcel or retention for handling/return",
          it: "Anticipo iniziale di 10€ (in acconto sul corrispettivo) — compensazione sul primo collo o trattenimento per gestione/restituzione",
        },
        paras: [
          {
            en: "To activate the Service, the Customer pays in advance an initial advance of €10, on account of the ItalParcel consideration. ItalParcel applies this advance as set out below.",
            it: "Per attivare il Servizio, il Cliente versa anticipatamente un anticipo iniziale di 10€, a titolo di acconto sul corrispettivo ItalParcel. ItalParcel imputa tale anticipo secondo quanto di seguito previsto.",
          },
          {
            en: "**(a)** Where the Service proceeds normally, the €10 advance is set off against the ItalParcel consideration due for the first parcel actually taken in charge (Phase 2), thereby reducing the amount payable by the Customer at the final quote.",
            it: "**(a)** Qualora il Servizio prosegua regolarmente, l'anticipo di 10€ è compensato a fronte del corrispettivo ItalParcel dovuto per il primo collo effettivamente preso in carico (Fase 2), riducendo l'importo dovuto dal Cliente al preventivo finale.",
          },
          {
            en: "**(b)** Where the forwarding cannot be performed or does not proceed for reasons attributable to the Customer or for the circumstances governed by Articles 3.7 and 4.5 (including, where possible, the return to the last known sender), ItalParcel is entitled to retain the €10 advance against the consideration already accrued for the activities performed (Article 4.1) and the handling, return or disposal costs incurred; no refund is due. Should such costs exceed €10, the difference shall remain owed by the Customer.",
            it: "**(b)** Qualora l'inoltro non possa essere eseguito o non prosegua per cause imputabili al Cliente o per le circostanze disciplinate dagli artt. 3.7 e 4.5 (compresa, ove possibile, la restituzione all'ultimo mittente noto), ItalParcel è legittimata a trattenere l'anticipo di 10€ a fronte del corrispettivo già maturato per le attività svolte (art. 4.1) e dei costi di gestione, restituzione o smaltimento sostenuti; non è dovuto alcun rimborso. Qualora tali costi superino 10€, la differenza resta dovuta dal Cliente.",
          },
        ],
      },
      {
        number: "3.3",
        title: {
          en: "Preliminary assessment and right of refusal",
          it: "Valutazione preliminare e diritto di rifiuto",
        },
        paras: [
          {
            en: "ItalParcel reserves the right to accept or refuse the Service request before receipt of the parcels, on justified grounds, by giving notice to the Customer. By way of example, justified grounds include:",
            it: "ItalParcel si riserva il diritto di accettare o rifiutare la richiesta di Servizio prima della ricezione dei pacchi, per giustificato motivo, dandone comunicazione al Cliente. Costituiscono giustificati motivi, a titolo esemplificativo:",
          },
          {
            en: "**(a)** prohibited or restricted goods, including restrictions imposed by the carrier/broker or by the country of destination; **(b)** goods of particular fragility, delicacy or value for which adequate handling/logistics for forwarding cannot be reasonably ensured; **(c)** weight, dimensions or characteristics incompatible with operational limits or with the carrier's/broker's availability; **(d)** insufficient data, documents or instructions; **(e)** suspicion of unlawfulness or counterfeiting.",
            it: "**(a)** merci vietate o soggette a restrizioni, incluse le restrizioni imposte dal vettore/broker o dal Paese di destinazione; **(b)** merci di particolare fragilità, delicatezza o valore per le quali non sia ragionevolmente possibile garantire una gestione/logistica adeguata all'inoltro; **(c)** peso, dimensioni o caratteristiche incompatibili con i limiti operativi o con la disponibilità del vettore/broker; **(d)** dati, documenti o istruzioni insufficienti; **(e)** sospetto di illiceità o contraffazione.",
          },
          {
            en: "Refusal may not be exercised on discriminatory or unlawful grounds.",
            it: "Il rifiuto non potrà essere esercitato per motivi discriminatori o contrari alla legge.",
          },
        ],
      },
      {
        number: "3.4",
        title: {
          en: "Accuracy of data and instructions",
          it: "Correttezza dei dati e delle istruzioni",
        },
        paras: [
          {
            en: "The Customer warrants that the name, address, contact details and instructions provided are true, correct, complete and updated. Any errors or omissions causing delays, blocks, returns, suspensions or additional costs shall remain at the Customer's expense.",
            it: "Il Cliente garantisce che il nome, l'indirizzo, i recapiti e le istruzioni forniti siano veri, corretti, completi e aggiornati. Eventuali errori od omissioni che causino ritardi, blocchi, restituzioni, sospensioni o costi aggiuntivi resteranno a carico del Cliente.",
          },
        ],
      },
      {
        number: "3.5",
        title: {
          en: "Identification of the parcel",
          it: "Identificazione del collo",
        },
        paras: [
          {
            en: "The Customer undertakes to have parcels shipped under the full name consistent with that indicated in the initial form and with ItalParcel's instructions. In the case of an incorrect, incomplete or modified name without prior notice, ItalParcel may not be able to match the parcel to the Customer; in such case, the Customer shall promptly provide all useful information for identification (by way of example: tracking, sender, shipping/delivery date, order references, any pickup codes).",
            it: "Il Cliente si impegna a far spedire i pacchi con il nome completo coerente con quello indicato nel modulo iniziale e con le istruzioni di ItalParcel. In caso di nome errato, incompleto o modificato senza preavviso, ItalParcel potrebbe non essere in grado di abbinare il collo al Cliente; in tal caso, il Cliente dovrà tempestivamente fornire ogni informazione utile all'identificazione (a titolo esemplificativo: tracking, mittente, data di spedizione/consegna, riferimenti dell'ordine, eventuali codici di ritiro).",
          },
        ],
      },
      {
        number: "3.6",
        title: {
          en: "Pickup at pickup points and lockers",
          it: "Ritiro presso punti di ritiro e locker",
        },
        paras: [
          {
            en: "**(a) Scope and authorised locations.** The Customer may have parcels delivered to pickup points or automated lockers (e.g. InPost, Amazon Hub, Poste Locker, carriers' pickup points), provided that the specific location has been previously selected and agreed between the Customer and ItalParcel. ItalParcel will communicate to the Customer the addresses of pickup points/lockers available for the Service.",
            it: "**(a) Ambito e luoghi autorizzati.** Il Cliente può far recapitare pacchi a punti di ritiro o locker automatici (ad es. InPost, Amazon Hub, Poste Locker, punti di ritiro dei corrieri), a condizione che la specifica ubicazione sia stata previamente selezionata e concordata tra il Cliente e ItalParcel. ItalParcel comunicherà al Cliente gli indirizzi dei punti di ritiro/locker disponibili per il Servizio.",
          },
          {
            en: "**(b) Authorisation to collect on behalf of the Customer.** By accepting these T&C and using the option of collection at a pickup point/locker, the Customer expressly authorises ItalParcel to collect parcels at the agreed pickup point/locker on behalf of the Customer, using the access credentials (QR code, PIN, OTP, pickup code or equivalent) provided by the Customer. The Customer warrants that such authorisation is permitted under the terms of service of the relevant pickup point/locker operator and that no obligation of strictly personal collection applies.",
            it: "**(b) Autorizzazione al ritiro per conto del Cliente.** Accettando i presenti T&C e utilizzando l'opzione di ritiro presso punto di ritiro/locker, il Cliente autorizza espressamente ItalParcel a ritirare i pacchi presso il punto di ritiro/locker concordato per conto del Cliente, utilizzando le credenziali di accesso (codice QR, PIN, OTP, codice di ritiro o equivalenti) fornite dal Cliente. Il Cliente garantisce che tale autorizzazione è consentita dai termini di servizio del relativo gestore del punto di ritiro/locker e che non si applica alcun obbligo di ritiro esclusivamente personale.",
          },
          {
            en: "**(c) Communication of access credentials within 24 working hours.** The Customer undertakes to forward to ItalParcel the access credentials (QR code, PIN, OTP, pickup code or equivalent) and any related notifications within 24 working hours from the moment the parcel is made available for collection by the pickup point/locker operator (e.g. from the time of the operator's notification to the Customer). The Customer acknowledges that pickup points and lockers apply strict maximum holding times; accordingly, late communication of credentials may render collection impossible.",
            it: "**(c) Comunicazione delle credenziali di accesso entro 24 ore lavorative.** Il Cliente si impegna a inoltrare a ItalParcel le credenziali di accesso (codice QR, PIN, OTP, codice di ritiro o equivalenti) ed eventuali notifiche correlate entro 24 ore lavorative dal momento in cui il pacco è reso disponibile per il ritiro dal gestore del punto di ritiro/locker (ad es. dal momento della notifica del gestore al Cliente). Il Cliente prende atto che i punti di ritiro e i locker applicano tempi massimi di permanenza rigorosi; pertanto, una comunicazione tardiva delle credenziali può rendere impossibile il ritiro.",
          },
          {
            en: "**(d) Right to refuse collection at non-agreed locations.** ItalParcel reserves the right to refuse collection of any parcel delivered to a pickup point or locker that does not correspond to the location agreed with the Customer — including the case in which the agreed destination was ItalParcel's standard receiving address and the parcel has nevertheless been delivered to a pickup point or locker. Such refusal does not constitute a breach by ItalParcel. In such cases, all consequences — including automatic returns to the sender, removal costs, transfers to partner hubs, redelivery charges and any disposal costs — shall remain entirely at the Customer's expense, and Article 4.5 shall apply.",
            it: "**(d) Diritto di rifiutare il ritiro presso ubicazioni non concordate.** ItalParcel si riserva il diritto di rifiutare il ritiro di qualsiasi pacco recapitato presso un punto di ritiro o locker che non corrisponda all'ubicazione concordata con il Cliente — ivi compreso il caso in cui la destinazione concordata fosse l'indirizzo standard di ricezione di ItalParcel e il pacco sia stato comunque recapitato a un punto di ritiro o locker. Tale rifiuto non costituisce inadempimento da parte di ItalParcel. In tali casi, ogni conseguenza — comprese le restituzioni automatiche al mittente, i costi di rimozione, il trasferimento agli hub partner, gli oneri di re-consegna ed eventuali costi di smaltimento — resterà interamente a carico del Cliente, e si applica l'art. 4.5.",
          },
          {
            en: "**(e) Customer's responsibility for codes and timing.** Without prejudice to the foregoing, the Customer is solely responsible for: (i) the accuracy and validity of the credentials provided; (ii) timely communication thereof pursuant to point (c); (iii) all costs and consequences arising from incorrect, expired, invalid or late-communicated credentials, including automatic returns to the sender, transfers to partner hubs, redelivery fees and operator charges.",
            it: "**(e) Responsabilità del Cliente per codici e tempistiche.** Fermo quanto sopra, il Cliente resta unicamente responsabile per: (i) la correttezza e validità delle credenziali fornite; (ii) la tempestiva comunicazione delle stesse ai sensi della lettera (c); (iii) tutti i costi e le conseguenze derivanti da credenziali errate, scadute, non valide o tardivamente comunicate, comprese le restituzioni automatiche al mittente, i trasferimenti agli hub partner, le commissioni di re-consegna e gli oneri del gestore.",
          },
          {
            en: "**(f) Taking charge of locker parcels.** ItalParcel takes charge of the parcel only upon actual physical collection at the pickup point/locker. Any losses, theft, damage, tampering or unavailability occurring at the pickup point/locker before physical collection by ItalParcel falls outside ItalParcel's liability and shall be handled by the Customer directly with the seller, the sender or the pickup point/locker operator.",
            it: "**(f) Presa in carico dei pacchi locker.** ItalParcel prende in carico il pacco unicamente al momento dell'effettivo ritiro fisico presso il punto di ritiro/locker. Eventuali smarrimenti, furti, danni, manomissioni o indisponibilità verificatisi presso il punto di ritiro/locker prima del ritiro fisico da parte di ItalParcel esulano dalla responsabilità di ItalParcel e devono essere trattati dal Cliente direttamente con il venditore, il mittente o il gestore del punto di ritiro/locker.",
          },
        ],
      },
      {
        number: "3.7",
        title: {
          en: "Prohibited or restricted goods; anti-counterfeiting",
          it: "Merci vietate o soggette a restrizioni; anti-contraffazione",
        },
        paras: [
          {
            en: "The Customer undertakes not to have ItalParcel receive prohibited or restricted goods, including those imposed by carriers/brokers and by transit/destination countries, nor counterfeit or otherwise unlawful goods. ItalParcel may refuse the handling/forwarding of goods falling within the said categories or presenting risk factors.",
            it: "Il Cliente si impegna a non far recapitare a ItalParcel merci vietate o soggette a restrizioni, comprese quelle imposte dai vettori/broker e dai Paesi di transito/destinazione, né merci contraffatte o comunque illecite. ItalParcel può rifiutare la gestione/inoltro di merci rientranti nelle suddette categorie o presentanti elementi di rischio.",
          },
          {
            en: "The list of prohibited and restricted goods is set forth on the [Prohibited items](/prohibited-items) page available on ItalParcel's website, which forms an integral part of these T&C and is hereby incorporated by reference. The Customer declares having reviewed and accepted it before activation of the Service.",
            it: "L'elenco delle merci vietate e soggette a restrizioni è riportato nella pagina [Articoli proibiti](/prohibited-items) disponibile sul sito web di ItalParcel, che forma parte integrante dei presenti T&C ed è qui incorporata mediante rinvio. Il Cliente dichiara di averne preso visione e di averla accettata prima dell'attivazione del Servizio.",
          },
        ],
      },
      {
        number: "3.8",
        title: { en: "Customs (preparation)", it: "Dogana (preparazione)" },
        paras: [
          {
            en: "**(a) Extra-EU shipments (export):** the Customer shall provide complete and truthful customs data, including at least a precise description of the goods, quantity, value, reason for export and any required document. Where applicable, the Customer shall further provide the country of origin and any additional elements necessary for classification. ItalParcel prepares/completes the documentation on the basis of the data provided by the Customer; the Customer remains responsible for the accuracy and verifiability of the information provided. ItalParcel may request evidence of value (e.g. receipts, order confirmations, proof of payment) in case of inconsistencies or requests from carriers/brokers/authorities. The Customer further warrants that the goods are freely exportable and not subject to export prohibitions or restrictions and/or to licences, authorisations or obligations not previously obtained or fulfilled.",
            it: "**(a) Spedizioni extra-UE (esportazione):** il Cliente deve fornire dati doganali completi e veritieri, comprendenti almeno una descrizione precisa delle merci, quantità, valore, motivo dell'esportazione e ogni documento richiesto. Il Cliente fornisce inoltre, ove applicabile, il Paese di origine e gli ulteriori elementi necessari alla classificazione. ItalParcel predispone/compila la documentazione sulla base dei dati forniti dal Cliente; il Cliente resta responsabile dell'accuratezza e verificabilità delle informazioni fornite. ItalParcel può richiedere prove del valore (ad es. ricevute, conferme d'ordine, prove di pagamento) in caso di incongruenze o richieste da parte di vettori/broker/autorità. Il Cliente garantisce inoltre che le merci sono liberamente esportabili e non soggette a divieti o restrizioni all'esportazione e/o a licenze, autorizzazioni od obblighi non preventivamente ottenuti o adempiuti.",
          },
          {
            en: "**(b) Inbound parcels from extra-EU countries (import into Italy):** the Customer shall give prior notice if a parcel originates from a non-EU country and may generate customs charges in Italy. ItalParcel is not required to advance customs clearance/delivery charges and may refuse to collect or receive the parcel where such charges have not been communicated and accepted in advance.",
            it: "**(b) Pacchi in entrata da Paesi extra-UE (importazione in Italia):** il Cliente deve informare preventivamente qualora un pacco provenga da un Paese non-UE e possa generare oneri doganali in Italia. ItalParcel non è tenuta ad anticipare oneri per lo sdoganamento/consegna e può rifiutare di ritirare o ricevere il pacco qualora tali oneri non siano stati comunicati e accettati preventivamente.",
          },
        ],
      },
      {
        number: "3.9",
        title: { en: "Estimates and quotes", it: "Stime e preventivi" },
        paras: [
          {
            en: "Any estimate provided before receipt is based exclusively on the descriptions and data declared by the Customer (e.g. “a t-shirt”, “around 1 kg”) and is therefore indicative and non-binding. The actual cost depends on the final weight and dimensions (including volumetric weight), the destination, the requested services and the conditions applied by brokers/carriers. ItalParcel is not liable for any difference between the estimate and the actual cost where such difference results from weight, dimensions or characteristics differing from those declared by the Customer.",
            it: "Qualsiasi stima fornita prima della ricezione si basa esclusivamente sulle descrizioni e sui dati dichiarati dal Cliente (ad es. “una t-shirt”, “circa 1 kg”) ed è pertanto indicativa e non vincolante. Il costo effettivo dipende dal peso e dalle dimensioni finali (incluso il peso volumetrico), dalla destinazione, dai servizi richiesti e dalle condizioni applicate da broker/vettori. ItalParcel non risponde di alcuna differenza tra la stima e il costo effettivo qualora tale differenza derivi da peso, dimensioni o caratteristiche difformi da quelli dichiarati dal Cliente.",
          },
        ],
      },
      {
        number: "3.10",
        title: {
          en: "Customer's warranties and indemnity",
          it: "Garanzie del Cliente e manleva",
        },
        paras: [
          {
            en: "The Customer warrants that: (i) the goods sent to ItalParcel are lawful, of legitimate origin, non-counterfeit, not subject to undisclosed restrictions, and freely exportable from Italy and importable into the country of destination; (ii) all information, descriptions, values and documents provided are true, accurate and complete; (iii) the Customer holds all rights and authorisations necessary for the shipment of the goods.",
            it: "Il Cliente garantisce che: (i) le merci inviate a ItalParcel sono lecite, di legittima provenienza, non contraffatte, non soggette a restrizioni non dichiarate e liberamente esportabili dall'Italia e importabili nel Paese di destinazione; (ii) tutte le informazioni, descrizioni, valori e documenti forniti sono veri, accurati e completi; (iii) il Cliente detiene tutti i diritti e le autorizzazioni necessarie alla spedizione delle merci.",
          },
          {
            en: "The Customer undertakes to indemnify, defend and hold harmless ItalParcel, its representatives and personnel from and against any damage, loss, fine, penalty, seizure, cost (including reasonable legal expenses) and third-party claims arising from or in connection with: **(a)** breach of the warranties set forth above; **(b)** the shipment of prohibited, restricted, counterfeit or unlawful goods; **(c)** untruthful or incomplete declarations made to ItalParcel, carriers, brokers or authorities; **(d)** the Customer's failure to provide the requested information or documents.",
            it: "Il Cliente si obbliga a manlevare, difendere e tenere indenne ItalParcel, i suoi rappresentanti e il personale da e contro qualsiasi danno, perdita, multa, sanzione, sequestro, costo (comprese le ragionevoli spese legali) e pretesa di terzi derivanti da o connessi a: **(a)** la violazione delle garanzie sopra indicate; **(b)** la spedizione di merci vietate, soggette a restrizioni, contraffatte o illecite; **(c)** dichiarazioni non veritiere o incomplete rese a ItalParcel, ai vettori, ai broker o alle autorità; **(d)** la mancata fornitura da parte del Cliente delle informazioni o dei documenti richiesti.",
          },
          {
            en: "Third parties include, by way of example, trade-mark owners, carriers, brokers, customs authorities and other public authorities. This obligation shall survive termination of the Service.",
            it: "Per terzi si intendono, a titolo esemplificativo, titolari di marchio, vettori, broker, autorità doganali e altre pubbliche autorità. Il presente obbligo permane anche dopo la cessazione del Servizio.",
          },
        ],
      },
    ],
  },
  {
    id: "sec-4",
    number: "4",
    title: {
      en: "Phase 2 — Receipt, opening, processing and transitory handling (taking in charge)",
      it: "Fase 2 — Ricezione, apertura, lavorazione e movimentazione transitoria (presa in carico)",
    },
    subs: [
      {
        number: "4.1",
        title: {
          en: "Taking in charge and accrual of the consideration",
          it: "Presa in carico e maturazione del corrispettivo",
        },
        paras: [
          {
            en: "The ItalParcel consideration remunerates the receipt/collection of the parcel, the opening and repackaging activities, the transitory handling and the preparation for forwarding, and accrues upon taking in charge, irrespective of the successful outcome of the forwarding. The €10 initial advance referred to in Article 3.2 is set off against the consideration due for the first parcel actually taken in charge.",
            it: "Il corrispettivo ItalParcel remunera la ricezione/ritiro del collo, le attività di apertura e re-imballaggio, la movimentazione transitoria e la preparazione all'inoltro, e matura al momento della presa in carico, indipendentemente dall'esito positivo dell'inoltro. L'anticipo iniziale di 10€ di cui all'art. 3.2 è compensato a fronte del corrispettivo dovuto per il primo collo effettivamente preso in carico.",
          },
        ],
      },
      {
        number: "4.2",
        title: {
          en: "Opening, processing, inspection and cooperation with authorities",
          it: "Apertura, lavorazione, ispezione e cooperazione con le autorità",
        },
        paras: [
          {
            en: "By accepting these T&C, the Customer expressly authorises ItalParcel to open, inspect and document the contents of every parcel received, since such activity is essential to the forwarding service and the parcels handled by ItalParcel do not constitute private correspondence.",
            it: "Accettando i presenti T&C, il Cliente autorizza espressamente ItalParcel ad aprire, ispezionare e documentare il contenuto di ogni collo ricevuto, in quanto tale attività è essenziale al servizio di inoltro e i colli gestiti da ItalParcel non costituiscono corrispondenza privata.",
          },
          {
            en: "On the basis of such authorisation, ItalParcel opens all parcels and handles the contents for the activities necessary to the service (by way of example: repackaging, consolidation, preparation for shipping).",
            it: "Sulla base di tale autorizzazione, ItalParcel apre tutti i colli e maneggia il contenuto per le attività necessarie al servizio (a titolo esemplificativo: re-imballaggio, consolidamento, preparazione alla spedizione).",
          },
          {
            en: "In the presence of anomalies or reasonable suspicion (by way of example: prohibited or restricted goods, counterfeiting, unlawfulness, untruthful or inconsistent declarations), ItalParcel may carry out further checks on the contents and request from the Customer information, instructions and supporting documentation (e.g. proof of purchase, proof of payment, documents of legitimate origin and, where available, documents supporting authenticity), without performing any authentication, appraisal or certification activity of any kind.",
            it: "In presenza di anomalie o ragionevoli sospetti (a titolo esemplificativo: merci vietate o soggette a restrizioni, contraffazione, illiceità, dichiarazioni non veritiere o incongruenti), ItalParcel può effettuare ulteriori verifiche sul contenuto e richiedere al Cliente informazioni, istruzioni e documentazione di supporto (ad es. prova di acquisto, prova di pagamento, documenti di legittima provenienza e, ove disponibili, documenti a sostegno dell'autenticità), senza svolgere alcuna attività di autenticazione, stima o certificazione di alcun tipo.",
          },
          {
            en: "Should ItalParcel detect or have reasonable grounds to suspect the presence of unlawful, counterfeit, dangerous or prohibited goods, ItalParcel reserves the right to: (i) immediately suspend processing; (ii) retain the parcel and its contents pending clarifications or transfer to the authorities; (iii) report and cooperate with the competent authorities (law enforcement, customs, trade-mark owners, security teams of carriers or brokers), providing them with any information and documentation in its possession. ItalParcel shall not be liable to the Customer for any consequence of such reporting and cooperation, and the Customer waives any claim in this respect.",
            it: "Qualora ItalParcel rilevi o sospetti fondatamente la presenza di merci illecite, contraffatte, pericolose o vietate, ItalParcel si riserva il diritto di: (i) sospendere immediatamente la lavorazione; (ii) trattenere il collo e il suo contenuto in attesa di chiarimenti o di trasferimento alle autorità; (iii) segnalare e cooperare con le autorità competenti (forze dell'ordine, dogana, titolari di marchi, team di sicurezza dei vettori o broker), fornendo loro qualsiasi informazione e documentazione in suo possesso. ItalParcel non sarà responsabile nei confronti del Cliente per alcuna conseguenza di tale segnalazione e cooperazione, e il Cliente rinuncia a qualsiasi pretesa al riguardo.",
          },
        ],
      },
      {
        number: "4.3",
        title: { en: "Photos (on request)", it: "Foto (su richiesta)" },
        paras: [
          {
            en: "At the Customer's request, ItalParcel may provide up to 3 high-resolution photos of the contents for documentary purposes.",
            it: "Su richiesta del Cliente, ItalParcel può fornire fino a 3 foto ad alta risoluzione del contenuto a fini documentali.",
          },
        ],
      },
      {
        number: "4.4",
        title: {
          en: "Hold for checks / documents / payments",
          it: "Sospensione per verifiche / documenti / pagamenti",
        },
        paras: [
          {
            en: "In the event of requests under Article 4.2, or of missing data, documents, instructions, authorisations or payments, ItalParcel may suspend processing until receipt of what was requested, including any additional fees/considerations, ancillary services or shipping costs.",
            it: "In caso di richieste ai sensi dell'art. 4.2 o di mancanza di dati, documenti, istruzioni, autorizzazioni o pagamenti, ItalParcel può sospendere la lavorazione fino alla ricezione di quanto richiesto, compresi eventuali integrazioni di commissioni/corrispettivi, servizi accessori o costi di spedizione.",
          },
        ],
      },
      {
        number: "4.5",
        title: {
          en: "Returns/case closure for non-shippability, lack of cooperation or non-response",
          it: "Restituzioni/chiusura del caso per non spedibilità, mancata cooperazione o mancato riscontro",
        },
        paras: [
          {
            en: "This Article applies in the cases governed by Articles 3.7 and 3.8, as well as in the case of an unidentifiable parcel, lack of cooperation or non-response by the Customer (e.g. payment, shipping authorisation, data or documents). In such cases, ItalParcel may refuse the shipment and, where possible, return the parcel to the last known sender. Where return is not feasible, ItalParcel may request from the Customer a suitable alternative address; failing that, ItalParcel shall, as a last resort, take the measures permitted by law, including disposal through authorised operators or other lawful destination, with all costs to be borne by the Customer.",
            it: "Il presente articolo si applica nei casi disciplinati dagli artt. 3.7 e 3.8, nonché in caso di pacco non identificabile, mancata cooperazione o mancato riscontro da parte del Cliente (ad es. pagamento, autorizzazione alla spedizione, dati o documenti). In tali casi, ItalParcel può rifiutare la spedizione e, ove possibile, restituire il pacco all'ultimo mittente noto. Qualora la restituzione non sia praticabile, ItalParcel può richiedere al Cliente un indirizzo alternativo idoneo; in mancanza, ItalParcel adotterà in ultima istanza le misure consentite dalla legge, compreso lo smaltimento tramite operatori autorizzati o altra destinazione lecita, con ogni costo a carico del Cliente.",
          },
          {
            en: "Before proceeding, ItalParcel will send to the contact details provided by the Customer: **(a)** two e-mail reminders; **(b)** one reminder via SMS and/or WhatsApp.",
            it: "Prima di procedere, ItalParcel invierà ai recapiti forniti dal Cliente: **(a)** due solleciti via e-mail; **(b)** un sollecito via SMS e/o WhatsApp.",
          },
        ],
      },
    ],
  },
  {
    id: "sec-5",
    number: "5",
    title: {
      en: "Phase 3 — Final quote, payment and shipment (booking and hand-over to the carrier)",
      it: "Fase 3 — Preventivo finale, pagamento e spedizione (prenotazione e consegna al vettore)",
    },
    subs: [
      {
        number: "5.1",
        title: {
          en: "Considerations and payment structure",
          it: "Corrispettivi e struttura del pagamento",
        },
        paras: [
          {
            en: "**(a) ItalParcel fees/considerations:** due for each parcel received/collected and taken in charge; the amounts and brackets are set forth in the price list, the form or ItalParcel's communications, without prejudice to the provisions of Article 3.2 on the €10 initial advance.",
            it: "**(a) Commissioni/corrispettivi ItalParcel:** dovuti per ciascun collo ricevuto/ritirato e preso in carico; gli importi e le fasce sono indicati nel listino, nel modulo o nelle comunicazioni di ItalParcel, fermo quanto previsto all'art. 3.2 in tema di anticipo iniziale di 10€.",
          },
          {
            en: "**(b) Shipping cost (carrier/broker):** distinct from ItalParcel's considerations; determined and communicated to the Customer based on the destination, the final weight and dimensions of the parcel (including, where applicable, volumetric weight) and the conditions applied by the carriers/brokers.",
            it: "**(b) Costo di spedizione (vettore/broker):** distinto dai corrispettivi ItalParcel; determinato e comunicato al Cliente in base alla destinazione, al peso e alle dimensioni finali del collo (compreso, ove applicabile, il peso volumetrico) e alle condizioni applicate dai vettori/broker.",
          },
        ],
      },
      {
        number: "5.2",
        title: {
          en: "Definition of “parcel” for the purpose of the consideration and reclassification",
          it: "Definizione di “collo” ai fini del corrispettivo e riclassificazione",
        },
        paras: [
          {
            en: "For the purpose of calculating the ItalParcel consideration, “one parcel” means a single shipment received by ItalParcel that complies with both of the following parameters: (i) total weight not exceeding **5 kg**; (ii) dimensions not exceeding **60 × 40 × 40 cm**. Where a single parcel exceeds even just one of these parameters without prior notice by the Customer, ItalParcel may apply an increased handling fee of €15. The parameters in this Article refer exclusively to inbound parcels received and do not affect the outbound shipping costs applied by the carrier, which are determined separately pursuant to Article 5.1(b).",
            it: "Ai fini del calcolo del corrispettivo ItalParcel, per “un collo” si intende una singola spedizione ricevuta da ItalParcel che rispetti entrambi i seguenti parametri: (i) peso totale non superiore a **5 kg**; (ii) dimensioni non superiori a **60 × 40 × 40 cm**. Qualora un singolo collo superi anche uno solo di tali parametri senza preventivo avviso del Cliente, ItalParcel può applicare una fee di gestione maggiorata di 15€. I parametri del presente articolo si riferiscono esclusivamente ai pacchi ricevuti in entrata e non incidono sui costi di spedizione applicati dal vettore in uscita, che sono determinati separatamente ai sensi dell'art. 5.1(b).",
          },
          {
            en: "Upon receipt, ItalParcel verifies the actual weight and dimensions of the parcel; any resulting surcharge under this Article is included in the final quote referred to in Article 5.4, which the Customer may accept or reject within the term indicated in Article 7.1. In case of refusal, ItalParcel may proceed pursuant to Article 4.5 (return to sender at the Customer's expense or, where return is not feasible, application of the abandonment procedure).",
            it: "Al momento della ricezione, ItalParcel verifica il peso e le dimensioni effettivi del collo; l'eventuale maggiorazione di cui al presente articolo è inclusa nel preventivo definitivo di cui all'art. 5.4, che il Cliente può accettare o rifiutare entro il termine indicato all'art. 7.1. In caso di rifiuto, ItalParcel può procedere ai sensi dell'art. 4.5 (restituzione al mittente a spese del Cliente o, qualora la restituzione non sia praticabile, applicazione della procedura di abbandono).",
          },
        ],
      },
      {
        number: "5.3",
        title: {
          en: "Tariff structure: published rates and individually negotiated prices",
          it: "Struttura tariffaria: tariffe pubblicate e prezzi negoziati individualmente",
        },
        paras: [
          {
            en: "**(a) Published rates.** The rates published on ItalParcel's website apply to single, standardised parcels, within the quantity, weight and dimensional thresholds indicated in the published price list. Within such thresholds, the published rates are binding and applicable to the Customer.",
            it: "**(a) Tariffe pubblicate.** Le tariffe pubblicate sul sito web di ItalParcel si applicano a colli singoli, standardizzati, entro le soglie quantitative, di peso e dimensionali indicate nel listino pubblicato. Entro tali soglie, le tariffe pubblicate sono vincolanti e applicabili al Cliente.",
          },
          {
            en: "**(b) Individually negotiated prices.** For quantities, weights, dimensions, frequencies or service configurations exceeding the thresholds indicated in the published price list — as expressly specified in the price list itself — the economic terms are agreed individually between ItalParcel and the Customer through written communications (e-mail, WhatsApp or any other channel indicated by ItalParcel), based on parameters such as volumes, frequency, consolidation, type of goods and ancillary services requested. Such individually agreed terms form an integral part of the contractual relationship between the Parties and prevail, for the individual Customer, over the published rates.",
            it: "**(b) Prezzi negoziati individualmente.** Per quantità, pesi, dimensioni, frequenze o configurazioni di servizio che eccedano le soglie indicate nel listino pubblicato — come espressamente specificato nel listino stesso — le condizioni economiche sono concordate individualmente tra ItalParcel e il Cliente attraverso comunicazioni scritte (e-mail, WhatsApp o altro canale indicato da ItalParcel), sulla base di parametri quali volumi, frequenza, consolidamento, tipologia di merce e servizi accessori richiesti. Tali condizioni concordate individualmente formano parte integrante del rapporto contrattuale tra le Parti e prevalgono, per il singolo Cliente, sulle tariffe pubblicate.",
          },
          {
            en: "**(c) Updates.** ItalParcel may update the published rates at any time. Updates apply to parcels taken in charge after publication of the new rates and do not affect parcels already taken in charge under the previous conditions. Individually agreed terms remain valid for the duration agreed between the Parties.",
            it: "**(c) Aggiornamenti.** ItalParcel può aggiornare le tariffe pubblicate in qualsiasi momento. Gli aggiornamenti si applicano ai colli presi in carico successivamente alla pubblicazione delle nuove tariffe e non incidono sui colli già presi in carico alle condizioni precedenti. Le condizioni concordate individualmente restano valide per la durata pattuita tra le Parti.",
          },
        ],
      },
      {
        number: "5.4",
        title: {
          en: "Final quote and shipping authorisation",
          it: "Preventivo finale e autorizzazione alla spedizione",
        },
        paras: [
          {
            en: "Once the parcel has been taken in charge and prepared (by way of example: repackaging and/or consolidation), ItalParcel communicates to the Customer the final quote inclusive of shipping costs and any ancillary services requested. The shipment is booked and the parcel is handed over to the carrier only upon acceptance of the quote and full payment of the amounts due (including any adjustments to considerations/services and shipping costs).",
            it: "Effettuata la presa in carico e la preparazione del collo (a titolo esemplificativo: re-imballaggio e/o consolidamento), ItalParcel comunica al Cliente il preventivo finale comprensivo dei costi di spedizione e degli eventuali servizi accessori richiesti. La spedizione è prenotata e il collo è consegnato al vettore solo a fronte dell'accettazione del preventivo e del pagamento integrale degli importi dovuti (compresi eventuali aggiustamenti di corrispettivi/servizi e i costi di spedizione).",
          },
        ],
      },
      {
        number: "5.5",
        title: {
          en: "Non-payment or lack of authorisation",
          it: "Mancato pagamento o mancata autorizzazione",
        },
        paras: [
          {
            en: "In the event of non-payment and/or lack of shipping authorisation, ItalParcel may suspend performance and place the case on hold pursuant to Article 4.4. Should the absence of payment or authorisation persist, Articles 3.2(b) and 4.5 shall apply. The considerations accrued for the activities already performed remain due.",
            it: "In caso di mancato pagamento e/o di mancata autorizzazione alla spedizione, ItalParcel può sospendere l'esecuzione e porre il caso in sospensione ai sensi dell'art. 4.4. Qualora l'assenza di pagamento o autorizzazione persista, si applicano gli artt. 3.2(b) e 4.5. Restano dovuti i corrispettivi maturati per le attività già svolte.",
          },
        ],
      },
      {
        number: "5.6",
        title: {
          en: "Export customs and declarations; exporter",
          it: "Dogana di esportazione e dichiarazioni; esportatore",
        },
        paras: [
          {
            en: "For extra-EU shipments, ItalParcel acts as exporter and prepares the customs documentation on the basis of the data and documents provided by the Customer pursuant to Article 3.8(a). The Customer remains responsible for the accuracy and verifiability of such data and shall provide any further documentation requested by ItalParcel, the broker, the carrier and/or the competent authorities.",
            it: "Per le spedizioni extra-UE, ItalParcel agisce in qualità di esportatore e predispone la documentazione doganale sulla base dei dati e dei documenti forniti dal Cliente ai sensi dell'art. 3.8(a). Il Cliente resta responsabile dell'accuratezza e verificabilità di tali dati e fornirà ogni ulteriore documentazione richiesta da ItalParcel, dal broker, dal vettore e/o dalle autorità competenti.",
          },
        ],
      },
      {
        number: "5.7",
        title: { en: "Declaration of value", it: "Dichiarazione di valore" },
        paras: [
          {
            en: "At the time of activation, the Customer may declare the value of the goods and must be able to evidence it (invoice, proof of purchase or equivalent document).",
            it: "In fase di attivazione il Cliente può dichiarare il valore della merce e deve essere in grado di comprovarlo (fattura, prova d'acquisto o documento equivalente).",
          },
          {
            en: "This declared and evidenced value is relevant solely for the purposes of the limit of liability under Article 7.3. It does not bind ItalParcel as to the actual value of the goods and does not entitle the Customer to any reimbursement beyond that limit.",
            it: "Tale valore dichiarato e comprovato rileva esclusivamente ai fini del limite di responsabilità di cui all'art. 7.3. Esso non vincola ItalParcel quanto al valore effettivo della merce e non attribuisce al Cliente alcun diritto a rimborso oltre tale limite.",
          },
          {
            en: "ItalParcel does not appraise, authenticate or certify the value of the goods; the figure declared by the Customer is used only as the ceiling referred to in Article 7.3. In any event, the shipment travels with the carrier's minimum liability provided by applicable law, without prejudice to Articles 6.3 and 7.3.",
            it: "ItalParcel non effettua stime, autenticazioni o certificazioni del valore della merce; l'importo dichiarato dal Cliente è utilizzato unicamente quale massimale di cui all'art. 7.3. In ogni caso, la spedizione viaggia con la responsabilità minima del vettore prevista dalla normativa applicabile, fermo quanto previsto dagli artt. 6.3 e 7.3.",
          },
        ],
      },
      {
        number: "5.8",
        title: { en: "Hand-over to the carrier", it: "Consegna al vettore" },
        paras: [
          {
            en: "From the moment the tracking confirms collection/acceptance of the parcel by the carrier (hand-over to the carrier), the transport, delivery, checks, any customs clearance procedures and the collection of duties/charges depend on the carrier/broker and their respective procedures; ItalParcel cannot influence such timings nor guarantee the outcome.",
            it: "Dal momento in cui il tracking attesta il ritiro/accettazione del collo da parte del vettore (consegna al vettore), il trasporto, la consegna, le verifiche, le eventuali procedure di sdoganamento e l'incasso di dazi/oneri dipendono dal vettore/broker e dalle relative procedure; ItalParcel non può influire su tali tempistiche né garantirne l'esito.",
          },
        ],
      },
      {
        number: "5.9",
        title: {
          en: "Payment methods, terms and chargeback",
          it: "Modalità di pagamento, termini e chargeback",
        },
        paras: [
          {
            en: "**(a) Accepted methods.** Payments to ItalParcel may be made via: (i) bank transfer (SEPA, including SEPA Instant); (ii) payment link sent by ItalParcel to the Customer, allowing payment by card (credit, debit, prepaid), Apple Pay, Google Pay, Revolut Pay and instant transfer.",
            it: "**(a) Metodi accettati.** I pagamenti a ItalParcel possono essere effettuati tramite: (i) bonifico bancario (SEPA, incluso SEPA Instant); (ii) link di pagamento inviato da ItalParcel al Cliente, che consente il pagamento tramite carta (di credito, di debito, prepagata), Apple Pay, Google Pay, Revolut Pay e bonifico istantaneo.",
          },
          {
            en: "**(b) Currency and bank charges.** All amounts are expressed and payable in Euros (€). Bank fees, currency conversion costs and intermediation fees applied by the Customer's bank or payment provider are at the Customer's expense; the amount actually received by ItalParcel must correspond to the amount due, net of any deductions.",
            it: "**(b) Valuta e oneri bancari.** Tutti gli importi sono espressi e dovuti in Euro (€). Le commissioni bancarie, i costi di conversione valutaria e le commissioni di intermediazione applicate dalla banca o dal provider di pagamento del Cliente sono a carico del Cliente; l'importo effettivamente ricevuto da ItalParcel deve corrispondere all'importo dovuto, al netto di qualsiasi deduzione.",
          },
          {
            en: "**(c) Payment terms.** Save where otherwise agreed in writing, the Customer shall pay the amounts due (ItalParcel considerations net of the €10 initial advance, shipping costs and any ancillary charges) within 3 Business Days of receipt of the relevant invoice or payment request. Failure to pay within such term entitles ItalParcel to place the case on hold pursuant to Article 4.4 and, where applicable, to apply Article 4.5.",
            it: "**(c) Tempi di pagamento.** Salvo diverso accordo scritto, il Cliente deve pagare gli importi dovuti (corrispettivi ItalParcel al netto dell'anticipo iniziale di 10€, costi di spedizione ed eventuali oneri accessori) entro 3 Giorni Lavorativi dalla ricezione della relativa fattura o richiesta di pagamento. Il mancato pagamento entro tale termine legittima ItalParcel a porre il caso in sospensione ai sensi dell'art. 4.4 e, ove applicabile, ad applicare l'art. 4.5.",
          },
          {
            en: "**(d) Chargeback and payment disputes.** The Customer undertakes not to initiate chargeback procedures, payment disputes or unauthorised reversals of payments made to ItalParcel for services duly performed or in the course of being performed. Any unjustified chargeback constitutes a breach of these T&C.",
            it: "**(d) Chargeback e contestazioni di pagamento.** Il Cliente si impegna a non avviare procedure di chargeback, contestazioni di pagamento o storni non autorizzati di pagamenti effettuati a ItalParcel per servizi regolarmente eseguiti o in corso di esecuzione. Qualsiasi chargeback ingiustificato costituisce inadempimento dei presenti T&C.",
          },
          {
            en: "In such case, ItalParcel is entitled to: (i) suspend any service in progress and refuse future services to the Customer; (ii) recover from the Customer the disputed amount, the chargeback fees applied by the payment provider and any related cost, including legal expenses; (iii) submit to the payment provider, the issuing bank and any competent authority the documentation evidencing the Customer's acceptance of the T&C, the services rendered and the amounts due — including timestamped acceptance records, communications, tracking data and proof of hand-over to the carrier. The Customer expressly authorises such transmission of data for the purpose of contesting the chargeback.",
            it: "In tal caso, ItalParcel è legittimata a: (i) sospendere qualsiasi servizio in corso e rifiutare servizi futuri al Cliente; (ii) recuperare dal Cliente l'importo contestato, le commissioni di chargeback applicate dal provider di pagamento e ogni costo correlato, comprese le spese legali; (iii) trasmettere al provider di pagamento, alla banca emittente e a qualsiasi autorità competente la documentazione che attesti l'accettazione dei T&C da parte del Cliente, i servizi resi e gli importi dovuti — comprese le registrazioni temporali di accettazione, le comunicazioni, i dati di tracking e la prova della consegna al vettore. Il Cliente autorizza espressamente tale comunicazione di dati ai fini della contestazione del chargeback.",
          },
        ],
      },
    ],
  },
  {
    id: "sec-6",
    number: "6",
    title: {
      en: "Phase 4 — After shipment (tracking, import customs, events and claims)",
      it: "Fase 4 — Dopo la spedizione (tracking, dogana di importazione, eventi e reclami)",
    },
    subs: [
      {
        number: "6.1",
        title: { en: "Tracking and events", it: "Tracking ed eventi" },
        paras: [
          {
            en: "ItalParcel provides informational assistance on tracking and, where possible, support in operational communications. Inspections, suspensions, blocks or requests for information from carriers/brokers/authorities are not under ItalParcel's control; external events (e.g. strikes, weather conditions, holidays, controls) may cause delays or routing changes.",
            it: "ItalParcel fornisce assistenza informativa sul tracking e, ove possibile, supporto nelle comunicazioni operative. Ispezioni, sospensioni, blocchi o richieste di informazioni da parte di vettori/broker/autorità non sono sotto il controllo di ItalParcel; eventi esterni (ad es. scioperi, condizioni meteorologiche, festività, controlli) possono causare ritardi o cambi di tratta.",
          },
        ],
      },
      {
        number: "6.2",
        title: {
          en: "Import charges in the country of destination",
          it: "Oneri di importazione nel Paese di destinazione",
        },
        paras: [
          {
            en: "Duties, VAT, import/customs-clearance charges and other charges applied in the country of destination are at the recipient's/Customer's expense.",
            it: "Dazi, IVA, oneri di importazione/sdoganamento e altri oneri applicati nel Paese di destinazione sono a carico del destinatario/Cliente.",
          },
        ],
      },
      {
        number: "6.3",
        title: {
          en: "Damage in transit; packaging and allocation of liability",
          it: "Danni da trasporto; imballaggio e ripartizione delle responsabilità",
        },
        paras: [
          {
            en: "ItalParcel performs repackaging and protection activities with professional diligence, applying the packaging guidelines of the carrier used for the specific shipment and, where necessary, adapting the protections to the nature of the goods.",
            it: "ItalParcel svolge le attività di re-imballaggio e protezione con professionale diligenza, applicando le linee guida di imballaggio del vettore utilizzato per la specifica spedizione e, ove necessario, adattando le protezioni alla natura delle merci.",
          },
          {
            en: "The Customer acknowledges that, once hand-over to the carrier has occurred, any damage occurring during transport must be contested in accordance with the carrier's rules. It is understood that, if the damage is attributable to the carrier's conduct during transport, liability rests with the carrier; if, on the other hand, the damage is causally attributable to inadequate packaging performed by ItalParcel, liability rests with ItalParcel within the limits of the law.",
            it: "Il Cliente prende atto che, una volta avvenuta la consegna al vettore, eventuali danni occorsi durante il trasporto devono essere contestati secondo le regole del vettore. Resta inteso che, se il danno è imputabile al comportamento del vettore durante il trasporto, la responsabilità è del vettore; se invece il danno è causalmente imputabile a un imballaggio inadeguato eseguito da ItalParcel, la responsabilità resta a carico di ItalParcel nei limiti di legge.",
          },
        ],
      },
      {
        number: "6.4",
        title: {
          en: "Loss claim (only upon Customer's request)",
          it: "Reclamo per smarrimento (solo su richiesta del Cliente)",
        },
        paras: [
          {
            en: "ItalParcel does not open claims automatically. Where a parcel is lost in transit, the Customer must request ItalParcel in writing (e-mail, SMS or WhatsApp), without undue delay and in any case within 24 working hours from the moment the Customer became, or ought to have become, aware of the loss (for example, upon the carrier's notification, or upon non-delivery by the expected date with no further tracking updates), to open or assist with a claim before the carrier. Carriers' deadlines for loss claims are particularly short; delays by the Customer may result in forfeiture of the right to compensation. ItalParcel is not liable for forfeitures or rejections caused by a late or incomplete request.",
            it: "ItalParcel non apre reclami automaticamente. In caso di smarrimento durante il trasporto, il Cliente deve richiedere a ItalParcel per iscritto (e-mail, SMS o WhatsApp), senza ingiustificato ritardo e comunque entro 24 ore lavorative dal momento in cui ha avuto, o avrebbe dovuto avere, conoscenza dello smarrimento (ad esempio dalla notifica del vettore, oppure dal mancato recapito entro la data prevista con tracking non più aggiornato), di aprire o assistere un reclamo presso il vettore. I termini dei vettori per i reclami di smarrimento sono particolarmente brevi; ritardi del Cliente possono comportare la decadenza dal diritto al risarcimento. ItalParcel non è responsabile per decadenze o rigetti causati da una richiesta tardiva o incompleta.",
          },
          {
            en: "With the request, the Customer provides: invoice, receipt or other evidence of the value of the contents; the shipment tracking reference, where not already in ItalParcel's possession; any communications with the recipient evidencing non-receipt; any further document required by the carrier. Late or incomplete documentation may result in rejection of the claim.",
            it: "Con la richiesta il Cliente fornisce: fattura, ricevuta o altra prova del valore del contenuto; il riferimento di tracking della spedizione, ove non già in possesso di ItalParcel; eventuali comunicazioni con il destinatario che attestino la mancata ricezione; ogni ulteriore documento richiesto dal vettore. Documentazione tardiva o incompleta può comportare il rigetto del reclamo.",
          },
          {
            en: "Any compensation obtainable from the carrier is subject to the carrier's limits and conditions. ItalParcel's own liability, where applicable, remains limited as set out in Article 7.3.",
            it: "Qualsiasi risarcimento ottenibile dal vettore è soggetto ai limiti e alle condizioni del vettore. La responsabilità propria di ItalParcel, ove applicabile, resta limitata secondo quanto previsto dall'art. 7.3.",
          },
        ],
      },
      {
        number: "6.5",
        title: { en: "Third-party terms", it: "Termini di soggetti terzi" },
        paras: [
          {
            en: "For shipping and the management of claims, the terms and conditions of the carrier applied to the specific shipment shall also apply. In case of conflict, for the purposes of claims, the conditions of the carrier shall prevail.",
            it: "Per la spedizione e la gestione dei reclami si applicano i termini e le condizioni del vettore applicati alla specifica spedizione. In caso di conflitto, ai fini dei reclami prevalgono le condizioni del vettore.",
          },
          {
            en: "The specific carrier applied to each shipment is communicated to the Customer in the final quote pursuant to Article 5.4. The Customer may consult the carrier's terms and conditions and claim procedures on the carrier's official website.",
            it: "Il vettore specifico applicato a ciascuna spedizione è comunicato al Cliente con il preventivo finale ai sensi dell'art. 5.4. Il Cliente può consultare i termini e le condizioni del vettore e le procedure di reclamo sul sito ufficiale del vettore.",
          },
        ],
      },
    ],
  },
  {
    id: "sec-7",
    number: "7",
    title: {
      en: "Cross-cutting provisions (applicable in every phase)",
      it: "Disposizioni trasversali (applicabili in ogni fase)",
    },
    subs: [
      {
        number: "7.1",
        title: {
          en: "Cooperation and response times",
          it: "Cooperazione e tempi di riscontro",
        },
        paras: [
          {
            en: "Should the carrier/broker/authorities request additional information, or should ItalParcel request instructions, payments or documents from the Customer, the Customer undertakes to respond within **36 working hours** from the request sent through the channels indicated by ItalParcel. Such response term may be extended by ItalParcel at its discretion in case of public holidays in the Customer's country or documented impediments communicated by the Customer in advance. In the absence of a useful response within the applicable term, ItalParcel may apply Article 4.4 (hold) and, where the conditions are met, Article 4.5.",
            it: "Qualora il vettore/broker/autorità richiedano informazioni aggiuntive, o qualora ItalParcel richieda istruzioni, pagamenti o documenti al Cliente, il Cliente si impegna a rispondere entro **36 ore lavorative** dalla richiesta inviata tramite i canali indicati da ItalParcel. Tale termine di risposta può essere prorogato da ItalParcel a sua discrezione in caso di festività pubbliche nel Paese del Cliente o impedimenti documentati comunicati dal Cliente in anticipo. In mancanza di un riscontro utile entro il termine applicabile, ItalParcel può applicare l'art. 4.4 (sospensione) e, ove ricorrano i presupposti, l'art. 4.5.",
          },
        ],
      },
      {
        number: "7.2",
        title: {
          en: "Exclusion of indirect damages",
          it: "Esclusione dei danni indiretti",
        },
        paras: [
          {
            en: "In any case, ItalParcel shall not be liable for: **(a)** loss of profit; **(b)** loss of business opportunities; **(c)** any other indirect, consequential, special or punitive damage; **(d)** loss of data; even if such damages were foreshadowed or foreseeable.",
            it: "In ogni caso, ItalParcel non risponde di: **(a)** lucro cessante; **(b)** perdita di opportunità commerciali; **(c)** qualsiasi altro danno indiretto, consequenziale, speciale o punitivo; **(d)** perdita di dati; anche qualora tali danni siano stati prospettati o prevedibili.",
          },
        ],
      },
      {
        number: "7.3",
        title: { en: "Limits of liability", it: "Limiti di responsabilità" },
        paras: [
          {
            en: "Without prejudice to mandatory provisions of law, and save in cases of wilful misconduct or gross negligence, ItalParcel's overall liability, on any basis whatsoever and for any cause connected with a single parcel for which ItalParcel is responsible, shall in no case exceed the lower of the two amounts set out in points (a) and (b) below: **(a)** the value of the goods declared by the Customer at the time of activation; and **(b)** the value evidenced by the Customer by means of an invoice or other suitable proof of value.",
            it: "Fermo quanto previsto dalle disposizioni inderogabili di legge, e salvo i casi di dolo o colpa grave, la responsabilità complessiva di ItalParcel, a qualunque titolo e per qualsiasi causa connessa al singolo collo di cui ItalParcel sia responsabile, non potrà in nessun caso eccedere il minore dei due importi indicati ai successivi punti (a) e (b): **(a)** il valore della merce dichiarato dal Cliente al momento dell'attivazione; e **(b)** il valore comprovato dal Cliente mediante fattura o altra idonea prova del valore.",
          },
          {
            en: "The Customer bears the burden of proving the value of the goods. Where no value has been declared and evidenced, ItalParcel's liability shall not exceed the ItalParcel consideration paid for that parcel. This limit does not concern loss or damage occurring during carriage, for which the carrier is liable in accordance with Articles 5.8 and 6.3.",
            it: "L'onere di provare il valore della merce grava sul Cliente. In assenza di un valore dichiarato e comprovato, la responsabilità di ItalParcel non potrà eccedere il corrispettivo ItalParcel pagato per quel collo. Il presente limite non riguarda lo smarrimento o il danneggiamento avvenuti durante il trasporto, di cui risponde il vettore ai sensi degli artt. 5.8 e 6.3.",
          },
          {
            en: "The limitations set forth in this Article apply to the maximum extent permitted by applicable law. Nothing in this Article limits ItalParcel's liability for willful misconduct or gross negligence, nor any liability that cannot be limited under the mandatory legislation applicable to the Customer where the latter qualifies as a consumer.",
            it: "Le limitazioni previste dal presente articolo si applicano nella massima misura consentita dalla legge applicabile. Nulla nel presente articolo limita la responsabilità di ItalParcel per dolo o colpa grave, né alcuna responsabilità che non possa essere limitata in base alla normativa imperativa applicabile al Cliente qualora questi qualifichi come consumatore.",
          },
        ],
      },
    ],
  },
  {
    id: "sec-8",
    number: "8",
    title: {
      en: "Governing law, jurisdiction, force majeure and general provisions",
      it: "Legge applicabile, foro competente, forza maggiore e disposizioni generali",
    },
    subs: [
      {
        number: "8.1",
        title: { en: "Governing law", it: "Legge applicabile" },
        paras: [
          {
            en: "These T&C and the Service are governed by Italian law, without prejudice to the mandatory consumer-protection rules in force in the country of residence of the Customer where the latter qualifies as a consumer.",
            it: "I presenti T&C e il Servizio sono regolati dalla legge italiana, fatte salve le norme imperative a tutela del consumatore vigenti nel Paese di residenza del Cliente qualora questi qualifichi come consumatore.",
          },
        ],
      },
      {
        number: "8.2",
        title: { en: "Jurisdiction", it: "Foro competente" },
        paras: [
          {
            en: "For any dispute arising from or connected with these T&C, the **Court of Trento** shall have exclusive jurisdiction. Where the Customer qualifies as a consumer, the mandatory rules on the jurisdiction of the consumer's forum in the consumer's country of residence apply.",
            it: "Per qualsiasi controversia derivante da o connessa ai presenti T&C, il **Foro di Trento** avrà competenza esclusiva. Qualora il Cliente qualifichi come consumatore, si applicano le norme imperative sulla competenza del foro del consumatore del Paese di residenza del consumatore.",
          },
        ],
      },
      {
        number: "8.3",
        title: { en: "Force majeure", it: "Forza maggiore" },
        paras: [
          {
            en: "ItalParcel shall not be liable for delays or non-performance caused by events beyond its reasonable control, including, by way of example and not exhaustively, strikes, lockouts, weather events, pandemics, governmental measures, customs suspensions, carrier disruptions, IT outages, embargoes and acts of public authorities.",
            it: "ItalParcel non sarà responsabile per ritardi o inadempimenti causati da eventi al di fuori del proprio ragionevole controllo, comprese, a titolo esemplificativo e non esaustivo, scioperi, serrate, eventi atmosferici, pandemie, provvedimenti governativi, sospensioni doganali, disservizi del vettore, interruzioni informatiche, embarghi e atti di pubbliche autorità.",
          },
        ],
      },
      {
        number: "8.4",
        title: { en: "Amendments", it: "Modifiche" },
        paras: [
          {
            en: "ItalParcel may amend these T&C at any time by publishing the updated version on its website and giving notice to active Customers via e-mail, WhatsApp or SMS with at least 15 working days' prior notice before the amendment takes effect. Continued use of the Service after such term constitutes acceptance.",
            it: "ItalParcel può modificare i presenti T&C in qualsiasi momento pubblicando la versione aggiornata sul proprio sito web e dandone comunicazione ai Clienti attivi via e-mail, WhatsApp o SMS con almeno 15 giorni lavorativi di preavviso rispetto all'entrata in vigore della modifica. L'utilizzo continuativo del Servizio dopo tale termine costituisce accettazione.",
          },
        ],
      },
      {
        number: "8.5",
        title: {
          en: "Language and prevailing version",
          it: "Lingua e versione prevalente",
        },
        paras: [
          {
            en: "These T&C are drafted in Italian and English. In case of discrepancy or conflict between the two versions, the Italian version shall prevail.",
            it: "I presenti T&C sono redatti in italiano e in inglese. In caso di discrepanza o conflitto tra le due versioni, prevarrà la versione italiana.",
          },
        ],
      },
      {
        number: "8.6",
        title: { en: "Privacy", it: "Privacy" },
        paras: [
          {
            en: "The processing of personal data is governed by the [Privacy Policy](/privacy) published on ItalParcel's website, which forms an integral part of these T&C and is hereby incorporated by reference. The Customer declares having reviewed and accepted the Privacy Policy before activation of the Service.",
            it: "Il trattamento dei dati personali è disciplinato dall'[Informativa Privacy](/privacy) pubblicata sul sito web di ItalParcel, che forma parte integrante dei presenti T&C ed è qui incorporata mediante rinvio. Il Cliente dichiara di aver preso visione e accettato l'Informativa Privacy prima dell'attivazione del Servizio.",
          },
        ],
      },
      {
        number: "8.7",
        title: {
          en: "Acceptance and specific approval of clauses",
          it: "Accettazione e approvazione specifica delle clausole",
        },
        paras: [
          {
            en: "Acceptance occurs online through two separate check-boxes: **(i)** acceptance of the General Terms and Conditions and the Privacy Policy; **(ii)** specific approval, pursuant to Articles 1341 and 1342 of the Italian Civil Code, of clauses 3.2(b), 3.10, 4.5, 5.9, 7.3 and 8.2.",
            it: "L'accettazione avviene online tramite due distinte caselle di spunta: **(i)** accettazione dei Termini e Condizioni Generali e dell'Informativa Privacy; **(ii)** approvazione specifica, ai sensi degli artt. 1341 e 1342 del Codice Civile italiano, delle clausole 3.2(b), 3.10, 4.5, 5.9, 7.3 e 8.2.",
          },
        ],
      },
    ],
  },
];

function subId(number: string) {
  return `sec-${number.replace(/\./g, "-")}`;
}

export function TermsContent() {
  const [lang, setLang] = useState<LegalLang>("en");
  return (
    <LegalLayout
      title={TITLE[lang]}
      updated={UPDATED[lang]}
      toc={TOC.map((t) => ({ id: t.id, label: t.label[lang] }))}
      lang={lang}
      onLangChange={setLang}
    >
      {SECTIONS.map((sec) => (
        <Section key={sec.id} id={sec.id} number={sec.number} title={sec.title[lang]}>
          {sec.paras?.map((p, i) => <Rich key={i} text={p[lang]} />)}
          {sec.subs?.map((sub) => (
            <Sub
              key={sub.number}
              id={subId(sub.number)}
              number={sub.number}
              title={sub.title[lang]}
            >
              {sub.paras.map((p, i) => (
                <Rich key={i} text={p[lang]} />
              ))}
            </Sub>
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
