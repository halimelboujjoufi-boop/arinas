import { products, collections } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";
import { notFound } from "next/navigation";

export default async function CollectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const collectionNames: Record<string, string> = {
    summer: "Summer",
    casual: "Casual",
    luxury: "Luxury",
    limited: "Limited Edition",
  };

  const collectionName = collectionNames[id];
  if (!collectionName) notFound();

  const col = collections.find((c) => c.id === id);
  const collectionProducts = products.filter((p) => p.collection === collectionName);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero — full-bleed with overlay text */}
      <div className="relative overflow-hidden" style={{ height: "55vh", minHeight: "380px" }}>
        <img
          src={col?.image}
          alt={col?.name}
          className="w-full h-full object-cover"
          style={{ filter: "brightness(0.55)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end px-6 lg:px-14 pb-12 lg:pb-16">
          <p className="f-label text-[#B89A6A] mb-4" style={{ fontSize: "9px", letterSpacing: "0.35em" }}>
            {collectionProducts.length} Pieces
          </p>
          <h1 className="f-display text-white" style={{ fontSize: "clamp(40px, 6vw, 88px)" }}>
            {col?.name}
          </h1>
          {col?.description && (
            <p className="f-editorial text-white/60 mt-3 max-w-md" style={{ fontSize: "16px" }}>
              {col.description}
            </p>
          )}
        </div>
      </div>

      {/* Product grid */}
      <div className="max-w-[1680px] mx-auto px-6 lg:px-14 py-16 lg:py-24">
        {collectionProducts.length === 0 ? (
          <div className="text-center py-24">
            <p className="f-body text-[#8A8680]">No pieces in this collection yet.</p>
          </div>
        ) : (
          <>
            <p className="f-label text-[#8A8680] mb-10" style={{ fontSize: "9px", letterSpacing: "0.15em" }}>
              {collectionProducts.length} piece{collectionProducts.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {collectionProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
