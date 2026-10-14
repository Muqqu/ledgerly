"use client";
import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Trash2, Pencil } from "lucide-react";
import { useSession } from "@/components/Shell";
import { Modal, PageHeader, ReadOnlyNote } from "@/components/ui";
import { pkr } from "@/lib/format";
import type { Product } from "@/lib/types";

type Form = { id?: string; name: string; category: string; price: number; stock: number };
export default function Products() {
  const s = useSession(); const canWrite = s.role !== "viewer"; const canDelete = s.role === "admin";
  const [q, setQ] = useState(""); const [cat, setCat] = useState("all");
  const [rows, setRows] = useState<Product[]>([]); const [cats, setCats] = useState<string[]>([]);
  const [form, setForm] = useState<Form | null>(null); const [err, setErr] = useState("");
  const load = useCallback(async () => { const d = await (await fetch(`/api/products?q=${encodeURIComponent(q)}&category=${cat}`)).json(); setRows(d.rows); setCats(d.categories); }, [q, cat]);
  useEffect(() => { const t = setTimeout(load, 200); return () => clearTimeout(t); }, [load]);
  async function save() {
    if (!form) return; setErr("");
    const r = await fetch(form.id ? `/api/products/${form.id}` : "/api/products", { method: form.id ? "PATCH" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) });
    if (r.ok) { setForm(null); load(); } else setErr((await r.json()).error);
  }
  async function del(id: string) { if (confirm("Delete this product?")) { await fetch(`/api/products/${id}`, { method: "DELETE" }); load(); } }
  return (
    <>
      <PageHeader title="Inventory" sub={`${rows.length} products`}>{canWrite ? <button className="btn-primary" onClick={() => { setErr(""); setForm({ name: "", category: cats[0] ?? "Electronics", price: 0, stock: 0 }); }}><Plus className="h-4 w-4" />Add product</button> : <ReadOnlyNote />}</PageHeader>
      <div className="card">
        <div className="flex flex-wrap gap-3 border-b border-slate-100 p-4">
          <div className="relative min-w-[220px] flex-1"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input className="input pl-9" placeholder="Search by name or SKU…" value={q} onChange={e => setQ(e.target.value)} /></div>
          <select className="input w-auto" value={cat} onChange={e => setCat(e.target.value)}><option value="all">All categories</option><option value="low">⚠ Low stock only</option>{cats.map(c => <option key={c}>{c}</option>)}</select>
        </div>
        <div className="overflow-x-auto"><table className="w-full min-w-[680px]"><thead className="bg-slate-50"><tr><th className="th">SKU</th><th className="th">Product</th><th className="th">Category</th><th className="th text-right">Price</th><th className="th">Stock</th><th className="th" /></tr></thead>
          <tbody className="divide-y divide-slate-100">{rows.map(p => { const low = p.stock <= p.reorderLevel; const pct = Math.min(100, (p.stock / 120) * 100); return (
            <tr key={p.id} className="hover:bg-slate-50/60"><td className="td font-mono text-xs text-slate-500">{p.sku}</td><td className="td font-medium">{p.name}</td><td className="td"><span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">{p.category}</span></td><td className="td text-right">{pkr(p.price)}</td>
              <td className="td"><div className="flex items-center gap-2"><div className="h-1.5 w-24 rounded-full bg-slate-100"><div className={`h-1.5 rounded-full ${low ? "bg-orange-500" : "bg-emerald-500"}`} style={{ width: `${pct}%` }} /></div><span className={low ? "font-medium text-orange-600" : ""}>{p.stock}</span></div></td>
              <td className="td text-right whitespace-nowrap">{canWrite && <button className="btn text-slate-500 hover:bg-slate-100" onClick={() => { setErr(""); setForm({ id: p.id, name: p.name, category: p.category, price: p.price, stock: p.stock }); }}><Pencil className="h-4 w-4" /></button>}{canDelete && <button className="btn-danger" onClick={() => del(p.id)}><Trash2 className="h-4 w-4" /></button>}</td></tr>); })}
            {!rows.length && <tr><td colSpan={6} className="p-10 text-center text-sm text-slate-500">No products found.</td></tr>}
          </tbody></table></div>
      </div>
      <Modal open={!!form} onClose={() => setForm(null)} title={form?.id ? "Edit product" : "Add product"}>{form && <div className="space-y-3">
        <div><label className="label">Name</label><input className="input" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
        <div><label className="label">Category</label><input className="input" list="cats" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /><datalist id="cats">{cats.map(c => <option key={c} value={c} />)}</datalist></div>
        <div className="grid grid-cols-2 gap-3"><div><label className="label">Price (PKR)</label><input className="input" type="number" value={form.price} onChange={e => setForm({ ...form, price: Number(e.target.value) })} /></div><div><label className="label">Stock</label><input className="input" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: Number(e.target.value) })} /></div></div>
        {err && <p className="text-sm text-rose-600">{err}</p>}
        <div className="flex justify-end gap-2 pt-2"><button className="btn-ghost" onClick={() => setForm(null)}>Cancel</button><button className="btn-primary" onClick={save}>Save</button></div>
      </div>}</Modal>
    </>
  );
}
