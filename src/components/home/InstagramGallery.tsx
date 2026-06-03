"use client";

import { instagramPosts } from "@/lib/data";
import Image from "next/image";

export default function InstagramGallery() {
  return (
    <section className="py-28 lg:py-36 bg-[#FAF9F7]">
      <div className="max-w-[1680px] mx-auto px-6 lg:px-14">
        {/* Header */}
        <div className="mb-16 grid lg:grid-cols-2 items-end gap-8">
          <div>
            <p className="f-label text-[#B89A6A] mb-4" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
              The Journal
            </p>
            <h2 className="f-display text-[#0A0A0A]" style={{ fontSize: "clamp(42px,5vw,72px)" }}>
              @ARINAS
            </h2>
          </div>
          <p className="f-body lg:max-w-xs lg:ml-auto" style={{ fontSize: "13px" }}>
            Portraits of the pieces in motion - worn, lived in, and loved.
          </p>
        </div>

        {/* Gallery ? asymmetric grid */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-1">
          {instagramPosts.slice(0, 6).map((image, i) => (
            <a
              key={i}
              href="#"
              className="group relative overflow-hidden block"
              style={{ aspectRatio: i === 0 || i === 3 ? "1/1" : "1/1" }}
            >
              <Image
                src={image}
                alt={`ARINAS ${i + 1}`}
                fill
                sizes="(min-width: 1024px) 16vw, 33vw"
                className="img-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-[#0A0A0A]/0 group-hover:bg-[#0A0A0A]/30 transition-colors duration-700" />
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 flex items-center gap-4">
          <div className="h-px flex-1 bg-[#0A0A0A]/10" />
          <a
            href="#"
            className="f-label text-[#8A8680] hover:text-[#0A0A0A] transition-colors"
            style={{ fontSize: "9px", letterSpacing: "0.3em" }}
          >
            Follow on Instagram
          </a>
          <div className="h-px flex-1 bg-[#0A0A0A]/10" />
        </div>
      </div>
    </section>
  );
}
