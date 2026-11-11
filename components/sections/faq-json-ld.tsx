import { getTranslations } from "next-intl/server";

const FAQ_IDS = [
  "howMuch",
  "howLong",
  "technicalKnowledge",
  "replaceSystems",
  "aiMistakes",
] as const;

export async function FaqJsonLd({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: "faq" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_IDS.map((id) => ({
      "@type": "Question",
      name: t(`items.${id}.question`),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(`items.${id}.answer`),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
