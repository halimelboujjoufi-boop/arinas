"use client";

import { useState } from "react";
import { products as seedProducts } from "@/lib/data";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import ProductsManager from "./ProductsManager";
import {
  BarChart2, Package, ShoppingBag, Users, Tag, Settings,
  TrendingUp, TrendingDown, RefreshCw, Eye, DollarSign, Trash2,
  AlertCircle, CheckCircle, Clock, ChevronRight, X, LogOut
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const mockOrders = [
  { id: "ORN-A4X91K", customer: "Sophia Laurent", items: 2, total: 4500, status: "delivered", date: "2025-06-01" },
  { id: "ORN-B7M3PQ", customer: "Isabella Marchetti", items: 1, total: 1650, status: "processing", date: "2025-06-02" },
  { id: "ORN-C2R8WT", customer: "Aisha Al-Rashid", items: 3, total: 8650, status: "shipped", date: "2025-06-02" },
  { id: "ORN-D5N1YL", customer: "Marie Dupont", items: 1, total: 890, status: "pending", date: "2025-06-02" },
  { id: "ORN-E9K4ZX", customer: "Elena Rossi", items: 2, total: 3100, status: "delivered", date: "2025-05-31" },
];

const analytics = {
  revenue: { value: 284750, change: 12.4, positive: true },
  orders: { value: 1847, change: 8.2, positive: true },
  customers: { value: 12340, change: 15.1, positive: true },
  avgOrder: { value: 1542, change: -3.2, positive: false },
};

const statusConfig: Record<string, { color: string; icon: typeof CheckCircle; label: string }> = {
  delivered: { color: "text-emerald-600 bg-emerald-50", icon: CheckCircle, label: "Delivered" },
  shipped: { color: "text-blue-600 bg-blue-50", icon: Clock, label: "Shipped" },
  processing: { color: "text-amber-600 bg-amber-50", icon: RefreshCw, label: "Processing" },
  pending: { color: "text-orange-600 bg-orange-50", icon: AlertCircle, label: "Pending" },
};

type NavItem = "dashboard" | "products" | "orders" | "customers" | "discounts" | "analytics" | "settings";

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState<NavItem>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [savedOk, setSavedOk] = useState<string | null>(null);

  const [storeSettings, setStoreSettings] = useState({
    storeName: "ARINAS",
    storeEmail: "contact@arinas.com",
    currency: "MAD (DH)",
    language: "English",
    freeShipping: "500 DH",
    shippingCost: "35 DH",
  });

  const handleSave = (section: "store" | "shipping") => {
    setSavedOk(section);
    setTimeout(() => setSavedOk(null), 2500);
  };

  const handleLogout = async () => {
    try {
      const supabase = createSupabaseBrowserClient();
      await supabase.auth.signOut();
    } catch {}
    window.location.assign("/admin/login");
  };

  const navItems: { key: NavItem; icon: typeof BarChart2; label: string }[] = [
    { key: "dashboard", icon: BarChart2, label: "Dashboard" },
    { key: "products", icon: Package, label: "Products" },
    { key: "orders", icon: ShoppingBag, label: "Orders" },
    { key: "customers", icon: Users, label: "Customers" },
    { key: "discounts", icon: Tag, label: "Discounts" },
    { key: "analytics", icon: TrendingUp, label: "Analytics" },
    { key: "settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F8F6] flex" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-60" : "w-16"} bg-[#111111] flex-shrink-0 transition-all duration-300 flex flex-col`}>
        <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
          {sidebarOpen && (
            <span className="text-white text-[16px] tracking-[0.35em] font-light" style={{ fontFamily: "Georgia, serif" }}>
              ARINAS
            </span>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/50 hover:text-white p-1">
            {sidebarOpen ? <X size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>

        {sidebarOpen && (
          <div className="px-5 py-3 border-b border-white/10">
            <p className="text-[9px] tracking-[0.25em] uppercase text-[#C9A86A] font-medium">Admin Panel</p>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ key, icon: Icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveNav(key)}
              className={`flex items-center gap-3 w-full px-3 py-2.5 rounded transition-all text-sm ${
                activeNav === key
                  ? "bg-[#C9A86A] text-white"
                  : "text-white/60 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={16} className="flex-shrink-0" />
              {sidebarOpen && <span className="tracking-wide">{label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-white/10">
          <Link href="/" className={`flex items-center gap-3 px-3 py-2.5 text-white/40 hover:text-white transition-colors text-xs`}>
            <Eye size={16} />
            {sidebarOpen && "View Store"}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-white/40 hover:text-white transition-colors text-xs"
          >
            <LogOut size={16} />
            {sidebarOpen && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-[#E4E4E7] px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-base font-medium text-[#111111] capitalize tracking-wide">
            {activeNav}
          </h1>
        </div>

        <div className="p-8">
          {/* DASHBOARD */}
          {activeNav === "dashboard" && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: "Total Revenue", icon: DollarSign, ...analytics.revenue, prefix: "", suffix: " DH" },
                  { label: "Total Orders", icon: ShoppingBag, ...analytics.orders, prefix: "", suffix: "" },
                  { label: "Total Customers", icon: Users, ...analytics.customers, prefix: "", suffix: "" },
                  { label: "Avg. Order Value", icon: TrendingUp, ...analytics.avgOrder, prefix: "", suffix: " DH" },
                ].map((kpi) => (
                  <div key={kpi.label} className="bg-white border border-[#E4E4E7] p-5">
                    <div className="flex items-start justify-between mb-3">
                      <p className="text-[10px] tracking-[0.2em] uppercase text-[#A1A1AA] font-medium">{kpi.label}</p>
                      <div className="w-8 h-8 bg-[#F5F0EA] flex items-center justify-center">
                        <kpi.icon size={15} className="text-[#C9A86A]" />
                      </div>
                    </div>
                    <p className="text-2xl font-light text-[#111111] mb-1.5" style={{ fontFamily: "Georgia, serif" }}>
                      {kpi.prefix}{kpi.value.toLocaleString()}{kpi.suffix}
                    </p>
                    <div className={`flex items-center gap-1 text-xs ${kpi.positive ? "text-emerald-600" : "text-red-500"}`}>
                      {kpi.positive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                      {kpi.change > 0 ? "+" : ""}{kpi.change}% vs last month
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="bg-white border border-[#E4E4E7]">
                <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EBE3]">
                  <h3 className="text-sm font-medium text-[#111111] tracking-wide">Recent Orders</h3>
                  <button
                    className="text-[10px] tracking-wider text-[#C9A86A] hover:text-[#B8963A] transition-colors"
                    onClick={() => setActiveNav("orders")}
                  >
                    View all
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#F8F8F6]">
                        {["Order", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                          <th key={h} className="text-[10px] tracking-[0.18em] uppercase text-[#A1A1AA] py-3 px-6 text-left font-medium">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrders.map((order) => {
                        const status = statusConfig[order.status];
                        return (
                          <tr key={order.id} className="border-b border-[#F8F8F6] hover:bg-[#FAFAFA] transition-colors">
                            <td className="py-3.5 px-6 text-xs font-mono text-[#C9A86A]">{order.id}</td>
                            <td className="py-3.5 px-6 text-sm text-[#111111]">{order.customer}</td>
                            <td className="py-3.5 px-6 text-sm text-[#71717A]">{order.items}</td>
                            <td className="py-3.5 px-6 text-sm font-medium text-[#111111]">{order.total.toLocaleString()} DH</td>
                            <td className="py-3.5 px-6">
                              <span className={`inline-flex items-center gap-1.5 text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full font-medium ${status.color}`}>
                                <status.icon size={10} />
                                {status.label}
                              </span>
                            </td>
                            <td className="py-3.5 px-6 text-xs text-[#A1A1AA]">{order.date}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="bg-white border border-[#E4E4E7] p-5 lg:col-span-2">
                  <h3 className="text-sm font-medium text-[#111111] mb-4">Top Products</h3>
                  <div className="space-y-3">
                    {seedProducts.slice(0, 5).map((p, i) => {
                      const soldCount = 12 + ((Number(p.id) * 7) % 43);

                      return (
                        <div key={p.id} className="flex items-center gap-4">
                        <span className="text-[11px] font-mono text-[#A1A1AA] w-5">0{i + 1}</span>
                        <div className="relative w-10 h-10 bg-[#F5F0EA] overflow-hidden flex-shrink-0">
                          <Image src={p.image} alt={p.name} fill sizes="40px" className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-[#111111] truncate">{p.name}</p>
                          <p className="text-[10px] text-[#A1A1AA]">{p.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-[#111111]">{p.price.toLocaleString()} DH</p>
                          <p className="text-[10px] text-[#A1A1AA]">{soldCount} sold</p>
                        </div>
                        <div className="w-16 h-1.5 bg-[#F5F0EA] rounded overflow-hidden">
                          <div className="h-full bg-[#C9A86A] rounded" style={{ width: `${(5 - i) * 20}%` }} />
                        </div>
                      </div>
                      );
                    })}
                  </div>
                </div>

                <div className="bg-[#111111] p-5 text-white">
                  <h3 className="text-xs tracking-[0.2em] uppercase text-white/60 mb-4">Inventory Alerts</h3>
                  <div className="space-y-3">
                    {seedProducts.slice(0, 4).map((p) => {
                      const lowStock = 1 + (Number(p.id) % 5);
                      const isCritical = lowStock <= 2;

                      return (
                        <div key={p.id} className="flex items-center justify-between">
                        <p className="text-xs text-white/80 truncate flex-1 mr-3">{p.name.split(" ").slice(0, 3).join(" ")}</p>
                        <span className={`text-[9px] tracking-wider uppercase px-2 py-0.5 flex-shrink-0 ${
                          isCritical ? "bg-red-500/20 text-red-300" : "bg-[#C9A86A]/20 text-[#C9A86A]"
                        }`}>
                          {lowStock} left
                        </span>
                      </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PRODUCTS */}
          {activeNav === "products" && <ProductsManager />}

          {/* ORDERS */}
          {activeNav === "orders" && (
            <div className="space-y-5">
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: "All Orders", count: 1847, color: "border-[#111111]" },
                  { label: "Pending", count: 23, color: "border-orange-400" },
                  { label: "Processing", count: 48, color: "border-amber-400" },
                  { label: "Delivered", count: 1776, color: "border-emerald-400" },
                ].map((stat) => (
                  <div key={stat.label} className={`bg-white border-l-4 ${stat.color} border border-[#E4E4E7] p-4`}>
                    <p className="text-[10px] tracking-wider uppercase text-[#A1A1AA] mb-1">{stat.label}</p>
                    <p className="text-2xl font-light text-[#111111]" style={{ fontFamily: "Georgia, serif" }}>{stat.count.toLocaleString()}</p>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-[#E4E4E7]">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#F0EBE3] bg-[#FAFAFA]">
                        {["Order ID", "Customer", "Items", "Total", "Status", "Date", "Actions"].map((h) => (
                          <th key={h} className="text-[10px] tracking-[0.18em] uppercase text-[#A1A1AA] py-3 px-5 text-left font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {mockOrders.map((order) => {
                        const status = statusConfig[order.status];
                        return (
                          <tr key={order.id} className="border-b border-[#F8F8F6] hover:bg-[#FAFAFA] transition-colors">
                            <td className="py-3.5 px-5 text-xs font-mono text-[#C9A86A]">{order.id}</td>
                            <td className="py-3.5 px-5 text-sm text-[#111111]">{order.customer}</td>
                            <td className="py-3.5 px-5 text-sm text-[#71717A]">{order.items}</td>
                            <td className="py-3.5 px-5 text-sm font-medium">{order.total.toLocaleString()} DH</td>
                            <td className="py-3.5 px-5">
                              <span className={`inline-flex items-center gap-1.5 text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-full font-medium ${status.color}`}>
                                <status.icon size={9} />
                                {status.label}
                              </span>
                            </td>
                            <td className="py-3.5 px-5 text-xs text-[#A1A1AA]">{order.date}</td>
                            <td className="py-3.5 px-5">
                              <button className="text-[10px] tracking-wider text-[#C9A86A] hover:text-[#B8963A] transition-colors">View</button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* DISCOUNTS */}
          {activeNav === "discounts" && (
            <div className="space-y-5">
              <div className="bg-white border border-[#E4E4E7] p-6">
                <h3 className="text-sm font-medium text-[#111111] mb-5">Active Coupon Codes</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {Object.entries({ ARINAS10: 10, LUXURY20: 20, VIP30: 30, WELCOME15: 15 }).map(([code, disc]) => (
                    <div key={code} className="flex items-center justify-between border border-[#E4E4E7] p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#F5F0EA] flex items-center justify-center">
                          <Tag size={14} className="text-[#C9A86A]" />
                        </div>
                        <div>
                          <p className="text-sm font-mono font-medium text-[#111111]">{code}</p>
                          <p className="text-[10px] text-[#71717A]">{disc}% discount</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] tracking-wider uppercase bg-emerald-50 text-emerald-600 px-2 py-0.5">Active</span>
                        <button className="w-7 h-7 flex items-center justify-center border border-[#E4E4E7] hover:border-red-400 hover:text-red-400 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ANALYTICS */}
          {activeNav === "analytics" && (
            <div className="space-y-5">
              <div className="grid lg:grid-cols-2 gap-5">
                {[
                  { title: "Revenue by Collection", items: [
                    { name: "Luxury Collection", pct: 42, value: "119,595 DH" },
                    { name: "Limited Edition", pct: 28, value: "79,730 DH" },
                    { name: "Summer Collection", pct: 18, value: "51,255 DH" },
                    { name: "Casual Luxe", pct: 12, value: "34,170 DH" },
                  ]},
                  { title: "Top Categories", items: [
                    { name: "Dresses", pct: 35, value: "643 sales" },
                    { name: "Bags", pct: 24, value: "443 sales" },
                    { name: "Blazers", pct: 18, value: "332 sales" },
                    { name: "Jewelry", pct: 15, value: "277 sales" },
                  ]},
                ].map((section) => (
                  <div key={section.title} className="bg-white border border-[#E4E4E7] p-6">
                    <h3 className="text-sm font-medium text-[#111111] mb-5">{section.title}</h3>
                    <div className="space-y-4">
                      {section.items.map((item) => (
                        <div key={item.name}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="text-[#52525B]">{item.name}</span>
                            <span className="font-medium text-[#111111]">{item.value}</span>
                          </div>
                          <div className="h-1.5 bg-[#F5F0EA] rounded overflow-hidden">
                            <div
                              className="h-full bg-[#C9A86A] rounded transition-all duration-700"
                              style={{ width: `${item.pct}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SETTINGS */}
          {activeNav === "settings" && (
            <div className="max-w-2xl space-y-6">
              {/* Store Information */}
              <div className="bg-white border border-[#E4E4E7] p-6">
                <h3 className="text-sm font-medium text-[#111111] mb-5 pb-3 border-b border-[#F0EBE3]">Store Information</h3>
                <div className="space-y-4">
                  {[
                    { label: "Store Name", key: "storeName" },
                    { label: "Store Email", key: "storeEmail" },
                    { label: "Currency", key: "currency" },
                    { label: "Language", key: "language" },
                  ].map((f) => (
                    <div key={f.key} className="grid grid-cols-2 items-center gap-4">
                      <label className="text-[11px] tracking-wider uppercase text-[#71717A] font-medium">{f.label}</label>
                      <input
                        value={storeSettings[f.key as keyof typeof storeSettings]}
                        onChange={(e) => setStoreSettings((p: typeof storeSettings) => ({ ...p, [f.key]: e.target.value }))}
                        className="border border-[#E4E4E7] px-3 py-2 text-sm focus:outline-none focus:border-[#C9A86A] transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-4">
                  <button
                    onClick={() => handleSave("store")}
                    className="bg-[#111111] text-white text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 hover:bg-[#C9A86A] transition-colors"
                  >
                    Save Changes
                  </button>
                  {savedOk === "store" && (
                    <span className="text-[11px] text-emerald-600 tracking-wide flex items-center gap-1">
                      <CheckCircle size={13} /> Saved
                    </span>
                  )}
                </div>
              </div>

              {/* Shipping Settings */}
              <div className="bg-white border border-[#E4E4E7] p-6">
                <h3 className="text-sm font-medium text-[#111111] mb-5 pb-3 border-b border-[#F0EBE3]">Shipping Settings</h3>
                <div className="space-y-4">
                  {[
                    { label: "Free Shipping Threshold", key: "freeShipping" },
                    { label: "Default Shipping Cost", key: "shippingCost" },
                  ].map((f) => (
                    <div key={f.key} className="grid grid-cols-2 items-center gap-4">
                      <label className="text-[11px] tracking-wider uppercase text-[#71717A] font-medium">{f.label}</label>
                      <input
                        value={storeSettings[f.key as keyof typeof storeSettings]}
                        onChange={(e) => setStoreSettings((p: typeof storeSettings) => ({ ...p, [f.key]: e.target.value }))}
                        className="border border-[#E4E4E7] px-3 py-2 text-sm focus:outline-none focus:border-[#C9A86A] transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex items-center gap-4">
                  <button
                    onClick={() => handleSave("shipping")}
                    className="bg-[#111111] text-white text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 hover:bg-[#C9A86A] transition-colors"
                  >
                    Save Changes
                  </button>
                  {savedOk === "shipping" && (
                    <span className="text-[11px] text-emerald-600 tracking-wide flex items-center gap-1">
                      <CheckCircle size={13} /> Saved
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
