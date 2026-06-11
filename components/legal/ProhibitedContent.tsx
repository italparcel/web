"use client";

import { useState } from "react";
import { Ban } from "lucide-react";
import { LegalLayout, Rich, type LegalLang } from "@/components/LegalLayout";

type L = { en: string; it: string };
type Item = { category: L; description: L };

const TITLE: L = { en: "Prohibited items", it: "Articoli proibiti" };
const UPDATED: L = {
  en: "Annex to the Terms and Conditions · English version",
  it: "Allegato ai Termini e Condizioni · Versione italiana",
};

const INTRO: L = {
  en: "To ensure safe and legal shipping, ItalParcel cannot handle the following categories of items. Please review this list carefully before placing your orders. This page forms an integral part of the [Terms & Conditions](/terms).",
  it: "Per garantire spedizioni sicure e legali, ItalParcel non può gestire le seguenti categorie di articoli. Si prega di consultare attentamente questo elenco prima di effettuare i propri ordini. Questa pagina forma parte integrante dei [Termini e Condizioni](/terms).",
};

const ITEMS: Item[] = [
  {
    category: { en: "Alcohol and derivatives", it: "Alcol e derivati" },
    description: { en: "Of any kind.", it: "Di qualsiasi tipo." },
  },
  {
    category: { en: "Perishable foods", it: "Alimenti deperibili" },
    description: {
      en: "Always prohibited. Sealed/vacuum-packed or long-life food is not automatically excluded but must be indicated in the contact form, where the applicable procedures will be explained (for example, prior notice/FDA code for the USA).",
      it: "Sempre vietati. Il cibo sigillato/sottovuoto o a lunga conservazione non è automaticamente escluso ma deve essere indicato nel form di contatto, dove verranno spiegate le procedure applicabili (ad esempio, preavviso/codice FDA per gli USA).",
    },
  },
  {
    category: { en: "Animals", it: "Animali" },
    description: {
      en: "Alive or dead, including fur.",
      it: "Vivi o morti, incluse le pellicce.",
    },
  },
  {
    category: { en: "Weapons and ammunition", it: "Armi e munizioni" },
    description: {
      en: "Any type, including parts, ammunition, pistols, rifles, air rifles, knives, replicas.",
      it: "Di qualsiasi tipo, incluse parti, munizioni, pistole, fucili, fucili ad aria compressa, coltelli, repliche.",
    },
  },
  {
    category: { en: "Biological samples", it: "Campioni biologici" },
    description: {
      en: "Organs, tissues, cells, bacteria, viruses, DNA, RNA, chemical waste, blood, urine, saliva, etc.",
      it: "Organi, tessuti, cellule, batteri, virus, DNA, RNA, rifiuti chimici, sangue, urina, saliva, ecc.",
    },
  },
  {
    category: { en: "Money", it: "Denaro" },
    description: {
      en: "Cash, checks, bills of exchange, coins, credit/debit/prepaid cards, collectible coins or banknotes, vouchers, smart cards (gift cards, SIM cards, etc.).",
      it: "Contanti, assegni, cambiali, monete, carte di credito/debito/prepagate, monete o banconote da collezione, voucher, smart card (gift card, SIM, ecc.).",
    },
  },
  {
    category: {
      en: "Stamps and revenue stamps",
      it: "Valori bollati e marche da bollo",
    },
    description: {
      en: "Official stamps, government documents, tobacco, alcohol, state lottery, postage stamps, revenue stamps, etc.",
      it: "Bolli ufficiali, documenti governativi, tabacco, alcol, lotteria di Stato, francobolli, marche da bollo, ecc.",
    },
  },
  {
    category: { en: "Real jewelry", it: "Gioielli veri" },
    description: {
      en: "Plated jewelry and watches (gold, silver, platinum), gems and stones, precious metals, real pearls, fine gold, etc.",
      it: "Gioielli e orologi placcati (oro, argento, platino), gemme e pietre, metalli preziosi, perle vere, oro fino, ecc.",
    },
  },
  {
    category: { en: "Medicines", it: "Medicinali" },
    description: {
      en: "Food supplements and/or pharmaceutical products, even those requiring a prescription.",
      it: "Integratori alimentari e/o prodotti farmaceutici, anche quelli soggetti a prescrizione.",
    },
  },
  {
    category: { en: "Dangerous goods ADR/LQ", it: "Merci pericolose ADR/LQ" },
    description: {
      en: "Perfumes, lighters, paints, chemicals, gunpowder, gaseous articles (aerosols, sprays), fire extinguishers, magnets, batteries, radioactive material, flammable, oxidizing, corrosive or adhesive substances, agricultural products, etc.",
      it: "Profumi, accendini, vernici, sostanze chimiche, polvere da sparo, articoli gassosi (aerosol, spray), estintori, magneti, batterie, materiale radioattivo, sostanze infiammabili, ossidanti, corrosive o adesive, prodotti agricoli, ecc.",
    },
  },
  {
    category: { en: "Opiates and derivatives", it: "Oppiacei e derivati" },
    description: {
      en: "All narcotic or psychotropic substances, including cannabis and all derivatives.",
      it: "Tutte le sostanze stupefacenti o psicotrope, inclusa la cannabis e tutti i derivati.",
    },
  },
  {
    category: { en: "Plants", it: "Piante" },
    description: {
      en: "Plants of all species, live or dried, seeds, flowers, hemp inflorescence.",
      it: "Piante di ogni specie, vive o essiccate, semi, fiori, infiorescenze di canapa.",
    },
  },
  {
    category: {
      en: "International restrictions",
      it: "Restrizioni internazionali",
    },
    description: {
      en: "Any goods prohibited in the country of dispatch or destination (ICAO, IATA, CITES, DUAL USE, etc.).",
      it: "Qualsiasi merce vietata nel Paese di spedizione o di destinazione (ICAO, IATA, CITES, DUAL USE, ecc.).",
    },
  },
  {
    category: { en: "Tobacco", it: "Tabacco" },
    description: {
      en: "Cigarettes, cigars, vaping products, cannabis, etc.",
      it: "Sigarette, sigari, prodotti per svapo, cannabis, ecc.",
    },
  },
  {
    category: { en: "Funeral transport", it: "Trasporto funebre" },
    description: {
      en: "Human remains, funeral transport, ashes.",
      it: "Resti umani, trasporto funebre, ceneri.",
    },
  },
  {
    category: {
      en: "Motor vehicles and mechanical parts",
      it: "Veicoli a motore e parti meccaniche",
    },
    description: {
      en: "Generators, any type of motor vehicle, engine and mechanical parts.",
      it: "Generatori, qualsiasi tipo di veicolo a motore, motori e parti meccaniche.",
    },
  },
];

export function ProhibitedContent() {
  const [lang, setLang] = useState<LegalLang>("en");
  return (
    <LegalLayout
      title={TITLE[lang]}
      updated={UPDATED[lang]}
      toc={[]}
      lang={lang}
      onLangChange={setLang}
    >
      <div className="text-sm leading-relaxed text-fg-muted md:text-base">
        <Rich text={INTRO[lang]} />
      </div>

      <ul className="mt-10 divide-y divide-border rounded-2xl border border-border bg-bg-elev">
        {ITEMS.map((item) => (
          <li key={item.category.en} className="flex gap-4 p-5 md:p-6">
            <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border-strong text-fg-muted">
              <Ban size={14} />
            </span>
            <div>
              <h2 className="text-base font-semibold text-fg md:text-lg">
                {item.category[lang]}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-fg-muted">
                {item.description[lang]}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-10 text-sm leading-relaxed text-fg-muted">
        <Rich
          text={
            lang === "it"
              ? "In caso di dubbi su un articolo specifico, indicalo nel [form di contatto](/#contact) prima di ordinare: rispondiamo entro 36 ore lavorative."
              : "If you're unsure about a specific item, mention it in the [contact form](/#contact) before ordering — we reply within 36 working hours."
          }
        />
      </div>

      <div className="mt-16 border-t border-border pt-6 text-xs text-fg-subtle">
        ItalParcel di Samuel Borghesi · contact@italparcel.com · P.IVA: IT
        02818050227 · +39 329 313 0206 ({lang === "it" ? "no chiamate" : "no calls"})
      </div>
    </LegalLayout>
  );
}
