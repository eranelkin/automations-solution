"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { HeroDemoDialog } from "@/components/hero-flow/hero-demo-dialog";
import { HeroStory } from "@/components/hero-story/hero-story";
import { HeroBackground } from "./hero-background";
import { cn } from "@/lib/utils";

const wordTransition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

function AnimatedTitle({
  text,
  gradient = false,
}: {
  text: string;
  gradient?: boolean;
}) {
  const words = text.split(" ");
  return (
    <span
      className={
        gradient
          ? "inline bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent"
          : "inline"
      }
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...wordTransition, delay: 0.04 * i }}
          className={cn("inline-block", i < words.length - 1 && "me-[0.25em]")}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="top"
      className="relative flex min-h-svh items-center overflow-hidden pt-22 pb-8 lg:pt-22 lg:pb-6"
    >
      <HeroBackground />
      <Container
        id="hero-page"
        className="relative grid grid-rows-[auto_auto] justify-items-center gap-6"
      >
        <div
          className="flex max-w-5xl flex-col items-center text-center"
          id="hero-right"
        >
          <h1 className="text-[clamp(2.25rem,1.6rem+2.4vw,3.75rem)] leading-[1.1] font-extrabold tracking-[-0.02em] text-balance text-[var(--text-primary)]">
            <AnimatedTitle text={t("titleLine1")} />{" "}
            <AnimatedTitle text={t("titleLine2")} gradient />
          </h1>

          {/* Static, not Motion-animated: this is the Hero's LCP candidate
              on narrow/throttled viewports, and a JS-driven opacity fade
              measurably delays its paint under mobile CPU throttling. */}
          <p className="mt-4 max-w-[42rem] text-lg leading-relaxed text-pretty text-[var(--text-secondary)] md:text-xl">
            {t("subtitle")}
          </p>
        </div>

        <motion.div
          className="w-full min-w-0"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mb-4 flex w-full justify-start lg:w-[min(86rem,calc(100vw-4rem))] lg:mx-[calc((100%-min(86rem,calc(100vw-4rem)))/2)] lg:max-w-none">
            <HeroDemoDialog />
          </div>
          <HeroStory />
          {/* The trust guarantee: the one line a first-time visitor must
              not miss, so it's a badge rather than a caption. */}
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 flex justify-center"
          >
            <p className="inline-flex items-center gap-3 rounded-full border border-[var(--success)]/45 bg-[var(--success)]/10 py-2 ps-2 pe-5 text-base font-semibold text-[var(--text-primary)] shadow-[0_0_32px_-6px_var(--success)] md:text-lg">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--success)] text-[var(--background)] md:size-9">
                <ShieldCheck
                  className="size-5"
                  strokeWidth={2.25}
                  aria-hidden="true"
                />
              </span>
              {t("trustLine")}
            </p>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
