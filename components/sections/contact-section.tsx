"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Section, SectionHeading } from "@/components/ui/section";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/format";
import { useCalculator } from "@/components/calculator/calculator-context";
import {
  contactDefaultValues,
  contactSchema,
  INDUSTRY_IDS,
  type ContactFormValues,
} from "@/lib/contact-schema";

type SubmitState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success" }
  | { status: "error"; code: "no_webhook" | "rate_limited" | "generic" };

export function ContactSection() {
  const t = useTranslations("contact");
  const tCalc = useTranslations("calculator");
  const locale = useLocale();
  const { input, result, prefillRequestId } = useCalculator();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactDefaultValues,
  });

  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle" });

  useEffect(() => {
    if (prefillRequestId === 0) return;
    const text = tCalc("contactPrefill", {
      employees: formatNumber(input.employees, locale),
      hours: formatNumber(input.hoursPerWeek, locale),
      cost: formatNumber(input.hourlyCost, locale),
      savings: formatCurrency(result.yearlySavings, locale),
    });
    setValue("description", text, { shouldDirty: true });
    document.getElementById("description-field")?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefillRequestId]);

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitState({ status: "loading" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };

      if (data.ok) {
        setSubmitState({ status: "success" });
        reset();
        return;
      }

      if (data.error === "no_webhook") {
        setSubmitState({ status: "error", code: "no_webhook" });
      } else if (data.error === "rate_limited") {
        setSubmitState({ status: "error", code: "rate_limited" });
      } else {
        setSubmitState({ status: "error", code: "generic" });
      }
    } catch {
      setSubmitState({ status: "error", code: "generic" });
    }
  };

  return (
    <Section id="contact">
      <SectionHeading title={t("title")} subtitle={t("subtitle")} />

      <div className="mx-auto max-w-3xl">
        <Card spotlight={false} className="p-6 md:p-8">
          {submitState.status === "success" ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center gap-3 py-12 text-center"
            >
              <CheckCircle2 className="size-12 text-[var(--success)]" aria-hidden="true" />
              <h3 className="text-xl font-semibold text-[var(--text-primary)]">
                {t("successTitle")}
              </h3>
              <p className="text-[var(--text-secondary)]">{t("successText")}</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-5">
              {/* Honeypot — hidden from sighted/keyboard users, left for bots */}
              <div className="absolute -start-[9999px]" aria-hidden="true">
                <label htmlFor="company_website">Company website</label>
                <input
                  id="company_website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  {...register("honeypot")}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="fullName"
                  label={t("fields.fullName.label")}
                  placeholder={t("fields.fullName.placeholder")}
                  error={errors.fullName?.message}
                  t={t}
                  registration={register("fullName")}
                />
                <Field
                  id="businessName"
                  label={t("fields.businessName.label")}
                  placeholder={t("fields.businessName.placeholder")}
                  error={errors.businessName?.message}
                  t={t}
                  registration={register("businessName")}
                />
                <Field
                  id="phone"
                  type="tel"
                  label={t("fields.phone.label")}
                  placeholder={t("fields.phone.placeholder")}
                  error={errors.phone?.message}
                  t={t}
                  registration={register("phone")}
                />
                <Field
                  id="email"
                  type="email"
                  label={t("fields.email.label")}
                  placeholder={t("fields.email.placeholder")}
                  error={errors.email?.message}
                  t={t}
                  registration={register("email")}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="industry" className="text-sm font-medium text-[var(--text-primary)]">
                  {t("fields.industry.label")}
                </label>
                <select
                  id="industry"
                  defaultValue=""
                  aria-invalid={Boolean(errors.industry)}
                  aria-describedby={errors.industry ? "industry-error" : undefined}
                  className={cn(
                    "h-11 rounded-xl border bg-[var(--background)] px-3.5 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
                    errors.industry ? "border-red-500" : "border-[var(--border)]",
                  )}
                  {...register("industry")}
                >
                  <option value="" disabled>
                    {t("fields.industry.placeholder")}
                  </option>
                  {INDUSTRY_IDS.map((id) => (
                    <option key={id} value={id}>
                      {t(`industries.${id}`)}
                    </option>
                  ))}
                </select>
                {errors.industry && (
                  <p id="industry-error" className="text-sm text-red-500">
                    {t(errors.industry.message as never)}
                  </p>
                )}
              </div>

              <Field
                id="processToAutomate"
                label={t("fields.processToAutomate.label")}
                placeholder={t("fields.processToAutomate.placeholder")}
                error={errors.processToAutomate?.message}
                t={t}
                registration={register("processToAutomate")}
              />

              <div className="flex flex-col gap-1.5">
                <label htmlFor="description-field" className="text-sm font-medium text-[var(--text-primary)]">
                  {t("fields.description.label")}
                </label>
                <textarea
                  id="description-field"
                  rows={4}
                  placeholder={t("fields.description.placeholder")}
                  className="rounded-xl border border-[var(--border)] bg-[var(--background)] px-3.5 py-2.5 text-sm text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]"
                  {...register("description")}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-start gap-2.5">
                  <input
                    id="consent"
                    type="checkbox"
                    aria-invalid={Boolean(errors.consent)}
                    aria-describedby={errors.consent ? "consent-error" : undefined}
                    className="mt-0.5 size-4 shrink-0 accent-[var(--accent)]"
                    {...register("consent")}
                  />
                  <label htmlFor="consent" className="text-sm text-[var(--text-secondary)]">
                    {t("fields.consent")}{" "}
                    <Link href="/privacy" className="text-[var(--accent)] underline">
                      {t("privacyLink")}
                    </Link>
                  </label>
                </div>
                {errors.consent && (
                  <p id="consent-error" className="text-sm text-red-500">
                    {t(errors.consent.message as never)}
                  </p>
                )}
              </div>

              <AnimatePresence>
                {submitState.status === "error" && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    role="alert"
                    className="overflow-hidden text-sm text-red-500"
                  >
                    {t(
                      submitState.code === "no_webhook"
                        ? "errors.noWebhook"
                        : submitState.code === "rate_limited"
                          ? "errors.rateLimited"
                          : "errors.generic",
                    )}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button type="submit" size="lg" loading={isSubmitting} className="mt-2">
                {isSubmitting ? t("submitting") : t("submit")}
              </Button>
            </form>
          )}
        </Card>
      </div>
    </Section>
  );
}

function Field({
  id,
  label,
  placeholder,
  error,
  type = "text",
  t,
  registration,
}: {
  id: string;
  label: string;
  placeholder: string;
  error?: string;
  type?: string;
  t: ReturnType<typeof useTranslations>;
  registration: ReturnType<ReturnType<typeof useForm>["register"]>;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-[var(--text-primary)]">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "h-11 rounded-xl border bg-[var(--background)] px-3.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus-ring)]",
          error ? "border-red-500" : "border-[var(--border)]",
        )}
        {...registration}
      />
      {error && (
        <p id={`${id}-error`} className="text-sm text-red-500">
          {t(error as never)}
        </p>
      )}
    </div>
  );
}
