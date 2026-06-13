import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: Props) {
  return (
    <Reveal className={align === "center" ? "text-center" : "text-left"}>
      {eyebrow && (
        <p
          className={
            "mb-5 font-mono text-[11px] uppercase tracking-[0.22em] text-fg-subtle"
          }
        >
          {eyebrow}
        </p>
      )}
      <h2 className="display text-balance text-4xl text-fg md:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description && (
        <p
          className={
            "mt-5 max-w-2xl text-base leading-relaxed text-fg-muted md:text-lg " +
            (align === "center" ? "mx-auto" : "")
          }
        >
          {description}
        </p>
      )}
    </Reveal>
  );
}
