"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Reveal } from "../ui/Reveal";

type City = {
  name: string;
  country: string;
  lat: number;
  lon: number;
};

const ORIGIN: City = { name: "Trento", country: "IT", lat: 46.07, lon: 11.12 };

const DEST: City[] = [
  { name: "Brooklyn", country: "US", lat: 40.65, lon: -73.95 },
  { name: "São Paulo", country: "BR", lat: -23.55, lon: -46.63 },
  { name: "London", country: "UK", lat: 51.5, lon: -0.12 },
  { name: "Cape Town", country: "ZA", lat: -33.92, lon: 18.42 },
  { name: "Dubai", country: "AE", lat: 25.2, lon: 55.27 },
  { name: "Mumbai", country: "IN", lat: 19.08, lon: 72.88 },
  { name: "Tokyo", country: "JP", lat: 35.68, lon: 139.69 },
  { name: "Sydney", country: "AU", lat: -33.87, lon: 151.21 },
  { name: "Seoul", country: "KR", lat: 37.57, lon: 126.98 },
  { name: "Mexico City", country: "MX", lat: 19.43, lon: -99.13 },
];

const W = 1000;
const H = 500;

function project(c: { lat: number; lon: number }) {
  const x = ((c.lon + 180) / 360) * W;
  const y = ((90 - c.lat) / 180) * H;
  return { x, y };
}

function arcPath(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const lift = Math.min(180, dist * 0.45);
  const my = (a.y + b.y) / 2 - lift;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

function dots() {
  const out: { x: number; y: number; opacity: number }[] = [];
  const gx = 36;
  const gy = 22;
  // Quantize coordinates and opacity to 3 decimals so SSR-stringified values
  // round-trip exactly during client hydration (avoids float-precision drift).
  const q = (n: number) => Math.round(n * 1000) / 1000;
  for (let i = 0; i < gx; i++) {
    for (let j = 0; j < gy; j++) {
      const x = (i + 0.5) * (W / gx);
      const y = (j + 0.5) * (H / gy);
      const lat = 90 - (y / H) * 180;
      const inLandBand = lat > -56 && lat < 78;
      const noise =
        Math.sin(i * 1.7) * Math.cos(j * 0.9) + Math.cos(i * 0.4 + j * 0.3);
      const density = noise + (inLandBand ? 0.7 : -1.2);
      if (density > 0.1) {
        out.push({
          x: q(x),
          y: q(y),
          opacity: q(Math.min(0.55, Math.max(0.08, density * 0.35))),
        });
      }
    }
  }
  return out;
}

const DOTS = dots();

export function Reach() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const draw = useTransform(scrollYProgress, [0.1, 0.55], [0, 1]);

  const origin = project(ORIGIN);

  return (
    <section
      id="reach"
      ref={ref}
      className="relative overflow-hidden bg-[color:#0a0f17] text-[color:#fafaf7]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 30%, rgba(217,119,6,0.18), transparent 50%), radial-gradient(circle at 80% 70%, rgba(15,118,110,0.22), transparent 60%)",
        }}
      />

      <div className="container-x relative py-24 md:py-32">
        <Reveal>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/55">
            Reach
          </p>
        </Reveal>

        <div className="mt-5 grid items-end gap-10 md:grid-cols-[1fr_auto]">
          <Reveal>
            <h2 className="display text-4xl text-white md:text-6xl lg:text-7xl">
              From a single Italian
              <br />
              <span className="display-light text-white/55">
                address to every continent.
              </span>
            </h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="max-w-sm text-sm leading-relaxed text-white/60 md:text-base">
              We work with every major Italian carrier and broker. If a parcel
              can leave Italy, we'll get it there — from Brooklyn to Sydney,
              from Tokyo to Trento.
            </p>
          </Reveal>
        </div>

        <div className="relative mt-14 md:mt-20">
          <div className="absolute inset-0 -m-4 rounded-3xl border border-white/10" />
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="xMidYMid meet"
            className="relative w-full"
            role="img"
            aria-label="World map showing destinations from Trento, Italy"
          >
            {DOTS.map((d, i) => (
              <circle
                key={i}
                cx={d.x}
                cy={d.y}
                r={1.4}
                fill="#fafaf7"
                opacity={d.opacity}
              />
            ))}

            <line
              x1={0}
              x2={W}
              y1={H / 2}
              y2={H / 2}
              stroke="#fafaf7"
              strokeOpacity={0.06}
              strokeDasharray="2 6"
            />
            <line
              x1={W / 2}
              x2={W / 2}
              y1={0}
              y2={H}
              stroke="#fafaf7"
              strokeOpacity={0.06}
              strokeDasharray="2 6"
            />

            <defs>
              <linearGradient id="arc-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#d97706" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#0f766e" stopOpacity="0.55" />
              </linearGradient>
            </defs>

            {DEST.map((c, i) => {
              const p = project(c);
              return (
                <motion.path
                  key={c.name}
                  d={arcPath(origin, p)}
                  stroke="url(#arc-grad)"
                  strokeWidth={1.6}
                  fill="none"
                  strokeLinecap="round"
                  style={reduce ? undefined : { pathLength: draw }}
                  initial={reduce ? undefined : { pathLength: 0 }}
                  transition={{ duration: 0, delay: i * 0.02 }}
                />
              );
            })}

            {DEST.map((c) => {
              const p = project(c);
              return <PulsePin key={c.name} x={p.x} y={p.y} />;
            })}

            <g transform={`translate(${origin.x}, ${origin.y})`}>
              <motion.circle
                r={10}
                fill="#d97706"
                opacity={0.25}
                animate={
                  reduce ? undefined : { r: [10, 22, 10], opacity: [0.4, 0, 0.4] }
                }
                transition={{ duration: 2.4, repeat: Infinity }}
              />
              <circle r={5} fill="#d97706" />
              <circle r={2} fill="#fafaf7" />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}

function PulsePin({ x, y }: { x: number; y: number }) {
  const reduce = useReducedMotion();
  return (
    <g transform={`translate(${x}, ${y})`}>
      <motion.circle
        r={6}
        fill="#fafaf7"
        opacity={0.2}
        animate={reduce ? undefined : { r: [6, 14, 6], opacity: [0.3, 0, 0.3] }}
        transition={{
          duration: 2.6,
          repeat: Infinity,
          delay: Math.random() * 2,
        }}
      />
      <circle r={2.6} fill="#fafaf7" />
    </g>
  );
}
