"use client";

import { motion, useReducedMotionConfig } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { HERO_FLOW_STAGGER } from "./hero-flow.config";

export function staggerDelay(i: number) {
  return (HERO_FLOW_STAGGER * i) / 1000;
}

/**
 * Entrance animation for step content. When reduced motion is active (OS
 * preference or the in-app "stop animations" toggle, via MotionConfig
 * reducedMotion="always"), the delay collapses to 0 so static-mode content
 * appears immediately instead of staggering in on a timer — a timed reveal
 * is itself a form of automatic motion the reduced-motion fallback must not have.
 */
/** Non-hook variant for use inside a .map() loop — pass a `reduce` flag read once via useStepEnter/useReducedMotionConfig at the top of the component. */
export function stepEnterProps(delay: number, reduce: boolean) {
  return {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: reduce
      ? { duration: 0.01, delay: 0 }
      : { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] as const },
  };
}

export function useStepEnter(delay = 0) {
  const reduce = useReducedMotionConfig();
  return stepEnterProps(delay, Boolean(reduce));
}

/**
 * Real WhatsApp bubble colors (not the site's brand palette — this chrome is
 * meant to read as WhatsApp's own UI). Defined as CSS variables in
 * globals.css (`--whatsapp-bubble`/`--whatsapp-bubble-text`) rather than
 * Tailwind `dark:` classes: this app's dark mode is the `.dark` class
 * swapping custom-property values, not Tailwind's `prefers-color-scheme`
 * variant, so `dark:bg-[...]` here would follow the OS theme instead of the
 * in-app toggle.
 */
const WHATSAPP_BUBBLE_BG = "bg-[var(--whatsapp-bubble)]";
const WHATSAPP_BUBBLE_TEXT = "text-[var(--whatsapp-bubble-text)]";

export function WhatsAppBubble({
  children,
  align = "start",
  delay = 0,
  sender,
}: {
  children: ReactNode;
  align?: "start" | "end";
  delay?: number;
  sender?: string;
}) {
  return (
    <motion.div
      {...useStepEnter(delay)}
      className={cn(
        "flex max-w-[85%] flex-col gap-1",
        align === "end" ? "ms-auto items-end" : "items-start",
      )}
    >
      {sender && (
        <span className="px-1 text-xs font-medium text-[var(--text-secondary)]">
          {sender}
        </span>
      )}
      <div
        className={cn(
          "relative rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          WHATSAPP_BUBBLE_BG,
          WHATSAPP_BUBBLE_TEXT,
          // The tail sits at the block-end (bottom) corner, so the sharp
          // corner has to be "ee" (end-end) / "es" (end-start) — not "ss",
          // which is the top corner and would leave the tail floating next
          // to a fully-rounded corner.
          align === "end" ? "rounded-ee-sm" : "rounded-es-sm",
        )}
      >
        {children}
        {/* The little tail triangle real chat bubbles have at the corner
            closest to the sender. Built from a single clip-path pointing
            toward the inline-start edge, then mirrored for the "end"
            variant and for RTL via `rtl:-scale-x-100` — same flip pattern
            used on the approval-step cursor icon. */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute bottom-0 size-2.5",
            WHATSAPP_BUBBLE_BG,
            align === "end"
              ? "end-[-6px] [clip-path:polygon(100%_0,0_100%,100%_100%)] rtl:-scale-x-100"
              : "start-[-6px] [clip-path:polygon(0_0,100%_100%,0_100%)] rtl:-scale-x-100",
          )}
        />
      </div>
    </motion.div>
  );
}

export function TypingDots() {
  const reduce = useReducedMotionConfig();
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-1.5 rounded-full bg-[var(--text-secondary)]"
          animate={reduce ? { opacity: 0.7 } : { opacity: [0.3, 1, 0.3] }}
          transition={reduce ? { duration: 0 } : { duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </span>
  );
}

export function FieldRow({
  label,
  value,
  delay = 0,
}: {
  label: string;
  value: string;
  delay?: number;
}) {
  return (
    <motion.div
      {...useStepEnter(delay)}
      className="flex items-center justify-between gap-4 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5"
    >
      <span className="text-xs font-medium text-[var(--text-secondary)]">
        {label}
      </span>
      <span className="truncate text-sm font-medium tabular-nums text-[var(--text-primary)]">
        {value}
      </span>
    </motion.div>
  );
}

export function CheckItem({
  label,
  delay = 0,
}: {
  label: string;
  delay?: number;
}) {
  const reduce = useReducedMotionConfig();
  const swapDelay = reduce ? 0 : delay + 0.5;
  const swapDuration = reduce ? 0.01 : 0.2;

  return (
    <motion.div
      {...useStepEnter(delay)}
      className="flex items-center gap-3 rounded-lg px-1 py-1.5"
    >
      <span className="relative flex size-5 shrink-0 items-center justify-center">
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: swapDelay, duration: swapDuration }}
        >
          <Loader2 className="size-4 animate-spin text-[var(--text-secondary)]" />
        </motion.span>
        <motion.span
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: swapDelay + 0.05, duration: swapDuration }}
        >
          <Check className="size-4 text-[var(--success)]" strokeWidth={3} />
        </motion.span>
      </span>
      <span className="text-sm text-[var(--text-primary)]">{label}</span>
    </motion.div>
  );
}

export function SystemCard({
  name,
  delay = 0,
  rowCreated,
}: {
  name: string;
  delay?: number;
  rowCreated: string;
}) {
  const reduce = useReducedMotionConfig();
  const rowDelay = reduce ? 0 : delay + 0.6;
  const rowDuration = reduce ? 0.01 : 0.3;

  return (
    <motion.div
      {...useStepEnter(delay)}
      className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] p-4"
    >
      <p className="text-xs font-semibold text-[var(--text-secondary)]">{name}</p>
      <motion.div
        initial={{ opacity: 0, scaleY: 0.6 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ delay: rowDelay, duration: rowDuration }}
        className="mt-2.5 rounded-md border border-dashed border-[var(--success)]/40 bg-[var(--success)]/10 px-2.5 py-2 text-xs font-medium text-[var(--success)]"
      >
        + {rowCreated}
      </motion.div>
    </motion.div>
  );
}
