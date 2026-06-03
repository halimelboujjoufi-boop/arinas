import { products } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";

export default function NewArrivalsPage() {
  const newProducts = products.filter((p) => p.isNew);

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-[#F5F2EC] py-16 lg:py-24 text-center">
        <p className="f-label text-[#B89A6A] mb-4" style={{ fontSize: "9px", letterSpacing: "0.35em" }}>
          Just Arrived
        </p>
        <h1 className="f-display text-[#0A0A0A]" style={{ fontSize: "clamp(38px, 5vw, 72px)" }}>
          New Season
        </h1>
        <p className="f-body text-[#8A8680] mt-5" style={{ fontSize: "13px" }}>
          The season&apos;s most coveted pieces
        </p>
      </div>

      <div className="max-w-[1680px] mx-auto px-6 lg:px-14 py-16 lg:py-24">
        <p className="f-label text-[#8A8680] mb-10" style={{ fontSize: "9px", letterSpacing: "0.15em" }}>
          {newProducts.length} piece{newProducts.length !== 1 ? "s" : ""}
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
