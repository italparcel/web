"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/cn";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "children"> & {
  label: ReactNode;
  id: string;
};

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox({ label, id, className, ...rest }, ref) {
    return (
      <label
        htmlFor={id}
        className={cn(
          "group flex items-start gap-3 cursor-pointer select-none",
          className
        )}
      >
        <span className="relative mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border border-border-strong bg-bg-elev transition group-hover:border-fg has-[:checked]:bg-fg has-[:checked]:border-fg">
          <input
            ref={ref}
            id={id}
            type="checkbox"
            className="peer absolute inset-0 cursor-pointer opacity-0"
            {...rest}
          />
          <Check
            aria-hidden
            className="h-3.5 w-3.5 text-bg opacity-0 transition peer-checked:opacity-100"
            strokeWidth={3}
          />
        </span>
        <span className="text-sm text-fg-muted leading-relaxed">{label}</span>
      </label>
    );
  }
);
