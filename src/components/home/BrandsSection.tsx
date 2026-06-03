"use client";

import { brands } from "@/lib/data";

export default function BrandsSection() {
  const doubled = [...brands, ...brands];

  return (
    <section className="py-14 border-y border-[#0A0A0A]/[0.06] bg-white overflow-hidden">
      {/* Label */}
      <div className="text-center mb-10">
        <p className="f-label text-[#8A8680]" style={{ fontSize: "9px", letterSpacing: "0.35em" }}>
          Our House
        </p>
      </div>

      {/* Marquee */}
      <div className="relative flex overflow-hidden select-none">
        <div
          className="flex gap-16 whitespace-nowrap"
          style={{ animation: "brandMarquee 32s linear infinite" }}
        >
          {doubled.map((brand, i) => (
            <div key={i} className="flex-none text-center">
              <p
                className="f-display text-[#0A0A0A]/20 hover:text-[#B89A6A] transition-colors duration-500 cursor-default"
                style={{ fontSize: "clamp(18px, 2vw, 26px)", letterSpacing: "0.18em" }}
              >
                {brand.name}
              </p>
              <p
                className="f-label text-[#0A0A0A]/10 mt-1"
                style={{ fontSize: "8px", letterSpacing: "0.22em" }}
              >
                {brand.tagline}
              </p>
            </div>
          ))}
        </div>

        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-24 pointer-events-none" style={{ background: "linear-gradient(to right, white, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-24 pointer-events-none" style={{ background: "linear-gradient(to left, white, transparent)" }} />
      </div>

      <style jsx>{`
        @keyframes brandMarquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}
