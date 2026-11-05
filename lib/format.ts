export function formatCurrency(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatNumber(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "he" ? "he-IL" : "en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}
