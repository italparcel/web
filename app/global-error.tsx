"use client";

import { useEffect } from "react";

// Last-resort boundary: replaces the ROOT layout when it throws, so it must
// render its own <html>/<body>. Kept dependency-free (inline styles, no app
// components) — if the root layout failed, Tailwind and the design system
// may not be available either.
export default function GlobalError({
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
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, -apple-system, sans-serif",
          background: "#faf9f6",
          color: "#0b0f14",
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          margin: 0,
          padding: "2rem",
          textAlign: "center",
        }}
      >
        <div>
          <h1 style={{ fontSize: "1.5rem", margin: "0 0 0.75rem" }}>
            An unexpected error occurred.
          </h1>
          <p style={{ color: "#4b5563", margin: "0 0 1.5rem" }}>
            Sorry — something broke on our end. You can try again, or reload
            the page.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            style={{
              borderRadius: "9999px",
              background: "#0b0f14",
              color: "#faf9f6",
              padding: "0.75rem 1.75rem",
              fontSize: "1rem",
              border: 0,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
