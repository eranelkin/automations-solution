"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { MousePointer2, ShieldCheck } from "lucide-react";
import { WhatsAppBubble, useStepEnter, staggerDelay } from "../atoms";

/** Must match the cursor motion.div's own transition below. */
const CURSOR_DELAY = 0.9;
const CURSOR_DURATION = 1.1;

export function ApprovalStep({ staticMode = false }: { staticMode?: boolean }) {
  const t = useTranslations("hero.flow.steps.approval");
  const [pressed, setPressed] = useState(staticMode);
  const approveRef = useRef<HTMLButtonElement>(null);
  const [cursorTarget, setCursorTarget] = useState<{ x: number; y: number } | null>(null);

  // Measured synchronously before paint (not in a setTimeout) so the very
  // first `animate` value is already correct — otherwise Motion plays the
  // delay+duration transition twice: once toward a stale (0,0) target, then
  // again toward the real one once state catches up, and the cursor never
  // visibly lands before the step auto-advances.
  useLayoutEffect(() => {
    if (staticMode) return;
    const el = approveRef.current;
    const stage = el?.closest("[data-approval-stage]");
    if (!el || !stage) return;
    const rect = el.getBoundingClientRect();
    const parentRect = stage.getBoundingClientRect();
    setCursorTarget({
      x: rect.left - parentRect.left + rect.width / 2,
      y: rect.top - parentRect.top + rect.height / 2,
    });
  }, [staticMode]);

  // The "click" flips once the cursor has actually arrived, not on an
  // independent timer — previously it fired before the cursor was anywhere
  // near the button.
  useEffect(() => {
    if (staticMode || !cursorTarget) return;
    const id = setTimeout(() => setPressed(true), (CURSOR_DELAY + CURSOR_DURATION) * 1000);
    return () => clearTimeout(id);
  }, [staticMode, cursorTarget]);

  return (
    <div data-approval-stage className="relative flex h-full flex-col gap-3 p-5">
      <WhatsAppBubble sender={t("managerLabel")}>
        {t("summary")}
      </WhatsAppBubble>

      <motion.div {...useStepEnter(staggerDelay(2))} className="ms-auto flex gap-2">
        <button
          ref={approveRef}
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-transform duration-150 ${
            pressed
              ? "scale-95 bg-[var(--success)] text-white"
              : "bg-[var(--accent)] text-[var(--accent-foreground)]"
          }`}
        >
          {t("approve")}
        </button>
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          className="rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium text-[var(--text-secondary)]"
        >
          {t("fix")}
        </button>
      </motion.div>

      {!staticMode && cursorTarget && (
        <motion.div
          aria-hidden="true"
          initial={{ x: 20, y: 60, opacity: 0 }}
          animate={{ x: cursorTarget.x - 10, y: cursorTarget.y - 4, opacity: 1 }}
          transition={{ duration: CURSOR_DURATION, delay: CURSOR_DELAY, ease: [0.22, 1, 0.36, 1] }}
          // Deliberately physical left/top, not start/top: cursorTarget.x/y
          // come from getBoundingClientRect, which is always a physical
          // (viewport-left-origin) measurement. Anchoring with logical
          // `start` would put the origin on the opposite edge in RTL,
          // sending the cursor hundreds of pixels past the button.
          className="pointer-events-none absolute left-0 top-0"
        >
          <MousePointer2
            className="size-5 rotate-[-20deg] text-[var(--text-primary)] drop-shadow-md rtl:-scale-x-100"
            fill="currentColor"
          />
        </motion.div>
      )}

      <motion.p
        {...useStepEnter(staggerDelay(5))}
        className="mt-auto flex items-center gap-2 text-sm font-semibold text-[var(--success)]"
      >
        <ShieldCheck className="size-4 shrink-0" aria-hidden="true" />
        {t("guarantee")}
      </motion.p>
    </div>
  );
}
