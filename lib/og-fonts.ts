const FONT_URL_CACHE = new Map<string, string>();

async function resolveFontFileUrl(family: string, weight: number) {
  const cacheKey = `${family}:${weight}`;
  const cached = FONT_URL_CACHE.get(cacheKey);
  if (cached) return cached;

  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:wght@${weight}&display=swap`,
    { headers: { "User-Agent": "Mozilla/5.0" } },
  ).then((res) => res.text());

  const match = css.match(/src: url\(([^)]+)\)/);
  if (!match) throw new Error(`Could not resolve font file for ${family} ${weight}`);

  FONT_URL_CACHE.set(cacheKey, match[1]);
  return match[1];
}

export async function loadGoogleFont(family: string, weight: number) {
  const fileUrl = await resolveFontFileUrl(family, weight);
  const res = await fetch(fileUrl);
  return res.arrayBuffer();
}
