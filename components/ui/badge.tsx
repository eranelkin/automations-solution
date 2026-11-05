import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  pulse,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { pulse?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 text-sm font-medium text-[var(--text-secondary)]",
        className,
      )}
      {...props}
    >
      {pulse && (
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60 motion-reduce:animate-none" />
          <span className="relative inline-flex size-2 rounded-full bg-[var(--accent)]" />
        </span>
      )}
      {children}
    </span>
  );
}
