export type Currency = {
  code: string;
  symbol: string;
  locale: string;
};

export const CURRENCIES: Record<string, Currency> = {
  THB: { code: "THB", symbol: "฿", locale: "th-TH" },
  EUR: { code: "EUR", symbol: "€", locale: "de-DE" },
  GBP: { code: "GBP", symbol: "£", locale: "en-GB" },
  ZAR: { code: "ZAR", symbol: "R", locale: "en-ZA" },
  PLN: { code: "PLN", symbol: "zł", locale: "pl-PL" },
  USD: { code: "USD", symbol: "$", locale: "en-US" },
};

export const DEFAULT_CURRENCY = "THB";

export function formatMoney(
  value: number,
  currencyCode: string = DEFAULT_CURRENCY,
  opts: { decimals?: number } = {}
): string {
  const c = CURRENCIES[currencyCode] ?? CURRENCIES[DEFAULT_CURRENCY];
  const decimals = opts.decimals ?? 0;
  const safe = Number.isFinite(value) ? value : 0;
  return new Intl.NumberFormat(c.locale, {
    style: "currency",
    currency: c.code,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(safe);
}

export function formatNumber(value: number, decimals = 1): string {
  const safe = Number.isFinite(value) ? value : 0;
  return safe.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
