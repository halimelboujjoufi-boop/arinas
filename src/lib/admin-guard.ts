import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin-access";

/** True when the current request carries a valid Supabase admin session. */
export async function requireAdmin(): Promise<boolean> {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return isAdminUser(user);
  } catch {
    return false;
  }
}
