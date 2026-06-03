"use client";

import Link from "next/link";
import { products } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";

// Renamed as a curated "The Selection" editorial section — no countdown timers
export default function FlashSale() {
  const featured = products.filter((p) => p.originalPrice || p.isBestSeller).slice(0, 4);

  return (
    <section className="bg-[#EDE8DF] py-28 lg:py-36">
      <div className="max-w-[1680px] mx-auto px-6 lg:px-14">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 items-end mb-16">
          <div>
            <p className="f-label text-[#B89A6A] mb-5" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
              Carefully Considered
            </p>
            <h2 className="f-display text-[#0A0A0A]" style={{ fontSize: "clamp(42px,5vw,72px)" }}>
              The Selection
            </h2>
          </div>
          <div className="lg:text-right">
            <p className="f-body max-w-sm lg:ml-auto" style={{ fontSize: "13px" }}>
              Pieces chosen not for trend, but for permanence —
              each one an investment in the enduring.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-4 f-label text-[#0A0A0A] hover:text-[#B89A6A] transition-colors"
            style={{ fontSize: "10px", letterSpacing: "0.25em" }}
          >
            <span className="w-8 h-px bg-current" />
            View the Full Collection
            <span className="w-8 h-px bg-current" />
          </Link>
        </div>
      </div>
    </section>
  );
}
