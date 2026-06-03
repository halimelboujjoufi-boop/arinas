"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Product } from "@/lib/store";
import { useStore } from "@/lib/store";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { state, dispatch } = useStore();
  const [hovered, setHovered] = useState(false);
  const inWishlist = state.wishlist.some((p) => p.id === product.id);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-[#F5F2EC]" style={{ aspectRatio: "3/4" }}>
        <img
          src={product.image}
          alt={product.name}
          className="img-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
          loading="eager"
        />
        {product.images?.[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="img-cover absolute inset-0 transition-opacity duration-700"
            style={{ opacity: hovered ? 1 : 0 }}
            loading="lazy"
          />
        )}

        {/* Badge */}
        {product.badge === "SALE" && discount && (
          <span className="absolute top-4 left-4 f-label text-white bg-[#B89A6A] px-3.5 py-2" style={{ fontSize: "11px" }}>
            −{discount}%
          </span>
        )}
        {product.isNew && product.badge !== "SALE" && (
          <span className="absolute top-4 left-4 f-label text-[#0A0A0A] bg-white px-3.5 py-2" style={{ fontSize: "11px" }}>
            New
          </span>
        )}
        {product.badge === "LIMITED" && (
          <span className="absolute top-4 left-4 f-label text-white bg-[#0A0A0A] px-3.5 py-2" style={{ fontSize: "11px" }}>
            Limited
          </span>
        )}

        {/* Wishlist */}
        <button
          onClick={(e) => {
            e.preventDefault();
            dispatch({ type: "TOGGLE_WISHLIST", payload: product });
          }}
          className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center transition-all duration-300 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Heart
            size={16}
            strokeWidth={1.5}
            className={inWishlist ? "fill-[#0A0A0A] text-[#0A0A0A]" : "text-[#0A0A0A]"}
          />
        </button>

        {/* Quick View — bottom reveal */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-500"
          style={{ transform: hovered ? "translateY(0)" : "translateY(100%)", opacity: hovered ? 1 : 0 }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              dispatch({ type: "SET_QUICK_VIEW", payload: product });
            }}
            className="w-full bg-white/95 backdrop-blur-sm py-4 f-label text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
            style={{ fontSize: "11px", letterSpacing: "0.22em" }}
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-5">
        <p className="f-label text-[#B89A6A] mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.2em" }}>
          {product.category}
        </p>
        <div className="flex items-start justify-between gap-3">
          <h3 className="f-serif text-[#0A0A0A] leading-snug flex-1 min-w-0" style={{ fontSize: "17px" }}>
            {product.name}
          </h3>
          <div className="text-right flex-shrink-0 pt-px">
            <span className="f-label text-[#0A0A0A] whitespace-nowrap" style={{ fontSize: "15px", letterSpacing: "0.03em", fontWeight: 400 }}>
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="block f-label text-[#8A8680] line-through whitespace-nowrap" style={{ fontSize: "12px" }}>
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        {product.colors && (
          <div className="flex gap-2 mt-3">
            {product.colors.slice(0, 4).map((c) => (
              <span key={c} className="w-3 h-3 rounded-full" style={{ background: c, outline: "1px solid rgba(0,0,0,0.08)" }} />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
