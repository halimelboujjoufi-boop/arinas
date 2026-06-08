import type { Product } from "@/lib/store";

export type ProductStatus = "draft" | "published" | "out_of_stock";

/** A row in the Supabase `products` table. */
export interface ProductRow {
  id: string;
  name: string;
  description: string | null;
  price: number;
  original_price: number | null;
  category: string;
  collection: string | null;
  stock: number;
  image: string | null;
  images: string[] | null;
  sizes: string[] | null;
  colors: string[] | null;
  badge: string | null;
  material: string | null;
  brand: string | null;
  featured: boolean;
  status: ProductStatus;
  created_at?: string;
  updated_at?: string;
}

/** Product enriched with the admin-only fields the storefront type omits. */
export interface AdminProduct extends Product {
  stock: number;
  status: ProductStatus;
  featured: boolean;
}

/** Map a DB row to the app Product shape used across the storefront. */
export function rowToProduct(row: ProductRow): AdminProduct {
  const images = row.images?.length ? row.images : row.image ? [row.image] : [];
  return {
    id: row.id,
    name: row.name,
    price: Number(row.price) || 0,
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    image: row.image || images[0] || "",
    images,
    category: row.category,
    collection: row.collection ?? undefined,
    colors: row.colors ?? [],
    sizes: row.sizes ?? [],
    badge: row.badge ?? undefined,
    material: row.material ?? undefined,
    brand: row.brand ?? undefined,
    description: row.description ?? undefined,
    isNew: row.badge === "NEW",
    isBestSeller: row.badge === "BESTSELLER",
    stock: row.stock,
    status: row.status,
    featured: row.featured,
  };
}

/** Map an incoming admin payload to a DB row (for insert/update). */
export function payloadToRow(input: Record<string, unknown>): Partial<ProductRow> {
  const str = (v: unknown) => (typeof v === "string" ? v.trim() : undefined);
  const num = (v: unknown) =>
    v === "" || v == null ? undefined : Number(v);
  const arr = (v: unknown): string[] | undefined => {
    if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
    if (typeof v === "string")
      return v.split(",").map((x) => x.trim()).filter(Boolean);
    return undefined;
  };
  const status = str(input.status);

  const row: Partial<ProductRow> = {
    name: str(input.name),
    description: str(input.description) ?? "",
    price: num(input.price) ?? 0,
    original_price: input.originalPrice ? num(input.originalPrice) : null,
    category: str(input.category) || "Uncategorized",
    collection: str(input.collection) ?? null,
    stock: num(input.stock) ?? 0,
    image: str(input.image) ?? "",
    images: arr(input.images) ?? [],
    sizes: arr(input.sizes) ?? [],
    colors: arr(input.colors) ?? [],
    badge: str(input.badge) ?? null,
    material: str(input.material) ?? null,
    brand: str(input.brand) ?? null,
    featured: input.featured === true || input.featured === "true",
    status: (status === "draft" || status === "out_of_stock" ? status : "published") as ProductStatus,
  };
  return row;
}
