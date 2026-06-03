export const ADMIN_SESSION_COOKIE = "arinas_admin_session";

const SESSION_TTL_SECONDS = 60 * 60 * 8;
const ISSUER = "arinas-admin";
const AUDIENCE = "arinas";

type AdminSessionPayload = {
  sub: "admin";
  role: "admin";
  email: string;
  iat: number;
  exp: number;
  iss: typeof ISSUER;
  aud: typeof AUDIENCE;
};

function base64UrlEncodeBytes(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlEncodeString(value: string): string {
  return base64UrlEncodeBytes(new TextEncoder().encode(value));
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

async function importHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim();
  if (!secret || secret.length < 32) {
    throw new Error("ADMIN_SESSION_SECRET must be at least 32 characters.");
  }
  return secret;
}

function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL?.trim().toLowerCase() || "";
}

function getAdminPasswordHash(): string {
  return process.env.ADMIN_PASSWORD_HASH?.trim().toLowerCase() || "";
}

export function isAdminAuthConfigured(): boolean {
  const secret = process.env.ADMIN_SESSION_SECRET?.trim() || "";
  return Boolean(getAdminEmail() && getAdminPasswordHash() && secret.length >= 32);
}

export async function hashAdminPassword(password: string): Promise<string> {
  const bytes = await sha256Bytes(password);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function safeEqual(a: string, b: string): Promise<boolean> {
  const [left, right] = await Promise.all([sha256Bytes(a), sha256Bytes(b)]);
  if (left.length !== right.length) return false;
  let diff = 0;
  for (let i = 0; i < left.length; i += 1) diff |= left[i] ^ right[i];
  return diff === 0;
}

export async function verifyAdminCredentials(email: string, password: string): Promise<boolean> {
  const expectedEmail = getAdminEmail();
  const expectedPasswordHash = getAdminPasswordHash();
  if (!expectedEmail || !expectedPasswordHash) return false;

  const suppliedEmail = email.trim().toLowerCase();
  const suppliedPasswordHash = await hashAdminPassword(password);

  const emailOk = await safeEqual(suppliedEmail, expectedEmail);
  const passwordOk = await safeEqual(suppliedPasswordHash, expectedPasswordHash);
  return emailOk && passwordOk;
}

export async function createAdminSessionToken(email: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    sub: "admin",
    role: "admin",
    email: email.trim().toLowerCase(),
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
    iss: ISSUER,
    aud: AUDIENCE,
  };

  const encodedHeader = base64UrlEncodeString(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const encodedPayload = base64UrlEncodeString(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = await crypto.subtle.sign("HMAC", await importHmacKey(getSessionSecret()), new TextEncoder().encode(signingInput));

  return `${signingInput}.${base64UrlEncodeBytes(new Uint8Array(signature))}`;
}

export async function verifyAdminSessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;

  try {
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const header = JSON.parse(base64UrlDecodeString(encodedHeader)) as { alg?: string; typ?: string };
    if (header.alg !== "HS256" || header.typ !== "JWT") return false;

    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = await crypto.subtle.sign(
      "HMAC",
      await importHmacKey(getSessionSecret()),
      new TextEncoder().encode(signingInput)
    );
    const expectedEncodedSignature = base64UrlEncodeBytes(new Uint8Array(expectedSignature));
    if (!(await safeEqual(encodedSignature, expectedEncodedSignature))) return false;

    const payload = JSON.parse(base64UrlDecodeString(encodedPayload)) as Partial<AdminSessionPayload>;
    const now = Math.floor(Date.now() / 1000);

    return (
      payload.sub === "admin" &&
      payload.role === "admin" &&
      payload.iss === ISSUER &&
      payload.aud === AUDIENCE &&
      typeof payload.exp === "number" &&
      payload.exp > now &&
      typeof payload.email === "string" &&
      payload.email.length > 0
    );
  } catch {
    return false;
  }
}

export function adminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
    priority: "high" as const,
  };
}
