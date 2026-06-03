import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";

// Server-side guard for the admin dashboard. Runs on every render,
// independent of the proxy/middleware — so the dashboard can never be
// reached without a valid, signed admin session cookie. The login page
// lives outside this route group, so it is not affected (no redirect loop).
export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get(ADMIN_SESSION_COOKIE)?.value;
  const isAuthenticated = await verifyAdminSessionToken(token);

  if (!isAuthenticated) {
    redirect("/admin/login");
  }

  return <>{children}</>;
}
