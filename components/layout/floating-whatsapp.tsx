"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { useCookieConsent } from "@/lib/use-cookie-consent";
import { cn } from "@/lib/utils";

const SEEN_KEY = "flowpilot-whatsapp-tooltip-seen";

export function FloatingWhatsApp() {
  const t = useTranslations("whatsappFloat");
  const reduced = usePrefersReducedMotion();
  const cookieConsent = useCookieConsent();
  const bannerVisible = cookieConsent === null;
  const [visible, setVisible] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!visible) return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(SEEN_KEY)) return;
    const id = setTimeout(() => {
      setShowTooltip(true);
      window.localStorage.setItem(SEEN_KEY, "1");
    }, 600);
    return () => clearTimeout(id);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed end-5 z-30 flex items-center gap-2 transition-[bottom] duration-300",
        bannerVisible ? "bottom-28 md:bottom-24" : "bottom-5",
      )}
    >
      {showTooltip && (
        <div
          role="status"
          className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-3.5 py-2 text-sm font-medium text-[var(--text-primary)] shadow-lg"
        >
          {t("tooltip")}
        </div>
      )}
      <a
        href={buildWhatsAppLink(t("message"))}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("label")}
        onMouseEnter={() => setShowTooltip(false)}
        className={`flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366] ${
          reduced ? "" : "animate-[whatsapp-pulse_6s_ease-in-out_infinite]"
        }`}
      >
        <WhatsAppIcon className="size-7" />
      </a>
    </div>
  );
}
