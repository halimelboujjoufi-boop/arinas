import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-guard";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { listAdminProducts } from "@/lib/products/data";
import { payloadToRow, rowToProduct, type ProductRow } from "@/lib/products/types";

export const dynamic = "force-dynamic";

// List every product (admin view).
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const products = await listAdminProducts();
  return NextResponse.json({ products });
}

// Create a product.
export async function POST(req: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const supabase = createSupabaseServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Database not configured. Set SUPABASE_SERVICE_ROLE_KEY and run schema.sql." },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.name || String(body.name).trim() === "") {
    return NextResponse.json({ error: "Product name is required." }, { status: 400 });
  }

  const row = payloadToRow(body);
  const { data, error } = await supabase.from("products").insert(row).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ product: rowToProduct(data as ProductRow) }, { status: 201 });
}
