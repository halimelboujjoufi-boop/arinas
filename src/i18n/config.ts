// Central i18n configuration — shared by the proxy, layout, and client.

export const locales = ["en", "fr", "ar"] as const;
export type Locale = (typeof locales)[number];

// Per requirements: unsupported browser languages fall back to French.
export const defaultLocale: Locale = "fr";

// Right-to-left locales.
export const rtlLocales: readonly Locale[] = ["ar"];

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
};

export const localeShort: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  ar: "ع",
};

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function getDir(locale: Locale): "rtl" | "ltr" {
  return rtlLocales.includes(locale) ? "rtl" : "ltr";
}

/** Build a path for a given locale, stripping any existing locale prefix first. */
export function withLocale(pathname: string, locale: Locale): string {
  const seg = pathname.split("/")[1];
  const rest = isLocale(seg) ? pathname.slice(seg.length + 1) : pathname;
  const clean = rest && rest !== "/" ? rest : "";
  return `/${locale}${clean}`;
}

/** Remove a leading locale segment, returning the underlying app path. */
export function stripLocale(pathname: string): string {
  const seg = pathname.split("/")[1];
  if (isLocale(seg)) {
    const rest = pathname.slice(seg.length + 1);
    return rest || "/";
  }
  return pathname || "/";
}

export const LOCALE_COOKIE = "NEXT_LOCALE";
