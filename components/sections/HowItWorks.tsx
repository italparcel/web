"use client";

import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import { useRef, useState } from "react";

type Step = {
  n: string;
  kicker: string;
  title: string;
  body: string;
  Art: () => React.JSX.Element;
};

const STEPS: Step[] = [
  {
    n: "01",
    kicker: "Phase 1 — Activation",
    title: "You tell us what's coming.",
    body: "Fill in the form and we'll get back to you with an estimated total (our fee + shipping). If you like it, pay the €10 activation fee — don't worry, it'll be deducted from the total — and you'll get your Italian address right after payment.",
    Art: ActivateArt,
  },
  {
    n: "02",
    kicker: "Phase 2 — Reception",
    title: "Sellers ship. We receive.",
    body: "Order using our address (or a designated pickup point). We receive, open and repack your parcels, and — on request — consolidate them into a single shipment.",
    Art: ReceiveArt,
  },
  {
    n: "03",
    kicker: "Phase 3 — Quote & ship",
    title: "One quote. Then it flies.",
    body: "Based on your parcel's actual weight and dimensions, you'll get the final shipping quote. After payment, we hand it to the carrier as soon as possible. (Customers outside the EU will need to provide the information needed for the customs declaration.)",
    Art: ShipArt,
  },
  {
    n: "04",
    kicker: "Phase 4 — After-care",
    title: "We don't disappear.",
    body: "Tracking support, customs questions, and claims assistance until the parcel lands, we got you. WhatsApp or email — we reply within 36 working hours.",
    Art: TrackArt,
  },
];

export function HowItWorks() {
  const reduce = useReducedMotion();

  if (reduce) return <Fallback />;

  return (
    <>
      <DesktopScroll />
      <Fallback className="md:hidden" />
    </>
  );
}

function DesktopScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const next = Math.min(
      STEPS.length - 1,
      Math.max(0, Math.floor(v * STEPS.length + 0.0001))
    );
    if (next !== active) setActive(next);
  });

  return (
    <section
      id="how"
      ref={ref}
      className="relative hidden md:block"
      style={{ height: `${STEPS.length * 100 + 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col">
        {/* Stage */}
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -32 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0 flex items-center"
            >
              <StepContent step={STEPS[active]} />
            </motion.div>
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
        <h3 className="display mt-4 text-[clamp(2.25rem,5.5vw,4.5rem)] text-fg">
          {step.title}
        </h3>
        <p className="mt-6 max-w-md text-base leading-relaxed text-fg-muted md:text-lg">
          {step.body}
        </p>
      </div>
      <div className="self-center">
        <step.Art />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Mobile / reduced-motion fallback
   ───────────────────────────────────────────────────────────── */

function Fallback({ className = "" }: { className?: string }) {
  return (
    <section
      id="how"
      className={"relative border-t border-border py-20 " + className}
    >
      <div className="container-x">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
          How it works
        </p>
        <h2 className="display mt-4 text-4xl text-fg">
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
              <h3 className="display mt-3 text-2xl text-fg">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">
                {s.body}
              </p>
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
      <span className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.22em] text-fg-subtle">
        Fig.
      </span>
    </div>
  );
}

function ActivateArt() {
  return (
    <ArtFrame>
      <svg viewBox="0 0 380 280" className="h-full w-auto" aria-hidden>
        <rect
          x="40"
          y="30"
          width="300"
          height="220"
          rx="10"
          fill="#ffffff"
          stroke="#d6d3ca"
        />
        {/* header */}
        <text
          x="60"
          y="62"
          fontFamily="ui-monospace, monospace"
          fontSize="9"
          fill="#9ca3af"
          letterSpacing="2"
        >
          INQUIRY ·  №&#160;001
        </text>
        <line x1="60" y1="78" x2="320" y2="78" stroke="#e7e5de" />

        {/* form fields */}
        {[110, 140, 170, 200].map((y, i) => (
          <g key={y}>
            <rect
              x="60"
              y={y - 12}
              width="60"
              height="8"
              rx="2"
              fill="#0b0f14"
              opacity="0.55"
            />
            <motion.rect
              x="60"
              y={y}
              width="220"
              height="14"
              rx="3"
              fill="#f3eee2"
              stroke="#e7e5de"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.2 + i * 0.18,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformOrigin: "60px center" }}
            />
            <motion.rect
              x="64"
              y={y + 4}
              width={[110, 80, 140, 60][i]}
              height="6"
              rx="2"
              fill="#0b0f14"
              opacity="0.85"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.85 }}
              transition={{ duration: 0.3, delay: 0.5 + i * 0.18 }}
            />
          </g>
        ))}

        {/* footer signed */}
        <motion.g
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 1.2 }}
        >
          <circle cx="300" cy="220" r="22" fill="#d97706" />
          <path
            d="M 290 220 L 297 227 L 312 213"
            stroke="#fff"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.g>
        <line x1="60" y1="230" x2="240" y2="230" stroke="#d6d3ca" />
        <text
          x="60"
          y="244"
          fontFamily="ui-monospace, monospace"
          fontSize="8"
          fill="#9ca3af"
          letterSpacing="1.5"
        >
          ITALPARCEL · CONFIRMED
        </text>
      </svg>
    </ArtFrame>
  );
}

function ReceiveArt() {
  return (
    <ArtFrame>
      <svg viewBox="0 0 380 280" className="h-full w-auto" aria-hidden>
        {/* incoming arrows */}
        {[
          { x1: 30, y1: 50, x2: 110, y2: 110, delay: 0.0 },
          { x1: 350, y1: 60, x2: 270, y2: 110, delay: 0.15 },
          { x1: 30, y1: 230, x2: 110, y2: 170, delay: 0.3 },
        ].map((a, i) => (
          <motion.line
            key={i}
            x1={a.x1}
            y1={a.y1}
            x2={a.x2}
            y2={a.y2}
            stroke="#9ca3af"
            strokeWidth="1.2"
            strokeDasharray="3 4"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.7, delay: a.delay }}
          />
        ))}

        {/* incoming parcels */}
        {[
          { x: 80, y: 90, fill: "#d97706", delay: 0.5 },
          { x: 240, y: 90, fill: "#0f766e", delay: 0.65 },
          { x: 80, y: 150, fill: "#0b0f14", delay: 0.8 },
        ].map((p, i) => (
          <motion.g
            key={i}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.4,
              delay: p.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <rect
              x={p.x}
              y={p.y}
              width="60"
              height="40"
              rx="4"
              fill={p.fill}
            />
            <line
              x1={p.x}
              y1={p.y + 22}
              x2={p.x + 60}
              y2={p.y + 22}
              stroke="#fff"
              strokeOpacity="0.35"
              strokeWidth="2"
            />
            <line
              x1={p.x + 30}
              y1={p.y}
              x2={p.x + 30}
              y2={p.y + 40}
              stroke="#fff"
              strokeOpacity="0.35"
              strokeWidth="2"
            />
          </motion.g>
        ))}

        {/* consolidation arrow — curves into the top of the CONSOLIDATED box */}
        <motion.path
          d="M 140 175 Q 215 175 215 200"
          stroke="#d97706"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        />
        <motion.path
          d="M 209 192 L 215 200 L 221 192"
          stroke="#d97706"
          strokeWidth="1.4"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 2.0 }}
        />

        {/* consolidated parcel */}
        <motion.g
          initial={{ opacity: 0, scale: 0.6, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
        >
          <rect
            x="170"
            y="200"
            width="90"
            height="58"
            rx="6"
            fill="#0b0f14"
          />
          <line
            x1="170"
            y1="232"
            x2="260"
            y2="232"
            stroke="#fff"
            strokeOpacity="0.45"
            strokeWidth="3"
          />
          <line
            x1="215"
            y1="200"
            x2="215"
            y2="258"
            stroke="#fff"
            strokeOpacity="0.45"
            strokeWidth="3"
          />
          <text
            x="215"
            y="235"
            textAnchor="middle"
            fontFamily="ui-monospace, monospace"
            fontSize="7"
            fill="#fafaf7"
            letterSpacing="1.5"
          >
            CONSOLIDATED
          </text>
        </motion.g>

        {/* annotations */}
        <text
          x="20"
          y="35"
          fontFamily="ui-monospace, monospace"
          fontSize="7"
          fill="#9ca3af"
          letterSpacing="1.5"
        >
          SELLER A
        </text>
        <text
          x="340"
          y="45"
          textAnchor="end"
          fontFamily="ui-monospace, monospace"
          fontSize="7"
          fill="#9ca3af"
          letterSpacing="1.5"
        >
          SELLER B
        </text>
        <text
          x="20"
          y="252"
          fontFamily="ui-monospace, monospace"
          fontSize="7"
          fill="#9ca3af"
          letterSpacing="1.5"
        >
          SELLER C
        </text>
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
          d="M 250 140 L 310 140"
          stroke="#0b0f14"
          strokeWidth="1.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.7, delay: 1.6 }}
        />
        <motion.path
          d="M 303 134 L 313 140 L 303 146"
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
          x="280"
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
            x="265"
            y="160"
            width="90"
            height="58"
            rx="6"
            fill="#0b0f14"
          />
          <text
            x="310"
            y="184"
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
            x="310"
            y="205"
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
    { x: 110, label: "Repacked", state: "done" },
    { x: 170, label: "Carrier", state: "done" },
    { x: 230, label: "Transit", state: "active" },
    { x: 290, label: "Delivered", state: "pending" },
  ] as const;

  return (
    <ArtFrame>
      <svg viewBox="0 0 380 280" className="h-full w-auto" aria-hidden>
        {/* baseline */}
        <line
          x1="50"
          y1="140"
          x2="290"
          y2="140"
          stroke="#e7e5de"
          strokeWidth="2"
        />
        <motion.line
          x1="50"
          y1="140"
          x2="230"
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
          x="290"
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
