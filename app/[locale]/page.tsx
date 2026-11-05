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
import { ProcessSection } from "@/components/sections/process-section";
import { CalculatorSection } from "@/components/sections/calculator-section";
import { SystemsMarquee } from "@/components/sections/systems-marquee";
import { FaqSection } from "@/components/sections/faq-section";
import { FaqJsonLd } from "@/components/sections/faq-json-ld";
import { ContactSection } from "@/components/sections/contact-section";
import { CalculatorProvider } from "@/components/calculator/calculator-context";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <CalculatorProvider>
      <FaqJsonLd locale={locale} />
      <PageBackground />
      <Header />
      <main id="main-content">
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <ExamplesSection />
        <WhyUsSection />
        <CommitmentSection />
        <ProcessSection />
        <CalculatorSection />
        <SystemsMarquee />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </CalculatorProvider>
  );
}
