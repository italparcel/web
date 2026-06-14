"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Check, ArrowRight } from "lucide-react";
import { Reveal } from "../ui/Reveal";
import { cn } from "@/lib/cn";

type Tier = {
  parcels: string;
  price: number | "custom";
  perParcel?: string;
  best?: boolean;
  features: string[];
  cta: string;
  highlight?: boolean;
};

const tiers: Tier[] = [
  {
    parcels: "Single",
    price: 17,
    features: [
      "1 parcel handling fee",
      "Email + WhatsApp updates",
      "€10 activation deducted",
    ],
    cta: "Get started",
  },
  {
    parcels: "Bundle 5",
    price: 60,
    perParcel: "€12 / parcel",
    features: [
      "Everything in Single",
      "Consolidation across orders",
      "Lower per-parcel rate",
    ],
    cta: "Bundle 5",
  },
  {
    parcels: "Bundle 10",
    price: 95,
    perParcel: "€9.50 / parcel",
    best: true,
    highlight: true,
    features: [
      "Everything in Single",
      "Consolidation across orders",
      "Best per-parcel rate",
    ],
    cta: "Bundle 10",
  },
  {
    parcels: "Custom",
    price: "custom",
    features: [
      "10+ parcels — volume pricing",
      "Dedicated account contact",
      "Negotiated carrier rates",
    ],
    cta: "Talk to us",
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-[color:#0a0f17] py-24 text-[color:#fafaf7] md:py-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(60% 50% at 10% 10%, rgba(217,119,6,0.16), transparent 60%), radial-gradient(50% 60% at 90% 100%, rgba(15,118,110,0.18), transparent 60%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_85%)] opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      <div className="container-x relative">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">
            Pricing
          </p>
        </Reveal>

        <div className="mt-5 grid items-end gap-8 md:grid-cols-[1fr_auto]">
          <Reveal>
            <h2 className="display text-4xl text-white md:text-6xl lg:text-7xl">
              Pay only when we
              <br />
              <span className="display-light text-white/70">take charge.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="max-w-sm text-sm leading-relaxed text-white/60 md:text-base">
              One transparent fee for our handling.
              <span className="block">Shipping cost is quoted separately.</span>
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {tiers.map((tier, i) => (
            <Reveal key={tier.parcels} delay={i * 0.06}>
              <TierCard tier={tier} />
            </Reveal>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-white/70">
          A parcel = up to 5 kg and 60×40×40 cm. Let us know in advance if a
          parcel may exceed either limit to avoid a €15 handling surcharge —
          see{" "}
          <a
            href="/terms#sec-5-2"
            className="underline underline-offset-2 hover:text-white"
          >
            T&amp;C §5.2
          </a>
          . Shipping cost is quoted separately.
        </p>
      </div>
    </section>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduce || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const y = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    ref.current.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
  };
  const reset = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border p-7 transition-all duration-300 will-change-transform",
        tier.highlight
          ? "border-accent/60 bg-gradient-to-br from-accent/[0.18] via-white/[0.04] to-white/[0.02] shadow-[0_30px_60px_-30px_rgba(217,119,6,0.4)]"
          : "border-white/10 bg-white/[0.03] hover:border-white/30"
      )}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/70">
        {tier.parcels}
      </p>

      <div className="mt-4 flex items-baseline gap-2">
        {tier.price === "custom" ? (
          <span className="display text-5xl">Custom</span>
        ) : (
          <>
            <AnimatedPrice value={tier.price} />
            <span className="text-sm text-white/70">total</span>
          </>
        )}
      </div>

      {tier.perParcel && (
        <p className="mt-1 font-mono text-xs text-white/50">{tier.perParcel}</p>
      )}

      <ul className="mt-7 space-y-2.5 text-sm text-white/75">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check
              size={14}
              className={cn(
                "mt-0.5 shrink-0",
                tier.highlight ? "text-accent" : "text-teal"
              )}
            />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-2">
        <button
          type="button"
          onClick={scrollToContact}
          className={cn(
            "group/btn inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition",
            tier.highlight
              ? "bg-accent text-white hover:bg-accent-hover"
              : "border border-white/15 text-white hover:bg-white/10"
          )}
        >
          {tier.cta}
          <ArrowRight
            size={14}
            className="transition group-hover/btn:translate-x-1"
          />
        </button>
      </div>
    </div>
  );
}

function AnimatedPrice({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? value : 0);

  useEffect(() => {
    if (!inView || reduce) return;
    const start = performance.now();
    const dur = 900;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value, reduce]);

  return (
    <motion.span ref={ref} className="display text-5xl leading-none">
      €{n}
    </motion.span>
  );
}
