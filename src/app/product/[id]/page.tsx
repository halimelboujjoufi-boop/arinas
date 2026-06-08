import { notFound } from "next/navigation";
import { getStorefrontProduct, listStorefrontProducts } from "@/lib/products/data";
import ProductClient from "./ProductClient";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getStorefrontProduct(id);
  if (!product) notFound();

  const all = await listStorefrontProducts();
  const related = all
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return <ProductClient product={product} related={related} />;
}
