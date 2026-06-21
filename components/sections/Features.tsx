"use client";

import {
  Boxes,
  Camera,
  Lock,
  ScrollText,
  MessagesSquare,
  Sparkles,
} from "lucide-react";
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
                  We open and repackage every parcel.{" "}
                  <br className="md:hidden" />
                  If you are receiving multiple shipments, we can consolidate
                  multiple items into a single package and help you save
                  significantly on shipping costs.
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
                  your parcels.{" "}
                  <br className="md:hidden" />
                  Just send us the pickup codes, and we will handle the rest!
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
                  based on the information you provide.{" "}
                  <br className="md:hidden" />
                  We act as exporters.
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

function Parcel({
  x,
  y,
  w,
  h,
  fill,
  labelFill = "#fafaf7",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  fill: string;
  labelFill?: string;
}) {
  // shipping label, centred on the box
  const lw = w * 0.6;
  const lh = h * 0.62;
  const lx = x + (w - lw) / 2;
  const ly = y + h * 0.19;

  // barcode laid out as alternating bar/gap widths, scaled to the label
  const unit = lw / 26;
  const pattern = [2, 1, 1, 2, 1, 3, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1];
  const barY = ly + lh * 0.52;
  const barH = lh * 0.36;
  let bx = lx + lw * 0.14;
  const bars: React.ReactNode[] = [];
  pattern.forEach((p, i) => {
    if (i % 2 === 0) {
      bars.push(<rect key={i} x={bx} y={barY} width={p * unit} height={barH} />);
    }
    bx += p * unit;
  });

  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h * 0.16} fill={fill} />
      {/* packing tape */}
      <rect
        x={x}
        y={y + h * 0.45}
        width={w}
        height={h * 0.13}
        fill="#0b0f14"
        opacity={0.12}
      />
      {/* shipping label */}
      <rect x={lx} y={ly} width={lw} height={lh} rx={3} fill={labelFill} />
      <rect
        x={lx + lw * 0.14}
        y={ly + lh * 0.16}
        width={lw * 0.62}
        height={lh * 0.1}
        rx={1}
        fill="#0b0f14"
        opacity={0.5}
      />
      <rect
        x={lx + lw * 0.14}
        y={ly + lh * 0.31}
        width={lw * 0.42}
        height={lh * 0.1}
        rx={1}
        fill="#0b0f14"
        opacity={0.5}
      />
      <g fill="#0b0f14" opacity={0.8}>
        {bars}
      </g>
    </g>
  );
}

function CardArtRepack() {
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

        {/* incoming, individually labeled parcels */}
        <Parcel x={44} y={104} w={82} h={58} fill="#d97706" />
        <Parcel x={150} y={86} w={82} h={58} fill="#fafaf7" labelFill="#f3eee2" />
        <Parcel x={256} y={104} w={82} h={58} fill="#0f766e" />

        {/* converging arrows */}
        {[
          {
            d: "M 85 168 Q 182 212 183 250",
            head: "M 177 244 L 183 252 L 189 244",
          },
          {
            d: "M 191 150 L 200 250",
            head: "M 194 244 L 200 252 L 206 244",
          },
          {
            d: "M 297 168 Q 218 212 217 250",
            head: "M 211 244 L 217 252 L 223 244",
          },
        ].map((a, i) => (
          <g key={i}>
            <path
              d={a.d}
              stroke="#fafaf7"
              strokeOpacity="0.8"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={a.head}
              stroke="#fafaf7"
              strokeOpacity="0.8"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        ))}

        {/* one consolidated, labeled parcel */}
        <Parcel x={116} y={258} w={168} h={116} fill="#d97706" />

        <Sparkle x={356} y={150} />
        <Sparkle x={66} y={252} />
      </svg>
    </div>
  );
}

function Sparkle({ x, y }: { x: number; y: number }) {
  return (
    <path
      d={`M ${x} ${y - 8} L ${x + 2} ${y - 2} L ${x + 8} ${y} L ${x + 2} ${y + 2} L ${x} ${y + 8} L ${x - 2} ${y + 2} L ${x - 8} ${y} L ${x - 2} ${y - 2} Z`}
      fill="#fafaf7"
      opacity="0.7"
    />
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
