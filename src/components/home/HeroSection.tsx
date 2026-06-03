"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1920&q=95",
    title: ["Quiet", "Luxury"],
    sub: "Summer Collection 2025",
    align: "left" as const,
  },
  {
    src: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=1920&q=95",
    title: ["The Art", "of Less"],
    sub: "Limited Edition",
    align: "right" as const,
  },
  {
    src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=95",
    title: ["Dressed", "in Light"],
    sub: "New Arrivals",
    align: "center" as const,
  },
];

export default function HeroSection() {
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => {
      const timer = setInterval(() => {
        setIdx((i) => (i + 1) % SLIDES.length);
      }, 6500);
      return () => clearInterval(timer);
    }, 1000);
    return () => clearTimeout(t);
  }, []);

  const slide = SLIDES[idx];
  const alignMap = {
    left:   "items-start justify-end pb-20 lg:pb-28 px-8 lg:px-20",
    right:  "items-end   justify-end pb-20 lg:pb-28 px-8 lg:px-20",
    center: "items-center justify-center px-8 lg:px-20",
  };

  return (
    <section dir="ltr" className="relative w-full h-screen min-h-[600px] overflow-hidden bg-[#0A0A0A] -mt-[128px] lg:-mt-[206px]">
      {/* Images ? crossfade */}
      {SLIDES.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 transition-opacity duration-1500"
          style={{
            opacity: i === idx ? 1 : 0,
            transitionDuration: "1400ms",
            transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)",
          }}
        >
          <Image
            src={s.src}
            alt={s.title.join(" ")}
            fill
            priority={i === 0}
            sizes="100vw"
            className="img-cover"
            style={{
              transform: i === idx ? "scale(1)" : "scale(1.04)",
              transition: "transform 7s ease-out",
            }}
          />
          {/* Gradient ? bottom and slight top fade */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-black/20" />
        </div>
      ))}

      {/* Content */}
      <div className={`relative z-10 h-full flex flex-col ${alignMap[slide.align]} pt-20`}>
        {/* maxWidth in vw guarantees the box itself never exceeds the screen */}
        <div
          style={{
            opacity: 1,
            transition: "opacity 1s ease",
            maxWidth: "min(540px, calc(100vw - 64px))",
            textAlign: slide.align === "right" ? "right" : slide.align === "center" ? "center" : "left",
          }}
        >
          {/* Season Label */}
          <p
            className="f-label text-white/50 mb-6"
            style={{ fontSize: "9px", letterSpacing: "0.35em" }}
          >
            {slide.sub}
          </p>

          {/* Main Title ? font scales with the box, never overflows */}
          <div className="mb-8">
            {slide.title.map((word, wi) => (
              <h1
                key={wi}
                className="f-display text-white block"
                style={{
                  fontSize: "clamp(40px, 5.5vw, 88px)",
                  lineHeight: 0.96,
                }}
              >
                {word}
              </h1>
            ))}
          </div>

          {/* CTA */}
          <div
            style={{
              display: "flex",
              gap: "20px",
              justifyContent: slide.align === "right" ? "flex-end" : slide.align === "center" ? "center" : "flex-start",
            }}
          >
            <Link
              href="/collections"
              className="f-label inline-block max-w-full text-white/80 hover:text-white transition-colors border-b border-white/30 hover:border-white pb-0.5 leading-relaxed"
              style={{ fontSize: "10px", letterSpacing: "0.16em", overflowWrap: "anywhere" }}
            >
              Discover the Collection
            </Link>
          </div>
        </div>
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-8 right-10 z-10 hidden lg:flex items-center gap-3">
        <span className="f-label text-white/30" style={{ fontSize: "9px" }}>
          {String(idx + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
        </span>
        <div className="flex gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setIdx(i)}
              className={`transition-all duration-500 rounded-full ${
                i === idx ? "w-6 h-0.5 bg-white" : "w-1.5 h-0.5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-10 z-10 hidden lg:flex flex-col items-center gap-2">
        <div className="w-px h-10 bg-white/20 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 w-full bg-white/60"
            style={{ animation: "scrollIndicator 2.5s ease-in-out infinite", height: "40%" }}
          />
        </div>
        <p className="f-label text-white/30" style={{ fontSize: "8px", letterSpacing: "0.3em", writingMode: "vertical-rl" }}>
          SCROLL
        </p>
      </div>

      <style jsx>{`
        @keyframes scrollIndicator {
          0% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(250%); opacity: 0; }
        }
      `}</style>
    </section>
  );
}
