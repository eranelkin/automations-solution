import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageBackground } from "@/components/layout/page-background";
import { Hero } from "@/components/sections/hero";
import { BenefitsSection } from "@/components/sections/benefits-section";
import { SolutionSection } from "@/components/sections/solution-section";
import { ExamplesSection } from "@/components/sections/examples-section";
import { CommitmentSection } from "@/components/sections/commitment-section";
import { FaqSection } from "@/components/sections/faq-section";
import { FaqJsonLd } from "@/components/sections/faq-json-ld";
import { ContactSection } from "@/components/sections/contact-section";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <FaqJsonLd locale={locale} />
      <PageBackground />
      <Header />
      <main id="main-content">
        <Hero />
        <BenefitsSection />
        <SolutionSection />
        <ExamplesSection />
        <CommitmentSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
