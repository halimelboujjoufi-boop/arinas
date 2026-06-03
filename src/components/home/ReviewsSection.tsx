"use client";

import { useState } from "react";
import { reviews } from "@/lib/data";
import Image from "next/image";
import ScrollReveal from "@/components/ui/ScrollReveal";

export default function ReviewsSection() {
  const [active, setActive] = useState(0);
  const review = reviews[active];

  return (
    <section className="py-28 lg:py-36 bg-[#0A0A0A]">
      <div className="max-w-[1680px] mx-auto px-6 lg:px-14">
        <div className="mb-20">
          <ScrollReveal delay={0}>
            <p className="f-label text-[#B89A6A] mb-5" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
              Voices
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="f-display text-white" style={{ fontSize: "clamp(42px,5vw,72px)" }}>
              Client Stories
            </h2>
          </ScrollReveal>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <ScrollReveal delay={200} direction="up">
              <blockquote
                className="f-editorial text-white"
                style={{ fontSize: "clamp(22px,3vw,38px)", lineHeight: 1.3 }}
              >
                &ldquo;{review.comment}&rdquo;
              </blockquote>
            </ScrollReveal>

            <ScrollReveal delay={350} direction="fade">
              <div className="mt-10 flex items-center gap-6">
                <div className="relative w-10 h-10 overflow-hidden bg-[#1A1A1A]">
                  <Image src={review.avatar} alt={review.name} fill sizes="40px" className="img-cover" />
                </div>
                <div>
                  <p className="f-label text-white" style={{ fontSize: "10px", letterSpacing: "0.15em" }}>
                    {review.name}
                  </p>
                  <p className="f-label text-[#8A8680] mt-0.5" style={{ fontSize: "9px", letterSpacing: "0.12em" }}>
                    {review.location}
                  </p>
                </div>
                <div className="ml-auto">
                  <p className="f-label text-[#B89A6A]" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>
                    {review.date}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-4 lg:pl-12 lg:border-l lg:border-white/10">
            <ScrollReveal delay={150} direction="left">
              <div className="flex gap-3 mb-12">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    aria-label={`Show review ${i + 1}`}
                    onClick={() => setActive(i)}
                    className={`transition-all duration-400 ${
                      i === active ? "w-10 h-0.5 bg-white" : "w-3 h-0.5 bg-white/20 hover:bg-white/50"
                    }`}
                  />
                ))}
              </div>

              <div className="space-y-8">
                {[
                  { number: "50K+", label: "Clients Worldwide" },
                  { number: "150+", label: "Exclusive Brands" },
                  { number: "12", label: "Years of Curation" },
                ].map((stat, i) => (
                  <ScrollReveal key={stat.label} delay={300 + i * 100} direction="left">
                    <div>
                      <p className="f-display text-white" style={{ fontSize: "clamp(32px,3vw,48px)" }}>
                        {stat.number}
                      </p>
                      <p className="f-label text-[#8A8680] mt-1" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>
                        {stat.label}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
