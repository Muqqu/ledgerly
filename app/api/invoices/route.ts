import { db, newId, log } from "@/lib/db";
import { guard, isRes, json } from "@/lib/api";
import type { LineItem } from "@/lib/types";

export async function GET(req: Request) {
  const s = await guard(); if (isRes(s)) return s;
  const u = new URL(req.url);
  const q = (u.searchParams.get("q") ?? "").toLowerCase();
  const status = u.searchParams.get("status") ?? "all";
  const page = Math.max(1, Number(u.searchParams.get("page") ?? 1)); const size = 10;
  let rows = db.invoices.filter(i => i.tenantId === s.tenantId);   // tenant isolation
  if (status !== "all") rows = rows.filter(i => i.status === status);
  if (q) rows = rows.filter(i => i.number.toLowerCase().includes(q) || i.customerName.toLowerCase().includes(q));
  rows = rows.sort((a, b) => b.issuedAt.localeCompare(a.issuedAt));
  return json({ total: rows.length, page, pages: Math.max(1, Math.ceil(rows.length / size)), rows: rows.slice((page - 1) * size, page * size) });
}

export async function POST(req: Request) {
  const s = await guard("write"); if (isRes(s)) return s;
  const body = await req.json().catch(() => null);
  const cust = db.customers.find(c => c.id === body?.customerId && c.tenantId === s.tenantId);
  if (!cust || !Array.isArray(body?.items) || !body.items.length) return json({ error: "Customer and at least one line item are required" }, 422);
  const items: LineItem[] = [];
  for (const it of body.items) {
    const p = db.products.find(x => x.id === it.productId && x.tenantId === s.tenantId);
    const qty = Math.floor(Number(it.qty));
    if (!p || !(qty > 0)) return json({ error: "Invalid line item" }, 422);
    if (p.stock < qty) return json({ error: `Insufficient stock for ${p.name} (available ${p.stock})` }, 422);
    items.push({ productId: p.id, name: p.name, qty, price: p.price });
  }
  items.forEach(it => { const p = db.products.find(x => x.id === it.productId)!; p.stock -= it.qty; });
  const count = db.invoices.filter(i => i.tenantId === s.tenantId).length;
  const now = new Date();
  const inv = { id: newId("inv"), tenantId: s.tenantId, number: `INV-2026-${String(count + 1).padStart(4, "0")}`, customerId: cust.id, customerName: cust.name, items, total: items.reduce((a, b) => a + b.qty * b.price, 0), status: "pending" as const, issuedAt: now.toISOString(), dueAt: new Date(now.getTime() + 30 * 864e5).toISOString() };
  db.invoices.push(inv); log(s.tenantId, s.name, `created invoice ${inv.number}`);
  return json(inv, 201);
}
