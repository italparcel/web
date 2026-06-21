"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
  useInView,
} from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

// How long each intermediate phase is held while the stage "catches up" to a
// fast scroll. Big enough that every phase is actually seen, small enough that
// the catch-up still feels responsive.
const STEP_ADVANCE_MS = 150;

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
                  ease: [0.16, 1, 0.3, 1],
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
// for the container. Aspect ratio, the one dashed border, the page-cream
// background, radius and padding are identical for every phase; each phase only
// supplies its own artwork, centred in a safe-zone and fitted so nothing spills.
function PhaseVisual({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl border-[1.5px] border-dashed border-border-strong bg-bg">
      {/* uniform dotted texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #0b0f14 1px, transparent 1px)",
          backgroundSize: "14px 14px",
        }}
      />
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
          transition={{ duration: 0.35, delay: 2.5, ease: [0.4, 0, 1, 1] }}
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
            transition={{ duration: 0.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
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
            transition={{ duration: 0.4, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
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
            transition={{ duration: 0.5, delay: 2.62, ease: [0.34, 1.45, 0.5, 1] }}
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
            transition={{ duration: 0.4, delay: 2.95, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.g
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 3.0, ease: [0.16, 1, 0.3, 1] }}
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

function ReceiveArt() {
  return (
    <PhaseVisual>
      <svg viewBox="0 0 380 280" preserveAspectRatio="xMidYMid meet" className="h-full w-full" aria-hidden>
        {/* route guides */}
        <line x1="108" y1="150" x2="146" y2="150" stroke="#d6d3ca" strokeWidth="2" strokeDasharray="2 5" />
        <line x1="234" y1="150" x2="266" y2="150" stroke="#d6d3ca" strokeWidth="2" strokeDasharray="2 5" />

        {/* route trails, traced as each parcel travels */}
        <motion.line
          x1="108"
          y1="150"
          x2="146"
          y2="150"
          stroke="#d97706"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 0.95 }}
        />
        <motion.line
          x1="234"
          y1="150"
          x2="266"
          y2="150"
          stroke="#d97706"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1, delay: 2.3 }}
        />

        {/* seller — a recognisable little shop */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* shop body */}
          <rect x="44" y="113" width="60" height="67" rx="3" fill="#ffffff" stroke="#d6d3ca" strokeWidth="1.5" />
          {/* display window with goods */}
          <rect x="51" y="124" width="29" height="32" rx="2" fill="#eef5f3" stroke="#e7e5de" />
          <rect x="56" y="139" width="8" height="17" fill="#bcccc8" />
          <rect x="67" y="133" width="8" height="23" fill="#bcccc8" />
          {/* door */}
          <rect x="85" y="150" width="17" height="30" rx="1" fill="#f3eee2" stroke="#e7e5de" />
          <circle cx="89" cy="166" r="1.6" fill="#9ca3af" />
          {/* scalloped awning, overhanging the storefront */}
          <rect x="38" y="96" width="72" height="13" rx="1" fill="#d97706" />
          <path d="M 38 109 q 9 10 18 0 q 9 10 18 0 q 9 10 18 0 q 9 10 18 0" fill="#d97706" />
          <text x="74" y="212" textAnchor="middle" fontFamily="var(--font-mono), ui-monospace, monospace" fontSize="11" fill="#9ca3af" letterSpacing="1.5">
            SELLER
          </text>
        </motion.g>

        {/* ItalParcel — a light-bodied warehouse with a dark roof */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* body */}
          <rect x="150" y="112" width="80" height="68" rx="3" fill="#ffffff" stroke="#d6d3ca" strokeWidth="1.5" />
          {/* gable roof */}
          <polygon points="142,114 190,86 238,114" fill="#0b0f14" />
          {/* side windows */}
          <rect x="158" y="124" width="13" height="13" rx="1.5" fill="#eef5f3" stroke="#e7e5de" />
          <rect x="209" y="124" width="13" height="13" rx="1.5" fill="#eef5f3" stroke="#e7e5de" />
          {/* roll-up loading dock */}
          <rect x="174" y="128" width="32" height="52" rx="1.5" fill="#ece9e1" stroke="#d6d3ca" />
          <g stroke="#c7c2b4" strokeWidth="1.2">
            <line x1="176" y1="139" x2="204" y2="139" />
            <line x1="176" y1="150" x2="204" y2="150" />
            <line x1="176" y1="161" x2="204" y2="161" />
            <line x1="176" y1="172" x2="204" y2="172" />
          </g>
          {/* brand badge on the roof — a little parcel */}
          <circle cx="190" cy="96" r="12" fill="#d97706" />
          <g stroke="#ffffff" strokeWidth="2" fill="none" strokeLinejoin="round" strokeLinecap="round">
            <rect x="184.5" y="91" width="11" height="10" rx="1.5" />
            <line x1="184.5" y1="96" x2="195.5" y2="96" />
          </g>
          <text x="190" y="212" textAnchor="middle" fontFamily="var(--font-mono), ui-monospace, monospace" fontSize="11" fill="#9ca3af" letterSpacing="1.5">
            ITALPARCEL
          </text>
        </motion.g>

        {/* warehouse intake — a scan sweep + pulse as the parcel arrives */}
        <motion.line
          x1="156"
          y1="124"
          x2="224"
          y2="124"
          stroke="#d97706"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.9, 0], y: [0, 52, 52] }}
          transition={{ duration: 0.6, delay: 1.9, ease: "easeInOut" }}
        />
        <motion.circle
          cx="190"
          cy="96"
          r="12"
          fill="none"
          stroke="#d97706"
          strokeWidth="2"
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 2.4 }}
          transition={{ duration: 0.7, delay: 1.95, ease: "easeOut" }}
          style={{ transformOrigin: "190px 96px" }}
        />

        {/* destination — recipient's home */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <rect x="278" y="118" width="56" height="62" rx="3" fill="#ffffff" stroke="#d6d3ca" strokeWidth="1.5" />
          <polygon points="270,120 306,90 342,120" fill="#0f766e" />
          <rect x="286" y="128" width="13" height="13" rx="1.5" fill="#eef5f3" stroke="#e7e5de" />
          <rect x="300" y="148" width="18" height="32" rx="1" fill="#f3eee2" stroke="#e7e5de" />
          <circle cx="304" cy="164" r="1.6" fill="#9ca3af" />
          <text x="306" y="212" textAnchor="middle" fontFamily="var(--font-mono), ui-monospace, monospace" fontSize="11" fill="#9ca3af" letterSpacing="1">
            DESTINATION
          </text>
        </motion.g>

        {/* parcel: seller → warehouse */}
        <motion.g
          initial={{ opacity: 0, x: 108, y: 150 }}
          animate={{ opacity: [0, 1, 1, 0], x: [108, 116, 140, 146] }}
          transition={{ duration: 1, delay: 0.95, times: [0, 0.12, 0.82, 1], ease: "easeInOut", repeat: Infinity, repeatDelay: 4.5 }}
        >
          <rect x="-11" y="-9" width="22" height="18" rx="3" fill="#d97706" />
          <rect x="-4.5" y="-5" width="12" height="10" rx="1" fill="#fafaf7" opacity="0.9" />
        </motion.g>

        {/* parcel: warehouse → destination (re-packed, re-shipped) */}
        <motion.g
          initial={{ opacity: 0, x: 234, y: 150 }}
          animate={{ opacity: [0, 1, 1, 0], x: [234, 242, 260, 266] }}
          transition={{ duration: 1, delay: 2.3, times: [0, 0.12, 0.82, 1], ease: "easeInOut", repeat: Infinity, repeatDelay: 4.5 }}
        >
          <rect x="-11" y="-9" width="22" height="18" rx="3" fill="#0b0f14" />
          <rect x="-4.5" y="-5" width="12" height="10" rx="1" fill="#fafaf7" opacity="0.9" />
        </motion.g>

        {/* arrowheads at each leg's end */}
        <motion.path
          d="M 140 144 L 146 150 L 140 156"
          stroke="#d97706"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.8 }}
        />
        <motion.path
          d="M 260 144 L 266 150 L 260 156"
          stroke="#d97706"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 3.2 }}
        />

        {/* delivered tick over the destination */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 3.35, ease: [0.34, 1.45, 0.5, 1] }}
          style={{ transformOrigin: "306px 74px" }}
        >
          <circle cx="306" cy="74" r="12" fill="#0f766e" />
          <path
            d="M 300 74 l 4 4 l 8 -9"
            stroke="#ffffff"
            strokeWidth="2.4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
      </svg>
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
            transition={{ duration: 0.4, delay: 1.1, ease: [0.34, 1.45, 0.5, 1] }}
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

          <line x1="46" y1="78" x2="220" y2="78" stroke="#e7e5de" />

          {/* line items */}
          {rows.map((row, i) => {
            const y = 110 + i * 30;
            return (
              <g key={row.label}>
                <text x="46" y={y} fontFamily="var(--font-mono), ui-monospace, monospace" fontSize="12" fill="#0b0f14" opacity="0.7">
                  {row.label}
                </text>
                <text x="220" y={y} textAnchor="end" fontFamily="var(--font-mono), ui-monospace, monospace" fontSize="12" fill="#0b0f14">
                  {row.value}
                </text>
              </g>
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            €37.00
          </motion.text>
        </motion.g>

        {/* hand-off line to the carrier */}
        <motion.path
          d="M 244 140 L 268 140"
          stroke="#0b0f14"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 1.6 }}
        />
        <motion.path
          d="M 261 134 L 271 140 L 261 146"
          stroke="#0b0f14"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 2.2 }}
        />

        {/* carrier badge */}
        <motion.g
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.9 }}
        >
          <rect x="274" y="108" width="76" height="64" rx="8" fill="#0b0f14" />
          <text
            x="312"
            y="136"
            textAnchor="middle"
            fontFamily="var(--font-mono), ui-monospace, monospace"
            fontSize="11"
            fill="#fafaf7"
            opacity="0.7"
            letterSpacing="1.5"
          >
            CARRIER
          </text>
          <text
            x="312"
            y="160"
            textAnchor="middle"
            fontFamily={"var(--font-sans), system-ui"}
            fontSize="20"
            fill="#fafaf7"
            fontWeight="600"
          >
            DPD
          </text>
        </motion.g>
      </svg>
    </PhaseVisual>
  );
}

function TrackArt() {
  const events = [
    { x: 36, label: "Picked up", state: "done", ts: "MAY 12" },
    { x: 113, label: "Repacked", state: "done", ts: "MAY 12" },
    { x: 190, label: "Departed", state: "done", ts: "MAY 13" },
    { x: 267, label: "In transit", state: "active", ts: "MAY 14" },
    { x: 344, label: "Delivered", state: "pending", ts: "ETA MAY 16" },
  ] as const;

  return (
    <PhaseVisual>
      <svg viewBox="0 0 380 280" preserveAspectRatio="xMidYMid meet" className="h-full w-full" aria-hidden>
        {/* origin / destination */}
        <text x="36" y="50" textAnchor="middle" fontFamily="var(--font-mono), ui-monospace, monospace" fontSize="11" fill="#9ca3af" letterSpacing="1.5">
          TRENTO
        </text>
        <text x="344" y="50" textAnchor="middle" fontFamily="var(--font-mono), ui-monospace, monospace" fontSize="11" fill="#9ca3af" letterSpacing="1.5">
          NEW YORK
        </text>

        {/* track */}
        <line x1="36" y1="92" x2="344" y2="92" stroke="#e7e5de" strokeWidth="2" />
        <motion.line
          x1="36"
          y1="92"
          x2="267"
          y2="92"
          stroke="#0b0f14"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {events.map((e, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 + i * 0.18 }}
          >
            {e.state === "done" && (
              <>
                <circle cx={e.x} cy={92} r={9} fill="#0b0f14" />
                <path
                  d={`M ${e.x - 4} 92 L ${e.x - 1} 95 L ${e.x + 4} 89`}
                  stroke="#fafaf7"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </>
            )}
            {e.state === "active" && (
              <>
                <motion.circle
                  cx={e.x}
                  cy={92}
                  r={16}
                  fill="#d97706"
                  opacity={0.18}
                  animate={{ r: [12, 18, 12], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                />
                <circle cx={e.x} cy={92} r={7} fill="#d97706" />
              </>
            )}
            {e.state === "pending" && (
              <circle cx={e.x} cy={92} r={6} fill="#fafaf7" stroke="#d6d3ca" strokeWidth="2" />
            )}
            <text
              x={e.x}
              y={116}
              textAnchor="middle"
              fontFamily="var(--font-mono), ui-monospace, monospace"
              fontSize="10"
              fill={e.state === "pending" ? "#9ca3af" : "#0b0f14"}
              letterSpacing="0.5"
            >
              {e.label.toUpperCase()}
            </text>
            <text
              x={e.x}
              y={131}
              textAnchor="middle"
              fontFamily="var(--font-mono), ui-monospace, monospace"
              fontSize="10"
              fill="#9ca3af"
              letterSpacing="0.5"
            >
              {e.ts}
            </text>
          </motion.g>
        ))}

        {/* live-status / log card — folds in the WhatsApp helper */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <rect
            x="44"
            y="162"
            width="292"
            height="66"
            rx="10"
            fill="#ffffff"
            stroke="#d6d3ca"
            style={{
              filter:
                "drop-shadow(0 1px 2px rgba(11,15,20,0.04)) drop-shadow(0 10px 22px rgba(11,15,20,0.07))",
            }}
          />
          {/* row 1 — live status */}
          <motion.circle
            cx="64"
            cy="184"
            r="9"
            fill="#d97706"
            opacity={0.18}
            animate={{ r: [6, 11, 6], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2.4, repeat: Infinity }}
          />
          <circle cx="64" cy="184" r="3.5" fill="#d97706" />
          <text x="80" y="188" fontFamily={"var(--font-sans), system-ui"} fontSize="12" fill="#0b0f14">
            In transit · Milan hub
          </text>
          <text x="320" y="188" textAnchor="end" fontFamily="var(--font-mono), ui-monospace, monospace" fontSize="11" fill="#9ca3af" letterSpacing="1">
            14:32
          </text>

          <line x1="64" y1="201" x2="316" y2="201" stroke="#e7e5de" />

          {/* row 2 — WhatsApp helper */}
          <circle cx="64" cy="216" r="3.5" fill="#0f766e" />
          <text x="80" y="220" fontFamily={"var(--font-sans), system-ui"} fontSize="12" fill="#0b0f14">
            Need a hand?
          </text>
          <text x="320" y="220" textAnchor="end" fontFamily="var(--font-mono), ui-monospace, monospace" fontSize="11" fill="#9ca3af" letterSpacing="1.5">
            WHATSAPP
          </text>
        </motion.g>
      </svg>
    </PhaseVisual>
  );
}
