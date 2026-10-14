import { db } from "./db";
export function stats(tenantId: string) {
  const inv = db.invoices.filter(i => i.tenantId === tenantId);
  const sum = (a: typeof inv) => a.reduce((s, i) => s + i.total, 0);
  const now = new Date("2026-10-14T10:00:00Z");
  const months = Array.from({ length: 12 }, (_, k) => { const d = new Date(now.getFullYear(), now.getMonth() - 11 + k, 1); return { key: `${d.getFullYear()}-${d.getMonth()}`, month: d.toLocaleString("en", { month: "short" }), revenue: 0, invoices: 0 }; });
  inv.forEach(i => { const d = new Date(i.issuedAt); const m = months.find(x => x.key === `${d.getFullYear()}-${d.getMonth()}`); if (m) { m.invoices++; if (i.status === "paid") m.revenue += i.total; } });
  const byStatus = (["paid", "pending", "overdue", "draft"] as const).map(st => ({ name: st, value: inv.filter(i => i.status === st).length }));
  const catRev: Record<string, number> = {};
  inv.filter(i => i.status === "paid").forEach(i => i.items.forEach(it => { const p = db.products.find(x => x.id === it.productId); const c = p?.category ?? "Other"; catRev[c] = (catRev[c] ?? 0) + it.qty * it.price; }));
  const products = db.products.filter(p => p.tenantId === tenantId);
  return {
    kpis: { revenue: sum(inv.filter(i => i.status === "paid")), outstanding: sum(inv.filter(i => i.status === "pending")), overdue: sum(inv.filter(i => i.status === "overdue")), customers: db.customers.filter(c => c.tenantId === tenantId).length, lowStock: products.filter(p => p.stock <= p.reorderLevel).length, invoices: inv.length },
    monthly: months.map(({ key, ...m }) => m), byStatus,
    byCategory: Object.entries(catRev).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value),
    activity: db.activity.filter(a => a.tenantId === tenantId).slice(0, 8),
    lowStock: products.filter(p => p.stock <= p.reorderLevel).slice(0, 5),
  };
}
