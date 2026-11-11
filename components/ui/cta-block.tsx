"use client";

import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/** The page's one call to action: book a free consultation, with the
 * reassurance line and a WhatsApp alternative. Repeated top / middle / bottom. */
export function CtaBlock({ className }: { className?: string }) {
  const t = useTranslations("cta");
  const locale = useLocale();

  return (
    <div className={cn("flex flex-col items-center gap-3", className)}>
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
        <Button variant="cta" size="xl" asChild>
          <a href={`/${locale}#contact`}>
            {t("button")}
            <ArrowLeft className="size-5 ltr:rotate-180" aria-hidden="true" />
          </a>
        </Button>
        <a
          href={buildWhatsAppLink(t("whatsappMessage"))}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-base font-semibold text-[var(--text-primary)] underline-offset-4 hover:underline"
        >
          <WhatsAppIcon className="size-5 text-[#25D366]" />
          {t("whatsapp")}
        </a>
      </div>
      <p className="text-sm text-[var(--text-secondary)]">{t("note")}</p>
    </div>
  );
}
