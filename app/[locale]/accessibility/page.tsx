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
  const t = await getTranslations({ locale, namespace: "legal.accessibility" });
  return { title: t("title") };
}

export default async function AccessibilityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "legal.accessibility" });
  const features = t.raw("features.items") as string[];

  return (
    <LegalPage title={t("title")} updated={t("updated")}>
      <LegalSection title={t("commitment.title")}>
        <p>{t("commitment.body")}</p>
      </LegalSection>

      <LegalSection title={t("features.title")}>
        <ul className="flex flex-col gap-2">
          {features.map((item) => (
            <li key={item} className="flex gap-2">
              <span aria-hidden="true">•</span>
              {item}
            </li>
          ))}
        </ul>
      </LegalSection>

      <LegalSection title={t("limitations.title")}>
        <p>{t("limitations.body")}</p>
      </LegalSection>

      <LegalSection title={t("contact.title")}>
        <p>{t("contact.body")}</p>
        <p>{t("contact.coordinator")}</p>
        <p>{t("contact.phone")}</p>
        <p>{t("contact.email")}</p>
        <p>{t("contact.response")}</p>
      </LegalSection>
    </LegalPage>
  );
}
