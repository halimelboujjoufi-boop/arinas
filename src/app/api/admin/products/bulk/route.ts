import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import type { ProductStatus } from "@/lib/products/types";

export const dynamic = "force-dynamic";

/**
 * Bulk operations.
 * Body: { action: "delete", ids: string[] }
 *     | { action: "status", ids: string[], status: ProductStatus }
 *     | { action: "featured", ids: string[], featured: boolean }
 */
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  let body: { action?: string; ids?: string[]; status?: ProductStatus; featured?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const ids = Array.isArray(body.ids) ? body.ids.filter(Boolean) : [];
  if (ids.length === 0) {
    return NextResponse.json({ error: "No products selected." }, { status: 400 });
  }

  if (body.action === "delete") {
    const { error } = await supabase.from("products").delete().in("id", ids);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, affected: ids.length });
  }

  if (body.action === "status") {
    const status = body.status;
    if (!["draft", "published", "out_of_stock"].includes(status as string)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }
    const { error } = await supabase.from("products").update({ status }).in("id", ids);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, affected: ids.length });
  }

  if (body.action === "featured") {
    const { error } = await supabase
      .from("products")
      .update({ featured: body.featured === true })
      .in("id", ids);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true, affected: ids.length });
  }

  return NextResponse.json({ error: "Unknown action." }, { status: 400 });
}
