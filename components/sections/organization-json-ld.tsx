import { getTranslations } from "next-intl/server";
import { COMPANY_NAME, SITE_URL, WHATSAPP_PHONE } from "@/config/site";

export async function OrganizationJsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "meta" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: COMPANY_NAME,
    url: SITE_URL,
    description: t("description"),
    telephone: `+${WHATSAPP_PHONE}`,
    areaServed: "IL",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
