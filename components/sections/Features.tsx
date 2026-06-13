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
                  We open and document every parcel, then repack it to carrier
                  specifications. Several orders can ship as a single parcel,
                  cutting your shipping cost.
                </CardCopy>
              </CardBody>
            </Card>
          </Reveal>

          <Reveal delay={0.06} className="md:col-span-3">
            <Card>
              <CardBody>
                <CardIcon>
                  <Lock size={18} />
                </CardIcon>
                <CardTitle>Locker &amp; pickup-point collection</CardTitle>
                <CardCopy>
                  InPost · Amazon Hub · Poste Locker · carrier pickup points.
                  Send us the code, we collect on your behalf.
                </CardCopy>
              </CardBody>
            </Card>
          </Reveal>

          <Reveal delay={0.1} className="md:col-span-3">
            <Card>
              <CardBody>
                <CardIcon>
                  <ScrollText size={18} />
                </CardIcon>
                <CardTitle>Customs prep, done right</CardTitle>
                <CardCopy>
                  For non-EU destinations we prepare the export documentation
                  from your data. We act as exporter.
                </CardCopy>
              </CardBody>
            </Card>
          </Reveal>

          <Reveal delay={0.14} className="md:col-span-3">
            <Card>
              <CardBody>
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
      className="pointer-events-none absolute -right-10 -bottom-10 h-[22rem] w-[22rem]"
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
        <motion.g
          initial={reduce ? false : { y: 12, opacity: 0 }}
          whileInView={reduce ? undefined : { y: 0, opacity: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8 }}
        >
          <rect x="100" y="170" width="120" height="90" rx="10" fill="#d97706" />
          <rect
            x="120"
            y="120"
            width="120"
            height="90"
            rx="10"
            fill="#fafaf7"
            opacity="0.9"
          />
          <rect x="80" y="220" width="120" height="90" rx="10" fill="#0f766e" />
          <line
            x1="100"
            y1="215"
            x2="220"
            y2="215"
            stroke="#0b0f14"
            strokeOpacity="0.25"
            strokeWidth="3"
          />
          <line
            x1="120"
            y1="165"
            x2="240"
            y2="165"
            stroke="#0b0f14"
            strokeOpacity="0.15"
            strokeWidth="3"
          />
          <line
            x1="80"
            y1="265"
            x2="200"
            y2="265"
            stroke="#0b0f14"
            strokeOpacity="0.25"
            strokeWidth="3"
          />
        </motion.g>
        <Sparkle x={260} y={140} delay={0.2} />
        <Sparkle x={70} y={300} delay={0.6} />
        <Sparkle x={310} y={310} delay={1.0} />
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
