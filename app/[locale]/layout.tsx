import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { heebo, inter } from "@/lib/fonts";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { A11yScript } from "@/components/a11y/a11y-script";
import { A11yProvider } from "@/components/a11y/a11y-provider";
import { A11yToggle } from "@/components/a11y/a11y-toggle";
import { FloatingWhatsApp } from "@/components/layout/floating-whatsapp";
import { CalculatorProvider } from "@/components/calculator/calculator-context";
import { CalculatorDock } from "@/components/calculator/calculator-dock";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { Analytics } from "@/components/layout/analytics";
import { OrganizationJsonLd } from "@/components/sections/organization-json-ld";
import { SITE_URL } from "@/config/site";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t("title"), template: `%s · ${t("titleSuffix")}` },
    description: t("description"),
    alternates: {
      canonical: `/${locale}`,
      languages: { he: "/he", en: "/en" },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${SITE_URL}/${locale}`,
      locale: locale === "he" ? "he_IL" : "en_US",
      siteName: t("title"),
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const dir = locale === "he" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${heebo.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <body className="antialiased">
        <A11yScript />
        <OrganizationJsonLd locale={locale} />
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider>
            <A11yProvider>
              {/* Site-wide so the calculator dock floats on every page; the
                  home page's contact form also reads it for the prefill. */}
              <CalculatorProvider>
                <a
                  href="#main-content"
                  className="skip-link rounded-lg bg-[var(--accent)] px-4 py-2 text-sm font-medium text-[var(--accent-foreground)]"
                >
                  {locale === "he" ? "דלג לתוכן" : "Skip to content"}
                </a>
                {children}
                <CalculatorDock />
                <FloatingWhatsApp />
                <A11yToggle />
                <CookieBanner />
                <Analytics />
              </CalculatorProvider>
            </A11yProvider>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
