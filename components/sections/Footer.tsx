import Link from "next/link";
import Image from "next/image";
import { Mail, MessageCircle } from "lucide-react";
import { WHATSAPP_DISPLAY, WHATSAPP_NUMBER } from "@/lib/whatsapp";

export function Footer() {
  const year = new Date().getFullYear();
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
              Your Italian address for parcels you want forwarded worldwide.
              Run from Trento, Italy.
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
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-border pt-6 text-xs text-fg-subtle md:flex-row md:items-center md:justify-between">
          <p>
            © {year} ItalParcel di Samuel Borghesi · VAT IT&nbsp;02818050227 ·
            Italy
          </p>
          <p>Court of Trento — exclusive jurisdiction (T&amp;C §8.2).</p>
        </div>
      </div>
    </footer>
  );
}
