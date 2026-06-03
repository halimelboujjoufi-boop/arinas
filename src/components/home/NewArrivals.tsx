"use client";

import Link from "next/link";
import Image from "next/image";
import { products } from "@/lib/data";
import { ArrowUpRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { useState } from "react";
import { Heart } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function NewArrivals() {
  const arrivals = products.filter((p) => p.isNew).slice(0, 5);
  const [hero, ...rest] = arrivals;

  return (
    <section className="py-28 lg:py-36 px-6 lg:px-14 max-w-[1680px] mx-auto">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-16">
        <div>
          <ScrollReveal delay={0}>
            <p className="f-label text-[#B89A6A] mb-4" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
              Just Arrived
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2
              className="f-display text-[#0A0A0A]"
              style={{ fontSize: "clamp(42px,5vw,72px)" }}
            >
              New Season
            </h2>
          </ScrollReveal>
        </div>
        <ScrollReveal delay={200} direction="fade">
          <Link
            href="/new-arrivals"
            className="hidden lg:flex items-center gap-2 f-label text-[#8A8680] hover:text-[#0A0A0A] transition-colors"
            style={{ fontSize: "10px" }}
          >
            View All <ArrowUpRight size={13} strokeWidth={1.5} />
          </Link>
        </ScrollReveal>
      </div>

      {/* Asymmetric Editorial Grid */}
      <div className="grid grid-cols-12 gap-4 lg:gap-6">
        {hero && (
          <ScrollReveal delay={0} className="col-span-12 lg:col-span-7">
            <EditorialCard product={hero} large />
          </ScrollReveal>
        )}

        <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 lg:gap-6">
          {rest.slice(0, 2).map((p, i) => (
            <ScrollReveal key={p.id} delay={i * 120}>
              <EditorialCard product={p} />
            </ScrollReveal>
          ))}
        </div>

        {rest.slice(2, 4).map((p, i) => (
          <ScrollReveal key={p.id} delay={i * 100} className="col-span-6 lg:col-span-3">
            <EditorialCard product={p} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

function EditorialCard({ product, large = false }: { product: (typeof products)[0]; large?: boolean }) {
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
      <div
        className="relative overflow-hidden bg-[#F5F2EC]"
        style={{ aspectRatio: large ? "4/5" : "3/4" }}
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes={large ? "(min-width: 1024px) 42vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
          className="img-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ transform: hovered ? "scale(1.06)" : "scale(1)" }}
        />
        {product.images?.[1] && (
          <Image
            src={product.images[1]}
            alt={product.name}
            fill
            sizes={large ? "(min-width: 1024px) 42vw, 100vw" : "(min-width: 1024px) 25vw, 50vw"}
            className="img-cover absolute inset-0 transition-opacity duration-700"
            style={{ opacity: hovered ? 1 : 0 }}
          />
        )}

        {product.badge === "SALE" && discount && (
          <span className="absolute top-4 left-4 f-label text-white bg-[#B89A6A] px-3 py-1.5" style={{ fontSize: "9px" }}>
            -{discount}%
          </span>
        )}
        {product.isNew && product.badge !== "SALE" && (
          <span className="absolute top-4 left-4 f-label text-[#0A0A0A] bg-white px-3 py-1.5" style={{ fontSize: "9px" }}>
            New
          </span>
        )}

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

        <div
          className="absolute bottom-0 left-0 right-0 transition-all duration-500"
          style={{ transform: hovered ? "translateY(0)" : "translateY(100%)", opacity: hovered ? 1 : 0 }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              dispatch({ type: "SET_QUICK_VIEW", payload: product });
            }}
            className="w-full bg-white/95 backdrop-blur-sm py-3.5 f-label text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors"
            style={{ fontSize: "9px", letterSpacing: "0.22em" }}
          >
            Quick View
          </button>
        </div>
      </div>

      <div className="pt-5">
        <p className="f-label text-[#B89A6A] mb-2" style={{ fontSize: "10.5px", letterSpacing: "0.2em" }}>
          {product.category}
        </p>
        <div className="flex items-start justify-between gap-3">
          <h3 className="f-serif text-[#0A0A0A] leading-snug flex-1 min-w-0" style={{ fontSize: large ? "20px" : "17px" }}>
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
