"use client";

import Link from "next/link";
import Image from "next/image";
import { collections } from "@/lib/data";
import { useState } from "react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function CollectionsSection() {
  const [active, setActive] = useState<string | null>(null);

  return (
    <section className="bg-[#0A0A0A] py-28 lg:py-36">
      <div className="max-w-[1680px] mx-auto px-6 lg:px-14">
        <div className="mb-20">
          <ScrollReveal delay={0}>
            <p className="f-label text-[#B89A6A] mb-5" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
              The House
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="f-display text-white" style={{ fontSize: "clamp(48px,6vw,88px)" }}>
              Collections
            </h2>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
          {collections.map((col, i) => (
            <ScrollReveal key={col.id} delay={i * 80} direction="up">
              <Link
                href={`/collections/${col.id}`}
                className="group relative overflow-hidden block"
                style={{ aspectRatio: "2/3" }}
                onMouseEnter={() => setActive(col.id)}
                onMouseLeave={() => setActive(null)}
              >
                <Image
                  src={col.image}
                  alt={col.name}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="img-cover transition-all duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)]"
                  style={{
                    transform: active === col.id ? "scale(1.08)" : "scale(1.02)",
                    filter: active === col.id ? "brightness(0.75)" : "brightness(0.5)",
                  }}
                />

                <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-8">
                  <div>
                    <p
                      className="f-label text-white/40 mb-2 transition-colors duration-300 group-hover:text-[#B89A6A]"
                      style={{ fontSize: "9px", letterSpacing: "0.25em" }}
                    >
                      {String(i + 1).padStart(2, "0")} / {col.count} Pieces
                    </p>
                    <h3
                      className="f-display text-white transition-all duration-500"
                      style={{
                        fontSize: "clamp(22px,2.5vw,34px)",
                        transform: active === col.id ? "translateY(-4px)" : "translateY(0)",
                      }}
                    >
                      {col.name}
                    </h3>
                    <p
                      className="f-editorial text-white/50 text-sm mt-1 transition-all duration-500"
                      style={{
                        opacity: active === col.id ? 1 : 0,
                        transform: active === col.id ? "translateY(0)" : "translateY(8px)",
                      }}
                    >
                      {col.description}
                    </p>
                    <div
                      className="mt-4 transition-all duration-500"
                      style={{ opacity: active === col.id ? 1 : 0 }}
                    >
                      <span className="f-label text-[#B89A6A]" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>
                        Explore
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
