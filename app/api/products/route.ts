import { db, newId, log } from "@/lib/db";
import { guard, isRes, json } from "@/lib/api";

export async function GET(req: Request) {
  const s = await guard(); if (isRes(s)) return s;
  const u = new URL(req.url); const q = (u.searchParams.get("q") ?? "").toLowerCase(); const cat = u.searchParams.get("category") ?? "all";
  let rows = db.products.filter(p => p.tenantId === s.tenantId);
  if (cat === "low") rows = rows.filter(p => p.stock <= p.reorderLevel); else if (cat !== "all") rows = rows.filter(p => p.category === cat);
  if (q) rows = rows.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  return json({ rows, categories: [...new Set(db.products.filter(p => p.tenantId === s.tenantId).map(p => p.category))] });
}
export async function POST(req: Request) {
  const s = await guard("write"); if (isRes(s)) return s;
  const b = await req.json().catch(() => ({}));
  if (!b.name || !(Number(b.price) > 0) || !b.category) return json({ error: "Name, category and a positive price are required" }, 422);
  const n = db.products.filter(p => p.tenantId === s.tenantId).length;
  const p = { id: newId("p"), tenantId: s.tenantId, sku: b.sku || `SKU-${2000 + n}`, name: String(b.name), category: String(b.category), price: Number(b.price), stock: Math.max(0, Number(b.stock) || 0), reorderLevel: Number(b.reorderLevel) || 15 };
  db.products.push(p); log(s.tenantId, s.name, `added product ${p.name}`);
  return json(p, 201);
}
