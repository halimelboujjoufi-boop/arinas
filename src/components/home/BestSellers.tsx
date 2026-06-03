"use client";

import Link from "next/link";
import { products } from "@/lib/data";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function BestSellers() {
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);

  return (
    <section className="py-28 lg:py-36 px-6 lg:px-14 max-w-[1680px] mx-auto">
      <div className="flex items-end justify-between mb-16">
        <div>
          <ScrollReveal delay={0}>
            <p className="f-label text-[#B89A6A] mb-4" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
              House Favourites
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="f-display text-[#0A0A0A]" style={{ fontSize: "clamp(42px,5vw,72px)" }}>
              The Edit
            </h2>
          </ScrollReveal>
        </div>
        <ScrollReveal delay={150} direction="fade">
          <Link
            href="/shop"
            className="hidden lg:flex items-center gap-2 f-label text-[#8A8680] hover:text-[#0A0A0A] transition-colors"
            style={{ fontSize: "10px" }}
          >
            View All <ArrowRight size={13} strokeWidth={1.5} />
          </Link>
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {bestSellers.map((product, i) => (
          <ScrollReveal key={product.id} delay={i * 80} direction="up">
            <ProductCard product={product} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
