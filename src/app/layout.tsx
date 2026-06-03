import type { Metadata } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Inter, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import SearchOverlay from "@/components/layout/SearchOverlay";
import MobileNav from "@/components/layout/MobileNav";
import QuickView from "@/components/ui/QuickView";
import { I18nProvider } from "@/i18n/provider";
import { getDictionary } from "@/i18n/dictionaries";
import {
  defaultLocale,
  getDir,
  isLocale,
  locales,
  stripLocale,
  type Locale,
} from "@/i18n/config";

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  fr: "fr_FR",
  ar: "ar_AE",
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://arinas.com";
const ogImage = "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=630&q=90";

const pageMeta: Array<{ match: RegExp; title: string; description: string }> = [
  {
    match: /^\/shop/,
    title: "Shop Luxury Fashion",
    description: "Shop curated designer dresses, abayas, tailoring, accessories, and luxury essentials from ARINAS.",
  },
  {
    match: /^\/collections/,
    title: "Luxury Collections",
    description: "Explore ARINAS luxury collections, seasonal edits, limited pieces, and couture-inspired wardrobes.",
  },
  {
    match: /^\/product/,
    title: "Luxury Product Detail",
    description: "Discover ARINAS product details, refined materials, available sizes, styling notes, and luxury service.",
  },
  {
    match: /^\/new-arrivals/,
    title: "New Arrivals",
    description: "Discover the newest ARINAS luxury fashion arrivals and seasonal statement pieces.",
  },
  {
    match: /^\/about/,
    title: "About ARINAS",
    description: "Learn about the ARINAS maison, our curation philosophy, and our approach to enduring luxury.",
  },
  {
    match: /^\/contact/,
    title: "Contact ARINAS",
    description: "Contact ARINAS client care for styling, orders, private appointments, and luxury service.",
  },
  {
    match: /^\/cart/,
    title: "Shopping Bag",
    description: "Review your ARINAS shopping bag and prepare your luxury fashion order.",
  },
  {
    match: /^\/checkout/,
    title: "Secure Checkout",
    description: "Complete your ARINAS order with secure checkout, gift options, and premium delivery.",
  },
  {
    match: /^\/wishlist/,
    title: "Wishlist",
    description: "Review your saved ARINAS luxury fashion pieces.",
  },
  {
    match: /^\/admin/,
    title: "Admin",
    description: "Protected ARINAS administration panel.",
  },
];

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-naskh-arabic",
  display: "swap",
});

async function resolveLocale(): Promise<{ locale: Locale; path: string }> {
  const h = await headers();
  const headerLocale = h.get("x-locale");
  const locale = isLocale(headerLocale) ? headerLocale : defaultLocale;
  const fullPath = h.get("x-pathname") || `/${locale}`;
  return { locale, path: stripLocale(fullPath) };
}

export async function generateMetadata(): Promise<Metadata> {
  const { locale, path } = await resolveLocale();
  const dict = await getDictionary(locale);
  const matchedMeta = pageMeta.find((item) => item.match.test(path));
  const title = matchedMeta?.title ?? dict.meta.title;
  const description = matchedMeta?.description ?? dict.meta.description;

  // hreflang alternates for every supported locale + x-default.
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}${path === "/" ? "" : path}`;
  languages["x-default"] = `/${defaultLocale}${path === "/" ? "" : path}`;

  return {
    title: { default: title, template: "%s | ARINAS" },
    description,
    keywords: ["luxury fashion", "couture", "designer clothing", "ARINAS", "high-end fashion"],
    authors: [{ name: "ARINAS" }],
    creator: "ARINAS",
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `/${locale}${path === "/" ? "" : path}`,
      languages,
    },
    openGraph: {
      title,
      description,
      type: "website",
      locale: OG_LOCALE[locale],
      siteName: "ARINAS",
      url: `/${locale}${path === "/" ? "" : path}`,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: "ARINAS luxury fashion editorial campaign",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: path.startsWith("/admin")
      ? { index: false, follow: false, googleBot: { index: false, follow: false } }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale, path } = await resolveLocale();
  const dict = await getDictionary(locale);
  const dir = getDir(locale);
  const isAdmin = path === "/admin" || path.startsWith("/admin/");
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "ClothingStore",
    name: "ARINAS",
    description: "Luxury fashion boutique offering curated couture pieces",
    url: "https://arinas.com",
    logo: "https://arinas.com/logo.png",
    sameAs: [
      "https://instagram.com/arinas",
      "https://facebook.com/arinas",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "12 Rue de la Paix",
      addressLocality: "Paris",
      postalCode: "75002",
      addressCountry: "FR",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        opens: "10:00",
        closes: "20:00",
      },
    ],
  };

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className={`${inter.variable} ${cormorant.variable} ${notoNaskhArabic.variable} antialiased`}>
        <I18nProvider locale={locale} dict={dict}>
          {isAdmin ? (
            children
          ) : (
            <StoreProvider>
              <Header />
              <main className="min-h-screen pb-16 lg:pb-0 pt-[128px] lg:pt-[206px]">{children}</main>
              <Footer />
              <CartDrawer />
              <SearchOverlay />
              <QuickView />
              <MobileNav />
            </StoreProvider>
          )}
        </I18nProvider>
      </body>
    </html>
  );
}
