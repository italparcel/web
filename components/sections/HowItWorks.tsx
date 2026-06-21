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

function ArtFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative aspect-[4/3] w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-bg-elev shadow-[var(--shadow-soft)]">
      <div className="absolute inset-3 rounded-xl border border-dashed border-border-strong/60" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #0b0f14 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }}
      />
      <div className="absolute inset-0 grid place-items-center p-10">
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
    <ArtFrame>
      <svg viewBox="0 0 380 280" className="h-full w-auto" aria-hidden>
        {/* request form card */}
        <rect
          x="40"
          y="30"
          width="300"
          height="220"
          rx="10"
          fill="#ffffff"
          stroke="#d6d3ca"
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
            fontFamily="ui-monospace, monospace"
            fontSize="11"
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
                  fontFamily="ui-monospace, monospace"
                  fontSize="8"
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
                  fontFamily="ui-monospace, monospace"
                  fontSize="10"
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
                fontFamily="ui-monospace, monospace"
                fontSize="10"
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
            cy="116"
            r="24"
            fill="#d97706"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 2.62, ease: [0.34, 1.45, 0.5, 1] }}
            style={{ transformOrigin: "190px 116px" }}
          />
          <motion.path
            d="M 179 116 l 7 8 l 15 -17"
            stroke="#ffffff"
            strokeWidth="3.4"
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
              y="168"
              textAnchor="middle"
              fontFamily="var(--font-sans), system-ui"
              fontSize="16"
              fontWeight="600"
              fill="#0b0f14"
            >
              Request sent
            </text>
            <text
              x="190"
              y="189"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="8.5"
              fill="#9ca3af"
              letterSpacing="1.5"
            >
              WE&apos;LL BE IN TOUCH SHORTLY
            </text>
          </motion.g>
        </motion.g>

        {/* pointer that moves in and clicks the button */}
        <motion.g
          initial={{ opacity: 0, x: 250, y: 256 }}
          animate={{
            opacity: [0, 1, 1, 1, 1, 0],
            x: [250, 250, 178, 178, 178, 204],
            y: [256, 256, 226, 230, 226, 244],
          }}
          transition={{
            duration: 1.7,
            delay: 1.3,
            times: [0, 0.08, 0.55, 0.66, 0.78, 1],
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
    </ArtFrame>
  );
}

function ReceiveArt() {
  return (
    <ArtFrame>
      <svg viewBox="0 0 380 280" className="h-full w-auto" aria-hidden>
        {/* caption */}
        <text
          x="190"
          y="40"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="11"
          fill="#0b0f14"
          letterSpacing="0.5"
        >
          From seller to your door
        </text>

        {/* route guides */}
        <line
          x1="90"
          y1="138"
          x2="156"
          y2="138"
          stroke="#d6d3ca"
          strokeWidth="1.4"
          strokeDasharray="2 5"
        />
        <line
          x1="226"
          y1="138"
          x2="290"
          y2="138"
          stroke="#d6d3ca"
          strokeWidth="1.4"
          strokeDasharray="2 5"
        />

        {/* route trails, traced as each parcel travels */}
        <motion.line
          x1="90"
          y1="138"
          x2="156"
          y2="138"
          stroke="#d97706"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.95, delay: 0.85 }}
        />
        <motion.line
          x1="226"
          y1="138"
          x2="290"
          y2="138"
          stroke="#d97706"
          strokeWidth="2"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.95, delay: 2.15 }}
        />

        {/* seller storefront */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <rect x="34" y="118" width="56" height="12" rx="3" fill="#d97706" />
          <rect x="38" y="130" width="50" height="46" rx="3" fill="#ffffff" stroke="#d6d3ca" />
          <rect x="44" y="138" width="16" height="13" rx="1.5" fill="#f3eee2" stroke="#e7e5de" />
          <rect x="66" y="148" width="16" height="28" fill="#f3eee2" stroke="#e7e5de" />
          <text
            x="63"
            y="194"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="8"
            fill="#9ca3af"
            letterSpacing="1.5"
          >
            SELLER
          </text>
        </motion.g>

        {/* ItalParcel hub */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        >
          <rect x="158" y="116" width="64" height="62" rx="5" fill="#0b0f14" />
          <rect x="176" y="150" width="28" height="28" rx="1" fill="#fafaf7" opacity="0.1" />
          <circle cx="190" cy="134" r="11" fill="#d97706" />
          <path
            d="M 190 128 L 190 140 M 184 134 L 196 134"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <text
            x="190"
            y="194"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="8"
            fill="#9ca3af"
            letterSpacing="1.5"
          >
            ITALPARCEL
          </text>
        </motion.g>

        {/* hub arrival pulse */}
        <motion.circle
          cx="190"
          cy="134"
          r="11"
          fill="none"
          stroke="#d97706"
          strokeWidth="2"
          initial={{ opacity: 0.55, scale: 1 }}
          animate={{ opacity: 0, scale: 2.6 }}
          transition={{ duration: 0.7, delay: 1.85, ease: "easeOut" }}
          style={{ transformOrigin: "190px 134px" }}
        />

        {/* destination */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <polygon points="291,138 314,117 337,138" fill="#0f766e" />
          <rect x="297" y="138" width="34" height="38" fill="#ffffff" stroke="#d6d3ca" />
          <rect x="308" y="154" width="13" height="22" fill="#f3eee2" stroke="#e7e5de" />
          <text
            x="314"
            y="194"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="8"
            fill="#9ca3af"
            letterSpacing="1"
          >
            DESTINATION
          </text>
        </motion.g>

        {/* parcel: seller → hub */}
        <motion.g
          initial={{ opacity: 0, x: 90, y: 138 }}
          animate={{ opacity: [0, 1, 1, 0], x: [90, 100, 150, 156] }}
          transition={{
            duration: 0.95,
            delay: 0.85,
            times: [0, 0.12, 0.82, 1],
            ease: "easeInOut",
          }}
        >
          <rect x="-9" y="-7" width="18" height="14" rx="2.5" fill="#d97706" />
          <rect x="-3.5" y="-4" width="9" height="8" rx="1" fill="#fafaf7" opacity="0.9" />
        </motion.g>

        {/* parcel: hub → destination (re-packed, re-shipped) */}
        <motion.g
          initial={{ opacity: 0, x: 226, y: 138 }}
          animate={{ opacity: [0, 1, 1, 0], x: [226, 236, 284, 290] }}
          transition={{
            duration: 0.95,
            delay: 2.15,
            times: [0, 0.12, 0.82, 1],
            ease: "easeInOut",
          }}
        >
          <rect x="-9" y="-7" width="18" height="14" rx="2.5" fill="#0b0f14" />
          <rect x="-3.5" y="-4" width="9" height="8" rx="1" fill="#fafaf7" opacity="0.9" />
        </motion.g>

        {/* arrowheads at each leg's end */}
        <motion.path
          d="M 150 133 L 156 138 L 150 143"
          stroke="#d97706"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1.7 }}
        />
        <motion.path
          d="M 284 133 L 290 138 L 284 143"
          stroke="#d97706"
          strokeWidth="1.8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 3.0 }}
        />

        {/* delivered tick over the destination */}
        <motion.g
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 3.1, ease: [0.34, 1.45, 0.5, 1] }}
          style={{ transformOrigin: "314px 104px" }}
        >
          <circle cx="314" cy="104" r="9" fill="#0f766e" />
          <path
            d="M 309.5 104 l 3 3 l 6 -7"
            stroke="#ffffff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
      </svg>
    </ArtFrame>
  );
}

function ShipArt() {
  return (
    <ArtFrame>
      <svg viewBox="0 0 380 280" className="h-full w-auto" aria-hidden>
        {/* quote ticket */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <rect
            x="40"
            y="40"
            width="200"
            height="200"
            rx="6"
            fill="#ffffff"
            stroke="#d6d3ca"
          />
          <text
            x="55"
            y="62"
            fontFamily="ui-monospace, monospace"
            fontSize="8"
            fill="#9ca3af"
            letterSpacing="1.5"
          >
            QUOTE · №&#160;Q-8472
          </text>
          <line x1="55" y1="74" x2="225" y2="74" stroke="#e7e5de" />

          {/* line items */}
          {[
            { label: "Handling", value: "€17.00", y: 102 },
            { label: "Repack", value: "Included", y: 124 },
            { label: "Shipping · DHL", value: "€30.00", y: 146 },
            { label: "Activation credit", value: "−€10.00", y: 168 },
          ].map((row) => (
            <g key={row.y}>
              <text
                x="55"
                y={row.y}
                fontFamily="ui-monospace, monospace"
                fontSize="9"
                fill="#0b0f14"
                opacity="0.7"
              >
                {row.label}
              </text>
              <text
                x="225"
                y={row.y}
                textAnchor="end"
                fontFamily="ui-monospace, monospace"
                fontSize="9"
                fill="#0b0f14"
              >
                {row.value}
              </text>
            </g>
          ))}

          <line
            x1="55"
            y1="186"
            x2="225"
            y2="186"
            stroke="#0b0f14"
            strokeWidth="1.4"
          />

          <text
            x="55"
            y="208"
            fontFamily="ui-monospace, monospace"
            fontSize="10"
            fill="#0b0f14"
            fontWeight="600"
          >
            TOTAL
          </text>
          <motion.text
            x="225"
            y="210"
            textAnchor="end"
            fontFamily={"var(--font-sans), system-ui"}
            fontSize="22"
            fill="#0b0f14"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            €37.00
          </motion.text>

          {/* approved stamp */}
          <motion.g
            initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -10 }}
            transition={{
              duration: 0.5,
              delay: 1.3,
              ease: [0.16, 1, 0.3, 1],
            }}
            style={{ transformOrigin: "180px 220px" }}
          >
            <rect
              x="150"
              y="195"
              width="80"
              height="34"
              rx="3"
              fill="none"
              stroke="#d97706"
              strokeWidth="2"
              strokeDasharray="4 3"
            />
            <text
              x="190"
              y="218"
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="11"
              fill="#d97706"
              fontWeight="600"
              letterSpacing="2"
            >
              APPROVED
            </text>
          </motion.g>
        </motion.g>

        {/* hand-off arrow */}
        <motion.path
          d="M 250 140 L 294 140"
          stroke="#0b0f14"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 1.6 }}
        />
        <motion.path
          d="M 287 134 L 297 140 L 287 146"
          stroke="#0b0f14"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 2.2 }}
        />
        <text
          x="267"
          y="128"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="8"
          fill="#9ca3af"
          letterSpacing="1.5"
        >
          HAND-OFF
        </text>

        {/* carrier badge */}
        <motion.g
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 1.9 }}
        >
          <rect
            x="300"
            y="111"
            width="76"
            height="58"
            rx="6"
            fill="#0b0f14"
          />
          <text
            x="338"
            y="135"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="9"
            fill="#fafaf7"
            opacity="0.7"
            letterSpacing="1.5"
          >
            CARRIER
          </text>
          <text
            x="338"
            y="156"
            textAnchor="middle"
            fontFamily={"var(--font-sans), system-ui"}
            fontSize="16"
            fill="#fafaf7"
            fontWeight="600"
          >
            DHL
          </text>
        </motion.g>
      </svg>
    </ArtFrame>
  );
}

function TrackArt() {
  const events = [
    { x: 50, label: "Picked up", state: "done" },
    { x: 120, label: "Repacked", state: "done" },
    { x: 190, label: "Departed", state: "done" },
    { x: 260, label: "In transit", state: "active" },
    { x: 330, label: "Delivered", state: "pending" },
  ] as const;

  return (
    <ArtFrame>
      <svg viewBox="0 0 380 280" className="h-full w-auto" aria-hidden>
        {/* baseline */}
        <line
          x1="50"
          y1="140"
          x2="330"
          y2="140"
          stroke="#e7e5de"
          strokeWidth="2"
        />
        <motion.line
          x1="50"
          y1="140"
          x2="260"
          y2="140"
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
                <circle cx={e.x} cy={140} r={8} fill="#0b0f14" />
                <path
                  d={`M ${e.x - 4} 140 L ${e.x - 1} 143 L ${e.x + 4} 137`}
                  stroke="#fafaf7"
                  strokeWidth="1.6"
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
                  cy={140}
                  r={16}
                  fill="#d97706"
                  opacity={0.18}
                  animate={{ r: [12, 18, 12], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2.4, repeat: Infinity }}
                />
                <circle cx={e.x} cy={140} r={6} fill="#d97706" />
              </>
            )}
            {e.state === "pending" && (
              <circle
                cx={e.x}
                cy={140}
                r={5}
                fill="#fafaf7"
                stroke="#d6d3ca"
                strokeWidth="1.6"
              />
            )}
            <text
              x={e.x}
              y={170}
              textAnchor="middle"
              fontFamily="ui-monospace, monospace"
              fontSize="9"
              fill={e.state === "pending" ? "#9ca3af" : "#0b0f14"}
              letterSpacing="1"
            >
              {e.label.toUpperCase()}
            </text>
          </motion.g>
        ))}

        {/* labels at ends */}
        <text
          x="50"
          y="110"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="9"
          fill="#9ca3af"
          letterSpacing="1.5"
        >
          TRENTO
        </text>
        <text
          x="330"
          y="110"
          textAnchor="middle"
          fontFamily="ui-monospace, monospace"
          fontSize="9"
          fill="#9ca3af"
          letterSpacing="1.5"
        >
          TOKYO
        </text>

        {/* helper banner */}
        <motion.g
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.6 }}
        >
          <rect
            x="100"
            y="210"
            width="180"
            height="30"
            rx="4"
            fill="#ffffff"
            stroke="#e7e5de"
          />
          <circle cx="118" cy="225" r="4" fill="#0f766e" />
          <text
            x="132"
            y="229"
            fontFamily={"var(--font-sans), system-ui"}
            fontSize="11"
            fill="#0b0f14"
          >
            Need a hand?
          </text>
          <text
            x="265"
            y="229"
            textAnchor="end"
            fontFamily="ui-monospace, monospace"
            fontSize="9"
            fill="#9ca3af"
            letterSpacing="1.5"
          >
            WHATSAPP
          </text>
        </motion.g>
      </svg>
    </ArtFrame>
  );
}
