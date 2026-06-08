"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Heart, ChevronDown, X, ArrowRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";
import Image from "next/image";
import { useT } from "@/i18n/provider";
import type { AdminProduct } from "@/lib/products/types";

const sizeGuideData = {
  headers: ["Size", "UK", "EU", "Bust", "Waist", "Hip"],
  rows: [
    ["XS", "6", "34", "81-84", "61-64", "87-90"],
    ["S", "8", "36", "85-88", "65-68", "91-94"],
    ["M", "10", "38", "89-92", "69-72", "95-98"],
    ["L", "12", "40", "93-96", "73-76", "99-102"],
    ["XL", "14", "42", "97-100", "77-80", "103-106"],
  ],
};

export default function ProductClient({ product, related }: { product: AdminProduct; related: AdminProduct[] }) {
  const t = useT();
  const { state, dispatch } = useStore();
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>(product.colors?.[0] || "");
  const [added, setAdded] = useState(false);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>("details");
  const inWishlist = state.wishlist.some((p) => p.id === product.id);

  const images = product.images?.length ? product.images : [product.image];
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  useEffect(() => {
    dispatch({ type: "ADD_RECENTLY_VIEWED", payload: product });
  }, [dispatch, product]);

  const handleAddToCart = () => {
    if (product.sizes && !selectedSize) return;
    dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity: 1, selectedSize, selectedColor } });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      dispatch({ type: "OPEN_CART" });
    }, 800);
  };

  const toggleAccordion = (key: string) =>
    setOpenAccordion((prev) => (prev === key ? null : key));

  const accordions = [
    {
      key: "details",
      label: t("product.details"),
      content: (
        <div className="space-y-3 f-body" style={{ fontSize: "12px", lineHeight: 1.9 }}>
          <p>{product.description || "A studied composition of form and restraint. Each element selected for how it speaks to the whole - never competing, always completing."}</p>
          <ul className="space-y-1 mt-4">
            <li>Material: {product.material || "100% Silk Georgette"}</li>
            <li>Lining: 100% Silk</li>
            <li>Made in France</li>
            <li>Model wears size S - height 177cm</li>
          </ul>
        </div>
      ),
    },
    {
      key: "care",
      label: t("product.care"),
      content: (
        <ul className="f-body space-y-2" style={{ fontSize: "12px" }}>
          {["Dry clean only", "Do not bleach", "Cool iron if necessary", "Store in provided garment bag"].map((t) => (
            <li key={t} className="flex items-center gap-3">
              <span className="w-1 h-1 bg-[#B89A6A] rounded-full flex-shrink-0" />
              {t}
            </li>
          ))}
        </ul>
      ),
    },
    {
      key: "delivery",
      label: t("product.delivery"),
      content: (
        <div className="f-body space-y-2" style={{ fontSize: "12px" }}>
          <p>Complimentary shipping on all orders over $500. Express delivery within 2-3 business days.</p>
          <p className="mt-3">Free returns within 30 days. Items must be unworn with original tags attached.</p>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-[1680px] mx-auto px-6 lg:px-14 pt-4 pb-0">
        <p className="f-label text-[#8A8680]" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>
          <Link href="/" className="hover:text-[#B89A6A] transition-colors">Home</Link>
          {" / "}
          <Link href="/shop" className="hover:text-[#B89A6A] transition-colors">{product.category}</Link>
          {" / "}
          <span className="text-[#0A0A0A]">{product.name}</span>
        </p>
      </div>

      {/* Main layout */}
      <div className="max-w-[1680px] mx-auto px-6 lg:px-14 py-10">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20">

          {/* Images ? left */}
          <div>
            {/* Main image */}
            <div
              className="relative overflow-hidden bg-[#F5F2EC] mb-3"
              style={{ aspectRatio: "3/4" }}
            >
              <Image
                src={images[currentImage]}
                alt={product.name}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="img-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                style={{ transform: "scale(1.01)" }}
              />
              {discount && (
                <span className="absolute top-5 left-5 f-label text-white bg-[#B89A6A] px-3 py-1.5" style={{ fontSize: "9px" }}>
                  -{discount}%
                </span>
              )}
              {product.isNew && !discount && (
                <span className="absolute top-5 left-5 f-label text-[#0A0A0A] bg-white px-3 py-1.5" style={{ fontSize: "9px" }}>
                  {t("product.newArrival")}
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(i)}
                    className="relative overflow-hidden bg-[#F5F2EC]"
                    style={{
                      aspectRatio: "3/4",
                      outline: i === currentImage ? "1px solid #B89A6A" : "1px solid transparent",
                    }}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${i + 1}`}
                      fill
                      sizes="(min-width: 1024px) 12vw, 25vw"
                      className="img-cover transition-opacity duration-300"
                      style={{ opacity: i === currentImage ? 1 : 0.6 }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product info ? right, sticky */}
          <div className="lg:sticky lg:top-[222px] lg:self-start">
            {/* Collection label */}
            <p className="f-label text-[#B89A6A] mb-3" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
              {product.collection || product.category}
            </p>

            {/* Name */}
            <h1 className="f-display text-[#0A0A0A] mb-6" style={{ fontSize: "clamp(34px,3.4vw,54px)" }}>
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-8">
              <span className="f-label text-[#0A0A0A]" style={{ fontSize: "22px", letterSpacing: "0.04em", fontWeight: 400 }}>
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="f-label text-[#8A8680] line-through" style={{ fontSize: "16px" }}>
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Color */}
            {product.colors && (
              <div className="mb-7">
                <p className="f-label text-[#0A0A0A] mb-4" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>
                  {t("product.colour")}: <span className="text-[#8A8680]" style={{ textTransform: "none", letterSpacing: 0 }}>{selectedColor || t("product.select")}</span>
                </p>
                <div className="flex gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className="w-7 h-7 rounded-full transition-all duration-300"
                      style={{
                        background: color,
                        outline: selectedColor === color ? "1px solid #B89A6A" : "1px solid rgba(0,0,0,0.1)",
                        outlineOffset: selectedColor === color ? "3px" : "0",
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {product.sizes && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <p className="f-label text-[#0A0A0A]" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>
                    {t("product.size")}
                  </p>
                  <button
                    onClick={() => setSizeGuideOpen(true)}
                    className="f-label text-[#8A8680] hover:text-[#B89A6A] transition-colors"
                    style={{ fontSize: "9px", letterSpacing: "0.15em" }}
                  >
                    {t("product.sizeGuide")}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[52px] h-12 px-3 f-label border transition-all duration-200 ${
                        selectedSize === size
                          ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                          : "border-[#0A0A0A]/15 text-[#0A0A0A] hover:border-[#0A0A0A]"
                      }`}
                      style={{ fontSize: "12px", letterSpacing: "0.08em" }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {product.sizes && !selectedSize && (
                  <p className="f-label text-[#8A8680] mt-2" style={{ fontSize: "9px" }}>
                    {t("product.selectSize")}
                  </p>
                )}
              </div>
            )}

            {/* Add to cart + wishlist */}
            <div className="flex gap-3 mb-10">
              <button
                onClick={handleAddToCart}
                disabled={product.sizes ? !selectedSize : false}
                className={`flex-1 py-5 f-label transition-all duration-500 ${
                  added
                    ? "bg-[#B89A6A] text-white"
                    : product.sizes && !selectedSize
                    ? "bg-[#0A0A0A]/20 text-white cursor-not-allowed"
                    : "bg-[#0A0A0A] text-white hover:bg-[#B89A6A]"
                }`}
                style={{ fontSize: "11px", letterSpacing: "0.28em" }}
              >
                {added ? t("product.added") : t("common.addToBag")}
              </button>
              <button
                onClick={() => dispatch({ type: "TOGGLE_WISHLIST", payload: product })}
                className={`w-16 border flex items-center justify-center transition-all duration-300 ${
                  inWishlist ? "bg-[#0A0A0A] border-[#0A0A0A]" : "border-[#0A0A0A]/15 hover:border-[#0A0A0A]"
                }`}
              >
                <Heart
                  size={19}
                  strokeWidth={1.5}
                  className={inWishlist ? "fill-white text-white" : "text-[#0A0A0A]"}
                />
              </button>
            </div>

            {/* Accordions */}
            <div className="border-t border-[#0A0A0A]/[0.08]">
              {accordions.map(({ key, label, content }) => (
                <div key={key} className="border-b border-[#0A0A0A]/[0.08]">
                  <button
                    onClick={() => toggleAccordion(key)}
                    className="flex items-center justify-between w-full py-5 text-left"
                  >
                    <span className="f-label text-[#0A0A0A]" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>
                      {label}
                    </span>
                    <ChevronDown
                      size={14}
                      strokeWidth={1.5}
                      className={`text-[#8A8680] transition-transform duration-300 ${openAccordion === key ? "rotate-180" : ""}`}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-400"
                    style={{ maxHeight: openAccordion === key ? "400px" : "0", opacity: openAccordion === key ? 1 : 0 }}
                  >
                    <div className="pb-6 text-[#8A8680]">{content}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Complete the look */}
        {related.length > 0 && (
          <div className="mt-28 lg:mt-36 pt-16 border-t border-[#0A0A0A]/[0.08]">
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="f-label text-[#B89A6A] mb-4" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
                  {t("product.completeLook")}
                </p>
                <h2 className="f-display text-[#0A0A0A]" style={{ fontSize: "clamp(32px,4vw,56px)" }}>
                  {t("product.youMayLove")}
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden lg:flex items-center gap-2 f-label text-[#8A8680] hover:text-[#0A0A0A] transition-colors"
                style={{ fontSize: "10px" }}
              >
                View All <ArrowRight size={13} strokeWidth={1.5} />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      {/* Sticky mobile bar */}
      <div className="fixed bottom-16 lg:bottom-0 left-0 right-0 z-30 lg:hidden bg-white border-t border-[#0A0A0A]/[0.08] px-4 py-3 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="f-label text-[#8A8680] truncate" style={{ fontSize: "9px" }}>{product.name}</p>
          <p className="f-label text-[#0A0A0A]" style={{ fontSize: "13px", letterSpacing: "0.05em", fontWeight: 400 }}>
            ${product.price.toLocaleString()}
          </p>
        </div>
        <button
          onClick={handleAddToCart}
          className={`flex-1 py-3.5 f-label transition-colors ${
            added ? "bg-[#B89A6A] text-white" : "bg-[#0A0A0A] text-white"
          }`}
          style={{ fontSize: "9px", letterSpacing: "0.25em" }}
        >
          {added ? t("product.added") : t("common.addToBag")}
        </button>
      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSizeGuideOpen(false)} />
          <div className="relative bg-white w-full max-w-xl max-h-[80vh] overflow-auto z-10">
            <div className="flex items-center justify-between px-8 py-6 border-b border-[#0A0A0A]/[0.08]">
              <p className="f-label text-[#0A0A0A]" style={{ fontSize: "10px", letterSpacing: "0.25em" }}>
                {t("product.sizeGuide")}
              </p>
              <button onClick={() => setSizeGuideOpen(false)} className="text-[#8A8680] hover:text-[#0A0A0A] transition-colors">
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>
            <div className="px-8 py-6">
              <p className="f-body mb-6" style={{ fontSize: "12px" }}>All measurements in centimetres.</p>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#0A0A0A]/[0.08]">
                    {sizeGuideData.headers.map((h) => (
                      <th key={h} className="f-label text-[#8A8680] py-3 text-left" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sizeGuideData.rows.map((row) => (
                    <tr
                      key={row[0]}
                      className={`border-b border-[#0A0A0A]/[0.05] ${selectedSize === row[0] ? "bg-[#F5F2EC]" : ""}`}
                    >
                      {row.map((cell, i) => (
                        <td
                          key={i}
                          className="py-3 f-label"
                          style={{ fontSize: "11px", color: i === 0 ? "#B89A6A" : "#0A0A0A", letterSpacing: "0.05em" }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
