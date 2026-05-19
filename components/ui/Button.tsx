"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

type ButtonProps = HTMLMotionProps<"button"> & {
  variant?: Variant;
  size?: Size;
  magnetic?: boolean;
};

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-fg text-bg hover:bg-[color:var(--fg)]/90 shadow-[var(--shadow-soft)]",
  secondary:
    "bg-bg-elev text-fg border border-border-strong hover:border-fg hover:-translate-y-px",
  ghost: "text-fg hover:bg-fg/5",
};

const sizeClasses: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  magnetic = false,
  className,
  children,
  onMouseMove,
  onMouseLeave,
  ...rest
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (magnetic && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);
      ref.current.style.transform = `translate(${x * 0.15}px, ${y * 0.2}px)`;
    }
    onMouseMove?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (magnetic && ref.current) {
      ref.current.style.transform = "";
    }
    onMouseLeave?.(e);
  };

  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors transition-transform will-change-transform disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
