"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

type TocItem = { id: string; label: string };

type Props = {
  title: string;
  updated: string;
  toc: TocItem[];
  children: ReactNode;
};

export function LegalLayout({ title, updated, toc, children }: Props) {
  return (
    <div className="container-x py-24 md:py-32">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg"
      >
        <ChevronLeft size={14} />
        Back to home
      </Link>

      <header className="mt-6 max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
          {updated}
        </p>
        <h1 className="display mt-3 text-4xl md:text-6xl">{title}</h1>
      </header>

      <div className="mt-12 grid gap-12 lg:grid-cols-[14rem_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <nav
            aria-label="Table of contents"
            className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2"
          >
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
              Contents
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
