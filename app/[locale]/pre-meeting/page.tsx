import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { PageBackground } from "@/components/layout/page-background";
import { PreMeetingLanding } from "@/components/sections/pre-meeting-landing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "preMeeting" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: {
      canonical: `/${locale}/pre-meeting`,
      languages: { he: "/he/pre-meeting", en: "/en/pre-meeting" },
    },
  };
}

export default async function PreMeetingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <PageBackground />
      <Header />
      <main id="main-content">
        <PreMeetingLanding />
      </main>
    </>
  );
}
