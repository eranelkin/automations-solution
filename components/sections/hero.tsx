"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HeroFlow } from "@/components/hero-flow/hero-flow";
import { HeroBackground } from "./hero-background";
import { cn } from "@/lib/utils";

const wordTransition = { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const };

function AnimatedTitle({ text, gradient = false }: { text: string; gradient?: boolean }) {
  const words = text.split(" ");
  return (
    <span className={gradient ? "block bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent" : "block"}>
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
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16 lg:pt-32 lg:pb-20"
    >
      <HeroBackground />
      <Container className="relative grid items-center gap-12 lg:grid-cols-[45%_55%] lg:gap-10">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Badge pulse>{t("eyebrow")}</Badge>
          </motion.div>

          <h1 className="mt-6 text-[var(--text-h1)] font-semibold leading-[1.08] tracking-[-0.02em] text-[var(--text-primary)]">
            <AnimatedTitle text={t("titleLine1")} />
            <AnimatedTitle text={t("titleLine2")} gradient />
          </h1>

          {/* Static, not Motion-animated: this is the Hero's LCP candidate
              on narrow/throttled viewports, and a JS-driven opacity fade
              measurably delays its paint under mobile CPU throttling. */}
          <p className="mt-6 max-w-[38rem] text-lg leading-relaxed text-[var(--text-secondary)]">
            {t("subtitle")}
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button size="lg" asChild>
              <a href="#contact">{t("ctaPrimary")}</a>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <a href="#solution">{t("ctaSecondary")}</a>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="mt-8 flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]"
          >
            <ShieldCheck className="size-4 shrink-0 text-[var(--success)]" aria-hidden="true" />
            {t("trustLine")}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <HeroFlow />
        </motion.div>
      </Container>
    </section>
  );
}
