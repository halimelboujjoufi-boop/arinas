import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/i18n/config";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Choose a locale from the cookie, then the Accept-Language header, else default (fr). */
function detectLocale(req: NextRequest): Locale {
  const cookie = req.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookie)) return cookie;

  const accept = req.headers.get("accept-language") ?? "";
  // "fr-FR,fr;q=0.9,en;q=0.8" -> ["fr-fr","fr","en"]
  const langs = accept
    .split(",")
    .map((part) => part.split(";")[0].trim().toLowerCase())
    .filter(Boolean);

  for (const lang of langs) {
    const base = lang.split("-")[0];
    if (base === "ar") return "ar";
    if (base === "fr") return "fr";
    if (base === "en") return "en";
  }
  return defaultLocale; // fallback: French
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const firstSegment = pathname.split("/")[1];

  // ── Path already has a locale prefix: serve the underlying route ──
  if (isLocale(firstSegment)) {
    const strippedPath = pathname.slice(firstSegment.length + 1) || "/";
    const url = req.nextUrl.clone();
    url.pathname = strippedPath;

    // Pass the locale + original path to the app via request headers.
    const headers = new Headers(req.headers);
    headers.set("x-locale", firstSegment);
    headers.set("x-pathname", pathname);

    const res = NextResponse.rewrite(url, { request: { headers } });
    res.cookies.set(LOCALE_COOKIE, firstSegment, {
      path: "/",
      maxAge: ONE_YEAR,
      sameSite: "lax",
    });
    return res;
  }

  // ── No locale prefix: redirect to the detected/preferred locale ──
  const locale = detectLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except Next internals, the API, and static files (paths with a dot).
  matcher: ["/((?!_next/|api/|.*\\.).*)"],
};
