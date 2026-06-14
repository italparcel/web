"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Fragment, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { SectionHeader } from "../ui/SectionHeader";
import { Reveal } from "../ui/Reveal";
import { cn } from "@/lib/cn";
import { FAQS } from "@/lib/faqs";

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
                <FaqItem
                  key={i}
                  q={f.q}
                  a={f.a}
                  mobileBreaks={f.mobileBreaks}
                  breaks={f.breaks}
                  links={f.links}
                />
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// Renders a plain answer string with enhancements that never touch the source
// string (kept clean for structured data): a line break before each phrase —
// mobile-only for `mobileBreaks`, every viewport for `breaks` — and an inline
// link for each `links` phrase.
function AnswerBody({
  text,
  mobileBreaks,
  breaks,
  links,
}: {
  text: string;
  mobileBreaks?: string[];
  breaks?: string[];
  links?: { text: string; href: string }[];
}) {
  if (!mobileBreaks?.length && !breaks?.length && !links?.length)
    return <>{text}</>;

  // Resolve every break phrase to its position, order them, then split the text
  // inserting a <br> before each (mobile-only or all-viewport).
  const markers = [
    ...(breaks ?? []).map((phrase) => ({ phrase, mobileOnly: false })),
    ...(mobileBreaks ?? []).map((phrase) => ({ phrase, mobileOnly: true })),
  ]
    .map((m) => ({ ...m, idx: text.indexOf(m.phrase) }))
    .filter((m) => m.idx > 0)
    .sort((a, b) => a.idx - b.idx);

  const segments: React.ReactNode[] = [];
  let cursor = 0;
  markers.forEach((m, i) => {
    segments.push(text.slice(cursor, m.idx));
    segments.push(
      m.mobileOnly ? (
        <br key={`mb-${i}`} className="md:hidden" />
      ) : (
        <br key={`br-${i}`} />
      )
    );
    cursor = m.idx;
  });
  segments.push(text.slice(cursor));

  if (!links?.length) return <>{segments}</>;

  // Turn configured phrases into links within each text segment.
  return (
    <>
      {segments.map((seg, i) =>
        typeof seg === "string" ? (
          <Fragment key={`seg-${i}`}>{linkify(seg, links)}</Fragment>
        ) : (
          seg
        )
      )}
    </>
  );
}

function linkify(
  text: string,
  links: { text: string; href: string }[]
): React.ReactNode[] {
  let nodes: React.ReactNode[] = [text];
  links.forEach((link, li) => {
    const next: React.ReactNode[] = [];
    nodes.forEach((node, ni) => {
      if (typeof node !== "string") {
        next.push(node);
        return;
      }
      const idx = node.indexOf(link.text);
      if (idx === -1) {
        next.push(node);
        return;
      }
      if (idx > 0) next.push(node.slice(0, idx));
      next.push(
        <Link
          key={`lnk-${li}-${ni}`}
          href={link.href}
          className="font-medium text-fg underline underline-offset-2 hover:text-accent"
        >
          {link.text}
        </Link>
      );
      const after = node.slice(idx + link.text.length);
      if (after) next.push(after);
    });
    nodes = next;
  });
  return nodes;
}

function FaqItem({
  q,
  a,
  mobileBreaks,
  breaks,
  links,
}: {
  q: string;
  a: string;
  mobileBreaks?: string[];
  breaks?: string[];
  links?: { text: string; href: string }[];
}) {
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
          {q}
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
              <AnswerBody
                text={a}
                mobileBreaks={mobileBreaks}
                breaks={breaks}
                links={links}
              />
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}
