import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "@/i18n/config";

const ONE_YEAR = 60 * 60 * 24 * 365;
const ADMIN_SESSION_COOKIE = "arinas_admin_session";
const ADMIN_SESSION_ISSUER = "arinas-admin";
const ADMIN_SESSION_AUDIENCE = "arinas";

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

function isAdminPath(pathname: string): boolean {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAdminLoginPath(pathname: string): boolean {
  return pathname === "/admin/login";
}

function withLocaleHeaders(req: NextRequest, locale: Locale, pathname: string): Headers {
  const headers = new Headers(req.headers);
  headers.set("x-locale", locale);
  headers.set("x-pathname", pathname);
  return headers;
}

function getCookieValue(req: NextRequest, name: string): string | undefined {
  const structured = req.cookies.get(name)?.value;
  if (structured) return structured;

  const rawCookie = req.headers.get("cookie") || "";
  for (const part of rawCookie.split(";")) {
    const [key, ...valueParts] = part.trim().split("=");
    if (key === name) return valueParts.join("=");
  }
  return undefined;
}

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecodeString(value: string): string {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

async function sha256Bytes(value: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)));
}

async function safeEqual(a: string, b: string): Promise<boolean> {
  const [left, right] = await Promise.all([sha256Bytes(a), sha256Bytes(b)]);
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left[i] ^ right[i];
  return diff === 0;
}

async function importAdminSessionKey(): Promise<CryptoKey> {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret || secret.length < 32) throw new Error("Invalid admin session secret.");
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
}

async function verifyAdminSessionCookie(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  try {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");
    if (!encodedHeader || !encodedPayload || !encodedSignature) return false;

    const header = JSON.parse(base64UrlDecodeString(encodedHeader)) as { alg?: string; typ?: string };
    if (header.alg !== "HS256" || header.typ !== "JWT") return false;

    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = await crypto.subtle.sign(
      "HMAC",
      await importAdminSessionKey(),
      new TextEncoder().encode(signingInput)
    );

    if (!(await safeEqual(encodedSignature, base64UrlEncodeBytes(new Uint8Array(expectedSignature))))) return false;

    const payload = JSON.parse(base64UrlDecodeString(encodedPayload)) as {
      sub?: string;
      role?: string;
      exp?: number;
      iss?: string;
      aud?: string;
      email?: string;
    };
    const now = Math.floor(Date.now() / 1000);

    return (
      payload.sub === "admin" &&
      payload.role === "admin" &&
      payload.iss === ADMIN_SESSION_ISSUER &&
      payload.aud === ADMIN_SESSION_AUDIENCE &&
      typeof payload.exp === "number" &&
      payload.exp > now &&
      typeof payload.email === "string" &&
      payload.email.length > 0
    );
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const firstSegment = pathname.split("/")[1];
  const hasLocalePrefix = isLocale(firstSegment);
  const routePath = hasLocalePrefix ? pathname.slice(firstSegment.length + 1) || "/" : pathname;
  const requestLocale = hasLocalePrefix ? firstSegment : detectLocale(req);

  if (isAdminPath(routePath)) {
    const isAuthenticated = await verifyAdminSessionCookie(getCookieValue(req, ADMIN_SESSION_COOKIE));
    const headers = withLocaleHeaders(req, requestLocale, routePath);

    if (isAdminLoginPath(routePath)) {
      if (isAuthenticated) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin";
        url.search = "";
        return NextResponse.redirect(url);
      }

      if (hasLocalePrefix) {
        const url = req.nextUrl.clone();
        url.pathname = routePath;
        return NextResponse.rewrite(url, { request: { headers } });
      }

      return NextResponse.next({ request: { headers } });
    }

    if (!isAuthenticated) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", routePath);
      return NextResponse.redirect(url);
    }

    if (hasLocalePrefix) {
      const url = req.nextUrl.clone();
      url.pathname = routePath;
      return NextResponse.rewrite(url, { request: { headers } });
    }

    return NextResponse.next({ request: { headers } });
  }

  //  Path already has a locale prefix: serve the underlying route 
  if (hasLocalePrefix) {
    const strippedPath = routePath;
    const url = req.nextUrl.clone();
    url.pathname = strippedPath;

    // Pass the locale + original path to the app via request headers.
    const headers = withLocaleHeaders(req, firstSegment, pathname);

    const res = NextResponse.rewrite(url, { request: { headers } });
    res.cookies.set(LOCALE_COOKIE, firstSegment, {
      path: "/",
      maxAge: ONE_YEAR,
      sameSite: "lax",
    });
    return res;
  }

  //  No locale prefix: redirect to the detected/preferred locale 
  const locale = detectLocale(req);
  const url = req.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Run on everything except Next internals, the API, and static files (paths with a dot).
  matcher: ["/((?!_next/|api/|.*\\.).*)"],
};
