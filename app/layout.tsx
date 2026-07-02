import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { CookieBanner } from "@/components/CookieBanner";
import { CONSENT_DENIED_REGIONS, CONSENT_STORAGE_KEY } from "@/lib/consent";

const bricolage = Bricolage_Grotesque({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const SITE_URL = "https://italparcel.com";
const TITLE = "ItalParcel — Your Italian address. Anywhere in the world.";
const DESCRIPTION =
  "ItalParcel receives, consolidates and forwards your Italian parcels worldwide. Transparent two-step pricing, locker pickup, customs prep done right.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s · ItalParcel",
  },
  description: DESCRIPTION,
  applicationName: "ItalParcel",
  keywords: [
    "parcel forwarding Italy",
    "Italian package forwarding",
    "consolidate shipping Italy",
    "ship from Italy worldwide",
    "Italian mailbox",
    "ItalParcel",
    "Trento parcel forwarding",
    "EU package forwarding",
  ],
  authors: [{ name: "ItalParcel", url: SITE_URL }],
  creator: "ItalParcel di Samuel Borghesi",
  publisher: "ItalParcel di Samuel Borghesi",
  category: "Shipping & Logistics",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: TITLE,
    description:
      "Receive, consolidate, and forward your Italian parcels worldwide.",
    url: SITE_URL,
    siteName: "ItalParcel",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description:
      "Receive, consolidate, and forward your Italian parcels worldwide.",
    images: ["/opengraph-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  referrer: "origin-when-cross-origin",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f6" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0f14" },
  ],
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ItalParcel",
  legalName: "ItalParcel di Samuel Borghesi",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/opengraph-image.png`,
  description: DESCRIPTION,
  vatID: "IT02818050227",
  email: "contact@italparcel.com",
  telephone: `+${WHATSAPP_NUMBER}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Trento",
    addressRegion: "TN",
    addressCountry: "IT",
  },
  areaServed: "Worldwide",
  contactPoint: [
    {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "contact@italparcel.com",
      telephone: WHATSAPP_DISPLAY,
      availableLanguage: ["English", "Italian"],
      areaServed: "Worldwide",
    },
  ],
  sameAs: [],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "ItalParcel",
  url: SITE_URL,
  inLanguage: "en",
  publisher: {
    "@type": "Organization",
    name: "ItalParcel",
  },
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Italian parcel forwarding",
  serviceType: "Parcel forwarding & consolidation",
  provider: {
    "@type": "Organization",
    name: "ItalParcel",
    url: SITE_URL,
  },
  areaServed: "Worldwide",
  offers: {
    "@type": "Offer",
    price: "10",
    priceCurrency: "EUR",
    description: "€10 activation fee, deducted from the final total",
    url: `${SITE_URL}/#pricing`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${jetbrains.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-fg">
        {children}
        <CookieBanner />
        {/* Google Ads (gtag.js) — base tag, loaded on every page */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18237016910"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500,
  region: ${JSON.stringify(CONSENT_DENIED_REGIONS)}
});
try {
  var stored = localStorage.getItem('${CONSENT_STORAGE_KEY}');
  if (stored === 'granted') {
    gtag('consent', 'update', { ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted' });
  } else if (stored === 'denied') {
    gtag('consent', 'update', { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied', analytics_storage: 'denied' });
  }
} catch (e) {}
gtag('js', new Date());
gtag('config', 'AW-18237016910', { allow_enhanced_conversions: true });`}
        </Script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
        />
      </body>
    </html>
  );
}
