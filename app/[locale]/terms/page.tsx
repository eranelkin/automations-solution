// NOTE (not rendered on the site): this is a placeholder terms-of-use
// template per PROMPT.md §13. Have a lawyer review and finalize the wording
// (company legal name, liability disclaimer, jurisdiction) before this goes
// live in production.

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
  const t = await getTranslations({ locale, namespace: "legal.terms" });
  return { title: t("title") };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.terms" });

  const sections = [
    "intro",
    "use",
    "ip",
    "disclaimer",
    "jurisdiction",
    "changes",
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
