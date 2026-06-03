"use client";

import { useStore } from "@/lib/store";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";

export default function WishlistPage() {
  const { state } = useStore();

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-[#F5F2EC] py-16 lg:py-24 text-center">
        <p className="f-label text-[#B89A6A] mb-4" style={{ fontSize: "9px", letterSpacing: "0.35em" }}>
          Saved
        </p>
        <h1 className="f-display text-[#0A0A0A]" style={{ fontSize: "clamp(38px, 5vw, 72px)" }}>
          My Wishlist
        </h1>
        {state.wishlist.length > 0 && (
          <p className="f-label text-[#8A8680] mt-3" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>
            {state.wishlist.length} piece{state.wishlist.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="max-w-[1680px] mx-auto px-6 lg:px-14 py-16 lg:py-24">
        {state.wishlist.length === 0 ? (
          <div className="text-center py-24">
            <Heart size={38} strokeWidth={1} className="mx-auto text-[#D4D0CA] mb-6" />
            <p className="f-editorial text-[#8A8680] mb-8" style={{ fontSize: "18px" }}>
              Your wishlist is empty
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 f-label text-[#0A0A0A] border border-[#0A0A0A] px-8 py-4 hover:bg-[#0A0A0A] hover:text-white transition-colors"
              style={{ fontSize: "9px", letterSpacing: "0.28em" }}
            >
              Discover the Collection
              <ArrowRight size={12} strokeWidth={1.5} />
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {state.wishlist.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/shop"
                className="inline-flex items-center gap-3 f-label text-[#8A8680] hover:text-[#0A0A0A] transition-colors"
                style={{ fontSize: "9px", letterSpacing: "0.2em" }}
              >
                Continue Shopping
                <ArrowRight size={12} strokeWidth={1.5} />
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
