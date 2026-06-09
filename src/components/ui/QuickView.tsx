"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { X, ShoppingBag, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function QuickView() {
  const { state, dispatch } = useStore();
  const product = state.quickViewProduct;
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [currentImage, setCurrentImage] = useState(0);
  const [added, setAdded] = useState(false);

  const inWishlist = product ? state.wishlist.some((p) => p.id === product.id) : false;

  if (!product) return null;

  const images = product.images?.length ? product.images : [product.image];
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  const handleAdd = () => {
    dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity: 1, selectedSize, selectedColor } });
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      dispatch({ type: "SET_QUICK_VIEW", payload: null });
      dispatch({ type: "OPEN_CART" });
    }, 800);
  };

  const close = () => dispatch({ type: "SET_QUICK_VIEW", payload: null });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={close} />

      <div
        className="relative bg-white w-full max-w-3xl shadow-2xl z-10 flex flex-col lg:flex-row overflow-hidden"
        style={{ maxHeight: "90vh" }}
      >
        {/* Close button ? top right, clear of all content */}
        <button
          onClick={close}
          className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center bg-white hover:bg-[#0A0A0A] hover:text-white transition-colors border border-[#0A0A0A]/10"
          aria-label="Close"
        >
          <X size={14} strokeWidth={1.5} />
        </button>

        {/*  Image panel  */}
        <div className="lg:w-[42%] flex-shrink-0 bg-[#F5F2EC] relative overflow-hidden">
          {/* Aspect ratio container */}
          <div className="relative" style={{ paddingBottom: "133.33%", height: 0 }}>
            {images.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={product.name}
                fill
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
                style={{ opacity: i === currentImage ? 1 : 0 }}
              />
            ))}
          </div>

          {/* Badge */}
          {discount && (
            <span
              className="absolute top-4 left-4 f-label text-white bg-[#B89A6A] px-3 py-1.5"
              style={{ fontSize: "9px", letterSpacing: "0.2em" }}
            >
              -{discount}%
            </span>
          )}
          {product.isNew && !discount && (
            <span
              className="absolute top-4 left-4 f-label text-[#0A0A0A] bg-white px-3 py-1.5"
              style={{ fontSize: "9px", letterSpacing: "0.2em" }}
            >
              New
            </span>
          )}

          {/* Image dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImage(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === currentImage ? "w-5 h-1 bg-white" : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        {/*  Info panel  */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <div className="px-7 pt-8 pb-6 flex-1">
            {/* Category label */}
            <p className="f-label text-[#B89A6A] mb-3" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
              {product.collection || product.category}
            </p>

            {/* Product name ? generous padding-right to avoid X button */}
            <h2
              className="f-display text-[#0A0A0A] mb-5 pr-10"
              style={{ fontSize: "clamp(22px, 2.5vw, 32px)", lineHeight: 1.05 }}
            >
              {product.name}
            </h2>

            {/* Price row */}
            <div className="flex items-baseline gap-4 mb-7">
              <span className="f-label text-[#0A0A0A]" style={{ fontSize: "16px", letterSpacing: "0.05em", fontWeight: 400 }}>
                {} DH
              </span>
              {product.originalPrice && (
                <span className="f-label text-[#8A8680] line-through" style={{ fontSize: "13px" }}>
                  {} DH
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="f-body text-[#8A8680] mb-7 line-clamp-3" style={{ fontSize: "12px", lineHeight: 1.8 }}>
                {product.description}
              </p>
            )}

            {/* Divider */}
            <div className="h-px bg-[#0A0A0A]/[0.07] mb-7" />

            {/* Colour */}
            {product.colors && product.colors.length > 0 && (
              <div className="mb-6">
                <p className="f-label text-[#0A0A0A] mb-3" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>
                  Colour
                  {selectedColor && (
                    <span className="text-[#8A8680] ml-2" style={{ textTransform: "none", letterSpacing: 0 }}>
                      ? {selectedColor}
                    </span>
                  )}
                </p>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className="w-6 h-6 rounded-full transition-all duration-200"
                      style={{
                        background: color,
                        outline: selectedColor === color ? "1.5px solid #B89A6A" : "1px solid rgba(0,0,0,0.1)",
                        outlineOffset: selectedColor === color ? "3px" : "0",
                      }}
                      aria-label={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <p className="f-label text-[#0A0A0A] mb-3" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>
                  Size
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-w-[44px] h-10 px-3 f-label border transition-all duration-200 ${
                        selectedSize === size
                          ? "bg-[#0A0A0A] text-white border-[#0A0A0A]"
                          : "border-[#0A0A0A]/15 text-[#0A0A0A] hover:border-[#0A0A0A]"
                      }`}
                      style={{ fontSize: "10px", letterSpacing: "0.08em" }}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* CTA ? pinned at bottom with clear separation */}
          <div className="px-7 pb-7 pt-5 border-t border-[#0A0A0A]/[0.07] space-y-3">
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                className={`flex-1 py-4 f-label flex items-center justify-center gap-2 transition-all duration-400 ${
                  added
                    ? "bg-[#B89A6A] text-white"
                    : "bg-[#0A0A0A] text-white hover:bg-[#B89A6A]"
                }`}
                style={{ fontSize: "9px", letterSpacing: "0.28em" }}
              >
                <ShoppingBag size={13} strokeWidth={1.5} />
                {added ? "Added to Bag" : "Add to Bag"}
              </button>
              <button
                onClick={() => dispatch({ type: "TOGGLE_WISHLIST", payload: product })}
                className={`w-13 h-auto px-4 border flex items-center justify-center transition-all duration-300 ${
                  inWishlist ? "bg-[#0A0A0A] border-[#0A0A0A]" : "border-[#0A0A0A]/15 hover:border-[#0A0A0A]"
                }`}
                aria-label="Wishlist"
              >
                <Heart
                  size={15}
                  strokeWidth={1.5}
                  className={inWishlist ? "fill-white text-white" : "text-[#0A0A0A]"}
                />
              </button>
            </div>

            <Link
              href={`/product/${product.id}`}
              onClick={close}
              className="flex items-center justify-center gap-3 w-full border border-[#0A0A0A]/15 text-[#0A0A0A] hover:border-[#0A0A0A] transition-colors py-3"
              style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: "9px", letterSpacing: "0.22em", textTransform: "uppercase" }}
            >
              View Full Details
              <ArrowRight size={12} strokeWidth={1.5} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
