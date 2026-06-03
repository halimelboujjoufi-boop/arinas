"use client";

import { createContext, useContext, useCallback, type ReactNode } from "react";
import type { Locale } from "./config";

type DictValue = string | number | boolean | null | DictValue[] | { [key: string]: DictValue };
type Dict = Record<string, DictValue>;

interface I18nValue {
  locale: Locale;
  dict: Dict;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  locale,
  dict,
  children,
}: {
  locale: Locale;
  dict: Dict;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ locale, dict }}>
      {children}
    </I18nContext.Provider>
  );
}

function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within <I18nProvider>");
  return ctx;
}

export function useLocale(): Locale {
  return useI18n().locale;
}

/** Returns a translator `t("nav.women")` that resolves dot-paths with a fallback. */
export function useT() {
  const { dict } = useI18n();
  return useCallback(
    (path: string, fallback?: string): string => {
      const value = path
        .split(".")
        .reduce<DictValue | undefined>((obj, key) => {
          if (obj == null || typeof obj !== "object" || Array.isArray(obj)) return undefined;
          return obj[key];
        }, dict);
      if (value == null) return fallback ?? path;
      return typeof value === "string" ? value : fallback ?? path;
    },
    [dict]
  );
}

/** Access a raw value (e.g. an array of announcement strings). */
export function useDict(): Dict {
  return useI18n().dict;
}
