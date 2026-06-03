import type { User } from "@supabase/supabase-js";

/**
 * Admin role check.
 * An authenticated user is an admin when:
 *  - their Supabase `app_metadata.role` (or `user_metadata.role`) is "admin", OR
 *  - their email is in the ADMIN_EMAILS allowlist (comma-separated), OR
 *  - no allowlist/role is configured at all (single-tenant project — any
 *    authenticated user is the admin).
 *
 * Tighten access by setting ADMIN_EMAILS, or by setting the user's
 * app_metadata.role to "admin" in Supabase.
 */
export function isAdminUser(user: User | null | undefined): boolean {
  if (!user) return false;

  const role =
    (user.app_metadata as { role?: string } | undefined)?.role ??
    (user.user_metadata as { role?: string } | undefined)?.role;
  if (role === "admin") return true;

  const allowlist = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (allowlist.length > 0) {
    return !!user.email && allowlist.includes(user.email.toLowerCase());
  }

  // No restriction configured: treat any authenticated user as admin.
  return true;
}
