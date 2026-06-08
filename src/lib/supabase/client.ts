import { createBrowserClient } from "@supabase/ssr";
import { readSupabaseEnv } from "./env";

/** Browser-side Supabase client (uses the public anon key + cookie storage). */
export function createSupabaseBrowserClient() {
  return createBrowserClient(
    readSupabaseEnv("NEXT_PUBLIC_SUPABASE_URL"),
    readSupabaseEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
  );
}
