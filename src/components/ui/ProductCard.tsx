"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
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
      <div
        className="relative overflow-hidden bg-[#F5F2EC] shadow-[0_0_0_1px_rgba(10,10,10,0.04)] transition-shadow duration-500 group-hover:shadow-[0_18px_45px_rgba(10,10,10,0.11)]"
        style={{ aspectRatio: "3/4" }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="img-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
        />
        {product.images?.[1] && (
          <Image
            src={product.images[1]}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
            className="img-cover absolute inset-0 transition-opacity duration-700"
            style={{ opacity: hovered ? 1 : 0 }}
          />
        )}

        {/* Badge */}
        {product.badge === "SALE" && discount && (
          <span className="absolute top-4 left-4 f-label text-white bg-[#B89A6A] px-3.5 py-2" style={{ fontSize: "11px" }}>
            -{discount}%
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
          aria-label={inWishlist ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={(e) => {
            e.preventDefault();
            dispatch({ type: "TOGGLE_WISHLIST", payload: product });
          }}
          className={`absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm transition-all duration-300 hover:bg-white ${
            hovered ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-1"
          }`}
        >
          <Heart
            size={22}
            strokeWidth={1.5}
            className={inWishlist ? "fill-[#0A0A0A] text-[#0A0A0A]" : "text-[#0A0A0A]"}
          />
        </button>

        {/* Quick View */}
        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-500"
          style={{ transform: hovered ? "translateY(0)" : "translateY(100%)", opacity: hovered ? 1 : 0 }}
        >
          <button
            aria-label={`Quick view ${product.name}`}
            onClick={(e) => {
              e.preventDefault();
              dispatch({ type: "SET_QUICK_VIEW", payload: product });
            }}
            className="w-full bg-white/95 backdrop-blur-sm py-4 f-label text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
            style={{ fontSize: "12px", letterSpacing: "0.2em" }}
          >
            Quick View
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-5">
        <p className="f-label text-[#B89A6A] mb-2" style={{ fontSize: "11px", letterSpacing: "0.18em" }}>
          {product.category}
        </p>
        <div className="flex items-start justify-between gap-3">
          <h3 className="f-serif text-[#0A0A0A] leading-snug flex-1 min-w-0 transition-colors duration-300 group-hover:text-[#B89A6A]" style={{ fontSize: "clamp(17px, 1.4vw, 20px)" }}>
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
