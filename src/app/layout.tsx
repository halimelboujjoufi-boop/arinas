import type { Metadata } from "next";
import { headers } from "next/headers";
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

  // hreflang alternates for every supported locale + x-default.
  const languages: Record<string, string> = {};
  for (const l of locales) languages[l] = `/${l}${path === "/" ? "" : path}`;
  languages["x-default"] = `/${defaultLocale}${path === "/" ? "" : path}`;

  return {
    title: { default: dict.meta.title, template: "%s | ARINAS" },
    description: dict.meta.description,
    keywords: ["luxury fashion", "couture", "designer clothing", "ARINAS", "high-end fashion"],
    authors: [{ name: "ARINAS" }],
    creator: "ARINAS",
    metadataBase: new URL("https://arinas.com"),
    alternates: {
      canonical: `/${locale}${path === "/" ? "" : path}`,
      languages,
    },
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      type: "website",
      locale: OG_LOCALE[locale],
      siteName: "ARINAS",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
    },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { locale } = await resolveLocale();
  const dict = await getDictionary(locale);
  const dir = getDir(locale);
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
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400&family=Inter:wght@300;400;500;600&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="antialiased">
        <I18nProvider locale={locale} dict={dict}>
          <StoreProvider>
            <Header />
            <main className="min-h-screen pb-16 lg:pb-0 pt-[128px] lg:pt-[206px]">{children}</main>
            <Footer />
            <CartDrawer />
            <SearchOverlay />
            <QuickView />
            <MobileNav />
          </StoreProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
