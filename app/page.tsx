import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Reach } from "@/components/sections/Reach";
import { Statement } from "@/components/sections/Statement";
import { Features } from "@/components/sections/Features";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { ContactForm } from "@/components/sections/ContactForm";
import { Footer } from "@/components/sections/Footer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { FAQS } from "@/lib/faqs";

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero />
        <Marquee />
        <HowItWorks />
        <Reach />
        <Statement />
        <Features />
        <Pricing />
        <FAQ />
        <ContactForm />
      </main>
      <Footer />
      <WhatsAppFab />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
    </>
  );
}
