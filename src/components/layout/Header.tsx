"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown } from "lucide-react";

type MegaMenu = {
  cols: Array<{ title: string; links: string[] }>;
  imgs: Array<{ src: string; label: string; sub: string }>;
};

type NavItem = {
  label: string;
  href: string;
  mega: MegaMenu | null;
  sale?: boolean;
};

/* ─── Data ──────────────────────────────────────────── */
const NAV: NavItem[] = [
  { label: "New Arrivals", href: "/new-arrivals", mega: null },
  {
    label: "Women", href: "/shop",
    mega: {
      cols: [
        { title: "Clothing",    links: ["Dresses", "Abayas", "Tops", "Blazers", "Trousers", "Coats"] },
        { title: "Accessories", links: ["Bags", "Shoes", "Jewelry", "Scarves", "Belts"] },
        { title: "Collections", links: ["Summer 2025", "Luxury Edit", "Limited Edition", "Casual Luxe"] },
      ],
      imgs: [
        { src: "https://images.unsplash.com/photo-1566479179817-d9e9e50c8f14?w=500&q=90", label: "New Season",  sub: "Just arrived" },
        { src: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=500&q=90", label: "The Edit",    sub: "Curated picks" },
      ],
    },
  },
  {
    label: "Dresses", href: "/shop",
    mega: {
      cols: [
        { title: "Style",     links: ["Maxi", "Midi", "Mini", "Evening Gowns", "Wrap"] },
        { title: "Occasion",  links: ["Wedding Guest", "Formal", "Casual", "Resort"] },
        { title: "Material",  links: ["Silk", "Linen", "Chiffon", "Cashmere"] },
      ],
      imgs: [
        { src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=90", label: "Evening Edit",     sub: "For every occasion" },
        { src: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500&q=90", label: "Summer Dresses",   sub: "Light & effortless" },
      ],
    },
  },
  {
    label: "Abayas", href: "/shop",
    mega: {
      cols: [
        { title: "Style",    links: ["Open", "Closed", "Embroidered", "Butterfly", "Wrap"] },
        { title: "Occasion", links: ["Everyday", "Formal", "Wedding", "Travel"] },
        { title: "Fabric",   links: ["Nidha", "Crepe", "Silk", "Chiffon"] },
      ],
      imgs: [
        { src: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&q=90", label: "Couture Abayas", sub: "Handcrafted elegance" },
        { src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&q=90", label: "Ramadan Edit",  sub: "Sacred luxury" },
      ],
    },
  },
  {
    label: "Collections", href: "/collections",
    mega: {
      cols: [
        { title: "By Season", links: ["Summer 2025", "Pre-Fall", "Resort", "Holiday"] },
        { title: "By Style",  links: ["Casual Luxe", "Evening", "Workwear", "Weekend"] },
        { title: "Special",   links: ["Limited Edition", "Bridal", "Couture"] },
      ],
      imgs: [
        { src: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&q=90", label: "Limited Edition", sub: "Exclusively yours" },
        { src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&q=90", label: "Bridal",           sub: "Your perfect moment" },
      ],
    },
  },
  { label: "Sale",        href: "/shop",    mega: null, sale: true },
  { label: "Accessories", href: "/shop",    mega: null },
  { label: "Contact",     href: "/contact", mega: null },
];

const MSGS = [
  "Free shipping on orders above $500  ·  Free returns within 30 days",
  "New Arrivals: Summer Collection 2025 — Discover Now",
  "Complimentary gift wrapping on all orders",
];

/* ─── Component ─────────────────────────────────────── */
export default function Header() {
  const { state, dispatch } = useStore();
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [activeMega,   setActiveMega]   = useState<string | null>(null);
  const [accountOpen,  setAccountOpen]  = useState(false);
  const [msgIdx,       setMsgIdx]       = useState(0);
  const megaTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cartCount  = state.cart.reduce((s, i) => s + i.quantity, 0);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setMsgIdx((i) => (i + 1) % MSGS.length), 4500);
    return () => clearInterval(t);
  }, []);

  const openMega  = (l: string) => { if (megaTimer.current) clearTimeout(megaTimer.current); setActiveMega(l); };
  const closeMega = ()          => { megaTimer.current = setTimeout(() => setActiveMega(null), 160); };
  const stayMega  = ()          => { if (megaTimer.current) clearTimeout(megaTimer.current); };

  const opaque = scrolled || !!activeMega || mobileOpen;

  /* colour shortcuts */
  const navClr  = opaque && !mobileOpen ? "text-[#2A2A2A]/70 hover:text-[#2A2A2A]"   : "text-white/75 hover:text-white";
  const icoClr  = opaque && !mobileOpen ? "text-[#2A2A2A]/65 hover:text-[#2A2A2A]"   : "text-white/75 hover:text-white";
  const logoClr = mobileOpen             ? "text-white"
                : opaque                 ? "text-[#2A2A2A]"
                :                          "text-white";

  return (
    <>
      {/* ═══════════════════════════════════════════
          FIXED HEADER SHELL
      ═══════════════════════════════════════════ */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          mobileOpen ? "bg-[#0A0A0A]"
          : opaque   ? "bg-white shadow-[0_1px_24px_rgba(0,0,0,0.07)] border-b border-[#EAE6E0]"
          :            "bg-transparent"
        }`}
      >

        {/* ── ROW 1 · Announcement ───────────────── */}
        {!mobileOpen && (
          <div
            className={`flex items-center justify-center h-10 border-b transition-colors duration-500 ${
              opaque ? "border-[#EAE6E0]" : "border-white/10"
            }`}
          >
            <p
              key={msgIdx}
              className="f-label text-center px-4"
              style={{
                fontSize: "13px",
                letterSpacing: "0.18em",
                color: opaque ? "#2A2620" : "#FFFFFF",
                textShadow: opaque ? "none" : "0 1px 8px rgba(0,0,0,0.4)",
                animation: "fadeIn 0.5s ease",
              }}
            >
              {MSGS[msgIdx]}
            </p>
          </div>
        )}

        {/* ── ROW 2 · Logo row ───────────────────────
            Layout: [left-col] [center-col] [right-col]
            Each column is exactly 1/3 of the header width.
            Logo lives in center-col → perfectly centered.
            Icons live in right-col  → no overlap ever.
        ─────────────────────────────────────────────── */}
        <div className="relative flex items-center justify-between px-5 lg:px-12 h-[88px] lg:h-[104px]">

          {/* LEFT — hamburger (mobile) · empty spacer (desktop) */}
          <div className="flex items-center flex-shrink-0 w-24 lg:w-48">
            <button
              className={`lg:hidden transition-colors duration-300 ${
                mobileOpen ? "text-white" : opaque ? "text-[#2A2A2A]" : "text-white"
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              {mobileOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
            </button>
          </div>

          {/* CENTER — logo, the focal point, absolutely centered */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <Link
              href="/"
              onClick={() => { setMobileOpen(false); setActiveMega(null); }}
              className="pointer-events-auto"
            >
              <span
                className={`f-display transition-colors duration-500 ${logoClr}`}
                style={{
                  fontSize: "clamp(32px, 3.4vw, 48px)",
                  letterSpacing: "0.38em",
                  fontWeight: 300,
                  whiteSpace: "nowrap",
                }}
              >
                ARINAS
              </span>
            </Link>
          </div>

          {/* RIGHT — icons, larger and icon-only for a clean luxury look */}
          <div className="flex items-center justify-end gap-5 lg:gap-8 flex-shrink-0 w-24 lg:w-48">

            {/* Search */}
            <button
              onClick={() => dispatch({ type: "TOGGLE_SEARCH" })}
              className={`transition-colors duration-300 ${icoClr}`}
              aria-label="Search"
            >
              <Search size={25} strokeWidth={1.5} />
            </button>

            {/* Account (desktop only) */}
            <div className="relative hidden lg:block">
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className={`flex items-center transition-colors duration-300 ${icoClr}`}
                aria-label="Account"
              >
                <User size={25} strokeWidth={1.5} />
              </button>

              {accountOpen && (
                <div
                  className="absolute right-0 top-full mt-3 w-52 bg-white border border-[#EAE6E0] shadow-xl py-2 z-20"
                  style={{ animation: "fadeIn 0.18s ease" }}
                >
                  {[
                    { label: "Sign In",        href: "#" },
                    { label: "Create Account", href: "#" },
                    { label: "My Orders",      href: "#" },
                    { label: "My Wishlist",    href: "/wishlist" },
                  ].map((it) => (
                    <Link
                      key={it.label}
                      href={it.href}
                      onClick={() => setAccountOpen(false)}
                      className="block px-6 py-3 text-[#2A2A2A]/70 hover:text-[#B89A6A] hover:bg-[#FAF9F7] transition-colors"
                      style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", fontWeight: 300, letterSpacing: "0.06em" }}
                    >
                      {it.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className={`relative hidden sm:block transition-colors duration-300 ${icoClr}`}
              aria-label="Wishlist"
            >
              <Heart size={25} strokeWidth={1.5} />
              {state.wishlist.length > 0 && (
                <span
                  className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-[#B89A6A] rounded-full text-white flex items-center justify-center"
                  style={{ fontSize: "10px" }}
                >
                  {state.wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={() => dispatch({ type: "TOGGLE_CART" })}
              className={`relative transition-colors duration-300 ${icoClr}`}
              aria-label="Shopping bag"
            >
              <ShoppingBag size={25} strokeWidth={1.5} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-[#0A0A0A] rounded-full text-white flex items-center justify-center"
                  style={{ fontSize: "10px" }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ── ROW 3 · Navigation (desktop) ────────── */}
        <div
          className={`hidden lg:flex items-center justify-center border-t transition-colors duration-500 h-[62px] overflow-x-auto scrollbar-none ${
            opaque ? "border-[#EAE6E0]" : "border-white/10"
          }`}
        >
          <nav className="flex items-center justify-center h-full flex-nowrap">
            {NAV.map((item) => (
              <div
                key={item.label}
                className="relative group"
                onMouseEnter={() => item.mega ? openMega(item.label) : setActiveMega(null)}
                onMouseLeave={closeMega}
              >
                <Link
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 xl:px-5 h-[62px] whitespace-nowrap transition-colors duration-300 ${
                    item.sale
                      ? "text-[#B89A6A] hover:text-[#9A7A4A]"
                      : navClr
                  }`}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 500,
                    fontSize: "clamp(16px, 1.25vw, 19px)",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                  {item.mega && (
                    <ChevronDown
                      size={15}
                      strokeWidth={1.75}
                      className={`flex-shrink-0 transition-transform duration-200 ${activeMega === item.label ? "rotate-180" : ""}`}
                    />
                  )}
                </Link>

                {/* Gold underline on active */}
                <span
                  className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#B89A6A] transition-all duration-300"
                  style={{ opacity: activeMega === item.label ? 1 : 0 }}
                />
              </div>
            ))}
          </nav>
        </div>

        {/* ── Mega Menu panel ─────────────────────── */}
        {activeMega && (() => {
          const item = NAV.find((n) => n.label === activeMega);
          if (!item?.mega) return null;
          return (
            <div
              className="absolute left-0 right-0 bg-white border-t border-[#EAE6E0] shadow-2xl"
              style={{ top: "100%", animation: "fadeIn 0.18s ease" }}
              onMouseEnter={stayMega}
              onMouseLeave={closeMega}
            >
              <div className="max-w-[1580px] mx-auto grid grid-cols-12 gap-16 px-14 py-14">

                {/* 3 link columns */}
                <div className="col-span-7 grid grid-cols-3 gap-10">
                  {item.mega.cols.map((col) => (
                    <div key={col.title}>
                      <p
                        className="text-[#B89A6A] mb-7"
                        style={{ fontFamily: "Inter, sans-serif", fontWeight: 600, fontSize: "18px", letterSpacing: "0.14em", textTransform: "uppercase" }}
                      >
                        {col.title}
                      </p>
                      <ul className="space-y-4">
                        {col.links.map((name) => (
                          <li key={name}>
                            <Link
                              href="/shop"
                              onClick={() => setActiveMega(null)}
                              className="block text-[#2A2A2A]/65 hover:text-[#B89A6A] transition-colors"
                              style={{
                                fontSize: "16px",
                                fontFamily: "Inter, sans-serif",
                                fontWeight: 300,
                                letterSpacing: "0.02em",
                              }}
                            >
                              {name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* 2 featured images */}
                <div className="col-span-5 grid grid-cols-2 gap-6">
                  {item.mega.imgs.map((img) => (
                    <Link
                      key={img.label}
                      href="/collections"
                      onClick={() => setActiveMega(null)}
                      className="group relative overflow-hidden block"
                      style={{ aspectRatio: "3/4" }}
                    >
                      <img
                        src={img.src}
                        alt={img.label}
                        className="img-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                      <div className="absolute bottom-6 left-6 right-6">
                        <p className="f-label text-white/60 mb-1" style={{ fontSize: "11px", letterSpacing: "0.2em" }}>
                          {img.sub}
                        </p>
                        <p className="f-serif text-white" style={{ fontSize: "18px" }}>
                          {img.label}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ═══════════════════════════════════════════
          MOBILE MENU (full-screen)
      ═══════════════════════════════════════════ */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A0A0A] overflow-y-auto">
          <div className="px-7 pt-[112px] pb-16">
            <nav>
              {NAV.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex justify-between items-center py-5 border-b border-white/[0.07] transition-colors ${
                    item.sale ? "text-[#B89A6A]" : "text-white/75 hover:text-white"
                  }`}
                  style={{
                    fontFamily: "Inter, sans-serif",
                    fontWeight: 400,
                    fontSize: "16px",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-10 pt-8 border-t border-white/[0.07] space-y-6">
              {["Sign In", "Create Account", "My Orders"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="block text-white/45 hover:text-white/80 transition-colors"
                  style={{ fontFamily: "Inter, sans-serif", fontWeight: 300, fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase" }}
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

    </>
  );
}
