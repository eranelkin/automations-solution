"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { WhatsAppBubble, TypingDots } from "../atoms";

export function IntakeStep({ staticMode = false }: { staticMode?: boolean }) {
  const t = useTranslations("hero.flow.steps.intake");
  const [showMessage, setShowMessage] = useState(staticMode);

  useEffect(() => {
    if (staticMode) return;
    const id = setTimeout(() => setShowMessage(true), 1100);
    return () => clearTimeout(id);
  }, [staticMode]);

  return (
    <div className="flex h-full flex-col justify-end gap-3 p-5">
      {showMessage ? (
        <WhatsAppBubble sender={t("sender")}>{t("message")}</WhatsAppBubble>
      ) : (
        <WhatsAppBubble sender={t("sender")}>
          <TypingDots />
        </WhatsAppBubble>
      )}
    </div>
  );
}
