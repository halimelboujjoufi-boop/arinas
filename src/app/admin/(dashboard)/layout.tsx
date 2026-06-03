import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin-access";

// Server-side guard for the admin dashboard. Runs on every render and
// verifies the Supabase session + admin role. Fails closed: any error
// (misconfiguration, expired/invalid session) redirects to the login page.
// The login page lives outside this route group, so there is no loop.
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!isAdminUser(user)) {
      redirect("/admin/login");
    }
  } catch (error) {
    // `redirect()` throws a control-flow signal — re-throw it untouched.
    if (error && typeof error === "object" && "digest" in error) throw error;
    redirect("/admin/login");
  }

  return <>{children}</>;
}
