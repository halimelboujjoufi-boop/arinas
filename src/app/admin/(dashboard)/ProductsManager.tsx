"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import {
  Plus, Search, Edit2, Trash2, X, Check, UploadCloud, Star, Loader2, CheckCircle,
} from "lucide-react";
import { useT } from "@/i18n/provider";
import type { AdminProduct, ProductStatus } from "@/lib/products/types";

type Form = {
  id?: string;
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  stock: string;
  images: string[];
  sizes: string;
  colors: string;
  status: ProductStatus;
  featured: boolean;
};

const emptyForm: Form = {
  name: "", description: "", price: "", originalPrice: "", category: "",
  stock: "0", images: [], sizes: "", colors: "", status: "published", featured: false,
};

function toForm(p: AdminProduct): Form {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    price: String(p.price),
    originalPrice: p.originalPrice != null ? String(p.originalPrice) : "",
    category: p.category,
    stock: String(p.stock ?? 0),
    images: p.images?.length ? p.images : p.image ? [p.image] : [],
    sizes: (p.sizes ?? []).join(", "),
    colors: (p.colors ?? []).join(", "),
    status: p.status,
    featured: p.featured,
  };
}

const GOLD = "#C9A86A";

export default function ProductsManager() {
  const t = useT();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Form | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [flash, setFlash] = useState("");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const statusLabel: Record<ProductStatus, string> = {
    draft: t("admin.draft"),
    published: t("admin.published"),
    out_of_stock: t("admin.outOfStock"),
  };
  const statusStyle: Record<ProductStatus, string> = {
    draft: "bg-amber-50 text-amber-700",
    published: "bg-emerald-50 text-emerald-700",
    out_of_stock: "bg-red-50 text-red-600",
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", { cache: "no-store" });
      const data = await res.json();
      setProducts(Array.isArray(data.products) ? data.products : []);
    } catch {
      setProducts([]);
    }
    setLoading(false);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { refresh(); }, []);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      return true;
    });
  }, [products, search, categoryFilter, statusFilter]);

  const flashOk = (msg: string) => { setFlash(msg); setError(""); setTimeout(() => setFlash(""), 2500); };

  const openNew = () => { setIsNew(true); setEditing({ ...emptyForm }); setError(""); };
  const openEdit = (p: AdminProduct) => { setIsNew(false); setEditing(toForm(p)); setError(""); };

  const save = async () => {
    if (!editing) return;
    if (!editing.name.trim() || !editing.price.trim()) { setError(t("admin.required")); return; }
    const payload = {
      ...editing,
      image: editing.images[0] ?? "",
      sizes: editing.sizes,
      colors: editing.colors,
    };
    const url = isNew ? "/api/admin/products" : `/api/admin/products/${editing.id}`;
    const res = await fetch(url, {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const b = await res.json().catch(() => null);
      setError(b?.error || "Save failed.");
      return;
    }
    setEditing(null);
    flashOk(t("admin.saved"));
    refresh();
  };

  const remove = async (id: string) => {
    if (!window.confirm(t("admin.confirmDelete"))) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) { flashOk(t("admin.deleted")); refresh(); }
    else { const b = await res.json().catch(() => null); setError(b?.error || "Delete failed."); }
  };

  const bulk = async (action: string, extra: Record<string, unknown> = {}) => {
    const ids = Array.from(selected);
    if (ids.length === 0) return;
    if (action === "delete" && !window.confirm(t("admin.confirmBulkDelete"))) return;
    const res = await fetch("/api/admin/products/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, ids, ...extra }),
    });
    if (res.ok) { setSelected(new Set()); flashOk(t("admin.saved")); refresh(); }
    else { const b = await res.json().catch(() => null); setError(b?.error || "Action failed."); }
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files || !editing) return;
    setUploading(true);
    const urls: string[] = [];
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
        const b = await res.json();
        if (res.ok && b.url) urls.push(b.url);
        else setError(b?.error || "Upload failed.");
      } catch { setError("Upload failed."); }
    }
    setEditing((e) => (e ? { ...e, images: [...e.images, ...urls] } : e));
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const toggleSel = (id: string) =>
    setSelected((s) => { const n = new Set(s); if (n.has(id)) n.delete(id); else n.add(id); return n; });
  const allShownSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id));
  const toggleAll = () =>
    setSelected((s) => {
      const n = new Set(s);
      if (allShownSelected) filtered.forEach((p) => n.delete(p.id));
      else filtered.forEach((p) => n.add(p.id));
      return n;
    });

  return (
    <div className="space-y-5" style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute start-3 top-1/2 -translate-y-1/2 text-[#A1A1AA]" />
          <input
            placeholder={t("admin.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full ps-9 pe-4 py-2.5 text-xs border border-[#E4E4E7] bg-white focus:outline-none focus:border-[#C9A86A]"
          />
        </div>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
          className="text-xs border border-[#E4E4E7] bg-white px-3 py-2.5 focus:outline-none focus:border-[#C9A86A]">
          <option value="all">{t("admin.allCategories")}</option>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs border border-[#E4E4E7] bg-white px-3 py-2.5 focus:outline-none focus:border-[#C9A86A]">
          <option value="all">{t("admin.allStatuses")}</option>
          <option value="published">{t("admin.published")}</option>
          <option value="draft">{t("admin.draft")}</option>
          <option value="out_of_stock">{t("admin.outOfStock")}</option>
        </select>
        <button onClick={openNew}
          className="flex items-center justify-center gap-2 bg-[#111111] text-white text-xs tracking-wider px-4 py-2.5 hover:bg-[#C9A86A] transition-colors lg:ms-auto">
          <Plus size={14} /> {t("admin.newProduct")}
        </button>
      </div>

      {flash && (
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-4 py-2.5">
          <CheckCircle size={13} /> {flash}
        </div>
      )}
      {error && (
        <div className="text-xs text-red-700 bg-red-50 border border-red-200 px-4 py-2.5">{error}</div>
      )}

      {/* Bulk bar */}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 bg-[#FAF7F3] border border-[#E6DCC9] px-4 py-2.5 text-xs">
          <span className="font-medium text-[#111111]">{selected.size} {t("admin.selected")}</span>
          <button onClick={() => bulk("status", { status: "published" })} className="px-3 py-1.5 border border-[#E4E4E7] bg-white hover:border-[#111111]">{t("admin.bulkPublish")}</button>
          <button onClick={() => bulk("status", { status: "draft" })} className="px-3 py-1.5 border border-[#E4E4E7] bg-white hover:border-[#111111]">{t("admin.bulkDraft")}</button>
          <button onClick={() => bulk("featured", { featured: true })} className="px-3 py-1.5 border border-[#E4E4E7] bg-white hover:border-[#111111]">{t("admin.bulkFeature")}</button>
          <button onClick={() => bulk("delete")} className="px-3 py-1.5 border border-red-200 text-red-600 bg-white hover:border-red-400">{t("admin.bulkDelete")}</button>
        </div>
      )}

      {/* Table (scrolls horizontally on mobile) */}
      <div className="bg-white border border-[#E4E4E7] overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="border-b border-[#F0EBE3] bg-[#FAFAFA] text-[10px] tracking-[0.15em] uppercase text-[#A1A1AA]">
              <th className="py-3 px-4 w-8"><input type="checkbox" checked={allShownSelected} onChange={toggleAll} className="accent-[#C9A86A]" /></th>
              <th className="py-3 px-2 text-start">{t("admin.colProduct")}</th>
              <th className="py-3 px-3 text-start hidden sm:table-cell">{t("admin.colCategory")}</th>
              <th className="py-3 px-3 text-start">{t("admin.colPrice")}</th>
              <th className="py-3 px-3 text-start hidden sm:table-cell">{t("admin.colStock")}</th>
              <th className="py-3 px-3 text-start">{t("admin.colStatus")}</th>
              <th className="py-3 px-4 text-end">{t("admin.colActions")}</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="py-12 text-center text-xs text-[#A1A1AA]">{t("admin.loading")}</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={7} className="py-12 text-center text-xs text-[#A1A1AA]">{t("admin.noProducts")}</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id} className="border-b border-[#F8F8F6] hover:bg-[#FAFAFA]">
                <td className="py-3 px-4"><input type="checkbox" checked={selected.has(p.id)} onChange={() => toggleSel(p.id)} className="accent-[#C9A86A]" /></td>
                <td className="py-3 px-2">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-12 bg-[#F5F0EA] overflow-hidden flex-shrink-0">
                      {p.image ? <Image src={p.image} alt={p.name} fill sizes="40px" className="object-cover" /> : null}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-[#111111] truncate flex items-center gap-1">
                        {p.featured && <Star size={11} className="text-[#C9A86A] fill-[#C9A86A]" />}{p.name}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-3 text-xs text-[#71717A] hidden sm:table-cell">{p.category}</td>
                <td className="py-3 px-3 text-xs font-medium text-[#111111]">{p.price.toLocaleString()} DH</td>
                <td className="py-3 px-3 text-xs text-[#71717A] hidden sm:table-cell">{p.stock}</td>
                <td className="py-3 px-3">
                  <span className={`text-[9px] tracking-wide uppercase px-2.5 py-1 ${statusStyle[p.status]}`}>{statusLabel[p.status]}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-1.5">
                    <button onClick={() => openEdit(p)} aria-label="Edit" className="w-7 h-7 flex items-center justify-center border border-[#E4E4E7] hover:border-[#C9A86A] hover:text-[#C9A86A]"><Edit2 size={12} /></button>
                    <button onClick={() => remove(p.id)} aria-label="Delete" className="w-7 h-7 flex items-center justify-center border border-[#E4E4E7] hover:border-red-400 hover:text-red-400"><Trash2 size={12} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Editor modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setEditing(null)} />
          <div className="relative bg-white w-full max-w-lg shadow-2xl z-10 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#F0EBE3] sticky top-0 bg-white">
              <h3 className="text-sm font-medium text-[#111111]">{isNew ? t("admin.newProduct") : t("admin.edit")}</h3>
              <button onClick={() => setEditing(null)} aria-label="Close" className="text-[#A1A1AA] hover:text-[#111111]"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-4">
              {/* Images */}
              <div>
                <label className="block text-[11px] tracking-wider uppercase text-[#71717A] font-medium mb-2">{t("admin.images")}</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editing.images.map((url, i) => (
                    <div key={url + i} className="relative w-16 h-20 bg-[#F5F0EA] overflow-hidden group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button onClick={() => setEditing((e) => e ? { ...e, images: e.images.filter((_, j) => j !== i) } : e)}
                        className="absolute top-0.5 end-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"><X size={11} /></button>
                    </div>
                  ))}
                </div>
                <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => uploadFiles(e.target.files)} className="hidden" />
                <button onClick={() => fileRef.current?.click()} disabled={uploading}
                  className="flex items-center gap-2 text-xs border border-[#E4E4E7] px-4 py-2.5 hover:border-[#111111] disabled:opacity-50">
                  {uploading ? <Loader2 size={13} className="animate-spin" /> : <UploadCloud size={13} />}
                  {uploading ? t("admin.uploading") : t("admin.uploadImages")}
                </button>
                <input value={editing.images.join(", ")} onChange={(e) => setEditing({ ...editing, images: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                  placeholder={t("admin.imageUrlHint")}
                  className="w-full mt-2 border border-[#E4E4E7] px-3 py-2 text-xs focus:outline-none focus:border-[#C9A86A]" />
              </div>

              {([
                { k: "name" as const, label: t("admin.name"), type: "text" },
                { k: "category" as const, label: t("admin.category"), type: "text" },
              ]).map((f) => (
                <Field key={f.k} label={f.label}>
                  <input type={f.type} value={editing[f.k]} onChange={(e) => setEditing({ ...editing, [f.k]: e.target.value })}
                    className="w-full border border-[#E4E4E7] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]" />
                </Field>
              ))}

              <Field label={t("admin.description")}>
                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3}
                  className="w-full border border-[#E4E4E7] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A] resize-none" />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label={t("admin.price")}>
                  <input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                    className="w-full border border-[#E4E4E7] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]" />
                </Field>
                <Field label={t("admin.originalPrice")}>
                  <input type="number" value={editing.originalPrice} onChange={(e) => setEditing({ ...editing, originalPrice: e.target.value })}
                    className="w-full border border-[#E4E4E7] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]" />
                </Field>
                <Field label={t("admin.stock")}>
                  <input type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: e.target.value })}
                    className="w-full border border-[#E4E4E7] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]" />
                </Field>
                <Field label={t("admin.status")}>
                  <select value={editing.status} onChange={(e) => setEditing({ ...editing, status: e.target.value as ProductStatus })}
                    className="w-full border border-[#E4E4E7] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A] bg-white">
                    <option value="published">{t("admin.published")}</option>
                    <option value="draft">{t("admin.draft")}</option>
                    <option value="out_of_stock">{t("admin.outOfStock")}</option>
                  </select>
                </Field>
              </div>

              <Field label={t("admin.sizes")}>
                <input value={editing.sizes} onChange={(e) => setEditing({ ...editing, sizes: e.target.value })} placeholder="XS, S, M, L, XL"
                  className="w-full border border-[#E4E4E7] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]" />
              </Field>
              <Field label={t("admin.colors")}>
                <input value={editing.colors} onChange={(e) => setEditing({ ...editing, colors: e.target.value })} placeholder="#000000, #B89A6A"
                  className="w-full border border-[#E4E4E7] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A86A]" />
              </Field>

              <label className="flex items-center gap-3 cursor-pointer pt-1">
                <input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} className="w-4 h-4 accent-[#C9A86A]" />
                <span className="text-sm text-[#111111] flex items-center gap-1.5"><Star size={14} style={{ color: GOLD }} /> {t("admin.featuredProduct")}</span>
              </label>

              {error && <p className="text-xs text-red-600">{error}</p>}
            </div>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#F0EBE3] sticky bottom-0 bg-white">
              <button onClick={() => setEditing(null)} className="text-xs tracking-wider uppercase border border-[#E4E4E7] px-5 py-2.5 hover:border-[#111111]">{t("admin.cancel")}</button>
              <button onClick={save} className="text-xs tracking-[0.2em] uppercase bg-[#111111] text-white px-6 py-2.5 hover:bg-[#C9A86A] flex items-center gap-2">
                <Check size={14} /> {isNew ? t("admin.addProduct") : t("admin.saveChanges")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] tracking-wider uppercase text-[#71717A] font-medium mb-1.5">{label}</label>
      {children}
    </div>
  );
}
