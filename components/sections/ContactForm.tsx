"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, MessageCircle, Mail, Loader2 } from "lucide-react";
import Link from "next/link";
import {
  contactSchema,
  type ContactInput,
  PARCEL_COUNT_OPTIONS,
  ORIGIN_OPTIONS,
} from "@/lib/schema";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { COUNTRIES } from "@/lib/countries";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";
import { Button } from "../ui/Button";
import {
  FieldError,
  FieldLabel,
  Input,
  Select,
  Textarea,
} from "../ui/Field";
import { Combobox } from "../ui/Combobox";
import { AddressCombobox } from "../ui/AddressCombobox";
import { Checkbox } from "../ui/Checkbox";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "success" | "error";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const TURNSTILE_SCRIPT_MATCH =
  'script[src^="https://challenges.cloudflare.com/turnstile/v0/api.js"]';

/** True only when the visitor granted advertising consent (Consent Mode). */
function adConsentGranted(): boolean {
  try {
    return localStorage.getItem(CONSENT_STORAGE_KEY) === "granted";
  } catch {
    return false;
  }
}

type TurnstileOptions = {
  sitekey: string;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
};

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: TurnstileOptions) => string;
      reset: (id?: string) => void;
      remove: (id?: string) => void;
    };
  }
}

/**
 * Cloudflare Turnstile, rendered explicitly so it can be reset after each
 * submit. Renders nothing when no site key is configured (e.g. local dev),
 * keeping the form usable without the captcha.
 */
function TurnstileWidget({
  onVerify,
  onExpire,
  resetSignal,
}: {
  onVerify: (token: string) => void;
  onExpire: () => void;
  resetSignal: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  // Latest-ref pattern, updated in an effect (refs must not be written during
  // render): Turnstile callbacks always see the freshest handlers.
  useEffect(() => {
    onVerifyRef.current = onVerify;
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    const siteKey = TURNSTILE_SITE_KEY;
    if (!siteKey) return;
    let cancelled = false;

    const render = () => {
      if (
        cancelled ||
        !window.turnstile ||
        !containerRef.current ||
        widgetIdRef.current !== null
      ) {
        return;
      }
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: (token) => onVerifyRef.current(token),
        "expired-callback": () => onExpireRef.current(),
        "error-callback": () => onExpireRef.current(),
      });
    };

    if (window.turnstile) {
      render();
    } else {
      const existing =
        document.querySelector<HTMLScriptElement>(TURNSTILE_SCRIPT_MATCH);
      if (existing) {
        existing.addEventListener("load", render, { once: true });
      } else {
        const script = document.createElement("script");
        script.src = TURNSTILE_SCRIPT_SRC;
        script.async = true;
        script.defer = true;
        script.addEventListener("load", render, { once: true });
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (resetSignal > 0 && widgetIdRef.current !== null && window.turnstile) {
      window.turnstile.reset(widgetIdRef.current);
    }
  }, [resetSignal]);

  if (!TURNSTILE_SITE_KEY) return null;
  return <div ref={containerRef} className="min-h-[65px]" />;
}

export function ContactForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    reset,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      channel: "email",
      origin: "extra-eu",
      parcels: "1",
    },
  });

  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState<string | null>(null);
  // When the user picks WhatsApp we keep the deep link so the SuccessCard can
  // open it from a real click — window.open after an await is blocked on iOS.
  const [waLink, setWaLink] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const turnstileEnabled = Boolean(TURNSTILE_SITE_KEY);
  const channel = watch("channel");
  const honeypotRef = useRef<HTMLInputElement>(null);

  const onSubmit = async (data: ContactInput) => {
    setStatus("submitting");
    setErrMsg(null);

    const isWhatsApp = data.channel === "whatsapp";
    // Build from the submitted snapshot now (reset() clears the form fields).
    const link = isWhatsApp ? buildWhatsAppLink(data) : null;

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...data,
          company: honeypotRef.current?.value ?? "",
          turnstileToken: turnstileToken ?? "",
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Submission failed");
      }
      setWaLink(link);
      setStatus("success");
      // Google Ads conversion — fire ONLY here, where res.ok was confirmed
      // (the backend accepted the inquiry / the email was actually sent). This
      // covers both email and WhatsApp when the contact genuinely went through.
      // The WhatsApp fallback in catch() is deliberately NOT tracked, so a
      // failed backend is never counted as a conversion.
      //
      // Enhanced conversions for leads: only when the visitor granted
      // advertising consent (Consent Mode), hand Google the email/phone the
      // user typed so it can match the conversion. gtag normalises and
      // SHA-256-hashes this data in the browser before it is sent — we never
      // send it anywhere else and never log it.
      if (adConsentGranted()) {
        window.gtag?.("set", "user_data", {
          email: data.email,
          ...(data.phone ? { phone_number: data.phone } : {}),
        });
      }
      window.gtag?.("event", "conversion", {
        send_to: "AW-18237016910/CtkVCL-UwsYcEM6Wi_hD",
      });
      reset();
    } catch (e) {
      // For WhatsApp the emailed copy is secondary — don't block the user from
      // reaching WhatsApp just because that copy failed to send.
      if (isWhatsApp) {
        setWaLink(link);
        setStatus("success");
        reset();
        return;
      }
      setStatus("error");
      setErrMsg(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      // The Turnstile token is single-use — clear it and reset the widget so
      // the next attempt gets a fresh challenge.
      setTurnstileToken(null);
      setTurnstileResetKey((k) => k + 1);
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="Get a quote"
          title={
            <>
              Tell us about your
              <br />
              <span className="display-light text-fg-muted">parcels.</span>
            </>
          }
          description="Fill the form once. We'll reply by your preferred channel within 36 working hours."
        />

        <div className="mx-auto mt-14 max-w-2xl">
          <Reveal>
            <AnimatePresence mode="wait">
              {status === "success" ? (
                <SuccessCard
                  onReset={() => {
                    setStatus("idle");
                    setWaLink(null);
                  }}
                  waLink={waLink}
                />
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-5 rounded-2xl border border-border bg-bg-elev p-6 md:p-8"
                  noValidate
                >
                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor="name" required>
                        Full name
                      </FieldLabel>
                      <Input
                        id="name"
                        autoComplete="name"
                        placeholder="Mario Rossi"
                        aria-invalid={!!errors.name}
                        className="mt-1.5"
                        {...register("name")}
                      />
                      <FieldError>{errors.name?.message}</FieldError>
                    </div>
                    <div>
                      <FieldLabel htmlFor="email" required>
                        Email
                      </FieldLabel>
                      <Input
                        id="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        aria-invalid={!!errors.email}
                        className="mt-1.5"
                        {...register("email")}
                      />
                      <FieldError>{errors.email?.message}</FieldError>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor="phone" required={channel === "whatsapp"}>
                        WhatsApp number
                      </FieldLabel>
                      <Input
                        id="phone"
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="+1 555 123 4567"
                        aria-invalid={!!errors.phone}
                        className="mt-1.5"
                        {...register("phone")}
                      />
                      <FieldError>{errors.phone?.message}</FieldError>
                    </div>
                    <div>
                      <FieldLabel htmlFor="country" required>
                        Destination country
                      </FieldLabel>
                      <Controller
                        name="country"
                        control={control}
                        render={({ field }) => (
                          <Combobox
                            id="country"
                            options={COUNTRIES}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder="Search a country…"
                            aria-invalid={!!errors.country}
                            className="mt-1.5"
                          />
                        )}
                      />
                      <FieldError>{errors.country?.message}</FieldError>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor="parcels" required>
                        Estimated parcels
                      </FieldLabel>
                      <Select
                        id="parcels"
                        aria-invalid={!!errors.parcels}
                        className="mt-1.5"
                        {...register("parcels")}
                      >
                        {PARCEL_COUNT_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </Select>
                      <FieldError>{errors.parcels?.message}</FieldError>
                    </div>
                    <div>
                      <FieldLabel htmlFor="origin" required>
                        Parcel origin
                      </FieldLabel>
                      <Select
                        id="origin"
                        aria-invalid={!!errors.origin}
                        className="mt-1.5"
                        {...register("origin")}
                      >
                        {ORIGIN_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </Select>
                      <FieldError>{errors.origin?.message}</FieldError>
                    </div>
                  </div>

                  <div>
                    <FieldLabel htmlFor="address" required>
                      Full delivery address
                    </FieldLabel>
                    <Controller
                      name="address"
                      control={control}
                      render={({ field }) => (
                        <AddressCombobox
                          id="address"
                          value={field.value}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          placeholder="Start typing — street, city, country…"
                          aria-invalid={!!errors.address}
                          className="mt-1.5"
                        />
                      )}
                    />
                    <FieldError>{errors.address?.message}</FieldError>
                  </div>

                  <div>
                    <FieldLabel htmlFor="itemDescription" required>
                      Describe the items you want to ship
                    </FieldLabel>
                    <Textarea
                      id="itemDescription"
                      rows={3}
                      placeholder="e.g. Two vintage leather jackets (size M and L) bought on Vinted; one Bialetti moka pot."
                      aria-invalid={!!errors.itemDescription}
                      className="mt-1.5"
                      {...register("itemDescription")}
                    />
                    <FieldError>{errors.itemDescription?.message}</FieldError>
                  </div>

                  <div>
                    <FieldLabel htmlFor="notes">
                      Additional notes or requests (optional)
                    </FieldLabel>
                    <Textarea
                      id="notes"
                      placeholder="Pickup-point preferences, timing, declared value, anything else we should know."
                      aria-invalid={!!errors.notes}
                      className="mt-1.5"
                      {...register("notes")}
                    />
                    <FieldError>{errors.notes?.message}</FieldError>
                  </div>

                  <fieldset>
                    <legend className="text-sm font-medium text-fg">
                      How should we reply? <span className="text-accent">*</span>
                    </legend>
                    <div className="mt-2 grid gap-2 sm:grid-cols-2">
                      <ChannelOption
                        label="Email"
                        value="email"
                        checked={channel === "email"}
                        icon={<Mail size={16} />}
                        register={register}
                      />
                      <ChannelOption
                        label="WhatsApp"
                        value="whatsapp"
                        checked={channel === "whatsapp"}
                        icon={<MessageCircle size={16} />}
                        register={register}
                      />
                    </div>
                    <FieldError>{errors.channel?.message}</FieldError>
                  </fieldset>

                  <div className="space-y-4 rounded-xl border border-dashed border-border-strong bg-bg p-5">
                    <Checkbox
                      id="acceptTerms"
                      aria-invalid={!!errors.acceptTerms}
                      label={
                        <>
                          I have read and accept the{" "}
                          <Link
                            href="/terms"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-fg underline underline-offset-2 hover:text-accent"
                          >
                            Terms &amp; Conditions
                          </Link>{" "}
                          and the{" "}
                          <Link
                            href="/privacy"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-fg underline underline-offset-2 hover:text-accent"
                          >
                            Privacy Policy
                          </Link>
                          .
                        </>
                      }
                      {...register("acceptTerms")}
                    />
                    {errors.acceptTerms && (
                      <FieldError>{errors.acceptTerms.message}</FieldError>
                    )}
                    <Checkbox
                      id="acceptClauses"
                      aria-invalid={!!errors.acceptClauses}
                      label={
                        <>
                          I specifically approve, pursuant to{" "}
                          <strong>
                            Articles 1341 and 1342 of the Italian Civil Code
                          </strong>
                          , clauses{" "}
                          <Link
                            href="/terms#sec-3-2"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-fg underline underline-offset-2 hover:text-accent"
                          >
                            3.2(b)
                          </Link>
                          ,{" "}
                          <Link
                            href="/terms#sec-3-10"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-fg underline underline-offset-2 hover:text-accent"
                          >
                            3.10
                          </Link>
                          ,{" "}
                          <Link
                            href="/terms#sec-4-5"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-fg underline underline-offset-2 hover:text-accent"
                          >
                            4.5
                          </Link>
                          ,{" "}
                          <Link
                            href="/terms#sec-5-9"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-fg underline underline-offset-2 hover:text-accent"
                          >
                            5.9
                          </Link>
                          ,{" "}
                          <Link
                            href="/terms#sec-7-3"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-fg underline underline-offset-2 hover:text-accent"
                          >
                            7.3
                          </Link>{" "}
                          and{" "}
                          <Link
                            href="/terms#sec-8-2"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-fg underline underline-offset-2 hover:text-accent"
                          >
                            8.2
                          </Link>{" "}
                          of the Terms &amp; Conditions.
                        </>
                      }
                      {...register("acceptClauses")}
                    />
                    {errors.acceptClauses && (
                      <FieldError>{errors.acceptClauses.message}</FieldError>
                    )}
                  </div>

                  {errMsg && (
                    <p
                      role="alert"
                      className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                    >
                      {errMsg}
                    </p>
                  )}

                  <TurnstileWidget
                    onVerify={(token) => setTurnstileToken(token)}
                    onExpire={() => setTurnstileToken(null)}
                    resetSignal={turnstileResetKey}
                  />

                  <div className="flex items-center justify-between gap-4 pt-2">
                    <p className="text-xs text-fg-subtle">
                      We reply within 36 working hours.
                    </p>
                    <Button
                      type="submit"
                      size="lg"
                      magnetic
                      disabled={
                        !isValid ||
                        status === "submitting" ||
                        (turnstileEnabled && !turnstileToken)
                      }
                    >
                      {status === "submitting" ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Sending…
                        </>
                      ) : channel === "whatsapp" ? (
                        <>
                          Open WhatsApp
                          <MessageCircle size={16} />
                        </>
                      ) : (
                        <>
                          Send request
                          <Mail size={16} />
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Honeypot — hidden from humans; bots that fill it are
                      silently dropped server-side. Not part of the schema. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -left-[9999px] top-0 h-0 w-0 overflow-hidden"
                  >
                    <label htmlFor="company">Company (leave this empty)</label>
                    <input
                      ref={honeypotRef}
                      id="company"
                      name="company"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ChannelOption({
  label,
  value,
  checked,
  icon,
  register,
}: {
  label: string;
  value: "email" | "whatsapp";
  checked: boolean;
  icon: React.ReactNode;
  register: ReturnType<typeof useForm<ContactInput>>["register"];
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-xl border bg-bg-elev px-4 py-3 transition",
        checked
          ? "border-fg shadow-[var(--shadow-soft)]"
          : "border-border hover:border-fg/40"
      )}
    >
      <input
        type="radio"
        value={value}
        className="sr-only"
        {...register("channel")}
      />
      <span
        className={cn(
          "grid h-7 w-7 place-items-center rounded-lg",
          checked ? "bg-fg text-bg" : "bg-bg text-fg-muted"
        )}
      >
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
      <span
        className={cn(
          "ml-auto h-2 w-2 rounded-full",
          checked ? "bg-accent" : "bg-border-strong"
        )}
      />
    </label>
  );
}

function SuccessCard({
  onReset,
  waLink,
}: {
  onReset: () => void;
  waLink: string | null;
}) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="rounded-2xl border border-border bg-bg-elev p-10 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 16 }}
        className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-teal text-white"
      >
        <CheckCircle2 size={28} />
      </motion.div>
      <h3 className="mt-5 display text-3xl">Got it.</h3>
      <p className="mt-2 text-sm text-fg-muted">
        {waLink
          ? "Your message is on its way via WhatsApp. We've logged an email copy on our end too."
          : "We will reply within 36 working hours."}
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {waLink && (
          <Button
            onClick={() =>
              window.open(waLink, "_blank", "noopener,noreferrer")
            }
          >
            Open WhatsApp
            <MessageCircle size={16} />
          </Button>
        )}
        <Button variant="secondary" onClick={onReset}>
          Send another
        </Button>
      </div>
    </motion.div>
  );
}
