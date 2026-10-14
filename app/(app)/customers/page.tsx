"use client";
import { useEffect, useState, useCallback } from "react";
import { Plus, Search } from "lucide-react";
import { useSession } from "@/components/Shell";
import { Modal, PageHeader, ReadOnlyNote } from "@/components/ui";
import { pkr } from "@/lib/format";

type Row = { id: string; name: string; email: string; city: string; invoices: number; revenue: number; outstanding: number };
export default function Customers() {
  const s = useSession(); const canWrite = s.role !== "viewer";
  const [q, setQ] = useState(""); const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<{ name: string; email: string; city: string } | null>(null); const [err, setErr] = useState("");
  const load = useCallback(async () => setRows((await (await fetch(`/api/customers?q=${encodeURIComponent(q)}`)).json()).rows), [q]);
  useEffect(() => { const t = setTimeout(load, 200); return () => clearTimeout(t); }, [load]);
  async function save() { const r = await fetch("/api/customers", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(form) }); if (r.ok) { setForm(null); load(); } else setErr((await r.json()).error); }
  return (
    <>
      <PageHeader title="Customers" sub="Ranked by lifetime revenue">{canWrite ? <button className="btn-primary" onClick={() => { setErr(""); setForm({ name: "", email: "", city: "Karachi" }); }}><Plus className="h-4 w-4" />Add customer</button> : <ReadOnlyNote />}</PageHeader>
      <div className="card">
        <div className="border-b border-slate-100 p-4"><div className="relative max-w-md"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" /><input className="input pl-9" placeholder="Search by name or city…" value={q} onChange={e => setQ(e.target.value)} /></div></div>
        <div className="overflow-x-auto"><table className="w-full min-w-[680px]"><thead className="bg-slate-50"><tr><th className="th">Customer</th><th className="th">City</th><th className="th text-right">Invoices</th><th className="th text-right">Revenue</th><th className="th text-right">Outstanding</th></tr></thead>
          <tbody className="divide-y divide-slate-100">{rows.map(c => <tr key={c.id} className="hover:bg-slate-50/60"><td className="td"><div className="font-medium">{c.name}</div><div className="text-xs text-slate-500">{c.email}</div></td><td className="td">{c.city}</td><td className="td text-right">{c.invoices}</td><td className="td text-right font-medium">{pkr(c.revenue)}</td><td className={`td text-right ${c.outstanding ? "text-amber-600" : "text-slate-400"}`}>{pkr(c.outstanding)}</td></tr>)}</tbody></table></div>
      </div>
      <Modal open={!!form} onClose={() => setForm(null)} title="Add customer">{form && <div className="space-y-3">
        {(["name", "email", "city"] as const).map(f => <div key={f}><label className="label capitalize">{f}</label><input className="input" value={form[f]} onChange={e => setForm({ ...form, [f]: e.target.value })} /></div>)}
        {err && <p className="text-sm text-rose-600">{err}</p>}
        <div className="flex justify-end gap-2 pt-2"><button className="btn-ghost" onClick={() => setForm(null)}>Cancel</button><button className="btn-primary" onClick={save}>Save</button></div>
      </div>}</Modal>
    </>
  );
}
