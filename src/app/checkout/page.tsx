"use client";

import { useState } from "react";
import { useStore, useCartTotal } from "@/lib/store";
import { COUPON_CODES } from "@/lib/data";
import {
  Shield, Lock, Check, Truck, CreditCard, Smartphone,
  Tag, X, ChevronDown, Gift
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

type PaymentMethod = "card" | "applepay" | "paypal";

export default function CheckoutPage() {
  const { state, dispatch } = useStore();
  const subtotal = useCartTotal(state.cart);
  const shipping = subtotal > 500 ? 0 : 35;
  const discount = state.couponDiscount > 0 ? Math.round(subtotal * state.couponDiscount / 100) : 0;
  const total = subtotal - discount + shipping;

  const [form, setForm] = useState({
    email: "", firstName: "", lastName: "", address: "", city: "", country: "France",
    zip: "", phone: "", cardNumber: "", cardExpiry: "", cardCvc: "", cardName: "",
    giftMessage: "", giftWrap: false,
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber] = useState(() => `ARN-${Math.random().toString(36).substr(2, 8).toUpperCase()}`);
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  const set = (key: string, val: string | boolean) => setForm((f) => ({ ...f, [key]: val }));

  const applyCoupon = () => {
    const code = couponInput.toUpperCase().trim();
    if (COUPON_CODES[code]) {
      dispatch({ type: "APPLY_COUPON", payload: { code, discount: COUPON_CODES[code] } });
      setCouponError("");
    } else {
      setCouponError("Invalid coupon code");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderPlaced(true);
    dispatch({ type: "CLEAR_CART" });
  };

  if (state.cart.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-[#8A8680] mb-4">Your cart is empty</p>
          <Link href="/shop" className="bg-[#0A0A0A] text-white text-xs tracking-widest uppercase px-8 py-3 hover:bg-[#B89A6A] transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF9F7]">
        <div className="text-center max-w-md px-6">
          <div className="w-20 h-20 bg-[#B89A6A] rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={32} className="text-white" strokeWidth={2.5} />
          </div>
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#B89A6A] mb-3">Order Confirmed</p>
          <h2 className="text-3xl font-light text-[#0A0A0A] mb-3" style={{ fontFamily: "Cormorant Garamond, serif" }}>
            Thank You
          </h2>
          <p className="text-sm text-[#8A8680] mb-2">Your order has been placed successfully</p>
          <p className="text-xs text-[#8A8680] mb-1">Order number: <strong className="text-[#0A0A0A]">{orderNumber}</strong></p>
          <p className="text-xs text-[#8A8680] mb-8">A confirmation email has been sent to {form.email || "your email"}</p>
          <div className="space-y-3">
            <Link href="/shop" className="block w-full bg-[#0A0A0A] text-white text-[10px] tracking-[0.25em] uppercase py-4 hover:bg-[#B89A6A] transition-colors">
              Continue Shopping
            </Link>
            <Link href="/account" className="block w-full border border-[#E4E4E7] text-[#0A0A0A] text-[10px] tracking-[0.25em] uppercase py-3.5 hover:border-[#0A0A0A] transition-colors">
              Track Your Order
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = "w-full border border-[#E4E4E7] bg-white px-4 py-3 text-sm placeholder-[#8A8680] focus:outline-none focus:border-[#B89A6A] transition-colors";
  const labelClass = "block text-[10px] tracking-[0.2em] uppercase text-[#0A0A0A] mb-1.5 font-medium";

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-[1300px] mx-auto px-4 lg:px-12 py-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <span className="text-2xl tracking-[0.45em] font-light" style={{ fontFamily: "Cormorant Garamond, serif" }}>
              ARINAS
            </span>
          </Link>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">

              {/* Contact */}
              <section className="bg-white border border-[#E4E4E7] p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-6 h-6 bg-[#0A0A0A] text-white text-[10px] flex items-center justify-center font-medium">1</span>
                  <h2 className="text-sm tracking-[0.2em] uppercase font-medium">Contact Information</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input name="email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)}
                      placeholder="your@email.com" required className={inputClass} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>First Name</label>
                      <input value={form.firstName} onChange={(e) => set("firstName", e.target.value)}
                        placeholder="First name" required className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Last Name</label>
                      <input value={form.lastName} onChange={(e) => set("lastName", e.target.value)}
                        placeholder="Last name" required className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Phone (optional)</label>
                    <input value={form.phone} onChange={(e) => set("phone", e.target.value)}
                      placeholder="+33 1 23 45 67 89" className={inputClass} />
                  </div>
                </div>
              </section>

              {/* Shipping */}
              <section className="bg-white border border-[#E4E4E7] p-6 lg:p-8">
                <div className="flex items-center gap-2 mb-5">
                  <span className="w-6 h-6 bg-[#0A0A0A] text-white text-[10px] flex items-center justify-center font-medium">2</span>
                  <h2 className="text-sm tracking-[0.2em] uppercase font-medium">Shipping Address</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className={labelClass}>Street Address</label>
                    <input value={form.address} onChange={(e) => set("address", e.target.value)}
                      placeholder="123 Rue de la Paix" required className={inputClass} />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <label className={labelClass}>City</label>
                      <input value={form.city} onChange={(e) => set("city", e.target.value)}
                        placeholder="Paris" required className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>ZIP</label>
                      <input value={form.zip} onChange={(e) => set("zip", e.target.value)}
                        placeholder="75001" required className={inputClass} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Country</label>
                    <select value={form.country} onChange={(e) => set("country", e.target.value)}
                      className={inputClass}>
                      <option>France</option>
                      <option>United Kingdom</option>
                      <option>United States</option>
                      <option>UAE</option>
                      <option>Saudi Arabia</option>
                      <option>Qatar</option>
                      <option>Kuwait</option>
                    </select>
                  </div>
                </div>

                {/* Shipping Methods */}
                <div className="mt-5 space-y-2">
                  <label className={labelClass}>Shipping Method</label>
                  {[
                    { id: "standard", label: "Standard Shipping", sub: "5-7 business days", price: subtotal > 500 ? "Free" : "$35" },
                    { id: "express", label: "Express Shipping", sub: "2-3 business days", price: "$25" },
                    { id: "overnight", label: "Overnight Delivery", sub: "Next business day", price: "$65" },
                  ].map((method) => (
                    <label key={method.id} className="flex items-center gap-3 border border-[#E4E4E7] p-4 cursor-pointer hover:border-[#B89A6A] transition-colors">
                      <input type="radio" name="shipping" defaultChecked={method.id === "standard"} className="accent-[#B89A6A]" />
                      <Truck size={15} className="text-[#B89A6A]" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#0A0A0A]">{method.label}</p>
                        <p className="text-[11px] text-[#8A8680]">{method.sub}</p>
                      </div>
                      <span className="text-sm font-medium text-[#0A0A0A]">{method.price}</span>
                    </label>
                  ))}
                </div>
              </section>

              {/* Gift */}
              <section className="bg-white border border-[#E4E4E7] p-6 lg:p-8">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.giftWrap}
                    onChange={(e) => set("giftWrap", e.target.checked)}
                    className="w-4 h-4 accent-[#B89A6A]"
                  />
                  <Gift size={15} className="text-[#B89A6A]" />
                  <span className="text-sm font-medium">Add gift wrapping (+$12)</span>
                </label>
                {form.giftWrap && (
                  <div className="mt-4">
                    <label className={labelClass}>Gift Message (optional)</label>
                    <textarea
                      value={form.giftMessage}
                      onChange={(e) => set("giftMessage", e.target.value)}
                      placeholder="Write your personal message..."
                      rows={3}
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                )}
              </section>

              {/* Payment */}
              <section className="bg-white border border-[#E4E4E7] p-6 lg:p-8">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 bg-[#0A0A0A] text-white text-[10px] flex items-center justify-center font-medium">3</span>
                    <h2 className="text-sm tracking-[0.2em] uppercase font-medium">Payment</h2>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-[#8A8680]">
                    <Lock size={11} className="text-[#B89A6A]" />
                    SSL Secured
                  </div>
                </div>

                {/* Payment Method Tabs */}
                <div className="flex gap-3 mb-5">
                  {([
                    { key: "card", icon: CreditCard, label: "Card" },
                    { key: "applepay", icon: Smartphone, label: "Apple Pay" },
                    { key: "paypal", icon: Shield, label: "PayPal" },
                  ] as const).map(({ key, icon: Icon, label }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPaymentMethod(key)}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 border-2 transition-all text-xs tracking-wider ${
                        paymentMethod === key
                          ? "border-[#B89A6A] text-[#B89A6A] bg-[#FAF9F7]"
                          : "border-[#E4E4E7] text-[#8A8680] hover:border-[#0A0A0A]"
                      }`}
                    >
                      <Icon size={14} />
                      {label}
                    </button>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Card Number</label>
                      <input value={form.cardNumber} onChange={(e) => set("cardNumber", e.target.value)}
                        placeholder="1234 5678 9012 3456" className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Name on Card</label>
                      <input value={form.cardName} onChange={(e) => set("cardName", e.target.value)}
                        placeholder="As it appears on card" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Expiry Date</label>
                        <input value={form.cardExpiry} onChange={(e) => set("cardExpiry", e.target.value)}
                          placeholder="MM / YY" className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Security Code</label>
                        <input value={form.cardCvc} onChange={(e) => set("cardCvc", e.target.value)}
                          placeholder="CVC" className={inputClass} />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === "applepay" && (
                  <div className="text-center py-8 text-sm text-[#8A8680]">
                    <Smartphone size={32} className="mx-auto mb-3 text-[#8A8680]" />
                    Apple Pay will be confirmed at checkout
                  </div>
                )}

                {paymentMethod === "paypal" && (
                  <div className="text-center py-8 text-sm text-[#8A8680]">
                    <Shield size={32} className="mx-auto mb-3 text-[#8A8680]" />
                    You will be redirected to PayPal to complete payment
                  </div>
                )}
              </section>

              {/* Submit */}
              <button
                type="submit"
                className="w-full bg-[#B89A6A] text-white text-[11px] tracking-[0.3em] uppercase py-5 hover:bg-[#B8963A] transition-colors flex items-center justify-center gap-3 font-medium"
              >
                <Lock size={14} />
                Place Order - ${total.toLocaleString()}
              </button>

              <p className="text-[10px] text-[#8A8680] text-center flex items-center justify-center gap-1.5">
                <Shield size={11} className="text-[#B89A6A]" />
                Your personal data is protected by 256-bit SSL encryption
              </p>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-[222px]">
                {/* Mobile Toggle */}
                <button
                  type="button"
                  className="lg:hidden w-full flex items-center justify-between bg-[#F5F2EC] border border-[#E4E4E7] px-5 py-4 mb-4"
                  onClick={() => setSummaryExpanded(!summaryExpanded)}
                >
                  <span className="text-[11px] tracking-[0.2em] uppercase font-medium flex items-center gap-2">
                    <ChevronDown size={14} className={`transition-transform ${summaryExpanded ? "rotate-180" : ""}`} />
                    Order Summary
                  </span>
                  <span className="text-sm font-medium">${total.toLocaleString()}</span>
                </button>

                <div className={`bg-white border border-[#E4E4E7] ${!summaryExpanded ? "hidden lg:block" : "block"}`}>
                  <div className="p-6 border-b border-[#F0EBE3]">
                    <h3 className="text-[11px] tracking-[0.2em] uppercase font-medium text-[#0A0A0A] mb-4">Order Summary</h3>

                    <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                      {state.cart.map((item) => (
                        <div key={`${item.id}-${item.selectedSize}`} className="flex gap-3">
                          <div className="relative w-16 h-20 flex-shrink-0 bg-[#F5F2EC]">
                            <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#0A0A0A] text-white text-[9px] rounded-full flex items-center justify-center font-medium">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-[#0A0A0A] line-clamp-2 leading-snug">{item.name}</p>
                            {item.selectedSize && <p className="text-[10px] text-[#8A8680] mt-0.5">Size: {item.selectedSize}</p>}
                          </div>
                          <p className="text-xs font-medium text-[#0A0A0A] flex-shrink-0">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Coupon */}
                  <div className="p-6 border-b border-[#F0EBE3]">
                    {state.couponCode ? (
                      <div className="flex items-center justify-between bg-[#FAF9F7] border border-[#B89A6A]/30 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Tag size={13} className="text-[#B89A6A]" />
                          <span className="text-[11px] font-medium text-[#B89A6A]">{state.couponCode}</span>
                          <span className="text-[10px] text-[#8A8680]">({state.couponDiscount}% off)</span>
                        </div>
                        <button type="button" onClick={() => dispatch({ type: "REMOVE_COUPON" })}
                          className="text-[#8A8680] hover:text-[#0A0A0A] transition-colors">
                          <X size={14} />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <label className={labelClass}>Promo Code</label>
                        <div className="flex gap-0">
                          <input
                            type="text"
                            value={couponInput}
                            onChange={(e) => { setCouponInput(e.target.value); setCouponError(""); }}
                            placeholder="Enter code"
                            className="flex-1 border border-[#E4E4E7] bg-white px-4 py-2.5 text-xs focus:outline-none focus:border-[#B89A6A] transition-colors"
                          />
                          <button
                            type="button"
                            onClick={applyCoupon}
                            className="bg-[#0A0A0A] text-white text-[10px] tracking-wider uppercase px-4 py-2.5 hover:bg-[#B89A6A] transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                        {couponError && <p className="text-[10px] text-red-500 mt-1">{couponError}</p>}
                        <p className="text-[10px] text-[#8A8680] mt-1.5">Try: ARINAS10, LUXURY20, VIP30</p>
                      </div>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between text-xs text-[#8A8680]">
                      <span>Subtotal</span>
                      <span>${subtotal.toLocaleString()}</span>
                    </div>
                    {discount > 0 && (
                      <div className="flex justify-between text-xs text-[#B89A6A]">
                        <span>Discount ({state.couponDiscount}%)</span>
                        <span>-${discount.toLocaleString()}</span>
                      </div>
                    )}
                    {form.giftWrap && (
                      <div className="flex justify-between text-xs text-[#8A8680]">
                        <span>Gift Wrapping</span>
                        <span>$12</span>
                      </div>
                    )}
                    <div className="flex justify-between text-xs text-[#8A8680]">
                      <span>Shipping</span>
                      <span className={shipping === 0 ? "text-[#B89A6A]" : ""}>{shipping === 0 ? "Free" : `$${shipping}`}</span>
                    </div>
                    <div className="flex justify-between font-medium border-t border-[#F0EBE3] pt-3">
                      <span className="text-sm">Total</span>
                      <span className="text-base">${(total + (form.giftWrap ? 12 : 0)).toLocaleString()}</span>
                    </div>
                  </div>

                  {/* Security */}
                  <div className="px-6 pb-6">
                    <div className="bg-[#FAF9F7] p-4 space-y-2">
                      {[
                        "256-bit SSL encryption",
                        "Stripe secure payments",
                        "30-day free returns",
                      ].map((item) => (
                        <p key={item} className="flex items-center gap-2 text-[10px] text-[#8A8680]">
                          <Check size={11} className="text-[#B89A6A]" />
                          {item}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
