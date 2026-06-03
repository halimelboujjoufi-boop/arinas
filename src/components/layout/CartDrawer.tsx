"use client";

import { useStore, useCartTotal } from "@/lib/store";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Gift, Truck } from "lucide-react";
import Link from "next/link";

export default function CartDrawer() {
  const { state, dispatch } = useStore();
  const subtotal = useCartTotal(state.cart);
  const shipping = subtotal > 500 ? 0 : 35;
  const discount = state.couponDiscount > 0
    ? Math.round(subtotal * state.couponDiscount / 100)
    : 0;
  const total = subtotal - discount + shipping;

  if (!state.cartOpen) return null;

  const progress = Math.min((subtotal / 500) * 100, 100);

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => dispatch({ type: "CLOSE_CART" })}
      />
      <div className="absolute right-0 top-0 h-full w-full max-w-[420px] bg-white flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-7 py-5 border-b border-[#F0EBE3]">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-[#C9A86A]" />
            <div>
              <h2 className="text-sm tracking-[0.2em] uppercase font-medium text-[#111111]">
                Your Cart
              </h2>
              <p className="text-[10px] text-[#A1A1AA] tracking-wider">
                {state.cart.reduce((s, i) => s + i.quantity, 0)} items
              </p>
            </div>
          </div>
          <button onClick={() => dispatch({ type: "CLOSE_CART" })} className="p-1.5 hover:text-[#C9A86A] transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {subtotal < 500 && (
          <div className="px-7 py-3 bg-[#FAF7F3] border-b border-[#F0EBE3]">
            <div className="flex items-center gap-2 mb-1.5">
              <Truck size={13} className="text-[#C9A86A]" />
              <p className="text-[11px] text-[#52525B]">
                Add <span className="font-medium text-[#111111]">${(500 - subtotal).toLocaleString()}</span> more for free shipping
              </p>
            </div>
            <div className="h-1 bg-[#E4E4E7] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C9A86A] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-7 py-5">
          {state.cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-5 text-center">
              <div className="w-20 h-20 bg-[#F5F0EA] rounded-full flex items-center justify-center">
                <ShoppingBag size={32} className="text-[#D4D4D8]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#111111] mb-1">Your cart is empty</p>
                <p className="text-xs text-[#71717A]">Discover our luxury collection</p>
              </div>
              <button
                onClick={() => dispatch({ type: "CLOSE_CART" })}
                className="text-[10px] tracking-[0.25em] uppercase border border-[#111111] px-7 py-3 hover:bg-[#111111] hover:text-white transition-all duration-300"
              >
                Explore Collection
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {state.cart.map((item) => (
                <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4 group">
                  <Link
                    href={`/product/${item.id}`}
                    onClick={() => dispatch({ type: "CLOSE_CART" })}
                    className="w-[88px] h-[110px] bg-[#F5F0EA] flex-shrink-0 overflow-hidden block"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5 overflow-hidden">
                    <div>
                      <p className="text-[10px] text-[#A1A1AA] tracking-wider uppercase mb-0.5">{item.category}</p>
                      <Link
                        href={`/product/${item.id}`}
                        onClick={() => dispatch({ type: "CLOSE_CART" })}
                        className="text-[13px] font-medium text-[#111111] leading-snug hover:text-[#C9A86A] transition-colors line-clamp-2 block"
                      >
                        {item.name}
                      </Link>
                      {item.selectedSize && (
                        <p className="text-[11px] text-[#A1A1AA] mt-0.5">Size: {item.selectedSize}</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 border border-[#E4E4E7]">
                        <button
                          onClick={() =>
                            item.quantity > 1
                              ? dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity - 1 } })
                              : dispatch({ type: "REMOVE_FROM_CART", payload: item.id })
                          }
                          className="w-7 h-7 flex items-center justify-center hover:bg-[#F5F0EA] transition-colors text-[#111111]"
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-xs font-medium w-5 text-center">{item.quantity}</span>
                        <button
                          onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity + 1 } })}
                          className="w-7 h-7 flex items-center justify-center hover:bg-[#F5F0EA] transition-colors"
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-[#111111]">
                          ${(item.price * item.quantity).toLocaleString()}
                        </span>
                        <button
                          onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.id })}
                          className="text-[#D4D4D8] hover:text-[#111111] transition-colors"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {state.cart.length > 0 && (
          <div className="border-t border-[#F0EBE3] px-7 py-5 space-y-4 bg-white">
            {/* Gift Note */}
            <button className="flex items-center gap-2 text-[11px] tracking-wider text-[#71717A] hover:text-[#C9A86A] transition-colors w-full">
              <Gift size={13} />
              Add gift note & wrapping
            </button>

            {/* Totals */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-[#71717A]">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs text-[#C9A86A]">
                  <span>Discount ({state.couponCode})</span>
                  <span>-${discount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-xs text-[#71717A]">
                <span>Shipping</span>
                <span className={shipping === 0 ? "text-[#C9A86A]" : ""}>{shipping === 0 ? "Free" : `$${shipping}`}</span>
              </div>
              <div className="flex justify-between font-medium border-t border-[#F0EBE3] pt-2">
                <span className="text-sm">Total</span>
                <span className="text-base">${total.toLocaleString()}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={() => dispatch({ type: "CLOSE_CART" })}
              className="flex items-center justify-center gap-2 w-full bg-[#111111] text-white text-[10px] tracking-[0.25em] uppercase py-4 hover:bg-[#C9A86A] transition-colors duration-300 font-medium"
            >
              Proceed to Checkout
              <ArrowRight size={13} />
            </Link>
            <Link
              href="/cart"
              onClick={() => dispatch({ type: "CLOSE_CART" })}
              className="flex items-center justify-center w-full border border-[#E4E4E7] text-[#111111] text-[10px] tracking-[0.25em] uppercase py-3 hover:border-[#111111] transition-colors"
            >
              View Full Cart
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
