"use client";

import * as React from "react";
import { CURRENCIES, DEFAULT_CURRENCY } from "@/lib/currency";
import { translations, LANGS, type Lang } from "./translations";

export { LANGS, type Lang };

const STORAGE_KEY = "bdpc.lang.v1";
const LOCALES: Record<Lang, string> = { en: "en-US", th: "th-TH" };

type Vars = Record<string, string | number>;

type I18nValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string, vars?: Vars) => string;
  money: (value: number, currencyCode?: string, decimals?: number) => string;
  num: (value: number, decimals?: number) => string;
  dateShort: (iso: string) => string;
};

const I18nContext = React.createContext<I18nValue | null>(null);

function detectLang(): Lang {
  if (typeof navigator === "undefined") return "en";
  return navigator.language?.toLowerCase().startsWith("th") ? "th" : "en";
}

function interpolate(str: string, vars?: Vars): string {
  if (!vars) return str;
  return str.replace(/\{(\w+)\}/g, (_, k) => (k in vars ? String(vars[k]) : `{${k}}`));
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("en");

  React.useEffect(() => {
    let initial: Lang | null = null;
    try {
      initial = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    } catch {
      /* ignore */
    }
    setLangState(initial === "en" || initial === "th" ? initial : detectLang());
  }, []);

  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = React.useMemo<I18nValue>(() => {
    const locale = LOCALES[lang];
    const t = (key: string, vars?: Vars) => {
      const dict = translations[lang] ?? translations.en;
      return interpolate(dict[key] ?? translations.en[key] ?? key, vars);
    };
    const money = (v: number, currencyCode = DEFAULT_CURRENCY, decimals = 0) => {
      const c = CURRENCIES[currencyCode] ?? CURRENCIES[DEFAULT_CURRENCY];
      const safe = Number.isFinite(v) ? v : 0;
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: c.code,
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(safe);
    };
    const num = (v: number, decimals = 1) => {
      const safe = Number.isFinite(v) ? v : 0;
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      }).format(safe);
    };
    const dateShort = (iso: string) => {
      const d = new Date(`${iso}T00:00:00`);
      if (Number.isNaN(d.getTime())) return iso;
      return new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(d);
    };
    return { lang, setLang, t, money, num, dateShort };
  }, [lang, setLang]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = React.useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
