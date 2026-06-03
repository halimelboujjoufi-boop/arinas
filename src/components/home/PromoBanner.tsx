"use client";

import Link from "next/link";

// Campaign statement — brand manifesto, not a sale banner
export default function PromoBanner() {
  return (
    <section className="relative overflow-hidden" style={{ height: "70vh", minHeight: "500px" }}>
      <img
        src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=90"
        alt="ARINAS Campaign"
        className="img-cover"
        style={{ transform: "scale(1.02)" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60" />

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <p className="f-label text-white/50 mb-8" style={{ fontSize: "9px", letterSpacing: "0.4em" }}>
          Autumn — Winter 2025
        </p>

        <h2
          className="f-display text-white mb-8"
          style={{ fontSize: "clamp(52px,8vw,120px)", lineHeight: 0.9 }}
        >
          The New
          <br />
          <span className="f-editorial">Season</span>
        </h2>

        <Link
          href="/collections"
          className="f-label text-white/80 hover:text-white transition-colors border-b border-white/30 hover:border-white pb-0.5"
          style={{ fontSize: "10px", letterSpacing: "0.28em" }}
        >
          Discover the Collection
        </Link>
      </div>
    </section>
  );
}
