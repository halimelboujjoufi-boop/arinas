import { headers } from "next/headers";
import { Truck, ShieldCheck, RefreshCcw, BadgeCheck } from "lucide-react";
import { getDictionary } from "@/i18n/dictionaries";
import { defaultLocale, isLocale } from "@/i18n/config";
import HeroSection from "@/components/home/HeroSection";
import BrandsSection from "@/components/home/BrandsSection";
import NewArrivals from "@/components/home/NewArrivals";
import CollectionsSection from "@/components/home/CollectionsSection";
import FlashSale from "@/components/home/FlashSale";
import BestSellers from "@/components/home/BestSellers";
import LookbookSection from "@/components/home/LookbookSection";
import TrendingCarousel from "@/components/home/TrendingCarousel";
import EditorialSection from "@/components/home/EditorialSection";
import PromoBanner from "@/components/home/PromoBanner";
import InstagramGallery from "@/components/home/InstagramGallery";
import ReviewsSection from "@/components/home/ReviewsSection";

export default async function HomePage() {
  const h = await headers();
  const headerLocale = h.get("x-locale");
  const locale = isLocale(headerLocale) ? headerLocale : defaultLocale;
  const dict = await getDictionary(locale);
  const s = dict.shortcuts;

  return (
    <>
      <HeroSection />

      {/* Service shortcuts — icon + label cards */}
      <section className="bg-[#FAF9F7] border-y border-[#0A0A0A]/[0.06]">
        <div className="max-w-[1680px] mx-auto px-6 lg:px-14 py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 sm:gap-x-12 lg:gap-16">
            {[
              { Icon: Truck,       title: s.freeShipping,  sub: s.freeShippingSub },
              { Icon: ShieldCheck, title: s.securePayment, sub: s.securePaymentSub },
              { Icon: RefreshCcw,  title: s.freeReturns,   sub: s.freeReturnsSub },
              { Icon: BadgeCheck,  title: s.authenticity,  sub: s.authenticitySub },
            ].map(({ Icon, title, sub }) => (
              <div
                key={title}
                className="flex flex-col items-center justify-start text-center px-2 py-4 lg:py-6"
              >
                {/* Icon — responsive, never cropped */}
                <Icon
                  className="text-[#B89A6A] w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex-shrink-0"
                  strokeWidth={1}
                  aria-hidden="true"
                />

                {/* Title — bold, readable, single line */}
                <h3
                  className="mt-6 lg:mt-8 text-[#0A0A0A] whitespace-nowrap"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 600,
                    fontSize: "clamp(19px, 1.9vw, 26px)",
                    letterSpacing: "0.005em",
                    lineHeight: 1.2,
                  }}
                >
                  {title}
                </h3>

                {/* Subtitle */}
                <p
                  className="mt-2.5 text-[#8A8680] whitespace-nowrap"
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 300,
                    fontSize: "clamp(13px, 1.2vw, 15px)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {sub}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <NewArrivals />
      <BrandsSection />
      <CollectionsSection />
      <FlashSale />
      <TrendingCarousel />
      <LookbookSection />
      <BestSellers />
      <PromoBanner />
      <EditorialSection />
      <InstagramGallery />
      <ReviewsSection />
    </>
  );
}
