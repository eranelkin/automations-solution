"use client";

import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import {
  Bot,
  Check,
  FileText,
  Inbox,
  MessageSquareText,
  PackageCheck,
  Phone,
  ShieldCheck,
  Smartphone,
  Wallet,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { PRE_MEETING_PHONE_DISPLAY, PRE_MEETING_PHONE_TEL } from "@/config/site";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  { icon: Inbox, tone: "accent" },
  { icon: PackageCheck, tone: "accent-2" },
  { icon: Check, tone: "success" },
] as const;

const TONES = {
  accent: "bg-[var(--accent)]/10 border-[var(--accent)]/30 text-[var(--accent)]",
  "accent-2":
    "bg-[var(--accent-2)]/10 border-[var(--accent-2)]/30 text-[var(--accent-2-text)]",
  success:
    "bg-[var(--success)]/10 border-[var(--success)]/30 text-[var(--success)]",
} as const;

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function PhoneMockup() {
  const t = useTranslations("preMeeting.phone");

  return (
    <div
      role="img"
      aria-label={t("ariaLabel")}
      className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.18)] dark:shadow-none"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-[var(--text-secondary)]">
          {t("caption")}
        </p>
        <Badge className="shrink-0 px-2.5 py-1 text-xs">{t("example")}</Badge>
      </div>

      {/* Customer message */}
      <div className="mb-3.5 rounded-2xl rounded-ss-none border border-[var(--border)] bg-[var(--card)] p-3.5 text-sm text-[var(--text-primary)]">
        <span className="mb-1 flex items-center gap-1.5 text-xs font-bold text-[var(--accent)]">
          <MessageSquareText className="size-3.5" aria-hidden="true" />
          {t("customerLabel")}
        </span>
        {t("customerMessage")}
      </div>

      {/* System draft card */}
      <div className="rounded-2xl rounded-se-none border border-[var(--success)]/40 bg-[var(--success)]/10 p-4 text-sm text-[var(--text-primary)]">
        <div className="mb-3 flex items-center justify-between gap-2 border-b border-[var(--success)]/25 pb-2">
          <span className="flex items-center gap-1.5 text-xs font-bold text-[var(--success)]">
            <Bot className="size-4" aria-hidden="true" />
            {t("draftLabel")}
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--success)]/15 px-2 py-0.5 text-xs font-bold text-[var(--success)]">
            <Check className="size-3" strokeWidth={3} aria-hidden="true" />
            {t("obligoOk")}
          </span>
        </div>

        <div className="mb-3 space-y-1.5 tabular-nums">
          <div>
            <strong>{t("customer")}</strong> {t("customerName")}
          </div>
          <div>
            <strong>{t("line1")}</strong> {t("line1Item")}{" "}
            <span className="text-[var(--success)]">({t("line1Stock")})</span>
          </div>
          <div>
            <strong>{t("line2")}</strong> {t("line2Item")}{" "}
            <span className="text-[var(--success)]">({t("line2Stock")})</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <span className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[var(--accent)] py-2.5 text-xs font-bold text-[var(--accent-foreground)]">
            <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
            {t("approve")}
          </span>
          <span className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] py-2.5 text-xs font-bold text-[var(--text-primary)]">
            <FileText className="size-3.5" aria-hidden="true" />
            {t("quote")}
          </span>
        </div>
      </div>
    </div>
  );
}

export function PreMeetingLanding() {
  const t = useTranslations("preMeeting");
  const steps = t.raw("steps") as { title: string; text: string }[];
  const audiences = t.raw("audiences") as {
    label: string;
    title: string;
    text: string;
  }[];

  return (
    <section id="top" className="pt-[72px]">
      <Container className="py-12 md:py-20">
        <div className="mx-auto max-w-5xl">
          {/* Top tag */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
            <Badge pulse className="font-semibold text-[var(--accent)]">
              {t("tag")}
            </Badge>
            <Badge className="gap-1.5">
              <ShieldCheck
                className="size-4 text-[var(--success)]"
                aria-hidden="true"
              />
              {t("tagNote")}
            </Badge>
          </div>

          {/* Headline */}
          <div className="mb-12 md:mb-16">
            <h1 className="text-[clamp(2rem,1.4rem+2.4vw,3.5rem)] leading-[1.15] font-extrabold tracking-[-0.02em] text-balance text-[var(--text-primary)]">
              {t("titleLine1")}
              <br />
              <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                {t("titleLine2")}
              </span>
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-pretty text-[var(--text-secondary)] md:text-xl">
              {t("subtitle")}{" "}
              <strong className="font-bold text-[var(--text-primary)]">
                {t("subtitleStrong")}
              </strong>
            </p>
          </div>

          {/* Steps + phone */}
          <div className="mb-12 grid items-center gap-8 md:mb-16 md:grid-cols-12 md:gap-10">
            <ol className="space-y-6 md:col-span-6">
              {steps.map((step, i) => {
                const { icon: Icon, tone } = STEPS[i];
                return (
                  <li key={step.title}>
                    <Reveal delay={i * 0.08} className="flex items-start gap-4">
                      <span
                        className={cn(
                          "mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl border font-extrabold tabular-nums",
                          TONES[tone],
                        )}
                      >
                        <span className="sr-only">{i + 1}</span>
                        <Icon className="size-5" aria-hidden="true" />
                      </span>
                      <div>
                        <h3 className="mb-1 text-xl font-bold text-[var(--text-primary)]">
                          {step.title}
                        </h3>
                        <p className="text-base leading-relaxed text-[var(--text-secondary)]">
                          {step.text}
                        </p>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ol>

            <Reveal className="md:col-span-6" delay={0.1}>
              <PhoneMockup />
            </Reveal>
          </div>

          {/* Audiences */}
          <div className="mb-12 grid gap-5 md:mb-16 md:grid-cols-2">
            {audiences.map((a, i) => {
              const Icon = i === 0 ? Smartphone : Wallet;
              return (
                <Reveal
                  key={a.title}
                  delay={i * 0.08}
                  className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm dark:shadow-none"
                >
                  <span className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-[var(--accent)]/10 text-[var(--accent)]">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <p className="mb-1 text-sm font-semibold text-[var(--accent)]">
                    {a.label}
                  </p>
                  <h3 className="mb-2 text-lg font-extrabold text-[var(--text-primary)]">
                    {a.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
                    {a.text}
                  </p>
                </Reveal>
              );
            })}
          </div>

          {/* Call to action */}
          <Reveal className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-[var(--accent)]/40 bg-[var(--surface)] p-6 md:flex-row md:p-8">
            <div>
              <Badge className="border-[var(--cta)]/40 bg-[var(--cta)]/10 font-bold text-[var(--cta)]">
                {t("cta.badge")}
              </Badge>
              <h2 className="mt-3 mb-2 text-2xl font-extrabold text-[var(--text-primary)] md:text-3xl">
                {t("cta.title")}
              </h2>
              <p className="text-base text-[var(--text-secondary)]">
                {t("cta.text")}
              </p>
            </div>
            <div className="w-full shrink-0 rounded-xl border border-[var(--border)] bg-[var(--card)] px-6 py-4 text-center md:w-auto">
              <div className="text-lg font-extrabold text-[var(--text-primary)]">
                {t("cta.name")}
              </div>
              <div className="mb-3 text-xs text-[var(--accent)]">
                {t("cta.role")}
              </div>
              <Button variant="cta" size="lg" asChild>
                <a href={`tel:${PRE_MEETING_PHONE_TEL}`}>
                  <Phone className="size-4" aria-hidden="true" />
                  <span dir="ltr" className="tabular-nums">
                    {PRE_MEETING_PHONE_DISPLAY}
                  </span>
                  <span className="sr-only">{t("cta.call")}</span>
                </a>
              </Button>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
