import type { Metadata } from "next";
import Link from "next/link";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="container-x flex min-h-[60vh] flex-col items-center justify-center py-24 text-center md:py-32">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle">
            Error 404
          </p>
          <h1 className="display mt-4 text-balance text-5xl text-fg md:text-7xl">
            Page not found.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-fg-muted">
            The page you&apos;re looking for doesn&apos;t exist or may have
            moved.
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-fg px-7 py-3.5 text-base font-medium text-bg shadow-[var(--shadow-soft)] transition-colors hover:bg-[color:var(--fg)]/90"
          >
            Back to home
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
