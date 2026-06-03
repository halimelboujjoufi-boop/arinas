"use client";

import { useState, useMemo } from "react";
import { products, categories } from "@/lib/data";
import ProductCard from "@/components/ui/ProductCard";
import { ChevronDown } from "lucide-react";

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("featured");

  const filtered = useMemo(() => {
    const list = selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

    switch (sortBy) {
      case "price-asc": return [...list].sort((a, b) => a.price - b.price);
      case "price-desc": return [...list].sort((a, b) => b.price - a.price);
      case "newest": return [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      default: return list;
    }
  }, [selectedCategory, sortBy]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="py-28 lg:py-36 px-6 lg:px-14 max-w-[1680px] mx-auto">
        <p className="f-label text-[#B89A6A] mb-5" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
          All Pieces
        </p>
        <h1 className="f-display text-[#0A0A0A]" style={{ fontSize: "clamp(52px,7vw,100px)" }}>
          The Collection
        </h1>
      </div>

      <div className="max-w-[1680px] mx-auto px-6 lg:px-14">
        {/* Toolbar */}
        <div className="flex items-center justify-between pb-8 border-b border-[#0A0A0A]/[0.08] mb-12">
          {/* Category filters */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`f-label px-4 py-2 whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "text-[#0A0A0A]"
                    : "text-[#8A8680] hover:text-[#0A0A0A]"
                }`}
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.2em",
                  borderBottom: selectedCategory === cat ? "1px solid #0A0A0A" : "1px solid transparent",
                  paddingBottom: "7px",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <p className="f-label text-[#8A8680] hidden lg:block" style={{ fontSize: "9px", letterSpacing: "0.15em" }}>
              Sort
            </p>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none f-label text-[#0A0A0A] bg-transparent pr-6 pl-0 focus:outline-none cursor-pointer"
                style={{ fontSize: "9px", letterSpacing: "0.15em" }}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-asc">Price ↑</option>
                <option value="price-desc">Price ↓</option>
              </select>
              <ChevronDown size={10} className="absolute right-0 top-1/2 -translate-y-1/2 text-[#8A8680] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Count */}
        <p className="f-label text-[#8A8680] mb-10" style={{ fontSize: "9px", letterSpacing: "0.15em" }}>
          {filtered.length} piece{filtered.length !== 1 ? "s" : ""}
          {selectedCategory !== "All" ? ` — ${selectedCategory}` : ""}
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="f-body text-[#8A8680]">No pieces found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6 mb-32">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
