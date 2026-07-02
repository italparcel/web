"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { Search, X, Loader2, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

type Props = {
  value?: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  id?: string;
  name?: string;
  "aria-invalid"?: boolean;
  className?: string;
};

type Feature = {
  properties: {
    name?: string;
    street?: string;
    housenumber?: string;
    postcode?: string;
    city?: string;
    state?: string;
    country?: string;
    type?: string;
    osm_value?: string;
  };
};

function formatFeature(f: Feature): string {
  const p = f.properties;
  const street = [p.housenumber, p.street].filter(Boolean).join(" ");
  const local = [p.postcode, p.city].filter(Boolean).join(" ");
  const parts = [
    street || p.name,
    local,
    p.state && p.state !== p.city ? p.state : null,
    p.country,
  ].filter(Boolean) as string[];
  return parts.join(", ");
}

function secondaryFeature(f: Feature): string {
  const p = f.properties;
  return [p.country, p.state].filter(Boolean).join(" · ");
}

export const AddressCombobox = forwardRef<HTMLInputElement, Props>(
  function AddressCombobox(
    {
      value = "",
      onChange,
      onBlur,
      placeholder,
      id,
      name,
      className,
      ...rest
    },
    ref
  ) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const listId = `${inputId}-list`;

    const [query, setQuery] = useState(value);
    const [open, setOpen] = useState(false);
    const [results, setResults] = useState<Feature[]>([]);
    const [loading, setLoading] = useState(false);
    const [highlight, setHighlight] = useState(0);

    const rootRef = useRef<HTMLDivElement>(null);
    const abortRef = useRef<AbortController | null>(null);

    useEffect(() => {
      setQuery(value);
    }, [value]);

    // Outside click → close
    useEffect(() => {
      const onDoc = (e: MouseEvent) => {
        if (!rootRef.current?.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", onDoc);
      return () => document.removeEventListener("mousedown", onDoc);
    }, []);

    // Debounced fetch (Photon — keyless OSM geocoder by Komoot)
    useEffect(() => {
      const q = query.trim();
      if (q.length < 3) {
        setResults([]);
        setLoading(false);
        return;
      }

      const ctrl = new AbortController();
      abortRef.current = ctrl;

      setLoading(true);
      const t = setTimeout(async () => {
        try {
          const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(
            q
          )}&limit=6&lang=en`;
          const res = await fetch(url, { signal: ctrl.signal });
          if (!res.ok) throw new Error("photon-error");
          const json: { features?: Feature[] } = await res.json();
          if (abortRef.current === ctrl) setResults(json.features ?? []);
        } catch (e) {
          if ((e as Error).name !== "AbortError" && abortRef.current === ctrl) {
            setResults([]);
          }
        } finally {
          // Only the latest request may clear the spinner — an aborted fetch
          // settling late must not hide its successor's loading state.
          if (abortRef.current === ctrl) setLoading(false);
        }
      }, 320);

      return () => {
        clearTimeout(t);
        // Aborts the in-flight request when the query changes AND on unmount
        // (the old effect-start abort never covered unmount).
        ctrl.abort();
      };
    }, [query]);

    useEffect(() => {
      setHighlight(0);
    }, [results]);

    const handleSelect = (f: Feature) => {
      const formatted = formatFeature(f);
      setQuery(formatted);
      onChange(formatted);
      setOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        setHighlight((h) => Math.min(results.length - 1, h + 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlight((h) => Math.max(0, h - 1));
      } else if (e.key === "Enter") {
        if (open && results[highlight]) {
          e.preventDefault();
          handleSelect(results[highlight]);
        }
      } else if (e.key === "Escape" || e.key === "Tab") {
        setOpen(false);
      }
    };

    const clear = () => {
      setQuery("");
      onChange("");
      setResults([]);
      setOpen(true);
    };

    return (
      <div ref={rootRef} className={cn("relative", className)}>
        <div className="relative">
          <Search
            size={14}
            strokeWidth={1.75}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-subtle"
          />
          <input
            ref={ref}
            id={inputId}
            name={name}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-expanded={open}
            aria-controls={listId}
            aria-activedescendant={
              open && results.length > 0 ? `${listId}-opt-${highlight}` : undefined
            }
            autoComplete="off"
            spellCheck={false}
            value={query}
            placeholder={placeholder ?? "Street, city, country…"}
            onChange={(e) => {
              setQuery(e.target.value);
              onChange(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={onBlur}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full rounded-xl border border-border-strong bg-bg-elev py-3 pl-10 pr-10 text-base md:text-sm text-fg",
              "placeholder:text-fg-subtle outline-none transition focus:border-fg focus:ring-2 focus:ring-fg/10",
              "aria-[invalid=true]:border-red-300 aria-[invalid=true]:focus:ring-red-200"
            )}
            {...rest}
          />
          {loading ? (
            <Loader2
              size={14}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-fg-subtle"
            />
          ) : query ? (
            <button
              type="button"
              aria-label="Clear"
              onClick={clear}
              className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded text-fg-subtle hover:bg-fg/5 hover:text-fg"
            >
              <X size={13} strokeWidth={2} />
            </button>
          ) : null}
        </div>

        <AnimatePresence>
          {open && results.length > 0 && (
            <motion.ul
              id={listId}
              role="listbox"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.12 }}
              className="absolute z-30 mt-1.5 w-full overflow-hidden rounded-xl border border-border bg-bg-elev shadow-[var(--shadow-lift)]"
            >
              {results.map((f, i) => {
                const text = formatFeature(f);
                const sub = secondaryFeature(f);
                return (
                  <li
                    key={`${text}-${i}`}
                    role="option"
                    id={`${listId}-opt-${i}`}
                    aria-selected={i === highlight}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => setHighlight(i)}
                    onClick={() => handleSelect(f)}
                    className={cn(
                      "flex cursor-pointer items-start gap-2.5 px-4 py-2.5 text-sm transition",
                      i === highlight
                        ? "bg-fg text-bg"
                        : "text-fg hover:bg-fg/5"
                    )}
                  >
                    <MapPin
                      size={13}
                      strokeWidth={1.75}
                      className={cn(
                        "mt-1 shrink-0",
                        i === highlight ? "text-bg/70" : "text-fg-subtle"
                      )}
                    />
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate">{text}</span>
                      {sub && (
                        <span
                          className={cn(
                            "truncate text-[11px]",
                            i === highlight ? "text-bg/60" : "text-fg-subtle"
                          )}
                        >
                          {sub}
                        </span>
                      )}
                    </span>
                  </li>
                );
              })}
              <li className="border-t border-border px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-fg-subtle">
                Powered by OpenStreetMap · Photon
              </li>
            </motion.ul>
          )}
          {open &&
            !loading &&
            query.trim().length >= 3 &&
            results.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.12 }}
                className="absolute z-30 mt-1.5 w-full rounded-xl border border-border bg-bg-elev px-4 py-5 text-center text-sm text-fg-subtle"
              >
                No matches. You can type the address manually.
              </motion.div>
            )}
        </AnimatePresence>
      </div>
    );
  }
);
