import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { COMPANY_NAME } from "@/config/site";
import { loadGoogleFont } from "@/lib/og-fonts";
import { fixRtlForSatori } from "@/lib/bidi-fix";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const tHero = await getTranslations({ locale, namespace: "hero" });
  const isHebrew = locale === "he";
  const fontFamily = isHebrew ? "Heebo" : "Inter";

  // Headline is rendered as two short, pre-wrapped lines (reusing the Hero's
  // own line breaks) and bidi-fixed per line, since Satori has no bidi
  // algorithm and fixing a long auto-wrapped RTL string flips line order.
  const titleLine1 = isHebrew ? fixRtlForSatori(tHero("titleLine1")) : tHero("titleLine1");
  const titleLine2 = isHebrew ? fixRtlForSatori(tHero("titleLine2")) : tHero("titleLine2");

  // Same reasoning as the headline: split at the natural comma break and fix
  // each short line independently rather than letting a long string auto-wrap.
  const descriptionLines = isHebrew
    ? (() => {
        const commaIndex = t("description").indexOf(",");
        const first = t("description").slice(0, commaIndex + 1);
        const second = t("description").slice(commaIndex + 1).trim();
        return [fixRtlForSatori(first), fixRtlForSatori(second)];
      })()
    : [t("description")];

  const [regular, bold] = await Promise.all([
    loadGoogleFont(fontFamily, 500),
    loadGoogleFont(fontFamily, 700),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: isHebrew ? "flex-end" : "flex-start",
          padding: "80px",
          background: "linear-gradient(135deg, #0A0B10 0%, #1E1B3A 55%, #0A0B10 100%)",
          fontFamily,
          direction: isHebrew ? "rtl" : "ltr",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 48,
          }}
        >
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#06B6D4",
            }}
          />
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: "50%",
              background: "#4F46E5",
            }}
          />
          <div
            style={{
              fontSize: 40,
              fontWeight: 700,
              color: "#F1F5F9",
            }}
          >
            {COMPANY_NAME}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 56,
            fontWeight: 700,
            color: "#F1F5F9",
            maxWidth: 980,
            textAlign: isHebrew ? "right" : "left",
            lineHeight: 1.25,
          }}
        >
          <span>{titleLine1}</span>
          <span>{titleLine2}</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: 28,
            fontWeight: 500,
            color: "#94A3B8",
            maxWidth: 900,
            marginTop: 32,
            textAlign: isHebrew ? "right" : "left",
            lineHeight: 1.5,
          }}
        >
          {descriptionLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: fontFamily, data: regular, weight: 500, style: "normal" },
        { name: fontFamily, data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
