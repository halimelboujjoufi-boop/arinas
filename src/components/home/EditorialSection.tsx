"use client";

import Link from "next/link";
import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function EditorialSection() {
  return (
    <section className="relative">
      {/* Full-bleed campaign image */}
      <div className="relative w-full overflow-hidden" style={{ height: "85vh", minHeight: "600px" }}>
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1920&q=90"
          alt="The Edit"
          fill
          sizes="100vw"
          className="img-cover"
          style={{ transform: "scale(1.02)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="px-10 lg:px-20 max-w-2xl">
            <ScrollReveal delay={200} direction="fade">
              <p className="f-label text-white/40 mb-8" style={{ fontSize: "9px", letterSpacing: "0.35em" }}>
                The Summer Edit / 2025
              </p>
            </ScrollReveal>

            <div className="overflow-hidden mb-6">
              <ScrollReveal delay={300} direction="up">
                <h2
                  className="f-display text-white"
                  style={{ fontSize: "clamp(52px, 7vw, 100px)", lineHeight: 0.9 }}
                >
                  Dressed<br />
                  <span className="f-editorial" style={{ fontSize: "clamp(52px, 7vw, 100px)" }}>in Light</span>
                </h2>
              </ScrollReveal>
            </div>

            <ScrollReveal delay={450} direction="up">
              <p className="f-body text-white/60 mb-10 max-w-sm" style={{ lineHeight: 1.8, fontSize: "13px" }}>
                A collection that moves between morning light and evening shadow -
                refined pieces that speak without announcement.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={580} direction="fade">
              <Link
                href="/collections"
                className="inline-flex items-center gap-4 f-label text-white/70 hover:text-white transition-colors group"
                style={{ fontSize: "10px", letterSpacing: "0.28em" }}
              >
                <span className="w-8 h-px bg-white/40 group-hover:bg-white group-hover:w-12 transition-all duration-500" />
                Explore the Collection
              </Link>
            </ScrollReveal>
          </div>
        </div>

        <div className="absolute bottom-6 right-8 text-right hidden lg:block">
          <p className="f-label text-white/25" style={{ fontSize: "8px", letterSpacing: "0.2em" }}>
            Campaign - Paris, June 2025
          </p>
        </div>
      </div>

      {/* Magazine pull-quote */}
      <div className="bg-[#FAF9F7] py-24 px-6 lg:px-14">
        <div className="max-w-[1680px] mx-auto grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2">
            <ScrollReveal delay={0}>
              <blockquote
                className="f-editorial text-[#0A0A0A]"
                style={{ fontSize: "clamp(26px,3vw,42px)", lineHeight: 1.2 }}
              >
                &ldquo;True luxury is not the accumulation of things,
                <br className="hidden lg:block" />
                but the refinement of the singular.&rdquo;
              </blockquote>
            </ScrollReveal>
          </div>
          <div className="flex flex-col justify-end lg:pt-6">
            <ScrollReveal delay={200} direction="left">
              <p className="f-label text-[#B89A6A] mb-3" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>
                From the Atelier
              </p>
              <p className="f-body" style={{ fontSize: "12px", lineHeight: 1.8 }}>
                Each ARINAS piece begins with a question: what is essential?
                What remains when everything superfluous is removed?
                The answer is always the same: something rare and true.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
