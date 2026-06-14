"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Plus } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { cn } from "@/lib/cn";
import { FAQS } from "@/lib/faqs";
import { noWidows } from "@/lib/typography";

export function FAQ() {
  return (
    <section
      id="faq"
      className="relative py-24 md:py-32 bg-bg-elev/40 border-y border-border"
    >
      <div className="container-x">
        <SectionHeader
          eyebrow="FAQ"
          title={
            <>
              The questions you'd
              <br />
              <span className="display-light text-fg-muted">actually ask.</span>
            </>
          }
          description="Direct answers, drawn straight from our Terms & Conditions. The full text is on the /terms page."
        />

        <div className="mx-auto mt-14 max-w-3xl">
          <Reveal>
            <ul className="divide-y divide-border rounded-2xl border border-border bg-bg-elev">
              {FAQS.map((f, i) => (
                <FaqItem key={i} q={f.q} a={f.a} />
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <li>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 p-6 text-left transition hover:bg-fg/[0.02]"
      >
        <span className="text-base font-medium tracking-tight text-fg md:text-lg">
          {noWidows(q)}
        </span>
        <span
          className={cn(
            "grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border-strong text-fg transition",
            open && "rotate-45 bg-fg text-bg border-fg"
          )}
        >
          <Plus size={14} />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 whitespace-pre-line text-sm leading-relaxed text-fg-muted">
              {noWidows(a)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
