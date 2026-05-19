"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function Statement() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const x = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0.2, 1, 1, 0.2]
  );

  return (
    <section
      ref={ref}
      aria-label="Statement"
      className="relative isolate overflow-hidden py-32 md:py-48"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(11,15,20,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(11,15,20,0.07) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <motion.div
        style={reduce ? undefined : { x, opacity }}
        className="container-x relative"
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
          Promise
        </p>
        <h2 className="display mt-6 text-[clamp(2.5rem,8.5vw,7rem)] text-fg">
          Real people.{" "}
          <span className="display-light text-fg-muted">Real parcels.</span>
          <br />
          One Italian{" "}
          <span className="text-accent">address.</span>
        </h2>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          <Item
            kicker="01 — Documented"
            body="Every parcel is opened, photographed on request, and logged before we forward it. You see what we see."
          />
          <Item
            kicker="02 — Itemized"
            body="Our handling fee and the carrier's shipping cost are quoted separately. No bundled surprises."
          />
          <Item
            kicker="03 — On record"
            body="Your acceptance is timestamped. Your communications are saved. If anyone asks, we have the paper trail."
          />
        </div>
      </motion.div>
    </section>
  );
}

function Item({ kicker, body }: { kicker: string; body: string }) {
  return (
    <div className="border-t border-border pt-5">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
        {kicker}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-fg-muted md:text-base">
        {body}
      </p>
    </div>
  );
}
