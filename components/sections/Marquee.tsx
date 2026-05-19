"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const destinations = [
  "Tokyo",
  "Brooklyn",
  "London",
  "Sydney",
  "Toronto",
  "São Paulo",
  "Berlin",
  "Singapore",
  "Dubai",
  "Mexico City",
  "Seoul",
  "Reykjavík",
  "Bangkok",
  "Lisbon",
  "Cape Town",
  "Auckland",
];

export function Marquee() {
  const reduce = useReducedMotion();
  const items = [...destinations, ...destinations];

  return (
    <section
      aria-label="Destinations we ship to"
      className="relative border-y border-border bg-fg text-bg overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-fg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-fg to-transparent" />

      <div className="flex items-center gap-6 py-6 md:py-7">
        <motion.div
          className="flex shrink-0 items-center gap-10 whitespace-nowrap will-change-transform"
          animate={reduce ? undefined : { x: ["0%", "-50%"] }}
          transition={{ duration: 38, repeat: Infinity, ease: "linear" }}
        >
          {items.map((d, i) => (
            <span
              key={i}
              className="flex items-center gap-10 display text-3xl md:text-5xl"
            >
              <span className="inline-flex items-baseline gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.25em] text-bg/40">
                  Trento
                </span>
                <ArrowRight size={18} className="self-center text-accent" />
                <span>{d}</span>
              </span>
              <span className="text-bg/20" aria-hidden>
                ·
              </span>
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
