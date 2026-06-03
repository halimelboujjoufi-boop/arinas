import "server-only";
import type { Locale } from "./config";

// Dynamically import only the requested locale's messages — keeps the
// client bundle lean and loads translations on demand.
const dictionaries = {
  en: () => import("./messages/en.json").then((m) => m.default),
  fr: () => import("./messages/fr.json").then((m) => m.default),
  ar: () => import("./messages/ar.json").then((m) => m.default),
} as const;

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)["en"]>>;

export const getDictionary = (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();
