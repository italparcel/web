"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { noWidows } from "@/lib/typography";

type TocItem = { id: string; label: string };

export type LegalLang = "en" | "it";

type Props = {
  title: string;
  updated: string;
  toc: TocItem[];
  lang?: LegalLang;
  onLangChange?: (lang: LegalLang) => void;
  children: ReactNode;
};

export function LegalLayout({
  title,
  updated,
  toc,
  lang = "en",
  onLangChange,
  children,
}: Props) {
  return (
    <div className="container-x py-24 md:py-32">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg"
        >
          <ChevronLeft size={14} />
          {lang === "it" ? "Torna alla home" : "Back to home"}
        </Link>
        {onLangChange && (
          <div
            role="group"
            aria-label="Language"
            className="inline-flex rounded-full border border-border-strong bg-bg-elev p-0.5 font-mono text-[11px] uppercase tracking-[0.12em]"
          >
            {(["en", "it"] as const).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={lang === l}
                onClick={() => onLangChange(l)}
                className={cn(
                  "rounded-full px-3 py-1 transition",
                  lang === l
                    ? "bg-fg text-bg"
                    : "text-fg-muted hover:text-fg"
                )}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>

      <header className="mt-6 max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
          {updated}
        </p>
        <h1 className="display mt-3 text-4xl md:text-6xl">{title}</h1>
      </header>

      <div
        className={cn(
          "mt-12 grid gap-12",
          toc.length > 0 && "lg:grid-cols-[14rem_minmax(0,1fr)]"
        )}
      >
        {toc.length > 0 && (
          <aside className="hidden lg:block">
            <nav
              aria-label="Table of contents"
              className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2"
            >
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
                {lang === "it" ? "Indice" : "Contents"}
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`} className="text-fg-muted hover:text-fg">
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}

        <article className="max-w-3xl text-fg">{children}</article>
      </div>
    </div>
  );
}

export function Section({
  id,
  number,
  title,
  children,
}: {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-12 scroll-mt-24 first:mt-0">
      <h2 className="display text-2xl tracking-tight md:text-3xl">
        <span className="text-fg-subtle">{number}.</span> {title}
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-fg-muted md:text-base">
        {children}
      </div>
    </section>
  );
}

export function Sub({
  id,
  number,
  title,
  children,
}: {
  id?: string;
  number: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div id={id} className="mt-6 scroll-mt-24">
      <h3 className="text-base font-semibold text-fg md:text-lg">
        {number} {title}
      </h3>
      <div className="mt-2 space-y-3">{children}</div>
    </div>
  );
}

/**
 * Renders a plain string with lightweight markup: **bold** and
 * [label](href) links. Enough for legal copy without resorting to JSX
 * for every bilingual paragraph.
 */
export function Rich({ text }: { text: string }) {
  // Tidy widows + sentence starts before tokenizing. NBSP only replaces spaces,
  // so the `**bold**` / `[label](href)` delimiters are untouched and still parse.
  const parts = noWidows(text).split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);
  return (
    <p>
      {parts.map((part, i) => {
        const bold = part.match(/^\*\*([^*]+)\*\*$/);
        if (bold) return <strong key={i}>{bold[1]}</strong>;
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link)
          return (
            <Link
              key={i}
              href={link[2]}
              className="underline underline-offset-2 hover:text-accent"
            >
              {link[1]}
            </Link>
          );
        return part;
      })}
    </p>
  );
}
