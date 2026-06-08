import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { readSupabaseEnv } from "./env";

/**
 * Service-role Supabase client for server-side writes and admin reads.
 * Uses SUPABASE_SERVICE_ROLE_KEY (never exposed to the browser).
 * Returns null when the project isn't configured, so callers can fall
 * back to the static seed catalog and the site keeps working.
 */
export function createSupabaseServiceClient(): SupabaseClient | null {
  const secret = (process.env.SUPABASE_SERVICE_ROLE_KEY || "")
    // strip stray non-ASCII (BOM / smart quotes) like the public env reader
    .replace(/[^\x20-\x7E]/g, "")
    .trim();

  if (!secret || secret === "replace-me") return null;

  let url: string;
  try {
    url = readSupabaseEnv("NEXT_PUBLIC_SUPABASE_URL");
  } catch {
    return null;
  }

  return createClient(url, secret, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function isProductsBackendConfigured(): boolean {
  return createSupabaseServiceClient() !== null;
}
