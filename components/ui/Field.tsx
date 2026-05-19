"use client";

import type { ReactNode, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

// 16px font-size on small screens prevents iOS Safari from auto-zooming on focus.
const baseField =
  "w-full rounded-xl border border-border-strong bg-bg-elev px-4 py-3 text-base md:text-sm text-fg placeholder:text-fg-subtle outline-none transition focus:border-fg focus:ring-2 focus:ring-fg/10 disabled:opacity-60";

export function FieldLabel({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-fg">
      {children}
      {required && <span className="text-accent ml-0.5">*</span>}
    </label>
  );
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs text-red-600">
      {children}
    </p>
  );
}

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, ...rest },
  ref
) {
  return <input ref={ref} className={cn(baseField, className)} {...rest} />;
});

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { className, children, ...rest },
  ref
) {
  return (
    <select
      ref={ref}
      className={cn(
        baseField,
        "appearance-none bg-[image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 viewBox=%220 0 12 12%22><path d=%22M2 4l4 4 4-4%22 stroke=%22%230b0f14%22 stroke-width=%221.5%22 fill=%22none%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22/></svg>')] bg-no-repeat bg-[right_1rem_center] pr-10",
        className
      )}
      {...rest}
    >
      {children}
    </select>
  );
});

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  function Textarea({ className, ...rest }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(baseField, "resize-y min-h-[7rem]", className)}
        {...rest}
      />
    );
  }
);
