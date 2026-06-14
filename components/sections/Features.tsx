"use client";

import {
  Boxes,
  Camera,
  Lock,
  ScrollText,
  MessagesSquare,
  Sparkles,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { cn } from "@/lib/cn";

export function Features() {
  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="container-x">
        <SectionHeader
          eyebrow="Why ItalParcel"
          title={
            <>
              A small Italian operation
              <br />
              <span className="display-light text-fg-muted">
                with big-operator process.
              </span>
            </>
          }
          description="Every parcel documented. Every fee itemized. Every step on the record."
          align="left"
        />

        <div className="mt-14 grid auto-rows-[minmax(200px,_auto)] gap-4 md:grid-cols-6 md:gap-5">
          <Reveal className="md:col-span-3 md:row-span-2">
            <Card className="relative h-full overflow-hidden bg-fg text-bg">
              <CardArtRepack />
              <CardBody>
                <CardIcon dark>
                  <Boxes size={18} />
                </CardIcon>
                <CardTitle dark>Repack &amp; consolidate</CardTitle>
                <CardCopy dark>
                  We open and repackage every parcel. If you are receiving
                  multiple shipments, we can consolidate multiple items into a
                  single package and help you save significantly on shipping
                  costs.
                </CardCopy>
              </CardBody>
            </Card>
          </Reveal>

          <Reveal delay={0.06} className="md:col-span-3">
            <Card className="relative overflow-hidden border-fg bg-bg">
              <CardArtDots />
              <CardBody className="relative">
                <CardIcon>
                  <Lock size={18} />
                </CardIcon>
                <CardTitle>Locker &amp; pickup-point collection</CardTitle>
                <CardCopy>
                  We offer a wide selection of lockers where we can collect
                  your parcels. Just send us the pickup codes, and we will
                  handle the rest!
                </CardCopy>
              </CardBody>
            </Card>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-3">
            <Card className="relative overflow-hidden border-fg bg-bg">
              <CardArtDots />
              <CardBody className="relative">
                <CardIcon>
                  <ScrollText size={18} />
                </CardIcon>
                <CardTitle>Customs prep, done right</CardTitle>
                <CardCopy>
                  For non-EU destinations, we prepare export documentation
                  based on the information you provide. We act as exporters.
                </CardCopy>
              </CardBody>
            </Card>
          </Reveal>

          <Reveal delay={0.14} className="md:col-span-3">
            <Card className="relative overflow-hidden border-fg bg-bg">
              <CardArtDots />
              <CardBody className="relative">
                <CardIcon>
                  <Camera size={18} />
                </CardIcon>
                <CardTitle>Up to 3 photos, free of charge</CardTitle>
                <CardCopy>
                  Up to 3 high-resolution photos of your parcel&apos;s contents
                  on request — free of charge, before you approve the shipment.
                </CardCopy>
              </CardBody>
            </Card>
          </Reveal>

          <Reveal delay={0.18} className="md:col-span-3">
            <Card className="relative overflow-hidden border-fg bg-bg">
              <CardArtDots />
              <CardBody className="relative">
                <CardIcon>
                  <MessagesSquare size={18} />
                </CardIcon>
                <CardTitle>Real humans, fast</CardTitle>
                <CardCopy>
                  Email or WhatsApp. We reply within 36 working hours — often
                  within the hour.
                </CardCopy>
              </CardBody>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border border-border bg-bg-elev p-7 transition-all duration-500 hover:-translate-y-1 hover:shadow-[var(--shadow-lift)]",
        className
      )}
    >
      {children}
    </article>
  );
}

function CardBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative flex h-full flex-col", className)}>
      {children}
    </div>
  );
}

function CardIcon({
  children,
  dark,
  className,
}: {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "grid h-11 w-11 place-items-center rounded-xl border transition",
        dark
          ? "border-bg/15 bg-bg/10 text-bg group-hover:border-accent group-hover:text-accent"
          : "border-border-strong bg-bg text-fg group-hover:border-accent group-hover:text-accent",
        className
      )}
    >
      {children}
    </span>
  );
}

function CardTitle({
  children,
  dark,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <h3
      className={cn(
        "mt-6 display text-2xl md:text-3xl",
        dark ? "text-bg" : "text-fg"
      )}
    >
      {children}
    </h3>
  );
}

function CardCopy({
  children,
  dark,
}: {
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <p
      className={cn(
        "mt-3 max-w-md text-sm leading-relaxed",
        dark ? "text-bg/70" : "text-fg-muted"
      )}
    >
      {children}
    </p>
  );
}

function CardArtRepack() {
  const reduce = useReducedMotion();
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute -right-10 -bottom-10 hidden h-[22rem] w-[22rem] md:block"
    >
      <svg viewBox="0 0 400 400" className="h-full w-full">
        <defs>
          <pattern
            id="grid-bg"
            width="22"
            height="22"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M22 0 L0 0 0 22"
              fill="none"
              stroke="#fafaf7"
              strokeOpacity="0.06"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="400" height="400" fill="url(#grid-bg)" />

        {/* incoming parcels */}
        {[
          { x: 90, y: 120, seamY: 141, fill: "#d97706", opacity: 1 },
          { x: 170, y: 110, seamY: 131, fill: "#fafaf7", opacity: 0.9 },
          { x: 250, y: 120, seamY: 141, fill: "#0f766e", opacity: 1 },
        ].map((b, i) => (
          <motion.g
            key={i}
            initial={reduce ? false : { opacity: 0, y: -10 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <rect
              x={b.x}
              y={b.y}
              width="60"
              height="42"
              rx="8"
              fill={b.fill}
              opacity={b.opacity}
            />
            <line
              x1={b.x}
              y1={b.seamY}
              x2={b.x + 60}
              y2={b.seamY}
              stroke="#0b0f14"
              strokeOpacity="0.2"
              strokeWidth="2.5"
            />
          </motion.g>
        ))}

        {/* converging arrows */}
        {[
          {
            d: "M 120 168 Q 180 205 180 236",
            head: "M 174 230 L 180 238 L 186 230",
            delay: 0.5,
          },
          {
            d: "M 200 158 L 200 236",
            head: "M 194 230 L 200 238 L 206 230",
            delay: 0.62,
          },
          {
            d: "M 280 168 Q 220 205 220 236",
            head: "M 214 230 L 220 238 L 226 230",
            delay: 0.74,
          },
        ].map((a, i) => (
          <g key={i}>
            <motion.path
              d={a.d}
              stroke="#fafaf7"
              strokeOpacity="0.85"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              initial={reduce ? false : { pathLength: 0, opacity: 0 }}
              whileInView={reduce ? undefined : { pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: a.delay }}
            />
            <motion.path
              d={a.head}
              stroke="#fafaf7"
              strokeOpacity="0.85"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={reduce ? false : { opacity: 0 }}
              whileInView={reduce ? undefined : { opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.3, delay: a.delay + 0.45 }}
            />
          </g>
        ))}

        {/* consolidated parcel */}
        <motion.g
          initial={reduce ? false : { opacity: 0, y: 12 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.55, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
        >
          <rect x="128" y="240" width="144" height="96" rx="12" fill="#d97706" />
          <line
            x1="128"
            y1="288"
            x2="272"
            y2="288"
            stroke="#0b0f14"
            strokeOpacity="0.22"
            strokeWidth="3.5"
          />
          <line
            x1="200"
            y1="240"
            x2="200"
            y2="336"
            stroke="#0b0f14"
            strokeOpacity="0.22"
            strokeWidth="3.5"
          />
        </motion.g>

        <Sparkle x={210} y={80} delay={0.3} />
        <Sparkle x={340} y={200} delay={0.8} />
        <Sparkle x={78} y={300} delay={1.2} />
      </svg>
    </div>
  );
}

function Sparkle({ x, y, delay }: { x: number; y: number; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.g
      initial={reduce ? false : { opacity: 0, scale: 0 }}
      whileInView={reduce ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
    >
      <path
        d={`M ${x} ${y - 8} L ${x + 2} ${y - 2} L ${x + 8} ${y} L ${x + 2} ${y + 2} L ${x} ${y + 8} L ${x - 2} ${y + 2} L ${x - 8} ${y} L ${x - 2} ${y - 2} Z`}
        fill="#fafaf7"
        opacity="0.7"
      />
    </motion.g>
  );
}

function CardArtDots() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-[0.06]"
      style={{
        backgroundImage:
          "radial-gradient(circle, #0b0f14 1px, transparent 1px)",
        backgroundSize: "12px 12px",
      }}
    />
  );
}

export { Sparkles };
