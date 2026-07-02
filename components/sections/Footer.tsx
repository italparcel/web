import Link from "next/link";
import Image from "next/image";
import { Mail, MessageCircle } from "lucide-react";
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/whatsapp";
import { CookieSettingsLink } from "@/components/CookieBanner";

// Hardcoded on purpose (audit L-2): new Date() in a statically prerendered
// component freezes at build time anyway and adds a hydration mismatch in the
// window where the client year differs. Bump once a year.
const COPYRIGHT_YEAR = 2026;

export function Footer() {
  return (
    <footer className="relative mt-auto border-t border-border bg-bg">
      <div className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <div className="inline-flex items-center gap-2.5 font-semibold tracking-tight">
              <Image
                src="/logo.png"
                alt=""
                width={60}
                height={60}
                className="h-[3.75rem] w-[3.75rem]"
              />
              <span>
                Ital<span className="text-accent">Parcel</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm text-fg-muted">
              Parcel forwarding from Italy. Made easy.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-fg-subtle">
              Contact
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="mailto:contact@italparcel.com"
                  className="inline-flex items-center gap-2 text-fg hover:text-accent"
                >
                  <Mail size={14} />
                  contact@italparcel.com
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-fg hover:text-accent"
                >
                  <MessageCircle size={14} />
                  {WHATSAPP_DISPLAY}
                </a>
                <span className="ml-1 text-fg-subtle">(WhatsApp only)</span>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-fg-subtle">
              Legal
            </p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/terms" className="text-fg hover:text-accent">
                  Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-fg hover:text-accent">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/prohibited-items"
                  className="text-fg hover:text-accent"
                >
                  Prohibited Items
                </Link>
              </li>
              <li>
                <CookieSettingsLink className="text-fg hover:text-accent" />
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-fg-subtle md:flex-row md:items-center md:justify-between">
          <p>
            © {COPYRIGHT_YEAR}{" "}ItalParcel di Samuel Borghesi
            <br />
            VAT Number: IT&nbsp;02818050227
            <br />
            Running from Trento, Italy
          </p>
        </div>
      </div>
    </footer>
  );
}
