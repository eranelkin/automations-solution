import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  surface?: boolean;
  containerClassName?: string;
}

export function Section({
  className,
  containerClassName,
  surface,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        "py-16 md:py-24 lg:py-32",
        surface && "bg-[var(--surface)]",
        className,
      )}
      {...props}
    >
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto mb-12 md:mb-16",
        align === "center" ? "max-w-2xl text-center" : "max-w-2xl text-start",
        className,
      )}
    >
      {eyebrow && (
        <p className="mb-3 text-sm font-semibold tracking-wide text-[var(--accent)]">
          {eyebrow}
        </p>
      )}
      <h2
        className="text-h2 font-semibold leading-tight tracking-[-0.01em] text-[var(--text-primary)]"
      >
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg leading-relaxed text-[var(--text-secondary)]">
          {subtitle}
        </p>
      )}
    </div>
  );
}
