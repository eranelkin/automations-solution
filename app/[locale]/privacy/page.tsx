// NOTE (not rendered on the site): this is a placeholder privacy policy
// template per PROMPT.md §13. Have a lawyer review and finalize the wording
// (company legal name/registration number, data processors, jurisdiction
// details, retention periods) before this goes live in production.

import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { LegalPage } from "@/components/legal/legal-page";
import { LegalSection } from "@/components/legal/legal-section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legal.privacy" });
  return { title: t("title") };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.privacy" });

  const sections = [
    "intro",
    "collection",
    "use",
    "sharing",
    "security",
    "cookies",
    "rights",
    "contact",
  ] as const;

  return (
    <LegalPage title={t("title")} updated={t("updated")}>
      {sections.map((id) => (
        <LegalSection key={id} title={t(`${id}.title`)}>
          <p>{t(`${id}.body`)}</p>
        </LegalSection>
      ))}
    </LegalPage>
  );
}
