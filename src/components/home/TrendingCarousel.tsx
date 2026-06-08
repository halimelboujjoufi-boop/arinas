"use client";

import { useRef, useState } from "react";
import { products } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";
import { ArrowRight } from "lucide-react";
import { useT } from "@/i18n/provider";

export default function TrendingCarousel() {
  const t = useT();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -360 : 360, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    setCanScrollRight(
      scrollRef.current.scrollLeft < scrollRef.current.scrollWidth - scrollRef.current.clientWidth - 10
    );
  };

  const curated = products.slice(0, 8);

  return (
    <section className="py-28 lg:py-36">
      <div className="max-w-[1680px] mx-auto">
        {/* Header */}
        <div className="px-6 lg:px-14 flex items-end justify-between mb-16">
          <div>
            <p className="f-label text-[#B89A6A] mb-4" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
              {t("home.nowShowing")}
            </p>
            <h2 className="f-display text-[#0A0A0A]" style={{ fontSize: "clamp(42px,5vw,72px)" }}>
              {t("home.theAtelier")}
            </h2>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <button
              aria-label="Scroll trending products backward"
              onClick={() => scroll("left")}
              className="w-10 h-10 border border-[#0A0A0A]/20 flex items-center justify-center hover:border-[#0A0A0A] transition-colors"
            >
              <ArrowRight size={14} strokeWidth={1.5} className="rotate-180" />
            </button>
            <button
              aria-label="Scroll trending products forward"
              onClick={() => scroll("right")}
              className={`w-10 h-10 border flex items-center justify-center transition-colors ${
                canScrollRight ? "border-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white" : "border-[#0A0A0A]/20 text-[#0A0A0A]/20"
              }`}
            >
              <ArrowRight size={14} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Scrollable row ? slightly peeking on edges */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto scrollbar-none px-6 lg:px-14 pb-4"
        >
          {curated.map((product) => (
            <div key={product.id} className="flex-none w-[260px] lg:w-[300px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
