import "server-only";
import { products as seedProducts } from "@/lib/data";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { rowToProduct, type AdminProduct, type ProductRow } from "./types";

/** Seed products mapped into the AdminProduct shape (used as fallback). */
function seedAsAdmin(): AdminProduct[] {
  return seedProducts.map((p) => ({
    ...p,
    stock: 25,
    status: "published",
    featured: !!p.isBestSeller,
  }));
}

/**
 * Storefront catalog — published + out-of-stock products.
 * Falls back to the static seed when Supabase isn't configured/reachable,
 * so the live site always renders something.
 */
export async function listStorefrontProducts(): Promise<AdminProduct[]> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return seedAsAdmin().filter((p) => p.status !== "draft");

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .in("status", ["published", "out_of_stock"])
      .order("created_at", { ascending: false });
    if (error || !data || data.length === 0) return seedAsAdmin().filter((p) => p.status !== "draft");
    return (data as ProductRow[]).map(rowToProduct);
  } catch {
    return seedAsAdmin().filter((p) => p.status !== "draft");
  }
}

/** Admin catalog — every product regardless of status. */
export async function listAdminProducts(): Promise<AdminProduct[]> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return seedAsAdmin();

  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return seedAsAdmin();
    return (data as ProductRow[]).map(rowToProduct);
  } catch {
    return seedAsAdmin();
  }
}

/** Single product by id (storefront). */
export async function getStorefrontProduct(id: string): Promise<AdminProduct | null> {
  const supabase = createSupabaseServiceClient();
  if (!supabase) return seedAsAdmin().find((p) => p.id === id) ?? null;

  try {
    const { data, error } = await supabase.from("products").select("*").eq("id", id).single();
    if (error || !data) return seedAsAdmin().find((p) => p.id === id) ?? null;
    return rowToProduct(data as ProductRow);
  } catch {
    return seedAsAdmin().find((p) => p.id === id) ?? null;
  }
}
