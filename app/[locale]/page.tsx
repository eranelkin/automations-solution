import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageBackground } from "@/components/layout/page-background";
import { Hero } from "@/components/sections/hero";
import { ProblemSection } from "@/components/sections/problem-section";
import { SolutionSection } from "@/components/sections/solution-section";
import { ExamplesSection } from "@/components/sections/examples-section";
import { WhyUsSection } from "@/components/sections/why-us-section";
import { CommitmentSection } from "@/components/sections/commitment-section";
import { SystemsMarquee } from "@/components/sections/systems-marquee";
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
        <SolutionSection />
        <ProblemSection />
        <CommitmentSection />
        <ExamplesSection />
        <WhyUsSection />
        <SystemsMarquee />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
