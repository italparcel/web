"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center md:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
            Something went wrong
          </p>
          <h1 className="display mt-4 text-balance text-5xl text-fg md:text-7xl">
            An unexpected error occurred.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-fg-muted">
            Sorry — something broke on our end. You can try again, or head back
            to the home page.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-fg px-7 py-3.5 text-base font-medium text-bg shadow-[var(--shadow-soft)] transition-colors hover:bg-[color:var(--fg)]/90"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border-strong bg-bg-elev px-7 py-3.5 text-base font-medium text-fg transition-colors hover:border-fg"
            >
              Back to home
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
