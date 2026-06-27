"use client";

import {
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronDown, Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/cn";

type Props = {
  options: string[];
  value?: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  id?: string;
  name?: string;
  "aria-invalid"?: boolean;
  className?: string;
};

export const Combobox = forwardRef<HTMLInputElement, Props>(function Combobox(
  {
    options,
    value = "",
    onChange,
    onBlur,
    placeholder = "Type to search…",
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
  const [highlight, setHighlight] = useState(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Keep query in sync with external value changes (e.g. form reset)
  useEffect(() => {
    setQuery(value);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options.slice(0, 200);
    const starts: string[] = [];
    const contains: string[] = [];
    for (const o of options) {
      const lo = o.toLowerCase();
      if (lo.startsWith(q)) starts.push(o);
      else if (lo.includes(q)) contains.push(o);
    }
    return [...starts, ...contains].slice(0, 200);
  }, [query, options]);

  useEffect(() => {
    setHighlight(0);
  }, [query]);

  const handleSelect = (v: string) => {
    setQuery(v);
    onChange(v);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(filtered.length - 1, h + 1));
      scrollHighlightIntoView(listRef, highlight + 1);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(0, h - 1));
      scrollHighlightIntoView(listRef, highlight - 1);
    } else if (e.key === "Enter") {
      if (open && filtered[highlight]) {
        e.preventDefault();
        handleSelect(filtered[highlight]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  const clear = () => {
    setQuery("");
    onChange("");
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
            open && filtered.length > 0 ? `${listId}-opt-${highlight}` : undefined
          }
          autoComplete="off"
          spellCheck={false}
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => onBlur?.()}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full rounded-xl border border-border-strong bg-bg-elev py-3 pl-10 pr-10 text-base md:text-sm text-fg",
            "placeholder:text-fg-subtle outline-none transition focus:border-fg focus:ring-2 focus:ring-fg/10",
            "aria-[invalid=true]:border-red-300 aria-[invalid=true]:focus:ring-red-200"
          )}
          {...rest}
        />
        {query ? (
          <button
            type="button"
            aria-label="Clear"
            onClick={clear}
            className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded text-fg-subtle hover:bg-fg/5 hover:text-fg"
          >
            <X size={13} strokeWidth={2} />
          </button>
        ) : (
          <ChevronDown
            size={14}
            strokeWidth={1.75}
            className={cn(
              "pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-fg-subtle transition",
              open && "rotate-180"
            )}
          />
        )}
      </div>

      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.ul
            id={listId}
            role="listbox"
            ref={listRef}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute z-30 mt-1.5 max-h-64 w-full overflow-y-auto rounded-xl border border-border bg-bg-elev shadow-[var(--shadow-lift)]"
          >
            {filtered.map((c, i) => (
              <li
                key={c}
                role="option"
                id={`${listId}-opt-${i}`}
                aria-selected={i === highlight}
                data-idx={i}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setHighlight(i)}
                onClick={() => handleSelect(c)}
                className={cn(
                  "cursor-pointer px-4 py-2 text-sm transition",
                  i === highlight
                    ? "bg-fg text-bg"
                    : "text-fg hover:bg-fg/5"
                )}
              >
                <HighlightMatch text={c} query={query} />
              </li>
            ))}
          </motion.ul>
        )}
        {open && filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="absolute z-30 mt-1.5 w-full rounded-xl border border-border bg-bg-elev px-4 py-6 text-center text-sm text-fg-subtle"
          >
            No matches for “{query}”.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

function HighlightMatch({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if (i === -1) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="font-medium">{text.slice(i, i + q.length)}</span>
      {text.slice(i + q.length)}
    </>
  );
}

function scrollHighlightIntoView(
  ref: React.RefObject<HTMLUListElement | null>,
  index: number
) {
  const el = ref.current?.querySelector<HTMLLIElement>(`[data-idx="${index}"]`);
  el?.scrollIntoView({ block: "nearest" });
}
