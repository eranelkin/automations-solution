"use client";

import { useTranslations } from "next-intl";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { setStoredConsent } from "@/lib/cookie-consent";
import { useCookieConsent } from "@/lib/use-cookie-consent";

export function CookieBanner() {
  const t = useTranslations("cookies");
  const consent = useCookieConsent();
  const visible = consent === null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="region"
          aria-label={t("title")}
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--card)]/95 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-4 px-6 py-5 md:flex-row md:justify-between md:px-8">
            <p className="text-sm text-[var(--text-secondary)]">
              {t("text")}{" "}
              <Link href="/privacy" className="text-[var(--accent)] underline">
                {t("privacyLink")}
              </Link>
            </p>
            <div className="flex shrink-0 gap-2">
              <Button variant="secondary" size="sm" onClick={() => setStoredConsent("declined")}>
                {t("decline")}
              </Button>
              <Button size="sm" onClick={() => setStoredConsent("accepted")}>
                {t("accept")}
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
