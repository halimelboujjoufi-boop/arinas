"use client";

import { useStore, useCartTotal } from "@/lib/store";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";

export default function CartPage() {
  const { state, dispatch } = useStore();
  const subtotal = useCartTotal(state.cart);
  const shipping = subtotal > 500 ? 0 : 35;
  const discount = state.couponDiscount > 0
    ? Math.round(subtotal * state.couponDiscount / 100)
    : 0;
  const total = subtotal - discount + shipping;

  return (
    <div className="min-h-screen bg-white">
      {/* Page header */}
      <div className="bg-[#F5F2EC] py-16 lg:py-24 text-center">
        <p className="f-label text-[#B89A6A] mb-4" style={{ fontSize: "9px", letterSpacing: "0.35em" }}>
          Review
        </p>
        <h1 className="f-display text-[#0A0A0A]" style={{ fontSize: "clamp(38px, 5vw, 72px)" }}>
          Your Bag
        </h1>
        {state.cart.length > 0 && (
          <p className="f-label text-[#8A8680] mt-3" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>
            {state.cart.reduce((s, i) => s + i.quantity, 0)} item{state.cart.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
          </p>
        )}
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-14 py-16 lg:py-24">
        {state.cart.length === 0 ? (
          <div className="text-center py-24">
            <ShoppingBag size={40} strokeWidth={1} className="mx-auto text-[#D4D0CA] mb-6" />
            <p className="f-editorial text-[#8A8680] mb-8" style={{ fontSize: "18px" }}>
              Your bag is empty
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 f-label text-[#0A0A0A] border border-[#0A0A0A] px-8 py-4 hover:bg-[#0A0A0A] hover:text-white transition-colors"
              style={{ fontSize: "9px", letterSpacing: "0.28em" }}
            >
              Discover the Collection
              <ArrowRight size={12} strokeWidth={1.5} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-20">

            {/* Items column */}
            <div className="lg:col-span-2">
              {/* Column headers ? desktop only */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-[#0A0A0A]/[0.08] mb-2">
                <div className="col-span-6">
                  <p className="f-label text-[#8A8680]" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>Product</p>
                </div>
                <div className="col-span-2 text-center">
                  <p className="f-label text-[#8A8680]" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>Price</p>
                </div>
                <div className="col-span-2 text-center">
                  <p className="f-label text-[#8A8680]" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>Qty</p>
                </div>
                <div className="col-span-2 text-right">
                  <p className="f-label text-[#8A8680]" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>Total</p>
                </div>
              </div>

              <div className="divide-y divide-[#0A0A0A]/[0.06]">
                {state.cart.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="py-7">
                    {/* Mobile layout: stacked */}
                    <div className="flex gap-5">
                      {/* Thumbnail */}
                      <Link href={`/product/${item.id}`} className="relative block flex-shrink-0 w-[90px] lg:w-[100px] bg-[#F5F2EC] overflow-hidden" style={{ aspectRatio: "3/4" }}>
                        <Image src={item.image} alt={item.name} fill sizes="100px" className="object-cover" />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col gap-2">
                        <div>
                          <p className="f-label text-[#B89A6A] mb-1" style={{ fontSize: "8px", letterSpacing: "0.22em" }}>
                            {item.category}
                          </p>
                          <Link href={`/product/${item.id}`}>
                            <p className="f-serif text-[#0A0A0A] leading-snug hover:text-[#B89A6A] transition-colors" style={{ fontSize: "14px" }}>
                              {item.name}
                            </p>
                          </Link>
                          {item.selectedSize && (
                            <p className="f-label text-[#8A8680] mt-1" style={{ fontSize: "9px", letterSpacing: "0.12em" }}>
                              Size: {item.selectedSize}
                            </p>
                          )}
                        </div>

                        {/* Price + qty + remove ? responsive row */}
                        <div className="flex flex-wrap items-center justify-between gap-3 mt-auto pt-2">
                          {/* Price */}
                          <span className="f-label text-[#0A0A0A]" style={{ fontSize: "13px", fontWeight: 400, letterSpacing: "0.04em" }}>
                            ${item.price.toLocaleString()}
                          </span>

                          {/* Qty controls */}
                          <div className="flex items-center border border-[#0A0A0A]/15">
                            <button
                              onClick={() =>
                                item.quantity > 1
                                  ? dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity - 1 } })
                                  : dispatch({ type: "REMOVE_FROM_CART", payload: item.id })
                              }
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#F5F2EC] transition-colors"
                            >
                              <Minus size={10} strokeWidth={1.5} />
                            </button>
                            <span className="f-label text-[#0A0A0A] w-8 text-center" style={{ fontSize: "11px" }}>
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity + 1 } })}
                              className="w-8 h-8 flex items-center justify-center hover:bg-[#F5F2EC] transition-colors"
                            >
                              <Plus size={10} strokeWidth={1.5} />
                            </button>
                          </div>

                          {/* Line total + remove */}
                          <div className="flex items-center gap-3">
                            <span className="f-label text-[#0A0A0A] whitespace-nowrap" style={{ fontSize: "13px", fontWeight: 400 }}>
                              ${(item.price * item.quantity).toLocaleString()}
                            </span>
                            <button
                              onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.id })}
                              className="text-[#D4D0CA] hover:text-[#0A0A0A] transition-colors"
                              aria-label="Remove"
                            >
                              <X size={14} strokeWidth={1.5} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-6">
                <Link
                  href="/shop"
                  className="f-label text-[#8A8680] hover:text-[#0A0A0A] transition-colors flex items-center gap-2"
                  style={{ fontSize: "9px", letterSpacing: "0.2em" }}
                >
                  ? Continue Shopping
                </Link>
              </div>
            </div>

            {/* Summary column */}
            <div>
              <div className="bg-[#F5F2EC] p-8">
                <p className="f-label text-[#B89A6A] mb-8" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
                  Order Summary
                </p>

                <div className="space-y-3 pb-6 border-b border-[#0A0A0A]/[0.08]">
                  <div className="flex justify-between">
                    <span className="f-label text-[#8A8680]" style={{ fontSize: "10px", letterSpacing: "0.12em" }}>Subtotal</span>
                    <span className="f-label text-[#0A0A0A]" style={{ fontSize: "12px" }}>${subtotal.toLocaleString()}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="f-label text-[#B89A6A]" style={{ fontSize: "10px", letterSpacing: "0.12em" }}>Discount</span>
                      <span className="f-label text-[#B89A6A]" style={{ fontSize: "12px" }}>-${discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="f-label text-[#8A8680]" style={{ fontSize: "10px", letterSpacing: "0.12em" }}>Shipping</span>
                    <span className={`f-label ${shipping === 0 ? "text-[#B89A6A]" : "text-[#0A0A0A]"}`} style={{ fontSize: "12px" }}>
                      {shipping === 0 ? "Free" : `$${shipping}`}
                    </span>
                  </div>
                  {shipping > 0 && (
                    <p className="f-label text-[#B89A6A]" style={{ fontSize: "8.5px", letterSpacing: "0.15em" }}>
                      Add ${(500 - subtotal).toLocaleString()} more for free shipping
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-baseline pt-6 pb-8">
                  <span className="f-label text-[#0A0A0A]" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>Total</span>
                  <span className="f-label text-[#0A0A0A]" style={{ fontSize: "18px", fontWeight: 400 }}>${total.toLocaleString()}</span>
                </div>

                {/* Promo code */}
                <div className="flex mb-8">
                  <input
                    type="text"
                    placeholder="Promo code"
                    className="flex-1 bg-white border border-[#0A0A0A]/15 px-4 py-2.5 f-label text-[#0A0A0A] placeholder-[#C4C0BB] focus:outline-none focus:border-[#0A0A0A] transition-colors"
                    style={{ fontSize: "10px", letterSpacing: "0.1em" }}
                  />
                  <button className="bg-[#0A0A0A] text-white f-label px-5 py-2.5 hover:bg-[#B89A6A] transition-colors" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>
                    Apply
                  </button>
                </div>

                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-3 w-full bg-[#0A0A0A] text-white py-4 f-label hover:bg-[#B89A6A] transition-colors"
                  style={{ fontSize: "9px", letterSpacing: "0.3em" }}
                >
                  Proceed to Checkout
                  <ArrowRight size={12} strokeWidth={1.5} />
                </Link>

                <div className="mt-6 space-y-2">
                  {["Complimentary shipping over $500", "Free returns within 30 days", "Certificate of Authenticity"].map((t) => (
                    <p key={t} className="f-label text-[#8A8680] flex items-center gap-2" style={{ fontSize: "8.5px", letterSpacing: "0.12em" }}>
                      <span className="w-1 h-1 bg-[#B89A6A] rounded-full flex-shrink-0" />
                      {t}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
