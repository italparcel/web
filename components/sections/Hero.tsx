"use client";

import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/Button";
import { cn } from "@/lib/cn";

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const headlineY = useTransform(scrollY, [0, 600], [0, -40]);

  const scrollTo = (id: string) => () =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section
      id="top"
      ref={ref}
      className="relative isolate overflow-hidden pt-28 pb-16 md:pt-32 md:pb-24"
    >
      <BackgroundLayer />

      <div className="container-x relative">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_minmax(0,1fr)] lg:gap-20 xl:gap-28">
          <div>
            <motion.h1
              style={reduce ? undefined : { y: headlineY }}
              className="display text-balance text-[clamp(3rem,7.5vw,6rem)] text-fg"
            >
              <Line delay={0.08}>Your Italian</Line>
              <Line delay={0.22}>
                <span className="text-accent">address.</span>
              </Line>
              <Line delay={0.36} className="display-light text-fg-muted">
                Anywhere in the world.
              </Line>
            </motion.h1>

            <motion.p
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-8 max-w-lg text-base leading-relaxed text-fg-muted md:text-lg"
            >
              Parcel forwarding from Italy. Made easy.
            </motion.p>

            <motion.div
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.72 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <Button size="lg" magnetic onClick={scrollTo("contact")}>
                Get a quote
                <ArrowRight size={16} />
              </Button>
              <Button size="lg" variant="secondary" onClick={scrollTo("how")}>
                How it works
              </Button>
            </motion.div>

            <motion.div
              initial={reduce ? false : { opacity: 0 }}
              animate={reduce ? undefined : { opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.95 }}
              className="mt-14 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-border pt-6 text-xs text-fg-subtle"
            >
              <Stat label="Activation" value="€10" hint="deducted from your total" />
              <Stat label="Best per parcel" value="€9.50" hint="on Bundle 10" />
              <Stat label="From" value="Trento · IT" />
            </motion.div>
          </div>

          <ShipmentCard />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-bg" />
    </section>
  );
}

function Line({
  children,
  delay,
  className,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <span className={"block overflow-hidden " + (className ?? "")}>
      <motion.span
        initial={reduce ? false : { y: "108%" }}
        animate={reduce ? undefined : { y: 0 }}
        transition={{ duration: 0.95, delay, ease: [0.16, 1, 0.3, 1] }}
        className="inline-block will-change-transform"
      >
        {children}
      </motion.span>
    </span>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-fg-subtle/80 text-[10px] uppercase tracking-[0.18em]">
        {label}
      </span>
      <span className="font-mono text-sm text-fg">{value}</span>
      {hint && (
        <span className="hidden text-[11px] text-fg-subtle sm:inline">
          · {hint}
        </span>
      )}
    </div>
  );
}

function BackgroundLayer() {
  return (
    <>
      <div className="mesh" aria-hidden />
      <div className="grain" aria-hidden />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(11,15,20,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,15,20,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   ShipmentCard — simplified, rotating destination
   ───────────────────────────────────────────────────────────── */

type Shipment = {
  code: string;
  city: string;
  country: string;
  postcode: string;
  carrier: string;
  weight: string;
  eta: string;
};

const SHIPMENTS: Shipment[] = [
  { code: "8472-EW", city: "Tokyo", country: "JP", postcode: "100-0001", carrier: "DPD", weight: "2.1 kg", eta: "Sat · May 14" },
  { code: "5391-KT", city: "Sydney", country: "AU", postcode: "2000", carrier: "UPS Express", weight: "3.4 kg", eta: "Mon · May 16" },
  { code: "6207-QL", city: "New York", country: "US", postcode: "10001", carrier: "FedEx", weight: "1.8 kg", eta: "Thu · May 12" },
  { code: "7048-RJ", city: "London", country: "GB", postcode: "EC1A", carrier: "FedEx", weight: "0.9 kg", eta: "Fri · May 13" },
  { code: "3315-MC", city: "Berlin", country: "DE", postcode: "10117", carrier: "DPD", weight: "5.2 kg", eta: "Sat · May 14" },
  { code: "4926-PD", city: "São Paulo", country: "BR", postcode: "01310", carrier: "DPD", weight: "4.0 kg", eta: "Tue · May 17" },
  { code: "5573-HB", city: "Seoul", country: "KR", postcode: "04524", carrier: "UPS Express", weight: "2.6 kg", eta: "Sun · May 15" },
  { code: "6841-NV", city: "Dubai", country: "AE", postcode: "00000", carrier: "UPS Express", weight: "1.4 kg", eta: "Fri · May 13" },
];

/* One rotating value. EVERY animated field in the card goes through this, so
   they all share the exact same crossfade (same duration, curve, no per-field
   delay) and — since they all read from the same `s` and re-render together —
   they change in the SAME instant. The live value stays in normal flow
   (popLayout pops only the OUTGOING copy to position:absolute), so it keeps its
   natural text baseline: no fixed-height / overflow wrapper to lift it off the
   adjacent label's baseline. */
function Rolling({ value, className }: { value: string; className?: string }) {
  const reduce = useReducedMotion();
  if (reduce) return <span className={className}>{value}</span>;
  return (
    <span className={cn("relative whitespace-nowrap", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          className="inline-block"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function ShipmentCard() {
  const reduce = useReducedMotion();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => {
      setIdx((i) => (i + 1) % SHIPMENTS.length);
    }, 3200);
    return () => clearInterval(t);
  }, [reduce]);

  const s = SHIPMENTS[idx];

  return (
    <motion.aside
      initial={reduce ? false : { opacity: 0, y: 24 }}
      animate={reduce ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      aria-label="Sample shipment"
      className="self-center"
    >
      <div className="relative">
        <div
          aria-hidden
          className="absolute -inset-3 -z-10 translate-x-3 translate-y-3 rounded-2xl border border-border bg-bg-elev/40"
        />
        <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-elev shadow-[var(--shadow-lift)]">
          <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-fg-subtle">
                Shipment
              </span>
              {/* code rotates with the shipment, sharing the "Shipment"
                  baseline because Rolling keeps the live value in normal flow */}
              <Rolling
                value={`№ ${s.code}`}
                className="inline-block font-mono text-sm tabular-nums text-fg"
              />
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
              In transit
            </span>
          </div>

          {/* Route — fixed grid columns + single-line values, so the rotating
              city / CAP never reflow the arc */}
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 px-4 pt-7 pb-3 md:gap-4 md:px-6">
            <div className="min-w-0">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                From
              </p>
              <p className="mt-1.5 display truncate whitespace-nowrap text-lg leading-none md:text-2xl">
                Trento
              </p>
              <p className="mt-1.5 truncate whitespace-nowrap font-mono text-[11px] text-fg-subtle">
                IT · 38023
              </p>
            </div>

            <div className="flex flex-col items-center gap-1.5 px-0 md:px-1">
              <RouteArc />
            </div>

            <div className="min-w-0 text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                To
              </p>
              <Rolling
                value={s.city}
                className="mt-1.5 block display text-lg leading-none md:text-2xl"
              />
              <Rolling
                value={`${s.country} · ${s.postcode}`}
                className="mt-1.5 block font-mono text-[11px] text-fg-subtle"
              />
            </div>
          </div>

          {/* Footer detail row */}
          <div className="grid grid-cols-3 gap-2 border-t border-border bg-bg/40 px-4 py-4 md:gap-3 md:px-6">
            <Detail k="Weight" v={s.weight} />
            <Detail k="Carrier" v={s.carrier} />
            <Detail k="ETA" v={s.eta} />
          </div>
        </div>
      </div>
    </motion.aside>
  );
}

function RouteArc() {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 110 28"
      className="h-[17px] w-[68px] text-accent md:h-7 md:w-[110px]"
      aria-hidden
    >
      <motion.path
        d="M 4 22 Q 55 -8 106 22"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
        initial={reduce ? undefined : { pathLength: 0 }}
        animate={reduce ? undefined : { pathLength: 1 }}
        transition={{ duration: 1.4, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      />
      <circle cx="4" cy="22" r="2.5" fill="currentColor" />
      <circle cx="106" cy="22" r="2.5" fill="currentColor" />
    </svg>
  );
}

function Detail({ k, v }: { k: string; v: string }) {
  return (
    <div className="min-w-0">
      <p className="truncate font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
        {k}
      </p>
      <Rolling
        value={v}
        className="mt-1 block font-mono text-[11px] text-fg md:text-xs"
      />
    </div>
  );
}
