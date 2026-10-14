"use client";
import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Trash2, CheckCircle2, ChevronLeft, ChevronRight, X, FileSearch } from "lucide-react";
import { useSession } from "@/components/Shell";
import { StatusBadge, Modal, ConfirmModal, EmptyState, SkeletonRows, SubSkeleton, PageHeader, ReadOnlyNote } from "@/components/ui";
import { pkr, date } from "@/lib/format";
import type { Invoice, Customer, Product } from "@/lib/types";

const tabs = ["all", "paid", "pending", "overdue", "draft"];
export default function Invoices() {
  const s = useSession(); const canWrite = s.role !== "viewer"; const canDelete = s.role === "admin";
  const [q, setQ] = useState(""); const [status, setStatus] = useState("all"); const [page, setPage] = useState(1);
  const [data, setData] = useState<{ rows: Invoice[]; total: number; pages: number } | null>(null);
  const [open, setOpen] = useState(false); const [toDelete, setToDelete] = useState<Invoice | null>(null); const [view, setView] = useState<Invoice | null>(null);
  const load = useCallback(async () => { const r = await fetch(`/api/invoices?q=${encodeURIComponent(q)}&status=${status}&page=${page}`); setData(await r.json()); }, [q, status, page]);
  useEffect(() => { const t = setTimeout(load, 200); return () => clearTimeout(t); }, [load]);
  async function markPaid(id: string) { await fetch(`/api/invoices/${id}`, { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ status: "paid" }) }); load(); }
  async function del(id: string) { setToDelete(null); await fetch(`/api/invoices/${id}`, { method: "DELETE" }); load(); }
  const clear = () => { setQ(""); setStatus("all"); setPage(1); };
  const empty = <EmptyState icon={FileSearch} title="No invoices match your filters." action={<button className="btn-ghost mt-2" onClick={clear}>Clear filters</button>} />;
  return (
    <>
      <PageHeader title="Invoices" sub={data ? `${data.total} invoices` : <SubSkeleton />}>{canWrite ? <button className="btn-primary" onClick={() => setOpen(true)}><Plus className="h-4 w-4" />New invoice</button> : <ReadOnlyNote />}</PageHeader>
      <div className="card">
        <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 p-4">
          <div className="relative min-w-[220px] flex-1"><Search aria-hidden="true" className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" /><input className="input pl-9" aria-label="Search invoices" placeholder="Search by invoice # or customer…" value={q} onChange={e => { setQ(e.target.value); setPage(1); }} /></div>
          <div role="group" aria-label="Filter by status" className="flex flex-wrap gap-1 rounded-lg bg-slate-100 p-1">{tabs.map(t => <button key={t} aria-pressed={status === t} onClick={() => { setStatus(t); setPage(1); }} className={`min-h-[44px] rounded-md px-3 py-1.5 text-xs font-medium capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 sm:min-h-0 ${status === t ? "bg-white shadow-sm" : "text-slate-700"}`}>{t}</button>)}</div>
        </div>
        <ul className="divide-y divide-slate-100 sm:hidden">{!data ? Array.from({ length: 6 }, (_, k) => <li key={k} className="p-4"><div className="h-4 animate-pulse rounded bg-slate-100" /></li>) : data.rows.length ? data.rows.map(i => (
          <li key={i.id} className="flex justify-between gap-3 p-4"><div className="min-w-0"><button className="link-focus min-h-[44px] font-medium text-indigo-700 hover:underline" onClick={() => setView(i)}>{i.number}</button><div className="truncate text-sm text-slate-600">{i.customerName}</div></div><div className="flex flex-col items-end gap-1"><span className="font-medium tabular-nums">{pkr(i.total)}</span><StatusBadge s={i.status} /></div></li>)) : <li>{empty}</li>}</ul>
        <div className="hidden overflow-x-auto sm:block"><table className="w-full min-w-[720px]"><thead className="bg-slate-50"><tr><th className="th">Invoice</th><th className="th">Customer</th><th className="th">Issued</th><th className="th">Due</th><th className="th">Status</th><th className="th text-right">Amount</th><th className="th"><span className="sr-only">Actions</span></th></tr></thead>
          <tbody className="divide-y divide-slate-100">{!data && <SkeletonRows cols={7} />}{data?.rows.map(i => (
            <tr key={i.id} className="hover:bg-slate-50/60">
              <td className="td"><button className="link-focus min-h-[44px] font-medium text-indigo-700 hover:underline" aria-label={`View invoice ${i.number}`} onClick={() => setView(i)}>{i.number}</button></td><td className="td">{i.customerName}</td><td className="td text-slate-500">{date(i.issuedAt)}</td><td className="td text-slate-500">{date(i.dueAt)}</td><td className="td"><StatusBadge s={i.status} /></td><td className="td text-right font-medium">{pkr(i.total)}</td>
              <td className="td text-right whitespace-nowrap">{canWrite && i.status !== "paid" && <button title="Mark as paid" aria-label={`Mark ${i.number} as paid`} onClick={() => markPaid(i.id)} className="btn text-emerald-700 hover:bg-emerald-50"><CheckCircle2 className="h-4 w-4" /></button>}{canDelete && <button title="Delete" aria-label={`Delete ${i.number}`} onClick={() => setToDelete(i)} className="btn-danger"><Trash2 className="h-4 w-4" /></button>}</td>
            </tr>))}
            {data && !data.rows.length && <tr><td colSpan={7}>{empty}</td></tr>}
          </tbody></table></div>
        {data && <div className="flex items-center justify-between border-t border-slate-100 p-4 text-sm text-slate-500"><span>Page {page} of {data.pages}</span><div className="flex gap-2"><button className="btn-ghost" aria-label="Previous page" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></button><button className="btn-ghost" aria-label="Next page" disabled={page >= data.pages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></button></div></div>}
      </div>
      <ConfirmModal open={!!toDelete} title="Delete invoice?" body={`${toDelete?.number ?? ""} will be permanently removed. This cannot be undone.`} onCancel={() => setToDelete(null)} onConfirm={() => toDelete && del(toDelete.id)} />
      <NewInvoice open={open} onClose={() => setOpen(false)} onDone={() => { setOpen(false); setPage(1); setStatus("all"); load(); }} />
      <Modal open={!!view} onClose={() => setView(null)} title={view?.number ?? ""}>{view && <div className="space-y-3 text-sm"><div className="flex justify-between"><span className="text-slate-500">Customer</span><span className="font-medium">{view.customerName}</span></div><div className="flex justify-between"><span className="text-slate-500">Status</span><StatusBadge s={view.status} /></div><table className="w-full"><tbody className="divide-y divide-slate-100">{view.items.map((it, k) => <tr key={k}><td className="py-2">{it.name} × {it.qty}</td><td className="py-2 text-right">{pkr(it.qty * it.price)}</td></tr>)}</tbody></table><div className="flex justify-between border-t pt-3 text-base font-bold"><span>Total</span><span>{pkr(view.total)}</span></div></div>}</Modal>
    </>
  );
}

function NewInvoice({ open, onClose, onDone }: { open: boolean; onClose: () => void; onDone: () => void }) {
  const [customers, setCustomers] = useState<Customer[]>([]); const [products, setProducts] = useState<Product[]>([]);
  const [customerId, setCustomerId] = useState(""); const [items, setItems] = useState([{ productId: "", qty: 1 }]); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  useEffect(() => { if (!open) return; fetch("/api/customers").then(r => r.json()).then(d => setCustomers(d.rows)); fetch("/api/products").then(r => r.json()).then(d => setProducts(d.rows)); setErr(""); setItems([{ productId: "", qty: 1 }]); setCustomerId(""); }, [open]);
  const total = items.reduce((s, it) => s + (products.find(p => p.id === it.productId)?.price ?? 0) * it.qty, 0);
  async function submit() {
    setBusy(true); setErr("");
    const r = await fetch("/api/invoices", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ customerId, items: items.filter(i => i.productId) }) });
    setBusy(false); if (r.ok) onDone(); else setErr((await r.json()).error);
  }
  return (
    <Modal open={open} onClose={onClose} title="New invoice">
      <div className="space-y-4">
        <div><label htmlFor="inv-customer" className="label">Customer</label><select id="inv-customer" className="input" value={customerId} onChange={e => setCustomerId(e.target.value)}><option value="">Select customer…</option>{customers.map(c => <option key={c.id} value={c.id}>{c.name} — {c.city}</option>)}</select></div>
        <div className="space-y-2"><span id="inv-items" className="label">Line items</span>{items.map((it, k) => (
          <div key={k} className="flex gap-2"><select aria-label={`Product for line ${k + 1}`} className="input" value={it.productId} onChange={e => setItems(items.map((x, j) => j === k ? { ...x, productId: e.target.value } : x))}><option value="">Product…</option>{products.map(p => <option key={p.id} value={p.id} disabled={p.stock === 0}>{p.name} ({pkr(p.price)}, {p.stock} in stock)</option>)}</select><input aria-label={`Quantity for line ${k + 1}`} className="input w-20" type="number" min={1} value={it.qty} onChange={e => setItems(items.map((x, j) => j === k ? { ...x, qty: Number(e.target.value) } : x))} />{items.length > 1 && <button aria-label={`Remove line ${k + 1}`} className="btn-danger" onClick={() => setItems(items.filter((_, j) => j !== k))}><X className="h-4 w-4" /></button>}</div>))}
          <button className="link-focus min-h-[44px] text-sm font-medium text-indigo-700" onClick={() => setItems([...items, { productId: "", qty: 1 }])}>+ Add item</button></div>
        <div className="flex justify-between rounded-lg bg-slate-50 p-3 text-sm"><span>Total</span><span className="font-bold">{pkr(total)}</span></div>
        {err && <p role="alert" className="text-sm text-rose-700">{err}</p>}
        <div className="flex justify-end gap-2"><button className="btn-ghost" onClick={onClose}>Cancel</button><button className="btn-primary" disabled={busy || !customerId} onClick={submit}>Create invoice</button></div>
      </div>
    </Modal>
  );
}
