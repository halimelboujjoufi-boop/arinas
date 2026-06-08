import { listStorefrontProducts } from "@/lib/products/data";
import ShopClient from "./ShopClient";

// Always render fresh so admin changes appear immediately.
export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await listStorefrontProducts();
  const categories = ["All", ...Array.from(new Set(products.map((p) => p.category))).sort()];
  return <ShopClient products={products} categories={categories} />;
}
