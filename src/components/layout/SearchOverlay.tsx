"use client";

import { useState, useEffect, useRef } from "react";
import { useStore } from "@/lib/store";
import { Search, X, ArrowRight } from "lucide-react";
import { products } from "@/lib/data";
import Link from "next/link";

export default function SearchOverlay() {
  const { state, dispatch } = useStore();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [state.searchOpen]);

  if (!state.searchOpen) return null;

  const results = query.length > 1
    ? products.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : [];

  const close = () => dispatch({ type: "TOGGLE_SEARCH" });

  return (
    <div
      className="fixed inset-0 z-[60] bg-white flex flex-col overflow-y-auto"
      style={{ animation: "fadeIn 0.2s ease" }}
    >
      {/* Header bar */}
      <div
        className="grid items-center px-5 lg:px-12 h-[88px] lg:h-[104px] border-b border-[#EAE6E0] flex-shrink-0"
        style={{ gridTemplateColumns: "minmax(0,1fr) auto minmax(0,1fr)" }}
      >
        <div />
        <div className="flex justify-center">
          <Link href="/" onClick={close}>
            <span className="f-display text-[#0A0A0A]" style={{ fontSize: "clamp(17px,1.8vw,22px)", letterSpacing: "0.55em", fontWeight: 300 }}>
              ARINAS
            </span>
          </Link>
        </div>
        <div className="flex justify-end">
          <button onClick={close} className="text-[#0A0A0A]/40 hover:text-[#0A0A0A] transition-colors p-1" aria-label="Close search">
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Search input */}
      <div className="px-6 lg:px-20 pt-10 pb-8 flex-shrink-0">
        <div className="max-w-2xl mx-auto">
          <p className="f-label text-[#B89A6A] mb-4" style={{ fontSize: "8.5px", letterSpacing: "0.3em" }}>
            Search
          </p>
          <div className="flex items-center gap-3 border-b border-[#0A0A0A] pb-3">
            <Search size={16} strokeWidth={1.5} className="text-[#8A8680] flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Silk dresses, abayas, accessories…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && close()}
              className="flex-1 bg-transparent focus:outline-none text-[#0A0A0A] placeholder-[#C4C0BB]"
              style={{ fontSize: "18px", fontFamily: "Cormorant Garamond, serif", fontWeight: 300 }}
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-[#8A8680] hover:text-[#0A0A0A] transition-colors flex-shrink-0">
                <X size={14} strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="px-6 lg:px-20 max-w-2xl mx-auto w-full flex-1">
        {results.length > 0 && (
          <div className="space-y-0 border-t border-[#EAE6E0]">
            {results.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                onClick={close}
                className="flex items-center gap-5 py-4 border-b border-[#EAE6E0] hover:bg-[#FAF9F7] -mx-4 px-4 transition-colors group"
              >
                <div className="w-12 h-14 bg-[#F5F2EC] overflow-hidden flex-shrink-0">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="f-label text-[#B89A6A] mb-0.5" style={{ fontSize: "8px", letterSpacing: "0.2em" }}>
                    {product.category}
                  </p>
                  <p className="f-serif text-[#0A0A0A] group-hover:text-[#B89A6A] transition-colors truncate" style={{ fontSize: "13px" }}>
                    {product.name}
                  </p>
                </div>
                <span className="f-label text-[#0A0A0A] flex-shrink-0" style={{ fontSize: "11px" }}>
                  ${product.price.toLocaleString()}
                </span>
                <ArrowRight size={13} strokeWidth={1.5} className="text-[#8A8680] group-hover:text-[#B89A6A] transition-colors flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}

        {query.length > 1 && results.length === 0 && (
          <p className="f-label text-[#8A8680] text-center py-8" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>
            No results for &ldquo;{query}&rdquo;
          </p>
        )}

        {query.length === 0 && (
          <div className="space-y-8">
            <div>
              <p className="f-label text-[#8A8680] mb-4" style={{ fontSize: "8.5px", letterSpacing: "0.28em" }}>
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {["Silk Dresses", "Abayas", "Evening Gowns", "New Arrivals", "Cashmere", "Bags"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setQuery(t)}
                    className="border border-[#E4E0DA] px-4 py-2 text-[#0A0A0A]/55 hover:border-[#B89A6A] hover:text-[#B89A6A] transition-colors"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: "9px", letterSpacing: "0.12em" }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="f-label text-[#8A8680] mb-4" style={{ fontSize: "8.5px", letterSpacing: "0.28em" }}>
                Quick Links
              </p>
              <div className="space-y-1">
                {[["New Arrivals", "/new-arrivals"], ["Collections", "/collections"], ["Dresses", "/shop"], ["Sale", "/shop"]].map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    onClick={close}
                    className="flex items-center gap-3 py-2.5 text-[#0A0A0A]/50 hover:text-[#B89A6A] transition-colors group"
                    style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: "10.5px", letterSpacing: "0.1em" }}
                  >
                    <span className="w-4 h-px bg-current group-hover:w-7 transition-all duration-300 flex-shrink-0" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
