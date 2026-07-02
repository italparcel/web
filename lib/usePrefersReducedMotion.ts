"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;

// The server snapshot is `false`, so the SSR HTML and the hydration render
// always agree; clients that prefer reduced motion re-render right after
// hydration instead of failing hydration. Use this — not framer-motion's
// useReducedMotion, which returns null on the server and the real value on
// the first client render — whenever the flag picks between DIFFERENT
// component trees or text content.
const getServerSnapshot = () => false;

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
