import { getSession } from "@/lib/auth";
import { stats } from "@/lib/stats";
import { pkr, date } from "@/lib/format";
import { RevenueChart, StatusPie, CategoryBars } from "@/components/Charts";
import { Wallet, Clock, AlertTriangle, Users, PackageX, FileText } from "lucide-react";

export const dynamic = "force-dynamic";
export default async function Dashboard() {
  const s = (await getSession())!;
  const d = stats(s.tenantId);
  const kpis = [
    { label: "Revenue collected", value: pkr(d.kpis.revenue), icon: Wallet, c: "text-emerald-600 bg-emerald-50" },
    { label: "Outstanding", value: pkr(d.kpis.outstanding), icon: Clock, c: "text-amber-600 bg-amber-50" },
    { label: "Overdue", value: pkr(d.kpis.overdue), icon: AlertTriangle, c: "text-rose-600 bg-rose-50" },
    { label: "Invoices", value: d.kpis.invoices, icon: FileText, c: "text-indigo-600 bg-indigo-50" },
    { label: "Customers", value: d.kpis.customers, icon: Users, c: "text-sky-600 bg-sky-50" },
    { label: "Low-stock items", value: d.kpis.lowStock, icon: PackageX, c: "text-orange-600 bg-orange-50" },
  ];
  return (
    <>
      <div className="mb-6"><h1 className="text-2xl font-bold">Good to see you, {s.name.split(" ")[0]} 👋</h1><p className="text-sm text-slate-500">Here&apos;s how your business is doing over the last 12 months.</p></div>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {kpis.map(k => <div key={k.label} className="card p-4"><div className={`grid h-9 w-9 place-items-center rounded-lg ${k.c}`}><k.icon className="h-4 w-4" /></div><div className="mt-3 text-lg font-bold">{k.value}</div><div className="text-xs text-slate-500">{k.label}</div></div>)}
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="card p-5 xl:col-span-2"><h2 className="font-semibold">Monthly revenue</h2><p className="mb-4 text-xs text-slate-500">Paid invoices, PKR</p><RevenueChart data={d.monthly} /></div>
        <div className="card p-5"><h2 className="font-semibold">Invoice status</h2><p className="mb-4 text-xs text-slate-500">All time</p><StatusPie data={d.byStatus} /></div>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="card p-5"><h2 className="mb-4 font-semibold">Revenue by category</h2><CategoryBars data={d.byCategory} /></div>
        <div className="card p-5"><h2 className="mb-4 font-semibold">Low stock alerts</h2>
          <ul className="space-y-3">{d.lowStock.length ? d.lowStock.map(p => <li key={p.id} className="flex items-center justify-between text-sm"><div><div className="font-medium">{p.name}</div><div className="text-xs text-slate-500">{p.sku}</div></div><span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">{p.stock} left</span></li>) : <li className="text-sm text-slate-500">All products are well stocked.</li>}</ul>
        </div>
        <div className="card p-5"><h2 className="mb-4 font-semibold">Recent activity</h2>
          <ul className="space-y-3">{d.activity.map(a => <li key={a.id} className="text-sm"><span className="font-medium">{a.actor}</span> <span className="text-slate-600">{a.action}</span><div className="text-xs text-slate-400">{date(a.at)}</div></li>)}</ul>
        </div>
      </div>
    </>
  );
}
