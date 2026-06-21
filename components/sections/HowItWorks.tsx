"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
  useInView,
  useTime,
  useTransform,
} from "framer-motion";
import type { Transition } from "framer-motion";
import {
  Store,
  Warehouse,
  MapPin,
  Package,
  Cog,
  Check,
  MessageCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

// How long each intermediate phase is held while the stage "catches up" to a
// fast scroll. Big enough that every phase is actually seen, small enough that
// the catch-up still feels responsive.
const STEP_ADVANCE_MS = 150;

// Easing curves, typed as `Transition["ease"]` so Framer Motion accepts the
// cubic-bezier tuples (a bare `number[]` is not assignable to `Easing`).
const EASE: Transition["ease"] = [0.16, 1, 0.3, 1]; // shared entrance
const EASE_BACK: Transition["ease"] = [0.34, 1.45, 0.5, 1]; // overshoot / pop
const EASE_STAMP: Transition["ease"] = [0.3, 1.4, 0.5, 1]; // APPROVED stamp
const EASE_IN: Transition["ease"] = [0.4, 0, 1, 1]; // form collapse

type Step = {
  n: string;
  kicker: string;
  title: string;
  body?: string;
  points?: string[];
  Art: () => React.JSX.Element;
};

const STEPS: Step[] = [
  {
    n: "01",
    kicker: "Phase 1 — Activation",
    title: "You tell us what's coming.",
    points: [
      "Fill out the free form with shipping details",
      "We will contact you with a total quote (fee + shipping cost)",
      "If you like it, pay the €10 activation fee — don't worry, it'll be deducted from the total — and you will get your Italian address right after payment",
    ],
    Art: ActivateArt,
  },
  {
    n: "02",
    kicker: "Phase 2 — Reception",
    title: "Sellers ship. We receive.",
    points: [
      "Order your goods using our address / an agreed collection point",
      "When we receive your shipment, we repack it for its new journey",
      "We can consolidate multiple shipments into one package, significantly increasing your savings on shipping costs",
    ],
    Art: ReceiveArt,
  },
  {
    n: "03",
    kicker: "Phase 3 — Quote & ship",
    title: "One quote. Then it flies.",
    points: [
      "Based on your parcel's actual weight and dimensions, you will get the final shipping quote",
      "After payment, we will hand the package to the selected courier as soon as possible",
      "If your package is headed outside the European Union, you will need to provide us with the necessary information for the customs declaration",
    ],
    Art: ShipArt,
  },
  {
    n: "04",
    kicker: "Phase 4 — After-care",
    title: "We don't disappear.",
    points: [
      "For any questions about tracking, customs declarations, or anything else, don't hesitate to contact us",
      "We always respond within 36 business hours via WhatsApp or email",
    ],
    Art: TrackArt,
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();

  if (reduce) return <Fallback id="how" />;

  return (
    <div id="how" className="scroll-mt-16">
      <DesktopScroll />
      <Fallback className="md:hidden" />
    </div>
  );
}

function DesktopScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  // Only let the step illustrations animate once the pinned stage is actually
  // on screen. Otherwise step 01 mounts (and finishes animating) at page load,
  // far above the fold, so scrolling down lands on an already-completed
  // animation — while scrolling up re-mounts it and looks correct.
  const entered = useInView(stageRef, { amount: 0.5 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(0);
  const [target, setTarget] = useState(0);
  const activeRef = useRef(0);
  const targetRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Step `active` toward `target` one phase at a time. Reading from refs (not
  // closed-over state) keeps the chain correct even while the scroll position
  // keeps moving the target underneath us.
  const tick = useCallback(() => {
    const a = activeRef.current;
    const t = targetRef.current;
    if (a === t) {
      timerRef.current = null;
      return;
    }
    const next = a + (t > a ? 1 : -1);
    activeRef.current = next;
    setActive(next);
    timerRef.current = setTimeout(tick, STEP_ADVANCE_MS);
  }, []);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(
      STEPS.length - 1,
      Math.max(0, Math.floor(v * STEPS.length + 0.0001))
    );
    targetRef.current = next;
    setTarget((t) => (t === next ? t : next));
    // Kick off the catch-up immediately (first phase changes with no delay);
    // any further phases are then spaced out by STEP_ADVANCE_MS so none are
    // skipped, even on a fast flick or scrollbar drag.
    if (timerRef.current === null && next !== activeRef.current) tick();
  });

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const marching = active !== target;

  return (
    <section
      ref={ref}
      className="relative hidden md:block"
      style={{ height: `${STEPS.length * 100 + 100}vh` }}
    >
      <div ref={stageRef} className="sticky top-0 flex h-screen flex-col">
        {/* Stage */}
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence initial={false}>
            {entered && (
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -32 }}
                transition={{
                  duration: marching ? 0.3 : 0.55,
                  ease: EASE,
                }}
                className="absolute inset-0 flex items-center"
              >
                <StepContent step={STEPS[active]} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scroll hint */}
          <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center">
            <span className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">
              {active < STEPS.length - 1 ? "Scroll" : "Continue"}
              <span className="block h-px w-8 bg-border-strong" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function StepContent({ step }: { step: Step }) {
  return (
    <div className="container-x grid w-full gap-10 lg:grid-cols-[1.1fr_minmax(0,1fr)] lg:gap-16 xl:gap-24">
      <div className="self-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
          {step.kicker}
        </p>
        <p className="mt-3 font-mono text-xs text-accent">{step.n} / 04</p>
        <h3 className="display mt-4 text-balance text-[clamp(2.25rem,5.5vw,4.5rem)] text-fg">
          {step.title}
        </h3>
        <StepBody
          step={step}
          className="mt-6 max-w-md whitespace-pre-line text-base leading-relaxed md:text-lg"
        />
      </div>
      <div className="self-center">
        <step.Art />
      </div>
    </div>
  );
}

function StepBody({ step, className }: { step: Step; className?: string }) {
  if (step.points) {
    return (
      <ul className={cn("space-y-3 text-fg-muted", className)}>
        {step.points.map((point, i) => (
          <li key={i} className="flex gap-3">
            <span
              aria-hidden
              className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-fg"
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>
    );
  }
  return <p className={cn("text-fg-muted", className)}>{step.body}</p>;
}

/* ─────────────────────────────────────────────────────────────
   Mobile / reduced-motion fallback
   ───────────────────────────────────────────────────────────── */

function Fallback({
  className = "",
  id,
}: {
  className?: string;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={"relative border-t border-border py-20 " + className}
    >
      <div className="container-x">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
          How it works
        </p>
        <h2 className="display mt-4 text-balance text-4xl text-fg">
          The service in four phases.
        </h2>
        <ol className="mt-10 space-y-6">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="rounded-2xl border border-border bg-bg-elev p-6"
            >
              <div className="flex items-baseline justify-between gap-3">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
                  {s.kicker}
                </p>
                <p className="font-mono text-xs text-accent">{s.n} / 04</p>
              </div>
              <h3 className="display mt-3 text-balance text-2xl text-fg">{s.title}</h3>
              <StepBody step={s} className="mt-4 text-sm leading-relaxed" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   Step illustrations — custom, restrained SVG
   ───────────────────────────────────────────────────────────── */

// Shared frame for all four "how it works" phases — the single source of truth
// for the container. Aspect ratio (3:2, short enough that the wide phases fill),
// the one dashed border, the clean white surface, radius and padding are
// identical for every phase; each phase supplies its own artwork, centred.
function PhaseVisual({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative aspect-[3/2] w-full max-w-xl overflow-hidden rounded-2xl border-[1.5px] border-dashed border-border-strong bg-bg-elev">
      <div className="absolute inset-0 grid place-items-center p-6 lg:p-12">
        {children}
      </div>
    </div>
  );
}

function ActivateArt() {
  const fields = [
    { label: "NAME", value: "John Doe" },
    { label: "DESTINATION", value: "New York, USA" },
    { label: "ITEMS TO SHIP", value: "Bialetti moka pot" },
  ];
  return (
    <PhaseVisual>
      <svg viewBox="0 0 380 280" preserveAspectRatio="xMidYMid meet" className="h-full w-full" aria-hidden>
        {/* request form card */}
        <rect
          x="40"
          y="30"
          width="300"
          height="220"
          rx="10"
          fill="#ffffff"
          stroke="#d6d3ca"
          style={{
            filter:
              "drop-shadow(0 1px 2px rgba(11,15,20,0.04)) drop-shadow(0 10px 22px rgba(11,15,20,0.07))",
          }}
        />

        {/* form contents — collapse away once the request is sent */}
        <motion.g
          initial={{ opacity: 1, scale: 1 }}
          animate={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.35, delay: 2.5, ease: EASE_IN }}
          style={{ transformOrigin: "190px 140px" }}
        >
          {/* header — a new inquiry */}
          <text
            x="60"
            y="58"
            fontFamily="var(--font-mono), ui-monospace, monospace"
            fontSize="12"
            fill="#0b0f14"
            letterSpacing="2"
          >
            NEW INQUIRY
          </text>
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.15, ease: EASE }}
            style={{ transformOrigin: "310px 52px" }}
          >
            <circle cx="310" cy="52" r="12" fill="#d97706" />
            <path
              d="M 310 46 L 310 58 M 304 52 L 316 52"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </motion.g>
          <line x1="60" y1="70" x2="320" y2="70" stroke="#e7e5de" />

          {/* labeled fields */}
          {fields.map((f, i) => {
            const labelY = 92 + i * 38;
            const inputY = 98 + i * 38;
            return (
              <g key={f.label}>
                <text
                  x="60"
                  y={labelY}
                  fontFamily="var(--font-mono), ui-monospace, monospace"
                  fontSize="11"
                  fill="#9ca3af"
                  letterSpacing="1.5"
                >
                  {f.label}
                </text>
                <rect
                  x="60"
                  y={inputY}
                  width="220"
                  height="18"
                  rx="3"
                  fill="#f3eee2"
                  stroke="#e7e5de"
                />
                <motion.text
                  x="68"
                  y={inputY + 13}
                  fontFamily="var(--font-mono), ui-monospace, monospace"
                  fontSize="12"
                  fill="#0b0f14"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 + i * 0.18 }}
                >
                  {f.value}
                </motion.text>
              </g>
            );
          })}

          {/* submit button — pops in, then gets clicked */}
          <motion.g
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.1, ease: EASE }}
            style={{ transformOrigin: "170px 220px" }}
          >
            {/* press dip, timed to the cursor's click */}
            <motion.g
              initial={{ scale: 1 }}
              animate={{ scale: [1, 0.96, 1] }}
              transition={{ duration: 0.4, delay: 2.22, times: [0, 0.5, 1] }}
              style={{ transformOrigin: "170px 220px" }}
            >
              <rect x="60" y="206" width="220" height="28" rx="6" fill="#d97706" />

              {/* click ripple */}
              <motion.circle
                cx="170"
                cy="220"
                r="4"
                fill="#ffffff"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 0.45, 0], scale: [0, 6, 11] }}
                transition={{ duration: 0.6, delay: 2.42, ease: "easeOut" }}
                style={{ transformOrigin: "170px 220px" }}
              />

              <text
                x="170"
                y="224"
                textAnchor="middle"
                fontFamily="var(--font-mono), ui-monospace, monospace"
                fontSize="12"
                fill="#ffffff"
                letterSpacing="1.5"
              >
                SEND REQUEST
              </text>
            </motion.g>
          </motion.g>
        </motion.g>

        {/* success state — the whole inquiry becomes a confirmation */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 2.62 }}
        >
          <motion.circle
            cx="190"
            cy="102"
            r="40"
            fill="#0f766e"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 2.62, ease: EASE_BACK }}
            style={{ transformOrigin: "190px 102px" }}
          />
          <motion.path
            d="M 171 103 l 11 12 l 23 -26"
            stroke="#ffffff"
            strokeWidth="4.6"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 2.95, ease: EASE }}
          />
          <motion.g
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 3.0, ease: EASE }}
          >
            <text
              x="190"
              y="194"
              textAnchor="middle"
              fontFamily="var(--font-sans), system-ui"
              fontSize="23"
              fontWeight="600"
              fill="#0b0f14"
            >
              Request sent
            </text>
            <text
              x="190"
              y="218"
              textAnchor="middle"
              fontFamily="var(--font-mono), ui-monospace, monospace"
              fontSize="11"
              fill="#9ca3af"
              letterSpacing="1.5"
            >
              WE&apos;LL BE IN TOUCH SHORTLY
            </text>
          </motion.g>
        </motion.g>

        {/* pointer that moves in, clicks, then vanishes on the spot */}
        <motion.g
          initial={{ opacity: 0, x: 250, y: 256 }}
          animate={{
            opacity: [0, 1, 1, 1, 0],
            x: [250, 250, 178, 178, 178],
            y: [256, 256, 226, 230, 230],
          }}
          transition={{
            duration: 1.7,
            delay: 1.3,
            times: [0, 0.08, 0.5, 0.66, 0.74],
            ease: "easeInOut",
          }}
        >
          <path
            d="M 0 0 L 0 16 L 4.2 12.2 L 6.8 17.6 L 8.8 16.7 L 6.2 11.3 L 11 11.2 Z"
            fill="#0b0f14"
            stroke="#ffffff"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </motion.g>
      </svg>
    </PhaseVisual>
  );
}

/* Shared package marker — the copper square reused in phases 2 and 4. */
function Parcel() {
  return (
    <div className="grid h-[26px] w-[26px] place-items-center rounded-[6px] bg-accent text-bg-elev shadow-[var(--shadow-soft)]">
      <Package size={15} strokeWidth={2} />
    </div>
  );
}

/* A station on the phase-2 path: a 56px badge centred on `x` with a label
   under it. `dark` = the ItalParcel hub (filled near-black — "us"). */
function Station({
  x,
  label,
  dark,
  children,
}: {
  x: number;
  label: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className="absolute flex flex-col items-center"
      style={{ left: x, top: 12, transform: "translateX(-50%)" }}
    >
      <div
        className={cn(
          "relative grid h-[56px] w-[56px] place-items-center rounded-full",
          dark
            ? "bg-fg text-bg-elev"
            : "border border-border bg-bg-elev text-fg shadow-[var(--shadow-soft)]"
        )}
      >
        {children}
      </div>
      <span className="mt-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
        {label}
      </span>
    </div>
  );
}

function ReceiveArt() {
  // ONE shared clock: a 0→1 progress that cycles every 6s. Every moving piece
  // (parcel, hub gears, delivered tick) is derived from it with useTransform, so
  // they are physically incapable of drifting out of sync.
  const time = useTime();
  const p = useTransform(time, (ms) => (ms % 6000) / 6000);

  // Parcel — x sits exactly on each badge edge where opacity flips (badge r=28,
  // parcel 26px wide) so it never overlaps a circle.
  const PT = [0, 0.04, 0.22, 0.26, 0.5, 0.54, 0.72, 0.76, 1];
  const parcelX = useTransform(p, PT, [78, 78, 162, 162, 244, 244, 328, 328, 328]);
  const parcelOp = useTransform(p, PT, [0, 1, 1, 0, 0, 1, 1, 0, 0]);

  // Hub — warehouse ⇄ gears only while the parcel is inside (0.26–0.5).
  const HT = [0, 0.26, 0.3, 0.46, 0.5, 1];
  const whOp = useTransform(p, HT, [1, 1, 0, 0, 1, 1]);
  const gearOp = useTransform(p, HT, [0, 0, 1, 1, 0, 0]);

  // Destination — map-pin becomes a big teal "delivered" disc, only after the
  // parcel has arrived (0.76).
  const DT = [0, 0.76, 0.82, 0.97, 1];
  const pinOp = useTransform(p, DT, [1, 1, 0, 0, 1]);
  const tickOp = useTransform(p, DT, [0, 0, 1, 1, 0]);
  const tickSc = useTransform(p, DT, [0.3, 0.3, 1, 1, 0.6]);

  return (
    <PhaseVisual>
      <motion.div
        className="relative"
        style={{ width: 432, height: 106 }}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {/* copper line the parcel rides */}
        <div
          className="absolute h-[2px] rounded-full bg-accent"
          style={{ left: 50, right: 50, top: 39 }}
        />

        {/* SELLER */}
        <Station x={50} label="SELLER">
          <Store size={24} strokeWidth={1.8} />
        </Station>

        {/* ITALPARCEL hub — warehouse ⇄ two counter-rotating gears (repack) */}
        <Station x={216} label="ITALPARCEL" dark>
          <motion.span
            className="absolute inset-0 grid place-items-center"
            style={{ opacity: whOp }}
          >
            <Warehouse size={24} strokeWidth={1.8} />
          </motion.span>
          <motion.span
            className="absolute inset-0 grid place-items-center"
            style={{ opacity: gearOp }}
          >
            <span className="relative h-7 w-7">
              <motion.span
                className="absolute left-0 top-0 block"
                animate={{ rotate: 360 }}
                transition={{ duration: 2.6, ease: "linear", repeat: Infinity }}
              >
                <Cog size={18} strokeWidth={2} />
              </motion.span>
              <motion.span
                className="absolute -bottom-0.5 -right-0.5 block"
                animate={{ rotate: -360 }}
                transition={{ duration: 2.6, ease: "linear", repeat: Infinity }}
              >
                <Cog size={14} strokeWidth={2} />
              </motion.span>
            </span>
          </motion.span>
        </Station>

        {/* DESTINATION — map pin becomes a teal delivered disc on arrival */}
        <Station x={382} label="DESTINATION">
          <motion.span
            className="absolute inset-0 grid place-items-center"
            style={{ opacity: pinOp }}
          >
            <MapPin size={24} strokeWidth={1.8} />
          </motion.span>
          <motion.span
            className="absolute inset-0 grid place-items-center rounded-full bg-teal text-bg-elev"
            style={{ opacity: tickOp, scale: tickSc }}
          >
            <Check size={28} strokeWidth={3} />
          </motion.span>
        </Station>

        {/* the parcel — position AND opacity both read the shared clock */}
        <motion.div
          className="absolute"
          style={{ left: 0, top: 27, x: parcelX, opacity: parcelOp }}
        >
          <Parcel />
        </motion.div>
      </motion.div>
    </PhaseVisual>
  );
}

function ShipArt() {
  const rows = [
    { label: "Handling", value: "€17.00" },
    { label: "Shipping · DPD", value: "€30.00" },
    { label: "Activation credit", value: "−€10.00" },
  ];
  return (
    <PhaseVisual>
      <svg viewBox="0 0 380 280" preserveAspectRatio="xMidYMid meet" className="h-full w-full" aria-hidden>
        {/* quote ticket */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <rect
            x="30"
            y="40"
            width="206"
            height="200"
            rx="8"
            fill="#ffffff"
            stroke="#d6d3ca"
            style={{
              filter:
                "drop-shadow(0 1px 2px rgba(11,15,20,0.04)) drop-shadow(0 10px 22px rgba(11,15,20,0.07))",
            }}
          />
          <text
            x="46"
            y="66"
            fontFamily="var(--font-mono), ui-monospace, monospace"
            fontSize="12"
            fill="#9ca3af"
            letterSpacing="1.5"
          >
            QUOTE · №&#160;8472-EW
          </text>

          {/* approved status */}
          <motion.g
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 1.1, ease: EASE_BACK }}
            style={{ transformOrigin: "212px 60px" }}
          >
            <circle cx="212" cy="60" r="11" fill="#0f766e" />
            <path
              d="M 207 60 l 3 3 l 6 -7"
              stroke="#ffffff"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.g>

          {/* header check pulses gently, in loop */}
          <motion.circle
            cx="212"
            cy="60"
            r="11"
            fill="none"
            stroke="#0f766e"
            strokeWidth="2"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0, 0.45, 0], scale: [1, 1.9, 1.9] }}
            transition={{ duration: 2.2, delay: 1.6, repeat: Infinity, ease: "easeOut" }}
            style={{ transformOrigin: "212px 60px" }}
          />

          <line x1="46" y1="78" x2="220" y2="78" stroke="#e7e5de" />

          {/* line items */}
          {rows.map((row, i) => {
            const y = 110 + i * 30;
            return (
              <motion.g
                key={row.label}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.15 + i * 0.12, ease: EASE }}
              >
                <text x="46" y={y} fontFamily="var(--font-mono), ui-monospace, monospace" fontSize="11" fill="#0b0f14" opacity="0.7">
                  {row.label}
                </text>
                <text x="220" y={y} textAnchor="end" fontFamily="var(--font-mono), ui-monospace, monospace" fontSize="11" fill="#0b0f14">
                  {row.value}
                </text>
              </motion.g>
            );
          })}

          <line x1="46" y1="194" x2="220" y2="194" stroke="#0b0f14" strokeWidth="1.4" />

          <text x="46" y="222" fontFamily="var(--font-mono), ui-monospace, monospace" fontSize="12" fill="#0b0f14" fontWeight="600" letterSpacing="1">
            TOTAL
          </text>
          <motion.text
            x="220"
            y="226"
            textAnchor="end"
            fontFamily={"var(--font-sans), system-ui"}
            fontSize="26"
            fontWeight="600"
            fill="#0b0f14"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.5, ease: EASE_BACK }}
            style={{ transformOrigin: "220px 222px" }}
          >
            €37.00
          </motion.text>

          {/* APPROVED stamp — imprints over the total, left of the number */}
          <motion.g
            initial={{ opacity: 0, scale: 1.8 }}
            animate={{ opacity: 0.86, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.95, ease: EASE_STAMP }}
            style={{ transformOrigin: "112px 210px" }}
          >
            <g transform="rotate(-10 112 210)">
              <rect
                x="66"
                y="196"
                width="92"
                height="30"
                rx="4"
                fill="none"
                stroke="#0f766e"
                strokeWidth="2.5"
              />
              <text
                x="112"
                y="215"
                textAnchor="middle"
                fontFamily="var(--font-mono), ui-monospace, monospace"
                fontSize="13"
                fontWeight="700"
                fill="#0f766e"
                letterSpacing="2"
              >
                APPROVED
              </text>
            </g>
          </motion.g>
        </motion.g>

        {/* approved → a stylised black plane departs along the ticket base and
            accelerates off the right edge of the frame, then is gone */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0], x: [0, 0, 170, 210] }}
          transition={{
            duration: 1.5,
            delay: 1.45,
            times: [0, 0.12, 0.82, 1],
            ease: "easeIn",
          }}
        >
          <g transform="translate(262, 236) scale(1.15)">
            <path
              d="M 26 0 L 10 -2.5 L 2 -2.5 L -12 -14 L -7 -2.5 L -15 -2.5 L -20 -8 L -16 -1.2 L -22 0 L -16 1.2 L -20 8 L -15 2.5 L -7 2.5 L -12 14 L 2 2.5 L 10 2.5 Z"
              fill="#0b0f14"
            />
          </g>
        </motion.g>
      </svg>
    </PhaseVisual>
  );
}

function TrackArt() {
  const stops = [
    { label: "Picked up", date: "MAY 12", done: true },
    { label: "Repacked", date: "MAY 12", done: true },
    { label: "Departed", date: "MAY 13", done: true },
    { label: "Delivered", date: "ETA MAY 16", done: false },
  ];
  return (
    <PhaseVisual>
      <motion.div
        className="flex w-full max-w-[27rem] flex-col items-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
      >
        {/* origin / destination share the same 4-col grid → sit over col 1 & 4 */}
        <div className="grid w-full grid-cols-4">
          <span className="text-center font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
            TRENTO
          </span>
          <span className="col-start-4 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-fg-subtle">
            NEW YORK
          </span>
        </div>

        {/* timeline — the node grid sets every column centre; the line and the
            live marker are absolute overlays on those same centres, so spunta +
            label + data and the line all share one centre per column. */}
        <div className="relative mt-5 w-full pt-[34px]">
          {/* line segments at the node centre (pt 34 + node radius 18 = 52) —
              z-0 so the opaque node circles (z-10) hide it; visible only in gaps */}
          <div className="pointer-events-none absolute inset-x-0 z-0" style={{ top: 51 }}>
            <motion.div
              className="absolute h-[2px] origin-left rounded-full bg-fg"
              style={{ left: "12.5%", width: "50%" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, ease: "linear" }}
            />
            <motion.div
              className="absolute h-[2px] origin-left rounded-full bg-accent"
              style={{ left: "62.5%", width: "12.5%" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.25, delay: 1, ease: "linear" }}
            />
            <div
              className="absolute h-[2px] rounded-full bg-border"
              style={{ left: "75%", width: "12.5%" }}
            />
          </div>

          {/* nodes — z-10 above the line so the circles cover it */}
          <div className="relative z-10 grid grid-cols-4">
            {stops.map((s, i) => (
              <div key={s.label} className="flex flex-col items-center">
                <motion.div
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-full",
                    s.done
                      ? "bg-fg text-bg-elev"
                      : "border-2 border-border-strong bg-bg-elev"
                  )}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: s.done ? 0.1 + i * 0.45 : 1.5,
                    ease: EASE_BACK,
                  }}
                >
                  {s.done && <Check size={16} strokeWidth={3} />}
                </motion.div>
                <span
                  className={cn(
                    "mt-3 whitespace-nowrap font-mono text-[10px] uppercase tracking-[0.08em]",
                    s.done ? "text-fg" : "text-fg-subtle"
                  )}
                >
                  {s.label}
                </span>
                <span className="mt-0.5 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.06em] text-fg-subtle">
                  {s.date}
                </span>
              </div>
            ))}
          </div>

          {/* live parcel marker at 75% (between Departed and Delivered) — on top */}
          <div className="absolute z-20" style={{ left: "75%", top: 52 }}>
            <div className="-translate-x-1/2 -translate-y-1/2">
              <motion.div
                initial={{ opacity: 0, scale: 0.4 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 1.25, ease: EASE_BACK }}
              >
                <div className="relative">
                  {/* pulsing copper halo */}
                  <motion.span
                    className="absolute rounded-[9px] bg-accent/30"
                    style={{ inset: -7 }}
                    animate={{ opacity: [0.5, 0, 0.5], scale: [0.9, 1.5, 0.9] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  />
                  {/* the parcel, bobbing live */}
                  <motion.div
                    animate={{ x: [-2, 2, -2] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Parcel />
                  </motion.div>
                  {/* callout dropping from above, pointing down at the parcel */}
                  <div className="absolute bottom-full left-1/2 mb-2 -translate-x-1/2">
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 1.6, ease: EASE }}
                    >
                      <div className="whitespace-nowrap rounded-md border border-border bg-bg-elev px-2 py-1 font-mono text-[9px] uppercase tracking-[0.1em] text-fg shadow-[var(--shadow-soft)]">
                        Milan hub · 14:32
                      </div>
                      <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-border bg-bg-elev" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* WhatsApp — a separate pill, generous gap below the timeline */}
        <motion.div
          className="mt-9 flex items-center gap-2.5 rounded-full border border-border bg-bg-elev px-4 py-2 shadow-[var(--shadow-soft)]"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.85, ease: EASE }}
        >
          <MessageCircle size={16} className="text-teal" strokeWidth={2} />
          <span className="text-sm font-medium text-fg">Need a hand?</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fg-subtle">
            WhatsApp / Email
          </span>
        </motion.div>
      </motion.div>
    </PhaseVisual>
  );
}
