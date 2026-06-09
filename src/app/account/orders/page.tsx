"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useT } from "@/i18n/provider";
import Link from "next/link";
import { ShoppingBag, ArrowRight, LogOut, User } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export default function OrdersPage() {
  const t = useT();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.assign("/account/login");
        return;
      }
      setUser(data.user);
      setLoading(false);
    });
  }, []);

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    window.location.assign("/account/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#B89A6A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Client";

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-[#F5F2EC] py-16 lg:py-24 text-center">
        <p className="text-[9px] uppercase tracking-[0.35em] text-[#B89A6A] mb-4">
          {t("account.account", "Compte")}
        </p>
        <h1
          className="text-[#0A0A0A]"
          style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "clamp(38px, 5vw, 64px)", fontWeight: 300 }}
        >
          {t("account.myOrders", "Mes commandes")}
        </h1>
        <p className="text-xs text-[#8A8680] mt-3 tracking-wide">{displayName}</p>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 lg:py-24">
        {/* Account info */}
        <div className="flex items-center justify-between border border-[#EAE6E0] px-6 py-4 mb-10 bg-[#FAF9F7]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#B89A6A] rounded-full flex items-center justify-center">
              <User size={16} className="text-white" strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs font-medium text-[#0A0A0A]">{displayName}</p>
              <p className="text-[10px] text-[#8A8680]">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[#8A8680] hover:text-[#0A0A0A] transition-colors"
          >
            <LogOut size={13} strokeWidth={1.5} />
            {t("auth.logout", "Déconnexion")}
          </button>
        </div>

        {/* Empty state */}
        <div className="text-center py-20">
          <ShoppingBag size={40} strokeWidth={1} className="mx-auto text-[#D4D0CA] mb-6" />
          <p
            className="text-[#8A8680] mb-2"
            style={{ fontFamily: "Cormorant Garamond, serif", fontSize: "20px", fontStyle: "italic" }}
          >
            {t("auth.noOrders", "Aucune commande pour l'instant")}
          </p>
          <p className="text-[11px] text-[#B0AAA2] mb-8 tracking-wide">
            {t("auth.noOrdersSub", "Vos commandes apparaîtront ici une fois passées.")}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-[#0A0A0A] border border-[#0A0A0A] px-8 py-4 hover:bg-[#0A0A0A] hover:text-white transition-colors"
          >
            {t("common.discover", "Découvrir")}
            <ArrowRight size={12} strokeWidth={1.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}
