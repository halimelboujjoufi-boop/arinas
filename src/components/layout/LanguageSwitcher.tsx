"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Globe, Check } from "lucide-react";
import {
  locales,
  localeNames,
  localeShort,
  withLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/i18n/config";
import { useLocale } from "@/i18n/provider";

function persistLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
  try {
    localStorage.setItem(LOCALE_COOKIE, locale);
  } catch {}
}

export default function LanguageSwitcher({
  tone = "dark",
  variant = "compact",
}: {
  tone?: "dark" | "light";
  variant?: "compact" | "list";
}) {
  const current = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const choose = (locale: Locale) => {
    if (locale !== current) {
      persistLocale(locale);
      router.push(withLocale(pathname, locale));
      router.refresh();
    }
    setOpen(false);
  };

  // Inline list (used inside the mobile menu).
  if (variant === "list") {
    return (
      <div className="flex items-center gap-3">
        {locales.map((l) => (
          <button
            key={l}
            onClick={() => choose(l)}
            className={`transition-colors ${
              l === current ? "text-white" : "text-white/40 hover:text-white/80"
            }`}
            style={{
              fontFamily: "Inter, sans-serif",
              fontWeight: l === current ? 500 : 300,
              fontSize: "13px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            {localeShort[l]}
          </button>
        ))}
      </div>
    );
  }

  const triggerColor =
    tone === "light" ? "text-white/80 hover:text-white" : "text-[#2A2A2A]/70 hover:text-[#2A2A2A]";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 transition-colors duration-300 ${triggerColor}`}
        aria-label="Change language"
      >
        <Globe size={22} strokeWidth={1.5} />
        <span
          className="hidden xl:block"
          style={{ fontFamily: "Inter, sans-serif", fontWeight: 500, fontSize: "13px", letterSpacing: "0.08em" }}
        >
          {localeShort[current]}
        </span>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-3 w-44 bg-white border border-[#EAE6E0] shadow-xl py-2 z-30"
          style={{ animation: "fadeIn 0.18s ease" }}
        >
          {locales.map((l) => (
            <button
              key={l}
              onClick={() => choose(l)}
              className="flex items-center justify-between w-full px-5 py-3 text-[#2A2A2A]/75 hover:text-[#B89A6A] hover:bg-[#FAF9F7] transition-colors"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: "13px", letterSpacing: "0.04em" }}
            >
              <span>{localeNames[l]}</span>
              {l === current && <Check size={14} strokeWidth={2} className="text-[#B89A6A]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
