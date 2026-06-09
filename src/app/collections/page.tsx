"use client";

import Link from "next/link";
import Image from "next/image";
import { collections } from "@/lib/data";
import { useT } from "@/i18n/provider";

export default function CollectionsPage() {
  const t = useT();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="pt-16 pb-16 lg:pt-20 lg:pb-20 px-6 lg:px-14 max-w-[1680px] mx-auto">
        <p className="f-label text-[#B89A6A] mb-5" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
          {t("collectionsPage.eyebrow")}
        </p>
        <h1 className="f-display text-[#0A0A0A]" style={{ fontSize: "clamp(52px,7vw,100px)" }}>
          {t("collectionsPage.title")}
        </h1>
      </div>

      {/* Full-bleed grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
        {collections.map((col, i) => (
          <Link
            key={col.id}
            href={`/collections/${col.id}`}
            className="group relative overflow-hidden block"
            style={{ aspectRatio: "4/3" }}
          >
            <Image
              src={col.image}
              alt={col.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="img-cover transition-all duration-[1.6s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]"
              style={{ filter: "brightness(0.55)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-end p-10 lg:p-14">
              <p className="f-label text-[#B89A6A] mb-3" style={{ fontSize: "9px", letterSpacing: "0.25em" }}>
                {String(i + 1).padStart(2, "0")} — {col.count} {t("collectionsPage.pieces")}
              </p>
              <h2 className="f-display text-white mb-3" style={{ fontSize: "clamp(28px,4vw,52px)" }}>
                {t(`collectionsPage.${col.id}.name`, col.name)}
              </h2>
              <p
                className="f-editorial text-white/60 mb-5 transition-all duration-500 group-hover:text-white/80"
                style={{ fontSize: "15px" }}
              >
                {t(`collectionsPage.${col.id}.description`, col.description)}
              </p>
              <div
                className="f-label text-white/70 group-hover:text-white flex items-center gap-3 transition-all duration-500"
                style={{ fontSize: "9px", letterSpacing: "0.25em" }}
              >
                <span className="w-6 h-px bg-current" />
                {t("collectionsPage.explore")}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
