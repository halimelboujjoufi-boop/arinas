import { products } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";
import { getServerDict } from "@/i18n/server";

export default async function NewArrivalsPage() {
  const { dict } = await getServerDict();
  const newProducts = products.filter((p) => p.isNew);

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-[#F5F2EC] py-16 lg:py-24 text-center">
        <p className="f-label text-[#B89A6A] mb-4" style={{ fontSize: "9px", letterSpacing: "0.35em" }}>
          {dict.newArrivals.eyebrow}
        </p>
        <h1 className="f-display text-[#0A0A0A]" style={{ fontSize: "clamp(38px, 5vw, 72px)" }}>
          {dict.newArrivals.title}
        </h1>
        <p className="f-body text-[#8A8680] mt-5" style={{ fontSize: "13px" }}>
          {dict.newArrivals.subtitle}
        </p>
      </div>

      <div className="max-w-[1680px] mx-auto px-6 lg:px-14 py-16 lg:py-24">
        <p className="f-label text-[#8A8680] mb-10" style={{ fontSize: "9px", letterSpacing: "0.15em" }}>
          {newProducts.length} {newProducts.length !== 1 ? dict.shop.pieces : dict.shop.piece}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
