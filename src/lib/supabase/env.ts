/**
 * Reads a public Supabase env var and strips any character that is not
 * printable ASCII (0x20–0x7E).
 *
 * Why: values pasted into a dashboard can pick up invisible/non-ASCII
 * characters — a UTF-8 BOM, a zero-width space, a non-breaking space, or a
 * "smart quote". When the Supabase client puts the anon key into the
 * `apikey` / `Authorization` request headers, the browser's fetch throws:
 *
 *   Failed to read the 'headers' property from 'RequestInit':
 *   String contains non ISO-8859-1 code point.
 *
 * A valid Supabase URL and anon JWT are pure ASCII, so stripping non-ASCII
 * restores the intended value and never corrupts a legitimate key.
 */
export function readSupabaseEnv(
  name: "NEXT_PUBLIC_SUPABASE_URL" | "NEXT_PUBLIC_SUPABASE_ANON_KEY"
): string {
  const raw = process.env[name];
  const cleaned = (raw ?? "").replace(/[^\x20-\x7E]/g, "").trim();

  if (!cleaned) {
    throw new Error(
      `Supabase env "${name}" is missing or empty. Set it in your environment (Vercel / .env.local).`
    );
  }
  return cleaned;
}
