import type { Metadata } from "next";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { ProhibitedContent } from "@/components/legal/ProhibitedContent";

export const metadata: Metadata = {
  title: "Prohibited Items",
  description:
    "Items ItalParcel cannot handle (English and Italian) — annex to the Terms and Conditions of the parcel forwarding service.",
};

export default function ProhibitedItemsPage() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <ProhibitedContent />
      </main>
      <Footer />
    </>
  );
}
