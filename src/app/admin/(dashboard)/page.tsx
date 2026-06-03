"use client";

import { useState, useEffect } from "react";
import { products as seedProducts } from "@/lib/data";
import type { Product } from "@/lib/store";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const PRODUCTS_STORAGE_KEY = "arinas_admin_products";

type ProductForm = {
  id: string;
  name: string;
  category: string;
  price: string;
  originalPrice: string;
  image: string;
  badge: string;
};

const emptyForm: ProductForm = {
  id: "", name: "", category: "", price: "", originalPrice: "", image: "", badge: "",
};

function toForm(p: Product): ProductForm {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    price: String(p.price),
    originalPrice: p.originalPrice != null ? String(p.originalPrice) : "",
    image: p.image,
    badge: p.badge ?? "",
  };
}
import {
  BarChart2, Package, ShoppingBag, Users, Tag, Settings,
  TrendingUp, TrendingDown, Eye, Edit2, Trash2, Plus,
  Search, Filter, Download, RefreshCw, DollarSign,
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
  const [productSearch, setProductSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Editable product catalog, persisted to localStorage so changes survive reloads.
  const [productList, setProductList] = useState<Product[]>(seedProducts);
  const [editing, setEditing] = useState<ProductForm | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [savedFlash, setSavedFlash] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Product[];
        // Hydrate the editable catalog from localStorage on mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (Array.isArray(parsed) && parsed.length) setProductList(parsed);
      }
    } catch {}
  }, []);

  const persist = (list: Product[]) => {
    setProductList(list);
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(list));
    } catch {}
  };

  const openNew = () => {
    const nextId = String(Math.max(0, ...productList.map((p) => Number(p.id) || 0)) + 1);
    setIsNew(true);
    setEditing({ ...emptyForm, id: nextId });
  };

  const openEdit = (p: Product) => {
    setIsNew(false);
    setEditing(toForm(p));
  };

  const removeProduct = (id: string) => {
    if (typeof window !== "undefined" && !window.confirm("Delete this product?")) return;
    persist(productList.filter((p) => p.id !== id));
  };

  const saveProduct = () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.price.trim()) {
      setSavedFlash("Name and price are required.");
      return;
    }
    const existing = productList.find((p) => p.id === editing.id);
    const merged: Product = {
      ...(existing ?? ({ id: editing.id } as Product)),
      id: editing.id,
      name: editing.name.trim(),
      category: editing.category.trim() || "Uncategorized",
      price: Number(editing.price) || 0,
      originalPrice: editing.originalPrice.trim() ? Number(editing.originalPrice) : undefined,
      image: editing.image.trim() || existing?.image || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=90",
      badge: editing.badge.trim() || undefined,
    };
    const list = existing
      ? productList.map((p) => (p.id === merged.id ? merged : p))
      : [merged, ...productList];
    persist(list);
    setEditing(null);
    setSavedFlash(isNew ? "Product added." : "Product updated.");
    setTimeout(() => setSavedFlash(""), 2500);
  };

  const resetCatalog = () => {
    if (typeof window !== "undefined" && !window.confirm("Reset all products to defaults?")) return;
    persist(seedProducts);
  };

  const filteredProducts = productList.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

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
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
              <input
                placeholder="Search..."
                className="pl-9 pr-4 py-2 text-xs border border-[#E4E4E7] focus:outline-none focus:border-[#C9A86A] w-48 bg-[#FAFAFA]"
              />
            </div>
            <button onClick={openNew} className="flex items-center gap-2 bg-[#111111] text-white text-xs tracking-wider px-4 py-2 hover:bg-[#C9A86A] transition-colors">
              <Plus size={13} />
              New Product
            </button>
          </div>
        </div>

        <div className="p-8">
          {/* DASHBOARD */}
          {activeNav === "dashboard" && (
            <div className="space-y-8">
              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { label: "Total Revenue", icon: DollarSign, ...analytics.revenue, prefix: "$", suffix: "" },
                  { label: "Total Orders", icon: ShoppingBag, ...analytics.orders, prefix: "", suffix: "" },
                  { label: "Total Customers", icon: Users, ...analytics.customers, prefix: "", suffix: "" },
                  { label: "Avg. Order Value", icon: TrendingUp, ...analytics.avgOrder, prefix: "$", suffix: "" },
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
                            <td className="py-3.5 px-6 text-sm font-medium text-[#111111]">${order.total.toLocaleString()}</td>
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
                    {productList.slice(0, 5).map((p, i) => {
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
                          <p className="text-xs font-medium text-[#111111]">${p.price.toLocaleString()}</p>
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
                    {productList.slice(0, 4).map((p) => {
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
          {activeNav === "products" && (
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
                  <input
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-9 pr-4 py-2.5 text-xs border border-[#E4E4E7] focus:outline-none focus:border-[#C9A86A] w-full bg-white"
                  />
                </div>
                <button className="flex items-center gap-2 border border-[#E4E4E7] text-xs px-4 py-2.5 hover:border-[#111111] transition-colors">
                  <Filter size={13} /> Filter
                </button>
                <button className="flex items-center gap-2 border border-[#E4E4E7] text-xs px-4 py-2.5 hover:border-[#111111] transition-colors">
                  <Download size={13} /> Export
                </button>
                <button onClick={resetCatalog} className="flex items-center gap-2 border border-[#E4E4E7] text-xs px-4 py-2.5 hover:border-[#111111] transition-colors">
                  <RefreshCw size={13} /> Reset
                </button>
              </div>

              {savedFlash && (
                <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5">
                  <CheckCircle size={13} /> {savedFlash}
                </div>
              )}

              <div className="bg-white border border-[#E4E4E7] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#F0EBE3] bg-[#FAFAFA]">
                      {["Product", "Category", "Price", "Stock", "Status", "Actions"].map((h) => (
                        <th key={h} className="text-[10px] tracking-[0.18em] uppercase text-[#A1A1AA] py-3 px-5 text-left font-medium">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const stockCount = 5 + ((Number(product.id) * 11) % 50);
                      const inStock = stockCount > 12;

                      return (
                        <tr key={product.id} className="border-b border-[#F8F8F6] hover:bg-[#FAFAFA] transition-colors">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-12 bg-[#F5F0EA] overflow-hidden flex-shrink-0">
                              <Image src={product.image} alt={product.name} fill sizes="40px" className="object-cover" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-[#111111] line-clamp-1">{product.name}</p>
                              <p className="text-[10px] text-[#A1A1AA]">ID: {product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 text-xs text-[#71717A]">{product.category}</td>
                        <td className="py-3.5 px-5">
                          <div>
                            <p className="text-xs font-medium text-[#111111]">${product.price.toLocaleString()}</p>
                            {product.originalPrice && (
                              <p className="text-[10px] text-[#A1A1AA] line-through">${product.originalPrice.toLocaleString()}</p>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-1.5">
                            <div className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-red-500"}`} />
                            <span className="text-xs text-[#71717A]">{stockCount}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`text-[9px] tracking-wider uppercase px-2.5 py-1 ${
                            product.badge === "SALE" ? "bg-amber-50 text-amber-600" :
                            product.badge === "LIMITED" ? "bg-red-50 text-red-600" :
                            "bg-emerald-50 text-emerald-600"
                          }`}>
                            {product.badge || "Active"}
                          </span>
                        </td>
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-1.5">
                            <Link href={`/product/${product.id}`}
                              className="w-7 h-7 flex items-center justify-center border border-[#E4E4E7] hover:border-[#111111] transition-colors">
                              <Eye size={12} />
                            </Link>
                            <button onClick={() => openEdit(product)} aria-label="Edit product" className="w-7 h-7 flex items-center justify-center border border-[#E4E4E7] hover:border-[#C9A86A] hover:text-[#C9A86A] transition-colors">
                              <Edit2 size={12} />
                            </button>
                            <button onClick={() => removeProduct(product.id)} aria-label="Delete product" className="w-7 h-7 flex items-center justify-center border border-[#E4E4E7] hover:border-red-400 hover:text-red-400 transition-colors">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

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
                            <td className="py-3.5 px-5 text-sm font-medium">${order.total.toLocaleString()}</td>
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
                    { name: "Luxury Collection", pct: 42, value: "$119,595" },
                    { name: "Limited Edition", pct: 28, value: "$79,730" },
                    { name: "Summer Collection", pct: 18, value: "$51,255" },
                    { name: "Casual Luxe", pct: 12, value: "$34,170" },
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
              {[
                { title: "Store Information", fields: [
                  { label: "Store Name", value: "ARINAS" },
                  { label: "Store Email", value: "contact@arinas.com" },
                  { label: "Currency", value: "USD ($)" },
                  { label: "Language", value: "English" },
                ]},
                { title: "Shipping Settings", fields: [
                  { label: "Free Shipping Threshold", value: "$500" },
                  { label: "Default Shipping Cost", value: "$35" },
                ]},
              ].map((section) => (
                <div key={section.title} className="bg-white border border-[#E4E4E7] p-6">
                  <h3 className="text-sm font-medium text-[#111111] mb-5 pb-3 border-b border-[#F0EBE3]">{section.title}</h3>
                  <div className="space-y-4">
                    {section.fields.map((field) => (
                      <div key={field.label} className="grid grid-cols-2 items-center gap-4">
                        <label className="text-[11px] tracking-wider uppercase text-[#71717A] font-medium">{field.label}</label>
                        <input defaultValue={field.value}
                          className="border border-[#E4E4E7] px-3 py-2 text-sm focus:outline-none focus:border-[#C9A86A] transition-colors" />
                      </div>
                    ))}
                  </div>
                  <button className="mt-5 bg-[#111111] text-white text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 hover:bg-[#C9A86A] transition-colors">
                    Save Changes
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Product editor modal ── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <div className="relative bg-white w-full max-w-lg shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EBE3]">
              <h3 className="text-sm font-medium text-[#111111] tracking-wide">
                {isNew ? "New Product" : "Edit Product"}
              </h3>
              <button onClick={() => setEditing(null)} aria-label="Close" className="text-[#A1A1AA] hover:text-[#111111] transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {[
                { key: "name" as const, label: "Name", type: "text", placeholder: "Silk Evening Gown" },
                { key: "category" as const, label: "Category", type: "text", placeholder: "Dresses" },
                { key: "price" as const, label: "Price ($)", type: "number", placeholder: "2850" },
                { key: "originalPrice" as const, label: "Original Price ($) — optional", type: "number", placeholder: "3400" },
                { key: "image" as const, label: "Image URL", type: "text", placeholder: "https://…" },
                { key: "badge" as const, label: "Badge — optional (NEW / SALE / LIMITED)", type: "text", placeholder: "NEW" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="block text-[11px] tracking-wider uppercase text-[#71717A] font-medium mb-1.5">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={editing[f.key]}
                    placeholder={f.placeholder}
                    onChange={(e) => setEditing({ ...editing, [f.key]: e.target.value })}
                    className="w-full border border-[#E4E4E7] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A] transition-colors"
                  />
                </div>
              ))}

              {editing.image && (
                <div className="flex items-center gap-3 pt-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={editing.image} alt="" className="w-12 h-14 object-cover bg-[#F5F0EA]" />
                  <span className="text-[11px] text-[#A1A1AA]">Preview</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F0EBE3]">
              <button onClick={() => setEditing(null)} className="text-xs tracking-wider uppercase border border-[#E4E4E7] px-5 py-2.5 hover:border-[#111111] transition-colors">
                Cancel
              </button>
              <button onClick={saveProduct} className="text-xs tracking-[0.2em] uppercase bg-[#111111] text-white px-6 py-2.5 hover:bg-[#C9A86A] transition-colors">
                {isNew ? "Add Product" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
