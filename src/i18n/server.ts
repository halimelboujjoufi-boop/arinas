import "server-only";
import { headers } from "next/headers";
import { getDictionary, type Dictionary } from "./dictionaries";
import { defaultLocale, isLocale, type Locale } from "./config";

/** Resolve the current locale + dictionary inside a Server Component. */
export async function getServerDict(): Promise<{ locale: Locale; dict: Dictionary }> {
  const h = await headers();
  const headerLocale = h.get("x-locale");
  const locale = isLocale(headerLocale) ? headerLocale : defaultLocale;
  return { locale, dict: await getDictionary(locale) };
}
