import { db, newId, log } from "@/lib/db";
import { guard, isRes, json } from "@/lib/api";

export async function GET(req: Request) {
  const s = await guard(); if (isRes(s)) return s;
  const q = (new URL(req.url).searchParams.get("q") ?? "").toLowerCase();
  const rows = db.customers.filter(c => c.tenantId === s.tenantId && (!q || c.name.toLowerCase().includes(q) || c.city.toLowerCase().includes(q))).map(c => {
    const inv = db.invoices.filter(i => i.customerId === c.id);
    return { ...c, invoices: inv.length, revenue: inv.filter(i => i.status === "paid").reduce((a, b) => a + b.total, 0), outstanding: inv.filter(i => i.status === "pending" || i.status === "overdue").reduce((a, b) => a + b.total, 0) };
  }).sort((a, b) => b.revenue - a.revenue);
  return json({ rows });
}
export async function POST(req: Request) {
  const s = await guard("write"); if (isRes(s)) return s;
  const b = await req.json().catch(() => ({}));
  if (!b.name || !/^\S+@\S+\.\S+$/.test(b.email ?? "")) return json({ error: "Name and a valid email are required" }, 422);
  const c = { id: newId("c"), tenantId: s.tenantId, name: String(b.name), email: String(b.email), city: String(b.city || "Karachi"), createdAt: new Date().toISOString() };
  db.customers.push(c); log(s.tenantId, s.name, `added customer ${c.name}`);
  return json(c, 201);
}
