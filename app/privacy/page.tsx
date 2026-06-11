import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { PrivacyContent } from "@/components/legal/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "ItalParcel Privacy Policy (English and Italian) — how we collect, use and protect personal data in accordance with the GDPR.",
};

export default function PrivacyPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <PrivacyContent />
      </main>
      <Footer />
    </>
  );
}
