import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Full-bleed hero */}
      <div className="relative overflow-hidden bg-[#0A0A0A] -mt-[128px] lg:-mt-[206px]" style={{ height: "calc(80vh + 206px)", minHeight: "560px" }}>
        <img
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=90"
          alt="The Maison"
          className="img-cover"
          style={{ opacity: 0.6, transform: "scale(1.02)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/50" />

        <div className="absolute inset-0 flex flex-col justify-end pb-20 px-10 lg:px-20">
          <p className="f-label text-white/50 mb-6" style={{ fontSize: "9px", letterSpacing: "0.4em" }}>
            Est. Paris — 2015
          </p>
          <h1
            className="f-display text-white"
            style={{ fontSize: "clamp(52px,8vw,120px)", lineHeight: 0.9 }}
          >
            The
            <br />
            <span className="f-editorial">Maison</span>
          </h1>
        </div>
      </div>

      {/* Manifesto */}
      <div className="max-w-[1680px] mx-auto px-6 lg:px-14 py-28 lg:py-36">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-5">
            <p className="f-label text-[#B89A6A] mb-8" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
              Our Philosophy
            </p>
            <blockquote
              className="f-editorial text-[#0A0A0A]"
              style={{ fontSize: "clamp(26px,3.5vw,44px)", lineHeight: 1.2 }}
            >
              &ldquo;What remains when everything superfluous is removed? Something rare and true.&rdquo;
            </blockquote>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <div className="space-y-6 f-body" style={{ lineHeight: 1.9 }}>
              <p>
                ARINAS was founded in Paris with a singular vision: to create a destination where
                true connoisseurs of fashion could discover pieces that transcend mere clothing to
                become wearable art.
              </p>
              <p>
                Our founder, inspired by decades spent in the ateliers of the world&apos;s most
                prestigious fashion houses, established the Maison to bridge the gap between
                haute couture and accessible luxury.
              </p>
              <p>
                Every piece is selected with meticulous care — each garment a story of
                unparalleled craftsmanship, chosen not for trend, but for permanence.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial image + values */}
      <div className="bg-[#0A0A0A] py-28 lg:py-36">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-14">
          <p className="f-label text-[#B89A6A] mb-16" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
            The Pillars
          </p>
          <div className="grid md:grid-cols-3 gap-12 lg:gap-20">
            {[
              {
                num: "01",
                title: "Curation",
                body: "Every piece is chosen against a single question: is it essential? We accept only what answers yes.",
              },
              {
                num: "02",
                title: "Craft",
                body: "We work exclusively with ateliers and designers who share our conviction that execution is everything.",
              },
              {
                num: "03",
                title: "Endurance",
                body: "We do not dress for the season. We dress for decades. Every ARINAS piece is an investment in the enduring.",
              },
            ].map((v) => (
              <div key={v.num}>
                <p className="f-label text-[#B89A6A] mb-6" style={{ fontSize: "9px", letterSpacing: "0.3em" }}>
                  {v.num}
                </p>
                <h3 className="f-display text-white mb-5" style={{ fontSize: "clamp(26px,3vw,38px)" }}>
                  {v.title}
                </h3>
                <p className="f-body" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Campaign image */}
      <div className="relative overflow-hidden" style={{ height: "70vh" }}>
        <img
          src="https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1920&q=90"
          alt="Atelier"
          className="img-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Link
            href="/collections"
            className="f-label text-white hover:text-[#B89A6A] transition-colors border-b border-white/30 hover:border-[#B89A6A] pb-0.5"
            style={{ fontSize: "10px", letterSpacing: "0.3em" }}
          >
            Explore the Collection
          </Link>
        </div>
      </div>

      {/* Atelier numbers */}
      <div className="py-28 lg:py-36 px-6 lg:px-14 max-w-[1680px] mx-auto">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
          {[
            { number: "2015", label: "Founded in Paris" },
            { number: "50K+", label: "Clients Worldwide" },
            { number: "150+", label: "Curated Brands" },
            { number: "12", label: "Years of Excellence" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="f-display text-[#0A0A0A]" style={{ fontSize: "clamp(36px,4vw,60px)" }}>
                {stat.number}
              </p>
              <p className="f-label text-[#8A8680] mt-2" style={{ fontSize: "9px", letterSpacing: "0.2em" }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
