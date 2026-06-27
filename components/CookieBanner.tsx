"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "./ui/Button";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";

const GRANTED = {
  ad_storage: "granted",
  ad_user_data: "granted",
  ad_personalization: "granted",
  analytics_storage: "granted",
} as const;

const DENIED = {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
} as const;

export const OPEN_COOKIE_SETTINGS_EVENT = "italparcel:open-cookie-settings";

export function CookieBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // First visit (no stored choice) → show the banner. Any previous choice has
    // already been re-applied by the inline script in layout.tsx, so here we
    // only drive the UI.
    let hasChoice = false;
    try {
      hasChoice = Boolean(localStorage.getItem(CONSENT_STORAGE_KEY));
    } catch {
      // localStorage unavailable (private mode, blocked) — treat as no choice.
    }
    if (!hasChoice) setOpen(true);

    // The "Manage cookies" footer link re-opens the banner via this event.
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  const choose = (granted: boolean) => {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, granted ? "granted" : "denied");
    } catch {
      // localStorage unavailable — consent still applied for this session below.
    }
    window.gtag?.("consent", "update", granted ? GRANTED : DENIED);
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label="Cookie consent"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-x-0 bottom-0 z-50 p-4"
          style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
        >
          <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-border bg-bg-elev p-5 shadow-[var(--shadow-lift)] sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-fg-muted">
              We use one optional cookie for Google Ads to measure ad
              conversions, only with your consent. Cookies strictly necessary for
              the site (security and anti-bot protection) stay on. See our{" "}
              <Link
                href="/privacy"
                className="font-medium text-fg underline underline-offset-2 hover:text-accent"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-3">
              <Button variant="secondary" onClick={() => choose(false)}>
                Decline
              </Button>
              <Button onClick={() => choose(true)}>Accept</Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function CookieSettingsLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
      className={className}
    >
      Manage cookies
    </button>
  );
}
