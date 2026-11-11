"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotionConfig } from "motion/react";
import { Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export function ExampleCard({
  icon: Icon,
  title,
  problem,
  steps,
  stepsLabel,
}: {
  icon: LucideIcon;
  title: string;
  problem: string;
  steps: string[];
  stepsLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const popoverId = useId();
  const reduce = useReducedMotionConfig();

  // A short grace period lets the pointer travel from the icon into the
  // popover without it closing in between.
  const show = () => {
    clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hide = () => {
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  };
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  return (
    <div
      className={`group relative flex h-full flex-col gap-4 rounded-2xl border bg-[var(--card)] p-6 transition-[border-color,box-shadow,translate] duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/40 hover:shadow-[0_16px_40px_-20px_var(--accent)] ${
        open ? "z-30 border-[var(--accent)]/40" : "border-[var(--border)]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-2)]/15 text-[var(--accent)] ring-1 ring-[var(--accent)]/20">
          <Icon className="size-5.5" aria-hidden="true" />
        </span>

        {/* Not `relative`: the popover is positioned against the card so it
            spans the card's width instead of hanging off the icon. */}
        <div
          onPointerEnter={(e) => e.pointerType === "mouse" && show()}
          onPointerLeave={(e) => e.pointerType === "mouse" && hide()}
          onFocus={show}
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node)) hide();
          }}
          onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
        >
          <button
            type="button"
            aria-label={stepsLabel}
            aria-expanded={open}
            aria-controls={popoverId}
            onClick={() => setOpen((v) => !v)}
            className={`flex size-9 items-center justify-center rounded-full border transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)] focus-visible:outline-none ${
              open
                ? "border-[var(--accent)] bg-[var(--accent)] text-[var(--accent-foreground)]"
                : "border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50 hover:text-[var(--accent)]"
            }`}
          >
            <Info className="size-4.5" aria-hidden="true" />
          </button>

          <AnimatePresence>
            {open && (
              <motion.div
                id={popoverId}
                role="region"
                aria-label={stepsLabel}
                initial={{ opacity: 0, y: -6, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.97 }}
                transition={reduce ? { duration: 0 } : { duration: 0.22, ease }}
                className="absolute inset-x-3 top-[4.75rem] z-40 origin-top overflow-hidden rounded-2xl border border-[var(--accent)]/30 bg-[var(--card)] p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-md"
              >
                {/* Accent glow along the top edge. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-[var(--accent)] to-transparent"
                />
                <p className="mb-4 text-xs font-semibold tracking-wide text-[var(--accent)]">
                  {stepsLabel}
                </p>
                <ol className="relative flex flex-col gap-3">
                  {/* Stepper rail behind the numbered dots. */}
                  <span
                    aria-hidden="true"
                    className="absolute start-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-[var(--accent)]/60 to-[var(--accent-2)]/30"
                  />
                  {steps.map((step, i) => (
                    <motion.li
                      key={step}
                      initial={reduce ? false : { opacity: 0, x: 6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.25, delay: reduce ? 0 : 0.04 * i, ease }}
                      className="relative flex items-center gap-3 text-sm text-[var(--text-primary)]"
                    >
                      <span className="relative flex size-6 shrink-0 items-center justify-center rounded-full border border-[var(--accent)]/50 bg-[var(--card)] text-[11px] font-semibold tabular-nums text-[var(--accent)]">
                        {i + 1}
                      </span>
                      {step}
                    </motion.li>
                  ))}
                </ol>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
          {problem}
        </p>
      </div>
    </div>
  );
}
