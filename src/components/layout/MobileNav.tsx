"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, Heart, User } from "lucide-react";
import { useStore } from "@/lib/store";

export default function MobileNav() {
  const pathname = usePathname();
  const { state, dispatch } = useStore();
  const cartCount = state.cart.reduce((s, i) => s + i.quantity, 0);

  const items = [
    { href: "/", icon: Home, label: "Home" },
    { href: "#search", icon: Search, label: "Search", action: () => dispatch({ type: "TOGGLE_SEARCH" }) },
    { href: "/cart", icon: ShoppingBag, label: "Cart", badge: cartCount },
    { href: "/wishlist", icon: Heart, label: "Wishlist", badge: state.wishlist.length },
    { href: "/account", icon: User, label: "Account" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E4E4E7] z-40 safe-area-bottom">
      <div className="grid grid-cols-5 h-16">
        {items.map((item) => {
          const isActive = item.href !== "#search" && pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.action ? "#" : item.href}
              onClick={item.action}
              className={`flex flex-col items-center justify-center gap-1 relative transition-colors ${
                isActive ? "text-[#C9A86A]" : "text-[#A1A1AA] hover:text-[#111111]"
              }`}
            >
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#C9A86A]" />
              )}
              <div className="relative">
                <item.icon size={20} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#111111] text-white text-[9px] rounded-full flex items-center justify-center font-medium leading-none">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[9px] tracking-wider font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
