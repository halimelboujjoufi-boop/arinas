"use client";

import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-[#0A0A0A] text-white">
      {/* Upper ? brand statement + newsletter */}
      <div className="max-w-[1680px] mx-auto px-6 lg:px-14 pt-24 pb-16">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24">
          {/* Brand */}
          <div className="lg:col-span-5">
            <Link href="/">
              <span
                className="f-display text-white"
                style={{ fontSize: "clamp(32px,4vw,56px)", letterSpacing: "0.5em" }}
              >
                ARINAS
              </span>
            </Link>
            <p className="f-body mt-6 max-w-xs" style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.8 }}>
              A house built on the premise that true luxury lies in the singular, the rare, and the enduring.
            </p>

            {/* Social ? minimal text */}
            <div className="flex gap-5 mt-8">
              {["IG", "FB", "X", "YT"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="f-label text-white/30 hover:text-white transition-colors"
                  style={{ fontSize: "9px", letterSpacing: "0.2em" }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-10">
            <div>
              <p className="f-label text-[#B89A6A] mb-7" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
                The House
              </p>
              <ul className="space-y-4">
                {["New Arrivals", "Collections", "The Edit", "Lookbook", "Atelier"].map((item) => (
                  <li key={item}>
                    <Link
                      href="/shop"
                      className="f-label text-white/40 hover:text-white transition-colors"
                      style={{ fontSize: "10px", letterSpacing: "0.12em" }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="f-label text-[#B89A6A] mb-7" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
                Client Care
              </p>
              <ul className="space-y-4">
                {["Size Guide", "Shipping", "Returns", "Authenticity", "Contact"].map((item) => (
                  <li key={item}>
                    <Link
                      href="/contact"
                      className="f-label text-white/40 hover:text-white transition-colors"
                      style={{ fontSize: "10px", letterSpacing: "0.12em" }}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="lg:col-span-3">
            <p className="f-label text-[#B89A6A] mb-7" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
              The Circle
            </p>
            <p className="f-body mb-6" style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>
              Private access to new arrivals and exclusive events.
            </p>
            {submitted ? (
              <p className="f-label text-[#B89A6A]" style={{ fontSize: "10px", letterSpacing: "0.2em" }}>
                Welcome to the Circle.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  required
                  className="w-full bg-transparent border-b border-white/20 py-2.5 text-white placeholder-white/25 focus:outline-none focus:border-white/50 transition-colors f-label"
                  style={{ fontSize: "11px", letterSpacing: "0.08em" }}
                />
                <button
                  type="submit"
                  className="f-label text-[#B89A6A] hover:text-white transition-colors"
                  style={{ fontSize: "9px", letterSpacing: "0.25em" }}
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Divider with address */}
      <div className="border-t border-white/[0.07]">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-14 py-6 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <p className="f-label text-white/25" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>
            2025 ARINAS - 12 Rue de la Paix, Paris
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <a
                key={item}
                href="#"
                className="f-label text-white/25 hover:text-white/60 transition-colors"
                style={{ fontSize: "9px", letterSpacing: "0.15em" }}
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex gap-3">
            {["VISA", "MC", "AMEX"].map((card) => (
              <span
                key={card}
                className="f-label text-white/20 border border-white/[0.08] px-2 py-0.5"
                style={{ fontSize: "8px", letterSpacing: "0.1em" }}
              >
                {card}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
