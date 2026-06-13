import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { TermsContent } from "@/components/legal/TermsContent";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "ItalParcel Terms and Conditions (English and Italian) — the rules that govern the parcel forwarding service offered by ItalParcel di Samuel Borghesi.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <TermsContent />
      </main>
      <Footer />
    </>
  );
}
