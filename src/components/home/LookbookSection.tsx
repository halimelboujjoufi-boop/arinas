"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { lookbookItems } from "@/lib/data";
import { useStore } from "@/lib/store";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function LookbookSection() {
  const [active, setActive] = useState(0);
  const { dispatch } = useStore();
  const item = lookbookItems[active];

  return (
    <section className="py-0">
      <div className="grid lg:grid-cols-2 min-h-[90vh]">
        {/* Image side */}
        <div className="relative overflow-hidden bg-[#0A0A0A] order-2 lg:order-1" style={{ minHeight: "60vh" }}>
          {lookbookItems.map((look, i) => (
            <Image
              key={look.id}
              src={look.image}
              alt={look.title}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="img-cover absolute inset-0 transition-opacity duration-1000"
              style={{ opacity: i === active ? 1 : 0, transform: "scale(1.02)" }}
            />
          ))}
          <div className="absolute inset-0 bg-black/20" />

          <div className="absolute bottom-8 left-8 flex gap-3">
            {lookbookItems.map((_, i) => (
              <button
                key={i}
                aria-label={`Show look ${i + 1}`}
                onClick={() => setActive(i)}
                className={`transition-all duration-400 ${
                  i === active ? "w-10 h-0.5 bg-white" : "w-3 h-0.5 bg-white/30 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content side */}
        <div className="bg-[#FAF9F7] flex flex-col justify-center px-6 py-12 lg:px-20 lg:py-20 order-1 lg:order-2">
          <ScrollReveal delay={0}>
            <p className="f-label text-[#B89A6A] mb-8" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
              The Lookbook / Look {String(active + 1).padStart(2, "0")}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <h2
              className="f-display text-[#0A0A0A] mb-4"
              style={{ fontSize: "clamp(36px, 4vw, 58px)" }}
            >
              {item.title}
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={180}>
            <p className="f-editorial text-[#8A8680] mb-10 text-lg">{item.subtitle}</p>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <p className="f-body mb-12" style={{ maxWidth: "380px" }}>
              A studied composition of form and restraint.
              Each piece selected for how it speaks to the whole -
              never competing, always completing.
            </p>
          </ScrollReveal>

          <div className="space-y-5 mb-12">
            {item.products.map((product, i) => (
              <ScrollReveal key={product.id} delay={300 + i * 80}>
                <div className="flex items-center gap-4 group">
                  <Link href={`/product/${product.id}`} className="relative w-14 overflow-hidden bg-[#EDE8DF] flex-shrink-0 block" style={{ height: "72px" }}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="img-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </Link>
                  <div className="flex-1 min-w-0 pr-2">
                    <Link href={`/product/${product.id}`}>
                      <p className="f-label text-[#0A0A0A] group-hover:text-[#B89A6A] transition-colors truncate" style={{ fontSize: "11px", letterSpacing: "0.12em" }}>
                        {product.name}
                      </p>
                    </Link>
                    <p className="f-label text-[#8A8680] mt-0.5 whitespace-nowrap" style={{ fontSize: "10px" }}>
                      ${product.price.toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => dispatch({ type: "ADD_TO_CART", payload: { ...product, quantity: 1 } })}
                    className="f-label text-[#8A8680] hover:text-[#0A0A0A] transition-colors flex-shrink-0"
                    style={{ fontSize: "9px", letterSpacing: "0.2em" }}
                  >
                    Add
                  </button>
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={500} direction="fade">
            <Link
              href="/collections"
              className="f-label text-[#0A0A0A] hover:text-[#B89A6A] transition-colors flex items-center gap-2"
              style={{ fontSize: "10px", letterSpacing: "0.22em" }}
            >
              View Full Lookbook <ArrowRight size={12} strokeWidth={1.5} />
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
